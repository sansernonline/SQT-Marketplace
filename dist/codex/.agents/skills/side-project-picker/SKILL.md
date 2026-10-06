---
name: side-project-picker
description: Use when the user wants a practice or portfolio project and has too many ideas or none. Scores candidates on learning value, finishability in two weekends and usefulness, cuts scope, and fixes a definition of done so it ships.
---

# Side Project Picker

Pick the project you will finish. A shipped small project teaches more than an abandoned big one.

## Workflow

1. **Learning goal**: which 1–2 skills should this project exercise? Take them from the active `learning-path` or the `cert-prep` plan if one exists
2. **Constraints**: the hours available (default: 2 weekends ≈ 16 hours), the stack the user already knows, and any budget for hosting (default ฿0)
3. **Candidates**: collect 3–5 ideas. Use the user's own annoyances first (a real problem has a real user), then the idea bank in [references/idea-bank.md](references/idea-bank.md)
4. **Score** each one with the matrix below. Pick the highest; on a tie, pick the one the user would actually use
5. **Cut scope** with the rules below until the plan fits the hours
6. **Write the done definition** before writing any code, in the project's `README.md`
7. **Two-weekend plan**: weekend 1 is a walking skeleton deployed end to end, ugly. Weekend 2 is the core feature, the done list, and a write-up
8. **Ship and log**: a public repo or demo link, a 5-line write-up of what was learned, and a line in `learning-log.md`

## Scoring matrix (1–5 each)

| Criterion | Weight | 1 | 5 |
|---|---:|---|---|
| **Learning value**: exercises the target skill directly | ×3 | The skill is a side detail | The skill is the core of the project |
| **Finishable in 2 weekends** | ×3 | Needs months, or something unknown blocks it | The skeleton is obvious, with 1 new thing at most |
| **Usefulness**: someone (even only the user) will use it | ×2 | A demo nobody opens again | Used weekly |
| **Portfolio value**: tells a reader something | ×1 | A tutorial clone | A real problem with a short write-up and a live demo |

**Score = 3L + 3F + 2U + 1P** (maximum 45). Below 25 = pick another idea.

## Worked example

Goal: learn Go and REST API design. 16 hours. Knows Python.

| Idea | L | F | U | P | Score |
|---|---:|---:|---:|---:|---:|
| A Go clone of a full social network | 4 | 1 | 1 | 2 | 23 |
| A Go CLI that converts Thai bank-statement CSV into a monthly summary | 3 | 5 | 4 | 3 | 38 |
| A Go REST API for the family's shared shopping list + a tiny web page | 5 | 4 | 4 | 4 | **43** |

→ The shopping-list API. Scope cuts: no accounts (one shared secret link), no real-time updates (refresh the page), SQLite instead of Postgres, deployed on a free tier. Done definition: see the template below.

## Scope-cutting rules

1. **One user, one main flow.** Remove sign-up, roles and settings. Use a single hard-coded user or a secret link
2. **Storage**: a file or SQLite before a database server
3. **No admin screens.** Edit the data directly
4. **Only one new thing.** If the project needs a new language *and* a new framework *and* a new cloud, pick one and use familiar tools for the rest
5. **Fake what is not the lesson**: mock a payment, hard-code a list, skip email
6. **Cut by time**: anything not working by the end of weekend 1 that is not the core moves to a `later.md` list
7. **Polish last.** Styling happens only after the done list is ticked

## Done definition (template, in `README.md`)

```markdown
## Done when
- [ ] The core flow works end to end: <one sentence>
- [ ] Deployed or runnable with one command: <link or command>
- [ ] 3 or more automated tests on the core logic
- [ ] README: what it does, how to run it, one screenshot
- [ ] Write-up (5 lines): what I learned, what I would do differently
## Not doing (this version)
- <cut 1>
- <cut 2>
```

## Rules

- A project is finished when the done list is ticked, not when it is perfect
- Keep a running list of later ideas; never expand scope mid-build
- A project that misses its two weekends gets one more weekend with stricter cuts, then it is shipped as-is or dropped with a note
- Prefer projects that run on free tiers. Add a budget alert to any cloud account

Related: `learning-path` (where the goal comes from), `cert-prep` (a project after the exam), `tech-radar` (new tools worth trying), and `project-bootstrap` and `lazy-coding` in `software-company`.
