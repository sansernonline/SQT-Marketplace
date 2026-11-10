# สายเว็บ login และฝั่ง browser

เปิดเมื่อระบบมีเว็บหรือ API ที่ผู้ใช้ login · ใช้ session cookie · JWT · OAuth หรือ LINE Login · มีหน้าเว็บที่รัน JavaScript · วางหัวข้อที่เลือกลง brief ลูกทีมทั้งก้อน

## กติกาประจำสาย

- credential ทุกชนิด (cookie · JWT · API key · OAuth code) ต้องหาให้เจอว่าตรวจลายเซ็นที่ไหน และผูกกับอะไร (ผู้ออก · ผู้รับ · ผู้ใช้ · เวลา) · ตรวจลายเซ็นแต่ไม่ผูก = ยังข้ามได้
- header ที่มาจากผู้ใช้ (`Host` · `X-Forwarded-*` · `Origin` · `Referer`) คือการตัดสินใจเรื่องความไว้ใจ ให้ตามไปว่าค่าไปลงที่ไหน
- ไม่มี header · ไม่มี flag ของ cookie · ไม่มี MFA · ไม่มี rate limit เฉย ๆ ยังไม่ใช่ finding ต้องเห็นคำขอที่ไม่ควรผ่านแต่ผ่าน หรือผลที่ตกกับคนอื่น
- ตัดสินที่ proxy · CDN · ผู้ให้บริการ identity ที่ไม่อยู่ใน repo → `needs_validation`

## login session และ token

| ประเภท (`class`) | ล่าอะไร | สัญญาณในโค้ด | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `jwt-verify` | token ที่ไม่ได้ตรวจลายเซ็น หรือรับ `alg: none` · ไม่ตรวจ `aud` `iss` `exp` | `jwt.decode(` แทน `verify` · `algorithms` ไม่ได้ล็อก · ตรวจ `exp` เอง | test ส่ง token ที่แก้ payload หรือหมดอายุ ต้องได้ 401 | ตัว verify อยู่ใน middleware กลางที่ครอบ route แล้ว |
| `session-fixation` | session id เดิมใช้ต่อหลัง login · logout แล้ว token ยังใช้ได้ | ไม่มี `regenerate()` หลัง login · logout แค่ลบ cookie ฝั่ง client | login แล้วเทียบ session id ก่อนและหลัง · ใช้ token หลัง logout | token อายุสั้นมากและระบบประกาศว่ายอมรับ |
| `csrf` | คำขอที่เปลี่ยนข้อมูลผ่าน cookie โดยไม่มี token หรือไม่ตรวจ Origin | route `POST` ที่ไม่มี csrf middleware · `SameSite=None` | ส่ง POST จากอีก origin พร้อม cookie ในห้อง ต้องได้ 403 | ระบบใช้ header `Authorization` อย่างเดียว ไม่ใช้ cookie |
| `cookie-scope` | cookie ที่เก็บ session ส่งข้าม subdomain หรือผ่าน HTTP · อ่านได้จาก JavaScript | `domain=.example.com` · ไม่มี `Secure` `HttpOnly` | ดูว่า cookie นั้นเก็บของลับไหม และ JavaScript ต้องอ่านจริงหรือเปล่า | cookie เก็บแค่ค่าภาษาหรือธีม |
| `oauth-binding` | callback ไม่ตรวจ `state` · `redirect_uri` เทียบแบบขึ้นต้นด้วย · ไม่ใช้ PKCE ในแอปที่ไม่มีความลับ | เทียบ `startsWith` · ไม่มี `state` ใน session | test callback ด้วย state ผิด · redirect_uri ที่ต่อท้าย | ผู้ให้บริการบังคับ redirect_uri ตรงตัวอยู่แล้ว (ตรวจที่ console = needs_validation) |
| `password-reset` | token รีเซ็ตเดาได้ ใช้ซ้ำได้ ไม่ผูกบัญชี · ลิงก์ใช้ `Host` จากคำขอ | token จาก `Math.random` หรือ timestamp · URL สร้างจาก `req.headers.host` | ขอรีเซ็ตบัญชี A แล้วใช้ token กับ B · ส่ง Host ปลอมแล้วดูลิงก์ในอีเมลปลอม | token ยาวสุ่มจาก CSPRNG และผูกกับ user id แล้ว |
| `mfa-bypass` | ทางที่ข้ามขั้น MFA ได้ (API รุ่นเก่า · login ด้วย token จำเครื่อง) · ปิด MFA โดยไม่ยืนยันซ้ำ | flag `mfaPassed` ตั้งก่อนตรวจรหัส · route ที่ไม่ผ่านขั้น MFA | login แล้วเรียก route ที่ต้อง MFA โดยไม่ทำขั้นที่ 2 | route นั้นไม่ได้อยู่ในขอบเขตที่ระบบสัญญาว่าต้อง MFA |
| `account-linking` | เชื่อมบัญชี LINE หรือ Google เข้ากับบัญชีเดิมด้วยอีเมลที่ยังไม่ยืนยัน | หา user ด้วย email จาก provider โดยไม่ดู `email_verified` | สร้างบัญชีปลอมที่อีเมลตรงกันแล้วดูว่าเข้าบัญชีเดิมได้ไหม | provider ยืนยันอีเมลเสมอและโค้ดตรวจ flag แล้ว |
| `api-key-scope` | key ของร้าน A ใช้กับข้อมูลร้าน B ได้ · key อยู่ใน URL หรือ log | ตรวจแค่ว่า key มีอยู่ ไม่ดูว่าเป็นของใคร | test key ของ tenant หนึ่งกับ id ของอีก tenant | key เป็นของระบบภายในตัวเดียว ไม่มีหลายเจ้าของ |

