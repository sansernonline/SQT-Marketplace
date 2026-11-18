# skill: tax-vat-th

Use when a Thai company asks what tax to file

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

## 2. Monthly and yearly calendar

| Form | What | Paper deadline |
|---|---|---|
| ภ.พ.30 | VAT return — **every month, even with zero sales** | 15th of next month |
| ภ.ง.ด.1 | Withholding tax (WHT) on salary and wages | 7th of next month |
| ภ.ง.ด.2 | WHT on interest/dividends paid to individuals | 7th |
| ภ.ง.ด.3 | WHT on payments to **individuals** (services, rent, fees) | 7th |
| ภ.ง.ด.53 | WHT on payments to **companies / juristic persons** | 7th |
| ภ.ง.ด.54 | WHT on payments to **foreign** juristic persons not doing business in Thailand | 7th |
| ภ.พ.36 | Self-assessed VAT on imported services | 7th |
| ภ.ง.ด.1ก | Annual summary of employee income and WHT | end of February |
| ภ.ง.ด.51 | Half-year corporate income tax (estimate) | within 2 months after month 6 of the accounting year |
| ภ.ง.ด.50 | Annual corporate income tax | within **150 days** after year end |

- **e-Filing extension:** filing online gets extra days on top of the paper deadline. A Ministry of Finance announcement sets the number of days and the window of due dates it covers, and each announcement ends on a fixed date. e-Filing deadline = paper deadline + extension days, then shift for holidays.
- Look up the current e-Filing extension (number of extra days, and whether the window covers the due date in question) at https://rd.go.th/49808.html · https://www.rd.go.th/fileadmin/user_upload/kormor/newlaw/FilingExtension_4.pdf. Look it up live (WebSearch/WebFetch) before quoting; if the page will not open, mark the value (รอยืนยัน).
- A due date on a weekend or public holiday moves to the next working day (see `thai-holidays`).
- For a 31 December year end: ภ.ง.ด.51 by 31 Aug; ภ.ง.ด.50 by 30 May (150 days; 29 May when February has 29 days). Add the e-Filing extension for online filing. When 30 May falls on a Sunday (as in 2570), the next working day applies (RD Order ป.117/2545, https://www.rd.go.th/10514.html, checked 22 ต.ค. 2569).

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

## 4. Late filing and late payment

| Item | Rule |
|---|---|
| เงินเพิ่ม (surcharge) | **1.5% per month** or part of a month on unpaid tax, capped at the tax amount — income tax, WHT and VAT |
| เบี้ยปรับ VAT (penalty) | Up to 2× the tax (ม.89); late ภ.พ.30 filed with payment before any written notice is cut to a share **of the penalty**: 2% if paid within 15 days of the due date, 5% within 15–30 days, 10% within 30–60 days, 20% after 60 days (คำสั่ง ท.ป.81/2542 ข้อ 5(1), amended by ท.ป.369/2569 from 3 Jul 2569) |
| ค่าปรับอาญา for a late return | Up to 2,000 baht (ม.35); usual settlement 100–200 baht per WHT return and 300–500 baht per ภ.พ.30 (รอยืนยัน) |
| Under-estimated ภ.ง.ด.51 | Estimate more than 25% below actual profit without reasonable cause: 20% surcharge on the shortfall |

## Workflow

1. Ask: entity type (บริษัท / หจก. / บุคคลธรรมดา), VAT registered or not, accounting year end, pays salaries, pays suppliers or foreigners.
2. Build the calendar from section 2 — only the forms that apply. Shift dates for weekends/holidays.
3. For each payment the user mentions, give the WHT rate, form and 50 ทวิ obligation.
4. Document checklist per form: sales tax report (รายงานภาษีขาย), purchase tax report (รายงานภาษีซื้อ) with original tax invoices, payment vouchers, 50 ทวิ copies, payroll register.
5. If anything is late, compute the surcharge from section 4 and tell the user to file now. The cost grows every month.
6. End with the handoff list for the accountant.

## Worked example

A 20,000 baht + VAT service payment to a company: WHT 600, pay 20,800, file ภ.ง.ด.53. Full calculation (including e-WHT and late surcharge): [references/worked-example.md](references/worked-example.md).

## Related

`payroll-th` (ภ.ง.ด.1, 50 ทวิ) · `e-tax-invoice` · `dbd-annual-filing` (ภ.ง.ด.50) · `social-security-th` · `thai-holidays` · `doc-quotation` · `tax-basics-th` in `trading-finance` (if installed) (personal investment tax).

## เรียกเป็นคำสั่ง

`/e-commerce:tax-vat-th [company|personal] [--month <n>]`

Run `tax-vat-th` with the `tax-helper` agent for: **$ARGUMENTS**

Verifies dates against current RD announcements rather than reusing last year's calendar, and ends with the accountant handoff checklist.

## References

- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources


## reference: sources.md

# Sources · tax-vat-th

Last checked 2026-10-25 (VAT surcharge) · sources: https://www.rd.go.th/3361.html , https://www.prosofterp.com/Article/Detail/141129 , https://www.auditorasia.com/th/process_add_money · criminal fines of 100/200 and 300/500 baht (filing late by no more than 7 days / more than 7 days) were found only in secondary sources; no official regulation found yet

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=601636 · https://www.kasikornbank.com/th/business/sme/financial-services/ecertificate/Pages/e-withholding-tax.aspx

ตรวจล่าสุด 2026-10-25 (พ.ร.ฎ. ฉบับที่ 807 ลงราชกิจจานุเบกษา 23 ส.ค. 2569 ใช้ 1 ต.ค. 2569 – 30 ก.ย. 2570) · แหล่ง: https://www.rd.go.th/1603.html · https://www.thaipbs.or.th/news/content/509779 · https://www.thansettakij.com/economy/667217 · https://www.prd.go.th/th/content/category/detail/id/33/iid/526275


## reference: wht-rates.md

# Withholding tax rates by payment type

Legal basis: ประมวลรัษฎากร ม.3 เตรส, ม.50, ม.69 ทวิ, ม.70 and คำสั่งกรมสรรพากร ท.ป.4/2528. This is general information, not tax advice. Confirm unusual cases with an accountant.

## 1. Payments to Thai companies and individuals

| Payment type | Individual (ภ.ง.ด.3) | Company (ภ.ง.ด.53) |
|---|---|---|
| Services / hire of work (ค่าจ้างทำของ, ค่าบริการ) | 3% | 3% |
| Professional fees — law, medicine, engineering, architecture, accounting, fine arts | 3% | 3% |
| Contractor who supplies materials (ม.40(7)) | 3% | 3% |
| Rent of land, buildings, machinery, vehicles | 5% | 5% |
| Advertising fees | 2% | 2% |
| Transport (not public passenger transport) | 1% | 1% |
| Commission / brokerage | progressive rate (individual, ม.40(2)) | 3% |
| Prizes, competitions, lucky draws | 5% | 5% |
| Sales promotion rewards | 3% | 3% |
| Non-life insurance premium | — | 1% |
| Services, rent, advertising, professional fees or commission paid through e-WHT | 1% (to 31 Dec 2570, รอยืนยัน) | 1% |

## 2. Investment income

| Payment | Individual (ภ.ง.ด.2) | Company (ภ.ง.ด.53) |
|---|---|---|
| Interest (deposits, bonds, loans) | 15% | 1% |
| Dividends from a Thai company | 10% | 10%, unless the recipient meets the ม.65 ทวิ(10) exemption (รอยืนยัน case by case) |

## 3. Payments abroad (ภ.ง.ด.54)

| Payment to a foreign juristic person not doing business in Thailand | Rate |
|---|---|
| Service fees, royalties, interest, rent | 15% (reduced under a Double Tax Agreement if the payee gives a residence certificate) |
| Dividends | 10% |
| Imported service VAT | self-assess 7% on ภ.พ.36 |

## 4. Rules that trip people up

- **1,000-baht rule** — no withholding on a single payment under 1,000 baht unless it is 1 of several payments under 1 contract that total 1,000+.
- **Base excludes VAT** — withhold on the price before VAT when VAT is shown separately.
- **Gross-up** — if you agree to bear the payee's tax, the tax itself is income: tax = payment × rate ÷ (1 − rate). Example: net 10,000 at 3% → tax 309.28, gross 10,309.28.
- **Wrong form** — individual on ภ.ง.ด.3, juristic person on ภ.ง.ด.53, employee on ภ.ง.ด.1. Mixing them up means amending both.
- **Deadline** — remit by the 7th of the following month on paper, or by the e-Filing deadline online (paper date + the current extension, see SKILL.md section 2); surcharge 1.5% per month after that.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th (คำสั่ง ท.ป.4/2528) · https://www.infoquest.co.th/?p=601636 (e-WHT)


## reference: worked-example.md

# Worked example · tax-vat-th

## Worked example — a service payment

Company pays a design agency (บริษัท) 20,000 baht + VAT 7% = 21,400.

- WHT 3% × 20,000 = **600** → pay the agency 21,400 − 600 = **20,800**
- Issue 50 ทวิ for 600; file ภ.ง.ด.53 and remit 600 by the 7th of next month on paper, or by the e-Filing deadline online (section 2).
- Through e-WHT at 1%: withhold 200, pay 21,200, the bank files.
- Paid 2 months late: surcharge 600 × 1.5% × 2 = 18 baht plus the settlement fine.


---

# skill: payroll-th

Use when running Thai monthly payroll

# payroll-th — Thai monthly payroll: gross to net pay, filing and remittance

General information, not tax advice. Check unusual cases (bonus, stock, foreign staff) with an accountant.

## Use when
- Running monthly payroll: gross pay − social security (SSO) − provident fund (PVD) − personal income tax (PIT) = net pay, then file and remit.
- Year-end filing (ภ.ง.ด.1ก, 50 ทวิ).

Not for: SSO rules → `social-security-th` · OT rates and leave → `labour-law-basics` · VAT and other tax calendar → `tax-vat-th` · pay day falling on a holiday → `thai-holidays`.

## Steps

| # | Step | Output | Deadline |
|---|---|---|---|
| 1 | Close attendance: OT, unpaid leave, new joiners, leavers, then run the 9 checks below | timesheet | before cut-off |
| 2 | Gross = salary + OT + allowances + commission + taxable benefits | payroll register | |
| 3 | SSO employee and employer share at the rate, floor and cap in `social-security-th` section 1 | employee + employer share | |
| 4 | PVD employee % and employer % (if the company has a fund; rules in "Provident fund (PVD) basics" below) | | |
| 5 | PIT withholding by annualisation (below) | withholding tax (WHT) per head | |
| 6 | Net pay = gross − SSO − PVD − PIT − other agreed deductions | payslip | pay day per contract (at least once a month, ม.70) |
| 7 | File **ภ.ง.ด.1** and remit WHT | RD receipt | 7th next month (paper); e-Filing = paper deadline + the current e-Filing extension (look it up live, `tax-vat-th` section 2) |
| 8 | File **สปส.1-10** and remit SSO (both shares) | SSO receipt | deadline in `social-security-th` section 5 |
| 9 | Remit PVD to the fund manager | | per fund rules |
| 10 | Archive register, payslips, receipts: keep 5 years minimum, 7 recommended (`sme-bookkeeping` section 2; per a Revenue Department ruling, not yet checked against the current statute) | | |

Year end: **ภ.ง.ด.1ก** (annual summary per employee) by end of February; give every employee **50 ทวิ** for the year (by February, รอยืนยัน exact day) and within 1 month after anyone leaves (รอยืนยัน).

### Check the inputs before step 5
Most errors are in the timesheet and employee list, not the tax maths. Run these 9 checks against the attendance file and last month's register:
1. Clock-in with no clock-out.
2. OT far above this person's normal month (real peak or typo; OT needs the employee's consent, `labour-law-basics` section 1, and pays 1.5× or 3×).
3. Zero hours for someone who normally works (unrecorded leave, left, or missing file).
4. Wage rate differs from last month (raise not approved in writing, or wrong row).
5. Duplicate or overlapping rows.
6. Leave beyond entitlement (`labour-law-basics` section 3).
7. Someone paid last month is missing (resigned, final pay per `labour-law-basics` section 4, or dropped by mistake).
8. New joiner with no starting documents (no ล.ย.01, no SSO registration).
9. Total payroll differs from last month by more than 10%: explain it in 1 line (new staff, OT, bonus) before paying.

- Never guess a missing time or fix a row quietly. Ask the owner one person and one issue at a time, and write the answer next to the row.
- SSO uses the wage floor and cap in `social-security-th`; a wage above the cap still pays the capped amount.
- The check summary lists names and issues only, never ID card numbers or bank account numbers (`pdpa-workflow`).

### PIT withholding on salary (ม.40(1)), annualisation per ม.50(1) ประมวลรัษฎากร
1. Annual income = monthly taxable pay × pay periods in the year (12, or remaining months for a mid-year joiner + income already paid).
2. Less expense deduction: 50% of income, max **100,000**.
3. Less allowances declared on ล.ย.01: personal **60,000**; spouse with no income 60,000; child 30,000 each (60,000 for 2nd+ child born 2561 or later); parents 30,000 each (aged 60+, income under 30,000); **SSO actually paid** (up to 12 × the monthly maximum in `social-security-th` section 1 = 10,500 in 2569, รอยืนยัน); PVD employee contributions (within 15% of wage, overall retirement cap 500,000); life/health insurance as declared.
4. Apply the progressive rates → annual tax. Bracket table: `seller-tax-basics` "Income tax brackets"; the script reads the same rates from `scripts/rates.json`.
5. Monthly WHT = annual tax ÷ 12. Recalculate when salary changes or a bonus is paid.

Last checked 2026-10-06 (sources in [`references/sources.md`](references/sources.md)).

**Bonus month:** compute tax on (annual salary + bonus) and on annual salary alone; the difference is withheld in the bonus month on top of the normal monthly WHT.

**Script:** `node payroll.mjs <file.json> [--json]` runs steps 3–6 per person (input format, path and warnings: [`references/script-and-example.md`](references/script-and-example.md)). Rates live in `scripts/rates.json`; before the January run, check rd.go.th and edit it. The result is supporting information, not tax advice.

### Provident fund (PVD) basics
- Voluntary, set up by the employer with an asset manager under พ.ร.บ.กองทุนสำรองเลี้ยงชีพ 2530. Separate from SSO.
- Employee saves 2–15% of wage; employer contributes at least the employee's rate and not more than 15%.
- Employer's share can vest by years of service (e.g. 0% under 1 year → 100% at 5 years) — the fund's rules say.
- Tax: the employee contribution is an allowance; its limits are in PIT step 3 above.

### ภ.ง.ด.1 and ภ.ง.ด.1ก
- **ภ.ง.ด.1** monthly: 1 line per employee paid (tax ID, name, pay date, amount paid, tax withheld). No return needed in a month where nothing was paid.
- **ภ.ง.ด.1ก** yearly: totals per employee for the calendar year; must agree with the 12 ภ.ง.ด.1 returns and the 50 ทวิ issued (the usual audit question).
- 50 ทวิ certificate fields and template: [`references/50-tawi.md`](references/50-tawi.md).

