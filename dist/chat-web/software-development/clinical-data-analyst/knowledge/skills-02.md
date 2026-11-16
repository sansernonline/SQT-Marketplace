# skill: lazy-coding

Use when writing or reviewing code, for the simplest that works

# lazy-coding — the least code that works, still easy to find and to read

> **One rule:** a tired teammate must understand it in 6 months, with no context. If they can't, simplify until they can. The best code is the code you never had to write.

## Use when

- Writing or reviewing any code. On by default at **full** in every response; switch with `lazy lite | full | ultra`; off only on "stop lazy" / "normal mode".

Not for: names, function shape and file layout → `readable-code` (**always load together**: lazy decides how much code, readable-code decides how it looks) · the repo skeleton → `project-bootstrap` · docs, plans, architecture → `simplicity-first`

## Steps

1. **Climb the ladder and stop at the first rung that holds** (a reflex, not a research project; if two rungs work, take the higher one):
   1. Does this need to exist? Speculative need → skip it, say so in one line (YAGNI).
   2. Does the stdlib do it? Use it.
   3. Does a native platform feature cover it? (`<input type="date">` over a picker lib, CSS over JS, a DB constraint over app code.) On mobile (Flutter, React Native) "native" means a platform channel in Kotlin/Swift, the costly rung: a maintained plugin or framework widget comes first.
   4. Does an already-installed dependency solve it? Use it. Never add a dependency for what a few lines can do.
   5. Can it be one line? One line.
   6. Only then: the smallest code that works.
2. **Apply the rules:**
   - No unrequested abstractions (no interface with one implementation, no factory for one product, no config for a value that never changes). No scaffolding "for later".
   - Delete before you add. Boring before clever.
   - Deletion test: remove the piece, run the tests; still green → it stays deleted.
   - Shortest working diff wins, but never by merging concerns into one file: fewest files **that still keep one concern per file**.
   - Match the repo: read 2–3 nearby files and copy their style.
   - Two stdlib options the same size → take the one correct on edge cases.
3. **Keep it simple, not scattered.** Lazy cuts how much code exists, never where it lives: one concern per file · feature folders, not type folders (no `utils/`) · names carry meaning · signatures and data shapes between layers written out · config and secrets outside code (but domain constant tables stay in code) · tests beside the code · new project → `project-bootstrap` first. Details and the cold-open test → [`references/structure.md`](references/structure.md).
4. **Mark a deliberate shortcut** with a comment naming the ceiling and the upgrade path (`# simple: in-memory dict cache — swap for Redis if we run more than one process`). Examples → [`references/examples.md`](references/examples.md).
5. **Never be lazy about:** input validation at trust boundaries, error handling that prevents data loss, security, accessibility basics, or anything explicitly requested. If the user insists on the full version, build it; no re-arguing.
6. **Non-trivial logic** (a branch, loop, parser, or money/security path) leaves ONE runnable check: an `assert`-based self-check or one small `test_*`. No frameworks or fixtures unless asked. Trivial one-liners need no test.
7. **Output:** code first, then at most three short lines on what you skipped and when to add it: `[code] → skipped: [X] — add when [Y].` If the explanation is longer than the code, delete the explanation.

## Intensity

| Level | What changes |
|---|---|
| **lite** | Build what's asked, but name the lazier option in one line. The user picks. |
| **full** | The ladder enforced. Stdlib and native first. Shortest diff, shortest explanation. Default. |
| **ultra** | YAGNI extremist. Ship the one-liner and challenge the rest of the requirement in the same breath. |

## Check before done

- Each rung of the ladder was considered; nothing added that was not asked
- One concern per file; config outside code; one runnable check for non-trivial logic
- Output is code plus at most three short lines

## References

- [`references/structure.md`](references/structure.md) — open when deciding where code, config, constants and tests live
- [`references/examples.md`](references/examples.md) — open for shortcut-marking examples and the 3 intensity levels answering the same request

Pairs with: `simplify` · `readable-code` · `project-bootstrap` · `code-review-checklist` (a lazy diff still gets reviewed)


## reference: examples.md

# Examples · lazy-coding

Open when you need to see how a simplification is marked, or how the 3 intensity levels answer the same request.

## Mark your simplifications

A deliberate shortcut reads as intent, not ignorance, when you label it. Name the ceiling and the upgrade path:

```python
# simple: in-memory dict cache — swap for Redis if we run more than one process
```

```ts
// simple: O(n) scan, fine under ~1k items — index it if the list grows
```

## Intensity example — "Add a cache for these API responses."

- **lite:** "Done. FYI `functools.lru_cache` does this in one line if you'd rather not own a cache class."
- **full:** "`@lru_cache(maxsize=1000)` on the fetch function. Skipped a custom cache class — add when lru_cache measurably falls short."
- **ultra:** "`@lru_cache` on the fetch function — done, since you asked. Do you have a profile showing these calls are slow? If not, this line can go. A hand-rolled TTL cache is a bug farm with a hit rate."


## reference: structure.md

# Simple is not scattered · lazy-coding

Open when deciding where code, config, constants and tests live. Lazy cuts how much code exists, never where it lives.

- One concern per file: entry point, logic, config and I/O each have their own place.
- Feature folders, not type folders; no `utils/` dumping ground (`readable-code`).
- Names carry meaning (not `tmp`, `data`, `handle()`).
- Boundaries stay explicit: signatures, module exports and the data shape between layers are written out.
- Config and secrets outside code: even one environment variable goes in `.env.example`. A project that reads none (an offline mobile app) has no `.env.example`; do not invent one.
- Domain constant tables (thresholds, unit tables, lux ranges) change only with a code release: one named constants file next to the feature, not env vars. "Config outside code" means values that differ per environment or deployment.
- Tests sit next to the code they test; where the toolchain fixes the test folder (Flutter `test/` mirroring `lib/`), follow it.
- New project → `project-bootstrap` first; never scatter files at the root to save a minute.
- Test: can a tired teammate opening the repo cold guess which file holds a behaviour in 30 seconds? If not, the structure is missing, not too complex.


---

# skill: readable-code

Use when writing or reviewing code for readability

# readable-code — names, functions, comments and file layout that people can read

> **One rule:** a name you must open up to understand is a badly chosen name

## Use when

- Writing new code · naming variables, functions, files, or folders
- Reviewing code that feels "correct but hard to read"
- A newcomer joins the project and cannot find files
- The `utils/` folder is starting to become a junk drawer

Not for: writing **less** code → `lazy-coding` · repo-level folder structure, README, linter → `project-bootstrap` · correctness, security, testing → `code-review-checklist` · documentation file names → `document-naming` · product or brand names → `product-naming`

## Steps

1. **Name it so it answers what it is · what unit · when it can be used.** A number with a unit has the unit in its name, always (`timeoutMs` · `priceSatang` · `Seconds` · `Bytes` · `Percent` · `Ratio`). Examples → [`references/examples.md`](references/examples.md).
2. **Use one word for one meaning across the whole project.** Function prefixes (10 groups: what each promises, can it fail, side effects; for example `get` never hits the network, `validate` throws, `ensure` can be called repeatedly) are in [`assets/naming-reference.md`](assets/naming-reference.md) step 2.
3. **Apply the naming rules:**
   - Never name a boolean in the negative (`isNotReady` gives `if (!isNotReady)`). A boolean starts with `is` `has` `should` `can`.
   - A collection is plural and says the type inside (`userIds`, not `users`, if it holds numbers).
   - A function name containing `and` is 2 functions: split it.
   - Constants use upper case only for values truly set once; a value read from config is not a constant.
   - Order function names verb → big context → small context (`getUserMessages` · `shouldDisplayBanner`).
   - Do not repeat context the surrounding name gives (`user.userName` → `user.name`).
4. **Set the name length by distance from declaration to last use.** 5 lines or fewer (a loop counter): 1 character is enough. Within one function: 1–2 words. Whole class or file: 2–3 words. Exported outside the file: full words, no abbreviations.
5. **Do not use `data` `info` `manager` `helper` `util` `do` `temp` or self-invented abbreviations** in names you choose yourself. Replacement words → [`assets/naming-reference.md`](assets/naming-reference.md) step 4. Exceptions: abbreviations the whole field uses (`id` · `url` · `http` · `db` · `api` · `ui`) and names a platform or framework already set (`SensorManager` · Android `Service` · `ChangeNotifier`).
6. **Shape the function:**
   - One level of abstraction per function.
   - At most 3 parameters; beyond that, take an object with named fields.
   - No boolean parameter (`render(true)` hides what `true` is): split into `renderDraft()` and `renderFinal()`, or take `{ mode: "draft" }`. A named parameter whose call site shows the name (`TextField(obscureText: true)` · `enabled: true`) is fine.
   - Return early rather than nest `else`.
   - If indentation goes past 3 levels, split the function.
7. **Write comments for "why", not "what".** A comment that explains what the code does means the name is wrong: fix the name and delete the comment. Keep a comment only for: an external constraint (API · law · hardware) · a deliberate decision that looks odd · a formula or business rule with its source (cite the clause number) · a `TODO(owner)` with a condition. If you change code, change its comment in the same round.
8. **Before review, sort every comment the diff adds or edits:** delete (translates code · outdated · commented-out code) · rename then delete (explains what a name is) · turn into a type, assert, test or lint then delete (states a constraint; `repeated-mistakes-to-checks`) · keep (the 4 kinds in step 7). If the diff is large, have a mid-level subagent read only and make the list, while the main agent decides. Report counts: deleted · renamed · became checks · kept.
9. **Lay out files by feature, not by file type.** The test: a newcomer gets "the save-invoice button does not work" and must guess the right folder within 30 seconds. Layout example → `references/examples.md`.
   - A file name is the name of what it mainly exports (`InvoiceRenderer` in `invoice-renderer.ts`); letter case follows the language (Dart/Python snake_case, .NET `InvoiceRenderer.cs`).
   - A test file sits beside the file it tests, except where tooling forces a test folder (Flutter `test/` · .NET `tests/`; table in `project-bootstrap` step 1), where `test/` mirrors `lib/` exactly.
   - No single `utils/` lump: `shared/` is fine only if split by topic. A folder with a single file should not exist yet.
   - An `index` that re-exports a whole folder breaks "go to definition": use it only where truly needed.
10. **Order inside a file:** import → constants → types → what is exported → private helpers. A called function sits below its caller, so it reads top to bottom. A file over about 300 lines is a signal, not a rule.
11. **Language in code:** names of variables, functions, classes, files, folders, tables and columns are always English. Comments may be Thai if the team reads Thai. User-facing text is Thai but not embedded in code (`i18n-and-locale`). Never mix half-words (`checkบัตร`). For a Thai term with no English word, look for the closest English word first (`taxId` · `withholdingTax`); otherwise transliterate in full words and explain it in `DATA-DICTIONARY.md`.

## Check before done

- Use the 12-item checklist in [`assets/naming-reference.md`](assets/naming-reference.md) step 5; fix any failed item by the matching step above.
- No rename of a whole file in the same commit as a logic change (split the commits).
- No `utils.ts` with unrelated functions · no commented-out code · no `@author` `@version` header · no name by pattern instead of role (`InvoiceFactoryStrategyImpl`) · no change of naming style midway · no name cut short because the line is long (wrap the line).

## References

- [`references/examples.md`](references/examples.md) — open for name, comment and folder-layout examples, and for related skills
- [`assets/naming-reference.md`](assets/naming-reference.md) — open for prefix groups, forbidden-word replacements and the 12-item checklist


