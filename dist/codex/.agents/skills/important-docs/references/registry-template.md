# Registry template and Thai renewal rules

## Contents

- Renewal rules for Thai documents
- CSV template (copy into `important-docs.csv`)
- Monthly check prompt

## Renewal rules for Thai documents

| Document | Validity | When to act | Where / how |
|---|---|---|---|
| บัตรประจำตัวประชาชน | 8 years, ends on the holder's birthday | Apply within 60 days after expiry; age 70+ not required to hold a new card | สำนักทะเบียนอำเภอ / เขต — bring the old card |
| Passport (หนังสือเดินทาง) | 5 years (1,000 บาท) or 10 years for age 20+ (1,500 บาท); express same-day 3,000 / 3,500 บาท | 120 days before a trip; many countries need 6 months left at entry | Book at qpassport.in.th; a new book is issued (no "renewal"); adults bring ID card + old passport; delivery by post 2–5 working days |
| ใบขับขี่ | First licence 2 years, then 5 years | Renew up to 6 months before expiry | กรมการขนส่งทางบก office or DLT Smart Queue app |
| ภาษีรถประจำปี + พ.ร.บ. | 1 year | Tax can be paid up to 90 days early (รอยืนยัน); พ.ร.บ. must be valid to pay tax | DLT e-service / app, ห้าง, ไปรษณีย์ — `vehicle-care` (home-family) if installed |
| Insurance policies | Usually 1 year (life: term of policy) | 30 days before — compare, do not auto-renew blind | Insurer app; premium certificate needed for tax |
| Lease (สัญญาเช่า) | Usually 1 year | 60 days — notice period is in the contract | Landlord |
| ทะเบียนบ้าน, สูติบัตร, ทะเบียนสมรส, โฉนด, เล่มทะเบียนรถ | No expiry | — | Record location; know the replacement office (อำเภอ/เขต, สำนักงานที่ดิน, ขนส่ง) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipbs.or.th/news/content/302339 · https://www.thairath.co.th/lifestyle/life/2859846 · https://www.sanook.com/campus/1432579/ · https://www.autospinn.com/2021/04/driver-s-license-82416

## CSV template

```csv
section,item,holder,ref_no,issuer,start_date,end_date,extended_until,renew_lead_days,location,file,contact,amount,notes
identity,บัตรประชาชน,Nok,…1234,อำเภอเมือง,2020-05-02,2028-05-01,,0,physical: wallet,2020-05-02_nok_idcard.pdf,[office phone],,
identity,Passport,Nok,…5678,กรมการกงสุล,2022-03-15,2027-03-14,,120,physical: ตู้เอกสาร ลิ้นชัก 2,2022-03-15_nok_passport.pdf,02-572-8442,1500,10-year book next time
vehicle,ภาษีรถ + พ.ร.บ.,Tom,กข 1234,กรมการขนส่งทางบก,2025-12-01,2026-11-30,,90,physical: car glovebox,2025-12-01_tom_car-tax.pdf,[office phone],,
insurance,Health policy,Tom,…9012,[insurer],2025-12-01,2026-12-01,,30,digital: Drive/Docs/Insurance/,2025-12-01_tom_health-policy.pdf,[insurer hotline],18500,premium cert for tax
warranty,Air purifier [brand model],Nok,SN-AB123456,[shop] order 123,2025-11-20,2026-11-20,,30,digital: Drive/Docs/Warranty/,2025-11-20_air-purifier_receipt.jpg,[service centre],5990,paid by credit card; registered online
```

Open in any spreadsheet; sort by `end_date`. Do not add columns per section — use `notes`.

## Monthly check prompt

> Read `important-docs.csv`. List rows where end_date minus today is within renew_lead_days, or within 60 / 30 / 7 days. For each give item, holder, days left, location, and the renewal step from the table. Then list rows with `unknown` dates.
