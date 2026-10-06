---
name: mobile-design
description: Design mobile app architecture or audit an App Store / Play Store listing. Two modes — mobile-architecture or aso-audit.
argument-hint: <mobile-architecture | aso-audit> <details>
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `mobile-architecture` | Design mobile app architecture using mobile-engineer agent. Covers framework choice, state management, navigation. |
| `aso-audit` | Audit App Store / Play Store listing using growth-specialist agent. |

---

## Mode: `mobile-architecture`

Use `mobile-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** platforms, team, performance, complexity
2. **Apply `mobile-engineering` skill**
3. **Choose framework** (native, RN, Flutter, KMP) with tradeoffs
4. **Design architecture** (MVVM, MVI, Clean) by complexity
5. **Choose state management**
6. **Design navigation pattern**
7. **Plan offline support** if applicable
8. **Apply `mobile-engineering` skill** for budget checking
9. **Produce polished architecture doc** using `polished-document-style` (from software-company)
10. **Hand-off:** iOS → `mobile-engineer`, Android → `mobile-engineer`, ASO → `growth-specialist`

---

## Mode: `aso-audit`

Use `growth-specialist` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** current rankings, conversion, competitor positioning
2. **Apply `mobile-engineering` skill**
3. **Keyword research + ranking analysis**
4. **Listing audit:** title, subtitle, description, keywords
5. **Visual audit:** icon, screenshots, video
6. **Rating + review analysis**
7. **Localization gap analysis**
8. **A/B test recommendations**
9. **Produce polished ASO audit + 90-day plan** using `polished-document-style` (from software-company)
10. **Hand-off:** asset creation → design team, implementation → respective engineers
