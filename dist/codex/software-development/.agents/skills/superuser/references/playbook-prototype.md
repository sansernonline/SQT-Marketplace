# playbook · prototype — experiment, and let the run result decide

Use when: you are about to ask a person "which one is better?" but the answer can be seen by running it — speed · looks · behavior · output
Do not use when: it is a matter of taste or a business decision that an experiment cannot settle — ask a person for that
Main principles: [`dev-principles`](../../dev-principles/SKILL.md) · [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md)
Main skills: `code-craft` · `test-automation` · `decision-desk/decision-log`

## ขั้นตอน · Steps (copy into the todo as written)

1. Open the principle files [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md) first. Before starting, write the question the experiment will answer, and the deciding criterion as a number or something visible · ใคร: หัวหน้าทีม
2. Build 2–3 options, each as small as can still answer the question, in `_to_delete/prototype-<topic>/`. If the options are many or large, use `handoff/parallel-attempts-pick-best` · ใคร: `developer` ตัวใหม่ one per option (if it is not yet known which options to try: `brainstormer` ตัวใหม่ proposes first)
3. Run every option with the same way of measuring — the same data, the same machine — and record the raw results · ใคร: `qa-tester` ตัวใหม่
4. Decide by the criterion from step 1. If the result is close, choose the option with less code that is easier to change later · ใคร: หัวหน้าทีม
5. Check (ตรวจ) the decision — the numbers really come from the raw results in step 3, every option was measured the same way, and the criterion matches step 1 (ตัดสินผลตาม [`references/code.md`](../../dev-principles/references/code.md) · [`references/testing.md`](../../dev-principles/references/testing.md)) · ใคร: `reviewer` ตัวใหม่
6. Record the result in `decision-desk/decision-log` — chosen · not chosen · the measured numbers · ใคร: หัวหน้าทีม
7. Return to the original playbook with the winning option, but do not move the experiment code straight into the project · ใคร: หัวหน้าทีม

## Done when

There are numbers or a side-by-side picture that answer the step 1 question, and the decision is recorded
