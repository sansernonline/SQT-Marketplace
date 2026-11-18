# skill: principle-prove-it-works

Use before saying work is done, fixed or working

# principle · prove it works — prove it against the real thing

> **One rule:** before using the words done (`เสร็จ`) · fixed · passed (`ผ่าน`) · works · sent, you must have seen the result from the real thing yourself in this round.

## Use when
- You are about to report work as done, fixed, passed, working, or sent
- A sub-agent reports done, or a draft for an outsider says "fixed"

## Steps
1. Before starting, write "how will I know it is done" in a checkable form.
2. After the work, check against that on the real thing and record the raw result (numbers · images · output). Use the evidence column below.
3. If you truly cannot check (no environment · needs a real account), say plainly `ยังไม่ได้ตรวจ` and what is missing; never write `ผ่าน`.
4. For an item whose result you have not seen, write what was done and what the result is separately, e.g. "CSV: code changed, not yet opened in Excel". Do not write "fixed, but not tried yet": readers remember done and forget but.
5. If a draft for a customer or outsider says "fixed" while the check is unfinished (even with "now testing"), write 1 version to send after the result is seen. The version that can be sent now must not contain "แก้แล้ว", "แก้ไขแล้ว" or "เรียบร้อย" in any form; it may say only "ได้รับเรื่องแล้ว ทีมกำลังตรวจ จะแจ้งผลภายใน (เวลา)".

| Work | Evidence that counts |
|---|---|
| Document · report | A fresh reviewer opens the rendered file and checks the requirements one by one (the writer does not reread its own work) |
| Numbers · formulas · amounts | Recompute another way on 2–3 rows; the total matches the source (receipt · statement) |
| Message to a customer · email · booking | Read against the original question; name · amount · date match the real data; for a booking, see the confirmation page |
| Feature in an app | Click it in the running app using the app-checking skill and see the criteria met (compiling or reading code does not count) |
| Fix of a bug | Repeat the case that failed before, by the same path, and it passes |
| Test · check | Pass/fail numbers come from this round's summary line (or `node scripts/test-verdict.mjs <TAP or JUnit result file> --expect <count>` → PROVEN · PARTLY · NOT PROVEN), never from memory · then break 1 line in a copy (invert a condition · return early); the test covering it must fail, otherwise the test proves nothing yet |
| Screenshot · render | Judge from the pixels of an image you opened yourself, looking for failure signs first (red or blank screen, a box covering content), then compare with the log · ambiguous counts as failed · name the image file in the evidence |
| Mockup | Open in a browser and click every button; no fake buttons |
| Measured values (sensor · lux · distance · weight) | Compare with a calibrated instrument · an emulator proves only the work path (label `emulator`); accuracy needs the real thing (label `เครื่องจริง <รุ่น>`) · no instrument → `ยังไม่ได้ตรวจ` |
| Works on another system (Windows · macOS · another machine) | Label every claim `observed` (ran it there) or `reasoned` (worked out); a pass on your own machine is the weakest evidence for another system |
| Sub-agent work | Read the work and run it yourself |

**Not evidence:** hedge words ("น่าจะใช้ได้" · "ควรจะผ่าน" · "ในทางทฤษฎี" · "เหมือนครั้งก่อน": in a final report they are a red flag, go back and check) · "test ผ่านแล้ว" with no output · "ไม่มี error" (no error is not the wanted result) · exit 0 or status `running` (exit 0 says only the program ended) · a sub-agent's own report · sending the user a command to run when you could run it · checking only the easy part. Full table with reasons and the `vastai` exit-0 case: [`references/evidence-table.md`](references/evidence-table.md).

## Check before done
- Every "done" word in the report has a raw result from this round behind it
- Anything not seen is labelled `ยังไม่ได้ตรวจ`, with what is missing
- No hedge word survives in the final report

## References
- [`references/evidence-table.md`](references/evidence-table.md) — open when judging a test, screenshot, measured value, cross-system claim, or sub-agent result, or when a claim of yours sounds like one on the "not evidence" list; also holds the sources


## reference: evidence-table.md

# Evidence by kind of work, and claims that do not count · principle-prove-it-works

