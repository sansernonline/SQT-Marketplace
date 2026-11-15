---
name: parallel-split-and-merge
description: Use when work splits into independent slices to fan out
---

# parallel-split-and-merge — split the work, run it in parallel, merge into one report
> Use together with: `principle-build-a-tool-not-handwork` (write a script for repeated work) · `principle-small-verifiable-steps` (cut into small, checkable pieces)

> Differs from `parallel-attempts-pick-best` in that each worker does a **different piece**, not a race on the same piece.

From pstack's `swarm`.

## Steps

0a. **Get the overall picture before splitting** — scan cheaply with one script run (manifest · structure · size in lines · who refers to whom), then fill in a table of piece · type · thickness before deciding how to split. Give thick pieces a high enough model level; give thin pieces or mechanical merge work to `haiku` for the most work per token. Full method and table in `superuser` → `references/team-roles.md` "แบ่งงาน" (splitting work) item 0. The `model` + `effort` level per piece follows the ladder in `superuser` section 5.
0b. **Lay the shared things down before splitting** — storyline · data shape · template · shared files (such as a report outline · columns of the product table · a code interface). The main session does this alone. A small piece (under 1 page) need not be split off; the main session does it faster itself. Every worker's brief uses the same form per `superuser` → `references/team-roles.md` "แบ่งงาน".
1. **Split with no overlap** — write a split table `| ชิ้น | ขอบเขต (บท · หมวดสินค้า · คำถามวิจัย · ไฟล์) | worker |` (piece | scope (chapter · product category · research question · file) | worker). Every part of the work sits in exactly one piece, none repeated, none dropped. With the planner, give a `scope` (the full list of scopes) and `covers` per piece; the script flags items that are dropped or repeated.
2. **The same report format from every worker** — fix the fields to send back, such as `| สิ่งที่พบ | ที่มา (หน้า · ลิงก์ · ไฟล์:บรรทัด) | ความรุนแรง | หลักฐาน |` (finding | source (page · link · file:line) | severity | evidence), so they merge without interpretation.
3. **Never write to the same place** — read-only work can be released at once. For work that creates or edits files, give each worker its own file or folder (code work uses one git worktree per worker → see the last section). The combined summary file is written by the main session alone.
4. **Piece size and number of workers** — each piece no bigger than what a subagent finishes in one round (about 5 modules · 10 screens · 5 short chapters). The number of workers equals the number of pieces that can run at once, not more than the budget can take. Pieces that must wait for each other are released by rank (`superuser` → `references/team-roles.md` "แบ่งงาน" items 4–6). More than 8 at once → see the section "dynamic workflow" below.
5. **Release every worker in one message**, in the background, passing file locations instead of content, and pick the agent by the job (`reviewer` checks · `general-purpose` does or fixes · `brainstormer` thinks up options · if a plugin with a specialist agent such as `developer` is installed, use it). Workers doing the same kind of work use the same agent type + model + effort (the system prompt may share a cache, but this is not guaranteed).
   The message to each worker uses the same form for every brief, differing only in the fields (the 5-item brief of `superuser`, cut down to fit split work):

   ```
   ชิ้น: <ชื่อชิ้นจากตารางแบ่งงาน> — ส่วนหนึ่งของ <งานใหญ่>
   อ่าน: <path ของกลาง> · <path ที่เกี่ยวกับชิ้นนี้เท่านั้น>   เขียนได้: <ไฟล์หรือโฟลเดอร์ของชิ้นนี้> · ห้ามแตะ: <ของกลาง · ชิ้นอื่น>
   ผลิต: <ชื่อ · รูป · signature ที่ชิ้นอื่นจะใช้ ตรงตัว>   ใช้: <ของที่รับจากชิ้นอื่น รูปเดียวกัน คัดจากตารางความขัดแย้ง>
   เสร็จเมื่อ: <สิ่งที่ตรวจได้ 1–3 ข้อ>   กติกาเดียวกัน: <skill หรือแม่แบบที่ทุกชิ้นต้องตาม>   ข้อจำกัดทั้งงาน: <คัดจาก docs/BRIEF.md>
   ส่งกลับ: ตามรูปแบบข้อ 2 ไม่เกิน 40 บรรทัด · บรรทัดแรกบอกผล เสร็จ · เสร็จ มีข้อกังวล · ขาดบริบท · ติด
   ```
