# Symptoms and fixes · narration-th

Open this when a run fails, sounds wrong, or a subtitle looks wrong.

| Symptom | Cause | Fix |
|---|---|---|
| F5 fails with the message `Could not load libtorchcodec` | torchaudio 2.9 and later reads audio files through torchcodec, which needs the FFmpeg shared-build library files (DLLs) · a single-file ffmpeg.exe does not work | `f5_worker.py` now reads files with soundfile instead · the F5 web page still fails, and needs the FFmpeg shared build installed with its folder added to PATH (the list of folders Windows searches for programs) · this item awaits approval (รออนุมัติ) |
| The machine is very slow or memory nearly runs out when running F5 | Running on CPU | Do short episodes one at a time · NFE 16 · move to a machine with an NVIDIA graphics card |
| The Windows voice produces a single file instead of one per cue | PowerShell 5.1's `ConvertFrom-Json` returns the array as one lump | Do not wrap the result in `@()` (fixed in `windows_tts.ps1`) |
| English words vanish or are read wrongly | The Thai model mainly knows Thai letters | Put readings in `words.tsv` |
| The Thai reading is right but the audio sounds strange | The voice reads by Thai spelling, not by how a person says it | Respell in `respell.tsv`, then listen again with `term_sample.py` |
| Mixing a Thai voice and an English voice in one sentence sounds jerky | Tone and rhythm change mid-sentence | Have the Thai voice read the whole sentence, and write English words as Thai in `words.tsv` (tried mixing Niwat with Andrew and Emma on 2026-11-07, and the real podcast used Thai only) |
| The subtitle shows the reading instead of the original word | The reading was written straight into the script | Move it into `words.tsv` |
| A short subtitle is on screen for less than 5/6 second (about 0.83 second, the lowest value in the caption table of `video-script-to-clip`) | A very short sentence such as "สวัสดีครับ" | The script already stretches cue time to at least 0.9 second, without overlapping the next cue |
| The voice stops at every phrase, even inside a name ("พีทีเอส… ดาส") | The tutorial rule turned every space into `, `, and the spaces around English terms became pauses too | For a presentation use `tts_cues.py --keep-spaces` and write `,` only where a pause belongs ([`presentation.md`](presentation.md) section 1 · 2026-11-26) |
| A loanword sounds choppy in a sentence but fine alone (แทปเล็ต) | The voice splits it into 2 words inside a sentence (แทป\|เล็ต in the word timings) | `split_words.py check` · respell until it stays whole, or `split_words.py make --splice` ([`presentation.md`](presentation.md) section 4) |
| A spliced word jerks or feels cut short | Part of the old word stays after the joint, or the new word stops hard | Use the joint settings in `split_words.py` (quietest cut point · decay kept · 60 ms gap), which the owner accepted on 2026-11-26 |
| Letters such as POS come out as "พีโอส" | `พีโอเอส` is one word to the voice, and with spaces "โอ" lasts 0.09 s | Write `พี-โอ-เอส` · speed up with `--speedup "โอ,เอส=1.2"` if it then sounds slow |
| The final audio does not sound like the sample the user picked | The words around a term change how it is said (0.16 waveform match without the sample's lead-in) | Make samples from the real line, and check the final against the picked sample before saying it is fixed |
