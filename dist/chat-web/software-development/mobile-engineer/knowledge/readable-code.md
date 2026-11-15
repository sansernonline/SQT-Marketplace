# skill: readable-code

Use when writing or reviewing code for readability

# Code that people can read and understand

> **The one rule:** a name you must open up to understand is a badly chosen name

---

## When to use this skill

- Writing new code · naming variables, functions, files, or folders
- Reviewing code that feels "correct but hard to read"
- A newcomer joins the project and cannot find files
- The `utils/` folder is starting to become a junk drawer

## When **not** to use

| Situation | Use instead |
|---|---|
| You want to write **less** code | `lazy-coding` |
| **Repo-level** folder structure · README · linter | `project-bootstrap` |
| Reviewing for correctness, security, testing | `code-review-checklist` |
| Naming **documentation files** | `document-naming` |
| Naming a **product or brand** | `product-naming` |

---

## 1 · A name must answer three questions without opening it

**What is it · what unit · when can it be used**

| ✗ | ✓ | The difference |
|---|---|---|
| `d` | `daysSinceLastLogin` | Has a unit and a reference point |
| `list` | `overdueInvoices` | Says what is inside |
| `data` | `csvRows` | `data` rules nothing out |
| `temp` | `swapBuffer` | Names the role, not that it is temporary |
| `flag` | `hasUnpaidBalance` | You can tell what `true` means |
| `timeout` | `timeoutMs` | Is 30 seconds or milliseconds? |
| `price` | `priceSatang` | A money number with no unit is a bug waiting to happen |
| `checkUser()` | `isUserActive()` | `check` does not say whether it returns a boolean or throws an error |
| `process()` | `normalizePhoneNumber()` | `process` can mean anything |
| `getUser()` that calls an API | `fetchUser()` | `get` means fast and never fails |

> **A number with a unit must have the unit in its name, always** — `Ms` · `Seconds` · `Bytes` · `Satang` · `Percent` · `Ratio`
> Nobody sees a unit bug at review, but they will see it when the customer calls

---

## 2 · Function prefixes — one word, one meaning

**Pick a word and use it consistently across the whole project.** If some `get` calls hit the network, readers stop trusting every name.

The table of all 10 prefix groups (what each promises · can it fail · does it have side effects) is at [`assets/naming-reference.md`](assets/naming-reference.md) step 2 — for example `get` never hits the network · `validate` throws an error · `ensure` can be called repeatedly

**Combining rules:**

- **Never name a boolean in the negative** — `isNotReady` produces `if (!isNotReady)`, which nobody can read
- **A collection is plural and says the type inside** — `userIds`, not `users`, if what is inside is numbers
- **A function name containing `and` is 2 functions** — `saveAndNotify()` should be split into 2
- **Constants use upper case only for values truly set once**; a value read from config is not a constant
- **Order function names verb → big context → small context** — `getUserMessages` (get · user · messages) · `shouldDisplayBanner` · with the same order across the project, readers can guess names they have never seen
- **A boolean starts with `is` `has` `should` `can`** — it reads as a question that can be answered only yes or no (`hasUnpaidBalance` · `canRetry`)
- **Do not repeat context the surrounding name already gives** — `user.userName` → `user.name` · `Invoice.invoiceTotal` → `Invoice.total`

(The last 3 — idea from kettanaito/naming-cheatsheet (MIT), rewritten in our own words)

---

## 3 · How long a name is depends on how many lines it lives

| Distance from declaration to last use | Suitable name length | Example |
|---|---|---|
| ≤ 5 lines (a loop counter) | 1 character is enough | `i` · `r` · `x` |
| Within one function | 1–2 words | `total` · `rawRows` |
| Whole class or whole file | 2–3 words | `pendingApprovals` |
| Exported outside the file | Full, no abbreviations | `calculateWithholdingTax` |

> **A name gets longer as the distance between declaration and use grows** — `i` in a 3-line loop is clearer than `currentIndex`
> but an `i` that is a class field is a name nobody can follow

---

## 4 · Forbidden words — adding them removes no meaning at all

