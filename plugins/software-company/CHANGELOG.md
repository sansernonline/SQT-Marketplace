# Changelog — software-company

## 2.17.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)
- แม่แบบเอกสารทุกตัว (runbook · PR · release notes · architecture review · security · SEO · retro · BRD · PRD · test plan …) ไม่มีอีโมจิแล้ว · ระดับความรุนแรงและสถานะใช้คำ ตรงกับ `human-writing`
- diagram ในเอกสารโปรเจกต์ (BRD · SRS · FSD · ADR · ER · flow) ไปที่ `diagram-figures` แบบเดียว · Mermaid เหลือแค่ README · PR · โน้ตในโค้ด (`software-diagrams` · `polished-document-style` · `srs-writing` · `project-doc-set` · `user-story-writer`)
- `polished-document-style` เป็น skill จัดรูปเอกสารทั่วไป (Markdown · Word · PDF) · เพิ่มหัวข้อเอกสาร Office ภาษาไทย · bullet ไม่ซ้อน · คำสถานะ 5 คำ
- คำอธิบายที่ทับกันแยกขอบเขตชัดขึ้น: `commit-message-format` ↔ `commit-log` · `simplicity-first` ↔ `simplify` · `markdown-report-docx` ↔ `thesis-writing` · `graphic-design` ↔ plugin graphic-design · `spell-out-abbreviations`

## 2.16.0 — 2026-10-21

- skill ใหม่ `owasp-top10` — ระบบเว็บแอปและ API ที่ส่งมอบต้องผ่าน OWASP Top 10:2025 (A01–A10): สิ่งที่ต้องมี · วิธีพิสูจน์ (test ชื่อ `A0x_` + เครื่องมือ) · ภาษาเจ้าของกิจการ · วิธีเขียนตาม stack (.NET · TypeScript/Node/Angular · Python · SQL) · แม่แบบรายงานก่อนส่งมอบ · ร่างข้อกำหนดในสัญญาและ NFR ใน SRS
- ผูกเข้างานเดิม: playbook `feature` (ทำตอนเขียน) · `ship` และ `new-project` (รายงานต้องไม่มีข้อไม่ผ่าน) · `security-gate` · `principle-secure-by-default` · `code-review-checklist` · `srs-writing` · ตัวกระตุ้นใน `superuser` · agent `security-engineer` · `developer`
- `threat-model` · `security-scan`: รายการ OWASP เปลี่ยนจากฉบับ 2021 เป็น 2025

## 2.15.0 — 2026-10-21

- `status-report`: `docs/BUILD-PLAN.md` เพิ่ม 3 อย่าง — คอลัมน์ "ใครทำ · ใครตรวจ" (ตารางสถานะล่าสุด และบรรทัดประวัติสถานะ) · บรรทัด "ภาพรวม" (เสร็จ N/ทั้งหมด · กำลังทำ · ติด · ไม่ผ่านตรวจ) · ตาราง "ทีมตอนนี้" ราย agent · BUILD-PLAN เดิมต้องเติม 2 คอลัมน์ใหม่ก่อนตัวตรวจจะผ่าน
- `coding-evals`: ชุดงานจริง 8 งานอยู่ที่ `evals/coding/` ของ SQT-Marketplace พร้อมสคริปต์ `run-coding.mjs` (ตรวจชุดงาน · เทียบ 2 รุ่น · ให้คะแนนอัตโนมัติ)

## 2.14.0 — 2026-10-20

- skill ใหม่ `stack-mql` — เขียนและตรวจ MQL4 / MQL5 (Expert Advisor · indicator บน MetaTrader 4/5): ความต่าง MT4 กับ MT5 · ตัวตรวจก่อนส่งออร์เดอร์ (volume · ราคา · stops level · freeze level · margin · จำนวนออร์เดอร์) · state ที่กู้คืนได้หลังรีสตาร์ท · backtest จาก command line · กฎ MQL5 Market · ขายเอง
- `developer` เพิ่ม `stack-mql` ในตาราง stack · `quant-analyst` ใช้ `stack-mql` กับงาน EA
- ชุด prompt คู่กัน: `prompt/software-company/prompt-trading-system.md` · `prompt-ai-feature.md` · `prompt-sell-product.md` (ใหม่) และฉบับใหม่ใน `prompt-operations.md` (6 ดูแลประจำ) · `prompt-existing-code.md` (6 ไม่มี source) · `prompt-release.md` (4 แอป Windows) · กฎ "งานเฉพาะสาขา" ใน `prompt-new-project.md`

## 2.13.0 — 2026-10-19

