---
name: docker-sandbox
description: Use when a project needs a Docker sandbox for untrusted code
---

# docker-sandbox: one lab per project

> Our machine gives the orders; the lab is where the work happens.
> Inside, you can install, delete, run servers, and build test databases freely, because when something breaks you wipe it and rebuild with one command.
> Outside (the real machine · real systems · real accounts) cannot be touched, because there is no way in from the inside.

Use together with [`superuser`](../superuser/SKILL.md). In a project that has `.sandbox/`, all install and run work happens in this lab.

Do not use when: writing a Dockerfile or image for a real deploy → [`kubernetes-helm`](../kubernetes-helm/SKILL.md), because the lab is a temporary place to run work, not an image that goes to production.

---

## 1 · One project = one lab

- **One lab per project**, named `sandbox-agent-<folder name>-<creation date>` (e.g. `sandbox-agent-sample-app-20260125`).
  - The name is set once at the first `up` and stored in the file `.sandbox/.name-<folder name>`. Later commands read the name from this file, so the name does not change with the date.
  - The prefix `sandbox-agent-` says an agent created this lab, not a person. The creation date is also kept in the label `sqt.created`.
  - If the project needs a database, cache, or browser, add it as a service in the **same lab** (one stack). Do not create a separate lab.
- **The base image is shared across the whole machine.** `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) is built once. Each project's image adds only a thin layer the project needs, so disk is not used twice.
- **A stopped lab uses no CPU or memory**, only disk. Run `stop` when you finish a task, and `stop-all` when you finish for the day.
- **Extra temporary labs** (`-Name <project>-a1`) are for trying several paths in parallel when they need truly separate machines. (For ordinary multi-path trials, use one git worktree per attempt following `parallel-split-and-merge`; it is faster.) `destroy` them as soon as you pick a path.
- **Never put several projects in one lab**, because installed things collide, one project's breakage spreads to another, and you cannot wipe one project at a time.

## 2 · Two modes: choose by the work

| | **mount** (default) | **isolated** (`-Isolated`) |
|---|---|---|
| Project files | The real folder is attached at `/work`; edits show on the machine at once | A copy lives in a volume; the real folder is attached read-only at `/src` |
| Who edits files | Claude Code on the machine edits files as usual (`sandbox.ps1 claude` does not work in this mode) | Claude Code **inside the lab** (`sandbox.ps1 claude`) |
| Who runs commands | Sent into the lab with `sandbox.ps1 exec "..."` | Claude Code in the lab runs them itself, with no permission prompt |
| How results come back | Already in the folder | `sandbox.ps1 sync` → a patch in `_to_delete\sandbox\`, then the person runs `git apply` |
| Use when | Daily work while a person is watching | Overnight work · risky work · trying several paths that need separate machines (one lab per path) |

You can add `-Locked` to either mode. It blocks outbound internet, leaving only the hosts in `allowlist.txt`. It suits work that runs code you do not yet trust.

---

## 3 · Set up the lab for a project (first time)

1. Check that Docker Desktop is running: `docker version` must show both Client and Server. If it does not, tell the user to open Docker Desktop and stop only this task.
2. Copy every file in this skill's `assets/` to `<project>/.sandbox/` (at the root). Then declare `.sandbox/` as a root exception in the README of the code folder, following `project-doc-set` item 1.
3. Adjust the `Dockerfile` (the project layer).
   - For .NET, set `INSTALL_DOTNET=1` and add an `apt-get install` for whatever the project needs.
   - **Do not edit `base.Dockerfile`** unless necessary, because every project shares it.
   - If you need a test database, add it as a new service in `compose.yaml` (do not open a port to the outside).
4. Add `.sandbox/.mode-*` and `.sandbox/.name-*` to `.gitignore`.
5. Start the lab with `.\.sandbox\sandbox.ps1 up` (or `up -Isolated` · `up -Browser`). The first project on a machine must build the base image first, which takes about 5–15 minutes. Later projects are much faster.
6. **Prove it works:** `sandbox.ps1 exec "node -v && python3 --version && git status"`. If the project has a test command, run it once through `exec`. In `-Locked` mode you must see the line `check passed`.
7. Record in the project's `docs/README.md`: the lab name (`sandbox-agent-<folder name>-<date>`) · mode · port · test command in the lab.

**Tested for real** on Windows + Docker Desktop 4.46 (2026-10-05, project `sample-app`): the lab built · unit tests passed 15/15 · e2e on Chromium passed 14/14 in the lab.

Bugs found during testing are already fixed in the script: PowerShell 5.1 with stderr · Playwright a different version from the base image · port collisions.

If the script breaks on another machine, use the `bug-fix` playbook on the script itself.

**Ports:** `up` finds a free port itself, starting at 3000, and says which port it got.
- Inside the lab it sets the variables `APP_PORT` and `PORT` to that port, and `HOST=0.0.0.0`.
- The app must listen on `HOST`, because if it listens only on `127.0.0.1` inside the lab, the machine cannot reach it.
- On the machine side the port is still opened only on `127.0.0.1`, so you reach it from the machine at `http://127.0.0.1:<port>`.

