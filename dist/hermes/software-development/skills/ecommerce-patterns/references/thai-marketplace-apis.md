# API ของ marketplace ไทย (Shopee · Lazada · TikTok Shop · LINE)

ใช้เมื่อสร้างระบบที่ดึงออเดอร์ ตัดสต็อก หรือสั่งส่งของผ่าน marketplace · ใช้คู่กับ [`inventory-management.md`](inventory-management.md) (sync หลายช่องทาง · จองสต็อก) · ผู้ขายที่ไม่ได้เขียนโปรแกรม → `e-commerce:multi-shop-stock` (ถ้าติดตั้ง)
ข้อเท็จจริงทุกข้อมาจากเอกสารของผู้ให้บริการที่เปิดตรวจ 2026-10-23 (ตาราง "ที่มา") · ช่องที่เปิดหาแล้วไม่พบติดป้าย (ยังไม่ได้ตรวจ) · ตรวจซ้ำ 2026-10-26 ด้วยเบราว์เซอร์จริง (หน้า Shopee · Lazada · TikTok Shop ต้องรันสคริปต์ ไม่ต้องล็อกอินจึงเห็นเอกสาร)
ตัวย่อ: Application Programming Interface (API) · Independent Software Vendor (ISV) คือบริษัทที่ทำระบบให้หลายร้าน · Hash-based Message Authentication Code (HMAC) คือลายเซ็นจากกุญแจลับ

## 1 · เขียนเองหรือใช้ระบบสำเร็จรูป

- ร้านเดียวที่ขายหลายช่องทาง → ระบบหลังร้านที่ต่อไว้แล้ว (ข้อ 7) เร็วกว่าเขียนเอง
- เขียนเองเมื่อเป็นระบบจัดการออเดอร์ (Order Management System · OMS) หรือ Enterprise Resource Planning (ERP) ที่มีลูกค้าหลายร้าน หรือมีกฎธุรกิจที่ระบบสำเร็จรูปทำไม่ได้
- เช็กคุณสมบัติก่อนรับงาน: ร้านไทยที่จะใช้ Shopee Open Platform เองต้องเป็น Mall Seller หรือ Managed Seller

## 2 · สมัครและประเภทบัญชี

| | Shopee Open Platform | Lazada Open Platform | TikTok Shop Partner Center |
|---|---|---|---|
| ประเภท | Individual Seller · Registered Business Seller (ใช้กับร้านตัวเองเท่านั้น) · Third-party Partner Platform (ISV) | Software Developer (เรียก API ของร้านตัวเอง) · Service Provider (ขายบริการให้ร้าน · เลือกแล้วเปลี่ยนไม่ได้) | Seller developer (custom app ร้านตัวเอง) · App developer / ISV (public app) |
| ISV ต้องมี | บริษัทจดทะเบียน · ผลิตภัณฑ์ใช้งานจริงพร้อมบัญชีทดลองที่เปิดทุกฟีเจอร์ · URL เป็น HTTPS · Transport Layer Security (TLS) 1.2 ขึ้นไป · เกรดความปลอดภัย "A" | ชื่อบริการ · โลโก้ 200×200 px · บัญชีรับเงินถ้าขายใน Service Market | ใบรับรองธุรกิจตรงกับ region ที่ลงทะเบียน · partner ในประเทศเลือกตลาดของตัวเอง |
| ร้านทำเอง | ร้านไทย: Mall Seller หรือ Managed Seller | ไม่พบเงื่อนไขเฉพาะไทย · หน้าบทบาทผู้พัฒนา (docId=108001 ตรวจ 2026-10-26) แค่ให้ลงทะเบียนบทบาท Software Developer แล้วกรอกข้อมูล · ไม่ได้ตรวจกับทีม Lazada ว่ามีเกณฑ์นอกเอกสาร | ร้านเปิดแล้ว · มี Account Manager · ใช้อีเมลเดียวกับบัญชีร้าน |

## 3 · ลายเซ็นและสิทธิ์จากร้าน

