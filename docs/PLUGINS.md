# 📦 Plugin ใน SQT Marketplace

ทั้งหมด **12 plugins** · สายพัฒนาซอฟต์แวร์มี `software-company` ตัวเดียว เพราะรวมทุกสาขาไว้แล้วตั้งแต่ v2.0.0

---

## 🏢 `software-company`

จำลองบริษัทซอฟต์แวร์ครบทุกขั้นของ Software Development Life Cycle (SDLC) ตั้งแต่ทีมหลัก (product · analysis · architecture · design · development · QA · DevOps · security) ไปจนถึงผู้เชี่ยวชาญเฉพาะสาขา

### มีอะไรบ้าง
**39 agents · 107 skills · 28 commands**

### ติดตั้ง
```
/plugin marketplace add sansernonline/SQT-Marketplace
/plugin install software-company@sqt-marketplace
```

---

## 🏭 สาขาเฉพาะทาง — รวมอยู่ใน `software-company` แล้ว

ก่อน v2.0.0 แต่ละสาขาเป็น plugin แยก ตอนนี้อยู่ในตัวเดียว ไม่ต้องติดตั้งเพิ่ม

| เดิม (plugin) | เรื่อง | agent | skill | command |
|---|---|---|---|---|
| `software-company-ai` | AI / ML · LLM · RAG | `ai-engineer` · `data-engineer` | `llm-engineering` | `/software-company:llm-design` |
| `software-company-cybersecurity` | SOC · threat hunting · incident response | `security-analyst` | `security-operations` | `/software-company:security-ops-design` |
| `software-company-devtools` | SDK · DevRel · docs | `devrel-engineer` | `developer-experience` | `/software-company:dx-design` |
| `software-company-ecommerce` | checkout · inventory · recommendation | `growth-specialist` · `ecommerce-engineer` · `recommendation-engineer` | `ecommerce-patterns` | `/software-company:ecommerce-design` |
| `software-company-fintech` | payment · KYC/AML · PCI-DSS | `fintech-engineer` · `fintech-compliance-officer` · `quant-analyst` | `fintech-payments` | `/software-company:fintech-design` |
| `software-company-gaming` | game engine · multiplayer · live-ops | `game-developer` · `game-designer` | `game-development` | `/software-company:game-design` |
| `software-company-healthcare` | FHIR · HIPAA · clinical | `healthcare-engineer` · `hipaa-officer` · `clinical-data-analyst` | `healthcare-systems` | `/software-company:healthcare-design` |
| `software-company-insurtech` | claims · underwriting · insurance law | `insurance-engineer` · `insurance-analyst` · `insurance-compliance-officer` | `insurance-systems` | `/software-company:insurance-design` |
| `software-company-iot` | firmware · MQTT · edge · fleet | `iot-engineer` | `iot-systems` | `/software-company:iot-design` |
| `software-company-legaltech` | contract · document automation · e-signature | `legaltech-engineer` · `legal-compliance-officer` | `legal-document-systems` | `/software-company:legal-doc-design` |
| `software-company-mobile` | iOS / Android / Flutter · ASO | `growth-specialist` · `mobile-engineer` | `mobile-engineering` | `/software-company:mobile-design` |
| `software-company-saas-b2b` | multi-tenancy · SSO/SCIM · billing | `growth-specialist` · `solution-architect` · `revops-analyst` | `saas-platform` | `/software-company:saas-design` |
| `software-company-web3` | smart contract · DeFi · tokenomics | `blockchain-engineer` | `smart-contracts` | `/software-company:web3-design` |

**รวมแบบนี้:**
- agent ที่ทำงานคล้ายกันรวมเป็นตัวเดียว (เช่น android · ios · cross-platform → `mobile-engineer`) — คู่มือบทบาทเดิมทุกตัวอยู่ครบใน `references/agent-<ชื่อเดิม>.md` ของ skill สาขานั้น
- skill 3 ตัวของแต่ละสาขารวมเป็น skill เดียว — เนื้อหาเดิมอยู่ครบใน `references/<ชื่อเดิม>.md`
- command 2 ตัวของแต่ละสาขารวมเป็นตัวเดียวที่เลือกโหมดได้ เช่น `/software-company:fintech-design pci-audit <ขอบเขต>`

