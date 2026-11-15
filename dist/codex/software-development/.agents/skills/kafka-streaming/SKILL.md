---
name: kafka-streaming
description: Use when services pass events via Kafka
---

# kafka-streaming — design Apache Kafka topics, producers and consumers so events are never silently lost or duplicated

Part of the `software-development` plugin. Follow `human-writing` for the wording of this file and of documents made from it. Every setting and version has a link and the check date 2026-10-27 in the "Sources" section and in [`config-table`](references/config-table.md).

> **One rule:** Kafka delivers "at least once", not "exactly once". The sender must not drop events (confirm every send, plus an outbox). The receiver must be safe to repeat (check `event_id`) and must commit the offset only after the work is done. If either side is missing, events are lost or duplicated and nobody sees it.

## Use when

- 2 or more services must receive the same event, and must be able to read it again (for example, a call summary goes to the CRM and a LINE notification from one set of events)
- Event order must be kept per call or per appointment (start call → end call → summary · book → reschedule → cancel)
- The user says Kafka · topic · consumer group · offset · partition · DLQ · "event หาย" · "event ซ้ำ" · "ส่ง event ระหว่าง service"
- Consumer lag keeps growing, or a consumer keeps being rebalanced

Do not use when: the work is a background job of a single service (send mail, build a report, run a timer) with one receiver and no need to read again → [`background-jobs`](../background-jobs/SKILL.md) is enough · you are choosing the architecture of the whole system → [`architecture-patterns`](../architecture-patterns/SKILL.md) first · the data comes from IoT devices → `iot-systems`

## Use something else instead, or alongside

| Situation | Use | How it relates to this skill |
|---|---|---|
| A plain job queue with one receiver | [`background-jobs`](../background-jobs/SKILL.md) | Section 1 decides whether you really need Kafka |
| A job queue that hands work to workers with retry and dead letter, using RabbitMQ | [`rabbitmq-messaging`](../rabbitmq-messaging/SKILL.md) | Section 1 of that file compares the 2 |
| Work that may run twice or stop halfway | [`principle-safe-to-rerun`](../principle-safe-to-rerun/SKILL.md) | Every consumer must pass this principle (section 4) |
| The destination is email, LINE push or SMS | [`notifications`](../notifications/SKILL.md) | A notification consumer follows that skill's channel and quota rules |
| Choosing event-driven against other styles | [`architecture-patterns`](../architecture-patterns/SKILL.md) | Kafka is a tool, not an architecture choice |
| Events contain phone numbers, names or voice | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | Section 6 is a short version. The data subject's rights are covered there |
| Setting up lag monitoring and alerts | [`observability-basics`](../observability-basics/SKILL.md) | Section 7 says what to watch |
| Designing a whole data pipeline | agent `data-engineer` | This skill gives the Kafka rules that agent must use |

## 1 · When to use Kafka

| Ask first | Answer like this → Kafka | Answer like this → not needed |
|---|---|---|
| How many receivers | 2 or more, reading the same set at different times | 1 |
| Must you re-read old events (refill a new CRM, replay after a bug fix) | Yes | Process once and discard |
| Does order matter | It matters per key (call, appointment) | It does not |
| Does someone run the cluster | Yes, or a managed service is used | No, and volume is in the hundreds per hour |

The volume of a single clinic is usually so small that Kafka is more than needed. If the answer is "1 receiver, no re-reading", use `background-jobs` and tell the user plainly. Write the decision and its reasons in an ADR (`adr-writer`). The monthly cost of a cluster and managed service is `(ยังไม่ได้ตรวจ)` (not yet checked).

## 2 · Topic

| Item | Do | Reason |
|---|---|---|
| Name | `<โดเมน>.<เรื่อง>.events.v<เลข>` for example `clinic.call.events.v1` · 1 topic per subject whose order must be kept | The name shows the owner · the version is for moving when the schema breaks compatibility |
| Key | The id of the thing whose order matters (`call_id` · `appointment_id`) · never leave the key empty | The same key goes to the same partition and is read in write order · order is not guaranteed across partitions |
| Number of partitions | Measure from real volume. Use at least max(target ÷ write speed per partition, target ÷ read speed per partition), then add a small margin · start at 3–6 for a small clinic `(ประมาณ ยังไม่ได้วัด)` (estimate, not measured) | You can add, not remove · after adding, an existing key may move to another partition and the order of old events for that key breaks |
| Replication factor (RF) | 3 on a real cluster · 1 only on a dev machine | RF 3 is the common production value |
| `min.insync.replicas` | 2, together with RF 3 and `acks=all` | A write succeeds when at least 2 up-to-date copies exist · 1 machine can fail with no loss and no write stop · the default is 1 |
| retention | `retention.ms` defaults to 7 days · set it longer than the longest consumer outage you accept · keep events with personal data as short as use allows (section 6) | A consumer that is down longer than retention cannot read events that were already deleted |
| compaction | Use it only for a "latest state per key" topic (`cleanup.policy=compact`) · an event topic that must keep history uses `delete` | Compaction keeps the latest value of each key. The history book → reschedule → cancel is lost |
| Creating topics | Create them with code or a script that can be reviewed · turn off `auto.create.topics.enable` | The default is on and `default.replication.factor` starts at 1. A mistyped topic name may create a new topic with no copies (a conclusion from two defaults, not tested) |

