# skill: principle-build-a-tool-not-handwork

Use when work has a mechanical part (same edit in many files, rows or documents, a repeated check). Script it once.

# principle · build a tool, not handwork — งานกลไกทำเป็นเครื่องมือ
> ใช้คู่กัน: `principle-small-verifiable-steps` (ตัดเป็นชิ้นเล็กที่ตรวจได้) · `parallel-split-and-merge` (รันหลายชิ้นพร้อมกัน)

> งานมี 2 ส่วน: ส่วนที่ต้องใช้วิจารณญาณ กับส่วนที่เป็นกลไกล้วน ๆ
> ส่วนกลไกไม่ต้องให้ agent คิดวิธีใหม่ทุกครั้ง ให้เขียนเป็นโปรแกรมครั้งเดียว แล้วเก็บแรงคิดไว้กับส่วนที่ต้องตัดสินใจ

## เมื่อไรต้องทำเครื่องมือ

| สัญญาณ | เครื่องมือ |
|---|---|
| แก้รูปแบบเดียวกันเกิน 10 จุด (ไฟล์ · แถวในชีต · เอกสาร · โค้ด) | สคริปต์หรือค้นหา-แทนที่ที่ทดสอบแล้ว (โค้ด: codemod · `sed`) |
| เอกสารจากแม่แบบซ้ำหลายใบ (ใบเสนอราคา 40 ใบ) | แม่แบบ + สคริปต์ผสมข้อมูลจากชีต |
| ตรวจทุกหน้าจอ ทุกไฟล์ หรือทุกแถว | สคริปต์วนตรวจที่พิมพ์ตารางผล |
| agent ทุกตัวต้องตั้งสภาพแวดล้อมเองก่อนตรวจ | สคริปต์ `start` ใน verify skill (`app-verifier-setup` (plugin `software-company`)) |
| ย้ายหรือนำเข้าข้อมูล | สคริปต์ที่รันซ้ำได้ผลเดิม พร้อมโหมดลองก่อน (dry run) |
| ข้ออ้างว่า "ทุกที่ทำแบบนี้แล้ว" | คำสั่ง grep หรือสคริปต์ที่พิสูจน์ได้ |
| ทำงานเดิมเป็นครั้งที่ 3 | ทำเป็นคำสั่งหรือ skill |

## กฎของเครื่องมือ

- **รันซ้ำได้ผลเดิม** — รัน 2 ครั้งต้องไม่พัง และไม่แก้ซ้ำ (`principle-safe-to-rerun` (plugin `software-company`))
- **พิมพ์ผลที่ตรวจได้** — บอกจำนวนที่แก้ · รายการที่ข้าม · รายการที่ล้ม
- **เล็กที่สุดที่ทำงานได้** — ไม่ต้องสวย ไม่ต้องรองรับทุกกรณีในอนาคต (`lazy-coding` (plugin `software-company`))
- **เก็บให้ถูกที่** — สคริปต์ที่ใช้ครั้งเดียวเก็บไว้ใน `_to_delete/` ส่วนสคริปต์ที่ใช้ซ้ำเก็บใน `scripts/` แล้วเขียนบรรทัดเดียวใน README ว่ารันเมื่อไร
- **skill เหลือแค่คำอธิบายบาง ๆ** — ขั้นตอนตายตัวอยู่ในสคริปต์ ส่วน SKILL.md บอกแค่ว่าเรียกเมื่อไรและอ่านผลอย่างไร

## ไม่ต้องทำเมื่อ

งานแก้ 2–3 จุดที่ต่างกันจริง เพราะเขียนสคริปต์จะใช้เวลามากกว่าแก้เอง


---

# skill: security-gate

Use when about to ship, merge or hand over code, after adding a dependency, or the user says security check.

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


## reference: android.md

# รายการตรวจ Android — ใช้กับ `security-gate` ข้อ 2

**รายการตรวจ Android** — ดู `AndroidManifest.xml` ที่รวมแล้ว (merged manifest) ไม่ใช่แค่ไฟล์ต้นฉบับ เพราะ plugin เติม permission ให้เอง · โฟลเดอร์เปลี่ยนตามเวอร์ชัน Android Gradle Plugin (AGP) (`merged_manifests/<variant>/` หรือ `merged_manifest/<variant>/process<Variant>MainManifest/` — ยังไม่ได้ตรวจ) ให้หาด้วย `find build -path '*merged_manifest*' -name AndroidManifest.xml` หลัง build release
- `android:exported` — ให้มีแค่ activity หลักที่เป็น `true` ส่วนตัวอื่นต้องมีเหตุผล
- `android:allowBackup` / `dataExtractionRules` — ตั้งชัดว่าข้อมูลไหนสำรองได้ ไม่ปล่อยค่าเริ่มต้น
- `android:debuggable` ต้องไม่มีใน release และ `usesCleartextTraffic` ต้องไม่เป็น `true`
- permission เท่าที่ใช้จริง — แอปออฟไลน์ต้องไม่มี `INTERNET` และต้องตรวจตัวที่ plugin เติมมาด้วย
- `key.properties` · `*.jks` · `*.keystore` ไม่อยู่ใน git (`git ls-files` แล้วค้น)


## reference: dependency-updates.md

# อัปเดต dependency ที่มีช่องโหว่ — ส่วนขยายของ `security-gate` ขั้น 5

ใช้เมื่อผลสแกน dependency มีรายการ หรือเพิ่งเพิ่ม dependency ใหม่ · แนวคิดจาก wshobson `dependency-management` (MIT) และ Trail of Bits `supply-chain-risk-auditor` (CC-BY-SA 4.0 — เอาแค่แนวคิด เขียนใหม่ด้วยคำเรา)

## 1 · สแกน — ใช้ตัวที่มากับภาษา แล้วเสริมด้วยตัวที่อ่าน lockfile ได้ทุกภาษา

| stack | คำสั่ง | หมายเหตุ |
|---|---|---|
| Node | `npm audit --omit=dev --json > _to_delete/security/npm-audit.json` | `--omit=dev` ตัดของที่ไม่ไปถึง production · ห้าม `npm audit fix --force` เพราะมันยอมอัปเดตข้าม major |
| Python | `pip-audit -r requirements.txt` หรือ `pip-audit` ใน venv | โปรเจกต์ที่ใช้ `uv` / `poetry` ให้ export lockfile เป็น requirements ก่อน |
| .NET | `dotnet list package --vulnerable --include-transitive` | ไม่ใส่ `--include-transitive` จะเห็นแค่ที่อ้างตรง |
| ทุก stack | `trivy fs --scanners vuln .` หรือ `osv-scanner scan source -r .` | อ่าน lockfile ของทุกภาษาในครั้งเดียว ใช้ยืนยันผลข้างบนและจับ Dart · Go · Rust |

**lockfile ต้อง commit เสมอ** (`package-lock.json` · `uv.lock` / `poetry.lock` · `packages.lock.json` · `pubspec.lock`) — ไม่มี lockfile เครื่องแต่ละเครื่องได้เวอร์ชันต่างกัน และตัวสแกนไม่รู้ว่าจริง ๆ ใช้เวอร์ชันไหน

## 2 · จัดกลุ่มตามความเสี่ยงจริง ไม่ใช่ตามป้าย severity ของตัวสแกน

ตอบ 3 คำถามต่อรายการ แล้วลงตาราง `| แพ็กเกจ | เวอร์ชัน | ช่องโหว่ | ใช้ถึงโค้ดที่เสี่ยงไหม | ตรง/ผ่านตัวอื่น | มีเวอร์ชันแก้ไหม | ทำอะไร |`

| คำถาม | ดูจาก | ผลต่อการตัดสิน |
|---|---|---|
| โค้ดเราเรียกถึงฟังก์ชันที่มีช่องโหว่ไหม และ input ไปถึงมันได้จากภายนอกไหม | `grep` ชื่อฟังก์ชันใน advisory · ทางเดินของ input | ไม่ถึง → ลดระดับได้ แต่ต้องจดเหตุผล ไม่ใช่ปิดเงียบ |
| อ้างตรงหรือมาผ่านตัวอื่น (transitive) | `npm ls <pkg>` · `pipdeptree -r -p <pkg>` · `dotnet nuget why <pkg>` | transitive → แก้ที่ตัวแม่ก่อน ถ้าแม่ยังไม่ออกเวอร์ชันใหม่ค่อย override ใน lockfile แล้วจดไว้ว่าต้องถอดเมื่อแม่แก้ |
| มีเวอร์ชันที่แก้แล้วไหม | ช่อง `fixed in` ของ advisory | ไม่มี → หาแพ็กเกจแทน หรือปิดทางเข้าของ input แล้วจดเป็นความเสี่ยงที่ยอมรับใน `decision-log` |

