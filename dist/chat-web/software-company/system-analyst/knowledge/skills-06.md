# skill: legacy-spec-recovery

Use when a legacy system has source code but no spec or documents and someone wants to change it — recovers an as-is spec with evidence and confidence labels, then handles change requests with impact analysis.

# Legacy Spec Recovery

Turn an undocumented system into an as-is spec that a change request can be measured against. The code says **what** the system does; it cannot say whether that was **intended**. Every claim therefore carries a source and a confidence label, and everything the code cannot answer becomes a question for a person.

Use `reverse-engineering` instead when there is no source code, only binaries.

## The four rules

1. **Every claim has a source.** `path:line`, a table name, a manual page — or it is not written down.
2. **Every claim has a label.**

   | Label | Meaning | Example |
   |---|---|---|
   | ✅ code | Read in code or schema, can point to the line | `BookingContext.cs:412` rejects a booking when `QTY > 0` is false |
   | 📄 doc | Stated in a manual or old document, not checked against code | User manual p.7 says approval needs 2 levels |
   | 🟡 inferred | Guessed from names, UI text or data shape | Column `STS = 'C'` probably means cancelled |
   | ❓ ask | Code cannot answer — goes to the question list | Is the 3-day limit a business rule or a bug workaround? |

   When 📄 and ✅ disagree, record both and raise a ❓. That disagreement is often the most valuable finding.
3. **Wide and shallow first, deep only where a change will land.** Map the whole system at module level; write screen-level detail only for modules a change request touches. Coverage grows one change request at a time.
4. **Read only, outside the source tree.** Never edit, build, run migrations or execute the legacy system to "see what happens". Write output next to the code (`docs/as-is/`), not inside it. Never copy secrets: name a connection string or key, never its value.

## Where the evidence hides

Look in every layer — business rules in legacy systems are spread thin, not kept in one place.

| Layer | What to pull out |
|---|---|
| Routes, controllers, forms | Screen list, actions, who may call them |
| Data access code, stored procedures, views, triggers | The real rules: filters, status changes, calculations |
| Schema scripts, ORM models, `INFORMATION_SCHEMA` exports | Tables, keys, status code columns |
| Views and client scripts (`.cshtml`, `.aspx`, `.js`) | Validation the server never repeats, hidden fields, labels that name the business concept |
| Config files | Integrations, feature switches, environment names |
| Reports (`.rpt`, `.rdl`, `.pbix`) and ETL packages (SSIS, cron, jobs) | Calculations that exist only there, schedules |
| Enums and constant classes | The status vocabulary — decode it once, reuse everywhere |
| User manuals, old emails, ticket history | 📄 intent, to compare with ✅ behaviour |
| Commented-out code, `_old`, `Copy of` files | Previous rules; note them, do not treat as current |

Stack-specific locations: [references/evidence-by-stack.md](references/evidence-by-stack.md).

## Workflow

### Step 1 — Inventory (one pass, no reading of logic)

Count before reading. File counts by type, projects or modules, largest files, generated folders to ignore (`bin/`, `obj/`, `node_modules/`, publish output, vendored plugins). Write it to `docs/as-is/README.md` as a coverage table: every module listed, depth = none.

**Ask for the database scripts on day one.** Code calls stored procedures, views, triggers and functions whose source is usually not in the repository — and that is where tariff, tax and numbering rules live. Request a script-out of all database objects (and an export of menu and role tables if menus come from the database) before Step 2; until it arrives, those rules can only be 🟡 or ❓, and the coverage table must say so.

If the system is larger than one context can hold (it usually is), hand each layer to a subagent and tell it exactly what to bring back: a table with columns and the `path:line` per row, written to a file — not prose, not file dumps. Seven layers worked in practice: screens and permissions · data and status codes · one deep-dive module · rules for each half of the modules · integrations, jobs, reports and ETL · manuals. Then one analyst assembles. Budget for it: a system of about 55,000 lines took 8 subagents and about 2 million tokens.

### Step 2 — System map (whole system, shallow)

Produce, using the existing skills for format:

| File | Content | Skill |
|---|---|---|
| `01-system-overview.md` | Purpose in one paragraph, context diagram, components, integrations, tech stack and versions | `software-diagrams` |
| `02-module-inventory.md` | Module → screens / endpoints / reports / jobs → main tables | — |
| `03-data-dictionary.md` | Tables grouped by module, key columns, status codes decoded, core ER diagram | `database-design` |
| `04-business-rules.md` | Rule register — [assets/business-rule-register.md](assets/business-rule-register.md) | — |
| `05-open-questions.md` | Every ❓, grouped by who can answer, top 5 first | — |
| `06-findings.md` | Defects and security weaknesses found on the way — not rules | `security-gate` severity |

