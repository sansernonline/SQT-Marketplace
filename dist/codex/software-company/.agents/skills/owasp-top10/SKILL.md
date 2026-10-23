---
name: owasp-top10
description: Use when building or handing over a web app or API that must meet OWASP Top 10:2025 (contract, security NFR, release).
---

# owasp-top10 — ระบบที่ส่งมอบต้องผ่าน OWASP Top 10:2025

> สัญญาจ้างทำเว็บแอปเขียนได้ว่า "ต้องผ่าน OWASP Top 10:2025" แต่ไม่มีใครให้ใบรับรองแบบนี้ได้
> สิ่งที่ส่งมอบได้จริงคือ **รายงานที่บอกทีละข้อ A01–A10 ว่าคุมด้วยอะไร ตรวจด้วยอะไร และมีหลักฐานอะไร**
> skill นี้ทำให้ทุกระบบที่ทีมสร้างมีรายงานนั้น ตั้งแต่ออกแบบจนส่งมอบ

Open Worldwide Application Security Project (OWASP) Top 10:2025 คือรายการความเสี่ยงของเว็บแอปที่พบบ่อยและร้ายแรงที่สุด 10 ข้อ ฉบับล่าสุด (ต้นฉบับ: owasp.org/Top10/2025)

ใช้คู่กับ: [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md) (เขียนโค้ด) · [`security-gate`](../security-gate/SKILL.md) (สแกนก่อนส่ง) · คำสั่ง `/software-company:threat-model` (ออกแบบ) · agent `security-engineer` (รายงานเชิงลึก)

---

## 1 · 10 ข้อ และสิ่งที่ระบบต้องมี

แต่ละข้อมี 3 ส่วน → **ต้องมี** (สิ่งที่โค้ดและการตั้งค่าต้องทำ) · **พิสูจน์ด้วย** (test หรือเครื่องมือที่รันได้จริง) · **ภาษาเจ้าของกิจการ** (ใช้อธิบายลูกค้าและในรายงาน)

