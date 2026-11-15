# State examples, motion, checklists and prohibitions — an extension of `ui-craft`

The main rules are in `SKILL.md`. This file holds the examples and the full checklists. Open it when doing sections 0.1 · 6 · 7 · 9 · 10

## Contents

1. [5 states of a hardware-reading app](#5-states-of-a-hardware-reading-app-section-6)
2. [Usable error messages](#usable-error-messages-section-6)
3. [CSS for prefers-reduced-motion](#css-for-prefers-reduced-motion-section-7)
4. [Review checklist — sets 1 and 2](#review-checklist-section-9)
5. [Beauty gate — set 3](#beauty-gate--set-3-section-01--section-9)
6. [Anti-patterns](#anti-patterns-section-10)
7. [Buttons repeated on every row](#buttons-repeated-on-every-row--which-kind-section-3)
8. [How to measure contrast](#how-to-measure-contrast-section-5)

---

## 5 states of a hardware-reading app (section 6)

| State | Example (light meter) |
|---|---|
| Empty | Camera permission not yet granted: show an explanation card with a single button |
| Loading | The sensor is warming up and has no first value: show a skeleton of the number, not `0` |
| Error | The device has no sensor or permission is blocked: give the cause and the way forward (use the camera instead · open the settings page) |
| Partial | The value is beyond the measurable range (saturated): show "more than X", not a wrong number |
| Success | A measurement point was saved: show a short SnackBar that does not cover the button |

## Usable error messages (section 6)

```
ผิด: Error 500: Internal Server Error
ผิด: เกิดข้อผิดพลาด กรุณาลองใหม่
ถูก: บันทึกไม่สำเร็จ เพราะเลขที่เอกสารนี้มีอยู่แล้ว ลองเลขอื่น
   แล้วกดบันทึกอีกครั้ง [ลองใหม่]
```

An error message = what happened + what to do next, in one message · for the pronoun use `คุณ` (you) or leave it out · never stack ครับ/ค่ะ ท่าน กรุณา · on-screen wording → `human-writing` `references/thai-grammar.md` section 4, level "screen"

## CSS for prefers-reduced-motion (section 7)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

## Review checklist (section 9)

- [ ] Squint: does only one thing jump out first?
- [ ] Measure 5 random spacings — is every one in the scale `4 8 12 16 24 32 48 64`?
- [ ] Count the font sizes on the page — more than 5?
- [ ] Count the solid brand-color buttons — more than 1?
- [ ] Do things that belong together sit closer than things that do not?
- [ ] Are all 5 states present (not just the has-data state)?
- [ ] Does the error message say **what to do next**?
- [ ] Does contrast pass 4.5:1?
- [ ] Does every status shown by color have an icon or text beside it?
- [ ] Do inside items have a smaller corner radius than outside ones?
- [ ] Do only things that really float have shadows? (except cards on a persuasion page of the soft SaaS look per `depth-and-flourish.md` · an app page used all day still follows this rule)
- [ ] Shrink the window to half (web) · system font 200 % + rotate to landscape (mobile) — what breaks?
- [ ] Put in real hard data: the longest Thai name with no spaces (Thai has no spaces to break lines at) · numbers of 7 digits or more · optional fields left empty · Thai mixed with English — nothing overflows buttons, table headings and cards
- [ ] Slow network (throttle 3G in developer tools) — you see a loading skeleton, not a white screen or a button that can be pressed twice
- [ ] Touch targets ≥ 44×44px and ≥ 8px apart

**The above measures correctness; passing all of it can still be ugly.** Continue with the countable items:

- [ ] Buttons and menus have icons (text only across the whole page = wireframe)
- [ ] Content uses ≥ 60 % of the screen height, or the empty space is intended (empty page · sign-in page)
- [ ] Rows of the same kind have equal height everywhere on the page (list in card A and card B)
- [ ] No more than 3 bordered boxes per page, and no box inside a box
- [ ] The mockup's controls (requirement codes · state switcher) are not stuck in the image sent for review

**Passing the 2 sets above can still be bland** — set 3 is the beauty gate (`ด่านสวย`), used for a mockup that will be sent to someone for approval

## Beauty gate — set 3 (section 0.1 · section 9)

Take screenshots of the hero screen + 2 frequently used pages, in both themes, and place them beside the reference app image at the same size (images from `_to_delete/ref-shots/` · no reference app → `assets/app-character-sheet.webp`, the row of the chosen character) · **2 reviewers who did not make it score separately, then use the lower score** · judge from the image, do not read the code · write a 1-line reason for every axis

| Axis | Scores 4 when (checkable by eye) | Scores 5 when |
|---|---|---|
| First impression | Show the hero-screen image for 5 seconds to a new subagent that does not know the brief, and it can say what the app does, matching the hero-screen sentence (section 0.1) | Scores 4 and that subagent says by itself it would like to try it, or points to 1 attractive spot |
| Hero screen | Has a page that shows the moment the product works (not a form · table · settings page) with content that looks real | Scores 4 and has motion or a state that tells a story in a single image |
| Identity | Has a logo (title bar or header bar) + the brand color appears at ≥ 2 spots that are not buttons and not the app frame (data · main number · hero screen · selection bar) + is not the platform skill's starter theme | Scores 4 and with the logo covered, you still recognize it as this app (color · shape · hero screen) |
| Polish | Set 2 above fails 1 item | Set 2 fails 0 items |
| Compared with the reference app | Place the images as a pair without saying whose is whose, and the reviewer says "close to each other" | The reviewer picks our image as better |
| Color power | Squint at the image and see the brand color at ≥ 3 spots in the content area, spread across the top, middle and bottom of the image (the app frame is neutral and does not count) · labels that must be found quickly (status · owner · step number) are visible at once in the platform's style (see the note under the table) · secondary colors are saturated; pastel may be used only as a surface paired with text or a dark-colored border | Scores 4 and has ≥ 1 large solid block of color in the content area (per the platform note) or has 1 color contrasting with the brand color used to highlight a single important spot |
| Depth and imagery | Every page: corners and shadows match the depth language of the chosen look ([`depth-and-flourish.md`](depth-and-flourish.md)) · icons from a single set per `icon-design` section 2 (if graphic-design is installed; if not, use one set of Lucide · Tabler or Fluent) at spots that help the eye sweep · has ≥ 1 hero image or graphic that is not text in a frame (app pages and dashboards may count a data chart) · persuasion pages (landing · sales page) add: grays and light surfaces tinted with the brand color, not pure gray paired with a very dark color · app pages keep the app frame gray per the note below | Scores 4 and placed beside the prototype the owner chose (`~/.claude/superuser-style.md` if present · if not, an image from this round's `design-references`), the reviewer says they are the same family |

**Platform notes (axes identity · color power · depth and imagery):**

- **Every platform:** the app frame (title bar · header bar · toolbar · rail · nav · borders) is gray-black lines and icons, not tinted with the brand color unless the user says so · the brand color lives in the data and primary buttons
- **web · mobile:** status labels are solid-background, not thin white outlines · a large solid block of color = the main-number card · hero · chart
- **Windows · depth and imagery axis:** depth uses Mica and Fluent elevation, no extra card shadows, and icons use Fluent — doing this does not count as a failed item
- **Windows:** color comes through the 3×16px selection bar · hero screen · main metric numbers (Key Performance Indicator · KPI) and charts · 1 primary button · status labels are a 6–8px dot + text, not a solid background, and the notice bar is a neutral background (`windows-app-design` → `references/patterns.md` items 7–8) — doing this does not count as a failed item

Below 4 on any axis = level 3 or lower · for the hero-screen axis, no hero page at all = 1

- **Pass when every axis ≥ 4** · record the score every round in `docs/BUILD-PLAN.md` (no recorded score = not passed)
- Below 4 → 2–3 problems per page with CSS-level fixes · after fixing, a new reviewer checks again · **cap of 3 rounds** (this number lives only here) · after 3 rounds still not passing → go back and choose the visual direction again (section 0.1), do not keep fixing spot by spot
- Adding the **number** of colors is not the fix for the "identity" axis — identity comes from the logo, the hero screen, the shape, and the brand color used in the right places (data · primary button) · do not tint the app frame to get a score
- Low "color power" axis → add **weight** to the colors already present in the content area; do not add new colors, do not tint the frame: main numbers and charts use saturated colors · pastel colors change to a saturated shade of the same color · web/mobile: outline labels change to solid backgrounds · the main-number summary box gets a dark background (do not use a thick color bar beside a rounded card, which is an AI sign in `no-ai-look`, unless that card signals status) · Windows: follow the platform note above

## Anti-patterns (section 10)

- **Merging an old mockup into a new file and calling it redone** — you get the same bland look again; see the exceptions in section 0
- **Using the platform skill's starter theme as is for the final look** — you get the maker's sample app, not a product
- **The main screen is a settings page** — you cannot sell a product with a settings page
- **Empty gray boxes in place of content** — a mock image can always be drawn with SVG/CSS

- **Fixing "looks not pretty" by adding more colors** — if it looks cluttered, the problem is almost always unsystematic spacing · but if it looks washed out, fix it per the "color power" axis by adding weight to the existing colors
- **Washed out and called plain** — a cream background, white cards, gray text, and color only in the header bar is a picture that is not wrong, but nobody remembers it
- **Treating a passed checklist as pretty** — a checklist catches only what is wrong; you must look with your eyes and have someone else critique it
- **Solid brand-color buttons on every row of a list** — see section 3
- **Divider lines on everything** — try deleting the lines and adding spacing instead; it improves almost every time
- **A shadow under every card** — a shadow means floating; a card sitting still is not floating
- **Bold for emphasis until the whole page is bold** — when everything is emphasized = nothing is emphasized
- **A new font size every time it feels not right** — ends at 9 sizes on one page
- **Building a state when a bug appears** — design all 5 states from the start
- **placeholder in place of label**
- **Color alone signaling status**
- **600ms animation because it feels smooth** — users read it as "slow"
- **Centering long text** — the eye cannot find the start of the line; always left-align content
- **Delivering without ever shrinking the window** (mobile: never enlarging the system font)

## Buttons repeated on every row — which kind (section 3)

| Kind | Use when |
|---|---|
| An empty icon button, appearing on hover or row selection (desktop) | The main action can be done with double-click or Enter |
| The primary button sits in the detail panel of the selected row | The screen is wide enough for a side panel (list-detail) |
| Swipe a row · long-press · ⋯ menu (mobile) | There is no hover |

Never use a solid brand-color button on every row — 8 rows means 8 primary buttons

## How to measure contrast (section 5)

Check in the browser: DevTools → select the element → the color field in Styles gives the value directly
If it is not a browser (Flutter · native), calculate from the color values in the tokens by the Web Content Accessibility Guidelines (WCAG) formula `(L1 + 0.05) / (L2 + 0.05)`, where L is the relative luminance (relative brightness) of the lighter color (L1) and the darker (L2)
Write it as a short test that loops over every text-and-background pair, in both light and dark mode, or use any contrast-checking tool (Flutter has `textContrastGuideline` in widget tests)
