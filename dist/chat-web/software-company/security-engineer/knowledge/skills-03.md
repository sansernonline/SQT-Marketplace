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

# skill: code-review-checklist

Use when reviewing a pull request, self-reviewing before submitting, or auditing code quality.

> **ใน SuperUser:** รีวิวเริ่มจาก playbook [`review`](../superuser/references/playbook-review.md) แล้วใช้ checklist นี้กับรีวิวทั่วไป ส่วนงานเสี่ยงสูงหรือ diff ใหญ่ใช้ `adversarial-review-panel`

# Code Review Checklist

## When to use this skill

- Reviewing a pull request
- Self-review before submitting code
- Onboarding new code reviewers
- Auditing code quality of existing modules

## When NOT to use

| Task | Use instead |
|---|---|
| Second look at a finished piece inside a team | a new `reviewer` agent (it applies this checklist to code) |
| Contested design, large or high-risk diff, "stress test" / "find blind spots" | `adversarial-review-panel` (several `reviewer` agents) |
| Reviewing a visual (image, poster, screen look) | (if plugin `graphic-design` is installed) `graphic-design:design-review`, else `ui-craft` checks |
| Writing or updating the PR description itself | `pr-description-template` |
| Hunting misleading patterns across the codebase, not one diff | `code-gardener` |
| Scanners, secrets or dependency check before ship or after adding a dependency | `security-gate` (run both before merge) |
| Web app or API that must meet OWASP Top 10:2025 | `owasp-top10` (per-stack checks in its `references/stack-checks.md`) |

## Review Process

1. **Understand the intent** — read PR description and linked ticket
2. **Skim the diff** — get overall sense of changes
3. **Deep review** — go through each section of checklist below
4. **Run the code** if non-trivial — don't just read
5. **Leave actionable comments** — suggest fixes, not just point out problems

## Checklist

House checks first. Each skill holds the full rules, so link to it in the comment:

- [ ] Security: run [`security-gate`](../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
- [ ] Simple enough: [`lazy-coding`](../lazy-coding/SKILL.md) (no unused layers, standard library first, one concern per file)
- [ ] Readable: [`readable-code`](../readable-code/SKILL.md) (names, file and folder layout, config outside code)
- [ ] Tests sit next to the code and prove the change: [`testing-standards`](../testing-standards/SKILL.md)
- [ ] Shared code touched → [`blast-radius`](../blast-radius/SKILL.md) list is in the PR
- [ ] Commit message follows [`commit-message-format`](../commit-message-format/SKILL.md)

The generic list (correctness, design, performance, documentation, maintainability) is in [`references/full-checklist.md`](references/full-checklist.md).

## Comment Templates

### Suggestion (non-blocking)
```
nit: Consider X for readability
```

### Question
```
q: Why did you choose X over Y here?
```

### Blocking issue
```
blocking: This will cause Y in production because Z.
Suggest: <concrete fix>
```

### Praise
```
Nice approach with X — much cleaner than the previous version.
```

## Review Severity Levels

| Prefix | Meaning |
|--------|---------|
| `blocking:` | Must fix before merge |
| `important:` | Should fix, can be follow-up if urgent |
| `nit:` | Minor improvement, optional |
| `q:` | Question, not necessarily a change |
| `praise:` | Acknowledge good work |

These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน

## Anti-patterns to Avoid

As a reviewer:
- Bikeshedding — don't fight over trivial style if there's no convention
- "Why didn't you do it MY way?" — there are often multiple valid approaches
- Only criticism — acknowledge good things too
- Vague comments like "this is wrong" — explain WHY and suggest fix
- Reviewing too much at once — request smaller PRs (under 400 lines)


## reference: full-checklist.md

# Code review — full generic checklist

Moved out of [SKILL.md](../SKILL.md). Open it for a large or unfamiliar change. The house-specific checks stay in SKILL.md.

### 🎯 Correctness

- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null, empty, zero, negative, very large)
- [ ] Are error paths handled? (network failure, timeout, invalid input)
- [ ] Are race conditions / concurrency issues considered?
- [ ] Off-by-one errors checked?
- [ ] Are assumptions explicit (or asserted)?

### 🏗️ Design

