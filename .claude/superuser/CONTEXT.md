# SQT-Marketplace — CONTEXT

> คนและ bot ทุกตัวอ่านหัวข้อ "ความคืบหน้า" และ "รับงานต่อ" ก่อนทำงาน (หัวข้ออื่นเปิดเมื่อต้องใช้) · อัปเดต: 2026-10-24 22:22 โดย superuser (Opus 5.5)

## งานนี้คืออะไร
marketplace plugin ของ Square Tech: 8 plugin = `superuser` (แกนกลาง) + 7 สาขา (software-company · personal-life · thai-workplace · e-commerce · trading-finance · graphic-design · reverse-engineer) · ส่งออกไป claude.ai · Codex · Gemini · Kimi ผ่าน `dist/`
branch `feat/superuser-3-eight-plugins` merge เข้า main แล้ว และลบแล้วทั้งในเครื่องและบน GitHub · ตอนนี้อยู่บน `chore/superuser-notes-2026-10-23` (แตกจาก main) · merge 2026-10-23 ผ่าน PR #1 (merge commit `f784b41` · tree เท่ากับ `b6c4c30`) · repo ไม่เคยมี git tag · เลื่อนรุ่นแล้ว: superuser 3.1.0 · software-company 2.21.0 · personal-life 0.13.0 · thai-workplace 0.11.0 · graphic-design 0.10.0 · trading-finance 0.11.0 · e-commerce 1.0.0 · reverse-engineer 0.1.0

## เป้าตอนนี้
text-to-speech ภาษาไทยรวมเป็นหัวข้อเสียงบรรยายจากสคริปต์ใน `video-editing` แล้ว commit + push ตามที่ผู้ใช้สั่ง · ผู้ใช้ merge PR ของ branch นี้ · ผู้ใช้สั่ง "รวมบทเรียน" เมื่อพร้อม (ดู "รอผู้ใช้")

