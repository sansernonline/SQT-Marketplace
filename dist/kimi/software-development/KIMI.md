# SQT software-development — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/software-development/ โดย scripts/build/build-targets.mjs (v3.4.0) · ห้ามแก้ไฟล์นี้โดยตรง

Simulates a complete software development company — 38 agents from product, analysis, architecture, design, development, QA, DevOps and security to AI, mobile, data, compliance, growth and an engineer per industry. Includes 95 skills and 29 slash commands for the whole SDLC.

ชุดนี้มี skill 141 ตัว · บทบาท 42 บทบาท · คำสั่งสำเร็จรูป 12 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **ai-engineer** — Use when building with LLMs or machine learning (RAG, prompts, evals, training, serving).
- **blockchain-engineer** — Use when building on blockchains (smart contracts, Solidity, Solana, DeFi, audits).
- **business-analyst** — Use when gathering requirements or writing a BRD or user stories. FSD → system-analyst.
- **clinical-data-analyst** — Use when analyzing healthcare data (clinical dashboards, patient outcomes, research).
- **data-engineer** — Use when building data pipelines (ETL/ELT), warehouses or data quality checks.
- **developer** — Use when implementing features, fixing bugs, refactoring or writing unit tests.
- **devops-engineer** — Use when setting up CI/CD, Docker, Kubernetes, monitoring, deploys or infra as code.
- **devrel-engineer** — Use when the product is for developers (DX audits, SDK design, docs platforms).
- **ecommerce-engineer** — Use when building online stores (catalog, cart, checkout, orders, inventory).
- **fintech-compliance-officer** — Use for financial regulation (PCI-DSS, BoT, AML/KYC). PDPA → legal-compliance-officer.
- **fintech-engineer** — Use when building payments (Stripe, Omise, webhooks, refunds, ledgers, reconciliation).
- **game-designer** — Use when designing how a game plays (mechanics, balance, progression, monetisation).
- **game-developer** — Use when programming games (Unity, Unreal, Godot, rendering, multiplayer netcode).
- **graphic-designer** — Use for visuals that are not screens (logo, poster, social post). Screens → ux-designer.
- **growth-specialist** — Use when improving conversion (landing pages, A/B tests, onboarding). SEO → seo-specialist.
- **healthcare-engineer** — Use when building healthcare software (EHR integration, FHIR, telemedicine).
- **hipaa-officer** — Use for HIPAA compliance (Privacy, Security and Breach Rules, BAAs, risk assessments).
- **insurance-analyst** — Use for insurance numbers (loss reserves, IBNR, pricing, underwriting scores).
- **insurance-compliance-officer** — Use for insurance regulation (US state filings, Solvency II, Thailand OIC, licensing).
- **insurance-engineer** — Use when building insurance products (policy admin, quote and rating engines, claims).
- **iot-engineer** — Use when building connected devices (firmware, MQTT, edge computing, device fleets).
- **legal-compliance-officer** — Use for legal-tech compliance (GDPR, PDPA, data residency, retention, e-discovery).
- **legaltech-engineer** — Use when building legal tech (contract management, clause extraction, e-signature).
- **mobile-engineer** — Use when building mobile apps (Kotlin, Swift, Flutter, React Native, store submission).
- **product-manager** — Use for product vision, roadmap, priorities or user research. Schedules → project-manager.
- **project-manager** — Use for project plans, timelines, sprints, risks or status reports. Scope → product-manager.
- **qa-tester** — Use when creating test plans, test cases, bug reports or exploratory tests before release.
- **quant-analyst** — Use for quant risk, credit and trading models or backtests. Insurance → insurance-analyst.
- **recommendation-engineer** — Use when building recommendation systems (related items, personalized ranking).
- **reverse-engineer** — Use to understand or recreate software without source (binary, APK). Authorized only.
- **revops-analyst** — Use when designing subscription billing, pricing tiers or revenue analytics (MRR, churn).
- **security-analyst** — Use for security operations (incidents, alert triage, SOC). App code → security-engineer.
- **security-engineer** — Use for security reviews, threat modeling or secure code. SOC → security-analyst.
- **seo-specialist** — Use when improving search ranking (SEO audits, keywords, meta tags, structured data).
- **solution-architect** — Use for system architecture, stack choice, trade-offs or ADRs. Endpoints → system-analyst.
- **system-analyst** — Use for an FSD, use cases, data flows or endpoint API specs. Architecture → solution-architect.
- **technical-writer** — Use when writing user guides, API docs, tutorials, READMEs or release notes.
- **ux-designer** — Use when designing user flows, wireframes or clickable HTML mockups. Logos → graphic-designer.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
- **worker** — Use when the lead hands out a self-contained slice needing no special role (code slice with its test, file to fill).
