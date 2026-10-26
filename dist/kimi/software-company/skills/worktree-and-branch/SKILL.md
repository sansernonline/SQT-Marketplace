---
name: worktree-and-branch
description: Use when 2 or more agents edit one repo at once, a spike could break the main checkout, or a finished branch must be merged, PR-ed or discarded.
---

# worktree-and-branch — แยกที่ทำงานให้ agent แล้วปิด branch ให้จบ

> **กฎข้อเดียวของ skill นี้:** 1 agent ที่แก้ไฟล์ = 1 worktree = 1 branch · จบงานต้อง**เลือกทางปิด branch ด้วยหลักฐาน** (test ผ่านบน branch นั้น) และ**เก็บกวาด** — worktree ที่ค้างคือ branch ที่ไม่มีใครรับผิดชอบ

git worktree คือ "สำเนาโฟลเดอร์ทำงาน" ที่ใช้ `.git` เดียวกัน แต่มี branch · HEAD · index ของตัวเอง — agent 2 ตัวแก้ไฟล์พร้อมกันโดยไม่ชนกัน และเครื่องหลัก (main checkout) ไม่ถูกแตะ · ใช้ร่วมกับ `parallel-split-and-merge` (ของกลางใน `superuser`) ขั้น "ห้ามเขียนที่เดียวกัน" — skill นั้นแบ่งงาน skill นี้แยกที่ทำงานและรวมกลับ

## เมื่อไหร่คุ้ม

| สถานการณ์ | ทำ |
|---|---|
| agent ≥ 2 ตัวจะ**แก้ไฟล์**ใน repo เดียวกันพร้อมกัน | worktree ต่อตัว — ตัวที่อ่านอย่างเดียวไม่ต้อง |
| spike หรือ refactor ที่อาจพังจนย้อนยาก (ย้ายโครง · เปลี่ยน dependency ใหญ่) | worktree แยก · เครื่องหลักยังรันได้ตลอด |
| ต้องแก้ bug ด่วนระหว่างที่ main checkout มีงานค้างครึ่งทาง | worktree จาก `main` · ไม่ต้อง stash |
| เทียบ 2 ทาง (`parallel-attempts-pick-best`) | worktree ต่อทาง · ต้องแยกเครื่องจริง → `docker-sandbox` isolated ต่อทาง |

## เมื่อไหร่ **ไม่** คุ้ม

| สถานการณ์ | ใช้ |
|---|---|
| agent ตัวเดียว งานเล็ก ย้อนได้ด้วย `git checkout -- .` | branch ธรรมดาใน checkout เดิม |
| งานอ่านอย่างเดียว (สำรวจ · รีวิว · วัด) | ไม่ต้องแยก — `Explore` หรือ agent ที่สั่ง "ห้ามแก้ไฟล์" |
| repo ยังไม่มี commit เลย | worktree สร้างไม่ได้ · commit แรกก่อน |
| โปรเจกต์ต้องติดตั้งของหรือรันเซิร์ฟเวอร์ที่ชน port กัน | worktree + `docker-sandbox` (ห้องละ worktree) |

---

## 1 · สร้าง worktree

```bash
git worktree add ../<repo>-<งาน> -b <ประเภท>/<งาน>     # จาก HEAD ปัจจุบัน
git worktree add ../<repo>-<งาน> -b fix/login main      # จาก main
git worktree list                                        # ต้องเห็น 2 บรรทัด: main checkout + ใหม่
```

