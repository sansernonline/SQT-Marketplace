# Color sets that were actually used (examples)

> Warning: **these are examples, not standard values.**
> Always choose colors from the content of the work first, per item 0 of `SKILL.md`.
> Use this file to see what a complete set that passes the contrast thresholds looks like (checked with the script on 22 Oct 2026 (2569 BE)), not to copy.

## Set A — blue–violet (general software · extracted from Apps Track)

Light tone, airy, soft, cool gray text

```python
use_brand(
    brand="2A78D6", brand_2="6A5CD6", brand_deep="2A4C86",
    brand_tint="EDF1FB", brand_tint_2="F6F8FD",
    text="333B4A", text_body="414957", text_muted="676D7A", line="E4E7EE",
)
```

## Set B — teal green (medical · health)

```python
use_brand(
    brand="0E8F86", brand_2="2F9E6E", brand_deep="0A5A56",
    brand_tint="E6F4F2", brand_tint_2="F3FAF9",
    text="2C3A38", text_body="3A4846", text_muted="636F6A", line="E1EAE8",
)
```

## Set C — navy (government · legal)

```python
use_brand(
    brand="1F3C88", brand_2="5B4B8A", brand_deep="14275C",
    brand_tint="E8ECF7", brand_tint_2="F5F7FC",
    text="2B3245", text_body="3A4156", text_muted="636A7D", line="E2E6F0",
)
```

## Set D — amber yellow + steel gray (industrial · factory)

A warm accent on a cool gray frame. Use the accent only at the spots that need attention, not across the whole page.

```python
use_brand(
    brand="B57509", brand_2="8C5A2B", brand_deep="704805",
    brand_tint="FBF2E1", brand_tint_2="FDF9F1",
    text="2F3439", text_body="3E444A", text_muted="676F76", line="E5E8EA",
)
```

## Status colors — the same set for every brand

Status colors **do not change with the brand**, because their meaning is fixed.

| Status | Background | Text |
|---|---|---|
| Success | `E9F7EF` | `17794A` |
| Info | `EAF2FD` | `2160AB` |
| Warning | `FDF5E4` | `96660D` |
| Error | `FDEDEC` | `A63A34` |
| Accent | `F1EEFC` | `52439F` |
| Neutral | `F2F4F8` | `626A7A` |

> If the brand color clashes with one of the status colors (for example the brand is green), change the **brand color in that context**.
> Do not change the status color. Readers interpret green as "passed" before reading the text.

## How to check before use

1. Body text and `text_muted` on a white background and on a `brand_tint` background ≥ 4.5:1 · `brand_deep` (H2 and table headers) on white and `brand_tint` ≥ 7:1 · `brand` (H1 16pt bold, and KPI numbers count as large text) ≥ 3:1
2. Printed in black and white, headings must still be distinguishable from body text
3. Open the rendered file and look by eye; do not trust the values in the table

## Tones suggested by the content of the work (use when there is no brand color to hold on to)

| Content of the work | Suggested tone | Reason |
|---|---|---|
| Medical · health | Teal green · green | Cleanliness, safety |
| Finance · banking | Dark blue · silver gray | Stability |
| Industrial · factory | Amber yellow · steel gray | Machinery, warning |
| Education | Purple · light orange | Enthusiasm |
| Retail · food | Orange · pinkish red | Warmth, appetite |
| Government · legal | Navy · oxblood | Formality |
| General software | Blue | A neutral default when there is no other context |

If the customer already has a brand, use the brand colors. This table is used only when there is nothing to hold on to.
