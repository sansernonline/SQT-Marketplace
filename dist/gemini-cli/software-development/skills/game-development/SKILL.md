---
name: game-development
description: Use when building a game
argument-hint: <game-design | multiplayer-architecture> <details>
---

# game-development

งานเกม — สถาปัตยกรรมและ engine · multiplayer · game design · live-ops

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| choosing game engine, designing core systems (ECS, GameObject, scenes), planning asset pipeline, or structuring large game codebase. Covers Unity, Unreal, Godot, and engine-agnostic patterns | [`references/game-architecture.md`](references/game-architecture.md) |
| implementing multiplayer networking — choosing between client-server vs P2P, building lag compensation, client-side prediction, snapshot interpolation, or matchmaking systems. Covers FPS, MOBA, casual game patterns | [`references/multiplayer-netcode.md`](references/multiplayer-netcode.md) |
| designing live-ops for games — events, battle passes, seasonal content, retention loops, monetization tuning, A/B testing for games. Covers patterns that drive long-term engagement | [`references/live-ops-patterns.md`](references/live-ops-patterns.md) |

## คู่มือบทบาท

An agent called to work in this area opens its own role file before starting · read the table of contents first, then read only the sections the job uses

| บทบาท | อ่าน | agent |
|---|---|---|
| building games — Unity, Unreal, Godot, or custom engines. Covers gameplay programming, rendering, ECS, physics, asset pipelines, and platform-specific concerns (PC, console, mobile, web) | [`references/agent-game-developer.md`](references/agent-game-developer.md) | `game-developer` |
| building multiplayer game systems — netcode (client-server, P2P), matchmaking, anti-cheat, lobbies, replication, lag compensation. Covers FPS, MOBA, MMO, casual party game patterns | [`references/agent-multiplayer-engineer.md`](references/agent-multiplayer-engineer.md) | `game-developer` |
| designing game mechanics, balance, progression systems, level design, narrative structure, or onboarding. Focused on player experience and engagement, not implementation | [`references/agent-game-designer.md`](references/agent-game-designer.md) | `game-designer` |
| running live-ops for games — events, battle passes, seasonal content, A/B testing, retention loops, monetization tuning, player segmentation. Combines game design, analytics, and product management for ongoing engagement | [`references/agent-live-ops-specialist.md`](references/agent-live-ops-specialist.md) | `game-designer` |

## agent ของสายนี้

`game-developer` · `game-designer`

## ที่มา

ย้ายมาจาก plugin `software-development-gaming` (เดิมชื่อ game-architecture → `references/game-architecture.md` · multiplayer-netcode → `references/multiplayer-netcode.md` · live-ops-patterns → `references/live-ops-patterns.md` ไม่ใช่ skill แยกแล้ว) และรวมเข้า `software-development` ใน v2.0.0 เนื้อหาเดิมยังอยู่ครบใน `references/`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:game-development <game-design | multiplayer-architecture> <details>`

> **Language:** write every line of wording in the output per `human-writing`. This command gives the steps, while human-writing gives how to write so people can understand.

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `game-design` | Design game mechanics, loops, and progression using game-designer agent. Produces comprehensive game design document. |
| `multiplayer-architecture` | Design multiplayer architecture using game-developer agent. Covers netcode, matchmaking, anti-cheat for the game type. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
