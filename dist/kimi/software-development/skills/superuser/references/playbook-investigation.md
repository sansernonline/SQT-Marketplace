# playbook · investigation — answer a question, read-only

Use when: "How does X work" · "Why is it done this way" · "Where should this go" · "Are you sure that..."
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/legacy-reverse.md`](../../dev-principles/references/legacy-reverse.md) · [`references/operations.md`](../../dev-principles/references/operations.md)
Output: an answer that cites real files and lines · **no code edits**
Main skills: `diagrams` · `context-budget` · `legacy-spec-recovery` (old system with no spec) · `reverse-engineering` (app or binary with no source) · `reference-app-research` (how another product works) · `security-operations` (attack or incident questions)

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle file that fits the question first (see Main principles). Rewrite the question as one sentence that can be answered yes or no, or that points to a place · ใคร: หัวหน้าทีม
2. Judge the size — if more than 3 files must be opened, send a `system-analyst` agent to search, told to read only ("do not write or edit files"), and take back only a summary and file locations (`context-budget`) · ใคร: `system-analyst` ตัวใหม่ (up to 3 files: หัวหน้าทีม)
3. Trace from the entry point (route · command · screen) to the data that is read or written, and note the path as an ordered list of file:line · ใคร: `system-analyst` ตัวใหม่ (`งานเล็ก` (small job): หัวหน้าทีม)
4. Ask "why" and trace evidence from every reachable source. If they can run in parallel, send one subagent per source: `git log -p -n 20 -- <ไฟล์> | head -200` · `git blame -w -L <เริ่ม>,<จบ> <ไฟล์>` · commit messages · discussion in the PR (`gh pr view <n> --comments | head -100`) · issues the commit refers to · ADRs in `docs/decisions/` · documents in `docs/` · connected connectors (issue tracker · team chat · wiki). Each returns at most 10 lines with its source. Then order the answers by weight of evidence. If there is no evidence, write `ไม่พบหลักฐาน` (no evidence found) and do not guess a reason · ใคร: `Explore` ตัวใหม่ one per source
5. For any claim that can be proven by running it (a value · time taken · order of events), run it; do not infer from reading. Do not edit files in the project (anything that needs a file written runs in a copy under `_to_delete/`) · ใคร: `developer` ตัวใหม่
6. **If the user asks to be taught, or says they do not understand yet**, explain in layers, starting from what they already know. Use 1 picture per layer (`diagrams`), each picture adding at most 2 new things. Tie "how it works" and "why it is done this way" from step 4 together, then close with 1 real example path through every layer · ใคร: หัวหน้าทีม
7. Draft the answer — start with a 1-sentence answer, then the path, file:line, and a label `ตรวจจริง` (verified) / `จากแหล่ง` (from a source) / `อนุมาน` (inferred) / `ยังไม่ได้ตรวจ` (not yet checked) on every claim. If a picture helps, use `diagrams` · ใคร: หัวหน้าทีม
8. Check (ตรวจ) the answer — every claim points to a real file:line or run result, the labels match the evidence, and the 1-sentence answer answers the question in step 1 (ตัดสินผลตาม [`references/legacy-reverse.md`](../../dev-principles/references/legacy-reverse.md) · [`references/operations.md`](../../dev-principles/references/operations.md)) · ใคร: `reviewer` ตัวใหม่
9. Deliver the answer after confirming the findings `reviewer` found on its own (fail (`ไม่ผ่าน`) → fix, then repeat per the review rounds in [`team-roles`](team-roles.md)) · ใคร: หัวหน้าทีม

## Done when

- Every claim has a file:line or a run result attached
- No file in the project was edited
