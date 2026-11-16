# Worked example · chat-prompt-workflows

## A real example

**Task:** "ร้านเบเกอรี่อยากให้ ChatGPT เขียนคำบรรยายเค้กกล้วยหอมลงเพจ ไม่เกิน 80 คำ ต้องมีราคา 85 บาท สั่งล่วงหน้า 1 วัน และไม่อ้างว่าไม่มีน้ำตาล เพราะมีน้ำตาล" (a bakery wants ChatGPT to write a banana cake description for its page: at most 80 words, must show the price 85 baht and 1 day advance order, and must not claim it is sugar-free because it has sugar)

**What was done:** question 1: the path is known · question 2: a single piece of output → Loop · filled in `templates/loop.md`:
- Task: 1 post describing the banana cake, at most 80 words
- Source data: price 85 baht · order 1 day ahead · ingredients include brown sugar
- C1 at most 80 words (the checker counts and states the number) · C2 the price and advance-order condition match the source data (quote the text) · C3 does not contain the words "ไม่มีน้ำตาล" "ไร้น้ำตาล" "หวานน้อยเพื่อสุขภาพ"

**Result (what is sent to the user):** first line "ใช้ Loop เพราะเป็นโพสต์ชิ้นเดียวที่มีเกณฑ์ชัด" → 1 block of the filled-in prompt (stop conditions: all pass · 3 rounds · the same item fails 2 rounds in a row) → last 2 lines: "C3 เป็นเกณฑ์ที่ตั้งให้ แก้ได้ · ก่อนโพสต์ เปิดแชตใหม่วาง prompt ตรวจอิสระพร้อมเกณฑ์และข้อมูลต้นทางชุดเดิม" · it does not write that the cake is "ดีต่อสุขภาพ" (good for health) on the shop's behalf, because that is not in the source data