- **วางเป็นโฟลเดอร์พี่น้อง** `../<repo>-<งาน>` (เช่น `../shop-api-fix-login`) — ไม่วางข้างใน repo ยกเว้นโฟลเดอร์ที่ gitignore แล้วเช่น `.claude/worktrees/` ของ Claude Code (ข้อ 2) · ข้างในแบบไม่ ignore = ไฟล์ของ worktree โผล่เป็น untracked ใน main และ `rg`/build กวาดเจอ 2 ชุด
- **branch ชื่อ `<ประเภท>/<งาน>`** ตาม `commit-message-format` (`feat/` · `fix/` · `refactor/` · `spike/`) · branch เดียว checkout ได้ใน worktree เดียว (git ปฏิเสธถ้าซ้ำ) จึงตั้งชื่อใหม่ทุก worktree
- **Windows: path ≤ 260 ตัวอักษร** — Git for Windows ปิด long path ไว้เป็นค่าเริ่มต้น · ชื่อโฟลเดอร์พี่น้องสั้น (`-fix-login` ไม่ใช่ `-fix-login-page-validation-2026-10-23`) · โปรเจกต์ที่ `node_modules` ลึกอยู่แล้วเปิด `git config core.longpaths true` ก่อน (gitforwindows.org · ตรวจ 2026-10-23) · worktree ใต้ OneDrive จะถูก sync — วางนอก OneDrive
- **worktree ไม่มีไฟล์ untracked ของ main** — `.env` · `.env.local` · `appsettings.Development.json` · ใบรับรอง dev ต้องคัดลอกเอง**แบบระบุชื่อไฟล์** (`cp ../<repo>/.env .env`) ไม่ `cp -r` ทั้งโฟลเดอร์ (จะพา `node_modules` และของลับที่ไม่ตั้งใจมาด้วย) · ค่าลับยังอยู่นอก git เหมือนเดิม (`config-and-secrets`)
- **ติดตั้ง dependency แล้ววัด baseline** — `npm ci` / `pip install -r` / `dotnet restore` ใน worktree · รัน test 1 รอบก่อนแก้อะไร · test พังตั้งแต่ baseline → รายงานก่อน ไม่แก้ปนกับงาน (แนว obra/superpowers `using-git-worktrees` · MIT · เรียบเรียงใหม่)
- จด path · branch · baseline ลง `docs/BUILD-PLAN.md` หรือรายงานรอบนั้น — คนมาทีหลังต้องรู้ว่า worktree นี้ของใครและถึงไหน

## 2 · Claude Code มีให้ในตัว (ตรวจเอกสาร 2026-10-23)

| ต้องการ | ทำ | หมายเหตุ |
|---|---|---|
| เซสชันแยกจากเทอร์มินัล | `claude --worktree <ชื่อ>` (หรือ `-w`) | สร้าง `.claude/worktrees/<ชื่อ>/` ที่รากและ branch `worktree-<ชื่อ>` · ใส่ `.claude/worktrees/` ใน `.gitignore` · ไม่ใส่ชื่อ → ตั้งให้เอง · repo ต้องมี commit แล้ว |
| ให้ Claude สร้างเองกลางเซสชัน | บอก "work in a worktree" → tool `EnterWorktree` · ออกด้วย `ExitWorktree` | เข้า path นอก `.claude/worktrees/` ต้องขออนุมัติทุกครั้ง · ขณะอยู่ใน worktree Claude Code **บล็อก** การแก้ไฟล์และคำสั่ง git ที่ชี้กลับ main checkout |
| subagent แต่ละตัวมี worktree ของตัวเอง | frontmatter `isolation: worktree` หรือบอก "use worktrees for your agents" | worktree ชั่วคราว · ไม่มีการแก้ → ลบให้เอง · มีการแก้ → อยู่จน sweep ตาม `cleanupPeriodDays` |
| พา `.env` ไปทุก worktree ที่ Claude สร้าง | ไฟล์ `.worktreeinclude` ที่ราก (syntax `.gitignore`) | คัดลอกเฉพาะไฟล์ที่ match **และ** ถูก gitignore · ไม่มีผลกับ `git worktree add` ที่พิมพ์เอง |
| branch จากงานค้าง ไม่ใช่จาก `main` ของ remote | settings `"worktree": { "baseRef": "head" }` | ค่าเริ่มต้น `"fresh"` = จาก default branch บน `origin` (fetch ให้ถ้าเกิน 24 ชั่วโมง) |
| ออกจากเซสชัน | Claude ตรวจว่ามีงานค้างไหม → สะอาดและไม่ตั้งชื่อ = ลบ worktree + branch ให้ · มีงาน = ถาม เก็บ/ลบ · กลับมาด้วย `claude --worktree <ชื่อ> --resume` | `-p` (ไม่โต้ตอบ) ไม่ถาม → ไม่ลบให้ · ต้อง `git worktree remove` เอง · worktree ที่ Claude ล็อกไว้ต้อง `git worktree unlock` ก่อน |
| ไม่ใช่ git (SVN · Perforce) หรืออยากวางที่อื่น | hook `WorktreeCreate` อ่าน `name` จาก stdin แล้ว `echo` path · คู่กับ `WorktreeRemove` | hook แทน git ทั้งหมด → `.worktreeinclude` ไม่ทำงาน คัดลอก `.env` ใน hook เอง · hook ไม่รันเมื่อ Claude พิมพ์ `git worktree add` เองผ่าน Bash |

