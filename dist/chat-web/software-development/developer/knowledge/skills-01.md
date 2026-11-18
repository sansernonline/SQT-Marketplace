# skill: code-orientation

Use before changing code you have not yet read

# code-orientation — understand the existing code before touching it

Use it before every `feature` · `bug-fix` · `refactor` · `review` playbook, whenever you have not yet read that part of the code in this session.

Skip it when you change one piece of text or one constant, or when you write a new file that nothing calls.

---

## Do not use when

| Job | Use this instead |
|---|---|
| The whole existing system has no documents and you must recover the spec before taking the fix | `legacy-spec-recovery` |
| There is no source code, only compiled files | `reverse-engineering` |
| A newcomer must learn the whole repo (install, run, full structure), not just the part to be changed | `/onboard` |

## 1 · How — how the code works

1. **Find the entry point.** This is the route · controller · command · job · event handler that takes this work. Search from the on-screen text, the URL or the API name the user mentioned (`rg -n "ข้อความ" --glob '!**/node_modules/**'`).
2. **Follow the real path.** Go from the entry point → business rules → data store, and note file and function names in the order they are called. Do not guess from names. Open and read them.
3. **Find the shared points.** Check where else the function or type you will touch is called (`rg -n "ชื่อฟังก์ชัน\("`). If there are several callers, use `blast-radius` when you make the change.
4. **Run it for real if you can.** Add 1–2 temporary logs or breakpoints, then follow the user's steps. Seeing real values beats reading alone. Remove the temporary logs before you hand in.

If the code is long, send a small-model (haiku) or mid-model (sonnet) subagent to trace it, and take back only a map of at most 30 lines (`context-budget`).

## 2 · Why — why it was written this way

Before you change something that looks odd, look for the reason first, because odd code often guards against a bug that happened before.

| Look at | Command |
|---|---|
| Who changed this line, and why | `git log -L <เริ่ม>,<จบ>:<ไฟล์> \| head -40` · `git blame -w -L <เริ่ม>,<จบ> <ไฟล์>` then `git show <commit>` |
| Commits that mention this | `git log --oneline -n 20 -S "ชื่อฟังก์ชัน"` · `git log --oneline -n 20 --grep "คำค้น"` |
| Documents | `docs/` · ADR · `CONTEXT.md` · comments that say "why" |
| Tests that lock the behaviour | Search for the function name in the test folder, because tests show intent better than comments |

If you cannot find the reason, do not delete the code yet. Note it as `(รอยืนยัน)` (awaiting confirmation) in the map, and write a test that locks the old behaviour before you change it.

## 3 · Repo conventions

Read 2–3 files similar to the one you will write, then note:
- **Commands** — install · build · test · lint · format · run a single test (from README · `package.json` · `*.csproj` · `pyproject.toml` · CI config)
- **Structure** — how files are placed · how things are named · how errors and logs are handled · how tests are written
- **Convention checklist** (note only what differs from the language default)

  | Look at | Evidence to open |
  |---|---|
  | Names of files, classes, functions, variables (`PascalCase` · `kebab-case` · prefix `I` · suffix `Service`) | 2–3 sibling files in the same folder |
  | The lint and format tools actually used | `.editorconfig` · `.eslintrc*` · `.prettierrc` · `ruff.toml` · `.globalconfig` or `Directory.Build.props` (.NET) · pre-commit |
  | Imports (path alias · order · barrel file) · errors (throw vs Result) · logs (library · fields) · async (Promise vs Observable · `async`/`await` vs callback) | The entry file and 1 file in the same layer as the code to change |
  | Tests: file names · beside the code or in a separate folder · fixtures or builders the repo already has | The nearest test folder |
- **Stack** — open the skill for the language: `stack-dotnet` · `stack-typescript` · `stack-python` · `stack-sql`

Follow the repo's style even if it is not the style you like. If you want to change a convention, propose it in the report. Do not change it quietly in the middle of the work.

## 4 · The 10-line map

Write it into the todo or the reply before you start the change, and pass it to the subagent that will write the code.

