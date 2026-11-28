# skill: slide-deck

Use when planning a slide deck story or an HTML slide deck

# slide-deck — plan a deck whose titles tell the story, then deliver it as .pptx or HTML

> **One rule:** every slide title is the conclusion of its page. Read the titles alone in order, and they must tell the whole story. If they do not, reorder the slides or cut them before any design work.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make a slide deck", "presentation", "plan the story and layouts" (no file type given) | [`references/presentation-design.md`](references/presentation-design.md) (builds a .pptx with `document-design`) |
| "Slide deck in HTML", "animated deck", "presents from a browser", "click-by-click reveal" | [`references/html-slide-deck.md`](references/html-slide-deck.md) |
| "Convert this .pptx to HTML", "make the HTML look like the pptx" | [`references/from-pptx.md`](references/from-pptx.md) |

Colour and mood for every deck: [`references/deck-theme.md`](references/deck-theme.md) (theme rules in [`references/theme.md`](references/theme.md)). Layouts and the shell for HTML: [`references/layouts-and-shell.md`](references/layouts-and-shell.md). Mistakes to avoid: [`references/anti-patterns.md`](references/anti-patterns.md). Extra detail: [`references/deck-details.md`](references/deck-details.md).

## Steps every part shares

1. Choose the file. If the type is not stated, make a .pptx, and say in one line that an animated HTML version is possible.
2. Collect sources for every fact, number or competitor the deck cites, before writing titles.
3. Take the colours from the source work (run `scripts/source_palette.py` on the logo, file or website the user gave).
4. Write each title as plain text, one per slide. Reorder until the story reads, then cut slides that do not move it.
5. Budget each slide: title at most 2 lines, at most 6 bullets, at most 2 lines per bullet. Cut bullets rather than shrink text.
6. Keep content text at 18 pt or larger in a .pptx. Put the footer (section name left, page number right) on every slide.
7. Render every slide, look at the whole deck as thumbnails, then run `scripts/check_deck.py` (or `scripts/check_html_deck.py` for HTML).

## Check before done

- Reading only the titles gives the whole story, and every title is a conclusion.
- Each chart makes one point, and the chart has its data source and period.
- Every slide has a page number, and no slide is visibly denser than the others.
- The deck was opened once on a real screen or projector.
- The 13 items in `references/anti-patterns.md` were checked, and the line `ด่านก่อนลงมือ:` closes the work.


## reference: anti-patterns.md

# Slide anti-patterns

Use when checking a deck before sending.

- **The slide title is a topic name.** "ภาพรวมระบบ" (system overview) says nothing
- **The slide title is shortened until it must be guessed.** 2 phrases placed side by side with no connector, or jargon the audience does not know ("Guard" · "โค้ด" (code)) for a general audience
- **The slide is a document.** A full page of paragraphs, 12 pt text
- **Reading the slide aloud to the audience.** If every word is already on screen, no one needs to speak
- **Shrinking the text to make the content fit.** Cut content instead
- **Bullets nested 3 levels.** The maximum is 2 levels; reaching 3 means you should split the slide
- **Animating in one bullet at a time on every slide.** Slow, and the audience is annoyed from slide 3
- **Stock images unrelated to the content.** People shaking hands, arrows shooting up
- **A 15-row data table on a slide.** Move it to an attachment
- **A chart copied whole from Excel,** with gridlines and a full legend
- **Brand colour on everything.** Use the brand colour only for what you want people to look at
- **No page numbers.** The audience cannot refer to a slide
- **Sending the deck without ever viewing the whole set as thumbnails**


## reference: deck-details.md

# Deck details · presentation-design

Open this when ordering a story, choosing layouts, setting text sizes, building data slides, or setting Thai type.

