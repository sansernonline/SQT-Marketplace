# Sources · kafka-streaming

## Sources

Checked 2026-10-27 (opened with a web page fetch tool; figures are copied from the fetched pages).

- Apache Kafka 4.4 · producer settings https://kafka.apache.org/44/configuration/producer-configs/ · consumer https://kafka.apache.org/44/configuration/consumer-configs/ · topic https://kafka.apache.org/44/configuration/topic-configs/ · broker https://kafka.apache.org/44/configuration/broker-configs/
- Delivery guarantees, order, idempotent producer, transaction, offset https://kafka.apache.org/44/design/design/ · key and partition https://kafka.apache.org/44/getting-started/introduction/ · adding partitions and viewing lag https://kafka.apache.org/44/operations/basic-kafka-operations/
- Confluent Schema Registry https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html · delivery semantics https://docs.confluent.io/kafka/design/delivery-semantics.html · consumer group coordination https://docs.confluent.io/kafka/design/consumer-design.html · DLQ (the Kafka Connect one, used as a reference idea, not the one for ordinary consumers) https://docs.confluent.io/platform/current/connect/index.html#dead-letter-queue
- Choosing the number of partitions (a 2015 article; check newer versions before using its numbers) https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/
- Transactional outbox https://microservices.io/patterns/data/transactional-outbox.html
- Testcontainers Kafka https://java.testcontainers.org/modules/kafka/
