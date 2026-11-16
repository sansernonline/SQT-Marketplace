# skill: video-editing

Use when editing video or audio with ffmpeg

# video-editing — cut, join, adjust audio, and export video

> **One rule:** every edit to a file ends with measuring the resulting file (length from `ffprobe` · loudness from the second pass of `loudnorm` · the picture at the cut point), not believing that a command that ran without error gave the right result.

## Use when
- Trimming head and tail, cutting a wrong take, or cutting long silences
- Joining several clips into one file
- Adjusting loudness to a platform's value (podcast · YouTube · training clip)
- Converting 16:9 to 9:16 · pulling a cover image · exporting MP4 that opens anywhere
- Joining HTML slides from `html-slide-deck` with narration into one video (section "สไลด์กับเสียงบรรยายเป็นวิดีโอ")

Not for: hook · script · shot list → `video-script-to-clip` · Thai subtitles → `subtitles-th` · Thai narration from a script, no recording → `narration-th` · colour correction, multi-track cutting by eye, effects, motion inside a slide, or batch clips from code → a person in DaVinci Resolve or CapCut, or HyperFrames or Remotion (`video-script-to-clip` `references/production-tools.md` item 1; the agent writes the checklist). The agent for this job is `video-editor`.

## Steps
0. **Check the machine.** `ffmpeg -version`. If missing, installing on the whole machine goes under "รออนุมัติ". The subtitle filter needs libass (`--enable-libass` in the configuration line).
1. **Look at the file first.** `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact in.mp4`. Keep the original; always give the output a new name (`asset-organize`).
2. **Cut a range.** A frame-accurate cut must re-encode: `ffmpeg -ss 00:01:30 -i in.mp4 -t 40 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k out.mp4`. `-c copy` is faster but the cut shifts to the nearest keyframe (asked 7 seconds, got 7.13); use it when speed matters more, and tell the user it may drift.
3. **Join clips.** If all files share codec, size and fps, use the concat demuxer: a `list.txt` with one `file 'a.mp4'` per line, then `ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4`. Otherwise re-encode every file to match first (step 2 without `-ss`), then join.
4. **Cut silences.** Measure first: `ffmpeg -i in.wav -af volumedetect -f null -`. Then `python scripts/silences.py in.mp4` shows the silent ranges and the time that will remain. When satisfied, add `-o tight.mp4`. If the output exists the script refuses and offers a new name (`tight-v02.mp4`); add `--force` only when the user orders an overwrite (same rule in `loudnorm2.py` and `slides_to_video.py`). Set `--noise` lower than the quietest speech but higher than the room's noise floor (script default -35 dB); other flags in `references/ffmpeg-recipes.md`. Cut a wrong take by hand at the times the user noted; do not guess from silence.
5. **Adjust loudness.** `python scripts/loudnorm2.py in.wav out.wav --target <LUFS> --tp <dBTP>` (video file: picture copied, audio re-encoded). The first pass measures, the second feeds the values back. Read the `Normalization Type` line:
   - `Linear`: the whole file moves by the same amount.
   - `Dynamic`: ffmpeg squeezes loud and quiet parts. It happens when LRA (loudness range) is over `--lra` or 0, or when the 4 `measured_*` values are not all supplied. For Linear, raise `--lra`, or accept Dynamic and listen to the loudest part. Tell the user which one it was.
   - Dynamic mode works at 192 kHz, so the output `-ar` must be set (the script sets 48000). ffmpeg's defaults (I -24 · LRA 7 · TP -2) are no platform's values, so you must supply the target.
   - **Target:** look it up live for the destination (Apple Podcasts · Spotify · YouTube · TikTok · ACX · EBU R 128); if the page will not open, mark the value (รอยืนยัน). If the destination publishes none, use -16 LUFS · -1.5 dBTP and tell the user it is your chosen value. For one file published in several places, use the main channel's loudness and the lowest true-peak ceiling. Details in `references/loudness-and-slides.md`.
6. **Change aspect ratio** (landscape to 1080×1920): crop the center, or keep the full picture on a blurred background. Filter strings in `references/ffmpeg-recipes.md`. Keep text and subtitles inside the platform's safe zone (`social-formats`).
7. **Cover image.** `ffmpeg -ss 00:00:03 -i in.mp4 -frames:v 1 -q:v 2 thumb.jpg`
8. **Export.** H.264 with AAC · `-pix_fmt yuv420p` · `-movflags +faststart` · size and fps per `production-tools.md` item 3.
9. **Measure the result.** Length: `ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 out.mp4`. Loudness: `python scripts/loudnorm2.py out.mp4 --measure`. Pull the picture at the cut point and look at it. Then have the user listen to the part that was cut.

