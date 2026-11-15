---
name: video-editing
description: Use when editing video or audio with ffmpeg
---

# video-editing — cut, join, adjust audio, and export video

Lives in plugin `graphic-design` · write wording per `human-writing` · the agent that does this job is `video-editor` · choosing an editing program you click through (CapCut · DaVinci Resolve) and per-platform export settings are in `video-script-to-clip` `references/production-tools.md`

> **One rule:** every edit to a file ends with measuring the resulting file (length from `ffprobe` · loudness from the second pass of `loudnorm` · the picture at the cut point), not believing that a command that ran without error gave the right result

## Use when

- Trimming the head and tail, cutting out a wrong take, or cutting long silences
- Joining several clips into one file
- Adjusting loudness to the value a platform sets (podcast · YouTube · training clip)
- Converting landscape 16:9 to portrait 9:16 · pulling a cover image · exporting as MP4 that opens anywhere
- Joining HTML slides from `html-slide-deck` with narration into a single video file (podcast lesson · training clip), section "สไลด์กับเสียงบรรยายเป็นวิดีโอ" (slides with narration as video)

## Do not use when (use something else instead or together)

| Job | Use |
|---|---|
| Write the hook, script, shot list | `video-script-to-clip` |
| Thai subtitles (transcribe · check · burn in) | `subtitles-th` |
| The user does not want to record audio: Thai narration from a script (text-to-speech) that gives subtitles and slide timing in one round | `narration-th` |
| Slides that need motion inside a slide | Screen-record while opening the deck, or HyperFrames or Remotion (`production-tools.md` item 1) |
| Color correction, multi-track cutting by eye, adding effects | A person cuts in DaVinci Resolve or CapCut (`production-tools.md` item 1) · the agent writes the checklist for them |
| Clips generated from code in batches (prices, text that changes with data) | HyperFrames or Remotion (`production-tools.md` item 1) |

## Steps

0. **Check the machine.** `ffmpeg -version` · if missing → installing on the whole machine goes under "รออนุมัติ" (awaiting approval) · the subtitle filter needs libass (look for `--enable-libass` in the configuration line)
1. **Look at the file before touching it.** `ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact in.mp4` · keep the original, and always give the output file a new name (`asset-organize`)
2. **Cut a range.** A frame-accurate cut must re-encode:
   `ffmpeg -ss 00:01:30 -i in.mp4 -t 40 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k out.mp4`
   A fast cut with `-c copy` is possible, but the cut point shifts to the nearest keyframe (tested 2026-10-24: asked for 7 seconds, got 7.13) · use it when speed matters more than precision, and tell the user it may drift
3. **Join clips.** All files with the same codec, size, and fps → concat demuxer, no re-encoding:
   a `list.txt` file with one `file 'a.mp4'` per line, then `ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4`
   Files of different kinds → re-encode every file to match first (item 2 without `-ss`), then join
4. **Cut silences.** Measure the audio level first with `ffmpeg -i in.wav -af volumedetect -f null -`, then
   `python scripts/silences.py in.mp4` to see the silent ranges and the time that will remain → once satisfied, add `-o tight.mp4` · if the output file already exists, the script refuses and offers a new name (`tight-v02.mp4`) · add `--force` only when the user orders an overwrite (the same rule is in `loudnorm2.py` and `slides_to_video.py`)
   Set `--noise` lower than the quietest speech but higher than the room's noise floor (the script's default is -35 dB · ffmpeg's own is -60 dB, which is too strict for an ordinary recording room) · `--min` is the shortest silence to cut (0.7 second · ffmpeg sets 2 seconds) · `--pad` leaves a margin around speech (0.15 second) so the first and last syllables are not clipped
   Cut a wrong take by hand at the times the user noted, do not guess from silence
5. **Adjust loudness.** `python scripts/loudnorm2.py in.wav out.wav --target <LUFS> --tp <dBTP>` (LUFS is the unit that measures the loudness of a whole file) (video file: copy the picture as is, re-encode the audio) · the first pass measures, and the second pass feeds in the measured values · read the `Normalization Type` line:
   - `Linear` = raise or lower the whole file by the same amount, the loud and quiet parts stay as they were
   - `Dynamic` = ffmpeg squeezes the loud and quiet parts to hit the target · happens when the measured loudness range (LRA) is over `--lra` or is 0 (tested 2026-10-24: LRA 5.9 gave Linear · 11.9 and 0 gave Dynamic), and when all 4 `measured_*` values are not supplied · to get Linear, raise `--lra`, or accept Dynamic and listen to the loudest part
   - Dynamic mode works at 192 kHz, so the output file's `-ar` must be set (the script sets 48000) · ffmpeg's defaults are I -24 · LRA 7 · TP -2, which are not any platform's values, so the script makes you supply the target
   Targets per platform are in the table under the section "ค่าความดังต่อแพลตฟอร์ม" (loudness targets per platform)
