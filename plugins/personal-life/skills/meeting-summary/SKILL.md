---
name: meeting-summary
description: Use right after a meeting, or when given notes or a transcript — writes a short summary of decisions, action items with owner and due date, and open questions, or formal Thai minutes (รายงานการประชุม).
---

# Meeting Summary

The meeting did not happen unless the summary exists. Write it within the hour, while memory is fresh.

Formal Thai minutes template: [references/thai-minutes-template.md](references/thai-minutes-template.md).

## Choose the format

| Situation | Format |
|---|---|
| Team, project, client working session | **Short summary** (below) — one page |
| Committee, board, juristic-person meeting (นิติบุคคลอาคารชุด/หมู่บ้าน), school committee, government-facing | **รายงานการประชุม** — formal agenda (วาระ) structure in the reference |
| 1:1 or personal (doctor, landlord, bank) | 5-line note: date, who, what was said, what I agreed, next step |

## Workflow

1. **Collect inputs** — your prep card (`meeting-prep-card`), notes, chat, transcript or recording text.
2. **Extract decisions** — one line each, in past tense ("Approved vendor B at 120,000 บาท"). No decision → write "No decision; next step is …".
3. **Extract actions** — owner (one person, not a team) + due date + verb-first task. Missing owner or date → mark `[owner?]` / `[date?]` and list them at the top.
4. **Open questions** — what is unresolved, who will answer, by when.
5. **Check numbers and names** against the source — amounts, dates, spelling of names and titles (คุณ / ดร. / ผศ.).
6. **File** — append to the meeting's running note, or create `YYYY-MM-DD_topic_summary.md`.
7. **Send only if asked or if you own the meeting** — with a line "please reply by [date] if anything is wrong"; silence = accepted.
8. **Next meeting opens with the action table** — status of each item.

## Short summary template

```markdown
# [Topic] — YYYY-MM-DD
Attendees: ___ · Absent: ___ · Notes by: ___

## Decisions
- ___

## Action items
| # | Task | Owner | Due | Status |
|---|---|---|---|---|
| 1 | | | | open |

## Open questions
- ___ (who answers, by when)

## Next meeting
Date · what must be ready
```

## Transcript handling

- Summarise what was **decided and assigned**, not who said what; quote only when wording matters (commitments, prices)
- Remove side talk, personal comments and anything sensitive (health, salaries) unless it is the subject
- If the transcript is auto-generated, names and numbers are the most common errors — flag uncertain ones `[check]`

## Worked example

Input: 40-minute condo juristic committee notes. Output (short version for residents' LINE group, formal minutes filed separately):
- Decisions: Approved lift repair by vendor B, 185,000 บาท from the reserve fund. Pool closed 1–15 Nov for retiling.
- Actions: 1) Sign contract with vendor B — Khun Somchai (manager) — 2026-10-15. 2) Post pool notice — Khun Ann — 2026-10-10. 3) Three quotes for CCTV — `[owner?]` — 2026-11-01.
- Open: whether owners in arrears can vote at the AGM — legal adviser to answer by 2026-10-20.

## Rules

- One page maximum; if it needs more, the meeting needed better scoping
- Write for the person who was not there
- Language follows the meeting; bilingual teams get Thai decisions + English actions only if asked
- The file is the source of truth; chat posts link to it

Related: `meeting-prep-card` (before) · `weekly-review` (collects your actions) · `polite-message-th-en` (chasing actions).
