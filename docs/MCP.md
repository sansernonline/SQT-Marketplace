# MCP ที่เกี่ยวกับ marketplace นี้

> สำรวจ 2026-10-23 · คำถาม 3 ข้อ: plugin เราขาด MCP server อะไรบ้าง · ตัวไหนช่วยให้ skill ทำงานดีขึ้น · ตัวไหนควรเขียนเอง
> วิธีสร้าง server ของเราเองอยู่ที่ skill `mcp-server` (plugin `software-company`) — เอกสารนี้บอกแค่ว่า **ควรมีตัวไหน**

หลัก 3 ข้อ (ตาม skill `mcp-server` ข้อ 1):

1. **ผู้ขายมี MCP ทางการและครอบคลุมงาน → ใช้ของเขา** ไม่สร้างซ้ำ
2. **ระบบไทย/ระบบภายในที่ไม่มี MCP → เขียนเอง** ด้วยแบบ `assets/inventory-mcp` (stdio · อ่านอย่างเดียว · tool 5–15 ตัว)
3. **server ของชุมชน = โค้ดที่ไม่ไว้ใจ** จนกว่าจะอ่านทั้งไฟล์ — ห้ามใส่ค่าลับจริงก่อนรันใน `docker-sandbox`

หมายเหตุคำว่า "ทางการ": ชุด reference ของ `modelcontextprotocol/servers` เหลือแค่ Filesystem · Git · Fetch · Memory · Sequential Thinking · Time (เป็นตัวอย่าง ไม่ใช่ production) · server ที่คนเรียกว่า "official" ส่วนใหญ่คือ **first-party ที่ผู้ขายดูแลเอง** (GitHub · Microsoft · LINE) — ชุด reference เก่า (GitHub · Postgres · Slack · SQLite ฯลฯ) ถูกย้ายไป `servers-archived` แล้ว อย่าคัดลอกคำสั่งติดตั้งจากบทความปี 2025

## 1 · ใช้ของทางการได้เลย — ครอบ skill เราอยู่แล้ว

| MCP server | ผู้ดูแล | ช่วย skill ของเรา | หมายเหตุ |
|---|---|---|---|
| GitHub MCP | GitHub (first-party) | `code-review` · `cicd-and-release` · `pr-description-template` · `bug-inbox-triage` · agent ใน software-company ที่อ่าน issue/PR | remote (`api.githubcopilot.com/mcp/`) หรือ local · tool เยอะมาก เปิดเท่าที่ใช้ กิน context |
| Playwright MCP | Microsoft | `e2e-testing-patterns` · `web-quality-audit` · `reverse-engineering` (software-company) · `seo-audit` | local · เปิดเป็น project-local อย่าเปิด global |
| Chrome DevTools MCP | Google | `web-quality-audit` · `observability-basics` — console · network · performance trace จริง | ต่างจาก Playwright: ตัวนี้เน้น debug ไม่ใช่ขับหน้าเว็บ |
| Context7 | Upstash | `stack-*` ทุกตัว · `lazy-coding` — ดึง docs ของ library ตามเวอร์ชันจริง แทนการอนุมานจากข้อมูลฝึก | remote หรือ local |
| LINE Bot MCP | LINE (first-party, **preview**) | `line-setup` · `line-bot` · `line-broadcast` · `line-oa-setup` ของ e-commerce · `line-richmenu` ของ graphic-design | 12 tool: push/reply/broadcast · Flex · rich menu · quota · followers · `@line/line-bot-mcp-server` · Apache-2.0 · README ระบุว่าเป็น preview |
| MCP Toolbox for Databases | Google | `database-design` · `stack-sql` — ต่อ Postgres/MySQL แบบ self-run | หรือ Supabase/MongoDB MCP ถ้าโปรเจกต์ใช้ของเขาอยู่แล้ว |
| Sentry MCP | Sentry | `incident-response` · `observability-basics` · `security-operations` | remote · OAuth |
| Figma MCP | Figma | `ui-craft` · `web-app-design` · `graphic-design` — เมื่อลูกค้าส่งงานเป็น Figma | remote หรือ desktop |
| Fetch / Filesystem | MCP steering group (reference) | `research-with-sources` · `prior-art-review` · งานอ่านไฟล์นอกโปรเจกต์ | reference implementation — ใช้ได้แต่อย่าถือว่า production-grade |

กฎการเปิดใช้: **ทุก server กิน context ด้วย tool schema** — เปิดแบบ project-local เป็นค่าเริ่มต้น เปิด global เฉพาะตัวที่ใช้ทุกวัน · ตัวหนัก (GitHub เต็มชุด · Playwright) เปิดเฉพาะโปรเจกต์ที่ต้องใช้

