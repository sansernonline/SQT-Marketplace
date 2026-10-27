---
name: kafka-streaming
description: Use when services pass events via Kafka (topic, producer, consumer, DLQ, ส่ง event ระหว่าง service) or events get lost or doubled.
---

# kafka-streaming — ออกแบบ topic · producer · consumer ของ Apache Kafka ไม่ให้ event หายหรือซ้ำแบบเงียบ ๆ

อยู่ใน plugin `software-company` · ถ้อยคำในไฟล์นี้และเอกสารที่ได้จากมัน เขียนตาม `human-writing` · ค่าตั้งและรุ่นทุกตัวมีลิงก์กับวันที่ตรวจ 2026-10-27 ในหัวข้อ "ที่มา" และ [`config-table`](references/config-table.md)

> **กฎข้อเดียว:** Kafka ส่งให้ "อย่างน้อยหนึ่งครั้ง" ไม่ใช่ "ครั้งเดียว" · ฝั่งส่งต้องไม่ทิ้ง event (ส่งยืนยันครบ + outbox) ฝั่งรับต้องทำซ้ำได้ (เช็ก `event_id`) และ commit offset หลังทำเสร็จเท่านั้น · ขาดข้อใดข้อหนึ่ง event จะหายหรือซ้ำโดยไม่มีใครเห็น

## ใช้เมื่อ

- service 2 ตัวขึ้นไปต้องรับ event เดียวกัน และต้องย้อนอ่านซ้ำได้ (เช่น สรุปสายโทรลง CRM กับแจ้งเตือน LINE จาก event ชุดเดียว)
- ต้องรักษาลำดับ event ต่อสายหรือต่อนัด (เริ่มสาย → จบสาย → สรุป · จอง → เลื่อน → ยกเลิก)
- ผู้ใช้พูดว่า Kafka · topic · consumer group · offset · partition · DLQ · "event หาย" · "event ซ้ำ" · "ส่ง event ระหว่าง service"
- consumer lag โตหรือ consumer ถูก rebalance ไม่หยุด

ไม่ใช้เมื่อ: งานเบื้องหลังของ service เดียว (ส่งเมล ทำรายงาน ตั้งเวลา) มีผู้รับเดียว ไม่ต้องย้อนอ่าน → [`background-jobs`](../background-jobs/SKILL.md) พอ · เลือกสถาปัตยกรรมทั้งระบบ → [`architecture-patterns`](../architecture-patterns/SKILL.md) ก่อน · ข้อมูลที่ส่งเป็นของอุปกรณ์ IoT → `iot-systems`

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เกี่ยวกับ skill นี้อย่างไร |
|---|---|---|
| คิวงานธรรมดา มีผู้รับเดียว | [`background-jobs`](../background-jobs/SKILL.md) | หัวข้อ 1 ตัดสินว่าต้องใช้ Kafka จริงไหม |
| คิวงานที่ต้องแจกให้ worker พร้อม retry และ dead letter ใช้ RabbitMQ | [`rabbitmq-messaging`](../rabbitmq-messaging/SKILL.md) | หัวข้อ 1 ของไฟล์นั้นเทียบ 2 ตัว |
| งานที่อาจรันซ้ำหรือหยุดกลางทาง | [`principle-safe-to-rerun`](../principle-safe-to-rerun/SKILL.md) | consumer ทุกตัวต้องผ่านหลักนี้ (หัวข้อ 4) |
| ปลายทางเป็นอีเมล LINE push SMS | [`notifications`](../notifications/SKILL.md) | consumer แจ้งเตือนใช้กฎช่องทางและโควตาของ skill นั้น |
| เลือก event-driven เทียบแบบอื่น | [`architecture-patterns`](../architecture-patterns/SKILL.md) | Kafka เป็นเครื่องมือ ไม่ใช่ตัวเลือกสถาปัตยกรรม |
| event มีเบอร์โทร ชื่อ เสียง | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | หัวข้อ 6 ย่อ ส่วนสิทธิ์ของเจ้าของข้อมูลอยู่ที่นั่น |
| ตั้งเฝ้า lag และ alert | [`observability-basics`](../observability-basics/SKILL.md) | หัวข้อ 7 บอกว่าเฝ้าอะไร |
| ออกแบบ pipeline ข้อมูลทั้งสาย | agent `data-engineer` | skill นี้ให้กฎของ Kafka ที่เขาต้องใช้ |

