# Try live values in the browser, and make several variants of one piece — an extension of `ui-craft` section 9

> Use when a page passed the checklist but one piece still does not fit (hero · product card · top bar · main table) · the whole page does not fit → go back to section 0.1 and make 3 new directions
> The idea comes from the `live` and `generate` commands of pbakaus/impeccable (Apache-2.0 · checked 2026-10-25), rewritten in our own words; no text or code was copied

## 1 · Try live values — edit in the browser first, edit the file later

Trying values in the open page is faster than editing the file and reloading each round, and it leaves no failed trial values in the code.

1. Open the page with the session's browser tool (Playwright MCP · Claude in Chrome) at the width used for review · take a screenshot **before**
2. Try values by running JavaScript in the page (`browser_evaluate` of Playwright) — change the token at the root, do not put a style on each box:
   ```js
   document.documentElement.style.setProperty('--radius', '10px');
   document.documentElement.style.setProperty('--accent', '#0b6e4f');
   ```
3. Try no more than 3 values per issue; take a screenshot of every value at the same width and compare with the before image
4. **Write the winning value into the source file** (the token in the existing css per section 0 · not a new file), then reload the page and take another screenshot — the after-reload image must match the chosen image
5. Every value must still be in the scale of sections 1–2 · a winning value outside the scale = the scale is wrong; tell the user, do not slip it in

Never deliver work whose values live only in the browser — they vanish when the tab closes.

## 2 · Several variants of one piece

Use for a piece with several routes where choosing wrong is costly (hero · main card · empty page) · for small pieces (button color · corner radius) section 1 is enough

1. Name exactly 1 piece (for example `product card in the list page`) and what must not change (tokens · sample data · box size)
2. Make **3 genuinely different variants** — different in structure (image on top/beside · price prominent/name prominent), not just in color · for a large piece, send one new subagent per variant per `crew-patterns/parallel-attempts-pick-best`
3. Put all 3 variants in the existing mockup file and switch with an attribute; do not make 3 files:
   ```html
   <div class="variants" data-show="a">
     <article data-variant="a"> … </article>
     <article data-variant="b"> … </article>
     <article data-variant="c"> … </article>
   </div>
   ```
   ```css
   .variants > [data-variant] { display: none; }
   .variants[data-show="a"] > [data-variant="a"],
   .variants[data-show="b"] > [data-variant="b"],
   .variants[data-show="c"] > [data-variant="c"] { display: block; }
   ```
   The switcher changes only the `data-show` of the outer box
   The switch buttons live only in the mockup's control box (section 9 · never stuck into the image sent for review)
4. Take screenshots of every variant at the same width, send them to a new beauty-gate (`ด่านสวย`) reviewer (reviewer order per section 9) to score the 7 axes and answer which variant is "bold enough without being loud"
5. Keep the winning variant, delete the other 2 and the switcher from the file · note under `ตัดสินใจเอง` (decided on my own): which was chosen · which was not · the scores

## 3 · Traps

| Trap | Why it breaks | Replace with |
|---|---|---|
| Trying values box by box with inline style | A winning value means chasing many edits, and it falls off the scale | Change the token at the root |
| 3 variants that differ only in color | The reviewer chooses by taste and gives no answer on structure | Differ in structure or visual order |
| Leaving the losing variants in the file "just in case" | The deliverable holds things nobody uses, and the next person gets confused | Delete · keep the images in `_to_delete/` |
| Letting the maker be the one to choose | They always see their own work as better than the truth (section 9) | A new reviewer |