**Documenting a legacy system always turns up bugs and security holes.** Keep them out of the rule register: a rule is what the system does on purpose, a finding is what it does wrong. When unsure which, it is a ❓. `06-findings.md` gives location and a one-line fix, never exploitation steps or secret values, and is marked for the system owner only. Check these in every legacy web system, they are nearly always present: permission enforced only by hiding buttons, server never re-checking status order, SQL built by joining user input, secrets in config files under version control, document numbers issued without a lock.

### Step 3 — Deep dive (only the module a change touches)

`modules/<module>.md` at the level of `fsd-writing`: each screen, its fields and validation with the exact error text, status transitions as a state diagram, the queries behind each list, and every rule found added to the register with its ID. Keep the label on each line.

Then propose **characterization tests** — tests that record what the system does today so a change that breaks something else is caught. For legacy code that cannot be unit-tested, record at the edge: fixed inputs to a stored procedure, view or report, and the output saved as a golden file to compare after the change. List them; build them only when asked, and never against production data.

### Step 4 — Change request

For each request, fill [assets/change-request.md](assets/change-request.md):

1. Restate the request as a before/after against the as-is spec: which rule IDs, screens and tables change.
2. Impact: search the code for every table, column, procedure and status code touched, and list each hit. Callers outside the main application — reports, ETL, mobile clients, other systems reading the same database — are the ones usually missed.
3. Open ❓ items that block the change go to the requester first.
4. The characterization tests for the touched area must pass before and after.
5. After the change ships, update the as-is spec — it is now the to-be.

## Rules of thumb

- Name things the way the users do. Take screen titles and menu labels from the views, not class names.
- Decode a status code once in the data dictionary and link to it; never re-explain it per screen.
- Dead code is a finding, not a rule. Check whether a route is reachable from the menu before documenting the screen.
- Copy-pasted logic that differs slightly between modules is a ❓, not two rules — ask which one is right.
- Stop a module at the depth the change needs. A finished spec of a module nobody will change is waste.
- Report what was not read. The coverage table in the README is part of the deliverable.
- Status values hard-coded as strings with no enum are common. Harvest them with a search for quoted upper-case literals next to status columns, then decode them once in the data dictionary.
- Manuals lie by omission. Check for one manual that is a copy of another, or a cover page with nothing behind it. Scanned Thai PDFs often have no text layer, so they have to be read page by page as images — slow, so give them their own subagent.
- The order of the process across screens is rarely written anywhere. Rebuild it from which status each screen lists, not from the manual's table of contents.


## reference: evidence-by-stack.md

# Where evidence lives, by stack

Ignore build output everywhere: `bin/`, `obj/`, `publish*/`, `dist/`, `build/`, `node_modules/`, `packages/`, `vendor/`, minified `*.min.js`, and third-party plugin folders. They duplicate source and can triple every count.

## ASP.NET MVC / Web API (.NET Framework)

| Look at | For |
|---|---|
| `Controllers/*.cs` — each public method returning `ActionResult` / `JsonResult` | Screen and endpoint list; `[Authorize(Roles=...)]` and custom filters for permissions |
| `Models/*Context.cs`, `*Repository.cs`, any `SqlCommand` / `ExecuteReader` / Dapper call | Inline SQL and stored procedure names — the real rules |
| `Views/<Controller>/*.cshtml` | Screen title, field labels, client validation, which actions the form posts to |
| `Views/Shared/_Layout.cshtml`, menu partials | Which screens are reachable, and by which role |
| `Web.config` — `connectionStrings`, `appSettings`, `system.serviceModel` | Databases, integrations (SAP RFC, SOAP, mail), switches. Names only, never values |
| `App_Start/RouteConfig.cs`, `FilterConfig.cs`, `Startup.Auth.cs` | Routing quirks, global filters, login method |
| `*.asmx`, `*.svc` | SOAP services other systems call into |
| `*.rpt` (Crystal Reports) | Formulas and record selection hidden inside the binary; list them, ask for an export if needed |

## SQL Server

| Look at | For |
|---|---|
| Schema scripts, `INFORMATION_SCHEMA.COLUMNS` exports | Data dictionary |
| Stored procedures, views, functions, triggers | Rules that run regardless of which application writes |
| SSIS packages (`.dtsx`) | Imports, exports, schedules, transformations — open as XML, search `SqlCommand` and connection names |
| SQL Agent jobs | When batch rules run |

