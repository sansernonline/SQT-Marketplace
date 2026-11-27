# Oracle, structure comparison and mutation — use when an existing system is available to compare against

Source: lessons from a 6-chapter web-clone course (Week 03 of Teaching_CWN2026), measured on 5 app versions · the numbers are results of that job, used as examples, not as criteria · content specific to the cloned website (flight data, container ports) is not carried over.

## 1 · Use the existing system as the answer key (differential testing)

Run the same scenario on the existing system and on our app, then compare the results field by field, instead of writing expected values by hand.

- The result passes only if every compared field matches (example: count + price + name + time, position by position).
- Fetch expected values from the existing system at run time; do not hard-code numbers in the comparison code, except parameters that come from the task.
- For a scenario the existing system cannot answer itself, an **inferred answer key** (computed by yourself) may be used, but first prove the method on cases that have a real answer key · if the order cannot be trusted, judge by count and data set · say plainly that the criterion is weaker (real round: S2 passed even though it had 10 tickets).
- Report a difference as position, row, field, not just "failed" · in the real round, 4 scenarios had one cause, fixed in one place (310 lines of data, 7 lines of code), going from 4/8 → 8/8.
- Remove what is meant to differ before comparing (banners, brand names, links to other domains, mock-data labels).

### If you must record and replay (record-replay), keep the existing system stable

| Trap | Do |
|---|---|
| The URL does not match the recorded one character for character (`+` vs `%20`) | `routeFromHAR` matches URL + method + body exactly · you need your own route for the cases that do not match |
| Random values in the URL or body | match POST by body and pick stable keys |
| Results differ every round | freeze the clock (`context.clock.setFixedTime`) · turn off telemetry · cut the network with a last-layer abort |
| Counting rows while the filter box is still open | wait for the count to settle before counting |
| Route order | Playwright tries the one registered later first |
| No recording file | never open the real live site instead; stability is lost |

- Check that it is really stable by running 3 rounds and getting the same result.
- Limit: it can answer only what was recorded; for full coverage, record every scenario first.
- The recording file contains cookies and tokens: do not commit it and do not take it off the machine.

## 2 · Compare page structure with the accessibility tree (`ariaSnapshot`)

Pixel comparison is brittle and can mislead (matching white backgrounds). Structure comparison tells you "what is missing" as a list.

1. Capture the page in the same state.
2. Remove what is meant to differ before comparing (banners, links to other domains, brand names, mock-data labels).
3. Normalize names: strip symbols, turn numbers into `#`.
4. Make `role | name` tokens (button, combobox, textbox can count as one control kind).
5. Compute the Jaccard score of the tokens (intersection ÷ union).
6. Check a list of key elements chosen from the existing system (38 items in the real round) · the existing system must pass all of them first, otherwise the list itself is wrong.
7. Total score = average of the two · give the result as a list of what is still missing.

Caution: Thai has no spaces, so splitting by whitespace fails; use `Intl.Segmenter('th')` · half of the score depends on the list you chose yourself.

## 3 · Mutation testing — examine the test suite with deliberate bugs

Plant bugs one at a time in an app that already passes, then see whether the test suite catches them.

**Count "caught" as pass → fail against the baseline, not "at least 1 failure".** If the baseline already has a red test, the latter criterion passes automatically (real round: raw score 10/10 for both suites, but the strict criterion gave acceptance 8/10 and differential 4/10 · the survivors survived because the related test was already red) · make the baseline green first, then the score can be read.

Steps:

1. Copy the base code to `mutants/base` · write `manifest.json` holding the before and after text of every bug (file + line) · change 1 spot per bug, never combined.
2. Run the baseline first and record the set of failing tests.
3. Per bug: create a compose project with a separate name → wait for the health endpoint (loop with a limited count) → run every test suite → always `down -v --remove-orphans` in `finally`.
4. Do not edit tests to point at a new target; wrap them: load `endpoint.cjs` with `node --require` to change only the baseURL · or write an extra runner that calls the same scenarios.
5. Compute both the raw criterion and the pass → fail criterion · record the additionally failing tests one by one.
6. Check the SHA-256 of the test files before and after · generate the report from a script, not by hand.
7. Tell the user the duration in advance (real round: 11 rounds × 2 suites took 46 minutes because Docker is built every round).

Bugs worth having: reversed sorting · turning off filters one at a time · result count short by 1 · load-more ending at 299 · `<` instead of `≤` · time shifted by 1 hour · wrong code.

Observations:
- The surviving bug was `<` instead of `≤`, because the boundary value was not in the test data; a dedicated boundary-value test is needed.
- Different kinds of suites catch different groups of bugs (acceptance catches several data bugs that differential cannot newly catch, while differential tells the wrong row and field) · use them together.
- 80% and 40% are lower bounds; they do not mean that a bug with no newly failing test certainly slipped through.
- The real round has not yet re-run mutation against the version where differential is green, and had only 10 bugs.

## 4 · Reusable runner

- 1 test per item · a fresh context for every test · no retry · no lowering of criteria · never edit a test.
- Keep it inside the scope: a route cancels navigate requests across origins.
- Locators must be specific: in the real round, a test that passed because it saw only 10 rows broke at once when the data was complete and it found 2 rows.
- Set an evidence-mode switch (e.g. `EVIDENCE=1`): normally run fast with many workers and no video; evidence mode lowers workers, raises timeouts and records video.
- A neutral element finder (control/choice) that supports both `select` and a tap menu lets one test suite run against two apps written differently · the projects differ only in `baseURL`.
- A test must not add things it does not delete (creating a new booking on every run = not idempotent).
- A popup that blocks a click needs a step that closes the popup first · look at the screenshot and snapshot of the failed test, not only the error text (real round: "cannot click the button" was really a popup blocking; root cause: a re-render removed the Escape key listener).
- Measuring an empty page and waiting for the timeout at every step took 24 minutes; it should fail fast.
