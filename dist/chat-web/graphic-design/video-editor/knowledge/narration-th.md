# skill: narration-th

Use when Thai narration must come from text-to-speech

# narration-th — Thai narration from a script (text-to-speech)

Lives in plugin `graphic-design` · write wording per `human-writing` · the agent that does this job is `video-editor` · cutting, joining, adjusting loudness, and pairing slides with audio are in `video-editing`

> **One rule:** listen to every subtitle cue before saying done, and the reference voice used for cloning must be the user's own voice, or the voice owner must have consented in writing

## Use when

- The user does not want to record audio: generate Thai narration from the script, one cue at a time, and get subtitles and slide timing in one round

## Do not use when (use something else instead or together)

| Job | Use |
|---|---|
| Write the script in spoken language before making the audio | `speaking-script` |
| Clone the voice of a famous person or someone who has not consented | Do not do it, tell the user why it cannot be done |
| Cut, join, adjust loudness, or pair slides with audio into a video | `video-editing` |
| Thai subtitles (transcribe · check · burn in) | `subtitles-th` |

## Steps

Generate audio one cue at a time from the script, so each subtitle gets its text from the script and its timing from the real audio, with no transcription needed · write the script per `speaking-script` first

**Choose the voice engine**

| Engine | Use for | Cost and rights | What was actually found on the test machine (2026-10-24) |
|---|---|---|---|
| F5-TTS-THAI `--engine f5` | A real-sounding voice that clones the user's voice from a 5–10 second reference clip | Free, runs locally, text does not leave the machine · code is MIT · the Thai model card says CC-BY-4.0 but the base model F5-TTS is CC-BY-NC (รอยืนยัน), so check the terms before using it for monetized clips | Needs an NVIDIA graphics card to be usable in practice · on CPU (central processing unit · Core Ultra 7 258V) 8.4 seconds of audio took 198.8 seconds at NFE 16 (NFE is the number of rounds the model refines the sound, fewer is faster) · NFE 7 took about 13.5 seconds per cue (1 cue measured · quality not yet compared by ear) · running long text on CPU nearly exhausted memory |
| edge-tts `--engine edge` | Internal work and drafts that should sound good | Free, no account needed · calls Edge's read-aloud endpoint with a token embedded in the package, not an API with a developer contract (inferred from edge-tts's code), so do not use it for monetized clips · text leaves the machine | Voices th-TH-PremwadeeNeural and th-TH-NiwatNeural · the service sometimes answers that there is no audio, and the same text passes on retry, so the script retries 3 times · reads English terms written in Thai well · the speeds the user listened to and chose are Niwat +0% and Premwadee −2% (+10%/+8% were too fast · 2026-11-09) |
| Voices that ship with Windows, such as Pattara `--engine windows` | Drafts to time and check subtitles | Free, runs locally · the Windows license (`license.rtf` on the machine, updated April 2024) does not mention distributing generated audio (รอยืนยัน) | 9 cues generated in 0.9–9.1 seconds (the first run, before PowerShell was loaded, was slower) · System.Speech cannot see this voice, it must be called through WinRT (Windows Runtime API) |
| Paid Azure AI Speech · Google Cloud TTS | Monetized clips that need clear rights | Product Terms grant the right to use generated audio including commercially "For Customers of the paid tier TTS Service only" (รอยืนยัน · answers in the Microsoft Q&A forum conflict) · Google Chirp 3 HD has a Thai voice (th-TH) · both need an account and key · prices and free quotas change often, so no figures are kept here (see the line below the table) | Not in the script yet, add it when the user has a key |
| Lunarlist via PyThaiTTS 0.8.0 | Do not use | Free · MIT | Cannot read Latin letters (Git · commit are skipped) · some phrases never stop, a 3-second phrase came out as 58 seconds |

Look up live: the Azure AI Speech and Google Cloud TTS price per million characters and Google's free monthly quota at https://cloud.google.com/text-to-speech/pricing and the Azure pricing page. Look it up live (WebSearch/WebFetch) before using it; if the page will not open, mark the value (รอยืนยัน).

