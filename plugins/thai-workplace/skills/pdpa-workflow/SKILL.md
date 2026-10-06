---
name: pdpa-workflow
description: Use when a Thai SME must run PDPA in practice — consent form, ROPA, data-subject requests within 30 days, breach notice to สคส. within 72 hours, vendor checks. General information, not legal advice.
---

# PDPA Workflow for Thai SMEs

พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 turned into paperwork a small company can actually run. General information, not legal advice — disputes, regulator letters and cross-border transfers go to a lawyer (ทนายความ) or a DPO (เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล). Works on its own; if installed, `pdpa-compliance` (software-company) covers designing systems that hold personal data.

## 1. Deadlines that matter

| Duty | Deadline | Section |
|---|---|---|
| Notify the PDPC office (สคส.) of a personal-data breach | **within 72 hours** of becoming aware, unless the breach is unlikely to risk people's rights | ม.37(4) |
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
| Children under 10 | consent of the parent | yes |

## 3. Workflows

### A. Inventory and ROPA (once, then review yearly)
1. List every collection point: website forms, LINE OA, POS, CCTV, HR files, job applications, delivery labels.
2. For each: data items, purpose, basis, who can access, where stored, vendors, retention, deletion method.
3. Write it into the ROPA template ([references/pdpa-templates.md](references/pdpa-templates.md)).
4. Small businesses may be partly exempt from keeping a ROPA under a PDPC announcement — not if they handle sensitive data or high-risk processing (รอยืนยัน the current conditions); keeping one anyway is cheap.

### B. Privacy notice and consent
1. Privacy notice (ประกาศความเป็นส่วนตัว) at every collection point — what, why, basis, retention, rights, contact.
2. Consent form only for consent-based purposes, one tick per purpose, version and timestamp stored.
3. Withdrawal channel (LINE keyword, email) that works the same day.

### C. Data-subject request (DSR)
1. Log the request (day 0), verify identity (ID card copy redacted, or match account details).
2. Find the data across systems (ROPA tells you where).
3. Decide: fulfil, partly, or refuse with the legal ground (e.g. law requires keeping tax records).
4. Reply in writing **by day 30**; record what was done.

### D. Breach response (clock starts when you become aware)
| Hour | Action |
|---|---|
| 0–4 | contain (reset passwords, revoke links, isolate device); start the incident log |
| 4–24 | scope: what data, how many people, sensitive?, likely harm |
| 24–48 | decide: risk to rights? → notify สคส.; high risk? → notify people too |
| ≤ 72 | file the notification with สคส. (online at pdpc.or.th, รอยืนยัน the current channel); if late, file anyway and explain the delay |
| after | fix root cause; update ROPA and vendor terms |

Even breaches you decide not to report go in the incident log with the reason.

### E. Vendor check (before sharing data)
What data, why, where stored (country), sub-processors, security measures, breach history, a data processing agreement (ข้อตกลงการประมวลผลข้อมูล) with breach-notice duty to you within 24–48 hours.

## Worked example

A clinic's LINE OA admin sends a patient list (120 names + phone + diagnosis) to the wrong group at 10:00 Monday.
Health data = sensitive → high risk. Contain: delete message, ask group to delete, log at 10:15. Notify สคส. by **10:00 Thursday**; notify the 120 patients without delay with what happened and a contact. Root cause: admin rights for too many staff → reduce, add a two-person check for files.

## Rules

- Collect the minimum; delete on schedule — data you do not hold cannot leak.
- Do not copy national ID cards unless a law requires it; if needed, write the purpose on the copy.
- Penalties include administrative fines up to millions of baht and criminal penalties for some offences (ม.79–90) — treat deadlines as real.

## Related

`line-chatbot` (chat logs) · `doc-leave` (health certificates) · `payroll-th` · `doc-contract-th` (data clauses) · if installed: `pdpa-compliance`, `audit-trail` (software-company).
