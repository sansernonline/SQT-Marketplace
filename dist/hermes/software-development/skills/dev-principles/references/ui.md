# หลักคิด · หน้าจอแอปพลิเคชัน (เว็บ มือถือ Windows): ใช้ง่าย เข้าถึงได้ สม่ำเสมอ ครบทุกสถานะ
> หน้าจอต้องให้ทุกคนทำงานที่ตั้งใจให้สำเร็จ ด้วยอุปกรณ์รับข้อมูลที่ตนใช้ และรู้ตลอดว่าเกิดอะไรขึ้น (ทิศทางภาพลักษณ์และการเลี่ยงหน้าตาแบบ AI ดูใน `ui-craft` และ superuser `design-gate` ไฟล์นี้ไม่ซ้ำ)

## งานดีคืออะไร
1. **บอกสถานะให้ผู้ใช้เห็นเสมอ โดยเลือกตัวบอกตามความนานของงาน** — ผู้ใช้เริ่มเสียสมาธิเมื่อไม่มีการตอบสนอง · ตรวจด้วยตา: เกิน 1 วินาทีมีตัวบอกว่ากำลังทำงาน เกินราว 10 วินาทีมีแถบความคืบหน้าและทางยกเลิก ส่วนโครงหน้า (skeleton) ใช้กับพื้นที่เนื้อหาตอนโหลดแรก ไม่ใช้กับปุ่มหรือช่องกรอก (S3, S4, S5)
2. **หน้าว่างต้องอธิบายและมีทางไปต่อ ไม่ปล่อยว่างเปล่า** — พื้นที่ว่างทำให้ผู้ใช้ไม่รู้ว่าโหลดอยู่ พัง หรือไม่มีข้อมูล · ตรวจด้วยตา: แยกได้ 3 แบบ (ยังไม่มีข้อมูล, ค้นแล้วไม่พบ, ดึงข้อมูลไม่ได้) แต่ละแบบมีข้อความสั้นและปุ่มหลักหนึ่งปุ่ม และไม่โชว์ "ไม่พบข้อมูล" ระหว่างที่ยังโหลด (S6, S7, S3)
3. **ข้อความผิดพลาดบอกว่าเกิดอะไรและแก้อย่างไร อยู่ติดช่องที่ผิด และเก็บสิ่งที่ผู้ใช้กรอกไว้** — "เกิดข้อผิดพลาด" เฉย ๆ ไม่ช่วยให้แก้ได้ · ตรวจด้วยตา: ข้อความเฉพาะเจาะจง ไม่โทษผู้ใช้ ไม่พึ่งสีแดงอย่างเดียว มีสรุปข้อผิดพลาดด้านบนสำหรับฟอร์มยาว และกดย้อนแล้วข้อมูลยังอยู่ (S8, S9, S2, S3)
4. **ทำให้สม่ำเสมอทั้งในแอปและตามธรรมเนียมของแพลตฟอร์ม** — ผู้ใช้เรียนรู้จากแอปอื่นมาก่อน การแหกธรรมเนียมเพิ่มภาระคิด · ตรวจด้วยตา: คำเรียก ตำแหน่งปุ่ม และไอคอนของฟังก์ชันเดียวกันเหมือนกันทุกหน้า และใช้ส่วนประกอบมาตรฐานของ Windows, iOS, Android หรือเว็บแทนการประดิษฐ์เอง (S10, S3, S11)
5. **ให้ย้อนกลับ (undo) ก่อนถามยืนยัน และถามเฉพาะการกระทำที่ย้อนไม่ได้** — คำถามบ่อย ๆ สอนให้กดผ่าน · ตรวจด้วยตา: ปุ่มในกล่องยืนยันเขียนเป็นการกระทำ ("ลบไฟล์" ไม่ใช่ "ตกลง") ระบุสิ่งที่จะหาย และโฟกัสเริ่มต้นไม่ตกที่ปุ่มทำลาย (S12, S3, S13)
6. **ใช้ได้ด้วยคีย์บอร์ดล้วน และเห็นตำแหน่งโฟกัสเสมอ** — ผู้ใช้จำนวนมากไม่ใช้เมาส์ รวมถึงผู้ใช้โปรแกรมอ่านหน้าจอ · ตรวจด้วยตา: กด Tab ผ่านทุกตัวควบคุมตามลำดับที่ตาเห็น ไม่ติดกับดัก ตัวโฟกัสมองเห็นชัด และไม่ถูกแถบหรือกล่องซ้อนบังทั้งหมด (WCAG 2.2 ข้อ 2.4.11) (S13, S2, S14)
7. **ตัวควบคุมใหญ่พอกดและมีทางเลือกแทนการลาก** — ปลายนิ้วและมือสั่นกดพลาดได้ง่าย · ตรวจด้วยตา: ขั้นต่ำเว็บ 24×24 CSS px (WCAG 2.5.8) หรือมีช่องว่างพอ, Android 48×48 dp, iOS ตัวควบคุมปกติ 44×44 pt (ต่ำสุด 28×28 pt) และทุกการลากมีปุ่มหรือการแตะทำแทนได้ (WCAG 2.5.7) (S1, S2, S15, S14)
8. **อ่านได้และเข้าใจได้ทุกคน** — คอนทราสต์ตัวหนังสือ 4.5:1 (ตัวใหญ่หรือหนา 3:1) ไอคอนและกรอบ 3:1 · ตรวจด้วยตา: ดูทั้งโหมดสว่าง มืด และ high contrast ขยายตัวอักษร 200% แล้วไม่ตัดหรือทับกัน ใช้สีร่วมกับรูปหรือข้อความ ปุ่มไอคอนมีชื่อให้โปรแกรมอ่านหน้าจออ่านโดยบอกหน้าที่ ไม่ใช่รูปร่าง และฟอร์มไม่ให้ผู้ใช้จำรหัสแบบทดสอบหรือกรอกข้อมูลเดิมซ้ำ (WCAG 3.3.7, 3.3.8) (S2, S14, S15, S9, S16)

