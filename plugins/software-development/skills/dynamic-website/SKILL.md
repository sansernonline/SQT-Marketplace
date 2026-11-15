---
name: dynamic-website
description: Use when a marketing website needs scroll motion or 3D
---

# Dynamic Website

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (Pre-work gate) of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the job with the line `ด่านก่อนลงมือ:` (Pre-work gate:)

> **Language:** wording on every line by `human-writing` · look and spacing by `ui-craft` — this skill says how to make a "chapter by chapter storytelling" website move without making readers dizzy.

> **The one rule of this skill:** every motion passes through one gate (`T()` in JS + a kill-switch in CSS) and **each chapter has its own entrance** — fade-up repeated everywhere is the number 1 AI signal of this kind of website.

The reference is the website ai4ba.ai-cie.com (public code read 2026-10-22 · no licence stated → every recipe is rewritten in our own form, keeping only the ideas and the author's Thai sentences inside «…» marks) · a working example you can open: `assets/example-deck.html` · copy-ready code: `references/recipes.md`

## When to use

- Marketing sites · seminar pages · product launch pages · "About us" pages where you want people to read chapter by chapter
- A single page with 3–7 full-screen chapters, changed by mouse wheel, keyboard, or swipe (deck-mode), or a normal scrolling page where content appears when scrolled to (page-mode)
- Has a "meaningful" background (a network of people · a schedule route · a map) with a camera that moves per chapter

## When **not** to use

| Task | Use |
|---|---|
| Dashboard · admin page · internal tool · SaaS — users must work, not watch a story | `web-app-design` + `ui-craft` (motion budget ≤ 350 ms) |
| Presentation slides where a speaker presses to change pages, with speaker notes | `html-slide-deck` |
| No storyline yet — you do not know what each chapter says | `presentation-design` steps 1–3 first, then come back |
| Animated clip or moving logo, not a web page | `motion-basics` (plugin `graphic-design`) |

---

## 1 · Structure

```
hashchange → route()
   │ #view.out 180 ms → cleanup() ← cleanups[] (Observer.kill · ถอด wheel/keydown · clearInterval · ยกเลิก rAF)
   ├─ hash เป็นชื่อบท → deck-mode: body.deck-mode → goChapter(j): [ออกบทเดิม]→ซ่อน→[กล้องบิน]→โชว์→[เข้าบทใหม่]
   │                                   rail · คีย์บอร์ด · wheel · Observer (touch) · history.replaceState
   └─ อื่น ๆ ────────→ page-mode: body.page-mode → IntersectionObserver ติด .in · พื้นหลังหรี่เหลือ .22
getWorld(): รอ renderer หนักไม่เกิน 4 วินาที → WebGL ได้? → three.js (กล้องเป็น object ที่ GSAP tween) · ไม่ได้ → body.no-webgl + เครือข่าย 2D canvas
```

| Part | How |
|---|---|
| 2 modes | **deck-mode** chapters stacked with `position:absolute; visibility:hidden`, only `.on` is visible · **page-mode** a normal scrolling page, using reveal item 8 of recipes · one site can have both modes (story chapters = deck · registration, payment, admin = page) |
| hash router | One function `route()` on `hashchange` · changing chapters uses `replaceState` (so the Back button is not full of chapters) · changing pages uses a normal hash |
| cleanup list | Every view pushes its own teardown function into `cleanups[]` · `route()` clears them all before rendering a new view — no leftover listeners, no leaking timers |
| markup that declares the entrance | `<section class="ch" data-enter="blurWords">` · heading `data-t` · followers `data-f` · image `data-w` · content lives in HTML, not in JS |
| heavy renderer | Load three.js as a module in parallel · wait for `neural:ready` or 4 seconds · probe WebGL · if it fails → `body.no-webgl` + a 2D canvas fallback that conveys the same meaning · `setAnimationLoop` only while the screen needs it |

## 2 · 15 rules

1. **One gate** — every duration · delay · stagger goes through `T(s) = reduced ? 0 : s` in JS and 1 kill-switch block in CSS · do not check reduced-motion in each animation
2. **4 entrances per site**, chosen per chapter in the markup, never the same one in 2 chapters in a row — «ห้ามใช้ fade+slide-up ซ้ำทุกจุด»
3. **Exit shorter than entrance, and accelerating** (`power3.in` 0.22 seconds) · the new chapter enters when the camera has flown about 40% of the way
4. **Clear the filter after the entrance ends** (`clearProps:'filter'`) text must be sharp · blur ≤ 10px and brief · never animate `backdrop-filter`
5. **Animate only transform · opacity · clip-path** (+ filter for a short time) · never touch width height top
6. Hidden chapters get `visibility:hidden` + `pointer-events:none` · toggle `aria-hidden` in the timeline · hash with `replaceState`
7. **The background must mean something** — 1 dot = 1 person · line = schedule · «ชี้เมาส์ = กล้องบินไปดูตรงนั้นทันที» · not particles floating for fun
8. **Heavy renderer loads later**: set a 4-second wait, probe WebGL, have a 2D fallback and CSS for `body.no-webgl`
9. **A list inside a chapter scrolls first**: at the edge, give a hint, stop scrolling, and only then change chapter — «ไม่ให้หลุดบทตอนกำลังอ่าน»
10. **`passive:false` only for wheel/touch in deck-mode**, removed when the route changes · `scroll` and `pointermove` are always `{passive:true}`
11. **Keyboard map is mandatory**: ↓ PgDn Space · ↑ PgUp · Home End · skip when inside an input or modal · rail buttons have `aria-current="step"`
12. **Move focus after changing chapter** (`section tabindex="-1"` then `.focus()`), otherwise the keyboard stays in the old chapter
13. **Reduced motion must show all content** (WCAG 2.3.3) — type the real text at once, every word `.on`, particles at their destination
14. **Limit GPU load** — `devicePixelRatio` at most 2 (1.75 on screens < 900px) · clamp `dt` to 50 ms · the loop runs only while needed
15. **Self-host fonts**, split Thai/Latin with `unicode-range` · preload only 2 weights above the fold · `font-display:swap`

## 3 · Recipes

All code is in `references/recipes.md` (each block ≤ 15 lines, with its source)

| Recipe | What it does | Use / do not use | reduced-motion |
|---|---|---|---|
| T gate + kill-switch | The one gate of all motion | Every file · do not re-check per item | itself |
| splitWords | Split text into `.wd` by spaces | Before a per-word entrance · Thai = put spaces at the rhythm you want the entrance to follow | not affected |
| blurWords | Default entrance, words blurred → sharp | Thai/Latin headings ≤ 12 words | duration 0 · clear blur |
| inkWords | Words darken from .14 | Long closing sentence · readable from the first frame | same |
| blurLine | Whole block blurs in with stagger 0.08 | Followers `data-f` · paragraphs · forms | same |
| wipe | `clip-path` bottom → top | 1 image or figure per chapter | same |
| decodeWords | Random characters run until they settle | Latin headings only · **not for Thai** (floating vowels break) | type the real text at once |
| exit | Short exit, accelerating | Pair with every entrance | 0 |
| goChapter | One timeline: exit → hide → camera → show → enter | deck-mode | immediate |
| iris | A brand-colour circle grows from the click point, swap page behind the circle | Route change from clicking a "thing" on screen · not every navigation | skip, set the hash directly |
| count-up | A number flows to its value | 1 statistic you want remembered · not every card | type the final value |
| scroll reveal + .lines | CSS does the motion, IO adds `.in` | page-mode | kill-switch |
| scrubWords | Words light up by scroll position | 1 long sentence per page · not body text | every word `.on` |
| wheel + inner-list lock | Wheel changes chapter, list scrolls first | deck-mode only · `passive:false` | T=0 makes it immediate |
| Observer swipe | Swipe changes chapter `tolerance:24` | Mobile deck-mode · skip `.scrollable` | same |
| keyboard map | ↓ PgDn Space · ↑ PgUp · Home End | Every chapter-style site (mandatory) | same |
| rail | Number list 01–05 on the right · bottom bar on mobile | 3–7 chapters | CSS only |

## 4 · Tokens and type scale

**Colour comes from the work** — if there is a brand colour, use it · if not → **search references first:** take the project's words and search live per `design-references` (plugin `superuser`) type `web` or `motion`, then extract colours from the chosen work · the stored palette library is for when live search is impossible · if live search is impossible → house value `#2A78D6` (dark shade `#226CC6` for text on a light background), write `(รอยืนยัน)` (awaiting confirmation) and carry on · the values in the table are the reference site's, so stick to the **token list and its roles**, not the colour values · token names match `web-app-design` → `references/tokens.md` so page-mode pages (forms · admin) can use the same set

| Token | Reference value | Type role | Value |
|---|---|---|---|
| `--bg` · `--surface` | `#F7F6F2` · `#FFF` | body text | 400 16px/1.6 "IBM Plex Sans Thai", system-ui |
| `--ink` · `--ink-2` · `--muted` | `#0F0F0E` · `#3A3934` · `#6B6A63` | hero display | `clamp(52px, 8.4vw, 132px)` · lh 1.04 · ls -.035em · 700 |
| `--line` · `--line-2` | `#E4E1D8` · `#CFCBBF` | chapter heading (deck) | `clamp(42px, 5.7vw, 94px)` · lh 1.02 · ls -.04em |
| `--accent` · `--accent-ink` · `--accent-soft` | brand colour · dark shade · light shade 95% | kicker h2 | `clamp(40px, 5.2vw, 76px)` · lh 1.05 · ls -.035em |
| `--ok` `--warn` `--bad` (+ `-soft`) | green · amber · red — do not change with the brand | closing sentence | `clamp(34px, 4.2vw, 66px)` · lh 1.16 · 600 · max-width 12.5em |
| `--ease` | `cubic-bezier(.16,1,.3,1)` (expo-out) | lead / hero-sub | 18px or `clamp(17px,1.6vw,20px)` · max-width 34–36em |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | large outlined number | `clamp(100px,9vw,170px)` · `-webkit-text-stroke` 1.5px ink 13% |
| `--r` · `--pad` · `--max` · `--top` | 8px · 24px→16px · 1200px · 64px→56px | eyebrow / small | 12–13px · ls .04–.28em (Latin only) · `tabular-nums` |

- Large Thai headings with negative `letter-spacing` must be checked at every weight — when tone marks collide with vowels, back off to -.01em · `uppercase` + wide ls is for Latin eyebrows only (`web-app-design` item 5)
- The 3D background sits at z-index 0 under `main` (z 1) · deck opacity 1 · page-mode .22 · with a gradient scrim `.deck::before` «ให้ตัวหนังสืออ่านง่ายเหนือเครือข่าย»

## 5 · Choosing tools

| Need | GSAP 3 (+ Observer · ScrollTrigger · SplitText) | CSS scroll-driven (`animation-timeline`) | View Transitions (same-document) | CSS scroll-snap |
|---|---|---|---|---|
| Status 2026-10 | 3.15.0 on cdnjs · every plugin free since 3.13 (2025-04) | MDN "Limited availability" · Chrome/Edge 115+ · Safari 26+ · Firefox behind a flag (Interop 2026) | Baseline Newly available · Firefox 144 · Chrome 111 · Safari 18 | 97% supported · Chrome 69 · Safari 11 · Firefox 68 |
| Choose when | Chapters that overlap in time · camera/3D rig · capturing wheel and swipe · splitting words | Progress bar · parallax · reveal in a normal scrolling page — must look fine even when it does not run | Switching a route or state where old and new DOM exist together (list → detail · theme · chapter switch with no 3D) | Chapter-style site with no JS · want the browser to handle scrolling itself |
| Do not use for | Simple reveals that CSS + IO already do | Things that must work on Firefox today with no fallback · scroll-jacking (cannot be done) | Continuous scroll-linked effects · 3D camera | Chapters with a scrolling list inside (snap will fight) · overlapping exit/enter timelines |
| reduced motion | `T()` + `gsap.matchMedia()` | kill-switch `@media (prefers-reduced-motion)` | `::view-transition-group(*){animation:none}` | turn off `scroll-behavior:smooth` |

- `@starting-style` (Baseline 2024-08) for transitions when appearing from `display:none` · Lenis 1.3.x (MIT) if you want smooth scrolling — drive it with `gsap.ticker` so there is only one rAF loop, and `respectReducedMotion:true` (the default)
- Load GSAP from cdnjs for the mockup · for real delivery, self-host the files in `vendor/` (the site must open without depending on a CDN that is down)
- If you need deeper GSAP API than this page gives (pin and scrub of ScrollTrigger · nested timelines · Flip · MorphSVG) → open the maker's official skill at github.com/greensock/gsap-skills (MIT) and read only the file of the plugin you use, do not load the whole set into context · the rules on this page (reduced motion · passive · budget) still outrank their advice

## 6 · Thai fonts for large headings

| Font | Licence | Suited to | Note |
|---|---|---|---|
| IBM Plex Sans Thai | OFL 1.1 | Body text + chapter headings (the reference site uses it) | Latin is Plex Sans · loopless (the looped one is named IBM Plex Sans Thai Looped · checked 2026-10-23) easy to read at small size |
| Anuphan | OFL 1.1 | Large loopless headings, modern | Adapted from Plex Thai in a loopless style · negative ls allowed |
| Bai Jamjuree | OFL 1.1 | Large angular headings | The maker states "suited to headings" |
| Kanit | OFL 1.1 | Large bold headings | Cut terminals, narrow ls allowed · many weights |
| Noto Sans Thai | OFL 1.1 | Safe fallback for every job | Pairs with Noto Sans Latin |
| LINE Seed Sans TH | OFL 1.1 (github.com/line/seed) | Large round friendly headings | On Google Fonts (`ยังไม่ได้ตรวจ` not yet checked) |
| Sarabun | OFL | Official-document body text | Not a large-heading font |
| Chakra Petch | (`ยังไม่ได้ตรวจ` not yet checked) | Technology headings — `html-slide-deck` uses it | Check the licence before self-hosting |

**Pairing with Latin:** looped Thai pairs with Latin serif · loopless Thai pairs with Latin sans is a starting convention, not a hard rule. Several looped Thai fonts go with sans, but a serif paired with loopless Thai often looks odd · sets already designed as pairs: Trirong · Taviraj (looped Thai + serif · OFL) · IBM Plex Sans Thai (loopless + sans) · sources: Anuthin Wongsunkakon on the Linotype Neue Frutiger Thai page at myfonts.com · Smich Smanloh "Thai Type Pairing" ATypI 2020 · the Trirong and Taviraj descriptions in google/fonts · Wikipedia IBM Plex (all checked 2026-10-23)

Download everything as woff2 and self-host (rule 15) · do not `<link>` Google Fonts in the delivered files

## 7 · Check before sending

- [ ] Keyboard complete: ↓ PgDn Space · ↑ PgUp · Home End change chapters · Tab walks the rail and shows the focus ring · focus moves with the chapter
- [ ] Turn on reduced-motion (DevTools → Rendering → Emulate prefers-reduced-motion) and see **all content in every chapter**, numbers at final values, no faded words
- [ ] No fade-up repeated everywhere — go through `data-enter` of every chapter, none the same twice in a row
- [ ] Lighthouse Best Practices does not warn about passive listeners · `wheel`/`touch` with `passive:false` exist only in deck-mode and are removed on leaving the mode
- [ ] Fonts self-hosted · preload 2 weights · unplug the network and text is still the intended font
- [ ] Cut WebGL (DevTools → Rendering → Disable WebGL or `body.no-webgl`) and the 2D fallback appears and is readable
- [ ] 1 hard trackpad swipe = change 1 chapter · a list inside a chapter scrolls to the end first, then the chapter changes
- [ ] No hardcoded colours outside the token block (`web-app-design` → `scripts/check-design-tokens.mjs`)
- [ ] Take screenshots at 1440 · 900 · 420 of every chapter (`web-app-design` → `scripts/screenshot.py`) and actually look at them · rail below 900px is a bottom bar and does not cover content
- [ ] Go through the a11y and motion list of vercel-labs/web-interface-guidelines (local copy, do not fetch at run time) for focus · motion · touch target · contrast on every chapter — use it as a check list, do not copy the text (MIT · checked 2026-10-23)

## 8 · Anti-patterns

- **fade + slide-up on every piece** — an AI signal (`no-ai-look` catalog item fade-up) · fix with 4 entrances (rule 2)
- **Blur left on text** after the entrance ends — needs `clearProps`
- **A long `busy` lock** that freezes a slow device — release it on its own at 2.4 seconds
- **Trackpad inertia skipping 2 chapters** — drop delta < 6 and anything within 1 second after a chapter change
- **Losing the chapter while reading a list** because the wheel also changes chapters — the list scrolls first (rule 9)
- **An error toast that disappears by itself** — attach the message to the faulty spot with a retry button
- **A 3D label over text** · a map showing up behind another chapter's heading — use an occluder and hide per chapter
- **`pushState` on every chapter** — the Back button needs 5 presses to leave · use `replaceState`
- **Meaningless floating particles · endlessly looping glow · gradient fills on buttons** — all of `no-ai-look`
- **Delivering without ever opening reduced-motion and without ever cutting WebGL**

## 9 · Connecting to other skills

| Need | Use |
|---|---|
| Colour tokens · forms · tables for page-mode pages (registration · admin) | `web-app-design` → `references/tokens.md` |
| Motion budget of ordinary components (hover · modal ≤ 350 ms) | `ui-craft` item 7 |
| The 12 motion principles · easing · timing of on-screen text | `motion-basics` (plugin `graphic-design`) |
| Go through AI signals before sending (fade-up on every piece · glow · giant numbers) | `no-ai-look` (plugin `superuser`) |
| Presentation slides instead of a website · click-to-change shell · speaker notes | `html-slide-deck` |
| Storyline · headings as conclusions · text budget per chapter | `presentation-design` |
| Wording on the page | `human-writing` |
| SEO check of a page rendered with JS | `seo-audit-checklist` |

## Not looking AI-made

Before sending, go through item 3 of `no-ai-look` — for HTML work run its script · every job must also pass the eye gate 3.2 (web pages also answer items 10–14) because a script result of 0 items is not yet a pass · the prohibitions in this file are the parts specific to this job, and the full list for every medium is there

## Sources (checked 2026-10-22)

| Topic | Source |
|---|---|
| Structure · recipes · rules · anti-patterns | The website ai4ba.ai-cie.com (index.html · css/styles.css · js/app.js · js/fx.js · js/neural.js · js/net3d.js) public code read · no licence stated · the vendor/ that the site uses was not downloaded (`ยังไม่ได้ตรวจ` not yet checked) |
| GSAP free | README gsap@3.15.0 on cdn.jsdelivr.net and gsap.com/pricing "Now Free!" — free including every plugin, commercial use allowed · free since 3.13.0 (npm 2025-04-30) · the full licence (Standard "No Charge" GSAP License · effective 2025-04-30 · last revised 2025-05-30) was read from the copy web.archive.org/web/20261017164627/https://gsap.com/standard-license because gsap.com returned a maintenance page for some pages · the text prohibits only "Prohibited Uses", meaning use in a no-code visual animation builder that competes with Webflow · the short explanation on the same page also says you may not charge end users, which contradicts the text and the pricing page, so the text governs · checked 2026-10-26 · npm gsap@3.15.0 states a license pointing to gsap.com/standard-license and has no LICENSE file in the package |
| GSAP CDN | cdnjs.com/libraries/gsap 3.15.0 (2026-04-13) · `gsap.min.js` · plugins in the same folder (`Observer.min.js` `ScrollTrigger.min.js` `SplitText.min.js` — checked 2026-10-26: all 4 files returned HTTP 200 at `cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/<name>.min.js` · api.cdnjs.com/libraries/gsap states version 3.15.0 and licence "Standard 'No Charge' GreenSock License") |
| CSS scroll-driven | developer.mozilla.org animation-timeline · drweb.de |
| View Transitions | web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available (2025-10-16) |
| `@starting-style` · scroll-snap | developer.mozilla.org/@starting-style · caniuse.com/css-snappoints |
| Lenis | github.com/darkroomengineering/lenis (MIT · 1.3.x) |
| Observer · SplitText | gsap.com/docs/v3/Plugins/Observer · Codrops "7 Must-Know GSAP Animation Tips" (2025-09-03) · Osmo masked text reveal |
| Accessibility | WCAG 2.3.3 w3.org/WAI/WCAG21/Understanding/animation-from-interactions · Heilmann 2019 (focus after scrolling) · developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners |
| Performance | web.dev/articles/animations-guide (transform/opacity · use will-change sparingly) · cost of blur and backdrop-filter: blog.openreplay.com · f22labs.com (community articles, not benchmarks) · effect of scroll-jacking on INP (`ยังไม่ได้ตรวจ` not yet checked) |
| Thai fonts | fontsource.org · fonts.google.com · github.com/line/seed |
| External skills referenced | github.com/greensock/gsap-skills (MIT · per a report compared 2026-10-22 · file content `ยังไม่ได้ตรวจ` not yet checked) · github.com/vercel-labs/web-interface-guidelines (MIT · checked 2026-10-23) |