## 1 · ควรใช้ Kafka เมื่อไหร่

| ถามก่อน | ตอบแบบนี้ → Kafka | ตอบแบบนี้ → ไม่ต้อง |
|---|---|---|
| ผู้รับกี่ราย | 2 รายขึ้นไป อ่านชุดเดียวกันคนละจังหวะ | รายเดียว |
| ต้องย้อนอ่าน event เก่าไหม (เติม CRM ใหม่ แก้บั๊กแล้วเล่นซ้ำ) | ต้อง | ทำแล้วทิ้ง |
| ลำดับสำคัญไหม | สำคัญต่อ key (สาย นัด) | ไม่สำคัญ |
| มีคนดูแล cluster ไหม | มี หรือใช้บริการที่มีคนดูแล | ไม่มี และปริมาณเป็นหลักร้อยต่อชั่วโมง |

ปริมาณคลินิกเดียวมักน้อยจน Kafka เกินจำเป็น · ถ้าตอบ "รายเดียว ไม่ย้อนอ่าน" ใช้ `background-jobs` แล้วบอกผู้ใช้ตรง ๆ · ตัดสินแล้วจดเหตุผลลง ADR (`adr-writer`) · ต้นทุน cluster และบริการจัดการต่อเดือน `(ยังไม่ได้ตรวจ)`

## 2 · topic

| เรื่อง | ทำ | เหตุผล |
|---|---|---|
| ชื่อ | `<โดเมน>.<เรื่อง>.events.v<เลข>` เช่น `clinic.call.events.v1` · 1 topic ต่อ 1 เรื่องที่ลำดับต้องรักษา | ชื่อบอกเจ้าของ · เวอร์ชันไว้ย้ายเมื่อ schema หักแบบเข้ากันไม่ได้ |
| key | id ของสิ่งที่ลำดับสำคัญ (`call_id` · `appointment_id`) · ห้ามปล่อย key ว่าง | key เดียวกันลง partition เดียว อ่านตามลำดับที่เขียน · ข้าม partition ไม่รับประกันลำดับ |
| จำนวน partition | วัดจากปริมาณจริง ให้ไม่น้อยกว่า max(เป้า÷ความเร็วเขียนต่อ partition, เป้า÷ความเร็วอ่านต่อ partition) แล้วเผื่อเล็กน้อย · เริ่ม 3–6 สำหรับคลินิกเล็ก `(ประมาณ ยังไม่ได้วัด)` | เพิ่มได้ ลดไม่ได้ · เพิ่มแล้ว key เดิมอาจย้าย partition ลำดับของ key เก่าเพี้ยน |
| replication factor (RF) | 3 บน cluster จริง · 1 ได้แค่เครื่อง dev | RF 3 คือค่าที่ใช้กันทั่วไปใน production |
| `min.insync.replicas` | 2 คู่กับ RF 3 และ `acks=all` | เขียนสำเร็จเมื่อมีสำเนาที่ทันอย่างน้อย 2 ตัว · ล่มได้ 1 เครื่องโดยไม่หายและไม่หยุดเขียน · ค่าเริ่มต้นคือ 1 |
| retention | `retention.ms` ค่าเริ่มต้น 7 วัน · ตั้งให้ยาวกว่าเวลาที่ consumer ดับนานสุดที่ยอมรับ · event ที่มีข้อมูลส่วนบุคคลให้สั้นสุดเท่าที่ใช้ (หัวข้อ 6) | consumer ที่ดับนานกว่า retention จะอ่าน event ที่ถูกลบไปแล้วไม่ได้ |
| compaction | ใช้กับ topic "สถานะล่าสุดต่อ key" เท่านั้น (`cleanup.policy=compact`) · topic event ที่ต้องเก็บประวัติ ใช้ `delete` | compaction เก็บค่าล่าสุดของแต่ละ key ประวัติ จอง→เลื่อน→ยกเลิก จะหาย |
| สร้าง topic | สร้างด้วยโค้ดหรือสคริปต์ที่รีวิวได้ · ปิด `auto.create.topics.enable` | ค่าเริ่มต้นเปิด และ `default.replication.factor` เริ่มที่ 1 พิมพ์ชื่อ topic ผิดอาจได้ topic ใหม่ที่ไม่มีสำเนา (ข้อสรุปจากค่าเริ่มต้นสองตัว ยังไม่ได้ทดลอง) |

