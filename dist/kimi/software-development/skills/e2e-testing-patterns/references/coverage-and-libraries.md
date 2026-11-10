# Critical Path Coverage Matrix และ Library Quick Reference

ตัวอย่างตารางความครอบคลุมของเส้นทางผู้ใช้ และตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✓ | P1 |
| Login → main task | ✓ | P1 |
| Add to cart → checkout → success | ✓ | P1 |
| Search → filter → result | ✓ | P2 |
| Settings → save | ✓ | P2 |
| Admin panel CRUD | ✓ | P2 |
| Password reset | ✓ | P3 |
| Profile edit | Sample | P3 |
```

Priority uses the `test-case-template` scale (P1 = most important, P3 = least), the same as the `@P1|@P2|@P3` test tags.

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |
