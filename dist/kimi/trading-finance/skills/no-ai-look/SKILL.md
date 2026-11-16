---
name: no-ai-look
description: Use when making visuals so they do not look AI-made
---

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

Do not swap one default for another (cream + terracotta + serif, or + olive, is still a formula). Bento grids and mesh gradients are not signals in themselves.

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
3. **Count the item-2 signals:** 3 or more in one piece = looks AI-made.
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
