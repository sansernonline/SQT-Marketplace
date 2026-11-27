---
name: slide-deck
description: Use when planning a slide deck story or an HTML slide deck
argument-hint: '<topic or source file of the deck>'
---

# slide-deck — plan a deck whose titles tell the story, then deliver it as .pptx or HTML

> **One rule:** every slide title is the conclusion of its page. Read the titles alone in order, and they must tell the whole story. If they do not, reorder the slides or cut them before any design work.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make a slide deck", "presentation", "plan the story and layouts" (no file type given) | [`references/presentation-design.md`](references/presentation-design.md) (builds a .pptx with `document-design`) |
| "Slide deck in HTML", "animated deck", "presents from a browser", "click-by-click reveal" | [`references/html-slide-deck.md`](references/html-slide-deck.md) |
| "Convert this .pptx to HTML", "make the HTML look like the pptx" | [`references/from-pptx.md`](references/from-pptx.md) |

Colour and mood for every deck: [`references/deck-theme.md`](references/deck-theme.md) (theme rules in [`references/theme.md`](references/theme.md)). Layouts and the shell for HTML: [`references/layouts-and-shell.md`](references/layouts-and-shell.md). Mistakes to avoid: [`references/anti-patterns.md`](references/anti-patterns.md). Extra detail: [`references/deck-details.md`](references/deck-details.md).

## Steps every part shares

1. Choose the file. If the type is not stated, make a .pptx, and say in one line that an animated HTML version is possible.
2. Collect sources for every fact, number or competitor the deck cites, before writing titles.
3. Take the colours from the source work (run `scripts/source_palette.py` on the logo, file or website the user gave).
4. Write each title as plain text, one per slide. Reorder until the story reads, then cut slides that do not move it.
5. Budget each slide: title at most 2 lines, at most 6 bullets, at most 2 lines per bullet. Cut bullets rather than shrink text.
6. Keep content text at 18 pt or larger in a .pptx. Put the footer (section name left, page number right) on every slide.
7. Render every slide, look at the whole deck as thumbnails, then run `scripts/check_deck.py` (or `scripts/check_html_deck.py` for HTML).

## Check before done

- Reading only the titles gives the whole story, and every title is a conclusion.
- Each chart makes one point, and the chart has its data source and period.
- Every slide has a page number, and no slide is visibly denser than the others.
- The deck was opened once on a real screen or projector.
- The 13 items in `references/anti-patterns.md` were checked, and the line `ด่านก่อนลงมือ:` closes the work.
