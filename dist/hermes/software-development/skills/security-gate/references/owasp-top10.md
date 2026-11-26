# OWASP Top 10:2025 — a delivered system must pass an item-by-item checklist

An extension of [`SKILL.md`](../SKILL.md) · use when building or delivering a web app or API whose contract or security requirement (NFR) names OWASP Top 10:2025

> A web-app contract may say "must pass OWASP Top 10:2025", but nobody can issue a certificate like that
> What can really be delivered is **a report that says, item by item A01–A10, what controls it, what checks it, and what evidence there is**
> This file makes every system the team builds have that report, from design to delivery

Open Worldwide Application Security Project (OWASP) Top 10:2025 is the list of the 10 most common and most serious web-app risks, in its latest edition (original: owasp.org/Top10/2025)

Use together with: [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md) (writing code) · [`security-gate`](../SKILL.md) (scan before sending) · the command `/software-development:threat-model` (design) · agent `security-engineer` (in-depth report)

---

## 1 · The 10 items, and what the system must have

Each item has 3 parts → **must have** (what code and configuration must do) · **prove with** (a test or tool that can really run) · **business-owner wording** (for explaining to the customer and in the report)

| Item | Risk | Business-owner wording (ภาษาเจ้าของกิจการ) | Must have | Prove with |
|---|---|---|---|---|
| A01 | Broken Access Control | ลูกค้าคนหนึ่งเห็นข้อมูลของอีกคนได้ | Check permissions server-side on every endpoint · deny by default · check ownership of the record every time one is read or changed by id · stop the server from fetching internal URLs (Server-Side Request Forgery (SSRF)) with an allowlist · Cross-Origin Resource Sharing (CORS) never `*` together with cookies · a system using cookie sessions must have a token against forged requests on the user's behalf (Cross-Site Request Forgery (CSRF)) · accept input through a Data Transfer Object (DTO) or an allowed-field list, never bind a whole object (stops a client sending `role` · `isAdmin` itself) | integration test per endpoint: not logged in → 401 · wrong role → 403 · another person's id → 403 or 404 · POST with no CSRF token → 403 (cookie-based systems) · sending an extra `role` field → the value in the database does not change |
| A02 | Security Misconfiguration | ตั้งค่าเซิร์ฟเวอร์หละหลวม เปิดหน้า admin ทิ้งไว้ | Configure by the same script in every environment, differing only in secrets · turn off debug · stack traces · directory listing · sample admin pages · add security headers (Content Security Policy (CSP) including `frame-ancestors` · HTTP Strict Transport Security (HSTS) · X-Content-Type-Options) · no default passwords · cloud storage not public | Scan headers (OWASP ZAP (Zed Attack Proxy) baseline) · `trivy config .` · a test that production returns errors with no stack trace |
| A03 | Software Supply Chain Failures | ใช้ไลบรารีเก่า หรือมีช่องโหว่ | Lockfiles for every language · a list of software components (Software Bill of Materials (SBOM)) · no dependency with a critical or high vulnerability · cut what is not used · pull only from official registries | `security-gate` dependency side (npm audit · pip-audit · `dotnet list package --vulnerable` · osv-scanner) · SBOM in CycloneDX form |
| A04 | Cryptographic Failures | ไม่เข้ารหัสรหัสผ่านและข้อมูลสำคัญ | Transport Layer Security (TLS) 1.2 or higher everywhere + HSTS · passwords use Argon2id · bcrypt · PBKDF2 (never MD5 · SHA-1 · plain SHA-256) · sensitive data encrypted at rest · secrets outside code · store only the data you use | semgrep (crypto rules) · a test that passwords in the DB are not the original text · check the TLS of the deployed server |
| A05 | Injection | กรอกคำสั่งในช่องค้นหา แล้วดึงฐานข้อมูลได้ | SQL only through parameters or an ORM · never concatenate strings into shell commands · HTML-escape on output (stops Cross-Site Scripting (XSS)) · validate input at the system boundary | semgrep · a test sending `' OR 1=1--` · `<script>` · `; rm` which must not take effect |
| A06 | Insecure Design | ออกแบบผิดตั้งแต่ต้น เช่น ใช้คูปองซ้ำได้ | threat model of login · permissions · money · personal data before writing · business rules enforced at the server (cannot reuse · balance cannot go negative · repeating does not charge twice) · rate limit · file upload: check the type from the file contents, limit size, store outside the web root, rename ([`file-upload-and-storage`](../../file-upload-and-storage/SKILL.md)) | The threat model document · a test uploading a `.php` · `.exe` renamed to `.jpg` → rejected · an abuse-case test, at least 1 per business rule about money or permissions |
| A07 | Authentication Failures | เดารหัสได้ไม่จำกัด ไม่มี MFA | Limit failed logins · multiple-factor authentication (Multi-Factor Authentication (MFA)) for admin and money work · passwords at least 15 characters (8 if MFA is present per National Institute of Standards and Technology (NIST) Special Publication (SP) 800-63B-4) and check against lists of leaked passwords · a failed-login message does not reveal whether the user exists · session id random from the server and rotated after login · JSON Web Token (JWT) checks `iss` `aud` `exp` and the algorithm | test: N failed logins → delayed or locked · expired token → 401 · the failure message is the same for existing and non-existing users |
| A08 | Software or Data Integrity Failures | อัปเดตหรือข้อมูลถูกแก้ระหว่างทาง โดยไม่ตรวจ | Never deserialize outside data into an object that can run code · webhooks verify signatures · update files verify a checksum or signature · the automatic delivery pipeline (CI/CD) uses least privilege and has no secrets in logs · prices and amounts are computed at the server and values from the client are not trusted | test a webhook with a wrong signature → rejected · test sending a fake price from the client → the server's price is used |
| A09 | Security Logging and Alerting Failures | ถูกเจาะแล้วไม่มีใครรู้ ไม่มี log | Log successful and failed logins · permission denials · failed input validation · admin actions · money changes — with time · who · what · result · no passwords, tokens, or ID-card numbers in logs · an alert when logins fail in bursts | a test that a failed login leaves a log line · searching the logs for secrets must find none · see `audit-trail` · `logging-standards` |
| A10 | Mishandling of Exceptional Conditions | ระบบล่มแล้วแสดงข้อมูลภายใน หรือเปิดช่องให้ผ่าน | Every error is caught, with a global handler as the last gate · on failure **close**, not open (permission check errors → deny) · a transaction that does not complete must roll back · error messages shown to users carry no stack trace or SQL · limit quota · timeout | test: make the DB or an external service fail mid-operation → a normal error, and data is not left half done · permission check throws → 403, not let through |

