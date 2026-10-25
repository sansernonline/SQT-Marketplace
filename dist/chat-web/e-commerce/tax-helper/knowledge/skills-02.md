# skill: social-security-th

Use when asking about Thai social security (sections 33, 39, 40), wage cap, benefits or SSO filings.

# Thai Social Security (ประกันสังคม)

Who pays how much, what the money buys, and what the employer must file by when. This is general information, not legal advice. The Social Security Office (สำนักงานประกันสังคม, SSO, hotline 1506) has the final say.

## 1. The three kinds of insured person

| Section | Who | Base and rate | Monthly amount |
|---|---|---|---|
| **มาตรา 33** | Employees aged 15–60 of an employer with 1+ staff | 5% employee + 5% employer + 2.75% government, on wages between **1,650** and the cap | max **875** each side (2569–2571) |
| **มาตรา 39** | Former ม.33 who paid 12+ months and left within 6 months, choosing to stay in | 9% of a fixed base of **4,800** | **432** |
| **มาตรา 40** | Self-employed / informal workers not in ม.33 | Choose a plan | **70 / 100 / 300** |

### The wage cap is rising (มาตรา 33)

| Period | Wage cap | Max contribution (each of employee and employer) |
|---|---|---|
| until 31 Dec 2568 | 15,000 | 750 |
| **1 Jan 2569 – 2571** | **17,500** | **875** |
| 2572 – 2574 | 20,000 | 1,000 |
| 2575 onwards | 23,000 | 1,150 |

The 5% employee share covers: sickness, maternity, disability, death 1.5% · child allowance and old age 3% · unemployment 0.5%.
Minimum base 1,650 baht (ข่าวอ้างข้อความกฎกระทรวง "ไม่ต่ำกว่า 1,650 ไม่เกิน 17,500 ใช้ตั้งแต่ 1 ม.ค. 2569" ตรวจ 2026-10-22 · รอยืนยัน กับราชกิจจานุเบกษา).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/2025/550753 · https://www.krungsri.com/th/krungsri-the-coach/life/good-life/sso-section-33-rate-increase · https://www.bangkokbiznews.com/health/labour/1136027

## 2. Benefits (มาตรา 33 — seven cases)

| Case | Main benefit | Qualifying contributions |
|---|---|---|
| Sickness (non-work) | Free treatment at the chosen hospital; sick-pay 50% of wage for days off beyond employer-paid sick leave, up to 90 days per time / 180 per year | 3 months within the last 15 |
| Maternity | Lump sum **15,000** per birth + maternity cash 50% of wage for 90 days (รอยืนยัน whether SSO days changed with the 120-day leave law) + antenatal care up to 1,500 | 5 months within the last 15 |
| Disability | Monthly cash for life depending on severity, plus treatment | 3 months within the last 15 |
| Death (non-work) | Funeral grant 50,000 + survivor's lump sum by contribution years (รอยืนยัน) | 1 month within the last 6 |
| Child allowance | 1,000 per month per child aged 0–6, up to 3 children | 12 months within the last 36 |
| Old age | Pension 20% of the average last-60-months wage, +1.5% per year beyond 15 years — if 180+ months paid; otherwise lump sum | 180 months for pension |
| Unemployment | Laid off: 60% of wage for up to 180 days (กฎกระทรวง ฉบับที่ 2 พ.ศ. 2568, effective 28 Jun 2568) — wage is the capped wage, so the ceiling is 9,000/month on the 15,000 cap and would be 10,500 on the 17,500 cap from 1 Jan 2569 (รอยืนยัน whether SSO applies the new cap to this benefit; ตรวจ 2026-10-23 ไม่พบแหล่งทางการ) · resigned or contract ended: 30% for up to 90 days · register with กรมการจัดหางาน within 30 days | 6 months within the last 15 |

มาตรา 39 gets the same except unemployment. มาตรา 40 benefits depend on the plan (70 = sickness, disability, death · 100 = + old-age lump sum · 300 = + child allowance).

## 3. Workmen's Compensation Fund (กองทุนเงินทดแทน)

- **Employer pays alone** — employees never contribute. Covers injury, illness, disability or death **from work**.
- Rate **0.2–1.0%** of annual payroll by business-risk category, applied to wages up to **240,000 baht per employee per year** (รอยืนยัน the per-head cap).
- Pay the estimated contribution by **31 January** each year; file the actual wage report (กท.20ก) by **28 February**.
- Work injury: employer reports on **กท.16** within **15 days** of knowing; the employee gets treatment at a network hospital and 70% of wage for days off.