worktree ที่สร้างเองด้วย `git worktree add` และของ Claude Code ใช้ `.git` · plugin ระดับโปรเจกต์ · สิทธิ์ที่กด "don't ask again" ร่วมกัน (บน Windows สิทธิ์อยู่กับ worktree นั้น) · Windows: ลบ worktree ไม่ลบไฟล์นอก worktree — junction/symlink ข้างในลบแค่ตัวลิงก์

## 3 · ทำงาน → หลักฐาน

1. ทำใน worktree เท่านั้น — ไม่ `cd` กลับ main checkout เพื่อ "ดูนิดเดียว" (Claude Code บล็อกให้ · มือคนต้องระวังเอง)
2. commit ทีละขั้นที่ตรวจได้ (`principle-small-verifiable-steps`) ใน branch ของ worktree — commit ใน branch งานอยู่ใน "รออนุมัติ" เว้นแต่ผู้ใช้สั่งหรือเขียนอนุญาตไว้ (`approvals.md` ของ `superuser`) · ยังไม่ได้รับอนุญาต → เก็บเป็น diff ใน worktree แล้วเสนอ
3. **หลักฐานก่อนปิด**: test ทั้งชุดผ่านบน branch นี้ · `git status` สะอาด · `git log main..HEAD --oneline` แสดง commit ที่จะเข้า · ถ้ามีหน้าจอ: ภาพจาก `app-verifier-setup` · จดคำสั่งและผลลง `docs/BUILD-PLAN.md` (`principle-prove-it-works`)
4. main ขยับระหว่างทำ → `git fetch` แล้ว `git rebase origin/main` (branch ยังไม่ push · คนเดียวใช้) หรือ `git merge origin/main` (push แล้วหรือมีคนอื่นใช้) · conflict → ข้อ 5 · test ใหม่หลังรวม

## 4 · ปิด branch — ตารางตัดสินใจ

