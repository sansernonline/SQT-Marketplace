# dynamic-website skill — source material (ai4ba.ai-cie.com + state of the art, checked 2026-10-22)

Source read: scratchpad/ai4ba-src/ (index.html, config.js, css/styles.css, js/fx.js, js/app.js, js/neural.js, js/net3d.js). vendor/ was not downloaded, so the GSAP build the site ships is (ยังไม่ได้ตรวจ). Quoted Thai comments are the author's own.

## 1. Architecture (app.js, neural.js, styles.css)

- No framework. One IIFE, hash router: `route()` on `hashchange` (app.js:1818-1857). `a in CH_ALIAS` → **deck-mode** (5 full-screen chapters) else **page-mode** (normal scrolling pages: me/register/pay/done/admin).
- Route change = `#view.out` 180 ms fade (CSS :144-145, 0 ms when reduced) → `cleanup()` runs every fn in `cleanups[]` (app.js:235-236) → `scrollTo(0,0)` → render view → title.
- Every view pushes its teardown into `cleanups[]`: Observer.kill, remove wheel/keydown listeners, clearInterval, checkmark rAF cancel, `body.deck-mode` removal (app.js:708-761, 1218).
- Background = one `<canvas id="world">` fixed at z-index 0 behind `main` (z 1); CSS controls its opacity per mode: deck 1, page-mode .22, hidden otherwise (:464-468). Comment at :652: `/* scrim ให้ตัวหนังสืออ่านง่ายเหนือเครือข่าย */` → `.deck::before` gradient scrim.
- three.js is an ES module loaded in parallel; app waits for `neural:ready` or 4 s, then `Neural.supported` (WebGL probe, neural.js:920) → else `body.no-webgl` + `mountFallbackNet()` = Net3D 2D-canvas network (app.js:268-282, 764-769).
- Camera is a plain object `rig {tx,ty,tz,yaw,pitch,dist,glow,spin,page}` that GSAP tweens; `chapter(name)` = one `gsap.to(rig, …power2.inOut, overwrite:'auto')` per chapter (neural.js:59-61, 379-396). Header comment: `กล้องเคลื่อนด้วย GSAP (window.gsap) ตามหลัก motion ของ HyperFrames`.
- Chapters are stacked `position:absolute; visibility:hidden` sections; only `.on` is visible and gets `pointer-events:auto` on its columns (:484-488). `goChapter(j)` builds ONE timeline: exit cur → at T(.32) hide cur → camera fly → at T(.62) show next + enter. Comment :503: `// เนื้อหาบทใหม่เข้าเมื่อกล้องบินไปได้ราว 40% (overlap)`.
- `deck.busy` lock auto-releases after 2400 ms: `// เครื่องช้า: ไม่ล็อกนานเกิน` (:491). Hash is `history.replaceState`, not pushState, so chapters don't pollute Back.
- DOM labels over 3D are hidden behind text via `setOccluders(rects)` polled every 700 ms (:517-519, 760).
- Each chapter declares its entrance in markup: `data-enter="decodeWords|inkWords|blurLine|blurWords"`, title `data-t`, followers `data-f`, wipe `data-w`.

```
hashchange ─► route()
   │ #view.out 180ms → cleanup() ← cleanups[] (observer, wheel, keys, timers)
   ├─ a ∈ CH_ALIAS ─► viewHub() ─► body.deck-mode ─► goChapter(j): [exit cur]→hide→[world.chapter(id) fly]→show→[enter next]
   │                                     │                 rail · keys · wheel · Observer(touch) · replaceState
   └─ else ─────────► viewX()  ─► body.page-mode ─► FX.observe() IntersectionObserver reveals · world.chapter('page') @ .22
getWorld(): wait neural:ready|4s ─► Neural.supported? ─ yes: three.js rig tweened by GSAP ─ no: body.no-webgl + Net3D 2D canvas
```

## 2. Recipe table (code in blocks below; T()/D() = 0 when reduced)

