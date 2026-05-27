# Plugin Reference

รายละเอียดทุก agent, skill, command ใน plugin

---

## 🧑‍💼 Agents (9)

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

## 🛠️ Skills (9)

### 1. user-story-writer
**ใช้กับ:** business-analyst
**Output:** User story รูปแบบ "As a... I want... So that..." + Given-When-Then acceptance criteria
**Includes:** INVEST checklist, priority, story points, dependencies

---

### 2. adr-writer
**ใช้กับ:** solution-architect
**Output:** Architecture Decision Record
**Includes:** Context, options compared, decision rationale, consequences (positive/negative)

---

### 3. code-review-checklist
**ใช้กับ:** developer
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
**ใช้กับ:** developer
**Output:** Conventional Commits format
**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

---

### 7. pr-description-template
**ใช้กับ:** developer
**Output:** PR description template
**Includes:** Summary, changes, test plan, screenshots, checklist, breaking changes

---

### 8. postmortem-template
**ใช้กับ:** devops-engineer
**Output:** Blameless postmortem
**Includes:** Timeline, root cause (5 Whys), action items with owners

---

### 9. seo-audit-checklist
**ใช้กับ:** seo-specialist
**Output:** SEO audit report พร้อม action plan
**Covers:** Technical SEO, on-page SEO, content, off-page SEO, analytics
**Includes:** Severity levels, prioritized findings, 3-month roadmap

---

## ⚡ Commands (7)

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
│devops-engineer  │ ── deploy ──► Production
└─────────────────┘
```

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
│       ├── agents/         (9 files)
│       ├── skills/         (9 folders)
│       └── commands/       (7 files)
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
