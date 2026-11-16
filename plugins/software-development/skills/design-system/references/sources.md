# Sources · design-system

Part of plugin `software-development` · copied and adapted from ui-ux-pro-max-skill (MIT · commit `b7d5353` · viewed 2026-11-05) · the English original is kept unchanged in `data/upstream/` · licence at `data/upstream/LICENSE`

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/design-system` · MIT · commit `b7d5353` · viewed 2026-11-05 · the files in `data/upstream/` `scripts/` `templates/` are copied unchanged

## Not copied (reason)

- The slide-making system (`search-slides.py` · `generate-slide.py` · `slide-token-validator.py` · the `slide-*` CSV files): the CSV files already exist in `design-direction-lookup/data/upstream/uipro/` · the rest duplicates `presentation-design` and `html-slide-deck`
- `fetch-background.py`: pulls images from the internet at run time, which breaks the rule of no downloads at run time
- The examples in the original use SaaS-style blue-purple only as a data format, not as recommended values
