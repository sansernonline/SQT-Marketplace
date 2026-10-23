# ผลค้นคว้า kien-thai → human-writing และ superuser (2026-10-22)

ที่มา: github.com/chakrit/kien-thai commit 3695c88 (2026-07-27) · MIT · Chakrit Wichian
ย่อ: HW = plugins/superuser/skills/human-writing · TG = HW/references/thai-grammar.md · SR = HW/references/strict-review.md · SU = plugins/superuser

## A. human-writing — กฎที่ขัดกันเอง (แก้ก่อน)
| # | เรื่อง | ของเรา | แก้ |
|---|---|---|---|
| A1 | ตัดคำ | HW/SKILL.md:89 "มีคำไหนตัดได้ให้ตัด" | +1 บรรทัด: จะ ให้ ก็ ด้วย แล้ว ต่างหาก และคำสุภาพ (ขอ รบกวน นะ) ทำงานจริง ตัดแล้วห้วน · แถว t-overcut ใน TG |
| A2 | งบคำเชื่อม | TG:128 ไม่ยกเว้นคำปิดท้าย | ไม่นับ ด้วย แล้ว เลย อยู่ |
| A3 | ผู้ตัดสิน | SR:27 โมเดลเล็กตรวจแล้วบอก "ผ่าน" | "ผ่าน" = ผ่านกฎ ไม่ใช่อ่านลื่น · ป้าย อ่านแบน · คำตัดสินสุดท้ายของเจ้าของ |
| A4 | ไม่รู้ให้ถาม | TG:168 | ใช้ค่าตั้งต้น (ผม · ระดับอธิบาย) ลง ตัดสินใจเอง |
| A5 | ไม่ใช่แค่…แต่ | HW:38 ห้ามทั้งหมด | ห้ามเฉพาะแบบสโลแกน · ยอมเมื่อเป็นการเทียบจริง |

## B. human-writing — ของที่ขาด
| # | เพิ่ม | ที่ | ขนาด | คุณค่า |
|---|---|---|---|---|
| B1 | ตัวอย่างก่อน/หลังระดับย่อหน้า 4–6 คู่ (README · รายงาน · ราชการ · ขายของ) เขียนเอง ไม่ลอก KT · ใช้เป็น fixture ของ B2 | references/thai-examples.md ใหม่ | ~60 | สูง |
| B2 | thai_tells.py stdlib: คำต้องห้ามนอก backtick · นับ ซึ่ง/โดย/ดังนั้น ต่อย่อหน้า · จุดกลางย่อหน้า `[ก-๛]\.\s*[ก-๛]` · ๆ ไม่เว้นวรรค · ทำการ/มีการ/มีความ · ทั้งนี้ ขึ้นย่อหน้า · เตือนอย่างเดียว | HW/scripts ใหม่ | ~80 | สูง |
| B3 | รูปข่าว/release note: ประโยคแรก ประธาน+กริยา+กรรม · ที่มา · รายละเอียด · ปิดด้วยเวอร์ชัน/วันที่ | TG หลัง :184 | +2 | สูง |
| B4 | ระดับราชการ ~6 ข้อ (ภายใน X วัน นับจาก… · เซ็น→ลงนาม ทำ→ดำเนินการ เช็ค→ตรวจสอบ) · ลิงก์ไป thai-workplace:doc-thai-official · ตรวจว่าอ้างงานสารบรรณ ฉบับที่ 4 (2564) | TG §4 | +6 | กลาง |
| B5 | Checklist แปลอังกฤษ→ไทย: ถูก-passive → active · ไม่แปล it is…that · ไม่เติม ครับ/อาจจะ · สำนวนแปลตามความ · ชื่อต่างชาติ ไมเคิล แซนเดล (Michael Sandel) · ไม่ใช้ "ถูกพิจารณาว่า" | TG ส่วนใหม่ / references/translation-th.md | ~10–30 | กลาง |
| B6 | บุรุษสรรพนาม: ไม่ปน เรา/คุณ/ใคร ในย่อหน้าเดียว · B2B ใช้ บริษัท/ชื่อทีม | TG หลัง :167, :171 | +3 | กลาง |
| B7 | AI tell เพิ่ม: ระบบบังคับให้ · สำหรับผมแล้ว ผมคิดว่า · ไม่ต้องกังวล · ทุกสิ่งที่คุณต้องรู้ · อย่างน่าทึ่ง · มีเส้นทาง…ระหว่าง | TG:125-145 | +4 แถว | กลาง |
| B8 | ๆ เว้นวรรคหน้าหลัง (ต่าง ๆ) · ทับศัพท์ไม่ใส่วรรณยุกต์ (ซอฟต์แวร์) — อ้างราชบัณฑิตฯ เมื่อได้ตัวบทจริง | TG §3, §5 | +2 | ต่ำ-กลาง |
| B9 | `!` ตัวเดียวที่ hook/CTA ได้ · ครับ/ค่ะ ในบล็อกส่วนตัวตอนพูดกับคนอ่าน · กฎย่อย grammar 4 ข้อ (ทีไร→ทุกที · ทดสอบ ก็ · ลักษณนามระดับทางการ · กริยา burst/cap/throttle) | TG | +5 | ต่ำ |
| B10 | วินัยเพิ่มกฎ: ต้องมีที่มา (คำแก้ของเจ้าของหรือแหล่งที่อ่านจริง) ไม่งั้นติด (ชั่วคราว) | ท้าย TG | +2 | กลาง |
| B11 | THIRD-PARTY-NOTICES ข้อความ MIT เต็มของ KT (TG ดัดแปลงมาเยอะ มีแค่บรรทัดให้เครดิต) | HW ใหม่ | ~21 | ต้องทำ (สัญญาอนุญาต) |

