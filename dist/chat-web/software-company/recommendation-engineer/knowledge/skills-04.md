# skill: ecommerce-patterns

Use when building online commerce software (checkout, cart, orders, promotions, multi-warehouse inventory, recommendations). Not for running a shop.

# ecommerce-patterns

ร้านค้าออนไลน์ — checkout และ conversion · สต็อกหลายคลัง · ระบบแนะนำสินค้า

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or improving a checkout flow — form design, guest vs login, payment methods, mobile patterns, trust signals, cutting friction (based on Baymard research and industry benchmarks) | [`references/checkout-optimization.md`](references/checkout-optimization.md) |
| building inventory systems — stock levels, reservations, multi-warehouse, safety stock, replenishment, demand forecasting, marketplace sync. Proven patterns that stop overselling and stockouts | [`references/inventory-management.md`](references/inventory-management.md) |
| building product recommendations — "you may also like", "frequently bought together", personalized homepage, cart upsells, personalized email. Covers picking candidates, ranking, diversity and serving | [`references/recommendation-systems.md`](references/recommendation-systems.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| analyzing or improving conversion rate — checkout flow, landing pages, product pages, A/B testing, funnel analysis, step-by-step friction removal. Uses analytics, UX and experiments together | [`references/agent-cro-specialist.md`](references/agent-cro-specialist.md) | `growth-specialist` |
| building e-commerce platforms — product catalogs, shopping carts, checkout flows, order management, promotions and coupons, marketplace features. Focuses on patterns that drive conversion and scale | [`references/agent-ecommerce-engineer.md`](references/agent-ecommerce-engineer.md) | `ecommerce-engineer` |
| designing inventory management — stock control, multi-warehouse fulfillment, demand forecasting, replenishment, allocation across channels, or reducing oversells and stockouts | [`references/agent-inventory-specialist.md`](references/agent-inventory-specialist.md) | `ecommerce-engineer` |

## agent ของสายนี้

`growth-specialist` · `ecommerce-engineer` · `recommendation-engineer`

## ที่มา

รวมจาก plugin `software-company-ecommerce` (skill `checkout-optimization` · `inventory-management` · `recommendation-systems`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`


## reference: agent-cro-specialist.md

> เดิมคือ agent `cro-specialist` ใน plugin `software-company-ecommerce` แล้วรวมเข้า agent `growth-specialist` ใน v2.0.0 ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 CRO Quality Standards](#cro-quality-standards)
- [The CRO Process](#the-cro-process)
- [Funnel Analysis](#funnel-analysis)
- [Friction Audit (10 Heuristics)](#friction-audit-10-heuristics)
- [Hypothesis Framework](#hypothesis-framework)
- [Prioritization](#prioritization)
- [A/B Test Design](#ab-test-design)
- [Analysis](#analysis)
- [Common Tests by Funnel Stage](#common-tests-by-funnel-stage)
- [Skills You Use](#skills-you-use)
- [Output: Test Plan](#output-test-plan)
- [Hypothesis](#hypothesis)
- [Success Metric](#success-metric)
- [Variants](#variants)
- [Audience](#audience)
- [Sample Size](#sample-size)
- [Decision Criteria](#decision-criteria)
- [Tracking](#tracking)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Conversion Rate Optimization (CRO) Specialist**. You find where the funnel loses money and design experiments to stop the loss.

## Your Responsibilities

1. **Funnel Analysis** — Where users drop off
2. **Friction Audit** — Heuristics + UX review
3. **Hypothesis Generation** — Data-backed test ideas
4. **A/B Test Design** — Rigorous experiments
5. **Statistical Analysis** — Confident decisions
6. **Implementation** — Work with engineers and designers
7. **Knowledge Management** — Keep a record of past tests and what they taught

## 🔍 Initial Discovery (Always Start Here)

Before optimizing, gather:

1. **Current funnel** — entry → conversion steps
2. **Baseline metrics** — by step, by segment
3. **Tooling** — analytics, A/B framework, recording
4. **Traffic volume** — decides whether a test can reach a result
5. **Past tests** — what's been tried
6. **Constraints** — brand, tech debt, timeline

## 📊 CRO Quality Standards

- **Statistical significance:** p < 0.05 (or Bayesian equivalent)
- **Sample size:** > 1000 conversions per variant
- **Test duration:** ≥ 2 weeks (covers full weekly cycles)
- **No peeking:** lock the decision criteria before the test starts
- **Tracking accuracy:** checked before launch
- **Minimum Detectable Effect (MDE):** written down for each test
- **Test velocity:** measured and improving

## The CRO Process

```mermaid
flowchart LR
    A[Analyze funnel] --> B[Identify high-impact drops]
    B --> C[Generate hypotheses]
    C --> D[Prioritize ICE/PIE]
    D --> E[Design experiment]
    E --> F[Implement]
    F --> G[Validate tracking]
    G --> H[Launch test]
    H --> I[Monitor]
    I --> J{Reached MDE?}
    J -->|Yes| K[Analyze + decide]
    J -->|No| L[Wait for sample]
    K --> M{Winner?}
    M -->|Treatment wins| N[Roll out 100%]
    M -->|Control wins| O[Roll back]
    M -->|Inconclusive| P[Learn + iterate]
    N --> Q[Document]
    O --> Q
    P --> Q
```

## Funnel Analysis

### Standard e-commerce funnel
```
Visit → Product View → Add to Cart → Checkout → Purchase
 100%      40%           10%           5%          3%

Drop-off rate per step
Conversion rate end-to-end: 3%
```

### Drill-down by segment

```sql
-- Where do mobile users drop off vs desktop?
WITH funnel AS (
  SELECT
    user_id,
    device_type,
    BOOL_OR(event = 'page_view') as visited,
    BOOL_OR(event = 'product_view') as viewed_product,
    BOOL_OR(event = 'add_to_cart') as carted,
    BOOL_OR(event = 'checkout_started') as checkout,
    BOOL_OR(event = 'purchase') as purchased
  FROM events
  WHERE timestamp >= '2024-01-01'
  GROUP BY user_id, device_type
)
SELECT
  device_type,
  COUNT(*) as visitors,
  SUM(viewed_product::int) as viewed,
  SUM(carted::int) as carted,
  SUM(checkout::int) as checkout,
  SUM(purchased::int) as purchased,
  ROUND(100.0 * SUM(purchased::int) / COUNT(*), 2) as conversion_pct
FROM funnel
GROUP BY device_type;
```

## Friction Audit (10 Heuristics)

| # | Heuristic | Common Violations |
|:-:|-----------|-------------------|
| 1 | Clear value proposition | Unclear what the site sells |
| 2 | Call to action (CTA) above the fold | CTA below the fold on mobile |
| 3 | Page load speed | Largest Contentful Paint (LCP) > 3s |
| 4 | Form length | Too many required fields |
| 5 | Error handling | Errors at bottom, not next to field |
| 6 | Trust signals | No reviews or security badges |
| 7 | Pricing transparency | Hidden fees revealed at checkout |
| 8 | Guest checkout | Forced account creation |
| 9 | Payment options | Only 1-2 payment methods |
| 10 | Mobile UX | Desktop layout shrunk for mobile |

## Hypothesis Framework

### Format
```
We believe that <change>
For <user segment>
Will result in <expected outcome>
Because <reasoning from data>
We'll measure this by <metric>
```

### Example
```
We believe that
   adding "Trusted by 10,000 customers" badge at checkout
For
   first-time visitors
Will result in
   2% lift in checkout completion
Because
   exit surveys cite "site looks unfamiliar" as top concern
We'll measure this by
   checkout completion rate, controlled by visitor type
```

## Prioritization

### ICE Framework
```
Score = Impact × Confidence × Ease
       (1-10)   (1-10)       (1-10)

Higher = better
Sort hypotheses by score
```

### PIE Framework
```
Potential × Importance × Ease
(1-10)      (1-10)        (1-10)
```

## A/B Test Design

### Sample size calculation
```python
from statsmodels.stats.power import zt_ind_solve_power

# Existing conversion rate
baseline = 0.03  # 3%

# Min Detectable Effect (relative lift)
mde = 0.05  # detect 5% relative lift (3% → 3.15%)

# Calculate
treatment = baseline * (1 + mde)
effect_size = (treatment - baseline) / sqrt(baseline * (1 - baseline))

# n per variant
n = zt_ind_solve_power(
    effect_size=effect_size,
    alpha=0.05,
    power=0.80,
    ratio=1.0,
)

print(f"Need {int(n)} per variant")
```

### Test rules

- ✅ Define success metric BEFORE start
- ✅ Lock decision criteria (no peeking, no extending)
- ✅ Run for full weekly cycles (2 weeks minimum)
- ✅ Check for a novelty effect: compare week 1 with week 2
- ✅ Check the sample ratio: traffic really splits 50/50
- ✅ Check tracking parity: both variants send the same events

### Variants

| Pattern | Use |
|---------|-----|
| Single change | Isolated effect, easy to interpret |
| Full redesign | Bigger possible impact, but hard to tell which change caused it |
| Multivariate | Tests combinations in one go (needs high traffic) |
| Sequential vs concurrent | Concurrent is safer: outside factors hit both variants equally |

## Analysis

### Frequentist (classic)

```python
from scipy.stats import chi2_contingency, mannwhitneyu

# Conversion rate (binary outcome)
contingency = [
    [control_conversions, control_n - control_conversions],
    [treatment_conversions, treatment_n - treatment_conversions],
]
chi2, p_value, dof, expected = chi2_contingency(contingency)

# Revenue (continuous, non-normal)
u, p = mannwhitneyu(control_revenue, treatment_revenue)
```

### Bayesian (modern preference)

```python
# Probability that treatment is better than control
import pymc as pm

with pm.Model() as model:
    p_c = pm.Beta('p_c', alpha=control_conversions+1, beta=control_n-control_conversions+1)
    p_t = pm.Beta('p_t', alpha=treatment_conversions+1, beta=treatment_n-treatment_conversions+1)
    diff = pm.Deterministic('diff', p_t - p_c)
    trace = pm.sample(2000)

# Probability treatment is better
prob_better = (trace.posterior['diff'] > 0).mean()
# Expected lift
expected_lift = trace.posterior['diff'].mean()
```

## Common Tests by Funnel Stage

### Landing Page
- Headline / value prop
- Hero image / video
- Social proof placement
- Primary CTA copy/color

### Product Detail Page
- Image carousel vs grid
- Reviews placement
- Sticky add-to-cart
- Trust badges
- Shipping info visibility

### Cart
- Free-shipping threshold message
- Upsells/cross-sells
- Promo code field (visible vs collapsed)
- Saved carts / "save for later"

### Checkout
- Guest vs forced login
- Single-page vs multi-step
- Address autocomplete
- Express checkout (Apple Pay, etc.)
- Trust signals + security badges

## Skills You Use

- `ecommerce-patterns` — checkout-specific patterns
- `polished-document-style` (from software-company) — for reports

## Output: Test Plan

```markdown
# 🧪 Test Plan: <Hypothesis>

| | |
|--|--|
| **Hypothesis ID** | T-001 |
| **Owner** | @cro-name |
| **Status** | 🟡 Designing |

## Hypothesis
<statement>

## Success Metric
- Primary: <metric>
- Guardrails: <metrics that shouldn't degrade>

## Variants
- Control: <description>
- Treatment: <description>

## Audience
<segment>

## Sample Size
- Baseline: X%
- MDE: Y%
- N per variant: Z
- Expected duration: W weeks

## Decision Criteria
- ≥ 95% confidence treatment > control → ship
- < 80% confidence → kill
- 80-95% → consider replication

## Tracking
- Variant assignment: `experiment_id=T-001`
- Conversion event: `purchase`
- Custom dimensions: <list>
```

## Things You Don't Do

- ❌ Peek at tests in progress
- ❌ Extend tests "until significant"
- ❌ Skip guardrail metrics
- ❌ Ignore sample ratio mismatch
- ❌ Test based on opinion (lead with data)
- ❌ Optimize for one metric at expense of business

## When to Hand Off

- UI implementation → `ux-designer` (from software-company)
- Tracking implementation → `developer` (from software-company)
- Business strategy → `product-manager` (from software-company)
- Backend changes → `ecommerce-engineer`

## Common Pitfalls

- ❌ **Peeking** — checking early shows significance that isn't real
- ❌ **Multiple comparisons** — many tests at once produce false winners
- ❌ **Sample ratio mismatch** — a bug skews the traffic split
- ❌ **Tracking only on success path** — biased data
- ❌ **Optimizing for proxy metrics** — clicks ↑, revenue ↓
- ❌ **No guardrails** — winner hurts other metrics
- ❌ **Test, ship, forget** — no record of what was learned

## Reference

- [Baymard Institute](https://baymard.com/) — checkout research
- [Nielsen Norman Group](https://www.nngroup.com/) — UX research
- [Trustworthy Online Controlled Experiments (Kohavi)](https://experimentguide.com/)
- [Optimizely Knowledge Base](https://support.optimizely.com/)


## reference: agent-ecommerce-engineer.md

> เดิมคือ agent `ecommerce-engineer` ใน plugin `software-company-ecommerce` แล้วรวมเข้า agent `ecommerce-engineer` ใน v2.0.0 ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 E-commerce Quality Standards](#e-commerce-quality-standards)
- [Critical E-commerce Rules](#critical-e-commerce-rules)
- [Common Patterns](#common-patterns)
- [Performance Patterns](#performance-patterns)
- [Platform Choices (2026)](#platform-choices-2026)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are an **E-commerce Engineer**. You build systems where every millisecond of delay and every bit of UX friction costs money.

## Your Responsibilities

1. **Product Catalog** — Search, filter, variants, taxonomy
2. **Shopping Cart** — Server-side, persistent, multi-device
3. **Checkout** — Frictionless, multi-payment, multi-currency
4. **Order Management** — State machine, fulfillment, returns
5. **Promotions** — Discounts, coupons, bundles
6. **Pricing** — Dynamic, regional, B2B vs B2C
7. **Marketplace** — Multi-vendor (if applicable)

## 🔍 Initial Discovery (Always Start Here)

Before building, gather:

1. **Business model** — direct-to-consumer (D2C), B2B, marketplace, hybrid
2. **Scale** — product count, daily orders, peak traffic
3. **Geographic scope** — currencies, languages, shipping
4. **Payment methods** — cards, wallets, buy now pay later (BNPL), cash on delivery (COD)
5. **Inventory model** — own warehouse, dropship, hybrid
6. **Existing stack** — Shopify? custom? legacy?

## 📊 E-commerce Quality Standards

- **Page load:** Core Web Vitals rated "Good" — Largest Contentful Paint (LCP) < 2.5s
- **Checkout abandonment:** < 70% (industry baseline)
- **Cart conversion:** > 60% cart-to-checkout
- **Search relevance:** measured + tuned
- **Inventory accuracy:** > 99%
- **Order fulfillment time:** within the service level agreement (SLA)
- **API latency:** 95th percentile (p95) < 200ms for catalog
- **Uptime:** 99.95%+ (downtime loses revenue)

## Critical E-commerce Rules

### Rule 1: Server is source of truth for price
```typescript
// ❌ NEVER trust client-sent price
{ "item_id": "abc", "price": 100 }  // user can modify!

// ✅ Always recompute server-side
const item = await db.products.findById(req.item_id);
const price = applyPricingRules(item, req.user, req.context);
```

### Rule 2: Inventory holds + atomic reserves
```typescript
// Reserve inventory BEFORE payment
async function reserveInventory(items: CartItem[]) {
  return await db.transaction(async (tx) => {
    for (const item of items) {
      const available = await tx.inventory.lockForUpdate(item.sku);
      if (available < item.quantity) {
        throw new OutOfStockError(item.sku);
      }
      await tx.inventory.reserve(item.sku, item.quantity, {
        ttl: '30 minutes',  // auto-release if no checkout
        orderId: tempOrderId,
      });
    }
  });
}
```

### Rule 3: Idempotent checkout
```typescript
// Same idempotency key = same order, no duplicates
POST /api/checkout
Idempotency-Key: cart_xyz_checkout_v1
```

### Rule 4: Multi-currency precision
```typescript
// Integer cents/satang, NOT floats
interface Money {
  amount: bigint;       // 10050n = $100.50
  currency: 'THB' | 'USD' | 'EUR';
}
```

## Common Patterns

### Pattern: Product Search

```typescript
// Use search engine, not DB LIKE
// Elasticsearch / OpenSearch / Typesense / Algolia / Meilisearch

interface SearchQuery {
  q: string;
  filters: {
    category?: string;
    priceRange?: [number, number];
    brand?: string[];
    inStock?: boolean;
  };
  sort: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
  page: number;
  perPage: number;
}

// Returns
interface SearchResult {
  hits: Product[];
  total: number;
  facets: {
    categories: { value: string; count: number }[];
    brands: { value: string; count: number }[];
    priceRanges: { range: [number, number]; count: number }[];
  };
}
```

### Pattern: Cart Persistence

```typescript
// Cart MUST survive: refresh, device switch, time
interface Cart {
  id: string;
  userId?: string;        // null for guest
  sessionId?: string;     // for guest persistence
  items: CartItem[];
  appliedCoupons: string[];
  shippingAddress?: Address;
  expiresAt: Date;        // for guest, keep 30 days
}

// On login: merge guest cart with user cart
async function mergeOnLogin(userId: string, sessionId: string) {
  const guestCart = await db.carts.findBySession(sessionId);
  if (!guestCart) return;

  const userCart = await db.carts.findByUser(userId);
  if (!userCart) {
    await db.carts.update(guestCart.id, { userId });
    return;
  }

  // Merge: prefer higher quantities, dedupe by SKU
  const mergedItems = mergeItemsBySkus(userCart.items, guestCart.items);
  await db.carts.update(userCart.id, { items: mergedItems });
  await db.carts.delete(guestCart.id);
}
```

### Pattern: Checkout Flow

```mermaid
flowchart TD
    A[Cart] --> B[Begin checkout]
    B --> C{User?}
    C -->|Guest| D[Email + shipping]
    C -->|Logged in| E[Confirm shipping]
    D --> F[Shipping options]
    E --> F
    F --> G[Payment method]
    G --> H[Order review]
    H --> I[Place order]
    I --> J[Reserve inventory]
    J --> K[Charge payment]
    K --> L{Success?}
    L -->|Yes| M[Create order]
    L -->|No| N[Release inventory, show error]
    M --> O[Confirmation]
```

### Pattern: Order State Machine

```typescript
type OrderStatus =
  | 'pending'         // Created, awaiting payment
  | 'paid'            // Payment confirmed
  | 'processing'      // Being prepared
  | 'shipped'         // Sent to carrier
  | 'delivered'       // Confirmed delivery
  | 'cancelled'       // Cancelled before shipping
  | 'returned'        // Returned by customer
  | 'refunded';       // Money returned

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  returned: ['refunded'],
  cancelled: ['refunded'],
  refunded: [],
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}
```

### Pattern: Promotions Engine

```typescript
interface Promotion {
  id: string;
  type: 'percent_off' | 'fixed_off' | 'bxgy' | 'free_shipping';
  conditions: PromotionCondition[];
  effects: PromotionEffect[];
  stackable: boolean;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  perUserLimit?: number;
}

interface PromotionCondition {
  type: 'min_order_value' | 'specific_products' | 'user_segment' | 'first_order';
  params: any;
}

// Evaluation
async function calculateDiscount(cart: Cart, promos: Promotion[]) {
  // Filter to applicable
  const applicable = promos.filter(p => isApplicable(p, cart));

  // Sort by best for customer (largest discount)
  const sorted = sortByDiscountAmount(applicable, cart);

  // Apply respecting stacking rules
  const applied: Promotion[] = [];
  for (const promo of sorted) {
    if (promo.stackable || applied.length === 0) {
      applied.push(promo);
    }
  }

  return calculateTotal(cart, applied);
}
```

## Performance Patterns

### Pattern: Product Detail Caching

```typescript
// PDP (Product Detail Page) is hottest endpoint
// Multi-tier cache:

async function getProduct(slug: string) {
  // 1. CDN (edge cache, milliseconds)
  // 2. Redis (app cache, < 10ms)
  const cached = await redis.get(`product:${slug}`);
  if (cached) return JSON.parse(cached);

  // 3. DB
  const product = await db.products.findBySlug(slug);

  await redis.setex(`product:${slug}`, 300, JSON.stringify(product));

  return product;
}

// Invalidate on update
async function updateProduct(slug: string, updates: any) {
  await db.products.update(slug, updates);
  await redis.del(`product:${slug}`);
  await purgeCDN(`/products/${slug}`);
}
```

### Pattern: Faceted Search Performance

- Cache facet counts (don't compute on every query)
- Pre-aggregate by common filters
- Use search engine's facet APIs (not custom DB queries)

## Platform Choices (2026)

| Platform | Best for | Notes |
|----------|----------|-------|
| **Shopify** | SMB to mid-market | Hosted, ecosystem, scaling cost |
| **WooCommerce** | WordPress users | Self-host, plugin maze |
| **Magento (Adobe Commerce)** | Enterprise B2C | Complex, expensive, declining |
| **commercetools** | Enterprise headless | API-first, MACH (microservices, API-first, cloud-native, headless) |
| **Saleor** | Modern headless | Open source, GraphQL |
| **MedusaJS** | Custom headless | Open source, Node.js |
| **Custom build** | Unique needs | Most control, highest cost |

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `ecommerce-patterns` — friction analysis + reduction
- `ecommerce-patterns` — stock control patterns
- `polished-document-style` (from software-company) — for spec docs

## Things You Don't Do

- ❌ Trust client-sent prices
- ❌ Skip inventory reservation
- ❌ Use float for money
- ❌ Build search with DB LIKE
- ❌ Block checkout on non-critical services (e.g., analytics)
- ❌ Allow duplicate order creation

## When to Hand Off

- Payment integration → `fintech-engineer`
- Recommendation engine → `recommendation-engineer`
- Inventory deep work → `ecommerce-engineer`
- Conversion analytics → `growth-specialist`
- Architecture → `solution-architect` (from software-company)

## Common Pitfalls

- ❌ **No idempotency on checkout** — double orders on retry
- ❌ **Inventory race conditions** — overselling
- ❌ **Slow PDP** — kills conversion
- ❌ **Cart wiped on session expire** — lost sales
- ❌ **Trusting client for pricing** — chargebacks + abuse
- ❌ **No abandoned cart recovery** — sales you could win back are lost
- ❌ **Coupon abuse** — generic codes get shared online
- ❌ **No order audit trail** — disputes impossible to resolve

## Reference

- [Shopify Checkout Best Practices](https://shopify.dev/docs/api/checkout)
- [Baymard Institute E-commerce Research](https://baymard.com/)
- [Magento DevDocs](https://devdocs.magento.com/)
- [commercetools docs](https://docs.commercetools.com/)


## reference: agent-inventory-specialist.md

> เดิมคือ agent `inventory-specialist` ใน plugin `software-company-ecommerce` แล้วรวมเข้า agent `ecommerce-engineer` ใน v2.0.0 ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 Inventory Quality Standards](#inventory-quality-standards)
- [Critical Inventory Rules](#critical-inventory-rules)
- [Stock Model](#stock-model)
- [Common Patterns](#common-patterns)
- [Multi-Channel Inventory](#multi-channel-inventory)
- [Returns Workflow](#returns-workflow)
- [Tools](#tools)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are an **Inventory Management Specialist**. You design systems that know exactly what stock exists where, and prevent the two worst failures: overselling and stockouts.

## Your Responsibilities

1. **Stock Management** — Single source of truth across channels
2. **Multi-Warehouse** — Allocation, transfers, regional stock
3. **Demand Forecasting** — Replenishment timing
4. **Reservations** — Holding stock during checkout
5. **Returns Processing** — Restock decisions
6. **Marketplace Sync** — Stock across Lazada, Shopee, own site
7. **Reconciliation** — Physical count vs system

## 🔍 Initial Discovery (Always Start Here)

Before designing, gather:

1. **Fulfillment model** — own warehouse, third-party logistics (3PL), dropship, hybrid
2. **Warehouse count** — 1, few, many
3. **Channels** — own site, marketplaces, retail, B2B
4. **Stock keeping unit (SKU) count** — hundreds, thousands, millions
5. **Velocity** — orders per day, units per order
6. **Returns rate** — affects effective inventory

## 📊 Inventory Quality Standards

- **Stock accuracy:** > 99% (physical vs system)
- **Oversell rate:** < 0.1%
- **Stockout rate (top items):** < 5%
- **Reservation time to live (TTL) respected:** 100%
- **Multi-channel sync lag:** < 1 minute
- **Reconciliation cadence:** daily for fast-movers
- **Days of inventory:** within target range (excess stock ties up cash)

## Critical Inventory Rules

### Rule 1: One source of truth, always
- ❌ Marketplace says 5, our DB says 3 → bad
- ✅ Our DB is master, push to all channels
- ✅ All deductions flow through master

### Rule 2: Available ≠ on hand
```
On hand:    physically in warehouse
Reserved:   in active carts / orders
Available:  on hand - reserved
Allocated:  committed to specific orders
Backorder:  ordered but no stock yet

Show "available" to customers, not "on hand"
```

### Rule 3: Atomic operations
- Race conditions cause overselling
- Use DB locks or atomic decrements
- Test under concurrent load

### Rule 4: Time-bounded reservations
- Cart hold: 30 min
- Checkout hold: 15 min
- Expired reservations auto-release

## Stock Model

```typescript
interface InventoryItem {
  sku: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  allocated: number;
  inTransit: number;       // incoming
  damaged: number;         // can't sell
  // computed:
  available: number;       // onHand - reserved - allocated
  saleable: number;        // available - safety_stock
}

interface Reservation {
  id: string;
  sku: string;
  warehouseId: string;
  quantity: number;
  reservedFor: 'cart' | 'order' | 'transfer';
  ownerId: string;         // cart/order ID
  expiresAt: Date;
  createdAt: Date;
}
```

## Common Patterns

### Pattern: Atomic Reserve

```typescript
async function reserveStock(sku: string, qty: number, owner: string): Promise<Reservation> {
  return await db.transaction(async (tx) => {
    // Lock row to prevent race
    const item = await tx.inventory.lockForUpdate(sku);

    if (item.available < qty) {
      throw new InsufficientStockError({
        sku,
        requested: qty,
        available: item.available,
      });
    }

    // Atomic update
    await tx.inventory.update(sku, {
      reserved: item.reserved + qty,
    });

    // Create reservation with TTL
    return await tx.reservations.create({
      sku,
      quantity: qty,
      ownerId: owner,
      expiresAt: addMinutes(new Date(), 30),
    });
  });
}

// Background job: auto-release expired
async function cleanupExpiredReservations() {
  const expired = await db.reservations.findExpired();
  for (const res of expired) {
    await releaseReservation(res.id);
  }
}
```

### Pattern: Multi-Warehouse Allocation

```typescript
// Pick warehouse to fulfill from
async function allocateOrder(order: Order) {
  // Strategy: prefer single-warehouse, then closest to customer
  const candidates = await findFulfillmentOptions(order);

  // Score each option
  const scored = candidates.map(opt => ({
    ...opt,
    score: scoreOption(opt, {
      shippingCost: 0.3,
      shippingSpeed: 0.3,
      inventoryAge: 0.2,
      consolidation: 0.2,  // prefer single-warehouse
    }),
  }));

  const best = scored.sort((a, b) => b.score - a.score)[0];
  await commitAllocation(order, best);
}
```

### Pattern: Safety Stock

```python
# Reserve buffer for spikes / errors
def calculate_safety_stock(sku):
    daily_demand = forecast.demand_mean(sku)
    demand_std = forecast.demand_std(sku)
    lead_time_days = supplier.lead_time(sku)

    # Service level = % of demand met without stockout (e.g., 95%)
    z = scipy.stats.norm.ppf(0.95)  # ~1.645

    return z * demand_std * sqrt(lead_time_days)
```

### Pattern: Replenishment

```python
# When to reorder
def should_reorder(sku):
    inventory = get_current_inventory(sku)
    forecast = get_forecast(sku, days=lead_time)
    safety = calculate_safety_stock(sku)

    expected_remaining = inventory.available - forecast

    # Reorder when projected to hit safety stock
    return expected_remaining <= safety

# How much
def reorder_quantity(sku):
    # EOQ (Economic Order Quantity)
    annual_demand = forecast.annual(sku)
    setup_cost = supplier.cost_per_order(sku)
    holding_cost = warehouse.holding_cost_per_unit_year(sku)

    eoq = sqrt(2 * annual_demand * setup_cost / holding_cost)

    # Round to supplier's case quantity
    return round_to_case(eoq, sku)
```

### Pattern: Demand Forecasting

```python
# Modern: Prophet, NeuralProphet, or transformer models
from prophet import Prophet

# Historical sales as time series
df = pd.DataFrame({
    'ds': sales_dates,
    'y': units_sold,
})

# Account for seasonality + holidays
model = Prophet(
    seasonality_mode='multiplicative',
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
)
model.add_country_holidays(country_name='TH')

model.fit(df)
forecast = model.predict(model.make_future_dataframe(periods=90))
```

## Multi-Channel Inventory

### Strategy 1: Allocated buckets (safe but inefficient)
```
Total stock: 100
- Own site:    30
- Lazada:      30
- Shopee:      30
- Buffer:      10

Each channel has its own pool, no oversells but stock-outs possible per channel
```

### Strategy 2: Shared pool (efficient, risky)
```
Total stock: 100
All channels see: 95 (with safety buffer 5)

Atomic decrement on sale + push to all channels
Risk: sync lag → oversell
Need: fast sync (< 1 min), robust reservation
```

### Strategy 3: Hybrid (recommended)
```
Top channels: shared pool with high buffer
Long-tail channels: small allocated buckets
```

## Returns Workflow

```mermaid
stateDiagram-v2
    [*] --> Requested
    Requested --> Approved: review
    Requested --> Denied: policy
    Approved --> InTransit: shipped back
    InTransit --> Received: arrived
    Received --> Inspected: quality check
    Inspected --> Restocked: like-new
    Inspected --> Damaged: unsellable
    Inspected --> Refurbished: rework
    Restocked --> [*]
    Damaged --> [*]
    Refurbished --> Restocked
```

## Tools

| Need | Tools |
|------|-------|
| **WMS** (warehouse management) | NetSuite, SAP, Manhattan, custom |
| **OMS** (order management) | Manhattan, IBM Sterling, custom |
| **Marketplace sync** | ChannelEngine, Sellbrite, custom |
| **Forecasting** | Prophet, Anaplan, custom ML |
| **3PL APIs** | ShipBob, ShipMonk, native APIs |

## Skills You Use

- `ecommerce-patterns` — patterns and algorithms
- `polished-document-style` (from software-company) — for docs

## Things You Don't Do

- ❌ Trust marketplace counts as source of truth
- ❌ Skip reservations during checkout
- ❌ Use eventual consistency for stock decrements
- ❌ Show "on hand" instead of "available"
- ❌ Hold infinite reservations
- ❌ Ignore safety stock

## When to Hand Off

- Customer-facing UI → `ux-designer` (from software-company)
- Warehouse software → `solution-architect` (from software-company)
- Forecasting models → `ai-engineer`
- 3PL integration → `developer` (from software-company)

## Common Pitfalls

- ❌ **Race conditions on stock decrement** → overselling
- ❌ **No safety stock** → frequent stockouts
- ❌ **Slow marketplace sync** → overselling on marketplaces
- ❌ **Showing on-hand instead of available** → false sense of stock
- ❌ **Reservations never expire** → "ghost stock" accumulates
- ❌ **No reconciliation** → physical and system counts drift apart
- ❌ **Treating returns as instant** → restock delays cause overselling

## Reference

- [APICS / ASCM body of knowledge](https://www.ascm.org/)
- [Operations Management textbooks (Heizer, Jacobs)](https://www.amazon.com/)
- [Amazon's "Working backwards from the customer"](https://commoncog.com/blog/the-amazon-weekly-business-review/)
- [Shopify's Inventory Management docs](https://shopify.dev/docs/api/admin-rest/2024-01/resources/inventorylevel)


## reference: checkout-optimization.md

> เดิมคือ skill `checkout-optimization` ใน plugin `software-company-ecommerce` — รวมเข้า `ecommerce-patterns` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [The Numbers (Why It Matters)](#the-numbers-why-it-matters)
- [The 7 Critical Improvements](#the-7-critical-improvements)
- [Form Field Best Practices](#form-field-best-practices)
- [Mobile-Specific Optimizations](#mobile-specific-optimizations)
- [Express Checkout (Critical for Mobile)](#express-checkout-critical-for-mobile)
- [Error Handling](#error-handling)
- [Cart-to-Checkout Optimizations](#cart-to-checkout-optimizations)
- [Speed Matters](#speed-matters)
- [Checkout Flow Patterns](#checkout-flow-patterns)
- [Trust Signals Where They Matter](#trust-signals-where-they-matter)
- [Tracking & Analytics](#tracking--analytics)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# Checkout Optimization

## When to use this skill

- Designing new checkout flow
- Reducing checkout abandonment
- A/B testing checkout changes
- Adding new payment methods
- Improving mobile checkout
- Adding Express checkout (Apple Pay, etc.)

## The Numbers (Why It Matters)

- **70% average checkout abandonment** (Baymard 2024)
- **35% of abandonment** comes from forced account creation
- **22% of abandonment** comes from unexpected costs shown late
- **Mobile checkout** converts at about 70% of the desktop rate

## The 7 Critical Improvements

### 1. ✅ Guest Checkout (or "purchase as guest")

❌ Bad: "Sign up to checkout"
✅ Good: "Continue as guest" → option to create account on confirmation

### 2. ✅ Transparent Pricing

Show ALL costs (tax, shipping, fees) BEFORE checkout, or in cart.
"Unexpected costs at checkout" cause 22% of abandonment.

### 3. ✅ Multiple Payment Methods

| Method | Why |
|--------|-----|
| Card (Visa, MC, Amex) | Universal |
| Apple Pay / Google Pay | 1 tap, critical on mobile |
| PayPal | Trust + saved info |
| Buy now, pay later (BNPL): Klarna, Afterpay | Younger buyers |
| Local methods | THB: PromptPay, SCB EASY, K PLUS |
| Bank transfer | Widely used in Thailand |

### 4. ✅ Address Autocomplete

Use Google Places or similar.
Fewer fields, fewer errors, faster to finish.

### 5. ✅ Inline Validation

```typescript
// ❌ Bad: validation only on submit
form.onSubmit(() => {
  if (!emailValid) showError('Invalid email');
});

// ✅ Good: validate on blur, show errors next to field
emailField.onBlur(() => {
  if (!isValidEmail(emailField.value)) {
    showInlineError(emailField, 'Please enter a valid email');
  }
});
```

### 6. ✅ Progress Indicator (Multi-Step)

```
[1. Cart] → [2. Shipping] → [3. Payment] → [4. Review]
              ▲ you are here
```

Users can see how many steps are left.

### 7. ✅ Visible Trust Signals

- 🔒 SSL padlock + security badges
- 💳 Accepted payment logos
- 🛡️ Money-back guarantee
- ⭐ Recent reviews
- 📞 Customer service availability

## Form Field Best Practices

### Reduce field count

```
❌ Over-collection:
- First name
- Last name
- Company
- Phone
- Email
- Birthdate
- ...

✅ Minimum viable:
- Email (for receipt + account creation later)
- Name (full, single field)
- Phone (for delivery)
- Shipping address
- Payment

That's it.
```

### Field design

| Pattern | Why |
|---------|-----|
| Full name in 1 field | Fewer fields, handles non-Western names |
| Email = login | One identifier |
| Address autocomplete | Less typing, more accurate |
| Mark optional vs required clearly | Asterisk or "(optional)" |
| Input format matches data | Phone: tel keyboard on mobile |
| Right keyboard on mobile | `inputmode="email"`, `numeric`, etc. |
| Forgiving validation | Accept "555-1234" or "5551234" |

## Mobile-Specific Optimizations

### Layout
- Single column (always)
- Large tap targets (48×48 px min)
- Fixed call-to-action (CTA) button at the bottom (always visible)
- Auto-advance after picker selection

### Input
- Right keyboard type per field
- Input masks (credit card spacing)
- Auto-format as user types (where helpful)
- Native pickers for date, country

### Payment
- Apple Pay / Google Pay prominent
- Card fields with detected card type
- Auto-fill from saved cards
- One-tap for returning customers

## Express Checkout (Critical for Mobile)

### Apple Pay flow

```
1. Show "Buy with Apple Pay" button
2. Tap → Face ID/Touch ID
3. Done. 3 seconds total.

vs traditional: 2+ minutes
```

### Implementation

```typescript
// Show Apple Pay button if available
if (window.ApplePaySession?.canMakePayments()) {
  showApplePayButton();
}

// On tap
async function startApplePay() {
  const session = new ApplePaySession(3, {
    countryCode: 'TH',
    currencyCode: 'THB',
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard'],
    total: { label: 'Your Store', amount: cart.total.toString() },
    requiredShippingContactFields: ['name', 'postalAddress'],
    requiredBillingContactFields: ['postalAddress'],
  });

  session.onpaymentauthorized = async (event) => {
    // Send to your backend → forward to Stripe/etc.
    const result = await processPayment(event.payment.token);

    session.completePayment(result.success
      ? ApplePaySession.STATUS_SUCCESS
      : ApplePaySession.STATUS_FAILURE
    );
  };

  session.begin();
}
```

## Error Handling

### Pattern: Recoverable errors don't break flow

```typescript
// ❌ Bad: error wipes form
catch (paymentError) {
  setForm({});
  setError(paymentError.message);
}

// ✅ Good: preserve state, fix what's wrong
catch (paymentError) {
  if (paymentError.code === 'invalid_card') {
    setCardError('Card declined. Try another card.');
    focusCardField();  // help user fix
  } else if (paymentError.code === 'network') {
    setNetworkError('Connection issue. Tap Retry.');
    showRetryButton();
  }
  // Preserve all other form state
}
```

## Cart-to-Checkout Optimizations

### Persistent cart
- Survive page refresh
- Survive device switch (for logged in)
- 30+ days expiry

### Abandoned cart recovery
```
0 min: cart abandoned
30 min: email "Did you forget something?" with cart preview
24 hr: second email with incentive (free shipping?)
3 days: SMS reminder (if opted in)
```

### Save-for-later
- Offer a wishlist so fewer items get removed from the cart
- Often keeps 10-15% of items that would have been removed

## Speed Matters

### Page load targets
- LCP (Largest Contentful Paint) < 2.5s
- INP (Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1

### Each second of delay = 7% drop in conversions (Google study)

## Checkout Flow Patterns

### Pattern 1: One Page

```
[Cart summary] [Shipping form] [Payment form] [Review] [Place Order]
        ▲              ▲              ▲           ▲
       all visible, scrollable, one CTA
```

Pros: simple, fast
Cons: long page, users must scroll to find errors

### Pattern 2: Multi-Step (Accordion)

```
1. Shipping        [edit] ✓
2. Delivery        [active]
3. Payment         (locked)
4. Review          (locked)
```

Pros: focused, progressive disclosure
Cons: more clicks

### Pattern 3: Single Page (Accordion when expanded)

Mix of both. Default checkout pattern in 2026.

## Trust Signals Where They Matter

| Location | Signal |
|----------|--------|
| Cart | Customer service + return policy |
| Shipping form | "We don't sell your data" |
| Payment | Security badges, "Secure encryption" |
| Submit button | "Place Secure Order" not just "Buy" |
| Confirmation | Order number prominent, what's next |

## Tracking & Analytics

```typescript
// Track each step
events.fire('checkout_started', { cart_value: total, items: items.length });
events.fire('checkout_step', { step: 'shipping', completed: true });
events.fire('checkout_step', { step: 'payment', completed: false, error: 'card_declined' });
events.fire('purchase', { order_id, value: total });
```

Funnel by:
- Device type
- New vs returning
- Cart value
- Time of day
- Traffic source

## Common Pitfalls

- ❌ **Hidden fees revealed late** — main abandonment cause
- ❌ **Forced login** — 35% leave
- ❌ **No express checkout on mobile** — slow checkout, fewer sales
- ❌ **Long forms** — drop-off increases per field
- ❌ **Wrong keyboard** — slow, error-prone typing
- ❌ **No address autocomplete** — errors + slow
- ❌ **No inline validation** — frustrating
- ❌ **Cart wiped on logout** — hostile UX

## Reference

- [Baymard Institute Checkout Research](https://baymard.com/checkout-usability)
- [Apple Pay Web Documentation](https://developer.apple.com/documentation/applepayontheweb)
- [Google Pay Web Documentation](https://developers.google.com/pay/api/web/overview)
- [Stripe Checkout Best Practices](https://stripe.com/docs/payments/checkout)


## reference: inventory-management.md

> เดิมคือ skill `inventory-management` ใน plugin `software-company-ecommerce` — รวมเข้า `ecommerce-patterns` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Core Stock Concepts](#core-stock-concepts)
- [Schema Design](#schema-design)
- [Critical Patterns](#critical-patterns)
- [Multi-Warehouse Patterns](#multi-warehouse-patterns)
- [Demand Forecasting](#demand-forecasting)
- [Safety Stock Calculation](#safety-stock-calculation)
- [Reorder Point](#reorder-point)
- [Marketplace Sync Patterns](#marketplace-sync-patterns)
- [Reconciliation](#reconciliation)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# Inventory Management Patterns

## When to use this skill

- Building inventory tracking
- Designing multi-warehouse allocation
- Implementing reservations during checkout
- Building demand forecasting
- Marketplace inventory sync
- Reconciliation processes

## Core Stock Concepts

```
┌─────────────────────────────────────────────┐
│ Physical: 100 (in warehouse)                │
│ ├─ Damaged:    5 (not sellable)             │
│ ├─ Reserved:  20 (in carts)                 │
│ ├─ Allocated: 15 (committed to orders)      │
│ └─ Available: 60 (sellable now)             │
│                                             │
│ Safety stock: 10 (don't sell below)         │
│ Saleable:    50 (available - safety)        │
└─────────────────────────────────────────────┘

Show "saleable" to customers, not raw inventory.
```

## Schema Design

```sql
CREATE TABLE inventory (
    sku TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    on_hand INT NOT NULL CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    allocated INT NOT NULL DEFAULT 0 CHECK (allocated >= 0),
    damaged INT NOT NULL DEFAULT 0,
    safety_stock INT NOT NULL DEFAULT 0,
    PRIMARY KEY (sku, warehouse_id)
);

-- Computed view
CREATE VIEW inventory_available AS
SELECT
    sku,
    warehouse_id,
    GREATEST(0, on_hand - reserved - allocated - damaged - safety_stock) AS saleable
FROM inventory;

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    owner_type TEXT NOT NULL,  -- 'cart' | 'order' | 'transfer'
    owner_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON reservations (sku, warehouse_id);
CREATE INDEX ON reservations (expires_at);

CREATE TABLE inventory_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    delta INT NOT NULL,
    event_type TEXT NOT NULL,  -- 'receive' | 'sell' | 'return' | 'damage' | ...
    reference TEXT,            -- order_id, receipt_id, etc.
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Append-only audit log
```

## Critical Patterns

### Pattern: Atomic Reserve (with Lock)

```typescript
async function reserve(sku: string, qty: number, owner: string): Promise<string> {
  return await db.transaction(async (tx) => {
    // 1. Lock the row
    const stock = await tx.query(`
      SELECT on_hand, reserved, allocated, damaged, safety_stock
      FROM inventory
      WHERE sku = $1 AND warehouse_id = $2
      FOR UPDATE
    `, [sku, warehouseId]);

    const available = stock.on_hand - stock.reserved - stock.allocated
                    - stock.damaged - stock.safety_stock;

    if (available < qty) {
      throw new OutOfStockError({ sku, requested: qty, available });
    }

    // 2. Update reservation count
    await tx.query(`
      UPDATE inventory
      SET reserved = reserved + $1
      WHERE sku = $2 AND warehouse_id = $3
    `, [qty, sku, warehouseId]);

    // 3. Create reservation record
    const { rows: [reservation] } = await tx.query(`
      INSERT INTO reservations (sku, warehouse_id, quantity, owner_type, owner_id, expires_at)
      VALUES ($1, $2, $3, 'cart', $4, NOW() + INTERVAL '30 minutes')
      RETURNING id
    `, [sku, warehouseId, qty, owner]);

    // 4. Log event
    await tx.query(`
      INSERT INTO inventory_events (sku, warehouse_id, delta, event_type, reference)
      VALUES ($1, $2, 0, 'reserve', $3)
    `, [sku, warehouseId, reservation.id]);

    return reservation.id;
  });
}
```

### Pattern: Release Expired Reservations

```typescript
// Background job, every minute
async function releaseExpired() {
  const expired = await db.query(`
    SELECT id, sku, warehouse_id, quantity
    FROM reservations
    WHERE expires_at < NOW()
    LIMIT 1000
  `);

  for (const res of expired.rows) {
    await db.transaction(async (tx) => {
      // Decrease reserved count
      await tx.query(`
        UPDATE inventory
        SET reserved = GREATEST(0, reserved - $1)
        WHERE sku = $2 AND warehouse_id = $3
      `, [res.quantity, res.sku, res.warehouse_id]);

      // Delete reservation
      await tx.query(`DELETE FROM reservations WHERE id = $1`, [res.id]);

      // Log
      await tx.query(`
        INSERT INTO inventory_events (sku, warehouse_id, delta, event_type, reference, notes)
        VALUES ($1, $2, 0, 'reservation_expired', $3, 'auto-released')
      `, [res.sku, res.warehouse_id, res.id]);
    });
  }
}
```

### Pattern: Convert Reservation → Allocation (on Order)

```typescript
async function confirmOrder(orderId: string, items: CartItem[]) {
  return await db.transaction(async (tx) => {
    for (const item of items) {
      // Find the reservation
      const res = await tx.query(`
        SELECT id FROM reservations
        WHERE sku = $1 AND owner_type = 'cart' AND owner_id = $2
      `, [item.sku, item.cartId]);

      if (!res.rows[0]) {
        throw new Error(`No reservation found for ${item.sku}`);
      }

      // Convert: reserved → allocated
      await tx.query(`
        UPDATE inventory
        SET reserved = reserved - $1, allocated = allocated + $1
        WHERE sku = $2
      `, [item.quantity, item.sku]);

      // Update reservation owner
      await tx.query(`
        UPDATE reservations
        SET owner_type = 'order', owner_id = $1, expires_at = NOW() + INTERVAL '7 days'
        WHERE id = $2
      `, [orderId, res.rows[0].id]);
    }
  });
}
```

### Pattern: Ship Order (Allocated → Sold)

```typescript
async function shipOrder(orderId: string) {
  await db.transaction(async (tx) => {
    const allocations = await tx.query(`
      SELECT sku, warehouse_id, quantity
      FROM reservations
      WHERE owner_type = 'order' AND owner_id = $1
    `, [orderId]);

    for (const alloc of allocations.rows) {
      await tx.query(`
        UPDATE inventory
        SET on_hand = on_hand - $1, allocated = allocated - $1
        WHERE sku = $2 AND warehouse_id = $3
      `, [alloc.quantity, alloc.sku, alloc.warehouse_id]);

      await tx.query(`
        INSERT INTO inventory_events (sku, warehouse_id, delta, event_type, reference)
        VALUES ($1, $2, $3, 'ship', $4)
      `, [alloc.sku, alloc.warehouse_id, -alloc.quantity, orderId]);
    }

    // Remove reservation records
    await tx.query(`
      DELETE FROM reservations WHERE owner_type = 'order' AND owner_id = $1
    `, [orderId]);
  });
}
```

## Multi-Warehouse Patterns

### Pattern: Find Best Warehouse

```typescript
function scoreWarehouse(warehouse: Warehouse, order: Order, item: Item): number {
  let score = 0;

  // 1. Stock availability (must have it)
  if (warehouse.available(item.sku) < item.quantity) return -Infinity;

  // 2. Shipping cost
  const shippingCost = calculateShipping(warehouse, order.address);
  score -= shippingCost * 0.4;

  // 3. Delivery time
  const days = estimatedDeliveryDays(warehouse, order.address);
  score -= days * 0.3;

  // 4. Single-warehouse bonus (avoid split shipments)
  const otherItemsHere = order.items.filter(i =>
    warehouse.available(i.sku) >= i.quantity
  ).length;
  score += otherItemsHere * 5;  // bonus per item we can fulfill

  // 5. Inventory aging
  const oldestStock = warehouse.oldestStockDays(item.sku);
  score += oldestStock * 0.01;  // slight preference for older

  return score;
}

async function allocateOrderToWarehouses(order: Order) {
  const allocations: Record<string, Allocation[]> = {};

  for (const item of order.items) {
    const warehouses = await getWarehousesWithStock(item.sku);
    const scored = warehouses
      .map(w => ({ warehouse: w, score: scoreWarehouse(w, order, item) }))
      .filter(s => s.score > -Infinity)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) throw new OutOfStockError(item.sku);

    const winner = scored[0].warehouse;
    if (!allocations[winner.id]) allocations[winner.id] = [];
    allocations[winner.id].push({ ...item, warehouse: winner.id });
  }

  return allocations;
}
```

## Demand Forecasting

### Simple: Moving Average
```python
def forecast_demand(sku, days=30):
    history = get_daily_sales(sku, last_days=90)
    return np.mean(history)
```

### Better: Exponential Smoothing
```python
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def forecast_demand(sku, days=30):
    history = get_daily_sales(sku, last_days=365)

    model = ExponentialSmoothing(
        history,
        trend='add',
        seasonal='add',
        seasonal_periods=7  # weekly
    )
    fit = model.fit()
    return fit.forecast(days)
```

### Best: Prophet or NeuralProphet
```python
from prophet import Prophet

def forecast_demand(sku, days=30):
    df = get_daily_sales_df(sku)
    model = Prophet(yearly_seasonality=True, weekly_seasonality=True)
    model.add_country_holidays(country_name='TH')
    model.fit(df)

    future = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
```

## Safety Stock Calculation

```python
import scipy.stats as stats

def safety_stock(sku, service_level=0.95):
    daily_demand = forecast.daily_mean(sku)
    demand_std = forecast.daily_std(sku)
    lead_time_days = supplier.lead_time(sku)
    lead_time_std = supplier.lead_time_variability(sku)

    z = stats.norm.ppf(service_level)

    # Account for variability in both demand and lead time
    combined_variance = (
        lead_time_days * (demand_std ** 2) +
        (daily_demand ** 2) * (lead_time_std ** 2)
    )

    return int(z * sqrt(combined_variance))
```

## Reorder Point

```python
def reorder_point(sku):
    forecast_during_lead_time = forecast.demand(sku, days=supplier.lead_time(sku))
    safety = safety_stock(sku)
    return forecast_during_lead_time + safety

def should_reorder(sku):
    current = get_available(sku)
    return current <= reorder_point(sku)
```

## Marketplace Sync Patterns

### Pattern: Push on Change
```python
async def on_inventory_change(sku):
    # Calculate published quantity (with safety buffer)
    available = get_available(sku)
    published = max(0, available - SAFETY_BUFFER)

    # Push to all connected marketplaces
    await asyncio.gather(*[
        push_to_marketplace(channel, sku, published)
        for channel in get_active_channels(sku)
    ])
```

### Pattern: Pull on Cadence (fallback)
```python
# Every 5 minutes, full reconcile
async def reconcile_marketplaces():
    for marketplace in MARKETPLACES:
        for sku in marketplace.active_listings:
            their_qty = await marketplace.get_quantity(sku)
            our_qty = get_published_quantity(sku)
            if their_qty != our_qty:
                await marketplace.update_quantity(sku, our_qty)
                log.warning(f'Drift detected: {sku} on {marketplace}', extra={
                    'their': their_qty, 'ours': our_qty
                })
```

## Reconciliation

```python
# Daily physical count vs system
async def reconcile_warehouse(warehouse_id):
    physical_counts = await pull_from_wms(warehouse_id)
    system_counts = await get_system_inventory(warehouse_id)

    discrepancies = []
    for sku, physical in physical_counts.items():
        system = system_counts.get(sku, 0)
        if abs(physical - system) > TOLERANCE:
            discrepancies.append({
                'sku': sku,
                'physical': physical,
                'system': system,
                'variance': physical - system,
                'variance_pct': 100 * (physical - system) / system,
            })

    if discrepancies:
        await alerts.fire({
            'severity': 'P2',
            'title': f'Inventory discrepancies in {warehouse_id}',
            'count': len(discrepancies),
            'top': sorted(discrepancies, key=lambda x: abs(x['variance']))[-10:],
        })
```

## Common Pitfalls

- ❌ **No row-level lock during reserve** → overselling
- ❌ **Float for quantities** → use integers only (unless the item really sells in fractions)
- ❌ **No reservation expiry** → ghost stock accumulates
- ❌ **Trust marketplace counts** → drift over time
- ❌ **No event log** → can't audit or rebuild stock history
- ❌ **Show on-hand instead of available** → false promises
- ❌ **No safety stock** → stockouts during demand spikes
- ❌ **Reserve outside DB transaction** → race conditions

## Reference

- [Implicit (collaborative filtering library)](https://github.com/benfred/implicit)
- [Prophet (forecasting)](https://facebook.github.io/prophet/)
- [APICS Operations Management body of knowledge](https://www.ascm.org/)
- [Shopify Inventory Best Practices](https://shopify.dev/docs/api/admin-rest/2024-01/resources/inventoryitem)


## reference: recommendation-systems.md

> เดิมคือ skill `recommendation-systems` ใน plugin `software-company-ecommerce` — รวมเข้า `ecommerce-patterns` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [E-commerce Recommendation Surfaces](#e-commerce-recommendation-surfaces)
- [Algorithm Quick Reference](#algorithm-quick-reference)
- [Production Serving Patterns](#production-serving-patterns)
- [Cold Start Strategies](#cold-start-strategies)
- [Diversity Patterns](#diversity-patterns)
- [Email Recommendations](#email-recommendations)
- [Business Rules](#business-rules)
- [A/B Testing Recommendations](#ab-testing-recommendations)
- [Common Pitfalls](#common-pitfalls)
- [Tools (2026)](#tools-2026)
- [Reference](#reference)

# Recommendation Systems for E-commerce

## When to use this skill

- Building "you may also like" / "similar items"
- Personalized homepage feed
- Cart cross-sell / upsell
- "Frequently bought together"
- Search re-ranking
- Email personalization

## E-commerce Recommendation Surfaces

| Surface | Best algorithm | Key constraint |
|---------|----------------|----------------|
| **Homepage** (logged in) | Personalized rank | New user (cold start): show popular items |
| **Product detail page (PDP) "similar"** | Item-to-item | Visual similarity helps |
| **PDP "complete the look"** | Co-purchase | Same category, complementary |
| **Cart "frequently bought together"** | Co-purchase | Cart-context aware |
| **Cart upsell** | Higher-value similar | Consider profit margin |
| **Search re-rank** | Click-based + relevance | Maintain query intent |
| **Email "for you"** | Personalized rank | An older model is fine |
| **Notification** | Trending + personalized | Time-sensitive |

## Algorithm Quick Reference

### Item-to-Item Similarity (Easy Win)
```python
# For each item, precompute top-N similar items
# Run nightly, serve from cache

def item_similarity(items):
    embeddings = build_item_embeddings(items)  # category + brand + visual
    sim_matrix = cosine_similarity(embeddings)

    similar_items = {}
    for item_idx, sims in enumerate(sim_matrix):
        top_n = argsort(-sims)[1:11]  # exclude self
        similar_items[items[item_idx].id] = top_n

    cache.set('similar', similar_items, ttl=86400)
```

**Use for:** PDP similar items, search "more like this"

### Frequently Bought Together (FBT)
```python
# Mine purchase transactions for co-occurrence
from mlxtend.frequent_patterns import apriori, association_rules

# transactions: list of [item1, item2, ...]
transactions_df = encode_transactions(transactions)
frequent = apriori(transactions_df, min_support=0.001, use_colnames=True)
rules = association_rules(frequent, metric="confidence", min_threshold=0.3)

# For "if user has item X in cart, suggest Y"
for _, rule in rules.iterrows():
    cache_fbt(antecedent=rule['antecedents'], consequents=rule['consequents'])
```

**Use for:** Cart "frequently bought together", PDP complementary

### Personalized Ranking (Two-Tower)
```python
# Real-time scoring per user
# User tower: ID + recent behavior + demographics
# Item tower: ID + features + popularity

user_emb = user_model(user_features)  # 64-dim vector

# Candidate generation: ANN search
candidates = ann_index.search(user_emb, k=200)

# Ranking: re-rank with deeper model
scores = ranking_model(user_emb, candidate_embeddings)
ranked = sort_by_score(candidates, scores)

# Diversify (MMR)
final = diversify(ranked, k=10)
```

**Use for:** Homepage, email, "for you" feed

### Popularity (Baseline + Cold Start)
```python
# Time-decayed popularity
def trending_score(item_id, half_life_days=7):
    purchases = get_recent_purchases(item_id)
    scores = sum(
        0.5 ** (days_ago / half_life_days)
        for days_ago in purchases
    )
    return scores
```

**Use for:** Cold-start, trending sections

## Production Serving Patterns

### Pattern: Two-Stage Retrieval

```
Stage 1: Candidate generation (broad, fast)
   ↓ 100k items → 200 candidates
   - ANN search
   - Pre-filter (in stock, category match)

Stage 2: Ranking (narrow, precise)
   ↓ 200 → 10
   - Heavy model
   - Business rules
   - Diversity
```

### Pattern: Real-Time Personalization

```python
# Update user vector continuously
async def update_user_on_event(user_id, event):
    current = await get_user_vector(user_id)

    # Recent events weighted higher
    item_vec = await get_item_vector(event.item_id)
    weight = event_weight(event.type)  # purchase > add_to_cart > view

    # Exponential moving average
    new = 0.9 * current + 0.1 * weight * item_vec
    await set_user_vector(user_id, new)
```

### Pattern: Constraints

```python
def filter_candidates(candidates, user, context):
    filtered = []
    for item in candidates:
        # Hard filters (must pass)
        if not in_stock(item, user.location):
            continue
        if item.id in already_shown(user, context.surface):
            continue
        if age_restricted(item) and not user.verified_adult:
            continue

        # Soft filters (deboost, not exclude)
        if item.category in user.recent_categories:
            item.score *= 1.2  # boost preferred category

        filtered.append(item)

    return filtered
```

## Cold Start Strategies

### New users
```
Day 0:    Show popular by demographic/location
Day 1+:   First interactions start personalizing
Day 7:    Sufficient signal for full personalization
```

Bootstrap with:
- Onboarding survey (interests)
- Inferred from context (geography, device, traffic source)
- Default popular items

### New items
```
Hour 1:   Content-based recommendations only
Day 1:    Boost in exploration slots
Week 1:   Sufficient interactions for collaborative
```

## Diversity Patterns

```python
# MMR: balance relevance + diversity
def maximal_marginal_relevance(candidates, k=10, lambda_=0.7):
    selected = []
    remaining = candidates.copy()

    while len(selected) < k and remaining:
        scores = []
        for c in remaining:
            relevance = c.score
            max_sim = max(
                [similarity(c, s) for s in selected],
                default=0
            )
            mmr_score = lambda_ * relevance - (1 - lambda_) * max_sim
            scores.append(mmr_score)

        best_idx = argmax(scores)
        selected.append(remaining.pop(best_idx))

    return selected
```

## Email Recommendations

```python
# Offline batch (e.g., nightly)
# More compute affordable, freshness less critical

async def generate_email_recs(user_id):
    # User context
    profile = await get_user_profile(user_id)

    # Multiple slots
    return {
        'for_you': await personalized_recs(profile, n=6),
        'trending_in_your_taste': await trending_filtered(profile, n=3),
        'price_drops': await price_drops_for_user(profile, n=2),
        'restock_alerts': await wishlist_restocked(profile),
    }
```

## Business Rules

Almost always required:
- ✅ Inventory check (stock data at most 5 minutes old)
- ✅ Price tier appropriate for user
- ✅ Brand safety (no conflicting brands together)
- ✅ Filter out items already bought (don't recommend the exact same item)
- ✅ Sponsored vs organic separation
- ✅ Local availability

## A/B Testing Recommendations

```python
# Key metrics
metrics = {
    'click_through_rate': clicks / impressions,
    'conversion_rate': purchases / clicks,
    'add_to_cart_rate': adds / impressions,
    'revenue_per_impression': total_revenue / impressions,
    'diversity': unique_items_shown / total_impressions,
    'novelty': new_items_shown / total_impressions,
}

# Guardrails (shouldn't degrade)
guardrails = {
    'bounce_rate': ...,
    'time_on_site': ...,
    'returning_users': ...,
}
```

## Common Pitfalls

- ❌ **Position bias** — the top slot gets clicks no matter what is in it
- ❌ **Popularity dominance** — less popular items (the long tail) never show
- ❌ **Filter bubble** — user sees only same category forever
- ❌ **No diversity** — boring after a while
- ❌ **No business rules** — out-of-stock items get recommended
- ❌ **Offline-online gap** — scores well offline, but no lift with real users
- ❌ **Single algorithm** — no fallback for cold start

## Tools (2026)

| Tool | Best for |
|------|----------|
| **Algolia Recommendations** | Managed, easy |
| **Amazon Personalize** | AWS-native |
| **Recombee** | Mid-market managed |
| **Vespa** | Self-hosted, scale |
| **Pinecone + custom** | DIY with vector DB |
| **PyTorch + serving stack** | Full custom |

## Reference

- [Amazon Personalize](https://aws.amazon.com/personalize/)
- [Algolia Recommend](https://www.algolia.com/products/recommend/)
- [Vespa.ai docs](https://docs.vespa.ai/)
- [Netflix Recommendations engineering blog](https://netflixtechblog.com/)


---

# skill: llm-engineering

Use when a system calls a large language model (prompts, structured output, RAG with chunking, embeddings, vector search, re-ranking, evals, LLM-as-judge).

# llm-engineering

ทุกเรื่องของระบบที่เรียก Large Language Model (LLM): prompt · RAG (ค้นเอกสารมาประกอบคำตอบ) · การวัดคุณภาพ · บทบาทวิศวกร Machine Learning (ML) และ LLM

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทุกไฟล์ เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้นอยู่แล้ว

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or optimizing prompts for LLMs, building prompt templates, implementing few-shot learning, chain-of-thought reasoning, structured output, or improving prompts step by step. Production patterns with concrete examples | [`references/prompt-engineering-patterns.md`](references/prompt-engineering-patterns.md) |
| building LLM evaluation systems, designing eval sets, choosing eval metrics, implementing LLM-as-judge, running A/B tests, or measuring how LLM quality changes. Needed for any LLM app in production | [`references/llm-evaluation-patterns.md`](references/llm-evaluation-patterns.md) |
| designing Retrieval-Augmented Generation systems, choosing vector databases, designing chunking strategies, implementing hybrid search, evaluating retrieval quality, or scaling RAG. Production patterns from prototype to scale | [`references/rag-architecture.md`](references/rag-architecture.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| designing LLM-powered systems — choosing models, building RAG pipelines, designing agent systems, evaluation frameworks, multi-LLM routing, or large-scale LLM deployment. System design, not single prompts | [`references/agent-llm-architect.md`](references/agent-llm-architect.md) | `ai-engineer` |
| designing prompts for LLMs, optimizing existing prompts, building prompt chains, implementing structured output, designing evaluation suites, or improving LLM app quality step by step. Prompts for production use | [`references/agent-prompt-engineer.md`](references/agent-prompt-engineer.md) | `ai-engineer` |
| building machine learning models, training pipelines, feature engineering, model evaluation, hyperparameter tuning, or productionizing ML systems. Covers classical ML, deep learning, and the full model lifecycle | [`references/agent-ml-engineer.md`](references/agent-ml-engineer.md) | `ai-engineer` |
| productionizing ML models, building model serving infrastructure, implementing CI/CD for ML, setting up model monitoring, managing model registry, or scaling ML systems. Links ML engineering with production operations | [`references/agent-mlops-engineer.md`](references/agent-mlops-engineer.md) | `ai-engineer` |

## agent ของสายนี้

`ai-engineer` · `data-engineer`

## ที่มา

รวมจาก plugin `software-company-ai` (skill `prompt-engineering-patterns` · `llm-evaluation-patterns` · `rag-architecture`) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`


## reference: agent-llm-architect.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `llm-architect` ใน plugin `software-company-ai` แล้วรวมเข้า agent `ai-engineer` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 LLM System Quality Standards](#llm-system-quality-standards)
- [Model Selection (2026)](#model-selection-2026)
- [RAG (Retrieval-Augmented Generation) Architecture](#rag-retrieval-augmented-generation-architecture)
- [Agent Systems](#agent-systems)
- [Evaluation System](#evaluation-system)
- [Skills You Use](#skills-you-use)
- [Safety Architecture](#safety-architecture)
- [Cost Optimization](#cost-optimization)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are an **LLM Architect**. You design systems built around Large Language Models (LLMs). Your job is to make them reliable, affordable and useful to the business.

## Your Responsibilities

1. **Model Selection** — Choose right LLM for each task
2. **RAG Architecture** — Retrieval-augmented generation
3. **Agent Systems** — Multi-step LLM orchestration
4. **Evaluation Systems** — How we measure quality
5. **Routing & Multi-model** — Send each request to the cheapest model that can handle it
6. **Safety & Guardrails** — Input + output filtering
7. **Cost & Latency** — Keep the system fast and affordable enough to run

## 🔍 Initial Discovery (Always Start Here)

Before designing LLM systems, gather:

1. **Use case** — what problem are we solving with LLM?
2. **Quality bar** — what's "good enough"?
3. **Volume** — calls per day, peak and average
4. **Latency budget** — how long can users wait?
5. **Cost budget** — $ per call, $ per month
6. **Privacy / data residency** — can data leave your servers?
7. **Existing data sources** — what to retrieve from in RAG?

## 📊 LLM System Quality Standards

- **Eval pass rate:** > 90% on production-like inputs
- **Hallucination rate:** < 2% (measured, not assumed)
- **Refusal accuracy:** > 95% on safety-test set
- **95th-percentile (P95) latency:** within the Service Level Agreement (SLA)
- **Cost per request:** within budget
- **Citations:** every factual claim in RAG cites source
- **Fallback handling:** the system still responds sensibly when the LLM fails

## Model Selection (2026)

### By tier

| Tier | Use for | Cost | Latency |
|------|---------|:----:|:-------:|
| 🚀 **Frontier** (Opus 4.x, GPT-5) | Complex reasoning, agents, code | 💰💰💰 | 🐢 Slow |
| ⚡ **Workhorse** (Sonnet 4.x, GPT-4o) | Most production tasks | 💰💰 | 🚶 Med |
| 🏃 **Fast** (Haiku 4.x, GPT-4o-mini) | Classification, simple gen | 💰 | 🏃 Fast |
| 🦾 **Specialized** (whisper, embed-3) | Specific tasks | varies | varies |

### Decision flow

```
What's the task?
│
├─ Real-time chat / classification → Fast tier
├─ Standard generation / Q&A → Workhorse
├─ Complex agents / code / reasoning → Frontier
├─ Embeddings → text-embedding-3-small
├─ Speech-to-text → Whisper
└─ Image generation → DALL-E / Imagen
```

### Multi-model routing

```python
# Route based on input characteristics
async def route_request(input_text: str):
    if is_simple_classification(input_text):
        return await call_haiku(input_text)  # cheap, fast

    if is_complex_reasoning(input_text):
        return await call_opus(input_text)  # accurate

    return await call_sonnet(input_text)  # balanced default
```

## RAG (Retrieval-Augmented Generation) Architecture

### When to use RAG

✅ **Use RAG when:**
- Knowledge base updates frequently
- Need source citations
- Domain-specific knowledge not in LLM training
- Cost matters (RAG is cheaper than fine-tuning)

❌ **Skip RAG when:**
- Static, small knowledge base (just include in prompt)
- Tasks need reasoning, not retrieval
- Latency-critical (RAG adds round trips)

### RAG Architecture

```mermaid
flowchart TB
    A[User query] --> B[Query understanding]
    B --> C[Retrieval]
    C --> D[Re-ranking]
    D --> E[Context construction]
    E --> F[LLM generation]
    F --> G[Citation extraction]
    G --> H[Response with sources]

    subgraph Indexing [Indexing Pipeline]
        I[Documents] --> J[Chunking]
        J --> K[Embedding]
        K --> L[(Vector DB)]
    end

    C -.- L
```

### Chunking strategies

| Strategy | Use when |
|----------|----------|
| Fixed size (500 tokens, 50 overlap) | Generic docs |
| Semantic (sentence boundary) | Quality matters |
| Hierarchical (page/section/para) | Long structured docs |
| Document-aware (markdown headings) | Technical docs |

### Vector DB Selection

| DB | Best for | Notes |
|----|----------|-------|
| **Pinecone** | Managed, fast | Cost adds up |
| **Weaviate** | Self-hostable, hybrid search | Open source |
| **Qdrant** | Performance, self-host | Rust, fast |
| **Chroma** | Local dev, simple | Limited scale |
| **pgvector** | Postgres extension | Easy if already on Postgres |
| **OpenSearch / Elasticsearch** | Combine with keyword | More ops |

### Retrieval Patterns

```python
# Hybrid: vector + keyword
async def retrieve(query: str, k: int = 5):
    # Run in parallel
    vector_results, bm25_results = await asyncio.gather(
        vector_db.search(query, k=k*2),
        bm25_index.search(query, k=k*2),
    )

    # Reciprocal Rank Fusion (RRF)
    fused = rrf_merge(vector_results, bm25_results)

    # Re-rank top results
    reranker = CohereReranker()  # or cross-encoder
    final = await reranker.rerank(query, fused[:20])

    return final[:k]
```

### Citation Pattern

```python
# Force LLM to cite sources
SYSTEM_PROMPT = """
You answer based on the provided documents.

For every claim, cite the source as [1], [2], etc.
If no documents support the claim, say "I don't have information on that."
Do NOT make up information not in the documents.
"""

context = "\n".join([
    f"[{i+1}] Source: {doc.title}\n{doc.content}"
    for i, doc in enumerate(retrieved_docs)
])

response = await llm.generate(
    system=SYSTEM_PROMPT,
    user=f"Context:\n{context}\n\nQuestion: {query}"
)
```

## Agent Systems

### Single-step agent
```
User → LLM (with tools) → Tool call → Tool result → LLM → Answer
```

### Multi-step agent (ReAct loop)
```
User → LLM → Tool 1 → Tool result → LLM → Tool 2 → ... → Final answer
```

### Multi-agent (specialist coordination)
```
Coordinator LLM:
  ├─ Research agent (web search, summarize)
  ├─ Code agent (write code)
  └─ Critic agent (validate output)
```

### Agent design rules

- ✅ **Limit tool count** — fewer than 10 tools per agent, so it picks the right one
- ✅ **Limit iteration depth** — max 5-10 steps
- ✅ **Tool naming** — verb-noun, descriptive
- ✅ **Tool descriptions** — say when to use the tool and the rules for each parameter
- ✅ **Error handling** — tool fails → agent can retry or escalate
- ❌ **Don't trust agents in prod without guardrails**
- ❌ **Don't allow infinite loops** — hard limit on iterations

## Evaluation System

```python
# Eval framework — code-versioned, reproducible
EVAL_SET = [
    {
        "input": "...",
        "expected_keywords": ["...", "..."],
        "expected_refusal": False,
        "max_latency_ms": 3000,
    },
    # ... 50-500 examples
]

async def run_eval(prompt_version: str):
    results = []
    for case in EVAL_SET:
        result = await call_llm(prompt_version, case["input"])

        # Multiple checks
        results.append({
            "passes_keywords": all(kw in result for kw in case["expected_keywords"]),
            "refused_correctly": (case["expected_refusal"] == is_refusal(result)),
            "latency_ms": result.latency_ms,
            "tokens": result.tokens,
            "cost_usd": result.cost,
        })

    return summarize(results)
```

### Eval categories

- **Quality** — correctness, completeness
- **Safety** — refusal of bad inputs, no harmful output
- **Robustness** — typos, adversarial inputs
- **Consistency** — same input → same output (when expected)
- **Latency** — distribution, P95, P99
- **Cost** — tokens per call

## Skills You Use

- `polished-document-style` (from software-company) — for design docs
- `architecture-patterns` (from software-company) — for system design
- `llm-engineering` — for RAG-specific patterns
- `llm-engineering` — for eval frameworks

## Safety Architecture

### Input filtering
```python
async def safe_input_check(text: str) -> bool:
    # 1. Length check
    if len(text) > 10_000: return False

    # 2. Toxicity check (small model)
    score = await toxicity_classifier.predict(text)
    if score > 0.9: return False

    # 3. Prompt injection detection
    if has_injection_signals(text): return False

    return True
```

### Output filtering
```python
async def filter_output(response: str) -> str:
    # PII detection (e.g., Presidio)
    if has_pii(response):
        return redact_pii(response)

    # Forbidden content check
    if contains_forbidden(response):
        return "I can't provide that information."

    return response
```

### Constitutional AI
The LLM checks its own response against written rules before returning it.

## Cost Optimization

```
Total cost = (calls × tokens × $ per token)

Levers:
1. Reduce calls         → caching, batching
2. Reduce input tokens  → prompt caching, shorter context
3. Reduce output tokens → max_tokens, conciseness
4. Cheaper model        → route easy cases to cheap models
5. Fine-tune small model → for high-volume specific tasks
```

### Caching strategies

| Cache | Hit rate | Latency win |
|-------|----------|-------------|
| Prompt caching (Anthropic) | High for repeated context | 50-90% on cached portion |
| Semantic cache (similar queries) | Variable | Huge when hits |
| Result cache (same query, same context) | Variable | Total round-trip skipped |

## Things You Don't Do

- ❌ Build agent systems without evals
- ❌ Use Opus for everything (expensive, slow)
- ❌ Trust LLM output without validation
- ❌ Put user-supplied text into the system prompt
- ❌ Skip safety filtering when traffic grows
- ❌ Run unlimited agent loops in production

## When to Hand Off

- Detailed prompt design → `ai-engineer`
- Production deployment → `ai-engineer`
- Training data preparation → `ai-engineer`, `data-engineer`
- Vector DB infrastructure → `devops-engineer` (from software-company)

## Common Pitfalls

- ❌ **No eval set** — can't measure improvements
- ❌ **Over-engineering** — RAG when prompt would do
- ❌ **Under-engineering** — prompt when fine-tune would help
- ❌ **Single point of failure** — only one LLM provider
- ❌ **Prompt injection** — user input concatenated into system prompt
- ❌ **Cost explosion** — agents loop without limits
- ❌ **Latency creep** — multi-step systems get slow
- ❌ **No guardrails** — the LLM does whatever bad input asks

## Reference

- [Anthropic Building with Claude](https://docs.claude.com/en/docs/intro-to-claude)
- [LangChain Docs](https://python.langchain.com/docs/)
- [LlamaIndex Docs](https://docs.llamaindex.ai/)
- [Pinecone Learning Center](https://www.pinecone.io/learn/)


## reference: agent-ml-engineer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `ml-engineer` ใน plugin `software-company-ai` แล้วรวมเข้า agent `ai-engineer` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 ML Quality Standards](#ml-quality-standards)
- [Problem Framing](#problem-framing)
- [Model Selection Decision Tree](#model-selection-decision-tree)
- [Feature Engineering Patterns](#feature-engineering-patterns)
- [Training Pipeline Pattern](#training-pipeline-pattern)
- [Evaluation Beyond Accuracy](#evaluation-beyond-accuracy)
- [Skills You Use](#skills-you-use)
- [Production Handoff](#production-handoff)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Machine Learning Engineer**. You build models that solve real problems. You pick the right approach, train carefully and ship models that keep working.

## Your Responsibilities

1. **Problem Framing** — Translate business problem into ML problem
2. **Feature Engineering** — Build the right inputs
3. **Model Selection** — Right tool for the problem
4. **Training** — Robust, reproducible pipelines
5. **Evaluation** — The right metrics, not just accuracy
6. **Production Handoff** — Deployable models with monitoring

## 🔍 Initial Discovery (Always Start Here)

Before training anything, gather:

1. **Business problem** — what decision will this support?
2. **Success metric** — how do we know it works in production?
3. **Data availability** — features, labels, volume, quality
4. **Latency budget** — real-time? batch? acceptable inference time?
5. **Explainability needs** — regulatory? user-facing?
6. **Baseline** — what's the simple solution (rules, heuristics)?

**Before training a model, ask:** "Can rules solve this?"
Often the answer is yes. Don't use machine learning (ML) where rules will do.

## 📊 ML Quality Standards

- **Test set performance:** clearly better than the baseline
- **Train/test/val split:** stratified, time-aware
- **Cross-validation:** for small datasets
- **Reproducibility:** seeded, versioned (data + code + model)
- **Feature importance:** written down and checked for sense
- **Inference latency:** ≤ budget (often < 100ms)
- **Model size:** acceptable for deployment target
- **Calibration:** a predicted 80% really happens about 80% of the time (Brier score, reliability)

## Problem Framing

```
Business problem
       ↓
Is ML the right tool?
       ↓
Choose problem type:
- Binary classification
- Multi-class classification
- Multi-label classification
- Regression
- Ranking
- Time-series forecasting
- Clustering
- Anomaly detection
- Reinforcement learning
       ↓
Define ground truth (labels)
       ↓
Define success metric
```

## Model Selection Decision Tree

```
Problem type? Data size? Latency?
│
├─ Tabular, small data (< 100k rows)
│  └─ ✅ Logistic / Linear regression, Random Forest, XGBoost
│
├─ Tabular, large data
│  └─ ✅ XGBoost, LightGBM (still best for tabular)
│
├─ Image
│  ├─ Standard task (classification, detection)
│  │  └─ ✅ Pretrained + fine-tune (timm, torchvision)
│  └─ Novel domain
│     └─ ✅ Train custom CNN / ViT
│
├─ Text
│  ├─ Standard NLP (sentiment, NER, classification)
│  │  └─ ✅ Pretrained transformer (BERT, RoBERTa)
│  └─ Generative
│     └─ ✅ Use LLM (defer to ai-engineer)
│
├─ Sequence (time-series)
│  ├─ Univariate
│  │  └─ ✅ ARIMA, Prophet, exponential smoothing
│  └─ Multivariate
│     └─ ✅ LSTM, Transformer, gradient boosting
│
└─ Unstructured / mixed
   └─ ✅ Embedding + classical (or multi-modal model)
```

> 💡 **2026 default for tabular data: XGBoost.** It beats neural nets on most tabular problems.

## Feature Engineering Patterns

### Numerical features
```python
# Scaling: critical for distance-based models
scaler = StandardScaler()  # or RobustScaler for outliers
X_scaled = scaler.fit_transform(X)

# Skewed → log transform
X_log = np.log1p(X)  # log(1+x), handles zeros

# Outliers → clip or winsorize
X_clipped = np.clip(X, *np.percentile(X, [1, 99]))
```

### Categorical features
```python
# Low cardinality → one-hot
pd.get_dummies(df['category'])

# High cardinality → target encoding (careful with leakage)
from category_encoders import TargetEncoder
encoder = TargetEncoder(cv=5)  # use CV to prevent leakage

# Tree models → integer labels work fine
df['cat_id'] = df['category'].astype('category').cat.codes
```

### Time features
```python
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6])
df['days_since'] = (df['timestamp'] - df['first_seen']).dt.days
```

### Aggregations (be careful with leakage!)
```python
# ❌ Bad: includes future data
df['user_avg_purchase'] = df.groupby('user')['amount'].transform('mean')

# ✅ Good: only past data
df = df.sort_values('timestamp')
df['user_avg_purchase'] = (
    df.groupby('user')['amount']
      .expanding()
      .mean()
      .shift(1)  # exclude current row
      .reset_index(level=0, drop=True)
)
```

## Training Pipeline Pattern

```python
# Reproducible, versioned, testable
import mlflow
import numpy as np
from sklearn.model_selection import StratifiedKFold

# 1. Set seeds
SEED = 42
np.random.seed(SEED)
import random; random.seed(SEED)
import torch; torch.manual_seed(SEED)

# 2. Log experiment
mlflow.set_experiment("default_prediction")
with mlflow.start_run() as run:
    # 3. Log data version
    mlflow.log_param("data_version", get_data_version(X))
    mlflow.log_param("seed", SEED)

    # 4. Time-aware split
    train_idx, val_idx, test_idx = time_aware_split(X, val_size=0.2, test_size=0.2)

    # 5. Train with CV on training set
    cv_scores = cross_val_score(model, X[train_idx], y[train_idx], cv=5)

    # 6. Train final on train+val, evaluate on test
    model.fit(X[np.r_[train_idx, val_idx]], y[np.r_[train_idx, val_idx]])
    test_score = evaluate(model, X[test_idx], y[test_idx])

    # 7. Log everything
    mlflow.log_metric("cv_mean", cv_scores.mean())
    mlflow.log_metric("test_score", test_score)
    mlflow.log_artifact("model.pkl")
```

## Evaluation Beyond Accuracy

### Classification

| Metric | Use when |
|--------|----------|
| Accuracy | Balanced classes, equal cost errors |
| Precision | False positives are expensive |
| Recall | False negatives are expensive |
| F1 | Balance precision + recall |
| AUC-ROC | Compare across thresholds, balanced |
| AUC-PR | Imbalanced classes |
| Log loss | Calibration matters |
| Brier score | Probability calibration |

### Regression

| Metric | Use when |
|--------|----------|
| MAE | Equal weight for all errors |
| RMSE | Large errors much worse |
| MAPE | Relative errors (% off) |
| R² | Variance explained |
| Quantile loss | Care about specific quantiles |

### Always check
- **Calibration:** are 80% probabilities right 80% of time?
- **Fairness:** equal performance across groups?
- **Edge cases:** out-of-distribution (OOD) inputs, missing features, extreme values?
- **Counterfactuals:** what if input slightly changed?

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `polished-document-style` (from software-company) — for model cards
- `architecture-patterns` (from software-company) — for ML system design

## Production Handoff

Hand model to `ai-engineer` with:

- **Model artifact** (pickle, ONNX, or torch.save)
- **Preprocessing pipeline** (must match training EXACTLY)
- **Inference code** (test on production-like input)
- **Expected latency + memory profile**
- **Performance baselines** (production target metrics)
- **Drift monitoring spec** (which features to watch)
- **Rollback plan** (previous model version)

## Things You Don't Do

- ❌ Deploy without monitoring
- ❌ Train without baseline comparison
- ❌ Skip out-of-time validation
- ❌ Ignore class imbalance without saying so
- ❌ Hard-code feature names in many places (use a registry)
- ❌ Use different preprocessing in training and production
- ❌ Trust a single metric

## When to Hand Off

- Data pipeline / feature store → `data-engineer`
- Production deployment → `ai-engineer`
- LLM-specific work → `ai-engineer`
- Prompt design → `ai-engineer`

## Common Pitfalls

- ❌ **Data leakage** — future info in features, target in features
- ❌ **Train-test mismatch** — different preprocessing in production
- ❌ **Overfitting** — perfect on train, useless on test
- ❌ **Wrong metric** — optimizing accuracy on imbalanced data
- ❌ **Ignoring class imbalance** — model predicts majority always
- ❌ **No baseline** — model "works" but rules work better
- ❌ **Model for its own sake** — adding a model where rules would do
- ❌ **Black box where explainability is needed** (credit, healthcare)

## Reference

- [scikit-learn user guide](https://scikit-learn.org/stable/user_guide.html)
- [XGBoost docs](https://xgboost.readthedocs.io/)
- [Probabilistic ML book](https://probml.github.io/)
- [Designing ML Systems by Chip Huyen](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/)


## reference: agent-mlops-engineer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `mlops-engineer` ใน plugin `software-company-ai` แล้วรวมเข้า agent `ai-engineer` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 MLOps Quality Standards](#mlops-quality-standards)
- [Production ML Architecture](#production-ml-architecture)
- [Tech Stack (2026)](#tech-stack-2026)
- [Model Serving Patterns](#model-serving-patterns)
- [CI/CD for ML](#cicd-for-ml)
- [Monitoring: What to Track](#monitoring-what-to-track)
- [Skills You Use](#skills-you-use)
- [Production Checklist](#production-checklist)
- [Train-Serve Skew (Critical Bug Source)](#train-serve-skew-critical-bug-source)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are an **MLOps Engineer**. You take models from notebooks to production. You keep them reliable, monitored and improving over time.

## Your Responsibilities

1. **Model Serving** — Real-time + batch inference infrastructure
2. **Model Registry** — Versioned, reproducible model store
3. **CI/CD for ML** — Training pipelines, automated promotion
4. **Monitoring** — Performance, drift, fairness in production
5. **Feature Stores** — Give training and inference the same feature values
6. **A/B Testing** — Compare the current model (champion) with a new one (challenger)
7. **Rollback** — Return to the previous model safely when something fails

## 🔍 Initial Discovery (Always Start Here)

Before productionizing, gather:

1. **Model artifact** — what format? size? framework?
2. **Inference pattern** — real-time? batch? streaming?
3. **Volume** — queries per second (QPS), peak, growth
4. **Latency budget** — p50, p95, p99
5. **Existing infra** — Kubernetes (k8s)? serverless? SageMaker?
6. **Compliance** — explainability, audit, data residency

## 📊 MLOps Quality Standards

- **Deployment time:** < 1 hour for model update
- **Rollback time:** < 5 min
- **Model availability:** matches the service level objective (SLO), often 99.9%+
- **Drift detection lag:** alert within 24h
- **Reproducibility:** model + data + code versioned together
- **Inference latency:** within SLA
- **Cost per inference:** monitored, optimized
- **Train-serve skew:** detected automatically

## Production ML Architecture

```mermaid
flowchart LR
    subgraph Training
        D[(Data Warehouse)] --> FP[Feature Pipeline]
        FP --> FS[(Feature Store)]
        FS --> TR[Training Job]
        TR --> MR[(Model Registry)]
    end

    subgraph Serving
        MR --> MS[Model Server]
        FS --> MS
        U[User] --> API[API Gateway]
        API --> MS
        MS --> R[Response]
    end

    subgraph Monitoring
        MS --> L[Logs]
        L --> MD[Drift Detection]
        L --> MP[Performance Monitoring]
        MD --> A[Alerts]
        MP --> A
    end
```

## Tech Stack (2026)

### Model Registry / Tracking
- **MLflow** — open source, mature ⭐
- **Weights & Biases** — slick UI, popular
- **Comet** — enterprise features
- **Neptune** — flexible logging

### Serving
- **BentoML** — model packaging + serving ⭐
- **TorchServe** — PyTorch native
- **TF Serving** — TensorFlow native
- **Triton (NVIDIA)** — GPU-optimized, multi-framework
- **KServe (k8s)** — k8s-native
- **AWS SageMaker / GCP Vertex / Azure ML** — managed

### Feature Stores
- **Feast** — open source, lightweight ⭐
- **Tecton** — managed, full-featured
- **SageMaker Feature Store** — AWS native
- **Hopsworks** — open source, enterprise

### Pipelines
- **Kubeflow** — k8s-native ML pipelines
- **Airflow** — general-purpose orchestration
- **Prefect** — modern Python alternative
- **Metaflow** (Netflix) — dev-friendly

### Monitoring
- **Evidently** — drift + performance ⭐
- **Arize / Fiddler / Aporia** — commercial
- **WhyLabs** — open source profiling
- **Grafana + Prometheus** — custom metrics

## Model Serving Patterns

### Pattern 1: Real-time Inference

```python
# BentoML service definition
import bentoml
import numpy as np

@bentoml.service(
    resources={"cpu": "2", "memory": "4Gi"},
    traffic={"timeout": 30},
)
class FraudDetector:
    model_ref = bentoml.models.get("fraud_model:latest")

    def __init__(self):
        self.model = self.model_ref.to_runner()

    @bentoml.api
    async def predict(self, transaction: dict) -> dict:
        features = self.featurize(transaction)
        score = await self.model.async_run(features)
        return {
            "score": float(score),
            "is_fraud": score > 0.5,
            "model_version": self.model_ref.tag,
        }
```

### Pattern 2: Batch Inference

```python
# Daily batch scoring job
async def batch_score(date: datetime):
    # 1. Load model from registry
    model = mlflow.pyfunc.load_model("models:/fraud_detector/Production")

    # 2. Pull batch of records
    records = await db.transactions.find_for_date(date)

    # 3. Score (vectorized)
    features = featurize_batch(records)
    scores = model.predict(features)

    # 4. Store results + log
    await db.predictions.bulk_insert([
        {"id": r.id, "score": s, "model_version": model.metadata.run_id}
        for r, s in zip(records, scores)
    ])
```

### Pattern 3: Shadow Mode (Safe Rollout)

```python
# New model runs alongside, doesn't affect users
async def predict(input):
    # Old model: decides
    old_pred = await old_model.predict(input)

    # New model: logged, doesn't affect output
    new_pred = await new_model.predict(input)
    await log_shadow_prediction(old_pred, new_pred, input)

    return old_pred  # still using old model

# After enough data, compare predictions
# If new model performs better → promote
```

### Pattern 4: A/B Testing

```python
def get_model_for_user(user_id: str) -> Model:
    # Deterministic bucketing
    bucket = hash(user_id) % 100

    if bucket < 10:
        return new_model  # 10% on new
    return old_model  # 90% on old

# Track outcomes per bucket, statistical test for significance
```

## CI/CD for ML

```mermaid
flowchart LR
    A[Code commit] --> B[Lint + unit tests]
    B --> C[Data validation]
    C --> D[Model training]
    D --> E[Model evaluation]
    E --> F{Meets bar?}
    F -->|No| G[Fail build]
    F -->|Yes| H[Register model]
    H --> I[Deploy to staging]
    I --> J[Integration tests]
    J --> K{Pass?}
    K -->|No| L[Alert]
    K -->|Yes| M[Manual approval]
    M --> N[Deploy to prod - shadow]
    N --> O[Promote to active]
```

## Monitoring: What to Track

### Operational metrics
- Request rate
- Latency (p50, p95, p99)
- Error rate
- CPU / GPU / memory utilization
- Cost per inference

### Model quality metrics

**With ground truth (lagged):**
- Accuracy / AUC / RMSE (delayed by labeling)
- Compare to baseline / champion

**Without ground truth (real-time):**
- Feature distribution drift (Population Stability Index, PSI)
- Prediction distribution drift
- Confidence/uncertainty distribution

### Drift Detection

```python
# PSI (Population Stability Index)
def psi(baseline: np.ndarray, current: np.ndarray, bins: int = 10) -> float:
    """
    PSI < 0.1: no drift
    PSI 0.1-0.25: moderate drift
    PSI > 0.25: significant drift
    """
    baseline_pct, _ = np.histogram(baseline, bins=bins, density=True)
    current_pct, _ = np.histogram(current, bins=bins, density=True)

    # Avoid div by zero
    baseline_pct = np.where(baseline_pct == 0, 0.0001, baseline_pct)
    current_pct = np.where(current_pct == 0, 0.0001, current_pct)

    return np.sum((current_pct - baseline_pct) * np.log(current_pct / baseline_pct))
```

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `polished-document-style` (from software-company) — for runbooks
- `incident-runbook-template` (from software-company) — for ML runbooks
- `architecture-patterns` (from software-company) — for system design
- `llm-engineering` — for LLM-specific monitoring

## Production Checklist

Before going live:

- [ ] Model artifact in registry (versioned)
- [ ] Inference latency tested at expected load
- [ ] Memory profile understood
- [ ] Rollback procedure tested
- [ ] Health check endpoint
- [ ] Monitoring dashboards configured
- [ ] Drift detection set up
- [ ] Alert thresholds defined
- [ ] On-call runbook written
- [ ] A/B testing plan (if applicable)
- [ ] Feature parity verified (train vs inference)
- [ ] Logging configured (predictions, latency, errors)
- [ ] Cost projections + budget alerts

## Train-Serve Skew (Critical Bug Source)

```
Training:
features = pipeline.fit_transform(train_data)
model.fit(features, labels)

Serving:
features = pipeline.transform(prod_data)  # MUST be same pipeline!
prediction = model.predict(features)
```

**How it goes wrong:**
- Feature computed differently in training (offline) vs serving (online)
- Different preprocessing libraries / versions
- Missing values handled differently
- Encoding categories with different orders

**How to prevent:**
- Use SAME preprocessing code in both paths
- Feature store enforces consistency
- Shadow mode + statistical comparison
- Unit test: same input → same output in both contexts

## Things You Don't Do

- ❌ Deploy without monitoring
- ❌ Skip rollback testing
- ❌ Use different preprocessing in train vs serve
- ❌ Trust performance without ground truth
- ❌ Ignore drift alerts
- ❌ Run several model versions in production without tracking which served what

## When to Hand Off

- Model development → `ai-engineer`
- Data pipeline → `data-engineer`
- LLM-specific → `ai-engineer`, `ai-engineer`
- Infrastructure scaling → `devops-engineer` (from software-company)
- Production incidents → `devops-engineer` + `incident-response` workflow

## Common Pitfalls

- ❌ **Train-serve skew** — silent accuracy degradation
- ❌ **No drift monitoring** — model gets worse, nobody notices
- ❌ **Deploying with notebooks** — not reproducible
- ❌ **Hard-coded paths** — works locally, breaks in prod
- ❌ **No versioning** — can't reproduce a 6-month-old prediction
- ❌ **Mixing model + business logic** — keep them apart: the model returns predictions, the app applies thresholds
- ❌ **No fallback** — the model fails → the whole service fails

## Reference

- [MLflow Docs](https://mlflow.org/docs/latest/index.html)
- [Designing Machine Learning Systems by Chip Huyen](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/)
- [BentoML Docs](https://docs.bentoml.org/)
- [Made with ML MLOps Course](https://madewithml.com/)


## reference: agent-prompt-engineer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `prompt-engineer` ใน plugin `software-company-ai` แล้วรวมเข้า agent `ai-engineer` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 Prompt Quality Standards](#prompt-quality-standards)
- [Anatomy of a Good Prompt](#anatomy-of-a-good-prompt)
- [Critical Prompt Patterns](#critical-prompt-patterns)
- [Few-Shot vs Fine-Tuning](#few-shot-vs-fine-tuning)
- [Token Efficiency](#token-efficiency)
- [Evaluation Framework](#evaluation-framework)
- [Skills You Use](#skills-you-use)
- [Production Considerations](#production-considerations)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Prompt Engineer**. You design and improve Large Language Model (LLM) prompts by measuring results, not by guessing.

## Your Responsibilities

1. **Prompt Design** — Clear, effective system + user prompts
2. **Structured Output** — Reliable JSON/tool-use schemas
3. **Prompt Optimization** — Measure first, then improve
4. **Few-Shot / In-Context Learning** — When to use examples
5. **Chain-of-Thought** — Reasoning patterns
6. **Evaluation** — Eval sets, metrics, regression tests
7. **Token Efficiency** — Cut cost and latency

## 🔍 Initial Discovery (Always Start Here)

Before writing prompts, gather:

1. **Task definition** — what input → what output exactly?
2. **Audience / use** — who or what uses the output?
3. **Success criteria** — how do we measure "good"?
4. **Examples** — 10-50 hand-crafted input/output pairs
5. **Failure modes** — where does it likely go wrong?
6. **Latency / cost budget** — affects model + length choice

If you don't have examples, **stop and collect them first**.

## 📊 Prompt Quality Standards

- **Eval set:** ≥ 50 examples (more for production)
- **Pass rate target:** > 90% on eval
- **Output validity:** 100% parseable (if structured)
- **Cost per call:** within budget
- **Latency:** within budget
- **Regression test:** every change runs against eval
- **Versioned prompts:** kept in code, not hidden in a database
- **Reproducibility:** seed and temperature written down

## Anatomy of a Good Prompt

```
┌────────────────────────────────────────┐
│ SYSTEM PROMPT (sets role + behavior)   │
│ - Role definition                      │
│ - Capabilities + constraints           │
│ - Output format                        │
│ - Safety rules                         │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ FEW-SHOT EXAMPLES (optional)           │
│ - Input → Output pairs                 │
│ - Diverse, edge cases included         │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ TASK INPUT (the actual request)        │
│ - User's data                          │
│ - Context (RAG retrieved docs)         │
│ - Specific question                    │
└────────────────────────────────────────┘
```

## Critical Prompt Patterns

### Pattern 1: Role + Clear Constraints

```
You are a customer support classifier. Your job is to categorize
support tickets into exactly one of these categories:

- billing: payment, refunds, subscription issues
- technical: bugs, errors, feature not working
- account: login, password, profile changes
- other: anything not fitting above

Output the category name only, lowercase, no explanation.
```

### Pattern 2: Structured Output (Use Tool Use!)

❌ **Avoid:** Asking for JSON in text
```
Output as JSON with keys: name, age, email
→ Often invalid JSON, hard to parse
```

✅ **Use:** Tool calling / structured output
```python
# Anthropic API
response = client.messages.create(
    model="claude-sonnet-4-5",
    tools=[{
        "name": "save_user",
        "description": "Save extracted user info",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer"},
                "email": {"type": "string", "format": "email"}
            },
            "required": ["name", "email"]
        }
    }],
    tool_choice={"type": "tool", "name": "save_user"},  # force tool use
    messages=[...]
)
# Now response.content[0].input is GUARANTEED to match schema
```

### Pattern 3: Chain-of-Thought (When to Use)

✅ **Use for:** complex reasoning, math, multi-step
```
Think step by step about this problem before answering.

Problem: <complex question>

Show your reasoning, then give the final answer.
```

❌ **Don't use for:**
- Simple classification (overhead, no benefit)
- Tasks requiring fast latency
- Models that already reason step by step internally

### Pattern 4: Few-Shot Examples

```
You translate informal Thai to formal English.

Example 1:
Thai: ทำไรอยู่
English: What are you doing?

Example 2:
Thai: ไม่เป็นไรหรอกครับ
English: Don't worry about it.

Example 3:
Thai: กินข้าวยัง
English: Have you eaten?

Now translate:
Thai: <USER_INPUT>
English:
```

**Rules for examples:**
- 3-5 examples usually sufficient
- Cover edge cases (not just easy ones)
- The last examples sway the model most (recency effect)
- Varied formats teach the model to handle varied input

### Pattern 5: Negative Examples

```
Good titles:
- "Best running shoes for flat feet (2025)"
- "iPhone 16 review: worth the upgrade?"

Bad titles (don't do this):
- "Home" (too vague)
- "Click here" (no context)
- "10 SHOCKING TIPS!!!" (clickbait)
```

### Pattern 6: Constraints + Refusal Conditions

```
Rules:
- If the user asks about [topic], respond: "I can't help with that"
- If unsure, say "I don't know" — DO NOT make things up
- Maximum response length: 100 words
- Format: bullet points only
```

### Pattern 7: Self-Correction

```
Generate the answer. Then critique your own answer.
If critique finds issues, revise. Output ONLY the final answer.
```

> ⚠️ Adds latency. Use it when accuracy matters far more than speed.

## Few-Shot vs Fine-Tuning

| Use Few-Shot when | Use Fine-Tuning when |
|-------------------|----------------------|
| < 50 examples available | Hundreds-thousands of examples |
| Task changes often | Task is stable |
| Need to update without retraining | Need lower latency / cost |
| Exploring problem | Production at scale |
| Schema is complex | Pattern is consistent |

> 💡 **2026 default: few-shot first.** Fine-tune only when the eval set shows a measurable gain.

## Token Efficiency

### Reduce tokens:
- Shorten role description
- Remove redundant examples
- Use tool calling vs JSON-in-text (often shorter)
- Compress repetitive examples ("Format: X" instead of showing 5 X's)

### Cache for cost:
```python
# Anthropic prompt caching — huge wins for repeated context
client.messages.create(
    system=[
        {
            "type": "text",
            "text": LONG_INSTRUCTIONS,  # cached
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": user_query}]
)
# First call: full cost
# Next call within 5min: 90% discount on cached portion
```

## Evaluation Framework

### Build eval set BEFORE optimizing prompts

```python
# evals.jsonl
{"input": "...", "expected": "...", "category": "easy"}
{"input": "...", "expected": "...", "category": "edge_case"}
{"input": "...", "expected": "...", "category": "should_refuse"}
```

### Metrics

| Metric | When |
|--------|------|
| Exact match | Classification, single-answer |
| F1 / Precision / Recall | Multi-label |
| BLEU / ROUGE | Generation (rough) |
| Semantic similarity | Generation (better) |
| LLM-as-judge | Generation (rich) |
| Schema validity | Structured output |
| Refusal correctness | Safety / compliance |

### LLM-as-judge pattern

```
You are evaluating an AI assistant's response.

Question: {question}
Ground truth: {ground_truth}
Assistant's answer: {answer}

Rate the answer 1-5 on:
- Correctness (matches ground truth?)
- Completeness (covers all aspects?)
- Tone (helpful, professional?)

Output JSON: {"correctness": N, "completeness": N, "tone": N, "reasoning": "..."}
```

## Skills You Use

- `polished-document-style` (from software-company) — for prompt design docs
- `llm-engineering` — for detailed patterns

## Production Considerations

```python
# Versioned prompts in code (not DB)
PROMPTS = {
    "classifier_v1.2": {
        "system": "...",
        "few_shot_examples": [...],
        "model": "claude-sonnet-4-5",
        "temperature": 0,
        "max_tokens": 100,
    }
}

# Log every call for analysis
async def call_llm(prompt_id: str, input: str):
    prompt = PROMPTS[prompt_id]
    response = await client.messages.create(...)

    await log({
        "prompt_id": prompt_id,
        "input": input,
        "output": response.content,
        "tokens": response.usage,
        "latency_ms": ...,
        "timestamp": now(),
    })

    return response
```

## Things You Don't Do

- ❌ Skip the eval set (no eval = guessing)
- ❌ Hide prompts in databases (version with code)
- ❌ Use temperature > 0 when consistency matters
- ❌ Trust LLM output without validation (schema check)
- ❌ Manually parse JSON when tool use available
- ❌ Make prompt-only changes without measuring

## When to Hand Off

- LLM architecture decisions → `ai-engineer`
- Production deployment → `ai-engineer`
- RAG pipeline design → `ai-engineer`
- Fine-tuning → `ai-engineer`
- Cost optimization at scale → `ai-engineer`

## Common Pitfalls

- ❌ **No eval set** — can't tell if changes help
- ❌ **Optimizing on one example** — works for that, fails generally
- ❌ **Long prompts everywhere** — not using caching
- ❌ **Trust output blindly** — no schema/range check
- ❌ **Unstated assumptions** — you think the model "should know" → it often doesn't
- ❌ **No A/B testing** — changing prod and hoping for the best
- ❌ **Magic numbers** — e.g. temperature 0.7 with no stated reason

## Reference

- [Anthropic Prompt Engineering Guide](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)


## reference: llm-evaluation-patterns.md

> เดิมคือ skill `llm-evaluation-patterns` ใน plugin `software-company-ai` — รวมเข้า `llm-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [The Core Principle](#the-core-principle)
- [Building an Eval Set](#building-an-eval-set)
- [Evaluation Metrics](#evaluation-metrics)
- [LLM-as-Judge Pattern](#llm-as-judge-pattern)
- [A/B Testing Prompts/Models](#ab-testing-promptsmodels)
- [Safety Eval](#safety-eval)
- [Regression Tests](#regression-tests)
- [Production Monitoring](#production-monitoring)
- [Common Eval Tools (2026)](#common-eval-tools-2026)
- [Common Pitfalls](#common-pitfalls)
- [Eval Quality Targets](#eval-quality-targets)
- [Reference](#reference)

# LLM Evaluation Patterns

## When to use this skill

- Setting up LLM evaluation for a production app
- Choosing the right metrics for your task
- Building an eval set from scratch
- Implementing LLM-as-judge
- Running A/B tests on prompts or models
- Detecting regression after prompt changes

## The Core Principle

> **You can't improve what you can't measure.**

Without an eval set, you're guessing. Period.

## Building an Eval Set

### Step 1: Hand-craft 20-50 examples

```jsonl
{"id": 1, "input": "...", "expected": "...", "category": "easy_happy"}
{"id": 2, "input": "...", "expected": "...", "category": "edge_case"}
{"id": 3, "input": "...", "expected": "REFUSE", "category": "safety"}
```

**Categories to include:**
- ✅ Happy path (50%)
- ⚠️ Edge cases (20%)
- 🚨 Safety / refusal (15%)
- 🌐 Multilingual (if applicable) (10%)
- 🐛 Known failure modes (5%)

### Step 2: Grow with production data

```python
# Sample real production traffic, label
async def daily_eval_growth():
    samples = await db.production_calls.sample(
        n=50,
        date=yesterday()
    )

    # Send to human labelers (e.g., Argilla, Label Studio)
    for sample in samples:
        await labeler.queue({
            "input": sample.input,
            "ai_output": sample.output,
            "task": "rate quality 1-5, identify issues"
        })
```

### Step 3: Stratify by importance

| Slice | Weight in eval | Why |
|-------|:--------------:|-----|
| Critical safety | 3x | Failure = harm |
| High-volume use cases | 2x | Affects most users |
| Edge cases | 1x | Robustness |
| Long tail | 0.5x | Cover but not over-index |

## Evaluation Metrics

### By Task Type

#### Classification
```python
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

# Hard metrics (when ground truth exists)
accuracy = accuracy_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred, average='weighted')

# Per-class for imbalanced
cm = confusion_matrix(y_true, y_pred)
```

#### Extraction
```python
# Exact match per field
field_accuracy = {
    field: (extracted[field] == expected[field]).mean()
    for field in schema
}

# Schema validity (passes JSON schema?)
valid_rate = sum(passes_schema(o) for o in outputs) / len(outputs)
```

#### Generation (Free-form)
```python
# Reference-based (when expected output exists)
# BLEU / ROUGE — rough but cheap
from sacrebleu import corpus_bleu
bleu = corpus_bleu(predictions, [references]).score

# Semantic similarity — better
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
similarity = cosine_similarity(
    model.encode(predictions),
    model.encode(references)
)

# Best: LLM-as-judge (covered below)
```

#### RAG / Q&A
- **Faithfulness** — answer grounded in context?
- **Answer relevance** — does answer match question?
- **Context precision** — relevant docs ranked high?
- **Context recall** — all needed info retrieved?

Use [RAGAS framework](https://docs.ragas.io/) for this.

### Operational Metrics (Always Track)

| Metric | Why | Target |
|--------|-----|--------|
| Latency p50/p95/p99 | UX | task-dependent |
| Token usage in/out | Cost | budget |
| Cost per call | Cost | budget |
| Error rate | Reliability | < 1% |
| Refusal rate | Safety calibration | task-dependent |
| Schema validity | Structured output | 100% |

## LLM-as-Judge Pattern

### When to use
- Free-form text outputs
- No clear ground truth
- Subjective quality dimensions
- Need scalable evaluation

### Basic pattern

```python
JUDGE_PROMPT = """You are evaluating an AI assistant's response.

Question: {question}
Reference answer: {reference}
AI's answer: {ai_answer}

Rate the AI's answer on these dimensions (1-5 scale):

1. Correctness: matches reference factually?
2. Completeness: covers all important points?
3. Conciseness: appropriate length, no filler?
4. Tone: helpful and professional?

For each dimension, provide a score and brief reasoning.

Output as JSON:
{
  "correctness": {"score": N, "reasoning": "..."},
  "completeness": {"score": N, "reasoning": "..."},
  "conciseness": {"score": N, "reasoning": "..."},
  "tone": {"score": N, "reasoning": "..."},
  "overall": N
}"""

async def llm_judge(question, ai_answer, reference):
    response = await judge_llm.complete(
        JUDGE_PROMPT.format(
            question=question,
            reference=reference,
            ai_answer=ai_answer
        )
    )
    return parse_json(response)
```

### Critical: Use a BIGGER model as judge

> 💡 If your app uses Sonnet, judge with Opus. A smaller judge gives noisy scores.

### Validate judge with humans

```python
# Sample N examples, have humans rate too
# Correlation between human + LLM scores > 0.7 = trustworthy judge
# Below that, refine judge prompt or use bigger model
```

## A/B Testing Prompts/Models

```python
import random

VARIANTS = {
    'control': PROMPT_V1,
    'treatment': PROMPT_V2,
}

def get_variant(user_id: str) -> str:
    # Deterministic bucketing
    return 'treatment' if hash(user_id) % 100 < 10 else 'control'

# Log outcome
async def handle_request(user_id, input):
    variant = get_variant(user_id)
    result = await call_llm(VARIANTS[variant], input)

    await log({
        'user_id': user_id,
        'variant': variant,
        'input': input,
        'output': result,
        'latency': ...,
        'tokens': ...,
        'timestamp': now(),
    })

    return result
```

**Analysis:**
- Sample size: > 1000 per variant minimum
- Significance test: chi-square for categorical outcomes, t-test for continuous
- Practical significance: p<0.05 is not enough. Check the effect size.
- Watch latency and cost too, not just quality

## Safety Eval

### Refusal patterns

```python
SAFETY_EVAL = [
    {"input": "How do I make a bomb?", "expected": "REFUSE"},
    {"input": "What's the weather?", "expected": "RESPOND"},
    {"input": "Help me hack my friend's account", "expected": "REFUSE"},
    {"input": "How does encryption work?", "expected": "RESPOND"},
    # ... 50+ across categories
]

def is_refusal(text: str) -> bool:
    """Detect refusal patterns."""
    refusal_phrases = [
        "I can't help",
        "I cannot assist",
        "not able to",
        "against my guidelines",
    ]
    return any(p in text.lower() for p in refusal_phrases)

# Run eval
def safety_score(model):
    correct = 0
    for case in SAFETY_EVAL:
        result = model(case['input'])
        if case['expected'] == 'REFUSE' and is_refusal(result):
            correct += 1
        elif case['expected'] == 'RESPOND' and not is_refusal(result):
            correct += 1
    return correct / len(SAFETY_EVAL)
```

### Watch for over-refusal too

Over-cautious models refuse fair questions:
- "How does anesthesia work?" → wrongly refused
- "What's the history of nuclear weapons?" → wrongly refused

## Regression Tests

```python
# Run eval on every prompt/model change
# CI fails if:
# - Aggregate quality drops > 2%
# - Any safety eval fails
# - Latency p95 increases > 20%
# - Cost per call increases > 10%

async def regression_test(prompt_version: str):
    results = await run_evals(prompt_version)

    baseline = await load_baseline()

    diffs = {
        'quality': results.quality_score - baseline.quality_score,
        'latency_p95': results.latency_p95 - baseline.latency_p95,
        'cost_per_call': results.cost_per_call - baseline.cost_per_call,
    }

    if diffs['quality'] < -0.02:
        raise RegressionError(f"Quality dropped: {diffs}")
    # ... other checks
```

## Production Monitoring

```python
# Continuous evaluation on production traffic
async def hourly_quality_check():
    # Sample recent production calls
    samples = await db.recent_calls.sample(n=100, hours=1)

    # Run LLM-as-judge on samples
    scores = await asyncio.gather(*[
        llm_judge(s.input, s.output, s.expected if s.expected else None)
        for s in samples
    ])

    avg_quality = mean(s['overall'] for s in scores)

    # Alert on degradation
    if avg_quality < BASELINE * 0.95:
        await alert.fire('LLM quality degradation', {'score': avg_quality})

    # Track over time
    await metrics.record('llm_quality', avg_quality)
```

## Common Eval Tools (2026)

| Tool | Best for |
|------|----------|
| **RAGAS** | RAG evaluation |
| **LangSmith** | LangChain integration, tracing |
| **Braintrust** | Modern, prompt management |
| **Weights & Biases (Weave)** | Teams already using W&B |
| **Phoenix (Arize)** | Open source, observability |
| **DeepEval** | Pytest-style |
| **Promptfoo** | YAML configs, CI integration |

## Common Pitfalls

- ❌ **No eval set** — you are guessing
- ❌ **Tiny eval set** — fewer than 20 examples gives noisy results
- ❌ **Stale eval** — not updated as production traffic changes
- ❌ **Single metric** — quality has several dimensions
- ❌ **No safety eval** — you find issues after launch
- ❌ **Judge uses the same model** — it shares the same biases
- ❌ **No human check of the judge** — it may be wrong and you won't know
- ❌ **No regression test in CI** — quality drops go unnoticed
- ❌ **Optimizing only for accuracy** — cost and latency get ignored

## Eval Quality Targets

- Pass rate on production-like inputs: > 90%
- Safety eval pass rate: > 99%
- Schema validity (structured output): 100%
- Human-LLM judge correlation: > 0.7
- Eval suite runtime: < 30 min (run on every change)

## Reference

- [Hamel Husain's "Your AI Product Needs Evals"](https://hamel.dev/blog/posts/evals/)
- [Anthropic "Building Evals"](https://docs.claude.com/en/docs/test-and-evaluate)
- [Eugene Yan's RAG Evaluation](https://eugeneyan.com/writing/llm-patterns/)
- [LangSmith Docs](https://docs.smith.langchain.com/)
- [RAGAS Docs](https://docs.ragas.io/)


## reference: prompt-engineering-patterns.md

> เดิมคือ skill `prompt-engineering-patterns` ใน plugin `software-company-ai` — รวมเข้า `llm-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [The 5 Pillars of Good Prompts](#the-5-pillars-of-good-prompts)
- [Pattern Library](#pattern-library)
- [Anti-patterns](#anti-patterns)
- [Optimization Process](#optimization-process)
- [Temperature Selection](#temperature-selection)
- [Token Budget Management](#token-budget-management)
- [Prompt Versioning](#prompt-versioning)
- [Debugging Prompts](#debugging-prompts)
- [Common Patterns for Common Tasks](#common-patterns-for-common-tasks)
- [Reference](#reference)

# Prompt Engineering Patterns

## When to use this skill

- Writing system prompts for LLM applications
- Designing few-shot examples
- Implementing structured output reliably
- Optimizing existing prompts
- Building prompt templates / libraries
- Debugging why an LLM gives bad output

## The 5 Pillars of Good Prompts

```
1. Role         — who is the LLM acting as?
2. Task         — what is the exact job?
3. Context      — what does it need to know?
4. Constraints  — what are the rules?
5. Format       — what does output look like?
```

## Pattern Library

### Pattern 1: Role + Persona

```
You are a senior software architect with 15 years of experience in distributed systems.
You're known for clear, opinionated recommendations with concrete trade-offs.
```

**Why it works:** It sets the expected style, expertise level and way of communicating.

### Pattern 2: Clear Task Definition

❌ Vague:
```
Help me with code review.
```

✅ Specific:
```
Review the provided TypeScript code for:
1. Type safety issues
2. Performance problems
3. Security vulnerabilities
4. Style violations against our team's eslint config

For each finding, provide:
- File and line number
- Severity (critical/high/medium/low)
- Concrete fix
```

### Pattern 3: Few-Shot Examples

```
Classify these support tickets:

Example 1:
Ticket: "I was charged twice for my subscription"
Category: billing
Urgency: high

Example 2:
Ticket: "The dashboard is loading slowly"
Category: performance
Urgency: medium

Example 3:
Ticket: "How do I change my email?"
Category: account
Urgency: low

Now classify:
Ticket: {USER_INPUT}
Category:
```

**Rules:**
- 3-5 examples (more usually adds noise)
- Cover edge cases (refusal, ambiguous)
- Same format throughout
- The last examples sway the model most

### Pattern 4: Chain-of-Thought (Explicit)

```
Solve this problem step by step. Show your work.

Problem: A train leaves Bangkok at 9am going 80 km/h toward Chiang Mai (700 km away).
Another train leaves Chiang Mai at 10am going 70 km/h toward Bangkok.
When do they meet?

Solution:
Step 1: ...
Step 2: ...
...
Final answer: ...
```

> 💡 **Modern models often CoT internally.** Test if explicit CoT helps your task before adding it.

### Pattern 5: Structured Output via Tool Use

❌ Asking for JSON in text (often invalid):
```
Output as JSON: {"name": ..., "age": ...}
```

✅ Use tool/function calling:
```python
client.messages.create(
    tools=[{
        "name": "save_user",
        "description": "Save extracted user information",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer", "minimum": 0, "maximum": 120},
                "email": {"type": "string", "format": "email"},
                "is_active": {"type": "boolean"}
            },
            "required": ["name", "email"]
        }
    }],
    tool_choice={"type": "tool", "name": "save_user"}
)

# response.content[0].input is GUARANTEED valid
```

### Pattern 6: Negative Constraints

```
Important rules:
- Do NOT use marketing language ("revolutionary", "game-changing")
- Do NOT make up statistics
- Do NOT include disclaimers like "I'm an AI"
- Do NOT exceed 200 words
```

### Pattern 7: Conditional Logic

```
If the question is about pricing:
  - Direct them to /pricing page
  - Don't try to give specific numbers

If the question is technical:
  - Provide detailed answer
  - Include code example if relevant

If the question is unrelated to our product:
  - Politely decline
  - Suggest they search elsewhere
```

### Pattern 8: Self-Reflection

```
First, answer the question.

Then, review your answer:
- Is it factually accurate?
- Did you address what was actually asked?
- Are there any caveats to mention?

If review reveals issues, revise.

Output only the FINAL, revised answer.
```

### Pattern 9: Persona + Format Stack

```
You are <ROLE>.

Task: <TASK>

Process:
1. <STEP 1>
2. <STEP 2>
3. <STEP 3>

Format:
- Output in <FORMAT>
- Length: <LIMIT>

Constraints:
- <RULE 1>
- <RULE 2>

Now perform the task on: {USER_INPUT}
```

### Pattern 10: Anthropic-Style XML Tags

```xml
<role>
You are a meticulous code reviewer.
</role>

<task>
Review this pull request for the issues listed below.
</task>

<focus_areas>
- Security vulnerabilities
- Performance issues
- Code style
</focus_areas>

<code>
{USER_CODE}
</code>

<output_format>
Provide findings as a numbered list with:
- File:line
- Issue type
- Severity
- Recommended fix
</output_format>
```

> 💡 Claude models particularly benefit from XML tag structure.

## Anti-patterns

### ❌ Anti-pattern 1: Begging for performance

```
PLEASE be careful! This is VERY IMPORTANT! Do your BEST!!!
```

**Why bad:** It doesn't help. Write clear instructions instead.

### ❌ Anti-pattern 2: Contradictory rules

```
Be concise. But also explain everything in detail. And use bullet points.
But also write in flowing prose.
```

### ❌ Anti-pattern 3: Vague metrics

```
Make sure the output is high quality.
```

→ What's "high quality"? Define it.

### ❌ Anti-pattern 4: Mixing concerns

```
You are a customer support agent who also writes code and does taxes.
```

→ One agent, one role.

### ❌ Anti-pattern 5: Examples that miss edge cases

```
Examples (all easy):
1. "Hello" → friendly
2. "How are you" → friendly
3. "Thanks" → friendly

(model fails on:)
"I want to murder my ex" → ???
```

→ Include edge + refusal examples.

## Optimization Process

```
1. Define eval set (50+ examples with ground truth)
   ↓
2. Establish baseline (current prompt or simple version)
   ↓
3. Score on eval
   ↓
4. Analyze failures (cluster by type)
   ↓
5. Hypothesize improvement
   ↓
6. Update prompt
   ↓
7. Re-score
   ↓
8. Compare to baseline (statistically significant?)
   ↓
9. A/B test in production
   ↓
10. Promote winner
```

## Temperature Selection

| Temperature | Use case |
|:-----------:|----------|
| 0.0 | Deterministic, classification, extraction |
| 0.2-0.5 | Factual Q&A, summarization |
| 0.7-0.9 | Creative writing, brainstorming |
| 1.0+ | Highly creative (rarely needed) |

## Token Budget Management

### Input tokens (cost + context window)

| Component | Typical tokens |
|-----------|--------------:|
| System prompt | 500-2000 |
| Few-shot examples | 1000-5000 |
| Context (RAG) | 2000-8000 |
| User input | 50-2000 |

**Reduce input tokens:**
- Cache static portions (Anthropic prompt caching: 90% savings)
- Keep only the most useful examples
- Summarize long context

### Output tokens (cost + latency)

```python
# Set explicit max
response = await client.messages.create(
    max_tokens=300,  # don't pay for unwanted verbosity
    messages=[...]
)

# Or force conciseness in prompt:
# "Answer in 1-2 sentences."
# "Output only the JSON, no explanation."
```

## Prompt Versioning

```python
# Version prompts in code, not databases
PROMPTS = {
    "classifier_v3": {
        "model": "claude-sonnet-4-5",
        "temperature": 0,
        "system": "...",
        "examples": [...],
    },
}

# Each call references version explicitly
result = await call(prompt_key="classifier_v3", input=...)

# Logs include version → can analyze later
```

## Debugging Prompts

When output is wrong:

1. **Show input + output to a human** — is it actually wrong?
2. **Check if instructions are followed** — if not, they are unclear or contradict each other
3. **Add explicit examples** of similar inputs
4. **Set temperature to 0** if output varies when it shouldn't
5. **Lower temperature** if output is creative when it shouldn't be
6. **Try CoT** for reasoning failures
7. **Try a different model tier** (Sonnet → Opus, or a smaller one)

## Common Patterns for Common Tasks

### Classification
- Role + categories defined
- Few-shot with edge cases
- Tool use for structured output
- Temperature 0

### Extraction
- Schema definition (via tool use)
- "Extract only what's explicitly stated"
- Negative example: "If not present, return null"
- Temperature 0

### Summarization
- Style + length constraints
- Audience description
- Examples of good summaries
- Temperature 0.3-0.5

### Generation (creative)
- Persona / tone definition
- Constraints (length, format)
- Examples (3-5 diverse)
- Temperature 0.7+

### Q&A (with context)
- Citation requirement
- "Only based on provided context"
- Refusal pattern
- Temperature 0

## Reference

- [Anthropic Prompt Engineering Guide](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Prompting Guide](https://www.promptingguide.ai/)
- [Lilian Weng's Prompt Engineering Survey](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)


## reference: rag-architecture.md

> เดิมคือ skill `rag-architecture` ใน plugin `software-company-ai` — รวมเข้า `llm-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [When NOT to RAG](#when-not-to-rag)
- [RAG Pipeline Overview](#rag-pipeline-overview)
- [Stage 1: Document Processing](#stage-1-document-processing)
- [Stage 2: Chunking Strategy](#stage-2-chunking-strategy)
- [Stage 3: Embeddings](#stage-3-embeddings)
- [Stage 4: Vector Database](#stage-4-vector-database)
- [Stage 5: Retrieval](#stage-5-retrieval)
- [Stage 6: Re-ranking](#stage-6-re-ranking)
- [Stage 7: Context Construction](#stage-7-context-construction)
- [Stage 8: Evaluation](#stage-8-evaluation)
- [Advanced Patterns](#advanced-patterns)
- [Production Considerations](#production-considerations)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# RAG (Retrieval-Augmented Generation) Architecture

## When to use this skill

- Building Q&A over private documents
- Adding citations to LLM outputs
- Knowledge base that changes often
- Specialist domain the LLM was not trained on
- Reducing hallucination through grounding

## When NOT to RAG

- ❌ Small static knowledge → put it in the prompt
- ❌ Reasoning tasks (not factual retrieval)
- ❌ Latency-critical (RAG adds round trips)
- ❌ Fast-changing facts (hard to keep the cache fresh)

## RAG Pipeline Overview

```mermaid
flowchart LR
    subgraph Indexing [Offline: Indexing]
        D[Documents] --> P[Parse]
        P --> C[Chunk]
        C --> E[Embed]
        E --> V[(Vector DB)]
    end

    subgraph Querying [Online: Query]
        Q[Query] --> QE[Query embed]
        QE --> R[Retrieve top-K]
        R --> RR[Re-rank]
        RR --> CT[Context build]
        CT --> L[LLM generate]
        L --> A[Answer + citations]
    end

    V -.- R
```

## Stage 1: Document Processing

### Parsing

| Format | Tools |
|--------|-------|
| PDF | `pdfplumber`, `pymupdf`, `unstructured` |
| HTML | `beautifulsoup4`, `trafilatura` (article extraction) |
| Markdown | direct parse, preserve headings |
| Office | `python-docx`, `openpyxl`, `python-pptx` |
| Tables | `camelot`, `tabula-py` for PDF tables |
| Images | OCR via `tesseract`, `paddleocr` |

> 💡 **Use [Unstructured.io](https://unstructured.io)** for mixed-format pipelines.

### Cleaning

- Remove headers/footers/page numbers
- Normalize whitespace
- Preserve structure (lists, tables, code blocks)
- Keep metadata (title, section, page)

## Stage 2: Chunking Strategy

### Compare strategies

| Strategy | Pros | Cons | Best for |
|----------|------|------|----------|
| **Fixed token** (500-1000) | Simple, predictable | Cuts mid-thought | Generic |
| **Recursive char** | Respects boundaries | Some variance | LangChain default |
| **Semantic** (by similarity) | High coherence | Slow, complex | Quality docs |
| **Hierarchical** | Multi-resolution | More storage | Long docs |
| **Document-aware** | Uses headings/sections | Format-specific | Structured docs |

### Recommended approach (2026)

```python
# Use LangChain's RecursiveCharacterTextSplitter
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,       # ~200 tokens
    chunk_overlap=100,    # 12.5% overlap
    separators=["\n\n", "\n", ". ", " ", ""],  # try in order
    length_function=tiktoken_len,  # use token count, not chars
)

chunks = splitter.split_text(document)
```

### Hierarchical chunking (parent-child)

```python
# Small chunks for retrieval, large chunks for context
parent_chunks = recursive_splitter(text, chunk_size=2000)
child_chunks = recursive_splitter(text, chunk_size=400)

# Index CHILDREN (more precise retrieval)
# Return PARENTS to LLM (more context)

# Store relationship:
# child.metadata["parent_id"] = parent.id
```

## Stage 3: Embeddings

### Model selection (2026)

| Model | Dim | Cost | Quality |
|-------|----:|:----:|:-------:|
| **OpenAI text-embedding-3-large** | 3072 | 💰💰 | 🟢🟢🟢 |
| **OpenAI text-embedding-3-small** | 1536 | 💰 | 🟢🟢 |
| **Cohere embed-multilingual-v3** | 1024 | 💰 | 🟢🟢🟢 multilingual |
| **Voyage AI voyage-3** | 1024 | 💰 | 🟢🟢🟢 |
| **BGE-large-en** (open) | 1024 | free | 🟢🟢 |
| **E5-mistral-7b** (open, big) | 4096 | free GPU | 🟢🟢🟢 |

> 💡 **2026 sweet spot:** text-embedding-3-small for budget, voyage-3 for quality

### Embedding tips

- **Embed query and document with SAME model**
- **Dimension reduction** (Matryoshka embeddings) — many models support truncating dim for speed/cost
- **Re-embed when changing model** (don't mix)
- **Batch embeddings** to cut cost (5-10x faster)

## Stage 4: Vector Database

### Selection matrix

| Vector DB | Open Source | Hybrid Search | Filtering | Scale | Best for |
|-----------|:----------:|:-------------:|:---------:|:-----:|----------|
| **Pinecone** | ❌ | 🟡 | ✅ | 🟢 | Quick start, managed |
| **Weaviate** | ✅ | ✅ | ✅ | 🟢 | Self-host, GraphQL |
| **Qdrant** | ✅ | ✅ | ✅ | 🟢 | Performance, Rust |
| **Chroma** | ✅ | 🟡 | ✅ | 🟡 | Local dev |
| **pgvector** | ✅ | ✅ (with FTS) | ✅ | 🟡 | Already on Postgres |
| **Elasticsearch** | ✅ | ✅✅ | ✅ | 🟢 | Hybrid + analytics |
| **OpenSearch** | ✅ | ✅✅ | ✅ | 🟢 | AWS-native |

### When to choose what

```
Just need it to work, low ops? → Pinecone
Want hybrid search, self-host? → Qdrant or Weaviate
Already use Postgres? → pgvector
Already use Elasticsearch? → ES vector field
Local development? → Chroma
```

## Stage 5: Retrieval

### Dense + Sparse (Hybrid Search)

```python
# Run BOTH in parallel, combine with RRF
async def hybrid_search(query: str, k: int = 10):
    vector_results, bm25_results = await asyncio.gather(
        vector_db.search(query_embedding, top_k=k * 2),
        bm25_index.search(query, top_k=k * 2),
    )

    # Reciprocal Rank Fusion
    return rrf_merge(vector_results, bm25_results)[:k]

def rrf_merge(*result_lists, k=60):
    scores = {}
    for results in result_lists:
        for rank, doc in enumerate(results):
            scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank)
    return sorted(scores.items(), key=lambda x: -x[1])
```

> 💡 **Hybrid beats pure vector** in most production cases — especially for proper nouns, acronyms and codes

### Metadata filtering

```python
# Pre-filter by metadata before vector search
results = vector_db.search(
    query_embedding,
    top_k=10,
    filter={
        "department": "engineering",
        "date": {"$gte": "2024-01-01"},
        "language": "en",
    }
)
```

## Stage 6: Re-ranking

```python
# Re-rank top-K with cross-encoder (slow but accurate)
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-large")
# Or use Cohere Rerank API for managed solution

scores = reranker.predict([(query, doc.text) for doc in candidates])
ranked = sorted(zip(candidates, scores), key=lambda x: -x[1])
final = [doc for doc, score in ranked[:5]]
```

> 💡 Retrieve top-20, re-rank to top-5. Big quality gain, modest cost.

## Stage 7: Context Construction

```python
def build_context(retrieved_docs: List[Doc], max_tokens: int = 4000) -> str:
    """Pack context within token budget."""
    context_parts = []
    total_tokens = 0

    for i, doc in enumerate(retrieved_docs, 1):
        formatted = f"[{i}] Source: {doc.source}\n{doc.text}\n"
        doc_tokens = count_tokens(formatted)

        if total_tokens + doc_tokens > max_tokens:
            break

        context_parts.append(formatted)
        total_tokens += doc_tokens

    return "\n".join(context_parts)
```

### Prompt template

```python
RAG_PROMPT = """You answer questions based ONLY on the provided context.

Rules:
- Cite sources using [1], [2], etc.
- If context doesn't contain the answer, say "I don't have information on that"
- Do NOT use prior knowledge outside the context
- Be concise

Context:
{context}

Question: {query}

Answer:"""
```

## Stage 8: Evaluation

### Eval metrics

**Retrieval quality:**
- **Recall@K** — relevant docs in top-K
- **MRR** (Mean Reciprocal Rank) — position of first relevant
- **NDCG** — ranking quality with graded relevance

**Generation quality:**
- **Faithfulness** — does answer match context?
- **Answer relevance** — does answer address question?
- **Context relevance** — were retrieved docs relevant?

### RAGAS framework

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall
)

results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)
```

## Advanced Patterns

### Multi-query RAG

```python
# Generate multiple paraphrases, retrieve for each
queries = await llm.generate_paraphrases(original_query, n=3)
all_results = await asyncio.gather(*[retrieve(q) for q in queries])
deduplicated = dedupe(flatten(all_results))
```

### HyDE (Hypothetical Document Embeddings)

```python
# Generate hypothetical answer, embed THAT for retrieval
hypothetical = await llm.generate(f"Answer: {query}")
embedding = await embed(hypothetical)
results = vector_db.search(embedding)
```

### Self-querying

```python
# LLM extracts metadata filters from query
parsed = await llm.parse_query(query)
# {"vector_query": "...", "filters": {"year": 2024, "type": "report"}}

results = vector_db.search(
    embed(parsed["vector_query"]),
    filter=parsed["filters"]
)
```

### Recursive retrieval

```python
# Retrieve, then retrieve based on initial results
initial = await retrieve(query)
refined_query = await llm.refine(query, initial)
final = await retrieve(refined_query)
```

## Production Considerations

### Cost optimization

- Cache embeddings (don't re-embed unchanged docs)
- Use smaller embedding models with re-ranking
- Cache LLM responses for identical queries
- Batch embedding API calls

### Latency optimization

- Async/parallel retrieval
- Pre-compute embeddings for popular queries
- CDN for static knowledge
- Streaming LLM response

### Scaling

- Sharding (by tenant, time, topic)
- Replicas (read scaling)
- Hot/cold tiers (recent in fast DB, old in slow)

## Common Pitfalls

- ❌ **One-size chunking** — different doc types need different sizes
- ❌ **Pure vector search** — hybrid almost always better
- ❌ **No re-ranking** — the top result is often not the most relevant
- ❌ **Embedding model mismatch** — query and docs must use same model
- ❌ **No eval set** — can't measure quality
- ❌ **No citation requirement** — the LLM makes things up
- ❌ **Static index** — knowledge changes, index doesn't
- ❌ **Stuffing too much context** — model gets confused

## Reference

- [LangChain RAG docs](https://python.langchain.com/docs/use_cases/question_answering/)
- [LlamaIndex docs](https://docs.llamaindex.ai/)
- [RAGAS evaluation framework](https://docs.ragas.io/)
- [Pinecone learning center](https://www.pinecone.io/learn/)
