---
name: pdpa-workflow
description: Use when a Thai SME runs PDPA paperwork (consent, ROPA, data-subject requests, breach notice).
argument-hint: <consent|breach|request|vendor> [details]
---

# Personal Data Protection Act (PDPA) Workflow for Thai SMEs

พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 turned into paperwork a small company can actually run. This is general information, not legal advice. Disputes, regulator letters and cross-border transfers go to a lawyer (ทนายความ) or a data protection officer (DPO, เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล). Works on its own; if installed, `pdpa-compliance` (software-development) covers designing systems that hold personal data.

## 1. Deadlines that matter

| Duty | Deadline | Section |
|---|---|---|
| Notify the Personal Data Protection Committee (PDPC) office (สคส.) of a personal-data breach | **within 72 hours** of becoming aware, unless the breach is unlikely to risk people's rights | ม.37(4) |
| Notify affected people | without delay, when the risk is high, with remedies | ม.37(4) |
| Answer a data-subject request (access, copy, correction, deletion, objection, portability) | **within 30 days** of receiving it | ม.30 (and same practice for other rights) |
| Withdraw consent | as easy as giving it; stop processing for that purpose | ม.19 |
| Keep the record of processing (ROPA) | continuously; show the regulator on request | ม.39 |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thansettakij.com/technology/660448 · https://muic.mahidol.ac.th/th/news/siththikaarekhaathuengkh-muulswnbukhkhl-right-to-access-maatraa-30 · official text: https://www.pdpc.or.th

## 2. Lawful basis before consent

Consent is the weakest basis — it can be withdrawn. Pick the basis first (ม.24); ask for consent only when nothing else fits.

| Data use | Usual basis | Consent needed? |
|---|---|---|
| Deliver an order, payroll, employment file | contract (สัญญา) | no |
| Tax invoices, SSO, WHT records | legal obligation (หน้าที่ตามกฎหมาย) | no |
| CCTV for security | legitimate interest (ประโยชน์โดยชอบด้วยกฎหมาย) + sign at entrance | no |
| Marketing broadcasts, newsletters | consent | **yes**, separate tick, not pre-ticked |
| Health data (sick certificates), religion, biometrics (face scan time clock), criminal records | sensitive data — ม.26 | **explicit consent** unless a ม.26 exception applies (e.g. employment law duties, รอยืนยัน case by case) |
| Minors (under 20) | consent of the person with parental power (ผู้ใช้อำนาจปกครอง) unless the minor may act alone under the Civil and Commercial Code; under 10 → always the parent (ม.20) | yes |

## 3. Workflows

### A. Inventory and ROPA (once, then review yearly)
1. List every collection point: website forms, LINE OA, POS, CCTV, HR files, job applications, delivery labels.
2. For each: data items, purpose, basis, who can access, where stored, vendors, retention, deletion method.
3. Write it into the ROPA template ([references/pdpa-templates.md](references/pdpa-templates.md)).
4. Small businesses may be partly exempt from keeping a ROPA under a PDPC announcement — not if they handle sensitive data or high-risk processing (รอยืนยัน the current conditions); keeping one anyway is cheap.
5. PDPC published a **draft** ROPA practice guideline on 7 July 2569 (reported by tilleke.com; checked 2026-10-22). It is a draft, not yet in force (รอยืนยัน the final text on pdpc.or.th) — if it is adopted, align the template's columns with it.

### B. Privacy notice and consent
1. Privacy notice (ประกาศความเป็นส่วนตัว) at every collection point — what, why, basis, retention, rights, contact.
2. Consent form only for consent-based purposes, 1 tick per purpose, version and timestamp stored.
3. Withdrawal channel (LINE keyword, email) that works the same day.

### C. Data-subject request (DSR)
1. **Log the request (day 0) and name each right asked for.** One message can hold several ("send me my data, then delete it"): handle them in that order, copy first, then delete.
2. **Verify identity in proportion to the risk.** Matching the LINE account, phone or order the person already uses is enough for most requests; ask for a redacted ID card copy only when sending sensitive data or deleting an account. Checks so heavy they stop a real person are a refusal in disguise.
3. **Send a short acknowledgement within a few days**: request received, what we will search, the date the answer will come (inside 30 days).
4. **Search every system and tick it off**, using the ROPA as the list:

| System | Found | Notes |
|---|---|---|
| LINE OA chats | yes / no | |
| Marketplace order data (Shopee, Lazada, TikTok Shop) | yes / no | the platform holds the buyer account; we hold only what we exported |
| Google Sheets, order and customer lists | yes / no | |
| Customer relationship management (CRM) tool or POS | yes / no | |
| Email | yes / no | |
| Courier accounts (labels, COD records) | yes / no | |
| Backups and old exports | yes / no | |

5. **Decide per item**: fulfil, partly, or refuse. Write every refusal with its reason and the law relied on (for example, tax records must be kept 5–7 years, `sme-bookkeeping` section 2), and keep that note with the ROPA (the Act requires refusals to be recorded, ม.30 and ม.39, รอยืนยัน the exact paragraph).
6. **Reply in writing by day 30**: what was found, what was done, what was refused and why, and how to complain to สคส.
7. **We only process the data for someone else** (for example, we pack orders for another brand): forward the request to that controller the same day and tell the person who will answer.

The 2-letter flow (acknowledge, then answer) and the system checklist follow Anthropic's dsar-response skill, rewritten for Thai sellers.

### D. Breach response (clock starts when you become aware)
| Hour | Action |
|---|---|
| 0–4 | contain (reset passwords, revoke links, isolate device); start the incident log |
| 4–24 | scope: what data, how many people, sensitive?, likely harm |
| 24–48 | decide: if there is a risk to people's rights, notify สคส.; if the risk is high, notify the people too |
| ≤ 72 | file the notification with สคส. (online at pdpc.or.th, รอยืนยัน the current channel); if late, file anyway and explain the delay |
| after | fix root cause; update ROPA and vendor terms |

Even breaches you decide not to report go in the incident log with the reason.

### E. Vendor check (before sharing data)
What data, why, where stored (country), sub-processors, security measures, breach history, a data processing agreement (ข้อตกลงการประมวลผลข้อมูล) with breach-notice duty to you within 24–48 hours.

When the vendor sends its own agreement (chatbot, CRM, fulfilment warehouse, ad agency), check that it says:

- the vendor processes the data only on our written instructions and for our purpose
- staff and sub-processors are bound to confidentiality; new sub-processors need our notice or consent
- security measures are named, not just "appropriate"
- the vendor tells us of a breach fast enough for our 72-hour clock (section 1)
- the vendor helps us answer data-subject requests (section C)
- data is returned or deleted when the contract ends, with written confirmation
- the country where data is stored; storage abroad needs the cross-border check (lawyer)

These duties of a processor (ผู้ประมวลผลข้อมูลส่วนบุคคล) come from ม.40 (รอยืนยัน the full list in the Act's text on pdpc.or.th). Clauses that cap the vendor's liability at a token amount or let it use our customers' data for its own purposes go to a lawyer (`doc-contract-th` section 6).

## Worked example

A clinic's LINE OA admin sends a patient list (120 names + phone + diagnosis) to the wrong group at 10:00 Monday.
Health data is sensitive, so the risk is high. Contain: delete the message, ask the group to delete it, log at 10:15. Notify สคส. by **10:00 Thursday**; notify the 120 patients without delay with what happened and a contact. Root cause: too many staff had admin rights. Reduce them and add a 2-person check for files.

## Rules

- Collect the minimum; delete on schedule — data you do not hold cannot leak.
- Do not copy national ID cards unless a law requires it; if needed, write the purpose on the copy.
- Penalties include administrative fines up to millions of baht and criminal penalties for some offences (ม.79–90) — treat deadlines as real.

## Related

`line-chatbot` (chat logs) · `doc-leave` (health certificates) · `payroll-th` · `doc-contract-th` (data clauses) · if installed: `pdpa-compliance`, `audit-trail` (software-development).

## เรียกเป็นคำสั่ง

`/e-commerce:pdpa-workflow <consent|breach|request|vendor> [details]`

Run `pdpa-workflow` with the `compliance-helper` agent for: **$ARGUMENTS**

General information, not legal advice; incidents with legal exposure go to a Thai lawyer.