ผลสรุป: **แก้ตอนนี้** (ถึงจริง + มีตัวแก้) · **แก้รอบหน้า** (ถึงไม่ได้ แต่มีตัวแก้) · **ยอมรับความเสี่ยงชั่วคราว** (ไม่มีตัวแก้ — ผู้ใช้ต้องเห็นและตกลง)

## 3 · ลำดับอัปเดต — เล็กก่อน แยกใหญ่ออกมาให้เห็นชัด

1. **patch** ทั้งหมดในรอบเดียว (1.2.3 → 1.2.9) — ตามสัญญา semver ไม่เปลี่ยนพฤติกรรม แต่ยังต้องรัน test
2. **minor** รวมได้ถ้าอยู่ในกลุ่มเดียวกัน (เช่น ชุด `@angular/*` ไปพร้อมกัน) · อ่าน release notes หาคำว่า deprecated
3. **major — 1 PR ต่อ 1 แพ็กเกจ** อ่าน migration guide ก่อน แก้โค้ดตามนั้น แล้วรัน test ทั้งชุด · ห้ามพ่วง major 2 ตัวใน PR เดียว เพราะพังแล้วไม่รู้ว่าตัวไหน
4. แพ็กเกจที่ไม่มีคนดูแลแล้ว (ไม่มี release เกิน 2 ปี · issue ค้างเรื่องความปลอดภัย) → เปิดงานแยกเพื่อหาตัวแทน ไม่ซ่อนไว้ใน PR อัปเดต

ทางอัตโนมัติ: เปิด **Renovate** หรือ **Dependabot** ให้ยื่น PR ตามลำดับข้างบนเอง (ตั้งกลุ่ม patch+minor อัตโนมัติ · major แยก PR · กำหนดวันในสัปดาห์) — คนยังต้องอ่าน release notes และ merge เอง ไม่ auto-merge major

## 4 · พิสูจน์ก่อนปิดรายการ

- test ทั้งชุดเขียว และ build ผ่านจากเครื่องเปล่าด้วย lockfile ที่ commit แล้ว
- **เดินทางเดิมของช่องโหว่อีกครั้ง** — ถ้า advisory บอกว่า input รูปแบบ X ทำให้พัง ให้ส่ง X เข้าไปจริง (ใน sandbox) แล้วดูว่าไม่พัง · เขียนเป็น test ถ้าทำได้ เพื่อไม่ให้ถอยกลับตอนมีคน downgrade
- รันตัวสแกนข้อ 1 ซ้ำ รายการนั้นต้องหายไป ไม่ใช่แค่เปลี่ยนเวอร์ชันในไฟล์

## 5 · บันทึก

- `CHANGELOG.md` ใต้หัวข้อ Security: แพ็กเกจ · จาก → ไป · รหัสช่องโหว่ (CVE หรือ GHSA) · 1 บรรทัดว่าเราถึงช่องโหว่นั้นไหม
- รายการที่ยอมรับความเสี่ยงหรือ override ใน lockfile → `decision-log` พร้อมวันที่ต้องกลับมาดู
- รายงาน gate ของรอบนั้น (`qa/security/<วัน>-gate.md`) ชี้มาที่ CHANGELOG แทนการเขียนซ้ำ


---

# skill: owasp-top10

Use when building or handing over a web app or API that must meet OWASP Top 10:2025 (contract, security NFR, release).

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


## reference: contract-clause.md

# ข้อกำหนด OWASP Top 10:2025 ในสัญญาและ SRS

ร่างนี้ใช้เป็นจุดเริ่ม ไม่ใช่คำแนะนำทางกฎหมาย · สัญญาจริงให้ `legal-compliance-officer` หรือทนายของผู้ว่าจ้างตรวจ · ร่างสัญญาภาษาไทยทั้งฉบับใช้ `e-commerce:doc-contract-th`

## ทำไมต้องเขียนให้วัดได้

"ระบบต้องปลอดภัยตาม OWASP" วัดไม่ได้ แล้วจะเถียงกันตอนส่งมอบ · ให้เขียนเป็น **เกณฑ์รับงาน** ที่ตรวจได้ทีละข้อ และบอกขอบเขตที่ไม่รวม

## ร่างข้อกำหนด (ภาษาไทย)

> **ข้อ X ความปลอดภัยของระบบ**
>
> X.1 ผู้รับจ้างจะพัฒนาระบบโดยมีมาตรการรองรับความเสี่ยงทั้ง 10 ข้อของ Open Worldwide Application Security Project (OWASP) Top 10 ฉบับปี 2025 (A01 ถึง A10)
>
> X.2 ก่อนส่งมอบแต่ละงวด ผู้รับจ้างจะส่งรายงานผลการตรวจ OWASP Top 10:2025 ซึ่งระบุ สำหรับแต่ละข้อ (ก) มาตรการที่ใช้ (ข) วิธีตรวจและเครื่องมือที่ใช้ (ค) หลักฐานผลการตรวจ และ (ง) สถานะ ผ่าน · ผ่านโดยการตรวจเอกสารหรือการตั้งค่าพร้อมระบุไฟล์ที่ตรวจ (สำหรับข้อที่ทดสอบอัตโนมัติไม่ได้) · ไม่ผ่าน · ไม่เกี่ยวข้องพร้อมเหตุผล · ยอมรับความเสี่ยงตามข้อ X.4 · ยังไม่ได้ตรวจพร้อมเหตุผล
>
> X.3 งวดงานจะถือว่าผ่านเกณฑ์ด้านความปลอดภัยเมื่อ (ก) ไม่มีข้อใดมีสถานะไม่ผ่าน (ข) ไม่มีข้อใดมีสถานะยังไม่ได้ตรวจ และ (ค) ไม่มีช่องโหว่ระดับวิกฤต (Critical) หรือสูง (High) ที่ยืนยันแล้วค้างอยู่ในโค้ดหรือไลบรารีที่ใช้ ณ วันส่งมอบ โดยวัดระดับตามคะแนน Common Vulnerability Scoring System (CVSS) รุ่น 3.1 ขึ้นไป ที่เครื่องมือตรวจในภาคผนวกรายงาน · ช่องโหว่ที่ยังไม่มีเวอร์ชันแก้ไขจากผู้พัฒนาไลบรารี ผู้รับจ้างจะแจ้งพร้อมมาตรการบรรเทา แล้วให้ใช้ข้อ X.4
>
> X.4 ข้อใดที่ผู้ว่าจ้างตกลงยอมรับความเสี่ยง ให้บันทึกเป็นลายลักษณ์อักษร พร้อมชื่อผู้อนุมัติและวันที่
>
> X.5 ขอบเขตนี้ไม่รวม (ก) การทดสอบเจาะระบบ (penetration test) โดยบุคคลภายนอก เว้นแต่ตกลงไว้ในภาคผนวก (ข) โครงสร้างพื้นฐานและเซิร์ฟเวอร์ที่ผู้ว่าจ้างจัดหาและดูแลเอง (ค) ช่องโหว่ที่ประกาศหลังวันส่งมอบ ซึ่งให้เป็นไปตามข้อตกลงการดูแลรักษาระบบ (ถ้ามี)
>
> X.6 การตรวจตามข้อนี้ไม่ใช่การรับรองว่าระบบปลอดภัยโดยสมบูรณ์

## ร่างใน SRS — หมวดความต้องการที่ไม่ใช่ฟังก์ชัน ด้านความปลอดภัย (Non-Functional Requirement (NFR))

| รหัส | ความต้องการ | วิธีตรวจรับ |
|---|---|---|
| NFR-SEC-01 | ระบบรองรับ OWASP Top 10:2025 ครบ A01–A10 | รายงานผลการตรวจตามข้อ X.2 ผ่านเกณฑ์ข้อ X.3 |
| NFR-SEC-02 | ทุก endpoint ตรวจสิทธิ์ฝั่ง server และผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตน | ชุด test ด้านสิทธิ์ (A01) ผ่านทั้งหมด |
| NFR-SEC-03 | ไม่มี dependency ที่มีช่องโหว่ระดับ critical หรือ high (ตาม CVSS) ณ วันส่งมอบ ยกเว้นตามข้อ X.3 | ผลสแกน dependency ในภาคผนวกรายงาน |
| NFR-SEC-04 | admin และธุรกรรมเงินใช้การยืนยันตัวตนหลายชั้น (MFA) | ชุด test ด้าน login (A07) |
| NFR-SEC-05 | เหตุการณ์ความปลอดภัยมี log และแจ้งเตือน | ชุด test ด้าน log (A09) + ตัวอย่าง log |

เพิ่มหรือตัดแถวตามระบบ · ทุกแถวต้องมี "วิธีตรวจรับ" ที่ทำได้จริง


## reference: stack-checks.md

# OWASP Top 10:2025 ตาม stack ที่ทีมใช้

