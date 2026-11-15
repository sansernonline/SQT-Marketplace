# skill: code-orientation

Use before changing code you have not yet read

# code-orientation — understand the existing code before touching it

> Most code an agent writes breaks not because the agent cannot write, but because it does not know how the old code works or why it was written that way.
> 10 minutes of reading saves several rounds of fixes.

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
- **Convention checklist** (note only what differs from the language default · idea from ECC codebase-onboarding)

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

## 6 · Link to other skills

`context-budget` (heavy reading) · `blast-radius` (changing shared code) · `principle-fix-root-cause` (bug) · `readable-code` · `lazy-coding` · `testing-standards` · the stack skill


---

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


---

# skill: lazy-coding

Use when writing or reviewing code, for the simplest that works

# Lazy Coding

You write code like a senior dev who has been paged at 3 AM for someone else's
clever abstraction. Lazy means efficient, not careless. The best code is the
code you never had to write.

**Team rule:** a tired teammate must understand it in 6 months, with no
context. If they can't, simplify until they can.

## Active every response

On by default at **full**. Don't drift back to over-building — still on even
when you're unsure. Switch with `lazy lite | full | ultra`. Off only on
"stop lazy" / "normal mode".

## The ladder — stop at the first rung that holds

1. **Does this need to exist?** Speculative need → skip it, say so in one line. (YAGNI)
2. **Stdlib does it?** Use it.
3. **Native platform feature covers it?** `<input type="date">` over a picker lib, CSS over JS, a DB constraint over app code. On mobile (Flutter, React Native) "native" means writing a platform channel in Kotlin/Swift — the costly rung; a maintained plugin or a framework widget comes first.
4. **An already-installed dependency solves it?** Use it. Never add a new dependency for what a few lines can do.
5. **Can it be one line?** One line.
6. **Only then:** the smallest code that works.

Two rungs both work → take the higher one and move on. The ladder is a reflex,
not a research project. The first lazy solution that works is the right one.

## Rules

- No unrequested abstractions — no interface with one implementation, no factory for one product, no config for a value that never changes.
- No scaffolding "for later." Later can scaffold for itself.
- Delete before you add. Boring before clever — clever is what someone decodes at 3 AM.
- Deletion test: remove the piece, run the tests — still green? It stays deleted. (idea from mattpocock codebase-design)
- Shortest working diff wins — but never by merging concerns into one file. Fewest files **that still keep one concern per file**.
- Match the repo — read 2-3 nearby files first and copy their style.
- Two stdlib options the same size? Take the one that's correct on edge cases. Lazy means less code, not a flimsier algorithm.

## Simple is not scattered

Lazy cuts *how much* code exists. It never cuts *where code lives*. A 40-line
project still looks like software engineering, not a scratchpad:

- **One concern per file.** Entry point, logic, config and I/O each have their own place. A `main.py` that also parses, validates, talks to the database and prints is not lazy — it is a god-file nobody can test.
- **Feature folders, not type folders.** `invoice/` holds everything about invoices (`readable-code` §7). No `utils/` dumping ground.
- **Names carry meaning.** Lazy is not `tmp`, `data`, `handle()`. Follow `readable-code` §1–4.
- **Boundaries stay explicit.** Function signatures, module exports and the data shape between layers are written out, not implied — fewer lines inside each box, never fewer boxes.
- **Config and secrets outside code.** Even one environment variable goes in `.env.example`, not inline. A project that reads no environment variables (an offline mobile app) has no `.env.example` — do not invent one.
- **Domain constant tables are code, not config.** Values that change only with a code release (thresholds, unit tables, lux ranges) go in one named constants file next to the feature, not in env vars or a settings screen. "Config outside code" means values that differ per environment or per deployment.
- **Tests sit next to the code they test** — one small check per non-trivial path (see "When NOT to be lazy"). Where the toolchain fixes the test folder (Flutter `test/` mirroring `lib/`), follow it — "next to" then means the same relative path.
- **New project → `project-bootstrap` first.** Lazy code lands in a repo that already has its skeleton (README, folder layout, lint, test command). Never scatter files at the root to save a minute.

Test: a tired teammate opens the repo cold. Can they guess which file holds a
given behaviour in 30 seconds? If not, the structure is not too complex — it
is *missing*.

## Mark your simplifications

A deliberate shortcut reads as intent, not ignorance, when you label it. Name
the ceiling and the upgrade path:

```python
# simple: in-memory dict cache — swap for Redis if we run more than one process
```

```ts
// simple: O(n) scan, fine under ~1k items — index it if the list grows
```

## Output

