# SQT software-company — Gemini CLI

> สร้างอัตโนมัติจาก plugins/software-company/ โดย scripts/build/build-targets.mjs (v2.0.0) · ห้ามแก้ไฟล์นี้โดยตรง

Simulates a complete software development company — 39 roles from product, analysis, architecture, design, development, QA, DevOps and security to AI, mobile, data, compliance, growth and an engineer per industry. Includes 107 skills and 28 slash commands for the whole SDLC.

ชุดนี้มี skill 107 ตัว · บทบาท 39 บทบาท · คำสั่งสำเร็จรูป 28 คำสั่ง

- **skill** → โหลดเองเมื่องานตรงกับคำอธิบาย ไม่ต้องสั่ง
- **บทบาท (agent)** → เรียกใช้เป็น subagent ด้วยชื่อ · คำสั่งสำเร็จรูปเรียกด้วย `/ชื่อคำสั่ง`
- งานหลายขั้น → เริ่มที่ skill `superuser` · ทุกคำตอบและเอกสารเขียนตาม skill `human-writing`

## บทบาททั้งหมด

- **ai-engineer** — Use when designing or building anything with LLMs or machine learning — model choice, RAG, prompts, evaluation, training pipelines, model serving and monitoring.
- **blockchain-engineer** — Use when building on blockchains — chain selection, smart contracts (Solidity, Solana), DeFi protocols, contract audits and token economics.
- **business-analyst** — Use when gathering requirements, writing BRD (Business Requirements Document), creating user stories, defining acceptance criteria, or analyzing business processes. Bridges business stakeholders and technical teams.
- **clinical-data-analyst** — Use when analyzing healthcare data — clinical dashboards, population health metrics, patient outcomes, quality improvement studies or clinical research. Combines clinical knowledge with data analysis.
- **data-engineer** — Use when building data pipelines (ETL/ELT), designing data warehouses, integrating data sources, ensuring data quality, building feature stores, or scaling data infrastructure. Specializes in reliable, scalable data movement.
- **developer** — Use when implementing features, writing code, fixing bugs, refactoring, writing unit tests, or doing code review. Writes concise, readable, well-tested code following project conventions.
- **devops-engineer** — Use when setting up CI/CD pipelines, writing Dockerfiles, configuring Kubernetes, setting up monitoring/logging, automating deployments, managing infrastructure-as-code, or troubleshooting production issues.
- **devrel-engineer** — Use when the product is for developers — developer experience audits, SDK design across languages, docs platforms, developer content and community.
- **ecommerce-engineer** — Use when building online stores — catalog, cart, checkout, orders, promotions, marketplace features, and inventory across warehouses and sales channels.
- **fintech-compliance-officer** — Use when navigating financial regulations (PCI-DSS, PSD2, BoT, SEC, AML/KYC), preparing for audits, designing compliance programs, or interpreting regulatory requirements for technical implementation. Bridges legal/regulatory and engineering.
- **fintech-engineer** — Use when building financial products — payment gateways (Stripe, Omise, 2C2P, PromptPay), webhooks and refunds, banking integrations, lending, ledgers, idempotent transaction flows and reconciliation.
- **game-designer** — Use when designing how a game plays and keeps players — mechanics, balance, progression, onboarding, live-ops events, battle passes and monetisation tuning.
- **game-developer** — Use when programming games — Unity, Unreal, Godot or custom engines, gameplay, rendering, ECS, multiplayer netcode, matchmaking and anti-cheat.
- **graphic-designer** — Use when the deliverable is visual work rather than a screen — a logo, brand colours and type, a poster, flyer, social post, LINE rich menu, label, name card or cover image — or to review visual work that looks generic or off-brand.
- **growth-specialist** — Use when improving conversion and adoption — checkout and landing-page conversion, A/B tests, App Store / Play Store listings, customer onboarding and in-product help. Search-engine work stays with seo-specialist.
- **healthcare-engineer** — Use when building healthcare software — EHR/EMR integration, FHIR APIs and SMART on FHIR, clinical workflows, telemedicine and patient portals.
- **hipaa-officer** — Use when navigating HIPAA compliance — Privacy Rule, Security Rule, Breach Notification Rule, Business Associate Agreements (BAAs), risk assessments, or preparing for OCR audits. Bridges legal HIPAA requirements and engineering implementation.
- **insurance-analyst** — Use for insurance numbers — actuarial loss and reserve models, IBNR, pricing, underwriting risk scores, rating algorithms and eligibility rules, with fairness testing and regulatory documentation.
- **insurance-compliance-officer** — Use when navigating insurance regulatory compliance — state filings (US), Solvency II (EU), local regulators (Thailand OIC, etc.), licensing, market conduct, data privacy in insurance context.
- **insurance-engineer** — Use when building insurance products — policy administration, quote and rating engines, agent portals, embedded insurance APIs, and claims from first notice of loss to settlement.
- **iot-engineer** — Use when building connected-device systems — firmware on microcontrollers, MQTT messaging, edge computing, telemetry pipelines and fleets of devices.
- **learning-reviewer** — Use at the end of every multi-step SuperUser task to review how the team worked — user corrections, failed steps, slow spots — and propose up to 3 skill or agent edits with evidence. Writes only its own note and never edits skills.
- **legal-compliance-officer** — Use when navigating regulatory compliance in legal tech — privacy (GDPR/PDPA), data residency, records retention, e-discovery, attorney advertising rules, multi-jurisdictional compliance.
- **legaltech-engineer** — Use when building legal technology — contract management and clause extraction, document templates and automation, e-signature workflows and their legal validity.
- **mobile-engineer** — Use when building mobile apps — native Android (Kotlin, Compose), native iOS (Swift, SwiftUI) or cross-platform (Flutter, React Native); platform APIs, store submission, mobile architecture and performance.
- **product-manager** — Use when defining product vision, building a roadmap, prioritizing features, doing user research or market analysis, or making strategic product decisions. Decides WHAT to build and WHY; project-manager handles HOW and WHEN.
- **project-manager** — Use when planning projects, creating timelines, tracking progress, identifying risks, running sprint planning, or producing status reports. Acts as the delivery-focused PM coordinating between business and tech teams.
- **qa-tester** — Use when creating test plans, writing test cases, designing test scenarios, reporting bugs, doing exploratory testing strategies, or defining test coverage. Ensures quality before release.
- **quant-analyst** — Use when modeling financial risk, designing pricing algorithms, building credit scoring, backtesting trading strategies, calculating exposures, or any quantitative analysis with financial data. Combines statistics, finance theory, and engineering.
- **recommendation-engineer** — Use when building recommendation systems — \"you may also like\", product recommendations, personalized rankings, related items — with collaborative, content-based or hybrid filtering, including training, serving and evaluation.
- **reverse-engineer** — Use when the team must understand software it has no source for — a binary, .NET assembly, Electron app, APK/IPA, JavaScript bundle, unknown file format or website — to explain how a feature works or recreate it. Authorized targets only.
- **revops-analyst** — Use when designing subscription billing, pricing tiers, usage metering, revenue analytics (MRR, ARR, churn), or RevOps tooling integration (Stripe Billing, Chargebee, custom).
- **security-analyst** — Use for security operations — leading a security incident, triaging alerts, threat hunting, SOC design, detection rules, or security architecture (zero trust, segmentation). Application code security stays with security-engineer.
- **security-engineer** — Use when doing security reviews, threat modeling, vulnerability assessment, secure code review, designing authentication/authorization, compliance (PDPA, GDPR, PCI-DSS, SOC2), or responding to a security incident.
- **seo-specialist** — Use when improving search engine ranking — SEO audits, keyword research, meta tags and titles, content planning for SEO, URL structure, structured data (Schema.org), or analyzing competitors' SEO.
- **solution-architect** — Use when designing system architecture, selecting tech stack, creating high-level designs, evaluating technical trade-offs, writing ADRs (Architecture Decision Records), or reviewing architectural changes.
- **system-analyst** — Use when writing a Functional Specification Document (FSD), use cases, data flow diagrams, API specifications, sequence diagrams or detailed system behaviour, as developer-ready specs in polished Markdown with Mermaid diagrams.
- **technical-writer** — Use when writing user guides, API documentation, tutorials, README files, release notes, onboarding docs, or any user-facing technical content. Specialist in making complex technical concepts accessible to different audiences.
- **ux-designer** — Use when designing user flows, creating wireframes (ASCII/markdown), defining UI patterns, conducting heuristic evaluation, or proposing UX improvements for features.
