---
name: video-script-to-clip
description: Use for a short video, Reel or TikTok ad, from hook to shot list
argument-hint: <the message> [target platform and length]
---

# video-script-to-clip — a short video from hook to shot list, readable with the sound off

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → check `no-ai-look` before sending · follow the "ด่านก่อนลงมือ" section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search is for the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

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
