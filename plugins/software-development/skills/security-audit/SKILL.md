---
name: security-audit
description: Use when auditing a whole codebase before handover
---

# security-audit — hunt for vulnerabilities across the whole system from code, and verify every item before reporting

This is a multi-step job, and the team lead (`superuser`) runs it.

> **The one rule:** if you cannot yet say who is harmed, how, and through which entry point, the item is not yet a vulnerability. Something that "should exist but does not", with no provable affected party, is hardening advice, not a finding.

## Use when

- The customer is about to accept the system, or the contract requires a whole-system security review, not just the latest diff
- The user asks for a "pen test from code" · "audit the whole repo" · "hunt for vulnerabilities across the whole project" · "ตรวจช่องโหว่ทั้งระบบ"
- You take over someone else's code and need to know which vulnerabilities are still open
- A previous round already audited, and you want to confirm the fixed items are really closed and find new problems in the parts that changed

Do not use when: a pre-merge or pre-ship gate that must be fast → `security-gate` · a question about the security of a single piece of code → answer directly from `principle-secure-by-default` without opening the 6 steps · penetration testing a live deployed system, or a system that is not our customer's → do not do it (this skill reads code and runs only in a lab) · already breached, tracing an incident, SIEM rules → `security-operations` · only an exe, APK or firmware with no source → `reverse-engineering` (continue here once you have decompiled source) · the short command `/security-scan` is a shortcut that points here (whole codebase) or to `security-gate` (diff before ship).

## Use another skill instead, or alongside

| Situation | Use | How it relates to this skill |
|---|---|---|
| Before merge · ship · adding a dependency | [`security-gate`](../security-gate/SKILL.md) | The gate's gitleaks · semgrep · trivy scan results come in as candidates in step 3 |
| Terraform · compose · Kubernetes · Helm is present, or an infra review is requested | [`infra-checklist`](references/infra-checklist.md) | The hunting list for the infrastructure family (ports · IAM · buckets · encryption · images) serves as work units in step 2 |
| The contract names OWASP Top 10 | [`security-gate` OWASP section](../security-gate/references/owasp-top10.md) | Every finding has an `owasp` field, so the report can summarize rows A01–A10 right away |
| Designing a new feature with no code yet | [`threat-model`](../threat-model/SKILL.md) | If a threat model already exists, the recon step starts from its DFD and non-capabilities |
| A finding touches personal data | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | For a confirmed item that may already have leaked, open section 8 (the first 72 hours) |
| Running the target code to prove something | [`docker-sandbox`](../docker-sandbox/SKILL.md) | `-Isolated -Locked` lab only |

## 1 · Ask everything once at the start

Search before asking: count lines of code (`git ls-files | xargs wc -l` or `cloc`) · check whether `.sandbox/`, an earlier `qa/security/audit-*`, or `docs/security/threat-model*.md` exists · then ask every question in one go.

| Question | Options (the first is the recommended default, adjust to what you found) |
|---|---|
| Profile | `quick` (recommended when the code is under about 20,000 lines, or for a repeat round) about 8–15 agents · `standard` about 15–40 agents · `deep` about 40–100 agents for money, health, or several customers in one database |
| Scope | The whole repo · only a named path or subsystem · only what changed since a named commit or tag (a partial scope must be stated in the report as a partial review) |
| May we run code to prove things | Yes, in `docker-sandbox -Isolated -Locked` (recommended if a lab already exists) · read code only, and anything that needs a run becomes `needs_validation` |
| Maximum budget (open field) | The maximum number of agents · if unanswered, use the upper range of the chosen profile |

The agent counts are estimates from the job structure in section 2 (recon 4 · 1 hunter per work unit · gap check 1–3 · 1–2 verifiers per candidate). They have not been measured on real jobs. Cost in money per round `(ยังไม่ได้ตรวจ)`. If you get no answer or the user says not to ask, use the recommended defaults and write them into the `decision-log` (a project with no `docs/BUILD-PLAN.md` records them under the "ตัดสินใจเอง" heading at the end of `REPORT.md`).

A profile changes only the breadth and the number of rounds, never the evidence standard. `quick` hunts one round, and lets the step 5 verifier do steps 5 and 6 together. `standard` hunts and gap-checks until at most 1 round of gaps remains. `deep` splits work units by subsystem and by data life cycle (create, edit, delete, restore) and loops the gap check until clean. In every profile, a confirmed item must pass a verifier that is not the hunter.

**Small project** (code under about 2,000 lines, entry points under about 10): the team lead may do steps 1–4 itself, because sending 4 agents to survey a few files costs more than reading them. Step 5 must still be a fresh agent, and you record the merged steps under "ตัดสินใจเอง". In `quick`, where the verifier does steps 5 and 6 together, that agent's corrections are its own verdict and need no third agent. Use the third agent when the final record checker disputes the verdict of a step 5 verifier that is a different agent.

## 2 · The 6 steps

Do them in order and never skip a step. There are only 2 ways to finish: the result files are complete and both validators pass, or the report says `ยังไม่ครบ` plainly, with the reason and the outstanding units.

