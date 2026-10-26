# skill: subtitles-th

Use when a video needs Thai subtitles (ซับไทย) as an .srt file or burned in, including transcription, timing and line length.

# subtitles-th — ซับไทยเป็นไฟล์: ถอดเสียง ตรวจ แล้วฝังหรือส่งไฟล์

อยู่ใน plugin `graphic-design` · ถ้อยคำเขียนตาม `human-writing` · กฎความยาวบรรทัด ความเร็วอ่าน และเครื่องหมายมีที่เดียวคือตาราง Caption and on-screen text rules ใน `video-script-to-clip` · skill นี้ทำให้ไฟล์ซับเป็นไปตามตารางนั้น

> **กฎข้อเดียว:** ซับจากเครื่องถอดเสียงทุกตัวเป็นแค่ร่าง ชื่อคน ชื่อแบรนด์ ราคา และตัวเลขต้องแก้ด้วยมือ แล้ว `srt_check.py` ต้องผ่าน และต้องเปิดภาพที่ฝังแล้วดูวรรณยุกต์ ก่อนบอกว่าเสร็จ

## ใช้เมื่อ

- มีคลิปหรือเสียงแล้ว ต้องการซับไทยเป็นไฟล์ `.srt` หรือฝังลงภาพ
- แก้ซับที่มีอยู่ให้อ่านทัน (บรรทัดยาว · เร็วเกิน · 3 บรรทัด · มีจุดปิดประโยค)
- ฝังซับไทยแล้วตัวหนังสือเป็นสี่เหลี่ยม หรือวรรณยุกต์ลอยผิดที่

## ไม่ใช้เมื่อ (ใช้ตัวอื่นแทนหรือคู่กัน)

| งาน | ใช้ |
|---|---|
| ข้อความบนจอที่ออกแบบเป็นกราฟิก (หัวข้อ ราคา โปร) | `video-script-to-clip` (ข้อความบนจอ) · `motion-basics` |
| ซับอัตโนมัติในแอปตัดต่อ (CapCut · DaVinci Resolve) | `production-tools.md` ข้อ 1 แล้วใช้ข้อ 4–6 ของ skill นี้ตรวจผล |
| ตัด ต่อ หรือปรับเสียงก่อนทำซับ | `video-editing` (ทำก่อน เพราะเวลาของซับอิงไฟล์สุดท้าย) |
| แปลซับเป็นภาษาอื่น | `translate-th-en` แล้วตรวจไฟล์ผลด้วยข้อ 4 |

## ขั้นตอน

1. **ใช้ไฟล์เสียงชุดสุดท้าย** ตัดต่อเสร็จก่อนทำซับ ตัดทีหลังแล้วเวลาเลื่อนทั้งไฟล์
2. **ถอดเสียงเป็น `.srt`** ใช้ตัวที่รันในเครื่องได้ฟรีก่อน (ข้อมูลไม่ออกนอกเครื่อง) · การติดตั้งแพ็กเกจและดาวน์โหลดโมเดล (ไฟล์ medium ราว 1.5 GB · large-v3 ราว 2.9 GB) อยู่ใน "รออนุมัติ" · บนเครื่องที่เขียน skill นี้ยังไม่ได้รันตัวไหนจริง

   | ตัวเลือก | ใบอนุญาต | ได้ `.srt` อย่างไร | ภาษาไทย |
   |---|---|---|---|
   | openai-whisper (Python) | MIT ทั้งโค้ดและโมเดล | `whisper in.wav --model medium --language Thai --output_format srt --output_dir out` | large-v3 ผิดราว 5.8% ระดับตัวอักษร (Common Voice 15) และ 8.4% (FLEURS) ตามผู้พัฒนา |
   | whisper.cpp | MIT | แปลงเป็น WAV 16-bit ก่อน `ffmpeg -i in.mp3 -ar 16000 -ac 1 -c:a pcm_s16le in.wav` แล้ว `whisper-cli -m models/ggml-medium.bin -f in.wav -l th -osrt -of out` | โมเดลเดียวกับ Whisper · ค่าตั้งต้นเป็นอังกฤษ ต้องใส่ `-l th` และไม่ใช้โมเดลที่ชื่อลงท้าย `.en` |
   | faster-whisper | MIT | เป็น library ไม่มีตัวเขียน `.srt` ต้องเขียนจาก `segment.start` · `segment.end` · `segment.text` เอง | เร็วกว่า openai-whisper สูงสุดราว 4 เท่าที่ความแม่นเท่ากัน ตามผู้พัฒนา |
   | โมเดลที่ปรับมาเพื่อภาษาไทย (biodatlab ม.มหิดล · NECTEC Pathumma · SCB 10X Typhoon) | apache-2.0 หรือ mit · Typhoon มีเงื่อนไข OpenTyphoon เพิ่ม | เป็นโมเดลของ `transformers` ไม่มีตัวเขียน `.srt` · ใช้กับ whisper.cpp หรือ faster-whisper ต้องแปลงก่อน (ยังไม่ได้ทดสอบ) | ผู้พัฒนารายงานว่าผิดน้อยกว่า Whisper เดิม แต่วัดต่างชุดข้อมูลกัน เทียบกันตรง ๆ ไม่ได้ · โมเดลบางตัวบอกว่าไม่ได้ทำมาเพื่อเวลา (timestamp) |

   เวลาในซับจากทุกตัวต้องตรวจซ้ำในข้อ 4 · ทุกตัวอาจเติมคำที่ไม่ได้พูด (hallucination) ตามคำเตือนของ Whisper เอง