## 3 · producer

1. ตั้ง `acks=all` และ `enable.idempotence=true` ชัด ๆ แม้รุ่นใหม่เป็นค่าเริ่มต้นแล้ว · ไฟล์ตั้งค่าไม่ควรขึ้นกับรุ่นของ client ที่เครื่องไหนติดตั้ง
2. เปิด idempotent producer = broker ตัดสำเนาที่เกิดจาก retry ของ producer ตัวเดียวกันให้ · **ไม่กัน** สำเนาที่เกิดจากแอปส่งซ้ำเองหลัง restart
3. รอผลส่งทุกครั้ง (callback หรือ future) · ส่งแล้วไม่ดูผล = ทิ้ง event เงียบ ๆ · ผลส่งล้ม ให้ธุรกรรมของแอปรู้
4. เขียน DB กับส่ง event ในธุรกรรมเดียวไม่ได้ (ส่งก่อน commit แล้ว DB ล้ม · commit แล้วแอปตายก่อนส่ง) → **outbox**: เขียนแถวลงตาราง `outbox` ในธุรกรรมเดียวกับข้อมูลธุรกิจ แล้วมีตัวส่ง (relay) อ่านแถวที่ยังไม่ส่งไปลง Kafka แล้วทำเครื่องหมาย · relay ตายหลังส่งก่อนทำเครื่องหมาย = ส่งซ้ำ จึงต้องมี `event_id` ใน event ทุกตัว
5. Kafka transaction ครอบ Kafka → Kafka เท่านั้น · เขียนลง CRM หรือ LINE ไม่นับ → ใช้ at-least-once + consumer ทำซ้ำได้ ไม่ต้องไล่ exactly-once
6. event 1 ก้อนมี `event_id` · `type` · `occurred_at` · `schema_version` · id ของเรื่อง · ข้อมูลเท่าที่ผู้รับต้องใช้ (โครงเต็มใน [`clinic-example`](references/clinic-example.md))

## 4 · consumer

