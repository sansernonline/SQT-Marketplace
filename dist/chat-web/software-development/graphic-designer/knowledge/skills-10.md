# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

> **One rule:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone.

## Use when
- Any work handed to people (code, documents, plans, designs, slides, tables, answers) may hold more than the task needs.
- Cutting a spec, plan or architecture to the fewest parts: also open [`references/architecture-and-anti-patterns.md`](references/architecture-and-anti-patterns.md).
- `human-writing` controls how it is written; this skill controls what the work contains.

Not for: Claude Code's own `/simplify` command · more detail on code (if installed) → `lazy-coding` · `readable-code` in plugin `software-development`.

## Steps
1. Climb the ladder and stop at the first step that works: (a) is this really needed? If not, do not do it and say in 1 line what you skipped; (b) is there an existing thing that works (file, template, function, tool, built-in feature)? Use it; (c) do the shortest version that is still complete and correct.
2. Do only what the task needs; cut before adding (if removing a part loses neither meaning nor function, cut it); plain things people know beat clever things that need decoding.
3. Apply by kind of work:
   - **Code:** names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say why · follow the project's style. Avoid an abstraction with one user, clever hard-to-read shortcuts, one big file, a pile-up `utils/`, a new dependency for a few lines.
   - **Documents · reports:** conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for compared data. Avoid repeats, empty headings, unknown terms.
   - **Plans · procedures:** 3–5 key items, each with an owner and a way to measure done · fewest steps that work. Avoid a 20-item list with no priority.
   - **Designs · slides · figures:** 1 page 1 point · shortest path to the user's goal · familiar patterns. Avoid cramming and decoration that does not help.
   - **Tables · data:** only columns used to decide · short formulas. Avoid columns that repeat a meaning and long nested formulas.
   - **Answers:** answer first, as long as the question needs.
4. **Simple is not sloppy:** never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly. **Simple is not one big pile:** keep clear separation of duties, 1 part doing 1 thing.
5. When you take a deliberate shortcut, write how far it works and when it changes, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process`, and put 1 line in the report: `ข้าม: X — เพิ่มเมื่อ Y`.

## Check before done
- [ ] An outsider can open it for the first time and understand within 30 seconds.
- [ ] No part, step or layer can be cut with no loss.
- [ ] Every added part has a reason it is needed now, not "just in case".
- [ ] Still complete on correctness, safety and what the user asked for.
- [ ] Duties still clearly separated, not squashed into one place to look short.

## References
- [`references/architecture-and-anti-patterns.md`](references/architecture-and-anti-patterns.md) — open for architecture, specs, plans or designs: architecture do and avoid, extra checks per output type, anti-patterns to reject (future-proofing · layer cake · resume-driven design), wrong and right examples


## reference: architecture-and-anti-patterns.md

# Architecture, specs and anti-patterns · simplify

Open this file for architecture, a spec, a plan or a design that keeps growing parts. It holds the rules not already in `SKILL.md`; each section ends with a line naming the rules `SKILL.md` covers.

## Extra checks before submitting

- **Simplest thing that works:** fewest moving parts, boring proven patterns. Add complexity only when something breaks.
- **Reads in one pass:** no jargon the audience lacks, and the whole thing fits in 2 sentences.
- Any "no" or "not sure" on these or on the `SKILL.md` checklist means: simplify before delivering.

Already in `SKILL.md`: a tired teammate gets it in 6 months (the One rule) · every new component, option or layer has evidence it is needed now (checklist) · nothing can be deleted without losing meaning, deleting beats adding (step 2 and checklist) · an example for every abstract claim (step 3, documents).

## Architecture

Do:
- Monolith first. Split only when a bottleneck is proven.
- A familiar stack and standard patterns: Representational State Transfer (REST), queues, caches.
- 1 source of truth per data type.

Avoid:
- Microservices for small teams · distributed-everything.
- Multi-master databases before you must.
- Event-driven by default. A synchronous call is simpler.

## Documents (BRD · SRS · FSD · ADR)

Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Functional Specification Document (FSD) · Architecture Decision Record (ADR).

Do: sentences of at most 20 words · plain English.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy") · walls of text · hedging ("might possibly potentially") · acronym soup.

Already in `SKILL.md`: 1 idea per paragraph · an example for every abstract point · tables for structured data · no undefined jargon (step 3, documents).

## Plans

Do: realistic timelines with buffer · cut scope to fit the time.

Avoid: vague goals ("improve quality") · aspirational dates with no buffer · plans without success metrics.

Already in `SKILL.md`: 3–5 priorities, a named owner per item, measurable success criteria · no 20- or 50-item list with no priority (step 3, plans).

## Designs (user experience (UX) · application programming interface (API))

Do: stay consistent across screens · defaults that work for 80% of users · progressive disclosure (show advanced options only when asked).

Avoid: a novel interaction where a standard one works · a 10-step flow when 3 steps work · required fields with no smart default · hidden features that need a tutorial.

Already in `SKILL.md`: fewest steps to the user's goal · reuse familiar patterns (step 3, designs).

## Anti-patterns to reject

- **Future-proofing:** abstractions for needs that never arrive.
- **"It might scale":** infrastructure for 1M users while you have 1k.
- **Layer cake:** 6 layers where 90% just pass the call through.
- **Resume-driven design:** fancy tech chosen to look sophisticated.
- **Buzzword stacking:** "cloud-native event-driven AI-powered".

## Wrong and right examples

**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use `?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard auth middleware. Log to the existing system."