- รับ skill กลาง `no-ai-look` จาก `superuser` · agent ที่ทำงานภาพ (`ux-designer` · `graphic-designer` · `image-artist` · `growth-specialist` · `technical-writer`) ทำตามและตรวจก่อนส่ง
- skill งานภาพ 15 ตัวมีหัวข้อ "ไม่ให้ดูเหมือน AI ทำ" ชี้ไปข้อ 3 ของ `no-ai-look` (ui-craft · web/mobile/windows-app-design · graphic-design · presentation-design · html-slide-deck · pptx-to-html-deck · branded-document-design · polished-document-style · doc-cover-design · diagram-figures · software-diagrams · markdown-visuals · image-generation)
- ตัดของที่ขัด `no-ai-look` ออก
  - `polished-document-style`: เลิกใช้อีโมจิทั้งเอกสาร (หัวข้อ H1 · กล่องข้อความ · ป้ายสถานะ · ตาราง) ใช้คำตัวหนาแทน · แม่แบบ `fsd-writing` · `document-naming` · `project-bootstrap` ตามไปด้วย
  - `diagram-figures`: เลิกแถบสีหนาข้างการ์ด ใช้หัวการ์ดพื้นสีทึบ
  - `ui-craft` หน้าสารบัญ mockup: ตัดแสงฟุ้ง · ไล่สี · ป้ายเหนือหัวข้อ · เคอร์เซอร์กระพริบ · เงาเรือง · รูปซูม · สีสำรองม่วง-ฟ้า → `#2A78D6`
- `ui-craft` แกน "พลังของสี": เปลี่ยนคำแนะนำแถบสีหนาข้างการ์ด เป็นหัวการ์ดพื้นสีทึบ (แถบข้างการ์ดมุมมนคือสัญญาณ AI เว้นแต่บอกสถานะ)

## 2.12.0 — 2026-10-18

- `test-case-template` ช่อง **Oracle** ใหม่ — ผลที่คาดหวังมาจากไหน `[D]` เจ้าของงาน · `[R]` กฎทั่วไป · `[A]` คนสร้าง · `[O]` หน้าจอ · ทุก TC ต้องมี `[D]` หรือ `[R]`
  - กฎ "อย่าอบบั๊ก": ตัวเลขเงินคิดจาก `[D]` + `[R]` ก่อนเปิดระบบ พร้อมวิธีคิด · ห้ามลอกจากหน้าจอ
  - BR ที่มีตัวเลข = ค่าขอบ 3 ค่า · ช่อง **Check when** (ทันที · หลังรีโหลด) · ตาราง coverage matrix + traceability ท้ายไฟล์
- แม่แบบแผนทดสอบ: coverage matrix ในหัวข้อ 3 · เกณฑ์ผ่านวัดได้ (P1 ผ่านหมด · ≥ 95% ต่อเบราว์เซอร์ · Not run = ล้ม) · หัวข้อ 8 Plan Quality "ถ้าพังแบบนี้ → TC ไหนล้ม"
- agent `qa-tester`: ผลไม่ตรง → ห้ามแก้ผลที่คาดหวัง · จำแนก `app` / `plan` / `test` ลง `triage.json` · ฝังบั๊กด้วย `BUG_MODE` เพื่อวัดว่าแผนจับได้ X / Y
- `e2e-testing-patterns` หัวข้อใหม่ Expected Values and Failing Tests
- ที่มา: บท "สบายใจ สปา: จากบันทึกสัมภาษณ์ สู่เว็บและแผนทดสอบ"

## 2.10.1 — 2026-10-18

- ปุ่มของเด็ค HTML (`html-slide-deck` · `pptx-to-html-deck`) แยกหน้ากับ player ออกจากกัน
  - ← → · PageUp PageDown · คลิกขอบ · ปัดจอ = เปลี่ยนหน้าเท่านั้น
  - Space = เล่น / หยุด player ของหน้านั้น (ทัวร์แผนภาพ · ขั้น On Click) · หน้าที่ไม่มี player ไม่ทำอะไร
  - ↓ ↑ = player ขั้นถัดไป · ขั้นก่อนหน้า
  - เปลี่ยนหน้าทุกครั้ง player หยุดและกลับไปขั้นเริ่มต้น ทั้งไปหน้าและถอยกลับ
- `check_html_deck.py` เดินเด็คด้วย ↓ ทุกขั้นและ → ทุกหน้า และตรวจว่า player reset ทุกครั้งที่เข้าหน้าใหม่

## 2.10.0 — 2026-10-18

