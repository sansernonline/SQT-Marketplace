# skill: presentation-design

Use when planning a slide deck story and layouts

# Presentation Design

> **Pre-work gate (every time):** read the owner's theme → search live for a reference → 3 genuinely different directions → check `no-ai-look` before sending. Follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for finding this piece's structure). Close the work with a line `ด่านก่อนลงมือ:` (pre-work gate:).

> **Language:** write every line of wording per `human-writing`. This skill gives the format and structure; human-writing gives the way to write so people understand.

> **The one rule of this skill:** a slide title must be a **conclusion**, not a **topic name**.
> If the audience reads only the slide titles of every slide and understands the whole story, the deck is usable.

---

> **The deck must be bright and look like it came from the source work.** Extract colours from the source work (the file, logo or website the user gave) with `scripts/source_palette.py` first · if the source has no colour, use the project's colour per `diagram-figures` item 5 · choose the deck's mood from the content · light background by default, and section-change pages are full-slide main colour · all rules are in [`deck-theme`](references/deck-theme.md), the central file for every slide skill · only when live search is really not possible, use the house colour `#2A78D6` and write `(รอยืนยัน)` (to be confirmed) · if the work already has colours, do not pick new colours for the deck.
>
> **Delivered file: the models are the X Fitness Chatbot deck and the IS "Few-shot KIE" deck (.pptx converted to .html)**
>
> | User asks | Gets file | Use |
> |---|---|---|
> | "ทำ slide deck" · "ทำสไลด์" · "ทำ presentation" (type not stated) | **.pptx** | `branded-document-design` · `StageDeck` |
> | "slide deck html" · "เด็ค html" · "มี animation" · "นำเสนอจากเบราว์เซอร์" | **One .html file with animation** | `html-slide-deck` |
> | Already has a .pptx · "แปลง pptx เป็น html" · "animation แบบเด็ค IS" · has a .pptx and wants interactive pages or click-by-click reveal | **One .html file that looks like the .pptx on every page** | `html-slide-deck` (`references/from-pptx.md`) |
> | Asks for both | .pptx + .html from one source | Build the .pptx with `StageDeck`, then convert it with the .pptx entry of `html-slide-deck`. The look matches on every page; edit the .pptx in one place |
>
> Do not ask again which type they want: not stated = .pptx · at the end of the answer, say in 1 line that an .html version with animation is possible too
>
> **Choose the deck's style in this order and stop at the first hit:** the source work being turned into a deck → the design the project already has → a reference the user attached → direction from research (item 1 step 0) → the house default "Stage" (`branded-document-design` · `brandkit_stage.py`). **Stage is the fallback when there is no information at all, not the answer for every deck.** Two decks for different work should look different. Page structure and the text budget still follow this skill, while background colour · fonts · density · image style change with the chosen direction. Diagram figures from `diagram-figures` are rendered with the same background colour as the deck (`#bg=`)

## When to use this skill

- Making a presentation deck: client proposal · business plan · research summary · progress report · training · design review
- Reviewing a deck someone else made
- Converting a long document into a deck

## When **not** to use

| Task | Use this instead |
|---|---|
| Creating a real `.pptx` file (python-pptx, fonts, cover page) | `branded-document-design` |
| Chart colour palette | `diagram-figures` → `references/colour-by-domain.md` (app screens: `web-app-design` in plugin `software-development` → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts)) |
| A document read alone, with no one speaking | `polished-document-style` + `branded-document-design` |
| Diagrams, processes or architecture on a slide | `diagram-figures` (for software, `software-diagrams` (plugin `software-development`) works too) |

> **A deck sent to be read alone is not a deck.** It is a document; make it a document.
> If you must do both, make a deck for speaking and attach a separate document. Do not stuff everything onto slides.

---

## 1 · Work order: research first, then write the story before opening the program

0. **2 kinds of research, done only for what is missing, not for every deck**
   - **Content.** The deck must cite facts, numbers, a market, competitors, or something we are not strong in → collect facts with sources per `research-with-sources` (plugin `superuser`) before writing slide titles · a slide title that is a conclusion must stand on real facts, not the model's memory
   - **Theme from the source work.** Do this for every deck: run `python scripts/source_palette.py <source file>` to get colours, then choose the mood from the table in [`deck-theme`](references/deck-theme.md) item 2 · write the head-of-work line: which file the colour came from · which mood row · light or dark background
   - **Visual direction.** Search for every deck per the pre-work gate · if the source work has colours, the project has a design, or the user attached a reference → use that for colour and fonts, and search only for page structure and storytelling · if there is nothing at all → **search for a reference first:** take the project's words and search live per `design-references` (plugin `superuser`), type `slide`, then extract colours from the chosen work · the stored colour library is used when live search is not possible · pick 2–3 decks of the same kind of work (pitches in the same field · events on the same stage · competitors') and choose 1 direction: light or dark background · font · density · image style · write a 1-line reason with the sources you looked at at the head of the work. **This direction belongs to this deck alone, not a permanent value.** The next deck must not start from the previous deck's direction without checking whether the work differs
