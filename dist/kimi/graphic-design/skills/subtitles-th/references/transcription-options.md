# Transcription options for Thai `.srt`

Open at step 2. Use one that runs locally for free first (data does not leave the machine). Installing packages and downloading models (the medium file is about 1.5 GB · large-v3 about 2.9 GB) goes under "รออนุมัติ" (awaiting approval). On the machine where this skill was written, none has actually been run yet.

| Option | License | How to get `.srt` | Thai |
|---|---|---|---|
| openai-whisper (Python) | MIT for both code and model | `whisper in.wav --model medium --language Thai --output_format srt --output_dir out` | large-v3 errs about 5.8% at character level (Common Voice 15) and 8.4% (FLEURS) per the developers |
| whisper.cpp | MIT | convert to 16-bit WAV first `ffmpeg -i in.mp3 -ar 16000 -ac 1 -c:a pcm_s16le in.wav` then `whisper-cli -m models/ggml-medium.bin -f in.wav -l th -osrt -of out` | The same model as Whisper · the default is English, so you must pass `-l th` and not use a model whose name ends in `.en` |
| faster-whisper | MIT | A library with no `.srt` writer, so you write it yourself from `segment.start` · `segment.end` · `segment.text` | Up to about 4 times faster than openai-whisper at the same accuracy, per the developers |
| Models tuned for Thai (biodatlab Mahidol University · NECTEC Pathumma · SCB 10X Typhoon) | apache-2.0 or mit · Typhoon has an added OpenTyphoon condition | These are `transformers` models with no `.srt` writer · to use with whisper.cpp or faster-whisper they must be converted first (not tested yet) | The developers report fewer errors than the original Whisper, but they were measured on different datasets and cannot be compared directly · some models say they were not made for timestamps |

The timing in subtitles from every tool must be rechecked in step 4. Every tool may add words that were not spoken (hallucination), per Whisper's own warning.
