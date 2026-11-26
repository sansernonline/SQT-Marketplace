# skill: voice-agent

Use when building a realtime voice agent or phone bot

# voice-agent — design and build Thai voice agents that answer fast and never lie to the customer

Provider, price and framework tables: [`thai-speech-options`](references/thai-speech-options.md).

> **The one rule:** every stage of the call must stream into the next, and each stage's time must be measurable on its own. The agent must never say that something succeeded (booked · cancelled · transferred) until the tool replies that it succeeded. A fast answer that says something untrue is worse than a slow one.

## When to use

- Building a system that answers or makes phone calls where an AI talks to people by voice in realtime, over a real number (SIP) or over web and app (WebRTC)
- Choosing STT · TTS · LLM · a framework for Thai, or setting a latency budget such as "answer within 800 ms"
- Fixing an agent that talks over the customer, fails to stop when interrupted (barge-in), stops itself because it hears its own echo, or mishears Thai names, dates and times
- The user says "voice bot" · "AI รับโทรศัพท์" · "callbot" · "ให้ AI คุยกับลูกค้าทางโทรศัพท์"

Do not use for: narration from a script into a file → `graphic-design:narration-th` · transcribing a recorded clip → `graphic-design:subtitles-th` · a text chatbot in LINE → `e-commerce:line-chatbot` · general prompt design, RAG and LLM evals with no voice → `llm-engineering`

## 1 · Ask everything once, at the start

Ask only the questions whose answers change the whole architecture. Skip any the user has already answered.

1. Channel: a real number over a SIP trunk · web or app over WebRTC · or both
2. Whether customer voice may leave the country (decides if a foreign cloud is allowed, or STT/TTS must run in Thailand)
3. What 800 ms is measured at: p50 (half of calls are faster than this) or p95 (95 of 100 calls are faster) · the recommended value is p95 because customers remember the slow calls
4. When the agent is unsure, who takes over, during which hours, and what happens outside those hours

## 2 · Lay out the whole pipeline before choosing brands

```
customer → SIP trunk or WebRTC → VAD and end-of-speech decision → streaming STT → agent (LLM + tool)
         ← play audio ← streaming TTS ← split into sentences ← tokens, word by word
call and appointment events → Kafka → CRM · LINE notification system
```

Every arrow must pass small chunks continuously. It must not wait for the previous stage to finish a whole block. If any stage waits for a whole block, the 800 ms budget runs out at that stage alone.

## 3 · Build the latency budget before writing code

Definition: **from the customer's last word to the first sound of the agent that the customer hears**. This includes the time the system waits in silence to decide the customer has finished. A team that counts from the moment STT sends the text gets a number better than what the customer actually feels.

Label `ตัวอย่าง` (example): this budget is adapted from Pipecat's measured table (total 1,293 ms, of which the first LLM token took 650 ms) and from framework defaults. Measure the real system in step 8, then correct the budget.

| Stage | Budget (ms) | How to hit it |
|---|---|---|
| Inbound network (including jitter buffer) | 60 | Place servers in a region close to the caller and to the SIP trunk connection point. How much the telephone carrier's network adds (ยังไม่ได้ตรวจ) must be measured yourself. |
| Silence wait to decide end of speech | 200 | **This value is a trade-off.** A shorter wait answers faster but cuts off people who pause mid-sentence, for example while giving a phone number or recalling a day. Google recommends 500–800 ms for the Live API, while Pipecat sets `stop_secs` to 0.2 seconds. In LiveKit `vad` mode the system waits for the larger of the VAD silence and `endpointing.min_delay`, so you must lower both Silero `min_silence_duration` (default 0.55 seconds) and `min_delay` (default 0.5 seconds). Lowering only one has no effect. If step 8 shows frequent mid-sentence cuts, widen this stage and cut the budget of other stages instead, especially the first LLM token. |
| STT sends the final text after speech ends | 100 | Use streaming STT that sends results while the customer speaks, not a file of the whole sentence. |
| First LLM token | 250 | Small fast model · short, fixed prompt so it can be cached · turn on preemptive generation (start composing the answer before it is sure the customer has finished). |
| Collect the first sentence | 20 | Send to TTS as soon as the first sentence or phrase arrives. Do not wait for the whole answer. |
| First TTS byte | 110 | Streaming TTS · open the websocket in advance and reuse it · request audio as `MULAW` 8 kHz to match the phone line so no conversion is needed. |
| Outbound network and playback | 60 | Same as inbound. |
| **Total** | **800** | |

