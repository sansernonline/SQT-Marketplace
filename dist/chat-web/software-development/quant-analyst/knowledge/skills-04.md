# skill: markdown-visuals

Use when a Markdown doc needs an image, SVG or ASCII art

# Markdown Visuals

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-development`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-development`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-development`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-development`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

If the document or project already has a colour palette, use it. If not, search for references per `design-references` (plugin `superuser`), type `document`, and take the colours from the chosen work · if live search is not possible, use the house value `#2A78D6`, mark it `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask (order in `diagram-figures` item 5 · colour-by-domain table [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) · for role-based tokens (`bg-canvas` · `accent-primary` · `state-*` …) see [references/svg-snippets.md](references/svg-snippets.md) · and **1 document uses 1 palette**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**Choosing a diagram type, theme, readability rules and Thai labels is covered in `software-diagrams` (plugin `software-development`) items 1–5 and `assets/mermaid-theme.md`** · for Mermaid in project documents that must be converted to a picture for Word, use the converter in `diagram-figures` → `references/engine-mermaid.md`
This file only says *when to choose Mermaid over other formats*

| Choose Mermaid when | Choose something else when |
|---|---|
| It is boxes and arrows that the engine can lay out | If you must control placement yourself, use inline SVG; for a figure that must look designed, use `diagram-figures` (HTML layout or engine-svg-python) and embed it as an image file |
| It lives in a file that must be diffed in git | It is a real screenshot: use an image file |
| Readers open it in GitHub or Notion | Readers open it in a Word document or slides: use an image file |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- **PNG screenshots of text** — use the text, in a code block
- **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

## ไม่ให้ดูเหมือน AI ทำ

Before sending, go through item 3 of `no-ai-look` — for HTML work, run its script · every piece must also pass eye check 3.2 (a web page adds items 10–14), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for all media is there


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## Colour: it comes from the subject, not from a ready-made table

If the document or project already has a colour set, use that set.
If not, use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask. Propose a tone drawn from the subject in the report: medical green · finance dark blue ·
industrial amber · government navy · general software blue (the full table is in [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

Define **tokens by role** at the top of the document, then use the same values in every figure in that document:

| Token | Role | Comes from |
|---|---|---|
| `bg-canvas` | Background of the figure | The darkest shade (dark mode) or the lightest (light mode) |
| `bg-surface` | Sheets, panels, cards | Different enough from canvas to show the edge without drawing a line |
| `bg-elevated` | A tile raised one more layer | |
| `accent-primary` | Emphasis, the active state | **The brand colour** (none → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | Main text | Contrast ≥ 4.5:1 against the surface it sits on |
| `text-muted` | Secondary text, placeholder | `rgba(...,0.55)` of `text-primary` |
| `state-success` · `state-warning` · `state-danger` | Status | **Does not change with the brand.** Green always means pass and red always means fail |

**One document, one colour set.** 10 figures in one document with mismatched colours are harder to read than plain figures with matching colours.

## Snippets

> The examples below use one dark-mode colour set as a stand-in only.
> **Change the colour values to match the agreed set before use.** The structure is what you copy, not the colour values.

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).


---

# skill: stack-mql

Use when writing MQL4 or MQL5 code for MetaTrader

# stack-mql — an Expert Advisor (EA) that sends orders correctly on every broker

> **One rule:** every order goes through the pre-send checker and every returned result is read · an EA that "works in the tester" but does not check is not done.

## Use when

- Writing or reviewing an EA, indicator or script for MetaTrader 4 (MT4) or MetaTrader 5 (MT5)
- Porting between MT4 and MT5
- Preparing an EA for the MQL5 Market or for self-sale

Not for: strategy, risk and backtest criteria → the project's trading spec (repo prompt set: `prompt/software-development/prompt-trading-system.md`; someone with only the plugin does not have it, so ask the owner for the spec) · backtest formulas → agent `quant-analyst` · only a `.ex5` and no source → `reverse-engineering` (`references/mql5-ex5.md`; extract behaviour in the Strategy Tester and rewrite, do not decompile)

## Steps

1. **Know the platform:** `.mq4` = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = an include, shareable if the differing parts sit behind `#ifdef __MQL5__`. In MQL4 put `#property strict` in every file. Differences that break a port, return codes, compile and command-line backtest → [`references/platform.md`](references/platform.md).
2. **Compile when a terminal exists.** On a machine without one, write "ยังไม่ได้ compile" in the report; never say it passed.
3. **Pass every order through the pre-send checker:**

