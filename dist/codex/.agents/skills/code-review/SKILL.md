---
name: "code-review"
description: "Run a comprehensive code review using the developer agent + code-review-checklist skill."
---

Use the `developer` agent to perform a thorough code review of: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The developer should:

1. Read the file(s) or diff to understand the change
2. Apply the `code-review-checklist` skill systematically
3. Categorize findings by severity:
   - `blocking:` — must fix before merge
   - `important:` — should fix
   - `nit:` — optional improvement
   - `q:` — questions
   - `praise:` — acknowledge good work
4. Provide concrete suggestions, not just criticism
5. Produce a summary at the end with overall recommendation:
   - ✅ Approve
   - 🔄 Request changes
   - 💬 Comment only
