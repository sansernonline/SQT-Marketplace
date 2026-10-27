---
name: rabbitmq-messaging
description: Use when work goes through RabbitMQ (queue, exchange, ack, DLX, ข้อความหาย/ซ้ำ). Many readers of one log → kafka-streaming
---

# rabbitmq-messaging — ออกแบบคิว RabbitMQ ไม่ให้ข้อความหายหรือซ้ำแบบเงียบ ๆ

อยู่ใน plugin `software-company` · ถ้อยคำในไฟล์นี้เขียนตาม `human-writing` · ค่าตั้งและรุ่นทุกตัวมีลิงก์กับวันที่ตรวจ 2026-10-27 ในหัวข้อ "ที่มา" · วิธีต่อ MCP อยู่ใน [`mcp-rabbitmq`](references/mcp-rabbitmq.md) · โค้ดและค่าตั้งของตัวอย่างอยู่ใน [`email-queue-example`](references/email-queue-example.md)

> **กฎข้อเดียว:** RabbitMQ ส่งให้ "อย่างน้อยหนึ่งครั้ง" ไม่ใช่ "ครั้งเดียว" · ฝั่งส่งต้องรอ confirm และรู้เมื่อ route ไม่ได้ ฝั่งรับต้อง ack เองหลังทำเสร็จและทำซ้ำได้ (เช็ก `message_id`) · ข้อความที่ทำไม่ได้ต้องไปที่ dead letter ไม่ใช่วนหรือทิ้งเงียบ ๆ

## ใช้เมื่อ

- มีงานที่ต้องกระจายให้ worker หลายตัว (ส่งอีเมล สร้างรายงาน เรียก API ภายนอก) และต้องมี retry กับที่เก็บข้อความที่ทำไม่ได้
- ต้องการ routing ที่ broker (ส่งตามชนิดหรือหัวข้อ) · priority · TTL · delayed retry · RPC · หลายโปรโตคอล (AMQP · MQTT · STOMP)
- ผู้ใช้พูดว่า RabbitMQ · queue · exchange · binding · ack · prefetch · DLX · dead letter · quorum · "ข้อความหาย" · "ข้อความซ้ำ"

ไม่ใช้เมื่อ: ผู้รับหลายรายต้องอ่านชุดเดียวกันคนละจังหวะและย้อนอ่านได้ → [`kafka-streaming`](../kafka-streaming/SKILL.md) (RabbitMQ stream ย้อนอ่านได้เหมือนกัน ดูหัวข้อ 2) · งานเบื้องหลังของ service เดียวที่ใช้คิวในฐานข้อมูลหรือคิวของเฟรมเวิร์กพอ → [`background-jobs`](../background-jobs/SKILL.md)

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เกี่ยวกับ skill นี้อย่างไร |
|---|---|---|
| คิวงานของ service เดียว ปริมาณน้อย | [`background-jobs`](../background-jobs/SKILL.md) | หัวข้อ 1 ตัดสินว่าต้องมี broker จริงไหม |
| event หลายผู้รับ ย้อนอ่าน เรียงตาม key | [`kafka-streaming`](../kafka-streaming/SKILL.md) | หัวข้อ 1 เทียบ 2 ตัว |
| งานที่อาจรันซ้ำหรือหยุดกลางทาง | [`principle-safe-to-rerun`](../principle-safe-to-rerun/SKILL.md) | consumer ทุกตัวต้องผ่านหลักนี้ (หัวข้อ 5) |
| ปลายทางเป็นอีเมล LINE SMS | [`notifications`](../notifications/SKILL.md) | consumer ใช้กฎช่องทางและโควตาของ skill นั้น |
| ให้ agent ดูสถานะ broker | [`mcp-server`](../mcp-server/SKILL.md) | [`mcp-rabbitmq`](references/mcp-rabbitmq.md) บอกตัวที่เลือกและสิทธิ์ |
| ข้อความมีเบอร์โทร ชื่อ | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | ใส่เฉพาะ id เหมือนหัวข้อ 6 ของ `kafka-streaming` |
| เฝ้าความยาวคิวและ alert | [`observability-basics`](../observability-basics/SKILL.md) | หัวข้อ 8 บอกว่าเฝ้าอะไร |

