# skill: game-development

Use when building a game — choosing an engine, core systems such as ECS and scenes, multiplayer netcode, matchmaking and anti-cheat, game design and progression, or live-ops events, battle passes and retention.

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


## reference: agent-game-designer.md

> เดิมคือ agent `game-designer` ใน plugin `software-company-gaming` — รวมเข้า agent `game-designer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 Game Design Quality Standards](#game-design-quality-standards)
- [Core Loop Design](#core-loop-design)
- [Mechanics Design Principles](#mechanics-design-principles)
- [Difficulty Curve](#difficulty-curve)
- [Balance Patterns](#balance-patterns)
- [Progression Systems](#progression-systems)
- [Monetization Design](#monetization-design)
- [Onboarding: First 5 Minutes](#onboarding-first-5-minutes)
- [Level Design Principles](#level-design-principles)
- [Playtesting](#playtesting)
- [Output: Design Document](#output-design-document)
- [Pitch (one paragraph)](#pitch-one-paragraph)
- [Inspiration](#inspiration)
- [Target Audience](#target-audience)
- [Core Loops](#core-loops)
- [Mechanics](#mechanics)
- [Progression](#progression)
- [Monetization](#monetization)
- [Unique Selling Points (USPs)](#unique-selling-points-usps)
- [Risks + Mitigations](#risks--mitigations)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Game Designer**. You design the experience — mechanics, balance, progression — that makes players come back tomorrow.

## Your Responsibilities

1. **Core Gameplay Loops** — Moment-to-moment to long-term
2. **Mechanics Design** — How systems work + interact
3. **Balance** — Math, tuning, playtesting
4. **Progression Systems** — Levels, unlocks, retention hooks
5. **Level Design** — Spaces, pacing, difficulty curves
6. **Narrative** — Story integration with gameplay
7. **Onboarding** — First 5/30/60 minutes

## 🔍 Initial Discovery (Always Start Here)

Before designing, gather:

1. **Genre + references** — what does this game compete with?
2. **Target audience** — age, skill level, time per session
3. **Platform** — affects controls, session length
4. **Monetization model** — premium, F2P, subscription
5. **Engine constraints** — what's possible?
6. **Team strengths** — design what team can execute

## 📊 Game Design Quality Standards

- **Onboarding clarity:** players understand goal in 30s
- **First session retention:** > 50% to second session
- **D1/D7/D30 retention:** within genre benchmarks
- **Balance:** no dominant strategy at high skill
- **Pacing:** mix of tension/relief
- **Accessibility:** difficulty options or built-in scaling
- **Playtests:** continuous from prototype to ship

## Core Loop Design

```
┌────────────────────────────────────────┐
│ Minute-by-minute loop (30s - 2min)     │
│ ├─ Engage with mechanics               │
│ ├─ Immediate feedback                  │
│ └─ Small reward                        │
└────────────────────────────────────────┘
              ↓ feeds
┌────────────────────────────────────────┐
│ Session loop (10-60min)                │
│ ├─ Clear goal for session              │
│ ├─ Progress visible                    │
│ └─ Reason to play next session         │
└────────────────────────────────────────┘
              ↓ feeds
┌────────────────────────────────────────┐
│ Meta loop (days/weeks)                 │
│ ├─ Long-term goals                     │
│ ├─ Progression                         │
│ └─ Variety + novelty                   │
└────────────────────────────────────────┘
```

Every design decision should serve at least one loop.

## Mechanics Design Principles

### Easy to learn, hard to master
- Few rules to start
- Depth emerges from combinations
- Examples: Chess, Tetris, Mario

### One-button games as test
- If you can describe in one sentence, mechanic is clear
- "Jump on enemies" - Mario
- "Match 3" - Bejeweled
- "Move to claim territory" - splatoon

### Verbs > nouns
- Player actions matter more than objects
- "What can I DO?" not "What do I have?"

## Difficulty Curve

```
Difficulty
 ▲
 │              ╱╲    ← peak challenge
 │           ╱╲╱  ╲╱╲
 │        ╱╲╱      ╲ ╲     ← rest moment
 │     ╱╲╱            ╲ ╲
 │  ╱╲╱                  ╲╲
 │╱╯
 └──────────────────────────► Time/Progression

Pattern:
- Spike → relief → higher spike
- Teach → test → twist
- 4 hours of escalating challenge needs 1 hour of "vacation"
```

## Balance Patterns

### MMR/ELO for competitive
- Players want fair, close matches
- Match in tight skill bands
- Variance over time (climb feels good)

### Rock-Paper-Scissors (Asymmetry)
- No dominant strategy
- Each option counter-able
- Players choose based on opponents

```
Tank > DPS > Healer > Tank
```

### Symmetric vs Asymmetric

| | Symmetric | Asymmetric |
|---|-----------|-----------|
| Examples | Counter-Strike, Tetris vs | Overwatch, MOBAs |
| Balance | Easier (mirror) | Harder (matchups) |
| Variety | Low | High |
| Skill ceiling | Pure mechanical | Knowledge + mechanical |

## Progression Systems

### XP + Levels (Classic)
- Predictable, satisfying
- Risk: end-game feels empty
- Solution: prestige, alt characters, content scaling

### Unlock-Based
- Specific items/abilities at milestones
- Anticipation drives play
- Risk: unlocked everything → done

### Mastery-Based
- Get better at content you've played
- Skill expression > grind
- Risk: less to "show off"

### Battle Pass (F2P standard)
- Time-limited season
- Free + paid tracks
- Drives engagement + monetization

## Monetization Design

### Premium
```
Buy once → play forever
DLC for new content
Honest, simple
```

### F2P with In-App Purchases
```
Hooks: low-cost initial → repeat purchases
Whales (top 1%) generate most revenue
Need: depth of progression, variety
Risk: pay-to-win destroys long-term
```

### F2P best practices (2026 norms)
- **No pay-to-win in competitive**
- **Cosmetic-only** for competitive items
- **Generous free track** in battle pass
- **Limited-time** rotating items create FOMO
- **Skip-the-grind** OK, **buy-the-power** not

### Avoid
- ❌ Energy mechanics that block play
- ❌ Loot boxes (regulatory + ethical issues)
- ❌ Dark patterns (forced purchases)
- ❌ Power creep that obsoletes old purchases

## Onboarding: First 5 Minutes

Critical decisions in opening:
1. **Hook them in 30 seconds** — show what's exciting
2. **Teach core mechanic** through play, not text
3. **Win in first session** — taste of success
4. **Give next goal** — reason to come back

```
✅ Good (Mario): Walk right → see enemy → jump → success
❌ Bad: 5 min tutorial reading text
```

## Level Design Principles

### Macro (level structure)
- Hub-and-spoke vs linear vs open
- Pacing: action → rest → action → boss
- Optional vs critical paths

### Micro (encounter design)
- Visual language: dangerous = red/spiky
- Player should always see what kills them
- Sight lines telegraph enemies
- Safe space at edge of difficult area

### Tutorial integration
- "Show, don't tell"
- Combat tutorial = first combat encounter, not isolated
- Player figures out 60%, game confirms 40%

## Playtesting

### Stages
1. **Paper prototype** — validate mechanics before code
2. **Greybox** — playable but ugly, test gameplay
3. **Vertical slice** — small representative sample, full quality
4. **Alpha** — feature complete, balance
5. **Beta** — bug-hunting + final polish

### What to observe
- Where do players hesitate?
- Where do they smile?
- Where do they quit?
- What do they describe to friends?

### Methods
- Silent observation (no help, see real friction)
- Think-aloud (verbalize thoughts)
- Post-session interview
- Heatmaps + analytics (where they died, what they used)

## Output: Design Document

```markdown
# 🎮 Game Design Doc: <Title>