## C. superuser — วิธีทำงาน
| # | เพิ่ม | ที่ | ขนาด | คุณค่า |
|---|---|---|---|---|
| C1 | ส่วน `## รอผู้ใช้` ≤10 แถว: เรื่อง · ทำไมต้องเป็นคุณ (ตัดสิน · ดูด้วยตา/หู · ใช้เงิน/token · รับรองข้อความที่เขียนแทน) · หลักฐาน · ปลดล็อกอะไร · วันที่ | templates/CONTEXT.md + pickup-and-pause + unattended-run + SKILL.md:128 | ~10 | สูง |
| C2 | ชนิดพลาด 3 แบบ: ไม่ได้เปิด skill → แก้ trigger/router · เปิดแต่ไม่ทำตาม → แก้ถ้อยคำ/ตำแหน่ง/check · ไม่มีกฎ → คู่ตัวอย่างก่อน · grep ก่อนเรียกว่าช่องโหว่ | learning-reviewer.md:56-58 + playbook-learn-from-session ข้อ 2 | ~8 | สูง |
| C3 | ชนิดการแก้ "คู่ตัวอย่าง (ก่อน → หลัง)" — "หลัง" ต้องเป็นของผู้ใช้ ห้าม agent เขียนเอง · ซ้ำ 2 ครั้งค่อยเป็นกฎ · ≤10 คู่ต่อไฟล์ | learning-reviewer.md:33-43 · session-lessons-to-skills · owner-style-capture | ~6 | กลาง-สูง |
| C4 | validator: ลิงก์ .md ภายในต้องเปิดได้ · ชื่อ skill ใน backtick ตำแหน่งส่งต่อต้องมีจริง · + selfTest | scripts/check/validate-marketplace.mjs | ~40 | สูง |
| C5 | อัตรา "รีวิวผ่านแล้วผู้ใช้ยังแก้" ใน SUMMARY ของ hook (ใช้ correction:true + review line ที่มีอยู่) · ป้ายว่าเป็นสัญญาณประกอบ | superuser-hook.mjs :464-543 + learning-reviewer.md:16 | ~30 | สูง |
| C6 | ล้างข้อความคนดูแลใน skill ที่แจก (เช่น session-lessons-to-skills:11 "มาจาก…pstack" · repeated-mistakes-to-checks:49-51 path สคริปต์ · team-files, modules, learning-loop, team-memory) + validator เตือน | หลายไฟล์ + validator | ~10 จุด | กลาง |
| C7 | decision-log:50 ไม่แก้แถวเดิม → เพิ่มแถว `ผู้ใช้แก้ — แทนแถว <วันที่>` · คอลัมน์ ทบทวนเมื่อ (ไม่บังคับ) · docs/decisions/ ของ repo (ตัดสินใจ · ทำไมไม่เลือกทางปกติ · ขอบเขต · ทบทวนเมื่อ · สถานะ) | decision-log + docs/decisions ใหม่ | ~5 + ไฟล์ | กลาง |
| C8 | 1 บรรทัด: "reviewer ผ่าน" ไม่ใช่คำตัดสินงานภาษา/รสนิยม | superuser SKILL.md §7 หรือ evidence.md | +1 | กลาง |
| C9 | eval review-recall: งาน 8–10 ชิ้นฝังข้อผิด วัดว่า reviewer ชี้ตำแหน่งเจอไหม ไม่ใช้ judge · ทำ "รายงานจริง" ใน evals/coding ให้เทียบกับ exit code | evals/review-recall ใหม่ · run-coding.mjs | 150-200 | กลาง-สูง (แพง) |
| C10 | รอบแก้ส่งเกณฑ์เต็ม ไม่ส่งแค่ข้อที่ถูกชี้ · skill ที่รับบทเรียน 3 ครั้งแล้วพลาดไม่ลด → หยุดเติมข้อความ เปลี่ยนเป็น check/คู่ตัวอย่าง/ถอย | team-roles.md · playbook-learn-from-session | +2 | ต่ำ-กลาง |

