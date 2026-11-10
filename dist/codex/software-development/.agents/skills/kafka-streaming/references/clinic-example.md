# ตัวอย่างเต็ม — event สายโทรและนัดหมายของคลินิกทันตกรรม

ป้าย `ตัวอย่าง` — เขียนจากกฎใน [`SKILL.md`](../SKILL.md) ยังไม่ได้รันกับ Kafka จริง ชื่อฟังก์ชันของ client เป็นโค้ดสมมติ ตรวจกับไลบรารีที่ใช้จริงก่อน

## สารบัญ

1. [topic](#1--topic)
2. [โครง event](#2--โครง-event)
3. [outbox ฝั่ง voice agent](#3--outbox-ฝั่ง-voice-agent)
4. [consumer ที่ทำซ้ำได้](#4--consumer-ที่ทำซ้ำได้)
5. [ค่า properties](#5--ค่า-properties)

## 1 · topic

| topic | key | event ชนิด | consumer group |
|---|---|---|---|
| `clinic.call.events.v1` | `call_id` | `call.started` · `call.ended` · `call.summarised` | `crm-summary` |
| `clinic.appointment.events.v1` | `appointment_id` | `appointment.booked` · `appointment.rescheduled` · `appointment.cancelled` | `line-notifier` · `crm-summary` |
| `<topic>.dlq` | เดิม | event ที่ประมวลผลไม่ได้ | คนดูแลเล่นซ้ำ |

สร้างทุก topic ด้วยสคริปต์ที่รีวิวได้: partition 3 · RF 3 · `min.insync.replicas=2` · `retention.ms=604800000` · `cleanup.policy=delete`

## 2 · โครง event

```json
{
  "event_id": "0b6f5c5e-2c3a-4b9e-9a77-5f1d1f7a4c10",
  "type": "appointment.rescheduled",
  "schema_version": 1,
  "occurred_at": "2026-10-27T09:30:00Z",
  "appointment_id": "apt_8841",
  "patient_id": "pat_1207",
  "version": 3,
  "data": { "new_slot_start": "2026-11-02T14:00:00+07:00", "reason_code": "patient_request" }
}
```

- ไม่มีเบอร์โทร ชื่อ เสียง ถอดเสียง · `reason_code` เป็นรหัส ไม่ใช่ข้อความอิสระ
- `version` นับเพิ่มต่อนัด ผู้รับใช้ตัดสินลำดับ ถ้ามาช้ากว่าที่เก็บอยู่ให้ข้าม
- `call.summarised` ใส่ `summary_ref` ชี้ที่เก็บสรุป ไม่ใส่ตัวสรุป

## 3 · outbox ฝั่ง voice agent

```sql
create table outbox (
  id          bigserial primary key,
  event_id    uuid not null unique,
  topic       text not null,
  key         text not null,
  payload     jsonb not null,
  created_at  timestamptz not null default now(),
  sent_at     timestamptz
);
```

```
begin
  insert/update ข้อมูลนัดหรือสรุปสาย
  insert into outbox(...)            -- ธุรกรรมเดียวกัน
commit

relay วนทุกไม่กี่วินาที:
  rows = select ... from outbox where sent_at is null order by id limit 100
  for row in rows:
    producer.send(row.topic, key=row.key, value=row.payload)   -- รอผล ล้มให้หยุดแล้วลองรอบหน้า
    update outbox set sent_at = now() where id = row.id
```

relay ตายหลังส่งก่อน `update` = ส่งซ้ำ · ผู้รับกันด้วย `event_id` (หัวข้อ 4) · ลบแถวที่ส่งแล้วเกินกำหนดด้วยงานเบื้องหลัง (`background-jobs`)

## 4 · consumer ที่ทำซ้ำได้

```
loop:
  records = consumer.poll()
  for r in records:
    try retry(สูงสุด 5 ครั้ง, หน่วงเพิ่มขึ้น):
      begin
        ถ้า event_id อยู่ใน processed_events แล้ว: ข้าม
        ถ้า r.version ต่ำกว่าที่เก็บอยู่: ข้าม
        เขียนผลลง CRM DB
        insert into processed_events(event_id)
      commit
    ถ้าล้มถาวรหรือหมดรอบลอง:
      dlq.send(topic = r.topic + ".dlq", value = r.value,
               headers = { src_topic, src_partition, src_offset, error_class })
  consumer.commit()   -- หลังทุก record ในรอบเสร็จหรือเข้า DLQ แล้วเท่านั้น
```

consumer แจ้งเตือน LINE: ส่งจริงนอกธุรกรรม DB จึงอาจส่งซ้ำถ้าตายหลังส่งก่อน commit · ลดด้วยการบันทึก `event_id` ที่ส่งแล้ว และใช้กลไกกันส่งซ้ำของ LINE ถ้ามี `(ยังไม่ได้ตรวจ ดู e-commerce:line-oa-setup และเอกสาร LINE Messaging API)` · ข้อความซ้ำ 1 ครั้งในกรณีหายากยอมรับได้ ข้อความหายไม่ได้ · กฎโควตากับช่องทางตาม `notifications`

## 5 · ค่า properties

producer (relay):

```properties
acks=all
enable.idempotence=true
delivery.timeout.ms=120000
```

consumer:

```properties
enable.auto.commit=false
auto.offset.reset=earliest
max.poll.records=50
max.poll.interval.ms=300000
# group.instance.id=<ชื่อ pod คงที่>   # ใช้เมื่อรีสตาร์ทบ่อย
```

`max.poll.records=50` เป็นค่าสมมติสำหรับ consumer ที่เรียก LINE ต่อ record `(ประมาณ ยังไม่ได้วัด)` · ค่าอื่นดู [`config-table`](config-table.md)
