# skill: adversarial-review-panel

Use for an adversarial review or stress test before shipping

# adversarial-review-panel — a review panel that deliberately hunts for faults

> A single reviewer sees only one angle. A panel told to "try to break it," each from a different angle, catches what one person overlooks.
> The output is a verdict, **not a fix to the work.**

The line between this and [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md): the panel attacks 1 finished piece of work before shipping · if there is no work yet, or you do not know which form is best (plan · design · draft), build several versions and choose with pick-best first.

## Steps

1. **Scope**: what will be reviewed, such as a document · plan · research result · product list · the set of files created or changed this round, including neighboring items that must be read alongside.
2. **Package and intent**: build the review package by [`review-lenses`](../superuser/references/review-lenses.md) item 1 (diff as a file · spec conditions quoted verbatim · a `head:` code), then write a 1-paragraph intent saying what the work means to do, from the request · the work log · the work itself. If unsure, choose the interpretation with the least impact and note it in the [`decision-log`](../decision-log/SKILL.md) without stopping to ask.
3. **Form a panel of 3 with different angles** (each is a fresh read-only `reviewer` agent · for a single low-risk piece 1 `reviewer` is enough). In Claude Code every model comes from the same vendor, so the difference must come from the angle assigned and from mixing model sizes.

   | Reviewer | Angle | Model tier |
   |---|---|---|
   | A | Correctness: wrong facts · numbers that do not match · edge cases · empty data | large |
   | B | Risk and data: personal data · secrets · permissions · money or irreversible actions · legal or contract terms violated | large |
   | C | Simplicity and next users: what is more than needed · self-contradiction · misleading words or names · where a real reader or customer would get stuck | medium |

   For code work (scope from git · extra angles for each reviewer · mobile apps) → the add-on in plugin `software-development` → `superuser` → `references/code-extensions.md`.

   **A reviewer from another vendor (if available)**: if the machine has the Command-Line Interface (CLI) of another vendor's model installed (such as `codex` · `gemini`), use it in place of reviewer C, with the same prompt and angle, in read-only mode, because models from different vendors may miss different things (no measured evidence yet that it beats a single vendor). But **the work content is sent out to that provider**, so use it only when permitted in advance in `~/.claude/superuser-style.md` or `docs/AGENT-LOOP.md`. If there is no CLI or no permission, use the single-vendor panel in the table.

   What matters for independence is that **the answer comes from the real original**, not the model brand (a judge that wrote its exam before the app existed still needed rerunning against the real original).

4. **Launch all at once in one message, read-only**: everyone gets the same package and intent paths and differs only in angle (each person's angle is the lens in `review-lenses` item 2) · the prompt holds no opinion from the team lead on whether the work is good. Send results as a table `| ปัญหา | ที่ไหน (หน้า · ข้อ · ไฟล์:บรรทัด) | ทำให้พังอย่างไร (ขั้นตอนหรือ input) | ความรุนแรง |` (problem · where (page · item · file:line) · how it breaks (steps or input) · severity), at most 40 lines per person, and **no editing files.**
5. **Verify every finding, one at a time**: 1 verifier per finding (a fresh `reviewer`, default `FALSE_POSITIVE`, confidence below 80 stays out of the report, per `review-lenses` item 3) who checks against the real original or runs it to show it. A finding that cannot be verified gets `PLAUSIBLE` (possible but not yet proven) or is dropped with a reason. For `PLAUSIBLE` items, decide yourself by choosing the path with the least impact and note it in the log, except matters on the `superuser` "awaiting approval" (`รออนุมัติ`) list (deleting or overwriting the user's things · commit/push · sending off the machine): prepare those and note them in the log, but do not do them yourself.
6. **Cross-examination (only for high-risk work, or when the 3 tables contradict)**: the 3 voters are **always fixed at 3**, never reduced or increased by budget, so confidence is comparable across rounds · each holds a different lens: `security-reach` · `security-impact` · `security-defense` (or the lens that fits the item) · to confirm, a voter must cite the `file:line` of the entry point, the breaking spot and the missing guard, and an incomplete citation counts as not confirmed · merge the 3 tables into 1, strip the finders' names, and send it back to each reviewer (the same instance through `SendMessage`, no need to reread files), who answers item by item `ยืนยัน` (confirm) · `ค้าน` (object, with a reason or the step that makes it not break) · `ไม่รู้` (do not know) · `PLAUSIBLE` items from step 5 join this round too · normal work skips this step, because it is another 3 rounds of tokens.
7. **Weight into 4 groups**: `ยืนยันข้าม` (cross-confirmed: 2 or more found it independently) > `เห็นพ้อง` (agreed: 1 found it, and after cross-examination others confirmed) > `คนเดียว` (single: nobody objected but nobody confirmed · true only when a clear breaking step exists) > `ขัดแย้ง` (disputed: someone objected, and the team lead decides from the original without counting votes) · with no cross-examination there are only `ยืนยันข้าม` and `คนเดียว` · opinions about taste are only observations in every group.
8. **Verdict**: before writing, compare `head:` in the package with the real one. If it does not match, or a reviewer failed, is still running, or had its result cut, report it that way and never count it as clean · 1 line: `ส่งได้` (can ship) · `ส่งได้หลังแก้` (can ship after fixes) · `ยังไม่ควรส่ง` (should not ship yet), followed by the list: high · medium · low (by the definitions in `reviewer`), each item naming its group from step 7 · items dismissed are recorded in `ledger.md` with a reason from the list in `review-lenses` item 4.
9. Ordering the fixes is the job of the user or a playbook. This skill stops at the verdict.

## Cautions

- A panel uses about 3 times the tokens of a single `reviewer`. Choose a panel when the price of a miss × the chance of a miss is more than the cost of 2 extra reviewers (compute with `decision-scoring`, command `review`) · if you cannot estimate, use the default (not yet measured): work sent to outsiders, money, law, health, or choosing an irreversible path → a 3-angle panel · everything else → a single `reviewer` · for code work see `code-review-checklist` · `pr-description-template` (plugin `software-development`).
- An Artificial Intelligence (AI) reviewer can also report problems that do not exist, so every finding must pass step 5 before entering the report.

## References

- [`references/sources.md`](references/sources.md) — where the mechanisms come from (viewed 2026-11-10); for other details see `review-lenses`, section "Sources"


## reference: sources.md

# Sources · adversarial-review-panel

## Sources

3-lens voters, default false positive · claude-security (All rights reserved · mechanism only) · agents/scan-verifier.md · viewed 2026-11-10 · one-by-one verifiers · code-review (Anthropic) · viewed 2026-11-10 · freshness of review results · qodo · skills/qodo-review-resolver/SKILL.md · viewed 2026-11-10 · for other details see `review-lenses`, section "Sources"
