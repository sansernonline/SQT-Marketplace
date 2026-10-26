# ค้นหมวดก่อนออกแบบไอคอนแบรนด์

นักออกแบบไม่เริ่มจากกระดาษเปล่า แต่เริ่มจากดูว่าของในหมวดเดียวกันหน้าตาเป็นอย่างไร ใช้กฎอะไร และอะไรที่ใช้กันจนเฝือ · ไฟล์นี้คือผลค้นรอบแรก (เปิดอ่าน 2026-10-26) ใช้เป็นจุดเริ่ม แต่ละงานต้องค้นหมวดของตัวเองเพิ่ม

## 1 · ค้นอะไรบ้าง (ทำทุกงาน ใช้เวลาไม่นาน)

| ค้น | ตัวอย่างคำค้นหรือที่ดู | ได้อะไร |
|---|---|---|
| ร้านหรือหน้ารายการที่ไอคอนจะไปอยู่ | Raycast Store · VS Code Marketplace · JetBrains Marketplace · Chrome Web Store · App Store หมวดเดียวกัน | ขนาด กรอบ พื้นมืดหรือสว่าง และหน้าตาของเพื่อนบ้านที่จะวางข้างกัน |
| กฎทางการของปลายทาง | หน้า guideline ของร้านนั้น (ตารางข้อ 3) | ข้อห้ามที่ทำให้ถูกปฏิเสธ |
| ตระกูลไอคอนที่มีหลายตัวแต่ดูเป็นชุด | ชุดแอปของ Microsoft · Adobe · Atlassian · JetBrains · Google | วิธีผูกให้เป็นชุด (ข้อ 2) |
| บทความ redesign ที่นักออกแบบระบุชื่อ | "behind the design" + ชื่อแบรนด์ · "new icons" + ปี | วิธีคิดและบทเรียน ไม่ใช่แค่รูป |
| แนวที่ใช้กันจนเฝือในหมวดนั้น | "AI logo trend" · "<หมวด> icon cliché" | สิ่งที่ต้องเลี่ยง (ข้อ 4) |

ผลส่งผู้ใช้เป็นลิงก์ให้กดดูเอง ไม่คัดลอกรูปแบรนด์อื่นมาเก็บหรือใส่งาน · อ่านแค่ข้อความยังไม่พอ ถ้ามีเครื่องมือจับภาพหน้าจอ ให้เปิดดูหน้าตาจริงก่อนสรุปแนว

## 2 · วิธีผูกไอคอนหลายตัวให้เป็นชุด

| วิธี | ตัวอย่าง | ระวัง |
|---|---|---|
| รูปทรงและผิวเหมือนกัน ต่างที่สี | Microsoft 365 ชุด 2025 (ต้นแบบคือไอคอน Copilot · Jon Friedman 2025-10-01) | สีอย่างเดียวแยกตัวไม่พอสำหรับคนตาบอดสี |
| กรอบเดียวกัน ใส่อักษรย่อ | Adobe Creative Cloud · JetBrains IDE | ผู้ใช้บ่นว่าแยกตัวไม่ออกเมื่อมีหลายตัว (Adobe 2020 · ฟอรัม JetBrains) |
| สีชุดเดียวกันทุกตัว | Google Workspace 2020 | ถูกวิจารณ์ว่าแยกไม่ออก ปี 2026 ทำใหม่และเลิกบังคับ 4 สี |
| สัญลักษณ์เล่าเรื่องของแต่ละตัว บนโครงเดียวกัน | Atlassian 2017 · ระบบไอคอน Atlassian 2025 | ต้องคุมน้ำหนักเส้นและกริดให้เท่ากัน |

บทเรียนร่วม: ทุกตัวในชุดต้องแยกออกที่ 16 px ด้วยรูปทรง ไม่ใช่ด้วยสีหรือตัวอักษรอย่างเดียว

## 3 · กฎของปลายทางที่ไอคอน plugin มักไปอยู่

| ปลายทาง | ไฟล์ | กฎสำคัญ |
|---|---|---|
| Claude Code (ช่อง `icon` ใน `plugin.json`) | path รูปใน plugin · ด่าน directory รับ PNG JPEG GIF WebP SVG | ไม่กำหนดขนาดหรือรูปทรง · Claude Code ไม่อ่าน ใช้แค่หน้า directory |
| Raycast | PNG 512 | ต้องดูดีทั้งธีมมืดและสว่าง (มี `icon@dark.png` แยกได้) · ใช้ไอคอนตั้งต้นจะถูกปฏิเสธ |
| JetBrains | SVG 40 · ภาพอยู่ใน 36 | ห้ามโลโก้ที่เป็นตัวอักษรล้วน · ห้ามคล้ายแบรนด์อื่น · ต้องชัดทั้ง 2 พื้น |
| VS Code | PNG อย่างน้อย 128 (256 สำหรับจอ Retina) | ห้าม SVG |
| Chrome | PNG 128 ภาพจริง 96 เว้นขอบด้านละ 16 | ห้ามขอบ · เลี่ยงเงาตกใหญ่ · หันหน้าตรง |

