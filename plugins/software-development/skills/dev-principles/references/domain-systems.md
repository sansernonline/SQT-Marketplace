# หลักคิด · ระบบในงานที่มีกฎหมายหรือเงินเกี่ยวข้อง
> ซอฟต์แวร์ที่แตะเงิน สุขภาพ อุปกรณ์จริง หรือเอกสารทางกฎหมาย ต้องพิสูจน์ย้อนหลังได้ว่าเกิดอะไรขึ้น และเมื่อพลาดต้องเสียหายน้อยที่สุด

หลักข้ามโดเมน ไม่ใช่รายโดเมน: ใช้กับการชำระเงิน สุขภาพ ประกันภัย อุปกรณ์ Internet of Things (IoT) สัญญาอัจฉริยะ ระบบเช่าใช้หลายผู้เช่า การชำระเงินหน้าร้านออนไลน์ และเอกสารกฎหมาย. ไฟล์นี้ไม่ใช่คำแนะนำทางกฎหมายหรือการแพทย์รายกรณี

## งานดีคืออะไร
1. **ทุกคำสั่งที่ขยับเงินรันซ้ำแล้วได้ผลเท่าเดิม ด้วยรหัสกันซ้ำที่ผู้เรียกเป็นคนสร้าง** — เครือข่ายหลุดแล้วลองใหม่เป็นเรื่องปกติ ถ้าไม่กันซ้ำจะตัดเงินสองรอบ · ตรวจด้วยตา: เรียกคำขอจ่ายเดิมซ้ำแล้วได้ผลลัพธ์เดิมและเงินขยับครั้งเดียว และถ้าส่งรหัสเดิมกับข้อมูลต่างกันระบบปฏิเสธ · **เฉพาะไทย**: ผู้ให้บริการระบบหรือบริการชำระเงินที่เข้าข่าย พ.ร.บ.ระบบการชำระเงิน พ.ศ. 2560 ต้องขออนุญาตหรือขึ้นทะเบียนกับ ธนาคารแห่งประเทศไทย (ธปท.) ก่อนทำธุรกิจ (S1, S2, S3, S4)
2. **บันทึกเหตุการณ์แบบต่อท้ายอย่างเดียว บอกได้ว่าใครทำอะไรเมื่อไร และแก้ผิดด้วยรายการใหม่ ไม่ใช่เขียนทับ** — บันทึกที่แก้ย้อนหลังได้ใช้เป็นหลักฐานไม่ได้ · ตรวจด้วยตา: ไม่มีคำสั่งแก้หรือลบแถวประวัติ มี log ที่กันการแก้ และ log ไม่มีรหัสผ่านหรือเลขบัตร · **เฉพาะไทย**: กฎหมายและหน่วยกำกับอาจกำหนดให้เก็บข้อมูลจราจร/การเข้าใช้ไว้ตามระยะเวลาที่กำหนด ตรวจระยะเวลาล่าสุดใน `audit-trail` และ `pdpa-compliance` หรือแหล่งทางการ (S5, S6, S7, S8, S9)
3. **เก็บข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์ และข้อมูลอ่อนไหวอย่างสุขภาพต้องมีฐานชัดเจน** — ข้อมูลที่ไม่เก็บรั่วไม่ได้ · ตรวจด้วยตา: ทุกช่องข้อมูลมีเหตุผลรองรับ ข้อมูลยืนยันตัวตนของบัตรไม่ถูกเก็บหลังอนุมัติแม้เข้ารหัส และเปลี่ยนไปใช้โทเคนจากผู้ให้บริการ · **เฉพาะไทย**: พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล มาตรา 22 เก็บเท่าที่จำเป็น และมาตรา 26 ข้อมูลสุขภาพต้องได้รับความยินยอมโดยชัดแจ้งเว้นแต่มีข้อยกเว้น (S10, S11, S12, S13)
4. **ของที่ปล่อยแล้วแก้ยาก (เฟิร์มแวร์อุปกรณ์ สัญญาอัจฉริยะ) ต้องผ่านด่านก่อนปล่อยหนักกว่า และมีทางอัปเดตที่ปลอดภัย ย้อนได้ หรือหยุดฉุกเฉิน** — แก้หลังปล่อยทำไม่ได้หรือแพง และอัปเดตที่ไม่ตรวจลายเซ็นคือช่องโจมตี · ตรวจด้วยตา: อัปเดตมีลายเซ็นตรวจก่อนติดตั้ง กันย้อนไปรุ่นเก่าที่มีช่องโหว่ ไฟดับกลางอัปเดตแล้วเครื่องไม่พัง และสัญญามีสิทธิ์ผู้ดูแลจำกัด มีทดสอบและทางหยุด (S14, S15, S16)
5. **แยกข้อมูลผู้เช่าที่ชั้นข้อมูลและสถาปัตยกรรม ไม่พึ่งแค่หน้าจอซ่อนปุ่ม** — ผู้ใช้ที่ล็อกอินถูกต้องยังเข้าถึงข้อมูลผู้เช่าอื่นได้ถ้าไม่มีการบังคับขอบเขต · ตรวจด้วยตา: ทุกคำค้นผูกรหัสผู้เช่าจากเซสชันฝั่งเซิร์ฟเวอร์ ไม่ใช่ค่าที่ไคลเอนต์ส่ง และมีเทสต์ที่พิสูจน์ว่าผู้เช่า A เปิดข้อมูล B ไม่ได้ (S17, S18, S19, S20)
6. **หน้าชำระเงินแสดงยอดรวมจริงก่อนกดจ่าย และปุ่มสั่งซื้อบอกชัดว่าผูกพันต้องจ่าย** — ค่าที่โผล่ท้ายสุดคือเหตุอันดับหนึ่งที่คนทิ้งตะกร้าและเป็นรูปแบบที่หน่วยงานกำกับเล่นงาน · ตรวจด้วยตา: เห็นยอดรวมรวมค่าส่งและภาษีตั้งแต่ก่อนกรอกข้อมูลส่วนตัว ปุ่มสุดท้ายใช้คำที่บอกว่าจ่ายเงิน (กฎหมายสหภาพยุโรปกำหนดไว้) และไม่บังคับสมัครสมาชิกเพื่อซื้อ (S21, S22, S23)
7. **เอกสารที่ลงนามอิเล็กทรอนิกส์ระบุตัวผู้ลงนามและเจตนาอนุมัติได้ และพิสูจน์ได้ว่าเนื้อหาไม่ถูกแก้หลังลงนาม** — กฎหมายยอมรับข้อมูลอิเล็กทรอนิกส์เมื่อวิธีการเชื่อถือได้ · ตรวจด้วยตา: ไฟล์ที่เปิดดูภายหลังตรวจลายเซ็นได้ แสดงว่าใคร เมื่อไร และเปลี่ยนเนื้อหาแล้วลายเซ็นไม่ผ่าน · **เฉพาะไทย**: พ.ร.บ.ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 มาตรา 9 ลายมือชื่อต้องระบุตัวและแสดงการยอมรับข้อความ มาตรา 10 ต้นฉบับต้องรักษาความครบถ้วนด้วยวิธีที่เชื่อถือได้ (S24, S25, S26)
8. **แลกเปลี่ยนข้อมูลสุขภาพและเอกสารควบคุมด้วยมาตรฐานสากลที่เครื่องอ่านได้ ไม่ใช้รูปแบบเฉพาะของระบบเรา** — ระบบที่คุยกันไม่ได้ทำให้ต้องคีย์ซ้ำและผิดพลาด · ตรวจด้วยตา: ข้อมูลส่งออกอยู่ในรูปแบบมาตรฐาน เช่น Fast Healthcare Interoperability Resources (FHIR) ที่ระบุเวอร์ชัน · **เฉพาะไทย**: สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (สพธอ.) วางข้อเสนอแนะมาตรฐาน ขมธอ. 34-2566 ใบรับรองแพทย์อิเล็กทรอนิกส์บน FHIR (S27, S28, S26)

