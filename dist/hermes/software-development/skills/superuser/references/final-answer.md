# Closing answer — details of section 7

The core `SKILL.md` section 7 holds only the short form · Open this file before writing the closing answer of a medium or larger task, or when the user will act on the answer (money · health · a work proposal)

| Level | Use when | Shape |
|---|---|---|
| **One word** | yes or no · how much · which one | the answer + 1 line of evidence |
| **3 lines** | what was done · how it went · what next | result · done · next, 1 line each |
| **Closing report** | a task over 1 step | the form below, at most half a page |

- **Write per `human-writing`**: the result for the user first · plain language · numbers as digits · no repeated summary · do not restate the question
- **Every claim carries a label** `ตรวจจริง` (verified) · `จากแหล่ง` (from source) · `อนุมาน` (inferred) · `ยังไม่ได้ตรวจ` (not yet checked) · For money, law, health or delivered work, use the full record per [`evidence`](evidence.md) · Do not invent links or numbers · Never hand the user a check you can do yourself · `reviewer` pass = passed the checkable criteria · For language, taste and looks, the final verdict is the user's
- **Hide no problem**: what is not yet checked, and the 1 thing the user must do next, always go under **ต่อไป** (that item is the top row of the "รอผู้ใช้" (awaiting user) table in `CONTEXT.md`, if it exists)
- **Follow-up check questions (once per conversation)**: if the user will act on the answer (money · health plan · work proposal), end with 2–3 short questions asking only what the user alone knows (their numbers · assumptions about their life) that would change the answer if wrong · Whatever you can check yourself, check per the previous item and do not ask · Put the questions on a separate line at the end, not inside **ต่อไป** (which still holds just 1 thing the user must do) · Skip when the user already asked for a review or sources, asked for a short version, asked to summarise or format a document, or asked what a word means · For health, ask what the doctor needs to know; never name a disease (idea from anthropics/skills `discernment-nudge`, rewritten)
- **Compare expected with actual in 1 line under ผล** (medium tasks and up): `คาด ลูกทีม 3 · รอบ 2 → จริง ลูกทีม 5 · รอบ 3 · token <จาก SUMMARY>` (expected 3 workers · 2 rounds → actual 5 workers · 3 rounds · tokens from SUMMARY) · A gap over 2 times, or the same gap a 2nd time → log it in `LEAD-PLAYBOOK.md`
- **Improvement proposals ≤ 3** and **team adjustments ≤ 3** (learning module) · Leave out if nothing real · Do not act on them until the user orders it
- **Headings**: bold, only those with content, normally 3: **ผล** (done or not, what was gained, evidence · `ข้ามรีวิว:` if review was skipped) · **ที่ทำ** (for several pieces with different statuses use a status table: task · status · who · evidence · status uses 5 words `เสร็จ` `ทำอยู่` `ติด` `รออนุมัติ` `ค้างอยู่`) · **ต่อไป** · add when real content exists: **ตัดสินใจเอง** · **รออนุมัติ** · **ค้างอยู่**
- **One point per bullet** · no nesting · cut: how it was done behind the scenes · problems fixed that do not affect the user · numbers not used for a decision

## Full quality bar (section 4)

**True**: every fact and number comes from the user, a document, or a checked source; if none, put `(รอยืนยัน)` · **On target**: matches the "goal" and "done-when", with unrelated parts cut · **Ready to use**: the user can use it at once with no fixing or guessing · simple per `simplify`