## 2 · ของที่ขาด — ต้องเขียนเอง (roadmap)

ไม่มี MCP ทางการสำหรับระบบไทยและ seller centre ของ marketplace เส้นหลัก — skill เรามีคำสั่งครอบงานเหล่านี้อยู่แล้ว แต่ตอนนี้ agent ทำได้แค่ "แนะนำขั้นตอน" เพราะอ่านข้อมูลจริงไม่ได้ · ลำดับเรียงตาม skill ที่พร้อมใช้มากสุด

| ลำดับ | server ที่จะเขียน | ต่อกับ | skill ที่ได้ประโยชน์ทันที | tool เริ่มต้น (อ่านอย่างเดียว) | ข้อเท็จจริงที่ต้องรู้ก่อนเขียน |
|---|---|---|---|---|---|
| 1 | `set-data-mcp` ✅ เริ่มแล้ว (`tools/set-data-mcp/` · ข้อมูลตัวอย่าง · ผ่าน eval 3 ข้อ 2026-10-23 ผ่าน Codex CLI · ยังไม่ได้ต่อ Settrade จริง) | Settrade Open API (ผ่านโบรกเกอร์ เช่น Pi · มี sandbox) หรือ SET SMART Marketplace (ข้อมูล EOD/พื้นฐานแบบซื้อ) | trading-finance: `portfolio-snapshot` · `watch` · `watchlist-setup` · `technical-signals` · `dividend-tracker` · `news-impact` | `setdata_get_quote` · `setdata_get_eod` · `setdata_get_financials` · `setdata_search_symbol` (ทำแล้ว 4 ตัว) | ตลาดไทยไม่มี MCP เลย (ตรวจ 2026-10-23) · Settrade มี MARKET INFO real-time + historical · ข้อมูลต่างประเทศถ้าต้องการ ใช้ Yahoo Finance (มี community MCP) แยก server |
| 2 | `seller-centre-mcp` | Shopee Open Platform v2 · TikTok Shop Open API (เพิ่ม Lazada ทีหลัง) | e-commerce: `multi-shop-stock` · `price-check` · `listing` · `returns-and-bad-reviews` | `seller_list_orders` · `seller_get_product` · `seller_list_products` · `seller_get_stock` · `seller_list_returns` | ไม่มี official MCP จากทั้ง 3 เจ้า (มีแต่ของบุคคลที่สาม) · auth ต่างกัน: Shopee = HMAC-SHA256 + token 4 ชม. (refresh 30 วัน · refresh เป็นงานตั้งเวลา ไม่ใช่รอ 401) · TikTok Shop = token 24 ชม. · tool เขียน (ปรับราคา/สต็อก) แยกไฟล์ หลัง env flag + audit log ตาม `mcp-server` ข้อ 9 |
| 3 | `line-oa-mcp` (เสริม) | LINE Messaging API | e-commerce: `line-*` + `chat-reply-templates` · graphic-design: `line-richmenu` | เฉพาะ tool ที่ official LINE Bot MCP ขาด เช่น อ่าน insight/สถิติ broadcast ต่อเนื่อง | official มีอยู่แล้วแต่เป็น preview — **อย่า fork มาแก้** ให้ใช้ของเขา + เขียน server เล็กเฉพาะส่วนที่ขาด (หลักข้อ 1 ของ `mcp-server`) |
| 4 | `thai-gov-mcp` | data.go.th (เปิด ไม่ต้องมี key) · DBD datawarehouse · กรมสรรพากร | e-commerce: `dbd-annual-filing` · `tax-vat-th` · `e-tax-invoice` · `seller-tax-basics` | `thaigov_search_dataset` · `thaigov_get_company` · `thaigov_get_company_financials` | DBD และ data.go.th มี community MCP แล้ว (ดูข้อ 3) แต่ยังไม่ไว้ใจ — เขียนเองสั้นกว่า audit ของคนอื่น · e-Tax กรมสรรพากรไม่มี API ตรงสำหรับ SME — การออกเอกสารจริงต้องผ่าน service provider ที่ ETDA อนุญาต (เช่น Leceipt มี community MCP แล้ว) server ของเราทำได้แค่เตรียมข้อมูล/ตรวจความถูก ไม่ใช่ส่งให้กรมฯ |

ต้นแบบสำหรับทั้ง 4 ตัว: คัดลอก `plugins/software-company/skills/mcp-server/assets/inventory-mcp/` → เปลี่ยน `query()` ให้ต่อ API จริง → รัน eval 3 กรณี → บันทึกวันที่ใน README ของ server นั้น

