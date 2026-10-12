---
name: doc-contract-th
description: Use when drafting or checking a Thai contract (employment, lease, hire of work, services). Clause checklists, stamp duty, red flags, when a lawyer is needed.
---

# Thai Basic Contract Draft

This skill gives a complete first draft and flags every risky clause. It is general information, not legal advice. A Thai lawyer (ทนายความ) reviews anything flagged ⚠️ before anyone signs.

## 1. Pick the contract type first

| Situation | Type (ป.พ.พ.) | Who pays stamp duty | Key law beyond the code |
|---|---|---|---|
| Staff on payroll, employer directs the work | จ้างแรงงาน (ม.575) | none — not in the stamp-duty schedule | พ.ร.บ.คุ้มครองแรงงาน (see `labour-law-basics`) |
| Deliver a result (website, renovation, design) | จ้างทำของ (ม.587) | ผู้รับจ้าง (contractor) | WHT 3% on payment (`tax-vat-th`) |
| Rent land, building, room | เช่าทรัพย์ (ม.537) | ผู้ให้เช่า (lessor) | residential landlords: สคบ. controlled-contract rules |
| Ongoing service (maintenance, retainer) | usually จ้างทำของ | ผู้รับจ้าง | |

A "freelancer" who works fixed hours under the company's orders is legally an employee — the label in the contract does not decide it.

## 2. Stamp duty (อากรแสตมป์)

| Instrument | Rate | Note |
|---|---|---|
| เช่าที่ดิน โรงเรือน สิ่งปลูกสร้าง | **1 baht per 1,000 baht** (or part) of the **total rent for the whole term** | lessor pays; ≥ 1 million baht → pay in cash/e-Stamp instead of stamps |
| จ้างทำของ | 1 baht per 1,000 baht (or part) of the fee (รอยืนยัน rate) | contractor pays; ≥ 1 million baht → cash/e-Stamp |
| กู้ยืมเงิน | 1 baht per 2,000 baht, max 10,000 (รอยืนยัน) | |
| ค้ำประกัน | 1 / 5 / 10 baht by amount (รอยืนยัน) | |
| สัญญาจ้างแรงงาน | none | |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://rd.go.th/67218.html (จ้างทำของ, ผู้รับจ้างชำระ, ≥ 1 ล้านบาทชำระเป็นตัวเงิน) · บัญชีอัตราอากรแสตมป์ via rd.go.th (เช่า 1 บาท ต่อ 1,000 บาท)

Stamp at signing, or pay through **e-Stamp Duty** on rd.go.th within 15 days of signing. An unstamped contract **cannot be used as evidence in a civil case** until duty plus surcharge (เงินเพิ่มอากร, several times the duty — รอยืนยัน multiple) is paid.

Worked example: office lease 25,000/month × 36 months = 900,000 → 900 baht stamp duty, paid by the lessor (often passed on by agreement — write who bears it).

## 3. Clause checklists

Full checklists for employment, lease and hire-of-work contracts: [references/clause-checklists.md](references/clause-checklists.md). Every contract has: parties with ID/tax numbers and authorised signer, recitals, scope, price and payment, term, breach and cure, termination, notices, governing law, signatures and 2 witnesses.

## 4. Red flags (mark ⚠️, never remove silently)

| Clause | Why it is risky in Thailand |
|---|---|
| Penalty (เบี้ยปรับ) far above real loss | court may reduce it (ป.พ.พ. ม.383) — draft a realistic rate, e.g. 0.1% per day capped at 10% |
| Non-compete for employees | enforceable only as far as fair and reasonable (พ.ร.บ.ว่าด้วยข้อสัญญาที่ไม่เป็นธรรม 2540) — limit area, time, field |
| Employee deposit / guarantor (เงินประกันการทำงาน) | allowed only for certain jobs, with limits under the Labour Protection Act (รอยืนยัน the ministerial rule) |
| Wage deductions beyond tax, SSO, PVD, agreed debts | restricted by ม.76 |
| Lease over 3 years not registered at the land office | enforceable for only 3 years (ม.538) |
| Landlord business keeps deposit for wear and tear | residential controlled contract: deposit + advance rent ≤ 3 months, refund in 7 days (14 if damage) — scope by number of units (รอยืนยัน) |
| One-sided termination without notice, automatic renewal, IP assigned with no fee | unfair-terms risk |
| Personal guarantee (ผู้ค้ำประกัน) | guarantor protections in ม.681–685/1; drafting errors void clauses |

## 5. When a lawyer is required, not optional

- Any ⚠️ clause above; amount above ~1 million baht or term over 3 years.
- Land, condominium, share, franchise, loan with collateral (จำนอง/จำนำ).
- Foreign party, foreign-currency payment, or arbitration abroad.
- Dismissing an employee, settlement agreements, or anything already in dispute.

## Workflow

1. Identify the type (section 1) and the parties' authority (company: หนังสือรับรอง and authorised director).
2. Fill the checklist for that type; leave unknowns as `{…}` not guesses.
3. Mark ⚠️ on red-flag clauses, with 1 line on why.
4. Compute stamp duty and say who pays.
5. Close with: "ร่างนี้จัดระเบียบเจตนาของคู่สัญญา ก่อนลงนามควรให้ทนายความตรวจ".

## Related

`labour-law-basics` · `doc-leave` · `doc-quotation` · `tax-vat-th` · `pdpa-workflow` (personal data clauses).
