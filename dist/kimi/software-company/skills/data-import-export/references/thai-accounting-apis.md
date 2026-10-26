# ต่อโปรแกรมบัญชี SME ไทยผ่าน API

ใช้เมื่อระบบของเราต้องส่งเอกสารขายหรือซื้อเข้าโปรแกรมบัญชีของลูกค้า แทนการ export Excel ให้คีย์ซ้ำ · กฎของ `SKILL.md` ใช้เหมือนเดิม: ตรวจให้จบก่อนเขียน · มีหน้าสรุปก่อนยืนยัน · batch id · audit
ข้อเท็จจริงทุกข้อมาจากเอกสารของผู้ผลิตที่เปิดตรวจ 2026-10-23 · ราคาและค่า API ตรวจซ้ำ 2026-10-26 (ตาราง "ที่มา") · ราคาและเงื่อนไขเปลี่ยนบ่อย ยืนยันกับผู้ขายก่อนเสนอราคาลูกค้า
ตัวย่อ: small and medium enterprises (SME) · Application Programming Interface (API) · User Acceptance Testing (UAT) คือระบบทดสอบ · Hash-based Message Authentication Code (HMAC) คือลายเซ็นที่สร้างจากกุญแจลับ · Software Development Kit (SDK)

## 1 · เลือกทาง

| ทาง | ใช้เมื่อ |
|---|---|
| ส่งไฟล์ตามแม่แบบนำเข้าของโปรแกรมบัญชี (รูปแบบไฟล์ของแต่ละเจ้ายังไม่ได้ตรวจ) | เอกสารน้อย · แพ็กเกจของลูกค้าไม่เปิด API |
| ต่อ API ตรง (ข้อ 2–3) | เอกสารหลายร้อยใบต่อเดือน · ต้องการสถานะกลับ เช่น ชำระแล้ว |
| ผ่านแอปพาร์ทเนอร์ที่โปรแกรมบัญชีรับรอง (PEAK: เมนู ตั้งค่า > การเชื่อมต่อแอปพลิเคชันภายนอก) | ร้านค้าออนไลน์ที่ใช้ระบบหลังร้านอยู่แล้ว → `ecommerce-patterns` `references/thai-marketplace-apis.md` |

## 2 · PEAK

| เรื่อง | ข้อมูล |
|---|---|
| เอกสาร | developers.peakaccount.com (API Integration Guide · ไฟล์ `llms.txt` รวมลิงก์ทุกหน้า) · มี Postman collection |
| แพ็กเกจ | PEAK PRO Plus (12,000 บาท/ปี) ขึ้นไป · ราคา PEAK PRO Plus ตามหน้า developers เมื่อ 2026-10-26 · ค่าบริการ API จ่ายก่อนขึ้นระบบจริงตามเงื่อนไขแพ็กเกจที่ตกลง เอกสารไม่ระบุจำนวนเงิน (รอยืนยัน · เอกสาร go-live ให้ยืนยันค่า API จำนวนรายการ และเงื่อนไขทดลองกับทีม PEAK ก่อนใส่ในใบเสนอราคา) |
| ขอสิทธิ์ | กรอกแบบฟอร์ม ทีมงานติดต่อกลับใน 3 วันทำการ · ได้ Connect ID + Application Code · credential ของ UAT กับระบบจริงแยกกัน |
| ยืนยันตัวตน | Client Token อายุ 24 ชม. (`POST /api/v1/ClientToken`) · User Token ต่อกิจการ ลูกค้ากดสร้างเองในเมนู เชื่อมต่อแอปพลิเคชันภายนอก ด้วย Application Code · header `Time-Stamp` (yyyyMMddHHmmss เวลา UTC) · `Time-Signature` = HMAC-SHA1 ของ Time-Stamp ใช้ connectId เป็นกุญแจ |
| ของที่ทำได้ | contacts · products (มี adjust) · services · quotations · invoices · billing notes · receipts · credit notes · purchase orders · expenses · daily journals · รับชำระ · void · approve · แนบไฟล์ |
| e-Tax | มี endpoint ส่ง e-Tax Invoice ของ invoice และ receipt · ส่ง e-Receipt |
| UAT | `http://peakengineapidev.azurewebsites.net/api/v1` (เป็น http ไม่ใช่ https) · ฟรี 3 เดือน · เปิด จ.–ศ. 08:00–22:00 |
| ระบบจริง | `https://api.peakaccount.com/api/v1` · ก่อนขึ้นต้องผ่าน Final UAT Review (test case · error case · duplicate case · ผลทางบัญชี) |
| rate limit | ขอ ClientToken 10 ครั้ง/นาที/IP · รายงานงบทดลอง (`GET /api/v1/FinancialReports/trialbalance`) 10 ครั้ง/นาที และพร้อมกัน 1 · ต่อ User Token: GET พร้อมกัน 20 · POST พร้อมกัน 10 · แนบไฟล์พร้อมกัน 10 · เกิน → HTTP 429 `RATE_LIMITED` พร้อม `retryAfterSeconds` |
| คิดเงินตาม | POST Create ที่สำเร็จเท่านั้น (invoice · receipt · quotation · billing note · purchase order · expense · daily journal) |
| webhook | event Create · Edit · Void · PaidPayment · VoidPayment ของเอกสารหลัก (contact · product ได้แค่ Create · Edit) · ตั้ง custom header ต่อ endpoint ได้ เช่น `x-api-key` · เอกสารไม่พูดถึงลายเซ็นและการส่งซ้ำ |

