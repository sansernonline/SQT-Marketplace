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

Chart colour palette: `diagram-figures` → `references/colour-by-domain.md` · for charts that must also be used with app screens, `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" (data colours, charts).

## Thai on slides

- Line height at least 1.4 for slide titles and 1.5 for body text, because below that the upper and lower vowels of 2 lines collide (middle value in `human-writing` `references/thai-line-breaking.md`)
- For a long Thai slide title, break the line yourself where the thought ends: the program breaks mid-word because Thai has no spaces between words
- A font with both a real regular and a real bold weight: fake bold blurs the vowels
- Thai mixed with English on the same line: one font family that has both languages, otherwise letter heights differ and the line looks tilted
- Font settings in a real `.pptx` file (including the complex script problem): `branded-document-design`

## Off-the-shelf look: avoid

- Things that make a deck look off-the-shelf: a colour line under the title of every slide · cream/beige background as the default · the same 3-column icons on every slide · gradient text · long centred paragraphs
- Flat decks: dark or all-white background across the whole deck when the source work is vividly coloured · the main colour appearing only as thin lines · more than 3 text-only slides in a row · colours not in the source work (fix in [`deck-theme`](deck-theme.md) item 3)

## Related skills

| Need | Use with |
|---|---|
| A single .html deck presented from a browser (menu · notes · clock · click for detail) | `html-slide-deck` |
| Convert .pptx to .html with animation · click-by-click reveal | `html-slide-deck` (`references/from-pptx.md`) |
| Spacing rules and eye order (app screens) | `ui-craft` (plugin `software-development`) |
| Content comes from a Software Requirements Specification (SRS) | `srs-writing` (plugin `software-development`) |
| Cut content down to what is necessary | `simplicity-first` (plugin `software-development`) |
| Brand colour and type system · illustration | `graphic-design` (plugin `software-development`) |
