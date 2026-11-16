---
name: design-direction-lookup
description: Use for a starting palette and Thai-Latin fonts on a new screen
---

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
