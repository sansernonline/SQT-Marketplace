---
name: design-system
description: Use for design tokens, a Tailwind theme or a starting palette
---

# Design System — 3-layer tokens and component specs

> **Gate before starting (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the "Gate before starting" (`ด่านก่อนลงมือ`) section of `design-gate/design-references` (plugin `superuser`) even when a brand already exists (the brand controls color and fonts, while the search is for finding the structure of this piece) · close the job with the line `ด่านก่อนลงมือ:`

> **One rule:** screen code must have no raw colors or spacing. Every value references a token · tokens have 3 layers: **primitive** (raw value `--color-blue-600`) → **semantic** (role `--color-primary`) → **component** (`--button-bg`) · to change the theme, edit the middle layer in one place

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Write the tokens", "generate CSS from JSON", "Tailwind theme", "check the code for raw colours" | This file: steps 1–5 below |
| "New screen, no visual direction yet", "starting palette", "Thai and English font pair", "which chart fits" | [`references/design-direction-lookup.md`](references/design-direction-lookup.md) (sources: [`references/design-direction-lookup/sources.md`](references/design-direction-lookup/sources.md)) |

## Which one to use

| Task | Use |
|---|---|
| Code already exists; the user wants to know which values it uses and where it leaves the scale | `ui-craft` → `scripts/design_tokens.py` (reads the code → `docs/DESIGN.md`) |
| Write new tokens, generate CSS from JSON, check that code has no raw values | **this skill** |
| Spacing and font size scales | `ui-craft` items 1–2 (use the same scale as the tokens you set) |
| Pick starting colors and fonts | `design-system` |
| Colors and fonts of a brand that already has a document | `brand-kit` section "เขียนเป็นเอกสาร" (write as a document) (plugin `graphic-design`) → sync into the token file here |

## Steps

1. **Start from the template** `templates/design-tokens-starter.json` (it has all 3 layers) · put the brand colors in the primitive layer · for spacing use the 4 8 12 16 24 32 48 64 scale of `ui-craft`
2. **Generate CSS:** `node scripts/generate-tokens.cjs --config <tokens.json> -o <tokens.css>` (tested 2026-11-05 with the template; it produced a full `:root`)
3. **Check the code:** `node scripts/validate-tokens.cjs --dir src/` → reports raw colors and px that should be tokens (tested 2026-11-05: found 1 hex and 1 px in the sample file) · the result is a reason to look again, not a demand to fix every line
4. **Component states:** for buttons · inputs · cards, make a state table of default / hover / active / focus / disabled per `data/upstream/states-and-variants.md` before writing CSS
5. **Tailwind:** `data/upstream/tailwind-integration.md` — bind the tokens into the theme · colors must come from the brand, not from the framework's starter set (`design-gate/no-ai-look`)

The scripts are Node, install no extra packages, and make no network calls.

## Original files

| Topic | File in `data/upstream/` |
|---|---|
| Overview of the three layers | `token-architecture.md` |
| Raw values · roles · components | `primitive-tokens.md` · `semantic-tokens.md` · `component-tokens.md` |
| Component specs and states | `component-specs.md` · `states-and-variants.md` |
| Tailwind | `tailwind-integration.md` |

## Check before sending

1. `validate-tokens.cjs` leaves no raw colors or px in new code (except those with a written reason)
2. Every semantic text/background pair passes 4.5:1 in both light and dark mode
3. Every component has all 5 states

## References

- [`references/sources.md`](references/sources.md) — open when you need the origin, licence or the list of upstream files not copied
- [`references/design-direction-lookup.md`](references/design-direction-lookup.md) — open for a starting palette, font pair and Thai UX rules on a new screen