1. **Write every slide title as plain text first**, one line per slide
2. **Read them all in order.** If they do not yet form one story, reorder here, because it is much cheaper than reordering later
3. **Cut slides that do not move the story forward**
4. **Choose a layout for each slide** from item 4
5. **Put in content,** then trim bullets to fit the line budget in item 3
6. **Render and view as thumbnails of the whole deck** per item 7

Steps 1–3 take under 20 minutes and decide whether the deck is good or bad.
Most people skip them and open the program straight away, then waste time laying out a story that is still in the wrong order.

---

## 2 · Order the story by purpose

**First ask what this deck needs from the audience,** then choose the order

| Purpose | Order |
|---|---|
| **Ask for approval / a decision** | Conclusion and the ask → 3 reasons → alternatives considered → risks → the ask again |
| **Progress report** | Overall status (green/yellow/red) → what is done → what is blocked and what is needed from whom → next period's plan |
| **Review a plan or design** | Problem solved → constraints → chosen design → why others were not chosen → points where you want opinions |
| **Training** | What they can do after learning → concepts → demo → let them try → summary and what to study next |
| **Selling work** | Customer's problem (in their words) → results they will get → our method → evidence → price and next step |

**For executives: the conclusion goes on the first slide,** not the last.
They may have only the first 5 minutes, and may decide on the spot if the information is enough.

---

## 3 · One slide, one idea

### The slide title is the conclusion

```
ผิด: ผลการวิเคราะห์เวลาดำเนินการ
ถูก: ขั้นอนุมัติกินเวลาสองในสามของทั้งหมด

ผิด: สถานะโครงการ
ถูก: ส่งทันกำหนด ยกเว้นงานเชื่อมระบบบัญชีที่ช้า 1 สัปดาห์
```

A slide title may run up to 2 lines. **Do not shorten it into a topic name,** and do not shorten it until it reads badly: a title with 2 parts needs a connector, use phrases people actually say, and choose words by who is listening (full rules in `human-writing` item 6)

```
ผิด: ทุกข้อความผ่าน 8 ขั้น: Artificial Intelligence (AI) ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ
ถูก: ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน
```

### Budget per slide, counted in lines

| Item | At most |
|---|---|
| Slide title | 2 lines |
| Bullets | 6 items |
| Lines per bullet | 2 lines |

Thai words cannot be counted, so count lines on the real slide instead.

**If over budget, cut whole bullets or move them to the next slide,** because slides cost nothing per page; speaking time is what is limited · **never cut function words** (จะ ให้ ก็ แล้ว, polite words) to make a line fit; cut only items (the rule "cut items, not function words" is in `human-writing` item 3)

**Bullets must be gist, not full sentences.** If written as full sentences, the audience reads instead of listening
(people read faster than a speaker talks; the audience finishes reading first and then loses interest).

---

## 4 · Six layouts that are enough for almost every deck

An overview of all 6 is at `assets/slide-mockup-preview.webp` · the file `assets/slide-mockup.html` has all 6 **rendered at 1280×720 and checked by eye**.
Open it in a browser to see the real thing, or use it as the model when building a `.pptx`.

| # | Layout | Use when |
|---|---|---|
| 1 | **Cover**: big title + divider line + description | First slide |
| 2 | **Title + bullets + side strip** | General content, with the side strip holding the source of the numbers |
| 3 | **3 number boxes** | Results · metrics · before-after |
| 4 | **Chart + explanation beside the chart** | Data slides |
| 5 | **Chapter divider**: solid main-colour fill, full slide (a dark deck may use a dark fill) | Starting a new section · giving the audience a break |
| 6 | **One statement in the middle of the slide** | The ask · conclusion · customer quote |

**Side strip rule (layouts 2 and 4):** put what the audience **might ask**: the source of the numbers, how to read the chart,
limits of the data. Not extra content.

**Every slide has the same footer:** section name on the left, page number on the right.
Page numbers matter more than you think, because the audience can say "ขอย้อนกลับแผ่น 9" (please go back to slide 9).

---

## 5 · Text size

A 16:9 slide 13.333 inches wide = **960 pt** in slide software, and equals 1280 px in a browser.
Conversion: **1 px = 0.75 pt**

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

