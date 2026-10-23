---
name: security-gate
description: Use when about to ship, merge or hand over code, after adding a dependency, or the user says security check.
---

# security-gate — ประตูความปลอดภัยก่อนส่งงาน

> เครื่องมือสแกนหาเจอเร็วแต่แจ้งผิดเยอะ ส่วนคนตรวจเข้าใจบริบทแต่ช้า
> ประตูนี้ให้เครื่องหาก่อน แล้ว agent ยืนยันทุกข้อกับโค้ดจริง ก่อนจะถึงมือคน

ใช้ร่วมกับ [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md) ส่วนรายงานเชิงลึกให้ใช้ agent `security-engineer`

## ขั้นตอน

1. **รันในห้อง** (sandbox ของโปรเจกต์) — ถ้าโปรเจกต์มี `.sandbox/` ให้รันทุกคำสั่งผ่าน `sandbox.ps1 exec` ส่วนเครื่องมือที่ยังไม่มีให้ติดตั้งในห้องได้เลย ไม่ติดตั้งบนเครื่องผู้ใช้
2. **สแกน 3 ด้าน** (เลือกตามที่โปรเจกต์มี)

   | ด้าน | เครื่องมือแนะนำ | คำสั่งตัวอย่าง |
   |---|---|---|
   | ค่าลับหลุด (รวมประวัติ git) | gitleaks 8.19+ | ประวัติ git: `gitleaks git . --redact` · ไฟล์ที่ยังไม่ commit: `gitleaks dir . --redact` (`detect`/`protect` ถูก deprecate ตั้งแต่ v8.19.0 — ที่มา github.com/gitleaks/gitleaks/releases/tag/v8.19.0 · ตรวจ 22 ต.ค. 2569) |
   | dependency มีช่องโหว่ | ตัวที่มากับภาษา + trivy หรือ osv-scanner | `npm audit --omit=dev` · `pip-audit` · `dotnet list package --vulnerable --include-transitive` · `trivy fs --scanners vuln .` |
   | โค้ดเขียนแบบเสี่ยง (static analysis) | semgrep | มีเน็ต: `semgrep scan --config p/default --metrics=off` · ห้อง `-Locked` หรือเข้า semgrep.dev ไม่ได้: `semgrep scan --config <skill นี้>/assets/semgrep-offline.yml --metrics=off` |
   | dependency ของ Dart / Flutter และ Gradle | osv-scanner (อ่าน `pubspec.lock` และ `gradle.lockfile`) | `osv-scanner scan source -r .` (ยังไม่ได้ตรวจบนเครื่องนี้) · ใช้ `flutter pub outdated` ดูของที่ค้างเวอร์ชัน · ถ้า Gradle ไม่มี lockfile ต้องเปิด `dependencyLocking` ก่อนถึงจะสแกนได้ |
   | Dockerfile · compose · IaC (ถ้ามี) | trivy | `trivy config .` ส่วนแอป Android ไม่มีส่วนนี้ ให้อ่าน `android/app/build.gradle*` ด้วยตาแทน (signingConfig ต้องไม่ฝังรหัสผ่าน และ release ต้องเปิด minify) |
   | แอป Android (ถ้ามี) | ตรวจด้วยตาตาม [`references/android.md`](references/android.md) ถ้าต้องการเชิงลึกให้ใช้ MobSF (Mobile Security Framework) | — |

   **รายการตรวจ Android** → [`references/android.md`](references/android.md)

   เก็บผลดิบใน `_to_delete/security/`
   - **ห้ามใช้ `--config auto` คู่กับ `--metrics=off`** — semgrep ไม่ยอมรัน (เจอจริงในโปรเจกต์ตัวอย่าง)
   - **ชุดกฎ semgrep เลือกตามภาษาที่เจอ ไม่ใช่ `p/default` อย่างเดียว** (แนวคิดจาก trailofbits/skills `semgrep` · CC-BY-SA เขียนใหม่ด้วยคำเรา) — ทุกโปรเจกต์: `p/security-audit` + `p/secrets` รันครั้งเดียวทั้ง repo · แล้วเพิ่มตามภาษา: `p/python` (+`p/django` หรือ `p/flask`) · `p/javascript` + `p/typescript` (+`p/react` · `p/nodejs`) · `p/csharp` · `p/dockerfile` · มีหลายภาษาใส่ `--config` หลายตัวในคำสั่งเดียวได้ · ชุดกฎไหนโหลดไม่ได้ (ไม่มีเน็ต · ชื่อผิด) ต้องขึ้นในรายงานว่าไม่ได้รัน ไม่ใช่หายเงียบ
   - ชุดออฟไลน์มี 6 กฎที่แทบไม่มีกรณีปลอดภัย (eval · HTML จากตัวแปร · shell จากตัวแปร · SQL ต่อสตริง · ค่าลับในโค้ด) และพิสูจน์แล้วว่าจับได้ครบในไฟล์ที่ตั้งใจเขียนผิด ถ้าเครื่องมือไหนรันไม่ได้ ให้เขียนในรายงานว่า `ยังไม่ได้ตรวจ` พร้อมเหตุผล
   - **semgrep รองรับ Dart น้อยมาก และกฎออฟไลน์เขียนไว้สำหรับเว็บกับ backend** ถ้า semgrep ไม่เจออะไรในโปรเจกต์ Flutter ก็ไม่ได้แปลว่าปลอดภัย รายงานต้องเขียนว่าโค้ด Dart `ยังไม่ได้ตรวจด้วย static analysis` แล้วพึ่ง `flutter analyze` กับการอ่านโค้ดแทน ห้ามสรุปว่า `ผ่าน` จากผลว่าง
