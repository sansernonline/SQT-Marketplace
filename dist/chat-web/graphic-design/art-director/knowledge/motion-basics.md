# skill: motion-basics

Use when a non-designer makes motion graphics, animated text, transitions or a moving logo.

# Motion Basics

Motion is emphasis. Everything else is decoration. Most amateur motion has 3 faults: linear easing, everything moving at once, and text that leaves before anyone could read it.

## Workflow

0. **ค้นต้นแบบก่อน:** เอาคำของโปรเจกต์ไปค้นสดตาม `design-references` (plugin `superuser`) ประเภท `motion` แล้วถอดสีจากงานที่เลือก · คลังสีที่เก็บไว้ใช้เมื่อค้นสดไม่ได้
1. **Name the purpose** of each movement — reveal, connect, emphasise, transition. No purpose, no motion. A background must carry meaning too: on the AI4BA site, 1 dot = 1 registered person, the path = the agenda, and the camera flies to the item you hover. A background that only decorates is cut
2. **Pick 1 entrance and 1 exit style** for the whole piece (e.g. fade-up in, fade out)
3. **Set durations** from the timing table
4. **Set easing** from the easing table — never linear for objects
5. **Stagger** groups: 40–80 ms between items, not all at once
6. **Hold text** long enough to read (text timing below)
7. **Review** at 1× with sound off, then on a phone. Cut anything that does not help the message

## Timing

| Movement | Duration |
|---|---|
| Small UI-like change (button, icon, highlight) | 100–200 ms |
| Element entering or leaving (text line, card, badge) | 200–300 ms |
| Large move across the frame, panel slide | 300–500 ms |
| Scene transition, logo reveal | 500–1000 ms, only for deliberate pacing |
| Stagger between items in a group | 40–80 ms |
| Hold before the next beat starts | ≥ 300 ms of stillness |

Exits are about 20–30% shorter than entrances — the viewer already knows what is leaving.

## Easing

