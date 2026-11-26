# skill: design-by-type

Use when a logo, poster, banner, cover or deck must blend popular refs

# design-by-type — sort the job by type, read the project, blend 2–3 popular references, let the owner pick

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) · close the work with a `ด่านก่อนลงมือ:` line

> **One rule:** every direction is a blend of 2–3 real, popular works that fit this project, with a written recipe of what came from each. The owner asked for this flow on 2026-11-19: "แยกก่อนว่าเป็นงานประเภทไหน … หาตัวอย่างที่ดูสวยงาม เช็คดูว่ามียอด view เยอะ มา 2-3 งาน แล้ว รวมให้เป็นงานใหม่ให้กลมกลืนกัน".

This skill adds 3 things on top of `design-gate/design-references`: the type's own rules, a popularity check on references, and the blend recipe. The search, board and owner pick stay in `design-gate/design-references`; do not repeat them here.

## Use when
- A logo · poster · banner or social ad · Word/PDF cover · slide deck is about to be designed, from scratch or as a redesign.
- The owner says the work looks stiff, generic or AI-made, and the job is one of those types.

Not for: screens and web pages → `software-development:ui-craft` · icons → `icon-design` · a whole brand kit → `brand-kit` (it calls this skill for the logo) · YouTube thumbnails → `youtube-thumbnail` · a quick one-off logo or poster inside a software project, no reference blend → `software-development:graphic-design`.

## Steps

1. **Name the type**, then open its file. One job with several types (logo + cover) → open each.

   | Type | File | Also open |
   |---|---|---|
   | Logo · wordmark · brand mark | [`references/logo.md`](references/logo.md) | `brand-kit` · `icon-design` (licensed sets) |
   | Poster · flyer · event key visual | [`references/poster.md`](references/poster.md) | `print-ready-files` |
   | Banner · social post · ad | [`references/banner.md`](references/banner.md) | `banner-design` · `social-formats` · `copy-claims-check` |
   | Word/PDF cover and inner pages | [`references/document-cover.md`](references/document-cover.md) | `software-development:branded-document-design` |
   | Slide deck · company profile | [`references/slides.md`](references/slides.md) | `software-development:presentation-design` · `style-consistency` |

2. **Read the project before searching.** Write 2 lines: what the project is (industry · audience · what the piece must make people do) and which 1–2 style families fit. Look the industry up first, it gives looks and cautions:
   ```bash
   python <software-development>/skills/design-direction-lookup/scripts/design_search.py "<คำของโปรเจกต์>" --domain industry -n 1
   ```
   The project beats the owner's general taste: a coffee shop gets a coffee look even though the owner likes tech-modern. Keep the owner's taste in what transfers (depth, light, one strong focal element).

3. **Search references in that style family** per `design-gate/design-references` steps 1–3, using the type file's site list. Add the type and style words to every query (`logistics company profile deck`, not `deck`).

4. **Check popularity and fit** on each work page you open, and write it down. See [`references/blend.md`](references/blend.md) section 1 for which number each site shows. Keep 5–8 works that are both popular for their site and close to the project; popularity alone does not qualify a work that misfits the project.

5. **Blend 2–3 works per direction** with the recipe sheet in [`references/blend.md`](references/blend.md) section 2: one work gives the structure, one gives the signature device or hero treatment, one gives the colour and light mood. Change what makes it ours (hue shift, our content, our type). 3 directions must differ in structure, not only colour.

6. **Build at real size, polish, and look at it.** Apply the polish pass in [`references/polish.md`](references/polish.md) (depth, overlap, light, shape) before the first critic. Render each direction to PNG, open it, then run the type file's check list and the stiffness check in `design-gate/no-ai-look` (plugin `superuser`) `references/stiffness.md`. Fix and render again until it passes. Then have a fresh `design-critic` give the wow score in [`references/wow-score.md`](references/wow-score.md); send only at 7/10 or more with no 0, else fix the lowest criterion and score again (at most 2 rounds).

7. **Send the 3 directions for the owner to pick** (board page or artifact with the PNGs, the recipe line under each, and the reference links). The owner adjusts from there; record the pick and their words per `design-gate/design-references` "Remember the owner's taste".

