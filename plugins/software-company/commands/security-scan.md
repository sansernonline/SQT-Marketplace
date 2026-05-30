---
description: Run a security audit on code, dependencies, or infrastructure using security-engineer agent. Identifies vulnerabilities with OWASP-aligned findings.
argument-hint: <scope: "code", "deps", "infra", or specific file/component>
---

Use the `security-engineer` agent to perform a security scan on: **$ARGUMENTS**

The security engineer should:

1. **Initial Discovery** — gather:
   - Scan scope (code, deps, infra, all)
   - Critical assets (PII, payment data, secrets)
   - Compliance requirements
   - Pre-existing security findings
   - Available SCA / SAST tools (Snyk, SonarQube, Trivy)

2. **Run automated scans where possible:**

   ### For code:
   - Look for OWASP Top 10 violations
   - SQL injection, XSS, CSRF, SSRF
   - Hardcoded secrets / API keys
   - Insecure crypto (MD5, SHA-1, weak ciphers)
   - Unsafe deserialization
   - Missing input validation
   - Authentication bypasses
   - Authorization gaps (IDOR)

   ### For dependencies:
   - Known CVEs in libraries
   - Outdated packages
   - License compliance issues
   - Supply chain risks
   - Suggested upgrade paths

   ### For infrastructure:
   - Exposed ports / services
   - Weak IAM policies
   - Unencrypted storage / transit
   - Missing security headers
   - Insecure defaults
   - Public S3 buckets, open databases
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
   | 🔴 Critical | Exploitable now, severe impact | Auth bypass, RCE |
   | 🟠 High | Likely exploitable, significant impact | SQLi in non-admin |
   | 🟡 Medium | Hard to exploit OR limited impact | XSS in admin tool |
   | 🟢 Low | Defense in depth | Missing security header |

5. **For each finding, provide:**
   - Description (what's wrong)
   - Location (file:line OR component)
   - OWASP category
   - CWE ID (Common Weakness Enumeration)
   - Proof of concept (how to exploit)
   - Fix recommendation with code example
   - References

6. **Check compliance posture:**
   - Relevant standards (PDPA, GDPR, PCI-DSS, SOC2, HIPAA)
   - Gaps with required controls
   - Evidence collection status

7. **Produce polished security audit report** using `polished-document-style` skill:
   - Executive summary
   - Health score per category
   - Critical findings (must fix)
   - High findings (this sprint)
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
