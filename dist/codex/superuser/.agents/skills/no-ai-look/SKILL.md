---
name: no-ai-look
description: Use when making visuals so they do not look AI-made
---

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
