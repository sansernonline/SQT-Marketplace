# skill: subtitles-th

Use when a video needs Thai subtitles as .srt or burned in

# subtitles-th — Thai subtitles as a file: transcribe, check, then burn in or deliver the file

Line length, reading speed, and punctuation rules live in the Caption and on-screen text rules table in `video-script-to-clip`; this skill makes the subtitle file follow that table.

> **One rule:** subtitles from any transcription tool are only a draft. Fix names of people, brand names, prices, and numbers by hand, make `srt_check.py` pass, and open the burned-in image to look at the tone marks, before saying done.

## Use when
- There is a clip or audio, and the user wants Thai subtitles as an `.srt` file or burned into the picture.
- Existing subtitles must be fixed so they can be read in time (long lines · too fast · 3 lines · a full stop closing the sentence).
- After burning in, Thai letters are squares or tone marks float in the wrong place.

Not for: on-screen text designed as graphics (headings · prices · promotions) → `video-script-to-clip` · `motion-basics` · automatic subtitles in an editing app (CapCut · DaVinci Resolve) → `production-tools.md` item 1, then steps 4–6 here to check the result · cutting or joining audio first → `video-editing` · translating subtitles → `human-writing/translate-th-en`, then check the file with step 4.

## Steps
0. **Find an existing pattern first.** Check the brand fonts and colors (`brand-kit` · `doc-theme` · files the user gave), subtitles of earlier clips on the channel, and fonts on this video's graphics. If found, use that pattern and say which file's pattern you used; if not, use this skill's defaults and say no earlier pattern was found. Any chosen font must have Thai letters and a license that allows embedding in video; with no brand font, use IBM Plex Sans Thai.
1. **Use the final audio file.** Finish editing first, because cutting afterward shifts the time of the whole file.
2. **Transcribe to `.srt`.** Prefer a tool that runs locally for free (data stays on the machine). Installing packages or downloading models goes under "รออนุมัติ" (awaiting approval). Commands and the options table: [`references/transcription-options.md`](references/transcription-options.md).
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
   - `FontSize` and `MarginV` are not px of the image: the filter treats the script as 288 units tall, so the real distance is about value × image height ÷ 288. Pull a frame, measure, and adjust to the size the caption table of `video-script-to-clip` sets.
   - Position: landscape 16:9 at bottom center with `MarginV=40`. Portrait 9:16 (TikTok · Reels · Shorts) must clear the platform safe zone (look it up live), starting from `MarginV=100`. Never use `Alignment=5` to center it; this filter puts it near the top.
   - Measured numbers and the worked example: [`references/burn-in-details.md`](references/burn-in-details.md).
6. **Open the burned-in image and look.** `ffmpeg -ss <second with a subtitle> -i out.mp4 -frames:v 1 check.png`. Tone marks and stacked vowels must sit in the right places (for example ก๋วยเตี๋ยว · ติ๊ก · น้ำ) and the subtitle must be inside the safe zone (`social-formats`).

## Check before done
- [ ] `srt_check.py` passes (exit 0).
- [ ] Names, prices, numbers, and technical terms checked against the script or listened to again.
- [ ] If burned in: opened the image at 2 or more points to look at the tone marks, and the subtitle is inside the safe zone.
- [ ] The font has a license for this job.
- [ ] The user watched the clip once with the sound off.

## References
- [`references/transcription-options.md`](references/transcription-options.md) — open at step 2 to choose a tool and get the `.srt` command.
- [`references/burn-in-details.md`](references/burn-in-details.md) — open at step 5 when sizing or positioning burned-in subtitles; has the measured numbers and a worked example.
- [`references/sources.md`](references/sources.md) — sources and check dates.


## reference: burn-in-details.md

# Burn-in details · font, size units, position

Open at step 5 when burning in. Test results dated 2026-10-24 and 2026-10-26.

