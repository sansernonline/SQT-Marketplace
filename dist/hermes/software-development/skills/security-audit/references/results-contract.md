# Where results live and the data contract

Section 7 of [`SKILL.md`](../SKILL.md), moved here so the hard rules stay near the top of the skill.

Results live in `qa/security/audit-<YYYY-MM-DD>/` of the project (deliverable to the customer). Sub-agent drafts and raw scan output live in `_to_delete/security/`.

| File | Content | Who writes it |
|---|---|---|
| `architecture.md` | The conclusions of step 1 | Team lead |
| `ledger.json` | `{ "rows": [...] }`, 1 row per work unit · fields as in [`ledger`](ledger.md) | Team lead |
| `findings.json` | `{ "audit": {date, repo, commit, profile}, "findings": [...] }` · for a folder that is not git, set `commit` to `"none"` | Team lead |
| `REPORT.md` · `NEEDS-VALIDATION.md` | Built from the 2 files above, following the [`report-th`](../assets/report-th.md) template | `scripts/render_report.mjs`, then the lead fills in the prose parts |

The fields of 1 finding (field names are fixed and the validator accepts no others):

| Field | Meaning |
|---|---|
| `id` | `F-001`, in file order |
| `fingerprint` | 16 hex characters computed from `class` + `location.file` + `location.symbol` + `entrypoint` by the script, never typed by hand · the same root cause gets the same value every round |
| `verdict` · `severity` | Sections 4 and 5 |
| `title` · `class` | A short title · the attack class from `attack-classes`, such as `idor` · `webhook-signature` |
| `owasp` · `cwe` | `A01`..`A10` or `null` · `CWE-639` or `null` |
| `location` | `{file, line, symbol}` the place that must be fixed · a relative path in the repo using `/` |
| `entrypoint` | `<path>#<entry point>` such as `src/routes/orders.js#GET /orders/:id` |
| `trace` | `[{file, line, note}]` the first step is the entrypoint's file, running on to the point of harm |
| `preconditions` | Conditions that must be true first, such as `login เป็นลูกค้าธรรมดา` |
| `impact` · `owner_impact_th` | The technical effect · the effect in business-owner language, 1 sentence |
| `pdpa` | `{personal_data, kinds}` such as `{"personal_data": true, "kinds": ["เลขบัตรประชาชน", "เบอร์โทร"]}` |
| `evidence` | What was really seen: lines of code · commands run in the lab and their results (secrets cut to the last 4 characters) |
| `missing` · `check_plan` | Required when `needs_validation` |
| `reject_reason` | Required when `rejected` |
| `fix` | The narrowest fix at the last trustworthy decision point + the test that must fail before the fix |
| `hunted_by` · `verified_by` | The name or code of the agent that hunted · that verified (must not be the same) |
| `coverage_ids` | The ledger rows this finding came from, cited back in both directions |

Validate with the scripts in this skill's folder (Node with no dependencies, runs on Windows):

```bash
node <skill>/scripts/fingerprint.mjs idor src/orders/repo.js findOrderById "src/routes/orders.js#GET /orders/:id"   # no symbol: put -
node <skill>/scripts/validate_findings.mjs qa/security/audit-2026-10-26/findings.json --ledger qa/security/audit-2026-10-26/ledger.json
node <skill>/scripts/validate_ledger.mjs qa/security/audit-2026-10-26/ledger.json --findings qa/security/audit-2026-10-26/findings.json
node <skill>/scripts/render_report.mjs qa/security/audit-2026-10-26            # if a report already exists, --force is needed to overwrite it
```

The 2 validators and `render_report.mjs` have `--self-test` (`fingerprint.mjs` is a calculator and has none). Exit 0 means pass · 1 means fail · 2 means bad invocation. A pass means the format and the cross-references are right, not that the vulnerability is real. If a validator fails, do not build the report. No secrets may appear in any file of the results folder. The validator catches known patterns but not every one, so the team lead must also read the `evidence` field.