### Rules
- Collect ล.ย.01 (allowance declaration) from each employee at hiring and each January; no form means personal allowance only.
- Never pay salary in cash without a signed receipt; bank transfer is the record.
- Payroll data is personal data: access-limited (`pdpa-workflow`).

## Check before done
- The 9 input checks were run and any flag was resolved with the owner.
- Net pay = gross − SSO − PVD − PIT − other deductions, and ภ.ง.ด.1 and สปส.1-10 dates are stated.
- Tax year rates in `rates.json` match rd.go.th for the current year.

## References
- [`references/script-and-example.md`](references/script-and-example.md) — open when running `payroll.mjs` or checking a worked example
- [`references/50-tawi.md`](references/50-tawi.md) — open when issuing a 50 ทวิ
- [`references/sources.md`](references/sources.md) — sources and check dates

## เรียกเป็นคำสั่ง

`/e-commerce:payroll-th [month|year-end] [--employees <file>]`

Run `payroll-th` with the `tax-helper` agent for: **$ARGUMENTS**

Uses `social-security-th` for the SSO cap and `labour-law-basics` for OT rates. Produces the payroll register, payslip figures, and the filing dates for ภ.ง.ด.1 (7th on paper; e-Filing = paper deadline + the current extension, looked up live per `tax-vat-th` section 2) and สปส.1-10 (deadline in `social-security-th` section 5), ending with the accountant handoff checklist.


