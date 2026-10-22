---
name: "mobile-design"
description: "Design mobile app architecture or audit an App Store or Play Store listing."
disableModelInvocation: true
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `mobile-architecture` | Design mobile app architecture using mobile-engineer agent. Covers framework choice, state management, navigation. |
| `aso-audit` | Audit App Store / Play Store listing (App Store Optimization, ASO) using growth-specialist agent. |

---

## Mode: `mobile-architecture`

Use `mobile-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** platforms, team, performance, complexity
2. **Apply `mobile-engineering` skill** (สถาปัตยกรรม · ประสิทธิภาพ · งบประสิทธิภาพ)
3. **Choose framework** (native, React Native (RN), Flutter, Kotlin Multiplatform (KMP)) with tradeoffs
4. **Design architecture** (Model-View-ViewModel (MVVM), Model-View-Intent (MVI), Clean) by complexity
5. **Choose state management**
6. **Design navigation pattern**
7. **Plan offline support** if applicable
8. **Check performance budget** (launch time · frame rate · memory ตาม `mobile-engineering`)
9. **Produce polished architecture doc** using `polished-document-style`
10. **Hand-off:** หน้าจอและ design tokens → `mobile-app-design` (ร่วมกับ `ux-designer`) · ลงมือเขียนแอป (iOS · Android · cross-platform) → `mobile-engineer` · App Store Optimization (ASO) → `growth-specialist`

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
9. **Produce polished ASO audit + 90-day plan** using `polished-document-style`
10. **Hand-off:** asset creation → design team, implementation → respective engineers
