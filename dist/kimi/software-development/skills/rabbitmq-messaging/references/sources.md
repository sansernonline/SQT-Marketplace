# Sources · rabbitmq-messaging

Checked 2026-10-27 (opened through a web-fetch tool that summarises pages with a small model, so open the raw page again before locking values in production)

- Versions and support period https://www.rabbitmq.com/release-information · https://api.github.com/repos/rabbitmq/rabbitmq-server/releases (read only the first 2 entries)
- quorum queue · delivery limit https://www.rabbitmq.com/docs/quorum-queues · stream https://www.rabbitmq.com/docs/streams
- publisher · confirms https://www.rabbitmq.com/docs/publishers · https://www.rabbitmq.com/docs/confirms · DLX https://www.rabbitmq.com/docs/dlx
- the 4 exchanges https://www.rabbitmq.com/tutorials/amqp-concepts · Kafka comparison (written by RabbitMQ itself) https://www.rabbitmq.com/docs/compare/kafka
- permissions and guest https://www.rabbitmq.com/docs/access-control · management https://www.rabbitmq.com/docs/management · TLS https://www.rabbitmq.com/docs/ssl (read up to character 100000 of 118213)
- Checked 2026-10-27 (https://www.rabbitmq.com/docs/quorum-queues): the policy key `delivery-limit` · default 20 since 4.0 · delayed retry since 4.3 with the keys `delayed-retry-type` `delayed-retry-min` `delayed-retry-max`
- Not yet checked (ยังไม่ได้ตรวจ): the default acknowledgement timeout · the async confirm API of the Python client

## Version-page discrepancies (2026-10-27)

- The release-information table says 4.2 ends 31 Jul 2026, but also lists release 4.2.11 on 16 Sep 2026, which contradicts itself.
- The minor version numbers on the release-information page and on GitHub do not match (GitHub: v4.4.0 on 2026-10-19 and v4.3.7 on 2026-10-20 · release-information page: 4.4.0 on 20 Oct and 4.3.6).
