# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap). Simplest that works.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`.

## The one test

Before submitting, ask:

> Could a tired teammate understand this in 6 months, with no prior context?

If "no" or "not sure" → simplify.

## 5 principles

1. **Start with the simplest thing that works.** Add complexity only when something breaks.
2. **Reduce moving parts.** Each component adds failure modes, ops burden, and docs. Default to one thing.
3. **Use familiar patterns.** Boring, proven tech for critical paths. Save novelty for low-risk experiments.
4. **Optimize for reading.** It's read far more often than written.
5. **Delete &gt; add.** The best edit removes something. The worst adds a layer for an imagined future need.

## By output type

### Documents (BRD, FSD, ADR)

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (REST, queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (UX, API)

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## The 3-question filter

Before adding any new component, configuration option, or pattern:

1. Is there real evidence we need this **now** (not "might need")?
2. Is there a simpler way? (Sleep on it. Often yes.)
3. What's the cost of **not** adding it? (Often nothing, or a small refactor later.)

Two or more answers point to "simpler is fine" → don't add it.

## Examples

**API description**

❌ "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

✅ "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

❌ "Improve overall product quality and customer satisfaction through various
initiatives."

✅ "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

❌ "Event-sourced microservice with CQRS, Kafka ingestion, Redis cache, and a
dedicated auth service."

✅ "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".

## Pre-submit checklist

- [ ] A tired teammate would understand this in 6 months.
- [ ] Nothing can be deleted without losing meaning.
- [ ] No jargon the audience won't know.
- [ ] Every abstract claim has an example.
- [ ] I could explain the whole thing in two sentences.

If any answer is "no" → simplify before delivering.

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Saint-Exupéry


---

# skill: reverse-engineering

Use when there is a compiled app or unknown file format or protocol but no source, or a build may differ.

# Reverse Engineering

**Decompile → Understand → Recreate**, with evidence at every step. Never claim the original source was recovered; report what the evidence shows and mark what is unknown.

Source code is available but there are no documents → use `legacy-spec-recovery` instead. Once this skill has recovered readable code, `legacy-spec-recovery` turns it into a spec.

## ไม่ใช้เมื่อ

| งาน | ใช้ตัวนี้แทน |
|---|---|
| มีซอร์สโค้ดแต่ไม่มีเอกสาร ต้องการ spec ของระบบเดิม | `legacy-spec-recovery` |
| มีซอร์สโค้ด แค่ยังไม่ได้อ่านส่วนที่จะแก้ | `code-orientation` |

## What works in practice

Effort depends almost entirely on what the target was built with. Classify first, then set expectations with the user.

| Target | Result to expect | Effort | Route |
|---|---|---|---|
| .NET (C#, VB.NET, Xamarin) | Near-original source: same logic, same SQL strings; comments and local names lost | Minutes | `ilspycmd` |
| Java, Kotlin, Android | Near-original source | Minutes | jadx, CFR, Vineflower |
| JavaScript, Electron | The code itself, often minified; source maps may give the original | Minutes | unpack, beautify |
| Python `.pyc`, PyInstaller | Usually recoverable for Python ≤ 3.8, partial after | Hours | pyinstxtractor, decompyle3 / pycdc |
| Native C, C++, Go, Rust | Pseudo-C only; names gone unless symbols exist | Days per feature | strings → imports → Ghidra |
| Obfuscated or packed | Depends on the protector; can stop the job | Unknown | identify the tool first, then ask |

Field test (2026-10, ASP.NET MVC app of about 55,000 lines): `ilspycmd` produced a C# project of 51,700 lines in 9 seconds. Compared against the real source, a cancel method matched statement for statement, and all 1,431 methods matched by name.

## Safety and legality

- Analyse only software the user owns or is authorised to analyse: their own or their client's systems, licensed software where the licence allows it, CTF targets, malware samples in a sandbox.
- Do not help bypass licensing, DRM, activation or access controls in third-party software.
- **Secrets come out with the code.** Connection strings, passwords and API keys sit in decompiled code and `.config` files. Name them, never paste their values — `triage.py` masks them in its output.
- Malware: static analysis only, unless the user explicitly asks for dynamic analysis in an isolated environment.
- Work on copies in a scratch folder. Never write decompiled output into the user's source tree; it is not the source of record.

## Workflow

### Step 1 — Triage

```bash
python -I scripts/triage.py <file>                          # format, architecture, next step
python -I scripts/triage.py <file> --pattern 'oauth|WHT'    # hunt a clue in strings (secrets masked)
```

It recognises PE, .NET, ELF, Mach-O, APK, IPA, JAR, ASAR, Power BI, Office, OLE (Crystal Reports, MSI), SSIS and config XML. For a .NET assembly it also reports a `.pdb` or `.config` lying beside it and known obfuscator markers.

Installers (7-Zip SFX, NSIS, MSI): extract first — strings inside are compressed noise. Packaging layouts and report and ETL formats: [references/packaging-patterns.md](references/packaging-patterns.md).

Confirm what the user wants before deep work: explain one feature, recover a format or algorithm, recover lost source, or check a deployed build against the repository.

### Step 2 — Decompile, cheapest first

1. **Strings and metadata.** Often enough on their own. In the field test, SQL statements embedded in a .NET dll — including commented-out ones — came out of the strings alone.
2. **Managed code (.NET, Java)** — go straight to the decompiler; it is cheap.
   ```bash
   dotnet tool install ilspycmd --tool-path <scratch>/tools --version <x>
   <scratch>/tools/ilspycmd -p -o <scratch>/out <file.dll>
   ```
   The newest `ilspycmd` needs the newest .NET SDK. If installation fails with *"DotnetToolSettings.xml was not found"*, pin an older version that matches an installed SDK (`dotnet --list-sdks`); for example, 9.1.0.7988 works with SDK 9. Install into the scratch folder, not globally.
3. **JavaScript/Electron** — `npx @electron/asar extract app.asar <out>`, beautify, look for `.map` files.
4. **Native** — imports and exports first (they reveal crypto, network and storage use), then Ghidra headless for the functions that matter. On Windows, prefer Python and Node scripts over assuming Unix tools exist.

Record each finding as evidence: file, offset, type or method, and what it suggests.

### Step 3 — Understand

Trace from clue to implementation: who references the string, which function contains it, what flows in and out. Write a short narrative: "feature X works by A calling B, storing in C, gated by D". Keep static reading separate from runtime observation, and mark unresolved links instead of guessing.

### Step 4 — Use the result

| Goal | Do this |
|---|---|
| Explain a feature | Narrative + evidence list (Step 5) |
| Lost source | Decompiled project goes to the user as a recovery, clearly labelled; then `legacy-spec-recovery` for the spec |
| **Deployed build vs repository (drift check)** | Decompile the production binary, then `python -I scripts/compare_members.py <decompiled> <source>` — lists methods only in the binary (hot-fixes never committed) or only in the source (not deployed). Then diff the bodies of the methods it flags. |
| Recreate in the user's stack | Only after the user confirms the understanding. Reimplement, do not copy proprietary code; standard algorithms and formats (JSON, zlib, AES) are fine to reuse |

`compare_members.py` was field-tested both ways: on a matching build it reported 1,431 shared methods and no differences, and a method renamed in a copy of the source was caught.

### Step 5 — Report

- **How it works**: the narrative, with evidence locations.
- **Evidence**: each claim tied to a file, offset or method.
- **Unknowns**: what could not be determined and what would resolve it.
- **Secrets seen**: key names and locations only — and tell the user they should be rotated if the binary or config has left their control.
- **Output**: where the decompiled files are, and how to verify any recreated feature.

## Rules of thumb

- Cheapest sufficient evidence wins: strings > managed decompiler > native decompiler > debugger.
- Prefer static analysis; do not run unknown binaries.
- Decompiled code is evidence, not the source. Label it that way wherever it is handed over.
- If triage reports an obfuscator, stop and tell the user what that means for effort before going on.


## reference: packaging-patterns.md

# Common application packaging patterns

Recognizing the packaging leads straight to the readable layer. Check these before touching a decompiler.

## Mozilla apps (Firefox, Thunderbird)

- Full Windows installer is a **7-Zip SFX stub** (small PE32, sections=3) with the app in an appended archive. `7z x setup.exe` extracts `core/` plus `setup.exe`.
- `core/application.ini` — version, BuildID, source repository and SourceStamp (build provenance evidence).
- `core/omni.ja` — ZIP archive (97MB+ for Thunderbird) holding nearly all app JavaScript (`modules/`, `chrome/`) and default prefs (`defaults/pref/*.js`). Extract with 7z; Grep it to trace features. `omni.ja` is usually the cheapest route to full answers.
- The big DLLs are the native layer: `xul.dll` (Gecko engine), `nss3.dll`/`freebl3.dll` (crypto), `rnp.dll` (OpenPGP), `libotr.dll` (chat encryption).
- `thunderbird.exe` itself is only a launcher stub.

## Electron / Node apps

- `app.asar` — ASAR archive; `npx @electron/asar extract app.asar outdir` (the old `asar` package name is deprecated). Renderer JS is often minified but readable; `.map` source maps may contain original source.
- `resources/app/package.json` names the app, entry point, and dependency list.
- Native modules: `*.node` files (PE DLLs) — treat as native binaries.

## .NET applications

- PE with a CLI header (triage reports `.NET / managed PE`). `ilspycmd -p -o <out> <dll>` gives a near-original C# project — field-tested: identical logic, SQL strings intact, only comments and local names lost.
- A `.pdb` beside the dll restores original file names and line numbers; a `.dll.config` holds settings (and often secrets).
- ASP.NET MVC with precompiled views: `.cshtml` come back as classes under `<Assembly>.Views.<Controller>`.
- Xamarin APK: the C# lives in `assemblies/*.dll` inside the APK (sometimes LZ4-compressed `XALZ`) — decompile those, not `classes.dex`.
- Check for bundled/single-file deployment (self-extracting extractors) — extract first.
- P/Invoke declarations map managed code to native DLL entry points.

## Android APK

- ZIP; contains `classes.dex` (Dalvik bytecode — use `jadx` or `apktool` for near-Java output), `AndroidManifest.xml` (binary XML — use `apktool` or `aapt`), `resources.arsc`, native libs under `lib/`.

## Windows installers generally

- 7-Zip SFX: extract with `7z x`.
- NSIS: extract with `7z x` (triage detects `NullsoftInstall` marker).
- MSI: `msiexec /a file.msi /qb TARGETDIR=<out>` or 7z.
- MSI transforms and stub downloaders may contain no payload — identify early to avoid wasted work.

## Enterprise report and ETL files

Often the only place a calculation lives. None need a decompiler.

| File | What it is | Readable layer |
|---|---|---|
| `.rpt` Crystal Reports | OLE compound file | `strings` shows SQL, table and field names; formulas need Crystal Designer or an RptToXml export |
| `.pbix` Power BI | ZIP | `Report/Layout` is UTF-16 JSON (pages, visuals, filters); measures in `DataModel` need pbi-tools or Tabular Editor |
| `.dtsx` SSIS | XML | Search `SqlCommand`, `ConnectionManager`, `DTS:ObjectName`; package order in the master package |
| `.rdl` SSRS | XML | `CommandText` per dataset |
| `.mdb` / `.accdb` | Access database | Queries and VBA modules; open with mdbtools or Access |


---

# skill: human-writing

Use when writing anything a person will read (answer, report, document, slide, label) in Thai or English.

# human-writing — เขียนภาษาคน อ่านลื่น เข้าใจง่าย

ใช้กับทุกอย่างที่คนจะอ่าน ตั้งแต่แชตถึงป้ายใน diagram · ตัวอย่างของทุกข้อและที่มา → [`headings-and-examples`](references/headings-and-examples.md) · ต้นฉบับอยู่ plugin `superuser` (แก้แล้วรัน `node scripts/sync/sync-superuser.mjs`)

## 1 · หลักใหญ่

- เขียนเหมือนอธิบายให้เพื่อนร่วมงานที่เก่งแต่ไม่ได้อยู่ในโปรเจกต์ฟัง ถ้าอ่านออกเสียงแล้วสะดุดให้เขียนใหม่
- คำตอบหรือข้อสรุปขึ้นก่อน แล้วค่อยเหตุผล ไม่เกริ่น ไม่ทวนคำถาม
- 1 ประโยค 1 ความคิด ถ้าต่อด้วย "ซึ่ง" "โดย" "จึง" หลายชั้น ให้แยกเป็นหลายประโยค
- ภาษาอังกฤษใช้หลักเดียวกัน: ประโยคไม่เกิน 25 คำ · ใครทำอะไร (active voice) · คำธรรมดา

## 2 · สัญลักษณ์และตัวเลข

- `→` ลำดับขั้นหรือผลที่ตามมา · `·` คั่นคำนามสั้นในบรรทัดเดียว · `:` ตามด้วยรายละเอียด · จำนวนทุกชนิดเขียนเป็นเลข · คำรอบสัญลักษณ์ต้องเป็นภาษาคน
- **เงื่อนไขและคำสั่งเขียนเป็นประโยคเต็ม มีคำเชื่อม** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ) ไม่ใช้ `→` หรือ `·` ต่อประโยคเป็นท่อน ๆ
- ในตารางใช้ข้อความสั้นได้ แต่ยังต้องอ่านเป็นภาษาคน ไม่ใช่รหัส
- สัญลักษณ์ห้ามแทนคำจนต้องถอดรหัส ถ้าคนนอกต้องเดาว่าลูกศรหมายถึงอะไร ให้เติมคำ
- ทุกตัวเลขบอกว่าหมายถึงอะไร · เทียบให้เห็นภาพ (เท่า อ่านง่ายกว่า %) · ผลยังไม่แน่นอนให้บอกตรง ๆ ว่าเพราะอะไร

## 3 · คำ

- ใช้คำที่คนพูดจริง ไม่ใช้คำราชการหรือศัพท์แปลตรงตัว
- ศัพท์ที่คนในวงการใช้อยู่แล้ว (token · prompt · API · OCR) คงภาษาอังกฤษไว้
- ตัวย่อเขียนเต็มครั้งแรกแล้ววงเล็บ จากนั้นใช้ตัวย่อ · คำที่ตั้งเองหรือชวนงง อธิบายครั้งแรกที่ใช้
- สิ่งเดียวกันเรียกคำเดียวทั้งชุด ทั้งแชต สไลด์ เอกสาร และ diagram
- ตัดคำฟุ่มเฟือย ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ")
- เลี่ยงท่าที่ดูเหมือน AI เขียน: คำคมเปิดเรื่อง · "ไม่ใช่แค่… แต่ยัง…" · จัดทุกอย่างเป็นชุดละ 3 · ชมว่าสำคัญเกินจริง · ตัวหนาทุกบรรทัด · สรุปซ้ำตอนจบ · เปิดด้วย "แน่นอน" · ปิดด้วย "หวังว่าจะช่วยได้" · ใช้ "หลาย" ทั้งที่รู้ตัวเลข · ออกตัวซ้อนหลายชั้น (ออกตัวครั้งเดียวตรงจุดที่ไม่แน่ใจจริง)

## 4 · ตอบในแชต

- ประโยคแรกตอบตรง ๆ แล้วค่อยเหตุผล
- คำถามสั้นให้ตอบสั้น 2–3 ประโยค ไม่ต้องมีหัวข้อหรือตาราง
- ใช้ตารางเมื่อเทียบตั้งแต่ 2 ตัวเลือกหรือหลายตัวเลข ส่วนรายการใช้เมื่อมีหลายข้อที่ต้องไล่อ่าน
- งานที่ทำแล้วบอกด้วยผล ไม่เล่าขั้นตอน
- เคยบอกผิดให้บอกว่าผิดตรงไหน ที่ถูกคืออะไร ไม่ขอโทษยืดยาว · ไม่แน่ใจให้บอกว่าตรงไหนและตรวจได้อย่างไร ไม่เดาให้ฟังดูมั่นใจ
- ให้ผู้ใช้ตัดสินใจ: เสนอตัวเลือก บอกข้อที่แนะนำและเหตุผล ปิดด้วยคำถามเดียวที่ตอบง่าย
- ยาวเกิน 1 หน้าจอ: ตอบส่วนสำคัญก่อน เสนอฉบับละเอียดไว้ 1 บรรทัด (ไม่หยุดถาม)
- ผู้ใช้บอก "งง" หรือ "พูดง่าย ๆ": เขียนคำตอบล่าสุดใหม่ สั้นลงครึ่งหนึ่ง ไม่มีศัพท์ที่ไม่ได้อธิบาย ไม่เพิ่มเนื้อหา
- ลงท้ายด้วยสิ่งที่ทำต่อได้จริง 1 อย่าง ไม่สรุปซ้ำ
- **ตอบจากเอกสารหรือเว็บ** — เล่าใหม่ด้วยคำของตัวเอง ไม่แปลทีละประโยค · เหตุต่อผลในย่อหน้าเดียว · ข้อยกเว้นเล็กใส่วงเล็บ · ป้ายตัวหนา 2–3 อันพอ · ที่มารวมไว้ท้ายคำตอบ

## 5 · เอกสารและรายงาน

- ย่อหน้าแรกคือข้อสรุป อ่านแค่ย่อหน้านี้ต้องได้เรื่อง
- หัวข้อบอกเนื้อหา ไม่ใช่ชื่อหมวด · ย่อหน้าละไม่เกิน 5 ประโยค
- หัวคอลัมน์บอกว่าวัดอะไร · 1 คอลัมน์ 1 ความหมาย
- เชิงอรรถมีไว้สำหรับนิยามและที่มาของตัวเลข · ข้อสรุปสำคัญห้ามซ่อนในเชิงอรรถ
- รายงานสถานะ: ผลต่อคนใช้ก่อน → ตารางสถานะ → สิ่งที่รออนุมัติ และทุกข้ออ้างติดป้าย `ตรวจจริง` · `อนุมาน` · `เดา`
- เอกสารตามแบบ (หนังสือราชการ · สัญญา · ใบกำกับภาษี) ใช้ถ้อยคำตามแบบ ไฟล์นี้ใช้กับส่วนที่เขียนเองได้

## 6 · สไลด์ และหัวข้อทุกชนิด

ใช้กับหัวสไลด์ ชื่อรูป หัวข้อเอกสาร และหัวกล่องใน diagram · กฎเต็มและตาราง 17 แถวอยู่ใน reference เดียวกัน

- หัวสไลด์ = ข้อสรุปของหน้า ไม่ใช่ชื่อหัวข้อ · ไม่เกิน 2 บรรทัด (ราว 15 คำ) รายละเอียดลงเนื้อหน้า
- **หัวที่มี 2 ท่อนต้องมีคำเชื่อมที่ตรงกับความสัมพันธ์จริง** ("เพราะ" หรือ "จึง" เมื่อเป็นเหตุผล · "ส่วน" เมื่อแบ่งหน้าที่ · "แต่" เมื่อขัดกัน) · 1 หัว 1 คำเชื่อม ถ้าต้องใช้ 2 แปลว่ายัดเกิน
- ใช้วลีที่คนพูดจริง ไม่ใช่คำนามเรียงกัน · เลือกคำตามคนอ่าน
- กริยาตรงกับสิ่งที่หน้านั้นแสดง · ไม่ใช้ "คน" กับสิ่งที่ไม่ใช่คน
- บรรทัดใต้รูปต้องบอกสิ่งที่รูปไม่ได้บอก ถ้าซ้ำกับรูปให้ตัด · โครงหน้า ปัญหา → วิธีแก้ → ผล · สคริปต์พูดเขียนแบบที่พูดจริง
- **ทดสอบ:** อ่านหัวให้คนนอกฟังครั้งเดียว ถ้าเขาเล่าต่อไม่ได้ ให้เขียนใหม่

## 7 · Diagram

- ป้ายในกล่องเป็นคำนามสั้น 1–4 คำที่คนเข้าใจ · ป้ายบนลูกศรเป็นกริยา · ลูกศรไม่มีป้ายต้องเดาไม่ผิด
- คำในรูปตรงกับเอกสาร · ชื่อรูปเป็นข้อสรุป ใต้รูป 1 ประโยคบอกว่าควรดูอะไร · มี house style ให้ใช้ตามนั้น

## 9 · ตรวจก่อนส่ง 6 ข้อ

1. อ่านออกเสียงแล้วลื่นไหม · ไม่เหมือนภาษาแปล
2. คนนอกอ่านแล้วเข้าใจโดยไม่ต้องถามไหม · สัญลักษณ์ทุกตัวอ่านออกไหม
3. ประโยคแรกตอบคำถามหรือบอกข้อสรุปแล้วหรือยัง
4. ศัพท์และตัวเลขตรงกันทุกไฟล์ในชุดเดียวกันไหม
5. มีคำไหนตัดออกได้โดยความหมายไม่เปลี่ยนไหม ถ้ามีให้ตัด
6. หัวข้อทุกอันผ่านหัวข้อ 6: 2 ท่อนมีคำเชื่อม · เป็นวลีที่คนพูด · คำเหมาะกับคนอ่าน · กริยาตรงกับที่รูปแสดง


## reference: headings-and-examples.md

# หัวข้อ · สไลด์ · diagram และตัวอย่าง ก่อน → หลัง (ฉบับเต็ม)

อ่านเมื่อเขียนหัวสไลด์ ชื่อรูป ป้ายใน diagram หรืออยากดูตัวอย่างการแก้ · กฎย่ออยู่ใน `SKILL.md` ข้อ 6–7

ไฟล์นี้เหมือนกันทุก plugin ต้นฉบับอยู่ที่ plugin `superuser` แก้ที่นั่นแล้วรัน `node scripts/sync/sync-superuser.mjs`

## สไลด์ และหัวข้อทุกชนิด

- หัวสไลด์ = ข้อสรุปของหน้า ไม่ใช่ชื่อหัวข้อ: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"

**เขียนหัวให้ลื่น ไม่กำกวม** — ใช้กับหัวสไลด์ ชื่อรูป หัวข้อเอกสาร และหัวกล่องใน diagram

- **หัวที่มี 2 ท่อนต้องมีคำเชื่อม** (ส่วน · แต่ · เพราะ · จึง) ห้ามวาง 2 วลีเรียงกันเฉย ๆ เพราะคนอ่านต้องเดาเองว่า 2 ท่อนเกี่ยวกันอย่างไร
- **คำเชื่อมต้องตรงกับความสัมพันธ์จริง** ใช้ "เพราะ" หรือ "จึง" เฉพาะเมื่อท่อนหนึ่งเป็นเหตุของอีกท่อนจริง ถ้า 2 ท่อนแค่แบ่งหน้าที่กัน ใช้ "ส่วน" ถ้าขัดกัน ใช้ "แต่" · หัวหนึ่งใช้คำเชื่อมได้ 1 คำ ถ้าต้องใช้ 2 คำแปลว่ายัดเกินไป ให้ตัดเหลือเรื่องเดียว
- **หัวยังต้องสั้น** หัวสไลด์ไม่เกิน 2 บรรทัด (ประมาณ 15 คำ) ถ้ายาวกว่านี้ ให้ตัดรายละเอียดลงไปในเนื้อหน้า อย่าเติมคำเชื่อมจนกลายเป็นย่อหน้า
- **ใช้วลีที่คนพูดจริง** ถ้าย่อจนกลายเป็นคำนามเรียงกัน เช่น "AI ทำงานภาษา" ให้หากริยาที่คนใช้จริง เช่น "AI ช่วยเขียนคำตอบ"
- **เลือกคำตามคนอ่าน** ถ้าผู้อ่านไม่ใช่สายเทคนิค ใช้ "ระบบ" แทน "โค้ด" ใช้ "ตรวจขาเข้า" แทน "Guard" ส่วนศัพท์เทคนิคใช้ได้เมื่อผู้อ่านเป็นทีมเทคนิค
- **กริยาต้องตรงกับสิ่งที่หน้านั้นแสดง** ถ้ากล่องในรูปคือขั้นตรวจ ให้ใช้ "ตรวจ" หรือ "ตัดสิน" ไม่ใช้ "ตัดสินใจ" ซึ่งให้ความรู้สึกว่าเป็นการเลือกทาง
- **ไม่ใช้ "คน" กับสิ่งที่ไม่ใช่คน**: "ระบบเป็นคนตัดสิน" → "ให้ระบบตัดสิน"
- **บรรทัดสรุปใต้รูปต้องบอกสิ่งที่รูปไม่ได้บอก** ถ้าเป็นแค่ลูกศรไล่ขั้นซ้ำกับรูป ให้ตัดทิ้ง หรือเปลี่ยนเป็นประโยคเดียวที่บอกว่าทำไมรูปนี้สำคัญ
- **ทดสอบ**: อ่านหัวให้คนนอกโปรเจกต์ฟังครั้งเดียว ถ้าเขาเล่าต่อด้วยคำของตัวเองไม่ได้ หรือต้องถามว่า "หมายถึงอะไร" ให้เขียนใหม่
- โครงหน้า: ปัญหา → วิธีแก้ → ผล · แต่ละส่วนอ่านจบในแวบเดียว
- สคริปต์พูดเขียนแบบที่พูดจริง อ่านออกเสียงได้ไม่สะดุด

## Diagram

- ป้ายในกล่องเป็นคำนามสั้น 1–4 คำ ที่คนเข้าใจ: "รับข้อมูลเข้า" ไม่ใช่ "Ingress Layer Handler"
- ป้ายบนลูกศรเป็นกริยา: "ส่งไฟล์" · "ตรวจสิทธิ์" · ลูกศรที่ไม่มีป้ายต้องเดาไม่ผิด
- คำในรูปต้องตรงกับคำในเอกสารทุกคำ
- ชื่อรูปเป็นข้อสรุป เหมือนหัวสไลด์ · ใต้รูปมี 1 ประโยคบอกว่าควรดูอะไร
- ถ้าโปรเจกต์มีแบบรูปประจำ (house style) ให้ใช้ตามนั้น ส่วนวิธีวาดดูใน skill รูปของ plugin นั้น

## ตัวอย่าง ก่อน → หลัง

เงื่อนไขเขียนเป็นประโยคเต็ม มีคำเชื่อม (ข้อ 2):

  - ก่อน: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - หลัง: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - ก่อน: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - หลัง: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`

| ก่อน | หลัง |
|---|---|
| ขอบระบบ (รับ input) → service (กฎธุรกิจ) → data | แยกโค้ด 3 ชั้น: รับข้อมูลเข้า → กฎธุรกิจ → เก็บข้อมูล |
| ตรวจ input ที่ขอบ · พังแบบปิด | ตรวจข้อมูลจากภายนอกทันทีที่เข้ามา ถ้าเกิดข้อผิดพลาดให้ปฏิเสธไว้ก่อน |
| เล็กพลาดหรือตรวจไม่ผ่าน → ขยับขึ้นหนึ่งระดับ | ถ้าโมเดลเล็กทำพลาด ให้ขยับขึ้น 1 ระดับ ไม่ลองซ้ำกับตัวเดิม |
| มีผลเหนือค่าเริ่มของ playbook แต่ไม่เหนือรายการ "รออนุมัติ" | ถ้าไฟล์นี้กับ playbook ขัดกัน ให้ทำตามไฟล์นี้ ยกเว้นเรื่องที่ต้องรออนุมัติ |
| เมื่อความต้องการมีการนำเข้าหรือส่งออกไฟล์ | เมื่องานต้องนำเข้าหรือส่งออกไฟล์ |
| ทุกข้อความผ่าน 8 ขั้น: AI ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ | ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน |
| Guard ขาเข้า (ในรูปที่ทำให้คนทั่วไปดู) | ตรวจขาเข้า |
| guard ขาเข้า → ค้นคลังความรู้ → แนบกฎร้าน → Typhoon → guard ขาออก (บรรทัดใต้รูปที่ซ้ำกับรูป) | AI มีหน้าที่เขียนให้อ่านง่าย ส่วนเรื่องเงิน เวลา และกฎร้าน ระบบตรวจทุกครั้ง |
| ทีมที่ดีไม่ได้เก่งเพราะแต่ละคนเก่ง แต่เพราะ… | วิธีทำงานของทีม: เลือกแผน → แจกงาน → ตรวจผล → จดบันทึก |
| คำค้น 12/12 จากประกาศงานอยู่ใน CV | คำค้นจากประกาศงานอยู่ใน CV ครบ 12 คำ · ตรวจแล้ว |
| margin 32–35% หลังทุกค่าธรรมเนียม | หักค่าธรรมเนียมแล้วเหลือกำไร 32–35% ของราคาขาย |
| hook จะทำงานเฉพาะโฟลเดอร์ที่มีการสร้างโฟลเดอร์ .claude/superuser ไว้แล้วเท่านั้น | hook (สคริปต์จด log) ทำงานเฉพาะโฟลเดอร์ที่มี `.claude/superuser/` |
| ตรวจด้วย validate ผ่าน ไม่มี error และ warning แต่ยังต้อง build ใหม่ | ตัวตรวจผ่านหมด · เหลือ build ใหม่บนเครื่องคุณ |
| `${CLAUDE_PLUGIN_ROOT}` คือ path ของ version ที่ติดตั้งอยู่ และจะเปลี่ยนเมื่อ plugin อัปเดต ส่วนโฟลเดอร์เก่าระบบจะลบทิ้งเองภายหลัง [ที่มา] | แต่ละ version ติดตั้งเป็นโฟลเดอร์ของตัวเอง พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่ แล้วลบโฟลเดอร์เก่าทิ้ง |
| ข้อยกเว้น: plugin จาก marketplace บน claude.ai … จะไม่ถูก pin ด้วยฟิลด์นี้ (แยกย่อหน้า) | … ไม่งั้นเครื่องที่ลงไว้จะใช้ชุดเก่าต่อ (ยกเว้น plugin จาก marketplace บน claude.ai ซึ่งเห็นการแก้ทันที) |

## ตัวอย่างประกอบกฎใน SKILL.md (ย้ายมาจาก SKILL.md)

| หัวข้อ | กฎ | ตัวอย่าง |
|---|---|---|
| 1 | คำธรรมดา (อังกฤษ) | buy ไม่ใช่ purchase |
| 2 | `→` ลำดับขั้น | เข้าใจ → วางแผน → ลงมือ |
| 2 | `·` คั่นคำนาม | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| 2 | `:` ตามด้วยรายละเอียด | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| 2 | ตัวเลขเขียนเป็นเลข | 3 ชั้น · 12 คำ · 1 ระดับ |
| 2 | ตัวเลขบอกความหมาย | "กำไร 32% ของราคาขาย" ไม่ใช่ "margin 32%" ลอย ๆ |
| 2 | เทียบให้เห็นภาพ | "เร็วขึ้น 3.2 เท่า" อ่านง่ายกว่า "ลดลง 69%" |
| 2 | ผลยังไม่แน่นอน | "รันรอบเดียว ยังสรุปไม่ได้" |
| 3 | คำที่คนพูดจริง | "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ" |
| 3 | ตัวย่อครั้งแรก | Large Language Model (LLM) |
| 3 | คำที่ตั้งเอง | "hook (สคริปต์จด log อัตโนมัติ)" |
| 3 | ตัดคำฟุ่มเฟือย | "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" |
| 3 | ออกตัวซ้อน | อาจจะ · น่าจะ · ในบางกรณี ในประโยคเดียว |
| 4 | ประโยคแรกตอบตรง | ถาม "ใส่ในรายงานดีไหม" → "ควรใส่ครับ" แล้วค่อยเหตุผล |
| 4 | บอกด้วยผล | "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ" |
| 4 | เหตุต่อผลในย่อหน้าเดียว | "แต่ละ version ติดตั้งแยกโฟลเดอร์ พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่แล้วลบของเก่า skill ที่ลบออกจึงหายไป" |
| 4 | ป้ายตัวหนา | **ระวัง:** · **สิ่งที่ยังอยู่:** ไม่ใช่ "**ระวัง (เจอบ่อย):**" |
| 5 | หัวข้อบอกเนื้อหา | "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" ดีกว่า "ผลการทดลอง" |
| 5 | หัวคอลัมน์ | "เรียก LLM" · "คำตอบไม่ผ่านกฎ" |
| 6 | วลีที่คนพูด | "AI ช่วยเขียนคำตอบ" ไม่ใช่ "AI ทำงานภาษา" |
| 6 | คำตามคนอ่าน | คนทั่วไป: "ระบบ" "ตรวจขาเข้า" แทน "โค้ด" "Guard" |
| 6 | ไม่ใช้ "คน" กับสิ่งที่ไม่ใช่คน | "ให้ระบบตัดสิน" |

ที่มา: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย


---

# skill: answer-shape

Use when an answer has structure (options, trade-offs, how parts connect). Prose, table or diagram.

# รูปทรงของคำตอบ

skill นี้บอกรูปทรงและโครง ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) · ต้นฉบับอยู่ที่ plugin `superuser` (แก้ที่นั่นแล้วรัน `node scripts/sync/sync-superuser.mjs`)

> **กฎข้อเดียว:** เนื้อหามีโครงสร้างอะไร คำตอบใช้รูปทรงนั้น
> เปรียบเทียบ → ตาราง · เชื่อมโยง → รูป · เรื่องเดียว → ประโยค

---

## เลือกรูปทรงจากสัญญาณในคำถาม

| สัญญาณ | รูปทรง |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" | **ตารางเปรียบเทียบ** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" | **รูป** |
| "มีอะไรบ้าง" ที่ไม่ได้เทียบกัน | **รายการหัวข้อย่อย** |
| "ทำไม" · "แปลว่าอะไร" · เรื่องเดียวไม่มีแขนง | **ประโยคธรรมดา** |
| ตัวเลขหลายตัวที่ต้องดูพร้อมกัน | **ตาราง** |
| ขั้นตอนที่ต้องทำเรียงกัน | **รายการมีเลข** |

**สัญญาณสำคัญที่สุดคือมี "สิ่งที่ถูกเทียบ" ตั้งแต่ 2 ตัวขึ้นไป** แบบนี้ให้ใช้ตาราง
เพราะถ้าเขียนเป็นย่อหน้า ผู้อ่านต้องจำตัวแรกไว้ในหัวระหว่างอ่านตัวที่ 2

---

## ตารางที่อ่านง่าย

- **คอลัมน์แรกคือสิ่งที่ถูกเทียบ** คอลัมน์ถัดไปคือแง่มุมที่เทียบ
- **3–5 คอลัมน์** เกินนี้อ่านไม่ทัน ส่วนแถวไม่เกิน 8 แถวในคำตอบแชต
- **ทุกช่องต้องมีเนื้อ** — ช่องว่างแปลว่าคอลัมน์นั้นไม่ควรมี หรือข้อมูลยังไม่ครบ ถ้าไม่มีข้อมูลให้เขียนว่า "ไม่มี" ตรง ๆ · ช่องที่เขียน "ขึ้นอยู่กับ" ทุกช่องก็ไม่มีเนื้อ
- **ช่องละไม่เกิน 1 บรรทัด** ถ้ายาวกว่านั้นให้ยกไปเขียนใต้ตาราง
- **เรียงแถวตามน้ำหนัก** ตัวที่แนะนำหรือตัวที่ใช้บ่อยที่สุดอยู่บนสุด ไม่ใช่เรียงตามตัวอักษร
- **หัวคอลัมน์เป็นคำถามที่ผู้อ่านมีในหัว** ไม่ใช่ชื่อสาขาวิชา

```
❌ | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
✅ | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

**ปิดท้ายตารางด้วยข้อสรุป 1 บรรทัดเสมอ** — ตารางบอกข้อมูล ไม่ได้บอกว่าควรเลือกอะไร

---

## เมื่อไหร่รูปชนะตาราง

ใช้รูปเมื่อ**ความสัมพันธ์คือคำตอบ** — ตารางบอกคุณสมบัติได้ แต่บอกไม่ได้ว่าอะไรต่อกับอะไร

| ใช้รูป | ใช้ตาราง |
|---|---|
| อะไรต่อกับอะไร · อะไรอยู่ในอะไร | ตัวไหนดีกว่าตัวไหนในแง่ใด |
| ลำดับที่มีทางแยกหรือวนกลับ | ขั้นตอนเรียงตรงไม่มีแขนง (ใช้รายการมีเลขพอ) |
| สิ่งเดียวกันในหลายสถานะ | สิ่งต่างกันในแง่มุมเดียวกัน |

ในแชต **รูปเล็ก ๆ แบบ ASCII หรือ Mermaid สั้น ๆ ก็พอ** — ไม่ต้องเปิดเครื่องมือวาด

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

รูปที่ต้องเป็นไฟล์จริงเพื่อใส่เอกสารหรือสไลด์ ให้ใช้ skill วาดรูปของ plugin นั้น (ถ้ามี)

---

## เมื่อไหร่ประโยคชนะทั้งคู่

- คำตอบสั้นกว่า 3 บรรทัด — ตาราง 2 แถวเป็นแค่การตกแต่ง ไม่ได้อธิบายอะไร
- คำถามที่ตอบว่า "ใช่" หรือ "ไม่ใช่" แล้วตามด้วยเหตุผล 1 ประโยค
- เรื่องที่**เหตุผลสำคัญกว่าตัวเลือก** — ตารางจะตัดเหตุผลทิ้งเพื่อให้พอดีช่อง

> ตารางที่มีแถวเดียวหรือ 2 แถวสั้น ๆ แปลว่าใช้ผิดรูปทรง · รูปที่วาดสิ่งที่ประโยคเดียวบอกได้ก็เช่นกัน

---

## ตัวย่อ

- **ASCII** — American Standard Code for Information Interchange (การวาดรูปด้วยตัวอักษรธรรมดา)
- **Mermaid** — ภาษาเขียนไดอะแกรมเป็นข้อความ แล้วให้โปรแกรมวาดให้


---

# skill: spell-out-abbreviations

Use when writing anything for a person (docs, commits, replies, UI text). Spell out abbreviations.

# Spell Out Abbreviations

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อ 1:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้
> **กฎข้อ 2:** ศัพท์เฉพาะทุกคำ วงเล็บคำอธิบายสั้น ๆ ไว้ครั้งแรก — ผู้อ่านนอกสายจะได้ไม่ต้องเดา

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็มแล้ววงเล็บตัวย่อ ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่มีที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) ถ้าไม่แน่ใจ **ให้ขยาย** เพราะขยายเกินไม่เสียหาย แต่คนอ่านไม่รู้เรื่องเสียหาย

