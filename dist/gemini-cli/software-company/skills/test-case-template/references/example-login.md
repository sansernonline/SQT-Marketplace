# Example: Login Feature Test Cases

Worked example for `test-case-template` (3 cases: happy path, negative, state transition).

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

**Oracle:** [D] US-001 AC1 — login ถูก → เข้า /dashboard
**Related:** US-001, AC1
```

```markdown
## TC-LOGIN-002: Empty email field

**Module:** Authentication
**Type:** Negative
**Priority:** P2
**Automation:** Automated

**Preconditions:**
- User is on login page

**Steps:**
| # | Action                | Expected Result                      |
|---|----------------------|--------------------------------------|
| 1 | Leave email empty     | Field shows placeholder              |
| 2 | Enter valid password  | Password accepted                    |
| 3 | Click "Login"         | Error: "Email is required"           |
| 4 | Verify focus          | Email field gets focus               |

**Oracle:** [D] US-001 AC2 — อีเมลเป็นช่องบังคับ · [R] ช่องที่ผิดได้โฟกัส (WCAG 3.3.1)
**Related:** US-001, AC2
```

```markdown
## TC-LOGIN-003: Account lockout after 5 failed attempts

**Module:** Authentication
**Type:** Security
**Priority:** P1
**Automation:** Candidate

**Preconditions:**
- User account exists and is not locked

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + wrong password  | Error message                 |
| 2 | Repeat step 1 four more times       | Same error each time          |
| 3 | Enter valid email + correct password| Error: "Account locked..."    |
| 4 | Wait 15 minutes                     | Can login successfully        |

**Oracle:** [D] US-001 AC4 — ผิด 5 ครั้ง → ล็อก 15 นาที
**Check when:** ทั้งสอง — หลังรีโหลดหน้าต้องยังล็อกอยู่
**Related:** US-001, AC4
```
