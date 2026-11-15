---
name: app-verifier-setup
description: Use when an agent has no scripted way to run the app
---

# app-verifier-setup — give the agent hands and eyes

> If an agent cannot see its own work, it cannot adjust that work, and a person must keep relaying what is on the screen.
> This skill builds the tool once, so every later agent can reuse it.

**Output:** 2 things, a script that lives with the project's tests, and a skill that is only a short guide for agents.

```
<project>/
├─ <project-name>/test/e2e/verify.*         script that drives the real app and opens and closes it itself (in the code folder, see project-bootstrap)
│                                           the list of features and checks lives only in this file (the feature map)
├─ .claude/skills/verify-<project>/SKILL.md   how to run · how to read results · what not to do (at the root, where Claude Code looks)
└─ _to_delete/verify-runs/                  evidence from each run — the script finds paths from its own location, so it does not depend on the folder it runs from
```

(Codex · Gemini use `.agents/skills/` · `skills/` instead of `.claude/skills/`.) Examples already built: the `calculator-demo` project (web) · the Flutter Android app `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node driving `adb`, summarized in [`references/android-native.md`](references/android-native.md)).

**Why not write the steps as a separate text file.** In the sample project, the steps in a `.md` file and in the script disagreed from the first round. So keep the information in the script only, and let the skill point to it.

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

   - If the project has `.sandbox/`, drive the browser in the container. The default is headless (no window). To let a person watch, turn on `up -Browser` (see [`docker-sandbox`](../docker-sandbox/SKILL.md) step 5). An Android emulator cannot run in Docker on Windows (it needs KVM), so run the emulator on the host machine and say so in the report.
   - For a page with CAPTCHA, use the provider's test keys or turn it off in the test environment. Never write a script that solves CAPTCHAs.
   - For an app that reads hardware (sensor · camera · GPS), feed values known in advance, through the emulator (`adb emu sensor set light 420`, virtual camera) or a fake data source that can be turned on only in a debug build. Label every check `emulator` or `เครื่องจริง` (real device), because real sensor accuracy cannot be proven on an emulator. If it has not run on a real device, write "ยังไม่ได้ตรวจบนเครื่องจริง" (not yet checked on a real device).

3. **Write `test/e2e/verify.*`** so it opens the app itself on a port that does not clash (mobile: install the APK and clear app data), seeds test data, and waits until ready **with a time limit** (web: if it is not up in 10 seconds, count it as failed · mobile: set separate times for build · emulator boot · app start · each check, see the reference). Always close the app at the end, and a second run must give the same result (`principle-build-a-tool-not-handwork`).
   - **For a web app or API that needs a server started first**, use [`scripts/with_server.py`](scripts/with_server.py). It starts the server, waits for the port, runs the script, then shuts everything down. For example `python -I scripts/with_server.py --server "npm run dev" --port 5173 -- node test/e2e/verify.mjs` (start several servers by repeating `--server` and `--port` · logs go to `--log-dir`, default `_to_delete/with-server-logs`, created automatically if missing). Tested on Windows on 2026-11-10 with `python -m http.server`, and the port was really closed afterwards. For dynamic apps, wait for `networkidle` (Playwright `page.wait_for_load_state("networkidle")`) or `data-ready="true"` before reading the DOM. Never guess with `sleep`.

4. **Keep the feature list as data in the script.** Go through the menu · routes · command list · SRS, and write 1 group per feature with 1 line per check (`what to do → what must be seen`). Cover at least 3 main features and 1 error case per feature. **Every check starts from a clean state**, can run alone or in a different order, and prints `PASS/FAIL` with expected and actual values.
5. **The script must never pass emptily** (pass without really checking anything). If a feature name does not exist, exit 1. If the app does not come up, exit 1. If no check ran, exit 1 (checking 0 items counts as broken, not as a pass).
   - **A check that verifies "stopped/released" must check the precondition first** (for example, the camera is held before pressing Home). Otherwise it passes emptily. Wait for the result by polling until a timeout, not with a guessed `sleep`.
   - **Make sure you read the latest screen**: delete the old result file before each new read, and tap only when the target position has been steady for 2 reads in a row. If the screen cannot be read because the app never stops redrawing, treat it as an app bug, not a script bug.
6. **Prove the script catches wrong behavior** by breaking the app in 1 place temporarily. Run it, it must `FAIL`, and then restore the change.
7. **Prove the skill works in practice** by sending a fresh `qa-tester` agent that has never seen the code. It uses only this skill to test 1 feature from opening the app to taking a screenshot of the result. Wherever it gets stuck, fix the skill at that point.
8. **Keep the evidence in `_to_delete/verify-runs/<time>/`**, both screenshots and test logs, apart from the code (it is temporary, the user can delete it after delivery, and the agent never deletes it).

## Testing contract — build it into the app from the first screen

verify must depend on things the app provides, not guess from text or CSS. Write this contract into the feature map in the script, and have the developer follow it from the first feature.

| What the app must have | What it is for | Rule |
|---|---|---|
| `data-testid="<page>-<thing>"` in kebab-case on every button, input, result, and error message | Find elements without tying to text or CSS, so checks do not break when language or design changes | For example `book-submit` · `summary-total` · `book-error` · no duplicates on one page · the full list of testids lives in the feature map |
| `<html data-ready="false">` → `"true"` when the page has finished loading data | Wait on a condition instead of a guessed `sleep` (step 5) | Set `true` after the last batch of data arrives, not when the component mounts |
| A reset endpoint such as `POST /api/test/reset` → clears and re-seeds within 5 seconds | Every check starts from a clean state (step 4) | Exists only when `ALLOW_TEST_RESET=1` is set · if not set, answer 404 · never enable in production |
| Clock lock: reset accepts `{"now":"<ISO + offset>"}` and every rule reads "today" from one module (`clock`) | Test date-dependent rules (expiry · cancel at least 24 hours ahead) with the same result every time | If `now` is not sent, use the start date written in the seed · flag off, use real time · never call `Date.now()` / `DateTime.Now` directly in a rule |

Non-web apps follow the same idea: Flutter → a `Key` / Semantics label with the same name · Android → `resource-id` · command line → a `--now` option or an `APP_NOW` variable · a reset on mobile can be enabled only in a debug build.

## What the SKILL.md of the verify skill must contain

- A description saying to use it when you "must prove a feature works on the real app · reproduce a bug · check before shipping".
- Commands that start with `with_server.py` (if the app needs a server) and the rule to wait for `networkidle` or `data-ready` before reading the DOM.
- Start · stop commands · test data (which file holds the test accounts — **never put real passwords**).
- A link to the feature map.
- Prohibitions: do not touch the real database · do not call external APIs that cost money or send real messages.

## What not to do

| Do not | Because |
|---|---|
| Write test steps only in human language with no script | Each agent will invent its own way to run them every time, and no two runs are alike. |
| Put in every feature from day one | A big map that has not been tested decays faster than a small map that really works. |
| Point the verify skill at the real system (production) | Checking turns into editing customer data. |
| Say it is done without doing step 7 | You do not yet know whether other agents can use it. |

## Links to other skills

- [`references/builtin-verify.md`](references/builtin-verify.md) — Claude Code ships with `/verify`: for a project running on Claude Code, create a skill named `verify` at `.claude/skills/verify/SKILL.md` in that format, instead of `verify-<project>`.
- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — fix it when the app has changed so much that the map no longer matches.
- `e2e-testing-patterns` — if you want to lift some steps into automated tests in continuous integration (CI).
- [`superuser`](../superuser/SKILL.md) — the playbooks `bug-fix` and `feature` call the skill built here.