- [ ] Does this fit the existing architecture?
- [ ] Is the abstraction at the right level? (not too generic, not too specific)
- [ ] Single Responsibility — does each function/class do one thing?
- [ ] DRY — but not over-abstracted?
- [ ] Are dependencies appropriate? (no circular, minimal coupling)
- [ ] Could this be simpler?

### 🧪 Tests

- [ ] Are there tests for the new code?
- [ ] Tests cover happy path + edge cases + errors?
- [ ] Tests would actually fail if code broke? (no false positives)
- [ ] Tests are readable and maintainable?
- [ ] No flaky tests introduced?

### 🔒 Security

- [ ] Input validation at boundaries?
- [ ] No SQL injection (parameterized queries)?
- [ ] No XSS (proper escaping)?
- [ ] No secrets/credentials in code?
- [ ] Authorization checks for sensitive operations?
- [ ] PII / sensitive data logged appropriately?
- [ ] Dependencies updated? No known CVEs?

### 🚀 Performance

- [ ] No N+1 queries?
- [ ] Appropriate caching where beneficial?
- [ ] Loops/algorithms with appropriate complexity?
- [ ] Large data handled with pagination/streaming?
- [ ] No unnecessary network calls?

### 📖 Readability

- [ ] Names reveal intent? (variables, functions, classes)
- [ ] Functions reasonably short?
- [ ] Complex logic has explanatory comments? (WHY, not WHAT)
- [ ] No commented-out code left behind?
- [ ] No debug prints / TODO without ticket?
- [ ] Consistent with existing code style?

### 📚 Documentation

- [ ] Public APIs documented?
- [ ] README/CHANGELOG updated if needed?
- [ ] Breaking changes called out?
- [ ] New env vars / config documented?

### 🔄 Maintainability

- [ ] Could a new team member understand this in 6 months?
- [ ] Easy to modify when requirements change?
- [ ] No magic numbers / strings (use constants)?
- [ ] Logging at appropriate levels?


---

# skill: simplify

Use when a deliverable has steps, layers or options nobody needs yet, or a newcomer must follow it. Not Claude Code /simplify.

# simplify — ทำให้ง่าย คนอ่านครั้งแรกก็ตามได้

