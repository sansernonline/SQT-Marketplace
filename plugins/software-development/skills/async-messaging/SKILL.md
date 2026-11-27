---
name: async-messaging
description: Use for background jobs, queues, Kafka, RabbitMQ or notifications
---

# async-messaging — background work, queues and notifications that are safe to repeat

> **One rule:** every background job, consumer and message must be safe to run twice, because the machine can die halfway, a person can click again, and the system retries by itself.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Do this after the request", scheduled jobs, retries, dead letters, a long job the user waits on | [`references/background-jobs.md`](references/background-jobs.md) |
| Choosing a workflow engine for agent jobs that wait for approval (Temporal, Step Functions) | [`references/durable-workflow.md`](references/durable-workflow.md) |
| Services pass events through Kafka, topics, consumers, offsets | [`references/kafka-streaming.md`](references/kafka-streaming.md) |
| Work goes through RabbitMQ queues, acks, confirms, dead-letter queues | [`references/rabbitmq-messaging.md`](references/rabbitmq-messaging.md) and [`references/mcp-rabbitmq.md`](references/mcp-rabbitmq.md) |
| The system sends email, SMS, LINE or push messages | [`references/notifications.md`](references/notifications.md) |
| A worked example of a queue for email or clinic reminders | [`references/email-queue-example.md`](references/email-queue-example.md) and [`references/clinic-example.md`](references/clinic-example.md) |
| Settings for workers, retries and timeouts in one table | [`references/config-table.md`](references/config-table.md) |

## Steps every part shares

1. **Decide whether it really belongs in the background.** Do not move work off the request just because it is slow. If the user must see the result before moving on, keep it in the request.
2. **Give every message or job a unique key** (for example `event_id` or `message_id`), and record which ones were already handled before acting.
3. **Set the retry count and the wait between tries before going live.** Retry only errors that can get better with time. Send what still fails to a dead-letter queue, and alert a person when a job lands there.
4. **Set a new value, do not add to the old one.** `set status = 'paid'` is safer than `balance = balance + 100`.

## Check before done

- **Kafka:** the sender confirms every send (with an outbox if needed), and the receiver commits its offset only after the work is done.
- **RabbitMQ:** the receiver acks only after it finishes, and the sender waits for confirms.
- **Notifications:** consent is obtained before any marketing message (`pdpa-compliance`). Every non-transactional message has an unsubscribe link that works within 24 hours. Never send non-urgent push or SMS during quiet hours. Never build a message by string concatenation in code.
- **Notifications:** a failed email must not make the order fail. OTP codes go through their own queue, so they do not wait behind marketing mail.
- **Never** put passwords, tokens, card numbers or full personal data in a message, a job payload or a log.
- **Durable workflows:** a job that waits for a human approval must be able to wait for days without losing state.

## References

- [`references/sources.md`](references/sources.md) and the `sources.md` files in each sub-folder — where the dated tool facts came from
- [`references/kafka-streaming/`](references/kafka-streaming/) and [`references/rabbitmq-messaging/`](references/rabbitmq-messaging/) and [`references/notifications/`](references/notifications/) — source notes for each topic
