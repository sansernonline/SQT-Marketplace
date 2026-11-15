# skill: no-ai-look

Use when making visuals so they do not look AI-made

# no-ai-look — work that looks designed by a person, not by AI

> **One rule:** every choice (color, font, layout, image, word) must be answerable as "chosen because of this project", not "because it is the default."
> The defaults of models and frameworks are the average of everyone's work, so work that uses the average all looks the same, and viewers recognize at once that AI made it.

**Last line of every answer that makes or reviews a visual piece, including a quick "is it OK to send?" check:** the `no-ai-look:` log line from section 3.3, filled with the real counts (eye check `ด่านตา n/9`, web pages add `(หน้าเว็บ n/14)`) · items you could not check count as not passed, so the line reads below 9/9 · A script result of 0 alone never makes the line pass, because the script reads only values in the code · Script not run (no shell in this session) → write `สคริปต์ ไม่ได้รัน` in its slot · When the `ด่านก่อนลงมือ:` line of `design-references` is also due, it goes right above this one

Lives only in plugin `superuser`; other plugins share it through `dependencies` · the full list for every medium with sources → [`references/catalog.md`](references/catalog.md)

## Use together with

This skill controls only "does it look like AI". Spacing, color, fonts and components still belong to that job's skill, such as `ui-craft` with the platform skills · `presentation-design` · `graphic-design` · `brand-kit` · `brief-to-image` · `image-generation` (plugin `graphic-design`). Words in the work use `human-writing`.