## พลาดบ่อย
- คำขอจ่ายเงินไม่มีรหัสกันซ้ำ แล้วลองใหม่เมื่อหมดเวลา → ลูกค้าถูกตัดเงินซ้ำ (S1, S2)
- แก้ยอดในตารางเดิมแทนบันทึกรายการแก้ไข → ตรวจสอบย้อนหลังไม่ได้ (S5, S8)
- เก็บรหัสตรวจสอบบัตรไว้ "ชั่วคราว" → ผิดข้อกำหนดแม้เข้ารหัสแล้ว (S12)
- ส่งเฟิร์มแวร์โดยไม่เซ็นหรือไม่มีทางย้อน → อุปกรณ์ถูกยึดหรือพังทั้งฝูง (S14, S15)
- ซ่อนค่าธรรมเนียมจนหน้าสุดท้าย → ลูกค้าทิ้งตะกร้าและเข้าข่ายรูปแบบหลอก (S21, S22)
- ใช้รหัสผู้เช่าที่ไคลเอนต์ส่งมาเป็นตัวกรองสิทธิ์ → ข้อมูลข้ามผู้เช่ารั่ว (S17, S20)

## ใช้คู่กับ
skills: `fintech-payments` · `healthcare-systems` · `insurance-systems` · `iot-systems` · `smart-contracts` · `saas-platform` · `ecommerce-patterns` · `legal-document-systems` · `audit-trail` · `pdpa-compliance` · playbook: `feature` · `review` · `ship`