| | Shopee | Lazada | TikTok Shop |
|---|---|---|---|
| ลายเซ็น | HMAC-SHA256 ด้วย partner key ของ partner_id + api path + timestamp + access_token + shop_id · hex | เรียงพารามิเตอร์ตาม ASCII ต่อชื่อกับค่า นำหน้าด้วยชื่อ API ต่อท้ายด้วย body · HMAC-SHA256 ด้วย app secret · hex ตัวใหญ่ | เรียง query (ไม่รวม sign และ access_token) ต่อกัน นำหน้าด้วย path ต่อท้ายด้วย body (ยกเว้น multipart) ห่อด้วย app secret หัวท้าย · HMAC-SHA256 |
| เวลา | timestamp ใช้ได้ 5 นาที | timestamp ต่างจากเวลา UTC ไม่เกิน 7200 วินาที (2 ชม. · open.lazada.com หน้า API GetSellerItemLimit ตรวจ 2026-10-26) | timestamp ต้องอยู่ในช่วง 5 นาทีจากเวลาที่แพลตฟอร์มรับ เป็น Unix 10 หลัก (sign-your-api-request ตรวจ 2026-10-26) |
| ร้านอนุญาต | ลิงก์ authorize → `code` ใช้ครั้งเดียว อายุ 10 นาที | OAuth 2.0 แบบ code-for-token ที่ `auth.lazada.com` | `auth_code` อายุ 30 นาที ใช้ครั้งเดียว → `auth.tiktok-shops.com/api/v2/token/get` |
| access token | 4 ชม. · ตัวเก่ายังใช้ได้อีก 5 นาทีหลัง refresh | ตัวอย่างในเอกสาร 864,000 วินาที (10 วัน) | ค่าตั้งต้น 7 วัน · ส่งใน header `x-tts-access-token` |
| refresh token · อายุสิทธิ์ | refresh 30 วัน · ร้านอนุญาตได้นานสุด 365 วัน | ตัวอย่าง 4,320,000 วินาที (50 วัน) · หมดแล้วร้านต้องอนุญาตใหม่ | เท่ากับระยะที่ร้านอนุญาต |
| host | เลือกตามที่ตั้งเซิร์ฟเวอร์ · ใกล้สิงคโปร์ใช้ `https://partner.shopeemobile.com` | `https://api.lazada.co.th/rest` | `https://open-api.tiktokglobalshop.com` |

## 4 · endpoint หลัก

| งาน | Shopee (Open API v2) | Lazada | TikTok Shop (รุ่นอยู่ใน path · ใช้รุ่นล่าสุดที่หน้าอ้างอิงแสดง) |
|---|---|---|---|
| ออเดอร์ | `get_order_list` (`/api/v2/order/get_order_list` · ช่วงวันที่ไม่เกิน 15 วัน) · `get_order_detail` · `cancel_order` | GetOrders (`/orders/get`) · GetOrder · GetOrderItems | Get Order List (`/order/202309/orders/search`) · Get Order Detail |
| สินค้า | `add_item` · `get_item_list` · `get_item_base_info` · `get_model_list` | CreateProduct · GetProducts | Create Product · Search Products |
| สต็อก · ราคา | `update_stock` · `update_price` | UpdatePriceQuantity · UpdateSellableQuantity | Update Inventory · Update Price |
| ส่งของ | `get_shipping_parameter` · `ship_order` · `get_tracking_number` · `create_shipping_document` | Pack · ReadyToShip · GetShipmentProvider · PrintAWB · GetOrderTrace | Ship Package · Batch Ship Packages · Get Package Shipping Document |

## 5 · webhook · rate limit · sandbox

