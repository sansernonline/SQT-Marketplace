---
name: chat-prompt-workflows
description: Use for a multi-step prompt to paste into a chat app
---

# chat-prompt-workflows — multi-step Loop · Graph · Dynamic prompts the user can copy straight into a chat

Part of the `superuser` plugin. Follow `human-writing` for wording. Templates are in [`templates/loop.md`](templates/loop.md) · [`templates/graph.md`](templates/graph.md) · [`templates/dynamic.md`](templates/dynamic.md). The user writes no code. They fill in the `{{...}}` slots and paste.

> **One rule:** every prompt you hand the user has check criteria that can be proved from data the user pastes themselves, and 3 stop conditions. A checker with no real material to compare against often turns right answers into wrong ones, and a loop with no ceiling never ends.

## Use when

- The user wants a prompt to paste into Claude · ChatGPT · Gemini so the AI works in several steps, checks its own work, splits the work and merges it, or adjusts the plan midway
- Words the user types: "prompt หลายขั้น" · "ให้ AI ตรวจงานตัวเองจนผ่าน" · "workflow ในแชต" · "loop graph dynamic" · "แม่แบบ prompt" · "self-check prompt"
- Teaching, or writing teaching material, about AI workflows for people who do not write code

Do not use when: a one-shot question with no check criteria (a plain prompt is enough) · a team of agents in Claude Code splits the work among themselves · a system where code calls the model

## Use something else instead, or alongside

| Situation | Use |
|---|---|
| A team lead in Claude Code plans work for subagents (the agent-team versions of Loop · Graph · Dynamic have files and a fresh reviewer) | `agent-patterns` |
| Writing code that calls a Large Language Model (LLM) · structured output · RAG · eval | `llm-engineering` in `software-development` |
| Splitting work so several agents really run at once in Claude Code | `parallel-split-and-merge` |
| Wording of the answers and of the check criteria | `human-writing` (use together) |

## 1 · Choose the pattern with 2 questions

1. **Do you know the path from the start?** — the order of work is fixed, and you do not expect the data or requirements to change midway · if you do not know → **Dynamic**
2. **Can it split into independent pieces?** — the work breaks into 2–4 pieces that can be done without waiting for each other · yes → **Graph** · no (a single piece of output) → **Loop**

| Pattern | Order of work | Example task |
|---|---|---|
| Loop | Fixed: do → check → fix again | 1 job ad that must pass 5 criteria |
| Graph | Drawn once at the start, split then merge | A new-hire handbook of 3 chapters that use the same terms and numbers |
| Dynamic | Adjusted along the way, the plan has version numbers | A party plan where the budget or head count may change |

If you cannot answer either question, start with Loop because it is the simplest. Graph and Dynamic already end with the same check step as Loop.

## 2 · Loop — do → check → fix

- **Use when** there is a single piece of output (email · announcement · summary · post) with clear check criteria
- **Do not use when** the criteria are feelings ("interesting" · "looks good") or a reasoning question with no data to compare against, because the checker will say it is fine or turn a right answer into a wrong one → ask the user to bring real data and paste it first, or let a person decide
- **Slots to fill** the task · source data · check criteria C1–Cn
- **3 stop conditions** all pass · 3 rounds reached · the same criterion fails 2 rounds in a row with no improvement (rounds 1–2 give the most, later rounds give much less)
- **The checker must quote evidence** every item quotes text from the output or the source data · no evidence found counts as fail · for a criterion that needs the web or running a program that the chat cannot do, answer "ตรวจไม่ได้" (cannot check), not "ผ่าน"
- **The fix round touches only the items that failed.** Do not touch what already passed. If you must touch it, re-check that item.

## 3 · Graph — split, do, then merge

- **Use when** the whole task splits into 2–4 pieces that are known in advance and need not wait for each other
- **Do not use when** the pieces depend heavily on each other or need back-and-forth → a single Loop is better · more than 4 pieces in one chat → the chat starts to forget the beginning, so split into separate chats
- **Slots to fill** the task · source data · check criteria for the merged output · the flow chart (piece · what it does · which piece it waits for · what it sends out)
- **The first piece agrees a shared data format** (data contract: the names, headings and numbers every piece uses), and every piece returns the same shape: status (`เสร็จ` · `ติด`) · result · assumptions · without this, pieces call the same thing by different names and the merge breaks
- **When the requirements contradict each other**, split off a conflict piece (N1b) that records both sides with the original text and picks no side, tag it `(รอยืนยัน)` (awaiting confirmation), and the merge step must wait for this piece
- **The merge step** takes only pieces that are `เสร็จ` · when results conflict, trust the source data · check with the Loop criteria

## 4 · Dynamic — plan → do one task at a time → assess the plan

- **Use when** facts or requirements may change midway, or you only learn what extra work is needed after starting
- **Do not use when** the path is clear from the start → Loop or Graph is easier to predict · never create a v2 just to show off
- **Slots to fill** the task · source data · the done criteria · new information (put "ไม่มี" (none) in the first round)
- **Adjust the plan for only 3 reasons:** the result of finished work reveals work the plan lacks · one task cannot be done as planned · new information changes the requirements
- **Every new version writes 4 fields:** reason · what changed · what it affects · what can be reused (work that is finished and unaffected must not be redone) · adjust at most 3 times
- **Progress log of 5 questions** after every finished task, the assessor answers: is it done · is it repeating · is it moving forward · who or which task continues · what to order · repeating or not moving forward for 2 rounds in a row counts as the reason "cannot be done as planned"
- **When new information arrives midway**, paste block 2 of `templates/dynamic.md` into the same chat: keep the old results → check the old results against the new requirements → redo only the tasks that fail

