---
name: project-bootstrap
description: Use when starting a repository or setting up a new machine
---

# Project bootstrap

> **The one rule:** someone who has never seen this project must be able to run it within **30 minutes**,
> reading only `README.md` and asking nobody.

## When to use this skill

Starting a new repository · a newcomer needs half a day before the project runs · a pull request shows a whole-file diff because formatters disagree · nobody knows where the documents are

Not for: build and deploy pipeline → `cicd-and-release` · per-environment settings and secrets → `config-and-secrets` · choosing an architecture → `architecture-patterns` · test framework → `testing-standards` · naming documents → `workspace-rules/document-naming`

---

## 1 · Folder layout

**The root (the folder the user opens) follows `project-doc-set` item 1, layout B.** The root tree, the ecosystem layout and the SuperUser file locations (`.claude/superuser/`) are defined there and only there. Code lives in `<project-name>/`. Its inner layout is:

Inside `<project-name>/` (lowercase project name, words joined by `-`): `README.md` (item 2) · `CHANGELOG.md` · `ARCHITECTURE.md` · `CONTRIBUTING.md` · `LICENSE` (these 3 only when the conditions in `references/readme-skeleton.md` section 2 apply) · `.env.example` (only when the project really reads environment variables · `config-and-secrets`) · `.editorconfig` · `.gitattributes` · `.gitignore` (build output · secrets · `_to_delete/`) · `src/` (unit tests sit beside the code files · `readable-code` item 7) · `tests/` (integration · e2e only, or stacks whose tools require it, see "Exceptions by stack" below) · `scripts/` (setup · seed · migrate). The annotated tree is in [`references/code-folder.md`](references/code-folder.md). ADRs (architecture decision records) and runbooks live in `docs/` at the root, not in the code folder (`project-doc-set` item 1).

