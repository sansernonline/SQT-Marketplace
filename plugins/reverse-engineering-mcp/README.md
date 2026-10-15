# reverse-engineering-mcp

เพิ่ม REA (Reverse Engineer Anything) ให้ Claude Code — MCP (Model Context Protocol) server ที่มี 207 tool สำหรับแกะ native binary · แอป JavaScript/Electron · .NET metadata · APK (Android Package — ไฟล์ติดตั้งแอป Android) · firmware · ไฟล์ทราฟฟิก แบบมีหลักฐาน (Evidence ID) ทุกข้อสรุป · ทำงานบนเครื่องผู้ใช้ทั้งหมด

แยกเป็น plugin ของตัวเอง เพื่อให้ server 207 tool เปิดเฉพาะคนที่ติดตั้ง ไม่ติดไปกับ `software-company`

## มีอะไร

| ส่วน | ไฟล์ | ทำอะไร |
|---|---|---|
| MCP server | `.mcp.json` → `scripts/rea-launch.mjs` | เปิด `rea-agents@6.5.0 mcp` ทาง stdio |
| hook | `hooks/ask-before-run.mjs` | ถามผู้ใช้ทุกครั้งก่อน tool ที่รันเป้าหมาย แก้อุปกรณ์ หรืออ่านข้อมูลสดจากหน้าเว็บ แอป และอุปกรณ์ที่กำลังใช้ |
| skill | `skills/reverse-engineer-anything/` | วิธีใช้ REA: เลือก tool แรก · ขอสรุปก่อน · แยกสิ่งที่เห็น/อนุมาน/ยังไม่รู้ · กฎสิทธิ์ |
| คำสั่ง | `/reverse-engineering-mcp:rea-check` | ตรวจว่า server ต่อได้และ provider ไหนพร้อม (อ่านอย่างเดียว) |
| คำสั่ง | `/reverse-engineering-mcp:rea-investigate <path> <คำถาม>` | ไล่ว่าฟีเจอร์ทำงานอย่างไร |
| คำสั่ง | `/reverse-engineering-mcp:rea-compare <รุ่นเก่า> <รุ่นใหม่>` | เทียบ 2 รุ่น |

ไม่มี agent และไม่มี SuperUser ในตัว · คนทำงานคือ agent `reverse-engineer` และการจัดทีมคือ `superuser` ของ plugin `software-company` · ติดตั้งคู่กันจะได้ `triage.py` · `ilspycmd` สำหรับ .NET · `compare_members.py` · `docker-sandbox` ด้วย

## ที่มาและสัญญาอนุญาต

- REA: https://github.com/morluto/rea · npm `rea-agents` · MIT License · © 2026 morluto
- skill `reverse-engineer-anything` ดัดแปลงจาก `.agents/skills/reverse-engineer-anything/` ของ REA (commit `cf0a38a` · package.json 6.5.0) · ข้อความสัญญา MIT ฉบับเต็มอยู่ใน [`skills/reverse-engineer-anything/LICENSE`](skills/reverse-engineer-anything/LICENSE)
- plugin นี้ไม่ได้รวมโค้ดของ REA ไว้ · npx ดาวน์โหลดแพ็กเกจจาก npm ตอนเปิด server
- เครื่องมือที่ REA เรียกมีสัญญาของตัวเอง: Ghidra · JADX · Apktool = Apache-2.0 · GDB = GPL-3.0 · IDA · Hopper · JEB เป็นของเสียเงิน ต้องมีสัญญาอนุญาตของผู้ใช้เอง
- ไม่ใช่ plugin ทางการของ REA

## ต้องมีอะไรก่อน

