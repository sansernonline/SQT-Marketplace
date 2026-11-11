# skill: course-builder

Use when designing a course, workshop or training day you will teach. Outcomes, session timing, exercises, rubric, feedback form.

# course-builder · ออกแบบหลักสูตรฝั่งผู้สอน

> **กฎข้อเดียวของ skill นี้:** ทุกช่วงในตารางสอนต้องชี้กลับไปที่ผลลัพธ์การเรียนรู้ข้อใดข้อหนึ่ง และทุกผลลัพธ์ต้องมีแบบฝึกกับการประเมินที่เห็นผลได้ ถ้าช่วงไหนชี้กลับไม่ได้ ให้ตัดช่วงนั้นออก

skill นี้ใช้ตอนคุณเป็นคนสอน ส่วนตอนเป็นคนเรียนใช้ `learning-path` · ผลงานคือโฟลเดอร์ `course/` 1 ชุด: โจทย์จากผู้จัด · ผลลัพธ์การเรียนรู้ · ตารางสอนพร้อมเวลา · แบบฝึก · rubric · สไลด์และเอกสารแจก · แบบประเมินหลังอบรม · บันทึกหลังสอน

ตัวเลขที่ติดป้าย (แนวของเรา) เป็นค่าเริ่มต้นที่ทีมเลือกเอง ยังไม่ได้ตรวจกับงานวิจัย ให้ใช้เป็นจุดเริ่มแล้วปรับจากบันทึกหลังสอน (หัวข้อ 7 ใน references/materials-feedback-online-copyright.md)

## เมื่อไหร่ใช้

| สถานการณ์ | ใช้ |
|---|---|
| จะสอน workshop · อบรมในบริษัท · คอร์สออนไลน์ · ติวเพื่อนร่วมทีม | skill นี้ |
| อยากเรียนเองให้ใช้เป็น | `learning-path` |
| เนื้อหาพร้อมแล้ว ต้องการแค่สไลด์ | `presentation-design` (software-development) |
| เตรียมสอบใบรับรอง | `cert-prep` |
| สอนให้คนทั่วไปใช้ AI แบบหลายขั้นในแชต (Loop · Graph · Dynamic) | skill นี้วางหลักสูตร แล้วใช้แม่แบบ prompt จาก `superuser:chat-prompt-workflows` เป็นแบบฝึก |
| สอนวิชาในสถาบันการศึกษาที่มีแบบฟอร์มรายวิชาของตัวเอง | กรอกแบบฟอร์มของสถาบันเป็นหลัก แล้วใช้หัวข้อ 2 ถึง 5 ของ skill นี้เติมเนื้อ |

## 1 · รู้จักผู้เรียนก่อนเขียนเนื้อหา

ถามผู้จัด (ฝ่ายบุคคลหรือหัวหน้าทีม) รวดเดียว 6 ข้อ แล้วจดลง `course/brief.md`

1. ใครเรียน กี่คน ทำงานตำแหน่งอะไร
2. เรียนจบแล้วกลับไปทำอะไรที่งานได้ คำตอบข้อนี้คือเป้าของทั้งหลักสูตร
3. ตอนนี้ติดอะไรอยู่ ขอเหตุการณ์จริง 1–2 เรื่อง
4. มีเวลาทั้งหมดกี่ชั่วโมง เริ่มและเลิกกี่โมง
5. สอนในห้องหรือออนไลน์ ใช้เครื่องของใคร ติดตั้งโปรแกรมเองได้ไหม
6. วัดผลอย่างไร ต้องส่งคะแนนหรือออกใบประกาศไหม

- **ความรู้ที่ต้องมีก่อนเรียน (prerequisites)** เขียนเป็นสิ่งที่ทำได้ ไม่เขียนว่า "มีพื้นฐาน" เช่น "เปิด terminal แล้วใช้ cd ย้ายโฟลเดอร์ได้" · ส่งแบบเช็ก 5 ข้อล่วงหน้า 3 วัน ถ้าผลห่างกันมาก ให้จับคู่คนคล่องกับคนเพิ่งเริ่ม หรือเปิดช่วงปูพื้น 30 นาทีก่อนวันจริง (แนวของเรา)
- **เป้าของผู้เรียน** จดเหตุผลที่ผู้เรียนต้องการทักษะนี้ไว้ที่เดียวใน `brief.md` แล้วใช้ตัดสินว่าเนื้อหาไหนได้ไปต่อ เนื้อหาไหนตัด (แนวคิดจาก `teach` ของ mattpocock/skills · MIT · เรียบเรียงใหม่)

## 2 · ผลลัพธ์การเรียนรู้ใช้กริยาที่มองเห็นได้

ผลลัพธ์การเรียนรู้ (learning outcome) 1 ข้อบอกว่าผู้เรียนทำอะไรได้ที่คนอื่นเห็นหรือตรวจได้ ภายใต้เงื่อนไขไหน และต้องดีแค่ไหน

รูปประโยค: **เมื่อจบหลักสูตร ผู้เรียน + กริยาที่มองเห็นได้ + สิ่งที่ทำ + เงื่อนไข + เกณฑ์** เช่น "แยก branch แก้ไฟล์ แล้ว merge กลับ main ได้เองโดยไม่เปิดโน้ต และไม่มีงานของอีกฝั่งหาย"

เลือกกริยาจากอนุกรมวิธานของบลูมฉบับปรับปรุง (revised Bloom's taxonomy) ด้านกระบวนการคิด 6 ระดับ (Krathwohl 2002) · ชื่อระดับไม่ใช่กริยาที่เอาไปเขียน ให้ใช้กริยาในคอลัมน์ที่ 3

| ระดับ | ความหมาย | กริยาที่มองเห็นได้ | ตัวอย่างในหลักสูตร Git |
|---|---|---|---|
| 1 จำ (Remember) | ดึงความรู้ที่เกี่ยวข้องออกจากความจำ | บอกชื่อ · ระบุ · เขียนคำสั่ง | บอกคำสั่งที่ใช้ดูสถานะไฟล์ |
| 2 เข้าใจ (Understand) | สรุปความหมายของสิ่งที่สอน ทั้งคำพูด ข้อความ และภาพ | อธิบายด้วยคำของตัวเอง · ยกตัวอย่าง · เปรียบเทียบ | อธิบายว่า `add` ต่างจาก `commit` อย่างไร |
| 3 ประยุกต์ใช้ (Apply) | ทำตามวิธีในสถานการณ์ที่กำหนด | ใช้ · รัน · ทำตามขั้น · แก้โจทย์ | commit การแก้ 3 ครั้ง ข้อความบอกว่าแก้อะไร |
| 4 วิเคราะห์ (Analyze) | แยกเป็นส่วนแล้วหาว่าแต่ละส่วนเกี่ยวกันอย่างไร | แยกแยะ · หาสาเหตุ · จัดกลุ่ม | ไล่ `git log` หา commit ที่ทำให้ราคาผิด |
| 5 ประเมิน (Evaluate) | ตัดสินตามเกณฑ์หรือมาตรฐาน | ตรวจตามเกณฑ์ · เลือกพร้อมเหตุผล · วิจารณ์ | เลือกว่าจะย้อนทั้ง commit หรือแก้ไฟล์เดียว พร้อมเหตุผล |
| 6 สร้างสรรค์ (Create) | ประกอบชิ้นส่วนเป็นของใหม่ที่ใช้ได้ทั้งชิ้น | ออกแบบ · วางแผน · สร้าง | ออกแบบกติกาตั้งชื่อ branch ของทีม |

- **ห้ามใช้ "เข้าใจ" "รู้" "ตระหนัก" "คุ้นเคยกับ" เป็นกริยาของผลลัพธ์** เพราะตรวจไม่ได้ ให้ถามต่อว่า "ถ้าเข้าใจจริง เขาจะทำอะไรต่างไปจากเดิม" แล้วเขียนสิ่งนั้นแทน (Eberly Center ของ Carnegie Mellon) · Krathwohl เล่าไว้ว่าเวลาครูบอกว่าอยากให้ผู้เรียน "เข้าใจจริง ๆ" ความหมายกินตั้งแต่ระดับเข้าใจไปถึงการสร้างงานใหม่ คำนี้จึงไม่บอกระดับ
- หลักสูตร 1 วันมีผลลัพธ์ 3–5 ข้อ ส่วนใหญ่อยู่ระดับ 3–4 และระดับ 6 ไม่เกิน 1 ข้อ เพราะงานสร้างใหม่ใช้เวลาลงมือนาน (แนวของเรา)
- จับคู่ผลลัพธ์ทุกข้อกับช่วงที่สอน แบบฝึก และการประเมินไว้ในตารางเดียว ถ้าผลลัพธ์ข้อไหนไม่มีแบบฝึก แปลว่าสอนแต่ไม่ได้ให้ลองทำ (ตารางจับคู่อยู่ในหัวข้อ 10)

## 3 · ตารางสอนแบ่งช่วงพร้อมเวลา

**สมมุติฐานของวันอบรม** (ใช้ในตัวอย่าง ไม่ใช่ข้อเท็จจริง): อบรมในบริษัทไทย 1 วัน 09:00–16:00 พักเช้าและพักบ่ายช่วงละ 15 นาที พักเที่ยง 60 นาที เหลือเวลาสอนจริง 5 ชั่วโมง 30 นาที · ทุกงานให้ถามเวลาจริงจากผู้จัด เพราะแต่ละที่ต่างกัน บางที่มีพิธีเปิดหรือถ่ายรูปหมู่กินเวลาเพิ่มด้วย

| เวลา | ช่วง | ผลลัพธ์ข้อ | สอน (นาที) | ลงมือ (นาที) | ทำอะไร · ของที่ต้องเตรียม |
|---|---|---|---:|---:|---|
| 09:00–10:30 | 1 · ชื่อช่วง | 1 | 25 | 65 | กิจกรรม · ไฟล์ที่แจก |

กฎตอนจัดช่วง (แนวของเรา)

- พูดต่อเนื่องไม่เกิน 20 นาที แล้วให้ลงมือหรือตอบคำถาม
- หลักสูตรทักษะใช้เวลาพูดราว 30% และลงมือราว 70%
- ช่วงหลังพักเที่ยงเป็นงานลงมือ ไม่ใช่บรรยาย
- เผื่อเวลา 10% ในทุกช่วงสำหรับเครื่องมีปัญหาและคำถาม
- เปิดทุกช่วงด้วยคำถามทวน 3 ข้อจากช่วงก่อน ให้ตอบโดยไม่เปิดโน้ต (ฝึกดึงความรู้ออกมาใช้ หรือ retrieval practice) และช่วงท้ายวันวนกลับมาใช้ทักษะของช่วงแรกอีกรอบ (ทวนแบบเว้นระยะ หรือ spacing) · หลักการ 2 ข้อนี้มาจาก `teach` (เรียบเรียงใหม่)
- 20 นาทีสุดท้ายของวันใช้ทวน ทำแบบประเมิน (หัวข้อ 7) และบอกว่าจะไปฝึกต่อที่ไหน

## 4 · แบบฝึกจากมีคนพาทำไปจนทำเองได้

ทุกทักษะไล่ 4 ขั้น ไม่กระโดดจากดูผู้สอนทำไปทำเองทันที

| ขั้น | ผู้สอนทำ | ผู้เรียนทำ | ตัวช่วยที่ให้ |
|---|---|---|---|
| 1 ดู | ทำให้ดูบนจอ พูดสิ่งที่คิดออกมาดัง ๆ | ดูและจด | ทุกขั้นอยู่บนสไลด์ |
| 2 ทำตาม | ทำไปพร้อมกันทีละคำสั่ง หยุดรอที่จุดตรวจ | ทำตามบนเครื่องตัวเอง | ใบขั้นตอนครบทุกขั้น |
| 3 ทำเองมีตัวช่วย | เดินดู ตอบเมื่อผู้เรียนถาม | ทำโจทย์ใหม่ที่คล้ายของเดิม | ไฟล์เริ่มต้น · คำใบ้ 3 ขั้น |
| 4 ทำเอง | ไม่ช่วย จดว่าใครติดตรงไหน | ทำโจทย์ในเรื่องใหม่ | ไม่มี ใช้ประเมินด้วย rubric |

**แบบฝึก 1 ชิ้นมีครบ 7 อย่าง:** ผลลัพธ์ข้อไหน · ไฟล์เริ่มต้น · ขั้นตอนหรือโจทย์ · **เสร็จเมื่อ** (ผลที่ตรวจได้ เช่น คำสั่งไหนต้องแสดงอะไร) · คำใบ้ 3 ขั้น (ชี้ทิศ แล้วบอกชื่อคำสั่ง แล้วบอกเกือบทั้งหมด) · เฉลยแยกไฟล์ · โจทย์เสริมสำหรับคนที่เสร็จก่อน

- **ใช้เรื่องที่ผู้เรียนเจอในงาน** ทีมบัญชีใช้ไฟล์งบ ทีมทดสอบใช้ test case ไม่ใช้ชื่อลอย ๆ แบบ `foo` `bar` (หลักเดียวกับกฎผูกกับโปรเจกต์จริงของ `learning-path`)
- **โฟลเดอร์แบบฝึก** ตั้งเลขนำหน้าตามลำดับช่วง แต่ละแบบฝึกแยก `problem/` (โจทย์ที่มีจุดให้เติม) · `solution/` (เฉลย) · `explainer/` (คำอธิบาย) มี README สั้น ๆ ทุกโฟลเดอร์ · ย้ายหรือเปลี่ยนเลขด้วย `git mv` ประวัติไฟล์จะได้ไม่หาย (แนวคิดจาก `scaffold-exercises` ของ mattpocock/skills · MIT · เรียบเรียงใหม่)
- **คำถามแบบเลือกตอบ** ทำตัวเลือกทุกข้อให้ยาวใกล้กัน และสลับตำแหน่งข้อที่ถูก ผู้เรียนจะได้เดาจากหน้าตาตัวเลือกไม่ได้ (แนวคิดจาก `teach`)
- **ลองทำแบบฝึกเองก่อนสอนทุกครั้ง** บนเครื่องรุ่นเดียวกับผู้เรียน แล้วจดเวลาที่ใช้ คูณ 3 เป็นเวลาของผู้เรียนมือใหม่ (แนวของเรา)

## 5 · การประเมิน: rubric 3–4 ระดับพร้อมงานตัวอย่าง

rubric คือชุดเกณฑ์ของงาน ที่บรรยายว่างานแต่ละระดับคุณภาพหน้าตาเป็นอย่างไร (Brookhart · ASCD)

1. เกณฑ์ 3–5 ข้อ แต่ละข้อผูกกับผลลัพธ์ 1 ข้อ
2. ระดับ 3–4 ระดับ · 4 ระดับไม่มีตรงกลาง ผู้ประเมินต้องเลือกว่าผ่านหรือยัง · 3 ระดับเร็วกว่า เหมาะกับงานสั้น (แนวของเรา)
3. ช่องในตารางบรรยายสิ่งที่เห็นในงาน ไม่ใช้คำตัดสินลอย ๆ อย่าง "ดี" "ดีมาก" "ครบถ้วน"
4. **งานตัวอย่างประจำระดับ (anchor)** เก็บงานจริงระดับละ 1 ชิ้นจากรอบทดลองสอน ลบชื่อออกและขออนุญาตเจ้าของก่อน แล้วให้ผู้ประเมิน 2 คนให้คะแนนงานชุดเดียวกัน ถ้าต่างกันเกิน 1 ระดับ ให้แก้ถ้อยคำในช่องนั้น
5. **ผ่านหรือไม่ดูทีละเกณฑ์ ไม่ใช้คะแนนรวม** ทุกเกณฑ์ต้องถึงระดับ "ทำได้เอง" เพราะคะแนนรวมให้ข้อที่ทำได้ดีมากลบข้อที่ทำไม่ได้ (แนวของเรา)
6. แจก rubric ให้ผู้เรียนดูก่อนทำโจทย์ ไม่ใช่หลังให้คะแนน

แบบทดสอบก่อนและหลังเรียน (5 ข้อชุดเดียวกัน) บอกว่าความรู้เพิ่มขึ้นไหม ส่วน rubric บอกว่าทำได้จริงไหม · ใช้ทั้ง 2 อย่าง

## 6–9 · สื่อ แบบประเมิน ออนไลน์ ลิขสิทธิ์

รายละเอียดอยู่ใน [references/materials-feedback-online-copyright.md](references/materials-feedback-online-copyright.md) · เปิดเมื่อถึงขั้นนั้น

| หัวข้อ | เปิดเมื่อ | แกนที่ต้องจำ |
|---|---|---|
| 6 · สื่อการสอน | ทำสไลด์และเอกสารแจก | สไลด์ไม่ใช่เอกสารแจก · รายละเอียดและคำสั่งอยู่ในเอกสารแจก · รัน `thai_tells.py` ก่อนพิมพ์ |
| 7 · แบบประเมินหลังอบรม | ออกแบบแบบประเมิน · ทบทวนหลังสอน | ไม่เกิน 7 ข้อ 3 นาที ไม่ต้องใส่ชื่อ · ทบทวนใน 48 ชั่วโมง · แก้ไม่เกิน 3 อย่างต่อรอบ |
| 8 · ออนไลน์กับในห้อง | สอนออนไลน์ | ช่วงละไม่เกิน 60 นาที · ส่งคู่มือติดตั้งล่วงหน้า 3 วัน · แจ้งก่อนอัดวิดีโอ (ตัวเลขเป็นแนวของเรา) |
| 9 · ลิขสิทธิ์ | ใส่ภาพ ข้อความ หรือโค้ดของคนอื่น · ขายหรือสอนลูกค้า | ของคนอื่นต้องบอกที่มา · อบรมที่เก็บเงินไม่ควรพึ่งข้อยกเว้นเพื่อการสอน · ไม่บอกสัญญาอนุญาต ถือว่าใช้ไม่ได้ · ไม่ใช่คำปรึกษากฎหมาย |

## 10 · ตัวอย่าง: หลักสูตร "Git สำหรับมือใหม่" 1 วัน

ตัวอย่างเต็มอยู่ที่ [references/git-one-day-example.md](references/git-one-day-example.md): ผลลัพธ์ 3 ข้อ · ตาราง 4 ช่วง (สอน 95 นาที ลงมือ 235 นาที ราว 29% ต่อ 71%) · แบบฝึก 2 ชุด · rubric 4 ระดับ · ตารางจับคู่ · คำสั่ง Git ทุกบรรทัดรันจริงด้วย Git 2.54 บน Windows (2026-10-23)

บทเรียน 2 ข้อจากการทดสอบตัวอย่างนี้ ใช้กับแบบฝึกที่เตรียม repo ไว้ล่วงหน้าทุกชุด:

- **repo ที่ให้ย้อนการแก้ด้วย `git revert`** อย่าให้ commit หลังจากนั้นแก้บรรทัดที่ติดกับบรรทัดที่จะย้อน เพราะ `revert` จะ conflict และกลายเป็นบทเรียนเรื่อง conflict ก่อนเวลา (เจอจริงตอนทดสอบ 2026-10-23)
- **คำเตือนที่ไม่ใช่ error** เช่น `LF will be replaced by CRLF` บน Windows ให้บอกผู้เรียนก่อนเจอ และใส่ `--no-edit` ในคำสั่งที่จะเปิดโปรแกรมแก้ข้อความซึ่งมือใหม่ปิดไม่เป็น

## 11 · ตรวจก่อนส่ง

- [ ] ผลลัพธ์ทุกข้อใช้กริยาที่มองเห็นได้ ไม่มี "เข้าใจ" "รู้" "ตระหนัก"
- [ ] ทุกช่วงชี้ไปที่ผลลัพธ์ และทุกผลลัพธ์มีแบบฝึกกับการประเมินในตารางจับคู่
- [ ] เวลาในตารางรวมแล้วเท่ากับเวลาสอนจริงที่ผู้จัดยืนยัน ถ้ายังไม่ยืนยันให้เขียนว่าเป็นสมมุติฐาน
- [ ] แบบฝึกไล่ครบ 4 ขั้น ทุกชิ้นมี "เสร็จเมื่อ" ที่ตรวจได้ และคำสั่งทุกบรรทัดรันจริงแล้วบนเครื่องรุ่นเดียวกับผู้เรียน
- [ ] rubric 3–4 ระดับ ช่องบรรยายสิ่งที่เห็นในงาน ผ่านหรือไม่ดูทีละเกณฑ์ และแจกก่อนทำโจทย์
- [ ] เอกสารแจกผ่าน `human-writing` และ `thai_tells.py` · สไลด์กับเอกสารใช้ศัพท์ชุดเดียวกัน
- [ ] ภาพ ข้อความ และโค้ดของคนอื่นมีที่มาและสัญญาอนุญาต · อบรมที่เก็บเงินไม่มีงาน NC · แบบฝึกไม่มีข้อมูลส่วนบุคคลจริง
- [ ] แบบประเมินไม่เกิน 7 ข้อ และนัดทบทวนหลังสอนไว้ในปฏิทินแล้ว

## 12 · ข้อผิดพลาดที่เจอบ่อย

- **สไลด์มากจนไม่เหลือเวลาลงมือ** นับเวลาจากตารางสอน ไม่ใช่จากจำนวนสไลด์
- **ผลลัพธ์เขียนว่า "เข้าใจ Git"** ตรวจไม่ได้ เลยออกแบบแบบฝึกและการประเมินไม่ได้ไปด้วย
- **แบบฝึกมีแต่ขั้นทำตาม** ผู้เรียนทำได้ในห้อง แต่กลับไปที่โต๊ะแล้วทำเองไม่ได้
- **rubric ใช้คำว่า "ดี" กับ "ดีมาก"** ผู้ประเมิน 2 คนให้คะแนนงานเดียวกันไม่ตรงกัน
- **แบบประเมินถามแต่ความพอใจ** รอบหน้าเลยไม่รู้ว่าต้องแก้อะไร
- **ติดตั้งโปรแกรมในวันสอน** ช่วงแรกหายไปกับการแก้เครื่อง ให้ส่งคู่มือติดตั้งและนัดเช็กเครื่องล่วงหน้า
- **ใช้ภาพจากผลค้นหาโดยไม่ดูสัญญาอนุญาต** ดูหัวข้อ 9 ใน references/materials-feedback-online-copyright.md

## เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| ฝั่งผู้เรียน: วางเส้นทางเรียนเอง | `learning-path` |
| สไลด์ที่คนจะนำเสนอ (เรื่องเล่า หัวสไลด์ ฟอนต์ไทย) | `presentation-design` (software-development) |
| สไลด์ HTML ไฟล์เดียว เปิดได้ไม่ต้องต่อเน็ต มีโน้ตผู้พูด | `html-slide-deck` (software-development) |
| เอกสารแจกเป็น Word จาก Markdown | `markdown-report-docx` (software-development) |
| ภาษาไทยในเอกสารแจก สไลด์ และแบบประเมิน | `human-writing` · ตัดคำไทยในไฟล์ส่งออก `references/thai-line-breaking.md` |
| ผู้เรียนอยากสอบใบรับรองต่อ | `cert-prep` |
| เก็บชื่อหรืออีเมลผู้เรียน · อัดวิดีโอการสอน | `pdpa-workflow` (e-commerce) |
| สัญญาจ้างสอนและสิทธิ์ในสื่อ | `doc-contract-th` (e-commerce) |
| ใบเสนอราคาค่าอบรม | `doc-quotation` (e-commerce) |
| คลิปสั้นโปรโมตหลักสูตร | `video-script-to-clip` (graphic-design) |

## แหล่งที่มา (ตรวจ 2026-10-23)

ตารางแหล่งที่มาทุกข้อ (Bloom · rubric · Kirkpatrick · ลิขสิทธิ์ · Creative Commons · Git): [references/sources.md](references/sources.md)


## reference: git-one-day-example.md

# ตัวอย่าง: หลักสูตร "Git สำหรับมือใหม่" 1 วัน

ตัวอย่างเต็มของ `course-builder` หัวข้อ 10 · กฎทั้งหมดอยู่ใน [SKILL.md](../SKILL.md) ไฟล์นี้แสดงว่ากฎหน้าตาเป็นอย่างไรเมื่อใช้จริง

ทั้งหัวข้อนี้เป็น **ตัวอย่าง** ผู้เรียน จำนวนคน และเวลาเป็นค่าสมมุติ · คำสั่ง Git ทุกบรรทัดรันจริงแล้วด้วย Git 2.54 บน Windows (2026-10-23)

โจทย์: นักวิเคราะห์ธุรกิจ (Business Analyst: BA) และผู้ทดสอบระบบ (Quality Assurance: QA) 12 คน อยากเก็บเอกสารข้อกำหนดและ test case ใน Git แทนการส่งไฟล์ `_final_v3` ทางอีเมล · สอนในห้อง · เครื่องของบริษัทติดตั้ง Git ไว้แล้ว

ความรู้ที่ต้องมี: เปิด terminal แล้วใช้ `cd` กับ `ls` ได้ · พิมพ์ `git --version` แล้วเห็นเลขรุ่น

**ผลลัพธ์ 3 ข้อ** เมื่อจบวัน ผู้เรียน

1. สร้าง repository แล้ว commit การแก้ไฟล์ 3 ครั้ง ข้อความ commit ทุกอันบอกว่าแก้อะไร (ประยุกต์ใช้)
2. ใช้ `git log` กับ `git show` หา commit ที่ทำให้ราคาในเมนูผิด แล้วย้อนเฉพาะการแก้นั้นด้วย `git revert` ได้เอง (วิเคราะห์)
3. แยก branch แก้งาน แล้ว merge กลับ `main` และแก้ conflict 1 จุดให้ไฟล์เก็บงานของทั้ง 2 ฝั่ง (ประยุกต์ใช้)

**ตาราง 4 ช่วง** (วันอบรมตามสมมุติฐานในหัวข้อ 3)

| เวลา | ช่วง | ผลลัพธ์ข้อ | สอน (นาที) | ลงมือ (นาที) | ทำอะไร |
|---|---|---|---:|---:|---|
| 09:00–10:30 | 1 · เก็บรุ่นของไฟล์ | 1 | 25 | 65 | ไฟล์ `_final_v3` พังเพราะอะไร · `git config` · `init` · `status` · `diff` · `add` · `commit` · แบบฝึก 1 ส่วน ก |
| 10:30–10:45 | พัก | | | | |
| 10:45–12:00 | 2 · ย้อนดูและย้อนกลับ | 2 | 20 | 55 | `log` · `show` · `revert` · แบบฝึก 1 ส่วน ข |
| 12:00–13:00 | พักเที่ยง | | | | |
| 13:00–14:30 | 3 · แยกงานแล้วรวม | 3 | 20 | 70 | `switch -c` · `merge` · conflict · แบบฝึก 2 |
| 14:30–14:45 | พัก | | | | |
| 14:45–16:00 | 4 · ทำเองทั้งชุด | 1–3 | 30 | 45 | อธิบายโจทย์ 10 นาที · โจทย์ปิดท้ายคนเดียว 45 นาที ประเมินด้วย rubric · ทวนและแบบประเมิน 20 นาที |

รวมสอน 95 นาที ลงมือ 235 นาที (ราว 29% ต่อ 71%) · การ push ขึ้น GitHub และ pull request ไม่อยู่ในวันนี้ เก็บไว้หลักสูตรครึ่งวันถัดไป

**แบบฝึก 1 · เมนูร้านกาแฟ** (ขั้นทำตาม · ผลลัพธ์ 1 และ 2)

ส่วน ก (ช่วง 1): แจกโฟลเดอร์ `cafe-menu/` ที่มีไฟล์ `menu.md` แล้วพิมพ์ไปพร้อมกันทีละคำสั่ง

```bash
git config --global user.name "ชื่อของคุณ"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
cd cafe-menu
git init
git status                      # menu.md ยังไม่อยู่ในความดูแลของ Git
git add menu.md
git commit -m "เริ่มเมนูร้าน"
# เพิ่มบรรทัด "- ชาไทยเย็น 45" ใน menu.md แล้วบันทึกไฟล์
git diff                        # เห็นบรรทัดที่เพิ่ม
git add menu.md
git commit -m "เพิ่มชาไทยเย็นในเมนู"
git log --oneline
```

เสร็จเมื่อ `git log --oneline` แสดง 3 บรรทัด (commit ที่ 3 ผู้เรียนทำเอง) และอ่านแล้วรู้ว่าแต่ละครั้งแก้อะไร · คำใบ้ 3 ขั้น: ดูว่า `git status` บอกสถานะไฟล์ว่าอะไร → ต้อง `add` ก่อน `commit` → คำสั่งเต็ม 2 บรรทัด · บน Windows อาจเห็นคำเตือน `LF will be replaced by CRLF` ให้บอกผู้เรียนก่อนว่าไม่ใช่ error

ส่วน ข (ช่วง 2): แจก repo `cafe-history` ที่มี commit 6 อัน อันหนึ่งชื่อ "ปรับเมนู" แก้ราคาอเมริกาโน่จาก 50 เป็น 500 · ผู้เรียนไล่หาด้วย `git log --oneline` ดูว่าแก้อะไรด้วย `git show <รหัส commit>` แล้วย้อนเฉพาะการแก้นั้นด้วย `git revert --no-edit <รหัส commit>` (`--no-edit` กันไม่ให้ Git เปิดโปรแกรมแก้ข้อความที่มือใหม่ปิดไม่เป็น) · เสร็จเมื่อ `menu.md` กลับเป็น 50 และการแก้อื่นหลังจากนั้นยังอยู่ครบ

ตอนเตรียม repo นี้ อย่าให้ commit หลังจากนั้นแก้บรรทัดที่ติดกับบรรทัดราคาผิด ไม่อย่างนั้น `git revert` จะ conflict และกลายเป็นบทเรียนของช่วง 3 ก่อนเวลา (เจอจริงตอนทดสอบตัวอย่างนี้)

**แบบฝึก 2 · ลาเต้นมโอ๊ต** (ขั้นทำเองมีตัวช่วย แล้วทำเอง · ผลลัพธ์ 3)

รอบแรกมีใบขั้นตอน 5 ขั้นและคำใบ้ 3 ขั้น

1. `git switch -c oat-milk` แล้วแก้บรรทัด `- ลาเต้เย็น 55` เป็น `- ลาเต้เย็นนมโอ๊ต 55` แล้ว `add` และ `commit`
2. `git switch main` แล้วแก้บรรทัดเดียวกันเป็น `- ลาเต้เย็น 60` แล้ว `add` และ `commit`
3. `git merge oat-milk` จะเกิด conflict ใน `menu.md`
4. แก้ไฟล์ให้เก็บทั้ง 2 เจตนาเป็น `- ลาเต้เย็นนมโอ๊ต 60` แล้วลบเครื่องหมาย `<<<<<<<` `=======` `>>>>>>>` ออก
5. `git add menu.md` แล้ว `git commit --no-edit`

รอบสองแจกไฟล์ `hours.md` (เวลาเปิดร้าน) ให้ commit ลง `main` ก่อน แล้วสร้าง conflict แบบเดียวกันบน branch ชื่อใหม่ เช่น `weekend-hours` (ฝั่งหนึ่งเพิ่มวันเสาร์ อีกฝั่งเลื่อนเวลาเปิด) โดยไม่มีใบขั้นตอน · เสร็จเมื่อ `git log --graph --oneline` เห็นเส้น 2 เส้นมารวมกัน และไม่มีเครื่องหมาย `<<<<<<<` เหลือในไฟล์

**rubric ของโจทย์ปิดท้าย (ช่วง 4)** 4 ระดับ · ผ่านเมื่อทุกเกณฑ์ถึงระดับ 3

| เกณฑ์ (ผลลัพธ์) | 1 ยังทำไม่ได้ | 2 ทำได้เมื่อมีคนช่วย | 3 ทำได้เอง | 4 ทำได้และอธิบายให้คนอื่นได้ |
|---|---|---|---|---|
| commit (ข้อ 1) | ไม่มี commit หรือ commit ทุกอย่างก้อนเดียวโดยไม่ดูว่ามีอะไร | commit ได้ แต่ข้อความไม่บอกว่าแก้อะไร เช่น `update` | แยก commit ตามเรื่อง ข้อความบอกสิ่งที่แก้ | ได้ระดับ 3 และเปิด `git status` กับ `git diff` ดูก่อน commit ทุกครั้งโดยไม่มีใครเตือน |
| หาและย้อนการแก้ (ข้อ 2) | หา commit ที่ทำให้ราคาผิดไม่เจอ | หาเจอเมื่อมีคนบอกคำสั่ง | ใช้ `log` กับ `show` หาเจอ แล้ว `revert` ได้เอง | ได้ระดับ 3 และบอกได้ว่าเมื่อไรควรย้อนทั้ง commit เมื่อไรควรแก้ไฟล์เดียว |
| branch และ conflict (ข้อ 3) | merge ไม่สำเร็จ หรือแก้ conflict แล้วงานอีกฝั่งหาย | แก้ conflict ได้เมื่อดูใบขั้นตอน | แก้ conflict เองและเก็บงานของทั้ง 2 ฝั่ง | ได้ระดับ 3 และบอกได้ว่าครั้งหน้าจะเลี่ยง conflict แบบนี้อย่างไร |

งานตัวอย่างประจำระดับ: หลังรอบทดลองสอน เก็บภาพ `git log --graph --oneline` กับไฟล์ `menu.md` หลังแก้ ของงานระดับ 2 และระดับ 3 ในเกณฑ์ branch และ conflict ไว้ที่ `course/anchors/` (ลบชื่อออกแล้ว)

**ตารางจับคู่**

| ผลลัพธ์ | ช่วง | แบบฝึก | ประเมิน |
|---|---|---|---|
| 1 commit | 1 | แบบฝึก 1 ส่วน ก | rubric เกณฑ์ commit · แบบทดสอบก่อนและหลัง ข้อ 1–2 |
| 2 หาและย้อนการแก้ | 2 | แบบฝึก 1 ส่วน ข | rubric เกณฑ์หาและย้อน · แบบทดสอบข้อ 3–4 |
| 3 branch และ conflict | 3 | แบบฝึก 2 | rubric เกณฑ์ branch และ conflict · แบบทดสอบข้อ 5 |


## reference: materials-feedback-online-copyright.md

# course-builder · หัวข้อ 6–9 (สื่อ แบบประเมิน ออนไลน์ ลิขสิทธิ์)

ย้ายมาจาก [SKILL.md](../SKILL.md) · กฎหลักของ skill (ผลลัพธ์ชี้กลับทุกช่วง) อยู่ใน SKILL.md · เลขหัวข้อคงเดิม

## 6 · สื่อการสอน: สไลด์และเอกสารแจกภาษาไทย

- **สไลด์** โครงเรื่อง หัวสไลด์ที่เป็นข้อสรุป layout และฟอนต์ไทย ใช้ `presentation-design` (software-development) · ถ้าต้องเปิดได้โดยไม่ต่อเน็ต เป็นไฟล์เดียว มีโน้ตผู้พูด ใช้ `html-slide-deck` (software-development) · ถ้ายังไม่ได้ติดตั้ง plugin นั้น ให้บอกผู้ใช้ แล้วใช้หัวข้อ 6 ของ `human-writing` (หัวสไลด์คือข้อสรุปของหน้า)
- **สไลด์ไม่ใช่เอกสารแจก** สไลด์มีหัวที่เป็นข้อสรุป ภาพ หรือโค้ดสั้น ส่วนรายละเอียดและคำสั่งที่ต้องพิมพ์ตามอยู่ในเอกสารแจก ผู้เรียนจะได้ไม่ต้องถ่ายรูปจอ
- **เอกสารแจกภาษาไทย** เขียนตาม `human-writing` ระดับภาษา "อธิบาย" (ไม่มีครับหรือค่ะในเนื้อ) · คำสั่งอยู่ใน code block คัดลอกไปวางแล้วรันได้ · ตัวย่อเขียนเต็มครั้งแรก · สิ่งเดียวกันเรียกคำเดียวทั้งสไลด์ เอกสาร และแบบฝึก · รัน `thai_tells.py` ก่อนส่งพิมพ์
- **สรุป 1 หน้า (cheat sheet)** คำสั่งที่ใช้บ่อยพร้อมตัวอย่าง ผู้เรียนเอากลับไปวางข้างจอได้
- ส่งออกเป็น Word หรือ PDF ใช้ `markdown-report-docx` (software-development) · ตัดคำไทยในไฟล์ส่งออกตาม `human-writing` `references/thai-line-breaking.md`
- ชื่อไฟล์มีรุ่นและวันที่ เช่น `git-basics-handout-v02-2026-11-05.pdf` ผู้เรียนจะได้รู้ว่าถือฉบับไหนอยู่

## 7 · แบบประเมินหลังอบรม และสิ่งที่จะแก้รอบหน้า

แบบจำลองของ Kirkpatrick วัดผลการอบรม 4 ระดับ: ปฏิกิริยา (ผู้เรียนรู้สึกกับการอบรมอย่างไร) · การเรียนรู้ (ได้ความรู้และทักษะตามเป้าไหม) · พฤติกรรม (กลับไปทำจริงที่งานไหม) · ผลลัพธ์ (เป้าขององค์กรขยับไหม) · หลักสูตร 1 วันวัด 2 ระดับแรกในวันนั้น แล้วนัดถามระดับ 3 หลังอบรม 30 วัน (แนวของเรา)

แบบประเมินไม่เกิน 7 ข้อ กรอกเสร็จใน 3 นาที ไม่ต้องใส่ชื่อ

1. ความมั่นใจ 1–5 ต่อผลลัพธ์แต่ละข้อ (ใส่ข้อความผลลัพธ์จริงลงในแบบ)
2. ช่วงไหนได้ใช้มากที่สุด
3. ช่วงไหนเสียเวลา
4. ความเร็ว: ช้าไป · พอดี · เร็วไป
5. สัปดาห์หน้าจะเอาเรื่องไหนไปใช้ 1 เรื่อง
6. ถ้าแก้หลักสูตรได้ 1 อย่าง จะแก้อะไร
7. จะแนะนำให้เพื่อนร่วมงานมาเรียนไหม เพราะอะไร

ถ้าต้องเก็บชื่อหรืออีเมล เช่น เพื่อส่งใบประกาศ ให้แจ้งว่าเก็บไปทำอะไรและเก็บนานเท่าไร ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (Personal Data Protection Act: PDPA) · ขั้นตอนอยู่ใน `pdpa-workflow` (e-commerce)

**ทบทวนหลังสอนภายใน 48 ชั่วโมง** แล้วจดลง `course/course-log.md` พร้อมวันที่สอน จำนวนผู้เรียน และรุ่นของสื่อ

| ตัดสินใจ | หลักฐาน | รอบหน้า |
|---|---|---|
| เก็บ | ช่วง 3 ได้ความมั่นใจเฉลี่ย 4.5 จาก 5 (ตัวอย่าง) | คงไว้ |
| แก้ | 5 จาก 12 คนติด conflict นานกว่า 20 นาที (ตัวอย่าง) | เพิ่มภาพหน้าจอในใบขั้นตอน และคำใบ้ขั้นแรก |
| ตัด | ช่วงประวัติของ Git ไม่มีใครเลือกว่าได้ใช้ (ตัวอย่าง) | เหลือ 1 สไลด์ |

แก้ไม่เกิน 3 อย่างต่อรอบ จะได้รู้ว่าอะไรช่วยจริง (แนวของเรา)

## 8 · ออนไลน์กับในห้องต่างกันตรงไหน

| เรื่อง | ในห้อง | ออนไลน์ |
|---|---|---|
| ความยาวต่อช่วง | 75–90 นาที | ไม่เกิน 60 นาทีแล้วพัก 5–10 นาที · หลักสูตร 1 วันแบ่งเป็น 2 ครึ่งวันคนละวัน |
| เครื่องและโปรแกรม | มีเครื่องสำรองในห้อง 1–2 เครื่อง | ส่งคู่มือติดตั้งล่วงหน้า 3 วัน · นัดเช็กเครื่อง 15 นาทีก่อนวันจริง |
| ผู้ช่วยสอน | 1 คนต่อผู้เรียน 10–12 คนในช่วงลงมือ | 1 คนดูแชตและห้องย่อย (breakout room) |
| ดูว่าใครติด | เดินดูจอ | ให้แชร์จอ หรือส่งภาพผลลงแชตที่จุดตรวจ |
| งานกลุ่ม | กลุ่มโต๊ะละ 3–4 คน | ห้องย่อยละ 3–4 คน เขียนโจทย์และเวลาไว้ในแชตก่อนแยกห้อง |
| คำถาม | ยกมือถาม | ถามในแชตหรือ poll · ผู้สอนหยุดอ่านแชตทุก 10 นาที |
| การอัดวิดีโอ | ส่วนใหญ่ไม่อัด | อัดได้ แต่แจ้งก่อนเริ่ม และบอกว่าเก็บที่ไหน นานเท่าไร (PDPA) |
| เอกสาร | พิมพ์แจก | ส่ง PDF และลิงก์ก่อนเริ่ม |

ตัวเลขในตารางนี้เป็นแนวของเรา ให้ปรับจาก `course-log.md`

## 9 · ลิขสิทธิ์ของสื่อการสอน

ข้อมูลทั่วไป ไม่ใช่คำปรึกษากฎหมาย · สื่อที่จะขายหรือใช้กับลูกค้าหลายราย ให้นักกฎหมายตรวจก่อน

- **ใช้ตัวอย่างของตัวเอง** แต่งโค้ด สถานการณ์ และข้อมูลตัวอย่างขึ้นเอง · ข้อมูลจริงของลูกค้าหรือพนักงานห้ามใส่ในแบบฝึก เพราะเป็นข้อมูลส่วนบุคคล ให้แต่งชื่อและตัวเลขใหม่ทั้งหมด
- **ของคนอื่นต้องบอกที่มา** ทุกภาพ ข้อความ และโค้ดที่ไม่ได้ทำเอง ใส่ชื่องาน ผู้สร้าง ลิงก์ สัญญาอนุญาต และวันที่เปิดดู ไว้ใต้ภาพหรือท้ายเอกสาร
- **ข้อยกเว้นเพื่อการสอนใช้ได้เมื่อไม่หากำไร** พ.ร.บ.ลิขสิทธิ์ พ.ศ. 2537 มาตรา 32 (6) และ (7) ยกเว้นให้ผู้สอนและสถาบันศึกษาที่ทำซ้ำหรือแจกงานเพื่อการสอนที่ไม่หากำไร · อบรมที่เก็บเงินหรือรับจ้างสอนจึงไม่ควรพึ่งข้อยกเว้นนี้ (อนุมาน) · มาตรา 33 ให้คัดหรืออ้างงานบางตอนได้ตามสมควร ถ้าบอกว่าใครเป็นเจ้าของ
- **สัญญาอนุญาต Creative Commons (CC)** BY ต้องให้เครดิต · SA งานดัดแปลงต้องใช้สัญญาเดียวกัน · NC ใช้เพื่อการค้าไม่ได้ อบรมที่เก็บเงินจึงเลี่ยงงาน NC · ND ห้ามดัดแปลง · งานที่ไม่บอกสัญญาอนุญาตเลย ให้ถือว่าใช้ไม่ได้จนกว่าเจ้าของอนุญาต (แนวของเรา)
- **สื่อที่คุณทำเป็นของใคร** ทำในฐานะพนักงาน ลิขสิทธิ์เป็นของผู้สร้างถ้าไม่ได้ทำหนังสือตกลงไว้เป็นอย่างอื่น แต่นายจ้างนำออกเผยแพร่ตามวัตถุประสงค์ของการจ้างได้ (มาตรา 9) · รับจ้างทำให้คนอื่น ลิขสิทธิ์เป็นของผู้ว่าจ้าง เว้นแต่ตกลงไว้เป็นอย่างอื่น (มาตรา 10) · วิทยากรอิสระที่อยากเอาสไลด์ไปสอนที่อื่นต่อ ให้เขียนเรื่องนี้ไว้ในสัญญาก่อนเริ่มงาน ใช้ `doc-contract-th` (e-commerce)


## reference: sources.md

# แหล่งที่มาของ course-builder (ตรวจ 2026-10-23)

## แหล่งที่มา (ตรวจ 2026-10-23)

| เรื่อง | ที่มา |
|---|---|
| ด้านกระบวนการคิด 6 ระดับและความหมาย · ครูใช้คำว่า understand กว้างเกินไป | Krathwohl, D. R. (2002). A Revision of Bloom's Taxonomy: An Overview. *Theory Into Practice*, 41(4), 212–218. https://doi.org/10.1207/s15430421tip4104_2 · ตรวจข้อมูลบทความกับ CrossRef และอ่านหน้า 214–215 จากสำเนาที่ Royal Veterinary College เผยแพร่ |
| ผลลัพธ์ต้องใช้กริยาที่ตรวจได้ · "understand X" เป็นตัวอย่างผลลัพธ์ที่คลุมเครือ | Eberly Center, Carnegie Mellon University · cmu.edu/teaching/designteach/design/learningobjectives.html |
| นิยาม rubric | Susan M. Brookhart, *How to Create and Use Rubrics for Formative Assessment and Grading* (ASCD) · หน้าบทที่ 1 บน ascd.org · ปีพิมพ์ (ยังไม่ได้ตรวจ) |
| 4 ระดับของ Kirkpatrick | kirkpatrickpartners.com/the-kirkpatrick-model |
| พ.ร.บ.ลิขสิทธิ์ พ.ศ. 2537 มาตรา 9 · 10 · 32 · 33 | ตัวบทบน th.wikisource.org · ยังไม่ได้ตรวจกับราชกิจจานุเบกษาและฉบับแก้ไขภายหลัง (ฉบับที่ 2 พ.ศ. 2558 เป็นต้นไป) |
| ความหมายของ BY · SA · NC · ND | creativecommons.org/share-your-work/cclicenses |
| เป้าของผู้เรียนจดไว้ที่เดียว · ทวนแบบดึงความรู้และเว้นระยะ · ตัวเลือกยาวใกล้กันและสลับตำแหน่งข้อที่ถูก | github.com/mattpocock/skills ไฟล์ `skills/productivity/teach` · MIT (Copyright (c) 2026 Matt Pocock) · ใช้แนวคิด เขียนใหม่ ไม่คัดลอก |
| โฟลเดอร์โจทย์ เฉลย คำอธิบาย · เลขนำหน้า · `git mv` | github.com/mattpocock/skills ไฟล์ `skills/misc/scaffold-exercises` · MIT · ใช้แนวคิด เขียนใหม่ |
| คำสั่ง Git ในหัวข้อ 10 (`references/git-one-day-example.md`) | รันจริงด้วย Git 2.54.0 บน Windows 2026-10-23 · `git revert` conflict เมื่อ commit หลังจากนั้นแก้บรรทัดที่ติดกัน (เจอจริงตอนทดสอบ) |
| เวลาวันอบรม · สัดส่วนพูดต่อลงมือ · ตัวเลขที่ติดป้าย (แนวของเรา) | สมมุติฐานและค่าเริ่มต้นของทีม ยังไม่ได้ตรวจกับงานวิจัย |


---

# skill: human-writing

Use before writing or editing anything people read (answer, email, report, README, slide, label) in Thai or English. Look → polished-document-style.

# human-writing — write like a person: smooth to read, easy to understand

Applies to everything a person will read, from chat to labels in a diagram. This skill teaches good Thai and good English. Rules about Thai output stay as written. Examples of every rule and their sources → [`headings-and-examples`](references/headings-and-examples.md). Thai of 1 paragraph or more → [`thai-grammar`](references/thai-grammar.md) (sentence structure · register · example paragraphs in [`thai-examples`](references/thai-examples.md)). Research or work sent to outsiders → [`strict-review`](references/strict-review.md). Thai documents with justified alignment → [`thai-line-breaking`](references/thai-line-breaking.md). It lives only in plugin `superuser`; other plugins share it through `dependencies`.

Boundary: this skill owns the wording. The look of kept documents (headings, tables, text boxes, theme) → `polished-document-style`. Abbreviations and glossaries → `spell-out-abbreviations`.

## 1 · Core principles

- Write as if explaining to a skilled coworker who is not on the project. If it trips you up when read aloud, rewrite it.
- Answer or conclusion first, then the reason. No preamble, no repeating the question.
- 1 sentence, 1 idea. If you chain "ซึ่ง" "โดย" "จึง" several layers deep, split into several sentences.
- English follows the same rules: sentences under 25 words · who does what (active voice) · plain words.

## 2 · Symbols and numbers

- `→` means order of steps or a consequence · `·` separates short nouns on one line · `:` introduces detail · write every kind of count as a numeral · the words around a symbol must be human language.
- **Write conditions and instructions as full sentences with connectors** (ถ้า … ให้ … · แล้ว · ส่วน · เพราะ — that is, if … then … · and then · as for · because). Do not chain sentences into fragments with `→` or `·`.
- In tables, short text is fine, but it must still read as human language, not code.
- A symbol must never replace a word so far that the reader has to decode it. If an outsider must guess what the arrow means, add words.
- **No emoji or icons** (📌 ✅ 💡 🚀 👀) in headings, body, tables, labels, or text boxes, because readers spot them at once as AI-written. Use bold words instead, such as **หมายเหตุ** (note). Yes/no cells in a table may use `✓` `✗`. Show severity with the words `วิกฤต · สูง · กลาง · ต่ำ`, never coloured dots. Do not delete emoji the owner wrote, and do not copy them. The one exception is customer chat text that the task's own skill prescribes.
- Say what every number means. Compare so it is easy to picture (times, easier to read than %). If a result is uncertain, say plainly why.
- **Figures that change over time** (prices · tax rates · law · filing deadlines): give the source and the date checked. Cite only sources you actually opened, with a link or DOI. Mark hypothetical numbers or mock data with the label `ตัวอย่าง` (example) from the first place they appear.
- **Dates** in Thai text use Buddhist Era (พ.ศ.) or Common Era (ค.ศ.), one style across the whole set. File names, codes, and machine-read data use Common Era `YYYY-MM-DD`.
- **Task status** uses these 5 words in every document: `เสร็จ · ทำอยู่ · ติด · รออนุมัติ · ค้างอยู่` (done · in progress · blocked · awaiting approval · pending). Check results use `ผ่าน · ไม่ผ่าน` (pass · fail).

## 3 · Words

- Use words people actually say. No bureaucratic words or literal-translation jargon.
- Keep terms the field already uses in English (token · prompt · API · OCR).
- Abbreviations → follow `spell-out-abbreviations`. Explain a coined or confusing term the first time you use it.
- Call one thing by one word across the whole set: chat, slides, documents, and diagrams.
- Two-language documents: pick 1 main language and put the other in brackets or a second column. Do not switch back and forth inside a sentence.
- Cut padding words ("ทำการ" · "มีการ" · "ในส่วนของ" · "ได้มีการ" · "เป็นการ" — empty Thai fillers such as "ทำการ" before a verb).
- **Cut items, not function words.** Every kind of length budget (words per bullet · characters per commit title · characters per subtitle) is met by dropping items, condensing content, or moving it to the next piece. Never cut `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` (Thai function words: future marker, "to/let", "also", "too", "then", emphatic particle) or polite words (`ขอ` `รบกวน` `นะ` and ครับ/ค่ะ, per register). These do work in the sentence. Cut them and Thai turns curt and reads like a translation.
- Avoid moves that look AI-written: a quotable opener · the slogan "ไม่ใช่แค่… แต่ยัง…" (not just… but also…) used for emphasis (a sentence that contrasts with something real or reframes the problem is fine, but it must close with "ด้วย") · grouping everything in threes · praising something as more important than it is · bold on every line · a closing recap · opening with "แน่นอน" (certainly) · closing with "หวังว่าจะช่วยได้" (hope this helps) · using "หลาย" (several) when you know the number · stacked hedges (hedge once, at the point you are truly unsure).
- For work people look at (screens · slides · ads) also avoid: broad ad words (ยกระดับ · ไร้รอยต่อ · ล้ำสมัย · supercharge — elevate · seamless · cutting-edge) · em dashes in every sentence · canned openers ("ในยุคดิจิทัลที่…" — "In the digital age where…") · short fragments split by full stops ("เร็ว. ง่าย. ครบ." — "Fast. Easy. Complete.") · claims a competitor could also make: put in a real name or number instead · for the look of the work, use `no-ai-look`.

## 4 · Answering in chat

- First sentence answers directly, then the reason.
- Short question → short answer, 2–3 sentences, no headings or tables.
- Use a table to compare 2 or more options or many numbers. Use a list when there are several items to scan. No nested bullets (split sub-topics into a new bold heading). 2–3 short items go on one line separated by ` · `. Include only what the reader needs.
- Report finished work by its result, not by narrating the steps.
- If you told them something wrong, say what was wrong and what is right. No long apology. If unsure, say where and how to check. Do not guess in a confident voice.
- When the user must decide: offer options, name the recommended one and why, and close with 1 question that is easy to answer.
- Longer than 1 screen: answer the important part first and offer the detailed version in 1 line (do not stop to ask).
- If the user says "งง" (confused) or "พูดง่าย ๆ" (say it simply): rewrite the last answer at half the length, with no unexplained jargon and no new content.
- End with 1 thing they can actually do next. No recap.
- **Answering from a document or the web**: retell in your own words, never translate sentence by sentence · cause and effect in one paragraph · small exceptions in brackets · 2–3 bold labels are enough · put sources together at the end of the answer.

## 5 · Documents and reports

- The first paragraph is the conclusion. Reading only it must give the point.
- Headings say what the content is, not the category name · at most 5 sentences per paragraph.
- Column headings say what is measured · 1 column, 1 meaning.
- Footnotes are for definitions and number sources · never hide an important conclusion in a footnote.
- Work summaries and status reports: bold headings only as needed, **ผล** (result) → **ที่ทำ** (what was done) → **ต่อไป** (next) (add headings when there is real content, such as awaiting approval) · cut behind-the-scenes method, solved problems that do not affect the reader, and numbers not used for a decision · tag every claim `ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ` (verified · from a source · inferred · not yet checked; meanings in `superuser` `references/evidence.md`).
- Formal documents (official letters · contracts · tax invoices) use the wording the form requires. This file covers only the parts you write yourself. Choose the register for each job (official · business · shop chat · job application · complaint · screen) from the table in `thai-grammar` section 4 before writing, and keep it through the whole piece.

## 6 · Slides and headings of every kind

Applies to slide titles, figure titles, document headings, and box titles in a diagram. The full rules and the before → after table are in the same reference.

- A slide title = the conclusion of the page, not the topic name · at most 2 lines (about 15 words) · detail goes in the page body.
- **A title with 2 parts needs a connector that matches the real relationship** ("เพราะ" or "จึง" for reason · "ส่วน" for a split of roles · "แต่" for contrast — because or so · as for · but) · 1 title, 1 connector. If it needs 2, you crammed too much in.
- Use phrases people actually say, not strings of nouns · choose words by reader.
- The verb matches what the page shows · do not use "คน" (person) for things that are not people.
- The caption under a picture must say what the picture does not. If it repeats the picture, cut it · page structure: problem → fix → result · write a speaking script the way it is actually spoken.
- **Test:** read the title once to an outsider. If they cannot retell it, rewrite it.

## 7 · Diagrams

- Box labels are short nouns of 1–4 words people understand · arrow labels are verbs · an unlabelled arrow must be impossible to misread.
- Words in the figure match the document · the figure title is a conclusion, with 1 sentence under it saying what to look at · follow the house style if there is one.

## 8 · 7-point check before sending

1. Does it read smoothly aloud, and not like a translation?
2. Can an outsider understand it without asking? Can every symbol be read?
3. Does the first sentence already answer the question or give the conclusion?
4. Do terms and numbers match across every file in the set?
5. Is there any padding you can cut without changing the meaning? If so, cut it. But `จะ` `ให้` `ก็` `ด้วย` `แล้ว` and polite words are not padding (section 3). If cutting made a sentence curt, put them back.
6. Does every heading pass section 6: 2 parts have a connector · a phrase people say · words fit the reader · the verb matches what the figure shows?
7. Thai of 1 paragraph or more: run `python scripts/thai_tells.py <file>` (warns only, does not judge), then walk the 7 sentence-structure rules in `thai-grammar`. Passing every rule is not the same as reading smoothly. For language, taste, and looks, the final verdict belongs to the user, not to the model doing the check.


## reference: headings-and-examples.md

# หัวข้อ · สไลด์ · diagram และตัวอย่าง ก่อน → หลัง (ฉบับเต็ม)

อ่านเมื่อเขียนหัวสไลด์ ชื่อรูป ป้ายใน diagram หรืออยากดูตัวอย่างการแก้ · กฎย่ออยู่ใน `SKILL.md` ข้อ 6–7

## สไลด์ และหัวข้อทุกชนิด

- หัวสไลด์ = ข้อสรุปของหน้า ไม่ใช่ชื่อหัวข้อ: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"

**เขียนหัวให้ลื่น ไม่กำกวม** — ใช้กับหัวสไลด์ ชื่อรูป หัวข้อเอกสาร และหัวกล่องใน diagram

- **หัวที่มี 2 ท่อนต้องมีคำเชื่อม** (ส่วน · แต่ · เพราะ · จึง) ห้ามวาง 2 วลีเรียงกันเฉย ๆ เพราะคนอ่านต้องเดาเองว่า 2 ท่อนเกี่ยวกันอย่างไร
- **คำเชื่อมต้องตรงกับความสัมพันธ์จริง** ใช้ "เพราะ" หรือ "จึง" เฉพาะเมื่อท่อนหนึ่งเป็นเหตุของอีกท่อนจริง ถ้า 2 ท่อนแค่แบ่งหน้าที่กัน ใช้ "ส่วน" ถ้าขัดกัน ใช้ "แต่" · หัวหนึ่งใช้คำเชื่อมได้ 1 คำ ถ้าต้องใช้ 2 คำแปลว่ายัดเกินไป ให้ตัดเหลือเรื่องเดียว
- **หัวยังต้องสั้น** หัวสไลด์ไม่เกิน 2 บรรทัด (ประมาณ 15 คำ) ถ้ายาวกว่านี้ ให้ตัดรายละเอียดลงไปในเนื้อหน้า อย่าเติมคำเชื่อมจนกลายเป็นย่อหน้า
- **ใช้วลีที่คนพูดจริง** ถ้าย่อจนกลายเป็นคำนามเรียงกัน เช่น "AI ทำงานภาษา" ให้หากริยาที่คนใช้จริง เช่น "AI ช่วยเขียนคำตอบ"
- **เลือกคำตามคนอ่าน** ถ้าผู้อ่านไม่ใช่สายเทคนิค ใช้ "ระบบ" แทน "โค้ด" ใช้ "ตรวจขาเข้า" แทน "Guard" ส่วนศัพท์เทคนิคใช้ได้เมื่อผู้อ่านเป็นทีมเทคนิค
- **กริยาต้องตรงกับสิ่งที่หน้านั้นแสดง** ถ้ากล่องในรูปคือขั้นตรวจ ให้ใช้ "ตรวจ" หรือ "ตัดสิน" ไม่ใช้ "ตัดสินใจ" ซึ่งให้ความรู้สึกว่าเป็นการเลือกทาง
- **ไม่ใช้ "คน" กับสิ่งที่ไม่ใช่คน**: "ระบบเป็นคนตัดสิน" → "ให้ระบบตัดสิน"
- **บรรทัดสรุปใต้รูปต้องบอกสิ่งที่รูปไม่ได้บอก** ถ้าเป็นแค่ลูกศรไล่ขั้นซ้ำกับรูป ให้ตัดทิ้ง หรือเปลี่ยนเป็นประโยคเดียวที่บอกว่าทำไมรูปนี้สำคัญ
- **ทดสอบ**: อ่านหัวให้คนนอกโปรเจกต์ฟังครั้งเดียว ถ้าเขาเล่าต่อด้วยคำของตัวเองไม่ได้ หรือต้องถามว่า "หมายถึงอะไร" ให้เขียนใหม่
- โครงหน้า: ปัญหา → วิธีแก้ → ผล · แต่ละส่วนอ่านจบในแวบเดียว
- สคริปต์พูดเขียนแบบที่พูดจริง อ่านออกเสียงได้ไม่สะดุด

## Diagram

- ป้ายในกล่องเป็นคำนามสั้น 1–4 คำ ที่คนเข้าใจ: "รับข้อมูลเข้า" ไม่ใช่ "Ingress Layer Handler"
- ป้ายบนลูกศรเป็นกริยา: "ส่งไฟล์" · "ตรวจสิทธิ์" · ลูกศรที่ไม่มีป้ายต้องเดาไม่ผิด
- คำในรูปต้องตรงกับคำในเอกสารทุกคำ
- ชื่อรูปเป็นข้อสรุป เหมือนหัวสไลด์ · ใต้รูปมี 1 ประโยคบอกว่าควรดูอะไร
- ถ้าโปรเจกต์มีแบบรูปประจำ (house style) ให้ใช้ตามนั้น ส่วนวิธีวาดดูใน skill รูปของ plugin นั้น

## ตัวอย่าง ก่อน → หลัง

เงื่อนไขเขียนเป็นประโยคเต็ม มีคำเชื่อม (ข้อ 2):

  - ก่อน: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - หลัง: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - ก่อน: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - หลัง: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`

| ก่อน | หลัง |
|---|---|
| ขอบระบบ (รับ input) → service (กฎธุรกิจ) → data | แยกโค้ด 3 ชั้น: รับข้อมูลเข้า → กฎธุรกิจ → เก็บข้อมูล |
| ตรวจ input ที่ขอบ · พังแบบปิด | ตรวจข้อมูลจากภายนอกทันทีที่เข้ามา ถ้าเกิดข้อผิดพลาดให้ปฏิเสธไว้ก่อน |
| เล็กพลาดหรือตรวจไม่ผ่าน → ขยับขึ้นหนึ่งระดับ | ถ้าโมเดลเล็กทำพลาด ให้ขยับขึ้น 1 ระดับ ไม่ลองซ้ำกับตัวเดิม |
| มีผลเหนือค่าเริ่มของ playbook แต่ไม่เหนือรายการ "รออนุมัติ" | ถ้าไฟล์นี้กับ playbook ขัดกัน ให้ทำตามไฟล์นี้ ยกเว้นเรื่องที่ต้องรออนุมัติ |
| เมื่อความต้องการมีการนำเข้าหรือส่งออกไฟล์ | เมื่องานต้องนำเข้าหรือส่งออกไฟล์ |
| ทุกข้อความผ่าน 8 ขั้น: AI ทำงานภาษา โค้ดตัดสินเรื่องสำคัญ | ทุกข้อความผ่าน 8 ขั้น: AI ช่วยเขียนคำตอบ ส่วนเรื่องสำคัญให้ระบบตัดสิน |
| Guard ขาเข้า (ในรูปที่ทำให้คนทั่วไปดู) | ตรวจขาเข้า |
| guard ขาเข้า → ค้นคลังความรู้ → แนบกฎร้าน → Typhoon → guard ขาออก (บรรทัดใต้รูปที่ซ้ำกับรูป) | AI มีหน้าที่เขียนให้อ่านง่าย ส่วนเรื่องเงิน เวลา และกฎร้าน ระบบตรวจทุกครั้ง |
| ทีมที่ดีไม่ได้เก่งเพราะแต่ละคนเก่ง แต่เพราะ… | วิธีทำงานของทีม: เลือกแผน → แจกงาน → ตรวจผล → จดบันทึก |
| คำค้น 12/12 จากประกาศงานอยู่ใน CV | คำค้นจากประกาศงานอยู่ใน CV ครบ 12 คำ · ตรวจแล้ว |
| margin 32–35% หลังทุกค่าธรรมเนียม | หักค่าธรรมเนียมแล้วเหลือกำไร 32–35% ของราคาขาย |
| hook จะทำงานเฉพาะโฟลเดอร์ที่มีการสร้างโฟลเดอร์ .claude/superuser ไว้แล้วเท่านั้น | hook (สคริปต์จด log) ทำงานเฉพาะโฟลเดอร์ที่มี `.claude/superuser/` |
| ตรวจด้วย validate ผ่าน ไม่มี error และ warning แต่ยังต้อง build ใหม่ | ตัวตรวจผ่านหมด · เหลือ build ใหม่บนเครื่องคุณ |
| `${CLAUDE_PLUGIN_ROOT}` คือ path ของ version ที่ติดตั้งอยู่ และจะเปลี่ยนเมื่อ plugin อัปเดต ส่วนโฟลเดอร์เก่าระบบจะลบทิ้งเองภายหลัง [ที่มา] | แต่ละ version ติดตั้งเป็นโฟลเดอร์ของตัวเอง พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่ แล้วลบโฟลเดอร์เก่าทิ้ง |
| ข้อยกเว้น: plugin จาก marketplace บน claude.ai … จะไม่ถูก pin ด้วยฟิลด์นี้ (แยกย่อหน้า) | … ไม่งั้นเครื่องที่ลงไว้จะใช้ชุดเก่าต่อ (ยกเว้น plugin จาก marketplace บน claude.ai ซึ่งเห็นการแก้ทันที) |

## ตัวอย่างประกอบกฎใน SKILL.md (ย้ายมาจาก SKILL.md)

| หัวข้อ | กฎ | ตัวอย่าง |
|---|---|---|
| 1 | คำธรรมดา (อังกฤษ) | buy ไม่ใช่ purchase |
| 2 | `→` ลำดับขั้น | เข้าใจ → วางแผน → ลงมือ |
| 2 | `·` คั่นคำนาม | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| 2 | `:` ตามด้วยรายละเอียด | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| 2 | ตัวเลขเขียนเป็นเลข | 3 ชั้น · 12 คำ · 1 ระดับ |
| 2 | ตัวเลขบอกความหมาย | "กำไร 32% ของราคาขาย" ไม่ใช่ "margin 32%" ลอย ๆ |
| 2 | เทียบให้เห็นภาพ | "เร็วขึ้น 3.2 เท่า" อ่านง่ายกว่า "ลดลง 69%" |
| 2 | ผลยังไม่แน่นอน | "รันรอบเดียว ยังสรุปไม่ได้" |
| 3 | คำที่คนพูดจริง | "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ" |
| 3 | ตัวย่อครั้งแรก | Large Language Model (LLM) |
| 3 | คำที่ตั้งเอง | "hook (สคริปต์จด log อัตโนมัติ)" |
| 3 | ตัดคำฟุ่มเฟือย | "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" |
| 3 | ออกตัวซ้อน | อาจจะ · น่าจะ · ในบางกรณี ในประโยคเดียว |
| 4 | ประโยคแรกตอบตรง | ถาม "ใส่ในรายงานดีไหม" → "ควรใส่ครับ" แล้วค่อยเหตุผล |
| 4 | บอกด้วยผล | "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ" |
| 4 | เหตุต่อผลในย่อหน้าเดียว | "แต่ละ version ติดตั้งแยกโฟลเดอร์ พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่แล้วลบของเก่า skill ที่ลบออกจึงหายไป" |
| 4 | ป้ายตัวหนา | **ระวัง:** · **สิ่งที่ยังอยู่:** ไม่ใช่ "**ระวัง (เจอบ่อย):**" |
| 5 | หัวข้อบอกเนื้อหา | "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" ดีกว่า "ผลการทดลอง" |
| 5 | หัวคอลัมน์ | "เรียก LLM" · "คำตอบไม่ผ่านกฎ" |
| 6 | วลีที่คนพูด | "AI ช่วยเขียนคำตอบ" ไม่ใช่ "AI ทำงานภาษา" |
| 6 | คำตามคนอ่าน | คนทั่วไป: "ระบบ" "ตรวจขาเข้า" แทน "โค้ด" "Guard" |
| 6 | ไม่ใช้ "คน" กับสิ่งที่ไม่ใช่คน | "ให้ระบบตัดสิน" |

ที่มา: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย


## reference: strict-review.md

# ตรวจเข้ม — สำหรับงานวิจัยและงานที่ส่งคนนอก

ค่าเริ่มต้นของ `human-writing` คือ **ตรวจปกติ**: ไล่ 7 ข้อในหัวข้อ 8 ของ SKILL.md รอบเดียวแล้วส่ง · ไฟล์นี้ใช้เฉพาะเมื่อสั่ง **ตรวจเข้ม**

**ผ่านกฎ ≠ อ่านลื่น** — รอบตรวจจับได้เฉพาะสิ่งที่มีกฎ (โครงประโยค · คำต้องเลี่ยง · ระดับภาษา) · งานที่ผ่านทุกกฎแต่ไม่มีน้ำเสียง เรียกว่า **อ่านแบน** ให้ติดป้ายไว้ ไม่รายงานว่าผ่าน · คำตัดสินว่าอ่านเป็นภาษาคนไหม เป็นของผู้ใช้ที่อ่านออกเสียง ไม่ใช่ของโมเดลที่ตรวจ (โมเดลที่ร่างกับโมเดลที่ตรวจมีจุดบอดเดียวกัน)

## เปิดเมื่อไหร่

- ผู้ใช้พูดว่า "ตรวจเข้ม" · "ตรวจแบบงานวิจัย" · "ขัดภาษาให้สุด" · "วนตรวจจนไม่เจอที่ผิด" · "strict"
- หรืองานเป็น วิทยานิพนธ์ · IS · บทความวิจัย · รายงานส่งอาจารย์หรือกรรมการ · หนังสือราชการ แล้วผู้ใช้ไม่ได้บอกว่าขอแบบเร็ว
- โครงเล่ม บทที่ การอ้างอิง ใช้ skill `thesis-writing` (plugin `personal-life`) คู่กัน · ไฟล์นี้ดูแลเรื่องภาษา

## ขั้นตอน

1. **เปิด [`thai-grammar`](thai-grammar.md) ทั้งไฟล์** และ [`thai-line-breaking`](thai-line-breaking.md) ถ้าส่งออกเป็นไฟล์
2. **เลือกระดับภาษา** ตามตารางหัวข้อ 4 · งานวิจัยใช้ระดับวิชาการ · บอกระดับที่เลือกไว้บรรทัดแรกของผลตรวจ
3. **อ่านทั้งชิ้นก่อน 1 รอบ** ยังไม่แก้ · งานเกิน 3,000 คำตรวจทีละบท บอกผู้ใช้ว่าแบ่งอย่างไร แล้วทำต่อเลยไม่ต้องหยุดถาม
4. **รอบตรวจ** — รัน `python scripts/thai_tells.py <ไฟล์>` ก่อน (จับคำต้องเลี่ยง · คำเชื่อมเกินงบ · จุดกลางย่อหน้า · ๆ ไม่เว้นวรรค ให้เครื่องทำ) แล้วอ่านเองหาสิ่งที่สคริปต์ไม่เห็น · จดทุกจุดเป็นตาราง ห้ามแก้ระหว่างจด

   | # | รหัสกฎ | ข้อความเดิม | แก้เป็น |
   |---|---|---|---|
   | 1 | `t-chueung` | …ซึ่งพัฒนาโดย… ซึ่งเปิดเป็น… | … |

   **เรียงตามน้ำหนัก ไม่ใช่ตามลำดับที่เจอ** — จุดที่ทำให้คนอ่านรู้ทันทีว่าเครื่องเขียนอยู่บนสุด: ประโยคเปิดสำเร็จรูป · สรุปซ้ำท้ายย่อหน้า · ชุดละ 3 ทุกที่ · คำโฆษณากว้าง ๆ · โครงประโยคซ้ำติดกัน · แล้วค่อยถึงเรื่องเล็ก (คำเชื่อมเกิน · วรรคตอน) · แก้ 5 ข้อบนก่อน มักทำให้ข้อล่างหายไปเองหลายข้อ · ชิ้นสั้นที่เจอแค่เรื่องเล็ก แก้รอบเดียวจบ ไม่ต้องวน
   **เทียบกับเสียงผู้เขียน** — ถ้ามีข้อความที่ผู้ใช้เขียนเอง (คู่ `ก่อน → หลัง` ใน `~/.claude/superuser-style.md` · อีเมลหรือบทที่ผู้ใช้เขียนก่อนหน้า) ให้อ่านเทียบ: ความยาวประโยค · สรรพนาม · คำท้าย · คำที่ผู้ใช้ไม่เคยใช้ · จุดที่ต่างจากเสียงผู้ใช้จดเป็นรหัส `v-voice` ในตาราง · ไม่มีตัวอย่าง → ตรวจตามกฎอย่างเดียวแล้วติดป้าย `อ่านแบน` ได้ตามปกติ (แนวคิดจาก humanizer ของ blader · MIT)
5. **รอบแก้** — แก้ตามตาราง แล้วอ่านใหม่ทั้งชิ้น (ไม่ดูแค่จุดที่แก้ เพราะแก้จุดหนึ่งมักทำให้รอยต่อข้าง ๆ สะดุด)
6. **วนข้อ 4–5** จนรอบตรวจไม่เจออะไร · **สูงสุด 5 รอบ** · ครบ 5 รอบแล้วยังเหลือ ให้รายงานจุดที่เหลือพร้อมเหตุผลที่ยังไม่แก้
7. ถ้าทำงานใต้ `superuser` ให้รอบตรวจแต่ละรอบเป็น `reviewer` คนใหม่ (โมเดลเล็ก · effort ต่ำ) ส่วนหัวหน้าเป็นคนแก้ · `reviewer` รายงานได้แค่รหัสกฎที่เจอ ไม่ตัดสินว่าอ่านลื่น · รอบแก้ส่งกฎทั้งชุดให้ไม่ใช่แค่ข้อที่ถูกชี้ (ส่งแค่ข้อที่ชี้ ตัวแก้จะแก้วน)

## สิ่งที่ตรวจเพิ่มในงานวิจัย

| รหัส | ตรวจ |
|---|---|
| `a-register` | ระดับวิชาการทั้งชิ้น · ไม่มีครับ/ค่ะ · ไม่มี ผม/ฉัน (ใช้ `ผู้วิจัย` หรือละ) · คำฝั่งทางการทุกคู่ในตาราง `r-drift` · `สามารถ…ได้` ครบ |
| `a-term` | ศัพท์เทคนิคใช้คำเดียวทั้งเล่ม · ครั้งแรกเขียน `ไทย (English)` แล้วใช้ไทยต่อ · ตัวย่อเต็มครั้งแรกทุกบท · ตรงกับศัพท์บัญญัติราชบัณฑิตยสภาถ้ามี |
| `a-claim` | ข้อความที่อ้างข้อเท็จจริงมีการอ้างอิงทุกจุด · ไม่อ้างแหล่งที่ไม่ได้เปิดอ่าน · ความเห็นผู้วิจัยแยกจากข้อเท็จจริงชัด |
| `a-hedge` | ออกตัวเท่าที่ข้อมูลรองรับ: ผลจากกลุ่มตัวอย่างเล็กพูดว่า `ในกลุ่มตัวอย่างนี้` · ไม่ออกตัวซ้อน · ไม่ยืนยันเกินผล |
| `a-number` | ตัวเลขมีหน่วย · ทศนิยมเท่ากันทั้งตาราง · ตัวเลขในเนื้อตรงกับตาราง · ร้อยละบอกฐาน |
| `a-ref` | ตาราง รูป สมการ มีเลขและถูกอ้างในเนื้อก่อนปรากฏ · ชื่อรูปและตารางเป็นข้อสรุป |
| `a-cite` | รูปแบบอ้างอิงแบบเดียวทั้งเล่ม (APA 7 หรือตามคณะ) · รายการท้ายเล่มครบตามที่อ้างในเนื้อ |
| `a-tense` | บทวิธีวิจัยและผลเล่าเป็นสิ่งที่ทำแล้ว · ไม่สลับ `จะ` กับ `ได้` ในบทเดียวกัน |
| `a-break` | ส่งออกแล้วรัน `scripts/thai_linebreak.py --check` และเปิด PDF ดูทุกหน้า |

## ผลที่ส่งให้ผู้ใช้

- บรรทัดแรก: ระดับภาษาที่ใช้ · จำนวนรอบ · `ผ่านกฎ` หรือ `เหลือ N จุด` · ถ้าอ่านแบนให้บอก `ผ่านกฎ · อ่านแบน` พร้อมย่อหน้าที่ควรอ่านออกเสียงดู
- ตารางจุดที่แก้ รวมทุกรอบ (รหัสกฎ · เดิม · ใหม่) — ใช้ตอบกรรมการได้ว่าแก้อะไรเพราะอะไร
- จุดที่ไม่แก้และเหตุผล (เช่น ถ้อยคำตามแบบของคณะ · คำพูดที่ยกมา)
- ไฟล์ที่แก้แล้ว เขียนทับไฟล์เดิม ต้นฉบับเก็บใน `_to_delete/`

ที่มาของวิธีวนตรวจ: skill `kode-thai` ใน [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT) · ปรับให้มีเพดานรอบ และใช้เฉพาะเมื่อสั่ง เพราะฉบับเต็มกิน token หลายหมื่นต่อรอบ


## reference: thai-examples.md

# ตัวอย่างย่อหน้าภาษาไทย ก่อน → หลัง (ทีละระดับภาษา)

เปิดก่อนเขียนย่อหน้าไทยยาว ดูคู่ของระดับภาษาที่จะใช้ · คู่ตัวอย่างสอนได้ดีกว่ากฎ เพราะเห็นทั้งโครงประโยคและน้ำเสียงพร้อมกัน · รหัสกฎอยู่ใน [`thai-grammar`](thai-grammar.md)

**กติกาของไฟล์นี้** — 1 คู่ = ย่อหน้าเดียว · "หลัง" ต้องเป็นข้อความที่เจ้าของงานเขียนหรือแก้เอง ข้อความที่ทีมเขียนติดป้าย `(ชั่วคราว)` จนเจ้าของอ่านแล้วรับ · ไม่เกิน 10 คู่ต่อระดับ · กฎใหม่ดูดซับคู่ไหนแล้วลบคู่นั้น · ทุกคู่บอกที่มาและวันที่

## ระดับ อธิบาย — README และเอกสารเทคนิค

**ก่อน**

> ในยุคปัจจุบันที่ข้อมูลมีความสำคัญอย่างมาก ระบบนี้ถูกออกแบบมาเพื่อทำการประมวลผลข้อมูลจากหลายแหล่ง ซึ่งจะช่วยให้ผู้ใช้สามารถเข้าถึงข้อมูลได้อย่างมีประสิทธิภาพ โดยระบบจะทำการดึงข้อมูลทุก 5 นาที ดังนั้นผู้ใช้จึงไม่ต้องกังวลเรื่องข้อมูลไม่อัปเดต

**หลัง**

> ระบบนี้รวมข้อมูลจาก 3 แหล่ง (ERP · ไฟล์ Excel ของฝ่ายขาย · API ของขนส่ง) ไว้ที่เดียว ข้อมูลพวกนี้ระบบจะดึงใหม่ทุก 5 นาที เปิดหน้า dashboard เมื่อไหร่ก็เห็นตัวเลขของ 5 นาทีก่อน ถ้าแหล่งไหนล่ม แถวของแหล่งนั้นจะขึ้นเวลาที่ดึงได้ครั้งสุดท้ายแทน

กฎที่ใช้: `t-block` (ในยุคปัจจุบัน) · `t-padding` (ทำการ ×2 · มีความสำคัญ) · `t-thuk` · `t-chueung` · `t-budget` (ซึ่ง โดย ดังนั้น ในย่อหน้าเดียว) · `t-reassure` · `f1` ยกข้อมูลขึ้นก่อน · `f2` เงื่อนไขมาก่อน · "หลายแหล่ง" → 3 แหล่งที่บอกชื่อ · ที่มา: ทีมเขียน 2026-10-22 · เจ้าของอ่านแล้วรับ 2026-10-29

## ระดับ ธุรกิจ — ข้อเสนอถึงลูกค้า

**ก่อน**

> เรามีความยินดีที่จะนำเสนอโซลูชันที่จะช่วยยกระดับการทำงานของท่าน ไม่ว่าจะเป็นการจัดการเอกสาร การอนุมัติ หรือการรายงาน ซึ่งทั้งหมดนี้จะถูกรวมไว้ในแพลตฟอร์มเดียว โดยทีมงานของเราจะทำการติดตั้งและฝึกอบรมให้อย่างครบถ้วน

**หลัง**

> บริษัทฯ เสนอระบบจัดการเอกสาร (Document Management System: DMS) ที่รวมงาน 3 อย่างของฝ่ายจัดซื้อไว้ในหน้าเดียว คือยื่นเอกสาร อนุมัติ และออกรายงาน ติดตั้งและอบรมผู้ใช้ 20 คนให้เสร็จภายใน 15 วันทำการ นับจากวันลงนามในสัญญา ค่าใช้จ่ายและเงื่อนไขอยู่ในหัวข้อ 4

กฎที่ใช้: ระดับ ธุรกิจ (`เรา` `ท่าน` → `บริษัทฯ` และชื่อฝ่าย) · คำโฆษณากว้าง (ยกระดับ · โซลูชัน) → สิ่งที่ทำจริง · `t-mai-wa` · `t-thuk` · `t-padding` · `t-doi` · ศัพท์หลักครั้งแรก `ไทย (English: ตัวย่อ)` · ตัวเลขแทน "อย่างครบถ้วน" · ที่มา: ทีมเขียน 2026-10-22 · เจ้าของอ่านแล้วรับ 2026-10-29

## ระดับ ราชการ — มติในรายงานการประชุม

**ก่อน**

> ที่ประชุมได้มีการพิจารณาเรื่องการจัดซื้อเครื่องคอมพิวเตอร์ ซึ่งฝ่ายไอทีได้ทำการเสนอราคามาแล้ว โดยที่ประชุมเห็นว่ามีความเหมาะสม ดังนั้นจึงมีมติให้ทำการจัดซื้อต่อไป ทั้งนี้ให้ฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จโดยเร็ว

**หลัง**

> ฝ่ายเทคโนโลยีสารสนเทศเสนอจัดซื้อเครื่องคอมพิวเตอร์ 12 เครื่อง วงเงิน 420,000 บาท ตามใบเสนอราคาเลขที่ QT-2569-031 ที่ประชุมพิจารณาแล้วเห็นว่าราคาอยู่ในงบประมาณที่ได้รับอนุมัติ มติที่ประชุม อนุมัติให้จัดซื้อตามที่เสนอ และมอบฝ่ายจัดซื้อดำเนินการให้แล้วเสร็จภายใน 30 วัน นับจากวันที่รับรองรายงานการประชุมฉบับนี้

กฎที่ใช้: `t-padding` (ได้มีการ · ทำการ ×2 · มีความเหมาะสม) · `t-chueung` · `t-doi` · `t-budget` (ดังนั้น · ทั้งนี้) · ระดับราชการเพิ่ม: เรียกฝ่ายตามชื่อจริง · ตัวเลขและเลขที่เอกสาร · `ดำเนินการ` คงไว้เพราะเป็นคำตามแบบ · กำหนดเวลา `ภายใน X วัน นับจาก…` แทน "โดยเร็ว" · ที่มา: ทีมเขียน 2026-10-22 · เจ้าของอ่านแล้วรับ 2026-10-29

## ระดับ ข่าว — release note

**ก่อน**

> ในเวอร์ชันนี้ เราได้ทำการปรับปรุงประสิทธิภาพในส่วนของการส่งออกรายงาน ซึ่งจะทำให้ผู้ใช้ได้รับประสบการณ์ที่ดียิ่งขึ้น นอกจากนี้ยังมีการแก้ไขข้อผิดพลาดต่าง ๆ อีกมากมาย

**หลัง**

> ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จากเดิม 12 วินาที เพราะเปลี่ยนมาเขียนไฟล์ทีละก้อนแทนสร้างทั้งไฟล์ในหน่วยความจำ แก้บั๊กวันที่ใน Excel แสดงเป็น ค.ศ. ทั้งที่ตั้งค่าเป็น พ.ศ. (ฝ่ายบัญชีแจ้งเมื่อ 2 ต.ค.) เวอร์ชัน 2.4.0 · 22 ต.ค. 2569

กฎที่ใช้: ระดับ ข่าว (ไม่มี `เรา` · ประโยคแรก ใคร ทำอะไร กับอะไร · ปิดด้วยเวอร์ชันและวันที่) · `t-padding` · `t-block` (ในส่วนของ) · `t-chueung` · `f7` (นอกจากนี้) · "ต่าง ๆ อีกมากมาย" → บอกว่าแก้อะไร · ที่มา: ทีมเขียน 2026-10-22 · เจ้าของอ่านแล้วรับ 2026-10-29

## ระดับ แชตร้าน — ตอบลูกค้าเรื่องพัสดุช้า

**ก่อน**

> สวัสดีค่ะ ทางร้านต้องขออภัยในความไม่สะดวกเป็นอย่างสูงนะคะ ทางร้านได้ทำการตรวจสอบแล้วพบว่าพัสดุของลูกค้าอยู่ระหว่างการจัดส่ง ทางร้านจะทำการติดตามให้อย่างใกล้ชิด ไม่ต้องกังวลนะคะ

**หลัง**

> ขอโทษด้วยนะคะที่ของยังไม่ถึง ร้านเช็กกับ Flash แล้ว พัสดุเลข TH1234 ออกจากศูนย์คัดแยกลาดกระบังเมื่อเช้านี้ ปกติถึงบ้านภายใน 1–2 วันค่ะ ถ้าพรุ่งนี้เย็นยังไม่ได้รับ ทักมาได้เลย ร้านจะเปิดเรื่องตามกับขนส่งให้ทันทีค่ะ

กฎที่ใช้: ระดับ แชตร้าน (`ทางร้าน` ×3 → `ร้าน` ครั้งเดียวต่อประโยค · ค่ะ ทุกข้อความ · คำขอโทษคงไว้ เพราะคำสุภาพไม่ใช่คำฟุ่มเฟือย) · `t-padding` (ทำการ ×2) · `t-reassure` → ขั้นถัดไปที่ลูกค้าทำได้ · "อย่างใกล้ชิด" "อย่างสูง" → ข้อเท็จจริง (เลขพัสดุ · ศูนย์คัดแยก · เวลา) · ที่มา: ทีมเขียน 2026-10-22 · เจ้าของอ่านแล้วรับ 2026-10-29

---

ระดับที่ยังไม่มีคู่: การตลาด · ส่วนตัว · วิชาการ · ร้องเรียน · สมัครงาน · หน้าจอ — เพิ่มจากคำแก้ของเจ้าของงานตามกติกาข้างบน (`thai-grammar` หัวข้อ 8) · คู่ที่ทีมเขียนทั้ง 5 ข้างบนรอเจ้าของอ่านออกเสียงแล้วรับหรือแก้


## reference: thai-grammar.md

# ภาษาไทยให้ลื่น — กรอบเรียบเรียง 7 ข้อ · คำต้องเลี่ยง · ระดับภาษา

เปิดไฟล์นี้เมื่อเขียนหรือแก้ภาษาไทยตั้งแต่ 1 ย่อหน้าขึ้นไป หรือเมื่อสั่งตรวจเข้ม (ดู [`strict-review`](strict-review.md)) · ข้อความแชตสั้น ป้าย ปุ่ม ชื่อตัวแปร ไม่ต้องเปิด

ภาษาไทยที่ AI เขียนติดโครงประโยคอังกฤษมา ประโยคเลยยาว ต่อกันด้วย "ซึ่ง" "โดย" และเปิดเรื่องแบบเดียวกันทุกครั้ง การไล่ลบคำต้องห้ามแก้ได้แค่ปลายเหตุ ต้นเหตุอยู่ที่โครงประโยค 7 ข้อข้างล่าง พอโครงถูก กฎย่อยส่วนใหญ่ก็ผ่านเอง

ทุกกฎมีรหัส (`f1` · `t-chueung`) ไว้อ้างตอนตรวจ

**สารบัญ**

- [1 · กรอบเรียบเรียง 7 ข้อ](#1--กรอบเรียบเรียง-7-ข้อ)
- [2 · ท่าที่ AI ชอบใช้ (เจอแล้วแก้)](#2--ท่าที่-ai-ชอบใช้-เจอแล้วแก้)
- [3 · ไวยากรณ์ที่ AI พลาดบ่อย](#3--ไวยากรณ์ที่-ai-พลาดบ่อย)
- [4 · ระดับภาษา](#4--ระดับภาษา)
- [5 · ทับศัพท์ — เลือก 1 แบบต่อคำ แล้วใช้แบบเดียวทั้งชิ้น](#5--ทับศัพท์--เลือก-1-แบบต่อคำ-แล้วใช้แบบเดียวทั้งชิ้น)
- [6 · ปิดเรื่อง](#6--ปิดเรื่อง)
- [7 · แปลอังกฤษเป็นไทย](#7--แปลอังกฤษเป็นไทย)
- [8 · วินัยเพิ่มกฎ และไฟล์ประกอบ](#8--วินัยเพิ่มกฎ-และไฟล์ประกอบ)

## 1 · กรอบเรียบเรียง 7 ข้อ

| รหัส | กรอบ | ก่อน (แปลตรง) | หลัง (ไทย) |
|---|---|---|---|
| `f1` | **ยกเรื่องที่พูดถึงขึ้นก่อน** ไม่ลากประธานยาว ๆ แบบอังกฤษ · เลิกใช้ `การที่…นั้น…` `การที่ X ทำให้ Y` | ระบบประมวลผลข้อมูลพวกนี้ทุก 5 นาที | ข้อมูลพวกนี้ ระบบจะ process ทุก 5 นาที |
| `f2` | **เงื่อนไขและเวลามาก่อน** ไม่ห้อยท้ายด้วย "เมื่อ…" | DB จะเริ่ม timeout เมื่อ traffic พุ่งสูง | พอ traffic พุ่ง DB ก็เริ่ม timeout |
| `f3` | **ขึ้นประโยคใหม่ด้วยเว้นวรรคและย่อหน้า** ไม่ใส่จุดทุกประโยค · จุดใช้ท้ายย่อหน้า หรือคั่นประโยคยาว 2 ประโยคที่คนละเรื่องกัน | เร็วขึ้น. ใช้ memory น้อยลง. ทีมพอใจ. | เร็วขึ้น ใช้ memory น้อยลง ทีมพอใจ |
| `f4` | **ปิดความด้วยคำท้าย** `ด้วย` `แล้ว` `เลย` `อยู่` `อยู่ดี` `ต่างหาก` · ประโยค "ไม่ได้…อย่างเดียว" "ไม่ใช่แค่…" ต้องปิดด้วย `ด้วย` · ประโยค "ไม่ได้อยู่ที่ X อยู่ที่ Y" ต้องปิดด้วย `ต่างหาก` | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุน | ปัญหาไม่ได้อยู่ที่ยอดขาย อยู่ที่ต้นทุนต่างหาก |
| `f5` | **ละประธานที่รู้แล้ว ใช้คำชี้แทนสรรพนาม** (`ตัวนี้` `เคสนั้น` `ตรงนี้แหละที่…`) · ไม่ใช้ `มัน` `เขา` `พวกเขา` แทน it/they · ระวังละจนไม่รู้ว่าใครทำ | มันลด memory และมันยังปรับปรุงการทดสอบ | ทั้งลด memory และยังปรับปรุงการทดสอบอีกด้วย |
| `f6` | **ใช้ "ก็" คุมจังหวะ** `พอ X ก็ Y` · `ถ้า X ก็ Y` · `X แล้วก็ Y` · ลำดับการกระทำเชื่อมด้วย `แล้ว` | ถ่ายรูปบิล ระบบอ่านรายการให้เอง | ถ่ายรูปบิลแล้วระบบจะอ่านรายการให้เอง |
| `f7` | **เปลี่ยนเรื่องด้วยคำถาม คำชี้ หรือ "แต่"** แทน `อย่างไรก็ตาม` `นอกจากนี้` (ตัดได้ราวครึ่งหนึ่ง) · หลังไล่ปัญหา 2–3 ข้อ ต้องมีจุดเปลี่ยนก่อนเข้าวิธีแก้ | อย่างไรก็ตาม การใช้งานจริงมีข้อจำกัด | แต่พอขึ้น production จริง ก็มีเรื่องให้ปวดหัวอีก |

**"ก็" ไม่ได้ใส่ได้ทุกที่ (`f6-scope`)** — ประโยค `…ทีไร` ไม่ต้องมี ก็ (`ลองทีไร พังทุกที`) · ประโยค `ไม่ว่าจะ…เมื่อไหร่` ต้องมี `ก็จะ` · ผลที่เป็นนิยามของเหตุ (ต้นทุน = ราคาวัตถุดิบ) ไม่ใส่ ก็ (`วัตถุดิบขึ้นเมื่อไหร่ ต้นทุนต่อจานขึ้นตามทันที`)

## 2 · ท่าที่ AI ชอบใช้ (เจอแล้วแก้)

| รหัส | ท่า | แก้เป็น |
|---|---|---|
| `t-chueung` | "ซึ่ง" ต่อกันหลายชั้น | ไม่เกิน 1 ซึ่งต่อประโยค · คำนามชัดใช้ "ที่" · หรือแยกประโยค |
| `t-budget` | คำเชื่อมทางการถี่ | ต่อย่อหน้า: ซึ่ง ≤ 1 · โดย ≤ 1 · ดังนั้น ≤ 1 · `ทั้งนี้` ไม่ใช้เปิดย่อหน้า (ใช้ได้ใกล้ข้อสงวนสิทธิ์หรือคำชวนทำ) · งบนี้**ไม่นับ**คำท้าย `ด้วย` `แล้ว` `เลย` `อยู่` และ `เพื่อ…เพื่อ` ในหนังสือราชการ · คำท้ายอ่านแปลกให้เรียบเรียงประโยคใหม่ ไม่ลบคำ · บทความอธิบายเรียงคำเชื่อม ดังนั้น → นอกจากนี้ (นาน ๆ ครั้ง) → แต่ |
| `t-doi` | `โดยที่… โดยการ… โดยมี…` | ใช้ ผ่าน · จาก · ด้วย หรือไม่ต้องมีคำเชื่อม |
| `t-khanathi` | `ในขณะที่` ใช้แปลว่า "ส่วน/แต่" | `A เชื่อ X แต่ B เชื่อ Y` · `ส่วน B กลับเชื่อ Y` (ในขณะที่ = ช่วงเวลาเดียวกัน) |
| `t-thuk` | ถูก- ทุกประโยค (passive แปลตรง) | ถูก/โดน ใช้กับเรื่องไม่ดีหรือไม่รู้ผู้ทำ · ที่เหลือเขียนว่าใครทำ |
| `t-padding` | ทำการ · มีการ · ได้มีการ · มีความ + คุณศัพท์ · ที่มีความ | ใช้กริยาตรง ๆ: `ซับซ้อน` ไม่ใช่ `มีความซับซ้อน` · ยกเว้น `เป็นความ + กริยา` (`เป็นความตั้งใจ`) ต้องคงไว้ |
| `t-khong` | ของ…ของ…ของ | ประกบคำนามตรง ๆ: `การพัฒนาเศรษฐกิจไทย` |
| `t-nueng-nai` | หนึ่งในที่สุด | `…ที่สุดคนหนึ่ง` |
| `t-mai-wa` | ไม่ว่าจะเป็น A, B หรือ C (แค่ไล่รายการ) | `A B หรือ C` · `ทั้ง A B และ C` |
| `t-hedge` | ออกตัวซ้อน `อาจจะมีความเป็นไปได้ที่จะ` | `อาจ` ครั้งเดียว ตรงที่ไม่แน่ใจจริง |
| `t-pronoun` | เรา…เรา…เรา / ท่าน | ละหลังประโยคแรก · ผู้อ่านใช้ `คุณ` ไม่ใช้ `ท่าน` (ยกเว้นหนังสือราชการ) |
| `t-mun` | `มันเป็นที่ชัดเจนว่า` | `ชัดเจนว่า` |
| `t-comma` | ลูกน้ำคั่นคำขยาย `แฮรารี, นักประวัติศาสตร์, แย้งว่า` | เว้นวรรค |
| `t-dash` | ขีดยาว — และ ; | เว้นวรรค ขึ้นย่อหน้า หรือ ที่/ซึ่ง |
| `t-particle` | ครับ/ค่ะ ในเนื้อเอกสาร | มีได้ในแชต คำพูดที่ยกมา และบล็อกส่วนตัว (เปิด ปิด และตอนพูดกับคนอ่านตรง ๆ เช่น `มาดูกันครับ`) เท่านั้น |
| `t-overcut` | ตัดคำจนห้วน: `อยากช่วย` `ใช้ template` `ส่งมา` | ภาษาไทยไม่ได้ "จ่ายค่าเช่า" ให้ทุกคำแบบอังกฤษ `จะ` `ให้` `ก็` `ด้วย` `แล้ว` `ต่างหาก` และคำสุภาพ `ขอ` `รบกวน` `นะ` ทำหน้าที่จริง: `อยากจะช่วย` · `ให้ใช้ template` · `รบกวนส่งมาด้วยนะครับ` · กฎ "ตัดคำ" ของ skill อื่นใช้กับคำฟุ่มเฟือย (`t-padding`) เท่านั้น |
| `t-reassure` | ปลอบลอย ๆ `ไม่ต้องกังวล` `สบายใจได้` | จบที่ข้อเท็จจริงและขั้นถัดไป: `แอดมินจะแจ้งผลภายในพรุ่งนี้ค่ะ` |
| `t-force` | `ระบบบังคับให้…` `ระบบไม่อนุญาตให้…` | เล่าเป็นความสามารถหรือลำดับ: `ต้องยืนยันอีเมลก่อน ถึงจะเข้าใช้ได้` (`ถึงจะ` ใช้กับลำดับ · `ก็ต่อเมื่อ` ใช้กับเงื่อนไขเดียว) |
| `t-samrap` | `สำหรับผมแล้ว ผมคิดว่า` · `สำหรับ…นั้น` เปิดประโยค | `ผมว่า…` · ยกเรื่องขึ้นก่อนตาม `f1` |
| `t-topology` | เล่าโครงแทนเล่าเคส `มีเส้นทางเชื่อมระหว่าง A กับ B` | เล่าว่าใครทำอะไรแล้วเกิดอะไร: `ลูกค้ากดสั่ง ร้านเห็นรายการทันที` |
| `t-considered` | `ถูกพิจารณาว่าเป็น` `ถูกมองว่า` (is considered) | `ถือว่าเป็น` · `คนมองว่า` · หรือบอกว่าใครเป็นคนมอง |

**คำและวลีต้องเลี่ยง (`t-block`)** — เจอแล้วแก้ทันที ยกเว้นอยู่ใน `` ` `` หรือในเครื่องหมายคำพูด (ยกมาพูดถึง):

`ในยุคปัจจุบัน` · `ในโลกปัจจุบัน` · `ในโลกที่…` · `เป็นที่ทราบกันดีว่า` · `เป็นที่รู้กันว่า` · `ปฏิเสธไม่ได้ว่า` · `เป็นสิ่งสำคัญที่ต้องตระหนัก` · `มีความสำคัญ` (ใช้ `สำคัญ`) · `การที่…นั้น` · `ในเรื่องของ` · `ในส่วนของ` · `อย่างมหาศาล` · `อย่างน่าทึ่ง` · `อย่างไม่น่าเชื่อ` · `ทุกสิ่งที่คุณต้องรู้เกี่ยวกับ` · `โดยสรุปแล้ว` · `กล่าวโดยสรุป` · `นั่นเอง!` · `รีบ…เลย!`

คำโฆษณาที่ยอมได้เมื่อมีตัวเลขประกบ: `อย่างมาก` · `อย่างมีประสิทธิภาพ` (เฉพาะเอกสารธุรกิจ) · `!` ตัวเดียวที่ hook หรือคำชวนทำในหน้าขายของ ที่อื่นไม่ใช้

## 3 · ไวยากรณ์ที่ AI พลาดบ่อย

| รหัส | เรื่อง | ตัวอย่าง |
|---|---|---|
| `g-classifier` | ลักษณนามผิดหรือหาย | server 1 `เครื่อง` · function/parameter 1 `ตัว` · token/record 1 `อัน` · บรรทัด · หน้า · รายการ — ไม่แน่ใจให้เลี่ยงการนับ · ระดับทางการต้องใช้ลักษณนามตรงตัว (ถัง · ฉบับ · ราย) ระดับไม่ทางการใช้ `อัน` `ตัว` ได้ |
| `g-cha` | ขาด `จะ` ในประโยคอนาคตหรือสมมุติ | `จะเลือกตัวไหนขึ้นอยู่กับ…` · `วิธีนี้จะคุม rate ได้` |
| `g-function` | คำเชื่อมสั้นผิดหน้าที่ | `จะ` ≠ `จน` · ภาษาไม่ทางการใช้ `เวลา` `ตอนที่` แทน `เมื่อ` · `เหมาะกับ` ต้องมี กับ |
| `g-verb` | กริยาแปลตรง | burst ≠ `ระเบิด` (ใช้ `ยิง`) · drop ≠ `ทิ้ง` (ใช้ `ปฏิเสธ`) · match ≠ `ซ้ำ` (ใช้ `ตรง`) · cap ≠ `ครอบ` (ใช้ `จำกัดไว้ที่`) · throttle ≠ `บีบคอ` (ใช้ `ชะลอ` `หน่วง`) · กริยาที่เป็นภาพทางกายภาพในอังกฤษ มักต้องใช้กริยาไทยคนละตัว |
| `g-capability` | สามารถ…ได้ | งานวิชาการ ราชการ ข่าว ใช้ครบ `สามารถ + กริยา + ได้` · งานทั่วไปใช้ `กริยา + ได้` |
| `g-time` | ช่วงเวลาใช้ ของ | `ในศตวรรษที่ 20` ไม่ใช่ `ของศตวรรษที่ 20` |
| `g-tirai` | `ทีไร` ต้องปิดด้วย `ทุกที` หรือ `ไม่เคย…สักที` | `ฝนตกทีไร น้ำท่วมทุกที` · `ทุกครั้ง` อ่อนกว่าและหลุดสำนวน · `ทีไร…เสมอ` ก้ำกึ่ง เลี่ยง |
| `g-quant` | ตัวเลขคู่กับกริยาความรู้สึก | `ตัวเลขไม่ตรงกับที่คาด` ไม่ใช่ `ที่รู้สึก` |
| `g-yamok` | ไม้ยมกติดคำ `ต่างๆ` `บ่อยๆ` | เว้นวรรคหน้าและหลัง `ต่าง ๆ` `บ่อย ๆ` ทั้งชิ้น · ที่มา: หลักเกณฑ์การเว้นวรรค ข้อ ๑.๒.๑๕.๑ "เว้นวรรคเล็กหน้าและหลังเครื่องหมายไปยาลใหญ่ ไม้ยมก …" ตัวอย่าง `วันหนึ่ง ๆ เขาทำอะไรบ้าง` · สำนักงานราชบัณฑิตยสภา https://www.orst.go.th/iwfm_table.asp?a=36 (ตรวจ 2026-10-26 · royin.go.th เปิดไม่ได้จากเครื่องนี้ เว็บเดียวกันย้ายมาอยู่ที่ orst.go.th) |

## 4 · ระดับภาษา

เลือกระดับก่อนเขียน แล้วคงไว้ทั้งชิ้น (`r-drift`) · เปลี่ยนได้ที่หัวข้อใหม่เท่านั้น

| งาน | ระดับ | คำท้าย ครับ/ค่ะ | ผู้พูด/ผู้อ่าน |
|---|---|---|---|
| เอกสารเทคนิค · README · คู่มือ · บทความอธิบาย | อธิบาย | ไม่มี | `เรา` / `คุณ` |
| หน้าขายของ · landing page | การตลาด | ไม่มี | `คุณ` เท่านั้นในเนื้อ (ไม่ใช้ `เจ้าของร้าน` `ผู้ใช้` แทนคุณ) |
| บล็อกส่วนตัว · เล่าประสบการณ์ · ประกาศในทีม | ส่วนตัว | เปิด ปิด และตอนพูดกับคนอ่านตรง ๆ | `ผม` / `ดิฉัน` ตามผู้เขียน (ไม่รู้ ใช้ค่าตั้งต้นของเจ้าของใน `~/.claude/superuser-style.md` แล้วจดลง ตัดสินใจเอง) |
| ข่าว · release note · ประกาศ · CHANGELOG | ข่าว | ไม่มี | ไม่มีบุรุษที่ 1 · ประโยคแรก ใคร ทำอะไร กับอะไร · ที่มาอยู่ประโยคที่ 2 · ปิดด้วยเวอร์ชัน วันที่ หรือแหล่ง · `ดังนั้น` เฉพาะเมื่อมีเหตุจริง |
| วิทยานิพนธ์ · IS · บทความวิจัย · บทวิเคราะห์ยาว | วิชาการ | ไม่มี | `ผู้วิจัย` หรือละ · `เรา` เฉพาะประสบการณ์ร่วม |
| หนังสือราชการ · รายงานการประชุม · นโยบาย | ราชการ | ไม่มี | ไม่มีบุรุษที่ 1 · ใช้ถ้อยคำตามแบบ (ตารางคำข้างล่าง) |
| หนังสือบริษัทถึงลูกค้า · ข้อเสนอ · BRD FSD SRS · company profile | ธุรกิจ | ไม่มี | `บริษัทฯ` หรือชื่อทีม ไม่ใช้ `เรา` · `คุณ` เฉพาะในขั้นตอนสั่งให้ทำ · ศัพท์หลักครั้งแรก `ไทย (English: ตัวย่อ)` |
| แชตลูกค้า · ไลฟ์ · ตอบรีวิว · broadcast | แชตร้าน | ทุกข้อความ (ค่ะ หรือ ครับ แบบเดียวทั้งร้าน) | ร้านเรียกตัวเองว่า `ร้าน` หรือ `แอดมิน` ครั้งเดียวต่อข้อความ · ลูกค้า `คุณลูกค้า` หรือละ · จบที่ข้อเท็จจริงและขั้นถัดไป ไม่ปลอบลอย ๆ (`t-reassure`) |
| จดหมายร้องเรียน · ขอคืนเงิน · ยกเลิกสัญญา | ร้องเรียน | ไม่มี | `ข้าพเจ้า` · ผู้รับ `ท่าน` หรือชื่อบริษัท · ข้อเท็จจริง วันที่ จำนวนเงิน ก่อนข้อเรียกร้อง · กำหนดเวลา `ภายใน X วัน นับจากวันที่ได้รับหนังสือฉบับนี้` · ไม่ขู่ ไม่ขอโทษ |
| CV · จดหมายสมัครงาน · ต่อรองเงินเดือน · LinkedIn | สมัครงาน | ไม่มีใน CV · มีในจดหมายและข้อความถึง HR | `ผม` / `ดิฉัน` · bullet ใน CV ขึ้นต้นด้วยกริยาและปิดด้วยตัวเลข (`ลดเวลาปิดงบจาก 8 วันเหลือ 5 วัน`) · ไม่มี `ซึ่งทำให้` |
| ข้อความบนหน้าจอ · ปุ่ม · error · แจ้งเตือน · placeholder | หน้าจอ | ไม่มี | `คุณ` หรือละ · ปุ่มขึ้นต้นด้วยกริยา (`บันทึก` `ส่งคำขอ`) · error = เกิดอะไร + ทำอะไรต่อ ใน 1–2 ประโยค · ไม่ซ้อน `กรุณา` `ท่าน` `ครับ/ค่ะ` · 1 คำต่อ 1 การกระทำทั้งแอป เก็บใน glossary |

**บุรุษและผู้อ่านไม่สลับในย่อหน้าเดียว (`r-deixis`)** — สอนใช้ `เรา` แนะนำใช้ `คุณ` ไม่ปนกันในย่อหน้า · ในข้อความที่พูดกับคนอ่านอยู่ ไม่โผล่ `ใคร` `คน` `ผู้ใช้` แทนเขา: `ขาดทุน แต่ไม่มีใครรู้` → `ขาดทุนโดยไม่รู้ตัว`

**ระดับราชการเพิ่ม** (ชั่วคราว · จากตัวอย่างชุดเดียว รอหนังสือจริงยืนยัน) — ประโยคขั้นตอน = ผู้ทำ + วิธี + สิ่งที่ทำ + ปลายทาง · เรียกเอกสารตามชื่อจริง ไม่ย่อแบบโน้ต (`15/30/45`) · คำสลับ: เซ็น → `ลงนาม` · ทำ → `ดำเนินการ` · เช็ค → `ตรวจสอบ` · ส่งให้ → `ส่งมาเพื่อ…` · คำถามค้าง → `ประเด็นที่ยังต้องการคำชี้แจง` · ระเบียบงานสารบรรณที่ใช้อยู่คือ ฉบับที่ 4 พ.ศ. 2564 (ตรวจ 2026-10-22 ไม่พบฉบับที่ 5)

**ระดับการตลาดเพิ่ม** — `!` ตัวเดียวที่ hook หรือคำชวนทำ · `…` ที่จังหวะพักแบบโค้ช ใช้ได้ในงานการเงิน · ปิดนุ่ม (`ลองได้เลย`) ดีกว่าคำสั่งห้วน · ไม่เปิดด้วยนิยาม `X คือ…` ในหน้าขาย · งานการเงินปิดด้วยคำแนะนำความพอดี 1 ประโยค (`กู้เท่าที่จำเป็นและชำระคืนไหว`) และยุบข้อสงวนสิทธิ์เป็นประโยคในน้ำเสียงเดียวกัน

**คำคู่ที่ต้องเลือกฝั่งเดียวทั้งชิ้น (`r-drift`)**

| ไม่ทางการ | ทางการ (วิชาการ · ราชการ) |
|---|---|
| ยังไง | อย่างไร |
| คนไหน · แบบไหน | คนใด · รูปแบบใด |
| เยอะ | มาก · จำนวนมาก |
| ทำไม | เพราะเหตุใด |
| ตอนนี้ | ขณะนี้ · ปัจจุบัน |
| อยากรู้ | ต้องการทราบ |

**ระดับวิชาการเพิ่ม** — ประโยคยาวได้แต่ต้องสลับกับประโยคสั้น · `ทว่า` `อย่างไรก็ตาม` `นอกจากนี้` ใช้ได้เฉพาะจุดเปลี่ยนจริง · ยืนยันตรง ๆ ไม่ออกตัวถ้าแหล่งไม่ได้ออกตัว · เปิดด้วยคำถามหรือกรอบของเรื่อง ไม่เปิดกว้าง ๆ · ปิดด้วยการตั้งโจทย์ใหม่ ไม่สรุปซ้ำ

## 5 · ทับศัพท์ — เลือก 1 แบบต่อคำ แล้วใช้แบบเดียวทั้งชิ้น

| แบบ | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| แปลไทย | มีคำไทยที่คนรู้จัก หรือราชบัณฑิตยสภาบัญญัติไว้ | เสรีภาพ · ผลิตภาพ · ทุนนิยม |
| เขียนเสียงเป็นไทย | ชื่อเฉพาะ คำใหม่ไม่มีคำไทยตรง | อัลกอริทึม · บล็อกเชน · ซอฟต์แวร์ |
| คงอักษรอังกฤษ | ชื่อแบรนด์ ตัวย่อ ศัพท์ที่นักพัฒนาใช้เป็นอังกฤษ | Google · API · deploy · query |
| ตั้งคำไทย + วงเล็บครั้งแรก | แนวคิดหลักที่ใช้ซ้ำ · ตัวย่อ | ระเบียบในจินตนาการ (imagined order) ครั้งต่อไปใช้ไทยอย่างเดียว · ปัญญาประดิษฐ์ (Artificial Intelligence: AI) แล้วใช้ไทยหรือ AI แบบเดียวทั้งชิ้น — รูปนี้เป็นรูปเดียวของทุก plugin (`spell-out-abbreviations` · `srs-writing` · `thesis-writing` อ้างมาที่นี่) |

ผสมอังกฤษที่คำนามหรือกริยาเดี่ยว (`deploy โค้ด` `query ตาราง`) ไม่ใช่ `ทำการ deployment ของ code` · เขียนเสียงเป็นไทยตามหลักเกณฑ์การทับศัพท์ของราชบัณฑิตยสภา: ไม่ใส่วรรณยุกต์ เว้นแต่คำนั้นเสียงซ้ำกับคำไทยจนสับสน เช่น `โค้ก` (ข้อ ๕) (`ซอฟต์แวร์` ไม่ใช่ `ซ้อฟต์แว่ร์`) ใส่การันต์ที่ตัวสะกดไม่ออกเสียง (ข้อ ๓.๑) · เลือก 1 ตัวสะกดต่อคำแล้วจดไว้ (ที่มา: ประกาศสำนักนายกรัฐมนตรี เรื่อง หลักเกณฑ์การทับศัพท์ภาษาอังกฤษ ประกาศ ณ วันที่ 26 สิงหาคม พ.ศ. 2532 ราชกิจจานุเบกษา เล่ม 106 ตอนที่ 153 วันที่ 14 กันยายน 2532 · อ่านไฟล์ PDF ที่สำนักงานราชบัณฑิตยสภาเผยแพร่ https://www.orst.go.th/FILEROOM/CABROYINWEB/DRAWER004/GENERAL/DATA0000/00000753.PDF หน้า 1-5 ตรวจ 2026-10-26 · ยังไม่ได้เทียบตารางพยัญชนะ (ตารางที่ 2) ทีละตัว) · ชื่อคนต่างชาติเขียนไทยแล้ววงเล็บอังกฤษครั้งแรก `ไมเคิล แซนเดล (Michael Sandel)` ไม่ใช้ลูกน้ำคั่นคำขยาย

## 6 · ปิดเรื่อง

ไม่สรุปซ้ำ (`c-recap`) · จบด้วยสิ่งที่ทำต่อ คำถามที่ตั้งใหม่ หรือหยุดเฉย ๆ

## 7 · แปลอังกฤษเป็นไทย

ใช้เมื่อต้นทางเป็นอังกฤษ (เอกสาร · error message · paper · บทความ) และผลเป็นไทยที่คนอ่าน · เล่าใหม่ทั้งย่อหน้า ไม่แปลทีละประโยค

1. เรียงใหม่ตามกรอบ `f1` `f2`: ยกเรื่องขึ้นก่อน เงื่อนไขและเวลามาก่อน · passive อังกฤษกลับเป็นใครทำ (`t-thuk`) ยกเว้นเรื่องไม่ดีหรือไม่รู้ผู้ทำ
2. ไม่เติมสิ่งที่ต้นทางไม่มี: ไม่เติม ครับ/ค่ะ `อาจจะ` หรือคำออกตัวที่ต้นทางไม่ได้ออกตัว · ไม่ตัดตัวเลขหรือเงื่อนไข
3. สำนวนแปลตามความหมาย ไม่แปลตามคำ · ภาพเปรียบของผู้เขียนที่ใช้ซ้ำทั้งเรื่อง ตั้งเป็นคำไทย 1 คำแล้วใช้คำนั้นตลอด (หัวข้อ 5 แถว 4)
4. `it is … that …` `there is` `one of the most` ไม่มีรูปไทย: `ชัดเจนว่า` · `มี…` · `…ที่สุดคนหนึ่ง` (`t-mun` `t-nueng-nai`) · `is considered` ไม่ใช่ `ถูกพิจารณาว่า` (`t-considered`)
5. ตัวเอนที่ใช้เน้นในอังกฤษ กลายเป็นคำท้ายหรือลำดับคำในไทย (`ต่างหาก` `เลย` `แหละ`) ไม่ใช่ตัวเอน · ชื่อคนต่างชาติ `ไมเคิล แซนเดล (Michael Sandel)` ครั้งแรก
6. ศัพท์เทคนิคคงอังกฤษตามหัวข้อ 5 · กริยาที่เป็นภาพทางกาย (burst · cap · throttle · drop) ใช้กริยาไทยคนละตัว (`g-verb`) · ลักษณนามเลือกเอง ไม่แปล `a` `an`
7. อ่านออกเสียงทั้งย่อหน้า ถ้าเดาได้ว่าต้นทางเป็นอังกฤษ ให้เรียบเรียงใหม่

## 8 · วินัยเพิ่มกฎ และไฟล์ประกอบ

- **กฎใหม่ต้องมีที่มา**: คำแก้ของเจ้าของงาน (ก่อน → หลัง) · แหล่งที่เปิดอ่านจริงพร้อมวันที่ · หรือผลรันจริง · ไม่มีให้ติด `(ชั่วคราว)` เหมือนระดับราชการเพิ่มข้างบน
- **ผู้ใช้แก้ภาษาไทยของ agent** → ก่อนเพิ่มกฎ ค้นไฟล์นี้ว่ากฎมีอยู่แล้วไหม: มีแต่ไม่ได้ใช้ → แก้ถ้อยคำหรือย้ายตำแหน่งกฎ ไม่เพิ่มกฎซ้ำ · ไม่มี → เก็บคู่ก่อน/หลังลง [`thai-examples`](thai-examples.md) ก่อน (ข้อความ "หลัง" ต้องเป็นของผู้ใช้ ไม่ใช่ที่ agent แต่ง) · ซ้ำ 2 ครั้งขึ้นไปค่อยสรุปเป็นกฎ · ไฟล์ตัวอย่างเก็บไม่เกิน 10 คู่ต่อระดับภาษา กฎดูดซับคู่ไหนแล้วลบคู่นั้น
- **คู่ก่อน/หลังสอนได้ดีกว่ากฎ** — ก่อนเขียนย่อหน้าไทยยาว เปิด [`thai-examples`](thai-examples.md) ดูคู่ของระดับภาษาที่ใช้
- **ตัวตรวจอัตโนมัติ** `scripts/thai_tells.py` จับ `t-block` `t-budget` `t-padding` `f3` (จุดกลางย่อหน้า) `g-yamok` `t-dash` และ `ทั้งนี้` เปิดย่อหน้า · เตือนอย่างเดียว ไม่ตัดสินว่าอ่านลื่น · สิ่งที่สคริปต์ไม่เห็น (`f1` `f2` `f4`–`f7` ระดับภาษา) ยังต้องอ่านเอง
- **ตัวอักษรไทยในไฟล์ส่งออก** (ตัดคำ · ช่องไฟ · line-height ต่อสื่อ) อยู่ใน [`thai-line-breaking`](thai-line-breaking.md) ที่เดียว skill อื่นลิงก์มา

---

ที่มา: กลั่นจาก [chakrit/kien-thai](https://github.com/chakrit/kien-thai) (MIT License · Copyright (c) 2026 Chakrit Wichian · ข้อความสัญญาอนุญาตเต็มใน [`THIRD-PARTY-NOTICES`](../THIRD-PARTY-NOTICES.md)) — กรอบ 7 ข้อ · ไฟล์ `ai-tells` · `grammar` · `register` · `style-rules` · `forbidden-phrases` · `decisions/` (คำสุภาพไม่ใช่ AI tell · ภาษาไทยไม่ตัดคำแบบอังกฤษ · ไม่ให้โมเดลตัดสินคุณภาพภาษา · ตัวอย่างคู่ก่อนกฎ) ตรวจเมื่อ 2026-10-22 · ที่มาทางวิชาการตามที่ repo อ้าง: Iwasaki & Ingkaphirom · Takahashi 2023 (ก็) · Olsson 2013 (แล้ว) · หลักเกณฑ์การเว้นวรรค ราชบัณฑิตยสภา · ระดับภาษาเพิ่ม 5 แถว (ธุรกิจ · แชตร้าน · ร้องเรียน · สมัครงาน · หน้าจอ) มาจากการกวาด template ใน plugin ของ SQT-Marketplace 2026-10-22


## reference: thai-line-breaking.md

# ตัดคำภาษาไทยให้ขึ้นบรรทัดสวย

ใช้ทุกครั้งที่ส่งออกเอกสารภาษาไทยเป็น Word · PDF · HTML · สไลด์ ที่จัดย่อหน้าชิดสองข้าง หรือเมื่อเห็นบรรทัดที่ตัวอักษรถูกยืดห่างกัน (`เ ท ค โ น โ ล ยี`)

## ทำไมถึงเกิด

ภาษาไทยไม่เว้นวรรคระหว่างคำ โปรแกรมต้องเดาจุดตัดเอง ถ้าเดาไม่ได้ (run ติดป้ายภาษาอังกฤษ · ฟอนต์ไม่รองรับ · ไฟล์สร้างจากสคริปต์) ข้อความไทยทั้งก้อนจะกลายเป็นคำเดียวยาว ๆ บรรทัดก่อนหน้าเลยเหลือที่ว่าง แล้วการจัดชิดสองข้างก็ยืดช่องไฟทีละตัวอักษรให้เต็มบรรทัด

## แก้ตามชนิดไฟล์

| ไฟล์ | วิธีแก้ |
|---|---|
| **.docx** (สร้างเองหรือได้มา) | รัน `python scripts/thai_linebreak.py <ไฟล์>.docx` หลังสร้างไฟล์เสร็จ · ใส่จุดตัดที่มองไม่เห็น (U+200B) ระหว่างคำ · ติดป้ายภาษาไทยให้ run · ผูกตัวเลขกับคำข้าง ๆ ("4 ประเด็น" ไม่แยกบรรทัด) · เก็บต้นฉบับไว้ใน `_to_delete/` · ตรวจตัวสคริปต์ด้วย `python -B scripts/thai_linebreak.py --self-test` (ไม่ต้องมี pythainlp) |
| **.md ก่อนแปลงด้วย pandoc** | รันสคริปต์เดียวกันกับ .md · โค้ดใน `` ` `` ไม่ถูกแตะ |
| **python-docx / docx-js** | ตั้งภาษาไทยให้ run (`w:lang w:bidi="th-TH"`) และฟอนต์ complex script (`w:rFonts w:cs="TH Sarabun New"`) ตั้งแต่ตอนสร้าง แล้วรันสคริปต์ปิดท้าย |
| **HTML** | Chrome · Edge · Firefox ตัดคำไทยเองได้ ไม่ต้องใส่ ZWSP · ใส่ `<html lang="th">` · CSS `word-break: normal; overflow-wrap: anywhere; line-break: auto;` · เนื้อหาไทยใช้ `text-align: left` · ห้าม `word-break: break-all` (ตัดกลางคำ) |
| **PDF** | แก้ที่ต้นทาง (.docx หรือ HTML) แล้วแปลงใหม่ |
| **สไลด์ .pptx** | กล่องข้อความไทยชิดซ้าย · ข้อความยาวรันสคริปต์ไม่ได้ ให้ขึ้นบรรทัดเองที่รอยต่อวลี |

## การจัดย่อหน้า

- เนื้อหาภาษาไทยทั่วไป: **ชิดซ้าย** ปลอดภัยที่สุด
- งานวิชาการหรือราชการที่ต้องชิดสองข้าง: ใช้ "ชิดสองข้าง" (`both`) **หลัง** รันสคริปต์แล้วเท่านั้น
- ไม่ใช้ "กระจายแบบไทย" (`thaiDistribute`) หรือ "กระจาย" (`distribute`) กับเนื้อหา เพราะยืดตัวอักษรทุกบรรทัด · สคริปต์แจ้งย่อหน้าที่ใช้อยู่ และเปลี่ยนให้ได้ด้วย `--align both` หรือ `--align left`

## ห้ามตัดตรงนี้

- ตัวเลขกับหน่วยหรือคำนำหน้า: `4 ประเด็น` · `ตารางที่ 1` · `พ.ศ. 2569` · `50 %`
- ก่อน `ๆ` `ฯ` และสระหรือวรรณยุกต์ที่ขึ้นต้นบรรทัดไม่ได้
- ชื่อเฉพาะสั้น ๆ: `IEEE Transactions` ถ้าขึ้นบรรทัดใหม่แล้วอ่านยาก ให้เว้นด้วย non-breaking space

## ระยะบรรทัดต่อสื่อ (ค่ากลางที่ skill อื่นอ้างมา)

ภาษาไทยมีสระบน สระล่าง และวรรณยุกต์ซ้อนกันได้ 2 ชั้น จึงต้องการระยะบรรทัดมากกว่าละติน · ละตินล้วนใช้ 1.2–1.4 ได้ ส่วนไทยต่ำกว่าราว 1.4 สระบนกับวรรณยุกต์จะชนกันหรือถูกตัด · ค่าในตารางเป็นค่ากลางที่ skill ในชุดนี้ใช้อยู่ แก้ที่นี่แล้วให้ skill ที่อ้างตามมา

| สื่อ | เนื้อความ | หัวข้อ | ที่ใช้อยู่ |
|---|---|---|---|
| หน้าเว็บ (CSS `line-height` คูณขนาดตัวอักษร) | 1.6 · บทความยาว 1.75–1.85 | ไทยไม่ต่ำกว่า 1.4 · หัวใหญ่ที่เป็นละตินล้วนบีบถึง 1.0–1.1 ได้ | `web-app-design` · `dynamic-website` |
| แอปมือถือ | 1.5–1.75 · จอเล็กยิ่งต้องห่าง | ไม่ต่ำกว่า 1.4 | `mobile-app-design` |
| แอป Windows | 20px ที่ตัว 14px สำหรับข้อความในหน้าจอ · ย่อหน้ายาว 22px | ตามสเกล Fluent | `windows-app-design` |
| สไลด์ | ไม่ต่ำกว่า 1.5 | ไม่ต่ำกว่า 1.4 | `presentation-design` |
| กราฟิก โพสต์ โปสเตอร์ | 1.5–1.7 | ไม่ต่ำกว่า 1.4 | `brand-kit` · `graphic-design` |
| diagram | ไม่ต่ำกว่า 1.5 | — | `diagram-figures` |
| Word .docx (ฟอนต์ Tahoma) | 1.3–1.35 แบบ "หลายเท่า" | ตามแม่แบบ | `branded-document-design` |

**Word ไม่ได้นับแบบเดียวกับ CSS:** "หลายเท่า" ใน Word คูณความสูงบรรทัดที่ฟอนต์กำหนดมาเอง ซึ่งฟอนต์ไทยเผื่อที่ให้สระและวรรณยุกต์ไว้แล้ว ตัวเลขใน Word จึงต่ำกว่าบนเว็บได้โดยบรรทัดไม่ชน · เปลี่ยนฟอนต์เมื่อไหร่ให้เปิด PDF ดูทุกหน้าใหม่

**หน้าเว็บต้องรับการปรับของผู้ใช้ได้:** WCAG 2.2 ข้อ 1.4.12 (ระดับ AA) กำหนดว่าเมื่อผู้ใช้ตั้งระยะบรรทัดเป็น 1.5 เท่าของขนาดตัวอักษร เนื้อหาต้องไม่ขาดหรือทับกัน · วิธีตรวจอยู่ใน `web-quality-audit`

## ตรวจ

1. รัน `--check` ดูจำนวนจุดตัดและย่อหน้าที่จัดแบบกระจาย
2. แปลงเป็น PDF แล้วเปิดดูทุกหน้า หาบรรทัดที่ตัวอักษรห่างผิดปกติ
3. ตัวตัดคำ (pythainlp `newmm`) ตัดผิดได้บ้าง เช่น `ท่า|ทางการ` ที่ควรเป็น `ท่าทาง|การ` · จุดตัดผิดไม่ทำให้ข้อความเปลี่ยน แค่อาจขึ้นบรรทัดใหม่กลางคำ ถ้าเจอในบรรทัดจริงให้แก้มือตรงนั้น

**ข้อควรรู้:** จุดตัดที่มองไม่เห็นอยู่ในไฟล์จริง ค้นคำใน Word ส่วนใหญ่ยังเจอ แต่ถ้าคัดลอกข้อความไปวางในระบบอื่นแล้วค้นไม่เจอ ให้รันสคริปต์กับสำเนาสำหรับพิมพ์เท่านั้น
