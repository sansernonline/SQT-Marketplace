# หลักคิด · การทดสอบและหลักฐานคุณภาพ
> การทดสอบต้องให้ความมั่นใจที่ตรวจซ้ำได้ว่างานทำสิ่งที่ผู้ใช้ต้องการ โดยคนที่ไม่ได้อยู่ตอนทดสอบเชื่อผลได้จากหลักฐาน

## งานดีคืออะไร
1. **ทดสอบตามความเสี่ยง และไม่อ้างว่าทดสอบแล้วไม่มีบั๊ก** — ทดสอบทุกกรณีเป็นไปไม่ได้ และการทดสอบแสดงได้แค่ว่ามีบั๊ก ไม่แสดงว่าไม่มี จึงใช้แรงกับที่เสียหายหนักและที่บั๊กกระจุก · ตรวจด้วยตา: แผนทดสอบเรียงตามความเสี่ยงต่อผู้ใช้ และรายงานไม่มีประโยคว่า "ไม่มีบั๊ก" (S1, S2, S3)
2. **ทดสอบที่ระดับเล็กที่สุดที่จับบั๊กนั้นได้ และมีการทดสอบทั้งระบบน้อยแต่ครอบคลุมเส้นทางหลัก** — การทดสอบระดับสูงช้า ล้มเอง และชี้ที่เกิดเหตุยาก · ตรวจด้วยตา: เทสต์ส่วนใหญ่เป็นระดับหน่วยและการเชื่อมต่อ ส่วนเทสต์ทั้งระบบมีไม่กี่ตัวและไม่ซ้ำกับที่ระดับล่างจับได้แล้ว (S4, S5, S6)
3. **ทดสอบพฤติกรรมที่ผู้ใช้เห็น ผ่านทางที่ผู้ใช้เรียก ไม่ผูกกับรายละเอียดภายใน** — เทสต์ที่ผูกกับภายในแตกเมื่อ refactor ทั้งที่พฤติกรรมไม่เปลี่ยน · ตรวจด้วยตา: ชื่อเทสต์บอกพฤติกรรม ตรวจผลลัพธ์มากกว่าลำดับการเรียก ใช้ mock เฉพาะที่ของจริงทำไม่ได้ และ refactor แล้วเทสต์ไม่ต้องแก้ (S4, S7, S8, S9)
4. **เทสต์ต้องนิ่ง เป็นอิสระต่อกัน และให้ผลเร็ว** — เทสต์ที่ผ่านบ้างล้มบ้างสอนให้คนเมินสัญญาณ จนมองข้ามความล้มเหลวจริง · ตรวจด้วยตา: รันซ้ำโค้ดเดิมได้ผลเดิม ไม่มี sleep แบบเวลาตายตัว ไม่ใช้สถานะร่วมกัน และเทสต์ที่ไม่นิ่งถูกแยกออกและมีกำหนดแก้ ไม่ปล่อยค้าง (S10, S11, S6)
5. **บั๊กทุกตัวกลายเป็นเทสต์ที่เคยล้มแล้วผ่าน** — เทสต์ที่ล้มก่อนแก้พิสูจน์ว่าจับบั๊กนั้นได้ และกันไม่ให้กลับมา · ตรวจด้วยตา: การแก้บั๊กทุกครั้งมีเทสต์ใหม่ที่ล้มบนโค้ดเดิมและผ่านบนโค้ดที่แก้ (S2, S12, S3)
6. **ใช้ coverage เป็นเครื่องมือหาช่องที่ยังไม่ได้ทดสอบ ไม่ใช่เป้า** — ตัวเลขสูงแสดงว่าโค้ดถูกรัน ไม่ได้แสดงว่าถูกตรวจ และเป้าตัวเลขทำให้เขียนเทสต์ไร้ค่า · ตรวจด้วยตา: เทสต์ที่เพิ่มมา assert ผลจริง และมีคนไล่ดูบรรทัดที่ไม่ถูกรันว่าสำคัญหรือไม่ (S3, S13, S14)
7. **หลักฐานบอกว่ารันอะไร บนอะไร ผลเป็นอย่างไร และตามไปถึงความต้องการหรือความเสี่ยงได้** — คำว่า "ผ่านแล้ว" ที่ไม่มีหลักฐานตรวจซ้ำไม่ได้ · ตรวจด้วยตา: รายงานระบุเวอร์ชันที่ทดสอบ สภาพแวดล้อมและการตั้งค่า ผลจริงของแต่ละกรณี ส่วนที่ไม่ได้ทดสอบหรือเบี่ยงจากแผน ความเสี่ยงที่เหลือ และที่เก็บผลดิบ (S2, S15, S16)
8. **ยืนยันกับของจริงและความต้องการของผู้ใช้ ไม่ใช่แค่ผ่านเทสต์ในห้องทดลอง** — เทสต์ที่ผ่านทั้งหมดยังไม่รับรองว่าระบบตอบโจทย์ และระบบจริงไม่เหมือนสภาพแวดล้อมทดสอบ · ตรวจด้วยตา: มีการตรวจการตั้งค่าและขีดจำกัดบนสภาพแวดล้อมใกล้ของจริง และการปล่อยทีละส่วนมีตัวชี้วัดที่ใช้ตัดสินว่าไปต่อหรือถอย (S2, S12, S17)

