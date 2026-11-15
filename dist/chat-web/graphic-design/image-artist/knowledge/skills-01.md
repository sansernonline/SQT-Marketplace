# skill: image-generation

Use when a page needs images and a route must be picked

# Generate real images with AI

> **Gate before you start (every time):** read the owner's theme → search for live references → 3 genuinely different directions → check `no-ai-look` before sending. Follow the "ด่านก่อนลงมือ" (pre-start gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece). Close the work with a `ด่านก่อนลงมือ:` line.

Images in a hero · product or service cards · slides · shop posts · report illustrations → **images that look deliberate**, not basic shapes standing in for the real thing.
No setup and no API key needed → generate with the session's tool → draw a full-scene Scalable Vector Graphics (SVG) illustration → free photos.

## 1 · Ask about the style, once at the start

| Style | Look | Suits |
|---|---|---|
| `photo` | Real photograph | Spas, hotels, restaurants, shops, real estate, clinics |
| `flat` | Flat drawing, plain colours | SaaS, apps, online services, onboarding pages |
| `3d` | Soft-surface 3D picture | Fintech, games, toys, tech product launch pages |
| `watercolor` | Hand-painted watercolor | Thai themes, crafts, cafes, florists, children's work |
| `line` | Single-colour line art | Manuals, documents, pages that must be very plain |
| `isometric` | Angled 3D view | Explaining systems, factories, IoT, logistics |

- The user already said → use that
- You can ask → ask together with the other start-of-work questions in one message
- Nobody answers (an unattended run) → choose from the "Suits" column and note in `## ตัดสินใจเอง` (decided on my own) which style you chose and why
- 1 project = 1 style · mix styles only when the user orders it
- Prompt wording for each style → [`references/styles.md`](references/styles.md)

## 2 · Lock the style before the first image

Before the first image, write **1 paragraph on what this set of images is** (at most 4 sentences) at the top of `image-style.md`: who views it · what they should feel · what this set will never be (for example "not a glossy ad"). Every prompt and every chosen image is compared against this paragraph, not against your taste at the moment.
Write `image-style.md` (kept in `docs/design/` or the work's own folder): style · 3–5 colours (from the brand colours · with no brand → **search for references first:** take the project's keywords and search live following `design-references` (plugin `superuser`), type `illustration`, then extract the colours from the chosen work · the stored palette library is for when live search is impossible) · light · camera angle · what must not appear
→ append this block to every image's prompt → even 20 images still look like one set
(How to write the brief and prompt → `brief-to-image`)

## Write the brief and prompt

The line between the two skills: **this file decides how to get the images** (generate, draw SVG, or find free ones) and makes the image list · **`brief-to-image` writes the brief and prompt** once the generate route is chosen, including how to pick from 3–4 variants (`decision-scoring`, command `score` · for hard scoring use `pairwise` · if results are close, the user chooses) and how to fix a bad image · do not put Thai text inside a generated image, and place it afterward with the brand font

**Keep a set of images consistent** — apply the `image-style.md` block above to every image · lock the same camera angle and light · for a recurring person or character, make 1 reference image first, then reuse the reference image or the same seed · lay all images side by side before sending. Full method → `style-consistency`

## 3 · Make the image list

`image-list.md` (same folder), a table: file name · where used · aspect ratio · what must be visible · status · source (prompt or search terms)
→ no image is missed, none is made beyond need, and each can be recreated later

## 4 · Get the images — in this order, use the first route that works

| Order | Route | Use when |
|---|---|---|
| 1 | **Generate with the image tool the session has** (a Model Context Protocol (MCP) server or an image plugin) | The session has this tool · every style is possible |
| 2 | **Draw SVG as full-scene illustrations, the whole set** | Route 1 is unavailable · for style `photo` → draw detailed illustrations instead and note it in `## ตัดสินใจเอง` |
| 3 | **Free photos from Openverse** — `scripts/fetch_free_image.py`, no key needed | The SVGs fail the beauty gate · or the user says it must be a real photo |

