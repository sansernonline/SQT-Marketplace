# skill: narration-th

Use when Thai narration must come from text-to-speech

# narration-th — Thai narration from a script (text-to-speech)

> **One rule:** listen to every subtitle cue before saying done, and the reference voice used for cloning must be the user's own voice, or the voice owner must have consented in writing

## Use when
- The user does not want to record audio: generate Thai narration from the script, one cue at a time, and get subtitles and slide timing in one round
- Not for: writing the spoken script → `speaking-script` · cutting, joining, loudness, slides with audio → `video-editing` · Thai subtitles (transcribe, check, burn in) → `subtitles-th`
- Cloning the voice of a famous person or someone who has not consented: do not do it, tell the user why

## Steps
Each subtitle gets its text from the script and its timing from the real audio, so no transcription is needed.

**Choose the engine** (rights, speeds, and test findings: [`references/engines.md`](references/engines.md))

| Engine | Use for | Rights |
|---|---|---|
| F5-TTS-THAI `--engine f5` | Voice cloned from a 5–10 second reference clip · needs an NVIDIA card, very slow on CPU | Free, local · base model is CC-BY-NC (รอยืนยัน), check terms before monetized use |
| edge-tts `--engine edge` | Internal work and good-sounding drafts · reads English terms written in Thai well | Not for monetized clips (unofficial endpoint) · text leaves the machine |
| Windows voice, e.g. Pattara `--engine windows` | Drafts to time and check subtitles | Free, local · distribution of generated audio not stated (รอยืนยัน) |
| Paid Azure AI Speech · Google Cloud TTS | Monetized clips that need clear rights | Terms grant commercial use for the paid tier (รอยืนยัน) · not in the script yet, add when the user has a key |
| Lunarlist via PyThaiTTS | Do not use | Cannot read Latin letters · some phrases never stop |

For a monetized clip, drop engines marked (รอยืนยัน) or not mentioned, then score cost against setup effort with `superuser:decision-desk` (`decide.mjs score file.json`; example in references). Look up the live Azure and Google price at https://cloud.google.com/text-to-speech/pricing and the Azure pricing page (WebSearch/WebFetch) before quoting it; if the page will not open, mark the value (รอยืนยัน). Internal work and drafts need none of this.

0. **If it is a podcast, write the script this way (no hook or CTA from `speaking-script`).**
   - Go straight into the content: no greeting, no intro of yourself or the show, no "this episode is about". Do not talk to the listener: no questions back, no invitation to follow, no sign-off. Close with a content sentence.
   - 1 idea per sentence · cut modifiers, repeated connectors, and recaps.
   - **1 line in the file = 1 complete sentence.** Do not split with `|` (the voice falls and pauses each line). No on-screen subtitles, so the 35-character limit does not apply · use `--gap 0.15`.
   - No spaces inside a sentence (a space is where the engine breathes) · `tts_cues.py` strips spaces between Thai letters before sending, but the subtitle shows the text as written.
   - Arabic digits are fine: `tts_cues.py` converts whole numbers to Thai words (a year reads as one number, a number starting with 0 reads digit by digit, a number attached to Latin letters such as ESP32 is left alone, so use `words.tsv`).
1. **Split the script into cues.** Write per `speaking-script`, then 1 line = 1 cue, at most 35 characters, using `|` to split into 2 lines · put `[สไลด์ n]` before the line where slide n starts · a line starting with `#` is a note, not read.
2. **Make `words.tsv`**, one line `คำ<TAB>คำอ่าน` for English words, proper names, and abbreviations (`Git<TAB>กิต`) · the engine reads the reading, the subtitle keeps the original word · English matches regardless of case · `#` lines and the header row (`คำ` or `word`) are skipped · if a number must be read a way the converter does not (2569 read split as "ยี่สิบห้า หกสิบเก้า"), write it out as words in the script.
   - **Reading is right but the audio says it wrong:** put it in `respell.tsv`, one line `คำอ่าน<TAB>คำที่สะกดให้หูได้ยินถูก` (`คอนโทรลเลอร์<TAB>คอนโทรเล่อ`; tone marks and spacing help stress and pauses) · kept apart because respelling applies only to the voice that was heard to be wrong.
   - **Before generating a whole episode (edge):** `python scripts/term_sample.py --lexicon words.tsv --respell respell.tsv --script ep01.txt -o terms` gives `term-sample-male.mp3`, `term-sample-female.mp3` (one term at a time, "1, คอนโทรเล่อ") and `term-sample-list.md` pairing numbers with terms · the user names the wrong numbers, you fix `respell.tsv` and rerun · about 20 minutes for 300 terms.