6. **Convert the aspect ratio.** Landscape to portrait 1080×1920:
   Crop the center of the picture `-vf "crop=ih*9/16:ih,scale=1080:1920"`
   Keep the full picture with a blurred background `-filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]" -map "[v]" -map 0:a`
   Text and subtitles must be inside the platform's safe zone (`social-formats`)
7. **Cover image.** `ffmpeg -ss 00:00:03 -i in.mp4 -frames:v 1 -q:v 2 thumb.jpg`
8. **Export.** H.264 with AAC · `-pix_fmt yuv420p` (opens in ordinary players) · `-movflags +faststart` (plays on the web before fully loaded) · size and fps per `production-tools.md` item 3
9. **Measure the resulting file.** Picture and audio length `ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 out.mp4` · loudness `python scripts/loudnorm2.py out.mp4 --measure` · pull the picture at the cut point and look at it · then have the user listen to the part that was actually cut

## สไลด์กับเสียงบรรยายเป็นวิดีโอ (Slides with narration as video)

The time of every slide comes from `data-at` in the deck, in one place, and then you prove from the resulting file that it is as long as the audio and that the picture at randomly sampled times is the slide that should be showing.

1. **Set the times in the deck.** Every `<section class="slide">` has `data-at="m:ss"`, the time the slide should be reached (the same meaning as the clock in the presenter window of `html-slide-deck`) · take the times from the finished, cut audio, not estimated times in the script · audio generated with `narration-th` already has `data_at` for every slide in `cues.json`
2. **Make an image per slide.** `python <html-slide-deck>/scripts/check_deck.py deck.html --out frames` gives `p01.png …` at 1920×1080 (needs Playwright and Pillow) · for slides with animation add `--wait` so the image is the final state · a deck that is still a content file must go through `build_deck.py` first
3. **Audio must be finished first.** Cut and adjust loudness per items 4–5 before setting `data-at`, because cutting the audio later shifts the whole deck's slides
4. **Look at the timetable, then build.** `python scripts/slides_to_video.py deck.html frames narration.wav --check` · the script stops and says why when `data-at` does not increase on every slide · the number of images does not equal the slides · the last slide starts after the audio ends · once it passes, drop `--check` and add `-o episode.mp4` to get H.264 with AAC at 30 fps exactly as long as the audio
5. **Check the file.** Picture and audio length from `ffprobe` · open the start of slides at 3 points · listen to confirm it is the real narration · add subtitles next with `subtitles-th`

| Trap | Cause | What the script already does |
|---|---|---|
| The last slide shows only briefly | The concat demuxer does not use the last image's `duration` unless that file name is repeated on one more line at the end of the list (ffmpeg wiki Slideshow) | Repeats the last image |
| The video is longer than the audio | `-shortest` alone leaves trailing picture when there is a filter (tested 2026-10-24: got 181.67 seconds from 180 seconds of audio) | Uses `-t` equal to the audio length |
| ffmpeg will not open the image list | Full paths in the list file need `-safe 0` | Already added |

Tested 2026-10-24 with a sample deck of 13 slides from `html-slide-deck` and 180 seconds of audio: picture and audio were both 180.00 seconds · sampling 7 times, the picture matched the slide at every point · given audio that was too short (75 seconds), the script stopped because the last slide starts at 165 seconds

## ค่าความดังต่อแพลตฟอร์ม (Loudness targets per platform)

Loudness targets change and differ per destination, so this skill stores none. Destinations to look up: Apple Podcasts · Spotify (music, podcast, podcast ads) · YouTube · TikTok · Audible (ACX) · broadcast (EBU R 128). For each one find the integrated loudness target, the true peak ceiling, and whether the platform publishes a figure at all. Some platforms publish nothing, and secondary sources quote numbers the platform never wrote, so say which kind each value is. Note also that ACX uses dB RMS, a different unit from LUFS.