**Route 1 — generate:** prompt = the subject + the style line (`references/styles.md`) + the style block · generate 3 variants per image → open them with `Read` → score by these criteria: matches the brief · text is legible · matches `image-style.md` · can be cropped · a physical impossibility is an iron rule that eliminates the image, not a score (command `score` of `decision-scoring` · details in `brief-to-image`) → pick rank 1 · if only 1 thing is wrong, fix 1 line · if the same thing fails 3 rounds in a row → write a new brief

**Route 2 — draw SVG:** it must be crafted, and the viewer must see at once what it depicts, not basic shapes stacked up (a triangle for a roof, a circle for the sun = the reason websites look like children's cartoons). Full steps and techniques → [`references/svg-illustration.md`](references/svg-illustration.md)
- Look at real reference images before drawing · draw one image at a time
- At least 3 layers: background · middle · front · add depth with gradients and soft shadows
- Include details that tell what the thing is (fabric pattern, leaf veins, steam, wood grain) · draw with curved `path`s, not just `rect` and `circle`
- Colours only from `image-style.md` · the same line weight, corner radius and light direction in every image
- 1 file per image `public/images/<name>.svg` · `viewBox` follows the aspect ratio in `image-list.md` · do not embed in HTML
- Render to PNG and look at it for real with playwright (`_to_delete/`) → **guess test**: a subagent (haiku · answers in at most 3 lines) that does not know the file name must say what the image shows → a second reviewer scores the beauty gate (`ui-craft` (plugin `software-development`) item 9 · answers in at most 10 lines) · if it fails, fix once → if it still fails → go to route 3 for the whole set

**Route 3 — free photos:**
```
python <skill>/scripts/fetch_free_image.py --query "thai massage room" \
  --out public/images/hero.webp --aspect 16:9 --n 3
```
- Search terms in English, short, pointing at things in the picture (`spa towels orchid` is better than `relaxing spa`)
- You get `hero-1` to `hero-3` → open every image → pick 1 and rename it `hero.webp` → move the rest to `_to_delete/` and delete their rows in `CREDITS.md`
- If the style does not match (colour or light does not fit the set) → search new terms, which is better than using an image that breaks the set
- **Use only images that allow both commercial use and modification.** The script already filters (Openverse `license_type=commercial,modification`), so you will not get CC BY-NC (no commercial use) or CC BY-ND (no modification, and cropping counts). Images you find yourself outside the script must be checked for this by you, because a storefront and a sales page are commercial use.
- CC BY images need credit → add an "เครดิตรูปภาพ" (image credits) link in the footer pointing to the page that shows `CREDITS.md`

**Use the same route for the whole set** — do not mix photos and drawings on one page unless the user orders it
Text, prices and Thai wording → put them in HTML, not in the image
For any image not yet done → put an `<img>` using the name in `image-list.md` with `alt` · report the status as `รอรูป` (awaiting image), not `เสร็จ`

## Check before sending

- Open every image actually used: hands, fingers, faces, garbled lettering in the picture, floating objects → if found, regenerate
- Every image matches `image-style.md` (colour, light, angle) when laid side by side
- `.webp` files at most 1920 px wide · at most 300 KB per image · every image has `alt`
- Open the real work (web page, slide, post, document) and check that the images fit the layout

## Prohibitions

- Identifiable real people · another brand's logos, characters or products
- Images from general websites with unknown license · free images with no credit recorded · NC or ND images in commercial work

## Avoid the AI-made look

Before sending, go through item 3 of `no-ai-look` — for HTML work, run its script · every work must also pass eye gate 3.2 (web pages also answer items 10–14), because a script result of 0 issues is not yet a pass · the prohibitions in this file are the part specific to this work, and the full list for every medium is there · every prompt must contain everything required by item 4 of `no-ai-look` (a named style · hex · light · what you do not want)


## reference: styles.md

# Prompt wording by style

Build the prompt in this order: **the subject of the picture** (1 focal point that must be visible) + **the style line** (table below) + **the style block** from `docs/design/image-style.md` (colour, light, angle).
Always send the exclusions: `text, letters, watermark, logo` plus the extras for each style. Pass them the way the session's image tool accepts them (a negative prompt field if it has one; if not, append `Avoid: …` to the prompt). The examples below are written as `--negative` for readability.

| Style | Style line (English, which models understand better) | Extra negative |
|---|---|---|
| `photo` | `editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium` | `illustration, cartoon, 3d render, oversaturated, plastic skin` |
| `flat` | `flat vector illustration, simple geometric shapes, solid colour fills, no gradients, clean negative space` | `photo, realistic, 3d, texture, shadows` |
| `3d` | `tactile 3D object made of one named material (matte card stock with visible fibres, or polymer clay with faint fingerprints), one softbox from the upper left, dark contact shadow plus a soft cast shadow in the same direction, flat backdrop of the same material, one colour from the palette` · one object only · the 8-line template with an example is in `brief-to-image` → `references/prompt-anatomy.md`, section Tactile 3D hero object | `glossy plastic, smooth CGI surface, glow, floating particles, teal-orange grade, gradient backdrop, vignette, clutter` |
| `watercolor` | `hand-painted watercolor illustration, visible paper texture, soft edges, light washes` | `photo, 3d, hard vector edges, neon` |
| `line` | `single-colour line art, even stroke weight, minimal, lots of white space` | `photo, shading, colour fills, texture` |
| `isometric` | `isometric illustration, 30 degree angle, clean geometry, consistent light from top left` | `perspective distortion, photo, blur` |

## Example — a Thai spa, `photo` style

```
Thai traditional massage room with a low mattress, folded white towels and a bowl of
orchid petals, soft afternoon light through a wooden window.
editorial photograph, natural light, 50mm lens, shallow depth of field, realistic textures, calm and premium.
Palette: deep forest green, warm cream, natural teak wood, small gold accent.
Composition: eye-level, subject in left third, empty space on the right for the headline.
```
`--negative "text, letters, watermark, logo, illustration, cartoon, oversaturated, people's faces"` · `--aspect 16:9`

## Aspect ratio by placement

| Placement | `--aspect` |
|---|---|
| Full-width hero | `16:9` |
| Product / service card | `4:3` or `1:1` |
| Pictures of people / therapists / the team | `3:4` or `1:1` |
| Mobile banner / story | `9:16` |
| Social post | `4:5` (see `social-formats` if present) |

## Pictures of people

- Write the role and pose, never a real person's name: `a Thai female therapist in a sage green uniform, smiling, mid-30s`
- For a whole team set, use the same clothing, background and light in every picture
- Check the hands and fingers in every picture. If not needed, choose an angle where the hands do not show.


## reference: svg-illustration.md

# Draw SVG with care — you can tell what the picture is at once

Goal → illustrations at a level usable on a real website, not sketches · someone seeing it for the first time must say what it is within 2 seconds.

## Steps — draw one image at a time, do not draw the whole set in one file in a rush

1. **Look at the real thing first** — find 2–3 reference images of what you will draw (search the web) and note the real shape, proportions and 3 features that make it recognisable (orchid → 5 petals + the lip in the middle + a curved stem)
2. **Lay out the composition** — 1 focal point on a 1/3 line · overlap pieces to give depth · leave empty space as `image-list.md` says (for example room for a heading)
3. **Draw in layers** — background (broad gradients) → middle (supporting objects, slightly blurred or paler) → front (the focal point, sharpest, darkest colour)
4. **Add light and shadow** — set one light direction for the whole set (for example top left) · every piece has a light side, a dark side and a cast shadow on the ground
5. **Add detail** — leaf midrib, fabric weave, wood grain, steam, water drops · most detail at the focal point, least at the edges of the image
6. **Check** — per the section at the end of the file

## Techniques to use

| Topic | Do this | Do not do this |
|---|---|---|
| Shapes | `path` with Bézier curves following the real shape | `rect` `circle` `polygon` alone standing in for the thing |
| Dimension | `linearGradient` with 3–4 colour stops per piece · `radialGradient` for cast light | One flat colour across the whole piece |
| Shadow | `filter` + `feGaussianBlur`, soft shadow at 15–30 % opacity | Hard-edged black shadow |
| Texture | `pattern` of thin lines or `feTurbulence` at low strength (wood, fabric, paper) | Flat fill on every piece |
| Depth | Back pieces smaller, paler, overlapping | Every piece the same size in a row |
| Viewpoint | A slight angle, seeing the top of the table, bowl, folded cloth | Looking straight on at every piece like paper cutouts |
| Outline | No outline, or a line 1 step darker than that piece's fill | Thick black line around every piece |

## Example of the difference — a spa image

- Wrong: a gold triangle on a white rectangle = "temple" · a green rectangle bar = "tree" · a yellow circle = "sun"
- Right: 3 folded white towels stacked, with fold lines and a shadow under each · 3 black stones stacked, with a highlight on top · 1 spray of white orchids, petals with a light purple gradient at the base · a brass bowl reflecting light · a teak wood floor with grain · a blurred leaf backdrop

## Minimum level of care

- hero ≥ 40 `path` · card ≥ 20 `path` · has `defs` that really use gradients and filters
- Use colours from `image-style.md` but break each colour into light, mid and dark shades
- File no larger than 150 KB per image · no raster image embedded inside

## Check before sending

1. Render to PNG at the real size with playwright into `_to_delete/`, then open it with `Read`
2. **Guess test** — send the PNG to a fresh subagent that does not know the file name and does not see the prompt, and ask one thing: "what is this picture?" · a wrong guess or a vague one ("geometric shapes") → redraw
3. **Beauty gate** — another checker scores 1–5 against the reference images on 4 axes: you can tell at once what it is · readable at real size · colours and lines go the same way · does not look AI-made (`no-ai-look`) · every axis ≥ 4 to pass (app screens: the criteria in `ui-craft` item 9 in plugin `software-development`)
4. Lay all images of the set side by side → light direction, lines and colours must match

Fails after 1 round of fixes → go route 3 (free photos) for the whole set


---

# skill: design-references

Use before design work to search live references and colours

# design-references — search real work before designing, then take colors from the chosen work

Lives only in plugin `superuser`; other plugins share it through `dependencies`. Wording follows `human-writing`. Use it before every design skill (`ui-craft` · `presentation-design` · `branded-document-design` · `icon-design` · `brand-kit` · `social-formats`, and so on).

> **One rule:** every design job starts by taking the project's words and searching live on sites strong in that type of work, then taking style and colors from the closest work as the reference. Do not design from memory or from a stored library, because trends change fast (user's decision 2026-10-27). This skill keeps only a list of sites, not sample work.

