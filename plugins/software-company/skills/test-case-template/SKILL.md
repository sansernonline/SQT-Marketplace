---
name: test-case-template
description: Use when writing test cases, designing test scenarios, creating test plans for a feature, or converting acceptance criteria into executable test cases. Covers functional, boundary, negative, and edge cases.
---

# Test Case Template

## When to use this skill

- Converting user story / acceptance criteria into test cases
- Designing test scenarios for a new feature
- Building a regression test suite
- Reviewing test coverage gaps

## Test Case ID Convention

```
TC-<MODULE>-<NUMBER>
Example: TC-LOGIN-001, TC-CHECKOUT-042
```

## Test Case Template

```markdown
## TC-XXX-NNN: <Short descriptive title>

**Module:** <feature area>
**Type:** Functional | Boundary | Negative | Integration | Performance | Security
**Priority:** P1 (critical) | P2 (high) | P3 (medium) | P4 (low)
**Automation:** Manual | Automated | Candidate

**Preconditions:**
- ...
- ...

**Test Data:**
| Field | Value |
|-------|-------|
| ...   | ...   |

**Steps:**
| # | Action | Expected Result |
|---|--------|----------------|
| 1 | ...    | ...            |
| 2 | ...    | ...            |
| 3 | ...    | ...            |

**Postconditions:**
- ...

**Related:** US-XXX, AC-X
```

## Test Case Categories (Coverage Guide)

For every feature, create test cases in these categories:

### 1. Functional / Happy Path
Valid inputs producing expected outputs.

### 2. Boundary
- Minimum valid value
- Maximum valid value
- Just below minimum
- Just above maximum
- Empty / null
- Single item / first / last

### 3. Negative
- Invalid format (wrong type, regex mismatch)
- Missing required fields
- Extra unexpected fields
- Special characters / SQL injection patterns
- Very long strings

### 4. Equivalence Classes
Pick one value from each class:
- Valid class
- Invalid class - too small
- Invalid class - too large
- Invalid class - wrong format

### 5. State Transitions
For features with states (e.g., order: draft → submitted → paid → shipped):
- Each valid transition
- Each invalid transition attempt

### 6. Integration
- Interaction with other modules
- External API calls (success, failure, timeout)
- Database state after operation

### 7. Concurrency
- Two users acting simultaneously
- Same user multiple tabs
- Race conditions

### 8. Security
- Unauthorized access
- Privilege escalation attempts
- Input sanitization (XSS, SQL injection)
- Rate limiting

### 9. Performance
- Response time under normal load
- Behavior under peak load
- Memory/CPU usage

### 10. Accessibility (UI features)
- Keyboard-only navigation
- Screen reader compatibility
- Color contrast
- Focus management

## Example: Login Feature Test Cases

```markdown
## TC-LOGIN-001: Successful login with valid credentials

**Module:** Authentication
**Type:** Functional
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account exists with email "test@example.com"
- User is on login page

**Test Data:**
| Field    | Value              |
|----------|--------------------|
| Email    | test@example.com   |
| Password | ValidPass123!      |

**Steps:**
| # | Action                          | Expected Result                    |
|---|--------------------------------|-----------------------------------|
| 1 | Enter email in email field      | Email shown in field              |
| 2 | Enter password                  | Password masked with dots         |
| 3 | Click "Login" button            | Loading indicator appears         |
| 4 | Wait for response               | Redirect to /dashboard            |
| 5 | Verify dashboard               | Welcome message with user name    |

**Postconditions:**
- Session cookie set
- Last login timestamp updated

**Related:** US-001, AC1
```

```markdown
## TC-LOGIN-002: Empty email field

**Type:** Negative
**Priority:** P2

**Steps:**
| # | Action                | Expected Result                      |
|---|----------------------|--------------------------------------|
| 1 | Leave email empty     | Field shows placeholder              |
| 2 | Enter valid password  | Password accepted                    |
| 3 | Click "Login"         | Error: "Email is required"           |
| 4 | Verify focus          | Email field gets focus               |
```

```markdown
## TC-LOGIN-003: Account lockout after 5 failed attempts

**Type:** Security
**Priority:** P1

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + wrong password  | Error message                 |
| 2 | Repeat step 1 four more times       | Same error each time          |
| 3 | Enter valid email + correct password| Error: "Account locked..."    |
| 4 | Wait 15 minutes                     | Can login successfully        |
```

## Quality Checklist

Each test case should:
- [ ] Have one clear purpose
- [ ] Be reproducible by anyone reading it
- [ ] Have clear expected results
- [ ] Be independent (doesn't rely on TC-XXX running first)
- [ ] Be deterministic (same result every run)
- [ ] Trace back to a requirement (user story, AC)

## Anti-patterns

- ❌ "Test the login page" — too vague, what specifically?
- ❌ Combining 10 actions into one test case — split them
- ❌ Expected result = "It works" — be specific
- ❌ Test cases that depend on previous test cases passing
- ❌ Only happy-path tests (must include negative + boundary)
- ❌ Tests with no traceability to requirements
