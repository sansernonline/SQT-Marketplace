# ทำไม skill ไม่ถูกเปิด และแก้อย่างไร

> ตรวจเมื่อ 2026-10-21 กับ Claude Code 2.1.306 · ผลวัดจริงอยู่ใน [`evals/triggers/RESULTS.md`](../../evals/triggers/RESULTS.md)

## ข้อสรุป

skill ทำงานได้ต่อเมื่อครบ 2 ข้อ: Claude เปิด skill นั้น และกฎอยู่ใน skill นั้นจริง · ชุดนี้ล้มที่ข้อแรกเป็นหลัก เพราะติดตั้ง 12 plugin แล้วรายการ skill ยาวเกินงบ Claude Code จึงตัดคำอธิบายทิ้ง Claude เห็นแค่ชื่อ เลยไม่รู้ว่าต้องเปิดตัวไหน

| ชุด | คำขอจริง 10 แบบ × 2 รอบ เปิด skill ถูก | รายการ skill |
|---|---|---|
| ก่อนแก้ (สำเนาของกลาง 12 ชุด) | 2/20 | 310 ตัว · 49,564 ตัวอักษร · เกินงบ 30,000 |
| หลังแก้ (ของกลางที่เดียว + hook) | 19/20 | 244 ตัว · 40,053 ตัวอักษร · ยังเกินงบ |
| หลังแก้ + งบ 2% (`set-skill-budget.mjs`) | 20/20 | ไม่เกินงบ |
| zip สำหรับ claude.ai 11 ตัว (ของกลางซ้ำทุก zip) + hook | 10/10 | 303 ตัว · 49,065 ตัวอักษร · เกินงบ · กฎประจำตัวเข้า context 1 ชุด ไม่ซ้ำ 11 ชุด |

ก่อนแก้ แม้แต่ "แก้ไฟล์ report.docx" และ "เขียน README" ก็ไม่เปิด skill สักตัว · ถามโมเดลตรง ๆ ว่าเห็นคำอธิบายของ `software-company:human-writing` · `polished-document-style` · `docx` ไหม → ไม่เห็นทั้งหมด เหลือแค่ชื่อ

## หลักฐานจากแหล่ง

