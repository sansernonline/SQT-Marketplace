
# agent-patterns — 6 working patterns for an agent team

The team lead chooses at planning time · the steps and traps are in [`pattern-details`](references/pattern-details.md)

| Pattern | How it works | Time | Use when | Skip when |
|---|---|---|---|---|
| **Planning** | A plan where every item has a `เสร็จเมื่อ` (done when) line → do them one at a time · if the plan is wrong → fix the plan and note it | +1 step at the start | more than 3 steps · the user is not watching | a single question · a single-spot fix |
| **ReAct** | think → do 1 thing → read the real result · broken 2 rounds → split into smaller steps or change method · 3 rounds → `ติด` | 1 round per action · call independent tools in one message to cut rounds | every step that really acts | — always use it |
| **Reflection** | A **new** `reviewer` (or a specialist reviewer) at the same level as the doer or higher checks against the criteria after the last acting step · the lead confirms before ordering a fix | rounds run in sequence and cannot be parallel → the main time cost · round 2 onward checks only the earlier items + the diff | someone else will use it · a miss causes damage | a draft the user will edit themselves |
| **Multi-Agent** | 1 piece per agent, hand off through files · never write the same file | pieces that do not wait on each other ≈ the longest piece · pieces that wait on each other add up in a chain | several skills needed · the work splits into pieces | one agent can finish it |
| **MoA** (Mixture-of-Agents) | 3 agents (for example `brainstormer`) take the same problem from different angles → a new agent merges · 3–5 times the effort | ≈ 2 rounds (3 at once + merge) when sent in one message | a wrong choice is costly · you need conflicting angles | one answer that can be verified |
| **Reranker** | collect 10–30 items → score them → read the top 3–5 in full | scoring can run in parallel + 1 round of reading | too much to read it all | no more than 3 items |

**Usual recipe:** Planning → ReAct → Reflection before sending · big job + Multi-Agent · an important path + MoA · lots of data + Reranker · more than 8 pieces at once, or repeated work file by file → a Claude Code workflow script (the user starts it · [`crew-patterns/parallel-split-and-merge`](../parallel-split-and-merge/guide.md) section on dynamic workflow · not the same thing as the Dynamic style in the table below)

**3 workflow styles, chosen by who sets the order of work and when** (names follow a popular course · full mechanics in [`pattern-details`](references/pattern-details.md))

| Style | Order of work | Use when | Ours is |
|---|---|---|---|
| **Loop** | fixed: do → check → fix again | a single piece of work with a clear check criterion | ReAct + Reflection · the checker must compare against the real thing (test · file · source) and stop when the same items do not improve for 2 rounds (section 3) |
| **Graph** | drawn once at the start (a Directed Acyclic Graph (DAG) of the whole job): sub-jobs depend on each other in order, split apart then merge | the job breaks into independent pieces and you know the route from the start | Multi-Agent + `crew-patterns/parallel-split-and-merge` · agree the data shape before splitting · conflicting requirements go to a piece that holds the conflicts (section 4) · every piece has a size, a rank, and a file owner · the number of team members comes from the width of the graph, and high-rank pieces are released first (`superuser` → `references/team-roles.md` "แบ่งงาน", split the work) |
| **Dynamic** | adjusts along the way: plan → do one piece at a time → judge whether the plan still holds | facts or requirements change mid-job | Planning with plan adjustment: the plan has a version number · adjust only for one of 3 causes · at most 3 times (section 1) |

**The lead picks the style, without asking the user.** The user needs to say only "fix this bug" or "add this feature." If the user names a style, follow it. If not, choose from this table and write the chosen style at the end of the **เสร็จเมื่อ** (done when) line.

| Request | Default style | Change when |
|---|---|---|
| Fix a reproducible bug | Loop: write a failing test first → fix → run until it passes | it cannot be reproduced, or the cause spans several parts: switch to Dynamic, because each round of findings changes the plan |
| Add a feature one agent can finish, even if it touches several layers (add a form field · add 1 endpoint) | Loop per requirement (`spec-to-code-loop`) | — |
| Add a feature whose parts are each big enough to be their own job and share no files (a new table · a set of APIs · a settings page) | Graph: agree the data shape first, then split, then merge · each piece is a Loop inside | the pieces need many small decisions to match: do one piece at a time with one agent |
| Several jobs in one request (fix a bug + add a feature) | Graph: 1 piece per job · pieces that touch the same file run one after another, not at once | — |
| Hunting a cause · migrating a system · broad research · a vague problem | Dynamic | — |
| Fits none | Loop, because it is the simplest | — |

A small job (a single-spot fix · writing one file such as a README) needs no style named · you may change style midway, but only for a reason found in real results, and note 1 row per `decision-desk/decision-log`

This table is how our own agent team works. If a customer will build an agent system into a product (choosing a framework · checkpoints · human approval · evals) → `ai-engineering` of software-development (`references/agent-systems.md`) together with `ai-engineering` and `async-messaging`. To use these 3 styles through chat without writing code → [`chat-prompt-workflows`](../../../chat-prompt-workflows/SKILL.md)

**Do not turn on agent teams by default** — use subagents instead, because agent teams are still experimental and off · they use far more tokens (about 7 times when a teammate is in plan mode) · once on, a named subagent becomes a teammate by itself · an in-process teammate (the default) cannot send background subagents · teammates talk among themselves, which breaks the principle that everything goes through the team lead · the exception is when the user has already turned them on and the job is debugging with several hypotheses that need debate to knock down theories · ([Claude Code: agent teams](https://code.claude.com/docs/en/agent-teams) · checked 21 Oct 2026 (B.E. 2569))

**Conclusions that must be proved one by one** → a ledger of `PROVED · REFUTED · OPEN` + `scripts/ledger.mjs` (prints the next step · check at least 2 rounds before closing an item) · waiting long on team members → `scripts/keep-waiting.mjs` · how to use them is in [`pattern-details`](references/pattern-details.md) section 7 · fix rounds that move people by round → section 3 item 7

**Say in the report** only what changes a decision, for example `Reranker (คัด 24 → 4 แหล่ง)` (Reranker, narrowed 24 → 4 sources)
