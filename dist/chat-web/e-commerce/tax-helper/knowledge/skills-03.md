# skill: dbd-annual-filing

Use when a Thai company files after year end (AGM, audited statements via DBD e-Filing, BOJ 5, PND 50).

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
| 6 | **ภ.ง.ด.50** corporate income tax + audited statements to RD | ประมวลรัษฎากร ม.68 | within **150 days** after year end (+8 days on e-Filing, see `tax-vat-th`) |

### For a 31 December 2569 year end

| Deadline | Date |
|---|---|
| AGM | by 30 Apr 2570 |
| บอจ.5 | 14 days after the AGM (AGM 28 Apr → by 12 May 2570) |
| Statements to DBD | 1 month after the AGM (AGM 28 Apr → by 28 May 2570) |
| ภ.ง.ด.50 | by 30 May 2570 (Sun) → next working day, Mon 31 May 2570 (RD Order ป.117/2545, https://www.rd.go.th/10514.html, checked 22 ต.ค. 2569) — +8 days on e-Filing if the extension is renewed after 31 Jan 2570 (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://efiling.dbd.go.th · https://www.dbd.go.th · https://www.infoproff.com/en/open-data/thailand/114/financial-reporting-obligations-for-companies-in-thailand

## 2. Partnerships and others

| Entity | AGM | Shareholder list | Financial statements to DBD | ภ.ง.ด.50 |
|---|---|---|---|---|
| บริษัทจำกัด | yes, within 4 months | บอจ.5, 14 days after AGM | 1 month after AGM | 150 days |
| ห้างหุ้นส่วนสามัญนิติบุคคล / ห้างหุ้นส่วนจำกัด (หจก.) | **no** AGM | **no** บอจ.5 | within **5 months** after year end | 150 days |
| บริษัทมหาชนจำกัด | yes (พ.ร.บ.บริษัทมหาชน) | yes | 1 month after AGM | 150 days |
| Foreign company branch / joint venture | no | no | within 5 months | 150 days |

- Small หจก. with registered capital ≤ 5 M, assets ≤ 30 M and revenue ≤ 30 M may use a **Tax Auditor (TA)** instead of a Certified Public Accountant (CPA, ผู้สอบบัญชีรับอนุญาต) for the audit (รอยืนยัน current thresholds).

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
| ภ.ง.ด.50 late | surcharge 1.5% per month on unpaid tax + fine up to 2,000 | see `tax-vat-th` |
| Not filing for 3 years in a row | DBD may strike the company off as abandoned (ม.1246 ป.พ.พ.) | |

## Workflow

1. Ask: entity type, accounting year end, auditor booked, any dormant period.
2. Build the timeline backward from section 1 (section 2 for a partnership). Move dates that fall on weekends or holidays (`thai-holidays`).
3. Checklist per step: trial balance, bank confirmations, stock count, fixed-asset register, AGM notice and minutes, shareholder register, ส.บช.3, ภ.ง.ด.50 with ภ.ง.ด.51 credit.
4. Book the auditor at least 2 months before the AGM. Auditors are usually fully booked in March–April.
5. Already late? File now, then settle the fine. The fine grows with each day late.

## Related

`tax-vat-th` (ภ.ง.ด.50/51, surcharge) · `payroll-th` (ภ.ง.ด.1ก in February) · `doc-thai-official` (AGM notice, letters) · `thai-holidays`.


---

# skill: labour-law-basics

Use when asking about the Thai Labour Protection Act (probation, OT, leave, notice, severance, wages).

# Thai Labour Law Basics (พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541 และที่แก้ไขเพิ่มเติม)

These are the numbers HR is asked about every week. This is general information, not legal advice. Disputes go to the labour inspector (สำนักงานสวัสดิการและคุ้มครองแรงงาน, hotline 1546) or a labour lawyer. The Act sets a floor; a contract or work rules may give more, never less.

## 1. Working time

| Item | Rule | Section |
|---|---|---|
| Normal hours | ≤ 8 h/day and ≤ 48 h/week; hazardous work ≤ 7 h/day, 42 h/week | ม.23 |
| Break | ≥ 1 hour after no more than 5 consecutive hours | ม.27 |
| Weekly holiday | ≥ 1 day per week, at most 6 days apart | ม.28 |
| Traditional holidays | ≥ 13 days a year including Labour Day 1 May (see `thai-holidays`) | ม.29 |
| OT and holiday work | only with the employee's consent each time (except continuous/emergency work); OT + holiday OT ≤ 36 h/week | ม.24, กฎกระทรวง |

## 2. Overtime and holiday pay

| Situation | Pay | Section |
|---|---|---|
| OT on a working day | **1.5×** hourly wage per hour | ม.61 |
| Work during normal hours on a holiday — monthly-paid employee | **+1×** hourly wage (on top of the monthly salary) | ม.62(1) |
| Work during normal hours on a holiday — daily/hourly-paid employee | **2×** hourly wage | ม.62(2) |
| OT on a holiday (beyond normal hours) | **3×** hourly wage | ม.63 |
| Hourly wage of a monthly employee | monthly salary ÷ 30 ÷ normal hours per day | ม.68 |

Example: salary 24,000, 8-hour day → hourly 100. 3 h OT on Wednesday = 450. 8 h on a public holiday = 800 extra. 2 h after that = 600.

## 3. Leave entitlements

Full table with pay, documents and the 2568 changes: [references/leave-and-severance.md](references/leave-and-severance.md). Headline:

| Leave | Days | Paid |
|---|---|---|
| Sick | as actually sick | up to **30 working days/year**; employer may ask for a medical certificate for 3+ consecutive days |
| Annual | **≥ 6 working days** after 1 year of service | yes |
| Personal business (ลากิจ) | ≥ 3 working days/year | yes |
| Maternity | **120 days** (was 98) incl. prenatal visits | employer pays up to **60 days** (was 45); SSO pays its maternity cash separately |
| Paternity / helping spouse care for newborn | **15 working days** (new) | yes (รอยืนยัน pay rule in the final text) |
| Child care when the newborn is ill or disabled | +15 days | 50% of wage |
| Military, training, sterilisation | per ม.33, 35, 36 | military up to 60 days paid |

Changes in force from **7 Dec 2568** (พ.ร.บ.คุ้มครองแรงงาน (ฉบับที่ 9) พ.ศ. 2568).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=551748 · https://www.pptvhd36.com/news/ข่าวในพระราชสำนัก/261050

## 4. Probation, notice, pay in lieu

- **Probation** — the Act sets no length. A probationer is an employee: dismissal still needs notice (ม.17). Service of **120 days or more** earns severance even during probation — hence "119-day probation" contracts.
- **Notice (ม.17)** — a fixed-term contract ends on its date without notice (para 1). For a contract with no fixed term, either side gives written notice **on or before a pay day** so the contract ends on the **next pay day**; no more than 3 months' notice is required (para 2). If the employer gives no reason in the dismissal letter, it cannot rely on ม.119 grounds afterwards (para 3). Paras 1-3 checked against the gazette text of the 2541 Act.
- **Pay in lieu (ม.17 para 4 · ม.17/1)** — the employer may pay the wages due up to the notice end date and let the employee leave at once (ม.17 para 4). If it dismisses without notice, ม.17/1 requires a sum equal to the wages the employee would have earned from the leaving date to the date the termination would have taken effect, paid on the leaving date.
- Sources, checked 2026-10-26: ม.17 — Royal Gazette vol. 115 part 8 ก, 20 Feb 2541, p. 6 (copy of ratchakitcha.soc.go.th held by web.archive.org); ม.17/1 — Labour Protection Act (No. 7) B.E. 2562 as quoted by the Secretariat of the Senate, senate.go.th/assets/portals/93/fileups/272/files/Sub_Jun/12know/k147.pdf p. 141. Not yet checked: the gazette of No. 7 itself, and that Nos. 8 and 9 left ม.17 unchanged.
- On termination also pay: unused annual leave pro rata (ม.67), outstanding wages and OT within 3 days (ม.70).

## 5. Severance pay (ม.118)

| Continuous service | Severance (days of last wage) |
|---|---|
| 120 days – under 1 year | 30 |
| 1 – under 3 years | 90 |
| 3 – under 6 years | 180 |
| 6 – under 10 years | 240 |
| 10 – under 20 years | 300 |
| 20 years or more | **400** |

- Retirement counts as termination — severance is due (ม.118/1). An employee over 60 may elect to retire with 30 days' notice.
- **Not owed (ม.119)** when dismissed for: dishonesty or a crime against the employer; intentional harm; negligence causing serious damage; breaching work rules after a written warning (valid 1 year) — serious cases need no warning; absent **3 consecutive working days** without good reason; imprisonment by final judgment.
- Extra severance applies for relocation (ม.120) and redundancy from new technology (ม.121–122).

Worked example: last wage 30,000/month (1,000/day), 7 years of service → 240 days × 1,000 = **240,000** + notice pay if no notice given.

## 6. Minimum wage

Set by the Wage Committee (คณะกรรมการค่าจ้าง) by province. From 1 Jul 2568 (ประกาศฉบับที่ 14) the top rate is **400 baht/day** (Bangkok, Chonburi, Rayong, Chachoengsao, Phuket, Ko Samui district, and hotels and service venues nationwide) and the lowest is **337 baht/day**. The committee met 17 มี.ค. 2569 and postponed any 2569 raise, so these rates are still in force. Always look up the current announcement (ประกาศคณะกรรมการค่าจ้าง เรื่อง อัตราค่าจ้างขั้นต่ำ) on mol.go.th / wage.mol.go.th before quoting — a round for 2570 may come (รอยืนยัน).

ตรวจล่าสุด 2026-10-22 · แหล่ง: https://www.prd.go.th/th/content/category/detail/id/39/iid/402570 · https://www.thaipbs.or.th/news/content/503458 (เลื่อนปรับ มี.ค. 2569) · https://thestandard.co/new-minimum-wage-rates-explained-july-2025/

## Rules of thumb

- 10+ employees → must have Thai-language work rules (ข้อบังคับเกี่ยวกับการทำงาน, ม.108) announced within 15 days of reaching 10 employees and posted at the workplace. No filing with the labour office since 2560 (NCPO Order 21/2560; sources: https://www.ilct.co.th/amendment-to-labour-protection-act/ · https://legardy.com/thai-law/labor-law/labor-law-section-9 — รอยืนยัน on mol.go.th / krisdika.go.th, checked 22 ต.ค. 2569).
- Put every warning, consent to OT and termination in writing.
- Pay on time: late wages carry 15% per year interest; wilful delay 15% every 7 days (ม.9).

## Related

`payroll-th` (OT in payroll) · `social-security-th` (maternity cash, unemployment) · `doc-leave` · `doc-contract-th` · `thai-holidays`.


## reference: leave-and-severance.md

# Leave entitlements and termination checklist

General information under พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541 as amended to (ฉบับที่ 9) พ.ศ. 2568. Company rules may be more generous.

## Leave table

| Leave | Entitlement | Paid by employer | Section | Notes |
|---|---|---|---|---|
| Sick leave (ลาป่วย) | as actually sick | up to 30 working days a year | ม.32, ม.57 | medical certificate may be required for 3+ consecutive days; work injury leave does not count toward the 30 |
| Sterilisation leave | as the doctor certifies | yes | ม.33, ม.57 | |
| Personal business (ลากิจธุระอันจำเป็น) | ≥ 3 working days/year | yes, 3 days | ม.34, ม.57/1 | |
| Military service / reserve call-up | as called | up to 60 days/year | ม.35, ม.58 | |
| Training / skills development | per rules | not required | ม.36 | |
| Annual leave (ลาพักร้อน) | ≥ 6 working days after 1 year | yes | ม.30, ม.56 | may carry forward by agreement; unused paid on termination (ม.67) |
| Maternity (ลาคลอด) | **120 days** including prenatal visits | up to **60 days** | ม.41, ม.59 | was 98 days / 45 paid before 7 Dec 2568 |
| Spouse helping after birth | **15 working days** | yes (รอยืนยัน) | new 2568 | new since 7 Dec 2568 |
| Child care — newborn ill/disabled | +15 days | 50% of wage | new 2568 | |
| Pregnant employee | may ask for temporary lighter duties | — | ม.42 | no dismissal because of pregnancy (ม.43) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.infoquest.co.th/?p=551748 · https://flowaccount.com/blog/maternity-leave-law/

## Termination checklist

1. Reason documented; check ม.119 grounds if refusing severance (written warning on file?).
2. Notice dated at or before a pay day; otherwise compute pay in lieu (ม.17/1).
3. Severance per ม.118 table from the start date (probation counts).
4. Unused annual leave pro rata.
5. Final wages, OT, commission within 3 days of termination (ม.70).
6. SSO: สปส.6-09 by the 15th of next month (see `social-security-th`).
7. 50 ทวิ for the year to date (see `payroll-th`).
8. Work certificate (หนังสือรับรองการทำงาน) on request — required by ป.พ.พ. ม.585.
9. Severance is taxable income, but there is a special exemption/calculation for termination pay — check with the accountant.
