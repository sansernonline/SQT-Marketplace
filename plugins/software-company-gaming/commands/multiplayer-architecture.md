---
description: Design multiplayer architecture using multiplayer-engineer agent. Covers netcode, matchmaking, anti-cheat for the game type.
argument-hint: <game type, e.g., "5v5 FPS" or "100-player BR" or "co-op 2-4 players">
---

Use the `multiplayer-engineer` agent to design multiplayer architecture for: **$ARGUMENTS**

The multiplayer engineer should:

1. **Initial Discovery** — gather:
   - Game genre + pace
   - Players per match
   - Concurrent matches target
   - Geographic distribution
   - Cross-play requirements
   - Competitive vs casual
   - Budget for infrastructure

2. **Apply `multiplayer-netcode` skill** for architecture patterns

3. **Choose netcode architecture:**
   - Client-server (dedicated)
   - Client-server (listen)
   - P2P
   - Hybrid
   - Justify with trade-offs

4. **Define tick rate** based on game type:
   - Competitive FPS: 60-128 Hz
   - Casual: 20-30 Hz
   - Strategic: 10-20 Hz

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
   - Third-party tools (EAC, BattlEye)
   - Bug bounty / community reporting

9. **Plan infrastructure:**
   - Dedicated servers vs managed (GameLift, Hathora)
   - Regional deployment
   - Scaling strategy
   - DDoS mitigation

10. **Reconnection / disconnection:**
    - Mid-match reconnect grace period
    - Disconnect penalty (competitive)
    - Backfill for casual

11. **Produce polished multiplayer architecture document** using `polished-document-style` skill (from software-company):
    - Architecture diagram (Mermaid)
    - Network flow sequence diagrams
    - Tick rate + bandwidth budget
    - Matchmaking flow
    - Anti-cheat layers
    - Infrastructure cost projection
    - Rollout phases

12. **Hand-off suggestions:**
    - Infrastructure deployment → `devops-engineer` (from software-company)
    - Backend services → `solution-architect` (from software-company)
    - Game logic → `game-developer`
    - Live monitoring + tournaments → `live-ops-specialist`