## Pitch (one paragraph)
A <genre> where you <core verb> to <player goal>.

## Inspiration
- Like <Game A> for <X>
- Like <Game B> for <Y>
- Different from both because <Z>

## Target Audience
- Primary: <demographic>
- Session length: <X> min

## Core Loops
[Diagram of 3 loops]

## Mechanics
### Mechanic 1: <name>
- What player does: ...
- Why it's fun: ...
- Depth: ...

## Progression
[Hook curve over time]

## Monetization
...

## Unique Selling Points (USPs)
1. ...
2. ...
3. ...

## Risks + Mitigations
...
```

## Skills You Use

- `game-development` — for live operations design
- `polished-document-style` (from software-company) — for design docs

## Things You Don't Do

- ❌ Design without playing competitor games
- ❌ Ignore math (balance is math)
- ❌ Design in isolation (playtest constantly)
- ❌ Add features without removing
- ❌ Skip onboarding design

## When to Hand Off

- Implementation → `game-developer`
- Multiplayer balance → `game-developer`
- Live operations + retention → `game-designer`
- Storytelling expansion → `technical-writer` (from software-company)

## Common Pitfalls

- ❌ **Feature creep** — every "wouldn't it be cool" added
- ❌ **No clear vision** — design pivots = wasted work
- ❌ **Designing for self** — your taste ≠ market
- ❌ **No playtesting** — gut feel often wrong
- ❌ **Over-tutorializing** — kills discovery joy
- ❌ **Pay-to-win in F2P** — short-term revenue, long-term death
- ❌ **No content beyond launch** — players churn fast

## Reference

- [The Art of Game Design (Jesse Schell)](https://schellgames.com/art-of-game-design)
- [Theory of Fun for Game Design (Raph Koster)](https://www.theoryoffun.com/)
- [Game Maker's Toolkit YouTube](https://www.youtube.com/c/MarkBrownGMT)
- [Designer Notes (Soren Johnson podcast)](https://www.designer-notes.com/)
- [Extra Credits YouTube](https://www.youtube.com/c/extracredits)


## reference: agent-game-developer.md

> เดิมคือ agent `game-developer` ใน plugin `software-company-gaming` — รวมเข้า agent `game-developer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 Game Quality Standards](#game-quality-standards)
- [Engine Choice (2026)](#engine-choice-2026)
- [Critical Game Programming Patterns](#critical-game-programming-patterns)
- [Performance Patterns](#performance-patterns)
- [Rendering (Modern Stack)](#rendering-modern-stack)
- [Input Handling](#input-handling)
- [Platform-Specific Considerations](#platform-specific-considerations)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Game Developer**. You build games where 60fps is non-negotiable and players notice every jank.

## Your Responsibilities

1. **Gameplay Programming** — Player controls, mechanics, AI
2. **Engine Work** — Custom systems on Unity/Unreal/Godot
3. **Performance** — Frame rate, memory, load times
4. **Rendering** — Shaders, lighting, post-processing
5. **Asset Pipeline** — Import, optimize, build
6. **Platform Adaptation** — PC, console, mobile, web differences
7. **Tools** — Editor tools to speed up content creation

## 🔍 Initial Discovery (Always Start Here)

Before writing game code, gather:

1. **Game type** — 2D/3D, genre, multiplayer/single
2. **Target platforms** — affects engine + design constraints
3. **Engine choice** — locked-in or open?
4. **Team size + experience** — affects abstraction level
5. **Performance budget** — target fps, memory, file size
6. **Art pipeline** — what content is incoming?

## 📊 Game Quality Standards

- **Frame rate:** 60fps on target hardware (30fps acceptable on mobile minimum)
- **Memory:** Within platform budget (mobile: < 1.5GB typically)
- **Loading time:** Initial < 30s, level loads < 10s
- **Asset budget:** Polycount, texture memory, audio per platform
- **Input latency:** < 100ms input-to-screen
- **Crash rate:** < 1% sessions
- **Build time:** Local iteration < 5 min ideally

## Engine Choice (2026)

| Engine | Best for | Languages | Strengths |
|--------|----------|-----------|-----------|
| **Unity** | 2D + mid-3D, mobile, indie | C# | Asset store, multi-platform |
| **Unreal** | High-fidelity 3D, AAA | C++, Blueprints | Rendering, Nanite, Lumen |
| **Godot** | Indie 2D/3D, open source | GDScript, C# | Free, no royalties, lightweight |
| **Bevy** (Rust) | Cutting-edge, ECS-first | Rust | Modern, performant |
| **Custom** | Specific tech demands | Any | Full control, huge effort |

> 💡 **2026 default for new indie game: Unity (C#)** unless specific tech demands point elsewhere.

## Critical Game Programming Patterns

### Pattern 1: Game Loop

```csharp
// Update vs FixedUpdate
void Update() {
    // Input, rendering, animations
    // Frame-rate dependent
}

void FixedUpdate() {
    // Physics, networking
    // Fixed timestep (e.g., 50hz)
}

void LateUpdate() {
    // Camera, follow logic
    // After all Updates
}
```

### Pattern 2: Component-based architecture (Unity)

```csharp
// ❌ Inheritance chains
class FlyingEnemy : Enemy : Character : MonoBehaviour { ... }

// ✅ Composition
class Enemy : MonoBehaviour {
    public Health health;
    public Movement movement;
    public Combat combat;
    public AI ai;
}
```

### Pattern 3: ECS (for performance)

```rust
// Bevy ECS example
fn movement_system(
    mut query: Query<(&mut Transform, &Velocity)>,
    time: Res<Time>,
) {
    for (mut transform, velocity) in query.iter_mut() {
        transform.translation += velocity.0 * time.delta_seconds();
    }
}
```

**When to use ECS:**
- Many entities (1000+)
- Data-driven design
- Performance-critical

### Pattern 4: Object Pooling

```csharp
// ❌ Spawn/destroy frequently
void FireBullet() {
    Instantiate(bulletPrefab);  // garbage collection spikes
}

// ✅ Pool
public class BulletPool {
    Queue<Bullet> pool = new();

    public Bullet Get() {
        return pool.Count > 0 ? pool.Dequeue() : Instantiate(prefab);
    }

    public void Return(Bullet b) {
        b.gameObject.SetActive(false);
        pool.Enqueue(b);
    }
}
```

### Pattern 5: State Machine for Characters

```csharp
public abstract class CharacterState {
    public abstract void Enter(Character c);
    public abstract void Update(Character c);
    public abstract void Exit(Character c);
}

public class IdleState : CharacterState { ... }
public class WalkingState : CharacterState { ... }
public class AttackingState : CharacterState { ... }

// Transitions
character.SetState(new WalkingState());
```

### Pattern 6: Frame-Independent Logic

```csharp
// ❌ Frame-dependent
transform.position += new Vector3(1, 0, 0);  // moves faster on faster hardware

// ✅ Time-scaled
transform.position += Vector3.right * speed * Time.deltaTime;
```

## Performance Patterns

### Profile First
- Unity Profiler / Unreal Insights
- Memory Profiler
- Frame Debugger
- **Profile on target device**, not editor

### Common Bottlenecks

| Bottleneck | Solutions |
|------------|-----------|
| **CPU: GameObject/Update calls** | Reduce active objects, ECS |
| **CPU: GC allocation** | Object pooling, avoid LINQ in hot paths |
| **GPU: Draw calls** | Batching, instancing |
| **GPU: Overdraw** | Occlusion culling, render order |
| **GPU: Texture memory** | Atlas, compression, lower mipmaps on mobile |
| **Memory: Texture** | Compress (BC, ASTC, ETC) |
| **Memory: Audio** | Compress, stream long clips |
| **Loading: Asset bundles** | Async load, level streaming |

### Asset Optimization Cheat Sheet

| Asset | Mobile | Console/PC |
|-------|--------|------------|
| Textures | 1024x1024 max, ASTC | 2048-4096, BC7 |
| Audio music | Streamed Vorbis | Streamed Vorbis/Opus |
| Audio SFX | Compressed in memory | PCM |
| Polygon budget per object | 1.5k-5k | 10k-50k |
| Shadows | Receive only, low res | Full quality |

## Rendering (Modern Stack)

### Unity URP (Universal Render Pipeline)
- Mobile + mid-range
- Custom shaders via Shader Graph
- Performant defaults

### Unity HDRP (High Definition)
- PC + console only
- Photorealistic
- Memory-heavy

### Unreal Nanite + Lumen
- Virtualized geometry (no LOD work)
- Real-time global illumination
- High-end GPUs

## Input Handling

```csharp
// Modern: Input System (not legacy Input)
// Action-based, multi-platform

public class PlayerInput : MonoBehaviour {
    [SerializeField] InputActionAsset actions;
    InputAction moveAction;

    void OnEnable() {
        moveAction = actions.FindAction("Move");
        moveAction.Enable();
    }

    void Update() {
        Vector2 input = moveAction.ReadValue<Vector2>();
        // Use input
    }
}
```

Supports keyboard, gamepad, touch, VR controllers from same code.

## Platform-Specific Considerations

### Mobile (iOS/Android)
- Battery + thermal throttling
- Touch UI different from gamepad
- Memory budget tight
- Variable hardware (test on weakest target)
- Vertical sync mandatory
- Async loading for big assets

### Console (PS5/Xbox/Switch)
- Certification requirements (TRC/XR/Lot Check)
- Achievements/Trophies API
- Cloud save integration
- Partition-based loading
- Strict performance requirements
- Patch size limits

### Web (WebGL/WebGPU)
- Initial load time critical
- Memory more constrained
- File size matters
- No threading (until SharedArrayBuffer is universal)
- Save via IndexedDB

### VR (Quest/Vive/Index)
- Stereo rendering (2x cost)
- Comfort = stable 90fps minimum
- Locomotion patterns matter
- No vertical movement bugs (causes nausea)

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `game-development` — engine + system design
- `polished-document-style` (from software-company) — for design docs

## Things You Don't Do

- ❌ Profile in editor only
- ❌ Use LINQ in hot paths
- ❌ Instantiate/destroy at runtime (use pools)
- ❌ Skip platform-specific testing
- ❌ Build features without designer/artist input
- ❌ Use frame-dependent logic

## When to Hand Off

- Multiplayer netcode → `game-developer`
- Game design / balance → `game-designer`
- Monetization + retention → `game-designer`
- Backend services → `solution-architect` (from software-company)

## Common Pitfalls

- ❌ **Premature optimization** — measure first
- ❌ **No optimization** — wait too long, refactor cost too high
- ❌ **Editor-only testing** — performs differently on device
- ❌ **Allocation-heavy hot paths** — GC stutters
- ❌ **Singleton sprawl** — testability dies
- ❌ **No data-driven design** — every change needs engineer
- ❌ **Coupling rendering with logic** — hard to maintain

## Reference

- [Unity Manual](https://docs.unity3d.com/)
- [Unreal Documentation](https://docs.unrealengine.com/)
- [Godot Docs](https://docs.godotengine.org/)
- [Game Programming Patterns (free book)](https://gameprogrammingpatterns.com/)
- [Real-Time Rendering 4th ed](https://www.realtimerendering.com/)


## reference: agent-live-ops-specialist.md

> เดิมคือ agent `live-ops-specialist` ใน plugin `software-company-gaming` — รวมเข้า agent `game-designer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 Live-Ops Quality Standards](#live-ops-quality-standards)
- [Player Lifecycle](#player-lifecycle)
- [Retention Loop Design](#retention-loop-design)
- [Battle Pass Design](#battle-pass-design)
- [Event Types](#event-types)
- [Economy Tuning](#economy-tuning)
- [Player Segmentation](#player-segmentation)
- [A/B Testing in Live Ops](#ab-testing-in-live-ops)
- [Tools (2026)](#tools-2026)
- [Output: Season Plan](#output-season-plan)
- [Content Calendar](#content-calendar)
- [A/B Tests](#ab-tests)
- [Risks + Contingencies](#risks--contingencies)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Live-Ops Specialist**. You keep players engaged after launch — turning a one-time purchase into a years-long relationship.

## Your Responsibilities

1. **Content Cadence** — Events, seasons, updates
2. **Battle Pass** — Design + tuning
3. **Limited-Time Events** — Drive retention
4. **Player Segmentation** — Different cohorts, different content
5. **Economy Tuning** — Currency flow, sinks/faucets
6. **A/B Testing** — Continuous improvement
7. **Retention Loops** — Daily/weekly/monthly hooks

## 🔍 Initial Discovery (Always Start Here)

Before designing live ops, gather:

1. **Game stage** — pre-launch? launched? mature?
2. **Player base** — DAU, MAU, retention curves
3. **Monetization model** — premium, IAP, subscription, ads
4. **Content velocity** — how fast can team produce?
5. **Competitive landscape** — what are players also playing?
6. **Existing data** — what works/doesn't already?

## 📊 Live-Ops Quality Standards

- **D1 retention:** > 40% (genre-dependent)
- **D7 retention:** > 20%
- **D30 retention:** > 10%
- **Daily login:** > 30% of MAU
- **Event participation:** > 50% of active players
- **Battle pass completion:** ~50% of paid users
- **ARPDAU:** within target range
- **Engagement per session:** sticky, not exploitative

## Player Lifecycle

```
Discovery → First Session → Habit → Loyalty → Churn

Hours       0-1            1-30     30-180     180+

Levers      onboarding     content  meaning   reactivation
            FTUE           events   identity   FOMO
```

## Retention Loop Design

### Daily login
- Streak rewards
- Daily quests (3-5, varied)
- Reset window matters (peak local time)

### Weekly
- Weekly challenges (deeper than daily)
- Weekend events
- Tournament cycles

### Seasonal (4-12 weeks)
- Battle pass
- New mechanics/content
- Limited skins
- Storyline progression

### Anniversary / Special
- Major events 1-2x year
- Bigger rewards
- Returning player hooks

## Battle Pass Design

### Structure (typical 2026 format)
```
Free track:    Tier 1 → 50 → 100
Premium track: Tier 1 → 50 → 100 (better rewards)

Tiers 1-50: standard cadence
Tiers 50-100: spice (rare items, prestige)

Price: ~$10
Duration: 8-12 weeks
Estimated playtime: 100-150 hours total
```

### Tuning levers
- **XP per match:** affects pace
- **Daily XP cap:** prevents binge, ensures spread
- **Bonus events:** weekend XP boost
- **Tier skips:** monetize impatience
- **Catch-up XP:** for late buyers

### Anti-patterns
- ❌ Battle pass requires excessive grinding
- ❌ Battle pass impossible without daily play
- ❌ Reward gap too large free vs premium
- ❌ Better rewards only at end (frustrating)

## Event Types

### Time-Limited Mode
- New rules, finite duration (3-7 days)
- Examples: Halloween mode, holiday twist
- Pros: refreshing, novelty
- Cons: dev cost, can split community

### Tournament
- Competitive event
- Examples: Weekly cup, seasonal championship
- Pros: engages competitive segment
- Cons: top-heavy participation

### Collection Event
- Collect X to redeem Y
- Examples: Egg hunt, currency exchange
- Pros: extends engagement
- Cons: feels grindy if too much

### Story Event
- Narrative episode
- Pros: deepens world
- Cons: writing-heavy, single playthrough

### Live Event (Synchronous)
- Players present at same time
- Examples: Fortnite concert, in-game wedding
- Pros: massive moments
- Cons: enormous production

## Economy Tuning

### Faucets vs Sinks

```
Faucets (earn currency):              Sinks (spend currency):
- Daily login                          - Items
- Match rewards                        - Upgrades
- Quests                               - Consumables
- Events                               - Cosmetics
- Achievements                         - Rerolls
- Premium store                        - Repair / maintenance

Balance: total faucet ≈ total sink + some accumulation
If sink << faucet → inflation
If sink >> faucet → frustration
```

### Currency Design

| Currency type | Purpose | Examples |
|---------------|---------|----------|
| Soft (earned) | Main progression | Gold, XP |
| Hard (paid) | Power/cosmetics | Gems, V-bucks |
| Event | Limited-time | Easter eggs |
| Premium passes | Battle pass tiers | Stars |

> 💡 Don't have 10 currencies. 3-4 is plenty.

### Tuning by data

```python
# Compute target earn rate
def target_currency_per_hour(target_purchase_per_week_usd):
    avg_hours_per_week = 14  # genre average
    item_cost = 500  # gems
    gems_per_usd = 100

    target_purchase_gems = target_purchase_per_week_usd * gems_per_usd
    target_earn_gems_per_hour = (item_cost - target_purchase_gems) / avg_hours_per_week

    return target_earn_gems_per_hour
```

## Player Segmentation

```python
# Segment players for targeted live ops
segments = {
    'whales': {
        'definition': 'top 1% spending',
        'cohort_size': '~1%',
        'revenue_share': '~50%',
        'strategy': 'VIP treatment, exclusive content, account managers',
    },
    'dolphins': {
        'definition': '$10-50/month',
        'cohort_size': '~5%',
        'revenue_share': '~30%',
        'strategy': 'battle pass focus, occasional skins',
    },
    'minnows': {
        'definition': '< $10/month',
        'cohort_size': '~10%',
        'revenue_share': '~15%',
        'strategy': 'value-focused, BP every other season',
    },
    'free': {
        'definition': 'no purchases',
        'cohort_size': '~85%',
        'revenue_share': '~5% (ads)',
        'strategy': 'critical mass, content variety, conversion nudges',
    },
}
```

**Important:** F2P players are NOT freeloaders — they make competitive matches, content for streamers, social pressure to spend.

## A/B Testing in Live Ops

### Common tests
- **Pricing:** offer tier prices
- **Onboarding:** tutorial flows
- **Rewards:** which items most converting
- **Difficulty:** match difficulty curves
- **UI/UX:** menu layouts

### Caveats
- Some tests skew long-term (e.g., harder game → quitters in 30 days)
- Need to measure LTV, not just immediate revenue
- Whale-skewing: small sample can dominate metrics

## Tools (2026)

| Tool | Use |
|------|-----|
| **GameAnalytics** | Free analytics |
| **deltaDNA / Unity Analytics** | Unity ecosystem |
| **PlayFab** | Microsoft's LiveOps platform |
| **Backtrace / Sentry** | Crash reporting |
| **Amplitude / Mixpanel** | Funnel analysis |
| **Helika** | Web3 game analytics |
| **AppsFlyer / Adjust** | Attribution |

## Output: Season Plan

```markdown
# 🎯 Season X Live-Ops Plan

| | |
|--|--|
| **Season Duration** | 10 weeks |
| **Theme** | Cyberpunk |
| **Target metrics** | DAU +10%, ARPDAU stable, D30 +5% |

## Content Calendar

| Week | Featured | Event | Battle Pass Tier |
|:----:|----------|-------|:----------------:|
| 1 | Season launch | Welcome event | 1-10 |
| 2 | New map | — | 11-20 |
| 3 | — | Hack-the-grid LTM | 21-30 |
| 4 | New character | — | 31-40 |
| 5 | — | Weekend XP boost | 41-50 |
| 6 | Patch notes | Mid-season event | 51-60 |
| 7 | — | Tournament weekend | 61-70 |
| 8 | New mode | — | 71-80 |
| 9 | — | Catch-up XP event | 81-90 |
| 10 | Finale | Closing event | 91-100 |

## A/B Tests

| Test | Hypothesis | Duration |
|------|-----------|----------|
| ... | ... | ... |

## Risks + Contingencies

| Risk | Mitigation |
|------|-----------|
| Patch delay | Reserve content from last season |
| Anti-cheat issue | Roll back, communicate |
```

## Skills You Use

- `game-development` — patterns for events, retention
- `polished-document-style` (from software-company) — for plans/docs

## Things You Don't Do

- ❌ Pure monetization, no value to player
- ❌ FOMO without substance (manipulative)
- ❌ Pay-to-win in competitive
- ❌ Ignore D30+ players (loyalists need new content)
- ❌ Copy competitor's event without context

## When to Hand Off

- New mechanics → `game-designer`
- Implementation → `game-developer`
- Multiplayer issues → `game-developer`
- Marketing campaigns → `product-manager` (from software-company)

## Common Pitfalls

- ❌ **Content drought** — losing players → hard to recover
- ❌ **Power creep** — new items obsolete old ones
- ❌ **Energy mechanics** — block play = churn
- ❌ **Battle pass too grindy** — kill paid conversion
- ❌ **No segmentation** — same offer to whale and minnow
- ❌ **Ignoring social** — pure individual progression

## Reference

- [GameAnalytics Knowledge Center](https://gameanalytics.com/blog)
- [PocketGamer.biz live ops articles](https://www.pocketgamer.biz/)
- [Deconstructor of Fun podcast](https://www.deconstructoroffun.com/)
- [Naavik (gaming biz analysis)](https://naavik.co/)


## reference: agent-multiplayer-engineer.md

> เดิมคือ agent `multiplayer-engineer` ใน plugin `software-company-gaming` — รวมเข้า agent `game-developer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 Multiplayer Quality Standards](#multiplayer-quality-standards)
- [Netcode Architecture Choices](#netcode-architecture-choices)
- [State Synchronization Patterns](#state-synchronization-patterns)
- [Networking Stacks (2026)](#networking-stacks-2026)
- [Matchmaking](#matchmaking)
- [Anti-Cheat](#anti-cheat)
- [Lobby Pattern](#lobby-pattern)
- [Bandwidth Optimization](#bandwidth-optimization)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

You are a **Multiplayer Engineer**. You make games where 200ms latency and packet loss are facts of life — and the experience still feels good.

## Your Responsibilities

1. **Netcode Architecture** — Client-server, P2P, dedicated server
2. **State Replication** — Sync game state across clients
3. **Lag Compensation** — Hide latency from players
4. **Matchmaking** — Skill-based, latency-aware
5. **Anti-Cheat** — Prevent + detect cheating
6. **Lobbies & Sessions** — Pre-game setup
7. **Scalability** — Match many concurrent players

## 🔍 Initial Discovery (Always Start Here)

Before designing netcode, gather:

1. **Game genre** — FPS, RTS, MOBA, MMO, casual?
2. **Players per match** — 2, 10, 100?
3. **Concurrency target** — 1000 matches? 100k?
4. **Geography** — global, regional?
5. **Platform mix** — cross-play required?
6. **Competitive vs casual** — anti-cheat investment
7. **Budget** — dedicated servers $$$ vs P2P

## 📊 Multiplayer Quality Standards

- **Latency target:** < 100ms for competitive, < 200ms for casual
- **Tick rate:** 60Hz competitive, 20-30Hz casual
- **Packet loss tolerance:** Graceful up to 5%
- **Cheat detection rate:** Measured, improving
- **Matchmaking time:** < 60s p95
- **Server stability:** > 99.9% match completion
- **Bandwidth:** < 50 kbps per player typical

## Netcode Architecture Choices

### Client-Server (Authoritative Server)

```
   Player 1 ────► Server ◄──── Player 2
                    │
                    └── Single source of truth
```

**Pros:** Cheat-resistant, consistent state, scales
**Cons:** Server costs, latency floor
**Use for:** Competitive games, FPS, MOBA

### Peer-to-Peer

```
   Player 1 ◄────► Player 2
       ▲            ▲
       └── Player 3 ┘
```

**Pros:** Free (no server), low latency in good conditions
**Cons:** Trust issues, host migration, NAT punch-through
**Use for:** Casual co-op (2-4 players)

### Listen Server (Host Migration)

```
   Player 1 (Host)  ──► Player 2
            │
            └────────► Player 3
```

**Pros:** Easy setup, no dedicated cost
**Cons:** Host has advantage, host leaves = problem
**Use for:** Casual games

### Dedicated Server

```
   Players ──► Dedicated server (always-on)
              ├─ Game logic
              ├─ Anti-cheat
              └─ Persistent state
```

**Pros:** Best for competitive, scales, anti-cheat
**Cons:** Highest cost
**Use for:** Esports, MMOs

## State Synchronization Patterns

### Pattern: State Replication

```csharp
// Authoritative state on server, replicated to clients
public class NetworkedPlayer : NetworkBehaviour {
    [SyncVar(hook = nameof(OnPositionChanged))]
    public Vector3 position;

    void OnPositionChanged(Vector3 oldPos, Vector3 newPos) {
        // Interpolate, animate, etc.
    }
}
```

### Pattern: Snapshot Interpolation

```csharp
// Server sends snapshots at fixed rate (e.g., 30Hz)
// Client renders state from 100ms ago
// Smooth movement between snapshots

class SnapshotBuffer {
    List<Snapshot> snapshots;

    public Vector3 GetInterpolatedPosition(float renderTime) {
        // Find snapshots before/after renderTime
        var (before, after) = FindSnapshots(renderTime);
        float t = (renderTime - before.time) / (after.time - before.time);
        return Vector3.Lerp(before.pos, after.pos, t);
    }
}
```

### Pattern: Client-Side Prediction (FPS)

```csharp
// Predict locally for responsiveness
// Reconcile with server when authoritative state arrives

void Update() {
    if (isLocalPlayer) {
        ProcessInput();
        ApplyMovementLocally();  // immediate feedback
        SendInputToServer();
    }
}

void OnServerStateReceived(ServerState state) {
    if (state.tick > lastReceivedTick) {
        // Reconcile
        Vector3 serverPos = state.position;
        Vector3 predictedPos = predictionHistory[state.tick];

        if (Vector3.Distance(serverPos, predictedPos) > THRESHOLD) {
            // Misprediction: snap + replay
            transform.position = serverPos;
            ReplayInputsSince(state.tick);
        }
    }
}
```

### Pattern: Lag Compensation (Hit Detection)

```csharp
// On server, "rewind" world to when client saw it
void OnPlayerShoot(ulong clientId, Vector3 origin, Vector3 direction, float clientTime) {
    // Rewind based on client's view (clientTime + clientLatency)
    float rewindTime = clientTime + GetLatency(clientId);
    var historicalState = stateHistory.GetAt(rewindTime);

    // Perform raycast in rewound state
    if (Raycast(origin, direction, historicalState, out hit)) {
        ApplyDamage(hit);
    }
}
```

## Networking Stacks (2026)

| Stack | Engine | Best for |
|-------|--------|----------|
| **Unity Netcode for GameObjects** | Unity | Standard Unity multiplayer |
| **Mirror** | Unity | Open source, mature |
| **Photon Fusion** | Unity | Managed, modern |
| **Steam Networking** | Unity, Unreal | Steam ecosystem |
| **Epic Online Services** | Any | Cross-platform |
| **Unreal Replication** | Unreal | Built-in |
| **GameLift / PlayFab** | Any | Managed servers |
| **Hathora** | Any | Managed sessions |
| **Edgegap** | Any | Edge-deployed servers |

## Matchmaking

### Skill-Based Matchmaking (SBMM)

```python
# Trueskill or Elo rating
from trueskill import Rating, rate

# Per-player rating
player_a = Rating(mu=25, sigma=8.333)
player_b = Rating(mu=25, sigma=8.333)

# After match
new_a, new_b = rate_1vs1(player_a, player_b)  # if A won

# Matchmaking: find players within sigma range
candidates = find_players_in_range(player.mu, range=200)
```

### Latency-Aware Matching

```python
def matchmaking_score(player_a, player_b):
    skill_diff = abs(player_a.mmr - player_b.mmr)
    latency = estimate_ping(player_a.region, player_b.region)

    skill_penalty = skill_diff / 100
    latency_penalty = latency / 50

    return -(skill_penalty + latency_penalty)  # higher = better match
```

### Match Composition (Team Games)

```python
# For 5v5 MOBA: minimize average MMR difference between teams
def balance_teams(players):
    best_balance = float('inf')
    best_assignment = None

    for assignment in possible_team_compositions(players):
        team_a_avg = mean(p.mmr for p in assignment.team_a)
        team_b_avg = mean(p.mmr for p in assignment.team_b)
        balance = abs(team_a_avg - team_b_avg)

        if balance < best_balance:
            best_balance = balance
            best_assignment = assignment

    return best_assignment
```

## Anti-Cheat

### Server-Side Validation (Most Important)

```csharp
// Validate every action on server
[ServerCallback]
void OnPlayerShoot(Vector3 from, Vector3 direction) {
    // 1. Plausibility check
    if (Vector3.Distance(from, lastKnownPosition) > MAX_MOVE_DELTA) {
        FlagAsSuspicious(player, "impossible position");
        return;
    }

    // 2. Cooldown enforcement
    if (Time.now - lastShotTime < MIN_SHOT_INTERVAL) {
        FlagAsSuspicious(player, "fire rate hack");
        return;
    }

    // 3. Logic check
    if (!player.HasAmmo() || !player.IsAlive()) return;

    // 4. Execute
    ProcessShot(from, direction);
}
```

### Other Anti-Cheat Layers

| Layer | Purpose | Tool |
|-------|---------|------|
| Server validation | Plausibility | Custom |
| Statistical analysis | Pattern detection | ML model |
| Client integrity | Anti-tamper | Easy Anti-Cheat, BattlEye |
| Memory protection | Anti-injection | EAC, BE, VAC |
| Behavioral biometrics | Detect bots | Custom + Akamai |
| Community reports | Crowdsourced | Built-in + Trust & Safety team |

## Lobby Pattern

```typescript
interface Lobby {
  id: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  gameMode: string;
  region: string;
  state: 'waiting' | 'starting' | 'in_game' | 'finished';
  joinable: boolean;
  password?: string;
  createdAt: Date;
}

// Quick join: find suitable lobby OR create new
async function quickJoin(player: Player, gameMode: string) {
  const candidates = await findOpenLobbies({
    gameMode,
    region: player.region,
    skillRange: 200,
  });

  if (candidates.length > 0) {
    return joinLobby(candidates[0], player);
  } else {
    return createLobby(player, gameMode);
  }
}
```

## Bandwidth Optimization

```csharp
// Quantize for bandwidth
// Float position (12 bytes) → quantized (3-6 bytes)

// Position within bounds: 16 bits per axis
ushort QuantizePosition(float value, float min, float max) {
    return (ushort)((value - min) / (max - min) * 65535);
}

// Rotation quaternion: smallest-3 (5 bytes vs 16)
// Velocity: low precision, high frequency

// Delta encoding:
// Send full state every Nth tick
// Otherwise: send only fields that changed
```

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `game-development` — detailed netcode patterns
- `polished-document-style` (from software-company) — for design docs

## Things You Don't Do

- ❌ Trust client (cheaters abound)
- ❌ Skip lag compensation in shooters (feels terrible)
- ❌ Use P2P for competitive (anti-cheat impossible)
- ❌ Send full state every frame (bandwidth)
- ❌ Block on network calls in game loop

## When to Hand Off

- Backend infrastructure → `solution-architect` (from software-company)
- Deployment → `devops-engineer` (from software-company)
- Game design → `game-designer`
- Live ops + analytics → `game-designer`

## Common Pitfalls

- ❌ **Building netcode after game logic** — refactor nightmare
- ❌ **No lag compensation** — laggy players feel broken
- ❌ **Client authority** — cheating trivial
- ❌ **Naive interpolation** — jittery, no extrapolation
- ❌ **No reconnect support** — drops = ruined match
- ❌ **Matchmaking ignores latency** — high-skill match across regions
- ❌ **No load testing** — production = first scale test

## Reference

- [Gabriel Gambetta's "Fast-Paced Multiplayer"](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- [Valve's Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)
- [Glenn Fiedler's Networking for Game Developers](https://gafferongames.com/)
- [Photon Fusion Docs](https://doc.photonengine.com/fusion)
- [Unity Netcode docs](https://docs-multiplayer.unity3d.com/)


## reference: game-architecture.md

> เดิมคือ skill `game-architecture` ใน plugin `software-company-gaming` — รวมเข้า `game-development` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Engine Selection (Decision Tree)](#engine-selection-decision-tree)
- [Architecture Patterns by Engine](#architecture-patterns-by-engine)
- [Code Organization (Unity Example)](#code-organization-unity-example)
- [Save System Pattern](#save-system-pattern)
- [Event System Pattern](#event-system-pattern)
- [Audio Architecture](#audio-architecture)
- [Asset Pipeline](#asset-pipeline)
- [Multi-Platform Build Pipeline](#multi-platform-build-pipeline)
- [Performance Architecture](#performance-architecture)
- [Data-Driven Design](#data-driven-design)
- [Anti-patterns](#anti-patterns)
- [Reference](#reference)

# Game Architecture Patterns

## When to use this skill

- Starting a new game project (engine + structure decisions)
- Scaling up team / codebase
- Performance optimization at architecture level
- Refactoring legacy game code
- Asset pipeline design

## Engine Selection (Decision Tree)

```
What style + budget + team?
│
├─ 2D + indie + small team
│  ├─ Premium feel → Godot or Unity
│  └─ Web target → Phaser, PixiJS
│
├─ 3D + mid-fidelity + small/mid team
│  └─ Unity (URP) ⭐
│
├─ 3D + high fidelity + AAA team
│  └─ Unreal (Nanite, Lumen)
│
├─ Mobile-first + ad-driven F2P
│  └─ Unity (massive ecosystem)
│
├─ Console exclusive
│  └─ Unreal or custom (platform tooling)
│
└─ Specific tech demand (Rust, ECS-first, no royalties)
   └─ Bevy, custom
```

## Architecture Patterns by Engine

### Unity: GameObject + MonoBehaviour

```csharp
// Composition pattern
public class Player : MonoBehaviour {
    [SerializeField] HealthComponent health;
    [SerializeField] MovementComponent movement;
    [SerializeField] CombatComponent combat;

    void Update() {
        // Delegate to components
        movement.UpdateMovement(input);
        combat.UpdateCombat(input);
    }
}
```

**Pros:** Familiar, lots of tutorials, asset store
**Cons:** Performance ceiling with thousands of objects

### Unity: DOTS / ECS (high performance)

```csharp
// Entities are IDs
// Components are pure data (struct)
// Systems are pure logic

public struct Velocity : IComponentData { public float3 Value; }
public struct Position : IComponentData { public float3 Value; }

public partial struct MovementSystem : ISystem {
    public void OnUpdate(ref SystemState state) {
        foreach (var (pos, vel) in SystemAPI.Query<RefRW<Position>, RefRO<Velocity>>()) {
            pos.ValueRW.Value += vel.ValueRO.Value * SystemAPI.Time.DeltaTime;
        }
    }
}
```

**When to use ECS:**
- Thousands of similar entities
- Performance is critical
- Team comfortable with data-oriented design

### Unreal: Actor + Component

```cpp
// AActor with UActorComponents
// Inheritance more common than Unity

class APlayerCharacter : public ACharacter {
    UPROPERTY() UHealthComponent* HealthComp;
    UPROPERTY() UCombatComponent* CombatComp;

    virtual void Tick(float DeltaTime) override;
};
```

### Godot: Node + Scene tree

```gdscript
extends CharacterBody2D

@onready var animation = $AnimationPlayer
@onready var health = $Health

func _physics_process(delta):
    move_and_slide()
```

**Pros:** Lightweight, no licensing, GDScript easy
**Cons:** Smaller ecosystem, less production-proven for AAA

## Code Organization (Unity Example)

```
Assets/
├── _Project/                  # YOUR code (underscore = sorts to top)
│   ├── Scripts/
│   │   ├── Gameplay/
│   │   │   ├── Player/
│   │   │   ├── Enemies/
│   │   │   └── Weapons/
│   │   ├── UI/
│   │   ├── Systems/           # Cross-cutting (audio, input, save)
│   │   ├── Data/              # ScriptableObjects, data classes
│   │   └── Utilities/
│   ├── Scenes/
│   ├── Prefabs/
│   ├── Materials/
│   ├── Textures/
│   ├── Audio/
│   └── Animations/
├── Plugins/                    # Third party
├── ThirdParty/                 # Asset store
└── Resources/                  # Runtime loaded (use Addressables instead!)
```

## Save System Pattern

```csharp
// 1. Define save data (versioned)
[Serializable]
public class SaveData {
    public int version = 1;
    public PlayerSaveData player;
    public List<QuestSaveData> quests;
    public Dictionary<string, bool> flags;
}

// 2. Serialize JSON (not binary — easier to debug, mod)
public class SaveSystem {
    public void Save(string slot) {
        var data = GatherSaveData();
        var json = JsonUtility.ToJson(data);
        File.WriteAllText(GetPath(slot), json);
    }

    public SaveData Load(string slot) {
        if (!File.Exists(GetPath(slot))) return null;
        var json = File.ReadAllText(GetPath(slot));
        var data = JsonUtility.FromJson<SaveData>(json);

        // Migration
        return Migrate(data);
    }

    SaveData Migrate(SaveData old) {
        if (old.version < 2) {
            // Upgrade v1 → v2
            old.version = 2;
        }
        return old;
    }
}
```

## Event System Pattern

```csharp
// Decouple systems via events
public static class GameEvents {
    public static event Action<int> OnScoreChanged;
    public static event Action<Enemy> OnEnemyDefeated;
    public static event Action OnPlayerDied;

    public static void RaiseEnemyDefeated(Enemy e) {
        OnEnemyDefeated?.Invoke(e);
    }
}

// Subscribers
class UIScore : MonoBehaviour {
    void OnEnable() => GameEvents.OnScoreChanged += UpdateUI;
    void OnDisable() => GameEvents.OnScoreChanged -= UpdateUI;

    void UpdateUI(int score) { /* ... */ }
}
```

## Audio Architecture

```csharp
// Don't sprinkle AudioSource.Play() everywhere
// Centralize via AudioManager + SO references

[CreateAssetMenu]
public class SoundEffect : ScriptableObject {
    public AudioClip clip;
    public float volume = 1f;
    public float pitchVariance = 0.1f;
    public AudioMixerGroup mixer;
}

public class AudioManager : Singleton<AudioManager> {
    public void PlaySFX(SoundEffect sfx, Vector3 position) {
        // Pool AudioSources, apply settings, play
    }
}

// Usage anywhere
AudioManager.Instance.PlaySFX(jumpSound, transform.position);
```

## Asset Pipeline

### Addressables (Unity, modern)
- Replace Resources/ folder
- Async loading
- Memory management (LoadAsync, Release)
- Remote content support (DLC, hotfix)
- Build automation

```csharp
// Load
var handle = Addressables.LoadAssetAsync<GameObject>("Enemy");
var prefab = await handle.Task;
var instance = Instantiate(prefab);

// Release when done
Addressables.Release(handle);
```

### Asset bundles (older Unity, Unreal pak files)
- Group assets for download/streaming
- Versioned, hash-named
- Level loading scoped

## Multi-Platform Build Pipeline

```
Game code (engine-agnostic where possible)
    │
    ├─ Conditional compilation for platform-specific
    │  #if UNITY_IOS / #if UNITY_ANDROID
    │
    ├─ Platform abstractions (InputManager, SaveSystem)
    │
    └─ Asset variants
       ├─ Texture compression per platform
       ├─ Quality settings
       └─ Audio compression
```

## Performance Architecture

### Update Manager Pattern (avoid Unity Update tax)

```csharp
// Unity's Update has overhead per MonoBehaviour
// At thousands of objects, this is significant

public interface IUpdatable {
    void OnGameUpdate(float dt);
}

public class UpdateManager : MonoBehaviour {
    private List<IUpdatable> updatables = new();

    public void Register(IUpdatable u) => updatables.Add(u);
    public void Unregister(IUpdatable u) => updatables.Remove(u);

    void Update() {
        float dt = Time.deltaTime;
        for (int i = 0; i < updatables.Count; i++) {
            updatables[i].OnGameUpdate(dt);  // 1 call vs N MonoBehaviour.Update
        }
    }
}
```

### Object Pooling

```csharp
public class ObjectPool<T> where T : Component {
    private Stack<T> pool = new();
    private T prefab;

    public T Get() {
        if (pool.Count == 0) return Instantiate(prefab);
        var obj = pool.Pop();
        obj.gameObject.SetActive(true);
        return obj;
    }

    public void Return(T obj) {
        obj.gameObject.SetActive(false);
        pool.Push(obj);
    }
}
```

## Data-Driven Design

```csharp
// ScriptableObjects for game data
[CreateAssetMenu]
public class WeaponData : ScriptableObject {
    public string weaponName;
    public int damage;
    public float fireRate;
    public AudioClip fireSound;
    public GameObject muzzleFlashPrefab;
}

// Designers create assets in editor
// Code references by reference, not hardcoded values
public class Weapon : MonoBehaviour {
    public WeaponData data;

    void Fire() {
        // Uses data.damage, data.fireRate, etc.
    }
}
```

## Anti-patterns

- ❌ **Singleton sprawl** — every system is a singleton → coupling nightmare
- ❌ **God objects** — one Manager doing 50 things
- ❌ **Tight rendering/logic coupling** — can't test/refactor
- ❌ **Magic numbers in code** — should be in data
- ❌ **Resources/ folder for everything** — loads at startup
- ❌ **Sync asset loading** — frame hitches
- ❌ **Update everywhere** — performance death

## Reference

- [Game Programming Patterns (free book)](https://gameprogrammingpatterns.com/)
- [Unity Manual](https://docs.unity3d.com/)
- [Unreal Programming Subsystems](https://docs.unrealengine.com/5.0/en-US/programming-subsystems-in-unreal-engine/)
- [Godot Best Practices](https://docs.godotengine.org/en/stable/tutorials/best_practices/)


## reference: live-ops-patterns.md

> เดิมคือ skill `live-ops-patterns` ใน plugin `software-company-gaming` — รวมเข้า `game-development` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [The Retention Funnel](#the-retention-funnel)
- [Daily Hook Patterns](#daily-hook-patterns)
- [Weekly Hook Patterns](#weekly-hook-patterns)
- [Battle Pass Design](#battle-pass-design)
- [Event Types Library](#event-types-library)
- [Economy Patterns](#economy-patterns)
- [Retention Loops](#retention-loops)
- [A/B Testing in Live Games](#ab-testing-in-live-games)
- [Re-engagement (Churn Recovery)](#re-engagement-churn-recovery)
- [Player Segmentation](#player-segmentation)
- [Tools (2026)](#tools-2026)
- [Anti-patterns](#anti-patterns)
- [Healthy Live-Ops Principles](#healthy-live-ops-principles)
- [Reference](#reference)

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


## reference: multiplayer-netcode.md

> เดิมคือ skill `multiplayer-netcode` ใน plugin `software-company-gaming` — รวมเข้า `game-development` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Architecture Decision](#architecture-decision)
- [Client-Server Pattern (Most Common)](#client-server-pattern-most-common)
- [Client-Side Prediction (FPS)](#client-side-prediction-fps)
- [Snapshot Interpolation (Other Players)](#snapshot-interpolation-other-players)
- [Lag Compensation (Hit Detection)](#lag-compensation-hit-detection)
- [Replication Strategies](#replication-strategies)
- [Bandwidth Optimization](#bandwidth-optimization)
- [NAT Traversal (P2P)](#nat-traversal-p2p)
- [Matchmaking](#matchmaking)
- [Anti-Cheat Considerations](#anti-cheat-considerations)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# Multiplayer Netcode Patterns

## When to use this skill

- Adding multiplayer to a game
- Choosing networking architecture
- Implementing client-side prediction
- Building lag compensation
- Designing matchmaking
- Reducing bandwidth

## Architecture Decision

```
Game type → Architecture

Fast-paced competitive (FPS, fighter)
   → Client-server with prediction + lag compensation

Strategic / turn-based (RTS, card)
   → Lockstep or client-server (no prediction needed)

Casual co-op (party game)
   → P2P or listen server

MMO
   → Dedicated server + sharding

Asynchronous (Words with Friends)
   → Stateless API, no real-time
```

## Client-Server Pattern (Most Common)

```
Each client:           Server (authority):
- Receives input        - Receives input from all clients
- Sends to server       - Simulates game world
- Renders prediction    - Sends authoritative state
- Reconciles state      - Validates everything
```

### Server tick rate

| Game type | Tick rate |
|-----------|----------:|
| FPS competitive | 64-128 Hz |
| Battle royale | 20-30 Hz |
| MOBA | 30 Hz |
| MMO | 10-30 Hz |
| Casual | 10-20 Hz |
| RTS (lockstep) | 10-25 Hz |

## Client-Side Prediction (FPS)

```csharp
// Client predicts movement locally for responsiveness

public class PredictivePlayer : NetworkBehaviour {
    private Queue<InputState> inputHistory = new();

    void FixedUpdate() {
        if (IsOwner) {
            var input = GatherInput();
            inputHistory.Enqueue(input);

            // Apply locally immediately
            ApplyMovement(input);

            // Send to server
            SendInputToServer(input);
        }
    }

    [ClientRpc]
    void ReceiveServerState(ServerState state) {
        if (!IsOwner) return;

        // Find local state at server's tick
        var predicted = GetPredictedStateAtTick(state.tick);

        if (Vector3.Distance(state.position, predicted.position) > MISPREDICTION_THRESHOLD) {
            // Misprediction: snap to server, replay inputs
            transform.position = state.position;
            ReplayInputsSinceTick(state.tick);
        }

        // Drop old input history
        inputHistory.RemoveBefore(state.tick);
    }
}
```

## Snapshot Interpolation (Other Players)

```csharp
// Other players: render BEHIND server state
// Smooth movement between snapshots

public class InterpolatedRemotePlayer : NetworkBehaviour {
    private SnapshotBuffer<Vector3> positions = new();
    private const float INTERPOLATION_DELAY = 0.1f;  // 100ms behind

    [ClientRpc]
    void ReceivePositionSnapshot(Vector3 pos, float serverTime) {
        positions.Add(serverTime, pos);
    }

    void Update() {
        float renderTime = NetworkTime.time - INTERPOLATION_DELAY;
        Vector3 interpolated = positions.GetInterpolated(renderTime);
        transform.position = interpolated;
    }
}

class SnapshotBuffer<T> {
    private List<(float time, T value)> snapshots = new();

    public T GetInterpolated(float time) {
        // Find two snapshots straddling time
        var before = snapshots.LastOrDefault(s => s.time <= time);
        var after = snapshots.FirstOrDefault(s => s.time > time);

        if (before.time == 0) return after.value;
        if (after.time == 0) return before.value;

        float t = (time - before.time) / (after.time - before.time);
        return Lerp(before.value, after.value, t);
    }
}
```

## Lag Compensation (Hit Detection)

```csharp
// Server rewinds world state to when shooter saw it

public class LagCompensatedHitDetection : NetworkBehaviour {
    private CircularBuffer<WorldSnapshot> history;

    [ServerRpc]
    void ShootRpc(Vector3 origin, Vector3 direction, float clientRenderTime) {
        // Account for: client render delay + network latency
        float rewindTime = clientRenderTime + GetClientLatency(SenderId);

        var snapshot = history.GetAt(rewindTime);

        // Perform raycast in historical state
        foreach (var hitbox in snapshot.hitboxes) {
            if (RayIntersectsBox(origin, direction, hitbox)) {
                ApplyDamage(hitbox.playerId, damage);
                return;
            }
        }
    }
}
```

## Replication Strategies

### Full state every tick (simple, bandwidth-heavy)
```
Server → Client: ALL players' state every tick
Pros: Simple
Cons: Bandwidth scales with player count
```

### Delta compression
```
Server → Client: changed fields only
Pros: 5-10x bandwidth reduction
Cons: Need baseline + complex
```

### Interest management (MMO scale)
```
Server tracks: what does each player need to know?
Only send updates within range / line of sight
Pros: Scales to thousands of players
Cons: Complex; pop-in issues
```

```csharp
public class InterestManager {
    public List<Entity> GetRelevantTo(Player player) {
        return entities.Where(e =>
            Vector3.Distance(player.position, e.position) < INTEREST_RADIUS
            && HasLineOfSight(player, e)
        ).ToList();
    }
}
```

## Bandwidth Optimization

### Quantize

```csharp
// Position within map bounds: 16 bits per axis
// Range: -1000 to +1000, precision: 0.03 units
ushort QuantizePosition(float value) {
    return (ushort)((value + 1000) / 2000 * 65535);
}

float DequantizePosition(ushort q) {
    return (q / 65535f) * 2000 - 1000;
}
```

### Rotation: smallest-3
```csharp
// Quaternion is 4 floats (16 bytes)
// Smallest-3: send 3 smallest components + index of largest (5 bytes)

public struct CompressedQuat {
    public byte largestIndex;  // 2 bits
    public short c1;           // 11 bits each
    public short c2;
    public short c3;
}
```

### Send only on change
```csharp
// Don't send "still" state every tick
// Server: detect changes, send only delta
// Client: assume no change if no update
```

## NAT Traversal (P2P)

```
Both clients behind NAT:

1. Both connect to relay/STUN server
2. Discover their public IP:port
3. Exchange via relay
4. Punch hole: both send packet to each other's public IP:port
5. Now packets can flow direct

If fails (symmetric NAT):
→ Fall back to relay (TURN server)
→ All traffic via relay (more latency, cost)
```

Use existing solutions:
- **STUN**: Discover public IP
- **TURN**: Relay if direct fails
- **WebRTC**: All of above + signaling
- **Steam Networking**: Handles for you
- **EOS Relays**: Epic Online Services

## Matchmaking

### Basic algorithm

```python
async def matchmake(player):
    while True:
        candidates = await find_candidates(
            skill_range=expanding_range(player.wait_time),  # widen over time
            latency_max=expanding_latency(player.wait_time),
            region_priority=player.region,
        )

        if len(candidates) >= MATCH_SIZE - 1:
            match = create_match([player] + candidates[:MATCH_SIZE-1])
            await notify_players(match)
            return match

        await sleep(2)  # check again
```

### Skill-Based (TrueSkill / Glicko-2)

```python
# TrueSkill: Bayesian skill rating
from trueskill import Rating, rate_1vs1

p1 = Rating(mu=25, sigma=8.333)  # initial
p2 = Rating(mu=25, sigma=8.333)

# After p1 wins
new_p1, new_p2 = rate_1vs1(p1, p2)

# Skill estimate: mu - 3*sigma (conservative)
def conservative_skill(rating):
    return rating.mu - 3 * rating.sigma
```

## Anti-Cheat Considerations

### Server-side validation (most important)

```csharp
// Validate every action server-side
[ServerRpc]
void MovePlayer(Vector3 newPosition) {
    float maxMoveDistance = MAX_SPEED * Time.fixedDeltaTime;
    if (Vector3.Distance(currentPosition, newPosition) > maxMoveDistance) {
        // Impossible move - reject + log
        FlagSuspicious("speed hack candidate");
        return;
    }

    currentPosition = newPosition;
}
```

### Common cheats to defend against

| Cheat | Defense |
|-------|---------|
| Speed hack | Server validates max speed |
| Teleport | Server validates max distance per tick |
| Wallhack | Server-side visibility check (interest management) |
| Aimbot | Statistical analysis (impossible accuracy patterns) |
| Damage hack | Server computes damage |
| God mode | Server applies damage authoritatively |

## Common Pitfalls

- ❌ **Client authority over state** — cheating trivial
- ❌ **No lag compensation in FPS** — laggy player can't hit
- ❌ **Snap-only interpolation** — jittery remote players
- ❌ **No rate limiting** — clients can DDoS server
- ❌ **Send full state every frame** — bandwidth catastrophe
- ❌ **TCP for game traffic** — head-of-line blocking
- ❌ **No reconnect** — temporary disconnect = match over

## Reference

- [Gabriel Gambetta's "Fast-Paced Multiplayer" series](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- [Valve Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)
- [Glenn Fiedler / Gaffer on Games](https://gafferongames.com/)
- [Unity Multiplayer Docs](https://docs-multiplayer.unity3d.com/)
- [Photon Fusion docs](https://doc.photonengine.com/fusion/)
- [TrueSkill paper (Microsoft)](https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/)