## Other common stacks

| Stack | First places to look |
|---|---|
| Classic ASP / Web Forms | `.aspx` + code-behind, `Page_Load`, `Button_Click`, `include` files |
| PHP | Entry scripts, `include`/`require` chains, raw `mysqli_query` strings |
| Java EE / Spring | `@Controller`/`@RequestMapping`, `*Mapper.xml` (MyBatis), `persistence.xml`, `@Scheduled` |
| VB6 / Access / Delphi | Forms, modules, embedded queries — often only the database is readable; start there |
| COBOL / RPG | Copybooks for record layouts, JCL for job flow |
| Node / JavaScript SPA | Router config, API client module, form schemas, `.env.example` |
| Mobile (Xamarin, native) | API base URL and endpoint list, offline storage schema |


---

# skill: flag-and-propose

Use when something found mid-task changes what happens next (stale file, mismatched number, blocked step) and needs a decision. Consequence first, one question.

# แจ้งสิ่งที่เจอ แล้วเสนอทางไป

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียว:** เปิดด้วย**ผลกระทบ** ปิดด้วย**คำถามเดียว**
> ตรงกลางคือหลักฐานกับข้อเสนอ ไม่ใช่การเล่าว่าเจอมาได้ยังไง

## เมื่อไหร่ใช้ skill นี้

- เจอของที่ทำให้แผนเดิมใช้ไม่ได้ ระหว่างทำงานอย่างอื่นอยู่
- ตัวเลข ไฟล์ หรือเอกสารไม่ตรงกัน แล้วต้องรู้ว่าจะยึดอันไหน
- มีทางไปต่อหลายทาง และต้องให้ผู้ใช้เลือกก่อนถึงจะทำต่อได้
- เสนอให้เพิ่มหรือเปลี่ยนอะไรบางอย่าง ที่ผู้ใช้ยังไม่ได้ขอ

## เมื่อไหร่ **ไม่** ใช้

| สถานการณ์ | ใช้ตัวนี้แทน |
|---|---|
| ตอบคำถามที่ผู้ใช้ถามมา | `answer-shape` |
| รายงานผลงานที่ทำเสร็จแล้ว | `anthropic-skills:short-answers` |
| อธิบายเรื่องซับซ้อนให้เข้าใจ | `anthropic-skills:direct-answers` |
| เขียนเป็นเอกสารให้คนอื่นอ่าน | `polished-document-style` |
| งานพังจริงและต้องแก้ทันที | `targeted-fix` — แก้ก่อน แล้วค่อยรายงาน |

---

## 1 · โครงคำตอบ 4 บล็อก

| บล็อก | ความยาว | กฎ |
|---|---|---|
| 1 · สิ่งที่เจอ + ผลถ้าไม่แก้ | 1–2 บรรทัด | **ขึ้นก่อนเสมอ** ไม่มีคำเกริ่น ไม่ทวนคำถาม |
| 2 · หลักฐาน | ตาราง ≤ 5 แถว | ตัวเลขที่ขัดกันเท่านั้น ไม่ต้องเล่าวิธีตรวจ |
| 3 · ข้อเสนอ | ตาราง ≤ 5 แถว | ทำอะไร → **ได้อะไร** ไม่ใช่ทำอะไร → ทำยังไง |
| 4 · คำถามปิด | 1 บรรทัด | คำถามเดียว ตอบได้ด้วยไม่กี่คำ |

บล็อก 2 ตัดได้ถ้าไม่มีตัวเลข ส่วนบล็อก 3 ตัดได้ถ้ายังไม่มีข้อเสนอจริง ๆ
**บล็อก 1 กับ 4 ตัดไม่ได้**

**ทั้งคำตอบควรจบใน 1 หน้าจอ** — ยาวกว่านั้นแปลว่ากำลังอธิบายกระบวนการ ไม่ใช่ขอการตัดสินใจ

---

## 2 · บล็อกที่ 1 — สูตรประโยคเดียว

```
<อะไรผิด> เพราะ <สาเหตุสั้น ๆ> · ต้อง <ทำอะไร> ก่อน <ขั้นถัดไป> ไม่งั้น <ผลเสียที่เป็นรูปธรรม>
```

