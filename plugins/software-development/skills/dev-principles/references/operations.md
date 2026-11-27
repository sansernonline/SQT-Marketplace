# หลักคิด · งานปฏิบัติการ (Operations): ปล่อยเวอร์ชัน ติดตั้ง เฝ้าระวัง เหตุขัดข้อง และ postmortem
> ระบบที่ขึ้นใช้งานจริงต้องปล่อยได้บ่อยโดยไม่ลุ้น เห็นปัญหาก่อนผู้ใช้บอก แก้เหตุได้เร็ว และเรียนรู้จากเหตุโดยไม่โทษคน

## งานดีคืออะไร
1. **ปล่อยบ่อย ปล่อยชิ้นเล็ก ผ่านท่อส่งอัตโนมัติ** — ชิ้นเล็กทำให้ทดสอบและหาสาเหตุง่าย ความเสี่ยงต่อครั้งต่ำ · ตรวจด้วยตา: เห็นวันที่ปล่อยล่าสุดหลายครั้งในเดือนเดียว และดูได้ว่าแต่ละครั้งมีการเปลี่ยนแปลงอะไรบ้าง (S1, S2, S3)
2. **สร้างครั้งเดียว ติดป้ายรุ่น ไม่แก้ของที่ปล่อยแล้ว** — รุ่นที่ปล่อยแล้วต้องสร้างซ้ำได้และแก้ไม่ได้ ถ้าจะเปลี่ยนต้องออกรุ่นใหม่ · ตรวจด้วยตา: ทุกรุ่นมีหมายเลขเฉพาะ และชี้กลับไปที่โค้ดต้นทางได้ (S1, S4, S3)
3. **ย้อนกลับได้เสมอ และเปิดให้ผู้ใช้ทีละส่วน** — ถ้ารุ่นใหม่พัง การย้อนต้องเร็วกว่าการแก้ไปข้างหน้า ส่วนฐานข้อมูลต้องปล่อยแยกจากแอป เพื่อให้มีจุดย้อน · ตรวจด้วยตา: มีบันทึกว่าซ้อมย้อนกลับแล้ว และเห็นเกณฑ์ที่ใช้ตัดสินว่าให้ไปต่อหรือหยุด (S5, S6, S1)
4. **แยก "ติดตั้ง" ออกจาก "เปิดใช้" และเก็บกวาดสวิตช์ฟีเจอร์ให้หมด** — โค้ดที่ยังไม่เสร็จขึ้นระบบแบบซ่อนได้ แต่สวิตช์ที่ค้างจะกลายเป็นหนี้ · ตรวจด้วยตา: สวิตช์ทุกตัวมีเจ้าของและวันที่ถอด (S7, S2, S5)
5. **ค่าตั้งค่าและความลับแยกจากโค้ด** — โค้ดต้องเปิดเผยได้โดยไม่ทำให้รหัสหลุด และรหัสต้องหมุนเปลี่ยนและจำกัดสิทธิ์ได้ · ตรวจด้วยตา: ค้นรหัสผ่านใน repository และใน log ของท่อส่งแล้วไม่พบ (S8, S9, S1)
6. **เฝ้าดูสิ่งที่ผู้ใช้รู้สึก และเตือนเฉพาะเรื่องที่ต้องลงมือทันที** — ใช้สัญญาณหลัก 4 อย่าง (ความหน่วง ปริมาณ ข้อผิดพลาด ความเต็ม) การเตือนมากเกินทำให้คนเลิกสนใจ รวมถึงเตือนจริง · ตรวจด้วยตา: ทุกการเตือนตอบได้ว่า "ใครต้องทำอะไรตอนนี้" และเรื่องไม่เร่งไปอยู่บนแดชบอร์ด (S10, S11, S12)
7. **ประกาศเหตุเร็ว มีผู้บัญชาการเหตุ (incident commander) คนเดียว ช่องทางสื่อสารเดียว** — การประกาศช้าและหลายช่องทางทำให้คนทำงานซ้ำกันและผู้เกี่ยวข้องไม่รู้สถานะ · ตรวจด้วยตา: เหตุหนึ่งมีเอกสารสถานะฉบับเดียวที่อัปเดตเป็นระยะ และระบุชัดว่าใครคุมอยู่ (S13, S14, S15)
8. **Postmortem แบบไม่โทษคน และจบด้วยงานแก้ที่มีเจ้าของและกำหนดวัน** — ถ้าลงโทษคน คนจะซ่อนข้อมูล เหตุเดิมจะกลับมา ให้ถามว่าระบบทำให้พลาดง่ายตรงไหน · ตรวจด้วยตา: เอกสารไม่ชี้ชื่อคนผิด มีลำดับเหตุการณ์ และทุกข้อแก้มีเจ้าของ วันที่ และถูกติดตามจนปิด (S16, S17, S15)
9. **(เฉพาะไทย) เหตุข้อมูลส่วนบุคคลรั่ว ต้องประเมินและแจ้งทันเวลา** — พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) มาตรา 37(4) ให้แจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส./PDPC) โดยเร็วและภายใน 72 ชั่วโมงนับแต่ทราบเหตุ เว้นแต่ไม่มีความเสี่ยงต่อสิทธิเสรีภาพ และแจ้งเจ้าของข้อมูลหากเสี่ยงสูง · ตรวจด้วยตา: แผนเหตุมีขั้นประเมินความเสี่ยงและช่องทางแจ้ง สคส. (S18, S19, S20) · เป็นหลักทั่วไป ไม่ใช่คำปรึกษากฎหมาย