Techniques when the budget is short:

- **Filler while waiting for a tool**: if a tool is called and has not replied within about 300 ms (ตัวอย่าง), speak a short phrase that promises nothing, such as "ขอเช็กตารางคุณหมอสักครู่นะคะ". Never use a phrase that states a result, such as "ได้ค่ะ จองให้เลย". The phrase must stop immediately when the tool replies or when the customer interrupts.
- **Speech-to-speech models** (Gemini Live · OpenAI Realtime) cut the number of stages, but they give less control over how names and Thai times are read, and you cannot time each stage separately. They must pass the step 8 criteria before you choose one.

## 4 · Pick Thai STT and TTS from the table, not from memory

Open [`thai-speech-options`](references/thai-speech-options.md) and filter by the answer to question 2 in step 1. Common mistakes:

- **Amazon Polly has no Thai.** If you use AWS for STT (Transcribe supports streaming Thai), pick another provider for TTS.
- **Google Chirp 3 supports streaming Thai but is still in Preview and exists only in regions `us` and `eu`**, so the voice leaves the country.
- **No self-hostable streaming Thai TTS is confirmed yet.** F5-TTS-THAI and edge-tts in `narration-th` work file by file, not in realtime.
- Self-hosted STT on GPU: Typhoon ASR Real-time (114M · CC-BY-4.0) was built for streaming Thai. whisper_streaming has a 3.3-second delay according to research, so it cannot meet this budget.
- Self-host when (1) voice must not leave the country, or (2) monthly minutes are high enough that the machines cost less. Count the GPU that must stay on to take calls through business hours, not only the minutes actually used. Node pool and autoscale follow `kubernetes-helm`.
- Put prices in documents together with a link and the date checked, every time. Never use a price from memory.
- Whisper for Thai (an example from a teaching project, as reported by that project's readme, with no measured result seen): the value `compression_ratio_threshold=2.4` is set for Latin script. Thai text naturally exceeds it, so Whisper transcribes again and runs 2 times slower. The learners changed it to 3.3. Also, Whisper writes "สองจุดห้า" as "2.5", so convert Thai digits, Arabic digits and spelled-out words to one form before measuring CER (Character Error Rate). Otherwise the score is wrong.

## 5 · Turn-taking and barge-in

1. **Decide the customer has finished**: LiveKit's turn detector does not support Thai, in either the text model or the audio model, so set `turn_detection="vad"` or `"stt"`. Silero VAD accepts 8 kHz audio directly and takes under 1 ms per 30 ms chunk on CPU.
2. **When the customer interrupts, do all 4 things at the same moment**: (1) stop playing audio immediately (2) clear the audio queue that was generated but not yet played (3) cancel the pending LLM answer and TTS jobs (4) trim the conversation history to only what the customer actually heard. If you skip (2) the customer hears a leftover piece of the old audio. If you skip (4) the agent believes it stated all the conditions when the customer never heard them. LiveKit and Pipecat do these 4 for you. If you write your own transport, you must do every one yourself.
3. **A tool that writes data (booking) must never be cancelled silently midway**: Pipecat sets `cancel_on_interruption` to `True` by default. If the booking command reached the appointment system and was then cancelled, we would not know the result. Register the booking tool with `llm.register_function("book_appointment", handler, cancel_on_interruption=False)` or `@tool_options(cancel_on_interruption=False)`. Give the booking tool an idempotency key (a repeated call gives the same result), let it run to completion, and report the result on the next turn. A read-only tool (checking the schedule) may be cancelled.
4. **Guard against false interruptions** (a cough · "อืม" · "ค่ะ ๆ" · road noise): set a minimum audio length before counting it as an interruption. LiveKit has `false_interruption_timeout`, which resumes the previous speech when no words follow. The word counter (`min_words`) splits words on spaces, so a Thai sentence without spaces may count as one word (อนุมาน). Test with real audio, and if the count is wrong, use audio length instead.
5. **Echo**: if the agent's voice feeds back into the microphone, VAD thinks the customer is speaking and the agent stops itself mid-sentence. On the web, use the WebRTC echo cancellation in the browser. On phone lines, test with a real mobile speaker and a landline before launch, then count the false-interruption rate in step 8.

## 6 · The agent's script and tools

- **Short, fixed prompt**: rules, role and example phrases go in the unchanging beginning, and call data goes at the end, so the prompt can be cached and the first token is fast.
- **Answer in spoken language, with a short first sentence**: a short first sentence lets TTS start sooner. Do not use headings, lists or symbols that cannot be read aloud.
- **Never confirm before the tool succeeds**: the correct order is repeat the details back → the customer agrees → call the booking tool → the tool replies with success and an appointment number → only then say "จองเรียบร้อยแล้วค่ะ". If the tool fails or times out, say plainly that the booking has not succeeded, then offer a transfer or a call back.
- **Thai dates and times**: tools always take ISO 8601 values (`2026-11-05T14:00:00+07:00`). Have the LLM convert from speech, then repeat it back in Thai before booking, for example "วันพฤหัสบดีที่ 5 พฤศจิกายน เวลาบ่ายสองโมงนะคะ". Terms the test set must include: B.E. years (2569 is C.E. 2026) · "บ่ายสอง" = 14:00 · "สองทุ่ม" = 20:00 · "เที่ยง" · "พฤหัสหน้า" · "มะรืน". For nicknames and names with several spellings, repeat the spelling back.
- **Write numbers as words before TTS**: Google Chirp 3 HD streaming and Azure text streaming do not accept SSML, so you cannot control number reading with SSML. Convert times, phone numbers and appointment numbers into spoken words before sending.
- **Hand over to a person** when (1) STT is unsure or cannot make out the words twice (2) the customer asks for a person (3) the topic is out of scope, such as severe pain (4) a tool fails repeatedly. Transfer cold (SIP REFER) or warm (the agent briefs the staff member before connecting). Send the call summary along so the customer does not have to explain again.

## 7 · Personal data and phone calls in Thailand

- **Say so before recording**: PDPA (Personal Data Protection Act) section 23 requires notice before or at the time of collection of what is collected, why, for how long, and to whom it is disclosed. Make the first sentence of the call say that this call is recorded and automated, and point to where the full notice can be read.
- **The audio retention period must be a number**: the law sets no number of days, but section 23(3) requires notice of the period, and section 37(3) requires a system to delete when the period ends or the data is no longer needed. The system owner chooses the number. Mark it `(รอยืนยัน)` (awaiting confirmation) until decided, then set an automatic deletion job. "Keep it in case we train a model" is not a stated purpose. To use it that way, you must give notice and have a separate legal basis.
- **Symptoms are health data**: section 26 forbids collecting without explicit consent (with limited exceptions). An appointment agent asks only the type of service (scaling · filling · toothache) and does not probe for detailed symptoms. A transcript that contains symptoms must be protected like a medical record.
- **Sending voice abroad**: a cloud that processes outside Thailand falls under section 28, which requires the destination country to have adequate protection standards or the case to meet an exception. List which region the voice and transcripts go to, then have `pdpa-compliance` decide.
- **A phone number is personal data**: logs and events keep only the last 4 digits or a hashed value. Audio files stay out of logs and Kafka. Keep them in encrypted storage and refer to them by id.
- **SIP trunk**: buy numbers from a licensed provider in Thailand, and ask the provider itself whether SIP can connect to a cloud. The licensing conditions of the NBTC (กสทช., the National Broadcasting and Telecommunications Commission) on this matter (ยังไม่ได้ตรวจ). Restrict the inbound trunk to accept only the provider's IPs. Every SIP password and key lives in a secret store.

## 8 · Measure

| Metric | How to measure | Starting threshold |
|---|---|---|
| Whole-call latency, p50 and p95 | Time from the customer's last word to the agent's first sound, for every turn | As in step 1, question 3 |
| Per-stage latency, p50 and p95 | One span per stage from the step 3 table, in one trace per call (`observability-basics`) | Know which stage exceeds its budget |
| Time to stop when interrupted | From the customer starting to speak to the agent going silent | Aim for a few hundred ms (ตัวอย่าง), then measure for real |
| Mid-sentence cut rate | Times the system decided the customer finished when they had not ÷ number of turns, looking at turns that ask for a phone number and name separately | Decides whether the 200 ms silence in step 3 is too short |
| Successful interruption rate | Times the agent stopped and answered the new topic ÷ times the customer meant to interrupt | Measured from a test audio set |
| False interruption rate | Times the agent stopped by itself when the customer did not mean to interrupt (echo · "อืม" · ambient sound) | Lower is better. Measure on both a mobile speaker and a landline. |
| Accuracy of names, dates, times | A test audio set with B.E. years · "บ่ายสอง" · "พฤหัสหน้า" · nicknames, compared with the value sent to the tool | The value sent to the tool must be correct before every booking |
| Confirmation before tool success | Count from transcripts how many times a confirmation came before a successful tool result | 0 times |
| Handover rate and reasons | Handover events with their reasons | Watch the weekly trend |

## 9 · Events to other systems

- Emit per-call events of at least `call.started` · `call.ended` · `appointment.booked` · `appointment.failed` · `call.handed_off`. Every event carries an `event_id` so the receiver can drop duplicates, because events can be delivered twice.
- The payload holds the call id, appointment id, time, result and last 4 digits of the number. It holds no audio file, full transcript or symptoms.
- `appointment.booked` is sent only after the appointment system replies with success. The LINE notification system and the CRM take their input from this event, not from what the agent says.
- Topic · partition key · retry follow `kafka-streaming`. Reminders over LINE or SMS follow `notifications`; the agent never sends them itself.

## Check before sending

1. Every stage of the pipeline streams, and there is a latency budget table that defines the count from the customer's last word.
2. No script or flow says it is booked before the tool replies with success. A tool that writes data has an idempotency key and is not cancelled midway.
3. Interruption does all 4 things (stop audio · clear the queue · cancel the pending answer · trim the history), and there is a way to guard against false interruptions and echo.
4. No turn detector that lacks Thai support is used. Amazon Polly is not proposed for Thai voice.
5. The first sentence says the call is recorded · the audio retention period is a number or `(รอยืนยัน)` · no symptom questions beyond need · the document names the region of every destination that receives voice, transcripts and text sent to the LLM.
6. Every price, model and framework value has a link and the date checked, or the label `(ยังไม่ได้ตรวจ)`.
7. STT · TTS · SIP keys are in a secret store · logs and events hold no full number, audio file or symptoms.
8. There is a measurement plan following the step 8 table, including a test audio set of Thai dates and times.

## References

- [`references/worked-example.md`](references/worked-example.md) — open when you want a full dental-clinic example of the steps
- [`references/sources.md`](references/sources.md) — open when you must re-check a dated fact or link


## reference: sources.md

# Sources · voice-agent

All links viewed on 2026-10-27. The full provider tables with links are in [`thai-speech-options`](thai-speech-options.md).

- The measured latency table totaling 1,293 ms and the 1,500 ms target for general conversation: [Voice AI & Voice Agents (Pipecat)](https://voiceaiandvoiceagents.com/) viewed 2026-10-27. The 800 ms budget in step 3 is a budget this skill adjusted itself.
- LiveKit: [telephony](https://docs.livekit.io/telephony/) · [turns and interruptions](https://docs.livekit.io/agents/build/turns/) · [turn detector supported languages](https://docs.livekit.io/agents/build/turns/turn-detector/) · [preemptive generation and endpointing](https://docs.livekit.io/agents/logic/turns/tuning/)
- Pipecat: [VAD and speech input](https://docs.pipecat.ai/guides/learn/speech-input) · [interruptions](https://docs.pipecat.ai/pipecat/fundamentals/interruptions)
- Silero VAD: [GitHub](https://github.com/snakers4/silero-vad)
- Gemini Live API interruptions and VAD: [Live API guide](https://ai.google.dev/gemini-api/docs/live-guide) · OpenAI Realtime VAD: [realtime-vad](https://developers.openai.com/api/docs/guides/realtime-vad)
- Azure on lowering TTS latency: [how-to-lower-speech-synthesis-latency](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-lower-speech-synthesis-latency)
- พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act, B.E. 2562 [2019]) sections 23 · 26 · 28 · 37: [unofficial translation, Ministry of Digital Economy and Society](https://www.mdes.go.th/law/detail/3577-Personal-Data-Protection-Act-B-E--2562-2019-)
- SIP trunk and number licensing in Thailand: (ยังไม่ได้ตรวจ)


## reference: thai-speech-options.md

# STT · TTS · framework options for a Thai voice agent

An extension of steps 3 and 4 of [`voice-agent`](../SKILL.md) · every value was checked from official pages on 2026-10-27 · prices are in US dollars (USD), list prices, excluding discounts (for providers with price tiers, the first tier) · prices and status change often; before quoting a customer, open the links and look again · a field marked `(ยังไม่ได้ตรวจ)` (not yet checked) means it has not been seen from an official source; never fill it in yourself

## 1 · Streaming Thai Speech-to-Text (STT)

| Service | streaming | Thai | self-hostable | price per minute | Good to know | Source |
|---|---|---|---|---|---|---|
| Google Cloud Speech-to-Text, Chirp 3 model | ✓ `StreamingRecognize` | ✓ `th-TH`, status Preview | ✗ | 0.016 (V2 standard, first 500,000 minutes per month) | available only in regions `us` and `eu`, so audio leaves the country and must pass PDPA section 28 · `chirp_2` is available at `asia-southeast1` | [Chirp 3 model](https://docs.cloud.google.com/speech-to-text/docs/models/chirp-3) · [supported languages](https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages) · [pricing](https://cloud.google.com/speech-to-text/pricing) |
| Azure AI Speech | ✓ real-time | ✓ `th-TH` | ✗ (a container version exists, but whether it supports Thai has not been checked) | 1.00 per hour (about 0.017 per minute · S1 Speech To Text · Southeast Asia) | the language table says it applies to real-time but has no separate column; try a real call before promising | [supported languages](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt) · [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) |
| Amazon Transcribe | ✓ | ✓ `th-TH` batch and streaming | ✗ | 0.0001667 per second (about 0.01 per minute · a single price with no tiers · SKU `StreamingAudio` in both Singapore and us-east-1 from the Price List API published 2026-09-11 · discount tiers exist only for Call Analytics) | Thai has no `*` mark, so it is not in the list of regions where streaming is disabled, which includes `ap-southeast-7` (Thailand) (`อนุมาน` (inferred) from the footnote) | [supported languages](https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html) · [Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/transcribe/current/ap-southeast-1/index.json) |
| OpenAI `gpt-realtime-whisper` · `gpt-live-transcribe` | ✓ live transcription | (ยังไม่ได้ตรวจ) | ✗ | 0.017 | no official language list seen yet | [pricing](https://developers.openai.com/api/docs/pricing) |
| Typhoon ASR Real-time (SCB 10X) | ✓ designed for streaming | ✓ Thai only | ✓ runs on CPU too, with an example `--device cuda` | free (you pay only for the machine) | 114M parameters · FastConformer-Transducer · CC-BY-4.0 license and you must accept the OpenTyphoon terms · the example on the model page transcribes from a file; the streaming run code (not yet checked) · the accuracy figures come from the developers themselves | [model page](https://huggingface.co/typhoon-ai/typhoon-asr-realtime) · [arXiv paper 2601.13044](https://arxiv.org/abs/2601.13044v1) |
| whisper_streaming (ÚFAL) | ✓ LocalAgreement style | as Whisper | ✓ | free | the research reports a latency of 3.3 seconds, far over the 800 ms budget · the README says it has been replaced by SimulStreaming | [GitHub](https://github.com/ufal/whisper_streaming) |

## 2 · Streaming Thai Text-to-Speech (TTS)

| Service | streaming | Thai voice | self-hostable | price per 1 million characters | Good to know | Source |
|---|---|---|---|---|---|---|
| Google Cloud TTS, Chirp 3 HD | ✓ streaming synthesis outputs `MULAW` `ALAW` `PCM` `OGG_OPUS` | ✓ `th-TH` | ✗ | 30 (first 1 million characters free) | streaming does not accept SSML, so you cannot control how numbers are read with SSML; write them out as words before sending · `MULAW` works directly with phone lines | [Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd) · [pricing](https://cloud.google.com/text-to-speech/pricing) |
| Azure AI Speech | ✓ sends audio chunk by chunk · accepts streaming text through `TextStream` on websocket v2 | ✓ `th-TH-PremwadeeNeural` · `th-TH-NiwatNeural` · `th-TH-AcharaNeural` · Neural HD `th-TH-Krit` · `th-TH-Nattapong` | ✗ | 15 (S1 Neural) · 22 (Neural HD) | text streaming does not accept SSML · connect the websocket in advance and reuse the synthesizer | [languages and voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) · [lower latency](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-lower-speech-synthesis-latency) · [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) |
| Amazon Polly | — | ✗ Thai is not in the list | ✗ | — | Transcribe can be used on the STT side, but for TTS pick another provider | [Polly languages](https://docs.aws.amazon.com/polly/latest/dg/supported-languages.html) |
| F5-TTS-THAI · edge-tts | ✗ generates one file at a time | ✓ | F5 can be self-hosted | free | for making narration from a script, not realtime · F5 on CPU is several times slower than real time · edge-tts has no contract for developers (details in `narration-th`) | `graphic-design:narration-th` |
| Self-hosted Thai TTS that can stream | (ยังไม่ได้ตรวจ) | | | | no open model has yet been found that is confirmed to send the first byte fast enough; if audio must stay in the country, measure the first-byte time of TTS on a real GPU before deciding | — |

## 3 · Models that take speech and answer in speech natively (speech-to-speech)

| Service | Thai | Price | Barge-in (interruption) | Source |
|---|---|---|---|---|
| Gemini Live API (`gemini-3.8-live` is the default model for a voice agent) | ✓ code `th` is among 99 languages | (ยังไม่ได้ตรวจ) | server-side VAD is on by default · on barge-in the answer being generated is cancelled and `interrupted` is sent; our side must stop playback and clear the queue itself · `silenceDurationMs` of 500–800 ms is recommended, with a value inside about 800 ms | [Live API guide](https://ai.google.dev/gemini-api/docs/live-guide) |
| OpenAI Realtime (`gpt-realtime-2.1` · `gpt-realtime-2.1-mini`) | (ยังไม่ได้ตรวจ) | audio in 32 · audio out 64 per 1 million tokens (mini 10 and 20) | `server_vad` (cuts on silence) or `semantic_vad` (looks at the speech) · has `interrupt_response` | [pricing](https://developers.openai.com/api/docs/pricing) · [VAD](https://developers.openai.com/api/docs/guides/realtime-vad) |

The advantage of this kind is that you do not wire up STT → LLM → TTS yourself. The drawbacks are less control over how Thai names and times are read, no way to measure each stage separately, and audio going abroad. Use it when a Thai test passes the criteria for names, dates and times in step 8 of SKILL.md.

## 4 · Frameworks that handle SIP · WebRTC · turn-taking · barge-in

| Topic | LiveKit Agents | Pipecat |
|---|---|---|
| Telephony | a SIP trunk connects into a room · an inbound trunk can restrict by IP or number · a dispatch rule picks the room for the caller · cold transfer (SIP REFER) and warm transfer (agent-assisted) · DTMF per RFC 4733 · tested with Twilio Telnyx Plivo Sinch and others | has its own transport (SIP details not checked in this round) |
| Deciding the customer has finished speaking | the default is a turn detector model which **does not support Thai**, in both the text model (14 languages) and the audio model (14 languages), so you must set `turn_detection="vad"` or `"stt"` · `endpointing.min_delay` default 0.5 seconds · `max_delay` 3.0 seconds · in `vad` mode the system waits for the larger of the VAD silence and `min_delay` · LiveKit's Silero sets `min_silence_duration` 0.55 · `min_speech_duration` 0.05 · `activation_threshold` 0.5 · `sample_rate` 16000 (accepts only 8000 and 16000) | Silero VAD `start_secs` and `stop_secs` default 0.2 seconds · whether Smart Turn supports Thai (ยังไม่ได้ตรวจ) |
| On barge-in | stops the agent's audio and trims the conversation history to only what the customer heard · `false_interruption_timeout`, then continues from where it was (`resume_false_interruption`) · `min_duration` · `min_words` | sends an `InterruptionFrame` both ways · cancels the LLM answer being generated · TTS stops and drops what is queued · the transport drops audio not yet played · a function call set with `cancel_on_interruption=True` is cancelled (default is `True` · for a tool that must run to completion, set `False` in `register_function` or `@tool_options`) · text that was not spoken does not enter the context |
| Reducing latency | preemptive generation is on by default · `preemptive_tts` is off by default | — |
| Preventing false barge-in | `false_interruption_timeout` · `min_words` (works when there is STT) | `MinWordsUserTurnStartStrategy(min_words=3)` · filter with Krisp VIVA · mute strategy |

Sources: [LiveKit telephony](https://docs.livekit.io/telephony/) · [LiveKit turns](https://docs.livekit.io/agents/build/turns/) · [LiveKit turn detector](https://docs.livekit.io/agents/build/turns/turn-detector/) · [LiveKit tuning](https://docs.livekit.io/agents/logic/turns/tuning/) · [LiveKit VAD](https://docs.livekit.io/agents/build/turns/vad/) · [Pipecat function calling](https://docs.pipecat.ai/guides/learn/function-calling) · [Pipecat speech input](https://docs.pipecat.ai/guides/learn/speech-input) · [Pipecat interruptions](https://docs.pipecat.ai/pipecat/fundamentals/interruptions) · all viewed 2026-10-27

**Thai has no spaces between words**, so a word counter (`min_words`) that splits on whitespace may count a whole Thai sentence as one word (`อนุมาน` (inferred) · not tested with the real framework) · test with real audio before use; if it counts wrong, use audio length (`min_duration`) or character count instead.

## 5 · Voice Activity Detection (VAD)

Silero VAD: audio chunks of 30 ms or more take under 1 ms on 1 CPU thread · accepts 8,000 Hz and 16,000 Hz (8 kHz phone lines work directly) · trained on speech in more than 6,000 languages · the README says MIT, but the badge has CC BY-NC 4.0 text mixed in; check the LICENSE file before commercial use · [GitHub](https://github.com/snakers4/silero-vad) viewed 2026-10-27


## reference: worked-example.md

# Worked example · voice-agent

Label `ตัวอย่าง`: a real request from a user. It has not been built or measured on a live system. Every number in this section must be replaced by a measured value.

**Request:** a dental clinic wants an AI to answer appointment calls in Thai in realtime. It takes calls over a SIP trunk and WebRTC · the customer can interrupt · it answers within 800 ms · it sends call and appointment events through Kafka to the CRM and LINE notifications · STT and TTS run on a GPU node pool.

**What was done:**

1. Asked everything once and got these answers: voice must not leave the country · 800 ms is measured at p95 · outside business hours, take a callback number and promise a call back.
2. Chose LiveKit Agents because it has SIP trunk · dispatch rule · cold and warm transfer built in. Set `turn_detection="vad"` with Silero VAD because the turn detector does not support Thai. Lowered Silero `min_silence_duration` from 0.55 and `endpointing.min_delay` from 0.5, both to 0.2 seconds, because `vad` mode waits for the larger value. Then measured the mid-sentence cut rate while customers give phone numbers. If it is high, widen the wait and cut the LLM budget instead.
3. STT uses Typhoon ASR Real-time on a GPU node pool in Thailand. No self-hostable streaming Thai TTS is confirmed, so offered the user 2 options: (a) measure self-hosted TTS on GPU against the 110 ms first-byte budget first, or (b) use Azure TTS `th-TH-PremwadeeNeural` and have `pdpa-compliance` decide on sending text abroad. The LLM receives transcripts that may contain names and symptoms, so it must stay in Thailand like STT: either run an open model on the same GPU node pool, or use a provider with a region in Thailand (model and provider `(รอยืนยัน)`). Recorded as an item awaiting approval.
4. 2 tools: `check_slots(service, date_from, date_to)` is read-only and may be cancelled when interrupted · `book_appointment(slot_id, patient_name, phone, idempotency_key)` always runs to completion and a repeat gives the same result.
5. First sentence: "คลินิกทันตกรรม ... สวัสดีค่ะ สายนี้เป็นระบบอัตโนมัติและมีการบันทึกเสียงเพื่อการนัดหมาย รายละเอียดอ่านได้ที่ ... ค่ะ"

**Expected result in the conversation:**

> ลูกค้า: "ขอนัดขูดหินปูนพฤหัสหน้า บ่ายสองค่ะ"
> agent: "ขอเช็กตารางคุณหมอสักครู่นะคะ" ← filler during `check_slots`
> agent: "วันพฤหัสบดีที่ 5 พฤศจิกายน บ่ายสองโมง ว่างค่ะ ขอชื่อผู้นัด…"
> ลูกค้า (interrupts): "ขอเป็นบ่ายสามได้ไหมคะ"
> The agent stops at once, clears the audio queue, drops the old answer, then checks 3 p.m. again
> ... repeats name, day, time → the customer agrees → `book_appointment` replies with success and an appointment number → "จองเรียบร้อยแล้วค่ะ"
> The system emits `appointment.booked` → the CRM records it → the notification system sends the LINE appointment confirmation