**Do not use `data` `info` `manager` `helper` `util` `do` `temp` or self-invented abbreviations** — everything in a program is data; a name that can do anything is a name that says nothing · the full table with replacement words is at [`assets/naming-reference.md`](assets/naming-reference.md) step 4

**Exception:** abbreviations the whole field uses — `id` · `url` · `http` · `db` · `api` · `ui` — are fine, no need to spell out
and names already set by a platform or framework (`SensorManager` · Android `Service` · `ChangeNotifier`) are used as they are,
because the forbidden words apply only to names **we choose ourselves**

---

## 5 · The shape of a function

- **One function, one level of abstraction** — a function holding both "send email" and "concatenate an SQL string" is hard to read because the brain must switch levels
- **No more than 3 parameters**; beyond that, take an object with named fields
- **Never take a boolean as a parameter** — at the call site, `render(true)` does not show what `true` is
  split into `renderDraft()` and `renderFinal()`, or take `{ mode: "draft" }`
  **except a named parameter** where the call site shows the name, such as `TextField(obscureText: true)` in Dart or `enabled: true`, which already reads clearly
- **Return early rather than nest `else`** — a condition that can end the function should `return` at once, so the main path is not indented
- **If indentation goes past 3 levels, split the function** — not because of a rule, but because the brain cannot follow conditions nested 4 deep

---

## 6 · Comments — write "why", not "what"

```ts
// ผิด: เพิ่มค่า i ทีละ 1
// ผิด: ฟังก์ชันคำนวณภาษี

// ถูก: ปัดเศษสตางค์ลงเสมอ ไม่ใช่ปัดใกล้สุด — ตามที่ลูกค้ากำหนด (อ้างที่มาจริง: ชื่อประกาศ/สัญญา + ข้อ + ลิงก์)
// ถูก: ผู้ให้บริการ SMS จำกัด 3 ข้อความ/วินาที เกินแล้วบล็อกไอพี 5 นาที
// ถูก: ต้องเรียงลำดับนี้เท่านั้น — เรียก validate ก่อน normalize จะได้เบอร์ที่ผิดรูปแบบ
```

**A comment that explains what the code does is a sign the name is wrong.** Fix the name and delete the comment.

**4 kinds that should have a comment:**

| Kind | Example |
|---|---|
| An external constraint | Requirements of the API you call · law · hardware limits |
| A decision that looks odd but is deliberate | "ไม่ใช้ index ที่นี่เพราะตารางเขียนบ่อยกว่าอ่าน" (no index here because the table is written more often than read) |
| A formula or business rule with a source | Cite the clause number in the document; do not retell the formula |
| A `TODO` with an owner and a condition | `TODO(somchai): ย้ายไป Redis เมื่อรันเกิน 1 process` (move to Redis when running more than 1 process) |

> **A lying comment is more dangerous than no comment.** If you change the code, change the comment in the same round.

### Comment sorting pass before review

Before sending for review, go through every comment the diff adds or edits, and put each into 1 of the 4 ways in this table. If the diff is large, have a mid-level subagent read only and make the list, while the main agent decides.

| Comment | Do |
|---|---|
| Translates code into human language · outdated · commented-out code | Delete |
| Explains what a variable or function is | Rename so it says so itself, then delete |
| States a constraint ("no null" · "must be called after init" · "value at most 100") | Turn it into something checkable, such as a type · assert · test · lint (`repeated-mistakes-to-checks`), then delete |
| The 4 kinds in the table above | Keep |

Report the result as numbers: how many deleted · how many renamed · how many became checks · how many kept

---

## 7 · File structure a newcomer can find their way in

**The test:** a person who just joined the project gets a bug report: *"The save-invoice button does not work"*
They must guess the right folder **within 30 seconds** without asking anyone.

### Organize by feature, not by file type

```
ผิด: จัดตามชนิด — แก้ฟีเจอร์เดียวต้องเปิด 5 โฟลเดอร์
src/
  controllers/   invoice.ts  customer.ts  report.ts
  services/      invoice.ts  customer.ts  report.ts
  models/        invoice.ts  customer.ts  report.ts
  validators/    invoice.ts  customer.ts  report.ts

ถูก: จัดตามฟีเจอร์ — ทุกอย่างของใบแจ้งหนี้อยู่ที่เดียว
src/
  invoice/       routes.ts  service.ts  model.ts  validation.ts  invoice.test.ts
  customer/      ...
  report/        ...
  shared/        money.ts  thai-date.ts  http-client.ts
```

