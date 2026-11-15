# skill: import-landed-cost

Use when importing goods from China and costing each unit

# Landed cost per unit for goods imported from China

Part of plugin `e-commerce`. The wording follows `human-writing`. This skill works out the true cost per unit of goods ordered from China. It was split out of `thai-business-setup` section 5 on 2026-10-28. The content is general information, not tax or legal advice. An accountant should recompute the tax figures of a real business.

Abbreviations in this file: value added tax (VAT) · price of goods plus insurance and freight to the Thai customs border (CIF) · Harmonized System tariff code (HS code) · cubic metre (CBM, called "คิว" in Thai)

> **One rule:** there is no default duty rate. Look up the tariff code and enter the rate yourself for every lot, and let the script do the calculation, never by hand.

## Use when

- Ordering goods from China (1688 · Taobao · a factory) through a freight forwarder, and wanting the cost per unit delivered to the shop
- Comparing a forwarder's quote for truck versus sea, or an all-in tax package versus paying taxes separately

Do not use when: choosing a business form or registering → `thai-business-setup` · setting selling prices on a platform once the cost is known → `marketplace-fees-pricing` · filing monthly VAT and using input tax → `tax-vat-th`

## 1 · Formula

```
CIF                  = goods cost + freight to the Thai customs border + insurance
import duty          = CIF × duty rate of the tariff code
excise tax           = only for goods that have it (recommended retail price × rate)
VAT                  = (CIF + duty + excise + other taxes if any) × 7%
cost delivered to shop = CIF + duty + excise + VAT + forwarder and clearance fees + delivery within Thailand
```

A business that is VAT-registered and imports in its own name can claim the import VAT as input tax. The Customs Department receipt serves as a tax invoice for the VAT part only, so this VAT is not counted as cost.

## 2 · Rules for 2026 (B.E. 2569): the 1,500 baht duty exemption is cancelled

- From 1 Jan 2026 (B.E. 2569), the only goods exempt from duty are those whose customs value per consignee is no more than 1 baht, under Customs Department Notification No. 219/2568 (ประกาศกรมศุลกากร ที่ 219/2568, which cancels Notification No. 191/2561). In practice, duty is due from the first baht.
- VAT on imports valued at 1,500 baht or less has been collected since 5 Jul 2024 (B.E. 2567).
- VAT rate of 7%: Royal Decree (No. 807) B.E. 2569 (พระราชกฤษฎีกา ฉบับที่ 807) keeps the 6.3% rate for sales, services and imports until 30 Sep 2027 (B.E. 2570). With the local tax added, the total is 7%, as `tax-vat-th` summarises.
- No Ministry of Finance notification has been found that extends the 1,500 baht duty exemption into 2026 (B.E. 2569). If a new notification appears, fix this section.

## 3 · Find the duty rate and prohibitions

1. Find the 8-digit HS code, then read the rate in the menu "ค้นหาพิกัดอัตราอากรขาเข้า" (search import duty tariff rates) in the Customs Department tariff database http://itd.customs.go.th/igtf/viewerCont.do?param=main · if unsure of the code, ask the Customs Department Call Center on 1164
2. Goods from China can get a reduced or zero duty under the ASEAN-China Free Trade Agreement (ACFTA) if a Form E certificate of origin is presented to Thai Customs · ask the forwarder from the start whether they can arrange Form E
3. Check whether the goods are "ของต้องกำกัด" (restricted goods: need permission or must meet conditions before import), such as food, drugs and cosmetics (Food and Drug Administration, อย.) · radio communication equipment (NBTC office, สำนักงาน กสทช.) · goods under a compulsory standard (Thai Industrial Standards Institute, สมอ.) (รอยืนยัน, the product list of each agency)

## 4 · Truck or sea

| Topic | Truck | Sea |
|---|---|---|
| Suits | light, high-value goods needed fast | heavy or bulky goods, large lots, can wait |
| Time | shorter | longer |
| Price per CBM | higher | lower |
| Charged by | per kilogram or per CBM, whichever pays more | same |

This table describes the general shape of the forwarding market (อนุมาน, inferred; not official figures). Get real quotes from 2–3 forwarders, and ask these 5 questions:

1. Is the price per kilogram or per CBM, what is the minimum, and how is it rounded
2. Does the price already include duty and VAT ("เหมาภาษี", an all-in tax package, or paid separately)
3. In whose name is the import made, and will the customs declaration and the Customs Department receipt come in our business's name · if it is in the forwarder's name, that VAT cannot be used as our input tax (อนุมาน, inferred from the principle that the customs receipt is a tax invoice)
4. How much is paid if goods are damaged or lost
5. Is the price declared truthfully · declaring a price lower than the real one is a legal risk for the importer (รอยืนยัน, the sections and penalties in the Customs Act B.E. 2560 [2017], พ.ร.บ.ศุลกากร พ.ศ. 2560)

