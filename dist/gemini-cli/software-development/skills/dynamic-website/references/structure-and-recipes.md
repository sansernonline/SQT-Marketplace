# Structure and recipe index · dynamic-website

Open when building or changing the page skeleton (modes, router, cleanup list, heavy renderer) or choosing which recipe to copy from `recipes.md`.

## Structure

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

## Recipe index

All code is in `recipes.md` (each block ≤ 15 lines, with its source).

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
