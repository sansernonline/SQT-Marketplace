# playbook · visual-parity — the real screen must match the reference

Use when: making a screen match a mockup · moving a screen from an old technology to a new one and it must look the same · the user says "ไม่เหมือนแบบ" (it does not look like the design)
Main skills: the project's app-checking skill (`app-verifier-setup`) · `ui-craft` · `ground-rules/principle-prove-it-works`

## ขั้นตอน · Steps (copy into the todo as written)

1. Identify the reference (a file in `mockup/` or the old system's screen) and the real screen to compare, as pairs · ใคร: หัวหน้าทีม
2. Capture both sides at the same window size with the same data, using the app-checking skill, and keep them in `_to_delete/parity/` · ใคร: `qa-tester` ตัวใหม่
3. Compare with a tool — use a pixel diff if there is one. If not, compare part by part: spacing · font size · colour · order · empty/loading/error states · ใคร: `qa-tester` ตัวใหม่
4. Make a list of the differences found, `| จุด | ต้นแบบ | ของจริง | แก้ที่ไฟล์ |` (spot · reference · real · file to fix), ordered by what the user sees first · ใคร: `qa-tester` ตัวใหม่
5. Fix one group at a time, and capture a new comparison after each · ใคร: `developer` ตัวใหม่ per group · `qa-tester` ตัวใหม่ captures the comparison
6. For differences that are deliberate (the reference breaks `ui-craft` rules or cannot really be built), do not fix them to match, but record the reason in `decision-desk/decision-log` · ใคร: หัวหน้าทีม
7. Click every button on the real screen to confirm it works. Do not stop at looking the same · ใคร: `qa-tester` ตัวใหม่
8. Check (ตรวจ) that every difference in the step 4 list is closed, the latest comparison matches the reference, and the step 6 reasons hold up · if it fails → loop per the check rounds in [`team-roles`](team-roles.md) · ใคร: `reviewer` ตัวใหม่
9. Finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Done when

Every pair has a latest comparison image, and every remaining difference has a reason attached