## framing cache และ header

| ประเภท (`class`) | ล่าอะไร | สัญญาณในโค้ด | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `host-header` | ลิงก์ในอีเมล redirect หรือ cache key สร้างจาก `Host` ที่ผู้ใช้ส่ง | `req.headers.host` · `request.host` ในการสร้าง URL | test ส่ง Host ปลอม ดูลิงก์ที่ได้ | framework ตั้ง allowed hosts แล้ว (`ALLOWED_HOSTS` · `AllowedHosts`) |
| `cache-deception` | หน้าส่วนตัวถูก cache แล้วคนอื่นเปิดได้ · cache key ไม่รวมผู้ใช้ | `Cache-Control: public` บน route ที่ต้อง login · cache ใน memory ใช้ key แค่ path | 2 บัญชีปลอมเรียก route เดียวกันผ่าน cache ในห้อง | cache อยู่ที่ CDN นอก repo → needs_validation |
| `response-splitting` | ค่าผู้ใช้ไปลง header โดยไม่ตัดขึ้นบรรทัดใหม่ | `setHeader(..., input)` · `Content-Disposition` จากชื่อไฟล์ | test ส่ง `%0d%0a` ในค่า | framework รุ่นใหม่ปฏิเสธ CRLF ใน header เองแล้ว |
| `request-smuggling` | proxy กับแอปอ่านขอบเขตคำขอต่างกัน | parser HTTP เขียนเอง · ใช้ทั้ง `Content-Length` และ `Transfer-Encoding` | ต้องมีทั้ง proxy และแอปในห้อง ส่วนใหญ่จึงเป็น needs_validation | ไม่มี parser ของตัวเอง ใช้ server มาตรฐานอย่างเดียว |

## ฝั่ง browser

| ประเภท (`class`) | ล่าอะไร | สัญญาณในโค้ด | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `xss-dom` | ค่าจาก URL storage หรือ API ลง DOM เป็น HTML | `innerHTML` · `dangerouslySetInnerHTML` · `v-html` · `[innerHTML]` · `bypassSecurityTrust*` | render ในห้องด้วย `<img src=x onerror=...>` แล้วดูว่ารัน | ค่าผ่าน sanitizer (DOMPurify) ก่อนลง หรือมาจากค่าคงที่ |
| `postmessage-origin` | รับ `message` โดยไม่ตรวจ `event.origin` แล้วทำงานที่มีผล | `addEventListener('message'` ที่ไม่มี `origin ===` | test ส่ง message จาก origin อื่นใน browser ในห้อง | handler แค่ log หรือไม่มีผลต่อสถานะ |
| `cors-credentials` | สะท้อน Origin กลับพร้อม `Allow-Credentials: true` | `origin: true` · `callback(null, true)` สำหรับทุก origin | test ส่ง Origin ปลอม ดู header ที่ตอบ | response ไม่มีข้อมูลส่วนตัว หรือไม่ใช้ cookie |
| `websocket-origin` | WebSocket ใช้ cookie แต่ไม่ตรวจ Origin ตอน handshake | ไม่มีการตรวจ origin ใน `upgrade` | เปิด WebSocket จากอีก origin พร้อม cookie | ใช้ token ใน message แรกแทน cookie |
| `storage-token` | token ที่อายุยาวเก็บใน `localStorage` คู่กับมี XSS | `localStorage.setItem('token'` | ต้องมี XSS ที่ยืนยันแล้วเป็นข้อต่อ จึงเป็นโซ่ | ไม่มี XSS ที่ยืนยันได้ (เป็นแค่ hardening) |
| `clickjacking` | หน้าที่มีปุ่มเปลี่ยนเงินหรือสิทธิ์ ใส่ใน iframe ของคนอื่นได้ | ไม่มี `frame-ancestors` หรือ `X-Frame-Options` บนหน้านั้น | เปิดหน้าใน iframe จากอีก origin ในห้อง | หน้าไม่มีการกระทำที่มีผล |
| `open-redirect` | redirect ไปที่ใดก็ได้จากพารามิเตอร์ | `res.redirect(req.query.next)` | test `next=https://evil.example` | ปลายทางถูกเทียบกับ allowlist หรือบังคับเป็น path ภายใน |

## วิธีไล่ที่ใช้ได้ทั้งสาย

- ไล่ credential ทุกตัวตามวงจร: ออก → เก็บ → ส่ง → ใช้ → ต่ออายุ → เพิกถอน แล้วเทียบทางปกติกับทาง error retry และรุ่นเก่า
- นับทุกประตูที่ไปถึงตัวตนเดียวกัน และทุกทางที่ไปถึงงานสำคัญเดียวกัน · ความปลอดภัยจริงเท่ากับทางที่อ่อนที่สุด ไม่ใช่ทางที่หน้าเว็บใช้
- กู้บัญชีและเชื่อมบัญชี: วาดว่าบัญชีก่อนและหลังเชื่อมกับอะไร ทุกเส้นต้องมีหลักฐานว่าคนที่ทำเป็นเจ้าของจริง
