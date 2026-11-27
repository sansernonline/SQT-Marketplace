# หลักคิด · ซอฟต์แวร์ที่ปลอดภัย
> ระบบต้องปกป้องข้อมูลและสิทธิ์ของผู้ใช้จากการโจมตีที่คาดได้ โดยเกณฑ์ขั้นต่ำที่เจ้าของกำหนดคือ Open Worldwide Application Security Project (OWASP) Top 10:2025 ครบทั้ง 10 ข้อ

แผนที่เกณฑ์ขั้นต่ำ: A01 Broken Access Control → หลัก 2 · A02 Security Misconfiguration → 7 · A03 Software Supply Chain Failures → 6 · A04 Cryptographic Failures → 5 · A05 Injection → 3 · A06 Insecure Design → 1 · A07 Authentication Failures → 4 · A08 Software or Data Integrity Failures → 6 · A09 Security Logging and Alerting Failures → 8 · A10 Mishandling of Exceptional Conditions → 8

## งานดีคืออะไร
1. **คิดเรื่องความปลอดภัยตั้งแต่ออกแบบ โดยจำลองภัยคุกคามที่จุดสำคัญ** — ช่องโหว่จากการออกแบบผิดแก้ด้วยการเขียนโค้ดให้ดีไม่ได้ · ตรวจด้วยตา: จุดเข้าสู่ระบบ สิทธิ์ และขั้นตอนเงินมีบันทึกว่าอะไรอาจผิดพลาดและจะทำอะไร ข้อกำหนดความปลอดภัยอยู่ใน user story และมีเทสต์ทั้งการใช้ปกติและการใช้ผิด (S1, S2, S3, S4)
2. **ตรวจสิทธิ์ที่ฝั่งเซิร์ฟเวอร์ทุกคำขอ ปฏิเสธเป็นค่าเริ่มต้น และตรวจว่าเป็นเจ้าของข้อมูลนั้น** — การตรวจที่หน้าจอถูกข้ามได้ และการเดารหัสวัตถุคือช่องโหว่ API อันดับหนึ่ง · ตรวจด้วยตา: ทุก endpoint ที่แก้หรืออ่านข้อมูลเรียกตัวตรวจสิทธิ์ตัวเดียวกัน ไม่มีสิทธิ์เป็นไม่ผ่าน และมีเทสต์ว่าผู้ใช้ A เปิดข้อมูลของ B ไม่ได้ (S5, S6, S7)
3. **ข้อมูลจากภายนอกต้องไม่กลายเป็นคำสั่ง** — ตัวแปลคำสั่งรัน input ที่ปนมาเป็นคำสั่งได้ จึงแยกข้อมูลออกจากคำสั่งตั้งแต่ต้นทาง · ตรวจด้วยตา: คำสั่งฐานข้อมูลใช้พารามิเตอร์ ไม่ต่อสตริง การตรวจ input เป็นแบบอนุญาตเฉพาะที่กำหนด และการ escape เป็นทางเลือกสุดท้าย (S8, S9, S10)
4. **ยืนยันตัวตนด้วยระบบที่ผ่านการพิสูจน์แล้ว เปิดใช้การยืนยันหลายปัจจัย และไม่ให้ข้อมูลช่วยผู้โจมตี** — ระบบที่เขียนเองพลาดง่าย และรหัสผ่านอย่างเดียวถูกขโมยซ้ำได้ · ตรวจด้วยตา: มี multi-factor authentication (MFA) ตรวจรหัสผ่านกับรายการที่รั่วแล้ว ข้อความล็อกอินผิดเหมือนกันทุกกรณี จำกัดการลองผิด และเก็บรหัสผ่านด้วยฟังก์ชันแฮชแบบช้า · เกณฑ์ที่ NIST กำหนด: รหัสผ่านปัจจัยเดียวอย่างน้อย 15 ตัวอักษร รองรับยาวถึง 64 ไม่บังคับรูปแบบตัวอักษร และไม่บังคับเปลี่ยนตามรอบ (S11, S12, S13)
5. **เก็บข้อมูลสำคัญให้น้อยที่สุด และเข้ารหัสด้วยไลบรารีมาตรฐาน ไม่คิดอัลกอริทึมเอง** — ข้อมูลที่ไม่ได้เก็บรั่วไม่ได้ และกุญแจที่อยู่ติดข้อมูลทำให้การเข้ารหัสไร้ผล · ตรวจด้วยตา: เข้ารหัสระหว่างส่งด้วย Transport Layer Security (TLS) และตอนเก็บสำหรับข้อมูลสำคัญ กุญแจอยู่คนละที่กับข้อมูล ไม่มี MD5 หรือ ECB · **เฉพาะไทย**: ผู้ควบคุมข้อมูลส่วนบุคคลต้องมีมาตรการรักษาความมั่นคงปลอดภัยตามความเสี่ยง ครอบคลุมการควบคุมการเข้าถึงและการติดตามความเสี่ยงรั่วไหล ตามประกาศคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2565 ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (S14, S15, S16, S17, S18)
6. **รู้ว่าโค้ดและชิ้นส่วนที่ใช้มาจากไหน และพิสูจน์ได้ว่าไม่ถูกแก้ระหว่างทาง** — ไลบรารี สายการสร้าง และตัวอัปเดตที่ไม่ถูกตรวจเป็นทางเข้าของผู้โจมตี · ตรวจด้วยตา: มีรายการชิ้นส่วนที่ใช้ (software bill of materials: SBOM) แหล่งที่มาเชื่อถือได้ ตรวจลายเซ็นหรือค่าแฮช ช่องโหว่ที่รู้แล้วถูกแก้เร็ว และไม่มีใครดันโค้ดขึ้นระบบจริงโดยไม่มีผู้ตรวจ (S3, S19, S20, S21)
7. **ตั้งค่าให้ปลอดภัยตั้งแต่เริ่ม และเก็บความลับไว้นอกโค้ด** — ค่าเริ่มต้นที่เปิดกว้างและกุญแจในโค้ดเป็นช่องโหว่ที่เจอบ่อยที่สุด · ตรวจด้วยตา: สร้างสภาพแวดล้อมใหม่จากกระบวนการอัตโนมัติเดียวกัน ปิดฟีเจอร์ที่ไม่ใช้ ไม่มีรหัสเริ่มต้น ใช้ข้อมูลรับรองอายุสั้น และเปิดซอร์สได้ทุกเมื่อโดยไม่เปิดความลับ (S22, S23, S24)
8. **เมื่อผิดพลาดให้ปิดไว้ก่อน บันทึกเหตุการณ์ความปลอดภัย และมีคนได้รับแจ้ง** — ข้อผิดพลาดที่ไม่ถูกจัดการเปิดช่องให้โจมตี และการโจมตีที่ไม่มีบันทึกไม่มีใครเห็น · ตรวจด้วยตา: ธุรกรรมที่พังย้อนกลับทั้งชุด มีตัวจัดการข้อผิดพลาดกลาง ผู้ใช้เห็นข้อความทั่วไป log บันทึกการล็อกอิน สิทธิ์ที่ถูกปฏิเสธ และการแก้ค่า โดยไม่มีความลับหรือข้อมูลส่วนบุคคล และมีเกณฑ์แจ้งเตือน (S25, S26, S27, S28)

