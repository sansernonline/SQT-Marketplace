---
name: security-gate
description: Use when about to ship or merge code, as a security check
---

# security-gate — a security gate before shipping

> Tools search first, then the agent confirms every finding against the real code, before it reaches a person.

Use it together with [`principle-secure-by-default`](../principle-secure-by-default/SKILL.md). For an in-depth report, use the `security-engineer` agent.

## Steps

1. **Run in the sandbox** (the project's sandbox) — if the project has `.sandbox/`, run every command through `sandbox.ps1 exec`. Install any missing tool inside the sandbox. Never install on the user's machine.
2. **Scan 3 areas** (pick what the project has)

   | Area | Recommended tool | Example command |
   |---|---|---|
   | Leaked secrets (including git history) | gitleaks 8.19+ | Git history: `gitleaks git . --redact` · uncommitted files: `gitleaks dir . --redact` (`detect`/`protect` are deprecated since v8.19.0 — source github.com/gitleaks/gitleaks/releases/tag/v8.19.0 · checked 22 Oct 2026 (B.E. 2569)) |
   | Vulnerable dependencies | The language's own tool + trivy or osv-scanner | `npm audit --omit=dev` · `pip-audit` · `dotnet list package --vulnerable --include-transitive` · `trivy fs --scanners vuln .` |
   | Risky code patterns (static analysis) | semgrep | With internet: `semgrep scan --config p/default --metrics=off` · in a `-Locked` sandbox or without access to semgrep.dev: `semgrep scan --config <this skill>/assets/semgrep-offline.yml --metrics=off` |
   | Dart / Flutter and Gradle dependencies | osv-scanner (reads `pubspec.lock` and `gradle.lockfile`) | `osv-scanner scan source -r .` (`ยังไม่ได้ตรวจ` on this machine) · use `flutter pub outdated` to see stale versions · if Gradle has no lockfile, turn on `dependencyLocking` before the scan can work |
   | Dockerfile · compose · IaC (if present) | trivy | `trivy config .` An Android app has none of these, so read `android/app/build.gradle*` by eye instead (signingConfig must not hard-code passwords, and release must enable minify) |
   | Android app (if present) | Check by eye with [`references/android.md`](references/android.md). For a deeper check, use MobSF (Mobile Security Framework) | — |

   Keep raw output in `_to_delete/security/`
   - **Never use `--config auto` together with `--metrics=off`** — semgrep refuses to run.
   - **Choose semgrep rulesets by the languages found, not `p/default` alone**. For every project, run `p/security-audit` + `p/secrets` once over the whole repo. Then add per language: `p/python` (+`p/django` or `p/flask`) · `p/javascript` + `p/typescript` (+`p/react` · `p/nodejs`) · `p/csharp` · `p/dockerfile`. For several languages, pass several `--config` flags in one command. If a ruleset cannot load (no internet · wrong name), the report must say it did not run. It must not vanish silently.
   - The offline set has 6 rules that almost never have a safe case (eval · HTML from a variable · shell from a variable · SQL built by concatenation · secrets in code), and it was proven to catch every one in files deliberately written wrong. If any tool cannot run, write `ยังไม่ได้ตรวจ` (not yet checked) with the reason in the report.
   - **semgrep supports Dart very poorly, and the offline rules were written for web and backend.** If semgrep finds nothing in a Flutter project, that does not mean it is safe. The report must say the Dart code is `ยังไม่ได้ตรวจด้วย static analysis` (not yet checked with static analysis) and rely on `flutter analyze` and reading the code instead. Never conclude `ผ่าน` from an empty result.
3. **Confirm every finding** — open the real code and see whether it applies (for example, the vulnerability is in a function the project never calls). Then label it `ยืนยันแล้ว` (confirmed) / `แจ้งผิด` (false alarm) / `ยังไม่ยืนยัน` (not yet confirmed) with a reason. Give `ยังไม่ยืนยัน` no severity and say what evidence is missing. If the customer asks for a deep check of the whole system, or you find an item that needs tracing data flow across several files → [`security-audit`](../security-audit/SKILL.md) (the confirmer is a fresh agent, not the one that scanned).
4. **Rate and decide**

   | Level | What to do |
   |---|---|
   | Real secret leaked | **Stop at once and tell the user.** The secret must be rotated at the provider, because deleting it from the file is not enough, and the agent never rewrites git history itself. |
   | Confirmed critical · high | **Do not ship** until fixed, or until the user accepts the risk in writing in `decision-log`. |
   | medium | Fix it in this round if the estimate is 1 hour or less (a starting value, not yet measured · adjust per team). If it takes longer, open a separate task in the queue and rank it with `decision-scoring` command `priority` in `rice` mode (people or systems affected × impact × confidence ÷ hours to fix). If the scores are close, let a person choose. |
   | low · false alarm | Record the reason. No fix needed. |

5. **Fix**
   - For a vulnerable dependency, update to a fixed version, then run the tests.
   - For a vulnerability in code, use the playbook `bug-fix` (find the root cause + write a test that fails before the fix + search for other places written the same way).
   - For a pattern that keeps coming back, pass it to `repeated-mistakes-to-checks` to turn into a lint rule.
6. **Report** — `qa/security/<year-month-day>-gate.md`, a table `| ระดับ | เรื่อง | ไฟล์:บรรทัด หรือแพ็กเกจ | ยืนยัน | ทำอะไร |` (level · issue · file:line or package · confirmed · action), with a 1-line verdict (`ผ่าน` · `ผ่านหลังแก้` (passed after fixes) · `ไม่ผ่าน`). Never copy secrets into the report (use `--redact` output). Then report status with `status-report` type `ตรวจ` (check).
   - **The report must have a section "ไม่ได้รัน" (not run)** before the verdict. List by name, with a reason each: tools or rulesets that could not be installed · tools that exited with a non-zero code · languages the scanner does not support (such as Dart) · files or folders skipped. A report that scanned partly but reads as complete is worse than no scan. If this section has any entry, a `ผ่าน` verdict must end with `(ยกเว้นที่ไม่ได้รัน)` (except what was not run).
   - Before handing over to a customer, or when the contract names OWASP → fill in the per-item report A01–A10 following [`references/owasp-top10.md`](references/owasp-top10.md), as a second file `qa/security/<year-month-day>-owasp.md`. This gate's scan results serve as evidence for items A02 · A03 · A04 · A05 · A08.

## When to run

- Every time before the `ship` playbook and before handing work to a customer.
- After adding or updating a dependency — if the scan lists findings, follow [`references/dependency-updates.md`](references/dependency-updates.md) (group by real risk · order patch → minor → major · prove · write in CHANGELOG).
- When the contract or a security requirement says the web app or API must pass OWASP Top 10:2025 → read [`references/owasp-top10.md`](references/owasp-top10.md) (the A01–A10 table to cover and prove · delivery criteria · contract clause [`owasp-contract-clause.md`](references/owasp-contract-clause.md) · per-stack methods [`owasp-stack-checks.md`](references/owasp-stack-checks.md) · report template [`assets/owasp-report.md`](assets/owasp-report.md)).
- For a project still in use, run it once a week as a scheduled task, because new vulnerabilities are announced every day even when the code does not change.

## Not the job of this skill

- Real penetration testing, or testing someone else's system, because this skill covers only this project's code and test environment.
- Certifying 100% safety. The report says only what was checked, with what, and what was not checked.
- Reviewing the logic and design of a diff → `code-review-checklist` (run both before merge).

## References

- [`references/sources.md`](references/sources.md) — origin notes for the semgrep ruleset choice
