> เดิมคือ skill `edge-computing-architecture` ใน plugin `software-company-iot` — รวมเข้า `iot-systems` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Edge Tier Decision](#edge-tier-decision)
- [When You Need Edge Tier](#when-you-need-edge-tier)
- [Edge Runtime Selection](#edge-runtime-selection)
- [Edge ML Patterns](#edge-ml-patterns)
- [Data Flow Patterns](#data-flow-patterns)
- [Offline-First Sync Patterns](#offline-first-sync-patterns)
- [Local State Management](#local-state-management)
- [Edge Observability](#edge-observability)
- [Edge OTA (Over-the-Air Updates)](#edge-ota-over-the-air-updates)
- [Edge vs Cloud Cost Math](#edge-vs-cloud-cost-math)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# Edge Computing Architecture

## When to use this skill

- Designing an IoT system with an edge gateway tier
- Deploying ML inference at the edge
- Offline-first applications
- Local-first PWA or mobile apps that work with IoT
- Industrial / OT (operational technology) edge computing

## Edge Tier Decision

```
3 tiers:                What runs there:
┌──────────────┐
│   Cloud      │  ←  Cross-site analytics, ML training, long-term storage
├──────────────┤
│   Edge GW    │  ←  Site aggregation, local rules, ML inference
├──────────────┤
│   Devices    │  ←  Sensors, actuators, real-time control
└──────────────┘
```

## When You Need Edge Tier

| Need | Edge required? |
|------|:--------------:|
| Sub-100ms latency | ✅ |
| Keep working when the cloud is down | ✅ |
| Limited bandwidth back to the cloud | ✅ |
| Data must stay local (privacy) | ✅ |
| Many devices per site | Often |
| Few cheap devices with a fast WAN link | ❌ |

## Edge Runtime Selection

### Heavyweight (full Linux)

| Runtime | Best for |
|---------|----------|
| **K3s** | Lightweight Kubernetes |
| **MicroK8s** | Ubuntu environments |
| **Balena** | Managed fleet, OTA |
| **AWS Greengrass** | Teams already on AWS |
| **Azure IoT Edge** | Teams already on Azure |

### Lightweight (containers, no orchestrator)

| Runtime | Best for |
|---------|----------|
| **Docker Compose** | Single host |
| **podman** | Rootless containers |
| **containerd** | Minimal footprint |
| **WasmEdge** | WebAssembly at edge |

### Embedded (no containers)

| Runtime | Best for |
|---------|----------|
| **Bare RTOS** | Tiny MCUs |
| **Zephyr** | Modern embedded |
| **NerveOS** | Elixir embedded |

## Edge ML Patterns

### Model Optimization Pipeline

```
Cloud-trained model (e.g., ResNet-50)
    ↓
Knowledge distillation → student model
    ↓
Pruning → remove weak connections
    ↓
Quantization → FP32 → INT8 (or INT4)
    ↓
Compile → ONNX / TFLite / TVM
    ↓
Deploy → edge inference (10-100x smaller)
```

### Inference Frameworks

| Framework | Hardware |
|-----------|----------|
| **TFLite (Micro)** | MCUs, mobile |
| **ONNX Runtime Mobile** | Mobile, edge |
| **NVIDIA TensorRT** | NVIDIA Jetson |
| **OpenVINO** | Intel CPUs/VPUs |
| **Coral Edge TPU** | Google Coral |
| **Apache TVM** | Cross-platform |

### Hard Cascade

```python
# Easy cases: edge model
# Hard cases: cloud model

async def predict(input):
    edge_result = await edge_model.predict(input)

    if edge_result.confidence > 0.85:
        return edge_result

    # Low confidence → cloud
    return await cloud_model.predict(input)
```

## Data Flow Patterns

### Pattern: Local Aggregation

```
Devices → Edge GW (aggregate, dedupe)
   1Hz       0.1Hz to cloud

Reduces bandwidth, cost
```

### Pattern: Store-and-Forward

```python
# Edge buffers when offline
class EdgeBuffer:
    def __init__(self, max_size_mb=1000):
        self.queue = persistent_queue("buffer")

    async def send(self, data):
        if cloud.reachable:
            try:
                await cloud.send(data)
                return
            except:
                pass

        # Buffer locally
        self.queue.put(data)
        self.evict_old_if_needed()

    async def background_sync(self):
        while True:
            if cloud.reachable and not self.queue.empty():
                batch = self.queue.get_batch(100)
                try:
                    await cloud.send_batch(batch)
                    self.queue.commit(batch)
                except:
                    self.queue.rollback()
            await asyncio.sleep(5)
```

### Pattern: Edge-Triggered Cloud

```
Normal: edge handles locally
Trigger event: send detailed data + context to cloud

Example: factory floor
- Edge monitors all sensors continuously
- Detects anomaly
- Sends 60 seconds of context (before+after) to cloud
- Cloud notifies humans, analyzes
```

## Offline-First Sync Patterns

### Pattern: CRDTs (Conflict-Free Replicated Data Types)

```
Strengths:
- Convergence without coordination
- Works fully offline
- Eventually consistent

Use for:
- Counters
- Sets
- Order-independent operations

Libraries: Automerge, Yjs, RxDB
```

### Pattern: Operational Transform

```
Operations queued locally
Sent to server when online
Server resolves conflicts
Pushed back to all clients

Use for:
- Collaborative editing (Google Docs-like)
- Hierarchical data
```

### Pattern: Last-Write-Wins

```
Simplest
Each record has timestamp + writer ID
Higher timestamp wins
Ties broken by writer ID

Use for:
- Non-critical config
- Where coordination not needed
- Where last write is right
```

## Local State Management

```typescript
// Local store mirrors cloud
interface LocalStore {
  entities: Map<EntityId, Entity>;
  pendingOps: Operation[];
  conflicts: Conflict[];
  syncState: 'online' | 'offline' | 'syncing';
  lastSyncAt: Timestamp;
}

// All UI reads from local
// All writes append to pendingOps
// Background sync handles cloud
```

## Edge Observability

```
Each edge device/gateway:
- Logs → ship to cloud (buffered)
- Metrics → push to TSDB
- Traces → sample + ship
- Health → frequent heartbeat

Trade-off: observability vs bandwidth
```

Tools:
- OpenTelemetry Collector (edge)
- Vector / Fluent Bit (log forwarders)
- Prometheus + remote_write
- Loki, Tempo, Mimir

## Edge OTA (Over-the-Air Updates)

### Layers
```
1. Firmware (rarely)
2. OS / runtime (occasionally)
3. App containers (frequently)
4. Config (very frequently)
```

### Safe rollout
```
Stage 1: 1% of fleet (canary)
Wait 24h, check metrics
Stage 2: 10%
Wait 24h
Stage 3: 100%

Auto-rollback if:
- Crash rate > X%
- Connectivity drops > Y%
- Manual stop
```

## Edge vs Cloud Cost Math

```
Cloud-heavy:
- Lower upfront device cost
- Higher recurring cloud cost
- Bandwidth costs add up

Edge-heavy:
- Higher upfront device cost
- Lower recurring costs
- Hardware refresh every 3-5 years

Break-even depends on:
- Device count
- Data volume per device
- Compute intensity
- Bandwidth cost in region
```

## Things You Don't Do

- ❌ Push a state-of-the-art LLM to the edge (it won't fit)
- ❌ Leave offline mode out of the spec
- ❌ Sync everything (sync only what is needed)
- ❌ Forget time sync (NTP / chrony — events can't be ordered without it)
- ❌ Trust in one direction only (edge must verify cloud, and cloud must verify edge)
- ❌ Ship OTA without testing the rollback path

## Reference

- [Edge Computing Consortium](https://www.edgecomputing-consortium.org/)
- [CNCF Edge Whitepaper](https://www.cncf.io/blog/cloud-native-edge-computing/)
- [AWS Greengrass Documentation](https://docs.aws.amazon.com/greengrass/)
- [Azure IoT Edge](https://azure.microsoft.com/en-us/products/iot-edge)
- [Balena Documentation](https://docs.balena.io/)
