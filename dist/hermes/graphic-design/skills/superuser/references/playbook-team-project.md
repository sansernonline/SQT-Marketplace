# playbook · team-project — XL multi-day work with people and agents on the team

Use when: big work that cannot finish in one session · several milestones · real people (teammates) take pieces and work alongside agents · "โปรเจกต์นี้ทำกับทีม" (this project is done with a team) · "งานเป็นเดือน" (month-long work)
Result: `docs/BRIEF.md` + `docs/BUILD-PLAN.md` split into milestones and pieces · a `handoff/<id>.md` note for every piece · work that can be picked up across days without asking
Main patterns: Planning → Multi-Agent → Reflection per milestone (`crew-patterns/agent-patterns`)

**3 roles, never swap them.** The **owner** (the user: decides what awaits approval, does not do middle steps) · the **teammate** (a person: takes a `handoff` note and works like a worker, and writes the handover note back the same way) · the **worker** (an agent: per `team-roles`). People and agents use the same work order; only the `to:` field differs, holding a person's name.

## ขั้นตอน — Steps (copy into the todo exactly)

Labels kept in Thai because the validator matches them: `ใคร:` = who · `หัวหน้าทีม` = the lead · `ตัวใหม่` = fresh (a new instance) · `ตัวเดิม (ถือ …)` = the same agent, holding something.

1. Understand: read the brief · what already exists in the project · constraints (budget · people · time) · ask the owner once, with answer choices · ใคร: หัวหน้าทีม
2. Choose a path: `brainstormer` ตัวใหม่ proposes 2–3 paths (a very important path uses MoA) → the lead picks 1 → write the brief per `brief-template` into `docs/BRIEF.md` · ใคร: `brainstormer` ตัวใหม่ → the lead
3. Split into milestones: each milestone must end in something checkable that can be shown to the owner · record in the "สถานะล่าสุด" (latest status) table in `docs/BUILD-PLAN.md` per `superuser/status-report` · ใคร: หัวหน้าทีม
4. Lay out the shared things + the work split table: outline · data shape · templates · shared conventions (language · naming · commit), done by the lead alone · a table `ชิ้น | ไฟล์ที่แตะ | ขนาด | ต้องรอชิ้นไหน | ใคร (คน/agent) · ระดับ` (piece | files touched | size | must wait for which piece | who (person/agent) · tier) makes clear which piece goes to which teammate · ใคร: หัวหน้าทีม
5. Write a note for every piece: every XL piece must be a file `handoff/<id>.md` per the skill `handoff` (because it surely crosses sessions), not just a chat message · ใคร: หัวหน้าทีม
6. Do the work: agent pieces are sent together in one message, by rank and graph width (`team-roles` "แบ่งงาน" (splitting the work) · more than 8 at once → `crew-patterns/parallel-split-and-merge`) · for a person's piece, send the note's path to the teammate with a due date for the returned note · pieces that must wait on others go in the next round · ใคร: ลูกทีมตัวใหม่ (a worker) per piece · ผู้ร่วมทีม (the teammate) per the note
7. Prove (พิสูจน์), per milestone: merge the milestone's pieces, then `reviewer` ตัวใหม่ checks the whole milestone in one go against the brief's "เสร็จเมื่อ" (done when) · risky work (money · law · health · sent to outsiders) uses `crew-patterns/adversarial-review-panel` · fail → fix → recheck, up to the round ceiling in `team-roles` · ใคร: `reviewer` ตัวใหม่
8. End-of-day sync: collect incoming handover notes (people and agents equal) · update BUILD-PLAN + "ความคืบหน้า" (progress) and "รับงานต่อ" (pick up the work) in `CONTEXT.md` per playbook `pickup-and-pause` · record decisions in `decision-desk/decision-log` · ใคร: หัวหน้าทีม
9. Report to the owner: at the end of a milestone or week, with `superuser/status-report` · items that cost money or cannot be reversed go under "รออนุมัติ" without blocking other pieces · ใคร: หัวหน้าทีม

## Done when

Every milestone in the "สถานะล่าสุด" table is `เสร็จ` with check evidence, and a fresh person or bot can read the single file `CONTEXT.md` and pick up the work without asking

---

Rules specific to XL work
- **Check per milestone, not at the end of the job.** For month-long work checked only once at the end, finding the break point is too late to fix.
- **A person's and an agent's pieces must not touch the same file.** The split table must state `files_allowed` with no overlap at all · shared files are written by the lead alone (`team-files`).
- **People deliver slower than agents.** Design so a person's piece does not block an agent's piece (people take pieces needing judgement · agents take mechanical pieces) · a person's piece that is `ติด` or overdue → the lead proposes, under "รออนุมัติ", taking it over or sending it to a worker.
- **Every day must end at a point where work can be picked up.** No day leaves work sitting purely in chat.