## พลาดบ่อย
- ผูกเทสต์กับรายละเอียดภายในและใช้ mock หนัก → refactor ทีไรเทสต์แตกทั้งที่ไม่มีบั๊ก (S7, S8, S9)
- ปล่อยเทสต์ไม่นิ่งค้างไว้ → ไม่มีใครเชื่อสัญญาณล้ม บั๊กจริงหลุดเข้ามา (S10, S11)
- ตั้งเป้า coverage แล้วเขียนเทสต์ที่ไม่ assert อะไร → ตัวเลขสวย แต่จับบั๊กไม่ได้ (S13, S14)
- ทดสอบทุกอย่างผ่านหน้าจอทั้งระบบ → ช้า ล้มจากเรื่องที่ไม่เกี่ยวกับโค้ด หาสาเหตุยาก (S4, S5)
- รายงานแค่ "ทดสอบแล้วผ่าน" → ไม่รู้ว่ารันอะไรบนเวอร์ชันไหน ตรวจซ้ำและตัดสินความเสี่ยงที่เหลือไม่ได้ (S15, S16)
- รันชุดเทสต์และข้อมูลเดิมซ้ำตลอด → จับบั๊กใหม่ไม่ได้ ต้องปรับกรณีและข้อมูล (S1, S2)

## ใช้คู่กับ
skills: `testing-standards` · `test-case-template` · `test-evidence` · `e2e-testing-patterns` · `load-testing` · `coding-evals` · `app-verifier-setup` · `spec-to-code-loop` · `code-review-checklist` · playbook: `bug-fix` · `feature` · `ship` · `performance`

## Sources (checked 2026-11-27)
- S1 · International Software Testing Qualifications Board (ISTQB) Foundation Level Seven Testing Principles, ASTQB · https://astqb.org/istqb-foundation-level-seven-testing-principles/ · หลัก 1; พลาดบ่อย
- S2 · Certified Tester Foundation Level Syllabus v4.0.1, ISTQB · https://www.istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf · หลัก 1, 5, 7, 8 (หัวข้อ 1.3, 1.4.3, 1.4.4)
- S3 · Software Engineering Body of Knowledge (SWEBOK) Guide, บท Software Testing, IEEE Computer Society (สำเนาที่ UHCL) · https://sceweb.sce.uhcl.edu/helm/SWEBOK_IEEE/data/swebok_chapter_05.pdf · หลัก 1, 5, 6
- S4 · The Practical Test Pyramid, Ham Vocke (martinfowler.com) · https://martinfowler.com/articles/practical-test-pyramid.html · หลัก 2, 3
- S5 · Just Say No to More End-to-End Tests, Google Testing Blog · https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html · หลัก 2
- S6 · Test automation, DevOps Research and Assessment (DORA) · https://dora.dev/capabilities/test-automation/ · หลัก 2, 4
- S7 · Unit Testing, Software Engineering at Google (บทที่ 12) · https://abseil.io/resources/swe-book/html/ch12.html · หลัก 3
- S8 · Mocks Aren't Stubs, Martin Fowler · https://martinfowler.com/articles/mocksArentStubs.html · หลัก 3
- S9 · Test Doubles, Software Engineering at Google (บทที่ 13) · https://abseil.io/resources/swe-book/html/ch13.html · หลัก 3
- S10 · Flaky Tests at Google and How We Mitigate Them, Google Testing Blog · https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html · หลัก 4
- S11 · Eradicating Non-Determinism in Tests, Martin Fowler · https://martinfowler.com/articles/nonDeterminism.html · หลัก 4
- S12 · Testing for Reliability, Google Site Reliability Engineering (SRE) Book · https://sre.google/sre-book/testing-reliability/ · หลัก 5, 8
- S13 · Test Coverage, Martin Fowler · https://martinfowler.com/bliki/TestCoverage.html · หลัก 6
- S14 · Code Coverage Best Practices, Google Testing Blog · https://testing.googleblog.com/2020/08/code-coverage-best-practices.html · หลัก 6
- S15 · ISO/IEC/IEEE 29119-3:2021 Test documentation, ISO · https://standards.iteh.ai/catalog/standards/iso/b4f42a41-dd8f-446c-9674-238ba5dc90f1/iso-iec-ieee-29119-3-2021 · หลัก 7 (test status report, test completion report, actual results)
- S16 · SWE-118 Software Test Report, NASA Software Engineering Handbook · https://swehb.nasa.gov/x/mwD7 · หลัก 7
- S17 · Canarying Releases, Google SRE Workbook · https://sre.google/workbook/canarying-releases/ · หลัก 8