ใช้กับทุกงานที่ส่งให้คน ทั้งโค้ด เอกสาร แผน ดีไซน์ สไลด์ ตาราง และคำตอบ · `human-writing` คุมว่า**เขียนอย่างไร** ส่วน skill นี้คุมว่า**ตัวงานมีอะไรบ้าง** · อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies`

## 1 · หลักใหญ่

- **บททดสอบ:** คนที่ไม่ได้อยู่ในงานนี้ เปิดดูอีก 6 เดือนข้างหน้า ต้องเข้าใจและแก้ต่อได้โดยไม่ต้องถามใคร
- ทำเท่าที่โจทย์ต้องการ ไม่เผื่ออนาคตที่ยังไม่มีใครขอ
- ตัดก่อนเพิ่ม · ถ้าตัดส่วนไหนออกแล้วความหมายหรือการทำงานไม่เสีย ให้ตัด
- ของธรรมดาที่คนรู้จักดีกว่าของฉลาดที่ต้องถอดรหัส
- **ง่ายไม่ใช่มักง่าย** — ห้ามตัดความถูกต้อง ความปลอดภัย การตรวจข้อมูลที่รับจากภายนอก การจัดการ error ที่กันข้อมูลหาย และสิ่งที่ผู้ใช้ขอไว้ชัด ๆ
- **ง่ายไม่ใช่กองรวม** — ลดจำนวนของ แต่ยังแยกหน้าที่ชัด 1 ส่วนทำ 1 เรื่อง เหมือนงานของมืออาชีพ

## 2 · บันไดก่อนลงมือ — หยุดที่ขั้นแรกที่ใช้ได้

1. ต้องมีสิ่งนี้จริงไหม · ไม่จำเป็น → ไม่ทำ แล้วบอก 1 บรรทัดว่าข้ามอะไร
2. มีของเดิมที่ใช้ได้แล้วไหม (ไฟล์ แม่แบบ ฟังก์ชัน เครื่องมือ ฟีเจอร์ที่ติดมากับระบบ) · มี → ใช้ของเดิม
3. ทำแบบสั้นที่สุดที่ยังครบและถูก

## 3 · ตามชนิดงาน

| งาน | ทำ | เลี่ยง |
|---|---|---|
| **โค้ด** | ชื่อบอกว่าคืออะไรและมีหน่วย · 1 ฟังก์ชันทำ 1 เรื่อง · คืนค่าออกเร็วแทนการซ้อน `if` · เยื้องไม่เกิน 3 ชั้น · คอมเมนต์บอก "ทำไม" · ตามสไตล์ของโปรเจกต์ | abstraction ที่มีตัวใช้ตัวเดียว · ทางลัดที่ฉลาดแต่อ่านยาก · ไฟล์ก้อนเดียวทำทุกอย่าง · โฟลเดอร์ `utils/` กองรวม · dependency ใหม่เพื่องานไม่กี่บรรทัด |
| **เอกสาร · รายงาน** | ข้อสรุปขึ้นก่อน · 1 ย่อหน้า 1 เรื่อง · ตัวอย่างประกอบข้อที่เป็นนามธรรม · ตารางสำหรับข้อมูลที่เทียบกัน | ทวนสิ่งที่พูดไปแล้ว · หัวข้อที่ไม่มีเนื้อ · ศัพท์ที่คนอ่านไม่รู้ |
| **แผน · ขั้นตอน** | 3–5 ข้อสำคัญ · ทุกข้อมีเจ้าของและวัดได้ว่าเสร็จ · ขั้นน้อยที่สุดที่ได้ผล | รายการ 20 ข้อที่ไม่มีลำดับความสำคัญ · ขั้นที่มีไว้ "เผื่อ" |
| **ดีไซน์ · สไลด์ · รูป** | 1 หน้า 1 ใจความ · ทางสั้นสุดไปถึงเป้าของผู้ใช้ · ใช้แบบที่คนคุ้นเคย | อัดข้อมูลจนต้องเพ่ง · ของตกแต่งที่ไม่ช่วยให้เข้าใจ |
| **ตาราง · ข้อมูล** | คอลัมน์เท่าที่ใช้ตัดสินใจ · สูตรสั้นที่ตามได้ | คอลัมน์ซ้ำความหมาย · สูตรซ้อนยาวบรรทัดเดียว |
| **คำตอบ** | ตอบก่อน · ยาวเท่าที่คำถามต้องการ | อธิบายยาวกว่าตัวงาน |

plugin `software-company` มีรายละเอียดของโค้ดและสถาปัตยกรรมเพิ่ม: `lazy-coding` (เขียนให้น้อย) · `readable-code` (ชื่อ รูปร่างฟังก์ชัน โครงไฟล์) · `simplicity-first` (เอกสาร แผน สถาปัตยกรรม) · ถ้าติดตั้งอยู่ให้เปิดคู่กัน

## 4 · บอกว่าตั้งใจทำให้ง่าย

ทางลัดที่ตั้งใจ ให้เขียนไว้ว่าใช้ได้ถึงแค่ไหนและเปลี่ยนเมื่อไร จะได้ไม่ดูเหมือนลืม เช่น `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` · ในรายงานใส่ 1 บรรทัด `ข้าม: X — เพิ่มเมื่อ Y`

## 5 · ตรวจก่อนส่ง 5 ข้อ

1. คนนอกเปิดดูครั้งแรกแล้วเข้าใจภายใน 30 วินาทีไหม
2. มีส่วนไหน ขั้นไหน หรือชั้นไหนตัดออกได้โดยไม่เสียอะไรไหม ถ้ามีให้ตัด
3. ทุกส่วนที่เพิ่มมา มีเหตุผลว่าต้องใช้ตอนนี้ ไม่ใช่ "เผื่อ" ใช่ไหม
4. ยังครบเรื่องความถูกต้อง ความปลอดภัย และสิ่งที่ผู้ใช้ขอไหม
5. ยังแยกหน้าที่ชัด ไม่ได้ยุบหลายเรื่องไว้ที่เดียวเพื่อให้ดูสั้นใช่ไหม


---

# skill: auth-implementation-patterns

Use when implementing login or identity (session vs JWT, OAuth, SSO, MFA, password reset).

# Authentication Implementation Patterns

## When to use this skill

- Building login/signup/logout
- Adding password reset flow
- Adding multi-factor authentication (MFA): TOTP, SMS, WebAuthn
- Choosing session vs token authentication
- Integrating OAuth or OpenID Connect (OIDC) logins (Google, GitHub, etc.)
- Implementing single sign-on (SSO) with SAML or OIDC
- Designing API authentication (API keys, JSON Web Token (JWT), OAuth)
- Reviewing existing auth code for security issues

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/auth-flows.md](references/auth-flows.md) | ถ้าจะลงมือเขียน session · JWT · OAuth กับ PKCE หรือการรีเซ็ตรหัสผ่าน ให้เปิดดูลำดับขั้นทีละข้อ |
| [references/mfa.md](references/mfa.md) | ตอนเลือกหรือลงมือทำ MFA และต้องการขั้นตั้งค่า TOTP · การใช้ WebAuthn · ข้อจำกัดของ SMS |
| [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md) | ถ้าออกแบบการยืนยันตัวตนของ API หรือ API key หรือต้องการตัวอย่าง RBAC กับ ABAC ให้เปิดไฟล์นี้ |
| [references/libraries-and-code.md](references/libraries-and-code.md) | ตอนเลือกไลบรารีตามภาษา หรือต้องการโค้ดตัวอย่างการ hash รหัสผ่านและเครื่องมือจำกัดจำนวนครั้ง |

## Choose the Right Pattern

```
What's authenticating?
│
├─ Browser user
│  ├─ First-party app → Session cookies (HttpOnly, Secure, SameSite)
│  └─ Need cross-domain → JWT with httpOnly cookie (NOT localStorage)
│
├─ Mobile app
│  └─ Token-based: OAuth 2.0 PKCE flow
│
├─ Service-to-service
│  ├─ Same org → mTLS or service mesh
│  └─ External → OAuth 2.0 Client Credentials
│
└─ Third-party developer
   └─ API keys (with rotation) OR OAuth
