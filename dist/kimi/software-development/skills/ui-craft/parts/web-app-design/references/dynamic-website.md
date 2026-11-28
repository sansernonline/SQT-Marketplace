<!-- merged from skill `dynamic-website` on 2026-11-27 · description was: Use when a marketing website needs scroll motion or 3D -->
# Dynamic Website — a chapter-by-chapter storytelling site that moves without making readers dizzy

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" (Pre-work gate) of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the job with the line `ด่านก่อนลงมือ:` (Pre-work gate:)

> **One rule:** every motion passes through one gate (`T()` in JS + a kill-switch in CSS) and **each chapter has its own entrance** — fade-up repeated everywhere is the number 1 AI signal of this kind of website.

## Use when
- Marketing sites · seminar pages · product launch pages · "About us" pages read chapter by chapter
- One page with 3–7 full-screen chapters changed by wheel, keyboard or swipe (deck-mode), or a normal scrolling page where content appears on scroll (page-mode)
- A "meaningful" background (a network of people · a schedule route · a map) with a camera that moves per chapter

Not for: dashboard · admin · internal tool · SaaS → this part's [`guide.md`](../guide.md) with `ui-craft` (motion ≤ 350 ms) · presentation slides with speaker notes → `slide-deck` · no storyline yet → `slide-deck` → `references/presentation-design.md` steps 1–3 first · animated clip or moving logo → `video-editing` (plugin `graphic-design`)

## Steps
1. Run the pre-work gate above. Colour comes from the work: use the brand colour if there is one; otherwise search live per `design-gate/design-references` (type `web` or `motion`) and extract colours from the chosen work. If live search is impossible, use `#2A78D6` (text on light: `#226CC6`), write `(รอยืนยัน)` and carry on.
2. Pick the mode per part of the site: deck-mode (chapters stacked `position:absolute; visibility:hidden`, only `.on` visible) for story chapters, page-mode (normal scroll, reveal item 8 of `recipes.md`) for registration, payment, admin. One `route()` on `hashchange`; every view pushes its teardown into `cleanups[]`, and `route()` clears them before rendering the next view.
3. Declare the entrance in markup: `<section class="ch" data-enter="blurWords">` · heading `data-t` · followers `data-f` · image `data-w`. Content lives in HTML, not JS.
4. Copy recipes from `recipes.md`; a working example is `assets/example-deck.html`. Use token names that match `ui-craft` part `web-app-design` → `tokens.md`; type scale and fonts are in `tokens-and-fonts.md`.
5. Load three.js as a module in parallel; wait for `neural:ready` or 4 seconds; probe WebGL. If it fails, set `body.no-webgl` and show a 2D canvas fallback with the same meaning. Run `setAnimationLoop` only while the screen needs it.
6. Apply the 15 rules below. Self-host fonts and GSAP (`vendor/`) for real delivery; cdnjs is fine for a mockup.
7. Run the checks below, then go through item 3 of `design-gate/no-ai-look` (for HTML run its script; a script result of 0 items is not yet a pass, so also pass eye gate 3.2 and items 10–14).