| | Shopee | Lazada | TikTok Shop |
|---|---|---|---|
| webhook | Push Mechanism: Order Status (code 3) · Order TrackingNo (4) · Reserved Stock Change (8) · Shop Authorization Canceled (2) · Authorization Expiry (12 · ล่วงหน้า 7 วัน) · ตอบ 2xx · บอกแค่ว่าข้อมูลเปลี่ยน ต้องเรียก API ดึงของจริง | Lazada Push Mechanism: trade order · reverse order (คืน · คืนเงิน) · callback ต้องเป็น HTTPS ใบรับรองระดับ Organization Validation (OV) หรือ Extended Validation (EV) · ระดับ Domain Validation (DV) ใช้ไม่ได้ | ORDER_STATUS_CHANGE · PACKAGE_UPDATE · PRODUCT_STATUS_CHANGE · SELLER_DEAUTHORIZATION · UPCOMING_AUTHORIZATION_EXPIRATION (ล่วงหน้า 30 วัน แล้วทุกวัน) |
| ตรวจ webhook | header `Authorization` = hex HMAC-SHA256 ของ URL ต่อด้วย `\|` แล้วต่อ body ด้วย partner key | header `Authorization` = hex HMAC-SHA256 ของ app_key + body ด้วย app secret | header `Authorization` = hex ตัวเล็ก HMAC-SHA256 ของ app_key + body ดิบ ด้วย app secret · กันซ้ำด้วย `tts_notification_id` |
| rate limit | ไม่พบตัวเลขในหน้า developer-guide 12 · 16 และ FAQ ที่เปิด 2026-10-26 (ยังไม่ได้ตรวจ · ถามทีม Shopee หรือทดสอบใน sandbox) | ไม่มีเพดานรวม · GetSellerItemLimit ระบุ 10 qps ต่อร้าน · หน้า GetOrders ไม่ระบุตัวเลข · เอกสาร push เตือนว่าเรียก GetOrders ถี่จะโดน throttle | queries per second (QPS) ปรับแบบพลวัตตามจำนวนร้านที่อนุญาตและภาระของ endpoint · ไม่มีค่าตายตัวรวม (rate-limits ตรวจ 2026-10-26) · จุดเริ่มที่แนะนำต่อแอป × ร้าน: เขียนหนัก 0.2–1 ครั้ง/วินาที · เขียนปกติ 1–3 · อ่าน 3–10 · อ่านเบา 5–20 · เฝ้า 429 และ 36009002 |
| sandbox | Sandbox V2 `https://openplatform.sandbox.test-stable.shopee.sg/` · สร้างร้านและออเดอร์ทดสอบได้ · partner_id ทดสอบใช้ได้แค่ sandbox | ยืมบัญชีทดสอบ · ออเดอร์ทดสอบเป็นเก็บเงินปลายทาง (COD) · 10 case/วัน/app key · ระบบจริงคือข้อมูลร้านจริง | Development Shops: Core Function (ไม่จ่ายเงินจริง · เลื่อนสถานะออเดอร์ด้วยเครื่องมือ) · Full Function (จ่ายจริงด้วยราคาต่ำ) |

## 6 · LINE และ PromptPay

- **LINE SHOPPING / MyShop ยังเปิดอยู่** (lineshoppingseller.com · เปิดร้านฟรีผ่าน LINE Official Account) · LINE SHOPPING API เปิดให้พาร์ทเนอร์แพลตฟอร์มเท่านั้น ไม่พบเอกสารสาธารณะ → ร้านต่อผ่านพาร์ทเนอร์ในหน้า Partners (รวมราว 20 ราย เช่น ZORT · BigSeller · BentoWeb · PEAK)
- **LINE Pay ไทย** ใช้ชื่อ "LINE Pay" (pay-th.line.me · ร้านค้าสมัครแล้วรอพิจารณา · รับชำระออนไลน์ผ่าน API) · ลิงก์ช่วยเหลือด้านเทคนิคพาไป developers-pay.line.me: Online API v3 (`/v3/payments/request` · `confirm` · `refund`) · header `X-LINE-ChannelId` · `X-LINE-Authorization-Nonce` · `X-LINE-Authorization` (HMAC-SHA256) · sandbox `sandbox-api-pay.line.me`
- หน้าเอกสาร LINE Pay ไม่ได้ระบุประเทศไทย และ change log ล่าสุด (พ.ย. 2025) เป็นของไต้หวัน · LINE Pay ญี่ปุ่นปิดแล้ว → ยืนยันกับ LINE Pay ไทยก่อนเชื่อมตรง (รอยืนยัน) · ทางที่ง่ายกว่าคือรับผ่าน payment gateway (`fintech-payments`)
- PromptPay QR บนหน้าชำระเงิน → `e-commerce:promptpay-qr` (ถ้าติดตั้ง)