- skill ใหม่ `test-evidence` — รันเคสแล้วเก็บหลักฐานครบในรอบเดียว
  - ภาพทุกขั้น → GIF 1 ไฟล์ต่อเคส: แถบบนบอกรหัสเคส · ชื่อ · ขั้น n/N · ป้าย PASS/FAIL · คำบรรยายใต้ภาพ (ทำอะไร → เห็นอะไร) · กรอบแดงจุดที่ผิด · ภาพปิดสรุปผล คาดว่า / ที่เกิดจริง
  - ขนาดตายตัว: กว้าง 1280 px · หัว 24 px · คำบรรยาย 28 px (ย่อเหลือ 800 px ยังอ่านได้) · ฟอนต์ Sarabun + ชุดลูกศรฝังใน skill
  - รายงาน `qa/reports/<run-id>-test-report.md` สร้างอัตโนมัติ: สรุปจำนวน · ผลรายเคสพร้อมลิงก์ · เคสที่ไม่ผ่านพร้อมภาพ · เคสที่ยังไม่ได้รัน
  - `results.csv` → Excel: คอลัมน์ Result · Test result · Evidence (ลิงก์) · `record_results.py` ลงผลใน Excel ที่ผู้ใช้ส่งมาเองได้ทุกหน้าตา
  - สคริปต์ 2 ตัวมี `--self-test`
- `test-case-template/scripts/build-test-workbook.py` เพิ่มคอลัมน์ `test_result` · `evidence` ต่อจาก `result` และ `--results` เติมผลจากรอบทดสอบ
- agent `qa-tester` ใช้ `test-evidence` ทุกครั้งที่รันเคส

## 2.9.0 — 2026-10-16

- `project-doc-set` ข้อ 3.1 ใหม่ **ทะเบียนจุดค้าง** — เมื่อผู้ใช้ถามว่าเอกสาร DRAFT ยังติดตรงไหน ตอบเป็นไฟล์ Excel ไม่ใช่ข้อความในแชต
  - สคริปต์ `scripts/open_items.py` อ่าน `.docx` ทั้งชุด รวมตารางคำถาม ข้อสมมติที่ยังไม่ตัดสิน ตารางลงนาม และป้าย `(รอยืนยัน)` `(รอวัด…)` เป็น `<CODE>-OPEN-ITEMS.xlsx` · แผ่นสรุปนับด้วยสูตร COUNTIFS · แยก 5 ประเภท (เจ้าของตัดสิน · ทีมตัดสิน · กฎหมาย · วัดจริง · ลงนาม) · มี `--self-test`
  - ข้ามประวัติการแก้ไข สารบัญ บรรทัดอธิบายป้าย และ `(รอบหลัง)` · ต้องเปิดอ่านด้วยตาก่อนส่ง
  - รายการตรวจข้อ 7 เพิ่มข้อทะเบียนจุดค้าง
- ที่มา: LiteNet v0.5 (6 ฉบับ) ได้ 75 รายการ

## 2.8.0 — 2026-10-15

- skill `reverse-engineering` แกะซอฟต์แวร์ด้วยเครื่องมือในเครื่องล้วน ไม่ใช้ MCP (Model Context Protocol) server และไม่ดึงแพ็กเกจจาก npm ตอนรัน
  - ก่อนเปิดเป้าหมายต้องมีบันทึกสิทธิ์ · สมุดหลักฐาน (ข้อสรุป · เลขหลักฐาน · ป้าย `จากแหล่ง` `ตรวจจริง` `อนุมาน` `ยังไม่ได้ตรวจ`) · ทำเฉพาะเป้าหมายและขั้นที่ตกลง
  - ทุกอย่างที่รันเป้าหมาย เกาะ process หรือแก้อุปกรณ์ ต้องถามผู้ใช้ทุกครั้ง · ถูกปฏิเสธแล้วห้ามขอซ้ำด้วย input เดิม · เป้าหมายที่ไม่น่าไว้ใจรันใน `docker-sandbox` เท่านั้น · ไม่ช่วยเลี่ยง DRM licence anti-cheat ไม่ทำโปรแกรมโกงหรือ malware · เครื่องมือเสียเงินต้องเป็นสัญญาอนุญาตของผู้ใช้
  - playbook ตามชนิดเป้าหมายใน references/: `javascript-electron` · `native-binaries` (PE · ELF · Mach-O · .NET · Ghidra headless) · `android-apk` · `web-and-network` (เว็บแอป · HAR · pcap) · `runtime-observation` · `evidence-ledger` · แต่ละตัวบอกเครื่องมือในเครื่องที่ใช้ และแหล่งติดตั้งทางการถ้าขาด (ผู้ใช้ติดตั้งเอง agent ถามก่อน)
  - สคริปต์ใหม่ 5 ตัว ใช้แค่ไลบรารีมาตรฐานของ Python ทุกตัวมี `--self-test`: `asar_extract.py` (แตก .asar กัน path หลุดโฟลเดอร์ ตรวจ integrity hash) · `pe_elf_info.py` (header · section · import · export ของ PE และ ELF · Mach-O แค่ header) · `apk_inventory.py` (รายการใน APK · ABI · ลายเซ็น · ถอด AndroidManifest แบบ binary XML) · `sourcemap_list.py` (หา source map และเขียนต้นฉบับที่ฝังอยู่ออกมาอย่างปลอดภัย) · `har_summary.py` (host · endpoint · วิธียืนยันตัวตน โดยตัดค่าลับทิ้ง)
  - `triage.py` ชี้ไปสคริปต์ใหม่ · ไฟล์ `NOTICE` ให้เครดิต REA (MIT · © 2026 morluto) สำหรับแนวทางที่ดัดแปลง
