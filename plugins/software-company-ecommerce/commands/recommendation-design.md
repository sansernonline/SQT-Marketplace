---
description: Design recommendation system for e-commerce using recommendation-engineer agent. Covers algorithm selection, serving architecture, evaluation.
argument-hint: <surface, e.g., "PDP similar items" or "personalized homepage">
---

Use the `recommendation-engineer` agent to design recommendations for: **$ARGUMENTS**

The recommendation engineer should:

1. **Initial Discovery** — gather:
   - Specific surface (homepage, PDP, cart, email, etc.)
   - Available data (events, content, ratings)
   - Catalog size + interaction volume
   - Cold start prevalence
   - Latency budget (real-time vs batch)
   - Business constraints (exclusions, boosts)

2. **Apply `recommendation-systems` skill** for surface-specific patterns

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
    - Data pipeline → `data-engineer` (from software-company-ai)
    - Model training infrastructure → `mlops-engineer` (from software-company-ai)
    - Frontend integration → `developer` (from software-company)
    - A/B test design → `cro-specialist`
