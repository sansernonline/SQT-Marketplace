# Test case categories (coverage guide) · test-case-template

Open when listing what to test for a feature. For every feature, create test cases in these categories.

1. **Functional / Happy path** — valid inputs producing expected outputs.
2. **Boundary** — minimum valid value · maximum valid value · just below minimum · just above maximum · empty / null · single item / first / last · every BR with a number → just below · at · just above the limit.
3. **Negative** — invalid format (wrong type, regex mismatch) · missing required fields · extra unexpected fields · special characters / SQL injection patterns · very long strings.
4. **Equivalence classes** — one value from each class: valid · invalid too small · invalid too large · invalid wrong format.
5. **State transitions** — for features with states (for example order: draft → submitted → paid → shipped): each valid transition · each invalid transition attempt.
6. **Integration** — interaction with other modules · external API calls (success, failure, timeout) · database state after the operation.
7. **Concurrency** — two users acting simultaneously · same user in multiple tabs · race conditions.
8. **Security** — unauthorized access · privilege escalation attempts · input sanitization (cross-site scripting (XSS), SQL injection) · rate limiting.
9. **Performance** — response time under normal load · behavior under peak load · memory/CPU usage.
10. **Accessibility (UI features)** — keyboard-only navigation · screen reader compatibility · color contrast · focus management.
