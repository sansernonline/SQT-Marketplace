# playbook · feature — add or change behavior

Use when: a new feature · changing existing behavior · following requirements in an SRS or FSD
Main skills: [`code-orientation`](../../code-orientation/SKILL.md) · the skill for the stack (`stack-dotnet` · `stack-typescript` · `stack-python` · `stack-sql`) · `lazy-coding` · `readable-code` · `testing-standards` · `spec-to-code-loop` (if there are several requirements)

## ขั้นตอน · Steps (copy into the todo as written)

1. Read the relevant requirements (`docs/srs.md` · `docs/fsd-*.md` · mockup), then run [`code-orientation`](../../code-orientation/SKILL.md) on the part you will touch to get a 10-line map, then open the skill for the project's stack · ใคร: หัวหน้าทีม (unclear brief: `brainstormer` ตัวใหม่)
2. **State the data shape first** — the types · tables · state this feature creates or changes, written as code or a short table in the reply · ใคร: หัวหน้าทีม
   - Split into 3 layers (input → business rules → storage)
   - If it touches outside input · login · files · money · personal data, open [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md). For a feature exposed to the outside, send a fresh `security-engineer` to do STRIDE per `threat-model/references/security-templates.md` before writing (or ask the user to run `/software-development:threat-model` themselves, because only the user can call that skill)
   - Web app or API → follow the "must have" column of [`security-gate` OWASP section](../../security-gate/references/owasp-top10.md) for the parts the feature touches, and write tests per the "prove with" column (test names start with the item ID, such as `A01_`)
3. If the feature crosses several modules, draft the function signatures and file locations before writing the body. If several approaches are still equally good, use `crew-patterns/parallel-attempts-pick-best` or the `prototype` playbook · ใคร: หัวหน้าทีม (several equally good approaches: `developer` ตัวใหม่ one per approach)
4. At the spot you will touch, delete what is unused first, then add ([`principle-replace-then-delete`](../../principle-replace-then-delete/SKILL.md)) · ใคร: `developer` ตัวใหม่
5. Split the work into small pieces that can be checked one by one, each piece 1 requirement or 1 screen, then send each piece to a `developer` agent ตัวใหม่ with the map from step 1, the file locations, and the pass criteria · Pieces that do not wait on each other (different files · different modules) go out together in one message, even if each is short · ใคร: `developer` ตัวใหม่ per piece
   - **Test before code** for a piece with logic (calculation · conditions · state): write a test that fails → run it and see it red → write the code until green → clean up. For a pure screen piece, check with the app-checking skill instead.
6. Check (ตรวจ) every piece before moving to the piece that waits on it — that piece's tests must pass, and click through the real app with the project's app-check skill · ใคร: `qa-tester` ตัวใหม่
   - **Every new behavior and every decision you made yourself needs at least 1 test that locks it in**, and the test must fail when the code is wrong (`ground-rules/principle-prove-it-works`)
7. **Check (ตรวจ) by review before saying done — do not skip.** Small diff: correctness and edge cases · much logic or state: `crew-patterns/adversarial-review-panel` with at least 2 angles, correctness and simplicity. If a dependency is added or a risky area is touched, also pass it through [`security-gate`](../../security-gate/SKILL.md) · ใคร: `reviewer` ตัวใหม่ (much logic: `reviewer` ตัวใหม่ per angle · risky area: `security-engineer` ตัวใหม่ อ่านอย่างเดียว · ไม่แก้ไฟล์)
   - All tests passing does not mean there are no bugs — for every finding the review confirmed, write a failing test first, then fix
   - A screen that has a mockup or must match the old system ends its check with playbook `visual-parity`
8. Fix the findings the lead has confirmed — write the failing test first, then fix · ใคร: `developer` ตัวใหม่
9. Check (ตรวจ) again — look at every earlier finding and every changed spot, and repeat until no `สูง` (high) or `กลาง` (medium) finding is left, per [`team-roles`](team-roles.md) · ใคร: `reviewer` ตัวใหม่
10. When everything passes, deliver per the commit rules in `superuser` section 6, open a PR (`pr-description-template`) when the user asks, then finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Common excuses — read before skipping a step

| Excuse | Reality |
|---|---|
| "Too simple to need a test" | Simple code breaks too · a test takes half a minute |
| "I can write the tests later" | A test written after the code passes at once. You never saw it red, so it does not prove it can catch the bug |
| "I clicked through it myself and it works" | There is no record of what was clicked, so it cannot be re-run · when the code changes you must click everything again |
| "It's written already, a pity to delete it" | That time is gone either way · what costs more is keeping code you cannot trust |
| "The test is hard to write, so skip it for now" | A hard test = hard to use · take it as a signal and fix the design |
| "Run the whole suite once at the end" | Running per piece is how you learn which piece broke it · the final run is the contract, not a substitute |

## Done when

Every pass criterion of the requirements has evidence — a test that actually ran, or a click-through on the real app with the result seen
