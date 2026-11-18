# SPEC · ระบบสต็อกร้านเล็ก

## ข้อมูลที่ใช้ร่วมกัน (ทุกโมดูล)

- `store` คือ dict ของสินค้า key เป็น sku (str): `{"A1": {"name": "น้ำดื่ม", "qty": 20, "min_qty": 5, "price": 10}}`
  - `qty` จำนวนคงเหลือ (int) · `min_qty` จุดสั่งซื้อเพิ่ม (int) · `price` ราคาขายต่อชิ้นเป็นบาท (int)
- `log` คือ list บันทึกความเคลื่อนไหว เรียงตามเวลาที่เกิด ฟังก์ชันที่เปลี่ยนสต็อกต้องต่อท้าย `log` 1 รายการต่อ 1 ครั้งที่เรียกสำเร็จ
  - รายการเป็น dict: `{"type": "receive" | "sell" | "return" | "adjust", "sku": str, "qty": int}` โดย `qty` คือ **ส่วนที่สต็อกเปลี่ยน** มีเครื่องหมาย (รับเข้า +n · ขาย −n · คืน +n · ปรับ = ผลต่าง)
  - `sell` และ `return` มี `"amount": int` เพิ่มอีกช่อง (เงินเป็นบาท)
- ทุกฟังก์ชันแก้ `store` และ `log` ที่ส่งเข้ามาโดยตรง (ไม่คัดลอก) ถ้าฟังก์ชันล้มเหลวด้วย `ValueError` ต้องไม่แก้ `store` และไม่ต่อ `log`

## 1. `stock/receive.py`

`receive(store, log, sku, qty) -> int`

- เพิ่ม `qty` ให้สินค้า sku ที่มีอยู่ใน `store` คืนจำนวนคงเหลือใหม่
- log: `{"type": "receive", "sku": sku, "qty": qty}`

## 2. `stock/sell.py`

`sell(store, log, sku, qty) -> int`

- ลด `qty` จากสต็อก คืนยอดเงินของการขายครั้งนี้ = `qty × price`
- ถ้าสต็อกไม่พอ (`qty` มากกว่าคงเหลือ) → `ValueError`
- log: `{"type": "sell", "sku": sku, "qty": -qty, "amount": ยอดเงิน}`

## 3. `stock/returns.py`

`return_item(store, log, sku, qty) -> int`

- รับสินค้าคืนเข้าสต็อก คืนยอดเงินที่ต้องคืนลูกค้า = `qty × price` (ราคาปัจจุบันใน `store`)
- คืนได้ไม่เกิน "ขายสุทธิ" ของ sku นั้นใน `log` โดย ขายสุทธิ = ผลรวมจำนวนที่ขาย (`sell`) − ผลรวมจำนวนที่คืนไปแล้ว (`return`) ถ้า `qty` เกินขายสุทธิ (รวมกรณี sku นั้นไม่เคยขาย) → `ValueError`
- log: `{"type": "return", "sku": sku, "qty": qty, "amount": ยอดเงิน}`

## 4. `stock/adjust.py`

`adjust(store, log, sku, counted) -> int`

- ตั้งจำนวนคงเหลือของ sku เป็น `counted` (ยอดนับจริง) คืนผลต่าง = `counted − qty เดิม`
- ถ้าผลต่างเป็น 0 ไม่ต้องต่อ `log` (ยังคืน 0)
- log: `{"type": "adjust", "sku": sku, "qty": ผลต่าง}`

## 5. `stock/report.py`

`low_stock(store) -> list[dict]`

- รายการสินค้าที่ `qty <= min_qty` แต่ละรายการเป็น `{"sku", "name", "qty", "min_qty", "short"}` โดย `short = min_qty − qty`
- เรียงตาม `short` มากไปน้อย ถ้า `short` เท่ากันเรียงตาม sku ตามตัวอักษร

`movement_summary(log) -> dict`

- key เป็น sku ที่ปรากฏใน `log` ค่าเป็น `{"received": int, "sold": int, "returned": int, "adjusted": int}`
- `received` = ผลรวม `qty` ของ receive · `sold` = ผลรวมจำนวนที่ขาย (เป็นบวก) · `returned` = ผลรวมจำนวนที่คืน · `adjusted` = ผลรวมผลต่างของ adjust (มีเครื่องหมาย)
- `log` ว่างคืน `{}`

รัน test: `python -m pytest -q`