1. `enable.auto.commit=false` แล้ว commit offset **หลัง** งานเสร็จและเขียนผลลง DB แล้ว · commit ก่อนทำ = ตายกลางทางแล้ว event หาย · auto commit ที่เปิดอยู่เป็นค่าเริ่มต้น commit ตามเวลา ไม่ตามงาน
2. ทำซ้ำได้: ตาราง `processed_events(event_id primary key)` เขียนในธุรกรรมเดียวกับผลงาน · เจอ `event_id` เดิม ข้ามแล้ว commit · ขั้นตอนคิดตาม `principle-safe-to-rerun`
3. ตรวจลำดับด้วยข้อมูลใน event ไม่ใช่เวลารับ: ถ้า event "เลื่อนนัด" มาก่อน "จองนัด" ให้รอหรือส่งเข้าลองใหม่ ไม่ใช่เขียนทับ
4. ล้มชั่วคราว (CRM ช้า LINE ตอบ 5xx) → ลองใหม่ในโปรเซสด้วยหน่วงเวลาเพิ่มขึ้น จำนวนครั้งจำกัด · ล้มถาวร (ข้อมูลผิดรูป schema ไม่ตรง) หรือหมดรอบลอง → ส่งเข้า **DLQ** (dead letter queue คือ topic เก็บ event ที่ประมวลผลไม่ได้) `<topic>.dlq` พร้อม header บอก topic · partition · offset เดิมและชนิด error แล้ว commit ต่อ · ไม่ลองใหม่ไม่รู้จบ เพราะ partition นั้นติดทั้งแถว
5. DLQ ไม่ว่าง = มีงานของคน · ตั้ง alert (หัวข้อ 7) และมีคนรับผิดชอบเล่นซ้ำหลังแก้
6. `auto.offset.reset` ค่าเริ่มต้น `latest` · consumer group ใหม่หรือ offset หมดอายุจะข้าม event เก่าเงียบ ๆ → service ที่ต้องเริ่มจากต้น ตั้ง `earliest` (หรือ `by_duration:<ระยะเวลา ISO 8601>` เช่น `by_duration:PT6M` ที่เอกสารแนะเมื่อเพิ่ม partition · ต้องยาวกว่าเวลาที่ consumer ใช้ค้นพบ partition ใหม่)
7. rebalance: ถ้างานต่อ record ช้า (เรียก LINE) ลด `max.poll.records` (ค่าเริ่มต้น 500) หรือเพิ่ม `max.poll.interval.ms` (ค่าเริ่มต้น 5 นาที) ให้รอบหนึ่งจบทัน · เกินแล้วกลุ่มคิดว่า consumer ตาย แล้ว rebalance ทำให้ event ถูกทำซ้ำ · deploy บน container ที่รีสตาร์ทบ่อย พิจารณา `group.instance.id` (static membership) · `group.protocol=consumer` (โปรโตคอลใหม่) เป็นทางเลือก `(ยังไม่ได้ตรวจความพร้อมของ client ที่ใช้)` ใช้ค่าเริ่มต้น `classic` ไปก่อน
8. จำนวน consumer ที่ทำงานได้สูงสุดในกลุ่มเท่ากับจำนวน partition · ตัวที่เกินจะว่าง

## 5 · schema

1. กำหนด schema ให้ทุก event · ใช้ Schema Registry กับ Avro หรือ JSON Schema ถ้ามี cluster รองรับ · ไม่มี registry ให้ใส่ `schema_version` ใน event และให้ผู้รับอ่านแบบยอมรับฟิลด์ที่ไม่รู้จัก
2. ตั้งโหมด `BACKWARD` (ค่าเริ่มต้นของ Confluent Schema Registry) หรือ `BACKWARD_TRANSITIVE` ถ้ามีหลายรุ่นค้างใน topic นาน
3. เปลี่ยนแบบที่ผ่าน: เพิ่มฟิลด์ที่มีค่าปริยาย · ลบฟิลด์ที่เดิมมีค่าปริยาย · **ห้าม** เปลี่ยนชื่อ เปลี่ยนชนิด ลบฟิลด์บังคับ · ต้องหักจริง ให้สร้าง topic `v2` แล้วย้าย
4. ลำดับขึ้น: BACKWARD ต้องอัปเกรด **consumer ก่อน** แล้วค่อยให้ producer ส่งรูปใหม่
5. กฎเต็มของ JSON Schema (open หรือ closed content model) ซับซ้อนกว่า Avro อ่านหน้าทางการก่อนเลือก `(ยังไม่ได้ตรวจรายละเอียด)`

## 6 · event ที่มีข้อมูลส่วนบุคคล (PDPA)

