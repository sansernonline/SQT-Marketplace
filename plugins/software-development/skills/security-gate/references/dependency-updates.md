# Updating vulnerable dependencies — an extension of `security-gate` step 5

Use when the dependency scan result has entries, or a new dependency was just added · ideas from wshobson `dependency-management` (MIT) and Trail of Bits `supply-chain-risk-auditor` (CC-BY-SA 4.0 — ideas only, rewritten in our own words)

## 1 · Scan — use the tool that comes with the language, then add one that reads lockfiles of every language

| stack | Command | Note |
|---|---|---|
| Node | `npm audit --omit=dev --json > _to_delete/security/npm-audit.json` | `--omit=dev` drops things that never reach production · never `npm audit fix --force` because it allows updates across a major version |
| Python | `pip-audit -r requirements.txt` or `pip-audit` inside the venv | For projects using `uv` / `poetry`, export the lockfile to requirements first |
| .NET | `dotnet list package --vulnerable --include-transitive` | Without `--include-transitive` you see only directly referenced ones |
| Every stack | `trivy fs --scanners vuln .` or `osv-scanner scan source -r .` | Reads the lockfiles of every language at once, use it to confirm the results above and to catch Dart · Go · Rust |

**Always commit the lockfile** (`package-lock.json` · `uv.lock` / `poetry.lock` · `packages.lock.json` · `pubspec.lock`) — with no lockfile each machine gets different versions, and the scanner does not know which version is really used

## 2 · Group by real risk, not by the scanner's severity label

Answer 3 questions per entry, then fill the table `| แพ็กเกจ | เวอร์ชัน | ช่องโหว่ | ใช้ถึงโค้ดที่เสี่ยงไหม | ตรง/ผ่านตัวอื่น | มีเวอร์ชันแก้ไหม | ทำอะไร |` (package · version · vulnerability · reaches the risky code · direct/via another · fixed version available · action)

| Question | Look at | Effect on the decision |
|---|---|---|
| Does our code call the vulnerable function, and can outside input reach it | `grep` the function name in the advisory · the path of input | Does not reach → may be downgraded, but the reason must be recorded, not closed silently |
| Referenced directly or through another package (transitive) | `npm ls <pkg>` · `pipdeptree -r -p <pkg>` · `dotnet nuget why <pkg>` | transitive → fix at the parent first, and if the parent has no new version yet, override in the lockfile and note that it must be removed when the parent is fixed |
| Is there a fixed version | The `fixed in` field of the advisory | None → find a replacement package, or close the input's entry path and record it as an accepted risk in `decision-desk/decision-log` |

Resulting summary: **fix now** (really reached + a fix exists) · **fix next round** (cannot be reached, but a fix exists) · **accept the risk temporarily** (no fix — the user must see it and agree)

## 3 · Update order — small first, split the large ones out so they are visible

1. All **patch** updates in one round (1.2.3 → 1.2.9) — by the semver contract they do not change behaviour, but you still must run tests
2. **minor** may be combined if in the same group (for example the `@angular/*` set together) · read the release notes for the word deprecated
3. **major — 1 PR per 1 package**: read the migration guide first, change the code accordingly, then run the whole test set · never bundle 2 majors in one PR, because when it breaks you will not know which one
4. A package nobody maintains any more (no release over 2 years · open security issues) → open a separate task to find a replacement, do not hide it inside an update PR

Automatic route: turn on **Renovate** or **Dependabot** to file PRs in the order above by themselves (group patch+minor automatically · major in its own PR · set the day of the week) — a person still must read the release notes and merge, and never auto-merge a major

## 4 · Prove it before closing the entry

- The whole test set is green and the build passes from a clean machine with the committed lockfile
- **Walk the vulnerability's original path again** — if the advisory says input of form X makes it break, really send X in (in a sandbox) and see that it does not break · write it as a test if you can, so it does not regress when someone downgrades
- Re-run the scanner of item 1, and that entry must be gone, not merely have its version changed in the file

## 5 · Record

- `CHANGELOG.md` under the heading Security: package · from → to · vulnerability ID (CVE or GHSA) · 1 line on whether we reach that vulnerability
- Entries with an accepted risk or an override in the lockfile → `decision-desk/decision-log` with the date to come back and look
- That round's gate report (`qa/security/<วัน>-gate.md`) points to the CHANGELOG instead of writing it again
