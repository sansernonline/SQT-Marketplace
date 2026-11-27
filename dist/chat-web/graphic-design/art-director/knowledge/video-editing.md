# skill: video-editing

Use when editing video or audio with ffmpeg, Thai subtitles or motion

# video-editing — cut, join, adjust audio, and export video

> **One rule:** every edit to a file ends with measuring the resulting file (length from `ffprobe` · loudness from the second pass of `loudnorm` · the picture at the cut point), not believing that a command that ran without error gave the right result.

## Use when
- Trimming head and tail, cutting a wrong take, or cutting long silences
- Joining several clips into one file
- Adjusting loudness to a platform's value (podcast · YouTube · training clip)
- Converting 16:9 to 9:16 · pulling a cover image · exporting MP4 that opens anywhere
- Joining HTML slides from `html-slide-deck` with narration into one video (section "สไลด์กับเสียงบรรยายเป็นวิดีโอ")

Not for: hook · script · shot list → `video-script` · Thai subtitles → [`references/subtitles.md`](references/subtitles.md) · Thai narration from a script, no recording → `narration-th` · colour correction, multi-track cutting by eye, effects, motion inside a slide, or batch clips from code → a person in DaVinci Resolve or CapCut, or HyperFrames or Remotion (`video-script` `references/production-tools.md` item 1; the agent writes the checklist). The agent for this job is `video-editor`.

## Steps
0. **Check the machine.** `ffmpeg -version`. If missing, installing on the whole machine goes under "รออนุมัติ". The subtitle filter needs libass (`--enable-libass` in the configuration line).
1. **Look at the file first.** `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact in.mp4`. Keep the original; always give the output a new name (`brand-kit`).
2. **Cut a range.** A frame-accurate cut must re-encode: `ffmpeg -ss 00:01:30 -i in.mp4 -t 40 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k out.mp4`. `-c copy` is faster but the cut shifts to the nearest keyframe (asked 7 seconds, got 7.13); use it when speed matters more, and tell the user it may drift.
3. **Join clips.** If all files share codec, size and fps, use the concat demuxer: a `list.txt` with one `file 'a.mp4'` per line, then `ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4`. Otherwise re-encode every file to match first (step 2 without `-ss`), then join.
4. **Cut silences.** Measure first: `ffmpeg -i in.wav -af volumedetect -f null -`. Then `python scripts/silences.py in.mp4` shows the silent ranges and the time that will remain. When satisfied, add `-o tight.mp4`. If the output exists the script refuses and offers a new name (`tight-v02.mp4`); add `--force` only when the user orders an overwrite (same rule in `loudnorm2.py` and `slides_to_video.py`). Set `--noise` lower than the quietest speech but higher than the room's noise floor (script default -35 dB); other flags in `references/ffmpeg-recipes.md`. Cut a wrong take by hand at the times the user noted; do not guess from silence.
5. **Adjust loudness.** `python scripts/loudnorm2.py in.wav out.wav --target <LUFS> --tp <dBTP>` (video file: picture copied, audio re-encoded). The first pass measures, the second feeds the values back. Read the `Normalization Type` line:
   - `Linear`: the whole file moves by the same amount.
   - `Dynamic`: ffmpeg squeezes loud and quiet parts. It happens when LRA (loudness range) is over `--lra` or 0, or when the 4 `measured_*` values are not all supplied. For Linear, raise `--lra`, or accept Dynamic and listen to the loudest part. Tell the user which one it was.
   - Dynamic mode works at 192 kHz, so the output `-ar` must be set (the script sets 48000). ffmpeg's defaults (I -24 · LRA 7 · TP -2) are no platform's values, so you must supply the target.
   - **Target:** look it up live for the destination (Apple Podcasts · Spotify · YouTube · TikTok · ACX · EBU R 128); if the page will not open, mark the value (รอยืนยัน). If the destination publishes none, use -16 LUFS · -1.5 dBTP and tell the user it is your chosen value. For one file published in several places, use the main channel's loudness and the lowest true-peak ceiling. Details in `references/loudness-and-slides.md`.
