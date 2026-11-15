# A loop that tunes to a number

Moved from SKILL.md section 10 (2026-11-10) · open it when the loop chases a metric rather than closing requirements one by one.


Use this when the loop does not close requirements one by one but chases a metric, such as matching the old system, matching a mockup, or a measurable score. Source: the lessons from cloning a website in 6 chapters (Week 03 of Teaching_CWN2026), measured on a real app with chained versions. The numbers below are results from that job. Use them as examples, not as criteria.

**The loop contract is written before you start, and a machine can check it. It is not just a request.**

| Part | Write |
|---|---|
| Start state | An empty folder, or the tag from the previous round |
| Scope | Which files may change · checked by a script that reads `git diff` |
| Metric | One command that gives pass/fail and a number · exit 2 = could not measure, kept separate from "fail" and not counted against the budget |
| Keep rule | Keep the change when it passes the overall bar, or when more sub-units pass without the main metric dropping · if not, `git revert` |
| Stop rule | The set number of rounds is used up, or a ceiling is reached (see below) |
| Budget | Number of rounds, and time per round |

**Rules found to be necessary**

- **No going backwards.** You may add one item, and the others that passed before must still pass.
- **Count in sub-units.** Going from 27 of 31 items passing to 30 is measurable and keeps the work, even if the overall bar is not yet met.
- **A data ceiling is not a failure.** If an item can be fixed only by adding fake data, editing the test, or hiding content, stop chasing it and report it as a ceiling (real round: 74 of 82 items).
- **Separate where the score came from.** A score that jumps may come from adding data before the loop, not from looping (real round: 51 → 73 from data, the loop itself added 1 item).
- **The builder does not read the source of the test or the answer key.** It may only see the result report, and it does not bind to identifiers that the test itself defines. (There is no evidence that using a different model reduces shared error, so it is not a rule.)
- **A judge's test must pass against the original before it counts in the gate.** A test that fails because it was written wrongly can be fixed once. A test that fails because the original changed, or because it cannot be checked through the screen, gets an invalid label with a reason and is not counted. (Example from that job: a judge from another vendor wrote 47 items, 25 invalid (53%), leaving 22 valid.) What helps is "the answer comes from the original", not the model's vendor: data that was wrong on both sides (matching the live screen in only 278 of 300 items) was caught because the tests were rerun against the live original. There was no control group, so we do not yet know how much the model's vendor matters. For how to make a test trustworthy see `test-evidence` item 5 (not repeated here).
- **The lead re-measures every number itself after the round ends.** Do not trust the report of the agent that made the fix.

**Lock the structure first, then tune the look** (colours, spacing, sizes)

1. Step 1 builds the full structure and content, with all look values referencing variables in a single values file. No numbers or colours are written directly in other files.
2. Lock: a hash of the settled structure tree · a script checks `git diff` that step 2 touches only the values file · no variable name may be added or removed.
3. Step 2 tunes only the values in that file · the quick metric must match the full metric pixel for pixel before starting and after every build (a real round once drifted, 51,960 versus 53,255, because of font weight).

Reason: structure moves the number by about 18 points, and the look by about 2–3 points. Limit: you can tune only continuous values. If the layout is wrong (the first row is at y=602 where the original is near 399), step 2 cannot reach it, so check the layout before locking.

**Guards that stop the machine from cheating the number (Goodhart)**: in a trial round the optimizer lowered the visual diff by pushing content off-screen, changing text colour to blend into the image, and squeezing input fields until city names were cut off.

| Guard | What it prevents |
|---|---|
| Text ≥ 12 px · contrast ≥ 4.5:1 · no cutting mid-word | Shrinking, fading, or hiding text |
| The first row is on the first screen, within 150 px of its position when locked | Pushing content off-screen |
| Text colour is a neutral colour (saturation ≤ 20%) | Recolouring text to blend in |
| Text in input fields does not overflow (`scrollWidth ≤ clientWidth`) | Squeezing input fields |
| Do not change the font family to monospace or a display font to lower the diff · a person looks at the real image before accepting | The earlier guards all passed, but the optimizer chose a monospace font because it gave the lowest diff, and the builder said it looked like a typewriter |
| The order of font sizes must stay the same | Flattening the type hierarchy (real round: md/lg/xl all became 17, which the earlier guards did not see) |

- The guards' baseline comes from the values at lock time, not from fixed numbers. An element missing from the baseline must **fail**, not be skipped.
- The final set of values must pass on screens or data that were never used for tuning (the real round tuned on a 1366×900 screen only).
- For a guard where a change in look needs a person to decide (moving text, hiding a price range), ask the user whether it is acceptable. Do not decide yourself.

**Commands in the loop always use `cd X && cmd` or full paths.** Once, a `cd` failed and `sed` edited about 20 files outside the scope (including 4 files in the toolkit). Keep a hash of the toolkit folder (`kit/`) as a manifest and compare it after every round.

The tests and metrics of a loop like this must be trustworthy first → `test-evidence` item 5
