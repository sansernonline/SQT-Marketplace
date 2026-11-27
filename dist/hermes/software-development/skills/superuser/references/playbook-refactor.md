# playbook · refactor — change the structure, behavior stays the same

Use when: moving files · splitting a module · renaming across the system · collapsing unnecessary layers · changing an internal API (moving a screen whose look must stay the same → `visual-parity`)
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/code.md`](../../dev-principles/references/code.md) · [`references/architecture-api.md`](../../dev-principles/references/architecture-api.md)
Main skills: [`code-craft`](../../code-craft/SKILL.md) · the skill for the stack · `git-and-review` · `ground-rules/principle-build-a-tool-not-handwork`

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle files [`references/code.md`](../../dev-principles/references/code.md) · [`references/architecture-api.md`](../../dev-principles/references/architecture-api.md) first. Write the behaviour that must stay the same as a checkable list, then check (ตรวจ) that a test or app-check skill covers it. If not, add a test that locks the existing behaviour before touching the code (ตัดสินผลตาม [`references/code.md`](../../dev-principles/references/code.md) · [`references/architecture-api.md`](../../dev-principles/references/architecture-api.md)) · ใคร: `qa-tester` ตัวใหม่
2. Record the result before the change — the whole test suite · screenshots or outputs to compare against · ใคร: `qa-tester` ตัวใหม่
3. Delete dead code and layers with only one caller first · ใคร: `developer` ตัวใหม่
4. Where the same pattern needs fixing in many places, use a tool per `ground-rules/principle-build-a-tool-not-handwork` · ใคร: `developer` ตัวใหม่
5. If there is a new internal API, move every caller over, then delete the old one per [`code-craft`](../../code-craft/SKILL.md) · ใคร: `developer` ตัวใหม่
6. Find the impact outside the changed spot per [`code-craft`](../../code-craft/SKILL.md) — indirect callers · data already saved · systems outside the repo · ใคร: `Explore` ตัวใหม่
7. Run (รัน) the original test suite and compare the result with step 2 — every item must match · ใคร: `qa-tester` ตัวใหม่
8. Check (ตรวจ) the diff per `git-and-review` — behaviour is unchanged per the list in step 1, the result of step 7 matches step 2, and nothing new snuck in · if it fails → a fresh `developer` fixes, then repeat per the review rounds in [`team-roles`](team-roles.md) (ตัดสินผลตาม [`references/code.md`](../../dev-principles/references/code.md) · [`references/architecture-api.md`](../../dev-principles/references/architecture-api.md)) · ใคร: `reviewer` ตัวใหม่
9. Deliver per the commit rules in `superuser` section 6, each piece must pass tests, then finish with `superuser/status-report` · ใคร: หัวหน้าทีม

## Done when

The same test suite passes as before · the outputs compared in step 2 match · the total line count in the diff went down, or there is a clear reason why it did not
