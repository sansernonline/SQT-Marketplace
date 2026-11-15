# skill: principle-prove-it-works

Use before saying work is done, fixed or working

# principle · prove it works — prove it against the real thing

> A "done" with no evidence throws the checking onto someone else.

## Rule

Before using the words done (`เสร็จ`) · fixed · passed (`ผ่าน`) · works · sent, you must have seen the result from the real thing yourself in this round.

For an item whose result you have not seen, write separately what was done and what the result is, for example "CSV: code changed, not yet opened in Excel" · do not write "fixed, but not tried yet", because readers remember the word done and forget the word but (eval 2026-11-09: the arm with the skill wrote it this way in 2 of 3 rounds)

| Work | Evidence that counts | Does not count |
|---|---|---|
| Document · report | A fresh reviewer opens the rendered file and checks the requirements one by one (the writer does not reread its own work) | The file was written successfully |
| Numbers · formulas · amounts | Recompute another way on 2–3 rows, and the total matches the source (receipt · statement) | The formula shows no error |
| Message to a customer · email · booking | Read it against the original question; name · amount · date match the real data, and for a booking you see the confirmation page | The draft looks good · a button was pressed and no error appeared |
| Feature in an app | Click it in the running app using the app-checking skill, and see the result meet the criteria | It compiles · reading the code looks right |
| Fix of a problem · bug | Repeat the case that failed before, by the same path, and it passes | Other parts pass |
| Test · check | The pass/fail numbers come from the summary line of the command run this round (or `node scripts/test-verdict.mjs <TAP or JUnit result file> --expect <count>`, which reads the result file and gives a verdict PROVEN · PARTLY · NOT PROVEN), not a count typed by hand · then break 1 line of code in a copy (invert a condition · return early); the test that covers that line must fail · if it does not fail = the test proves nothing yet | Only "pass" · a test count recalled from memory |
| Screenshot · render result | Judge from the pixels of the image you opened yourself, not from a description · look for failure signs first (red screen, blank screen, a box or dialog covering content), then compare with the log · ambiguous counts as failed · if a box covers it, take it again · the evidence names the image file | Reading the code and believing the look is right · saying the image "looks OK" without naming the file |
| mockup | Open in a browser, click every button, no fake buttons | The HTML has valid syntax |
| Measured values (sensor · lux · distance · weight) | Compare with a calibrated reference instrument · an emulator proves only the work path (label `emulator`), accuracy needs the real thing (label `เครื่องจริง <รุ่น>`, real device <model>) · no instrument → `ยังไม่ได้ตรวจ` (not yet checked) | One measurement · comparing against itself |
| A claim that it works on another system (Windows · macOS · another machine) in a PR or report | Label every claim: `observed` (ran it and saw the result on that system) or `reasoned` (worked out by thought) · a pass on your own machine is the weakest evidence for another system | Writing "works on every system" with no label |
| Sub-agent work | Read the work and run it yourself | The sub-agent reports it is done |

## How to do it

1. Before starting, write "how will I know it is done" in a checkable form
2. After the work, check against that on the real thing, and record the raw result (numbers · images · output)
3. If you truly cannot check (no environment · needs a real account), say plainly `ยังไม่ได้ตรวจ` (not yet checked) and what is missing; never write `ผ่าน` (pass)

## Claims that do not count as evidence

The first column quotes Thai claims as examples; English meanings are in brackets.

