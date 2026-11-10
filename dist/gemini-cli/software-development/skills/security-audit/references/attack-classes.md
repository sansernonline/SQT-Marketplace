# ประเภทการโจมตี — กลุ่มหลัก ของที่มักหลุด และไฟล์ตามสาย

ใช้ตอนสร้าง ledger (เลือก `class` ต่อหน่วย) และตอนประกอบ brief ลูกทีมล่า (วางหัวข้อที่เลือกทั้งก้อน) · เลือกจากขอบเขตที่เจอในขั้นสำรวจ ไม่ใช่เพราะเห็นชื่อไลบรารี · ไม่ใช่ทุกกลุ่มใช้กับทุกระบบ

## เลือกไฟล์ตามสาย

| เจออะไรในขั้นสำรวจ | เปิดไฟล์ |
|---|---|
| เว็บแอป · API · login · session · JWT · OAuth · LINE Login · หน้าเว็บที่รัน JavaScript | [`classes-web-auth`](classes-web-auth.md) |
| ข้อมูลหลายลูกค้าหรือหลายร้านในฐานเดียว · export · backup · ลบข้อมูล · cache · search | [`classes-data-tenant`](classes-data-tenant.md) |
| เรียก LLM · RAG · AI agent ที่เรียกเครื่องมือ · MCP server หรือ client | [`classes-ai-mcp`](classes-ai-mcp.md) |
| dependency · CI/CD · Dockerfile · สคริปต์ build · plugin ที่โหลดได้ · ระบบอัปเดต | [`classes-supply-chain`](classes-supply-chain.md) |
| webhook (รับหรือส่ง) · คิว · job เบื้องหลัง · gRPC · GraphQL · WebSocket | [`classes-messaging-webhook`](classes-messaging-webhook.md) |
| LINE OA · LIFF · PromptPay · สลิป · payment gateway ไทย · e-Tax Invoice · เลขบัตรประชาชน | [`classes-thai`](classes-thai.md) |

สายที่ยังไม่มีไฟล์ของตัวเอง ใช้หัวข้อในไฟล์นี้: cloud และ deployment (หัวข้อ 9) · ทรัพยากรหมดหรือระบบล่ม (หัวข้อ 10) · แอปมือถือและ desktop ใช้ `security-gate/references/android.md` ร่วมกับไฟล์ web-auth สำหรับ backend · โค้ด native (C · C++) และไฟล์ไบนารี ส่งต่อ `reverse-engineering`

## 1 · injection — input ไปถึงจุดที่ถูกตีความเป็นคำสั่ง

- ล่า: SQL ต่อสตริง · คำสั่ง shell · template engine · path ไฟล์ · LDAP · XPath · regex จาก input · HTML ที่ไม่ escape · header ที่มีขึ้นบรรทัดใหม่ · log
- มักหลุด: ข้อมูลที่เก็บอย่างปลอดภัยแล้ว ถูกโค้ดอีกตัวดึงไปใช้ในที่อันตราย (second-order) · input ที่เป็นชื่อฟิลด์ ชื่อคอลัมน์ ทิศการเรียง ไม่ใช่แค่ค่า · ORM ที่มีช่อง raw (`$queryRawUnsafe` · `FromSqlRaw` · `.extra()`) · ระบบรองที่รับข้อมูลต่อ (search index · ตัวสร้าง PDF · ไฟล์ Excel)
- `class`: `sqli` · `cmdi` · `ssti` · `path-traversal` · `xss-stored` · `xss-reflected` · `header-injection` · `log-injection`

## 2 · access control — ทำได้เกินสิทธิ์ของตัวเอง

- ล่า: endpoint ที่ตรวจแค่ว่า login แต่ไม่ตรวจว่ามีสิทธิ์ · ตรวจสิทธิ์ผิดตัว (ตรวจสิทธิ์อ่านแต่ทำการแก้) · ตรวจเจ้าของจาก id ใน body แทน session · ฟิลด์ใน body ที่ทับค่าที่ระบบตั้งใจคุม (`role` · `shopId` · `price`)
- มักหลุด: ทางคู่ขนานที่ไปถึงผลเดียวกันแต่ตรวจอ่อนกว่า (API รุ่นเก่า · หน้าแอดมิน · batch · export · import) · bulk ที่ตรวจแค่รายการแรก · เปลี่ยน method (`GET` ได้ `DELETE` ไม่ตรวจ) · ทางที่ใช้ตอน error หรือ retry
- `class`: `idor` · `missing-authz` · `mass-assignment` · `privilege-escalation` · `authn-bypass`

## 3 · ไฟล์และทรัพยากร

