# หลักคิด · สถาปัตยกรรม API และฐานข้อมูล
> โครงสร้างระบบต้องรับการเปลี่ยนแปลงและความล้มเหลวได้ โดยคนที่ใช้ API และข้อมูลเดิมไม่เสียหาย และคนรุ่นหลังรู้ว่าทำไมจึงออกแบบอย่างนี้

## งานดีคืออะไร
1. **บันทึกการตัดสินใจสำคัญพร้อมเหตุผลและตัวเลือกที่ไม่เลือก** — เหตุผลหายเร็ว คนรุ่นหลังจึงเชื่อตามโดยไม่รู้ที่มาหรือกลับคำตัดสินจนทำลายสิ่งที่มันปกป้อง · ตรวจด้วยตา: แต่ละบันทึกใน Architecture Decision Record (ADR) บอกบริบท ตัวเลือก ผลที่ตามมา และสถานะ โดยบันทึกที่เปลี่ยนใจแล้วยังอยู่และชี้ไปยังฉบับใหม่ ไม่ถูกแก้ทับ (S1, S2, S3)
2. **ตั้งเป้าคุณภาพเป็นสถานการณ์ที่วัดผ่านหรือไม่ผ่านได้ ก่อนเลือกโครงสร้าง** — ความเร็ว ความพร้อมใช้ ความปลอดภัย และต้นทุนดึงกัน ถ้าไม่เขียนเกณฑ์ไว้จะเลือกด้วยความรู้สึก · ตรวจด้วยตา: เป้าแต่ละข้อมีสิ่งกระตุ้น การตอบสนอง และเกณฑ์ที่วัดได้ ไม่ใช่คำว่า "เร็ว" หรือ "ปลอดภัย" ลอยๆ (S4, S5, S6)
3. **เริ่มจากโครงสร้างเรียบง่ายที่แบ่งโมดูลตามงานธุรกิจ แล้วแยกเป็นบริการเมื่อมีเหตุผลที่วัดได้** — ขอบเขตที่ถูกยากจะเห็นตอนเริ่ม และการแยกบริการเพิ่มภาระระบบกระจายและการดูแล · ตรวจด้วยตา: โมดูลหนึ่งมีหน้าที่เดียวและซ่อนรายละเอียดภายใน แก้โมดูลหนึ่งไม่ต้องแก้อีกโมดูลพร้อมกัน และถ้าแยกบริการก็มีเหตุผลบันทึกไว้ (S7, S8, S9, S10)
4. **ออกแบบให้รับความล้มเหลว** — ในระบบกระจายความล้มเหลวเลี่ยงไม่ได้ การลองซ้ำที่ไม่ระวังทำให้ระบบที่ล้มอยู่ล้มหนักขึ้น · ตรวจด้วยตา: ทุกการเรียกข้ามระบบมี timeout ลองซ้ำที่ชั้นเดียวด้วยการหน่วงแบบสุ่มและจำกัดรอบ การเขียนที่ถูกลองซ้ำมีกลไกกันทำซ้ำ (idempotency) และส่วนที่ไม่สำคัญล้มโดยหน้าหลักยังใช้ได้ (S11, S12, S13, S14)
5. **สัญญาของ API เป็นของผู้ใช้ เปลี่ยนแล้วผู้ใช้เดิมต้องไม่พัง** — การลบ เปลี่ยนชื่อ หรือเปลี่ยนชนิดฟิลด์ทำลายโค้ดที่ผู้ใช้ไม่ได้เป็นคนแก้ จึงนิยามสัญญาก่อนเขียนโค้ดและเพิ่มได้แต่ไม่เอาออก · ตรวจด้วยตา: เทียบสเปค OpenAPI ฉบับใหม่กับฉบับก่อน ไม่มีการลบ เปลี่ยนชื่อ หรือเปลี่ยนชนิด ส่วนที่จะเลิกมีประกาศล่วงหน้า (S15, S16, S17)
6. **ข้อผิดพลาดของ API มีรูปแบบเดียว เครื่องอ่านได้ และไม่รั่วรายละเอียดภายใน** — ผู้เรียกแยกว่าควรลองซ้ำหรือแก้คำขอได้ และผู้โจมตีไม่ได้ข้อมูลโครงสร้างระบบ · ตรวจด้วยตา: ทุกจุดคืนข้อผิดพลาดรูปเดียวกัน (เช่นตาม Request for Comments (RFC) 9457) มีรหัสที่เสถียร ไม่มี stack trace หรือชื่อตาราง และรายละเอียดเต็มอยู่ใน log ฝั่งเซิร์ฟเวอร์ (S17, S18, S19)
7. **ให้ฐานข้อมูลบังคับกฎความถูกต้องเอง** — กฎที่อยู่ในฐานข้อมูลใช้ได้กับทุกโปรแกรม สคริปต์ และคำสั่งมือ ไม่ใช่เฉพาะโค้ดที่ตรวจไว้ · ตรวจด้วยตา: ค่าที่ต้องมีเป็น NOT NULL ค่าที่ห้ามซ้ำเป็น UNIQUE ความสัมพันธ์เป็น FOREIGN KEY และช่วงค่าเป็น CHECK ไม่ได้พึ่งโค้ดแอปอย่างเดียว (S20, S21, S22)
8. **เปลี่ยน schema ทีละขั้นให้เข้ากันได้ย้อนหลัง และเก็บ migration เป็นโค้ดใน version control** — ระบบจริงหยุดไม่ได้ และขั้นเล็กถอยกลับง่าย · ตรวจด้วยตา: การเปลี่ยนที่ทำลายของเดิมแบ่งเป็นเพิ่มของใหม่ ย้ายผู้ใช้ แล้วจึงลบของเก่า (expand, migrate, contract) และ migration ทุกอันรันจากฐานเปล่าได้ผลเหมือนกัน (S23, S24, S25)

