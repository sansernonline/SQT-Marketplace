# ค่าตั้ง Kafka ที่ skill `kafka-streaming` อ้างถึง

ค่าเริ่มต้นคัดจากเอกสาร Apache Kafka 4.4 · ตรวจ 2026-10-27 · ค่าเปลี่ยนตามรุ่น ตรวจหน้าของรุ่นที่ใช้จริงก่อนลงไฟล์ตั้งค่า

## producer — https://kafka.apache.org/44/configuration/producer-configs/

| ค่า | เริ่มต้น | ที่แนะนำ | หมายเหตุ |
|---|---|---|---|
| `acks` | `all` | `all` ตั้งชัด | idempotence ต้องใช้ `all` |
| `enable.idempotence` | `true` | `true` ตั้งชัด | ตัดสำเนาจาก retry ของ producer ตัวเดียวกัน |
| `retries` | 2147483647 | ไม่แตะ | เอกสารแนะให้คุมด้วย `delivery.timeout.ms` |
| `delivery.timeout.ms` | 120000 | ไม่แตะ จนกว่าจะมีเหตุ | เวลารวมก่อนรายงานสำเร็จหรือล้ม ต้องจัดการผลล้มเสมอ |
| `max.in.flight.requests.per.connection` | 5 | ไม่เกิน 5 | เปิด idempotence ต้อง 5 หรือน้อยกว่า |
| `transactional.id` | `null` | ไม่ใช้ในงานนี้ | transaction ครอบเฉพาะ Kafka ไป Kafka |
| `linger.ms` | 5 | ไม่แตะ | เปลี่ยนจาก 0 เป็น 5 ใน 4.0 |

## consumer — https://kafka.apache.org/44/configuration/consumer-configs/

| ค่า | เริ่มต้น | ที่แนะนำ | หมายเหตุ |
|---|---|---|---|
| `enable.auto.commit` | `true` | `false` | commit เองหลังงานเสร็จ |
| `auto.offset.reset` | `latest` | `earliest` ถ้าต้องอ่านจากต้น | `latest` อาจข้าม record เมื่อเพิ่ม partition · เอกสารแนะ `by_duration` |
| `max.poll.interval.ms` | 300000 | ตามงานต่อรอบ | เกินแล้ว consumer ถูกถือว่าล้ม เกิด rebalance |
| `max.poll.records` | 500 | ลดถ้างานต่อ record ช้า | |
| `session.timeout.ms` | 45000 | ไม่แตะ | ใช้ไม่ได้เมื่อ `group.protocol=consumer` |
| `heartbeat.interval.ms` | 3000 | ไม่แตะ | ต้องน้อยกว่า session timeout ปกติไม่เกินหนึ่งในสาม |
| `isolation.level` | `read_uncommitted` | ไม่แตะ | `read_committed` ใช้เมื่อ producer ใช้ transaction |
| `partition.assignment.strategy` | `RangeAssignor,CooperativeStickyAssignor` | ไม่แตะ | |
| `group.instance.id` | `null` | ตั้งเมื่อรีสตาร์ทบ่อย | static member · id ซ้ำในกลุ่มพร้อมกันไม่ได้ |
| `group.protocol` | `classic` | `classic` | `consumer` เป็นโปรโตคอลใหม่ ยังไม่ได้ตรวจความพร้อมของ client |

## topic — https://kafka.apache.org/44/configuration/topic-configs/

| ค่า | เริ่มต้น | หมายเหตุ |
|---|---|---|
| `retention.ms` | 604800000 (7 วัน) | `-1` คือไม่จำกัดเวลา |
| `retention.bytes` | -1 | จำกัดต่อ partition ไม่ใช่ต่อ topic |
| `cleanup.policy` | `delete` | `compact` เก็บค่าล่าสุดต่อ key |
| `min.insync.replicas` | 1 | ใช้กับการเขียนที่ `acks=all` เท่านั้น |
| `min.cleanable.dirty.ratio` | 0.5 | เฉพาะ topic ที่ compact |
| `delete.retention.ms` | 86400000 (1 วัน) | อายุ tombstone ของ topic ที่ compact |
| `max.message.bytes` | 1048588 | นับหลังบีบอัด |

## broker — https://kafka.apache.org/44/configuration/broker-configs/

| ค่า | เริ่มต้น | หมายเหตุ |
|---|---|---|
| `default.replication.factor` | 1 | ตั้ง 3 ใน production |
| `auto.create.topics.enable` | `true` | ปิดใน production แล้วสร้าง topic ด้วยโค้ด |
| `unclean.leader.election.enable` | `false` | เปิดแล้วข้อมูลอาจหาย ไม่เปิด |
| `offsets.topic.replication.factor` | 3 | |

ค่า `num.partitions` ของ broker อ่านไม่ถึงในหน้าที่ดึง `(ยังไม่ได้ตรวจ)`

## ที่มาอื่น

- Schema Registry ค่าเริ่มต้นโหมด `BACKWARD` — https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html (ตรวจ 2026-10-27)
- เพิ่ม partition แล้ว key ย้าย — https://kafka.apache.org/44/operations/basic-kafka-operations/ (ตรวจ 2026-10-27)