| Claim | Why it does not count | Do this instead |
|---|---|---|
| "น่าจะใช้ได้" · "ควรจะผ่าน" · "ในทางทฤษฎี" · "เหมือนครั้งก่อน" ("should work" · "ought to pass" · "in theory" · "same as last time") | Hedge words mean you have not looked — finding them in a final report = a red flag, go back and check before sending | Run or open it, then paste the raw result |
| "test ผ่านแล้ว" ("tests passed") with no output | Passed in memory and passing now are different things | Paste the summary line of this round's run |
| "แก้ตามที่บอกแล้ว" · "ไม่มี error" ("fixed as told" · "no errors") | No error ≠ the wanted result | Repeat the case that failed before and show it passes |
| A sub-agent reports it is done | A report is words, not a work product | Look at the diff or open the changed files yourself |
| A command ended with exit 0 · status shows `running` | exit 0 says only that the program ended, not that it worked · example from the course's `vastai` skill: the `vastai` CLI returns 0 even when the API answers with an error · `running` is not yet ready to use (`ssh … true` must return rc 0) · re-issuing the create command on a timeout got duplicate machines, paying twice | Check the end result with a list command or a command that really uses it · re-issue only after confirming the first one did not happen |
| Sending the user a command to run themselves when we could run it · checking only the easy part and concluding everything passed | Throws the checking onto someone else | Run it all yourself before using the word done |
| Drafting a message to a customer or outsider saying "fixed" so it can be sent right away, while the check is not finished (even with a trailing note that testing is in progress, such as "ทีมเราแก้ไขในระบบแล้ว ตอนนี้กำลังทดสอบอีกรอบ" ("our team fixed it in the system, now testing once more"), seen in eval 3 of 3 rounds 2026-11-09) | The recipient believes the word fixed at once, and if the check fails the words must be withdrawn | Draft 1 version with the condition that it is sent after the check result is seen · the version that can be sent now must not contain "แก้แล้ว" (fixed), "แก้ไขแล้ว" (has been fixed) or "เรียบร้อย" (all done) in any form; it may say only "ได้รับเรื่องแล้ว ทีมกำลังตรวจ จะแจ้งผลภายใน (เวลา)" (received, the team is checking, will report within (time)) |

Sources of the screenshot row · expo · .claude/skills/expo-skill-eval/agents/visual-grader.md · seen 2026-11-10 · the test row (verdict script + break one line of code) · code-modernization · commands/modernize-verify.md · seen 2026-11-10 · the observed/reasoned row · claude-remember (do not redistribute · took the mechanism only) · CONTRIBUTING.md · seen 2026-11-10 · reviewer lenses and packages → [`review-lenses`](../superuser/references/review-lenses.md)

Source of the claims-table idea: skill `verification-before-completion` in obra/superpowers (MIT) · rewritten to cover work outside code.


---

# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

Use on any work handed to people: code, documents, plans, designs, slides, tables and answers · `human-writing` controls **how it is written**, while this skill controls **what the work contains** · lives only in plugin `superuser`; other plugins share it through `dependencies`

## 1 · Main principles

- **The test:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone
- Do only what the task needs; do not provide for a future nobody has asked for
- Cut before adding · if removing a part loses neither meaning nor function, cut it
- Plain things people know beat clever things that need decoding
- **Simple is not sloppy** — never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly
- **Simple is not one big pile** — reduce the number of things, but keep clear separation of duties, 1 part doing 1 thing, as professional work does

## 2 · Ladder before starting — stop at the first step that works

1. Do we really need this · not needed → do not do it, and say in 1 line what you skipped
2. Is there an existing thing that works (file, template, function, tool, a feature that comes with the system) · yes → use the existing thing
3. Do the shortest version that is still complete and correct

## 3 · By kind of work

| Work | Do | Avoid |
|---|---|---|
| **Code** | Names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say "why" · follow the project's style | An abstraction with a single user · a clever shortcut that is hard to read · one big file doing everything · a pile-up `utils/` folder · a new dependency for a few lines of work |
| **Documents · reports** | Conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for data that is compared | Repeating what was already said · headings with no content · terms the reader does not know |
| **Plans · procedures** | 3–5 key items · every item has an owner and a way to measure done · the fewest steps that work | A list of 20 items with no priority · steps kept "just in case" |
| **Designs · slides · figures** | 1 page 1 point · the shortest path to the user's goal · use patterns people are familiar with | Cramming data until people must squint · decoration that does not help understanding |
| **Tables · data** | Only the columns used to decide · short formulas you can follow | Columns that repeat a meaning · long nested formulas in one line |
| **Answers** | Answer first · as long as the question needs | An explanation longer than the work itself |

Plugin `software-development` has more detail on code and architecture: `lazy-coding` (write less) · `readable-code` (names, function shape, file structure) · `simplicity-first` (documents, plans, architecture) · if installed, open them together

## 4 · Say that you made it simple on purpose

