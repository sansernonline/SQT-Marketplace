---
name: architecture
description: Use when choosing an architecture, reviewing one or writing an ADR
argument-hint: '<system or component to review>'
---

# architecture — choose the shape of a system, review it, and record the decision

> **One rule:** start with the simplest shape that meets the real requirements (usually a modular monolith), and write down why each big choice was made, with the options it beat.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Monolith or microservices?", "should this be serverless?", splitting a monolith | [`references/architecture-patterns.md`](references/architecture-patterns.md) |
| Deeper pattern catalogue: CQRS, event sourcing, saga, API gateway, strangler fig | [`references/advanced-patterns.md`](references/advanced-patterns.md) and [`references/core-patterns.md`](references/core-patterns.md) |
| "Review this architecture" against quality needs and risks, with the `solution-architect` agent | [`references/architecture-review.md`](references/architecture-review.md) |
| "Record why we chose X", an ADR, a decision that will be hard to undo | [`references/adr-writer.md`](references/adr-writer.md) and [`assets/adr.md`](assets/adr.md) |
| A written architecture overview for the team or a customer | [`references/architecture-overview-template.md`](references/architecture-overview-template.md) |
| Scoring two or three options side by side | [`templates/options-score.json`](templates/options-score.json) |

## Steps every part shares

1. **Name the real requirements first.** Write the load, data size, team size, uptime and budget that the shape must meet. Mark any number you do not know as `(รอยืนยัน)` (awaiting confirmation).
2. **Compare at least 2 options.** One of them may be "do nothing". Say which one wins and why, in plain words.
3. **Keep the shape simple.** Microservices too early is a common mistake: start with a monolith, and split only when a measured limit forces it.
4. **Record the decision** as an ADR when it is hard to reverse, or when a person will later ask why.

## Check before done

- Every choice names its trade-off, and every unknown number is marked `(รอยืนยัน)`, never guessed.
- An ADR uses the format already in the project if one exists (look in `docs/adr/`, `docs/decisions/` or `.adr-dir` first), continues the latest number, and never reuses a number, even for a superseded ADR.
- A risk in a review is scored `Likelihood (1 to 3) × Impact (1 to 3)` and has evidence (a config line, a metric, an incident or a file). A risk without evidence stays marked as unverified.
- Security, data and money flows named in the design go on to `security-gate`, `security-audit` or `pdpa-compliance` as the case needs.

## References

- [`references/architecture-overview-template.md`](references/architecture-overview-template.md) and [`references/architecture-review.md`](references/architecture-review.md) — write-up templates
- [`references/adr-writer.md`](references/adr-writer.md) — the full ADR rules
