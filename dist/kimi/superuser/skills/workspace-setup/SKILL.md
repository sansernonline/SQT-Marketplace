---
name: workspace-setup
description: Use when work starts in a new project folder, the user wants agents to merge PRs and delete branches without asking, or ~/.claude/CLAUDE.md is old.
---

# ตั้งโปรเจกต์ให้ agent ทำงานจนจบได้

> **กฎข้อเดียว:** agent ตรวจเองได้และแก้ `.gitignore` เองได้ แต่สิทธิ์ของตัวเองกับกฎประจำตัวของเจ้าของ **ให้ผู้ใช้กดรันคำสั่งเดียว** ห้ามรันเองหรือหาทางเลี่ยง เพราะเป็นการแก้สิทธิ์ของตัวเอง ระบบตรวจสิทธิ์อัตโนมัติของ Claude Code ปฏิเสธ (เกิดจริง 2026-10-25 ทั้งแก้ `~/.claude/CLAUDE.md` และ `gh pr merge`)

สคริปต์ [`scripts/setup.mjs`](scripts/setup.mjs) ทำ 3 อย่าง ทุกอย่างรันซ้ำได้ไม่พัง และสำรองไฟล์เดิมไว้ใน `<โปรเจกต์>/_to_delete/` ก่อนเขียนทับ

| ส่วน | เพิ่มอะไร | ใครรัน |
|---|---|---|
| `--gitignore` | `.claude/` และ `.claude-plugin/` ใน `.gitignore` ของโปรเจกต์ (ผู้ใช้เลือก 2026-10-26: ไม่ commit ไฟล์ของ Claude Code) · ถ้าโปรเจกต์เป็น plugin หรือ marketplace เอง (มี `.claude-plugin/marketplace.json` หรือ `plugin.json`) จะเพิ่มแค่ `.claude/` เพราะ `.claude-plugin/` คือตัวสินค้า เอาออกจาก GitHub แล้วติดตั้งและอัปเดต plugin ไม่ได้ทุกเครื่อง | agent รันเองได้ |
| `--permissions` | กฎอนุญาตใน `.claude/settings.local.json` ของโปรเจกต์: `gh pr merge` · `git branch -d` · `git push origin --delete` · `git worktree remove` (ลบได้เฉพาะของที่ merge แล้วหรือ worktree ที่สะอาด) · กฎเดิมเก็บไว้ครบ · JSON ที่อ่านไม่ได้ไม่แตะ | ผู้ใช้ |
| `--global-rules` | `~/.claude/CLAUDE.md` = กฎประจำตัวรุ่นล่าสุดจาก `hooks/core-rules.md` ของ plugin นี้ · **แทนที่ทั้งไฟล์ ไม่ผสาน** กฎที่ผู้ใช้เขียนเองจะหายจากไฟล์ใช้งาน (อยู่ในไฟล์สำรอง) จึงต้องบอกผู้ใช้ก่อน | ผู้ใช้ |

## ขั้นตอน

1. **หา path ของสคริปต์** — ติดตั้งจาก marketplace: `ls -d ~/.claude/plugins/cache/*/superuser/*/skills/workspace-setup/scripts/setup.mjs | sort -V | tail -1` · ทำงานใน repo SQT-Marketplace: `plugins/superuser/skills/workspace-setup/scripts/setup.mjs`
2. **ตรวจก่อน** — `node "<path>" --check --project "<โฟลเดอร์โปรเจกต์>"` (อ่านอย่างเดียว · ขาดอะไร exit 1) · ครบแล้วจบ ไม่ต้องบอกผู้ใช้
3. **`.gitignore`** — ขาด → `node "<path>" --gitignore --project "<โฟลเดอร์>"` เอง · หมายเหตุที่สคริปต์พิมพ์ว่ามีไฟล์ที่ commit ไปแล้ว ให้บอกผู้ใช้ตามนั้น **ห้ามรัน `git rm --cached` เอง** เพราะเอาไฟล์ออกจาก git ของทุกคน
4. **สิทธิ์และกฎประจำตัว** — ขาด → เตรียมบรรทัดเดียวที่มี path เต็มให้ผู้ใช้วางในช่องแชต (ผู้ใช้พิมพ์ `!` ก่อน 1 ตัวให้ช่องเปลี่ยนเป็นโหมดคำสั่ง แล้วค่อยวางส่วนที่เหลือ):
   ```
   node "<path>" --permissions --global-rules --project "<โฟลเดอร์>"
   ```
   บอกผลที่จะได้ 1 บรรทัด บอกว่าไฟล์เดิมสำรองไว้ที่ไหน และถ้า `--check` บอกว่า CLAUDE.md "ไม่ได้มาจาก superuser" ให้เตือนว่ากฎที่เขียนเองจะถูกแทนที่ ต้องย้ายไปไว้ใน `~/.claude/superuser-style.md` เอง
5. **ตรวจซ้ำ** — หลังผู้ใช้รัน ให้รัน `--check` อีกครั้ง แล้วบอกว่ากฎมีผลกับ session ใหม่ (เปิด Claude Code ใหม่)

## เมื่อมีสิทธิ์แล้ว — merge ให้จบในรอบเดียว

CI เขียว และผู้ตรวจตัวใหม่ให้ผ่าน → ลบ worktree ของ branch นั้นก่อน (`git worktree remove`) ไม่งั้น `--delete-branch` ลบ branch ในเครื่องไม่ได้และหยุดก่อนลบ branch บน GitHub → `gh pr merge <เลข> --merge --delete-branch` → `git pull --ff-only` บน main · ทุก PR ชี้เข้า `main` ตรง ๆ อย่าตั้ง base บน branch ของอีก PR เพราะพอ branch นั้นถูกลบ PR จะถูกปิดเอง (เกิดจริง PR #9 → เปิดใหม่เป็น #10) · ถ้าระบบยังปฏิเสธ บอกผู้ใช้ทันที ไม่หาทางเลี่ยง

## ตรวจก่อนส่ง

- [ ] `--check` ผ่าน หรือบอกผู้ใช้แล้วว่าขาดอะไรพร้อมคำสั่งบรรทัดเดียว
- [ ] ไม่ได้รัน `--permissions` หรือ `--global-rules` เอง
- [ ] repo ที่เป็น plugin หรือ marketplace ไม่ถูก ignore `.claude-plugin/`
- [ ] ไฟล์ที่ commit ไปแล้วไม่ถูกเอาออกจาก git โดยผู้ใช้ไม่ได้สั่ง

ทดสอบ: `node scripts/setup.mjs --self-test` (5 กรณี: เพิ่ม `.gitignore` ซ้ำแล้วไม่ซ้ำ · repo ที่เป็น plugin · เก็บกฎสิทธิ์เดิม · JSON พังไม่แตะ · กฎประจำตัวสำรองของเดิมก่อนเขียน) ผ่าน 5/5 เมื่อ 2026-10-26
