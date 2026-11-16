# Layouts, shell keys and animation · html-slide-deck

Open when choosing layouts for `slides.html`, or when you need to know what the shell already does.

## Layouts (all are in `slides-example.html`)

The look of the first 4 pages built with `build_deck.py` is in `assets/slides-example-preview.webp`.

| # | Layout | class / attribute | Use when |
|---|---|---|---|
| 1 | Cover | `.slide.hero` · `h1` · `.rule` · `.lead` | First page: title + the one sentence to remember |
| 2 | Person/option cards | `.row` > `.card.grow` | Team · compare 2–3 things |
| 3 | Clickable table of contents | `.toc` > `a[data-goto]` · `.p` page numbers filled in by hand | Decks over 12 pages |
| 4 | Section opener | `.slide.divider` · `.num` · `data-part` | Start of every section (the menu groups by `data-part`) |
| 5 | Big numbers | `.card` > `.big[data-count]` | 1–4 numbers to remember (count up on entering the page) |
| 6 | Table | `table.tbl` · `td.m` = code font | Technology · comparison ≤ 8 rows |
| 7 | System diagram + step-by-step tour | `.map` > `svg` arrows (`id`) + `.box` · `.layer` (`data-key`) · `ol.tour-steps` > `li[data-on][data-path]` + `div.tourbar` | Who connects to what, then press ▶ to walk the path of 1 request (place positions in px in a 1664-wide frame) |
| 8 | Click for details | `[data-pick="g"]` + `<template>` · panel `#d-g` | Files · rules · cases with long details |
| 9 | Code | `pre.code` · `<em>` key word · `<i>` comment | Core code ≤ 12 lines |
| 10 | Chat demo | `.phone` > `.chatlog[data-chat]` > `p[data-u]` / `p[data-a]` | A replayed chat typed one character at a time on entering the page |
| 11 | Step-by-step looping highlight | `[data-loop]` | 3–6 steps you want the eye to follow |
| 12 | Bar chart | `.bars` > `div[data-v][data-l][data-c]` | Per-item results · response time |
| 13 | Closing | `.slide.close` | 1-sentence summary + thanks · Q&A |

Every page has `<p class="foot">ชื่องาน · หัวข้อ · ที่มาของข้อมูล</p><p class="pg"></p>` · page numbers fill in by themselves.

## What the shell does for you (no need to write it yourself)

| Key | What it does |
|---|---|
| ← → · PageUp PageDown · click left/right edge · swipe | Change page only, never touches the player on the page |
| Space | Play / pause the player on that page (diagram tour) · does nothing on pages with no player |
| ↓ · ↑ | Next step · previous step of the player |
| M | Menu of all pages, grouped by `data-part` |
| N | Speaker notes from the page's `<aside>` |
| T | Clock start/stop · shows "time used / `data-at`" |
| S | Speaker window (open on the laptop screen, the projector opens the same file): this page + next page · speaker notes · time used / `data-at` · clock — press a button in that window and the projector follows (idea from lewislulu/html-ppt-skill (MIT)) |
| F | Full screen |
| Bottom bar | 1 cell per page · hover to see the page name · click to jump |
| `#12` at the end of the URL | Opens at page 12 · `[data-goto="id"]` jumps to the page with that id |
| Click `img.shot` | Enlarge to full screen |

## Animation (switch on per page — the default is still)

Content sliding up piece by piece on every page, numbers counting up, and glow that loops forever are AI signals in `no-ai-look`, so the shell does not add them to every page: put `data-anim` on the `<section>` only for pages where motion helps the eye follow the story (a system map where arrows must be drawn in order · section openers). `data-count` · `data-loop` · `.bars` · `data-chat` work only on the pieces where they are set.

| What happens | Where |
|---|---|
| Content slides up piece by piece, 70 ms per piece (pages with `data-anim`) | Children of the page · `.row` `.list` `.toc` `.pills` · `.tbl` rows |
| Section-opener page number flies in from the left (pages with `data-anim`) | `.divider .num` |
| Boxes pop up · arrows draw line by line (pages with `data-anim`) | `.box` `.layer` · `.map svg>path` |
| Number counts up from 0 — use on only 1 number to remember, not on every card | `[data-count="10"]` or `"9/10"` |
| Chart bars grow | `.bars` |
| Looping step highlight (the glow around blinks once per step, does not loop forever) | `[data-loop]` |
| Diagram tour (player): box lights up, arrow changes color, a dot runs along the line · press Space and it advances by itself every 3.2 seconds | `ol.tour-steps` + `.tourbar` |
| Chat typed one character at a time with a "typing" dot | `[data-chat]` |

Everything replays every time the page is entered · the player returns to the starting step and stops on every page change · turns itself off when the machine is set to reduced motion · add no animation that does not help the eye follow the story.
