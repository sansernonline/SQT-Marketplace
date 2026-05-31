# ⚡ Commands Cheatsheet

Quick reference for commands ที่ใช้บ่อยที่สุด — แยกตามจังหวะ workflow

> 💡 **อ่านแบบเร็ว:** ดู Top 10 ก่อน, แล้วค่อยขยายตามอุตสาหกรรม

---

## 🏆 Top 10 Daily-Use Commands

ใช้แทบทุกวันถ้าทำงานพัฒนาซอฟต์แวร์

| Command | สำหรับ | ความถี่ |
|---------|--------|--------|
| 1. `/feature-kickoff <feature>` | เริ่ม feature ใหม่ — BA + Architect + SA + PM | 🟢 ทุก feature |
| 2. `/code-review <file>` | Review โค้ดอย่างเป็นระบบ | 🟢 ทุก PR |
| 3. `/test-design <feature>` | ออกแบบ test cases | 🟢 ทุก feature |
| 4. `/bug-report <issue>` | สร้าง bug report ครบ field | 🟢 เมื่อเจอบั๊ก |
| 5. `/api-design <feature>` | ออกแบบ API spec | 🟡 ทุก endpoint |
| 6. `/sprint-plan <sprint>` | Sprint planning | 🟡 ทุก sprint |
| 7. `/retrospective <sprint>` | Sprint retro | 🟡 ทุก sprint |
| 8. `/security-scan <scope>` | Security audit | 🟡 ก่อน release |
| 9. `/architecture-review <system>` | Architecture review | 🟢 ทุก quarter |
| 10. `/release-notes <version>` | Release notes สำหรับ user | 🟢 ทุก release |

---

## 🌅 ตามจังหวะ — เมื่อไหร่ใช้คำสั่งไหน

### 📅 Daily

```
เช้า:        ตรวจ .claude/context/INDEX.md (ทำงานต่อจากเมื่อวาน)
             /sprint-plan ถ้าวันแรกของ sprint

ระหว่างวัน:  /code-review เมื่อเปิด PR
             /bug-report เมื่อเจอบั๊ก
             /api-design ก่อนเขียน endpoint

ก่อนเลิก:    Agent บันทึก work-session-context อัตโนมัติ
             ดูว่ามีอะไรค้าง (Open questions, Next steps)
```

### 📊 Weekly

```
ต้นสัปดาห์:  /sprint-plan (ถ้าเริ่ม sprint)
             ทบทวน /product-roadmap

กลางสัปดาห์: /architecture-review (ถ้ามี design decision)
             /threat-model (ถ้ามี feature ที่กระทบ security)

ปลายสัปดาห์: /retrospective (ถ้าจบ sprint)
             /test-design (ก่อนเข้า QA)
```

### 🚀 Per Release

```
ก่อน release:
  /security-scan code         # ตรวจช่องโหว่
  /security-scan deps         # ตรวจ dependencies
  /test-design <release>      # test coverage
  /architecture-review        # ถ้ามี breaking change

ตอน release:
  /release-notes <version>    # สำหรับ user
  ผู้ใช้ commit-message-format # conventional commits

หลัง release:
  /retrospective <release>
  ถ้ามี incident: /incident-response
```

### 📈 Per Quarter

```
/product-roadmap Q1-Q4 <year>   # roadmap ใหม่
/architecture-review            # tech debt audit
/seo-audit                      # SEO ทบทวน
```

---

## 🎯 ตาม Scenario — แค่มีปัญหา ใช้คำสั่งไหน

### 🆕 "อยากเริ่ม feature ใหม่"
```
/feature-kickoff ระบบจองห้องประชุม
```
→ BA → Architect → SA → PM workflow ครบชุด

### 🐛 "เจอบั๊ก"
```
/bug-report เมื่อ click save app crashes
```
→ Severity/priority + steps to reproduce + evidence

