# Plugin Reference

รายละเอียดทุก agent, skill, command ใน plugin

---

## 🧑‍💼 Agents (38)

> `model:` ใน frontmatter ของแต่ละ agent เป็นค่าเริ่มต้น — เมื่องานผ่าน A-Team หัวหน้าทีมเลือกระดับโมเดลตามงาน (ใหญ่ = opus · กลาง = sonnet · เล็ก = haiku) ดู [agent-team](#63-agent-team)

### 1. project-manager
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, TodoWrite

**ใช้เมื่อ:**
- วางแผน project, timeline, milestones
- ติดตาม progress
- จัดการ risk
- เขียน status report
- Sprint planning

**ไม่ใช้กับ:** การเขียนโค้ด, design architecture, ตัดสินใจ business

---

### 2. business-analyst
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, Skill

**ใช้เมื่อ:**
- เก็บ requirement จาก stakeholder
- เขียน BRD (Business Requirements Document)
- เขียน user stories + acceptance criteria
- วิเคราะห์ business process

**Skills ที่ใช้:** `user-story-writer`

---

### 3. solution-architect
**Model:** Opus (ใช้โมเดลที่แรงกว่าเพราะตัดสินใจสำคัญ)
**Tools:** Read, Write, Edit, Grep, Glob, Skill, WebFetch

**ใช้เมื่อ:**
- ออกแบบ system architecture
- เลือก tech stack
- วิเคราะห์ trade-offs ทางเทคนิค
- เขียน ADR (Architecture Decision Record)

**Skills ที่ใช้:** `adr-writer`

---

### 4. system-analyst
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob

**ใช้เมื่อ:**
- เขียน FSD (Functional Specification Document)
- ออกแบบ use cases
- กำหนด API specifications
- ออกแบบ data model
- เขียน sequence diagrams

---

### 5. ux-designer
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob

**ใช้เมื่อ:**
- ออกแบบ user flow
- สร้าง wireframe (ASCII/markdown)
- กำหนด interaction design
- ตรวจ accessibility

---

### 6. developer
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, Bash, Skill, TodoWrite

**ใช้เมื่อ:**
- Implement code
- เขียน unit tests
- Refactor
- แก้ bug
- Code review

**Skills ที่ใช้:** `code-review-checklist`, `commit-message-format`, `pr-description-template`

---

### 7. qa-tester
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, Bash, Skill

**ใช้เมื่อ:**
- สร้าง test plan
- ออกแบบ test cases
- รายงาน bug
- Exploratory testing
- Regression testing

**Skills ที่ใช้:** `test-case-template`, `bug-report-template`

---

### 8. devops-engineer
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, Bash

**ใช้เมื่อ:**
- สร้าง CI/CD pipeline
- เขียน Dockerfile, K8s configs
- Infrastructure as Code
- ตั้ง monitoring/logging/alerting
- จัดการ deployment
- Incident response

**Skills ที่ใช้:** `postmortem-template`

---

### 9. seo-specialist
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, WebFetch, Skill

**ใช้เมื่อ:**
- ทำ SEO audit
- Keyword research
- เขียน title/meta description
- วางแผน on-page SEO
- ออกแบบ URL structure
- กำหนด structured data (Schema.org)
- วิเคราะห์ competitor SEO

**Skills ที่ใช้:** `seo-audit-checklist`

---

### 10. product-manager ⭐ NEW
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, Skill, WebFetch, WebSearch

**ใช้เมื่อ:**
- กำหนด product vision และ strategy
- สร้าง roadmap (quarterly/yearly)
- จัดลำดับ feature ด้วย RICE/MoSCoW
- ทำ user research
- เขียน PRD
- วิเคราะห์ competitive landscape
- กำหนด product KPIs

**ต่างจาก project-manager อย่างไร:**
- product-manager: WHAT + WHY (กลยุทธ์)
- project-manager: HOW + WHEN (delivery)

**Skills ที่ใช้:** `polished-document-style`, `user-story-writer`

---

### 11. technical-writer ⭐ NEW
**Model:** Sonnet
**Tools:** Read, Write, Edit, Grep, Glob, Skill

**ใช้เมื่อ:**
- เขียน user guide / tutorial
- เขียน API documentation
- สร้าง README
- เขียน release notes
- ออกแบบ onboarding doc

**Framework ใช้:** Diátaxis (Tutorial / How-To / Reference / Explanation)

**Skills ที่ใช้:** `polished-document-style`, `commit-message-format`

---

### 12. security-engineer ⭐ NEW
**Model:** Opus (ใช้โมเดลที่แรงกว่าเพราะ stakes สูง)
**Tools:** Read, Write, Edit, Grep, Glob, Bash, Skill, WebFetch

**ใช้เมื่อ:**
- ทำ threat modeling (STRIDE)
- Security code review
- กำหนด authentication / authorization
- ตรวจสอบ compliance (PDPA, GDPR, PCI-DSS, SOC2)
- ตอบสนอง security incident
- Vulnerability assessment

**Framework ใช้:** OWASP Top 10, STRIDE, Defense in Depth

**Skills ที่ใช้:** `polished-document-style`, `postmortem-template`, `code-review-checklist`

---

## 🛠️ Skills (101)

### 1. user-story-writer
**ใช้กับ:** business-analyst, product-manager
**Output:** User story รูปแบบ "As a... I want... So that..." + Given-When-Then acceptance criteria
**Includes:** INVEST checklist, priority, story points, dependencies

---

### 2. adr-writer
**ใช้กับ:** solution-architect
**Output:** Architecture Decision Record
**Includes:** Context, options compared, decision rationale, consequences (positive/negative)

---

### 3. code-review-checklist
**ใช้กับ:** developer, security-engineer
**Output:** Structured code review พร้อม severity levels
**Covers:** Correctness, design, tests, security, performance, readability, docs, maintainability

---

### 4. test-case-template
**ใช้กับ:** qa-tester
**Output:** Test cases ครอบคลุม 10 categories
**Categories:** Functional, boundary, negative, equivalence, state, integration, concurrency, security, performance, accessibility

---

### 5. bug-report-template
**ใช้กับ:** qa-tester
**Output:** Bug report พร้อม severity + priority
**Includes:** Steps to reproduce, environment, evidence, workaround

---

### 6. commit-message-format
**ใช้กับ:** developer, technical-writer
**Output:** Conventional Commits format
**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

---

### 7. pr-description-template
**ใช้กับ:** developer
**Output:** PR description template
**Includes:** Summary, changes, test plan, screenshots, checklist, breaking changes

---

### 8. postmortem-template
**ใช้กับ:** devops-engineer, security-engineer
**Output:** Blameless postmortem
**Includes:** Timeline, root cause (5 Whys), action items with owners

---

### 9. seo-audit-checklist
**ใช้กับ:** seo-specialist
**Output:** SEO audit report พร้อม action plan
**Covers:** Technical SEO, on-page SEO, content, off-page SEO, analytics
**Includes:** Severity levels, prioritized findings, 3-month roadmap

---

### 10. polished-document-style
**ใช้กับ:** business-analyst, clinical-data-analyst, data-engineer, devops-engineer, fintech-compliance-officer, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer
**Output:** Rich markdown formatting conventions
**Includes:** Emoji vocabulary, callout boxes, table patterns, Mermaid diagram guide, cover blocks, sign-off sections

---

### 11. auth-implementation-patterns
**ใช้กับ:** developer, security-engineer
**Output:** Concrete auth implementation guidance
**Covers:** Session vs JWT, OAuth/OIDC, MFA (TOTP/WebAuthn), password storage (Argon2/bcrypt), account lockout, API auth, RBAC/ABAC, OWASP auth pitfalls

---

### 12. e2e-testing-patterns
**ใช้กับ:** developer, qa-tester
**Output:** E2E test design + framework guidance
**Covers:** Testing pyramid, Playwright/Cypress selection, Page Object Model, test data strategy, fighting flaky tests, parallelization, CI integration

---

### 13. architecture-patterns
**ใช้กับ:** clinical-data-analyst, data-engineer, quant-analyst, solution-architect
**Output:** Architecture pattern selection guidance
**Covers:** Monolith/microservices/serverless decision, sync vs async communication, CQRS, Event Sourcing, Saga, API Gateway, Strangler Fig migration, anti-patterns

---

### 14. incident-runbook-template
**ใช้กับ:** devops-engineer, security-engineer
**Output:** Operational runbook for on-call engineers
**Covers:** Detection, diagnosis (with Mermaid flowchart), mitigation steps (ordered by risk), escalation paths, post-incident actions, game days

---

### 15. work-session-context
**ใช้กับ:** business-analyst, developer, devops-engineer, graphic-designer, product-manager, project-manager, qa-tester, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Output:** `CONTEXT.md` ที่ root โปรเจกต์ (หัวข้อ "รับงานต่อ") · `.a-team/inbox/` คิวข้อความ · `.a-team/log/<วันที่>.jsonl` ที่ hook เขียน · `AGENTS.md` / `GEMINI.md` ป้ายชี้ไป `CONTEXT.md`
**Includes:** ขั้นเปิดใช้ในโปรเจกต์, แม่แบบ `CONTEXT.md` ไม่เกิน 150 บรรทัด (เขียนทับ ไม่ต่อท้าย), จุดส่งต่อก่อนสลับโมเดลทั้งค่ายเดียวกันและข้ามค่าย, รูปแบบข้อความ inbox (`from:` · `priority:`) และลำดับรับ, ฟิลด์ของ log และการตัดค่าลับ, `scripts/log-to-md.mjs` แปลง log เป็นตาราง, ย้ายจาก `.claude/context/` รูปแบบเก่า
**Use at:** เริ่มงาน (อ่าน "รับงานต่อ" + inbox) · จบงาน ก่อนสลับโมเดล ก่อนหยุด (อัปเดต "รับงานต่อ") — ใน A-Team หัวหน้าทีมเขียนคนเดียว

---

### 16. simplicity-first
**ใช้กับ:** business-analyst, developer, devops-engineer, graphic-designer, product-manager, project-manager, qa-tester, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Output:** N/A — this is a quality filter
**Core Test:** "Could a tired junior teammate understand this in 6 months, at 3 AM during an incident?" If no → simplify.
**Includes:** 5 universal principles, by-output-type guidance (code/docs/architecture/plans/designs), 3-question filter for new abstractions, common anti-patterns (resume-driven design, future-proofing, premature DRY, etc.), pre-submit checklist

---

### 17. branded-document-design
**ใช้กับ:** business-analyst, fintech-compliance-officer, graphic-designer, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, product-manager, project-manager, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer
**Output:** .docx / .pptx / .pdf ที่มีระบบสี ระบบขนาดตัวอักษร และช่องไฟสม่ำเสมอทั้งฉบับ
**Includes:** Design tokens (สกัดจาก Apps Track), typography scale, กฎ typography ภาษาไทย (กับดัก complex script), `scripts/brandkit.py` + `scripts/brandkit_pptx.py` ที่ทำหน้าปก/ตารางแบรนด์/KPI strip/callout/status pill/คำบรรยายรูป/footer ให้พร้อม, loop ตรวจงานด้วยการ render เป็นภาพแล้วดูจริง
**คู่กับ:** `polished-document-style` (คุมเนื้อหา markdown) — skill นี้คุมหน้าตาไฟล์ที่ render ออกมา

---

### 18. markdown-visuals
**ใช้กับ:** business-analyst, clinical-data-analyst, developer, devops-engineer, product-manager, project-manager, qa-tester, quant-analyst, reverse-engineer, revops-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Output:** เอกสาร markdown ที่มีภาพจริง ไม่ใช่คำบรรยาย
**Covers:** decision tree เลือกฟอร์แมต (inline SVG / ASCII / Mermaid / ไฟล์รูป), boilerplate SVG, wireframe + UI state, สถาปัตยกรรม

---

### 19. lazy-coding
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Output:** N/A — quality filter สำหรับโค้ด
**Core Test:** "จำเป็นต้องมีสิ่งนี้ไหม" (YAGNI) → stdlib ก่อน → native platform ก่อน → ค่อยเขียนเอง

---

### 20. targeted-fix
**ใช้กับ:** developer
**Output:** การแก้ที่เล็กที่สุดที่ตรงจุด
**Use when:** error message, stack trace, failing test, regression, "ไม่ใช่ที่ขอ"

---

### 21. windows-app-design
**ใช้กับ:** ux-designer
**Stack ที่รองรับ:** WinUI 3 / Windows App SDK · Avalonia 11 · .NET MAUI · Electron / Tauri / WebView2
**Output:** HTML mockup ก่อน แล้วค่อยเป็นโค้ด style จริง (`fluent.css` / `FluentTokens.xaml` / `FluentTokens.axaml`)
**Includes:** Fluent 2 design tokens ที่วัดจาก Windows 11 จริง (สี light/dark, type ramp, ระยะ, มุม, ขนาด NavigationView, breakpoints), ตารางเทียบ token ข้ามสแต็ก, กฎ typography ภาษาไทยบน Segoe UI Variable, `scripts/screenshot.py` สำหรับเรนเดอร์ตรวจทั้งโหมดมืด/สว่างและทุกความกว้างหน้าต่าง
**Anti-patterns ที่กันไว้:** ระบายพื้น accent ทั้งแถวเมนู, มุมโค้ง 12–16px, เงาใต้การ์ด, `alert()`, ทำเฉพาะโหมดมืด

---

### 22. web-app-design
**ใช้กับ:** ux-designer
**เฟรมเวิร์ก:** Angular · React · Vue · Svelte · HTML เปล่า (เป็น CSS ล้วน ไม่ผูกเฟรมเวิร์ก)
**Output:** HTML mockup ก่อน แล้วค่อยเป็นคอมโพเนนต์จริงที่ใช้คลาสเดิม
**Includes:** ระบบดีไซน์ Apps Track ครบชุด — 94 design tokens (แบรนด์/gradient/พื้นผิว/ตัวอักษร/สีกราฟ/pill 7 โทน/เลย์เอาต์), `assets/appstrack.css` พร้อมคอมโพเนนต์ครบ (app shell, card, KPI stat, table, form, chips, tabs, progress, avatar, markdown, toast, modal), ธีม accent สลับได้ 5 ชุด + sidebar สว่าง/เข้ม, `scripts/check-design-tokens.mjs` ที่ทำให้ CI แดงเมื่อมีใคร hardcode สี, `scripts/screenshot.py` สำหรับตรวจทุกความกว้าง
**Anti-patterns ที่กันไว้:** `#hex` ในคอมโพเนนต์, gradient บนกราฟ, ปุ่มหลักหลายปุ่มในหน้าเดียว, `overflow-x` ที่ body, `alert()`, `.modal` ที่ไม่ตั้ง position

---

### 23. mobile-app-design
**ใช้กับ:** ux-designer
**สแต็ก:** PWA · เว็บห่อเป็นแอป (Capacitor / Cordova / WebView) · React Native · Flutter
**Output:** HTML mockup ที่โชว์เป็นกรอบเครื่อง แล้วค่อยแปลงเป็นโค้ดจริง
**Includes:** ระบบดีไซน์ Speak Go — 53 tokens ตั้งชื่อตามหน้าที่ (`--repair` ไม่ใช่ `--red`), ระบบฟอนต์ **4 ตระกูล 4 หน้าที่** (UI chrome / ตัวเลขใหญ่ / เนื้อหาที่ต้องอ่านเป็น serif / ป้าย mono), `assets/speakgo.css` พร้อมคอมโพเนนต์ครบ (app shell + tabbar + overlay เต็มจอ, ไทล์ไล่สี, การ์ด, บทสนทนาพร้อมกล่องแก้ไข del/ins, แถบไมค์, หน้าสรุปผล, กลุ่มตั้งค่าแบบ iOS), ธีมเรียบ/ไล่สี, สลับฟอนต์ตามภาษาไทย-อังกฤษ, การจัดการ safe-area + `100dvh`
**Anti-patterns ที่กันไว้:** `100vh`, ลืม safe-area, แท็บล่างเกิน 5 อัน, modal เล็กสำหรับงานยาว, ยุบฟอนต์เหลือตระกูลเดียว, ไม่มี `:active` feedback

---

### 24. logging-standards
**ใช้กับ:** developer, devops-engineer
**สแต็ก:** .NET (Serilog) · Node/TS (winston) · Python (stdlib logging) · Angular
**Output:** logger ที่ให้บรรทัดรูปแบบเดียวกันทุกภาษา + ไฟล์ log ที่หมุนและมี retention
**Includes:** รูปแบบบรรทัดมาตรฐาน (เวลา+timezone / level / correlation id / source / ข้อความ / context k=v), เกณฑ์เลือกระดับ log, การส่งต่อ correlation id ข้าม service, โครงโฟลเดอร์ `logs/` + retention, รายการข้อมูลที่ห้ามลง log + ตัว redact อัตโนมัติ, การกัน log injection
**โค้ดที่รันทดสอบแล้ว:** `assets/logger.node.js` (winston) · `assets/logger_py.py` (stdlib)
**Anti-patterns ที่กันไว้:** `console.log` ในโค้ดจริง, catch เงียบ, log แล้ว throw ต่อ, ตัวแปรฝังในข้อความ, timestamp ไม่มี timezone, ไม่มี retention

---

### 25. testing-standards
**ใช้กับ:** developer, qa-tester
**สแต็ก:** xUnit · Vitest/Jest · pytest · Angular (Vitest หรือ Jasmine/Karma)
**พิเศษ:** **ขั้นแรกคือถามผู้ใช้ว่าจะใช้ framework ไหน** ไม่เลือกให้เอง (เว้นแต่โปรเจกต์มีอยู่แล้ว)
**Includes:** พีระมิดและสัดส่วนที่ยั่งยืน, เกณฑ์ว่าอะไรควร/ไม่ควรมี test, coverage ที่ซื่อสัตย์ (70–80% ของ business logic ไม่ใช่ 100%), การตั้งชื่อ `Method_Scenario_Expected`, โครง AAA, การทำให้ผลเหมือนเดิมทุกครั้ง (เวลา/สุ่ม/ลำดับ), integration test ด้วย DB จริง, การต่อ CI
**Anti-patterns ที่กันไว้:** เขียน test หลังจบงานเพื่อผ่าน gate, assert ว่า "ไม่ throw", test ที่พึ่ง test ก่อนหน้า, `sleep` รอ async, retry flaky จนเขียว, ไล่ coverage 100%

---

### 26. web-service-essentials
**ใช้กับ:** developer, devops-engineer, solution-architect
**สแต็ก:** ASP.NET Core · Node/Express · Python/FastAPI · Angular (ฝั่งเรียกใช้)
**Output:** endpoint พื้นฐาน 4 ตัว + รูปแบบ error ที่เหมือนกันทั้งระบบ
**Includes:** `/ping` `/health/live` `/health/ready` `/version` พร้อมรูปร่าง response ที่ตรงกันทุกภาษา, สามสถานะ up/degraded/down, timeout ของทุก check, error envelope ตาม RFC 9457, การส่งต่อ `X-Request-Id`, graceful shutdown, รายการที่ต้องมีก่อน deploy (timeout, ขนาด body, CORS, rate limit, security headers)
**โค้ดที่รันทดสอบแล้ว:** `assets/health.node.js` · `assets/health_py.py` (ทดสอบครบทั้งเคสปกติ/degraded/down/timeout)
**Anti-patterns ที่กันไว้:** liveness เช็ค DB (ทำให้ Kubernetes ฆ่า pod ยกแถว), `/health` ตัวเดียวเช็คทุกอย่าง, health ไม่มี timeout, ส่ง stack trace ออก endpoint สาธารณะ, `/ping` เขียนลง log

---

### 27. spell-out-abbreviations
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**กฎเดียว:** ตัวย่อทุกตัว เขียนเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — Model Context Protocol (MCP), Software Requirements Specification (SRS) — หลังจากนั้นใช้ตัวย่อได้
**ครอบคลุม:** เอกสาร, คอมเมนต์ในโค้ด, commit message, ข้อความบนหน้าจอ, ป้ายในไดอะแกรม, คำตอบในแชท
**ข้อยกเว้น:** ตัวย่อที่ไม่มีใครกางแล้ว (HTTP, URL, JSON, PDF, CPU) และตัวย่อที่นับ token/ความยาวเป็นข้อจำกัดจริง
**Anti-patterns ที่กันไว้:** ใช้ตัวย่อวงในทีมโดยไม่กาง, กางแล้วกางซ้ำทุกย่อหน้า, กางในหัวตารางจนล้น

---

### 28. ui-craft
**ใช้กับ:** graphic-designer, ux-designer
**ไม่กำหนดสีและฟอนต์** — คุมเฉพาะระยะ ขนาด ลำดับ และสถานะ
**Includes:** สเกลระยะห่าง `4 8 12 16 24 32 48 64`, สเกลตัวอักษร 5 ขั้นพร้อม line-height สำหรับไทย, ลำดับความเด่น 4 ระดับ (ปุ่มหลัก 1 ปุ่มต่อหน้า), เลือกระหว่างระยะห่าง/เส้น/พื้นหลัง/เงา, ตัวเลข contrast ที่ต้องผ่าน, **5 สถานะที่ทุกหน้าจอต้องมี** (ว่าง กำลังโหลด ผิดพลาด มีบางส่วน สำเร็จ), งบเวลา animation, ความหนาแน่น 3 แบบ
**Anti-patterns ที่กันไว้:** แก้ "ดูไม่สวย" ด้วยการเพิ่มสี, เส้นคั่นทุกอย่าง, เงาใต้ทุกการ์ด, สร้างขนาดตัวอักษรใหม่เรื่อย ๆ, สร้าง state ตอนเจอ bug, placeholder แทน label, สีอย่างเดียวบอกสถานะ

---

### 29. software-diagrams
**ใช้กับ:** graphic-designer
**ครอบคลุม:** C4 3 ระดับ · sequence · state · entity relationship · deployment
**Output:** ตารางบอกว่า**คำถามแบบไหนวาดแบบไหน** + ธีม Mermaid ชุดเดียวทั้งโปรเจกต์ + 3 classDef (focus/ext/store)
**โค้ดที่ทดสอบแล้ว:** `assets/mermaid-theme.md` — ตัวอย่างทั้ง 5 แบบ **เรนเดอร์เป็นภาพจริงแล้วเปิดดูด้วยตา** ด้วย mermaid-cli 11.17.0
**สิ่งที่ค้นพบระหว่างทดสอบ:** `fontFamily` ต้องอยู่**นอก** `themeVariables` ไม่งั้นถูกเมินเงียบ ๆ
**Anti-patterns ที่กันไว้:** ไดอะแกรม 40 กล่อง, เส้นไม่มีป้าย, ผสมระดับรายละเอียด, สีรุ้ง, ER ที่มีทุกตารางในระบบ, ส่งโดยไม่เคยเรนเดอร์

---

### 30. srs-writing
**ใช้กับ:** business-analyst, system-analyst
**อิงมาตรฐาน:** ISO/IEC/IEEE 29148
**Output:** โครง SRS 9 หัวข้อ + `assets/srs-outline.md` ที่กรอกต่อได้ทันที
**Includes:** กฎ 7 ข้อของการเขียนข้อกำหนดหนึ่งข้อ, ตารางแปลงคำคลุมเครือ ("ต้องเร็ว" → ตัวเลขจริง), ระบบรหัส `FR-/NFR-/BR-/IF-` เว้นทีละ 10, ตารางสอบย้อนกลับ, NFR 11 หมวดพร้อมคำถามที่ต้องถามลูกค้า, รายการรีวิวความครบถ้วน 4 กลุ่ม
**Anti-patterns ที่กันไว้:** คัดลอกบันทึกประชุมมาเป็นข้อกำหนด, "ระบบต้องใช้งานง่าย", ไม่มีหัวข้อ "ไม่อยู่ในขอบเขต", ทุกข้อเป็น "ต้องมี", ตัวเลขที่คนเขียนคิดเอง, ใช้รหัสซ้ำกับข้อที่ยกเลิก

---

### 31. presentation-design
**ใช้กับ:** graphic-designer
**Output:** โครงเรื่อง + เลย์เอาต์ ส่วนไฟล์ `.pptx` ส่งต่อให้ `branded-document-design`
**Includes:** ลำดับเรื่อง 5 แบบตามจุดประสงค์ (ขออนุมัติ/รายงาน/รีวิว/อบรม/ขายงาน), หัวสไลด์เป็นข้อสรุปไม่ใช่ชื่อหัวข้อ, งบตัวอักษร ≤ 5 บูลเล็ต ≤ 12 คำ ~50 คำต่อแผ่น, ตารางแปลง px → pt, พื้นต่ำสุด 18 pt, กฎสไลด์ข้อมูล, ภาษาไทยบนสไลด์
**ที่ทดสอบแล้ว:** `assets/slide-mockup.html` — 6 เลย์เอาต์ **เรนเดอร์ที่ 1280×720 แล้วเปิดดูทุกแผ่น** (แก้ไปแล้ว 4 จุดที่การเรนเดอร์เผยให้เห็น)
**Anti-patterns ที่กันไว้:** หัวสไลด์เป็นชื่อหัวข้อ, สไลด์เป็นเอกสาร, ลดขนาดตัวอักษรให้เนื้อหาพอดี, แอนิเมชันทีละบูลเล็ต, ตาราง 15 แถวบนสไลด์, ไม่มีเลขหน้า

---

### 32. graphic-design
**ใช้กับ:** graphic-designer
**ครอบคลุม:** โลโก้ · ระบบสีและตัวอักษรของแบรนด์ · โปสเตอร์ · ใบปลิว · โพสต์โซเชียล · LINE OA rich menu · ฉลากสินค้า · นามบัตร
**Includes:** สี่แกนการตัดสินใจ, ทดสอบโลโก้ 7 บริบท (favicon/ปัก/ขาวดำ/กลับสี/ป้าย/โปรไฟล์), กฎภาษาไทยบนงานกราฟิก, ตารางขนาดงานโซเชียลและงานพิมพ์พร้อมตัดตก, `assets/brand-direction.md` ที่กรอกต่อได้
**Anti-patterns ที่กันไว้:** โลโก้ที่อ่านไม่ออกตอนย่อ, ไล่สีในมาร์ก, ฟอนต์ไทยที่ไม่มีน้ำหนักให้ใช้, งานพิมพ์ที่ลืมตัดตก

---

### 33. svg-diagram-system
**ใช้กับ:** solution-architect, system-analyst, ux-designer
**เลือกตัวไหน:**
**svg-diagram-system** — วางกริดก่อนวาด, สีมาจากค่าเดียว (`ACCENT`) แล้วไล่เฉดอัตโนมัติ, ตารางสีตามประเภทเนื้องาน
**diagram-figures** — HTML + Playwright ถ่ายที่ 2 เท่า, เส้นคำนวณหลังเลย์เอาต์จริง, ไอคอนผู้ให้บริการ 205 ไฟล์
**Anti-patterns ที่กันไว้:** ผังเกินเจ็ดกล่องโดยไม่แยกรูป, เส้นไม่มีป้าย, ป้ายบังเส้น, ส่งโดยไม่เคยเปิดดูภาพที่เรนเดอร์ออกมา

---

### 34. spec-to-code-loop
**ใช้กับ:** developer
**Output:** prompt สำหรับ agent loop ที่หยุดเองได้ + ไฟล์สถานะที่รอดจากการสูญเสียบริบท
**Includes:** เงื่อนไขหยุดที่เครื่องตรวจได้, หนึ่งข้อกำหนดต่อหนึ่งรอบ, test ต้องแดงก่อน, ใส่รหัส FR/TC ในชื่อ test, เพดาน retry 3 ครั้ง, กฎห้ามแก้ test ให้ผ่าน, การแบ่งงานให้ agent ขนานเฉพาะไฟล์ที่ไม่ทับกัน, โฟลเดอร์ `_to_delete/` สำหรับไฟล์แปลงและ log
**Anti-patterns ที่กันไว้:** loop ที่ไม่มีเงื่อนไขหยุด, แก้ test แทนแก้โค้ด, agent ขนานที่แก้ไฟล์เดียวกัน, ไฟล์ชั่วคราวปนกับเอกสารหลัก

---

### 35. prior-art-review
**ใช้กับ:** product-manager, solution-architect
**Output:** การตัดสินใจหนึ่งในสี่ — adopt / fork / build เอง / drop
**Includes:** ตารางเทียบหกคอลัมน์บังคับ, ตารางสัญญาณสุขภาพโครงการ (commit ล่าสุด, issue ค้าง, ผู้ดูแล), ตารางสัญญาอนุญาต, เกณฑ์ที่ตัดสินผลจริงแทนรายการความสามารถ, รูปแบบสำหรับงานวิชาการที่ผลลัพธ์คือช่องว่างงานวิจัย
**Anti-patterns ที่กันไว้:** จบที่รายงานแทนที่จะจบที่การตัดสินใจ, เทียบด้วยรายการฟีเจอร์, เจอเรื่องสัญญาอนุญาตตอนใกล้ส่งงาน

---

### 36. answer-shape
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**กฎเดียว:** เลือกรูปแบบก่อนพิมพ์ — เปรียบเทียบคือตาราง · ลำดับหรือความสัมพันธ์คือ diagram · ที่เหลือคือร้อยแก้วสั้น ๆ
**Includes:** ตารางเลือกรูปแบบตามชนิดคำถาม, กฎการทำตาราง (หัวคอลัมน์ต้องเป็นเกณฑ์ ไม่ใช่ชื่อของ), เกณฑ์ว่าเมื่อไหร่ diagram ช่วยจริง
**ตัดกลิ่น AI:** อ่านทวนก่อนส่งทุกคำตอบและเอกสาร — ตารางสิ่งที่เจอบ่อย (เปิดด้วย "แน่นอน" · ทวนคำถาม ฯลฯ) พร้อมสิ่งที่ต้องแก้เป็น (รวมมาจาก pstack)
**Anti-patterns ที่กันไว้:** ตารางสองแถวที่เป็นการตกแต่ง ไม่ใช่การอธิบาย, บูลเล็ตซ้อนสามชั้น, เกริ่นก่อนตอบ

---

### 37. temp-file-discipline
**ใช้กับ:** business-analyst, developer, devops-engineer, graphic-designer, product-manager, project-manager, qa-tester, reverse-engineer, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**กฎเดียว:** อะไรที่ไม่ใช่ผลงานจริง ต้องอยู่ใน `_to_delete/` ที่รากโปรเจกต์
**Includes:** นิยามว่าอะไรคือไฟล์ชั่วคราว (ไฟล์ที่แปลงแล้ว, ภาพที่เรนเดอร์ตรวจ, log, สคริปต์ใช้ครั้งเดียว, ไฟล์บีบอัดที่ใช้ส่งข้ามเครื่อง), อะไรห้ามอยู่ในนั้น, สภาพที่ต้องทิ้งไว้เมื่อจบงาน, กฎว่าไฟล์ชั่วคราวไม่ถูกลบโดยไม่ถาม
**Anti-patterns ที่กันไว้:** ไฟล์บีบอัดค้างที่รากโปรเจกต์, โฟลเดอร์ `extracted/` ปนกับเอกสารจริง, ลบไฟล์ของผู้ใช้เอง

---

### 38. database-design
**ใช้กับ:** data-engineer, developer, solution-architect, system-analyst
**ฐานข้อมูล:** PostgreSQL · SQL Server · MySQL · MongoDB · EF Core / Prisma / Alembic
**Includes:** เกณฑ์เลือก relational กับ document, กฎตั้งชื่อชุดเดียว, คอลัมน์ที่ทุกตารางต้องมี, เปรียบเทียบชนิด id (กับดัก UUIDv4 ทำ index แตก), สี่ชนิดข้อมูลที่พลาดประจำ (เงิน/เวลา/enum/boolean), กฎวาง index และลำดับคอลัมน์ใน composite index, constraint ที่ต้องอยู่ที่ฐานข้อมูล, **migration แบบ expand/contract สามรอบ deploy**, สามแบบของระบบหลายผู้เช่า, ข้อมูลส่วนบุคคลตาม PDPA
**Anti-patterns ที่กันไว้:** `varchar(255)` ทุกคอลัมน์, float กับเงิน, เก็บหลายค่าในคอลัมน์เดียว, ไม่มี foreign key, index ทุกคอลัมน์, migration ที่ปนการเขียนข้อมูลกับการเปลี่ยนโครงสร้าง, แก้ schema บน production ด้วยมือ

---

### 39. api-conventions
**ใช้กับ:** developer, qa-tester, solution-architect, system-analyst
**Output:** `API-CONVENTIONS.md` ที่รากโปรเจกต์ (แม่แบบพร้อมกรอกใน `assets/`)
**Includes:** กฎตั้งชื่อ URL, การระบุเวอร์ชันและ **ตารางว่าอะไรคือ breaking change**, pagination แบบ cursor พร้อมรูปร่าง response, การกรอง/เรียง/เลือกฟิลด์, รูปแบบวันเวลา เงิน identifier และ null, error ระดับฟิลด์, idempotency key, ETag + If-Match, header ของ rate limit, ขั้นตอนเลิกใช้ endpoint ด้วย Deprecation/Sunset
**Anti-patterns ที่กันไว้:** `200 OK` พร้อม `{"success": false}`, กริยาใน URL, รายการที่ไม่มี pagination, id เป็นตัวเลขใน JSON (โดนปัดเศษใน JavaScript), ส่ง entity ของฐานข้อมูลออกตรง ๆ

---

### 40. cicd-and-release
**ใช้กับ:** devops-engineer, solution-architect
**แพลตฟอร์ม:** GitHub Actions · Azure DevOps · GitLab CI (ไฟล์ตั้งต้นที่ใช้ได้จริงทั้งสามตัว)
**กฎหลัก:** build ครั้งเดียว แล้วเอา artifact ตัวเดิมไปทุก environment
**Includes:** ตารางขั้นใน pipeline พร้อมเวลาที่ยอมรับได้, SemVer ที่ไล่กลับไปหา commit ได้, เทียบ branch strategy สามแบบ, ตาราง environment และด่านอนุมัติ, ตำแหน่งที่ migration ควรรัน, เทียบวิธีปล่อยของสี่แบบ (rolling/blue-green/canary), feature flag ที่ต้องมีวันหมดอายุ, rollback ที่ต้องซ้อมจริง, Dockerfile หลายขั้น
**Anti-patterns ที่กันไว้:** build ใหม่ตอนขึ้น production, deploy ด้วยมือตามขั้นตอนใน Word, migration รันตอนแอปบูต, test ที่ตกแล้วปล่อยผ่าน, pipeline 45 นาที

---

### 41. config-and-secrets
**ใช้กับ:** developer, devops-engineer, security-engineer
**สแต็ก:** .NET (user-secrets + Key Vault) · Node (zod) · Python (pydantic-settings) · Angular · Docker · Kubernetes
**กฎสองข้อ:** โค้ดชุดเดียวรันได้ทุก environment · secret ไม่เคยอยู่ใน git ใน log หรือในไฟล์ที่เบราว์เซอร์โหลด
**Includes:** ตารางแยก config กับ secret, ลำดับความสำคัญของแหล่งค่า, **การตรวจตอนบูตให้ตายทันทีเมื่อค่าไม่ครบ**, กฎตั้งชื่อตัวแปรสภาพแวดล้อม, `.env.example` ที่ต้องอัปเดตพร้อมคอมมิต, ตารางเลือกที่เก็บ secret ตามขนาดทีม, การหมุนเวียนที่ต้องใช้สองค่าพร้อมกันได้, **ลำดับขั้นตอนเมื่อ secret หลุด (เพิกถอนก่อน ไม่ใช่ลบ commit ก่อน)**, ทางรั่วเจ็ดทาง, ทำไม frontend ไม่มีอะไรลับ
**Anti-patterns ที่กันไว้:** connection string ในโค้ด, `.env` ของ production บนเซิร์ฟเวอร์, secret เดียวกันทุก environment, ส่ง secret ทางแชต, บูตผ่านทั้งที่ config ไม่ครบ, `ALLOWED_ORIGINS=*`

---

### 42. fsd-writing
**ใช้กับ:** business-analyst, developer, qa-tester, system-analyst
**อยู่ระดับไหน:** ต่ำกว่า `srs-writing` หนึ่งขั้น — SRS ตอบว่า "ต้องทำอะไรได้" · FSD ตอบว่า "ทำอย่างไร"
**Output:** โครง FSD 11 หัวข้อ + `assets/fsd-outline.md` ที่กรอกต่อได้ทันที
**Includes:** ตารางเส้นแบ่ง SRS กับ FSD, รูปแบบ use case เดียวทั้งเอกสาร (ขั้นตอนหลัก + ทางเลือกอื่น + กรณีผิดพลาด), ข้อกำหนดหน้าจอที่บังคับ 6 อย่างรวม **ข้อความ error ตามคำจริง**, ตารางการเปลี่ยนสถานะที่มีบรรทัด "ทำไม่ได้", กฎทางธุรกิจแยกเป็นรหัสใช้ซ้ำได้, ตารางกรณีขอบ 11 แถว, การสอบย้อนกลับ FR → UC → SC → TC, รายการรีวิวก่อนส่ง 3 กลุ่ม
**Anti-patterns ที่กันไว้:** คัดลอก SRS มาเติมคำว่า "ระบบจะ", use case ที่มีแต่ทางราบรื่น, "แสดงข้อความแจ้งเตือน" โดยไม่บอกข้อความ, "คำนวณโดยอัตโนมัติ" โดยไม่บอกสูตรและการปัดเศษ, คุมสิทธิ์ด้วยการซ่อนปุ่ม, เอา wireframe มาแทนข้อกำหนด

---

### 43. flag-and-propose
**ใช้กับ:** business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, fintech-compliance-officer, graphic-designer, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**กฎเดียว:** เปิดด้วย**ผลกระทบ** ปิดด้วย**คำถามเดียว** — ตรงกลางคือหลักฐานกับข้อเสนอ
**โครง 4 บล็อก:** สิ่งที่เจอ + ผลถ้าไม่แก้ (1–2 บรรทัด) · ตารางเทียบ "ที่บันทึกไว้ / ของจริง" · ตารางข้อเสนอ "ทำอะไร → ได้อะไร" · คำถามปิดหนึ่งข้อ
**Includes:** สูตรประโยคเปิดที่ลงท้ายด้วยผลเสียเป็นรูปธรรม, กฎว่าตัวเลขที่ขัดกันต้องเป็นตารางเสมอ, การตัดคำถามเดิมที่ตกไปในหนึ่งบรรทัด, การบอกสิ่งที่**ไม่**ทำพร้อมเหตุผล, กฎของคำถามปิด (หนึ่งข้อ · ตอบได้ด้วยไม่กี่คำ · มีตัวเลือก "เอาทั้งหมด"), ตัวอย่างเต็มก่อน/หลัง
**ต่างจาก `answer-shape`:** `answer-shape` เลือกรูปแบบของคำตอบ · ตัวนี้เป็นโครงของการ**แจ้งแล้วขอการตัดสินใจ**
**Anti-patterns ที่กันไว้:** เปิดด้วย "ระหว่างตรวจผมพบว่า…", ตัวเลขขัดกันเขียนเป็นประโยค, ข้อเสนอที่บอกวิธีทำแทนประโยชน์, ถามสามคำถามในย่อหน้าเดียว, ปิดด้วย "แจ้งได้เลยครับ", รายงานอย่างเดียวโดยไม่เสนอ

---

### 44. document-naming
**ใช้กับ:** business-analyst, product-manager, project-manager, system-analyst, technical-writer
**Output:** กฎว่าเอกสารไหนเป็น docx ไหนเป็น markdown + รูปแบบชื่อไฟล์ต่อประเภท + `assets/naming-cheatsheet.md`
**Includes:** เกณฑ์เลือกรูปแบบ (มีคนเซ็นหรือส่งนอกทีม → docx), กฎว่าไฟล์ใน git ห้ามมีเวอร์ชันในชื่อ, รูปแบบ `<โปรเจกต์>-<ประเภท>-v<M.m>-<สถานะ>.docx`, สถานะ 3 ค่า DRAFT/REVIEW/APPROVED, กฎว่า APPROVED แล้วห้ามแก้ไฟล์เดิม, ตารางประวัติการแก้ไขที่ต้องอยู่ในไฟล์, รหัสประเภทเอกสาร 11 ตัว
**Anti-patterns ที่กันไว้:** `final.docx` `final2.docx` `แก้แล้ว.docx`, ใส่เวอร์ชันในชื่อไฟล์ที่อยู่ใน git, แก้ใน Word โดยไม่แก้ markdown ต้นฉบับ, วันที่แบบ `25-09-2026`

---

### 45. error-handling-patterns
**ใช้กับ:** developer, qa-tester, security-engineer, solution-architect
**กฎเดียว:** จับ error เฉพาะตอนที่ทำอะไรกับมันได้จริง
**Includes:** จับที่ชั้นไหนปล่อยที่ชั้นไหน, **ข้อความถึงผู้ใช้ ≠ ข้อความใน log** พร้อมรหัสอ้างอิงเชื่อมสองฝั่ง, ตารางแยกประเภทความล้มเหลว 5 แบบว่าอันไหน retry ได้, ตัวเลข timeout ต่อชนิดการเรียก, สูตร retry แบบทวีคูณ+สุ่ม, circuit breaker, การล้มบางส่วน, งานทำความสะอาดที่ต้องรันเสมอ
**Anti-patterns ที่กันไว้:** catch ว่างเปล่า, คืน null แทนโยน error, log แล้ว throw ต่อทุกชั้น, "เกิดข้อผิดพลาด", retry แบบไม่หน่วง, ไม่มี timeout

---

### 46. audit-trail
**ใช้กับ:** developer, fintech-compliance-officer, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, security-engineer, solution-architect, system-analyst
**กฎเดียว:** ร่องรอยย้อนหลังสร้างไม่ได้
**Includes:** ตารางเทียบ audit log กับ application log 6 มิติ, 11 ฟิลด์ที่ทุกรายการต้องมี, **กฎว่าต้องบันทึกครั้งที่ถูกปฏิเสธด้วย**, รายการเหตุการณ์ที่ควรและไม่ควรเก็บ, การเก็บ from/to เฉพาะฟิลด์ที่เปลี่ยน, append-only และสิทธิ์ที่ฐานข้อมูล, ข้อมูลที่ห้ามคัดลอกลง audit, หน้าจอที่คนอ่านรู้เรื่อง
**Anti-patterns ที่กันไว้:** เก็บ audit ในไฟล์ log ทั่วไป, เก็บชื่อแทน id, บันทึกเฉพาะที่สำเร็จ, แอปมีสิทธิ์ UPDATE ตาราง audit, บันทึกทุกการคลิก

---

### 47. project-bootstrap
**ใช้กับ:** developer, devops-engineer
**เป้าหมายที่วัดได้:** คนที่ไม่เคยเห็นโปรเจกต์ ต้องรันได้ใน **30 นาที** โดยอ่านแค่ README
**Includes:** โครงโฟลเดอร์มาตรฐาน, README ที่ตอบ 5 คำถาม, `docs/README.md` เป็นสารบัญพร้อมเจ้าของ, CHANGELOG, `.editorconfig` + `.gitattributes` (**`eol=lf` ที่กัน diff ทั้งไฟล์**), นโยบาย dependency และ lock file, รายการตรวจ 9 ข้อ, `assets/starter-files.md` ที่คัดลอกไปใช้ได้ทั้งชุด
**Anti-patterns ที่กันไว้:** README ที่มีแต่ชื่อโปรเจกต์, คำสั่งติดตั้งที่ไม่เคยรันบนเครื่องเปล่า, "ขอ .env จากพี่คนนั้น", ไม่ commit lock file, ไฟล์ทดลองที่รากโปรเจกต์

---

### 48. i18n-and-locale
**ใช้กับ:** developer, system-analyst, ux-designer
**กฎเดียว:** เก็บเป็นค่ากลาง แปลงตอนแสดงผล — เวลา UTC · ปี ค.ศ. · เงินเป็นตัวเลข+รหัสสกุล
**Includes:** คีย์แปลตั้งตามที่อยู่ไม่ใช่ตามเนื้อความ, กฎห้ามต่อประโยคจากชิ้นส่วน, **พ.ศ. แปลงตอนแสดงเท่านั้น** + กับดักปีสองหลักและ Excel, collation ภาษาไทยที่การเรียงมาตรฐานทำผิด, **ภาษาไทยไม่มีเว้นวรรคจึงกระทบการค้นหา ตัดบรรทัด และตัดข้อความ**, เงินและเบอร์โทร, ที่ว่างบนหน้าจอที่ต้องเผื่อ
**Anti-patterns ที่กันไว้:** เก็บ พ.ศ. ลงฐานข้อมูล, บวก 7 ชั่วโมงเองในโค้ด, ทดสอบหน้าจอด้วย Lorem ipsum, `if (count > 1) "s"`, นำเข้า Excel โดยไม่ถามว่าปีแบบไหน

---

### 49. observability-basics
**ใช้กับ:** data-engineer, developer, devops-engineer, recommendation-engineer, solution-architect
**กฎเดียว:** ถ้าลูกค้าเป็นคนบอกเราว่าระบบล่ม แปลว่าการเฝ้าระวังล้มเหลว
**Includes:** ตารางว่า metric/log/trace ตอบคนละคำถามยังไง, สี่สัญญาณที่ต้องวัด, **ห้ามดูค่าเฉลี่ยของเวลาตอบสนอง ให้ดู p95/p99**, กฎตั้งชื่อตัวชี้วัดและ label ที่ห้ามมีค่าไม่จำกัด, ตารางเทียบการแจ้งเตือนที่ผิดกับที่ถูก, สามระดับการแจ้งเตือน, แดชบอร์ดสองหน้าพร้อมเส้นบอกเวลา deploy, ตัวชี้วัดทางธุรกิจ
**Anti-patterns ที่กันไว้:** เตือนจาก CPU, แจ้งเตือนที่ไม่ต้องทำอะไร, ใส่ id เป็น label, แดชบอร์ด 40 กราฟ, วัดแต่เทคนิคไม่วัดธุรกิจ

---

### 50. background-jobs
**ใช้กับ:** data-engineer, developer, devops-engineer, solution-architect
**กฎเดียว:** งานเบื้องหลังทุกตัวต้องรันซ้ำได้โดยไม่เกิดผลซ้ำ เพราะมันจะถูกรันซ้ำแน่นอน
**Includes:** เกณฑ์ว่าอะไรควรไปเบื้องหลัง, เทียบกลไก 4 แบบ (ตารางใน DB · คิวจริง · cron ในแอป · ตัวตั้งเวลาของแพลตฟอร์ม), สี่วิธีกันผลซ้ำ, retry ที่มีเพดานและ dead letter ที่ต้องมีคนดู, การปลดล็อกงานที่ค้างเพราะ worker ตาย, **งานตามเวลาบนหลาย instance ที่รันซ้อนกัน**, งานยาวที่ต้องบอกความคืบหน้าและยกเลิกได้, ตัวชี้วัด 6 ตัว
**Anti-patterns ที่กันไว้:** retry ไม่จำกัด, ไม่มี dead letter, มี dead letter แต่ไม่มีใครดู, ส่งข้อมูลทั้งก้อนใน payload, หน้าจอหมุนเปล่าจนผู้ใช้กดซ้ำ

---

### 51. file-upload-and-storage
**ใช้กับ:** developer, security-engineer
**กฎเดียว:** ชื่อไฟล์ นามสกุล ชนิด และขนาดที่ผู้ใช้ส่งมา ปลอมได้ทั้งหมด
**Includes:** ตรวจชนิดจาก magic bytes, รายการที่อนุญาตไม่ใช่รายการที่ห้าม, **SVG คือ HTML ที่รันสคริปต์ได้**, เทียบที่เก็บ 3 แบบ, ชื่อไฟล์สุ่มแยกโฟลเดอร์ตามวันที่, **"ลิงก์เดายาก" ไม่ใช่การควบคุมสิทธิ์** — ใช้ signed URL ที่หมดอายุ, การย่อรูปและลบ EXIF, ลำดับการลบที่ไม่ทิ้ง metadata กำพร้า
**Anti-patterns ที่กันไว้:** เชื่อนามสกุลไฟล์, ตรวจขนาดแค่ฝั่งเบราว์เซอร์, เก็บไฟล์ในโฟลเดอร์ที่เว็บเสิร์ฟ, ส่งรูปต้นฉบับ 8 MB ลงมือถือ, ไม่ลบ EXIF

---

### 52. notifications
**ใช้กับ:** developer, system-analyst
**กฎเดียว:** ผู้ใช้จะเลิกอ่านทั้งหมด ถ้าได้รับสิ่งที่ไม่ต้องอ่านมากพอ
**Includes:** เลือกช่องทางตามความเร่งด่วน (**SMS ภาษาไทยได้ 70 ตัวอักษร ไม่ใช่ 160**), แม่แบบข้อความนอกโค้ด, ส่งเป็นงานเบื้องหลังหลัง commit เท่านั้น, การกันส่งซ้ำและกันถล่ม, รายการที่ห้ามใส่ในตัวข้อความ, ตารางประเภทที่ปิดได้/ปิดไม่ได้ + การยกเลิกรับ, การติดตามผลส่งและ hard bounce ที่ต้องหยุดส่งทันที, SPF/DKIM/DMARC
**Anti-patterns ที่กันไว้:** ส่งก่อน commit, ไม่กันซ้ำจนลูกค้าได้ใบเสร็จห้าฉบับ, ไม่มีลิงก์ยกเลิกรับ, ส่งต่อไปยัง hard bounce

---

### 53. data-import-export
**ใช้กับ:** business-analyst, data-engineer, developer, qa-tester
**กฎเดียว:** ตรวจให้จบก่อน แล้วค่อยเขียน
**Includes:** แม่แบบให้ดาวน์โหลดพร้อมแถวตัวอย่าง, ตรวจสามชั้น (ไฟล์ · รายแถว · ความสัมพันธ์) พร้อมข้อความที่ระบุแถวและคอลัมน์, หน้าตัวอย่างก่อนยืนยัน, **ตารางกับดัก Excel 8 ข้อ** — ภาษาไทยเพี้ยน, ศูนย์นำหน้าหาย, เลขยกกำลัง, ปี พ.ศ. ปนกัน, **CSV injection ที่ทำให้ Excel รันคำสั่ง**, กฎการส่งออกที่ห้ามเกินสิทธิ์
**Anti-patterns ที่กันไว้:** "ไฟล์ไม่ถูกต้อง", หยุดที่แถวแรกที่ผิด, เขียนไปตรวจไป, อ่านคอลัมน์ตามตำแหน่ง, ส่งออกโดยไม่ escape สูตร

---

### 54. pdpa-compliance
**ใช้กับ:** business-analyst, clinical-data-analyst, fintech-compliance-officer, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, security-engineer, solution-architect, system-analyst
**กฎเดียว:** ข้อมูลที่ไม่ได้เก็บ คือข้อมูลที่ไม่รั่ว ไม่ต้องดูแล และไม่ต้องลบ
**หมายเหตุ:** เป็นแนวทางสำหรับคนทำระบบ ไม่ใช่คำแนะนำทางกฎหมาย
**Includes:** ตารางรายการข้อมูล 7 คอลัมน์, **ฐานทางกฎหมาย 4 แบบ และเหตุผลว่าทำไมความยินยอมเป็นฐานที่อ่อนที่สุด**, ตารางความยินยอมที่เก็บเป็นประวัติไม่ใช่เขียนทับ, สิทธิเจ้าของข้อมูล 6 ข้อที่ระบบต้องทำได้จริง, การเก็บเท่าที่จำเป็นและข้อมูลอ่อนไหว, อายุการเก็บที่ต้องมีงานลบจริง, ผู้ประมวลผลและการส่งออกนอกประเทศ, **ลำดับ 7 ขั้นใน 72 ชั่วโมงแรกเมื่อข้อมูลรั่ว**
**Anti-patterns ที่กันไว้:** ขอความยินยอมสำหรับทุกอย่าง, ช่องติ๊กที่ติ๊กมาให้, `accepted_terms = true`, soft delete แล้วบอกว่าลบแล้ว, ใช้ข้อมูลจริงบน staging, ไม่มีรายการผู้ให้บริการภายนอก

---

### 55. context-budget
**ใช้กับ:** business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, fintech-compliance-officer, graphic-designer, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**กฎเดียว:** ตัดสินใจ**ก่อน**อ่าน — token ที่เข้า context แล้วเอาออกไม่ได้
**Includes:** ตารางว่าอะไรกิน context จริง ๆ (output ของ tool ใหญ่กว่า description ของ skill ทั้งชุด), ต้นไม้ตัดสินใจก่อนอ่าน, การอ่านเฉพาะช่วงและเกณฑ์ 300 บรรทัด, `rg` ที่มี `--glob` และ `head` เสมอ, **การส่ง subagent พร้อมกำหนดรูปร่างผลลัพธ์**, การเขียนผลกลางลงไฟล์, **ทำไมไฟล์แผนที่ต้องชื่อ `CLAUDE.md` ไม่ใช่ `context.md`**, ค่าตั้งที่ช่วยได้อีก (ปิด MCP server ที่ไม่ใช้, `permissions.deny`)
**คู่กับ:** `scripts/CLAUDE.global.md` ในมาร์เก็ตเพลส — กฎ 5 ข้อที่ต้องอยู่ใน context ตลอดเวลา
**Anti-patterns ที่กันไว้:** `cat` ไฟล์ใหญ่เพื่อดูว่ามีอะไร, `rg` ไม่ใส่ `--glob`, อ่านสิบไฟล์เองแทนส่ง subagent, สั่ง subagent แบบไม่บอกว่าจะเอาอะไรกลับมา, `context.md` ที่ไม่โหลดอัตโนมัติ, `CLAUDE.md` ยาว 300 บรรทัด

---

### 56. product-naming
**ใช้กับ:** graphic-designer, product-manager, technical-writer
**กฎเดียว:** ชื่อที่ดีคือชื่อที่คนพิมพ์ถูกตั้งแต่ครั้งแรก หลังได้ยินครั้งเดียว
**Includes:** หกข้อที่ตัดชื่อทิ้งทันที (นำด้วย **ทดสอบโทรศัพท์**), **เก้าสูตรผลิตชื่อ**พร้อมตัวอย่างจริง — คำจริงตัดท้าย, สองคำชนกัน, คำ+ปัจจัย, รากละติน/กรีก, ตัวอักษรตระกูล, คำสั้นไร้ความหมาย, คำจริงยืมข้ามบริบท, สองพยางค์อ่านลื่น, คำเต็มสองคำที่ไม่เกี่ยวกันแบบ Tailscale · ตัวอักษรที่ให้ความรู้สึกทันสมัยกับที่ทำให้ดูเชย · **การใส่ความหมายให้ชื่อที่ไม่ได้เกิดมาพร้อมความหมาย** พร้อมคลังรากละติน/กรีก 19 ราก และคลังคำจริงยืมข้ามบริบทแยกตามความรู้สึก 7 กลุ่ม · สามแบบของตระกูลชื่อเมื่อมีหลายผลิตภัณฑ์ · ตารางตรวจของว่าง 7 ช่องทางที่ต้องทำตอนเหลือ 5 ชื่อ ไม่ใช่ตอนเหลือชื่อเดียว · เสียงและการพิมพ์ในบริบทไทย · ห้าข้อทดสอบสุดท้าย
**Output:** `assets/name-shortlist.md` — ตารางคัดชื่อ 5 ขั้นที่กรอกต่อได้ทันที
**Anti-patterns ที่กันไว้:** สะกดแปลกเพื่อให้ได้โดเมน, ต่อท้าย `-soft` `-tech` `-sys`, ใส่ตัวเลขในชื่อ, ชื่อที่บอกความสามารถเฉพาะแล้วพังวันที่ขอบเขตโต, เลือกชื่อก่อนตรวจเครื่องหมายการค้า

---

### 57. project-doc-set
**ใช้กับ:** project-manager, solution-architect, technical-writer
**กฎเดียว:** เอกสารทุกชิ้นต้องตอบได้ว่าใครอ่าน และอ่านแล้วตัดสินใจอะไร — ตอบไม่ได้ก็ไม่ต้องเขียน
**Includes:** **ตารางตัดสินว่าเอกสารอยู่ใน repo (แบบ A) หรืออยู่นอก repo (แบบ B)** พร้อมโครงโฟลเดอร์ของแบบ B และตารางว่าโฟลเดอร์ไหนเป็นทางเลือก (`figures/` · `decisions/` · `qa/`) พร้อมคำตอบว่าถ้าไม่มีแล้วของไปอยู่ไหน, **ชุดเอกสารแยกสองกลุ่ม** — กลุ่มส่งมอบ 9 ชิ้นเลือกตามขนาดงาน S/M/L และ**กลุ่มเชิงเทคนิค 9 ชิ้นที่เลือกตามเงื่อนไขไม่ใช่ตามขนาด** (README · BUILD-PLAN · AGENT-LOOP · API-SPEC · DATA-DICTIONARY · EVALUATION-POLICY · PROMPT-LIBRARY · ADR · Runbook), สายลำดับการเขียนแยกสายส่งมอบกับสายเทคนิค, ตารางว่า agent ไหนเขียนชิ้นไหนด้วย skill อะไร 16 แถว, เกณฑ์เลือกว่ารูปนี้ใช้ Mermaid หรือ `diagram-figures`, การประกาศ `doc-theme` ครั้งเดียวต่อโปรเจกต์, รายการตรวจ 9 ข้อก่อนส่งมอบ
**Output:** `assets/doc-set-checklist.md` — ใบตรวจชุดเอกสารที่กรอกส่งได้ทันที
**Anti-patterns ที่กันไว้:** เขียน BRD ให้งานสองสัปดาห์, `.docx` ที่ไม่มี Heading style สักอันจน navigation pane ว่าง, เก็บแต่ PNG ไม่เก็บไฟล์ต้นทางของรูป, เก็บ .docx และ mockup ไว้ใน repo โค้ด, เอกสารอยู่สองที่พร้อมกัน, เขียน FSD ก่อน SRS ได้รับการยืนยัน, mockup ที่ปุ่มกดไม่ได้, ใช้ LLM แต่ไม่มี PROMPT-LIBRARY, สร้างโฟลเดอร์ทางเลือกทิ้งไว้ว่าง ๆ

---

### 58. readable-code
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**กฎเดียว:** ชื่อที่ต้องเปิดดูข้างในถึงจะเข้าใจ คือชื่อที่ตั้งผิด
**Includes:** ตารางชื่อแย่→ดี 10 คู่พร้อมเหตุผล, **กฎว่าเลขที่มีหน่วยต้องมีหน่วยในชื่อเสมอ** (`timeoutMs` · `priceSatang`), **ตารางคำนำหน้าฟังก์ชัน 10 คำที่แต่ละคำสัญญาคนละอย่าง** — `get` ห้ามยิงเน็ต · `validate` ต้องโยน error · `ensure` เรียกซ้ำได้, ความยาวชื่อแปรตามระยะที่ตัวแปรมีชีวิต 4 ระดับ, **ตารางคำต้องห้าม 6 กลุ่ม** (`data` `manager` `helper` `do` `temp` ตัวย่อที่คิดเอง) พร้อมตัวแทน, รูปร่างฟังก์ชันรวม**กฎห้ามรับ boolean เป็นพารามิเตอร์**, คอมเมนต์ที่เขียน "ทำไม" ไม่ใช่ "ทำอะไร" พร้อมสี่แบบที่ควรมี, **จัดโฟลเดอร์ตามฟีเจอร์ไม่ใช่ตามชนิดไฟล์** พร้อมบททดสอบว่าคนใหม่ต้องเดาโฟลเดอร์ถูกใน 30 วินาที, ลำดับข้างในไฟล์, กติกาภาษาไทย-อังกฤษในโค้ด, รายการตรวจ 9 ข้อ
**รอบคัดคอมเมนต์ก่อนรีวิว:** ไล่ทุกคอมเมนต์ที่ diff เพิ่มหรือแก้ แล้วจัดเข้าหนึ่งในสี่ทาง (เช่น แปลโค้ดเป็นภาษาคน · ล้าสมัย → ลบ) · diff ใหญ่ส่ง subagent ระดับกลางแบบอ่านอย่างเดียวทำรายการ (รวมมาจาก pstack)
**Output:** `assets/naming-reference.md` — ตารางอ้างอิงหน้าเดียว รูปแบบตัวพิมพ์ 4 ภาษา · คำนำหน้า · หน่วยที่ต้องอยู่ในชื่อ · คำต้องห้าม
**Anti-patterns ที่กันไว้:** แก้ชื่อรวมคอมมิตเดียวกับแก้ตรรกะ, `utils.ts` ที่มี 40 ฟังก์ชันไม่เกี่ยวกัน, คอมเมนต์หัวไฟล์ที่ไม่มีใครอัปเดต, โค้ดที่คอมเมนต์ทิ้งไว้เผื่อได้ใช้, ตั้งชื่อตาม pattern แทนตามหน้าที่, เปลี่ยนแบบการตั้งชื่อกลางโปรเจกต์, ย่อชื่อเพราะบรรทัดยาวเกิน

---

### 59. diagram-figures
**ใช้กับ:** solution-architect, system-analyst
**กฎเดียว:** ใช้เมื่อรูปต้องดู "ออกแบบมา" ไม่ใช่ "generate มา" — รูปในทีมกลับไปใช้ Mermaid
**Includes:** สามโครงที่ทดสอบแล้ว (`figure-context` ระบบกับโลกภายนอก · `figure-template` ข้างในเครื่อง · `figure-cloud` ผังคลาวด์), **ชุดไอคอนทางการ 205 ตัว** ของ AWS · Azure · Google Cloud · Kubernetes · ฐานข้อมูล · คิว · เครื่องมือ DevOps, กฎว่าหัวรูปต้องมีครบห้าอย่าง (ชื่อ · คำขยาย · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ), ระบบสีเจ็ดกลุ่มที่แต่ละกลุ่มต้องแปลว่าอะไรได้, การลากสายด้วยรายการ `WIRES` ที่คำนวณหลังจัดหน้าเสร็จ, ข้อควรระวังภาษาไทย (`line-height` ≥ 1.5 · ห้ามกำหนดความสูงตายตัว · ต้องใส่ `<br>` เอง), การเรนเดอร์ด้วย Playwright ที่ตัวคูณ 2 พร้อมรายการตรวจด้วยตา 9 ข้อ
**Output:** ไฟล์ `.png` ความละเอียด 2 เท่า + ไฟล์ HTML ต้นทางที่เก็บไว้แก้ปีหน้าได้
**Anti-patterns ที่กันไว้:** ใช้กับรูปในทีม, ใส่โลโก้ทางการในเอกสารเสนอขาย, สองกล่อง `.focus` ในรูปเดียว, ส่งไฟล์ HTML ให้ลูกค้า, ไม่เก็บไฟล์ต้นทาง, รูปไม่มีวันที่และเจ้าของ, ไอคอนต่างสไตล์ปนกัน

---

### 60. status-report
**ใช้กับ:** business-analyst, developer, devops-engineer, graphic-designer, product-manager, project-manager, qa-tester, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Description:** Use at the END of every task that produces or checks project work — a document, a mockup, a review, a code round, a fix, a release. Writes one status table (what passed, what stage each item has reached, what is still pending, what comes next) into `docs/BUILD-PLAN.md` and shows the same table in the reply. Keeps one living snapshot plus a one-line history so anyone opening the project knows where it stands without reading the conversation. Load it before reporting "done", not after.

---

### 61. reference-app-research
**ใช้กับ:** product-manager, reverse-engineer
**Description:** Use when someone says "I want an app like X" — names an existing product (with or without a link) as the model for what to build. Researches that product in depth from official pages, documentation, changelogs, user reviews and close competitors, then writes one research document covering its features, user interface, user experience, strengths, weaknesses and — the most important part — concrete improvements our version should make, each backed by evidence and mapped to the requirement and screen it will become. The output feeds the BRD, SRS and mockup. Requires web search and fetch tools.

---

### 62. adversarial-review-panel
**ใช้กับ:** qa-tester, solution-architect
**Description:** Use for adversarial review, stress test this, find blind spots, challenge this design, or tear this apart — and before shipping a contested design or a large diff. Spawns several independent reviewers that each try to break the change from a different lens, verifies every finding against the real code, and returns one synthesized verdict without applying any fixes on its own.
**รีวิวเวอร์ค่ายอื่น:** เครื่องมี CLI ของค่ายอื่น (`codex` · `gemini`) ใช้แทนรีวิวเวอร์หนึ่งคนในโหมดอ่านอย่างเดียว — โค้ดถูกส่งออกไปผู้ให้บริการนั้น จึงต้องอนุญาตไว้ล่วงหน้าใน `~/.claude/a-team-style.md` หรือ `docs/AGENT-LOOP.md` · ข้อที่ต้องทำย้อนไม่ได้เตรียมไว้ใน "รออนุมัติ"

---

### 63. agent-team
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Description:** Use at the start of any non-trivial task — a feature, a bug, a refactor, an investigation, a project document set, a review, or a long run the user will check later — or whenever the user types agent-team. Picks one playbook, copies its steps into the todo list, routes each step to the right skill and agent, applies the principle index, and proves the result against the real thing before calling it done. Stays on for the rest of the session until the user turns it off.
**หัวหน้าทีม:** ตัวที่คุยกับผู้ใช้ มีคนเดียวต่อโปรเจกต์ — สั่งและตรวจ subagent · เขียนไฟล์กลาง (`CONTEXT.md` · `docs/BUILD-PLAN.md` · `IMPROVEMENTS.md` · inbox) คนเดียว · เลือกระดับโมเดลใหญ่/กลาง/เล็ก (opus · sonnet · haiku) ตามงาน สลับกลางทางได้หลังเขียนจุดส่งต่อใน `CONTEXT.md`
**ไม่หยุดถาม:** งานย้อนไม่ได้เตรียมไว้ใน "รออนุมัติ" แล้วทำส่วนอื่นต่อ · อนุญาตล่วงหน้าใน `~/.claude/a-team-style.md` หรือ `docs/AGENT-LOOP.md` (ยกเว้น deploy production · ลบข้อมูลจริง · จ่ายเงิน) · ค้นเองใช้ได้เมื่อแหล่งที่น่าเชื่อถืออย่างน้อย 3 แหล่งยืนยันตรงกัน
**ตอนจบ:** ทุกข้ออ้างมีป้าย `วัดจริง` · `อนุมาน` · `เดา` · ข้อเสนอปรับปรุงไม่เกิน 3 ข้อ · ตารางสถานะ · ของใหม่ที่ทีมควรรู้จดลง `IMPROVEMENTS.md` ที่ root
**playbook จาก pstack:** `investigation` ตอบได้ทั้งทำงานอย่างไร · ทำไม · สอนแบบต่อชั้น · `performance` commit หนึ่งตัวต่อการแก้ที่ชนะ พร้อมตัวเลขก่อน/หลัง

---

### 64. app-verifier-setup
**ใช้กับ:** developer, qa-tester
**Description:** Use when a project has no scripted way for an agent to run the app and see the result itself — a web or desktop UI, a command-line tool, or a service — or before the first feature or bug fix on a new project. Builds a project-local verify skill with one start command, reusable drive scripts, and a feature map, so every later agent proves its work on the real app instead of asking a person to click and report back.

---

### 65. app-verifier-upkeep
**ใช้กับ:** qa-tester
**Description:** Use when a project's verify skill has drifted from the real app — a feature step fails because the screen changed, the feature map misses new screens, or agents keep working around the verifier — and as a periodic pass after a batch of releases. Reads the source per feature in parallel, drives every feature once on the real app, and lands at most one change set of proven corrections.

---

### 66. decision-log
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Description:** Use whenever an agent makes a judgment call on its own during long, multi-step, or unattended work — choosing between approaches, filling a gap the documents leave open, resolving two documents that disagree, or skipping something — and whenever the user will review the work later. Appends one row per decision (what was chosen, what was not, why, evidence) to the decision table in docs/BUILD-PLAN.md so a person can audit and reverse any single call afterwards.

---

### 67. parallel-attempts-pick-best
**ใช้กับ:** solution-architect
**Description:** Use when one attempt at a non-trivial artifact could lock in the wrong shape — a new design, a public interface, a tricky algorithm, a mockup, a document structure — or when the user says try several, compare options, or bake-off. Runs N parallel candidates on the same brief, scores each against a rubric written beforehand, picks one as the base, and grafts the strongest ideas from the others into it before verifying the result.

---

### 68. parallel-split-and-merge
**ใช้กับ:** project-manager, qa-tester
**Description:** Use when work splits into independent slices that can run at the same time — auditing many modules, checking every screen, reading many files, testing a matrix of cases, or exploring several leads — or when the user says swarm, fan out, or do these in parallel. Partitions the work so no two workers write the same place, runs them together, drains every result, and returns one merged report the main thread can act on.

---

### 69. principle-build-a-tool-not-handwork
**ใช้กับ:** developer, reverse-engineer
**Description:** Use when non-trivial work has a mechanical part — editing the same pattern in many files, checking every screen, migrating data, generating repeated documents, or verifying a claim. Build the script, codemod, generator, or checker that does or proves the work instead of doing it by hand, so the deterministic part runs the same every time and a reviewer can rerun it.

---

### 70. principle-fix-root-cause
**ใช้กับ:** developer
**Description:** Use when debugging or fixing anything that broke — an error, a crash, a wrong value, a flaky test, a slow page. Reproduce the symptom first, ask why until you reach the cause, and fix it there instead of adding a null check, a retry, or a try-catch that silences the symptom.

---

### 71. principle-proceed-on-reversible-work
**ใช้กับ:** project-manager
**Description:** Use when tempted to stop and ask the user should I do X, which approach do you prefer, or shall I continue — on work that can be undone. Proceed, show the result, and let the person correct it afterwards; reserve confirmation for irreversible or outward-facing actions such as deploys, data deletion, merges to the main branch, and messages to customers.

---

### 72. principle-prove-it-works
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Description:** Use when a task is finished and before saying it is done, fixed, passing, or working — code, a fix, a mockup, a document, a migration, or a measurement. Verify against the real artifact (run the feature, read the actual value, open the file, inspect the diff), never a proxy such as it compiles, the subagent said so, or it should work.

---

### 73. principle-rules-as-checks-not-text
**ใช้กับ:** solution-architect
**Description:** Use when you catch yourself writing the same instruction for an agent a second time, adding another must-not line to a skill or prompt, or noticing a correction that keeps coming back. Encode the rule as structure the agent hits at the right moment — a folder layout, a type, a lint with a helpful message, a runtime check, or a script — instead of more text the agent has to remember.

---

### 74. repeated-mistakes-to-checks
**ใช้กับ:** project-manager
**Description:** Use when the user corrects an agent for the same kind of mistake a second time, says stop doing this again or correct, or when reviews keep flagging the same problem. Finds each repeated mistake class, then makes it impossible at the highest level that works — architecture first, then types, then a lint whose error message names the fix, then a test, and written instructions last — and proves each new check fails on a real past mistake.

---

### 75. session-lessons-to-skills
**ใช้กับ:** project-manager
**Description:** Use when a long or difficult task has just landed, when the user says reflect or what did we learn, or when an existing skill gave wrong or missing guidance during the work. Reviews the finished session from three independent angles, keeps only durable lessons, and routes each one to a concrete proposed edit on an existing skill or agent file — shown to the user before anything is changed.

---

### 76. docker-sandbox
**ใช้กับ:** developer, devops-engineer, qa-tester, reverse-engineer, security-engineer
**Description:** Use when a project should run inside its own Docker container on Docker Desktop instead of on the host — installing tools, running builds, tests, dev servers, test databases, or letting an agent work unattended with full freedom — or when the user says sandbox, container, or docker for a project. Sets up a per-project sandbox from the bundled templates, keeps the host as the commander, and lists what is free inside and what must never be mounted or opened.

---

### 77. bug-inbox-triage
**ใช้กับ:** qa-tester
**Description:** Use when bug reports arrive outside the code — email, LINE or chat messages, an issue tracker, or files dropped in an inbox folder — and should be sorted before a person reads them, usually on a schedule, or when the user says triage the bug inbox. Collects new reports, reproduces each one on the current code with the project's verify skill inside its sandbox, groups reports that share a cause, and files one bug report per confirmed problem without replying to anyone or changing code.

---

### 78. code-gardener
**ใช้กับ:** developer
**Description:** Use when a codebase should be checked regularly for patterns that make agents and people go wrong — duplicated logic, wrong-layer calls, risky framework pitfalls, dead code, inconsistent naming — or when the user says garden, tidy patrol, or find bad patterns. Scans on a schedule and appends findings to a buffer file without fixing anything, then every few days reviews the buffer, groups findings into themes, and turns each real theme into one structural fix.

---

### 79. owner-style-capture
**ใช้กับ:** project-manager
**Description:** Use when the user wants agents to work the way they personally do — "capture how I work", "learn my style", "update my agent-team style", or after repeatedly correcting agents on the same preferences. Mines the user's own chat history, project rules and memory for corrections and stated preferences, drafts or updates a personal style file that agent-team reads at the start of every task, and shows the change with its evidence before saving.

---

### 80. principle-secure-by-default
**ใช้กับ:** ai-engineer, blockchain-engineer, business-analyst, clinical-data-analyst, data-engineer, developer, devops-engineer, devrel-engineer, ecommerce-engineer, fintech-compliance-officer, fintech-engineer, game-designer, game-developer, graphic-designer, growth-specialist, healthcare-engineer, hipaa-officer, insurance-analyst, insurance-compliance-officer, insurance-engineer, iot-engineer, legal-compliance-officer, legaltech-engineer, mobile-engineer, product-manager, project-manager, qa-tester, quant-analyst, recommendation-engineer, reverse-engineer, revops-analyst, security-analyst, security-engineer, seo-specialist, solution-architect, system-analyst, technical-writer, ux-designer
**Description:** Use when writing, changing or reviewing any code, configuration, container or script — especially anything that takes input, talks to a database, handles files, logins, money or personal data, or calls another system. Makes the safe way the default way — guards at the boundary, parameterised queries, server-side permission checks, secrets outside code, least privilege, safe failure — in the same small diff as the feature, not as a later hardening pass.

---

### 81. security-gate
**ใช้กับ:** developer, qa-tester, security-engineer
**Description:** Use before shipping, merging, releasing or handing over code, after adding a dependency, and on a schedule for long-lived projects — or when the user says security check, scan for secrets, or audit dependencies. Runs automated secret, dependency and static code scans inside the project's sandbox, triages every finding against the real code, and blocks the release on unresolved critical or high findings until they are fixed or explicitly accepted by the user.

---

### 82. reverse-engineering
**ใช้กับ:** developer, reverse-engineer, solution-architect
**Description:** Reverse engineer software — native binaries (PE/ELF/Mach-O), .NET assemblies, Electron/Node apps, mobile apps (APK/IPA), JavaScript bundles, and websites — to understand how a feature works, trace strings/symbols to code, reconstruct undocumented formats, or recreate a feature for the user's own product. Use when the user asks to investigate an app they do not have source for, decompile or disassemble something, find how a feature/algorithm/protocol works "under the hood", analyze an unknown file/binary, or asks questions like "how does X app do Y", "ดูว่าแอปนี้ทำงานยังไง", "reverse engineer", or "decompile".

---

### 83. developer-experience
**ใช้กับ:** devrel-engineer
**Description:** Use when the users are developers — time-to-hello-world, error messages, CLI usability, onboarding, designing an SDK across languages, docs platforms, or technical content such as tutorials, blog posts and talks.

---

### 84. ecommerce-patterns
**ใช้กับ:** ecommerce-engineer, growth-specialist, recommendation-engineer
**Description:** Use when building or improving online commerce — checkout flow and conversion, cart, orders, promotions, inventory across warehouses and channels, or product recommendations such as you-may-also-like and frequently-bought-together.

---

### 85. fintech-payments
**ใช้กับ:** fintech-compliance-officer, fintech-engineer, quant-analyst, revops-analyst
**Description:** Use when money moves through the system — integrating payment gateways (Stripe, Omise, 2C2P, PromptPay), webhooks, refunds and reconciliation, KYC and AML checks, reducing PCI-DSS scope, or modelling financial risk and pricing.

---

### 86. game-development
**ใช้กับ:** game-designer, game-developer
**Description:** Use when building a game — choosing an engine, core systems such as ECS and scenes, multiplayer netcode, matchmaking and anti-cheat, game design and progression, or live-ops events, battle passes and retention.

---

### 87. healthcare-systems
**ใช้กับ:** clinical-data-analyst, healthcare-engineer, hipaa-officer
**Description:** Use when software handles patient or clinical data — clinical workflows such as orders and medication, FHIR APIs and EHR integration, SMART on FHIR, HIPAA safeguards and audits, or clinical analytics.

---

### 88. insurance-systems
**ใช้กับ:** insurance-analyst, insurance-compliance-officer, insurance-engineer
**Description:** Use when building insurance software — policy and quote engines, claims from first notice of loss to settlement, fraud detection, underwriting and rating models, actuarial reserves, or insurance regulation such as OIC filings and Solvency II.

---

### 89. iot-systems
**ใช้กับ:** iot-engineer
**Description:** Use when building connected devices — fleet provisioning and OTA updates, device versus edge versus cloud placement, MQTT topics, QoS and brokers, or embedded firmware on microcontrollers and RTOS.

---

### 90. legal-document-systems
**ใช้กับ:** legal-compliance-officer, legaltech-engineer
**Description:** Use when software handles legal documents — extracting clauses from contracts, document templates and automation, e-signature workflows and legal validity (eIDAS, ESIGN, Thai ETA), or legal-tech compliance.

---

### 91. llm-engineering
**ใช้กับ:** ai-engineer, data-engineer, recommendation-engineer
**Description:** Use when a system calls a large language model — writing or tuning prompts, structured output, building a RAG pipeline (chunking, embeddings, vector search, re-ranking), or measuring LLM quality with eval sets and LLM-as-judge. Router to three detailed references plus ML/LLM role guides.

---

### 92. mobile-engineering
**ใช้กับ:** growth-specialist, mobile-engineer
**Description:** Use when engineering a mobile app — choosing native or cross-platform (Kotlin, Swift, Flutter, React Native), architecture such as MVVM and offline-first, launch time, memory and battery, or App Store and Play Store listings. For screen design use mobile-app-design.

---

### 93. saas-platform
**ใช้กับ:** clinical-data-analyst, data-engineer, fintech-compliance-officer, growth-specialist, hipaa-officer, insurance-compliance-officer, legal-compliance-officer, quant-analyst, recommendation-engineer, revops-analyst, solution-architect
**Description:** Use when building B2B SaaS — multi-tenancy and tenant isolation, enterprise SSO (SAML/OIDC) and SCIM, webhooks, subscription billing, usage metering and revenue metrics, or customer onboarding and adoption.

---

### 94. security-operations
**ใช้กับ:** security-analyst, security-engineer
**Description:** Use when running security operations — responding to a security incident (containment, evidence, notification), designing a SOC (tiers, playbooks, KPIs), writing SIEM detection rules mapped to MITRE ATT&CK, hunting threats, or designing security architecture such as zero trust.

---

### 95. smart-contracts
**ใช้กับ:** blockchain-engineer
**Description:** Use when building on a blockchain — writing or reviewing Solidity or Solana contracts for security, testing with Foundry or Hardhat, DeFi mechanisms, chain selection and bridges, or token economics.

---

### 96. blast-radius
**Description:** Use before merging a small-looking change to shared code (helper, type, config, schema, CSS class, query) or when someone asks what else this could break. Lists every reach of the change and proves the riskiest one with a real run.
**เรียกโดย:** หัวหน้าทีม A-Team (ดัชนี principle) · ทุก agent ที่แก้โค้ดที่ใช้ร่วมผ่าน agent-team

---

### 97. principle-data-shape-first
**Description:** Use before writing logic that crosses a function or module (new feature, new table, API, state, concurrent work). Settle types and data shape first, encode the domain in structure, parse outside data at the edge.
**เรียกโดย:** หัวหน้าทีม A-Team (ดัชนี principle) · ทุก agent ที่เขียนโค้ดผ่าน agent-team

---

### 98. principle-replace-then-delete
**Description:** Use when replacing an API, function, table, component or pattern, or during a planned migration or rewrite. Clear dead weight first, move every caller in the same wave, delete the old path, leave no compatibility layer.
**เรียกโดย:** หัวหน้าทีม A-Team (ดัชนี principle) · ทุก agent ที่เขียนโค้ดผ่าน agent-team

---

### 99. principle-safe-to-rerun
**Description:** Use when writing anything that may run twice or stop halfway (migrations, scripts, setup, imports, sync, webhook handlers, retried jobs). Same end state whether it runs once, twice or again after a crash.
**เรียกโดย:** หัวหน้าทีม A-Team (ดัชนี principle) · ทุก agent ที่เขียนโค้ดหรือสคริปต์ผ่าน agent-team

---

### 100. principle-small-verifiable-steps
**Description:** Use for multi-step work (migrations, sweeps, many similar edits, long or unattended runs) and when stacking commits or PRs. Cut it into small units that each end verified before the next one starts.
**เรียกโดย:** หัวหน้าทีม A-Team (ดัชนี principle) · งานหลายขั้นทุกชนิดผ่าน agent-team

---

### 101. principle-user-experience-first
**Description:** Use when choosing between what is easier to build and what is better to use (screens, flows, error messages, defaults, scope cuts). Pick the user's experience, and ship fewer features done well over more done roughly.
**เรียกโดย:** หัวหน้าทีม A-Team (ดัชนี principle) · agent ที่ทำหน้าจอ flow และข้อความถึงผู้ใช้ผ่าน agent-team

---

## ⚡ Commands (28)

### 1. /feature-kickoff `<feature description>`
**Workflow:** BA → Solution Architect → System Analyst → PM
**Use case:** เริ่ม feature ใหม่ตั้งแต่ต้น
**Output:** BRD + Architecture + FSD + Project plan

---

### 2. /sprint-plan `<sprint number or goal>`
**Agent:** project-manager
**Use case:** ต้น sprint, วางแผนการทำงาน
**Output:** Sprint goal, committed stories, capacity plan, risks

---

### 3. /code-review `<file or PR>`
**Agent:** developer + code-review-checklist skill
**Use case:** Review PR
**Output:** Categorized findings + overall recommendation

---

### 4. /test-design `<feature>`
**Agent:** qa-tester + test-case-template skill
**Use case:** ออกแบบ test cases สำหรับ feature
**Output:** Test cases ครบทุก category + coverage summary

---

### 5. /bug-report `<issue>`
**Agent:** qa-tester + bug-report-template skill
**Use case:** รายงาน bug
**Output:** Structured bug report พร้อม severity/priority

---

### 6. /retrospective `<sprint>`
**Agent:** project-manager
**Use case:** จบ sprint ทำ retro
**Output:** Glad/Sad/Mad + Action items

---

### 7. /seo-audit `<url or description>`
**Agent:** seo-specialist + seo-audit-checklist skill
**Use case:** ตรวจสุขภาพ SEO ของเว็บไซต์
**Output:** Audit report + health score + 3-month action plan

---

### 8. /threat-model `<feature>` ⭐ NEW
**Agent:** security-engineer + polished-document-style
**Use case:** STRIDE threat modeling สำหรับ feature/system
**Output:** Threat model + data flow diagram + required controls + sign-off

---

### 9. /release-notes `<version>` ⭐ NEW
**Agent:** technical-writer + polished-document-style
**Use case:** สร้าง release notes ให้ user (ไม่ใช่ dev-speak)
**Output:** User-facing release notes + categorized changes + migration guide

---

### 10. /product-roadmap `<horizon>` ⭐ NEW
**Agent:** product-manager + polished-document-style
**Use case:** สร้าง strategic roadmap พร้อม prioritization
**Output:** Roadmap + RICE table + Gantt + KPIs + strategic risks

---

### 11. /onboard `<role>` ⭐ NEW
**Agent:** technical-writer + polished-document-style
**Use case:** สร้าง onboarding doc สำหรับ team member ใหม่
**Output:** 30/60/90 day plan + setup checklist + team norms + FAQ

---

### 12. /incident-response `<issue>` ⭐ NEW
**Agent:** devops-engineer + postmortem-template + incident-runbook-template
**Use case:** Coordinate live incident (detection → mitigation → resolution)
**Output:** Incident log + mitigation actions + postmortem prep

---

### 13. /api-design `<feature>` ⭐ NEW
**Agent:** system-analyst + polished-document-style
**Use case:** ออกแบบ API spec
**Output:** Full API spec (endpoints, schemas, errors, examples) ครบ

---

### 14. /architecture-review `<system>` ⭐ NEW
**Agent:** solution-architect + architecture-patterns + polished-document-style
**Use case:** Review existing/proposed architecture vs NFRs
**Output:** Quality scorecard + risk register + improvement recommendations

---

### 15. /security-scan `<scope>` ⭐ NEW
**Agent:** security-engineer + polished-document-style
**Use case:** Security audit (code, deps, infra)
**Output:** Findings (S1-S4) + OWASP mapping + remediation roadmap

---

## 🔗 Agent Collaboration Map

```
User Request
    │
    ▼
┌─────────────────┐
│ project-manager │ ──── coordinates ────────────┐
└─────────────────┘                              │
    │                                            │
    ▼                                            ▼
┌──────────────┐  business reqs   ┌──────────────────┐
│business-     │ ───────────────► │solution-architect│
│analyst       │                  │                  │
└──────────────┘                  └──────────────────┘
    │                                    │
    │ user stories                       │ architecture
    ▼                                    ▼
┌────────────────┐ <─────────  ┌────────────────┐
│system-analyst  │             │ux-designer     │
└────────────────┘             └────────────────┘
    │
    │ FSD + API spec
    ▼
┌─────────────┐  PR  ┌──────────┐  bug  ┌──────────┐
│developer    │ ──►  │qa-tester │ ────► │developer │
└─────────────┘      └──────────┘       └──────────┘
    │
    │ ready
    ▼
┌─────────────────┐
│devops-engineer  │ ── deploy ──► Production (รออนุมัติ)
└─────────────────┘
```

---

## 🪝 Hooks

`plugins/software-company/hooks/` — `hooks.json` เรียก `a-team-hook.mjs` (ต้องมี Node.js 16+ ใน PATH) · ทำงานเฉพาะโปรเจกต์ที่มีโฟลเดอร์ `.a-team/` · error ทุกชนิดถูกกลืน งานหลักไม่ล้ม

| event | ทำอะไร |
|---|---|
| SessionStart | เขียน log · เตือนให้อ่าน `CONTEXT.md` หัวข้อ "รับงานต่อ" · แจ้งข้อความค้างใน inbox |
| UserPromptSubmit | เขียน log (รวมข้อความผู้ใช้) · แจ้งข้อความค้างใน inbox |
| PostToolUse | เขียน log การเรียกเครื่องมือ · แจ้งเมื่อมีข้อความใหม่ใน inbox |
| PostToolUseFailure | เขียน log การเรียกเครื่องมือที่ล้ม |

log อยู่ที่ `.a-team/log/<วันที่>.jsonl` หนึ่งบรรทัดต่อเหตุการณ์ — ไม่เก็บเนื้อไฟล์และผลของเครื่องมือ · ค่าที่ดูเป็นค่าลับถูกแทนด้วย `[ตัด]` · รายละเอียดใน skill `work-session-context`

---

## 📁 File Structure

```
SQT-Marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── software-company/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── agents/         (38 files)
│       ├── skills/         (101 folders)
│       ├── commands/       (28 files)
│       └── hooks/          (hooks.json · a-team-hook.mjs)
├── docs/
│   ├── INSTALL.md
│   ├── USAGE.md
│   └── REFERENCE.md  ← you are here
└── README.md
```

---

## 🎯 Choosing the Right Tool

```
ต้องการอะไร?
│
├─ Workflow ที่ทำซ้ำๆ
│  └─ ใช้ Slash Command
│
├─ งานเฉพาะของ role
│  └─ เรียก Agent ตรงๆ (ใช้ <agent-name> ...)
│
├─ Format ตายตัว (user story, ADR, etc.)
│  └─ Skill (Claude เรียกเองจาก context)
│
└─ ไม่แน่ใจ
   └─ บอก Claude หลักไปธรรมดา ระบบจะเลือกให้
```