```text
Task: <1 line>
Entry point: <file:line>
Path: <A.fn> → <B.fn> → <C.fn> → <table/file>
Place to change: <file:function>
Shared with: <other callers> (blast-radius: yes/no)
Why it is written this way: <reason from commit or docs> · unknown → (รอยืนยัน)
Conventions: <naming · error · test to follow>
Commands: build <...> · test <...> · single test <...>
Tests that lock the behaviour: <file> · none → write before the change
เสี่ยง: <what could break>
```

## 5 · Traps

- Reading only the file whose name matches the task, and missing a wrapper or middleware that transforms the data before it arrives.
- Trusting an old comment that no longer matches the code, when the code and tests are the truth.
- Tracing the whole repo until the context is full, when you should read only the path of this task.
- "Cleaning up" along the way without a test. That should be a separate refactor task.


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


---

# skill: lazy-coding

Use when writing or reviewing code, for the simplest that works

# lazy-coding — the least code that works, still easy to find and to read

> **One rule:** a tired teammate must understand it in 6 months, with no context. If they can't, simplify until they can. The best code is the code you never had to write.

## Use when

- Writing or reviewing any code. On by default at **full** in every response; switch with `lazy lite | full | ultra`; off only on "stop lazy" / "normal mode".

Not for: names, function shape and file layout → `readable-code` (**always load together**: lazy decides how much code, readable-code decides how it looks) · the repo skeleton → `project-bootstrap` · docs, plans, architecture → `superuser:simplify`

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

# skill: testing-standards

Use when setting up automated tests or fixing flaky ones

# Testing Standards — tests the team trusts: fast, deterministic, tied to behavior

> **One rule:** a test nobody trusts is worse than no test. A test that flips between red and green on its own gets `skip`ped within 2 weeks, and then the whole suite dies with it.

## Use when
- Starting tests in a new project, or adding tests to existing code
- Someone asks for unit tests or to automate the tests
- The existing suite is slow, flips red and green, or nobody maintains it

Not for: browser E2E (Playwright/Cypress) → `e2e-testing-patterns` · a real mobile app on an emulator → `app-verifier-setup` (`references/android-native.md`) · business-level test cases before writing → `test-case-template`.

## Steps

### 1 · Use what exists; ask only when a new one must be added
- If the project already has a framework, or the stack ships one with its SDK (Flutter `flutter_test` · Angular CLI), use it. Do not ask; 2 systems in one project is worse than one you do not like.
- If a new test package must be installed, put the question in the single round of questions before starting (use `AskUserQuestion` if available), covering **framework** (options per stack in [`references/per-stack.md`](references/per-stack.md)) and **scope now**: unit only · unit + integration (real DB through Testcontainers of the same type as production; in-memory SQLite only when production is SQLite) · full set including E2E (continue to `e2e-testing-patterns`).
- If the need appears mid-work, pick the recommended option (first in the table) and record it under "ตัดสินใจเอง" in the report. Do not stop to ask.

### 2 · Keep the pyramid: unit 75% · integration 20% · E2E 5%
- Unit touches nothing outside and runs in under 100 ms each. E2E only for the paths that make money.
- A mobile app has a widget test layer (Flutter) or component test layer (React Native) between unit and E2E; use it as the main middle layer.
- **The whole unit suite finishes in 10 seconds** (Flutter: count after compilation; this number is รอยืนยัน on a real machine). Slower, and people stop running it before commit.

### 3 · Decide what needs a test
- **Must have:** business logic (calculations, permission conditions, state transitions) · every edge case (empty, zero, negative, bounds, duplicates) · **every bug that has happened** (write the red test first, then fix) · contracts others depend on (API response shape, event schema).
- **Not needed:** getters/setters, DTOs, direct mappings · framework code · other people's libraries · display-only UI.
- Coverage target is 70–80% of business logic, not 100% overall. A gate of "must not drop below the current level" beats a target number.

