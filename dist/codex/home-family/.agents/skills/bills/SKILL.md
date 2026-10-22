---
name: "bills"
description: "Read a Thai electricity or water bill, log it, and check any spike against the last three months."
---

Run `household-bills` with the `home-manager` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Use the units and amounts printed on the bill, not estimates. Check the current Ft and tariff with การไฟฟ้านครหลวง (กฟน.) / การไฟฟ้าส่วนภูมิภาค (กฟภ.) / คณะกรรมการกำกับกิจการพลังงาน (กกพ.) before splitting the bill into its parts; anything unconfirmed is written as the official value + `(รอยืนยัน)`. If this month's units are more than 20% above the 3-month average in units, run the spike checklist.