3. **Make a draft with the Windows voice.** `python scripts/tts_cues.py ep01.txt -o draft --engine windows --lexicon words.tsv` · compare total length with the slide timing, run `srt_check.py` of `subtitles-th` on `draft/narration.srt`, and fix the script until it passes.
4. **Generate the real voice.**
   - F5: `python scripts/tts_cues.py ep01.txt -o final --engine f5 --lexicon words.tsv --f5-python <F5>/venv/Scripts/python.exe --f5-root <F5> --ref me.wav --ref-text "ข้อความที่พูดใน me.wav ตรงทุกคำ"` · `--ref` is a 5–10 second clean clip of the user's voice · `--nfe` defaults to 32, can go down to 7 for speed.
   - edge: `--engine edge --voice th-TH-PremwadeeNeural --rate=-10% --respell respell.tsv` (Niwat uses `--rate=-8%`) · install first in the job's venv: `python -m pip install edge-tts`.
   - **Tutorial or screen tour read step by step (one short text per screen):** use `--rate=-10%` · `-2%` sounded too fast to the owner (2026-11-16, Premwadee, tutorial for a point-of-sale web app) · and turn each space between Thai phrases into `, ` before sending so the voice pauses at phrase breaks, and `·` into `. ` · this is the opposite of the podcast rule in step 0, because short on-screen texts need the breaths.
   - **`NoAudioReceived` on some lines only:** on 2026-11-17 (edge-tts 7.3.1) Premwadee returned no audio for several ordinary lines ("มุมขวาบน", "ที่มุม") while Niwat read all of them; the same text failed every retry, so retrying does not help. Read those lines with Niwat, or rephrase, and tell the user which lines changed voice.
   - If the job fails midway, rerun: finished audio stays in `final/cues/` and only cues whose text or settings changed are regenerated.
5. **Listen to every cue.** Fix misread words in `words.tsv` or the script and rerun the same command.
6. **Check, then continue.** `srt_check.py final/narration.srt` passes · `narration.wav` length equals `total` in `cues.json` · adjust loudness per `video-editing` Steps item 5 (Apple Podcasts -16 LUFS) · copy each slide's `data_at` from `cues.json` into the deck, then continue per `video-editing` section "สไลด์กับเสียงบรรยาย".
7. **Tell the listeners** in the show notes or clip description that the narration was made with AI (required for Azure by the Code of Conduct for Microsoft AI Services item 3; apply it to every engine).

Failures and odd sounds (F5 `libtorchcodec`, slow CPU, vanishing English words, jerky mixed voices, short subtitles): [`references/troubleshooting.md`](references/troubleshooting.md).

## Check before done
- New machine or edited script: `python -B scripts/tts_cues.py --self-test` and `python -B scripts/term_sample.py --self-test` pass.
- The reference voice is the user's or there is written consent · the engine's rights match the use (monetized: paid Azure or Google, or check F5's terms first).
- With English terms: the user listened to the `term_sample.py` files first.
- Every cue listened to · `srt_check.py` passes · audio length equals `total` in `cues.json` · listeners told it is AI voice.

## References
- [`references/engines.md`](references/engines.md) — open when choosing an engine, or the user asks about cost, rights, or speed
- [`references/tts-engine-score.example.json`](references/tts-engine-score.example.json) — scoring input for a monetized clip (all numbers are examples)
- [`references/troubleshooting.md`](references/troubleshooting.md) — open when a run fails or sounds wrong
- [`references/test-record.md`](references/test-record.md) — open when you need timings or what was measured
- [`references/sources.md`](references/sources.md) — sources and check dates


## reference: engines.md

# Voice engines · narration-th

Full table of what was found on the test machine (2026-10-24 unless noted). SKILL.md keeps the short version. Open this when choosing an engine or when a user asks about cost, rights, or speed.

| Engine | Use for | Cost and rights | What was actually found on the test machine (2026-10-24) |
|---|---|---|---|
| F5-TTS-THAI `--engine f5` | A real-sounding voice that clones the user's voice from a 5–10 second reference clip | Free, runs locally, text does not leave the machine · code is MIT · the Thai model card says CC-BY-4.0 but the base model F5-TTS is CC-BY-NC (รอยืนยัน), so check the terms before using it for monetized clips | Needs an NVIDIA graphics card to be usable in practice · on CPU (central processing unit · Core Ultra 7 258V) 8.4 seconds of audio took 198.8 seconds at NFE 16 (NFE is the number of rounds the model refines the sound, fewer is faster) · NFE 7 took about 13.5 seconds per cue (1 cue measured · quality not yet compared by ear) · running long text on CPU nearly exhausted memory |
| edge-tts `--engine edge` | Internal work and drafts that should sound good | Free, no account needed · calls Edge's read-aloud endpoint with a token embedded in the package, not an API with a developer contract (inferred from edge-tts's code), so do not use it for monetized clips · text leaves the machine | Voices th-TH-PremwadeeNeural and th-TH-NiwatNeural · the service sometimes answers that there is no audio, and the same text passes on retry, so the script retries 3 times · reads English terms written in Thai well · the speeds the user listened to and chose are Niwat +0% and Premwadee −2% (+10%/+8% were too fast · 2026-11-09) |
| Voices that ship with Windows, such as Pattara `--engine windows` | Drafts to time and check subtitles | Free, runs locally · the Windows license (`license.rtf` on the machine, updated April 2024) does not mention distributing generated audio (รอยืนยัน) | 9 cues generated in 0.9–9.1 seconds (the first run, before PowerShell was loaded, was slower) · System.Speech cannot see this voice, it must be called through WinRT (Windows Runtime API) |
| Paid Azure AI Speech · Google Cloud TTS | Monetized clips that need clear rights | Product Terms grant the right to use generated audio including commercially "For Customers of the paid tier TTS Service only" (รอยืนยัน · answers in the Microsoft Q&A forum conflict) · Google Chirp 3 HD has a Thai voice (th-TH) · both need an account and key · prices and free quotas change often, so no figures are kept here | Not in the script yet, add it when the user has a key |
| Lunarlist via PyThaiTTS 0.8.0 | Do not use | Free · MIT | Cannot read Latin letters (Git · commit are skipped) · some phrases never stop, a 3-second phrase came out as 58 seconds |

