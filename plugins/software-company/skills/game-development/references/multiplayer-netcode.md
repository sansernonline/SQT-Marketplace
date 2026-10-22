> เดิมชื่อ multiplayer-netcode (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-gaming` — รวมเข้า `game-development` ใน v2.0.0

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

> **Which library?** The C# examples below use Unity Netcode for GameObjects (NGO) 1.x style: RPC method names must end in `ServerRpc` / `ClientRpc`, and server time is `NetworkManager.ServerTime`. In NGO 2.x the `[Rpc(SendTo.Server)]` attribute (names ending in `Rpc`) is preferred. Helpers such as `GetPredictedStateAtTick` or `CircularBuffer` are yours to write — treat the blocks as patterns, not drop-in code. Mirror uses different names (`[Command]`, `[ClientRpc]`, `NetworkTime.time`).

## Client-Server Pattern (Most Common)

```
Each client:           Server (authority):
- Receives input        - Receives input from all clients
- Sends to server       - Simulates game world
- Renders prediction    - Sends authoritative state
- Reconciles state      - Validates everything
```

### Server tick rate

This is the one tick-rate table for the whole skill set; other files link here.

| Game type | Tick rate | Known examples (checked 22 Oct 2026) |
|-----------|----------:|---|
| FPS competitive | 64-128 Hz | VALORANT 128 Hz (Riot Games technology blog "VALORANT's 128-Tick Servers") · Counter-Strike 64 Hz (Valve Source Multiplayer Networking wiki) · Overwatch ~63 Hz |
| Battle royale | 20-30 Hz | Battlefield 6 REDSEC 30 Hz (developer statement, 2025) |
| MOBA | ~30 Hz | typical value `(รอยืนยัน)` |
| MMO | 10-30 Hz | typical value `(รอยืนยัน)` |
| Casual | 10-20 Hz | typical value `(รอยืนยัน)` |
| RTS (lockstep) | 10-25 Hz | typical value `(รอยืนยัน)` |

Rule of thumb: pick the lowest rate that still feels right for the game's pace, because bandwidth and server cost grow with the rate.

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
    void ReceiveServerStateClientRpc(ServerState state) {
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
    void ReceivePositionSnapshotClientRpc(Vector3 pos, float serverTime) {
        positions.Add(serverTime, pos);
    }

    void Update() {
        // NGO: estimated server time on this client
        float renderTime = NetworkManager.ServerTime.TimeAsFloat - INTERPOLATION_DELAY;
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
// Server rewinds world state BACK to what the shooter saw
// Valve formula: command time = server now - packet latency - client interpolation delay

public class LagCompensatedHitDetection : NetworkBehaviour {
    private CircularBuffer<WorldSnapshot> history;
    private const float INTERPOLATION_DELAY = 0.1f;  // same value the client renders behind
    private const float MAX_REWIND = 0.25f;          // cap: a high-ping client can't shoot far into the past

    [ServerRpc(RequireOwnership = false)]
    void ShootServerRpc(Vector3 origin, Vector3 direction, ServerRpcParams rpcParams = default) {
        float serverNow = NetworkManager.ServerTime.TimeAsFloat;
        float latency = GetClientLatency(rpcParams.Receive.SenderClientId);  // one-way, seconds

        float rewindTime = serverNow - latency - INTERPOLATION_DELAY;
        rewindTime = Mathf.Max(rewindTime, serverNow - MAX_REWIND);
        // Alternative: the client sends the server-clock time it was rendering;
        // then use that value as it is (no latency added), with the same MAX_REWIND clamp.

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
// Smallest-3: send 3 smallest components + index of largest
// 2 + 3 x 11 = 35 bits -> 5 bytes, but ONLY when bit-packed into one value

public struct CompressedQuat {   // as plain fields this is 1 + 2 + 2 + 2 = 7 bytes
    public byte largestIndex;    // uses 2 bits
    public short c1;             // uses 11 bits each
    public short c2;
    public short c3;
}

// Bit-packed: 35 bits in a ulong, write 5 bytes to the stream
ulong Pack(CompressedQuat q) =>
    ((ulong)q.largestIndex & 0x3)
    | (((ulong)q.c1 & 0x7FF) << 2)
    | (((ulong)q.c2 & 0x7FF) << 13)
    | (((ulong)q.c3 & 0x7FF) << 24);
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
- **Steam Networking**: Handles all of this for you
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

# Matching window on the TrueSkill scale (mu starts at 25, sigma at 8.333).
# Widen by skill points, not by Elo-style hundreds: "within 200" only makes
# sense on an Elo/MMR scale that starts around 1500.
def skill_window(wait_seconds):
    return min(1.0 + 0.1 * wait_seconds, 3 * 8.333)   # +-1 point at first, wider while waiting

def in_range(a, b, wait_seconds):
    return abs(conservative_skill(a) - conservative_skill(b)) <= skill_window(wait_seconds)
```

## Anti-Cheat Considerations

### Server-side validation (most important)

```csharp
// Validate every action server-side
[ServerRpc]
void MovePlayerServerRpc(Vector3 newPosition) {
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

- ❌ **Client authority over state** — cheating becomes trivial
- ❌ **No lag compensation in FPS** — laggy player can't hit
- ❌ **Snap-only interpolation** — other players' movement looks jittery
- ❌ **No rate limiting** — clients can DDoS server
- ❌ **Send full state every frame** — wastes huge bandwidth
- ❌ **TCP for game traffic** — one lost packet holds up all later ones (head-of-line blocking)
- ❌ **No reconnect** — a brief disconnect ends the match

## Reference

- [Gabriel Gambetta's "Fast-Paced Multiplayer" series](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- [Valve Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking)
- [Glenn Fiedler / Gaffer on Games](https://gafferongames.com/)
- [Unity Multiplayer Docs](https://docs-multiplayer.unity3d.com/)
- [Photon Fusion docs](https://doc.photonengine.com/fusion/)
- [TrueSkill paper (Microsoft)](https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/)
