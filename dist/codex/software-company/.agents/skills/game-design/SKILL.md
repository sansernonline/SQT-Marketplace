---
name: "game-design"
description: "Use when the user asks for a game design document or multiplayer architecture. Modes — game-design · multiplayer-architecture."
---

> **ภาษา:** ถ้อยคำทุกบรรทัดในเอกสารที่ได้ เขียนตาม `human-writing` — command นี้บอกขั้นตอน ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

Two modes. Read the first word of **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `game-design` | Design game mechanics, loops, and progression using game-designer agent. Produces comprehensive game design document. |
| `multiplayer-architecture` | Design multiplayer architecture using game-developer agent. Covers netcode, matchmaking, anti-cheat for the game type. |

---

## Mode: `game-design`

Use the `game-designer` agent to design: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

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
   - Experience points (XP)/levels OR unlock-based OR mastery-based
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

8. **Apply `game-development` skill** for implementation feasibility check

9. **Produce polished game design document** using `polished-document-style` skill (from superuser):
   - Pitch (one paragraph)
   - Target audience
   - Core loops (house-style figure via `diagram-figures`)
   - Mechanic breakdown
   - Difficulty curve chart
   - Monetization design
   - Unique selling points
   - Risks + mitigations

10. **Hand-off suggestions:**
    - Implementation → `game-developer`
    - Multiplayer details → `game-developer`
    - Art direction → external (artist)

---

## Mode: `multiplayer-architecture`

Use the `game-developer` agent to design multiplayer architecture for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The game-developer agent should:

1. **Initial Discovery** — gather:
   - Game genre + pace
   - Players per match
   - Concurrent matches target
   - Geographic distribution
   - Cross-play requirements
   - Competitive vs casual
   - Budget for infrastructure

2. **Apply `game-development` skill** for architecture patterns

3. **Choose netcode architecture:**
   - Client-server (dedicated)
   - Client-server (listen)
   - Peer-to-peer (P2P)
   - Hybrid
   - Justify with trade-offs

4. **Define tick rate** based on game type — use the one sourced table in `game-development` → [`references/multiplayer-netcode.md` → Server tick rate](../game-development/references/multiplayer-netcode.md#server-tick-rate) (competitive first-person shooter (FPS) 64-128 Hz, casual 10-20 Hz, and so on)

5. **Plan state synchronization:**
   - Replication strategy
   - Delta compression
   - Interest management
   - Bandwidth budget

6. **Design lag handling:**
   - Client-side prediction (if action game)
   - Snapshot interpolation
   - Lag compensation for hit detection

7. **Design matchmaking:**
   - Algorithm (TrueSkill/Elo)
   - Latency-aware
   - Match composition (teams, roles)
   - Wait time targets

8. **Anti-cheat strategy:**
   - Server-side validation
   - Statistical detection
   - Third-party tools (Easy Anti-Cheat (EAC), BattlEye)
   - Bug bounty / community reporting

9. **Plan infrastructure:**
   - Dedicated servers vs managed (Amazon GameLift, Edgegap, Nitrado GameFabric — checked 22 Oct 2026; Hathora left game hosting in 2026)
   - Regional deployment
   - Scaling strategy
   - Distributed denial-of-service (DDoS) mitigation

10. **Reconnection / disconnection:**
    - Mid-match reconnect grace period
    - Disconnect penalty (competitive)
    - Backfill for casual

11. **Produce polished multiplayer architecture document** using `polished-document-style` skill (from superuser):
    - Architecture diagram and network flow sequence diagrams (house-style figures via `diagram-figures`)
    - Tick rate + bandwidth budget
    - Matchmaking flow
    - Anti-cheat layers
    - Infrastructure cost projection
    - Rollout phases

12. **Hand-off suggestions:**
    - Infrastructure deployment → `devops-engineer` (from software-company)
    - Backend services → `solution-architect` (from software-company)
    - Live monitoring + tournaments → `game-designer`
