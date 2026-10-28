---
name: "security-scan"
description: "Run a security audit on code, dependencies or infrastructure with the security-engineer agent."
disableModelInvocation: true
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook `review` แล้วคัดขั้นตอนของ playbook ลง todo ก่อน ขั้น security gate ให้ใช้ skill `security-gate` ส่วนขั้นตอนด้านล่างคือรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้ประกอบ playbook ไม่ใช่แทนที่

Use the `security-engineer` agent to perform a security scan on: **$ARGUMENTS**

**Shortcut, not a separate method:** follow [`security-gate`](../security-gate/SKILL.md) steps 2–6 (commands, the `--config auto` + `--metrics=off` trap, per-language rule sets, ship/block rule). Line split: `security-gate` = before shipping · `security-audit` = whole system · this command = a shortcut that calls the gate. The generic checklist below is background only; where it differs from the gate, the gate wins.

The security engineer should:

1. **Initial Discovery** — gather:
   - Scan scope (code, deps, infra, all)
   - Critical assets (personally identifiable information (PII), payment data, secrets)
   - Compliance requirements
   - Pre-existing security findings
   - Available software composition analysis (SCA) / static application security testing (SAST) tools (Snyk, SonarQube, Trivy)

2. **Run automated scans where possible:**

   ### For code:
   - Look for Open Worldwide Application Security Project (OWASP) Top 10:2025 violations (A01–A10 list and per-stack checks: skill `owasp-top10`)
   - SQL injection, cross-site scripting (XSS), cross-site request forgery (CSRF), server-side request forgery (SSRF)
   - Hardcoded secrets / application programming interface (API) keys
   - Insecure crypto (MD5, SHA-1, weak ciphers)
   - Unsafe deserialization
   - Missing input validation
   - Authentication bypasses
   - Authorization gaps (insecure direct object reference, IDOR)

   ### For dependencies:
   - Known Common Vulnerabilities and Exposures (CVE) entries in libraries
   - Outdated packages
   - License compliance issues
   - Supply chain risks
   - Suggested upgrade paths

   ### For infrastructure:
   - Exposed ports / services
   - Weak identity and access management (IAM) policies
   - Unencrypted storage / transit
   - Missing security headers
   - Insecure defaults
   - Public Amazon S3 buckets, open databases
   - Container image vulnerabilities

3. **Manual review** for issues tools miss:
   - Business logic vulnerabilities
   - Authorization flaws
   - Race conditions
   - Privilege escalation paths
   - Cryptographic correctness
   - Session management

4. **Classify findings** using risk score:

   | Severity | Definition | Example |
   |----------|------------|---------|
   | Critical | Exploitable now, severe impact | Auth bypass, remote code execution (RCE) |
   | High | Likely exploitable, significant impact | SQL injection (SQLi) in non-admin |
   | Medium | Hard to exploit OR limited impact | XSS in admin tool |
   | Low | Defense in depth | Missing security header |

   Ship or not ship follows [`security-gate`](../security-gate/SKILL.md) step 4: a confirmed Critical or High **blocks shipping** until fixed or the user accepts the risk in writing.

5. **For each finding, provide:**
   - Description (what's wrong)
   - Location (file:line OR component)
   - OWASP Top 10:2025 category (A01–A10)
   - CWE ID (Common Weakness Enumeration)
   - Proof of concept (how to exploit)
   - Fix recommendation with code example
   - References

6. **Check compliance posture:**
   - Relevant standards (Thailand Personal Data Protection Act (PDPA), EU General Data Protection Regulation (GDPR), Payment Card Industry Data Security Standard (PCI-DSS), System and Organization Controls 2 (SOC 2), US Health Insurance Portability and Accountability Act (HIPAA))
   - Gaps with required controls
   - Evidence collection status

7. **Produce polished security audit report** using `polished-document-style` skill:
   - Executive summary
   - Health score per category
   - Critical findings (must fix)
   - High findings (must fix before shipping — `security-gate`)
   - Medium/Low findings (backlog)
   - Compliance gaps (if applicable)
   - Remediation roadmap (30/60/90 days)
   - Sign-off section

8. **Hand-off suggestions:**
   - Code fixes → `developer`
   - Infrastructure fixes → `devops-engineer`
   - Architecture changes → `solution-architect`
   - Customer notification (if breach) → `product-manager` + `technical-writer`
   - Detailed threat model → run `/threat-model`
