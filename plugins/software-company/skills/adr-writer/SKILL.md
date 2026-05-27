---
name: adr-writer
description: Use when documenting an architectural decision, recording why a tech choice was made, creating an ADR (Architecture Decision Record), or revisiting a past technical decision. Captures context, options, and consequences.
---

# Architecture Decision Record (ADR) Writer

## When to use this skill

- Choosing between two or more technical options
- Significant change to existing architecture
- Deprecating a technology or pattern
- Documenting "why" for future team members

## ADR Numbering

- Sequential: ADR-0001, ADR-0002, ...
- Never reuse numbers, even if ADR is superseded

## Status Lifecycle

```
Proposed → Accepted → Deprecated/Superseded
              ↓
           Rejected (if not accepted)
```

## Output Template

```markdown
# ADR-XXXX: <Decision Title>

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYYY
**Date:** YYYY-MM-DD
**Deciders:** <names/roles>
**Tags:** <area, e.g., database, frontend, security>

## Context

What is the issue we're facing? What forces are at play?
- Business driver: ...
- Technical constraint: ...
- Current state: ...

## Decision

What did we decide to do?

State the decision clearly in 1-2 sentences.

## Options Considered

### Option 1: <name>
**Description:** ...

**Pros:**
- ...

**Cons:**
- ...

**Cost:** $$ | Effort: M

### Option 2: <name>
**Description:** ...

**Pros:**
- ...

**Cons:**
- ...

**Cost:** $$$ | Effort: L

### Option 3: <name>
...

## Decision Rationale

Why did we choose this option? Reference the forces from Context.
- Key factor 1: ...
- Key factor 2: ...

## Consequences

### Positive
- ...

### Negative
- ...

### Neutral / Trade-offs Accepted
- ...

## Implementation Notes
- Migration path: ...
- Affected components: ...
- Timeline: ...

## References
- Related ADRs: ADR-XXXX
- External docs: ...
- Discussion: ...
```

## Quality Checklist

Before finalizing:

- [ ] Title clearly states the decision (not just the topic)
- [ ] Context explains WHY this decision is needed now
- [ ] At least 2 options considered (even if one is "do nothing")
- [ ] Trade-offs are honest — every choice has downsides
- [ ] Consequences include both positive AND negative
- [ ] Could a new team member understand this in 6 months?

## Anti-patterns

- ❌ Writing ADR after implementation is done (write BEFORE)
- ❌ Listing only the chosen option (need real alternatives)
- ❌ Vague titles like "Database Decision" (be specific: "Use PostgreSQL over MongoDB for user data")
- ❌ Skipping "Negative consequences" (every decision has trade-offs)
- ❌ Editing accepted ADRs (create new one that supersedes it instead)