A deliberate shortcut should be written down with how far it works and when it changes, so it does not look forgotten, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` (gloss: simple: kept in memory — move to Redis when running more than 1 process) · in the report put 1 line `ข้าม: X — เพิ่มเมื่อ Y` (skipped: X — add when Y)

## 5 · 5-point check before sending

1. Can an outsider open it for the first time and understand within 30 seconds
2. Is there any part, step or layer that can be cut with no loss? If so, cut it
3. Does every part added have a reason it is needed now, not "just in case"
4. Is it still complete on correctness, safety, and what the user asked for
5. Are duties still clearly separated, and not several things squashed into one place to look short


---

# skill: design-direction-lookup

Use for a starting palette and Thai-Latin fonts on a new screen

# design-direction-lookup — find 3 starting looks from a Thai or English brief

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 genuinely different directions → run `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

Lives in plugin `software-development` · wording follows `human-writing` · used before `ui-craft` step 0.1 stage 3 (make 3 directions in parallel)

> **The one rule:** the draft gives a starting point; it does not replace the beauty gate — every direction produced must become a mockup and be chosen at the beauty gate of `ui-craft` step 9 · if the search says nothing was found, say so plainly; never invent colors or fonts and claim they came from data

## Use when

- Starting a new screen project, or the user orders a new design, and there is no visual direction yet (`ui-craft` step 0 says to do step 0.1)
- You need a 2-mode palette, a Thai-Latin font pair, or Thai UX rules that fit the business, e.g. "ทำเว็บคลินิกทันตกรรม อยากได้โทนสีกับฟอนต์ไทยที่เข้ากัน" (a dental clinic website, wants a matching color tone and Thai font)
- You want to know which chart fits this kind of data · how the home page should order its sections · what look rules a framework has

Do not use when: the project already has a look that passed the beauty gate (copy the sibling page per `ui-craft` step 0) · making a whole brand set, logo, or corporate colors (`brand-kit`) · checking finished work for looking AI-made (`no-ai-look`)

## Use another skill instead or alongside

| Situation | Use | Reason |
|---|---|---|
| Got the 3 directions, need to mock up and choose | `ui-craft` step 0.1 stages 3–5 and step 9 | This skill stops at the starting point; the choosing stage is there |
| Web app screens, dashboards, back-office systems | `web-app-design` | Page structure and components of the platform |
| Mobile app PWA | `mobile-app-design` | Small screen size, finger distance, Thai rules on small screens |
| Windows desktop app | `windows-app-design` | Real Fluent tokens beat palettes from here |
| Check the mockup before sending | `no-ai-look` (`slop_scan.py`) | The draft checks only colors and fonts, not the whole screen |
| The customer already has a brand, or a new brand must be made | `graphic-design:brand-kit` | Brand colors and fonts always beat the data here |

## 1 · Search one topic at a time

```bash
python scripts/design_search.py "ร้านทองออนไลน์" --domain industry
python scripts/design_search.py "ช่องวันที่ พ.ศ." --domain ux -n 5
python scripts/design_search.py "ฟอร์ม validation" --domain stack --stack blazor --json
```

- domain: `industry` · `palette` (backup store; results start with a warning to search live first) · `font` · `look` · `ux` · `chart` · `landing` · `stack`
- domains from ui-ux-pro-max-skill (English · [`data/upstream/uipro/README.md`](data/upstream/uipro/README.md)): `style` (88 styles with color values, shadow, motion, CSS, what to use it with, what not to use it with) · `product` (192 product types → page pattern, style, color and type mood, things to avoid) · `motion` · `slide` · `slide-strategy` · `slide-copy` · use together with our `look` and `industry` when choosing the 3 directions; colors from a source file are not contrast-checked · how to choose queries and read results → [`references/query-guide.md`](references/query-guide.md)
- 1 run, 1 intent, 2–5 words · Thai, English or mixed all work · you may search again with different words once; if still not found, tell the user
- The search segments Thai words with a dictionary built from the keywords column of the data and expands the query with a Thai-English synonym table, so `ร้านกาแฟมินิมอล` can be searched without spaces

## 2 · Search colors live first, then extract colors from real work

Do this every time there is a network, before drafting the 3 directions · color trends change fast, so the palettes in `data/` are a backup store for when live search is not possible, not the main source · colors passed to the draft with `--palette` or `--extra-palettes` always beat the store