**Extensions and sub-programs go in `extension/`.** When the app ships add-ons or small companion programs that belong to it (a browser extension · an IDE or app plugin · a hook client or CLI · an SDK · a tray helper · a worker that cannot run alone), put each one in `<project-name>/extension/<name>/`, named lowercase with `-` (`extension/chrome/` · `extension/hook-client/` · `extension/sdk-python/`). The folder is always named `extension/` (never `plugins/` `addons/` `packages/` `tools/`), so whoever opens the repo sees the main app first and every add-on in one place. Each `extension/<name>/` has its own README (what it extends · how to build and run · how it talks to the main app) and its own build and tests in its own stack's layout; CI builds and tests every one, and a workspace tool (pnpm · npm · Cargo · .NET solution) lists `extension/*`. The main app's code stays in `src/` (or the stack's folder). Create `extension/` when the first add-on is written, not in advance. An add-on that grows its own doc set (SRS · mockup · its own release cycle) is a sub-project: move it to `ecosystem/` per `project-doc-set` item 1.

**Code folder name.** Take the project folder name, lowercase it, and turn each run of spaces and punctuation into a single `-`:
`Lumio - Light Meter/` → `lumio-light-meter/`
Run every build, test and run command from inside this folder. In languages that force a package-name format (Dart `name:` in pubspec · Python package), keep naming the package by the language's rules, because this rule governs only the folder name.

**Root rules (the top level of the project folder):**
- Hold only what is in the `project-doc-set` item 1 layout. Exceptions are declared in the project's README. README, CHANGELOG and config files live in the repo. Received `.docx`/`.xlsx` files go in `ref/`. Ones we write go in `docs/`.
- **Temporary files never live at the root.** If a temp file an agent created lands at the root, move it into `_to_delete/` at once.
- If a build leaves a stray folder at the root (such as an empty `build/` or `lib/` after moving the code), a tool cache still remembers the old path. Clear the cache (`flutter clean` · delete `obj/`) and build again.
- Folder and file names in the repo are lowercase with hyphens and no spaces. **The exception is a language with its own convention.** Follow that language.

**Exceptions by stack.** The code folder name, the test folder and the file names follow what the language's tools expect. Do not force `src/`. Test files normally sit beside the code files; use a separate test folder only for stacks whose tools require one (.NET: `tests/` with a separate test `.csproj` · Dart / Flutter: `lib/`, `test/` and `integration_test/` required). The full per-stack table is in [`references/code-folder.md`](references/code-folder.md). When another skill writes `tests/` or `test/`, read it as "the test folder of that stack". Pick one name and use it across the whole repo.

**Layout A** (use only when the user asks · this item owns the layout). Add `<project-name>/docs/` inside the code folder, as plain markdown. The inner layout matches the `docs/` of layout B (`README.md` index · `decisions/ADR-NNNN-<slug>.md` · `runbook-<topic>.md` · `research/`). It has no `.docx` or PNG deliverables. The rest of the root still follows the `project-doc-set` item 1 layout, without a `docs/` at the root.

**`docs/README.md` is an index, not content:**

Template → `assets/starter-files.md` (columns: document · read when · owner · last updated)

---

## 2 · README — broad outline, then survey the project before choosing sections

READMEs differ from job to job. A web app · library · CLI (Command-Line Interface) · mobile app · monorepo · infra or script project needs different sections and commands. So work in 3 layers:

**Layer 1 · Broad outline (fixed).** The README must answer these questions for a newcomer, in the order they need them:
What is this and who uses it → what must be on the machine → install and run → configure → common commands (test) → project structure → architecture → build → deploy → troubleshooting → contributing → contact → license
Drop any question the project has nothing for. The exception is "configure", which must say there are no external settings.

**Layer 2 · Survey before writing (every time).** Record the results in `_to_delete/readme-survey.md` and use them to decide layer 3.
1. **Read the project:** package manifest files (`package.json` · `*.csproj` · `pyproject.toml` · `pubspec.yaml` and so on) · version-pin files · `Dockerfile` / `compose` · CI (Continuous Integration) files · `Makefile` / scripts · `.env.example` · top-level folders → this gives the project type, stack, the commands that really exist and the system's components (`code-orientation` if the code is large).
2. **Search the official documentation for that stack** (`research-with-sources`): install, run, test and build commands, and which files to commit, for the version the project uses. Never put commands from memory or from the fallback table into the README without checking them.
3. **Look at 2–3 READMEs of well-known projects of the same type** (search by project type + stack) to see which extra sections readers in that field expect. For example, a library has code samples and a table of supported versions · a CLI has command options · infra has what to prepare in the cloud account · a mobile app has flavors and how to sign the app.
4. If search is impossible (no internet), use the layer 3 fallback tables and mark each unchecked command `(รอยืนยัน)` (awaiting confirmation).

**Layer 3 · Choose sections and commands.** Arrange the sections from layer 1 plus the extra sections found in step 3. Take commands from steps 1–2. The full table (what each section answers · how long it should be · where to move it when too long) is in [`references/readme-skeleton.md`](references/readme-skeleton.md). It is a fallback and a length guide, not a list that must be complete.

- **The README holds only what a newcomer uses in the first 30 minutes.** Move anything longer to `ARCHITECTURE.md` · `CONTRIBUTING.md` · `docs/runbook-deploy.md` and link back (see the "split into other files" table and the `ARCHITECTURE.md` template in the same file).
- **Fallback tables by language** (Node · .NET · Python · Java · Go · Flutter · Rust · Laravel) → [`references/readme-by-stack.md`](references/readme-by-stack.md). Use them as the starting point for the layer 2 step 2 search. For a stack not in the tables, search the official documentation directly.
- Copy-ready templates (Node · Flutter / Android) → `assets/starter-files.md`. An app with no DB or Docker must still list everything needed on the machine.

> **Every command must have been run on a clean machine.** Most READMEs are wrong because the author
> already has everything on their own machine and cannot see the missing steps.
>
> **1 install command, 1 run command.** If there are 12 steps, write them as `scripts/setup.sh`.

---

## 3 · CHANGELOG

Use the Keep a Changelog 1.1.0 format. Order the headings in each version as follows and drop headings with no items: **เปลี่ยนที่ทำให้ของเดิมพัง** (breaking changes; our own addition, always on top) · เพิ่ม · เปลี่ยน · จะเลิกใช้ · เอาออก · แก้ · ความปลอดภัย. Keep `[ยังไม่ปล่อย]` (unreleased) at the top at all times. Put the newest version first. Write dates as `YYYY-MM-DD`. The full example is in [`references/changelog-examples.md`](references/changelog-examples.md).

**Is a CHANGELOG needed?**

| Situation | CHANGELOG |
|---|---|
| Delivered to a customer, with a UAT (user acceptance testing) round or a version number | Required — the customer and the acceptance reviewer see what this round delivers |
| Others call it (API · library · app with users) | Required — they learn whether they must change anything on their side |
| Prototype · personal script · solo work with no release rounds | Not needed — `git log` is enough · write the reason in the README |

**Write for the people who use the product.** 1 item per line, stating the result the user sees, not a commit list, file names or ticket numbers. Leave out invisible work unless it can be felt. "เปลี่ยนที่ทำให้ของเดิมพัง" is always on top. The full rules and the wrong → right examples are in [`references/changelog-examples.md`](references/changelog-examples.md).
- For version numbers and bump rules, see `cicd-and-release`.

---

## 4 · Formatters and linters — end the style arguments

- `.editorconfig` (indentation · line endings · encoding) for every language · template with `.gitattributes` → `assets/starter-files.md`
- The formatter fixes style on save (Prettier · dotnet format · black/ruff · `dart format`). The linter catches only real mistakes (ESLint · .NET analyzers · ruff · `flutter analyze`).
- Set `end_of_line = lf` and `.gitattributes` `* text=auto eol=lf`. Otherwise a team mixing Windows with other systems gets pull requests that diff the whole file.
- **The formatter decides for people.** Any setting is fine, but the whole team must use the same one.
- Have CI check it too, instead of trusting that everyone set up their machine the same way.
- When turning it on in an old project, format the whole repo in **one commit with nothing else in it**,
  then add that commit to `.git-blame-ignore-revs`.

---

## 5 · Dependencies

- **Always commit the lock file**, and install on CI with a command that follows the lock (`npm ci` · `flutter pub get --enforce-lockfile`). Otherwise each day's build gets a different set.
- Check for vulnerabilities in the pipeline (`cicd-and-release`). Update on a schedule: patch monthly, minor quarterly, not only when something breaks.
- A new dependency needs a reason in the pull request (`lazy-coding`).

**Before adding a library, ask 3 questions:** can the language's standard library do it, is the project still alive, and
does the license allow use in work that is sold (see `research-with-sources/prior-art-review`)?

---

## 6 · Checklist when opening a new project

Tick `[x]` only for items you **ran or opened in this round**. For an item not yet built or run, write `[ ]` and say what is pending. For an item that does not apply to this project, write `N/A — <reason>`.

- [ ] `README.md` answers the layer 1 questions the project has content for · sections and commands come from the layer 2 survey results (`_to_delete/readme-survey.md` exists) · commands have been run on a clean machine
- [ ] The root matches the layout in `project-doc-set` item 1 (repo named as the lowercase project name joined by `-` · an ecosystem uses `ecosystem/`) and has no temp files or `.docx` at the root
- [ ] Add-ons and sub-programs of the app live in `<project-name>/extension/<name>/`, each with its own README and a CI build, or `N/A` when the app has none
- [ ] `.env.example` lists every value with comments. If the project reads no environment variables at all (for example an offline mobile app), do not create it, but write "ไม่มีค่าตั้งภายนอก" (no external settings) in the README
- [ ] `.editorconfig` · `.gitattributes` · formatter · linter are set up, and CI checks them
- [ ] `.gitignore` covers `.env` · build folders · `_to_delete/` · Android: `key.properties` · `*.jks` · `*.keystore`
- [ ] `docs/README.md` is an index, with an owner for each document
- [ ] `CHANGELOG.md` has an "ยังไม่ปล่อย" heading waiting
- [ ] At least 1 test runs and passes, to prove the layout works
- [ ] `main` is protected and needs a pull request and CI. A repo with no remote, or a solo repo, may skip this, but must write the reason in the README and run tests and the linter before each commit instead.
- [ ] **Have someone who did not set up the project follow the README, and time them**

---
## References

- [`references/code-folder.md`](references/code-folder.md) — annotated code-folder tree and the per-stack table (Node · .NET · Python · Dart / Flutter); open when choosing code, test and file-name layout
- [`references/readme-skeleton.md`](references/readme-skeleton.md) · [`references/readme-by-stack.md`](references/readme-by-stack.md) — README section table and fallback commands by language; open at layer 3 of item 2
- [`references/changelog-examples.md`](references/changelog-examples.md) — open when writing a CHANGELOG entry
- Temp files → `workspace-rules/temp-file-discipline` · commits that can build a CHANGELOG → `commit-message-format` · before adding a dependency → `lazy-coding`, `research-with-sources/prior-art-review` · file templates → `assets/starter-files.md`
