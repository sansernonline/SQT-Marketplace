# Example: Login Feature Test Cases

**สารบัญ:** (หัวข้อเคสอยู่ในกรอบโค้ด จึงลิงก์ไม่ได้ — เลื่อนหาตามรหัสเคส)

- TC-LOGIN-001: Successful login with valid credentials
- TC-LOGIN-002: Empty email field
- TC-LOGIN-003: Account lockout after 5 failed attempts
- TC-LOGIN-004: 4 failed attempts do not lock the account (just below the limit)
- TC-LOGIN-005: 6th attempt on a locked account is rejected (just above the limit)
- [Coverage matrix](#coverage-matrix)
- [Traceability](#traceability)

Worked example for `test-case-template` (5 cases: happy path · negative · lockout at the limit of 5 failed attempts with its 3 boundary values 4 · 5 · 6 · security).

IDs: User Story (US) · Acceptance Criteria (AC) · Web Content Accessibility Guidelines (WCAG) · Business Rule (BR) · Functional Requirement (FR).

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

**Oracle:** [D] US-001 AC2 — อีเมลเป็นช่องบังคับ และช่องที่ผิดต้องได้โฟกัส (ขั้นที่ 4) · [R] WCAG 3.3.1 — ข้อผิดพลาดต้องบอกเป็นข้อความ (ขั้นที่ 3) · WCAG ไม่ได้บังคับเรื่องโฟกัส จึงอ้างเฉพาะเรื่องข้อความ
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

```markdown
## TC-LOGIN-004: 4 failed attempts do not lock the account (just below the limit)

**Module:** Authentication
**Type:** Boundary
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account exists and is not locked

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + wrong password, 4 times | Error message each time |
| 2 | Enter valid email + correct password| Redirect to /dashboard        |

**Oracle:** [D] US-001 AC4 — ล็อกเมื่อผิดครบ 5 ครั้ง (4 ครั้งยังไม่ล็อก)
**Check when:** ทันที
**Related:** US-001, AC4, BR-001
```

```markdown
## TC-LOGIN-005: 6th attempt on a locked account is rejected (just above the limit)

**Module:** Authentication
**Type:** Boundary
**Priority:** P1
**Automation:** Automated

**Preconditions:**
- User account is locked after 5 failed attempts (see TC-LOGIN-003)

**Steps:**
| # | Action                              | Expected Result                |
|---|-------------------------------------|-------------------------------|
| 1 | Enter valid email + correct password (6th attempt) | Error: "Account locked..." |

**Oracle:** [D] US-001 AC4 — ล็อกอยู่ 15 นาที แม้รหัสผ่านถูก
**Check when:** ทั้งสอง — หลังรีโหลดหน้าต้องยังล็อกอยู่
**Related:** US-001, AC4, BR-001
```

## Coverage matrix

| Feature | Happy | Negative | Boundary | Equivalence | State | Security/API |
|---|---|---|---|---|---|---|
| Login | TC-LOGIN-001 | TC-LOGIN-002 | TC-LOGIN-004 · 005 | ระวัง ยังไม่มี: ชนิดรหัสผ่านที่ผิด | — | TC-LOGIN-003 |

## Traceability

| FR / BR | Test cases |
|---|---|
| US-001 AC1 | TC-LOGIN-001 |
| US-001 AC2 | TC-LOGIN-002 |
| BR-001 (ผิด 5 ครั้ง → ล็อก 15 นาที) | TC-LOGIN-003 · 004 · 005 |
