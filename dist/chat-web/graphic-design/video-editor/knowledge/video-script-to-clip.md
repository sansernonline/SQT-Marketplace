# skill: video-script-to-clip

Use for a short video, Reel or TikTok ad, from hook to shot list

# video-script-to-clip — a short video from hook to shot list, readable with the sound off

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the "ด่านก่อนลงมือ" section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search is for the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

## Use when

- Writing a short video, Reel, TikTok or Shorts ad from a message
- Needing a hook, beat sheet, shot list, thumbnail storyboard or captions

Not for: a person speaking on camera → `speaking-script` · Thai subtitles as .srt → `subtitles-th` · Thai voice-over without recording → `narration-th`

## Steps

Viewers decide in the first 3 seconds, and most watch with the sound off: write for both.

1. **One message, one action**, from the `campaign-set` card. If it will not fit one sentence, it is two videos.
2. **Pick length and platform:** 9:16, 1080 × 1920; 7–15 s for an offer, 15–30 s for a demo, up to 60 s for a story (safe zones from `social-formats`).
3. **Write the hook** (0–3 s) with a pattern: show the result · call out the viewer · problem first · surprising number · before → after · question (examples → [`references/hooks-and-example.md`](references/hooks-and-example.md)). The product or problem is visible in the first frame; no logo intro, no slow fade-in, no black frame at the start; movement or text in frame 1. If the hook cannot be said in one sentence, the video has none yet.
4. **Beat sheet,** one idea per 2–5 s: hook → problem or desire → proof/demo → offer → call to action (CTA). One video = one CTA. Show the offer and the CTA as text.
5. **Shot list** with [`references/shot-list-template.md`](references/shot-list-template.md): visual, camera, motion, on-screen text, voice-over, duration.
6. **Thumbnail storyboard,** one frame per shot in a grid. If the story does not read as stills, motion will not save it. Generate or shoot only after the storyboard is approved.
7. **Per-shot generation brief** (style block from `style-consistency`) or shooting notes for a phone shoot; fields → `references/hooks-and-example.md`.
8. **Captions,** burned-in or SubRip Text (SRT), by the table below; review on a phone with sound off. Platform auto-captions mis-transcribe Thai names, prices and brand words: correct them by hand.
9. **Music:** use the platform's licensed library or tracks you own a licence for; commercial accounts often have a narrower library than personal ones (รอยืนยัน per platform).
10. Run the `no-ai-look` check (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## Caption and on-screen text rules

| Rule | Value |
|---|---|
| Position | Inside the middle band, clear of the platform's UI zones; look up the safe-zone guide live (links in social-formats/references/platform-sizes.md) |
| Lines | 1 line preferred, max 2; bottom-heavy pyramid when 2 lines |
| Thai line length | ≤ 35 characters per line, not counting tone marks and above/below vowels |
| Reading speed (Thai adult) | Captions and subtitles (they follow the voice-over): ≤ 17 characters per second. On-screen marketing text (headline, offer): characters ÷ 12, min 1.5 s, offers ≥ 2.5 s (see `motion-basics`) |
| Duration per caption | 5/6 s minimum, 7 s maximum |
| Thai punctuation | Subtitles: no full stops; separate sentences with a space; no question marks or dashes in dialogue; "…" as one character. On-screen hook text may use "?" once |
| Size | Thai caption ≥ 48 px on a 1080 px canvas with dark outline or 60–70% box behind (house rule) |
| Line breaks | Break between words or phrases; never inside a word; check every break by reading aloud |
| Total on-screen marketing text | Under about 120 Thai characters across a 15 s clip (not counting tone marks and above/below vowels) |

## Check before done

- Hook in one sentence, product or problem visible in frame 1
- One message and one CTA; offer and CTA shown as text
- Captions pass the table above and were read on a phone with sound off
- The line `ด่านก่อนลงมือ:` closes the work

## References

- [`references/hooks-and-example.md`](references/hooks-and-example.md) — open when writing the hook or per-shot briefs, or for a finished 12 s shot-list example
- [`references/shot-list-template.md`](references/shot-list-template.md) — open when writing the shot list
- [`references/production-tools.md`](references/production-tools.md) — open to pick an editor or code tool (CapCut, DaVinci Resolve, HyperFrames, Remotion), commercial-use terms, export settings, Thai subtitle fonts, music licences
- Sources and check dates (caption rules): [`references/sources.md`](references/sources.md)

Related: `motion-basics` (text timing) · `social-formats` (canvas, safe zones) · `style-consistency` · `campaign-set` (V rows in the matrix)

## เรียกเป็นคำสั่ง

`/graphic-design:video-script-to-clip <the message> [target platform and length]`

Run `video-script-to-clip` for: **$ARGUMENTS** — `social-creator` writes the message, hook and script; `art-director` writes the shot list, motion timing and per-shot briefs.

Review the storyboard as thumbnails before generating anything.


## reference: hooks-and-example.md

# Hook examples, per-shot brief and worked 12 s clip · video-script-to-clip

Open when writing the hook, writing per-shot generation briefs, or wanting a finished shot-list example.

## Hook patterns (first 3 seconds)

| Pattern | Example (café matcha) |
|---|---|
| Show the result | Close-up pour of matcha into milk, layers forming |
| Call out the viewer | "คนทำงานสีลม ร้อนแบบนี้…" |
| Problem first | Sweat on forehead, sun, "บ่ายสองโมงแล้วง่วงมาก?" |
| Surprising number | "ซื้อ 1 แถม 1 ทั้งเดือน" on screen at frame 1 |
| Before → after | Plain glass → finished layered drink in one cut |
| Question | "รู้ไหมทำไมมัทฉะต้องตีน้ำร้อน 80 องศา?" |

## Spoken hook patterns (first spoken sentence, for a person speaking on camera · used by `speaking-script`)

| Pattern | Example |
|---|---|
| Go against a popular idea | "ทุกคนบอกให้ลงคลิปทุกวัน ผมหยุดลงไป 2 สัปดาห์แล้วยอดดูขึ้น" |
| Confession | "ผมเคยเสียเงิน 30,000 กับคอร์สที่สอนสิ่งที่เดี๋ยวบอกฟรีในคลิปนี้" |
| A number that looks odd | "ร้านนี้ขายกาแฟแก้วละ 45 แต่คนต่อคิว 40 นาที" |
| A question the viewer is already asking | "เคยไหม ซื้อของออนไลน์แล้วได้ของไม่ตรงปก คืนก็ไม่ได้" |
| Promise a payoff | "ฟังจบคลิปนี้ เขียนสคริปต์พูดของตัวเองได้ใน 10 นาที" |
| Start in the middle of the event | "ตอนนั้นผมยืนอยู่หน้าร้าน มือถือกุมใบเสร็จ แล้วรู้ว่าโดนแล้ว" |

Rules: no greeting to open the clip · no introducing yourself before the hook · the hook must make the viewer ask "so what happens next?" — if the viewer has no open question after the first sentence, the hook has not passed

## Per-shot generation brief

Subject · action/motion (what moves, how fast) · camera (static, pan, push-in, orbit) · duration · aspect ratio · style block reference · first-frame and last-frame description (for continuity between shots) · negatives (text, logos, warped hands).

## Worked example — 12 s offer clip

| # | Time | Visual | Camera | On-screen text | Voice-over |
|---|---|---|---|---|---|
| 1 | 0–2.5 s | Matcha poured over milk and ice, layers forming | Macro, static | "ร้อนแบบนี้ ต้องมัทฉะเย็น" | (sound: ice) |
| 2 | 2.5–5 s | Office worker takes first sip, eyes close | Medium, slow push-in | — | "บ่ายนี้ เติมความสดชื่นหน่อย" |
| 3 | 5–9 s | Two glasses slide together on the counter | Top-down | "ซื้อ 1 แถม 1 · 1–12 เม.ย." | "ซื้อหนึ่งแถมหนึ่ง ถึงสิบสองเมษา" |
| 4 | 9–12 s | Logo + LINE ID on cream background, glass beside | Static | "แอด LINE @matcha26 รับโค้ด" | "แอดไลน์รับโค้ดเลย" |

Check shot 3 text (on-screen marketing text, read while watching, so ÷ 12 not ÷ 17): "ซื้อ 1 แถม 1 · 1–12 เม.ย." = 23 counted characters (base letters + digits + spaces + symbols) ÷ 12 ≈ 1.9 s; it is the offer, so hold ≥ 2.5 s → on screen 4 s, fine.


## reference: production-tools.md

# Tools for turning a script into a clip

Open this file after you have the shot list from step 5 of `SKILL.md`, when you must choose what to edit with, how to add Thai subtitles, and how far music and fonts can be used · every item was checked against the official pages on 2026-10-23 · prices and terms change often, so for client work or ads, open the official pages again before sending · the label (our approach) marks a default the team chose itself, not a fact from a source

## 1 · Choose a tool

| Tool | Good for | Automatic Thai subtitles | Commercial use | Know before using |
|---|---|---|---|---|
| CapCut (mobile · desktop · web) | Short clips that must be done today · posting to TikTok | CapCut's Thai-language tool page says it can transcribe spoken Thai to text and export subtitles as an .srt file · the English page has no language list | The program itself is usable, but music, templates, and fonts in the app have conditions (section 2) | The right to use materials in the app is revocable |
| DaVinci Resolve 21 free version (Windows · macOS · Linux) | Serious editing, color correction, audio fixing · long clips | A secondary source says generating subtitles from audio belongs to the Studio version and Thai is not in the language list (not yet checked against the official manual) · use importing a corrected .srt instead | The product page does not mention this · read the license at install time (not yet checked) | The free version works with 8-bit video, at most 60 fps at 3840 × 2160 · DaVinci AI Neural Engine and hardware acceleration of H.264/H.265 are in the Studio version, priced $236 (down from $295) |
| HyperFrames (HeyGen's open source) | Clips written in HTML and CSS · having an agent build a batch from a template | No verified Thai transcriber · add subtitles from a corrected file | Apache-2.0 license, commercial use allowed · the fonts, music, and images you put in must be licensed by you | Needs Node.js 22 or later and FFmpeg · `npx hyperframes render` gives an MP4 file |
| Remotion | Clips written in React · repeating hundreds of clips from data | No verified Thai transcriber | Free for individuals · for-profit companies with at most 3 employees · non-profits · a trial period before commercial use · other organizations must buy a Company License | `npx remotion render <entry> <composition-id> <output>` · without `--codec` you get H.264 |

Remotion Company License prices: Creators $25 per seat per month · Automators $0.01 per render with a $100 monthly minimum · Enterprise starts at $500 per month

**Quick choice** (our approach)

- Making a single clip yourself for TikTok: CapCut finishes fastest
- Client clips or ads that go to several platforms: cut in the DaVinci Resolve free version, then use licensed music and fonts (sections 4 and 5)
- Dozens of clips with the same look where price or text changes with data: use HyperFrames or Remotion · if the company has more than 3 employees and picks Remotion, put the Company License fee in the budget too

## 2 · CapCut: how far music, templates, and fonts can be used commercially

The binding contract is the CapCut Materials License Agreement, which users outside the US make with ByteDance Pte. Ltd. (last updated 2026-01-22) · the Terms of Service (last updated 2026-04-15) item 10 passes you on to this contract, and says it does not grant rights in the music and sound recordings in the app

| Item in the app | How far it can be used |
|---|---|
| Templates, stickers, fonts, general sound effects | Personal use, not commercial |
| Items with a commercial-use label (the contract calls them Dual Use Materials) | Commercial use only in the channels, period, and territory the contract states |
| A clip that mixes the 2 kinds above | The whole clip is usable for personal use only |
| Regular library music (Sounds) | Usable when the clip is personal work for entertainment, not commercial |
| Commercial Sounds | The clip can be shared only in CapCut · TikTok · TikTok for Business · posting elsewhere needs separate permission from the rights holder |

(our approach) For client work or ads, use CapCut only as an editing program, and take music, fonts, and images from sources that have a license file (sections 4 and 5) · if another CapCut page says something different from the contract, follow the contract

## 3 · Export settings per platform

Starting sizes are in `social-formats`, and for safe areas look up live from the platform's guide (links in `references/platform-sizes.md` · section 7 is the neutral export setting that works everywhere: sRGB · H.264 MP4 · 30 fps · AAC audio) · this table says only where to set things

| Sending to | Settings |
|---|---|
| TikTok · Reels · Shorts | 1080 × 1920 (9:16) · 30 fps · MP4 H.264 with AAC audio · subtitles burned into the picture |
| YouTube landscape | 16:9, for example 1920 × 1080 · subtitles can be a separate .srt file (YouTube accepts basic SubRip, does not read styles, and it must be UTF-8) |
| Handing off to another editor | Source files · the .srt file · a music folder with licenses, named per `asset-organize` |

| Tool | Where to set it |
|---|---|
| CapCut | The Export button: resolution, frame rate, and file format (menu names in the latest version, not yet checked) |
| DaVinci Resolve | The Deliver page: Format MP4 · Codec H.264 (preset names in version 21 not yet checked) |
| HyperFrames | `npx hyperframes render` gives an MP4 · for how to set the frame size see the project's docs (not yet checked) |
| Remotion | Set `width` `height` `fps` `durationInFrames` in `<Composition>` · without `--codec` you get H.264 |

## 4 · Thai subtitles: fonts and line length

- **Line length, reading speed, time per subtitle, and where to break lines** use the Caption and on-screen text rules table in `SKILL.md` in one place: at most 35 characters per line · at most 17 characters per second · do not break mid-word
- **HyperFrames and Remotion draw the picture with headless Chrome (no window),** so Thai CSS rules apply directly: set `lang="th"` and never `word-break: break-all`, per the HTML row in `human-writing` `references/thai-line-breaking.md`
- **Fonts with a clear license:** IBM Plex Sans Thai (the subtitle default, see `subtitles-th`) · Sarabun · Kanit · Noto Sans Thai are in the `ofl/` folder of google/fonts (SIL Open Font License: OFL) · OFL FAQ items 1.1 and 1.13 say it can be used in commercial work, and the pictures or videos made are not bound by OFL conditions · the ban is on selling the font file by itself
- **Fonts in the CapCut app count as CapCut materials** per item 10 of the Terms of Service, so commercial work can use only fonts with a commercial-use label, or OFL fonts you import yourself (how to import fonts in each app version, not yet checked)
- **Size and background:** at least 48 px on a canvas 1080 px wide, with a dark outline or a 60–70% solid box per `SKILL.md` · use Medium weight or heavier, because the heads of Thai letters in thin weights vanish when the video is compressed (our approach)
- **AI subtitles from every tool** must have names of people, brand names, prices, and numbers fixed by hand before export

## 5 · Music: simple rules

1. **The safest way:** use the music library of the platform you will post on, and use it only inside that platform · business accounts often get a smaller library than personal accounts (รอยืนยัน, per platform)
2. **Posting to several platforms or making ads:** use royalty-free music that you bought or downloaded with a license, and keep the license file in the project next to the music file, for example `music/licences/`, with a PDF or screenshot of the license, a link, the name of the account that bought it, and the date · royalty-free means you do not pay a fee every time you use it, not that it is free
3. Put the music name and license source in the `Music:` field of the script header in [shot-list-template.md](shot-list-template.md)
4. **Do not** pull popular music from YouTube or Spotify · crediting the music's owner does not replace a license · CapCut's Commercial Sounds cannot be used outside CapCut and TikTok

## Sources (checked 2026-10-23)

| Topic | Source |
|---|---|
| CapCut materials contract (ByteDance Pte. Ltd. · updated 2026-01-22) | capcut.com/clause/material-license-agreement |
| Terms of Service item 10 · no rights in music (updated 2026-04-15) | capcut.com/clause/terms-of-service |
| Thai transcription · .srt export | capcut.com/th-th/tools/video-to-text · capcut.com/th-th/tools/add-subtitles-to-video · the English page capcut.com/tools/auto-caption-generator does not state languages |
| DaVinci Resolve 21 free vs Studio · prices | blackmagicdesign.com/products/davinciresolve and the /studio page · commercial use of the free version: a search found a 2020 Blackmagic forum thread where staff answered that it is allowed, but the original could not be opened (403), so it is not yet checked |
| Generating subtitles from audio in Resolve | secondary sources (cined.com and a subtitle-tool maker's blog), not yet checked against the official manual |
| HyperFrames: Apache-2.0 (Copyright 2026 HeyGen, Inc.) · Node.js 22+ · FFmpeg · commands | github.com/heygen-com/hyperframes (LICENSE · README) |
| Remotion: free-use criteria · Company License · prices · render command · Composition props | github.com/remotion-dev/remotion/blob/main/LICENSE.md · remotion.pro/license · remotion.dev/docs/cli/render · remotion.dev/docs/composition |
| OFL fonts | github.com/google/fonts/tree/main/ofl (sarabun · kanit · notosansthai) · openfontlicense.org/ofl-faq |
| YouTube accepts .srt files | support.google.com/youtube/answer/2734698 |


## reference: shot-list-template.md

# Shot list and caption templates

## Script header

```markdown
# Clip — <campaign>-<id> (v<NN>)

Platform: <tt / ig reel / yt short / fb reel> · Canvas: 1080 × 1920 · Length: <s> · frames per second (fps): 30
Message (one sentence): <...>
Hook pattern: <show result / call out / problem / number / before-after / question>
One call to action (CTA): <...>
Style lock: <sheet + version> · Music: <track + licence source>
```

## Shot list

| # | Start–end (s) | Duration | Visual (what we see) | Camera / motion | On-screen text (TH) | Counted chars | Min s (÷17 captions · ÷12 marketing text) | Voice-over / sound | Source (AI / shoot / stock) | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0–3 | 3 | | | | | | | | |
| 2 | | | | | | | | | | |
| 3 | | | | | | | | | | |
| 4 | | | | | | | | | | |

Counted chars = Thai base characters (tone marks and above/below vowels not counted) plus spaces, digits and symbols. Captions that follow the voice-over: seconds = chars ÷ 17. On-screen marketing text: chars ÷ 12, min 1.5 s, offers ≥ 2.5 s.

## Per-shot brief (AI video tool)

```markdown
### Shot <n>
Subject:
Motion (what moves, speed):
Camera: static / pan left / push-in / orbit / handheld
Duration: <s> · Aspect ratio: 9:16
First frame:
Last frame (must match next shot's first frame):
Style block: <paste from style lock>
Negatives: text, logos, warped hands, extra objects, flicker
```

## Phone shoot notes

- Shoot vertical 1080 × 1920 or 4K vertical, 30 fps, lock exposure and focus on the product
- 3 takes per shot; 1 s of stillness before and after each take for clean cuts
- Natural window light from one side matches most style locks; turn off mixed-colour room lights
- Record room tone 10 s for audio clean-up

## SubRip Text (SRT) caption file example

```
1
00:00:00,000 --> 00:00:02,500
ร้อนแบบนี้ ต้องมัทฉะเย็น

2
00:00:05,000 --> 00:00:09,000
ซื้อ 1 แถม 1 · 1–12 เม.ย.

3
00:00:09,000 --> 00:00:12,000
แอด LINE @matcha26 รับโค้ด
```

Save as UTF-8 so Thai characters survive upload.

## Pre-publish checklist

- [ ] Frame 1 has movement or text — no logo intro
- [ ] Offer and CTA readable with sound off
- [ ] Every caption inside the safe zone and ≤ 17 chars/s
- [ ] Prices, dates, ID match the campaign card
- [ ] Music licence recorded
- [ ] Thumbnail / cover frame chosen and readable at small size


## reference: sources.md

# Sources · video-script-to-clip

ตรวจล่าสุด 2026-10-06 · แหล่ง (caption and on-screen text rules): https://partnerhelp.netflixstudios.com/hc/en-us/articles/220448308 (Thai Timed Text Style Guide) · https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617 (durations) · Meta safe zone: https://www.facebook.com/business/ads-guide/update/image/instagram-story
