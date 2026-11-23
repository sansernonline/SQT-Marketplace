# skill: design-references

Use before design work to search live references and colours

# design-references — search real work before designing, then take colors from the chosen work

> **One rule:** every design job starts by taking the project's words and searching live on sites strong in that type of work, then taking style and colors from the closest work as the reference. Do not design from memory or from a stored library, because trends change fast. This skill keeps only a list of sites, not sample work.

**First answer to any design request:** (1) search queries from the project's own words (2) links to real works you opened this round (3) the board and pick question from gate item 3 if the owner is present, otherwise colours or shapes, each colour naming its source. Hex codes and `<svg>` come after step 2, never before. "Just make it, don't ask" skips the questions, not the search. No web tool in this session → give the queries and site links, and say the colours will come from the work the owner picks.

## Use when

- Starting work people must look at: web page · app · dashboard · slide · document · icon · logo · post · illustration · motion
- Having to choose colors or a theme. Even with a brand, still search, to find the structure and elements of the new piece.
- The user says the work looks generic, looks AI-made, or says "go look at real examples first"

Search less but do not skip when: the project already has a look that passed the gate (copy the sibling page per `ui-craft` item 0 · search only the structure of parts it lacks) · the client has a brand guide (use its colors and fonts, search only layout). Not for: work nobody looks at (back-end code · plain text).
Not for: 3 screen directions from colors you already have → `design-direction-lookup` (`--palette`) · icons → `icon-design` · checking finished work → `no-ai-look`.

## Gate before starting (`ด่านก่อนลงมือ`) — every creative job, every time

Every design skill points to this section. If you skip any item, write the reason in the evidence line.

