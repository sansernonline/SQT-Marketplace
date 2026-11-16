# Worked example · import-landed-cost

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
