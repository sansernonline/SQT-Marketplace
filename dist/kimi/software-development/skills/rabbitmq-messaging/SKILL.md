---
name: rabbitmq-messaging
description: Use when work goes through RabbitMQ queues
---

# rabbitmq-messaging — design RabbitMQ queues so messages are not lost or duplicated silently

> **One rule:** RabbitMQ delivers "at least once", not "exactly once" · the sender must wait for confirms and learn when a message cannot be routed · the receiver must ack by itself after finishing, and be safe to repeat (check `message_id`) · a message that cannot be handled must go to a dead letter queue, not loop or be dropped silently.

## When to use

- Work must be spread across several workers (send email, build a report, call an external API) and needs retry plus a place to keep messages that failed
- You need routing at the broker (by type or topic) · priority · TTL · delayed retry · RPC · several protocols (AMQP · MQTT · STOMP)
- The user says RabbitMQ · queue · exchange · binding · ack · prefetch · DLX · dead letter · quorum · "ข้อความหาย" (message lost) · "ข้อความซ้ำ" (message duplicated)

Do not use when: several receivers must read the same set at their own pace and replay it → [`kafka-streaming`](../kafka-streaming/SKILL.md) (a RabbitMQ stream can also replay, see section 2) · background work of a single service where a database queue or the framework's queue is enough → [`background-jobs`](../background-jobs/SKILL.md)

## 1 · Choose RabbitMQ or Kafka

The RabbitMQ comparison page was written by the RabbitMQ team itself, so it leans toward itself · use it as a list of characteristics, not as a verdict.

| Ask first | Answer like this → RabbitMQ | Answer like this → Kafka |
|---|---|---|
| What is the job | task queue · hand work to workers · retry · dead letter · priority · TTL · RPC | event log that several readers re-read · log compaction · Kafka Streams · connectors |
| Routing | The broker picks the queue by type or topic | The receiver picks which topic to read |
| Replay | Usually not needed (if needed, use a stream, section 2.3) | Needed, it is the main job |
| Volume | RabbitMQ's own page says the numbers for streams and Kafka are "in the same range"; we did not measure | Very high volume and a team to run the cluster |

If the answer is "a single service, hundreds per hour" → try `background-jobs` first · once decided, record the reason in an ADR (`adr-writer`) · monthly cost of a managed service `(ยังไม่ได้ตรวจ)`

## 2 · exchange · queue · stream

1. **4 exchange types:** `direct` (exact key) · `fanout` (every bound queue) · `topic` (key pattern such as `order.*`) · `headers` (looks at headers, not the key) · the default exchange is an unnamed direct exchange that routes by queue name · one job with one receiver can use the default · for several receivers, or a receiver that may change later, declare your own exchange
2. **Quorum queue is the main choice** for queues that must be durable and replicated (the docs call it the "default choice") · classic queue mirroring was removed in 4.0, so do not design anything new that way · quorum does not support non-durable · exclusive · server-named · global QoS · it does not suit temporary queues, the lowest latency, or a backlog of 5 million messages or more
3. **Stream** when you need re-reading, large fan-out, or a large backlog · always set retention (`max-age` or `max-length-bytes`), or it grows until the disk is full · no TTL · priority · DLX · set `x-queue-type=stream` at declaration, it cannot be set by policy
4. Names: `<domain>.<job>` such as `order.email.send` · 1 queue per job type that shares one retry policy

## 3 · Sender side (publisher)

1. Turn on publisher confirms and wait for the result of every message · send async or in batches, then wait for confirms · publish-and-wait one message at a time is an anti-pattern according to the docs
2. Set `mandatory=true` · a message that cannot be routed to a queue is returned, not lost silently · the sender must have a way to receive the return
3. The connection drops before a confirm arrives → the message may or may not have arrived · resend only if the receiver can take a repeat (section 5)
4. Writing to the DB and sending a message cannot share one transaction → use an outbox, as in `kafka-streaming` section 3 item 4 · every message has a unique `message_id`, set in its properties

## 4 · Receiver side (consumer)

1. **Manual ack** sent after the work is done (email sent, result saved) · auto-ack is unsafe according to the docs: if the consumer dies mid-work, the message is lost
2. **Prefetch** set explicitly · 100–300 gives good throughput (1 is safest but slow) · quorum limits it at 2,000 · for work that is slow per message (calling an external email service), start low and measure
   - Heavy work that waits on another backend (for example a GPU model server): set prefetch equal to the number of jobs the backend can really run at the same time · a backend that does one job at a time gains nothing from more prefetch, it only moves the queue to wait at the consumer (see `load-testing` section 5)
3. **Do not requeue in a loop** on a temporary error: it wastes bandwidth and CPU according to the docs · do a retry with a delay, or count the rounds and send it to dead letter · on a quorum queue, version 4.3 and above, for a temporary failure use `basic.reject` (requeue), not `basic.nack`, because only reject counts toward `delivery-limit` and makes `delayed-retry-type: failed` add the delay · nack does not count, so it can loop forever (section 6)
4. A message that cannot be decoded or fails validation (poison) → reject without requeue so it goes to dead letter at once, and do not let the consumer crash and receive it again and again
5. The default acknowledgement timeout of the consumer `(ยังไม่ได้ตรวจ ไม่ได้เปิดหน้า consumers)` (not yet checked, the consumers page was not opened) · if work is longer than the timeout, check before use