| เรื่อง | แหล่ง |
|---|---|
| ตอนเริ่ม session โหลดแค่ชื่อและคำอธิบาย เนื้อหาโหลดเมื่อเปิด · คำอธิบายแต่ละตัวตัดที่ 1,536 ตัวอักษร · รายการเกินงบ (1% ของ context) → ตัดคำอธิบายตัวที่ใช้น้อยก่อน · ขยายงบด้วย `skillListingBudgetFraction` | [Claude Code Docs — Skills](https://code.claude.com/docs/en/skills) |
| กฎที่ต้องเกิดทุกครั้งให้อยู่ใน hook ไม่ใช่ skill · subagent โหลด skill ล่วงหน้าได้ด้วย `skills:` (ส่งเนื้อหาเต็ม) · skill ที่ตั้ง `disable-model-invocation` ไม่อยู่ในรายการ | [Skills](https://code.claude.com/docs/en/skills) · [Subagents](https://code.claude.com/docs/en/sub-agents) |
| `additionalContext` ของ SessionStart · SubagentStart · UserPromptSubmit เข้า context ได้ไม่เกิน 10,000 ตัวอักษร · hook ของแต่ละ plugin ทำงานแยกกันแม้คำสั่งเหมือนกัน | [Hooks](https://code.claude.com/docs/en/hooks) |
| plugin ประกาศ `dependencies` แล้ว Claude Code ติดตั้งตัวที่ต้องใช้ให้เอง | [Plugin dependencies](https://code.claude.com/docs/en/plugins/dependencies) |
| Anthropic เขียนไว้ใน skill-creator ว่า Claude มักเปิด skill น้อยกว่าที่ควร ให้เขียนคำอธิบาย "pushy" ขึ้นต้นด้วยกรณีใช้งาน | [wmedia — 5 rules Anthropic publishes](https://wmedia.es/en/tips/claude-code-create-skills-anthropic-rules) |
| hook ที่บังคับประเมิน skill ทีละตัวเปิดถูก 84% เทียบกับ 20% ของ hook ที่เตือนกว้าง ๆ · hook ที่ระบุชื่อ skill ตรง ๆ ได้ผลดีที่สุด | [Scott Spence — skills activate reliably](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably) |
| ทีมหนึ่งวัดว่าไม่มี hook Claude เปิด skill ของโปรเจกต์เองราว 25% | [HackerNoon — governance layer](https://sia.hackernoon.com/how-to-build-a-governance-layer-for-claude-code-with-hooks-skills-and-agents) |

ทดสอบเองเพิ่ม 2 เรื่อง: `skills:` ของ agent ชื่อเปล่า `simplify` ได้ `/simplify` ของ Claude Code (คนละตัว) ต้องเขียน `superuser:simplify` · agent ใน plugin อื่นโหลด `human-writing` ของ superuser ได้ด้วยชื่อเปล่า (debug log `Preloaded skill`)

## สิ่งที่แก้

| ชั้น | ทำอะไร | ทำไม |
|---|---|---|
| 1 · ของกลางที่เดียว | skill · agent · hook กลางอยู่ใน `superuser` · plugin อื่นใช้ `dependencies` · zip ของ claude.ai ยังมีของกลางในตัว | ลดรายการ 66 ตัว · hook ไม่ทำงานซ้ำ 12 ครั้ง |
| 2 · กฎประจำตัวทุก session | hook ส่ง `CLAUDE.global.md` ตอนเริ่ม (ยกเว้นติดตั้งเป็น `~/.claude/CLAUDE.md` แล้ว) · มีตาราง งาน → skill | กฎที่ต้องเกิดทุกครั้งไม่ต้องรอเปิด skill · Cowork ไม่อ่าน `~/.claude/CLAUDE.md` |
| 3 · บอกชื่อ skill ตามคำขอ | `skill-router.json` จับคำ แล้ว hook บอกชื่อ skill ก่อนข้อความผู้ใช้ | ชี้ชื่อตรง ๆ ได้ผลกว่าเตือนกว้าง ๆ และไม่ต้องให้โมเดลไล่ประเมินทุกตัว |
| 4 · subagent | `skills:` โหลด `human-writing` · `superuser:simplify` · `no-ai-look` ตามงาน · SubagentStart ส่งตาราง งาน → skill | subagent เริ่มใหม่ไม่เห็นกฎของหัวหน้าทีม |
| 5 · งบรายการ | `set-skill-budget.mjs` ตั้ง 2% | หลังลดสำเนาแล้วยังเกินงบ 33% |
| 6 · กฎผิดที่ | กฎทั่วไปย้ายเข้า `human-writing` · `polished-document-style` · กฎประจำตัว · แม่แบบเอกสารไม่มีอีโมจิ · diagram ในเอกสารโปรเจกต์ไป `diagram-figures` · คู่ skill ที่ทับกันมีลิงก์ถึงกัน | กรณีอีโมจิ: กฎอยู่ใน skill ที่ไม่ตรงกับงานแก้ไฟล์ |
| 7 · วัดผล | `evals/triggers/` รัน `claude -p` จริง 10 คำขอ | รู้ว่าแก้แล้วดีขึ้นจริง และจับถอยหลังได้ |

## ยังเหลือ

- Cowork อัปโหลด zip ทีละ plugin จึงยังมีของกลางซ้ำทุก zip และยังไม่รู้ว่า Cowork ตั้ง `skillListingBudgetFraction` ได้ไหม (ยังไม่ได้ตรวจ)
- ช่องให้ผู้ใช้กรอก `[ใส่ตัวเลข]` ใน career · home-family · health-wellness ยังเป็นวงเล็บเหลี่ยม ส่วนกฎกลางใช้ `(รอยืนยัน)` · ตั้งใจเก็บไว้เพราะเป็นช่องที่ผู้ใช้เติมเอง ไม่ใช่ข้อมูลที่ Claude ไม่รู้
- `CLAUDE.global.md` ยาวขึ้นเป็นราว 7,600 ตัวอักษร (เพดาน 9,500) · ทุก session จ่ายค่านี้