Code first. Then at most three short lines: what you skipped and when to add
it. If the explanation is longer than the code, delete the explanation.

Pattern: `[code] → skipped: [X] — add when [Y].`

## Intensity

| Level | What changes |
|-------|------------|
| **lite** | Build what's asked, but name the lazier option in one line. The user picks. |
| **full** | The ladder enforced. Stdlib and native first. Shortest diff, shortest explanation. Default. |
| **ultra** | YAGNI extremist. Ship the one-liner and challenge the rest of the requirement in the same breath. |

Example — "Add a cache for these API responses."

- **lite:** "Done. FYI `functools.lru_cache` does this in one line if you'd rather not own a cache class."
- **full:** "`@lru_cache(maxsize=1000)` on the fetch function. Skipped a custom cache class — add when lru_cache measurably falls short."
- **ultra:** "`@lru_cache` on the fetch function — done, since you asked. Do you have a profile showing these calls are slow? If not, this line can go. A hand-rolled TTL cache is a bug farm with a hit rate."

## When NOT to be lazy

Never simplify away: input validation at trust boundaries, error handling that
prevents data loss, security, accessibility basics, or anything explicitly
requested. If the user insists on the full version, build it — no re-arguing.

Non-trivial logic (a branch, loop, parser, or money/security path) leaves ONE
runnable check behind — the smallest thing that fails if the logic breaks: an
`assert`-based self-check or one small `test_*`. No frameworks or fixtures
unless asked. Trivial one-liners need no test.

## Pairs with

- `simplify` — the suite-wide rule for every kind of work; this skill is its detail for code.
- `readable-code` — **always load together**. Lazy decides how much code; readable-code decides names, function shape and file layout. One without the other gives either bloat or a scratchpad.
- `project-bootstrap` — the repo skeleton lazy code lands in.
- `simplicity-first` — same spirit, for docs, plans, and architecture.
- `code-review-checklist` — the lazy diff still gets reviewed.


---

# skill: testing-standards

Use when setting up automated tests or fixing flaky ones

# Testing Standards

> **One rule:** a test nobody trusts is worse than no test.
> A test that flips between red and green on its own gets `skip`ped within 2 weeks, and then the whole suite dies with it.

## When to use this skill

- Starting tests in a new project, or adding tests to existing code
- Someone asks "have unit tests / automate the tests"
- The existing suite is slow, flips red and green, or nobody maintains it

## When **not** to use it

- E2E through a browser (Playwright/Cypress): use `e2e-testing-patterns`
- Driving a real mobile app on an emulator: use `app-verifier-setup` (`references/android-native.md`)
- Designing business-level test cases before writing: use `test-case-template`

---

## 1 · First: use what exists; ask only when a new one must be added

- **If the project already has a framework, or the stack ships a test library with its SDK** (Flutter `flutter_test` · Angular CLI), use it. Do not ask.
- **If a new test package must be installed**, put this question into the single round of questions before starting (if the tool has a picker for answers, such as `AskUserQuestion`, use it), because switching later after a wrong choice is very expensive.
- If you only discover mid-work that a choice is needed, pick the **recommended** one in the table and continue, then record it under the "ตัดสินใจเอง" (decided on my own) heading of the report. Do not stop to ask midway.

2 things to settle:

**Item 1 — framework**

| Stack | Options to offer |
|---|---|
| .NET | **xUnit** (recommended · the standard of modern .NET) · NUnit (a team coming from NUnit) · MSTest (organizations tied to VS) |
| Node/TS | **Vitest** (recommended · fast, little setup, ESM/TS work out of the box) · Jest (largest ecosystem) · `node:test` (when you want to install nothing) |
| Python | **pytest** (recommended) · `unittest` (pure stdlib; no extra packages allowed) |
| Angular | **Vitest that ships with Angular CLI** (`ng test` · recommended · default for new projects) + Testing Library if wanted · Jasmine + Karma (the old default, still usable) · very old versions use Analog |
| Flutter · Dart | **`flutter_test`** (ships with the SDK, no need to ask) · fake with a class that `implements` the real one, before installing `mocktail` |

**Item 2 — the scope wanted now**

- unit only (fast, touches no DB/network)
- unit + integration (touches a real DB through Testcontainers, using the same DB type as production · in-memory SQLite is allowed only when production is also SQLite)
- the full set including E2E (continue to `e2e-testing-patterns`)

> If the project **already has a framework**, do not ask; use the existing one, because having 2 systems in one project
> is worse than using one you do not quite like.

---

## 2 · The pyramid — a ratio that lasts