3. **แก้คำด้วยมือ** ชื่อคน ชื่อแบรนด์ ศัพท์เทคนิค ราคา ตัวเลข และคำที่ฟังคล้ายกัน · มีสคริปต์อยู่แล้ว ให้เทียบกับสคริปต์ทีละซับ
4. **จัดบรรทัดและเวลา แล้วตรวจ** `python scripts/srt_check.py ep01.srt` ต้องผ่าน:
   - บรรทัดละไม่เกิน 35 ตัว ไม่นับวรรณยุกต์และสระบนล่าง · ไม่เกิน 2 บรรทัด · ตัดบรรทัดระหว่างคำ ไม่ตัดกลางคำ
   - อ่านไม่เกิน 17 ตัวต่อวินาที · อยู่บนจอ 5/6 วินาที (ราว 0.83 วินาที) ถึง 7 วินาที · ไม่ทับซับก่อนหน้า
   - ไม่ปิดประโยคด้วยจุด · ไม่มี `?` หรือขีดในบทพูด · `...` ใช้ `…` ตัวเดียว
   - ไฟล์เป็น UTF-8 (YouTube ต้องการ UTF-8 ล้วน · ffmpeg อ่านซับเป็น UTF-8 เป็นค่าตั้งต้นและข้าม BOM ให้)
   เกินความเร็ว → แบ่งเป็น 2 ซับตามจังหวะพูด หรือตัดคำซ้ำ ไม่ย่อจนความหมายเปลี่ยน
