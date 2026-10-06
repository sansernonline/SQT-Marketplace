# skill: dbd-annual-filing

Use when a Thai company or partnership must file after year end — AGM, audited financial statements via DBD e-Filing, บอจ.5, ภ.ง.ด.50 within 150 days. Builds the timeline back from the year-end date and flags late fines.

# Year-End Filing — DBD and Revenue Department

One year end, two authorities, four deadlines. General information, not legal or accounting advice — the auditor (ผู้สอบบัญชีรับอนุญาต) and accountant run the actual filing.

## 1. The timeline (company limited, บริษัทจำกัด)

| # | Step | Law | Deadline |
|---|---|---|---|
| 1 | Close books; auditor audits the financial statements (งบการเงิน) | พ.ร.บ.การบัญชี 2543 | before the AGM |
| 2 | Send AGM notice to shareholders | ป.พ.พ. ม.1175 | at least 7 days before (14 days if a special resolution is on the agenda); advertise per the articles |
| 3 | **Annual general meeting (AGM)** approves audited statements | ป.พ.พ. ม.1197 | within **4 months** after year end |
| 4 | **บอจ.5** shareholder list | ป.พ.พ. ม.1139 | within **14 days** after the AGM |
| 5 | **Financial statements** to DBD (DBD e-Filing) with AGM minutes and ส.บช.3 | พ.ร.บ.การบัญชี ม.11 | within **1 month** after the AGM approves (so at latest ~5 months after year end) |
| 6 | **ภ.ง.ด.50** corporate income tax + audited statements to RD | ประมวลรัษฎากร ม.68 | within **150 days** after year end (+8 days on e-Filing, see `tax-vat-th`) |

### For a 31 December 2569 year end

| Deadline | Date |
|---|---|
| AGM | by 30 Apr 2570 |
| บอจ.5 | 14 days after the AGM (AGM 28 Apr → by 12 May 2570) |
| Statements to DBD | 1 month after the AGM (AGM 28 Apr → by 28 May 2570) |
| ภ.ง.ด.50 | by 30 May 2570 (paper) — +8 days on e-Filing if the extension is renewed after 31 Jan 2570 (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://efiling.dbd.go.th · https://www.dbd.go.th · https://www.infoproff.com/en/open-data/thailand/114/financial-reporting-obligations-for-companies-in-thailand

## 2. Partnerships and others

| Entity | AGM | Shareholder list | Financial statements to DBD | ภ.ง.ด.50 |
|---|---|---|---|---|
| บริษัทจำกัด | yes, within 4 months | บอจ.5, 14 days after AGM | 1 month after AGM | 150 days |
| ห้างหุ้นส่วนสามัญนิติบุคคล / ห้างหุ้นส่วนจำกัด (หจก.) | **no** AGM | **no** บอจ.5 | within **5 months** after year end | 150 days |
| บริษัทมหาชนจำกัด | yes (พ.ร.บ.บริษัทมหาชน) | yes | 1 month after AGM | 150 days |
| Foreign company branch / joint venture | no | no | within 5 months | 150 days |

- Small หจก. with registered capital ≤ 5 M, assets ≤ 30 M and revenue ≤ 30 M may use a **Tax Auditor (TA)** instead of a CPA (ผู้สอบบัญชีรับอนุญาต) for the audit (รอยืนยัน current thresholds).

## 3. DBD e-Filing

1. Register the company's user on efiling.dbd.go.th (once; requires director identity verification).
2. The accountant prepares the XBRL in Excel (DBD template) from the trial balance.
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
2. Build the timeline backward from section 1 (or section 2 for a partnership); shift weekends/holidays (`thai-holidays`).
3. Checklist per step: trial balance, bank confirmations, stock count, fixed-asset register, AGM notice and minutes, shareholder register, ส.บช.3, ภ.ง.ด.50 with ภ.ง.ด.51 credit.
4. Book the auditor at least 2 months before the AGM — auditor capacity in March–April is the usual bottleneck.
5. If already late: file now, then settle the fine; fines grow with days late.

## Related

`tax-vat-th` (ภ.ง.ด.50/51, surcharge) · `payroll-th` (ภ.ง.ด.1ก in February) · `doc-thai-official` (AGM notice, letters) · `thai-holidays`.
