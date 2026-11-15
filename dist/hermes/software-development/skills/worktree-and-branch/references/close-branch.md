# ปิด branch — ตารางตัดสินใจ

ย้ายมาจาก SKILL.md หัวข้อ 4 (2026-11-10)

| ทาง | เลือกเมื่อ | ต้องจริงก่อน | คำสั่ง (รันจาก main checkout เว้นแต่ระบุ) | อนุมัติ |
|---|---|---|---|---|
| **merge ในเครื่อง** | โปรเจกต์ไม่มี PR flow · คนเดียว · งานเล็กที่รีวิวแล้วใน diff | test ผ่านบน branch · base branch ถูกต้อง (ถามถ้าไม่แน่ใจ) · ไม่มีงานค้างใน worktree | `git checkout main` → `git pull` → `git merge --no-ff <branch>` → รัน test บน main → ผ่านแล้วค่อยข้อ 6 · test พังบน main → `git merge --abort` ไม่ได้แล้วหลัง commit → `git reset --hard ORIG_HEAD` ทันที และคง worktree ไว้ | **รออนุมัติ** — commit ลง main และกฎ "ไม่ commit ลง branch หลักโดยไม่ถาม" |
| **เปิด PR** | ทีมรีวิว · CI · repo มี remote | test ผ่าน · rebase/merge main ล่าสุดแล้ว · commit message ตาม `commit-message-format` | ใน worktree: `git push -u origin <branch>` → `gh pr create --fill` (หรือ URL ที่ push พิมพ์มา) · เนื้อหาตาม `pr-description-template` · **คง worktree ไว้**จนกว่า PR ปิด เพื่อแก้ตาม comment | **รออนุมัติ** — push ออกนอกเครื่อง |
| **เก็บไว้ก่อน** | รอข้อมูล · รอตัดสินใจ · งานหยุดกลางทาง | จด path · branch · ค้างอะไร ใน `docs/BUILD-PLAN.md` หรือ handoff | ไม่ทำอะไรกับ git · `git worktree lock --reason "<รออะไร>" ../<repo>-<งาน>` ถ้ากลัวโดน prune | ไม่ต้อง |
| **ทิ้ง** | spike จบ · ทางที่แพ้ใน bake-off · ผลไม่คุ้ม | ผู้ใช้สั่งทิ้งชัดเจน (เสนอให้เลือก ไม่เสนอเป็นค่าเริ่มต้น) · แสดงก่อนว่าจะหาย: commit กี่ตัว (`git log main..<branch> --oneline`) · ไฟล์ untracked | `git worktree remove ../<repo>-<งาน>` (มีของค้างต้อง `--force` — ถามก่อน) → `git branch -D <branch>` | **รออนุมัติ** — ลบงาน |

- ข้อสรุปของ `finishing-a-development-branch` (obra/superpowers · MIT · เรียบเรียงใหม่): test ก่อนเมนู · ผู้ใช้เป็นคนเลือกทาง · "ทิ้ง" ไม่อยู่ในเมนูปกติ · PR และเก็บไว้ = คง worktree
- `--no-ff` ให้ main มี merge commit 1 จุดต่องาน ย้อนทั้งงานได้ด้วย `git revert -m 1` · ถ้าทีมใช้ squash หรือ rebase-merge อยู่แล้ว ทำตามทีม (`cicd-and-release`)
