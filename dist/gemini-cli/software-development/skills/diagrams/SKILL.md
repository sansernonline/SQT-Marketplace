---
name: diagrams
description: Use when a doc, slide, README or PR needs a diagram or figure
argument-hint: '<what the diagram must show, and where it goes>'
---

# diagrams — pick the tool by where the picture ends up, then draw one question per figure

> **One rule:** a diagram answers one question. If it answers two, draw two pictures. Choose the tool by the destination first: a delivered document or slide gets a designed figure, and a README or PR gets a quick Mermaid diagram.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Figure for the SRS, BRD, slide or print", "designed diagram", "architecture picture with AWS or Kubernetes icons" | [`references/diagram-figures.md`](references/diagram-figures.md) (engines: [`references/engine-svg-python.md`](references/engine-svg-python.md), [`references/engine-mermaid.md`](references/engine-mermaid.md); layouts: [`references/layout-flow.md`](references/layout-flow.md), [`references/layout-cloud.md`](references/layout-cloud.md), [`references/layout-context.md`](references/layout-context.md), [`references/layout-deployment.md`](references/layout-deployment.md)) |
| "Quick diagram for the README", "sequence or ER in the PR", "a flow in a code note" | [`references/software-diagrams.md`](references/software-diagrams.md) |
| "Image or SVG in a Markdown doc", "ASCII art for a comment" | [`references/markdown-visuals.md`](references/markdown-visuals.md) (ASCII patterns: [`references/ascii-patterns.md`](references/ascii-patterns.md); SVG snippets: [`references/svg-snippets.md`](references/svg-snippets.md)) |

Icons: [`references/icons.md`](references/icons.md). Colour by domain: [`references/colour-by-domain.md`](references/colour-by-domain.md). Mistakes to avoid: [`references/pitfalls.md`](references/pitfalls.md). Mixing formats in one doc: [`references/combining-formats.md`](references/combining-formats.md).

## Steps every part shares

1. Write the one question the diagram answers. Put that question in the figure title as a conclusion, with one sentence under it saying what to look at.
2. Use the same words in the figure as in the document.
3. Use the colour of the source document's theme. Pick colours by meaning, not decoration.
4. Render the figure and look at it. A diagram that was never rendered is only text.
5. Run the checker for the tool used (`scripts/check-figure-source.py`, `scripts/check-figure-geometry.py` or `scripts/check-mermaid-theme.mjs`).

## Check before done

- Mermaid is not in a delivered document, slide or print file. It is only for drafts discussed in chat, or for a README or PR.
- Every Mermaid block has its theme line, and `fontFamily` sits outside `themeVariables`. Otherwise Mermaid silently falls back to its default font.
- Thai text in a figure has a line height of at least 1.5, and no text box has a fixed height. Upper vowels and tone marks get cut otherwise.
- Someone who has never seen the system can answer the question the figure was drawn for.