## reference: 50-tawi.md

# Withholding tax certificate under section 50 bis (หนังสือรับรองการหักภาษี ณ ที่จ่าย ตามมาตรา 50 ทวิ) — fields

The official form is on rd.go.th (แบบฟอร์ม 50 ทวิ). Many accounting programs print it; this list is for checking or building one.

## Copies

ฉบับที่ 1 (สำหรับผู้ถูกหักภาษี ใช้แนบพร้อมกับแบบแสดงรายการภาษี) · ฉบับที่ 2 (สำหรับผู้ถูกหักภาษี เก็บไว้เป็นหลักฐาน). Payer keeps its own copy.

## Fields

| Section | Field |
|---|---|
| Header | เล่มที่ / เลขที่ (running number) |
| ผู้มีหน้าที่หักภาษี ณ ที่จ่าย | ชื่อ · เลขประจำตัวผู้เสียภาษีอากร (13 หลัก) · ที่อยู่ |
| ผู้ถูกหักภาษี ณ ที่จ่าย | ชื่อ · เลขประจำตัวผู้เสียภาษีอากร / เลขประจำตัวประชาชน · ที่อยู่ |
| ลำดับที่ในแบบ | line number on the return, and tick which return: ภ.ง.ด.1ก · ภ.ง.ด.1ก พิเศษ · ภ.ง.ด.2 · ภ.ง.ด.3 · ภ.ง.ด.2ก · ภ.ง.ด.3ก · ภ.ง.ด.53 |
| ประเภทเงินได้พึงประเมินที่จ่าย | 1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40(1) · 2. ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40(2) · 3. ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40(3) · 4.(ก) ดอกเบี้ย ฯลฯ 40(4)(ก) · 4.(ข) เงินปันผล 40(4)(ข) with the tax-credit sub-lines · 5. การจ่ายเงินได้ที่ต้องหักภาษีตามคำสั่งกรมสรรพากรที่ออกตามมาตรา 3 เตรส (services, rent, advertising, transport …) · 6. อื่น ๆ (ระบุ) |
| Per row | วัน เดือน หรือปีภาษี ที่จ่าย · จำนวนเงินที่จ่าย · ภาษีที่หักและนำส่งไว้ |
| Totals | รวมเงินที่จ่ายและภาษีที่หักนำส่ง · รวมเงินภาษีที่หักนำส่ง (ตัวอักษร) |
| Contributions | เงินที่จ่ายเข้า กบข./กสจ./กองทุนสงเคราะห์ครูโรงเรียนเอกชน · กองทุนประกันสังคม · กองทุนสำรองเลี้ยงชีพ (amounts) |
| ผู้จ่ายเงิน | (1) หัก ณ ที่จ่าย · (2) ออกให้ตลอดไป · (3) ออกให้ครั้งเดียว · (4) อื่น ๆ |
| Sign-off | ขอรับรองว่าข้อความและตัวเลขดังกล่าวข้างต้นถูกต้องตรงกับความจริงทุกประการ · ลงชื่อผู้จ่ายเงิน · วัน เดือน ปี ที่ออกหนังสือรับรอง · ประทับตรานิติบุคคล (ถ้ามี) |

## Fill-in example (employee, full year 2569)

