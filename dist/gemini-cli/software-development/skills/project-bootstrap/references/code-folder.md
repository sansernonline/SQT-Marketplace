# Code folder layout — full tree

The rules are in `SKILL.md` item 1. The root tree is in `project-doc-set` item 1. ADRs (architecture decision records) and runbooks live in `docs/` at the root, not here.

```
<project-name>/          ← lowercase project name, words joined by `-`
  README.md              ← item 2 · broad outline + survey the project before choosing sections
  CHANGELOG.md           ← what changed in each version
  ARCHITECTURE.md        ← code map · add it when the README tree passes 15 lines or the system has many parts (references/readme-skeleton.md)
  CONTRIBUTING.md        ← add it when the contributing section in the README passes 5 lines
  LICENSE                ← public repo, or the contract requires it
  .env.example           ← every required value (see config-and-secrets) · only when the project really reads environment variables
  .editorconfig          ← item 4
  .gitattributes
  .gitignore             ← build output · secrets · `_to_delete/`
  src/                   ← the real code (or the layout the stack expects, per `SKILL.md` item 1)
  tests/                 ← required in .NET · Flutter (`test/`) · Node and Python keep only integration and e2e here (unit tests sit beside the code files) — the stack table is at the end of this file
  scripts/               ← setup, seed, migrate — scripts a person has to run
```

## Exceptions by stack

**Exceptions by stack.** The code folder name, the test folder and the file names in the repo follow what the language's tools expect.
Do not force `src/`. Test files normally sit beside the code files. Use a separate test folder only for stacks whose tools require one (the cells marked **required**):

| Stack | Code | Tests | File names |
|---|---|---|---|
| Node | `src/` | Unit tests beside the code files (`*.test.ts`) · integration and e2e in `tests/` | `kebab-case` |
| .NET | `src/` | `tests/` **required** (a separate test `.csproj` project) | `PascalCase.cs` |
| Python | `src/<package>/` | Unit tests beside the code files (`test_*.py`) · integration and e2e in `tests/` | `snake_case.py` |
| Dart / Flutter | `lib/` | `test/` · `integration_test/` **required** (same layout as `lib/`) | `snake_case.dart` (lint `file_names`) · `android/` `ios/` stay in the repo |

When another skill writes `tests/` or `test/`, read it as "the test folder of that stack". Pick one name and use it across the whole repo.
