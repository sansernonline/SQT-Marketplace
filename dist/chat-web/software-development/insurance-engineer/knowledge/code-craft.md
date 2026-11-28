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
2. Look only at files changed since the last round (`git log --since`). Look at the whole repo only once a week, and split big jobs with `handoff/parallel-split-and-merge`.
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
