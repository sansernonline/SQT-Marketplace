# skill: security-gate

Use when about to ship, merge, release or hand over code, after adding a dependency, or the user says security check.

# security-gate — ประตูความปลอดภัยก่อนส่งงาน

> เครื่องมือสแกนหาเจอเร็วแต่แจ้งผิดเยอะ ส่วนคนตรวจเข้าใจบริบทแต่ช้า
> ประตูนี้ให้เครื่องหาก่อน แล้ว agent ยืนยันทุกข้อกับโค้ดจริง ก่อนจะถึงมือคน

ใช้ร่วมกับ [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md) ส่วนรายงานเชิงลึกให้ใช้ agent `security-engineer`

## ขั้นตอน

1. **รันในห้อง** (sandbox ของโปรเจกต์) — ถ้าโปรเจกต์มี `.sandbox/` ให้รันทุกคำสั่งผ่าน `sandbox.ps1 exec` ส่วนเครื่องมือที่ยังไม่มีให้ติดตั้งในห้องได้เลย ไม่ติดตั้งบนเครื่องผู้ใช้
2. **สแกน 3 ด้าน** (เลือกตามที่โปรเจกต์มี)

   | ด้าน | เครื่องมือแนะนำ | คำสั่งตัวอย่าง |
   |---|---|---|
   | ค่าลับหลุด (รวมประวัติ git) | gitleaks | `gitleaks detect --source . --redact` |
   | dependency มีช่องโหว่ | ตัวที่มากับภาษา + trivy หรือ osv-scanner | `npm audit --omit=dev` · `pip-audit` · `dotnet list package --vulnerable --include-transitive` · `trivy fs --scanners vuln .` |
   | โค้ดเขียนแบบเสี่ยง (static analysis) | semgrep | มีเน็ต: `semgrep scan --config p/default --metrics=off` · ห้อง `-Locked` หรือเข้า semgrep.dev ไม่ได้: `semgrep scan --config <skill นี้>/assets/semgrep-offline.yml --metrics=off` |
   | dependency ของ Dart / Flutter และ Gradle | osv-scanner (อ่าน `pubspec.lock` และ `gradle.lockfile`) | `osv-scanner scan source -r .` (ยังไม่ได้ตรวจบนเครื่องนี้) · ใช้ `flutter pub outdated` ดูของที่ค้างเวอร์ชัน · ถ้า Gradle ไม่มี lockfile ต้องเปิด `dependencyLocking` ก่อนถึงจะสแกนได้ |
   | Dockerfile · compose · IaC (ถ้ามี) | trivy | `trivy config .` ส่วนแอป Android ไม่มีส่วนนี้ ให้อ่าน `android/app/build.gradle*` ด้วยตาแทน (signingConfig ต้องไม่ฝังรหัสผ่าน และ release ต้องเปิด minify) |
   | แอป Android (ถ้ามี) | ตรวจด้วยตาตามรายการข้างล่าง ถ้าต้องการเชิงลึกให้ใช้ MobSF (Mobile Security Framework) | — |

   **รายการตรวจ Android** — ดู `AndroidManifest.xml` ที่รวมแล้วใน `build/app/intermediates/merged_manifests/` ไม่ใช่แค่ไฟล์ต้นฉบับ เพราะ plugin เติม permission ให้เอง
   - `android:exported` — ให้มีแค่ activity หลักที่เป็น `true` ส่วนตัวอื่นต้องมีเหตุผล
   - `android:allowBackup` / `dataExtractionRules` — ตั้งชัดว่าข้อมูลไหนสำรองได้ ไม่ปล่อยค่าเริ่มต้น
   - `android:debuggable` ต้องไม่มีใน release และ `usesCleartextTraffic` ต้องไม่เป็น `true`
   - permission เท่าที่ใช้จริง — แอปออฟไลน์ต้องไม่มี `INTERNET` และต้องตรวจตัวที่ plugin เติมมาด้วย
   - `key.properties` · `*.jks` · `*.keystore` ไม่อยู่ใน git (`git ls-files` แล้วค้น)

   เก็บผลดิบใน `_to_delete/security/`
   - **ห้ามใช้ `--config auto` คู่กับ `--metrics=off`** — semgrep ไม่ยอมรัน (เจอจริงในโปรเจกต์ตัวอย่าง)
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
   - รูปแบบที่เจอซ้ำให้ส่งต่อ [`repeated-mistakes-to-checks`](../repeated-mistakes-to-checks/SKILL.md) ไปทำเป็นกฎ lint