| Recipe | Purpose | Use / don't | Reduced-motion | Source |
|---|---|---|---|---|
| decodeWords | English title "AI generating" | Latin headings only (pool is A-Z0-9); not Thai (combining marks break) | `FX.decode` prints final text at once | app.js:306, fx.js:6-20 |
| blurWords | default word entrance | Thai/Latin headings ≤ ~12 words | durations 0, blur cleared | app.js:307 |
| inkWords | words "ink in" from .14 opacity | long closing sentence; keeps layout readable from frame 0 | same | app.js:308 |
| blurLine | whole block blur-in, stagger 0.08 | followers (`data-f`), paragraphs, forms | same | app.js:309, 315 |
| wipe | clip-path inset bottom→top | one image/figure per chapter (`data-w`) | same | app.js:310 |
| exit | short, accelerating out | always paired with any entrance | 0 | app.js:321-324 |
| iris | accent circle grows from a point, swap route behind it | route change triggered by a click on a thing (node, card); not on every nav | skipped, hash set directly | app.js:805-812, 875-884, css:563 |
| count-up | number eases to value | stats on reveal | prints final | fx.js:41-50 |
| scroll reveal | CSS `[data-reveal]` + `.lines .ln` + IO | page-mode content | CSS kill-switch | css:148-162, fx.js:22-39 |
| scrubWords | words light up with scroll position | one long sentence per page; not body copy | all `.on` at once | fx.js:52-65 |
| checkmark particles | dots gather into ✓ then line draws, ring ripple | success page only | particles start at target (d=-5000), loop stops at 2.4 s | fx.js:67-135 |
| wheel→chapter + inner-scroll lock | wheel steps chapters; scrollable list scrolls first, needs a pause at edge | deck-mode only | n/a (T=0 makes it instant) | app.js:724-748 |
| swipe (Observer) | touch only, `tolerance:24`, ignores scrollables | mobile deck | same | app.js:714-723 |
| keyboard map | ↓ PgDn Space / ↑ PgUp / Home End / ←→ inside chapter | always | same | app.js:749-759 |
| rail | fixed right list 01–05 + arrows, `aria-current="step"`, bottom bar <900px | 3–7 chapters | CSS only | css:551-561, 567-575 |

```js
// ENTER — app.js:303-311  «ทางเข้า 4 แบบ (ห้ามใช้ fade+slide-up ซ้ำทุกจุด)»
const T = s => (reduced() ? 0 : s);                      // every duration/delay goes through T()
const ENTER = {
  decodeWords: (els, at, tl) => els.forEach(el => { splitWords(el); $$('.wd', el).forEach((w, k) => {
    tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: T(.2), ease: 'none' }, at + T(k * .16));
    tl.call(() => FX.decode(w, { duration: 900 }), null, at + T(k * .16)); }); }),
  blurWords: (els, at, tl) => els.forEach(el => { splitWords(el);
    tl.fromTo($$('.wd', el), { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: T(.55), stagger: T(.075), ease: 'expo.out' }, at); }),
  inkWords:  (els, at, tl) => els.forEach(el => { splitWords(el);
    tl.fromTo($$('.wd', el), { opacity: .14 }, { opacity: 1, duration: T(.5), stagger: T(.09), ease: 'power2.out' }, at); }),
  blurLine:  (els, at, tl) => tl.fromTo(els, { opacity: 0, filter: 'blur(10px)' }, { opacity: 1, filter: 'blur(0px)', duration: T(.6), stagger: T(.08), ease: 'expo.out' }, at),
  wipe:      (els, at, tl) => tl.fromTo(els, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)', duration: T(1.1), ease: 'expo.out' }, at)
};
// after enter: «ล้าง filter หลังเข้าเสร็จ — ตัวหนังสือจะคมเต็มที่ ไม่ค้างเบลอ»
tl.set($$('.wd, [data-f], [data-w]', sec), { clearProps: 'filter' }, at + T(1.8));
// exit: «ขาออกสั้นกว่า และเร่งออก (power3.in)»
tl.to($$('.wd, [data-f], [data-w]', sec), { opacity: 0, filter: 'blur(8px)', duration: T(.22), stagger: T(.012), ease: 'power3.in', overwrite: 'auto' }, 0);
```
```js
// goChapter skeleton — app.js:488-515
const tl = gsap.timeline({ onComplete: () => { deck.busy = false; } });
exitChapter(cur, tl);  tl.add(() => { cur.classList.remove('on'); cur.setAttribute('aria-hidden', 'true'); }, T(.32));
world && world.chapter(id);                                   // camera fly in parallel
const at = T(.62);  tl.add(() => { nxt.classList.add('on'); nxt.removeAttribute('aria-hidden'); }, at);  enterChapter(nxt, tl, at);
history.replaceState(null, '', '#/' + id);  document.body.dataset.ch = id;
```
```js
// iris — app.js:875-884 · .iris{position:fixed;inset:0;z-index:70;background:var(--accent);pointer-events:none}
const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20;
gsap.timeline().fromTo(o, { clipPath: `circle(6px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: .62, ease: 'power3.in' })
  .add(mid).to(o, { opacity: 0, duration: .55, delay: .25, onComplete: () => o.remove() });
