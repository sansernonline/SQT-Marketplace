---
name: test-automation
description: Use for automated, end-to-end or load tests and app verifiers
---

# test-automation — tests the team trusts, load tests with permission, and an app the agent can run

> **One rule:** a test is only worth keeping when people trust its result, and no load test or real-app run may touch a system, database or payment that you are not allowed to use.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Which commit broke the tests?", "the suite was green last week" | [`scripts/culprit.mjs`](scripts/culprit.mjs) `--good <commit> --test "<cmd>"` · finds the first bad commit in a temporary worktree and names its card · "two agents ran heavy tests and the machine froze" → wrap heavy runs in [`scripts/test-lock.mjs`](scripts/test-lock.mjs) `-- <cmd>` (one at a time per machine) |
| "Set up tests", "tests are flaky", "what should a good test look like?" | [`references/testing-standards.md`](references/testing-standards.md) |
| "Write end-to-end tests", "the browser test keeps failing" | [`references/e2e-testing-patterns.md`](references/e2e-testing-patterns.md) |
| "How many users can it hold?", "will it be slow at peak?" | [`references/load-testing.md`](references/load-testing.md) |
| "Let the agent run the app and check", no script to start the app, or the verifier is out of date | [`references/app-verifier-setup.md`](references/app-verifier-setup.md) |

Other references in this folder: [`flaky-tests.md`](references/flaky-tests.md) · [`page-object-model.md`](references/page-object-model.md) · [`test-data-strategies.md`](references/test-data-strategies.md) · [`per-stack.md`](references/per-stack.md) · [`ci-and-parallel.md`](references/ci-and-parallel.md) · [`reading-results.md`](references/reading-results.md).

## Steps every part shares

1. **Write the expected result before the run.** For a load test, the pass threshold is written into the script first. For a functional test, the expected value is written in the test, not read off the current output.
2. **Keep tests deterministic.** Use fixed data, a fixed clock, and no real outside service. A test that flips between red and green gets fixed or removed, never silently skipped.
3. **Prove the test can fail.** Break the feature once on purpose and confirm the test goes red. A test that cannot fail gives no evidence.
4. **Run the check the same way in CI and on your machine.** Pin the tool version. Do not use `latest`.

## Test mode for cards

Pick once per project and write it in `CLAUDE.md`. The default is `gate`, because the full suite on every card is the slowest path and parallel full runs can run the machine out of memory.

| Mode | Card `done_when` runs | Full suite runs |
|---|---|---|
| `every` | the full suite | on every card |
| `targeted` | only the tests of the card's files | at the milestone gate card |
| `gate` (default) | the card's own tests | once, on a gate card that `depends` on every card of the milestone |

Wrap full-suite and load-test commands in `scripts/test-lock.mjs --` so 2 lanes never run them at once. When the gate card fails, `scripts/culprit.mjs` finds the card that broke it.

## Check before done

- Never load test a system that is not ours (a partner API, a payment gateway, a competitor's site). Use a mock or a sandbox instead.
- Never run a load test beyond smoke, or any load test on production, without a named approver, a time window, a peak volume, and a person who can stop it at once.
- Load test data holds no real customer names, phone numbers or orders (`pdpa-compliance`). A load run must not send real money, email, SMS or orders.
- An app-verifier script never touches the real database, never calls a paid external API, never sends a real message, and never solves a CAPTCHA. Test accounts go in a test-data file, never real passwords.
- The verifier script never passes empty: if the feature name is missing, or the app does not start, it exits with an error.
- If the app is broken, file a bug with `qa-docs`. Never edit a verify step just to make it pass.

## References

- [`assets/k6-smoke.yml`](assets/k6-smoke.yml) and [`assets/load-test.js`](assets/load-test.js) — load test starter and CI smoke workflow
- [`scripts/with_server.py`](scripts/with_server.py) — starts a web server, waits for its port, runs the script, then stops the server
- [`references/sources.md`](references/sources.md) — where the tool facts came from (checked 2026-10-28)
