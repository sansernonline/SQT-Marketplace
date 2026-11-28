# Recipes — copy-ready code for dynamic-website

> Every block is ≤ 15 lines · rewritten in our own form, following the ideas of the reference site ai4ba.ai-cie.com (public code read 2026-10-22 · no licence stated, so the code is not copied directly) · sentences in «…» quotes are comments by that site's author, translated from Thai
> Requires: `gsap` 3.15 (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js`) · `Observer.min.js` in the same folder (item 11 only) · the shorthands `$ = (s, r = document) => r.querySelector(s)` and `$$ = (s, r = document) => [...r.querySelectorAll(s)]`
> A fully assembled example: `assets/example-deck.html`

## Contents

1. [T gate and CSS kill-switch](#1-t-gate-and-css-kill-switch)
2. [splitWords](#2-splitwords)
3. [4 entrances and the exit](#3-4-entrances-and-the-exit)
4. [goChapter timeline skeleton](#4-gochapter-timeline-skeleton)
5. [iris page transition](#5-iris-page-transition)
6. [count-up](#6-count-up)
7. [decode](#7-decode)
8. [scroll reveal and lines](#8-scroll-reveal-and-lines)
9. [scrubWords](#9-scrubwords)
10. [wheel changes chapters, and locks inner scrolling lists](#10-wheel-changes-chapters-and-locks-inner-scrolling-lists)
11. [Observer touch swipe](#11-observer-touch-swipe)
12. [keyboard map](#12-keyboard-map)
13. [rail markup and CSS](#13-rail-markup-and-css)

---

## 1 T gate and CSS kill-switch

**When to use:** every file with motion — one gate in JS and one block in CSS, so each animation does not re-check reduced-motion · source app.js:238 · fx.js (reduced) · styles.css:157-162

```js
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const T = s => (reduced() ? 0 : s);          // every duration · delay · stagger goes through T()
// usage: tl.to(el, { opacity: 1, duration: T(.5), stagger: T(.08) })
// if you use gsap.matchMedia(): mm.add('(prefers-reduced-motion: no-preference)', () => { /* the moving parts */ });
```
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; transition-delay: 0ms !important; }
  html { scroll-behavior: auto; }
  [data-reveal], .lines .ln > span { opacity: 1; transform: none; }   /* all content must stay visible (WCAG 2.3.3) */
  .words .w { opacity: 1; }
}
```

## 2 splitWords

**When to use:** before the word-by-word entrances (item 3) · Thai has no spaces between words, so it splits at the spaces the author left in = put the spaces at the rhythm you want the words to enter · source app.js:285-300

```js
function splitWords(el) {
  if (el.dataset.split) return;                  // split once; returning to the same chapter does not split again
  el.dataset.split = 1;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType !== 3) return walk(c);        // keep the <em> <br> inside
    const frag = document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(p => {
      if (!p) return;
      if (/^\s+$/.test(p)) return frag.append(p);
      const w = document.createElement('span'); w.className = 'wd'; w.textContent = p; frag.append(w);
    });
    c.replaceWith(frag);
  });
  walk(el);
}
```
CSS: `.wd { display: inline-block; will-change: opacity, filter; }` — `will-change` only while entering, then clear it with `clearProps` (item 3)

## 3 4 entrances and the exit

**When to use:** every chapter declares its entrance in the markup `data-enter="blurWords|inkWords|blurLine|decodeWords"` · headline `data-t` · follower `data-f` · image `data-w` · source app.js:303-324 «4 entrances (never reuse fade+slide-up everywhere)»

```js
const ENTER = {
  blurWords: (els, at, tl) => els.forEach(el => { splitWords(el);
    tl.fromTo($$('.wd', el), { opacity: 0, filter: 'blur(8px)' },
      { opacity: 1, filter: 'blur(0px)', duration: T(.55), stagger: T(.075), ease: 'expo.out' }, at); }),
  inkWords: (els, at, tl) => els.forEach(el => { splitWords(el);          // readable from the first frame
    tl.fromTo($$('.wd', el), { opacity: .14 }, { opacity: 1, duration: T(.5), stagger: T(.09), ease: 'power2.out' }, at); }),
  blurLine: (els, at, tl) => tl.fromTo(els, { opacity: 0, filter: 'blur(10px)' },
    { opacity: 1, filter: 'blur(0px)', duration: T(.6), stagger: T(.08), ease: 'expo.out' }, at),
  wipe: (els, at, tl) => tl.fromTo(els, { clipPath: 'inset(100% 0 0 0)' },
    { clipPath: 'inset(0 0 0 0)', duration: T(1.1), ease: 'expo.out' }, at),
  decodeWords: (els, at, tl) => els.forEach(el => { splitWords(el); $$('.wd', el).forEach((w, k) => {
    tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: T(.2), ease: 'none' }, at + T(k * .16));
    tl.call(() => decode(w, 900), null, at + T(k * .16)); }); }),     // item 7 · Latin letters only
};
```
```js
function enterChapter(sec, tl, at) {
  ENTER[sec.dataset.enter || 'blurWords']($$('[data-t]', sec), at, tl);
  ENTER.blurLine($$('[data-f]', sec), at + T(.25), tl);
  ENTER.wipe($$('[data-w]', sec), at + T(.1), tl);
  tl.set($$('.wd, [data-f], [data-w]', sec), { clearProps: 'filter,will-change' }, at + T(1.8));
}   // «clear the filter after the entrance finishes, so the text ends fully sharp and never stays blurred»
function exitChapter(sec, tl) {   // «the exit is shorter and speeds out (power3.in)»
  tl.to($$('.wd, [data-f], [data-w]', sec), { opacity: 0, filter: 'blur(8px)', duration: T(.22), stagger: T(.012), ease: 'power3.in', overwrite: 'auto' }, 0);
}
```

## 4 goChapter timeline skeleton

**When to use:** deck-mode — chapters stack with `position:absolute; visibility:hidden` and only `.on` is visible · one timeline per chapter change: exit → hide → (camera flies) → show + enter · source app.js:488-515 «the new chapter's content enters when the camera has flown about 40% of the way (overlap)»

```js
function goChapter(j) {
  j = Math.max(0, Math.min(CH.length - 1, j));
  if (deck.busy || j === deck.i) return;
  const cur = CH[deck.i], nxt = CH[j]; let at = 0;
  deck.busy = true; setTimeout(() => { deck.busy = false; }, 2400);     // «slow device: never lock for too long»
  const tl = gsap.timeline({ onComplete: () => { deck.busy = false; } });
  if (cur) { exitChapter(cur, tl); tl.add(() => { cur.classList.remove('on'); cur.setAttribute('aria-hidden', 'true'); }, T(.32)); at = T(.62); }
  world && world.chapter(nxt.id);                                        // the 3D camera flies in parallel (if there is one)
  tl.add(() => { nxt.classList.add('on'); nxt.removeAttribute('aria-hidden'); }, at);
  enterChapter(nxt, tl, at);
  deck.i = j; deck.last = performance.now();
  $$('.rail-i').forEach((b, k) => { b.classList.toggle('on', k === j); b.setAttribute('aria-current', k === j ? 'step' : 'false'); });
  history.replaceState(null, '', '#' + nxt.id); document.body.dataset.ch = nxt.id;   // do not use pushState
  nxt.focus({ preventScroll: true });                                    // move focus with the chapter (the section has tabindex="-1")
}
```
CSS: `.ch { position: absolute; inset: 0; visibility: hidden; pointer-events: none; } .ch.on { visibility: visible; pointer-events: auto; }`

## 5 iris page transition

**When to use:** changing route from a click on a "thing" on screen (a node in a network, a card) — a brand-colour circle grows from the click point, the page swaps behind the circle, then it fades out · not for every navigation · reduced → set the hash directly · source app.js:805-812, 875-884 · styles.css:563

```js
function iris(x, y, swap) {           // swap = the fn that changes the route when the circle covers the screen
  if (reduced()) return swap();
  const o = document.createElement('div'); o.className = 'iris'; document.body.append(o);
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20;
  gsap.timeline()
    .fromTo(o, { clipPath: `circle(6px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: .62, ease: 'power3.in' })
    .add(swap)
    .to(o, { opacity: 0, duration: .55, delay: .25, onComplete: () => o.remove() });
}
```
```css
.iris { position: fixed; inset: 0; z-index: 70; background: var(--accent); pointer-events: none; }
```

## 6 count-up

**When to use:** statistic numbers that have just scrolled into view (`[data-count="1200"]`) — use it only on numbers you want remembered, not on every card · reduced → print the final value at once · source fx.js:41-50

```js
function countUp(el) {
  const to = Number(el.dataset.count), fmt = n => Math.round(n).toLocaleString('th-TH');
  if (reduced()) { el.textContent = fmt(to); return; }
  const dur = 1400, s = performance.now();
  (function tick(now) {
    const t = Math.min(1, (now - s) / dur), e = 1 - Math.pow(1 - t, 4);   // ease-out quart
    el.textContent = fmt(to * e);
    if (t < 1) requestAnimationFrame(tick);
  })(s);
}
```

## 7 decode

**When to use:** Latin-letter headlines (the pool is A-Z 0-9) — never use it on Thai, because floating vowels and tone marks break apart · reduced → print the real text at once · source fx.js:6-20

```js
function decode(el, dur = 1100, pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789×=#%&/<>') {
  const final = el.dataset.text || (el.dataset.text = el.textContent);
  if (reduced()) { el.textContent = final; return; }
  const start = performance.now();
  const at = [...final].map((c, i) => (i / final.length) * dur * .7 + Math.random() * dur * .3);   // left settles before right
  (function tick(now) {
    const t = now - start;
    el.textContent = [...final].map((c, i) => c === ' ' || t >= at[i] ? c : pool[(Math.random() * pool.length) | 0]).join('');
    if (t < dur) requestAnimationFrame(tick); else el.textContent = final;
  })(start);
}
```

## 8 scroll reveal and lines

**When to use:** page-mode (a normally scrolling page) — CSS does the motion and JS only adds the class `.in` once with an IntersectionObserver · `.lines` = lines that appear from beneath a frame · reduced → the kill-switch in item 1 · source styles.css:148-162 · fx.js:22-39

```css
[data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity .9s var(--ease), transform 1.1s var(--ease); transition-delay: var(--d, 0ms); }
[data-reveal].in { opacity: 1; transform: none; }
.lines .ln { display: block; overflow: hidden; }
.lines .ln > span { display: inline-block; transform: translateY(115%); transition: transform 1.15s var(--ease); }
.lines.in .ln > span { transform: none; }
```
```js
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('in');
  if (el.matches('[data-count]')) countUp(el);
  if (el.matches('[data-decode]')) decode(el);
  io.unobserve(el);                                              // play once
}), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
const observe = (root = document) => $$('[data-reveal], .lines, [data-count], [data-decode]', root).forEach(el => io.observe(el));
```
Use `--d` to delay items one by one within a group (`style="--d:80ms"`), at most 4–5 items — from the 6th on, the user waits.

## 9 scrubWords

**When to use:** one long sentence per page (`.words > .w`) that lights up word by word with the scroll position — not for body text · passive listener · returns a remover function to put in `cleanups` · source fx.js:52-65

```js
function scrubWords(el) {
  const words = $$('.w', el);
  if (reduced()) { words.forEach(w => w.classList.add('on')); return () => {}; }
  const onScroll = () => {
    const r = el.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  return () => removeEventListener('scroll', onScroll);
}
```
CSS: `.words .w { opacity: .18; transition: opacity .35s; } .words .w.on { opacity: 1; }`

## 10 wheel changes chapters, and locks inner scrolling lists

**When to use:** deck-mode only — `passive:false`, and remove the listener when the route changes · a `.scrollable` list inside a chapter scrolls first. At the edge, the first wheel only gives a hint. Once scrolling stops, the next wheel changes the chapter · this stops trackpad momentum from skipping 2 chapters · source app.js:724-748 «end of the list: the first time only a hint, the next time (after scrolling stops) changes the chapter»

```js
function onWheel(e) {
  const now = performance.now(), dy = e.deltaY, sinceWheel = now - (deck.lastWheel || 0); deck.lastWheel = now;
  const sc = e.target.closest('.scrollable');
  if (sc && sc.scrollHeight > sc.clientHeight + 4) {
    const atEdge = dy > 0 ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 : sc.scrollTop <= 1;
    if (!atEdge) { deck.innerAt = now; deck.edgeArm = 0; return; }                       // let the list scroll
    if (now - deck.innerAt < 700 || sinceWheel < 220) { e.preventDefault(); if (!deck.edgeArm) { deck.edgeArm = now; edgeHint(sc, dy); } return; }
    deck.edgeArm = 0;
  }
  e.preventDefault();      // «trackpad momentum: continuous scrolling after a chapter change is not counted»
  if (Math.abs(dy) < 6 || now - deck.last < 1000 || (sinceWheel < 160 && now - deck.last < 2200)) return;
  goChapter(deck.i + (dy > 0 ? 1 : -1));
}
addEventListener('wheel', onWheel, { passive: false });
cleanups.push(() => removeEventListener('wheel', onWheel));
```
`edgeHint(sc, dy)` = a small message under the list, "ดูครบแล้ว · เลื่อนอีกครั้งเพื่อไปบทถัดไป" (all seen · scroll again to go to the next chapter). It appears after 0.3 seconds and disappears by itself within 1.4 seconds.

## 11 Observer touch swipe

**When to use:** mobile deck-mode — catches only `touch`, not wheel (item 10 handles that) · skips areas that scroll on their own · source app.js:714-723 · gsap.com/docs/v3/Plugins/Observer

```js
gsap.registerPlugin(Observer);
const ob = Observer.create({
  target: window, type: 'touch', tolerance: 24, preventDefault: true,
  ignore: '.scrollable, textarea, .modal',
  onUp: () => goChapter(deck.i + 1),      // swipe up = next chapter
  onDown: () => goChapter(deck.i - 1),
});
cleanups.push(() => ob.kill());
```

## 12 keyboard map

**When to use:** every chapter-style site — required · skip when focus is in an input field or modal · left and right arrows are reserved for things inside a chapter (such as stepping through days in a schedule) · source app.js:749-759

```js
function onKey(e) {
  if (e.target.closest('input, textarea, select, [contenteditable], .modal')) return;
  const k = e.key;
  if (['ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); deck.last = 0; goChapter(deck.i + 1); }
  else if (['ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); deck.last = 0; goChapter(deck.i - 1); }
  else if (k === 'Home') goChapter(0);
  else if (k === 'End') goChapter(CH.length - 1);
  // ArrowLeft / ArrowRight: things inside a chapter (days in a schedule · sub-slides), not chapter changes
}
addEventListener('keydown', onKey);
cleanups.push(() => removeEventListener('keydown', onKey));
```

## 13 rail markup and CSS

**When to use:** 3–7 chapters — a numbered list on the right of the screen, the chapter name appears on hover or focus · the current chapter has `aria-current="step"` · below 900px it becomes a bottom bar · source app.js:481-483, 509 · styles.css:551-575

```js
const rail = $('#rail');
rail.innerHTML = `<button class="rail-arrow" type="button" data-step="-1" aria-label="บทก่อนหน้า">↑</button>`
  + CH.map((c, i) => `<button type="button" class="rail-i" data-i="${i}" aria-current="false"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${c.dataset.label}</span></button>`).join('')
  + `<button class="rail-arrow" type="button" data-step="1" aria-label="บทถัดไป">↓</button>`;
rail.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  deck.last = 0; goChapter(b.dataset.i != null ? +b.dataset.i : deck.i + +b.dataset.step);
});
```
```css
.rail { position: fixed; z-index: 5; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.rail-i { display: flex; align-items: center; gap: 10px; background: none; border: 0; padding: 7px 0; cursor: pointer; color: var(--muted); font-size: 13px; }
.rail-i .n { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; position: relative; padding-right: 26px; }
.rail-i .n::after { content: ""; position: absolute; right: 0; top: 50%; width: 14px; height: 1px; background: var(--line-2); transition: width .45s var(--ease); }
.rail-i.on { color: var(--ink); }  .rail-i.on .n::after { width: 22px; height: 2px; background: var(--accent); }
.rail-i .t { opacity: 0; transform: translateX(8px); transition: opacity .3s var(--ease), transform .45s var(--ease); white-space: nowrap; }
.rail-i.on .t, .rail:hover .rail-i .t, .rail-i:focus-visible .t { opacity: 1; transform: none; }
.rail-arrow { background: none; border: 1px solid var(--line-2); border-radius: 6px; width: 30px; height: 30px; cursor: pointer; color: var(--ink-2); margin: 6px 0; }
@media (max-width: 900px) {
  .rail { right: 0; left: 0; top: auto; bottom: 0; transform: none; flex-direction: row; justify-content: space-between; height: 60px; padding: 0 12px env(safe-area-inset-bottom, 0px); background: var(--bg); border-top: 1px solid var(--line); }
  .rail-i .t { display: none; }  .rail-i.on .t { display: inline; }
}
```
