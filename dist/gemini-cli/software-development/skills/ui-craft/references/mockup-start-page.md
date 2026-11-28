# First page of a single-file mockup (`#s-start`)

This page is the table-of-contents page of the mockup that the reviewer opens as the first page. **It is not a page in the app.** Large cards filling the screen are allowed here.
The start page inside a real app follows the platform skill, for example `ui-craft` → `patterns.md` item 8, which forbids large cards.

Sample image: [`../assets/mockup-start-page-preview.webp`](../assets/mockup-start-page-preview.webp) (project Telex, 32 screens) · this image was taken before the decorations were removed (glow · gradient · label above the heading); look at the structure, not the look.

## What it must have

| Part | Rule |
|---|---|
| Width | Content fills the window, up to 1680px, and is centered. Do not limit the width and align it left, because a wide screen would leave empty space on the right for no reason. |
| Top section | Logo, name, and 1 paragraph on how to use it (the 5 states, theme switching, what FR means). At most 4 shortcut buttons, only one solid button, and 4 number cells (number of screens · FR that have a screen · status per page · number of categories). |
| Search box | Finds by name, screen number and FR number. Press `/` to start typing, Enter opens the first screen found, Esc clears the query. The box stays pinned at the top when the page scrolls. |
| Cards | 1 card per screen, divided into categories by topic, using the same categories as the test-case tabs. A card has a thumbnail of the real screen, the screen number, the name, a 1-line description, and the FR number. |
| Thumbnails | Taken from the mockup itself, in both dark and light themes, and show the image matching the open theme. Hide the mockup's control bar before taking them. Embed the images in the file as webp so the mockup stays a single file (32 screens × 2 themes ≈ 170 KB). |
| Reference tables | The screen → FR table and the "FR with no screen" table are still required. Put them under the cards or fold them away. |
| Look | A single plain background, no glow, no gradient, no small label above headings, no blinking cursor, no glowing shadow or zoom image on hover (`design-gate/no-ai-look`) · hovering a card changes only the border color · colors come from the project's tokens; with no tokens, use the house default `#2A78D6` · this rule applies to the mockup start page; a landing page that chose the soft SaaS look follows that look. |

## Build with the script

```
python scripts/mockup-start-page.py mockup/PRJ-mockup.html --config mockup/start-page.json
```

- **Put the markers in first:** put `<!-- start-page:begin -->` and `<!-- start-page:end -->` inside `<section id="s-start">` at the spot where the content goes. The script replaces everything between the markers each time it runs, so it can be re-run.
- **After editing any screen, run it again**, because thumbnails are still images.
- **Config file:** see the example at [`../assets/mockup-start-page.example.json`](../assets/mockup-start-page.example.json)
  - `topics` is optional; all screens go into one category
  - A screen that is in no category is collected into the category "Other screens"
- **What the mockup must have:** every screen is `<section class="screen" id="s-NN-name" data-title="Product — Screen name" data-fr="FR-001,FR-002">`, and colors use the project's tokens (`--bg-surface`, `--accent`, etc.); if absent, it uses the tokens of `fluent.css`, and if those are absent too, it uses the defaults
- **Cannot make thumbnails yourself:** add `--no-thumbs` and you get cards without images (no need to install playwright)

## Check before sending

- [ ] Look with your own eyes at widths 800, 1600 and 2400px in both dark and light themes; there must be no empty space on one side only
- [ ] Try 3 kinds of search: name, screen number, FR number, and the results must be right
- [ ] Click a card and it goes to the right screen, with no error in the console
- [ ] Run the script again and the number of cards stays the same (each marker appears once)
