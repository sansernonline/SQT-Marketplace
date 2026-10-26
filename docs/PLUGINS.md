# 📦 Plugin ใน SQT Marketplace

ทั้งหมด **6 plugins** · สายพัฒนาซอฟต์แวร์มี `software-company` ตัวเดียว เพราะรวมทุกสาขาไว้แล้วตั้งแต่ v2.0.0

> **รวม plugin รอบ 2 (2026-10-25)** — `thai-workplace` รวมเข้า **`e-commerce`** (skill 19 ตัว คำสั่ง 8 ตัว agent 4 ตัว playbook 5 ตัว) ยกเว้น `line-richmenu` ที่ย้ายไป **`graphic-design`** · `reverse-engineer` รวมเข้า skill `reverse-engineering` และ agent `reverse-engineer` ของ **`software-company`** (module .NET · firmware · network และตัวตรวจเครื่องมือ `check-tools.mjs`) · ถอด plugin เก่าด้วย `/plugin uninstall thai-workplace` และ `/plugin uninstall reverse-engineer` · หัวข้อด้านล่างที่ยังเรียก `thai-workplace` เป็นบันทึกของรอบก่อน
>
> **รวม plugin ชีวิตประจำวัน (2026-10-22)** — `online-seller` + `consumer-rights` → **`e-commerce`** (ซื้อ-ขายออนไลน์ทั้งสองฝั่ง) · `home-family` + `health-wellness` + `career` → **`personal-life`** (ชีวิตประจำวัน 4 หมวด) · `dev-learning` → **`personal-life`** (หมวดเรียนรู้: เรียนเทคโนโลยี paper ใบรับรอง side project วิทยานิพนธ์) · `seller-tax-basics` ย้ายไป `thai-workplace` · `sqt-toolkit` (เคยชื่อ `doc-toolkit`) ยุบแล้ว — skill เอกสารหลัก 4 ตัวกลับเข้า `superuser` ที่เหลือไป `software-company` `graphic-design` `personal-life` · เพิ่ม **`reverse-engineer`** (ลอกสถาปัตยกรรม REA: จุดเข้าเดียว evidence-first) · ชื่อ skill/command เดิมใช้ได้เหมือนเดิม ถอด plugin เก่าด้วย `/plugin uninstall <ชื่อเดิม>` · ไฟล์นี้ลงรายละเอียดเฉพาะ `software-company` — จำนวนของทุก plugin ดูตารางใน [README](../README.md#-plugins) และหน้าแต่ละตัวใน [docs/plugins/](plugins/)

---

## 🧭 `superuser` — แกนกลาง (ใช้ตัวเดียวได้)

ทีมผู้ช่วยทำงานหลายขั้น: หัวหน้าทีมรับงาน → จัดขนาด → brainstorm (งานใหญ่) → เลือก playbook → แจกงานให้ agent ตัวใหม่ → ตรวจกับของจริง → ส่งงาน → เรียนรู้ · ใช้กับงานได้ทุกสาขา (เอกสาร · หาข้อมูล · ร้านค้า · เงิน · โค้ด) · plugin สาขาอื่นต่อยอดจากตัวนี้ทาง `dependencies`

### มีอะไรบ้าง
**3 agents · 37 skills · 0 commands** · 6 playbooks · hook 1 ชุด (skill เอกสารออกแบบ สไลด์ รูป อยู่ใน `software-company` · ภาพ AI ใน `graphic-design` · ประชุมใน `personal-life`)

- **agent กลาง:** brainstormer (คิดทางเลือก) · reviewer (ตรวจด้วยสายตาใหม่) · learning-reviewer (ทบทวนวิธีทำงาน)
- **playbook:** research · document · review · unattended-run · learn-from-session · pickup-and-pause (รับงานต่อ · หยุดงาน)
- **แกนทีม · ส่งต่องาน:** superuser · agent-patterns · handoff · context-budget · status-report · decision-log · flag-and-propose
- **หลักการทำงาน:** simplify · principle-prove-it-works · principle-proceed-on-reversible-work · principle-small-verifiable-steps · principle-build-a-tool-not-handwork · principle-fix-root-cause · principle-user-experience-first · targeted-fix
- **แบ่งงาน · ตรวจ · หาข้อมูล:** parallel-split-and-merge · parallel-attempts-pick-best · adversarial-review-panel · prior-art-review · **research-with-sources** (หาข้อมูลพร้อมแหล่ง ≥ 3 แหล่ง วันที่ และป้ายหลักฐาน)
- **เรียนรู้ · ปรับทีม:** repeated-mistakes-to-checks · session-lessons-to-skills · owner-style-capture · commit-log
- **เขียน:** human-writing · answer-shape · no-ai-look · temp-file-discipline
- **เอกสารหลัก · ข้อความ:** polished-document-style · document-naming · spell-out-abbreviations · polite-message-th-en

รูปทั้งหมด: [`docs/plugins/superuser/`](plugins/superuser/README.md) (flow · map · playbooks)

### เปลี่ยนอะไร (2026-10-22 · superuser 3.0.0)

- **หัวหน้างาน 1 คน** — จัดขนาด + งบ (เร็ว/สมดุล/คุณภาพ ปรับทั้งลูกทีมและผู้ตรวจ) · ใบสั่งงาน 5 ข้อในข้อความส่งงาน · ประเมินลูกทีม ผ่าน/แก้/ทำใหม่ + `TEAM.md` · ตรวจซ้ำจนผ่าน · คำตอบ 3 ระดับ · คาด/จริง + token จาก `log/SUMMARY.md`
- **แกน 2 ชั้น** — `SKILL.md` 27 KB อ่านทุกงาน · `autonomy.md` · `modules.md` เปิดเมื่อถึงจังหวะ · โมดูล 9 ตัวเปิดปิดใน `.claude/superuser/config.json`
- **plugin สาขาเหลือเฉพาะส่วนสาขา** (ราว 12 KB) เปิดแกนจาก superuser · skill เอกสารออกแบบ สไลด์ รูป ประชุม อยู่ใน plugin สาขาที่ใช้มากสุด (เอกสารหลัก 4 ตัวอยู่ในแกน)
- **hook** วัด token ราย agent · ด่านจำสถานะ ไม่ parse transcript ทั้งไฟล์ · self-test 60/60

### เปลี่ยนอะไร (2026-10-21 · superuser 2.0.0 → 2.4.0)

```
ก่อน                                        หลัง
superuser = แม่แบบ + skill 6 ตัว           superuser = แกนที่ใช้ตัวเดียวได้ · skill 43 ตัว
   │                                           │  (ย้ายมาจาก software-company 31 · personal-life 3 · ใหม่ 2)
   ├─ software-company มีทั้งของกลาง          ├─ software-company เหลือเฉพาะงานโค้ด
   │  และของโค้ดปนกัน                         │  + ส่วนเพิ่มงานโค้ด → superuser/references/code-extensions.md
   └─ ติดตั้ง superuser ตัวเดียว              └─ ติดตั้ง superuser ตัวเดียว → ทำงานทุกสาขาได้เต็ม
      ทำได้แค่งานทั่วไปพื้นฐาน                    ติดตั้งสาขา → ได้แกนกลางมาเอง (dependencies)
```

- **ใหม่:** `handoff` (ใบสั่งงาน · ใบส่งงาน · รับงานต่อ · inbox · log · รวม `work-session-context` เดิม) · `research-with-sources`
- **ย้ายเข้าแกน:** skill ทั่วไป 31 ตัวจาก software-company (รวม `html-slide-deck` · `pptx-to-html-deck`) · `meeting-prep-card` · `meeting-summary` · `polite-message-th-en` จาก personal-life · playbook `pickup-and-pause` แบบใช้ได้ทุกงาน
- **รวมบางส่วนเข้าแกน:** วิธีทำปก 3 แนว โหวต 2 ใน 3 → `branded-document-design` · วิธีเขียน prompt และทำภาพเป็นชุด → `image-generation`
- **ไม่เปลี่ยนชื่อ skill** — งานเดิมเรียกชื่อเดิมได้ · plugin สาขาได้ skill ชุดนี้ผ่าน `dependencies` เหมือนเดิม

### ติดตั้ง
```
/plugin install superuser@sqt-marketplace
```
ติดตั้ง plugin สาขาตัวไหน Claude Code จะติดตั้ง superuser ให้เอง

---

## 🏢 `software-company`

จำลองบริษัทซอฟต์แวร์ครบทุกขั้นของ Software Development Life Cycle (SDLC) ตั้งแต่ทีมหลัก (product · analysis · architecture · design · development · QA · DevOps · security) ไปจนถึงผู้เชี่ยวชาญเฉพาะสาขา

### มีอะไรบ้าง
**38 agents · 97 skills · 29 commands** (ไม่นับ skill กลาง 32 ตัวจาก `superuser`)

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
│   ├── skills/      95 skill + 29 คำสั่ง (คำสั่งตั้ง disable-model-invocation: true)
│   └── (hook อยู่ใน plugins/superuser/hooks/ · ใช้ร่วมทาง dependencies)
├── plugins/superuser · e-commerce · trading-finance · personal-life · graphic-design
├── docs/            INSTALL · USAGE · REFERENCE · PLUGINS (ไฟล์นี้)
└── README.md
```

---

## plugin ชีวิตประจำวันรุ่นปัจจุบัน

จำนวน agent · skill · คำสั่ง ที่อัปเดตตามของจริงอยู่ในตารางของ [`README.md`](../README.md) (สร้างจาก `sync-docs`) · แผนผังของแต่ละ plugin อยู่ใน [`docs/plugins/`](plugins/README.md)

| plugin | รุ่น | เพิ่มล่าสุด (2026-10-26) | ก่อนขึ้น 1.0.0 |
|---|---|---|---|
| `trading-finance` | 0.13.0 | skill เครดิตบูโร · ปรับพอร์ตและ DCA · พันธบัตรและเงินฝาก · รีไฟแนนซ์บ้าน | ใช้จริง 2–3 สัปดาห์ · รัน eval 8 เคส |
| `personal-life` | 0.15.0 | skill มรดกและพินัยกรรม · ตั้งครรภ์และลูกเล็ก · เตรียมรับน้ำท่วม | ใช้จริง 2–3 สัปดาห์ · รัน eval 9 เคส |
| `graphic-design` | 0.12.0 | skill รูปสินค้าบน marketplace · ไฟล์ส่งโรงพิมพ์ · ปกคลิป YouTube | ใช้จริง 2–3 สัปดาห์ · รัน eval 26 เคส |
| `e-commerce` | 1.1.0 | skill บัญชี SME · กระแสเงินสด | ขึ้น 1.0.0 แล้วเพราะรวม plugin |

ข้อเท็จจริงที่หมดอายุตามปฏิทินของทุก plugin อยู่ใน `scripts/check/expiry.json` ตัวตรวจเตือนเมื่อเหลือไม่ถึง 30 วัน

---

## 🗺️ Roadmap — plugin ชีวิตประจำวัน

_ร่างเมื่อ 6 ต.ค. 2569 · software-company ครอบงาน "สร้างซอฟต์แวร์" แล้ว ชุดนี้จึงเสนอ plugin สำหรับใช้ในชีวิตประจำวัน_

> **แผนเก่า เก็บไว้ดูที่มา** — ตัวเลขและสถานะในหัวข้อนี้เป็นของวันที่ร่าง (เช่น dev-learning ที่เขียนว่า "สำรอง" ส่งแล้วเป็น v0.6.0 และรวมเข้า `personal-life` หมวดเรียนรู้เมื่อ 22 ต.ค. 2569) · จำนวนจริงปัจจุบันดูตารางใน [README](../README.md#-plugins)

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

**Skills (11):** (`meeting-prep-card` · `meeting-summary` · `polite-message-th-en` ย้ายไปเป็นของกลางใน `superuser` แล้ว)
- weekly-review — ทบทวนสัปดาห์: อะไรคุ้ม อะไรเสียเวลา
- inbox-triage — วิธีคัดอีเมลที่ต้องตอบวันนี้ (ใช้กับ plugin อีเมลที่มีอยู่)
- calendar-audit — ตรวจปฏิทินว่าเวลาไปอยู่ไหน แนะนำบล็อกเวลา
- personal-kb — ระบบจดโน้ตส่วนตัวที่ค้นหาเจอ (ชื่อคน/สัญญา/รหัสผ่านไม่ใช่ — อ้างอิงไปยัง password manager)
- important-docs — ทะเบียนสำคัญ: บัตร สัญญา ประกัน หมดอายุเมื่อไร
- travel-prep — เช็กลิสต์เดินทาง วีซ่า ประกัน เอกสาร
- gift-idea-tracker — จำวันเกิด/ของขวัญที่เคยให้คนรอบตัว
- subscription-audit — หาและตัดค่าบริการรายเดือนที่ไม่ใช้
- digital-hygiene — ตั้งรหัสผ่าน 2FA สำรองข้อมูล กันบัญชีถูกยึด
- goal-and-habit — ตั้งเป้ารายไตรมาส สร้างหรือเลิกนิสัย
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