**Order of the first answer to any design request:** (1) search queries from the project's own words (2) links to real works you opened this round on sites strong in that type, such as Awwwards · Land-book · Dribbble · Behance (3) if the owner is present and did not say "don't ask", the board and the pick question from gate item 3 below; otherwise colours or shapes, each colour naming where it came from (a reference opened this round, or the locked brand guide) · Hex codes and `<svg>` come after step 2, never before · "Just make it, don't ask" skips the questions, not the search · No web tool in this session → give the queries and site links, and say the colours will be taken from the work the owner picks (eval 2026-11-10: drew SVG or picked colours before searching 3/3 in every case)

## Gate before starting (`ด่านก่อนลงมือ`) — every creative job, every time

Owner's order 2026-11-06: whenever a creative job is ordered, always read the theme and search references before starting. Every design skill points to this section. If you skip any item, write the reason in the evidence line.

1. **Read the theme** — the section "สไตล์ออกแบบที่ชอบ" (preferred design styles) in `~/.claude/superuser-style.md` (including its subsection "บันทึกการเลือก", the choice log) and anything already locked in the project (brand guide · `DESIGN.md` · style lock · sibling pages). If that section does not exist, note `ไม่มี` (none) and carry on; do not stop to ask.
2. **Search live references** per the "Steps" section below, **even when a brand or sibling page exists**, and before asking the owner anything (if you cannot run the script, use `WebSearch` instead, per step 2 of the steps). What is locked controls colors and fonts; the search is for the structure, elements and storytelling of the piece being made.
   - A reference only counts if its structure is clearly visible at the size you opened it. A thumbnail that shows only color, or a blank space where the image has not loaded, does not count. Theme stores blocking bots is normal (ThemeForest · TemplateMonster blocked bots 2026-11-06); try a store that opens, such as wordpress.org/themes, and note which site would not open.
