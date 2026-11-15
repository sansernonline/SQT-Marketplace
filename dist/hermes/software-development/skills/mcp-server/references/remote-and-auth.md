# remote MCP — Streamable HTTP · OAuth 2.1 · เมื่อไหร่ claude.ai ต้องใช้

> อ่านเมื่อ stdio ไม่พอแล้วเท่านั้น (SKILL.md ข้อ 2) · เรียบเรียงจากสเปก MCP 2026-07-28 (authorization · transports · security best practices) · เอกสาร Claude Code และ support.claude.com · ตรวจ 2026-10-23

## สารบัญ

1. [เมื่อไหร่ต้องเป็น remote](#1-เมื่อไหร่ต้องเป็น-remote)
2. [Streamable HTTP คืออะไร](#2-streamable-http-คืออะไร)
3. [auth 2 ระดับ](#3-auth-2-ระดับ)
4. [OAuth 2.1 ตามสเปก](#4-oauth-21-ตามสเปก)
5. [สิ่งที่ server ต้องทำ](#5-สิ่งที่-server-ต้องทำ)
6. [ฝั่ง Claude Code และ claude.ai](#6-ฝั่ง-claude-code-และ-claudeai)
7. [host และ ops](#7-host-และ-ops)
8. [ตรวจก่อนเปิดใช้](#8-ตรวจก่อนเปิดใช้)
9. [แหล่งที่มา](#9-แหล่งที่มา)

## 1 · เมื่อไหร่ต้องเป็น remote

| สถานการณ์ | remote? | เหตุผล |
|---|---|---|
| ผู้ใช้อยู่บน claude.ai (เว็บ · มือถือ) หรือ Cowork | **ต้อง** | custom connector รับเฉพาะ server ที่เข้าถึงได้จากอินเทอร์เน็ต เพราะ Claude ต่อจาก cloud ของ Anthropic · server หลัง VPN/firewall ต้อง allowlist IP ของ Anthropic · stdio ใน `claude_desktop_config.json` ใช้บน claude.ai ไม่ได้ |
| ทีม > 1 คนต้องใช้ข้อมูลชุดเดียวกัน และระบบต้นทางอยู่บน cloud | ควร | server เดียว · สิทธิ์ต่อคนผ่าน OAuth · ไม่ต้องแจก credential ของฐานข้อมูลให้ทุกเครื่อง |
| ระบบต้นทางอยู่ในเครื่องผู้ใช้หรือ LAN ของลูกค้า | ไม่ | stdio บนเครื่องนั้น · ข้อมูลไม่ออกเน็ต · ไม่มีอะไรต้องดูแล |
| คนเดียว · Claude Code · ข้อมูลอ่อนไหว | ไม่ | stdio |
| ต้องมี UI ในแชต (ฟอร์ม · ปุ่มยืนยัน) | remote หรือ MCPB | Anthropic `mcp-server-dev` → `build-mcp-app` (ยังไม่ได้ตรวจ) |

remote = งานเพิ่ม 3 ก้อนที่ stdio ไม่มี: **HTTPS + hosting** · **auth** · **ดูแล uptime** — เขียนเหตุผลลง ADR ก่อนเริ่ม (`adr-writer`)

## 2 · Streamable HTTP คืออะไร

- endpoint เดียว เช่น `https://mcp.example.co.th/mcp` · client `POST` JSON-RPC ทีละคำขอ · server ตอบ JSON หรือ stream (SSE ภายในคำตอบนั้น) · รุ่น 2026-07-28 ต้องมี header `Mcp-Method` และ `Mcp-Name` ใน POST
- **stateless ตั้งแต่ 2026-07-28** — ไม่มี `initialize` handshake · ไม่มี `Mcp-Session-Id` · ทุกคำขอพกรุ่นโปรโตคอลและ capability ใน `_meta` · state ข้ามคำขอต้องเป็น handle ที่ server ออกและรับกลับเป็นพารามิเตอร์ปกติ (และ**ห้าม**ถือ handle เป็นการยืนยันตัวตน)
- รุ่นก่อน (2025-11-25 ลงไป) มี session id และ handshake — SDK ปัจจุบันรองรับทั้งสองทางให้ · เราไม่ต้องเขียนเอง แต่ต้องรู้ว่า client เก่าของลูกค้าอาจคุยแบบเก่า
- transport **HTTP+SSE แบบเก่า (2024-11-05) เป็น deprecated** — ไม่สร้างใหม่ · `claude mcp add --transport sse` มีไว้ต่อของเก่าเท่านั้น
- Python v2: `mcp.run(transport="streamable-http", host="0.0.0.0", port=9000, json_response=True, stateless_http=True)` · request body เพดาน 4 MiB (ปรับ `max_request_body_size`) · TypeScript v2: แพ็กเกจ `@modelcontextprotocol/express` ช่วย Host header validation

## 3 · auth 2 ระดับ

| ระดับ | ใช้เมื่อ | วิธี | ข้อจำกัด |
|---|---|---|---|
| **API key ใน header** | server ภายในบริษัท · ผู้ใช้ไม่กี่คน · ไม่ต้องแยกสิทธิ์ต่อคน | `claude mcp add --transport http <ชื่อ> <url> --header "Authorization: Bearer ${KEY}"` · claude.ai ใส่ใน request headers ของ connector ได้ | key เดียวทุกคน → audit log บอกไม่ได้ว่าใครเรียก · หมุน key ยาก · ไม่ใช่สิ่งที่สเปกกำหนด |
| **OAuth 2.1** (ตามสเปก) | ผู้ใช้หลายคน · สิทธิ์ต่อคน · เปิดให้ claude.ai ทั้งองค์กร | server เป็น resource server · มี authorization server (ของเราเอง หรือ IdP เช่น Entra ID · Keycloak · Auth0 ที่รองรับ RFC 8414 + PKCE) | งานตั้งค่า 1–3 วันถ้ามี IdP อยู่แล้ว · มากกว่านั้นถ้าต้องเขียน AS เอง (ประมาณการทีม · ยังไม่ได้วัด) |

เริ่ม API key เมื่ออยู่ใน LAN/VPN ขององค์กรเดียว · ไป OAuth เมื่อออกอินเทอร์เน็ตหรือมี > 1 องค์กร

## 4 · OAuth 2.1 ตามสเปก

ลำดับที่ client (Claude) ทำ — server เราต้องตอบให้ถูกแต่ละขั้น:

1. client เรียก `/mcp` ไม่มี token → server ตอบ **401** พร้อม header `WWW-Authenticate` ที่ชี้ `resource_metadata` URL
2. client อ่าน **Protected Resource Metadata** (RFC 9728) ที่ `/.well-known/oauth-protected-resource` → ได้ `authorization_servers[]` และ `scopes_supported`
3. client อ่าน **Authorization Server Metadata** (RFC 8414) ของ AS → endpoint ต่าง ๆ
4. client ลงทะเบียนตัวเอง — รุ่น 2026-07-28 ใช้ **Client ID Metadata Documents (CIMD)** เป็นหลัก (client_id เป็น URL ของเอกสาร metadata) · **Dynamic Client Registration (RFC 7591) ถูก deprecate** แต่ยังใช้ได้กับ AS เก่า · AS ที่ไม่รองรับทั้งคู่ต้องให้ client ใส่ `client_id` เอง (Claude Code: `--client-id` · `--client-secret`)
5. **PKCE** บังคับ · ส่ง `resource=<URL ของ MCP server>` (RFC 8707) ทั้งตอนขอ code และขอ token · ตรวจ `state` และ `iss` ตอนรับ callback
6. ได้ access token → ทุกคำขอมี `Authorization: Bearer …` (ห้ามใส่ใน query string) · token หมดอายุ → 401 ใหม่ → refresh
7. ขอสิทธิ์เพิ่มทีหลัง: server ตอบ 403 หรือ 401 พร้อม `scope="…"` ที่ต้องการ (step-up) — เริ่มจาก scope น้อยที่สุด ไม่ประกาศ scope ทั้งหมดใน `scopes_supported`

## 5 · สิ่งที่ server ต้องทำ

| ต้อง | เพราะ |
|---|---|
| ตรวจ token **ทุกคำขอ** และตรวจว่า **audience คือ server นี้** (claim `aud` หรือเทียบเท่า) · token ของ service อื่นปฏิเสธด้วย 401 | สเปก MUST · กัน confused deputy |
| **ไม่ส่งต่อ token ที่ได้จาก client ไปยังระบบต้นทาง** — ใช้ token อีกใบที่ server ขอเองในฐานะ client ของระบบนั้น | token passthrough ถูกห้ามชัดใน security best practices |
| HTTPS ทุก endpoint · redirect URI เป็น HTTPS หรือ `localhost` เท่านั้น | OAuth 2.1 §1.5 |
| 401 = ไม่มี/หมดอายุ · 403 = scope ไม่พอ · 400 = คำขอผิดรูป | ตารางในสเปก |
| ถ้า server เป็น **proxy** ไปยัง API ของเจ้าอื่นด้วย client_id คงที่ → หน้ายินยอมของเราเองต่อ client แต่ละตัว ก่อนส่งต่อ · เก็บ consent ต่อ `client_id` · `redirect_uri` ต้องตรงเป๊ะ | confused deputy ใน security best practices |
| token เก็บเข้ารหัส · อายุสั้น · refresh token หมุนสำหรับ public client · ไม่ log token | token theft |
| แยก identity ของผู้ใช้จาก token แล้วส่งเข้า audit log ทุก tool call | `audit-trail` · ถ้าใช้ API key ร่วม จะทำข้อนี้ไม่ได้ |
| rate limit ต่อผู้ใช้ · timeout ต่อ tool · ขนาด body จำกัด | สเปก server MUST rate limit |

## 6 · ฝั่ง Claude Code และ claude.ai

| client | ทำอย่างไร | หมายเหตุ |
|---|---|---|
| Claude Code (CLI) | `claude mcp add --transport http <ชื่อ> https://…/mcp` · OAuth: พิมพ์ `/mcp` ในเซสชันแล้วล็อกอินผ่านเบราว์เซอร์ หรือ `claude mcp login <ชื่อ>` · token เก็บให้และ refresh เอง · ถอน: `claude mcp logout` หรือ `claude mcp remove` (ลบ token และ client registration ด้วย) | AS ที่ต้อง redirect URI ลงทะเบียนไว้ก่อน: `--callback-port 8080` · AS ที่ไม่มี DCR/CIMD: `--client-id` `--client-secret` (secret ถามแบบซ่อน) · `.mcp.json` รุ่น http ใช้ `"type": "http"` · `"url"` · `"headers"` · ตัวแปร credential ของ Anthropic เองไม่ถูกขยายใน `url`/`headers` (กันโปรเจกต์ส่ง key ของเราไป server อื่น) |
| claude.ai · Claude Desktop · Cowork | Settings → Connectors → Add custom connector → ใส่ URL · ล็อกอิน OAuth หรือใส่ header | ทุกแพลน (Free 1 ตัว) · Team: Owner/Primary Owner เพิ่มให้ทั้งองค์กร · Enterprise: Owner หรือ role ที่มีสิทธิ์ Manage Libraries · สมาชิกแต่ละคนต้องเปิดและล็อกอินเอง |
| server ต้องเข้าถึงจากอินเทอร์เน็ต | — | ถ้าอยู่หลัง firewall ต้อง allowlist IP ของ Anthropic (รายการในบทความ support · ไม่คัดลอกมาเพราะเปลี่ยนได้) |

## 7 · host และ ops

- รันเป็น web service ปกติ → ใช้ `web-service-essentials` (health endpoint · error RFC 9457 สำหรับ endpoint ที่ไม่ใช่ `/mcp`) · `observability-basics` (วัด latency ต่อ tool · อัตรา `is_error`) · `cicd-and-release`
- stateless → scale แนวนอนได้ทันที · ไม่ต้อง sticky session (รุ่น 2026-07-28) · ถ้ายังรองรับ client เก่าที่ใช้ session id ต้องมี store ร่วม
- server ภายในที่รันบนเครื่องเดียวแต่ใช้ HTTP: bind `127.0.0.1` · ตรวจ `Origin` · ต้องมี token — กัน DNS rebinding จากเว็บที่ผู้ใช้เปิดอยู่
- ถ้า server ของเราเป็น client ของ AS คนอื่น (ดึง metadata ตาม URL ที่ได้มา): ไม่ตาม URL ไปยัง IP ภายใน (`10/8` · `172.16/12` · `192.168/16` · `169.254/16` · loopback) · บังคับ HTTPS · ไม่ตาม redirect แบบไม่ตรวจ — SSRF ใน security best practices
- Thai hosting ที่ถูกสุดก่อน (กฎเจ้าของ): VPS ในประเทศหรือ PaaS ที่มี HTTPS ให้ · ราคาและผู้ให้บริการ (รอยืนยัน)

## 8 · ตรวจก่อนเปิดใช้

- [ ] เหตุผลที่ต้องเป็น remote เขียนใน ADR · ทางเลือก stdio ถูกปฏิเสธด้วยเหตุผลจริง
- [ ] `curl -i https://…/mcp` ไม่มี token → 401 + `WWW-Authenticate` ชี้ `/.well-known/oauth-protected-resource` ที่เปิดได้
- [ ] token ของ service อื่น (audience ผิด) → 401 · scope ไม่พอ → 403
- [ ] ไม่มีจุดไหนส่ง token ของ client ต่อไปยังระบบต้นทาง (grep `Authorization` ในโค้ดที่เรียกออก)
- [ ] HTTPS ทั้งหมด · HTTP ยอมเฉพาะ `localhost` ตอน dev
- [ ] audit log มี identity ผู้ใช้จาก token · ไม่มี token หรือค่าลับใน log
- [ ] `claude mcp add --transport http` + `/mcp` ล็อกอินผ่านจริง 1 ครั้ง · claude.ai connector เพิ่มได้จริง 1 ครั้ง (ถ้าเป้าหมายคือ claude.ai) — จดวันที่
- [ ] eval 3 กรณีของ SKILL.md ข้อ 7 รันผ่าน remote (ไม่ใช่แค่ stdio)
- [ ] `security-gate` ผ่าน · STRIDE โดย `security-engineer` เพราะเปิดสู่ภายนอก

## 9 · แหล่งที่มา

| เรื่อง | ที่มา (ตรวจ 2026-10-23) |
|---|---|
| OAuth 2.1 · RFC 9728 · RFC 8414 · PKCE · RFC 8707 · 401/403/400 · token audience · ห้าม passthrough · stdio ใช้ credential จาก environment | modelcontextprotocol.io/specification/2025-06-18/basic/authorization (รุ่น 2026-07-28 เพิ่ม CIMD · `iss` · step-up scope — changelog) |
| stateless · ไม่มี session id · `Mcp-Method`/`Mcp-Name` · SSE deprecated · DCR deprecated → CIMD | modelcontextprotocol.io/specification/2026-07-28/changelog |
| confused deputy · token passthrough · SSRF · state handle hijacking · local server · scope minimization | modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices |
| `claude mcp add --transport http` · `--header` · `/mcp` · `claude mcp login/logout` · `--callback-port` · `--client-id` · credential ของ Anthropic ไม่ขยายใน url/headers | code.claude.com/docs/en/mcp |
| custom connector: ต้องเข้าถึงจากอินเทอร์เน็ต · แพลน · ใครเพิ่มได้ · OAuth หรือ header · allowlist IP | support.claude.com → "Getting started with custom connectors using remote MCP" |
| Python v2 `run(transport="streamable-http", …)` · 4 MiB · TypeScript `@modelcontextprotocol/express` | py.sdk.modelcontextprotocol.io/migration · github.com/modelcontextprotocol/typescript-sdk README |
| ประมาณการ 1–3 วัน · ราคา hosting | ทีม · ยังไม่ได้วัด · (รอยืนยัน) |
