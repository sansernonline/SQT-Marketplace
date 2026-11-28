# skill: code-craft

Use when writing, changing or reviewing code, simple and readable

# code-craft — the simplest code that works, and names a newcomer can read

> **One rule:** write the least code that works, and name each piece so a teammate understands it six months later with no other context.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make it simpler", any new code, "do we need this?" | [`references/lazy-coding.md`](references/lazy-coding.md) |
| Naming a variable, function or file, "hard to read", "where does this go?" | [`references/readable-code.md`](references/readable-code.md) |
| Changing code you have not read yet | [`references/code-orientation.md`](references/code-orientation.md) |
| A small edit to shared code, "what else does this touch?" | [`references/blast-radius.md`](references/blast-radius.md) |
| "Clean up duplicates or dead code" | [`references/code-gardener.md`](references/code-gardener.md) |
| Logic that crosses functions or modules, many `if`s | [`references/principle-data-shape-first.md`](references/principle-data-shape-first.md) |
| Replacing an API, table or component | [`references/principle-replace-then-delete.md`](references/principle-replace-then-delete.md) |
| Code that may run twice or stop halfway, retries | [`references/principle-safe-to-rerun.md`](references/principle-safe-to-rerun.md) |

## Steps every part shares

1. **Climb the ladder and stop at the first rung that holds.** Does it need to exist? Does the standard library do it? Does a native platform feature do it? Does a dependency already in the project do it? Can it be one line? If none of these, write the smallest code that works.
2. **Add no abstraction nobody asked for.** No interface with one implementation, no factory for one product, no code "for later". Delete before you add.
3. **Mark a deliberate shortcut in a comment** that names the limit and the upgrade path, for example `// simple: in-memory cache, swap for Redis when we run two processes`.
4. **Keep one concern per file.** Group by feature, not by type: no `utils/` folder. Config and secrets live outside the code, but fixed domain tables stay in code. Tests sit beside the code they test.
5. **Name by meaning.** A number carries its unit (`timeoutMs`, `priceSatang`). A boolean starts with `is`, `has`, `should` or `can`, never a negative like `isNotReady`. Avoid `data`, `info`, `manager`, `helper`, `util` and `temp`.
6. **Shape each function.** One level of detail per function. At most 3 parameters; beyond that, pass an object with named fields. No boolean parameter (`render(true)`). Return early instead of nesting `else`. Split a function that indents past 3 levels.
7. **Write comments only for why.** A comment that says what the code does means the name is wrong: rename, then delete the comment. Keep a comment only for an outside constraint, an odd but deliberate decision, a business rule with its source clause, or a `TODO(owner)` with a condition.

## Check before done

- Every rung of the ladder was considered, and nothing was added that the user did not ask for.
- Non-trivial logic (a branch, loop, parser, money or security path) has one runnable check.
- **Never be lazy about** input validation at trust boundaries, error handling that prevents data loss, security, or anything the user explicitly asked for. If the user insists on the full version, build it.
- Before a shared change, find every caller and run one real check on the riskiest one. Never answer "it probably affects nothing."
- Code-gardener writes its findings to `docs/GARDEN.md` and does not delete code itself.
- A rename never lands in the same commit as a logic change.

## References

- [`references/structure.md`](references/structure.md) — where code, config, constants and tests live
- [`references/examples.md`](references/examples.md) — shortcut marks and the 3 intensity levels (lite · full · ultra) on one request
- [`references/readable-code/examples.md`](references/readable-code/examples.md) — name, comment and folder-layout examples
- [`assets/naming-reference.md`](assets/naming-reference.md) — function-name prefixes, forbidden-word replacements and the 12-item checklist

Pairs with: `ground-rules/simplify` · `project-bootstrap` · `git-and-review` (a lazy diff still gets reviewed)


## reference: blast-radius.md

<!-- merged from skill `blast-radius` on 2026-11-27 · description was: Use when a small change touches shared code -->
# blast radius — a tiny edit, what does it affect

> Never answer "it probably affects nothing." Find every place, then run something real to prove the riskiest spot.

## Steps

1. **Name what changes**: the symbol name · field · column · class · config value · behavior that differs from before
2. **Find every place this change reaches** with commands that can be rerun, and keep the commands in the report

   | Look for | With |
   |---|---|
   | Direct callers | find references in the IDE or language server · `grep -rn` the full name (limit the output with `head -50`) |
   | Indirect callers | names in strings · reflection · routes · dependency injection (DI) registration · templates · raw SQL |
   | Data already stored | rows in the database · cache · files · queue messages that still have the old shape |
   | Outside the repo | public API · old mobile app versions · scheduled jobs · other systems that read the same table |

3. **Sort into 3 groups:** surely safe (with a 1-line reason) · needs checking · unknown
4. **Prove the most important spot.** Pick the spot where a failure would cost the most, then run something real: a test that covers that path · call the app through a verify skill · query data in a sandbox. "Type check passed" does not count as evidence.
5. **The "unknown" group must not vanish quietly.** Either check it, or write in the report that it is still risky.
6. **After the edit is done, compare the plan with the real diff** (`git diff --stat`). A file touched but not in the step 2 table → go back to step 2 for that file. A spot in the table that was finally not touched → write a 1-line reason, and do not delete the row silently.

## Report

| Spot reached | Group | Evidence |
|---|---|---|

Follow it with the search commands used and the run results from step 4.

## Skip when

Code just written in this task that nobody calls yet


## reference: code-gardener.md

<!-- merged from skill `code-gardener` on 2026-11-27 · description was: Use when patrolling code for duplication or dead code -->
# code-gardener — a gardener who notes first and does not prune yet

## The only file used — `docs/GARDEN.md`

This is a template the agent writes into the user's repo, so its text stays Thai. The column "รูปแบบ" means pattern, and "ทบทวนแล้ว" means reviewed.

```markdown
## บันทึก (ต่อท้ายทุกรอบ ไม่แก้ของเก่า · เกิน 300 แถว ย้ายแถวที่ทบทวนแล้วไป docs/garden-archive.md)
| วันที่ | ไฟล์:บรรทัด | สิ่งที่เห็น | ทำไมน่ากังวล | รูปแบบ |

## ทบทวนแล้ว
| วันที่ | ธีม | จำนวนข้อ | ทำอะไรต่อ | ไฟล์งาน |
```

## Survey round (every day, or after new commits)

1. Read the "ทบทวนแล้ว" (reviewed) section of `docs/GARDEN.md`. A theme already decided does not need noting again.
2. Look only at files changed since the last round (`git log --since`). Look at the whole repo only once a week, and split big jobs with `crew-patterns/parallel-split-and-merge`.
3. Look for: duplicated logic · calls that skip a layer (a screen talking to the database directly) · traps of the framework in use · dead code · names that do not match `readable-code.md` · tests that pass although the code is wrong · anything that conflicts with `docs/AGENT-RULES.md`.
4. **Append to the log table. Never edit code.** In the "รูปแบบ" (pattern) column, put a short, reusable word so grouping is easy.
5. If you find nothing, write nothing.

## Review round (every 2–3 days, or when the log passes 20 rows)

1. Group the unreviewed log entries by "รูปแบบ" (pattern) and root cause.
2. Choose one path for every theme.
   - If it can happen again, use `learn-loop/repeated-mistakes-to-checks` to turn it into a guard in the code: structure · type or lint.
   - If something that exists must be reorganised, use the `refactor` playbook of [`superuser`](../../superuser/SKILL.md).
   - If it is not worth fixing, write the reason.
3. **Choose the themes to fix by numbers.** Use the skill `decision-desk/decision-scoring`, command `knapsack`.
   - **Hard rule (not in the table, hand over at once):** a theme that is a vulnerability → `security-gate` · a theme that already makes data or results wrong → the `bug-fix` playbook.
   - Budget = the hours the user set for tidy-up work this round (if not set → ask once, do not guess).
   - A theme's cost = the estimated hours to fix · its value = number of repeats (counted from the log table) × minutes lost each time (estimated, tag it `อนุมาน` if not measured).
   - A theme that falls out of the best set and has a low value per hour = "not worth fixing". Write the reason as numbers in the table. Read the "next best set" line in the result (shown when there are 20 items or fewer). If it is within 10% of the best set (a default, not yet measured), let the user choose.
4. Add rows to the "ทบทวนแล้ว" (reviewed) table, then propose to the user which theme to do first, and start fixing only once the user has chosen.
5. Summarise the result with `superuser/status-report`.

## Set it to run by itself

Set up a scheduled task in the Claude app or Windows Task Scheduler: run `claude -p "ใช้ code-gardener รอบสำรวจ"` every day, and `"... รอบทบทวน"` every Monday and Thursday. If it runs unattended, use a sandbox (`.sandbox/`, see `infra-and-deploy`) in `-Isolated -Locked` mode and allow only the tools this skill uses · for the full steps see [`playbook-unattended-run`](../../superuser/references/playbook-unattended-run.md) · command inside the sandbox (isolated mode only — `sandbox.ps1 claude` refuses mount mode): to run unattended, use `.\.sandbox\sandbox.ps1 exec "claude -p '<command>'"` after logging in inside the sandbox. `exec` uses `compose exec -T`, whereas `sandbox.ps1 claude` can pass arguments on but has no `-T`, so it needs a terminal window, which Task Scheduler does not have (whether to add `-T` to `claude` is รอยืนยัน (awaiting confirmation)) · an unattended round does only the survey round and the review round (writing a log), and never edits code or commits.


## reference: code-orientation.md

<!-- merged from skill `code-orientation` on 2026-11-27 · description was: Use before changing code you have not yet read -->
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
3. **Find the shared points.** Check where else the function or type you will touch is called (`rg -n "ชื่อฟังก์ชัน\("`). If there are several callers, use `blast-radius.md` when you make the change.
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

- Project map: if `docs/FILE-MAP.md` exists, read it first; else generate it with `node plugins/superuser/skills/context-budget/scripts/map-folder.mjs`.


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


## reference: lazy-coding.md

<!-- merged from skill `lazy-coding` on 2026-11-27 · description was: Use when writing or reviewing code, for the simplest that works -->
# lazy-coding — the least code that works, still easy to find and to read

> **One rule:** a tired teammate must understand it in 6 months, with no context. If they can't, simplify until they can. The best code is the code you never had to write.

## Use when

- Writing or reviewing any code. On by default at **full** in every response; switch with `lazy lite | full | ultra`; off only on "stop lazy" / "normal mode".

Not for: names, function shape and file layout → `readable-code.md` (**always load together**: lazy decides how much code, readable-code decides how it looks) · the repo skeleton → `project-bootstrap` · docs, plans, architecture → `superuser:ground-rules`

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
3. **Keep it simple, not scattered.** Lazy cuts how much code exists, never where it lives: one concern per file · feature folders, not type folders (no `utils/`) · names carry meaning · signatures and data shapes between layers written out · config and secrets outside code (but domain constant tables stay in code) · tests beside the code · new project → `project-bootstrap` first. Details and the cold-open test → [`structure.md`](structure.md).
4. **Mark a deliberate shortcut** with a comment naming the ceiling and the upgrade path (`# simple: in-memory dict cache — swap for Redis if we run more than one process`). Examples → [`examples.md`](examples.md).
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

- [`structure.md`](structure.md) — open when deciding where code, config, constants and tests live
- [`examples.md`](examples.md) — open for shortcut-marking examples and the 3 intensity levels answering the same request

Pairs with: `ground-rules/simplify` · `readable-code.md` · `project-bootstrap` · `git-and-review` (a lazy diff still gets reviewed)


## reference: principle-data-shape-first.md

<!-- merged from skill `principle-data-shape-first` on 2026-11-27 · description was: Use when logic crosses functions or modules -->
# principle-data-shape-first — get the data shape first and the code follows

> **One rule:** most messy code comes from the wrong data shape from the start; with the right types and data structure, most `if`s disappear by themselves.

## Use when

- Logic crosses functions or modules
- Starting a feature or new project: the `feature` and `new-project` playbooks write the data shape into the todo before starting

Not for: a one-off script, or a change inside a single function that does not change the data shape · a new table → `database-design` · APIs → `api-design`

## Steps

1. **Before the first line, answer 4 questions** and write the answers as a real type or schema, not in your head:
   - What is the main data of this work, and what fields does it have?
   - How many possible states are there? Use one union or enum instead of several booleans that can contradict each other.
   - Where does data enter from outside the system? Use a single point that parses and validates, then trust the types inside.
   - Who writes this data at the same time? Separate them so they do not share; use a lock or queue only when there truly must be a single writer.
2. **Make an invalid state impossible to create:** `{ status: 'paid', paidAt }`, not `isPaid` + `paidAt?` that can contradict.
3. **Give a value with meaning its own type:** `OrderId`, not a bare `string`. For money use an exact decimal type, never float; in the database `decimal(19,4)` per `stack-sql`; integer satang only in memory or in JSON sent to a payment gateway that asks for it.
4. **Put business rules in the structure:** a map table, state machine or lookup instead of repeating `if (type === ...)` across files.
5. **Validate when data enters** (CLI · config · requests · files · external APIs): convert with a schema on arrival so inner code does not re-check null.
6. **Do not lie to the compiler:** no `any` · `as` · `!` just to make it compile; a `switch` covers every case with an exhaustive check.
7. **Take types from one source:** generate from the database schema or OpenAPI, do not rewrite by hand.
8. **When a new requirement does not fit the old shape,** design the new shape as if you had known from day one; do not bolt on another flag.

## Check before done

- The 4 questions have written answers (type or schema)
- No pair of booleans can contradict each other; no `any` · `as` · `!` added to compile
- Outside data is parsed at a single entry point


## reference: principle-replace-then-delete.md

<!-- merged from skill `principle-replace-then-delete` on 2026-11-27 · description was: Use when replacing an API, table or component -->
# principle · replace then delete — migrate everything, then delete the old thing in the same round

> An old thing "kept for now in case we need it" stays forever, and the next person cannot tell which one to use.

## Steps

1. **Delete before you add.** Remove dead code · duplicate validators · stubs · flags that are now permanently on. Then build on the smaller base.
2. **Count every user of the old thing** with a repeatable command (grep · find references). This number is the evidence.
3. **Build the new thing in the shape it should have.** Do not bend it to look like the old one.
4. **Migrate every user.** If there are more than 10 places, use a codemod (`ground-rules/principle-build-a-tool-not-handwork`).
5. **Delete the old thing in the same PR or batch**, then rerun the command from step 2. It must show 0 places.