| ❌ เขียนแบบเล่าเรื่อง | ✅ เขียนแบบขึ้นด้วยผลกระทบ |
|---|---|
| "ระหว่างตรวจผมพบว่าไฟล์ BUILD-PLAN.md ที่สร้างเมื่อเช้านี้นั้นได้อ่านข้อมูลมาจากโฟลเดอร์ extracted ซึ่งเป็นฉบับก่อนที่จะมีการแก้ไข…" | "**BUILD-PLAN.md ตัวเลขเก่า** เพราะอ่านจากไฟล์ฉบับก่อนแก้ ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันข้าม FR-14.x กับ PLT ทั้งชุด" |

- **"ไม่งั้น…" ต้องเป็นรูปธรรม** — "ข้าม FR-14.x ทั้งชุด" ไม่ใช่ "อาจมีปัญหาตามมา"
- ไม่ต้องบอกว่าเจอตอนไหนหรือเจอได้ยังไง เว้นแต่วิธีเจอจะเปลี่ยนสิ่งที่ต้องทำ
- ตัวหนาใช้กับ**คำที่เปลี่ยนการตัดสินใจ**เท่านั้น ไม่ใช่ทุกคำสำคัญ

---

## 3 · ตัวเลขที่ขัดกัน = ตารางเทียบเสมอ

สองค่าขึ้นไปที่ไม่ตรงกัน อ่านจากประโยคยากกว่าอ่านจากตารางทุกครั้ง

```markdown
| | ที่บันทึกไว้ | ของจริง |
|---|---|---|
| FR ถึง | 13.9 | **14.12** |
| Test case | 214 | **245** |
| PLT | ไม่มี | **มี** |
```

- หัวคอลัมน์บอกว่า**ค่าไหนเชื่อได้** — "ที่บันทึกไว้ / ของจริง" ไม่ใช่ "เก่า / ใหม่"
- ตัวหนาที่ฝั่งที่ถูกต้อง เพื่อให้กวาดตาแล้วรู้ทันทีว่าต้องยึดอะไร
- แถวที่ตรงกันอยู่แล้ว **ไม่ต้องใส่**

**คำถามหรือสมมติฐานเดิมที่ตกไปเพราะข้อมูลใหม่ ให้ตัดทิ้งในหนึ่งบรรทัด**
เช่น "คำถามข้อ 1 เรื่องเลขไม่ตรง — ตกไปเอง" แล้วไปต่อ อย่าอธิบายว่าทำไมถึงตก

---

## 4 · ข้อเสนอเป็นตาราง "ทำอะไร → ได้อะไร"