**When choosing an engine for a monetized clip,** apply the hard rule "clear commercial rights": first drop engines the table marks (รอยืนยัน) or does not mention, then compare cost against setup effort: `node <decision-scoring>/scripts/decide.mjs score file.json` (`<decision-scoring>` is the folder of skill `superuser:decision-scoring`) · example [`references/tts-engine-score.example.json`](references/tts-engine-score.example.json) (all numbers are examples, including the Azure cost in the file, which is not a current price · ran fine 2026-10-28: dropped 2, left 2, rank 1 stayed stable when weights moved ±20%) · internal work or drafts do not need this rule · weights of 0.5/0.5 are a starting value, not measured

0. **Write a podcast script this way (no hook and CTA from `speaking-script`).** Listeners come for the content, not for a welcome
   - The first sentence goes straight into the content: no greeting, no introducing yourself or the show, no saying what this episode is about
   - Do not talk to the listener: no questions back, no invitation to follow or comment, no sign-off · close with a final content sentence
   - 1 idea per sentence · cut modifiers, repeated connectors, and going back over what was just said · say each piece of information once
   - **1 line in the file = 1 complete sentence.** Do not chop a sentence mid-phrase with `|`, because each line is one reading pass and the voice falls and pauses every time · a podcast has no on-screen subtitles, so it may skip the 35-characters-per-line limit, and use `--gap 0.15`
   - No spaces inside a sentence (spaces are allowed only between sentences on new lines), because a space is where the engine pauses to breathe · `tts_cues.py` already strips spaces between Thai letters before sending to the engine, but the subtitle still shows the text as written
   - Numbers may be written as Arabic digits (year 2569 · 1,250,000 · 3.5), and `tts_cues.py` converts the whole number to Thai words · a year is read as a whole number (สองพันห้าร้อยหกสิบเก้า), not split in half · a number starting with 0 is read digit by digit · a number attached to Latin letters (ESP32) is left alone, use `words.tsv`
1. **Split the script into cues.** Write per `speaking-script`, then make 1 line = 1 cue, at most 35 characters per line, using `|` to split into 2 lines · put `[สไลด์ n]` (slide n) before the line where the slide changes · a line starting with `#` is a note the engine does not read
2. **Make the pronunciation file** `words.tsv`, one line per `word<TAB>reading` (`คำ<TAB>คำอ่าน`), for English words, proper names, and abbreviations, such as `Git<TAB>กิต` · the engine reads by the reading, but the subtitle still shows the original word · English words match regardless of case · lines starting with `#` and the header row (`คำ` or `word`) are skipped · numbers: `tts_cues.py` converts Arabic digits to Thai words for every engine (years, whole numbers, decimals, numbers starting with 0), and you check by ear in step 5 · a number that can be read several ways but not this way (for example 2569 that you want read split as "ยี่สิบห้า หกสิบเก้า") is written out as words in the script
   - **The reading is right but the audio reads it wrong:** put it in `respell.tsv`, one line per `reading<TAB>spelling that sounds right to the ear` (`คำอ่าน<TAB>คำที่สะกดให้หูได้ยินถูก`), such as `คอนโทรลเลอร์<TAB>คอนโทรเล่อ` · `ซิงเกิลบอร์ด<TAB>ซิงเกิ้ลบอร์ด` (tone marks and spacing help place stress and pauses correctly) · kept apart from `words.tsv` because readings apply to every engine, while respelling applies only to a voice that was heard to be wrong
   - **Listen to every term before generating the whole episode** (edge) `python scripts/term_sample.py --lexicon words.tsv --respell respell.tsv --script ep01.txt -o terms` gives `term-sample-male.mp3` and `term-sample-female.mp3`, read one term at a time like "1, คอนโทรเล่อ", and `term-sample-list.md` that pairs numbers with terms · the user says the numbers of the wrong terms, you fix them in `respell.tsv` and rerun, regenerating only the changed terms · listening to 300 terms takes about 20 minutes, faster than listening to a whole episode hunting for wrong words
