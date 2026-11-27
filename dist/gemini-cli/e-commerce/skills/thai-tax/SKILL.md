---
name: thai-tax
description: Use when a Thai business asks about VAT, e-tax invoices, filing or DBD
---

# thai-tax — which tax to file, when, and how to issue a tax invoice

> **One rule:** check every rate, threshold and deadline on the Revenue Department (rd.go.th) or the DBD page of the current year before using it; a number from memory is not used.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| A Thai company asks what tax to file, VAT, WHT rates, monthly calendar | [references/tax-vat-th.md](references/tax-vat-th.md) |
| A Thai individual online seller asks about personal tax (ภ.ง.ด.90) | [references/seller-tax-basics.md](references/seller-tax-basics.md) |
| A VAT business issues or checks a tax invoice | [references/e-tax-invoice.md](references/e-tax-invoice.md) |
| A company files year-end DBD accounts and its annual return | [references/dbd-annual-filing.md](references/dbd-annual-filing.md) |

Other files in this folder: `reporting-and-records.md` and `wht-rates.md`. Scripts: `scripts/tax-compare.mjs`, `scripts/thai-id.mjs`.

## Steps every part shares

1. Confirm the rate, threshold or deadline on the official page, and write the date checked.
2. Run the calculation with the script in `scripts/` instead of by hand.
3. End with a checklist of documents and the handoff to the accountant.

## Check before done

- General information, not tax advice. A licensed accountant (ผู้สอบบัญชี or นักบัญชี) signs off every real filing.
- The filing itself is done by the user or the accountant; this skill organises the calendar and the checklist.
- Never alter an issued tax invoice; correct it with a credit note (ใบลดหนี้) or a debit note (ใบเพิ่มหนี้), or cancel and re-issue.
- A tax invoice missing any required field means the buyer cannot claim the input VAT; check every field before issue.
- Late filing: give the surcharge in outline and name the authority; do not promise a waiver.

Whole job with several steps → playbook [year-end](../superuser/references/playbook-year-end.md) (year-end accounts and returns).