```markdown
| ไฟล์ | ได้อะไร |
|---|---|
| `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
| ประวัติการแก้ไขในหน้าแรกของ docx | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอ |
```

- คอลัมน์ขวาคือ **ประโยชน์** ไม่ใช่ขั้นตอน — คนอ่านกำลังตัดสินใจว่าคุ้มไหม ไม่ได้กำลังลงมือทำ
- เรียงจากคุ้มที่สุดลงมา ไม่ใช่เรียงตามลำดับการทำ
- **ผูกข้อเสนอกับปัญหาที่เพิ่งเจอถ้าผูกได้** — เป็นเหตุผลที่หนักแน่นที่สุดที่มี
- เกิน 5 แถวเมื่อไหร่ แปลว่ากำลังเสนอหลายเรื่องปนกัน ให้แยกเป็นคนละรอบ

---

## 5 · บอกสิ่งที่**ไม่**ทำด้วย

หนึ่งบรรทัด พร้อมเหตุผลและเวลาที่ควรทำแทน

> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ

บรรทัดนี้กัน **"แล้วอันนั้นล่ะ ทำไมไม่ทำ"** ซึ่งเป็นคำถามที่ตามมาเกือบทุกครั้ง
และบอกกลาย ๆ ว่าคิดครบแล้ว ไม่ได้ลืม

---

## 6 · ปิดด้วยคำถามเดียว

```
เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN
```

| กฎ | เหตุผล |
|---|---|
| **หนึ่งคำถาม** ต่อหนึ่งคำตอบ | ถ้าถามสองคำถามขึ้นไป จะได้คำตอบแค่ข้อเดียว |
| ตอบได้ด้วยไม่กี่คำ | "ทั้ง 4" · "เริ่มข้อ 2" |
| มีตัวเลือก "เอาทั้งหมด" ให้ | ส่วนใหญ่ผู้ใช้เลือกอันนี้ ถ้าต้องพิมพ์เองจะเสียเวลา |
| ถ้ามีลำดับที่แนะนำ ใส่ไว้ในคำถามเลย | เขาจะได้ตอบว่า "ตามนั้น" คำเดียว |

**ห้ามปิดด้วยการถามว่า "มีอะไรให้ช่วยเพิ่มไหม"** — ไม่ใช่คำถามที่ขอการตัดสินใจ

---

## 7 · ตัวอย่างเต็ม

**❌ ก่อน — 1 ย่อหน้ายาว 3 ก้อน อ่านจบแล้วยังไม่รู้ว่าต้องตอบอะไร**

> เรื่องด่วนที่เจอระหว่างตรวจ — BUILD-PLAN.md ที่สร้างเมื่อเช้านี้อ่านจาก
> `_to_delete/extracted/*.md` ซึ่งเป็นฉบับก่อนที่ผมจะแก้ มันจึงบันทึกไว้ว่า
> "FR ถึง FR-13.9 · TC 214 ข้อ · ไม่มี PLT" และตั้งคำถามข้อ 1 ว่าเลข 239 ไม่ตรง
> ตอนนี้เอกสารจริงเป็น FR-14.12 และ 245 กรณีแล้ว ต้อง extract ใหม่แล้วอัปเดต
> BUILD-PLAN ก่อนให้ agent เขียนโค้ดต่อ ไม่งั้นมันจะสร้างระบบตามสเปกเก่าและข้าม
> FR-14.x กับ PLT ทั้งหมด … ถ้าจะทำให้ชุดนี้เป็นตัวอย่างของโปรเจกต์ถัดไป ผมเสนอให้
> เติม 4 ไฟล์ที่คุ้มที่สุดก่อน คือ docs/README.md เป็นสารบัญบอกว่าอ่านอะไรก่อนและ
> ใครเป็นเจ้าของ, เพิ่มตารางประวัติการแก้ไขในหน้าแรกของทั้ง 4 docx, …

**✅ หลัง — โครงเดียวกัน 4 บล็อก**

> **ด่วน — `BUILD-PLAN.md` ตัวเลขเก่า** เพราะอ่านจาก `_to_delete/extracted/` ฉบับก่อนคุณแก้
> ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันสร้างตามสเปกเก่าและข้าม FR-14.x กับ PLT ทั้งชุด
>
> | | ที่บันทึกไว้ | ของจริง |
> |---|---|---|
> | FR ถึง | 13.9 | **14.12** |
> | Test case | 214 | **245** |
> | PLT | ไม่มี | **มี** |
>
> คำถามข้อ 1 ที่ตั้งไว้ว่าเลข 239 ไม่ตรง — ตกไปเอง
>
> **ทำเป็นแม่แบบ: 4 ไฟล์ที่คุ้มสุด**
>
> | ไฟล์ | ได้อะไร |
> |---|---|
> | `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
> | ประวัติการแก้ไข หน้าแรกของ docx ทั้ง 4 | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอพอดี |
> | `docs/DESIGN-SYSTEM.md` | ดึง token ออกจาก mockup มาเขียนเป็นเอกสาร |
> | `docs/adr/` | แยก ADR-1..12 เป็นไฟล์ละข้อ |
>
> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ
>
> เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN

**สิ่งที่หายไป ทั้งที่ข้อมูลครบเท่าเดิม:** คำเกริ่น · การเล่าว่าตรวจเจอยังไง ·
ชื่อไฟล์เต็มที่ไม่ได้ช่วยตัดสินใจ · คำอธิบายว่าทำไมคำถามเดิมถึงตกไป ·
รายละเอียดวิธีทำของแต่ละข้อเสนอ

---

## 8 · Anti-patterns

- ❌ **เปิดด้วย "ระหว่างตรวจผมพบว่า…"** — ผู้อ่านต้องอ่านถึงท้ายย่อหน้าถึงจะรู้ว่าต้องทำอะไร
- ❌ **ตัวเลขที่ขัดกันเขียนเป็นประโยค** — "เดิม 214 ตอนนี้ 245" ตาต้องกระโดดไปมา
- ❌ **อธิบายว่าปัญหาเกิดได้ยังไง** ทั้งที่ไม่เปลี่ยนสิ่งที่ต้องทำ
- ❌ **ข้อเสนอที่บอกวิธีทำแทนที่จะบอกประโยชน์** — ยังตัดสินใจไม่ได้อยู่ดี
- ❌ **ถามสามคำถามในย่อหน้าเดียว** — จะได้คำตอบข้อเดียว แล้วต้องถามซ้ำ
- ❌ **ปิดด้วย "แจ้งได้เลยครับ"** — ไม่ได้ขอการตัดสินใจอะไร
- ❌ **ขอโทษยาว ๆ ที่พลาด** — บอกว่าอะไรผิดและแก้ยังไง พอแล้ว
- ❌ **รายงานอย่างเดียวโดยไม่เสนอ** — ผลักภาระคิดกลับไปให้ผู้ใช้ทั้งหมด

---

## 9 · ตัวย่อ

- **FR** — Functional Requirement (ข้อกำหนดเชิงหน้าที่)
- **TC** — Test Case (กรณีทดสอบ)
- **ADR** — Architecture Decision Record (บันทึกเหตุผลของการตัดสินใจเชิงสถาปัตยกรรม)

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เลือกว่าจะตอบเป็นตาราง รูป หรือร้อยแก้ว | `answer-shape` |
| กางตัวย่อและศัพท์เฉพาะในคำตอบ | `spell-out-abbreviations` |
| รายงานผลงานที่ทำเสร็จแล้ว | `anthropic-skills:short-answers` |
| แก้ของที่พังทันทีแทนที่จะรายงาน | `targeted-fix` |
| สิ่งที่เจอใหญ่พอจะเป็นเอกสาร | `polished-document-style` |
| สิ่งที่เจอคือเหตุขัดข้องของระบบจริง | `incident-runbook-template` · `postmortem-template` |


---

# skill: document-naming

Use when creating, renaming or filing a document a team or client keeps. Format choice, file name pattern, version placement, version vs status.

# ตั้งชื่อและจัดเวอร์ชันเอกสาร

> **กฎข้อเดียว:** ไฟล์ที่อยู่ใน git **ห้ามใส่เวอร์ชันในชื่อ** เพราะ git คือประวัติอยู่แล้ว
> ไฟล์ที่ออกไปนอก git **ต้องใส่** เพราะไม่มีอะไรบอกได้อีกแล้วว่าใครถือฉบับไหน

## เมื่อไหร่ใช้ skill นี้

- สร้างเอกสารใหม่ที่ทีมหรือลูกค้าจะเก็บไว้
- ส่งเอกสารออกไปให้คนนอกทีม
- โฟลเดอร์เริ่มมี `final`, `final2`, `ล่าสุด`, `แก้แล้ว`
- มีคนถามว่า "ตกลงยึดฉบับไหน"

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| เนื้อหาข้างในเอกสาร | `srs-writing` · `fsd-writing` · `adr-writer` |
| รูปแบบ markdown | `polished-document-style` |
| หน้าตาไฟล์ที่ render ออกมา | `branded-document-design` |
| ไฟล์ชั่วคราวระหว่างทำงาน | `temp-file-discipline` |
| ข้อความ commit | `commit-message-format` |

---

## 1 · เลือกรูปแบบก่อนตั้งชื่อ

**เกณฑ์เดียว: ถ้ามีคนเซ็นหรือส่งออกนอกทีม ให้ทำเป็นไฟล์ส่งมอบ ส่วนเอกสารที่อยู่กับโค้ดให้เป็น markdown ใน repo**

| เอกสาร | รูปแบบ | เหตุผล |
|---|---|---|
| SRS · BRD · ข้อเสนอโครงการ · ใบตรวจรับ UAT · สัญญา | **docx + PDF** | มีลายเซ็น ต้องล็อกฉบับ |
| คู่มือผู้ใช้ · เอกสารส่งมอบ · รายงานผู้บริหาร | **docx + PDF** | คนนอกทีมอ่าน ไม่มี git ให้ดู |
| สไลด์นำเสนอ | **pptx + PDF** | |
| FSD · ADR · API spec · runbook · README · test plan | **markdown ใน repo** | เปลี่ยนพร้อมโค้ด ต้อง diff ได้ |
| บันทึกประชุม · บันทึกการตัดสินใจ | **markdown ใน repo** | ค้นหาง่าย ไม่ต้องเปิดโปรแกรม |

> 🚨 **เขียน markdown เป็นต้นฉบับเสมอ แล้ว render เป็น docx ตอนส่ง**
> ไม่ใช่แก้ใน Word แล้วมี 2 ฉบับที่ค่อย ๆ ไม่ตรงกัน
> เก็บต้นฉบับไว้ที่เดียว — กฎข้อนี้กันปัญหาได้มากที่สุดในหน้านี้

**ส่งออกเมื่อไหร่ แนบ PDF คู่กับ docx เสมอ** — docx ให้เขาแก้ต่อได้ ส่วน PDF คือฉบับที่หน้าตาไม่เพี้ยน

---

## 2 · รูปแบบชื่อไฟล์

```
<รหัสโปรเจกต์>-<ประเภท>-<เรื่อง>-v<M.m>-<สถานะ>.docx
```

| ประเภทเอกสาร | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ไฟล์ส่งออก | `<โปรเจกต์>-<ประเภท>-v<M.m>-<สถานะ>.docx` | `TRS-SRS-v1.2-APPROVED.docx` |
| ไฟล์ส่งออกที่มีหลายเรื่อง | เติมเรื่องต่อจากประเภท | `TRS-FSD-recording-v0.3-DRAFT.docx` |
| ฉบับที่ส่งให้ลูกค้าจริง | เติมวันที่ ISO ท้ายสุด | `TRS-SRS-v1.2-APPROVED-2026-09-25.docx` |
| เอกสารใน repo | `<ประเภท>-<เรื่อง>.md` ตัวพิมพ์เล็ก ขีดกลาง | `docs/fsd-recording.md` |
| ADR | `NNNN-<เรื่อง>.md` เรียงเลขต่อเนื่อง | `docs/adr/0007-เลือก-whisper.md` |
| บันทึกประชุม | `YYYY-MM-DD-<เรื่อง>.md` | `docs/meetings/2026-09-25-kickoff.md` |

**กฎชื่อไฟล์:**

- ไม่มีเว้นวรรค ใช้ขีดกลาง — เว้นวรรคทำให้ลิงก์และคำสั่งใน command line พัง
- **วันที่เป็น ISO `YYYY-MM-DD` เสมอ** และวางท้ายสุด — เรียงตามชื่อแล้วได้เรียงตามเวลาเอง
- ชื่อไฟล์เป็นอังกฤษ แม้เนื้อหาเป็นไทย — กันปัญหาตอนแนบอีเมลและ zip ข้ามระบบ
- ห้ามใส่ชื่อคนในชื่อไฟล์ — `-somchai-edit` คือสัญญาณว่าไม่ได้ใช้ต้นฉบับเดียว

---

## 3 · เวอร์ชัน

| ขึ้นเลขไหน | เมื่อ |
|---|---|
| **major** (1.x → 2.0) | ขอบเขตเปลี่ยน · โครงเอกสารเปลี่ยน · ต้องเซ็นรับใหม่ |
| **minor** (1.1 → 1.2) | เพิ่มหรือแก้เนื้อหา ยังเป็นเรื่องเดิม |
| ไม่ขึ้นเลข | แก้คำผิด จัดหน้า — แต่**ยังต้องลงประวัติการแก้ไข** |

- ฉบับที่ส่งให้คนดูครั้งแรกคือ `v0.1` ส่วนฉบับแรกที่มีคนเซ็นคือ `v1.0`
- **เลขเวอร์ชันเดินหน้าอย่างเดียว** ไม่ย้อนกลับไปใช้เลขเดิม
- ไฟล์ใน git ไม่มีเลขเวอร์ชันในชื่อ — ถ้าต้องอ้างถึงฉบับหนึ่ง ให้อ้าง tag หรือ commit

---

## 4 · สถานะ — คนละเรื่องกับเวอร์ชัน

| สถานะ | แปลว่า | ใครแก้ได้ |
|---|---|---|
| `DRAFT` | ยังเขียนอยู่ | ผู้เขียน |
| `REVIEW` | ส่งให้ตรวจแล้ว รอความเห็น | ผู้เขียน ตามความเห็นที่ได้ |
| `APPROVED` | เซ็นรับแล้ว | **ห้ามแก้** ต้องขึ้นเวอร์ชันใหม่เป็น DRAFT |

> **`APPROVED` แล้วห้ามแก้ไฟล์เดิม** แม้จะเป็นแค่คำผิด
> ถ้าแก้ได้ ฉบับที่ลูกค้าถืออยู่กับฉบับที่เราถืออยู่จะไม่เหมือนกัน โดยที่ชื่อไฟล์เหมือนกันทุกตัวอักษร

---

## 5 · ประวัติการแก้ไขต้องอยู่ในไฟล์

**ชื่อไฟล์บอกได้แค่ว่านี่คือฉบับไหน ไม่ได้บอกว่าเปลี่ยนอะไร**
ทุกเอกสารส่งออกต้องมีตารางนี้ในหน้าแรก

```markdown
| เวอร์ชัน | วันที่ | ผู้แก้ | แก้อะไร | เหตุผล |
|---|---|---|---|---|
| 1.2 | 2026-09-25 | สมชาย | เพิ่ม FR-14.1 ถึง 14.12 · TC เป็น 245 ข้อ | ลูกค้าขอเพิ่มรายงานสรุป |
| 1.1 | 2026-09-12 | สมชาย | แก้ NFR-PERF-010 จาก 3 วินาทีเป็น 5 | วัดจากของจริงแล้วทำไม่ได้ |
| 1.0 | 2026-09-01 | สมชาย | ฉบับเซ็นรับ | — |
```

- **คอลัมน์ "แก้อะไร" ต้องเป็นรูปธรรม** — "ปรับปรุงเนื้อหา" ไม่มีประโยชน์กับใครเลย
- เรียงใหม่อยู่บน — คนเปิดอ่านอยากรู้ว่าเปลี่ยนอะไรล่าสุด
- **ไฟล์ที่ส่งต่อกันเป็นเดือนต้องดูตารางนี้แล้วรู้ทันทีว่าถือฉบับเก่าอยู่ไหม**

---

## 6 · ที่เก็บและการส่ง

| เรื่อง | กฎ |
|---|---|
| ต้นฉบับ | อยู่ใน repo เสมอ — `docs/` |
| ไฟล์ส่งออก | อยู่ใน `docs/releases/` หรือที่เก็บของลูกค้า **ไม่ใช่รากโปรเจกต์** |
| ไฟล์ที่ได้รับมา | เก็บชื่อเดิมของเขาไว้ ห้ามเปลี่ยน — เขาอ้างถึงชื่อนั้น |
| ไฟล์ระหว่างแปลง | `_to_delete/` (ดู `temp-file-discipline`) |
| ส่งทางแชตหรืออีเมล | ส่งไฟล์ที่มีเวอร์ชันและสถานะในชื่อเสมอ ไม่ส่ง `เอกสาร.docx` |

---

## 7 · Anti-patterns

- ❌ **`final.docx`, `final2.docx`, `final_ล่าสุด.docx`** — ไม่มีใครรู้ว่าอันไหนใหม่กว่า
- ❌ **`SRS แก้แล้ว.docx`** — แก้จากฉบับไหน แก้อะไร
- ❌ **ใส่เวอร์ชันในชื่อไฟล์ที่อยู่ใน git** — จะได้ `spec-v1.md` กับ `spec-v2.md` อยู่คู่กันตลอดไป
- ❌ **แก้ไฟล์ที่ `APPROVED` แล้ว** แม้แต่คำผิดเดียว
- ❌ **ไม่มีตารางประวัติการแก้ไข** — แล้วต้องเปิดเทียบทีละหน้า
- ❌ **แก้ใน Word โดยไม่แก้ markdown ต้นฉบับ** — 2 ฉบับเริ่มไม่ตรงกันตั้งแต่นาทีนั้น
- ❌ **วันที่แบบ `25-09-2026` หรือ `250926`** — เรียงไม่ได้ และคนอ่านคนละแบบ
- ❌ **ชื่อไฟล์ภาษาไทยที่มีเว้นวรรค** — ลิงก์พัง แนบอีเมลแล้วชื่อเพี้ยน

---

## 8 · ตัวย่อ

- **SRS** — Software Requirements Specification (เอกสารข้อกำหนดซอฟต์แวร์)
- **FSD** — Functional Specification Document (เอกสารข้อกำหนดเชิงหน้าที่)
- **BRD** — Business Requirements Document (เอกสารความต้องการทางธุรกิจ)
- **UAT** — User Acceptance Testing (การทดสอบเพื่อตรวจรับโดยผู้ใช้)
- **ADR** — Architecture Decision Record (บันทึกการตัดสินใจเชิงสถาปัตยกรรม)
- **ISO 8601** — มาตรฐานรูปแบบวันที่ `YYYY-MM-DD`

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| เนื้อหาของ SRS · FSD · ADR | `srs-writing` · `fsd-writing` · `adr-writer` |
| รูปแบบ markdown และธีมสีเอกสาร | `polished-document-style` |
| render เป็น .docx ให้สวย | `branded-document-design` |
| ไฟล์ชั่วคราวระหว่างแปลง | `temp-file-discipline` |
| เวอร์ชันของ **โปรแกรม** (ไม่ใช่เอกสาร) | `cicd-and-release` |
| สารบัญว่าเอกสารไหนอยู่ที่ไหน | `project-bootstrap` |

**แม่แบบตารางประวัติการแก้ไข และรายการชื่อไฟล์มาตรฐาน** อยู่ใน `assets/naming-cheatsheet.md`