**Exception for the Stage deck:** the "ตัวอย่าง" (example) line · the sub-text in a process table · Q/A under numbers may use 12–14 pt, because the audience reads them later. Slide titles, step names and the main gist must still be ≥ 18 pt.

**18 pt is the smallest content size in a meeting room.** Below it, people in the back row cannot read.
If the content does not fit at 18 pt, the problem is too much content, not text that is too big.
**Never reduce the size to make content fit.** Cut content instead.

**2 weights are enough** (regular + bold). Slide titles should be bold; body text should not.

---

## 6 · Data slides

**1 chart, 1 conclusion.** If a chart says 2 things, split it into 2 slides.

- **The slide title is the conclusion from the chart,** not the chart's name
- **Highlight the bar/line that is the point with the brand colour, and make the rest grey.**
  Colour alone says the point with no explanation needed
- **Put the numbers on the bars directly.** Do not make the audience sweep their eyes over to read the axis
- **Remove gridlines, unnecessary axes and the legend** if you can label the data directly
- **Always state the data source:** period, sample size, source (put it in the side strip or footer)
- **A table over 5 rows by 4 columns should not be on a slide.** Make it a chart, or move it to an attachment

The chart colour palette in slides comes from `diagram-figures` → `references/colour-by-domain.md` · for charts that must also be used with app screens, see `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts)

---

## 7 · Check the work

### View the whole deck as thumbnails

Open the slide sorter view, or render every slide as an image and lay them out together.

- [ ] Reading only the slide titles of every slide, do you understand the whole story?
- [ ] Is any slide visibly denser than the others (= over the text budget)?
- [ ] Do the page margins match on every slide?
- [ ] Is the slide title in the same position on every slide?

### The three-metre test

Shrink the slide to 25% and look from a distance. If you cannot read the slide title, the back row cannot either.

### Go through slide by slide

- [ ] The slide title is a conclusion, not a topic name
- [ ] No more than 6 bullets, each no more than 2 lines on the real slide (per the table "Budget per slide"; Thai words cannot be counted)
- [ ] Smallest text in the content ≥ 18 pt
- [ ] Every chart has a conclusion and a data source
- [ ] Every slide has a page number
- [ ] Opened on the real projector or the screen that will actually be used, at least once

---

## 8 · Thai on slides

- **Line height at least 1.4** for slide titles and **1.5** for body text,
  because below that, the upper vowels and lower vowels of 2 lines collide (the middle value is in `human-writing` `references/thai-line-breaking.md`)
- **For a long Thai slide title, break the line yourself** at the point where the thought ends.
  Do not let the program break it, because Thai has no spaces between words and the program breaks mid-word
- **A font with both a real regular and a real bold weight.** A fake bold generated by the program blurs the vowels
- **Thai mixed with English on the same line: use one font family that has both languages.**
  Otherwise letter heights differ and the line looks tilted
- Font settings in a real `.pptx` file (including the complex script problem) are in `branded-document-design`

---

## 9 · Anti-patterns

A list of 13 common ones (slide title is a topic name · slide is a document · shrinking text to fit · no page numbers, etc.) is in [`anti-patterns`](references/anti-patterns.md). Open it when checking item 7.

**Things that make a deck look off-the-shelf: avoid** (idea from anthropics/skills pptx): a colour line under the title of every slide · cream/beige background as the default · the same 3-column icons on every slide · gradient text · long centred paragraphs

**Flat decks: avoid:** dark or all-white background across the whole deck when the source work is vividly coloured · the main colour appearing only as thin lines · more than 3 text-only slides in a row · colours not in the source work (the fix is in [`deck-theme`](references/deck-theme.md) item 3)

---

## 10 · Connect to other skills

| Need | Use with |
|---|---|
| Create a real `.pptx` file | `branded-document-design` |
| A single .html deck presented from a browser (menu · notes · clock · click for detail) | `html-slide-deck` |
| Convert .pptx to .html with animation · click-by-click reveal · insert interactive pages | `html-slide-deck` (`references/from-pptx.md`) |
| Chart colour palette | The work's main colour + secondary colour per `diagram-figures` → `references/colour-by-domain.md` (app screens: `web-app-design` in plugin `software-development`) |
| Diagrams on slides | `diagram-figures` (for software, `software-diagrams` (plugin `software-development`) works too) |
| Spacing rules and eye order (app screens) | `ui-craft` (plugin `software-development`) |
| Content comes from a Software Requirements Specification (SRS) document | `srs-writing` (plugin `software-development`) |
| Cut content down to what is necessary | `simplicity-first` (plugin `software-development`) |
| Brand colour and type system · illustration | `graphic-design` (plugin `software-development`) |

---

## Not looking AI-made

Before sending, go through item 3 of `no-ai-look`: for HTML work, run its script · every job must also pass the eye gate 3.2 (web pages also answer items 10–14), because 0 findings from the script is not yet a pass · the prohibitions in this file are specific to this work; the full list for every medium is there.

## Abbreviations

Always spell out an abbreviation in full the first time, and put the abbreviation in brackets, for example Model Context Protocol (MCP).
After that you may use the abbreviation. See the skill `spell-out-abbreviations` for details.


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


## reference: deck-theme.md

# Deck theme: bright, and fitted to the source work

The central file for every slide skill (`presentation-design` · `html-slide-deck` (including the entry from .pptx) · `StageDeck` in `branded-document-design`). Open it at item 1 step 0, before opening the program.

> **The one rule:** the deck must look like it came from the source work, in both colour and mood. Someone who sees the deck next to the source document must know it is the same work.

## 1 · Colour comes from the source work first

"Source work" is what the user gave you to turn into a deck, such as a report .docx · .pdf · an existing .pptx · a website or app · a poster · a logo · a product photo. Find the colour in this order and stop at the first hit:

1. **If the source work has its own colours, extract them with the script**, not by eye:
   ```bash
   python scripts/source_palette.py <ไฟล์ต้นทาง> [โลโก้] [ภาพหน้าจอ]
   ```
   The script reports the main colour, up to 2 secondary colours, and whether the source background is dark or light, then prints values ready to put into `build_deck.py` · `StageDeck` · `pptx_to_html.py`. It reads .pptx .docx .xlsx .html .css .svg images and .pdf (needs `pdftoppm`). Colours it ignores: grey, white, black · the default Office theme (colours the author did not choose) · Word styles the content does not use · colours that appear fewer than 3 times or under 10% of the main colour
2. If the source has no colour (plain text · black-and-white documents), use the project's colour in the order in `diagram-figures` item 5 (`doc-theme`, then the brand colour in code or the logo)
3. If there is still none, search for a reference per `design-references`, type `slide`, with the work's keywords, then extract colours from the chosen work (the same script works on a screenshot of the reference)
4. If live search is not possible, use the house colour `#2A78D6` and write `(รอยืนยัน)` (to be confirmed) in the report

