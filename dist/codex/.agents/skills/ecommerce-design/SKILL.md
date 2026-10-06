---
name: "ecommerce-design"
description: "Audit a checkout flow or design a recommendation system for e-commerce. Two modes — checkout-audit or recommendation-design."
---

Two modes. Read the first word of **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `checkout-audit` | Audit and optimize checkout flow using growth-specialist agent. Identifies friction points and produces test backlog. |
| `recommendation-design` | Design recommendation system for e-commerce using recommendation-engineer agent. Covers algorithm selection, serving architecture, evaluation. |

---

## Mode: `checkout-audit`

Use the `growth-specialist` agent to audit checkout for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The CRO specialist should:

1. **Initial Discovery** — gather:
   - Current funnel metrics (visits, cart, checkout, purchase)
   - Drop-off rates per step
   - Device breakdown (mobile vs desktop)
   - Payment methods available
   - Past optimization attempts

2. **Apply `ecommerce-patterns` skill** for heuristic audit

3. **Funnel analysis** by:
   - Step (cart, shipping, payment, review)
   - Device (mobile, tablet, desktop)
   - User type (guest, returning)
   - Cart value

4. **Friction audit** (10 heuristics):
   - Value prop clarity
   - Above-fold CTA
   - Page speed
   - Form length
   - Error handling
   - Trust signals
   - Pricing transparency
   - Guest checkout
   - Payment options
   - Mobile UX

5. **Generate hypotheses** in format:
   "We believe X for Y will result in Z because <data>"

6. **Prioritize using ICE:**
   - Impact (1-10)
   - Confidence (1-10)
   - Ease (1-10)

7. **Design experiments** for top 3-5:
   - Hypothesis statement
   - Success metric + guardrails
   - Variants (control + treatment)
   - Sample size + duration
   - Tracking plan

8. **Produce polished audit report** using `polished-document-style` skill (from software-company):
   - Executive summary
   - Funnel breakdown (with Mermaid Sankey)
   - Heuristic scorecard
   - Hypothesis backlog (ICE-prioritized)
   - Top 3 test plans
   - Quick-win recommendations (no test needed)
   - 90-day testing roadmap

9. **Hand-off suggestions:**
   - UI changes → `ux-designer` (from software-company)
   - Implementation → `developer` (from software-company), `ecommerce-engineer`
   - Tracking → `data-engineer`
   - Payment method additions → `fintech-engineer`

---

## Mode: `recommendation-design`

Use the `recommendation-engineer` agent to design recommendations for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The recommendation engineer should:

1. **Initial Discovery** — gather:
   - Specific surface (homepage, PDP, cart, email, etc.)
   - Available data (events, content, ratings)
   - Catalog size + interaction volume
   - Cold start prevalence
   - Latency budget (real-time vs batch)
   - Business constraints (exclusions, boosts)

2. **Apply `ecommerce-patterns` skill** for surface-specific patterns

3. **Choose algorithm strategy:**
   - Content-based (item features)
   - Collaborative (interaction patterns)
   - Hybrid (recommended default)
   - Sequential (session-based)
   - Match to surface type

4. **Design two-stage architecture:**
   - **Candidate generation:** broad, fast (ANN, popular, etc.)
   - **Ranking:** narrow, precise (heavier model)

5. **Handle cold start:**
   - New users: popular by segment, onboarding
   - New items: content-based, exploration boost

6. **Add business rules:**
   - Inventory filters
   - Already-purchased filter
   - Brand safety
   - Diversity / serendipity

7. **Design serving:**
   - Real-time vs precomputed
   - Caching strategy
   - Fallback (when model unavailable)

8. **Define evaluation:**
   - Offline: Hit Rate@K, NDCG, MAP, coverage, diversity
   - Online A/B test: CTR, conversion, revenue per impression
   - Guardrail metrics

9. **Produce polished design document** using `polished-document-style` skill (from software-company):
   - Architecture diagram (Mermaid)
   - Data flow
   - Algorithm rationale + alternatives considered
   - Cold start handling
   - Business rules
   - Eval plan
   - Rollout phases (shadow → 10% → 50% → 100%)
   - Monitoring + drift detection

10. **Hand-off suggestions:**
    - Data pipeline → `data-engineer`
    - Model training infrastructure → `ai-engineer`
    - Frontend integration → `developer` (from software-company)
    - A/B test design → `growth-specialist`
