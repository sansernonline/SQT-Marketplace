# Brief — a plain-language summary after brainstorm

This file is identical in every plugin. The original lives in plugin `superuser`.

Use it when the task is large or the request is unclear. After brainstorm and choosing a path, the lead writes a brief before starting, shows it to the user in the reply, and saves it at `docs/BRIEF.md`. If the task changes direction, rewrite the brief over the old one. Do not append.

A brief is a summary for the user to read, not a work order. The term "brief" for a worker (the file `handoff/<id>.md` per skill `handoff` section 3) means only the one the lead sends to a team member.

## Rules

- Write so that someone who never saw the chat can read it in 1 minute and understand what the task is, what it can do, and what they will get.
- Follow `human-writing`. Full sentences. No team jargon (playbook · subagent · Mixture-of-Agents (MoA)) unless needed.
- Every item is checkable. Mark unknowns `(รอยืนยัน)` (awaiting confirmation). Never guess to look complete.
- At most 40 lines. Longer means the task is too big, so split it into several briefs.

## Template

Every section is a bullet or a table, with no long paragraphs. One item, one point. The user reads it in Thai, so keep the template in Thai.

```markdown
# <ชื่องาน> — Brief

> อัปเดต: <วันที่> · สถานะ: ใช้อยู่ (ผู้ใช้แก้ทางได้ทีหลัง)

## งานนี้คืออะไร
- **ทำอะไร:** <1 บรรทัด>
- **ให้ใคร:** <ผู้ใช้กลุ่มไหน>
- **แก้ปัญหาอะไร:** <ปัญหาที่เจออยู่ตอนนี้>

## ทำอะไรได้บ้าง
| # | ความสามารถ | ใครใช้ | ตัวอย่าง |
|---|---|---|---|
| 1 | <สิ่งที่ทำได้จริง> | <ลูกค้า · แอดมิน · ระบบ> | <ลูกค้าดูสถานะคำสั่งซื้อได้เองจาก LINE> |

## ต้องการให้ได้อะไร
| เป้า | วัดด้วย | เสร็จเมื่อ |
|---|---|---|
| <ผลที่อยากได้> | <ตัวเลขหรือสิ่งที่ตรวจได้> | <เงื่อนไขที่ตรวจผ่าน> |

## ไม่ทำในรอบนี้
- <สิ่งที่ตัดออก> — เพราะ <เหตุผล>

## ข้อจำกัดทั้งงาน
- <กฎที่ทุกชิ้นต้องรักษา เช่น ไม่เพิ่ม dependency · วันที่ใช้ ISO 8601 · ภาษาไทยตาม human-writing>
- ช่องว่างใน spec: <จุดที่ spec ไม่ระบุ เช่น ชนิดข้อมูล · ค่าว่าง · รูปแบบ> → <ทางที่รับค่ากว้างสุด> · ไม่เพิ่มการตรวจหรือ error ที่ spec ไม่ได้สั่ง

## ทางที่เลือก
| ทาง | ข้อดี | ข้อเสีย | แรงที่ใช้ | เลือก |
|---|---|---|---|---|
| A <ชื่อทาง> | ... | ... | เล็ก · กลาง · ใหญ่ | ✓ |
| B <ชื่อทาง> | ... | ... | ... | |

## เสี่ยงและยังไม่รู้
- **เสี่ยง:** <อะไรอาจพลาด> → <จะกันอย่างไร>
- **ต้องให้ผู้ใช้ตอบ:** <คำถามที่ตอบได้ด้วยคำสั้น ๆ>
```

The section "ข้อจำกัดทั้งงาน" (task-wide constraints) needs no decision from the user, but the lead copies it into every worker brief ([`team-roles`](team-roles.md) section "แบ่งงาน" (splitting work) item 7), because each worker cannot see the rules the others must follow. Put in only rules that affect several pieces. A rule for one piece goes in that piece's brief. The lead goes through the spec-gap row before splitting the task. Without it, each worker guesses differently, and tends to guess the narrow path that fails the tests.

## Short brief for `worker`

Use it for every piece sent to a worker per `superuser` section 5 (the 5-field brief). For non-code tasks, change the `เสร็จเมื่อ:` line to that task's way of checking. Send it in the agent-call message, not as a brief for the user. **The whole brief stays within about 15 lines.** **Point to the spec by file and heading. Never copy spec text in.** The worker opens it. Start each field at the beginning of a line exactly as below, because the hook counts the brief fields and reads `ขนาด:` from the line start. Keep the Thai labels; the placeholders are English.

```
เป้า: <what this piece does> — 1 of <N> pieces of <task>
ขอบเขต: write <path> · read <path:line range, only shared pieces it needs> · do not touch <other pieces · shared team files> · read no other file
spec: <file> section <N> · point only, never copy text in · spec not yet in a file (only in chat) → the lead writes it to a file once first, then points to that file
ใช้จาก · ให้ชิ้นอื่น: <name · signature exactly as written>
กติกา: <spec gap → the decided path> · no checks or errors the spec did not ask for, except input checks at the system edge
เสร็จเมื่อ: `<test command for this piece>` passes in full
ขนาด: <N>k
ส่งกลับ: at most 15 lines · first line เสร็จ | เสร็จ มีข้อกังวล | ขาดบริบท | ติด · files changed · test result (ผ่าน/total) · what is unsure
```

1 unit of the task (module · file) = 1 brief, and the worker writes both its code and its tests. Do not split into a code brief and a test brief. A brief where the lead copies the spec in every time is the most expensive opus output in the task (bench t5 round r7 2026-11-11: 6 briefs · lead output 20,647 · 22,151 · 48,980 tokens across 3 rounds · bench t5 2026-11-11: 6–7 briefs used 10.5k output tokens = 50–64% of the lead's output · recorded in `scripts/evals/speed/RESULTS.md`).

A piece whose spec is still open or hard → the same brief, but send a higher `model` and `effort` in the call (`sonnet` + `medium` or above). Do not change the agent.

## Sources

Global Constraints: superpowers (MIT) · `skills/writing-plans` · viewed 2026-11-10