## สไลด์กับเสียงบรรยายเป็นวิดีโอ (Slides with narration as video)
Every slide's time comes from `data-at` in the deck, in one place. Then prove from the result that the video is as long as the audio and the picture at sampled times is the right slide.
1. **Set times in the deck.** Every `<section class="slide">` has `data-at="m:ss"`, the time the slide is reached (same meaning as the presenter clock of `html-slide-deck`). Take times from the finished, cut audio, not estimates. Audio from `narration-th` already has `data_at` per slide in `cues.json`.
2. **Finish the audio first.** Cut and adjust loudness (steps 4–5) before setting `data-at`, because cutting later shifts every slide.
3. **Make an image per slide.** `python <html-slide-deck>/scripts/check_deck.py deck.html --out frames` gives `p01.png …` at 1920×1080 (needs Playwright and Pillow). For animated slides add `--wait`. A content-file deck goes through `build_deck.py` first.
4. **Check the timetable, then build.** `python scripts/slides_to_video.py deck.html frames narration.wav --check`. It stops with a reason when `data-at` does not increase · the number of images differs from slides · the last slide starts after the audio ends. When it passes, drop `--check` and add `-o episode.mp4` (H.264 with AAC at 30 fps, exactly as long as the audio).
5. **Check the file.** Lengths from `ffprobe` · open the start of slides at 3 points · listen to confirm it is the real narration · add subtitles next with `subtitles-th`.

## Check before done
- New machine or edited script: `python scripts/<name>.py --self-test` of `silences` · `loudnorm2` · `slides_to_video` · `outguard` passes (without ffmpeg it skips real-file parts and says so).
- The original is still there · the output has a new name · the commands used are written down so they can be rerun.
- The `ffprobe` length matches the intent (picture and audio differ by at most 0.1 second).
- Overall loudness is within 1 LU of the target, true peak is not over the ceiling, and the reply says Linear or Dynamic.
- Pulled the picture at 1 cut point or more and looked at it · told the user which minute to listen to.
- Video from slides: opened the start of slides at 3 points or more and the picture matches.
- Music, footage and fonts have a license for that channel (`production-tools.md` items 2 and 5).

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


## reference: sources.md

# Sources · video-editing

- ffmpeg Filters Documentation: [loudnorm](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) (defaults · 2 passes · `linear` needs all `measured_*` · works at 192 kHz) · [silencedetect](https://ffmpeg.org/ffmpeg-filters.html#silencedetect) · the JSON key names `input_*` come from the source `libavfilter/af_loudnorm.c` version n9.0.2, while feeding the values back as `measured_*` is a common method that the docs do not give an example of (seen 2026-10-24)
- ffmpeg Formats Documentation: [concat demuxer](https://ffmpeg.org/ffmpeg-formats.html#concat) (`file` · `duration` · `-safe 0` for full paths · every file must have the same codec) · ffmpeg Wiki [Slideshow](https://trac.ffmpeg.org/wiki/Slideshow#Concatdemuxer) (the last image must be repeated without `duration`) (seen 2026-10-24)
- `html-slide-deck` `assets/shell.html`: `data-at="m:ss"` is the time the slide should be reached · `scripts/check_deck.py` captures images at 1920×1080 (read 2026-10-24)
- Loudness values: [Apple Podcasts audio requirements](https://podcasters.apple.com/support/893-audio-requirements) · [Spotify loudness normalization](https://support.spotify.com/us/artists/article/loudness-normalization/) · [Spotify audio ad specs](https://ads.spotify.com/en-US/ad-specs/audio-ad-specs/) · [YouTube stable volume](https://support.google.com/youtube/answer/14106294) · [ACX audio submission requirements](https://help.acx.com/s/article/acx-audio-submission-requirements) · [EBU R 128](https://tech.ebu.ch/docs/r/r128.pdf) (viewed every page 2026-10-24)
- This skill's test results: `references/loudness-and-slides.md` "Real example" (run on self-made test files 2026-10-24 · ffmpeg 9.0.2 on Windows)
