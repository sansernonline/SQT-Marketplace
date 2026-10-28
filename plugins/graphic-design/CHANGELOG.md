# Changelog — graphic-design

## 0.18.0 — 2026-10-28

- skill ใหม่ `narration-th`: แยกเสียงบรรยายไทยจากสคริปต์ (text-to-speech) ออกจาก `video-editing` ตามที่ผู้ใช้เลือก (เดิมรวมไว้ 2026-10-24) · ย้ายแบบตัดแปะ ไม่เขียนเนื้อใหม่ · สคริปต์ `tts_cues.py` `f5_worker.py` `windows_tts.ps1` และ `references/tts-engine-score.example.json` ย้ายตาม · `video-editing` เหลือตัด ต่อ ความดัง สไลด์เป็นวิดีโอ และชี้มาที่ skill ใหม่
- eval `video-editing-tts-*` เปลี่ยนชื่อเป็น `narration-th-trigger` `-behaviour` `-guard` · เพิ่มเคสไม่ควรเปิด `narration-th-trigger-negative` (เตรียมไว้ ยังไม่ได้รัน) · agent `video-editor` ชี้ skill ใหม่

## 0.17.0 — 2026-10-28

- สคริปต์ตัดต่อ (`silences` `loudnorm2` `slides_to_video`) ไม่เขียนทับไฟล์ผลลัพธ์ที่มีอยู่แล้ว เว้นแต่ใส่ `--force` · เสนอชื่อใหม่ `-v02` · ตัวกันร่วมกันคือ `outguard.py` มี `--self-test`
- ค่าคงที่ของ `tts_cues.py` และ `silences.py` มีเหตุผลกำกับ หรือบอกว่า "ค่าตั้งต้น ยังไม่ได้วัด"
- `line-richmenu`: ตั้งเมนูเริ่มต้นและลบเมนูต้องขออนุมัติก่อน (ทดสอบกับผู้ใช้ 1 คน) · token อ่านจากตัวแปรสภาพแวดล้อมเท่านั้น · สคริปต์ใหม่ `richmenu_check.py` ตรวจ JSON กับภาพในเครื่อง (8/8) · เพดานอยู่ใน `references/richmenu-limits.json`
- `print-ready-files`: สคริปต์ใหม่ `print_check.py` ตรวจระยะตัดตก ฟอนต์ฝัง ppi หมึกรวม (8/8 รวมตรวจ PDF จริงด้วย poppler) · เกณฑ์อยู่ใน `references/print-specs.json`
- `asset-organize`: สคริปต์ใหม่ `apply_renames.py` ตรวจ `rename-log.csv` (ต้นทางหาย ชื่อชน ชื่อซ้ำ) ค่าตั้งต้น dry-run ทำเป็นสำเนา มี `--undo` (5 ข้อ)
- `brief-to-image`: ผิดทางกายภาพเป็นกฎเหล็กอย่างเดียว ไม่นับเป็นคะแนนซ้ำ · น้ำหนักใหม่ 0.40/0.30/0.15/0.15 (ค่าตั้งต้น ยังไม่ได้วัด) · เส้นแบ่งกับ `image-generation` ชัดขึ้น ตัดหัวข้อ brief ซ้ำออกจาก `image-generation`
- `video-editing` ใช้ `decide.mjs score` เลือกเครื่องเสียงบรรยายด้วยกฎเหล็กสิทธิ์เชิงพาณิชย์ · `youtube-thumbnail` กรองปกด้วย `pairwise` ก่อนอัปโหลด · `design-review` จัดลำดับจุดแก้ด้วย `priority` · งบเครดิตภาพ AI ใช้ `knapsack` · ตัวอย่าง JSON 4 ไฟล์รันผ่าน
- `motion-basics`: หัวข้อส่งออก GIF และ WebM ด้วย ffmpeg (คำสั่งรันผ่านจริง) · เพดานขนาดต่อปลายทางยังเป็น (รอยืนยัน)
- `icon-design` มีแถวใน triggers และ `image-artist` ส่งงานไอคอนมาที่ `icon-design` · คำว่าไอคอนอยู่ใน description ของ plugin · แก้เลขแถวใน `superuser` และ path ใน `speaking-script`
- eval: เคส "ไม่ควรเปิด" 4 เคส · เคสใหม่ 5 เคส (`brief-to-image` ×2 · `image-generation` · `design-review` · `video-script-to-clip`) · เกณฑ์อนุมัติใน `line-richmenu-behaviour` · `RESULTS.md` ใส่ช่วง 95% ยังไม่ได้รันเคสใหม่

