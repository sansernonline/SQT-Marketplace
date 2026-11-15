# Step 2 coverage list (ledger): count what has been checked and what has not

The ledger is the list of work units, 1 row per unit. 1 unit = 1 entry point × 1 trust boundary × 1 attack class. Only the team lead writes this file. Sub-agents return results per unit and the lead updates the ledger.

Without a ledger you cannot tell whether "found nothing" means there is nothing or means nobody looked. So every report counts from the ledger, not from a feeling.

## File shape

`qa/security/audit-<YYYY-MM-DD>/ledger.json`

```json
{
  "rows": [
    {
      "coverage_id": "src/routes/orders.js#getOrder:customer-to-other-customer:idor",
      "entrypoint": "src/routes/orders.js#GET /orders/:id",
      "boundary": "customer-to-other-customer",
      "class": "idor",
      "status": "checked",
      "finding_ids": ["F-001"],
      "note": "query ใช้ id อย่างเดียว · ยืนยันโดย reviewer-5a"
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `coverage_id` | `<path>#<symbol>:<boundary>:<class>` · unique · no line number, round or agent name, because it must stay the same across rounds |
| `entrypoint` | `<path>#<entry point>` in the same form as the finding's `entrypoint` |
| `boundary` | The line being crossed, written as `<from>-to-<to>`, for example `anonymous-to-customer` · `customer-to-other-customer` · `shop-to-other-shop` · `line-platform-to-server` · `staff-to-admin` |
| `class` | The attack class, using the same name as the finding's `class` field (the list is in `attack-classes`). The validator does not lock the list, so you may add a new class. But if a name is already in the list, use that name, because the fingerprint is computed from this field. If the name changes, the old finding becomes a new one. |
| `status` | The table below |
| `finding_ids` | The ids of findings that come from this unit · use `[]` if none · a finding must refer back to this row in `coverage_ids` |
| `note` | What was checked and the result · required when `not_applicable` or `blocked` |

## coverage_id

- `<path>` is the file that holds the entry-point handler. `<symbol>` is the function, class or handler name (if it has no name, use the method+path with special characters removed, such as `get-orders-id`). The path always uses `/`, even on Windows.
- Allowed characters: a-z 0-9 `/` `.` `_` `-` `#` `:` only. Spaces and any other character become `-`.
- `quick` may merge units coarsely: use `<path>#*` in place of the symbol when the whole file uses the same control. Never merge across boundaries or across classes.
- `deep` also splits by data life cycle, appended to the class, such as `idor-delete` · `idor-restore`.

## Status

| Status | Meaning | Requires |
|---|---|---|
| `pending` | Not yet handed out, or handed out with no result yet | — |
| `checked` | The sub-agent returned a result, and the lead saw evidence that the unit was fully checked. It may or may not have a finding. | `note` says what was checked |
| `not_applicable` | This unit does not really exist, for example the entry point needs no login, so the `customer-to-other-customer` boundary does not exist | `note` gives the reason |
| `blocked` | Cannot be checked, because a fact outside the repo is missing, the lab cannot run, or the budget ran out | `note` says what blocked it |

- A row still `pending` at the end draws a warning from the validator, and the report must count it as outstanding work. Never change it to `checked` to make the numbers look good.
- Scope outside this round (the user chose a partial review) needs no row, but the report must state the scope.
- If the budget runs out before everything is handed out, set the remaining rows to `blocked` with `note: งบหมด` and report `ยังไม่ครบ`.

## Building rows from architecture.md

1. Go through every entry point from angle 1c.
2. For each entry point, ask which user level can reach it and what it can cross into. That gives 1 or more boundaries.
3. For each boundary, choose the possible attack classes from `attack-classes` and the family files chosen.
4. Bind each candidate from `security-gate` to the row that matches it. If no row matches, create a new row.
5. If a previous round has a ledger: carry over all old rows. A row whose code has not changed and was `checked` may stay `checked`, but the confirmed items in that row must be re-verified. If the code changed, go back to `pending`. An earlier `blocked` goes back to `pending`.

## Validate

```bash
node <skill>/scripts/validate_ledger.mjs qa/security/audit-<YYYY-MM-DD>/ledger.json --findings qa/security/audit-<YYYY-MM-DD>/findings.json
```

The validator catches: duplicate `coverage_id` · a status outside the 4 values · `not_applicable` or `blocked` with no `note` · an unsafe path. A row still `pending` appears as a warning, not an error. With `--findings`, it catches references that do not point back in both directions (a row cites a finding but the finding does not cite the row, or the reverse).
