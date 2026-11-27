# หลักคิด · Icons
> ไอคอนต้องทำให้คนเข้าใจความหมายและจำแอปได้ในพริบตา ทุกขนาด ทุกธีม ทุกที่ที่แสดง

## งานดีคืออะไร
1. **หนึ่งไอคอน หนึ่งความคิด ใช้รูปทรงน้อยที่สุด** — รายละเอียดมากทำให้สับสนและอ่านไม่ออกเมื่อเล็ก · ตรวจด้วยตา: ย่อเหลือครึ่งหนึ่งแล้วยังบอกได้ทันทีว่าคืออะไร (S1, S2, S3, S8, S9)
2. **ทั้งชุดต้องดูเป็นฝีมือเดียวกัน** — เส้นหนา มุม ระดับรายละเอียด และมุมมองที่เท่ากันทำให้ชุดดูเป็นระบบ · ตรวจด้วยตา: วางทุกตัวเรียงแถว หรี่ตา ต้องไม่มีตัวไหนหนัก เบา หรือโค้งมนผิดพวก (S1, S3, S8, S9)
3. **ใช้สัญลักษณ์ที่คนรู้จักแล้ว อย่าประดิษฐ์ใหม่** — ไอคอนส่วนใหญ่ไม่มีความหมายมาตรฐาน คนตีความจากประสบการณ์เดิม · ตรวจด้วยตา: ซ่อนชื่อ ให้คนนอกทีมเดา ถ้าเดาผิดหรือไม่กล้ากด ให้เปลี่ยนรูป (S1, S3, S4, S5, S8)
4. **ใส่ป้ายข้อความกำกับ ยกเว้นไอคอนที่รู้กันทั่วโลก** — ไอคอนส่วนใหญ่ไม่มีความหมายที่ทุกคนเข้าใจตรงกัน ป้ายข้อความทำให้คนเข้าใจถูกมากขึ้นชัดเจนในการทดสอบ · ตรวจด้วยตา: ป้ายต้องเห็นตลอด ไม่ซ่อนไว้ใต้เมาส์ (S4, S5, S6, S8)
5. **ขนาดและน้ำหนักเส้นต้องเข้ากับตัวหนังสือข้างเคียง และจัดกึ่งกลางด้วยสายตา** — ไอคอนที่หนักด้านเดียวดูเอียงถ้าจัดกึ่งกลางตามตัวเลข · ตรวจด้วยตา: วางข้างข้อความ เส้นหนาเท่ากัน อยู่กลางบรรทัด และไม่ดูตกหรือลอย (S1, S3, S7, S8)
6. **เล็กแล้วยังชัด และทำเวอร์ชันเล็กแยกเมื่อจำเป็น** — ขีดบางและรายละเอียดจะหายตอนย่อ ขนาดเล็กควรตัดรายละเอียดออก · ตรวจด้วยตา: ดูที่ขนาดจริงที่เล็กที่สุด (เช่นแท็บ 16 px) โดยไม่ซูม ช่องว่างระหว่างเส้นต้องยังเห็น (S2, S3, S8, S12)
7. **ใช้งานได้ทุกคน คือคอนทราสต์ พื้นที่กด และคำอธิบายสำหรับโปรแกรมอ่านหน้าจอ** — ไอคอนที่มีความหมายต้องตัดกับพื้นอย่างน้อย 3:1 (WCAG 2.2 ข้อ 1.4.11) ส่วนตัวหนังสือในไอคอนใช้เกณฑ์ตัวหนังสือ 4.5:1 · ไอคอนที่กดได้ควรมีพื้นที่กดราว 44×44 pt (Apple) หรือ 48×48 dp (Android) และไม่ต่ำกว่า 24×24 px (WCAG 2.2 ข้อ 2.5.8) · ตรวจด้วยตา: ดูบนพื้นหลังทั้งสว่างและมืด และดูว่าปุ่มไอคอนมีที่ว่างรอบตัวพอให้นิ้วกด (S1, S3, S7, S8, S14, S15)
8. **ไอคอนแอปและ favicon ต้องรอดการครอบรูป การเปลี่ยนธีม และการย่อ** — ระบบจะครอบรูปเอง ใน Android ตรงกลาง 66 จาก 108 dp เท่านั้นที่เห็นเสมอ และโหมดมืดหรือสีเดียวต้องยังจำได้ว่าเป็นแอปเดียวกัน · ตรวจด้วยตา: ลองครอบเป็นวงกลม สี่เหลี่ยมมน และดูแบบสว่าง มืด สีเดียว ต้องจุดเด่นอยู่กลางและยังเป็นตัวเดิม (S2, S10, S11, S12, S13)

## พลาดบ่อย
- ใส่ข้อความ คำสั่ง หรือคำว่า "ใหม่" ลงในไอคอนแอป → แปลและอ่านยากเมื่อเล็ก ดูรกและล้าสมัยเร็ว (S2)
- ใช้ภาพถ่าย ภาพหน้าจอ หรือจำลองปุ่ม UI (user interface) มาทำไอคอนแอป → รายละเอียดหายตอนเล็ก และแยกชั้นหรือเปลี่ยนธีมไม่ได้ (S2)
- ซ่อนป้ายไว้ใต้เมาส์ หรือพึ่งไอคอนเฉพาะแอปอย่างเดียว → คนไม่เข้าใจ ฟังก์ชันถูกมองข้าม และใช้บนจอสัมผัสไม่ได้ (S4, S5)
- ผสมชุดไอคอนหลายแหล่งที่เส้นหนาและมุมไม่เท่ากัน → หน้าจอดูไม่เป็นระบบ น้ำหนักสายตากระจาย (S1, S8, S9)
- ใส่ภาพที่ถูกครอบเป็นรูปทรงเสร็จแล้ว หรือใส่เงาและเอฟเฟกต์ในตัวไอคอนแอป → ขอบหยัก ซ้ำซ้อนกับเอฟเฟกต์ของระบบ (S2, S10)
- ใช้ไฟล์ favicon เดียวสีเดียวกับทุกธีมและยัดรายละเอียดเต็มโลโก้ → จมหายบนแท็บโหมดมืด และเลอะที่ 16 px (S12, S13)

## ใช้คู่กับ
skills: `icon-design` · `brand-kit` · playbook: `design` · general method: superuser `design-gate/parts/design-method/guide.md`

## Sources (checked 2026-11-27)
- S1 · Icons, Apple Human Interface Guidelines · https://developer.apple.com/design/human-interface-guidelines/icons · หลัก 1, 2, 3, 5, 7
- S2 · App icons, Apple Human Interface Guidelines · https://developer.apple.com/design/human-interface-guidelines/app-icons · หลัก 1, 6, 8 และพลาดบ่อย
- S3 · Fluent 2 Iconography, Microsoft · https://fluent2.microsoft.design/iconography · หลัก 1 (clarity), 2, 5, 6, 7
- S4 · Icon Usability, Nielsen Norman Group · https://www.nngroup.com/articles/icon-usability/ · หลัก 3, 4
- S5 · Yes, Icons Need Text Labels, Nielsen Norman Group · https://www.nngroup.com/videos/icon-text-labels/ · หลัก 3, 4
- S6 · How to Conduct Icon Usability Testing, CXL (อ้างผลทดสอบของ UserTesting) · https://cxl.com/blog/icon-usability-testing/ · หลัก 4 (88/60/34%)
- S7 · Icons usage, IBM Carbon Design System · https://carbondesignsystem.com/elements/icons/usage/ · หลัก 5, 7
- S8 · Iconography, Singapore Government Design System · https://designsystem.tech.gov.sg/foundations/iconography · หลัก 1, 2, 3, 4, 5, 6, 7
- S9 · Iconography design, Morningstar Design System · https://design.morningstar.com/foundations/iconography?tab=Design · หลัก 1, 2, 3
- S10 · Adaptive icons, Android Developers (Google) · https://developer.android.com/develop/ui/views/launch/icon_design_adaptive · หลัก 8
- S11 · Icon design specifications, Google Play Console Help (Android Developers) · https://developer.android.com/distribute/google-play/resources/icon-design-specifications · หลัก 8
- S12 · How to Favicon in 2023: six files, Evil Martians · https://evilmartians.com/chronicles/how-to-favicon-in-six-files-that-fit-most-needs · หลัก 6, 8
- S13 · Building an adaptive favicon, web.dev (Google) · https://web.dev/articles/building/an-adaptive-favicon · หลัก 8
- S14 · WCAG 2.2: 1.4.11 Non-text Contrast and 2.5.8 Target Size (Minimum), W3C · https://www.w3.org/TR/WCAG22/ · หลัก 7
- S15 · Accessibility: touch targets, Material Design / Android Developers · https://developer.android.com/guide/topics/ui/accessibility/apps#large-controls · หลัก 7
