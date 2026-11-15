---
name: presentation-design
description: Use when planning a slide deck story and layouts
---

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