กฎที่หลายแหล่งตรงกัน: อ่านออกทั้ง 2 พื้น · ไม่ใส่ข้อความ · ไม่มีขอบและเงาใหญ่ · เว้นขอบโปร่งใส · น้ำหนักภาพเท่ากันทั้งชุด · ไม่คล้ายแบรนด์อื่น · ไฟล์ต้นแบบหนึ่งชุดส่งออกได้ทุกปลายทาง (PNG 512 · PNG 128 · SVG 40)

## 4 · แนวที่ดูออกว่า AI ทำ (เลี่ยง)

| แนว | แหล่งที่วิจารณ์ |
|---|---|
| gradient ม่วงน้ำเงิน · starburst · แสงเรือง | Allen · UX Collective (2024-06) |
| ประกาย sparkle ✦ ที่กลายเป็นป้าย "beta" | Josh Clark · Big Medium (2024-09) · Fast Company (2024) |
| หกเหลี่ยมหรือเกลียวหมุน · หุ่นยนต์ตาโต | Fast Company (2023) |
| วงกลม gradient มีรูกลาง | Radek Sienkiewicz (2025-04) |

โลโก้ Claude ตั้งใจหนีแนวเหล่านี้ (DesignRush) · "สมอง" ยังไม่พบแหล่งที่ระบุชื่อ (ยังไม่ได้ตรวจ)

## แหล่ง (เปิดอ่าน 2026-10-26)

- Microsoft Design · Fluid forms, vibrant colors — https://microsoft.design/articles/fluid-forms-vibrant-colors/
- Adobe Design · Behind the design: Adobe's updated app icons — https://adobe.design/ideas/behind-the-design-adobe-s-updated-app-icons
- Creative Bloq · Adobe icon update 2020 — https://www.creativebloq.com/news/adobe-icon-update-2020
- Atlassian · Our bold new brand — https://www.atlassian.com/blog/announcements/our-bold-new-brand
- Atlassian Design · Building Atlassian's new icon system — https://atlassian.design/whats-new/building-atlassians-new-icon-system
- JetBrains · New icons in IntelliJ Platform 2018.2 — https://blog.jetbrains.com/blog/2018/06/26/new-icons-in-intellij-platform-2018-2/
- Google Workspace Updates · Fresh visual identity for app icons (2026-05) — https://workspaceupdates.googleblog.com/2026/05/introducing-fresh-visual-identity-for-Google-Workspace-app-icons.html
- 9to5Google · New Gmail icon (2020) — https://9to5google.com/2020/10/06/new-gmail-icon/
- UX Collective · The way we design AI looks like nostalgia already — https://uxdesign.cc/the-way-we-design-ai-looks-like-nostalgia-already-aa5dfc01d4c7
- Big Medium · Your sparkles are fizzling — https://bigmedium.com/ideas/your-sparkles-are-fizzling.html
- Fast Company · AI boom logo trend — https://www.fastcompany.com/90869029/ai-boom-logo-trend-swirling-hexagon
- Fast Company · How the sparkle emoji took over AI — https://www.fastcompany.com/91030156/how-the-sparkle-emoji-took-over-ai
- VelvetShark (Radek Sienkiewicz) — https://velvetshark.com/ai-company-logos-that-look-like-buttholes
- DesignRush · Claude logo design — https://www.designrush.com/best-designs/logo/claude-logo-design-the-ai-mark-built-to-look-none-of-its-rivals
- Claude Code · Plugins reference — https://code.claude.com/docs/en/plugins-reference · Claude · Submit a plugin — https://claude.com/docs/plugins/submit
- Raycast · Prepare an extension for the Store — https://developers.raycast.com/basics/prepare-an-extension-for-store
- JetBrains · Plugin icon file — https://plugins.jetbrains.com/docs/intellij/plugin-icon-file.html
- VS Code · Extension manifest — https://code.visualstudio.com/api/references/extension-manifest
- Chrome Web Store · Images — https://developer.chrome.com/docs/webstore/images
