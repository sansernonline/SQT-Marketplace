---
name: fintech-payments
description: Use when money moves through software (Stripe, Omise, PromptPay, webhooks, refunds, KYC, PCI-DSS).
argument-hint: <transaction-flow-design | pci-audit> <details>
---

# fintech-payments

ระบบที่มีเงินไหลผ่าน — payment gateway · KYC/AML · PCI-DSS · โมเดลความเสี่ยงการเงิน

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทุกไฟล์ เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้นอยู่แล้ว

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| integrating with payment gateways (Stripe, Adyen, Omise, 2C2P, PromptPay), implementing checkout flows, handling 3D Secure / SCA, managing payment retries, or building robust webhook processing | [`references/payment-gateway-integration.md`](references/payment-gateway-integration.md) |
| สร้าง payload ของ PromptPay QR (EMVCo) ให้หน้าชำระเงิน | `e-commerce:promptpay-qr` |
| implementing customer identification (KYC), anti-money laundering (AML) controls, sanctions screening, PEP checks, transaction monitoring, or suspicious activity reporting. Covers risk-based approach, vendor integration, and ongoing monitoring | [`references/kyc-aml-patterns.md`](references/kyc-aml-patterns.md) |
| handling card data, reducing PCI scope, selecting SAQ type, designing CDE (Cardholder Data Environment), preparing for PCI assessment, or implementing PCI-DSS v4 controls. Provides concrete guidance on the 12 requirements with implementation patterns | [`references/pci-dss-compliance.md`](references/pci-dss-compliance.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่มงาน · อ่านสารบัญก่อน แล้วอ่านเฉพาะหัวข้อที่งานใช้

| บทบาท | อ่าน | agent |
|---|---|---|
| building financial technology applications — banking integrations, payment systems, lending platforms, trading systems, or any product handling money. Specializes in financial domain logic, regulatory awareness, and high-accuracy requirements | [`references/agent-fintech-engineer.md`](references/agent-fintech-engineer.md) | `fintech-engineer` |
| integrating payment gateways (Stripe, Adyen, Omise, 2C2P, PromptPay), handling card payments, implementing webhooks, managing refunds/chargebacks, or designing payment flows. Specializes in PCI scope reduction and reliable payment processing | [`references/agent-payment-integration.md`](references/agent-payment-integration.md) | `fintech-engineer` |
| financial regulation work — regulation map by region, applicability matrix, control mapping, audit readiness report, regulatory review and incident notification workflows | [`references/agent-fintech-compliance-officer.md`](references/agent-fintech-compliance-officer.md) | `fintech-compliance-officer` |
| quantitative finance — credit scoring, VaR, fraud anomaly models, backtesting, model documentation card and backtest report | [`references/agent-quant-analyst.md`](references/agent-quant-analyst.md) | `quant-analyst` |

## agent ของสายนี้

`fintech-engineer` · `fintech-compliance-officer` · `quant-analyst`

## ที่มา

ย้ายมาจาก plugin `software-company-fintech` (เดิมชื่อ payment-gateway-integration → `references/payment-gateway-integration.md` · kyc-aml-patterns → `references/kyc-aml-patterns.md` · pci-dss-compliance → `references/pci-dss-compliance.md` ไม่ใช่ skill แยกแล้ว) และรวมเข้า `software-company` ใน v2.0.0 เนื้อหาเดิมยังอยู่ครบใน `references/`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-company:fintech-payments <transaction-flow-design | pci-audit> <details>`

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `transaction-flow-design` | Design end-to-end financial transaction flow using fintech-engineer agent. Covers idempotency, state machine, audit, reconciliation. |
| `pci-audit` | Run a PCI-DSS readiness audit using fintech-compliance-officer agent. Identifies scope, gaps, and produces remediation plan. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
