---
name: security-gate
description: Use before shipping, merging, releasing or handing over code, after adding a dependency, on a schedule, or when the user says security check. Secret, dependency and static scans in the sandbox; blocks on unresolved critical or high.
---

# security-gate — ประตูความปลอดภัยก่อนส่งงาน

> เครื่องมือสแกนหาเจอเร็ว แต่แจ้งผิดเยอะ · คนตรวจเข้าใจบริบท แต่ช้า
> ประตูนี้ให้เครื่องหาก่อน แล้ว agent ยืนยันทุกข้อกับโค้ดจริง ก่อนจะถึงมือคน

ใช้ร่วมกับ [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md) · รายงานเชิงลึกใช้ agent `security-engineer`

## ขั้นตอน

1. **รันในห้อง** — โปรเจกต์มี `.sandbox/` ทำทุกคำสั่งผ่าน `sandbox.ps1 exec` · เครื่องมือที่ยังไม่มีในห้อง ติดตั้งในห้องได้เลย ไม่ติดตั้งบนเครื่อง
2. **สแกนสามด้าน** (เลือกตามที่โปรเจกต์มี)

   | ด้าน | เครื่องมือแนะนำ | คำสั่งตัวอย่าง |
   |---|---|---|
   | ค่าลับหลุด (รวมประวัติ git) | gitleaks | `gitleaks detect --source . --redact` |
   | dependency มีช่องโหว่ | ตัวที่มากับภาษา + trivy หรือ osv-scanner | `npm audit --omit=dev` · `pip-audit` · `dotnet list package --vulnerable --include-transitive` · `trivy fs --scanners vuln .` |
   | โค้ดเขียนแบบเสี่ยง (static analysis) | semgrep | มีเน็ต: `semgrep scan --config p/default --metrics=off` · ห้อง `-Locked` หรือเข้า semgrep.dev ไม่ได้: `semgrep scan --config <skill นี้>/assets/semgrep-offline.yml --metrics=off` |
   | dependency ของ Dart / Flutter และ Gradle | osv-scanner (อ่าน `pubspec.lock` และ `gradle.lockfile`) | `osv-scanner scan source -r .` (ยังไม่ได้ตรวจบนเครื่องนี้) · `flutter pub outdated` ดูของที่ค้างเวอร์ชัน · Gradle ไม่มี lockfile ต้องเปิด `dependencyLocking` ก่อนถึงจะสแกนได้ |
   | Dockerfile · compose · IaC (ถ้ามี) | trivy | `trivy config .` · แอป Android ไม่มีส่วนนี้ ให้อ่าน `android/app/build.gradle*` ด้วยตาแทน (signingConfig ไม่ฝังรหัสผ่าน · release เปิด minify) |
   | แอป Android (ถ้ามี) | ตรวจด้วยตาตามรายการข้างล่าง · เชิงลึกใช้ MobSF (Mobile Security Framework) | — |

   **รายการตรวจ Android** — ดู `AndroidManifest.xml` ที่รวมแล้วใน `build/app/intermediates/merged_manifests/` ไม่ใช่แค่ไฟล์ต้นฉบับ เพราะ plugin เติม permission ให้เอง
   - `android:exported` — มีแค่ activity หลักที่เป็น `true` · ตัวอื่นต้องมีเหตุผล
   - `android:allowBackup` / `dataExtractionRules` — ตั้งชัดว่าข้อมูลไหนสำรองได้ ไม่ปล่อยค่าเริ่มต้น
   - `android:debuggable` ไม่มีใน release · `usesCleartextTraffic` ไม่เป็น `true`
   - permission เท่าที่ใช้จริง — แอปออฟไลน์ต้องไม่มี `INTERNET` · ตรวจตัวที่ plugin เติมมาด้วย
   - `key.properties` · `*.jks` · `*.keystore` ไม่อยู่ใน git (`git ls-files` แล้วค้น)

   เก็บผลดิบใน `_to_delete/security/`
   - **ห้ามใช้ `--config auto` คู่กับ `--metrics=off`** — semgrep ไม่ยอมรัน (เจอจริงในโปรเจกต์ตัวอย่าง)
   - ชุดออฟไลน์มี 6 กฎที่แทบไม่มีกรณีปลอดภัย (eval · HTML จากตัวแปร · shell จากตัวแปร · SQL ต่อสตริง · ค่าลับในโค้ด) · พิสูจน์แล้วว่าจับได้ครบในไฟล์ที่ตั้งใจเขียนผิด · เครื่องมือไหนรันไม่ได้ ให้เขียนในรายงานว่า `ยังไม่ได้ตรวจ` พร้อมเหตุผล
   - **semgrep รองรับ Dart น้อยมาก และกฎออฟไลน์เขียนไว้สำหรับเว็บกับ backend** — โปรเจกต์ Flutter ที่ semgrep ไม่เจออะไร ไม่ได้แปลว่าปลอดภัย · รายงานต้องเขียนว่าโค้ด Dart `ยังไม่ได้ตรวจด้วย static analysis` แล้วพึ่ง `flutter analyze` กับการอ่านโค้ดแทน ห้ามสรุปว่า `ผ่าน` จากผลว่าง
