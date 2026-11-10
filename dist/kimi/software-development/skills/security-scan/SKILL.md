---
name: "security-scan"
description: "Run a security scan on code, dependencies or infrastructure. Whole codebase uses security-audit, a diff before shipping uses security-gate."
disableModelInvocation: true
---

Run the `security-engineer` agent on: **$ARGUMENTS**

1. Scope is the whole codebase, a handover, or a pen test of source → follow `security-audit`.
2. Scope is a diff, a branch before merge, or a newly added dependency → follow `security-gate`.
3. Not sure → ask once which of the two; infra-only scope follows `security-audit` with the infra files as the unit list and the checks in [`security-audit/references/infra-checklist.md`](../security-audit/references/infra-checklist.md) (exposed ports, weak IAM, public buckets, unencrypted storage, container images, headers, insecure defaults).
4. Severity comes from `security-audit` section 5 (confirmed findings only), never from the vulnerability type alone.
5. Hand-off: code fixes → `developer` · infra fixes → `devops-engineer` · architecture → `solution-architect` · new feature design → `/threat-model`.
