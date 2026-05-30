---
description: Design SDK using sdk-builder agent. Covers multi-language, idioms, types, errors.
argument-hint: <API to wrap, e.g., "payments API" + target languages>
---

Use `sdk-builder` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** target languages, API style, auth model, scale
2. **Apply `sdk-design-patterns` skill**
3. **Choose generator** (Stainless / Fern / Speakeasy) vs hand-build
4. **Design API surface:** resource organization, methods, types
5. **Design auth + errors per language**
6. **Plan versioning + distribution**
7. **Produce polished SDK design doc** using `polished-document-style` (from software-company)
8. **Hand-off:** Implementation → `developer`, docs → `docs-engineer`
