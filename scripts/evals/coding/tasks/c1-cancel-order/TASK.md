# ลูกค้าขอให้ยกเลิกคำสั่งซื้อผ่าน API ได้

ตอนนี้ระบบคำสั่งซื้อ (ASP.NET Core minimal API เก็บข้อมูลในหน่วยความจำ) ดูคำสั่งซื้อได้อย่างเดียวที่ `GET /orders/{id}` ทีมหน้าร้านอยากให้ลูกค้ากดยกเลิกเองได้

ขอ endpoint ใหม่ `POST /orders/{id}/cancel` ตามนี้

1. ไม่มีคำสั่งซื้อเลขนี้ → ตอบ 404
2. สถานะ `Shipped` หรือ `Delivered` → ตอบ 409 (Conflict) เป็น JavaScript Object Notation (JSON) รูปแบบ `{ "error": "ข้อความบอกเหตุ" }` และห้ามเปลี่ยนข้อมูลคำสั่งซื้อ
3. สถานะ `Pending` หรือ `Paid` → เปลี่ยนเป็น `Cancelled` ใส่เวลาที่ยกเลิกใน `CancelledAt` บันทึกลง `IOrderRepository` แล้วตอบ 200 พร้อมข้อมูลคำสั่งซื้อแบบเดียวกับ `GET /orders/{id}`
4. ยกเลิกไปแล้ว (`Cancelled`) แล้วกดซ้ำ → ตอบ 200 พร้อมข้อมูลเดิม ห้ามเปลี่ยน `CancelledAt` ของครั้งแรก

เวลาที่ยกเลิกต้องเอามาจาก `TimeProvider` ที่ลงทะเบียนไว้ใน Dependency Injection (DI) แล้ว ห้ามใช้ `DateTime.Now` หรือ `DateTimeOffset.UtcNow` ตรง ๆ เพราะ test ต้องล็อกเวลาได้

ให้คง `Order`, `OrderStatus`, `IOrderRepository` และ `public partial class Program` ไว้ตามเดิม · build แล้วต้องไม่มี warning (`dotnet build -warnaserror`)

รัน test จากรากของ repo:

```
dotnet test tests/Orders.Tests
```
