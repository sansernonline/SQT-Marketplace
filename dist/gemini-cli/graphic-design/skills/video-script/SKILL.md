---
name: video-script
description: Use when scripting a short clip, Reel, TikTok ad or on-camera talk
argument-hint: <the message> [target platform and length]
---

# video-script — scripts for short video: picture-led clips and on-camera speaking

> **One rule:** one message and one action per clip. The hook comes in the first 3 seconds, and the script must work with the sound off (picture-led clip) or survive being read aloud by someone who did not write it (speaking script).

## Use when
- A short video, Reel, TikTok or Shorts ad from a message: hook, beat sheet, shot list, thumbnail storyboard, captions.
- A script for a person speaking to the camera: review, storytelling, teaching, opinion, vlog, spoken Reel, event host.
- A spoken script that reads like an article and needs fixing.

Not for: Thai subtitles as `.srt` or editing the finished file → `video-editing` · Thai voice-over made from text with no recording → `narration-th` · a speech with slides → `slide-deck` · minute-by-minute live selling → `sales-copy`.

## Pick the job
| The clip is | Open |
|---|---|
| Led by the picture (product, demo, understandable with the sound off) | [`references/clip-script.md`](references/clip-script.md) |
| Led by a person talking to the camera | [`references/on-camera.md`](references/on-camera.md) |
| Both (a talking presenter plus product shots) | `on-camera.md` for the words, then `clip-script.md` for shot list and captions |

## Hard rules
**Picture-led clip** (`references/clip-script.md`)
- Run the pre-work gate (brief, owner theme, live references, 3 directions, `design-gate/no-ai-look`) and close with a `ด่านก่อนลงมือ:` line.
- 9:16 at 1080 × 1920 · 7–15 s for an offer, 15–30 s for a demo, up to 60 s for a story · one CTA (call to action), shown as text.
- Captions: at most 35 Thai characters per line and 2 lines · at most 17 characters per second · 5/6 s to 7 s on screen · no full stops · inside the safe zone.
- Do not generate or shoot before the thumbnail storyboard is approved.

**On-camera speaking script** (`references/on-camera.md`)
- Write for the ear: the first spoken sentence is a hook, never "สวัสดีครับ วันนี้จะมา…".
- Time the script by reading it aloud with a stopwatch, not by word count · at most 1 open loop · the payoff must answer what the hook promised.
- Use spoken Thai (แล้ว · แต่ · ก็, not ดังนั้น · อย่างไรก็ตาม) and write big numbers as spoken words · keep ครับ/ค่ะ the same throughout.

## Parts
| File | Open when |
|---|---|
| [`references/clip-script.md`](references/clip-script.md) | Writing a picture-led short clip from hook to shot list (steps, caption table, checks) |
| [`references/on-camera.md`](references/on-camera.md) | Writing or fixing a script for a person speaking on camera |
| [`references/hooks-and-example.md`](references/hooks-and-example.md) | Picking a hook pattern (picture-led and spoken) or per-shot briefs; a finished 12 s example |
| [`references/shot-list-template.md`](references/shot-list-template.md) | Writing the shot list |
| [`references/production-tools.md`](references/production-tools.md) | Choosing an editor or code tool (CapCut, DaVinci Resolve, HyperFrames, Remotion), licences, export sizes |
| [`references/on-camera-worked-example.md`](references/on-camera-worked-example.md) | A full 45-second coffee shop review script as a model |
| [`references/sources-clip.md`](references/sources-clip.md) | Caption rule sources and check dates |
| [`references/sources-on-camera.md`](references/sources-on-camera.md) | Where each video-script rule comes from |
