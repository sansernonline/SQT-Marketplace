# Critical Path Coverage Matrix และ Library Quick Reference

ตัวอย่างตารางความครอบคลุมของเส้นทางผู้ใช้ และตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✅ | 🔴 P0 |
| Login → main task | ✅ | 🔴 P0 |
| Add to cart → checkout → success | ✅ | 🔴 P0 |
| Search → filter → result | ✅ | 🟡 P1 |
| Settings → save | ✅ | 🟡 P1 |
| Admin panel CRUD | ✅ | 🟡 P1 |
| Password reset | ✅ | 🟢 P2 |
| Profile edit | 🟡 Sample | 🟢 P2 |
```

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |
