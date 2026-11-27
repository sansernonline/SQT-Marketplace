# skill: thai-tax

Use when a Thai business asks about VAT, e-tax invoices, filing or DBD

# thai-tax — which tax to file, when, and how to issue a tax invoice

> **One rule:** check every rate, threshold and deadline on the Revenue Department (rd.go.th) or the DBD page of the current year before using it; a number from memory is not used.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| A Thai company asks what tax to file, VAT, WHT rates, monthly calendar | [references/tax-vat-th.md](references/tax-vat-th.md) |
| A Thai individual online seller asks about personal tax (ภ.ง.ด.90) | [references/seller-tax-basics.md](references/seller-tax-basics.md) |
| A VAT business issues or checks a tax invoice | [references/e-tax-invoice.md](references/e-tax-invoice.md) |
| A company files year-end DBD accounts and its annual return | [references/dbd-annual-filing.md](references/dbd-annual-filing.md) |

Other files in this folder: `reporting-and-records.md` and `wht-rates.md`. Scripts: `scripts/tax-compare.mjs`, `scripts/thai-id.mjs`.

## Steps every part shares

1. Confirm the rate, threshold or deadline on the official page, and write the date checked.
2. Run the calculation with the script in `scripts/` instead of by hand.
3. End with a checklist of documents and the handoff to the accountant.

## Check before done

- General information, not tax advice. A licensed accountant (ผู้สอบบัญชี or นักบัญชี) signs off every real filing.
- The filing itself is done by the user or the accountant; this skill organises the calendar and the checklist.
- Never alter an issued tax invoice; correct it with a credit note (ใบลดหนี้) or a debit note (ใบเพิ่มหนี้), or cancel and re-issue.
- A tax invoice missing any required field means the buyer cannot claim the input VAT; check every field before issue.
- Late filing: give the surcharge in outline and name the authority; do not promise a waiver.

Whole job with several steps → playbook [year-end](../superuser/references/playbook-year-end.md) (year-end accounts and returns).


## reference: dbd-annual-filing.md

<!-- merged from skill `dbd-annual-filing` on 2026-11-27 · description was: Use when a Thai company files year-end DBD accounts -->
# Year-End Filing — Department of Business Development (DBD) and Revenue Department

Each year end brings 4 deadlines from 2 authorities (DBD and the Revenue Department). This is general information, not legal or accounting advice. The auditor (ผู้สอบบัญชีรับอนุญาต) and the accountant do the actual filing.

## 1. The timeline (company limited, บริษัทจำกัด)

| # | Step | Law | Deadline |
|---|---|---|---|
| 1 | Close books; auditor audits the financial statements (งบการเงิน) | พ.ร.บ.การบัญชี 2543 | before the AGM |
| 2 | Send annual general meeting (AGM) notice to shareholders | ป.พ.พ. ม.1175 | at least 7 days before (14 days if a special resolution is on the agenda); advertise per the articles |
| 3 | **AGM** approves audited statements | ป.พ.พ. ม.1197 | within **4 months** after year end |
| 4 | **บอจ.5** shareholder list | ป.พ.พ. ม.1139 | within **14 days** after the AGM |
| 5 | **Financial statements** to DBD (DBD e-Filing) with AGM minutes and ส.บช.3 | พ.ร.บ.การบัญชี ม.11 | within **1 month** after the AGM approves (so at latest ~5 months after year end) |
| 6 | **ภ.ง.ด.50** corporate income tax + audited statements to RD | ประมวลรัษฎากร ม.68 | within **150 days** after year end; e-Filing = paper deadline + the current e-Filing extension (look it up live, see `tax-vat-th.md` section 2) |

### For a 31 December 2569 year end