3. **ยืนยันทุกข้อ** — เปิดโค้ดจริงดูว่าใช้ได้จริงไหม (เช่น ช่องโหว่อยู่ในฟังก์ชันที่โปรเจกต์ไม่ได้เรียก) · ติดป้าย `ยืนยันแล้ว` / `แจ้งผิด` / `ยังไม่ยืนยัน` พร้อมเหตุผล
4. **จัดระดับและตัดสิน**

   | ระดับ | ทำอะไร |
   |---|---|
   | ค่าลับจริงหลุด | **หยุดทันที บอกผู้ใช้** — ต้องเปลี่ยนค่าลับที่ผู้ให้บริการ · ลบจากไฟล์อย่างเดียวไม่พอ · agent ไม่แก้ประวัติ git เอง |
   | critical · high ที่ยืนยันแล้ว | **ห้ามส่ง** จนกว่าจะแก้ หรือผู้ใช้ยอมรับความเสี่ยงเป็นลายลักษณ์อักษรใน `decision-log` |
   | medium | แก้ในรอบนี้ถ้าเล็ก · ไม่เล็กเปิดเป็นงานแยก |
   | low · แจ้งผิด | บันทึกเหตุผล ไม่ต้องแก้ |

5. **แก้** — ช่องโหว่ใน dependency อัปเดตเวอร์ชันที่แก้แล้วแล้วรัน test · ช่องโหว่ในโค้ดใช้ playbook `bug-fix` (หาต้นเหตุ + test ที่ล้มก่อนแก้ + ค้นหาจุดอื่นที่เขียนแบบเดียวกัน) · รูปแบบที่เจอซ้ำส่งต่อ [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md) ให้เป็นกฎ lint
6. **รายงาน** — `qa/security/<ปี-เดือน-วัน>-gate.md` ตาราง `| ระดับ | เรื่อง | ไฟล์:บรรทัด หรือแพ็กเกจ | ยืนยัน | ทำอะไร |` + คำตัดสินหนึ่งบรรทัด `ผ่าน` · `ผ่านหลังแก้` · `ไม่ผ่าน` · ห้ามคัดค่าลับลงรายงาน (ใช้ผลแบบ `--redact`) · `status-report` ประเภท `ตรวจ`

## เมื่อไรต้องรัน

- ทุกครั้งก่อน playbook `ship` และก่อนส่งมอบงานลูกค้า
- หลังเพิ่มหรืออัปเดต dependency
- โปรเจกต์ที่ยังใช้งานอยู่ — สัปดาห์ละครั้งตามรอบ (scheduled task) เพราะช่องโหว่ใหม่ถูกประกาศทุกวันแม้โค้ดไม่เปลี่ยน

## ไม่ใช่หน้าที่ของ skill นี้

- ทดสอบเจาะระบบจริงหรือระบบของคนอื่น — ทำเฉพาะโค้ดและ environment ทดสอบของโปรเจกต์นี้
- รับรองว่าปลอดภัย 100% — รายงานบอกว่าตรวจอะไร ด้วยอะไร และอะไรที่ยังไม่ได้ตรวจ