6. **Change aspect ratio** (landscape to 1080×1920): crop the center, or keep the full picture on a blurred background. Filter strings in `references/ffmpeg-recipes.md`. Keep text and subtitles inside the platform's safe zone (`campaign-set`).
7. **Cover image.** `ffmpeg -ss 00:00:03 -i in.mp4 -frames:v 1 -q:v 2 thumb.jpg`
8. **Export.** H.264 with AAC · `-pix_fmt yuv420p` · `-movflags +faststart` · size and fps per `production-tools.md` item 3.
9. **Measure the result.** Length: `ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 out.mp4`. Loudness: `python scripts/loudnorm2.py out.mp4 --measure`. Pull the picture at the cut point and look at it. Then have the user listen to the part that was cut.

## สไลด์กับเสียงบรรยายเป็นวิดีโอ (Slides with narration as video)
Every slide's time comes from `data-at` in the deck, in one place. Then prove from the result that the video is as long as the audio and the picture at sampled times is the right slide.
1. **Set times in the deck.** Every `<section class="slide">` has `data-at="m:ss"`, the time the slide is reached (same meaning as the presenter clock of `html-slide-deck`). Take times from the finished, cut audio, not estimates. Audio from `narration-th` already has `data_at` per slide in `cues.json`.
2. **Finish the audio first.** Cut and adjust loudness (steps 4–5) before setting `data-at`, because cutting later shifts every slide.
3. **Make an image per slide.** `python <html-slide-deck>/scripts/check_deck.py deck.html --out frames` gives `p01.png …` at 1920×1080 (needs Playwright and Pillow). For animated slides add `--wait`. A content-file deck goes through `build_deck.py` first.
4. **Check the timetable, then build.** `python scripts/slides_to_video.py deck.html frames narration.wav --check`. It stops with a reason when `data-at` does not increase · the number of images differs from slides · the last slide starts after the audio ends. When it passes, drop `--check` and add `-o episode.mp4` (H.264 with AAC at 30 fps, exactly as long as the audio).
5. **Check the file.** Lengths from `ffprobe` · open the start of slides at 3 points · listen to confirm it is the real narration · add subtitles next per [`references/subtitles.md`](references/subtitles.md).

## Check before done
- New machine or edited script: `python scripts/<name>.py --self-test` of `silences` · `loudnorm2` · `slides_to_video` · `outguard` passes (without ffmpeg it skips real-file parts and says so).
- The original is still there · the output has a new name · the commands used are written down so they can be rerun.
- The `ffprobe` length matches the intent (picture and audio differ by at most 0.1 second).
- Overall loudness is within 1 LU of the target, true peak is not over the ceiling, and the reply says Linear or Dynamic.
- Pulled the picture at 1 cut point or more and looked at it · told the user which minute to listen to.
- Video from slides: opened the start of slides at 3 points or more and the picture matches.
- Music, footage and fonts have a license for that channel (`production-tools.md` items 2 and 5).

## Thai subtitles and motion graphics (absorbed skills)
Open the full body in `references/` before doing either job; the hard rules are:

**Thai subtitles** (`references/subtitles.md`)
- Tool output is only a draft: fix names, brands, prices and numbers by hand, make `python scripts/srt_check.py file.srt` pass, then pull a burned-in frame and look at the tone marks.
- Per line at most 35 characters (tone marks and upper/lower vowels not counted) and 2 lines · at most 17 characters per second · each subtitle on screen 5/6 s to 7 s · no full stop at the end · `…` as one character · UTF-8 file.
- Burn in with `shaping=complex` and a Thai font (default IBM Plex Sans Thai, not Noto Sans Thai when English words appear) · never `Alignment=5` · keep portrait subtitles inside the platform safe zone.

**Motion graphics** (`references/motion.md`)
- Run the pre-work gate (brief, owner theme, live references, 3 directions, `design-gate/no-ai-look`) and close with a `ด่านก่อนลงมือ:` line.
- Every movement needs a purpose (reveal · connect · emphasise · transition) · only 1 main element moves at a time · never linear easing for objects · stagger groups 40–80 ms.
- Motion must survive mute and 2× speed · no more than 3 flashes per second · text stays long enough to read (characters ÷ 12, minimum 1.5 s, offers at least 2.5 s).
- Small moving files (GIF · WebM): `references/motion-export-gif-webm.md`, checked with `python scripts/gif_check.py`.