| ข้อ | ความเสี่ยง | ภาษาเจ้าของกิจการ | ต้องมี | พิสูจน์ด้วย |
|---|---|---|---|---|
| A01 | Broken Access Control | ลูกค้าคนหนึ่งเห็นข้อมูลของอีกคนได้ | ตรวจสิทธิ์ฝั่ง server ทุก endpoint · ปฏิเสธเป็นค่าเริ่ม · ตรวจว่าเป็นเจ้าของ record ทุกครั้งที่อ่านหรือแก้ด้วย id · กันเซิร์ฟเวอร์ไปดึง URL ภายใน (Server-Side Request Forgery (SSRF)) ด้วย allowlist · Cross-Origin Resource Sharing (CORS) ไม่เปิด `*` คู่กับ cookie · ระบบที่ใช้ cookie session ต้องมี token กันการส่งคำขอแทนผู้ใช้ (Cross-Site Request Forgery (CSRF)) · รับ input ผ่าน Data Transfer Object (DTO) หรือรายชื่อฟิลด์ที่อนุญาต ไม่ผูกทั้ง object (กัน client ส่ง `role` · `isAdmin` มาเอง) | integration test ต่อ endpoint: ไม่ login → 401 · ผิดบทบาท → 403 · id ของคนอื่น → 403 หรือ 404 · POST ไม่มี CSRF token → 403 (ระบบที่ใช้ cookie) · ส่งฟิลด์ `role` เกินมา → ค่าในฐานข้อมูลไม่เปลี่ยน |
| A02 | Security Misconfiguration | ตั้งค่าเซิร์ฟเวอร์หละหลวม เปิดหน้า admin ทิ้งไว้ | ตั้งค่าเป็นสคริปต์เดียวกันทุก environment ต่างกันแค่ค่าลับ · ปิด debug · stack trace · directory listing · หน้า admin ตัวอย่าง · ใส่ security header (Content Security Policy (CSP) รวม `frame-ancestors` · HTTP Strict Transport Security (HSTS) · X-Content-Type-Options) · ไม่มีรหัสผ่านค่าเริ่ม · storage บน cloud ไม่เปิดสาธารณะ | สแกน header (OWASP ZAP (Zed Attack Proxy) baseline) · `trivy config .` · test ว่า production ตอบ error แบบไม่มี stack trace |
| A03 | Software Supply Chain Failures | ใช้ไลบรารีเก่า หรือมีช่องโหว่ | lockfile ทุกภาษา · รายการส่วนประกอบซอฟต์แวร์ (Software Bill of Materials (SBOM)) · ไม่มี dependency ที่มีช่องโหว่ระดับ critical หรือ high · ตัดของที่ไม่ใช้ · ดึงจาก registry ทางการเท่านั้น | `security-gate` ด้าน dependency (npm audit · pip-audit · `dotnet list package --vulnerable` · osv-scanner) · SBOM แบบ CycloneDX |
| A04 | Cryptographic Failures | ไม่เข้ารหัสรหัสผ่านและข้อมูลสำคัญ | Transport Layer Security (TLS) 1.2 ขึ้นไปทุกทาง + HSTS · รหัสผ่านใช้ Argon2id · bcrypt · PBKDF2 (ห้าม MD5 · SHA-1 · SHA-256 เปล่า) · ข้อมูลอ่อนไหวเข้ารหัสตอนเก็บ · ค่าลับอยู่นอกโค้ด · เก็บข้อมูลเท่าที่ใช้ | semgrep (กฎ crypto) · test ว่ารหัสผ่านใน DB ไม่ใช่ข้อความเดิม · ตรวจ TLS ของ server ที่ deploy |
| A05 | Injection | กรอกคำสั่งในช่องค้นหา แล้วดึงฐานข้อมูลได้ | SQL ผ่าน parameter หรือ ORM เท่านั้น · ไม่ต่อสตริงเป็นคำสั่ง shell · HTML escape ตอนแสดงผล (กัน Cross-Site Scripting (XSS)) · ตรวจ input ที่ขอบระบบ | semgrep · test ส่ง `' OR 1=1--` · `<script>` · `; rm` แล้วต้องไม่ทำงาน |
| A06 | Insecure Design | ออกแบบผิดตั้งแต่ต้น เช่น ใช้คูปองซ้ำได้ | threat model ส่วน login · สิทธิ์ · เงิน · ข้อมูลส่วนบุคคล ก่อนเขียน · กฎธุรกิจบังคับที่ server (ใช้ซ้ำไม่ได้ · ยอดติดลบไม่ได้ · ทำซ้ำแล้วไม่ตัดเงินซ้ำ) · จำกัดความถี่ (rate limit) · อัปโหลดไฟล์: ตรวจชนิดจากเนื้อไฟล์ จำกัดขนาด เก็บนอก web root ตั้งชื่อใหม่ ([`file-upload-and-storage`](../file-upload-and-storage/SKILL.md)) | เอกสาร threat model · test อัปโหลดไฟล์ `.php` · `.exe` ที่เปลี่ยนนามสกุลเป็น `.jpg` → ปฏิเสธ · test กรณีใช้ผิดวิธี (abuse case) อย่างน้อย 1 ข้อต่อกฎธุรกิจที่เกี่ยวกับเงินหรือสิทธิ์ |
| A07 | Authentication Failures | เดารหัสได้ไม่จำกัด ไม่มี MFA | จำกัดการ login ผิด · ยืนยันตัวตนหลายชั้น (Multi-Factor Authentication (MFA)) สำหรับ admin และงานเงิน · รหัสผ่านอย่างน้อย 15 ตัว (8 ตัวถ้ามี MFA ตาม National Institute of Standards and Technology (NIST) Special Publication (SP) 800-63B-4) และเทียบรายการรหัสที่หลุด · ข้อความ login ผิดไม่บอกว่า user มีจริงไหม · session id สุ่มจาก server หมุนใหม่หลัง login · JSON Web Token (JWT) ตรวจ `iss` `aud` `exp` และ algorithm | test: login ผิด N ครั้ง → ถูกหน่วงหรือล็อก · token หมดอายุ → 401 · ข้อความผิดเหมือนกันทั้ง user มีและไม่มี |
| A08 | Software or Data Integrity Failures | อัปเดตหรือข้อมูลถูกแก้ระหว่างทาง โดยไม่ตรวจ | ไม่ deserialize ข้อมูลจากภายนอกเป็น object ที่รันโค้ดได้ · webhook ตรวจลายเซ็น · ไฟล์อัปเดตตรวจ checksum หรือลายเซ็น · pipeline ส่งงานอัตโนมัติ (CI/CD) ใช้สิทธิ์น้อยสุด ไม่มีค่าลับใน log · ราคาและยอดเงินคำนวณที่ server ไม่เชื่อค่าจาก client | test webhook ลายเซ็นผิด → ปฏิเสธ · test ส่งราคาปลอมจาก client → ใช้ราคาจาก server |
| A09 | Security Logging and Alerting Failures | ถูกเจาะแล้วไม่มีใครรู้ ไม่มี log | log login สำเร็จและล้ม · ถูกปฏิเสธสิทธิ์ · input ไม่ผ่าน · งานของ admin · เปลี่ยนเงิน — มีเวลา · ใคร · ทำอะไร · ผล · ไม่มีรหัสผ่าน token เลขบัตรใน log · มีการแจ้งเตือนเมื่อ login ล้มเป็นชุด | test ว่า login ล้มแล้วมีบรรทัด log · ค้น log หาค่าลับต้องไม่เจอ · ดู `audit-trail` · `logging-standards` |
| A10 | Mishandling of Exceptional Conditions | ระบบล่มแล้วแสดงข้อมูลภายใน หรือเปิดช่องให้ผ่าน | error ทุกจุดถูกจับ มีตัวจับกลาง (global handler) เป็นด่านสุดท้าย · ล้มแล้ว **ปิด** ไม่ใช่เปิด (ตรวจสิทธิ์ error → ปฏิเสธ) · ธุรกรรมที่ทำไม่จบต้องย้อนกลับ · ข้อความ error ให้ผู้ใช้ไม่มี stack trace หรือ SQL · จำกัด quota · timeout | test: ทำให้ DB หรือบริการภายนอกล้มระหว่างทำงาน → ได้ error ปกติ ข้อมูลไม่ค้างครึ่งทาง · ตรวจสิทธิ์ throw → ได้ 403 ไม่ใช่ผ่าน |