- `shaping=complex`: the ffmpeg 9.0 docs say it is required for Thai script (tested 2026-10-24: `simple` made the tone mark ไม้จัตวา in "เตี๋ยว" overlap the vowel อี · `complex` and the default `auto` placed it correctly on this machine) · ffmpeg must be built with libass that has HarfBuzz
- **The default font is IBM Plex Sans Thai** (OFL in google/fonts), which has both Thai and Latin letters in one family, with matching sizes (Latin to Thai 0.93) · the user chose it from a 7-font comparison image on 2026-10-26 · **do not use Noto Sans Thai for subtitles that contain English words,** because the notofonts file set (version 2.002 installed on this machine) has no Latin letters at all, so English words fall back to a fallback font about 1.3 times larger (checked the glyph table in the file and measured from an image 2026-10-26) · the set on Google Fonts has Latin letters, but you cannot tell from the font name which set the machine has, so neither set is used · other options with matching size: Anuphan · Sarabun · the font must have a clear license (`production-tools.md` item 4) · if the machine lacks the font → have the user install it from Google Fonts themselves, then point `fontsdir` at it
- `FontName` is the font family name, not the file name · `fontsdir` points to the folder that has the font files
- Windows: a path in the filter must escape the drive's `:` character, for example `fontsdir='C\:/Users/<ชื่อ>/AppData/Local/Microsoft/Windows/Fonts'`, and run the command in the same folder as the `.srt` file so you can use a bare file name
- `FontSize` and `MarginV` are not directly px of the image · the filter reads `.srt` as a script 288 units tall, so the real distance is about value × image height ÷ 288 (tested 2026-10-24: on an image 1920 tall `MarginV` 40 → the subtitle sits 310 px from the bottom edge · 150 → 1044 px · Noto Sans Thai FontSize 22 gave consonants ก ข ค ง 31 px tall on a 1080-tall image and 55 px on a 1920-tall image · in the font comparison round of 2026-10-26, re-measured at FontSize 22 on a 1080-tall image: Noto Sans Thai 29 px · IBM Plex Sans Thai 27 px, slightly smaller, and to get the same size try FontSize 24, which is calculated from the ratio and not yet measured) pull a frame, measure, and adjust to reach the size set by the rules in the caption table of `video-script-to-clip`
- Position by aspect ratio: landscape 16:9 (YouTube · tutorial clips) place at bottom center, `MarginV=40` puts the subtitle about 16% above the bottom edge · portrait 9:16 (TikTok · Reels · Shorts) the subtitle must clear the bottom part per the safe-zone rules (look up live from the platform's guide), and `MarginV=100` puts the subtitle 37% above the bottom edge (tested 2026-10-24 on a 1080×1920 image) · do not use `Alignment=5` to center it on screen, because this filter reads it as top-aligned (tested 2026-10-24: the subtitle landed at 6% from the top edge)

## Real example

- **Task:** burn 2 Thai subtitles with tone marks stacked on vowels into a 1920×1080 clip on Windows
- **What was done:** `srt_check.py` (found subtitle 2 reads at 18.4 characters per second, over 17) · burned in with Noto Sans Thai (test round 2026-10-24, before switching to IBM Plex Sans Thai) from the user's font folder · pulled a frame at second 4 and looked at it
- **Result:** "ผู้ใหญ่ใจดี น้ำแข็งใส ก๋วยเตี๋ยว" and "ติ๊กต่อก ฎีกา ฐาน" had tone marks and vowels in the right positions · the checker caught the excess speed exactly per the threshold (ตรวจจริง 2026-10-24 · ffmpeg 9.0.2 with libass)


## reference: sources.md

# Sources · subtitles-th

- The Caption and on-screen text rules table in `video-script-to-clip` (Netflix Thai Timed Text Style Guide · Meta safe zone · checked by that skill 2026-10-06)
- `production-tools.md` items 3–4 (YouTube accepts UTF-8 SubRip · OFL fonts · checked 2026-10-23)
- ffmpeg Filters Documentation: [subtitles](https://ffmpeg.org/ffmpeg-filters.html#subtitles) (`fontsdir` · `force_style` · `shaping` · needs libass) · [escaping in a filtergraph](https://ffmpeg.org/ffmpeg-filters.html#Notes-on-filtergraph-escaping) · UTF-8 reading and BOM skipping from the source `libavformat/subtitles.c` version n9.0.2 · libass needs HarfBuzz since 0.15.0 ([Changelog](https://github.com/libass/libass/blob/master/Changelog)) (seen 2026-10-24)
- [YouTube supported subtitle and closed caption files](https://support.google.com/youtube/answer/2734698) (SRT must be pure UTF-8 with no styles · seen 2026-10-24)
- Transcription tools: [openai/whisper](https://github.com/openai/whisper) (MIT · model sizes · Thai figures) · [whisper.cpp](https://github.com/ggml-org/whisper.cpp) (MIT · `-osrt` · 16-bit WAV) · [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (MIT) · [biodatlab/whisper-th-large-v3-combined](https://huggingface.co/biodatlab/whisper-th-large-v3-combined) · [nectec/Pathumma-whisper-th-large-v3](https://huggingface.co/nectec/Pathumma-whisper-th-large-v3) · [typhoon-ai/typhoon-whisper-large-v3](https://huggingface.co/typhoon-ai/typhoon-whisper-large-v3) (seen 2026-10-24 · not downloaded or run)
- This skill's test results: the "Real example" in `burn-in-details.md` (run on self-made test files 2026-10-24 · ffmpeg 9.0.2 on Windows)


## reference: transcription-options.md

# Transcription options for Thai `.srt`

Open at step 2. Use one that runs locally for free first (data does not leave the machine). Installing packages and downloading models (the medium file is about 1.5 GB · large-v3 about 2.9 GB) goes under "รออนุมัติ" (awaiting approval). On the machine where this skill was written, none has actually been run yet.

| Option | License | How to get `.srt` | Thai |
|---|---|---|---|
| openai-whisper (Python) | MIT for both code and model | `whisper in.wav --model medium --language Thai --output_format srt --output_dir out` | large-v3 errs about 5.8% at character level (Common Voice 15) and 8.4% (FLEURS) per the developers |
| whisper.cpp | MIT | convert to 16-bit WAV first `ffmpeg -i in.mp3 -ar 16000 -ac 1 -c:a pcm_s16le in.wav` then `whisper-cli -m models/ggml-medium.bin -f in.wav -l th -osrt -of out` | The same model as Whisper · the default is English, so you must pass `-l th` and not use a model whose name ends in `.en` |
| faster-whisper | MIT | A library with no `.srt` writer, so you write it yourself from `segment.start` · `segment.end` · `segment.text` | Up to about 4 times faster than openai-whisper at the same accuracy, per the developers |
| Models tuned for Thai (biodatlab Mahidol University · NECTEC Pathumma · SCB 10X Typhoon) | apache-2.0 or mit · Typhoon has an added OpenTyphoon condition | These are `transformers` models with no `.srt` writer · to use with whisper.cpp or faster-whisper they must be converted first (not tested yet) | The developers report fewer errors than the original Whisper, but they were measured on different datasets and cannot be compared directly · some models say they were not made for timestamps |

The timing in subtitles from every tool must be rechecked in step 4. Every tool may add words that were not spoken (hallucination), per Whisper's own warning.
