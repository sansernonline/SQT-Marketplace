---
name: live-ops-patterns
description: Use when designing live-ops for games — events, battle passes, seasonal content, retention loops, monetization tuning, A/B testing for games. Covers patterns that drive long-term engagement.
---

# Live-Ops Patterns

## When to use this skill

- Planning content calendar
- Designing battle pass
- Tuning game economy
- Building retention features
- Live-ops post-launch
- F2P monetization strategy

## The Retention Funnel

```
Install → D1 → D7 → D30 → D90 → D365

Each transition is a battle:
- D1 (first session quality)
- D7 (habit formation)
- D30 (loyalty)
- D90 (ongoing engagement)
- D365 (lifetime value crystallizes)
```

### Industry benchmarks (mobile F2P, 2026)

| Metric | Casual | Mid-core | Hardcore |
|--------|:------:|:--------:|:--------:|
| D1 retention | 35-50% | 40-55% | 45-60% |
| D7 retention | 15-25% | 20-30% | 25-35% |
| D30 retention | 5-12% | 8-15% | 12-20% |
| ARPDAU | $0.05-0.20 | $0.20-0.50 | $0.50-2.00 |

## Daily Hook Patterns

### Daily login rewards
```
Day 1: 100 gold
Day 2: 200 gold
Day 3: Item
Day 4: 400 gold
Day 5: Item
Day 6: 600 gold
Day 7: BIG reward
[reset]
```

**Variations:**
- Cumulative (must hit Day 7)
- Mark each daily (lose streak if missed)
- Catch-up token (1 free skip)

### Daily quests
- 3-5 quests per day
- Mix easy + medium
- Reward currency + XP
- Stack: weekly bonus from completing all

```python
def generate_daily_quests(player):
    return [
        easy_quest(player),       # "Win 1 match"
        medium_quest(player),     # "Win 5 matches with X"
        challenge_quest(player),  # "Get 10 headshots"
    ]
```

## Weekly Hook Patterns

### Weekly tournament
- Compete for top of leaderboard
- Resets each week
- Reward top 10/100/1000

### Weekly missions
- Bigger goals than daily
- Span multiple sessions
- Higher rewards

### Weekend events
- Boost XP/currency
- Special game modes
- Brings back lapsed players

## Battle Pass Design

### Structure

```
Tier 1 (free)         Tier 1 (premium)
  ↓                     ↓
Tier 2 ─────  ●  ───── Tier 2
  ↓          XP          ↓
Tier 3 ─────  →  ───── Tier 3
  ↓                     ↓
...                    ...
  ↓                     ↓
Tier 100 ──── final ─── Tier 100
```

### XP Math

```python
# Goal: ~80-100 tiers in 10-week season
TOTAL_TIERS = 100
SEASON_DAYS = 70  # 10 weeks

TIERS_PER_DAY = TOTAL_TIERS / SEASON_DAYS  # ~1.4 tiers/day

# Per session XP
SESSIONS_PER_DAY = 1.5  # casual player
XP_PER_TIER = 1000

XP_PER_SESSION = TIERS_PER_DAY * XP_PER_TIER / SESSIONS_PER_DAY
# = ~950 XP per session
```

### Pricing
- Free track: enough value to feel rewarded
- Premium: ~$10 (sweet spot, varies by region)
- Premium+: ~$25 with tier skips, exclusive bundle
- Pricing in local currency to local norms

## Event Types Library

### Seasonal Events (4-12 weeks)
```
Halloween → Christmas → New Year → Lunar New Year → Songkran → Summer → ...
```

Each season:
- Theme (cosmetics, world skin)
- Battle pass aligned to theme
- Limited-time mode
- Story or narrative beat

### Limited-Time Modes (LTM)
```
3-7 day game mode
Different rules/theme
Drives daily engagement
Cycle through library
```

Examples:
- "One in the chamber"
- "Zombie mode"
- "Sudden death"
- "Double XP weekend"

### Tournaments
```
Weekly: small, in-game
Monthly: larger, special prizes
Quarterly: major, public viewing
Esports cycle: tied to broader scene
```

### Collection events
```
Collect X items by playing → exchange for Y
Drives volume of play
Time-pressure (FOMO)
```

### Cross-promotion
```
Brand collaboration (Marvel, anime, etc.)
Cross-game promo with sister titles
Real-world events (sports, holidays)
```

## Economy Patterns

### Currency types

```
Soft currency (earned in-game)
└─ Used for: progression, common items
   Inflation issue: too much earn vs sink

Hard currency (premium, paid)
└─ Used for: cosmetics, premium items, time-skips
   Pricing tiers: $1, $5, $10, $25, $50, $100

Event currency (limited-time)
└─ Used for: event store, time-limited items
   Expires: keeps urgency
```

### Pricing tiers (typical mobile F2P)