3. **Make a draft with the Windows voice first.** `python scripts/tts_cues.py ep01.txt -o draft --engine windows --lexicon words.tsv` · look at the total length against the slide timing, then run `srt_check.py` of `subtitles-th` on `draft/narration.srt` and fix the script until it passes
4. **Generate the real voice**
   - F5: `python scripts/tts_cues.py ep01.txt -o final --engine f5 --lexicon words.tsv --f5-python <F5>/venv/Scripts/python.exe --f5-root <F5> --ref me.wav --ref-text "ข้อความที่พูดใน me.wav ตรงทุกคำ"`
   - `--ref` is a 5–10 second clip of the user's voice with no noise · `--nfe` defaults to 32 and can drop as low as 7 for speed, which the F5-TTS-THAI web page says still sounds acceptable
   - edge: `--engine edge --voice th-TH-PremwadeeNeural --rate=-2% --respell respell.tsv` (Niwat uses `--rate=+0%`) · `edge-tts` must be installed in the job's venv first (`python -m pip install edge-tts`)
   - If the job fails midway, you can rerun · finished audio is kept in `final/cues/`, and the script regenerates only cues whose text or settings changed
5. **Listen to every cue.** Note words read wrongly, fix them in `words.tsv` or in the script, then rerun the same command
6. **Check, then continue.** `srt_check.py final/narration.srt` must pass · the length of `narration.wav` must equal `total` in `cues.json` · adjust loudness per `video-editing` Steps item 5 (Apple Podcasts -16 LUFS) · copy each slide's `data_at` from `cues.json` into the deck, then continue per `video-editing` section "สไลด์กับเสียงบรรยาย" (slides with narration)
7. **Tell the listeners** in the show notes or clip description that the narration was made with AI (Code of Conduct for Microsoft AI Services item 3 requires it for Azure · apply it to every engine for transparency)

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

## Real example

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

## Check before sending

- [ ] New machine or edited script: `python -B scripts/tts_cues.py --self-test` and `python -B scripts/term_sample.py --self-test` pass (term_sample tested 2026-11-10) (tested 2026-10-28 from the new path after the skill was split out · ffmpeg 9.0.2)
- [ ] Narration from a script: the reference voice is the user's or there is a written consent · the engine's rights match the use (for a monetized clip, use paid Azure or Google, or check F5's terms first)
- [ ] Narration from a script: with English terms → have the user listen to the files from `term_sample.py` first · listen to every cue · `srt_check.py` passes · the audio file's length equals `total` in `cues.json` · listeners have been told it is AI voice

## Sources

- F5-TTS-THAI: [VYNCX/F5-TTS-THAI](https://github.com/VYNCX/F5-TTS-THAI) (code MIT · `f5_tts_webui.py` gives the NFE value and cfg strength (the weight that forces the voice to follow the text) and advice on the reference clip and English words · commit `7b0989f`) · model [VIZINTZOR/F5-TTS-THAI](https://huggingface.co/VIZINTZOR/F5-TTS-THAI) (card CC-BY-4.0) · base model [SWivid/F5-TTS](https://github.com/SWivid/F5-TTS) (CC-BY-NC because of the Emilia training data) (seen 2026-10-24)
- [rany2/edge-tts](https://github.com/rany2/edge-tts) (LGPL-3.0 · version 7.3.1 from PyPI · seen 2026-10-24)
- Google Cloud [Text-to-Speech pricing](https://cloud.google.com/text-to-speech/pricing) (look up the live price) · [Chirp 3: HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd) (has th-TH · page updated 2026-10-22)
- Azure AI Speech: [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS) section Text-to-Speech (TTS) Services, the clause on rights to use generated audio, and the pricing page (an agent searched and read them on 2026-10-24 · รอยืนยัน) · [Code of Conduct for Microsoft AI Services](https://learn.microsoft.com/en-us/legal/ai-code-of-conduct) item 3 requires disclosing that the voice is synthetic (version 4.0 · 2026-05-01 · checked 2026-10-24)
- Windows: the on-machine license `C:\Windows\System32\license.rtf` (updated April 2024 · an agent searched and read it on 2026-10-24)
- [pythainlp/pythaitts](https://github.com/pythainlp/pythaitts) 0.8.0 (Apache-2.0) · Lunarlist ONNX model (MIT) · tested 2026-10-24
