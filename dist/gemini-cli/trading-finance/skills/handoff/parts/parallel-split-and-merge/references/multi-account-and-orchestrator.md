# Multiple LLM accounts · event-driven orchestrator · `claude -p`

## Multiple LLM accounts — hand out work across accounts by quota

Use this when several Claude Code or Codex sessions run under different accounts (each in its own worktree per `team-files`). A subagent always uses the same account as its caller, so splitting work across accounts means splitting it between sessions. The idea comes from KC-QUEST in lab `03_KC_QUEST` of the CWN2026 course; rewritten, no code copied.

1. **Name the accounts:** run each account with its own `CLAUDE_CONFIG_DIR` (or `CODEX_HOME`). The account name is that folder's name (if unset, `.claude` or `.codex`), or set `SQT_ACCOUNT` yourself. Names in `accounts.json` must match this name, otherwise that account always gets a full bucket of quota. The hook records the account name on every team task.
2. **Give the bucket sizes:** copy `superuser/templates/accounts.json` to `~/.claude/superuser/accounts.json` and edit `cap_k` (full-bucket quota, roughly, in k tokens) · `speed_k_per_hour` · `max_parallel` · `window_hours`. Values in the template are examples, not measured. Also set `week_cap_k` (weekly bucket, in k tokens): the splitter and the hook use the smaller of the 2 buckets and refill the 5-hour bucket no more than the week has left. If not set, the weekly cycle is counted as a % of the 5-hour bucket as before. Values in the template are examples, not measured.
3. **Read the remaining quota (local read only, never touch credentials):**
   - Claude: set each account's status line to call `node <plugin>/skills/handoff/parts/parallel-split-and-merge/scripts/quota.mjs record`. Claude Code passes the fields `rate_limits.five_hour` and `seven_day` (`used_percentage` · `resets_at`) to the status line only on Pro/Max plans and after the first response of a session ([status line](https://code.claude.com/docs/en/statusline) · checked 2026-10-27). The script writes to `~/.claude/superuser/quota/<account>.json`.
   - Codex: read `rate_limits` from the `token_count` event in session files under `$CODEX_HOME/sessions` (checked against real local files 2026-10-27 · no doc page, format may change).
   - Merge into one file: `node quota.mjs snapshot --out quota.json`. Never use an endpoint that needs an account's OAuth token pulled out to call the API yourself, because it risks breaking the terms of use.
4. **First hand-out (① rank ② filter ③ score ④ pick then reserve):** `node scripts/plan.mjs plan.json --accounts ~/.claude/superuser/accounts.json --quota quota.json --html plan.html`. Ready pieces are sorted by rank. ② Drop accounts that break a hard rule first (slots full · remaining quota less than size × `safety` · `tool` does not match the piece's `tool` field). ③ Score = 0.4U + 0.2F + 0.15R + 0.15V − 0.1L (U = 24/(24 + hours before reset) · F fits the bucket · R bucket is empty · V fast account takes a critical piece · L backlog · weights can be changed in the `weights` field). ④ Reserve quota at once so the next piece in the same round sees what is really left. If no account can take a piece, it waits for the reset.
5. **During the work (⑤ forecast and move ⑥ learn ✦ pass the baton):** `node scripts/plan.mjs plan.json --accounts … --quota quota.json --actual`. ⑤ An account whose remaining quota is not enough for its backlog × `safety` appears in a "should move" list with a target account. ✦ Pass the baton with a `handoff` sheet (how far it got · what was committed · where to continue) and open the continuing work on the new account, not start over. ⑥ Actual speed per account as an EMA (exponential moving average), used to correct `speed_k_per_hour`.
- The weights and formula are the course's values, not yet measured on our work. With the starting weights, F scores a small, snug bucket high, so a critical piece may get a slower account when the fast account has a large bucket. To let speed win, raise the weight V. If quota data is older than 1 cycle, the `--actual` table warns you to read it again. With no accounts file, the planner works in single-account mode as before.

## Orchestrator that loops on events (example from `04_Multi_Agent_Orchestra` of the CWN2026 course)

Use this when the main session must run many workers over a long time across several accounts. Checked against `ORCHESTRA_RECIPE.md` and `tools/orch.py` (orch.py has every event in the table and the 4-round cap; the rule after the table is only in the recipe).

| event | what the orchestrator does |
|---|---|
| `DONE` · `HANDOFF` · `LIMIT_HANDOFF` (quota ran out mid-task, hand to another account) · `MERGE_CONFLICT` · `INCOMPLETE` (did not finish, let it continue) | Report to the user briefly, then keep looping |
| `FAILED` (tried all 4 rounds) | Analyse, fix the prompt or re-split the work, then release it once more |
| `ORCH_LOW` (the orchestrator's own account is low) | Write the status and what is left to do into `NOTES.md`, then stop |

- The orchestrator does not write code itself (except very small fixes) and hands out work only through brief files. Its memory is `NOTES.md` + `BOARD.md` so the next orchestrator can read on from there. Let the account with the most quota left be the orchestrator.
- The recipe tells workers (this is not code in orch.py): queue or database names that are shared must not collide between tasks tested at the same time (give each task a prefix such as `MQ_PREFIX=<id>_`) · the working folder is outside the Windows bind mount (several `node_modules` sets are very slow) · lock the `@playwright/test` version to match the Chromium the image has at `/ms-playwright`.

## Run workers with `claude -p` and read the result

- Pass `< /dev/null` and `--no-session-persistence` on every call · put the prompt before flags that take many values (`--allowedTools` `--add-dir` `--mcp-config`), otherwise the flag swallows the prompt · exit 0 does not mean success, read `is_error` in the JSON result · source: skill `yolo` in the course folder `00_resource/Remote` (tested by the instructor).
- Pass the path of the data and tell the worker to compute it itself (item 5 under the "ขั้นตอน" (steps) heading of SKILL.md) · the one example from the course: stuffing the data into the prompt was 4 times slower and once gave a wrong answer.
- Several workers using Playwright MCP must not share one server (they get the same browser and tabs, and identical inline configs are merged into one process) · give 1 explorer per browser · cited from an issue document the instructor kept, not yet tried ourselves.
- Measure the peak number running at once from the log and report what the log shows, not what was ordered · the one example (lab1 of the course): ordered 8, peak was 6, because they started one at a time about 15 seconds apart and the small modules finished before the last ones started.
