# Changelog — software-company

## 2.29.0 — 2026-10-27

- `llm-engineering` reference ใหม่ `deep-research-system.md`: สร้างระบบ Deep Research Agent เป็นผลิตภัณฑ์ (planner → คิว → worker → ตรวจอ้างอิง → writer · งบ token และโควตาต่อผู้ใช้ · browser agent ใน sandbox และ prompt injection · ตัวชี้วัด) ชี้ `kafka-streaming` · `kubernetes-helm` (KEDA) · `observability-basics` · ที่มาเปิดอ่าน 2026-10-27 (Anthropic multi-agent research system · GPT Researcher · open_deep_research · STORM · OWASP LLM01 · RFC 9309)

## 2.28.0 — 2026-10-27

- skill ใหม่ 4 ตัว (ทุกข้อมูลรุ่นและค่าตั้งมีลิงก์ทางการ ตรวจ 2026-10-27 · ข้อที่ยังไม่ได้ตรวจติดป้ายในไฟล์):
  - `kubernetes-helm` — Dockerfile ใช้งานจริง · manifest · Helm chart · staging → production ด้วย image digest เดียวกัน · GPU node pool · KEDA ขยาย worker ตามงานค้างในคิว · Helm 4 ใช้ `--rollback-on-failure` แทน `--atomic`
  - `kafka-streaming` — topic · key ต่อ entity · producer `acks=all` + idempotent · outbox · consumer commit หลังทำเสร็จ · dead letter · schema · event ไม่ใส่ข้อมูลส่วนบุคคล
  - `jenkins-pipeline` — Jenkinsfile แบบ declarative · ค่าลับใช้ single quote · tag ด้วย commit SHA · input อนุมัติ production จำกัดผู้อนุมัติ · หลักการทั่วไปชี้ `cicd-and-release`
  - `voice-agent` — voice agent ภาษาไทยแบบ realtime: SIP/WebRTC · VAD · STT/TTS streaming · พูดแทรก (barge-in) · งบ latency ต่อช่วง · PDPA ของการอัดเสียง
- `observability-basics` เพิ่ม Prometheus/Grafana (`references/prometheus-grafana.md`): label ที่ค่าไม่จำกัด · PromQL p95 · กฎ alert · dashboard เป็นโค้ด
- `mcp-server` เพิ่มตาราง MCP ทางการของ Kafka · Docker · Jenkins · Kubernetes/Helm · Prometheus · Grafana (`references/devops-mcp.md`) พร้อมวิธีเปิดใน `.mcp.json` ของโปรเจกต์ เริ่มจากสิทธิ์อ่านอย่างเดียว ไม่ฝังใน plugin
- เคส eval 3 ตัวต่อ skill ใหม่ · เคส regression มาจากรอบแดง 2026-10-27 (agent ไม่มี skill ทำโจทย์เดียวกัน)
- ตารางตัวกระตุ้นของ superuser สาขา และ agent `devops-engineer` ชี้ skill ใหม่

## 2.27.1 — 2026-10-27

- ไอคอนประจำ plugin `assets/icon.png` (512) และ `assets/icon.svg` · ช่อง `icon` ใน plugin.json (ใช้ในหน้ารายการของ directory) · ทำตาม `design-references`: ค้นต้นแบบบน Dribbble แล้วถอดสีหลักจากงานต้นแบบ หมุนเฉดต่อ plugin · ผ่าน design-critic

## 2.27.0 — 2026-10-27

- skill ออกแบบ 14 ตัว (`ui-craft` · `web-app-design` · `mobile-app-design` · `windows-app-design` · `presentation-design` · `html-slide-deck` · `pptx-to-html-deck` · `branded-document-design` · `markdown-report-docx` · `doc-cover-design` · `diagram-figures` · `dynamic-website` · `graphic-design` · `markdown-visuals`) และ agent `ux-designer` `graphic-designer`: ขั้นแรกค้นต้นแบบสดตาม `design-references` (superuser) แล้วถอดสีจากงานที่เลือก · สีบ้านหรือคลังเป็นตัวสำรอง
- `design-direction-lookup`: สีจากการค้นสดมาก่อนเสมอ · `--palette` รับ 8 หน้าที่ (bg · surface · text · text_muted · primary · secondary · accent · border) แบบมีชื่อหรือเรียงสี · ไม่ส่งสีมาใช้คลังใน data/ พร้อมคำเตือนใน DESIGN.md · หาอุตสาหกรรมไม่เจอใช้ `custom` · self-test 22/22 · holdout 20/20

## 2.26.0 — 2026-10-26

- `design-direction-lookup`: ขั้นใหม่ "ดูสีจากธุรกิจจริง" · `brand_colors.py` ดึงสีจากเว็บธุรกิจจริงในวงการ (กันที่อยู่ภายในเครือข่ายและ DNS rebinding · จำกัดขนาดและเวลา · ตัดสีตั้งต้นของ Bootstrap Swiper WordPress) · `brand_palette.py` สร้างพาเลตจากสีที่พบแล้วเลื่อนเฉดไม่ให้เหมือนคู่แข่ง · ตัวร่างรับ `--extra-palettes` `--palettes` และโจทย์ที่ไม่มีในรายการอุตสาหกรรม · ข้อมูลใน `data/` เป็นค่าสำรองทบทวนทุก 6 เดือน (ทดสอบเว็บร้านกาแฟจริง 4 เว็บ 2026-10-26)
- `design-direction-lookup` ข้อมูล: 33 อุตสาหกรรมที่ 3 พาเลตโทนเดียวกันได้พาเลตที่ต่างกันจริงและเข้าวงการ · พาเลตใหม่ 12 ตัว · แก้คำว่า "ยกระดับ" ใน look material-3 ที่ทำให้ตัวร่างหยุด 9 อุตสาหกรรม · look ที่ไม่มีเงา (luxury · material-3) ได้การ์ดไม่มีเงาตามที่ตั้งใจ (เดิมได้เงาผิด ผลร่างของ look นี้จึงเปลี่ยน)

## 2.25.1 — 2026-10-26

- `html-slide-deck`: สีสว่างประจำบ้าน `5B9BE6` บนพื้นขาวได้แค่ 2.89:1 จึงให้ใช้ `--brand 2A78D6,1F5FAF` เมื่อเด็คเป็นพื้นสว่าง · `presentation-design` เช็กลิสต์บูลเล็ตตรงกับตารางงบต่อแผ่น (6 ข้อ · ข้อละไม่เกิน 2 บรรทัด)

## 2.25.0 — 2026-10-26