```
```js
// wheel: inner list first, then two-beat edge — app.js:727-746  «สุดรายการ: ครั้งแรกแค่บอกใบ้ ครั้งถัดไป (หลังหยุดเลื่อน) จึงเปลี่ยนบท»
const sc = e.target.closest('.scrollable'), over = sc && sc.scrollHeight > sc.clientHeight + 4;
if (sc && over) { const atEdge = dy > 0 ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 : sc.scrollTop <= 1;
  if (!atEdge) { deck.innerAt = now; deck.edgeArm = 0; return; }                     // let it scroll
  if (now - deck.innerAt < 700 || sinceWheel < 220) { e.preventDefault(); if (!deck.edgeArm) { deck.edgeArm = now; edgeHint(sc, dy); } return; }
  deck.edgeArm = 0; }
e.preventDefault();   // «momentum ของ trackpad: เลื่อนต่อเนื่องหลังเปลี่ยนบทแล้วจะไม่นับ»
if (Math.abs(dy) < 6 || now - deck.last < 1000 || (sinceWheel < 160 && now - deck.last < 2200)) return;
step(dy > 0 ? 1 : -1);          // addEventListener('wheel', onWheel, { passive: false })
// touch: Observer.create({ target: window, type: 'touch', tolerance: 24, preventDefault: true, ignore: '.scroll-active, .listbox, textarea, .modal', onUp: () => step(1), onDown: () => step(-1) })
```
```css
/* scroll reveal + kill-switch — styles.css:148-162 */
[data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease),transform 1.1s var(--ease);transition-delay:var(--d,0ms)} [data-reveal].in{opacity:1;transform:none}
.lines .ln{display:block;overflow:hidden} .lines .ln>span{display:inline-block;transform:translateY(115%);transition:transform 1.15s var(--ease)} .lines.in .ln>span{transform:none}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important;transition-delay:0ms!important}
  html{scroll-behavior:auto} [data-reveal],.lines .ln>span{opacity:1;transform:none} .words .w{opacity:1}}
```
Count-up: `e = 1 - (1-t)^4`, 1400 ms, `toLocaleString('th-TH')` (fx.js:41-50). Decode: per-char reveal time `(i/len)*dur*.7 + rand*dur*.3`, pool `A-Z0-9×=#%&/<>` (fx.js:10-19). scrubWords: `p = clamp((vh*.85 - r.top)/(r.height + vh*.35))`, passive scroll listener, returns remover (fx.js:53-65).

## 3. Tokens and type scale (styles.css:13-35, :169, :492-543, :505-508, :75-77)

| Token | Value | Type role | Value |
|---|---|---|---|
| --bg / --surface | #F7F6F2 / #FFF | body | 400 16px/1.6 "Plex Thai", system-ui |
| --ink / --ink-2 / --muted | #0F0F0E / #3A3934 / #6B6A63 | hero display | clamp(52px, 8.4vw, 132px) · lh 1.04 · ls -.035em · 700 |
| --line / --line-2 | #E4E1D8 / #CFCBBF | deck hero-h | clamp(42px, 5.7vw, 94px) · lh 1.02 · ls -.04em |
| --accent / --accent-ink / --accent-soft | #E8590C / #B54708 / #FDF0E6 | chapter kicker (h2) | clamp(40px, 5.2vw, 76px) · lh 1.05 · ls -.035em |
| --ok --warn --bad (+ -soft) | #1D7A4B · #8A5A00 · #B42318 | closing sentence | clamp(34px, 4.2vw, 66px) · lh 1.16 · ls -.03em · 600 · max-width 12.5em |
| --ease | cubic-bezier(.16,1,.3,1) (expo-out feel) | page h2 | clamp(40px, 6vw, 84px) · .n number .42em muted |
| --ease-io | cubic-bezier(.65,0,.35,1) | lead / hero-sub | 18px / clamp(17px,1.6vw,20px) · max-width 34–36em |
| --r / --pad / --max / --top | 8px / 24px→16px / 1200px / 64px→56px | big ghost number (ag-big) | clamp(100px,9vw,170px) · text-stroke 1.5px 13% ink |
| fonts | IBM Plex Sans Thai woff2 self-hosted, `unicode-range` split Thai/Latin, preload 400+700 | small/eyebrow | 12–13px · ls .04–.28em · tabular-nums |

## 4. Decision table

