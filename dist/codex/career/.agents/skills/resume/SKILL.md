---
name: "resume"
description: "Write or rewrite a CV in Thai, English or both, tuned to a specific job post."
---

Run the `career-coach` agent with the `resume-th-en` skill: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

1. Ask for the current CV (or work history) and the target job post if not given.
2. Decide Thai-company vs international convention from the job post (see the skill's decision table).
3. Rewrite every bullet as action + result + number; mark missing numbers `[ใส่ตัวเลข]`.
4. Output the CV in the requested language(s), then a short list of what changed and why.