- `security-audit` (`classes-thai.md`): GB Prime Pay ทุกช่องทางที่เปิดอ่าน (QR · บัตร · ผ่อน · wallet · mobile banking · bill payment) ไม่มีลายเซ็นในข้อความแจ้งกลับ · วิธีลงชื่อ webhook ของ Ksher (GET · HMAC-SHA256 ด้วย token · `message` ไม่มียอดเงินจึงต้องดึงสถานะซ้ำ) · บริการตรวจสลิป (SCB · EasySlip · SlipOK) และสิ่งที่ตัวตรวจโค้ดต้องเห็น 6 ข้อ
- `design-direction-lookup`: การ์ดตัวอย่างของแต่ละแนวเปลี่ยนตาม depth และ density ของ look (เดิมทุกแนวใช้การ์ดเดียวกัน) · สีหลักของ 2 แนวห่างกันไม่ถึงระยะ RGB 30 ให้สลับไปพาเลตที่เกี่ยวกับอุตสาหกรรม ไม่มีให้เตือนใน DESIGN.md (ตรวจทั้ง 69 อุตสาหกรรม: สลับได้ 16 · ยังเตือน 28 เพราะ `industries.csv` ใส่พาเลตโทนเดียวกัน) · ใบอนุญาตฟอนต์ SIPA 11 แถวใส่แหล่งรอง (Fedora · fonts-tlwg เพราะไม่พบข้อความทางการของ SIPA) อีก 3 แถวยังไม่ได้ตรวจ · กฎ stack 11 ข้อกับ ux-085 ใส่แหล่งทางการแล้ว · flutter-22 ครอบคลุม iOS
- `dynamic-website`: ตัวบท GSAP Standard License (ห้ามเฉพาะเครื่องมือสร้างแอนิเมชันแบบไม่เขียนโค้ดที่แข่งกับ Webflow) · path plugin บน cdnjs 3.15.0 ตอบ 200 ครบ
- `thai-marketplace-apis.md` และ `thai-accounting-apis.md`: ตรวจซ้ำราคาแพ็กเกจที่ใช้ API ของ PEAK และ FlowAccount · rate limit รายงานงบทดลองของ PEAK · อายุ timestamp ของ Lazada (7200 วินาที) และ TikTok Shop (5 นาที) · rate limit ของ Lazada (10 qps ต่อร้านใน GetSellerItemLimit) และ TikTok Shop (dynamic QPS) · ผู้พัฒนาที่สมัครได้ของ 3 แพลตฟอร์ม · เหลือ rate limit ของ Shopee ที่เอกสารไม่ระบุ

## 2.24.1 — 2026-10-26

- `security-audit` (`classes-thai.md`): GB Prime Pay ตรวจจากเอกสารทางการแล้ว · ข้อความที่ส่งเข้า background URL ไม่มีลายเซ็น ต้องดึงสถานะซ้ำด้วย `/v1/check_status_txn` แล้วเทียบสถานะและยอด · plugin ทางการไม่ดึงซ้ำ · `gateway-no-refetch` บอกว่าเจ้าที่ไม่ลงชื่อ การดึงซ้ำเป็นทางเดียวที่กันปลอม

## 2.24.0 — 2026-10-26

- `llm-engineering`: reference ใหม่ `agent-systems.md` สำหรับสร้างระบบ agent ในผลิตภัณฑ์ · เมื่อไหร่ไม่ควรใช้ agent · Loop · Graph · Dynamic ในโค้ด · progress ledger · 3 กลไกที่ทุก framework มี (เพดานรอบแยกจากเงื่อนไขผ่าน · จุดรวมหลังแยก · checkpoint หยุดรอคนแล้วทำต่อ) · เลือก framework ตามภาษาพร้อมสถานะ 2026 (AutoGen archive · Semantic Kernel ย้ายไป Microsoft Agent Framework · Bedrock Agents Classic maintenance · ADK 2.0) · ต้นทุน token · 8 กรณีใช้จริงพร้อมป้ายหลักฐาน · เปิดแหล่งจริง 2026-10-26
- `llm-evaluation-patterns`: หัวข้อ eval ของ agent (เลือก tool · เส้นทาง · สำเร็จกี่ % · ต้นทุนต่องาน) · `agent-llm-architect`: เกณฑ์หยุดเป็นเพดานรอบ งบ token หรือไม่ดีขึ้น 2 รอบ แล้วแต่อย่างไหนถึงก่อน
- `background-jobs` หัวข้อ 9: durable workflow (Temporal · Step Functions) สำหรับงาน agent ที่รันยาวหรือรอคนอนุมัติ · กฎ replay ตรวจกับเอกสาร Temporal 2026-10-26 · agent `ai-engineer` ชี้ไป agent-systems

## 2.23.0 — 2026-10-26

- skill ใหม่ `security-audit`: ตรวจช่องโหว่ทั้งระบบก่อนส่งมอบ 6 ขั้น (สำรวจ · รายการครอบคลุม · ล่า · ตรวจช่องว่าง · ยืนยันโดยตัวใหม่ที่พยายามหักล้าง · ตรวจ record รอบสุดท้าย) · 3 คำตัดสิน confirmed · needs_validation (ไม่มีระดับ ต้องบอกสิ่งที่ขาด) · rejected · ระดับไม่เกินผลกระทบที่พิสูจน์ · hardening ไม่นับเป็น finding · ผล `findings.json` และ `ledger.json` พร้อมตัวตรวจ Node ที่รันบน Windows ได้ (self-test 28/28 · 11/11 · 9/9) และรายงานภาษาไทยที่มีภาษาเจ้าของกิจการ แถว A01–A10 และป้าย PDPA · ประเภทการโจมตีของระบบไทย (ลายเซ็น LINE · ID token ของ LIFF · webhook Omise และ 2C2P · สลิป PromptPay · e-Tax Invoice) ตรวจกับเอกสารทางการ 2026-10-26 · แนวคิดจาก cloudflare/security-audit-skill (MIT) เขียนใหม่ทั้งหมด ไม่คัดข้อความ
  - รอบแดง 2026-10-26 (agent ไม่มี skill ตรวจ repo ทดสอบ): ให้ระดับสูงกับ webhook ที่พึ่ง nginx นอก repo · นับ header ที่ขาดบน API JSON เป็นช่องโหว่ · ไม่มีผู้ยืนยัน · รอบเขียว: IDOR confirmed พร้อม PDPA · webhook เป็น needs_validation ไม่มีระดับ · header ไปอยู่ hardening · ผู้ยืนยัน 4 ตัวแยกจากผู้ล่า
- skill ใหม่ `design-direction-lookup`: ตารางค้นได้สำหรับเริ่มหน้าตา ฟอนต์ไทย 49 · คู่ฟอนต์ไทย-ละติน 37 · look 15 · ชุดสี 68 ชุด ทั้งโหมดสว่างและมืดที่ผ่าน contrast และไม่ใช้สี Tailwind · อุตสาหกรรม 69 (ไทยก่อน) · กฎ UX 146 (กฎไทย 40) · กราฟ 28 · landing 18 · กฎ 7 stack (React · Angular · Blazor · ASP.NET MVC · Flutter · LINE LIFF · PWA) · ตัวค้นที่ตัดคำไทยได้ (holdout 20/20 · ก่อนปรับตัวค้น 19/20) · ตัวร่าง 3 แนวที่ตัดแนว contrast ไม่ผ่าน Inter และฟอนต์ไทยที่ไม่มีคู่ละตินทิ้งก่อนเขียน `docs/DESIGN.md` และหน้าเทียบ · ตัวตรวจข้อมูล `check_data.py` · แนวคิดจาก nextlevelbuilder/ui-ux-pro-max-skill (MIT) ข้อมูลเขียนใหม่ทั้งหมด
  - รอบแดง 2026-10-26 (โจทย์ร้านทองเยาวราช ไม่มี skill): ใช้ Noto Sans Thai คู่ Inter · ไม่ได้ตรวจ contrast และใบอนุญาตฟอนต์
- `ui-craft` ข้อ 0.1 ขั้น 3 · `security-gate` ข้อ 3 · agent `security-engineer` และ `ux-designer` · ตัวกระตุ้นของ `superuser` ชี้ไป skill ใหม่ทั้ง 2 ตัว · `security-gate`: `ยังไม่ยืนยัน` ไม่ติดระดับ · eval ใหม่ 6 เคสในโฟลเดอร์ `evals/` (เคส security ใช้ repo ทดสอบ `shop-api` ที่ฝังช่องโหว่ไว้)

## 2.22.1 — 2026-10-26

- ไอคอน ✅ ❌ ⚠ ราว 1,870 บรรทัดเปลี่ยนเป็นคำตามที่ `human-writing` ห้าม (ตารางใช่/ไม่ใช้ ✓ ✗ · คู่ตัวอย่างใช้ ผิด:/ถูก: · รายการ Anti-patterns ตัดไอคอนออก) · เหลือ 3 จุดใน `pptx-to-html-deck` ที่อ้างข้อความที่สคริปต์พิมพ์จริง

