---
description: Design game mechanics, loops, and progression using game-designer agent. Produces comprehensive game design document.
argument-hint: <game concept or feature to design>
---

Use the `game-designer` agent to design: **$ARGUMENTS**

The game designer should:

1. **Initial Discovery** — gather:
   - Genre + reference games
   - Target audience
   - Platform + session length
   - Monetization model
   - Engine + team constraints
   - Existing game (if iterating)

2. **Define core loops:**
   - Minute-by-minute (30s - 2min)
   - Session (10-60 min)
   - Meta (days/weeks)

3. **Design core mechanic:**
   - Single sentence description
   - Player verbs
   - Depth from combinations
   - Easy to learn, hard to master test

4. **Map difficulty curve:**
   - Onboarding (first 5 min)
   - Early game tension/relief pattern
   - Mid-game escalation
   - End-game mastery

5. **Design progression:**
   - XP/levels OR unlock-based OR mastery-based
   - Match to player motivation
   - Hook points throughout journey

6. **Plan onboarding** (first 5 minutes):
   - Hook in 30 sec
   - Teach via play, not text
   - Early win
   - Next goal visible

7. **Monetization design** (if applicable):
   - Currency types (3-4 max)
   - Pricing tiers
   - Battle pass structure
   - No pay-to-win in competitive

8. **Apply `game-architecture` skill** for implementation feasibility check

9. **Produce polished game design document** using `polished-document-style` skill (from software-company):
   - Pitch (one paragraph)
   - Target audience
   - Core loops (Mermaid)
   - Mechanic breakdown
   - Difficulty curve chart
   - Monetization design
   - Unique selling points
   - Risks + mitigations

10. **Hand-off suggestions:**
    - Implementation → `game-developer`
    - Multiplayer details → `multiplayer-engineer`
    - Live operations + retention → `live-ops-specialist`
    - Art direction → external (artist)