```

## Pattern 1: Session-Based Auth (Most apps)

**When to use:** server-rendered apps, monoliths, one domain

**Implementation requirements:**
- Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- Session ID: cryptographically random, ≥ 128 bits
- Session storage: Redis with a time-to-live (TTL). Not in app memory if you run more than one instance
- Idle timeout: 30 min default
- Absolute timeout: 8-12 hours
- Issue a new session ID when privileges change (login, role change)
- On logout, delete the session from the store

**Pitfalls:**
- ผิด: Storing session in JWT (can't revoke)
- ผิด: Using `localStorage` for the session token (cross-site scripting (XSS) can steal it)
- ผิด: Keeping the same ID after login (session fixation)

## Pattern 2: JWT (Stateless Token)

**When to use:** microservices, mobile, single-page app (SPA) with a backend API

> ระวัง: **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Implementation requirements:**
- Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- Short-lived access token: 5-15 min
- Refresh token: longer-lived (days), stored separately, revocable
- Issue a new refresh token each time one is used
- Required claims: `sub`, `iat`, `exp`, `iss`, `aud`
- Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- Have a way to cancel tokens (blocklist, short expiry, etc.)

**Pitfalls:**
- ผิด: `alg: none` attacks (check the algorithm explicitly)
- ผิด: Storing JWT in `localStorage` (XSS-stealable)
- ผิด: Long-lived access tokens (you can't cancel them)
- ผิด: Putting sensitive data in JWT (it's base64, not encrypted)
- ผิด: Skipping signature verification

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", or handing login to an identity provider (IdP)

ใช้ Authorization Code Flow with PKCE (Proof Key for Code Exchange) เสมอ เพราะกันไม่ให้ code ที่ถูกขโมยไปแลกเป็น token ได้ ลำดับขั้นอยู่ใน [references/auth-flows.md](references/auth-flows.md)

**Implementation requirements:**
- **Always use PKCE** (even for confidential clients)
- Validate `id_token` signature (use IdP's JWKS)
- Validate `aud`, `iss`, `exp`, `nonce`
- Use the `state` parameter to prevent cross-site request forgery (CSRF)
- Match `code_verifier` to `code_challenge`
- Use a library, don't write your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ผิด: Implicit flow (deprecated, insecure)
- ผิด: Resource Owner Password Credentials flow (deprecated)
- ผิด: Skipping `state` validation (CSRF risk)
- ผิด: Trusting `id_token` without verifying signature

## Pattern 4: Multi-Factor Authentication (MFA)

มี 3 แบบ ถ้าเป็นแอปใหม่ให้ใช้ WebAuthn (passkeys) เป็นค่าเริ่มต้น เพราะไม่มีความลับร่วมให้ถูกหลอกเอาไป ถ้าต้องการ 2FA มาตรฐานที่ผู้ใช้ตั้งเองได้ง่ายให้ใช้ TOTP ส่วน SMS หรือ email ให้ใช้เป็นทางสุดท้ายเท่านั้น เพราะ SMS ไม่ปลอดภัยจากการสลับซิม (SIM swap) รายละเอียดทั้ง 3 แบบอยู่ใน [references/mfa.md](references/mfa.md)

## Pattern 5: Password Management

### Storage
- ถูก: **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ผิด: Never: MD5, SHA-1, SHA-256 raw, plain text

### Password policy (NIST SP 800-63B-4 §3.1.1.2, checked 2026-10-14 at pages.nist.gov/800-63-4/sp800-63b.html)
- ถูก: Minimum **15 characters** when the password is the only factor · minimum **8** when it is used only inside multi-factor authentication (MFA)
- ถูก: Check against a list of breached passwords (Have I Been Pwned (HIBP) API)
- ถูก: Allow long passphrases (any maximum must be at least 64 chars)
- ถูก: Allow special characters (don't restrict them)
- Don't force composition rules (uppercase + digit + symbol)
- Don't force regular password changes (only when you suspect a breach)

### Password reset flow

ข้อที่ห้ามพลาดในการรีเซ็ตรหัสผ่าน: ข้อความตอบต้องเหมือนกันไม่ว่าอีเมลจะมีในระบบหรือไม่ token ต้องสุ่มอย่างน้อย 256 bits เก็บแบบ hash และหมดอายุใน 15 นาที และเมื่อตั้งรหัสใหม่แล้วต้องยกเลิกทุก session เดิมและส่งอีเมลยืนยัน ลำดับขั้นครบทั้ง 9 ข้ออยู่ใน [references/auth-flows.md](references/auth-flows.md)

## Pattern 6: Account Lockout & Rate Limiting

```
Login attempts:
- 5 failed attempts in 15 min → lock account 15 min
- 10 failed attempts in 1 hour → lock 1 hour
- Use IP + email combo, not just one