Last checked 2026-10-23. Sources: Customs Department Notification No. 219/2568 (signed 4 Dec 2025 [B.E. 2568], effective 1 Jan 2026 [B.E. 2569]) https://www.customs.go.th/cont_strc_download_with_docno_date.php?lang=th&top_menu=menu_homepage&current_id=14232a32414d505f4a464b47464b4a · VAT on low-value imports starting 5 Jul 2024 (B.E. 2567): Customs Department revenue collection measures document for fiscal year 2026 (B.E. 2569) https://www.customs.go.th/data_files/8342f73dce85665090d55bb44eb9a0e4.pdf · Royal Decree No. 807 (Royal Gazette volume 143, part 50 ก, 23 Aug 2026 [B.E. 2569]) https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf · VAT base on imports, Revenue Code section 79/2 https://www.rd.go.th/5205.html · Customs Department duty and VAT formula http://ccc.customs.go.th/data_files/bdab2d48d4dd6ac677eeecd215c82ba2.pdf · customs receipt as a tax invoice for the VAT part only https://www.rd.go.th/7047.html · Form E https://www.dft.go.th/th-th/DFT-Service/ServiceData-Information/dft-service-data-privilege/Detail-dft-service-data-privilege/ArticleId/23580/Test · definition of restricted goods https://www.customs.go.th/cont_strc_simple.php?ini_content=business_160426_03_160930_01_160930_01&ini_menu=menu_goods_control_permit&lang=th&left_menu=menu_goods_control_permit

## 5 · Example: 200 fabric bags from 1688 by truck

Every figure in this section is an **example**, used only to show the method.

| Assumption | Value used |
|---|---|
| Goods price | 25 yuan each × 200 = 5,000 yuan |
| Exchange rate | 5.00 baht per yuan (use the real rate of the payment day) |
| Shipping within China to the forwarder's warehouse | 100 yuan |
| Freight China to Thailand by truck | 0.4 CBM × 6,000 baht per CBM |
| Insurance | 1% of goods cost |
| Duty rate | 20% (look up the real rate of the tariff code, and check Form E entitlement) |
| Forwarder and clearance fee | 1,000 baht per lot |
| Delivery within Thailand to the shop | 300 baht |

| Line | How it is worked out | Baht |
|---|---|---|
| Goods cost | 5,000 × 5.00 | 25,000.00 |
| Shipping within China | 100 × 5.00 | 500.00 |
| Freight China to Thailand | 0.4 × 6,000 | 2,400.00 |
| Insurance | 25,000 × 1% | 250.00 |
| **CIF** | sum of the 4 lines above | **28,150.00** |
| Import duty | 28,150 × 20% | 5,630.00 |
| VAT | (28,150 + 5,630) × 7% | 2,364.60 |
| Forwarder and clearance fee | | 1,000.00 |
| Delivery within Thailand | | 300.00 |
| **Total actually paid** | | **37,444.60** |
| **Cost per bag (not VAT-registered)** | 37,444.60 ÷ 200 | **187.22** |
| Cost per bag (VAT-registered, imported in own name) | (37,444.60 − 2,364.60) ÷ 200 | 175.40 |

The web price of 25 yuan is 125 baht, but the cost delivered to the shop is 175–187 baht, 40–50% higher. Take this cost to set the resale price with `marketplace-fees-pricing`.

## 6 · Let the script calculate, never by hand

`scripts/landed-cost.mjs` works out every line of the table above in one run, and gives the cost per unit both ways (VAT-registered or not). The VAT rate is in `scripts/rates.json` with the date checked. The script warns when it is older than 90 days or past 30 Sep 2027 (B.E. 2570). There is no default duty rate. Look up the tariff code and enter the rate yourself for every lot.

```bash
node scripts/landed-cost.mjs scripts/example.json     # 200-bag example → 187.22 and 175.40 per bag
node scripts/landed-cost.mjs --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/import-landed-cost/scripts/landed-cost.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/import-landed-cost/scripts/landed-cost.mjs` · Node only, no dependencies

## 7 · When to ask an accountant or a lawyer

- Importing goods that may be restricted, or unsure of the HS code

## 8 · รออนุมัติ (awaiting approval)

