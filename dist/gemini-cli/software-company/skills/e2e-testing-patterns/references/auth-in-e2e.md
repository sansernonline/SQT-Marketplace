# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

สามวิธีล็อกอินในชุดทดสอบ เรียงจากแย่ไปดี พร้อมโค้ดตัวอย่างของ Playwright

## Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## Better: API login (no UI)
```typescript
// page.request shares its cookie jar with the page's browser context,
// so the Set-Cookie from the login response is already in the browser — no addCookies needed.
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  expect(response.ok()).toBeTruthy();
}

// Or once for the whole run (global setup), saved for every test:
// const ctx = await request.newContext({ baseURL });
// await ctx.post('/api/login', { data: user });
// await ctx.storageState({ path: 'playwright/.auth/user.json' });
```

> 🔐 The saved state file holds a live session (cookies, tokens). Keep it out of git: add `playwright/.auth/` (or your `auth.json`) to `.gitignore`, and use a test account only.
