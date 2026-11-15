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
