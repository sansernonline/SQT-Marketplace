# skill: brand-kit

Use when starting a brand, posts look inconsistent, or a full brand guideline is needed. Logo, colours, Thai fonts, voice.

# Brand Kit

> **ด่านก่อนลงมือ (ทุกครั้ง):** อ่านธีมเจ้าของ → ค้นต้นแบบสด → 3 แนวที่ต่างกันจริง → ตรวจ `no-ai-look` ก่อนส่ง · ทำตามหัวข้อ "ด่านก่อนลงมือ" ของ `design-references` (plugin `superuser`) แม้มีแบรนด์แล้ว (แบรนด์คุมสีและฟอนต์ ส่วนการค้นใช้หาโครงของชิ้นนี้) · ปิดงานด้วยบรรทัด `ด่านก่อนลงมือ:`

One folder, one README, everything the brand needs to look like itself. A small shop needs a kit it can read in 5 minutes, not a 60-page brand book.

For app or product screens, the `software-company` plugin's `ui-craft` skill (if installed) covers tokens for code; without it, keep to this skill. This skill is for marketing, social and print. A software project's one-off visuals (logo, poster, LINE art) are lighter work in `software-company:graphic-design`; once the brand needs a full kit or campaign, work here.

## Workflow

0. **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `logo` (สีใช้ `color`) แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
1. **Collect** — brand name (Thai and English), 1-sentence positioning, audience, 3 personality adjectives, existing logo files, and 2 competitors to look different from
2. **Copy the folder template** in [kit-template.md](references/kit-template.md) to `brand-kit/v1/`
3. **Logo** — collect or request the 4 versions (full colour · reversed white · solid black · solid white), set clear space and minimum size (below)
4. **Colour** — assign roles, not just swatches (table below); run the contrast check on every text/background pair you will actually use
5. **Type** — pick 1 Thai+Latin pairing from [thai-fonts.md](references/thai-fonts.md), confirm the licence file, set the scale
6. **Imagery** — 3 adjectives, plus 1 on-style and 1 off-style example. **Voice** — not 3 adjectives: 1 before/after Thai pair written by the owner (how they would say it vs how a stranger would) · particles ครับ/ค่ะ yes or no · `คุณ` or no pronoun · 1 register from `human-writing` `references/thai-grammar.md` section 4
7. **Write the README** — the 5 rules that must never break, each with a 1-line reason
8. **Tag** `v1` and log changes in `CHANGELOG.md`; any change to colour, logo or font is `v2`

## Colour roles

| Role | Share of layout | Job | Rule |
|---|---|---|---|
| Background / neutral | ~60% | Canvas | Off-white or near-black, not pure #FFFFFF everywhere |
| Primary | ~30% | Recognition | The colour people name the brand by |
| Accent | ~10% | Action, price, call to action (CTA) | Use sparingly. If it is everywhere, it stops drawing the eye |
| Text | — | Reading | Must pass 4.5:1 on every background it sits on |
| Semantic (optional) | — | Sale, warning | Do not reuse accent for "error" |

**Contrast check (Web Content Accessibility Guidelines (WCAG) 2.2 AA, criterion 1.4.3):** normal text ≥ **4.5:1**; large text (≥ 18 pt, or ≥ 14 pt bold) ≥ **3:1**. Logos are exempt but should still be legible. Check pairs with any WCAG contrast checker (WebAIM Contrast Checker, a Figma or Canva contrast plugin, browser DevTools).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

### Worked example — contrast matrix

Palette for a Thai café: primary `#0F5C4D` (deep teal), accent `#F2A93B` (amber), text `#1F2328`, background `#FAF7F2`, muted text `#6B7280`.

| Text on background | Ratio | Body text (4.5) | Headline ≥ 18 pt (3.0) |
|---|---|---|---|
| `#1F2328` on `#FAF7F2` | 14.78 | Pass | Pass |
| `#0F5C4D` on `#FAF7F2` | 7.39 | Pass | Pass |
| `#FFFFFF` on `#0F5C4D` | 7.90 | Pass | Pass |
| `#6B7280` on `#FAF7F2` | 4.52 | Pass (just) | Pass |
| `#1F2328` on `#F2A93B` | 7.91 | Pass | Pass |
| `#FFFFFF` on `#F2A93B` | 2.00 | **Fail** | **Fail** |
| `#F2A93B` on `#FAF7F2` | 1.87 | **Fail** | **Fail** |