3. **ยืนยันทุกข้อ** — เปิดโค้ดจริงดูว่าใช้ได้จริงไหม (เช่น ช่องโหว่อยู่ในฟังก์ชันที่โปรเจกต์ไม่ได้เรียก) แล้วติดป้าย `ยืนยันแล้ว` / `แจ้งผิด` / `ยังไม่ยืนยัน` พร้อมเหตุผล
4. **จัดระดับและตัดสิน**

   | ระดับ | ทำอะไร |
   |---|---|
   | ค่าลับจริงหลุด | **หยุดทันที บอกผู้ใช้** ต้องเปลี่ยนค่าลับที่ผู้ให้บริการ เพราะลบจากไฟล์อย่างเดียวไม่พอ และ agent ไม่แก้ประวัติ git เอง |
   | critical · high ที่ยืนยันแล้ว | **ห้ามส่ง** จนกว่าจะแก้ หรือผู้ใช้ยอมรับความเสี่ยงเป็นลายลักษณ์อักษรใน `decision-log` |
   | medium | ถ้าเล็กให้แก้ในรอบนี้ ถ้าไม่เล็กให้เปิดเป็นงานแยก |
   | low · แจ้งผิด | บันทึกเหตุผล ไม่ต้องแก้ |

5. **แก้**
   - ช่องโหว่ใน dependency ให้อัปเดตเป็นเวอร์ชันที่แก้แล้ว แล้วรัน test
   - ช่องโหว่ในโค้ดให้ใช้ playbook `bug-fix` (หาต้นเหตุ + เขียน test ที่ล้มก่อนแก้ + ค้นจุดอื่นที่เขียนแบบเดียวกัน)
   - รูปแบบที่เจอซ้ำให้ส่งต่อ `repeated-mistakes-to-checks` ไปทำเป็นกฎ lint
6. **รายงาน** — `qa/security/<ปี-เดือน-วัน>-gate.md` ตาราง `| ระดับ | เรื่อง | ไฟล์:บรรทัด หรือแพ็กเกจ | ยืนยัน | ทำอะไร |` พร้อมคำตัดสิน 1 บรรทัด (`ผ่าน` · `ผ่านหลังแก้` · `ไม่ผ่าน`) ห้ามคัดค่าลับลงรายงาน (ให้ใช้ผลแบบ `--redact`) แล้วรายงานสถานะด้วย `status-report` ประเภท `ตรวจ`
   - **ต้องมีหัวข้อ "ไม่ได้รัน"** ก่อนคำตัดสิน: เครื่องมือหรือชุดกฎที่ติดตั้งไม่ได้ · ออก exit code ไม่ใช่ 0 · ภาษาที่สแกนเนอร์ไม่รองรับ (เช่น Dart) · ไฟล์หรือโฟลเดอร์ที่ข้าม — ระบุชื่อและเหตุผลทีละรายการ · รายงานที่สแกนไม่ครบแต่เขียนเหมือนครบ แย่กว่าไม่สแกน · ถ้ามีรายการในหัวข้อนี้ คำตัดสิน `ผ่าน` ต้องต่อท้ายว่า `(ยกเว้นที่ไม่ได้รัน)`
   - ก่อนส่งมอบลูกค้า หรือสัญญาระบุ OWASP → กรอกรายงานรายข้อ A01–A10 ตาม [`owasp-top10`](../owasp-top10/SKILL.md) เพิ่มอีกไฟล์ `qa/security/<ปี-เดือน-วัน>-owasp.md` · ผลสแกนของ gate นี้ใช้เป็นหลักฐานข้อ A02 · A03 · A04 · A05 · A08

## เมื่อไรต้องรัน

- ทุกครั้งก่อน playbook `ship` และก่อนส่งมอบงานลูกค้า
- หลังเพิ่มหรืออัปเดต dependency — ผลสแกนมีรายการ ให้ทำตาม [`references/dependency-updates.md`](references/dependency-updates.md) (จัดกลุ่มตามความเสี่ยงจริง · ลำดับ patch → minor → major · พิสูจน์ · ลง CHANGELOG)
- โปรเจกต์ที่ยังใช้งานอยู่ให้รันสัปดาห์ละครั้งตามรอบ (scheduled task) เพราะช่องโหว่ใหม่ถูกประกาศทุกวันแม้โค้ดไม่เปลี่ยน

## ไม่ใช่หน้าที่ของ skill นี้

- ทดสอบเจาะระบบจริงหรือระบบของคนอื่น เพราะ skill นี้ทำเฉพาะโค้ดและ environment ทดสอบของโปรเจกต์นี้
- รับรองว่าปลอดภัย 100% รายงานบอกแค่ว่าตรวจอะไร ด้วยอะไร และอะไรที่ยังไม่ได้ตรวจ
- รีวิวตรรกะและการออกแบบของ diff → `code-review-checklist` (ก่อน merge รันทั้งสองตัว)
