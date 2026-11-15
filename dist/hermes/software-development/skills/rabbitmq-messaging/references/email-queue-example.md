# ตัวอย่าง: คิวส่งอีเมลยืนยันออเดอร์

อยู่ใน `rabbitmq-messaging` · ป้าย `ตัวอย่าง`: เขียนจากเอกสารและความรู้ทั่วไป **ยังไม่ได้รันกับ RabbitMQ จริง** · key ใน policy ตรวจแล้ว 2026-10-27 (`delivery-limit` · `delayed-retry-*` จากเอกสาร quorum queues · `dead-letter-exchange` จากเอกสาร DLX) · ชื่อ method ของ client Python (`pika`) ยังไม่ได้เปิดเอกสารตรวจ `(ยังไม่ได้ตรวจ)` · ตรวจกับเอกสารของ client และของ RabbitMQ รุ่นที่ใช้ก่อนนำไปใช้

## สารบัญ

- [1 · ตั้งต้นฝั่ง broker](#1--ตั้งต้นฝั่ง-broker)
- [2 · producer (relay ของ outbox)](#2--producer-relay-ของ-outbox)
- [3 · consumer](#3--consumer)
- [4 · ที่ตัวอย่างนี้ยังไม่ครอบคลุม](#4--ที่ตัวอย่างนี้ยังไม่ครอบคลุม)

## 1 · ตั้งต้นฝั่ง broker

```bash
# user และ vhost แยกต่อแอป (รหัสผ่านมาจาก secrets ไม่พิมพ์ลงไฟล์)
rabbitmqctl add_vhost shop
rabbitmqctl add_user order-app "$ORDER_APP_PASSWORD"
rabbitmqctl set_permissions -p shop order-app "^order\." "^order\." "^order\."
rabbitmqctl delete_user guest

# DLX ตั้งด้วย policy (ชื่อ key `dead-letter-exchange` ตามเอกสาร DLX)
# `delivery-limit` และ delayed retry (RabbitMQ 4.3 ขึ้นไป) ตามเอกสาร quorum queues · ตรวจ 2026-10-27
rabbitmqctl set_policy -p shop email-dlx "^order\.email\." \
  '{"dead-letter-exchange":"order.dlx","delivery-limit":5,"delayed-retry-type":"failed","delayed-retry-min":1000,"delayed-retry-max":30000}' --apply-to quorum_queues
```

ประกาศในโค้ดตอนเริ่มระบบ (หรือสคริปต์ตั้งค่าที่รีวิวได้):

- exchange `order.events` ชนิด direct durable · exchange `order.dlx` ชนิด fanout durable
- คิว `order.email.send` ประกาศ `x-queue-type=quorum` durable · ผูกกับ `order.events` ด้วย key `email.send`
- คิว `order.email.dead` ผูกกับ `order.dlx` ไว้เก็บข้อความตาย · ตั้ง alert เมื่อไม่ว่าง
- ค่า 5 ใน `delivery-limit` เป็นตัวอย่าง ตั้งตามที่ผู้ให้บริการอีเมลรับ retry ได้ (ค่าตั้งต้นของ quorum คือ 20 ตามเอกสาร)

## 2 · producer (relay ของ outbox)

```python
import json
import pika

params = pika.ConnectionParameters(
    host=HOST, port=5671, virtual_host="shop",
    credentials=pika.PlainCredentials("order-app", PASSWORD),
    ssl_options=pika.SSLOptions(ssl_context),   # TLS 1.2+ verify_peer
)

def relay_batch(rows):
    with pika.BlockingConnection(params) as conn:
        ch = conn.channel()
        ch.confirm_delivery()                    # เปิด publisher confirms
        sent = []
        for r in rows:                           # rows = แถว outbox ที่ยังไม่ส่ง
            try:
                ch.basic_publish(
                    exchange="order.events", routing_key="email.send",
                    body=json.dumps({"order_id": r.order_id}),   # มีแต่ id
                    properties=pika.BasicProperties(
                        delivery_mode=2,         # persistent
                        message_id=f"{r.order_id}:order-confirmed",
                    ),
                    mandatory=True,              # route ไม่ได้ → ถูกคืน
                )
                sent.append(r)
            except (pika.exceptions.UnroutableError, pika.exceptions.NackError):
                log_and_alert(r)                 # ไม่ทำเครื่องหมาย ส่งรอบหน้า
        mark_sent(sent)                          # ทำเครื่องหมายหลัง confirm เท่านั้น
```

หมายเหตุ: `BlockingConnection` รอ confirm ต่อข้อความ ใช้ได้กับปริมาณน้อย · ปริมาณสูงใช้ client แบบ async หรือส่งเป็นชุดแล้วรอ confirm ตามหัวข้อ 3 ของ SKILL.md `(ยังไม่ได้ตรวจ API ที่รองรับ)` · relay ตายหลังส่งก่อนทำเครื่องหมาย = ส่งซ้ำ จึงต้องมี `message_id` และ consumer กันซ้ำ

## 3 · consumer

```python
def on_message(ch, method, props, body):
    try:
        order_id = json.loads(body)["order_id"]
    except (ValueError, KeyError):
        ch.basic_reject(method.delivery_tag, requeue=False)   # poison → DLX
        return
    try:
        with db.transaction():
            if already_processed(props.message_id):           # ตาราง processed_messages
                pass                                          # ซ้ำ ข้ามแล้ว ack
            else:
                send_confirmation_email(order_id)             # ล้มชั่วคราว → exception
                mark_processed(props.message_id)
        ch.basic_ack(method.delivery_tag)
    except TemporaryError:
        ch.basic_reject(method.delivery_tag, requeue=True)    # reject นับเข้า delivery limit · nack ไม่นับ (4.3+)
    except PermanentError:
        ch.basic_reject(method.delivery_tag, requeue=False)   # ไป DLX

ch.basic_qos(prefetch_count=10)                               # เริ่มต่ำ แล้ววัด
ch.basic_consume("order.email.send", on_message, auto_ack=False)
```

- ส่งอีเมลสำเร็จแต่เขียน `mark_processed` ล้ม → ข้อความมาอีกรอบ อีเมลซ้ำได้ · ปิดช่องด้วย idempotency key ของผู้ให้บริการอีเมลถ้ามี `(ยังไม่ได้ตรวจ)`
- ล้มชั่วคราวใช้ `basic_reject(requeue=True)` ไม่ใช้ `basic_nack` เพราะตั้งแต่ 4.3 มีแค่ reject (และ channel ปิดตอนยังมีข้อความค้าง) ที่นับเข้า `delivery-limit` · nack ไม่นับ จึงวนไม่รู้จบได้ และ `delayed-retry-type: failed` ก็หน่วงเฉพาะข้อความที่นับแล้ว · การหน่วงระหว่างรอบมาจาก `delayed-retry-*` ใน policy ข้างบน (1 ถึง 30 วินาที) ไม่ต้องทำคิวหน่วงเอง (เอกสาร quorum queues · ตรวจ 2026-10-27)

## 4 · ที่ตัวอย่างนี้ยังไม่ครอบคลุม

- เทสต์: ใช้ RabbitMQ จริงใน Testcontainers หรือ docker compose · 4 เคส: ข้อความเดิมเข้า 2 ครั้ง อีเมลออกครั้งเดียว · consumer ตายก่อน ack แล้วเริ่มใหม่ ข้อความไม่หาย · ข้อความเสียเข้า DLX แล้วคิวไม่ติด · route ไม่ได้ ฝั่งส่งรู้
- การต่อกลับเมื่อ connection หลุด · การเฝ้าดู · ไม่ได้ลงโค้ดเต็ม
