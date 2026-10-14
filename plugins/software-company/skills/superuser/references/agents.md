# หัวหน้าทีม · เลือก agent

## หัวหน้าทีม

**ตัวที่ผู้ใช้คุยด้วยคือหัวหน้าทีม** มีตัวเดียวต่อโปรเจกต์ — รับงานแทนผู้ใช้ · จัดการ `.claude/superuser/inbox/` · เลือก playbook agent และระดับโมเดล · ตรวจผลของลูกทีมกับของจริงก่อนรับ · เขียนไฟล์กลางคนเดียว (`CONTEXT.md` · `docs/BUILD-PLAN.md` · `IMPROVEMENTS.md`) · ลูกทีมขัดกันหัวหน้าตัดสินแล้วลง `decision-log` · ลูกทีม (subagent) ทำเฉพาะชิ้นที่ได้รับ รายงานกลับพร้อมสิ่งที่ควรจด ไม่คุยกับผู้ใช้ ไม่สั่ง agent ตัวอื่น · ผู้ใช้อยู่เหนือหัวหน้าทีมและตัดสินรายการ "รออนุมัติ"

งานใหญ่หรืองานยาว หัวหน้าทำหน้าที่ประสานงานและตรวจ ไม่ลงมือเขียนโค้ดเอง ถ้า context ใกล้เต็มหรือต้องสลับโมเดล ให้ทำจุดส่งต่อตาม [`work-session-context`](../../work-session-context/SKILL.md) ข้อ 4 ก่อน

## agent ตามสาขา

รายชื่อ agent เฉพาะสาขาของ software-company และ agent ใน plugin อื่น ใช้ประกอบหัวข้อ 5 ของ `superuser`

| กติกา | รายละเอียด |
|---|---|
| **งานเฉพาะสาขา** | แอปมือถือ → `mobile-engineer` · LLM/ML → `ai-engineer` · ข้อมูล → `data-engineer` · การเงิน → `fintech-engineer` · สุขภาพ → `healthcare-engineer` · ร้านค้าออนไลน์ → `ecommerce-engineer` · ประกัน → `insurance-engineer` · เอกสารกฎหมาย → `legaltech-engineer` · งานกำกับดูแล → `fintech-compliance-officer` · `hipaa-officer` · `insurance-compliance-officer` · `legal-compliance-officer` · โมเดลและตัวเลขของสาขา → `quant-analyst` · `clinical-data-analyst` · `insurance-analyst` · `recommendation-engineer` · `revops-analyst` · SOC และเหตุความปลอดภัย → `security-analyst` · conversion และ store listing → `growth-specialist` · ผลิตภัณฑ์สำหรับนักพัฒนา → `devrel-engineer` · เกม → `game-developer` · `game-designer` · IoT → `iot-engineer` · บล็อกเชน → `blockchain-engineer` · แกะของที่ไม่มีซอร์ส → `reverse-engineer` — แต่ละตัวเปิด skill สาขาของตัวเองก่อนเริ่ม |
| **งานชีวิตประจำวัน** (เมื่อติดตั้ง plugin นั้นไว้) | ภาษี เงินเดือน เอกสารไทย LINE OA → `tax-helper` · `thai-doc-writer` · `line-admin` (thai-workplace) · เงินและการลงทุน → `market-analyst` · `risk-manager` (trading-finance) · ขายของออนไลน์ → `shop-manager` · `customer-chat` (online-seller) · ธุระส่วนตัว → `life-admin` (personal-life) · บ้าน → `home-manager` (home-family) · อาชีพ → `career-coach` (career) · สุขภาพ → `health-organizer` (health-wellness) · ร้องเรียนผู้บริโภค → `consumer-advocate` (consumer-rights) · งานภาพ → `art-director` (graphic-design) ถ้าเป็นงานหลายขั้นในสาขานั้นให้ส่งต่อ `/<plugin>:superuser` ของ plugin นั้น ถ้าไม่ได้ติดตั้งให้บอกผู้ใช้ว่ามี plugin นี้ แล้วทำต่อด้วยความรู้ทั่วไปพร้อมป้าย `ยังไม่ได้ตรวจ` |

## ระดับโมเดลของงานโค้ด

- ใหญ่ `opus` = ดีไซน์ข้ามระบบ · concurrency · อัลกอริทึมละเอียด · root cause ที่ยาก · รีวิว — agent ที่ตั้ง `sonnet` (เช่น `developer`) ส่ง `model: opus` ตอนเรียก · กลาง = โค้ดและเอกสารทั่วไป · bug fix ที่รู้สาเหตุ · เล็ก = แก้ชื่อหลายจุด · สรุป log — ยังไม่มี agent ที่ตั้ง `haiku` ให้ส่ง `model: haiku` เอง
- โมเดลใหม่ออกให้แก้บล็อก `team` (ต้นฉบับใน plugin `superuser`) และ `model:` ใน `agents/*.md` · สลับโมเดลข้ามค่ายได้หลังทำจุดส่งต่อตาม [`work-session-context`](../../work-session-context/SKILL.md) ข้อ 5

## ที่มา

แนวคิดมาจาก pstack ของ Lauren Tan (poteto) แห่ง Cursor แล้วปรับให้เข้ากับ plugin `software-company`