## ความคืบหน้า
| งาน | สถานะ | หลักฐาน | อัปเดต |
|---|---|---|---|
| รวมเหลือ 8 plugin | เสร็จ | commit `06e5aef` | 2026-10-23 |
| กฎภาษาไทยจาก kien-thai · `thai_tells.py` · skill-authoring · translate-th-en · hook guard/recompact | เสร็จ | commit `f42637b` | 2026-10-23 |
| skill ใหม่ 4 · ส่วนเสริมจากการเทียบ ~110 จุด · ชุดออกแบบ · prompt · docs รูป dist | เสร็จ | commit `7584e5e` | 2026-10-23 |
| รอบ 2: skill ใหม่ 5 (hiring-th · thai-business-setup · infra-as-code · data-analysis · course-builder) · reference 5 (Figma · docs site · API บัญชีไทย · API ร้านค้าไทย · เครื่องมือผลิตวิดีโอ) | เสร็จ | commit `e4ded99` (89 ไฟล์ เฉพาะของทีมเรา) | 2026-10-23 |
| รอบ 2: hook คอลัมน์ "รีวิวผ่านแล้วผู้ใช้ยังแก้" · eval review-recall (สร้าง ไม่รัน) · validator ตรวจลิงก์ภายใน · ตารางระยะบรรทัดไทย · `thai_tells.py` ไม่เตือนขีดในช่องตาราง | เสร็จ | commit `e4ded99` · hook self-test 83/83 · validator self-test 18/18 · review-recall `--verify` ผ่าน | 2026-10-23 |
| เลื่อนรุ่น 6 plugin · CHANGELOG ครบทุกรุ่น (เติมส่วนเสริมที่ลงโค้ดแล้วแต่ยังไม่มีบรรทัด) · ตัวชี้ `seller-tax-basics` 8 จุด · มาตรา 17 · 18 · 20 ใน `complaint-letter-th` ตามราชกิจจานุเบกษา · description นับ skill ใหม่ | เสร็จ | commit ถัดจาก `e4ded99` (`chore(release)`) · validator 488 รายการ error 0 | 2026-10-23 |
| prompt ใหม่ `prompt/personal-life/prompt-podcast-lesson.md` 5 ฉบับ (บทเรียน podcast พร้อมสไลด์) | commit แล้วใน `ccc56df` (อีกเครื่องมือ commit ให้) · แก้ตามรอบทดสอบจริง 11 จุด commit ใน feat graphic-design 2026-10-24 | agent ตัวใหม่ทำฉบับ 1–3 จริงใน `_to_delete/podcast-test/` (54 นาที) | 2026-10-24 |
| prompt ทุกไฟล์ชี้กฎวนจนเสร็จเป็นข้อ 3 (เดิมชี้เลขเก่า 71 ไฟล์) · ใส่เลขเก่าใน `retired` | commit `c89b8b7` (retired อยู่ใน commit ถัดไป) | `sync-prompt-rules` 25 ไฟล์ · เหลือเลขเก่า 0 ไฟล์ | 2026-10-24 |
| graphic-design: skill `video-editing` (รวมหัวข้อสไลด์กับเสียงบรรยายแล้ว) · `subtitles-th` + agent `video-editor` · สคริปต์ 4 ตัว · eval 9 เคส · router · triggers · playbook `video` · FILE-MAP · CHANGELOG | commit feat graphic-design 2026-10-24 | สคริปต์ทุกตัวรันกับไฟล์จริงผ่าน (ffmpeg 9.0.2) · validator 492 รายการ error 0 · router 12 ประโยคถูกทั้งหมด · รอบแดง/เขียวด้วย haiku: `subtitles-th` แดงพลาด (เลื่อนเวลาซับโดยไม่ฟัง · ฟอนต์ไม่ดูใบอนุญาต) เขียวแก้ได้ · `video-editing` และหัวข้อสไลด์แดงทำถูกอยู่แล้ว | 2026-10-24 |
| dist 8 plugin และเอกสาร sync | สร้างใหม่หลังรวม skill แล้ว | `scripts\build-dist.cmd` exit 0 · ไม่มีชื่อ skill เดิมค้างใน `dist/` | 2026-10-24 |
| commit + push งานรอบ 2026-10-24 บน `chore/superuser-notes-2026-10-23` | เสร็จ · `c89b8b7` (ทีมเรา) + `bcb9742` · `9a4479f` · `00033de` (อีกเครื่องมือ commit และ push งานของเราเองภายใน 1 นาที ข้อความตรงกับงาน) · local = remote `00033de` · ยังไม่มี PR | validator 492 รายการ error 0 บน HEAD · sync ทุกตัวตรง · ไม่พบค่าลับใน diff | 2026-10-24 |
| ทดสอบ whisper.cpp ถอดเสียงไทย | หยุดตามผู้ใช้ (อยากได้ TTS มากกว่า) · `subtitles-th` ข้อ 2 ยังติดป้ายว่ายังไม่ได้รันจริง | ได้ไบนารี `b5454` hash ตรงกับ GitHub · เสียงทดสอบ Pattara 33.7 วินาทีที่ `_to_delete/whisper-test/work/tts.wav` · โมเดลโหลดไม่ครบ | 2026-10-24 |
| text-to-speech ภาษาไทย: หัวข้อเสียงบรรยายจากสคริปต์ใน `video-editing` (เดิมทำเป็น skill `tts-th` แล้วผู้ใช้เลือกรวม) · `scripts/tts_cues.py` · `f5_worker.py` · `windows_tts.ps1` + eval `video-editing-tts-*` 3 เคส + router · triggers · playbook `video` · agent `video-editor` · prompt podcast ฉบับ 4 · CHANGELOG · facts | commit + push 2026-10-24 ตามที่ผู้ใช้สั่ง · ผู้ตรวจ 2 รอบผ่าน (รอบ 1 กลาง 3 ต่ำ 8 · รอบ 2 ต่ำ 5 · แก้ครบ) · หลังรวม: validator 492 รายการ error 0 · router แถว TTS 20/20 · ทดสอบย่อย 10/10 | ผู้ใช้เลือก F5-TTS-THAI ตัวหลัก edge-tts ตัวรอง · ทดสอบจริง 3 เครื่องจนได้วิดีโอ 32.21 วินาที · validator 493 รายการ error 0 · router 14/14 · แดง/เขียว haiku: แดงทำถูก 205k token 10.3 นาที เขียว 144k 4.8 นาที · ตัวอย่างเสียง `_to_delete/tts-samples/listen/index.html` · ค้น 58 แหล่ง `_to_delete/tts-research.md` | 2026-10-24 |
| รวมบทเรียน 11 ข้อจากคิวกลาง (hook 3 · validator 4 · ข้อความ skill 4) ใน worktree `SQT-lessons` บน branch `chore/superuser-notes-2026-10-23` | เสร็จ · commit `21dfda8` + `0cd886d` push แล้ว · worktree ลบแล้ว | hook self-test 86/86 · validator self-test 22/22 · validator 492 รายการ error 0 warning 5 · ตัวนับข้อรอรวม 11 → 0 · ผู้ตรวจผ่าน (ต่ำ 4 แก้ 2) · dist สร้างใหม่ exit 0 | 2026-10-25 |

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
| 2026-10-23 | ไม่ commit `brief-to-image/SKILL.md` | commit ไปกับรอบ 2 | ขั้น 0 แก้เวลา 18:05 ไม่มีใน input ของ tool ใดใน session นี้ = ของอีกฝั่ง |
| 2026-10-23 | personal-life แยก 0.12.0 (รวม plugin) กับ 0.13.0 · thai-workplace ย้าย 0.10.0 จากท้ายไฟล์ขึ้นบน | รวมเป็นรุ่นเดียว | plugin.json ตั้ง 0.12.0 และ 0.10.0 ไว้แล้วตอนรวม plugin |
| 2026-10-23 | ส่วนเสริมใน CHANGELOG เขียนย่อตามหมวด | ใส่ร่างเต็มทีละ skill | ร่างของ software-company ยาว 66 KB อ่านไม่ไหวในหน้า release notes |
| 2026-10-23 | ตัวชี้ `seller-tax-basics` ใน e-commerce บอกชื่อ plugin `thai-workplace` | ปล่อยชื่อเปล่า | e-commerce ไม่ได้ depend thai-workplace คนที่ติดตั้งเดี่ยวจะไม่รู้ว่าอยู่ที่ไหน |
| 2026-10-24 | เพิ่ม skill วิดีโอใน graphic-design 3 ตัว + agent `video-editor` | แยก plugin `video-production` | สอดคล้องกับที่ผู้ใช้ยุบ plugin เล็ก · ผู้ใช้สั่ง "เพิ่มให้หน่อย" ตามข้อเสนอนี้ |
| 2026-10-24 | ซับแนวตั้งใช้ `MarginV=100` · ห้าม `Alignment=5` | วางกลางจอด้วย Alignment | วัดจริง: MarginV 100 ได้ 37% จากขอบล่าง · Alignment 5 ไปอยู่ชิดบน |
| 2026-10-24 | แก้เลขกฎใน prompt 71 ไฟล์ทั้งชุดในรอบนี้ | แก้เฉพาะ prompt podcast | ตัวชี้ผิดเหมือนกันทุกไฟล์ แก้ด้วยสคริปต์ diff เปลี่ยนแค่เลขข้อ |
| 2026-10-24 | ผู้ใช้เลือก — รวม `slides-to-video` เป็นหัวข้อใน `video-editing` ก่อนออกรุ่น · ชื่อเดิมลง `retired` | คงไว้ 3 skill จนรีวิวเดือนหน้า | รอบแดงทำถูกโดยไม่มี skill · ของที่เหลือเป็นสคริปต์กับกับดัก 3 ข้อ ไม่คุ้มเป็น skill แยก |
| 2026-10-24 | ผู้ใช้เลือก — F5-TTS-THAI ที่ติดตั้งไว้เป็นเสียงตัวจริง (จะมีการ์ดจอไว้ render) · ตัวรองตีความ "4" เป็น edge-tts (ตัวเลือกที่ 4 ของคำถาม) | ตีความ "4" เป็นไฟล์ 4 คือ Lunarlist | Lunarlist ทดสอบแล้วใช้ไม่ได้ (ข้ามคำอังกฤษ · พูดไม่หยุด) · รอผู้ใช้ยืนยัน |
| 2026-10-24 | `tts-th` เป็น skill แยก · ไม่ทำ adapter Azure และ Google | เป็นหัวข้อใน `video-editing` แบบที่รวม slides-to-video · ทำ adapter ทุกเจ้า | มีสคริปต์ 3 ไฟล์ ตารางเครื่องเสียง และกฎเสียงต้นแบบของตัวเอง `video-editing` ยาว 112 บรรทัดแล้ว · ผู้ใช้ไม่ได้เลือก Azure หรือ Google และไม่มีคีย์ให้ทดสอบ |
| 2026-10-24 | ผู้ใช้เลือก — รวม `tts-th` เป็นหัวข้อเสียงบรรยายจากสคริปต์ใน `video-editing` · ชื่อเดิมลง `retired` · eval เปลี่ยนชื่อเป็น `video-editing-tts-*` | คงเป็น skill แยกตามที่หัวหน้าทีมเสนอ | รอบแดงทำงานเสียง Windows ถูกเหมือนกัน แบบเดียวกับที่รวม slides-to-video |
| 2026-10-24 | ผู้ใช้ยืนยัน — เสียงตัวรองคือ edge-tts | Lunarlist (ไฟล์ 4) | ตอบคำถามยืนยันตอนจบ |
| 2026-10-24 | เคส eval ที่ 3 ใช้ชื่อ `-regression` ตามกติกาตอนนี้ และเขียนในเคสว่ายังไม่เคยเห็น agent พลาด | ใช้ชื่อ `-guard` ตามข้อปรับทีมที่ผู้ใช้รับแล้ว | ข้อปรับทีมแก้ไฟล์เมื่อผู้ใช้สั่ง "รวมบทเรียน" เท่านั้น จะเปลี่ยนชื่อทุกเคสพร้อมกันตอนนั้น |
| 2026-10-24 | ผู้ใช้แก้ — หยุดทดสอบตัวถอดเสียง ไปทำ text-to-speech แทน | ทดสอบ whisper.cpp ให้จบ | ผู้ใช้ถามว่า "อยากได้ด้วยเหรอ" และบอกว่าอยากได้ TTS มากกว่า · เสียงที่มาจากสคริปต์ทำซับจากสคริปต์ได้เลย ไม่ต้องถอดเสียง |
| 2026-10-23 | มาตรา 17 กลับเป็น "ฟ้องที่ศาลภูมิลำเนาผู้บริโภคแห่งเดียว" | คงข้อความที่มีอยู่ | ราชกิจจานุเบกษา + 4 แหล่งอิสระตรงกัน ข้อความเดิมอ่านกลับความหมาย · ศาลของผู้บริโภคที่เป็นโจทก์มีแหล่งทางการแหล่งเดียว จึงติด (รอยืนยัน) |

