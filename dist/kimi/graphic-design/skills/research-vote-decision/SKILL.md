---
name: research-vote-decision
description: Use when settling open items (รอยืนยัน · TBD) by research and a vote
---

# research-vote-decision — settle open items by research, comparison and a vote

> **One rule:** an open item is closed only with a record a person can check: options · evidence from ≥ 3 independent sources · a vote · the choice · where it was applied. Money, law, price, license and budget items are decided the same way (plus a `payoff` table) and applied; none is sent back to the user as a question.

This skill is the end-to-end flow. It reuses the parts that already exist and does not repeat them: evidence rules → `research-with-sources` · numeric scoring → `decision-scoring` · the 3-voter procedure → [`superuser/references/voting.md`](../superuser/references/voting.md) · the decision table → `decision-log`.

## Use when
- A document has open items: `(รอยืนยัน)` · TBD · "ยังไม่ได้ตัดสินใจ" · a "ข้อที่รอยืนยัน" table · Q1..Qn
- The user says "เลือกมาให้เลย" · "ตัดสินให้หน่อย" · "pick for me" · "decide from research"
- Choosing a language · framework · host · vendor · limit · target · policy value for a spec

Not for: one fact with no options → `research-with-sources` · options already have numbers and only need ranking → `decision-scoring` · a small reversible detail (a file name · heading order) → choose yourself and log it per `decision-log` · taste (color · tone · layout · report format) → vote it like any other item; the owner reviews the result and may answer `คงไว้` or change it.

## Steps
1. **Collect every open item in one pass.** Search the document (and files that cite it) loosely for `รอยืนยัน` · `TBD` · `Q<n>`; count matches against your list before going on. One decision sheet covers all items.
2. **Frame each item:** what is decided · which requirement IDs or files use it · 2–4 real options (always include the current value and at least 1 option found by research) · the owner's default if `~/.claude/superuser-style.md` or the project has one.
3. **Set criteria from the user's context first** (goals · budget · stack and skills they already have · other projects that must fit), then general ones (cost · risk · maturity · effort · how easy to undo). At most 5.
4. **Research each item** per `research-with-sources`: official source first · ≥ 3 independent sources for the deciding facts · copies of one claim count once · look for evidence **against** the leading option too · date every number that changes. Split items across fresh agents in one message when there are 3 or more (`parallel-split-and-merge`).
5. **Compare** in one table per item: options × criteria, each cell a fact with its source, not an adjective. If every criterion is a number, run `decision-scoring` `score` and paste its table.
6. **Vote** per [`voting.md`](../superuser/references/voting.md): 3 fresh voters in one message (cost · risk and safety · fast to deliver and easy to undo), blind to each other. Majority wins. Money · law · health · irreversible → also a `payoff` table. Split vote, unclear evidence, or vote and regret disagree → take the option that loses least if wrong (stricter · pays less · easy to undo). Then apply it; never park it as "confirm when the time comes".
7. **Pass rule:** the winner needs ≥ 3 independent sources pointing the same way. Fewer → keep `(รอยืนยัน)`, say what is missing, and do not fill the value.
8. **Apply everywhere.** Replace the value in every place it appears (requirements · business rules · test-case ranges · traceability · open-item table), then search again for the old value: 0 hits outside the history line. Add a version line. "Everywhere" also means the things built from the docs: change the mockup screens themselves (a to-do list written into the spec is not applied; prove it in a browser) · update test-case workbooks · re-render kept deliverables (.docx/.pdf) whose source changed, under the new version number, and view every page.
9. **Record** each item as `D<n>` in the document's decision section (format below) and add 1 row per item to `decision-log`.
10. **Report** 1 table: `D<n>` · choice · 1-line reason · vote result. Not the full research. Put the decisions under **ตัดสินใจเอง**; the owner can change a `D<n>` later without being asked.
11. **Ask nothing; decide.** Task order · feature scope · format · screens · numbers · price · budget · spending level · policy (license) · legal reading are voted, not asked; "where is X" is searched on the machine and the real system read-only, not asked. Only 2 things reach the owner, as notices under **รออนุมัติ**, not questions: (a) an action only the owner can do (bind a card · enter a password or key · sign · log in) (b) an irreversible action the safety rules require approval for before it runs (delete or overwrite user files · send off the machine · place a real money order) — marked `ยืนยันก่อน`, which means approval of that action only, never of a decision. A fact missing from the machine, the web and the docs → a stand-in from the docs labelled `(รอยืนยัน)`, never a guess. Do not end the report with "tell me if you want a change" or a list of questions. Each notice line:
    - the action in plain words · what the owner does (the card, key or file to supply · the button to approve)
    - what it unlocks (the IDs or milestone) · what runs in the meantime (the stand-in or the decided value)
    - merge notices that share one action (one account setup, not 3 lines) · leave out values that will be measured on the real system later; say they wait for the measurement

## Decision record

```markdown
### D<n> <topic> → <choice>

| Option | Votes | Why |
|---|---|---|
| <option> | n | <1-line fact with its source> |
| **<winner>** | **n** | <1-line fact> |

Sources (≥ 3 pointing the same way):
- <claim in plain words> → <URL> · <date viewed>
- Payoff (money · law · irreversible): <worst-regret cell per option> → <option chosen>
```

## Check before done
- Open-item count before = items decided + items still `(รอยืนยัน)` with the reason
- Every winner has ≥ 3 independent sources, at least 1 official, each with a date
- Old values: 0 hits outside the history line · version line added
- Every decision is applied and listed under **ตัดสินใจเอง** with its `D<n>`; none is left as a question
- Mockups, test-case workbooks and rendered deliverables that use a changed value were updated and checked, not only the .md
- Notices left: only owner-only actions and action approvals (`ยืนยันก่อน`), each with what the owner does, what it unlocks and what runs meanwhile; no questions, no "tell me if you want a change"
