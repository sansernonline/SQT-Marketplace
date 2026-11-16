# Real examples and test record · narration-th

Open this when you need to know how long a job takes or what was measured.

- **Task (narration from a script):** Git lesson episode 1 has 9 cues and 3 slides, with English words, numbers, and stacked tone marks (ก๋วยเตี๋ยว)
- **What was done:** ran with 3 engines · the Windows voice used `words.tsv` · edge did not · F5 was tested on 2 cues at NFE 16 with the reference clip that ships with the program · put `data_at` from `cues.json` into a 3-slide deck and joined with `slides_to_video.py` · burned in the subtitles and pulled frames at seconds 12 and 28
- **Result** (verified 2026-10-24 · ffmpeg 9.0.2 on Windows):
  - Windows voice: 9 cues took 0.9 second (the first run after boot could take up to 9.1 seconds) · total length 32.21 seconds, matching ffprobe · on rerun it reused the same audio for all 9 cues
  - edge: total length 28.73 seconds · on the first run the service did not send audio for cue 5 · the second run reused the audio of 4 existing cues and generated the rest until complete
  - F5: 35–42 seconds per cue for 5.38 seconds of speech · cue by cue was about 1.6 times faster than the long 8.4-second piece that took 198.8 seconds (comparing speech only) · read "ง่าย ๆ" as "ง่ายง่าย"
  - Every engine passed `srt_check.py` · the video was 32.21 seconds, same as the audio · the subtitle placed tone marks correctly and showed "commit" as in the script while the voice read "คอมมิต"
- **Agent test round (haiku · 2026-10-24 · Windows voice task):** the one without the skill wrote its own 232-line script and generated sentence by sentence · the result passed the same way (`srt_check.py` passed), but used 205k tokens and 10.3 minutes · the one with the skill used 144k tokens and 4.8 minutes (counters of the two agent runs) and got audio of 32.66 seconds, equal to `total` in `cues.json` · what was measured is that this section helps with time and gives a reusable script, and does not make the Windows voice job pass more often · F5 and rights were not measured with an agent (inferred) · the items the agent said were unclear (5/6 second · the Windows voice numbers) were fixed · so the user chose to merge it as a section in `video-editing` instead of a separate skill (2026-10-24), and then chose to split it out as this skill on 2026-10-28 because `video-editing` is about 42 KB long

- **Task (terms in a podcast):** an IoT exam-review podcast with 338 English terms · used a 360-term `words.tsv` and a 105-term `respell.tsv` obtained from listening tests · ran `term_sample.py` (a prototype from this job)
- **Result** (2026-11-09 · edge-tts): got a male file of 19 minutes 11 seconds and a female file of 21 minutes 5 seconds at +0%/−2% · the service sent no audio for 3 of 676 terms, and rerunning completed them · a first run that stopped midway left an empty file, which made the next run skip that term, so it now writes to `.part` first and renames once the file is non-empty · the user listened and said the English terms sounded fine, and only asked for it to be slower

Self-test record: `python -B scripts/tts_cues.py --self-test` and `python -B scripts/term_sample.py --self-test` tested 2026-10-28 from the new path after the skill was split out (ffmpeg 9.0.2) · term_sample tested 2026-11-10.