6. **รายงาน** — `qa/security/<ปี-เดือน-วัน>-gate.md` ตาราง `| ระดับ | เรื่อง | ไฟล์:บรรทัด หรือแพ็กเกจ | ยืนยัน | ทำอะไร |` พร้อมคำตัดสิน 1 บรรทัด (`ผ่าน` · `ผ่านหลังแก้` · `ไม่ผ่าน`) ห้ามคัดค่าลับลงรายงาน (ให้ใช้ผลแบบ `--redact`) แล้วรายงานสถานะด้วย `status-report` ประเภท `ตรวจ`

## เมื่อไรต้องรัน

- ทุกครั้งก่อน playbook `ship` และก่อนส่งมอบงานลูกค้า
- หลังเพิ่มหรืออัปเดต dependency
- โปรเจกต์ที่ยังใช้งานอยู่ให้รันสัปดาห์ละครั้งตามรอบ (scheduled task) เพราะช่องโหว่ใหม่ถูกประกาศทุกวันแม้โค้ดไม่เปลี่ยน

## ไม่ใช่หน้าที่ของ skill นี้

- ทดสอบเจาะระบบจริงหรือระบบของคนอื่น เพราะ skill นี้ทำเฉพาะโค้ดและ environment ทดสอบของโปรเจกต์นี้
- รับรองว่าปลอดภัย 100% รายงานบอกแค่ว่าตรวจอะไร ด้วยอะไร และอะไรที่ยังไม่ได้ตรวจ


---

# skill: adversarial-review-panel

Use when asked for adversarial review, stress test or blind spots, or before shipping a contested design or large diff.

# adversarial-review-panel — คณะรีวิวที่ตั้งใจหาเรื่อง

> รีวิวเวอร์คนเดียวเห็นแค่มุมเดียว ส่วนคณะที่ถูกสั่งให้ "พยายามทำให้มันพัง" คนละมุม จะจับสิ่งที่คนเดียวมองข้ามได้
> ผลลัพธ์คือคำตัดสิน **ไม่ใช่การแก้โค้ด**

มาจาก `interrogate` ของ pstack

## ขั้นตอน

