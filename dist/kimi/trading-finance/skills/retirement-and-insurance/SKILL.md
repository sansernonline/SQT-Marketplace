---
name: retirement-and-insurance
description: Use when planning retirement savings or checking insurance cover
---

# retirement-and-insurance — retirement savings and insurance cover

> **One rule:** every retirement figure is an estimate that is recomputed each year, and cover is chosen for the risk it covers, never for the tax deduction.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| How much to save to retire in Thailand | [references/retirement-plan.md](references/retirement-plan.md) |
| Checking whether insurance cover is enough | [references/insurance-review.md](references/insurance-review.md) |

Other files in this folder: `beneficiaries-and-rules.md` (who receives the money and the rules that apply), `worked-example.md`. Scripts: `scripts/retire.mjs` (run with a JSON input file; see `scripts/example.json`).

## Steps every part shares

1. Collect the age, the planned retirement age, the monthly spending and the current savings from the user's own records.
2. Run `scripts/retire.mjs` for any retirement number instead of working it out by hand.
3. Mark every figure that depends on a rate, a ceiling or a fee with its source and the year checked.

## Check before done

- General information, not financial or insurance advice. A Certified Financial Planner (CFP) can make a full plan.
- Check an insurance agent's or broker's licence at oic.or.th before the user buys anything.
- This skill does not pick a product or a fund for the user; it lists the questions and the trade-offs.
- Never buy cover only for the tax deduction; cover is decided by the risks the user actually has.
- The Social Security wage ceiling and the pension rules are checked on the official page of the current year (รอยืนยัน with the Social Security Office, hotline 1506).

Whole job with several steps → playbook [money-plan](../superuser/references/playbook-money-plan.md).