**ข้อที่ไม่เกี่ยว** เขียน `ไม่เกี่ยว` พร้อมเหตุผล 1 บรรทัด เช่น A07 ในระบบที่ไม่มี login เลย · ห้ามเว้นว่าง

วิธีเขียนตาม stack ที่ทีมใช้ (.NET · TypeScript/Node/Angular · Python · SQL) → [`references/stack-checks.md`](references/stack-checks.md)

---

## 2 · ใช้ตอนไหนของงาน

| ช่วง | ทำอะไร | ได้อะไร |
|---|---|---|
| รับงาน · เขียนสัญญา | ใส่ข้อกำหนดและเกณฑ์รับงานตาม [`references/contract-clause.md`](references/contract-clause.md) · ใส่ในเอกสารความต้องการ (Software Requirements Specification (SRS)) หมวดความปลอดภัย (`srs-writing`) | ลูกค้ากับทีมเข้าใจตรงกันว่า "ผ่าน" แปลว่าอะไร |
| ออกแบบ | threat model ส่วน login · สิทธิ์ · เงิน · ข้อมูลส่วนบุคคล (A01 · A06 · A07) · ระบุบทบาทและสิทธิ์เป็นตาราง | `docs/security/threat-model.md` |
| เขียนโค้ด | ทำตามคอลัมน์ "ต้องมี" และ `stack-checks` · ทุกข้อที่ทำได้ให้เป็นของกลางที่ใช้ซ้ำ (ตัวตรวจสิทธิ์ตัวเดียว · ตัวจับ error ตัวเดียว · logger ตัวเดียว) | โค้ดที่ทางปลอดภัยเป็นทางที่ง่ายที่สุด |
| test | เขียน test ตามคอลัมน์ "พิสูจน์ด้วย" ใส่ไว้ในโฟลเดอร์ test ปกติ ชื่อขึ้นต้นด้วยรหัสข้อ เช่น `A01_other_user_order_returns_404` | หลักฐานที่รันซ้ำได้ทุกครั้ง |
| ก่อนส่งมอบ | รัน `security-gate` แล้วกรอก [`assets/owasp-report.md`](assets/owasp-report.md) ทีละข้อ | `qa/security/<ปี-เดือน-วัน>-owasp.md` |

---

## 3 · รายงานก่อนส่งมอบ — กติกา

- 1 แถวต่อ 1 ข้อ ครบ A01–A10 · สถานะใช้ 6 ค่านี้เท่านั้น

  | สถานะ | ส่งมอบได้ไหม | เขียนเมื่อ |
  |---|---|---|
  | `ผ่าน` | ได้ | มีหลักฐานที่รันได้ — ชื่อ test + ผลรัน · ชื่อเครื่องมือ + ไฟล์ผล |
  | `ผ่าน (ตรวจด้วยตา)` | ได้ ถ้าบอกว่าตรวจไฟล์ไหน และข้อนั้นเขียน test ไม่ได้จริง | เช่น การตั้งค่า server ที่ทีมไม่ได้ deploy test ไว้ |
  | `ไม่เกี่ยว — <เหตุผล>` | ได้ | ระบบไม่มีส่วนนั้นเลย |
  | `ยอมรับความเสี่ยง — <วันที่ · ใคร>` | ได้ | ลูกค้าอนุมัติเป็นลายลักษณ์อักษร จดใน `decision-log` |
  | `ไม่ผ่าน` | ไม่ได้ | เจอช่องโหว่ที่ยืนยันแล้ว |
  | `ยังไม่ได้ตรวจ — <เหตุผล>` | ไม่ได้ | เครื่องมือรันไม่ได้ หรือยังไม่ได้ทำ |

