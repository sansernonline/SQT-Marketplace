# AGENTS.md · กฎสำหรับ AI ที่แก้ repo นี้ (Codex และตัวอื่น)

repo นี้มี AI หลายตัวแก้พร้อมกัน (Claude Code · Codex) · กฎข้างล่างใช้กับทุกตัว · ต้นฉบับของกฎ worktree อยู่ที่ `plugins/superuser/skills/superuser/references/team-files.md` หัวข้อ "หลาย AI ใน repo เดียว" แก้ที่นั่นแล้วแก้ที่นี่ให้ตรงกัน

## ก่อนเริ่ม

- อ่าน `.claude/superuser/CONTEXT.md` หัวข้อ "ความคืบหน้า" และ "รับงานต่อ" ในโฟลเดอร์หลัก `SQT-Marketplace/` · `.claude/` ไม่อยู่ใน git (ผู้ใช้เลือก 2026-10-26) worktree ที่แตกจาก `main` จึงไม่มีไฟล์นี้ อ่านและแก้ที่ `../SQT-Marketplace/.claude/superuser/` เท่านั้น
- รัน `git worktree list` ดูว่าตัวอื่นทำ branch ไหนอยู่ในโฟลเดอร์ไหน

## 1 ตัว 1 worktree

2 ตัวที่ทำงานในโฟลเดอร์เดียวกันใช้ working tree และพื้นที่ stage ร่วมกัน ไฟล์ที่อีกตัว stage ไว้จะติดไปกับ commit ของเรา และสคริปต์สร้าง `dist/` จะหยิบไฟล์ที่ยังไม่ commit ของอีกตัวไปด้วย (เกิดจริง 2026-10-25)

1. เริ่มงานใหม่ใน worktree ของตัวเอง แตกจาก `main` ล่าสุด:
   ```bash
   git fetch origin
   git worktree add ../SQT-Marketplace-codex-<งาน> -b codex/<งาน> origin/main
   ```
   แล้วทำงานในโฟลเดอร์นั้นทั้งหมด · โฟลเดอร์หลัก `SQT-Marketplace/` เป็นของผู้ใช้
2. ชื่อ branch ขึ้นต้นด้วยชื่อเครื่องมือ: `codex/…` · `claude/…` · `gemini/…`
3. ใครทำอะไรอยู่ ดูจาก `git worktree list` และ `git branch -vv` ไม่ต้องจดตารางใน `CONTEXT.md`
4. ห้ามแตะ worktree ของตัวอื่น · ไม่ commit · ไม่ลบ · ไม่ switch branch ในโฟลเดอร์ที่ไม่ใช่ของตัวเอง · เจอไฟล์ค้างที่ตัวเองไม่ได้แก้ = ของคนอื่น ห้าม stage
5. merge แล้วเก็บกวาด: ลบ branch (`gh pr merge <เลข> --merge --delete-branch`) แล้ว `git worktree remove <โฟลเดอร์>` · worktree ยังมีไฟล์ค้าง git จะไม่ยอมลบ ให้บอกผู้ใช้ ห้ามใส่ `--force` · ตอนเริ่มและจบงานไล่ดู `git worktree list` ด้วย: branch ไหน merge แล้ว (`git branch --merged main` มีชื่อ หรือ `gh pr list --head <branch> --state merged` เจอ PR) ลบ worktree ที่สะอาดและ branch นั้นได้ทันทีโดยไม่ต้องถาม แม้เป็นของ session หรือ AI ตัวอื่น · ยังไม่ merge ห้ามแตะ
6. ไฟล์ที่ไม่อยู่ใน git (`node_modules` · `.venv` · `.env`) ไม่ตามมาใน worktree ใหม่ ต้องติดตั้งหรือคัดลอกเอง

## git

- ไม่ commit · push · merge · tag เว้นแต่ผู้ใช้สั่งในรอบนั้น · ไม่ commit ลง `main` ตรง
- ผู้ใช้อนุมัติ merge แล้ว ลบ branch ในขั้นเดียวกันได้เลย ไม่ต้องถามซ้ำ
- ลบ branch ในเครื่องใช้ `git branch -d` (ลบได้เฉพาะที่ merge แล้ว) · ห้าม `-D`

## ก่อน commit

```bash
node scripts/check/validate-marketplace.mjs      # error ต้องเป็น 0
node scripts/build/build-targets.mjs --check     # dist ตรงกับต้นฉบับ · แก้ต้นฉบับหลังสร้าง dist แล้วจะล้ม
scripts\build-dist.cmd                           # validate → claude plugin validate --strict → sync-docs → sync-file-map → build-targets
```

แก้อะไรใน `plugins/superuser` → รัน `node scripts/sync/sync-superuser.mjs` ก่อน · รายละเอียดสคริปต์ทั้งหมดอยู่ใน `scripts/README.md`

## ภาษา

เอกสารและข้อความ commit เขียนภาษาไทยตาม `plugins/superuser/skills/human-writing/SKILL.md` · ไม่ใส่อีโมจิ