Open this when the work is a test, a screenshot, a measured value, a cross-system claim, a message to a customer, or a sub-agent result, or when a claim in your own report sounds like one in the second table.

## Evidence by kind of work (full wording)

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

## Sources

Sources of the screenshot row · expo · .claude/skills/expo-skill-eval/agents/visual-grader.md · seen 2026-11-10 · the test row (verdict script + break one line of code) · code-modernization · commands/modernize-verify.md · seen 2026-11-10 · the observed/reasoned row · claude-remember (do not redistribute · took the mechanism only) · CONTRIBUTING.md · seen 2026-11-10 · reviewer lenses and packages → [`review-lenses`](../../superuser/references/review-lenses.md)

Source of the claims-table idea: skill `verification-before-completion` in obra/superpowers (MIT) · rewritten to cover work outside code.


---

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

# skill: design-direction-lookup

Use for a starting palette and Thai-Latin fonts on a new screen

# design-direction-lookup — find 3 starting looks from a Thai or English brief

> **Pre-work gate (`ด่านก่อนลงมือ`, every time):** read the owner's theme → search live references → 3 genuinely different directions → run `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand fixes colors and fonts; the search finds the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **One rule:** the draft gives a starting point; it does not replace the beauty gate. Every direction must become a mockup and be chosen at the beauty gate of `ui-craft` step 9. If the search finds nothing, say so plainly; never invent colors or fonts and claim they came from data.

## Use when
- Starting a new screen project, or the user orders a new design, and there is no visual direction yet (`ui-craft` step 0 says to do step 0.1; this runs before its stage 3).
- You need a 2-mode palette, a Thai-Latin font pair, or Thai UX rules that fit the business, such as "ทำเว็บคลินิกทันตกรรม อยากได้โทนสีกับฟอนต์ไทยที่เข้ากัน".
- You want to know which chart fits the data, how the home page should order its sections, or what look rules a framework has.

Not for: a project whose look already passed the beauty gate (copy the sibling page per `ui-craft` step 0) · a whole brand set, logo, or corporate colors, or a customer who already has a brand → `graphic-design:brand-kit` · checking finished work for looking AI-made → `no-ai-look` · web app or dashboard screens → `web-app-design` · mobile PWA → `mobile-app-design` · Windows desktop → `windows-app-design`.

## Steps
1. **Search one topic at a time.**
   ```bash
   python scripts/design_search.py "ร้านทองออนไลน์" --domain industry
   python scripts/design_search.py "ช่องวันที่ พ.ศ." --domain ux -n 5
   python scripts/design_search.py "ฟอร์ม validation" --domain stack --stack blazor --json
   ```
   - Domains: `industry` · `palette` (backup store; results start with a warning to search live first) · `font` · `look` · `ux` · `chart` · `landing` · `stack`. Upstream domains (English, [`data/upstream/uipro/README.md`](data/upstream/uipro/README.md)): `style` · `product` · `motion` · `slide` · `slide-strategy` · `slide-copy`. Colors from upstream are not contrast-checked.
   - 1 run, 1 intent, 2–5 words, in Thai, English, or mixed. You may search again once with different words; if still not found, tell the user.
2. **Get colors live first, every time there is a network, before drafting.** Palettes in `data/` are a backup store; colors passed with `--palette` or `--extra-palettes` always beat the store. The method (search per `design-references`, choose 3–5 active sites, extract colors with `scripts/brand_colors.py`, build palettes, `--palette` forms, record in DESIGN.md) is in [`references/live-colors.md`](references/live-colors.md); open it before this step.
   - The extractor reads only HTML and CSS. If it cannot extract a site, report that as is; never guess colors instead.
   - No network, or no site could be extracted: skip live colors. The draft uses the backup store with a warning on screen and in DESIGN.md: "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า".
