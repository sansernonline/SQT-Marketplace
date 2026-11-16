# Worked example · security-audit

## One worked example

Label `ตัวอย่าง` (example). Built from this skill's test scenario and not yet run against a real customer system.

**Scenario:** "ลูกค้าจะรับระบบสั่งของสัปดาห์หน้า ช่วยไล่หาช่องโหว่ทั้งโปรเจกต์ให้หน่อย" · an Express repo of about 3,000 lines with a LINE webhook · no `.sandbox/`

**What was done:** Asked everything once. The user chose `quick` · whole repo · read-only. 4 recon agents found 9 entry points → ledger of 31 rows → 6 hunters → the gap check found `GET /orders/export.csv` had no row, so 2 rows were added and 1 more hunter ran → 5 candidates, verified by 5 fresh `reviewer` agents

**Result:**

| id | Verdict | Subject | Reason |
|---|---|---|---|
| F-001 | `confirmed` · `high` · A01 | `GET /orders/:id` does not filter by owner, so a customer can open another person's order with their phone number | The query uses only `id`, with no `customerId` · `pdpa` is true |
| F-002 | `needs_validation` | `/webhook/line` does not check `x-line-signature` | The code really does not check, but the README says a reverse proxy checks it, and that proxy is not in the repo · `check_plan`: send a request with a wrong signature to the test URL and expect 401 |
| F-003 | `rejected` | semgrep warns about `exec()` in `scripts/seed.js` | The file runs only at machine setup and has no entry point from users |
| — | hardening | No CSP | The API returns JSON only and has no HTML pages |

F-001 goes to playbook `bug-fix`. The test `A01_other_user_order_returns_404` fails before the fix and passes after. The report states that the review was `quick` and names the units not yet checked.
