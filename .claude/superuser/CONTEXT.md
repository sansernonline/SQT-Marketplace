# SQT-Marketplace — CONTEXT

> คนและ bot ทุกตัวอ่านหัวข้อ "ความคืบหน้า" และ "รับงานต่อ" ก่อนทำงาน (หัวข้ออื่นเปิดเมื่อต้องใช้) · อัปเดต: 2026-10-25 16:53 โดย superuser (Opus 5.5)

## งานนี้คืออะไร
marketplace plugin ของ Square Tech: 6 plugin = `superuser` (แกนกลาง) + 5 สาขา (software-company · personal-life · e-commerce · trading-finance · graphic-design) · ส่งออกไป claude.ai · Codex · Gemini · Kimi ผ่าน `dist/` · 2026-10-25 รวม `thai-workplace` เข้า e-commerce (`line-richmenu` ไป graphic-design) และ `reverse-engineer` เข้า skill `reverse-engineering` ของ software-company
main = `a7c95b6` (merge PR #4: รวม plugin เหลือ 6 · จัดที่ skill/agent · สคริปต์ reverse-engineering · hook `ui-scan`) · branch `refactor/merge-plugins-6` และ `chore/superuser-notes-2026-10-23` ลบแล้วทั้งในเครื่องและบน GitHub

## เป้าตอนนี้
ไม่มีงานค้างบน repo · ต่อไป: ผู้ใช้อัปเดต plugin ในเครื่อง แล้วลอง hook `ui-scan` กับ mockup จริง 1 งาน

## ความคืบหน้า
| งาน | สถานะ | หลักฐาน | อัปเดต |
|---|---|---|---|
| hook `ui-scan` (สแกนไฟล์ UI หลัง Write/Edit) · `slop_scan.py --url` · `ui-craft/scripts/design_tokens.py` · `live-and-variants.md` · ข้อ 7 จังหวะให้ยิ้ม · เช็กลิสต์ข้อมูลยาก เน็ตช้า เป้ากด 44px · ส่วนที่ขาดเมื่อเทียบกับ pbakaus/impeccable | เสร็จ · commit `e1ccbf0` · merge ใน `a7c95b6` | self-test hook 10/10 · slop_scan 43/43 · design_tokens 9/9 · ลอง input แบบ Claude Code ได้ผลตามคาด (เจอบั๊ก hook ไม่รันบน Windows แก้แล้ว) · build-dist 4 ขั้นผ่าน · validator error 0 · ยังไม่ได้ลองกับ mockup จริง | 2026-10-25 |
| จัดที่ skill/agent: `money-planner` · `image-artist` ไป graphic-design · แถวตัวกระตุ้น · ข้อความค้าง | เสร็จ · commit `5699857` · merge ใน `a7c95b6` | validator error 0 · ผู้ตรวจรอบ 1 พบ 5 ข้อ แก้แล้ว 4 ไม่แก้ 1 (Roadmap) | 2026-10-25 |
| รวมเหลือ 8 plugin | เสร็จ | commit `06e5aef` | 2026-10-23 |
| กฎภาษาไทยจาก kien-thai · `thai_tells.py` · skill-authoring · translate-th-en · hook guard/recompact | เสร็จ | commit `f42637b` | 2026-10-23 |
| skill ใหม่ 4 · ส่วนเสริมจากการเทียบ ~110 จุด · ชุดออกแบบ · prompt · docs รูป dist | เสร็จ | commit `7584e5e` | 2026-10-23 |
| รอบ 2: skill ใหม่ 5 (hiring-th · thai-business-setup · infra-as-code · data-analysis · course-builder) · reference 5 (Figma · docs site · API บัญชีไทย · API ร้านค้าไทย · เครื่องมือผลิตวิดีโอ) | เสร็จ | commit `e4ded99` (89 ไฟล์ เฉพาะของทีมเรา) | 2026-10-23 |
| รอบ 2: hook คอลัมน์ "รีวิวผ่านแล้วผู้ใช้ยังแก้" · eval review-recall (สร้าง ไม่รัน) · validator ตรวจลิงก์ภายใน · ตารางระยะบรรทัดไทย · `thai_tells.py` ไม่เตือนขีดในช่องตาราง | เสร็จ | commit `e4ded99` · hook self-test 83/83 · validator self-test 18/18 · review-recall `--verify` ผ่าน | 2026-10-23 |
| เลื่อนรุ่น 6 plugin · CHANGELOG ครบทุกรุ่น (เติมส่วนเสริมที่ลงโค้ดแล้วแต่ยังไม่มีบรรทัด) · ตัวชี้ `seller-tax-basics` 8 จุด · มาตรา 17 · 18 · 20 ใน `complaint-letter-th` ตามราชกิจจานุเบกษา · description นับ skill ใหม่ | เสร็จ | commit ถัดจาก `e4ded99` (`chore(release)`) · validator 488 รายการ error 0 | 2026-10-23 |
| prompt ใหม่ `prompt/personal-life/prompt-podcast-lesson.md` 5 ฉบับ (บทเรียน podcast พร้อมสไลด์) | commit แล้วใน `ccc56df` (อีกเครื่องมือ commit ให้) · แก้ตามรอบทดสอบจริง 11 จุด commit ใน feat graphic-design 2026-10-24 | agent ตัวใหม่ทำฉบับ 1–3 จริงใน `_to_delete/podcast-test/` (ลบแล้ว 2026-10-25) (54 นาที) | 2026-10-24 |
| prompt ทุกไฟล์ชี้กฎวนจนเสร็จเป็นข้อ 3 (เดิมชี้เลขเก่า 71 ไฟล์) · ใส่เลขเก่าใน `retired` | commit `c89b8b7` (retired อยู่ใน commit ถัดไป) | `sync-prompt-rules` 25 ไฟล์ · เหลือเลขเก่า 0 ไฟล์ | 2026-10-24 |
| graphic-design: skill `video-editing` (รวมหัวข้อสไลด์กับเสียงบรรยายแล้ว) · `subtitles-th` + agent `video-editor` · สคริปต์ 4 ตัว · eval 9 เคส · router · triggers · playbook `video` · FILE-MAP · CHANGELOG | commit feat graphic-design 2026-10-24 | สคริปต์ทุกตัวรันกับไฟล์จริงผ่าน (ffmpeg 9.0.2) · validator 492 รายการ error 0 · router 12 ประโยคถูกทั้งหมด · รอบแดง/เขียวด้วย haiku: `subtitles-th` แดงพลาด (เลื่อนเวลาซับโดยไม่ฟัง · ฟอนต์ไม่ดูใบอนุญาต) เขียวแก้ได้ · `video-editing` และหัวข้อสไลด์แดงทำถูกอยู่แล้ว | 2026-10-24 |
| dist 8 plugin และเอกสาร sync | สร้างใหม่หลังรวม skill แล้ว | `scripts\build-dist.cmd` exit 0 · ไม่มีชื่อ skill เดิมค้างใน `dist/` | 2026-10-24 |
| commit + push งานรอบ 2026-10-24 บน `chore/superuser-notes-2026-10-23` | เสร็จ · `c89b8b7` (ทีมเรา) + `bcb9742` · `9a4479f` · `00033de` (อีกเครื่องมือ commit และ push งานของเราเองภายใน 1 นาที ข้อความตรงกับงาน) · local = remote `00033de` · ยังไม่มี PR | validator 492 รายการ error 0 บน HEAD · sync ทุกตัวตรง · ไม่พบค่าลับใน diff | 2026-10-24 |
| ทดสอบ whisper.cpp ถอดเสียงไทย | หยุดตามผู้ใช้ (อยากได้ TTS มากกว่า) · `subtitles-th` ข้อ 2 ยังติดป้ายว่ายังไม่ได้รันจริง | ได้ไบนารี `b5454` hash ตรงกับ GitHub · เสียงทดสอบ Pattara 33.7 วินาทีที่ `_to_delete/whisper-test/work/tts.wav` (ลบแล้ว 2026-10-25) · โมเดลโหลดไม่ครบ | 2026-10-24 |
| text-to-speech ภาษาไทย: หัวข้อเสียงบรรยายจากสคริปต์ใน `video-editing` (เดิมทำเป็น skill `tts-th` แล้วผู้ใช้เลือกรวม) · `scripts/tts_cues.py` · `f5_worker.py` · `windows_tts.ps1` + eval `video-editing-tts-*` 3 เคส + router · triggers · playbook `video` · agent `video-editor` · prompt podcast ฉบับ 4 · CHANGELOG · facts | commit + push 2026-10-24 ตามที่ผู้ใช้สั่ง · ผู้ตรวจ 2 รอบผ่าน (รอบ 1 กลาง 3 ต่ำ 8 · รอบ 2 ต่ำ 5 · แก้ครบ) · หลังรวม: validator 492 รายการ error 0 · router แถว TTS 20/20 · ทดสอบย่อย 10/10 | ผู้ใช้เลือก F5-TTS-THAI ตัวหลัก edge-tts ตัวรอง · ทดสอบจริง 3 เครื่องจนได้วิดีโอ 32.21 วินาที · validator 493 รายการ error 0 · router 14/14 · แดง/เขียว haiku: แดงทำถูก 205k token 10.3 นาที เขียว 144k 4.8 นาที · ตัวอย่างเสียง `_to_delete/tts-samples/listen/index.html` (ลบแล้ว 2026-10-25) · ค้น 58 แหล่ง `_to_delete/tts-research.md` | 2026-10-24 |
| รวมบทเรียน 11 ข้อจากคิวกลาง (hook 3 · validator 4 · ข้อความ skill 4) ใน worktree `SQT-lessons` บน branch `chore/superuser-notes-2026-10-23` | เสร็จ · commit `21dfda8` + `0cd886d` push แล้ว · worktree ลบแล้ว | hook self-test 86/86 · validator self-test 22/22 · validator 492 รายการ error 0 warning 5 · ตัวนับข้อรอรวม 11 → 0 · ผู้ตรวจผ่าน (ต่ำ 4 แก้ 2) · dist สร้างใหม่ exit 0 | 2026-10-25 |
| ลบไฟล์เก่า: `items.json` · `CONTEXT-superuser-3.0.md` · `HANDOFF-reverse-engineer.md` · branch `chore/skill-audit-2026-10-12` · ของใน `_to_delete/` ราว 2 GB | เสร็จ · **พลาด:** ตัวอย่างเสียง ไฟล์ทดสอบ whisper podcast และ TTS ถูกลบไปด้วย (ตั้งใจเก็บ) ผลที่จดในแถวด้านบนยังถูก แต่ไฟล์หลักฐานไม่มีแล้ว · สำรองโค้ด REA กู้จากต้นฉบับ Kimi แล้ว | `ls -F` ต่อท้ายโฟลเดอร์ด้วย `/` รายการเก็บจึงจับไม่ได้ · ต่อไปใช้ `find -maxdepth 1 -printf '%f'` | 2026-10-25 |
| รวม plugin เหลือ 6: thai-workplace → e-commerce (19 skill · 8 คำสั่ง · 4 agent · 5 playbook · prompt 4 ไฟล์) · line-richmenu → graphic-design · reverse-engineer → `reverse-engineering` + agent `reverse-engineer` ของ software-company | เสร็จ · commit `1a3e583` · merge ใน `a7c95b6` | validator 472 รายการ error 0 · sync ทุกตัวตรง · hook 86/86 · validator self-test 22/22 · `check-tools.mjs --self-test` ผ่าน · make.py และ build-dist ใหม่ | 2026-10-25 |
| `reverse-engineering` สคริปต์ใหม่ 5 ตัว (`dotnet_meta` · `wasm_info` · `sqlite_inspect` · `ipa_inventory` · `evm_selectors`) ผูกเข้า SKILL.md §4 · agent · native-binaries §2 · CHANGELOG · งานเติมให้เท่า REA ส่วนที่เหลือหยุด (คำสั่งถูกระบบความปลอดภัยหยุด) | เสร็จ · commit `bab1d5f` · merge ใน `a7c95b6` | self-test 5/5 · dotnet_meta รันกับ System.Configuration.dll · validator 473 รายการ error 0 · sync ตรง · build-targets exit 0 | 2026-10-25 |

## กติกา
- ไม่ commit · push · merge main · tag เว้นแต่ผู้ใช้สั่งในรอบนั้น
- ของกลางแก้ที่ `plugins/superuser` แล้วรัน `node scripts/sync/sync-superuser.mjs`
- skill ใหม่ต้องเพิ่มให้ครบ: CHANGELOG `Unreleased` · `scripts/sync/file-map-th.json` · `scripts/diagrams/labels/<plugin>.json` (skill_groups มีเฉพาะ software-company และ superuser · playbook กลางต้องมีแถวใน labels ของทุกสาขา) · `triggers.md` ของ plugin · ถ้าเป็นของกลาง เพิ่มใน `SHARED_ONLY_IN_SUPERUSER` + `SHARED_SKILLS` + `hooks/skill-router.json`
- ก่อนจบทุกรอบ: `node scripts/check/validate-marketplace.mjs` (+ `--self-test`) · `sync-docs.mjs` · `sync-file-map.mjs --check` · `sync-prompt-rules.mjs --check` · `node plugins/superuser/hooks/superuser-hook.mjs --self-test` · `python plugins/superuser/skills/human-writing/scripts/thai_tells.py --self-test` · เพิ่ม/ลบ skill หรือ playbook → `python scripts/diagrams/make.py` · ปิดท้าย `scripts\build-dist.cmd`
- licence: trailofbits/OWASP = CC-BY-SA (ใช้ไอเดีย เขียนใหม่) · borghei = MIT + Commons Clause (เขียนใหม่) · anthropics docx/pptx/healthcare = ลิงก์เท่านั้น
- ภาษาไทยทุกไฟล์ตาม `human-writing` · ไม่ใส่อีโมจิ
- **มีงานอีกฝั่ง (น่าจะเป็น Codex CLI) แก้ repo นี้พร้อมกัน** — เทียบ `git status` ก่อนและหลังทุกงาน · ไฟล์ที่เปลี่ยนโดยไม่ได้มาจากทีมเรา ห้ามแตะและห้าม commit จนผู้ใช้สั่ง · ตั้งแต่ 2026-10-25 งานใหม่แยก worktree ต่อเครื่องมือ ชื่อ branch `claude/…` · `codex/…` (`superuser` กฎข้อ 9 · `team-files` หัวข้อ "หลาย AI ใน repo เดียว")

## ของอยู่ที่ไหน
| ไฟล์ | คืออะไร |
|---|---|
| `.claude/superuser/research/skill-comparison-2026-10-22.md` | เทียบ skill ตัวต่อตัวกับ repo เปิด ~40 ตัว + หมวดที่ยังไม่มี |
| `.claude/superuser/research/kien-thai-research.md` | ผลค้น kien-thai · กวาด Thai ทุก plugin |
| `.claude/superuser/research/design-skills-research.md` | skill ออกแบบที่ดี |
| `.claude/superuser/research/dynamic-website-research.md` | สูตรเว็บมีชีวิต (ai4ba) |
| `scripts/evals/review-recall/` | eval วัด reviewer · `--verify` ฟรี · `--run` เสียเงิน |
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
| 2026-10-25 | ผู้ใช้เลือก — รวม thai-workplace ทั้งหมดเข้า e-commerce ส่วนกราฟิก (`line-richmenu`) ไป graphic-design | ย้ายแค่ `seller-tax-basics` (ตัวแนะนำ) · plugin ธุรกิจชื่อใหม่ | ผู้ใช้ตอบ |
| 2026-10-25 | reverse-engineer รวมเข้า skill `reverse-engineering` เดิม ไม่ย้ายทั้งชุด | ย้าย 9 skill + agent ตามที่เป็น | ผู้ใช้เลือก · กันชื่อ reverse-engineer กับ reverse-engineering ซ้อนกัน |
| 2026-10-25 | เลื่อนรุ่นไว้รอบออกรุ่น ใส่แค่ `Unreleased` ใน CHANGELOG 3 ตัว | เลื่อน plugin.json ทันที | graphic-design และ software-company มี `Unreleased` ค้างอยู่แล้ว เลื่อนตอนนี้จะไม่ตรงกับ CHANGELOG |
| 2026-10-25 | ไม่ใส่ `thai-workplace` ใน `retired` ของ facts.json | ใส่ | README และ PLUGINS.md ตั้งใจเก็บชื่อเดิมไว้บอกว่ารวมมาจากไหน ตัวตรวจจะแจ้งผิด |
| 2026-10-25 | e-commerce เก็บชื่อเดิม ไม่เปลี่ยนชื่อ plugin | เปลี่ยนเป็นชื่อธุรกิจ | ผู้ใช้เลือกรวมเข้า e-commerce · คนที่ติดตั้ง e-commerce อยู่ไม่ต้องลงใหม่ |
| 2026-10-25 | `scam-check` และ `insurance-review` อยู่ trading-finance ต่อ ให้ agent `money-planner` ใหม่ดูแล | ย้ายไป personal-life (ผู้ใช้เลือกชุดที่มีการย้ายนี้) | โหวต 3 agent: ต้นทุน · ความเสี่ยง · ส่งเร็ว = อยู่ที่เดิม 3 ต่อ 0 · `scam-check` ถูกอ้าง 20 ไฟล์ รวม playbook และกฎฉุกเฉิน ย้ายแล้วต้องแก้อย่างน้อย 18 ไฟล์ |
| 2026-10-25 | ไม่แก้ "Agents (4)" ในหัวข้อ Roadmap ของ `docs/PLUGINS.md` | แก้ตามที่ผู้ตรวจเสนอ | เป็นแผนเดิมของ 2026-10-06 (ยังมี thai-workplace อยู่ในนั้น) ไม่ใช่รายการปัจจุบัน |
| 2026-10-25 | hook `ui-scan` เป็นไฟล์แยก `ui-scan-hook.mjs` · โมดูล `ui_scan` ค่าเริ่มเปิด · ทำงานโดยไม่ต้องมีโฟลเดอร์ทีม | ใส่ใน `superuser-hook.mjs` | hook หลักออกทันทีเมื่อไม่มี `.claude/superuser/` · ไฟล์แยกถอดได้ด้วยการลบแถวเดียวใน `hooks.json` |
| 2026-10-25 | P0/P1 ส่งกลับให้แก้ (`decision: block` หลังเขียน) · P2 แจ้งเป็นบริบท · ผลเดิมไม่เตือนซ้ำ | หยุดก่อนเขียน (PreToolUse) | ไฟล์ต้องเขียนก่อนถึงสแกนได้ · ข้อที่ตั้งใจคงไว้ใส่ `slop-ok` ได้ |
| 2026-10-25 | ไม่ทำส่วนขยายเบราว์เซอร์และ `overdrive` ของ impeccable | ทำตามครบทุกคำสั่ง | `--url` แทนส่วนขยายได้ · เอฟเฟกต์มีใน `depth-and-flourish.md` และขัดงบการเคลื่อนไหว |
| 2026-10-25 | PR #4 merge แบบ merge commit ล็อก head `e1ccbf0` | squash | แบบเดียวกับ PR #2 · #3 · เก็บ commit แยกตามงาน |
| 2026-10-25 | `hiring-th` · `thai-business-setup` ให้ `tax-helper` ดูแล | รวม `compliance-helper` เข้า agent หลังบ้านตัวเดียว | แก้น้อยไฟล์ ย้อนง่าย · การรวม agent เป็นงานแยก |

## รอผู้ใช้
ไม่เกิน 10 แถว · แถวบนสุดคือข้อที่ **ต่อไป** ในคำตอบชี้ให้ผู้ใช้ทำ · "ทำไมต้องเป็นคุณ" ใช้ 4 ค่า: ตัดสิน · ตรวจด้วยตาหรือหู · ใช้เงินหรือ token · รับรองข้อความที่ agent เขียนแทน · agent ลบแถวทันทีที่ผู้ใช้ตอบหรือปลดล็อกแล้ว
| เรื่อง | ทำไมต้องเป็นคุณ | หลักฐาน | ปลดล็อกอะไร · ตอบแบบไหน | วันที่เพิ่ม |
|---|---|---|---|---|
| อัปเดต plugin ในเครื่อง | ตัดสิน | main มีรุ่นใหม่แล้ว (`a7c95b6`) แต่ `installed_plugins.json` ยังเป็นรุ่นเก่า กฎ hook และ `ui-scan` ใหม่จึงไม่ทำงาน | `/plugin marketplace update sqt-marketplace` แล้ว `/plugin update <plugin>@sqt-marketplace` (ตาม `docs/INSTALL.md`) · ติดตั้ง `superuser` และ plugin สาขาที่ใช้ · ถอด `thai-workplace` · `reverse-engineer` ที่ถูกรวมแล้ว | 2026-10-23 |
| ลอง hook `ui-scan` กับ mockup จริง 1 งาน | ตรวจด้วยตาหรือหู | ทดสอบแค่ไฟล์ตัวอย่าง · ยังไม่รู้ว่าเตือนถี่หรือรบกวนแค่ไหนในงานจริง | ใช้งานตามปกติแล้วบอกผล · เตือนเยอะเกิน → ปรับระดับหรือปิด `ui_scan` | 2026-10-25 |
| หน้าเว็บ F5-TTS-THAI ล้มที่ torchcodec (ไม่กระทบ skill) | ตัดสิน · ติดตั้งทั้งเครื่อง | torchaudio 2.11 ต้องมี DLL ของ FFmpeg รุ่น shared · สคริปต์ของ skill เลี่ยงได้แล้ว | ติดตั้ง FFmpeg รุ่น shared ใส่ PATH เอง หรือบอกให้เตรียมคำสั่ง | 2026-10-24 |
| tag รุ่นใหม่ (ไม่บังคับ) | ตัดสิน | repo ไม่เคยมี git tag · การติดตั้งอ่านเลขรุ่นจาก plugin.json | ตอบ "tag" ถ้าอยากมี | 2026-10-23 |
| อ่านออกเสียงคู่ตัวอย่างภาษาไทย 5 คู่ใน `human-writing/references/thai-examples.md` | ตรวจด้วยตาหรือหู | ทุกคู่ติดป้าย (ชั่วคราว) | เอาป้ายออก · ตอบ "รับ" หรือแก้ข้อความ | 2026-10-22 |
| รัน eval ที่เสียเงิน: `claude plugin eval` ของ superuser · `scripts/evals/review-recall --run` | ใช้เงินหรือ token | ยังไม่เคยรันจริง | วัดผลได้จริง · ตอบ "รัน eval" | 2026-10-23 |

## รับงานต่อ
- **ทำต่อเป็นข้อแรก:** งานรวม plugin เหลือ 6 และ hook `ui-scan` เข้า main แล้ว (`a7c95b6` · PR #4) · ถามผู้ใช้เรื่องอัปเดต plugin ในเครื่อง (คนที่ติดตั้ง `thai-workplace` หรือ `reverse-engineer` ไว้ต้อง uninstall แล้วติดตั้ง e-commerce / software-company) และผลลอง `ui-scan` กับ mockup จริง · F5 บนเครื่องนี้ (CPU) ใช้ทดสอบสั้น ๆ เท่านั้น รันยาวแล้วหน่วยความจำเกือบหมด · ทบทวน skill วิดีโอด้วย `/skill-doctor` ราว 2026-11-24 (รอบแดงของ `video-editing` ทำถูกโดยไม่มี skill · ดูว่าควรย่อเหลือสคริปต์กับข้อเท็จจริงที่โมเดลไม่รู้เองไหม) · งานต่อไปบน repo แตก branch ใหม่จาก main (`a7c95b6`) ไม่ commit ลง main ตรง · ข้อปรับทีม 3 ข้อจาก learn `2026-10-23-release-round2.md` ผู้ใช้ "รับ" แล้ว อยู่ในคิวกลาง ลงมือเมื่อผู้ใช้สั่ง "รวมบทเรียน" · ได้คำตอบแล้วทำตาม · ก่อน commit อะไรต่อ เทียบบรรทัดที่เพิ่มกับ input ของ tool ใน transcript ของ session (ไม่ใช่ผลที่อ่าน) เพื่อแยกงานของอีกฝั่ง
- **รออนุมัติ:** commit · push · merge · tag · eval ที่เสียเงิน · แตะไฟล์ของอีกฝั่ง
- **ค้างอยู่:** ตัวบทราชบัณฑิตยสภาเรื่องไม้ยมกและประกาศทับศัพท์ 2532 · ข้อความ licence เต็มของ GSAP · ข้อที่ agent ติด (ยังไม่ได้ตรวจ) ไว้ใน skill ใหม่ (เช่น ม.17/17-1 พ.ร.บ.คุ้มครองแรงงาน · rate limit ของ Shopee/Lazada · ค่า API ของ PEAK/FlowAccount)
- **ข้อเสนอที่ยังไม่ได้ทำ:** ตัวตรวจ `plugin:ชื่อ` ใน validator · ตรวจลำดับหัวรุ่นใน CHANGELOG (รายละเอียดใน `IMPROVEMENTS.md`)
- **ระวัง:** อย่าแก้ไฟล์ของงานอีกฝั่ง · eval review-recall มีไฟล์ตั้งใจพัง (ลิงก์เสีย · ซึ่ง/โดย เกินงบ) ใน `scripts/evals/review-recall/cases/` ตัวตรวจที่เพิ่มใหม่ต้องข้ามโฟลเดอร์นี้ · `data-analysis` ต้องใช้ matplotlib 3.11 ขึ้นไป (3.10 วรรณยุกต์ซ้อนสระบนหาย)

## ไฟล์อื่น
`HISTORY.md` งานที่เสร็จแล้ว · `IMPROVEMENTS.md` · `handoff/` ใบสั่งและใบส่งงาน · `log/` · `learn/` · `inbox/` (ทั้งหมดอยู่ใน `.claude/superuser/` · log learn inbox state ไม่ commit ตาม `.gitignore`) · ผลค้นคว้าอยู่ใน `.claude/superuser/research/`
