---
description: Review existing or proposed architecture using solution-architect agent. Evaluates against NFRs, identifies risks, and recommends improvements.
argument-hint: <system or component to review>
---

Use the `solution-architect` agent to perform an architecture review of: **$ARGUMENTS**

The solution architect should:

1. **Initial Discovery** — gather:
   - Current architecture docs (existing diagrams, ADRs)
   - System scope (which components, boundaries)
   - Review purpose: pre-implementation, mid-build, or operating system
   - Stakeholder concerns driving the review
   - Recent incidents or pain points

2. **Document current architecture:**
   - Create C4 model views (Context, Container, Component) using Mermaid
   - List components + responsibilities
   - Map data flows
   - Identify integration points

3. **Evaluate against quality attributes:**

   **🚀 Performance**
   - Latency targets vs measured
   - Throughput requirements
   - Caching strategy
   - Database query patterns

   **📈 Scalability**
   - Horizontal vs vertical
   - Bottlenecks (CPU, memory, network, DB)
   - Stateful vs stateless components
   - Auto-scaling readiness

   **🔒 Security**
   - Authentication / authorization
   - Data encryption (transit + rest)
   - Secrets management
   - Attack surface
   - (Hand off detailed threat model to `security-engineer`)

   **⚡ Reliability**
   - Single points of failure
   - Failure modes
   - Disaster recovery
   - Backup + restore tested

   **💰 Cost**
   - Current monthly spend
   - Cost per service / per request
   - Optimization opportunities

   **🛠️ Maintainability**
   - Tech debt accumulated
   - Tooling gaps
   - Documentation quality
   - Team familiarity

3. **Apply architecture patterns** (use `architecture-patterns` skill):
   - Is the chosen pattern appropriate?
   - Are we suffering from anti-patterns (distributed monolith, etc.)?
   - Would refactoring to a different pattern help?

4. **Identify risks:**

   | Severity | Definition |
   |----------|------------|
   | 🔴 Critical | Will fail / cause outage soon |
   | 🟠 High | Significant risk within 12 months |
   | 🟡 Medium | Known limitation, manageable |
   | 🟢 Low | Future consideration |

5. **Propose improvements** with trade-offs:
   - Quick wins (low effort, high impact)
   - Strategic changes (require investment)
   - Things to NOT do (anti-patterns to avoid)

6. **Produce polished architecture review document** using `polished-document-style` skill:
   - Executive summary
   - Current state diagrams (Mermaid)
   - Quality attribute scorecard
   - Risk register
   - Recommendations prioritized
   - ADRs needed (list for follow-up)
   - Sign-off section

7. **Hand-off suggestions:**
   - Detailed threat model → `security-engineer`
   - Implementation of changes → `developer`
   - Cost optimization details → `devops-engineer`
   - Refactoring plan → `project-manager`