## 0.16.1 — 2026-10-28

- `silences.py` รวมช่วงเก็บที่ทับกันเมื่อ `--pad` เกินครึ่งช่วงเงียบ เดิมได้เสียงซ้ำ
- `fetch_free_image.py` รับเฉพาะ https (redirect ไป http ก็ไม่ตาม) และหยุดเมื่อเกิน 25 MB · รูปที่ไม่ผ่านถูกข้าม รูปอื่นยังได้บรรทัดเครดิต

## 0.16.0 — 2026-10-27

- `brief-to-image` และ `image-generation` เลือกภาพจากหลายแบบด้วยคะแนน 5 เกณฑ์หรือเทียบเป็นคู่สลับตำแหน่ง (`decision-scoring`) · เรื่องรสนิยมผู้ใช้ตัดสิน

## 0.15.1 — 2026-10-27

- ไอคอนประจำ plugin `assets/icon.png` (512) และ `assets/icon.svg` · ช่อง `icon` ใน plugin.json (ใช้ในหน้ารายการของ directory) · ทำตาม `design-references`: ค้นต้นแบบบน Dribbble แล้วถอดสีหลักจากงานต้นแบบ หมุนเฉดต่อ plugin · ผ่าน design-critic

## 0.15.0 — 2026-10-27

- skill 10 ตัว (`brand-kit` · `campaign-set` · `social-formats` · `youtube-thumbnail` · `icon-design` · `image-generation` · `style-consistency` · `line-richmenu` · `motion-basics` · `brief-to-image`) และ agent `art-director` `brand-keeper` `social-creator` `image-artist`: ขั้นแรกค้นต้นแบบสดตาม `design-references` (superuser) แล้วถอดสีจากงานที่เลือก

## 0.14.0 — 2026-10-27

- `icon-design`: แนวที่โค้ดวาดเองไม่ถึง (มีมิติ · หลายสี · 3 มิติ · ภาพประกอบ) หยิบชุดที่นักออกแบบทำไว้มาปรับแทน · `references/asset-sets.md` ชุดและใบอนุญาต 20 ชุด (Fluent color · IconPark · Fluent Emoji · Phosphor · Open Peeps ฯลฯ อ่าน LICENSE 2026-10-27) · `scripts/recolor_icon.py` เปลี่ยนเฉดสีให้เป็นของแบรนด์โดยคงแสงเงาของนักออกแบบ (self-test 5/5)
- กฎใหม่จากรอบที่ผู้ใช้ปฏิเสธ 2026-10-27: ห้ามตัดหรือบากกรอบไอคอน · ห้ามเอาเส้นแบนมาใส่เงาแทนแนวมีมิติ · ข้อเสนอของผู้ตรวจที่ไม่มีตัวอย่างงานจริงรองรับต้องถามผู้ใช้ก่อน

## 0.13.1 — 2026-10-26

- `icon-design` ข้อ 3.1 ใหม่: ค้นหมวดเองก่อนถามผู้ใช้แบบนักออกแบบ (ร้านที่ไอคอนจะไปอยู่ · กฎทางการ · ตระกูลไอคอนผูกเป็นชุดอย่างไร · แนวที่ดูออกว่า AI ทำ) แล้วเสนอ 3–4 แนวพร้อมลิงก์ · ผลค้นรอบแรกอยู่ใน `references/category-research.md` (แหล่ง 23 หน้าเปิดอ่าน 2026-10-26) · ผู้ใช้ขอหลังเห็นว่า skill ถามตัวอย่างอย่างเดียว

## 0.13.0 — 2026-10-26

- skill ใหม่ `icon-design`: ไอคอนในหน้าจอใช้ชุดฟรีชุดเดียวที่ใบอนุญาตใช้ได้ (Lucide · Tabler · Phosphor · Material Symbols · Fluent · ห้าม Remix และ SF Symbols ทำโลโก้) · ไอคอนแบรนด์ (แอป · favicon · plugin · เครื่องหมาย) ขอตัวอย่างที่ผู้ใช้ชอบก่อน หา metaphor 10 อย่าง เลือกเครื่องมือตามของที่มีในเครื่อง · ตัวเลขทุกแพลตฟอร์มใน `references/specs.md` · `scripts/icon_check.py` ตรวจ viewBox เส้น กริด แล้วทำหน้าเทียบทุกขนาดพร้อม blur test · eval 3 เคส · แหล่ง 28 หน้าเปิดอ่าน 2026-10-26
- รอบแดง 2026-10-26: ไอคอน plugin 3 แนวที่ agent เขียน SVG ทีละเส้นโดยไม่มีตัวอย่างจากผู้ใช้ ผ่านตัวตรวจทุกตัวแต่ผู้ใช้ปฏิเสธทั้งหมด

## 0.12.3 — 2026-10-26

- eval แบบ behaviour ให้ `marketplace-product-images` · `print-ready-files` · `youtube-thumbnail` · แถว hook router อยู่ใน `superuser`
- `brand-kit` (`thai-fonts.md`) และ `print-ready-files`: ฟอนต์ SIPA ดัดแปลงต้องแจ้งเป็นหนังสือและเปลี่ยนชื่อ · TH Sarabun New ใช้ GPL พร้อมข้อยกเว้นฟอนต์ ไม่ใช่ใบอนุญาต DIP-SIPA

## 0.12.2 — 2026-10-26

- `subtitles-th`: กฎห้าม Noto Sans Thai กับซับที่มีคำอังกฤษ บอกให้ชัดว่าไฟล์ชุด notofonts (รุ่น 2.002 ที่เครื่องนี้ติดตั้ง) ไม่มีตัวละตินเลย ส่วนชุดบน Google Fonts มี · ดูจากชื่อฟอนต์ไม่ออก จึงยังไม่ใช้ทั้ง 2 ชุด (ตรวจตารางตัวอักษร 2026-10-26)

## 0.12.1 — 2026-10-26

- `subtitles-th`: ฟอนต์ซับค่าเริ่มต้นเป็น IBM Plex Sans Thai (ผู้ใช้เลือกจากภาพเทียบ 7 ฟอนต์) · ห้ามใช้ Noto Sans Thai กับซับที่มีคำอังกฤษ เพราะไม่มีตัวละติน คำอังกฤษจะใหญ่กว่าตัวไทยราว 1.3 เท่า

## 0.12.0 — 2026-10-26

- เตรียมรุ่น 1.0.0 (ใช้จริง 2–3 สัปดาห์ก่อนขึ้นรุ่นหลัก)
- skill ใหม่ `marketplace-product-images` · `print-ready-files` · `youtube-thumbnail` พร้อม agent เจ้าของและแถวใน triggers
- ผูก agent เจ้าของ: `line-richmenu` และ `speaking-script` ให้ social-creator · `motion-basics` ให้ art-director · `print-ready-files` ให้ design-critic
- ตรวจขนาดแพลตฟอร์มซ้ำ 2026-10-26: safe zone ของ TikTok และ YouTube Shorts ตามตัวเลขทางการ · header และ profile ของ X · เพดาน rich menu ของ LINE จาก API reference
- สคริปต์ `video-editing` 4 ตัวมี `--self-test` (ไม่มี ffmpeg ก็ข้ามได้) · `f5_worker.py` บอกวิธีติดตั้งแทน traceback
- แทนไอคอน ✅ ❌ 10 บรรทัดเป็นคำ · eval ใหม่ 11 เคส (ยังไม่ได้รัน)

## 0.11.0 — 2026-10-25

- รับ agent `image-artist` มาจาก `software-company` ให้อยู่กับ skill `image-generation` ที่มันใช้ทุกงาน · `triggers.md` เพิ่มแถว `image-generation` และ `speaking-script` ที่ก่อนนี้ไม่มีทางเรียกจาก plugin นี้
- `line-richmenu` ตัดข้อความ "ถ้าติดตั้ง graphic-design" ที่ชี้หาตัวเอง
- รับ skill `line-richmenu` (rich menu ของ LINE OA: ขนาดภาพ · พื้นที่กด · JSON · คำสั่ง API) มาจาก `thai-workplace` ที่รวมเข้า `e-commerce` แล้ว

