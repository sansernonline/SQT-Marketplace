---
description: Build a strategic product roadmap with prioritization using product-manager agent. Produces quarterly plan with RICE scoring and success metrics.
argument-hint: <time horizon, e.g., "Q1-Q4 2026" or "next 6 months">
---

Use the `product-manager` agent to build a product roadmap for: **$ARGUMENTS**

The product manager should:

1. **Initial Discovery** — ask the user:
   - Business strategy / company OKRs
   - Target users + key personas
   - Current product state (what exists)
   - Resources (team size, budget)
   - Strategic themes (what matters most)
   - Past learnings (what's been tried)

2. **Define strategic themes** (3-5 max):
   - Each theme = a focus area for the period
   - Each theme has a measurable success criterion
   - Themes should align with company strategy

3. **Generate candidate features:**
   - From user research / feedback
   - From competitive analysis
   - From data / analytics insights
   - From team brainstorming

4. **Prioritize using RICE:**
   - **R**each — how many users affected per period
   - **I**mpact — magnitude (0.25 = minimal, 3 = massive)
   - **C**onfidence — how sure are we (50-100%)
   - **E**ffort — person-months estimate
   - Score = (R × I × C) / E

5. **Allocate to quarters:**
   - Consider dependencies
   - Balance theme coverage
   - Leave buffer (~20%) for unknowns

6. **Define out-of-scope explicitly:**
   - What we're NOT doing this period and why
   - When we'll revisit

7. **Set measurable goals per quarter:**
   - North star metric
   - Supporting KPIs (AARRR framework)
   - Leading indicators

8. **Produce polished roadmap document** using `polished-document-style` skill:
   - Cover with version/status
   - Strategic themes table
   - Mermaid Gantt timeline
   - RICE prioritization table
   - KPI dashboard
   - Strategic risk register
   - Sign-off section

9. **Hand-off suggestions:**
   - Detail requirements → `business-analyst`
   - Technical feasibility → `solution-architect`
   - Delivery planning → `project-manager`