0. **Search live per the `design-references` skill of `superuser`:** find this year's reference work and real business sites in the field, and note which color tones you see
1. **Choose 3–5 sites in the same field as the brief:** 2–4 Thai businesses and 1 large foreign one · choose only sites that are still active and recently redesigned, judged by the copyright year in the footer, news, or latest post · skip sites older than 2 years
2. **Look at this year's design work from at least 1 source** among those used by `ui-craft` step 0.1 stage 2 (Siteinspire or Awwwards), filtered by field or style, and note what you see that differs from the backup store
3. **Extract colors:**
   ```bash
   python scripts/brand_colors.py https://a.co.th https://b.co.th https://c.com
   python scripts/brand_colors.py <url เดิม> --palette web-<วงการ> > _to_delete/web-palettes.csv
   ```
   The result per site is brand colors ranked 1–4 with weight and source (theme-color · CSS variables such as `--primary` · frequency in CSS), the background and text colors, and the extraction date · the extractor reads only HTML and CSS and does not run JavaScript; for a site that needs JavaScript before it has content, the extractor says it could not extract; report that as is and never guess colors instead
4. **Build 1–2 new palettes** with `--palette` · the builder uses colors shared by many sites as primary and accent, shifts the hue slightly so it matches no single brand, then works out background, text, border and status colors that pass contrast in both modes · to get 2 sets, run again with another group of sites (for example a premium group and an affordable group) and append the CSV files
5. **Feed them to the draft:**
   ```bash
   python scripts/design_draft.py "<โจทย์>" --extra-palettes _to_delete/web-palettes.csv
   python scripts/design_draft.py "<โจทย์>" --palette "ร้านเก่า:bg=#FAF7F2,surface=#FFFFFF,text=#2B2118,text_muted=#6B5A48,primary=#8A3B12,secondary=#D9B26F,accent=#2F6F6A,border=#D8CBB8"
   ```
   `--palette` can be repeated for several sets and takes 3 forms: 8 named roles (as in the example · `secondary` may be omitted) · 8 colors in the order bg surface text text_muted primary secondary accent border · or 1–7 brand colors (the first is the main color) · light mode uses the colors passed in as they are, while on_primary, status colors and dark mode are worked out by the draft to pass contrast · `secondary` has no column in the table and is recorded in notes · colors that fail contrast or are Tailwind defaults are rejected with the reason
   `--palettes` selects and orders some sets as directions A B C · if the brief matches no industry in the data, the draft uses a temporary industry `custom` and picks the look and font pair from words in the brief instead of stopping
   A palette that fails contrast does not stop the command: the draft first tries setting on_primary to white or black, and if it still fails, drops it and notes it under "dropped before drafting" (`ที่ตัดออกก่อนร่าง`) · colors extracted from other people's work go in `--reference-colors [degrees]` (default 8) to shift the hue and make DESIGN.md state the source truthfully (if contrast fails after shifting, the draft adjusts lightness by at most 10% before dropping) · if 2 industries score close, the result names both; choose with `--industry` · the heading font does not repeat across the 3 directions · `--voice rounded|angular|modern|formal|classic|hand` gives direction A a font pair with the chosen personality, picked from the project's basics (`ui-craft/references/font-voice.md` · column `voice` in `font-pairs.csv`)
6. **Record in DESIGN.md:** the URL of every site viewed, the design sources viewed, the viewing date of every source, the colors obtained, and sites that could not be extracted

No network, or colors cannot be extracted from any site → skip to section 3 without passing colors; the draft uses the backup store in `data/` with a warning on screen and in DESIGN.md saying "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า" (using the backup color store; a live search per design-references would be more current)

## 3 · Draft 3 directions in one command

```bash
python scripts/design_draft.py "<โจทย์>" --out docs/DESIGN.md --html docs/design/<รหัส>-design-directions.html
```

The draft works in this order:

1. Find the industry from the brief; if not found, the draft uses a temporary industry `custom` and picks the look and fonts from words in the brief (does not guess colors)
2. Order the directions as the industry row sets (look · palette · font pair, same position); if live colors were passed in, palettes are ordered as passed; then check each direction
3. **Drop directions that fail, then take the next one:** contrast below 4.5:1 for text or 3:1 for buttons and borders in either mode · has a Tailwind default color (slate gray zinc neutral indigo violet) · Inter or Geist as the first font · a Thai font with no Latin partner, such as Noto Sans Thai alone
4. The looks of the 3 directions must not repeat · if the directions set by the industry are not enough, the draft fills in from looks found by the industry's words
   · the main colors of any 2 directions must be far apart in both RGB distance and hue (under 20 degrees counts as the same tone) · each direction uses a different page structure per look: large left-aligned type (editorial) · boxes of several sizes (bento) · toolbar with a dense table (dense)
