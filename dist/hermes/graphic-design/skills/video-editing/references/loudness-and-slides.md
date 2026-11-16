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
