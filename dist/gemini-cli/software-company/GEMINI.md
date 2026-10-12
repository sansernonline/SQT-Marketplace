# SQT software-company — Gemini CLI

> สร้างอัตโนมัติจาก plugins/software-company/ โดย scripts/build/build-targets.mjs (v2.3.0) · ห้ามแก้ไฟล์นี้โดยตรง

Simulates a complete software development company — 39 roles from product, analysis, architecture, design, development, QA, DevOps and security to AI, mobile, data, compliance, growth and an engineer per industry. Includes 110 skills and 29 slash commands for the whole SDLC.

ชุดนี้มี skill 110 ตัว · บทบาท 39 บทบาท · คำสั่งสำเร็จรูป 29 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **ai-engineer** — Use when designing or building with LLMs or machine learning — model choice, RAG, prompts, evaluation, training pipelines, model serving and monitoring.
- **blockchain-engineer** — Use when building on blockchains — chain selection, smart contracts (Solidity, Solana), DeFi protocols, contract audits and token economics.
- **business-analyst** — Use when gathering requirements, writing a BRD, user stories or acceptance criteria, or analyzing business processes. FSD and API go to system-analyst.
- **clinical-data-analyst** — Use when analyzing healthcare data — clinical dashboards, population health metrics, patient outcomes, quality improvement or clinical research.
- **data-engineer** — Use when building data pipelines (ETL/ELT), warehouses, data integrations, data quality checks, feature stores, or scaling data infrastructure.
- **developer** — Use when implementing features, writing code, fixing bugs, refactoring, writing unit tests, or reviewing code. Concise, readable, well-tested.
- **devops-engineer** — Use when setting up CI/CD, Dockerfiles, Kubernetes, monitoring and logging, automated deployments, infrastructure-as-code, or troubleshooting production.
- **devrel-engineer** — Use when the product is for developers — developer experience audits, SDK design across languages, docs platforms, developer content and community.
- **ecommerce-engineer** — Use when building online stores — catalog, cart, checkout, orders, promotions, marketplace features, and inventory across warehouses and sales channels.
- **fintech-compliance-officer** — Use for financial regulation (PCI-DSS, PSD2, BoT, SEC, AML/KYC), audit preparation and compliance programs. PDPA and GDPR go to legal-compliance-officer.
- **fintech-engineer** — Use when building financial products — payment gateways (Stripe, Omise), webhooks, refunds, ledgers, reconciliation. Subscriptions and MRR go to revops-analyst.
- **game-designer** — Use when designing how a game plays and keeps players — mechanics, balance, progression, onboarding, live-ops events, battle passes and monetisation tuning.
- **game-developer** — Use when programming games — Unity, Unreal, Godot or custom engines, gameplay, rendering, ECS, multiplayer netcode, matchmaking and anti-cheat.
- **graphic-designer** — Use for visual work that is not a screen — logo, brand colours, poster, flyer, social post, LINE rich menu, label, cover. Screens go to ux-designer.
- **growth-specialist** — Use when improving conversion and adoption — checkout and landing pages, A/B tests, store listings, onboarding. Search ranking goes to seo-specialist.
- **healthcare-engineer** — Use when building healthcare software — EHR/EMR integration, FHIR APIs and SMART on FHIR, clinical workflows, telemedicine and patient portals.
- **hipaa-officer** — Use for HIPAA compliance — Privacy, Security and Breach Notification Rules, Business Associate Agreements, risk assessments, OCR audit preparation.
- **insurance-analyst** — Use for insurance numbers — actuarial loss and reserve models, IBNR, pricing, underwriting scores, rating algorithms — with fairness tests and regulatory docs.
- **insurance-compliance-officer** — Use for insurance regulation — US state filings, Solvency II, Thailand OIC, licensing, market conduct, and data privacy in insurance.
- **insurance-engineer** — Use when building insurance products — policy admin, quote and rating engines, agent portals, embedded insurance APIs, claims from first notice of loss.
- **iot-engineer** — Use when building connected-device systems — firmware on microcontrollers, MQTT messaging, edge computing, telemetry pipelines and fleets of devices.
- **learning-reviewer** — Use at the end of a multi-step SuperUser task to review how the team worked and propose up to 3 skill or agent edits with evidence. Writes only its own note.
- **legal-compliance-officer** — Use for compliance in legal tech — GDPR and PDPA privacy, data residency, records retention, e-discovery, attorney advertising rules, multi-jurisdiction rules.
- **legaltech-engineer** — Use when building legal technology — contract management and clause extraction, document templates and automation, e-signature workflows and legal validity.
- **mobile-engineer** — Use when building mobile apps — Android (Kotlin, Compose), iOS (Swift, SwiftUI), Flutter or React Native; platform APIs, store submission, performance.
- **product-manager** — Use when defining product vision, a roadmap, feature priorities, user research or market analysis. Decides WHAT and WHY; project-manager handles HOW and WHEN.
- **project-manager** — Use when planning projects, timelines, progress tracking, risks, sprint planning, or status reports. Delivery-focused PM between business and tech teams.
- **qa-tester** — Use when creating test plans, test cases and scenarios, reporting bugs, exploratory testing strategies, or defining test coverage before release.
- **quant-analyst** — Use when modeling financial risk, pricing algorithms, credit scoring, backtesting strategies, exposures, or any quantitative analysis of financial data.
- **recommendation-engineer** — Use when building recommendation systems (related items, personalized rankings) with collaborative, content-based or hybrid filtering — training, serving, eval.
- **reverse-engineer** — Use when the team must understand or recreate software without source (binary, .NET, Electron, APK/IPA, JS bundle, file format, site). Authorized targets only.
- **revops-analyst** — Use when designing subscription billing, pricing tiers, usage metering, revenue analytics (MRR, ARR, churn), or billing tools (Stripe Billing, Chargebee).
- **security-analyst** — Use for security operations — leading incidents, alert triage, threat hunting, SOC design, detection rules, zero trust. App code security — security-engineer.
- **security-engineer** — Use for security reviews, threat modeling, vulnerability assessment, secure code review, and auth design. Incidents and SOC go to security-analyst.
- **seo-specialist** — Use when improving search ranking — SEO audits, keyword research, meta tags and titles, content planning, URL structure, structured data, competitor SEO.
- **solution-architect** — Use when designing system architecture, picking a tech stack, high-level designs, trade-offs, ADRs, or architecture review. Endpoint specs go to system-analyst.
- **system-analyst** — Use when writing an FSD, use cases, data flow diagrams, endpoint-level API specs or sequence diagrams as Markdown. Architecture goes to solution-architect.
- **technical-writer** — Use when writing user guides, API docs, tutorials, READMEs, release notes, onboarding docs, or other user-facing technical content for different audiences.
- **ux-designer** — Use when designing user flows, wireframes, clickable HTML mockups, UI patterns or heuristic evaluations. Logos and images go to graphic-designer.
