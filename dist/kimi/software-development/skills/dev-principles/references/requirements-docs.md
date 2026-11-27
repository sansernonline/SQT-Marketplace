# หลักคิด · ความต้องการและเอกสารโครงการ (SRS, FSD, user story, ADR, release notes, README)
> เอกสารต้องทำให้คนที่ไม่ได้อยู่ในห้องประชุมเข้าใจตรงกันว่าจะสร้างอะไร ทำไม และรู้ว่าเมื่อไรถือว่าเสร็จ

## งานดีคืออะไร
1. **ความต้องการหนึ่งข้อมีเรื่องเดียว ตีความได้ทางเดียว และตรวจได้** — ข้อที่รวมหลายเรื่องหรือใช้คำลอย ๆ ทดสอบไม่ได้ และทำให้ทีมสร้างคนละแบบ · ตรวจด้วยตา: อ่านทีละข้อแล้วบอกได้ว่าจะทดสอบอย่างไร ไม่มีคำอย่าง "ง่าย" "เร็ว" "เหมาะสม" "ฯลฯ" และไม่มีข้อที่มี "และ/หรือ" ซ่อนสองเรื่อง (S1, S2, S3)
2. **ทุกข้อมีเหตุผลและที่มา** — ความต้องการที่ไม่ผูกกับความต้องการจริงจะกลายเป็นงานส่วนเกิน และเถียงกันไม่จบเมื่อต้องตัดขอบเขต · ตรวจด้วยตา: ชี้ได้ว่าข้อนี้มาจากใคร ปัญหาอะไร และสมมติฐานถูกเขียนไว้แยกจากตัวข้อ (S1, S2, S4)
3. **เอกสารแต่ละฉบับมีผู้อ่านและหน้าที่เดียว** — ใครอ่านเพื่ออะไรต่างกัน การปนกันทำให้ผู้อ่านไม่ได้สิ่งที่มาหา · ตรวจด้วยตา: หัวเอกสารบอกผู้อ่านและสิ่งที่ฉบับนี้ตอบ ส่วนที่ไม่ใช่หน้าที่ถูกลิงก์ไปฉบับอื่น (S5, S6, S7)
4. **User story บอก ใคร ต้องการอะไร เพื่ออะไร ในภาษาของผู้ใช้ และเล็กพอทำเสร็จในรอบเดียว** — เล่าเป้าหมายไม่ใช่หน้าจอ เพื่อให้ทีมคิดทางออกได้เอง · ตรวจด้วยตา: story ระบุผู้ใช้เฉพาะเจาะจง ไม่ระบุปุ่มหรือตาราง และผ่านเกณฑ์ INVEST (independent, negotiable, valuable, estimable, small, testable) (S4, S8, S9)
5. **เกณฑ์ยอมรับ (acceptance criteria) เป็นตัวอย่างที่ตรวจผ่าน/ไม่ผ่านได้ เขียนเป็นภาษาธุรกิจ** — ตกลงก่อนลงมือ จึงรู้ตรงกันว่าเสร็จคืออะไร · ตรวจด้วยตา: แต่ละเกณฑ์อ่านเป็น ถ้ามีเงื่อนไขนี้ เมื่อทำสิ่งนี้ ต้องได้ผลนี้ (Given-When-Then) พร้อมค่าตัวอย่างจริง และเกณฑ์เดียวไม่เปลี่ยนเมื่อเปลี่ยนหน้าจอ (S10, S11, S4, S9)
6. **ADR (architecture decision record) บันทึกเฉพาะการตัดสินใจที่ย้อนยาก พร้อมบริบท ทางเลือกที่ตัดทิ้ง และผลที่ตามมา** — คนรุ่นหลังจะได้ไม่ตามหรือล้มการตัดสินใจโดยไม่รู้เหตุผล · ตรวจด้วยตา: 1 เรื่องต่อ 1 ฉบับ ไม่เกิน 1–2 หน้า มีสถานะ และของเก่าที่ถูกแทนยังอยู่โดยชี้ไปฉบับใหม่ ไม่ถูกแก้ทับ (S12, S13, S14)
7. **Release notes เขียนให้ผู้ใช้ ไม่ใช่รายการ commit และเลขรุ่นบอกผลต่อผู้ใช้** — เลข MAJOR.MINOR.PATCH มีความหมายตายตัว: MAJOR เมื่อเปลี่ยนแล้วใช้ร่วมกับของเดิมไม่ได้ MINOR เมื่อเพิ่มความสามารถที่เข้ากันได้ PATCH เมื่อแก้ข้อผิดพลาด · ตรวจด้วยตา: ทุกรุ่นมีวันที่ เรียงใหม่สุดก่อน จัดกลุ่มประเภทการเปลี่ยน และบอกว่าผู้ใช้ต้องทำอะไรเมื่อมีการเปลี่ยนที่ไม่เข้ากัน (S15, S16, S17)
8. **README ตอบก่อนว่าโปรเจกต์ทำอะไร ใช้เริ่มต้นอย่างไร ขอความช่วยเหลือที่ไหน ใครดูแล แล้วลิงก์ไปเอกสารยาว** — README คือหน้าแรกที่คนเห็น ถ้ายาวและเก่า คนเลิกเชื่อ · ตรวจด้วยตา: คนใหม่ติดตั้งและรันตัวอย่างได้จาก README อย่างเดียว และเนื้อหายาวถูกย้ายไปที่อื่น (S18, S19, S7)
9. **เอกสารเก็บคู่กับโค้ด แก้พร้อมโค้ด และลบของตายทิ้ง** — เอกสารที่ล้าสมัยทำให้คนเข้าใจผิดมากกว่าไม่มีเอกสาร · ตรวจด้วยตา: การแก้โค้ดที่เปลี่ยนพฤติกรรมมีการแก้เอกสารใน pull request เดียวกัน และไม่มีหน้าที่ไม่มีเจ้าของ (S7, S20, S12)