PDPA คือพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล · log ของ Kafka เป็นแบบเพิ่มท้าย ลบรายการเดียวตามคำขอเจ้าของข้อมูลไม่สะดวก (ข้อสรุปจากโครงสร้าง log ยังไม่ได้ทดลอง) จึงออกแบบให้ไม่ต้องลบ

- ใส่เฉพาะ id (`call_id` · `appointment_id` · `patient_id`) ไม่ใส่เบอร์โทร ชื่อ เนื้อเสียง ข้อความถอดเสียง หรืออาการ · ผู้รับที่มีสิทธิ์ไปดึงจากระบบต้นทางด้วย id เอง
- เสียงและถอดเสียงอยู่ที่เก็บของมันเอง event มีแค่ id ของไฟล์
- `retention.ms` ของ topic ที่มี id คนไข้ ตั้งสั้นสุดที่ consumer ฟื้นตัวทัน · DLQ ก็เป็นข้อมูลเช่นกัน ตั้ง retention เท่ากัน
- ผู้ใช้ขอให้ลบข้อมูล → ลบที่ระบบต้นทาง · event ที่เหลือมีแต่ id ที่ชี้ไปหาใครไม่ได้อีก · นโยบายเก็บข้อมูลและสิทธิ์เจ้าของข้อมูลตาม `pdpa-compliance` · ข้อมูลสุขภาพเป็นข้อมูลอ่อนไหว ถามฝ่ายกฎหมายก่อนส่งข้าม service `(รอยืนยัน)`
- เปิดการเข้ารหัสระหว่างทางและสิทธิ์อ่านต่อ topic (ACL) · ค่าลับของ cluster ไม่เข้า git (`config-and-secrets`)

## 7 · ทดสอบและเฝ้าดู

| ทดสอบ | วิธี |
|---|---|
| ใช้ Kafka จริงในเทสต์ | Testcontainers โมดูล Kafka (Java ใช้ `KafkaContainer` กับอิมเมจ `apache/kafka`) หรือ Kafka ในเครื่องผ่าน docker compose · ไม่ mock client เพราะ mock ไม่เห็นปัญหา offset และ rebalance |
| 4 เคสที่ต้องมี | event เดิมเข้า 2 ครั้ง ผลเขียนครั้งเดียว · ตายก่อน commit แล้วเริ่มใหม่ ไม่มี event หาย · event เสียเข้า DLQ แล้ว partition ไม่ติด · event key เดียวกัน 3 ตัวมาตามลำดับ |

เฝ้าดูตามหลัก `observability-basics`: **consumer lag** ต่อกลุ่มและ partition (`kafka-consumer-groups.sh --describe --group <กลุ่ม>` ให้ค่า LAG) · จำนวน event ใน DLQ · อายุของแถว `outbox` ที่เก่าสุดที่ยังไม่ส่ง · จำนวนครั้ง rebalance · ค่าเกณฑ์ alert ตั้งจากปริมาณจริงของระบบ `(รอยืนยัน)`

## ตัวอย่างจริง 1 ชุด

ป้าย `ตัวอย่าง` — ออกแบบบนกระดาษ ยังไม่ได้รันกับ Kafka จริง

**โจทย์:** voice agent คลินิกทันตกรรมส่ง event สายโทร (เริ่ม · จบ · สรุป) และนัดหมาย (จอง · เลื่อน · ยกเลิก) ไปให้ service สรุปลง CRM (Customer Relationship Management คือระบบข้อมูลลูกค้า) กับ service แจ้งเตือนทาง LINE

