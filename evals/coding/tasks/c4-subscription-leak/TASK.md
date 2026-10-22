# กระดานราคา: เปิดปิดหลายรอบแล้วแอปช้าลงเรื่อย ๆ

ผู้ใช้สลับแท็บไปมาประมาณ 100 รอบ แอปเริ่มหน่วง หน่วยความจำขึ้นไม่หยุด และบางครั้งแจ้งเตือนราคาเด้งซ้ำหลายครั้งทั้งที่ราคาขึ้นครั้งเดียว

หน้าจอที่มีปัญหาคือ `PriceBoardComponent` ใน `src/price-board.component.ts` (เขียนแบบ Angular มี `ngOnInit` / `ngOnDestroy` แต่ใช้แค่ Reactive Extensions for JavaScript (RxJS) ไม่มี Angular) หน้าจอนี้ฟังข้อมูลจาก `PriceFeedService` และ `SettingsService` ที่ทั้งแอปใช้ร่วมกัน

ที่ต้องการ:

1. หลัง `ngOnDestroy()` ต้องไม่เหลือใครฟัง `feed.ticks`, `feed.status` และ event `"currency"` ของ `settings.events` แม้เปิดปิด 100 รอบ
2. หลังปิดหน้าจอ ราคา สกุลเงิน และแจ้งเตือนบนหน้าจอนั้นต้องไม่เปลี่ยนอีก
3. ระหว่างเปิดอยู่ ราคา สกุลเงิน และแจ้งเตือนต้องอัปเดตเหมือนเดิม
4. ตลาดส่งสถานะ `"open"` ซ้ำ 2 ครั้ง ราคาเกินเกณฑ์ 1 ครั้งต้องแจ้งเตือน 1 ครั้งเท่านั้น
5. ตลาดส่งสถานะ `"closed"` ต้องหยุดแจ้งเตือน (ราคายังอัปเดตตามปกติ)
6. `npx tsc --noEmit` ต้องไม่มี error (เปิด `strict` อยู่แล้ว)

ห้ามเปลี่ยนชื่อ class, constructor และ property `prices` `currency` `alerts` ของหน้าจอ · ห้ามแก้ `src/price-feed.service.ts` (ทีมอื่นใช้อยู่)

รัน test: `npm test` · ตรวจ type: `npx tsc --noEmit`
