# SQT software-company — Kimi Code CLI

> สร้างอัตโนมัติจาก plugins/software-company/ โดย scripts/build/build-targets.mjs (v2.24.0) · ห้ามแก้ไฟล์นี้โดยตรง

Simulates a complete software development company — 38 agents from product, analysis, architecture, design, development, QA, DevOps and security to AI, mobile, data, compliance, growth and an engineer per industry. Includes 95 skills and 29 slash commands for the whole SDLC.

ชุดนี้มี skill 131 ตัว · บทบาท 41 บทบาท · คำสั่งสำเร็จรูป 29 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/skill:ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **ai-engineer** — Use when building with LLMs or machine learning — model choice, RAG, prompts, evaluation, training, serving, monitoring.
- **blockchain-engineer** — Use when building on blockchains — chain choice, smart contracts (Solidity, Solana), DeFi, contract audits, tokenomics.
- **business-analyst** — Use when gathering requirements, writing a BRD, user stories or acceptance criteria. FSD and API → system-analyst.
- **clinical-data-analyst** — Use when analyzing healthcare data — clinical dashboards, population health, patient outcomes, clinical research.
- **data-engineer** — Use when building data pipelines (ETL/ELT), warehouses, integrations, data quality checks or data infrastructure.
- **developer** — Use when implementing features, writing code, fixing bugs, refactoring, writing unit tests or self-reviewing code.
- **devops-engineer** — Use when setting up CI/CD, Docker, Kubernetes, monitoring, deployments, infrastructure-as-code or SDK/toolchain setup.
- **devrel-engineer** — Use when the product is for developers — developer experience audits, SDK design, docs platforms, developer content.
- **ecommerce-engineer** — Use when building online stores — catalog, cart, checkout, orders, promotions, marketplace, multi-warehouse inventory.
- **fintech-compliance-officer** — Use for financial regulation (PCI-DSS, PSD2, BoT, AML/KYC) and audit prep. PDPA, GDPR → legal-compliance-officer.
- **fintech-engineer** — Use when building payments — gateways (Stripe, Omise), webhooks, refunds, ledgers, reconciliation. MRR → revops-analyst.
- **game-designer** — Use when designing how a game plays — mechanics, balance, progression, onboarding, live-ops, monetisation.
- **game-developer** — Use when programming games — Unity, Unreal, Godot, gameplay, rendering, ECS, multiplayer netcode, anti-cheat.
- **graphic-designer** — Use for visuals that are not screens — logo, brand colours, poster, social post. Screens → ux-designer.
- **growth-specialist** — Use when improving conversion and adoption — landing pages, checkout, A/B tests, onboarding. Search → seo-specialist.
- **healthcare-engineer** — Use when building healthcare software — EHR integration, FHIR and SMART on FHIR, clinical workflows, telemedicine.
- **hipaa-officer** — Use for HIPAA compliance — Privacy, Security and Breach Rules, business associate agreements, risk assessments, audits.
- **insurance-analyst** — Use for insurance numbers — loss and reserve models, IBNR, pricing, underwriting scores, rating algorithms.
- **insurance-compliance-officer** — Use for insurance regulation — US state filings, Solvency II, Thailand OIC, licensing, market conduct, privacy.
- **insurance-engineer** — Use when building insurance products — policy admin, quote and rating engines, agent portals, claims intake.
- **iot-engineer** — Use when building connected devices — microcontroller firmware, MQTT, edge computing, telemetry, device fleets.
- **legal-compliance-officer** — Use for legal-tech compliance — GDPR, PDPA, data residency, records retention, e-discovery, multi-jurisdiction rules.
- **legaltech-engineer** — Use when building legal tech — contract management, clause extraction, document automation, e-signature validity.
- **mobile-engineer** — Use when building mobile apps — Kotlin, Swift, Flutter or React Native; platform APIs, store submission, performance.
- **product-manager** — Use for product vision, roadmap, feature priorities, user research or market analysis. HOW and WHEN → project-manager.
- **project-manager** — Use for project plans, timelines, sprints, risks, progress tracking or status reports. WHAT and WHY → product-manager.
- **qa-tester** — Use when creating test plans, test cases, bug reports, exploratory testing or test coverage before release.
- **quant-analyst** — Use for quant risk, credit and trading models, backtests. SaaS pricing → revops-analyst. Insurance → insurance-analyst.
- **recommendation-engineer** — Use when building recommendation systems — related items, personalized ranking, collaborative or hybrid filtering.
- **reverse-engineer** — Use to understand or recreate software without source (binary, .NET, Electron, APK, JS bundle). Authorized targets only.
- **revops-analyst** — Use when designing subscription billing, pricing tiers, usage metering or revenue analytics (MRR, ARR, churn).
- **security-analyst** — Use for security operations — incidents, alert triage, threat hunting, SOC, detections. App code → security-engineer.
- **security-engineer** — Use for security reviews, threat modeling, vulnerability assessment, secure code, auth design. SOC → security-analyst.
- **seo-specialist** — Use when improving search ranking — SEO audits, keywords, meta tags, URL structure, structured data, competitor SEO.
- **solution-architect** — Use for system architecture, stack choice, trade-offs, ADRs or architecture review. Endpoint specs → system-analyst.
- **system-analyst** — Use for an FSD, use cases, data flows, endpoint API specs or sequence diagrams. Architecture → solution-architect.
- **technical-writer** — Use when writing user guides, API docs, tutorials, READMEs or release notes. Docs platform, SDK → devrel-engineer.
- **ux-designer** — Use when designing user flows, wireframes, clickable HTML mockups or UI heuristic reviews. Logos → graphic-designer.
- **brainstormer** — Use when the user wants ideas or options, or a task is big or unclear and a wrong pick is costly. Lead picks.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked. Proposes up to 3 fixes with evidence.
- **reviewer** — Use at a playbook's check step for fresh-eyes review of finished work. Reports, never fixes; default checker.