1. **Read the theme**: the section "สไตล์ออกแบบที่ชอบ" (preferred design styles) in `~/.claude/superuser-style.md` (including its subsection "บันทึกการเลือก", the choice log) and anything already locked in the project (brand guide · `DESIGN.md` · style lock · sibling pages). If that section does not exist, note `ไม่มี` (none) and carry on; do not stop to ask. If the theme asks for depth (`มีมิติ` · `แสงเงา` · `ลูกเล่น`) or the owner calls a piece flat (`แบน` · `จืด`), open [`references/depth-and-light.md`](references/depth-and-light.md) and apply it to every direction in item 4.
2. **Search live references** per "Steps" below, **even when a brand or sibling page exists**, and before asking the owner anything. What is locked controls colors and fonts; the search is for the structure, elements and storytelling. A reference counts only if its structure is clearly visible at the size you opened it. **Brand, logo or identity jobs: every candidate passes the checks in [`references/ref-criteria.md`](references/ref-criteria.md)** (curated sources · ≥ 3 Thai pieces for the Thai market · terms from the brief and the owner's traits · scored ≥ 4 of 5 · best image, not the page top · 3 lines under each image · 6–8 pieces in 3 directions; curated sources replace the theme + social minimum of step 2; competitors go to the swap test, not the board). If a theme store blocks bots, try one that opens (wordpress.org/themes) and note which site would not open.
3. **Let the owner pick references from images.** Select 4–8 references that open and really differ, run `board`, open every image, then ask with `AskUserQuestion` (multi-select, no `(แนะนำ)` option). Do not ask when the owner says don't ask, when the owner is away (`unattended-run`), or when the owner already chose this style; then still build the board page as evidence and pick references yourself, noting them under **ตัดสินใจเอง** (decided on my own). A subagent without `AskUserQuestion` sends the board path to the lead. Full rules (option split, liked vs disliked, the 2 allowed asking points) → `references/owner-pick.md`. Once the owner answers, record it per "Remember the owner's taste".
4. **Make 3 really different directions**, different in structure and elements, not only color. Each cites 1 reference opened this round (the owner's picks first). **Before the first shape, fill the borrow sheet and follow [`references/ref-to-design.md`](references/ref-to-design.md)**: borrow the craft (measured proportion · letter construction · material · light), not only the concept; one idea sentence per direction; the flat master passes 16 px · squint · swap before depth; craft check against each reference. Every redo round goes back to the picked references, never to the maker's own idea (2026-11-23: a redo drawn from the agent's own idea got "ไม่สวยเลย นี้ research มายัง"). If the owner is present, pick in the end-of-job question, after the 3 directions pass the eye check in item 5. If not, pick yourself per `parallel-attempts-pick-best` and note it under **ตัดสินใจเอง**. You may make 1 direction when the look is already locked (a piece split off a master · a set with a passed style lock · editing an existing image · reviewing work) and write the reason.
5. **Before sending, check per `no-ai-look`**: the script on HTML/CSS files, and the eye gate on every job. The eye gate needs a fresh agent that did not do this piece to open the real image (`no-ai-look` paragraph "คนที่ไม่ได้ทำต้องตรวจด้วยตา" in item 3.2). The maker's own check does not count. A subagent that cannot call another agent sends the image back to the lead to call `design-critic`, and writes `รอหัวหน้า` (waiting for the lead) in the eye-check field.
6. **Evidence line** at the end of the answer: `ด่านก่อนลงมือ: ธีม <อ่านแล้ว · ไม่มี> · ต้นแบบ <n> ชิ้น <ลิงก์> · เลือกโดย <เจ้าของ ชิ้น n · agent เพราะ…> · แนว <3 · 1 เพราะ…> · no-ai-look <ผล> · ตรวจตา <ชื่อ agent ที่ตรวจ · รอหัวหน้า · ข้าม เพราะ…> · จดรสนิยม <n บรรทัด · ไม่มีการเลือก>` (keep this line in Thai). Brand, logo or identity jobs append the `เกณฑ์ต้นแบบ:` field from `ref-criteria.md` and the `ประกอบชิ้นงาน:` field from `ref-to-design.md`. No such line = the gate has not passed.

## Steps

Commands, examples and bot-blocking cases are in [`references/search-steps.md`](references/search-steps.md); read it before the first search of a session. Bold items cannot be skipped.

1. **Make 3 sets of search terms**, Thai and English: exact · competitor or close · mood (from the owner's "สไตล์ออกแบบที่ชอบ" if any). Style vs ban conflict order: approved brand guide → the owner's direct instruction for this job → `no-ai-look` ban → preferred style.
2. **Search live** with `python scripts/find_refs.py links <ประเภท> "<คำค้น>"`. **Search at least 1 `theme` site and 1 `social` site every time.** **If you cannot run the script, still search** with `WebSearch` `site:<site> <search term>`. **0 references while web search is possible fails the gate**, even if the user says just do it or asks only for a plan.
3. **Pick 4–8 pieces from real work pages opened this round**, noting each name's source (a search link, or `จากความรู้ของ agent`). If 3 of the first 4 look the same, search a 2nd round from the product's world or a neighbouring category and use at least 1 reference from it.
4. **Extract the 8-role colors** with `python scripts/find_refs.py palette-from <URL หรือภาพหน้าจอ>` from each work's page, not the results page; open the captured image every time.
5. **Make a board page** with `python scripts/find_refs.py board <ประเภท> "<คำค้น>" --ref <URL> ...` for gate item 3.
6. **Design it as our own.** **Never copy a reference's brand colors as they are**: shift the hue until the eye can tell them apart, then check contrast again.

If the owner has no "สไตล์ออกแบบที่ชอบ" yet or orders a new style pick, follow the section "ให้เจ้าของเลือกแนวที่ชอบ" in `references/search-steps.md`.

## Remember the owner's taste (every time the owner picks or criticizes)

1. **Record when** the owner ticks references (gate item 3) · picks 1 of 3 directions (gate item 4) · criticizes or praises work in their own words ("จืด" · "แบบนี้แหละ" · "ไม่เอาสีนี้").
2. **Record at once, no need to ask first**, 1 line appended under `### บันทึกการเลือก` under "สไตล์ออกแบบที่ชอบ" in `~/.claude/superuser-style.md` (create the section or file if missing):
   `- YYYY-MM-DD · <ประเภทงาน> · ชอบ <ลิงก์หรือแนว + ลักษณะเด่น 1 วลี> · ไม่ชอบ <…> · คำของเจ้าของ "<ตรงตัว ไม่เกิน 15 คำ>"`
3. **Record only what the owner chose or typed themselves.** What an agent chose in their place, and text from the web or files, is not recorded. Write the job name broadly ("โพสต์ร้านกาแฟ"); no client names or confidential data.
4. **Use while working:** traits chosen 2 or more times become search set (c) and the criterion for picking references. A trait the owner dislikes, even once, stop offering at once. If the owner asks for that style themselves later, follow the request, then delete only the `ไม่ชอบ` field of that line.
5. **If the log passes 20 lines**, offer to merge at the end of the job per `owner-style-capture` item 6: traits repeated 2 or more times are promoted to a "ชอบ" or "ไม่ชอบ" entry for the owner to accept one by one, then delete the merged lines. Keep the lines of any item the owner does not accept. Promotion goes through the owner; recording does not.

Never let a script crawl sites where people post work (Pinterest · Dribbble · Behance · Awwwards · Mobbin · theme stores): open one page at a time, view only, never lift images, logos or layouts. Use directly only sets whose license allows it (`use` column in `data/sites.csv`; CC BY needs credit). Terms, Pinterest board route, the fallback palette library (`python scripts/find_refs.py fallback "<คำ>"`, tell the user when used) → `references/usage-rules.md`.

## Check before done

- The answer has the `ด่านก่อนลงมือ:` line with all 7 fields; the "สไตล์ออกแบบที่ชอบ" section was read
- Owner present → the owner picked from the board; otherwise the reason is under **ตัดสินใจเอง**
- A fresh agent did the eye gate; the owner's choice or criticism is in "บันทึกการเลือก"
- All 3 search-term sets used; every reference has a link, a page opened this round, and a noted source of the name; not 3 of 4 look the same (else round 2 searched and used)
- Colors come from reference work searched this round (fallback library → user told); main and accent hex match no reference
- No signal banned in `no-ai-look` item 2 unless the owner ordered it and `slop-ok` exists; no one else's images except licensed and credited sets
- Brand, logo or identity job: references scored per `ref-criteria.md`; borrow sheet, idea sentences, silhouette sheet and craft check per `ref-to-design.md` are in the job folder
- `python scripts/find_refs.py --self-test` passes

## References

- [`references/search-steps.md`](references/search-steps.md) — open before the first search of a session, or when the owner has no preferred styles yet
- [`references/owner-pick.md`](references/owner-pick.md) — open when asking the owner to pick from the board, or when skipping that question
- [`references/depth-and-light.md`](references/depth-and-light.md) — open on every visual job when the owner's theme asks for depth or calls work flat: 3 layers, one light source, 1–2 flourishes, and the limits that keep it from looking AI-made
- [`references/ref-criteria.md`](references/ref-criteria.md) — open before searching for any brand, logo or identity job and before building the pick board: 30 checks on sources, terms, credibility, quality, diversity, Thai market fit, owner taste, timelessness, ethics and board layout
- [`references/ref-to-design.md`](references/ref-to-design.md) — open after the owner picks and before drawing: the borrow sheet and 51 rules on analysing, borrowing without copying, mapping to the client, mark craft, combining, colour and type, depth and material, mockups and checks, presenting
- [`references/usage-rules.md`](references/usage-rules.md) — open when fetching from sites that post work, reusing any asset, or using the fallback library · has a real example
- Sources and check dates: [`references/sources.md`](references/sources.md)


## reference: depth-and-light.md

# Depth, light and flourish · design-references

Open on any visual job (poster · banner · social post · slide · deck · screen · cover) when the owner's "สไตล์ออกแบบที่ชอบ" asks for depth (`มีมิติ` · `แสงเงา` · `ลูกเล่น`), or when the owner calls a piece flat or bland (`แบน` · `จืด`). The owner asked for this on every design job, not one kind (2026-11-17, from a red-white Thai company profile deck they liked; that deck's full page system is in graphic-design `style-consistency/references/corporate-profile-deck.md`).

Goal: the page reads as 3 layers with one light source, and has 1–2 moving elements, while the text stays flat and easy to read.

## 1 · Build 3 layers

| Layer | What goes there | How it looks |
|---|---|---|
| Back | photo, soft gradient, 1–3 faint diagonal light streaks (not a repeating stripe pattern), a big curved ribbon at one corner | low contrast, slightly blurred or faded into the background colour |
| Middle | white cards, panels, the bottom strip | solid surface with a soft shadow, large corner radius (on 1920 px slides use 24–27 px, which the `no-ai-look` script accepts; only a really large panel may go to 28 px or more, with `slop-ok: huge-radius` and the reason) |
| Front | icon tiles, number tabs, labels, buttons, the product | brand colour with its own gradient and a tighter shadow; **crosses the edge** of the card behind it. An icon tile earns its place by that overlap and by meaning something; a tile parked above every card heading is the `no-ai-look` "icon tile above a heading" signal |

In the owner's deck the overlaps carry most of the depth, more than the shadows (eye read 2026-11-17, not measured): an icon tile sitting half over a photo edge, a photo bleeding off the page edge, a label sticking out past a card. Plan at least 2 overlaps per page.

**The back layer needs one strong thing.** A test without photos (2026-11-17, fictional company, 3 slides + 1 banner) came out clean but flatter than the owner's deck: faded line icons in card headers read as filler. Give the back layer one of: a real photo (light agrees with the page) · a large dark or brand-colour block cut on a diagonal (the test cover did this and had the most depth) · a product screen or document mock-up. A faint icon is not enough.

**Break the identical-card grid.** 4 cards that are the same shape with an icon tile each still look like a template (same test). Make one card the lead (larger, darker, or with the photo), or give each card a real number or image instead of a decorative icon.

## 2 · One light source

- Pick one light direction for the whole set (default: from the top left) and write it in the style lock. Every shadow falls the other way; every highlight sits on the lit edge.
- Shadow = 2 layers: a tight contact shadow plus a wide soft one, low opacity, tinted toward the background colour, never pure black.
- Starting point in CSS, not measured, tune by eye:
  `box-shadow: 1px 1px 2px rgb(20 30 40 / .08), 6px 12px 32px -8px rgb(20 30 40 / .14);`
  Front items get a coloured shadow from their own fill, e.g. a red tile `4px 8px 20px -6px rgb(200 8 8 / .35)` (also unmeasured). The positive x offset is what makes the shadow fall away from a top-left light; with x = 0 the light is straight above.
- Accent shapes get a 2-stop gradient of the same hue, lit corner lighter (e.g. `#e81018 → #c00808`, top left to bottom right; the 2 reds were sampled from the owner's deck ± 8, the rest is a starting point). The gradient makes the lit edge; do not add a 1 px border on a box with a wide shadow (`no-ai-look` signal "line + wide shadow", script rule `hairline-shadow`).
- Photos: light in the photo should agree with the page light. Fade a photo into the background with a gradient mask so the photo and the layout become one picture.

## 3 · Flourish (1–2 per page, not more)

How to count: a frame that repeats unchanged on every page of a set counts as **one** flourish, because the eye learns it after page 2, but only if it has at most 2 decorative pieces (e.g. slanted heading bar + slanted label in the bottom strip). A third piece such as a corner ribbon on every page makes the frame count as 2, leaving no room for the page's own. Otherwise the page may add 1 more of its own. Glow is counted separately under its own limit (1 item). A single piece (no set) counts every flourish.

- **Diagonals:** slanted bars before headings, parallelogram labels, a photo cut on a diagonal. They give movement without clutter.
- **Ribbon or sweep:** one large curved band in the brand colour at a page corner, partly behind the content.
- **Light trail with nodes:** a thin glowing line that links 3–5 items, with small bright dots where it meets them. Good on covers and hub diagrams.
- **Glass tile:** a frosted, semi-clear tile only where it sits over a photo, holding one icon.
- **Glow:** only on the single focal item (the hero product, the hub centre). Never on text. It must be visible: on a screenshot, the glow's ring around the item is clearly lighter or more coloured than the background a short way off, so you can see where it ends. A glow hidden behind a white card does nothing, so drop it or move it.
- **Colour on colour:** a line, node or icon that crosses a band of the same colour vanishes (test banner: crimson line over the crimson corner). Switch it to white or the light tint where it crosses.

## 4 · Limits (so it does not turn into an AI look)

`no-ai-look` section 2 lists glow circles, frosted glass across the page and line + wide shadow as default signals. The owner's taste is the reason to use depth, but only inside these limits:

- At most 3 depth levels; text and body copy are flat (no text shadow, no glow, no gradient text).
- One light direction for every shadow on every page of the set.
- Glow on 1 item per page; glass only over photos, never as the page background.
- Shadows soft and tinted; if a shadow is the first thing you notice, halve it.
- Text on glass or photo keeps contrast 4.5:1 or more (sample the darkest and lightest pixel behind the text on a screenshot and compute the ratio).
- Keep the colour count: depth comes from light and dark of the same hue, not new colours.

## 5 · Check before sending

1. Squint test: blur the page; you can still tell back, middle and front apart.
2. Every shadow points the same way (look at 3 random items).
3. At least 2 overlaps on the page; the page is not all boxes side by side.
4. Count flourishes per the counting rule in section 3 (frame of at most 2 pieces = 1, plus at most 1 of the page's own); glow on at most 1 item, and visible.
5. Read every line of text at 50% zoom; nothing is lost in a glow, glass or photo.
6. Put it next to the owner's liked example (deck in `corporate-profile-deck.md`): if yours is clearly flatter, the back layer is missing its strong thing.

## Tools

| Tool | Depth | Light | Flourish |
|---|---|---|---|
| HTML/CSS | `box-shadow` layers · `z-index` · negative margins for overlap | `linear-gradient` · `mask-image` to fade photos | `clip-path` for diagonals · SVG path for ribbons and trails · `backdrop-filter` for glass (over photos only) |
| Canva | Effects → Shadows (Drop, soft) · arrange forward/back | gradient elements · photo transparency + gradient overlay | rotated rectangles, curve shapes, line + dot elements |
| PowerPoint | Shadow → Outer, offset to match the light | gradient fill (2 stops, same hue) · picture transparency | freeform shapes · parallelogram shape |
| AI image tools | put depth in the brief: "soft light from top left, shallow depth of field" | name the light source and time | never ask the image tool to draw the text; add text as a layer |


## reference: owner-pick.md

# Owner picks references from a board · design-references

Open when you are about to ask the owner to pick references (gate item 3 in `SKILL.md`), or when the owner is absent and you must decide how to skip the question.

Why: an agent picking from thumbnails on its own tends to land on a middle-of-the-road style (2026-10-28: the agent made the image itself, the owner said "bland"; the owner picked Stripe from the image board and the work passed).

- Select 4–8 references that open and really differ, then run `board <ประเภท> "<คำค้น>" --ref <URL> ...` to get one page with numbered screenshots.
- Open every image first. If a pop-up or cookie banner covers one, or the image is blank, drop it or swap it and run again.
- Ask with `AskUserQuestion` as multi-select, tick 1–2 pieces, and put the board page's path in the question. 1 question can have 4 options; with 5–8 pieces split into 2 questions of close size (5 pieces split 3 and 2 · 8 pieces split 4 and 4), and the job's other questions this round can have 2 left. Do not add a `(แนะนำ)` (recommended) option, because it is a matter of the owner's taste.
- A ticked piece counts as liked; an unticked piece counts as neutral. Count as disliked only what the owner types themselves.
- A design job may ask the owner at 2 points only: the board page at the start (with the job's other questions this round) and the 3 directions as one question at the end per `autonomy` section "เริ่มแล้วไม่หยุดถาม" (start and do not stop to ask). Do not ask in between.
- Do not ask when the owner says don't ask, when working while the owner is away (`unattended-run`), or when this piece uses a style the owner already chose. If you asked and got no answer, act as if you did not ask. In these cases still build the board page as evidence for the owner to open later, and the agent picks the references that fit "สไตล์ออกแบบที่ชอบ" and notes them under **ตัดสินใจเอง** (decided on my own).
- If the worker is a subagent without `AskUserQuestion`, send the board page's path back to the lead; the lead asks the owner and sends the answer back.
- Once the owner answers, record it at once per the section "Remember the owner's taste" in `SKILL.md`.

A reference only counts if its structure is clearly visible at the size you opened it. A thumbnail that shows only color, or a blank space where the image has not loaded, does not count. Theme stores blocking bots is normal (ThemeForest · TemplateMonster blocked bots 2026-11-06); try a store that opens, such as wordpress.org/themes, and note which site would not open.


## reference: ref-criteria.md

# Criteria for finding and choosing references · design-references

Open before searching for any brand, logo or identity job, and again before building the pick board (gate items 2–3 in `SKILL.md`). Every rule below is a check: run it, write the result under the board, drop or replace what fails.

Why this file exists: on 2026-11-23 a builder logo round was made from 2 news pages plus the agent's own idea, and the owner asked "ไม่สวยเลย นี้ research มายัง" (not beautiful at all, did you research?). The next board of 7 real studio pages, picked by the owner, lifted the scores from 5–6 to 6–7. The old filter was "the page loaded and looks different", which keeps weak work. Labels: `จากแหล่ง` = 2+ independent sources opened agree · `อนุมาน` = one source or our own inference (numbers are starting points; tune them from owner scores). Sources: [`sources.md`](sources.md) section "Reference criteria".

## A · Where to search

For brand, logo and identity jobs these rules replace the general minimum in `SKILL.md` step 2 (1 `theme` + 1 `social` site): theme stores hold no logos, and social sites (Pinterest · Dribbble · Behance) are view-only leads that must be traced to the studio's page (rule 2) before they count. Competitor names from search set (b) go to the swap test, not the board (rule 25).


1. **Curated sources first**: sites with an editor or jury (Brand New "Reviewed" · The Brand Identity · World Brand Design Society · Creative Boom · award pages such as DEmark, RGD, iF), then studio portfolio pages. General image search and SEO listicles never count. Check: every piece names the curated source it came from. `จากแหล่ง`
2. **Open the studio's own project page**, not a repost, a Pinterest pin or an aggregator thumbnail. Check: the board link points to the studio, the photographer or the award page. `จากแหล่ง`
3. **At least 3 of 6–8 pieces come from Thai work or the Thai market** when the client sells in Thailand (Thai studios, DEmark winners, Thai brands). Check: count them; fewer than 3 → search again in Thai before building the board. `จากแหล่ง` that Thai context changes the look · the number 3 `อนุมาน`
4. **One piece from a different industry** that solves the same feeling (a builder board may hold a luxury watch or a stone-cladding supplier). Check: at least 1 piece outside the client's category. `จากแหล่ง`
5. **A blocked page is not a reason to drop the best piece.** If the strongest result blocks scripts (Cloudflare · 403), note it, open it another way (a browser screenshot by the owner, the studio's own site, an award page about the same project), or say on the board which strong piece could not be shown. `อนุมาน` (2026-11-23: DesignRush, Design Week and iF blocked the script; three candidates vanished silently)

## B · Search terms

6. **Terms come from the brief, not only the industry.** Each set holds 4 parts: business type + 4–5 mood words + market or language + mark type (wordmark · monogram · symbol · emblem · mascot). Check: every term traces back to a sentence in the brief or the owner's words; write the terms under the board. `จากแหล่ง` for "terms come from the brief" · the 4-part formula `อนุมาน`
7. **Put the owner's taste into the terms**: traits the owner chose twice or more in "บันทึกการเลือก" (choice log) of `~/.claude/superuser-style.md` (for example "dimensional", "real material", "premium") become mood words. A trait the owner disliked becomes a "not" filter. Check: the mood words include at least 1 owner trait. `อนุมาน` (2026-11-23: terms held only the industry, the owner's "มีมิติ" was missing)
8. **Search in Thai and English.** When the name is Thai, add Thai type terms (แบบมีหัว / ไม่มีหัว · ป้ายเขียนมือ · ลายไทยร่วมสมัย). Check: at least 1 result set came from a Thai query. `อนุมาน`
9. **Search the mark type the brief needs, not just "logo".** A builder that wants a premium letter mark searches "monogram stone", "lettermark construction"; a shop that sells one product searches the product as an object. Check: at least 2 queries name a mark type. `อนุมาน` (2026-11-23: the owner picked letter marks for the builder but objects for payment and delivery)

## C · Is the source credible

10. **Keep only work that names the studio, the client and the year.** Missing any of the 3 → drop it. `จากแหล่ง`
11. **Prefer work that is in real use** and shows at least 2 real applications (sign · cup · package · app · vehicle) over a single concept render. `อนุมาน`
12. **Score every candidate before the board**, 0/1 each: (1) studio, client and year named (2) came through a curated source (3) shows real use (4) fits the brief (5) the type or lettering is well made. Keep 4 or more; rank by score and then by fit to the owner's taste. Write the scores under the board. `อนุมาน`

## D · Quality of one reference

13. **Use the best image of the work**, a close-up of the mark or the strongest application, cropped clean with no website menu. Never the page-top screenshot. Check: the board image shows the mark large and clear. `อนุมาน` (2026-11-23: boards showed page headers and cookie bars)
14. **Simple, memorable, fast to read**: after 5 seconds with the name covered, you can sketch the main shape. Cannot → drop. `จากแหล่ง`
15. **Judge "right for its own client" before "pretty"**, then ask whether our client has the same conditions. Write 1 line per piece: "works for <client> because …; ours has / lacks the same …". `จากแหล่ง`
16. **Name what makes it beautiful**, in craft words, not adjectives: proportion, negative space, stroke contrast, colour ratio, material, photography and light, letter construction. This line goes under the image and is the seed of the borrow sheet in [`ref-to-design.md`](ref-to-design.md). Check: no line is only "clean" or "modern". `จากแหล่ง`

## E · Diversity of the set

17. **At least 3 really different directions**, every piece in exactly one direction; pieces inside a direction share one tone (never serious mixed with playful). Directions differ in at least 2 of form, colour, type. `จากแหล่ง` · 2–3 pieces per direction `อนุมาน`
18. **If 3 of the first 4 look the same, search a 2nd round** from the product's world or a neighbouring category, and use at least 1 piece from it (rule already in `search-steps.md` step 3). `จากแหล่ง`
19. **Include at least one direction of the kind the owner has rewarded before** for a similar business (choice log), and at least one the owner has not seen, so taste can move. `อนุมาน`

## F · Fit to the business and market

20. **Thai-ness is contemporary, not ornament.** Say where the Thai feel sits (colour · words · story · letterforms); a piece whose only Thai element is a decorative pattern gets lower weight. `จากแหล่ง`
21. **Thai lettering must be well made**: zoom on upper and lower vowels and tone marks; no collisions, readable small. `จากแหล่ง`
22. **Works for a small business's real touchpoints**: storefront sign, cup or bag, LINE / social avatar. Check: the mark still reads at 48 px. `อนุมาน`

## G · Fit to the owner's taste

23. **Show the owner's words as 4–5 mood words** at the top of the board, and let the owner tick "keep" and type "avoid". Record both per "Remember the owner's taste" in `SKILL.md`. `จากแหล่ง`

## H · Timeless versus trend

24. **Most pieces should be marks still in use after about 5 years; at most 1 trend piece**, and only with a reason for this client. Write the year of each piece. `จากแหล่ง` · numbers `อนุมาน`
25. **Keep competitor analysis off the pick board.** Competitors go in a separate swap test ([`ref-to-design.md`](ref-to-design.md) rule 11); the board shows inspiration only. `จากแหล่ง`

## I · Law and ethics

26. **Inspiration for direction only**: the final piece must differ clearly; never trace an outline or a layout. `จากแหล่ง` (not legal advice; Thai law not checked)
27. **Keep the link and credit of every image; the board is an internal document**, never part of a delivery or a public post. `อนุมาน`

## J · How the board is shown

28. **6–8 pieces in 3 named directions** for brand, logo and identity jobs; this overrides the general 4–8 in `SKILL.md` and `owner-pick.md`, which still applies to other design jobs. `อนุมาน`
29. **Three lines under every image**: source (studio · client · year · link) · why it was chosen (rule 15) · what makes it beautiful and what we would borrow (rule 16: colour, shape, type or finish). Ask "ชอบตรงไหน" (which part do you like) inside the same board question as a free note, never as a separate question (`owner-pick.md` allows 2 asking points); record the answer. `จากแหล่ง` for captions with reasons · the craft wording `อนุมาน`
30. **Evidence line**: add `เกณฑ์ต้นแบบ: ไทย n/8 · คะแนน ≥4 n/8 · ทิศทาง n · ต่างอุตสาหกรรม n · เปิดไม่ได้ <list>` (reference criteria: Thai n of 8 · score ≥ 4 n of 8 · directions n · other-industry n · could not open) to the `ด่านก่อนลงมือ:` line. No line = gate item 2 not passed.


## reference: ref-to-design.md

# Turning chosen references into the piece · design-references

Open after the owner picks references and before drawing anything (gate item 4 in `SKILL.md`). Fill the **borrow sheet** (section 0), then follow the rules while drawing, then run the checks in section H before the eye gate.

Why this file exists: on 2026-11-23 three logo rounds borrowed only the concept of each reference (an H made of stone bars, a chiselled corner) and lost the craft that made the reference beautiful: proportion, letter construction, real material and photographed light. The results read as generic icons and scored 5–7 of 10. Labels: `จากแหล่ง` = 2+ independent sources opened agree · `อนุมาน` = one source or our own inference. Sources: [`sources.md`](sources.md) section "Reference to design".

## 0 · Borrow sheet (write it before the first shape)

One row per picked reference, in the job's working notes:

| Column | Fill with |
|---|---|
| Reference | name · studio · year · link |
| Works for its client because | one mechanism, not an adjective (rule 4) |
| Craft to borrow | measured: proportion ratios · negative space · stroke contrast · corner radius · colour ratio by area · material and finish · light direction and softness · letter construction (rules 1–6) |
| Role in our piece | exactly one of: form · type · colour · finish · scene (rule 30) |
| What we change, because | each change tied to a fact about our client (rule 15) |
| Must not copy | its outline · its distinctive element · its whole layout (rule 7) |

Then write the **one idea** sentence (rule 14) and which references feed it. No sheet = do not draw.

## A · Analyse the reference

1. **Split each reference into named craft properties** before drawing: proportion, construction, negative space, stroke contrast, colour ratio, finish, type pairing. `จากแหล่ง`
2. **Measure, do not eyeball**: stroke to gap, counter to stroke, symbol to wordmark height, gap to cap height. Record the numbers. `อนุมาน`
3. **Record the negative space**: invert or fill the gaps and note which gaps carry meaning. `อนุมาน`
4. **One sentence per reference: "it works because ___"**, naming a mechanism (coin and vault), never "clean" or "modern". `จากแหล่ง`
5. **Study letters at letter level**: stroke contrast, terminals, joins, tracking, baseline, not just the typeface name. `อนุมาน`
6. **Record photography and material**: light direction, softness, shadow density, surface (matte stone · brushed metal · paper), palette of the scene. `อนุมาน`

## B · Borrow the thinking, not the shape

7. **Never reproduce an outline, a letter shape or the distinctive element.** Overlay ours on each reference at the same size; no shared dominant shape. `จากแหล่ง`
8. **Test similarity 4 ways**: looks alike · sounds alike · means alike · same overall impression. A "yes" on the dominant element means redesign (USPTO test; not legal advice; flag a trademark search for a real client). `จากแหล่ง`
9. **At most one reference per element; never a whole composition from one reference.** The borrow sheet shows one source per element. `อนุมาน`
10. **Drop category clichés** even if a reference uses them: list the 5 most common symbols in the category (house roof for builders, arrows for delivery, coins for payment); use none unless twisted with a reason. `จากแหล่ง`
11. **Swap test against 5 real competitors**: put ours among them in grey at equal size; it must be found at a glance. Competitors stay off the owner's board. `จากแหล่ง`
12. **Keep credit** of every reference in the notes; never trace or auto-vectorise one. `อนุมาน`

## C · Map to the client

13. **Start from the name.** Use a wordmark or lettermark unless the business has one everyday object people recognise instantly (a wallet for payment, a parcel for delivery); then the object may lead. Write the reason for any symbol. `จากแหล่ง` · object exception from owner scores 2026-11-23 (wallet 10 · parcel 8 · pin 8)
14. **Write the one idea in one sentence** ("the crossbar is a gold ingot between two stones"). The mark expresses that sentence and no second idea. `จากแหล่ง`
15. **Tie every change from a reference to a client fact** (initial, meaning of the name, product, place). `จากแหล่ง`
16. **Appropriate in tone, not a literal picture of the product.** Literal pictograms drift to clip art. `จากแหล่ง`
17. **A second reading only if planned** (H that is also a house); never claim one that is not drawn. `อนุมาน`

## D · Mark craft

18. **Black on white first**; colour and depth come after the form passes. `จากแหล่ง`
19. **Reads at 16 px and at about 1 inch.** Export 16 · 32 · 64 px and check the key shape and gap at 100 %. `จากแหล่ง`
20. **Minimum feature**: no stroke, gap or counter thinner than 1/16 of the mark height; at 16 px drop what does not survive, or make a small-size master. `อนุมาน`
21. **Squint / blur test**: after blur a distinct silhouette and main gap remain, unlike the competitor set. `จากแหล่ง`
22. **2–3 basic shapes with deliberate, unusual proportions**; more than about 4 primitives → simplify. `จากแหล่ง` · the number `อนุมาน`
23. **One stroke weight, one corner radius, one terminal style** across the mark and its companions (at most 2 values each). `อนุมาน`
24. **Optical corrections**: round shapes overshoot flat ones by about 1–3 % of the height; fix by eye what the grid gets wrong. `จากแหล่ง`
25. **Reversed version a touch lighter**: white on dark looks heavier. `อนุมาน`
26. **Grids and ratios guide construction; never add golden-ratio overlays afterwards** to justify a mark. `อนุมาน`
27. **Customise at least one letter with a reason** (cut, join, reshape), then re-space by eye. `จากแหล่ง`
28. **Space letters by area, not equal gaps**; blur the word and the texture looks even. `อนุมาน`

## E · Combine references

29. **One dominant idea; at most 2 borrowed principles + 1 client twist.** The idea sentence has no "and also". `จากแหล่ง` · the numeric cap `อนุมาน`
30. **Give each picked reference one role** (form · type · colour · finish · scene) and do not average them; averaging gives the generic middle. `อนุมาน`
31. **Many rough silhouettes, few finished directions**: at least 12 quick silhouette variants (an SVG agent's sketch sheet) before refining 3. Keep the sheet in the job folder; it is a working file, not something to show the owner. `จากแหล่ง` that practitioners sketch 30+ before refining · the SVG silhouette form and the floor of 12 `อนุมาน`
32. **Silhouettes before detail**: first round is flat shapes only, no gradients or shadows (the agent's form of "pencil first"). `จากแหล่ง` for rough-first · the flat-SVG form `อนุมาน`
33. **Stay with a promising idea** for 3+ rounds before switching; switch references only when it stalls, and log why. `อนุมาน`

## F · Colour and type

34. **1–3 colours; make full-colour, one-colour and reversed versions.** `อนุมาน`
35. **Keep the reference's colour ratio by area** (dominant · accent · neutral within about 10 points); change hue only for a client reason, and never copy a reference's brand hex (rule in `search-steps.md` step 6). `อนุมาน`
36. **Contrast 3:1 or more** for mark colours on light and dark backgrounds (WCAG 1.4.11). `อนุมาน`
37. **Type pairs are concord or contrast, never conflict**: one family in clearly different weights, or clearly different faces. `จากแหล่ง`
38. **At most 2 typefaces; one carries the personality.** Thai and Latin faces are chosen as a pair (matching weight and x-height feel). `อนุมาน`

## G · Depth, material, light

39. **The flat master passes rules 18–21 first; the dimensional version is the hero.** Depth never rescues a weak form. `จากแหล่ง` for "flat master first" · the dimensional hero comes from the owner's taste ("มีมิติ แสงเงา" 2026-11-17, OnNing wallet 10/10 2026-11-23), not from the sources, which keep the master flat and render material only on mockups
40. **Copy material from a real photo**, not from a generic gradient: highlight shape, bevel width, roughness, shadow softness, side by side with the photo. Prefer compositing a real licensed texture or photo over code gradients for stone, metal, paper. `อนุมาน`
41. **One light for the whole scene**: same direction, warmth and softness on mark, object and background ([`depth-and-light.md`](depth-and-light.md)). `อนุมาน`
42. **Set depth numbers**: extrusion depth, mounting distance, cast-shadow offset; check at the final size. `อนุมาน`

## H · Mockups and checks

43. **Real touchpoints at believable scale** (sign, card, cup, app icon, favicon); note the real size. `จากแหล่ง`
44. **Straight-on or flat-lay mockups**, not dramatic angles. `จากแหล่ง`
45. **The scene light and palette match the lead reference's photography** (rule 6); composited signs get a contact shadow, the wall's texture and the photo's light direction. `อนุมาน`
46. **Craft check against each reference**: a row per rule-1 property, ours versus the reference, pass or fail. A fail on proportion, letter construction or material sends the piece back before the eye gate. `อนุมาน`
47. **Performance before taste**: one idea · 16 px · one colour · squint · swap · similarity, scored per candidate before anyone's opinion. `จากแหล่ง`
48. **Memory test**: a fresh reviewer sees the mark once, then sketches its main shape from memory; the main shape must match. `อนุมาน`

## I · Presenting to the owner

49. **3 directions spanning risk** (safe · adventurous · bold), each fully crafted: mono mark, reversed mark, 16 px view, 2+ mockups. `อนุมาน`
50. **Lead with the strongest; one paragraph of story per direction**, naming which reference fed it and what was borrowed. `จากแหล่ง`
51. **Evidence line**: add `ประกอบชิ้นงาน: ตารางยืม <มี · ไม่มี> · แนวคิดหนึ่งประโยค <n/3> · ร่างเงา <n> แบบ · ตรวจฝีมือเทียบต้นแบบ <ผ่าน n/3> · swap <ผ่าน n/3>` (composition: borrow sheet yes/no · idea sentence n of 3 · silhouettes n · craft check passed n of 3 · swap passed n of 3) to the `ด่านก่อนลงมือ:` line. No line = gate item 4 not passed.


## reference: search-steps.md

# design-references — full reference-search steps

> Extension of the "Steps" section of `SKILL.md`. The rules that cannot be skipped (gate before starting · 0 references = fail · search `theme` + `social` every time · never copy a reference's colors as they are) are in `SKILL.md`. Commands in this file run from the skill's folder (`scripts/find_refs.py`).

## Contents

- Search and extract colors (steps 1–6)
- Let the owner pick the styles they like (do it the first time, or when asked)

## Search and extract colors

1. **Make 3 sets of search terms** from the project, in both Thai and English: (a) exact, such as "ร้านกาแฟ specialty" (b) close or competitor, such as "third wave coffee · Blue Bottle" (c) the mood wanted, such as "อบอุ่น มินิมอล". The script converts common Thai terms to English.
   - **The owner has a preferred style** (section "สไตล์ออกแบบที่ชอบ" (preferred design styles) in `~/.claude/superuser-style.md`) → set (c) uses search terms from that section, and when picking work in step 3, choose work that fits that style first. If the client has a brand guide, borrow only the layout, not the colors. If the user sends a new image they like → turn it into search terms and key traits and add them to that section; do not store the image.
   - **The preferred style clashes with a ban in `no-ai-look` item 2** (such as purple-blue gradients · frosted glass across the whole page · a centered hero) use this order: brand guide or approved look → the owner's direct instruction for this job → `no-ai-look` bans → preferred style. This means the preferred style is used to choose the direction (structure, density, mood), but the banned signal itself is not brought in. If the owner directly orders that signal in this job, it may be used; write `slop-ok: <rule> เจ้าของสั่ง <date>` in the file.
2. **Open the search links of sites that are good at that kind of work**
   ```bash
   python scripts/find_refs.py links <ประเภท> "<คำค้น>"
   ```
   Types: `web` · `app` · `dashboard` · `theme` (stores that sell themes and templates) · `slide` · `document` · `social` (Pinterest · Dribbble · Behance and galleries where people post work) · `poster` · `product` (packaging) · `banner` · `logo` · `icon` · `illustration` · `3d` · `color` · `font` · `motion` (136 sites in [`data/sites.csv`](../data/sites.csv), the one file this skill keeps). **Search at least 1 site from `theme` and 1 from `social` every time**, because that is where work that really sells and work designers post lives (owner's order 2026-10-29). If a site of that type will not open (bot blocking), try the next site of the same type. If every site fails, note that it could not be opened and carry on. Icons and licensed images can be searched live with `icons` and `openverse`.
   - **Cannot run the script (no Bash) — still must search.** Use `WebSearch` directly with `site:<site> <English search term>` on at least 1 `theme` site and 1 `social` site, then `WebFetch` the work pages found. If `WebSearch` is not in the tool list, load it with `ToolSearch` first. Take colors from CSS or color codes on the opened page, or say you will extract them from the chosen piece; never offer color codes from a feeling.
   - **Answering with 0 references while web search is still possible = fails the gate**, even if the user says just do it, asks only for a plan, or the job's skill says ask the owner first. Search first, then ask with the references found (eval 2026-11-10: opened the skill and answered at once without searching, offered 4 color sets from feeling, 2 of 2 rounds).
3. **Pick 4–8 pieces closest to the project** (the same count as gate item 3 in `SKILL.md`), judged from the real thing (open each work page or capture it), not from the name. Keep the links in the project's document, not in the skill. If opening the sites yourself is not enough to pick, send the `board` page with links only (step 5 without `--ref`) for the user to click through and choose. The script converts common Thai terms; if the links still have Thai words left, write English terms yourself and run again.
   - **Open the real reference web page of every piece in this round** (browser, capture, or `palette-from`) and note beside the link where the name came from: which site's search link with which search term, or `จากความรู้ของ agent` (from the agent's own knowledge). Competitor names you think of yourself are fine, but you must open the real page and note that it came from knowledge; never write that it was searched. Page not yet really opened = not yet a reference.
   - **Do 3 of the first 4 references look the same?** (same background, main color and opening structure, such as dev-tools with a dark background + neon on every piece) If yes, you have the category average, not a reference. Search a 2nd round from the product's world (things the user really touches, labels, manuals, documents of the field) or a neighbouring category (such as dev-tool → publishers · machine manuals · hardware stores). At least 1 reference actually used must come from round 2.
4. **Extract the 8-role colors from the chosen work**
   ```bash
   python scripts/find_refs.py palette-from <URL หรือไฟล์ภาพหน้าจอ>
   ```
   You get background · secondary background · text · secondary text · main color · secondary color · accent color · border, with contrast values (text 4.5:1 · main color 3:1, adjusted automatically) and a `--palette` line that goes straight into `design_draft.py`. **Extract from each work's page or a screenshot of the chosen work, not from the search results page**, because that gives the site's own colors. Open the captured image and look at it every time. The script warns when it meets a bot-blocking page, or when almost everything comes out gray (usually a cookie banner or a page that has not loaded). Then have the user take a screenshot themselves and send the image file instead.
5. **Combine into one page for the user to see**
   ```bash
   python scripts/find_refs.py board <ประเภท> "<คำค้น>" --ref <URL> --ref <URL> --out _to_delete/refs/board.html
   ```
   Let the owner pick references from this page per item 3 of the "gate before starting" in `SKILL.md`, before starting work.
6. **Design it as our own** with the chosen colors and theme, following that job's skill. **Never copy a reference's brand colors as they are**: shift the hue until the eye can tell them apart, then check contrast again (the same way `design-direction-lookup` treats colors from `brand_colors.py`). Check: does the hex of the main or accent color match any reference's color? If it does, it has not been shifted. The project's document records the source truthfully as "shifted hue from reference <link>"; do not write that the user sent the colors.

## Let the owner pick the styles they like (do it the first time, or when asked)

1. Pick 10–14 real sites with clearly different styles (corporate white · glowing dark · black-and-white grid lines · warm magazine · hand drawn · saturated color · 3D product, and so on). Company sites capture better than Dribbble (bot blocking).
2. `board <ประเภท> "<คำ>" --ref <URL> ...` gives one page with numbered screenshots and the 8-role colors. Open every image; if a pop-up or cookie banner covers one, drop it and build again.
3. The owner answers with numbers, "like · dislike" → write them under the section "สไตล์ออกแบบที่ชอบ" (preferred design styles) in `~/.claude/superuser-style.md`, one line per item: link · key traits · search terms. Write disliked styles briefly and use them per item 4 of "จำรสนิยมของเจ้าของ" (remember the owner's taste) in `SKILL.md`.
4. While working: open the links of the liked style as examples first → use that style's search terms to search live per the steps above, find work in the same style that fits the project's brief → extract colors from the work found, never use colors straight from the sites in the list. If a link is dead or the site has changed style, tell the owner and offer a new pick.


## reference: sources.md

# Sources · design-references

- Site list and terms of use: searched and read 2026-10-27 (Iconify API · Openverse API · terms pages of Dribbble · Behance/Adobe · Pinterest · Canva · Freepik/Magnific · unDraw). The search-link format of some sites has not been checked one by one; if a link does not lead to a results page, open the site's home page and search yourself (ยังไม่ได้ตรวจ, not yet checked).
- Terms read 2026-10-29: [Pinterest Terms](https://policy.pinterest.com/en/terms-of-service) (effective 2025-04-30) · [Envato API Terms](https://build.envato.com/terms/) (amended 2025-03-11) · [Pinterest access tiers](https://developers.pinterest.com/docs/key-concepts/access-tiers/) (seen through search results, full page not opened) · 85 sites added 2026-10-29 checked with curl: 70 open · 12 bot-blocked or rate-limited (probably open in a browser, not checked one by one) · 3 links with 404 fixed
- Contrast thresholds 4.5:1 and 3:1: WCAG 2.2 items 1.4.3 and 1.4.11
- Fallback library: mattdesl/dictionary-of-colour-combinations (MIT) · huggingface-projects/color-palettes-sd (CC BY 4.0) · see file `data/palettes-fallback-LICENSE.md`
- Decision dates: no design from memory or a stored library (user's decision 2026-10-27) · search before every creative job (owner's order 2026-11-06) · eval 2026-11-10: drew SVG or picked colours before searching 3/3 in every case

## Reference criteria (`ref-criteria.md`) · opened 2026-11-23

[NN/g mood boards](https://www.nngroup.com/articles/mood-boards/) · [Armin Vit on effective logo design](https://ebaqdesign.com/podcast/effective-logo-design) · [Brand New about](https://www.underconsideration.com/brandnew/archives/about.php) · [Chermayeff, Geismar, Haviv in Print](https://www.printmag.com/branding-identity-design/marks-men-an-interview-with-ivan-chermayeff-tom-geismar-and-sagi-haviv-of-chermayeff-geisma/) · [Bierut (Intapp)](https://www.intapp.com/blog/michael-bierut-visual-brand/) · [Bierut (It's Nice That)](https://www.itsnicethat.com/features/michael-bierut-logo-design) · [Draplin (Creative Boom)](https://www.creativeboom.com/work/aaron-draplin-on-hard-work-keeping-things-small-and-fun-and-his-honest-design-process/) · [Airey brand identity process](https://www.logodesignlove.com/brand-identity-process) · [Thai design in focus (Branding in Asia)](https://www.brandinginasia.com/thai-design-in-focus-an-interview-with-thitiwat-rungsarityotin-tantip-manomaiphan/) · [Cadson Demak (Granshan)](https://granshan.com/insights/very-well-selected-cadson-demak-and-the-modern-thai-typeface) · [YouMakeMe Mango Tree](https://youmakeme.com/projects/mango-tree/) · [WOLF BKK and Punthai (Hakuhodo)](https://www.hakuhodo-global.com/news/wolf-bkk-and-punthai-coffee-brew-a-stronger-connection-between-thais-and-their-coffee.html) · [DEmark](https://designwanted.com/design-excellence-award-demark-royal-thai-government/) · [Mood board myopia](https://whatsanu.substack.com/p/mood-board-myopia-and-creative-stagnation) · [Moodboard is not copying (Kluwer, French case 2021)](https://legalblogs.wolterskluwer.com/trademark-blog/using-the-inspiration-of-a-moodboard-is-not-copying/) · [Illinois library: finding images](https://guides.library.illinois.edu/GD_Resources/finding_images) · [Design fixation (AI EDAM abstract)](https://www.cambridge.org/core/journals/ai-edam/article/abs/overcoming-design-fixation-design-by-analogy-studies-and-nonintuitive-findings/038760839BBBEFC08F146457A77BBE51) · Not opened: AIGA standards (403) · Monocle (403) · 99% Invisible on Geismar (timeout) · Thai law on using references not checked.

## Reference to design (`ref-to-design.md`) · opened 2026-11-23

[Airey logo design tips](https://www.logodesignlove.com/logo-design-tips) · [Airey on sketching](https://archive.davidairey.com/?p=393) · [Sagi Haviv interview](https://www.logodesignlove.com/sagi-haviv-interview) · [CGH 60 years](https://www.logodesignlove.com/chermayeff-geismar-haviv-60-years) · [Rand: logos, flags and escutcheons](https://www.paulrand.design/writing/articles/1991-logos-flags-and-escutcheons.html) · [Rand ID interview 1988](https://www.paulrand.design/life/interviews/1988-id-magazine.html) · [Bierut (Azure)](https://www.azuremagazine.com/article/the-lazy-designers-guide-to-success/) · [Bierut talking logos](https://www.logodesignlove.com/michael-bierut-talking-logos) · [USPTO likelihood of confusion](https://www.uspto.gov/trademarks/search/likelihood-confusion) · [Optical corrections (Logo Geek)](https://logogeek.uk/?p=2617) · [Logo blur test (Jim Nielsen)](https://blog.jim-nielsen.com/2014/logo-integrity/) · [Five-second test (Smashing)](https://smashingmagazine.com/2023/12/five-second-testing-case-study) · [Design workflow (Smashing)](https://smashingmagazine.com/2016/02/design-workflow/) · [How many options (Logo Design Love)](https://www.logodesignlove.com/how-many-options) · [Lettering tips (Lattice)](https://design.lattice.com/articles/lettering-tips-for-drawing-letters) · Seen only in search results, not opened: Kleon "Steal Like an Artist" · Hische talk · Lupton on type pairing · vendor mockup pages on material and light. Rules on photography, material and colour ratio are `อนุมาน`: no practitioner source was found.


## reference: usage-rules.md

# Rules for using other people's work · design-references

Open when a script would fetch from a site that posts work, when the owner wants Pinterest examples as a set, when you want to reuse any image or layout, or when live search is impossible and you need the fallback library.

- **Theme stores and sites where people post work: have a person or agent open them one page at a time; do not pull them in batches with a script.** Pinterest forbids collecting data by automated means without permission (terms, item 2(a)). The Envato API (ThemeForest · Elements) forbids data mining or image-collecting tools (item 11.2) and lets you keep data only for a reasonable period (item 11.6). If the owner wants Pinterest examples as a set → have the owner save pins to their own board, then read through the official Pinterest API (scopes `boards:read` · `pins:read` are available from Trial access, but there are reports that an app awaiting approval cannot call them (รอยืนยัน, awaiting confirmation)).
- Work from Pinterest · Dribbble · Behance · Awwwards · Mobbin **is for viewing as a reference only.** Never lift images, logos or a whole page's layout into the work. Never let a script crawl these sites (the terms ban scraping); open one page at a time as a person picks.
- The only things you can use directly are sets whose license allows it (the `use` column in `sites.csv`). Canva and Freepik may not be used to make trademarks. CC BY sets need credit.
- **Fallback library** `data/palettes-fallback.csv` (2,360 sets of 8 roles · Wada MIT + color-palettes-sd CC BY 4.0), used only when live search is impossible: `python scripts/find_refs.py fallback "<คำ>"`, and tell the user the fallback library was used.

## Real example

**Brief (2026-10-27):** a specialty coffee shop website. **Did:** `links web "ร้านกาแฟ specialty"` gave links to 6 sites · `palette-from https://www.bluebottlecoffee.com`: the script said the site blocks bots, so a screenshot was used instead and gave 8 roles (white background · main color red #bf2a2c, contrast 5.9:1) · passing `--palette` into `design_draft.py` gave 3 directions (editorial · bento · paper-print) that pass contrast on every pair. **Nothing is stored permanently** except links in the project's document.
