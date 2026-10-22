-- เพิ่มรหัสภาคให้ทุก order จากจังหวัดของลูกค้า
-- จังหวัดที่ไม่อยู่ในตาราง province_regions (หรือไม่ได้กรอก) ใช้ 'UNK'

ALTER TABLE orders ADD COLUMN region_code text;

UPDATE orders o
SET region_code = COALESCE(
  (SELECT m.region_code
   FROM customers c
   JOIN province_regions m ON m.province = c.province
   WHERE c.id = o.customer_id),
  'UNK');

ALTER TABLE orders ALTER COLUMN region_code SET NOT NULL;
