# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

สามวิธีล็อกอินในชุดทดสอบ เรียงจากแย่ไปดี พร้อมโค้ดตัวอย่างของ Playwright

## ❌ Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## ✅ Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## ✅ Better: API login + cookie injection
```typescript
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  const cookies = await response.headers();
  await page.context().addCookies([...]);
}
```
