---
name: thai-business-setup
description: Use when starting a Thai business
---

# Starting a business in Thailand: choose a form and register

This skill helps the user choose between trading as an individual, a partnership or a company. It walks them through registration, then through the checklist after registration. The content is general information, not tax or legal advice. An accountant should recalculate the tax figures for a real business.

## 1 · Choosing a business form

Compare 4 forms (individual + commercial registration (ทะเบียนพาณิชย์) · registered ordinary partnership (ห้างหุ้นส่วนสามัญนิติบุคคล) · limited partnership (ห้างหุ้นส่วนจำกัด) · limited company (บริษัทจำกัด)) by liability for debts, capital, where to register, fees and tax (progressive 0–35% for an individual, the juristic person rate for the others). The full table, the order of questions for choosing a form and the sources checked 2026-10-23 are in [`references/business-forms.md`](references/business-forms.md). Open that file before answering which form to register.

## 2 · Income tax: individual vs juristic person

The individual tax brackets (tax year 2025 (B.E. 2568)), the SME juristic person rates, the 3 profit scenarios and how to run `decide.mjs` with `tax-compare.mjs` are in [`references/income-tax-compare.md`](references/income-tax-compare.md). These figures do not yet include the second layer of tax when money leaves the company. Open that file before comparing numbers.

## 3 · Registration

An individual registers commercial registration (anyone selling online must register). Partnerships and companies register through DBD Biz Regist (online only from 1 Nov 2026 (B.E. 2569)). The steps, fees and sources checked are in [`references/registration.md`](references/registration.md). Check the rate in the system before every payment.

## 4 · After registration: checklist

| Task | When | Use |
|---|---|---|
| Open a bank account in the business name, separate from personal money | Right away | Recommended practice |
| Juristic person: keep books from the registration date · appoint a qualified bookkeeper · close the first accounting period within 12 months · keep books and documents for at least 5 years from the closing date | Right away | `dbd-annual-filing` |
| Register for VAT when revenue from selling goods or services exceeds 1.8 million baht a year. File the request within 30 days of the date revenue passes it · below that, the owner can still register voluntarily · a juristic person can file the VAT request together with the incorporation request | By revenue | `tax-vat-th` |
| Issue electronic tax invoices (e-Tax Invoice) | After VAT registration | `e-tax-invoice` |
| First hire: register the employee as an insured person within 30 days of the start date · an employer who is an individual must register as an employer themselves | When hiring | `hiring-th` · `social-security-th` |
| Withholding tax and monthly VAT | Every month | `tax-vat-th` |
| Payroll | Every month | `payroll-th` |
| Financial statements and yearly tax | After the accounting year closes | `dbd-annual-filing` |
| Privacy notice for customers and staff | Before collecting data | `pdpa-workflow` |
| Quotation, invoice, receipt · PromptPay QR | When sales open | `doc-quotation` · `promptpay-qr` |

Last checked 2026-10-23 · sources: [`references/sources.md`](references/sources.md)

## 5 · Import cost from China

Moved to the skill `import-landed-cost` (CIF formula, duty and VAT · 2026 rules · by road or by sea · script `landed-cost.mjs`).

## 6 · When to ask an accountant or lawyer

- Before choosing a form, if profit is expected to exceed 1 million baht a year or partners put in unequal amounts (recommended practice)
- A shareholder, partner or director is a foreigner · DBD asks for extra documents under the orders of the Central Partnership and Company Registration Office (company: no. 2/2569 · partnership: no. 205/2555), and the law on foreign business operation needs a lawyer's review
- Registered capital over 5 million baht · DBD asks for extra documents under order no. 1/2567
- Revenue is near 1.8 million baht, or the business is about to register for VAT
- Financial statements or tax were filed late (penalties grow every day; see `dbd-annual-filing`)

## 7 · รออนุมัติ (awaiting approval)

These steps cannot be undone or they affect outsiders. The agent prepares the data and drafts, but does not do them.

- Filing a real registration, verifying identity or paying a fee in a government system
- Signing a partnership agreement or a lease
- Filing a VAT registration request
- Entering the user's password, identity verification code or account number

## 8 · Links to other skills

| Need | Use |
|---|---|
| Tax for an online seller who is an individual (deducting expenses · ภ.ง.ด.90 (PND 90) and 94 (PND 94)) | `seller-tax-basics` |
| Monthly filing of VAT, withholding tax and penalties | `tax-vat-th` + agent `tax-helper` |
| Partnership, lease and work-for-hire contracts | `doc-contract-th` |
| Setting a selling price on Shopee, Lazada and TikTok Shop once the cost is known | `marketplace-fees-pricing` |
| Comparing domestic carriers | `shipping-compare` |
| Naming the business before reserving the name | `product-naming` (plugin `software-development`) |