---

# skill: no-ai-look

Use when making visuals so they do not look AI-made

# no-ai-look — work that looks designed by a person, not by AI

> **One rule:** every choice (color, font, layout, image, word) must be answerable as "chosen because of this project", not "because it is the default."

**Last line of every answer that makes or reviews a visual piece, including a quick "is it OK to send?" check:** the `no-ai-look:` line from 3.3, with real counts (eye check `ด่านตา n/9`, web pages add `(หน้าเว็บ n/14)`). Items you could not check count as not passed. A script result of 0 never makes the line pass. Script not run (no shell) → write `สคริปต์ ไม่ได้รัน` in its slot. If the `ด่านก่อนลงมือ:` line of `design-references` is also due, put it right above this one.

## Use when
- Making or reviewing any visual: web page, slide, poster, post, image, logo, document cover, diagram.
- Asked "is this OK to send?" for such work.

Not for: spacing, color system, fonts and components → the job's own skill (`ui-craft` · `presentation-design` · `graphic-design` · `brand-kit` · `brief-to-image` · `image-generation`). Words in the work → `human-writing`.

**A look the project already approved wins** (brand kit · diagram house style · delivered theme). If it matches a ban below, keep it and note it as intentional.

## 1 · Before starting — decide 5 things and write them where the project keeps its look
(`docs/README.md` field `doc-theme` · app tokens · brand kit; create no new file if a place exists.)

1. **What the work is for**, choose 1: persuade · use · read · experience. Layout comes from this. Sketch 2–3 really different layouts in ASCII, pick one with a 1-line reason; the first idea is usually the default.
2. **1 main color** tied to this business; derive neutrals from it. Never a framework default as the brand color (Tailwind indigo-500 `#6366f1` · shadcn/ui default dark gray button).
3. **2 fonts**: 1 heading font with personality + 1 easy body font, 1-line reason each. Thai work needs full Thai coverage.
4. **A real source of inspiration**: the product's own world or a named style (Swiss · risograph · 1960s travel posters), never floating adjectives ("พรีเมียม" "ทันสมัย"). Search references first with `design-references` (plugin `superuser`), then extract colors from the chosen work. Use the stored color library only when live search is impossible.
5. **Real content**: names, numbers, dates, real screenshots. If missing, put `(รอยืนยัน)`; never invent.

**Test:** remove the logo. If a competitor could still use the work, add what only this project has.

## 2 · Common signals — never the default
Each is allowed if the project gives a reason. The fix for every signal and the sources: the catalog.