## 3 · Producer

1. Set `acks=all` and `enable.idempotence=true` explicitly, even though newer versions default to them. A config file should not depend on which client version a machine has installed.
2. An idempotent producer means the broker removes duplicates caused by retries of the same producer. It does **not** stop duplicates when the app itself resends after a restart.
3. Always wait for the send result (callback or future). Sending without looking at the result drops events silently. If the send fails, let the app's transaction know.
4. You cannot write to the DB and send an event in one transaction (send before commit and the DB fails · commit and the app dies before sending). Use an **outbox**: write a row into an `outbox` table in the same transaction as the business data. A sender (relay) then reads unsent rows, sends them to Kafka and marks them. If the relay dies after sending but before marking, the event is sent twice, so every event needs an `event_id`.
5. A Kafka transaction covers Kafka → Kafka only. Writing to the CRM or LINE does not count. Use at-least-once and a repeat-safe consumer, and do not chase exactly-once.
6. Each event carries `event_id` · `type` · `occurred_at` · `schema_version` · the id of the subject · only the data the receiver needs (full structure in [`clinic-example`](references/clinic-example.md)).

## 4 · Consumer

1. Set `enable.auto.commit=false`, then commit the offset **after** the work is done and the result is written to the DB. Committing before the work means that if the consumer dies midway, the event is lost. Auto commit, on by default, commits by time, not by work.
2. Make it repeat-safe: a `processed_events(event_id primary key)` table written in the same transaction as the result. If the `event_id` already exists, skip and commit. Work out the steps with `principle-safe-to-rerun`.
3. Check order with data inside the event, not receive time. If a "reschedule appointment" event arrives before "book appointment", wait or send it to retry. Do not overwrite.
4. For a temporary failure (CRM slow, LINE answers 5xx), retry in the process with increasing delay and a limited number of tries. For a permanent failure (malformed data, schema mismatch) or when retries run out, send the event to the **DLQ** (dead letter queue, a topic that holds events that cannot be processed) `<topic>.dlq` with headers giving the original topic · partition · offset and the error type, then keep committing. Never retry forever, because that partition is blocked for every event behind it.
5. A DLQ that is not empty means a person has work to do. Set an alert (section 7) and have someone responsible for replaying after the fix.
6. `auto.offset.reset` defaults to `latest`. A new consumer group, or an expired offset, silently skips old events. A service that must start from the beginning sets `earliest` (or `by_duration:<ระยะเวลา ISO 8601>`, for example `by_duration:PT6M`, which the docs recommend when adding partitions · it must be longer than the time the consumer takes to discover new partitions).
7. Rebalance: if work per record is slow (calling LINE), lower `max.poll.records` (default 500) or raise `max.poll.interval.ms` (default 5 minutes) so one round finishes in time. If it runs over, the group thinks the consumer died and rebalances, and events are processed again. When deployed on containers that restart often, consider `group.instance.id` (static membership). `group.protocol=consumer` (the new protocol) is an option `(ยังไม่ได้ตรวจความพร้อมของ client ที่ใช้)` (client readiness not checked). Keep the default `classic` for now.
8. The maximum number of working consumers in a group equals the number of partitions. Extra consumers sit idle.

## 5 · Schema

1. Define a schema for every event. Use Schema Registry with Avro or JSON Schema if the cluster supports it. Without a registry, put `schema_version` in the event and have receivers accept unknown fields.
2. Set the mode to `BACKWARD` (the default of Confluent Schema Registry), or `BACKWARD_TRANSITIVE` if several versions stay in a topic for a long time.
3. Changes that pass: add a field with a default · remove a field that had a default. **Never** rename, change a type or remove a required field. If you must break, create a `v2` topic and migrate.
4. Upgrade order: BACKWARD requires upgrading the **consumers first**, and only then letting the producer send the new shape.
5. The full rules for JSON Schema (open or closed content model) are more complex than Avro. Read the official page before choosing `(ยังไม่ได้ตรวจรายละเอียด)` (details not checked).

## 6 · Events that hold personal data (PDPA)

PDPA is the Personal Data Protection Act. Kafka's log is append-only, so deleting a single record on a data subject's request is inconvenient (a conclusion from the log structure, not tested). Design so that nothing needs deleting.