- agent `reverse-engineer` ใช้บันทึกสิทธิ์ สมุดหลักฐาน ป้าย 4 แบบ และตารางสคริปต์กับ playbook ชุดใหม่
- **ถอด plugin เสริมของ REA ออกจาก marketplace** เพราะ server ของมันดาวน์โหลดแพ็กเกจจาก npm สาธารณะทุกครั้งที่เปิด ซึ่งไม่มีใครตรวจรับรองโค้ดรุ่นที่ได้ · ความสามารถที่ใช้จริงย้ายมาอยู่ใน skill `reverse-engineering` แล้ว

## 2.7.0 — 2026-10-15

- skill ใหม่ `doc-cover-design` — ปกเอกสาร .docx ที่ไม่ซ้ำโปรเจกต์อื่น: หาแนวคิดจากรูปทรงโลโก้ (ทางตั้งต้น) หรือหน้าจอจริงของ mockup (ทางสำรอง) · ทะเบียนกันปกซ้ำ · ชนิดเอกสาร = เฟรมของการเคลื่อนไหวเดียวกัน · ทำ 3 แนวแล้วผู้ตรวจ 3 ตัวโหวต 2 ใน 3 · เครื่องสร้างปกตัวอย่าง `scripts/cover-engine/` (ทดสอบใน Word แล้วเฉพาะปก SRS · ใช้กับโปรเจกต์ใหม่ต้องแก้หลายไฟล์ — ดู word-build.md)
- ที่มา: bake-off กับ LiteNet · Telex · SwipeOS — แนวรูปทรงโลโก้ชนะ 2 ใน 3 · Telex ใช้หน้าจอจริง
- `branded-document-design` ชี้ไปที่ `doc-cover-design` เมื่อโปรเจกต์มีโลโก้และ mockup แล้ว
- prompt ใหม่ `prompt/software-company/prompt-doc-cover.md` (3 ฉบับ) · `prompt-new-project.md` ฉบับ 14 เรียกตัวสร้างปกของโปรเจกต์ถ้ามี
- agent `reverse-engineer` และ skill `reverse-engineering` ชี้ไปที่ plugin เสริมของ REA (Reverse Engineer Anything) · ถอดออกแล้วใน 2.8.0

## 2.6.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- agent 13 ตัวที่ยาวเกิน 150 บรรทัด เหลือ 87–117 บรรทัด · เนื้อหาย้ายไป references/ ของ skill ที่เกี่ยวข้อง
- แก้ตัวอย่างโค้ดที่ผิด: SQL ต่อ string (data-engineer) · AND/OR (clinical-data-analyst) · rollup รันซ้ำแล้วนับซ้ำ และรับรู้รายได้เกิน 1 วัน (revops-analyst)
- ความปลอดภัย: rag-architecture มีหัวข้อความปลอดภัย · md_to_docx.py ไม่ต่อ path เข้าคำสั่ง PowerShell · build_deck.py ฝังได้เฉพาะรูปในโฟลเดอร์งาน · incident-response ต้องมีคนอนุมัติก่อนแก้ระบบจริง
- ค่าที่ไม่ตรงกันข้าม skill: เงินใช้ decimal ไม่ใช้ float · ระดับความรุนแรงของการรีวิวชุดเดียว · LCP 2.5 วินาที · รหัสผ่านขั้นต่ำ 15 ตัวตาม NIST SP 800-63B-4
- รุ่นภาษาและ runtime (Python · .NET · Node) ตรวจกับเว็บทางการ 2026-10-14 · เลิกเขียนชื่อรุ่นโมเดลตายตัว
- ย้ายตาราง/ตัวอย่างยาวจาก SKILL.md ไป references/ (architecture-patterns · seo-audit-checklist · llm-design · healthcare-design · iot-design · ui-craft · srs-writing · test-case-template ฯลฯ)
