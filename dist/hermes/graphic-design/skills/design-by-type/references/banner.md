# Banner · social post · ad

Sizes, safe zones and the render script live in `banner-design` and `social-formats`; this file adds the beauty rules and where to find popular work. Tested 2026-11-19 on a fictional Chiang Rai coffee-bean shop ad (1200x628); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Meta Ad Library (search the product in Thai, country TH) | what real competitors run now | no likes; an ad running for months is a working ad, so use the start date |
| Real brands in the industry (the shop's own competitors, a famous roaster) | photo mood, product shots, offer wording | none |
| Dribbble search sorted by Popular | layout ideas, hero devices | views · likes on the shot page |
| Behance · Pinterest · template stores | more layouts | often blocked to scripts (403 or Cloudflare, 2026-11-19); open by hand or skip |

## Beauty rules

1. One message is the hero, about 3–4 times larger than anything else ("ส่งฟรี" or a big number). Source: uipro `banner-sizes-and-styles.md` visual hierarchy; test 2026-11-19.
2. One button, at least 44 px tall, contrasting clearly with what is behind it. Source: uipro CTA rules.
3. Offer terms sit next to the button, small but present (end date, area). Source: `copy-claims-check`.
4. Real product photos, not icons; nearly every Thai coffee ad in Meta Ad Library used a real bag or real beans (2026-11-19).
5. At most 2 font families, both with full Thai; heading 32 px or more, body 16 px or more on 1200 wide. Source: uipro typography.
6. Text covers about a fifth of the image; the photo does the rest. Whether Meta still limits ads with more than 20 % text is unconfirmed (see `banner-design`); less text reads faster either way.
7. Depth from overlap: a label, plate or number crosses the edge of the photo at 1–2 spots. Source: `design-gate/design-references` `depth-and-light.md`, Dribbble "Coffee Banner KV".
8. Photo fades into the background with a mask instead of sitting in a hard rectangle.
9. Colours come from the product (roasted bean, cherry red, leaf green), not from the owner's general tech palette; the project beats the owner's taste.
10. Keep key items at least 50 px from every edge per `banner-design`; leave more room left and right (blog summaries of Meta specs say up to 120 px, `(ยังไม่ได้ตรวจ)`) when the ad also runs in placements that crop.
11. Credit licensed photos in a corner at about 10 px.

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A badge repeating the headline, floating mid-photo → give it new information (origin) and seat it across the seam between shadow and photo.
- The same claim ("from Doi Chiang Rai") in badge, subhead and body → say it once.
- A photo cropped so tight it became a dotted circle → crop wider so the real object (plate rim) shows.
- An underline floating away from its word → a highlight bar touching the word.
- A small label above the heading (`eyebrow-badge`) → fold it into the body text (the only exception is the italic word in decks, `slides.md` rule 9).

## Check before sending
- [ ] One hero message, ≥ 3× the next size
- [ ] One button; terms beside it
- [ ] Real product photo with credit
- [ ] At least 1 overlap across the photo edge
- [ ] Text inside the side margins
- [ ] Colours trace to the product or a reference, not to a default