---

## 🔄 ย้ายจากรุ่นก่อน v2.0.0

ถ้าเคยติดตั้ง plugin สาขาไว้ ให้ถอดออกแล้วอัปเดตตัวหลัก

```
/plugin uninstall software-company-fintech     # ทำกับทุกตัวที่เคยติดตั้ง
/plugin marketplace update sqt-marketplace
/plugin update software-company@sqt-marketplace
```

ชื่อที่เปลี่ยน:
- command `/software-company-<สาขา>:<ชื่อ>` เปลี่ยนเป็น `/software-company:<สาขา>-design <ชื่อเดิม>`
- ชื่อ agent และ skill ใหม่ ดูตารางข้างบน
- รายการจับคู่ชื่อเก่า → ชื่อใหม่ทั้งหมด อยู่ในหัวข้อ "ที่มา" ของ skill สาขานั้น

---

## 📂 โครงสร้าง Marketplace

```
SQT-Marketplace/
├── .claude-plugin/marketplace.json
├── plugins/software-company/
│   ├── agents/      38 บทบาท
│   ├── skills/      101 skill (skill สาขาเก็บรายละเอียดใน references/)
│   ├── commands/    28 command
│   └── hooks/       hook ของ SuperUser — เขียน .superuser/log และแจ้ง inbox
├── docs/            INSTALL · USAGE · REFERENCE · PLUGINS (ไฟล์นี้)
└── README.md
```

---

## 🗺️ Roadmap — plugin ชีวิตประจำวัน

_ร่างเมื่อ 6 ต.ค. 2569 · software-company ครอบงาน "สร้างซอฟต์แวร์" แล้ว ชุดนี้จึงเสนอ plugin สำหรับใช้ในชีวิตประจำวัน_

หลักการเลือก:
1. ไม่ซ้ำกับ 101 skills ที่มี · ของเดิมเน้นออกแบบและสร้าง ของใหม่เน้น "ใช้ในชีวิต"
2. ตลาดจีนและตลาดสากลยังไม่มี หรือมีแต่ไม่ตรงบริบทไทย
3. เริ่มจาก skill ล้วนได้ ไม่ต้องผูก Model Context Protocol (MCP) server ตั้งแต่ต้น

---

### สารบัญ

