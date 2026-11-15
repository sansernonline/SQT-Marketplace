# The lead learns about itself — `~/.claude/superuser/LEAD-PLAYBOOK.md`

This file is identical in every plugin. The original lives in plugin `superuser`. It is a core file (not turned off by config).

`IMPROVEMENTS.md` and the learning round look at where the **team** went wrong. This file looks at where the **lead** decided wrong: sized wrong · gave work to the wrong worker · set the model tier too high or too low · split pieces too small or too large · set too few check rounds.

## The 3-step loop

1. **Predict before handing out work** (section 2 of `superuser`): 1 line in the "การตัดสินใจ" (decisions) table of `CONTEXT.md` (no context file → at the end of the answer):
   `คาด: ขนาด กลาง · ลูกทีม 3 · รอบตรวจ 2 · ระดับ กลาง`
2. **Compare when closing the job** (section 7): 1 line under **ผล**: `คาด ลูกทีม 3 · รอบ 2 → จริง ลูกทีม 5 · รอบ 3`
3. **Record when a condition is met**: a difference of more than 2 times in any one field, or the same kind of difference for the 2nd time (for example a medium document job again used more check rounds than predicted) → add or fix 1 row in this file. If no condition is met, do not record.

## When to use it

- Before sizing any new job, open this file if it exists (≤ 40 rows, quick to read). If you find a row matching the job → use the value in the "ทำแบบนี้แทน" (do this instead) column, and note in the "คาด" line which row you used.
- A row whose prediction was right 3 times in a row when used → set its "มั่นใจ" (confidence) column to `ใช้ได้` (works). A row that still missed 2 times when used → fix the row or delete it.

## Template

```markdown
# LEAD-PLAYBOOK — บทเรียนการตัดสินใจของหัวหน้า

ไม่เกิน 40 แถว · เก่าสุดที่ `ใช้ได้` แล้วเกิน 10 แถว → รวมเป็นกฎสั้นในหัวข้อ "กฎที่ตกผลึก"

| วันที่ | งานแบบไหน | คาด | จริง | ทำแบบนี้แทน | มั่นใจ |
|---|---|---|---|---|---|
| 2026-10-22 | เอกสารกลาง 5–8 หน้า มี 3 แหล่งขึ้นไป | ลูกทีม 2 · รอบ 1 | ลูกทีม 2 · รอบ 3 | ให้ผู้ตรวจรอบแรกตรวจแหล่งก่อนตรวจภาษา · คาดรอบ 2 | ลอง |

## กฎที่ตกผลึก
- งานที่มีตัวเลขจากหลายแหล่ง → ตรวจแหล่งก่อน ตรวจภาษาทีหลัง
```

The "มั่นใจ" column uses 2 words: `ลอง` (trying) · `ใช้ได้` (works).

## Do not

- Do not record customer names, money figures, or secret values (the file lives outside the project).
- Do not record worker lessons (they go to `TEAM.md` or `IMPROVEMENTS.md`).
- Do not edit a skill or playbook from this file itself. When the user says "รวมบทเรียน" (merge the lessons) → the playbook `learn-from-session` reads this file too, then proposes moving the "กฎที่ตกผลึก" (crystallised rules) into section 2 of `superuser`.
