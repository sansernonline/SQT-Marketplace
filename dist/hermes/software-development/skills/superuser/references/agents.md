# หัวหน้าทีม · เลือก agent

## หัวหน้าทีม

**ตัวที่ผู้ใช้คุยด้วยคือหัวหน้าทีม** มีตัวเดียวต่อโปรเจกต์ — รับงานแทนผู้ใช้ · จัดการ `.claude/superuser/inbox/` · เลือก playbook agent และระดับโมเดล · ตรวจผลของลูกทีมกับของจริงก่อนรับ · เขียนไฟล์กลางคนเดียว (`CONTEXT.md` · `docs/BUILD-PLAN.md` · `IMPROVEMENTS.md`) · ลูกทีมขัดกันหัวหน้าตัดสินแล้วลง `decision-log` · ลูกทีม (subagent) ทำเฉพาะชิ้นที่ได้รับ รายงานกลับพร้อมสิ่งที่ควรจด ไม่คุยกับผู้ใช้ ไม่สั่ง agent ตัวอื่น · ผู้ใช้อยู่เหนือหัวหน้าทีมและตัดสินรายการ "รออนุมัติ"

งานใหญ่หรืองานยาว หัวหน้าทำหน้าที่ประสานงานและตรวจ ไม่ลงมือเขียนโค้ดชิ้นใหญ่เอง (ของกลางและชิ้นเล็กทำเองได้) ถ้า context ใกล้เต็มหรือต้องสลับโมเดล ให้ทำจุดส่งต่อตาม `handoff` หัวข้อ 5 ก่อน

**เพิ่มเติมของงานโค้ด** (ย้ายมาจาก `superuser` หัวข้อ 5 · 2026-11-11)
- งานขนานแยก worktree · `docs/BUILD-PLAN.md` หัวหน้าทีมเขียนคนเดียว · อ่าน diff เองก่อนรับ · ระดับโมเดลของงานโค้ดใน [`agents`](agents.md)
- **งานอ่านอย่างเดียว** — agent ส่วนใหญ่มีเครื่องมือเขียนไฟล์ ส่งงานตรวจหรืองานหาคำตอบให้เขียนในคำขอว่า "ห้ามเขียนหรือแก้ไฟล์"

## agent ตามสาขา

รายชื่อ agent เฉพาะสาขาของ software-development และ agent ใน plugin อื่น ใช้ประกอบหัวข้อ 5 ของ `superuser`

| กติกา | รายละเอียด |
|---|---|
| **งานเฉพาะสาขา** | แอปมือถือ → `mobile-engineer` · Large Language Model (LLM) / Machine Learning (ML) → `ai-engineer` · ข้อมูล → `data-engineer` · การเงิน → `fintech-engineer` · สุขภาพ → `healthcare-engineer` · ร้านค้าออนไลน์ → `ecommerce-engineer` · ประกัน → `insurance-engineer` · เอกสารกฎหมาย → `legaltech-engineer` · งานกำกับดูแล → `fintech-compliance-officer` · `hipaa-officer` · `insurance-compliance-officer` · `legal-compliance-officer` · โมเดลและตัวเลขของสาขา → `quant-analyst` · `clinical-data-analyst` · `insurance-analyst` · `recommendation-engineer` · `revops-analyst` · Security Operations Center (SOC) และเหตุความปลอดภัย → `security-analyst` · conversion และ store listing → `growth-specialist` · ผลิตภัณฑ์สำหรับนักพัฒนา → `devrel-engineer` · เกม → `game-developer` · `game-designer` · IoT → `iot-engineer` · บล็อกเชน → `blockchain-engineer` · แกะของที่ไม่มีซอร์ส → `reverse-engineer` · รูปถ่ายและภาพประกอบในเว็บ แอป สไลด์ → `graphic-design:image-artist` — แต่ละตัวเปิด skill สาขาของตัวเองก่อนเริ่ม |
| **งานชีวิตประจำวัน** (เมื่อติดตั้ง plugin นั้นไว้) | ภาษี เงินเดือน เอกสารไทย LINE OA → `tax-helper` · `thai-doc-writer` · `line-admin` (e-commerce) · หุ้นและขนาดไม้ → `market-analyst` · `risk-manager` · งบ หนี้ ภาษีบุคคล มิจฉาชีพ → `money-planner` (trading-finance) · ขายของออนไลน์ → `shop-manager` · `customer-chat` (e-commerce) · ธุระส่วนตัว → `life-admin` (personal-life) · บ้าน → `home-manager` (personal-life) · อาชีพ → `career-coach` (personal-life) · สุขภาพ → `health-organizer` (personal-life) · ร้องเรียนผู้บริโภค → `consumer-advocate` (e-commerce) · งานภาพ → `art-director` (graphic-design) ถ้าเป็นงานหลายขั้นในสาขานั้นให้ส่งต่อ `/<plugin>:superuser` ของ plugin นั้น ถ้าไม่ได้ติดตั้งให้บอกผู้ใช้ว่ามี plugin นี้ แล้วทำต่อด้วยความรู้ทั่วไปพร้อมป้าย `ยังไม่ได้ตรวจ` |

## ระดับโมเดลของงานโค้ด

- ไล่ตามกฎ 3 ข้อของ `superuser:superuser` หัวข้อ 5 ข้อแรกที่ตรงชนะ · ใหญ่ `opus` = ชิ้นที่คิดยอดเงินหรือภาษี · เปลี่ยนการตรวจสิทธิ์หรือรหัสผ่าน · migration ที่ย้อนไม่ได้ · ดีไซน์ข้ามระบบ · ตรวจรอบสุดท้ายของงานใหญ่หรืองานเสี่ยง — agent ที่ตั้ง `sonnet` (เช่น `developer`) ส่ง `model: opus` ตอนเรียก · เล็ก `haiku` = งานกลไกที่มีแบบให้ทำตาม เช่น เติม fixture ตามแม่แบบ · สรุป log ตามหัวข้อที่กำหนด (แก้ชื่อหลายจุดให้เขียนสคริปต์) — ยังไม่มี agent ที่ตั้ง `haiku` ให้ส่ง `model: haiku` เอง · กลาง `sonnet` = ที่เหลือ: เขียนฟีเจอร์ · แก้บั๊ก รวม root cause ที่ยากและ concurrency (พลาดแล้วค่อยขยับขึ้นตามบันได) · ตรวจรอบแรก · เอกสาร
- โมเดลใหม่ออกให้แก้บล็อก `team` (ต้นฉบับใน plugin `superuser`) และ `model:` ใน `agents/*.md` · สลับโมเดลข้ามค่ายได้หลังทำจุดส่งต่อตาม `handoff` หัวข้อ 5

## ที่มา

แนวคิดมาจาก pstack ของ Lauren Tan (poteto) แห่ง Cursor แล้วปรับให้เข้ากับ plugin `software-development`
