# ตัวเลือก STT · TTS · framework สำหรับ voice agent ภาษาไทย

ส่วนขยายของ [`voice-agent`](../SKILL.md) ขั้น 3 และ 4 · ทุกค่าตรวจจากหน้าทางการเมื่อ 2026-10-27 · ราคาเป็นดอลลาร์สหรัฐ (USD) ราคาตั้งต้นขั้นแรก ไม่รวมส่วนลด · ราคาและสถานะเปลี่ยนบ่อย ก่อนเสนอลูกค้าให้เปิดลิงก์ดูใหม่ · ช่องที่เขียน `(ยังไม่ได้ตรวจ)` คือยังไม่ได้เห็นจากแหล่งทางการ ห้ามเติมเอง

## 1 · แปลงเสียงเป็นข้อความ (Speech-to-Text · STT) แบบ streaming ภาษาไทย

| บริการ | streaming | ไทย | รันเองได้ | ราคาต่อนาที | ข้อควรรู้ | ที่มา |
|---|---|---|---|---|---|---|
| Google Cloud Speech-to-Text รุ่น Chirp 3 | ✓ `StreamingRecognize` | ✓ `th-TH` สถานะ Preview | ✗ | 0.016 (V2 standard 500,000 นาทีแรกต่อเดือน) | มีเฉพาะ region `us` และ `eu` เสียงจึงออกนอกประเทศ ต้องผ่าน PDPA มาตรา 28 · `chirp_2` มีที่ `asia-southeast1` | [รุ่น Chirp 3](https://docs.cloud.google.com/speech-to-text/docs/models/chirp-3) · [ภาษาที่รองรับ](https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages) · [ราคา](https://cloud.google.com/speech-to-text/pricing) |
| Azure AI Speech | ✓ real-time | ✓ `th-TH` | ✗ (มีรุ่นคอนเทนเนอร์ แต่ยังไม่ได้ตรวจว่ารองรับไทย) | 1.00 ต่อชั่วโมง (ราว 0.017 ต่อนาที · S1 Speech To Text · Southeast Asia) | ตารางภาษาเขียนว่าใช้กับ real-time แต่ไม่มีคอลัมน์แยก ให้ลองเรียกจริงก่อนสัญญา | [ภาษาที่รองรับ](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt) · [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) |
| Amazon Transcribe | ✓ | ✓ `th-TH` batch และ streaming | ✗ | 0.0001667 ต่อวินาที (ราว 0.01 ต่อนาที · SKU `StreamingAudio` Singapore จาก Price List API · ตรวจกับหน้าราคาอีกครั้งก่อนใช้) | ไทยไม่ติดเครื่องหมาย `*` จึงไม่อยู่ในรายการ region ที่ปิด streaming ซึ่งมี `ap-southeast-7` (Thailand) อยู่ด้วย (อนุมานจากเชิงอรรถ) | [ภาษาที่รองรับ](https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html) · [Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/transcribe/current/ap-southeast-1/index.json) |
| OpenAI `gpt-realtime-whisper` · `gpt-live-transcribe` | ✓ live transcription | (ยังไม่ได้ตรวจ) | ✗ | 0.017 | ยังไม่เห็นรายการภาษาทางการ | [ราคา](https://developers.openai.com/api/docs/pricing) |
| Typhoon ASR Real-time (SCB 10X) | ✓ ออกแบบมาเพื่อ streaming | ✓ ไทยอย่างเดียว | ✓ CPU ก็รันได้ มีตัวอย่าง `--device cuda` | ฟรี (จ่ายแค่เครื่อง) | 114M พารามิเตอร์ · FastConformer-Transducer · สัญญาอนุญาต CC-BY-4.0 และต้องยอมรับเงื่อนไข OpenTyphoon · ตัวอย่างบนหน้ารุ่นเป็นการถอดจากไฟล์ โค้ดรันแบบ streaming (ยังไม่ได้ตรวจ) · ตัวเลขความแม่นมาจากผู้พัฒนาเอง | [หน้ารุ่น](https://huggingface.co/typhoon-ai/typhoon-asr-realtime) · [บทความ arXiv 2601.13044](https://arxiv.org/abs/2601.13044v1) |
| whisper_streaming (ÚFAL) | ✓ แบบ LocalAgreement | ตาม Whisper | ✓ | ฟรี | งานวิจัยรายงานความหน่วง 3.3 วินาที เกินงบ 800 ms ไปมาก · README บอกว่าถูกแทนด้วย SimulStreaming | [GitHub](https://github.com/ufal/whisper_streaming) |

## 2 · แปลงข้อความเป็นเสียง (Text-to-Speech · TTS) แบบ streaming ภาษาไทย

| บริการ | streaming | เสียงไทย | รันเองได้ | ราคาต่อ 1 ล้านตัวอักษร | ข้อควรรู้ | ที่มา |
|---|---|---|---|---|---|---|
| Google Cloud TTS รุ่น Chirp 3 HD | ✓ streaming synthesis ส่งออก `MULAW` `ALAW` `PCM` `OGG_OPUS` | ✓ `th-TH` | ✗ | 30 (ฟรี 1 ล้านตัวอักษรแรก) | streaming ไม่รับ SSML จึงคุมการอ่านตัวเลขด้วย SSML ไม่ได้ ต้องเขียนเป็นคำก่อนส่ง · `MULAW` ใช้กับสายโทรศัพท์ได้ตรง | [Chirp 3 HD](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd) · [ราคา](https://cloud.google.com/text-to-speech/pricing) |
| Azure AI Speech | ✓ ส่งเสียงทีละก้อน · รับข้อความแบบ streaming ผ่าน `TextStream` ที่ websocket v2 | ✓ `th-TH-PremwadeeNeural` · `th-TH-NiwatNeural` · `th-TH-AcharaNeural` · รุ่น Neural HD `th-TH-Krit` · `th-TH-Nattapong` | ✗ | 15 (S1 Neural) · 22 (Neural HD) | text streaming ไม่รับ SSML · แนะนำให้ต่อ websocket ไว้ก่อนและใช้ synthesizer ซ้ำ | [ภาษาและเสียง](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts) · [ลดความหน่วง](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-lower-speech-synthesis-latency) · [Azure Retail Prices API](https://prices.azure.com/api/retail/prices) |
| Amazon Polly | — | ✗ ไม่มีภาษาไทยในรายการ | ✗ | — | ใช้ Transcribe ฝั่ง STT ได้ แต่ฝั่ง TTS ต้องเลือกเจ้าอื่น | [ภาษาของ Polly](https://docs.aws.amazon.com/polly/latest/dg/supported-languages.html) |
| F5-TTS-THAI · edge-tts | ✗ สร้างทีละไฟล์ | ✓ | F5 รันเองได้ | ฟรี | ใช้ทำเสียงบรรยายจากสคริปต์ ไม่ใช่ realtime · F5 บน CPU ช้ากว่าเวลาจริงหลายเท่า · edge-tts ไม่มีสัญญาสำหรับนักพัฒนา (รายละเอียดใน `video-editing` หัวข้อเสียงบรรยาย) | `graphic-design:video-editing` |
| TTS ไทยแบบรันเองที่ streaming ได้ | (ยังไม่ได้ตรวจ) | | | | ยังไม่พบรุ่นเปิดที่ยืนยันได้ว่าส่งไบต์แรกเร็วพอ ถ้าต้องเก็บเสียงในประเทศให้วัด TTS ไบต์แรกบน GPU จริงก่อนตัดสินใจ | — |

## 3 · รุ่นที่รับเสียงและตอบเป็นเสียงในตัว (speech-to-speech)

| บริการ | ไทย | ราคา | การพูดแทรก | ที่มา |
|---|---|---|---|---|
| Gemini Live API (`gemini-3.8-live` เป็นรุ่นตั้งต้นสำหรับ voice agent) | ✓ รหัส `th` อยู่ใน 99 ภาษา | (ยังไม่ได้ตรวจ) | VAD ฝั่งเซิร์ฟเวอร์เปิดเป็นค่าตั้งต้น · เมื่อพูดแทรก คำตอบที่กำลังสร้างถูกยกเลิก แล้วส่ง `interrupted` มา ฝั่งเราต้องหยุดเล่นเสียงและล้างคิวเอง · แนะนำ `silenceDurationMs` 500–800 ms ค่าภายในราว 800 ms | [Live API guide](https://ai.google.dev/gemini-api/docs/live-guide) |
| OpenAI Realtime (`gpt-realtime-2.1` · `gpt-realtime-2.1-mini`) | (ยังไม่ได้ตรวจ) | เสียงเข้า 32 · เสียงออก 64 ต่อ 1 ล้าน token (mini 10 และ 20) | `server_vad` (ตัดตามความเงียบ) หรือ `semantic_vad` (ดูจากคำพูด) · มี `interrupt_response` | [ราคา](https://developers.openai.com/api/docs/pricing) · [VAD](https://developers.openai.com/api/docs/guides/realtime-vad) |

ข้อดีของแบบนี้คือไม่ต้องต่อ STT → LLM → TTS เอง ข้อเสียคือคุมคำอ่านชื่อและเวลาภาษาไทยได้น้อยกว่า วัดแยกช่วงไม่ได้ และเสียงออกไปต่างประเทศ ใช้เมื่อทดสอบทางไทยแล้วผ่านเกณฑ์ชื่อ วันที่ เวลา ในขั้น 8 ของ SKILL.md

## 4 · framework ที่ทำ SIP · WebRTC · การผลัดกันพูด · การพูดแทรก

| เรื่อง | LiveKit Agents | Pipecat |
|---|---|---|
| โทรศัพท์ | SIP trunk ต่อเข้าห้อง · inbound trunk จำกัด IP หรือเบอร์ได้ · dispatch rule เลือกห้องให้ผู้โทร · โอนสายแบบ cold (SIP REFER) และ warm (agent-assisted) · DTMF ตาม RFC 4733 · ทดสอบกับ Twilio Telnyx Plivo Sinch และอื่น ๆ | มี transport ของตัวเอง (ยังไม่ได้ตรวจรายละเอียด SIP ในรอบนี้) |
| ตัดสินว่าลูกค้าพูดจบ | ค่าตั้งต้นคือรุ่น turn detector ซึ่ง**ไม่รองรับภาษาไทย** ทั้งรุ่นข้อความ 14 ภาษาและรุ่นเสียง 14 ภาษา จึงต้องตั้ง `turn_detection="vad"` หรือ `"stt"` · `endpointing.min_delay` ค่าตั้งต้น 0.5 วินาที · `max_delay` 3.0 วินาที | Silero VAD `start_secs` และ `stop_secs` ค่าตั้งต้น 0.2 วินาที · Smart Turn รองรับไทยไหม (ยังไม่ได้ตรวจ) |
| เมื่อพูดแทรก | หยุดเสียง agent และตัดประวัติสนทนาให้เหลือเฉพาะส่วนที่ลูกค้าได้ยิน · `false_interruption_timeout` แล้วพูดต่อจากเดิม (`resume_false_interruption`) · `min_duration` · `min_words` | ส่ง `InterruptionFrame` ทั้งสองทิศ · ยกเลิกคำตอบ LLM ที่กำลังสร้าง · TTS หยุดและทิ้งของค้าง · transport ทิ้งเสียงที่ยังไม่ได้เล่น · function call ที่ตั้ง `cancel_on_interruption=True` ถูกยกเลิก · ข้อความที่ไม่ได้พูดออกไปไม่เข้า context |
| ลดความหน่วง | preemptive generation เปิดเป็นค่าตั้งต้น · `preemptive_tts` ปิดเป็นค่าตั้งต้น | — |
| กันพูดแทรกหลอก | `false_interruption_timeout` · `min_words` (ใช้ได้เมื่อมี STT) | `MinWordsUserTurnStartStrategy(min_words=3)` · กรองด้วย Krisp VIVA · mute strategy |

ที่มา: [LiveKit telephony](https://docs.livekit.io/telephony/) · [LiveKit turns](https://docs.livekit.io/agents/build/turns/) · [LiveKit turn detector](https://docs.livekit.io/agents/build/turns/turn-detector/) · [LiveKit tuning](https://docs.livekit.io/agents/logic/turns/tuning/) · [Pipecat speech input](https://docs.pipecat.ai/guides/learn/speech-input) · [Pipecat interruptions](https://docs.pipecat.ai/pipecat/fundamentals/interruptions) · ดูทั้งหมด 2026-10-27

**ภาษาไทยไม่เว้นวรรคระหว่างคำ** ตัวนับคำ (`min_words`) ที่แยกคำด้วยช่องว่างจึงอาจนับประโยคไทยทั้งประโยคเป็นคำเดียว (อนุมาน · ยังไม่ได้ทดสอบกับ framework จริง) · ให้ทดสอบกับเสียงจริงก่อนใช้ ถ้านับผิดให้ใช้ความยาวเสียง (`min_duration`) หรือจำนวนตัวอักษรแทน

## 5 · ตัวตรวจเสียงพูด (Voice Activity Detection · VAD)

Silero VAD: เสียงก้อนละ 30 ms ขึ้นไปใช้เวลาไม่ถึง 1 ms บน CPU 1 เธรด · รับ 8,000 Hz และ 16,000 Hz (สายโทรศัพท์ 8 kHz ใช้ได้ตรง) · ฝึกจากเสียงกว่า 6,000 ภาษา · README เขียนว่า MIT แต่ป้ายมีข้อความ CC BY-NC 4.0 ปน ให้ตรวจไฟล์ LICENSE ก่อนใช้เชิงพาณิชย์ · [GitHub](https://github.com/snakers4/silero-vad) ดู 2026-10-27
