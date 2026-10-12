# ตัวอย่าง User Story: Login Feature

## US-001: User Login with Email

**Story**
As a registered customer
I want to log in with my email and password
So that I can access my personal dashboard and order history

**Acceptance Criteria**

AC1: Successful login
- Given I am a registered user with valid credentials
- When I enter correct email and password and click "Login"
- Then I am redirected to my dashboard
- And I see a welcome message with my name

AC2: Invalid password
- Given I am a registered user
- When I enter correct email but wrong password
- Then I see error message "Invalid email or password"
- And I remain on the login page

AC3: Account lockout
- Given I have entered wrong password 4 times
- When I enter wrong password the 5th time
- Then my account is locked for 15 minutes
- And I see message about contacting support

**Priority:** High
**Story Points:** 5
**Dependencies:** US-000 (User Registration)
**Notes:**
- ใช้ rate limiting ตาม security policy
- Lockout threshold: 5 attempts in 10 minutes
- ไม่บอกชัดเจนว่า email หรือ password ผิด (security best practice)
