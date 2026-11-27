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
