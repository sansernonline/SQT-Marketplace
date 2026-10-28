# skill: dividend-tracker

Use when dividend season comes or the user asks about dividend income, XD dates, yield or dividend tax.

# Dividend Tracker (ติดตามเงินปันผล)

Know the income before it arrives. Tracker template: [references/dividend-template.md](references/dividend-template.md). General information, not investment or tax advice — for the tax decision ask a นักบัญชี or RD 1161. Tax treatment of dividends: `tax-basics-th`.

## The dates — SET (T+2 settlement)

| Term | Meaning | Rule of thumb |
|---|---|---|
| Board approval date | Board proposes the dividend (interim: board decides; annual: needs the AGM) | Announced on SET news |
| **XD** (Excluding Dividend) | First day a buyer does **not** get the dividend | **1 business day before** the record date |
| Last day to buy | Business day before XD | Buy on or before this day to receive the dividend |
| **Record date** | Day the share register is closed to list holders | Shares must have settled (T+2) by this day |
| **XM** (Excluding Meeting) | First day a buyer cannot attend / vote at the meeting | Same mechanics as XD, for the meeting record date |
| Payment date | Cash arrives (bank account or broker's cash account linked via ATS / PromptPay) | Annual dividend: within 1 month of the AGM approval (พ.ร.บ.บริษัทมหาชนจำกัด มาตรา 115) |

On the XD day the price usually opens lower by about the dividend — buying the day before XD just to "collect" it gains nothing before tax and loses 10% to withholding.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.set.or.th/en/trading-units-tick-sizes-price-limits (T+2), https://media.set.or.th/set/Documents/2022/Jul/การจ่ายปันผล.pdf (XD/record date, payment within 1 month)

## Formulas

```
gross dividend        = DPS (dividend per share) × shares held on record date
withholding tax       = 10% × gross            (Thai listed company → individual resident)
net cash received     = gross × 0.90
trailing yield        = DPS paid in last 12 months ÷ current price
yield on cost         = annual DPS ÷ average cost per share
portfolio yield       = expected annual net dividends ÷ current portfolio value
```

Gross, withheld, net and yields per holding: `node money-calc.mjs dividend <file.json>` (script in `portfolio-snapshot`, see its Script path; the worked example below is `../portfolio-snapshot/scripts/examples/dividend.json` and gives 1,600 / 160 / 1,440 and 4.5%). `source` is `thai-listed` or `thai-fund` (10% withheld) or `foreign` (the script refuses until `withholdingPct` is given from a checked source).

**Tax**: the 10% is withheld at source; the holder may leave it as final tax or include all such dividends in ภ.ง.ด.90 and claim the dividend tax credit (เครดิตภาษีเงินปันผล). Which is cheaper depends on the marginal rate — compute it with `tax-basics-th` (same plugin). Thai mutual fund dividends: 10% withheld, no credit. Foreign dividends (DRs, offshore): withholding differs by country — ask the user's situation, mark unknown rates (รอยืนยัน).

## Workflow

1. Build `dividends.csv` from holdings: symbol, shares, DPS, type (interim/annual), status (`declared` / `estimated`), XD, record date, payment date, gross, tax 10%, net.
2. Fill declared amounts from SET news / company IR; for undeclared, estimate from last year's DPS and payout ratio and **label as estimated**.
3. Flag XD dates **at least a week ahead** for names the user is thinking of buying or trimming.
4. Monthly rollup: net cash by payment month, running annual total, portfolio yield.
5. On payment date reconcile expected vs received (broker statement / ใบแจ้งการจ่ายเงินปันผล, which is also the tax certificate — keep it for filing).
6. Year end: total gross, total withheld, list of certificates for `tax-basics-th`.

## Rules

- Never present an estimate as declared — label every figure.
- A yield far above the market (e.g. 10%+) usually means the market expects a cut; check the payout ratio and cash flow before believing it.
- Shares bought on the XD day or later do not get this dividend — check the trade date, not the settlement date.
- Stock dividends (หุ้นปันผล) and XR (rights) change share count; adjust shares before computing next DPS yield.

## Worked example

Hold 2,000 shares of ABC. Board declares interim DPS 0.80 baht. XD Tue 2026-10-20 → record date Wed 2026-10-21 → payment Fri 2026-11-06.

- Last day to buy: Mon 2026-10-19
- Gross = 0.80 × 2,000 = **1,600**; withheld 10% = 160; net = **1,440 baht**
- Price 40.00, DPS last 12 months 1.80 → trailing yield = 1.80 ÷ 40.00 = **4.5%**
- If the user buys 1,000 more on 2026-10-20 (XD day), those shares get **nothing** this round.

Output: upcoming XD list (next 30 days), monthly net cash table, annual total with gross / withheld / net, and which figures are estimates.


## reference: dividend-template.md

# Dividend tracker template

## CSV header (`dividends.csv`)

```csv
symbol,shares,dps,type,status,period,xd_date,record_date,pay_date,gross,withholding,net,received,certificate_kept,note
```

| Column | Values |
|---|---|
| type | `interim`, `annual`, `fund`, `foreign` |
| status | `declared`, `estimated`, `paid` |
| withholding | 10% for Thai listed shares and Thai funds; foreign = per country (mark unknown) |
| received | actual net amount from the statement, filled on pay date |
| certificate_kept | Y/N — the dividend payment notice doubles as the withholding certificate |

## Monthly rollup

```
Year ____         Gross     Withheld    Net      Of which estimated
Jan
...
Dec
Total
Portfolio value ______   Portfolio net yield ____%
```

## Year-end checklist

- [ ] Every `declared` row has `received` filled
- [ ] Gaps explained (sold before XD, rounding, foreign tax)
- [ ] Certificates collected for every Thai dividend (needed if claiming the tax credit)
- [ ] Hand totals to `tax-basics-th` to compare "final 10%" vs "include and claim credit"


---

# skill: tax-basics-th

Use when asking about Thai tax on stock gains, dividends, interest, crypto or foreign income (PND 90, 91).

# Thai Tax Basics for Investors

General information, not tax advice — for a real filing ask a นักบัญชี / tax agent or the Revenue Department (RD) call centre 1161.

Per-income-type table and the dividend credit formula: [references/investment-income-rules.md](references/investment-income-rules.md). Year-end deductions: `tax-deduction-planner`. Dividend dates and income tracking: `dividend-tracker`. Income from selling online (40(8)) → `e-commerce:seller-tax-basics` (if installed).

## Which form, by when

| Form | Who | Paper deadline | Online (e-filing / D-MyTax) |
|---|---|---|---|
| ภ.ง.ด.91 | salary 40(1) only | 31 March of next year | usually extended to about 8 April (2568 year: 8 April 2569) |
| ภ.ง.ด.90 | any other income: freelance, rent, business, dividends or interest you choose to include, foreign remitted income | 31 March | same extension |
| ภ.ง.ด.94 | half-year return for rent, business, 40(5)–(8) income Jan–Jun | 30 September | about 8 October |

Tax year 2569 (income 2026): paper by 31 March 2570; the online extension date is announced each year (รอยืนยัน, expect about 8 April 2570). Refunds go to PromptPay linked to the national ID — register before filing. Late filing: surcharge 1.5% per month on tax due plus a fine.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=576625 , https://www.thaipbs.or.th/news/content/501063

## Rules per income type (short form)

- **Thai listed shares sold on SET/mai** — gain exempt, loss not deductible. Nothing to file for the gain.
- **Dividends** — 10% withheld. Either leave it as final tax, or include in ภ.ง.ด.90 and claim the dividend credit (1/4 of the dividend when the company paid 20% corporate tax). Worth it when your marginal rate is 25% or less. Choosing to include means including **all** such dividends that year.
- **Mutual funds** — redemption gain exempt; fund dividends 10% withheld with no credit.
- **Savings interest** — exempt if all savings-account interest across all banks is 20,000 or less in the year and you let banks send data to RD; otherwise 15% withheld.
- **Fixed deposit / bond interest** — 15% withheld; include only if marginal rate is below 15%.
- **Crypto and digital tokens** — gains on SEC-licensed Thai exchanges, brokers or dealers are exempt for 1 Jan 2568 – 31 Dec 2572. Gains on foreign or unlicensed venues remain taxable at progressive rates. Check the platform on the SEC licence list (sec.or.th) before relying on the exemption.
- **Foreign income** — from 2567, foreign income earned from 1 Jan 2567 is taxed in the year you bring it into Thailand, if you were in Thailand 180 days or more that year. Track the earn date and remit date of every transfer; claim treaty credit for foreign tax paid.

## Workflow

1. Confirm tax year and residence (180-day rule).
2. List every income source with gross amount and tax withheld; sort into the table in the reference file.
3. For each optional item (dividends, deposit interest) compute both ways and pick the cheaper. Dividends: `tax-deduction-planner` script `tax.mjs` with a `dividends` field prints both ways.
4. Run `tax-deduction-planner` for deductions; combine into one net-income calculation.
5. Pick the form and deadline; list the documents below.

## Worked example — tax year 2568 (filed 2569)

Salary net income after all deductions 350,000 (marginal rate 10%). Investment income: SET share trading gain 120,000; dividends from listed companies 40,000 (4,000 withheld); savings interest 8,000; 12-month fixed deposit interest 10,000 (1,500 withheld); BTC gain 30,000 on a Thai licensed exchange.

| Item | Treatment | Tax effect |
|---|---|---|
| Share trading gain 120,000 | exempt | 0 |
| Savings interest 8,000 | exempt (≤ 20,000) | 0 |
| BTC gain 30,000 (licensed exchange, 2568) | exempt | 0 |
| Dividends — option A: final | 10% withheld | cost 4,000 |
| Dividends — option B: include | add 40,000 + credit 10,000 = 50,000 at 10% = 5,000; minus credit 10,000; minus withheld 4,000 | net **refund 9,000** versus option A's cost 4,000 → B better by 9,000 |
| Deposit interest — include | 10,000 at 10% = 1,000 minus withheld 1,500 | refund 500 |

Result: file ภ.ง.ด.90 (not 91, because dividends and interest are included). Net income becomes 350,000 + 50,000 + 10,000 = 410,000, still inside the 10% band — check this every time; if the added income crossed into 30%, option A would win.

## Documents to keep

- 50 ทวิ from employer
- Dividend withholding certificates (หนังสือรับรองการหักภาษี ณ ที่จ่าย) — issued by the registrar (TSD) or via the broker's annual tax report
- Bank interest certificates for deposit interest
- Broker annual statements (even for exempt gains)
- Crypto exchange annual statement and transaction history (CSV); for foreign venues, the transfers that moved money into Thailand
- Foreign broker statements, foreign tax withheld, remittance records with dates
- Deduction certificates listed in `tax-deduction-planner`

## Rules

- State the tax year in every answer; numbers change yearly.
- A number not on the reference table is (รอยืนยัน) until checked on rd.go.th.
- This skill prepares and explains; a licensed tax agent files complex cases (foreign income, business income, large crypto).


## reference: investment-income-rules.md

# Thai tax treatment of investment income — individual resident

| Income | Withholding at source | Exempt? | Option to include in annual return | Notes |
|---|---|---|---|---|
| Gain selling shares on SET / mai through a Thai broker | none | **exempt** (gain on listed shares sold on the exchange) | — | Selling unlisted shares off-exchange is taxable under 40(4)(ช) |
| Dividends from Thai companies | 10% | no | yes — include and claim dividend tax credit (เครดิตภาษีเงินปันผล) | Credit only for dividends paid from profit taxed at corporate level; BOI-exempt profit gives no credit |
| Dividends from Thai mutual funds | 10% | no | yes, but **no** dividend tax credit | Redemption gain on Thai funds is exempt for individuals |
| Savings account interest | 0 if total ≤ 20,000/yr across all banks and consent to share data | ≤ 20,000 exempt | — | If you refuse consent or exceed 20,000, 15% is withheld on all savings interest |
| Fixed deposit, bonds, debentures interest | 15% | no | yes — include if marginal rate < 15% | Must include all interest of that kind if you choose to |
| Crypto / digital token gains on SEC-licensed Thai exchange, broker or dealer | none | **exempt 1 Jan 2568 – 31 Dec 2572** (กฎกระทรวง ฉบับที่ 399, ราชกิจจานุเบกษา 5 Sep 2568) | — | Keep statements anyway |
| Crypto gains elsewhere (foreign exchange, P2P, DeFi) | 15% legally applies but rarely withheld | no | taxable at progressive rates as 40(4)(ฌ) | Foreign-held: also falls under the remittance rule below |
| Staking rewards, airdrops | 15% may apply to 40(4)(ซ) | no — the exemption above is for transfer gains (40(4)(ฌ)) only (รอยืนยัน) | taxable: staking / yield farming on a **digital token** = 40(4)(ซ); on a **cryptocurrency** = 40(8); airdrop, gift or prize = 40(8) (RD guide, รอยืนยัน) | Value at market price on the day received; that value becomes the cost when sold later |
| Foreign income earned from 1 Jan 2567 (dividends, gains, interest abroad) | foreign tax | no | taxable in the Thai year it is **brought into Thailand**, if you were in Thailand 180+ days that year (ป.161/2566, ป.162/2566) | Foreign income earned before 2567 is exempt when remitted; claim double-tax-treaty credit for foreign tax paid |

ตรวจล่าสุด 2026-10-06 · แหล่ง:
- https://www.rd.go.th/fileadmin/user_upload/lorkhor/newsbanner/2024/1/QnA161-162-1.pdf (foreign income)
- https://www.thairath.co.th/money/investment/digital_assets/2881566 (crypto exemption, กฎกระทรวง 399)
- https://www.krungsri.com/th/about-krungsri/about-us/overview/announce/exemption-tax-interest-savings-deposit (savings interest 20,000)
- ตรวจล่าสุด 2026-10-25 (staking, airdrop): https://www.rd.go.th/fileadmin/user_upload/lorkhor/newsbanner/2022/03/Instructions_for_paying_personal_income_tax.pdf (คู่มือกรมสรรพากร มี.ค. 2565 หน้า 18–21) , https://www.finnomena.com/z-admin/cryptocurrency-tax/ (token = 40(4)(ซ)) , https://thestandard.co/cryptocurrency-tax-summary/ (airdrop = 40(8)) · แหล่งอิสระยังไม่ครบ 3 ต่อข้อ และคู่มือเป็นฉบับปี 2565

## Dividend tax credit formula

credit = dividend × t ÷ (100 − t), where t = corporate tax rate the payer paid.

| Corporate rate t | Credit as share of dividend |
|---|---|
| 20% (most listed companies) | 1/4 = 25% |
| 0% (BOI-exempt profit) | 0 |

Break-even: with t = 20% and 10% withheld, including dividends wins when your marginal rate is **25% or lower**; at 30% and 35% keep the 10% as final tax. Including can push net income into a higher band — compute both ways.