```
        ▲  E2E  5%      ช้า เปราะ แพง — เอาไว้ทดสอบ "เส้นทางที่ทำเงิน" เท่านั้น
       ╱ ╲
      ╱   ╲ Integration 20%   ต่อ DB/API จริง ทดสอบว่าชิ้นส่วนคุยกันรู้เรื่อง
     ╱     ╲
    ╱       ╲ Unit 75%        ไม่แตะอะไรข้างนอก รันจบใน < 100ms ต่อตัว
   ╱_________╲
```

**A mobile app has a widget test layer (Flutter) or component test layer (React Native)** between unit and E2E. This layer builds the real screen in memory, then taps and reads it without an emulator. Most mobile apps have no integration tests that connect to a DB, so this layer is used as the main middle layer instead.

**The whole unit suite must finish in 10 seconds** (Flutter: count after compilation finishes, because merely starting `flutter test` takes several seconds · this number is รอยืนยัน (to be confirmed) on a real machine).
If it takes longer, people stop running it before commit, and a broken test is only found in CI, which is too late.

---

## 3 · What needs a test / what does not

**Must have**
- Business logic: calculations, permission conditions, state transitions
- Every edge case: empty value, zero, negative, lower/upper bound, duplicates
- **Every bug that has happened** — write a test that is red first, then fix (regression test)
- Contracts others depend on: the API response shape, the event schema

**Not needed**
- getters/setters, DTOs, direct mappings
- framework code (no need to test whether EF Core can save)
- other people's libraries
- UI that only displays with no logic

> **Honest coverage: 70–80% of business logic**, not 100% of the whole project.
> Chasing 100% gives you fake tests written just to make the number look good.
> A gate of "must not drop below the current level" is more useful than a target number.

---

## 4 · How to write

**Naming** — reading the name must tell you what broke, without opening the code

```
MethodName_Scenario_ExpectedResult

CalculateDiscount_WhenMemberIsGold_Returns15Percent
CreateOrder_WhenStockIsZero_ThrowsOutOfStock
ParseDate_WhenInputIsEmpty_ReturnsNull
```

In languages where the test name is a string (Dart · Vitest · Jest), use `group('<what is tested>')` + `test('<scenario> → <expected result>')` as a sentence, e.g. `group('verdict')` · `test('below 50 lux is too dark for reading')`

**AAA structure** — separate the 3 parts with blank lines so they are clearly visible

```
// Arrange   เตรียมข้อมูลและ dependency
// Act       เรียกสิ่งที่ทดสอบ — บรรทัดเดียว
// Assert    ตรวจผล
```

**1 test = 1 reason to break.** If there are 5 unrelated asserts, split into 5 tests.

**Be able to say, before writing, which code change makes this test go red** (adapted from superpowers `test-driven-development` · MIT)
- Cannot say → this test does not catch behavior. Rewrite it to catch an observable result.
- The answer is "the text in the source file changes" → you are testing characters. Run the real thing and check the result instead.
- It goes red only when someone deliberately changes a value (e.g. changes a label color) → it is a change detector, not a behavior test. Move to testing what that value affects.

**No logic in tests** — no `if`, no loop that computes the expected value.
To run several cases, use a parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`).

**Make results the same every time**
- Time: inject `TimeProvider` (.NET 8+) or `now()`; do not call `DateTime.Now` directly in the code under test.
- Randomness: fix the seed.
- Order: tests must run in any order; never depend on state a previous test left behind.
- **No `sleep`** to wait for async — use a fake timer or wait for a real signal.

**Mock only what is necessary** — mock boundaries outside the system (HTTP, queues, time, files).
Do not mock your own purely computational classes. If you mock too much, the test is tied to how the code is written;
one refactor turns the whole suite red even though behavior did not change.

---

## 5 · Integration test

- Use a **real DB of the same type as production** (Testcontainers), not SQLite instead of PostgreSQL,
  because SQL that passes on SQLite may break on the real one.
- Each test starts from a known state — transaction rollback or truncate every time.
- Separate the command from unit so they can run separately (`npm run test:unit` / `test:integration`).
- Test the API **contract**: status code, JSON shape, important headers — not just "no error".

---

## 6 · CI

```
push / PR → lint → unit (< 10 วินาที) → integration → build
```

- **Red test = cannot merge**, no exceptions.
- No `skip`/`ignore` left in the main branch — to skip, an issue link must be attached.
- A flaky test (flips red and green on its own) must be **fixed or deleted**; never retry until green, because that hides a bug.
- Show the coverage report on the PR page so it is visible whether it rose or fell.

Command details and config files for each framework are in `references/per-stack.md`.

---

## 7 · Review

- [ ] Used the existing framework or the one that ships with the stack; if a new one was installed, it was asked or recorded under "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` passes from a clean machine with no extra setup (long output → `> _to_delete/test.txt 2>&1` then `tail -20`)
- [ ] The unit suite finishes in 10 seconds
- [ ] Shuffling the test order still gives all green (pytest: install `pytest-randomly` then run plain `pytest` · Vitest: `--sequence.shuffle` · Jest: `--randomize` · Flutter: `--test-randomize-ordering-seed random`)
- [ ] 3 repeated runs give the same result (not flaky)
- [ ] Break the code deliberately in 1 spot, and the test **must go red** — if still green, the test tests nothing
- [ ] **Try breaking it in your head before closing the test file** — go through 5 ways: wrong constant or argument · entering the wrong branch · forgetting to change state or a side effect · returning empty or a default · not checking 0 · empty · null · no permission · wrong format — any way that makes no test red means that behavior is not yet protected by anyone
- [ ] Reading the test name tells you what broke, without opening the code
- [ ] No `sleep` / `Thread.Sleep` in the test suite
- [ ] No test left skipped without a reason attached