## 1 · เลือก RabbitMQ หรือ Kafka

หน้าเทียบของ RabbitMQ เขียนโดยทีม RabbitMQ เอง จึงเอนเข้าข้างตัวเอง · ใช้เป็นรายการลักษณะ ไม่ใช่คำตัดสิน

| ถามก่อน | ตอบแบบนี้ → RabbitMQ | ตอบแบบนี้ → Kafka |
|---|---|---|
| งานคืออะไร | task queue · แจกงานให้ worker · retry · dead letter · priority · TTL · RPC | event log ที่หลายรายอ่านซ้ำ · log compaction · Kafka Streams · connector |
| routing | ให้ broker เลือกคิวตามชนิดหรือหัวข้อ | ผู้รับเลือกอ่าน topic เอง |
| ย้อนอ่าน | ปกติไม่ต้อง (ถ้าต้อง ใช้ stream ข้อ 2.3) | ต้อง เป็นงานหลัก |
| ปริมาณ | ตัวเลขของ stream กับ Kafka "อยู่ในย่านเดียวกัน" ตามหน้า RabbitMQ เอง ไม่ได้วัดเอง | ปริมาณสูงมากและมีทีมดูแล cluster |

ตอบ "service เดียว ปริมาณหลักร้อยต่อชั่วโมง" → ลอง `background-jobs` ก่อน · ตัดสินแล้วจดเหตุผลลง ADR (`adr-writer`) · ต้นทุนบริการจัดการต่อเดือน `(ยังไม่ได้ตรวจ)`

## 2 · exchange · queue · stream

1. **exchange 4 ชนิด:** `direct` (key ตรงเป๊ะ) · `fanout` (ทุกคิวที่ผูก) · `topic` (pattern ของ key เช่น `order.*`) · `headers` (ดู header ไม่ดู key) · default exchange คือ direct ไม่มีชื่อ ส่งตามชื่อคิว · งานเดียวมีผู้รับเดียวใช้ default ได้ · หลายผู้รับหรือเปลี่ยนผู้รับทีหลัง ประกาศ exchange ของตัวเอง
2. **quorum queue เป็นค่าหลัก** สำหรับคิวที่ต้องทนและซ้ำสำเนา (เอกสารเรียก "default choice") · classic queue mirroring ถูกลบใน 4.0 จึงอย่าออกแบบใหม่ด้วยแบบนั้น · quorum ไม่รองรับ non-durable · exclusive · server-named · global QoS · ไม่เหมาะกับคิวชั่วคราว ความหน่วงต่ำสุด หรือ backlog 5 ล้านข้อความขึ้นไป
3. **stream** เมื่อต้องอ่านซ้ำ fan-out ใหญ่ หรือ backlog ใหญ่ · ต้องตั้ง retention เสมอ (`max-age` หรือ `max-length-bytes`) ไม่งั้นโตจนดิสก์เต็ม · ไม่มี TTL · priority · DLX · ตั้ง `x-queue-type=stream` ตอนประกาศ ตั้งด้วย policy ไม่ได้
4. ชื่อ: `<โดเมน>.<งาน>` เช่น `order.email.send` · 1 คิวต่อ 1 ชนิดงานที่ retry นโยบายเดียวกัน

## 3 · ฝั่งส่ง (publisher)

1. เปิด publisher confirms และรอผลทุกข้อความ · ส่งแบบ async หรือเป็นชุดแล้วรอ confirm · publish-and-wait ทีละข้อความเป็น anti-pattern ตามเอกสาร
2. ตั้ง `mandatory=true` · ข้อความที่ route ไม่ถึงคิวจะถูกคืน ไม่ใช่หายเงียบ · ฝั่งส่งต้องมีทางรับ return
3. ต่อขาดก่อนได้ confirm → ข้อความอาจถึงหรือไม่ถึงก็ได้ · ส่งซ้ำเฉพาะเมื่อผู้รับรับซ้ำได้ (หัวข้อ 5)
4. เขียน DB กับส่งข้อความในธุรกรรมเดียวไม่ได้ → ใช้ outbox เหมือน `kafka-streaming` หัวข้อ 3 ข้อ 4 · ทุกข้อความมี `message_id` ที่ไม่ซ้ำ ตั้งใน properties

