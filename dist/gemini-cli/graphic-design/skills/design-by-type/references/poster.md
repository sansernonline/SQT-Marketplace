# Poster · flyer · event key visual

Print specs (bleed, CMYK, resolution) live in `print-ready-files`. This file adds the beauty rules and where to find popular posters. Tested 2026-11-19 on a fictional Thai SME seminar poster (A3 portrait, 1240x1754); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Behance search `<topic> conference poster` / `event key visual` | full campaigns with posters | appreciations · views (e.g. "Connected Women in AI": 1,553 appreciations · 23,128 views; "50 Swiss Style Posters": 2,439 · 37,854, both 2026-11-19) |
| Dribbble search `event poster` / `conference program` | single posters, programme layouts | likes · views |
| Real Thai events in the same field (e.g. Techsauce) and Thai bank or agency seminar pages | local conventions: free entry, QR, afternoon time, venue line | attendance claimed on the event's own site |
| Template stores | common layouts to step away from | sales if shown |

## Beauty rules

1. Three zones: top = event name, middle = people and content, bottom = date, time, venue and QR. Source: uipro `banner-sizes-and-styles.md` 3-zone rule.
2. One registration point (QR or button), bottom right, contrasting clearly. Source: uipro CTA rules; Dribbble "Conference Program Poster".
3. One hero element (a ribbon, the speaker panels, a city photo); everything else stays quiet.
4. Give the hero element a meaning from the event: a ribbon that is the afternoon's timeline with speakers as stops beats a decorative ribbon (first draft 2026-11-19 was decoration and read as AI).
5. Headline left-aligned and large; asymmetry looks designed, centring everything looks generated. Source: "50 Swiss Style Posters"; uipro `styles.csv` Swiss rows.
6. Text may cross a panel or photo edge where it stays readable; that overlap gives depth without heavy shadows.
7. One local pattern strip can make it Thai (e.g. a ขิด band), kept thin and with a known source; thick strips look pasted on.
8. In a schedule, times are large and topics small; people scan by time.
9. One base colour plus one accent; depth from light and dark of the same hue (`depth-and-light.md` section 4).
10. At most 2 font families with full Thai; keep each Thai phrase together (`white-space: nowrap` per phrase), because Chromium split "สต็อก" mid-word in the test.
11. Text on a photo: dim the photo and measure contrast on real pixels.
12. The sub-headline tells the owner what they get that afternoon, not a slogan ("สามคน สามเรื่อง ในบ่ายเดียว" was flagged as a slogan).
13. Never draw fake people; use real speaker photos, or neutral placeholders marked `(รอยืนยัน)`. Never generate a working QR to a made-up link.

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- Decorative ribbon with no meaning → it became the timeline.
- Dead empty band at the bottom, tiny faint text, QR covering the venue → rebuilt the info grid.
- Five equal schedule columns with 350 px of dead space → three speaker columns, other times as a line.
- Silhouettes with no shoulders → redrawn to fit the panel height.
- Captions over bright buildings → photo moved and dimmed.

## Check before sending
- [ ] Three zones; one QR bottom right
- [ ] One hero element, and it means something
- [ ] Headline asymmetric, readable across a room
- [ ] Thai phrases unbroken; contrast measured on photos
- [ ] Print specs per `print-ready-files` before it goes to a print shop
