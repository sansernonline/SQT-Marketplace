# เขียน SQL: ลูกค้า 3 อันดับแรกของไตรมาส 3/2026

ฐานข้อมูล SQLite อยู่ที่ `shop.db` (ตาราง `customers(id, name)` และ `orders(id, customer_id, order_date, status, amount)` · `order_date` เป็นข้อความ `YYYY-MM-DD` · `status` เป็น `paid` · `refunded` · `cancelled`)

เขียนคำสั่ง SQL 1 คำสั่งลง `query.sql` ที่คืนลูกค้า 3 อันดับแรกตามยอดสุทธิของวันที่ 1 ก.ค. ถึง 30 ก.ย. 2026 (รวมทั้ง 2 วัน)
- ยอดสุทธิ = ผลรวม amount ของ `paid` ลบผลรวม amount ของ `refunded` · ไม่นับ `cancelled`
- คืน 2 คอลัมน์ชื่อ `name` และ `net` เรียงจากมากไปน้อย ถ้าเท่ากันเรียงตาม name
