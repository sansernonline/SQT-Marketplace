---
description: Audit and optimize checkout flow using cro-specialist agent. Identifies friction points and produces test backlog.
argument-hint: <site URL or description>
---

Use the `cro-specialist` agent to audit checkout for: **$ARGUMENTS**

The CRO specialist should:

1. **Initial Discovery** — gather:
   - Current funnel metrics (visits, cart, checkout, purchase)
   - Drop-off rates per step
   - Device breakdown (mobile vs desktop)
   - Payment methods available
   - Past optimization attempts

2. **Apply `checkout-optimization` skill** for heuristic audit

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
   - Tracking → `data-engineer` (from software-company-ai if installed)
   - Payment method additions → `payment-integration` (from software-company-fintech if installed)