## 2.22.0 — 2026-10-25

- `superuser` ตัวกระตุ้น: แถวใหม่สำหรับปกชุดเอกสาร BRD · SRS · FSD ที่มาจากรูปทรงโลโก้หรือ mockup จริง ชี้ไป `doc-cover-design` (ก่อนหน้านี้ไม่มีตัวกระตุ้นที่ไหนชี้ไป skill นี้ · เอกสารทั่วไปมีแถวในตารางของแกนอยู่แล้ว)
- playbook `ship` ขั้น 9: ผู้ใช้อนุมัติ merge แล้วลบ branch ในขั้นเดียวกันด้วย `gh pr merge --delete-branch` ไม่ถามซ้ำ · `cicd-and-release` ข้อ 4 เพิ่มกฎลบ branch หลัง merge และตั้งค่าลบเองบน GitHub
- `ui-craft`: สคริปต์ใหม่ `scripts/design_tokens.py` ร่าง `docs/DESIGN.md` จาก css ที่โปรเจกต์มีอยู่ (token · สี · ฟอนต์ · ขนาด · ระยะ · มุม · เงา · breakpoint) พร้อมจุดที่หลุดสเกลของข้อ 1–2 · ไม่เขียนทับไฟล์เดิม · self-test 9/9 · ข้อ 0 เรียกใช้ก่อนลอกหน้าตาเดิม · reference ใหม่ `live-and-variants.md` (ลองค่าสดในเบราว์เซอร์ · 3 แบบของชิ้นเดียวในไฟล์ mockup เดิม) · ข้อ 7 จังหวะให้ยิ้มได้ 1 จุดต่อ flow · เช็กลิสต์เพิ่มข้อมูลยากของจริง เน็ตช้า และเป้ากด 44px · แนวคิดจากคำสั่ง `document` `live` `generate` `delight` `harden` ของ pbakaus/impeccable (Apache-2.0 · ตรวจ 2026-10-25) เขียนใหม่ ไม่คัดข้อความ
- agent `image-artist` ย้ายไป `graphic-design` · ที่อ้างถึงเปลี่ยนเป็น `graphic-design:image-artist` · `graphic-designer` ตัด "LINE rich menu" ออกจากคำอธิบาย (skill อยู่ graphic-design แล้ว)
- `reverse-engineering` รับเนื้อหาจาก plugin `reverse-engineer` ที่ยุบแล้ว: reference ใหม่ `firmware.md` (Binwalk · Unblob) · `web-and-network.md` เพิ่ม mitmproxy · tshark · robots.txt · `android-apk.md` เพิ่มขั้น ADB พร้อมกฎขออนุญาตแยก · `native-binaries.md` เพิ่มตัวเลือก ilspycmd และชุดผลของ Ghidra · `tools.json` 12 เครื่องมือพร้อมแหล่งติดตั้งทางการ และ `scripts/check-tools.mjs` ตรวจว่าเครื่องมีอะไรโดยไม่ดาวน์โหลด · แม่แบบรายงาน 4 ไฟล์ใน `templates/` · กฎทำบนสำเนา + SHA-256
- `reverse-engineering` สคริปต์ใหม่ 5 ตัว (Python มาตรฐานล้วน อ่านอย่างเดียว ไม่ดาวน์โหลด): `dotnet_meta.py` รายชื่อ class · method · P/Invoke ของ .NET โดยไม่ต้องมี ilspycmd (จำนวน type และ method ตรงกับ .NET reflection บน System.Configuration.dll) · `wasm_info.py` · `sqlite_inspect.py` (ปิดค่าลับในแถวตัวอย่าง) · `ipa_inventory.py` (iOS) · `evm_selectors.py` (smart contract · keccak256 ในตัว) · 4 ตัวหลังมี `--self-test` ส่วน `dotnet_meta.py` ยังไม่มี (ตรวจกับ .NET reflection แทน)
- agent `reverse-engineer` รับกฎจาก `reverse-engineer-analyst`: ตรวจเครื่องมือก่อนเริ่ม · ขออนุญาตก่อนดักทราฟฟิก ใช้ adb หรือ flash · 1 agent ต่อ 1 เป้าหมาย
- คำสั่ง `/reverse-engineer:re` เลิกแล้ว ใช้ skill `reverse-engineering` หรือสั่ง agent `reverse-engineer` แทน
- ผู้ที่ติดตั้ง plugin `reverse-engineer` ไว้: `/plugin uninstall reverse-engineer` · ใช้ skill `software-company:reverse-engineering` และ agent `software-company:reverse-engineer` แทน

- `logging-standards`: โค้ด logger ทั้ง Node และ Python ตัด `\r\n\t` ออกจากข้อความหลักด้วย (เดิมตัดแค่ค่า ทำให้ปลอมบรรทัด log ได้) · รันทดสอบจริง 2026-10-25
- `doc-cover-design` ข้อ 7: ลูกทีมเปิด agent ต่อเองไม่ได้ → ผู้ออกแบบส่งปก 3 แบบเป็นไฟล์ หัวหน้าทีมเปิดผู้ตรวจโหวต (บทเรียน Speak Go 2026-10-15)

## 2.21.0 — 2026-10-23

- reference ใหม่ 4 ไฟล์ (ข้อเท็จจริงจากเอกสารทางการที่เปิดตรวจ 2026-10-23 · ที่หาไม่พบติด (ยังไม่ได้ตรวจ)) — `ui-craft` → `references/figma-to-code.md`: Figma MCP server แบบ remote กับ desktop · แผนและโควตาตามที่นั่ง · variables → token · component → mockup HTML · เมื่อไหร่ข้าม Figma · `project-doc-set` → `references/docs-site.md` (ลิงก์จาก `technical-writer` ด้วย): เทียบ MkDocs Material · Docusaurus · Starlight · VitePress · ผลทดสอบค้นหาภาษาไทย (Pagefind 6/9 · lunr-languages 6/9 · MiniSearch ค่าตั้งต้น 0/9 · MiniSearch + Intl.Segmenter 9/9) · `data-import-export` → `references/thai-accounting-apis.md`: PEAK · FlowAccount (แพ็กเกจ · token · ลายเซ็น · UAT · rate limit · webhook) · TRCLOUD · AccRevo · Express · `ecommerce-patterns` → `references/thai-marketplace-apis.md`: Shopee · Lazada · TikTok Shop (สมัคร · ลายเซ็น · token · endpoint ออเดอร์ สต็อก ส่งของ · webhook · sandbox) · LINE SHOPPING กับ LINE Pay ไทย · ZORT · BentoWeb · BigSeller
- skill ใหม่ `infra-as-code` — สร้างเครื่องและฐานข้อมูลบนคลาวด์จากโค้ด: เมื่อไหร่คุ้มกว่า VM เดียว + docker compose · OpenTofu (MPL-2.0 · Linux Foundation · CNCF Sandbox) เป็นค่าเริ่มต้น เทียบ Terraform (BSL 1.1 ตั้งแต่ 1.6.0) และ Pulumi · state มีล็อก (`use_lockfile`) และเลี่ยงค่าลับใน state · แปะ plan ใน PR และ apply production รออนุมัติ · drift ด้วย `-detailed-exitcode` · budget แค่เตือนไม่หยุดจ่าย · region ในไทย (AWS `ap-southeast-7` · Google Cloud `asia-southeast3` · Azure ยังไม่มี) · Kubernetes เมื่อทีมดูแลไหว · ชี้ skill ของผู้ขาย (azure-skills · hashicorp/agent-skills · aws/agent-toolkit-for-aws) · ตัวอย่าง OpenTofu 1 VM + 1 DB ผ่าน `tofu validate` · ตรวจ 2026-10-23
- skill ใหม่ `data-analysis` — ตอบคำถามธุรกิจจาก CSV · Excel · SQL export: เริ่มจากการตัดสินใจที่ตัวเลขจะเปลี่ยน · ทำความสะอาดไฟล์ไทย (utf-8-sig/cp874 · พ.ศ. · ตัวคั่นหลักพัน · เลขไทย · ช่องว่างกับ 0 กับ `-`) · สคริปต์รันซ้ำได้ ทุกบรรทัดผลมีรหัส `[Fn]` ให้ข้อค้นพบอ้าง · กราฟ 1 รูป 1 ข้อความ ฟอนต์ Sarabun และ matplotlib 3.11 ขึ้นไป (3.10 วรรณยุกต์ซ้อนสระบนหาย) · ข้อจำกัด (ขนาดตัวอย่าง · ข้อมูลหาย · ความสัมพันธ์ไม่ใช่เหตุ) · PDPA (ข้อมูลรวมหรือแฝงชื่อ · ไม่วางข้อมูลส่วนบุคคลใน prompt) · ตัวอย่างจริงใน `assets/` (ข้อมูลตัวอย่าง 72 แถว → 3 ข้อค้นพบ คิดซ้ำด้วย `csv` ล้วนตรงกัน)
- รับ skill 8 ตัวจาก `doc-toolkit` ที่ยุบ: `diagram-figures` · `markdown-visuals` · `markdown-report-docx` · `branded-document-design` · `presentation-design` · `html-slide-deck` · `pptx-to-html-deck` · `product-naming` (ชื่อเดิม · ส่วนที่เพิ่มภายหลังอยู่ในข้อส่วนเสริมด้านล่าง) · ตัด dependency `doc-toolkit`