## รอผู้ใช้
ไม่เกิน 10 แถว · แถวบนสุดคือข้อที่ **ต่อไป** ในคำตอบชี้ให้ผู้ใช้ทำ · "ทำไมต้องเป็นคุณ" ใช้ 4 ค่า: ตัดสิน · ตรวจด้วยตาหรือหู · ใช้เงินหรือ token · รับรองข้อความที่ agent เขียนแทน · agent ลบแถวทันทีที่ผู้ใช้ตอบหรือปลดล็อกแล้ว
| เรื่อง | ทำไมต้องเป็นคุณ | หลักฐาน | ปลดล็อกอะไร · ตอบแบบไหน | วันที่เพิ่ม |
|---|---|---|---|---|
| อัปเดต plugin ในเครื่อง | ตัดสิน | main มีรุ่นใหม่แล้ว (`f784b41`) แต่ `installed_plugins.json` ยังเป็น software-company 2.7.0 กฎและ hook ใหม่จึงไม่ทำงาน | `/plugin marketplace update sqt-marketplace` แล้ว `/plugin update software-company@sqt-marketplace` (ตาม `docs/INSTALL.md`) · ติดตั้ง `superuser` และ plugin สาขาที่ใช้ · ถอดตัวเก่าที่ถูกรวมแล้ว | 2026-10-23 |
| หน้าเว็บ F5-TTS-THAI ล้มที่ torchcodec (ไม่กระทบ skill) | ตัดสิน · ติดตั้งทั้งเครื่อง | torchaudio 2.11 ต้องมี DLL ของ FFmpeg รุ่น shared · สคริปต์ของ skill เลี่ยงได้แล้ว | ติดตั้ง FFmpeg รุ่น shared ใส่ PATH เอง หรือบอกให้เตรียมคำสั่ง | 2026-10-24 |
| merge PR ของ `chore/superuser-notes-2026-10-23` เข้า main | ตัดสิน | push แล้ว 2026-10-24 · มี commit ของอีกเครื่องมือ 8 ตัวอยู่ใน branch นี้ด้วย | เปิด PR บนเว็บแล้วกด merge (agent merge เองไม่ได้) | 2026-10-24 |
| tag รุ่นใหม่ (ไม่บังคับ) | ตัดสิน | repo ไม่เคยมี git tag · การติดตั้งอ่านเลขรุ่นจาก plugin.json | ตอบ "tag" ถ้าอยากมี | 2026-10-23 |
| อ่านออกเสียงคู่ตัวอย่างภาษาไทย 5 คู่ใน `human-writing/references/thai-examples.md` | ตรวจด้วยตาหรือหู | ทุกคู่ติดป้าย (ชั่วคราว) | เอาป้ายออก · ตอบ "รับ" หรือแก้ข้อความ | 2026-10-22 |
| รัน eval ที่เสียเงิน: `claude plugin eval` ของ superuser · `evals/review-recall --run` | ใช้เงินหรือ token | ยังไม่เคยรันจริง | วัดผลได้จริง · ตอบ "รัน eval" | 2026-10-23 |