### 4 · Write the tests
- **Name** so the name says what broke: `MethodName_Scenario_ExpectedResult` (`CreateOrder_WhenStockIsZero_ThrowsOutOfStock`). Where the name is a string (Dart · Vitest · Jest), use `group('<what is tested>')` + `test('<scenario> → <expected result>')` as a sentence.
- **AAA** (Arrange · Act · Assert), 3 parts separated by blank lines; Act is one line.
- **1 test = 1 reason to break.** 5 unrelated asserts → 5 tests.
- **Before writing, say which code change turns this test red.** Cannot say → it does not catch behavior; rewrite to catch an observable result. The answer is "the text in the source file changes" → you test characters; run the real thing instead. It goes red only when someone changes a value on purpose (a label color) → it is a change detector; test what that value affects.
- **No logic in tests** (no `if`, no loop computing the expected value). Several cases → parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`).
- **Same result every run:** inject time (`TimeProvider` on .NET 8+, or `now()`) and never call `DateTime.Now` in the code under test · fix the random seed · tests run in any order, never relying on a previous test's state · **no `sleep`** for async; use a fake timer or a real signal.
- **Mock only boundaries outside the system** (HTTP, queues, time, files), not your own pure computation. Too many mocks tie the test to the code layout, and one refactor turns the suite red.
- Test data is never real customer data; use a fake-data generator.
- Do not write tests after the work only to pass the gate, assert only "does not throw", or chase 100% coverage.

### 5 · Integration tests
- Use a **real DB of the same type as production** (Testcontainers); SQL that passes on SQLite may break on PostgreSQL.
- Each test starts from a known state (transaction rollback or truncate).
- Separate the commands (`npm run test:unit` / `test:integration`).
- Test the API **contract**: status code, JSON shape, important headers, not just "no error".

### 6 · CI
`push / PR → lint → unit (< 10 s) → integration → build`
- **Red test = cannot merge**, no exceptions.
- No `skip`/`ignore` on the main branch; to skip, attach an issue link.
- A flaky test must be **fixed or deleted**; never retry until green, because that hides a real bug.
- Show the coverage report on the PR so a rise or fall is visible.

## Check before done
- [ ] Existing or SDK-shipped framework used; a newly installed one was asked or recorded under "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` passes from a clean machine with no extra setup (long output → `> _to_delete/test.txt 2>&1` then `tail -20`)
- [ ] The unit suite finishes in 10 seconds
- [ ] Shuffled order still all green (pytest: `pytest-randomly` then plain `pytest` · Vitest: `--sequence.shuffle` · Jest: `--randomize` · Flutter: `--test-randomize-ordering-seed random`)
- [ ] 3 repeated runs give the same result
- [ ] Break the code deliberately in 1 spot: the test **must go red**; if still green it tests nothing
- [ ] **Try breaking it in your head before closing the test file**, 5 ways: wrong constant or argument · wrong branch · forgotten state change or side effect · empty or default return · unchecked 0 · empty · null · no permission · wrong format. Any way that turns no test red is behavior nobody protects.
- [ ] Reading the test name tells what broke, without opening the code
- [ ] No `sleep` / `Thread.Sleep` in the suite · no test skipped without a reason

Related: health/ping endpoints → `web-service-essentials` · logs to trace a red test → `logging-standards` · reviewing test code → `code-review-checklist`.

## References
- [`references/per-stack.md`](references/per-stack.md) — open for framework options per stack, command details and config files for .NET, Node/TS, Python, Angular, Flutter.


## reference: per-stack.md

# Setup and examples per stack

> The examples in this file are **not yet run or tested** (except the Flutter section, which comes from a real app, Lumio). The rest is the standard setup of each framework.
> On the first run, check whether the commands and paths match the real project layout.

---

## Contents