6. **Wait for all** — never conclude from the ones that finished first. If a worker fails, release a new one to redo it once; if it fails again, record that the piece was not checked.
7. **Merge** — drop repeats, then group things that are the same issue (several reports that differ slightly often point to one higher root cause) and confirm the serious items yourself before reporting. It passes when every serious item has a `file:line` (or page · link) that the main session opened.
   - **Referee** — for work split by module where each worker reports a list (rule extraction · defect finding · survey), send a fresh agent to check that every item has a `file:line` that was opened and really matches. Items with no reference, or a reference that does not match, are dropped by the main session before merging, not repaired (applies to every piece reported as findings, including transcript analysis split into viewpoints).
   - **High-stakes items go through 2 judges** — for an item that does a lot of damage if wrong, send 2 fresh judges independent of each other; keep it only if both agree. If they disagree → the main session opens that spot and decides.
   - **Estimate the number of agents and tokens before releasing** — number of pieces × size per piece (item 4). Tell the user in the opening question when the total passes about 12 pieces; below that threshold just release and repeat it yourself. Any item not yet opened gets the label `(ยังไม่ยืนยัน)` (not yet confirmed) in the report.
8. **One report** — a 1-paragraph summary · a combined table · pieces not checked (if any) · `status-report`

## planner — works out rank, critical path and number of workers for you

For a graph of about 5 pieces or more, or with pieces that wait on each other through several steps, write a `plan.json` and run `node scripts/plan.mjs plan.json` (uses no tokens · no outside library). A smaller graph can be worked out in the table yourself.

```json
{ "name": "เพิ่มระบบสมาชิก", "max_agents": 6, "tasks": [
  { "id": "a", "title": "ออกแบบตาราง", "size": 20, "owns": ["db/schema.sql"], "step": "design" },
  { "id": "b", "title": "API", "size": 30, "needs": ["a"], "step": "code" },
  { "id": "d", "title": "ทดสอบรวม", "size": 15, "needs": ["b"], "solo": true, "step": "test" } ] }
```