| ทาง | เลือกเมื่อ | ต้องจริงก่อน | คำสั่ง (รันจาก main checkout เว้นแต่ระบุ) | อนุมัติ |
|---|---|---|---|---|
| **merge ในเครื่อง** | โปรเจกต์ไม่มี PR flow · คนเดียว · งานเล็กที่รีวิวแล้วใน diff | test ผ่านบน branch · base branch ถูกต้อง (ถามถ้าไม่แน่ใจ) · ไม่มีงานค้างใน worktree | `git checkout main` → `git pull` → `git merge --no-ff <branch>` → รัน test บน main → ผ่านแล้วค่อยข้อ 6 · test พังบน main → `git merge --abort` ไม่ได้แล้วหลัง commit → `git reset --hard ORIG_HEAD` ทันที และคง worktree ไว้ | **รออนุมัติ** — commit ลง main และกฎ "ไม่ commit ลง branch หลักโดยไม่ถาม" |
| **เปิด PR** | ทีมรีวิว · CI · repo มี remote | test ผ่าน · rebase/merge main ล่าสุดแล้ว · commit message ตาม `commit-message-format` | ใน worktree: `git push -u origin <branch>` → `gh pr create --fill` (หรือ URL ที่ push พิมพ์มา) · เนื้อหาตาม `pr-description-template` · **คง worktree ไว้**จนกว่า PR ปิด เพื่อแก้ตาม comment | **รออนุมัติ** — push ออกนอกเครื่อง |
| **เก็บไว้ก่อน** | รอข้อมูล · รอตัดสินใจ · งานหยุดกลางทาง | จด path · branch · ค้างอะไร ใน `docs/BUILD-PLAN.md` หรือ handoff | ไม่ทำอะไรกับ git · `git worktree lock --reason "<รออะไร>" ../<repo>-<งาน>` ถ้ากลัวโดน prune | ไม่ต้อง |
| **ทิ้ง** | spike จบ · ทางที่แพ้ใน bake-off · ผลไม่คุ้ม | ผู้ใช้สั่งทิ้งชัดเจน (เสนอให้เลือก ไม่เสนอเป็นค่าเริ่มต้น) · แสดงก่อนว่าจะหาย: commit กี่ตัว (`git log main..<branch> --oneline`) · ไฟล์ untracked | `git worktree remove ../<repo>-<งาน>` (มีของค้างต้อง `--force` — ถามก่อน) → `git branch -D <branch>` | **รออนุมัติ** — ลบงาน |

- ข้อสรุปของ `finishing-a-development-branch` (obra/superpowers · MIT · เรียบเรียงใหม่): test ก่อนเมนู · ผู้ใช้เป็นคนเลือกทาง · "ทิ้ง" ไม่อยู่ในเมนูปกติ · PR และเก็บไว้ = คง worktree
- `--no-ff` ให้ main มี merge commit 1 จุดต่องาน ย้อนทั้งงานได้ด้วย `git revert -m 1` · ถ้าทีมใช้ squash หรือ rebase-merge อยู่แล้ว ทำตามทีม (`cicd-and-release`)

## 5 · แก้ conflict

1. **ดูสถานะก่อนแตะไฟล์** — `git status` · ไฟล์ที่ชน: `git diff --name-only --diff-filter=U` · กำลัง merge หรือ rebase (ขั้นไหน) · อย่า `git add` ทั้งหมดทันที
2. **เข้าใจทั้ง 2 ฝั่ง** ต่อไฟล์ — ฝั่งเราทำอะไร (`git log --oneline main..HEAD -- <ไฟล์>`) · ฝั่งเขาทำอะไร (`git log --oneline HEAD..main -- <ไฟล์>`) · เจตนาของแต่ละ commit ไม่ใช่แค่บรรทัดที่ต่าง
3. **แก้ทีละ hunk ให้ได้ทั้ง 2 เจตนา** — ส่วนใหญ่ต้องการทั้งคู่ (ฟังก์ชันใหม่ของเขา + การแก้ของเรา) · ขัดกันจริงให้เลือกตามเป้าหมายของงานนี้แล้วจดเหตุผลใน commit · **ไม่** `git checkout --ours` / `--theirs` ทั้งไฟล์เพื่อให้ผ่านไว — นั่นคือลบงานคนอื่นเงียบ ๆ
4. ไฟล์ที่ generate (lock file · snapshot · build output) → regenerate จากคำสั่ง ไม่แก้มือ
5. **test ทั้งชุดหลังรวม** — conflict ที่ "แก้แล้ว" แต่ test ไม่รัน = ยังไม่แก้ · `git add <ไฟล์>` → `git merge --continue` หรือ `git rebase --continue`
6. แก้ไม่ได้ในรอบนี้ → `git merge --abort` / `git rebase --abort` กลับสถานะเดิม แล้วรายงานว่าไฟล์ไหนชนและทำไม — ไม่ทิ้ง repo ไว้กลาง merge
7. แนวของ mattpocock `resolving-merge-conflicts` (MIT): ไล่เจตนาของแต่ละ hunk แล้วแก้ให้ครบ ไม่ abort แล้วหนี — ต้นฉบับใน repo ปัจจุบันไม่พบที่ path เดิม (ยังไม่ได้ตรวจ · อ่านจากสำเนาที่คนอื่นคัดไว้)