## Do not

- A wrapper that calls the new thing through the old name "temporarily"
- A flag that switches between old and new and never gets removed
- Code that supports the halfway state between phases of an already planned migration. Go straight to the end state.

## Exceptions — a real compatibility layer is needed

| Case | Do this |
|---|---|
| A public API that outsiders call | Deprecate per `api-design` and set a removal date |
| A database table that is live | Expand-and-contract per `database-design` |
| Old mobile app versions still in use | Support down to the minimum version that is forced to update |

Record every exception in `decision-desk/decision-log` with the date it will be removed.

Upgrading a whole framework (.NET Framework → .NET 8 · Angular major · Python 2 → 3 · Node LTS) follows the same principle, one package at a time. The playbook per stack is at [`legacy-spec-recovery/references/framework-upgrade.md`](../../legacy-spec-recovery/references/framework-upgrade.md)


## reference: principle-safe-to-rerun.md

<!-- merged from skill `principle-safe-to-rerun` on 2026-11-27 · description was: Use when code may run twice or stop halfway -->
# principle · safe to rerun — the same result however many times it runs

> Something that can run only once will break on the day it runs twice — a retry · someone clicking twice · a machine going down halfway.
> Write it so the final result is the same however many times it runs (idempotent).

## Patterns

| Instead of | Do this |
|---|---|
| A bare `INSERT` | Upsert on a natural key, or add a unique constraint to block duplicates |
| `CREATE TABLE` · `mkdir` | `IF NOT EXISTS` · `mkdir -p` |
| `balance = balance + 100` | Record entries with unique ids, then compute the balance from the entries |
| Receive a webhook and act at once | Store the event ids already handled, and skip a repeat |
| An API that creates things | Accept an `Idempotency-Key` from the client (`api-design`) |
| A script that edits a file | Check first whether it was already edited, and replace the old value instead of appending again |
| Do the whole batch in one go | Do it in chunks and record how far you got, so a rerun continues from that point |

## Trial mode

A script that changes real data has a `--dry-run` that prints what it would change without changing it.

## Prove it

- Run it twice in a row, and compare the result with a single run. The results must match.
- Stop it halfway (kill), then run again. The job must finish completely with no duplicates.
- Add these 2 checks as tests for migrations and for scripts that are reused.

## See also

Use `async-messaging` for background work, and `database-design` for database migrations.

## Not needed when

A read-only command, or a one-off script that is thrown away in `_to_delete/`.


## reference: readable-code.md

<!-- merged from skill `readable-code` on 2026-11-27 · description was: Use when writing or reviewing code for readability -->
# readable-code — names, functions, comments and file layout that people can read

> **One rule:** a name you must open up to understand is a badly chosen name

## Use when

- Writing new code · naming variables, functions, files, or folders
- Reviewing code that feels "correct but hard to read"
- A newcomer joins the project and cannot find files
- The `utils/` folder is starting to become a junk drawer

Not for: writing **less** code → `lazy-coding.md` · repo-level folder structure, README, linter → `project-bootstrap` · correctness, security, testing → `git-and-review` · documentation file names → `workspace-rules/document-naming` · product or brand names → `product-naming`

## Steps

1. **Name it so it answers what it is · what unit · when it can be used.** A number with a unit has the unit in its name, always (`timeoutMs` · `priceSatang` · `Seconds` · `Bytes` · `Percent` · `Ratio`). Examples → [`examples.md`](readable-code/examples.md).
2. **Use one word for one meaning across the whole project.** Function prefixes (10 groups: what each promises, can it fail, side effects; for example `get` never hits the network, `validate` throws, `ensure` can be called repeatedly) are in [`assets/naming-reference.md`](../assets/naming-reference.md) step 2.
3. **Apply the naming rules:**
   - Never name a boolean in the negative (`isNotReady` gives `if (!isNotReady)`). A boolean starts with `is` `has` `should` `can`.
   - A collection is plural and says the type inside (`userIds`, not `users`, if it holds numbers).
   - A function name containing `and` is 2 functions: split it.
   - Constants use upper case only for values truly set once; a value read from config is not a constant.
   - Order function names verb → big context → small context (`getUserMessages` · `shouldDisplayBanner`).
   - Do not repeat context the surrounding name gives (`user.userName` → `user.name`).
4. **Set the name length by distance from declaration to last use.** 5 lines or fewer (a loop counter): 1 character is enough. Within one function: 1–2 words. Whole class or file: 2–3 words. Exported outside the file: full words, no abbreviations.
5. **Do not use `data` `info` `manager` `helper` `util` `do` `temp` or self-invented abbreviations** in names you choose yourself. Replacement words → [`assets/naming-reference.md`](../assets/naming-reference.md) step 4. Exceptions: abbreviations the whole field uses (`id` · `url` · `http` · `db` · `api` · `ui`) and names a platform or framework already set (`SensorManager` · Android `Service` · `ChangeNotifier`).
6. **Shape the function:**
   - One level of abstraction per function.
   - At most 3 parameters; beyond that, take an object with named fields.
   - No boolean parameter (`render(true)` hides what `true` is): split into `renderDraft()` and `renderFinal()`, or take `{ mode: "draft" }`. A named parameter whose call site shows the name (`TextField(obscureText: true)` · `enabled: true`) is fine.
   - Return early rather than nest `else`.
   - If indentation goes past 3 levels, split the function.
7. **Write comments for "why", not "what".** A comment that explains what the code does means the name is wrong: fix the name and delete the comment. Keep a comment only for: an external constraint (API · law · hardware) · a deliberate decision that looks odd · a formula or business rule with its source (cite the clause number) · a `TODO(owner)` with a condition. If you change code, change its comment in the same round.
8. **Before review, sort every comment the diff adds or edits:** delete (translates code · outdated · commented-out code) · rename then delete (explains what a name is) · turn into a type, assert, test or lint then delete (states a constraint; `learn-loop/repeated-mistakes-to-checks`) · keep (the 4 kinds in step 7). If the diff is large, have a mid-level subagent read only and make the list, while the main agent decides. Report counts: deleted · renamed · became checks · kept.
9. **Lay out files by feature, not by file type.** The test: a newcomer gets "the save-invoice button does not work" and must guess the right folder within 30 seconds. Layout example → `examples.md`.
   - A file name is the name of what it mainly exports (`InvoiceRenderer` in `invoice-renderer.ts`); letter case follows the language (Dart/Python snake_case, .NET `InvoiceRenderer.cs`).
   - A test file sits beside the file it tests, except where tooling forces a test folder (Flutter `test/` · .NET `tests/`; table in `project-bootstrap` step 1), where `test/` mirrors `lib/` exactly.
   - No single `utils/` lump: `shared/` is fine only if split by topic. A folder with a single file should not exist yet.
   - An `index` that re-exports a whole folder breaks "go to definition": use it only where truly needed.
10. **Order inside a file:** import → constants → types → what is exported → private helpers. A called function sits below its caller, so it reads top to bottom. A file over about 300 lines is a signal, not a rule.
11. **Language in code:** names of variables, functions, classes, files, folders, tables and columns are always English. Comments may be Thai if the team reads Thai. User-facing text is Thai but not embedded in code (`i18n-and-locale`). Never mix half-words (`checkบัตร`). For a Thai term with no English word, look for the closest English word first (`taxId` · `withholdingTax`); otherwise transliterate in full words and explain it in `DATA-DICTIONARY.md`.

## Check before done

- Use the 12-item checklist in [`assets/naming-reference.md`](../assets/naming-reference.md) step 5; fix any failed item by the matching step above.
- No rename of a whole file in the same commit as a logic change (split the commits).
- No `utils.ts` with unrelated functions · no commented-out code · no `@author` `@version` header · no name by pattern instead of role (`InvoiceFactoryStrategyImpl`) · no change of naming style midway · no name cut short because the line is long (wrap the line).

## References

- [`examples.md`](readable-code/examples.md) — open for name, comment and folder-layout examples, and for related skills
- [`assets/naming-reference.md`](../assets/naming-reference.md) — open for prefix groups, forbidden-word replacements and the 12-item checklist


## reference: structure.md

# Simple is not scattered · lazy-coding

Open when deciding where code, config, constants and tests live. Lazy cuts how much code exists, never where it lives.

- One concern per file: entry point, logic, config and I/O each have their own place.
- Feature folders, not type folders; no `utils/` dumping ground (`readable-code.md`).
- Names carry meaning (not `tmp`, `data`, `handle()`).
- Boundaries stay explicit: signatures, module exports and the data shape between layers are written out.
- Config and secrets outside code: even one environment variable goes in `.env.example`. A project that reads none (an offline mobile app) has no `.env.example`; do not invent one.
- Domain constant tables (thresholds, unit tables, lux ranges) change only with a code release: one named constants file next to the feature, not env vars. "Config outside code" means values that differ per environment or deployment.
- Tests sit next to the code they test; where the toolchain fixes the test folder (Flutter `test/` mirroring `lib/`), follow it.
- New project → `project-bootstrap` first; never scatter files at the root to save a minute.
- Test: can a tired teammate opening the repo cold guess which file holds a behaviour in 30 seconds? If not, the structure is missing, not too complex.


---

# skill: test-automation

Use for automated, end-to-end or load tests and app verifiers

# test-automation — tests the team trusts, load tests with permission, and an app the agent can run

> **One rule:** a test is only worth keeping when people trust its result, and no load test or real-app run may touch a system, database or payment that you are not allowed to use.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Which commit broke the tests?", "the suite was green last week" | [`scripts/culprit.mjs`](scripts/culprit.mjs) `--good <commit> --test "<cmd>"` · finds the first bad commit in a temporary worktree and names its card · "two agents ran heavy tests and the machine froze" → wrap heavy runs in [`scripts/test-lock.mjs`](scripts/test-lock.mjs) `-- <cmd>` (one at a time per machine) |
| "Set up tests", "tests are flaky", "what should a good test look like?" | [`references/testing-standards.md`](references/testing-standards.md) |
| "Write end-to-end tests", "the browser test keeps failing" | [`references/e2e-testing-patterns.md`](references/e2e-testing-patterns.md) |
| "How many users can it hold?", "will it be slow at peak?" | [`references/load-testing.md`](references/load-testing.md) |
| "Let the agent run the app and check", no script to start the app, or the verifier is out of date | [`references/app-verifier-setup.md`](references/app-verifier-setup.md) |

Other references in this folder: [`flaky-tests.md`](references/flaky-tests.md) · [`page-object-model.md`](references/page-object-model.md) · [`test-data-strategies.md`](references/test-data-strategies.md) · [`per-stack.md`](references/per-stack.md) · [`ci-and-parallel.md`](references/ci-and-parallel.md) · [`reading-results.md`](references/reading-results.md).

## Steps every part shares

1. **Write the expected result before the run.** For a load test, the pass threshold is written into the script first. For a functional test, the expected value is written in the test, not read off the current output.
2. **Keep tests deterministic.** Use fixed data, a fixed clock, and no real outside service. A test that flips between red and green gets fixed or removed, never silently skipped.
3. **Prove the test can fail.** Break the feature once on purpose and confirm the test goes red. A test that cannot fail gives no evidence.
4. **Run the check the same way in CI and on your machine.** Pin the tool version. Do not use `latest`.

## Test mode for cards

Pick once per project and write it in `CLAUDE.md`. The default is `gate`, because the full suite on every card is the slowest path and parallel full runs can run the machine out of memory.

| Mode | Card `done_when` runs | Full suite runs |
|---|---|---|
| `every` | the full suite | on every card |
| `targeted` | only the tests of the card's files | at the milestone gate card |
| `gate` (default) | the card's own tests | once, on a gate card that `depends` on every card of the milestone |

Wrap full-suite and load-test commands in `scripts/test-lock.mjs --` so 2 lanes never run them at once. When the gate card fails, `scripts/culprit.mjs` finds the card that broke it.

## Check before done

