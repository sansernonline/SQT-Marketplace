# Recipes — โค้ดพร้อมคัดลอกของ dynamic-website

> ทุกบล็อก ≤ 15 บรรทัด · เขียนใหม่ในรูปของเรา ยึดแนวคิดจากเว็บต้นแบบ ai4ba.ai-cie.com (อ่านโค้ดสาธารณะ 2026-10-22 · ไม่มี licence ระบุ จึงไม่คัดลอกโค้ดตรง ๆ) · ประโยคไทยในเครื่องหมายคำพูด «…» เป็นคอมเมนต์ของผู้เขียนเว็บนั้น
> ต้องมี: `gsap` 3.15 (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js`) · `Observer.min.js` โฟลเดอร์เดียวกัน (เฉพาะข้อ 11) · ตัวย่อ `$ = (s, r = document) => r.querySelector(s)` และ `$$ = (s, r = document) => [...r.querySelectorAll(s)]`
> ตัวอย่างที่ประกอบครบแล้ว: `assets/example-deck.html`

## สารบัญ

1. [T gate และ CSS kill-switch](#1-t-gate-และ-css-kill-switch)
2. [splitWords](#2-splitwords)
3. [ทางเข้า 4 แบบ และทางออก](#3-ทางเข้า-4-แบบ-และทางออก)
4. [goChapter โครง timeline](#4-gochapter-โครง-timeline)
5. [iris เปลี่ยนหน้า](#5-iris-เปลี่ยนหน้า)
6. [count-up](#6-count-up)
7. [decode](#7-decode)
8. [scroll reveal และ lines](#8-scroll-reveal-และ-lines)
9. [scrubWords](#9-scrubwords)
10. [wheel เปลี่ยนบท และล็อกรายการเลื่อนใน](#10-wheel-เปลี่ยนบท-และล็อกรายการเลื่อนใน)
11. [Observer ปัดจอ](#11-observer-ปัดจอ)
12. [แผนที่คีย์บอร์ด](#12-แผนที่คีย์บอร์ด)
13. [rail markup และ CSS](#13-rail-markup-และ-css)

---

## 1 T gate และ CSS kill-switch

**เมื่อไหร่ใช้:** ทุกไฟล์ที่มีการเคลื่อนไหว — ประตูเดียวใน JS หนึ่งบล็อกใน CSS ไม่เช็ก reduced-motion ซ้ำในแต่ละ animation · ที่มา app.js:238 · fx.js (reduced) · styles.css:157-162

```js
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const T = s => (reduced() ? 0 : s);          // ทุก duration · delay · stagger ผ่าน T()
// ใช้: tl.to(el, { opacity: 1, duration: T(.5), stagger: T(.08) })
// ถ้ามี gsap.matchMedia(): mm.add('(prefers-reduced-motion: no-preference)', () => { /* ของที่ขยับ */ });
```
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; transition-delay: 0ms !important; }
  html { scroll-behavior: auto; }
  [data-reveal], .lines .ln > span { opacity: 1; transform: none; }   /* เนื้อหาต้องเห็นครบ (WCAG 2.3.3) */
  .words .w { opacity: 1; }
}
```

## 2 splitWords

**เมื่อไหร่ใช้:** ก่อนทางเข้าแบบรายคำ (ข้อ 3) · ไทยไม่มีช่องว่างระหว่างคำ จึงแตกตามช่องว่างที่ผู้เขียนเว้นไว้ = เว้นวรรคตามจังหวะที่อยากให้เข้า · ที่มา app.js:285-300

```js
function splitWords(el) {
  if (el.dataset.split) return;                  // แตกครั้งเดียว กลับมาบทเดิมไม่แตกซ้ำ
  el.dataset.split = 1;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType !== 3) return walk(c);        // รักษา <em> <br> ข้างในไว้
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
CSS: `.wd { display: inline-block; will-change: opacity, filter; }` — `will-change` เฉพาะตอนเข้า แล้วล้างด้วย `clearProps` (ข้อ 3)

## 3 ทางเข้า 4 แบบ และทางออก

**เมื่อไหร่ใช้:** ทุกบทประกาศทางเข้าในมาร์กอัป `data-enter="blurWords|inkWords|blurLine|decodeWords"` · หัวเรื่อง `data-t` · ตัวตาม `data-f` · รูป `data-w` · ที่มา app.js:303-324 «ทางเข้า 4 แบบ (ห้ามใช้ fade+slide-up ซ้ำทุกจุด)»

```js
const ENTER = {
  blurWords: (els, at, tl) => els.forEach(el => { splitWords(el);
    tl.fromTo($$('.wd', el), { opacity: 0, filter: 'blur(8px)' },
      { opacity: 1, filter: 'blur(0px)', duration: T(.55), stagger: T(.075), ease: 'expo.out' }, at); }),
  inkWords: (els, at, tl) => els.forEach(el => { splitWords(el);          // อ่านออกตั้งแต่เฟรมแรก
    tl.fromTo($$('.wd', el), { opacity: .14 }, { opacity: 1, duration: T(.5), stagger: T(.09), ease: 'power2.out' }, at); }),
  blurLine: (els, at, tl) => tl.fromTo(els, { opacity: 0, filter: 'blur(10px)' },
    { opacity: 1, filter: 'blur(0px)', duration: T(.6), stagger: T(.08), ease: 'expo.out' }, at),
  wipe: (els, at, tl) => tl.fromTo(els, { clipPath: 'inset(100% 0 0 0)' },
    { clipPath: 'inset(0 0 0 0)', duration: T(1.1), ease: 'expo.out' }, at),
  decodeWords: (els, at, tl) => els.forEach(el => { splitWords(el); $$('.wd', el).forEach((w, k) => {
    tl.fromTo(w, { opacity: 0 }, { opacity: 1, duration: T(.2), ease: 'none' }, at + T(k * .16));
    tl.call(() => decode(w, 900), null, at + T(k * .16)); }); }),     // ข้อ 7 · ใช้กับอักษรละตินเท่านั้น
};
```
```js
function enterChapter(sec, tl, at) {
  ENTER[sec.dataset.enter || 'blurWords']($$('[data-t]', sec), at, tl);
  ENTER.blurLine($$('[data-f]', sec), at + T(.25), tl);
  ENTER.wipe($$('[data-w]', sec), at + T(.1), tl);
  tl.set($$('.wd, [data-f], [data-w]', sec), { clearProps: 'filter,will-change' }, at + T(1.8));
}   // «ล้าง filter หลังเข้าเสร็จ — ตัวหนังสือจะคมเต็มที่ ไม่ค้างเบลอ»
function exitChapter(sec, tl) {   // «ขาออกสั้นกว่า และเร่งออก (power3.in)»
  tl.to($$('.wd, [data-f], [data-w]', sec), { opacity: 0, filter: 'blur(8px)', duration: T(.22), stagger: T(.012), ease: 'power3.in', overwrite: 'auto' }, 0);
}
```

## 4 goChapter โครง timeline

**เมื่อไหร่ใช้:** deck-mode — บทซ้อนกันด้วย `position:absolute; visibility:hidden` เห็นเฉพาะ `.on` · timeline เดียวต่อการเปลี่ยนบท: ออก → ซ่อน → (กล้องบิน) → โชว์ + เข้า · ที่มา app.js:488-515 «เนื้อหาบทใหม่เข้าเมื่อกล้องบินไปได้ราว 40% (overlap)»

```js
function goChapter(j) {
  j = Math.max(0, Math.min(CH.length - 1, j));
  if (deck.busy || j === deck.i) return;
  const cur = CH[deck.i], nxt = CH[j]; let at = 0;
  deck.busy = true; setTimeout(() => { deck.busy = false; }, 2400);     // «เครื่องช้า: ไม่ล็อกนานเกิน»
  const tl = gsap.timeline({ onComplete: () => { deck.busy = false; } });
  if (cur) { exitChapter(cur, tl); tl.add(() => { cur.classList.remove('on'); cur.setAttribute('aria-hidden', 'true'); }, T(.32)); at = T(.62); }
  world && world.chapter(nxt.id);                                        // กล้อง 3D บินขนานกัน (ถ้ามี)
  tl.add(() => { nxt.classList.add('on'); nxt.removeAttribute('aria-hidden'); }, at);
  enterChapter(nxt, tl, at);
  deck.i = j; deck.last = performance.now();
  $$('.rail-i').forEach((b, k) => { b.classList.toggle('on', k === j); b.setAttribute('aria-current', k === j ? 'step' : 'false'); });
  history.replaceState(null, '', '#' + nxt.id); document.body.dataset.ch = nxt.id;   // ไม่ใช้ pushState
  nxt.focus({ preventScroll: true });                                    // ย้ายโฟกัสตามบท (section มี tabindex="-1")
}
```
CSS: `.ch { position: absolute; inset: 0; visibility: hidden; pointer-events: none; } .ch.on { visibility: visible; pointer-events: auto; }`

## 5 iris เปลี่ยนหน้า

**เมื่อไหร่ใช้:** เปลี่ยน route จากการคลิก "ของ" บนจอ (จุดในเครือข่าย การ์ด) — วงกลมสีแบรนด์โตจากจุดที่คลิก สลับหน้าหลังวง แล้วจางออก · ไม่ใช้กับการนำทางทุกครั้ง · reduced → ตั้ง hash ตรง ๆ · ที่มา app.js:805-812, 875-884 · styles.css:563

```js
function iris(x, y, swap) {           // swap = fn ที่เปลี่ยน route ตอนวงปิดจอ
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

**เมื่อไหร่ใช้:** ตัวเลขสถิติที่เพิ่งเลื่อนมาถึง (`[data-count="1200"]`) — ใส่เฉพาะเลขที่อยากให้จำ ไม่ใส่ทุกการ์ด · reduced → พิมพ์ค่าสุดท้ายทันที · ที่มา fx.js:41-50

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

**เมื่อไหร่ใช้:** หัวเรื่องอักษรละติน (pool คือ A-Z 0-9) — ห้ามใช้กับไทย เพราะสระและวรรณยุกต์ลอยจะแตก · reduced → พิมพ์ข้อความจริงทันที · ที่มา fx.js:6-20

```js
function decode(el, dur = 1100, pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789×=#%&/<>') {
  const final = el.dataset.text || (el.dataset.text = el.textContent);
  if (reduced()) { el.textContent = final; return; }
  const start = performance.now();
  const at = [...final].map((c, i) => (i / final.length) * dur * .7 + Math.random() * dur * .3);   // ซ้ายติดก่อนขวา
  (function tick(now) {
    const t = now - start;
    el.textContent = [...final].map((c, i) => c === ' ' || t >= at[i] ? c : pool[(Math.random() * pool.length) | 0]).join('');
    if (t < dur) requestAnimationFrame(tick); else el.textContent = final;
  })(start);
}
```

## 8 scroll reveal และ lines

**เมื่อไหร่ใช้:** page-mode (หน้าเลื่อนปกติ) — CSS ทำท่า JS แค่ติดคลาส `.in` ครั้งเดียวด้วย IntersectionObserver · `.lines` = บรรทัดโผล่จากใต้กรอบ · reduced → kill-switch ข้อ 1 · ที่มา styles.css:148-162 · fx.js:22-39

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
  io.unobserve(el);                                              // เล่นครั้งเดียว
}), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
const observe = (root = document) => $$('[data-reveal], .lines, [data-count], [data-decode]', root).forEach(el => io.observe(el));
```
ใช้ `--d` หน่วงทีละชิ้นในกลุ่มเดียว (`style="--d:80ms"`) ไม่เกิน 4–5 ชิ้น — ชิ้นที่ 6 ขึ้นไปผู้ใช้รอ

## 9 scrubWords

**เมื่อไหร่ใช้:** ประโยคยาวประโยคเดียวต่อหน้า (`.words > .w`) สว่างขึ้นทีละคำตามตำแหน่งเลื่อน — ไม่ใช้กับเนื้อความ · listener แบบ passive · คืนฟังก์ชันถอดไว้ใส่ `cleanups` · ที่มา fx.js:52-65

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

## 10 wheel เปลี่ยนบท และล็อกรายการเลื่อนใน

**เมื่อไหร่ใช้:** deck-mode เท่านั้น — `passive:false` และต้องถอดตอนเปลี่ยน route · รายการ `.scrollable` ในบทเลื่อนก่อน ถึงขอบแล้วครั้งแรกแค่บอกใบ้ หยุดเลื่อนแล้วค่อยเปลี่ยนบท · กันแรงเฉื่อย trackpad ไม่ให้ข้าม 2 บท · ที่มา app.js:724-748 «สุดรายการ: ครั้งแรกแค่บอกใบ้ ครั้งถัดไป (หลังหยุดเลื่อน) จึงเปลี่ยนบท»

```js
function onWheel(e) {
  const now = performance.now(), dy = e.deltaY, sinceWheel = now - (deck.lastWheel || 0); deck.lastWheel = now;
  const sc = e.target.closest('.scrollable');
  if (sc && sc.scrollHeight > sc.clientHeight + 4) {
    const atEdge = dy > 0 ? sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 : sc.scrollTop <= 1;
    if (!atEdge) { deck.innerAt = now; deck.edgeArm = 0; return; }                       // ให้รายการเลื่อนไป
    if (now - deck.innerAt < 700 || sinceWheel < 220) { e.preventDefault(); if (!deck.edgeArm) { deck.edgeArm = now; edgeHint(sc, dy); } return; }
    deck.edgeArm = 0;
  }
  e.preventDefault();      // «momentum ของ trackpad: เลื่อนต่อเนื่องหลังเปลี่ยนบทแล้วจะไม่นับ»
  if (Math.abs(dy) < 6 || now - deck.last < 1000 || (sinceWheel < 160 && now - deck.last < 2200)) return;
  goChapter(deck.i + (dy > 0 ? 1 : -1));
}
addEventListener('wheel', onWheel, { passive: false });
cleanups.push(() => removeEventListener('wheel', onWheel));
```
`edgeHint(sc, dy)` = ข้อความเล็กใต้รายการ "ดูครบแล้ว · เลื่อนอีกครั้งเพื่อไปบทถัดไป" โผล่ 0.3 วินาที หายเองใน 1.4 วินาที

## 11 Observer ปัดจอ

**เมื่อไหร่ใช้:** มือถือ deck-mode — จับเฉพาะ `touch` ไม่จับ wheel (ข้อ 10 ดูแลอยู่) · ข้ามพื้นที่ที่เลื่อนเองได้ · ที่มา app.js:714-723 · gsap.com/docs/v3/Plugins/Observer

```js
gsap.registerPlugin(Observer);
const ob = Observer.create({
  target: window, type: 'touch', tolerance: 24, preventDefault: true,
  ignore: '.scrollable, textarea, .modal',
  onUp: () => goChapter(deck.i + 1),      // ปัดขึ้น = บทถัดไป
  onDown: () => goChapter(deck.i - 1),
});
cleanups.push(() => ob.kill());
```

## 12 แผนที่คีย์บอร์ด

**เมื่อไหร่ใช้:** ทุกเว็บแบบบท — บังคับ · ข้ามเมื่อโฟกัสอยู่ในช่องกรอกหรือ modal · ลูกศรซ้ายขวาสงวนให้ของในบท (เช่น ไล่วันในกำหนดการ) · ที่มา app.js:749-759

```js
function onKey(e) {
  if (e.target.closest('input, textarea, select, [contenteditable], .modal')) return;
  const k = e.key;
  if (['ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); deck.last = 0; goChapter(deck.i + 1); }
  else if (['ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); deck.last = 0; goChapter(deck.i - 1); }
  else if (k === 'Home') goChapter(0);
  else if (k === 'End') goChapter(CH.length - 1);
  // ArrowLeft / ArrowRight: ของในบท (วันในกำหนดการ · สไลด์ย่อย) ไม่ใช่เปลี่ยนบท
}
addEventListener('keydown', onKey);
cleanups.push(() => removeEventListener('keydown', onKey));
```

## 13 rail markup และ CSS

**เมื่อไหร่ใช้:** 3–7 บท — รายการเลขขวาจอ ชื่อบทโผล่ตอนชี้หรือโฟกัส · บทปัจจุบัน `aria-current="step"` · จอ < 900px กลายเป็นแถบล่าง · ที่มา app.js:481-483, 509 · styles.css:551-575

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