3. **Let the owner pick references from images** — an agent picking from thumbnails on its own tends to land on a middle-of-the-road style (2026-10-28: the agent made the image itself, the owner said "bland"; the owner picked Stripe from the image board and the work passed).
   - Select 4–8 references that open and really differ, then run `board <ประเภท> "<คำค้น>" --ref <URL> ...` to get one page with numbered screenshots.
   - Open every image first. If a pop-up or cookie banner covers one, or the image is blank, drop it or swap it and run again.
   - Ask with `AskUserQuestion` as multi-select, tick 1–2 pieces, and put the board page's path in the question. 1 question can have 4 options; with 5–8 pieces split into 2 questions of close size (5 pieces split 3 and 2 · 8 pieces split 4 and 4), and the job's other questions this round can have 2 left. Do not add a `(แนะนำ)` (recommended) option, because it is a matter of the owner's taste.
   - A ticked piece counts as liked; an unticked piece counts as neutral. Count as disliked only what the owner types themselves.
   - A design job may ask the owner at 2 points only: the board page at the start (with the job's other questions this round) and the 3 directions as one question at the end per `autonomy` section "เริ่มแล้วไม่หยุดถาม" (start and do not stop to ask). Do not ask in between.
   - Do not ask when the owner says don't ask, when working while the owner is away (`unattended-run`), or when this piece uses a style the owner already chose. If you asked and got no answer, act as if you did not ask. In these cases still build the board page as evidence for the owner to open later, and the agent picks the references that fit "สไตล์ออกแบบที่ชอบ" and notes them under **ตัดสินใจเอง** (decided on my own).
   - If the worker is a subagent without `AskUserQuestion`, send the board page's path back to the lead; the lead asks the owner and sends the answer back.
   - Once the owner answers, record it at once per the section "Remember the owner's taste".
4. **Make 3 really different directions**, different in structure and elements, not only color. Each direction cites 1 reference opened this round (the owner's picks first). If the owner is present, pick in the end-of-job question, after the 3 directions pass the eye check in item 5. If not present, pick yourself per `parallel-attempts-pick-best` and note it under **ตัดสินใจเอง**. You may make 1 direction when the look is already locked (a piece split off a master · a set with a passed style lock · editing an existing image · reviewing work) and write the reason.
5. **Before sending, check per `no-ai-look`** — the script on HTML/CSS files and the eye gate on every job. The eye gate needs a fresh agent that did not do this piece to open the real image (`no-ai-look` paragraph "คนที่ไม่ได้ทำต้องตรวจด้วยตา" (someone who did not make it must check by eye) in item 3.2). The maker's own check does not count. If the worker is a subagent that cannot call another agent, send the image back to the lead to call `design-critic`, and write `รอหัวหน้า` (waiting for the lead) in the eye-check field.
6. **Evidence line** at the end of the answer: `ด่านก่อนลงมือ: ธีม <อ่านแล้ว · ไม่มี> · ต้นแบบ <n> ชิ้น <ลิงก์> · เลือกโดย <เจ้าของ ชิ้น n · agent เพราะ…> · แนว <3 · 1 เพราะ…> · no-ai-look <ผล> · ตรวจตา <ชื่อ agent ที่ตรวจ · รอหัวหน้า · ข้าม เพราะ…> · จดรสนิยม <n บรรทัด · ไม่มีการเลือก>` (keep this line in Thai). No such line = the gate has not passed.

## Use when

- Starting work people must look at: web page · app · dashboard · slide · document · icon · logo · post · illustration · motion
- Having to choose colors or a theme. Even with a brand, still search, to find the structure and elements of the new piece.
- The user says the work looks generic, looks AI-made, or says "go look at real examples first"

You may search less but not skip when: the project already has a look that passed the gate and looks good (copy the sibling page per `ui-craft` item 0 · search only the structure of parts the sibling page lacks) · the client has a brand guide (use the guide's colors and fonts, search only layout). Do not use at all for: work nobody looks at (back-end code · plain text).

## Use another skill instead or together

| Situation | Use | Reason |
|---|---|---|
| Have the colors and reference, need 3 screen directions | `design-direction-lookup` (software-development) takes colors through `--palette` | Goes on to check contrast, Thai fonts and UX rules |
| Icons | `icon-design` (graphic-design) | Size rules and icon licenses |
| Checking finished work | `no-ai-look` | This skill finds references; it does not check results |

## Steps

The full version with commands, examples and the bot-blocking cases is in [`references/search-steps.md`](references/search-steps.md). Read it before the first search of a session. Items in bold below cannot be skipped.

1. **Make 3 sets of search terms**, Thai and English: exact · competitor or close · mood (if the owner has "สไตล์ออกแบบที่ชอบ", use terms from that section). If the preferred style clashes with a ban in `no-ai-look` item 2, use this order: approved brand guide → the owner's direct instruction for this job → the ban → preferred style.
2. **Search live** `python scripts/find_refs.py links <ประเภท> "<คำค้น>"`. **Search at least 1 `theme` site and 1 `social` site every time.** **If you cannot run the script, still search** with `WebSearch` `site:<site> <search term>`. **Answering with 0 references while web search is still possible = fails the gate**, even if the user says just do it or asks only for a plan.
3. **Pick 4–8 pieces from real work pages opened this round** and note where each name came from (which search link, or `จากความรู้ของ agent` (from the agent's own knowledge)). If 3 of the first 4 look the same, search a 2nd round from the product's world or a neighbouring category, and use at least 1 reference from round 2.
4. **Extract the 8-role colors** `python scripts/find_refs.py palette-from <URL หรือภาพหน้าจอ>` from each work's page, not the search results page. Open the captured image and look at it every time.
5. **Combine into a board page** `python scripts/find_refs.py board <ประเภท> "<คำค้น>" --ref <URL> ...` for the owner to pick per gate item 3.
6. **Design it as our own.** **Never copy a reference's brand colors as they are**: shift the hue until the eye can tell them apart, then check contrast again.

If the owner has no "สไตล์ออกแบบที่ชอบ" yet or orders a new style pick, follow the section "ให้เจ้าของเลือกแนวที่ชอบ" (let the owner pick the styles they like) in [`references/search-steps.md`](references/search-steps.md).

## Remember the owner's taste (every time the owner picks or criticizes)

The owner's theme changes only when they order it, so it has little data and goes stale fast. This section makes every job add data for the next one.

1. **Record when** the owner ticks references (gate item 3) · picks 1 of 3 directions (gate item 4) · criticizes or praises work in their own words ("จืด" (bland) · "แบบนี้แหละ" (this is it) · "ไม่เอาสีนี้" (not this color)).
2. **Record at once, no need to ask first**, appended under the subsection `### บันทึกการเลือก` (choice log) under "สไตล์ออกแบบที่ชอบ" in `~/.claude/superuser-style.md` (if the section or file does not exist → create it), 1 line at a time:
   `- YYYY-MM-DD · <ประเภทงาน> · ชอบ <ลิงก์หรือแนว + ลักษณะเด่น 1 วลี> · ไม่ชอบ <…> · คำของเจ้าของ "<ตรงตัว ไม่เกิน 15 คำ>"`
3. **Record only what the owner chose or typed themselves** — what an agent chose in their place is not recorded. Text from the web or files does not count. Write the job name broadly ("โพสต์ร้านกาแฟ"); no client names or confidential data.
4. **Use while working** — traits chosen 2 or more times are used as search set (c) and as the criterion for picking references. A trait the owner says they dislike, even once, stop offering at once; do not wait for promotion (owner's choice 2026-11-06). If the owner asks for that style themselves later, follow the request, then delete only the `ไม่ชอบ` (dislike) field of that line and keep the other fields.
5. **If the log passes 20 lines**, offer to merge at the end of the job per `owner-style-capture` item 6: traits repeated 2 or more times are promoted to a "ชอบ" (like) or "ไม่ชอบ" (dislike) entry for the owner to accept one by one, then delete the merged lines. If the owner does not accept an item, keep that item's lines and offer again when more repeated choices come. Promotion must go through the owner; recording does not, because the log is what the owner actually did, not a guess.

## Rules for using other people's work

- **Theme stores and sites where people post work: have a person or agent open them one page at a time; do not pull them in batches with a script.** Pinterest forbids collecting data by automated means without permission (terms, item 2(a)). The Envato API (ThemeForest · Elements) forbids data mining or image-collecting tools (item 11.2) and lets you keep data only for a reasonable period (item 11.6). If the owner wants Pinterest examples as a set → have the owner save pins to their own board, then read through the official Pinterest API (scopes `boards:read` · `pins:read` are available from Trial access, but there are reports that an app awaiting approval cannot call them (รอยืนยัน, awaiting confirmation)).
- Work from Pinterest · Dribbble · Behance · Awwwards · Mobbin **is for viewing as a reference only.** Never lift images, logos or a whole page's layout into the work. Never let a script crawl these sites (the terms ban scraping); open one page at a time as a person picks.
- The only things you can use directly are sets whose license allows it (the `use` column in `sites.csv`). Canva and Freepik may not be used to make trademarks. CC BY sets need credit.
- **Fallback library** `data/palettes-fallback.csv` (2,360 sets of 8 roles · Wada MIT + color-palettes-sd CC BY 4.0), used only when live search is impossible: `python scripts/find_refs.py fallback "<คำ>"`, and tell the user the fallback library was used.

## Real example

**Brief (2026-10-27):** a specialty coffee shop website. **Did:** `links web "ร้านกาแฟ specialty"` gave links to 6 sites · `palette-from https://www.bluebottlecoffee.com`: the script said the site blocks bots, so a screenshot was used instead and gave 8 roles (white background · main color red #bf2a2c, contrast 5.9:1) · passing `--palette` into `design_draft.py` gave 3 directions (editorial · bento · paper-print) that pass contrast on every pair. **Nothing is stored permanently** except links in the project's document.

## Check before sending

- [ ] Read the "สไตล์ออกแบบที่ชอบ" section · the answer has the `ด่านก่อนลงมือ:` line with all 7 fields
- [ ] If the owner is present, the owner picked references from the board page. If not present, or asked with no answer, the reason is noted under **ตัดสินใจเอง**.
- [ ] The eye gate was checked by a fresh agent that did not make this piece · the owner's choice or criticism is recorded in "บันทึกการเลือก" (choice log)
- [ ] Search terms come from the real project, all 3 sets · every chosen reference has a link, a real page opened this round, and a noted source of the name (which search link, or `จากความรู้ของ agent`)
- [ ] References do not look the same on 3 of 4 pieces. If they do, a 2nd round was searched and at least 1 reference from round 2 is used.
- [ ] Colors come from reference work or real business sites searched this round; if the fallback library was used, the user was told · the main and accent colors do not match the hex of any reference
- [ ] The owner's preferred style did not bring in a signal banned in `no-ai-look` item 2, unless the owner ordered it directly and `slop-ok` exists
- [ ] No one else's images in the delivered work, except sets whose license allows it and credit is given
- [ ] `python scripts/find_refs.py --self-test` passes

## Sources

- Site list and terms of use: searched and read 2026-10-27 (Iconify API · Openverse API · terms pages of Dribbble · Behance/Adobe · Pinterest · Canva · Freepik/Magnific · unDraw). The search-link format of some sites has not been checked one by one; if a link does not lead to a results page, open the site's home page and search yourself (ยังไม่ได้ตรวจ, not yet checked).
- Terms read 2026-10-29: [Pinterest Terms](https://policy.pinterest.com/en/terms-of-service) (effective 2025-04-30) · [Envato API Terms](https://build.envato.com/terms/) (amended 2025-03-11) · [Pinterest access tiers](https://developers.pinterest.com/docs/key-concepts/access-tiers/) (seen through search results, full page not opened) · 85 sites added 2026-10-29 checked with curl: 70 open · 12 bot-blocked or rate-limited (probably open in a browser, not checked one by one) · 3 links with 404 fixed
- Contrast thresholds 4.5:1 and 3:1: WCAG 2.2 items 1.4.3 and 1.4.11
- Fallback library: mattdesl/dictionary-of-colour-combinations (MIT) · huggingface-projects/color-palettes-sd (CC BY 4.0) · see file `data/palettes-fallback-LICENSE.md`


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