| Step | What to do | Who | Output | Read |
|---|---|---|---|---|
| 1 Recon | Send 4 agents at once, read-only: the system and how it runs · users, rights and controls · where data enters and the dangerous points · what can run in the lab and what must be checked at deployment · then the lead writes `architecture.md` of about 1,000 words at most | `Explore` or `security-engineer`, 4 agents | `architecture.md` | [`recon`](references/recon.md) |
| 2 Coverage list | Split entry points × boundaries × attack classes into work units, 1 row per unit, status `pending` · pull in the latest `security-gate` result (or run it again) as starting candidates | Team lead | `ledger.json` | [`ledger`](references/ledger.md) |
| 3 Hunt | Hand work units to sub-agents one set at a time. Every agent gets a brief from the template and returns a single JSON block. Never use WebFetch or WebSearch while hunting, because the customer's code must not leave the machine and web content may carry hidden instructions. | `security-engineer` | Candidates + results per unit | [`hunting`](references/hunting.md) · [`attack-classes`](references/attack-classes.md) + family files |
| 4 Gap check | 1 fresh agent reads the ledger + architecture and looks for entry points with no row, parallel paths not checked, and rows closed with no evidence. If there are gaps, return to step 3 with the new units. | A fresh `security-engineer` | The missing work units | [`hunting`](references/hunting.md) gap-check section |
| 5 Verify | 1 verifier per candidate that has never seen the hunt, told to **try to refute**. It rereads every cited place in the code itself and runs in the lab if permitted. | A fresh `reviewer` (no web tools) | A verdict per candidate | [`verify`](references/verify.md) |
| 6 Record check + report | The lead writes `findings.json` and runs the validators · sends the confirmed and needs_validation records to another fresh set to compare against the code one last time · a correction that changes substance (severity, root cause, impact, verdict) needs a third agent to confirm before use · then builds the report from records only · `quick` may merge this with step 5 (section 1) | A fresh `reviewer` · team lead | `REPORT.md` · `NEEDS-VALIDATION.md` | [`verify`](references/verify.md) final-record section · [`report-th`](assets/report-th.md) |

**The team lead alone writes `ledger.json` and `findings.json`.** Sub-agents return JSON for the lead to merge and never edit the files themselves, because if several write at once, rows overwrite each other and the coverage count goes wrong.

If a sub-agent result has prose wrapped around the JSON or the wrong shape, discard it and send a new agent. Do not repair it yourself, because repairing means guessing what the sub-agent meant.

## 3 · Scanner results come in as candidates, not findings

- Results from gitleaks · semgrep · trivy · `npm audit` via `security-gate` are leads. Every one must pass step 5 like a candidate from an agent.
- If a real secret has leaked, do not wait for step 5. Stop and tell the user at once, following `security-gate` step 4, and then record it as a finding.
- A dependency with a CVE can be confirmed only if the code calls the vulnerable part with input the user controls. If only the version matches and no path calls it → `rejected` with the reason (you may still recommend the update under hardening).
- Tools that could not run are written in the report under the "ไม่ได้รัน" heading, following the `security-gate` rule.

## 4 · The 3 verdicts

| Verdict | Use when | Must have | Must not have |
|---|---|---|---|
| `confirmed` | You see the complete path from entry point to harm, the control that should block it does not, and no other layer in the code can block it. If it can run, you must see the real effect in the lab. | `severity` · the first `trace` step is the entrypoint's file · `evidence` · `impact` · `owner_impact_th` · `fix` · a `verified_by` that is not `hunted_by` | — |
| `needs_validation` | The path in the code is real, but the deciding fact lies outside the repo (proxy · cloud settings · provider settings), or it needs a run that is not permitted | `missing` says which fact is lacking · `check_plan` says who checks what, where, so it can be decided | `severity` |
| `rejected` | The code refutes it, for example another control layer exists, the entry point does not really exist, or the effect lands on the actor themselves | `reject_reason` cites the file and line that refute it | `severity` |

- `needs_validation` is not "confirmed but not very sure", and it is not a parking place for items the code has already refuted.
- For a control outside the repo, never guess either that it exists or that it does not. Make it `needs_validation` and give the check method.
- Keep `rejected` in `findings.json` so the next round does not report the same item again, as long as the code there has not changed.

## 5 · Severity levels (confirmed only)

The level must not exceed what has been proven. If you cannot state the concrete damage, the level is lower than it feels.

| Level | Anchor | Examples in our customers' work |
|---|---|---|
| `critical` | Someone not logged in can run code on the server · read or edit the whole database · take over any account | SQL injection on a public search page · a password-reset endpoint whose token is not bound to the account |
| `high` | A control the system advertises fails completely, and the effect lands on other people or real money | One customer can open every other customer's orders · a payment webhook can be forged and the system ships goods · stored XSS that runs on the admin page |
| `medium` | Really crosses a boundary, but with limited reach, or needs a condition that rarely occurs | A staff member at one branch can view another branch's sales but cannot edit · you must already know a long random id before you can open it |
| `low` | Exposes internal information that is not secret, or takes a lot of effort for little gain | An error page shows the framework version · you can tell whether an email exists in the system |
| `info` | Confirmed but with very little impact, worth only as a piece of a larger item | A log contains an internal server path |