## 4. Provident fund (กองทุนสำรองเลี้ยงชีพ, PVD) basics

- Voluntary, set up by the employer with an asset manager under พ.ร.บ.กองทุนสำรองเลี้ยงชีพ 2530. Separate from SSO.
- Employee saves 2–15% of wage; employer contributes at least the employee's rate and not more than 15%.
- Employer's share can vest by years of service (e.g. 0% under 1 year → 100% at 5 years) — the fund's rules say.
- Tax: employee contribution deductible up to 15% of wage, combined cap 500,000 with other retirement savings (see `payroll-th`).

## 5. Employer deadlines

| What | Form | Deadline |
|---|---|---|
| Register as employer when hiring the first employee | สปส.1-01 | within 30 days |
| Register a new employee | สปส.1-03 | within 30 days of start |
| Employee leaves | สปส.6-09 | by the 15th of the month after leaving |
| Monthly contribution and wage report | **สปส.1-10** | by the **15th** of the following month (e-Service at sso.go.th, bank or counter) |
| Late monthly contribution | — | surcharge **2% per month** on the unpaid amount |

## Workflow

1. Identify the section (33 / 39 / 40) and, for employers, headcount and payroll.
2. Compute the contribution: min(max(wage, 1,650), cap) × 5% — round to the baht per SSO rules.
3. For a claim, list the qualifying condition from section 2, the documents (ID card, bank book, medical certificate or birth certificate) and where to file (e-Self Service / SSO branch).
4. For employers, add section 5 dates to the calendar from `tax-vat-th`.

## Worked example

Salary 30,000. Base capped at 17,500 → employee 875, employer 875. Salary 12,000 → 600 each. Employer with 10 staff at 20,000 remits 17,500 SSO by the 15th (8,750 employer share + 8,750 withheld from staff), plus Workmen's Compensation at, say, 0.2% × (20,000 × 12 × 10) = 4,800 for the year.

## Related

`payroll-th` (deduction in the payslip) · `labour-law-basics` (leave, maternity) · `tax-vat-th` · `thai-holidays`.


---

# skill: e-tax-invoice

Use when a Thai VAT-registered business issues or checks tax invoices (Section 86/4, e-Tax Invoice).

# Thai Tax Invoice and e-Tax Invoice

If a tax invoice misses even 1 required field, the buyer cannot claim the input VAT. This is general information, not tax advice. The Revenue Department (etax.rd.go.th) and the company accountant have the final say.

## 1. Who must issue what

| Who | Document |
|---|---|
| VAT-registered seller, every sale of goods or service | **ใบกำกับภาษี (full tax invoice)** — issued at the tax point (delivery of goods / receipt of payment for services) |
| VAT-registered retailer selling to consumers, with RD approval | may issue **ใบกำกับภาษีอย่างย่อ (abbreviated)** instead |
| Not VAT-registered | **cannot** issue a tax invoice; issue an ordinary receipt/invoice (see `doc-quotation`) |

## 2. Full tax invoice — fields required by ม.86/4

| # | Field | Common mistake |
|---|---|---|
| 1 | The words **"ใบกำกับภาษี"** shown prominently | Titled only "ใบเสร็จรับเงิน" |
| 2 | Seller's **name, address and 13-digit tax ID** | Old address after moving office |
| 3 | Buyer's **name and address**; and, per อธิบดี notice ฉบับที่ 199, the buyer's tax ID and **branch** ("สำนักงานใหญ่" or "สาขาที่ 00001") when the buyer is VAT-registered | Branch missing |
| 4 | **Serial number** of the invoice (and book number, if any) | Duplicated numbers across branches |
| 5 | Name, type, kind, quantity and value of goods/services | "ค่าบริการ" with no description |
| 6 | **VAT amount shown separately** from the price | VAT folded into the total |
| 7 | **Date** of issue | |
| 8 | Seller's branch ("สำนักงานใหญ่" / "สาขาที่ ...") and any other item set by อธิบดี | |