**Rules:**

- **A file name is the name of what it mainly exports** — `InvoiceRenderer` lives in `invoice-renderer.ts`
  Letter case follows the language's convention: Dart/Python use snake_case (`invoice_renderer.dart`), while .NET uses `InvoiceRenderer.cs`
- **A test file sits beside the file it tests**, not in a `tests/` folder where you must hunt for its pair
  **except stacks where the tooling forces a test folder**, such as Flutter (`flutter test` looks in `test/`, and a test in `lib/` drags `flutter_test` into the app) · .NET (a separate test project in `tests/`) — table in `project-bootstrap` step 1
  use a folder layout in `test/` that mirrors `lib/` exactly, e.g. `lib/invoice/renderer.dart` ↔ `test/invoice/renderer_test.dart`
- **No single `utils/` lump**, because if 2 things are unrelated, they should not be in the same file
  `shared/` is acceptable, but inside it must split by topic, not be a heap
- **An `index` that re-exports a whole folder breaks "go to definition" in code editors**, so use it only where truly needed
- **A folder with a single file is a folder that should not exist yet**

---

## 8 · File size and order inside the file

- **A file over ~300 lines is a signal, not a rule.** If you can scroll and find things easily, leave it.
- **Order in a file: import → constants → types → what is exported → private helpers**
- **A function that is called sits below the function that calls it**, so it reads from top to bottom like an article
  the important parts on top, the details below; wherever the reader stops, they already understand the overall picture

---

## 9 · Thai and English in code

| What | Language |
|---|---|
| Names of variables, functions, classes, files, folders, tables, columns | **Always English** |
| Comments | Thai is fine if the team reads Thai |
| Text users see | Thai, but not embedded in code (`i18n-and-locale`) |
| Commit message · branch name | As the team agrees; pick one and use it consistently across the team |

- **Never mix half-words** — `checkบัตร` · `userชื่อ` are hard to read and break in some terminals
- **For Thai technical terms with no direct English word**, look for the closest English word first
  (`เลขประจำตัวผู้เสียภาษี` → `taxId` · `ภาษีหัก ณ ที่จ่าย` → `withholdingTax`)
  if there really is none, use a full-word transliteration and explain it in `DATA-DICTIONARY.md`

---

## 10 · Checklist before submitting code

Use the 12-item checklist in [`assets/naming-reference.md`](assets/naming-reference.md) step 5 — go through every item before sending; for any item that fails, go back and fix it by the matching step of this skill.

---

## 11 · Anti-patterns

- **Renaming a whole file in the same commit as a logic change** — reviewers cannot tell what really changed; split the commits
- **A `utils.ts` with 40 unrelated functions**
- **A generated file-header comment that nobody updates** — `@author` `@version`, which git tells better
- **Code commented out "in case it's needed"** — git keeps it already; delete it
- **Naming by pattern instead of by role** — `InvoiceFactoryStrategyImpl` says which pattern is used, not what it does
- **Changing the naming style midway through a project** — inconsistency is worse than a style that is not pretty
- **Abbreviating a name because the line is too long** — wrap the line; do not cut the name

---

## 12 · Abbreviations

- **API** — Application Programming Interface
- **SQL** — Structured Query Language
- **SMS** — Short Message Service
- **TODO** — something not yet done that you intend to do
- **YAGNI** — You Aren't Gonna Need It

---

## 13 · Connecting to other skills

| Need | Use together with |
|---|---|
| Write less code | `lazy-coding` |
| Repo structure · README · linter | `project-bootstrap` |
| Review for correctness and security | `code-review-checklist` |
| Log format and field names in logs | `logging-standards` |
| Table and column names in a database | `database-design` |
| Endpoint names and fields in an API | `api-conventions` |
| Text users see, Thai-English | `i18n-and-locale` |
| One-page reference table | `assets/naming-reference.md` |
