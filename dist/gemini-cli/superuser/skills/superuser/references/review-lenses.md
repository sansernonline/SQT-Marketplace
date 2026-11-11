# review-lenses — review package · lenses · item-by-item validator gate

Used with [`playbook-review`](playbook-review.md) · `reviewer` · skill `adversarial-review-panel` of plugin superuser · everywhere a fresh reviewer is used.

The one flow in brief: **review package → reviewer holds lenses (checklists) → validator confirms item by item → log dismissed items with reasons → freshness check before reporting.** Reviewers find problems easily. Validators leave only the real ones. The package and the freshness check make everyone look at the same version of the work.

## 1 · Review package

The lead creates the folder `_to_delete/<task folder>/review-<round>/` and puts 4 files in it. The reviewer reads from the files, not from a chat retelling.

| File | Contents | Who reads |
|---|---|---|
| `package.md` | Task name · what the user wrote (the user's words **verbatim**) · conditions from the spec or brief **copied verbatim, never shortened** · "done-when" · paths of the work · skills the work must follow · `head:` commit ID (or file hash) under review · intent in 1 paragraph · for code with tests that is not risky, add a `โหมด test` (test mode) line with the test command and the result before the fix (fails) and after the fix (passes). The reviewer then checks only the diff and runs the tests once (`reviewer` section Test mode) | Every reviewer |
| `diff.patch` | The diff of the work as a file (`git diff <base>`, with the command written at the top of the file) · for non-code work, the list of changed files | Every reviewer |
| `author-notes.md` | The task, constraints, and why the doer chose this path (summarised from `decision-log` · `handoff`) | Only the "challenge intent" round in section 6 |
| `ledger.md` | Findings · confirmation results · dismissed items with reasons (section 4) | Lead · next round |

Package rules:

- **The lead pre-judges nothing.** The prompt to the reviewer gives only the package path, the lenses to hold, and the result format. Phrases like "probably passes now" or "fixed as asked" stay out (reviewers agree with the asker more than they should).
- **In round 1 the reviewer does not see the doer's reasons.** They sit in `author-notes.md`, opened later, because a reviewer who reads the reasons first tends to agree (math-olympiad A20).
- **The reviewer pulls the diff and compares it with the real files.** If the folder does not match the agreed shape (no `head:` · empty diff · files the reviewer finds outside the list), answer `ปฏิเสธ` (reject) with evidence of what is missing or extra, and stop reviewing (claude-security A3).
- **The project's review rules file (if `docs/REVIEW-RULES.md` or a "กติกา review" section in `CONTEXT.md` exists).** Copy it as a separate block in `package.md` named "Extra rules from the project (source: file · line)". The block may only add checks. It cannot reduce or waive the result of other items. Skip files that are symlinks. Regexes the project sets must be simple (no nested `(a+)+`), or skip them and report (security-guidance A12).

## 2 · Lenses

One reviewer holds 1–3 lenses per round. Choose by kind of work. Do not use every lens every time. Each lens answers as a checklist of `PASS` · `FAIL` with `file:line` per item. Anything found outside the lens gets one `OUT-OF-SCOPE` line. The lead reads it and logs it in `ledger.md`, and it does not count as a finding. If it repeats for more than 3 rounds, raise it to a new lens (vsql E14).

| Lens | What it asks | Use when |
|---|---|---|
| `spec` | Every condition in the verbatim-copied package has an implementation and a proof · missing requested parts · parts nobody asked for | Every task with a spec or brief |
| `quality` | Readable · simple · names are accurate · duplicates existing code · consistent with neighbouring pieces · do tests guard what was actually fixed | Every task |
| `silent-failure` | Walk **every spot** that handles an error (catch · fallback · default on failure · swallowed result) and answer spot by spot: does the error reach the user or the log with context · is the catch specific to a type · does the fallback tell the user · are mocks only in tests (pr-review-toolkit A24) | Code · scripts · work that calls other systems |
| `builder-blind` | Read only the design document and play a builder who cannot ask the author. Answer as questions ordered by damage if guessed wrong, or "no important item left" (superpowers B7) | Specs · plans · design documents before building starts |
| `security-reach` · `security-impact` · `security-defense` | The 3 angles of the voters: can the weak point really be reached · if reached, how much damage · is a guard already in place. To confirm, cite `file:line` of the entry point, the failing spot, and the missing guard. Incomplete = not confirmed (claude-security A1) | High-risk work, used through the confirm step in section 3 |
| `visual` | Judge from the pixels of the attached image, never from descriptions. Look for failure signs first (red screen, blank screen, a box or dialog covering content), then compare with the log. Ambiguous = fail. A covering box = retake the shot, not a fail. Evidence names the image file (expo D16) | Screens · slides · images |
| `claims` | Every claim of "works on system X" is labelled `observed` (ran it and saw the result on that system) or `reasoned` (worked out by thought). A wrong or missing label is a finding (claude-remember B13) | PRs · reports that claim across operating systems or machines |

Rule against stale knowledge: a reviewer does not flag a model ID · parameter name · API version as wrong from its own memory, because the real list is newer than its knowledge. Compare against the project's documents or config. If none exist, mark `ยังไม่ได้ตรวจ` (not checked). Skip general style matters that no project rule supports (atomic-agents C22).

## 3 · Item-by-item validator

A finding from a reviewer is only an accusation. An AI reviewer can invent problems that are not real. So every item goes through **1 validator per item** (a fresh `reviewer`, read-only) before entering the report. Several items with the same cause are merged into one before confirming.

The validator receives: 1 finding (where · how it breaks) · the package path · the false-positive list below · **does not receive** the reviewer's name, the severity the reviewer gave, or the reviewer's reasons. The default is `FALSE_POSITIVE`, and only evidence changes it.

The validator answers in 1 line: `ยืนยัน` (confirmed) · `FALSE_POSITIVE` · `มีมาก่อนงานนี้` (pre-existing: truly wrong but not a result of this diff, goes to a separate list) · `ไม่รู้` (don't know), with a confidence score 0–100 and evidence (`file:line` · command → result).

- **Confidence below 80 does not enter the report as `สูง` or `กลาง` (high or medium).** Log it as a `ต่ำ` (low) question or mark `ยังไม่ได้ตรวจ`. This follows the same line as the `reviewer` rule "evidence that can be opened is required".
- High-risk work uses **3 fixed validators**, each with a different `security-*` lens (or the lens that fits the item). The number does not rise or fall with budget, so confidence stays comparable across rounds. The majority wins. Count the result with a table, not by feel.

**False-positive list** (the validator may dismiss an item at once if it falls in this list and has no added evidence):

- A problem that existed before this work and that the diff did not touch
- Anything the linter · type checker · compiler · tests already running would catch (the reviewer need not repeat it)
- General taste or style where the project has no rule
- An item argued from stale knowledge (model ID · parameter name · version) with no project document
- Behaviour changed on purpose and listed in "done-when" or **ตัดสินใจเอง** (own decision)
- A line the doer labelled as intentional with a reason
- A case where breaking it needs an input the system can never actually receive

## 4 · Dismissing needs a reason and a read-back

The right to fix does not cover deciding which finding needs no fix. The lead logs every dismissed item in `ledger.md` with this row:

| Item | Reason (pick 1) | 1-line explanation with evidence |
|---|---|---|
| `#3` | `false_positive` · `intentional` · `deferred` · `rejected` · `มีมาก่อน` (pre-existing) | ... |

`deferred` must say who or what it waits for, and also goes in the `ค้างอยู่` (pending) list of the report. After writing, read the file back and count the rows to match the number of dismissed items (qodo E19).

## 5 · Freshness before reporting

Before acting on review results, compare `head:` in the package with the real state now (`git rev-parse HEAD` or the file hash). Mismatch = stale result. Review again against the current work, or report that it is stale. A reviewer that is still running, failed, or had its result cut off reports as such and never counts as "clean" (qodo E18).

## 6 · Next round

- **Previously found items.** Pull all items from the previous round and sort them into code fix · document fix · question · discussion. Then open the diff after the previous round and see that each item has a real fix that matches the problem, not just the lead writing "fixed". Report unfixed items before starting the new round (datahub C1).
- **Challenge intent.** Only after the first-round reviewer returns, have a fresh reviewer read the first-round report and `author-notes.md` and answer which constraint or reason does not match the spec or has no supporting evidence (qodo E20). It works for a later session that takes over the work, with no need to go back through the chat.

## Sources

- superpowers (MIT) · skills/brainstorming/builder-check-prompt.md · viewed 2026-11-10
- expo · .claude/skills/expo-skill-eval/agents/visual-grader.md · viewed 2026-11-10
- vsql · skills/vsql-extension-builder/SKILL.md · viewed 2026-11-10
- claude-security (All rights reserved · mechanism only) · agents/scan-verifier.md · agents/patch-verifier.md · viewed 2026-11-10
- security-guidance · hooks/extensibility.py · viewed 2026-11-10
- datahub · agents/comment-resolution-checker.md · viewed 2026-11-10
- math-olympiad · skills/math-olympiad/SKILL.md · viewed 2026-11-10
- pr-review-toolkit · agents/silent-failure-hunter.md · viewed 2026-11-10
- claude-remember (no redistribution · mechanism only) · CONTRIBUTING.md · viewed 2026-11-10
- atomic-agents · claude-plugin/atomic-agents/agents/atomic-reviewer.md · viewed 2026-11-10
- qodo · skills/qodo-review-resolver/SKILL.md · skills/qodo-review/references/local-triage.md · skills/qodo-review-notes/SKILL.md · viewed 2026-11-10
- code-review (Anthropic) · item-by-item validator · threshold 80 · false-positive list · viewed 2026-11-10
- superpowers (MIT) · review package and the 2-sided verdict, spec and quality · viewed 2026-11-10