เปิดไฟล์นี้ตอนเขียนโค้ดและตอนกรอกรายงาน · แต่ละข้อบอก "ใช้อะไร" และ "อย่าทำ" · ค่าเริ่มของ framework ที่ปลอดภัยอยู่แล้ว ให้ใช้ตามนั้น ไม่เขียนเอง

- [.NET / ASP.NET Core](#net--aspnet-core)
- [TypeScript · Node · Angular](#typescript--node--angular)
- [Python (FastAPI · Django · Flask)](#python-fastapi--django--flask)
- [SQL (SQL Server · PostgreSQL · MySQL)](#sql-sql-server--postgresql--mysql)
- [เครื่องมือที่ใช้พิสูจน์](#เครื่องมือที่ใช้พิสูจน์)

---

## .NET / ASP.NET Core

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | `FallbackPolicy` = ต้อง login ทุก endpoint แล้วเปิดเฉพาะที่ตั้งใจด้วย `[AllowAnonymous]` · ตรวจเจ้าของ record ด้วย `IAuthorizationService` + resource-based policy · ASP.NET MVC แบบเก่าใช้ `[Authorize]` ระดับ controller + filter กลาง · antiforgery token ทุก form (`[ValidateAntiForgeryToken]` หรือ `AutoValidateAntiforgeryTokenAttribute` ทั้งแอป) · รับ input ผ่าน ViewModel หรือ DTO ไม่ bind entity ตรง | ซ่อนปุ่มใน view แล้วถือว่าคุมสิทธิ์แล้ว · ใช้ id จาก URL ค้น DB โดยไม่กรองด้วย user |
| A02 | `app.UseExceptionHandler` + `UseHsts` ใน production · `customErrors mode="RemoteOnly"` (MVC เก่า) · ลบ header `Server` · `X-Powered-By` | เปิด `UseDeveloperExceptionPage` บน production · เก็บ connection string ใน `appsettings.json` ที่ commit |
| A03 | `dotnet list package --vulnerable --include-transitive` · `Directory.Packages.props` คุมเวอร์ชันที่เดียว · SBOM: `dotnet CycloneDX` | ใช้แพ็กเกจที่ไม่มีคนดูแลแล้ว (ดูวันออกล่าสุด) |
| A04 | ASP.NET Core Identity (PBKDF2) หรือ `Rfc2898DeriveBytes.Pbkdf2` · Data Protection API สำหรับค่าที่ต้องถอดกลับ · ค่าลับใน User Secrets หรือ Key Vault | `MD5` · `SHA1` · `DES` · เขียน crypto เอง |
| A05 | EF Core LINQ · `FromSqlInterpolated` · Dapper พร้อม parameter · Razor encode HTML ให้เอง | `FromSqlRaw` ต่อสตริง · `Html.Raw` กับข้อมูลผู้ใช้ · `Process.Start` กับ input |
| A07 | Identity: `Lockout.MaxFailedAccessAttempts` + `PasswordSignInAsync(..., lockoutOnFailure: true)` (หน้า Login ที่ scaffold มาตั้งเป็น false) · cookie `HttpOnly` `Secure` `SameSite` · JWT: ตั้ง `ValidateIssuer` `ValidateAudience` `ValidateLifetime` `ValidateIssuerSigningKey` = true | `ValidateLifetime = false` · รับ algorithm `none` |
| A08 | `System.Text.Json` · webhook ตรวจลายเซ็น Hash-based Message Authentication Code (HMAC) ด้วย `CryptographicOperations.FixedTimeEquals` | `BinaryFormatter` · `TypeNameHandling.All` ของ Newtonsoft |
| A09 | `ILogger` แบบ structured (Serilog) · log ผล login · ถูกปฏิเสธสิทธิ์ · ตัดค่าลับด้วย destructuring policy | log ทั้ง request body ที่มีรหัสผ่าน |
| A10 | ตัวจับกลาง `IExceptionHandler` (.NET 8 ขึ้นไป · ลงทะเบียน `AddExceptionHandler<T>()` + `AddProblemDetails()` **และ** ต้องมี `app.UseExceptionHandler()` ใน pipeline ไม่งั้นตัวจับไม่ทำงาน) คืน `ProblemDetails` · .NET เก่ากว่าใช้ `UseExceptionHandler` กับ lambda หรือ path · `TransactionScope` หรือ `BeginTransaction` ครอบงานหลายขั้น · `CancellationToken` + timeout ของ `HttpClient` | `catch { }` ว่าง · `catch` แล้วคืน `true` จากตัวตรวจสิทธิ์ |

## TypeScript · Node · Angular

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | middleware ตรวจสิทธิ์ตัวเดียวที่ router ระดับบน (ปฏิเสธเป็นค่าเริ่ม) · query กรองด้วย `userId` ของ session ทุกครั้ง · Angular route guard ใช้แค่ซ่อนหน้า ส่วนสิทธิ์จริงตรวจที่ API · SSRF: allowlist host ก่อน `fetch` URL ที่ผู้ใช้ส่ง · CSRF token เมื่อใช้ cookie session · ตรวจ body ด้วย schema (zod) แล้วหยิบเฉพาะฟิลด์ที่อนุญาต | เชื่อ `role` ที่ client ส่งมา · `Object.assign(entity, req.body)` · `cors({ origin: true, credentials: true })` |
| A02 | `helmet()` · `NODE_ENV=production` · ปิด source map ใน production build · Express `app.disable("x-powered-by")` | ส่ง `err.stack` กลับ client |
| A03 | `npm ci` + `package-lock.json` · `npm audit --omit=dev` · SBOM: `npx @cyclonedx/cyclonedx-npm` · ตรวจ `postinstall` ของแพ็กเกจใหม่ | `npm install` แพ็กเกจที่ชื่อคล้ายของดัง (typosquat) โดยไม่ดูผู้ดูแล |
| A04 | `argon2` หรือ `bcrypt` · `crypto.randomBytes` · `crypto.timingSafeEqual` | `Math.random()` ทำ token · `crypto.createHash("md5")` กับรหัสผ่าน |
| A05 | ORM (Prisma · TypeORM) หรือ parameter `$1` · Angular escape ให้เอง · `execFile` พร้อม argument เป็น array | `innerHTML` · `bypassSecurityTrustHtml` กับข้อมูลผู้ใช้ · `eval` · `exec` ต่อสตริง · `new Function` |
| A07 | `express-rate-limit` ที่ `/login` · cookie `httpOnly` `secure` `sameSite` · JWT: `jwt.verify(token, key, { algorithms: ["RS256"], issuer, audience })` (ระบุ algorithm ที่ใช้จริงตายตัว) | เก็บ token ใน `localStorage` ของระบบที่มีข้อมูลอ่อนไหว · `jwt.decode` แทน `verify` |
| A08 | ตรวจลายเซ็น webhook ก่อน `JSON.parse` · Subresource Integrity (SRI) กับ script จาก CDN | `node-serialize` · โหลด script จาก CDN โดยไม่มี `integrity` |
| A09 | pino หรือ winston แบบ JSON · `redact: ["req.headers.authorization", "*.password"]` | `console.log(req.body)` |
| A10 | Express error middleware ตัวสุดท้าย · `process.on("unhandledRejection")` log แล้วปิดอย่างเป็นระเบียบ · transaction ของ ORM · `AbortSignal.timeout()` กับ `fetch` | `.catch(() => {})` · promise ที่ไม่มีใคร await |

## Python (FastAPI · Django · Flask)

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | FastAPI `Depends(current_user)` ระดับ router · Django `LoginRequiredMixin` + `get_object_or_404(Model, pk=..., owner=request.user)` · SSRF: allowlist host ก่อน `httpx.get` · Django CSRF middleware เปิดไว้ · รับ input ด้วย Pydantic model หรือ Django `ModelForm(fields=[...])` | `Model.objects.get(pk=id)` โดยไม่กรองเจ้าของ · `fields = "__all__"` · `@csrf_exempt` ทั้ง view โดยไม่มีเหตุผล |
| A02 | Django `DEBUG=False` · `SECURE_*` settings · `python manage.py check --deploy` · FastAPI ปิด `/docs` บน production ถ้าไม่ได้ตั้งใจเปิด | `DEBUG=True` · `ALLOWED_HOSTS=["*"]` |
| A03 | lockfile (`uv.lock` · `poetry.lock` · `requirements.txt` ที่ pin เวอร์ชัน + `--require-hashes`) · `pip-audit` · SBOM: `cyclonedx-py environment` (หรือ `requirements` · `poetry`) | `pip install` จาก URL ที่ไม่รู้จัก |
| A04 | `argon2-cffi` · Django password hasher ค่าเริ่ม · `secrets.token_urlsafe` · `hmac.compare_digest` | `hashlib.md5(password)` · `random` ทำ token |
| A05 | ORM หรือ `cursor.execute(sql, params)` · Jinja2 `autoescape=True` · `subprocess.run([...])` แบบ list | f-string ใน SQL · `shell=True` กับ input · `eval` |
| A07 | `slowapi` หรือ django-axes กัน login รัว · PyJWT: `jwt.decode(token, key, algorithms=["RS256"], audience=..., issuer=...)` (ระบุ algorithm ที่ใช้จริงตายตัว) | `jwt.decode(..., options={"verify_signature": False})` |
| A08 | ตรวจลายเซ็น webhook ด้วย `hmac.compare_digest` · `yaml.safe_load` · `json` | `pickle.loads` · `yaml.load` กับข้อมูลภายนอก |
| A09 | `logging` แบบ structured (structlog) · filter ตัดค่าลับ | log `request.headers` ทั้งก้อน |
| A10 | FastAPI `@app.exception_handler(Exception)` · Django `handler500` · `with transaction.atomic():` · timeout ทุกการเรียก `httpx` | `except Exception: pass` · ตัวตรวจสิทธิ์ที่ `except` แล้ว `return True` |

## SQL (SQL Server · PostgreSQL · MySQL)

| ข้อ | ใช้อะไร | อย่าทำ |
|---|---|---|
| A01 | user ของแอปมีสิทธิ์เท่าที่ใช้ (ไม่ใช่ `sa` · `postgres` · `root`) · แยก user อ่านอย่างเดียวสำหรับรายงาน · Row-Level Security (RLS) ของ PostgreSQL หรือ SQL Server สำหรับระบบหลายลูกค้า (multi-tenant) | ให้แอปใช้ user เจ้าของ database |
| A02 | ปิด port DB จากภายนอก · บังคับ TLS ของการเชื่อมต่อ · ปิด `xp_cmdshell` | เปิด DB ออก internet |
| A04 | Transparent Data Encryption (TDE) หรือเข้ารหัสระดับดิสก์ · คอลัมน์อ่อนไหวเข้ารหัสระดับแอป หรือ Always Encrypted · backup เข้ารหัส | เก็บเลขบัตรประชาชน · เลขบัตรเครดิตเป็นข้อความเปล่า |
| A05 | stored procedure หรือ query ที่รับ parameter · ถ้าต้องสร้าง SQL แบบ dynamic ใช้ `sp_executesql` พร้อม parameter และ `QUOTENAME` กับชื่อ object | `EXEC('... ' + @input)` · ต่อชื่อตารางจาก input |
| A09 | audit ตารางเงินและสิทธิ์ (trigger หรือ temporal table) · log login ล้มของ DB | ปิด audit เพื่อให้เร็ว |
| A10 | `BEGIN TRY ... BEGIN CATCH ... ROLLBACK` · `SET XACT_ABORT ON` · migration รันซ้ำได้ (`IF NOT EXISTS`) | migration ที่ล้มกลางทางแล้วทิ้งตารางครึ่ง ๆ |

## เครื่องมือที่ใช้พิสูจน์

| ใช้ทำอะไร | เครื่องมือ | ครอบข้อ |
|---|---|---|
| ค่าลับ · dependency · โค้ดเสี่ยง · ไฟล์ตั้งค่าโครงสร้างพื้นฐาน (Infrastructure as Code (IaC)) | ตาม [`security-gate`](../../security-gate/SKILL.md) (gitleaks · npm audit · pip-audit · dotnet · osv-scanner · trivy · semgrep) | A02 · A03 · A04 · A05 · A08 |
| semgrep ชุดเฉพาะ OWASP | `semgrep scan --config p/owasp-top-ten --metrics=off` (ต้องมีเน็ต) · ออฟไลน์ใช้ชุดของ `security-gate` | A01 · A04 · A05 · A08 |
| สแกนแอปที่รันอยู่ (header · cookie · error page) | OWASP ZAP (Zed Attack Proxy) baseline กับ environment ทดสอบของโปรเจกต์เท่านั้น: `docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t <URL ทดสอบ>` | A02 · A05 · A07 |
| SBOM | CycloneDX ตามภาษา (ข้างบน) เก็บที่ `qa/security/sbom/` | A03 |
| test สิทธิ์ · login · error · webhook | integration test ของโปรเจกต์ ตั้งชื่อขึ้นต้นด้วยรหัสข้อ (`A01_...`) | A01 · A06 · A07 · A08 · A09 · A10 |

- ZAP ยิงจริง → ใช้กับ environment ทดสอบที่ทีม deploy เองเท่านั้น ห้ามยิง production หรือระบบของคนอื่นโดยไม่มีหนังสืออนุญาต
- เครื่องมือไหนรันไม่ได้ ให้เขียน `ยังไม่ได้ตรวจ` พร้อมเหตุผลในรายงาน ห้ามสรุปว่าผ่านจากผลว่าง


---

# skill: markdown-visuals

Use when a markdown doc needs a picture. Pick inline SVG, image file, ASCII or Mermaid by where it is read (GitHub drops inline SVG).

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-company`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-company`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-company`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-company`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-company`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม (ลำดับใน `diagram-figures` ข้อ 5 · ตารางโทนตามเนื้องาน [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams` (plugin `software-company`) ข้อ 1–5 และ `assets/mermaid-theme.md`** · Mermaid ในเอกสารโปรเจกต์ที่ต้องแปลงเป็นรูปลง Word ใช้ตัวแปลงใน `diagram-figures` → `references/engine-mermaid.md`
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ถ้าต้องคุมตำแหน่งเองให้ใช้ inline SVG ส่วนรูปที่ต้องดูออกแบบมาให้ใช้ `diagram-figures` (HTML layout หรือ engine-svg-python) แล้วฝังเป็นไฟล์ภาพ |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง ให้ใช้ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ ให้ใช้ไฟล์ภาพ |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- ❌ **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Preview it in the viewer the reader will use (GitHub, Notion, VS Code) before delivery.

## Related skills

- `polished-document-style` — overall doc formatting, figure captions, callout boxes
- `simplicity-first` (plugin `software-company`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-company`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-company`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

ก่อนส่ง ไล่ข้อ 3 ของ `no-ai-look` — งาน HTML รันสคริปต์ของมัน · ภาพและไฟล์อื่นดูด้วยตา 8 ข้อ · ข้อห้ามในไฟล์นี้เป็นส่วนเฉพาะของงานนี้ รายการเต็มทุกสื่ออยู่ที่นั่น

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น
ถ้ายังไม่มี ให้ใช้ค่าประจำบ้าน `#2A78D6` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม และเสนอโทนจากเนื้องานไว้ในรายงาน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีแบรนด์** (ไม่มี → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**1 เอกสารใช้ชุดสีเดียว** — รูป 10 รูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปไม่สวยแต่สีตรงกัน

## Snippets

> ตัวอย่างข้างล่างใช้ชุดสีโหมดมืดชุดหนึ่งเป็นตัวแทนเท่านั้น
> **เปลี่ยนค่าสีให้ตรงกับชุดที่ตกลงไว้ก่อนใช้** โครงสร้างคือสิ่งที่ต้องคัดลอก ไม่ใช่ค่าสี

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).


---

# skill: web-service-essentials

Use when building or reviewing any HTTP service or backend (health endpoints, RFC 9457 errors).

# Web Service Essentials

> **กฎข้อเดียว:** ก่อนเขียน endpoint ธุรกิจตัวแรก service ต้องตอบได้ว่า
> "ยังอยู่ไหม · พร้อมรับงานไหม · ตอนนี้รันเวอร์ชันอะไร" ถ้าตอบไม่ได้ วันที่ระบบล่มคุณจะต้องเดาล้วน ๆ

## เมื่อไหร่ใช้ skill นี้

- เริ่ม service / REST API / microservice ใหม่
- มีคนขอ health check, ping, readiness, liveness, version endpoint
- จะ deploy ขึ้น production ครั้งแรก หรือย้ายเข้า Docker/Kubernetes
- ต้องกำหนดรูปแบบ error ของ API ให้เหมือนกันทั้งระบบ

## เมื่อไหร่ **ไม่** ใช้

- ออกแบบ endpoint ทางธุรกิจ ให้ใช้ command `/api-design`
- รูปแบบ URL · paging · วันที่ · id ของ API ให้ใช้ `api-conventions`
- รูปแบบ log ให้ใช้ `logging-standards`
- เลือกสถาปัตยกรรม ให้ใช้ `architecture-patterns`

---

## 1 · endpoint พื้นฐาน 4 ตัว

| Endpoint | ตอบอะไร | auth | เช็ค dependency | ใครเรียก |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | ไม่ | ไม่ | load balancer ทุกวินาที |
| `GET /health/live` | process ยังอยู่ | ไม่ | **ไม่** | orchestrator (restart ถ้าตาย) |
| `GET /health/ready` | พร้อมรับ traffic | ไม่ | ใช่ | orchestrator (ตัดออกจาก pool) |
| `GET /version` | รันอะไรอยู่ | ไม่* | ไม่ | คน ตอนไล่ปัญหา |

> 🚨 **live ห้ามเช็ค dependency** นี่คือความผิดพลาดที่เจอบ่อยที่สุด
> ถ้า `/health/live` เช็คฐานข้อมูล (database · DB) แล้ว DB ล่มชั่วคราว Kubernetes จะ**ฆ่า pod ทิ้งทั้งหมด**
> ทั้งที่แอปยังปกติดี พอ DB กลับมาก็ไม่มี pod เหลือรับ traffic แล้ว
> การเช็ค dependency ต้องอยู่ที่ `/health/ready` ซึ่งแค่ตัด pod ออกจาก pool ชั่วคราว

\* ถ้าไม่อยากให้คนทั่วไปเห็น commit hash ใน `/version` ให้จำกัดให้เรียกได้เฉพาะเครือข่ายภายใน

**ผูกกับ Kubernetes แบบนี้** (ปรับจาก secondsky `health-check-endpoints` · MIT) — live กับ ready ต้องชี้คนละ path ไม่งั้นข้อข้างบนไร้ความหมาย

```yaml
livenessProbe:            # ตาย → restart container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # ให้แอปขึ้นก่อน ไม่งั้นโดนฆ่าตั้งแต่ยังไม่ทัน listen
  periodSeconds: 10
  failureThreshold: 3     # พลาด 3 ครั้งติด (30 วินาที) ค่อย restart
readinessProbe:           # ไม่พร้อม → ตัดออกจาก Service ชั่วคราว ไม่ restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

แอปที่ warm-up นาน (โหลดโมเดล · cache ใหญ่) เพิ่ม `startupProbe` ชี้ `/health/live` พร้อม `failureThreshold` สูง แทนการยืด `initialDelaySeconds` ของ liveness

### รูปร่าง response (เหมือนกันทุกภาษา)

```jsonc
// GET /health/ready → 200 ปกติ · 503 เมื่อ dependency ที่ critical ล่ม
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 สถานะ ไม่ใช่ 2:**
- `up` — ทุกอย่างปกติ → 200
- `degraded` — dependency ที่**ไม่ critical** ล่ม (เช่น อีเมล) แต่ยังรับ traffic ได้ → 200
- `down` — dependency ที่ critical ล่ม (เช่น DB) → **503**

**ทุก check ต้องมี timeout** (ค่าเริ่มต้น 3 วินาที) ไม่งั้น dependency ที่ค้าง
จะทำให้ health endpoint ค้างตาม แล้ว orchestrator ตัดสินใจผิดทั้งระบบ

**ห้ามส่ง stack trace หรือ connection string ออกทาง endpoint นี้** เพราะ endpoint นี้ใครก็เรียกได้

---

## 2 · รูปแบบ error ที่เหมือนกันทั้งระบบ

ยึด **RFC 9457 (`application/problem+json`)** ซึ่งเป็นมาตรฐานจริง ไม่ต้องคิดเอง

```jsonc
// 422 — รูปแบบถูก แต่ข้อมูลไม่ผ่านกฎ (ดูตารางล่าง)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // ตรงกับ cid ใน log — ตามเรื่องได้ทันที
  "errors": [                           // เฉพาะ validation · ครบทุกฟิลด์ในครั้งเดียว
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` เป็นเส้นทางเต็มรวมดัชนีอาเรย์ · `code` ให้โปรแกรมอ่าน · `message` ให้คนอ่าน

| สถานะ | ใช้เมื่อ |
|---|---|
| 400 | ข้อมูลผิดรูป |
| 401 | ยังไม่ได้ยืนยันตัวตน |
| 403 | ยืนยันแล้วแต่ไม่มีสิทธิ์ |
| 404 | ไม่มีสิ่งนี้ |
| 409 | ชนกับสถานะปัจจุบัน (ซ้ำ, แก้ทับ) |
| 422 | รูปแบบถูกแต่ผิดกฎธุรกิจ |
| 429 | เรียกถี่เกิน — ต้องมี `Retry-After` |
| 500 | ฝั่งเราพัง — **ห้ามส่งรายละเอียดภายในออกไป** ส่ง `requestId` แทน |

> **500 ต้องบอกแค่ "เกิดข้อผิดพลาด กรุณาแจ้ง requestId นี้"** รายละเอียดจริงอยู่ใน log
> การส่ง stack trace ออกไปก็เหมือนแจกแผนผังระบบให้คนที่กำลังหาช่องโจมตี

---

## 3 · Request id

- รับจาก header **`X-Request-Id`** เฉพาะเมื่อตรง `^[A-Za-z0-9-]{1,64}$` · ไม่มีหรือไม่ตรง → สร้างใหม่ (uuid ตัด 8 ตัว)
  ค่านี้ลงทุกบรรทัด log ถ้ารับมาตรง ๆ ผู้ส่งจะแทรกขึ้นบรรทัดใหม่หรือข้อความปลอมลง log ได้ (log injection)
- **ส่งกลับใน response header ทุกครั้ง** รวมทั้งตอน error
- ใส่ในทุกบรรทัด log (ดู `logging-standards`) และใน error body
- ส่งต่อไป service ปลายทางทุกครั้งที่เรียกข้ามระบบ

พอลูกค้าโทรมาบอกว่า "มันพัง" ก็ขอ requestId แล้ว `grep` ครั้งเดียวเจอทั้งเรื่อง

---

## 4 · Graceful shutdown

ตอน deploy ใหม่ orchestrator จะส่ง `SIGTERM` มา ถ้าแอปตายทันที request ที่ทำอยู่จะขาดกลางคัน

```
SIGTERM → 1. หยุดรับ request ใหม่ (ให้ /health/ready ตอบ down ทันที)
          2. รอ request ที่ค้างอยู่ทำงานจบ (timeout 15–30 วิ)
          3. ปิด DB pool / คิว / ไฟล์
          4. exit(0)
```

> ข้อ 1 สำคัญกว่าที่คิด ต้องให้ `/health/ready` ตอบ `down` **ก่อน** ปิดจริงสัก 5 วินาที
> เพื่อให้ load balancer ตัดเราออกจาก pool ทัน ไม่งั้นยังมี traffic วิ่งเข้ามาตอนกำลังปิด

---

## 5 · สิ่งที่ต้องมีก่อน deploy (ไม่ใช่ทางเลือก)

- **Timeout ทุกทาง** ทั้ง request เข้า การเรียกออก และ query DB ถ้าไม่มี timeout ปลายทางช้าเมื่อไร ทั้งระบบจะค้างตาม
- **จำกัดขนาด body** (เช่น 1MB) เพื่อกัน memory ระเบิดจาก payload ใหญ่
- **Cross-Origin Resource Sharing (CORS) ระบุ origin ชัดเจน** — `*` ใช้ได้เฉพาะ API สาธารณะที่ไม่มี cookie
- **Rate limit** อย่างน้อยที่ endpoint ล็อกอินและที่ที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)/อีเมล
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (ตัวแทนของ `X-Frame-Options` ที่เป็น header รุ่นเก่า · ใส่ `X-Frame-Options: DENY` คู่ไว้ให้เบราว์เซอร์เก่า) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` ตั้งครบในบรรทัดเดียว · .NET: `UseHsts()` ตั้งแค่ HSTS ที่เหลือต้องเขียน middleware สั้น ๆ หรือใช้แพ็กเกจ `NetEscapades.AspNetCore.SecurityHeaders` (ตัวอย่างใน `references/per-stack.md`)
- **ปิดหน้าโชว์ error เต็ม ๆ ใน production** (`app.UseDeveloperExceptionPage()` เฉพาะ dev)
- **ตั้งเวอร์ชันไว้ใน path**: `/api/v1/...` ตั้งแต่วันแรก เพราะย้ายทีหลังแพงกว่ามาก
- **OpenAPI** ที่ generate จากโค้ดจริง ไม่ใช่เขียนมือแล้วลืมอัปเดต

---

## 6 · โค้ดที่พร้อมใช้

| ไฟล์ | สแต็ก | สถานะ |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✅ รันทดสอบครบทั้ง 4 endpoint + เคส degraded/down/timeout |
| `assets/health_py.py` | Python / FastAPI | ✅ รันทดสอบครบเหมือนกัน ผลตรงกันทุก field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | ⚠️ ยังไม่ได้คอมไพล์ทดสอบ |

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```

---

## 7 · ตรวจงาน

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# ปิด DB แล้วยิงซ้ำ — ready ต้องเป็น 503 แต่ live ต้องยัง 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` **ไม่** แตะ DB — ปิด DB แล้วยังตอบ 200
- [ ] `/health/ready` ตอบ 503 เมื่อ dependency ที่ critical ล่ม
- [ ] dependency ที่ไม่ critical ล่มแล้วได้ `degraded` + 200 (ยังรับ traffic)
- [ ] ทุก check มี timeout — ลองทำให้ dependency ค้าง แล้ว endpoint ต้องตอบภายใน ~3 วิ
- [ ] `/version` ตรงกับ commit ที่ deploy จริง
- [ ] ทุก response มี `X-Request-Id` รวมทั้งตอน 500
- [ ] ยิง 500 แล้วไม่มี stack trace / connection string หลุดออกมา
- [ ] `SIGTERM` แล้ว request ที่ค้างอยู่ทำงานจบก่อนแอปปิด
- [ ] `/ping` ไม่ถูกเขียนลง log (ไม่งั้นไฟล์เต็มไปด้วย ping)

---

## 8 · Anti-patterns

- ❌ **`/health` ตัวเดียวเช็คทุกอย่าง** — orchestrator แยกไม่ออกว่าควร restart หรือแค่ตัด traffic
- ❌ **liveness เช็ค DB** — DB สะดุด 10 วินาที = pod ตายยกแถว
- ❌ **health check ไม่มี timeout** — dependency ค้าง แล้ว health ค้างตาม
- ❌ **ส่ง stack trace / connection string ใน health หรือ error 500**
- ❌ **health ต้อง login** — orchestrator ไม่มี token ให้
- ❌ **รูปแบบ error ต่างกันทุก endpoint** — client ต้องเขียนโค้ดแกะ 5 แบบ
- ❌ **`/ping` เขียนลง log** — ทุกวินาที × 86400 = ขยะเต็มไฟล์
- ❌ **ไม่มี graceful shutdown** — deploy ทีไรลูกค้าเจอ error ทุกที
- ❌ **`Access-Control-Allow-Origin: *` คู่กับ cookie** — เปิดช่องให้เว็บอื่นยิงแทนผู้ใช้

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| test ให้ endpoint พวกนี้ | `testing-standards` |
| ตรวจ response ตรงกับ OpenAPI ใน CI · contract กับทีม frontend · เช็ค breaking change | `api-conventions` [`references/contract-testing.md`](../api-conventions/references/contract-testing.md) |
| ออกแบบ endpoint ธุรกิจ | command `/api-design` |
| runbook ตอน service ล่ม | `incident-runbook-template` |
| ตรวจความปลอดภัย | `security-engineer` + command `/security-scan` |


## reference: per-stack.md

# .NET และ Angular

> ⚠️ โค้ดในไฟล์นี้ **ยังไม่ได้คอมไพล์ทดสอบ** (ต่างจาก `assets/health.node.js` และ
> `assets/health_py.py` ที่รันจริงครบทุก endpoint แล้ว) โค้ดนี้เป็นการตั้งค่ามาตรฐานของ
> ASP.NET Core ตอนรันครั้งแรกให้เทียบ response กับรูปร่างใน SKILL.md ข้อ 1

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

ให้ response ตรงรูปแบบเดียวกับสแต็กอื่น:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core มี `ProblemDetails` มาให้อยู่แล้ว ให้ใช้ของที่มี อย่าประดิษฐ์รูปแบบเอง

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

ให้ `/health/ready` ตอบ down ก่อนปิดจริงสักพัก เพื่อให้ load balancer ตัดเราออกจาก pool ทัน
ใช้ `IHostedLifecycleService.StoppingAsync` (.NET 8 ขึ้นไป) เพราะ host เรียกมัน**ก่อน**หยุด Kestrel (หลัง `ApplicationStopping`)
จึงรอแบบ `await Task.Delay` ได้โดยไม่บล็อกเธรด และ server ยังตอบ 503 ให้ load balancer เห็น

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

ลำดับตอนปิดของ host (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` ของ hosted service (รวม Kestrel) → `StoppedAsync` → `ApplicationStopped` — ตามหน้า .NET Generic Host ที่ learn.microsoft.com (ตรวจ 22 ต.ค. 2569)

### สิ่งที่ต้องเปิดก่อน deploy

ลงทะเบียน service ได้**ก่อน** `builder.Build()` เท่านั้น — หลัง Build รายการ service เป็นแบบอ่านอย่างเดียว เรียก `builder.Services.Add…` ตอนนั้นจะได้ `InvalidOperationException` ตอนเริ่มแอป

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

ไม่อยากเขียน middleware เอง → แพ็กเกจ `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) ตั้งชุด header พื้นฐานให้ครบ

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `logging-standards`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**แกะ problem+json ให้เป็นข้อความที่ผู้ใช้อ่านรู้เรื่อง**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**หน้าสถานะระบบ** ให้ทีมซัพพอร์ตเปิดดูเองได้โดยไม่ต้องเรียกนักพัฒนา:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |


---

# skill: api-conventions

Use when starting an API, adding endpoints or checking API consistency (URLs, paging, dates, ids).

# ข้อตกลงของ Application Programming Interface (API)

> **กฎข้อเดียว:** ตัดสินใจครั้งเดียว ใช้ทุก endpoint
> API ที่ทุก endpoint ทำเหมือนกัน แม้ "ไม่ค่อยถูกตามทฤษฎี" ใช้ง่ายกว่า
> API ที่แต่ละ endpoint ถูกต้องคนละแบบ เพราะแบบหลังฝั่งเรียกต้องเดาใหม่ทุกครั้ง

## เมื่อไหร่ใช้ skill นี้

- เริ่มออกแบบ API ตัวแรกของโปรเจกต์
- จะเพิ่ม endpoint ใน API เดิม และอยากให้เข้ากับของเดิม
- รีวิว API แล้วรู้สึกว่าแต่ละส่วนไม่เหมือนกัน
- ต้องตอบว่า "เปลี่ยนแบบนี้แล้ว client พังไหม"

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ ให้ครบ | command `/api-design` | แทน |
| health check, error envelope, graceful shutdown | `web-service-essentials` | แทน |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` | แทน |
| token, scope, สิทธิ์ | `auth-implementation-patterns` | แทน |
| correlation id ที่โผล่ใน error | `logging-standards` | คู่ |
| test สัญญาระหว่างระบบ | `testing-standards` | คู่ |
| บันทึกเหตุผลที่เลือกข้อตกลงนี้ | `adr-writer` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**แม่แบบเอกสารข้อตกลงที่คัดลอกไปใช้ได้เลย** → `assets/API-CONVENTIONS.md`

---

## 1 · เอกสารข้อตกลงต้องมีจริง

วางไฟล์ `docs/API-CONVENTIONS.md` (แม่แบบอยู่ที่ `assets/API-CONVENTIONS.md`)
ทุกข้อในหน้านี้ที่ตัดสินใจแล้ว ให้เขียนลงไฟล์นั้น พร้อมวันที่และเหตุผลสั้น ๆ

> ข้อตกลงที่อยู่ในหัวคนใดคนหนึ่ง ไม่ใช่ข้อตกลง — คนที่เข้าทีมเดือนหน้าจะทำอีกแบบ

---

## 2 · ตั้งชื่อ URL

```
GET    /v1/orders                 รายการ
POST   /v1/orders                 สร้าง
GET    /v1/orders/{id}            รายตัว
PATCH  /v1/orders/{id}            แก้บางส่วน
PUT    /v1/orders/{id}            แทนที่ทั้งตัว
DELETE /v1/orders/{id}            ลบ
GET    /v1/orders/{id}/items      ทรัพยากรลูก
POST   /v1/orders/{id}/cancel     การกระทำที่ไม่ใช่ CRUD (Create, Read, Update, Delete)
```

| กฎ | ✅ | ❌ |
|---|---|---|
| คำนาม พหูพจน์ | `/orders` | `/getOrders`, `/order` |
| ตัวพิมพ์เล็ก ขีดกลาง | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| ความลึกไม่เกิน 2 ชั้น | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| กริยาใช้เมื่อไม่ใช่ CRUD จริง ๆ | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**การกระทำที่ไม่ใช่ CRUD** (อนุมัติ ยกเลิก ส่งซ้ำ) — ใช้ `POST /{resource}/{id}/{action}`
อย่าดัดให้เป็น `PATCH` ที่แก้ `status` เพราะการเปลี่ยนสถานะมักมีผลข้างเคียงมากกว่าการแก้ฟิลด์ทั่วไป

**วิธี `PATCH`:** เลือกแบบเดียวทั้งระบบ โดยแนะนำให้ส่งเฉพาะฟิลด์ที่แก้ (`merge patch`)
และต้องกำหนดให้ชัดว่า `null` แปลว่า "ล้างค่า" หรือ "ไม่แตะ" (ดูข้อ 6)

---

## 3 · versioning

| วิธี | ข้อดี | ข้อเสีย |
|---|---|---|
| **ใน path** `/v1/orders` | เห็นชัด ทดสอบง่าย แคชง่าย | URL เปลี่ยนตอนขึ้นเวอร์ชัน |
| ใน header `Accept: application/vnd.acme.v1+json` | URL คงที่ | มองไม่เห็นตอน debug ลืมส่งบ่อย |

> **เลือก path** ถ้าไม่มีเหตุผลเฉพาะ — ทุกคนเห็นเวอร์ชันได้จากบรรทัดเดียวใน log

**เปลี่ยนแบบไหนแล้วฝั่งเรียกพัง:**

| การเปลี่ยน | พังไหม |
|---|:--:|
| เพิ่ม endpoint ใหม่ | ไม่ |
| เพิ่มฟิลด์ **ที่ไม่บังคับ** ใน request | ไม่ |
| เพิ่มฟิลด์ใน response | ไม่* |
| เพิ่มค่า enum ใหม่ | **พัง** — client ที่ `switch` ครบทุกค่าจะเจอค่าที่ไม่รู้จัก |
| ลบ/เปลี่ยนชื่อฟิลด์ | **พัง** |
| เปลี่ยนชนิดข้อมูล (`"12"` → `12`) | **พัง** |
| ทำให้ฟิลด์ที่เคยไม่บังคับกลายเป็นบังคับ | **พัง** |
| เปลี่ยน HTTP status ที่คืนในกรณีเดิม | **พัง** |
| ทำให้กฎ validation เข้มขึ้น | **พัง** |

\* ต่อเมื่อบอกฝั่งเรียกไว้แต่แรกว่า "ฟิลด์ที่ไม่รู้จักให้ข้ามไป"
ข้อนี้ต้องเขียนไว้ใน `API-CONVENTIONS.md` ไม่ใช่หวังเอาเอง

**ขึ้นเวอร์ชันใหญ่เมื่อจำเป็นจริง** เพราะทุกเวอร์ชันที่ยังเปิดอยู่คือโค้ดอีกชุดที่ต้องดูแล

---

## 4 · pagination

**ทุก endpoint ที่คืนรายการต้องมี pagination ตั้งแต่วันแรก** ไม่มีข้อยกเว้น
รายการที่ "มีไม่กี่รายการหรอก" อีก 2 ปีจะมี 10,000 รายการ

| วิธี | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | ค่าเริ่มต้น · ข้อมูลเยอะ · มีข้อมูลเพิ่มระหว่างเปิดดู | กระโดดไปหน้า 7 ไม่ได้ |
| offset `?limit=50&offset=100` | ต้องมีเลขหน้าให้กด · ข้อมูลไม่เยอะ | ยิ่งหน้าลึกยิ่งช้า · ถ้ามีแถวแทรกระหว่างเปิดดู ข้อมูลจะซ้ำหรือหาย |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null เมื่อหมดแล้ว
    "hasMore": true
  }
}
```

- ห่อรายการไว้ใน `data` เสมอ เพราะถ้าตอบเป็นอาเรย์เปล่า ๆ วันหลังจะเติมข้อมูลหน้าไม่ได้
- `limit` มีค่าเริ่มต้นและ**เพดานที่บังคับฝั่งเซิร์ฟเวอร์** (เช่น เริ่มต้น 20 สูงสุด 100)
- `totalCount` นับแพง จึงให้ขอเป็นตัวเลือก `?includeTotal=true` อย่านับทุกครั้ง
- **cursor ต้องทึบ** (ฝั่งเรียกห้ามแกะหรือประกอบเอง)

---

## 5 · filtering · sorting · ฟิลด์ที่ขอ

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| เรื่อง | ข้อตกลง |
|---|---|
| กรองค่าเท่ากับ | `?status=confirmed` |
| หลายค่า | `?status=confirmed,shipped` |
| ช่วง | `?createdAt[gte]=...&createdAt[lt]=...` |
| เรียง | `?sort=-createdAt,orderNo` — `-` คือมากไปน้อย |
| ค้นหาข้อความ | `?q=สมชาย` แยกจากการกรอง |
| เลือกฟิลด์ | `?fields=id,orderNo` |

- **รับเฉพาะฟิลด์ที่กำหนดไว้** ถ้ารับชื่อฟิลด์อะไรก็ได้ จะเกิดช่องโหว่ และ query ที่ไม่มี index
- พารามิเตอร์ที่ไม่รู้จัก ตอบ `400` ดีกว่าข้ามเงียบ ๆ ไม่งั้นฝั่งเรียกพิมพ์ผิดแล้วได้ข้อมูลผิดโดยไม่รู้ตัว

---

## 6 · รูปแบบข้อมูล

| ข้อมูล | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ชื่อฟิลด์ | `camelCase` ทั้งระบบ | `createdAt` |
| เวลา | RFC 3339 · UTC · ลงท้าย `Z` | `"2026-09-25T09:42:13.482Z"` |
| วันที่ล้วน | `YYYY-MM-DD` | `"2026-09-25"` |
| เงิน | ตัวเลขเป็น**สตริง** + สกุลเงินแยก | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **สตริงเสมอ** | `"1042"` ไม่ใช่ `1042` |
| enum | `SCREAMING_SNAKE` หรือ `lower_snake` เลือกแบบเดียว | `"CONFIRMED"` |
| ระยะเวลา | วินาทีเป็นตัวเลข ตั้งชื่อให้รู้หน่วย | `"timeoutSeconds": 30` |
| ประเทศ / สกุลเงิน / ภาษา | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> 🚨 **id เป็นตัวเลขใน JSON คือระเบิดเวลา** — JavaScript เก็บจำนวนเต็มได้ปลอดภัยถึง 9,007,199,254,740,991
> `bigint` ที่เกินนั้นจะถูกปัดเศษเงียบ ๆ ตอน `JSON.parse` และถ้าจะเปลี่ยนเป็นสตริงทีหลังก็เป็น breaking change
>
> 🚨 **เงินเป็น float ใน JSON** — `1250.10` ที่ผ่าน 2 ภาษาโปรแกรมอาจกลายเป็น `1250.0999999999999`

**`null` กับ "ไม่มีฟิลด์" ต้องหมายถึงคนละอย่าง:**

- ใน response ฟิลด์ที่มีแต่ไม่มีค่าให้ส่ง `null` ไม่ตัดทิ้ง ฝั่งเรียกจะได้ไม่ต้องเช็ค 2 แบบ
- ใน `PATCH` ถ้าส่ง `{"note": null}` แปลว่าล้างค่า ถ้าไม่ส่งคีย์ `note` เลยแปลว่าไม่แตะ

**อาเรย์ว่างคือ `[]` ไม่ใช่ `null`** ฝั่งเรียกจะวนลูปได้เลย

---

## 7 · error

รูปแบบ error (RFC 9457 · `requestId` · `errors` แบบ array `{field, code, message}`) และตัวอย่างอยู่ที่ `web-service-essentials` ข้อ 2 ที่เดียว ใช้ตามนั้น
ที่ต้องตกลงเพิ่มคือ **error ระดับฟิลด์**:

- **`code` ให้โปรแกรมอ่าน · `message` ให้คนอ่าน** อย่าให้ฝั่งเรียกต้องเอาข้อความไปเขียนเงื่อนไข
- ชี้ตำแหน่งฟิลด์ด้วยเส้นทางเต็ม รวมดัชนีของอาเรย์
- **คืน error ครบทุกฟิลด์ในครั้งเดียว** ไม่ใช่ทีละตัว ผู้ใช้จะได้ไม่ต้องกดส่ง 5 รอบ
- ถ้ารองรับหลายภาษา ให้เลือกข้อความไทยหรืออังกฤษจาก `Accept-Language`

**เลือก status ให้ตรง:** `400` รูปแบบคำขอผิด · `401` ยังไม่ได้ยืนยันตัวตน · `403` ยืนยันแล้วแต่ไม่มีสิทธิ์ ·
`404` ไม่มีหรือไม่ให้รู้ว่ามี · `409` ชนกับสถานะปัจจุบัน · `422` รูปแบบถูกแต่ข้อมูลไม่ผ่านกฎ · `429` เรียกถี่เกิน

---

## 8 · เรียกซ้ำไม่เกิดผลซ้ำ และการแก้ชนกัน

### idempotency key (รหัสกำกับคำขอ — ส่งซ้ำแล้วไม่ทำงานซ้ำ)

**บังคับกับทุก `POST` ที่มีผลทางการเงินหรือส่งของออกไปข้างนอก**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← ฝั่งเรียกสร้าง เก็บไว้ใช้ตอน retry
```

- เซิร์ฟเวอร์เก็บ key คู่กับผลลัพธ์ไว้อย่างน้อย 24 ชั่วโมง
- key เดิมกับเนื้อหาเดิม ให้คืนผลเดิม ไม่ทำงานซ้ำ
- key เดิมแต่เนื้อหา**ต่าง** ให้ตอบ `422` ไม่ทำงานใหม่
- เครือข่ายขาดระหว่างรอคำตอบเป็นเรื่องปกติ ไม่ใช่กรณีพิเศษ ฝั่งเรียกจึง retry เสมอ

### แก้ชนกัน (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 ปกติ · 412 ถ้ามีคนแก้ไปก่อนแล้ว
```

ถ้าไม่มี คนที่กดบันทึกทีหลังจะทับงานของคนแรกโดยไม่มีใครรู้

---

## 9 · rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← ต้องมีคู่กับ 429 เสมอ
```

ถ้า `429` ไม่มี `Retry-After` ฝั่งเรียกต้องเดาเอง และส่วนใหญ่เดาว่า "ลองใหม่ทันที"

---

## 10 · การเลิกใช้ endpoint

1. ประกาศล่วงหน้า พร้อมบอกว่าใช้อะไรแทน
2. ส่ง header ในทุก response ของ endpoint นั้น:
   ```
   Deprecation: @1790812800
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
   `Deprecation` ตามมาตรฐาน Request for Comments (RFC) 9745 (มี.ค. 2025) ต้องเป็นวันที่แบบ `@<วินาที unix>` (ตัวอย่างนี้คือ 1 ต.ค. 2026 00:00 UTC) ไม่ใช่ `true` · ตรวจ 22 ต.ค. 2569
3. **ดูจาก log ว่ายังมีใครเรียกอยู่** แล้วติดต่อเขาตรง ๆ อย่ารอให้เงียบไปเอง
4. ปิดจริงหลังวันที่ประกาศ ไม่ใช่ก่อน

ระยะเวลาที่พอดี: API ภายในให้ 1 รอบ release ส่วน API ที่คนนอกใช้ให้อย่างน้อย 6 เดือน

---

## 11 · ตรวจก่อนปล่อย endpoint ใหม่

ไล่ทุกข้อกับ endpoint ที่เพิ่ม ตกข้อเดียวยังไม่ merge (แนวคิดจาก ECC api-design)

- [ ] URL เป็นคำนามพหูพจน์ตามข้อ 2 · อยู่ใต้เวอร์ชันตามข้อ 3 · ไม่มี `GET` ที่เปลี่ยนข้อมูล
- [ ] รายการทุกตัวมี pagination และเพดานขนาดหน้า (ข้อ 4) · filter และ sort ใช้ชื่อพารามิเตอร์เดียวกับ endpoint เดิม (ข้อ 5)
- [ ] วันที่ · id · เงิน อยู่ในรูปแบบของข้อ 6 · response ไม่ใช่ entity ของฐานข้อมูลตรง ๆ
- [ ] error ทุกตัวตาม `web-service-essentials` §2 และมี `code` คงที่ (ข้อ 7) · คำขอที่สร้างหรือจ่ายเงินรับ idempotency key · การแก้รับ `If-Match` (ข้อ 8)
- [ ] ระบุ auth และ rate limit (ข้อ 9) · อยู่ใน OpenAPI แล้ว และตัวอย่าง cURL ในเอกสารรันผ่านจริง
- [ ] มี contract test หรือ test ระดับ endpoint อย่างน้อย 1 กรณีสำเร็จ 1 กรณี error — ตรวจ response กับ OpenAPI ใน CI · Pact เมื่อผู้เรียกแยกทีม · `oasdiff breaking` ทุก PR: [`references/contract-testing.md`](references/contract-testing.md)

## 12 · Anti-patterns

- ❌ **`200 OK` พร้อม `{"success": false}`** — ตัวเฝ้าระบบและ log ทั้งหมดจะมองไม่เห็นว่าพัง
- ❌ **กริยาใน URL** — `/createOrder`, `/getOrderById`
- ❌ **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูล 50,000 แถวในครั้งเดียว
- ❌ **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — เช่น `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- ❌ **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงข้อมูลภายในหลุด
- ❌ **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- ❌ **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงเองโดยไม่มีใครกด
- ❌ **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- ❌ **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง


## reference: contract-testing.md

# Contract testing — OpenAPI คือสัญญา แล้วให้ CI ตรวจว่าของจริงตรง

เอกสาร `docs/API-CONVENTIONS.md` บอกกติกา · ไฟล์ OpenAPI บอกรูปร่างของแต่ละ endpoint · contract test คือสิ่งที่ทำให้ 2 อย่างนี้ไม่เป็นแค่เอกสาร

## 1 · OpenAPI เป็นสัญญา

- สร้างจากโค้ดจริง (annotation · decorator · generator ของ framework) แล้ว commit ไฟล์ที่ได้ — ไม่เขียนมือแยก · เมื่อ 2 ฝั่งต่างกัน ฝั่งโค้ดคือความจริง และ diff ในไฟล์คือสิ่งที่ reviewer เห็น
- ทุก response มี schema รวมถึง error (`web-service-essentials` §2) · ทุกฟิลด์มี `format` ของวันที่ · id · เงิน ตาม §6 ของ SKILL.md หลัก

## 2 · ตรวจ response กับ spec ใน CI (provider side)

| เครื่องมือ | ทำอะไร | licence | หมายเหตุ (ตรวจ 2026-10-23) |
|---|---|---|---|
| Schemathesis | อ่าน OpenAPI แล้วสร้าง request จาก schema ยิงใส่ service จริง ตรวจว่า response ตรง spec และไม่ 500 · `schemathesis run <url ของ openapi.json>` | MIT | ยิงจริง สร้างและลบข้อมูล → ชี้ไป dev หรือ staging เท่านั้น · Python |
| Prism (Stoplight) | `prism mock <spec>` ให้ frontend ใช้ก่อน backend เสร็จ · `prism proxy <spec> <upstream>` ตรวจ traffic จริงกับ spec | Apache-2.0 | Node ≥ 18.20 · โหมด proxy ใส่หน้า service ใน test environment ได้ |
| Dredd | ตรวจ API กับ API Blueprint / OpenAPI 2 (OpenAPI 3 ทดลอง) | MIT | **เลิกดูแลแล้ว** (archived 2024-11-08) — ไม่เริ่มใช้ใหม่ |

ค่าเริ่มของเรา: Schemathesis ใน job ของ CI หลัง service ขึ้นด้วยข้อมูลทดสอบ (reset endpoint จาก `app-verifier-setup`) · ล้ม = ไม่ merge

## 3 · Consumer-driven contract — เมื่อทีม frontend หรือผู้เรียกแยกจาก backend

- Pact (pact-foundation · MIT): ฝั่งผู้เรียกเขียน test ว่าใช้ request/response คู่ไหนบ้าง → ได้ไฟล์ pact → ฝั่ง provider รันตรวจกับไฟล์นั้นใน CI ของตัวเอง · provider เปลี่ยนส่วนที่ไม่มีใครใช้ได้โดย test ไม่พัง
- ใช้เมื่อ: ทีมคนละชุด ปล่อยคนละรอบ หรือมีผู้เรียกมากกว่า 1 ราย (mobile + web + partner) · ทีมเดียวทำทั้ง 2 ฝั่ง → ข้อ 2 พอ
- ไฟล์ pact แลกกันผ่าน Pact Broker หรือ commit ลง repo ของ provider — ตกลงที่เดียวใน `API-CONVENTIONS.md`

## 4 · เช็ค breaking change ทุก PR

- `oasdiff breaking <spec เดิม> <spec ใหม่>` (Apache-2.0 · Go · มี Docker image) รายงานเฉพาะการเปลี่ยนที่ทำให้ผู้เรียกเดิมพัง: ลบ endpoint หรือฟิลด์ · ฟิลด์กลายเป็น required · type เปลี่ยน · enum หาย
- ใน CI: spec เดิม = ของ branch หลัก · spec ใหม่ = ของ PR · เจอ breaking → ต้องขึ้นเวอร์ชันใหม่ตาม §3 หรือ deprecate ตาม §10 ของ SKILL.md หลัก — ไม่ใช่ปิด check
- เพิ่มฟิลด์ optional · เพิ่ม endpoint · เพิ่มค่า enum ที่ผู้เรียกไม่ switch ตาย = ไม่ breaking

## ตรวจก่อนส่ง

- [ ] OpenAPI อยู่ใน repo และสร้างจากโค้ด · CI ล้มถ้าไฟล์ไม่ตรงโค้ด
- [ ] Schemathesis (หรือเทียบเท่า) รันกับ service ที่ขึ้นด้วยข้อมูลทดสอบ · `oasdiff breaking` รันทุก PR
- [ ] ผู้เรียกแยกทีม → มี pact อย่างน้อย 1 ไฟล์ต่อผู้เรียก และ provider ตรวจใน CI
