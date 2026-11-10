---
name: "retrospective"
description: "Run a sprint retrospective covering what went well, what didn't, and action items."
---

> retro นี้เป็นของ**ทีมคน** — ผลคือเอกสาร retro และ action items เท่านั้น **ไม่แก้ skill · agent · playbook** · ถ้าอยากให้บทเรียนเข้า skill ของทีม agent ผู้ใช้ต้องสั่ง "รวมบทเรียน" แยกเอง (playbook `learn-from-session` ของ `superuser`)

Use the `project-manager` agent to facilitate a retrospective for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The PM should run this structured retro:

## 0 · หาแบบที่มีอยู่ก่อน (ทุกครั้ง)

ก่อนใช้โครงหรือแม่แบบในไฟล์นี้ ดูก่อนว่าผู้ใช้ ลูกค้า หรือโปรเจกต์มีแบบของตัวเองหรือยัง:

- **ที่ดู:** รูปแบบ retro ที่ทีมใช้รอบก่อน (บันทึกใน `docs/retros/` หรือบอร์ดที่ผู้ใช้ชี้) · action item ค้างจากรอบก่อน · ขนาดทีมและปัญหาหลักของรอบนี้
- **ผล:** เจอ → ใช้แบบนั้น (หัวข้อ ลำดับ ชื่อฟิลด์ เลขรัน) แล้วบอกในคำตอบว่าใช้แบบจากไฟล์ไหน · ไม่เจอ → ใช้แม่แบบในไฟล์นี้เป็นค่าสำรอง และบอกว่าไม่พบแบบเดิม
- **ยังต้องมีทุกแบบ:** เลือกรูปแบบตามรอบนี้: รอบปกติใช้ Start/Stop/Continue ได้ · รอบที่มีเหตุใหญ่ใช้ไทม์ไลน์ · ทีมเงียบใช้แบบเขียนก่อนพูด · เปิดด้วย action item ค้างของรอบก่อนเสมอ

## 1. Set the Stage
Ask the user once, at the start, all of the following (sprint facts and the retro input in step 2); do not stop to ask again. Anything the user doesn't know → write `(รอยืนยัน)` and keep going:
- What was the sprint goal?
- Was it achieved? (yes/partial/no)
- Any major events during sprint?
- What went well — what should we keep doing?
- What didn't go well — what should we stop doing?
- Any ideas to try next sprint, or puzzles we don't understand yet?

## 2. Gather Data (Start/Stop/Continue + Mad/Sad/Glad)

Using the answers from the start question, organize into:

### Went Well (Glad)
What should we **continue** doing?
- ...

### Didn't Go Well (Sad/Mad)
What should we **stop** doing?
- ...

### Ideas to Try
What should we **start** doing?
- ...

### Puzzles
Things we don't yet understand:
- ...

## 3. Generate Insights

For each major theme:
- Why did this happen?
- What's the systemic cause?
- Is this a one-time issue or pattern?

## 4. Decide on Actions

Produce **3-5 concrete action items** (not 20 — focus matters):

| Action | Owner | Due | Success Metric |
|--------|-------|-----|----------------|
| ...    | ...   | ... | ...            |

Rules:
- Each action has ONE owner (not "the team")
- Each action has a due date
- Each action has a way to measure if it worked
- If you can't measure it, it's not a real action

## 5. Close

- Summarize key takeaways (2-3 lines)
- Acknowledge team wins
- Confirm next retro date

## Output Format

```markdown
# Sprint Retrospective: <sprint>

**Date:** YYYY-MM-DD
**Facilitator:** ...
**Participants:** ...

## Sprint Goal & Outcome
- Goal: ...
- Achieved: Yes | Partial | No

## What Went Well
- ...

## What Didn't Go Well
- ...

## Ideas to Try
- ...

## Action Items
| Action | Owner | Due | Metric |

## Key Takeaways
- ...

## Carry-over from Last Retro
- Action X: Done | In progress | Not started
```
