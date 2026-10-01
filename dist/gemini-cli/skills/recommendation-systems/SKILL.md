---
name: recommendation-systems
description: Use when implementing product recommendations — "you may also like", "frequently bought together", personalized homepage, cart upsells, email personalization. Covers candidate generation, ranking, diversity, and serving patterns.
---

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
| **Homepage** (logged in) | Personalized rank | Cold start = popular |
| **PDP "similar"** | Item-to-item | Visual similarity helps |
| **PDP "complete the look"** | Co-purchase | Same category, complementary |
| **Cart "frequently bought together"** | Co-purchase | Cart-context aware |
| **Cart upsell** | Higher-value similar | Margin-aware |
| **Search re-rank** | Click-based + relevance | Maintain query intent |
| **Email "for you"** | Personalized rank | Stale model OK |
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
- ✅ Inventory check (last 5 minutes)
- ✅ Price tier appropriate for user
- ✅ Brand safety (no conflicting brands together)
- ✅ Already purchased filter (don't recommend exact same)
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

- ❌ **Position bias** — top always gets clicks regardless
- ❌ **Popularity dominance** — long tail invisible
- ❌ **Filter bubble** — user sees only same category forever
- ❌ **No diversity** — boring after a while
- ❌ **No business rules** — recommend out-of-stock
- ❌ **Offline-online gap** — looks great in eval, no online lift
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