**Items that do not apply**: write `ไม่เกี่ยว` (not applicable) with a 1-line reason, for example A07 in a system with no login at all · never leave blank

How to write it for the team's stacks (.NET · TypeScript/Node/Angular · Python · SQL) → [`owasp-stack-checks.md`](owasp-stack-checks.md)

---

## 2 · When to use it in the job

| Phase | Do | Get |
|---|---|---|
| Taking the job · writing the contract | Put in the requirements and acceptance criteria per [`owasp-contract-clause.md`](owasp-contract-clause.md) · put in the requirements document (Software Requirements Specification (SRS)) security category (`srs-writing`) | Customer and team agree on what "pass" means |
| Design | threat model of login · permissions · money · personal data (A01 · A06 · A07) · state roles and permissions as a table | `docs/security/threat-model.md` |
| Writing code | Follow the "must have" column and [`owasp-stack-checks.md`](owasp-stack-checks.md) · make every item that can be so a reusable shared piece (one permission checker · one error handler · one logger) | Code where the safe way is the easiest way |
| test | Write tests per the "prove with" column, put them in the normal test folder, named starting with the item code, such as `A01_other_user_order_returns_404` | Evidence that can be re-run every time |
| Before delivery | Run `security-gate`, then fill [`assets/owasp-report.md` (in the security-gate folder)](../assets/owasp-report.md) item by item | `qa/security/<ปี-เดือน-วัน>-owasp.md` |

