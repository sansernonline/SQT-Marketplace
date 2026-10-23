---
name: "code-review"
description: "Run a code review with a fresh reviewer agent and the code-review-checklist skill."
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `review` แล้วคัดลอกขั้นตอนของ playbook ลง todo ก่อน ส่วนขั้นตอนด้านล่างบอกรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้คู่กับ playbook ไม่ได้ใช้แทน

Use a new `reviewer` agent (read-only) to perform a thorough code review of: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง** · high-stakes or contested change → `adversarial-review-panel`

The reviewer should:

1. Read the file(s) or diff to understand the change · for a branch or PR, pin the exact range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report so author and reviewer talk about the same code
2. Apply the `code-review-checklist` skill systematically
3. Rate each finding with the reviewer's own scale: **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional)
4. Give a concrete fix for each finding, not just criticism
5. Use the reviewer's output format: verdict **ผ่าน** / **ไม่ผ่าน** with counts per level. The `blocking:`/`nit:` prefixes in `code-review-checklist` are only for comments posted on a pull request

The author does not fix every finding on sight: a finding can be wrong (reviewer misread the code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge · idea from superpowers requesting-code-review
