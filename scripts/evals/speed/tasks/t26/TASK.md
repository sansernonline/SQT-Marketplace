# ตัวช่วยเรียก API ของพาร์ตเนอร์: retry กับ rate limit

ระบบเรียก API พาร์ตเนอร์ล้มบ่อยและโดนบล็อกเพราะเรียกถี่เกิน ทำ 2 ไฟล์ (Node 22 ไม่ใช้ package ภายนอก · export ตามชื่อ) งานนี้จะขึ้นระบบจริง

1. `src/retry.mjs` → `retry(fn, { tries = 3, baseMs = 100, sleep })`
   - เรียก `await fn(attempt)` (attempt เริ่ม 1) · สำเร็จคืนค่านั้นทันที
   - ล้มแล้วรอ `baseMs × 2^(attempt−1)` ด้วย `await sleep(ms)` แล้วลองใหม่ จนครบ `tries` ครั้ง · ครบแล้วยังล้ม โยน error ตัวสุดท้าย
   - error ที่มี `retryable === false` โยนทันทีไม่ลองใหม่
   - `sleep` ไม่ส่งมา ใช้ setTimeout
2. `src/bucket.mjs` → `class TokenBucket { constructor({ capacity, refillPerSec, now }) ; take(n = 1) }`
   - เริ่มเต็ม `capacity` · เติม `refillPerSec` ต่อวินาทีตามเวลาจริงจาก `now()` (มิลลิวินาที) ไม่เกิน capacity
   - `take(n)` มีพอ หักแล้วคืน `true` · ไม่พอคืน `false` และไม่หัก · n มากกว่า capacity โยน RangeError
   - `now` ไม่ส่งมา ใช้ `Date.now`