### 🔍 "ต้อง review PR"
```
/code-review src/auth/login.ts
```
→ Security + design + tests + readability checklist

### 🚨 "เกิด incident"
```
/incident-response checkout API down since 14:00 UTC
```
→ Containment → diagnosis → mitigation → postmortem

### 🔒 "อยาก check security ก่อน launch"
```
/threat-model <feature>          # STRIDE analysis
/security-scan <code/deps/infra> # vulnerability audit
```

### 📊 "ต้องวางแผน roadmap"
```
/product-roadmap Q1-Q4 2026
```
→ RICE prioritization + Gantt + KPIs

### 👋 "Onboard developer ใหม่"
```
/onboard backend developer
```
→ 30/60/90 day plan + setup checklist

### 📝 "อยากเขียน release notes"
```
/release-notes v2.5.0
```
→ User-facing changes (ไม่ใช่ dev-speak)

### 🎯 "Sprint planning"
```
/sprint-plan Sprint 12 - Q1 launch
```
→ Capacity + stories + risks

### 🔁 "Sprint จบ ทำ retro"
```
/retrospective Sprint 11
```
→ Glad/Sad/Mad + action items

---

## 🏭 Industry-Specific Commands

ใช้เฉพาะถ้าติด add-on plugin

### 🏦 FinTech
```
/pci-audit <scope>                   # PCI-DSS readiness
/transaction-flow-design <use case>  # ออกแบบ money flow
```

### 🤖 AI/ML
```
/rag-design <use case>               # ออกแบบ RAG system
/llm-eval <application>              # สร้าง eval suite
```

### 🏥 Healthcare
```
/hipaa-audit <scope>                 # HIPAA readiness
/fhir-design <feature>               # FHIR API design
```

### 🛒 E-commerce
```
/checkout-audit                      # วิเคราะห์ checkout
/recommendation-design               # ออกแบบ recsys
```

### 🎮 Gaming
```
/game-design <game type>             # core loop + progression
/multiplayer-architecture            # netcode + matchmaking
```

### 🌐 IoT
```
/iot-architecture <use case>         # device/edge/cloud
/device-fleet-design <fleet>         # provisioning + OTA
```

### 🔒 Cybersecurity
```
/threat-hunt <hypothesis>            # proactive threat hunting
/soc-design <org>                    # SOC architecture
```

### 🏢 SaaS B2B
```
/saas-architecture-review <area>     # multi-tenancy review
/integration-design <integration>    # SSO/SCIM/webhook
```

### 🔧 DevTools
```
/sdk-design <api>                    # multi-language SDK
/dx-audit <product>                  # developer experience
```

### 📱 Mobile
```
/mobile-architecture <app>           # framework + architecture
/aso-audit <app>                     # App Store optimization
```

### 🌐 Web3
```
/smart-contract-audit <repo>         # security audit
/tokenomics-design <protocol>        # token economics
```

### ⚖️ LegalTech
```
/contract-analysis-design <use>      # clause extraction system
/esignature-audit <system>           # eIDAS/ESIGN compliance
```

### 🛡️ InsurTech
```
/claims-flow-design <LOB>            # FNOL + triage + settlement
/underwriting-model-design <LOB>     # risk scoring + pricing
```

---

## 💎 Top 5 Hidden Gems

คำสั่งที่ underrated แต่ใช้แล้วช่วยมาก

### 1. `/onboard`
```
/onboard backend developer
```
ช่วยมากตอน hire ใหม่ — 30/60/90 day plan ครบ ไม่ต้องเริ่มจากศูนย์

### 2. `/threat-model`
```
/threat-model feature payment
```
ใช้ก่อนสร้าง feature ที่มี risk — STRIDE analysis ครบ

### 3. `/architecture-review`
```
/architecture-review payment service
```
ทุก quarter ทบทวน — เห็น tech debt + bottlenecks ก่อนเจอปัญหา