- Language Thai, currency baht; foreign language/currency allowed only with RD approval or under the RD notice that allows English with baht figures (รอยืนยัน the current notice before relying on it).
- Combined documents are fine — "ใบแจ้งหนี้/ใบกำกับภาษี", "ใบเสร็จรับเงิน/ใบกำกับภาษี" — as long as every field is present.
- Corrections: never alter an issued invoice; issue **ใบลดหนี้** (credit note, ม.86/10) or **ใบเพิ่มหนี้** (debit note, ม.86/9), or cancel and re-issue.

## 3. Abbreviated tax invoice (ม.86/6)

Retail to consumers only, with permission. Must show: "ใบกำกับภาษีอย่างย่อ", seller name or abbreviated name and tax ID, serial number, POS/machine number if from a cash register, description and price, price **including VAT** (state "VAT included" / ราคารวมภาษีมูลค่าเพิ่มแล้ว), date. The buyer **cannot** claim input VAT from it — a business buyer must ask for a full tax invoice.

## 4. Electronic schemes

| | **e-Tax Invoice & e-Receipt** | **e-Tax Invoice by Email** |
|---|---|---|
| Who | Any VAT-registered business (no revenue limit) | VAT-registered with revenue **not over 30 M baht/year** (รอยืนยัน — a FlowAccount article dated 19 Sep 2568 reports that a 2567 RD change lets businesses above 30 M use Time Stamp too, yet the same article still prints "not over 30 M"; rd.go.th/27659 shows nav updated 13 Feb 2025; confirm on rd.go.th before advising a >30 M client) |
| Format | XML to the ETDA standard (ขมธอ.3-2560), digitally signed with a CA certificate | PDF/A-3 attached to an email |
| Signing | Own certificate, or via a registered Service Provider | Time-stamped by the central mailbox |
| Sending | Upload to RD within the 15th of the following month (or real-time via a Service Provider) | Send to the buyer and **cc csemail@etax.teda.th** |
| Registration | Apply on etax.rd.go.th (ใบคำขอ ก.อ.01) | Register at rd.go.th/27659.html |
| Typical user | Medium/large business, ERP, high volume | SME issuing by hand from accounting software |

- Only certain email providers registered with RD may send (รอยืนยัน — sources say Gmail/Google Workspace).
- e-Receipt is also how a buyer gets an "e-Receipt" for tax incentives (e.g. Easy e-Receipt for individuals) — paper invoices do not qualify for those.
- Keep electronic records for at least 5 years (longer if RD orders it during an audit), in the original format.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th/27659.html · https://etda.or.th/en/Our-Service/Digital-Trusted-services-Infrastructure/TEDA/ETAX.aspx · https://www.ktc.co.th/article/knowledge/what-is-etax-invoice

## Workflow

1. Confirm VAT registration (ภ.พ.20) and annual revenue → pick the scheme from section 4.
2. Build the template with every field in section 2; number by branch.
3. For by Email: register, generate PDF/A-3, send to buyer with cc to the central mailbox — the time-stamped reply is the proof.
4. For incoming invoices: check all 8 fields before booking input VAT on the ภ.พ.30 purchase report (รายงานภาษีซื้อ). If a field is missing, ask the supplier to re-issue.
5. Add a PromptPay QR on the invoice for faster payment (`promptpay-qr`).

## Worked example (header block)

```
ใบแจ้งหนี้/ใบกำกับภาษี  (ต้นฉบับ)                 เลขที่ TX2610-0153
บริษัท ตัวอย่าง จำกัด (สำนักงานใหญ่)  เลขประจำตัวผู้เสียภาษี 0105xxxxxxxxx
ที่อยู่ ...                                       วันที่ 6 ตุลาคม 2569
ลูกค้า: บริษัท ลูกค้า จำกัด สาขาที่ 00002  เลขประจำตัวผู้เสียภาษี 0105yyyyyyyyy  ที่อยู่ ...
100 กล่องบรรจุภัณฑ์ ตามใบเสนอราคา QT2610-0077   200.00   20,000.00
                            รวมเป็นเงิน 20,000.00
                    ภาษีมูลค่าเพิ่ม 7%   1,400.00
                         จำนวนเงินรวมทั้งสิ้น 21,400.00 (สองหมื่นหนึ่งพันสี่ร้อยบาทถ้วน)
```

## Related

`doc-quotation` · `tax-vat-th` (ภ.พ.30, WHT on the payment) · `promptpay-qr` · `dbd-annual-filing`.
