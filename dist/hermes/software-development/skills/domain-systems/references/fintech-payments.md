<!-- merged from skill `fintech-payments` on 2026-11-27 · description was: Use when money moves through software via Stripe or PromptPay -->
# fintech-payments

Systems that money flows through — payment gateway · KYC/AML · PCI-DSS · financial risk models

**Open only the files that match the job.** Do not read every file, because each file is already the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| integrating with payment gateways (Stripe, Adyen, Omise, 2C2P, PromptPay), implementing checkout flows, handling 3D Secure / SCA, managing payment retries, or building robust webhook processing | [`payment-gateway-integration.md`](payment-gateway-integration.md) |
| Build the PromptPay QR (EMVCo) payload for the payment page | `e-commerce:shop-books` |
| implementing customer identification (KYC), anti-money laundering (AML) controls, sanctions screening, PEP checks, transaction monitoring, or suspicious activity reporting. Covers risk-based approach, vendor integration, and ongoing monitoring | [`kyc-aml-patterns.md`](kyc-aml-patterns.md) |
| handling card data, reducing PCI scope, selecting SAQ type, designing CDE (Cardholder Data Environment), preparing for PCI assessment, or implementing PCI-DSS v4 controls. Provides concrete guidance on the 12 requirements with implementation patterns | [`pci-dss-compliance.md`](pci-dss-compliance.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting work · read the table of contents first, then read only the sections the job uses

| บทบาท | อ่าน | agent |
|---|---|---|
| building financial technology applications — banking integrations, payment systems, lending platforms, trading systems, or any product handling money. Specializes in financial domain logic, regulatory awareness, and high-accuracy requirements | [`agent-fintech-engineer.md`](agent-fintech-engineer.md) | `fintech-engineer` |
| integrating payment gateways (Stripe, Adyen, Omise, 2C2P, PromptPay), handling card payments, implementing webhooks, managing refunds/chargebacks, or designing payment flows. Specializes in PCI scope reduction and reliable payment processing | [`agent-payment-integration.md`](agent-payment-integration.md) | `fintech-engineer` |
| financial regulation work — regulation map by region, applicability matrix, control mapping, audit readiness report, regulatory review and incident notification workflows | [`agent-fintech-compliance-officer.md`](agent-fintech-compliance-officer.md) | `fintech-compliance-officer` |
| quantitative finance — credit scoring, VaR, fraud anomaly models, backtesting, model documentation card and backtest report | [`agent-quant-analyst.md`](agent-quant-analyst.md) | `quant-analyst` |

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <transaction-flow-design | pci-audit> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `transaction-flow-design` | Design end-to-end financial transaction flow using fintech-engineer agent. Covers idempotency, state machine, audit, reconciliation. |
| `pci-audit` | Run a PCI-DSS readiness audit using fintech-compliance-officer agent. Identifies scope, gaps, and produces remediation plan. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](design-modes.md)