## 4 · ฝั่งรับ (consumer)

1. **manual ack** ส่งหลังงานเสร็จ (ส่งอีเมลแล้ว บันทึกผลแล้ว) · auto-ack ตามเอกสารไม่ปลอดภัย: consumer ตายกลางงาน ข้อความหาย
2. **prefetch** ตั้งชัด · 100–300 ให้ throughput ดี (1 ปลอดภัยสุดแต่ช้า) · quorum จำกัดที่ 2,000 · งานที่ช้าต่อข้อความ (เรียกอีเมลภายนอก) เริ่มต่ำแล้ววัด
3. **อย่า requeue วน** เมื่อ error ชั่วคราว: เปลืองแบนด์วิดท์และ CPU ตามเอกสาร · ทำ retry แบบมีหน่วง หรือนับรอบแล้วส่งเข้า dead letter · บน quorum queue รุ่น 4.3 ขึ้นไป ล้มชั่วคราวให้ใช้ `basic.reject` (requeue) ไม่ใช่ `basic.nack` เพราะมีแค่ reject ที่นับเข้า `delivery-limit` และทำให้ `delayed-retry-type: failed` หน่วงให้ · nack ไม่นับ จึงวนได้ไม่รู้จบ (หัวข้อ 6)
4. ข้อความที่ถอดหรือตรวจไม่ผ่าน (poison) → reject แบบไม่ requeue ให้เข้า dead letter ทันที ไม่ปล่อยให้ consumer ล้มแล้วรับซ้ำเรื่อย ๆ
5. ค่า acknowledgement timeout ตั้งต้นของ consumer `(ยังไม่ได้ตรวจ ไม่ได้เปิดหน้า consumers)` · งานยาวกว่า timeout ให้ตรวจก่อนใช้

## 5 · ทำซ้ำได้ (idempotent)

เอกสาร confirms ระบุว่า redelivery ทำให้ซ้ำได้ และข้อความอาจไปถึง consumer อื่น · ดังนั้นทุก consumer เขียน `message_id` ที่ทำแล้วลงตาราง (primary key) ในธุรกรรมเดียวกับผลงาน · เจอซ้ำ → ข้ามแล้ว ack · ขั้นตอนคิดตาม `principle-safe-to-rerun` · ปลายทางที่ส่งออกนอกระบบ (อีเมล) กันซ้ำด้วย idempotency key ของผู้ให้บริการถ้ามี `(ยังไม่ได้ตรวจของผู้ให้บริการที่ใช้)`

## 6 · dead letter · delivery limit · retry

1. **ตั้ง dead letter exchange (DLX) ด้วย policy** ไม่ใช่ `x-arguments` ตอนประกาศ · เปลี่ยนทีหลังได้โดยไม่ต้องลบคิว
2. เหตุที่ข้อความเข้า DLX: reject/nack แบบไม่ requeue · TTL หมด · เกินความยาวคิว · เกิน delivery limit · ข้อความที่ตายมี header `x-death` บอกเหตุ
3. ค่าตั้งต้นเป็น at-most-once · quorum รองรับ at-least-once (`dead-letter-strategy=at-least-once` คู่ `overflow=reject-publish` และ feature flag `stream_queue`) · ใช้เมื่อข้อความที่ตายห้ามหาย · ปลายทางก็อาจได้ซ้ำ
4. **delivery limit** ของ quorum queue ตั้งต้น 20 ครั้ง (ตั้งแต่ 4.0) เกินแล้วทิ้งหรือส่ง DLX · อย่าพึ่งการทิ้ง ตั้ง DLX เสมอ · ตั้งค่าใน policy ด้วย key `delivery-limit` (เช่น `{"delivery-limit": 50}` · `-1` = ไม่จำกัด ซึ่งเอกสารไม่แนะนำ) ใส่เป็น argument `x-delivery-limit` ได้ แต่ policy แก้ทีหลังได้โดยไม่ต้องลบคิว · ตั้งแต่ 4.3 นับเฉพาะส่งล้มเหลว (`basic.reject` และ client พัง ไม่นับ nack ธรรมดา)
5. **retry:** ใช้ delayed retry ของ quorum queue (มีตั้งแต่ 4.3) แทนวน DLX กับคิว TTL หลายขั้น · **ใส่ทุก key ไว้ใน policy เดียวกับ DLX และ `delivery-limit`** เพราะคิวหนึ่งใช้ได้แค่ policy เดียว (ตัว priority สูงสุด) และ key ของหลาย policy ไม่รวมกัน (เอกสาร policies · ตรวจ 2026-10-27):
   `rabbitmqctl set_policy order-email "^order\.email\." '{"dead-letter-exchange": "order.dlx", "delivery-limit": 5, "delayed-retry-type": "failed", "delayed-retry-min": 1000, "delayed-retry-max": 30000}' --apply-to quorum_queues` (หน่วยมิลลิวินาที · type มี `disabled` ค่าตั้งต้น · `all` · `failed` · `returned`) · รุ่นต่ำกว่า 4.3 ไม่มีคำสั่งนี้ ต้องอัปเกรดหรือใช้คิวหน่วงแบบ TTL + DLX · ข้อความที่ทำไม่ได้เลย → DLX
