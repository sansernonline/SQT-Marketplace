---
name: iot-systems
description: Use when building connected devices (fleet provisioning, OTA updates, device vs edge vs cloud, MQTT topics and brokers, embedded firmware, RTOS).
---

# iot-systems

ระบบอุปกรณ์ที่ต่ออินเทอร์เน็ต: จัดการอุปกรณ์จำนวนมาก · ประมวลผลที่ edge (เครื่องใกล้อุปกรณ์) · MQTT · firmware

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทั้งหมด เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้นอยู่แล้ว

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| managing fleets of IoT devices — provisioning, monitoring, configuration, OTA updates, decommissioning. Patterns for hundreds to millions of devices | [`references/device-fleet-management.md`](references/device-fleet-management.md) |
| designing edge computing systems — deciding device/edge/cloud placement, edge runtime selection, edge ML inference, offline-first design, sync patterns | [`references/edge-computing-architecture.md`](references/edge-computing-architecture.md) |
| implementing MQTT clients/brokers, designing topic structures, choosing QoS levels, implementing retained messages, will/testament, or MQTT 5 features. Concrete patterns for production systems | [`references/mqtt-protocol-patterns.md`](references/mqtt-protocol-patterns.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่มงาน

| บทบาท | อ่าน | agent |
|---|---|---|
| building IoT systems — connected device platforms, telemetry pipelines, device-to-cloud communication, or scaling to many devices. Covers connectivity, data ingestion, command-and-control | [`references/agent-iot-engineer.md`](references/agent-iot-engineer.md) | `iot-engineer` |
| designing edge computing architectures — what to compute on device vs gateway vs cloud, edge ML inference, local-first data flows, edge-cloud sync patterns | [`references/agent-edge-architect.md`](references/agent-edge-architect.md) | `iot-engineer` |
| developing embedded firmware — bare metal, RTOS (FreeRTOS, Zephyr), microcontroller programming (ARM Cortex, ESP32, RISC-V), low-power design, or peripheral integration | [`references/agent-firmware-engineer.md`](references/agent-firmware-engineer.md) | `iot-engineer` |
| designing MQTT topology, configuring brokers (EMQX, HiveMQ, Mosquitto, AWS IoT Core), designing topic structures, implementing pub/sub patterns, or scaling MQTT to millions of devices | [`references/agent-mqtt-specialist.md`](references/agent-mqtt-specialist.md) | `iot-engineer` |

## agent ของสายนี้

`iot-engineer`

## ที่มา

รวมจาก plugin `software-company-iot` (skill `device-fleet-management` · `edge-computing-architecture` · `mqtt-protocol-patterns`) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`