Look up live: the Azure AI Speech and Google Cloud TTS price per million characters and Google's free monthly quota at https://cloud.google.com/text-to-speech/pricing and the Azure pricing page. Look it up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน).

## Scoring engines for a monetized clip

Apply the hard rule "clear commercial rights": first drop engines the table marks (รอยืนยัน) or does not mention, then compare cost against setup effort: `node <decision-scoring>/scripts/decide.mjs score file.json` (`<decision-scoring>` is the folder of skill `superuser:decision-desk`) · example [`tts-engine-score.example.json`](tts-engine-score.example.json) (all numbers are examples, including the Azure cost in the file, which is not a current price · ran fine 2026-10-28: dropped 2, left 2, rank 1 stayed stable when weights moved ±20%) · internal work or drafts do not need this rule · weights of 0.5/0.5 are a starting value, not measured


## reference: sources.md

# Sources · narration-th

- F5-TTS-THAI: [VYNCX/F5-TTS-THAI](https://github.com/VYNCX/F5-TTS-THAI) (code MIT · `f5_tts_webui.py` gives the NFE value and cfg strength (the weight that forces the voice to follow the text) and advice on the reference clip and English words · commit `7b0989f`) · model [VIZINTZOR/F5-TTS-THAI](https://huggingface.co/VIZINTZOR/F5-TTS-THAI) (card CC-BY-4.0) · base model [SWivid/F5-TTS](https://github.com/SWivid/F5-TTS) (CC-BY-NC because of the Emilia training data) (seen 2026-10-24)
- [rany2/edge-tts](https://github.com/rany2/edge-tts) (LGPL-3.0 · version 7.3.1 from PyPI · seen 2026-10-24)
- Google Cloud [Text-to-Speech pricing](https://cloud.google.com/text-to-speech/pricing) (look up the live price) · [Chirp 3: HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd) (has th-TH · page updated 2026-10-22)
- Azure AI Speech: [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS) section Text-to-Speech (TTS) Services, the clause on rights to use generated audio, and the pricing page (an agent searched and read them on 2026-10-24 · รอยืนยัน) · [Code of Conduct for Microsoft AI Services](https://learn.microsoft.com/en-us/legal/ai-code-of-conduct) item 3 requires disclosing that the voice is synthetic (version 4.0 · 2026-05-01 · checked 2026-10-24)
- Windows: the on-machine license `C:\Windows\System32\license.rtf` (updated April 2024 · an agent searched and read it on 2026-10-24)
- [pythainlp/pythaitts](https://github.com/pythainlp/pythaitts) 0.8.0 (Apache-2.0) · Lunarlist ONNX model (MIT) · tested 2026-10-24


## reference: test-record.md

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


## reference: troubleshooting.md

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
