
# parallel-split-and-merge — split the work, run it in parallel, merge into one report

## Use when
- Work divides into independent pieces (chapters · product categories · research questions · modules · files) that different workers can do at the same time.
- Many files need the same check or edit, or a review is split by viewpoint.

Not for: a race where every worker does the same piece → `crew-patterns/parallel-attempts-pick-best` · splitting code work by git worktree → `worktree-and-branch` (software-development) · a small piece under 1 page (the main session does it faster itself).
Use together with `ground-rules/principle-build-a-tool-not-handwork` (script repeated work) and `ground-rules/principle-small-verifiable-steps`.

## Steps
0. **Get the overall picture and lay down shared things before splitting.** Scan cheaply with one script run (manifest · structure · size in lines · who refers to whom) and fill a table of piece · type · thickness. Give thick pieces a high enough model level; give thin or mechanical merge pieces to `haiku`. Method in `superuser` → `references/team-roles.md` "แบ่งงาน" item 0; `model` + `effort` follow the ladder in `superuser` section 5. Then the main session alone writes the shared things: storyline · data shape · template · shared files (report outline · product-table columns · a code interface).
1. **Split with no overlap.** Write `| ชิ้น | ขอบเขต (บท · หมวดสินค้า · คำถามวิจัย · ไฟล์) | worker |`. Every part sits in exactly one piece, none repeated, none dropped. With the planner, give a `scope` and `covers` per piece; the script flags dropped or repeated items.
2. **Fix one report format for every worker**, such as `| สิ่งที่พบ | ที่มา (หน้า · ลิงก์ · ไฟล์:บรรทัด) | ความรุนแรง | หลักฐาน |`, so reports merge without interpretation.
3. **Never write to the same place.** Read-only work can be released at once. For work that edits files, give each worker its own file or folder (code work: one git worktree per worker, see `superuser` → `references/code-extensions.md`). The combined summary file is written by the main session alone.
4. **Size pieces and workers.** Each piece fits what a subagent finishes in one round (about 5 modules · 10 screens · 5 short chapters). Workers = pieces that can run at once, within budget. Pieces that wait on each other are released by rank (`team-roles.md` "แบ่งงาน" items 4–6). If more than 8 at once, see "dynamic workflow" below.
5. **Release every worker in one message**, in the background, passing file locations instead of content. Pick the agent by job (`reviewer` checks · `general-purpose` does or fixes · `brainstormer` options · an installed specialist such as `developer` if it fits). Same kind of work → same agent type + model + effort. Every brief uses the same form:

   ```
   ชิ้น: <ชื่อชิ้นจากตารางแบ่งงาน> — ส่วนหนึ่งของ <งานใหญ่>
   อ่าน: <path ของกลาง> · <path ที่เกี่ยวกับชิ้นนี้เท่านั้น>   เขียนได้: <ไฟล์หรือโฟลเดอร์ของชิ้นนี้> · ห้ามแตะ: <ของกลาง · ชิ้นอื่น>
   ผลิต: <ชื่อ · รูป · signature ที่ชิ้นอื่นจะใช้ ตรงตัว>   ใช้: <ของที่รับจากชิ้นอื่น รูปเดียวกัน คัดจากตารางความขัดแย้ง>
   เสร็จเมื่อ: <สิ่งที่ตรวจได้ 1–3 ข้อ>   กติกาเดียวกัน: <skill หรือแม่แบบที่ทุกชิ้นต้องตาม>   ข้อจำกัดทั้งงาน: <คัดจาก docs/BRIEF.md>
   ส่งกลับ: ตามรูปแบบข้อ 2 ไม่เกิน 40 บรรทัด · บรรทัดแรกบอกผล เสร็จ · เสร็จ มีข้อกังวล · ขาดบริบท · ติด
   ```
6. **Wait for all.** Never conclude from the ones that finished first. If a worker fails, release a new one once; if it fails again, record that the piece was not checked.
7. **Merge.** Drop repeats, group items that are the same issue (slightly different reports often share one root cause), and confirm serious items yourself. It passes when every serious item has a `file:line` (or page · link) that the main session opened.
   - **Referee:** for work split by module where each worker reports a list (rule extraction · defect finding · survey · transcript analysis by viewpoint), send a fresh agent to check that every item has a `file:line` that was opened and matches. The main session drops items with no reference or a mismatch; it does not repair them.
   - **High-stakes items:** send 2 independent fresh judges; keep the item only if both agree. If they disagree, the main session opens that spot and decides.
   - **Estimate agents and tokens before release** (pieces × size per piece). If the total passes about 12 pieces, tell the user in the opening question; below that, just release. Mark any item not yet opened `(ยังไม่ยืนยัน)` in the report.
8. **One report:** a 1-paragraph summary · a combined table · pieces not checked (if any) · `superuser/status-report`.

## planner
For about 5 pieces or more, or pieces that wait on each other through several steps, write `plan.json` (`tasks` with `id` · `title` · `size` in thousands of tokens · `needs` · `owns` · `solo` · `step`; optional `max_agents` and `scope`/`covers`) and run `node scripts/plan.mjs plan.json`. It uses no tokens. A smaller graph can be worked out in the table.
- It exits with code 1 and a list to fix for a cyclic graph, a missing piece, a duplicate id, 2 pieces owning the same file without waiting on each other, or a `scope` item in no piece or in several.
- Output: a `คาด:` line · critical path · total work · minimum time · release-order table. If parallelism speeds things up by less than 1.3 times, it recommends a single worker. The critical path sets the time, not the number of pieces; when it is the limit, cut dependencies instead of adding workers.
- JSON example, all fields, `--json` · `--mermaid` · `--html` · `--actual` · `queue.json` input: [`references/planner.md`](references/planner.md).

## dynamic workflow
Claude Code's workflow script commands many subagents (not the Dynamic pattern of `crew-patterns/agent-patterns`). It fits checking every file against one criterion, converting tens to hundreds of files, looping fixes until a checker passes, or searching until nothing new appears.
- **Start only when the user asks** (the word `ultracode`, "use a workflow", or `/effort ultracode`). The lead offers it in the opening question and never starts on its own. If the user declines, split into rounds of at most 8 workers. All rules above still apply. Limits and source: [`references/dynamic-workflow.md`](references/dynamic-workflow.md).

## Check before done
- [ ] A split table exists and every part of the work is in exactly 1 piece.
- [ ] Every worker used the same report format and the same brief form.
- [ ] No 2 workers write the same file; the summary file was written by the main session.
- [ ] The main session waited for all workers and opened every serious item itself.
- [ ] Failed pieces were redone once or recorded as not checked.

## References
- [`references/planner.md`](references/planner.md) — open when using the planner beyond the basics (all fields, pictures, `--actual`, `queue.json`).
- [`references/dynamic-workflow.md`](references/dynamic-workflow.md) — open when the user asks for a workflow or more than 8 pieces run at once.
- [`references/multi-account-and-orchestrator.md`](references/multi-account-and-orchestrator.md) — open when several sessions run under different accounts, the main session runs many workers over a long time, or workers run with `claude -p`.
- [`references/sources.md`](references/sources.md) — sources.