## 5 · Limits of a chat — tell the user every time

1. **A role in a single chat is not a truly independent checker.** The maker and the checker are the same model in the same conversation, and it sees only what it meant to do. The word "ผ่าน" in a chat is information for a person to look at, not a certification. For work others will use, open a new chat and paste the independent-check prompt at the end of `templates/loop.md` (or switch to another vendor), or have a person check against the criteria table.
2. **A Graph in a single chat does not truly run in parallel.** The model does one piece at a time and later pieces see earlier ones. To really separate them, open one chat per piece, following the section at the end of `templates/graph.md`.
3. **The checker can compare only against the real material a person pasted**, which means the criteria and the source data. For facts that were not pasted (prices · law · names of people), the checker cannot know if they are right. Tag them `(รอยืนยัน)` and let a person check.
4. **A long chat starts to forget the beginning.** After 3 rounds or 4 pieces, ask for a status summary, then start a new chat with that summary.
5. Do not paste secret or personal data (ID card numbers · individual salaries) into the chat. Use made-up values or `(รอยืนยัน)` instead.

## 6 · Hand the work to the user

1. Say which pattern you chose, with a 1-line reason from the 2 questions in section 1.
2. Send the filled-in prompt in one block that can be copied whole. Copy the structure from the template and do not write a new structure yourself.
3. For criteria the user did not give, draft them as items that can be counted or found, and say they are criteria you set that can be changed. For unknown facts (names · numbers · dates), leave a `{{...}}` slot and do not guess.
4. Close with how to check independently (limit 1) in 1–2 lines. Do not explain the theory at length.

## A real example

**Task:** "ร้านเบเกอรี่อยากให้ ChatGPT เขียนคำบรรยายเค้กกล้วยหอมลงเพจ ไม่เกิน 80 คำ ต้องมีราคา 85 บาท สั่งล่วงหน้า 1 วัน และไม่อ้างว่าไม่มีน้ำตาล เพราะมีน้ำตาล" (a bakery wants ChatGPT to write a banana cake description for its page: at most 80 words, must show the price 85 baht and 1 day advance order, and must not claim it is sugar-free because it has sugar)

**What was done:** question 1: the path is known · question 2: a single piece of output → Loop · filled in `templates/loop.md`:
- Task: 1 post describing the banana cake, at most 80 words
- Source data: price 85 baht · order 1 day ahead · ingredients include brown sugar
- C1 at most 80 words (the checker counts and states the number) · C2 the price and advance-order condition match the source data (quote the text) · C3 does not contain the words "ไม่มีน้ำตาล" "ไร้น้ำตาล" "หวานน้อยเพื่อสุขภาพ"

**Result (what is sent to the user):** first line "ใช้ Loop เพราะเป็นโพสต์ชิ้นเดียวที่มีเกณฑ์ชัด" → 1 block of the filled-in prompt (stop conditions: all pass · 3 rounds · the same item fails 2 rounds in a row) → last 2 lines: "C3 เป็นเกณฑ์ที่ตั้งให้ แก้ได้ · ก่อนโพสต์ เปิดแชตใหม่วาง prompt ตรวจอิสระพร้อมเกณฑ์และข้อมูลต้นทางชุดเดิม" · it does not write that the cake is "ดีต่อสุขภาพ" (good for health) on the shop's behalf, because that is not in the source data

## Check before sending

1. The pattern is chosen with the 2 questions and the reason is stated.
2. The prompt has everything: source data · criteria that can be proved · the checker quotes evidence and counts not-found as fail · 3 stop conditions · no invented facts, with `(รอยืนยัน)` used instead.
3. Graph has the shared-data-format piece and the conflict-piece rule · Dynamic has the 3 reasons, 4 fields, the ceiling of 3 and the 5-question progress log.
4. The chat limits and the independent check in a new chat have been told.
5. No emoji · no guessing of the user's facts.

## Sources

- The Loop · Graph · Dynamic templates and the work-check sheet from the AI Workflow course (CWN2026) of the repo owner · shortened and adapted to the team's terms · read 2026-10-26
- Team rules the templates match: `agent-patterns` and [`pattern-details`](../agent-patterns/references/pattern-details.md) section 1 plan adjustment · 3 Reflection · 4 Multi-Agent
- [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (start from the simplest pattern · evaluator-optimizer · round ceiling) · opened 2026-10-26
- [Huang et al. · LLMs Cannot Self-Correct Reasoning Yet (ICLR 2024)](https://arxiv.org/abs/2310.01798) (self-correcting with no real material to compare against gets worse) · opened 2026-10-26
- [Madaan et al. · Self-Refine](https://arxiv.org/abs/2303.17651) (the first rounds give the most · the checker often answers "fine" on math items) · opened 2026-10-26
- [Google ADK · Loop agents](https://adk.dev/agents/workflow-agents/loop-agents/) (a loop needs its own round ceiling) · opened 2026-10-26
- [Claude Code docs · Dynamic workflows](https://code.claude.com/docs/en/workflows) (stop when 2 rounds in a row make no progress) · opened 2026-10-26
- [Microsoft Research · Magentic-One](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/) and [AutoGen · Magentic-One](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html) (progress ledger: is it done · is it repeating · is it moving forward · who continues · what to order) · opened 2026-10-26
- [Kim et al. · LLMCompiler](https://arxiv.org/abs/2312.04511) (a flow chart where pieces partly depend on each other) · opened 2026-10-26