- **Color/surface:** purple-blue-cyan gradient · gradient text · neon on dark · glow circle · frosted glass across the page · decorative grid or stripes · cream + terracotta + serif set · line + wide shadow on one box → 1 solid brand color; emphasis by size or weight.
- **Cards/headings:** colored side bar on a rounded card · cards in cards · blob radius · grid of 3–6 identical cards · small badge or icon tile above a heading · 01/02/03 with no real sequence · giant italic serif · Inter/Geist everywhere → spacing and type; group by importance.
- **Page structure:** hero → 3 cards → logos → pricing → FAQ · opening → feature list → how it works → install button · giant number + small label in 3 boxes · every slide title + 3–4 bullets → structure from the page's goal.
- **Icons/motion:** emoji as icons · one thin-line set at 16 everywhere · fade-up on everything · blinking dot or cursor · self-scrolling · bouncy easing · zoom on hover → one chosen SVG set; move only what has meaning, 150–300 ms ease-out, transform/opacity.
- **AI images:** plastic skin · golden or dramatic light everywhere · teal-orange · too-clean scene · average people · bad hands, teeth, text · clay 3D or glossy isometric → one reasoned light source, signs of use, edit the result.
- **Logos:** gradient circle with a hole · circuits · infinity · swoosh · melting letters → shape from something specific; vector; test at favicon size.
- **Documents:** emoji before headings · every bullet starts bold · Title Case everywhere · every section a list · 4 heading levels in a short note · summary ending every section · default Mermaid → short prose, house-style diagrams.
- **Words:** broad ad words (supercharge · ยกระดับ · ไร้รอยต่อ) · "ไม่ใช่แค่ X แต่คือ Y" · sets of 3 · many long dashes · canned openers ("ในยุคดิจิทัลที่…") → `human-writing`, `thai-grammar`.

Do not swap one default for another (cream + terracotta + serif, or + olive, is still a formula). Bento grids and mesh gradients are not signals in themselves. A multi-hue gradient built from the brand hue and its neighbours, on 1 focal place and never on text, is the owner's taste, not the `ai-palette` signal (rules in `design-references` `references/depth-and-light.md` section 3b, 2026-11-24).

When the owner's theme asks for depth (`มีมิติ` · `แสงเงา` · `ลูกเล่น`), soft shadows, one glow and glass over photos are the reason, not a signal, as long as the piece stays inside the limits in `design-references` `references/depth-and-light.md` section 4. The eye checker judges against those limits: 3 layers at most, one light direction, flat text, glow on 1 item.

## 3 · Check before sending

### 3.1 HTML/CSS work (mockup · web page · HTML deck · HTML cover)

```bash
python <path ของ skill นี้>/scripts/slop_scan.py <ไฟล์หรือโฟลเดอร์>          # ตาราง
python <path ของ skill นี้>/scripts/slop_scan.py <path> --min P2 --json       # เฉพาะข้อหนัก
python <path ของ skill นี้>/scripts/slop_scan.py --url https://...           # หน้าที่ขึ้นเว็บแล้ว + stylesheet ที่หน้า <link> ไว้ (ไม่รัน JavaScript) · path ไฟล์ในเครื่องหรือ file:///... ก็ได้
python <path ของ skill นี้>/scripts/slop_scan.py --self-test                  # รันก่อน ถ้าแก้สคริปต์
```

- The `ui-scan` hook runs this on every Write/Edit of a UI file (P0/P1 sent back to fix at once; off with `"ui_scan": false` in `.claude/superuser/config.json`). It checks one file at a time, so before sending still run the whole folder once.
- Page drawn entirely by JavaScript: `--url` sees only the skeleton → check the source, or save the page as .html and scan that.
- 43 rules from the code; nothing to install. Levels: P0 unusable · P1 hard to read · P2 clear AI signal · P3 look again (may be intentional). Any P0 or P1 → exit 1; 0 files checked → exit 2 (wrong, not a pass).
- Fix P0/P1 first, then P2. For intentional items write `/* slop-ok: <rule> <reason> */` or `<!-- slop-ok: <rule> <reason> -->` in that file.
- A script result is a reason to look again, not an order. It cannot see images, and it catches only defaults readable from code. **0 items is not a pass**: send only after both the script and the eye gate 3.2 pass.

### 3.2 Eye gate (every medium: images, slides, posters, Word documents)

Render to an image at real size and answer each item yes or no, by the criterion in the item (for some, "yes" means fail). An item with several questions passes only if every question passes. For a failed item, fix it, or give the reason it is kept under `## ตัดสินใจเอง`.

