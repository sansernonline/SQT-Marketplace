# Test Data Strategy — ทางเลือกทั้ง 4 แบบ

ข้อดีข้อเสียของการเตรียมข้อมูลทดสอบแต่ละแบบ พร้อมโค้ดตัวอย่างของแบบที่แนะนำ

## Option 1: Shared test DB (popular, problematic)
```
❌ All tests share same data
❌ Order-dependent
❌ Hard to parallelize
❌ Pollution between tests
```

## Option 2: Per-test setup (slow)
```
🟡 Clean slate every test
🟡 Reliable but slow
✅ Good for critical flows
```

## Option 3: API setup, UI verification (best)
```typescript
// ✅ Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

## Option 4: Database snapshot + rollback
```
✅ Real production-like data
✅ Fast (uses snapshots)
🟡 Requires DB tooling
```
