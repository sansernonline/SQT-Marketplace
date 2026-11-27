---
name: requirements-writing
description: Use when writing an SRS, FSD or user stories before code
argument-hint: '<feature description>'
---

# requirements-writing — write requirements a developer can build and a tester can check

> **One rule:** every requirement must let you write a test case from it right away. If a developer must guess, the document is not finished.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Write the SRS", "software requirements spec", "review this SRS before sign-off", "tender or SOW requirements" | [`references/srs-writing.md`](references/srs-writing.md) |
| "Write the FSD", "functional spec", "developers keep asking questions" | [`references/fsd-writing.md`](references/fsd-writing.md) |
| "Write user stories", "acceptance criteria", "split this requirement into stories" | [`references/user-story-writer.md`](references/user-story-writer.md) |
| "Start this feature", "feature kickoff", "from idea to BRD, FSD and plan" | [`references/feature-kickoff.md`](references/feature-kickoff.md) (playbook: `superuser/references/playbook-feature.md`) |

Shared material: the difference between FSD and SRS is in [`references/fsd-vs-srs.md`](references/fsd-vs-srs.md). Templates are in `assets/` (`srs-outline.md`, `fsd-outline.md`, `user-stories.md`). Reader checks are in [`references/reader-test.md`](references/reader-test.md) and [`references/review-checklist.md`](references/review-checklist.md).

## Steps every part shares

1. Find the client's existing format first (TOR, template, past documents). Use it before inventing a new one.
2. Write each requirement with one fixed word for the strength: **ต้อง** (must), **ควร** (should), **อาจ** (may).
3. Give every item an ID. Never reuse an issued ID. A dropped item is marked, not deleted.
4. Mark each unknown `(รอยืนยัน)` (awaiting confirmation) and put it on the open-questions list. Do not fill it with a guess.
5. Test the result with a fresh reader: a new agent that sees only the file answers 8 to 10 questions a developer or tester would ask. Fix the document at each gap, then ask again.

## Check before done

- Every numeric value (price, time, limit) came from the customer or the SRS. Nothing is invented, and no silent guess is written as fact.
- An FSD adds no new requirement. A missing point goes to the SRS first, or to the open-questions list.
- Every status has a table of From · To · Who · Condition · Side effects, and every error case has its own test case.
- A story whose acceptance criteria change after work starts is logged in the change history, and related test cases are updated.
- A Thai document and its English version are checked by a fresh reader, and the answers match.
