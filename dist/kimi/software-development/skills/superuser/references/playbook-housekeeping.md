# playbook · housekeeping — clean up the machine and the project

Use when: the disk is full · many leftover worktrees or branches · old sandboxes and images pile up · `_to_delete/` is large (covers pstack's `worktree cleanup`)
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/operations.md`](../../dev-principles/references/operations.md)
Principle: cleaning up means deleting. Anything that may hold someone's work goes **under "รออนุมัติ"** (awaiting approval) with its delete command, and you do not delete it yourself.

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle file [`references/operations.md`](../../dev-principles/references/operations.md) first. Make the list. Delete nothing in this step · ใคร: หัวหน้าทีม
   - git worktrees and branches that are merged or untouched for more than 30 days (`git worktree list` · `git branch --merged`)
   - SQT sandboxes (`docker ps -a --filter label=sqt.sandbox=true`) · images and volumes no container uses
   - the size of each project's `_to_delete/`
2. Split into 2 groups: what is surely deletable (merged · no leftover files) and what needs a person to decide (uncommitted work · unsure) · ใคร: หัวหน้าทีม
3. Show the user the table `| ของ | ขนาด | เหตุผลที่ลบได้ | ความเสี่ยง |` (item · size · reason it can be deleted · risk) under the heading **"รออนุมัติ"**, with delete commands ready to run at once. Put the unsure items under "ค้างอยู่" (pending) · ใคร: หัวหน้าทีมเสนอ · ผู้ใช้อนุมัติ
4. Once the user approves, delete only the approved items. For a worktree with leftover files, keep a patch before deleting. For a sandbox, use `.sandbox/sandbox.ps1 destroy` (`.sandbox/` itself may stay at the root per `project-docs` → `references/project-doc-set.md` item 1) · ใคร: หัวหน้าทีม
5. Report the space recovered, then finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Done when

Only what the user approved was deleted, and no one's work was lost without a backup patch