You must still open and look at the script result once: the main colour it gives must be one that people remember the work by (logo colour · cover colour). If it picked the colour of an illustration or a screenshot that happens to cover a large area, feed it the logo or cover file instead.

**Never invent a secondary colour.** The secondary colour must come from the source work. If the source has one colour, use one colour, and make it vivid with item 3 instead.

## 2 · Mood comes from the content

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

When the user says "สดใส" (bright) "น่าดู" (good to look at) "ไม่จืด" (not flat), or says nothing at all, do the following by default (`no-ai-look` forbids ordering by free-floating adjectives, so this is turned into rules that can be checked):

1. **Light background by default.** Use a dark background only when the source work or app is dark (the script says `พื้นต้นทาง … (เข้ม)`)
2. **Full-slide main colour** on the cover, section openers and closing page · `build_deck.py --theme bright` does all 3 types (`.hero` `.divider` `.close`) · `StageDeck(block=True)` does the cover and chapter dividers (no separate closing page) · content pages use a light background, with cards tinted faintly with the main colour
   - **Logos on solid-colour pages use a pure white or pure black version** to match that page's text colour, because a logo the same colour as the background, or close to it, disappears · if you only have a coloured logo, place it on a white rounded box, or move the logo to the first content page
3. **Secondary colour from the source** (if any) separates sections, for example section 2's opener is fully the secondary colour, or it emphasises numbers whose meaning differs from the main colour · the whole deck has at most 3 colours plus status colours
4. **Real images in at least 1 of every 3 slides.** Images from the source work, screenshots, product photos, or images made per `image-generation` · no more than 3 text-only slides in a row
5. **No layout repeated more than 2 slides in a row** (`no-ai-look` item 3.2 item 5)
6. **Never use vividness in place of readability.** Text of every size on a solid colour must reach ≥ 4.5:1 · `build_deck.py --theme bright` and `StageDeck(block=True)` choose for you: white when white reaches 4.5:1; if not, near-black (for example on yellow); and if near-black still falls short, pure black (for example on orange, teal and the house blue) · you must still open every slide image and check per item 7 of `presentation-design`

Do not count as vividness, and still forbidden per `no-ai-look`: purple-blue gradients · gradient text · neon or glow · several pastel colours not in the source work · decorative icons on every card · every animation

Work in the "stable" and "calm" rows of item 2 uses only items 1 2 4 5 6 · use item 3 when the source really has a secondary colour, and full-slide main colour is left only on the cover and closing page.

## 4 · Put it into the tools