6. DLX ที่มีข้อความ = มีงานของคน · ตั้ง alert และกำหนดคนเล่นซ้ำหลังแก้

## 7 · ความปลอดภัย

1. user `guest` เชื่อมได้เฉพาะ localhost ตามค่าตั้งต้น · production ลบหรือเปลี่ยนรหัส · ห้ามตั้ง `loopback_users = none`
2. user แยกต่อแอป · vhost แยกต่อระบบ · สิทธิ์ configure/write/read เป็น regex ต่อ vhost (`^$` = ไม่มีสิทธิ์) · แอปส่งได้เฉพาะ exchange ของมัน แอปรับอ่านได้เฉพาะคิวของมัน
3. TLS 1.2 ขึ้นไปที่ port 5671 (1.0 และ 1.1 deprecated) · production ใช้ `verify_peer` กับ `fail_if_no_peer_cert` · ใบรับรองที่ tls-gen สร้างใช้ dev/test เท่านั้น · Management API ใช้ HTTPS
4. รหัสผ่านไม่เข้า git (`config-and-secrets`) · ข้อความมีเฉพาะ id ไม่ใส่เบอร์โทร ชื่อ เนื้อหา (`pdpa-compliance`)
5. ให้ agent ดูสถานะ → [`mcp-rabbitmq`](references/mcp-rabbitmq.md)

## 8 · รุ่นและการเฝ้าดู

รุ่นตรวจ 2026-10-27 · ชุด 4.4 เป็นชุดปัจจุบันตามหน้า release-information · 4.3 ดูแลถึง 31 Jan 2027 · 4.4 ถึง 31 Jul 2027 · 4.2 ลงไปหมดการดูแลของชุมชนแล้ว (4.2 ตารางลง 31 Jul 2026 แต่ตารางลงรุ่น 4.2.11 วันที่ 16 Sep 2026 ซึ่งขัดกันเอง) · เลขรุ่นย่อยหน้า release-information กับ GitHub ไม่ตรงกัน (GitHub: v4.4.0 วันที่ 2026-10-19 และ v4.3.7 วันที่ 2026-10-20 · หน้า release-information: 4.4.0 วันที่ 20 Oct และ 4.3.6) · ก่อนล็อกรุ่นใน production เปิดทั้ง 2 หน้าแล้วเลือกตามที่ติดตั้งได้จริง

เฝ้า: ความยาวคิว · อายุข้อความเก่าสุด · จำนวนข้อความใน DLX · connection ที่หลุดบ่อย · ดิสก์ของ stream · เกณฑ์ alert ตั้งจากปริมาณจริง `(รอยืนยัน)` · ตามหลัก `observability-basics`

## ตัวอย่างจริง 1 ชุด

ป้าย `ตัวอย่าง`: ออกแบบบนกระดาษ ยังไม่ได้รันกับ RabbitMQ จริง

**โจทย์:** เว็บแอปสั่งซื้อต้องส่งอีเมลยืนยันออเดอร์ ห้ามอีเมลหายเมื่อ worker ตาย และถ้าส่งซ้ำต้องไม่ทำให้ลูกค้าได้อีเมล 2 ฉบับ