## Sources (checked 2026-11-27)
- S1 · Idempotent requests, Stripe API · https://docs.stripe.com/api/idempotent_requests · หลัก 1 (รหัสกันซ้ำ ลองใหม่ได้ ตรวจพารามิเตอร์ตรงกัน)
- S2 · Making retries safe with idempotent APIs, Amazon Builders' Library · https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ · หลัก 1
- S3 · The Idempotency-Key HTTP Header Field, IETF Internet-Draft · https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/ · หลัก 1
- S4 · การกำกับตาม พ.ร.บ. ระบบการชำระเงิน พ.ศ. 2560, ธปท. · https://www.bot.or.th/th/our-roles/payment-systems/payment-act-oversight.html · หลัก 1 (ไทย)
- S5 · สรุปประกาศการเก็บข้อมูลจราจรคอมพิวเตอร์, iLaw · https://www.ilaw.or.th/articles/4832 · หลัก 2 (ไทย มีหน้าที่เก็บข้อมูลจราจร)
- S6 · Books: an immutable double-entry accounting database service, Square Engineering · https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/ · หลัก 2 (แก้ด้วยรายการใหม่)
- S7 · Logging Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html · หลัก 2 (when where who what กันแก้ ไม่ log ความลับ)
- S8 · 45 CFR 164.312 Technical safeguards (b) Audit controls, US Code of Federal Regulations · https://www.law.cornell.edu/cfr/text/45/164.312 · หลัก 2
- S9 · Guide to Computer Security Log Management (SP 800-92), NIST · https://csrc.nist.gov/pubs/sp/800/92/final · หลัก 2
- S10 · Personal Data Protection Act B.E. 2562 (unofficial English translation) · https://pdpa.msu.ac.th/wp-content/uploads/2022/05/EN-PDPA-2019.pdf · หลัก 3 (ม.22, 26, 37)
- S11 · Article 5 Principles relating to processing of personal data, GDPR · https://gdpr-info.eu/art-5-gdpr/ · หลัก 3 (data minimisation, purpose limitation)
- S12 · Why is storage of sensitive authentication data after authorization not permitted, PCI Security Standards Council FAQ · https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/for-pci-dss-why-is-storage-of-sensitive-authentication-data-sad-after-authorization-not-permitted-even-when-there-are-no-primary-account-numbers-pans-in-an-environment/ · หลัก 3
- S13 · PDPA Presentation, สำนักงานคณะกรรมการ ก.ล.ต. · https://www.sec.or.th/TH/Documents/Seminars/20200305-Presentation-PDPA.pdf · หลัก 3 (เก็บเท่าที่จำเป็น ข้อมูลอ่อนไหว)
- S14 · ETSI EN 303 645 Cyber Security for Consumer IoT, ETSI · https://www.etsi.org/deliver/etsi_en/303600_303699/303645/02.01.01_60/en_303645v020101p.pdf · หลัก 4 (5.3 อัปเดตปลอดภัย ตรวจความถูกต้อง)
- S15 · RFC 9019 A Firmware Update Architecture for IoT, IETF · https://www.rfc-editor.org/rfc/rfc9019 · หลัก 4 (เซ็นแมนิเฟสต์ กันย้อนรุ่น fail-safe)
- S16 · Smart contract security, ethereum.org · https://ethereum.org/en/developers/docs/smart-contracts/security/ · หลัก 4 (แก้ไม่ได้ ทดสอบและตรวจก่อน ทางหยุดฉุกเฉิน)
- S17 · Multi-Tenant Security Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html · หลัก 5
- S18 · Tenant isolation, AWS SaaS Architecture Fundamentals · https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/tenant-isolation.html · หลัก 5
- S19 · Tenancy models for a multitenant solution, Microsoft Azure Architecture Center · https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/considerations/tenancy-models · หลัก 5
- S20 · A01:2021 Broken Access Control, OWASP Top 10 · https://top10.owasp.org/2021/A01_2021-Broken_Access_Control/ · หลัก 5
- S21 · Cart Abandonment Rate Statistics, Baymard Institute · https://baymard.com/blog/cart-abandonment-rate-statistics · หลัก 6 (ค่าใช้จ่ายสูง 40% ต้องสมัครสมาชิก 18% ไม่เห็นยอดรวม 12%)
- S22 · Bringing Dark Patterns to Light, FTC · https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf · หลัก 6
- S23 · Directive 2011/83/EU Article 8, Consumer Rights · https://www.legislation.gov.uk/eudr/2011/83/article/8 · หลัก 6 (ปุ่มต้องบอกว่าผูกพันต้องจ่าย)
- S24 · Electronic Transactions Act B.E. 2544 (English translation), ETDA · https://etda.or.th/getattachment/8faa736b-3235-49c8-8b01-d37ff53a9a45/ENG-Version.aspx · หลัก 7 (ม.9, 10, 12)
- S25 · สรุป พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์ (ม.7, 9, 10, 26), สพธอ. · https://etda.or.th/getattachment/95a6dcdc-1517-4e1c-b436-19301bf01f9a/เอกสารบทความสงพมพออก-(Print-Out).aspx · หลัก 7
- S26 · ขมธอ. 34-2566 ใบรับรองแพทย์อิเล็กทรอนิกส์ (Electronic Medical Certificate), สพธอ. · https://etda.or.th/getattachment/3daecda8-9a69-4968-be10-facb507f5510/ขมธอ-34-2566.aspx · หลัก 7, 8 (โครงสร้างบน FHIR การลงลายมือชื่อและตรวจเอกสาร)
- S27 · FHIR Overview, HL7 · https://hl7.org/fhir/ · หลัก 8
- S28 · Fast Healthcare Interoperability Resources, HealthIT.gov (ONC) · https://healthit.gov/interoperability/investments/fhir/ · หลัก 8