Look up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน). Official sources: the platform's own help or specification pages (Apple Podcasts Connect · Spotify for Artists loudness page · ACX audio submission requirements · EBU R 128).

For a destination that does not publish a value, use -16 LUFS · -1.5 dBTP (the default of `loudnorm2.py`) because it is within Apple's range (อนุมาน · compared with Apple's live-searched value) and not so loud that it gets turned down (อนุมาน), and tell the user it is a value you chose · for publishing in several places with one file, set the loudness for the main channel, and use the lowest true-peak ceiling of all the channels

## Real example

- **Task:** 11 seconds of audio with 2 silent ranges (2 and 1 seconds) in a video file, and audio with uneven loudness to adjust to -16 LUFS
- **What was done:** `silences.py gaps.mp4 -o tight.mp4` · `loudnorm2.py varied2.wav out.wav`
- **Result:** found silences at 3.00–5.00 and 8.00–9.00, as built · 8.60 seconds remained, as calculated (picture 8.60 · audio 8.62) · loudness came out at -15.6 LUFS as Linear · for the video file `--target -14` gave -14.0 LUFS with the picture not re-encoded (ตรวจจริง 2026-10-24 · ffmpeg 9.0.2 on Windows)

## Check before sending

- [ ] New machine or edited script: `python scripts/<name>.py --self-test` of `silences` · `loudnorm2` · `slides_to_video` · `outguard` (the overwrite guard shared by the first 3 · `tts_cues` moved to `narration-th` on 2026-10-28) passes (without ffmpeg it skips the parts that measure real files and says it skipped · tested 2026-10-26 ffmpeg 9.0.2 passed all 4 · 2026-10-28 passed all 5 after adding the overwrite guard, counting `tts_cues` before the split)
- [ ] The original is still there · the output file has a new name · the commands used are written down so they can be rerun
- [ ] The length from `ffprobe` matches what was intended (picture and audio differ by no more than 0.1 second)
- [ ] Overall loudness is within 1 LU of the target and true peak is not over the ceiling · say whether Linear or Dynamic
- [ ] Pulled the picture at no fewer than 1 cut point and looked at it · told the user which minute to listen to
- [ ] Video from slides: opened the start of slides at no fewer than 3 points and the picture matches the slide
- [ ] Music, footage, and fonts have a license for that channel (`production-tools.md` items 2 and 5)

## Sources

- ffmpeg Filters Documentation: [loudnorm](https://ffmpeg.org/ffmpeg-filters.html#loudnorm) (defaults · 2 passes · `linear` needs all `measured_*` · works at 192 kHz) · [silencedetect](https://ffmpeg.org/ffmpeg-filters.html#silencedetect) · the JSON key names `input_*` come from the source `libavfilter/af_loudnorm.c` version n9.0.2, while feeding the values back as `measured_*` is a common method that the docs do not give an example of (seen 2026-10-24)
- ffmpeg Formats Documentation: [concat demuxer](https://ffmpeg.org/ffmpeg-formats.html#concat) (`file` · `duration` · `-safe 0` for full paths · every file must have the same codec) · ffmpeg Wiki [Slideshow](https://trac.ffmpeg.org/wiki/Slideshow#Concatdemuxer) (the last image must be repeated without `duration`) (seen 2026-10-24)
- `html-slide-deck` `assets/shell.html`: `data-at="m:ss"` is the time the slide should be reached · `scripts/check_deck.py` captures images at 1920×1080 (read 2026-10-24)
- Loudness values: [Apple Podcasts audio requirements](https://podcasters.apple.com/support/893-audio-requirements) · [Spotify loudness normalization](https://support.spotify.com/us/artists/article/loudness-normalization/) · [Spotify audio ad specs](https://ads.spotify.com/en-US/ad-specs/audio-ad-specs/) · [YouTube stable volume](https://support.google.com/youtube/answer/14106294) · [ACX audio submission requirements](https://help.acx.com/s/article/acx-audio-submission-requirements) · [EBU R 128](https://tech.ebu.ch/docs/r/r128.pdf) (viewed every page 2026-10-24)
- This skill's test results: the "Real example" section above (run on self-made test files 2026-10-24 · ffmpeg 9.0.2 on Windows)
