<!-- merged from skill `iot-systems` on 2026-11-27 · description was: Use when building connected devices with MQTT or OTA updates -->
# iot-systems

Internet-connected device systems: managing many devices · processing at the edge (a machine close to the devices) · MQTT · firmware

**Open only the files that match the job.** Do not read them all, because each file is already the full guide to its topic.

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| managing fleets of IoT devices — provisioning, monitoring, configuration, OTA updates, decommissioning. Patterns for hundreds to millions of devices | [`device-fleet-management.md`](device-fleet-management.md) |
| designing edge computing systems — deciding device/edge/cloud placement, edge runtime selection, edge ML inference, offline-first design, sync patterns | [`edge-computing-architecture.md`](edge-computing-architecture.md) |
| implementing MQTT clients/brokers, designing topic structures, choosing QoS levels, implementing retained messages, will/testament, or MQTT 5 features. Concrete patterns for production systems | [`mqtt-protocol-patterns.md`](mqtt-protocol-patterns.md) |

## คู่มือบทบาท

An agent called in for this area opens its own role file before starting work · read the table of contents first, then read only the sections the job uses

| บทบาท | อ่าน | agent |
|---|---|---|
| building IoT systems — connected device platforms, telemetry pipelines, device-to-cloud communication, or scaling to many devices. Covers connectivity, data ingestion, command-and-control | [`agent-iot-engineer.md`](agent-iot-engineer.md) | `iot-engineer` |
| designing edge computing architectures — what to compute on device vs gateway vs cloud, edge ML inference, local-first data flows, edge-cloud sync patterns | [`agent-edge-architect.md`](agent-edge-architect.md) | `iot-engineer` |
| developing embedded firmware — bare metal, RTOS (FreeRTOS, Zephyr), microcontroller programming (ARM Cortex, ESP32, RISC-V), low-power design, or peripheral integration | [`agent-firmware-engineer.md`](agent-firmware-engineer.md) | `iot-engineer` |
| designing MQTT topology, configuring brokers (EMQX, HiveMQ, Mosquitto, AWS IoT Core), designing topic structures, implementing pub/sub patterns, or scaling MQTT to millions of devices | [`agent-mqtt-specialist.md`](agent-mqtt-specialist.md) | `iot-engineer` |

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:domain-systems <iot-architecture | device-fleet-design> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `iot-architecture` | Design IoT system architecture using the iot-engineer agent. Covers connectivity, data flow, edge tier. |
| `device-fleet-design` | Design device fleet management — provisioning, OTA, monitoring, config. Uses iot-engineer agent. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](iot-systems/design-modes.md)
