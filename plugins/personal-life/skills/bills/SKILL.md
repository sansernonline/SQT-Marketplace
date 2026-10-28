---
name: bills
description: Read a Thai electricity or water bill, log it, and check any spike against the last three months.
argument-hint: <bill figures or "tracker"> [month]
disable-model-invocation: true
---

Run `household-bills` with the `home-manager` agent for: **$ARGUMENTS**

Use the units and amounts printed on the bill, not estimates. Check the current Ft and tariff with การไฟฟ้านครหลวง (กฟน.) / การไฟฟ้าส่วนภูมิภาค (กฟภ.) / คณะกรรมการกำกับกิจการพลังงาน (กกพ.) before splitting the bill into its parts; anything unconfirmed is written as the official value + `(รอยืนยัน)`. If this month's units are more than 20% above the 3-month average in units (20% is a default, not measured), run the spike checklist. Get the percentage from `power-bill.mjs --history` (see `household-bills`), not by hand.
