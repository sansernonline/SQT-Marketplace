---
name: game-architecture
description: Use when choosing game engine, designing core systems (ECS, GameObject, scenes), planning asset pipeline, or structuring large game codebase. Covers Unity, Unreal, Godot, and engine-agnostic patterns.
---

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