5. **ฝังซับหรือส่งไฟล์** ส่งไฟล์แยก: YouTube รับ `.srt` แบบพื้นฐาน ไม่อ่านสไตล์ (`production-tools.md` ข้อ 3) · ฝังลงภาพ (TikTok · Reels · คลิปที่ดูแบบปิดเสียง):
   `ffmpeg -i in.mp4 -vf "subtitles=ep01.srt:fontsdir='<โฟลเดอร์ฟอนต์>':shaping=complex:force_style='FontName=IBM Plex Sans Thai,FontSize=22,Outline=2,Shadow=0,MarginV=40'" -c:v libx264 -crf 20 -c:a copy out.mp4`
   - `shaping=complex` เอกสาร ffmpeg 9.0 บอกว่าจำเป็นสำหรับอักษรไทย (ทดสอบ 2026-10-24: `simple` ทำให้ไม้จัตวาใน "เตี๋ยว" ทับสระอี · `complex` และค่าตั้งต้น `auto` บนเครื่องนี้วางถูก) · ffmpeg ต้องสร้างพร้อม libass ที่มี HarfBuzz
   - **ฟอนต์ค่าเริ่มต้น IBM Plex Sans Thai** (OFL ใน google/fonts) มีทั้งตัวไทยและตัวละตินในตระกูลเดียว ขนาดเข้ากัน (ละตินเทียบไทย 0.93) · ผู้ใช้เลือกจากภาพเทียบ 7 ฟอนต์ 2026-10-26 · **ห้ามใช้ Noto Sans Thai กับซับที่มีคำอังกฤษ** ฟอนต์นี้ไม่มีตัวละติน คำอังกฤษจึงไปใช้ฟอนต์สำรองที่ใหญ่กว่าราว 1.3 เท่า (ตรวจในไฟล์ฟอนต์และวัดจากภาพ 2026-10-26) · ทางเลือกอื่นที่ขนาดเข้ากัน: Anuphan · Sarabun · ฟอนต์ต้องมีใบอนุญาตชัด (`production-tools.md` ข้อ 4) · เครื่องไม่มีฟอนต์ → ให้ผู้ใช้ติดตั้งจาก Google Fonts เอง แล้วชี้ `fontsdir`
   - `FontName` คือชื่อตระกูลฟอนต์ ไม่ใช่ชื่อไฟล์ · `fontsdir` ชี้โฟลเดอร์ที่มีไฟล์ฟอนต์
   - Windows: path ในฟิลเตอร์ต้องหนีเครื่องหมาย `:` ของไดรฟ์ เช่น `fontsdir='C\:/Users/<ชื่อ>/AppData/Local/Microsoft/Windows/Fonts'` และรันคำสั่งในโฟลเดอร์เดียวกับไฟล์ `.srt` จะได้ใช้ชื่อไฟล์เปล่า
   - `FontSize` และ `MarginV` ไม่ใช่ px ของภาพตรง ๆ ฟิลเตอร์อ่าน `.srt` เป็นสคริปต์สูง 288 หน่วย ระยะจริงจึงราว ค่า × ความสูงภาพ ÷ 288 (ทดสอบ 2026-10-24: บนภาพสูง 1920 `MarginV` 40 → ซับห่างขอบล่าง 310 px · 150 → 1044 px · Noto Sans Thai FontSize 22 ได้ตัวพยัญชนะ ก ข ค ง สูง 31 px บนภาพสูง 1080 และ 55 px บนภาพสูง 1920 · รอบเทียบฟอนต์ 2026-10-26 วัดใหม่ที่ FontSize 22 บนภาพสูง 1080: Noto Sans Thai 29 px · IBM Plex Sans Thai 27 px เล็กกว่าเล็กน้อย ถ้าต้องการขนาดเท่าเดิมลอง FontSize 24 ซึ่งคำนวณจากอัตราส่วน ยังไม่ได้วัด) ดึงภาพมาวัดแล้วปรับให้ได้ขนาดตามกฎในตาราง caption ของ `video-script-to-clip`
   - ตำแหน่งตามสัดส่วนภาพ: แนวนอน 16:9 (YouTube · คลิปสอน) วางล่างกลางได้ `MarginV=40` ได้ซับห่างขอบล่างราว 16% · แนวตั้ง 9:16 (TikTok · Reels · Shorts) ซับต้องพ้นส่วนล่าง 35% ตามกฎ safe zone ใช้ `MarginV=100` ได้ซับห่างขอบล่าง 37% (ทดสอบ 2026-10-24 บนภาพ 1080×1920) · ห้ามใช้ `Alignment=5` เพื่อวางกลางจอ ฟิลเตอร์นี้ตีความเป็นชิดบน (ทดสอบ 2026-10-24: ซับไปอยู่ที่ 6% จากขอบบน)
6. **เปิดภาพที่ฝังแล้วดูจริง** `ffmpeg -ss <วินาทีที่มีซับ> -i out.mp4 -frames:v 1 check.png` ดูว่าวรรณยุกต์และสระซ้อนอยู่ถูกที่ (เช่น ก๋วยเตี๋ยว · ติ๊ก · น้ำ) และซับอยู่ใน safe zone (`social-formats`)

