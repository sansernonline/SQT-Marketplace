# SQT-Marketplace — CONTEXT

> คนและ bot ทุกตัวอ่านหัวข้อ "ความคืบหน้า" และ "รับงานต่อ" ก่อนทำงาน (หัวข้ออื่นเปิดเมื่อต้องใช้) · อัปเดต: 2026-10-23 18:10 โดย superuser (Opus 5.5)

## งานนี้คืออะไร
marketplace plugin ของ Square Tech: 8 plugin = `superuser` (แกนกลาง) + 7 สาขา (software-company · personal-life · thai-workplace · e-commerce · trading-finance · graphic-design · reverse-engineer) · ส่งออกไป claude.ai · Codex · Gemini · Kimi ผ่าน `dist/`
อยู่บน branch `feat/superuser-3-eight-plugins` · commit แล้ว 3 ชุด (ยังไม่ push) · รอบที่ 2 (2026-10-23 บ่าย) เสร็จแล้วแต่ยังไม่ commit

## เป้าตอนนี้
ผู้ใช้ตัดสินเรื่อง commit รอบ 2 · push · เลื่อนรุ่น · ไฟล์ของงานอีกฝั่ง (ดู "รอผู้ใช้")

## ความคืบหน้า
| งาน | สถานะ | หลักฐาน | อัปเดต |
|---|---|---|---|
| รวมเหลือ 8 plugin | เสร็จ | commit `06e5aef` | 2026-10-23 |
| กฎภาษาไทยจาก kien-thai · `thai_tells.py` · skill-authoring · translate-th-en · hook guard/recompact | เสร็จ | commit `f42637b` | 2026-10-23 |
| skill ใหม่ 4 · ส่วนเสริมจากการเทียบ ~110 จุด · ชุดออกแบบ · prompt · docs รูป dist | เสร็จ | commit `7584e5e` | 2026-10-23 |
| รอบ 2: skill ใหม่ 5 (hiring-th · thai-business-setup · infra-as-code · data-analysis · course-builder) · reference 5 (Figma · docs site · API บัญชีไทย · API ร้านค้าไทย · เครื่องมือผลิตวิดีโอ) | เสร็จ ยังไม่ commit | validator 488 รายการ ไม่มี error | 2026-10-23 |
| รอบ 2: hook คอลัมน์ "รีวิวผ่านแล้วผู้ใช้ยังแก้" · eval review-recall (สร้าง ไม่รัน) · validator ตรวจลิงก์ภายใน · ตารางระยะบรรทัดไทย · `thai_tells.py` ไม่เตือนขีดในช่องตาราง | เสร็จ ยังไม่ commit | hook self-test 83/83 · validator self-test 18/18 · review-recall `--verify` ผ่าน | 2026-10-23 |
| สร้างใหม่: sync · docs · FILE-MAP · รูป 26 รูป · dist 8 plugin | เสร็จ | `scripts\build-dist.cmd` exit 0 | 2026-10-23 |

## กติกา
- ไม่ commit · push · merge main · tag เว้นแต่ผู้ใช้สั่งในรอบนั้น
- ของกลางแก้ที่ `plugins/superuser` แล้วรัน `node scripts/sync/sync-superuser.mjs`
- skill ใหม่ต้องเพิ่มให้ครบ: CHANGELOG `Unreleased` · `scripts/sync/file-map-th.json` · `scripts/diagrams/labels/<plugin>.json` (skill_groups มีเฉพาะ software-company และ superuser · playbook กลางต้องมีแถวใน labels ของทุกสาขา) · `triggers.md` ของ plugin · ถ้าเป็นของกลาง เพิ่มใน `SHARED_ONLY_IN_SUPERUSER` + `SHARED_SKILLS` + `hooks/skill-router.json`
- ก่อนจบทุกรอบ: `node scripts/check/validate-marketplace.mjs` (+ `--self-test`) · `sync-docs.mjs` · `sync-file-map.mjs --check` · `sync-prompt-rules.mjs --check` · `node plugins/superuser/hooks/superuser-hook.mjs --self-test` · `python plugins/superuser/skills/human-writing/scripts/thai_tells.py --self-test` · เพิ่ม/ลบ skill หรือ playbook → `python scripts/diagrams/make.py` · ปิดท้าย `scripts\build-dist.cmd`
- licence: trailofbits/OWASP = CC-BY-SA (ใช้ไอเดีย เขียนใหม่) · borghei = MIT + Commons Clause (เขียนใหม่) · anthropics docx/pptx/healthcare = ลิงก์เท่านั้น
- ภาษาไทยทุกไฟล์ตาม `human-writing` · ไม่ใส่อีโมจิ
- **มีงานอีกฝั่ง (น่าจะเป็น Codex CLI) แก้ repo นี้พร้อมกัน** — เทียบ `git status` ก่อนและหลังทุกงาน · ไฟล์ที่เปลี่ยนโดยไม่ได้มาจากทีมเรา ห้ามแตะและห้าม commit จนผู้ใช้สั่ง