## 5 · Safe to repeat (idempotent)

The confirms docs say redelivery can cause duplicates and a message may reach another consumer · so every consumer writes the `message_id` it has handled into a table (primary key) in the same transaction as the result · on a repeat → skip and ack · work out the steps by `principle-safe-to-rerun` · for destinations outside the system (email), guard against repeats with the provider's idempotency key if it has one `(ยังไม่ได้ตรวจของผู้ให้บริการที่ใช้)` (not yet checked for the provider in use)

## 6 · dead letter · delivery limit · retry

1. **Set the dead letter exchange (DLX) by policy**, not by `x-arguments` at declaration · it can be changed later without deleting the queue
2. Reasons a message enters the DLX: reject/nack without requeue · TTL expired · queue length exceeded · delivery limit exceeded · a dead message has an `x-death` header that gives the reason
3. The default is at-most-once · quorum supports at-least-once (`dead-letter-strategy=at-least-once` together with `overflow=reject-publish` and the feature flag `stream_queue`) · use it when a dead message must not be lost · the destination may also receive duplicates
4. The **delivery limit** of a quorum queue defaults to 20 (since 4.0), and past it the message is dropped or sent to the DLX · do not rely on dropping, always set a DLX · set it in a policy with the key `delivery-limit` (for example `{"delivery-limit": 50}` · `-1` = unlimited, which the docs do not recommend) · it can also be an argument `x-delivery-limit`, but a policy can be changed later without deleting the queue · since 4.3 it counts only failed deliveries (`basic.reject` and a crashed client, not a plain nack)
5. **Retry:** use the delayed retry of a quorum queue (available since 4.3) instead of looping through a DLX and several TTL queues · **put every key in the same policy as the DLX and `delivery-limit`**, because a queue can use only one policy (the one with the highest priority) and keys from several policies do not merge (policies docs · checked 2026-10-27):
   `rabbitmqctl set_policy order-email "^order\.email\." '{"dead-letter-exchange": "order.dlx", "delivery-limit": 5, "delayed-retry-type": "failed", "delayed-retry-min": 1000, "delayed-retry-max": 30000}' --apply-to quorum_queues` (units are milliseconds · the type is `disabled` by default · `all` · `failed` · `returned`) · versions below 4.3 do not have this setting, so upgrade or use a TTL + DLX delay queue · a message that can never be handled → DLX
6. A DLX that holds messages = work for a person · set an alert and name who replays them after the fix

## 7 · Security

1. The user `guest` can connect only from localhost by default · in production delete it or change the password · never set `loopback_users = none`
2. One user per app · one vhost per system · configure/write/read permissions are regexes per vhost (`^$` = no permission) · a sending app may publish only to its own exchange, a receiving app may read only its own queue
3. TLS 1.2 or above on port 5671 (1.0 and 1.1 are deprecated) · production uses `verify_peer` with `fail_if_no_peer_cert` · certificates made by tls-gen are for dev/test only · the Management API uses HTTPS
4. Passwords do not go into git (`config-and-secrets`) · messages hold only ids, with no phone numbers, names or content (`pdpa-compliance`)
5. To let an agent look at status → [`mcp-rabbitmq`](references/mcp-rabbitmq.md)

## 8 · Versions and monitoring

Versions checked 2026-10-27 · series 4.4 is the current series according to the release-information page · 4.3 is supported until 31 Jan 2027 · 4.4 until 31 Jul 2027 · 4.2 and below are out of community support · the version numbers on the release-information page and on GitHub do not match (details in `references/sources.md`) · before locking a version in production, open both pages and choose the one you can actually install

Watch: queue length · age of the oldest message · number of messages in the DLX · connections that drop often · disk of streams · set alert thresholds from real volume `(รอยืนยัน)` (awaiting confirmation) · follow `observability-basics`

A backend that the consumer calls may fail silently under high load (a model server once answered 503 for about 35 minutes and did not come back by itself) · the messages stay in the queue and are not lost · add a watchdog, a small script that checks `/health` every 10 seconds and restarts after 3 failures in a row

## Check before sending

1. There is an answer to "RabbitMQ, Kafka or a plain queue" with a reason
2. Queues that must be durable are quorum · streams have retention · no classic mirroring in the design
3. The sender waits for confirms (not one message at a time) · `mandatory=true` · an outbox if a DB is involved
4. The consumer uses manual ack after finishing · prefetch is set · no requeue loop · a `message_id` guards against repeats in the same transaction as the result
5. The DLX is set by policy · there is a delivery limit and someone watches the DLX
6. No `guest` · one user per app per vhost · TLS 1.2+ on 5671
7. The version in use is still supported · every value cited has a link or the label `(ยังไม่ได้ตรวจ)` · nowhere does it say exactly-once

## References

- [`references/email-queue-example.md`](references/email-queue-example.md) — open when building the order-email queue: code, policy command, design decisions table
- [`references/mcp-rabbitmq.md`](references/mcp-rabbitmq.md) — open when an agent must look at broker status
- [`references/sources.md`](references/sources.md) — open when re-checking dated versions and settings (checked 2026-10-27)