## พลาดบ่อย
- เช็กสิทธิ์เฉพาะที่หน้าจอหรือเฉพาะบทบาท ไม่เช็กว่าเป็นเจ้าของ → ผู้ใช้เปลี่ยนรหัสในคำขอแล้วเห็นข้อมูลคนอื่น (S5, S7)
- ต่อสตริงเป็นคำสั่งฐานข้อมูลหรือคำสั่งระบบ → ผู้โจมตีสั่งงานแทนระบบ (S8, S10)
- ฝังกุญแจหรือรหัสผ่านในโค้ด ไฟล์ตั้งค่า หรือ pipeline → รั่วพร้อมประวัติโค้ด (S22, S23, S24)
- ใช้ไลบรารีที่ไม่ดูแลหรือไม่รู้ว่าดึงอะไรตามมา และให้ pipeline หย่อนกว่าระบบที่ปล่อย → ถูกแทรกโค้ดโดยไม่รู้ตัว (S19, S20, S21)
- แสดง stack trace หรือข้อความละเอียดให้ผู้ใช้ และ catch แล้วทำต่อ → ผู้โจมตีรู้โครงสร้างระบบ หรือระบบทำงานต่อในสถานะผิด (S25, S28)
- log ความลับ เลขบัตร หรือข้อมูลส่วนบุคคล หรือไม่ log เหตุการณ์ความปลอดภัยเลย → ข้อมูลรั่วทาง log และตรวจย้อนหลังไม่ได้ (S26, S27)

## ใช้คู่กับ
skills: `security-gate` · `security-audit` · `web-service-essentials` · `errors-and-logs` · `pdpa-compliance` · `security-operations` · playbook: `review` · `ship` · `new-project`