**A different Playwright version:** the base image has the latest Chromium. If the project pins another Playwright version, run `npx playwright install chromium` in the lab once after `npm ci` (no `--with-deps` needed, because the image already has them).

---

## 4 · Daily use

| Need | Command (run at the project root on the machine) |
|---|---|
| Run a command in the lab (agents use this one) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| Open a shell in the lab | `.\.sandbox\sandbox.ps1 shell` |
| Let Claude Code work fully in the lab (**isolated only**) | `.\.sandbox\sandbox.ps1 claude` (log in once the first time; the volume keeps it · in mount mode the script refuses, because `/work` is the real folder) |
| Bring work out of an isolated lab | `.\.sandbox\sandbox.ps1 sync`, then read the patch before `git apply` |
| All labs on the machine | `.\.sandbox\sandbox.ps1 list` |
| Wipe the lab clean and start over | `reset`, then `up` |
| Stop every lab on the machine and free memory | `.\.sandbox\sandbox.ps1 stop-all` |
| Several labs for one project | Put `-Name <project>-a1` on every command |

**Agent rules when a project has `.sandbox/`**
- Run install · build · test · dev server · migration and any script through `sandbox.ps1 exec`. Never run them on the machine.
- The project's app-checking skill (`app-verifier-setup`) runs Playwright headless in the lab, then copies the images out with `docker compose cp` into `_to_delete/`.
- If the lab is stopped, you may `up` it yourself (reversible). If the lab breaks beyond repair, you may `reset` it yourself, because what is in the lab is not the user's. **Exception:** an isolated lab that has not been `sync`ed must be synced first, then reset.

---

## 5 · Virtual browser for testing

