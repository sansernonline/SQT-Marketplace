# Presentation narration · narration-th

Open this when narrating a slide deck or an existing silent slide video, polishing the voice, or fixing a word the voice splits. Everything here comes from one real job (EIT sales presentation, 35 slides, 3 products, 2026-11-26, edge-tts 7.3.1, ffmpeg on Windows) unless a line says otherwise.

## 1 Script

- 1 line = 1 slide · 1–3 sentences taken only from what the slide shows.
- Spaces are for the reader. With `--keep-spaces` a space between Thai words is a short break and `,` is a real pause. Put `,` after the product name ("PTSDaaS, ศูนย์กลาง…"), between list items ("เครื่อง POS, เครื่องพิมพ์ใบเสร็จ, ลิ้นชักเก็บเงิน, และ Tablet") and between clauses.
- What the owner rejected, in order: a comma at every space (stops everywhere, even inside "พีทีเอส, ดาส"), then no spaces at all (lists run together: "จัดเก็บค้นหาแชร์"). Spaces plus chosen commas was accepted.
- Numbers and prices can be written as words in the script ("ห้าร้อยเก้าสิบบาท"), so the slide price and the spoken price are checked by eye.

## 2 Voice and polish

- `th-TH-NiwatNeural`, `--rate=-5%`. The agent moved from -8% to -5% when the owner asked for a less AI-like voice (slow speech drags), and the owner approved the result · -5% alone was not compared with -8% by ear.
- Polish chain the owner called "โทนเสียงดีมาก", applied to the whole narration track before loudness:

```
highpass=f=75,equalizer=f=180:t=q:w=1:g=2,equalizer=f=6500:t=q:w=2:g=-3,
acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200,
aecho=0.9:0.6:28|47:0.10|0.06,loudnorm=I=-16:TP=-1.5:LRA=11
```

  Cut rumble · a little warmth at 180 Hz · softer "s" at 6.5 kHz · gentle compression · a faint room. Not A/B-tested against the raw voice by the owner (only the result was approved).

## 3 Over an existing slide video

The source had a slide every 5 s with a build-in and an exit animation, 4K 30 fps, no audio.

1. **Find the slide grid.** Scale frames to 160×90 grey at 10 fps and measure edge energy per frame. The lowest frames between slides are the cuts (here exactly every 5.0 s, exit starting about 0.9–1.1 s before the cut). Confirm with a contact sheet of one frame per slide.
2. **One audio file per slide.** Voice starts 0.6 s into the slide.
3. **Hold, do not cut.** For each slide: play from slide start to 3.9 s (the slide is fully built), freeze that frame with `tpad=stop_mode=clone:stop_duration=<hold>` until the voice ends plus 0.7 s, then play the exit animation. `hold = max(0, 0.6 + voice + 0.7 - 3.9)`. Encode each piece (`-ss` before `-i` so only that slide is decoded, libx264 crf 18, same size and fps), join with the concat demuxer, and place each voice clip with `adelay` at its slide start.
4. **Check.** Sum the real piece lengths and compare with the planned slide starts: drift was ≤ 0.08 s over 35 slides. Grab one frame during each voice line and confirm the slide matches the line. The 175 s video became 6:17.

## 4 Words the voice splits

The voice sends word timings with `edge_tts.Communicate(..., boundary="WordBoundary")`. A term that comes back as 2 or more words inside a sentence sounds choppy.

- **Find:** `python scripts/split_words.py check script.txt --lexicon words.tsv --keep-spaces`.
- **Respell first.** For Tablet, 19 forms were tried in 2 real sentences: แทปเล็ต, แท็บเล็ต, แทบเล็ต, แท็บเลต, แทปเลต, แท็ปเล็ต, แทบเลต, เท็บเล็ต, แท็บ-เล็ต, quoted, trailing space, แทปแล็ต, แทบแล็ต, แท็ปแล็ต, แท็บแล็ด, แทปแล็ด all split · only แท็บแล็ต and the English `tablet` / `Tablet` stayed whole · the owner still preferred the sound of แทปเล็ต said alone, hence the splice.
- **Splice when the owner wants a sound that exists only alone.** `split_words.py make --splice "WORD=SAMPLE"` reuses the sample text the owner approved (same text gives the same audio, 0.999 waveform match), cuts the word using its own timing, and puts it where the split word was. A plain cut at the word edges left a loud piece of the old "เล็ต" after the new word (75 dB against 44 dB) and the owner heard a jerk. The joint that was accepted: cut at the quietest 5 ms near each edge, keep the word's decay down to -45 dB (≤ 0.2 s), same loudness as the replaced span, 15 ms fade in, 80 ms fade out, 60 ms gap. History: the owner first picked a 0 ms gap with a short tail (-30 dB, 40 ms fade) from 0 · 30 · 70 ms samples, then said the moment after the word was "สั้นไปนิด", and picked the longer tail with 60 ms from a new set.
- **Approve in the real sentence.** A clause made without the sample's lead-in matched the approved sample only 0.16 by waveform: the words around a term change how the whole clause is said. So samples are always made from the real line, and the final audio is checked against the picked sample (0.993–0.997 for the spliced word in the final video).

## 5 Letters read one by one

- `POS<TAB>พีโอเอส` is one word to the voice and comes out "พีโอส". With spaces, "โอ" lasts 0.09 s. With hyphens, `พี-โอ-เอส`, the letters get 0.20 · 0.13 · 0.30 s (word timings, 2026-11-26).
- The owner then found it slow and picked 1.2× from 1.0× · 1.2× · 1.4× samples: `split_words.py make --speedup "โอ,เอส=1.2"` (ffmpeg `atempo`, same pitch, only that span). The final line matched the picked sample 0.9998 by loudness envelope.

## 6 Afterwards

Keep `words.tsv`, the approved sample texts and the speed settings with the project's build script, so a rebuild gives the same sound. The job's own script was `presentation/narration/build.py` in the EIT RPOS project.