- ล่า: path traversal รวมผ่าน symlink และการ encode · เซิร์ฟเวอร์ไปดึง URL ที่ผู้ใช้ส่งมา (SSRF) รวมหลัง redirect · แตก zip แล้วไฟล์ออกนอกโฟลเดอร์ (zip slip) · deserialize ข้อมูลภายนอก · อัปโหลดไฟล์ที่ตรวจแค่นามสกุล · ไฟล์ชั่วคราวที่คนอื่นเดาชื่อได้ · ตรวจแล้วค่อยใช้ห่างกันจนเปลี่ยนได้ระหว่างนั้น
- มักหลุด: URL สำหรับรับแจ้งเตือนหรือ webhook ที่ผู้ใช้ตั้งเอง · ตัวสร้าง PDF หรือภาพตัวอย่างที่ไปโหลดรูปจาก URL · URL ของ object storage ที่ลงชื่อแล้วแต่ใช้ได้นานหรือกว้างเกิน
- `class`: `ssrf` · `zip-slip` · `unsafe-deserialization` · `upload-type` · `toctou`

## 4 · การเข้ารหัสและค่าลับ

- ล่า: ค่าสุ่มที่ใช้เป็น token มาจากตัวสุ่มที่เดาได้ (`Math.random` · `random.random`) · ค่าลับในโค้ด log ข้อความ error URL หรือ response · ไม่ตรวจ HMAC หรือเทียบแบบเวลาไม่คงที่ · mode เข้ารหัสที่ไม่ตรวจความถูกต้อง · IV คงที่ · รหัสผ่านเก็บด้วย hash เร็ว
- มักหลุด: ทางที่การเข้ารหัสล้มแล้วโค้ดทำต่อแบบไม่เข้ารหัส · ค่าลับในประวัติ git ที่ลบจากไฟล์แล้ว (ใช้ผล gitleaks)
- `class`: `weak-random` · `secret-exposure` · `signature-bypass` · `weak-crypto` · `password-storage`

## 5 · ตรรกะธุรกิจ — สแกนเนอร์หาไม่เจอ แต่ผลกระทบสูง

- ล่า: ข้ามขั้นตอน ย้อนขั้น หรือทำขั้นที่จบแล้วซ้ำ · 2 คำขอพร้อมกันได้ผล 2 เท่า (ใช้คูปองซ้ำ · ถอนเงินซ้ำ · ตัดของซ้ำ) · จำนวนติดลบ ศูนย์ ทศนิยม ปัดเศษ หรือตัวเลขที่ส่งเป็นสตริง · หมดอายุตรงวินาทีขอบ · เขตเวลาต่างกันระหว่างส่วนของระบบ
- มักหลุด: ขั้น 2 ใน 3 ล้มแล้วขั้น 1 ไม่ย้อน · ค่าที่ "ตรวจแล้วตอนเข้า" แต่ถูกเขียนจากทางอื่นที่ไม่ตรวจ · ค่าเริ่มต้นเมื่อ config หาย feature flag ปิด หรือระบบอยู่ระหว่าง migrate
- `class`: `race-condition` · `workflow-bypass` · `numeric-abuse` · `replay` · `fail-open`

## 6 · ใช้ฟีเจอร์ผิดทาง

- ล่า: export หรือ backup ที่ได้ข้อมูลเกินสิทธิ์ · import ที่ทับข้อมูลคนอื่นหรือข้าม validation · search filter sort ที่ใช้เดาข้อมูลที่มองไม่เห็น · ข้อความ error เวลา หรือขนาด response ที่ต่างกันจนนับรายชื่อผู้ใช้ได้ · ลิงก์ preview หรือร่างที่เปิดได้กว้างเกิน · cache ที่เก็บหน้าส่วนตัวแล้วเสิร์ฟให้คนอื่น
- `class`: `export-scope` · `import-abuse` · `enumeration` · `search-oracle` · `preview-leak`

## 7 · ช่องโหว่ต่อกันเป็นโซ่

- ล่า: ของเล็ก 2 อย่างที่แต่ละอย่างไม่ใช่ช่องโหว่ แต่ต่อกันแล้วข้ามขอบเขตได้ · ส่วน A ตรวจแล้วส่งต่อให้ B แต่ B เชื่อมากกว่าที่ A รับประกัน (ตัดความยาว · แปลงชนิด · normalise) · สิทธิ์ที่กว้างขึ้นหลัง refresh token เปลี่ยนบทบาท หรือมอบสิทธิ์ต่อ · กู้คืน ยกเลิก หรือย้อนรุ่น ที่ไม่ตรวจสิทธิ์ปัจจุบัน
- กติกา: ทุกข้อต่อในโซ่ต้องยืนยันแยกกันได้ ห้ามสมมุติผลขั้นถัดไป · `class`: `chain` + ชื่อปลายทาง เช่น `chain-account-takeover`

