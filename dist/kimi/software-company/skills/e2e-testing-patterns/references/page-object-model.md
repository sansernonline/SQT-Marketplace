# Page Object Model (POM) — ตัวอย่างโค้ด

ตัวอย่างเทียบเทสต์ที่ไม่มี abstraction กับเทสต์ที่ใช้ Page Object ใช้ตอนตั้งโครงชุดทดสอบหรือรีวิวเทสต์ที่ลอกขั้นตอนซ้ำกัน

## ❌ Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

## ✅ Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> 💡 **One Page Object per page or major component.**
