---
name: app-store-optimization
description: Use when optimizing App Store / Play Store listings — keyword research, screenshots, descriptions, A/B testing, localization, rating strategy. Both stores covered.
---

# App Store Optimization (ASO)

## When to use this skill

- New app launch
- Existing app stagnant
- Entering new markets
- Refreshing visuals
- Improving conversion

## ASO Pillars

```
Discovery (search ranking)
  ↓
Page View (impression)
  ↓
Conversion (install)
  ↓
Retention (active user)
```

ASO touches: Discovery + Page View + Conversion.

## Keyword Research Process

```
1. Brainstorm seed keywords (your app's topics)
2. Expand using tools (AppTweak, SensorTower, Mobile Action)
3. Check search volume + difficulty
4. Compare competitors' keywords
5. Long-tail opportunities
6. Localize for each market
7. Prioritize by volume × difficulty × relevance
```

### Tools (2026)

| Tool | Specialty |
|------|-----------|
| AppTweak | ASO suite |
| Sensor Tower | Market intelligence |
| App Annie / data.ai | Market data |
| Mobile Action | Affordable ASO |
| App Radar | Recommendations engine |

## App Store (iOS) Specifics

### Keywords field (100 chars)
- Comma-separated
- No spaces (saves chars)
- No plurals (system handles)
- Don't repeat title/subtitle words
- Different per locale

```
Good: workout,fitness,yoga,training,gym,exercise,running

Bad: best workout app for fitness training and gym exercise routines  ← waste
```

### Title (30 chars)
```
Brand: Core Function
   ↑          ↑
  brand    primary keyword

Examples:
"Notion: AI Notes & Docs"
"Headspace: Sleep & Meditation"
"Duolingo - Language Lessons"
```

### Subtitle (30 chars)
- Secondary keywords
- Benefit-oriented
- Different from title

### Promotional text (170 chars)
- Updatable WITHOUT app review
- Use for: sales, events, new features
- Not indexed for search

## Play Store (Android) Specifics

### Title (30 chars)
- Similar to iOS

### Short description (80 chars)
- Visible before "More"
- Most read text
- Pack with keywords + benefit

```
Best: "Free language lessons. Learn 30+ languages with fun, gamified courses."
```

### Long description (4000 chars)
- ALL of this is indexed for search
- Front-load important keywords
- Structure with bullets + headers
- Include common search phrases

```
Format:
Hook (first 252 chars matter most)
- Feature 1
- Feature 2
- Feature 3

Detail paragraphs

User testimonials / press quotes

Subscription disclosure (required if subscription)
```

## Visual Assets

### Icon
```
A/B test variants:
- Color schemes
- Illustration vs flat
- With/without text
- Different metaphors

Measure: tap-through from search results
```

### Screenshots
```
First 2 screenshots are critical (visible without scroll).

Modern format:
- Bold benefit headline OVER UI screenshot
- Each screenshot = 1 idea
- Consistent style (color, typography)
- Phone in shot or borderless?

Common formula:
1. "Save 5 hours a week" + hero UI
2. "Beautiful organization" + feature
3. "Loved by 10M+ users" + social proof
4. "Smart AI assistant" + feature
5. "Try free for 7 days" + CTA
```

### Preview Video (30 sec)
```
NO AUDIO assumed (autoplay muted)

Structure:
0-3 sec: Hook (the benefit)
3-25 sec: Show product in action (3-5 features)
25-30 sec: Logo + tagline

Add text overlays explaining what user sees
```

## A/B Testing

### Apple Product Page Optimization
- Up to 3 variants per element
- 90-day max test
- Statistical significance built-in
- Test: icon, screenshots (first 3), preview video

### Google Store Listing Experiments
- More variables
- Localized
- 7-90 day duration
- Test: icon, screenshots, short desc, long desc

### What to test (priority order)
1. First screenshot (highest impact)
2. App icon
3. Preview video on/off
4. Subtitle / short description
5. Second + third screenshots

## Rating + Review Strategy

### Prompt strategy
```
✅ Good moments to prompt:
- After completed action with success
- After feature use streak (5+ uses)
- After positive in-app survey
- After milestone (1000 messages sent, etc.)

❌ Don't prompt:
- On first launch
- During error states
- During onboarding
- More than 3 times/year (Apple limit)
```

### iOS native prompt
```swift
import StoreKit

if let windowScene = view.window?.windowScene {
    SKStoreReviewController.requestReview(in: windowScene)
}
```

### Review responses
- Respond to negative reviews within 48h
- Acknowledge issue (don't argue)
- Offer support channel for details
- Thank positive reviews occasionally
- Update review later if issue resolved (some users do this)

## Localization

```
Top markets to localize:
- English (US/UK)
- Spanish (LatAm, ES separate)
- Japanese
- Korean
- German
- French
- Portuguese (Brazil)
- Chinese (Traditional + Simplified separately)
- Thai / local market language
```

### Localization checklist
- [ ] Title (locale-appropriate)
- [ ] Subtitle / short description
- [ ] Description
- [ ] Keywords (NOT just translated — re-research)
- [ ] Screenshots (UI in language + locale text)
- [ ] Preview video (if budget allows)
- [ ] Review by native speaker

## Competitive Intelligence

```python
# Track competitors
- Their keyword rankings
- Their featured statuses
- Their update cadence
- Their pricing changes
- User review themes (what they fail at)

# Tools: AppTweak, SensorTower, AppFollow
```

## Common Pitfalls

- ❌ **Keyword stuffing** — rejection + bad UX
- ❌ **Misleading screenshots** — bad ratings
- ❌ **Ignore reviews** — they compound
- ❌ **Set + forget** — competitors move
- ❌ **No localization** — leaving installs on table
- ❌ **Vanity testing** — A/B test wrong elements

## Reference

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [AppTweak Academy](https://www.apptweak.com/aso-blog)
- [Sensor Tower Blog](https://sensortower.com/blog)
- [Phiture's ASO Stack](https://phiture.com/aso-stack/)