| Tool | What to put in |
|---|---|
| `html-slide-deck` | `build_deck.py … --theme bright --brand <main colour>,<light colour>,<secondary colour>` · pages that use the secondary colour full-slide get `data-tone="2"` on `<section>` · a dark source background uses `--theme dark` |
| `StageDeck` (.pptx) | `StageDeck(accent="<main colour>", bg="FFFFFF", block=True)` when the background is light (`block=True` makes the cover and chapter dividers solid full-slide main colour) · the secondary colour is used for figures and charts passed in (`diagram-figures` `#accent=`) |
| `html-slide-deck` entry from .pptx | The look comes from the .pptx · make the .pptx per this file first, then `--accent <main colour>` |
| Diagram figures in the deck | `diagram-figures` with `#accent=<main colour>&bg=<deck background colour>` |

## 5 · Check before sending

- [ ] Place the deck thumbnails next to the source work: the main colours match and it is clearly the same work
- [ ] Every colour in the deck comes from the source work or the order in item 1 · the report says which file
- [ ] The mood matches a row in item 2 and the reason is written at the head of the work
- [ ] Item 3 is complete: background follows the source · full-slide main colour on section-change pages · real images ≥ 1 in 3 · no more than 3 text-only slides in a row
- [ ] `check_deck.py` or `check_html_deck.py` reports 0 problems, then open `sheet-*.png` and look at every slide


---

# skill: html-slide-deck

Use when the deck must be HTML or animated, or pptx as HTML

# HTML Slide Deck

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 genuinely different directions → run `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **Language:** write every line of wording per `human-writing`; story structure and slide titles per `presentation-design` — this skill covers how to build it and how it looks

> **The one rule of this skill:** the deck is **one** .html file that opens in a browser and can be presented at once.
> Images embedded in the file · slide titles are conclusions · every page passes `check_deck.py` before sending

The look of the **house defaults** comes from the X Fitness pitch deck (45 slides, 10 minutes). It is an example of the house direction only, not a mold for every deck (a real deck's direction is chosen per step 2): dark background with a single brand color · big-number section openers · number cards · system diagram · click to see the real file · chat in a phone frame · test result chart

## When to use

- Presenting a project · system demo · executive summary, where the presenter opens it from their own machine
- You want viewers to click and see details themselves (files, code, test results), which PowerPoint cannot do
- The deck must be sent by email or chat and open on any machine without installing anything
- **A .pptx already exists**, or both .pptx and .html with the same look must come from one source (click-by-click animation · notes · table of contents · interactive pages) → for the entry from .pptx read [`references/from-pptx.md`](references/from-pptx.md) instead of step 1 · fix the .pptx and convert again; do not edit the converted .html

## When **not** to use

| Task | Use |
|---|---|
| Just told "make a slide deck" without saying html · the customer needs a .pptx to edit further | `branded-document-design` · `StageDeck` (same look, no animation) — the rules for choosing a file type are in `presentation-design` |
| No story structure yet | `presentation-design` steps 1–3 first, then come back |
| A companion report as .docx | `markdown-report-docx` (same colors) |

---

## 1 · Steps

1. Write the story structure per `presentation-design`: every slide title is a conclusion · sections · time per page
2. **The project already has `docs/deck/` or an .html deck → add `<section>` to the existing `slides.html` and use the same shell · css · `--brand`; do not start a new file** (same principle as `ui-craft` (plugin `software-development`) step 0) · none yet → copy `assets/slides-example.html` to the project's `docs/deck/slides.html` · keep only the `<section>` of the layouts you use (step 3) and fill in the content
3. Build the file:
   ```bash
   python scripts/build_deck.py docs/deck/slides.html -o docs/<PRJ>-DECK-v1.0-DRAFT.html \
          --title "<ชื่อเด็ค>" --theme bright --brand <สีหลัก>,<สีสว่าง>,<สีรอง>
   ```
   Pick the `--theme` and `--brand` values from the output of `presentation-design/scripts/source_palette.py <source file>` · `--css` / `--js` for things specific to this deck · `--data` passes JSON for extra JS to read · images referenced by a local path are embedded automatically
4. Check: `python scripts/check_deck.py docs/<ไฟล์>.html --out _to_delete/deck-check` → fix until **0 problems**, then **open every `sheet-*.png` and look**
5. Rehearse once with the clock (press T · press S to open the speaker window) · a page that runs over 30 seconds turns the clock a different color → cut that page's content

The deck must be buildable from script every time: for data that changes often (test results, numbers), the project's script reads it from the real result file and writes it into `slides.html` or `--data`; never type the numbers by hand.

## 2 · Theme — choose the direction before opening any file

**The visual direction of the deck always comes from `presentation-design` step 1, stage 0**, and the rules on color and mood are in [deck-theme](../presentation-design/references/deck-theme.md) · if you jumped to this skill without a direction, go back and do that first · selection order: the source work the deck is made from → the design the project already has → a reference the user attached → a reference searched live per `design-references` (plugin `superuser`) type `slide` → house defaults · **house defaults are a fallback for when there is no information at all, not a rule.** Two decks for different jobs should look different.

`build_deck.py` has 2 themes, chosen with `--theme`

| `--theme` | Look | Use when |
|---|---|---|
| `bright` | White background, cards tinted faintly with the main color · cover, section openers and closing page are full-bleed solid main color · accent colors are adjusted to read at 4.5:1 · text on solid backgrounds is white when white gives ≥ 4.5:1; if not, near-black; if still short, pure black | Every new deck, unless the source work has a dark background |
| `dark` (the default when omitted) | Dark background, dark gradient cover | Source work or app that has a dark background · old decks already built (without `--theme` the look stays the same) |

- `--brand main,accent,secondary` · the accent color is used for big numbers and the kicker (theme `bright` darkens this color automatically until it reads on a card) · give a secondary color only when the source work really has one · a page that needs a full-bleed secondary color gets `data-tone="2"` on its `<section>` (works with theme `bright`)
- Fonts can be changed in the `--css` file by choosing a family that has both Thai and English and has a real bold (rule in `presentation-design` step 8) · then open `sheet-*.png` and check contrast on every sheet

**Deck colors = colors of the source work.** Extract colors from the source file with `presentation-design/scripts/source_palette.py <source file>` · if the source has no colors, use the order in `diagram-figures` step 5 (color system) · if still nothing, use colors extracted from references of type `slide` · if live search is not possible, use `--theme bright` without `--brand` (gives `2A78D6,1F5FAF`, the house default), write `(รอยืนยัน)` (pending confirmation) in the report, and carry on · never copy colors from the example table below.

| token | Example value (the reference deck — not a default) | Used for |
|---|---|---|
| `--accent` | `#e10613` | Bar under the cover title · user chat bubble |
| `--accent2` | `#ff2536` | kicker · big numbers · section-opener page number · the selected item |
| `--accent-deep` · `--accent-tint` | `#2a0a0d` · `#1d0d10` | Gradient background of cover/section opener · background of the selected item |
| `--bg` · `--panel` · `--line` | `#09090a` · `#16161a` · `#2a2a30` | Background · card · line — do not change with `--brand` · a dark background is the shell's default (dark presentation room, screenshots and diagrams stand out), not a requirement (a deck converted from .pptx uses the .pptx background, see `references/from-pptx.md`) |

