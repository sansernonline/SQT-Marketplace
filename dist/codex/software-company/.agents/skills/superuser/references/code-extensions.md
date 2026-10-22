# ส่วนเพิ่มงานโค้ด ของ skill กลาง

skill กลางอยู่ใน plugin `superuser` และเขียนให้ใช้กับงานทุกสาขา · ไฟล์นี้เก็บส่วนที่ใช้เฉพาะงานโค้ด · ใช้คู่กับ skill กลางตัวนั้นเสมอ ไม่ใช้แทน

## สารบัญ

- [context-budget](#context-budget)
- [principle-small-verifiable-steps](#principle-small-verifiable-steps)
- [principle-user-experience-first](#principle-user-experience-first)
- [status-report](#status-report)
- [parallel-split-and-merge](#parallel-split-and-merge-worktree-ต่อตัว)
- [parallel-attempts-pick-best](#parallel-attempts-pick-best)
- [team-roles แบ่งงาน](#team-roles-แบ่งงาน)
- [adversarial-review-panel](#adversarial-review-panel)
- [document-naming](#document-naming-แถวเฉพาะงานโค้ด)
- [spell-out-abbreviations](#spell-out-abbreviations-ตัวย่อฝั่งโค้ด)
- [temp-file-discipline](#temp-file-discipline-โฟลเดอร์ย่อยเฉพาะงานโค้ด)

## context-budget

ย้ายมาจากหัวข้อ 6 ของ SKILL.md (ส่วนเพิ่มสำหรับงานโค้ด)

โปรเจกต์โค้ดที่กลับมาทำบ่อย ควรมีแผนที่โปรเจกต์สั้น ๆ ที่ **โหลดอัตโนมัติ**

| ไฟล์ | โหลดเอง | เหมาะกับ |
|---|:--:|---|
| **`<project>/CLAUDE.md`** | ✅ | แผนที่โปรเจกต์ · คำสั่งที่ใช้บ่อย · กฎเฉพาะโปรเจกต์ |
| `<project>/<โฟลเดอร์ใหญ่>/CLAUDE.md` | ✅ เมื่อทำงานในโฟลเดอร์นั้น | โมดูลที่ซับซ้อนเป็นพิเศษ |
| `context.md` · `notes.md` ชื่ออื่น | ❌ | **ต้องสั่งให้อ่านทุกครั้ง จึงเสียเปล่า** |

อย่าตั้งชื่อไฟล์แผนที่เป็นอย่างอื่น เพราะ `CLAUDE.md` ถูกอ่านให้อัตโนมัติ ส่วนไฟล์ชื่ออื่นต้องมีคนสั่งให้อ่าน

สิ่งที่ควรอยู่ในแผนที่ของโปรเจกต์ สั้น ๆ ไม่เกิน 40 บรรทัด:

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

ไม่ควรมี: เนื้อหาที่อ่านจากโค้ดได้อยู่แล้ว · รายการไฟล์ทั้งหมด · ประวัติการเปลี่ยนแปลง

**hook กรอง output ของ test** — hook `PreToolUse` บน `Bash` ดูคำสั่งก่อนรัน ถ้าเป็นคำสั่ง test (`npm test` · `pytest` · `dotnet test` · `go test`) ก็ต่อท้ายด้วยตัวกรองที่เหลือแค่บรรทัด FAIL/ERROR แล้วส่งคำสั่งใหม่กลับใน `hookSpecificOutput.updatedInput` · ใส่ใน `.claude/settings.json` ของโปรเจกต์ · บน Windows เขียน script เป็น PowerShell หรือรันผ่าน Git Bash · ตัวอย่างเต็มอยู่ในหัวข้อ "Offload processing to hooks and skills" ของ [Claude Code: Manage costs](https://code.claude.com/docs/en/costs) (ตรวจ 21 ต.ค. 2569)

**hook ตัด output ยาวที่ไม่ใช่ test** — hook `PostToolUse` คืน `updatedToolOutput` แทนผลของ tool ได้ (เช่น เหลือ 100 บรรทัดท้ายของ build log) · ([Claude Code: hooks](https://code.claude.com/docs/en/hooks) · ตรวจ 21 ต.ค. 2569)

**plugin code intelligence** — Language Server Protocol (LSP) · "go to definition" 1 ครั้งแทน grep + อ่านหลายไฟล์ · เห็น type error หลังแก้ทันทีโดยไม่ต้อง build · ติดตั้ง 2 ส่วน: (1) ตัว language server บน `PATH` — C# `csharp-ls` · TypeScript `typescript-language-server` (`npm install -g typescript-language-server typescript`) · Python `pyright-langserver` (2) plugin ใน Claude Code — `/plugin install csharp-lsp@claude-plugins-official` (หรือ `typescript-lsp` · `pyright-lsp`) · ใช้ได้ใน terminal ไม่ทำงานใน cloud session · ([Claude Code: code intelligence](https://code.claude.com/docs/en/plugins/code-intelligence) · ตรวจ 21 ต.ค. 2569)

## status-report

ย้ายมาจากข้อ 2 ของ SKILL.md เดิม (แบบ `docs/BUILD-PLAN.md` สำหรับงานโค้ด)

ตัวอย่างหัวข้อ `## สถานะล่าสุด` เต็ม:

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

ประเภทเพิ่มเติม: `โค้ด` · `build` คือไฟล์ release ที่สร้างแล้ว (Android Package (APK) · Android App Bundle (AAB) · installer) ส่วน `ส่งมอบ` คือถึงมือผู้ใช้หรือขึ้นร้านค้าแล้ว

สถานะ (โค้ด · build): `เสร็จ` · `ทำอยู่` · `ติด` · `รออนุมัติ` · `ค้างอยู่` — ตรงกับตารางงานของ `spec-to-code-loop` รหัสงานใช้รหัส FR ของ SRS ถ้ามี

แอปมือถือ: หลักฐานต้องบอกเครื่องที่รัน — `ผ่าน — emulator Pixel 6 API 34 · ค่าเซนเซอร์ฉีดเข้า` หรือ `ผ่าน — เครื่องจริง <รุ่น> Android 14` ถ้ายังไม่ได้ลองเครื่องจริงให้เขียนไว้ในช่อง ค้าง

โค้ดที่สถานะเท่ากันรวมเป็นช่วงรหัสได้ (`FR-001 ถึง FR-012`)

## parallel-split-and-merge (worktree ต่อตัว)

- **`git status` สะอาด** → subagent ใส่ `isolation: worktree` และตั้ง `"worktree": { "baseRef": "head" }` ใน `.claude/settings.json` · ถ้าไม่ตั้ง worktree จะแตกจาก branch หลักบน remote = ได้โค้ดเก่า
- **มีงานที่ยังไม่ commit** (ปกติ เพราะ commit ต้องรออนุมัติ) → worktree ในตัวมองไม่เห็นงานนั้น · หัวหน้าทีมสร้างเองแบบไม่ commit และไม่แตะ branch (ใส่ `.claude/worktrees/` ใน `.git/info/exclude` ก่อน ไม่แตะ `.gitignore` ของผู้ใช้):
  ```bash
  W=.claude/worktrees/<ชิ้น>; P=_to_delete/patches; mkdir -p "$P"
  base=$(git stash create); base=${base:-HEAD}       # ถ่ายภาพไฟล์ที่ track ไว้ โฟลเดอร์งานไม่เปลี่ยน
  git worktree add --detach "$W" "$base"
  git ls-files --others --exclude-standard -z -- . ':!.claude/worktrees' | xargs -0 -r -I{} cp --parents {} "$W/"   # ไฟล์ใหม่ที่ยังไม่ track
  git -C "$W" add -A && git -C "$W" write-tree > "$P/<ชิ้น>.base"   # จุดตั้งต้นรวมไฟล์ที่คัดลอกไป · จดลงไฟล์เพราะตัวแปรไม่ข้ามการรันคำสั่งแต่ละครั้ง
  ```
  `cp --parents` ใช้ได้บน Linux และ Git Bash · macOS ใช้ `rsync -R` แทน · ไฟล์ที่ gitignore แต่ต้องใช้ (เช่น `.env`) ใส่ใน `.worktreeinclude`
- **รวมกลับ** → patch มีเฉพาะสิ่งที่ลูกทีมแก้ (ไฟล์ที่คัดลอกไปไม่ติดมาเป็นไฟล์ใหม่) แล้วหัวหน้าทีม `git apply` ทีละชิ้นในโฟลเดอร์งาน รัน test หลังแต่ละชิ้น · ชนกัน → หยุดชิ้นนั้น ลง `ติด` · เสร็จแล้ว `git worktree remove --force "$W"` · ไม่ commit เอง
  ```bash
  git -C "$W" add -A && git -C "$W" diff --cached "$(cat "$P/<ชิ้น>.base")" > "$P/<ชิ้น>.patch"
  git apply "$P/<ชิ้น>.patch"
  ```
- worktree คือ checkout ใหม่ → ต้องติดตั้ง dependency ใหม่ (ใช้ cache ของ package manager ช่วย) · ห้อง Docker (`docker-sandbox -Isolated`) เก็บไว้ใช้กับงานที่ต้องแยกเครื่องจริง: ติดตั้งของทั้งระบบ · รันโค้ดที่ไม่ไว้ใจ · งานทั้งคืน
- **dynamic workflow ในงานโค้ด** — ตัวอย่างคำขอ: `ultracode: audit every route handler under src/routes/ for missing auth checks` · `use a workflow to run npx tsc --noEmit and keep fixing until it passes or two rounds make no progress` · migrate ทีละไฟล์ให้สั่ง "each file in its own isolated copy" · ยังมีงานไม่ commit → ใช้วิธีสร้าง worktree เองข้างบน

## parallel-attempts-pick-best

- ผู้แข่งแต่ละตัวใช้ git worktree ของตัวเองตามหัวข้อ "parallel-split-and-merge (worktree ต่อตัว)" ข้างบน · เกณฑ์ให้คะแนนงานโค้ด: โค้ดน้อย · อ่านง่าย · ผ่าน test · ทำตามข้อกำหนดครบ · ใกล้กันให้เลือกตัวที่ขอบเขตสะอาดกว่าและ Application Programming Interface (API) เล็กกว่า (`lazy-coding`)
- ห้อง Docker (`docker-sandbox -Isolated`) เฉพาะงานที่ต้องแยกเครื่องจริง

## team-roles (แบ่งงาน)

- ชิ้นใหญ่ของงานโค้ด = โค้ดเกินราว 40 บรรทัด · ของกลาง = type · interface · ชื่อฟังก์ชัน · `package.json` · index · กติกาในใบสั่งงานชี้ `stack-*` + `lazy-coding` + `readable-code` · ผลส่งกลับมีผล test · ตอนรวมรัน test ทั้งชุดก่อนส่ง `reviewer`
- งานใหญ่ หัวหน้าทีมไม่เขียนโค้ดชิ้นใหญ่เอง ส่ง `developer` · ของกลางและชิ้นเล็กยังทำเองได้

## adversarial-review-panel

- **ขอบเขต** — `git diff main...HEAD` หรือ `git status --short` ถ้ายังไม่มี commit
- **มุมเพิ่มของงานโค้ด** — ก: ทำงานพร้อมกัน · error ที่ถูกกลืน · รันซ้ำแล้วได้ผลต่าง · ข: input ที่ไม่ได้ตรวจ · ค: test ที่ผ่านทั้งที่ผิด

### มุมรีวิวแอปมือถือ

   ถ้ารีวิวแอปมือถือ ให้รีวิวเวอร์ ก เพิ่มมุม **วงจรชีวิตแอป** — process ถูกฆ่าแล้วกลับมา (state หาย) · แอปไปอยู่เบื้องหลังแต่เซนเซอร์หรือกล้องยังเปิด (แบตหมด) · ผู้ใช้ถอนสิทธิ์กลางทาง · หมุนจอ

## document-naming (แถวเฉพาะงานโค้ด)

- ชุดเอกสารโปรเจกต์ docx: Project Plan · Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Architecture · Functional Specification Document (FSD) · Test Plan (`project-doc-set` ข้อ 2.1) · ใบตรวจรับ User Acceptance Testing (UAT) — รูปแบบ docx มีคนเซ็น ต้องล็อกฉบับ
- Architecture Decision Record (ADR) · API spec · data dictionary · runbook · README → markdown — ADR `docs/decisions/` และ runbook `docs/` ที่ราก (`project-doc-set` ข้อ 1) · README ในโฟลเดอร์โค้ด · เปลี่ยนตามโค้ด ต้อง diff ได้
- ชื่อไฟล์ ADR: `ADR-NNNN-<slug>.md` เรียงเลขต่อเนื่อง ใน `docs/decisions/` เช่น `docs/decisions/ADR-0007-choose-whisper.md`
- ตัวอย่างเดิม: `TRS-SRS-v1.2-APPROVED.docx` · `TRS-FSD-recording-v0.3-DRAFT.docx` · `docs/runbook-recording.md`

## spell-out-abbreviations (ตัวย่อฝั่งโค้ด)

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## temp-file-discipline (โฟลเดอร์ย่อยเฉพาะงานโค้ด)

| โฟลเดอร์ย่อย | ใส่อะไร | skill ที่ใช้ |
|---|---|---|
| `verify-runs/` | ภาพหน้าจอและผลรันของแอปจริงตอนตรวจ (หลักฐาน verify) | `app-verifier-setup` · `spec-to-code-loop` |
| `screenshots/` | ภาพเรนเดอร์ของดีไซน์หรือ mockup (เดิมอ้าง) | `mobile-app-design` · `web-app-design` · `windows-app-design` |
| `security/` | ผลสแกนดิบ | `security-gate` |
| `check/` | ชื่อเดิมของ `spec-to-code-loop` สำหรับภาพตรวจ ส่วนงานใหม่ใช้ `verify-runs/` แทน | `spec-to-code-loop` |

## principle-small-verifiable-steps

- ทุก commit อ่านจบในตัวเองและ build ผ่าน คนรีวิวจึงไล่ทีละ commit แล้วเชื่อได้
- Pull Request (PR) ที่เปลี่ยนเกิน 400 บรรทัด ให้แบ่งเป็นหลาย PR ต่อกัน (เกณฑ์เดียวกับ `pr-description-template` และ `code-review-checklist`)
- รูปแบบข้อความใช้ `commit-log` · ตั้ง commitlint หรือ release อัตโนมัติ → `commit-message-format`
- ลำดับ: ของที่คนอื่นพึ่ง (type · schema · ฟังก์ชันกลาง) ก่อนของที่เรียกใช้ · เปลี่ยนของเดิม → `principle-replace-then-delete`

## principle-user-experience-first

- หน้าจอทุกจอมีสถานะ 5 แบบ และเรียงความสำคัญในหน้า → `ui-craft`
- ข้อความ วันที่ ตัวเลข เงิน หลายภาษา → `i18n-and-locale`
- ตรวจของจริงด้วยการเปิดแอป → `app-verifier-setup`
