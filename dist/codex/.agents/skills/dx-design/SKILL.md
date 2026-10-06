---
name: "dx-design"
description: "Audit developer experience or design an SDK using the devrel-engineer agent. Two modes — dx-audit or sdk-design."
---

Two modes. Read the first word of **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `dx-audit` | Audit developer experience using devrel-engineer agent. Measures TTFHW, error UX, sample quality, onboarding flow. |
| `sdk-design` | Design SDK using devrel-engineer agent. Covers multi-language, idioms, types, errors. |

---

## Mode: `dx-audit`

Use `devrel-engineer` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** target persona, current state, friction points
2. **Apply `developer-experience` skill** for systematic audit
3. **Measure TTFHW** end-to-end
4. **Audit errors:** clarity, actionability, references
5. **Audit samples:** runnable, realistic, modern
6. **Audit onboarding funnel:** drop-off points
7. **Audit CLI/SDK** if applicable
8. **Identify quick wins + structural improvements**
9. **Produce polished DX audit** using `polished-document-style` (from software-company)
10. **Hand-off:** SDK → `devrel-engineer`, docs → `devrel-engineer`, content → `devrel-engineer`

---

## Mode: `sdk-design`

Use `devrel-engineer` agent for: **สิ่งที่ผู้ใช้ระบุมากับคำสั่ง**

Workflow:
1. **Discovery:** target languages, API style, auth model, scale
2. **Apply `developer-experience` skill**
3. **Choose generator** (Stainless / Fern / Speakeasy) vs hand-build
4. **Design API surface:** resource organization, methods, types
5. **Design auth + errors per language**
6. **Plan versioning + distribution**
7. **Produce polished SDK design doc** using `polished-document-style` (from software-company)
8. **Hand-off:** Implementation → `developer`, docs → `devrel-engineer`