- skill ใหม่ `dynamic-website` — เว็บการตลาดหรือหน้างานที่เล่าเรื่องทีละบทด้วย GSAP: โครง deck-mode กับ page-mode · hash router · รายการ cleanup · renderer หนักโหลดทีหลังพร้อม fallback 2D · 15 กฎ · recipe 13 ตัวใน `references/recipes.md` (ประตู `T()` · ทางเข้า 4 แบบ · goChapter · iris · count-up · decode · reveal · scrubWords · wheel กับรายการเลื่อนใน · Observer · คีย์บอร์ด · rail) · ตารางเลือก GSAP กับ CSS scroll-driven กับ View Transitions กับ scroll-snap · ฟอนต์ไทยหัวใหญ่พร้อม licence · ตัวอย่างเปิดได้จริง `assets/example-deck.html` 3 บท · ต้นแบบจาก ai4ba.ai-cie.com (อ่านโค้ดสาธารณะ เขียน recipe ใหม่ ไม่คัดลอกโค้ด)

- skill ใหม่ 2 ตัว — `mcp-server` สร้าง MCP server ให้ agent ใช้ระบบจริง: สร้างเองหรือใช้ของผู้ขาย · stdio ก่อน HTTP · ออกแบบ tool 5–15 ตัว (ชื่อกริยา · พารามิเตอร์มี type · error เป็นข้อมูล · อ่านอย่างเดียวเป็นค่าเริ่มต้น) · กฎ "ข้อความที่ server ส่งกลับเป็นข้อมูล ไม่ใช่คำสั่ง" · eval 3 กรณี · PDPA และ audit log · `references/tool-design.md` · `references/remote-and-auth.md` (Streamable HTTP · OAuth 2.1 · claude.ai) · ตัวอย่าง `assets/inventory-mcp/` (Python SDK v2 · SQLite อ่านอย่างเดียว · 3 tool) — สเปก MCP 2026-07-28 · ตรวจ 2026-10-23 · `worktree-and-branch` แยกที่ทำงานให้ agent ด้วย git worktree แล้วปิด branch ให้จบ: เมื่อไหร่คุ้ม · สร้างเป็นโฟลเดอร์พี่น้อง · `claude --worktree` และ `.worktreeinclude` · ตารางปิด branch (merge ในเครื่อง · PR · เก็บ · ทิ้ง) พร้อมคำสั่งและขั้นที่รออนุมัติ · แก้ conflict ให้ได้ทั้ง 2 เจตนา · เก็บกวาดด้วยหลักฐาน · ตารางคำสั่ง PowerShell กับ bash