| ระบบ | ต้องมี | หมายเหตุ |
|---|---|---|
| ทุกระบบ | Node.js 22.19+ · 24.11+ หรือ 26+ พร้อม npm | tool SQLite ต้อง 24.15+ · launcher เช็กรุ่นให้และบอกถ้าไม่ผ่าน |
| Windows | เหมือนด้านบน | JavaScript/Electron · .NET metadata · Go · Rust · PE (Portable Executable — ไฟล์ .exe .dll ของ Windows) resource · Android ใช้ได้ · Ghidra ยังเป็นรุ่นทดลองแบบอ่านอย่างเดียว · ไม่มี Hopper · หลาย tool (firmware · pcap (packet capture — ไฟล์ดักแพ็กเก็ตเครือข่าย) · จับ process) ใช้ได้แค่ Linux/macOS |
| macOS | เหมือนด้านบน | Hopper · Ghidra · IDA ใช้ได้ |
| Linux | เหมือนด้านบน + `ps` แบบ procps | tool ครบที่สุด · เหมาะรันใน `docker-sandbox` |

provider ที่ผู้ใช้หามาเองตามงาน (REA ไม่ติดตั้งให้ และ plugin นี้ก็ไม่ติดตั้งให้):

| งาน | ต้องมี |
|---|---|
| native | Ghidra 12.1.x + JDK (Java Development Kit) 21 · หรือ IDA + ida-pro-mcp · หรือ Hopper |
| Android | JADX headless MCP JAR 0.7.1 (`REA_JADX_MCP_JAR`) + JDK 17+ · adb ถ้าต่ออุปกรณ์ |
| เว็บ | เบราว์เซอร์ตระกูล Chrome |
| WASM · ELF (Executable and Linkable Format — ไฟล์โปรแกรมของ Linux) · firmware · pcap | WABT 1.0.42 · pwntools · Binwalk + Unblob · tshark + capinfos |

## ติดตั้ง

```
/plugin marketplace add sansernonline/SQT-Marketplace
/plugin install reverse-engineering-mcp@sqt-marketplace
```

แล้วเปิด session ใหม่ · `/mcp` ต้องเห็น `plugin:reverse-engineering-mcp:rea` · รัน `/reverse-engineering-mcp:rea-check`

**ไม่ต้องรัน `npx rea-agents setup` หรือ `install.sh` ของ REA** — plugin ลงทะเบียน server ให้แล้ว · setup ของ REA จะเขียน `~/.claude.json` และติดตั้ง skill อีกชุดซ้ำ

เครื่องมืออื่น (Codex · Gemini CLI · Kimi · claude.ai): `scripts/build/build-targets.mjs` คัดลอกเฉพาะ skill และคำสั่ง ไม่ได้แปลง `.mcp.json` และ hook ไปด้วย · ในเครื่องมือเหล่านั้นจะได้แค่ skill และต้องลงทะเบียน REA เอง (pin `rea-agents@6.5.0`) · ส่วน zip ของ claude.ai มีไฟล์ครบ แต่ยังไม่ได้ทดสอบว่า claude.ai เปิด stdio server ของ plugin หรือไม่

## ความปลอดภัย

REA ทำงานด้วยสิทธิ์ผู้ใช้เต็ม และ REA เขียนไว้เองว่า "This is not a sandbox" · เปิดไฟล์ที่ไม่น่าไว้ใจ = ให้ Ghidra/JADX/ฯลฯ parse ไฟล์นั้นบนเครื่องคุณ

