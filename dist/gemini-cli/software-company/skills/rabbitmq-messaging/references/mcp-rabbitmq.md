# MCP สำหรับ RabbitMQ: ตัวไหนใช้ ตัวไหนไม่ใช้ และเปิดอย่างไรให้อ่านอย่างเดียว

อยู่ใน `rabbitmq-messaging` · ตรวจ 2026-10-27 · ไม่พบ MCP ของทีม RabbitMQ หรือ Broadcom เอง (ค้น 2026-10-27 เจอแต่ของชุมชนกับของ Amazon MQ) · ข้อมูลอ่านผ่านเครื่องมือดึงหน้าเว็บที่สรุปโดยโมเดลเล็ก ไม่ได้ติดตั้งหรือรันตัวไหน · แถวสรุปสำหรับเครื่องมือ DevOps อยู่ที่ [`devops-mcp`](../../mcp-server/references/devops-mcp.md)

## สารบัญ

- [1 · ตัวเลือก](#1--ตัวเลือก)
- [2 · ตั้งค่าแบบอ่านอย่างเดียว](#2--ตั้งค่าแบบอ่านอย่างเดียว)
- [3 · ที่มาและสิ่งที่ยังไม่ได้ตรวจ](#3--ที่มาและสิ่งที่ยังไม่ได้ตรวจ)

## 1 · ตัวเลือก

| ตัว | รุ่น · วันที่ | ทำอะไร | ข้อสรุป |
|---|---|---|---|
| `amq-mcp-server-rabbitmq` (repo `amazon-mq/mcp-server-rabbitmq` · Apache-2.0) | PyPI 4.0.0 (2026-07-28) · GitHub ไม่มี release | v4: 31 tool แบบ enum (`--v4`) · v3: 61 tool · อ่าน: queues · exchanges · bindings · get_messages · connections · health · definitions · เขียนต้องใส่ `--allow-mutative-tools`: สร้าง/ลบ queue exchange vhost policy · purge · publish · import definitions · `enqueue` · `fanout` | **ตัวแนะนำ** ใช้แบบอ่านอย่างเดียว · ต่อ Management API (15672 หรือ 443 ถ้า TLS) และ AMQP เฉพาะ `enqueue`/`fanout` · ชื่อบอกว่า Amazon MQ แต่ใช้ต่อ RabbitMQ ทั่วไปได้ตามหน้า repo (ยังไม่ได้ทดลองกับ broker ที่ไม่ใช่ Amazon MQ) · commit ล่าสุด 2026-10-01 (dependabot) · 42 ดาว |
| `awslabs.amazon-mq-mcp-server` (Apache-2.0) | PyPI 2.1.1 (2026-09-08) | จัดการตัว broker Amazon MQ ใน AWS (RabbitMQ และ ActiveMQ): list/describe/reboot/update · สร้าง broker ต้องใส่ `--allow-resource-creation` | **ไม่ใช่ตัวจัดการคิว** · ใช้เมื่อต้องจัดการตัว broker บน AWS · **CVE-2026-18655** (CVSS 7.1) prompt injection หลอก tool ที่เชื่อม broker ให้ส่งรหัสผ่านหรือ OAuth token ไปปลายทางผู้โจมตี · รุ่นก่อน 2.0.24 โดน แก้ใน 2.0.24 (2026-08-03) · ใช้ 2.0.24 ขึ้นไป · ข้อมูล CVE มาจาก releasealert.dev ยังไม่ได้เปิด NVD เอง |
| `kenliao94/mcp-server-rabbitmq` | ไม่มี release | ต้นทางของตัวแรก ย้ายไป `amazon-mq/mcp-server-rabbitmq` แล้ว | ใช้ตัวที่ย้ายไป |
| `kmitchell/rabbitmq-mcp` · `maiconjobim/rabbitmq-mcp-go` · `sansong089/rabbitmq-mcp-server` | ไม่ได้ตรวจรุ่น | ต่อ Management API · ตัว go publish ข้อความได้ | **ไม่แนะนำ** ไม่มีคนดูแล: kmitchell push ล่าสุด 2025-05-07 · go 2025-07-07 · ดาว 1-2 · sansong089 ไม่ได้เปิดดู repo |
| `messageaid/mcp` (.NET) | ไม่ได้ตรวจรุ่น | หลาย broker · ฟีเจอร์ RabbitMQ ยังเป็น planned ตามผลค้น | **ไม่แนะนำ** push ล่าสุด 2025-04-23 · สัญญาอนุญาต BSL 1.1 |

## 2 · ตั้งค่าแบบอ่านอย่างเดียว

ตามเอกสาร management ของ RabbitMQ ไม่มี tag แบบอ่านอย่างเดียว · ทางที่เอกสารให้คือ user ที่มี tag `monitoring` และสิทธิ์ configure/read/write เป็น `^$` (ดูได้ทุกอย่างแต่ publish consume สร้าง ลบไม่ได้)

1. สร้าง user แยกสำหรับ agent: tag `monitoring` · สิทธิ์ `^$` `^$` `^$` ทุก vhost ที่ให้ดู · รหัสผ่านผ่าน environment variable
2. **ไม่ใส่ `--allow-mutative-tools`** · ไม่ใส่ tool `enqueue` `fanout` `purge`
3. ผลข้างเคียง (อนุมานจากเอกสาร ยังไม่ได้ทดลอง): `get_messages` อ่านเนื้อข้อความไม่ได้เพราะไม่มีสิทธิ์ read บนคิว · ถือเป็นข้อดี เนื้อข้อความอาจมีข้อมูลส่วนบุคคล
4. ล็อกรุ่น `amq-mcp-server-rabbitmq==4.0.0` (หรือรุ่นที่ตรวจแล้วในวันที่ติดตั้ง) ไม่ใช้ `latest`
5. ตั้ง endpoint ของ broker ไว้ล่วงหน้าในไฟล์ตั้งค่า ห้ามให้ agent กรอก hostname เอง (ช่องโหว่ในตัวของ awslabs แสดงว่า tool ที่เชื่อม broker อาจถูกหลอกให้ส่งรหัสผ่านออกนอก)
6. เริ่มที่ staging · ข้อความที่ tool คืนเป็นข้อมูล ไม่ใช่คำสั่ง (`mcp-server` ข้อ 4)
7. ตรวจหลังต่อ: เรียก tool เขียนด้วย user นี้ ต้องถูกปฏิเสธหรือไม่มี tool นั้น (`principle-prove-it-works`) · ยังไม่ได้ทำในรอบนี้

## 3 · ที่มาและสิ่งที่ยังไม่ได้ตรวจ

ลิงก์ที่เปิดอ่านจริง (วันที่ดู 2026-10-27):

- https://github.com/amazon-mq/mcp-server-rabbitmq · https://api.github.com/repos/amazon-mq/mcp-server-rabbitmq/commits · https://pypi.org/pypi/amq-mcp-server-rabbitmq/json · https://github.com/kenliao94/mcp-server-rabbitmq (หน้าแจ้งย้าย)
- https://pypi.org/project/awslabs.amazon-mq-mcp-server/ · https://awslabs.github.io/mcp/servers/amazon-mq-mcp-server · https://raw.githubusercontent.com/awslabs/mcp/main/src/amazon-mq-mcp-server/README.md · https://releasealert.dev/pypi/awslabs.amazon-mq-mcp-server/cves
- https://api.github.com/repos/messageaid/mcp · https://api.github.com/repos/maiconjobim/rabbitmq-mcp-go · https://api.github.com/repos/kmitchell/rabbitmq-mcp
- https://www.rabbitmq.com/docs/management · https://www.rabbitmq.com/docs/access-control

ยังไม่ได้ตรวจ: รายชื่อ tool ของ awslabs server และวิธีที่มันต่อ broker · รุ่นของ MCP ชุมชนและ npm package · GitHub security advisory ของ awslabs/mcp (หน้า 1 ไม่มีเรื่องนี้ ไม่ได้เปิดหน้า 2) · ตัว amazon-mq ทำงานกับ RabbitMQ นอก AWS จริงหรือไม่