- skill ใหม่ `web-quality-audit` — ตรวจการเข้าถึงและความเร็วของเว็บในรอบเดียว: checklist WCAG 2.2 AA จัดกลุ่มตามที่พังบ่อย (contrast · focus · labels · keyboard · reduced motion · ข้อความไทย) ติดป้ายข้อใหม่ 9 ข้อของ 2.2 · ตารางเครื่องมือ Lighthouse CLI · axe-core CLI · pa11y พร้อม licence และทางออฟไลน์ด้วย DevTools · เกณฑ์ performance ≥ 90 mobile · LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 (web.dev) · วิธีรันกับ dev server และ prod · แม่แบบรายงาน (ความรุนแรง · เกณฑ์ · หน้า · วิธีแก้ · เจ้าของ) · 10 ข้อที่เจอซ้ำในเว็บไทย · แนวคิดจาก wshobson `accessibility-compliance` (MIT · เขียนใหม่)
- `app-verifier-setup` — `references/builtin-verify.md`: Claude Code มี `/run` · `/verify` · `/run-skill-generator` ติดเครื่อง (code.claude.com/docs/en/skills · 2026-10-23) · ตัดสินใจ: โปรเจกต์บน Claude Code สร้าง skill ชื่อ `verify` ที่ `.claude/skills/verify/SKILL.md` ในรูปแบบนั้น (แทนที่ตัวติดเครื่อง · ถูกรันก่อน commit) แล้วเติมสัญญาสำหรับทดสอบ · แผนที่ฟีเจอร์ · การพิสูจน์ว่าจับของผิดได้ · ลิงก์จาก `app-verifier-upkeep`
- `spec-to-code-loop` — รับคำว่า TDD · test-driven · "เขียน test ก่อน" ใน description และย่อหน้าเทียบ red→green→refactor กับวงรอบต่อ 1 ข้อกำหนด · ตัวกระตุ้นใหม่ TDD → `spec-to-code-loop` + `testing-standards` · ตัวกระตุ้น `web-quality-audit`
- `legacy-spec-recovery` — `references/framework-upgrade.md`: playbook อัปเกรด framework ต่อ stack (.NET Framework → .NET 8 · Angular major · Python 2 → 3 / Django LTS · Node LTS): inventory → compatibility matrix → spike บน worktree → `principle-replace-then-delete` → หลักฐาน regression · คู่มือทางการตรวจว่าเปิดได้ 2026-10-23 · ลิงก์จาก `principle-replace-then-delete`
- `api-conventions` — `references/contract-testing.md`: OpenAPI เป็นสัญญา · Schemathesis (MIT) · Prism (Apache-2.0) · Dredd เลิกดูแลแล้ว · Pact เมื่อผู้เรียกแยกทีม · `oasdiff breaking` ทุก PR · ลิงก์จาก §11 และ `web-service-essentials` §9
- ทิศทางภาพและความลึก (จากงานค้นคว้า 2026-10-22): `ui-craft` ใหม่ `references/web-looks.md` 11 look (อารมณ์ · ความกล้าที่เข้าทาง · ตัวอย่างจริง 2 ชิ้นที่เปิดตรวจ 2026-10-23 · token ตั้งต้น · คำเตือน · ชื่อ look ใช้คำเรียกของ bergside/awesome-design-skills (MIT) ไม่ใช้กฎของชุดนั้น) และ `references/depth-and-flourish.md` (หลัก 6 ข้อจาก Refactoring UI · Josh Comeau · Vercel guidelines · ภาษาความลึก 4 แบบ เลือกภาษาเดียว · สูตร CSS/SVG 10 ข้อเขียนเอง · Baseline ตาม MDN 2026-10-23) · ข้อ 0.1 ขั้น 2 ไม่มีแอปอ้างอิงให้เลือกจาก Siteinspire หรือ Awwwards · ขั้น 3 ทุกแนวบอก look และความกล้า 1 จุด (แนวคิดจาก anthropics/skills `frontend-design` · Apache-2.0) · ข้อ 9 ผู้ตรวจตอบ "กล้าขึ้นหรือเงียบลง" (จาก pbakaus/impeccable · Apache-2.0) และเว็บสาธารณะส่ง `graphic-design:design-critic` ด้วยเสมอ · `web-app-design` `tokens.md` เพิ่ม `--shadow-color` · `--elev-1` ถึง `--elev-3` เงา 2 ส่วน · สูตรมุมซ้อน · `dynamic-website` ข้อ 6 กฎคู่ไทยกับละติน และแก้ IBM Plex Sans Thai เป็นไม่มีหัว
- ส่วนเสริมจากการเทียบตัวต่อตัวกับ skill เปิด (2026-10-22 · เขียนใหม่ด้วยคำเรา ระบุที่มาในไฟล์) แยกตามหมวด:
  - เอกสารและแผนงาน: `srs-writing` หัวข้อการจัดสรรข้อกำหนด (ISO 29148 ข้อ 2.6) และระบบที่มี AI/ML 6 ข้อ พร้อมตารางเลือกหัวข้อตามชนิดโปรเจกต์ · `fsd-writing` เทียบ FSD กับโค้ดจริง · `user-story-writer` ช่อง `Blocked by` แทน `Dependencies` · `product-roadmap` เกณฑ์สำเร็จเป็นผลลัพธ์พร้อม counter-metric · `architecture-review` ไล่ 6 มุมมองและให้คะแนนความเสี่ยงจากหลักฐาน · `adr-writer` ดัชนี ADR และวิธียืนยันว่ายังทำตาม · `reference-app-research` ทะเบียนแหล่ง · `release-notes` breaking change ต้องบอกว่าเปลี่ยนอะไร ใครโดน ย้ายอย่างไร · `pr-description-template` หัวข้อ `Evidence` และ `Merge Danger` · `project-doc-set` แม่แบบ Release Notes ภาษาไทย · agent `technical-writer` เกณฑ์นับคำใช้กับภาษาอังกฤษเท่านั้น
  - โค้ด รีวิว และ test: `bug-report` ทำซ้ำเองก่อนเชื่อและปัดข้ออ้าง 4 แบบ · `bug-inbox-triage` เช็กก่อนว่าแก้ไปแล้วหรือยัง · `code-review` ล็อกช่วง commit ด้วย SHA และโต้ข้อค้นพบด้วยหลักฐาน · `commit-message-format` วัดแบบแผนของ repo ก่อนเขียน · `blast-radius` เทียบแผนกับ diff จริงหลังแก้ · `code-orientation` รายการตรวจแบบแผนก่อนแก้โค้ด · `testing-standards` ต้องบอกได้ว่าโค้ดเปลี่ยนตรงไหน test จะแดง และลองพังในหัว 5 แบบ · `spec-to-code-loop` ตรวจแผนเอง 5 ข้อ · `coding-evals` รายงาน pass@k คู่กับ pass^k · `e2e-testing-patterns` test ที่กักไว้ต้องมีวันหมดอายุ · `feature-kickoff` หัว task 3 บรรทัด (Files · Interfaces · Failing test) · `readable-code` · `lazy-coding` · `code-gardener` · `onboard` กฎย่อยเรื่องชื่อ การลบ และการรัน README บนเครื่องสะอาด · playbook `feature` และ `ship` มีตารางข้ออ้างที่เจอบ่อยพร้อมความจริง
  - ความปลอดภัย: `security-gate` เลือกชุดกฎ semgrep ตามภาษาและรายงานสิ่งที่ไม่ได้รันก่อนคำตัดสิน · reference ใหม่ `security-gate/references/dependency-updates.md` (สแกน · จัดกลุ่มตามความเสี่ยงจริง · อัปเดตทีละขั้น · พิสูจน์ก่อนปิด) · `owasp-top10` 1 ช่องโหว่ต่อ 1 รายการพร้อมระดับ ASVS · `threat-model` โหมดเพิ่มทีละส่วน · สิ่งที่ระบบต้องทำไม่ได้ · STRIDE ต่อ data flow · `config-and-secrets` gitleaks เป็น pre-commit hook และรันซ้ำใน CI · `docker-sandbox` mount ที่ไม่ต้องเขียนใส่ `:ro` · `principle-secure-by-default` ลิงก์ OWASP Cheat Sheet (ลิงก์อย่างเดียว เพราะ CC-BY-SA) · `legacy-spec-recovery` และ `reverse-engineering` ตั้ง `allowed-tools`
  - ระบบที่รันอยู่: `observability-basics` งบความผิดพลาดและ burn rate แจ้งเตือน 3 ระดับ (14.4 · 6 · 1) · `incident-response` ตารางอัปเดตแยกกลุ่มผู้รับ (ทีม · ผู้บริหาร · ลูกค้า · PDPC ภายใน 72 ชั่วโมง) · `incident-runbook-template` ทุกขั้นแก้ต้องมี VERIFY และตัวตรวจคำสั่งเสื่อมใน CI · `postmortem-template` ช่อง `Trigger` และแบบย่อสำหรับเหตุเล็ก · `cicd-and-release` ตารางอาการที่เจอบ่อย 5 แถว · `web-service-essentials` ตัวอย่าง liveness · readiness · startup probe ของ Kubernetes
  - API ข้อมูล และ stack: `api-conventions` เช็กลิสต์ก่อนปล่อย endpoint ใหม่ · `api-design` แก้สเปกก่อนโค้ด · `error-handling-patterns` ตรวจก่อนส่ง 5 ข้อ · `background-jobs` สถานะงานเป็นเครื่องสถานะ · `database-design` กับดัก PostgreSQL 9 ข้อพร้อมเลขรุ่น · `stack-sql` partial index และตารางบวม · `stack-dotnet` ผลล้มที่คาดได้คืนเป็น `Result<T>` · `stack-python` จัดแพ็กเกจด้วย `uv add` และสคริปต์ PEP 723 · `stack-typescript` ลิงก์ Vercel `react-best-practices` · `stack-mql` กับดัก 6 ข้อ · `mobile-engineering` ตารางเลือก Expo หรือ bare React Native
  - งานเฉพาะสาขา: `llm-engineering` query transform ของ RAG 4 แบบ · `legal-document-systems` ข้อสัญญาตายตัว 10 ข้อพร้อมธง RED · YELLOW · GREEN · `smart-contracts` และ `web3-design` ลำดับตรวจความปลอดภัย 5 ขั้น · `fintech-design` เริ่มจากกวาดหาข้อมูลบัตรที่ PCI-DSS ห้ามเก็บ · `ecommerce-design` เดินทุก control ของ checkout ก่อนตั้งสมมติฐาน · `healthcare-systems` และ `healthcare-design` ลิงก์ anthropics/healthcare `fhir-developer` (ลิงก์อย่างเดียว)
  - ภาษาไทย หน้าจอ และสไลด์: `i18n-and-locale` กฎถ้อยคำไทย · ปี 2 หลัก · เลขไทย และ reference ใหม่ `references/thai-text-tools.md` (PyThaiNLP · ตรวจเลขบัตรประชาชน · ที่อยู่ · เรียงลำดับด้วย ICU · ตัดข้อความที่ขอบ grapheme) · `pdpa-compliance` ตารางมาตราที่อ้างบ่อย · `product-naming` ชื่อไทยทางการตามหลักทับศัพท์ · `ui-craft` กฎถ้อยคำบนหน้าจอ 4 ข้อและตารางร่องรอยที่ฟ้องว่า AI วาด · `web-app-design` token การเคลื่อนไหว `--ease` `--ease-io` · `windows-app-design` ตารางเลือกเงาแอปและขนาดหน้าต่างเริ่มต้น · `seo-audit-checklist` ลำดับแก้ 5 ชั้นและกลุ่มหน้าที่ควรดันก่อน · `html-slide-deck` หน้าต่างผู้พูด (กด `S`) และ `check_deck.py` จับหน้าที่สูงเกิน 1080 px · `presentation-design` งบต่อแผ่นนับเป็นบรรทัดแทนคำ และรายการที่ทำให้ดูเหมือนเด็คสำเร็จรูป
