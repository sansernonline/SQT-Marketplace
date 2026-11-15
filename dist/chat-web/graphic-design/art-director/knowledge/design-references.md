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