## Parts
| File | Open when |
|---|---|
| [`references/subtitles.md`](references/subtitles.md) | Thai subtitles as `.srt` or burned in (full steps and checks) |
| [`references/subtitles-transcription.md`](references/subtitles-transcription.md) | Choosing a transcription tool and getting the `.srt` command |
| [`references/subtitles-burn-in.md`](references/subtitles-burn-in.md) | Sizing or positioning burned-in subtitles; measured numbers and a worked example |
| [`references/sources-subtitles.md`](references/sources-subtitles.md) | Subtitle sources and check dates |
| [`references/motion.md`](references/motion.md) | Motion graphics: purpose · timing · easing · text timing · common fixes |
| [`references/motion-material-3-tokens.md`](references/motion-material-3-tokens.md) | Material 3 easing and duration tokens |
| [`references/motion-twelve-principles.md`](references/motion-twelve-principles.md) | Full table of the 12 animation principles |
| [`references/motion-export-gif-webm.md`](references/motion-export-gif-webm.md) | Exporting a small GIF or WebM and checking it |
| [`references/sources-motion.md`](references/sources-motion.md) | Motion sources and check dates |

## References
- [`references/loudness-and-slides.md`](references/loudness-and-slides.md) — open when picking a platform loudness target, when `slides_to_video.py` misbehaves, or to see the measured results
- [`references/ffmpeg-recipes.md`](references/ffmpeg-recipes.md) — open when changing aspect ratio (filter strings) or tuning `silences.py` flags
- [`references/sources.md`](references/sources.md) — open when re-checking ffmpeg or platform loudness sources and their check dates


## reference: ffmpeg-recipes.md

# ffmpeg recipes · video-editing

Open this when changing aspect ratio or tuning the silence-cutting flags.

## Landscape to portrait 1080×1920

Crop the center of the picture:

```
-vf "crop=ih*9/16:ih,scale=1080:1920"
```

Keep the full picture on a blurred background:

```
-filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" -map "[v]" -map 0:a
```

## `silences.py` flags

- `--noise`: lower than the quietest speech but higher than the room's noise floor. The script default is -35 dB; ffmpeg's own default of -60 dB is too strict for an ordinary recording room.
- `--min`: the shortest silence to cut (script 0.7 second; ffmpeg 2 seconds).
- `--pad`: margin left around speech (0.15 second) so the first and last syllables are not clipped.


## reference: loudness-and-slides.md

# Loudness targets, slide-video traps, test record

Open this when choosing a loudness target for a platform, when `slides_to_video.py` misbehaves, or when you need the measured results behind the defaults.

## ค่าความดังต่อแพลตฟอร์ม (Loudness targets per platform)

Loudness targets change and differ per destination, so this skill stores none. Destinations to look up: Apple Podcasts · Spotify (music, podcast, podcast ads) · YouTube · TikTok · Audible (ACX) · broadcast (EBU R 128). For each one find the integrated loudness target, the true peak ceiling, and whether the platform publishes a figure at all. Some platforms publish nothing, and secondary sources quote numbers the platform never wrote, so say which kind each value is. ACX uses dB RMS, a different unit from LUFS.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Official sources: the platform's own help or specification pages (Apple Podcasts Connect · Spotify for Artists loudness page · ACX audio submission requirements · EBU R 128).

For a destination that does not publish a value, use -16 LUFS · -1.5 dBTP (the default of `loudnorm2.py`) because it is within Apple's range (อนุมาน · compared with Apple's live-searched value) and not so loud that it gets turned down (อนุมาน), and tell the user it is a value you chose. For publishing in several places with one file, set the loudness for the main channel and use the lowest true-peak ceiling of all the channels.

## Slides with narration: traps the script already handles

| Trap | Cause | What the script already does |
|---|---|---|
| The last slide shows only briefly | The concat demuxer does not use the last image's `duration` unless that file name is repeated on one more line at the end of the list (ffmpeg wiki Slideshow) | Repeats the last image |
| The video is longer than the audio | `-shortest` alone leaves trailing picture when there is a filter (tested 2026-10-24: got 181.67 seconds from 180 seconds of audio) | Uses `-t` equal to the audio length |
| ffmpeg will not open the image list | Full paths in the list file need `-safe 0` | Already added |