## 6 · เก็บกวาด (ต้องมีหลักฐานก่อนลบ)

```bash
git worktree list                        # ก่อนลบ ดูว่าเหลืออะไร
git -C ../<repo>-<งาน> status --porcelain -uall   # ว่าง = สะอาด · ไม่ว่าง = ถามผู้ใช้ก่อน
git worktree remove ../<repo>-<งาน>      # สะอาดเท่านั้น · มีของค้างต้อง --force (ถาม)
git worktree prune                       # ล้างรายการของโฟลเดอร์ที่ถูกลบมือ
git branch --merged main                 # รายชื่อ branch ที่ main มีครบแล้ว — ลบได้ด้วย -d
git branch -d <branch>                   # -d ปฏิเสธถ้ายังไม่ merge · -D บังคับ = ต้องอนุมัติ
```

- ลบ branch เมื่อ **`git branch --merged main` มีชื่อนั้น** หรือ PR ถูก merge บน remote (`gh pr view <n> --json state`) · `-D` ใช้เฉพาะทาง "ทิ้ง" ที่อนุมัติแล้ว
- ลบ worktree ที่ Claude Code ล็อกอยู่ → `git worktree unlock` ก่อน · ล็อกที่คนตั้งเอง (`--reason`) ไม่แตะ ถามเจ้าของ
- จบวันหรือจบ playbook: `git worktree list` ต้องเหลือเฉพาะที่มีเหตุผลในบันทึก · playbook `housekeeping` ของ `superuser` เรียกข้อนี้

## 7 · คำสั่ง PowerShell กับ bash

| ต้องการ | PowerShell 5.1 (Windows) | bash |
|---|---|---|
| สร้าง worktree + branch ใหม่ | `git worktree add ..\shop-api-fix-login -b fix/login main` | `git worktree add ../shop-api-fix-login -b fix/login main` |
| คัดลอก `.env` ระบุชื่อ | `Copy-Item ..\shop-api\.env .\.env` | `cp ../shop-api/.env .env` |
| เข้าไปทำงาน | `Set-Location ..\shop-api-fix-login` | `cd ../shop-api-fix-login` |
| ติดตั้งแล้ววัด baseline (ผลยาว → ไฟล์) | `npm ci > ..\shop-api\_to_delete\install.txt 2>&1; npm test > ..\shop-api\_to_delete\baseline.txt 2>&1; Get-Content ..\shop-api\_to_delete\baseline.txt -Tail 20` | `npm ci > ../shop-api/_to_delete/install.txt 2>&1 && npm test > ../shop-api/_to_delete/baseline.txt 2>&1; tail -20 ../shop-api/_to_delete/baseline.txt` |
| commit ที่จะเข้า main | `git log main..HEAD --oneline` | `git log main..HEAD --oneline` |
| ไฟล์ที่ชนระหว่าง merge | `git diff --name-only --diff-filter=U` | `git diff --name-only --diff-filter=U` |
| worktree สะอาดไหม | `git -C ..\shop-api-fix-login status --porcelain -uall` (ว่าง = สะอาด) | `git -C ../shop-api-fix-login status --porcelain -uall` |
| ลบ worktree แล้ว prune | `git worktree remove ..\shop-api-fix-login; git worktree prune` | `git worktree remove ../shop-api-fix-login && git worktree prune` |
| branch ที่ merge แล้ว | `git branch --merged main` | `git branch --merged main` |
| เปิด long path (Windows เท่านั้น) | `git config core.longpaths true` | — |