## 3 · FlowAccount

| เรื่อง | ข้อมูล |
|---|---|
| เอกสาร | developers.flowaccount.com · spec ที่ใช้อยู่จริง `https://developers.flowaccount.com/swagger.yml` (OpenAPI 3.0.2 · 130 path) · SDK หลายภาษาใน github.com/flowaccount |
| แพ็กเกจ | เฉพาะ Pro Business ที่มี Open API (หน้าราคา 2026-10-26: ฿457/เดือน · ฿5,490/ปี) · Free · Standard (฿1,990/ปี) · Pro (฿2,990/ปี) ไม่มี API · หน้าราคาไม่ระบุค่า API แยก · นำเข้าไม่เกิน 5,000 รายการ/เดือน เกินคิดราคาพิเศษ · หน้า API เขียนว่า "Pay when you go live" ไม่ระบุจำนวนเงิน (รอยืนยัน) |
| ขอสิทธิ์ | แบบฟอร์ม request-openapi · ทีมติดต่อใน 1–2 วันทำการ · sandbox ใช้ได้ 30 วัน · credential จริงส่งอีเมลเจ้าของกิจการใน 3 วันทำการหลังยืนยันแพ็กเกจ |
| ยืนยันตัวตน | OAuth 2.0 · Client Credentials = 1 client ต่อ 1 กิจการ · OpenID = พาร์ทเนอร์ 1 client หลายกิจการ (scope `flowaccount-api offline_access` · refresh token ราว 30 วันนับจากครั้งล่าสุด) · token ที่ `https://openapi.flowaccount.com/{test หรือ v1}/token` อายุ 86,400 วินาที · ส่งใน header `Authorization: Bearer` |
| base URL | sandbox `https://openapi.flowaccount.com/test` · ระบบจริง `https://openapi.flowaccount.com/v1` |
| ของที่ทำได้ | contacts · products · quotations · billing-notes · tax-invoices · receipts · cash-invoices · purchases · purchases-orders · expenses · withholding-taxes · journal-entries · chart-of-accounts · เปลี่ยนสถานะ · รับชำระ · แนบไฟล์ · export PDF · ส่งอีเมล |
| อ้างอิงข้ามระบบ | ฟิลด์ `externalDocumentId` "รหัสเอกสารอ้างอิงจากระบบภายนอก" |
| e-Tax · rate limit · webhook | ไม่พบใน swagger.yml (ค้นคำ webhook · etax · rate limit · 429 ได้ 0 รายการ) และหน้า developers.flowaccount.com · flowaccount.com/en/developers เมื่อ 2026-10-26 (ยังไม่ได้ตรวจกับผู้ขาย · ติดต่อ developer_support@flowaccount.com) |

## 4 · เจ้าอื่น

| โปรแกรม | สิ่งที่พบ |
|---|---|
| TRCLOUD | หน้า API ของผู้ผลิตบอกว่ามี RESTful API · สร้าง API Key จากเมนูตั้งค่า · มี Custom API & Webhook · ไม่พบเอกสารนักพัฒนาสาธารณะ ต้องขอคู่มือจากทีมขาย |
| AccRevo | ไม่พบ API สาธารณะ · เว็บมีบทความเปิดตัว AccRevoX × MCP (ทำงานกับ Claude) |
| Express | ค้น 2 รอบไม่พบเว็บผู้ผลิตและไม่พบ API สาธารณะ |