- description ใน `plugin.json` และ `marketplace.json` นับ skill ตรงของจริงแล้ว (95 skill · 29 command · 39 agent) · `observability-basics` ข้อความ "แจ้งเตือน 2 ระดับ" แก้เป็น 3 ระดับให้ตรงกับตาราง

## 2.20.1 — 2026-10-22

- ตรวจ plugin ตามแบบตรวจ: ชื่อ plugin ของ `polished-document-style` · `branded-document-design` · `html-slide-deck` · `pptx-to-html-deck` ชี้ `doc-toolkit` · เลขข้อที่ชี้แกน superuser ผิด · สารบัญให้ reference ยาว 10 ไฟล์ · กฎ `X-Request-Id` ใน `logging-standards` ตรงกับ `web-service-essentials` · SEV1–4 ใน runbook · คำสั่ง test และ git ที่พ่นผลยาวมี `tail`/`head`/`-n` · path ที่ใช้ backslash เปลี่ยนเป็น `/` · คำอธิบาย plugin นับ 81 skill + 29 command

## 2.20.0 — 2026-10-22

- `skills/superuser/SKILL.md` เหลือเฉพาะส่วนของสาขา (กฎเพิ่ม · playbook · agent · รออนุมัติ · ไฟล์กลาง) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" — แกนของหัวหน้าทีมอ่านจาก plugin `superuser` 3.0.0 ที่เดียว ไม่คัดลอกบล็อกกลางอีก (50 KB → ราว 12 KB)
- `dependencies` ใส่ช่วงเวอร์ชัน `{ "name": "superuser", "version": "^3.0" }` และเพิ่ม `{ "name": "doc-toolkit", "version": "^1.0" }` (skill เอกสาร สไลด์ รูป ประชุม 15 ตัวที่ย้ายออกจาก superuser)
- `playbook-review.md` และ `playbook-unattended-run.md` รับบล็อกกลางจาก `superuser` เหมือนสาขาอื่น (ออกจาก `OPT_OUT`) · ส่วนของงานโค้ด (diff · `BUILD-PLAN.md` · commit ทีละชิ้น · worktree · sandbox) อยู่หัวไฟล์และขั้น 1

## 2.19.0 — 2026-10-21

- `html-slide-deck` · `pptx-to-html-deck` ย้ายไปเป็นของกลางใน plugin `superuser` · ใช้ได้เหมือนเดิมทาง `dependencies`

## 2.18.0 — 2026-10-21

- skill ทั่วไป 29 ตัว (หลักการ · ตรวจงาน · แบ่งงาน · เอกสาร · รูป · สไลด์) ย้ายไปเป็นของกลางใน plugin `superuser` · ได้กลับมาทาง `dependencies` เหมือนเดิม
- ส่วนเฉพาะงานโค้ดของ skill เหล่านั้นอยู่ที่ `superuser` → `references/code-extensions.md` · `work-session-context` → `handoff`

## 2.17.0 — 2026-10-21

- ใช้ของกลางจาก plugin `superuser` ทาง `dependencies` (skill `human-writing` · `answer-shape` · `simplify` · `no-ai-look` · `commit-log` · `agent-patterns` · agent `reviewer` · `brainstormer` · `learning-reviewer` · hook) · สำเนาในนี้ย้ายออกแล้ว · zip สำหรับ claude.ai ยังมีของกลางในตัว
- agent โหลด skill หลักตั้งแต่เริ่ม (`skills:` — งานเขียน `human-writing` · งานโค้ด `simplify` · งานภาพ `no-ai-look`)
- แม่แบบเอกสารทุกตัว (runbook · PR · release notes · architecture review · security · SEO · retro · BRD · PRD · test plan …) ไม่มีอีโมจิแล้ว · ระดับความรุนแรงและสถานะใช้คำ ตรงกับ `human-writing`
- diagram ในเอกสารโปรเจกต์ (BRD · SRS · FSD · ADR · ER · flow) ไปที่ `diagram-figures` แบบเดียว · Mermaid เหลือแค่ README · PR · โน้ตในโค้ด (`software-diagrams` · `polished-document-style` · `srs-writing` · `project-doc-set` · `user-story-writer`)
- `polished-document-style` เป็น skill จัดรูปเอกสารทั่วไป (Markdown · Word · PDF) · เพิ่มหัวข้อเอกสาร Office ภาษาไทย · bullet ไม่ซ้อน · คำสถานะ 5 คำ
- คำอธิบายที่ทับกันแยกขอบเขตชัดขึ้น: `commit-message-format` ↔ `commit-log` · `simplicity-first` ↔ `simplify` · `markdown-report-docx` ↔ `thesis-writing` · `graphic-design` ↔ plugin graphic-design · `spell-out-abbreviations`

## 2.16.0 — 2026-10-21

- skill ใหม่ `owasp-top10` — ระบบเว็บแอปและ API ที่ส่งมอบต้องผ่าน OWASP Top 10:2025 (A01–A10): สิ่งที่ต้องมี · วิธีพิสูจน์ (test ชื่อ `A0x_` + เครื่องมือ) · ภาษาเจ้าของกิจการ · วิธีเขียนตาม stack (.NET · TypeScript/Node/Angular · Python · SQL) · แม่แบบรายงานก่อนส่งมอบ · ร่างข้อกำหนดในสัญญาและ NFR ใน SRS
- ผูกเข้างานเดิม: playbook `feature` (ทำตอนเขียน) · `ship` และ `new-project` (รายงานต้องไม่มีข้อไม่ผ่าน) · `security-gate` · `principle-secure-by-default` · `code-review-checklist` · `srs-writing` · ตัวกระตุ้นใน `superuser` · agent `security-engineer` · `developer`
- `threat-model` · `security-scan`: รายการ OWASP เปลี่ยนจากฉบับ 2021 เป็น 2025

## 2.15.0 — 2026-10-21

- `status-report`: `docs/BUILD-PLAN.md` เพิ่ม 3 อย่าง — คอลัมน์ "ใครทำ · ใครตรวจ" (ตารางสถานะล่าสุด และบรรทัดประวัติสถานะ) · บรรทัด "ภาพรวม" (เสร็จ N/ทั้งหมด · กำลังทำ · ติด · ไม่ผ่านตรวจ) · ตาราง "ทีมตอนนี้" ราย agent · BUILD-PLAN เดิมต้องเติม 2 คอลัมน์ใหม่ก่อนตัวตรวจจะผ่าน
- `coding-evals`: ชุดงานจริง 8 งานอยู่ที่ `evals/coding/` ของ SQT-Marketplace พร้อมสคริปต์ `run-coding.mjs` (ตรวจชุดงาน · เทียบ 2 รุ่น · ให้คะแนนอัตโนมัติ)

