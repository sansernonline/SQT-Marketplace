---
name: architecture-review
description: Review existing or proposed architecture with the solution-architect agent against non-functional requirements and risks.
argument-hint: <system or component to review>
disable-model-invocation: true
---

Use the `solution-architect` agent to perform an architecture review of: **$ARGUMENTS**

The solution architect should:

1. **Initial Discovery** — gather:
   - Current architecture docs (existing diagrams, Architecture Decision Records (ADRs))
   - System scope (which components, boundaries)
   - Review purpose: pre-implementation, mid-build, or operating system
   - Stakeholder concerns driving the review
   - Recent incidents or pain points

2. **Document current architecture:**
   - Create Context-Container-Component-Code (C4) model views (Context, Container, Component) as figures with the `diagram-figures` skill (not plain Mermaid)
   - List components + responsibilities
   - Map data flows
   - Identify integration points

3. **Evaluate against quality attributes:**

   **Performance**
   - Latency targets vs measured
   - Throughput requirements
   - Caching strategy
   - Database query patterns

   **Scalability**
   - Horizontal vs vertical
   - Bottlenecks (CPU, memory, network, DB)
   - Stateful vs stateless components
   - Auto-scaling readiness

   **Security**
   - Authentication / authorization
   - Data encryption (transit + rest)
   - Secrets management
   - Attack surface
   - (Hand off detailed threat model to `security-engineer`)

   **Reliability**
   - Single points of failure
   - Failure modes
   - Disaster recovery
   - Backup + restore tested

   **Cost**
   - Current monthly spend
   - Cost per service / per request
   - Optimization opportunities

   **Maintainability**
   - Tech debt accumulated
   - Tooling gaps
   - Documentation quality
   - Team familiarity

4. **Apply architecture patterns** (use `architecture-patterns` skill):
   - Is the chosen pattern appropriate?
   - Are we suffering from anti-patterns (distributed monolith, etc.)?
   - Would refactoring to a different pattern help?

5. **Identify risks** — walk every component through 6 lenses so nothing hides behind the one the stakeholder named: data loss · security exposure · availability (single point of failure, no rollback) · cost run-away · lock-in (vendor, one-person knowledge) · change cost (idea from ECC production-audit)

   Score each risk `Likelihood (1–3) × Impact (1–3)` and attach evidence (config line · metric · incident · file); a risk with no evidence stays `(ยังไม่ได้ตรวจ)` and never scores above Medium

   | Severity | Score | Definition |
   |----------|-------|------------|
   | Critical | 7–9 | Will fail / cause outage soon |
   | High | 5–6 | Significant risk within 12 months |
   | Medium | 3–4 | Known limitation, manageable |
   | Low | 1–2 | Future consideration |

   Summary line uses the house review scale: Critical–High = สูง · Medium = กลาง · Low = ต่ำ

6. **Propose improvements** with trade-offs:
   - Quick wins (low effort, high impact)
   - Strategic changes (require investment)
   - Things to NOT do (anti-patterns to avoid)

7. **Produce polished architecture review document** using `polished-document-style` skill:
   - Executive summary
   - Current state diagrams (`diagram-figures` house style)
   - Quality attribute scorecard
   - Risk register
   - Recommendations prioritized
   - ADRs needed (list for follow-up)
   - Sign-off section

8. **Hand-off suggestions:**
   - Detailed threat model → `security-engineer`
   - Implementation of changes → `developer`
   - Cost optimization details → `devops-engineer`
   - Refactoring plan → `project-manager`