## Sources (checked 2026-11-27)
- S1 · A06:2025 Insecure Design, OWASP Top 10:2025 · https://top10.owasp.org/2025/A06_2025-Insecure_Design/ · หลัก 1
- S2 · Threat Modeling Manifesto · https://www.threatmodelingmanifesto.org/ · หลัก 1
- S3 · SP 800-218 Secure Software Development Framework (SSDF), National Institute of Standards and Technology (NIST) · https://csrc.nist.gov/pubs/sp/800/218/final · หลัก 1, 6
- S4 · Application Security Verification Standard (ASVS) 5.0.0, OWASP · https://asvs.owasp.org/ · หลัก 1 (รายการข้อกำหนดสำหรับออกแบบและทดสอบ)
- S5 · A01:2025 Broken Access Control, OWASP Top 10:2025 · https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/ · หลัก 2
- S6 · Authorization Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html · หลัก 2
- S7 · API Security Top 10 2023 (API1 Broken Object Level Authorization), OWASP · https://api-security.owasp.org/editions/2023/en/0x11-t10/ · หลัก 2
- S8 · A05:2025 Injection, OWASP Top 10:2025 · https://top10.owasp.org/2025/A05_2025-Injection/ · หลัก 3
- S9 · Injection Prevention Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html · หลัก 3
- S10 · Query Parameterization Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html · หลัก 3
- S11 · A07:2025 Authentication Failures, OWASP Top 10:2025 · https://top10.owasp.org/2025/A07_2025-Authentication_Failures/ · หลัก 4
- S12 · SP 800-63B Digital Identity Guidelines: Authentication, NIST · https://pages.nist.gov/800-63-4/sp800-63b.html · หลัก 4 (15 / 64 ตัวอักษร ไม่บังคับรูปแบบ ไม่บังคับเปลี่ยนตามรอบ)
- S13 · Authentication Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html · หลัก 4
- S14 · A04:2025 Cryptographic Failures, OWASP Top 10:2025 · https://top10.owasp.org/2025/A04_2025-Cryptographic_Failures/ · หลัก 5
- S15 · Cryptographic Storage Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html · หลัก 5
- S16 · ประกาศคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล เรื่อง มาตรการรักษาความมั่นคงปลอดภัยของผู้ควบคุมข้อมูลส่วนบุคคล พ.ศ. 2565 (สำเนาข้อความ) · https://www.thaiairways.com/content/dam/thaiairways/pdf/good-corporate-governance/communication-to-enhance-good-corporate-governance-compliance/personal-data-protection-section/PDPA52.pdf · หลัก 5 เฉพาะไทย (ควรเทียบกับฉบับราชกิจจานุเบกษาของสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล หรือ สคส.)
- S17 · Thailand PDPC notifications, Legal Insight, PwC Thailand · https://www.pwc.com/th/en/pwc-tax-insights/2022/legal/eng/2022-pwc-legal-insight-01.pdf · หลัก 5 เฉพาะไทย
- S18 · PDPA alert: PDPC notifications (Sep 2022), Deloitte Thailand · https://www.deloitte.com/content/dam/assets-zone1/southeast-asia/en/docs/services/tax/2024/th-pdpa-alert-pdpc-notifications-sep2022.pdf · หลัก 5 เฉพาะไทย
- S19 · A03:2025 Software Supply Chain Failures, OWASP Top 10:2025 · https://top10.owasp.org/2025/A03_2025-Software_Supply_Chain_Failures/ · หลัก 6
- S20 · A08:2025 Software or Data Integrity Failures, OWASP Top 10:2025 · https://top10.owasp.org/2025/A08_2025-Software_or_Data_Integrity_Failures/ · หลัก 6
- S21 · SLSA (Supply-chain Levels for Software Artifacts) overview, OpenSSF · https://slsa.dev/spec/v1.0/about · หลัก 6
- S22 · A02:2025 Security Misconfiguration, OWASP Top 10:2025 · https://top10.owasp.org/2025/A02_2025-Security_Misconfiguration/ · หลัก 7
- S23 · Secrets Management Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html · หลัก 7
- S24 · The Twelve-Factor App: Config · https://12factor.net/config · หลัก 7
- S25 · A10:2025 Mishandling of Exceptional Conditions, OWASP Top 10:2025 · https://top10.owasp.org/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ · หลัก 8
- S26 · A09:2025 Security Logging and Alerting Failures, OWASP Top 10:2025 · https://top10.owasp.org/2025/A09_2025-Security_Logging_and_Alerting_Failures/ · หลัก 8
- S27 · Logging Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html · หลัก 8
- S28 · Error Handling Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html · หลัก 8