**A look the project has already approved always wins** (brand kit · a diagram's house style · a theme already delivered). If what is approved matches a ban here, keep it and note that it is intentional (item 3).

---

## 1 · Before starting — decide 5 things and write them down

Do this before drawing the first piece. Write them where the project already keeps its look (`docs/README.md` field `doc-theme` · app tokens · brand kit); do not create a new file if a place already exists.

1. **What the work is for** — choose 1: persuade (sales page · post) · use (app · dashboard) · read (document · article) · experience (game · showpiece). The layout comes from this item, not from a ready-made structure. Sketch 2–3 really different layouts in ASCII, then choose the one that fits this content and these users, with a 1-line reason; do not use the first one that comes to mind, because the first is usually the default (idea from anthropics/skills `frontend-design` section Process · Apache-2.0 · source code AN in `catalog`).
2. **1 main color** tied to this business, then derive the neutrals from it. Never use a color that frameworks and tutorials use often as the brand color (Tailwind's indigo-500 `#6366f1` · shadcn/ui's default dark gray button).
3. **2 fonts** — 1 heading font with personality + 1 body font that reads easily. Write the reason for each in 1 line. Thai work needs a family with full Thai coverage.
4. **A real source of inspiration** — the product's own world (materials · shop signs · documents of the field) or a named style (Swiss · risograph · 1960s travel posters). Never order with floating adjectives ("พรีเมียม" "ทันสมัย" "สดใส"), because you get the average of that category. **Search references first:** take the project's words and search live per `design-references` (plugin `superuser`) with the type that fits the work, then extract colors from the chosen work. The stored color library is used when live search is impossible.
5. **Real content** — names, numbers, dates, real screenshots, real people or clients. If you do not have it, put `(รอยืนยัน)` (awaiting confirmation); never invent it.

**Test:** take the logo off; could this work still be used by a competitor? If yes, it is still too average; add what only this project has.

---

## 2 · The most common signals — never use them as the default

Each item is allowed if there is a reason from the project (item 3). Fixes and sources for every item are in the catalog.

| Group | Signal | Use instead |
|---|---|---|
| Color | Purple-blue-cyan gradient · gradient text · neon on dark · a circular glow behind the content · cream background because it "looks tasteful" · the cream + terracotta + serif set that shows up on every "warm" job | 1 solid brand color · emphasis by size or weight |
| Surface | Frosted glass across the page · decorative grid or stripes · thin line + wide shadow on one box | Plain background · pick either line or shadow |
| Cards | A thick colored bar on the side of a rounded card · cards inside cards · corner radius so big it becomes a blob · a grid of 3–6 identical-looking cards | Spacing and type · group by importance |
| Headings | A small badge above the heading ("Introducing") · an icon in a rounded tile above the heading · numbers 01/02/03 with no real sequence · giant italic serif · Inter/Geist on every job | Put the useful words in the heading itself · fonts per item 1 |
| Page structure | Centered hero → 3 cards → customer logos → pricing → FAQ on every page · opening section → feature list → how it works 1–6 → install button · giant number + small label in 3 boxes · every slide is a title + 3–4 bullets | Structure from the page's goal · change the layout with the content |
| Icons | Emoji in place of icons or in headings · one thin-line icon set at size 16 everywhere · icons bigger than the content | One deliberately chosen SVG icon set · real screenshots or charts instead of icons |
| Motion | fade-up on every piece · a dot that blinks nonstop · a blinking cursor in still text · self-scrolling elements · bouncy easing · an image that zooms on hover | Move only what has meaning, 150–300 ms ease-out, using transform/opacity |
| AI images | Plastic-smooth skin · golden or dramatic light in every scene · teal-orange tone · an unnaturally clean scene · average-looking people · hands, teeth, text that are off · clay 3D or glossy isometric | One light source with a reason · signs of use · specify style and color in the prompt · edit, never use the first image you get |
| Logos | A gradient circle with a hole in the middle · circuit patterns · infinity · swoosh curves · melting letters · details lost at 16 px | A shape from something specific to the brand · deliver as vector · test at favicon size |
| Documents | Emoji before headings · every bullet starts in bold · Title Case on every heading · every section a list · 4 levels of headings in a short note · ending every section with a summary · default-looking Mermaid | Short prose · only the headings needed · diagrams in the house style |
| Words | Broad ad words (supercharge · ยกระดับ · ไร้รอยต่อ) · the slogan "ไม่ใช่แค่ X แต่คือ Y" · sets of 3 everywhere · frequent long dashes · canned opening sentences ("ในยุคดิจิทัลที่…") | Follow `human-writing` · say what the user can do, with numbers · check Thai with `thai-grammar`, not English rules (full stops, dashes, word breaks differ) |

**Do not fix it by swapping one default for another** — dropping purple for cream + terracotta + serif (or + olive green) is still a formula. This set is "the default of someone who knows purple is the default". A bento grid and mesh-style gradient backgrounds are not signals in themselves; do not hunt to cut everything that looks modern.

---

## 3 · Check before sending

### 3.1 HTML/CSS work (mockup · web page · HTML deck · HTML document cover)

```bash
python <path ของ skill นี้>/scripts/slop_scan.py <ไฟล์หรือโฟลเดอร์>          # ตาราง
python <path ของ skill นี้>/scripts/slop_scan.py <path> --min P2 --json       # เฉพาะข้อหนัก
python <path ของ skill นี้>/scripts/slop_scan.py --url https://...           # หน้าที่ขึ้นเว็บแล้ว + stylesheet ที่หน้า <link> ไว้ (ไม่รัน JavaScript) · path ไฟล์ในเครื่องหรือ file:///... ก็ได้
python <path ของ skill นี้>/scripts/slop_scan.py --self-test                  # รันก่อน ถ้าแก้สคริปต์
```

- **The `ui-scan` hook of plugin `superuser` runs this script by itself every time a UI file is Written/Edited** (`.html` `.css` `.scss` `.less` `.jsx` `.tsx` `.vue` `.svelte` `.astro`, including files in `_to_delete/` · it skips `node_modules` `dist` `build` `.claude` `vendor` and `.min.` files). P0/P1 are sent back to be fixed at once · P2 is passed as context · an unchanged result is not warned again · turn it off with `"ui_scan": false` in `.claude/superuser/config.json`. The hook checks one file at a time; before sending, still run the whole folder once.
- A page drawn entirely by JavaScript (SPA): `--url` sees only the skeleton → check the source code, or save the page from the browser as .html and check that file.

- Checks 43 rules from the code (colors, cards, type, motion, words, broken images, inputs with no label, contrast of Tailwind classes) · nothing extra to install
- Levels: P0 unusable · P1 hard to read · P2 clear AI signal · P3 look again (may be intentional) · any P0 or P1 → exit 1
- **Fix P0 and P1 first**, then P2. For things that are intentional, write `/* slop-ok: <rule> <reason> */` or `<!-- slop-ok: <rule> <reason> -->` in that file; the reason shows up in the report for the reviewer.
- Checking 0 files = wrong, not a pass (the script exits 2)
- A script result is a reason to look again, not an order to fix every item. The script does not see images; the items in 3.2 must always pass the eye gate.
- **0 script items does not mean pass:** the script catches only defaults readable from code, and work whose whole page is the category average is invisible to it (a landing page really tried 2026-11-06 got 0 items but still looked AI-made). Work can be sent when it passes both the script and the eye gate 3.2.

### 3.2 Eye gate (every medium, including images, PPTX slides, posters, Word documents)

Render to an image at real size and answer item by item, yes or no. Count pass or fail by the criterion written in that item (in some items "yes" means fail). An item with several questions must pass every question to count as 1. For any item that fails, fix it, or note the reason it is kept on purpose under `## ตัดสินใจเอง` (decided on my own).

1. **With the logo and product name covered, can you still tell whose it is?** — if not = fail · extra test: replace the product name with one competitor's name; if every sentence and image is still true = fail
2. **Squint** — is there one dominant element, or does everything demand attention at once?
3. **Count the signals in item 2** — 3 or more in one piece = looks AI-made
4. **Real content** — are there names, numbers, real images, or only generic words and stock photos?
5. **One set** — every slide, every post uses one system, but the layout does not repeat on every page. A single piece (a 1-image post · a single cover) answers `ไม่ใช้` (not applicable) and counts this item as passed.
6. **AI images** — look at hands, teeth, text, shadows, light, real-world scale; zoom to 200% before use
7. **Blank space** — is there room for the important things to breathe, not packed edge to edge?
8. **Words** — read the headings aloud; do they sound like a person telling a friend, or like a slogan on a sign? (a slogan = fail · `human-writing` item 8) · does a heading break a line in the middle of a phrase? (web pages: look at width 375; slides, posts, covers: look at the piece's real size) (such as "ทำงานเป็น / ทีม"); if it breaks = fail, set the break yourself with `<wbr>` or `text-wrap: balance` · a heading whose wording the user set themselves: use it as given, and note it as kept on purpose · **Large Thai type:** zoom in on upper vowels and tone marks (ที่ · ทั้ง · ปี่) to see that they do not collide with or overlap the line above, and that lower vowels (ุ · ู) do not overlap the line below · a collision = fail; increase the line spacing per the table in `human-writing` [`thai-line-breaking`](../human-writing/references/thai-line-breaking.md) (Thai headings no lower than 1.4) · real incident 2026-11-06: a post with tight heading line-height, where the tone marks of the lower line hit the upper line, but the maker reported that Thai type did not break
9. **Cut 1 piece before sending** — find something that can be removed without the work losing anything (a shadow · a border line · a decorative icon · a label above a heading · motion · a gradient · a summary paragraph) and really remove it · send only if you find nothing · do not cut shadows, rounded corners, the hero image, or icons that the depth language of the look or the owner's chosen style requires, because cutting until it is flat is the mistake on the other side (user asked for rounded corners, shadows and icons back 2026-11-09) · AI work almost always has at least 1 extra piece, because models add more than they cut (idea from Anthropic's frontend-design · Apache-2.0)

**Web pages, marketing landing pages and a product's home page answer 5 more items** (posts, banners, covers and single images use only items 1–9) (opening section = the first screen seen before scrolling, or the hero):

10. **Does the opening section have at least 1 real thing from the product?** A screenshot of real use · real numbers with a source · a named real customer's voice · real work done · none = fail · at width 1440, does the opening section have unintended blank space over 1/3 of the screen? If yes = fail (that blank space is the place for the real thing)
11. **Is the order of sections built on this product's story, not the formula opening → feature list → how it works → install button or pricing?** If not = fail. Write 1 sentence on how this product's story should be told (start from the problem the user meets · start from a demo of the real thing · start from customer results) and order the sections by that sentence · you may keep the usual formula when that sentence really leads to the same order, and you must note it.
12. **Does a row of equal cells (3–6 cells of identical size and look) have a reason from the content?** The reason is that each cell is really equally important and about equally long. No reason = fail; make the more important cell bigger, or change to a list, prose or a single image. A small sequence number on a cell heading is allowed only when the steps must really be followed in order.
13. **Does the page's color have a source other than the logo or icon?** Sources that count: a reference searched this round (`design-references`) · the product's materials or world · an approved brand. Pulled from the icon alone = fail.
14. **Is every mono font spot on code, commands, file names, or numbers that must line up in columns?** Mono on brand names, menus, table headers or captions, to make it "look like a developer's", is costume = fail

**Someone who did not make it must check by eye, on every job before sending** — the maker cannot see their own defaults (2026-11-06: the maker reported Thai type did not break, but another person opened the image and saw the tone marks hit the line above).
- Send the **rendered image at real size** (not code) to a fresh subagent who did not take part: `design-critic` (graphic-design), or `reviewer` if there is none · send 3.2 with the job's brief, never the maker's answer or opinion, because reviewers tend to go along
- Ask for 2 things: the item-by-item answers of 3.2 · 3 places that look AI-made with how to fix them; no praise
- For an item where reviewer and maker disagree, use the reviewer's answer, then fix it or note the reason it is kept · after fixing, send the new image to a new reviewer to look only at the items fixed
- If the maker is a subagent that cannot call other agents, send the image path back to the lead to call the reviewer, and write `รอหัวหน้า` (waiting for the lead) in the eye-check field
- Skippable only for the reference board page (not yet our work) and work the owner ordered skipped · the 3 directions sent to the owner to pick at the end must pass the check before sending · if skipped, the result line says `ตรวจตา ข้าม เพราะ…` (eye check skipped because…)

### 3.3 Record the result

1 line at the end of the answer or report: `no-ai-look: สคริปต์ P0 0 · P1 0 · P2 n (ตั้งใจ n) · ด่านตา 9/9 (หน้าเว็บ 14/14) · ตรวจตา <agent ที่ตรวจ> ไม่ตรงกับคนทำ n ข้อ · ตัดออก: <ชิ้นที่ตัด>` · an incomplete eye gate, or answers by the maker alone = not yet passed, even with 0 script items · items kept on purpose go under `## ตัดสินใจเอง` with the reason · new builds must have the `design-references` line `ด่านก่อนลงมือ:` alongside, all 7 fields per `design-references` gate item 6, because checking only at the end cannot catch work that did not search first

---

## 4 · Writing a brief for an image tool, or a task sheet for a subagent

Put these in every time, otherwise you get the average:

- A named style + 1–3 real reference images (not adjectives)
- The brand's hex colors · light source and time · lens or camera angle
- Details observed from the real thing (place, signs of use, season, what kind of people)
- What you do not want: teal-orange tone · plastic-smooth skin · golden light in every scene · text in the image (put text as a separate editable layer)
- Once you get an image you must **edit** it: crop, retouch, adjust the light; never use the first image that comes out

---

Rules for writing abbreviations → `spell-out-abbreviations`


## reference: catalog.md

# catalog — signals that make work look AI-made (full version)

Extension of `no-ai-look`. Open it when the script reports an unfamiliar rule, or when you must check media the script cannot see.
The "Rule" column is the name in `scripts/slop_scan.py` (empty = checked by the eye gate, item 3.2). The "Source" column uses the codes in section 9. Only items with at least 2 sources are kept, except those marked (1 source).

## Contents

1. [Colors and surfaces](#1--colors-and-surfaces)
2. [Cards, boxes and page structure](#2--cards-boxes-and-page-structure)
3. [Type and headings](#3--type-and-headings)
4. [Motion](#4--motion)
5. [Words on screens, slides and ads](#5--words-on-screens-slides-and-ads)
6. [AI images, logos, posters, posts](#6--ai-images-logos-posters-posts)
7. [Slides, documents, diagrams](#7--slides-documents-diagrams)
8. [Basic quality (not AI, but really broken)](#8--basic-quality)
9. [Sources](#9--sources)

---

## 1 · Colors and surfaces

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| Purple-blue-cyan or pink gradient | Default from tutorials and frameworks; nobody chose it | 1 brand color tied to the business | `ai-palette` | IM · CM · UN · VP |
| Buttons and links in indigo `#6366f1` | Tailwind's indigo-500, often used by tutorials and AI-generated code (shadcn/ui's default is near-black dark gray, not indigo — checked 22 Oct 2026) | Set your own color tokens | `framework-default` | CM · UN · SK · VP · 21 |
| Gradient text | Decorative emphasis that says nothing | Solid color + size or weight | `gradient-text` | IM · DC |
| Neon/glow shadows on dark backgrounds | The default "cyberpunk" recipe | Reduce glow so the data stands out | `neon-glow` | IM · DC |
| A circular glow behind the content | The most common AI backdrop | Spacing, contrast, clear headings | `radial-halo` | IM · DC |
| Cream/beige background + serif + olive green | "Good taste" that became the new recipe | Choose from the project's context | `cream-palette` | IM · UN · SK |
| Cream background (about `#F4F1EA`) + terracotta accent + high-contrast serif headings as the starting set | The "warm, tasteful" set the model grabs when the brief fixes no colors. Terracotta is close to Anthropic's own brand color, so client work gives it away easily | Colors from the business and the project's real materials · cream is fine when the brand or brief orders it | `cream-palette` in part (catches the cream background, not the terracotta) | AN (1 source · anthropics/skills `frontend-design` Apache-2.0 · checked 2026-10-23) |
| Tinted black (`#111` · `#0B0B0B`) instead of black on every job, with 1 warm accent color as the default | A template's decorating habit applied whatever the subject; looks deliberate but nobody chose it | True black, or a dark shade of a brand color with a reason from the job · note the reason beside the token | | AN (1 source · the template chrome section of `frontend-design` · checked 2026-10-23) |
| Frosted glass across the whole page | Decoration; does not solve a layering problem | Use only for things that really float over content | `glassmorphism` | IM · DC |
| Decorative grid or stripe pattern on the background | Fills empty space with lines | Plain background · grid only for canvas/maps | `grid-bg` `stripes` | IM (1 source) |
| The whole shadcn default set (slate gray · one corner radius across the app · `rounded-2xl shadow-lg p-6` · `max-w-7xl`) | The look of a framework, not a decision | Set tokens for color, corners, shadow, spacing before building | `framework-default` in part | CM · UN · SK · VP · CV |
| Both low contrast and gray on a colored background | Looks "clean" but cannot be read | ≥ 4.5:1 · use a dark shade of the background color | `low-contrast` | IM (1 source) |

## 2 · Cards, boxes and page structure

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| A thick colored bar on the side of a rounded card | Makes an ordinary card look like a warning | Remove it if it does not show status · a solid-color label | `side-tab` | IM · GD (item 7) |
| Cards inside cards | Too deep; little room left to work | Spacing, type, divider lines | `nested-cards` | IM (1 source) |
| A 1px line + wide shadow on one box | Defines the edge twice | Choose one | `hairline-shadow` | IM (1 source) |
| Corner radius too big for the box | Every card is the same blob | Reduce by box size | `huge-radius` | IM (1 source) |
| A grid of identical icon-heading-text cards | Every item has the same weight | Group · make the important item bigger | | IM · GD |
| Giant number + small label + 3-box stats | A sales-page template | Use numbers when they help explain, with context | | IM (1 source) |
| Fixed page structure: centered hero → 3 cards → customer logos → pricing → FAQ → 4-column footer | The order of a template, not of the page | Build from the page's goal and what the reader must do first | | CM · UN · VP · SK |
| Identical spacing everywhere | Cannot tell what is in the same group | Close within a group, far between groups | | IM (1 source) |
| Everything symmetric, everything centered | No point of intent | Asymmetry · 1 large cell · an off-center hero | | 21 · AN · GA |
| Settings content crammed in a modal | Not enough room | A separate page | | IM (1 source) |

## 3 · Type and headings

| Signal | Why it looks AI | Use instead | Rule | Source |
|---|---|---|---|---|
| Inter/Geist on every job | Makes different products look the same | A font by personality · keep it if it is the brand font | `overused-font` | IM · GD · AN |
| Switching to Space Grotesk on every job instead | The new default | A reason from the project | | UN · SK |
| Giant italic serif | A shortcut to "editorial" | A typeface by the product's personality | `italic-serif-display` | IM (1 source) |
| A small badge above the heading ("Introducing" · "New") | Adds a line that says nothing and looks clickable | Put that word in the heading, or cut it | `eyebrow-badge` | IM (1 source) |
| An icon in a rounded tile above a card heading | The AI feature-card pattern | An icon beside the heading, or remove the tile | `icon-tile` | IM (1 source) |
| Numbers 01/02/03 with no sequence | Clutter that says nothing | Use when there are real steps | `numbered-labels` | IM (1 source) |
| A long display-size heading eating the first screen | No room left to explain | Shorter or smaller | | IM (1 source) |
| Heading and body at close sizes | Cannot be scanned | Clear difference in size, weight, spacing | | IM (1 source) |
| Strongly squeezed letter spacing | Letters touch and are hard to read | Not below -0.03em | `crushed-tracking` | IM (1 source) |
| Emoji in headings or in place of icons | No icon system | One SVG set | `emoji-heading` | CM · UN · WW |
| One thin-line icon set (such as Lucide) at size 16 everywhere | Repeats across every product | Choose a set on purpose · use real screenshots/charts instead | | BL · 2S |

## 4 · Motion

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| fade-up and hover-scale on every piece | Move only what has meaning, 150–300 ms ease-out · a site that must feel alive uses 4 entrance styles in turn, not the same one everywhere (`dynamic-website` in software-development) | | UN · SK · BL |
| A status dot that blinks nonstop | Still · moves when the status changes | `pulsing-dot` | IM (1 source) |
| A blinking cursor in still text | Keep it in typeable fields | `blinking-cursor` | IM (1 source) |
| Text/logos that scroll by themselves | Still, or with a stop button | `marquee` | IM (1 source) |
| Bouncy or stretchy easing | Settle fast · bounce only where it fits the product | `bounce-easing` | IM · GD motion-basics |
| Animating width, spacing, or `transition: all` | transform/opacity | `layout-animation` | IM (1 source) |
| An image that zooms or rotates on hover | Still, unless it says it can be clicked | `hover-zoom-image` | IM (1 source) |
| Content hidden waiting for an animation, and if the script fails it never appears | Visible by default | | IM (1 source) |

## 5 · Words on screens, slides and ads

The main principles are in `human-writing` item 3. This table keeps only what shows up in design work.

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| Broad ad words (supercharge · world-class · seamless · ยกระดับ · ไร้รอยต่อ · ล้ำสมัย) | Say what the user can do and how much better | `buzzword` | IM · WW · 2S |
| "Not a feature. A platform." · "ไม่ใช่แค่… แต่คือ…" | Explain directly | `forced-contrast` | IM · human-writing |
| A long dash in every sentence | English: split into sentences with a full stop · Thai: a space or a new paragraph, no full stop mid-paragraph (`thai-grammar` `f3` `t-dash`) | `em-dash-overuse` | IM · WW |
| Canned opening sentences ("In today's fast-paced world" · "ในยุคดิจิทัลที่…") | Open with what only this product can do | `stock-opener` | 2S · WW |
| Short fragments split by full stops ("Fast. Simple. Powerful.") · sets of 3 · feature names of 2 nouns | A full sentence that carries information | | SJ · CM · WW · OW |
| No names, numbers or dates · claims a competitor could also make | 1 claim only we have, with a number | | 21 · GA · CP |
| Fake proof: a team photo that is not the team · logos that are not clients · invented personas | Real people, real clients only | | 21 · WW · CP |
| Emoji lined up in a promo line | None, or 1 that means something | | WW · CM |
| "theater" used to wave things off | Say what does not work and why | `theater` | IM (1 source) |
| Overly formal words (utilize · facilitate) · stiff connectors (Moreover) · hedges ("It's important to note") | Ordinary words | `stock-opener` in part | WW · TS |
| Thai: wrong register · ครับ/ค่ะ/pronouns that do not fit the reader · literal-translation idioms · English word order · cutting words until curt | Read aloud · register from the table in `human-writing` `references/thai-grammar.md` section 4 · sentence structure per sections 1–2 of the same file · run `scripts/thai_tells.py` of `human-writing` | | 1S · `thai-grammar` |

## 6 · AI images, logos, posters, posts

| Signal | Use instead | Source |
|---|---|---|
| Smooth pore-free skin · every material glossy in the same way | Keep real texture and marks | KR · BK · MF |
| Saturated color, golden or dramatic light in every scene, even indoors | One light source with a reason, matching shadows | BK · GC · KR |
| Teal-orange tone (the shorter the prompt, the more it happens) | Specify the palette, or order it away | FL · 2S |
| Average-looking, perfect, stereotyped people | Details from observation: place, time, what kind of people | BK · KR · CP |
| A showroom-clean scene | Wrinkles, signs of use, ordinary light | MF · KR |
| Wrong physics: shadows not matching light, wrong reflections, bent lines, unrealistic scale | Check by eye before use | KR · MF |
| Hands, teeth, garbled text, crowds with repeated faces | Zoom to 200% to check · put text in a separate layer | KR · FL · MR |
| Using the first image you get without editing | Crop, edit, adjust (1 source, but matches the principle "edit, do not just accept") | CP |
| Clay 3D / isometric / glossy | A style that fits the brand · real photos | 2S · MF · doc-cover-design item 9 |
| Prompting with adjectives ("premium" · "vibrant") | A named style + reference image + hex | MR · VP · CP |
| A gradient circle logo with a hole in the middle · swoosh curves · infinity · circuit patterns | A shape from something specific (DeepSeek's whale · Midjourney's sailboat) | QW · BU |
| Letters that are almost letters, melting, off symmetry, details lost at small size, raster file only | Vector · test at favicon size · real lettering | BU · KR · MR |
| A poster packed edge to edge, no blank space, tiny paragraphs | 1 hero item · lots of white space · cut words so the key word can be big | MR · KR |
| Many fonts and many image styles in one frame (flat + realistic 3D + textured lettering) | 2–3 fonts, one visual language | MR · KR |
| Text embedded in the image | An editable text layer | KR · MR |
| A feed where each post has a different style | One brand system across every post | KR · PN · 2S |
| Floating glowing circles meaning "technology" · stock photos of handshakes · arrows shooting up | The real thing, or empty space | GD (item 7) (1 source) |

## 7 · Slides, documents, diagrams

| Signal | Use instead | Rule | Source |
|---|---|---|---|
| Every slide has one layout with 3–4 bullets of equal length | Change with the content · have some one-sentence pages | | 2S · GA |
| One title pattern across slides (equal length · Title Case · with a colon) | Title = the conclusion (`human-writing` item 6) | | 2S · TS |
| Line icons and middling images that fit any topic | Real photos, charts, screenshots | | 2S · GA |
| No real data, client details or brand | Put in real data, or `(รอยืนยัน)` | | GA · 21 |
| Every bullet starts in bold | Prose, or a plain list | `bold-first-bullets` | TF · TS |
| Emoji before headings · lots of bold · odd bullet symbols | Plain headings · bold in 2–3 places | `emoji-heading` | TS · WW · 2S |
| Over-formatting: lists everywhere, 4 levels of headings, tables in a short note | Merge sections, cut headings | | TS · UM |
| Ending every section with a summary or opinion | End when it has all been said | | TS · WW |
| References or components that do not exist (dead links · fake DOIs · services the system does not have) | Check every one against the source or code | | TS · IL |
| Default-looking Mermaid: self-placed, tangled arrows with no labels, several flows in one picture | The project's house style · a label on every arrow · 1 flow per picture | | YM · IL |
| Lorem text or "ตัวอย่าง" | Realistic content | `lorem` | IM · ui-craft |

## 8 · Basic quality

Not AI signals directly, but really broken, and the script checks them: an input with only a placeholder (`placeholder-label`) · an image with no src (`broken-image`) · a skipped heading level (`skipped-heading`) · text under 11 px (`tiny-text`) · body line spacing under 1.3 (`tight-leading`) · justified alignment (`justified`) · letter-spaced body text (`wide-body-tracking`) · an all-caps paragraph (`all-caps-body`) · a nearly opaque color over an image (`image-overlay`)
Check only from the rendered page (the script cannot see): text overlapped · overflowing its frame · a menu cut off · lines longer than 75 characters · the first column of uneven length · JavaScript errors on load

**Not signals** (the data does not support them; do not hunt to cut): bento grid · mesh/blob gradient backgrounds (UN)

---

## 9 · Sources

Searched Oct 2026

| Code | Source |
|---|---|
| IM | Impeccable — impeccable.style/slop (61 check rules on the web · 62 in the README as of 2026-10-23 · when this catalog was gathered there were 59 + 6 review items) |
| AN | Anthropic frontend-design skill — skills.sh/anthropics/claude-code/frontend-design · the Process section (draft several ASCII layouts, then compare with the brief) from github.com/anthropics/skills/tree/main/skills/frontend-design · Apache-2.0 · seen 2026-11-10 |
| CM | codemyspec.com/blog/vibe-coded-websites-look-the-same |
| UN | claudecodehq.com/playbooks/unslop-ui |
| SK | skills.cat/skills/funboy322/avoid-ai-design |
| VP | vp0.com/blogs/why-does-my-ai-app-look-generic |
| CV | enter.converge.ai/page/en-US/blog/ai-design-sameness |
| 21 | 21st.dev/blog/website-not-look-ai-generated |
| BL | blode.co/writing/you-dont-have-to-make-ai-slop |
| 2S | 2slides.com/blog/can-ai-make-slides-that-dont-look-ai-generated |
| GA | gamma.app/explore/content/guides/what-ai-makes-presentations-that-dont-look-ai-generated |
| CP | creativepool.com (an article on AI images that all look alike) |
| WW | writewithai.substack.com/p/10-dead-giveaways-your-content-screams |
| SJ | seojuice.com/tools/vibe-coded |
| OW | onlinewritingclub.com |
| TS | techspot.com/news/109186 (a summary of the Wikipedia page "Signs of AI writing") |
| TF | tropes.fyi/tropes/bold-first-bullets |
| UM | unmarkdown.com/blog/how-to-make-chatgpt-output-look-professional |
| IL | ilograph.com/blog/posts/diagrams-ai-can-and-cannot-generate |
| YM | yomotherboard.com/?p=585548 |
| KR | krumzi.com/blog/is-this-image-ai-generated |
| BK | ischool.berkeley.edu (Hany Farid on AI images) |
| MF | meltflexai.com/blog/why-ai-renders-look-fake |
| GC | getcoai.com |
| FL | datalab.flitto.com (orange-teal tone in AI images) |
| MR | mikareyes.com (how to spot and fix AI posters) |
| QW | qwe.edu.pl/tutorial/ai-company-logos-look-like-buttholes-2025 |
| BU | bushe.co/answers/how-to-detect-ai-generated-logos |
| PN | postnitro.ai blog |
| 1S | 1stopasia.com/blog/english-to-thai-ai-translation |
| GD | skill `graphic-design` of `software-development` item 7 (this set's original rules) |
