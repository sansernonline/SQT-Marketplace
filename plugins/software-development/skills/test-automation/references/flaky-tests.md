# Fighting Flaky Tests — examples of waiting the right way

Code comparing a fixed-time wait with an event-based wait. The cause table and the retry strategy are in `SKILL.md`.

## Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```
