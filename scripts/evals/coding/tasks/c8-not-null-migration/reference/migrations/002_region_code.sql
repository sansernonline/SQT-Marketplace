-- เพิ่มรหัสภาคให้ทุก order จากจังหวัดของลูกค้า
-- จังหวัดที่ไม่อยู่ในตาราง province_regions (หรือไม่ได้กรอก) ใช้ 'UNK'
-- รันซ้ำได้ และไม่ล็อกตาราง orders นาน

-- 1. เพิ่มคอลัมน์แบบยอมให้ว่างก่อน (แก้แค่ข้อมูลโครงตาราง ไม่เขียนแถว)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS region_code text;

-- 2. เติมค่าทีละ 5,000 แถว แต่ละชุด commit เอง
--@repeat
UPDATE orders o
SET region_code = COALESCE(
  (SELECT m.region_code
   FROM customers c
   JOIN province_regions m ON m.province = c.province
   WHERE c.id = o.customer_id),
  'UNK')
WHERE o.id IN (SELECT id FROM orders WHERE region_code IS NULL LIMIT 5000);

-- 3. เพิ่ม CHECK แบบ NOT VALID (ไม่ตรวจแถวเดิมตอนเพิ่ม) แล้วค่อย VALIDATE ซึ่งล็อกเบากว่า
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'orders'::regclass AND conname = 'orders_region_code_not_null'
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT orders_region_code_not_null CHECK (region_code IS NOT NULL) NOT VALID;
  END IF;
END $$;

ALTER TABLE orders VALIDATE CONSTRAINT orders_region_code_not_null;

-- 4. มี CHECK ที่ตรวจแล้ว SET NOT NULL จึงไม่ต้องไล่ทั้งตาราง แล้วลบ CHECK ที่ซ้ำซ้อนทิ้ง
ALTER TABLE orders ALTER COLUMN region_code SET NOT NULL;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_region_code_not_null;
