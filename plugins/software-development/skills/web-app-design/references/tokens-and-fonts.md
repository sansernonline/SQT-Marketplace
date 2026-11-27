# Tokens, type scale and Thai fonts · dynamic-website

Open when setting colour tokens, type sizes or choosing a Thai font for large headings.

## Tokens and type scale

**Colour comes from the work** — if there is a brand colour, use it · if not → **search references first:** take the project's words and search live per `design-gate/design-references` (plugin `superuser`) type `web` or `motion`, then extract colours from the chosen work · the stored palette library is for when live search is impossible · if live search is impossible → house value `#2A78D6` (dark shade `#226CC6` for text on a light background), write `(รอยืนยัน)` (awaiting confirmation) and carry on · the values in the table are the reference site's, so stick to the **token list and its roles**, not the colour values · token names match `web-app-design` → `references/tokens.md` so page-mode pages (forms · admin) can use the same set

| Token | Reference value | Type role | Value |
|---|---|---|---|
| `--bg` · `--surface` | `#F7F6F2` · `#FFF` | body text | 400 16px/1.6 "IBM Plex Sans Thai", system-ui |
| `--ink` · `--ink-2` · `--muted` | `#0F0F0E` · `#3A3934` · `#6B6A63` | hero display | `clamp(52px, 8.4vw, 132px)` · lh 1.04 · ls -.035em · 700 |
| `--line` · `--line-2` | `#E4E1D8` · `#CFCBBF` | chapter heading (deck) | `clamp(42px, 5.7vw, 94px)` · lh 1.02 · ls -.04em |
| `--accent` · `--accent-ink` · `--accent-soft` | brand colour · dark shade · light shade 95% | kicker h2 | `clamp(40px, 5.2vw, 76px)` · lh 1.05 · ls -.035em |
| `--ok` `--warn` `--bad` (+ `-soft`) | green · amber · red — do not change with the brand | closing sentence | `clamp(34px, 4.2vw, 66px)` · lh 1.16 · 600 · max-width 12.5em |
| `--ease` | `cubic-bezier(.16,1,.3,1)` (expo-out) | lead / hero-sub | 18px or `clamp(17px,1.6vw,20px)` · max-width 34–36em |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | large outlined number | `clamp(100px,9vw,170px)` · `-webkit-text-stroke` 1.5px ink 13% |
| `--r` · `--pad` · `--max` · `--top` | 8px · 24px→16px · 1200px · 64px→56px | eyebrow / small | 12–13px · ls .04–.28em (Latin only) · `tabular-nums` |

- Large Thai headings with negative `letter-spacing` must be checked at every weight — when tone marks collide with vowels, back off to -.01em · `uppercase` + wide ls is for Latin eyebrows only (`web-app-design` item 5)
- The 3D background sits at z-index 0 under `main` (z 1) · deck opacity 1 · page-mode .22 · with a gradient scrim `.deck::before` «ให้ตัวหนังสืออ่านง่ายเหนือเครือข่าย»

## Thai fonts for large headings

| Font | Licence | Suited to | Note |
|---|---|---|---|
| IBM Plex Sans Thai | OFL 1.1 | Body text + chapter headings (the reference site uses it) | Latin is Plex Sans · loopless (the looped one is named IBM Plex Sans Thai Looped · checked 2026-10-23) easy to read at small size |
| Anuphan | OFL 1.1 | Large loopless headings, modern | Adapted from Plex Thai in a loopless style · negative ls allowed |
| Bai Jamjuree | OFL 1.1 | Large angular headings | The maker states "suited to headings" |
| Kanit | OFL 1.1 | Large bold headings | Cut terminals, narrow ls allowed · many weights |
| Noto Sans Thai | OFL 1.1 | Safe fallback for every job | Pairs with Noto Sans Latin |
| LINE Seed Sans TH | OFL 1.1 (github.com/line/seed) | Large round friendly headings | On Google Fonts (`ยังไม่ได้ตรวจ` not yet checked) |
| Sarabun | OFL | Official-document body text | Not a large-heading font |
| Chakra Petch | (`ยังไม่ได้ตรวจ` not yet checked) | Technology headings — `slide-deck` uses it | Check the licence before self-hosting |

**Pairing with Latin:** looped Thai pairs with Latin serif · loopless Thai pairs with Latin sans is a starting convention, not a hard rule. Several looped Thai fonts go with sans, but a serif paired with loopless Thai often looks odd · sets already designed as pairs: Trirong · Taviraj (looped Thai + serif · OFL) · IBM Plex Sans Thai (loopless + sans) · sources: Anuthin Wongsunkakon on the Linotype Neue Frutiger Thai page at myfonts.com · Smich Smanloh "Thai Type Pairing" ATypI 2020 · the Trirong and Taviraj descriptions in google/fonts · Wikipedia IBM Plex (all checked 2026-10-23)

Download everything as woff2 and self-host (rule 15) · do not `<link>` Google Fonts in the delivered files