1. **Logo and product name covered, can you still tell whose it is?** No = fail. Also swap in a competitor's name: if every sentence and image is still true = fail.
2. **Squint:** one dominant element, or everything shouting at once?
3. **Count the item-2 signals:** 3 or more in one piece = looks AI-made. If the piece uses the depth exception (section 2, last paragraph), first answer the checks in `design-references` `references/depth-and-light.md` section 5 and write the result in the `no-ai-look:` field; only signals inside those limits are left out of the count, anything past them counts.
4. **Real content:** names, numbers, real images, or only generic words and stock photos?
5. **One set:** every slide or post uses one system, but the layout does not repeat on every page. A single piece answers `ไม่ใช้` and counts as passed.
6. **AI images:** check hands, teeth, text, shadows, light, real-world scale; zoom to 200% before use.
7. **Blank space:** room for the important things to breathe, not packed edge to edge?
8. **Words:** read headings aloud; a person telling a friend, or a slogan on a sign (slogan = fail)? Does a heading break mid-phrase (such as "ทำงานเป็น / ทีม")? Check web at width 375, slides/posts/covers at real size; if it breaks = fail, fix with `<wbr>` or `text-wrap: balance`. A heading the user worded themselves is used as given, noted as kept on purpose. **Large Thai type:** zoom on upper vowels and tone marks (ที่ · ทั้ง · ปี่) and lower vowels (ุ · ู); a collision with the neighbouring line = fail; raise line spacing per [`thai-line-breaking`](../human-writing/references/thai-line-breaking.md) (Thai headings no lower than 1.4).
9. **Cut 1 piece before sending:** find something removable without loss (shadow · border · decorative icon · label above a heading · motion · gradient · summary paragraph) and really remove it; send only if nothing is found. Do not cut shadows, rounded corners, the hero image, or icons that the look's depth language or the owner's style requires (flat-to-the-bone is the opposite mistake).

**Web pages, marketing landing pages and a product home page answer 5 more** (opening section = first screen before scrolling):

10. **Does the opening section have at least 1 real thing from the product** (screenshot of real use · real numbers with source · named real customer voice · real work done)? None = fail. At width 1440, unintended blank space over 1/3 of the screen = fail.
11. **Is the section order built on this product's story**, not the formula opening → features → how it works → install or pricing? Write 1 sentence on how this product's story is told (start from the user's problem · from a real demo · from customer results) and order by it. Keep the usual formula only if that sentence leads to the same order, and note it.
12. **Does a row of 3–6 equal cells have a reason from the content** (each really equally important and about equally long)? No reason = fail; enlarge the important cell or use a list, prose or one image. A sequence number on a cell heading is allowed only when the steps must be followed in order.
13. **Does the page color have a source other than the logo or icon** (a reference searched this round · the product's materials or world · an approved brand)? Pulled from the icon alone = fail.
14. **Is every mono font spot on code, commands, file names, or numbers that must align?** Mono on brand names, menus, table headers or captions to look "developer" = fail.

**Someone who did not make it must check by eye on every job before sending**; the maker cannot see their own defaults.
- Send the **rendered image at real size** (not code) to a fresh subagent: `design-critic` (graphic-design), else `reviewer`. Send 3.2 with the job's brief, never the maker's answer or opinion.
- Ask for the item-by-item answers of 3.2 and 3 places that look AI-made with fixes; no praise.
- Where reviewer and maker disagree, use the reviewer's answer, then fix or note why kept. After fixing, send the new image to a new reviewer for the fixed items only.
- A maker subagent that cannot call agents sends the image path back to the lead and writes `รอหัวหน้า` in the eye-check field.
- Skippable only for the reference board page and work the owner ordered skipped (the 3 directions sent to the owner at the end must still pass). If skipped, the result line says `ตรวจตา ข้าม เพราะ…`.

### 3.3 Record the result

1 line at the end: `no-ai-look: สคริปต์ P0 0 · P1 0 · P2 n (ตั้งใจ n) · ด่านตา 9/9 (หน้าเว็บ 14/14) · ตรวจตา <agent ที่ตรวจ> ไม่ตรงกับคนทำ n ข้อ · ตัดออก: <ชิ้นที่ตัด>`. An incomplete eye gate, or answers by the maker alone = not passed, even with 0 script items. Items kept on purpose go under `## ตัดสินใจเอง` with the reason. A new build also carries the `design-references` line `ด่านก่อนลงมือ:` with all 7 fields per its gate item 6.

## 4 · Brief for an image tool or a subagent task sheet

Always include, or you get the average:
- A named style + 1–3 real reference images (not adjectives).
- Brand hex colors · light source and time · lens or camera angle.
- Details observed from the real thing (place, signs of use, season, kind of people).
- What you do not want: teal-orange · plastic skin · golden light in every scene · text in the image (add text as a separate editable layer).
- **Edit** the first image you get (crop, retouch, adjust light); never use it as is.

## References
- [`references/catalog.md`](references/catalog.md) — open when the script reports an unfamiliar rule, for the fix and sources of any signal, or when checking media the script cannot see.


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
| Clay 3D / isometric / glossy | A style that fits the brand · real photos | 2S · MF · branded-document-design `cover-design.md` item 9 |
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