| Deadline | Date |
|---|---|
| AGM | by 30 Apr 2570 |
| บอจ.5 | 14 days after the AGM (AGM 28 Apr → by 12 May 2570) |
| Statements to DBD | 1 month after the AGM (AGM 28 Apr → by 28 May 2570) |
| ภ.ง.ด.50 | by 30 May 2570 (Sun) → next working day, Mon 31 May 2570 (RD Order ป.117/2545, https://www.rd.go.th/10514.html, checked 22 ต.ค. 2569) — on e-Filing, add the current e-Filing extension (look it up live, see `tax-vat-th.md` section 2) |

## 2. Partnerships and others

| Entity | AGM | Shareholder list | Financial statements to DBD | ภ.ง.ด.50 |
|---|---|---|---|---|
| บริษัทจำกัด | yes, within 4 months | บอจ.5, 14 days after AGM | 1 month after AGM | 150 days |
| ห้างหุ้นส่วนสามัญนิติบุคคล / ห้างหุ้นส่วนจำกัด (หจก.) | **no** AGM | **no** บอจ.5 | within **5 months** after year end | 150 days |
| บริษัทมหาชนจำกัด | yes (พ.ร.บ.บริษัทมหาชน) | yes | 1 month after AGM | 150 days |
| Foreign company branch / joint venture | no | no | within 5 months | 150 days |

- Small หจก. with registered capital ≤ 5 M, assets ≤ 30 M and revenue ≤ 30 M may use a **Tax Auditor (TA)** instead of a Certified Public Accountant (CPA, ผู้สอบบัญชีรับอนุญาต) for the audit (same thresholds as `thai-business-setup` section 1, which records a check against the DBD manual on 2026-10-23; not re-verified here — รอยืนยัน).

## 3. DBD e-Filing

1. Register the company's user on efiling.dbd.go.th (once; requires director identity verification).
2. The accountant prepares the eXtensible Business Reporting Language (XBRL) file in Excel (DBD template) from the trial balance.
3. Upload: statements (XBRL), auditor's report PDF, AGM minutes approving the statements, **ส.บช.3** (บัญชีรายชื่อผู้ทำบัญชีและรายละเอียด).
4. A director confirms; keep the receipt (ใบตอบรับ).
5. บอจ.5 is filed separately — online via DBD e-Service or at the registration office.

## 4. Fines for late filing

| Failure | Legal maximum | Practice |
|---|---|---|
| Statements not filed on time (พ.ร.บ.การบัญชี ม.27) | fine up to 50,000 baht, plus up to 1,000 baht per day while it continues | DBD settlement schedule by entity type and days late; directors fined personally as well (รอยืนยัน current schedule, see efiling.dbd.go.th/efiling-documents/legal2563.pdf) |
| AGM not held / บอจ.5 late (พ.ร.บ.กำหนดความผิดเกี่ยวกับห้างหุ้นส่วนจดทะเบียน ห้างหุ้นส่วนจำกัด บริษัทจำกัด สมาคม และมูลนิธิ 2499) | fine up to 20,000 baht each (รอยืนยัน) | settled per DBD schedule |
| ภ.ง.ด.50 late | surcharge 1.5% per month on unpaid tax + fine up to 2,000 | see `tax-vat-th.md` |
| Not filing for 3 years in a row | DBD may strike the company off as abandoned (ม.1246 ป.พ.พ.) | |

## Workflow

1. Ask: entity type, accounting year end, auditor booked, any dormant period.
2. Build the timeline backward from section 1 (section 2 for a partnership). Move dates that fall on weekends or holidays (`thai-employment`).
3. Checklist per step: trial balance, bank confirmations, stock count, fixed-asset register, AGM notice and minutes, shareholder register, ส.บช.3, ภ.ง.ด.50 with ภ.ง.ด.51 credit.
4. Book the auditor at least 2 months before the AGM. Auditors are usually fully booked in March–April.
5. Already late? File now, then settle the fine. The fine grows with each day late.

## Related

`tax-vat-th.md` (ภ.ง.ด.50/51, surcharge) · `thai-employment` (ภ.ง.ด.1ก in February) · `thai-business-docs` (AGM notice, letters) · `thai-employment`.

## References

- [`sources.md`](dbd-annual-filing/sources.md) — sources and check dates for section 1; open when re-checking a deadline

## เรียกเป็นคำสั่ง

`/e-commerce:thai-tax [company|partnership] [--year-end <date>]`

Run `thai-tax` with the `tax-helper` agent for: **the user's request**

Shifts dates for weekends and holidays with `thai-employment`, lists the documents per step, flags late-filing fines, and ends with the auditor and accountant handoff checklist.


## reference: e-tax-invoice.md

<!-- merged from skill `e-tax-invoice` on 2026-11-27 · description was: Use when a Thai VAT business issues or checks tax invoices -->
# Thai Tax Invoice and e-Tax Invoice

If a tax invoice misses even 1 required field, the buyer cannot claim the input VAT. This is general information, not tax advice. The Revenue Department (etax.rd.go.th) and the company accountant have the final say.

## 1. Who must issue what

| Who | Document |
|---|---|
| VAT-registered seller, every sale of goods or service | **ใบกำกับภาษี (full tax invoice)** — issued at the tax point (delivery of goods / receipt of payment for services) |
| VAT-registered retailer selling to consumers, with RD approval | may issue **ใบกำกับภาษีอย่างย่อ (abbreviated)** instead |
| Not VAT-registered | **cannot** issue a tax invoice; issue an ordinary receipt/invoice (see `thai-business-docs`) |

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
- Keep electronic records for at least 5 years, 7 recommended (`shop-books` → `references/sme-bookkeeping.md` section 2 — per a Revenue Department ruling, not yet checked against the current statute), in the original format.

## Workflow

1. Confirm VAT registration (ภ.พ.20) and annual revenue → pick the scheme from section 4.
2. Build the template with every field in section 2; number by branch.
3. For by Email: register, generate PDF/A-3, send to buyer with cc to the central mailbox — the time-stamped reply is the proof.
4. For incoming invoices: check all 8 fields before booking input VAT on the ภ.พ.30 purchase report (รายงานภาษีซื้อ). If a field is missing, ask the supplier to re-issue.
5. Add a PromptPay QR on the invoice for faster payment (`shop-books`).

## Script

Run `thai-id.mjs` to check the 13-digit tax ID (เลขประจำตัวผู้เสียภาษีอากร) of the seller or the buyer before it goes on a tax invoice. The last digit is a check digit: `(11 − (Σ digit i × (14 − i), i = 1..12) mod 11) mod 10`. A pass means the number has no typo; it does not prove the company exists (check that on the Revenue Department site). When it fails, the output says which last digit it expected.

```
node thai-id.mjs <file.json> [--json]     # example file: scripts/e-tax-invoice/example.json
node thai-id.mjs 1234567890139 ...        # or pass the numbers directly
node thai-id.mjs --self-test
```

Input file: `{ "ids": ["1234567890139", "1-2345-67890-13-9"] }` · dashes and spaces are allowed. Exit code is 0 when every number passes, 1 when any fails. Other scripts can `import { isValidThaiId } from './thai-id.mjs'`.

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-tax/scripts/thai-id.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/thai-tax/scripts/thai-id.mjs` · Node only, no dependencies.

## Related

`thai-business-docs` · `tax-vat-th.md` (ภ.พ.30, WHT on the payment) · `shop-books` · `dbd-annual-filing.md`.

## References

- [`worked-example.md`](e-tax-invoice/worked-example.md) — open for a sample invoice header block with every required field
- [`sources.md`](e-tax-invoice/sources.md) — sources and check date 2026-10-06 for section 4


## reference: reporting-and-records.md

# Reporting, registration, records, worked example · seller-tax-basics

## Who reports your sales to the Revenue Department

| Reporter | Rule |
|---|---|
| Banks, e-wallets, payment providers — กฎหมาย e-Payment (พ.ร.บ.แก้ไขเพิ่มเติมประมวลรัษฎากร ฉบับที่ 48 พ.ศ. 2562) | Report accounts that **receive more than 3,000 deposits/transfers a year**, or **more than 400 transactions with a total above ฿2 million a year**, counted per institution |
| E-commerce platforms (ประกาศอธิบดีกรมสรรพากร, from accounting periods starting 1 Jan 2567) | Platforms registered in Thailand with revenue above ฿1,000 million a year keep a special account and send seller income data within 150 days after year-end |

Being reported is not a tax bill; it means the Revenue Department can compare your filing with the data.

## Registration

- **ทะเบียนพาณิชย์ (commercial registration)** — online sellers are required to register with the local registrar or กรมพัฒนาธุรกิจการค้า (DBD) within 30 days of starting (รอยืนยัน current exemptions); then the DBD Registered trust mark is possible
- **VAT** — voluntary registration earlier is allowed but adds monthly filing
- **Company** — consider when net profit regularly pushes the owner into the 25%+ bracket; ask an accountant

## Records to keep

- Platform monthly income/payout reports and fee invoices (Shopee, Lazada, TikTok Shop each provide downloadable statements)
- Bank and e-wallet statements for LINE/Facebook sales
- Purchase receipts and tax invoices for stock, packaging, shipping, ads
- Stock records (`shop-operations`) — they back up the cost of goods sold
- Copies of ภ.ง.ด.94, ภ.ง.ด.90, ภ.พ.30 and payment receipts

## Worked example — single reseller, tax year 2569

Gross sales ฿1,200,000 (all channels). Actual costs with receipts ฿900,000. No other income, only the personal allowance.

| | 60% deemed | Actual |
|---|---|---|
| Expense | 720,000 | 900,000 |
| Net after expense | 480,000 | 300,000 |
| Less personal allowance | 60,000 | 60,000 |
| Net income | 420,000 | 240,000 |
| Tax by brackets | 7,500 + 12,000 = **19,500** | 4,500 |
| 0.5% minimum check (0.5% × 1,200,000) | 6,000 | 6,000 → higher than 4,500 and over ฿5,000 |
| **Tax payable** | **19,500** | **6,000** |

Actual expenses win, but only with receipts — and the 0.5% minimum lifts the bill from ฿4,500 to ฿6,000. Sales are under ฿1.8 million, so no VAT registration yet; as sales grow, check monthly.


## reference: seller-tax-basics.md

<!-- merged from skill `seller-tax-basics` on 2026-11-27 · description was: Use when a Thai individual online seller asks about tax -->
# Seller Tax Basics — what a Thai individual online seller files, owes and keeps

General information, not tax advice: confirm figures at rd.go.th or with a tax accountant (นักบัญชี / ผู้สอบบัญชีภาษีอากร) before filing. The Revenue Department already sees most online sales (banks, e-wallets and large platforms report sellers), so not filing is no longer invisible.

## Use when
- A Thai individual selling online (Shopee · Lazada · TikTok Shop · LINE · Facebook) asks whether to file, what is owed, 60% deemed vs actual expenses, or when to register VAT.

Not for: payroll or salary → `thai-employment` · VAT filing calendar → `tax-vat-th.md` · company vs sole trader → `thai-business-setup` section 2.

## Steps
1. **Classify income**: selling goods online as an individual is เงินได้ตามมาตรา 40(8) ประมวลรัษฎากร.
2. **Total gross sales** for the year from every channel (platform payout reports + bank statements for LINE/Facebook), before fees.
3. **Run the script** (below): it compares 60% deemed and actual expenses, applies the 0.5% minimum-tax check, and says which is cheaper. Do not add up by hand.
4. **File half-year ภ.ง.ด.94** for January–June sales by 30 September (e-filing extension for this form is not confirmed; `tax-vat-th.md` section 2 lists only VAT and withholding forms).
5. **File full-year ภ.ง.ด.90** by 31 March of the following year (31 March 2570 on paper; e-Filing = paper deadline + the current extension if its window covers this date, look it up live per `tax-vat-th.md` section 2), crediting tax paid with ภ.ง.ด.94.
6. **Watch VAT monthly**: when sales for the year pass the VAT line, register (ภ.พ.01) by the deadline in `tax-vat-th.md` section 1, then file ภ.พ.30 every month even with zero sales (paper by the 15th; e-Filing = paper deadline + the current extension, `tax-vat-th.md` section 2).
7. **Keep records** (list in the reference). Retention: `shop-books` → `references/sme-bookkeeping.md` section 2, 5 years minimum, 7 recommended, per a Revenue Department ruling not yet checked against the current statute.

## Key figures (last checked 2026-10-06)

| Item | Figure |
|---|---|
| Must file when 40(8) and other non-salary income exceeds | ฿60,000 a year single / ฿120,000 married |
| Deemed expense for buying-and-reselling goods | 60% of gross |
| Personal allowance | ฿60,000 |
| Minimum-tax check | When non-salary income (40(2)–40(8)) is ฿120,000 or more: tax = 0.5% of that income; if over ฿5,000, pay the higher of normal tax and 0.5% tax |
| Income tax brackets (net income) | Table below |
| VAT registration | Threshold and deadline: `tax-vat-th.md` section 1 |
| VAT rate | 7% (reduced from the statutory 10%), extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to 30 Sep 2570 |

### Income tax brackets (last checked 2026-10-06)

The one copy of this table; `thai-employment` and `thai-business-setup` link here.

| Net income (baht/year) | Rate | Tax on band | Cumulative at top |
|---|---|---|---|
| 0 – 150,000 | exempt | 0 | 0 |
| 150,001 – 300,000 | 5% | 7,500 | 7,500 |
| 300,001 – 500,000 | 10% | 20,000 | 27,500 |
| 500,001 – 750,000 | 15% | 37,500 | 65,000 |
| 750,001 – 1,000,000 | 20% | 50,000 | 115,000 |
| 1,000,001 – 2,000,000 | 25% | 250,000 | 365,000 |
| 2,000,001 – 5,000,000 | 30% | 900,000 | 1,265,000 |
| over 5,000,000 | 35% | | |

**60% deemed (หักเหมา)** fits when real costs are below 60% of sales (high margin, handmade, digital) or there are no receipts. **Actual (หักตามจริง)** fits when real costs are above 60% (most thin-margin resellers) **and** every cost has a proper receipt or tax invoice. Choose per tax year; actual means you must prove every baht.

## Script

```bash
node scripts/tax-compare.mjs scripts/example.json      # { "sales": 1200000, "actual_expenses": 900000 } → 19,500 vs 6,000
node scripts/tax-compare.mjs --self-test
```

**Script path:** installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/thai-tax/scripts/tax-compare.mjs | sort -V | tail -1` · in the repo: `plugins/e-commerce/skills/thai-tax/scripts/tax-compare.mjs` · Node only. Rates live in `scripts/rates.json` with their check date; the report prints it and warns when older than 90 days. `allowances` is the year's total (default: personal ฿60,000 only). Salary or other income types are out of scope. Sole trader vs company: `"mode": "company"`.

## Check before done
- Figures carry the check date and the not-tax-advice note.
- Both methods were compared; the 0.5% minimum was applied.
- Actual expenses are recommended only with receipts for every cost.
- Year's sales were checked against the VAT threshold in `tax-vat-th.md` section 1.

Related: `pricing-and-costs` (VAT `v` in the price formula) · `thai-business-docs` (invoices and receipts) · `income-tax-th` of `trading-finance` (investment income in the same ภ.ง.ด.90).

## References
- [`reporting-and-records.md`](reporting-and-records.md) — open to explain who reports sales (banks, platforms), commercial registration, which records to keep, or to show a worked 60% vs actual example.
- [`sources.md`](seller-tax-basics/sources.md) — sources and check dates behind the figures.


## reference: sources.md

# Sources · tax-vat-th

Last checked 2026-10-25 (VAT surcharge) · sources: https://www.rd.go.th/3361.html , https://www.prosofterp.com/Article/Detail/141129 , https://www.auditorasia.com/th/process_add_money · criminal fines of 100/200 and 300/500 baht (filing late by no more than 7 days / more than 7 days) were found only in secondary sources; no official regulation found yet

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=601636 · https://www.kasikornbank.com/th/business/sme/financial-services/ecertificate/Pages/e-withholding-tax.aspx

ตรวจล่าสุด 2026-10-25 (พ.ร.ฎ. ฉบับที่ 807 ลงราชกิจจานุเบกษา 23 ส.ค. 2569 ใช้ 1 ต.ค. 2569 – 30 ก.ย. 2570) · แหล่ง: https://www.rd.go.th/1603.html · https://www.thaipbs.or.th/news/content/509779 · https://www.thansettakij.com/economy/667217 · https://www.prd.go.th/th/content/category/detail/id/33/iid/526275


## reference: tax-vat-th.md

<!-- merged from skill `tax-vat-th` on 2026-11-27 · description was: Use when a Thai company asks what tax to file -->
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
- A due date on a weekend or public holiday moves to the next working day (see `thai-employment`).
- For a 31 December year end: ภ.ง.ด.51 by 31 Aug; ภ.ง.ด.50 by 30 May (150 days; 29 May when February has 29 days). Add the e-Filing extension for online filing. When 30 May falls on a Sunday (as in 2570), the next working day applies (RD Order ป.117/2545, https://www.rd.go.th/10514.html, checked 22 ต.ค. 2569).

## 3. Withholding tax — how much

Full table with legal basis and edge cases: [references/wht-rates.md](wht-rates.md). The ones used every week:

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
- Give the payee **หนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)** — fields in `thai-employment`.

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

A 20,000 baht + VAT service payment to a company: WHT 600, pay 20,800, file ภ.ง.ด.53. Full calculation (including e-WHT and late surcharge): [references/worked-example.md](worked-example.md).

## Related

`thai-employment` (ภ.ง.ด.1, 50 ทวิ) · `e-tax-invoice.md` · `dbd-annual-filing.md` (ภ.ง.ด.50) · `thai-business-docs` · `income-tax-th` in `trading-finance` (if installed) (personal investment tax).

## เรียกเป็นคำสั่ง

`/e-commerce:thai-tax [company|personal] [--month <n>]`

Run `thai-tax` with the `tax-helper` agent for: **the user's request**

Verifies dates against current RD announcements rather than reusing last year's calendar, and ends with the accountant handoff checklist.

## References

- [`sources.md`](sources.md) — open to re-check dated figures, prices and rules, and their sources


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
- **Deadline** — remit by the 7th of the following month on paper, or by the e-Filing deadline online (paper date + the current extension, see `tax-vat-th.md` section 2); surcharge 1.5% per month after that.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th (คำสั่ง ท.ป.4/2528) · https://www.infoquest.co.th/?p=601636 (e-WHT)


## reference: worked-example.md

# Worked example · tax-vat-th

## Worked example — a service payment

Company pays a design agency (บริษัท) 20,000 baht + VAT 7% = 21,400.

- WHT 3% × 20,000 = **600** → pay the agency 21,400 − 600 = **20,800**
- Issue 50 ทวิ for 600; file ภ.ง.ด.53 and remit 600 by the 7th of next month on paper, or by the e-Filing deadline online (section 2).
- Through e-WHT at 1%: withhold 200, pay 21,200, the bank files.
- Paid 2 months late: surcharge 600 × 1.5% × 2 = 18 baht plus the settlement fine.