## 7 · ระบบหลังร้านที่ผู้ขายไทยใช้แทนการเขียนเอง

| ระบบ | จากเว็บผู้ผลิต |
|---|---|
| ZORT | ระบบจัดการออเดอร์และสต๊อกทุกช่องทาง · มี API ที่ `https://open-api.zortout.com/v4` (header `storename` · `apikey` · `apisecret` · sync สินค้า ใบสั่งซื้อ ออเดอร์) |
| BentoWeb | ระบบอีคอมเมิร์ซครบวงจร · เชื่อม Lazada · Shopee · LINE Shopping · TikTok Shop · ส่งข้อมูลสินค้า สต็อก ออเดอร์เข้า ERP ผ่าน API |
| BigSeller | ระบบหลังบ้านจัดการสินค้า ออเดอร์ สต๊อก มีแบบฟรี · เชื่อมมากกว่า 16 แพลตฟอร์ม เช่น Shopee · Lazada · TikTok Shop |

## 8 · กฎที่ใช้ทุกเจ้า

- webhook ไม่ใช่ความจริงชุดเดียว → poll กระทบยอดตามรอบด้วย (TikTok เขียนไว้ตรง ๆ · Shopee บอกให้เรียก API ดึงของจริง)
- ตรวจลายเซ็น webhook ก่อนทำอะไร · ตอบ 2xx ทันที แล้วทำงานต่อในคิว (`background-jobs`)
- กันงานซ้ำด้วยรหัส notification หรือรหัสออเดอร์ (`principle-safe-to-rerun`)
- เก็บ token แยกต่อร้าน · refresh ก่อนหมด · เตือนร้านก่อนสิทธิ์หมด (Shopee 365 วัน · Lazada refresh 50 วัน · TikTok แจ้งล่วงหน้า 30 วัน)
- สต็อกกันขายเกินด้วยการจองตาม [`inventory-management.md`](inventory-management.md) · partner key และ app secret อยู่นอกโค้ด (`config-and-secrets`)

## ที่มา

| เรื่อง | URL (เปิดตรวจ 2026-10-23) |
|---|---|
| Shopee สมัคร · เกณฑ์ไทย · ISV | https://open.shopee.com/developer-guide/12 |
| Shopee host · ลายเซ็น · token | https://open.shopee.com/developer-guide/16 · https://open.shopee.com/developer-guide/20 |
| Shopee push · sandbox · endpoint | https://open.shopee.com/developer-guide/18 · https://open.shopee.com/developer-guide/644 · https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1 (รายชื่อ API ในแถบข้าง) |
| Lazada ลายเซ็น · host · บทบาท | https://open.lazada.com/apps/doc/doc?nodeId=10450&docId=108068 · ...docId=108065 · ...docId=108001 |
| Lazada สิทธิ์จากร้าน · ทดสอบ · push | ...nodeId=10777&docId=108260 · ...docId=121061 · ...nodeId=29524&docId=120168 · https://open.lazada.com/apps/doc/api?path=%2Forders%2Fget |
| TikTok Shop ประเภท · สมัคร · token | https://partner.tiktokshop.com/docv2/page/tts-developer-types · .../developer-onboarding · .../authorization-overview-202407 |
| TikTok Shop ลายเซ็น · host · รุ่น · rate limit | .../sign-your-api-request · .../methods-and-endpoints · .../api-versioning · .../rate-limits · .../regions-and-languages |
| TikTok Shop webhook · sandbox · endpoint | .../tts-webhooks-overview · .../seller-center-development-shops · .../get-order-list-202309 |
| LINE SHOPPING · พาร์ทเนอร์ | https://lineshoppingseller.com/ · https://lineshoppingseller.com/new-features/partner-api |
| LINE Pay | https://pay-th.line.me/portal/th/main · .../business/payment-service · https://developers-pay.line.me/online-api-v3 · https://developers-pay.line.me/api-change-log |
| ZORT · BentoWeb · BigSeller | https://zortout.com/ · https://developers.zortout.com/ · https://www.bentoweb.com/th · https://www.bigseller.com/th_TH/index.htm |
