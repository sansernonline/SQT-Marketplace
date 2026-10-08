---
name: legacy-spec-recovery
description: Use when a legacy system has source code but no spec or documents and someone wants to change it — recovers an as-is spec with evidence and confidence labels, then handles change requests with impact analysis.
---

# Legacy Spec Recovery

Turn an undocumented system into an as-is spec that a change request can be measured against. The code says **what** the system does; it cannot say whether that was **intended**. Every claim therefore carries a source and a confidence label, and everything the code cannot answer becomes a question for a person.

Use `reverse-engineering` instead when there is no source code, only binaries.

## The four rules

1. **Every claim has a source.** `path:line`, a table name, a manual page — or it is not written down.
2. **Every claim has a label.**

   | Label | Meaning | Example |
   |---|---|---|
   | ✅ code | Read in code or schema, can point to the line | `BookingContext.cs:412` rejects a booking when `QTY > 0` is false |
   | 📄 doc | Stated in a manual or old document, not checked against code | User manual p.7 says approval needs 2 levels |
   | 🟡 inferred | Guessed from names, UI text or data shape | Column `STS = 'C'` probably means cancelled |
   | ❓ ask | Code cannot answer — goes to the question list | Is the 3-day limit a business rule or a bug workaround? |

   When 📄 and ✅ disagree, record both and raise a ❓. That disagreement is often the most valuable finding.
3. **Wide and shallow first, deep only where a change will land.** Map the whole system at module level; write screen-level detail only for modules a change request touches. Coverage grows one change request at a time.
4. **Read only, outside the source tree.** Never edit, build, run migrations or execute the legacy system to "see what happens". Write output next to the code (`docs/as-is/`), not inside it. Never copy secrets: name a connection string or key, never its value.

## Where the evidence hides

Look in every layer — business rules in legacy systems are spread thin, not kept in one place.

| Layer | What to pull out |
|---|---|
| Routes, controllers, forms | Screen list, actions, who may call them |
| Data access code, stored procedures, views, triggers | The real rules: filters, status changes, calculations |
| Schema scripts, ORM models, `INFORMATION_SCHEMA` exports | Tables, keys, status code columns |
| Views and client scripts (`.cshtml`, `.aspx`, `.js`) | Validation the server never repeats, hidden fields, labels that name the business concept |
| Config files | Integrations, feature switches, environment names |
| Reports (`.rpt`, `.rdl`, `.pbix`) and ETL packages (SSIS, cron, jobs) | Calculations that exist only there, schedules |
| Enums and constant classes | The status vocabulary — decode it once, reuse everywhere |
| User manuals, old emails, ticket history | 📄 intent, to compare with ✅ behaviour |
| Commented-out code, `_old`, `Copy of` files | Previous rules; note them, do not treat as current |

Stack-specific locations: [references/evidence-by-stack.md](references/evidence-by-stack.md).

## Workflow

### Step 1 — Inventory (one pass, no reading of logic)

Count before reading. File counts by type, projects or modules, largest files, generated folders to ignore (`bin/`, `obj/`, `node_modules/`, publish output, vendored plugins). Write it to `docs/as-is/README.md` as a coverage table: every module listed, depth = none.

**Ask for the database scripts on day one.** Code calls stored procedures, views, triggers and functions whose source is usually not in the repository — and that is where tariff, tax and numbering rules live. Request a script-out of all database objects (and an export of menu and role tables if menus come from the database) before Step 2; until it arrives, those rules can only be 🟡 or ❓, and the coverage table must say so.

If the system is larger than one context can hold (it usually is), hand each layer to a subagent and tell it exactly what to bring back: a table with columns and the `path:line` per row, written to a file — not prose, not file dumps. Seven layers worked in practice: screens and permissions · data and status codes · one deep-dive module · rules for each half of the modules · integrations, jobs, reports and ETL · manuals. Then one analyst assembles. Budget for it: a system of about 55,000 lines took 8 subagents and about 2 million tokens.

### Step 2 — System map (whole system, shallow)

Produce, using the existing skills for format:

| File | Content | Skill |
|---|---|---|
| `01-system-overview.md` | Purpose in one paragraph, context diagram, components, integrations, tech stack and versions | `software-diagrams` |
| `02-module-inventory.md` | Module → screens / endpoints / reports / jobs → main tables | — |
| `03-data-dictionary.md` | Tables grouped by module, key columns, status codes decoded, core ER diagram | `database-design` |
| `04-business-rules.md` | Rule register — [assets/business-rule-register.md](assets/business-rule-register.md) | — |
| `05-open-questions.md` | Every ❓, grouped by who can answer, top 5 first | — |
| `06-findings.md` | Defects and security weaknesses found on the way — not rules | `security-gate` severity |

**Documenting a legacy system always turns up bugs and security holes.** Keep them out of the rule register: a rule is what the system does on purpose, a finding is what it does wrong. When unsure which, it is a ❓. `06-findings.md` gives location and a one-line fix, never exploitation steps or secret values, and is marked for the system owner only. Check these in every legacy web system, they are nearly always present: permission enforced only by hiding buttons, server never re-checking status order, SQL built by joining user input, secrets in config files under version control, document numbers issued without a lock.

### Step 3 — Deep dive (only the module a change touches)

`modules/<module>.md` at the level of `fsd-writing`: each screen, its fields and validation with the exact error text, status transitions as a state diagram, the queries behind each list, and every rule found added to the register with its ID. Keep the label on each line.

Then propose **characterization tests** — tests that record what the system does today so a change that breaks something else is caught. For legacy code that cannot be unit-tested, record at the edge: fixed inputs to a stored procedure, view or report, and the output saved as a golden file to compare after the change. List them; build them only when asked, and never against production data.

### Step 4 — Change request

For each request, fill [assets/change-request.md](assets/change-request.md):

1. Restate the request as a before/after against the as-is spec: which rule IDs, screens and tables change.
2. Impact: search the code for every table, column, procedure and status code touched, and list each hit. Callers outside the main application — reports, ETL, mobile clients, other systems reading the same database — are the ones usually missed.
3. Open ❓ items that block the change go to the requester first.
4. The characterization tests for the touched area must pass before and after.
5. After the change ships, update the as-is spec — it is now the to-be.

## Rules of thumb

- Name things the way the users do. Take screen titles and menu labels from the views, not class names.
- Decode a status code once in the data dictionary and link to it; never re-explain it per screen.
- Dead code is a finding, not a rule. Check whether a route is reachable from the menu before documenting the screen.
- Copy-pasted logic that differs slightly between modules is a ❓, not two rules — ask which one is right.
- Stop a module at the depth the change needs. A finished spec of a module nobody will change is waste.
- Report what was not read. The coverage table in the README is part of the deliverable.
- Status values hard-coded as strings with no enum are common. Harvest them with a search for quoted upper-case literals next to status columns, then decode them once in the data dictionary.
- Manuals lie by omission. Check for one manual that is a copy of another, or a cover page with nothing behind it. Scanned Thai PDFs often have no text layer, so they have to be read page by page as images — slow, so give them their own subagent.
- The order of the process across screens is rarely written anywhere. Rebuild it from which status each screen lists, not from the manual's table of contents.