## ของอยู่ที่ไหน
| ไฟล์ | คืออะไร |
|---|---|
| `.claude/superuser/research/skill-comparison-2026-10-22.md` | เทียบ skill ตัวต่อตัวกับ repo เปิด ~40 ตัว + หมวดที่ยังไม่มี |
| `.claude/superuser/research/kien-thai-research.md` | ผลค้น kien-thai · กวาด Thai ทุก plugin |
| `.claude/superuser/research/design-skills-research.md` | skill ออกแบบที่ดี |
| `.claude/superuser/research/dynamic-website-research.md` | สูตรเว็บมีชีวิต (ai4ba) |
| `evals/review-recall/` | eval วัด reviewer · `--verify` ฟรี · `--run` เสียเงิน |
| `CONTEXT-superuser-3.0.md` (ราก) | context รอบ 3.0 เดิม บางข้อเก่าแล้ว |
| auto memory `kien-thai-adoption.md` | สรุปเดียวกันสำหรับ session ใหม่ |

## การตัดสินใจ
| วันที่ | เลือก | ไม่เลือก | เพราะ |
|---|---|---|---|
| 2026-10-23 | validator ตรวจลิงก์ภายในเฉพาะปลายทาง .md · โฟลเดอร์ · `../` เป็น error | ตรวจทุกลิงก์รวมรูป | ลิงก์รูปและคำตัวอย่างในแม่แบบทำให้เตือนผิด 12 จุด · แบบที่เลือกเตือนผิด 0 จุด |
| 2026-10-23 | ไม่เพิ่มตัวตรวจชื่อ skill ใน backtick | เพิ่มเป็น warning | ลองแล้วเจอ 16 ชื่อ ถูกต้องทั้งหมด (skill ภายนอก · ไฟล์ reference · ไลบรารี) |
| 2026-10-23 | คัดลอก `playbook-team-project.md` ไปทุกสาขา | เปลี่ยนลิงก์เป็นข้อความ | แบบเดียวกับ playbook กลางตัวอื่น (ADAPT ข้อ 1) |
| 2026-10-23 | แบ่ง 3 commit ตามพื้นที่ | แบ่งตามช่วงเวลา | งาน 3.0 รอบ 2 กับรอบนี้แก้ไฟล์เดียวกัน · ผู้ใช้เลือก |
| 2026-10-23 | guard · recompact ปิดไว้ตั้งต้น | เปิดตั้งต้น | ไม่เปลี่ยนพฤติกรรมของผู้ใช้เดิม |