| # | Plugin | กลุ่มเป้าหมาย | น้ำหนัก |
|---|---|---|---|
| 1 | [trading-finance](#1--trading-finance) | คนสนใจเงิน/เทรด | ⭐ ทำก่อน |
| 2 | [personal-life](#2--personal-life) | ทุกคน | ⭐ ทำก่อน |
| 3 | [thai-workplace](#3--thai-workplace) | SME/บริษัทไทย | ทำต่อ |
| 4 | [graphic-design](#4--graphic-design) | งานครีเอทีฟ | ทำต่อ |
| 5 | [dev-learning](#5--dev-learning-สำรอง--ทำทีหลัง) | programmer | สำรอง |

---

### 1 · trading-finance

**จุดต่างจากตลาด:** ในตลาดมีแต่ของสำหรับสถาบัน (Discounted Cash Flow (DCF), 研报, IC deck — institutional-finance-kit, xtt-public-markets-investing) · ยังไม่มีของสำหรับ **นักเทรดรายย่อย (retail trader)** ที่ดูกราฟ วางแผนเทรด จดบันทึกการเทรด และรับสัญญาณเตือน

**Agents (4):** market-analyst (วิเคราะห์หุ้นที่สนใจ), trade-journal-coach (อ่าน journal แล้วชี้พฤติกรรมซ้ำ ๆ), risk-manager (คำนวณ position sizing, max drawdown), alert-dispatcher (เฝ้าราคา+ข่าวแจ้งเตือน)

**Skills (12):**
- watchlist-setup — ตั้งวอทช์ลิสต์หุ้นไทย/ฮ่องกง/US พร้อมเหตุผล
- technical-signals — RSI/MACD/MA/volume breakout อธิบายเป็นภาษาคน
- paper-trading — เทรดจำลองก่อนด้วยเงินเสมือน เก็บสถิติ win/loss
- trade-journal — บันทึกทุกออเดอร์: setup, เหตุผล, อารมณ์ตอนเข้า, ผลลัพธ์
- post-trade-review — ทบทวนรายสัปดาห์ หาจุดซ้ำที่เสียเงิน
- position-sizing — คำนวณขนาดลงทุนจากเงินทุน/ความเสี่ยงต่อไม้
- portfolio-snapshot — สรุปพอร์ตปัจจุบัน (Excel/HTML)
- dividend-tracker — ปันผล/ดอกเบี้ยที่จะได้รับปีนี้
- news-impact — ข่าววันนี้กระทบหุ้นใน watchlist ตัวไหนบ้าง
- tax-basics-th — ภาษีเงินได้จากหุ้น/ดอกเบี้ย/เงินปันผล เบื้องต้น
- personal-budget — บัญชีรายรับรายจ่าย+แผนออม
- scam-check — ตรวจสัญญาณหุ้นล็อก/forexหลอก/แชร์ลูกโซ่ ก่อนโอนเงิน

**Commands (6):** /watch, /paper-trade, /journal, /review-week, /alert-set, /portfolio

**ข้อมูล:** ดึงผ่าน data plugin ที่มีอยู่แล้ว (yahoo_finance, Gildata ฯลฯ) · plugin นี้ไม่มีแหล่งข้อมูลของตัวเอง · ใน skill ระบุว่าถ้าไม่มี data plugin พวกนั้น จะดึงข้อมูลจากแหล่งฟรีแทนอย่างไร

---

### 2 · personal-life

**จุดต่างจากตลาด:** ตลาดมี connector แยกเป็นชิ้น (email, gmail, google-calendar, obsidian) แต่ไม่มีชุด **ความรู้เรื่องจัดการชีวิต** · plugin นี้เน้นขั้นตอนการทำงานและเอกสาร ไม่ทำ connector ซ้ำกับที่มีอยู่แล้ว

**Agents (3):** life-admin (จัดการธุระซ้ำ ๆ), meeting-prep (เตรียมก่อนประชุม สรุปหลังประชุม), doc-caretaker (เอกสารสำคัญในชีวิต)

**Skills (10):**
- weekly-review — ทบทวนสัปดาห์: อะไรคุ้ม อะไรเสียเวลา
- meeting-prep-card — การ์ดเตรียมประชุม 1 หน้า (เป้าหมาย/คำถาม/ข้อมูล)
- meeting-summary — สรุปประชุม → action items ตามเจ้าของ
- inbox-triage — วิธีคัดอีเมลที่ต้องตอบวันนี้ (ใช้กับ plugin อีเมลที่มีอยู่)
- calendar-audit — ตรวจปฏิทินว่าเวลาไปอยู่ไหน แนะนำบล็อกเวลา
- personal-kb — ระบบจดโน้ตส่วนตัวที่ค้นหาเจอ (ชื่อคน/สัญญา/รหัสผ่านไม่ใช่ — อ้างอิงไปยัง password manager)
- important-docs — ทะเบียนสำคัญ: บัตร สัญญา ประกัน หมดอายุเมื่อไร
- travel-prep — เช็กลิสต์เดินทาง วีซ่า ประกัน เอกสาร
- gift-idea-tracker — จำวันเกิด/ของขวัญที่เคยให้คนรอบตัว
- decision-journal — บันทึกการตัดสินใจใหญ่ รอผลแล้วกลับมาเรียนรู้

**Commands (5):** /week-review, /meeting, /triage-mail, /travel, /decide

---

### 3 · thai-workplace

**จุดต่างจากตลาด:** ตลาดมีแต่ Feishu/WeCom/Slack — ไม่มีอะไรของไทยเลย ทั้งที่ LINE เป็นช่องทางหลักของ SME ไทย

**Agents (4):** line-admin (LINE OA + Messaging API), thai-doc-writer (เอกสารไทย), compliance-helper (PDPA/แรงงาน เบื้องต้น), tax-helper (ภาษี SME ไทยเบื้องต้น)

**Skills (12):**
- line-oa-setup — ตั้ง LINE OA + Messaging API: webhook, channel token
- line-chatbot — บอทตอบคำถามลูกค้าจาก knowledge base บริษัท
- line-broadcast — ส่งข่าวสาร/โปรโมชัน ภายใต้โควต้าแพ็กเกจ
- line-richmenu — ออกแบบเมนูปุ่มใต้แชท
- doc-quotation — ใบเสนอราคา/ใบวางบิล/ใบแจ้งหนี้ ถูกรูปแบบ
- doc-thai-official — หนังสือราชการ/หนังสือบริษัท ภาษา+รูปแบบถูกต้อง
- doc-contract-th — สัญญาจ้าง/สัญญาเช่า เบื้องต้น + ช่องที่ต้องให้ทนายดู
- doc-leave — ระบบใบลา/ใบลาเพื่อช่วยเหลือบุตร ฯลฯ ตามกฎแรงงาน
- pdpa-workflow — ขยายจาก `pdpa-compliance` ที่มี: ฟอร์มยินยอม, บันทึกเหตุละเมิด, แจ้งเจ้าของข้อมูล
- tax-vat-th — ภ.พ. 30 / ภ.ง.ด. 1/3/53 ใครยื่นอะไรเมื่อไร
- thai-holidays — วันหยุดนักขัตฤกษ์+วันสำคัญธุรกิจไทย
- social-security-th — ประกันสังคม/กองทุนสำรองเลี้ยงชีพ ฐานคำนวณ

**Commands (6):** /line-setup, /line-bot, /quotation, /contract, /pdpa, /tax-due

**ข้อจำกัดที่ต้องเขียนไว้ใน skill:** เรื่องภาษีและกฎหมายต้องบอกว่า "เบื้องต้น ไม่ใช่คำปรึกษาทนาย/นักบัญชี" และต้องอ้างกรมหรือหน่วยงานทุกครั้ง · LINE Messaging API มีค่าใช้จ่ายรายเดือนตามแพ็กเกจของ LINE

---

### 4 · graphic-design

**จุดต่างจากตลาดและของเดิม:** software-company มี skill graphic-design แต่เน้นหน้าจอ product และเอกสาร · kimi-design ที่ผู้ใช้ติดตั้งไว้ทำ infographic และโปสเตอร์ด้วย Domain-Specific Language (DSL) · plugin นี้เน้น **วิดีโอ · ระบบแบรนด์ · วิจารณ์งาน** ที่ยังไม่มีตัวไหนทำ

**Agents (4):** art-director (บรีฟภาพ/วิดีโอ AI ให้ได้รสเดียวกัน), brand-keeper (brand kit ชุดเดียวใช้ทุกงาน), social-creator (งานโพสต์/โฆษณา), design-critic (วิจารณ์ตาดี)

**Skills (10):**
- brand-kit — โลโก้ สี ฟอนต์ tone บันทึกเป็นไฟล์ชุดเดียว เรียกใช้ซ้ำได้
- brief-to-image — แปลง brief งาน → prompt ภาพ รุ่น/สไตล์/แสง ครบ
- style-consistency — กฎทำภาพชุดให้ดูเป็นคนเดียวทำ (palette, composition, mood)
- image-editing-brief — บรีฟแก้ภาพต่อเนื่อง: เอาอะไร ใส่อะไร คงอะไรไว้
- video-script-to-clip — สคริปต์วิดีโอสั้น: hook 3 วิ, shot list, caption
- motion-basics — หลัก motion graphics สำหรับคนไม่ใช่ designer
- social-formats — ขนาดมาตรฐานทุกแพลตฟอร์ม + safe zone
- design-review — รายการตรวจงาน: hierarchy, contrast, spacing, ความสะอาด
- campaign-set — ชุดงานหลายชิ้นจากแคมเปญเดียว (feed/story/banner/ปก)
- asset-organize — ตั้งชื่อ+จัดโฟลเดอร์ไฟล์งานดีไซน์ให้หาเจอ

**Commands (6):** /brand-init, /brief, /video, /review-design, /campaign, /resize-all

---

### 5 · dev-learning (สำรอง — ทำทีหลัง)

**เหตุผล:** programmer ต้องตามข่าวตลอด แต่ skill ที่มีมากับระบบ (scholar, deep-research) ครอบคลุมพอสมควรแล้ว จึงไว้ลำดับท้าย

**Skills ที่วางไว้:** tech-radar (สรุป release notes/library ที่ตามอยู่รายสัปดาห์), paper-to-practice (แปลง paper/blogs เป็นโค้ดตัวอย่าง), learning-path (แผนเรียนเทคใหม่จากโปรเจกต์จริง), english-tech-reading (อ่านเอกสารอังกฤษให้เข้าใจเร็ว)

---

### ลำดับทำ

1. **trading-finance** — ผู้ใช้สนใจเอง ลองกับตัวเองได้ทันที และตลาดนักเทรดรายย่อยยังว่าง
2. **personal-life** — ใช้ได้กว้างที่สุด ไม่ต้องพึ่ง API ภายนอกเลย
3. **thai-workplace** — ต้องเช็ก LINE Messaging API และกฎหมายกับภาษีปัจจุบันก่อนลงมือ
4. **graphic-design** — เสริม kimi-design ที่มีอยู่
5. **dev-learning** — เมื่อที่ 1–4 เสร็จ

กฎเดิมที่ใช้กับทุก plugin: ผ่าน `scripts/check/validate-marketplace.mjs` ก่อน commit · เพิ่มชื่อใน `marketplace.json` · เพิ่มแถวในตาราง plugin ของ `README.md` · ติดตั้งแล้วตรวจด้วย `/doctor`

---

### รอบสอง (6 ต.ค. 2569) — ทำให้ลึก และเพิ่ม plugin ชีวิตประจำวัน

**ปัญหาที่พบในรอบแรก:** skill ส่วนใหญ่ยาวราว 25 บรรทัด มีแต่หัวข้อ ยังไม่มีตัวเลข แบบฟอร์ม หรือกำหนดเวลาจริง · รอบนี้ทุก skill ต้องมีข้อมูลที่ตรวจกับแหล่งทางการแล้ว (ระบุวันที่ตรวจและลิงก์) · ตัวเลขที่ยืนยันไม่ได้ใส่ป้าย `(รอยืนยัน)`

#### เติม skill ใน plugin เดิม

| Plugin | ทำให้ลึก | skill ใหม่ |
|---|---|---|
| trading-finance → 0.2.0 | `tax-basics-th` | `tax-deduction-planner` · `mutual-fund-picker` · `retirement-plan` · `debt-payoff` · `insurance-review` · `emergency-fund` |
| thai-workplace → 0.2.0 | `tax-vat-th` · `social-security-th` · `doc-thai-official` | `payroll-th` · `e-tax-invoice` · `dbd-annual-filing` · `labour-law-basics` · `promptpay-qr` |
| personal-life → 0.2.0 | — | `subscription-audit` · `digital-hygiene` · `goal-and-habit` · `polite-message-th-en` |
| dev-learning → 0.2.0 | skill เดิมที่สั้นกว่า 30 บรรทัด | `cert-prep` · `side-project-picker` |

#### plugin ใหม่

| # | Plugin | สำหรับ | skill |
|---|---|---|---|
| 6 | **online-seller** | แม่ค้าออนไลน์ Shopee · Lazada · TikTok Shop · LINE | `product-listing` · `marketplace-fees-pricing` · `multi-shop-stock` · `chat-reply-templates` · `live-selling-script` · `shipping-compare` · `returns-and-bad-reviews` · `seller-tax-basics` |
| 7 | **home-family** | ทุกบ้าน | `household-bills` · `home-maintenance` · `vehicle-care` · `meal-plan-grocery` · `kids-school` · `elder-care` · `pet-care` |
| 8 | **career** | คนทำงาน | `resume-th-en` · `interview-prep` · `salary-negotiation` · `performance-self-review` · `linkedin-profile` |
| 9 | **health-wellness** | ทุกคน — จัดระเบียบและเตรียมคำถาม ไม่วินิจฉัย ไม่สั่งยา | `exercise-plan` · `sleep-log` · `annual-checkup` · `medication-schedule` · `doctor-visit-prep` |
| 10 | **consumer-rights** | ผู้ซื้อ | `buy-compare` · `warranty-tracker` · `complaint-letter-th` · `refund-request` |

**ขั้นต่อไป:** ไล่ตรวจรายการ `(รอยืนยัน)` ทั้งชุดทุกต้นปีภาษี และเมื่อหน่วยงานประกาศอัตราใหม่