## ศัพท์เฉพาะ — วงเล็บคำอธิบาย ไม่ใช่แค่ตัวย่อ

ขยายตัวย่อแล้วอาจยังไม่พอ ถ้าชื่อเต็มก็ยังไม่บอกอะไร **คำที่ผู้อ่านนอกสายไม่รู้จัก
ต้องมีคำอธิบายสั้นในวงเล็บครั้งแรก**

```
❌ ใช้ idempotency key กันงานซ้ำ
✅ ใช้ idempotency key (รหัสกำกับคำขอ ส่งซ้ำแล้วไม่ทำงานซ้ำ) กันงานซ้ำ

❌ ต้องทำ expand-contract ตอน migrate
✅ ต้องทำ expand-contract (ทยอยเพิ่มของใหม่ก่อน ค่อยลบของเก่าทีหลัง) ตอนเปลี่ยนโครงฐานข้อมูล
```

**คำอธิบายต้องสั้นกว่า 1 บรรทัด** ถ้ายาวกว่านั้นให้แยกเป็นประโยคของตัวเอง

**วัดว่าคำไหนต้องอธิบาย** ด้วยคำถามเดียว — คนที่ทำงานคนละสายกับเรื่องนี้
อ่านแล้วเดาความหมายได้ไหม ถ้าเดาไม่ได้ก็ต้องอธิบาย

