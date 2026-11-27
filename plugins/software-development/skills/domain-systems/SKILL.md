---
name: domain-systems
description: Use for payment, health, insurance, IoT, chain, SaaS, shop or e-sign
argument-hint: '<domain mode, e.g. pci-audit or claims-flow-design, then details>'
---

# domain-systems — find your industry in the table, then open only that guide

> **One rule:** regulated rules come first. Money, health data and personal data follow the law of the place where the system runs, and the domain guide states which rule applies. Check the rules in the last section before you call the work done.

Each guide is the full guide to its domain. Open only the row that matches the job, not every file.

## Pick the part

| Domain (what the user builds) | Open | Roles and modes |
|---|---|---|
| Payments, Stripe, Omise, PromptPay, checkout, refunds, KYC, PCI DSS, financial risk | [`references/fintech-payments.md`](references/fintech-payments.md) | Roles: `fintech-engineer`, `payment-integration`, `fintech-compliance-officer`, `quant-analyst`. Modes: `transaction-flow-design`, `pci-audit` |
| Patient or clinical data, EHR, FHIR, HIPAA, clinical analytics | [`references/healthcare-systems.md`](references/healthcare-systems.md) | Roles: `healthcare-engineer`, `fhir-specialist`, `hipaa-officer`. Modes: `fhir-design`, `hipaa-audit` |
| Insurance policy, quote, claims, underwriting, actuarial work | [`references/insurance-systems.md`](references/insurance-systems.md) | Roles: `insurance-engineer`, `claims-processing-specialist`, `underwriting-analyst`, `actuarial-engineer`, `insurance-compliance-officer`. Modes: `claims-flow-design`, `underwriting-model-design` |
| Connected devices, MQTT, OTA updates, edge computing, firmware | [`references/iot-systems.md`](references/iot-systems.md) | Roles: `iot-engineer`, `mqtt-specialist`, `edge-architect`, `firmware-engineer`. Modes: `iot-architecture`, `device-fleet-design` |
| Blockchain, Solidity, DeFi, tokenomics, contract testing | [`references/smart-contracts.md`](references/smart-contracts.md) | Roles: `smart-contract-developer`, `blockchain-architect`, `defi-engineer`, `tokenomics-designer`. Modes: `smart-contract-audit`, `tokenomics-design` |
| Enterprise SaaS, multi-tenancy, SSO and SCIM, monthly billing, onboarding | [`references/saas-platform.md`](references/saas-platform.md) | Roles: `saas-architect`, `integration-engineer`, `customer-success-engineer`, `revops-analyst`. Modes: `saas-architecture-review`, `integration-design` |
| Online shop, cart and checkout, multi-warehouse stock, product recommendations | [`references/ecommerce-patterns.md`](references/ecommerce-patterns.md) | Roles: `ecommerce-engineer`, `inventory-specialist`, `recommendation-engineer`, `cro-specialist`. Modes: `checkout-audit`, `recommendation-design` |
| Contract reading, document generation, e-signature, legal workflow | [`references/legal-document-systems.md`](references/legal-document-systems.md) | Roles: `contract-analyzer`, `document-automation-engineer`, `e-signature-specialist`, `legaltech-engineer`, `legal-compliance-officer`. Modes: `contract-analysis-design`, `esignature-audit` |

Each role file is `references/agent-<role>.md`. A domain agent loads this skill, finds its row, and opens the guide and its role file. The steps for each mode are in `references/<domain>/design-modes.md` (fintech: `references/design-modes.md`), in the folder named after the domain.

## Steps every part shares

1. Name the domain and the mode from the table. If the user gives a mode, run that mode on the rest of the input. If not, pick the one that fits and say which one.
2. Open the domain guide first, then the reference it points to. Do not read the others.
3. Check the regulated rules below before designing a flow that moves money, health data or personal data.
4. For a mode that audits, produce the gap list and the remediation plan the guide asks for.

## Check before done

- **Money (fintech and shop):** reduce the PCI DSS scope first (define the cardholder data environment and the SAQ type). Do not let card data reach systems that do not need it.
- **Health data (healthcare):** health data is sensitive personal data under Thailand's PDPA. Collect it only with explicit consent, and notify the regulator within 72 hours of a breach. HIPAA applies to US patients only.
- **Underwriting and claims (insurance):** test underwriting models for fairness, and keep the regulatory documentation with the model.
- **E-signature (legal):** a signature's legal weight depends on its level (SES, AES or QES) and on the country's law. Confirm the level with `legal-compliance-officer` before launch.
- **Smart contracts:** follow the 5-step security review in `references/smart-contracts.md` in order. Never jump to step 5 first.
- **Tenant and device data (SaaS and IoT):** every tenant and device is isolated, and no tenant can read another tenant's data.
