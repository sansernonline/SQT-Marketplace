---
name: ecommerce-patterns
description: Use when building or improving online commerce — checkout flow and conversion, cart, orders, promotions, inventory across warehouses and channels, or product recommendations such as you-may-also-like and frequently-bought-together.
---

# ecommerce-patterns

ร้านค้าออนไลน์ — checkout และ conversion · สต็อกหลายคลัง · ระบบแนะนำสินค้า

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or optimizing e-commerce checkout flows. Covers form design, guest vs login, payment methods, mobile patterns, trust signals, and friction reduction based on Baymard research and industry benchmarks | [`references/checkout-optimization.md`](references/checkout-optimization.md) |
| implementing inventory systems — stock levels, reservations, multi-warehouse, safety stock, replenishment, demand forecasting, marketplace sync. Production patterns to prevent overselling and stockouts | [`references/inventory-management.md`](references/inventory-management.md) |
| implementing product recommendations — "you may also like", "frequently bought together", personalized homepage, cart upsells, email personalization. Covers candidate generation, ranking, diversity, and serving patterns | [`references/recommendation-systems.md`](references/recommendation-systems.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| analyzing or improving conversion rate — checkout flow, landing pages, product pages, A/B testing, funnel analysis, or systematic friction reduction. Combines analytics, UX, and experimentation | [`references/agent-cro-specialist.md`](references/agent-cro-specialist.md) | `growth-specialist` |
| building e-commerce platforms — product catalogs, shopping carts, checkout flows, order management, promotions/coupons, or marketplace features. Specializes in conversion-critical patterns and scale | [`references/agent-ecommerce-engineer.md`](references/agent-ecommerce-engineer.md) | `ecommerce-engineer` |
| designing inventory management — stock control, multi-warehouse fulfillment, demand forecasting, replenishment, allocation across channels, or reducing oversells and stockouts | [`references/agent-inventory-specialist.md`](references/agent-inventory-specialist.md) | `ecommerce-engineer` |

## agent ของสายนี้

`growth-specialist` · `ecommerce-engineer` · `recommendation-engineer`

## ที่มา

รวมจาก plugin `software-company-ecommerce` (skill `checkout-optimization` · `inventory-management` · `recommendation-systems`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`