| ระดับผู้อ่าน | อธิบายแค่ไหน |
|---|---|
| ลูกค้า ผู้บริหาร คนนอกสาย | ศัพท์เทคนิคทุกคำ แม้แต่คำที่ช่างใช้กันทุกวัน |
| ทีมพัฒนาแต่คนละส่วน | เฉพาะคำเฉพาะของส่วนนั้น เช่น ชื่อรูปแบบ ชื่อกระบวนการ |
| คนที่ทำเรื่องนี้อยู่แล้ว | เฉพาะคำที่เพิ่งตั้งขึ้นใหม่ในโปรเจกต์นี้ |

---

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · คอมเมนต์ในโค้ด · ข้อความ commit · ข้อความบนหน้าจอ · คำอธิบายไดอะแกรม ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## Anti-patterns

- ❌ ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- ❌ วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ❌ ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
- ❌ ขยายตัวย่อครบแต่ปล่อยศัพท์เฉพาะลอย — `Quadratic Weighted Kappa (QWK)` ยังไม่ช่วยใครถ้าไม่บอกว่ามันวัดอะไร
- ❌ อธิบายยาวเป็นย่อหน้าในวงเล็บ — วงเล็บไว้ให้คำสั้น ๆ ถ้ายาวให้แยกประโยค