## D. ไม่รับ
Typhoon/ollama (หลักฐานบาง · โหลดหลาย GB · API ส่งข้อความออกนอกเครื่อง) · ข้อความใน exemplars.md และ corpus (ลิขสิทธิ์คนอื่น) · ลอก examples.md ตรง ๆ (ขัดกฎตัวเอง) · marketing 4 ระดับย่อย · 555 แบบว่า · em-dash · หัวข้อแบบคำนาม/คำถาม · ห้าม LLM judge ทั้งหมด · pytest/uv · driver Python · hard-wrap 90 · repo map ใน hook

## F. กวาด plugin อื่น (2 agent · 2026-10-22) — ข้อความไทยส่วนใหญ่สะอาด grep blocklist 182 ไฟล์เจอ tell จริง ~4 จุด
### F1 ขัดกับผลค้น (แก้ก่อน)
| plugin:skill | ที่ | ปัญหา | แก้ |
|---|---|---|---|
| superuser:no-ai-look | references/catalog.md:85 | "ขีดยาวทุกประโยค → แยกเป็นประโยคด้วยจุด" → ไทยได้จุดกลางย่อหน้า (ขัด f3) | EN ใช้จุด · TH เว้นวรรคหรือขึ้นย่อหน้า |
| sqt-toolkit:presentation-design | SKILL.md:56,106-111 | งบ 12 คำ/บูลเล็ต · ~50 คำ/แผ่น · "ตัดคำตามงบ" → ตัด จะ ให้ แล้ว | งบเป็นบรรทัด (≤2) · ตัดบูลเล็ตหรือย้ายแผ่น ไม่ตัดคำทำหน้าที่ |
| software-company:commit-log / commit-message-format | commit-log:55 · cmf:87 | ≤50 ตัวอักษร นับสระ/วรรณยุกต์ไทย · กฎซ้ำ 2 ที่ | นับเฉพาะพยัญชนะ ~50 · เก็บกฎที่ commit-log ที่เดียว |
| software-company:technical-writer (agent) | :38, :98 | Flesch 60+ · ≤25 คำ/ประโยค เป็นเกณฑ์อังกฤษ | ไทยใช้อ่านออกเสียง + human-writing §8 |
| superuser:parallel-attempts-pick-best | :17 | เกณฑ์ "สั้นกระชับ" + โมเดลตัดสินภาษาไทย | "อ่านลื่นเมื่ออ่านออกเสียง" · ไทยให้เจ้าของเลือก |
| sqt-toolkit:spell-out-abbreviations ↔ srs-writing ↔ thesis | spell-out:10,16 · srs:202 · thai-academic-language.md:18 | รูปวงเล็บคำย่อ 3 แบบไม่ตรงกัน · srs อ้างกฎที่ spell-out ไม่มี | ใช้ thai-grammar §5 แถว 4 เป็นที่เดียว: ไทย (English: ABBR) |
| dev-learning:thesis-writing | thai-academic-language.md:5-14, :28 | ซ้ำ t-chueung/t-padding แบบไม่ครบ · "ได้…" ชวนเขียน ได้ทำการ | เหลือแถวเฉพาะวิทยานิพนธ์ + ลิงก์ §4 · เติม "ห้าม ได้ทำการ/ได้มีการ" |
| graphic-design:video-script-to-clip | :43 vs :26,29 | ห้าม ? แต่ตัวอย่าง hook ใช้ ? | ซับไตเติลห้าม ? · ข้อความ hook ใช้ได้ 1 ครั้ง |
| sqt-toolkit:polite-message-th-en | :23 | "ครับ/ค่ะ ทุกประโยค" | เปิด ปิด และหลังคำขอ (f4/f6) |
### F2 tell ใน template (แก้ตรงจุด)
| plugin:skill | ที่ | ข้อความ | แก้เป็น |
|---|---|---|---|
| online-seller:chat-reply-templates | references/templates.md:34 | "…คืนเงินเต็มจำนวนค่ะ ไม่ต้องกังวลนะคะ" | จบที่ข้อเท็จจริง + ขั้นถัดไป "…แอดมินจะแจ้งผลภายใน <เวลา> ค่ะ" |
| online-seller:chat-reply-templates | SKILL.md:48 | "แอดมิน" 3 ครั้งใน 1 ข้อความ | ตัดครั้งที่ 2-3 |
| online-seller:returns-and-bad-reviews | references/review-replies.md:6,9,12,15 | "ร้านได้…แล้ว" ทุกตอบ · :9 สัญญาลอย "กำลังปรับปรุงการจัดส่ง" | กริยาตรง "ร้านส่งของใหม่ให้แล้ว" · บอกสิ่งที่เปลี่ยนจริง 1 อย่าง |
| online-seller:product-listing | references/description-template.md:34-37 | ค่ะ บรรทัดเดียว บรรทัดอื่นไม่มี | เลือก 1 แบบ |
| consumer-rights:complaint-letter-th | references/templates.md:23 | "ภายในวันที่ [7 วันนับจากวันนี้]" นับจากวันเขียน | "ภายใน 7 วัน นับจากวันที่ได้รับหนังสือฉบับนี้" (refund-request:12 ทำถูกแล้ว) |
| consumer-rights:complaint-letter-th | :24 | "จำเป็นต้องดำเนินการร้องเรียนต่อ…ต่อไป" | "ข้าพเจ้าจะร้องเรียนต่อ […] โดยไม่แจ้งอีก" |
| career:interview-prep | references/question-bank.md:66 | "ขอบคุณสำหรับเวลาในการสัมภาษณ์" (calque) | "ขอบคุณที่สละเวลาสัมภาษณ์วันนี้ครับ/ค่ะ" |
| career:salary-negotiation | SKILL.md:80 | "จึงอยากขอพิจารณาปรับฐานเงินเดือน" (ผู้พูดไม่ใช่คนพิจารณา · ไม่มี ครับ/ค่ะ ต่างจาก :72,:76) | "จึงอยากขอให้พิจารณา…ครับ/ค่ะ" |
| career:resume-th-en · performance-self-review | templates.md:47,83 · :44 | em-dash ในข้อความไทยที่ผู้ใช้จะส่งจริง | เว้นวรรค / "โดย" / วงเล็บ |
| thai-workplace:doc-contract-th | SKILL.md:67 | "ร่างนี้จัดระเบียบเจตนาของคู่สัญญา" | "ร่างนี้เรียบเรียงจากที่คู่สัญญาตกลงกัน ก่อนลงนามควรให้ทนายความตรวจ" |
| thai-workplace:pdpa-workflow | references/pdpa-templates.md:46 | แจ้งเหตุรั่วไหลไม่มีคำขอโทษ | เติม "บริษัทขออภัยในเหตุที่เกิดขึ้น" |
| dev-learning:english-tech-reading | :45 | "นิยามให้ค่าเป็นรายการ" (แปลตรง) | "ที่กำหนดให้ค่าเป็นรายการคั่นด้วยจุลภาค" |
| sqt-toolkit:spell-out-abbreviations | :76 | "มันวัดอะไร" | "ค่านี้วัดอะไร" |
| software-company:ui-craft | :179 · states-and-checks.md:32-33 | ตัวอย่าง ✅ ไม่มีขั้นถัดไปตามกฎตัวเอง | "…ลองเลขอื่น" |
| health-wellness:doctor-visit-prep | SKILL.md:49 | ประโยค 3 ไม่มี คะ/ครับ ต่างจาก 2 ประโยคแรก | เติม |
### F3 ช่องว่างข้ามหลาย plugin
| # | เรื่อง | ที่ควรลง | คุณค่า |
|---|---|---|---|
| 1 | ไม่มี template skill ไหนลิงก์ human-writing/thai-grammar (มีแต่ agent 20 ตัวมี 1 บรรทัดทั่วไป) — doc-thai-official · complaint-letter-th · chat-reply-templates · returns-and-bad-reviews · product-listing · line-broadcast · resume-th-en · salary-negotiation · interview-prep · i18n-and-locale · notifications · meeting-summary | 1 บรรทัดต่อ skill "ข้อความไทย → thai-grammar §4 ระดับ X" | สูง |
| 2 | ตารางระดับ thai-grammar §4 ขาดแถว: แชตลูกค้า/ไลฟ์ · หนังสือบริษัท B2B (บริษัทฯ/ท่าน · ไทย (English)) · จดหมายร้องเรียน · CV/จดหมายสมัครงาน · UI microcopy · release note/ข่าว | เพิ่มแถวครั้งเดียว ทุก skill ชี้มา | สูง |
| 3 | "ตัดรายการ ไม่ตัดคำทำหน้าที่" เขียนครั้งเดียวใน human-writing §6 แล้วลิงก์จาก presentation-design · commit-log · video-script | human-writing | สูง |
| 4 | release-notes (software-company) ตัวอย่างอังกฤษล้วน · writer-templates.md:121 template อังกฤษ | เติมรูปไทย: ประธาน+กริยา+กรรม ปิดด้วยเวอร์ชัน/วันที่ · 2 คู่ ✅/❌ | สูง |
| 5 | i18n-and-locale §1 มีแต่ไฟล์ string ไม่มีเรื่องถ้อยคำ · ไม่มี glossary UI | 3 บรรทัด: เขียนไทยตรง ไม่แปลจาก key · 1 คำต่อ 1 การกระทำ (บันทึก) เก็บ glossary · ถ้อยคำ → human-writing | สูง |
| 6 | brand-kit:19 voice = 3 คำคุณศัพท์ ไม่ล็อกระดับภาษาไทย | voice = คู่ก่อน/หลังของเจ้าของ 1 คู่ + particle ใช่/ไม่ + สรรพนาม + ระดับจาก §4 | สูง |
| 7 | owner-style-capture:34 เก็บแต่รูปแบบ (พ.ศ. ตาราง) ไม่เก็บน้ำเสียง | เก็บคู่ก่อน/หลัง ≤5 คู่ที่ผู้ใช้แก้ภาษาไทย ลง superuser-style.md | สูง |
| 8 | ตารางจัดตัวอักษรไทยซ้ำ 5 ที่ ค่าไม่ตรง (line-height brand-kit 1.5–1.7 · thai-in-graphics 1.5/1.4 · presentation-design 1.5/1.4 · branded-document Tahoma 1.3–1.35) | 1 ตารางต่อสื่อใน thai-line-breaking.md ที่อื่นลิงก์ | กลาง |
| 9 | ข้อความคนดูแลใน skill ที่แจก ~90 ไฟล์ ("ย้ายมาจาก…/เดิมชื่อ…/มาจากคำสั่ง…") | ย้ายไป CHANGELOG · validator เตือน | กลาง |
| 10 | อ้างเลขหัวข้อ ("human-writing หัวข้อ 6") ใน presentation-design:93 · no-ai-look:84,108 · catalog:81,124 พังเงียบเมื่อเรียงหัวข้อใหม่ | validator ตรวจ + srs→spell-out อ้างกฎที่ไม่มี | กลาง |
| 11 | ประโยคกำหนดเวลา "ภายใน X วัน นับจากวันที่ได้รับหนังสือฉบับนี้" ให้ตรงกันใน complaint-letter-th · refund-request · doc-thai-official | 3 skill | กลาง |
| 12 | doc-thai-official ไม่มีเนื้อความเต็ม 1 ย่อหน้า (SKILL.md:71 มีแต่โครง) และไม่มีตารางคำ (เซ็น→ลงนาม…) · สารบรรณ ฉบับที่ 4 (2564) อ้างถูกแล้ว (:10, templates.md:9) | เติมคู่ก่อน/หลัง 1 + ตารางคำ 6 แถว | สูง |
| 13 | product-naming:143 ไม่มีกฎเลือกตัวสะกดไทย | สะกดตามราชบัณฑิตฯ ไม่ใส่วรรณยุกต์ · ลง brand kit · ตัวสะกดอื่นเป็น keyword | กลาง |
| 14 | html-slide-deck / pptx-to-html-deck โน้ตผู้พูดไม่มีระดับภาษา | 1 บรรทัด: ภาษาพูด ครับ/ค่ะ ก็ ใช้ได้ | ต่ำ |
| ยังไม่ได้ตรวจ | sqt-toolkit polite-message-th-en · meeting-summary · meeting-prep-card (รายงานประชุม = ระดับราชการ คุณค่าสูง) ถูกตรวจแค่ผิวโดย agent 2 · software-company อีก ~80 skill ตรวจด้วย grep เท่านั้น · template ฝั่งอังกฤษไม่ได้ตรวจ | | |

