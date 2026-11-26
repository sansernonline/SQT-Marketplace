# skill: project-bootstrap

Use when starting a repository or setting up a new machine

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


## reference: changelog-examples.md

# CHANGELOG — examples

Read this when writing a CHANGELOG for the first time or reviewing one. The rules are in `SKILL.md` item 3. The blank template is in `assets/starter-files.md`. The sample below is Thai because the CHANGELOG itself is written for Thai users.

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
### เพิ่ม
- แจ้งเตือนทาง LINE
### จะเลิกใช้
- ส่งออกรายงานเป็น CSV จะเอาออกในรุ่น 2.0 — ใช้ Excel แทน
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
### ความปลอดภัย
- ผู้ใช้ที่ถูกปิดบัญชีเปิดลิงก์ใบเสร็จเก่าไม่ได้แล้ว

## [1.1.1] — 2026-09-10 [ถอน]
```

## Headings and version numbers

| Heading (Keep a Changelog) | Use for | Version part to bump (Semantic Versioning) |
|---|---|---|
| เปลี่ยนที่ทำให้ของเดิมพัง (breaking changes; our own addition) | Users or calling systems must change something on their side | MAJOR · in the `0.y.z` range, MINOR is allowed |
| เพิ่ม (Added) | New capability | MINOR |
| เปลี่ยน (Changed) | Existing behavior works differently but does not break | MINOR |
| จะเลิกใช้ (Deprecated) | Still works but will be removed · name the removal version and the replacement | MINOR |
| เอาออก (Removed) | Already removed | MAJOR |
| แก้ (Fixed) | Bugs | PATCH |
| ความปลอดภัย (Security) | Vulnerabilities already closed · do not describe how to attack | PATCH, or by size |

The version-bump column is this skill's own proposal. Semantic Versioning says only this: MAJOR = incompatible with the old version · MINOR = backward-compatible additions or deprecation notices · PATCH = backward-compatible bug fixes.

If a released version must be pulled because of a serious bug or vulnerability, append `[ถอน]` to the version heading (Keep a Changelog uses `[YANKED]`). Do not delete that version. Sources: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning 2.0.0](https://semver.org/) · opened 2026-11-07

Write what the user sees, not a list of commits:

| ✗ | ✓ |
|---|---|
| `- fix(items): change > to >= in withdraw() (#42)` | `- เบิกของเท่ากับจำนวนที่เหลือพอดีได้แล้ว` |
| `- refactor lowStockReport to read movements once` | `- รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที (เดิม 50 วินาที)` |

## Writing rules (full version)

- Write for the **people who use the product**. Do not paste the commit list.
- 1 item = 1 line. Say what the user gains or sees change, not which file changed.
- Leave out file names, function names and ticket numbers, unless the reader is a developer who calls that API.
- Leave out work the user cannot see, such as code restructuring, new tests or CI fixes. The exception is a speed or stability gain big enough to feel. Then write it as the result ("รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที").
- Within each heading, put the items that affect users most at the top. Drop any heading that has no items.
- The heading "เปลี่ยนที่ทำให้ของเดิมพัง" must always sit at the **top** of that version. Every deprecation, removal and breaking change must be listed, even a small one.


## reference: code-folder.md

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
  extension/             ← add-ons and sub-programs of this app, 1 folder each: browser extension · plugin · CLI · hook client · SDK (`SKILL.md` item 1) · only when one exists
    <name>/              ← own README · own build and tests in that stack's layout
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


## reference: readme-by-stack.md

# README by language — commands, files and extra sections

Use this with [`readme-skeleton.md`](readme-skeleton.md). These tables are a fallback and a starting point for search terms (`SKILL.md` item 2, layer 2). They are not commands you can paste in as is. Take the real commands from the project's files and the official documentation for the version in use. **Run every command on a clean machine before it goes into the README** (`SKILL.md` item 2). A cell marked ※ means the official page was not opened to confirm it in the round it was written (2026-11-07).

## 1 · Versions, main files and per-environment settings

Put these into README section 4 "Prerequisites" and section 6 "Configuration".

| Stack | manifest + lock (commit both) | Pin the runtime version in a file | Per-environment settings |
|---|---|---|---|
| Node / TypeScript | `package.json` + `package-lock.json` or `pnpm-lock.yaml` (one lock type only) | `.nvmrc` (`nvm use`) · `engines` in `package.json` is only a warning until `engine-strict` is on | Vite: `.env` · `.env.[mode]` · `.env.local` · only `VITE_*` reaches the browser · Angular: `src/environments/` + `ng build --configuration <name>` |
| .NET / C# | `.sln` or `.slnx` + `.csproj` · `packages.lock.json` optional ※ | `global.json` → `sdk.version` (full number) + `rollForward` (set `disable` when using a lock file) | `appsettings.json` + `appsettings.{Env}.json` · chosen by `ASPNETCORE_ENVIRONMENT` (web) or `DOTNET_ENVIRONMENT` · unset = Production · dev secrets: `dotnet user-secrets` · `launchSettings.json` is for dev machines only |
| Python | `pyproject.toml` + `uv.lock` · do not commit `.venv` | `.python-version` (`uv python pin`) + `requires-python` | No central standard · `.env` + environment variables, or the framework's settings ※ |
| Java / Kotlin | `pom.xml` or `build.gradle.kts` + `settings.gradle.kts` | Gradle wrapper (commit `gradlew` `gradlew.bat` `gradle/wrapper/*`) · Maven wrapper `mvnw` ※ · Java Development Kit (JDK) version | Spring Boot: `application.yml` + `application-{profile}.yml` · enable with `SPRING_PROFILES_ACTIVE` or `--spring.profiles.active=prod` |
| Go | `go.mod` + `go.sum` | The `go 1.xx` line (minimum) + `toolchain` | No standard · environment variables ※ |
| Flutter / Dart | `pubspec.yaml` + `pubspec.lock` (apps commit the lock · libraries do not) | `environment:` in pubspec ※ · FVM if used (not official) | Flavors: Android `productFlavors` in `android/app/build.gradle.kts` · iOS uses schemes ※ · `--dart-define` ※ |
| Rust | `Cargo.toml` + `Cargo.lock` | `rust-toolchain.toml` (`channel` + `components`) | No standard · environment variables ※ |
| PHP / Laravel | `composer.json` + `composer.lock` | `"php": "^8.x"` in `require` | `.env` (not committed) + `.env.example` · `APP_ENV` selects `.env.[APP_ENV]` · `APP_DEBUG=false` in production |

## 2 · Commands

Put these into README section 5 "Getting started", 7 "Common commands" and 10 "Build and output files".

| Stack | Install | Run | test | lint · format | build / package → output files |
|---|---|---|---|---|---|
| Node / TypeScript | `npm ci` (follows the lock) · `pnpm install --frozen-lockfile` | `npm run dev` ※ | `npm test` ※ | `npm run lint` ※ · Prettier ※ | `npm run build` ※ → `dist/` |
| .NET / C# | `dotnet restore` | `dotnet run` · `dotnet run -lp https` | `dotnet test` ※ | `dotnet format` ※ | `dotnet publish` (net8.0 and later default to Release) → `bin/Release/<tfm>/publish/` · `-r <RID> --self-contained` (Runtime Identifier (RID), for example `linux-x64`) |
| Python | `uv sync` | `uv run <command>` | `uv run pytest` ※ | `ruff check` · `ruff format` | `uv build` ※ → wheel · sdist |
| Java / Kotlin | Fetched at build time | `./mvnw spring-boot:run` · `./gradlew bootRun` ※ | `./mvnw test` · `./gradlew test` ※ | Spotless · Checkstyle · ktlint (no single standard) ※ | `./mvnw package` · `./gradlew build` ※ → a jar, run with `java -jar` |
| Go | `go mod download` ※ | `go run ./cmd/<name>` ※ | `go test ./...` ※ | `gofmt` · `go vet` ※ | `go build ./...` ※ → one binary file |
| Flutter / Dart | `flutter pub get` ※ | `flutter run --flavor <name>` | `flutter test` ※ | `flutter analyze` · `dart format .` ※ | `flutter build appbundle` → `build/app/outputs/bundle/release/app.aab` · `flutter build ipa` ※ |
| Rust | `cargo fetch` ※ | `cargo run` ※ | `cargo test` ※ | `cargo clippy` · `cargo fmt` ※ | `cargo build --release` ※ → `target/release/` |
| PHP / Laravel | `composer install` · `npm ci && npm run build` (assets) ※ | `php artisan serve` ※ | `php artisan test` | Laravel Pint ※ | deploy: `php artisan config:cache` (never run in dev) · `php artisan storage:link` |

## 3 · Extra README sections by language

| Stack | What to add |
|---|---|
| Node / TypeScript | The Node version from `.nvmrc` + tell readers to run `nvm use` · npm or pnpm (never 2 lock types) · a `scripts` table · every `VITE_*` variable, with a warning that the value reaches the browser · Angular: the list of configurations |
| .NET / C# | The Software Development Kit (SDK) version from `global.json` · which project is the startup project · where `ASPNETCORE_ENVIRONMENT` is set · the key names to set through `user-secrets` (no values) · the `dotnet publish` command actually used · the EF Core migration commands |
| Python | The version from `.python-version` · uv, or venv + pip (one way only) · with a src layout, install before testing · where the ruff settings live · the `.env` file that must exist |
| Java / Kotlin | The JDK version · always use `./mvnw` or `./gradlew`, never the locally installed tool · a profile table and how to enable each · the name and location of the jar produced |
| Go | The version from the `go` and `toolchain` lines · what each binary in `cmd/` does · the environment variables read |
| Flutter / Dart | The Flutter and Dart versions · a flavor table (name · applicationId · entry file) · signing: where `key.properties` and the keystore are, and whom to ask (never commit them) · iOS: team and provisioning · the build command per flavor and where the output lands |
| Rust | The toolchain from `rust-toolchain.toml` · the feature flags available · the binaries in `src/bin/` · the Minimum Supported Rust Version (MSRV) if it is a library |
| PHP / Laravel | The PHP version and required extensions · `cp .env.example .env` → `php artisan key:generate` ※ → migrate · build assets · deploy steps (`config:cache` · `storage:link` · queue worker) |

## 4 · Folder layout from official sources

Use this for README section 8 "Project structure". This repo's rules (code folder name · test location) are in `SKILL.md` item 1 and win when they conflict.

| Stack | Layout the tools expect | Source |
|---|---|---|
| Node / TypeScript | npm sets none · follow the framework generator (`src/` · `public/` · `vite.config.ts` or `angular.json`) ※ | — |
| .NET / C# | No official page · most common is `src/<App>/` + `tests/<App>.Tests/` + `global.json` + `.slnx` ※ | — |
| Python | src layout: `src/<package>/` · `pyproject.toml` at the root | [PyPA src vs flat](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/) |
| Java / Kotlin | `src/main/java` (or `kotlin`) · `src/main/resources` · `src/test/java` | [Maven Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html) |
| Go | `cmd/<binary>/main.go` · `internal/` · a small package can keep its files at the root · `golang-standards/project-layout` and `pkg/` come from the community, not the Go team | [Organizing a Go module](https://go.dev/doc/modules/layout) |
| Flutter / Dart | `lib/` (`lib/src/` for internals) · `test/` · `android/` · `ios/` ※ | [Dart package layout](https://dart.dev/tools/pub/package-layout) |
| Rust | `src/main.rs` · `src/lib.rs` · `src/bin/` · `tests/` · `examples/` · `benches/` | [Cargo project layout](https://doc.rust-lang.org/cargo/guide/project-layout.html) |
| PHP / Laravel | `app/` · `config/` · `database/` · `public/` · `resources/` · `routes/` · `storage/` · `tests/` | [Laravel 13.x structure](https://laravel.com/docs/13.x/structure) |

## 5 · Sources (opened 2026-11-07)

[npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci) · [package.json engines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) · [pnpm install](https://pnpm.io/cli/install) · [nvm .nvmrc](https://github.com/nvm-sh/nvm/blob/master/README.md) · [Vite env and mode](https://vite.dev/guide/env-and-mode) · [Angular environments](https://angular.dev/tools/cli/environments) · [global.json](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json) · [ASP.NET Core environments](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/environments) · [user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) · [dotnet publish](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-publish) · [Writing pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) · [uv project layout](https://docs.astral.sh/uv/concepts/projects/layout/) · [uv Python versions](https://docs.astral.sh/uv/concepts/python-versions/) · [Ruff configuration](https://docs.astral.sh/ruff/configuration/) · [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) · [Spring Boot profiles](https://docs.spring.io/spring-boot/reference/features/profiles.html) · [Spring Boot Maven run](https://docs.spring.io/spring-boot/maven-plugin/run.html) · [Go toolchains](https://go.dev/doc/toolchain) · [Flutter flavors](https://docs.flutter.dev/deployment/flavors) · [Flutter Android release](https://docs.flutter.dev/deployment/android) · [Cargo FAQ](https://doc.rust-lang.org/cargo/faq.html) · [rust-toolchain.toml](https://rust-lang.github.io/rustup/overrides.html) · [Composer basic usage](https://getcomposer.org/doc/01-basic-usage.md) · [Laravel configuration](https://laravel.com/docs/12.x/configuration)

Tool versions change fast (Laravel 13.x was already out on the date checked). Before using these tables on a real project, open the official page for the version in use.


## reference: readme-skeleton.md

# README skeleton and companion documents — full version

The rules are in `SKILL.md` item 2 · a copy-ready template is in `assets/starter-files.md` · commands and files for each language are in [`readme-by-stack.md`](readme-by-stack.md)

## 1 · README sections in the order a newcomer needs them

> This table is the fallback and the length criteria for layer 3 in `SKILL.md` item 2 · the real sections of each project come from the layer 2 survey (read the project · official docs · READMEs of projects of the same type) · a section that this type of project needs but that is not in the table may be added.

The order follows what someone who has just arrived needs: what is this → install → run → change code → ship · the "Sources" column is the number of the 5 main sources (item 4) that recommend the section · a row that merges several topics gives a range · "—" means no main source recommends it; it is this skill's own judgment. The section names in the "Section" column are the Thai headings written into the README, so they stay Thai (English gloss in brackets).

| # | Section | Question it answers | Present when | How long · where to move it if longer | Sources |
|:--:|---|---|---|---|:--:|
| 1 | ชื่อ + ทำอะไรให้ใคร (name + what it does for whom) | What is this, who uses it | always | 2–3 lines · first line at most 120 characters | 5 |
| 2 | บรรทัดสถานะ (status line) | Is it still in development, who owns it, where are the docs | always | 1 line: status · owner · link to `docs/README.md` | 2–4 (status 2 · owner 4 · docs link 4) |
| 3 | ภาพหน้าจอหรือตัวอย่างผล (screenshot or sample output) | What does it look like or produce | there is a screen or output to look at | 1 image, or a sample command with its output | 2 (usage example 3) |
| 4 | ต้องมีบนเครื่อง (needed on the machine) | What must be installed first, which version | always | table: tool · version · which file pins the version (`.nvmrc` · `global.json`) | 3 |
| 5 | เริ่มใช้งาน (getting started) | How to install and run | always | commands that can be copied, pasted and run, at most 6 commands · more than that becomes `scripts/setup` | 4 |
| 6 | ตั้งค่า (configuration) | What must be configured, how many environments, how to switch | the project reads values from outside | table: variable name · what it is for · required or not · sample value (no real values) · for a secret give only the name and where to get it · if there is none, write "ไม่มีค่าตั้งภายนอก" (no external config) | 0 · based on Twelve-Factor |
| 7 | คำสั่งที่ใช้บ่อย (common commands) | How to run dev · test · lint · format · build | always | table of 4–8 rows · test must be 1 command | 2 |
| 8 | โครงโปรเจกต์ (project layout) | What is in which folder | always | a one-level tree, at most 15 lines · more → `ARCHITECTURE.md`, code-map section | 1 |
| 9 | สถาปัตยกรรมย่อ (short architecture) | How many parts the system has, how they talk | more than 1 part (web page + API + database · queue · external service) | 3–5 lines + a Mermaid diagram at Context or Container level · full → `ARCHITECTURE.md` | — · based on matklad and C4 |
| 10 | build และไฟล์ที่ได้ (build and output files) | How to make the deliverable, what files come out, where | there is something to build (web · app · binary · package) | build command per target + the path of the output file | 2 (counted together with deploy) |
| 11 | deploy | Where it goes live, who triggers it, through which Continuous Integration (CI), how to roll back | it can be deployed | 3–5 lines · full steps → `docs/runbook-deploy.md` | 2 (counted together with build) |
| 12 | ติดปัญหา (troubleshooting) | Common symptoms and fixes | always | table of symptom · fix · start from what you hit yourself while writing the README | — |
| 13 | ร่วมพัฒนา (contributing) | branch · commit · pull request (PR) · what to check before sending | other people change the code | 3–5 lines · longer → `CONTRIBUTING.md` | 4 |
| 14 | ติดต่อและขอความช่วยเหลือ (contact and help) | Whom to ask when stuck, which channel | always | 1–2 lines | 4 |
| 15 | สัญญาอนุญาต (license) | How far it can be reused | always · the last section | 1 line + the `LICENSE` file · for internal work write "ใช้ภายใน <บริษัท> ห้ามเผยแพร่" (internal use at <company>, do not distribute) | 2 |

**Skeleton rules**
- Cut a section that has nothing in it; do not write "none" · except section 6, which must say there is no external config.
- The README holds only what a newcomer needs in the first 30 minutes · anything longer moves to the file named in column 2, with a link back; do not delete it.
- Longer than 100 lines → put a table of contents under the status line.
- Edit the README in the same commit as the code that changes a command or setting.
- Each language has sections to add (Flutter flavors · .NET `user-secrets`) → [`readme-by-stack.md`](readme-by-stack.md) section 3.

## 2 · What goes into other files

| File | Lives at | Content | Create when |
|---|---|---|---|
| `ARCHITECTURE.md` | `<project-name>/` | a code map for people who change the code (section 3) | the folder tree in the README exceeds 15 lines, or the system has more than 1 part |
| `CHANGELOG.md` | `<project-name>/` | what users see changing in each version | per the table in `SKILL.md` item 3 |
| `CONTRIBUTING.md` | `<project-name>/` | developer machine setup · branch · commit · PR · lint and test before sending | README section 13 is longer than 5 lines |
| `LICENSE` | `<project-name>/` | the full license text | the repo is public, or the contract requires it |
| `SECURITY.md` | `<project-name>/` or `.github/` | how to report a vulnerability · versions still supported | the repo is public, or delivered to a customer who maintains it |
| `CODEOWNERS` | `.github/` | which folder whom must review in a PR | there are several teams or owners |
| `runbook-deploy.md` | `docs/` at the root | build → release → run steps · each environment's setup · rolling back | the deploy steps are longer than 5 lines |
| `decisions/ADR-NNNN-<slug>.md` | `docs/` at the root | decision records (Architecture Decision Record (ADR)), one per decision | a hard-to-reverse decision is made (`adr-writer`) |
| Architecture, delivery edition | `docs/` at the root | an arc42-style architecture document | delivering to a customer or there is an acceptance reviewer (`project-doc-set`) |

The location of `docs/` follows layout B in `project-doc-set` item 1 · GitHub looks for `CONTRIBUTING` and `CODEOWNERS` in `.github/` first, then the repo root, then `docs/` · documents in `docs/` can be split by what the reader needs into 4 kinds (Diátaxis): learning (tutorial) · getting a job done (how-to, e.g. a runbook) · looking up facts (reference, e.g. an API settings table) · understanding the reasons (explanation, e.g. ARCHITECTURE · ADR)

## 3 · ARCHITECTURE.md

**Default: matklad's short form** — the reader is someone who will change the code and wants to know where the thing that does X lives.

```markdown
# สถาปัตยกรรม

## ภาพรวม
<ระบบแก้ปัญหาอะไร รับอะไรเข้า ส่งอะไรออก — 1 ย่อหน้า + รูป Context หรือ Container 1 รูป>

## แผนที่โค้ด
<แต่ละโฟลเดอร์หรือโมดูลหลักทำอะไร คุยกับใคร — ทีละย่อหน้าสั้น ๆ>

## ข้อห้ามที่ต้องรักษา
<กฎที่โค้ดต้องไม่ละเมิด เช่น "ชั้น domain ไม่ import ฐานข้อมูล" · "ทุกการเขียนเงินผ่าน ledger">

## เส้นแบ่งระหว่างชั้น
<ตรงไหนคือ API สาธารณะ ตรงไหนแก้ได้อิสระ>

## เรื่องที่ตัดผ่านทุกส่วน
<log · error · สิทธิ์ · config · การทดสอบ — ทำแบบไหน อยู่ที่ไหน>
```

- Short; include only what rarely changes · you may name a file, module or type, but put no links, because links break when files move; let people search by name instead.
- Do not explain every module in detail · do not chase every commit · review 2–3 times a year.
- Diagrams use only the 2 C4 levels, Context and Container, which c4model.com says are enough for most teams · do not draw the Code level · draw with Mermaid per `software-diagrams`.

**Use arc42 instead when** delivering to a customer or another team who will maintain it · there are quality requirements (speed, security) that must be proven · an acceptance reviewer is needed — choose only the sections that have real content from the 12 sections: goals · constraints · scope and context · solution strategy · building blocks · runtime view · deployment · cross-cutting concepts · decisions (point to ADRs) · quality requirements · risks and technical debt · glossary · this edition lives in `docs/` per `project-doc-set`, not in the code folder.

## 4 · Sources (read 2026-11-07)

The 5 main sources used to count the "Sources" column in item 1:
- [standard-readme spec](https://github.com/RichardLitt/standard-readme/blob/main/spec.md) — required sections · license at the end · table of contents when over 100 lines
- [Make a README](https://www.makeareadme.com/) — long is better than short; if too long, move, do not delete
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Google documentation guide: READMEs](https://google.github.io/styleguide/docguide/READMEs.html) · [Best practices](https://google.github.io/styleguide/docguide/best_practices.html) — change docs together with code
- [Microsoft Engineering Playbook: Project and Repositories](https://microsoft.github.io/code-with-engineering-playbook/documentation/guidance/project-and-repositories/) — folder layout · compile test build deploy

Supporting sources: [GitHub community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) · [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) · [matklad: ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) · [arc42](https://arc42.org/overview) · [C4 model diagrams](https://c4model.com/diagrams) · [Diátaxis](https://diataxis.fr/) · [Twelve-Factor: Config](https://12factor.net/config) · [Build, release, run](https://12factor.net/build-release-run)

The section order · the 15-line and 6-command ceilings · the configuration table · the troubleshooting and short-architecture sections are this skill's own judgment, not the sources' words.