### 4. `/release-notes`
```
/release-notes v2.5.0
```
แปลง dev jargon เป็นภาษา user ที่อ่านเข้าใจ

### 5. `/retrospective`
```
/retrospective Sprint 11
```
ทำให้ retro มีโครงสร้าง + action items + carry-over tracking

---

## 🚀 Workflow Bundles

ใช้หลายคำสั่งรวมกันเป็น workflow

### 🌟 Bundle: เริ่ม feature ใหม่ครบชุด

```
1. /feature-kickoff <feature>
   ↓ (BA + Architect + SA + PM ทำงาน)

2. /api-design <feature>
   ↓ (SA ออกแบบ API spec)

3. /threat-model <feature>
   ↓ (Security ตรวจสอบ)

4. /test-design <feature>
   ↓ (QA ออกแบบ test)

5. (Dev implement)

6. /code-review <files>
   ↓ (review ก่อน merge)

7. /release-notes <version>
   ↓ (เขียน release notes)
```

### 🌟 Bundle: Sprint cycle

```
ต้น sprint:    /sprint-plan
ระหว่าง:        /code-review (per PR)
                /bug-report (when found)
ปลาย sprint:   /retrospective
                /release-notes (ถ้า release)
```

### 🌟 Bundle: Pre-launch security

```
1. /security-scan code     # SAST
2. /security-scan deps     # SCA
3. /security-scan infra    # config audit
4. /threat-model launch
5. /architecture-review    # final check
```

### 🌟 Bundle: Production incident

```
1. /incident-response <issue>
   ↓ (containment + diagnosis)

2. (mitigation)

3. (use postmortem-template skill)
   ↓ (blameless analysis)

4. Action items → /sprint-plan (next sprint)
```

---

## 🎓 Tips สำหรับใช้ให้คุ้ม

### 1. ใช้ `<args>` ให้ละเอียด
```
❌ /code-review
✅ /code-review src/auth/login.ts (focus on security)
```
ยิ่ง args ละเอียด → ผลลัพธ์ตรงประเด็น

### 2. รัน command ก่อน ดูผล แล้วค่อย iterate
```
/feature-kickoff ระบบสมาชิก
↓
(BA ทำ BRD เสร็จ)
↓
"ไม่ต้องครอบคลุม Enterprise features"
↓
(BA ปรับ scope)
```

### 3. ใช้ `work-session-context` ทุกครั้งจบงาน
จะได้ resume ได้แม้ปิด terminal — ไม่ต้องจำเอง

### 4. ใช้ industry plugins อย่าง opportunistic
ไม่ต้องติดทุก plugin — ติดเฉพาะที่ใช้
```
/plugin install software-company@sqt-marketplace          # ต้อง
/plugin install software-company-<industry>@sqt-marketplace # ถ้าจำเป็น
```

### 5. ดูว่า command ใช้ agent + skill อะไรบ้าง
ใน `docs/REFERENCE.md` มีรายละเอียดครบ — เลือก context ได้ดี

---

## 📚 อ่านเพิ่ม

- **[REFERENCE.md](REFERENCE.md)** — รายละเอียดทุก agent/skill/command ของ core plugin
- **[USAGE.md](USAGE.md)** — workflow + ตัวอย่างจริง
- **[PLUGINS.md](PLUGINS.md)** — overview plugins ทั้งหมด
- **[INSTALL.md](INSTALL.md)** — วิธีติดตั้ง 3 รูปแบบ

---

## 🆘 อยากให้ Claude เรียก agent โดยตรง

ถ้าไม่มี command ที่ตรง — เรียก agent ตรงๆ ได้:

```
ใช้ developer agent ช่วย refactor function นี้
ให้ business-analyst review BRD ของผม
ให้ qa-tester เขียน test cases สำหรับ login
```

หรือให้ Claude เลือก agent อัตโนมัติจาก context:
```
ช่วยเขียน user story เรื่อง forgot password
(Claude เรียก BA + user-story-writer skill)
```