## รอผู้ใช้
ไม่เกิน 10 แถว · แถวบนสุดคือข้อที่ **ต่อไป** ในคำตอบชี้ให้ผู้ใช้ทำ · "ทำไมต้องเป็นคุณ" ใช้ 4 ค่า: ตัดสิน · ตรวจด้วยตาหรือหู · ใช้เงินหรือ token · รับรองข้อความที่ agent เขียนแทน · agent ลบแถวทันทีที่ผู้ใช้ตอบหรือปลดล็อกแล้ว
| เรื่อง | ทำไมต้องเป็นคุณ | หลักฐาน | ปลดล็อกอะไร · ตอบแบบไหน | วันที่เพิ่ม |
|---|---|---|---|---|
| commit งานรอบ 2 | ตัดสิน | ไฟล์ของรอบ 2 ปนกับไฟล์ของงานอีกฝั่งใน working tree · `dist/` สร้างจากทั้งสองฝั่ง | ตอบ "เฉพาะรอบนี้" (ไม่รวมของอีกฝั่งและ dist) · "รวมทั้งหมด" · "ยังไม่ commit" | 2026-10-23 |
| ไฟล์ของงานอีกฝั่ง | ตัดสิน | `tools/set-data-mcp/` · `docs/MCP.md` · `html-slide-deck/SKILL.md` · `presentation-design/SKILL.md` · `reverse-engineer/SKILL.md` + `templates/` 4 ไฟล์ · `mcp-server/SKILL.md` + README + `wire-inventory-2026-10-23.jsonl` | commit รวมหรือแยก · แม่แบบ `system-map.md` ใช้อีโมจิ 🔵🟢 ขัดกฎ human-writing | 2026-10-23 |
| push branch แล้วเปิด PR หรือ merge main | ตัดสิน | 3 commit บน `feat/superuser-3-eight-plugins` | คนอื่นติดตั้งจาก GitHub ได้ · ตอบ "push" | 2026-10-23 |
| เลื่อนรุ่นและ tag | ตัดสิน | ทุก plugin ยังเป็นรุ่นเดิม · งานใหม่อยู่ใต้ `Unreleased` | ที่เสนอ: superuser 3.1.0 · software-company 2.21.0 · personal-life 0.13.0 · thai-workplace 0.11.0 · graphic-design 0.10.0 · trading-finance 0.11.0 · e-commerce 1.0.0 · reverse-engineer 0.1.0 · ตอบ "ตามที่เสนอ" หรือรุ่นที่ต้องการ | 2026-10-23 |
| อ่านออกเสียงคู่ตัวอย่างภาษาไทย 5 คู่ใน `human-writing/references/thai-examples.md` | ตรวจด้วยตาหรือหู | ทุกคู่ติดป้าย (ชั่วคราว) | เอาป้ายออก · ตอบ "รับ" หรือแก้ข้อความ | 2026-10-22 |
| รัน eval ที่เสียเงิน: `claude plugin eval` ของ superuser · `evals/review-recall --run` | ใช้เงินหรือ token | ยังไม่เคยรันจริง | วัดผลได้จริง · ตอบ "รัน eval" | 2026-10-23 |

## รับงานต่อ
- **ทำต่อเป็นข้อแรก:** ถามผู้ใช้แถวบนสุดของ "รอผู้ใช้" (commit รอบ 2) · ได้คำตอบแล้วทำตาม · ถ้าเลือก "เฉพาะรอบนี้" ให้ stage เฉพาะไฟล์ที่ไม่อยู่ในแถว "ไฟล์ของงานอีกฝั่ง" และไม่รวม `dist/` `docs/plugins/` (สร้างจากทั้งสองฝั่ง) แล้ว commit สร้างใหม่แยกเมื่ออีกฝั่งเสร็จ
- **รออนุมัติ:** commit · push · merge · tag · เลื่อนรุ่น · eval ที่เสียเงิน
- **ค้างอยู่:** `items.json` ที่รากเป็นภาพรวมเก่า 12 ต.ค. ไม่มีตัวสร้าง · ตัวบทราชบัณฑิตยสภาเรื่องไม้ยมกและประกาศทับศัพท์ 2532 · ข้อความ licence เต็มของ GSAP · ข้อที่ agent ติด (ยังไม่ได้ตรวจ) ไว้ใน skill ใหม่ (เช่น ม.17/17-1 พ.ร.บ.คุ้มครองแรงงาน · rate limit ของ Shopee/Lazada · ค่า API ของ PEAK/FlowAccount)
- **ระวัง:** อย่าแก้ไฟล์ของงานอีกฝั่ง · eval review-recall มีไฟล์ตั้งใจพัง (ลิงก์เสีย · ซึ่ง/โดย เกินงบ) ใน `evals/review-recall/cases/` ตัวตรวจที่เพิ่มใหม่ต้องข้ามโฟลเดอร์นี้ · `data-analysis` ต้องใช้ matplotlib 3.11 ขึ้นไป (3.10 วรรณยุกต์ซ้อนสระบนหาย)

## ไฟล์อื่น
`HISTORY.md` งานที่เสร็จแล้ว · `IMPROVEMENTS.md` · `handoff/` ใบสั่งและใบส่งงาน · `log/` · `learn/` · `inbox/` (ทั้งหมดอยู่ใน `.claude/superuser/` · log learn inbox state ไม่ commit ตาม `.gitignore`) · ผลค้นคว้าอยู่ใน `.claude/superuser/research/`
