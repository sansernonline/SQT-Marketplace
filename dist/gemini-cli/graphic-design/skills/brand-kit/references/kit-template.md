# Brand kit folder template

Copy this tree to `brand-kit/v1/` (or to `00-brand-kit/` inside the asset tree from `asset-organize`).

```
brand-kit/
└── v1/
    ├── README.md              ← the five-minute read (template below)
    ├── CHANGELOG.md           ← one line per version
    ├── logo/
    │   ├── <brand>-logo-colour.svg / .png / .pdf
    │   ├── <brand>-logo-reversed.svg
    │   ├── <brand>-logo-black.svg
    │   ├── <brand>-logo-white.svg
    │   ├── <brand>-symbol-*.svg          (icon-only versions, if any)
    │   └── usage.png                     (clear space, min size, don'ts drawn)
    ├── colour/
    │   ├── palette.md                    (roles, hex, RGB, CMYK, contrast matrix)
    │   └── swatches.png
    ├── type/
    │   ├── fonts.md                      (families, weights, scale, licence links)
    │   └── licences/                     (the OFL.txt of every font shipped)
    ├── imagery/
    │   ├── on-style/                     (3–6 examples)
    │   └── off-style/                    (2–3 examples of what not to do)
    ├── voice.md
    └── templates/                        (post, story, cover, banner, doc header)
```

## README.md template

```markdown
# <Brand ไทย> / <Brand English> — brand kit v1

<One paragraph: who we are, for whom, how we want people to feel.>

## Five rules that never break
1. <rule> — because <reason>
2. ...

## Colour
| Role | Hex | RGB | CMYK | Use |
|---|---|---|---|---|
| Background | | | | |
| Primary | | | | |
| Accent | | | | |
| Text | | | | |

Allowed text/background pairs (all ≥ 4.5:1, or ≥ 3:1 for headlines ≥ 18 pt): <list>
Forbidden pairs: <list>

## Type
Headline: <family + weight> · Body: <family + weight> · Scale: <px list> · Thai line-height: <1.6>

## Logo
Clear space: <definition> · Minimum size: <px / mm> · See logo/usage.png

## Imagery
Three adjectives: <a, b, c> · See imagery/on-style and imagery/off-style

## Voice
Three adjectives: <a, b, c> · Banned habits: <e.g. no "!!!", no English jargon in Thai copy>

## Version
v1 · <date> · owner <name>
```

## CHANGELOG.md line format

`v2 · 2026-11-01 · accent #F2A93B → #E8A030 to match print · approved by <name>`

## CMYK note

Screen hex values do not convert one-to-one to print. Ask the print shop (โรงพิมพ์) for a proof of the primary and accent, then record the CMYK they matched — not the number a converter guessed.