1. **ขอบเขต** — diff (`git diff main...HEAD`) หรือไฟล์ที่ระบุ รวมไฟล์รอบข้างที่ต้องอ่านประกอบ ถ้ายังไม่มี commit (โปรเจกต์ใหม่ หรือผู้ใช้ห้าม commit) ให้ใช้รายการไฟล์ที่สร้างหรือแก้ในรอบนี้ (`git status --short` หรือรายการไฟล์ใต้ `lib/` `src/` `test/`) แทน diff
2. **เจตนา** — เขียน 1 ย่อหน้าว่างานนี้ตั้งใจทำอะไร โดยดูจากคำขอ · commit · PR · โค้ด ถ้าไม่แน่ใจให้เลือกการตีความที่ผลกระทบน้อยสุด แล้วจดลง [`decision-log`](../decision-log/SKILL.md) โดยไม่หยุดถาม
3. **ตั้งคณะ 3 คน ต่างมุมกัน** — ใน Claude Code โมเดลทุกตัวมาจากค่ายเดียวกัน ความต่างจึงต้องมาจากมุมที่สั่งให้ดู และการผสมโมเดลหลายขนาด

   | รีวิวเวอร์ | มุม | ระดับโมเดล |
   |---|---|---|
   | ก | ความถูกต้อง — กรณีขอบ · ข้อมูลว่าง · ทำงานพร้อมกัน · error ที่ถูกกลืน · รันซ้ำแล้วได้ผลต่างกัน | ใหญ่ |
   | ข | ความปลอดภัยและข้อมูล — input ที่ไม่ได้ตรวจ · สิทธิ์ · ค่าลับ · ข้อมูลส่วนบุคคล · การกระทำที่ย้อนกลับไม่ได้ | ใหญ่ |
   | ค | ความเรียบง่ายและคนดูแลต่อ — โค้ดเกินจำเป็น · ชั้นที่ไม่ต้องมี · ชื่อที่ชวนเข้าใจผิด · test ที่ผ่านทั้งที่โค้ดผิด | กลาง |

   ถ้ารีวิวแอปมือถือ ให้รีวิวเวอร์ ก เพิ่มมุม **วงจรชีวิตแอป** — process ถูกฆ่าแล้วกลับมา (state หาย) · แอปไปอยู่เบื้องหลังแต่เซนเซอร์หรือกล้องยังเปิด (แบตหมด) · ผู้ใช้ถอนสิทธิ์กลางทาง · หมุนจอ

   **รีวิวเวอร์จากค่ายอื่น (ถ้ามี)** — ถ้าเครื่องมี CLI ของโมเดลค่ายอื่นติดตั้งไว้แล้ว (เช่น `codex` · `gemini`) ให้ใช้แทนรีวิวเวอร์ ค ด้วย prompt และมุมเดิม ในโหมดอ่านอย่างเดียว เพราะโมเดลต่างค่ายพลาดไม่เหมือนกัน จึงจับจุดบอดได้มากกว่า แต่ **โค้ดจะถูกส่งออกไปยังผู้ให้บริการนั้น** จึงใช้ได้เฉพาะเมื่ออนุญาตไว้ล่วงหน้าใน `~/.claude/superuser-style.md` หรือ `docs/AGENT-LOOP.md` ถ้าไม่มี CLI หรือไม่ได้อนุญาต ให้ใช้คณะค่ายเดียวตามตาราง

   ถ้าเป็นงานเอกสารหรือดีไซน์ ให้เปลี่ยนมุมเป็น: ครบตามข้อกำหนดไหม · ขัดกันเองไหม · คนอ่านจริงจะติดตรงไหน
4. **ปล่อยพร้อมกัน อ่านอย่างเดียว** — ทุกคนได้ prompt และเจตนาเดียวกัน ต่างกันแค่มุม ให้ส่งผลเป็นตาราง `| ปัญหา | ไฟล์:บรรทัด | ทำให้พังอย่างไร (ขั้นตอนหรือ input) | ความรุนแรง |` และ **ห้ามแก้ไฟล์**
5. **ยืนยันทุกข้อ** — อ่านโค้ดจริงหรือรันให้เห็น ข้อที่ยืนยันไม่ได้ให้ติด `PLAUSIBLE` (เป็นไปได้ แต่ยังพิสูจน์ไม่ได้) หรือทิ้งพร้อมเหตุผล ส่วนข้อ `PLAUSIBLE` ให้ตัดสินเองโดยเลือกทางที่ผลกระทบน้อยสุด แล้วจดลงรายการ ยกเว้นเรื่องในรายการ "รออนุมัติ" ของ `superuser` (ลบหรือเขียนทับของผู้ใช้ · commit/push · ส่งออกนอกเครื่อง) ให้เตรียมไว้และจดลงรายการ ไม่ทำเอง
6. **ให้น้ำหนัก** — ถ้า 2 คนขึ้นไปเจอเรื่องเดียวกัน ถือเป็นสัญญาณแรง ถ้าเจอคนเดียวแต่มีขั้นตอนทำให้พังชัด ก็ถือว่าจริง ส่วนความเห็นเรื่องรสนิยมเป็นแค่ข้อสังเกต
7. **คำตัดสิน** — 1 บรรทัด: `ส่งได้` · `ส่งได้หลังแก้` · `ยังไม่ควรส่ง` แล้วตามด้วยรายการ: ต้องแก้ · ควรแก้ · ข้อสังเกต · ข้อที่ทิ้งพร้อมเหตุผล
8. การสั่งแก้ต่อเป็นหน้าที่ของผู้ใช้หรือ playbook ส่วน skill นี้หยุดที่คำตัดสิน