```
เล่มที่ 1  เลขที่ 2569/012
ผู้มีหน้าที่หักภาษี: บริษัท ตัวอย่าง จำกัด  เลขประจำตัวผู้เสียภาษี 0105xxxxxxxxx
ผู้ถูกหักภาษี: นางสาวตัวอย่าง ใจดี  เลขประจำตัวประชาชน 1xxxxxxxxxxxx
ลำดับที่ 12 ในแบบ [x] ภ.ง.ด.1ก
1. เงินเดือน ค่าจ้าง ฯลฯ ม.40(1)   ปีภาษี 2569   600,000.00   20,450.00
รวม                                         600,000.00   20,450.00
รวมเงินภาษีที่หักนำส่ง (ตัวอักษร): สองหมื่นสี่ร้อยห้าสิบบาทถ้วน
กองทุนประกันสังคม 10,500.00   กองทุนสำรองเลี้ยงชีพ 0.00
ผู้จ่ายเงิน [x] (1) หัก ณ ที่จ่าย
ลงชื่อ ................ ผู้จ่ายเงิน   วันที่ 15 กุมภาพันธ์ 2570
```

## Timing

- Vendor payments (ภ.ง.ด.3/53): give at the time of payment.
- Salary: once a year for the whole year, and within 1 month after an employee leaves (รอยืนยัน exact rule on rd.go.th).
- Payments through e-WHT: the bank issues an electronic certificate — no paper 50 ทวิ.

Last checked 2026-10-06 · Sources: https://www.rd.go.th (แบบ 50 ทวิ)


## reference: script-and-example.md

# payroll.mjs details and worked example

## Script

`payroll.mjs` runs all the steps of the annualisation method: annual income → deduct expenses → allowances → progressive tax → divide by 12 periods, together with social security (5% of wages, floor base 1,650 up to the cap, rounded to whole baht) and the employee's provident fund (PVD) contribution. It gives the monthly withholding tax and the net pay per person.

```
node payroll.mjs <file.json> [--json]     # example file: scripts/example.json
node payroll.mjs --self-test
```

Input file: `{ "employees": [ { "name": "...", "gross": 50000, "pvd_employee_pct": 0, "pvd_employer_pct": 0, "spouse": false, "children": 0, "children_2nd_plus": 0, "parents": 0, "other_deductions": 0, "periods": 12 } ] }`

- `name` and `gross` alone are enough to run; the rest default to 0 / false / 12.
- A wrong field makes the script stop with a message that names the field.
- Social security is computed from the average monthly wage (`gross` × `periods` ÷ 12) and spread across periods, so the annual allowance always equals 12 months.
- If the employee PVD exceeds 15% of wages, the script warns and allows only 15% as a deduction.
- The tax brackets, the social security cap and the allowances live in `scripts/rates.json` (it carries the date checked and the source; the script prints them in the result and warns when they are older than 90 days).
- The social security cap and the top rate are checked against `scripts/check/facts.json` at the root of the SQT-Marketplace repo (it does not ship with the plugin).
- Negative net pay, and a PVD value below 1 (for example 0.05 instead of 5), raise a warning.
- When the tax year changes, edit `rates.json` before running in January.
- Bonuses, mid-year hires and income already paid are not included; work them out yourself with the bonus rule in SKILL.md.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/payroll-th/scripts/payroll.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/payroll-th/scripts/payroll.mjs` · Node only, no dependencies.

## Worked example

Single employee, salary 50,000/month, no PVD.

| Line | Baht |
|---|---|
| Annual income 50,000 × 12 | 600,000 |
| Expense 50% capped | −100,000 |
| Personal allowance | −60,000 |
| SSO 875 × 12 | −10,500 |
| **Net income** | **429,500** |
| Tax: 7,500 + (429,500 − 300,000) × 10% | 7,500 + 12,950 = **20,450** |
| **Monthly WHT** 20,450 ÷ 12 | **1,704.17** |

Payslip: gross 50,000 − SSO 875 − WHT 1,704.17 = **net 47,420.83**.


## reference: sources.md

# Sources · payroll-th

- PIT rates (section 2 table): https://www.rd.go.th (personal income tax rates, section 48) · last checked 2026-10-06.
- SSO cap: https://www.infoquest.co.th/2025/550753 · last checked 2026-10-06.
- The 10% payroll-change line (check 9 in section 1a) is a starting value from Anthropic's payroll-prep skill (`anthropics/knowledge-work-plugins` small-business, Apache-2.0, read 2026-11-10; ideas only, no text copied), not measured on Thai payrolls.
