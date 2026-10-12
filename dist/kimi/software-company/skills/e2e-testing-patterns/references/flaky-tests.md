# Fighting Flaky Tests — ตัวอย่างการรอที่ถูกวิธี

โค้ดเทียบการรอแบบกำหนดเวลากับการรอตามเหตุการณ์ ส่วนตารางสาเหตุและกลยุทธ์การรันซ้ำอยู่ใน `SKILL.md`

## ❌ Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## ✅ Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```