Tested 2026-10-24 with a sample deck of 13 slides from `html-slide-deck` and 180 seconds of audio: picture and audio were both 180.00 seconds · sampling 7 times, the picture matched the slide at every point · given audio that was too short (75 seconds), the script stopped because the last slide starts at 165 seconds.

## Real example (cut silences and loudness)

- **Task:** 11 seconds of audio with 2 silent ranges (2 and 1 seconds) in a video file, and audio with uneven loudness to adjust to -16 LUFS
- **What was done:** `silences.py gaps.mp4 -o tight.mp4` · `loudnorm2.py varied2.wav out.wav`
- **Result:** found silences at 3.00–5.00 and 8.00–9.00, as built · 8.60 seconds remained, as calculated (picture 8.60 · audio 8.62) · loudness came out at -15.6 LUFS as Linear · for the video file `--target -14` gave -14.0 LUFS with the picture not re-encoded (ตรวจจริง 2026-10-24 · ffmpeg 9.0.2 on Windows)

## Self-test record

`python scripts/<name>.py --self-test` of `silences` · `loudnorm2` · `slides_to_video` · `outguard` (the overwrite guard shared by the first 3 · `tts_cues` moved to `narration-th` on 2026-10-28). Without ffmpeg it skips the parts that measure real files and says it skipped. Tested 2026-10-26 with ffmpeg 9.0.2: all 4 passed · 2026-10-28: all 5 passed after adding the overwrite guard, counting `tts_cues` before the split.

Measured facts behind the loudness step (tested 2026-10-24): LRA 5.9 gave Linear · LRA 11.9 and 0 gave Dynamic. A frame-accurate cut with `-c copy` asked for 7 seconds and got 7.13.


## reference: motion-export-gif-webm.md

# Export as a GIF or WebM · video-editing

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
- Check the result: `python scripts/gif_check.py out.gif --max-mb <n> --max-width <px> --max-seconds <s> --max-fps <n>` prints width × height, MB, frames, fps, seconds and loops, and lists what is over the ceilings you pass · it hard-codes no ceiling, so open the destination's help page and pass the numbers · `.webm` and `.mp4` need `ffprobe` on the PATH · `--self-test` runs it on files it builds itself (tested 2026-11-10, 14 of 14)


## reference: motion-material-3-tokens.md

# Material 3 motion tokens · video-editing

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


## reference: motion-twelve-principles.md

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


## reference: motion.md


# Motion Basics

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Motion is emphasis. Everything else is decoration. Most amateur motion has 3 faults: linear easing, everything moving at once, and text that leaves before anyone could read it.

**Contents:** Workflow · Timing · Easing · The 12 principles · On-screen text timing · Common fixes · Export as a GIF or WebM · Rules · Not an AI look

## Workflow

0. **Search for references first:** take the project's keywords and search live per `design-gate/design-references` (plugin `superuser`) type `motion`, then pull colours from the chosen work · use the stored palette library when a live search is not possible
1. **Name the purpose** of each movement — reveal, connect, emphasise, transition. No purpose, no motion. A background must carry meaning too. A background that only decorates is cut
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

Material 3 tokens (copy the values, keep the names) and the source line → [`references/motion-material-3-tokens.md`](motion-material-3-tokens.md). The standard curve above is the one to use for most moves.

In After Effects, CapCut, Canva or Premiere: "ease-out" = ease in on the *arriving* keyframe ("Easy Ease In" in After Effects); when unsure, use the app's "ease out" preset for entrances.

## The 12 principles, condensed for marketing motion

Full table: [motion-twelve-principles.md](motion-twelve-principles.md).

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

**Worked example:** "ซื้อ 1 แถม 1 ถึง 15 เม.ย." — 16 counted characters plus 6 spaces = 22 → 22 ÷ 12 ≈ 1.8 s → hold 2.5 s because it is the offer.

## Common fixes

| Amateur | Fix |
|---|---|
| Letters popping in one by one | Fade-up the whole line, 250 ms ease-out, 8–16 px rise |
| Every element bounces | 1 bounce for the hero item. The rest fade |
| Spinning or zooming logo | Hold the logo still 1.5 s; animate a mask or underline instead |
| Different transition between every scene | 1 cut style. Save 1 special transition for the reveal |
| Text appears and leaves in 0.8 s | Use the text timing table |
| Motion over the platform UI area | Keep animated text inside the safe zone (`campaign-set`) |

