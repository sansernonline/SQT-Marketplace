
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
