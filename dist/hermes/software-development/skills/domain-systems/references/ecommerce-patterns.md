<!-- merged from skill `ecommerce-patterns` on 2026-11-27 · description was: Use when building shop software with cart and checkout -->
# ecommerce-patterns

Online shops — checkout and conversion · multi-warehouse stock · product recommendation

**Open only the files that match the job.** Do not read them all. Each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or improving a checkout flow — form design, guest vs login, payment methods, mobile patterns, trust signals, cutting friction (based on Baymard research and industry benchmarks) | [`checkout-optimization.md`](checkout-optimization.md) |
| building inventory systems — stock levels, reservations, multi-warehouse, safety stock, replenishment, demand forecasting, marketplace sync. Proven patterns that stop overselling and stockouts | [`inventory-management.md`](inventory-management.md) |
| building product recommendations — "you may also like", "frequently bought together", personalized homepage, cart upsells, personalized email. Covers picking candidates, ranking, diversity and serving | [`recommendation-systems.md`](recommendation-systems.md) |
| connecting to Thai marketplaces — Shopee, Lazada, TikTok Shop, LINE SHOPPING and LINE Pay: partner sign-up, request signing, order · stock · shipping endpoints, webhooks, rate limits, sandbox, and the back-office SaaS Thai sellers use instead | [`thai-marketplace-apis.md`](thai-marketplace-apis.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting.

| บทบาท | อ่าน | agent |
|---|---|---|
| analyzing or improving conversion rate — checkout flow, landing pages, product pages, A/B testing, funnel analysis, step-by-step friction removal. Uses analytics, UX and experiments together | [`agent-cro-specialist.md`](agent-cro-specialist.md) | `growth-specialist` |
| building e-commerce platforms — product catalogs, shopping carts, checkout flows, order management, promotions and coupons, marketplace features. Focuses on patterns that drive conversion and scale | [`agent-ecommerce-engineer.md`](agent-ecommerce-engineer.md) | `ecommerce-engineer` |
| designing inventory management — stock control, multi-warehouse fulfillment, demand forecasting, replenishment, allocation across channels, or reducing oversells and stockouts | [`agent-inventory-specialist.md`](agent-inventory-specialist.md) | `ecommerce-engineer` |
| building recommendation systems — collaborative, content-based, two-tower and hybrid models, cold start, two-stage serving, offline and online evaluation, diversity | [`agent-recommendation-engineer.md`](agent-recommendation-engineer.md) | `recommendation-engineer` |

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <checkout-audit | recommendation-design> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `checkout-audit` | Audit and optimize checkout flow using growth-specialist agent. Identifies friction points and produces test backlog. |
| `recommendation-design` | Design recommendation system for e-commerce using recommendation-engineer agent. Covers algorithm selection, serving architecture, evaluation. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](ecommerce-patterns/design-modes.md)