| Check | Do this |
|---|---|
| volume | round down to `SYMBOL_VOLUME_STEP` · between `SYMBOL_VOLUME_MIN` and `SYMBOL_VOLUME_MAX` |
| price | `NormalizeDouble(price, _Digits)` |
| Stop Loss (SL) / Take Profit (TP) | at least `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` away from the current price |
| modifying | not when the price is within `SYMBOL_TRADE_FREEZE_LEVEL` · do not resend the same values |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) before sending |
| order count | less than `ACCOUNT_LIMIT_ORDERS` (0 = unlimited) |
| symbol | `SYMBOL_TRADE_MODE` is not disabled · market is open |
| MT5 whole set | `OrderCheck()` before `OrderSend()` |

4. **Read every returned result.** Requote / off quotes → retry at most 3 times, with a new price each time. Not enough money / invalid stops → do not retry; log and stop that trade.
5. **Convert pips at one place only:** a 5-digit price (3-digit for JPY pairs) → 1 pip = 10 points.
6. **Structure the EA:**
   - `OnInit` validates every input (wrong value → `INIT_PARAMETERS_INCORRECT`), creates handles; `OnDeinit` releases them. MT5 indicators: handle once in `OnInit`, then `CopyBuffer`.
   - Do heavy logic once per new bar (compare `iTime(_Symbol, _Period, 0)` with a remembered value), not on every tick.
   - A magic number per EA + symbol + strategy; manage only orders whose magic matches, never manual orders or another EA's.
   - Never keep important state only in a variable: `OnInit` rebuilds state from positions/orders with a matching magic; values that cannot be rebuilt (such as today's loss total) go in `GlobalVariableSet` or a file in `MQL5\Files` / `MQL4\Files`.
   - Use server time (`TimeCurrent`) for bars and sessions; it is not Thai time and shifts with daylight saving. In the tester `TimeGMT()` equals the simulated server time (https://www.mql5.com/en/docs/dateandtime/timegmt), so news and session filters based on GMT take the offset as an input.
   - Keep signal · lot size · order sending · managing open orders separate; the signal is a pure function from bar data to a result.
   - Log every decision to send or not send: server time · symbol · reason · price · spread · returned result. Do not log every tick.
7. **Test:**
   - Script test: feed fixed data to the signal and lot-size functions and compare (MQL has no standard test framework).
   - Backtest: MT5 "Every tick based on real ticks" for results used to decide; MT4 reports modelling quality every time; spread · commission · swap set to the real account, not 0.
   - Cover at least 3 symbols with different digits (EURUSD · USDJPY · XAUUSD), at least 2 timeframes, netting and hedging (MT5), and a capital so small the minimum lot cannot be sent.
   - Never judge from optimized results: use MT5's forward period or split in-sample / out-of-sample yourself; report the period not used for optimizing.
   - `OnTester()` returns the criterion the spec defines.
8. **Security:** passwords, API keys and license keys never go in code or `.set`. `WebRequest` works only with URLs the user added to the terminal's allow list; say in the manual which URLs to add.
9. **If selling:** MQL5 Market rules (no DLL, no account lock, the check must see real orders, no profit promise) and self-sale license lock → [`references/market-and-license.md`](references/market-and-license.md).

## Check before done

- Compiles with 0 errors 0 warnings (or the report says it was not compiled because there is no terminal)
- Every order passes the checker · every returned result is read and logged
- Magic number · state can be rebuilt after a restart · orders with a non-matching magic are untouched
- Every input has a default and a range checked in `OnInit`
- Backtest uses real spread · commission · swap · the reported result comes from a period not used for optimizing
- Cases cover at least 3 symbols · 2 timeframes (· netting and hedging for MT5)
- Selling on the Market: no DLL · no account or symbol lock · the description promises no profit

## References

- [`references/platform.md`](references/platform.md) — open when compiling, backtesting from the command line, porting MT4 ↔ MT5, reading result codes, or hunting a trap (double compare, index shift, ECN SL/TP)
- [`references/market-and-license.md`](references/market-and-license.md) — open when the EA will be sold

General principles: `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns` · `config-and-secrets`


## reference: market-and-license.md

# Selling on the MQL5 Market and self-sale · stack-mql

Open when the EA will be sold, or when it needs a license lock.

## MQL5 Market

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/market/market_sell · the rules can change; re-check before submitting

- Submit a single compiled file (`.ex5` / `.ex4`) · indicators · sounds · images embedded as resources · **no Dynamic Link Library (DLL)**
- **Do not restrict by account number or account type** · the Market locks machines and the number of activations itself · our license system below is for self-sale channels only.
- The automatic check runs the EA in the tester on several symbols and timeframes · the EA must really send orders in every one of those conditions (sending none = fail) · having every item of the pre-send checker is what makes it pass.
- Do not promise profit in the description · the product name in Latin letters is at most 50 characters with no version number · state it if it works only with hedging or netting.

## Self-sale (not through the Market)

- Lock the license with the account number (`ACCOUNT_LOGIN`) + an expiry date, checked in `OnInit`.
- Do not give the customer the `.mq4` / `.mq5` · `.ex4` / `.ex5` files can be partly decompiled, so do not put secret rules only inside the EA.


## reference: platform.md

# MT4 and MT5: compile, backtest and port differences · stack-mql

Open when compiling or backtesting from the command line, porting between MT4 and MT5, or reading a returned result code.

| Step | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| compile result | a `.log` file next to the source file · 0 errors 0 warnings | same |
| backtest from the command line | `terminal64.exe /config:"tester.ini"` (section `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + an MT4-style config file (fewer options) |

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/start_advanced/start · re-check this page before use

Compiling and testing need a terminal (Windows, or the Wine build MetaQuotes distributes for macOS / Linux).

## Differences that break a port

| Topic | MT4 | MT5 |
|---|---|---|
| order model | an order = a position (`OrderSend` · `OrderSelect` · `OrdersTotal`) | order · position · deal are separate · use `CTrade` (`Trade\Trade.mqh`) |
| account | always hedging | netting or hedging → read `ACCOUNT_MARGIN_MODE` · netting allows 1 position per symbol |
| order filling | no choice | FOK / IOC read from the flags in `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN works in every mode except Market Execution · pending orders use RETURN |
| indicator | returns the value at once (`iMA(...)`) | create the handle once in `OnInit`, then `CopyBuffer` · release it in `OnDeinit` |
| order send result | `GetLastError()` (130 invalid stops · 134 not enough money · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = success · 10004 requote · 10014 invalid volume · 10015 invalid price · 10016 invalid stops · 10018 market closed · 10019 not enough money · 10030 invalid filling) |
| order events | none; you must poll | `OnTradeTransaction` |

## Traps where the code looks right but really breaks

Adapted from ThomasPraun/mql-developer · MIT.

- `double` cannot be compared with `==`; `NormalizeDouble` both sides or compare against a tolerance.
- In MT4, closing several orders must loop from `OrdersTotal()-1` down to 0 because the index shifts after a close.
- Some ECN brokers do not accept SL/TP in `OrderSend`, so send first and then `OrderModify`.
- `WebRequest` blocks until it gets a reply and cannot be used in indicators and the tester.
- One MT4 terminal can trade with only one EA at a time (error 146); wait and retry, do not resend at once.
- A series array has index 0 = the latest bar; always mark with `ArraySetAsSeries`, never guess the direction.

Sample code for each checker item → https://www.mql5.com/en/articles/23204 (read it and write your own; do not copy the whole file)
