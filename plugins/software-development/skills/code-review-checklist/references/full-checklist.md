# Code review — full generic checklist

Moved out of [SKILL.md](../SKILL.md). Open it for a large or unfamiliar change. The house-specific checks stay in SKILL.md.

### 🎯 Correctness

- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (null, empty, zero, negative, very large)
- [ ] Are error paths handled? (network failure, timeout, invalid input)
- [ ] Are race conditions / concurrency issues considered?
- [ ] Off-by-one errors checked?
- [ ] Are assumptions explicit (or asserted)?

### 🏗️ Design

- [ ] Does this fit the existing architecture?
- [ ] Is the abstraction at the right level? (not too generic, not too specific)
- [ ] Single Responsibility — does each function/class do one thing?
- [ ] DRY — but not over-abstracted?
- [ ] Are dependencies appropriate? (no circular, minimal coupling)
- [ ] Could this be simpler?

### 🧪 Tests

- [ ] Are there tests for the new code?
- [ ] Tests cover happy path + edge cases + errors?
- [ ] Tests would actually fail if code broke? (no false positives)
- [ ] Tests are readable and maintainable?
- [ ] No flaky tests introduced?

**Rate each missing test 1–10 before suggesting it** (adapted from `pr-test-analyzer` · claude-plugins-official · Apache-2.0 · opened 2026-11-10). 9–10: data loss, money or security would break unnoticed · 7–8: the user sees an error · 5–6: edge case with limited impact · below 5: do not suggest it. Review behaviour, not line coverage. Do not ask for tests of plain getters and setters.

### 🔒 Security

- [ ] Input validation at boundaries?
- [ ] No SQL injection (parameterized queries)?
- [ ] No XSS (proper escaping)?
- [ ] No secrets/credentials in code?
- [ ] Authorization checks for sensitive operations?
- [ ] PII / sensitive data logged appropriately?
- [ ] Dependencies updated? No known CVEs?

### 🚀 Performance

- [ ] No N+1 queries?
- [ ] Appropriate caching where beneficial?
- [ ] Loops/algorithms with appropriate complexity?
- [ ] Large data handled with pagination/streaming?
- [ ] No unnecessary network calls?

### 📖 Readability

- [ ] Names reveal intent? (variables, functions, classes)
- [ ] Functions reasonably short?
- [ ] Complex logic has explanatory comments? (WHY, not WHAT)
- [ ] No commented-out code left behind?
- [ ] No debug prints / TODO without ticket?
- [ ] Consistent with existing code style?

### 📚 Documentation

- [ ] Public APIs documented?
- [ ] README/CHANGELOG updated if needed?
- [ ] Breaking changes called out?
- [ ] New env vars / config documented?

### 🔄 Maintainability

- [ ] Could a new team member understand this in 6 months?
- [ ] Easy to modify when requirements change?
- [ ] No magic numbers / strings (use constants)?
- [ ] Logging at appropriate levels?
