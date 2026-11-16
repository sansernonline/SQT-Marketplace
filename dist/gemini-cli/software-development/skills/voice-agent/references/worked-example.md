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
