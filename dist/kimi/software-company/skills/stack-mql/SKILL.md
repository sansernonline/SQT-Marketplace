---
name: stack-mql
description: Use when writing, reviewing or testing MQL4/MQL5 code for MetaTrader 4/5 (Expert Advisors, indicators, scripts) or preparing one for the MQL5 Market.
---

# stack · MQL — Expert Advisor (EA) ที่ส่งออร์เดอร์ถูก ทุกโบรกเกอร์ ทุกครั้ง

> **กฎข้อเดียว:** ทุกออร์เดอร์ผ่านตัวตรวจก่อนส่ง และทุกผลส่งกลับถูกอ่าน · EA ที่ "ทำงานใน tester" แต่ไม่ตรวจ ยังไม่เสร็จ

ใช้กับ EA · indicator · script บน MetaTrader 4 (MT4) และ MetaTrader 5 (MT5) · กลยุทธ์ ความเสี่ยง และเกณฑ์ backtest อยู่ใน spec การเทรดของโปรเจกต์ (ถ้าใช้ชุด prompt ของ repo: `prompt/software-company/prompt-trading-system.md` — ผู้ที่ติดตั้งเฉพาะ plugin จะไม่มีไฟล์นี้ ให้ขอ spec จากเจ้าของ) · หลักทั่วไปอยู่ที่ `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns`

## 1 · เริ่มงาน: รู้ว่าเขียนให้แพลตฟอร์มไหน

- ไฟล์ `.mq4` = MQL4 (MT4) · `.mq5` = MQL5 (MT5) · `.mqh` = include ใช้ร่วมได้ถ้าแยกส่วนที่ต่างไว้หลัง `#ifdef __MQL5__`
- MQL4 ใส่ `#property strict` ทุกไฟล์ (ไม่ใส่ → compiler ปล่อยบั๊กชนิดข้อมูลผ่าน)
- compile และ test ต้องมี terminal (Windows หรือ Wine บน macOS / Linux ที่ MetaQuotes แจก) · เครื่องที่ไม่มี → เขียนในรายงานว่า "ยังไม่ได้ compile" ห้ามบอกว่าผ่าน

| ขั้น | MT5 | MT4 |
|---|---|---|
| compile | `metaeditor64.exe /compile:"MQL5\Experts\X.mq5" /log` | `metaeditor.exe /compile:"MQL4\Experts\X.mq4" /log` |
| ผล compile | ไฟล์ `.log` ข้างไฟล์ต้นทาง · 0 errors 0 warnings | เหมือนกัน |
| backtest จาก command line | `terminal64.exe /config:"tester.ini"` (หัวข้อ `[Tester]`: `Expert` · `Symbol` · `Period` · `FromDate` · `ToDate` · `Model` · `Report` · `ShutdownTerminal=1`) | `terminal.exe` + ไฟล์ config แบบ MT4 (ตัวเลือกน้อยกว่า) |

ตรวจล่าสุด 2026-10-20 · แหล่ง: https://www.metatrader5.com/en/terminal/help/start_advanced/start · ก่อนใช้ให้ตรวจหน้านี้ซ้ำ

## 2 · ความต่างที่ทำให้ port ระหว่าง MT4 กับ MT5 พัง

| เรื่อง | MT4 | MT5 |
|---|---|---|
| โมเดลออร์เดอร์ | ออร์เดอร์ = สถานะ (`OrderSend` · `OrderSelect` · `OrdersTotal`) | แยก order · position · deal · ใช้ `CTrade` (`Trade\Trade.mqh`) |
| บัญชี | hedging เสมอ | netting หรือ hedging → อ่าน `ACCOUNT_MARGIN_MODE` · netting มีได้ 1 position ต่อ symbol |
| วิธีเติมออร์เดอร์ | ไม่มีให้เลือก | FOK / IOC อ่านจาก flag ใน `SYMBOL_FILLING_MODE` (Market / Exchange Execution) · RETURN ใช้ได้ทุกโหมดยกเว้น Market Execution · pending order ใช้ RETURN |
| indicator | คืนค่าทันที (`iMA(...)`) | สร้าง handle ครั้งเดียวใน `OnInit` แล้ว `CopyBuffer` · ปล่อยใน `OnDeinit` |
| ผลส่งออร์เดอร์ | `GetLastError()` (130 stops ผิด · 134 เงินไม่พอ · 138 requote · 146 trade context busy) | `MqlTradeResult.retcode` (10009 done · 10008 placed (pending order) · 10010 done partial = สำเร็จ · 10004 requote · 10014 volume ผิด · 10015 ราคาผิด · 10016 stops ผิด · 10018 ตลาดปิด · 10019 เงินไม่พอ · 10030 filling ผิด) |
| เหตุการณ์ออร์เดอร์ | ไม่มี ต้องไล่ดูเอง | `OnTradeTransaction` |

## 3 · ตัวตรวจก่อนส่งออร์เดอร์ (ทุกออร์เดอร์ ทุกครั้ง)