## 3 · ของชุมชนที่มีอยู่ — ยังไม่ไว้ใจจนกว่าจะอ่านโค้ด

| server | ครอบอะไร | สถานะที่ตรวจเจอ (2026-10-23) |
|---|---|---|
| `datawarehouse-dbd-mcp` (sanookjung) | นิติบุคคล + งบการเงินจาก datawarehouse.dbd.go.th | ใช้ Playwright bootstrap session — หมายความว่า scrape เว็บรัฐ ต้องอ่านว่าเก็บ cookie/credential อย่างไร |
| Thai Open Data MCP (sarapab-th) | data.go.th | self-host บน Cloudflare Workers · ไม่ต้องมี key · ดูสุดในชุดนี้ แต่ยังไม่ได้อ่านโค้ด |
| Thailand Invoice MCP (junter1989k-ai) | ออก e-Tax ผ่าน Leceipt | remote — ข้อมูลใบกำกับออกนอกเครื่อง ขัดหลัก "stdio ก่อน" · ถ้าจะใช้ Leceipt จริง เขียนเองห่อ API ของเขาแบบ stdio ดีกว่า |
| SeaMCP/shopee | ค้นสินค้า/ร้าน Shopee สาธารณะ (read-only) | uptime 76.7% ใน 28 วัน · ข้อมูลไม่ครบ (ผู้พัฒนาระบุเอง) — ใช้เช็กราคาตลาดคร่าว ๆ ได้ ห้ามใช้ตัดสินใจสต็อก |
| yahoo-finance MCP (ชุมชนหลายตัว) | หุ้นต่างประเทศ | มีหลาย fork คุณภาพสวนกัน · ถ้า trading-finance ต้องการตลาดนอก ค่อยคัดตัวที่ดูแลอยู่ |

## แหล่งที่มา (ตรวจ 2026-10-23)

| เรื่อง | ที่มา |
|---|---|
| reference set เหลือ Filesystem · Git · Fetch · Memory · Sequential Thinking · Time · ที่เหลือย้ายไป servers-archived | README ของ modelcontextprotocol/servers (อ้างผ่าน startupik.com และ tembo.io รายงาน 28 ก.ย. 2026 · ยังไม่ได้เปิด README ต้นฉบับเองรอบนี้) |
| registry ทางการ · ยืนยัน namespace ผ่าน GitHub OAuth/DNS | registry.modelcontextprotocol.io |
| GitHub MCP (first-party) · Playwright MCP · Chrome DevTools MCP · Context7 · Sentry · Figma · MCP Toolbox | github/github-mcp-server · microsoft/playwright-mcp · ChromeDevTools/chrome-devtools-mcp · upstash/context7 · เอกสารผู้ขายแต่ละเจ้า (อ้างผ่าน popmcp.com เช็กกับหน้า vendor เมื่อ 5 ต.ค. 2026) |
| ทุก server กิน context · เปิด project-local · first-party เหนือ archived | startupik.com/best-mcp-servers-for-ai-agents-2026 (28 ก.ย. 2026) |
| LINE Bot MCP official preview · 12 tool · `@line/line-bot-mcp-server` · Apache-2.0 | github.com/line/line-bot-mcp-server (อ้างผ่าน ai-heartland.com มี.ค. 2026 · enterprisedna.co มิ.ย. 2026 — 591 ดาว) |
| ไม่มี official MCP ของ Shopee/Lazada/TikTok Shop · auth: Shopee HMAC-SHA256 token 4 ชม./refresh 30 วัน · TikTok Shop token 24 ชม. · SDK รวม easycb-go | matthewswong.com (ก.ค. 2026) · github.com/easycb/easycb-go · glama.ai (SeaMCP shopee, เช็ก 23 ต.ค. 2026) |
| Settrade Open API มี MARKET INFO real-time + historical · sandbox ผ่านโบรกเกอร์ · SET SMART Marketplace ขาย EOD/fundamental | support.pi.financial · set.or.th/en/services/connectivity-and-data/data/smart-marketplace |
| DBD · data.go.th · Leceipt มี community MCP (unvalidated) | lobehub.com/mcp (ค้น "Thailand") · mcpmarket.com/server/thailand-invoice |
| e-Tax ไทยต้องผ่าน service provider ที่ ETDA อนุญาต · รายงานภายใน 15 ของเดือนถัดไป · ยังไม่บังคับ | dddinvoices.com/learn/e-invoicing-in-thailand (ต.ค. 2026) · edicomgroup.com |