| เรื่อง | ที่เลือก | เหตุผล |
|---|---|---|
| ต้องใช้ Kafka ไหม | ใช้ · ผู้รับ 2 ราย ต้องเล่นซ้ำเติม CRM ได้ ลำดับสำคัญ | ตรงตามตารางหัวข้อ 1 · ถ้าเหลือผู้รับรายเดียวให้กลับไป `background-jobs` |
| topic | `clinic.call.events.v1` key `call_id` · `clinic.appointment.events.v1` key `appointment_id` | ลำดับต่อสายและต่อนัด |
| ค่า topic | RF 3 · `min.insync.replicas=2` · retention 7 วัน · partition 3 | หัวข้อ 2 |
| ส่ง | voice agent เขียนสรุปสายกับแถว outbox ใน DB ธุรกรรมเดียว · relay ส่งด้วย `acks=all` | หัวข้อ 3 |
| รับ | CRM กับ LINE คนละ consumer group · `processed_events` · commit หลังเขียน · DLQ ต่อ topic | หัวข้อ 4 |
| ข้อมูลใน event | `call_id` · `patient_id` · ชนิด · เวลา · ไม่มีเบอร์โทร ชื่อ เสียง | ผู้รับดึงรายละเอียดเองจากระบบต้นทางตามสิทธิ์ |

โครง event · SQL outbox · โค้ด consumer แบบย่อ · ค่า properties ครบอยู่ใน [`clinic-example`](references/clinic-example.md)

## ตรวจก่อนส่ง

1. มีคำตอบเรื่อง "ต้องใช้ Kafka จริงไหม" พร้อมเหตุผล ไม่ได้ใช้เพราะตามกระแส
2. topic ทุกตัวมี key ที่ตรงกับสิ่งที่ลำดับสำคัญ · RF · `min.insync.replicas` · retention ระบุชัด · ปิดสร้าง topic อัตโนมัติ
3. producer `acks=all` + idempotent · รอผลส่ง · ทางเขียน DB แล้วส่ง event ใช้ outbox
4. consumer ปิด auto commit · commit หลังเสร็จ · มี `event_id` กันซ้ำในธุรกรรมเดียวกับผล · มี DLQ และคนดู
5. `auto.offset.reset` ตั้งตามที่ service ต้องการ ไม่ปล่อยค่าเริ่มต้นโดยไม่คิด
6. schema มีโหมดเข้ากันได้และลำดับอัปเกรด · event ไม่มีเบอร์โทร ชื่อ เสียง
7. เทสต์ 4 เคสผ่านบน Kafka จริง · มี alert consumer lag กับ DLQ
8. ทุกค่าที่อ้างมีลิงก์หรือป้าย `(ยังไม่ได้ตรวจ)` · ไม่เขียนว่า exactly-once ข้ามระบบภายนอก

## ที่มา

ตรวจ 2026-10-27 (เปิดอ่านผ่านเครื่องมือดึงหน้าเว็บ ค่าตัวเลขคัดจากหน้าที่ดึงมา)

- Apache Kafka 4.4 · ค่าตั้ง producer https://kafka.apache.org/44/configuration/producer-configs/ · consumer https://kafka.apache.org/44/configuration/consumer-configs/ · topic https://kafka.apache.org/44/configuration/topic-configs/ · broker https://kafka.apache.org/44/configuration/broker-configs/
- การรับประกันส่ง ลำดับ idempotent producer transaction offset https://kafka.apache.org/44/design/design/ · key กับ partition https://kafka.apache.org/44/getting-started/introduction/ · เพิ่ม partition และดู lag https://kafka.apache.org/44/operations/basic-kafka-operations/
- Confluent Schema Registry https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html · ความหมายการส่ง https://docs.confluent.io/kafka/design/delivery-semantics.html · การรวมกลุ่ม consumer https://docs.confluent.io/kafka/design/consumer-design.html · DLQ (ของ Kafka Connect ใช้เป็นแนวคิดอ้างอิง ไม่ใช่ของ consumer ทั่วไป) https://docs.confluent.io/platform/current/connect/index.html#dead-letter-queue
- เลือกจำนวน partition (บทความปี 2015 ตรวจรุ่นใหม่ก่อนใช้ตัวเลข) https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/
- Transactional outbox https://microservices.io/patterns/data/transactional-outbox.html
- Testcontainers Kafka https://java.testcontainers.org/modules/kafka/