Lockout messaging:
ถูก: "Too many failed attempts. Try again in 15 minutes."
ผิด: "Account locked." (reveals account exists)
```

ให้ใช้เครื่องมือที่มีอยู่แล้วแทนการเขียนเอง รายชื่อเครื่องมืออยู่ใน [references/libraries-and-code.md](references/libraries-and-code.md)

## Pattern 7: API Authentication

เลือกตามผู้เรียก: API key สำหรับ server-to-server แบบง่าย · OAuth 2.0 Client Credentials สำหรับ service-to-service · mTLS สำหรับระบบภายในที่ต้องการความปลอดภัยสูง · HMAC signing สำหรับตรวจ webhook ส่วน API key ต้องแสดง secret ครั้งเดียวตอนสร้าง เก็บแบบ hash และให้ผู้ใช้ยกเลิกได้ทันที ตารางเทียบและหลักการครบอยู่ใน [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

## Authorization Patterns (after authentication)

ใช้ RBAC (Role-Based Access Control) เป็นหลัก และใช้ ABAC (Attribute-Based Access Control) เมื่อต้องการสิทธิ์ละเอียดตามคุณสมบัติของข้อมูล ตัวอย่างอยู่ใน [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

### Implementation tip
- Check authorization at every endpoint
- Don't trust a role sent by the client
- Check on the server, using the user from the session or token

## Common Vulnerabilities Checklist

- [ ] Session fixation (regenerate ID on login)
- [ ] CSRF (token or SameSite cookie)
- [ ] Brute force (rate limiting)
- [ ] Credential stuffing, i.e. logins with leaked passwords (HIBP check, MFA)
- [ ] Open redirect (allowlist redirect URLs)
- [ ] User enumeration, i.e. finding which accounts exist (same error message every time)
- [ ] Timing attacks (compare in constant time)
- [ ] Token in URL (use header or cookie)
- [ ] Logout that does nothing on the server (invalidate server-side)
- [ ] Privilege escalation (re-check after role change)

## Anti-patterns

- Writing your own crypto or auth (use libraries)
- Storing passwords reversibly
- JWT for sessions when you have one backend
- Long-lived JWT without rotation
- Authentication without authorization checks
- Trusting JWT claims as authorization source
- Logout that doesn't invalidate token server-side
- Allowing weak passwords for compliance "convenience"


## reference: api-auth-and-authorization.md

# API Authentication และ Authorization Patterns

วิธียืนยันตัวตนของ API แต่ละแบบ หลักการจัดการ API key และตัวอย่าง RBAC กับ ABAC

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** (both sides present certificates) | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show the secret ONCE, when it is created
- Store it hashed (like a password)
- Allow scopes/permissions per key
- Allow expiry and replacement
- Show when each key was last used
- Let users revoke a key instantly

## Authorization Patterns (after authentication)

### RBAC (Role-Based Access Control)
```
User → Role → Permissions
e.g., user@example.com → admin → [users.read, users.write, billing.read]
```

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


## reference: auth-flows.md

# ลำดับขั้นของแต่ละ flow

ลำดับขั้นทีละข้อของ session · JWT · OAuth กับ PKCE และการรีเซ็ตรหัสผ่าน ใช้ตอนลงมือเขียนโค้ดหรือรีวิวว่าโค้ดทำครบทุกขั้นไหม ส่วนข้อกำหนดและข้อผิดพลาดที่ต้องเลี่ยงอยู่ใน `SKILL.md`

## Pattern 1: Session-Based Auth — Flow

```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