- Put in only ids (`call_id` · `appointment_id` · `patient_id`). Do not put phone numbers, names, audio, transcripts or symptoms. A receiver with permission fetches details from the source system by id.
- Audio and transcripts live in their own storage. The event holds only the file id.
- Set `retention.ms` of a topic that holds patient ids to the shortest time the consumers can still recover in. The DLQ is data too, so give it the same retention.
- If a user asks for data to be deleted → delete at the source system. The remaining events hold only ids that point to no one. Retention policy and data subject rights follow `pdpa-compliance`. Health data is sensitive, so ask the legal team before sending it across services `(รอยืนยัน)` (awaiting confirmation).
- Turn on encryption in transit and read permission per topic (ACL). Cluster secrets stay out of git (`config-and-secrets`).

## 7 · Testing and monitoring

| Test | Method |
|---|---|
| Use real Kafka in tests | Testcontainers Kafka module (Java uses `KafkaContainer` with the `apache/kafka` image) or local Kafka through docker compose · do not mock the client, because a mock cannot show offset and rebalance problems |
| The 4 cases you must have | The same event arrives twice and the result is written once · die before commit and restart with no event lost · a bad event goes to the DLQ and the partition does not block · 3 events with the same key arrive in order |

Monitor following `observability-basics`: **consumer lag** per group and partition (`kafka-consumer-groups.sh --describe --group <กลุ่ม>` gives the LAG value) · number of events in the DLQ · age of the oldest unsent `outbox` row · number of rebalances · set alert thresholds from the system's real volume `(รอยืนยัน)`.

## One real example

Label `ตัวอย่าง` (example) — designed on paper, not yet run on real Kafka.

**Task:** a dental clinic's voice agent sends call events (start · end · summary) and appointment events (book · reschedule · cancel) to a service that writes the summary to the CRM (Customer Relationship Management, the customer data system) and to a service that sends LINE notifications.

| Item | Choice | Reason |
|---|---|---|
| Is Kafka needed | Yes · 2 receivers, the CRM must be refillable by replay, order matters | Matches the table in section 1 · if only 1 receiver is left, go back to `background-jobs` |
| Topics | `clinic.call.events.v1` key `call_id` · `clinic.appointment.events.v1` key `appointment_id` | Order per call and per appointment |
| Topic settings | RF 3 · `min.insync.replicas=2` · retention 7 days · 3 partitions | Section 2 |
| Send | The voice agent writes the call summary and an outbox row in one DB transaction · the relay sends with `acks=all` | Section 3 |
| Receive | The CRM and LINE use separate consumer groups · `processed_events` · commit after the write · one DLQ per topic | Section 4 |
| Data in the event | `call_id` · `patient_id` · type · time · no phone number, name or audio | Receivers fetch details from the source system under their own permission |

The event structure · outbox SQL · short consumer code · full properties are in [`clinic-example`](references/clinic-example.md).

## Check before sending

1. There is an answer to "do we really need Kafka" with reasons, not chosen to follow a trend.
2. Every topic has a key that matches what must stay in order · RF · `min.insync.replicas` · retention are stated · automatic topic creation is off.
3. The producer has `acks=all` + idempotence · waits for the send result · the DB-write-then-send path uses an outbox.
4. The consumer has auto commit off · commits after the work · has an `event_id` check in the same transaction as the result · has a DLQ and someone watching it.
5. `auto.offset.reset` is set to what the service needs, not left at the default without thought.
6. The schema has a compatibility mode and an upgrade order · events carry no phone number, name or audio.
7. The 4 test cases pass on real Kafka · there are alerts for consumer lag and the DLQ.
8. Every value cited has a link or the label `(ยังไม่ได้ตรวจ)` · nothing claims exactly-once across external systems.

## Sources

Checked 2026-10-27 (opened with a web page fetch tool; figures are copied from the fetched pages).

- Apache Kafka 4.4 · producer settings https://kafka.apache.org/44/configuration/producer-configs/ · consumer https://kafka.apache.org/44/configuration/consumer-configs/ · topic https://kafka.apache.org/44/configuration/topic-configs/ · broker https://kafka.apache.org/44/configuration/broker-configs/
- Delivery guarantees, order, idempotent producer, transaction, offset https://kafka.apache.org/44/design/design/ · key and partition https://kafka.apache.org/44/getting-started/introduction/ · adding partitions and viewing lag https://kafka.apache.org/44/operations/basic-kafka-operations/
- Confluent Schema Registry https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html · delivery semantics https://docs.confluent.io/kafka/design/delivery-semantics.html · consumer group coordination https://docs.confluent.io/kafka/design/consumer-design.html · DLQ (the Kafka Connect one, used as a reference idea, not the one for ordinary consumers) https://docs.confluent.io/platform/current/connect/index.html#dead-letter-queue
- Choosing the number of partitions (a 2015 article; check newer versions before using its numbers) https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/
- Transactional outbox https://microservices.io/patterns/data/transactional-outbox.html
- Testcontainers Kafka https://java.testcontainers.org/modules/kafka/
