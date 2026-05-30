---
name: multiplayer-netcode
description: Use when implementing multiplayer networking — choosing between client-server vs P2P, building lag compensation, client-side prediction, snapshot interpolation, or matchmaking systems. Covers FPS, MOBA, casual game patterns.
---

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