3. **Draft 3 directions in one command.**
   ```bash
   python scripts/design_draft.py "<โจทย์>" --out docs/DESIGN.md --html docs/design/<รหัส>-design-directions.html
   ```
   - The draft drops a direction and takes the next if: contrast is below 4.5:1 for text or 3:1 for buttons and borders in either mode · it has a Tailwind default color (slate gray zinc neutral indigo violet) · Inter or Geist is the first font · a Thai font has no Latin partner (such as Noto Sans Thai alone).
   - The 3 looks must not repeat, and any 2 directions need main colors far apart (under 20 degrees of hue counts as the same tone). An existing DESIGN.md is not overwritten unless `--force` is given.
   - If the brief matches no industry, the draft uses a temporary industry `custom`. If the source data contains ad words (ยกระดับ · ไร้รอยต่อ · seamless · elevate), the draft stops; fix the data.
   - Flags and the full order of the draft: [`references/draft-details.md`](references/draft-details.md).
4. **After the draft:**
   1. Open the comparison page and look at both modes yourself; do not trust the contrast numbers alone. In some Thai fonts the upper vowels hit the previous line.
   2. Send the 3 directions to `ui-craft` step 0.1 stage 3 (a fresh subagent per direction; an agent that cannot call a sub-team does each direction in turn and notes it under "ตัดสินใจเอง"). Each direction adds 1 bold move of its own; the draft does not choose it.
   3. If the customer has brand colors or fonts, substitute them in each direction and rerun the contrast check (`no-ai-look/scripts/slop_scan.py`).
   4. Choose the direction that passes the beauty gate and write the reason under `## ตัดสินใจเอง` of `docs/BUILD-PLAN.md`.

## Check before done
- [ ] `python scripts/design_search.py --self-test` · `python scripts/design_draft.py --self-test` · `python scripts/brand_colors.py --self-test` all pass.
- [ ] With a network: searched live per `design-references`, and DESIGN.md lists the URLs of real business sites and design sources viewed, with the viewing date of each. With no network: DESIGN.md has the backup-store warning.
- [ ] If you changed the search or the data: `--eval references/relevance-cases.json` and the holdout is not below 85 %.
- [ ] DESIGN.md has 3 directions with distinct looks and says they are a starting point, not a verdict.
- [ ] The comparison page has no Inter as the main font, no Tailwind default colors, and no Thai font without a Latin partner.
- [ ] The project's existing DESIGN.md was not overwritten by accident (no `--force` unless needed).

## References
- [`references/query-guide.md`](references/query-guide.md) — open when choosing queries and domains or reading results.
- [`references/live-colors.md`](references/live-colors.md) — open at step 2: live color search, extraction, building palettes, `--palette` forms.
- [`references/draft-details.md`](references/draft-details.md) — open when tuning the draft (flags, order of checks), editing `data/` CSV files, or wanting a worked example.
- [`references/sources.md`](references/sources.md) — sources and licences.


## reference: draft-details.md

# How the draft works (`design_draft.py`)

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

## Data

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


## reference: live-colors.md

# Search colors live first, then extract colors from real work

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

No network, or colors cannot be extracted from any site → skip to the draft step (SKILL.md step 3) without passing colors; the draft uses the backup store in `data/` with a warning on screen and in DESIGN.md saying "ใช้คลังสีสำรอง ค้นสดตาม design-references จะทันสมัยกว่า" (using the backup color store; a live search per design-references would be more current)


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


## reference: sources.md

# Sources · design-direction-lookup


- `data/upstream/uipro/` copied unchanged from ui-ux-pro-max-skill commit `28b3b8d` (MIT · 2026-10-29), as the owner ordered it copied for improvement
- The idea of a searchable dataset, the BM25 search with an abstain threshold, and the design-system generator come from nextlevelbuilder/ui-ux-pro-max-skill (MIT · https://github.com/nextlevelbuilder/ui-ux-pro-max-skill · viewed 2026-10-26) · the code and data here are entirely rewritten, not copied · what is done differently from the source: Thai word segmentation · 3 directions instead of 1 answer · dropping framework default colors · Thai-Latin font pairs
- BM25 is a widely published ranking method, written by us in `scripts/design_search.py` · k1 1.5 and b 0.75
- The contrast thresholds 4.5:1 and 3:1 follow `ui-craft` step 5 (WCAG 2.2 criteria 1.4.3 and 1.4.11)
- 3 directions · look · app personality from `ui-craft` step 0.1 · `ui-craft/references/web-looks.md` · `ui-craft/references/app-character.md`
- The color and font rules that are dropped match the rules `framework-default` and `overused-font` of `no-ai-look/scripts/slop_scan.py`