- `size` = total tokens, roughly, in thousands · `scope` (plan level, optional) = the full list of scopes, such as `["บท 1", "บท 2"]` · `covers` = items from `scope` that this piece takes · `needs` = pieces that must finish first · `owns` = files this piece owns · `solo` = done by one worker alone · `step` uses the same step names as `model-scorecard` (plan · research · design · write · code · test · review · other); any other name gets k = 1 with no warning · used to pull the k value from the log (`--log`, default `.claude/superuser/log`) · `max_agents` or `--agents N` = the cap from the budget
- **Checked before computing:** tasks empty or not a list · needs or owns not a list · size not greater than 0 · cyclic graph · waiting on a piece that does not exist · duplicate id · 2 pieces own the same file but do not wait on each other · with a `scope`, any item that is in no piece's `covers`, in several, or a `covers` that names an item not in `scope` → exits with code 1 with the list to fix
- **Output:** a `คาด:` (estimate) line · critical path · total work · minimum time · release-order table (rank · slack by the CPM method (critical path method) computed as if workers were unlimited · worker number · start → end · timeline) · `--json` for machines · if parallelism speeds things up by less than 1.3 times, the script recommends a single worker (self-set value, not measured)
- **The lab format and the deep research queue work as they are:** `research/<งาน>/queue.json` can go to the planner directly · the file may be an empty array · `depends_on` = `needs` · `exclusive` = `solo` · `size` may be the labels `S` `M` `L` (default 20k · 50k · 100k are self-set values, not measured; change with the field `"sizes": { "S": 30 }`, and the k value from the log adjusts further)
- **Pictures:** `--mermaid` prints a flowchart of the DAG (directed acyclic graph) to paste into markdown (GitHub shows it as a picture · thick orange line = critical path) · `--html <file.html>` writes one page with an SVG of the DAG and a Gantt of the plan; open it in a browser, nothing to install; for a PNG, capture the page.
- **Compare with the real work:** `--actual` reads `runs.jsonl` in superuser's log and ties worker tasks to plan pieces by a **task description that starts with the piece's id** (the description field of the Agent tool, such as `a: ออกแบบตาราง`). You get a table of who ran which model, when it started and how many minutes it took, real tokens against the estimate, check results, pieces not yet released, and pieces that used more than 1.5 times the estimated tokens. Add it with `--html` for one more picture, a Gantt of what really happened.
- **The length of the critical path sets the time, not the number of pieces.** Example from `02_DAG_Planner` of the course (a calculation tool, not measured on real work): 2 briefs with the same 22 pieces gave 131 minutes and 194 minutes because their critical paths differ. When the critical path is the limit, adding workers does not help; cut dependencies (such as testing with text instead of voice) and move the deploy layer off the critical path.
- A full example of all 3 steps with files and pictures: [`docs/examples/planner`](https://github.com/sansernonline/SQT-Marketplace/tree/main/docs/examples/planner) · `--now <ISO time>` fixes the time used when computing quota so the example gives the same result every time.
- Test: `node scripts/plan.mjs --self-test` · idea from labs `02_DAG_Planner` and `04_Multi_Agent_Orchestra` of the CWN2026 course, rewritten, no code copied.

## Multiple LLM accounts · event-driven orchestrator · running workers with `claude -p`

If several Claude Code or Codex sessions run under different accounts, the main session must run many workers over a long time, or you run workers with `claude -p`, read [references/multi-account-and-orchestrator.md](references/multi-account-and-orchestrator.md) (hand out work across accounts by quota · orchestrator event table · cautions for `claude -p`).

## dynamic workflow — more than 8 pieces at once, or repeated file-by-file work

This section is about Claude Code's workflow script (a script that commands many subagents), which is a different thing from the Dynamic pattern that adjusts the plan along the way (`agent-patterns` section 1).

Use when: checking every file in a folder against one criterion · converting or moving tens to hundreds of files · looping fixes until the checker passes, or 2 rounds in a row make no progress · searching again until a new round finds nothing more · research that must compare sources (`/deep-research`)

- Claude writes a script that commands many subagents and runs it in the background. Intermediate results stay in the script's variables → the lead's context keeps only the final answer. You can stop and resume in the same session.
- **Start only when the user asks** — the request contains the word `ultracode` or "use a workflow", or the user turned on `/effort ultracode`. On the Pro plan, Dynamic workflows must be turned on in `/config` first → the lead offers it in the opening question and does not start on its own. For unattended runs (`claude -p`), the word `ultracode` in the prompt does not start a workflow. If the user declines → split into rounds of no more than 8 workers per the steps above.
- Up to 16 at once (a machine with fewer Central Processing Unit (CPU) cores gets fewer) · at most 1,000 workers per run · a `Large workflow` warning appears above 25 agents or when more than 1.5 million tokens are expected · it uses more tokens than doing it in the conversation and draws on the same quota → try a small piece first (one folder), then expand.
- For work that edits files, tell each piece to work in its own separate copy (for code work see the next section).
- The rules on this page still all apply: shared things before splitting · split table · one report format · confirm serious items yourself · a fresh `reviewer` checks the merged result.
- Source: [Claude Code: dynamic workflows](https://code.claude.com/docs/en/workflows) (checked 21 Oct 2026)

## A separate workspace per worker (code work)

Code work → addition in plugin `software-development` → `superuser` → `references/code-extensions.md`

## Do not

| Do not | Because |
|---|---|
| Release workers with no split table | Some work is done twice, some is dropped, and no one knows |
| Pass a worker's report on as it is | The main session is responsible for the merged result and must read and confirm it itself |
| Let several workers edit the same file | Results collide and vanish silently |

## Sources

Overall picture before splitting: lesson from this project 2026-11-10 (not from outside) · produces/consumes exactly and whole-job limits: superpowers (MIT) · `skills/writing-plans` · referee, 2 judges and estimating the number of agents: code-modernization (LICENSE exists, type not yet identified) · `commands/modernize-extract-rules.md` · seen 2026-11-10