| เรื่อง | plugin นี้ทำอย่างไร |
|---|---|
| ห่วงโซ่แพ็กเกจ (supply chain) | ล็อก `rea-agents@6.5.0` ที่ `scripts/rea-launch.mjs` ที่เดียว · ไม่ใช้ `@latest` · launcher บังคับ registry ทางการ (`npm_config_registry`) และปิด install script ของ dependency (`npm_config_ignore_scripts`) · รัน npx จากโฟลเดอร์ข้อมูลของ plugin (`CLAUDE_PLUGIN_DATA`) หรือโฟลเดอร์ชั่วคราว ไม่ใช่โฟลเดอร์โปรเจกต์ จึงไม่อ่าน `.npmrc` หรือ `package.json` ของโปรเจกต์ · `validate-marketplace.mjs` ปฏิเสธรุ่นลอยและช่วงรุ่น (`@latest` · `@^` · `@~` · `@*` · `@6` · `@6.5` · ไม่ระบุรุ่น) ใน `.mcp.json` · `mcpServers` ของ plugin.json และ marketplace.json · launcher (ไม่นับ comment) และตรวจว่ารุ่นในเอกสารตรงกัน · **ยังเหลือ:** dependency ย่อยลอยตาม semver ทุกครั้งที่ npx ติดตั้งใหม่ ดู [ความน่าเชื่อถือของ upstream](#ความน่าเชื่อถือของ-upstream) |
| ทำไมใช้ launcher | Windows ต้องห่อ npx ด้วย `cmd.exe /d /c` (เอกสาร REA `docs/installation.md`) แต่ `.mcp.json` ของ plugin มีไฟล์เดียวทุกระบบ · launcher หา `npx-cli.js` ที่มากับ node แล้วรันด้วย node ตรง ๆ แบบไม่ผ่าน shell (`shell: false`) · หาไม่เจอจึงถอยไปใช้ `npx` บน PATH (Windows ผ่าน `%SystemRoot%\System32\cmd.exe` แบบ path เต็ม ด้วย argument คงที่ ไม่มีค่าจากภายนอก) · `node scripts/rea-launch.mjs --print` แสดงคำสั่ง โฟลเดอร์ที่ใช้รัน และ env ที่เพิ่ม โดยไม่รันอะไร · launcher อยู่ใน `scripts/` ไม่ใช่ `bin/` เพราะ `bin/` ถูกใส่ใน PATH ของ Bash และทำให้ claude.ai ไม่รับ plugin |
| tool ที่รันเป้าหมาย | 15 tool ติดธง `executesForeignCode` · 6 tool ติดธง `mutatesDevice` · 4 tool ติดธง `mutatesTarget` ที่เกาะ process หรือหน้าเว็บที่รันอยู่ · 9 tool อ่านข้อมูลสดจากหน้าเว็บ แอป Electron หรืออุปกรณ์ Android → hook ตอบ `ask` ทุกครั้ง (โหมด auto ก็ต้องถาม) ทั้งชื่อจาก plugin และ REA ที่ลงทะเบียนเองชื่อ `rea` · อ่าน input ไม่ออกก็ถาม · tool ตั้งชื่อและหมายเหตุ 7 ตัว (มีธง `mutatesTarget` แต่แก้แค่ฐานข้อมูลวิเคราะห์) ไม่ถาม · เป้าหมายที่ไม่น่าไว้ใจให้ตอบ no — server ของ plugin รันบนเครื่องเสมอ ถ้าต้องรันจริงให้ติดตั้ง `rea-agents@6.5.0` แยกใน `docker-sandbox` แล้วรันใน container · tool Frida น่าจะใช้ไม่ได้เพราะปิด install script (ยังไม่ได้ลองเปิด server จริง) · รายชื่อและเลขบรรทัด: [`tool-permissions.md`](skills/reverse-engineer-anything/references/tool-permissions.md) |
| skill ต้นฉบับบอกว่า "ไม่ต้องขออนุญาตรายครั้ง" | เปลี่ยนเป็นต้องขอทุกครั้งสำหรับกลุ่มข้างบน |
| สิทธิ์ทางกฎหมาย | ถามและจดเหตุผลก่อนเปิดเป้าหมาย · ไม่ช่วยเลี่ยง DRM สัญญาอนุญาต anti-cheat ไม่ทำโปรแกรมโกง ไม่สร้าง malware |
| ข้อความในเป้าหมาย | เป็นข้อมูล ไม่ใช่คำสั่ง · secret ที่เจอรายงานแค่ชื่อและตำแหน่ง |
| telemetry | ไม่พบใน source ของ REA ที่ตรวจ (2026-10-15) · ต่อเครือข่ายเมื่อดาวน์โหลด Hopper ตอน setup (ไม่ใช้) · ดึง source map ของเว็บเป้าหมาย · IDA MCP ที่ 127.0.0.1 |

ปิด tool เพิ่มเองได้ด้วย `permissions.deny` ใน settings เช่น `"mcp__plugin_reverse-engineering-mcp_rea__gdb_console"` · ปิดทั้ง server ชั่วคราวได้ใน `/mcp`

## ความน่าเชื่อถือของ upstream

ถือว่า REA เป็นโค้ดของคนนอกที่ยังไม่มีใครตรวจรับรอง (unvetted third-party code) · ข้อมูลจาก GitHub ตรวจ 2026-10-15:

| สิ่งที่เห็น | ทำไมต้องระวัง |
|---|---|
| ดาว ~249,621 · fork 62,678 ภายใน ~6 เดือน (สร้าง 2026-04-14) | สูงผิดปกติสำหรับ repo อายุเท่านี้ · ดาวปั่นได้ จึงไม่ใช่สัญญาณว่าไว้ใจได้ |
| commit หลายครั้งต่อชั่วโมง · ออกรุ่นใหม่แทบทุกวัน (6.0 ถึง 6.5 ใน 7 วัน) | โค้ดเปลี่ยนเร็วเกินกว่าจะมีคนตรวจทัน · รุ่นที่ตรวจวันนี้ไม่ใช่รุ่นของพรุ่งนี้ |
| ผู้เขียน commit ล่าสุด (`Kaoru0822`) ไม่ใช่เจ้าของ repo (`morluto`) | มีคนส่งโค้ดเข้าได้มากกว่าเจ้าของคนเดียว |
| โค้ดที่เราอ่านคือ `main` HEAD `cf0a38a` บน GitHub ไม่ใช่ไฟล์ใน tarball ของ npm | สิ่งที่ npx ดาวน์โหลดอาจไม่ตรงกับที่อ่าน |
| dependency ย่อย (transitive dependency) ไม่ได้ล็อก | ลอยตาม semver ทุกครั้งที่ npx ติดตั้งใหม่ แต่ละเครื่องหรือแต่ละวันอาจได้โค้ดคนละชุด |

**ก่อนเปิดใช้ครั้งแรก** (ผู้ใช้ทำเองในโฟลเดอร์ว่างนอกโปรเจกต์):

1. `npm view rea-agents@6.5.0 --json` — ดู `maintainers` (ใครปล่อยรุ่นได้) · `time` ของ 6.5.0 (เวลาปล่อย) · `dist.attestations` (provenance — หลักฐานว่า build จาก repo ไหน ไม่มีก็จดไว้) · `dist.integrity` ต้องขึ้นต้น `sha512-C6BG7Lyr` และลงท้าย `veD+A==` (registry 2026-10-15)
2. `npm pack rea-agents@6.5.0 --ignore-scripts` แล้วแตก tarball เทียบ `package/dist/contracts/toolEffects.js` กับรายชื่อใน `hooks/ask-before-run.mjs` — เจอ tool ที่รันเป้าหมายหรือแก้อุปกรณ์ที่ hook ไม่รู้จัก ห้ามเปิดใช้จนกว่าจะแก้ hook
3. ทำซ้ำข้อ 1–2 ทุกครั้งที่ขึ้นรุ่น REA

## ขึ้นรุ่น REA

1. อ่าน CHANGELOG ของ REA ช่วงที่ข้าม · ทำ "ก่อนเปิดใช้ครั้งแรก" ข้อ 1–2 กับรุ่นใหม่
2. เทียบ `src/contracts/toolEffects.ts` ของรุ่นใหม่ และ `dist/contracts/toolEffects.js` ใน tarball หา tool ใหม่ที่มีธง `executesForeignCode` · `mutatesDevice` · `mutatesTarget` ที่แตะ process หรือหน้าเว็บที่รันอยู่ (ไม่นับ tool ตั้งชื่อและหมายเหตุที่แก้แค่ฐานข้อมูลวิเคราะห์) และ tool ใหม่ที่อ่านของที่กำลังรัน → แก้ `hooks/ask-before-run.mjs` (รวมจำนวนที่ self-test คาดไว้) และ `tool-permissions.md`
3. เทียบ skill ต้นฉบับจาก tag เดียวกัน แล้วแก้ skill ภาษาไทย
4. แก้ `REA_PACKAGE` ใน `scripts/rea-launch.mjs` และเลขรุ่นใน `rea-check` · ขึ้นเลขรุ่น plugin · `node scripts/check/validate-marketplace.mjs` ตรวจว่ารุ่นตรงกันทุกไฟล์