| เรื่อง | ที่เลือก | เหตุผล |
|---|---|---|
| broker | ใช้ · ต้องการ retry กับ dead letter ที่ broker | หัวข้อ 1 · ถ้าปริมาณน้อยมากกลับไป `background-jobs` |
| คิว | `order.email.send` เป็น quorum queue ผ่าน exchange `order.events` (direct) | หัวข้อ 2 |
| ส่ง | แถว outbox ในธุรกรรมสั่งซื้อ · relay ส่งพร้อม `mandatory=true` · รอ confirm แล้วทำเครื่องหมาย · `message_id` = order id + ชนิด | หัวข้อ 3 |
| รับ | manual ack หลังส่งอีเมลและเขียน `processed_messages` · prefetch เริ่มต่ำแล้ววัด | หัวข้อ 4 และ 5 |
| ล้ม | ล้มชั่วคราวใช้ retry มีหน่วง · ถอดไม่ได้ reject ไม่ requeue · DLX ตั้งด้วย policy พร้อม delivery limit | หัวข้อ 6 |
| ความปลอดภัย | user `order-app` แยก vhost `shop` · TLS 5671 · ข้อความมีแค่ order id | หัวข้อ 7 |

โค้ด Python กับคำสั่งตั้ง policy อยู่ใน [`email-queue-example`](references/email-queue-example.md)

## ตรวจก่อนส่ง

1. มีคำตอบ "ต้องใช้ RabbitMQ หรือ Kafka หรือคิวธรรมดา" พร้อมเหตุผล
2. คิวที่ต้องทนเป็น quorum · stream มี retention · ไม่ออกแบบ classic mirroring
3. ฝั่งส่งรอ confirm (ไม่ใช่ทีละข้อความ) · `mandatory=true` · มี outbox ถ้าเกี่ยวกับ DB
4. consumer ใช้ manual ack หลังเสร็จ · ตั้ง prefetch · ไม่ requeue วน · มี `message_id` กันซ้ำในธุรกรรมเดียวกับผล
5. DLX ตั้งด้วย policy · มี delivery limit และคนดู DLX
6. ไม่ใช้ `guest` · user ต่อแอปต่อ vhost · TLS 1.2+ ที่ 5671
7. รุ่นที่ใช้ยังอยู่ในช่วงดูแล · ทุกค่าที่อ้างมีลิงก์หรือป้าย `(ยังไม่ได้ตรวจ)` · ไม่เขียนว่า exactly-once

## ที่มา

ตรวจ 2026-10-27 (เปิดอ่านผ่านเครื่องมือดึงหน้าเว็บที่สรุปโดยโมเดลเล็ก จึงควรเปิดหน้าดิบซ้ำก่อนล็อกค่าใน production)

- รุ่นและช่วงดูแล https://www.rabbitmq.com/release-information · https://api.github.com/repos/rabbitmq/rabbitmq-server/releases (อ่านเฉพาะ 2 รายการแรก)
- quorum queue · delivery limit https://www.rabbitmq.com/docs/quorum-queues · stream https://www.rabbitmq.com/docs/streams
- publisher · confirms https://www.rabbitmq.com/docs/publishers · https://www.rabbitmq.com/docs/confirms · DLX https://www.rabbitmq.com/docs/dlx
- exchange ทั้ง 4 https://www.rabbitmq.com/tutorials/amqp-concepts · เทียบ Kafka (เขียนโดย RabbitMQ เอง) https://www.rabbitmq.com/docs/compare/kafka
- สิทธิ์และ guest https://www.rabbitmq.com/docs/access-control · management https://www.rabbitmq.com/docs/management · TLS https://www.rabbitmq.com/docs/ssl (อ่านถึงอักขระที่ 100000 จาก 118213)
- ตรวจแล้ว 2026-10-27 (https://www.rabbitmq.com/docs/quorum-queues): key `delivery-limit` ใน policy · ค่าตั้งต้น 20 ตั้งแต่ 4.0 · delayed retry ตั้งแต่ 4.3 กับ key `delayed-retry-type` `delayed-retry-min` `delayed-retry-max`
- ยังไม่ได้ตรวจ: ค่า acknowledgement timeout ตั้งต้น · API async confirm ของ client Python