## G. เว็บ ai4ba.ai-cie.com/#/poster — วิธีทำ animation และของเราที่มี (ดู 2026-10-22 · โค้ดโหลดไว้ scratchpad/ai4ba-src · ภาพ _to_delete/poster-ch-*.jpg)
โครง: SPA ไฟล์เดียว ไม่มี framework · GSAP 3 + Observer (ปัดนิ้ว) · three.js (ฉากหลัง "โครงข่ายประสาท" 1 จุด = 1 คน) · canvas 2d สำรองเมื่อไม่มี WebGL · CSS 925 บรรทัด · app.js 1,864 บรรทัด · ฟอนต์ IBM Plex Sans Thai self-host แยก unicode-range ไทย/ละติน
| เทคนิคที่ทำให้ "สวย" | ที่ | ของเรามีไหม |
|---|---|---|
| เด็ค 5 บทเต็มจอ ไม่ scroll · ล้อเมาส์/ปุ่ม/ปัด = เปลี่ยนบท · rail เลข 01–05 ด้านขวา · hash ตามบท | app.js:240-247, 695-760 · css:484-560 | html-slide-deck มีเด็ค + แถบล่าง แต่เป็น "สไลด์" ไม่ใช่ "เว็บบท" · ไม่มี wheel-to-chapter + ล็อกเลื่อนในรายการก่อน (app.js:726-745 ฉลาด: สุดรายการต้องหยุดแล้วเลื่อนใหม่ถึงเปลี่ยนบท) |
| ทางเข้าข้อความ 4 แบบ ห้ามใช้ fade+slide-up ซ้ำทุกจุด: decodeWords (ตัวอักษรสุ่มแล้วล็อก ใช้กับละติน) · blurWords (เบลอ→คม ทีละคำ stagger 75ms expo.out) · inkWords (จาง .14→1) · wipe (clip-path จากล่าง) · ขาออกสั้นกว่า power3.in · ล้าง filter หลังเข้า | app.js:285-325 · fx.js:6-20 | motion-basics มีหลัก (stagger 40–80ms · ease-out เข้า ease-in ออก) แต่ไม่มี "สูตร" พร้อม CSS/JS · no-ai-look:47 ห้าม fade-up ทุกชิ้น แต่ไม่บอกทางเลือก |
| ฉากหลังมีความหมาย ไม่ใช่ของประดับ: จุด = คนลงทะเบียนจริง · เส้นทาง = 20 กิจกรรม กล้องเดินตาม · cluster = สิ่งอำนวยความสะดวก · ชี้รายการแล้วกล้องบิน | neural.js:1-12 · app.js:703-705 | ไม่มี · ตรงกับหลัก motion-basics ข้อ 1 "ตั้งชื่อจุดประสงค์ทุกการเคลื่อนไหว" |
| ตัวเลขใหญ่ประกอบจากอนุภาค (09:00) · เครื่องหมายถูกจากอนุภาค + วงกระเพื่อม (หน้าขอบคุณ) · confetti ย่อม 70 ชิ้น · ตัวเลขนับขึ้น ease quart | fx.js:41-165 | html-slide-deck มี data-count นับขึ้น · ที่เหลือไม่มี |
| iris transition (วงกลมสีส้มขยายจากจุดที่คลิก) ก่อนเปลี่ยนหน้า | app.js:875-884 · css:563 | ไม่มี |
| reduced-motion ครบ: ทุก duration ผ่าน T()/D() = 0 · CSS ปิดทั้งหมด · FX.reduced() ทุกจุด | app.js:238 · css:157-162 | ui-craft:195 และ app-character:43 บอกให้เคารพ · html-slide-deck:115 ปิดเอง — มีหลัก ไม่มีแบบแผนโค้ด |
| token ชุดเดียว: กระดาษ #F7F6F2 · หมึก #0F0F0E · ส้ม #E8590C · ease expo-out cubic-bezier(.16,1,.3,1) · ease-io · r 8px | css:14-32 | web-app-design/tokens.md มีชุดสี · ไม่มี ease token |
| ตัวอักษร display clamp(52px, 8.4vw, 132px) letter-spacing -.035em · หัวบท clamp(40px,5.2vw,76px) · Plex Thai ตัดคำ nowrap ต่อคำ (.wd) | css:470-505 | thai-line-breaking.md มีเรื่องตัดคำ · ไม่มีสเกล display ขนาดนี้ (ui-craft/scales.md ยังไม่ได้ตรวจ) |
| scroll-driven: scrubWords คำสว่างตามเลื่อน · IntersectionObserver reveal threshold .15 rootMargin -8% | fx.js:22-38, 52-66 | ไม่มี |
สิ่งที่น่าทำ (ยังไม่ทำ): (1) skill ใหม่ `web-motion-recipes` หรือ references ใน html-slide-deck/web-app-design: สูตร 4 ทางเข้า + ขาออก + iris + countUp + reveal เป็น CSS/JS วางได้เลย พร้อม T() reduced-motion pattern และ ease token (~150 บรรทัด) · (2) เลย์เอาต์ "เว็บบทเต็มจอ + rail" เป็นแบบที่ 14 ใน html-slide-deck หรือแบบใหม่ใน web-app-design · (3) หลัก "ฉากหลังต้องมีความหมาย" ลง motion-basics ข้อ 1 พร้อมตัวอย่างนี้ · (4) wheel-lock pattern เมื่อมีรายการเลื่อนได้ในบท · ไม่รับ: three.js/WebGL เป็นค่าตั้งต้น (หนัก · ต้อง fallback) ใช้เฉพาะเมื่อข้อมูลเป็น "โครงข่าย" จริง
ยังไม่ได้ตรวจ: บท resort/end และหน้าลงทะเบียน · มือถือ · neural.js ส่วนกล้อง (925 บรรทัด อ่านแค่หัว) · ui-craft/references/scales.md