These cannot be undone or affect outside people. The agent prepares the information and drafts, but does not do them itself.

- Transferring money to buy goods, paying the forwarder, or paying duty and taxes
- Signing a contract with the forwarder
- Entering the user's password, identity verification code or account number

## 9 · Links to other skills

| Need | Use |
|---|---|
| Set the selling price on Shopee Lazada TikTok Shop once the cost is known | `marketplace-fees-pricing` |
| Choose a business form, register, and register for VAT | `thai-business-setup` |
| File monthly VAT and input tax | `tax-vat-th` + agent `tax-helper` |
| Compare domestic shipping | `shipping-compare` |
| The wording of every line | `human-writing` |

## Check before sending

1. The duty rate comes from the real tariff code of the goods, not from the example, and say whether Form E entitlement was checked
2. Every figure comes from `landed-cost.mjs`, and the script's warnings (rates.json too old · duty rate in the wrong unit) are passed on to the user in full
3. State the cost per unit both ways (VAT-registered or not), and say that import VAT is input tax only when the import is in the business's own name

Origin of the idea: the landed cost calculation structure took its idea from https://github.com/Boom-Vitt/claude-thai-business-skills (MIT License · Copyright (c) 2026 Vittawat (boombignose) · LICENSE file checked 2026-10-23) · fully rewritten, no text copied, and every figure rechecked against official sources · the original still says parcels under 1,500 baht may pay no duty, which does not match the rules from 1 Jan 2026 (B.E. 2569)


---

# skill: seller-tax-basics

Use when a Thai individual online seller asks about tax

# Seller Tax Basics (Thai individual online seller)

General information, not tax advice — confirm figures at rd.go.th or with a tax accountant (นักบัญชี / ผู้สอบบัญชีภาษีอากร) before filing. Figures are as checked below (brackets from the tax year 2568 ภ.ง.ด.90 instructions, same as `thai-business-setup` section 2; no change announced for tax year 2569 as of the check date).

The Revenue Department already sees most online sales: banks and e-wallets report high-volume accounts, and large platforms report seller income. Not filing is no longer invisible.

## Workflow

1. **Classify income** — selling goods online as an individual = เงินได้ตามมาตรา 40(8) ประมวลรัษฎากร
2. **Total gross sales** for the year from every channel (platform payout reports + bank statements for LINE/Facebook), before fees
3. **Choose the expense method** — 60% deemed or actual (table below); compute both
4. **Run the 0.5% minimum-tax check** (below) — it often decides the bill for low-margin shops
5. **File half-year** ภ.ง.ด.94 for January–June sales (by 30 September; e-filing extension for this form is not confirmed — `tax-vat-th` section 2 lists only VAT and withholding forms)
6. **File full-year** ภ.ง.ด.90 by 31 March of the following year (by 31 March 2570 on paper; e-Filing = paper deadline + the current e-Filing extension, if its window covers this due date (look it up live, see `tax-vat-th` section 2)), crediting tax paid with ภ.ง.ด.94
7. **Watch the value added tax (VAT) line** monthly — when sales for the year pass ฿1.8 million, register for VAT within 30 days (below)
8. **Keep records** (list below) (retention period: `sme-bookkeeping` section 2 — 5 years minimum, 7 recommended — per a Revenue Department ruling, not yet checked against the current statute)

## Thresholds and key figures

| Item | Figure |
|---|---|
| Must file when 40(8) and other non-salary income exceeds | ฿60,000 a year single / ฿120,000 married (for filing purposes) |
| Deemed expense for buying-and-reselling goods | 60% of gross |
| Personal allowance | ฿60,000 |
| Minimum-tax check | Applies when non-salary income (40(2)–40(8)) is ฿120,000 or more: tax = 0.5% of that income; if over ฿5,000, pay the higher of normal tax and 0.5% tax |
| Personal income tax brackets (net income) | 0–150,000: exempt · 150,001–300,000: 5% · 300,001–500,000: 10% · 500,001–750,000: 15% · 750,001–1,000,000: 20% · 1,000,001–2,000,000: 25% · 2,000,001–5,000,000: 30% · above 5,000,000: 35% |
| VAT registration | Compulsory once annual sales exceed ฿1.8 million; register (ภ.พ.01) within 30 days of exceeding; then file ภ.พ.30 every month, even with zero sales: paper by the 15th; e-Filing = paper deadline + the current e-Filing extension (look it up live, see `tax-vat-th` section 2) |
| VAT rate | 7% (reduced from the statutory 10%), extended by พ.ร.ฎ. (ฉบับที่ 807) พ.ศ. 2569 to 30 Sep 2570 |