## 2.14.0 — 2026-10-20

- skill ใหม่ `stack-mql` — เขียนและตรวจ MQL4 / MQL5 (Expert Advisor · indicator บน MetaTrader 4/5): ความต่าง MT4 กับ MT5 · ตัวตรวจก่อนส่งออร์เดอร์ (volume · ราคา · stops level · freeze level · margin · จำนวนออร์เดอร์) · state ที่กู้คืนได้หลังรีสตาร์ท · backtest จาก command line · กฎ MQL5 Market · ขายเอง
- `developer` เพิ่ม `stack-mql` ในตาราง stack · `quant-analyst` ใช้ `stack-mql` กับงาน EA
- ชุด prompt คู่กัน: `prompt/software-company/prompt-trading-system.md` · `prompt-ai-feature.md` · `prompt-sell-product.md` (ใหม่) และฉบับใหม่ใน `prompt-operations.md` (6 ดูแลประจำ) · `prompt-existing-code.md` (6 ไม่มี source) · `prompt-release.md` (4 แอป Windows) · กฎ "งานเฉพาะสาขา" ใน `prompt-new-project.md`

## 2.13.0 — 2026-10-19

- รับ skill กลาง `no-ai-look` จาก `superuser` · agent ที่ทำงานภาพ (`ux-designer` · `graphic-designer` · `image-artist` · `growth-specialist` · `technical-writer`) ทำตามและตรวจก่อนส่ง
- skill งานภาพ 15 ตัวมีหัวข้อ "ไม่ให้ดูเหมือน AI ทำ" ชี้ไปข้อ 3 ของ `no-ai-look` (ui-craft · web/mobile/windows-app-design · graphic-design · presentation-design · html-slide-deck · pptx-to-html-deck · branded-document-design · polished-document-style · doc-cover-design · diagram-figures · software-diagrams · markdown-visuals · image-generation)
- ตัดของที่ขัด `no-ai-look` ออก
  - `polished-document-style`: เลิกใช้อีโมจิทั้งเอกสาร (หัวข้อ H1 · กล่องข้อความ · ป้ายสถานะ · ตาราง) ใช้คำตัวหนาแทน · แม่แบบ `fsd-writing` · `document-naming` · `project-bootstrap` ตามไปด้วย
  - `diagram-figures`: เลิกแถบสีหนาข้างการ์ด ใช้หัวการ์ดพื้นสีทึบ
  - `ui-craft` หน้าสารบัญ mockup: ตัดแสงฟุ้ง · ไล่สี · ป้ายเหนือหัวข้อ · เคอร์เซอร์กระพริบ · เงาเรือง · รูปซูม · สีสำรองม่วง-ฟ้า → `#2A78D6`
- `ui-craft` แกน "พลังของสี": เปลี่ยนคำแนะนำแถบสีหนาข้างการ์ด เป็นหัวการ์ดพื้นสีทึบ (แถบข้างการ์ดมุมมนคือสัญญาณ AI เว้นแต่บอกสถานะ)

## 2.12.0 — 2026-10-18

- `test-case-template` ช่อง **Oracle** ใหม่ — ผลที่คาดหวังมาจากไหน `[D]` เจ้าของงาน · `[R]` กฎทั่วไป · `[A]` คนสร้าง · `[O]` หน้าจอ · ทุก TC ต้องมี `[D]` หรือ `[R]`
  - กฎ "อย่าอบบั๊ก": ตัวเลขเงินคิดจาก `[D]` + `[R]` ก่อนเปิดระบบ พร้อมวิธีคิด · ห้ามลอกจากหน้าจอ
  - BR ที่มีตัวเลข = ค่าขอบ 3 ค่า · ช่อง **Check when** (ทันที · หลังรีโหลด) · ตาราง coverage matrix + traceability ท้ายไฟล์
- แม่แบบแผนทดสอบ: coverage matrix ในหัวข้อ 3 · เกณฑ์ผ่านวัดได้ (P1 ผ่านหมด · ≥ 95% ต่อเบราว์เซอร์ · Not run = ล้ม) · หัวข้อ 8 Plan Quality "ถ้าพังแบบนี้ → TC ไหนล้ม"
- agent `qa-tester`: ผลไม่ตรง → ห้ามแก้ผลที่คาดหวัง · จำแนก `app` / `plan` / `test` ลง `triage.json` · ฝังบั๊กด้วย `BUG_MODE` เพื่อวัดว่าแผนจับได้ X / Y
- `e2e-testing-patterns` หัวข้อใหม่ Expected Values and Failing Tests
- ที่มา: บท "สบายใจ สปา: จากบันทึกสัมภาษณ์ สู่เว็บและแผนทดสอบ"

## 2.10.1 — 2026-10-18

- ปุ่มของเด็ค HTML (`html-slide-deck` · `pptx-to-html-deck`) แยกหน้ากับ player ออกจากกัน
  - ← → · PageUp PageDown · คลิกขอบ · ปัดจอ = เปลี่ยนหน้าเท่านั้น
  - Space = เล่น / หยุด player ของหน้านั้น (ทัวร์แผนภาพ · ขั้น On Click) · หน้าที่ไม่มี player ไม่ทำอะไร
  - ↓ ↑ = player ขั้นถัดไป · ขั้นก่อนหน้า
  - เปลี่ยนหน้าทุกครั้ง player หยุดและกลับไปขั้นเริ่มต้น ทั้งไปหน้าและถอยกลับ
- `check_html_deck.py` เดินเด็คด้วย ↓ ทุกขั้นและ → ทุกหน้า และตรวจว่า player reset ทุกครั้งที่เข้าหน้าใหม่

## 2.10.0 — 2026-10-18

- skill ใหม่ `test-evidence` — รันเคสแล้วเก็บหลักฐานครบในรอบเดียว
  - ภาพทุกขั้น → GIF 1 ไฟล์ต่อเคส: แถบบนบอกรหัสเคส · ชื่อ · ขั้น n/N · ป้าย PASS/FAIL · คำบรรยายใต้ภาพ (ทำอะไร → เห็นอะไร) · กรอบแดงจุดที่ผิด · ภาพปิดสรุปผล คาดว่า / ที่เกิดจริง
  - ขนาดตายตัว: กว้าง 1280 px · หัว 24 px · คำบรรยาย 28 px (ย่อเหลือ 800 px ยังอ่านได้) · ฟอนต์ Sarabun + ชุดลูกศรฝังใน skill
  - รายงาน `qa/reports/<run-id>-test-report.md` สร้างอัตโนมัติ: สรุปจำนวน · ผลรายเคสพร้อมลิงก์ · เคสที่ไม่ผ่านพร้อมภาพ · เคสที่ยังไม่ได้รัน
  - `results.csv` → Excel: คอลัมน์ Result · Test result · Evidence (ลิงก์) · `record_results.py` ลงผลใน Excel ที่ผู้ใช้ส่งมาเองได้ทุกหน้าตา
  - สคริปต์ 2 ตัวมี `--self-test`
- `test-case-template/scripts/build-test-workbook.py` เพิ่มคอลัมน์ `test_result` · `evidence` ต่อจาก `result` และ `--results` เติมผลจากรอบทดสอบ
- agent `qa-tester` ใช้ `test-evidence` ทุกครั้งที่รันเคส

## 2.9.0 — 2026-10-16