1. [.NET — xUnit](#net--xunit)
2. [Node / TypeScript — Vitest](#node--typescript--vitest)
3. [Python — pytest](#python--pytest)
4. [Angular](#angular)
5. [Flutter / Dart — flutter_test](#flutter--dart--flutter_test)
6. [Comparison table](#comparison-table)

---

## .NET — xUnit

```bash
dotnet new xunit -o tests/MyApp.Tests
dotnet add tests/MyApp.Tests reference src/MyApp
dotnet add tests/MyApp.Tests package AwesomeAssertions     # assertions that read like sentences (.Should()) · use instead of FluentAssertions since v8, which needs a paid Xceed license for commercial use · AwesomeAssertions is free, Apache-2.0, checked 22 Oct 2026 (B.E. 2569) on nuget.org
dotnet add tests/MyApp.Tests package NSubstitute           # mocks with shorter syntax than Moq
dotnet add tests/MyApp.Tests package Microsoft.AspNetCore.Mvc.Testing   # integration
dotnet add tests/MyApp.Tests package Testcontainers.PostgreSql
```

```csharp
public class DiscountCalculatorTests
{
    [Fact]
    public void CalculateDiscount_WhenMemberIsGold_Returns15Percent()
    {
        // Arrange
        var sut = new DiscountCalculator();

        // Act
        var result = sut.Calculate(new Order { Total = 1000m }, MemberTier.Gold);

        // Assert
        result.Should().Be(150m);
    }

    // Theory = test many cases with one body of code — never write the loop yourself
    [Theory]
    [InlineData(MemberTier.None, 0)]
    [InlineData(MemberTier.Silver, 50)]
    [InlineData(MemberTier.Gold, 150)]
    public void CalculateDiscount_ByTier_ReturnsExpected(MemberTier tier, decimal expected)
        => new DiscountCalculator().Calculate(new Order { Total = 1000m }, tier)
               .Should().Be(expected);
}
```

Integration through `WebApplicationFactory` — sends real HTTP into the real pipeline without opening a port:

```csharp
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GetOrders_WhenNotAuthenticated_Returns401()
    {
        var res = await factory.CreateClient().GetAsync("/api/v1/orders");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

```bash
dotnet test                                        # everything
dotnet test --filter "FullyQualifiedName!~Integration"   # unit tests only
dotnet test --collect:"XPlat Code Coverage"
```

---

## Node / TypeScript — Vitest

```bash
npm i -D vitest @vitest/coverage-v8
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // the setup file sets fake timers / clears mocks the same way for every file
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.dto.ts', 'src/**/index.ts'],
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
});
```

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountCalculator } from '../src/discount';

describe('DiscountCalculator', () => {
  beforeEach(() => vi.restoreAllMocks());   // stop state leaking across tests

  it('gives gold members a 15 percent discount', () => {
    const sut = new DiscountCalculator();
    expect(sut.calculate({ total: 1000 }, 'gold')).toBe(150);
  });

  it.each([
    ['none', 0], ['silver', 50], ['gold', 150],
  ])('gives the right discount for tier %s', (tier, expected) => {
    expect(new DiscountCalculator().calculate({ total: 1000 }, tier)).toBe(expected);
  });
});
```

Control time instead of using `sleep`:

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15T10:00:00+07:00'));
await vi.advanceTimersByTimeAsync(5000);   // advance 5 seconds at once
vi.useRealTimers();
```

```json
{ "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts"
} }
```

> **Jest instead of Vitest:** The API is almost the same (`jest.fn` ↔ `vi.fn`), but you must set up `ts-jest`
> or babel for TypeScript. Choose Jest when the team already knows it or you need one of its presets.

---

## Python — pytest

```bash
pip install pytest pytest-cov pytest-randomly
```

`pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q --strict-markers --cov=src --cov-report=term-missing"
markers = ["integration: needs DB/network — run separately from unit"]
```

```python
import pytest
from src.discount import calculate_discount

def test_calculate_discount_when_member_is_gold_returns_15_percent():
    assert calculate_discount(total=1000, tier="gold") == 150

@pytest.mark.parametrize("tier,expected", [("none", 0), ("silver", 50), ("gold", 150)])
def test_calculate_discount_by_tier(tier, expected):
    assert calculate_discount(total=1000, tier=tier) == expected

@pytest.mark.integration
def test_create_order_persists_to_db(db_session):
    ...
```

`conftest.py` — shared fixtures (restore the original state after every test):

```python
import pytest

@pytest.fixture
def db_session(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield Session(bind=conn)
    tx.rollback()          # every test always starts from a clean database
    conn.close()
```

```bash
pytest                        # everything (pytest-randomly shuffles the order itself = catches tests that depend on each other)
pytest -m "not integration"   # unit tests only
pytest --lf                   # only the ones that failed last time
```

---

## Angular

**Vitest that ships with the Angular CLI** (new projects — the builder `@angular/build:unit-test` is already configured, run `ng test` with no extra plugin · Karma still works · checked 22 Oct 2026 (B.E. 2569) on angular.dev/guide/testing) · add Testing Library if you want queries the way a real user finds things

```bash
ng test
npm i -D @testing-library/angular @testing-library/user-event
```

For older Angular projects (without this builder) → migrate from Karma following angular.dev/guide/testing/migrating-to-vitest, or use `@analogjs/vite-plugin-angular` with `vitest` and `jsdom`

```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { OrderFormComponent } from './order-form.component';

it('shows a required error when the name is empty on submit', async () => {
  await render(OrderFormComponent);

  await userEvent.click(screen.getByRole('button', { name: /บันทึก/ }));

  expect(await screen.findByText(/กรุณากรอกชื่อ/)).toBeTruthy();
});
```

> Test from the **user's point of view** — find a button by the text people see (`getByRole`, `getByText`),
> not `By.css('.btn-primary')`, because once the CSS class changes the test turns red even though the UI still works correctly.

**Jasmine + Karma** (Angular's old default — keep using it if the project already has it):

```ts
describe('DiscountService', () => {
  let service: DiscountService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DiscountService] });
    service = TestBed.inject(DiscountService);
  });

  it('calculate_whenMemberIsGold_returns15Percent', () => {
    expect(service.calculate(1000, 'gold')).toBe(150);
  });
});
```

```bash
ng test --watch=false --browsers=ChromeHeadless --code-coverage    # for CI
```

---

## Flutter / Dart — flutter_test

It ships with the SDK, so there is nothing to install. Test files live in `test/` and mirror the structure of `lib/` (`lib/features/measure/lux_math.dart` → `test/features/measure/lux_math_test.dart`). File names use snake_case, the Dart convention.

```dart
// fake of the bridge to the native side: you can implement the real class directly, with no new interface
class FakeDeviceLight implements DeviceLight {
  final _lux = StreamController<double>.broadcast();
  void emitSensor(double lux) => _lux.add(lux);
  @override
  Stream<double> sensorLux() => _lux.stream;
  // ...the remaining overrides return the values the test chooses (has a sensor or not · camera permission)
}