## 15 rules
1. **One gate** — every duration · delay · stagger goes through `T(s) = reduced ? 0 : s` in JS and one kill-switch block in CSS · do not check reduced-motion per animation.
2. **4 entrances per site**, chosen per chapter in the markup, never the same one in 2 chapters in a row.
3. **Exit shorter than entrance, and accelerating** (`power3.in` 0.22 s) · the new chapter enters when the camera has flown about 40%.
4. **Clear the filter after the entrance** (`clearProps:'filter'`) · blur ≤ 10px and brief · never animate `backdrop-filter`.
5. **Animate only transform · opacity · clip-path** (+ filter briefly) · never width height top.
6. Hidden chapters get `visibility:hidden` + `pointer-events:none` · toggle `aria-hidden` in the timeline · hash with `replaceState`, never `pushState` per chapter (Back would need 5 presses).
7. **The background must mean something** — 1 dot = 1 person · line = schedule · pointer = camera flies there · no floating particles for fun, no endless glow, no gradient button fills.
8. **Heavy renderer loads later**: 4-second wait, WebGL probe, 2D fallback, CSS for `body.no-webgl`.
9. **A list inside a chapter scrolls first**: at the edge give a hint, stop, and only then change chapter.
10. **`passive:false` only for wheel/touch in deck-mode**, removed when the route changes · `scroll` and `pointermove` are always `{passive:true}`.
11. **Keyboard map is mandatory**: ↓ PgDn Space · ↑ PgUp · Home End · skip inside an input or modal · rail buttons have `aria-current="step"`.
12. **Move focus after changing chapter** (`section tabindex="-1"` then `.focus()`).
13. **Reduced motion must show all content** (WCAG 2.3.3) — real text at once, every word `.on`, particles at their destination.
14. **Limit GPU load** — `devicePixelRatio` ≤ 2 (1.75 under 900px) · clamp `dt` to 50 ms · loop only while needed.
15. **Self-host fonts** as woff2, split Thai/Latin with `unicode-range` · preload only 2 weights above the fold · `font-display:swap` · no Google Fonts `<link>` in delivered files.

Also: trackpad inertia must not skip 2 chapters (drop delta < 6 and anything within 1 s after a change) · release a `busy` lock by itself at 2.4 s · error toasts attach to the faulty spot with a retry button, never vanish alone · hide 3D labels with an occluder per chapter · large Thai headings with negative `letter-spacing` need a check at every weight (tone marks vs vowels: back off to -.01em; `uppercase` + wide ls is for Latin eyebrows only) · the 3D background sits at z-index 0 under `main` (z 1), deck opacity 1, page-mode .22, with a scrim `.deck::before`.

## Check before done
- Keyboard complete: change chapters with the map above · Tab walks the rail with a focus ring · focus moves with the chapter
- Emulate prefers-reduced-motion (DevTools → Rendering): all content visible in every chapter, numbers at final values, no faded words
- `data-enter` of every chapter checked: none the same twice in a row
- Lighthouse shows no passive-listener warning; `passive:false` exists only in deck-mode and is removed on leaving it
- Fonts self-hosted, 2 weights preloaded; with network unplugged the intended font still shows
- WebGL disabled (or `body.no-webgl`): the 2D fallback appears and is readable
- 1 hard trackpad swipe = 1 chapter · an inner list scrolls to the end first
- No hardcoded colours outside the token block (`scripts/check-design-tokens.mjs` of this part)
- Screenshots at 1440 · 900 · 420 of every chapter (`<ui-craft>/scripts/screenshot.py`), actually looked at · the rail below 900px is a bottom bar and covers no content
- Go through the a11y and motion list of vercel-labs/web-interface-guidelines (local copy, do not fetch at run time; MIT · checked 2026-10-23) as a check list for focus · motion · touch target · contrast; do not copy its text

## References
- [`recipes.md`](recipes.md) — copy-ready code for every recipe
- [`structure-and-recipes.md`](structure-and-recipes.md) — open when building the skeleton or choosing a recipe (use / do not use, reduced-motion behaviour of each)
- [`tokens-and-fonts.md`](tokens-and-fonts.md) — open when setting tokens, type scale or a Thai font
- [`tools.md`](tools.md) — open when choosing GSAP vs CSS scroll-driven vs View Transitions vs scroll-snap, or when you need deeper GSAP API (then read only the plugin file you use from github.com/greensock/gsap-skills; this page's rules still outrank it)
- [`sources.md`](sources.md) — sources and check dates
- Other skills: colour tokens/forms for page-mode → `ui-craft` part `web-app-design` · motion principles and easing → `video-editing` · storyline and text budget → `slide-deck` · SEO of JS-rendered pages → `web-audit`