## 5 · e-Tax Invoice

- เลือกระบบเดียวเป็นผู้ออกเลขที่ใบกำกับภาษี · ห้ามระบบเรากับโปรแกรมบัญชีออกเลขซ้อนกัน
- ส่งเข้าโปรแกรมบัญชีเป็นเอกสารต้นทาง แล้วให้โปรแกรมบัญชีออก e-Tax · PEAK มี endpoint ส่ง e-Tax · FlowAccount ไม่พบใน spec ต้องถามผู้ขาย
- กฎของใบกำกับ (มาตรา 86/4 · e-Tax Invoice & e-Receipt กับ by Email) → `e-commerce:e-tax-invoice` (ถ้าติดตั้ง)

## 6 · กันซ้ำและกระทบยอด

- เก็บตาราง mapping: รหัสฝั่งเรา ↔ รหัสฝั่งโปรแกรมบัญชี · PEAK แนะนำให้เก็บ External Reference และ mapping เพื่อกันเอกสารซ้ำ · FlowAccount ใช้ `externalDocumentId` เก็บรหัสฝั่งเรา
- เอกสารของทั้ง 2 เจ้าไม่มี idempotency key → ค้น mapping ก่อน POST create ทุกครั้ง (`principle-safe-to-rerun`)
- timeout ไม่ได้แปลว่าล้มเหลว · ดึงรายการตามช่วงวันที่มาเทียบก่อนส่งซ้ำ
- ได้ 429 → รอตาม `retryAfterSeconds` หรือถอยแบบ exponential (1 · 2 · 4 · 8 วินาที ตามที่ PEAK แนะนำ)
- กระทบยอดทุกวัน: จำนวนเอกสารและยอดรวมของ 2 ระบบต้องตรงกัน → `fintech-payments` (`references/agent-payment-integration.md` หัวข้อ Settlement Reconciliation)
- ทุกการส่งลง audit: ใครส่ง · เอกสารไหน · รหัสปลายทาง · ผล → `audit-trail`
- Client Token · client secret · connectId อยู่นอกโค้ด → `config-and-secrets` · UAT ของ PEAK เป็น http จึงใช้ข้อมูลทดสอบเท่านั้น

## ที่มา

| เรื่อง | URL (เปิดตรวจ 2026-10-23) |
|---|---|
| PEAK แพ็กเกจ · UAT ฟรี 3 เดือน · คู่มือ | https://www.peakaccount.com/developers · https://developers.peakaccount.com/reference/api-integration-guide |
| PEAK รายการหน้า API ทั้งหมด | https://developers.peakaccount.com/llms.txt |
| PEAK token · ลายเซ็น | https://developers.peakaccount.com/reference/peak-api-client-token-guide.md |
| PEAK rate limit · การนับเงิน · ขึ้นระบบจริง | https://developers.peakaccount.com/reference/copy-of-api-rate-limiting-concurrency-control.md · .../peak-api-transaction-counting.md · .../peak-api-implementation-go-live-guide.md |
| PEAK webhook · สิทธิ์ API | https://developers.peakaccount.com/reference/webhook.md · .../api-access-rights.md |
| PEAK ศูนย์ช่วยเหลือ (แพ็กเกจ · User Token) | https://intercom.help/peak/en/articles/13176287 · https://intercom.help/peak/en/articles/10078711 |
| FlowAccount หน้า API · ราคา (ตรวจซ้ำ 2026-10-26) | https://flowaccount.com/en/developers · https://flowaccount.com/en/pricing |
| FlowAccount การเชื่อมต่อ · token | https://developers.flowaccount.com/tutorial/connect-open-api · .../tutorial/connect/client-credentials-flow · .../tutorial/connect/open-id-flow |
| FlowAccount spec · SDK | https://developers.flowaccount.com/swagger.yml · https://github.com/flowaccount/open-api (README ชี้ว่า swagger.yml คือ spec ที่ใช้จริง) |
| TRCLOUD · AccRevo | https://www.trcloud.co/api.php · https://www.accrevo.com/ |
