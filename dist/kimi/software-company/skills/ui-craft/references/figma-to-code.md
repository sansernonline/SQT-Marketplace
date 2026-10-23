# Figma เป็นต้นทาง (figma-to-code)

ลูกค้าส่งไฟล์ Figma มา → อ่านผ่านเซิร์ฟเวอร์ Model Context Protocol (MCP) ของ Figma แล้วแปลงเป็น mockup HTML ของเรา · ใช้คู่กับ `SKILL.md` ข้อ 0 (หน้าตาของโปรเจกต์ชนะ) และ token ใน `web-app-design` → `references/tokens.md`
เรื่องเครื่องมือ แผน และโควตา มาจากเอกสารของ Figma ที่เปิดตรวจ 2026-10-23 (ตาราง "ที่มา") · Figma เขียนไว้เองว่าเปลี่ยนโควตาได้ทุกเมื่อ เปิดหน้าเดิมดูอีกครั้งก่อนเสนอแผนให้ลูกค้า

## สารบัญ

1. [ใช้ Figma หรือข้าม](#1--ใช้-figma-หรือข้าม)
2. [Figma MCP server มี 2 แบบ](#2--figma-mcp-server-มี-2-แบบ)
3. [ลำดับดึงของ ทีละหน้าจอ](#3--ลำดับดึงของ-ทีละหน้าจอ)
4. [variables → token ของเรา](#4--variables--token-ของเรา)
5. [component → mockup HTML](#5--component--mockup-html)
6. [ตรวจด้วยตาหลังแปลง](#6--ตรวจด้วยตาหลังแปลง)
7. [ข้อห้าม](#7--ข้อห้าม) · [ที่มา](#ที่มา)

## 1 · ใช้ Figma หรือข้าม

| ไฟล์ที่ได้มา | ทำ |
|---|---|
| ใช้ component · variables · auto layout · ตั้งชื่อ layer ชัด | ดึงผ่าน MCP ตามข้อ 3–5 |
| ภาพวาดแบน (ชื่อ `Frame1268` `Group5` · ไม่มี variables · วางตำแหน่งตายตัว) | ข้าม MCP · export ภาพไว้ที่ `_to_delete/figma-shots/` ใช้เป็นแอปอ้างอิงตามข้อ 0.1 แล้ววาด mockup เอง |
| ได้แค่ลิงก์ดู บัญชีเราไม่มีสิทธิ์ในไฟล์ | MCP อ่านได้เฉพาะไฟล์ที่บัญชีเรามีสิทธิ์ · ขอให้ลูกค้าเชิญเข้าไฟล์ หรือขอ export |
| โปรเจกต์มี mockup หรือโค้ดที่ส่งมอบแล้ว | หน้าตาเดิมชนะ (ข้อ 0) · ใช้ Figma ดูแค่ว่ามีหน้าไหนเพิ่ม |
| ต้องการแค่สีและฟอนต์ | ขอ style guide หรือค่าสีจากผู้ออกแบบ ไม่ต้องตั้ง MCP |
| บัญชีที่ใช้ได้มีแค่ที่นั่ง View หรือ Collab | โควตา 20 ครั้งต่อเดือน (ข้อ 2) · ลำดับในข้อ 3 ใช้ราว 4–6 ครั้งต่อหน้าจอ จึงพอดูได้ไม่กี่หน้า · ขอที่นั่ง Dev หรือขอภาพ export แทน |

## 2 · Figma MCP server มี 2 แบบ

ชื่อทางการตอนนี้คือ "Figma MCP server" · เป็นช่องทางที่ให้ agent เรียกเครื่องมือของ Figma ได้

| | remote (Figma แนะนำ) | desktop |
|---|---|---|
| ที่อยู่ | `https://mcp.figma.com/mcp` ไม่ต้องเปิดแอป | `http://127.0.0.1:3845/mcp` ผ่านแอป Figma desktop: เปิดไฟล์ → Dev Mode โดยไม่เลือกอะไร → Enable desktop MCP server |
| แผนและที่นั่ง | ทุกแผน: Starter · Professional · Education · Organization · Government · Enterprise | ที่นั่ง Dev หรือ Full บนแผน Professional · Education · Organization · Government · Enterprise |
| เขียนกลับลง canvas | ได้ · นอก drafts ต้องที่นั่ง Full · ฟรีช่วง beta แล้วจะคิดเงินตามการใช้ | ไม่ได้ |
| ต่อ Claude Code | `claude plugin install figma@claude-plugins-official` (ได้ skill ของ Figma มาด้วย) หรือ `claude mcp add --transport http figma https://mcp.figma.com/mcp` แล้ว `/mcp` → Authenticate → Allow access ในเบราว์เซอร์ | `claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp` แล้วเปิด Claude Code ใหม่ |
| หมายเหตุ | ต่อได้เฉพาะ client ที่อยู่ใน Figma MCP catalog | Figma for Government ใช้ได้แบบนี้แบบเดียว |

โควตาของเครื่องมืออ่าน ใช้กับทั้ง 2 แบบ (เครื่องมือเขียน เช่น `add_code_connect_map` `create_new_file` `generate_figma_design` และ `whoami` ไม่นับ)

| ที่นั่ง | Starter | Professional · Education | Organization | Enterprise |
|---|---|---|---|---|
| View · Collab | 20 ครั้ง/เดือน | 20 ครั้ง/เดือน | 20 ครั้ง/เดือน | 20 ครั้ง/เดือน |
| Dev · Full | ไม่มี | 200 ครั้ง/วัน · 10 ครั้ง/นาที | 200 ครั้ง/วัน · 15 ครั้ง/นาที | 600 ครั้ง/วัน · 20 ครั้ง/นาที |

## 3 · ลำดับดึงของ ทีละหน้าจอ

1. `get_metadata` ดึงโครงร่างย่อของ frame ก่อน · frame ใหญ่ทำให้ช้า error หรือได้ผลไม่ครบ จึงเลือกทีละส่วน (การ์ด · แถบหัว · แถบข้าง)
2. `get_screenshot` ถ่ายภาพส่วนนั้น เก็บไว้ `_to_delete/figma-shots/` สำหรับเทียบด้วยตาในข้อ 6
3. `get_variable_defs` ดึง variables และ styles ที่ส่วนนั้นใช้ · สั่งตรง ๆ ว่า "ขอชื่อและค่าของ variables" เพราะ agent เลือกเครื่องมือจากคำสั่ง สั่งกว้างอาจได้โค้ดมาแทน
4. `get_design_context` ดึงโค้ดของส่วนนั้น · ขอเป็น "plain HTML + CSS" เพราะค่าตั้งต้นคือ React + Tailwind
5. ลูกค้ามี library → `search_design_system` หา component · variables · styles ที่มีอยู่แล้วก่อนสร้างใหม่

ต้องการ variables ทั้งไฟล์: Variables REST API ใช้ได้เฉพาะที่นั่ง Full ในแผน Enterprise · แผนอื่นดึงทีละส่วนด้วย `get_variable_defs` แล้วรวมเอง

## 4 · variables → token ของเรา

เขียนค่าลง `:root` ของไฟล์ css ที่ mockup `<link>` อยู่ ที่เดียว (ข้อ 0) · ใส่ชื่อ variable ของ Figma เป็น comment ข้างค่าให้ย้อนหาได้ · คอมโพเนนต์ใช้ `var(--…)` เท่านั้น

| ใน Figma | token ของเรา | ระวัง |
|---|---|---|
| สีปุ่มหลัก · ลิงก์ · แท็บที่เลือก | `--brand` | ต้องผ่าน 4.5:1 (ข้อ 5) · ไม่ผ่านให้ปรับเฉด แล้วจดใต้ **ตัดสินใจเอง** |
| พื้นหน้า · พื้นการ์ด | `--bg` · `--surface` | การ์ดต่างจากพื้น 2–4% (ข้อ 4) |
| เส้น | `--line` · `--line-strong` | เส้นอ่อนกว่าที่คิด |
| มุมโค้ง | `--radius` · `--radius-sm` · `--radius-pill` | 2–3 ค่า · ของข้างในโค้งน้อยกว่าข้างนอก |
| ระยะห่าง | สเกล 4 8 12 16 24 32 48 64 (ข้อ 1) | ค่านอกสเกลปัดเข้าค่าที่ใกล้สุด แล้วจด |
| ขนาดตัวอักษร | 5 ขนาด (ข้อ 2) | ไฟล์มีเกิน 5 ขนาด → รวบ |
| ฟอนต์ | `--font` | ฟอนต์ที่ไม่มีอักษรไทยต้องต่อท้ายด้วย `Noto Sans Thai` |
| เงา | `--shadow` · `--shadow-lg` | ใช้กับของที่ลอยจริง · การ์ดนิ่งไม่มีเงา |
| สีกราฟ · pill สถานะ | ชุดสีข้อมูลและ pill ใน `tokens.md` | สีบอกสถานะต้องมีไอคอนหรือข้อความคู่ |

## 5 · component → mockup HTML

- **mockup ก่อนเสมอ** (ข้อ 0): หน้าใหม่ = `<section>` ใหม่ในไฟล์ `mockup/<รหัส>-mockup.html` เดิม ไม่ใช่โปรเจกต์ React
- โค้ดจาก `get_design_context` เป็นวัตถุดิบ เก็บโครง (ลำดับ · กลุ่ม · ข้อความ) ทิ้ง class ของ Tailwind แล้วใช้ class ที่ mockup มีอยู่ (ปุ่ม · การ์ด · ตาราง · pill)
- component ที่ซ้ำ ทำเป็น class ครั้งเดียว ไม่คัดลอกโค้ดต่อ instance
- ภาพจริงจาก Figma ดึงด้วย `download_assets` (remote เท่านั้น) · ไอคอนใช้ชุดของแพลตฟอร์ม
- ข้อความตัวอย่าง: ของ Figma สมจริงก็ใช้ · เป็น Lorem หรือ "Text" ให้แทนด้วยข้อมูลจริงตามข้อ 0.1
- 5 สถานะ (ข้อ 6): สถานะที่ Figma ไม่มี ให้วาดเพิ่มเอง แล้วจดว่า "ไม่มีใน Figma" ในกล่องควบคุมของ mockup
- ลูกค้าผูก component กับโค้ดจริงด้วย Code Connect อยู่แล้ว → `get_code_connect_map` บอกว่า component ไหนคู่กับโค้ดตัวไหน ใช้ตอนเขียนโค้ดจริง ไม่ใช่ตอนทำ mockup

## 6 · ตรวจด้วยตาหลังแปลง

| ตรวจ | วิธี |
|---|---|
| ภาพรวมตรงกับ Figma | ถ่าย mockup ที่ความกว้างเท่า frame วางเคียงภาพจาก `get_screenshot` |
| ฟอนต์ไทย | เบราว์เซอร์อาจใช้ฟอนต์สำรองแทนฟอนต์ใน Figma → ดูสระและวรรณยุกต์ลอย ตัดบรรทัดผิด |
| ข้อความยาว | ใส่ข้อความไทยที่ยาวที่สุดของจริง ดูว่าไม่ล้นปุ่มและหัวตาราง |
| ย่อจอ | auto layout ใน Figma ไม่ใช่ responsive ของเรา → ย่อจอ 3 ขนาด |
| contrast · ปุ่มทึบ 1 ปุ่ม · ระยะในสเกล | เช็กลิสต์ข้อ 9 |
| ด่านสวย | ข้อ 9 · ใช้ภาพ Figma เป็นภาพแอปอ้างอิงขนาดเดียวกัน |

## 7 · ข้อห้าม

- ส่งโค้ด React + Tailwind จาก MCP เป็น mockup ตรง ๆ
- ค่าสีหรือระยะดิบจาก Figma ในคอมโพเนนต์
- ดึง frame ทั้งหน้าขนาดใหญ่ในครั้งเดียว
- ทำทั้งระบบด้วยที่นั่ง View หรือ Collab แล้วโควตาหมดกลางทาง
- ใส่รหัสผ่านหรือ token ของ Figma ลง repo (การเชื่อมต่อใช้การเข้าสู่ระบบผ่านเบราว์เซอร์)

## ที่มา

| เรื่อง | URL (เปิดตรวจ 2026-10-23) |
|---|---|
| ชื่อ · remote กับ desktop · แผนที่ใช้ได้ | https://developers.figma.com/docs/figma-mcp-server/ · https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server |
| ต่อ Claude Code แบบ remote | https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/ |
| desktop server | https://developers.figma.com/docs/figma-mcp-server/local-server-installation/ |
| โควตา | https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/ |
| รายชื่อเครื่องมือ · ค่าตั้งต้น React + Tailwind | https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/ |
| frame ใหญ่ · agent เลือกเครื่องมือผิด · จัดไฟล์ให้ได้ผลดี | https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/ · .../variables-vs-code/ · .../structure-figma-file/ |
| Variables REST API (Enterprise) | https://developers.figma.com/docs/rest-api/variables/ |