## Export as a GIF or WebM

When the destination wants a small moving file (email, chat, a web page) instead of a video post, open [`references/motion-export-gif-webm.md`](motion-export-gif-webm.md) for the ffmpeg commands, size rules and the `scripts/gif_check.py` check. Never overwrite the source; name the output with the version (`name-v02.gif`). Size ceilings per destination are (รอยืนยัน) until you open the destination's own help page.

## Rules

- Motion must survive muting and 2× speed — if the meaning dies without it, it was decoration
- Only 1 main element moves at a time. Others stay still or move less
- Fast flashing: avoid more than 3 flashes per second (Web Content Accessibility Guidelines (WCAG) 2.3.1) — it can trigger seizures
- When in doubt, remove half the moving elements, and make the rest about a third shorter

## Not an AI look

Before handing over, run the check in `design-gate/no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## References

- [`references/motion-twelve-principles.md`](motion-twelve-principles.md) — full table of the 12 principles
- [`references/motion-material-3-tokens.md`](motion-material-3-tokens.md) — open when you need Material 3 easing and duration tokens
- [`references/motion-export-gif-webm.md`](motion-export-gif-webm.md) — open when the destination wants a small moving file (GIF or WebM)
- [`references/sources-motion.md`](sources-motion.md) — sources and check dates
- Related: `video-script` (beats and captions for whole clips) · `brand-kit` (1 motion style across a campaign)


## reference: sources-motion.md

# Sources · video-editing

## On-screen text timing

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://partnerhelp.netflixstudios.com/hc/en-us/articles/220448308 · https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617

## Easing

ตรวจล่าสุด 2026-10-06 · แหล่ง: CSS Easing Functions Level 1 https://www.w3.org/TR/css-easing-1/


## reference: sources-subtitles.md

# Sources · video-editing

- The Caption and on-screen text rules table in `video-script` (Netflix Thai Timed Text Style Guide · Meta safe zone · checked by that skill 2026-10-06)
- `production-tools.md` items 3–4 (YouTube accepts UTF-8 SubRip · OFL fonts · checked 2026-10-23)
- ffmpeg Filters Documentation: [subtitles](https://ffmpeg.org/ffmpeg-filters.html#subtitles) (`fontsdir` · `force_style` · `shaping` · needs libass) · [escaping in a filtergraph](https://ffmpeg.org/ffmpeg-filters.html#Notes-on-filtergraph-escaping) · UTF-8 reading and BOM skipping from the source `libavformat/subtitles.c` version n9.0.2 · libass needs HarfBuzz since 0.15.0 ([Changelog](https://github.com/libass/libass/blob/master/Changelog)) (seen 2026-10-24)
- [YouTube supported subtitle and closed caption files](https://support.google.com/youtube/answer/2734698) (SRT must be pure UTF-8 with no styles · seen 2026-10-24)
- Transcription tools: [openai/whisper](https://github.com/openai/whisper) (MIT · model sizes · Thai figures) · [whisper.cpp](https://github.com/ggml-org/whisper.cpp) (MIT · `-osrt` · 16-bit WAV) · [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (MIT) · [biodatlab/whisper-th-large-v3-combined](https://huggingface.co/biodatlab/whisper-th-large-v3-combined) · [nectec/Pathumma-whisper-th-large-v3](https://huggingface.co/nectec/Pathumma-whisper-th-large-v3) · [typhoon-ai/typhoon-whisper-large-v3](https://huggingface.co/typhoon-ai/typhoon-whisper-large-v3) (seen 2026-10-24 · not downloaded or run)
- This skill's test results: the "Real example" in `burn-in-details.md` (run on self-made test files 2026-10-24 · ffmpeg 9.0.2 on Windows)


## reference: sources.md

# Sources · video-editing

- ffmpeg Filters Documentation: [loudnorm](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) (defaults · 2 passes · `linear` needs all `measured_*` · works at 192 kHz) · [silencedetect](https://ffmpeg.org/ffmpeg-filters.html#silencedetect) · the JSON key names `input_*` come from the source `libavfilter/af_loudnorm.c` version n9.0.2, while feeding the values back as `measured_*` is a common method that the docs do not give an example of (seen 2026-10-24)
- ffmpeg Formats Documentation: [concat demuxer](https://ffmpeg.org/ffmpeg-formats.html#concat) (`file` · `duration` · `-safe 0` for full paths · every file must have the same codec) · ffmpeg Wiki [Slideshow](https://trac.ffmpeg.org/wiki/Slideshow#Concatdemuxer) (the last image must be repeated without `duration`) (seen 2026-10-24)
- `html-slide-deck` `assets/shell.html`: `data-at="m:ss"` is the time the slide should be reached · `scripts/check_deck.py` captures images at 1920×1080 (read 2026-10-24)
- Loudness values: [Apple Podcasts audio requirements](https://podcasters.apple.com/support/893-audio-requirements) · [Spotify loudness normalization](https://support.spotify.com/us/artists/article/loudness-normalization/) · [Spotify audio ad specs](https://ads.spotify.com/en-US/ad-specs/audio-ad-specs/) · [YouTube stable volume](https://support.google.com/youtube/answer/14106294) · [ACX audio submission requirements](https://help.acx.com/s/article/acx-audio-submission-requirements) · [EBU R 128](https://tech.ebu.ch/docs/r/r128.pdf) (viewed every page 2026-10-24)
- This skill's test results: `references/loudness-and-slides.md` "Real example" (run on self-made test files 2026-10-24 · ffmpeg 9.0.2 on Windows)


## reference: subtitles-burn-in.md

# Burn-in details · font, size units, position

Open at step 5 when burning in. Test results dated 2026-10-24 and 2026-10-26.

- `shaping=complex`: the ffmpeg 9.0 docs say it is required for Thai script (tested 2026-10-24: `simple` made the tone mark ไม้จัตวา in "เตี๋ยว" overlap the vowel อี · `complex` and the default `auto` placed it correctly on this machine) · ffmpeg must be built with libass that has HarfBuzz
- **The default font is IBM Plex Sans Thai** (OFL in google/fonts), which has both Thai and Latin letters in one family, with matching sizes (Latin to Thai 0.93) · the user chose it from a 7-font comparison image on 2026-10-26 · **do not use Noto Sans Thai for subtitles that contain English words,** because the notofonts file set (version 2.002 installed on this machine) has no Latin letters at all, so English words fall back to a fallback font about 1.3 times larger (checked the glyph table in the file and measured from an image 2026-10-26) · the set on Google Fonts has Latin letters, but you cannot tell from the font name which set the machine has, so neither set is used · other options with matching size: Anuphan · Sarabun · the font must have a clear license (`production-tools.md` item 4) · if the machine lacks the font → have the user install it from Google Fonts themselves, then point `fontsdir` at it
- `FontName` is the font family name, not the file name · `fontsdir` points to the folder that has the font files
- Windows: a path in the filter must escape the drive's `:` character, for example `fontsdir='C\:/Users/<ชื่อ>/AppData/Local/Microsoft/Windows/Fonts'`, and run the command in the same folder as the `.srt` file so you can use a bare file name
- `FontSize` and `MarginV` are not directly px of the image · the filter reads `.srt` as a script 288 units tall, so the real distance is about value × image height ÷ 288 (tested 2026-10-24: on an image 1920 tall `MarginV` 40 → the subtitle sits 310 px from the bottom edge · 150 → 1044 px · Noto Sans Thai FontSize 22 gave consonants ก ข ค ง 31 px tall on a 1080-tall image and 55 px on a 1920-tall image · in the font comparison round of 2026-10-26, re-measured at FontSize 22 on a 1080-tall image: Noto Sans Thai 29 px · IBM Plex Sans Thai 27 px, slightly smaller, and to get the same size try FontSize 24, which is calculated from the ratio and not yet measured) pull a frame, measure, and adjust to reach the size set by the rules in the caption table of `video-script`
- Position by aspect ratio: landscape 16:9 (YouTube · tutorial clips) place at bottom center, `MarginV=40` puts the subtitle about 16% above the bottom edge · portrait 9:16 (TikTok · Reels · Shorts) the subtitle must clear the bottom part per the safe-zone rules (look up live from the platform's guide), and `MarginV=100` puts the subtitle 37% above the bottom edge (tested 2026-10-24 on a 1080×1920 image) · do not use `Alignment=5` to center it on screen, because this filter reads it as top-aligned (tested 2026-10-24: the subtitle landed at 6% from the top edge)

## Real example

- **Task:** burn 2 Thai subtitles with tone marks stacked on vowels into a 1920×1080 clip on Windows
- **What was done:** `srt_check.py` (found subtitle 2 reads at 18.4 characters per second, over 17) · burned in with Noto Sans Thai (test round 2026-10-24, before switching to IBM Plex Sans Thai) from the user's font folder · pulled a frame at second 4 and looked at it
- **Result:** "ผู้ใหญ่ใจดี น้ำแข็งใส ก๋วยเตี๋ยว" and "ติ๊กต่อก ฎีกา ฐาน" had tone marks and vowels in the right positions · the checker caught the excess speed exactly per the threshold (ตรวจจริง 2026-10-24 · ffmpeg 9.0.2 with libass)


## reference: subtitles-transcription.md

# Transcription options for Thai `.srt`

Open at step 2. Use one that runs locally for free first (data does not leave the machine). Installing packages and downloading models (the medium file is about 1.5 GB · large-v3 about 2.9 GB) goes under "รออนุมัติ" (awaiting approval). On the machine where this skill was written, none has actually been run yet.

| Option | License | How to get `.srt` | Thai |
|---|---|---|---|
| openai-whisper (Python) | MIT for both code and model | `whisper in.wav --model medium --language Thai --output_format srt --output_dir out` | large-v3 errs about 5.8% at character level (Common Voice 15) and 8.4% (FLEURS) per the developers |
| whisper.cpp | MIT | convert to 16-bit WAV first `ffmpeg -i in.mp3 -ar 16000 -ac 1 -c:a pcm_s16le in.wav` then `whisper-cli -m models/ggml-medium.bin -f in.wav -l th -osrt -of out` | The same model as Whisper · the default is English, so you must pass `-l th` and not use a model whose name ends in `.en` |
| faster-whisper | MIT | A library with no `.srt` writer, so you write it yourself from `segment.start` · `segment.end` · `segment.text` | Up to about 4 times faster than openai-whisper at the same accuracy, per the developers |
| Models tuned for Thai (biodatlab Mahidol University · NECTEC Pathumma · SCB 10X Typhoon) | apache-2.0 or mit · Typhoon has an added OpenTyphoon condition | These are `transformers` models with no `.srt` writer · to use with whisper.cpp or faster-whisper they must be converted first (not tested yet) | The developers report fewer errors than the original Whisper, but they were measured on different datasets and cannot be compared directly · some models say they were not made for timestamps |

The timing in subtitles from every tool must be rechecked in step 4. Every tool may add words that were not spoken (hallucination), per Whisper's own warning.


## reference: subtitles.md


# video-editing — Thai subtitles as a file: transcribe, check, then burn in or deliver the file

Line length, reading speed, and punctuation rules live in the Caption and on-screen text rules table in `video-script`; this skill makes the subtitle file follow that table.

> **One rule:** subtitles from any transcription tool are only a draft. Fix names of people, brand names, prices, and numbers by hand, make `srt_check.py` pass, and open the burned-in image to look at the tone marks, before saying done.

## Use when
- There is a clip or audio, and the user wants Thai subtitles as an `.srt` file or burned into the picture.
- Existing subtitles must be fixed so they can be read in time (long lines · too fast · 3 lines · a full stop closing the sentence).
- After burning in, Thai letters are squares or tone marks float in the wrong place.

Not for: on-screen text designed as graphics (headings · prices · promotions) → `video-script` · automatic subtitles in an editing app (CapCut · DaVinci Resolve) → `production-tools.md` item 1, then steps 4–6 here to check the result · cutting or joining audio first → the main steps in `../SKILL.md` · translating subtitles → `human-writing/translate-th-en`, then check the file with step 4.

## Steps
0. **Find an existing pattern first.** Check the brand fonts and colors (`brand-kit` · `doc-theme` · files the user gave), subtitles of earlier clips on the channel, and fonts on this video's graphics. If found, use that pattern and say which file's pattern you used; if not, use this skill's defaults and say no earlier pattern was found. Any chosen font must have Thai letters and a license that allows embedding in video; with no brand font, use IBM Plex Sans Thai.
1. **Use the final audio file.** Finish editing first, because cutting afterward shifts the time of the whole file.
2. **Transcribe to `.srt`.** Prefer a tool that runs locally for free (data stays on the machine). Installing packages or downloading models goes under "รออนุมัติ" (awaiting approval). Commands and the options table: [`references/subtitles-transcription.md`](subtitles-transcription.md).
3. **Fix words by hand:** names, brand names, technical terms, prices, numbers, and words that sound alike. If a script exists, compare cue by cue. Every tool may add words that were not spoken.
4. **Arrange lines and timing, then check.** `python scripts/srt_check.py ep01.srt` must pass:
   - At most 35 characters per line (not counting tone marks and upper and lower vowels) · at most 2 lines · break between words, not inside one.
   - At most 17 characters per second · on screen from 5/6 second (about 0.83) to 7 seconds · no overlap with the previous subtitle.
   - No full stop closing a sentence · no `?` or dashes in spoken lines · use the single character `…` for `...`.
   - The file is UTF-8 (YouTube needs pure UTF-8).
   - Over the speed: split into 2 subtitles at the speaking rhythm, or cut repeated words, without shrinking until the meaning changes.
5. **Burn in or deliver the file.** A separate file for YouTube: basic `.srt`, no styles (`production-tools.md` item 3). For burning into the picture (TikTok · Reels · clips watched with the sound off):
   `ffmpeg -i in.mp4 -vf "subtitles=ep01.srt:fontsdir='<โฟลเดอร์ฟอนต์>':shaping=complex:force_style='FontName=IBM Plex Sans Thai,FontSize=22,Outline=2,Shadow=0,MarginV=40'" -c:v libx264 -crf 20 -c:a copy out.mp4`
   - Keep `shaping=complex`: `simple` made tone marks overlap vowels (tested 2026-10-24). ffmpeg needs libass built with HarfBuzz.
   - Default font IBM Plex Sans Thai. Do not use Noto Sans Thai when the subtitles contain English words: the notofonts set has no Latin letters, so English falls back to a font about 1.3 times larger. Other fonts of matching size: Anuphan · Sarabun, with a clear license (`production-tools.md` item 4). If the machine lacks the font, have the user install it from Google Fonts, then point `fontsdir` at it.
   - `FontName` is the family name, not the file name. On Windows, escape the drive colon in the filter (`fontsdir='C\:/Users/...'`) and run in the same folder as the `.srt`.
   - `FontSize` and `MarginV` are not px of the image: the filter treats the script as 288 units tall, so the real distance is about value × image height ÷ 288. Pull a frame, measure, and adjust to the size the caption table of `video-script` sets.
   - Position: landscape 16:9 at bottom center with `MarginV=40`. Portrait 9:16 (TikTok · Reels · Shorts) must clear the platform safe zone (look it up live), starting from `MarginV=100`. Never use `Alignment=5` to center it; this filter puts it near the top.
   - Measured numbers and the worked example: [`references/subtitles-burn-in.md`](subtitles-burn-in.md).
6. **Open the burned-in image and look.** `ffmpeg -ss <second with a subtitle> -i out.mp4 -frames:v 1 check.png`. Tone marks and stacked vowels must sit in the right places (for example ก๋วยเตี๋ยว · ติ๊ก · น้ำ) and the subtitle must be inside the safe zone (`campaign-set`).

## Check before done
- [ ] `srt_check.py` passes (exit 0).
- [ ] Names, prices, numbers, and technical terms checked against the script or listened to again.
- [ ] If burned in: opened the image at 2 or more points to look at the tone marks, and the subtitle is inside the safe zone.
- [ ] The font has a license for this job.
- [ ] The user watched the clip once with the sound off.

## References
- [`references/subtitles-transcription.md`](subtitles-transcription.md) — open at step 2 to choose a tool and get the `.srt` command.
- [`references/subtitles-burn-in.md`](subtitles-burn-in.md) — open at step 5 when sizing or positioning burned-in subtitles; has the measured numbers and a worked example.
- [`references/sources-subtitles.md`](sources-subtitles.md) — sources and check dates.