| Name | Curve (CSS) | Use |
|---|---|---|
| linear | `linear` | Only colour fades, rotating loaders, scrolling tickers |
| ease | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Generic default, slightly better than linear |
| ease-in | `cubic-bezier(0.42, 0, 1, 1)` | **Exits** — starts slow, leaves fast |
| ease-out | `cubic-bezier(0, 0, 0.58, 1)` | **Entrances** — arrives fast, settles gently |
| ease-in-out | `cubic-bezier(0.42, 0, 0.58, 1)` | Moving from one place to another on screen |
| Material 3 "standard" | `cubic-bezier(0.2, 0, 0, 1)` | Crisp modern ease for most moves |
| Overshoot / back | e.g. `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful brands only; once per piece |

ตรวจล่าสุด 2026-10-06 · แหล่ง: CSS Easing Functions Level 1 https://www.w3.org/TR/css-easing-1/

### Material 3 tokens (copy the values, keep the names)

| Token | Value | Use |
|---|---|---|
| `easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most moves inside the frame |
| `easing-standard-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Entrances |
| `easing-standard-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Exits |
| `easing-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Hero entrance, 1 per piece |
| `easing-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Hero exit |
| `easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Same curve as standard in the CSS token; the real emphasized curve is a 2-part path that CSS cannot express |

Durations: `short1–4` 50 · 100 · 150 · 200 ms · `medium1–4` 250 · 300 · 350 · 400 ms · `long1–4` 450 · 500 · 550 · 600 ms · `extra-long1–4` 700 · 800 · 900 · 1000 ms. Our timing table above sits inside these bands (small change = short, enter/leave = medium, transition = long or extra-long).

ตรวจล่าสุด 2026-10-23 · แหล่ง: material-web, file `tokens/versions/v0_192/_md-sys-motion.scss` (Apache-2.0, Google LLC) https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss

In After Effects, CapCut, Canva or Premiere: "ease-out" = ease in on the *arriving* keyframe ("Easy Ease In" in After Effects); when unsure, use the app's "ease out" preset for entrances.

## The 12 principles, condensed for marketing motion

From Disney animators Frank Thomas and Ollie Johnston, *The Illusion of Life* (1981). Full table: [twelve-principles.md](references/twelve-principles.md).

| Use often | Use sometimes | Mostly for character animation |
|---|---|---|
| Slow in and slow out (easing) · Timing · Staging (one thing at a time) · Anticipation (small pull back before a move) · Follow-through (settle after stop) | Arcs · Secondary action · Exaggeration · Squash and stretch (for bouncy brands) | Straight-ahead vs pose-to-pose · Solid drawing · Appeal |

## On-screen text timing

| Text | Minimum on screen |
|---|---|
| Thai subtitles (Netflix rule) | Reading speed ≤ 17 characters per second for adults; each subtitle stays 5/6 s to 7 s |
| Short headline (≤ 5 words / ≤ 25 Thai characters) | 1.5–2 s after it finishes animating in |
| Offer or price | ≥ 2.5 s, and repeated at the end |
| Legal or terms line | ≥ 3 s, or put it in the caption |

Thai character counts exclude tone marks and above/below vowels (Netflix Thai guide). House rule for marketing text, which is read while also watching: seconds = characters ÷ 12, minimum 1.5 s.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://partnerhelp.netflixstudios.com/hc/en-us/articles/220448308 · https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617

**Worked example:** "ซื้อ 1 แถม 1 ถึง 15 เม.ย." — 16 counted characters plus 6 spaces = 22 → 22 ÷ 12 ≈ 1.8 s → hold 2.5 s because it is the offer.

## Common fixes

| Amateur | Fix |
|---|---|
| Letters popping in one by one | Fade-up the whole line, 250 ms ease-out, 8–16 px rise |
| Every element bounces | 1 bounce for the hero item. The rest fade |
| Spinning or zooming logo | Hold the logo still 1.5 s; animate a mask or underline instead |
| Different transition between every scene | 1 cut style. Save 1 special transition for the reveal |
| Text appears and leaves in 0.8 s | Use the text timing table |
| Motion over the platform UI area | Keep animated text inside the safe zone (`social-formats`) |

## Export as a GIF or WebM

Use when the destination wants a small moving file (email, chat, a web page) instead of a video post. Two passes for GIF, because one pass uses a fixed palette and bands badly. Commands run on ffmpeg 9.0.2 (tested 2026-10-28 on a 2 s test clip: GIF 246 KB at 480 px wide, 12 fps; WebM 21 KB):

```bash
ffmpeg -i in.mp4 -vf "fps=12,scale=480:-1:flags=lanczos,palettegen" pal.png
ffmpeg -i in.mp4 -i pal.png -lavfi "fps=12,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" out.gif
ffmpeg -i in.mp4 -c:v libvpx-vp9 -b:v 0 -crf 33 -an out.webm      # WebM (VP9), no sound
```

- The file size grows with width, fps and length: lower fps (10–12) and width first, trim the clip second, cut colours last · default values here are untested starting points
- GIF has no sound and only 256 colours per frame; a gradient or photo looks worse than the same clip as WebM or MP4. Offer MP4 or WebM first where the destination plays video
- Never overwrite the source; name the output with the version (`name-v02.gif`)
- Size ceilings per destination (email, chat apps, Shopee and others): (รอยืนยัน) not checked against an official page yet. Open the destination's own help page before promising a size, and record the date

## Rules

- Motion must survive muting and 2× speed — if the meaning dies without it, it was decoration
- Only 1 main element moves at a time. Others stay still or move less
- Fast flashing: avoid more than 3 flashes per second (Web Content Accessibility Guidelines (WCAG) 2.3.1) — it can trigger seizures
- When in doubt, remove half the moving elements, and make the rest about a third shorter

## Not an AI look

Before handing over, run the check in `no-ai-look` (section 3): its script on HTML/CSS, the 8-point eye check on images and other files. The full list of AI tells for every medium lives there.

## Related

- `video-script-to-clip` — beats and captions for whole clips
- `style-consistency` — 1 motion style across a campaign


## reference: twelve-principles.md

# The 12 principles of animation — for marketing motion

Source: Frank Thomas and Ollie Johnston, *The Illusion of Life: Disney Animation* (1981).

| # | Principle | Meaning | In a social video or motion graphic |
|---|---|---|---|
| 1 | Squash and stretch | Objects deform to show weight and speed | A product box squashes slightly on landing — playful brands only |
| 2 | Anticipation | A small opposite move before the main move | Button shrinks 5% before popping; text dips before rising |
| 3 | Staging | Present 1 idea clearly at a time | 1 element moves while others hold; dim the rest |
| 4 | Straight-ahead and pose-to-pose | Draw frame by frame vs. key poses with in-betweens | Use keyframes (pose-to-pose) — it is what every editor does |
| 5 | Follow-through and overlapping action | Parts keep moving after the main body stops | A card stops, its shadow settles 60 ms later; hair or ribbon trails |
| 6 | Slow in and slow out | Acceleration and deceleration | Easing — the single biggest quality jump |
| 7 | Arcs | Natural movement follows curves | Move items along a gentle curve rather than a straight diagonal |
| 8 | Secondary action | A smaller action supports the main one | Steam rises while the cup slides in |
| 9 | Timing | Number of frames gives weight and mood | Heavy = slower; light = faster; see the timing table in SKILL.md |
| 10 | Exaggeration | Push beyond realism for clarity | Price scales to 110% then settles to 100% |
| 11 | Solid drawing | Form, weight, volume in 3D | Keep perspective consistent in 3D product spins |
| 12 | Appeal | Charisma, pleasing design | Clean shapes, a clear focal point, brand character |

## Frame maths

| frames per second (fps) | 1 frame | 250 ms | 500 ms |
|---|---|---|---|
| 24 | 41.7 ms | 6 frames | 12 frames |
| 25 | 40 ms | 6–7 frames | 12–13 frames |
| 30 | 33.3 ms | 7–8 frames | 15 frames |
| 60 | 16.7 ms | 15 frames | 30 frames |

Social video is usually 30 fps (25 fps is common for Thai broadcast, which uses the PAL-based 50 Hz system). Keep 1 frame rate per project.
