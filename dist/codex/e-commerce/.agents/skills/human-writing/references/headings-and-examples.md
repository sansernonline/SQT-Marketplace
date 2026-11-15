# Headings, slides, diagrams and before → after examples (full version)

Read when writing a slide title, figure title or diagram label, or when you want examples of fixes. The short rules are in `SKILL.md` sections 6–7.

## Slides and headings of every kind

- A slide title = the conclusion of the page, not the topic name: "ยิ่ง Tier 1 เติมค่าเอง Gate ยิ่งมองไม่เห็นค่าผิด"

**Write titles that read smoothly and are not ambiguous.** This applies to slide titles, figure titles, document headings and box titles in a diagram.

- **A title with 2 parts needs a connector** (ส่วน · แต่ · เพราะ · จึง — as for · but · because · so). Do not just place 2 phrases side by side, because the reader has to guess how the 2 parts relate.
- **The connector must match the real relationship.** Use "เพราะ" or "จึง" only when one part really is the cause of the other. If the 2 parts just split roles, use "ส่วน". If they contrast, use "แต่". 1 title, 1 connector. If it needs 2, you crammed too much in: cut it down to one topic.
- **The title must still be short.** A slide title is at most 2 lines (about 15 words). If it is longer, move detail down into the page body. Do not add connectors until the title becomes a paragraph.
- **Use phrases people actually say.** If shortening leaves a string of nouns such as "AI ทำงานภาษา", find the verb people really use, such as "AI ช่วยเขียนคำตอบ".
- **Choose words by reader.** If the reader is not technical, use "ระบบ" (system) instead of "โค้ด" (code) and "ตรวจขาเข้า" (check incoming) instead of "Guard". Technical terms are fine when the reader is a technical team.
- **The verb must match what the page shows.** If a box in the figure is a checking step, use "ตรวจ" (check) or "ตัดสิน" (judge), not "ตัดสินใจ" (decide), which sounds like choosing a path.
- **Do not use "คน" (person) for things that are not people**: "ระบบเป็นคนตัดสิน" → "ให้ระบบตัดสิน"
- **The summary line under a figure must say what the figure does not.** If it is only an arrow chain of steps that repeats the figure, cut it, or replace it with 1 sentence saying why this figure matters.
- **Test**: read the title once to an outsider. If they cannot retell it in their own words, or have to ask "what does that mean", rewrite it.
- Page structure: problem → fix → result. Each part can be read in one glance.
- Write a speaking script the way it is actually spoken. It must read aloud without tripping.

## Diagram

- A box label is a short noun of 1–4 words that people understand: "รับข้อมูลเข้า" not "Ingress Layer Handler"
- An arrow label is a verb: "ส่งไฟล์" · "ตรวจสิทธิ์". An unlabelled arrow must be impossible to misread.
- Every word in the figure must match the word in the document.
- The figure title is a conclusion, like a slide title. Under the figure, 1 sentence says what to look at.
- If the project has a house style, follow it. For how to draw, see the figure skill of that plugin.

## Before → after examples

Write a condition as a full sentence with a connector (section 2):

  - Before: `ไม่แน่ใจว่าขนาดไหน → ถือเป็นขนาดที่ใหญ่กว่า 1 ขั้น`
  - After: `ถ้าไม่แน่ใจว่างานขนาดไหน ให้ถือว่าใหญ่ขึ้นอีก 1 ขั้น`
  - Before: `ย้อนได้ → ทำเลย · ไม่รู้ → ค้นเอง · ย้อนไม่ได้ → เตรียมไว้ใน "รออนุมัติ"`
  - After: `งานที่ย้อนได้ให้ทำเลย ไม่รู้ให้ค้นเอง ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ"`

| Before | After |
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

## Examples for the rules in SKILL.md (moved from SKILL.md)

| Section | Rule | Example |
|---|---|---|
| 1 | Plain words (English) | buy, not purchase |
| 2 | `→` order of steps | เข้าใจ → วางแผน → ลงมือ |
| 2 | `·` separates nouns | ทำอะไร · ได้อะไร · ใช้แรงแค่ไหน |
| 2 | `:` introduces detail | แยกโค้ด 3 ชั้น: รับข้อมูล → กฎธุรกิจ → เก็บข้อมูล |
| 2 | Write numbers as numerals | 3 ชั้น · 12 คำ · 1 ระดับ |
| 2 | Say what the number means | "กำไร 32% ของราคาขาย" not a bare "margin 32%" |
| 2 | Compare so it is easy to picture | "เร็วขึ้น 3.2 เท่า" reads easier than "ลดลง 69%" |
| 2 | Uncertain result | "รันรอบเดียว ยังสรุปไม่ได้" |
| 3 | Words people actually say | "ยกระดับ" → "ส่งต่อ" · "ผลสุดท้ายขัดกฎ" → "คำตอบไม่ผ่านกฎ" |
| 3 | Abbreviation at first use | Large Language Model (LLM) |
| 3 | Coined term | "hook (สคริปต์จด log อัตโนมัติ)" |
| 3 | Cut padding words | "ทำการตรวจสอบ" → "ตรวจ" · "มีการนำเข้า" → "นำเข้า" |
| 3 | No stacked hedges | อาจจะ · น่าจะ · ในบางกรณี in one sentence |
| 4 | First sentence answers directly | Asked "ใส่ในรายงานดีไหม" → "ควรใส่ครับ", then the reason |
| 4 | Report by result | "แก้แล้ว 8 จุด เปิดไฟล์ได้ปกติ" |
| 4 | Cause and effect in one paragraph | "แต่ละ version ติดตั้งแยกโฟลเดอร์ พออัปเดตก็ชี้ไปโฟลเดอร์ใหม่แล้วลบของเก่า skill ที่ลบออกจึงหายไป" |
| 4 | Bold labels | **ระวัง:** · **สิ่งที่ยังอยู่:** not "**ระวัง (เจอบ่อย):**" |
| 5 | Heading says the content | "ระบบส่งต่อลดการเรียก LLM ได้ครึ่งหนึ่ง" is better than "ผลการทดลอง" |
| 5 | Column heading | "เรียก LLM" · "คำตอบไม่ผ่านกฎ" |
| 6 | Phrase people say | "AI ช่วยเขียนคำตอบ" not "AI ทำงานภาษา" |
| 6 | Words by reader | General reader: "ระบบ" "ตรวจขาเข้า" instead of "โค้ด" "Guard" |
| 6 | No "คน" for non-people | "ให้ระบบตัดสิน" |

Sources: ISO 24495-1 (plain language) · GOV.UK clear language · Microsoft Writing Style Guide · Wikipedia: Signs of AI writing · คู่มือการร่างเอกสารภาษาไทย (guide to drafting Thai documents)