Last checked 2026-10-06 · Sources: https://www.rd.go.th · https://flowaccount.com/blog/shopee-income-tax-threshold/ · https://www.thairath.co.th/money/personal_finance/finance_banking/2778210 · https://www.prd.go.th/th/content/category/detail/id/33/iid/526275 (VAT 7% to 30 Sep 2570, same source as `tax-vat-th`) · Rechecked 2026-10-22: Royal Decree (พ.ร.ฎ.) No. 807 B.E. 2569, published in the Royal Gazette (ราชกิจจานุเบกษา) 23 Aug 2569, effective 1 Oct 2569 (Revenue Department file https://rd.go.th/fileadmin/user_upload/kormor/newlaw/dc807.pdf exists but its text cannot be read · date and number come from lookuptax.com and news; check again against the Royal Gazette) · Section 40(8) flat 60% standard deduction: Revenue Department news, Oct 2560 https://media.thaigov.go.th (not yet compared with the current announcement)

## 60% deemed vs actual expenses

| Use | When |
|---|---|
| **60% deemed (หักเหมา)** | Real costs are below 60% of sales (high-margin products, handmade, digital) or the seller has no receipts |
| **Actual (หักตามจริง)** | Real costs are above 60% (most resellers on thin margins) **and** every cost has a proper receipt or tax invoice: goods bought, packaging, platform fees, shipping, ads, rent |

You choose per tax year; switching to actual means you must be able to prove every baht.

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

### Run the script, do not add up by hand

`scripts/tax-compare.mjs` does the table above in one call: both methods, the 0.5% check and which one is cheaper. Rates live in `scripts/rates.json` with the date they were checked; the report prints that date and warns when it is older than 90 days.

```bash
node scripts/tax-compare.mjs scripts/example.json      # { "sales": 1200000, "actual_expenses": 900000 } → 19,500 vs 6,000
node scripts/tax-compare.mjs --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/seller-tax-basics/scripts/tax-compare.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/seller-tax-basics/scripts/tax-compare.mjs` · Node only, no dependencies.

`allowances` is the year's total allowances (default: personal ฿60,000 only). Salary or other income types are out of scope — use `payroll-th` or ask an accountant. Comparing sole trader against a company: `"mode": "company"`, see `thai-business-setup` section 2.

## Who reports your sales to the Revenue Department

| Reporter | Rule |
|---|---|
| Banks, e-wallets, payment providers — กฎหมาย e-Payment (พ.ร.บ.แก้ไขเพิ่มเติมประมวลรัษฎากร ฉบับที่ 48 พ.ศ. 2562) | Report accounts that **receive more than 3,000 deposits/transfers a year**, or **more than 400 transactions with a total above ฿2 million a year**, counted per institution |
| E-commerce platforms (ประกาศอธิบดีกรมสรรพากร, from accounting periods starting 1 Jan 2567) | Platforms registered in Thailand with revenue above ฿1,000 million a year keep a special account and send seller income data within 150 days after year-end |

Being reported is not a tax bill; it means the Revenue Department can compare your filing with the data.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.kasikornbank.com/th/kwealth/Pages/e-payment-tax.aspx · https://brandinside.asia/?p=160771 · thresholds as reported; regulation text (รอยืนยัน) at rd.go.th

## Registration

- **ทะเบียนพาณิชย์ (commercial registration)** — online sellers are required to register with the local registrar or กรมพัฒนาธุรกิจการค้า (DBD) within 30 days of starting (รอยืนยัน current exemptions); then the DBD Registered trust mark is possible
- **VAT** — see thresholds; voluntary registration earlier is allowed but adds monthly filing
- **Company** — consider when net profit regularly pushes the owner into the 25%+ bracket; ask an accountant

## Records to keep

- Platform monthly income/payout reports and fee invoices (Shopee, Lazada, TikTok Shop each provide downloadable statements)
- Bank and e-wallet statements for LINE/Facebook sales
- Purchase receipts and tax invoices for stock, packaging, shipping, ads
- Stock records (`multi-shop-stock`) — they back up the cost of goods sold
- Copies of ภ.ง.ด.94, ภ.ง.ด.90, ภ.พ.30 and payment receipts

## Related

- `marketplace-fees-pricing` — VAT `v` in the price formula after registering
- `doc-quotation` — invoices and receipts; `tax-vat-th` — VAT filing calendar
- `trading-finance` `tax-basics-th` (if installed) — other personal income (investments) in the same ภ.ง.ด.90
