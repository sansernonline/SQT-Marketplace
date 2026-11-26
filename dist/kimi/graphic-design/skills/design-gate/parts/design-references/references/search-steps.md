# design-references — full reference-search steps

> Extension of the "Steps" section of `SKILL.md`. The rules that cannot be skipped (gate before starting · 0 references = fail · search `theme` + `social` every time · never copy a reference's colors as they are) are in `SKILL.md`. Commands in this file run from the skill's folder (`scripts/find_refs.py`).

## Contents

- Search and extract colors (steps 1–6)
- Let the owner pick the styles they like (do it the first time, or when asked)

## Search and extract colors

1. **Make 3 sets of search terms** from the project, in both Thai and English: (a) exact, such as "ร้านกาแฟ specialty" (b) close or competitor, such as "third wave coffee · Blue Bottle" (c) the mood wanted, such as "อบอุ่น มินิมอล". The script converts common Thai terms to English.
   - **The owner has a preferred style** (section "สไตล์ออกแบบที่ชอบ" (preferred design styles) in `~/.claude/superuser-style.md`) → set (c) uses search terms from that section, and when picking work in step 3, choose work that fits that style first. If the client has a brand guide, borrow only the layout, not the colors. If the user sends a new image they like → turn it into search terms and key traits and add them to that section; do not store the image.
   - **The preferred style clashes with a ban in `design-gate/no-ai-look` item 2** (such as purple-blue gradients · frosted glass across the whole page · a centered hero) use this order: brand guide or approved look → the owner's direct instruction for this job → `design-gate/no-ai-look` bans → preferred style. This means the preferred style is used to choose the direction (structure, density, mood), but the banned signal itself is not brought in. If the owner directly orders that signal in this job, it may be used; write `slop-ok: <rule> เจ้าของสั่ง <date>` in the file.
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
