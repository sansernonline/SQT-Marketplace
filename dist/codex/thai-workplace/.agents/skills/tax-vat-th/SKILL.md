---
name: tax-vat-th
description: Use when a Thai company asks what to file this month, whether to register for VAT, how much to withhold or late penalties. PP 30, PND 1, 3, 53, 50, 51, e-WHT.
---

# Thai VAT, Withholding Tax and Company Filing Calendar

Which form, which date, how much to withhold, and what filing late costs. This is general information, not tax advice. A licensed accountant (ผู้สอบบัญชี / สำนักงานบัญชี) signs off real filings.

## 1. Do you have to register for VAT?

| Situation | Rule |
|---|---|
| Revenue from VAT-able goods/services **over 1.8 million baht a year** | Must register (ภ.พ.01) within **30 days** of the day revenue passes 1.8 M |
| Revenue at or under 1.8 M | Exempt, but may register voluntarily — then ภ.พ.30 is due every month and leaving the system is not easy |
| Exempt activities (ม.81) — e.g. unprocessed farm produce, healthcare, education, residential rent | No VAT on that revenue |
| Registered | Revenue Department issues **ภ.พ.20** (certificate) — display it at the place of business |
| Change of name, address, branch, closing down | **ภ.พ.09** |

- VAT rate: **7%** (6.3% + local tax 0.7%), reduced from the statutory 10%, extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to **30 Sep 2570**.
- Registration is online through RD e-Registration (rd.go.th).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.prd.go.th/th/content/category/detail/id/33/iid/526275 · https://www.rd.go.th

## 2. Monthly and yearly calendar

| Form | What | Paper deadline | e-Filing deadline |
|---|---|---|---|
| ภ.พ.30 | VAT return — **every month, even with zero sales** | 15th of next month | 23rd (15 + 8 days) |
| ภ.ง.ด.1 | WHT on salary and wages | 7th of next month | 15th |
| ภ.ง.ด.2 | WHT on interest/dividends paid to individuals | 7th | 15th |
| ภ.ง.ด.3 | WHT on payments to **individuals** (services, rent, fees) | 7th | 15th |
| ภ.ง.ด.53 | WHT on payments to **companies / juristic persons** | 7th | 15th |
| ภ.ง.ด.54 | WHT on payments to **foreign** juristic persons not doing business in Thailand | 7th | 15th |
| ภ.พ.36 | Self-assessed VAT on imported services | 7th | 15th |
| ภ.ง.ด.1ก | Annual summary of employee income and WHT | end of February | per RD announcement |
| ภ.ง.ด.51 | Half-year corporate income tax (estimate) | within 2 months after month 6 of the accounting year | + 8 days |
| ภ.ง.ด.50 | Annual corporate income tax | within **150 days** after year end | + 8 days |

- The **+8 days for e-Filing** is an RD extension currently covering returns due **1 Feb 2567 – 31 Jan 2570**. Check whether it is renewed before planning dates after Jan 2570.
- A due date on a weekend or public holiday moves to the next working day (see `thai-holidays`).
- For a 31 December year end: ภ.ง.ด.51 by 31 Aug (e-Filing 8 Sep); ภ.ง.ด.50 by about 29 May (150 days) + 8 for e-Filing.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://rd.go.th/49808.html · https://www.rd.go.th/fileadmin/user_upload/kormor/newlaw/FilingExtension_4.pdf

## 3. Withholding tax — how much

Full table with legal basis and edge cases: [references/wht-rates.md](references/wht-rates.md). The ones used every week:

| Payment | To company (ภ.ง.ด.53) | To individual (ภ.ง.ด.3) |
|---|---|---|
| Services, hire of work (ค่าบริการ / ค่าจ้างทำของ) | 3% | 3% |
| Rent (ค่าเช่า) — property, equipment, vehicles | 5% | 5% |
| Advertising (ค่าโฆษณา) | 2% | 2% |
| Transport (ค่าขนส่ง) — not public passenger transport | 1% | 1% |
| Professional fees (วิชาชีพอิสระ — lawyer, accountant, architect, doctor) | 3% | 3% |
| Prizes / lucky draws | 5% | 5% |

- Withhold only when a single payment is **1,000 baht or more** (or smaller payments under 1 contract that add up to 1,000+).
- The base is the amount **before VAT**.
- Give the payee **หนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)** — fields in `payroll-th`.

### e-Withholding Tax (e-WHT)

Pay through a bank that supports e-WHT and the bank deducts, files and remits — no ภ.ง.ด.3/53 for those payments and no paper 50 ทวิ. The rate for services, rent, advertising, professional fees and commission is cut to **1%**. Cabinet approved extending this from 1 Jan 2569 to **31 Dec 2570** (รอยืนยัน — check the พ.ร.ฎ. was published in ราชกิจจานุเบกษา).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=601636 · https://www.kasikornbank.com/th/business/sme/financial-services/ecertificate/Pages/e-withholding-tax.aspx

## 4. Late filing and late payment

| Item | Rule |
|---|---|
| เงินเพิ่ม (surcharge) | **1.5% per month** or part of a month on unpaid tax, capped at the tax amount — income tax, WHT and VAT |
| เบี้ยปรับ VAT (penalty) | Up to 2× the tax (ม.89); reduced for voluntary late filing — commonly 2% within 15 days, 5% within 15–30 days, 10% after 30 days (รอยืนยัน against current ระเบียบกรมสรรพากร ป.4/2528) |
| ค่าปรับอาญา for a late return | Up to 2,000 baht (ม.35); usual settlement 100–200 baht per WHT return and 300–500 baht per ภ.พ.30 (รอยืนยัน) |
| Under-estimated ภ.ง.ด.51 | Estimate more than 25% below actual profit without reasonable cause: 20% surcharge on the shortfall |

## Workflow

1. Ask: entity type (บริษัท / หจก. / บุคคลธรรมดา), VAT registered or not, accounting year end, pays salaries, pays suppliers or foreigners.
2. Build the calendar from section 2 — only the forms that apply. Shift dates for weekends/holidays.
3. For each payment the user mentions, give the WHT rate, form and 50 ทวิ obligation.
4. Document checklist per form: sales tax report (รายงานภาษีขาย), purchase tax report (รายงานภาษีซื้อ) with original tax invoices, payment vouchers, 50 ทวิ copies, payroll register.
5. If anything is late, compute the surcharge from section 4 and tell the user to file now. The cost grows every month.
6. End with the handoff list for the accountant.

## Worked example — a service payment

Company pays a design agency (บริษัท) 20,000 baht + VAT 7% = 21,400.

- WHT 3% × 20,000 = **600** → pay the agency 21,400 − 600 = **20,800**
- Issue 50 ทวิ for 600; file ภ.ง.ด.53 and remit 600 by the 7th (paper) / 15th (e-Filing) of next month.
- Through e-WHT at 1%: withhold 200, pay 21,200, the bank files.
- Paid 2 months late: surcharge 600 × 1.5% × 2 = 18 baht plus the settlement fine.

## Related

`payroll-th` (ภ.ง.ด.1, 50 ทวิ) · `e-tax-invoice` · `dbd-annual-filing` (ภ.ง.ด.50) · `social-security-th` · `thai-holidays` · `doc-quotation` · `tax-basics-th` in `trading-finance` (personal investment tax).