| ตรวจ | ทำแบบนี้ | ไม่ตรวจแล้วเจอ |
|---|---|---|
| volume | ปัดลงตาม `SYMBOL_VOLUME_STEP` · อยู่ระหว่าง `SYMBOL_VOLUME_MIN` กับ `SYMBOL_VOLUME_MAX` | 10014 · error 131 |
| ราคา | `NormalizeDouble(price, _Digits)` | 10015 |
| Stop Loss (SL) / Take Profit (TP) | ห่างราคาปัจจุบันไม่น้อยกว่า `SYMBOL_TRADE_STOPS_LEVEL` × `_Point` | 10016 · error 130 |
| แก้ออร์เดอร์ | ไม่แก้เมื่อราคาอยู่ในระยะ `SYMBOL_TRADE_FREEZE_LEVEL` · ไม่ส่งค่าเดิมซ้ำ | ถูกปฏิเสธ · 10025 no changes |
| margin | `OrderCalcMargin` (MT5) · `AccountFreeMarginCheck` (MT4) ก่อนส่ง | 10019 · error 134 |
| จำนวนออร์เดอร์ | น้อยกว่า `ACCOUNT_LIMIT_ORDERS` (0 = ไม่จำกัด) | ถูกปฏิเสธ |
| symbol | `SYMBOL_TRADE_MODE` ไม่ใช่ disabled · ตลาดเปิด | 10018 |
| MT5 ทั้งชุด | `OrderCheck()` ก่อน `OrderSend()` | error ที่บอกไม่ได้ว่าข้อไหนผิด |

- ทุกผลส่งกลับต้องอ่าน · requote / off quotes → ลองใหม่ไม่เกิน 3 ครั้ง ราคาใหม่ทุกครั้ง · เงินไม่พอ / stops ผิด → ไม่ลองซ้ำ ลง log แล้วหยุดไม้นั้น
- pip กับ point ไม่เท่ากัน: ราคา 5 ตำแหน่ง (หรือ 3 ตำแหน่งของคู่ JPY) → 1 pip = 10 point · input ที่ผู้ใช้กรอกเป็น pip ให้แปลงที่จุดเดียว

ตัวอย่างโค้ดตัวตรวจแต่ละข้อ → https://www.mql5.com/en/articles/23204 (อ่านแล้วเขียนเอง ไม่ลอกทั้งไฟล์)

## 4 · โครง EA ที่อ่านง่ายและกู้คืนได้

- `OnInit` ตรวจ input ทุกตัว (ค่าผิด → `INIT_PARAMETERS_INCORRECT`) · สร้าง handle · `OnDeinit` ปล่อย handle
- logic หนักทำครั้งเดียวต่อแท่งใหม่ (เทียบ `iTime(_Symbol, _Period, 0)` กับค่าที่จำไว้) ไม่ทำทุก tick
- magic number ต่อ EA + symbol + กลยุทธ์ · นับและจัดการเฉพาะออร์เดอร์ที่ magic ตรง ห้ามแตะออร์เดอร์มือหรือ EA อื่น
- **ไม่เก็บ state สำคัญไว้ในตัวแปรอย่างเดียว:** terminal รีสตาร์ท → state หาย · `OnInit` สร้าง state ใหม่จาก position/order ที่ magic ตรง · ค่าที่สร้างใหม่ไม่ได้ (เช่น ยอดขาดทุนวันนี้) เก็บใน `GlobalVariableSet` หรือไฟล์ใน `MQL5\Files` / `MQL4\Files`
- เวลา: ใช้เวลา server (`TimeCurrent`) ตัดสินแท่งและ session · เวลา server ของแต่ละโบรกเกอร์ไม่เท่ากับเวลาไทย และเลื่อนตาม daylight saving · ใน tester `TimeGMT()` เท่ากับเวลา server จำลองเสมอ (แหล่ง: https://www.mql5.com/en/docs/dateandtime/timegmt) → ตัวกรองข่าวและ session ที่อิง Greenwich Mean Time (GMT) ต้องตั้ง offset เป็น input
- 1 ฟังก์ชัน 1 หน้าที่: สัญญาณ · ขนาดไม้ · ส่งออร์เดอร์ · จัดการออร์เดอร์ที่เปิดอยู่ แยกกัน · สัญญาณเป็นฟังก์ชันบริสุทธิ์ที่รับข้อมูลแท่งแล้วคืนผล (test ได้ใน script)
- log ทุกการตัดสินใจที่ส่งหรือไม่ส่งออร์เดอร์: เวลา server · symbol · เหตุผล · ราคา · spread · ผลส่งกลับ · ไม่ log ทุก tick

## 5 · test

- **script test:** ฟังก์ชันสัญญาณและขนาดไม้ test ด้วย script ที่ป้อนข้อมูลตายตัวแล้วเทียบผล (MQL ไม่มี framework test มาตรฐาน)
- **backtest:** MT5 ใช้โหมด "Every tick based on real ticks" สำหรับผลที่จะใช้ตัดสิน · MT4 รายงาน modelling quality ทุกครั้ง · ค่า spread · commission · swap ตั้งตามบัญชีจริง ไม่ใช่ 0
- **ทดสอบกับหลายสภาพ:** symbol อย่างน้อย 3 ตัวที่ digits ต่างกัน (เช่น EURUSD · USDJPY · XAUUSD) · timeframe อย่างน้อย 2 ตัว · บัญชี netting และ hedging (MT5) · ทุนน้อยจนส่งไม้ขั้นต่ำไม่ได้
- **ไม่ตัดสินจากผลที่ optimize มา:** ใช้ forward period ของ MT5 หรือแบ่ง in-sample / out-of-sample เอง · ตัวเลขที่รายงานคือผลช่วงที่ไม่ได้ใช้ optimize
- `OnTester()` คืนค่าเกณฑ์ที่ spec กำหนด (เช่น profit factor ที่ drawdown ไม่เกินเกณฑ์) เพื่อให้ optimizer เลือกตามเกณฑ์จริง ไม่ใช่กำไรสูงสุด

## 6 · ขายบน MQL5 Market

ตรวจล่าสุด 2026-10-20 · แหล่ง: https://www.metatrader5.com/en/terminal/help/market/market_sell · กฎเปลี่ยนได้ ตรวจซ้ำก่อนส่ง

- ส่งไฟล์ compile แล้วไฟล์เดียว (`.ex5` / `.ex4`) · indicator · เสียง · รูป ฝังเป็น resource · **ห้ามใช้ Dynamic Link Library (DLL)**
- **ห้ามจำกัดตามเลขบัญชีหรือชนิดบัญชี** · Market ล็อกเครื่องและจำนวน activation ให้เอง · ระบบ license ของเรา (ข้อ 7) ใช้ได้เฉพาะช่องทางขายเอง
- การตรวจอัตโนมัติรัน EA ใน tester หลาย symbol และ timeframe · EA ต้องส่งออร์เดอร์ได้จริงในทุกสภาพนั้น (ไม่ส่งเลย = ไม่ผ่าน) · ตัวตรวจข้อ 3 ครบทุกข้อคือสิ่งที่ทำให้ผ่าน
- ห้ามสัญญาผลกำไรในคำบรรยาย · ชื่อสินค้าตัวอักษรละตินไม่เกิน 50 ตัว ไม่มีเลขรุ่น · ระบุถ้าใช้ได้เฉพาะ hedging หรือ netting

## 7 · ความปลอดภัยและการขายเอง

- รหัสผ่านบัญชีเทรด · API key · license key ไม่อยู่ในโค้ดหรือ `.set` · ค่าที่ต้องเก็บใช้ input ที่ผู้ใช้กรอกเองบนเครื่อง
- `WebRequest` ใช้ได้เฉพาะ URL ที่ผู้ใช้เพิ่มใน allow list ของ terminal เอง · บอกในคู่มือว่าต้องเพิ่ม URL ไหน
- ขายเอง (ไม่ผ่าน Market): ล็อก license ด้วยเลขบัญชี (`ACCOUNT_LOGIN`) + วันหมดอายุ ตรวจใน `OnInit` · ไม่ส่ง `.mq4` / `.mq5` ให้ลูกค้า · ไฟล์ `.ex4` / `.ex5` ถอดกลับได้บางส่วน อย่าวางกฎลับไว้ในตัว EA อย่างเดียว

## 8 · รายการตรวจก่อนส่ง

- [ ] compile ได้ 0 errors 0 warnings (หรือรายงานว่ายังไม่ได้ compile เพราะไม่มี terminal)
- [ ] ทุกออร์เดอร์ผ่านตัวตรวจข้อ 3 · ทุกผลส่งกลับถูกอ่านและ log
- [ ] magic number · state สร้างใหม่ได้หลังรีสตาร์ท · ไม่แตะออร์เดอร์ที่ magic ไม่ตรง
- [ ] input ทุกตัวมีค่า default และช่วงที่ตรวจใน `OnInit`
- [ ] backtest ใช้ spread · commission · swap จริง · ผลที่รายงานมาจากช่วงที่ไม่ได้ optimize
- [ ] ทดสอบแล้วอย่างน้อย 3 symbol · 2 timeframe (· netting และ hedging สำหรับ MT5)
- [ ] ขาย Market: ไม่มี DLL · ไม่ล็อกบัญชีหรือ symbol · คำบรรยายไม่สัญญาผลกำไร

## 9 · เชื่อมกับ skill อื่น

สูตรและสถิติ backtest → agent `quant-analyst` · test ทั่วไป → `testing-standards` · log → `logging-standards` · ค่าลับ → `config-and-secrets` · ขั้นตอนเล็กที่ตรวจได้ → `principle-small-verifiable-steps` · ขายและราคา → `prompt/software-company/prompt-sell-product.md` ของ repo (ถ้าใช้ชุด prompt)
