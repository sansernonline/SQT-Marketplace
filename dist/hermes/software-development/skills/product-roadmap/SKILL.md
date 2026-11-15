---
name: "product-roadmap"
description: "Build a product roadmap with the product-manager agent — quarterly plan, RICE, success metrics."
---

Use the `product-manager` agent to build a product roadmap for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

The product manager should:

1. **Initial Discovery** — gather (unknown → `(รอยืนยัน)`, keep going):
   - Business strategy / company Objectives and Key Results (OKRs)
   - Target users + key personas
   - Current product state (what exists)
   - Resources (team size, budget)
   - Strategic themes (what matters most)
   - Past learnings (what's been tried)

2. **Define strategic themes** (3-5 max):
   - Each theme = a focus area for the period
   - Each theme has a measurable success criterion, written as an outcome: **จาก X เป็น Y ภายใน Z สำหรับใคร** (e.g. "checkout completion from 62% to 75% by end of Q3 for mobile buyers") — a feature list is not an outcome
   - Each outcome names one counter-metric that must not get worse while chasing it (e.g. refund rate while pushing conversion) (แนวคิดจาก borghei outcome-roadmap · เขียนใหม่)
   - Themes should align with company strategy

3. **Generate candidate features:**
   - From user research / feedback
   - From competitive analysis
   - From data / analytics insights
   - From team brainstorming

4. **Prioritize using RICE (Reach, Impact, Confidence, Effort):**
   - **R**each — how many users affected per period
   - **I**mpact — magnitude (0.25 = minimal, 3 = massive)
   - **C**onfidence — how sure are we, as a fraction 0–1 (0.5 / 0.8 / 1), never a percentage
   - **E**ffort — person-days (or hours), same unit for every item
   - Score = (R × I × C) / E — do not compute by hand: put the items in a JSON file and run `decision-scoring` command `priority` (`node decide.mjs priority <file.json>`; example [`templates/rice.json`](templates/rice.json), verified run: PromptPay 853.33 ranks first). Paste the script's table, not your own arithmetic

5. **Allocate to quarters:**
   - Consider dependencies
   - Balance theme coverage
   - Leave buffer (~20%) for unknowns

6. **Define out-of-scope explicitly:**
   - What we're NOT doing this period and why
   - When we'll revisit

7. **Set measurable goals per quarter:**
   - North star metric
   - Supporting Key Performance Indicators (KPIs) (AARRR framework — Acquisition, Activation, Retention, Referral, Revenue)
   - Leading indicators

8. **Produce polished roadmap document** using `polished-document-style` skill:
   - Cover with version/status
   - Strategic themes table
   - Gantt timeline (รูปตามแบบประจำบ้านของ skill `diagram-figures` — ไม่ใช้ Mermaid ในเอกสารโปรเจกต์)
   - RICE prioritization table
   - KPI dashboard
   - Strategic risk register
   - Sign-off section

9. **Hand-off suggestions:**
   - Detail requirements → `business-analyst`
   - Technical feasibility → `solution-architect`
   - Delivery planning → `project-manager`

**อ่านเพิ่มเมื่อต้องใช้:** [`references/product-doc-templates.md`](references/product-doc-templates.md) — แม่แบบเอกสารผลิตภัณฑ์