---

## 8 · Anti-patterns

- **Writing tests after the work is done just to pass the gate** — you get tests that confirm the code does what it does,
  not what it should do
- **Asserting only "does not throw"** — tests nothing at all
- **A test that depends on the previous test** — red at once when run alone
- **Mocking everything until the test tests only the mock**
- **`sleep(1000)` to wait for async** — slow and still brittle
- **Retrying a flaky test until green** — you just hid a bug that really happens in production
- **Chasing 100% coverage** — writing tests for getters for the number
- **Test data that is real customer data** — illegal and easy to leak; use a fake-data generator

---

## 9 · Link to other skills

| Need | Use together with |
|---|---|
| E2E through a browser | `e2e-testing-patterns` |
| E2E for a mobile app (`integration_test` · `adb`) | `app-verifier-setup` |
| Design test cases before writing code | `test-case-template` |
| Test health/ping endpoints | `web-service-essentials` |
| Logs that help trace a problem when a test is red | `logging-standards` |
| Review test code | `code-review-checklist` |


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


---

# skill: code-review-checklist

Use when reviewing a pull request or your own code

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
| Web app or API that must meet OWASP Top 10:2025 | `security-gate` (`references/owasp-top10.md` · per-stack checks in `references/owasp-stack-checks.md`) |

## Review Process

1. **Understand the intent** — read PR description and linked ticket
2. **Skim the diff** — get overall sense of changes
3. **Deep review** — go through each section of checklist below
   - **Verify before posting:** hand every `blocking:` finding to a fresh agent (or a second reader) with only the diff and the finding, and ask whether it is real. Drop it if they cannot reproduce or point to the line. For a contested diff use `adversarial-review-panel`.
   - **Do not flag** (adapted from the `code-review` command of claude-plugins-official · Apache-2.0 · opened 2026-11-10): a problem that existed before this PR · something the linter or compiler already catches · a nitpick a senior reviewer would skip · behaviour that looks wrong but is right (check the context first) · a rule the team silenced on purpose with a lint-ignore comment · a problem that only appears for an input that cannot occur here
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

## เรียกเป็นคำสั่ง

`/software-development:code-review-checklist <file path or PR description>`

> **Shortcut into SuperUser:** open the skill `superuser` with the playbook `review`, then copy the playbook steps into the todo first · the steps below describe the shape of the work and the output of this command · use them together with the playbook, not in place of it

Use a new `reviewer` agent (read-only) to perform a thorough code review of: **$ARGUMENTS** · high-stakes or contested change → `adversarial-review-panel`

The reviewer should:

1. Read the file(s) or diff to understand the change · for a branch or PR, pin the exact range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report so author and reviewer talk about the same code
2. Apply the `code-review-checklist` skill systematically
3. Rate each finding with the reviewer's own scale: **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional)
4. Give a concrete fix for each finding, not just criticism
5. Use the reviewer's output format: verdict **ผ่าน** / **ไม่ผ่าน** with counts per level. The `blocking:`/`nit:` prefixes in `code-review-checklist` are only for comments posted on a pull request

The author does not fix every finding on sight: a finding can be wrong (reviewer misread the code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge · idea from superpowers requesting-code-review


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

## Anti-patterns

- `update code`
- `fix bug`
- `WIP`
- `final commit` / `final final`
- Past tense: `added feature` (use `add feature`)
- Vague scope: `fix(misc): ...` (be specific)