- eval `video-editing-regression` และ `video-editing-tts-regression` เปลี่ยนชื่อเป็น `-guard` เพราะรอบแดงทำถูกอยู่แล้ว ไม่ใช่เรื่องที่เคยพลาดจริง (กฎใหม่ใน `skill-authoring`)
- เพิ่ม skill `speaking-script`: สคริปต์ให้คนพูดหน้ากล้อง (คลิป influencer · รีวิว · พิธีกร · voiceover) — กฎข้อเดียว write for the ear · hook ก่อนทักทาย · ตารางภาษาเขียน → ภาษาพูด · จับเวลาด้วยนาฬิกาไม่นับคำ · ขั้น 0 หาคลิปอ้างอิงก่อนเขียน · eval 3 เคส ใน `evals/speaking-script-*` · เพิ่มแถวใน skill-router (พร้อมกัน pattern โค้ดไม่จับ "สคริปต์พูด" อีก) · triggers · file-map
- `brief-to-image`: เพิ่มขั้น 0 หารูปอ้างอิงที่ชอบก่อนเขียน prompt แล้วแตกว่าชอบอะไร (แสง · สี · องค์ประกอบ) ใส่ใน brief — ลดผลงานหน้าตาเหมือนกันทุกชิ้น
- skill ใหม่ 2 ตัวสำหรับตัดต่อด้วย ffmpeg และ agent ใหม่ `video-editor`: `video-editing` (ตัดให้ตรงเฟรม · ต่อคลิป · ตัดช่วงเงียบด้วย `scripts/silences.py` · ปรับความดัง 2 รอบด้วย `scripts/loudnorm2.py` และอ่านว่าได้ Linear หรือ Dynamic · แปลงเป็นแนวตั้ง · ภาพปก · ต่อภาพสไลด์จาก `check_deck.py` กับเสียงบรรยายตาม `data-at` ด้วย `scripts/slides_to_video.py` ให้ยาวเท่าเสียงพอดี · วัดไฟล์ที่ได้ทุกครั้ง) · `subtitles-th` (ถอดเสียงเป็น .srt · `scripts/srt_check.py` ตรวจความยาวบรรทัด ความเร็วอ่าน เวลา และเครื่องหมายตามตาราง caption ของ `video-script-to-clip` · ฝังซับด้วยฟอนต์ไทยแล้วเปิดภาพดูวรรณยุกต์) · ทดสอบทุกคำสั่งกับ ffmpeg 9.0.2 บน Windows 2026-10-24 · eval 9 เคส (`video-editing-*` · `video-editing-slides-*` · `subtitles-th-*`) · playbook `video` เพิ่มขั้นตัดต่อก่อนขั้นตรวจ · `triggers.md` เพิ่ม 3 แถว
- `video-editing` เพิ่มหัวข้อเสียงบรรยายจากสคริปต์ (text-to-speech): สร้างเสียงไทยทีละซับด้วย `scripts/tts_cues.py` ได้ `narration.wav` ซับ `.srt` และเวลาสไลด์ (`data_at`) จากการรันเดียวโดยไม่ต้องถอดเสียง · เครื่องสร้างเสียง 3 ตัว: F5-TTS-THAI เลียนเสียงจากคลิปต้นแบบ (`scripts/f5_worker.py` อ่านไฟล์ด้วย soundfile แทน torchcodec ที่ต้องมี DLL ของ FFmpeg) · edge-tts · เสียงที่มากับ Windows (`scripts/windows_tts.ps1`) · ไฟล์คำอ่านให้เครื่องอ่านศัพท์อังกฤษเป็นไทยแต่ซับแสดงคำเดิม · ทดสอบกับบทเรียน 9 ซับจนได้วิดีโอ 2026-10-24 · ตารางเครื่องเสียงบอกค่าใช้จ่ายและสิทธิ์เชิงพาณิชย์ · eval 3 เคส (`video-editing-tts-*`) · agent `video-editor` รับงานนี้ · playbook `video` · `triggers.md` · `subtitles-th` บอกว่า 5/6 วินาทีคือราว 0.83 วินาที และ `srt_check.py` พิมพ์ภาษาไทยได้บนเครื่องที่ไม่ได้ตั้ง UTF-8 · `speaking-script` ชี้มาที่หัวข้อนี้

## 0.10.0 — 2026-10-23