## พลาดบ่อย
- ปล่อยก้อนใหญ่นานครั้ง → พังแล้วหาสาเหตุไม่เจอ ต้องหยุดรอนาน (S1, S2)
- ไม่เคยซ้อมย้อนกลับ หรือผูกการเปลี่ยนฐานข้อมูลไว้กับรุ่นแอป → ย้อนแล้วข้อมูลพัง (S5, S6)
- ฝังรหัสผ่านในโค้ดหรือปล่อยให้ติดใน log → รหัสหลุดและหมุนเปลี่ยนไม่ได้ (S8, S9)
- เตือนทุกเรื่องที่วัดได้ → คนข้ามการเตือน แม้เป็นเหตุจริง (S10, S11, S12)
- Postmortem หาคนผิด หรือเขียนแล้วไม่มีใครตามงานแก้ → ข้อมูลไม่ครบ เหตุเดิมเกิดซ้ำ (S16, S17, S15)
- สวิตช์ฟีเจอร์ค้างจนไม่มีใครรู้ว่าตัวไหนเปิดอยู่ → เปิดฟีเจอร์ที่ซ่อนไว้โดยไม่ตั้งใจ (S7)

## ใช้คู่กับ
skills: `cicd-and-release` · `infra-and-deploy` · `incidents-and-monitoring` · `errors-and-logs` · `project-docs` · playbook: `ship`

## Sources (checked 2026-11-27)
- S1 · Release Engineering, Google SRE Book · https://sre.google/sre-book/release-engineering/ · หลัก 1, 2, 3, 5 (build ซ้ำได้, ปล่อยถี่, config ใน repository)
- S2 · Continuous delivery, DORA (Google Cloud) · https://dora.dev/capabilities/continuous-delivery/ · หลัก 1, 4 (ชิ้นเล็ก, สาขาอายุสั้น, ตัวชี้วัด 4 ตัว)
- S3 · Continuous Delivery, Martin Fowler · https://martinfowler.com/bliki/ContinuousDelivery.html · หลัก 1, 2
- S4 · Build, release, run, The Twelve-Factor App · https://12factor.net/build-release-run · หลัก 2 (รุ่นแก้ไม่ได้ มี ID)
- S5 · Canarying Releases, Google SRE Workbook · https://sre.google/workbook/canarying-releases/ · หลัก 3, 4
- S6 · Blue Green Deployment, Martin Fowler · https://martinfowler.com/bliki/BlueGreenDeployment.html · หลัก 3 (ย้อนกลับ, แยกฐานข้อมูล)
- S7 · Feature Toggle, Martin Fowler · https://martinfowler.com/bliki/FeatureToggle.html · หลัก 4 (ถอดสวิตช์)
- S8 · Config, The Twelve-Factor App · https://12factor.net/config · หลัก 5
- S9 · Secrets Management Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html · หลัก 5
- S10 · Monitoring Distributed Systems, Google SRE Book · https://sre.google/sre-book/monitoring-distributed-systems/ · หลัก 6
- S11 · Alerting, Prometheus docs · https://prometheus.io/docs/practices/alerting/ · หลัก 6
- S12 · Alerting on SLOs, Google SRE Workbook · https://sre.google/workbook/alerting-on-slos/ · หลัก 6 (precision/recall)
- S13 · Managing Incidents, Google SRE Book · https://sre.google/sre-book/managing-incidents/ · หลัก 7 (ประกาศเร็ว, บทบาท, เอกสารเดียว)
- S14 · Incident Response, Google SRE Workbook · https://sre.google/workbook/incident-response/ · หลัก 7 (ช่องทางเดียว, ซ้อม)
- S15 · Incident management handbook, Atlassian · https://www.atlassian.com/incident-management/handbook · หลัก 7, 8
- S16 · Postmortem Culture, Google SRE Book · https://sre.google/sre-book/postmortem-culture/ · หลัก 8
- S17 · Blameless PostMortems and a Just Culture, Etsy Code as Craft · https://www.etsy.com/codeascraft/blameless-postmortems/ · หลัก 8
- S18 · สรุป PDPA มาตรา 37(4), ก.ล.ต. · https://www.sec.or.th/TH/Documents/Seminars/seminar-151264-04.pdf · หลัก 9
- S19 · Thailand's PDPC clarifies data breach notification, IAPP · https://www.iapp.org/news/a/thailand-s-pdpc-clarifies-data-breach-notification-requirements · หลัก 9 (72 ชั่วโมง)
- S20 · Thailand PDPC Notification on Data Breaches, Tilleke & Gibbins · https://www.tilleke.com/insights/thailand-pdpc-notification-on-data-breaches/2/ · หลัก 9