## Pattern 2: JWT — Flow

```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

## Pattern 3: OAuth 2.0 / OIDC — Authorization Code Flow with PKCE

PKCE = Proof Key for Code Exchange. It stops a stolen code from being swapped for a token.

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

## Pattern 5: Password reset flow

```
1. User requests reset (enter email)
2. Server: always show "if email exists, link sent" (don't leak)
3. Generate random token (≥ 256 bits), hash it, store with expiry (15 min)
4. Email link with raw token
5. User clicks → /reset?token=...
6. Server hashes input, compares, verifies expiry
7. User sets new password (apply policy)
8. Invalidate all existing sessions
9. Send confirmation email
```


## reference: libraries-and-code.md

# ไลบรารีและโค้ดตัวอย่าง

โค้ดตัวอย่างการเก็บรหัสผ่าน เครื่องมือจำกัดจำนวนครั้ง และไลบรารีที่แนะนำแยกตามภาษา

## Password storage — code

```typescript
// Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

## Rate limiting tools

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, Auth.js, Better Auth | Lucia v3 is deprecated (lucia-auth.com, checked 22 Oct 2026) so do not start new work on it; Better Auth status (รอยืนยัน, check before use) |
| Python | `authlib`, `PyJWT` (or `joserfc`) | authlib for OAuth; python-jose is rarely maintained (รอยืนยัน) |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |


## reference: mfa.md

# Pattern 4: Multi-Factor Authentication (MFA)

รายละเอียดของการยืนยันตัวตนหลายขั้นทั้ง 3 แบบ ใช้ตอนเลือกหรือลงมือทำ MFA

## TOTP (Google Authenticator, Authy)
**When:** standard two-factor login (2FA), easy for users. TOTP = time-based one-time password.

```
Setup:
1. Server generates random secret (160 bits)
2. Server shows QR code: otpauth://totp/...?secret=...
3. User scans with authenticator app
4. User confirms with first code
5. Server stores secret encrypted

Verify:
1. User enters 6-digit code
2. Server computes expected code(s) (±1 window for clock drift)
3. Match → grant access
```

## WebAuthn (Passkeys) — Future-proof
**When:** you want login that phishing can't beat, no SMS, hardware keys

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret, so nothing to phish
- Default for new apps in 2026+

## SMS / Email codes
**When:** there's no other option (users without smartphone apps)

- Note: SMS is **NOT secure** (SIM swap attacks)
- Use only as a last resort, never as the main method
- Use strict rate limits
- Codes: 6 digits, 5 min expiry