- รับ skill `image-generation` จาก `doc-toolkit` ที่ยุบ (ชื่อเดิม) · ตัด dependency `doc-toolkit`
- `brief-to-image`: `references/prompt-anatomy.md` เพิ่มหัวข้อ Tactile 3D hero object: แม่แบบภาพวัตถุ 3 มิติจับต้องได้ 8 บรรทัด (subject · material · light · shadow · lens · background · one colour · negatives) พร้อมตัวอย่างเครื่องหมายคำถามกระดาษตัดสีส้มบนกระดาษครีม · เพิ่มสารบัญเพราะไฟล์ยาวเกิน 100 บรรทัด · ลิงก์จาก `SKILL.md` · `image-generation` `references/styles.md` แถว `3d` เปลี่ยนจาก prompt ทั่วไป (clay · studio · pastel) เป็นวัสดุ แสง เงา และ negative ที่ระบุชัด แล้วชี้ไปแม่แบบ
- `video-script-to-clip`: เพิ่ม `references/production-tools.md` เครื่องมือแปลงสคริปต์เป็นคลิป (CapCut · DaVinci Resolve รุ่นฟรี · HyperFrames · Remotion) พร้อมเงื่อนไขใช้เพื่อการค้าของเพลง เทมเพลต และฟอนต์ใน CapCut · เกณฑ์ Company License ของ Remotion · ค่าส่งออกต่อแพลตฟอร์ม · ฟอนต์ซับไทย · กฎเพลง ตรวจแหล่ง 2026-10-23 · ลิงก์จาก `SKILL.md` หัวข้อ Related · แถวใหม่ใน `triggers.md`
- `brief-to-image`: ตาราง Failure modes 8 อาการ บอกว่าแก้อย่างเดียวอะไรเมื่อรูปพลาด (ตัวอักษรเพี้ยน → เอาคำออกจาก prompt แล้วใส่ข้อความตอนจัดหน้า · ภาพในชุดไม่เข้ากัน → style lock sheet กับ seed หรือรูปอ้างอิงเดียวกัน) · ผู้ใช้ Gemini API: โมเดล `imagen-4.0-*` ปิดบริการเมื่อ 2026-08-17 ตามหน้า deprecations ให้ใช้รุ่น `gemini-*-image` และจดรหัสโมเดลที่ใช้จริง (ตรวจ 2026-10-23) · `image-generation` เขียน 1 ย่อหน้าบนสุดของ `image-style.md` ว่าภาพชุดนี้คืออะไร (ใครดู · ดูแล้วรู้สึกอะไร · จะไม่เป็นแบบไหน) แล้วเทียบทุกรูปกับย่อหน้านี้
- `brand-kit`: แยก Imagery กับ Voice · Voice ใช้คู่ก่อนกับหลังภาษาไทยที่เจ้าของแบรนด์เขียนเอง พร้อมเลือก ครับ/ค่ะ สรรพนาม และระดับภาษา 1 แบบจาก `thai-grammar` ข้อความไทยของแบรนด์จึงเสียงเดียวกันทุกชิ้น
- `design-review`: squint test (หรี่ตา ซูม 10% หรือเบลอ 10 px แล้วดูว่าอะไรยังเห็น) · เช็กตัวอักษร 4 ข้อ (ระดับต่างกันด้วยขนาดและน้ำหนัก ไม่ใช่สีอย่างเดียว · บรรทัดเนื้อความ 45–75 ตัวละติน หรือราว 35–55 ตัวไทย · ไม่ใส่ letter-spacing กับเนื้อความไทย · 1 บล็อก 1 การจัดแนว)
- `motion-basics`: ตาราง token การเคลื่อนไหวของ Material 3 (easing 5 แบบ · ช่วงเวลา 50–1000 ms) ตรวจกับ material-web (Apache-2.0) 2026-10-23 · ฉากหลังที่เคลื่อนไหวต้องมีความหมาย ฉากที่แค่ตกแต่งให้ตัดทิ้ง
- `video-script-to-clip`: เครื่องหมายวรรคตอนไทยในซับไตเติลและข้อความบนจอ · ข้อความการตลาดบนจอทั้งคลิป 15 วินาที ไม่เกินราว 120 ตัวอักษรไทย (ไม่นับวรรณยุกต์และสระบนล่าง)
- ใช้แกน `superuser` 3.1.0: playbook `team-project` และค่าตั้ง hook `guard` · `recompact` (ปิดไว้)

## 0.9.1 — 2026-10-22

- แก้ชื่อ plugin ของ `image-generation` (เป็น `doc-toolkit`) · แก้ตัวชี้ใน examples/triggers

## 0.9.0 — 2026-10-22

- `skills/superuser/SKILL.md` เหลือเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" — แกนของหัวหน้าทีมอ่านจาก plugin `superuser` 3.0.0 ที่เดียว ไม่คัดลอกบล็อกกลางอีก (50 KB → ราว 12 KB)
- `dependencies` ใส่ช่วงเวอร์ชัน `{ "name": "superuser", "version": "^3.0" }` และเพิ่ม `{ "name": "doc-toolkit", "version": "^1.0" }` (skill เอกสาร สไลด์ รูป ประชุม 15 ตัวที่ย้ายออกจาก superuser)

## 0.8.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)

## 0.7.0 — 2026-10-19

- รับ skill กลาง `no-ai-look` จาก `superuser` · agent ทั้ง 4 ตัว (`art-director` · `brand-keeper` · `design-critic` · `social-creator`) ทำตามและตรวจก่อนส่ง
- skill 9 ตัวมีหัวข้อ "Not an AI look" · brief ของรูป AI ใส่แนวที่มีชื่อ · hex · แสง · สิ่งที่ไม่เอา ตามข้อ 4 ของ `no-ai-look`

## 0.6.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