What separates `high` from `medium`: whether the proven effect breaks the control entirely in work that has real effect, or only weakens it. When another person's personal data leaks across customers (ID card number · phone number · address), always apply the `pdpa` label, and propose the level for `legal-compliance-officer` to review `(รอยืนยัน)` (awaiting confirmation).

## 6 · Not a finding

- A header that should exist but does not (CSP · HSTS) in a system that does not serve HTML or has no secrets to steal → hardening
- A cookie without `HttpOnly`: first check whether the cookie holds a secret and whether JavaScript must read it by design
- A crash from odd input: do not inflate it to "can run code" · a user harming their own data is not a privilege bypass
- Defense-in-depth advice with no path to harm · guessed proxy or cloud behavior · an old library version that nothing can call
- "Other similar systems do this too" may be used to compare levels, but it is not a reason to drop a finding

These go under "คำแนะนำ hardening" (hardening advice) in the report, but they carry no level, are not counted in the total, and do not block delivery.

## 7 · Where results live and the data contract

Results live in `qa/security/audit-<YYYY-MM-DD>/` of the project (deliverable to the customer). Sub-agent drafts and raw scan output live in `_to_delete/security/`.

| File | Content | Who writes it |
|---|---|---|
| `architecture.md` | The conclusions of step 1 | Team lead |
| `ledger.json` | `{ "rows": [...] }`, 1 row per work unit · fields as in [`ledger`](references/ledger.md) | Team lead |
| `findings.json` | `{ "audit": {date, repo, commit, profile}, "findings": [...] }` · for a folder that is not git, set `commit` to `"none"` | Team lead |
| `REPORT.md` · `NEEDS-VALIDATION.md` | Built from the 2 files above, following the [`report-th`](assets/report-th.md) template | `scripts/render_report.mjs`, then the lead fills in the prose parts |

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

## 8 · After the audit

- **A confirmed item that touches personal data** (`pdpa.personal_data` is true) and shows signs it may already have been exploited → open `pdpa-compliance` section 8 at once. Count 72 hours from when you learned of it, not from when the report is finished. If there are no signs, state in the report that past logs should be checked.
- **Every confirmed item** → playbook `bug-fix` (find the root cause · write a test that fails before the fix, with a name starting with the OWASP code such as `A01_other_user_order_returns_404` · search for other places written the same way). Critical and high must not be delivered until fixed, or until the customer accepts the risk in writing in the `decision-log`.
- **Before merging a patch for a confirmed critical or high item**, send a fresh `reviewer` that gets only the diff and the finding (not the explanation of how the vulnerability works) to answer 4 questions: (1) does the patch touch only the path of this finding (2) does it fix the root cause or mask the symptom, such as an empty `try/except`, a removed check, or a lowered log level (3) does it add new attack surface (4) can you think of any input that still reaches the original state without hitting the patch. Any question that fails goes back for a fix first.
- **needs_validation** → send `NEEDS-VALIDATION.md` to someone who can reach the deployment. They check by `check_plan` and come back to close it in the next round.
- **Next round** → read the whole previous `findings.json` and `ledger.json` before planning. A confirmed item whose code has not changed carries over with the same fingerprint but must be re-verified. If the code changed, recheck that unit. If it was fixed, have the verifier rerun the test that failed before the fix, and write `ปิดแล้ว` (closed) only when it passes. `blocked` units and `needs_validation` items are this round's work. One round can never cover everything, so the report must not say it is complete.
- **Delivering to a standard** (PDPA · GDPR · PCI-DSS · SOC 2 · HIPAA) → state in the report which finding hits which requirement, and the evidence already collected. Attach a 30/60/90-day fix plan, ordered by the level of the confirmed items.
- Summarize status with `status-report` of the `ตรวจ` type. If delivering under an OWASP contract, attach rows A01–A10 from this report to the OWASP report from `security-gate`.

## Check before sending

1. Every confirmed item has an affected party you can point to · `verified_by` is not `hunted_by` · the level is not higher than the effect really seen
2. No needs_validation or rejected item has a level · every needs_validation item has a `missing` and a `check_plan` that someone else can follow
3. Both validators pass, and the report is built from records with no prose that changes a verdict or level
4. Ledger rows still `pending` or `blocked` appear in the report with reasons · a partial review is written as partial
5. Tools that could not run are under the "ไม่ได้รัน" heading · no secrets in the results folder
6. A finding whose `pdpa.personal_data` is true has a line giving the next step under `pdpa-compliance`
7. The words "100% secure" or "certified" do not appear

## References

- [`references/worked-example.md`](references/worked-example.md) — open when you want a full run-through of a `quick` audit
- [`references/sources.md`](references/sources.md) — open to re-check dated figures, prices and rules, and their sources
