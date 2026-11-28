# Spacing and type scales

Details of `ui-craft` sections 1–2 and the scale for marketing pages (section 3) · the summary rules are in `SKILL.md`

## 1 · Spacing scale — one set for the whole app

```
4  8  12  16  24  32  48  64
```

Every padding, margin, gap must be one of these values. No `13px` `18px` `22px`.
If `16` feels too tight and `24` too loose — choose `16` and fix something else instead
(usually the problem is the font size or the line length, not the spacing).

**If a value in the platform skill conflicts with this scale, use this scale** — except the values in the list below only
This scale controls only padding · margin · gap; corner radius and component sizes (button 38 · corner 13) are set by the platform skill

**Exception list — values measured from the real system; use the platform value and do not round to the scale** (add one only when it was measured from the real system, and write its name here)

| Platform | Value | Source |
|---|---|---|
| Windows | content edge left/right 36 · gap between sections 40 | `ui-craft` → `references/tokens.md` (measured from Windows 11) |

Other values of the platform skill that are not in this table use this scale

**The spacing rule people overlook most:**

> Things that belong together must sit closer than things that do not

```
ผิด: label และ input ห่าง 16px   ระหว่างฟิลด์ห่าง 16px เท่ากัน
ถูก: label และ input ห่าง 8px   ระหว่างฟิลด์ห่าง 24px
```

(Wrong: label and input 16px apart, fields 16px apart, the same. Right: label and input 8px apart, fields 24px apart.)

The eye reads groups from spacing, not from lines — if the spacing is right, most divider lines are unnecessary

**Spacing in a card:** card padding ≥ the gap between the items inside, always
A card with padding `16` and items `24` apart inside looks like things spilling out of the frame

---

## 2 · Type scale

The upper steps (lg · md · base) are clearly apart and the lower steps are only 1px apart — the values in the table are workable examples, not from a fixed ratio, and **use no more than 5 sizes per screen**

| Step | Example (web) | Used for |
|---|---|---|
| lg | 22 | Screen heading · 1 per page |
| md | 15 | Card heading · table heading |
| base | 13 | All content |
| sm | 12 | label · description under a field |
| xs | 11 | timestamp · badge |

**Line height (line-height):**

| Size | line-height | Reason |
|---|---|---|
| Large heading | 1.2–1.3 | Already large, needs no air |
| Content | 1.5–1.6 | The eye must find the start of the next line |
| Thai | +0.1 from the values above | Upper and lower vowels collide |

**Line length:** 45–75 characters; longer and the eye loses its line
On a wide screen, limit the width of the text column; do not let it fill the screen

**Smallest size 11** for text that must be read (every platform, no exception) — a platform skill's scale may offer more than 5 sizes, but **1 screen still uses no more than 5** (a large number showing the main value counts as 1 size)

**Font weight:** 2 weights per screen are enough (regular + bold) — a font may have all of 400–700, but one page should not use more than 2
If you want emphasis, change the **color** or the **size** first; do not rush to add a 3rd weight

---

## 3 · หน้าการตลาดและ landing ที่ไม่มี motion

Use for pages people read down one section at a time (sales page · product home page · launch page) · apps and dashboards use sections 1–2 · pages that move section by section with scrolling → `ui-craft`

The values in the table are starting values, set from the real page trial of 2026-11-06 and not yet measured from a prototype site · once a prototype is chosen (`design-gate/design-references`), you may measure the sizes from the prototype instead and note the source beside the token

| Step | 1440 screen | 375 screen | Used for |
|---|---|---|---|
| display | 48–64 | 32–40 | Opening-section heading · 1 per page |
| h2 | 28–36 | 24–28 | Heading of each section |
| lead | 18–20 | 17–18 | First paragraph under the heading |
| body | 16–18 | 16 | Content |
| small | 14 | 14 | Image caption · source of a number |

- Still no more than 5 sizes per page · smallest 14, not 11, because people read this page once and do not use it every day until it feels familiar · line-height per the table in section 2
- **Check:** is display at least 1.5 times larger than h2? If not, the opening heading will not stand out from the other section headings.

**Page rhythm**

- Gap between sections takes 2 more values beyond the section 1 scale: 96 and 128 (the 375 screen uses 64) · spacing inside a section still uses the section 1 scale
- Text columns are still 45–75 characters wide, but the opening section and real images may use the full frame width · **Check:** at the 1440 screen, is every section as wide as the text column, leaving the right side empty? If so, enlarge the real image or split into 2 columns.
- **Check:** shrink the whole page; are there 2 adjacent sections using the same layout? If so, change one of them.
- **Check:** besides the opening section, are there 1–2 sections that stand out from the others (full-width image · solid color background · large number)? If there are none, every section is equally loud and it reads as a list; if there are more than 2, they fight for prominence.
- Density uses the airy type per section 8 of `SKILL.md`
