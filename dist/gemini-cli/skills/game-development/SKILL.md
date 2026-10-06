---
name: game-development
description: Use when building a game — choosing an engine, core systems such as ECS and scenes, multiplayer netcode, matchmaking and anti-cheat, game design and progression, or live-ops events, battle passes and retention.
---

# game-development

งานเกม — สถาปัตยกรรมและ engine · multiplayer · game design · live-ops

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| choosing game engine, designing core systems (ECS, GameObject, scenes), planning asset pipeline, or structuring large game codebase. Covers Unity, Unreal, Godot, and engine-agnostic patterns | [`references/game-architecture.md`](references/game-architecture.md) |
| implementing multiplayer networking — choosing between client-server vs P2P, building lag compensation, client-side prediction, snapshot interpolation, or matchmaking systems. Covers FPS, MOBA, casual game patterns | [`references/multiplayer-netcode.md`](references/multiplayer-netcode.md) |
| designing live-ops for games — events, battle passes, seasonal content, retention loops, monetization tuning, A/B testing for games. Covers patterns that drive long-term engagement | [`references/live-ops-patterns.md`](references/live-ops-patterns.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| building games — Unity, Unreal, Godot, or custom engines. Covers gameplay programming, rendering, ECS, physics, asset pipelines, and platform-specific concerns (PC, console, mobile, web) | [`references/agent-game-developer.md`](references/agent-game-developer.md) | `game-developer` |
| building multiplayer game systems — netcode (client-server, P2P), matchmaking, anti-cheat, lobbies, replication, lag compensation. Covers FPS, MOBA, MMO, casual party game patterns | [`references/agent-multiplayer-engineer.md`](references/agent-multiplayer-engineer.md) | `game-developer` |
| designing game mechanics, balance, progression systems, level design, narrative structure, or onboarding. Focused on player experience and engagement, not implementation | [`references/agent-game-designer.md`](references/agent-game-designer.md) | `game-designer` |
| running live-ops for games — events, battle passes, seasonal content, A/B testing, retention loops, monetization tuning, player segmentation. Combines game design, analytics, and product management for ongoing engagement | [`references/agent-live-ops-specialist.md`](references/agent-live-ops-specialist.md) | `game-designer` |

## agent ของสายนี้

`game-developer` · `game-designer`

## ที่มา

รวมจาก plugin `software-company-gaming` (skill `game-architecture` · `multiplayer-netcode` · `live-ops-patterns`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`
