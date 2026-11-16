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