## Check before done
- The type file was opened and its check list passed on every PNG.
- Every direction lists 2–3 references with link, popularity number and date, and what came from each.
- The 2-line project read exists and the style fits the project, not only the owner's taste.
- Stiffness check passed; the `ด่านก่อนลงมือ:` line is complete.

## References
- [`references/polish.md`](references/polish.md) — open while building: the depth, overlap, light and shape pass that makes round 1 look finished
- [`references/wow-score.md`](references/wow-score.md) — open before sending: the 5-criterion wow score and the send rule
- [`references/blend.md`](references/blend.md) — popularity numbers per site and the blend recipe sheet
- [`references/logo.md`](references/logo.md) · [`references/poster.md`](references/poster.md) · [`references/banner.md`](references/banner.md) · [`references/document-cover.md`](references/document-cover.md) · [`references/slides.md`](references/slides.md) — rules, sites and checks per type
- [`references/sources.md`](references/sources.md) — sources and check dates


## reference: banner.md

# Banner · social post · ad

Sizes, safe zones and the render script live in `banner-design` and `social-formats`; this file adds the beauty rules and where to find popular work. Tested 2026-11-19 on a fictional Chiang Rai coffee-bean shop ad (1200x628); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Meta Ad Library (search the product in Thai, country TH) | what real competitors run now | no likes; an ad running for months is a working ad, so use the start date |
| Real brands in the industry (the shop's own competitors, a famous roaster) | photo mood, product shots, offer wording | none |
| Dribbble search sorted by Popular | layout ideas, hero devices | views · likes on the shot page |
| Behance · Pinterest · template stores | more layouts | often blocked to scripts (403 or Cloudflare, 2026-11-19); open by hand or skip |

## Beauty rules

1. One message is the hero, about 3–4 times larger than anything else ("ส่งฟรี" or a big number). Source: uipro `banner-sizes-and-styles.md` visual hierarchy; test 2026-11-19.
2. One button, at least 44 px tall, contrasting clearly with what is behind it. Source: uipro CTA rules.
3. Offer terms sit next to the button, small but present (end date, area). Source: `copy-claims-check`.
4. Real product photos, not icons; nearly every Thai coffee ad in Meta Ad Library used a real bag or real beans (2026-11-19).
5. At most 2 font families, both with full Thai; heading 32 px or more, body 16 px or more on 1200 wide. Source: uipro typography.
6. Text covers about a fifth of the image; the photo does the rest. Whether Meta still limits ads with more than 20 % text is unconfirmed (see `banner-design`); less text reads faster either way.
7. Depth from overlap: a label, plate or number crosses the edge of the photo at 1–2 spots. Source: `design-gate/design-references` `depth-and-light.md`, Dribbble "Coffee Banner KV".
8. Photo fades into the background with a mask instead of sitting in a hard rectangle.
9. Colours come from the product (roasted bean, cherry red, leaf green), not from the owner's general tech palette; the project beats the owner's taste.
10. Keep key items at least 50 px from every edge per `banner-design`; leave more room left and right (blog summaries of Meta specs say up to 120 px, `(ยังไม่ได้ตรวจ)`) when the ad also runs in placements that crop.
11. Credit licensed photos in a corner at about 10 px.

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A badge repeating the headline, floating mid-photo → give it new information (origin) and seat it across the seam between shadow and photo.
- The same claim ("from Doi Chiang Rai") in badge, subhead and body → say it once.
- A photo cropped so tight it became a dotted circle → crop wider so the real object (plate rim) shows.
- An underline floating away from its word → a highlight bar touching the word.
- A small label above the heading (`eyebrow-badge`) → fold it into the body text (the only exception is the italic word in decks, `slides.md` rule 9).

## Check before sending
- [ ] One hero message, ≥ 3× the next size
- [ ] One button; terms beside it
- [ ] Real product photo with credit
- [ ] At least 1 overlap across the photo edge
- [ ] Text inside the side margins
- [ ] Colours trace to the product or a reference, not to a default


## reference: blend.md

# Popularity and blending · design-by-type

## 1 · Popularity: which number each source shows

Popularity tells you the work already pleased many people; fit tells you it suits this project. Keep a work only if it has both. Write the number and the date you saw it, because counts change.

| Source | Number to record | Notes (seen 2026-11-19) |
|---|---|---|
| Dribbble | likes · views | On the shot page when it loads; when it hides them (not logged in), use the count on the search results page. Sort the search by Popular. |
| Behance | appreciations · views | On the project page. Often blocks scripts after a few pages (403 or Cloudflare); open by hand or move on. |
| Meta Ad Library | how long the ad has run | No likes. An ad still running after months is one that sells; record the start date. |
| Template stores (Envato · Creative Market · Freepik) | sales · downloads · likes, when shown | Many pages show none; use them as the "common look" to step away from. |
| Real brands and competitors | brand size (customers · reviews · countries) | No per-work numbers. A real brand in the same industry counts as proven by the market. |
| Pinterest · Canva | saves when shown | Usually blocked or hidden; view by hand only, never crawl. |

When no number is visible, write `ไม่แสดงยอด` and say why the work is still worth using (real brand, the owner liked it, same industry). Do not invent a number.

## 2 · Blend recipe sheet (one per direction)

Each direction takes from 2–3 works, each giving a different job. Fill this before building:

```text
แนว <n> · <ชื่อสั้น>
โครง (structure / grid):          จาก <ref A> · <what exactly>
ของเด่น (signature device / hero): จาก <ref B> · <what exactly>
อารมณ์สีและแสง (colour & light):    จาก <ref C> · <what exactly>
ที่เปลี่ยนให้เป็นของเรา:            <hue shift from refs and competitors · our content · our type · what we dropped>
ทำไมเข้ากับโปรเจกต์:                <1 line back to the 2-line project read>
```

Rules:
- One job per reference. If two references both give the structure, the result is a collage, not a blend.
- The 3 directions differ in structure (what sits where), not only in colour.
- Shift every colour until the eye can tell it from each reference and each competitor in the industry; then measure contrast again.
- Content stays ours. Unknown facts carry `(รอยืนยัน)`; never borrow a reference's numbers or claims.
- Never copy a mark, an illustration or a layout one to one; take the idea, rebuild it with our parts.

## 3 · Sending to the owner

Put the 3 PNGs side by side with, under each: the recipe line (which refs, what from each), the reference links with their numbers, and 1 line on why it fits the project. Ask the owner to pick or to say what to change; record the answer per `design-gate/design-references` "Remember the owner's taste".


## reference: document-cover.md

# Word/PDF cover and inner pages

Building the real .docx (tokens, `anchor_picture()`, tables, the cover vote) lives in `software-development:branded-document-design`, with its own cover rules in `cover-design.md` and `anti-patterns.md`. This file adds only what the 2026-11-19 test found that those files do not say yet. Tested on a fictional Thai private-hospital appointment-system SRS (cover + 1 inner page, A4); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Dribbble search `annual report cover` · `healthcare report` | covers and spreads | likes · views (e.g. "2022 Reputation Healthcare Report": 56 likes · 16k views, 2026-11-19) |
| 100 Archive and similar curated award archives | covers that passed a jury | inclusion is the signal; no counts |
| Real reports from the client's industry (Thai hospitals publish annual, CG and TCFD reports as PDF) | the local standard to beat | the organisation itself |
| Thai government annual reports | the floating-earth, glowing-icon covers to avoid | none |
| Behance · Freepik · Venngage | more covers | blocked to scripts 2026-11-19 |

## Rules not yet in branded-document-design

1. Confetti and small shapes must mean something from the system (released booking slots, appointments per half hour). Random confetti reads as AI.
2. With no logo or real screenshot, build the art from the system's own unit of data (time slots, a clinic clock face, a queue) instead of drawing a fake screen.
3. The system name is the single largest line; the document type (SRS) is the second line. A long type name first wrapped and ran into the meta row in the test.
4. Thai headings at 84–92 px on A4 at 150 dpi: measure the width first, then `nowrap` or reduce; two drafts failed this.
5. A gradient ribbon uses 2–3 stops of one hue, a lighter edge on the lit side, and a shadow in the same direction as everything else (source: Rotunda Hospital Annual Report 2024 on 100 Archive).
6. Chapter openers use one solid chapter number in the main colour; outline or blurred numbers read as AI (eye check 2026-11-19).
7. Cover and inner page share one element (a ribbon piece, a dark band), but the cover art is never repeated small inside.
8. A light cover lets colour flow into the lower half (a soft tint or the ribbon's tail at the bottom edge), or it reads as the empty white cover the owner disliked (taste log 2026-11-18).
9. Priority labels in requirement tables use words (ต้องมี / ควรมี), not colours alone.

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A 7×9 grid of identical slots looked generated → 5×6 with bigger slots and one lifted "booking now" slot.
- Concentric rings with dots looked like radar or space → a clinic clock face with a slot label.
- A blurred gradient number clipped by its filter box (a glow blob) → solid number, no shadow.
- Thai headings breaking mid-phrase ("เลขประจำ/ตัวผู้ป่วย") → shorter headings, breaks at phrase ends.

## Check before sending
- Run the check list in `branded-document-design`, then:
- [ ] The cover art comes from the system's own data
- [ ] System name is the largest line and fits on one line
- [ ] Lower half of a light cover carries colour
- [ ] Each direction says how it is built in real Word (background PNG anchored, text as Word text)


## reference: logo.md

# Logo · wordmark · brand mark

The full brand set (colours, type, usage rules) lives in `brand-kit`; icon sets with licences in `icon-design` `references/asset-sets.md`. This file is the logo route. Tested 2026-11-19 on a fictional Thai SME payroll SaaS (3 presentation sheets, 1600x900); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## The route: build the mark from real letterforms, not hand-drawn paths

The owner rejected agent-drawn SVG icons (2026-10-26) and called past logos "AI-looking" (2026-11-18). What worked on 2026-11-19:

1. Pick a licensed font (OFL from google/fonts) whose personality fits the brand.
2. Pull the glyph outlines with `fontTools` and build the mark from them plus simple geometry (circles, bars): a Thai ป whose right stem grows a P bowl, a P made of payslip lines, a `j` whose dot becomes a coin.
3. Keep the build script next to the mark so the mark can be rebuilt and edited exactly.
4. Show it on a presentation sheet with a real use (a notification, a payslip, a leave-balance card), not in an empty rounded frame.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Dribbble search `<industry> logo` sorted by Popular | marks with construction grids | likes · views on the shot page (e.g. PayMe by Netguru: 906 likes · 138,280 views; Unipay by Outcrowd: 301 likes · 73,889 views, both 2026-11-19) |
| Agency case studies (Ragged Edge for Wise, Figma blog for Gusto) | why a real brand mark looks the way it does | none; the brand's size is the signal |
| Local competitors' sites (Thai SaaS: FlowAccount, PEAK) | the category average to step away from | reviews or customer counts on their own pages |
| Logopond · LogoLounge | marks built from local scripts | rarely shown |
| Behance | case studies | blocked to scripts 2026-11-19 |

## Beauty rules

1. Recognisable at 16 px and in one colour. Source: uipro `logo-style-guide.md` scalability checklist.
2. Start as a combination mark (mark + word); the mark alone comes later. Source: uipro `logo-style-guide.md`.
3. 1–2 colours; depth only from shades of the same hue. Source: uipro `data/logo/styles.csv` rows Minimalist and Negative Space.
4. Place and trim the font letterforms of rule 5 on a grid or circles, not freehand (PayMe shows its construction circles); the grid places and cuts, it does not draw new paths.
5. Build from a licensed font's letterforms instead of drawing paths (owner rule).
6. The mark carries meaning from the product's world (Thai letter, payslip line, coin) that a competitor could not reuse. Source: `design-gate/no-ai-look` eye gate item 1.
7. Step away from the category average: Thai accounting SaaS uses a light-blue circle with thin caps, or a purple-blue gradient.
8. Shift the brand hue until the eye can tell it from every reference (`design-gate/design-references` step 6).
9. The Thai lockup uses a Thai face whose personality matches the mark (a looped-head mark pairs with a looped Thai face).
10. Large wordmarks can be tracked tighter than text, but check descenders and dots (y, j) for collisions.
11. Make two versions of the mark: a **rich** one with light, shadow and dimensional shape for the hero use (app icon, sheet, signage), and a **flat** one-colour version for 16–32 px and print. The owner rejected a flat mark as stiff on 2026-11-19 ("ขอปรับให้มีลูกเล่นมากกว่านี้หน่อย แสงเงา รูปร่าง"). Depth follows `design-gate/design-references` `references/depth-and-light.md`: one light source, at most 3 layers.
12. Avoid the generic AI marks: letter in a rounded square, gradient blob, swoosh, circuit, infinity (`design-gate/no-ai-look` section 2, Logos).

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A loop on the P's foot read as a key or a music note → used the real Thai ป glyph instead.
- A thin join between bowl and stem → the bowl overlaps into the stem.
- A light streak across the sheet → removed.
- A blue gradient panel read as generic fintech → flat colour.
- App-icon tiles with one letter in a rounded frame → replaced by a real-use card crossing the panel edge.
- A half-empty panel, a cream ring (a colour the owner dislikes) → cropped, removed.

## Check before sending
- [ ] Mark built from a licensed font or simple geometry, with its build script
- [ ] 16 px and 32 px tests on light, brand colour and dark
- [ ] Rich version (light, shadow, shape) and one-colour flat version both work
- [ ] Thai and Latin lockups
- [ ] Mark means something from the product's world
- [ ] Sheet shows a real use, not an empty frame


## reference: polish.md

# Polish pass · design-by-type

Apply this to every direction before the first render goes to a critic, so the owner sees "wow" in round 1. On 2026-11-19 this pass raised four approved directions from wow 5–8 to 7–8 in one round (old vs new compared by one critic: slides better on 5 of 5 criteria, banner and document cover on 4, poster on 3; `scripts/evals/beauty/RESULTS.md`). The owner's words: "อยากให้ดูแล้วว้าว เหมือนทำจาก canva ai".

## Add what fits the idea, not everything
- **Depth:** 3 layers (back photo or texture · mid shapes · front content); soft long shadows from one light (top-left); a contact shadow where things touch.
- **Overlap:** the hero crosses a panel edge or photo cut; a card or number sits half on the photo, half on the panel; a cut-out photo of a real object (coffee bowl, phone, building) breaks the frame.
- **Light:** a lit side and a dark side on photos and shapes; at most one soft glow, on the key item; light grain or paper texture so surfaces do not look plastic.
- **Shape:** the existing idea made physical (the ribbon is the schedule with lengths in real minutes, rings are appointment slots, the route ends at the key number, the "2" is filled with coffee beans).
- **Copy:** cut repeated lines; secondary text big enough for the medium (poster time labels 26 px or more on A3 at 150 dpi).

## Keep
- One light direction everywhere; shadows agree. No rainbow gradient, sparkles, random confetti, gradient text, AI faces.
- Thai renders, headings line-height 1.4 or more, no mid-phrase breaks, body contrast 4.5:1 or more.
- Licensed photos with credit. Work on a copy; never overwrite the approved file.

## Watch after the pass (found 2026-11-19)
- Several identical glass cards in a row read as an AI template; make one lead card larger or put them in their real order.
- Faint first segments (a pale start of a ribbon on pale paper) disappear.
- Text set over a photo needs contrast measured on the real pixels.


## reference: poster.md

# Poster · flyer · event key visual

Print specs (bleed, CMYK, resolution) live in `print-ready-files`. This file adds the beauty rules and where to find popular posters. Tested 2026-11-19 on a fictional Thai SME seminar poster (A3 portrait, 1240x1754); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Behance search `<topic> conference poster` / `event key visual` | full campaigns with posters | appreciations · views (e.g. "Connected Women in AI": 1,553 appreciations · 23,128 views; "50 Swiss Style Posters": 2,439 · 37,854, both 2026-11-19) |
| Dribbble search `event poster` / `conference program` | single posters, programme layouts | likes · views |
| Real Thai events in the same field (e.g. Techsauce) and Thai bank or agency seminar pages | local conventions: free entry, QR, afternoon time, venue line | attendance claimed on the event's own site |
| Template stores | common layouts to step away from | sales if shown |

## Beauty rules

1. Three zones: top = event name, middle = people and content, bottom = date, time, venue and QR. Source: uipro `banner-sizes-and-styles.md` 3-zone rule.
2. One registration point (QR or button), bottom right, contrasting clearly. Source: uipro CTA rules; Dribbble "Conference Program Poster".
3. One hero element (a ribbon, the speaker panels, a city photo); everything else stays quiet.
4. Give the hero element a meaning from the event: a ribbon that is the afternoon's timeline with speakers as stops beats a decorative ribbon (first draft 2026-11-19 was decoration and read as AI).
5. Headline left-aligned and large; asymmetry looks designed, centring everything looks generated. Source: "50 Swiss Style Posters"; uipro `styles.csv` Swiss rows.
6. Text may cross a panel or photo edge where it stays readable; that overlap gives depth without heavy shadows.
7. One local pattern strip can make it Thai (e.g. a ขิด band), kept thin and with a known source; thick strips look pasted on.
8. In a schedule, times are large and topics small; people scan by time.
9. One base colour plus one accent; depth from light and dark of the same hue (`depth-and-light.md` section 4).
10. At most 2 font families with full Thai; keep each Thai phrase together (`white-space: nowrap` per phrase), because Chromium split "สต็อก" mid-word in the test.
11. Text on a photo: dim the photo and measure contrast on real pixels.
12. The sub-headline tells the owner what they get that afternoon, not a slogan ("สามคน สามเรื่อง ในบ่ายเดียว" was flagged as a slogan).
13. Never draw fake people; use real speaker photos, or neutral placeholders marked `(รอยืนยัน)`. Never generate a working QR to a made-up link.

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- Decorative ribbon with no meaning → it became the timeline.
- Dead empty band at the bottom, tiny faint text, QR covering the venue → rebuilt the info grid.
- Five equal schedule columns with 350 px of dead space → three speaker columns, other times as a line.
- Silhouettes with no shoulders → redrawn to fit the panel height.
- Captions over bright buildings → photo moved and dimmed.

## Check before sending
- [ ] Three zones; one QR bottom right
- [ ] One hero element, and it means something
- [ ] Headline asymmetric, readable across a room
- [ ] Thai phrases unbroken; contrast measured on photos
- [ ] Print specs per `print-ready-files` before it goes to a print shop


## reference: slides.md

# Slide deck · company profile

Story, slide order and layouts live in `software-development:presentation-design`; the owner's liked deck is `style-consistency/references/corporate-profile-deck.md`. This file adds the beauty rules and where to find popular decks. Tested 2026-11-19 on a fictional Thai last-mile logistics company (cover + services slide, 1920x1080); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Behance search `<industry> company profile` | full decks from real agencies, often for real firms | appreciations · views on the project page (e.g. a Vietnamese last-mile profile: 115 appreciations · 4,011 views, 2026-11-19); blocks scripts after ~5 pages |
| Dribbble search `<industry> presentation` / `pitch deck` | single strong slides | views show on the search page; the shot page hides them when not logged in |
| Real competitors' sites and brand colours (Thai ones too) | what to stay away from, and the local look | none |
| Template stores (Slidesgo · Envato) | common layouts | usually none; use as "what not to look like" |

## Beauty rules

1. The slide title states the point, not the topic ("4 บริการ เรียงตามทางที่ของเดิน", not "บริการของเรา"). Source: `presentation-design`.
2. One key number per slide is the focal element, with its measuring period and `(รอยืนยัน)` underneath. Source: Behance GHTK deck; uipro `slide-layout-logic.csv` row proof.
3. Services that are not equal are not drawn equal: one lead card, or the services placed in their real order along a route or timeline, instead of a grid of 4 icon cards. Source: `depth-and-light.md` section 1, `design-gate/no-ai-look`.
4. Every slide has at least 2 overlaps (a card across the photo's diagonal cut, a photo bleeding off a card, a route end-dot over a card edge). Source: `depth-and-light.md`.
5. Light from the top left on every slide; 2-layer shadows tinted toward the background, never pure black.
6. The back layer has one strong thing: a real photo cut on a diagonal, a dimmed photo on a dark base, or a full-bleed colour block. A slide without one looks flat (test 2026-11-19).
7. Cover: text left, photo right, with one element crossing the seam. Source: uipro `slide-layout-logic.csv` hook = split-hero.
8. Thai line height 1.4 or more; break lines where the idea ends, never mid-word (the test broke "ตรวจ/สภาพ" before fixing).
9. A small italic English word above the Thai heading is fine (the owner's liked deck does it); capsule badges and wide-tracked capitals on the cover are not (`design-gate/no-ai-look` `eyebrow-badge`).
10. Credit real photos on the slide and crop out any text or ads inside the photo.
11. Measure contrast on coloured panels; a mid green with white text measured 3.4:1 and had to go darker to reach about 5:1 (pixel measurement 2026-11-19).
12. Content slides carry a footer: section name left, page number right. Source: `presentation-design`.
13. Shift the deck colour away from every reference and every competitor (in Thai logistics: Flash yellow, Kerry orange, Grab and GHTK green, DHL red).

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A card sitting beside the diagonal photo cut instead of across it → move it across the cut.
- A route line running through text → reroute and move the labels.
- Wide-tracked "COMPANY PROFILE" capsule on the cover → removed.
- Content slide on a plain dark base → added a dimmed real photo behind.
- Two CSS rules fighting so the key number shrank → render and look, every time.

## Check before sending
- [ ] Title states the point
- [ ] One key number, with period and `(รอยืนยัน)` if unconfirmed
- [ ] No grid of identical icon cards
- [ ] ≥ 2 overlaps per slide, one light direction
- [ ] Back layer has one strong thing
- [ ] Contrast measured on every coloured panel
- [ ] Footer and photo credit present


## reference: sources.md

# Sources · design-by-type

All viewed 2026-11-19 unless noted. Popularity numbers are what the page showed that day.

## Rules borrowed (MIT, nextlevelbuilder/ui-ux-pro-max-skill, branch main, viewed 2026-11-19)
- `.claude/skills/design/references/logo-design.md` · `logo-style-guide.md` · `logo-color-psychology.md` · `data/logo/styles.csv` · `data/logo/industries.csv`
- `.claude/skills/design/references/banner-sizes-and-styles.md` · `social-photos-design.md`
- `.claude/skills/design/references/slides-layout-patterns.md` · `slides-strategies.md`; repo copy `software-development/skills/design-direction-lookup/data/upstream/uipro/slide-layout-logic.csv` (commit 28b3b8d)
- `.claude/skills/design/references/cip-design.md` · `.claude/skills/ui-ux-pro-max/data/styles.csv` · `typography.csv`

Ideas were rewritten and checked against real renders; no file copied.

## References opened in the test, by type
- Logo: dribbble.com/shots/9190631 (PayMe, 906 likes · 138,280 views) · dribbble.com/shots/21652445 (Unipay, 301 · 73,889) · raggededge.com/work/wise · figma.com/blog/gusto · flowaccount.com · peakaccount.com · logopond.com
- Poster: behance.net/gallery/218481539 (1,553 appreciations · 23,128 views) · behance.net/gallery/221881411 (475 · 13,641) · behance.net/gallery/255930189 (601 · 5,528) · behance.net/gallery/221014645 (2,439 · 37,854) · behance.net/gallery/251556319 (725 · 5,875) · dribbble.com/shots/19477765 (48 likes · 26k views) · summit.techsauce.co
- Banner: Meta Ad Library search "เมล็ดกาแฟคั่ว" TH · nanacoffeeroasters.com · doichaangcoffee.co.th · onyxcoffeelab.com · dribbble.com/search/coffee-banner (top shots 1.5k–2.7k views)
- Document cover: 100archive.com/projects/rotunda-hospital-annual-report-2024 · dribbble.com/shots/18708152 (56 likes · 16k views) · dribbble.com/shots/19923846 (26 · 6.9k) · dribbble.com/shots/18538084 · Bumrungrad CG 2025 PDF · BDMS TCFD 2024 PDF · HA Thailand annual report 2567 (as the look to avoid)
- Slides: behance.net/gallery/243641201 (115 appreciations · 4,011 views) · behance.net/gallery/241060513 (236 · 4,240) · dribbble.com/shots/27061196 · dribbble.com/shots/24043910 (4.1k views) · dribbble.com/shots/26142164 · flashexpress.co.th · slidesgo.com/theme/logistic-transport-company-profile

## Site access on 2026-11-19
- Blocked to scripts: Behance (after ~5 pages, 403), Pinterest, GraphicRiver, Canva, Freepik (security filter), Venngage
- Dribbble hides counts on shot pages when not logged in for some shots; counts on the search page still show


## reference: wow-score.md

# Wow score · design-by-type

The eye gate in `design-gate/no-ai-look` (n/9) only says a piece does not look AI-made. On 2026-11-19 the owner accepted four of five types at 7–8/9 but asked for work that is "ว้าว ตั้งแต่แรก ไม่ต้อง design ใหม่". This score measures the step above passing: would the piece make someone stop and want it. Give it before sending, next to the eye gate.

## Five criteria, 0–2 each (total 10)

| # | Criterion | 0 | 1 | 2 | Source |
|---|---|---|---|---|---|
| 1 | **Stops the eye** at thumbnail size (about 300 px wide, 1 second) | nothing stands out, or everything shouts | one element stands out but is ordinary | one striking element you remember after looking away | Awwwards "Design" 40 % |
| 2 | **An idea from this job** | could be any company's | the idea fits but competitors use it too | a twist only this business has (the payslip that is the mark, the route that ends at the key number) | D&AD: original idea, relevant to its context |
| 3 | **A flourish with meaning** (1–2 playful moves: an overlap, a cut-out, a shape that bends, a hidden second reading) | none, everything sits in its box | present but decorative | it carries the idea and makes you smile | Awwwards "Creativity" 20 %; owner wants `ลูกเล่น` |
| 4 | **Depth and light** | flat, no light direction | some shadow or gradient, mixed or timid | 3 layers, one light source, materials you can almost touch, inside `design-gate/design-references` `references/depth-and-light.md` limits | owner's theme `มีมิติ` · `แสงเงา` |
| 5 | **Craft** at 100–200 % zoom | broken Thai marks, soft images, clipped or colliding text | clean but some loose edges, spacing or kerning | every edge, kern, Thai mark and image crisp | D&AD: "brilliantly executed" |

A deliberately flat style (Swiss, flat brand) scores criterion 4 on how well the flatness is controlled, and says so.

## Send rule

- Send to the owner only when wow is **7 or more with no 0**, and the eye gate is 8/9 or more. The 7 line follows Awwwards' Honorable Mention bar of 6.5 out of 10 (awwwards.com/about-evaluation, viewed 2026-11-19).
- Below that: fix the lowest criterion first, render, score again. After 2 fix rounds still below 7, send with the score and say which criterion is short.
- Score from the rendered PNG, never from code or the maker's description. The maker never scores their own work; a fresh `design-critic` does.

## Critics disagree, so compare in one call

On 2026-11-19 three fresh critics scored the same logo direction through two fix rounds: wow 6 → 7 → 5 and eye gate 8 → 7 → 5. Part of the drop was the critic, not the work: the last one called a top-left light with shadows falling bottom-right "light from several directions", which is one direction. So:
- After a fix, send the old and new PNG to one fresh critic in the same call and ask which is better on each criterion; a single new score alone does not show progress.
- Ask the critic to name the pixel area behind every 0 or 1. A claim you can disprove on the image (like the light direction above) is dropped, and noted in `scripts/evals/beauty/RESULTS.md`.

## Checking the checker with the owner

The owner may score the same 5 criteria. Record both in `scripts/evals/beauty/RESULTS.md`. If the critic and the owner differ by 2 on the same criterion in 2 or more pieces, rewrite that criterion's 0/1/2 text above with the owner's words and note the date.