## E. แหล่งนอก KT
- งานสารบรรณ ฉบับที่ 4 (2564) ราชกิจจาฯ 25 พ.ค. 2564 เล่ม 138 ตอนพิเศษ 113 ง — ไม่พบฉบับที่ 5 · ฉบับที่ 3 (2560) ยังไม่ได้ตรวจ
- ประกาศสำนักนายกฯ หลักเกณฑ์การทับศัพท์ภาษาอังกฤษ ราชกิจจาฯ เล่ม 106 ตอน 153 (2532) — ยังไม่ได้ PDF ตัวจริง
- ราชบัณฑิตยสถาน (2551) หลักเกณฑ์การใช้เครื่องหมายวรรคตอน… — ตัวบท ๆ ยังไม่ได้ตรวจ (เว็บ orst.go.th โหลดแท็บไม่ได้)
- PyThaiNLP v5.4.0 Apache-2.0 · word lists CC0 (words_th, tnc_freq) — ใช้ได้ถ้าต้องการ · newmm offline ยังไม่ได้ตรวจ
- haidrrrry/humanize-ai-writing MIT — แบบ CLI ตัวตรวจ (อังกฤษล้วน)
- ไม่มีตัวอย่างก่อน/หลังภาษาไทยระดับย่อหน้าที่เปิดสาธารณะ → ต้องเขียนเอง
- ไม่พบคู่มือสำนวนของ DGA/ETDA/Thai PBS/BBC Thai ที่ใช้ได้

## H. dynamic-website — วัตถุดิบสำหรับ skill ใหม่ (agent · 2026-10-22) — ฉบับเต็มอยู่ใน dynamic-website-research.md
