---
name: narration-th
description: Use when Thai narration must come from text-to-speech
---

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

For a monetized clip, drop engines marked (รอยืนยัน) or not mentioned, then score cost against setup effort with `superuser:decision-scoring` (`decide.mjs score file.json`; example in references). Look up the live Azure and Google price at https://cloud.google.com/text-to-speech/pricing and the Azure pricing page (WebSearch/WebFetch) before quoting it; if the page will not open, mark the value (รอยืนยัน). Internal work and drafts need none of this.

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
