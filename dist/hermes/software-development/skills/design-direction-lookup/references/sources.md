# Sources · design-direction-lookup


- `data/upstream/uipro/` copied unchanged from ui-ux-pro-max-skill commit `28b3b8d` (MIT · 2026-10-29), as the owner ordered it copied for improvement
- The idea of a searchable dataset, the BM25 search with an abstain threshold, and the design-system generator come from nextlevelbuilder/ui-ux-pro-max-skill (MIT · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · viewed 2026-10-26) · the code and data here are entirely rewritten, not copied · what is done differently from the source: Thai word segmentation · 3 directions instead of 1 answer · dropping framework default colors · Thai-Latin font pairs
- BM25 is a widely published ranking method, written by us in `scripts/design_search.py` · k1 1.5 and b 0.75
- The contrast thresholds 4.5:1 and 3:1 follow `ui-craft` step 5 (WCAG 2.2 criteria 1.4.3 and 1.4.11)
- 3 directions · look · app personality from `ui-craft` step 0.1 · `ui-craft/references/web-looks.md` · `ui-craft/references/app-character.md`
- The color and font rules that are dropped match the rules `framework-default` and `overused-font` of `design-gate/parts/no-ai-look/scripts/slop_scan.py`