## 8 · หาสิ่งที่ไม่อยู่ในหมวด (wildcard) และของพื้นฐานที่ทุกคนคิดว่ามีคนตรวจแล้ว

**wildcard** — 1 ตัวต่องาน ไม่ได้รับหมวด ให้อ่านโค้ดที่ดูแปลก ครึ่ง ๆ กลาง ๆ หรือชื่อ `temp` `hack` `legacy` · API ที่หน้าเว็บไม่เคยเรียก · route และ header ที่ไม่มีในเอกสาร · ฟีเจอร์ 2 ตัวที่ไม่ได้ออกแบบมาใช้ด้วยกัน · ประวัติ git ที่ถอยการแก้ความปลอดภัย · test ที่ไม่มี (เทียบกรณีที่ dev คิดไว้กับที่ไม่ได้คิด) · คอมเมนต์ที่อธิบายว่าทำไมปลอดภัย ให้ตรวจว่าจริง

**ของพื้นฐาน** — ตรวจทีละข้อแบบตรงตัว และทุกข้อที่เจอต้องตามเส้นทางจนเห็นผลก่อนเสนอ (cookie ไม่มี `HttpOnly` ต้องดูว่าเก็บอะไร):

1. รหัสผ่าน key token ในโค้ด (`password` · `secret` · `apikey` · `Bearer` · `-----BEGIN`) และไฟล์ `.env` `*.pem` `*.key` `credentials.json` ที่ commit
2. คอมเมนต์ `TODO` `FIXME` `HACK` ที่พูดถึง auth หรือ validate
3. โหมด debug เปิดได้ใน production ผ่าน env query หรือ header · บัญชีตัวอย่างหรือ seed ที่ใช้ได้จริง
4. `/debug` `/admin` `/test` `/metrics` `/env` `/.env` `/config` `/swagger` ที่ไม่มีการป้องกัน
5. `.gitignore` ไม่ครอบไฟล์ลับ ไฟล์อัปโหลด และ config ในเครื่อง
6. `eval` · `exec` · `child_process` · `Function()` · `vm` · dynamic `import()` ที่รับ input
7. CORS เปิด `*` คู่กับ credentials หรือสะท้อน Origin กลับโดยไม่ตรวจ
8. redirect จากพารามิเตอร์ `redirect` `return` `next` `url` `goto` โดยไม่ตรวจปลายทาง
9. error ใน production ที่ส่ง stack trace path ภายใน หรือ SQL กลับไป
10. endpoint ที่ยังเป็น HTTP ล้วน

## 9 · cloud และ deployment (ยังไม่มีไฟล์ตามสาย)

- ล่า: สิทธิ์ของ service account กว้างเกินงาน · แอปเชื่อ header จาก proxy (`X-Forwarded-For` · `X-User-Id`) โดยไม่ตรวจว่ามาจาก proxy จริง · เข้าถึง metadata ของ cloud (`169.254.169.254`) ผ่าน SSRF · bucket หรือ storage ที่เปิดสาธารณะ · ค่าลับที่ workload อื่นอ่านได้ · ระบบตั้งค่าที่ล้มแล้วเปิดทาง
- ส่วนใหญ่อยู่นอก repo จึงมักเป็น `needs_validation` · IaC ที่อยู่ใน repo (Terraform · compose · Kubernetes YAML) ตรวจได้จริง ใช้ผล `trivy config` เป็น candidate

## 10 · ทรัพยากรหมดหรือระบบล่ม (ยังไม่มีไฟล์ตามสาย)

- ล่า: regex หรือ parser ที่ช้าแบบทวีคูณกับ input บางแบบ · ไฟล์บีบอัดที่แตกแล้วใหญ่มาก · query ที่ไม่มี limit หรือ N+1 จาก input · งานหนักที่ทำก่อน login · quota ที่นับผิดขอบเขตหรือรีเซ็ตได้ · retry ที่ทวีคูณ · ข้อความเสีย 1 ชิ้นที่ทำคิวค้างทั้งคิว
- กติกา: ต้องชี้ได้ว่าผู้ใช้คนหนึ่งทำให้คนอื่นใช้ระบบไม่ได้ หรือทำให้เจ้าของเสียเงินค่า cloud หรือ LLM · งานหนักที่กระทบแค่ตัวเองไม่ใช่ finding · ห้ามพิสูจน์ด้วยการยิงระบบจริง ให้วัดในห้องด้วย input เล็กที่เห็นการโตแบบทวีคูณ
- `class`: `redos` · `decompression-bomb` · `unbounded-query` · `preauth-work` · `quota-bypass` · `poison-message`