## ตัวอย่างจริง

- **โจทย์:** ฝังซับไทย 2 ซับที่มีวรรณยุกต์ซ้อนสระลงคลิป 1920×1080 บน Windows
- **สิ่งที่ทำ:** `srt_check.py` (เจอซับที่ 2 อ่าน 18.4 ตัวต่อวินาที เกิน 17) · ฝังด้วย Noto Sans Thai (รอบทดสอบ 2026-10-24 ก่อนเปลี่ยนเป็น IBM Plex Sans Thai) จากโฟลเดอร์ฟอนต์ของผู้ใช้ · ดึงภาพที่วินาทีที่ 4 มาดู
- **ผล:** "ผู้ใหญ่ใจดี น้ำแข็งใส ก๋วยเตี๋ยว" และ "ติ๊กต่อก ฎีกา ฐาน" วางวรรณยุกต์และสระถูกตำแหน่ง · ตัวตรวจจับความเร็วเกินได้ตรงตามเกณฑ์ (ตรวจจริง 2026-10-24 · ffmpeg 9.0.2 ที่มี libass)

## ตรวจก่อนส่ง

- [ ] `srt_check.py` ผ่าน (exit 0)
- [ ] ชื่อ ราคา ตัวเลข และศัพท์เทคนิคตรวจกับสคริปต์หรือฟังซ้ำแล้ว
- [ ] ฝังแล้ว: เปิดภาพอย่างน้อย 2 จุดดูวรรณยุกต์ · ซับอยู่ใน safe zone
- [ ] ฟอนต์มีใบอนุญาตสำหรับงานนี้
- [ ] ให้ผู้ใช้ดูคลิปแบบปิดเสียง 1 รอบ

## ที่มา

- ตาราง Caption and on-screen text rules ใน `video-script-to-clip` (Netflix Thai Timed Text Style Guide · Meta safe zone · ตรวจโดย skill นั้น 2026-10-06)
- `production-tools.md` ข้อ 3–4 (YouTube รับ SubRip แบบ UTF-8 · ฟอนต์ OFL · ตรวจ 2026-10-23)
- ffmpeg Filters Documentation: [subtitles](https://ffmpeg.org/ffmpeg-filters.html#subtitles) (`fontsdir` · `force_style` · `shaping` · ต้องมี libass) · [การหนีเครื่องหมายใน filtergraph](https://ffmpeg.org/ffmpeg-filters.html#Notes-on-filtergraph-escaping) · การอ่าน UTF-8 และข้าม BOM จาก source `libavformat/subtitles.c` รุ่น n9.0.2 · libass ต้องมี HarfBuzz ตั้งแต่ 0.15.0 ([Changelog](https://github.com/libass/libass/blob/master/Changelog)) (ดู 2026-10-24)
- [YouTube supported subtitle and closed caption files](https://support.google.com/youtube/answer/2734698) (SRT ต้องเป็น UTF-8 ล้วน ไม่มีสไตล์ · ดู 2026-10-24)
- ตัวถอดเสียง: [openai/whisper](https://github.com/openai/whisper) (MIT · ขนาดโมเดล · ตัวเลขภาษาไทย) · [whisper.cpp](https://github.com/ggml-org/whisper.cpp) (MIT · `-osrt` · WAV 16-bit) · [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (MIT) · [biodatlab/whisper-th-large-v3-combined](https://huggingface.co/biodatlab/whisper-th-large-v3-combined) · [nectec/Pathumma-whisper-th-large-v3](https://huggingface.co/nectec/Pathumma-whisper-th-large-v3) · [typhoon-ai/typhoon-whisper-large-v3](https://huggingface.co/typhoon-ai/typhoon-whisper-large-v3) (ดู 2026-10-24 · ไม่ได้ดาวน์โหลดหรือรัน)
- ผลทดสอบของ skill นี้: หัวข้อ "ตัวอย่างจริง" ด้านบน (รันกับไฟล์ทดสอบที่สร้างขึ้นเอง 2026-10-24 · ffmpeg 9.0.2 บน Windows)