| Need | GSAP 3 (+Observer/ScrollTrigger/SplitText) | CSS scroll-driven (`animation-timeline: view()/scroll()`) | View Transitions (same-document) |
|---|---|---|---|
| Status 2026-10 | 3.15.0 on cdnjs; free incl. all plugins | MDN: "Limited availability" — Chrome/Edge 115+, Safari 26+, Firefox behind flag (Interop 2026) | Baseline Newly available since Firefox 144 (web.dev 2025-10-16); Chrome 111, Safari 18 |
| Pick when | chapters, timelines with overlap, camera/3D rig, swipe/wheel capture, char/word splits | progress bars, parallax, reveal-on-scroll in normal pages; must still look fine without it | route/state swaps where old and new DOM both exist (list→detail, theme, chapter swap without 3D) |
| Don't | simple reveals that CSS+IO already do | anything that must work in Firefox today without fallback; scroll-jacking (it can't) | continuous scroll effects; 3D camera |
| Reduced motion | wrap durations in `T()`; `gsap.matchMedia()` | `@media (prefers-reduced-motion)` kill-switch | `@media (prefers-reduced-motion){::view-transition-group(*){animation:none}}` |
| Also | `@starting-style` (Baseline 2024-08) for entry transitions from display:none; scroll-snap 97% support for chapter sites without JS; Lenis 1.3.x MIT, `respectReducedMotion:true` default, drive from `gsap.ticker` (one rAF loop) | | |

## 5. Rules for the skill

1. Every duration/delay goes through one gate (`T(s)=reduced?0:s`) in JS and one CSS kill-switch block; never check reduced-motion inside each animation — app.js:238, neural.js:14, css:157-162.
2. Four named entrances per site, chosen per chapter in markup (`data-enter`), never the same one twice in a row — app.js:303 «ห้ามใช้ fade+slide-up ซ้ำทุกจุด».
3. Exit is shorter than enter and eases in (power3.in, .22 s); enter overlaps the camera at ~40% — app.js:322, :503.
4. `clearProps:'filter'` after every blur entrance so text ends crisp and the compositor layer is released — app.js:318-319; blur is GPU-costly, keep ≤10px, short, and never animate `backdrop-filter` (openreplay/f22labs blogs, 2025, community heuristics).
5. Animate only transform/opacity/clip-path (+ brief filter); never width/height/top — web.dev animations-guide (checked 2026-10-22).
6. Chapters: `visibility:hidden` + `pointer-events:none` when off, `aria-hidden` toggled in the timeline, hash via replaceState — css:485-488, app.js:497-513.
7. Background must mean something (1 dot = 1 person; path = agenda; camera flies to the item you hover) — neural.js:1-8, app.js:703 «ชี้เมาส์ = กล้องบินไปดูตรงนั้นทันที».
8. Lazy-load the heavy renderer, time-box it (4 s), probe WebGL, and ship a 2D fallback plus `body.no-webgl` CSS — app.js:268-282, neural.js:920.
9. Scrollable regions inside a chapter scroll first; chapter changes only after a pause at the edge, with a hint — app.js:724-746.
10. Wheel/touch handlers are `passive:false` only in deck-mode and removed on route change; everything else (`scroll`, pointermove) is `{passive:true}` — app.js:747, 1858, fx.js:62; Lighthouse exempts preventDefault listeners but they still block scroll (developer.chrome.com uses-passive-event-listeners, checked 2026-10-22).
11. Keyboard map is mandatory: ↓/PgDn/Space, ↑/PgUp, Home/End, and ignore keys inside inputs/modals; rail buttons carry `aria-current="step"` — app.js:749-759, :509.
12. After a programmatic chapter/section move, move focus (site: `data-focus` → `#q.focus()` after T(1100), `main tabindex=-1`) — app.js:698, index.html:30; Heilmann 2019 "moving to a page section without shifting keyboard focus".
13. Reduced motion must still show all content (WCAG 2.3.3 AAA, w3.org understanding doc, checked 2026-10-22); the site's reduced path prints final text, all words `.on`, particles at target.
14. Cap `devicePixelRatio` at 2 (1.75 on <900px), clamp `dt` to 50 ms, `setAnimationLoop` only while deck/page needs it — neural.js:51, :798, fx.js:70,142, net3d.js:93.
15. Self-host fonts, split Thai/Latin with `unicode-range`, preload only the two weights above the fold, `font-display:swap` — css:4-11, index.html:13-14.

## 6. Anti-patterns (what the site deliberately avoids)