## พลาดบ่อย
- เลือกเทคโนโลยีหรือโครงสร้างตามกระแสโดยไม่เขียนเป้าคุณภาพ → ได้ความซับซ้อนที่ไม่ได้แก้ปัญหาจริง (S4, S8)
- แยก microservice ตั้งแต่ยังไม่เข้าใจโดเมน → ขอบเขตผิด บริการคุยกันถี่ ย้ายภายหลังแพง (S7, S8)
- ลองซ้ำทุกชั้นพร้อมกันโดยไม่มี timeout หรือหน่วงเวลา → โหลดคูณทวี ระบบล้มต่อเนื่อง (S11, S12)
- แก้ API โดยลบหรือเปลี่ยนชื่อฟิลด์ในเวอร์ชันเดิม → ผู้ใช้เดิมพังโดยไม่ทันรู้ตัว (S15, S16)
- สร้าง index เผื่อไว้ทุกคอลัมน์ → เขียนข้อมูลช้าลง โดยอ่านไม่ได้เร็วขึ้นเสมอ ควรสร้างจากคำสั่งค้นจริงและลบที่ไม่ได้ใช้ (S26, S27, S28)
- ตรวจกฎข้อมูลเฉพาะในหน้าจอหรือโค้ดแอป → สคริปต์และงานเบื้องหลังเขียนข้อมูลเสียเข้าฐานได้ (S20, S22)

## ใช้คู่กับ
skills: `architecture-patterns` · `architecture-review` · `adr-writer` · `api-design` · `api-conventions` · `database-design` · `stack-sql` · `background-jobs` · `error-handling-patterns` · `web-service-essentials` · `blast-radius` · `pdpa-compliance` · playbook: `new-project` · `feature` · `refactor` · `performance`

## Sources (checked 2026-11-27)
- S1 · Documenting Architecture Decisions, Michael Nygard (Cognitect) · https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions · หลัก 1
- S2 · Architecture decision record, Azure Well-Architected Framework, Microsoft · https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record · หลัก 1
- S3 · Architectural Decision Records, adr.github.io · https://adr.github.io/ · หลัก 1
- S4 · Quality requirements (section 10), arc42 · https://docs.arc42.org/section-10/ · หลัก 2
- S5 · Azure Well-Architected Framework, Microsoft · https://learn.microsoft.com/en-us/azure/well-architected/ · หลัก 2
- S6 · International Organization for Standardization / International Electrotechnical Commission (ISO/IEC) 25010:2023 product quality model, ISO · https://www.iso.org/standard/78176.html · หลัก 2
- S7 · MonolithFirst, Martin Fowler · https://martinfowler.com/bliki/MonolithFirst.html · หลัก 3
- S8 · Microservices architecture style, Azure Architecture Center · https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices · หลัก 3
- S9 · Boundaries, cohesion, and loose coupling, Azure Architecture Center · https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis · หลัก 3
- S10 · Bounded Context, Martin Fowler · https://martinfowler.com/bliki/BoundedContext.html · หลัก 3
- S11 · Timeouts, retries and backoff with jitter, Amazon Builders' Library · https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter · หลัก 4
- S12 · Addressing Cascading Failures, Google Site Reliability Engineering (SRE) Book · https://sre.google/sre-book/addressing-cascading-failures/ · หลัก 4
- S13 · Reliability design principles, Azure Well-Architected Framework · https://learn.microsoft.com/en-us/azure/well-architected/reliability/principles · หลัก 4
- S14 · Idempotent requests, Stripe API docs · https://docs.stripe.com/api/idempotent_requests · หลัก 4
- S15 · AIP-180 Backwards compatibility, Google API Improvement Proposals · https://google.aip.dev/180 · หลัก 5
- S16 · RESTful API Guidelines, Zalando · https://opensource.zalando.com/restful-api-guidelines/ · หลัก 5
- S17 · Azure REST API Guidelines, Microsoft · https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md · หลัก 5, 6
- S18 · RFC 9457 Problem Details for HTTP APIs, IETF · https://www.rfc-editor.org/rfc/rfc9457.html · หลัก 6
- S19 · Error Handling Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html · หลัก 6
- S20 · Constraints, PostgreSQL documentation · https://www.postgresql.org/docs/current/ddl-constraints.html · หลัก 7
- S21 · Primary and foreign key constraints, Microsoft SQL docs · https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints · หลัก 7
- S22 · A06:2025 Insecure Design, Open Worldwide Application Security Project (OWASP) Top 10:2025 · https://top10.owasp.org/2025/A06_2025-Insecure_Design/ · หลัก 7 (ตรวจความสมเหตุสมผลทุกชั้น)
- S23 · Evolutionary Database Design, Martin Fowler · https://martinfowler.com/articles/evodb.html · หลัก 8
- S24 · Parallel Change, Martin Fowler · https://martinfowler.com/bliki/ParallelChange.html · หลัก 8
- S25 · Online migrations at scale, Stripe · https://stripe.com/blog/online-migrations · หลัก 8
- S26 · Use The Index, Luke, Markus Winand · https://use-the-index-luke.com/sql/preface · พลาดบ่อย (index จากคำสั่งค้น)
- S27 · Indexes, PostgreSQL documentation · https://www.postgresql.org/docs/current/indexes-intro.html · พลาดบ่อย
- S28 · SQL Server index design guide, Microsoft · https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide · พลาดบ่อย
