# เครื่องมือประมวลผลข้อความไทย — เฉพาะที่ตรวจจากเอกสารทางการแล้ว (2026-10-23)

ใช้คู่กับ `i18n-and-locale` (เก็บค่ากลาง แปลงตอนแสดง) และ `translate-th-en` (plugin `superuser`) · ทุกข้อ `จากแหล่ง` เว้นที่ติดป้าย

## ตัดคำ ถอดเสียง วันที่ ตัวเลข — PyThaiNLP (Python · Apache-2.0)

| งาน | ฟังก์ชัน | หมายเหตุ |
|---|---|---|
| ตัดคำ | `pythainlp.tokenize.word_tokenize(text, engine="newmm")` | ค่าเริ่มต้น `newmm` (พจนานุกรม + maximal matching) · engine อื่น `attacut` `deepcut` `icu` `longest` `nlpo3` · ใส่ `custom_dict` เป็น Trie สำหรับศัพท์เฉพาะโปรเจกต์ |
| ถอดเป็นโรมันตามราชบัณฑิตยสภา (RTGS) | `pythainlp.transliterate.romanize(text, engine="royin")` | ค่าเริ่มต้น `royin` = RTGS · ใช้ทำ slug และชื่อที่เจ้าของยังไม่มีสะกดอังกฤษ (ชื่อคนให้ใช้สะกดของเจ้าของก่อนเสมอ) |
| วันที่ไทย | `pythainlp.util.thai_strftime(dt, "%-d %b %y")` · `thai_strptime(text, fmt, year="be")` · `convert_years(year, src="be", target="ad")` | ชื่อเดือนไทยและปี พ.ศ. ตอนแสดงผล · เก็บในระบบเป็น ค.ศ. เสมอ |
| ตัวเลขเป็นคำ | `pythainlp.util.bahttext(1500.50)` · `num_to_thaiword(n)` · `thaiword_to_num(s)` · `thai_digit_to_arabic_digit(s)` | `bahttext` ให้ "หนึ่งพันห้าร้อยบาทห้าสิบสตางค์" ใช้ในใบเสนอราคาและใบเสร็จ |
| ล้างข้อความ | `pythainlp.util.normalize(text)` | ลบ zero-width · ช่องว่างซ้ำ · สระซ้ำ · ตัวลอย — รันก่อนเทียบหรือเก็บ และเก็บเป็น Unicode NFC |

แหล่ง: [pythainlp.org/docs/5.1](https://pythainlp.org/docs/5.1/) (api/tokenize · api/transliterate · api/util) · ดู 2026-10-23 · สัญญาอนุญาต Apache-2.0 ตามท้ายหน้าเอกสาร (ยังไม่ได้เปิดไฟล์ LICENSE ใน repo)

## เลขบัตรประชาชน 13 หลัก — ตรวจ checksum

- สูตร: หลักที่ 1–12 คูณน้ำหนัก 13 ลงมาถึง 2 รวมกัน · `r = ผลรวม mod 11` · หลักตรวจ = `(11 − r) mod 10` ต้องเท่ากับหลักที่ 13
- PyThaiNLP **ไม่มี** ฟังก์ชันนี้ (ตรวจดัชนี util แล้ว) · ใช้ `python-stdnum` โมดูล `stdnum.th.pin` (`validate` · `is_valid` · `calc_check_digit` · รุ่น 2.2 · LGPL-2.1+) — [arthurdejong.org/python-stdnum/doc/stdnum.th.pin](https://arthurdejong.org/python-stdnum/doc/stdnum.th.pin) · หรือสคริปต์ `thai-id-validate` (validate.py · validate.ts · MIT) ใน [Boom-Vitt/claude-thai-skills](https://github.com/Boom-Vitt/claude-thai-skills)
- JavaScript: แพ็กเกจ `thai-id-validator` บน npm (ไม่มี dependency · สัญญาอนุญาตยังไม่ได้ตรวจ) · สูตร 4 บรรทัดเขียนเองได้ ไม่จำเป็นต้องติดตั้ง
- checksum ผ่าน = รูปแบบถูก ไม่ได้แปลว่าเลขนี้มีอยู่จริง · เลขบัตรเป็นข้อมูลส่วนบุคคล เก็บและ log ตาม `pdpa-compliance`

## ที่อยู่ไทย — แยกช่อง

- ไม่มีไลบรารีทั่วไปที่ตรวจแล้วว่าแยกที่อยู่ไทยได้ครบ (ยังไม่ได้ตรวจตัวอื่น) · ที่มีโค้ดและ test: `thai-address` (parse.py · parse.ts · MIT · 11 ช่อง · ตาราง 77 จังหวัดและรหัสไปรษณีย์ → จังหวัด) ใน Boom-Vitt/claude-thai-skills — ผู้เขียนระบุว่าไม่ใช่สำหรับจัดเส้นทางส่งของ
- ทางที่ปลอดภัยกว่าในฟอร์ม: ให้ผู้ใช้เลือก จังหวัด → อำเภอ → ตำบล จากรายการ แล้วรหัสไปรษณีย์เติมเอง · เก็บแยกช่องตั้งแต่ต้น ไม่เก็บเป็นบรรทัดเดียวแล้วค่อยแยก

## เรียงลำดับ นับความยาว ตัดข้อความ

- เรียงไทยห้ามเรียงตาม codepoint · ใช้ ICU: JavaScript `new Intl.Collator("th")` · PostgreSQL collation `th-TH-x-icu` · MySQL `utf8mb4_thai_520_w2`
- นับความยาวและตัดข้อความที่ขอบ grapheme cluster (สระและวรรณยุกต์ไม่แยกจากพยัญชนะ): JavaScript `Intl.Segmenter("th", { granularity: "grapheme" })` · Python regex `\X` · ตัดที่ขอบคำใช้ `word_tokenize` ก่อน
- ไฟล์เก่าเข้ารหัส TIS-620 / cp874 ให้ถอดรหัสก่อน (`pandas.read_csv(..., encoding="cp874")`) · `chardet` เดาผิดบ่อยกับข้อความไทยสั้น

แหล่งหัวข้อ 3 ข้อหลัง: `thai-text-processing` และ `thai-id-validate` `thai-address` ใน Boom-Vitt/claude-thai-skills (MIT · ดู 2026-10-23) · เรียบเรียงใหม่ ไม่คัดลอก
