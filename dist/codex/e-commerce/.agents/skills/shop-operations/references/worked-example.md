# Worked example · shop-daily-briefing

Exports at 08:30 (illustrative numbers): Shopee 23 orders to ship, 4 of them past ship-by; Lazada 1 return request due tomorrow, ฿890; TikTok Shop 2 parcels with no tracking update for 5 days; master sheet shows `BAG-TOTE-BLK-L` available 12, reorder point 126; 14 unanswered chats, 1 says "จะแจ้ง สคบ.".

Briefing:

1. Shopee ออเดอร์ 4 ใบเลยเวลาเตรียมส่ง รวม ฿2,360 · แพ็กก่อน ส่งทันรอบรถ 17:00
2. แชตลูกค้าขู่แจ้ง สคบ. (ออเดอร์ ฿1,250) · เจ้าของตอบเองภายในชั่วโมงนี้ ด้วยข้อเท็จจริงเท่านั้น
3. Lazada คำขอคืน ฿890 ครบกำหนดตอบพรุ่งนี้ · ตัดสินตามตารางใน `customer-care`
4. `BAG-TOTE-BLK-L` เหลือ 12 ชิ้น ต่ำกว่าจุดสั่ง 126 · ขายแค่ช่องทางเดียว และสั่งของวันนี้ (รัน `stock-calc.mjs`)
5. TikTok Shop พัสดุ 2 ชิ้นไม่ขยับ 5 วัน (฿640) · เปิดเคลมกับขนส่งและแจ้งลูกค้า
6. อีก 13 แชตถามสินค้า · ตอบหลังข้อ 1–5