5. Find 5 related UX rules (Thai rules go first when scores are close)
6. Write `docs/DESIGN.md` and the HTML comparison page (2-mode swatches · Thai headings and body in the real font · a line that checks vowels and tone marks · buttons · status badges) · **an existing file is not overwritten** unless `--force` is given

Text the draft generates passes the ad-word filter (ยกระดับ · ไร้รอยต่อ · seamless · elevate etc.; the Thai words mean "elevate" and "seamless") · if the source data has these words, the draft stops and tells you to fix the data

## 4 · After you have the draft

1. Open the comparison page and look at both modes yourself; do not trust the contrast numbers alone · in some Thai fonts the upper vowels hit the previous line, which you must see with your eyes
2. Send the 3 directions to `ui-craft` step 0.1 stage 3 (a fresh subagent per direction · an agent that cannot call a sub-team does each direction itself in turn and notes it under "ตัดสินใจเอง" (own decisions)) · each direction adds 1 bold move of its own; the draft does not choose it for you
3. If the customer has brand colors or fonts, substitute the values in each direction and rerun the contrast check (`no-ai-look/scripts/slop_scan.py`)
4. Choose the direction that passes the beauty gate, and write the reason under `## ตัดสินใจเอง` (own decisions) of `docs/BUILD-PLAN.md`

## 5 · Data

**The palettes in this set are a backup store for when live search is not possible · the looks and font pairs are also backup values, reviewed every 6 months** to match current trends (next review 2027-04-26 · `scripts/check/expiry.json` warns when the date is near) · with a network, always start from step 2

**Left out of this set on purpose** · icons: use one set across the whole app per `ui-craft` and `no-ai-look`, no table search needed · motion: each look already has a motion slot, details are in `ui-craft/references/depth-and-flourish.md` and `graphic-design:motion-basics` · Latin-only fonts: the font pairs already name the Latin font, and for the full list see fonts.google.com · stacks other than the 7 (Next.js · Vue · SwiftUI etc.) are added when real work needs them, not ahead of time

The CSV files in `data/` (multi-value fields separated by `;`) are checked by `scripts/check_data.py` · the search reads every file at startup, no need to build an index ahead of time

| File | Contents |
|---|---|
| `industries.csv` | Industry → personality · look · palette · font pair · cautions · deciding rules |
| `palettes.csv` | Backup color store by color role, 2 rows per id (light · dark) · used when there are no colors from a live search |
| `font-pairs.csv` · `thai-fonts.csv` | Thai-Latin pairs · smallest body size · line-height · licence |
| `looks.csv` | Looks of `ui-craft/references/web-looks.md` · depth · motion · prohibitions |
| `ux-rules.csv` · `charts.csv` · `landing.csv` · `stacks/<stack>.csv` | UX rules including Thai rules · charts · section order · per-framework rules |

If you add a new row and cannot find it with Thai words, put that word in the row's keywords column, because the dictionary segmentation is built from this column.

## A real example

**Brief:** "เว็บขายทองรูปพรรณ ร้านเก่าในเยาวราช ลูกค้า 35–60 ซื้อผ่านมือถือ" (a website selling gold jewelry, an old shop in Yaowarat, customers aged 35–60 buying on mobile)

**Run:** `python scripts/design_draft.py "<โจทย์>" --out _to_delete/gold/DESIGN.md --html _to_delete/gold/gold-design-directions.html`

**Result (run 2026-10-26):** matched `gold-shop` as rank 1 · direction A luxury + palette `gold-leaf` + fonts Chonburi/Taviraj · direction B editorial + `yaowarat-red` + Trirong/Taviraj · direction C Thai craft + `thai-silk` + Anuphan/IBM Plex Sans Thai · every palette passes contrast in both modes · 5 UX rules, for example money amounts use tabular-nums and show the last update time of the price · the end of DESIGN.md says palette `night-vault` was dropped because its main color on a light background got 2.91:1 · the comparison page passed `slop_scan.py` with no findings

## Check before sending

