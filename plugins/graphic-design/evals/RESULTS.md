# ผล eval ของ graphic-design

## 2026-10-26 · skill ใหม่ 3 ตัว · Claude Code 2.1.310 · เคสละ 3 รอบ · ผู้ตัดสิน haiku · 4.60 ดอลลาร์

รันที่สำเนาที่ลบ `dependencies` ออก เพราะ eval โหลด plugin ที่มี dependency ไม่ขึ้น (`skill-authoring` `eval-format.md`) · skill กลางของ superuser จึงไม่อยู่ในรอบนี้ · คะแนนคือ 0–1 ของ grader ที่นับคะแนน

| เคส | มี skill | ไม่มี skill | ต่าง | ช่วง 95% ของแขนมี skill (n = 3) | อ่านผล |
|---|---|---|---|---|---|
| `marketplace-product-images-trigger` | 1.00 | 1.00 | 0 | 3/3 ผ่าน · ขอบล่างราว 0.37 | skill เปิด 3/3 |
| `marketplace-product-images-behaviour` | 1.00 | 0.89 | +0.11 | 3/3 ผ่าน · ขอบล่างราว 0.37 | ไม่มี skill แต่งกฎเปอร์เซ็นต์ข้อความ 1/3 · ต่างไม่เกินช่วง ยังสรุปไม่ได้ |
| `print-ready-files-trigger` | 1.00 | 0.83 | +0.17 | 3/3 ผ่าน · ขอบล่างราว 0.37 | skill เปิด 3/3 · ต่างไม่เกินช่วง ยังสรุปไม่ได้ |
| `print-ready-files-behaviour` | 0.67 | 0.56 | +0.11 | ±0.53 | มี skill พลาด bleed 3 มม. 1/3 · เกณฑ์ถามร้านก่อนผ่าน 1/3 ต่อ 0/3 · ช่วงทับกันหมด ยังสรุปไม่ได้ |
| `youtube-thumbnail-trigger` | 1.00 | 0.83 | +0.17 | 3/3 ผ่าน · ขอบล่างราว 0.37 | skill เปิด 3/3 · ต่างไม่เกินช่วง ยังสรุปไม่ได้ |
| `youtube-thumbnail-behaviour` | 0.89 | 0.78 | +0.11 | ±0.35 | ต่างไม่เกินช่วง ยังสรุปไม่ได้ |

## วิธีอ่านตารางนี้ (เพิ่ม 2026-10-28)

- ทุกเคสรัน 3 รอบ ช่วง 95% คิดจาก ±1.96·√(p(1−p)/n) · ผ่านครบ 3/3 สูตรให้ 0 ซึ่งหลอก จึงใช้ขอบล่างของอัตราผ่านที่ผ่าน 3 จาก 3 (0.05^(1/3) ≈ 0.37) แทน · ช่วงจริงกว้างกว่านี้ เพราะ 3 รอบจากโจทย์เดียวไม่อิสระกัน
- **ต่างไม่เกินช่วง ยังสรุปไม่ได้** ว่ารุ่นหรือ skill ดีขึ้น · จะอ้างว่าดีขึ้นต้องรันซ้ำที่ n = 10 ขึ้นไป (ช่วงเหลือราว ±0.29 ที่ p = 0.67 · 6 เคส × 2 แขน × 10 รอบ = 120 รอบ)
- รอบนี้ไม่ได้เก็บผลรายรอบ จึงคำนวณ pass^3 (ผ่านครบทั้ง 3 รอบ) ไม่ได้ · รอบหน้าเก็บผลรายรอบข้างตาราง
- ผู้ตัดสินเกณฑ์ `llm` คือ haiku ยังไม่เคยเทียบกับคน · ก่อนเชื่อเกณฑ์นี้ ให้คนตรวจ 10 คำตอบเทียบกับ haiku แล้วนับว่าตรงกันกี่ข้อ
- รันที่สำเนาตัด dependencies ออก skill กลางของ superuser ไม่อยู่ในรอบ

## เคสที่ยังไม่เคยรัน (2026-10-28)

| กลุ่ม | เคส | สถานะ |
|---|---|---|
| ชุดกันถอยและ guard 6 เคส | `video-editing-guard` · `narration-th-guard` (เดิม `video-editing-tts-guard`) และเคส regression 4 เคส (icon-design · speaking-script · subtitles-th · video-editing-slides) | ไม่มีผลรันในไฟล์นี้ · รัน 1 ครั้งแล้วบันทึกเป็นฐาน · ผ่านทั้งสองแขน = วัดอะไรไม่ได้ ให้เปลี่ยนโจทย์ |
| เคสไม่ควรเปิด 4 เคส (รอบละ 5) | `print-ready-files-trigger-negative` · `marketplace-product-images-trigger-negative` · `youtube-thumbnail-trigger-negative` · `social-formats-trigger-negative` | เพิ่ม 2026-10-28 ยังไม่ได้รัน (eval เรียกโมเดล เสียเงิน) |
| skill ที่เพิ่งมี eval 5 เคส | `brief-to-image-trigger` · `brief-to-image-behaviour` · `image-generation-trigger-route` · `design-review-trigger` · `video-script-to-clip-trigger` | เพิ่ม 2026-10-28 ยังไม่ได้รัน |
| เกณฑ์ใหม่ในเคสเดิม | `approval-before-default` ใน `line-richmenu-behaviour` | เพิ่ม 2026-10-28 ยังไม่ได้รัน |