- `project-doc-set` ข้อ 3.1 ใหม่ **ทะเบียนจุดค้าง** — เมื่อผู้ใช้ถามว่าเอกสาร DRAFT ยังติดตรงไหน ตอบเป็นไฟล์ Excel ไม่ใช่ข้อความในแชต
  - สคริปต์ `scripts/open_items.py` อ่าน `.docx` ทั้งชุด รวมตารางคำถาม ข้อสมมติที่ยังไม่ตัดสิน ตารางลงนาม และป้าย `(รอยืนยัน)` `(รอวัด…)` เป็น `<CODE>-OPEN-ITEMS.xlsx` · แผ่นสรุปนับด้วยสูตร COUNTIFS · แยก 5 ประเภท (เจ้าของตัดสิน · ทีมตัดสิน · กฎหมาย · วัดจริง · ลงนาม) · มี `--self-test`
  - ข้ามประวัติการแก้ไข สารบัญ บรรทัดอธิบายป้าย และ `(รอบหลัง)` · ต้องเปิดอ่านด้วยตาก่อนส่ง
  - รายการตรวจข้อ 7 เพิ่มข้อทะเบียนจุดค้าง
- ที่มา: LiteNet v0.5 (6 ฉบับ) ได้ 75 รายการ

## 2.8.0 — 2026-10-15

- skill `reverse-engineering` แกะซอฟต์แวร์ด้วยเครื่องมือในเครื่องล้วน ไม่ใช้ MCP (Model Context Protocol) server และไม่ดึงแพ็กเกจจาก npm ตอนรัน
  - ก่อนเปิดเป้าหมายต้องมีบันทึกสิทธิ์ · สมุดหลักฐาน (ข้อสรุป · เลขหลักฐาน · ป้าย `จากแหล่ง` `ตรวจจริง` `อนุมาน` `ยังไม่ได้ตรวจ`) · ทำเฉพาะเป้าหมายและขั้นที่ตกลง
  - ทุกอย่างที่รันเป้าหมาย เกาะ process หรือแก้อุปกรณ์ ต้องถามผู้ใช้ทุกครั้ง · ถูกปฏิเสธแล้วห้ามขอซ้ำด้วย input เดิม · เป้าหมายที่ไม่น่าไว้ใจรันใน `docker-sandbox` เท่านั้น · ไม่ช่วยเลี่ยง DRM licence anti-cheat ไม่ทำโปรแกรมโกงหรือ malware · เครื่องมือเสียเงินต้องเป็นสัญญาอนุญาตของผู้ใช้
  - playbook ตามชนิดเป้าหมายใน references/: `javascript-electron` · `native-binaries` (PE · ELF · Mach-O · .NET · Ghidra headless) · `android-apk` · `web-and-network` (เว็บแอป · HAR · pcap) · `runtime-observation` · `evidence-ledger` · แต่ละตัวบอกเครื่องมือในเครื่องที่ใช้ และแหล่งติดตั้งทางการถ้าขาด (ผู้ใช้ติดตั้งเอง agent ถามก่อน)
  - สคริปต์ใหม่ 5 ตัว ใช้แค่ไลบรารีมาตรฐานของ Python ทุกตัวมี `--self-test`: `asar_extract.py` (แตก .asar กัน path หลุดโฟลเดอร์ ตรวจ integrity hash) · `pe_elf_info.py` (header · section · import · export ของ PE และ ELF · Mach-O แค่ header) · `apk_inventory.py` (รายการใน APK · ABI · ลายเซ็น · ถอด AndroidManifest แบบ binary XML) · `sourcemap_list.py` (หา source map และเขียนต้นฉบับที่ฝังอยู่ออกมาอย่างปลอดภัย) · `har_summary.py` (host · endpoint · วิธียืนยันตัวตน โดยตัดค่าลับทิ้ง)
  - `triage.py` ชี้ไปสคริปต์ใหม่ · ไฟล์ `NOTICE` ให้เครดิต REA (MIT · © 2026 morluto) สำหรับแนวทางที่ดัดแปลง
- agent `reverse-engineer` ใช้บันทึกสิทธิ์ สมุดหลักฐาน ป้าย 4 แบบ และตารางสคริปต์กับ playbook ชุดใหม่
- **ถอด plugin เสริมของ REA ออกจาก marketplace** เพราะ server ของมันดาวน์โหลดแพ็กเกจจาก npm สาธารณะทุกครั้งที่เปิด ซึ่งไม่มีใครตรวจรับรองโค้ดรุ่นที่ได้ · ความสามารถที่ใช้จริงย้ายมาอยู่ใน skill `reverse-engineering` แล้ว

## 2.7.0 — 2026-10-15

- skill ใหม่ `doc-cover-design` — ปกเอกสาร .docx ที่ไม่ซ้ำโปรเจกต์อื่น: หาแนวคิดจากรูปทรงโลโก้ (ทางตั้งต้น) หรือหน้าจอจริงของ mockup (ทางสำรอง) · ทะเบียนกันปกซ้ำ · ชนิดเอกสาร = เฟรมของการเคลื่อนไหวเดียวกัน · ทำ 3 แนวแล้วผู้ตรวจ 3 ตัวโหวต 2 ใน 3 · เครื่องสร้างปกตัวอย่าง `scripts/cover-engine/` (ทดสอบใน Word แล้วเฉพาะปก SRS · ใช้กับโปรเจกต์ใหม่ต้องแก้หลายไฟล์ — ดู word-build.md)
- ที่มา: bake-off กับ LiteNet · Telex · SwipeOS — แนวรูปทรงโลโก้ชนะ 2 ใน 3 · Telex ใช้หน้าจอจริง
- `branded-document-design` ชี้ไปที่ `doc-cover-design` เมื่อโปรเจกต์มีโลโก้และ mockup แล้ว
- prompt ใหม่ `prompt/software-company/prompt-doc-cover.md` (3 ฉบับ) · `prompt-new-project.md` ฉบับ 14 เรียกตัวสร้างปกของโปรเจกต์ถ้ามี
- agent `reverse-engineer` และ skill `reverse-engineering` ชี้ไปที่ plugin เสริมของ REA (Reverse Engineer Anything) · ถอดออกแล้วใน 2.8.0

## 2.6.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- agent 13 ตัวที่ยาวเกิน 150 บรรทัด เหลือ 87–117 บรรทัด · เนื้อหาย้ายไป references/ ของ skill ที่เกี่ยวข้อง
- แก้ตัวอย่างโค้ดที่ผิด: SQL ต่อ string (data-engineer) · AND/OR (clinical-data-analyst) · rollup รันซ้ำแล้วนับซ้ำ และรับรู้รายได้เกิน 1 วัน (revops-analyst)
- ความปลอดภัย: rag-architecture มีหัวข้อความปลอดภัย · md_to_docx.py ไม่ต่อ path เข้าคำสั่ง PowerShell · build_deck.py ฝังได้เฉพาะรูปในโฟลเดอร์งาน · incident-response ต้องมีคนอนุมัติก่อนแก้ระบบจริง
- ค่าที่ไม่ตรงกันข้าม skill: เงินใช้ decimal ไม่ใช้ float · ระดับความรุนแรงของการรีวิวชุดเดียว · LCP 2.5 วินาที · รหัสผ่านขั้นต่ำ 15 ตัวตาม NIST SP 800-63B-4
- รุ่นภาษาและ runtime (Python · .NET · Node) ตรวจกับเว็บทางการ 2026-10-14 · เลิกเขียนชื่อรุ่นโมเดลตายตัว
- ย้ายตาราง/ตัวอย่างยาวจาก SKILL.md ไป references/ (architecture-patterns · seo-audit-checklist · llm-design · healthcare-design · iot-design · ui-craft · srs-writing · test-case-template ฯลฯ)
