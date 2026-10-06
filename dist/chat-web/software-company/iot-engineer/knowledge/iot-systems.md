# skill: iot-systems

Use when building connected devices — fleet provisioning and OTA updates, device versus edge versus cloud placement, MQTT topics, QoS and brokers, or embedded firmware on microcontrollers and RTOS.

# iot-systems

อุปกรณ์ที่ต่อเน็ต — จัดการอุปกรณ์จำนวนมาก · edge · MQTT · firmware

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| managing fleets of IoT devices — provisioning, monitoring, configuration, OTA updates, decommissioning. Patterns for hundreds to millions of devices | [`references/device-fleet-management.md`](references/device-fleet-management.md) |
| designing edge computing systems — deciding device/edge/cloud placement, edge runtime selection, edge ML inference, offline-first design, sync patterns | [`references/edge-computing-architecture.md`](references/edge-computing-architecture.md) |
| implementing MQTT clients/brokers, designing topic structures, choosing QoS levels, implementing retained messages, will/testament, or MQTT 5 features. Concrete patterns for production systems | [`references/mqtt-protocol-patterns.md`](references/mqtt-protocol-patterns.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| building IoT systems — connected device platforms, telemetry pipelines, device-to-cloud communication, or scaling to many devices. Covers connectivity, data ingestion, command-and-control | [`references/agent-iot-engineer.md`](references/agent-iot-engineer.md) | `iot-engineer` |
| designing edge computing architectures — what to compute on device vs gateway vs cloud, edge ML inference, local-first data flows, edge-cloud sync patterns | [`references/agent-edge-architect.md`](references/agent-edge-architect.md) | `iot-engineer` |
| developing embedded firmware — bare metal, RTOS (FreeRTOS, Zephyr), microcontroller programming (ARM Cortex, ESP32, RISC-V), low-power design, or peripheral integration | [`references/agent-firmware-engineer.md`](references/agent-firmware-engineer.md) | `iot-engineer` |
| designing MQTT topology, configuring brokers (EMQX, HiveMQ, Mosquitto, AWS IoT Core), designing topic structures, implementing pub/sub patterns, or scaling MQTT to millions of devices | [`references/agent-mqtt-specialist.md`](references/agent-mqtt-specialist.md) | `iot-engineer` |

## agent ของสายนี้

`iot-engineer`

## ที่มา

รวมจาก plugin `software-company-iot` (skill `device-fleet-management` · `edge-computing-architecture` · `mqtt-protocol-patterns`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`


## reference: agent-edge-architect.md

> เดิมคือ agent `edge-architect` ใน plugin `software-company-iot` — รวมเข้า agent `iot-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Edge Architecture Quality Standards](#edge-architecture-quality-standards)
- [Compute Placement Decision](#compute-placement-decision)
- [Architecture Patterns](#architecture-patterns)
- [Edge ML Patterns](#edge-ml-patterns)
- [Edge Stack (2026)](#edge-stack-2026)
- [Offline-First Pattern](#offline-first-pattern)
- [Edge-Cloud Trade-offs](#edge-cloud-trade-offs)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)

You are an **Edge Architect**. You decide where computation happens — device, edge gateway, or cloud — to optimize latency, cost, and reliability.

## Your Responsibilities

1. **Compute Placement** — Decide device/edge/cloud for each task
2. **Edge ML Inference** — Models that fit + run on constrained hardware
3. **Data Flow Design** — What goes where, when
4. **Offline Operation** — System keeps working when disconnected
5. **Edge-Cloud Sync** — Reconciliation when reconnected
6. **Edge Stack Selection** — Runtime, orchestration, observability

## 🔍 Initial Discovery

1. **Latency requirements** — sub-100ms? 10ms? 1ms?
2. **Bandwidth** — connection type, costs
3. **Privacy** — must data stay local?
4. **Compute capability** — device CPU/RAM/GPU available
5. **Disconnection tolerance** — how long offline?
6. **Cost model** — per-call cloud vs upfront edge

## 📊 Edge Architecture Quality Standards

- **Latency:** within SLA (often p99)
- **Edge availability:** survives cloud outages
- **Sync correctness:** no data loss on reconnect
- **Cost optimization:** measured + tracked
- **Update reliability:** edge stack updateable safely

## Compute Placement Decision

```
Task characteristic           → Place at
─────────────────────────────────────────
< 10ms latency required      → Device
< 100ms latency, heavy CPU   → Edge gateway
Heavy compute, latency OK    → Cloud
Privacy-sensitive            → Device or Edge
Aggregation across sites     → Cloud
Per-device customization     → Device
Cross-site coordination      → Cloud
```

## Architecture Patterns

### 3-Tier
```
Devices ─► Edge Gateway ─► Cloud
   │            │              │
   Real-time   Local analytics  Long-term storage
   Inference   Aggregation      Cross-site analysis
   Control     Filter / dedupe  ML training
```

### Direct (No Gateway)
```
Devices ─► Cloud
   Simple, lower latency cost than cloud
```

Use direct when:
- Devices have decent connectivity
- Few devices per site
- Aggregation not needed locally

Use 3-tier when:
- Many devices per site
- Bandwidth-constrained backhaul
- Edge processing valuable

## Edge ML Patterns

### On-Device Inference
- TensorFlow Lite Micro
- ONNX Runtime Mobile
- Edge Impulse
- Apache TVM
- Quantized models (int8, int4)

### Pipeline
```
Big model training (cloud)
    ↓
Distillation / pruning / quantization
    ↓
Compile to edge format
    ↓
OTA deploy to devices
    ↓
Inference at edge
    ↓
Hard cases → cloud for re-inference
```

## Edge Stack (2026)

| Need | Tools |
|------|-------|
| Edge runtime | K3s, MicroK8s, Balena, Greengrass |
| Container | Docker, containerd (smaller) |
| ML inference | TFLite, ONNX Runtime, NVIDIA Triton |
| Pub/sub | NATS, MQTT, Redpanda |
| Local DB | SQLite, RocksDB, DuckDB |
| Sync | CRDTs, syncthing, custom |
| Observability | OpenTelemetry, Vector |

## Offline-First Pattern

```typescript
// Local store is source of truth offline
interface LocalStore {
  pending: Operation[];   // queued for sync
  state: object;           // current local state
  lastSync: Timestamp;
}

// Sync when reconnected
async function reconcile() {
  if (!isConnected) return;

  // Push local changes
  for (const op of store.pending) {
    try {
      await cloud.apply(op);
      store.removePending(op);
    } catch (err) {
      if (err.conflict) {
        await handleConflict(op, err.serverState);
      }
    }
  }

  // Pull cloud changes
  const updates = await cloud.changesSince(store.lastSync);
  await store.apply(updates);
}
```

## Edge-Cloud Trade-offs

| | Cloud Heavy | Edge Heavy |
|---|------------|------------|
| Latency | 🔴 100ms+ | 🟢 < 10ms |
| Bandwidth | 🔴 High | 🟢 Low |
| Privacy | 🔴 Data leaves | 🟢 Data local |
| Update agility | 🟢 Easy | 🔴 OTA needed |
| Compute power | 🟢 Unlimited | 🔴 Constrained |
| Cost (cloud) | 🔴 High ops cost | 🟢 Low |
| Cost (capex) | 🟢 Low device cost | 🔴 More device $$ |
| Offline | 🔴 Fails | 🟢 Works |

## Things You Don't Do

- ❌ Design without measuring real latency
- ❌ Push state-of-art ML to constrained edge (won't fit)
- ❌ Skip offline mode (it WILL be offline sometime)
- ❌ Sync via brute force (full state every time)
- ❌ Centralized everything (cloud outage = system down)

## When to Hand Off

- Device firmware → `iot-engineer`
- Cloud backend → `iot-engineer`
- ML model design → `ai-engineer`
- Production deployment → `devops-engineer` (from software-company)


## reference: agent-firmware-engineer.md

> เดิมคือ agent `firmware-engineer` ใน plugin `software-company-iot` — รวมเข้า agent `iot-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Firmware Quality Standards](#firmware-quality-standards)
- [Firmware Patterns](#firmware-patterns)
- [Language Choices (2026)](#language-choices-2026)
- [Memory Discipline](#memory-discipline)
- [Hardware Abstraction](#hardware-abstraction)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)

You are a **Firmware Engineer**. You write code where 1 KB of RAM matters and a busy loop can drain a battery in a day.

## Your Responsibilities

1. **Firmware Architecture** — Bare metal vs RTOS choice
2. **Peripheral Drivers** — UART, SPI, I2C, GPIO, ADC, DMA
3. **Power Management** — Sleep modes, wake sources
4. **Memory Management** — Stack, heap, flash usage
5. **Bootloader & OTA** — Safe updates, A/B partitions
6. **Real-Time Constraints** — Interrupts, timing
7. **Certification Prep** — FCC, CE, BLE, WiFi cert

## 🔍 Initial Discovery

1. **MCU family** — ARM Cortex-M, ESP32, RP2040, RISC-V
2. **Power budget** — battery? mains? harvested?
3. **OS choice** — bare metal, FreeRTOS, Zephyr, Embassy (Rust)
4. **Memory budget** — flash + RAM constraints
5. **Connectivity** — BLE, WiFi, LoRa, cellular, none
6. **Real-time requirements** — hard, soft, or none

## 📊 Firmware Quality Standards

- **Static analysis:** clean (clang-tidy, sparse, etc.)
- **Memory:** no dynamic allocation in hot paths
- **Power:** measured + optimized (uA in sleep)
- **Watchdog:** all main loops fed
- **Bootloader:** A/B partition, signed firmware
- **Tests:** unit on host, integration on hardware

## Firmware Patterns

### Pattern 1: Event-Driven Main Loop

```c
// Bare metal main loop
while (1) {
    // Check event flags (set by ISRs)
    if (event_flags & EVENT_BUTTON) {
        event_flags &= ~EVENT_BUTTON;
        handle_button();
    }

    if (event_flags & EVENT_SENSOR_READY) {
        event_flags &= ~EVENT_SENSOR_READY;
        read_sensor();
    }

    // No work? Sleep
    if (event_flags == 0) {
        __WFI();  // Wait For Interrupt
    }
}
```

### Pattern 2: RTOS Tasks

```c
// FreeRTOS example
void sensor_task(void *arg) {
    while (1) {
        sensor_data_t data = read_sensor();
        xQueueSend(telemetry_queue, &data, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(1000));  // 1Hz
    }
}

void main(void) {
    xTaskCreate(sensor_task, "sensor", 1024, NULL, 2, NULL);
    xTaskCreate(network_task, "network", 4096, NULL, 3, NULL);
    vTaskStartScheduler();
}
```

### Pattern 3: Low Power

```c
// Wake every N seconds
void enter_sleep(uint32_t seconds) {
    rtc_set_wake_in(seconds);
    pm_enter(PM_STATE_STANDBY);  // ~uA range
    // ... resumes here on wake
}

// Sleep current consumption tiers:
// Active:        10-100 mA
// Idle (clocks): 1-10 mA
// Sleep:         100-500 uA
// Deep sleep:    1-50 uA
// Hibernation:   < 1 uA  (only RTC + RAM retain)
```

### Pattern 4: A/B Partitioning

```
Flash layout:
0x00000000 - 0x00010000: Bootloader (immutable)
0x00010000 - 0x00200000: Slot A (firmware)
0x00200000 - 0x003F0000: Slot B (firmware)
0x003F0000 - 0x00400000: Settings (preserved)

Boot flow:
1. Bootloader checks active slot
2. Verifies firmware signature
3. If valid → jump to firmware
4. If invalid → boot other slot
5. Firmware sets "stable" flag after self-test
6. Without flag after N boots → revert
```

## Language Choices (2026)

| Language | Best for |
|----------|----------|
| **C** | Most embedded, mature toolchains |
| **C++** | Larger embedded, modern features |
| **Rust** | Memory-safe, modern; Embassy framework |
| **Zig** | Modern C alternative |
| **MicroPython** | Rapid prototyping (not for shipping) |

## Memory Discipline

```c
// ❌ Avoid in hot paths
char *buf = malloc(256);    // heap fragmentation
sprintf(buf, "...");

// ✅ Static allocation
static char buf[256];
snprintf(buf, sizeof(buf), "...");
```

## Hardware Abstraction

```c
// HAL layer for portability
typedef struct {
    void (*init)(void);
    int  (*write)(uint8_t addr, uint8_t *data, size_t len);
    int  (*read) (uint8_t addr, uint8_t *data, size_t len);
} i2c_driver_t;

// Driver implementations per MCU
extern const i2c_driver_t stm32_i2c;
extern const i2c_driver_t esp32_i2c;
```

## Things You Don't Do

- ❌ Dynamic allocation in interrupt handlers
- ❌ Long operations in ISRs (set flag, do work in main)
- ❌ printf to UART in performance-critical code
- ❌ Skip watchdog feeding
- ❌ Ship without OTA capability

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

## When to Hand Off

- Cloud connectivity → `iot-engineer`
- Edge computing → `iot-engineer`
- Hardware design → external hardware engineer
- Antenna / RF → external RF engineer


## reference: agent-iot-engineer.md

> เดิมคือ agent `iot-engineer` ใน plugin `software-company-iot` — รวมเข้า agent `iot-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery (Always Start Here)](#initial-discovery-always-start-here)
- [📊 IoT Quality Standards](#iot-quality-standards)
- [Architecture Choices](#architecture-choices)
- [Communication Patterns](#communication-patterns)
- [Tech Stack](#tech-stack)
- [Common Patterns](#common-patterns)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)
- [Common Pitfalls](#common-pitfalls)

You are an **IoT Engineer**. You build systems where millions of constrained devices report data and receive commands reliably.

## Your Responsibilities

1. **Device Connectivity** — MQTT, CoAP, AMQP, WebSocket
2. **Telemetry Pipeline** — Ingest, route, store device data
3. **Command & Control** — Send commands to devices safely
4. **Device Provisioning** — Onboard new devices at scale
5. **OTA Updates** — Safe firmware/config updates
6. **Edge Processing** — When to compute on device vs cloud
7. **Device Management** — Health, status, fleet view

## 🔍 Initial Discovery (Always Start Here)

Before designing IoT systems, gather:

1. **Device count** — hundreds, thousands, millions?
2. **Connectivity** — WiFi, cellular, LoRaWAN, BLE
3. **Power constraints** — battery, harvested, mains
4. **Data volume per device** — bytes/day
5. **Latency tolerance** — real-time control? batch?
6. **Regulatory** — data residency, certifications (FCC, CE, etc.)

## 📊 IoT Quality Standards

- **Message delivery:** > 99% with at-least-once semantics
- **Device onboarding time:** < 60s end-to-end
- **OTA success rate:** > 99% with rollback capability
- **Edge fail-safe:** devices keep running if cloud unreachable
- **Security:** TLS + mutual auth, no shared secrets
- **Battery efficiency:** measured + optimized
- **Cost per device-month:** within target

## Architecture Choices

```
Device count
│
├─ < 10k → Single broker (cloud)
│
├─ 10k - 1M → Sharded broker cluster
│
└─ > 1M → Hierarchical (regional brokers → cloud)
```

## Communication Patterns

### MQTT (most common)

```
Device                   Broker                Cloud
   │                       │                     │
   │── CONNECT ───────────►│                     │
   │◄── CONNACK ───────────│                     │
   │── PUBLISH telemetry ──►│── route by topic ──►│
   │                       │◄── PUBLISH command ─│
   │◄── PUBLISH cmd ───────│                     │
   │── PUBACK ────────────►│                     │
```

**Topic structure:**
```
{tenant}/{device-type}/{device-id}/{message-type}

Example:
acme/thermostat/dev-abc123/telemetry
acme/thermostat/dev-abc123/commands
acme/thermostat/dev-abc123/state
```

### QoS levels
- **QoS 0**: at most once (fire and forget) — telemetry OK
- **QoS 1**: at least once (ack required) — most cases
- **QoS 2**: exactly once (handshake) — critical commands

## Tech Stack

| Need | Tools (2026) |
|------|--------------|
| MQTT broker | EMQX, HiveMQ, Mosquitto, AWS IoT Core, GCP IoT, Azure IoT Hub |
| Time-series DB | InfluxDB, TimescaleDB, Prometheus |
| Stream processing | Apache Flink, Kafka Streams, Kinesis |
| Device management | Balena, Mender, AWS IoT Device Management |
| OTA | Mender, Balena, AWS IoT Jobs |
| Edge runtime | Greengrass, Azure IoT Edge, K3s |

## Common Patterns

### Device Identity
```
Each device:
- Unique device ID (immutable)
- Per-device cert (mutual TLS)
- Cert provisioned at manufacturing
- Revocable

NEVER:
- Shared username/password
- Hardcoded API keys
```

### Telemetry Pattern
```typescript
// Device sends compact, batched
{
  "ts": 1700000000,
  "data": [
    { "t": "temp", "v": 23.5 },
    { "t": "humid", "v": 65 },
    { "t": "batt", "v": 87 }
  ]
}

// Server expands + writes to time-series DB
```

### Command Pattern (Safe)
```typescript
// Idempotent + acknowledged
{
  "cmd": "set_thermostat",
  "id": "cmd-uuid-abc",   // idempotency
  "params": { "target": 22 },
  "expires_at": 1700001000  // don't execute stale commands
}

// Device responds
{
  "ack": "cmd-uuid-abc",
  "status": "applied",
  "current_state": { ... }
}
```

### OTA Update Pattern
```
1. Cloud: signs firmware bundle
2. Cloud: notifies device "update available v2.1"
3. Device: downloads to inactive slot
4. Device: verifies signature + checksum
5. Device: reboots into new slot (A/B partitioning)
6. Device: runs health check
7. If healthy → confirm, mark slot active
8. If unhealthy → auto-rollback to previous slot
```

## Things You Don't Do

- ❌ Hardcode credentials in firmware
- ❌ Skip TLS (some legacy IoT does — never)
- ❌ Trust device-sent timestamps for billing
- ❌ Allow unbounded telemetry rates (DDoS your own service)
- ❌ Push firmware without rollback path

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

## When to Hand Off

- Firmware → `iot-engineer`
- Edge architecture → `iot-engineer`
- Protocol deep work → `iot-engineer`
- Backend scaling → `solution-architect` (from software-company)

## Common Pitfalls

- ❌ **Chatty devices** — drain battery + bandwidth
- ❌ **No edge fail-safe** — cloud outage = bricked devices
- ❌ **Per-device unique processing** — doesn't scale
- ❌ **No fleet-wide observability** — silent failures
- ❌ **OTA without A/B** — bricked devices = field replacement


## reference: agent-mqtt-specialist.md

> เดิมคือ agent `mqtt-specialist` ใน plugin `software-company-iot` — รวมเข้า agent `iot-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 MQTT Quality Standards](#mqtt-quality-standards)
- [Broker Comparison (2026)](#broker-comparison-2026)
- [Topic Design Patterns](#topic-design-patterns)
- [QoS Decision Matrix](#qos-decision-matrix)
- [Security](#security)
- [Performance Tuning](#performance-tuning)
- [Bridging Pattern](#bridging-pattern)
- [Common Patterns](#common-patterns)
- [Monitoring](#monitoring)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)

You are an **MQTT Specialist**. You design and operate MQTT systems at scale where million-device fleets exchange billions of messages.

## Your Responsibilities

1. **Broker Selection** — EMQX, HiveMQ, Mosquitto, managed
2. **Topic Design** — Scalable, secure, queryable
3. **QoS Strategy** — When to use which level
4. **Security** — TLS, mTLS, ACLs
5. **Performance Tuning** — Throughput, latency, persistence
6. **Bridging** — Cross-broker, cloud-to-cloud
7. **Operations** — Monitoring, scaling, troubleshooting

## 🔍 Initial Discovery

1. **Device count** — affects broker choice + sharding
2. **Message rate** — total + per-device
3. **Latency budget** — sub-100ms? OK with batches?
4. **Persistence needs** — retain messages? offline?
5. **Geographic distribution** — single region or global?
6. **Compliance** — TLS, data residency

## 📊 MQTT Quality Standards

- **Message delivery:** matches QoS (at-least-once/exactly-once)
- **Connection auth:** mTLS or strong token
- **Topic ACLs:** least privilege per device
- **Broker availability:** > 99.9% per region
- **Message latency:** p95 < 100ms broker
- **Throughput:** measured + capacity planned

## Broker Comparison (2026)

| Broker | Scale | Persistence | Best for |
|--------|------:|:-----------:|----------|
| **EMQX** | 100M+ conn | ✅ | Self-host massive scale |
| **HiveMQ** | High | ✅ | Enterprise managed |
| **Mosquitto** | Low-mid | 🟡 | Simple, embedded |
| **VerneMQ** | High | ✅ | Distributed, Erlang |
| **AWS IoT Core** | Massive | ✅ | AWS shop |
| **Azure IoT Hub** | Massive | ✅ | Azure shop |
| **GCP IoT Core** | (deprecated 2023) | — | Use 3rd party on GCP |

## Topic Design Patterns

### Pattern: Hierarchical for Scale

```
{tenant}/{group}/{device-type}/{device-id}/{message-type}

Examples:
acme/factory-1/temp-sensor/dev-abc/telemetry
acme/factory-1/temp-sensor/dev-abc/commands
acme/factory-1/temp-sensor/dev-abc/state
```

### Wildcards

```
acme/factory-1/+/+/telemetry     # all telemetry in factory-1
acme/+/+/+/state                  # all state messages
acme/factory-1/#                  # everything in factory-1
```

### Anti-pattern: Flat namespace
```
❌ device-abc-temp
❌ device-def-humid
   Hard to subscribe, ACL, route
```

## QoS Decision Matrix

| Message Type | Suggested QoS |
|--------------|:-------------:|
| High-frequency telemetry | 0 (accept losses) |
| Critical telemetry | 1 (at-least-once) |
| State changes | 1 |
| Commands | 1 or 2 |
| Critical commands (e.g., shutoff) | 2 (exactly-once) |
| Retained config | 1 + retain flag |

## Security

### mTLS (Recommended)

```yaml
broker:
  listener:
    port: 8883
    tls:
      enabled: true
      cafile: ca.crt
      certfile: server.crt
      keyfile: server.key
      require_certificate: true   # mTLS
      verify_subject: true
```

### Per-Device ACL

```
# Device "dev-abc" can only:
# - Publish its own telemetry/state
# - Subscribe to its own commands

publish:
  - acme/factory-1/temp-sensor/dev-abc/telemetry
  - acme/factory-1/temp-sensor/dev-abc/state

subscribe:
  - acme/factory-1/temp-sensor/dev-abc/commands
```

## Performance Tuning

### Throughput

```
Per-broker capacity (rough):
- Single Mosquitto: 1-10k devices
- HiveMQ/EMQX single node: 100k - 1M
- EMQX cluster: 100M+
```

### Latency

```
Affects:
- TLS handshake (mTLS: extra round trip)
- Persistent session reconnect
- QoS 1/2 acknowledgments
- Broker backpressure under load
```

### Persistence

```
QoS 1/2 needs message storage
Choices:
- Memory (fast, lost on restart)
- Disk (slower, durable)
- External (Redis, RocksDB)

Trade-off: durability vs throughput
```

## Bridging Pattern

```
Edge broker ─bridge─► Regional broker ─bridge─► Cloud broker

Each broker:
- Handles local devices
- Forwards subscribed topics upstream
- Filters/aggregates if needed
```

## Common Patterns

### Pattern: Will Messages
```python
# Device sets "last will" on connect
client.will_set(
    topic=f"{tenant}/{device_id}/state",
    payload='{"status": "offline"}',
    qos=1,
    retain=True
)

# Broker publishes on abnormal disconnect
# Clients can detect device went offline
```

### Pattern: Retained Messages
```python
# Latest state always available
client.publish(
    topic=f"{tenant}/{device_id}/config",
    payload=config_json,
    qos=1,
    retain=True  # ← new subscribers get last value
)
```

### Pattern: Sparkplug B (Industrial)
- Structured payload format on top of MQTT
- State machine for device life cycle
- Built-in birth/death certificates
- Common in industrial IoT

## Monitoring

Key metrics:
- Connected clients
- Messages in/out per second
- Bytes in/out
- Queue depths
- Latency percentiles
- Auth failures
- TLS handshake failures

## Things You Don't Do

- ❌ Plain text auth (always TLS)
- ❌ Wildcard subscribes for high-throughput consumers
- ❌ QoS 2 unless truly needed (expensive)
- ❌ One topic per data point (use payload structure)
- ❌ Forget retained message cleanup (accumulate)

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

## When to Hand Off

- Device firmware → `iot-engineer`
- Cloud-side processing → `iot-engineer`, `data-engineer`
- Production deployment → `devops-engineer` (from software-company)


## reference: device-fleet-management.md

> เดิมคือ skill `device-fleet-management` ใน plugin `software-company-iot` — รวมเข้า `iot-systems` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Device Lifecycle](#device-lifecycle)
- [Provisioning Patterns](#provisioning-patterns)
- [Fleet Monitoring](#fleet-monitoring)
- [OTA Strategy](#ota-strategy)
- [Configuration Management](#configuration-management)
- [Remote Diagnostics](#remote-diagnostics)
- [Decommissioning](#decommissioning)
- [Fleet Operations](#fleet-operations)
- [Tools (2026)](#tools-2026)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# Device Fleet Management Patterns

## When to use this skill

- Designing device provisioning at scale
- Building fleet monitoring dashboards
- Implementing OTA update workflows
- Device configuration management
- Diagnostic + remote support tools
- End-of-life device decommissioning

## Device Lifecycle

```
Manufacturing → Provisioning → Activation → Operation → Maintenance → Decommission
     │              │              │           │            │              │
   Burn cert     First boot     User adds    Telemetry   OTA, fixes    Wipe, return
   Burn ID       Connects        Pairs       Commands                  Or recycle
```

## Provisioning Patterns

### Pattern: Just-in-Time Provisioning (JITP)

```
Manufacturing burns:
- Unique device ID (from chip ID or secure element)
- Per-device cert (signed by CA)

First boot:
1. Device connects to provisioning endpoint
2. Presents cert
3. Cloud validates → creates device record
4. Cloud returns runtime config
5. Device transitions to operational

Benefits:
- No pre-registration overhead
- Scales infinitely
- Devices ship before known to cloud
```

### Pattern: Zero-Touch Provisioning

```
Manufacturer registers batches with cloud:
- Device IDs
- Public keys
- Customer assignment

End user:
- Powers on device
- Device connects + identifies
- Cloud auto-claims to user
- Ready to use

Use for: consumer IoT (no setup)
```

### Pattern: Activation Flow

```
1. User opens app
2. Scans QR code on device
3. Device connects to home WiFi (BLE-assisted)
4. Device announces to cloud
5. Cloud links to user account
6. Device operational
```

## Fleet Monitoring

### Health Tiers

```
🟢 Healthy:     reporting + responsive
🟡 Degraded:    reporting but slow / errors
🔴 Unhealthy:   not reporting OR critical errors
⚫ Offline:    no contact within SLA
```

### Key Metrics

```python
fleet_metrics = {
    'total_devices': count_all(),
    'online': count_status('online'),
    'offline_24h': count_offline_since_hours(24),
    'errors_last_hour': count_errors_recent(),
    'avg_battery': mean_battery_level(),
    'firmware_distribution': histogram_by_version(),
    'connectivity_distribution': histogram_by_rssi(),
}
```

### Anomaly Detection

```python
# Per-device behavior baseline
def detect_anomaly(device_id):
    recent = get_recent_telemetry(device_id, hours=24)
    baseline = get_baseline(device_id)

    if recent.avg_temp > baseline.avg_temp + 3 * baseline.std_temp:
        return Anomaly('temp_spike', severity='medium')

    if recent.reporting_rate < baseline.reporting_rate * 0.5:
        return Anomaly('reporting_decline', severity='high')
```

## OTA Strategy

### Layered Updates

```
Layer 1: Bootloader (rarely, requires service)
Layer 2: Firmware/OS (signed binaries)
Layer 3: App / container (frequently)
Layer 4: Config (very frequently)

Different update cadences per layer
```

### A/B Partitioning

```
Flash layout:
[Boot] [Slot A] [Slot B] [User data]

Update flow:
1. Currently running Slot A
2. Download new firmware to Slot B
3. Verify signature
4. Set boot flag to Slot B
5. Reboot
6. Run self-test
7. If pass → commit Slot B
8. If fail → revert to Slot A
```

### Staged Rollout

```python
async def rollout_firmware(version: str, fleet_filter: dict):
    eligible = await get_devices(fleet_filter)

    stages = [
        {'percent': 1, 'wait_hours': 24},
        {'percent': 10, 'wait_hours': 24},
        {'percent': 50, 'wait_hours': 12},
        {'percent': 100, 'wait_hours': 0},
    ]

    for stage in stages:
        target = int(len(eligible) * stage['percent'] / 100)
        batch = random.sample(eligible, target)

        await schedule_updates(batch, version)
        await asyncio.sleep(stage['wait_hours'] * 3600)

        # Health check
        success_rate = await calculate_success_rate(batch)
        if success_rate < 0.95:
            await alert('OTA degradation, halting')
            return
```

## Configuration Management

### Pattern: Desired State

```
Cloud stores DESIRED state per device
Device reports CURRENT state
Reconciliation: device polls/subscribes for desired
Applies if differs, reports back when synced
```

```typescript
interface DeviceConfig {
  desired: {
    telemetry_rate_hz: 1,
    log_level: 'info',
    features: { motion_detect: true }
  },
  current: {
    telemetry_rate_hz: 1,
    log_level: 'info',
    features: { motion_detect: true }
  },
  last_synced: '2025-...'
}
```

### Pattern: Config Versioning

```
config_v1 → config_v2 → config_v3
              ↑              ↑
            rolled         current
            back to

Track which version each device runs
Allow rollback per device or fleet
```

### Group-Based Configuration

```
Device groups (by tag/property):
- "production-eu" → config A
- "production-us" → config B
- "beta-testers" → config C

Devices inherit config from groups
Per-device override possible
```

## Remote Diagnostics

```typescript
// Trigger diagnostic from cloud
{
  "cmd": "diagnostic",
  "request_id": "diag-abc",
  "collect": ["logs:5min", "config:current", "metrics:cpu", "trace:1min"]
}

// Device collects + uploads (size-bounded)
// Cloud notifies operator when complete
```

## Decommissioning

```
End of life flow:
1. Mark device "decommissioning" in fleet
2. Push "wipe" command
3. Device wipes secrets, factory resets
4. Acknowledges
5. Cloud removes from active fleet
6. Cert revoked (CRL/OCSP)

Why: prevent return-to-service after disposal
```

## Fleet Operations

### Bulk Commands

```python
# Apply command to filtered fleet
async def bulk_command(filter: dict, cmd: dict):
    devices = await get_devices(filter)

    # Rate-limit to avoid broker storm
    semaphore = asyncio.Semaphore(100)

    async def send_one(device):
        async with semaphore:
            await send_command(device.id, cmd)

    await asyncio.gather(*[send_one(d) for d in devices])
```

### Maintenance Windows

```
Schedule fleet operations during low-impact times
Group by timezone
Stagger to avoid thundering herd
```

## Tools (2026)

| Need | Tools |
|------|-------|
| Device management | Balena, Mender, Particle, AWS IoT Device Mgmt |
| OTA | Mender, hawkBit, Balena |
| Monitoring | Grafana, custom |
| Provisioning | Custom + cert management |
| Config | Cloud-native or vendor |

## Things You Don't Do

- ❌ One-shot OTA to whole fleet (canary first)
- ❌ Shared credentials across fleet
- ❌ Skip device authentication
- ❌ Trust device-reported state without verification
- ❌ Decommission without revoking certs
- ❌ Brick recovery requires physical access

## Reference

- [AWS IoT Device Management](https://aws.amazon.com/iot-device-management/)
- [Azure IoT Hub Device Provisioning](https://learn.microsoft.com/en-us/azure/iot-dps/)
- [Mender OTA](https://mender.io/)
- [Balena Documentation](https://docs.balena.io/)
- [hawkBit](https://eclipse.dev/hawkbit/)


## reference: edge-computing-architecture.md

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

- Designing IoT system with edge gateway tier
- Edge ML inference deployment
- Offline-first applications
- Local-first PWA / mobile + IoT
- Industrial / OT edge computing

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
| Continue if cloud down | ✅ |
| Bandwidth-constrained backhaul | ✅ |
| Data must stay local (privacy) | ✅ |
| Many devices per site | Often |
| Few cheap devices, big WAN | ❌ |

## Edge Runtime Selection

### Heavyweight (full Linux)

| Runtime | Best for |
|---------|----------|
| **K3s** | Lightweight Kubernetes |
| **MicroK8s** | Ubuntu environments |
| **Balena** | Managed fleet, OTA |
| **AWS Greengrass** | AWS shop |
| **Azure IoT Edge** | Azure shop |

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

- ❌ Push state-of-art LLM to edge (won't fit)
- ❌ Skip offline mode in spec
- ❌ Sync everything (only what's needed)
- ❌ Forget time sync (NTP / chrony — needed for ordering)
- ❌ One-way trust (edge must verify cloud, cloud must verify edge)
- ❌ Untested OTA rollback path

## Reference

- [Edge Computing Consortium](https://www.edgecomputing-consortium.org/)
- [CNCF Edge Whitepaper](https://www.cncf.io/blog/cloud-native-edge-computing/)
- [AWS Greengrass Documentation](https://docs.aws.amazon.com/greengrass/)
- [Azure IoT Edge](https://azure.microsoft.com/en-us/products/iot-edge)
- [Balena Documentation](https://docs.balena.io/)


## reference: mqtt-protocol-patterns.md

> เดิมคือ skill `mqtt-protocol-patterns` ใน plugin `software-company-iot` — รวมเข้า `iot-systems` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [MQTT Version Selection](#mqtt-version-selection)
- [Topic Structure Patterns](#topic-structure-patterns)
- [QoS Patterns](#qos-patterns)
- [Connection Patterns](#connection-patterns)
- [Will (Last Will and Testament)](#will-last-will-and-testament)
- [Retained Messages](#retained-messages)
- [Reconnect Logic](#reconnect-logic)
- [Backpressure Handling](#backpressure-handling)
- [MQTT 5 Specific Patterns](#mqtt-5-specific-patterns)
- [Topic Filter Best Practices](#topic-filter-best-practices)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# MQTT Protocol Patterns

## When to use this skill

- Implementing MQTT client (device or app)
- Designing topic hierarchies
- Choosing QoS levels
- Implementing reconnect + persistent sessions
- Using MQTT 5 features (properties, shared subscriptions)
- Migrating from MQTT 3.1.1 to MQTT 5

## MQTT Version Selection

| | MQTT 3.1.1 | MQTT 5 |
|--|-----------|--------|
| Compatibility | Universal | Newer brokers only |
| Reason codes | Limited | Detailed |
| Properties | None | Per-packet metadata |
| Shared subs | No | ✅ |
| Retain handling | Basic | Advanced |
| Use when | Legacy required | Greenfield |

> 💡 **2026 default: MQTT 5** unless legacy constraints

## Topic Structure Patterns

### Pattern: Tenant-Aware Hierarchy

```
{tenant}/{site}/{type}/{id}/{message}

Examples:
acme/factory-1/sensor/dev-001/telemetry
acme/factory-1/sensor/dev-001/state
acme/factory-1/sensor/dev-001/cmd/req
acme/factory-1/sensor/dev-001/cmd/resp
```

Benefits:
- ACLs straightforward
- Wildcards intuitive
- Sharding by tenant possible

### Pattern: Request/Response

```
Request:  {tenant}/{device}/cmd/req
Response: {tenant}/{device}/cmd/resp

Or use MQTT 5 Response Topic property:
Request includes "response-topic" property
Subscriber publishes response there
```

### Pattern: Commands with ACK

```
Cloud → Device: cmd/req with cmd_id
Device → Cloud: cmd/resp with same cmd_id + status

Idempotency: device tracks recent cmd_ids
```

## QoS Patterns

### QoS 0 (At Most Once)
```python
# Fire and forget
client.publish(topic, payload, qos=0)

# Use for:
# - High-frequency telemetry
# - Real-time metrics that update quickly
# - Status pings
```

### QoS 1 (At Least Once)
```python
# Acknowledged delivery
client.publish(topic, payload, qos=1)

# Subscriber MUST handle duplicates
# Use idempotency keys in payload

# Use for:
# - Commands
# - State updates
# - Telemetry that matters
```

### QoS 2 (Exactly Once)
```python
# 4-step handshake (slow!)
client.publish(topic, payload, qos=2)

# Use for:
# - Financial transactions over MQTT
# - Critical state changes
# - When duplicates UNACCEPTABLE

# Cost: 2-4x more network round-trips
```

## Connection Patterns

### Persistent Session

```python
client = mqtt.Client(
    client_id="dev-abc",
    clean_session=False  # MQTT 3 — keep state on disconnect
)

# MQTT 5
client.connect(
    properties={
        "SessionExpiryInterval": 3600  # keep for 1h
    }
)

# Benefits:
# - Subscriptions persist
# - QoS 1/2 messages queued during disconnect
# - Reconnect picks up where left off
```

### Clean Session

```python
client = mqtt.Client(clean_session=True)

# Use for:
# - Stateless workers
# - One-shot publishers
# - When fresh state desired
```

## Will (Last Will and Testament)

```python
# Set BEFORE connect
client.will_set(
    topic=f"{tenant}/{device_id}/state",
    payload='{"status":"offline","reason":"unexpected"}',
    qos=1,
    retain=True
)

client.connect(broker)
# ...

# On graceful disconnect, manually publish online → offline
# On abnormal disconnect, broker publishes will message
```

## Retained Messages

```python
# Publish with retain
client.publish(
    topic=f"{tenant}/{device_id}/config",
    payload=config_json,
    qos=1,
    retain=True
)

# New subscribers immediately receive last retained value
# Use for:
# - Configuration
# - Latest known state
# - Slowly-changing reference data

# Clear retain by publishing empty payload with retain=True
client.publish(topic, payload="", retain=True)
```

## Reconnect Logic

```python
import paho.mqtt.client as mqtt
import time

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        # Resubscribe (clean session=true)
        client.subscribe([
            (f"{tenant}/{device_id}/cmd/req", 1),
            (f"{tenant}/broadcast/+", 1),
        ])

def on_disconnect(client, userdata, rc, properties=None):
    print(f"Disconnected: rc={rc}")
    if rc != 0:
        # Unexpected disconnect, will auto-reconnect

client = mqtt.Client(client_id="dev-abc", clean_session=False)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

# Auto-reconnect with backoff
client.reconnect_delay_set(min_delay=1, max_delay=120)

client.connect_async(broker, port=8883, keepalive=60)
client.loop_start()
```

## Backpressure Handling

```python
# When publishing faster than network allows
# Client buffers messages — but bounded!

# MQTT 5 flow control
client.connect(
    properties={
        "ReceiveMaximum": 100  # max inflight messages
    }
)

# Application-level backpressure
async def publish_with_backpressure(topic, payload, qos=1):
    while client.inflight_count() > 50:
        await asyncio.sleep(0.01)
    await client.publish(topic, payload, qos)
```

## MQTT 5 Specific Patterns

### Properties

```python
# User properties (key-value metadata)
client.publish(
    topic, payload,
    qos=1,
    properties={
        "UserProperty": [
            ("trace-id", "abc-123"),
            ("source-version", "1.2.3"),
        ]
    }
)
```

### Shared Subscriptions

```
$share/group-name/topic

Multiple subscribers share the load
Each message delivered to ONE subscriber in group

Use for:
- Scaling consumers
- Load balancing
```

### Reason Codes

```python
# MQTT 5 returns detailed reason codes
# Not just success/fail
# E.g., 0x83 ("Implementation Specific Error")
#       0x97 ("Quota Exceeded")
#       0x9A ("Retain Not Supported")

# Handle gracefully
def on_publish_failed(client, userdata, mid, reason_code, properties):
    if reason_code == 0x97:
        # Slow down, adjust quota
        ...
```

## Topic Filter Best Practices

```
✅ Subscribe specific:
   acme/factory-1/sensor/+/telemetry

❌ Subscribe too broad:
   #
   (gets EVERYTHING, kills consumer)

✅ Use shared subs for high-volume:
   $share/processors/acme/+/+/telemetry

❌ Many overlapping subscriptions:
   acme/+/+/+
   acme/factory-1/+/+
   acme/factory-1/sensor/+
   (broker matches all, sends multiple times)
```

## Things You Don't Do

- ❌ Subscribe to `#` (gets EVERYTHING)
- ❌ Use QoS 2 by default (slow)
- ❌ Forget retained message cleanup
- ❌ Block in message callback (queues fill)
- ❌ Reconnect without backoff (broker DDoS)

## Reference

- [MQTT 5 spec](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- [MQTT 3.1.1 spec](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [HiveMQ MQTT Essentials](https://www.hivemq.com/mqtt-essentials/)
- [EMQX Documentation](https://docs.emqx.com/)
- [Paho MQTT Clients](https://www.eclipse.org/paho/)