## พลาดบ่อย
- เขียนคุณสมบัติคลุมเครือ เช่น "ระบบต้องใช้งานง่ายและเร็ว" → ทดสอบไม่ได้ ตกลงตอนส่งมอบไม่ได้ (S1, S2)
- User story เป็นรายการงานเทคนิคหรือบอกหน้าจอ → ไม่เห็นคุณค่าต่อผู้ใช้ ทีมเลือกทางออกไม่ได้ (S4, S8)
- เกณฑ์ยอมรับเขียนเป็นขั้นตอนกดปุ่มทีละที → แก้หน้าจอเมื่อไรเกณฑ์พังทั้งชุด (S10, S11)
- ADR แก้ทับของเดิมหรือไม่เก็บทางเลือกที่ตัดทิ้ง → ประวัติหาย คนกลับมาเถียงเรื่องเดิม (S12, S13, S14)
- Release notes คัดลอกข้อความ commit ทั้งดุ้น หรือเลขรุ่นไม่ตรงกับผลที่ผู้ใช้เจอ → ผู้ใช้อัปเกรดแล้วพังโดยไม่ได้รับแจ้ง (S15, S16)
- เอกสารฉบับเดียวรวมทั้งสเปก คู่มือ และเหตุผลออกแบบ → หาอะไรไม่เจอ และแก้ไม่ครบทุกที่ (S5, S6, S7)

## ใช้คู่กับ
skills: `requirements-writing` · `architecture` · `project-docs` · `legacy-spec-recovery` · `document-design` · `diagrams` · `developer-experience` · playbook: `project-docs` · `new-project` · `feature`

## Sources (checked 2026-11-27)
- S1 · Guide to Writing Requirements (GtWR) v4, INCOSE · https://www.incose.org/docs/default-source/working-groups/requirements-wg/gtwr/incose_rwg_gtwr_v4_040423_final_drafts.pdf · หลัก 1, 2 (คุณสมบัติ C1–C9)
- S2 · How to Write a Good Requirement, NASA Systems Engineering Handbook · https://www.nasa.gov/seh/appendix-c-how-to-write-a-good-requirement · หลัก 1, 2 (เรื่องเดียว ตรวจได้ คำคลุมเครือ เหตุผล)
- S3 · EARS: Easy Approach to Requirements Syntax, Alistair Mavin · https://alistairmavin.com/ears/ · หลัก 1
- S4 · User Stories, Atlassian · https://www.atlassian.com/agile/project-management/user-stories · หลัก 2, 4, 5
- S5 · ISO/IEC/IEEE 29148:2018, ISO · https://www.iso.org/standard/72089.html · หลัก 3 (กำหนดสารสนเทศที่แต่ละกระบวนการต้องผลิต)
- S6 · Diátaxis, Daniele Procida · https://diataxis.fr/ · หลัก 3 (แยกเอกสาร 4 แบบตามความต้องการผู้อ่าน)
- S7 · Documentation Best Practices, Google Style Guides · https://google.github.io/styleguide/docguide/best_practices.html · หลัก 3, 8, 9
- S8 · INVEST in Good Stories, Bill Wake · https://xp123.com/invest-in-good-stories-and-smart-tasks/ · หลัก 4
- S9 · The Scrum Guide, scrumguides.org · https://scrumguides.org/scrum-guide.html · หลัก 4, 5 (Definition of Done, refinement)
- S10 · Given When Then, Martin Fowler · https://martinfowler.com/bliki/GivenWhenThen.html · หลัก 5
- S11 · Writing better Gherkin, Cucumber · https://cucumber.io/docs/bdd/better-gherkin/ · หลัก 5 (เขียนเชิงบอกผล ใช้ตัวอย่างจริง)
- S12 · Documenting Architecture Decisions, Michael Nygard · https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions · หลัก 6, 9
- S13 · Architecture decision record, Microsoft Azure Well-Architected · https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record · หลัก 6
- S14 · ADR process, AWS Prescriptive Guidance · https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html · หลัก 6
- S15 · Keep a Changelog 1.1.0 · https://keepachangelog.com/en/1.1.0/ · หลัก 7
- S16 · Semantic Versioning 2.0.0 · https://semver.org/ · หลัก 7 (MAJOR.MINOR.PATCH)
- S17 · Google developer documentation style guide: highlights · https://developers.google.com/style/highlights · หลัก 7 (ภาษาชัด ศัพท์สม่ำเสมอ)
- S18 · About READMEs, GitHub Docs · https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes · หลัก 8
- S19 · Make a README · https://www.makeareadme.com/ · หลัก 8
- S20 · Docs as Code, Write the Docs · https://www.writethedocs.org/guide/docs-as-code/ · หลัก 9
