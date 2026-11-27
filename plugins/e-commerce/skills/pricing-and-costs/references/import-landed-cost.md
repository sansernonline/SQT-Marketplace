<!-- merged from skill `import-landed-cost` on 2026-11-27 · description was: Use when importing goods from China and costing each unit -->
# Landed cost per unit for goods imported from China

## Contents

- [Use when](#use-when)
- [1 · Formula](#1--formula)
- [2 · Rules for 2026 (B.E. 2569): the 1,500 baht duty exemption is cancelled](#2--rules-for-2026-be-2569-the-1500-baht-duty-exemption-is-cancelled)
- [3 · Find the duty rate and prohibitions](#3--find-the-duty-rate-and-prohibitions)
- [4 · Truck or sea](#4--truck-or-sea)
- [5 · Example: 200 fabric bags from 1688 by truck](#5--example-200-fabric-bags-from-1688-by-truck)
- [6 · Let the script calculate, never by hand](#6--let-the-script-calculate-never-by-hand)
- [7 · When to ask an accountant or a lawyer](#7--when-to-ask-an-accountant-or-a-lawyer)
- [8 · รออนุมัติ (awaiting approval)](#8--รออนุมัติ-awaiting-approval)
- [9 · Links to other skills](#9--links-to-other-skills)
- [Check before sending](#check-before-sending)
- [References](#references)

This skill works out the true cost per unit of goods ordered from China. The content is general information, not tax or legal advice. An accountant should recompute the tax figures of a real business.

CBM = cubic metre (called "คิว" in Thai).

> **One rule:** there is no default duty rate. Look up the tariff code and enter the rate yourself for every lot, and let the script do the calculation, never by hand.

## Use when

- Ordering goods from China (1688 · Taobao · a factory) through a freight forwarder, and wanting the cost per unit delivered to the shop
- Comparing a forwarder's quote for truck versus sea, or an all-in tax package versus paying taxes separately

Do not use when: choosing a business form or registering → `thai-business-setup` · setting selling prices on a platform once the cost is known → `marketplace-fees-pricing.md` · filing monthly VAT and using input tax → `thai-tax`

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
- VAT rate of 7%: Royal Decree (No. 807) B.E. 2569 (พระราชกฤษฎีกา ฉบับที่ 807) keeps the 6.3% rate for sales, services and imports until 30 Sep 2027 (B.E. 2570). With the local tax added, the total is 7%, as `thai-tax` summarises.
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

## 5 · Example: 200 fabric bags from 1688 by truck

Every figure in the example is only to show the method. The worked example (200 fabric bags from 1688 by truck: CIF 28,150.00 · duty 20% · VAT 7% · total paid 37,444.60 baht) gives 187.22 baht per bag when not VAT-registered and 175.40 when VAT-registered and imported in own name. It is in [`worked-example.md`](import-landed-cost/worked-example.md). The web price of 25 yuan is 125 baht, but the cost delivered to the shop is 40–50% higher: take the script's cost to set the resale price with `marketplace-fees-pricing.md`.

## 6 · Let the script calculate, never by hand

`scripts/landed-cost.mjs` works out every line of the table above in one run, and gives the cost per unit both ways (VAT-registered or not). The VAT rate is in `scripts/rates.json` with the date checked. The script warns when it is older than 90 days or past 30 Sep 2027 (B.E. 2570). There is no default duty rate. Look up the tariff code and enter the rate yourself for every lot.

```bash
node scripts/landed-cost.mjs scripts/import-landed-cost/example.json     # 200-bag example → 187.22 and 175.40 per bag
node scripts/landed-cost.mjs --self-test
```

**Script path:** installed from the marketplace: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/pricing-and-costs/scripts/landed-cost.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/pricing-and-costs/scripts/landed-cost.mjs` · Node only, no dependencies

## 7 · When to ask an accountant or a lawyer

- Importing goods that may be restricted, or unsure of the HS code

## 8 · รออนุมัติ (awaiting approval)

These cannot be undone or affect outside people. The agent prepares the information and drafts, but does not do them itself.

- Transferring money to buy goods, paying the forwarder, or paying duty and taxes
- Signing a contract with the forwarder
- Entering the user's password, identity verification code or account number

## 9 · Links to other skills

- Selling price on Shopee Lazada TikTok Shop once the cost is known: `marketplace-fees-pricing.md`
- Choose a business form, register, and register for VAT: `thai-business-setup`
- File monthly VAT and input tax: `thai-tax` + agent `tax-helper`
- Compare domestic shipping: `shipping-compare.md`

## Check before sending

1. The duty rate comes from the real tariff code of the goods, not from the example, and say whether Form E entitlement was checked
2. Every figure comes from `landed-cost.mjs`, and the script's warnings (rates.json too old · duty rate in the wrong unit) are passed on to the user in full
3. State the cost per unit both ways (VAT-registered or not), and say that import VAT is input tax only when the import is in the business's own name
## References

- [`worked-example.md`](import-landed-cost/worked-example.md) — open for the full 200-bag cost table
- [`sources.md`](sources.md) — official sources and check date 2026-10-23 for sections 1 to 4