## ข้อควรระวัง

- คณะรีวิวใช้ token เยอะ งานเล็กหรือรีวิว PR ทั่วไปใช้ `code-review-checklist` ตัวเดียวพอ · เขียนคำอธิบาย PR ใช้ `pr-description-template`
- รีวิวเวอร์ AI ก็แจ้งปัญหาที่ไม่มีจริงได้ ทุกข้อจึงต้องผ่านข้อ 5 ก่อนเข้ารายงาน


---

# skill: parallel-split-and-merge

Use when work splits into independent slices (modules, screens, files, test cases) or the user says swarm or fan out. No shared writes.

# parallel-split-and-merge — แบ่งงาน ทำพร้อมกัน รวมเป็นรายงานเดียว

> ต่างจาก `parallel-attempts-pick-best` ตรงที่แต่ละตัวทำ**คนละชิ้น** ไม่ใช่แข่งทำชิ้นเดียวกัน

มาจาก `swarm` ของ pstack

## ขั้นตอน

1. **แบ่งให้ไม่ทับกัน** — เขียนตารางแบ่งงาน `| ชิ้น | ขอบเขต (ไฟล์ · หน้าจอ · กรณี) | worker |` ทุกส่วนของงานอยู่ในชิ้นเดียวพอดี ไม่ซ้ำ ไม่ตก
2. **รูปแบบรายงานเดียวกันทุกตัว** — กำหนดหัวข้อที่ต้องส่งกลับ เช่น `| สิ่งที่พบ | ไฟล์:บรรทัด | ความรุนแรง | หลักฐาน |` เพื่อรวมได้โดยไม่ต้องตีความ
3. **ห้ามเขียนที่เดียวกัน** — งานอ่านอย่างเดียวปล่อยได้เลย งานที่แก้ไฟล์ให้แยก worktree หรือโฟลเดอร์ต่อตัว ส่วนไฟล์สรุปรวมให้ตัวหลักเขียนคนเดียว
4. **ขนาดชิ้น** — ชิ้นละไม่เกินสิ่งที่ subagent ทำจบในรอบเดียว (ราว 5 โมดูล หรือ 10 หน้าจอ) และปล่อยพร้อมกันไม่เกิน 8 ตัว
5. **ปล่อยทุกตัวในข้อความเดียว** รันเบื้องหลัง โดยส่งตำแหน่งไฟล์แทนเนื้อหา และเลือก agent ตามงาน (`qa-tester` ตรวจ · `developer` แก้ · `system-analyst` อ่าน)
6. **รอให้ครบ** — ห้ามสรุปจากตัวที่เสร็จก่อน ถ้าตัวไหนล้มให้ปล่อยตัวใหม่ทำซ้ำ 1 ครั้ง ถ้ายังล้มอีกให้บันทึกว่าชิ้นนั้นไม่ได้ตรวจ
7. **รวม** — ตัดข้อซ้ำ แล้วจัดกลุ่มสิ่งที่เป็นเรื่องเดียวกัน (หลายรายงานที่ต่างกันเล็กน้อย มักชี้ไปที่ต้นเหตุเดียวที่อยู่สูงกว่า) และยืนยันข้อที่ร้ายแรงด้วยตัวเองก่อนรายงาน
8. **รายงานเดียว** — สรุป 1 ย่อหน้า · ตารางรวม · ชิ้นที่ไม่ได้ตรวจ (ถ้ามี) · `status-report`

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| ปล่อย worker โดยไม่มีตารางแบ่งงาน | ทำซ้ำกันบางส่วน ตกหล่นบางส่วน ไม่มีใครรู้ |
| ส่งต่อรายงานของ worker ตรง ๆ | ตัวหลักต้องรับผิดชอบผลรวม ต้องอ่านและยืนยันเอง |
| ให้ worker หลายตัวแก้ไฟล์เดียวกัน | ผลชนกันและหายเงียบ |