| Type | Use when | How |
|---|---|---|
| Headless in the lab (default) | Automated tests · verify skill · nobody needs to watch | Playwright Chromium already comes with the base image |
| **Visible** (`up -Browser`) | You want to watch the agent click step by step · check the screen by eye · record images | A real browser in a separate container, watched live at `http://127.0.0.1:7900`. Playwright in the lab drives it through `SELENIUM_REMOTE_URL` automatically (Playwright calls this capability experimental) |
| Let Claude Code in the lab control the browser itself | Exploring web pages that have no script yet | Install the Playwright MCP server in the lab (the project's `.mcp.json`) and run it headless |

- The browser in the lab has no accounts, cookies, or user passwords. Log in only with the project's test accounts.
- Copy images and videos from tests out to `_to_delete/` with `docker compose cp`.
- Playwright MCP in the lab (examples from teaching work, not yet a standard): running as root needs `--no-sandbox` · the `--browser` value must match the `--help` of the installed version (`chromium` or `chrome`; if it does not match, it cannot find the browser) · screenshots with a relative file name land in the process's working directory, not `--output-dir`, so move them yourself · a click that times out with "not visible/stable" may be a background tab; see `e2e-testing-patterns`.
- The user's own browser on the machine (the logged-in Chrome) is for real websites that need a real account, and follows that tool's rules. It is not a place to test.

## 6 · CAPTCHA

- **Our own system:** a CAPTCHA should not block testing from the start.
  - Use the test site keys the provider publishes, which pass every time. reCAPTCHA · hCaptcha · Cloudflare Turnstile all have them; see the provider's documentation for the values.
  - Or turn it off with a setting for the test environment only (`CAPTCHA_ENABLED=false`).
  - **Test values must never reach the real system.** Add a startup check that production must not use a test key (`config-and-secrets`).
- **Other people's websites:** the agent **does not solve a CAPTCHA and does not look for a way around it** (no solving services, no pretending to be a person). If you meet a CAPTCHA, stop that step, tell the user to do it themselves, and continue with the other parts. If you need data from that site often, look for an official API instead.
- Reason: a CAPTCHA is the site owner saying "no bots." Getting around it breaks their terms and gets the IP or account banned.

## 7 · What you may do freely in the lab

Install programs (`sudo apt-get` · `npm -g` · `pip`) · delete files in the lab · run servers and test databases · download dependencies · commit in the copy in isolated mode · try destroying things and rebuild.

These still stay under "รออนุมัติ" (awaiting approval) even inside the lab (prepare them, do not do them yourself), because the result leaves the lab:
- Sending data, email, or messages, or calling an API that has a real effect on people or outside systems.
- Using real accounts, real secrets, or the real database.
- Pushing to a remote · deploying.
- In mount mode: deleting or overwriting the user's files in `/work` that are not this round's work (it is the real folder).

---

## 8 · Never edit compose to include these

| Never | Because |
|---|---|
| `privileged: true` · `pid: host` · `network_mode: host` | The lab could see and touch the real machine |
| Mounting `/var/run/docker.sock` or `//./pipe/docker_engine` | Controlling Docker = controlling the machine |
| Mounting the machine's home folder · `.ssh` · `.aws` · `.azure` · `.claude` · browser profiles · a whole drive | Secrets can leak the moment code in the lab reads them |
| Opening a port like `"3000:3000"` (every network card) | People on the same network can reach it. Always use `127.0.0.1:` |
| Putting real secrets in the `Dockerfile` or image | The secret stays in the image forever |
| Removing or raising the limits `cpus` `mem_limit` `pids_limit` until the machine hangs | A lab stuck in a loop will eat the whole machine |
| Mounting things from the machine as writable when the lab only needs to read (`ref/` · sample data · a shared SDK cache · the source folder of isolated mode) | Tricked code in the lab can write back to the machine. Add `:ro` to every mount that is not this round's work, and have the lab copy into its own space if it must edit (idea from anthropics/claude-code devcontainer and trailofbits/skills) |

The Claude Code documentation warns that even in a container, running without permission prompts (`--dangerously-skip-permissions`) cannot stop project code that deliberately steals what is in the lab, including Claude Code's own token. Use it only with a repo you trust, and use `-Locked` when unsure.

So `sandbox.ps1 claude` runs only in isolated mode. In mount mode the script refuses, because `/work` is the user's real folder (§7, last item).

**Limits of `-Locked`:** DNS can go out only through the resolver the lab was given (Docker's), not any DNS server. But that resolver still forwards queries outward, so data can still be smuggled out through DNS (DNS tunnelling). For work where data must never leak, run with no network at all.

---

## 9 · Windows notes

- Docker Desktop uses WSL 2. Files on drive `C:` that are mounted in are slower than files in a volume. If build or test is very slow, use `-Isolated` (verified: `npm ci` for just 2 packages took 52 seconds on a OneDrive folder).
- **Projects in a OneDrive folder:** mount mode makes `node_modules` and build files sync to the cloud, so use `-Isolated` or move the project out of OneDrive.
- If you cannot run `sandbox.ps1`, use `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <command>`.
- `-Locked` reads the host's IP once at startup. A service whose IP changes often may drop out; run `up -Locked` again.

## Links to other skills

- `parallel-attempts-pick-best`: normally competitors use one git worktree each. Use one isolated lab each (`-Name <project>-a1` …) only for work that needs truly separate machines.
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md): the verify skill's `start` script runs in the lab.
- `config-and-secrets`: put test values in a `.env` that stays out of git, and do not bake them into the image.
- The `superuser` playbook `housekeeping`: cleans up old labs and images.
