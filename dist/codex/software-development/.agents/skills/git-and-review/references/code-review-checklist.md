<!-- merged from skill `code-review-checklist` on 2026-11-27 · description was: Use when reviewing a pull request or your own code -->
# Code Review Checklist — review a pull request or your own code, with actionable comments

> **In SuperUser:** start from the playbook [`review`](../../superuser/references/playbook-review.md), then use this checklist for ordinary reviews. High-risk work or a large diff → `crew-patterns/adversarial-review-panel`.

## Use when
- Reviewing a pull request, self-reviewing before submitting, or auditing an existing module
- Not for: a second look inside a team → a new `reviewer` agent (it applies this checklist) · contested design, large or high-risk diff, "stress test" → `crew-patterns/adversarial-review-panel` · reviewing a visual → `graphic-design:design-review` if installed, else `ui-craft` · writing the PR description → `pr-description-template.md` · hunting misleading patterns across the codebase → `code-craft` · scanners, secrets, dependency check, OWASP Top 10:2025 → `security-gate` (run both before merge; `owasp-top10.md`, `owasp-stack-checks.md`)

## Steps
1. **Understand the intent:** read the PR description and linked ticket. For a branch or PR, pin the range first (`BASE=$(git merge-base main HEAD)` · `HEAD=$(git rev-parse HEAD)` · review `git diff $BASE..$HEAD`) and write both SHAs in the report.
2. **Skim the diff** for the overall shape.
3. **Review against the checklist.** House checks first; each skill holds the full rules, so link it in the comment:
   - Security: run [`security-gate`](../../security-gate/SKILL.md) on the diff (input checked at the boundary, parameterized SQL, server-side permission check, no secrets in code or logs)
   - Simple enough: [`code-craft`](../../code-craft/SKILL.md) · readable: [`code-craft`](../../code-craft/SKILL.md) · tests next to the code and proving the change: [`test-automation`](../../test-automation/SKILL.md)
   - Shared code touched → [`code-craft`](../../code-craft/SKILL.md) list is in the PR · commit message follows [`commit-message-format.md`](commit-message-format.md)
   - The generic list (correctness, design, performance, documentation, maintainability): [`full-checklist.md`](full-checklist.md)
4. **Verify before posting:** hand every `blocking:` finding to a fresh agent (or second reader) with only the diff and the finding, and ask if it is real. Drop it if they cannot reproduce or point to the line.
5. **Do not flag:** a problem that existed before this PR · what the linter or compiler already catches · a nitpick a senior reviewer would skip · behaviour that looks wrong but is right (check context first) · a rule the team silenced on purpose with a lint-ignore comment · a problem only for an input that cannot occur here.
6. **Run the code** if non-trivial; do not just read.
7. **Leave actionable comments:** a concrete fix for each, not just the problem. Prefixes:

   | Prefix | Meaning | Example |
   |---|---|---|
   | `blocking:` | Must fix before merge | `blocking: This will cause Y in production because Z.` then `Suggest: <concrete fix>` |
   | `important:` | Should fix, can be follow-up if urgent | |
   | `nit:` | Minor, optional | `nit: Consider X for readability` |
   | `q:` | Question, not necessarily a change | `q: Why did you choose X over Y here?` |
   | `praise:` | Acknowledge good work | `Nice approach with X — much cleaner than the previous version.` |

   These prefixes are for comments on a pull request. A review report uses the `reviewer` scale: `blocking:` = สูง · `important:` = กลาง · `nit:` = ต่ำ, verdict ผ่าน / ไม่ผ่าน with counts per level.
8. **Avoid:** bikeshedding when there is no convention · "why not MY way" · only criticism · vague comments ("this is wrong": say why and suggest a fix) · reviewing too much at once (ask for PRs under 400 lines).

## Run as a command
`/software-development:git-and-review <file path or PR description>` — use a new read-only `reviewer` agent to review **the user's request** (high-stakes or contested → `crew-patterns/adversarial-review-panel`). Open `superuser` with the playbook `review` and copy its steps into the todo first; use both together. The reviewer: reads the file(s) or diff and pins the range (step 1) · applies this skill · rates each finding **สูง** (must fix before merge) · **กลาง** (should fix) · **ต่ำ** (optional) · gives a concrete fix for each · outputs verdict **ผ่าน** / **ไม่ผ่าน** with counts per level (not the `blocking:`/`nit:` prefixes).

The author does not fix every finding on sight: a finding can be wrong (misread code, or the "bug" is covered by a test). Push back with evidence (`file:line` · test name · command output), not opinion · fix what stands · list each rejected finding and its evidence in the report so the lead can judge.

## Check before done
- Every finding has a severity and a concrete fix · every `blocking:` was verified by a second reader
- Both SHAs are in the report · none of the "do not flag" kinds is in the findings

## References
- [`full-checklist.md`](full-checklist.md) — open when the diff needs the generic checks (correctness, design, performance, documentation, maintainability)