---

# skill: bug-report-template

Use when writing a report for one software defect found in testing or from a user complaint (repro steps, severity vs priority).

# Bug Report Template

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## Where bug reports live

One file per bug in `qa/bugs/BUG-<NNN>-<slug>.md` at the project root. Attach screenshots and logs under `qa/bugs/BUG-<NNN>/` — redact personal data first.

## When to use this skill

- Filing a new bug during testing
- Converting user complaints into bug tickets
- Reproducing an issue and documenting findings

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รายงานบั๊กกองอยู่หลายเรื่อง ต้องคัด ทำซ้ำ และจัดกลุ่มก่อน | `bug-inbox-triage` แล้วใช้ skill นี้เขียนทีละใบ |
| เขียนกรณีทดสอบล่วงหน้าจากข้อกำหนด (ยังไม่มีบั๊ก) | `test-case-template` |
| ระบบจริงล่มหรือกระทบผู้ใช้จำนวนมาก | `incident-runbook-template` ระหว่างเหตุ · `postmortem-template` หลังเหตุ |

## Severity vs Priority

These are **different**:

| | Severity | Priority |
|---|----------|----------|
| What it measures | Technical impact | Business urgency |
| Set by | QA (quality assurance) / Engineering | PM (product manager) / PO (product owner) |

| Severity | Definition |
|----------|------------|
| **S1 Critical** | System unusable, data loss, no workaround |
| **S2 High** | Major feature broken, workaround exists |
| **S3 Medium** | Feature partially broken |
| **S4 Low** | Cosmetic, minor inconvenience |

| Priority | Definition |
|----------|------------|
| **P1** | Fix immediately, block release |
| **P2** | Fix in current sprint |
| **P3** | Fix in next sprint |
| **P4** | Fix when there is time / backlog |

## Output Template

Copy **[`assets/bug-report.md`](assets/bug-report.md)** and fill it in. Do not write the outline from memory.

- Do not add, remove or reorder headings and `**fields:**`. A section marked `<!-- optional -->` may be deleted whole when it does not apply.
- A value you do not know yet → `(รอยืนยัน)`, never a guess and never the template's placeholder.
- Before handing over, run the shared checker until it passes (paths from this skill's folder):

  ```bash
  python ../polished-document-style/scripts/check_outline.py assets/bug-report.md <your bug file>
  ```

  It flags missing or reordered headings, missing fields, changed table headers, and anything still unfilled (`<...>`, `YYYY-MM-DD`, `XXXX`, `...`, a field still listing every option).

## Title Writing Guide

❌ Bad titles:
- "Login broken"
- "Bug in checkout"
- "It doesn't work"

✅ Good titles (action + condition + result):
- "Login fails with 500 error when email contains apostrophe"
- "Checkout total shows NaN when quantity is decimal"
- "Search returns no results for queries longer than 100 chars"

**Formula:** `<Action> + <Condition> + <Unexpected result>`

## Steps to Reproduce Rules

- [ ] Start from a known state (logged out, fresh browser, etc.)
- [ ] Each step is one action
- [ ] Anyone can follow without prior knowledge
- [ ] Include exact data used (not "some user")
- [ ] No skipped steps (even "obvious" ones)
- [ ] Numbered sequentially

## Quality Checklist

Before submitting:

- [ ] Title clearly summarizes the issue
- [ ] Severity set · priority set, or `(รอยืนยัน)` until the PM/PO sets it
- [ ] Steps are reproducible by someone else
- [ ] Expected and actual results clearly differ
- [ ] At least one piece of evidence attached
- [ ] Environment info complete
- [ ] Searched for duplicates first
- [ ] `check_outline.py` passes

## Anti-patterns

- ❌ "Same as last week's bug" — describe it fully
- ❌ Multiple bugs in one report — split them
- ❌ "Bug" without steps — give steps to reproduce
- ❌ Putting a proposed fix in the title — the developer decides the fix
- ❌ Marking everything as P1 — be honest about priority

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks**.
Load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral. It looks like unfinished work.