- Never load test a system that is not ours (a partner API, a payment gateway, a competitor's site). Use a mock or a sandbox instead.
- Never run a load test beyond smoke, or any load test on production, without a named approver, a time window, a peak volume, and a person who can stop it at once.
- Load test data holds no real customer names, phone numbers or orders (`pdpa-compliance`). A load run must not send real money, email, SMS or orders.
- An app-verifier script never touches the real database, never calls a paid external API, never sends a real message, and never solves a CAPTCHA. Test accounts go in a test-data file, never real passwords.
- The verifier script never passes empty: if the feature name is missing, or the app does not start, it exits with an error.
- If the app is broken, file a bug with `qa-docs`. Never edit a verify step just to make it pass.

## References

- [`assets/k6-smoke.yml`](assets/k6-smoke.yml) and [`assets/load-test.js`](assets/load-test.js) — load test starter and CI smoke workflow
- [`scripts/with_server.py`](scripts/with_server.py) — starts a web server, waits for its port, runs the script, then stops the server
- [`references/sources.md`](references/sources.md) — where the tool facts came from (checked 2026-10-28)


## reference: android-native.md

# Driving a native Android / Flutter app on an emulator

> Summarized from a real app, `Lumio - Light Meter` (Flutter · Android). The script that ran and passed is `lumio-light-meter/test/e2e/verify.mjs`.
> Values marked "measured" come from an emulator on Windows using software GPU rendering. Other machines may be faster.

## Choose how to drive

| Method | Strength | Limit | Use when |
|---|---|---|---|
| Node/Python calling `adb` + `uiautomator dump` | Nothing extra to install · can drive the virtual sensor and camera · can check `dumpsys` | Reading the screen takes 3–4 seconds each time (measured) | Default · tests the whole path hardware → native → Dart → screen |
| Flutter `integration_test` (`flutter test integration_test/`) | Finds widgets directly with `find` · fast | Cannot feed real sensor values, so it needs a fake data source · cannot check system state (was the camera released?) | Long screen sequences that do not touch hardware |
| Maestro | Flows written in readable YAML | Needs an extra install · not yet tested in this setup | The team already uses Maestro |

## Script structure (verify.mjs style)

1. **Check before starting** that a device is connected (`adb devices`) and the APK exists (`build/app/outputs/flutter-apk/app-debug.apk`). If either is missing, exit 1 and print the command to run.
2. **Install** with `adb install -r <apk>`, then **start clean for every feature**: `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → wait for the text on the first screen.
3. **Read the screen**: `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → pull `text` and `content-desc` with the center point from `bounds`.
4. **Tap** with `adb shell input tap x y` · **feed a value** with `adb emu sensor set light <lux>` · **take a screenshot** with `adb exec-out screencap -p > shot.png`.
5. **Result**: `PASS/FAIL` with expected and actual values, and exit 0 only when at least 1 check ran and all checks passed.

## Rules learned from real runs

| Topic | Do this | Because |
|---|---|---|
| Text in Flutter | Add `Semantics(label: ...)` to every value you must check | The label appears as `content-desc` in `uiautomator dump`, so it can be checked, and it also helps screen-reader users. |
| Stale dump file | Delete `/sdcard/ui.xml` before every dump | When a dump fails it does **not overwrite** the old file, so you may read an old screen without knowing. |
| "could not get idle state" | Treat it as an app bug and fix the app | The app redraws constantly (Lumio redrew 5 times per second even when the value did not change). That wastes battery and makes TalkBack repeat itself. Fix it by notifying the UI only when the displayed value really changes (for a jittery sensor: a change over 1 %). For a secondary value that drifts slowly, update about once per second. |
| Moving targets | Tap only when 2 reads in a row give the same position | A dialog shifts up when the keyboard opens. A tap at the old position hits the backdrop and the dialog closes (probably the cause of the 1 remaining flaky (inconsistent) result, but not yet re-checked). |
| Permissions | Run `adb shell pm grant <package> android.permission.CAMERA` before any check that does not test the permission screen | The system permission dialog is not what that check is testing. |
| "Released" check | Check the precondition first (the camera is held) → press Home → poll `dumpsys media.camera` for "Active Camera Clients" every 1 second for up to 20 seconds | The emulator releases the camera in 5–8 seconds (measured). Without the precondition check, the check passes while testing nothing. |
| Git Bash | Call `adb` from Node/Python (`execFile`) or set `MSYS_NO_PATHCONV=1` | Git Bash rewrites `/sdcard/...` into `C:/Program Files/Git/sdcard/...`. |

## Feeding hardware values

| What to feed | On the emulator | Note |
|---|---|---|
| Light sensor | `adb emu sensor set light <lux>`, and the app receives the value through `Sensor.TYPE_LIGHT` (measured) | For other sensors use `adb emu sensor set <name> <value>` (not checked one by one) |
| Camera | The virtual front camera sends an image with ISO and exposure time (measured) | The image is a synthetic scene, so you can only check that "a value comes out", not its accuracy |
| Anything else, or what the emulator cannot do | A fake data source compiled into the debug build only | It must never leak into a release build |

Label every check: `emulator` means the data path is right, and `เครื่องจริง` (real device) means the value is right. If a check needs a real device but has not run there, report "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

## Time and memory

| Step | Measured time | Set a separate timeout |
|---|---|---|
| First Gradle build (downloads NDK · platform) | ~10 minutes | 20 minutes |
| Later Gradle builds | 1–2 minutes | 5 minutes |
| Emulator boot | Several minutes (not timed) | Poll `adb shell getprop sys.boot_completed` = 1 |
| Open the app until the first screen shows | A few seconds | 20 seconds |
| Per check (waiting for a value on screen) | 3–4 seconds per read | 15–20 seconds |

- The emulator and Gradle use a lot of memory. Claude Code once closed a background emulator because memory ran out.
- Run one emulator only, and stop the Gradle daemon after the build (`gradlew --stop` in `android/`).
- If the emulator is closed midway, report "ยังไม่ได้รันซ้ำ" (not yet re-run) with the list of checks that did not run. Never retry silently and report only the later run.
- No Docker: an emulator in Docker needs KVM, which Docker Desktop on Windows does not have, so run it on the host.


## reference: app-verifier-setup.md

<!-- merged from skill `app-verifier-setup` on 2026-11-27 · description was: Use when no scripted way to run the app, or verify is stale -->
# app-verifier-setup — give the agent hands and eyes

**Output:** 2 things, a script that lives with the project's tests, and a skill that is only a short guide for agents.

```
<project>/
├─ <project-name>/test/e2e/verify.*         script that drives the real app and opens and closes it itself (in the code folder, see project-bootstrap)
│                                           the list of features and checks lives only in this file (the feature map)
├─ .claude/skills/verify-<project>/SKILL.md   how to run · how to read results · what not to do (at the root, where Claude Code looks)
└─ _to_delete/verify-runs/                  evidence from each run — the script finds paths from its own location, so it does not depend on the folder it runs from
```

(Codex · Gemini use `.agents/skills/` · `skills/` instead of `.claude/skills/`.) The Flutter Android example (`lumio-light-meter/test/e2e/verify.mjs`, Node driving `adb`) is summarized in [`android-native.md`](android-native.md).

**Keep the steps in the script only.** A separate `.md` list of steps disagrees with the script from the first round, so the skill points to the script.

---

## Steps

1. **Find the existing way to run the app** from the README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android). If one exists, use it and do not build a new one.
2. **Choose how to drive it by app type**

   | Type | Drive with | Read results from |
   |---|---|---|
   | Web | Playwright (if Chromium is already installed, never download it again) | Screenshot · DOM · console · network |
   | Electron · desktop | Playwright `_electron` or Chrome DevTools Protocol (CDP) · on Windows use pywinauto (the latest WinAppDriver release was probably in 2020 and it is not confirmed that Microsoft still maintains it (`รอยืนยัน`, awaiting confirmation)) | Screenshot · log |
   | Command line · TUI | Run the real command with fixed input | stdout · stderr · exit code · created files |
   | API · service | `curl` or the client the repo uses | Status · body · log · values in the test database |
   | Web-based mobile (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | Screenshot · DOM |
   | Native mobile · Flutter (Android) | A Node/Python script calling `adb` + `uiautomator dump` (the Lumio way) · or Flutter `integration_test` · or Maestro · Playwright cannot drive an APK | Image from `adb exec-out screencap -p` · text/Semantics labels from `uiautomator` · `dumpsys` · `logcat` |

   - If the project has `.sandbox/`, drive the browser in the container. The default is headless (no window). To let a person watch, turn on `up -Browser` (see [`infra-and-deploy`](../../infra-and-deploy/SKILL.md) step 5). An Android emulator cannot run in Docker on Windows (it needs KVM), so run the emulator on the host machine and say so in the report.
   - For a page with CAPTCHA, use the provider's test keys or turn it off in the test environment. Never write a script that solves CAPTCHAs.
   - For an app that reads hardware (sensor · camera · GPS), feed values known in advance, through the emulator (`adb emu sensor set light 420`, virtual camera) or a fake data source that can be turned on only in a debug build. Label every check `emulator` or `เครื่องจริง` (real device), because real sensor accuracy cannot be proven on an emulator. If it has not run on a real device, write "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

3. **Write `test/e2e/verify.*`** so it opens the app itself on a port that does not clash (mobile: install the APK and clear app data), seeds test data, and waits until ready **with a time limit** (web: if it is not up in 10 seconds, count it as failed · mobile: set separate times for build · emulator boot · app start · each check, see the reference). Always close the app at the end, and a second run must give the same result (`ground-rules/principle-build-a-tool-not-handwork`).
   - **For a web app or API that needs a server started first**, use [`scripts/with_server.py`](../scripts/with_server.py). It starts the server, waits for the port, runs the script, then shuts everything down. For example `python -I scripts/with_server.py --server "npm run dev" --port 5173 -- node test/e2e/verify.mjs` (start several servers by repeating `--server` and `--port` · logs go to `--log-dir`, default `_to_delete/with-server-logs`, created automatically if missing). For dynamic apps, wait for `networkidle` (Playwright `page.wait_for_load_state("networkidle")`) or `data-ready="true"` before reading the DOM. Never guess with `sleep`.

4. **Keep the feature list as data in the script.** Go through the menu · routes · command list · SRS, and write 1 group per feature with 1 line per check (`what to do → what must be seen`). Cover at least 3 main features and 1 error case per feature. **Every check starts from a clean state**, can run alone or in a different order, and prints `PASS/FAIL` with expected and actual values.
5. **The script must never pass emptily** (pass without really checking anything). If a feature name does not exist, exit 1. If the app does not come up, exit 1. If no check ran, exit 1 (checking 0 items counts as broken, not as a pass).
   - **A check that verifies "stopped/released" must check the precondition first** (for example, the camera is held before pressing Home). Otherwise it passes emptily. Wait for the result by polling until a timeout, not with a guessed `sleep`.
   - **Make sure you read the latest screen**: delete the old result file before each new read, and tap only when the target position has been steady for 2 reads in a row. If the screen cannot be read because the app never stops redrawing, treat it as an app bug, not a script bug.
6. **Prove the script catches wrong behavior** by breaking the app in 1 place temporarily. Run it, it must `FAIL`, and then restore the change.
7. **Prove the skill works in practice** by sending a fresh `qa-tester` agent that has never seen the code. It uses only this skill to test 1 feature from opening the app to taking a screenshot of the result. Wherever it gets stuck, fix the skill at that point.
8. **Keep the evidence in `_to_delete/verify-runs/<time>/`**, both screenshots and test logs, apart from the code (it is temporary, the user can delete it after delivery, and the agent never deletes it).

## Testing contract

verify must depend on things the app provides, not guess from text or CSS: `data-testid` on every control and result · `<html data-ready>` flipping to `"true"` · a reset endpoint enabled only with `ALLOW_TEST_RESET=1` · a clock lock for date rules. Write the contract into the feature map and have the developer follow it from the first feature. Full table: [`testing-contract.md`](testing-contract.md).

## What the SKILL.md of the verify skill must contain

- A description saying to use it when you "must prove a feature works on the real app · reproduce a bug · check before shipping".
- Commands that start with `with_server.py` (if the app needs a server) and the rule to wait for `networkidle` or `data-ready` before reading the DOM.
- Start · stop commands · test data (which file holds the test accounts — **never put real passwords**).
- A link to the feature map.
- Prohibitions: do not touch the real database · do not call external APIs that cost money or send real messages.

**Hard rules (upkeep):** Never edit verify steps just to make them pass. If the app is broken, file a bug with `qa-docs`.
Never drop a feature from the map because it is hard to test. Prepare upkeep fixes as one commit or PR, and commit only when the user says so.

## References

- [`builtin-verify.md`](builtin-verify.md) — Claude Code ships with `/verify`: for a project running on Claude Code, create a skill named `verify` at `.claude/skills/verify/SKILL.md` in that format, instead of `verify-<project>`.
- [`upkeep.md`](upkeep.md) — open when the app has changed so much that the map no longer matches: re-check the verify skill and fix only what is proven (maintain the one file, no second `verify-<project>`).
- [`testing-contract.md`](testing-contract.md) — open at steps 4 and 5, when writing the feature map or telling the developer which hooks to add


## reference: auth-in-e2e.md

# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

Three ways to log in within a test suite, ordered from worst to best, with Playwright code examples

## Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## Better: API login (no UI)
```typescript
// page.request shares its cookie jar with the page's browser context,
// so the Set-Cookie from the login response is already in the browser — no addCookies needed.
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  expect(response.ok()).toBeTruthy();
}

// Or once for the whole run (global setup), saved for every test:
// const ctx = await request.newContext({ baseURL });
// await ctx.post('/api/login', { data: user });
// await ctx.storageState({ path: 'playwright/.auth/user.json' });
```

> **Security:** The saved state file holds a live session (cookies, tokens). Keep it out of git: add `playwright/.auth/` (or your `auth.json`) to `.gitignore`, and use a test account only.


## reference: builtin-verify.md

# The `/verify` bundled with Claude Code — versus our app-verifier

Source: code.claude.com/docs/en/skills (read 2026-10-23) · the version numbers cited come from that page and were not tested on every version

## What Claude Code already has

- 3 bundled skills work together: `/run` opens and drives the app to show that a fix works · `/verify` builds and runs the app to confirm that the changed code does what it should, without falling back on tests or type checks · `/run-skill-generator` teaches the first 2 how to build and open this project
- `/verify` and `/code-review` run only when the user invokes them (since v2.1.215 — before that Claude could invoke them itself)
- `/run-skill-generator` runs from a clean environment, records what really works (install commands · env · launch script), and commits it as a project skill at `.claude/skills/run-<name>/` — run once per project, and again when the build method changes
- `/verify` can record its own recipe: if there is no recipe, it writes what works to `.claude/skills/verify/SKILL.md` at the project root (monorepo: in the package folder that was touched) · **a skill at the root named `verify` replaces the bundled `/verify`**
- A session that starts with a project skill named `verify` or `ground-rules/simplify` (or personal · organization · `.claude/commands/`) → the Claude Code commit command tells it to run before every commit, except when only docs or tests changed · bundled ones · plugin skills · skills from claude.ai do not count
- The whole set can be turned off with `disableBundledSkills` (leaving `/doctor`)

## What `test-automation` adds

| Ours | The bundled one lacks |
|---|---|
| A contract for in-app testing: `data-testid` · `data-ready` · reset endpoint behind a flag · a lockable clock (`clock`) | It drives the app from what it sees and does not force the app to prepare anchors |
| A feature map as data in the script `test/e2e/verify.*` that prints `PASS/FAIL` with expected and actual · 0 items checked = exit 1 | The recipe is in human language in SKILL.md |
| Proof that it catches wrong things (break 1 spot and it must FAIL) and a new `qa-tester` agent can really use it | — |
| Evidence of every run in `_to_delete/verify-runs/` · can drive native mobile · CLI · API, not just web | — |

## Decision

**A project working on a Claude Code that has the bundled `/verify` → `test-automation` creates a project skill at `.claude/skills/verify/SKILL.md` (named `verify`, not `verify-<project>`) in the recipe format that `/verify` records itself** — the first part is the build and open-the-app recipe (the same kind `/run-skill-generator` records), followed by ours: the command that runs `test/e2e/verify.*` · the link to the feature map · the testing contract · the prohibitions (the section "SKILL.md ของ verify skill ต้องมี", meaning "what the verify skill's SKILL.md must contain", in the main SKILL.md) · you get 2 things free: it replaces the bundled one, and it runs automatically before commit

- Before writing, read `.claude/skills/verify/SKILL.md` or `run-<name>/` that `/verify` already recorded (if any), then continue in the same format — the frontmatter fields the bundled one uses have not been checked against the docs (`ยังไม่ได้ตรวจ`, not yet checked)
- monorepo → place it in the package folder that was touched, following the bundled one's rule
- Codex · Gemini or Claude Code before v2.1.145 (`ยังไม่ได้ตรวจ` — not yet checked which version `/verify` started in) → use the old name `verify-<project>` in `.claude/skills/` · `.agents/skills/` · `skills/`
- Upkeep (`upkeep.md`) maintains this one file only and does not create a nested `verify-<project>`


## reference: ci-and-parallel.md

# Parallelization and CI Integration

Parallelism levels, the end-to-end (E2E) run tiers in continuous integration (CI), and the files to keep when a test fails.

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | Low (just enable) |
| Test-level within file | 10x+ | Med (isolation needed) |
| Sharded across CI workers | Nx | Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | High (cost) |

**Requirements for safe parallel:**
- Tests don't share state
- Unique test data per test
- Database/external services support concurrency

**Agree on rules before running many agents or workers at once** (example from an online-shop test job where a reset wipes the data of the whole server, run with 6 agents at once):

| Rule | Prevents |
|---|---|
| Reset once before the combined run starts; no agent resets during the run (set a variable such as `PP_SKIP_RESET=1`), and each agent keeps its results in its own folder | deleting each other's data and result files |
| Tests that buy things use different products, and never one that another test is checking stock on | stock collisions |
| New-account emails include `{run}` (project name + run start time) | a second run getting "อีเมลนี้ถูกใช้แล้ว" ("this email is already used") (one plan had 30 tests that could not be re-run; 0 after the fix) |
| Tests that hit the rate limit use their own account and run last | counters carrying over across tests |
| Tests that use shared central state and cannot be separated → `workers: 1` · `fullyParallel: false` | randomly wrong results |

## CI Integration

### Run E2E tier
```yaml
# Smoke (every pull request (PR), 2 min)
- 5-10 critical tests
- Chromium only → feedback เร็ว
- Fail = block merge

# Full (merge to main + nightly, 30 min)
- All E2E tests
- Chromium (desktop) + WebKit (iPhone viewport)
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P1 + P2 tests (test-case-template scale: P1 = most important)
- Chromium + WebKit + Firefox (ครั้งเดียวก่อน release)
- Must pass before prod deploy
```

### Browser matrix

Do not run all 3 browsers every round → CI time grows ~3x and flaky tests grow with the number of browsers.

| Browser | Covers | When to run |
|---------|----------|-----------|
| Chromium | Chrome · Edge (most users) | every round |
| WebKit | every browser on iPhone/iPad (including Chrome on iOS) | merge to main · nightly · pre-prod |
| Firefox | small share | pre-prod only · can be dropped if the customer does not use it |

Adjust to real users → look at analytics first; if an enterprise customer mandates Firefox, move it up to the nightly round.

Set them up as projects in Playwright and pick with `--project`.

```ts
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit-mobile', use: { ...devices['iPhone 15'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
```

```bash
npx playwright test --project=chromium                          # PR
npx playwright test --project=chromium --project=webkit-mobile  # main · nightly
npx playwright test                                             # pre-prod (ครบ 3)
```

**Tests that should run across browsers** (tag `@cross-browser`) → places that often break differently per browser:
- date/time input
- file upload · clipboard
- date/number formatting with `Intl`
- CSS layout · scroll · sticky
- video/audio autoplay

Pure-logic tests → Chromium alone is enough.

> Playwright's WebKit is not 100% the real Safari → for work where customers use iPhone a lot, try on a real device once more before release.

### Artifacts to capture
- Screenshots on failure
- Video on failure
- Trace files (Playwright)
- Console logs
- Network logs


## reference: coverage-and-libraries.md

# Critical Path Coverage Matrix และ Library Quick Reference

An example user-journey coverage table, and a table comparing commonly used Playwright and Cypress commands

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✓ | P1 |
| Login → main task | ✓ | P1 |
| Add to cart → checkout → success | ✓ | P1 |
| Search → filter → result | ✓ | P2 |
| Settings → save | ✓ | P2 |
| Admin panel CRUD | ✓ | P2 |
| Password reset | ✓ | P3 |
| Profile edit | Sample | P3 |
```

Priority uses the `qa-docs` scale (P1 = most important, P3 = least), the same as the `@P1|@P2|@P3` test tags.

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |


## reference: e2e-testing-patterns.md

<!-- merged from skill `e2e-testing-patterns` on 2026-11-27 · description was: Use when writing end-to-end tests or fixing flaky ones -->
> **In SuperUser:** to have an agent run the app and prove the result itself, use [`app-verifier-setup.md`](app-verifier-setup.md). This skill holds the design principles for the E2E (end-to-end) test suite that verifier calls.

# End-to-End Testing Patterns

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When NOT to use](#when-not-to-use)
- [Read more when](#read-more-when)
- [The Testing Pyramid (Get This Right First)](#the-testing-pyramid-get-this-right-first)
- [Framework Selection](#framework-selection)
- [Test Structure: Page Object Model (POM)](#test-structure-page-object-model-pom)
- [Selectors: Hierarchy of Goodness](#selectors-hierarchy-of-goodness)
- [Test Data Strategy](#test-data-strategy)
- [What to Test E2E (Not Everything!)](#what-to-test-e2e-not-everything)
- [Expected Values and Failing Tests](#expected-values-and-failing-tests)
- [Fighting Flaky Tests](#fighting-flaky-tests)
- [Authentication in E2E](#authentication-in-e2e)
- [Parallelization and CI](#parallelization-and-ci)
- [Anti-patterns](#anti-patterns)
- [Quality Targets (from qa-tester agent)](#quality-targets-from-qa-tester-agent)

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to a continuous integration and continuous delivery (CI/CD) pipeline
- Migrating from one framework to another

## When NOT to use

| Task | Use instead |
|---|---|
| Writing manual test cases (steps, expected result) | `qa-docs` |
| Unit or integration tests, test ratio and scope | `testing-standards.md` |

## Read more when

| File | Open when |
|---|---|
| [references/page-object-model.md](page-object-model.md) | You are setting up a new suite structure, or you find tests that copy the same login steps. It shows code comparing the bad way with the Page Object way. |
| [references/test-data-strategies.md](test-data-strategies.md) | You are choosing how to prepare test data and want the pros and cons of all 4 options with sample code. |
| [references/flaky-tests.md](flaky-tests.md) | Tests pass sometimes and fail sometimes. It shows code comparing a sleep wait with an event-based wait. |
| [references/auth-in-e2e.md](auth-in-e2e.md) | You are planning how to log in within the suite and need the `storageState` code or cookie injection through the API. |
| [references/ci-and-parallel.md](ci-and-parallel.md) | You are setting up parallel runs or splitting E2E run rounds in CI, and need to know which files to keep when a test fails. |
| [references/coverage-and-libraries.md](coverage-and-libraries.md) | You are building the user-path coverage table, or translating commands between Playwright and Cypress. |
| [references/oracle-and-mutation.md](oracle-and-mutation.md) | You have an old system to compare against (differential) · you will compare page structure with the accessibility tree · you want to know whether the suite really catches bugs (mutation) · or you must record and replay network requests to keep them stable. |

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: ~5% of tests (same pyramid as testing-standards)
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: ~20%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: ~75%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> **Anti-pattern: Ice cream cone** (many E2E tests, few unit tests)
> Result: slow CI, flaky tests, slow debugging

## Framework Selection

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** (default recommendation: best developer experience, fast, cross-browser) | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | Developer experience, easy to learn, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

## Test Structure: Page Object Model (POM)

If every test repeats the same `page.fill` and `page.click` calls for one page, move those steps into that page's class and have the tests call its methods instead. Comparison code is in [references/page-object-model.md](page-object-model.md)

> **One Page Object per page or major component.**

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

Good:   Role + accessible name   page.getByRole('button', { name: 'Submit' })
Good:   Test IDs                page.getByTestId('submit-btn')
Medium: Visible text            page.getByText('Submit')
Medium: Label                   page.getByLabel('Email')
Bad:    CSS classes             page.locator('.btn-primary')
Bad:    Tag + index             page.locator('button:nth-child(3)')
Bad:    XPath                   page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

## Test Data Strategy

There are 4 options: shared test DB · per-test setup · API setup with UI verification · database snapshot with rollback.
The recommended one is **Option 3: API setup, UI verification (best)**. Prepare data through the API so it is fast and certain, then test the real UI. A shared test DB makes tests depend on order, makes parallel runs hard and mixes data. The pros and cons of every option are in [references/test-data-strategies.md](test-data-strategies.md)

## What to Test E2E (Not Everything!)

### DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

Make a Critical Path Coverage Matrix that says whether each path is covered yet and how important it is: P1, P2 or P3 (the same scale as `qa-docs` and the tags below · P1 is most important). An example is in [references/coverage-and-libraries.md](coverage-and-libraries.md)

## Expected Values and Failing Tests

For an E2E suite converted from a test plan (`qa-docs`):

- Start each test name with the TC code · tag `@<module>` `@P1|@P2|@P3` · put the expected result and the oracle in an annotation
  `test.info().annotations.push({ type: 'expected', description: '฿760 · [D] BR-03' })`
- Expected values are constants from the plan · never read a value from the screen and assert it back, for example reading the price from the card and comparing it with the total → if both are wrong, the test still passes
- Reset data before every TC (API reset or seed) · lock "today" with `page.clock.setFixedTime()` · `timezoneId` · `locale` in the config
- A TC with **Check when** `หลังรีโหลด` (after reload) → call `page.reload()` and assert again
- Run every browser the plan names · judge pass criteria per browser separately
- When a test fails → never edit the expected value · classify it as `app` / `plan` / `test` per the `qa-tester` agent into `triage.json` · in CI, never retry until green and call it done

## Fighting Flaky Tests

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |
| Click times out "not visible/stable" but the site works | The tab may be in the background (`document.visibilityState === "hidden"`, common with Playwright MCP sharing one browser). Check with `browser_evaluate`, switch to the tab, then click. Do not retry blindly |

Never use `page.waitForTimeout` for a fixed-time wait. Wait for a real event instead, such as the API response. Comparison code is in [references/flaky-tests.md](flaky-tests.md)

### Retry strategy
- **In CI:** retry at most 1 time, **only to collect a trace** (`retries: 1` + `trace: 'on-first-retry'`)
- **Pass on retry = flaky, not a pass** — report it as flaky and fail the run (`failOnFlakyTests: true` in `playwright.config.ts`, Playwright 1.52+) — the same rule as "Expected Values and Failing Tests" above and `testing-standards.md` (flaky test: fix or delete, never retry until green)
- **Track flakiness:** a test that fails > 5% of runs is a candidate for quarantine (pulled out of the blocking run)
- **Quarantine has an expiry date**: tag the test `@flaky` with an issue link and a date (`test('checkout total @flaky', { annotation: { type: 'quarantine', description: 'until 2026-11-15 · issue #123' } }, ...)`), run the `@flaky` set as a separate non-blocking job so the signal is not lost, and have CI fail when today is past the date — the test is then fixed or deleted, never extended twice
- **Don't accept flaky tests:** investigate or delete them. Don't ignore them

## Authentication in E2E

Do not log in through the UI in every test, because it is slow, brittle and repeats code. Log in once and share the state (`storageState`), or better, log in through the API and inject the cookie into the browser context. Code for all three ways is in [references/auth-in-e2e.md](auth-in-e2e.md)

## Parallelization and CI

The requirements for safe parallel runs are in [references/ci-and-parallel.md](ci-and-parallel.md)

Split E2E in CI into 3 rounds. First, smoke on every pull request (PR) on Chromium only; a failure blocks the merge. Second, full on merge into main and every night, on Chromium + WebKit (iPhone screen). Third, pre-prod before deploy, which must pass P1 and P2 on all 3 browsers (adding Firefox). When a test fails, always keep the screenshot · video · trace · console log · network log. The parallel level, the browser table for each round and the details of each round are in [references/ci-and-parallel.md](ci-and-parallel.md)

## Anti-patterns

- **Testing implementation details** — selectors based on internal structure
- **Long monolithic tests** — one test with 50 steps is hard to debug
- **Coupled tests** — Test B depends on Test A having run
- **Hidden state** — tests behave differently depending on order or data
- **Manual cleanup** — relying on people to reset the environment
- **No quarantine** — failing tests get merged anyway because "it's flaky"
- **Mocking everything** — at this layer, use the real integrations, or it's not E2E
- **Expected value read from the page** — the bug becomes the expectation

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

The table comparing common Playwright and Cypress commands (Library Quick Reference) is in [references/coverage-and-libraries.md](coverage-and-libraries.md)


## reference: flaky-tests.md

# Fighting Flaky Tests — examples of waiting the right way

Code comparing a fixed-time wait with an event-based wait. The cause table and the retry strategy are in `SKILL.md`.

## Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```


## reference: load-testing.md

<!-- merged from skill `load-testing` on 2026-11-27 · description was: Use when checking how many users a system holds -->
# load-testing — load tests with a goal, a pass threshold and permission

## Contents

- [Use when](#use-when)
- [Related skills](#related-skills)
- [1 · Goal and pass threshold — write before opening the tool](#1--goal-and-pass-threshold--write-before-opening-the-tool)
- [2 · Permission gate — before every run beyond smoke and every run on production](#2--permission-gate--before-every-run-beyond-smoke-and-every-run-on-production)
- [3 · Choose the tool](#3--choose-the-tool)
- [4 · Test types and the script](#4--test-types-and-the-script)
- [5 · Reading the result](#5--reading-the-result)
- [6 · Run together with monitoring](#6--run-together-with-monitoring)
- [7 · Plug into CI](#7--plug-into-ci)
- [Check before sending](#check-before-sending)
- [References](#references)

Sample script [`assets/load-test.js`](../assets/load-test.js) · sample workflow [`assets/k6-smoke.yml`](../assets/k6-smoke.yml) · tool facts checked 2026-10-28, links in [`sources`](sources.md)

> **One rule:** no pass threshold written before the run = no test result, only a graph · and never load a system that is not ours, or production, without a named person's written approval.

## Use when

- Before launching a system or before a campaign that brings many people at once (sale · registration opening · results announcement)
- Someone asks "ระบบรับได้กี่คน" · "ตอนคนเยอะจะช้าไหม" · "เพิ่มเครื่องแล้วดีขึ้นจริงไหม" (how many users can it hold · will it be slow when busy · did adding machines really help)
- A postmortem says the incident happened because load was never tested (`incidents-and-monitoring` → `references/postmortem-template.md` section 5)
- Setting up a speed smoke test in CI that fails when slower than the threshold
- The user says load test · stress test · spike · soak · k6 · Locust · JMeter · p95 · ยิงโหลด · ทดสอบประสิทธิภาพ

Do not use when: one web page loads slowly in the browser (Lighthouse · Core Web Vitals) → [`web-audit`](../../web-audit/SKILL.md) · the live system is slow right now and you must find where → [`incidents-and-monitoring`](../../incidents-and-monitoring/SKILL.md) first · testing that a button click gives the right result → [`e2e-testing-patterns.md`](e2e-testing-patterns.md)

## Related skills

- `incidents-and-monitoring`: open the system's dashboards next to the k6 results (section 6).
- `cicd-and-release`: section 7 says what runs on every PR and what runs on a schedule.
- `qa-docs`: for a whole-release test plan, put the load test in as one row, with the thresholds from section 1.
- `infra-and-deploy`: if you must add machines or autoscale after the run, run again with the same script and compare with the result before.
- `pdpa-compliance`: if test data contains names or phone numbers, use fake data. Do not pull real customer data in to load the system.

## 1 · Goal and pass threshold — write before opening the tool

Get answers to 4 questions, then note them at the top of the script file or the test plan:

| Item | Example answer | If there is no answer |
|---|---|---|
| Expected volume | Peak hour 50 requests per second on path `/api/orders` | Pull it from the live system's logs or metrics · for a new system, use the owner's estimate and tag it `(รอยืนยัน)` (awaiting confirmation) |
| Paths to load | Browse products 70% · add to cart 20% · pay 10% | Load the 1–3 paths that earn the most money or cost the most first |
| Speed threshold | The `p(95)` of response time is at most how many milliseconds | Default 500 ms for an API. **Default, not measured** (`ค่าตั้งต้น ยังไม่ได้วัด`) · adjust once there is a baseline result |
| Error threshold | `http_req_failed` below what percent | Default 1%. **Default, not measured** (`ค่าตั้งต้น ยังไม่ได้วัด`) |

- Measure with percentiles, not averages: an average hides the minority who wait a long time.
- Turn every threshold into `thresholds` in the script (section 4). Do not keep them in the head of whoever reads the result.
- If there is no volume figure at all, you can run smoke and baseline, but you must not conclude "it can handle it", because you do not know what it is handling it against.

## 2 · Permission gate — before every run beyond smoke and every run on production

Loading a system without permission can really bring it down and may be illegal. So stop here and wait for approval. Do not skip it even if the user is in a hurry.

1. **Whose system is it?** · If it belongs to someone else (a partner's API · payment gateway · external SaaS · a competitor's site) → do not load it · use a mock, or a sandbox the provider opens for load testing, and read their terms first.
2. **Environment** · Run on staging or a separate load-test environment · the k6 docs say a QA environment with machines unequal to production cannot be used to judge load capacity, only for smoke.
3. **Production** · Needs a named approver, a time window, a peak volume, and a watcher who can stop at once · start with a low-volume smoke (the k6 docs treat it as a low-risk practice) · never create real orders, payments, emails or SMS.
4. **Anything that causes side effects when hit** · Take payment and message-sending webhooks off the path, or point them at a mock · for an external provider that charges per call, set a spending cap first.
5. **Record** in the script header or plan: system · environment · peak volume · time window · approver · way to stop

The sample script enforces this gate in code: if `BASE_URL` or `TARGET_ENV` is missing, the script stops · if the type is not smoke, or `TARGET_ENV=production` (smoke included), and `APPROVED_BY` is missing, the script stops too.

## 3 · Choose the tool

| If | Use | Reason |
|---|---|---|
| Starting fresh · HTTP API or web · want the pass threshold to fail CI directly | **k6** (default) | Written in JavaScript · `thresholds` in the script · exits with a non-0 code when a threshold fails · AGPL-3.0 licence |
| Team prefers Python · needs complex step sequences or its own protocol | **Locust** | Test scenarios are plain Python code · can be spread over several machines · runs headless in CI · MIT licence |
| The organisation already has a `.jmx` plan · must load JDBC · JMS · LDAP · FTP · SOAP | **JMeter** | Wide protocol support · has a GUI to record plans · use CLI mode (headless) for real runs |

- Versions seen on 2026-10-28: k6 v2.3.0 (2026-09-21), and the 1.x line still gets a security patch v1.8.2 (2026-10-12) · pin the version in CI, do not use `latest` · `setup-k6-action` without `k6-version` always gets the latest ([README](https://github.com/grafana/setup-k6-action) checked 2026-10-28)
- Grafana Cloud k6 (runs from the cloud · stores results): price and quota `(ยังไม่ได้ตรวจ)` (not yet checked) · start with k6 on a machine or a CI runner, which is free
- The machine that sends the load must not be the same machine as the system under load, or they fight over CPU and the result is skewed.

## 4 · Test types and the script

Order per the k6 docs: **smoke always first** → average-load → other types by risk · use a plain load shape (ramp up · hold · ramp down). Do not run load that goes up and down several times, because the cause is hard to find.

| Type | What it asks | Virtual users (VU) and time, per the k6 docs | When |
|---|---|---|---|
| smoke | Is the script right? Does the system answer when few people use it? | Few · seconds to a few minutes | Before every other type · every PR in CI |
| load (average-load) | Does normal volume pass the threshold? | Equal to production average · 5–60 minutes | Before releasing a version · as the baseline |
| stress | What happens above normal? | Above average · 5–60 minutes | Systems at risk in heavy-use periods |
| spike | Does it survive a sudden rush? | Very high · a few minutes | Before a campaign · flash sale |
| soak | After long use, does memory leak or do connections hang? | Average · several hours | Systems that stay up for long periods |
| breakpoint | Where is the ceiling? | Ramp up until it breaks | Run only a few times, always needs approval per section 2 · the sample script has no such type, write the stages yourself |

The script [`assets/load-test.js`](../assets/load-test.js) picks the type with `TEST_TYPE`. Every type uses the `ramping-arrival-rate` executor (it fixes the number of iterations per unit of time, so when the system slows down it still gets hit at the same rate, and you see the real symptoms) · the core is thresholds:

```javascript
thresholds: {
  http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
  http_req_duration: ['p(95)<500'],              // default, not measured
  'http_req_duration{type:API}': ['p(95)<500'],  // separate threshold by tag
},
```

- `abortOnFail` stops the run when a threshold fails midway, instead of pounding the system to the end · `delayAbortEval` waits to collect samples before judging
- Every number in the script (rate · VU · stages) is a **default, not measured** value. Adjust per section 1.
- Run: `k6 run -e TEST_TYPE=smoke -e TARGET_ENV=staging -e BASE_URL=https://staging.example.com assets/load-test.js > _to_delete/k6.log 2>&1; tail -40 _to_delete/k6.log` (k6 prints a long progress log for as long as the run lasts, so read only the closing summary)

## 5 · Reading the result

Details and worked examples are in [`reading-results`](reading-results.md) · in short:

1. Look at the thresholds lines at the end of the report first (pass/fail), then the exit code: 0 = every threshold passed · a failed threshold usually gives 99
2. Look at `http_req_failed` before `http_req_duration`. If errors spike, the response times you see may be fast only because errors answer fast.
3. Look at the load-sending machine. CPU at full or too few VU = the result shows the limit of the load generator, not the system.
4. Compare with the previous baseline using the same script, same data, same environment · change one thing at a time
5. The report says "which threshold passed or failed, at what volume", not "the system holds 10,000 people", unless you really ran that.

For a multi-stage system (for example listen to audio → chat → speak): load each stage alone first, then the whole path · the bottleneck differs per stage (an example from a teaching job, not a threshold: chat holds 4 · listening holds 32 · speaking holds 2) · whole-system speed equals the weakest stage · a queue does not make it faster, it keeps it from breaking (the extra people get slower answers instead of errors) · set the consumer's prefetch equal to the number of jobs the backend can really do at once (`async-messaging` → `references/rabbitmq-messaging.md` section 4) · if the backend dies mid-run, add a watchdog per section 8 of `async-messaging`

## 6 · Run together with monitoring

The k6 result says it is slow, but not why · during the run, open the dashboards per `incidents-and-monitoring` → `references/observability-basics.md` section 2 (latency · traffic · errors · saturation) for the server, database and queue · note the start and end time of the run so you can match the graphs · common bottlenecks: database connection pool · queries without an index · connections not returned (example in `incidents-and-monitoring` → `references/postmortem-template.md` section 5)

## 7 · Plug into CI

| Run when | Type | Where |
|---|---|---|
| Every PR or every push | smoke · a few minutes | staging or the PR's environment |
| Overnight or on a schedule | load · stress · spike | a separate load-test environment |
| Before a major release | the full set chosen in section 4 · run at least 2 rounds | an environment equal to production |

- The k6 docs warn that load tests take 3–15 minutes or more, so do not put them on the path that deploys automatically, and do not trust pass/fail alone until the process is stable.
- GitHub Actions: `grafana/setup-k6-action@v1.2.2` (set `k6-version`) installs k6, then `grafana/run-k6-action@v1.5.0` runs it (pinned versions, checked 2026-10-28) · full example in [`assets/k6-smoke.yml`](../assets/k6-smoke.yml) · Jenkins or other CI call `k6 run` directly
- Do not wrap `k6 run` in a script that swallows the exit code (for example one with a trailing `echo`) · make `k6 run` the last command, or keep `$?` and `exit` with that value
- `BASE_URL` and tokens come from CI secret variables (`web-service-essentials`), not written into the script

## Check before sending

1. Expected volume, paths, and the p95 and error-rate thresholds exist before the run · guessed values carry the label "ค่าตั้งต้น ยังไม่ได้วัด" (default, not measured)
2. The system is ours · the environment is stated clearly · beyond smoke there is a named approver · production has a watcher and a way to stop
3. No real money, email, SMS or order came from the run
4. Thresholds are in `thresholds` · `abortOnFail` is set on the error rate
5. smoke passed before other types · the load generator is not the same machine as the system
6. The report states results against thresholds and the baseline at the volume really run, and does not conclude beyond what was run
7. CI does not swallow the exit code · secrets come from secret variables · the k6 version is pinned

## References

- [`reading-results.md`](reading-results.md) — open to read a k6 result (section 5)
- [`mcp-k6.md`](mcp-k6.md) — open when using the k6 MCP server
- [`worked-example.md`](worked-example.md) — open for a flash-sale example run through sections 1 to 7
- [`sources.md`](sources.md) — links and check date 2026-10-28 for every tool fact


## reference: mcp-k6.md

# k6 MCP (grafana/mcp-k6)

Extension of `test-automation` · checked 2026-10-28 from https://github.com/grafana/mcp-k6 and https://api.github.com/repos/grafana/mcp-k6/releases · not embedded in the plugin; the user installs it if wanted

## Status

| Topic | What was seen |
|---|---|
| Maintainer | Grafana (repo `grafana/mcp-k6`) |
| Status | The README says it is still experimental |
| Latest version | v0.7.0 on 2026-10-05 |
| License | The repo page is inconsistent: the sidebar says AGPL-3.0 but the README says MIT · open the LICENSE file before using it in customer work |
| Tools | `validate_script` (runs 1 VU for 1 round) · `run_script` (real run, up to 5 minutes) · `list_sections` · `get_documentation` |

## Cautions

- `run_script` sends real requests to the targets in the script · `validate_script` also sends 1 round · the permission gate in `test-automation` → `references/load-testing.md` section 2 applies to calls through MCP too, with no exceptions
- Start with only `get_documentation` and `validate_script` pointed at staging · have the agent call `run_script` only when the user allows it in that round
- HTTP mode has no built-in authentication; use it only in a trusted network · stdio on your own machine is better

## Install (the user does it, pin the version)

Claude Code via Docker (command form per the README):

```bash
claude mcp add --scope=user --transport=stdio k6 -- docker run --rm -i grafana/mcp-k6:<tag ของ v0.7.0>
```

The Docker Hub image tag that matches v0.7.0 `(ยังไม่ได้ตรวจ)` (not yet checked) · the README uses `latest`, but open the tag page and put in a pinnable version instead · other ways: Homebrew (`brew tap grafana/grafana` then `brew install mcp-k6`) or the `.deb` `.rpm` packages from the v0.7.0 release page · running natively also needs k6 on PATH

The k6 docs still mention the command `k6 x mcp`, which pulls the latest version automatically · to pin a version, use the standalone `mcp-k6` as above (from search results citing https://grafana.com/docs/k6/v2.3.x/set-up/configure-ai-assistant/; that page was not opened directly)


## reference: oracle-and-mutation.md

# Oracle, structure comparison and mutation — use when an existing system is available to compare against

Source: lessons from a 6-chapter web-clone course (Week 03 of Teaching_CWN2026), measured on 5 app versions · the numbers are results of that job, used as examples, not as criteria · content specific to the cloned website (flight data, container ports) is not carried over.

## 1 · Use the existing system as the answer key (differential testing)

Run the same scenario on the existing system and on our app, then compare the results field by field, instead of writing expected values by hand.

- The result passes only if every compared field matches (example: count + price + name + time, position by position).
- Fetch expected values from the existing system at run time; do not hard-code numbers in the comparison code, except parameters that come from the task.
- For a scenario the existing system cannot answer itself, an **inferred answer key** (computed by yourself) may be used, but first prove the method on cases that have a real answer key · if the order cannot be trusted, judge by count and data set · say plainly that the criterion is weaker (real round: S2 passed even though it had 10 tickets).
- Report a difference as position, row, field, not just "failed" · in the real round, 4 scenarios had one cause, fixed in one place (310 lines of data, 7 lines of code), going from 4/8 → 8/8.
- Remove what is meant to differ before comparing (banners, brand names, links to other domains, mock-data labels).

### If you must record and replay (record-replay), keep the existing system stable

| Trap | Do |
|---|---|
| The URL does not match the recorded one character for character (`+` vs `%20`) | `routeFromHAR` matches URL + method + body exactly · you need your own route for the cases that do not match |
| Random values in the URL or body | match POST by body and pick stable keys |
| Results differ every round | freeze the clock (`context.clock.setFixedTime`) · turn off telemetry · cut the network with a last-layer abort |
| Counting rows while the filter box is still open | wait for the count to settle before counting |
| Route order | Playwright tries the one registered later first |
| No recording file | never open the real live site instead; stability is lost |

- Check that it is really stable by running 3 rounds and getting the same result.
- Limit: it can answer only what was recorded; for full coverage, record every scenario first.
- The recording file contains cookies and tokens: do not commit it and do not take it off the machine.

## 2 · Compare page structure with the accessibility tree (`ariaSnapshot`)

Pixel comparison is brittle and can mislead (matching white backgrounds). Structure comparison tells you "what is missing" as a list.

1. Capture the page in the same state.
2. Remove what is meant to differ before comparing (banners, links to other domains, brand names, mock-data labels).
3. Normalize names: strip symbols, turn numbers into `#`.
4. Make `role | name` tokens (button, combobox, textbox can count as one control kind).
5. Compute the Jaccard score of the tokens (intersection ÷ union).
6. Check a list of key elements chosen from the existing system (38 items in the real round) · the existing system must pass all of them first, otherwise the list itself is wrong.
7. Total score = average of the two · give the result as a list of what is still missing.

Caution: Thai has no spaces, so splitting by whitespace fails; use `Intl.Segmenter('th')` · half of the score depends on the list you chose yourself.

## 3 · Mutation testing — examine the test suite with deliberate bugs

Plant bugs one at a time in an app that already passes, then see whether the test suite catches them.

**Count "caught" as pass → fail against the baseline, not "at least 1 failure".** If the baseline already has a red test, the latter criterion passes automatically (real round: raw score 10/10 for both suites, but the strict criterion gave acceptance 8/10 and differential 4/10 · the survivors survived because the related test was already red) · make the baseline green first, then the score can be read.

Steps:

1. Copy the base code to `mutants/base` · write `manifest.json` holding the before and after text of every bug (file + line) · change 1 spot per bug, never combined.
2. Run the baseline first and record the set of failing tests.
3. Per bug: create a compose project with a separate name → wait for the health endpoint (loop with a limited count) → run every test suite → always `down -v --remove-orphans` in `finally`.
4. Do not edit tests to point at a new target; wrap them: load `endpoint.cjs` with `node --require` to change only the baseURL · or write an extra runner that calls the same scenarios.
5. Compute both the raw criterion and the pass → fail criterion · record the additionally failing tests one by one.
6. Check the SHA-256 of the test files before and after · generate the report from a script, not by hand.
7. Tell the user the duration in advance (real round: 11 rounds × 2 suites took 46 minutes because Docker is built every round).

Bugs worth having: reversed sorting · turning off filters one at a time · result count short by 1 · load-more ending at 299 · `<` instead of `≤` · time shifted by 1 hour · wrong code.

Observations:
- The surviving bug was `<` instead of `≤`, because the boundary value was not in the test data; a dedicated boundary-value test is needed.
- Different kinds of suites catch different groups of bugs (acceptance catches several data bugs that differential cannot newly catch, while differential tells the wrong row and field) · use them together.
- 80% and 40% are lower bounds; they do not mean that a bug with no newly failing test certainly slipped through.
- The real round has not yet re-run mutation against the version where differential is green, and had only 10 bugs.

## 4 · Reusable runner

- 1 test per item · a fresh context for every test · no retry · no lowering of criteria · never edit a test.
- Keep it inside the scope: a route cancels navigate requests across origins.
- Locators must be specific: in the real round, a test that passed because it saw only 10 rows broke at once when the data was complete and it found 2 rows.
- Set an evidence-mode switch (e.g. `EVIDENCE=1`): normally run fast with many workers and no video; evidence mode lowers workers, raises timeouts and records video.
- A neutral element finder (control/choice) that supports both `select` and a tap menu lets one test suite run against two apps written differently · the projects differ only in `baseURL`.
- A test must not add things it does not delete (creating a new booking on every run = not idempotent).
- A popup that blocks a click needs a step that closes the popup first · look at the screenshot and snapshot of the failed test, not only the error text (real round: "cannot click the button" was really a popup blocking; root cause: a re-render removed the Escape key listener).
- Measuring an empty page and waiting for the timeout at every step took 24 minutes; it should fail fast.


## reference: page-object-model.md

# Page Object Model (POM) — ตัวอย่างโค้ด

An example comparing a test with no abstraction and a test that uses a Page Object · use it when setting up a test suite or reviewing tests that copy the same steps

## Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

## Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> **One Page Object per page or major component.**


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
| Test layers | unit (`test`) is for pure logic, while widget (`testWidgets`) is for screens and is the main middle layer. For on-device E2E, use `integration_test` (`flutter test integration_test/`) or an `adb` script per `app-verifier-setup.md` |
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


## reference: reading-results.md

# Reading k6 results and writing the report

Extension of `test-automation` → `references/load-testing.md` section 5 · k6 facts checked 2026-10-28 from the pages linked at the end of the file · the interpretation is general practice, not yet tested against a real system this round

## 1 · Read in this order

| Order | What to look at | Interpretation |
|---|---|---|
| 1 | exit code | 0 = every threshold passed · not 0 = failed · a failed threshold usually gives 99 |
| 2 | the thresholds line at the end of the report | which thresholds passed, which failed, and the actual values |
| 3 | `http_req_failed` | if errors spike → a fast response time may only be because errors return fast, so do not celebrate the p95 yet |
| 4 | `http_req_duration` p95 and p99 | the range most users experience, and the tail a few users wait through · the average cannot be used to decide |
| 5 | `checks` | whether the answers are correct, not just a status 200 |
| 6 | warnings about not enough VUs, or rounds that did not start | the load generator could not keep up with the set rate; this run shows the limit of the generator, not the system (metric name of the dropped rounds `(ยังไม่ได้ตรวจ)` — not yet checked) |

## 2 · Find where it jams

Look at the system graphs for the same period as the run (`incidents-and-monitoring` → `references/observability-basics.md` section 2):

| Symptom in the graph | Suspect first |
|---|---|
| App CPU full, response time grows with it | Heavy code or too few machines · try adding machines and run again |
| App CPU idle, but response time grows | Waiting on something outside: database connection pool · table locks · an external API |
| Errors start at a certain load and then spike | Hit a ceiling (pool · open files · rate limit) · find the setting at that load |
| soak: memory keeps rising and never drops | Memory leak · connections not returned |
| Response time good at first, then worse as the data grows | Query without an index · table grown from data the run created |

## 3 · Re-run so results are comparable

- Same script, same starting data, same environment · clean up the data the previous run created
- Change one thing at a time (code, or a setting, or machine size) and run against the baseline
- The k6 docs advise running the same way at least 2 rounds before releasing a version, because each round's result varies

## 4 · One-page report format

```markdown
## ผล load test · <ระบบ> · <YYYY-MM-DD>

- environment: <staging-perf> · ผู้อนุมัติ: <ชื่อ> · ช่วงเวลา: <เริ่ม–จบ>
- แบบ: <smoke · load · spike> · ปริมาณสูงสุดที่ยิงจริง: <รอบต่อวินาที>
- k6 รุ่น: <v2.x.y> · exit code: <0 หรือ 99>

| เกณฑ์ | ตั้งไว้ | ได้จริง | ผล |
|---|---|---|---|
| http_req_duration p(95) | < 500 ms | <ค่า> | ผ่าน / ไม่ผ่าน |
| http_req_failed | < 1% | <ค่า> | ผ่าน / ไม่ผ่าน |

คอขวดที่เห็น: <กราฟไหน ที่ปริมาณเท่าไร>
ทำต่อ: <ข้อแก้ 1–3 ข้อ> · ยิงซ้ำหลังแก้: <วันที่>
```

Write results only as actually run · if you only ran 50 rounds per second → never write "can handle 1,000 users at once"

## Sources

- exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/ (checked 2026-10-28)
- thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/ (checked 2026-10-28)
- run at least 2 rounds again https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/ (checked 2026-10-28)


## reference: sources.md

# Sources · load-testing

Checked 2026-10-28 (opened through a web-fetch tool that summarises pages with a small model, so reopen the raw page before locking a value in production)

- thresholds · `abortOnFail` · `delayAbortEval` · per-tag thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/
- names of all 6 executors https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ · options of `ramping-arrival-rate` https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/
- test types and their order https://grafana.com/docs/k6/latest/testing-guides/test-types/
- CI · environment · production https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/
- exit codes 0 and 99 · scripts that swallow the exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/
- GitHub Actions https://github.com/grafana/run-k6-action
- k6 licence https://github.com/grafana/k6 · versions https://api.github.com/repos/grafana/k6/releases
- Locust https://docs.locust.io/en/stable/what-is-locust.html · JMeter https://jmeter.apache.org/ (the home page links to the Apache Software Foundation licence and does not state the latest version)
- Not yet checked (`ยังไม่ได้ตรวจ`): Grafana Cloud k6 price and quota · latest versions of Locust and JMeter


## reference: test-data-strategies.md

# Test Data Strategy — ทางเลือกทั้ง 4 แบบ

The pros and cons of each way to prepare test data, with code examples of the recommended way

## Option 1: Shared test DB (popular, problematic)
```
Wrong: All tests share same data
Wrong: Order-dependent
Wrong: Hard to parallelize
Wrong: Pollution between tests
```

## Option 2: Per-test setup (slow)
```
Right: Clean slate every test
Mixed: Reliable but slow
Good for critical flows
```

## Option 3: API setup, UI verification (best)
```typescript
// Right: Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

## Option 4: Database snapshot + rollback
```
Right: Real production-like data
Right: Fast (uses snapshots)
Mixed: Requires DB tooling
```


## reference: testing-contract.md

# Testing contract · app-verifier-setup

verify must depend on things the app provides, not guess from text or CSS. Write this contract into the feature map in the script, and have the developer follow it from the first feature.

| What the app must have | What it is for | Rule |
|---|---|---|
| `data-testid="<page>-<thing>"` in kebab-case on every button, input, result, and error message | Find elements without tying to text or CSS, so checks do not break when language or design changes | For example `book-submit` · `summary-total` · `book-error` · no duplicates on one page · the full list of testids lives in the feature map |
| `<html data-ready="false">` → `"true"` when the page has finished loading data | Wait on a condition instead of a guessed `sleep` (step 5) | Set `true` after the last batch of data arrives, not when the component mounts |
| A reset endpoint such as `POST /api/test/reset` → clears and re-seeds within 5 seconds | Every check starts from a clean state (step 4) | Exists only when `ALLOW_TEST_RESET=1` is set · if not set, answer 404 · never enable in production |
| Clock lock: reset accepts `{"now":"<ISO + offset>"}` and every rule reads "today" from one module (`clock`) | Test date-dependent rules (expiry · cancel at least 24 hours ahead) with the same result every time | If `now` is not sent, use the start date written in the seed · flag off, use real time · never call `Date.now()` / `DateTime.Now` directly in a rule |

Non-web apps follow the same idea: Flutter → a `Key` / Semantics label with the same name · Android → `resource-id` · command line → a `--now` option or an `APP_NOW` variable · a reset on mobile can be enabled only in a debug build.


## reference: testing-standards.md

<!-- merged from skill `testing-standards` on 2026-11-27 · description was: Use when setting up automated tests or fixing flaky ones -->
# Testing Standards — tests the team trusts: fast, deterministic, tied to behavior

> **One rule:** a test nobody trusts is worse than no test. A test that flips between red and green on its own gets `skip`ped within 2 weeks, and then the whole suite dies with it.

## Use when
- Starting tests in a new project, or adding tests to existing code
- Someone asks for unit tests or to automate the tests
- The existing suite is slow, flips red and green, or nobody maintains it

Not for: browser E2E (Playwright/Cypress) → `e2e-testing-patterns.md` · a real mobile app on an emulator → `app-verifier-setup.md` (`android-native.md`) · business-level test cases before writing → `qa-docs`.

## Steps

### 1 · Use what exists; ask only when a new one must be added
- If the project already has a framework, or the stack ships one with its SDK (Flutter `flutter_test` · Angular CLI), use it. Do not ask; 2 systems in one project is worse than one you do not like.
- If a new test package must be installed, put the question in the single round of questions before starting (use `AskUserQuestion` if available), covering **framework** (options per stack in [`per-stack.md`](per-stack.md)) and **scope now**: unit only · unit + integration (real DB through Testcontainers of the same type as production; in-memory SQLite only when production is SQLite) · full set including E2E (continue to `e2e-testing-patterns.md`).
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

Related: health/ping endpoints → `web-service-essentials` · logs to trace a red test → `errors-and-logs` · reviewing test code → `git-and-review`.

## References
- [`per-stack.md`](per-stack.md) — open for framework options per stack, command details and config files for .NET, Node/TS, Python, Angular, Flutter.


## reference: upkeep.md

# Upkeep — keep the hands and eyes in step with the app

> A verify skill that gives wrong steps is more dangerous than none, because the agent will trust it and report a pass.

Use it when a verify skill built by [`test-automation`](app-verifier-setup.md) no longer matches the app. On Claude Code that file is `.claude/skills/verify/SKILL.md` (see [`builtin-verify.md`](builtin-verify.md)). Maintain that one file and do not create a second `verify-<project>`.

## Steps

1. **List the real features** by pulling from routes · menu · command list · the latest Software Requirements Specification (SRS). Compare against the feature map in the script `<project-name>/test/e2e/verify.*`, and split into 3 groups: matching · missing from the feature map · no longer in the app.
2. **Read the code in parallel.** Send 1 fresh `qa-tester` agent per feature group (at most 5 features each). Each reads only, then reports whether each feature's checks in `verify.*` still match the code, with file and line number, using `crew-patterns/parallel-split-and-merge`.
3. **Drive the real app once.** Use 1 agent to run `verify.*` (the script opens and closes the app itself) for every feature, and record pass or fail · screenshots · the step that failed.
4. **Fix only what is proven.** Every fix needs evidence from step 2 or 3. If a feature fails because the app is really broken, not because the steps are wrong, file it as a bug report (`qa-docs`). Do not edit the steps to make it pass.
5. **Add the features missing from the map** in the existing format, and run each at least once for real before saving.
6. **Bundle the fixes into one set**, prepared as a single commit or a single Pull Request (PR) (commit only when the user says so), and state the count of each group in the message: matching · fixed · added · removed · bugs found.
7. `superuser/status-report` type `ตรวจ` (check).

## What not to do

- Remove a feature from the map because it is hard to test.


## reference: worked-example.md

# Worked example · load-testing

## One worked example

Label `ตัวอย่าง` (example): designed on paper, no real system has been loaded

**Problem:** An online shop will run a flash sale at noon on Friday. It went down before because the connection pool filled up. They want to know whether it survives this time.

| Step | What is done | Section |
|---|---|---|
| Goal | Volume from the previous campaign (รอยืนยัน) · path: browse products → add to cart → pay with a mock · p95 at most 500 ms · errors at most 1% (default, not measured) | 1 |
| Permission | Load staging at production size · payment points at a mock · approver and time window noted in the script header | 2 |
| Run | smoke → load (baseline) → spike | 4 |
| Monitor | Dashboards of connection pool and database CPU during the run | 6 |
| Result | Report which thresholds passed and failed at the volume really run, then add smoke to CI | 5 · 7 |



---

# skill: git-and-review

Use for PR review, PR text, commit messages or git worktrees

# git-and-review — review code, write the PR and commits, and keep branches tidy

> **One rule:** nothing is pushed, merged or opened as a pull request unless the user asks for it, and every branch ends with a clear close or a recorded reason to keep it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| Cards running in parallel need their own folder, port and test database · "merge the lanes one at a time" | [`scripts/lane.mjs`](scripts/lane.mjs) `add <card>` (worktree + `PORT` + `TEST_DB_NAME` in `.env.lane`) · [`scripts/merge-queue.mjs`](scripts/merge-queue.mjs) `<card>... --check "<cmd>"` (merge one, re-check, roll back if it breaks, never pushes) · which cards may run together: `superuser` `card.mjs next --parallel` |
| "Review this PR", "check my code before I submit", "is this diff safe?" | [`references/code-review-checklist.md`](references/code-review-checklist.md) |
| "Write the PR description", "what do I put in the pull request?" | [`references/pr-description-template.md`](references/pr-description-template.md) |
| Commit messages, commitlint, semantic-release, "what format for the commit?" | [`references/commit-message-format.md`](references/commit-message-format.md) |
| 2 or more agents edit one repo, parallel attempts, "merge this branch", "clean up worktrees" | [`references/worktree-and-branch.md`](references/worktree-and-branch.md) |
| Closing a branch: merge, open a PR, keep or discard | [`references/close-branch.md`](references/close-branch.md) |
| Claude Code's own `--worktree` flag or `EnterWorktree` | [`references/claude-code-worktrees.md`](references/claude-code-worktrees.md) |
| A large or unfamiliar change, full checklist | [`references/full-checklist.md`](references/full-checklist.md) |
| PowerShell or bash commands for worktrees and diffs | [`references/shell-commands.md`](references/shell-commands.md) |
| Writing a PR summary that a reader can act on | [`references/writing-tips.md`](references/writing-tips.md) |

## Steps every part shares

1. **Pin the range before you review.** For a branch or PR, find the base with `git merge-base main HEAD`, then review `git diff <base>..<head>`. Write both commit hashes in the report.
2. **Read the intent first.** Read the PR description and the linked ticket, then skim the diff for its overall shape.
3. **Run the code** for anything non-trivial. Do not only read it.
4. **Give each comment a level.** Use `blocking:` for a must-fix before merge, and a lighter label for a suggestion. Each blocking comment says what breaks and gives a concrete fix.
5. **Close the branch on purpose.** Pick one of 4 routes in `close-branch.md`: merge locally, open a PR, keep for now, or discard. The user chooses the route.

## Check before done

- Do not push, rebase, merge, or open a PR on your own. An agent in a worktree commits in its own folder and reports back; the lead merges.
- Never run `git push --force` by itself. Discard a branch or worktree only when the user orders it, and first show how many commits would be lost.
- Never leave a repo mid-merge or mid-rebase. If a merge fails, abort it and report which file conflicted.
- Never commit `.env`, keys or tokens. Copy config files by name into a new worktree, never with `cp -r`.
- Do not flag a problem that existed before the change, something the linter already catches, or a nitpick a senior reviewer would skip.
- High-risk work or a large diff goes to a second, adversarial review (`superuser` `playbook-review`) before merge.

## References

- [`references/worktree-and-branch.md`](references/worktree-and-branch.md) and [`references/close-branch.md`](references/close-branch.md) — the branch lifecycle
- [`references/sources.md`](references/sources.md) — where the worktree and branch rules came from


## reference: claude-code-worktrees.md

# Claude Code built-in worktrees (docs checked 2026-10-23)

| Need | Do | Note |
|---|---|---|
| A separate session from the terminal | `claude --worktree <name>` (or `-w`) | Creates `.claude/worktrees/<name>/` at the root and branch `worktree-<name>` · put `.claude/worktrees/` in `.gitignore` · with no name → it picks one · the repo must already have a commit |
| Have Claude create one mid-session | Say "work in a worktree" → tool `EnterWorktree` · leave with `ExitWorktree` | Entering a path outside `.claude/worktrees/` needs approval each time · while inside a worktree Claude Code **blocks** file edits and git commands that point back to the main checkout |
| Each subagent has its own worktree | Frontmatter `isolation: worktree` or say "use worktrees for your agents" | A temporary worktree · no changes → deleted for you · has changes → stays until swept per `cleanupPeriodDays` |
| Carry `.env` to every worktree Claude creates | A `.worktreeinclude` file at the root (`.gitignore` syntax) | Copies only files that match **and** are gitignored · has no effect on a hand-typed `git worktree add` |
| Branch from pending work, not from the remote's `main` | Settings `"worktree": { "baseRef": "head" }` | The default `"fresh"` = from the default branch on `origin` (fetched for you if older than 24 hours) |
| Leaving the session | Claude checks for pending work → clean and unnamed = deletes the worktree + branch for you · has work = asks keep/delete · come back with `claude --worktree <name> --resume` | `-p` (non-interactive) does not ask → does not delete · you must `git worktree remove` yourself · a worktree Claude locked needs `git worktree unlock` first |
| Not git (SVN · Perforce) or want it placed elsewhere | The `WorktreeCreate` hook reads `name` from stdin and `echo`es a path · paired with `WorktreeRemove` | The hook replaces git entirely → `.worktreeinclude` does not work, copy `.env` in the hook yourself · the hook does not run when Claude types `git worktree add` itself through Bash |

A worktree created by hand with `git worktree add` and one from Claude Code share the `.git` · project-level plugins · permissions where "don't ask again" was pressed (on Windows the permission stays with that worktree) · Windows: deleting a worktree does not delete files outside it — a junction/symlink inside removes only the link


## reference: close-branch.md

# Close a branch — decision table

Moved from `worktree-and-branch.md` section 4 (2026-11-10)

| Route | Choose when | Must be true first | Commands (run from the main checkout unless noted) | Approval |
|---|---|---|---|---|
| **Merge locally** | The project has no PR flow · a single person · small work already reviewed in the diff | Tests pass on the branch · the base branch is correct (ask if unsure) · no unfinished work in the worktree | `git checkout main` → `git pull` → `git merge --no-ff <branch>` → run tests on main → once they pass, go to step 6 · tests break on main → `git merge --abort` (not possible after the commit → `git reset --hard ORIG_HEAD` at once) and keep the worktree | **รออนุมัติ** (awaiting approval) — committing to main and the rule "do not commit to the main branch without asking" |
| **Open a PR** | The team reviews · CI · the repo has a remote | Tests pass · rebased/merged the latest main · commit messages follow `commit-message-format.md` | In the worktree: `git push -u origin <branch>` → `gh pr create --fill` (or the URL that push prints) · write the body per `pr-description-template.md` · **keep the worktree** until the PR is closed, so you can fix comments | **รออนุมัติ** — pushing off the machine |
| **Keep for now** | Waiting for information · waiting for a decision · work stopped midway | Write the path · branch · what is pending in `docs/BUILD-PLAN.md` or a handoff | Do nothing with git · `git worktree lock --reason "<what it waits for>" ../<repo>-<task>` if you fear it will be pruned | Not needed |
| **Discard** | A spike is done · the losing route in a bake-off · the result is not worth it | The user clearly said to discard (offer it as a choice, never as the default) · first show what will be lost: how many commits (`git log main..<branch> --oneline`) · untracked files | `git worktree remove ../<repo>-<task>` (with leftovers it needs `--force` — ask first) → `git branch -D <branch>` | **รออนุมัติ** — deleting work |

- Takeaways from `finishing-a-development-branch` (obra/superpowers · MIT · reworded): tests before the menu · the user chooses the route · "discard" is not in the normal menu · PR and keep = keep the worktree
- `--no-ff` gives main 1 merge commit per task, so the whole task can be undone with `git revert -m 1` · if the team already uses squash or rebase-merge, follow the team (`cicd-and-release`)


## reference: code-review-checklist.md

<!-- merged from skill `code-review-checklist` on 2026-11-27 · description was: Use when reviewing a pull request or your own code -->
# Code Review Checklist — review a pull request or your own code, with actionable comments

> **In SuperUser:** start from the playbook [`review`](../../superuser/references/playbook-review.md), then use this checklist for ordinary reviews. High-risk work or a large diff → `crew-patterns/adversarial-review-panel`.

## Use when
- Reviewing a pull request, self-reviewing before submitting, or auditing an existing module
- Not for: a second look inside a team → a new `reviewer` agent (it applies this checklist) · contested design, large or high-risk diff, "stress test" → `crew-patterns/adversarial-review-panel` · reviewing a visual → `graphic-design:design-review` if installed, else `ui-craft` · writing the PR description → `pr-description-template.md` · hunting misleading patterns across the codebase → `code-craft` · scanners, secrets, dependency check, OWASP Top 10:2025 → `security-gate` (run both before merge; `owasp-top10.md`, `owasp-stack-checks.md`)

## Steps
1. **Understand the intent:** read the PR description and linked ticket. For a branch or PR, pin the range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report.
2. **Skim the diff** for the overall shape.
3. **Review against the checklist.** House checks first; each skill holds the full rules, so link it in the comment:
   - Security: run [`security-gate`](../../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
   - Simple enough: [`code-craft`](../../code-craft/SKILL.md) · readable: [`code-craft`](../../code-craft/SKILL.md) · tests next to the code and proving the change: [`test-automation`](../../test-automation/SKILL.md)
   - Shared code touched → [`code-craft`](../../code-craft/SKILL.md) list is in the PR · commit message follows [`commit-message-format.md`](commit-message-format.md)
   - The generic list (correctness, design, performance, documentation, maintainability): [`full-checklist.md`](full-checklist.md)
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
`/software-development:git-and-review <file path or PR description>` — use a new read-only `reviewer` agent to review **the user's request** (high-stakes or contested → `crew-patterns/adversarial-review-panel`). Open `superuser` with the playbook `review` and copy its steps into the todo first; use both together. The reviewer: reads the file(s) or diff and pins the range (step 1) · applies this skill · rates each finding **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional) · gives a concrete fix for each · outputs verdict **ผ่าน** / **ไม่ผ่าน** with counts per level (not the `blocking:`/`nit:` prefixes).

The author does not fix every finding on sight: a finding can be wrong (misread code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge.

## Check before done
- Every finding has a severity and a concrete fix · every `blocking:` was verified by a second reader
- Both SHAs are in the report · none of the "do not flag" kinds is in the findings

## References
- [`full-checklist.md`](full-checklist.md) — open when the diff needs the generic checks (correctness, design, performance, documentation, maintainability)


## reference: commit-message-format.md

<!-- merged from skill `commit-message-format` on 2026-11-27 · description was: Use when setting up commitlint or semantic-release -->
# Conventional Commit Message Format

> When to commit and logging each step → `workspace-rules/commit-log` (shared skill). This file adds the release side: scope, commitlint, semantic-release.

## When to use this skill

- Writing commits that feed release tooling (commitlint, semantic-release) — everyday commits use `workspace-rules/commit-log`
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
- [ ] Subject is imperative and ≤50 chars — Thai subjects count base consonants only (~50); vowels and tone marks do not count · กติกาเต็มอยู่ใน `superuser` skill `workspace-rules/commit-log`
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable


## reference: full-checklist.md

# Code review — full generic checklist

Moved out of [SKILL.md](code-review-checklist.md). Open it for a large or unfamiliar change. The house-specific checks stay in `code-review-checklist.md`.

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


## reference: pr-description-template.md

<!-- merged from skill `pr-description-template` on 2026-11-27 · description was: Use when writing a pull request description -->
# Pull Request Description Template

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When NOT to use](#when-not-to-use)
- [0 · Look for an existing format first (every time)](#0--look-for-an-existing-format-first-every-time)
- [Output Template](#output-template)
- [Size Guidelines](#size-guidelines)
- [Summary Writing](#summary-writing)
- [References](#references)

ข้อความภาษาไทย → `human-writing` `thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

## When to use this skill

- Opening any pull request
- Updating a PR description after major changes
- Onboarding team to consistent PR practices

## When NOT to use

| Task | Use instead |
|---|---|
| Reviewing someone's PR or self-reviewing the code | `code-review-checklist.md` |
| Adversarial review of a risky or contested change | `crew-patterns/adversarial-review-panel` |

## 0 · Look for an existing format first (every time)

Before using the structure or templates in this file, check whether the user, the client or the project already has its own format:

- **What to look at:** PR templates in the repo: `.github/pull_request_template.md` · `.github/PULL_REQUEST_TEMPLATE/*.md` · `docs/pull_request_template.md` · `PULL_REQUEST_TEMPLATE.md` at the root · and the 3 most recently merged PRs (`gh pr list --state merged -L 3`) to see how the team writes them
- **Result:** if found, use it (headings, order, field names, running numbers) and say in the reply which file the format came from · if not found, use the template in this file as the fallback and say that no existing format was found
- **Every format still needs the content:** parts the team's format lacks but this skill requires (how to test · merge risk) are added at the end of the team's format, without reworking the team's structure

## Output Template

```markdown
## Summary
<2-4 sentence explanation of what this PR does and why>

## Linked Issues
- Closes #XXX
- Refs #YYY

## Changes
- Added: ...
- Changed: ...
- Fixed: ...
- Removed: ...

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that breaks existing behavior)
- [ ] Documentation update
- [ ] Refactor (no functional change)
- [ ] Performance improvement
- [ ] Test additions/updates
- [ ] Build/CI changes

## How to Test
1. Pull this branch
2. Run `<command>`
3. Verify ...
4. Try edge case: ...

## Evidence
<!-- ก่อน/หลัง ที่ reviewer ตรวจเองได้: ผล test ที่รันจริง (ชื่อ test + ผ่าน/ไม่ผ่าน) · ตัวเลขที่วัดได้ · ภาพหน้าจอ — "tested locally" ไม่นับ -->
- Before: ...
- After: ...

## Merge Danger
<!-- one-way door = ย้อนกลับยาก (migration ลบคอลัมน์ · ลบ API · เปลี่ยนรูปแบบข้อมูลที่เก็บแล้ว) ต้องบอกแผนถอยกลับ · two-way door = revert ได้ใน 1 commit -->
<one-way door / two-way door — ถ้า one-way ใส่แผนถอยกลับ>

## Screenshots / Demos
<!-- ใช้ภาพจากข้อมูลจำลอง หรือเบลอข้อมูลลูกค้าจริงก่อนแนบ -->
| Before | After |
|--------|-------|
| <img>  | <img> |

## Checklist
- [ ] My code follows the project style guide
- [ ] I have performed self-review of my code
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] I have updated documentation as needed
- [ ] No new linter warnings
- [ ] No console.log / debug code left
- [ ] Breaking changes are documented

## Breaking Changes
<describe what breaks and migration path, OR write "None">

## Performance Impact
<measurements if applicable, OR write "No significant impact">

## Security Considerations
<note any security implications, OR write "None">

## Deployment Notes
<env var changes (ใส่ชื่อตัวแปรเท่านั้น ห้ามใส่ค่าจริงหรือรหัสลับ), migrations, feature flags needed, OR "Standard deployment">

## Notes for Reviewer
<anything reviewer should pay attention to, gotchas, alternative approaches considered>
```

## Size Guidelines

| Lines changed | Review difficulty | Recommendation |
|--------------|-------------------|----------------|
| < 100 | Easy | ✓ Ideal size |
| 100-400 | Moderate | ✓ Acceptable |
| > 400 | Hard | ✗ Split into stacked PRs |

If your PR is huge, split into:
1. Refactoring PR (no behavior change)
2. Feature PR (small, focused) — with tests that prove the work functions, in the same PR, not a separate test PR

> Pushing a branch or opening a PR is done only when the user asks — you may prepare the PR description in advance, but do not push or open it yourself

## Summary Writing

**Structure:** What changed + Why it matters + Brief how. Bad and good summary examples, screenshot tips and reviewer-friendly tips are in [`writing-tips.md`](writing-tips.md).

## References

- [`writing-tips.md`](writing-tips.md) — open for summary examples, screenshot tips and reviewer-friendly tips


## reference: shell-commands.md

# PowerShell and bash commands

| Need | PowerShell 5.1 (Windows) | bash |
|---|---|---|
| Create a worktree + new branch | `git worktree add ..\shop-api-fix-login -b fix/login main` | `git worktree add ../shop-api-fix-login -b fix/login main` |
| Copy `.env` by name | `Copy-Item ..\shop-api\.env .\.env` | `cp ../shop-api/.env .env` |
| Go in to work | `Set-Location ..\shop-api-fix-login` | `cd ../shop-api-fix-login` |
| Install then measure a baseline (long output → file) | `npm ci > ..\shop-api\_to_delete\install.txt 2>&1; npm test > ..\shop-api\_to_delete\baseline.txt 2>&1; Get-Content ..\shop-api\_to_delete\baseline.txt -Tail 20` | `npm ci > ../shop-api/_to_delete/install.txt 2>&1 && npm test > ../shop-api/_to_delete/baseline.txt 2>&1; tail -20 ../shop-api/_to_delete/baseline.txt` |
| Commits that will go into main | `git log main..HEAD --oneline -n 30` | `git log main..HEAD --oneline -n 30` |
| Files in conflict during merge | `git diff --name-only --diff-filter=U` | `git diff --name-only --diff-filter=U` |
| Is the worktree clean | `git -C ..\shop-api-fix-login status --porcelain -uall` (empty = clean) | `git -C ../shop-api-fix-login status --porcelain -uall` |
| Remove the worktree then prune | `git worktree remove ..\shop-api-fix-login; git worktree prune` | `git worktree remove ../shop-api-fix-login && git worktree prune` |
| Branches already merged | `git branch --merged main` | `git branch --merged main` |
| Turn on long path (Windows only) | `git config core.longpaths true` | — |

PowerShell 5.1 has no `&&` → use `;` or `if ($?) { … }` · paths may use `\` or `/` with git · do not use `2>&1` with native commands in PowerShell unless redirecting to a file (stderr becomes an error record) — the table above writes to files so it works


## reference: sources.md

# Sources · worktree-and-branch

Checked 2026-10-23

| Topic | Source |
|---|---|
| `git worktree add/list/remove/prune/lock/unlock/repair` · one branch per worktree · `remove` needs a clean state · `.git` is a file pointing to `gitdir` | git-scm.com/docs/git-worktree |
| `-d` needs merged · `-D` = `--delete --force` · `--merged` | git-scm.com/docs/git-branch |
| `claude --worktree` · `.claude/worktrees/<name>` · branch `worktree-<name>` · `EnterWorktree`/`ExitWorktree` · `.worktreeinclude` · `worktree.baseRef` · cleanup on exit · blocks commands that point to the main checkout · `isolation: worktree` · Windows junction · sweep `cleanupPeriodDays` | code.claude.com/docs/en/worktrees · code.claude.com/docs/en/common-workflows |
| hook `WorktreeCreate` (reads `name` from stdin · `echo` path) · `WorktreeRemove` · does not run when `git worktree add` is typed by hand | code.claude.com/docs/en/hooks (section WorktreeCreate) · the full input fields of `WorktreeRemove` (`ยังไม่ได้ตรวจ` not yet checked) |
| Place an already-ignored worktree · install dependencies · baseline test before changes | github.com/obra/superpowers → skills/using-git-worktrees (MIT · rewritten · the original recommends `.worktrees/` inside the project — we chose sibling folders per the Claude Code docs "Manage worktrees manually") |
| Test before the menu · merge/PR/keep paths · discard only when ordered · never `--force` by itself | github.com/obra/superpowers → skills/finishing-a-development-branch (MIT · rewritten) |
| Trace intent per hunk · resolve both sides fully · run checks after resolving | mattpocock/skills → skills/engineering/resolving-merge-conflicts (MIT) — the original URL returned 404 on 2026-10-23 · read from a third-party copy (`ยังไม่ได้ตรวจ` original not yet checked) |
| Windows 260 characters · long path off by default · `core.longpaths` | gitforwindows.org FAQ "Git cannot create a file or directory with a long path" |
| PowerShell 5.1 has no `&&` · stderr of native commands | Claude Code's PowerShell tool rules on this machine (checked against the real shell 2026-10-23) |


## reference: worktree-and-branch.md

<!-- merged from skill `worktree-and-branch` on 2026-11-27 · description was: Use when 2+ agents edit one repo or a branch must merge -->
# worktree-and-branch — give each agent its own workspace and close the branch properly

> **One rule:** 1 agent that edits files = 1 worktree = 1 branch. When done, choose how to close the branch with evidence (tests pass on that branch) and clean up. A leftover worktree is a branch nobody is responsible for.

## Use when
- 2 or more agents will edit files in the same repo at the same time (read-only agents need no worktree).
- A spike or refactor may break things in a way that is hard to undo, or an urgent fix is needed while the main checkout has half-finished work (branch from `main`, no stash).
- Comparing 2 approaches (`crew-patterns/parallel-attempts-pick-best`): one worktree per approach. Separate machines or port collisions → add `infra-and-deploy`.
- A branch must be merged, closed, or cleaned up, or conflicts must be resolved.

Not for: a single agent on a small reversible job → a plain branch · read-only work → `Explore` · a repo with no commit yet (make the first commit first). Splitting the work into pieces → `crew-patterns/parallel-split-and-merge` (its step "ห้ามเขียนที่เดียวกัน" points here).

## Steps
1. **Create.** Run `git worktree add ../<repo>-<task> -b <type>/<task> [main]`, then `git worktree list` (must show main + the new one).
   - Place it as a sibling folder, not inside the repo. Exception: an already-gitignored folder such as `.claude/worktrees/`.
   - Branch name `<type>/<task>` per `commit-message-format.md`. One branch can be checked out in only one worktree, so use a new name each time.
   - Windows: path ≤ 260 characters. Keep the folder name short; if `node_modules` is deep, run `git config core.longpaths true` first. Do not place a worktree under OneDrive.
   - A worktree lacks main's untracked files. Copy `.env` and similar config files by name (`cp ../<repo>/.env .env`), never `cp -r` a whole folder (`web-service-essentials`).
   - Install dependencies (`npm ci` / `pip install -r` / `dotnet restore`), then run the tests once before changing anything. If the baseline is broken, report it first and do not mix the fix into the job.
   - Record path · branch · baseline in `docs/BUILD-PLAN.md` or that round's report.
   - Claude Code has built-in worktree commands, and PowerShell has different syntax from bash: see References.
2. **Work only in the worktree.** Do not `cd` back to the main checkout to "just look".
3. **Commit in verifiable steps** on the worktree's branch (`ground-rules/principle-small-verifiable-steps`). A commit on a work branch is **รออนุมัติ** (awaiting approval) unless the user ordered it or wrote permission (`approvals.md` of `superuser`). If not permitted, keep the diff in the worktree and propose it.
4. **Give each parallel group its own files.** Name in the work order the files each group may edit; new files go under the group's folder. Commit a shared contract (for example 1 new field in a central type) before splitting; the side waiting for it writes a fallback. Give each group its own ports and compose project names.
   - An agent must not merge, rebase, or push. It commits in its own folder, then reports: files changed · measured results · what it could not do · any file it edited outside the group (revert before committing, and say so).
   - The lead re-measures every number after merge. The next fix round must not regress (one number may drop, none may get worse). An agent that finishes unusually fast with no answer: read the log and re-issue the order.
5. **Get evidence before closing.** The whole test set passes on this branch · `git status` clean · `git log main..HEAD --oneline -n 30` shows the commits that will go in · if there is a screen, images from `test-automation`. Record commands and results in `docs/BUILD-PLAN.md` (`ground-rules/principle-prove-it-works`).
6. **If main moved**, `git fetch`, then `git rebase origin/main` (branch not pushed, one person using it) or `git merge origin/main` (already pushed or shared). Re-test after combining. On conflict, go to step 8.
7. **Close the branch.** Tests pass first, then let the user choose 1 of 4 routes: merge locally · open a PR · keep for now · discard. Merge, push, and discard wait for **รออนุมัติ**. PR and keep leave the worktree in place. Open [`close-branch.md`](close-branch.md) before every close for the full table.
8. **Resolve conflicts.**
   - Run `git status` first; list conflicting files with `git diff --name-only --diff-filter=U`; note whether a merge or rebase is in progress. Do not `git add` everything at once.
   - Per file, read what our side did (`git log --oneline -n 30 main..HEAD -- <file>`) and what theirs did (`git log --oneline -n 30 HEAD..main -- <file>`): the intent of each commit, not just the differing lines.
   - Resolve hunk by hunk and keep both intents (usually both are needed). If they truly conflict, choose by this job's goal and note the reason in the commit. **Never** `git checkout --ours` / `--theirs` on a whole file: it silently deletes someone else's work.
   - Generated files (lock file · snapshot · build output): regenerate from the command, do not edit by hand.
   - Run the whole test set after combining, then `git add <file>` → `git merge --continue` or `git rebase --continue`. Tests not run = not fixed.
   - If you cannot resolve it this round, run `git merge --abort` / `git rebase --abort`, then report which file conflicted and why. Never leave the repo mid-merge.
9. **Clean up, with evidence before deleting.**
   ```bash
   git worktree list
   git -C ../<repo>-<task> status --porcelain -uall   # empty = clean · not empty = ask the user first
   git worktree remove ../<repo>-<task>               # clean only · leftovers need --force (ask)
   git worktree prune
   git branch -d <branch>                             # -d refuses if not merged · -D needs approval
   ```
   - Delete a branch when its PR is merged (`gh pr list --head <branch> --state merged`). In a repo with no PRs, `git branch --merged main` may be used only for a branch that has its own commits and is known to be finished. `-D` is for the approved "discard" route only.
   - **After merge, delete at once without asking:** PR merged · `status --porcelain -uall` empty · not locked → `git worktree remove`, then `git branch -d`, even when it belongs to another session or AI. A branch just created with no commits also shows in `--merged`, so `--merged` alone cannot decide. If `-d` refuses, stop; do not use `-D`. Check at the start and end of every job. Not merged, or leftover files → do not touch.
   - A worktree Claude Code locked needs `git worktree unlock` first. A lock a person set (`--reason`) is not touched; ask the owner.
   - At the end of the day or of a playbook, `git worktree list` must show only worktrees with a reason in the record (the `housekeeping` playbook of `superuser` calls this step).

## Check before done
- [ ] `git worktree list` matches the record: every worktree has an owner and a reason.
- [ ] The worktree is a sibling folder or an ignored `.claude/worktrees/`; no worktree files show as untracked in main.
- [ ] `.env` and config files were copied by name; no secrets in a commit (`security-gate`).
- [ ] Baseline tests before the change and the whole test set after it, results recorded and dated.
- [ ] The close route was chosen from the table; merge · push · discard are not done until the user answers.
- [ ] Every conflicting file was resolved knowing both sides, tests ran after combining, and no whole-file `--ours`/`--theirs`.
- [ ] After merge: worktree removed · `git worktree prune` · branch deleted with `-d`.
- [ ] Windows: the longest worktree path < 260, or `core.longpaths` is on.

## References
- [`close-branch.md`](close-branch.md) — open before every close: the 4 routes, what must be true first, commands, approval.
- [`claude-code-worktrees.md`](claude-code-worktrees.md) — open when using `claude --worktree`, `EnterWorktree`, `isolation: worktree`, `.worktreeinclude`, or the `WorktreeCreate` hook.
- [`shell-commands.md`](shell-commands.md) — open when on Windows PowerShell 5.1 (no `&&`, stderr rules) or when you want a side-by-side command table.
- [`sources.md`](sources.md) — sources and check dates.


## reference: writing-tips.md

# Writing tips · pr-description-template

## Summary Writing

Bad summaries:
- "Fixes bug"
- "Updates code"
- "See ticket"

Good summaries:
- "Prevents double-charging customers when payment provider times out, by adding idempotency key to charge API calls"
- "Adds email verification step during signup to reduce spam accounts; sends 6-digit code via existing email service"

**Structure:** What changed + Why it matters + Brief how

## Screenshots Best Practices

- Always for UI changes
- Show before AND after side-by-side
- Highlight the actual change with arrows/circles
- Include mobile view if responsive
- Use GIFs for interactions (max 30 sec)

## Reviewer-Friendly Tips

- Tag specific people for areas they know
- Mention if breaking change requires coordination
- Note non-obvious decisions in code comments
- Reply to your own PR with "Self-review notes" for tricky parts
- Mark draft PRs as Draft until ready
