# ตรวจงาน วิจารณ์ ข้อห้าม และข้อจำกัด — ส่วนขยายของ `windows-app-design`

เปิดตอนทำข้อ 6 · 7 · 8 ของ `SKILL.md`

## คำสั่งตัวตรวจ token (ข้อ 6)

```bash
# ไฟล์ token แยก (web-wrapped · mockup ที่ยังวางคู่ fluent.css)
node ../web-app-design/scripts/check-design-tokens.mjs src/fluent.css src --ext html,css,ts,tsx \
  --marker "Type ramp" \
  --require "--win-bg,--win-layer,--win-card,--win-text,--win-text-secondary,--win-accent,--win-on-accent,--win-divider,--win-control-stroke,--win-radius,--win-radius-card,--win-font,--win-nav-w,--win-titlebar-h,--win-gutter"
# mockup ไฟล์เดียว: ใช้ไฟล์ mockup เป็นไฟล์ token เอง (token ฝังอยู่ใน <style>) · --require ชุดเดิม
node ../web-app-design/scripts/check-design-tokens.mjs mockup/<รหัส>-mockup.html mockup --ext html --marker "Type ramp" --require "…"
```

  แอปเพิ่ม token ของตัวเอง (เช่น `--telex-…`) → ต่อท้าย `--require` ด้วย · ตั้งชื่อ section ในหน้า mockup ขึ้นต้น `s-` (`#s-login`) ไม่ให้ชื่ออย่าง `#add` `#feed` ถูกอ่านเป็นสี

## ข้อความสั่งงานผู้วิจารณ์ (ข้อ 6.1)

```
ดูภาพ <path dark/light> ของแอป Windows 11 (<ชนิดแอป>) เป้าคือดูเหมือน Windows Terminal / Settings / File Explorer
บอกปัญหาที่สำคัญที่สุด 2–3 ข้อต่อหน้า (ลำดับสายตา ระยะ แนว contrast ความหนาแน่น อะไรที่ดูเป็นเว็บ)
แต่ละข้อมีวิธีแก้ระดับ CSS (ขนาด px · องค์ประกอบไหน) · ไม่ต้องชม · ไม่เกิน 250 คำ
```

## Anti-patterns (ข้อ 7)

- ❌ **ระบายพื้น accent ทั้งแถวเมนูที่เลือก** — Windows ใช้ขีดเล็กชิดซ้าย
- ❌ **ย้อมสีแบรนด์ที่กรอบหน้าต่าง** (แถบชื่อ · nav · rail · command bar · Mica/Acrylic · เส้นขอบ · ไอคอนเมนู) — กรอบเป็นเทา-ดำตามธีม Windows · accent อยู่ที่ขีดเลือก ปุ่มหลัก และข้อมูล · ย้อมได้เฉพาะเมื่อผู้ใช้สั่ง
- ❌ **มุมโค้ง 12–16px** — นั่นคือหน้าตาเว็บ/มือถือ ส่วน Windows ใช้ 4px กับ 8px
- ❌ **เงาใต้การ์ด** — Windows 11 ใช้เส้นขอบบาง ๆ เงาสงวนไว้ให้ flyout/dialog เท่านั้น
- ❌ **`alert()` / `confirm()`** ในแอปที่ห่อเว็บ — ใช้ InfoBar หรือ ContentDialog
- ❌ **ทำเฉพาะโหมดมืดเพราะภาพต้นแบบเป็นมืด** — Windows 11 ตั้งต้นเป็นโหมดสว่าง และผู้ใช้เลือกได้ทั้งสองแบบ ต้องผ่านทั้งคู่
- ❌ **ฮาร์ดโค้ดสี accent เป็นน้ำเงิน** — ถ้าอยากตามสีที่ผู้ใช้ตั้งไว้ ต้องอ่านจากระบบ
  (WinUI: อย่า override `AccentFillColorDefaultBrush` · web: `AccentColor` ของ CSS)
- ❌ **แถบเมนูกว้างตามใจ** — 320px เปิด / 48px ย่อ เท่านั้น
- ❌ **ส่ง mockup โดยไม่เคยเรนเดอร์ดู** — ดูข้อ 6
- ❌ **ปุ่มทึบสี accent ทุกแถวของตาราง** — ปุ่มในแถวเป็นไอคอนที่โผล่เมื่อชี้ ปุ่มหลักอยู่ในแผงรายละเอียด (patterns.md ข้อ 1)
- ❌ **ปุ่มและเมนูเป็นข้อความล้วน ไม่มีไอคอน** — ดูเป็น wireframe
- ❌ **เนื้อหาอยู่ครึ่งบน ครึ่งล่างว่าง · ตารางยืดเต็มจอจนคอลัมน์ห่างกัน 400px** — ใช้ list-detail (patterns.md ข้อ 2)
- ❌ **หัวกลุ่ม 11px ตัวพิมพ์ใหญ่ · ป้ายพื้นสีทึบใน status bar · เส้นสีบน tab** — เป็นแบบเว็บ
- ❌ **การ์ดใหญ่หลายใบเรียงกันในหน้าเริ่มต้นของแอป** — ดูเป็น dashboard ของ SaaS ใช้แถวปุ่มทางลัดแทน (หน้าแรกของ mockup ไม่นับ ดู `ui-craft`)
- ❌ **แถบควบคุมของ mockup (รหัสข้อกำหนดเชิงหน้าที่ (Functional Requirement · FR) · ตัวสลับสถานะ) ติดในภาพที่ส่งรีวิว** — ใช้ `screenshot.py --hide`
- ❌ **ทำทุกหน้าในรอบเดียวโดยไม่มีหน้าหลักเป็นแบบ** — ดูข้อ 1

## ข้อจำกัดที่ต้องรู้ (ข้อ 8)

- ไฟล์ `.xaml` / `.axaml` ในนี้ **ยังไม่ผ่านการคอมไพล์ทดสอบ** ในไฟล์มีแต่ค่า token
  (Color / SolidColorBrush / x:Double / CornerRadius / Thickness) ที่ใช้ไวยากรณ์
  มาตรฐาน ตอน build ครั้งแรกให้ดูว่ามี key ไหนชนกับของเฟรมเวิร์กหรือไม่
- WinUI ต้องเมิร์จ `FluentTokens.xaml` **หลัง** `XamlControlsResources` ไม่งั้นค่าถูกทับ
- ชื่อ theme dictionary ต่างกัน: WinUI ใช้ `Default`/`Light`/`HighContrast`
  ส่วน Avalonia ใช้ `Default`/`Light`/`Dark`
- **โหมดคอนทราสต์สูง** ห้ามใส่สีตายตัว ต้องดึงจากสีระบบ (มีตัวอย่างในไฟล์ XAML)
- Mica / Acrylic ทำได้จริงเฉพาะ WinUI/Avalonia บน Windows ส่วนบน web-wrapped
  ให้ใช้สีทึบตาม token แทน อย่าเลียนแบบด้วย `backdrop-filter` เพราะได้ไม่เหมือน
  และกินเครื่อง
