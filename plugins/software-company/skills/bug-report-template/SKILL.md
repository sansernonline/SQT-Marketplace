---
name: bug-report-template
description: Use when reporting a bug, documenting a defect found during testing, or converting a user complaint into a trackable bug report. Ensures all reproducible steps, environment details, and evidence are captured.
---

# Bug Report Template

## When to use this skill

- Filing a new bug during testing
- Converting user complaints into bug tickets
- Reproducing an issue and documenting findings

## Severity vs Priority

These are **different**:

| | Severity | Priority |
|---|----------|----------|
| What it measures | Technical impact | Business urgency |
| Set by | QA / Engineering | PM / PO |

| Severity | Definition |
|----------|------------|
| **S1 Critical** | System unusable, data loss, no workaround |
| **S2 High** | Major feature broken, workaround exists |
| **S3 Medium** | Feature partially broken |
| **S4 Low** | Cosmetic, minor inconvenience |

| Priority | Definition |
|----------|------------|
| **P1** | Fix immediately, block release |
| **P2** | Fix in current sprint |
| **P3** | Fix in next sprint |
| **P4** | Fix when convenient / backlog |

## Output Template

```markdown
# Bug: <concise, descriptive title>

**ID:** BUG-XXXX
**Severity:** S1 | S2 | S3 | S4
**Priority:** P1 | P2 | P3 | P4
**Reporter:** <name>
**Date:** YYYY-MM-DD
**Affected Component:** <module/feature>
**Affected Version:** <build/release>

## Environment
- OS: ...
- Browser: ... (version)
- Device: Desktop | Mobile | Tablet
- Screen size: ...
- Network: WiFi | Mobile data | VPN
- User role: ...

## Steps to Reproduce
1. Navigate to ...
2. Click ...
3. Enter ...
4. Observe ...

## Expected Result
<what should happen>

## Actual Result
<what actually happens>

## Frequency
Always (100%) | Often (>50%) | Sometimes (<50%) | Rare (<10%)

## Evidence
- Screenshot: [link]
- Video: [link]
- Console errors: \`\`\`<paste>\`\`\`
- Network trace: ...
- Log excerpt: ...

## Impact
- Users affected: All | Specific role | Edge case
- Business impact: ...
- Data integrity: Compromised | At risk | Not affected

## Workaround
<temporary fix users can do, or "None">

## Possible Root Cause (optional)
<if you have a hypothesis>

## Related
- Related bugs: BUG-XXXX
- User story: US-XXX
- Test case: TC-XXX-NNN
```

## Title Writing Guide

❌ Bad titles:
- "Login broken"
- "Bug in checkout"
- "It doesn't work"

✅ Good titles (action + condition + result):
- "Login fails with 500 error when email contains apostrophe"
- "Checkout total shows NaN when quantity is decimal"
- "Search returns no results for queries longer than 100 chars"

**Formula:** `<Action> + <Condition> + <Unexpected result>`

## Steps to Reproduce Rules

- [ ] Start from a known state (logged out, fresh browser, etc.)
- [ ] Each step is one action
- [ ] Anyone can follow without prior knowledge
- [ ] Include exact data used (not "some user")
- [ ] No skipped steps (even "obvious" ones)
- [ ] Numbered sequentially

## Quality Checklist

Before submitting:

- [ ] Title clearly summarizes the issue
- [ ] Severity AND priority both set
- [ ] Steps are reproducible by someone else
- [ ] Expected vs actual is clearly different
- [ ] At least one piece of evidence attached
- [ ] Environment info complete
- [ ] Searched for duplicates first

## Anti-patterns

- ❌ "Same as last week's bug" — describe it fully
- ❌ Multiple bugs in one report — split them
- ❌ "Bug" without steps — provide reproduction
- ❌ Including fix proposal in title — that's for the dev
- ❌ Marking everything as P1 — be honest about priority