- **ส่งมอบได้เมื่อ** ไม่มีข้อ `ไม่ผ่าน` และไม่มีข้อ `ยังไม่ได้ตรวจ`
- **ข้อที่ `ไม่ผ่าน` เขียนเป็น finding block ทีละรายการ** (แม่แบบใน `assets/owasp-report.md`) — รหัส `F-01` · ไฟล์:บรรทัด · ข้อ A0x + ระดับ Application Security Verification Standard (ASVS) ที่ต้องถึง (L1 ทุกระบบ · L2 มีข้อมูลส่วนบุคคลหรือธุรกรรม · L3 เงิน สุขภาพ โครงสร้างสำคัญ) · ผลกระทบในภาษาเจ้าของกิจการ · วิธีแก้ · หลักฐานที่ใช้ยืนยัน (คำสั่ง · test · ภาพ) · 1 block ต่อ 1 ช่องโหว่ ไม่รวมหลายจุดในแถวเดียว (แนวคิดจาก agamm/claude-code-owasp (MIT))
- ใส่ส่วน **ขอบเขตที่ไม่ได้ตรวจ** เสมอ เช่น ทดสอบเจาะระบบโดยคนนอก (penetration test) · server ของลูกค้าที่ทีมไม่ได้ deploy · ไลบรารีที่ไม่มีข้อมูลช่องโหว่
- ห้ามเขียน "ปลอดภัย 100%" หรือ "ได้รับการรับรอง OWASP" — OWASP ไม่ได้ออกใบรับรอง · ถ้าส่งมอบได้ ให้เขียน "ผ่านเกณฑ์ OWASP Top 10:2025 ตามรายการตรวจในรายงานนี้"
- ผลรวมนับแยกครบ 6 สถานะ เช่น `ผ่าน 7 · ผ่าน (ตรวจด้วยตา) 1 · ไม่เกี่ยว 2 · ยอมรับความเสี่ยง 0 · ไม่ผ่าน 0 · ยังไม่ได้ตรวจ 0`
- สรุปสถานะลง `docs/BUILD-PLAN.md` ด้วย `status-report` ประเภท `ตรวจ` (ใครทำ · ใครตรวจ · ผลตรวจ `ผ่าน — ผ่าน 8 · ไม่เกี่ยว 2` หรือ `ไม่ผ่าน — A01 · A07`)

---

## 4 · ใครทำอะไร

| ส่วน | agent |
|---|---|
| ข้อกำหนดในสัญญาและ SRS | `business-analyst` · ข้อกฎหมาย → `legal-compliance-officer` |
| threat model · ตารางสิทธิ์ · รีวิวการออกแบบ | `security-engineer` |
| โค้ดและ test ตามคอลัมน์ "ต้องมี" · "พิสูจน์ด้วย" | `developer` (และ agent ตาม stack) |
| สแกนและกรอกรายงาน | `security-engineer` ผ่าน `security-gate` |
| ตรวจรายงานก่อนส่งลูกค้า | `reviewer` ตัวใหม่ — ทุกแถวที่เขียน `ผ่าน` ต้องเปิดหลักฐานดูได้จริง |

---

## 5 · ไม่ใช่หน้าที่ของ skill นี้

- ทดสอบเจาะระบบจริงหรือระบบของคนอื่น — skill นี้ตรวจเฉพาะโค้ดและ environment ทดสอบของโปรเจกต์นี้
- มาตรฐานอื่น เช่น OWASP API Security Top 10 · Application Security Verification Standard (ASVS) · Payment Card Industry Data Security Standard (PCI-DSS) · พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) — ใช้ skill เฉพาะเรื่องนั้น (`fintech-payments` · `pdpa-compliance`) แต่รายงานนี้ใช้เป็นฐานร่วมได้
- แอปมือถือ — ใช้ OWASP Mobile Top 10 ร่วมกับ `security-gate/references/android.md` · ส่วน backend ของแอปมือถือยังใช้ skill นี้