- The table above holds the values of theme `dark` · `--brand` computes deep/tint for you · in theme `dark` the bright color must read clearly on the dark background by itself (contrast ≥ 4.5:1), while for `bright` the script adjusts it
- **Where the house contrast numbers come from:** the house bright color `5B9BE6` reads on a dark background (6.9:1) but only 2.89:1 on white, so it must change to `--brand 2A78D6,1F5FAF` (the second color on white is 6.34:1 · the main color `2A78D6` gets 4.42:1, so use it for bars, lines or large text, not small text · computed with the WCAG formula 2026-10-26)
- House fonts (use when step 2 gives no other direction): headings **Chakra Petch** · body **IBM Plex Sans Thai** · code **JetBrains Mono** (Google Fonts · offline → Tahoma) · if the deck's direction sets other fonts → use those of that direction (Thai + English in one family, real bold)
- **One main color plus at most 2 secondary colors from the source work** · green `ok`, blue `blue`, orange `warn` are used only for their meaning (pass · info · warning)

## 3 · Layouts (all are in `slides-example.html`)

The look of the first 4 pages built with `build_deck.py` is in `assets/slides-example-preview.webp`

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

Every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>` · page numbers fill in by themselves

## 4 · What the shell does for you (no need to write it yourself)

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

### Animation (switch on per page — the default is still)

Content sliding up piece by piece on every page, numbers counting up, and glow that loops forever are AI signals in `no-ai-look` (fade-up on every piece · glow · giant numbers), so the shell does not add them to every page: put `data-anim` on the `<section>` only for pages where motion helps the eye follow the story (a system map where arrows must be drawn in order · section openers) · `data-count` · `data-loop` · `.bars` · `data-chat` work only on the pieces where they are set

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

Everything replays every time the page is entered · the player returns to the starting step and stops on every page change · turns itself off when the machine is set to reduced motion · add no animation that does not help the eye follow the story

## 5 · Look rules

- Slide margin 128 px left and right · content does not go into the bottom 120 px band (where the foot lives)
- Text on a slide is no smaller than 16 px on a 1920 stage · main body 24–32 px · slide title 56 px, at most 2 lines
- 1 page, 1 conclusion · long details go in a `<template>` for click-to-view, not crammed onto the page
- Speaker notes in `<aside>` are written the way people actually speak: use ครับ/ค่ะ and ก็, not document language
- A real screenshot beats a drawing · width ≥ 1600 px before shrinking · no stock images
- Every number in the content states its source in the foot (`qa/results/…` · test date)

## 6 · Check before sending

- [ ] `check_deck.py` shows 0 problems (page taller than 1080 · overflow past the edge · overlap with the bottom bar · box overflow · small text · broken image) — measured in a real browser, not by counting lines
- [ ] Open every `sheet-*.png` and look: one brand color · no page half empty · the slide titles read in sequence make a story
- [ ] Open the file with the network off: all images show, fallback fonts are readable
- [ ] Every page has an `<aside>` of speaker notes, and `data-at` times add up to no more than the time given
- [ ] No personal data or real customer data in the file (use mock data and say so in the foot)

## 7 · Anti-patterns

- **Editing the built .html file** — lost on the next build · edit `slides.html` and build again
- **Inventing a secondary color that is not in the source work** — looks like it does not belong · secondary colors must come from `source_palette.py`
- **A new deck without `--theme bright` when the source work has a light background** — gets a dark background that does not fit the work
- **A slide title that is a topic name** ("สถาปัตยกรรม", meaning "architecture") — it must be a conclusion ("แอปเดียวรับทั้งเว็บและ LINE", meaning "One app serves both the web and LINE")
- **Linking images from the web** — they disappear in a room with no network · use local files and let the build embed them
- **Live demo only** — always keep a replayed chat (`data-chat`) from real test results as the backup plan

## 8 · Connecting to other skills

| Need | Use |
|---|---|
| Story structure, slide titles, text budget | `presentation-design` |
| A .docx report in the same set | `markdown-report-docx` |
| A system diagram too complex for `.map` | `diagram-figures`, then embed as an image |
| File names and versions | `document-naming` |

## Not looking AI-made (`ไม่ให้ดูเหมือน AI ทำ`)

Before sending, go through item 3 of `no-ai-look` — HTML work runs its script · every job must also pass the eye gate 3.2 (web pages also answer items 10–14), because a script result of 0 items is not yet a pass · the prohibitions in this file are specific to this job; the full list for every medium is there


## reference: from-pptx.md

# Entry from .pptx → .html

An extension of [`SKILL.md`](../SKILL.md) · use it when a .pptx already exists, or when you must deliver both .pptx and .html from one source · the `scripts/` and `assets/` paths in this file count from the `html-slide-deck/` folder · this route uses the scripts `pptx_to_html.py` `check_html_deck.py` `click_steps.py` and does not use `build_deck.py`

> **One rule of this route:** the look comes entirely from the .pptx · fix the .pptx and convert again, never edit a converted .html.


The model is the Independent Study (IS) presentation deck "Few-shot Key Information Extraction (KIE) · Confidence-Gated Cascade" (41 slides + 15 interactive pages): finish the .pptx first, then convert it into one .html file where every piece slides in one row at a time, with a progress bar, table of contents, speaker notes and a clock, in the style of the X Fitness deck.

## When to use

- A .pptx already exists (made by hand in PowerPoint · `StageDeck` · `BrandDeck` · received from a customer) and you want to present it with browser animation
- You must deliver both .pptx (for people to keep editing) and .html (opens on any machine) from one source
- You want to add interactive pages (type a number and calculate · play step by step) between the PowerPoint pages

## 1 · Steps

1. **Finish the .pptx first** — colours and mood come from the source work, following `presentation-design` [`references/deck-theme.md`](../../presentation-design/references/deck-theme.md) (extract colours with `presentation-design/scripts/source_palette.py` · light background is the default · section-divider slides are a full sheet of the main colour, which `StageDeck(..., block=True)` does) · if the source work has no colours and no look yet → **search for a model first:** take the project's words and search live following `design-references` (plugin `superuser`) type `slide`, then extract colours from the chosen work · the stored palette library is for when a live search is not possible · no .pptx → build one with `branded-document-design` (`StageDeck`) · the slide title goes in the title placeholder (it becomes the name in the table of contents) · put speaker notes in notes · split into parts with PowerPoint Sections (they become groups in the table of contents)
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

Before sending, go through the section "Not looking AI-made" (`ไม่ให้ดูเหมือน AI ทำ`) at the end of [`SKILL.md`](../SKILL.md), the same as for a deck written directly.


---

# skill: answer-shape

Use when an answer needs prose, a table or a diagram

# The shape of an answer

This skill gives the shape and structure; every line of wording follows `human-writing` · lives only in plugin `superuser`; other plugins share it through `dependencies`

> **One rule:** whatever structure the content has, the answer uses that shape.
> Comparison → table · connections → figure · one thing → sentences

---

## Pick the shape from signals in the question

The quoted signals are Thai user phrasings; English meanings are in brackets.

| Signal | Shape |
|---|---|
| "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" ("which is better" · "how do they differ" · "what options are there") | **Comparison table** |
| "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" ("what connects to what" · "how does data flow" · "what is the sequence") | **Figure** |
| "มีอะไรบ้าง" ("what are there") when the items are not compared | **Bullet list** |
| "ทำไม" · "แปลว่าอะไร" ("why" · "what does it mean") · one thing with no branches | **Plain sentences** |
| Several numbers that must be seen together | **Table** |
| Steps that must be done in order | **Numbered list** |
| Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

**The most important signal is having 2 or more "things being compared"**; use a table then,
because in a paragraph the reader must hold the first one in their head while reading the second.

---

## A table that reads easily

- **The first column is the thing being compared**, and the next columns are the aspects compared
- **3–5 columns**; more than that cannot be read in time, and at most 8 rows in a chat answer
- **Every cell must have content** — an empty cell means that column should not exist, or the data is incomplete; if there is no data, write "ไม่มี" (none) plainly · a table where every cell says "it depends" also has no content
- **At most 1 line per cell**; if longer, move it below the table
- **Order rows by weight**: the recommended one or the most used one on top, not alphabetical
- **Column headings are the questions in the reader's head**, not names of academic fields

```
ผิด: | ตัวเลือก | ประสิทธิภาพ | ความซับซ้อน |
ถูก: | ตัวเลือก | เร็วแค่ไหน | ต้องดูแลมากไหม |
```

(Gloss: wrong = "Option | Performance | Complexity" · right = "Option | How fast | Does it need much upkeep".)

**Always close a table with a 1-line conclusion** — a table gives data; it does not say what to choose

---

## When a figure beats a table

Use a figure when **the relationship is the answer** — a table can give properties, but cannot say what connects to what.

| Use a figure | Use a table |
|---|---|
| What connects to what · what sits inside what | Which is better than which, and in what respect |
| A sequence with forks or loops back | A straight sequence of steps with no branches (a numbered list is enough) |
| The same thing in several states | Different things on the same aspects |

In chat, **a small ASCII figure or a short Mermaid is enough** — no need to open a drawing tool

```
กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน
                    │
                    └──▶ ที่เก็บถาวร