## รับงานต่อ
- **ทำต่อเป็นข้อแรก:** เปิด PR ของ `chore/superuser-notes-2026-10-23` (commit + push ครบแล้ว 2026-10-25 · `gh` ยังไม่ได้ login → ผู้ใช้เปิดบนเว็บหรือรัน `gh auth login`) แล้วผู้ใช้ merge · F5 บนเครื่องนี้ (CPU) ใช้ทดสอบสั้น ๆ เท่านั้น รันยาวแล้วหน่วยความจำเกือบหมด · ถามผู้ใช้เรื่องอัปเดต plugin ในเครื่อง · ทบทวน skill วิดีโอด้วย `/skill-doctor` ราว 2026-11-24 (รอบแดงของ `video-editing` ทำถูกโดยไม่มี skill · ดูว่าควรย่อเหลือสคริปต์กับข้อเท็จจริงที่โมเดลไม่รู้เองไหม) · งานต่อไปบน repo แตก branch ใหม่จาก main (`f784b41`) ไม่ commit ลง main ตรง · ข้อปรับทีม 3 ข้อจาก learn `2026-10-23-release-round2.md` ผู้ใช้ "รับ" แล้ว อยู่ในคิวกลาง ลงมือเมื่อผู้ใช้สั่ง "รวมบทเรียน" · ได้คำตอบแล้วทำตาม · ก่อน commit อะไรต่อ เทียบบรรทัดที่เพิ่มกับ input ของ tool ใน transcript ของ session (ไม่ใช่ผลที่อ่าน) เพื่อแยกงานของอีกฝั่ง
- **รออนุมัติ:** commit · push · merge · tag · eval ที่เสียเงิน · แตะไฟล์ของอีกฝั่ง
- **ค้างอยู่:** `items.json` ที่รากเป็นภาพรวมเก่า 12 ต.ค. ไม่มีตัวสร้าง · ตัวบทราชบัณฑิตยสภาเรื่องไม้ยมกและประกาศทับศัพท์ 2532 · ข้อความ licence เต็มของ GSAP · ข้อที่ agent ติด (ยังไม่ได้ตรวจ) ไว้ใน skill ใหม่ (เช่น ม.17/17-1 พ.ร.บ.คุ้มครองแรงงาน · rate limit ของ Shopee/Lazada · ค่า API ของ PEAK/FlowAccount)
- **ข้อเสนอที่ยังไม่ได้ทำ:** ตัวตรวจ `plugin:ชื่อ` ใน validator · ตรวจลำดับหัวรุ่นใน CHANGELOG (รายละเอียดใน `IMPROVEMENTS.md`)
- **ระวัง:** อย่าแก้ไฟล์ของงานอีกฝั่ง · eval review-recall มีไฟล์ตั้งใจพัง (ลิงก์เสีย · ซึ่ง/โดย เกินงบ) ใน `evals/review-recall/cases/` ตัวตรวจที่เพิ่มใหม่ต้องข้ามโฟลเดอร์นี้ · `data-analysis` ต้องใช้ matplotlib 3.11 ขึ้นไป (3.10 วรรณยุกต์ซ้อนสระบนหาย)

## ไฟล์อื่น
`HISTORY.md` งานที่เสร็จแล้ว · `IMPROVEMENTS.md` · `handoff/` ใบสั่งและใบส่งงาน · `log/` · `learn/` · `inbox/` (ทั้งหมดอยู่ใน `.claude/superuser/` · log learn inbox state ไม่ commit ตาม `.gitignore`) · ผลค้นคว้าอยู่ใน `.claude/superuser/research/`
