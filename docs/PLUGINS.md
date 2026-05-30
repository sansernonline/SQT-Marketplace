# 📦 Plugins ใน SQT Marketplace

ทั้งหมด **6 plugins** — เลือกติดตั้งตามอุตสาหกรรม

---

## 🏢 `software-company` (Core, Required)

Plugin หลัก — จำลองทีมพัฒนาซอฟต์แวร์ครบ SDLC

### มีอะไรบ้าง
**12 agents · 14 skills · 15 commands**

Agents: product-manager, project-manager, business-analyst, solution-architect, system-analyst, ux-designer, developer, qa-tester, devops-engineer, security-engineer, technical-writer, seo-specialist

### ติดตั้ง
```
/plugin install software-company@sqt-marketplace
```

### เหมาะกับ
- ✅ บริษัทซอฟต์แวร์ทั่วไป
- ✅ Startup ทุกขนาด
- ✅ Foundation สำหรับ plugin อื่นใน marketplace นี้

---

## 🏦 `software-company-fintech` (Add-on)

FinTech — payments, compliance, risk

### มีอะไรบ้าง
**4 agents · 3 skills · 2 commands**

| Agents | Skills | Commands |
|--------|--------|----------|
| fintech-engineer | pci-dss-compliance | /pci-audit |
| payment-integration | kyc-aml-patterns | /transaction-flow-design |
| compliance-officer | payment-gateway-integration | |
| quant-analyst | | |

### ติดตั้ง
```
/plugin install software-company-fintech@sqt-marketplace
```

### เหมาะกับ
- ✅ Banking / E-money / Payments
- ✅ Trading / Lending / Insurance tech
- ✅ Crypto exchanges

---

## 🤖 `software-company-ai` (Add-on)

AI/ML — model engineering, LLM systems, MLOps

### มีอะไรบ้าง
**5 agents · 3 skills · 2 commands**

| Agents | Skills | Commands |
|--------|--------|----------|
| ml-engineer | rag-architecture | /rag-design |
| data-engineer | prompt-engineering-patterns | /llm-eval |
| prompt-engineer | llm-evaluation-patterns | |
| llm-architect | | |
| mlops-engineer | | |

### ติดตั้ง
```
/plugin install software-company-ai@sqt-marketplace
```

### เหมาะกับ
- ✅ AI product teams
- ✅ Production LLM applications
- ✅ MLOps teams
- ✅ Data science teams

---

## 🏥 `software-company-healthcare` (Add-on)

Healthcare — HIPAA compliance, FHIR/HL7, clinical workflows

### มีอะไรบ้าง
**4 agents · 3 skills · 2 commands**

| Agents | Skills | Commands |
|--------|--------|----------|
| healthcare-engineer | hipaa-compliance | /hipaa-audit |
| hipaa-officer | fhir-implementation | /fhir-design |
| fhir-specialist | clinical-workflows | |
| clinical-data-analyst | | |

### ติดตั้ง
```
/plugin install software-company-healthcare@sqt-marketplace
```

### เหมาะกับ
- ✅ Health tech / EHR vendors
- ✅ Telemedicine platforms
- ✅ Clinical research software
- ✅ Healthcare analytics
- ✅ บริษัทที่ต้อง HIPAA/PDPA compliant

---

## 🛒 `software-company-ecommerce` (Add-on)

E-commerce — checkout, recommendations, inventory, conversion

### มีอะไรบ้าง
**4 agents · 3 skills · 2 commands**

| Agents | Skills | Commands |
|--------|--------|----------|
| ecommerce-engineer | checkout-optimization | /checkout-audit |
| recommendation-engineer | recommendation-systems | /recommendation-design |
| inventory-specialist | inventory-management | |
| cro-specialist | | |

### ติดตั้ง
```
/plugin install software-company-ecommerce@sqt-marketplace
```

### เหมาะกับ
- ✅ E-commerce stores (D2C, B2B, marketplace)
- ✅ Retail tech
- ✅ Marketplace platforms (Lazada/Shopee-like)
- ✅ Subscription commerce

---

## 🎮 `software-company-gaming` (Add-on)

Gaming — game dev, multiplayer, design, live ops

### มีอะไรบ้าง
**4 agents · 3 skills · 2 commands**

| Agents | Skills | Commands |
|--------|--------|----------|
| game-developer | game-architecture | /game-design |
| multiplayer-engineer | multiplayer-netcode | /multiplayer-architecture |
| game-designer | live-ops-patterns | |
| live-ops-specialist | | |

### ติดตั้ง
```
/plugin install software-company-gaming@sqt-marketplace
```

### เหมาะกับ
- ✅ Game studios (indie to AAA)
- ✅ Mobile F2P
- ✅ Esports platforms
- ✅ Web3 gaming
- ✅ Game backend services

---

## 🎯 ติดตั้งชุดไหนดี

```
สถานการณ์                          → ติดตั้ง
═══════════════════════════════════════════════════════════════════
ทีม software ทั่วไป                  → software-company
บริษัท FinTech                       → core + fintech
ทีม AI product                       → core + ai
Healthcare startup                   → core + healthcare
E-commerce store                     → core + ecommerce
Game studio                          → core + gaming
FinTech ที่ใช้ AI fraud detection   → core + fintech + ai
Healthcare ที่ใช้ ML                  → core + healthcare + ai
E-commerce ที่ใช้ ML recsys         → core + ecommerce + ai
Game studio + esports analytics      → core + gaming + ai
Startup ทดลอง (เลือกทีหลัง)        → core เท่านั้น
```

## 📊 Marketplace Total

```
6 plugins
33 agents (12 core + 21 add-on)
29 skills (14 core + 15 add-on)
25 commands (15 core + 10 add-on)
```

## 🔄 อัปเดต Plugins

```
/plugin marketplace update sqt-marketplace
/plugin update software-company
/plugin update <other-plugins>
```

## ❌ ถอนการติดตั้ง

```
/plugin uninstall software-company-gaming
/plugin uninstall software-company         # ระวัง: add-ons จะใช้ skill ไม่ได้
```

---

## 📂 โครงสร้าง Marketplace

```
SQT-Marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── software-company/              ← core (REQUIRED)
│   ├── software-company-fintech/      ← add-on
│   ├── software-company-ai/           ← add-on
│   ├── software-company-healthcare/   ← add-on
│   ├── software-company-ecommerce/    ← add-on
│   └── software-company-gaming/       ← add-on
├── docs/
│   ├── INSTALL.md
│   ├── USAGE.md
│   ├── REFERENCE.md
│   └── PLUGINS.md     ← you are here
└── README.md
```

## 💡 ทำไม add-on ต้องพึ่ง software-company

Plugins add-on **อ้างอิง shared skills** จาก software-company (เพื่อ DRY):

```
software-company-fintech / healthcare / ecommerce / gaming / ai
  └── ทุก agent + command → ใช้ polished-document-style skill
                                         ↓
                                ⚠️ skill นี้อยู่ใน software-company
```

ไม่ติด software-company:
- ❌ Output จะไม่สวย (ไม่มี polished format)
- ❌ ไม่มี shared skills (commit format, code review, etc.)

→ **ติดตั้ง software-company ก่อนเสมอ**