- [ ] `python scripts/design_search.py --self-test` · `python scripts/design_draft.py --self-test` · `python scripts/brand_colors.py --self-test` all pass
- [ ] With a network → searched live per `design-references`, and DESIGN.md notes the URLs of real business sites and design sources viewed, with the viewing date of every source · with no network → DESIGN.md has the backup-store warning
- [ ] If you changed the search or the data → run `--eval references/relevance-cases.json` and the holdout is still not below 85 %
- [ ] DESIGN.md has 3 directions with distinct looks and says they are a starting point, not a verdict
- [ ] The comparison page has no Inter as the main font, no Tailwind default colors, and no Thai font without a Latin partner
- [ ] Did not overwrite the project's existing DESIGN.md by accident (no `--force` unless necessary)

## Sources

- `data/upstream/uipro/` copied unchanged from ui-ux-pro-max-skill commit `28b3b8d` (MIT · 2026-10-29), as the owner ordered it copied for improvement
- The idea of a searchable dataset, the BM25 search with an abstain threshold, and the design-system generator come from nextlevelbuilder/ui-ux-pro-max-skill (MIT · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · viewed 2026-10-26) · the code and data here are entirely rewritten, not copied · what is done differently from the source: Thai word segmentation · 3 directions instead of 1 answer · dropping framework default colors · Thai-Latin font pairs
- BM25 is a widely published ranking method, written by us in `scripts/design_search.py` · k1 1.5 and b 0.75
- The contrast thresholds 4.5:1 and 3:1 follow `ui-craft` step 5 (WCAG 2.2 criteria 1.4.3 and 1.4.11)
- 3 directions · look · app personality from `ui-craft` step 0.1 · `ui-craft/references/web-looks.md` · `ui-craft/references/app-character.md`
- The color and font rules that are dropped match the rules `framework-default` and `overused-font` of `no-ai-look/scripts/slop_scan.py`


## reference: query-guide.md

# How to search design data

For use with `scripts/design_search.py` · search works in Thai, English and a mix, because the searcher segments Thai words itself and has a Thai-English synonym table

## How to search so you find it

- **1 search, 1 intent, 2–5 words** such as `ร้านทองออนไลน์` · `date picker พ.ศ.` · `ฟอนต์ไทยมีหัว ทางการ`. If you paste a whole paragraph, the irrelevant words spread the score thin.
- **Pick the domain that matches the question.** If you give none, the searcher assumes `industry`.

| You want to know | domain | Example queries |
|---|---|---|
| What personality, look, colours and fonts this business should have | `industry` | `คลินิกทันตกรรม` · `cooperative savings` |
| Backup palette library, 2 modes by mood or material (search live first, use the library when live search is not possible) | `palette` | `ทอง หรู` · `calm green` |
| Thai-Latin font pairs | `font` | `มีหัว ทางการ` · `rounded friendly` |
| Look (depth, motion, prohibitions) | `look` | `editorial` · `งานมือไทย` |
| UX rules and Thai rules | `ux` | `ช่องวันที่ พ.ศ.` · `touch target` |
| Which chart fits this data | `chart` | `แนวโน้มยอดขายรายเดือน` |
| Section order of the home page | `landing` | `สั่งซื้อผ่าน LINE` · `booking` |
| Framework-specific rules | `stack` + `--stack <name>` | `ฟอร์ม validation --stack blazor` |

- To see the available stack names: open the `data/stacks/` folder (1 file per stack), or search with a name that does not exist and the searcher will list the names
- To use the result further in a script, add `--json` · to get more than 3 rows, add `-n 10`

## When the search finds nothing

The searcher answers "ไม่พบที่ตรง" (no match found) when the words of the request that exist in the data are covered less than 25 %. Do this in order:

1. Switch to the words people in that field use, or switch language once (`ร้านขายยา` → `pharmacy`)
2. If it still finds nothing, tell the user plainly that the data has no row for this, choose the closest row yourself, and write it under `## ตัดสินใจเอง` (decided on my own)
3. Never invent an id, colour or font the searcher did not return and tell it as if it came from the data

## Reading the result

- `คะแนน` (score) is BM25, and is for comparing only within one query, not across queries
- `ครอบคลุม` (coverage) is the share of the query's words (weighted by rarity) that the row has · below 50 % means a partial match, so look at the row before using it
- A palette returns 1 result per id, but `--json` has both modes (`rows`)

## Measuring accuracy

`python scripts/design_search.py --eval references/relevance-cases.json` reports the % of cases where the expected id is in the top 3, split into the calibration set and the holdout set, and split into Thai and English · you may fix the searcher or the queries in the calibration set · **never edit a holdout case to make it pass**, because that set exists to measure whether the searcher works on words it has never seen