```

(Gloss: กล้อง = camera/scanner · รายงาน = report · ที่เก็บถาวร = permanent storage.)

A figure that must be a real file to go into a document or slides uses the figure-drawing skill of that plugin (if there is one)

---

## When sentences beat both

- The answer is shorter than 3 lines — a 2-row table is only decoration and explains nothing
- A question answered "yes" or "no" followed by 1 sentence of reason
- A matter where **the reason matters more than the options** — a table cuts the reason to fit the cell

> A table with one row or 2 short rows means the wrong shape was used · a figure that draws what one sentence can say is the same

---

## When you cannot continue

Whenever you are blocked → list only 2 things: **what is blocking** and **what you need from the user**

- 1 line per item · at most 4 items
- Do not tell the cause at length, do not answer side topics, do not plan the work ahead — wait until you have the thing, then do it
- If there are several paths for the user to choose → each path is 1 item, the easiest on top

```
ผิด: ย่อหน้ายาวเล่าว่า container ใหม่ · โฟลเดอร์ว่าง · OneDrive หาย · แล้ววางแผนแก้ 3 ข้อรอไว้
ถูก: ติดอยู่ 1 เรื่อง:
   - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
   ต้องการ 1 อย่าง:
   - แนบ Mockup.html มา หรือบอก path ใหม่
```

(Gloss: wrong = a long paragraph telling that the container is new · the folder is empty · OneDrive is gone · and then planning 3 fixes while waiting · right = "Blocked on 1 thing: cannot see the file — the linked folder is empty. Need 1 thing: attach Mockup.html or give the new path.")

---

## Abbreviations

Abbreviations used in this file · rules for writing abbreviations → `spell-out-abbreviations`

- **ASCII** — American Standard Code for Information Interchange (drawing figures with plain characters)
- **Mermaid** — a language that writes diagrams as text and lets a program draw them
- **DICOM** — Digital Imaging and Communications in Medicine (a standard for medical image files and transfer)
- **API** — Application Programming Interface (the channel through which one program calls another)