PowerShell 5.1 ไม่มี `&&` → ใช้ `;` หรือ `if ($?) { … }` · path ใช้ `\` หรือ `/` ก็ได้กับ git · อย่าใช้ `2>&1` กับคำสั่ง native ใน PowerShell ถ้าไม่ redirect ลงไฟล์ (stderr จะกลายเป็น error record) — ตารางบนใส่ไฟล์จึงใช้ได้

## 8 · ตรวจก่อนส่ง

- [ ] `git worktree list` ตรงกับบันทึก — ทุก worktree มีเจ้าของ branch และเหตุผล
- [ ] worktree อยู่โฟลเดอร์พี่น้องหรือ `.claude/worktrees/` ที่ ignore แล้ว · ไม่มี untracked ของ worktree โผล่ใน main
- [ ] `.env` และไฟล์ตั้งค่า dev ถูกคัดลอกระบุชื่อ · ไม่มีค่าลับเข้า commit (`security-gate`)
- [ ] baseline test ก่อนแก้ และ test ทั้งชุดหลังแก้ มีผลจดพร้อมวันที่
- [ ] ทางปิด branch ถูกเลือกจากตารางข้อ 4 · ขั้นที่เป็น "รออนุมัติ" (merge ลง main · push · ทิ้ง) ยังไม่ทำจนกว่าผู้ใช้ตอบ
- [ ] conflict ทุกไฟล์แก้แบบรู้ทั้ง 2 ฝั่ง · test รันหลังรวม · ไม่มี `--ours`/`--theirs` ทั้งไฟล์ใน log
- [ ] หลัง merge: worktree ลบแล้ว · `git worktree prune` · branch ลบด้วย `-d` หลัง `--merged` ยืนยัน
- [ ] Windows: path ยาวสุดของ worktree < 260 หรือเปิด `core.longpaths`

## 9 · Anti-patterns

- **worktree ในโฟลเดอร์ repo โดยไม่ ignore** — main เห็นเป็น untracked · `rg` และ build เจอ 2 ชุด
- **`cp -r` ทั้ง main มา worktree** — พา `node_modules` · `.git` ย่อย · ค่าลับที่ไม่ตั้งใจ
- **branch เดียวใช้ 2 worktree** — git ปฏิเสธ · ถ้าบังคับ `--force` จะได้ HEAD ชนกัน
- **แก้ conflict ด้วย `--ours` ทั้งไฟล์** — ลบงานคนอื่นโดยไม่รู้ตัว · ตรวจไม่เจอจน production
- **merge ลง main แล้วค่อย test** — test พังบน main = ทุกคนพัง · test บน branch ก่อน แล้ว test อีกครั้งหลัง merge ก่อน push
- **`git worktree remove --force` โดยไม่ดู `status`** — ของค้างหายถาวร
- **ทิ้ง worktree ไว้เป็นเดือน** — branch ตามไม่ทัน main · conflict โตทุกวัน · ปิดหรือทิ้งภายในรอบงาน
- **`git branch -D` แทน `-d` เพราะ `-d` ไม่ยอม** — `-d` ปฏิเสธคือหลักฐานว่ายังไม่ merge
- **agent merge ลง main หรือ push เอง**เพราะ "test ผ่านแล้ว" — อยู่ใน "รออนุมัติ" เสมอเว้นแต่เขียนอนุญาตไว้

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| แบ่งงานเป็นชิ้นอิสระก่อนแยก worktree · รวมผลกลับ | `parallel-split-and-merge` (ของกลางใน `superuser`) — ขั้น "ห้ามเขียนที่เดียวกัน" ชี้มาที่ skill นี้ · ไม่แก้ไฟล์ของ superuser จากที่นี่ |
| ลองหลายทางแล้วเลือก | `parallel-attempts-pick-best` — worktree ต่อทาง |
| แยกเครื่องจริง (port ชน · ติดตั้งของ) | `docker-sandbox` — ห้อง isolated ต่อ worktree |
| ชื่อ branch · ข้อความ commit | `commit-message-format` |
| เนื้อหา PR | `pr-description-template` · รีวิวด้วย `code-review-checklist` |
| ขั้นที่ต้องถามคนก่อน (merge main · push · ลบ) | `superuser` → `references/approvals.md` |
| ทำทีละขั้นที่ตรวจได้ · พิสูจน์ว่าใช้ได้ | `principle-small-verifiable-steps` · `principle-prove-it-works` |
| บันทึก worktree ที่ค้างและเหตุผล | `decision-log` · `handoff` |
| ค่าลับใน `.env` ที่คัดลอก | `config-and-secrets` · `security-gate` ก่อน push |
| เก็บกวาดประจำรอบ | playbook `housekeeping` ของ `superuser` |

## แหล่งที่มา (ตรวจ 2026-10-23)

| เรื่อง | ที่มา |
|---|---|
| `git worktree add/list/remove/prune/lock/unlock/repair` · branch เดียวต่อ worktree · `remove` ต้องสะอาด · `.git` เป็นไฟล์ชี้ `gitdir` | git-scm.com/docs/git-worktree |
| `-d` ต้อง merged · `-D` = `--delete --force` · `--merged` | git-scm.com/docs/git-branch |
| `claude --worktree` · `.claude/worktrees/<ชื่อ>` · branch `worktree-<ชื่อ>` · `EnterWorktree`/`ExitWorktree` · `.worktreeinclude` · `worktree.baseRef` · cleanup ตอนออก · บล็อกคำสั่งที่ชี้ main checkout · `isolation: worktree` · Windows junction · sweep `cleanupPeriodDays` | code.claude.com/docs/en/worktrees · code.claude.com/docs/en/common-workflows |
| hook `WorktreeCreate` (อ่าน `name` จาก stdin · `echo` path) · `WorktreeRemove` · ไม่รันเมื่อพิมพ์ `git worktree add` เอง | code.claude.com/docs/en/hooks (หัวข้อ WorktreeCreate) · ฟิลด์ input ครบชุดของ `WorktreeRemove` (ยังไม่ได้ตรวจ) |
| วาง worktree ที่ ignore แล้ว · ติดตั้ง dependency · baseline test ก่อนแก้ | github.com/obra/superpowers → skills/using-git-worktrees (MIT · เรียบเรียงใหม่ · ต้นฉบับแนะนำ `.worktrees/` ในโปรเจกต์ — เราเลือกโฟลเดอร์พี่น้องตาม Claude Code docs "Manage worktrees manually") |
| test ก่อนเมนู · ทาง merge/PR/เก็บ · ทิ้งเฉพาะเมื่อสั่ง · ไม่ `--force` เอง | github.com/obra/superpowers → skills/finishing-a-development-branch (MIT · เรียบเรียงใหม่) |
| ไล่เจตนาต่อ hunk · แก้ให้ครบทั้งสองฝั่ง · รัน check หลังแก้ | mattpocock/skills → skills/engineering/resolving-merge-conflicts (MIT) — URL ต้นฉบับตอบ 404 เมื่อ 2026-10-23 · อ่านจากสำเนาบุคคลที่สาม (ยังไม่ได้ตรวจต้นฉบับ) |
| Windows 260 ตัวอักษร · long path ปิดเป็นค่าเริ่มต้น · `core.longpaths` | gitforwindows.org FAQ "Git cannot create a file or directory with a long path" |
| PowerShell 5.1 ไม่มี `&&` · stderr ของ native command | กติกาเครื่องมือ PowerShell ของ Claude Code ในเครื่องนี้ (ตรวจกับ shell จริง 2026-10-23) |
