---
name: tax-basics-th
description: Use when asking how Thai tax applies to gains or dividends
---

# Thai Tax Basics for Investors — which form, by when, and how each investment income is taxed

General information, not tax advice. For a real filing ask a นักบัญชี / tax agent or the Revenue Department (RD) call centre 1161.

## Use when
- A Thai resident asks how tax applies to share gains, dividends, fund income, deposit interest, crypto, or foreign income.
- Choosing between leaving withheld tax as final or including the income in the annual return.
- Picking the return form and deadline.

Not for: year-end deductions → `tax-deduction-planner` · dividend dates and income tracking → `dividend-tracker` · income from selling online (40(8)) → `e-commerce:seller-tax-basics` (if installed).

## Steps
1. **Confirm the tax year and residence** (180-day rule). State the tax year in every answer; numbers change yearly.
2. **List every income source** with gross amount and tax withheld, and sort each into the table in [`references/investment-income-rules.md`](references/investment-income-rules.md). A number not in that table is `(รอยืนยัน)` until checked on rd.go.th. Before relying on the crypto exemption, check the platform on the SEC licence list (sec.or.th). For foreign income, track the earn date and remit date of every transfer.
3. **For each optional item, compute both ways and pick the cheaper.** Dividends: final 10% withheld, or include in ภ.ง.ด.90 and claim the credit (worth it at a marginal rate of 25% or less; including means including **all** such dividends that year). Re-check the band after adding the income; if it crosses into 30%, final tax wins. `tax-deduction-planner` script `tax.mjs` with a `dividends` field prints both ways. Fixed deposit or bond interest (15% withheld): include only if the marginal rate is below 15%. Savings interest: exempt up to 20,000 a year across all banks if the banks may send data to RD.
4. **Run `tax-deduction-planner` for deductions** and combine into one net-income calculation.
5. **Pick the form and deadline** from the table below, and list the documents to keep.
6. **Hand complex cases** (foreign income, business income, large crypto) to a licensed tax agent. This skill prepares and explains.

| Form | Who | Paper deadline | Online (e-filing / D-MyTax) |
|---|---|---|---|
| ภ.ง.ด.91 | salary 40(1) only | 31 March of next year | usually extended to about 8 April (2568 year: 8 April 2569) |
| ภ.ง.ด.90 | any other income: freelance, rent, business, dividends or interest you choose to include, foreign remitted income | 31 March | same extension |
| ภ.ง.ด.94 | half-year return for rent, business, 40(5)–(8) income Jan–Jun | 30 September | about 8 October |

Tax year 2569 (income 2026): paper by 31 March 2570; the online extension date is announced each year (รอยืนยัน, expect about 8 April 2570). Refunds go to PromptPay linked to the national ID, so register before filing. Late filing: surcharge 1.5% per month on tax due plus a fine. Form dates checked 2026-10-06 (sources in [`references/sources.md`](references/sources.md)).

Documents to keep (50 ทวิ · dividend and interest certificates · broker and crypto statements · foreign remittance records): [`references/documents-to-keep.md`](references/documents-to-keep.md).

## Check before done
- [ ] The tax year is stated.
- [ ] Every income source is sorted, and each optional item was computed both ways.
- [ ] The form is ภ.ง.ด.90 if any dividend or interest is included, not 91.
- [ ] Unverified numbers are marked `(รอยืนยัน)`.

## References
- [`references/investment-income-rules.md`](references/investment-income-rules.md) — open at step 2: per-income-type table, staking and airdrops, dividend credit formula.
- [`references/worked-example.md`](references/worked-example.md) — open to see a full comparison of final tax versus including income.
- [`references/documents-to-keep.md`](references/documents-to-keep.md) — open at step 5 for the full document list.
- [`references/sources.md`](references/sources.md) — sources and check dates for form deadlines.