void main() {
  group('measure screen', () {
    testWidgets('shows live lux and verdict', (tester) async {
      // the default test screen is 800×600 — set it to a phone size, or the button sits off-screen and the tap misses
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.75;
      addTearDown(tester.view.reset);

      final device = FakeDeviceLight();
      final meter = MeterController(device);
      await tester.pumpWidget(App(meter: meter));
      device.emitSensor(420);
      await tester.pump(MeterController.tick);   // do not use pumpAndSettle when a Timer is looping

      expect(find.textContaining('420 lux'), findsOneWidget);
      meter.dispose();   // close the Timer inside the test itself, or it fails with "A Timer is still pending"
    });
  });
}
```

| Topic | Do this |
|---|---|
| Test layers | unit (`test`) is for pure logic, while widget (`testWidgets`) is for screens and is the main middle layer. For on-device E2E, use `integration_test` (`flutter test integration_test/`) or an `adb` script per `app-verifier-setup` |
| platform channel | fake it with a class that `implements` the real bridge class, and add `mocktail` only when the hand-written fake grows long |
| `pumpAndSettle` | Fine when the screen really settles. If a Timer or animation loops forever, the screen never settles until it times out, so use `pump(duration)` instead |
| Pending Timer | Dispose the controller that holds a Timer inside the test itself before the last line, because a Timer still running at the end makes the test fail |
| Small screen | Add 1 separate test set at 360×800 dp with Thai text + a large `textScaler` to catch overflow (Flutter reports overflow as an exception in tests) |
| SnackBar covers a button | A widget test catches it by tapping the lower button after the SnackBar appears, then asserting **the result of the tap** (a `tester.tap` that hits something covering it only prints a warning and does not fail) |
| golden test | Optional, because images differ by machine and font. Use it when the team has a fixed CI machine. |
| coverage | `flutter test --coverage` → `coverage/lcov.info` |
| Prove the test is useful | Break the code in 1 place, run it, and it must go red, then fix it back |

```bash
flutter test                              # everything
flutter test test/features/measure        # one folder
flutter test --coverage
flutter test integration_test/            # needs an emulator or a real device connected
```

---

## Comparison table

| Topic | xUnit | Vitest | pytest | Angular (Vitest) | flutter_test |
|---|---|---|---|---|---|
| Many cases | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` | a `for` loop that creates `test(...)` inside a `group` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` | an `implements` class · `mocktail` |
| Before/after each test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` | `setUp` / `tearDown` / `addTearDown` |
| Control time | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` | `tester.pump(duration)` · `fakeAsync` |
| Real DB | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — | — (`SharedPreferences.setMockInitialValues`) |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` | `--coverage` |
| Shuffle order | Not built in | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` | `--test-randomize-ordering-seed random` |

## Framework options to offer (moved from SKILL.md)

| Stack | Options to offer |
|---|---|
| .NET | **xUnit** (recommended · the standard of modern .NET) · NUnit (a team coming from NUnit) · MSTest (organizations tied to VS) |
| Node/TS | **Vitest** (recommended · fast, little setup, ESM/TS work out of the box) · Jest (largest ecosystem) · `node:test` (when you want to install nothing) |
| Python | **pytest** (recommended) · `unittest` (pure stdlib; no extra packages allowed) |
| Angular | **Vitest that ships with Angular CLI** (`ng test` · recommended · default for new projects) + Testing Library if wanted · Jasmine + Karma (the old default, still usable) · very old versions use Analog |
| Flutter · Dart | **`flutter_test`** (ships with the SDK, no need to ask) · fake with a class that `implements` the real one, before installing `mocktail` |


---

# skill: code-review-checklist

Use when reviewing a pull request or your own code

# Code Review Checklist — review a pull request or your own code, with actionable comments

> **In SuperUser:** start from the playbook [`review`](../superuser/references/playbook-review.md), then use this checklist for ordinary reviews. High-risk work or a large diff → `adversarial-review-panel`.

## Use when
- Reviewing a pull request, self-reviewing before submitting, or auditing an existing module
- Not for: a second look inside a team → a new `reviewer` agent (it applies this checklist) · contested design, large or high-risk diff, "stress test" → `adversarial-review-panel` · reviewing a visual → `graphic-design:design-review` if installed, else `ui-craft` · writing the PR description → `pr-description-template` · hunting misleading patterns across the codebase → `code-gardener` · scanners, secrets, dependency check, OWASP Top 10:2025 → `security-gate` (run both before merge; `references/owasp-top10.md`, `references/owasp-stack-checks.md`)

## Steps
1. **Understand the intent:** read the PR description and linked ticket. For a branch or PR, pin the range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report.
2. **Skim the diff** for the overall shape.
3. **Review against the checklist.** House checks first; each skill holds the full rules, so link it in the comment:
   - Security: run [`security-gate`](../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
   - Simple enough: [`lazy-coding`](../lazy-coding/SKILL.md) · readable: [`readable-code`](../readable-code/SKILL.md) · tests next to the code and proving the change: [`testing-standards`](../testing-standards/SKILL.md)
   - Shared code touched → [`blast-radius`](../blast-radius/SKILL.md) list is in the PR · commit message follows [`commit-message-format`](../commit-message-format/SKILL.md)
   - The generic list (correctness, design, performance, documentation, maintainability): [`references/full-checklist.md`](references/full-checklist.md)
4. **Verify before posting:** hand every `blocking:` finding to a fresh agent (or second reader) with only the diff and the finding, and ask if it is real. Drop it if they cannot reproduce or point to the line.
5. **Do not flag:** a problem that existed before this PR · what the linter or compiler already catches · a nitpick a senior reviewer would skip · behaviour that looks wrong but is right (check context first) · a rule the team silenced on purpose with a lint-ignore comment · a problem only for an input that cannot occur here.
6. **Run the code** if non-trivial; do not just read.
7. **Leave actionable comments:** a concrete fix for each, not just the problem. Prefixes:

   | Prefix | Meaning | Example |
   |---|---|---|
   | `blocking:` | Must fix before merge | `blocking: This will cause Y in production because Z.` then `Suggest: <concrete fix>` |
   | `important:` | Should fix, can be follow-up if urgent | |
   | `nit:` | Minor, optional | `nit: Consider X for readability` |
   | `q:` | Question, not necessarily a change | `q: Why did you choose X over Y here?` |
   | `praise:` | Acknowledge good work | `Nice approach with X — much cleaner than the previous version.` |

   These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน with counts per level.
8. **Avoid:** bikeshedding when there is no convention · "why not MY way" · only criticism · vague comments ("this is wrong": say why and suggest a fix) · reviewing too much at once (ask for PRs under 400 lines).

## Run as a command
`/software-development:code-review-checklist <file path or PR description>` — use a new read-only `reviewer` agent to review **$ARGUMENTS** (high-stakes or contested → `adversarial-review-panel`). Open `superuser` with the playbook `review` and copy its steps into the todo first; use both together. The reviewer: reads the file(s) or diff and pins the range (step 1) · applies this skill · rates each finding **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional) · gives a concrete fix for each · outputs verdict **ผ่าน** / **ไม่ผ่าน** with counts per level (not the `blocking:`/`nit:` prefixes).

The author does not fix every finding on sight: a finding can be wrong (misread code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge.

## Check before done
- Every finding has a severity and a concrete fix · every `blocking:` was verified by a second reader
- Both SHAs are in the report · none of the "do not flag" kinds is in the findings

## References
- [`references/full-checklist.md`](references/full-checklist.md) — open when the diff needs the generic checks (correctness, design, performance, documentation, maintainability)


## reference: full-checklist.md

# Code review — full generic checklist

Moved out of [SKILL.md](../SKILL.md). Open it for a large or unfamiliar change. The house-specific checks stay in SKILL.md.

### Correctness

- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null, empty, zero, negative, very large)
- [ ] Are error paths handled? (network failure, timeout, invalid input)
- [ ] Are race conditions / concurrency issues considered?
- [ ] Off-by-one errors checked?
- [ ] Are assumptions explicit (or asserted)?

### Design

- [ ] Does this fit the existing architecture?
- [ ] Is the abstraction at the right level? (not too generic, not too specific)
- [ ] Single Responsibility — does each function/class do one thing?
- [ ] DRY — but not over-abstracted?
- [ ] Are dependencies appropriate? (no circular, minimal coupling)
- [ ] Could this be simpler?

### Tests

- [ ] Are there tests for the new code?
- [ ] Tests cover happy path + edge cases + errors?
- [ ] Tests would actually fail if code broke? (no false positives)
- [ ] Tests are readable and maintainable?
- [ ] No flaky tests introduced?

**Rate each missing test 1–10 before suggesting it** (adapted from `pr-test-analyzer` · claude-plugins-official · Apache-2.0 · opened 2026-11-10). 9–10: data loss, money or security would break unnoticed · 7–8: the user sees an error · 5–6: edge case with limited impact · below 5: do not suggest it. Review behaviour, not line coverage. Do not ask for tests of plain getters and setters.

### Security

- [ ] Input validation at boundaries?
- [ ] No SQL injection (parameterized queries)?
- [ ] No XSS (proper escaping)?
- [ ] No secrets/credentials in code?
- [ ] Authorization checks for sensitive operations?
- [ ] PII / sensitive data logged appropriately?
- [ ] Dependencies updated? No known CVEs?

### Performance

- [ ] No N+1 queries?
- [ ] Appropriate caching where beneficial?
- [ ] Loops/algorithms with appropriate complexity?
- [ ] Large data handled with pagination/streaming?
- [ ] No unnecessary network calls?

### Readability

- [ ] Names reveal intent? (variables, functions, classes)
- [ ] Functions reasonably short?
- [ ] Complex logic has explanatory comments? (WHY, not WHAT)
- [ ] No commented-out code left behind?
- [ ] No debug prints / TODO without ticket?
- [ ] Consistent with existing code style?

### Documentation

- [ ] Public APIs documented?
- [ ] README/CHANGELOG updated if needed?
- [ ] Breaking changes called out?
- [ ] New env vars / config documented?

### Maintainability

- [ ] Could a new team member understand this in 6 months?
- [ ] Easy to modify when requirements change?
- [ ] No magic numbers / strings (use constants)?
- [ ] Logging at appropriate levels?


---

# skill: commit-message-format

Use when setting up commitlint or semantic-release

# Conventional Commit Message Format

> When to commit and logging each step → `commit-log` (shared skill). This file adds the release side: scope, commitlint, semantic-release.

## When to use this skill

- Writing commits that feed release tooling (commitlint, semantic-release) — everyday commits use `commit-log`
- Reviewing commits in a PR for consistency
- Setting up commitlint / semantic-release

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | Use for | Triggers release? |
|------|---------|-------------------|
| `feat` | New feature | minor version bump |
| `fix` | Bug fix | patch version bump |
| `docs` | Documentation only | no |
| `style` | Formatting, no code change | no |
| `refactor` | Refactor without behavior change | no |
| `perf` | Performance improvement | patch |
| `test` | Adding/updating tests | no |
| `build` | Build system, dependencies | no |
| `ci` | CI/CD changes | no |
| `chore` | Maintenance tasks | no |
| `revert` | Revert previous commit | depends |

## Subject Rules

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — start with lowercase letter
- **No period at end**
- **Max 50 characters**
- **Complete this sentence:** "If applied, this commit will _____"

## Short and readable (applies to every commit)

Someone scanning `git log --oneline` should understand each line without opening the diff.

- **Measure the repo's norm, then follow it** — `git log --oneline -30` before the first commit: language, whether `scope` is used, which types appear, typical subject length. A repo that never uses scope does not get one from you; a repo at 40 characters does not get a 72-character subject. Note what you measured in the report once (idea from ECC conventional-commit-review).
- **Language follows the repo** — A Thai repo gets Thai descriptions; `type(scope):` stays English so tools can parse it. Lowercase and imperative mood apply to English only.
- **Subject says what changed for the reader**, not which file was touched: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`
- **One line is enough** for most commits. Add a body only when *why* is not obvious from the subject — at most 3 short lines or bullets
- **No filler** — no "this commit", "minor changes", "update code", "แก้นิดหน่อย", or a list of changed files (the diff already shows them)
- **One commit, one topic** — if the subject needs "and" or `·` to join unrelated changes, split the commit. Check `git diff --stat` before writing the subject: when the files fall into more than one topic (feature + unrelated rename, fix + formatting sweep), propose the split as a list of `<subject> → <files>` per commit and stage each with `git add <files>` or `git add -p`; never hide the second topic in the body

| ✗ Hard to read | ✓ Short and clear |
|---|---|
| `update items.js, server.js, add test, fix bug` | `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` |
| `feat: implement new functionality for exporting the low-stock report data to CSV format` | `feat(report): ส่งออกรายงานของใกล้หมดเป็น CSV` |
| `refactor: แก้โค้ดให้ดีขึ้น` | `refactor(report): อ่านประวัติเบิกครั้งเดียวแทนทุกสินค้า` |

## Body Rules

- Separate from subject with blank line
- Wrap at 72 characters
- Explain **why**, not just **what** (diff shows what)
- Use bullet points if multiple points
- Reference issues/tickets at the end

## Footer Conventions

```
Closes #123              ← closes the issue
Refs #456                ← references but doesn't close
BREAKING CHANGE: ...     ← breaking change notice
Co-authored-by: ...      ← attribution
```

## Quality Checklist

- [ ] Type matches the change (not just "chore" for everything)
- [ ] Scope is meaningful (component/module name)
- [ ] Subject is imperative and ≤50 chars — Thai subjects count base consonants only (~50); vowels and tone marks do not count · กติกาเต็มอยู่ใน `superuser` skill `commit-log`
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable
