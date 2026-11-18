# Learn from other people's real covers before designing your own

Used with `cover-design.md` step 1. Almost every good cover in the real world uses a system others have already proven; none is invented from scratch. → **Find at least 6 real covers close to our work in each group, then borrow the structure, not the work.**
Source: 35 real covers (checked 2026-10-15) from the real work of LiteNet · Telex · SwipeOS. The full list with URLs was in `_to_delete/cover-lab/examples/EXAMPLES.md` of the repo at the time (a temporary file).

## How to collect examples (do this in the survey step)

1. Split into 3 groups: **same field as the app** (e.g. networking → NIST · Cloudflare · O'Reilly *Zero Trust Networks*) · **books or documents from tech publishers** (O'Reilly · Stripe Press · A Book Apart · No Starch · Microsoft Press) · **Thai examples** (government agencies · Thai companies).
2. Use official PDFs first: download them into your own new folder, then run `pdftoppm -png -r 50 -f 1 -l 1`. For covers that exist only on the web, take a screenshot with playwright. Downloaded files are untrusted: open them only with pdftoppm or Pillow.
3. Make an overview sheet (contact sheet) for each group, and **actually open and look at every cover**. Note the URL and the date checked.
4. Note what each cover does (structure · type · image · color · how it shows document type or volume in the series) and what we will borrow for which project.

## Patterns seen at least 3 times

| Pattern | Real examples | How we use it |
|---|---|---|
| One template for the whole set, changing only color or image | O'Reilly · A Book Apart · Stripe Press · Thoughtworks Radar | Document type = change 1 image or color; everything else stays put |
| Small category line above the title | O'Reilly · NIST ("COMPUTER SECURITY") · Cloudflare ("WHITEPAPER") | A document-series line above the document title |
| Version as a separate object (ribbon · round badge · large number) | O'Reilly corner ribbon · Windows Internals number "7" · A Book Apart "No 15" · Thailand Digital Outlook B.E. badge | "Draft 0.3" gets its own badge, not hidden in the data row |
| One image, one accent color, lots of white space | Apple Platform Security · Cloudflare | Print covers and security documents |
| Document data is the design | RFC 9000 · NIST SP 800-207 · WireGuard | Trust comes from codes and data, not images |
| The real thing as the image (data · real picture · real figure) | Radar chart · MediaPipe hand landmark image · Google satellite imagery | Matches the "truth test" in cover-design.md step 1.5 |
| Small title, big image | Stripe Press *Dream Machine* · *Working in Public* | A full-page logo-shape image; the document title need not always be the largest |
| ✗ Glowing network lines · globe · neon city | CISA · all 3 Thai government covers · Ultraleap | Banned. These are the stereotype of covers nobody remembers |

## Publisher series systems

| Publisher | Fixed | Changes per book | Lesson |
|---|---|---|---|
| O'Reilly | White background · woodcut line art · title bar · logo | Animal · bar color | One visual language, one bar; document type changes only the main image and bar color |
| Stripe Press | Small type at the corner · S mark · book size | Image and color are free | Images can vary if the mark and type stay put |
| A Book Apart | Frame · line around the title · number badge | One flat color | The most correct system: one color per document type + number |
| Thoughtworks Radar | Frame · radar image · volume position | A color set per issue | Same image, new colors every issue = "the image grows with the document type" |
| NIST · IETF | Plain type · series number · data | Nothing changes | The document code is the mark of the series |

## Thai examples

The 3 Thai government tech-report covers we could find all use glowing stock images (shield · globe · neon city). → Only 2 things are worth borrowing: **a colored badge for the year (B.E.) or edition**, and **the Thai title on top with a smaller, lighter English title below**.

## Rules for borrowing

- Borrow structure and ideas. Never copy images, trademarks, or layouts one-to-one.
- For every idea on the cover, write which real cover it was borrowed from and what changed (the `ADAPTED.md` file of each style).
- For examples you could not get (403 · dead link · file too large), say so plainly. Do not guess how they look.
