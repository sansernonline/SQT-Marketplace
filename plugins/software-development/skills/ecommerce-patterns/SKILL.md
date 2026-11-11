---
name: ecommerce-patterns
description: Use when building shop software (cart, checkout, orders, promotions). Not running a shop.
argument-hint: <checkout-audit | recommendation-design> <details>
---

# ecommerce-patterns

ร้านค้าออนไลน์ — checkout และ conversion · สต็อกหลายคลัง · ระบบแนะนำสินค้า

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or improving a checkout flow — form design, guest vs login, payment methods, mobile patterns, trust signals, cutting friction (based on Baymard research and industry benchmarks) | [`references/checkout-optimization.md`](references/checkout-optimization.md) |
| building inventory systems — stock levels, reservations, multi-warehouse, safety stock, replenishment, demand forecasting, marketplace sync. Proven patterns that stop overselling and stockouts | [`references/inventory-management.md`](references/inventory-management.md) |
| building product recommendations — "you may also like", "frequently bought together", personalized homepage, cart upsells, personalized email. Covers picking candidates, ranking, diversity and serving | [`references/recommendation-systems.md`](references/recommendation-systems.md) |
| connecting to Thai marketplaces — Shopee, Lazada, TikTok Shop, LINE SHOPPING and LINE Pay: partner sign-up, request signing, order · stock · shipping endpoints, webhooks, rate limits, sandbox, and the back-office SaaS Thai sellers use instead | [`references/thai-marketplace-apis.md`](references/thai-marketplace-apis.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| analyzing or improving conversion rate — checkout flow, landing pages, product pages, A/B testing, funnel analysis, step-by-step friction removal. Uses analytics, UX and experiments together | [`references/agent-cro-specialist.md`](references/agent-cro-specialist.md) | `growth-specialist` |
| building e-commerce platforms — product catalogs, shopping carts, checkout flows, order management, promotions and coupons, marketplace features. Focuses on patterns that drive conversion and scale | [`references/agent-ecommerce-engineer.md`](references/agent-ecommerce-engineer.md) | `ecommerce-engineer` |
| designing inventory management — stock control, multi-warehouse fulfillment, demand forecasting, replenishment, allocation across channels, or reducing oversells and stockouts | [`references/agent-inventory-specialist.md`](references/agent-inventory-specialist.md) | `ecommerce-engineer` |
| building recommendation systems — collaborative, content-based, two-tower and hybrid models, cold start, two-stage serving, offline and online evaluation, diversity | [`references/agent-recommendation-engineer.md`](references/agent-recommendation-engineer.md) | `recommendation-engineer` |

## agent ของสายนี้

`growth-specialist` · `ecommerce-engineer` · `recommendation-engineer`

## ที่มา

รวมจาก plugin `software-development-ecommerce` (เดิมชื่อ checkout-optimization → `references/checkout-optimization.md` · inventory-management → `references/inventory-management.md` · recommendation-systems → `references/recommendation-systems.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-development` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:ecommerce-patterns <checkout-audit | recommendation-design> <details>`

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `checkout-audit` | Audit and optimize checkout flow using growth-specialist agent. Identifies friction points and produces test backlog. |
| `recommendation-design` | Design recommendation system for e-commerce using recommendation-engineer agent. Covers algorithm selection, serving architecture, evaluation. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