## พลาดบ่อย
- หมุนวงกลมค้างโดยไม่บอกอะไรเกินหลายวินาที หรือใช้ skeleton กับปุ่ม → ผู้ใช้ไม่รู้ว่าแอปค้างหรือไม่ (S3, S4, S5)
- แสดง "ไม่มีข้อมูล" ระหว่างโหลด หรือเว้นว่างหลังเกิดข้อผิดพลาด → เข้าใจผิดว่าข้อมูลหาย (S6, S7)
- ล้างฟอร์มเมื่อกรอกผิด หรือบอกแค่ว่า "ไม่ถูกต้อง" → ผู้ใช้ต้องเริ่มใหม่และเดาเอง (S8, S9)
- ถามยืนยันทุกการกระทำ → ผู้ใช้กดผ่านโดยไม่อ่าน แล้วพลาดในจุดที่อันตรายจริง (S12)
- ซ่อนเส้นโฟกัส หรือทำปุ่มที่ใช้ได้เฉพาะเมาส์และการลาก → ผู้ใช้คีย์บอร์ดและโปรแกรมอ่านหน้าจอทำงานไม่ได้ (S13, S1, S2)
- ใช้สีบอกสถานะอย่างเดียว หรือทดสอบแค่โหมดสว่าง → คนตาบอดสีและผู้ใช้โหมดมืดหรือ high contrast มองไม่เห็น (S2, S9, S14, S16)

## ใช้คู่กับ
skills: `ui-craft` · `design-system` · `web-audit` · `i18n-and-locale` · playbook: `visual-parity` · `review` · `feature` · visual direction และ "ไม่ให้ดูเป็น AI": superuser `design-gate` · วิธีออกแบบทั่วไป: superuser `design-gate/parts/design-method/guide.md`

## Sources (checked 2026-11-27)
- S1 · What's New in WCAG 2.2, W3C WAI · https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ · หลัก 6, 7, 8 (2.4.11, 2.5.7, 2.5.8, 3.3.7, 3.3.8)
- S2 · Web Content Accessibility Guidelines (WCAG) 2.2, W3C · https://www.w3.org/TR/WCAG22/ · หลัก 3, 6, 7, 8 (1.4.3, 1.4.4, 1.4.11, 3.3.1)
- S3 · 10 Usability Heuristics for User Interface Design, Nielsen Norman Group · https://www.nngroup.com/articles/ten-usability-heuristics/ · หลัก 1–5
- S4 · Response Times: The 3 Important Limits, Nielsen Norman Group · https://www.nngroup.com/articles/response-times-3-important-limits/ · หลัก 1 (0.1 / 1 / 10 วินาที)
- S5 · Loading pattern, IBM Carbon Design System · https://carbondesignsystem.com/patterns/loading-pattern/ · หลัก 1
- S6 · Designing Empty States in Complex Applications, Nielsen Norman Group · https://www.nngroup.com/articles/empty-state-interface-design/ · หลัก 2
- S7 · Empty states pattern, IBM Carbon Design System · https://carbondesignsystem.com/patterns/empty-states-pattern/ · หลัก 2
- S8 · Error-Message Guidelines, Nielsen Norman Group · https://www.nngroup.com/articles/error-message-guidelines/ · หลัก 3
- S9 · Error message, GOV.UK Design System · https://design-system.service.gov.uk/components/error-message/ · หลัก 3, 8
- S10 · Consistency and Standards, Nielsen Norman Group · https://www.nngroup.com/articles/consistency-and-standards/ · หลัก 4
- S11 · Design Windows apps, Microsoft Learn · https://learn.microsoft.com/en-us/windows/apps/design/ · หลัก 4 (Fluent, ธีมสว่าง/มืด/high contrast)
- S12 · Confirmation Dialogs Can Prevent User Errors (If Not Overused), Nielsen Norman Group · https://www.nngroup.com/articles/confirmation-dialog/ · หลัก 5
- S13 · Keyboard design guidelines, Microsoft Learn (Windows apps) · https://learn.microsoft.com/en-us/windows/apps/design/input/keyboard-interactions · หลัก 5, 6
- S14 · Accessibility, Apple Human Interface Guidelines · https://developer.apple.com/design/human-interface-guidelines/accessibility · หลัก 6, 7, 8 (44/28 pt, Full Keyboard Access, ไม่พึ่งสีอย่างเดียว)
- S15 · Accessibility essentials for Android apps, Android Developers · https://developer.android.com/guide/topics/ui/accessibility/apps · หลัก 7, 8 (48 dp, 4.5:1 / 3:1, contentDescription)
- S16 · Accessibility Principles (POUR), W3C WAI · https://www.w3.org/WAI/fundamentals/accessibility-principles/ · หลัก 8