---

## 3 · The report before delivery — rules

- 1 row per item, all of A01–A10 · status uses only these 6 values

  | Status | Deliverable | Write when |
  |---|---|---|
  | `ผ่าน` (pass) | Yes | There is evidence that can be run — test name + run result · tool name + result file |
  | `ผ่าน (ตรวจด้วยตา)` (pass, checked by eye) | Yes, if it says which file was checked and that item truly cannot have a test written | For example a server configuration the team did not deploy a test for |
  | `ไม่เกี่ยว — <เหตุผล>` (not applicable — <reason>) | Yes | The system has no such part at all |
  | `ยอมรับความเสี่ยง — <วันที่ · ใคร>` (risk accepted — <date · who>) | Yes | The customer approved in writing, recorded in `decision-desk/decision-log` |
  | `ไม่ผ่าน` (fail) | No | A confirmed vulnerability was found |
  | `ยังไม่ได้ตรวจ — <เหตุผล>` (not yet checked — <reason>) | No | The tool cannot run or it has not been done |

- **Deliverable when** there is no `ไม่ผ่าน` item and no `ยังไม่ได้ตรวจ` item
- **An item that is `ไม่ผ่าน` is written as a finding block, one per entry** (template in `assets/owasp-report.md` (in the security-gate folder)) — ID `F-01` · file:line · item A0x + the Application Security Verification Standard (ASVS) level it must reach (L1 every system · L2 has personal data or transactions · L3 money, health, critical infrastructure) · impact in business-owner wording · fix · evidence used to confirm (command · test · image) · 1 block per vulnerability, never several spots in one row (idea from agamm/claude-code-owasp (MIT))
- Always include a section **scope not checked**, for example penetration testing by outsiders · the customer's servers the team did not deploy · libraries with no vulnerability data
- Never write "100% secure" or "OWASP certified" — OWASP issues no certificates · if it can be delivered, write "passes the OWASP Top 10:2025 criteria per the checklist in this report"
- The totals count all 6 statuses separately, for example `ผ่าน 7 · ผ่าน (ตรวจด้วยตา) 1 · ไม่เกี่ยว 2 · ยอมรับความเสี่ยง 0 · ไม่ผ่าน 0 · ยังไม่ได้ตรวจ 0`
- Summarise the status into `docs/BUILD-PLAN.md` with `superuser/status-report` of type `ตรวจ` (check) (who did it · who checked · check result `ผ่าน — ผ่าน 8 · ไม่เกี่ยว 2` or `ไม่ผ่าน — A01 · A07`)

---

## 4 · Who does what

| Part | agent |
|---|---|
| Contract and SRS requirements | `business-analyst` · legal clauses → `legal-compliance-officer` |
| threat model · permissions table · design review | `security-engineer` |
| Code and tests per the "must have" · "prove with" columns | `developer` (and the agent for the stack) |
| Scan and fill the report | `security-engineer` through `security-gate` |
| Check the report before sending to the customer | a new `reviewer` — every row marked `ผ่าน` (pass) must have evidence that can really be opened |

---

## 5 · Not this file's job

- Real penetration testing, or testing someone else's system — this file checks only this project's code and test environment
- Other standards, such as OWASP API Security Top 10 · Application Security Verification Standard (ASVS) · Payment Card Industry Data Security Standard (PCI-DSS) · the Personal Data Protection Act (PDPA) — use the skill for that topic (`fintech-payments` · `pdpa-compliance`), but this report can be used as a common base
- Mobile apps — use OWASP Mobile Top 10 together with [`android.md`](android.md) · the backend of a mobile app still uses this file