- [Story order by purpose](#story-order-by-purpose)
- [Slide title examples](#slide-title-examples)
- [Six layouts](#six-layouts)
- [Text size](#text-size)
- [Data slides](#data-slides)
- [Thai on slides](#thai-on-slides)
- [Off-the-shelf look: avoid](#off-the-shelf-look-avoid)
- [Related skills](#related-skills)

## Story order by purpose

First ask what the deck needs from the audience, then choose the order.

| Purpose | Order |
|---|---|
| **Ask for approval / a decision** | Conclusion and the ask → 3 reasons → alternatives considered → risks → the ask again |
| **Progress report** | Overall status (green/yellow/red) → what is done → what is blocked and what is needed from whom → next period's plan |
| **Review a plan or design** | Problem solved → constraints → chosen design → why others were not chosen → points where you want opinions |
| **Training** | What they can do after learning → concepts → demo → let them try → summary and what to study next |
| **Selling work** | Customer's problem (in their words) → results they will get → our method → evidence → price and next step |

For executives the conclusion goes on the first slide, not the last: they may have only the first 5 minutes.

## Slide title examples

```
ผิด: ผลการวิเคราะห์เวลาดำเนินการ
ถูก: ขั้นอนุมัติกินเวลาสองในสามของทั้งหมด

ผิด: สถานะโครงการ
ถูก: ส่งทันกำหนด ยกเว้นงานเชื่อมระบบบัญชีที่ช้า 1 สัปดาห์

ผิด: ทุกข้อความผ่าน 8 ขั้น: Artificial Intelligence (AI) ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ
ถูก: ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน
```

A title may run up to 2 lines. Do not shorten it into a topic name or until it reads badly: a title with 2 parts needs a connector, use phrases people say, choose words by who is listening (`human-writing` item 6).

Bullets are gist, not full sentences: people read faster than a speaker talks, so full sentences make the audience read instead of listen.

## Six layouts

Overview: `assets/slide-mockup-preview.webp` · `assets/slide-mockup.html` has all 6 rendered at 1280×720 and checked by eye (open in a browser, or use as the model for a `.pptx`).

| # | Layout | Use when |
|---|---|---|
| 1 | **Cover**: big title + divider line + description | First slide |
| 2 | **Title + bullets + side strip** | General content, with the side strip holding the source of the numbers |
| 3 | **3 number boxes** | Results · metrics · before-after |
| 4 | **Chart + explanation beside the chart** | Data slides |
| 5 | **Chapter divider**: solid main-colour fill, full slide (a dark deck may use a dark fill) | Starting a new section · giving the audience a break |
| 6 | **One statement in the middle of the slide** | The ask · conclusion · customer quote |

Side strip (layouts 2 and 4): put what the audience might ask: source of the numbers, how to read the chart, limits of the data. Not extra content.

Every slide has the same footer: section name on the left, page number on the right (so the audience can say "ขอย้อนกลับแผ่น 9").

## Text size

A 16:9 slide 13.333 inches wide = 960 pt = 1280 px in a browser. 1 px = 0.75 pt.

| Item | In the mockup | In the .pptx file |
|---|---|---|
| Cover title | 54 px | **40 pt** |
| Big number | 46 px | **34 pt** |
| Slide title | 34 px | **26 pt** |
| Bullet | 24 px | **18 pt** |
| Description | 22 px | **17 pt** |
| Side strip | 19 px | **14 pt** |
| Lead-in · label | 16 px | **12 pt** |
| Footer | 14 px | **11 pt** |
| Page margin | 64 px | **48 pt** (0.67 inch) |

Exception for the Stage deck: the "ตัวอย่าง" (example) line · the sub-text in a process table · Q/A under numbers may use 12–14 pt, because the audience reads them later. Slide titles, step names and the main gist stay at 18 pt or more.

18 pt is the smallest content size in a meeting room. If content does not fit at 18 pt, there is too much content: never reduce the size, cut content. 2 weights are enough (regular + bold): slide titles bold, body text not.

## Data slides

1 chart, 1 conclusion. If a chart says 2 things, split it into 2 slides.

- The slide title is the conclusion from the chart, not the chart's name
- Highlight the bar/line that is the point with the brand colour, and make the rest grey
- Put the numbers on the bars directly
- Remove gridlines, unnecessary axes and the legend if you can label the data directly
- Always state the data source: period, sample size, source (side strip or footer)
- A table over 5 rows by 4 columns should not be on a slide: make it a chart, or move it to an attachment

Chart colour palette: `diagrams` → `references/colour-by-domain.md` · for charts that must also be used with app screens, `ui-craft` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts).

## Thai on slides

- Line height at least 1.4 for slide titles and 1.5 for body text, because below that the upper and lower vowels of 2 lines collide (middle value in `human-writing` `references/thai-line-breaking.md`)
- For a long Thai slide title, break the line yourself where the thought ends: the program breaks mid-word because Thai has no spaces between words
- A font with both a real regular and a real bold weight: fake bold blurs the vowels
- Thai mixed with English on the same line: one font family that has both languages, otherwise letter heights differ and the line looks tilted
- Font settings in a real `.pptx` file (including the complex script problem): `document-design`

## Off-the-shelf look: avoid

- Things that make a deck look off-the-shelf: a colour line under the title of every slide · cream/beige background as the default · the same 3-column icons on every slide · gradient text · long centred paragraphs
- Flat decks: dark or all-white background across the whole deck when the source work is vividly coloured · the main colour appearing only as thin lines · more than 3 text-only slides in a row · colours not in the source work (fix in [`deck-theme`](deck-theme.md) item 3)

## Related skills

| Need | Use with |
|---|---|
| A single .html deck presented from a browser (menu · notes · clock · click for detail) | `html-slide-deck.md` |
| Convert .pptx to .html with animation · click-by-click reveal | `html-slide-deck.md` (`references/from-pptx.md`) |
| Spacing rules and eye order (app screens) | `ui-craft` (plugin `software-development`) |
| Content comes from a Software Requirements Specification (SRS) | `requirements-writing` (plugin `software-development`) |
| Cut content down to what is necessary | `superuser:ground-rules` |
| Brand colour and type system · illustration | `graphic-design:design-by-type` (plugin `software-development`) |


## reference: deck-theme.md

# Deck theme: bright, and fitted to the source work

The central file for every slide skill (`slide-deck` · `html-slide-deck.md` (including the entry from .pptx) · `StageDeck` in `document-design`). Open it at item 1 step 0, before opening the program.

> **The one rule:** the deck must look like it came from the source work, in both colour and mood. Someone who sees the deck next to the source document must know it is the same work.

## 1 · Colour comes from the source work first

"Source work" is what the user gave you to turn into a deck, such as a report .docx · .pdf · an existing .pptx · a website or app · a poster · a logo · a product photo. Find the colour in this order and stop at the first hit:

1. **If the source work has its own colours, extract them with the script**, not by eye:
   ```bash
   python scripts/source_palette.py <ไฟล์ต้นทาง> [โลโก้] [ภาพหน้าจอ]
   ```
   The script reports the main colour, up to 2 secondary colours, and whether the source background is dark or light, then prints values ready to put into `build_deck.py` · `StageDeck` · `pptx_to_html.py`. It reads .pptx .docx .xlsx .html .css .svg images and .pdf (needs `pdftoppm`). Colours it ignores: grey, white, black · the default Office theme (colours the author did not choose) · Word styles the content does not use · colours that appear fewer than 3 times or under 10% of the main colour
2. If the source has no colour (plain text · black-and-white documents), use the project's colour in the order in `diagrams` → `references/diagram-figures.md` item 5 (`doc-theme`, then the brand colour in code or the logo)
3. If there is still none, search for a reference per `design-gate/design-references`, type `slide`, with the work's keywords, then extract colours from the chosen work (the same script works on a screenshot of the reference)
4. If live search is not possible, use the house colour `#2A78D6` and write `(รอยืนยัน)` (to be confirmed) in the report

You must still open and look at the script result once: the main colour it gives must be one that people remember the work by (logo colour · cover colour). If it picked the colour of an illustration or a screenshot that happens to cover a large area, feed it the logo or cover file instead.

**Never invent a secondary colour.** The secondary colour must come from the source work. If the source has one colour, use one colour, and make it vivid with item 3 instead.

## 2 · Mood comes from the content

Start from the `เนื้อหา:` brief (gate item 0 of `design-gate/design-references`, file `references/content-to-theme.md`): its **อารมณ์** and **ธีม** pick the row below. That file holds the same table for every kind of work, plus what colours tend to carry.

Look at what the source work is about and who is listening, then choose from the table. Material used for visuals must come from that work's own world (real product photos · real screens · materials · signs of the trade), not ready-made icons.

| Content | Mood | Background | Shapes and images | Density |
|---|---|---|---|---|
| Sport · fitness · events · product launches | High energy | Light, but the cover and section openers are solid main colour | People or product photos cut to the edge · big numbers | Low, 1 point per slide |
| Children · education · training · community | Friendly | Light | Very rounded corners · secondary colour separates lesson sections · real photos from the classroom or event | Medium |
| Food · travel · shops · lifestyle | Makes you want to try | Warm light, or full-slide photo | Real photos covering half a slide or more · text on a solid colour band | Low |
| Medical · health | Trustworthy | Clean light | Slightly rounded corners · emphasise with the main colour one spot at a time · no frightening images | Medium |
| Finance · law · government · executives | Stable | Light | Straight lines · tables and charts are the stars · full-slide main colour only on the cover and conclusion slides | Medium to high |
| Software · technical · system demos | Clear and systematic | Follows the app's design (a dark app may use a dark background) | Real screenshots · system diagrams · short code | Medium |
| Research · theses · project defences | Credible | Light | Real result charts · main colour used to highlight the result that matters | Medium to high |
| Memorials · disasters · bad news | Calm | Light or light grey | No full-slide saturated colour · few images | Low |

If the work matches several rows, go by the audience (fitness but asking executives for money → the finance row, then add fitness images) · if it matches no row, choose the closest row and write a 1-line reason at the head of the work.

## 3 · What "bright" means on a slide

When the user says "สดใส" (bright) "น่าดู" (good to look at) "ไม่จืด" (not flat), or says nothing at all, do the following by default (`design-gate/no-ai-look` forbids ordering by free-floating adjectives, so this is turned into rules that can be checked):

1. **Light background by default.** Use a dark background only when the source work or app is dark (the script says `พื้นต้นทาง … (เข้ม)`)
2. **Full-slide main colour** on the cover, section openers and closing page · `build_deck.py --theme bright` does all 3 types (`.hero` `.divider` `.close`) · `StageDeck(block=True)` does the cover and chapter dividers (no separate closing page) · content pages use a light background, with cards tinted faintly with the main colour
   - **Logos on solid-colour pages use a pure white or pure black version** to match that page's text colour, because a logo the same colour as the background, or close to it, disappears · if you only have a coloured logo, place it on a white rounded box, or move the logo to the first content page
3. **Secondary colour from the source** (if any) separates sections, for example section 2's opener is fully the secondary colour, or it emphasises numbers whose meaning differs from the main colour · the whole deck has at most 3 colours plus status colours
4. **Real images in at least 1 of every 3 slides.** Images from the source work, screenshots, product photos, or images made per `image-generation` · no more than 3 text-only slides in a row
5. **No layout repeated more than 2 slides in a row** (`design-gate/no-ai-look` item 3.2 item 5)
6. **Never use vividness in place of readability.** Text of every size on a solid colour must reach ≥ 4.5:1 · `build_deck.py --theme bright` and `StageDeck(block=True)` choose for you: white when white reaches 4.5:1; if not, near-black (for example on yellow); and if near-black still falls short, pure black (for example on orange, teal and the house blue) · you must still open every slide image and check per item 7 of `slide-deck`

Do not count as vividness, and still forbidden per `design-gate/no-ai-look`: purple-blue gradients · gradient text · neon or glow · several pastel colours not in the source work · decorative icons on every card · every animation

Work in the "stable" and "calm" rows of item 2 uses only items 1 2 4 5 6 · use item 3 when the source really has a secondary colour, and full-slide main colour is left only on the cover and closing page.

## 4 · Put it into the tools

| Tool | What to put in |
|---|---|
| `html-slide-deck.md` | `build_deck.py … --theme bright --brand <main colour>,<light colour>,<secondary colour>` · pages that use the secondary colour full-slide get `data-tone="2"` on `<section>` · a dark source background uses `--theme dark` |
| `StageDeck` (.pptx) | `StageDeck(accent="<main colour>", bg="FFFFFF", block=True)` when the background is light (`block=True` makes the cover and chapter dividers solid full-slide main colour) · the secondary colour is used for figures and charts passed in (`diagrams` `#accent=`) |
| `html-slide-deck.md` entry from .pptx | The look comes from the .pptx · make the .pptx per this file first, then `--accent <main colour>` |
| Diagram figures in the deck | `diagrams` with `#accent=<main colour>&bg=<deck background colour>` |

## 5 · Check before sending

- [ ] Place the deck thumbnails next to the source work: the main colours match and it is clearly the same work
- [ ] Every colour in the deck comes from the source work or the order in item 1 · the report says which file
- [ ] The mood matches a row in item 2 and the reason is written at the head of the work
- [ ] Item 3 is complete: background follows the source · full-slide main colour on section-change pages · real images ≥ 1 in 3 · no more than 3 text-only slides in a row
- [ ] `check_deck.py` or `check_html_deck.py` reports 0 problems, then open `sheet-*.png` and look at every slide


## reference: from-pptx.md

# Entry from .pptx → .html

An extension of [`SKILL.md`](html-slide-deck.md) · use it when a .pptx already exists, or when you must deliver both .pptx and .html from one source · the `scripts/` and `assets/` paths in this file count from the `slide-deck/` folder · this route uses the scripts `pptx_to_html.py` `check_html_deck.py` `click_steps.py` and does not use `build_deck.py`

> **One rule of this route:** the look comes entirely from the .pptx · fix the .pptx and convert again, never edit a converted .html.


The model is the Independent Study (IS) presentation deck "Few-shot Key Information Extraction (KIE) · Confidence-Gated Cascade" (41 slides + 15 interactive pages): finish the .pptx first, then convert it into one .html file where every piece slides in one row at a time, with a progress bar, table of contents, speaker notes and a clock, in the style of the X Fitness deck.

## When to use

- A .pptx already exists (made by hand in PowerPoint · `StageDeck` · `BrandDeck` · received from a customer) and you want to present it with browser animation
- You must deliver both .pptx (for people to keep editing) and .html (opens on any machine) from one source
- You want to add interactive pages (type a number and calculate · play step by step) between the PowerPoint pages

## 1 · Steps

1. **Finish the .pptx first** — colours and mood come from the source work, following `presentation-design.md` [`references/deck-theme.md`](../../slide-deck/references/deck-theme.md) (extract colours with `slide-deck/scripts/source_palette.py` · light background is the default · section-divider slides are a full sheet of the main colour, which `StageDeck(..., block=True)` does) · if the source work has no colours and no look yet → **search for a model first:** take the project's words and search live following `design-gate/design-references` (plugin `superuser`) type `slide`, then extract colours from the chosen work · the stored palette library is for when a live search is not possible · no .pptx → build one with `document-design` (`StageDeck`) · the slide title goes in the title placeholder (it becomes the name in the table of contents) · put speaker notes in notes · split into parts with PowerPoint Sections (they become groups in the table of contents)
2. **Steps you want to open one click at a time** — in PowerPoint add On Click animation · when building with python, use `scripts/click_steps.py`:
   ```python
   from click_steps import add_click_steps
   add_click_steps(slide, [[box1, label1], [arrow, box2], [box3]])   # 3 steps · PowerPoint plays it the same way
   ```
3. **Convert:**
   ```bash
   python scripts/pptx_to_html.py docs/<PRJ>-DECK-v1.0-DRAFT.pptx -o docs/<PRJ>-DECK-v1.0-DRAFT.html --title "<deck title>" --accent <project main colour, none → 2A78D6>
   ```
   `--accent` = colour of the progress bar and buttons (omitted = the theme's accent1) · images are embedded for you · a line `⚠ แปลงไม่ครบ` (conversion incomplete) must be fixed in the .pptx (step 4)
4. **Check:** `python scripts/check_html_deck.py docs/<file>.html --out _to_delete/deck-check --pptx docs/<file>.pptx` → fix until **0 problems**, then **open every `sheet-*.png` and look at each sheet**
5. Rehearse 1 round with the clock (press T) · press → to step through every step to the end

## 2 · What converts to what

| In .pptx | In .html | Entrance |
|---|---|---|
| Title (placeholder) | Text · name in the table of contents | Shoots in from the left (the cover floats up) |
| Text box · text in a shape | Position, size, colour, font, alignment, bullets, line spacing as in the source | Floats up |
| Rectangle · rounded · oval · donut · diamond · arrow · chevron · hexagon | Box / SVG | Bounce · an oval has a rippling ring |
| Line · connector (straight and elbow) · arrowhead · dashed line | SVG | Drawn along the direction of the line |
| Picture (including crops) | Embedded as base64 | Bounce |
| Table (including merged cells · table style derived from accent1) | `<table>` | Appears one row at a time |
| Column/bar · line · pie · donut charts | SVG redrawn from the data in the chart | Bars grow · values pop up after |
| Big number ≥ 22 pt such as `88.1%` `1,244` | — | Counts up from 0 |
| Group (any depth of nesting) | Broken into pieces, exact coordinates | Follows the pieces |
| On Click animation | `data-step` | A step of the page's player · ↓ opens one step at a time · Space plays by itself |
| notes · Section · slide/layout/master background | `<aside>` (press N) · group in the table of contents (press M) · background | — |

Entry order: upper rows before lower rows, pieces in the same row enter together, and text in a box enters 0.35 beat after the box · turns itself off when the machine is set to reduced motion

**Cannot convert** (lines marked `⚠` during conversion · fix in the .pptx):
- A hatched warning box appears in place of that piece: SmartArt → break into shapes (Convert to Shapes) · video, audio · area chart · scatter · a chart whose data cannot be read
- Converted in a simplified way: combo chart (shows only the first type) · unusual shapes (drawn as a rectangle) · vertical text (shown horizontally)
- Not converted and no warning: shadows · 3D · text outline · transitions between slides

## 3 · Keys of the .html (added for you)

| Key | What it does |
|---|---|
| ← → · PageUp PageDown · click the left or right edge · swipe the screen | Changes page only, does not touch the steps in the page |
| Space | Play / stop the player of that page (opens the next step by itself every 1.6 seconds, stops at the last step) · does nothing on a page with no steps |
| ↓ · ↑ | Next step · previous step |
| Change page | The player returns to step 0 and stops every time, both going forward and going back |
| M · N · T · F · R | Table of contents · notes · clock · full screen · replay animation |
| P | Plays the whole deck by itself every 2.6 seconds (every step, then the next page) |
| `#12` at the end of the URL · bottom bar | Opens at page 12 · point to see the page name, click to jump |

## 4 · Interactive pages (insert by hand)

Pages PowerPoint cannot do (type a value and calculate · try changing rules · walk through a document step by step) are written as HTML and inserted between pages:

```bash
python scripts/pptx_to_html.py deck.pptx -o deck.html --insert 9:demo/flow.html --insert 28:demo/try-rules.html
```

- Copy `assets/interactive-page.html` as a starting point · 1 file can hold several pages as `<section class="slide" data-menu="▶ ลองเอง · …">` plus its own `<style>` and `<script>`
- Coordinates are px on a 1920 stage · use the same `class="s"` + `data-a` + `--k` + `data-step` as the converted pages, so pieces enter and step back the same way
- Start ids and classes with the page name (`ip-`) to avoid clashing with other pages · typing in an input field does not change the page (the runtime handles it)
- Numbers on an interactive page come from the real results of the work, and the source is stated in the page's foot

## 5 · Check before sending

- [ ] `pptx_to_html.py` prints no `⚠ แปลงไม่ครบ` line, or you know what each line is and accept it
- [ ] `check_html_deck.py --pptx` shows 0 problems · page and step counts match the .pptx · pressing ↓ through every step and → through every page reaches the end of the deck · entering a new page puts the player at step 0
- [ ] Open `sheet-*.png` and compare every sheet with the .pptx: text does not overlap · Thai fonts are not distorted · chart values match
- [ ] The fonts in the .pptx exist on the machine that will present (if not → use Tahoma / Leelawadee UI instead, text may grow longer and overflow the box)
- [ ] Every page has notes · no real customer data in the file
- [ ] Speaker notes in `<aside>` are written the way they are really spoken: use ครับ/ค่ะ and ก็ freely, not document language

## 6 · Anti-patterns

- **Editing a converted .html** — it is lost on the next conversion · fix the .pptx or the `--insert` file and convert again
- **Making every piece On Click** — the audience must click hundreds of times · use steps only when telling a sequence (system steps · revealing an answer)
- **Text packed to fill the box exactly** — a font on another machine that is slightly wider will overflow · leave 10% free space in the box
- **A chart as a picture** — after conversion it has no animation and its values cannot be edited · use PowerPoint's own chart

Before sending, go through the section "Not looking AI-made" (`ไม่ให้ดูเหมือน AI ทำ`) at the end of [`SKILL.md`](html-slide-deck.md), the same as for a deck written directly.


## reference: html-slide-deck.md

<!-- merged from skill `html-slide-deck` on 2026-11-27 · description was: Use when the deck must be HTML or animated, or pptx as HTML -->
# HTML Slide Deck — one .html file that opens in a browser and presents at once

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the deck is **one** .html file. Images embedded in the file · slide titles are conclusions · every page passes `check_deck.py` before sending. Story structure and slide titles come from `presentation-design.md`; this skill covers how it is built and looks.

## Use when
- Presenting a project · system demo · executive summary from the presenter's own machine.
- Viewers should click and see details themselves (files, code, test results), which PowerPoint cannot do.
- The deck is sent by email or chat and must open anywhere with nothing installed.
- A .pptx already exists, or .pptx and .html with the same look must come from one source (click-by-click animation · notes · table of contents) → read [`from-pptx.md`](from-pptx.md) instead of step 2; fix the .pptx and convert again, never edit the converted .html.

Not for: "make a slide deck" with no mention of html, or the customer needs a .pptx to edit → `document-design` · `StageDeck` (file-type rules in `presentation-design.md`) · no story structure yet → `presentation-design.md` steps 1–3 first · companion .docx report → `document-design`.

## Steps
1. Write the story structure per `presentation-design.md`: every slide title is a conclusion · sections · time per page.
2. If the project already has `docs/deck/` or an .html deck, add `<section>` to the existing `slides.html` and use the same shell · css · `--brand`; do not start a new file (same principle as `ui-craft` step 0). Otherwise copy `assets/slides-example.html` to the project's `docs/deck/slides.html`, keep only the `<section>` of the layouts you use and fill in the content. Layout classes: [`layouts-and-shell.md`](layouts-and-shell.md).
3. Choose the direction before building. It comes from `presentation-design.md` step 1, stage 0 (order: source work → project's own design → attached reference → live search per `design-gate/design-references` type `slide` → house defaults, only when there is no information at all). Extract colors from the source with `slide-deck/scripts/source_palette.py <source file>`; if the source has none, use the order in `diagrams` → `references/diagram-figures.md` step 5; if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`), write `(รอยืนยัน)` in the report and carry on. Never copy colors from the example table in the theme reference. Use `--theme bright` for every new deck unless the source work has a dark background (then `dark`, the default when omitted). Use one main color plus at most 2 secondary colors from the source; green `ok`, blue `blue`, orange `warn` only for pass · info · warning. Theme, tokens, fonts and contrast numbers: [`theme.md`](theme.md).
4. Build the file:
   ```bash
   python scripts/build_deck.py docs/deck/slides.html -o docs/<PRJ>-DECK-v1.0-DRAFT.html \
          --title "<ชื่อเด็ค>" --theme bright --brand <สีหลัก>,<สีสว่าง>,<สีรอง>
   ```
   `--css` / `--js` for things specific to this deck · `--data` passes JSON for extra JS · images referenced by a local path are embedded automatically · give a secondary color only when the source really has one · a page needing a full-bleed secondary color gets `data-tone="2"` on its `<section>`. For data that changes often (test results, numbers), the project's script reads the real result file and writes it into `slides.html` or `--data`; never type numbers by hand.
5. Check: `python scripts/check_deck.py docs/<ไฟล์>.html --out _to_delete/deck-check` → fix until **0 problems**, then open every `sheet-*.png` and look.
6. Rehearse once with the clock (T for the clock · S for the speaker window). A page over 30 seconds turns the clock a different color → cut that page's content.
7. Animation is off by default. Put `data-anim` on a `<section>` only where motion helps the eye follow the story (a system map whose arrows must be drawn in order · section openers); `data-count` · `data-loop` · `.bars` · `data-chat` work only where set; `data-count` on 1 number to remember, not every card. Add no animation that does not help; shell keys and animation table: [`layouts-and-shell.md`](layouts-and-shell.md).

Look rules:
- Slide margin 128 px left and right · content stays out of the bottom 120 px band (the foot).
- Text no smaller than 16 px on a 1920 stage · body 24–32 px · slide title 56 px, at most 2 lines.
- 1 page, 1 conclusion · long details go in a `<template>` for click-to-view.
- Speaker notes in `<aside>` are spoken language: use ครับ/ค่ะ and ก็, not document language.
- A real screenshot beats a drawing · width ≥ 1600 px before shrinking · no stock images · never link images from the web.
- Every number states its source in the foot (`qa/results/…` · test date) · every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>`.
- Keep a replayed chat (`data-chat`) from real test results as the backup for any live demo.
- A system diagram too complex for `.map` → `diagrams`, embedded as an image.

## Check before done
- [ ] `check_deck.py` shows 0 problems (page taller than 1080 · overflow · overlap with the bottom bar · box overflow · small text · broken image), measured in a real browser.
- [ ] Every `sheet-*.png` opened: one brand color · no half-empty page · slide titles read in sequence make a story.
- [ ] File opens with the network off: all images show, fallback fonts readable.
- [ ] Every page has an `<aside>` of speaker notes, and `data-at` times add up to no more than the time given.
- [ ] No personal data or real customer data (use mock data and say so in the foot).
- [ ] Edited `slides.html` and rebuilt, never the built .html · `design-gate/no-ai-look` item 3 passed (HTML work runs its script and the eye gate 3.2; 0 script findings is not yet a pass).

## References
- [`layouts-and-shell.md`](layouts-and-shell.md) — open when choosing layouts, or to see shell keys and animation
- [`theme.md`](theme.md) — open when picking `--theme` / `--brand`, fonts, or checking contrast
- [`from-pptx.md`](from-pptx.md) — open when a .pptx exists


## reference: layouts-and-shell.md

# Layouts, shell keys and animation · html-slide-deck

Open when choosing layouts for `slides.html`, or when you need to know what the shell already does.

## Layouts (all are in `slides-example.html`)

The look of the first 4 pages built with `build_deck.py` is in `assets/slides-example-preview.webp`.

| # | Layout | class / attribute | Use when |
|---|---|---|---|
| 1 | Cover | `.slide.hero` · `h1` · `.rule` · `.lead` | First page: title + the one sentence to remember |
| 2 | Person/option cards | `.row` > `.card.grow` | Team · compare 2–3 things |
| 3 | Clickable table of contents | `.toc` > `a[data-goto]` · `.p` page numbers filled in by hand | Decks over 12 pages |
| 4 | Section opener | `.slide.divider` · `.num` · `data-part` | Start of every section (the menu groups by `data-part`) |
| 5 | Big numbers | `.card` > `.big[data-count]` | 1–4 numbers to remember (count up on entering the page) |
| 6 | Table | `table.tbl` · `td.m` = code font | Technology · comparison ≤ 8 rows |
| 7 | System diagram + step-by-step tour | `.map` > `svg` arrows (`id`) + `.box` · `.layer` (`data-key`) · `ol.tour-steps` > `li[data-on][data-path]` + `div.tourbar` | Who connects to what, then press ▶ to walk the path of 1 request (place positions in px in a 1664-wide frame) |
| 8 | Click for details | `[data-pick="g"]` + `<template>` · panel `#d-g` | Files · rules · cases with long details |
| 9 | Code | `pre.code` · `<em>` key word · `<i>` comment | Core code ≤ 12 lines |
| 10 | Chat demo | `.phone` > `.chatlog[data-chat]` > `p[data-u]` / `p[data-a]` | A replayed chat typed one character at a time on entering the page |
| 11 | Step-by-step looping highlight | `[data-loop]` | 3–6 steps you want the eye to follow |
| 12 | Bar chart | `.bars` > `div[data-v][data-l][data-c]` | Per-item results · response time |
| 13 | Closing | `.slide.close` | 1-sentence summary + thanks · Q&A |

Every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>` · page numbers fill in by themselves.

## What the shell does for you (no need to write it yourself)

| Key | What it does |
|---|---|
| ← → · PageUp PageDown · click left/right edge · swipe | Change page only, never touches the player on the page |
| Space | Play / pause the player on that page (diagram tour) · does nothing on pages with no player |
| ↓ · ↑ | Next step · previous step of the player |
| M | Menu of all pages, grouped by `data-part` |
| N | Speaker notes from the page's `<aside>` |
| T | Clock start/stop · shows "time used / `data-at`" |
| S | Speaker window (open on the laptop screen, the projector opens the same file): this page + next page · speaker notes · time used / `data-at` · clock — press a button in that window and the projector follows (idea from lewislulu/html-ppt-skill (MIT)) |
| F | Full screen |
| Bottom bar | 1 cell per page · hover to see the page name · click to jump |
| `#12` at the end of the URL | Opens at page 12 · `[data-goto="id"]` jumps to the page with that id |
| Click `img.shot` | Enlarge to full screen |

## Animation (switch on per page — the default is still)

Content sliding up piece by piece on every page, numbers counting up, and glow that loops forever are AI signals in `design-gate/no-ai-look`, so the shell does not add them to every page: put `data-anim` on the `<section>` only for pages where motion helps the eye follow the story (a system map where arrows must be drawn in order · section openers). `data-count` · `data-loop` · `.bars` · `data-chat` work only on the pieces where they are set.

| What happens | Where |
|---|---|
| Content slides up piece by piece, 70 ms per piece (pages with `data-anim`) | Children of the page · `.row` `.list` `.toc` `.pills` · `.tbl` rows |
| Section-opener page number flies in from the left (pages with `data-anim`) | `.divider .num` |
| Boxes pop up · arrows draw line by line (pages with `data-anim`) | `.box` `.layer` · `.map svg>path` |
| Number counts up from 0 — use on only 1 number to remember, not on every card | `[data-count="10"]` or `"9/10"` |
| Chart bars grow | `.bars` |
| Looping step highlight (the glow around blinks once per step, does not loop forever) | `[data-loop]` |
| Diagram tour (player): box lights up, arrow changes color, a dot runs along the line · press Space and it advances by itself every 3.2 seconds | `ol.tour-steps` + `.tourbar` |
| Chat typed one character at a time with a "typing" dot | `[data-chat]` |

Everything replays every time the page is entered · the player returns to the starting step and stops on every page change · turns itself off when the machine is set to reduced motion · add no animation that does not help the eye follow the story.


## reference: presentation-design.md

<!-- merged from skill `presentation-design` on 2026-11-27 · description was: Use when planning a slide deck story and layouts -->
# Presentation Design — slide deck story, layouts, and checks

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `design-gate/no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for this piece's structure). Close the work with a line `ด่านก่อนลงมือ:`.

> **One rule:** a slide title is a **conclusion**, not a **topic name**. If the audience reads only the titles and understands the whole story, the deck is usable.

## Use when
- Making a deck: client proposal · business plan · research summary · progress report · training · design review
- Reviewing a deck someone else made, or converting a long document into a deck
- Not for: a real `.pptx` file (python-pptx, fonts, cover) → `document-design` · chart palette → `diagrams` (`colour-by-domain.md`) · diagrams on a slide → `diagrams` · a document read alone → `design-gate/polished-document-style` + `document-design` (a deck sent to be read alone is a document: make a deck for speaking and attach a document)

## Steps
1. **Choose the delivered file.** Do not ask which type: not stated = .pptx · at the end say in 1 line that an .html version with animation is possible.

   | User asks | Gets | Use |
   |---|---|---|
   | "ทำ slide deck" · "ทำสไลด์" · "ทำ presentation" (type not stated) | **.pptx** | `document-design` · `StageDeck` |
   | "slide deck html" · "เด็ค html" · "มี animation" · "นำเสนอจากเบราว์เซอร์" | One .html file with animation | `html-slide-deck.md` |
   | Has a .pptx · "แปลง pptx เป็น html" · "animation แบบเด็ค IS" · wants interactive pages or click-by-click reveal | One .html that looks like the .pptx on every page | `html-slide-deck.md` (`from-pptx.md`) |
   | Both | .pptx + .html from one source | Build the .pptx with `StageDeck`, then convert with the .pptx entry of `html-slide-deck.md` |

2. **Research only what is missing.** If the deck cites facts, numbers, a market, or competitors, collect them with sources per `research-with-sources` (plugin `superuser`) before writing titles: a conclusion title must stand on real facts, not memory.
3. **Take the theme from the source work, for every deck.** Run `python scripts/source_palette.py <source file>` on the file, logo, or website the user gave, then choose the mood from the table in [`deck-theme`](deck-theme.md) item 2 · if the source has no colour, use the project's colour per `diagrams` → `references/diagram-figures.md` item 5 · light background by default, section-change pages full-slide main colour · only when live search is really impossible, use the house colour `#2A78D6` and write `(รอยืนยัน)` · if the work already has colours, do not pick new ones. Write a head-of-work line: which file the colour came from · which mood row · light or dark.
4. **Choose the visual direction, stopping at the first hit:** the source work → the design the project already has → a reference the user attached → research (search live per `design-gate/design-references`, type `slide`, then extract colours from the chosen work; pick 2–3 decks of the same kind and choose light or dark · font · density · image style; write a 1-line reason with sources) → the house default "Stage" (`document-design` · `brandkit_stage.py`). Stage is the fallback when there is no information at all, not the answer for every deck: two decks for different work look different. If the source, project, or user reference supplies colour and fonts, search only for page structure and storytelling. The direction belongs to this deck alone: do not reuse the last deck's without checking the work differs. Render diagram figures with the deck's background colour (`#bg=`).
5. **Write every slide title as plain text, one line per slide.** Read them in order; if they do not form one story, reorder now (much cheaper than later), then cut slides that do not move the story. This step takes under 20 minutes and decides good or bad. Order by purpose: [`deck-details.md`](deck-details.md). For executives, put the conclusion on slide 1.
6. **Choose a layout per slide** from the 6 in the reference, then put in content and trim to the budget. Every slide has the same footer: section name left, page number right.
7. **Budget per slide, counted in lines on the real slide** (Thai words cannot be counted): title at most 2 lines · at most 6 bullets · at most 2 lines per bullet · bullets are gist, not full sentences. If over, cut whole bullets or move them to the next slide. Never cut function words (จะ ให้ ก็ แล้ว, polite words) to fit; cut items.
8. **Text size.** Smallest content text 18 pt (40 cover · 26 title · 18 bullet in .pptx; table and the Stage-deck exception in the reference). If content does not fit at 18 pt, cut content; never shrink text. 2 weights only; titles bold, body not.
9. **Data slides:** 1 chart, 1 conclusion (a chart saying 2 things becomes 2 slides) · the title is the conclusion · highlight the point in the brand colour and grey the rest · numbers on bars, no gridlines or legend if data can be labelled · state period, sample size, and source · a table over 5 rows by 4 columns becomes a chart or an attachment.
10. **Thai type:** line height at least 1.4 for titles and 1.5 for body · break long Thai titles yourself where the thought ends · a font with real regular and bold · one family for Thai and English on a line (details in the reference).
11. **Render and view the whole deck as thumbnails**, then run the checks below. Before sending, go through item 3 of `design-gate/no-ai-look` (for HTML work run its script; the eye gate 3.2 must also pass, and web pages answer items 10–14).

## Check before done
- Reading only the titles gives the whole story · every title is a conclusion
- No slide visibly denser than the others · margins and title position match on every slide
- Three-metre test: at 25% size the title is still readable
- At most 6 bullets, each at most 2 lines · smallest content text at least 18 pt
- Every chart has a conclusion and a data source · every slide has a page number
- Opened once on the real projector or screen
- The list of 13 anti-patterns checked ([`anti-patterns.md`](anti-patterns.md))
- The line `ด่านก่อนลงมือ:` closes the work

## References
- [`deck-details.md`](deck-details.md) — open when ordering the story, choosing a layout, setting text sizes, building a data slide, or setting Thai type
- [`deck-theme.md`](deck-theme.md) — open for colours and mood (central file for every slide skill)
- [`anti-patterns.md`](anti-patterns.md) — open when checking the work


## reference: theme.md

# Theme, tokens and house defaults · html-slide-deck

Open when picking `--theme` and `--brand`, adjusting fonts, or checking contrast.

The look of the house defaults comes from the X Fitness pitch deck (45 slides, 10 minutes). It is an example of the house direction only, not a mold for every deck: dark background with a single brand color · big-number section openers · number cards · system diagram · click to see the real file · chat in a phone frame · test result chart.

## Direction

The visual direction always comes from `presentation-design.md` step 1, stage 0; rules on color and mood are in [deck-theme](../../slide-deck/references/deck-theme.md). Selection order: the source work the deck is made from → the design the project already has → a reference the user attached → a reference searched live per `design-gate/design-references` (plugin `superuser`) type `slide` → house defaults. House defaults are a fallback for when there is no information at all, not a rule. Two decks for different jobs should look different.

## `--theme`

| `--theme` | Look | Use when |
|---|---|---|
| `bright` | White background, cards tinted faintly with the main color · cover, section openers and closing page are full-bleed solid main color · accent colors are adjusted to read at 4.5:1 · text on solid backgrounds is white when white gives ≥ 4.5:1; if not, near-black; if still short, pure black | Every new deck, unless the source work has a dark background |
| `dark` (the default when omitted) | Dark background, dark gradient cover | Source work or app that has a dark background · old decks already built (without `--theme` the look stays the same) |

- `--brand main,accent,secondary` · the accent color is used for big numbers and the kicker (theme `bright` darkens it automatically until it reads on a card) · give a secondary color only when the source work really has one · a page that needs a full-bleed secondary color gets `data-tone="2"` on its `<section>` (works with theme `bright`).
- Fonts can be changed in the `--css` file by choosing a family that has both Thai and English and a real bold (rule in `presentation-design.md` step 8) · then open `sheet-*.png` and check contrast on every sheet.

## Deck colors = colors of the source work

Extract colors with `slide-deck/scripts/source_palette.py <source file>` · if the source has no colors, use the order in `diagrams` → `references/diagram-figures.md` step 5 · if still nothing, use colors extracted from references of type `slide` · if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`, the house default), write `(รอยืนยัน)` in the report, and carry on · never copy colors from the example table below.

| token | Example value (the reference deck — not a default) | Used for |
|---|---|---|
| `--accent` | `#e10613` | Bar under the cover title · user chat bubble |
| `--accent2` | `#ff2536` | kicker · big numbers · section-opener page number · the selected item |
| `--accent-deep` · `--accent-tint` | `#2a0a0d` · `#1d0d10` | Gradient background of cover/section opener · background of the selected item |
| `--bg` · `--panel` · `--line` | `#09090a` · `#16161a` · `#2a2a30` | Background · card · line — do not change with `--brand` · a dark background is the shell's default (dark presentation room, screenshots and diagrams stand out), not a requirement (a deck converted from .pptx uses the .pptx background, see [from-pptx.md](from-pptx.md)) |

- The table holds the values of theme `dark` · `--brand` computes deep/tint for you · in theme `dark` the bright color must read clearly on the dark background by itself (contrast ≥ 4.5:1), while for `bright` the script adjusts it.
- **Where the house contrast numbers come from:** the house bright color `5B9BE6` reads on a dark background (6.9:1) but only 2.89:1 on white, so it must change to `--brand 2A78D6,1F5FAF` (the second color on white is 6.34:1 · the main color `2A78D6` gets 4.42:1, so use it for bars, lines or large text, not small text · computed with the WCAG formula 2026-10-26).
- House fonts (when no other direction): headings **Chakra Petch** · body **IBM Plex Sans Thai** · code **JetBrains Mono** (Google Fonts · offline → Tahoma) · if the deck's direction sets other fonts → use those (Thai + English in one family, real bold).
- **One main color plus at most 2 secondary colors from the source work** · green `ok`, blue `blue`, orange `warn` are used only for their meaning (pass · info · warning).