1. Same fade+slide-up on every element (app.js:303).
2. Blur left on text after the entrance (:318).
3. Long `busy` locks that freeze slow machines (:491 caps at 2400 ms).
4. Trackpad momentum skipping two chapters (:743-744 ignores deltas <6 and within 1 s).
5. Leaving a list mid-scroll because the wheel also changes chapters (:733 «ไม่ให้หลุดบทตอนกำลังอ่าน»).
6. Toast errors that vanish; use an inline message with retry (:346).
7. 3D labels drawn over text (occluders :517-519); map shown behind other chapters' headings (neural.js:386).
8. pushState per chapter (fills Back history); the site uses replaceState (:513).

## 7. Licences / sources

| Item | Finding | Source · date |
|---|---|---|
| GSAP 3 | "100% FREE including ALL of the bonus plugins (SplitText, MorphSVG…)" thanks to Webflow; free for commercial use; no licence key | README mirror cdn.jsdelivr.net/npm/gsap@3.15.0/README.md · gsap.com/pricing "Now Free!" · 2026-10-22 |
| GSAP free since | 3.13.0 published 2025-04-30 (npm date); exact licence name and any Webflow-competitor clause | (ยังไม่ได้ตรวจ — pricing page fetched, Terms-of-Use page not read) |
| GSAP CDN | 3.15.0 (2026-04-13): `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js`; plugins in same folder (ScrollTrigger.min.js, Observer.min.js, SplitText.min.js — paths not confirmed on cdnjs listing) | cdnjs.com/libraries/gsap · 2026-10-22 |
| CSS scroll-driven animations | MDN "Limited availability"; Chrome/Edge 115+, Safari 26+, Firefox flag, Interop 2026 | developer.mozilla.org animation-timeline · drweb.de · 2026-10-22 |
| View Transitions same-document | Baseline Newly available; Firefox 144, Chrome 111, Safari 18 | web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available · 2025-10-16 |
| @starting-style | Baseline 2024 (Aug 2024) | developer.mozilla.org/@starting-style · 2026-10-22 |
| scroll-snap | 97.45% global; Chrome 69, Safari 11, Firefox 68 | caniuse.com/css-snappoints · 2026-10-22 |
| Lenis | MIT, ~1.3.27, "a few KB", keeps native scroll, `respectReducedMotion:true`, drive via `gsap.ticker.add(t => lenis.raf(t*1000))` + `lagSmoothing(0)` | github.com/darkroomengineering/lenis · 2026-10-22 |
| Tutorials | Codrops "7 Must-Know GSAP Animation Tips" (SplitText `mask` v3.13+) tympanus.net/codrops/2025/09/03/…; Codrops+Osmo "From SplitText to MorphSVG: 5 demos" tympanus.net/codrops/?p=93244; Osmo masked text reveal osmo.supply/resource/masked-text-reveal; Observer docs gsap.com/docs/v3/Plugins/Observer | 2026-10-22 |
| Accessibility | WCAG 2.3.3 (AAA) w3.org/WAI/WCAG21/Understanding/animation-from-interactions; Heilmann focus after scroll christianheilmann.com/2019/04/09/…; Lighthouse passive listeners developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners | 2026-10-22 |
| Performance | web.dev/articles/animations-guide (transform/opacity, will-change sparingly); blur/backdrop-filter cost: blog.openreplay.com, f22labs.com (community, not benchmarks); INP impact of scroll-jacking | (ยังไม่ได้ตรวจ — no authoritative source found) |
| Thai fonts | IBM Plex Sans Thai (site, OFL); Anuphan OFL-1.1, loopless Plex-Thai derivative, Latin = Plex Sans → tight tracking OK; Bai Jamjuree OFL-1.1, square sans "suited to headings"; Kanit OFL-1.1, flat terminals "allow tighter letter spacing"; Noto Sans Thai OFL-1.1; Sarabun (TH Sarabun New) OFL — body, not display; LINE Seed Sans TH OFL-1.1 (github.com/line/seed), Google Fonts availability | fontsource.org, fonts.google.com, github.com/line/seed · 2026-10-22; LINE Seed TH on Google Fonts (ยังไม่ได้ตรวจ) |

## 8. Where it would fit in our plugins (ยังไม่ทำ)
- New skill `dynamic-website` in software-company (sibling of web-app-design, html-slide-deck): sections 1–6 above become SKILL.md + references/recipes.md + references/decision-table.md; 2 example files (deck-mode + page-mode) in assets/.
- motion-basics gets rule 7 ("background must mean something") as its worked example; ui-craft §7 links to the T() gate pattern; web-app-design/tokens.md gains --ease / --ease-io.
- no-ai-look catalog:70 (fade-up everywhere) points to the 4-entrance rule as the fix.
- Not from this site: nothing about copy. Thai text on the site follows the human-writing rules already.