## reference: examples.md

# Examples · readable-code

Open when you need a worked example for a name, a comment, a folder layout, or the comment sorting pass.

## Names that answer what / unit / when

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

Nobody sees a unit bug at review, but they will see it when the customer calls. Units: `Ms` · `Seconds` · `Bytes` · `Satang` · `Percent` · `Ratio`.

## Name length by distance from declaration to last use

| Distance | Suitable name length | Example |
|---|---|---|
| ≤ 5 lines (a loop counter) | 1 character is enough | `i` · `r` · `x` |
| Within one function | 1–2 words | `total` · `rawRows` |
| Whole class or whole file | 2–3 words | `pendingApprovals` |
| Exported outside the file | Full, no abbreviations | `calculateWithholdingTax` |

`i` in a 3-line loop is clearer than `currentIndex`, but an `i` that is a class field is a name nobody can follow.

## Comments

```ts
// ผิด: เพิ่มค่า i ทีละ 1
// ผิด: ฟังก์ชันคำนวณภาษี

// ถูก: ปัดเศษสตางค์ลงเสมอ ไม่ใช่ปัดใกล้สุด — ตามที่ลูกค้ากำหนด (อ้างที่มาจริง: ชื่อประกาศ/สัญญา + ข้อ + ลิงก์)
// ถูก: ผู้ให้บริการ SMS จำกัด 3 ข้อความ/วินาที เกินแล้วบล็อกไอพี 5 นาที
// ถูก: ต้องเรียงลำดับนี้เท่านั้น — เรียก validate ก่อน normalize จะได้เบอร์ที่ผิดรูปแบบ
```

The 4 kinds that should have a comment:

| Kind | Example |
|---|---|
| An external constraint | Requirements of the API you call · law · hardware limits |
| A decision that looks odd but is deliberate | "ไม่ใช้ index ที่นี่เพราะตารางเขียนบ่อยกว่าอ่าน" (no index here because the table is written more often than read) |
| A formula or business rule with a source | Cite the clause number in the document; do not retell the formula |
| A `TODO` with an owner and a condition | `TODO(somchai): ย้ายไป Redis เมื่อรันเกิน 1 process` (move to Redis when running more than 1 process) |

## Comment sorting pass (before review)

Go through every comment the diff adds or edits, and put each into 1 of 4 ways. If the diff is large, have a mid-level subagent read only and make the list, while the main agent decides.

| Comment | Do |
|---|---|
| Translates code into human language · outdated · commented-out code | Delete |
| Explains what a variable or function is | Rename so it says so itself, then delete |
| States a constraint ("no null" · "must be called after init" · "value at most 100") | Turn it into something checkable, such as a type · assert · test · lint (`repeated-mistakes-to-checks`), then delete |
| The 4 kinds in the table above | Keep |

Report the result as numbers: how many deleted · how many renamed · how many became checks · how many kept.

## Folder layout: by feature, not by file type

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

Test-folder stacks: Flutter (`flutter test` looks in `test/`, and a test in `lib/` drags `flutter_test` into the app) · .NET (a separate test project in `tests/`) — table in `project-bootstrap` step 1. Mirror the layout exactly, e.g. `lib/invoice/renderer.dart` ↔ `test/invoice/renderer_test.dart`.

## Thai terms in code

`เลขประจำตัวผู้เสียภาษี` → `taxId` · `ภาษีหัก ณ ที่จ่าย` → `withholdingTax`. If there really is no English word, use a full-word transliteration and explain it in `DATA-DICTIONARY.md`.

## Related skills

| Need | Use together with |
|---|---|
| Log format and field names in logs | `logging-standards` |
| Table and column names in a database | `database-design` |
| Endpoint names and fields in an API | `api-conventions` |
| Text users see, Thai-English | `i18n-and-locale` |
| One-page reference table | `assets/naming-reference.md` |
