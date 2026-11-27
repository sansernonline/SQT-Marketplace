# Code-work additions to the central skill

The central skill lives in plugin `superuser` and is written for work in every domain. This file holds the parts that apply only to code work. Always use it together with that central skill, never in place of it.

## Contents

- [context-budget](#context-budget)
- [principle-small-verifiable-steps](#principle-small-verifiable-steps)
- [principle-user-experience-first](#principle-user-experience-first)
- [status-report](#status-report)
- [parallel-split-and-merge](#parallel-split-and-merge-one-worktree-per-agent)
- [parallel-attempts-pick-best](#parallel-attempts-pick-best)
- [team-roles](#team-roles-splitting-work)
- [adversarial-review-panel](#adversarial-review-panel)
- [document-naming](#document-naming-code-work-rows)
- [spell-out-abbreviations](#spell-out-abbreviations-code-side-abbreviations)
- [temp-file-discipline](#temp-file-discipline-code-work-subfolders)

## context-budget

Moved from section 6 of SKILL.md (the additions for code work)

A code project that is revisited often should have a short project map that **loads automatically**.

| File | Auto-loaded | Good for |
|---|:--:|---|
| **`<project>/CLAUDE.md`** | loaded | project map · frequently used commands · project-specific rules |
| `<project>/<big folder>/CLAUDE.md` | loaded when working in that folder | an especially complex module |
| `context.md` · `notes.md` or other names | not loaded | **must be told to read it every time, so it is wasted** |

Do not name the map file anything else, because `CLAUDE.md` is read automatically while a file with another name needs someone to tell the agent to read it.

What belongs in a project's map, short, at most 40 lines:

```markdown
## แผนที่
- API อยู่ที่ `src/api/` · หน้าจอ `src/pages/` · ชนิดข้อมูลร่วม `src/types.ts`
- ตรรกะการคิดราคาทั้งหมดอยู่ใน `src/pricing/` ที่เดียว
- `legacy/` ไม่ได้ใช้แล้ว **ห้ามอ่าน**

## คำสั่ง
- รัน `npm run dev` · test `npm test` · migrate `npm run db:migrate`

## กฎเฉพาะที่นี่
- ห้ามแก้ `generated/` เป็นไฟล์ที่สร้างอัตโนมัติ
```

What should not be there: content that can already be read from the code · a list of all files · change history.

**Hook that filters test output** — a `PreToolUse` hook on `Bash` looks at the command before it runs. If it is a test command (`npm test` · `pytest` · `dotnet test` · `go test`), append a filter that keeps only the FAIL/ERROR lines and send the new command back in `hookSpecificOutput.updatedInput` · put it in the project's `.claude/settings.json` · on Windows write the script in PowerShell or run it through Git Bash · a full example is in the section "Offload processing to hooks and skills" of [Claude Code: Manage costs](https://code.claude.com/docs/en/costs) (checked 2026-10-21)

**Hook that trims long non-test output** — a `PostToolUse` hook can return `updatedToolOutput` in place of the tool's result (for example, keep only the last 100 lines of a build log) · ([Claude Code: hooks](https://code.claude.com/docs/en/hooks) · checked 2026-10-21)

**Code intelligence plugin** — Language Server Protocol (LSP) · 1 "go to definition" replaces grep plus reading several files · type errors show right after an edit without a build · install 2 parts: (1) the language server on `PATH` — C# `csharp-ls` · TypeScript `typescript-language-server` (`npm install -g typescript-language-server typescript`) · Python `pyright-langserver` (2) the plugin in Claude Code — `/plugin install csharp-lsp@claude-plugins-official` (or `typescript-lsp` · `pyright-lsp`) · works in a terminal, does not work in a cloud session · ([Claude Code: code intelligence](https://code.claude.com/docs/en/plugins/code-intelligence) · checked 2026-10-21)

## status-report

Moved from item 2 of the old SKILL.md (the `docs/BUILD-PLAN.md` format for code work)

A full example of the `## สถานะล่าสุด` (latest status) section:

```markdown
## สถานะล่าสุด

อัปเดต: 2026-10-01 14:20 · งานล่าสุด: เขียน SRS

**ภาพรวม:** เสร็จ 1/4 · ทำอยู่ 2 · ติด 0 · ไม่ผ่านตรวจ 1

| รายการ | ประเภท | สถานะ | ใครทำ | ใครตรวจ | ผลตรวจ | ค้าง / หมายเหตุ |
|---|---|---|---|---|---|---|
| SRS (`docs/srs.md`) | เอกสาร | Draft | `business-analyst` | `reviewer` | ผ่าน — 42 Functional Requirement (FR) ตรวจได้ทุกข้อ | FR-031 รอยืนยันตัวเลข |
| mockup (`mockup/`) | เอกสาร | Review | `ux-designer` | `reviewer` | ไม่ผ่าน — ปุ่มหลอก 3 จุด | แก้ `order.html` |
| FSD | เอกสาร | ยังไม่เริ่ม | — | — | — | รอ architecture |
| FR-001 ถึง FR-012 | โค้ด | เสร็จ | `developer` | `reviewer` | ผ่าน — test 48/48 | — |

**ทีมตอนนี้:**

| agent | ทำอะไร | สถานะ | ผล |
|---|---|---|---|
| `ux-designer` | แก้ปุ่มหลอกใน `order.html` | ทำอยู่ | — |
| `business-analyst` | SRS | เสร็จ | ผ่าน — 42/42 FR |
| `reviewer` | ตรวจ mockup รอบ 1 | เสร็จ | ไม่ผ่าน — ปุ่มหลอก 3 จุด |

**ค้างอยู่ (ต้องมีคนตัดสิน):**
1. FR-031 เวลาตอบสนองกี่วินาที — ถามผู้ว่าจ้าง

**รออนุมัติ:**
1. push branch `feat/search` — `git push -u origin feat/search`

**ถัดไป:** แก้ปุ่มหลอกใน mockup → เขียน architecture

**ข้อเสนอ:**
1. ย้ายตัวตรวจ input ไปไว้จุดเดียวที่ขอบ API — ลด if ซ้ำ 14 จุด · แรงกลาง
```

Extra types: `โค้ด` (code) · `build` means a built release file (Android Package (APK) · Android App Bundle (AAB) · installer) while `ส่งมอบ` (delivered) means it has reached the user or gone to the store.

Status (code · build): `เสร็จ` · `ทำอยู่` · `ติด` · `รออนุมัติ` · `ค้างอยู่` (done · in progress · blocked · awaiting approval · pending) — matches the task table of `spec-to-code-loop`. For the task ID, use the FR ID from the SRS if there is one.

Mobile app: the evidence must name the device it ran on — `ผ่าน — emulator Pixel 6 API 34 · ค่าเซนเซอร์ฉีดเข้า` (pass — emulator Pixel 6 API 34 · sensor values injected) or `ผ่าน — เครื่องจริง <รุ่น> Android 14` (pass — real device <model> Android 14). If a real device has not been tried yet, write that in the pending column.

Code items with the same status can be merged into an ID range (`FR-001 ถึง FR-012`, meaning FR-001 to FR-012).

## parallel-split-and-merge (one worktree per agent)

- **`git status` clean** → give the subagent `isolation: worktree` and set `"worktree": { "baseRef": "head" }` in `.claude/settings.json` · if not set, the worktree branches from the main branch on the remote = old code.
- **There is uncommitted work** (normal, because commit has to wait for approval) → the built-in worktree cannot see that work · the team lead creates the worktree itself without committing and without touching a branch (put `.claude/worktrees/` in `.git/info/exclude` first, and do not touch the user's `.gitignore`):
  ```bash
  W=.claude/worktrees/<ชิ้น>; P=_to_delete/patches; mkdir -p "$P"
  base=$(git stash create); base=${base:-HEAD}       # ถ่ายภาพไฟล์ที่ track ไว้ โฟลเดอร์งานไม่เปลี่ยน
  git worktree add --detach "$W" "$base"
  git ls-files --others --exclude-standard -z -- . ':!.claude/worktrees' | xargs -0 -r -I{} cp --parents {} "$W/"   # ไฟล์ใหม่ที่ยังไม่ track
  git -C "$W" add -A && git -C "$W" write-tree > "$P/<ชิ้น>.base"   # จุดตั้งต้นรวมไฟล์ที่คัดลอกไป · จดลงไฟล์เพราะตัวแปรไม่ข้ามการรันคำสั่งแต่ละครั้ง
  ```
  `cp --parents` works on Linux and Git Bash · on macOS use `rsync -R` instead · a file that is gitignored but needed (such as `.env`) goes in `.worktreeinclude`
- **Merge back** → the patch holds only what the worker changed (the copied files do not come along as new files). Then the team lead runs `git apply` one piece at a time in the work folder and runs tests after each piece · on a conflict → stop that piece and log it as `ติด` (blocked) · when done, `git worktree remove --force "$W"` · do not commit by yourself
  ```bash
  git -C "$W" add -A && git -C "$W" diff --cached "$(cat "$P/<ชิ้น>.base")" > "$P/<ชิ้น>.patch"
  git apply "$P/<ชิ้น>.patch"
  ```
- A worktree is a fresh checkout → dependencies must be installed again (use the package manager's cache to help) · keep the Docker room (`docker-sandbox -Isolated`) for work that needs a truly separate machine: system-wide installs · running untrusted code · overnight jobs
- **Dynamic workflow in code work** — example requests: `ultracode: audit every route handler under src/routes/ for missing auth checks` · `use a workflow to run npx tsc --noEmit and keep fixing until it passes or two rounds make no progress` · to migrate one file at a time, say "each file in its own isolated copy" · if there is still uncommitted work → use the way of creating the worktree yourself above.

## parallel-attempts-pick-best

- Each competitor uses its own git worktree per the section "parallel-split-and-merge (one worktree per agent)" above · scoring criteria for code work: less code · easy to read · passes tests · meets every requirement · if close, choose the one with the cleaner scope and the smaller Application Programming Interface (API) (`code-craft`)
- The Docker room (`docker-sandbox -Isolated`) only for work that needs a truly separate machine.

## team-roles (splitting work)

- Code work worth splitting = the total code expected to be written is ≥ 200 lines (measured by the 2026-11-11 bench: 4 modules totalling about 100 lines cost 1.6 times more when split and were not faster) · shared items = types · interfaces · function names · `package.json` · index · the rules in the work order point to `stack-*` + `code-craft` · the returned result includes the test result · when merging, run the whole test suite before sending to `reviewer`
- On big work, the team lead does not write large pieces of code itself and sends them to `developer` · shared items and small pieces it can still do itself.

## adversarial-review-panel

- **Scope** — `git diff --stat main...HEAD` and then open the diff file by file, or `git status --short` if there is no commit yet
- **Extra angles for code work** — A: concurrency · swallowed errors · re-running gives a different result · B: unchecked input · C: tests that pass even though the code is wrong

### Mobile app review angle

   If reviewing a mobile app, give reviewer A the extra angle **app lifecycle** — the process is killed and comes back (state lost) · the app goes to the background but the sensor or camera is still on (battery drain) · the user revokes a permission midway · screen rotation

## document-naming (code-work rows)

- docx project document set: Project Plan · Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Architecture · Functional Specification Document (FSD) · Test Plan (`project-docs` → `references/project-doc-set.md` item 2.1) · User Acceptance Testing (UAT) sign-off sheet — the docx format is signed by people, so the version must be locked
- Architecture Decision Record (ADR) · API spec · data dictionary · runbook · README → markdown — ADRs in `docs/decisions/` and runbooks in `docs/` at the root (`project-docs` → `references/project-doc-set.md` item 1) · README in the code folder · they change with the code and must be diffable
- ADR file name: `ADR-NNNN-<slug>.md`, numbered in sequence, in `docs/decisions/`, for example `docs/decisions/ADR-0007-choose-whisper.md`
- Earlier examples: `TRS-SRS-v1.2-APPROVED.docx` · `TRS-FSD-recording-v0.3-DRAFT.docx` · `docs/runbook-recording.md`

## spell-out-abbreviations (code-side abbreviations)

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## temp-file-discipline (code-work subfolders)

| Subfolder | What goes in | Skill that uses it |
|---|---|---|
| `verify-runs/` | Screenshots and run output of the real app during checking (verify evidence) | `test-automation` · `spec-to-code-loop` |
| `screenshots/` | Rendered images of a design or mockup (previously referenced) | `mobile-app-design` · `web-app-design` · `windows-app-design` |
| `security/` | Raw scan output | `security-gate` |
| `check/` | The old name `spec-to-code-loop` used for check images; new work uses `verify-runs/` instead | `spec-to-code-loop` |

## principle-small-verifiable-steps

- Every commit is readable on its own and builds, so a reviewer can go through it commit by commit and trust it
- A Pull Request (PR) that changes more than 400 lines should be split into several PRs in a chain (the same threshold as `git-and-review`)
- For message format use `workspace-rules/commit-log` · if setting up commitlint or automatic releases → `git-and-review`
- Order: things others depend on (types · schemas · shared functions) before the things that call them · changing existing things → `code-craft`

## principle-user-experience-first

- Every screen has 5 states and ranks importance on the page → `ui-craft`
- Text, dates, numbers, money, multiple languages → `i18n-and-locale`
- Check the real thing by opening the app → `test-automation`