```
$0.99 → starter pack (entry)
$4.99 → small gem pack
$9.99 → medium pack (best value badge)
$19.99 → large pack
$49.99 → mega pack
$99.99 → ultimate pack (whale tier)
```

**Tip:** Each tier ~3x value of previous to incentivize larger purchases.

### Sales psychology
- "First-time only" offers convert
- "Limited stock" creates urgency
- "Bundle includes" frames value
- "Bonus % more" feels generous

## Retention Loops

### Pattern: Daily Habit Loop

```
Trigger (notification at peak time)
   ↓
Action (open game)
   ↓
Variable Reward (loot box, mystery box)
   ↓
Investment (progression, currency)
```

(Hook model by Nir Eyal)

### Pattern: Social Loop

```
Solo play accumulates X
   ↓
X enables social activity (clan war, gift)
   ↓
Social activity creates obligation
   ↓
Return tomorrow to honor obligation
```

### Pattern: FOMO Loop

```
Limited-time item revealed
   ↓
Player plays to earn currency
   ↓
Player purchases (or grinds harder)
   ↓
Item leaves store
   ↓
Cycle repeats with new item
```

> ⚠️ FOMO is powerful but corrosive if overused. Player burnout.

## A/B Testing in Live Games

### Sample size considerations
- Whale skew: small sample dominated by few high spenders
- Time-delayed effects: 30-day LTV matters more than 1-day
- Network effects: changes affect non-test players too

### Common live tests

| Test | Metric | Risk |
|------|--------|------|
| Pricing | ARPU, conversion | Lock-in (can't easily reverse) |
| Onboarding flow | D1 retention | Test quality matters |
| Reward magnitude | DAU, retention | Inflation |
| Difficulty | Session length, churn | Quitters skew data |
| Battle pass XP rate | Completion rate | Hard to interpret |
| Notification timing | DAU | Push fatigue |

## Re-engagement (Churn Recovery)

### Lapsed player segments

```
Active churn (30-day lapse): warm
Cold churn (90+ day lapse): hard to recover
Uninstalled: very hard
```

### Re-engagement tactics

| Tactic | Effective for |
|--------|---------------|
| "Come back" notification + bonus | Warm lapsed |
| "Friend invited you" | Social games |
| Limited-time exclusive | FOMO-motivated |
| Major content drop | Story-driven games |
| Email outreach | Higher-value players |

## Player Segmentation

```python
# Behavioral segments
segments = analyze_players({
    'engagement': sessions_per_week,
    'monetization': total_spent_lifetime,
    'social': clan_member,
    'recency': days_since_last_session,
    'skill': mmr_or_level,
})

# Examples
super_engaged_whales = segments.filter(
    sessions_per_week > 14,
    total_spent_lifetime > 100,
)

at_risk_dolphins = segments.filter(
    total_spent_lifetime > 20,
    days_since_last_session > 5,
)

bot_suspects = segments.filter(
    sessions_per_week > 50,
    no_chat_activity,
    win_rate > 80%,
)
```

## Tools (2026)

| Tool | Use |
|------|-----|
| **GameAnalytics** | Free analytics |
| **Unity Analytics / Cloud Code** | Unity ecosystem |
| **PlayFab** | Microsoft live ops platform |
| **Amplitude** | Funnel + cohort analysis |
| **AppsFlyer / Adjust** | Attribution |
| **Helika** | Web3 + gaming analytics |
| **GrowthBook / Statsig** | A/B testing |

## Anti-patterns

- ❌ **Energy mechanics blocking play** — feels punishing
- ❌ **Pay-to-win in competitive** — destroys long-term
- ❌ **Loot box for gameplay items** — regulatory + ethical
- ❌ **Aggressive FOMO weekly** — burnout
- ❌ **Power creep** — old purchases obsolete
- ❌ **No comeback mechanic** — once behind, never catch up
- ❌ **Same offer to whale and minnow** — segmentation matters

## Healthy Live-Ops Principles

- ✅ Players should feel valued, not exploited
- ✅ Free path should be substantive
- ✅ Premium = convenience or cosmetics, not power
- ✅ Surprise + delight regularly
- ✅ Communicate roadmap (manage expectations)
- ✅ Respond to community feedback
- ✅ Anti-cheat aggressive (cheaters drive players away)

## Reference

- [Mark Robinson's "Cohort Analysis for Games"](https://www.deltadna.com/)
- [GameAnalytics Benchmarks](https://gameanalytics.com/benchmarks/)
- [Naavik gaming industry analysis](https://naavik.co/)
- [Deconstructor of Fun (podcast/site)](https://www.deconstructoroffun.com/)
- [Mobile Free To Play (book)](https://www.amazon.com/Mobile-Free-Play-Players-Microtransactions/dp/1517385423)