Ratios computed with the WCAG relative-luminance formula. Decision written into the kit: amber buttons carry **dark** text, never white; amber is never used for text on the light background.

## Type scale

- 1 Thai+Latin family for headlines and 1 for body (it can be the same family in 2 weights)
- Scale ratio 1.25 (major third) from a 16 px body: **16 · 20 · 25 · 31 · 39 · 49** px. On a 1080 px-wide social canvas: body 32–40 px, headline 72–120 px
- Thai body line-height **1.5–1.7** (stacked vowels and tone marks collide below about 1.4); Latin-only 1.4–1.5 (ค่ากลางอยู่ใน `human-writing` `references/thai-line-breaking.md`)
- Thai glyphs look smaller than Latin at the same size in many fonts — compare x-height and bump Thai 5–10% if the pairing looks uneven (judge by eye at real size)
- Looped Thai (มีหัว) for body and small text; loopless (ไม่มีหัว) for headlines and short display text

## Logo rules

| Rule | Default to write in the kit |
|---|---|
| Clear space | Height of 1 defined element (e.g. the symbol's height, or the cap height of the wordmark) on all 4 sides |
| Minimum size | Digital: test the wordmark at 24 px high and raise until it reads; print: about 15 mm wide — confirm with a test print |
| Backgrounds | Full colour on light; reversed on primary or dark; one-colour on photos only with a contrast overlay |
| Never | Stretch, rotate, recolour outside the kit, add shadow or outline, place on busy photo areas, retype the wordmark in another font |

Draw the clear-space box on a page in the kit (`logo/usage.png`) — people follow a picture, not a sentence.

## Rules

- Everything in the kit is a decision with a 1-line reason
- Not in the kit = not brand. A new colour enters only with a new kit version, never through a one-off post
- Confirm every font licence from the licence file in the download, not from a blog
- Keep the kit beside the work: `asset-organize` puts it at `00-brand-kit/`

## เขียนเป็นเอกสาร (full brand guideline)

ใช้เมื่อองค์กรหรือทีมต้องมีคู่มือเต็ม (น้ำเสียง ข้อความหลัก กติกาอนุมัติงาน การเก็บไฟล์) หรือต้องซิงก์สีเข้า design token · ร้านเล็กใช้ Workflow ข้างบนก็พอ

- **ไฟล์เดียว:** `docs/brand-guidelines.md` ที่ทุกคนและทุก agent อ่านจากที่เดียว · สีและฟอนต์ในนั้นเป็นต้นทาง ไฟล์ token ทำตามนั้น
- เริ่มจาก `templates/brand-guidelines-starter.md` · ข้อมูลที่ไม่มีใส่ `(รอยืนยัน)` ไม่แต่งเอง
- ซิงก์ token: `node scripts/sync-brand-to-tokens.cjs` · ตรวจไฟล์: `scripts/validate-asset.cjs` · เทียบสีภาพ: `scripts/extract-colors.cjs` · สรุปแบรนด์แปะ prompt: `scripts/inject-brand-context.cjs`
- ขั้นตอนเต็ม ตารางหัวข้อ/ไฟล์ต้นฉบับ ข้อจำกัด และรายการตรวจ: [references/brand-guidelines.md](references/brand-guidelines.md)

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## Related

- `style-consistency` — the per-campaign style lock that sits under the kit
- `design-review` — point 7 checks every asset against this kit
- `asset-organize` — folder and naming

## เรียกเป็นคำสั่ง

`/graphic-design:brand-kit [brand or company name]`

Run `brand-kit` with the `brand-keeper` agent for: **$ARGUMENTS**

Ends with a README you can read in 5 minutes and a v1 version tag.


## reference: brand-guidelines.md

# Brand guidelines — เอกสารแนวทางแบรนด์ฉบับเต็ม

ส่วนยาวของหัวข้อ "เขียนเป็นเอกสาร" ใน `SKILL.md` · ใช้เมื่อองค์กรหรือทีมต้องมีคู่มือเต็ม: น้ำเสียง ข้อความหลัก กติกาอนุมัติงาน การเก็บไฟล์ หรือต้องซิงก์สีเข้า token

> **กฎข้อเดียว:** แนวทางแบรนด์ต้องเป็นไฟล์เดียว `docs/brand-guidelines.md` ที่ทุกคนและทุก agent อ่านจากที่เดียว · สีและฟอนต์ในนั้นเป็นต้นทาง ไฟล์ token ทำตามนั้น ไม่ใช่กลับกัน

ลอกและปรับจาก ui-ux-pro-max-skill (MIT · commit `b7d5353` · ดู 2026-11-05) · เนื้อต้นฉบับอังกฤษคงไว้ที่ `data/upstream/` ไม่แก้ · สัญญาอนุญาต `data/upstream/LICENSE`

## เลือกงานให้ถูก

| งาน | ใช้ |
|---|---|
| ร้านเล็ก ต้องการชุดแบรนด์อ่านจบใน 5 นาที (โลโก้ 4 แบบ สีตามบทบาท ฟอนต์ไทย) | `SKILL.md` ส่วน Workflow |
| องค์กรหรือทีมที่ต้องมีคู่มือเต็ม: น้ำเสียง ข้อความหลัก กติกาอนุมัติงาน การเก็บไฟล์ | ไฟล์นี้ |
| อ่านโค้ดที่มีอยู่แล้วสรุปเป็น token | `ui-craft` → `design_tokens.py` (plugin `software-company`) |
| เขียน token สามชั้นและสร้าง CSS | `design-system` (plugin `software-company`) |
| ตรวจคอนทราสต์ของคู่สี | ตารางตัวอย่างใน `SKILL.md` |

## ขั้นตอน

1. **เริ่มจากแม่แบบ** `templates/brand-guidelines-starter.md` → คัดลอกเป็น `docs/brand-guidelines.md` แล้วเติมข้อมูลจริงของแบรนด์ · ข้อมูลที่ยังไม่มีใส่ `(รอยืนยัน)` ไม่แต่งเอง
2. **เติมทีละหัวข้อ** ตามตารางด้านล่าง · อ่านไฟล์ต้นฉบับเฉพาะหัวข้อที่กำลังทำ
3. **สีและฟอนต์เป็นตัวเลขที่ตรวจได้** · ฟอนต์ไทยเลือกตาม `thai-fonts.md` ไม่ใช้ตัวอย่างฟอนต์อังกฤษของต้นฉบับกับงานไทย
4. **ซิงก์เข้า token** (เมื่อมีแอปหรือเว็บ): `node scripts/sync-brand-to-tokens.cjs` → ได้ `assets/design-tokens.json` · สร้าง `design-tokens.css` ให้อัตโนมัติถ้า skill `design-system` ติดตั้งอยู่ข้างกัน ไม่มี → สคริปต์เตือนและเขียนแค่ JSON · มี token หรือ `:root` เดิมในโปรเจกต์ สคริปต์หยุดและรายงาน ไม่เขียนทับ (`--force` เฉพาะไฟล์ที่ซิงก์เองรอบก่อน)
5. **ตรวจงานก่อนส่ง:** `node scripts/validate-asset.cjs <ไฟล์>` (ชื่อไฟล์ ขนาด ชนิด) · `node scripts/extract-colors.cjs <ภาพ>` เทียบสีภาพกับพาเลตต์ · `node scripts/inject-brand-context.cjs` พิมพ์สรุปแบรนด์ไว้แปะใน prompt ของ agent

สคริปต์ทั้ง 4 อยู่ใน `scripts/` ของ skill `brand-kit` เป็น Node ไม่ติดตั้งแพ็กเกจเพิ่ม ไม่ต่อเน็ต · อ่านและเขียนไฟล์ตามโฟลเดอร์ที่รัน (ราก project) ไม่ใช่โฟลเดอร์ skill

## หัวข้อและไฟล์ต้นฉบับ

| หัวข้อ | ไฟล์ใน `data/upstream/` |
|---|---|
| น้ำเสียง | `voice-framework.md` |
| ข้อความหลัก | `messaging-framework.md` |
| ภาพลักษณ์ | `visual-identity.md` · `logo-usage-rules.md` |
| สีและตัวอักษร | `color-palette-management.md` · `typography-specifications.md` |
| ไฟล์งานและการอนุมัติ | `asset-organization.md` · `approval-checklist.md` |
| ตรวจความสม่ำเสมอ | `consistency-checklist.md` |
| ปรับแบรนด์แล้วซิงก์ทุกที่ | `update.md` |
| โครงเอกสาร | `brand-guideline-template.md` |

## ข้อจำกัดที่ต้องรู้

- ต้นฉบับเขียนภาษาอังกฤษและตัวอย่างเป็นสีฟ้า-ม่วงแบบ SaaS · ใช้เป็นโครงเท่านั้น สีจริงมาจากแบรนด์ (`no-ai-look` ข้อ 1)
- `update.md` เป็นคำสั่งของ ClaudeKit ต้นทาง (`/brand update`) ยังไม่มีคำสั่งนี้ใน marketplace เรา ให้ทำตามขั้นตอนในไฟล์ด้วยมือ
- ไม่มีตัวสร้างโลโก้หรือไอคอน — เจ้าของเลือกไม่ใช้งานที่ agent วาดเอง ถามหาตัวอย่างอ้างอิงก่อนเสมอ (`icon-design`)

## ตรวจก่อนส่ง

1. `docs/brand-guidelines.md` ไม่มีค่าที่ไม่ได้มาจากเจ้าของแบรนด์ (ไม่มีที่ไม่รู้ให้ `(รอยืนยัน)`)
2. ทุกคู่สีข้อความ/พื้นผ่าน 4.5:1 (ข้อความปกติ)
3. ถ้าซิงก์ token แล้ว เปิด `assets/design-tokens.json` เทียบสีกับเอกสาร 1 ครั้ง

## ที่มา

- nextlevelbuilder/ui-ux-pro-max-skill `.claude/skills/brand` · MIT · commit `b7d5353` · ดู 2026-11-05 · ไฟล์ใน `data/upstream/` `scripts/` `templates/` คัดลอกไม่แก้


## reference: kit-template.md

# Brand kit folder template

Copy this tree to `brand-kit/v1/` (or to `00-brand-kit/` inside the asset tree from `asset-organize`).

```
brand-kit/
└── v1/
    ├── README.md              ← the five-minute read (template below)
    ├── CHANGELOG.md           ← one line per version
    ├── logo/
    │   ├── <brand>-logo-colour.svg / .png / .pdf
    │   ├── <brand>-logo-reversed.svg
    │   ├── <brand>-logo-black.svg
    │   ├── <brand>-logo-white.svg
    │   ├── <brand>-symbol-*.svg          (icon-only versions, if any)
    │   └── usage.png                     (clear space, min size, don'ts drawn)
    ├── colour/
    │   ├── palette.md                    (roles, hex, RGB, Cyan Magenta Yellow Key (CMYK), contrast matrix)
    │   └── swatches.png
    ├── type/
    │   ├── fonts.md                      (families, weights, scale, licence links)
    │   └── licences/                     (the SIL Open Font License (OFL) text, OFL.txt, of every font shipped)
    ├── imagery/
    │   ├── on-style/                     (3–6 examples)
    │   └── off-style/                    (2–3 examples of what not to do)
    ├── voice.md
    └── templates/                        (post, story, cover, banner, doc header)
```

## README.md template

```markdown
# <Brand ไทย> / <Brand English> — brand kit v1

<One paragraph: who we are, for whom, how we want people to feel.>

## Five rules that never break
1. <rule> — because <reason>
2. ...

## Colour
| Role | Hex | RGB | CMYK | Use |
|---|---|---|---|---|
| Background | | | | |
| Primary | | | | |
| Accent | | | | |
| Text | | | | |

Allowed text/background pairs (all ≥ 4.5:1, or ≥ 3:1 for headlines ≥ 18 pt): <list>
Forbidden pairs: <list>

## Type
Headline: <family + weight> · Body: <family + weight> · Scale: <px list> · Thai line-height: <1.6>

## Logo
Clear space: <definition> · Minimum size: <px / mm> · See logo/usage.png

## Imagery
Three adjectives: <a, b, c> · See imagery/on-style and imagery/off-style

## Voice
Three adjectives: <a, b, c> · Banned habits: <e.g. no "!!!", no English jargon in Thai copy>

## Version
v1 · <date> · owner <name>
```

## CHANGELOG.md line format

`v2 · 2026-11-01 · accent #F2A93B → #E8A030 to match print · approved by <name>`

## CMYK note

Screen hex values do not convert one-to-one to print. Ask the print shop (โรงพิมพ์) for a proof of the primary and accent, then record the CMYK they matched — not the number a converter guessed.


## reference: thai-fonts.md

# Free Thai + Latin fonts for brand work

General information, not legal advice — read the licence file that ships with the font before commercial use; for disputes ask a lawyer (ทนาย).

All fonts below are distributed under the **SIL Open Font License 1.1** (OFL): free for commercial print, web, video, logos and apps; you may not sell the font file by itself; include the licence text if you redistribute the font files.

| Font | Thai style | Latin | Weights | Best for | Pair with |
|---|---|---|---|---|---|
| IBM Plex Sans Thai | Loopless (also *IBM Plex Sans Thai Looped*) | Matches IBM Plex Sans | 7 | Tech, corporate, clean | IBM Plex Sans; Plex Serif for editorial |
| Noto Sans Thai | Loopless (also *Noto Sans Thai Looped*, *Noto Serif Thai*) | Matches Noto Sans | Variable | Neutral, multilingual, long text | Noto Sans; Noto Serif Thai for formal |
| Sarabun | Looped | Built in | 8 + italics | Body text, documents, formal | Kanit or Prompt for headlines |
| Kanit | Loopless | Built in | 9 + italics | Bold headlines, sport, retail promo | Sarabun body |
| Prompt | Loopless | Built in | 9 + italics | Friendly modern headlines, food, lifestyle | Sarabun or Noto Sans Thai Looped body |
| Anuphan | Loopless | Built in | Variable | Minimal geometric | Noto Sans Thai Looped body |
| LINE Seed Sans TH | Loopless | Built in | 4 | Friendly, app-like voice | Itself, or Sarabun for long body |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://github.com/google/fonts/tree/main/ofl (folders sarabun, kanit, prompt, ibmplexsansthai, notosansthai, anuphan) · https://github.com/line/seed (LINE Seed, OFL 1.1) · weight counts (รอยืนยัน on Google Fonts specimen page)

## Notes that trip people up

- **Sarabun (Google Fonts) is not TH Sarabun New / TH SarabunPSK.** The TH versions belong to the 13 national fonts (ฟอนต์แห่งชาติ) released through Software Industry Promotion Agency (SIPA) under their own free licence (checked 2026-10-26 from secondary sources only: most of the 13 use the DIP-SIPA licence, which allows free use, copying and adapting but not selling the font on its own, and adapting needs written notice to DIP and SIPA plus a new font name; TH Sarabun New is GPL-2.0-or-later with a font exception for documents that embed it; no official SIPA licence text was reachable, so read the licence file in the download before shipping). They are the government-document fonts, a different design with a smaller visual size — do not mix them in one layout.
- Weight names differ between families: Kanit Medium looks heavier than Sarabun Medium. Pair by eye at the real size.
- Under about 14 px on screen, or 7 pt in print, looped Thai reads better than loopless.
- Free-font sites that repackage files sometimes strip the licence or add their own terms — download from Google Fonts, the foundry's GitHub, or the official site, and keep the `OFL.txt` in `type/licences/`.
- Paid Thai foundries (for example Cadson Demak) licence per use — desktop, web, app, broadcast. Check before using a paid font in a video ad.
