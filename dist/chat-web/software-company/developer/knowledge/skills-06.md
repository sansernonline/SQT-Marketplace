# skill: docker-sandbox

Use when a project should run in its own Docker container instead of on the host (installs, builds, tests, dev servers, unattended agents) or the user says sandbox or container. One sandbox per project; the host commands.

# docker-sandbox — ห้องทดลองต่อโปรเจกต์

> เครื่องเราเป็นคนสั่ง ห้องทดลองเป็นที่ลงมือ
> ข้างในติดตั้ง ลบ รันเซิร์ฟเวอร์ ทำฐานข้อมูลทดสอบได้เต็มที่ เพราะพังแล้วล้างทิ้งสร้างใหม่ได้ในคำสั่งเดียว
> ข้างนอก (เครื่องจริง · ระบบจริง · บัญชีจริง) แตะไม่ได้ เพราะไม่มีทางเข้าจากข้างใน

ใช้คู่กับ [`agent-team`](../agent-team/SKILL.md) — โปรเจกต์ที่มี `.sandbox/` งานติดตั้งและรันทุกอย่างทำในห้องนี้

---

## 1 · หนึ่งโปรเจกต์ = หนึ่งห้อง

- **ห้องเดียวต่อโปรเจกต์** ชื่อ `sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่สร้าง>` (เช่น `sandbox-agent-sample-app-20260125`) · ตั้งครั้งเดียวตอน `up` แรก แล้วเก็บไว้ในไฟล์ `.sandbox/.name-<ชื่อโฟลเดอร์>` คำสั่งทีหลังอ่านจากไฟล์นี้ ชื่อจึงไม่เปลี่ยนตามวัน · prefix `sandbox-agent-` บอกว่าเป็นห้องที่ agent สร้าง ไม่ใช่คนตั้ง · วันที่สร้างเก็บซ้ำใน label `sqt.created` · ฐานข้อมูล cache หรือเบราว์เซอร์ของโปรเจกต์นั้น เป็น service เพิ่มใน**ห้องเดียวกัน** (stack เดียว) ไม่แยกเป็นห้องใหม่
- **image ฐานใช้ร่วมกันทั้งเครื่อง** — `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) build ครั้งเดียว · image ของแต่ละโปรเจกต์มีแค่ชั้นบาง ๆ ที่โปรเจกต์นั้นต้องใช้ จึงไม่กินดิสก์ซ้ำ
- **ห้องที่หยุดอยู่ไม่กิน CPU และหน่วยความจำ** กินแค่ดิสก์ · จบงานแล้ว `stop` · เลิกงานทั้งวัน `stop-all`
- **ห้องเพิ่มชั่วคราว** (`-Name <โปรเจกต์>-a1`) ใช้เฉพาะตอนลองหลายทางพร้อมกัน แล้ว `destroy` ทิ้งทันทีที่เลือกได้
- **ไม่รวมหลายโปรเจกต์ไว้ห้องเดียว** — ของที่ติดตั้งชนกัน · โปรเจกต์หนึ่งพังลามอีกโปรเจกต์ · ล้างทีละโปรเจกต์ไม่ได้

## 2 · สองแบบ เลือกตามงาน

| | **mount** (ค่าเริ่ม) | **isolated** (`-Isolated`) |
|---|---|---|
| ไฟล์โปรเจกต์ | โฟลเดอร์จริงต่อเข้าไปที่ `/work` แก้แล้วเห็นบนเครื่องทันที | สำเนาอยู่ใน volume โฟลเดอร์จริงต่อเข้าไปแบบอ่านอย่างเดียวที่ `/src` |
| ใครแก้ไฟล์ | Claude Code บนเครื่องแก้ไฟล์ตามปกติ | Claude Code **ในห้อง** (`sandbox.ps1 claude`) |
| ใครรันคำสั่ง | ส่งเข้าห้องด้วย `sandbox.ps1 exec "..."` | Claude Code ในห้องรันเอง ไม่มีหน้าต่างขออนุญาต |
| ผลกลับมาอย่างไร | อยู่ในโฟลเดอร์แล้ว | `sandbox.ps1 sync` → patch ใน `_to_delete\sandbox\` แล้วคนสั่ง `git apply` |
| ใช้เมื่อ | งานประจำวันที่คนดูอยู่ | งานทั้งคืน · งานเสี่ยง · ลองหลายทางพร้อมกัน (ห้องละทาง) |

เพิ่ม `-Locked` ได้ทั้งสองแบบ — ปิดอินเทอร์เน็ตขาออก เหลือเฉพาะโฮสต์ใน `allowlist.txt` เหมาะกับงานที่รันโค้ดที่ยังไม่ไว้ใจ

---

## 3 · ตั้งห้องให้โปรเจกต์ (ครั้งแรก)

1. ตรวจว่า Docker Desktop รันอยู่ — `docker version` ต้องเห็นทั้ง Client และ Server · ไม่เห็น บอกผู้ใช้ให้เปิด Docker Desktop แล้วหยุดเฉพาะงานนี้
2. คัดลอกทุกไฟล์ใน `assets/` ของ skill นี้ไปที่ `<โปรเจกต์>/.sandbox/`
3. ปรับ `Dockerfile` (ชั้นของโปรเจกต์) — `INSTALL_DOTNET=1` สำหรับ .NET · เพิ่ม `apt-get install` ของที่โปรเจกต์ต้องใช้ · **อย่าแก้ `base.Dockerfile`** ถ้าไม่จำเป็น เพราะทุกโปรเจกต์ใช้ร่วมกัน · ฐานข้อมูลทดสอบเพิ่มเป็น service ใหม่ใน `compose.yaml` (ไม่เปิด port ออกนอก)
4. เพิ่ม `.sandbox/.mode-*` และ `.sandbox/.name-*` ใน `.gitignore`
5. เปิดห้อง — `.\.sandbox\sandbox.ps1 up` (หรือ `up -Isolated` · `up -Browser`) · โปรเจกต์แรกของเครื่องจะ build image ฐานก่อน นานราว 5–15 นาที โปรเจกต์ถัดไปเร็วขึ้นมาก
6. **พิสูจน์ว่าใช้ได้** — `sandbox.ps1 exec "node -v && python3 --version && git status"` · โปรเจกต์มีคำสั่ง test ให้รันผ่าน `exec` หนึ่งครั้ง · โหมด `-Locked` ต้องเห็นบรรทัด `check passed`
7. ลงใน `docs/README.md` ของโปรเจกต์ — ชื่อห้อง (`sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่>`) · โหมด · port · คำสั่ง test ในห้อง

**ทดสอบจริงแล้ว** บน Windows + Docker Desktop 4.46 (2026-10-05, โปรเจกต์ `sample-app`) — build ห้อง · unit test 15/15 · e2e บน Chromium 14/14 ผ่านในห้อง · บั๊กที่เจอระหว่างทดสอบแก้ในสคริปต์แล้ว (PowerShell 5.1 กับ stderr · Playwright คนละรุ่นกับ image ฐาน · พอร์ตชน) · พังบนเครื่องอื่นให้ใช้ playbook `bug-fix` กับตัวสคริปต์

**พอร์ต** — `up` หาพอร์ตว่างเองเริ่มที่ 3000 แล้วบอกว่าได้พอร์ตไหน · ในห้องมีตัวแปร `APP_PORT` และ `PORT` เป็นค่านั้น และ `HOST=0.0.0.0` · แอปต้องฟังที่ `HOST` (ถ้าฟังแค่ `127.0.0.1` ในห้อง เครื่องจะเข้าไม่ถึง) · ฝั่งเครื่องยังเปิดแค่ `127.0.0.1` เหมือนเดิม แล้วเข้าจากเครื่องที่ `http://127.0.0.1:<พอร์ต>`

**Playwright คนละรุ่น** — image ฐานมี Chromium รุ่นล่าสุด · โปรเจกต์ที่ล็อก Playwright รุ่นอื่นให้รัน `npx playwright install chromium` ในห้องหนึ่งครั้งหลัง `npm ci` (ไม่ต้อง `--with-deps` ระบบมีให้แล้ว)

---

## 4 · ใช้ทุกวัน

| ต้องการ | คำสั่ง (รันที่รากโปรเจกต์บนเครื่อง) |
|---|---|
| รันคำสั่งในห้อง (agent ใช้อันนี้) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| เปิด shell ในห้อง | `.\.sandbox\sandbox.ps1 shell` |
| ให้ Claude Code ทำงานในห้องเต็มที่ | `.\.sandbox\sandbox.ps1 claude` (ล็อกอินครั้งแรกครั้งเดียว volume เก็บไว้) |
| เอางานจากห้อง isolated ออกมา | `.\.sandbox\sandbox.ps1 sync` แล้วอ่าน patch ก่อน `git apply` |
| ห้องทั้งหมดในเครื่อง | `.\.sandbox\sandbox.ps1 list` |
| ล้างห้องให้สะอาด เริ่มใหม่ | `reset` แล้ว `up` |
| หยุดทุกห้องในเครื่อง คืนหน่วยความจำ | `.\.sandbox\sandbox.ps1 stop-all` |
| ห้องหลายห้องของโปรเจกต์เดียว | ใส่ `-Name <โปรเจกต์>-a1` ทุกคำสั่ง |

**กฎของ agent เมื่อโปรเจกต์มี `.sandbox/`**
- install · build · test · dev server · migration · สคริปต์ใด ๆ → ผ่าน `sandbox.ps1 exec` ไม่รันบนเครื่อง
- skill ตรวจแอปของโปรเจกต์ (`app-verifier-setup`) รัน Playwright ในห้องแบบไม่มีหน้าจอ แล้วคัดภาพออกด้วย `docker compose cp` มาไว้ `_to_delete/`
- ห้องหยุดอยู่ → `up` เองได้ (ย้อนได้) · ห้องพังแก้ไม่ได้ → `reset` เองได้ เพราะของในห้องไม่ใช่ของผู้ใช้ — **ยกเว้น** isolated ที่ยังไม่ได้ `sync` ต้อง sync ก่อน reset

---

## 5 · เบราว์เซอร์เสมือนสำหรับทดสอบ

| แบบ | ใช้เมื่อ | วิธี |
|---|---|---|
| headless ในห้อง (ค่าเริ่ม) | test อัตโนมัติ · verify skill · ไม่ต้องมีใครดู | Playwright Chromium มากับ image ฐานแล้ว |
| **มองเห็นได้** (`up -Browser`) | อยากดู agent กดจริงทีละขั้น · ตรวจหน้าจอด้วยตา · อัดภาพ | เบราว์เซอร์จริงในคอนเทนเนอร์แยก ดูสดที่ `http://127.0.0.1:7900` · Playwright ในห้องขับผ่าน `SELENIUM_REMOTE_URL` ให้เอง (Playwright เรียกความสามารถนี้ว่ายังทดลอง) |
| ให้ Claude Code ในห้องคุมเบราว์เซอร์เอง | งานสำรวจหน้าเว็บที่ยังไม่มีสคริปต์ | ติดตั้ง Playwright MCP server ในห้อง (`.mcp.json` ของโปรเจกต์) ให้ทำงานแบบ headless |

- เบราว์เซอร์ในห้องไม่มีบัญชี ไม่มีคุกกี้ ไม่มีรหัสผ่านของผู้ใช้ — ล็อกอินด้วยบัญชีทดสอบของโปรเจกต์เท่านั้น
- ภาพและวิดีโอจากการทดสอบ คัดออกมาที่ `_to_delete/` ด้วย `docker compose cp`
- เบราว์เซอร์ของผู้ใช้บนเครื่อง (Chrome ที่ล็อกอินอยู่) ใช้กับเว็บจริงที่ต้องใช้บัญชีจริงเท่านั้น และทำตามกติกาของเครื่องมือนั้น ไม่ใช่ที่ทดสอบ

## 6 · CAPTCHA

- **ระบบของเราเอง** — CAPTCHA ไม่ควรขวางการทดสอบตั้งแต่ต้น · ใช้ค่าทดสอบ (test site key) ที่ผู้ให้บริการแจกไว้ให้ผ่านทุกครั้ง (reCAPTCHA · hCaptcha · Cloudflare Turnstile มีทั้งหมด ดูค่าจากเอกสารผู้ให้บริการ) หรือปิดด้วยค่าตั้งเฉพาะ environment ทดสอบ (`CAPTCHA_ENABLED=false`) · **ค่าทดสอบต้องไม่หลุดไปถึงระบบจริง** — ใส่การตรวจตอนเริ่มระบบว่า production ห้ามใช้ test key (`config-and-secrets`)
- **เว็บของคนอื่น** — agent **ไม่แก้ CAPTCHA และไม่หาทางหลบ** (ไม่ใช้บริการรับแก้ ไม่ปลอมตัวเป็นคน) · เจอ CAPTCHA = หยุดขั้นนั้น บอกผู้ใช้ให้ทำเอง แล้วทำส่วนอื่นต่อ · ถ้าต้องดึงข้อมูลจากเว็บนั้นบ่อย ให้หา API ทางการแทน
- เหตุผล — CAPTCHA คือเจ้าของเว็บบอกว่า "ห้ามบอท" การหลบคือการฝ่าข้อตกลงของเขา และทำให้ IP หรือบัญชีถูกแบน

## 7 · ในห้องทำได้เต็มที่

ติดตั้งโปรแกรม (`sudo apt-get` · `npm -g` · `pip`) · ลบไฟล์ในห้อง · รันเซิร์ฟเวอร์และฐานข้อมูลทดสอบ · ดาวน์โหลด dependency · commit ในสำเนาของโหมด isolated · ทดลองทำลายแล้วสร้างใหม่

เรื่องที่ยังอยู่ใน "รออนุมัติ" แม้อยู่ในห้อง (เตรียมไว้ ไม่ทำเอง) — เพราะผลออกไปนอกห้อง:
- ส่งข้อมูล อีเมล ข้อความ หรือเรียก API ที่มีผลจริงกับคนหรือระบบภายนอก
- ใช้บัญชีจริง ค่าลับจริง ฐานข้อมูลจริง
- push ขึ้น remote · deploy
- ในโหมด mount — ลบหรือเขียนทับไฟล์ของผู้ใช้ใน `/work` ที่ไม่ใช่ผลงานของรอบนี้ (มันคือโฟลเดอร์จริง)

---

## 8 · ห้ามแก้ compose ให้มีสิ่งเหล่านี้

| ห้าม | เพราะ |
|---|---|
| `privileged: true` · `pid: host` · `network_mode: host` | ห้องจะมองเห็นและแตะเครื่องจริงได้ |
| mount `/var/run/docker.sock` หรือ `//./pipe/docker_engine` | คุม Docker ได้ = คุมเครื่องได้ |
| mount โฟลเดอร์ home · `.ssh` · `.aws` · `.azure` · `.claude` ของเครื่อง · โปรไฟล์เบราว์เซอร์ · ไดรฟ์ทั้งลูก | ค่าลับหลุดได้ทันทีที่โค้ดในห้องอ่าน |
| เปิด port แบบ `"3000:3000"` (ทุกการ์ดแลน) | คนในเครือข่ายเดียวกันเข้าถึงได้ — ใช้ `127.0.0.1:` เสมอ |
| ใส่ค่าลับจริงใน `Dockerfile` หรือ image | ค่าลับติดไปกับ image ตลอด |
| ปิดหรือเพิ่ม limit `cpus` `mem_limit` `pids_limit` จนเครื่องค้าง | ห้องที่วนไม่จบจะกินเครื่องทั้งเครื่อง |

เอกสารของ Claude Code เตือนไว้ว่า แม้ในคอนเทนเนอร์ การรันแบบไม่มีหน้าต่างขออนุญาต (`--dangerously-skip-permissions`) ยังกันไม่ได้ถ้าโค้ดในโปรเจกต์ตั้งใจขโมยของที่อยู่ในห้อง รวมถึง token ของ Claude Code เอง — ใช้กับ repo ที่ไว้ใจเท่านั้น และใช้ `-Locked` เมื่อไม่แน่ใจ

---

## 9 · หมายเหตุ Windows

- Docker Desktop ใช้ WSL 2 · ไฟล์บนไดรฟ์ `C:` ที่ mount เข้าไปช้ากว่าไฟล์ใน volume — build หรือ test ช้ามาก ให้ใช้ `-Isolated` (วัดจริง: `npm ci` แค่ 2 แพ็กเกจใช้ 52 วินาทีบนโฟลเดอร์ OneDrive)
- **โปรเจกต์ในโฟลเดอร์ OneDrive** — โหมด mount จะทำให้ `node_modules` และไฟล์ build ถูก sync ขึ้นคลาวด์ · ใช้ `-Isolated` หรือย้ายโปรเจกต์ออกจาก OneDrive
- รัน `sandbox.ps1` ไม่ได้ → `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <คำสั่ง>`
- `-Locked` อ่าน IP ของโฮสต์ครั้งเดียวตอนเปิด บริการที่เปลี่ยน IP บ่อยอาจหลุด ให้ `up -Locked` ใหม่

## เชื่อมกับ skill อื่น

- [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md) — ผู้แข่งแต่ละตัวได้ห้อง isolated ของตัวเอง (`-Name <โปรเจกต์>-a1` …)
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md) — สคริปต์ `start` ของ verify skill รันในห้อง
- `config-and-secrets` — ค่าทดสอบใส่ `.env` ที่ไม่เข้า git และไม่ bake ลง image
- playbook `housekeeping` ของ `agent-team` — เก็บกวาดห้องและ image เก่า


---

# skill: principle-fix-root-cause

Use when debugging or fixing anything broken (error, crash, wrong value, flaky test, slow page). Reproduce first, ask why until the cause, fix there instead of a null check, retry or catch that hides the symptom.

# principle · fix root cause — แก้ที่ต้นเหตุ

> การดัก null ที่หน้าจอ ทำให้ error หายไปจากสายตา แต่ข้อมูลผิดยังไหลอยู่ในระบบ

## กฎ

1. **ทำให้เกิดซ้ำก่อนแก้** — ทำซ้ำไม่ได้ = ยังไม่รู้ว่าแก้อะไร · ใช้ skill ตรวจแอปของโปรเจกต์ หรือคำสั่งที่รันได้
2. **ถาม "ทำไม" จนถึงจุดที่ค่าผิดเกิดขึ้นครั้งแรก** — ไม่ใช่จุดที่มันระเบิด
3. **แก้ที่จุดนั้น** แล้วรันกรณีเดิมให้ผ่าน

## ตัวอย่าง

| อาการ | แก้ที่อาการ (ห้าม) | แก้ที่ต้นเหตุ |
|---|---|---|
| หน้ารายงานพังเพราะ `date` เป็น null | `if (date) ...` ที่หน้าจอ | หาว่าทำไม import ไม่ใส่วันที่ → แก้ parser ที่อ่านปี พ.ศ. ไม่ได้ |
| test ล้มบ้างผ่านบ้าง | ใส่ retry 3 ครั้ง | หาว่าแข่งกันที่ไหน → รอสถานะที่ถูกแทนการรอเวลา |
| API ช้า | เพิ่ม cache | วัดก่อนว่าช้าที่ไหน → query ไม่มี index |

## ข้อยกเว้น

แก้ชั่วคราวที่อาการได้ เมื่อระบบจริงกำลังเสียหายและต้องหยุดเลือดก่อน — แต่ต้องลง `decision-log` ว่าเป็นการแก้ชั่วคราว และเปิดงานแก้ต้นเหตุต่อทันที

## ใช้คู่กับ

`targeted-fix` (ขั้นตอนแก้แบบเล็กที่สุด) · playbook `bug-fix` ของ [`agent-team`](../agent-team/SKILL.md)


---

# skill: principle-build-a-tool-not-handwork

Use when work has a mechanical part (same edit in many files, checking every screen, migrating data, repeated documents, verifying a claim). Build the script, codemod or checker instead of doing it by hand.

# principle · build a tool, not handwork — งานกลไกทำเป็นเครื่องมือ

> งานมีสองปลาย — ปลายที่ต้องใช้วิจารณญาณ กับปลายที่เป็นกลไกล้วน
> ปลายกลไกไม่ต้องให้ agent คิดวิธีใหม่ทุกครั้ง เขียนเป็นโปรแกรมครั้งเดียว แล้วเก็บสมองไว้กับส่วนที่ต้องตัดสิน

## เมื่อไรต้องทำเครื่องมือ

| สัญญาณ | เครื่องมือ |
|---|---|
| แก้รูปแบบเดียวกันเกิน 10 จุด | codemod · สคริปต์แก้ผ่าน syntax tree (AST) · `sed` ที่ทดสอบแล้ว |
| ตรวจทุกหน้าจอหรือทุกไฟล์ | สคริปต์วนตรวจที่พิมพ์ตารางผล |
| agent ทุกตัวต้องตั้งสภาพแวดล้อมเองก่อนตรวจ | สคริปต์ `start` ใน verify skill (`app-verifier-setup`) |
| ย้ายข้อมูล | สคริปต์ที่รันซ้ำได้ผลเดิม พร้อมโหมดลองก่อน (dry run) |
| ข้ออ้างว่า "ทุกที่ทำแบบนี้แล้ว" | คำสั่ง grep หรือสคริปต์ที่พิสูจน์ได้ |
| ทำงานเดิมเป็นครั้งที่สาม | ทำเป็นคำสั่งหรือ skill |

## กฎของเครื่องมือ

- **รันซ้ำได้ผลเดิม** — รันสองครั้งต้องไม่พัง และไม่แก้ซ้ำซ้อน
- **พิมพ์ผลที่ตรวจได้** — นับจำนวนที่แก้ · รายการที่ข้าม · ที่ล้ม
- **เล็กที่สุดที่ทำงานได้** — ไม่ต้องสวย ไม่ต้องรองรับทุกกรณีในอนาคต (`lazy-coding`)
- **เก็บให้ถูกที่** — ใช้ครั้งเดียวไว้ `_to_delete/` · ใช้ซ้ำไว้ `scripts/` พร้อมบรรทัดเดียวใน README ว่ารันเมื่อไร
- **skill เหลือแค่คำอธิบายบาง ๆ** — ขั้นตอนตายตัวอยู่ในสคริปต์ SKILL.md บอกแค่เมื่อไรเรียกและอ่านผลอย่างไร

## ไม่ต้องทำเมื่อ

งานแก้ 2–3 จุดที่ต่างกันจริง — เขียนสคริปต์ใช้เวลามากกว่าแก้เอง


---

# skill: app-verifier-setup

Use when a project has no scripted way for an agent to run the app and see the result, or before the first feature or fix on a new project. Builds a project-local verify skill so agents prove work on the real app.

# app-verifier-setup — ให้ agent มีมือและตา

> ถ้า agent มองไม่เห็นผลงานตัวเอง มันวนปรับปรุงไม่ได้ และคนจะกลายเป็น "คนส่งข้อมูล" ระหว่าง agent กับหน้าจอ
> skill นี้สร้างเครื่องมือครั้งเดียว ให้ agent ทุกตัวหลังจากนี้ใช้ซ้ำ

**ผลลัพธ์:** สองชิ้น — สคริปต์อยู่กับ test ของโปรเจกต์ · skill เป็นแค่คู่มือสั้น ๆ ให้ agent

```
<โปรเจกต์>/
├─ <project-name>/test/e2e/verify.*         สคริปต์ขับแอปจริง เปิดและปิดแอปเอง (อยู่ในโฟลเดอร์โค้ด ดู project-bootstrap)
│                                           รายการฟีเจอร์และ check อยู่ในไฟล์นี้ที่เดียว (แผนที่ฟีเจอร์)
├─ .claude/skills/verify-<โปรเจกต์>/SKILL.md   รันอย่างไร · อ่านผลอย่างไร · ข้อห้าม (ที่ราก — ที่ Claude Code เปิด)
└─ _to_delete/verify-runs/                  หลักฐานแต่ละรอบ — สคริปต์หา path จากที่อยู่ของตัวเอง ไม่ขึ้นกับโฟลเดอร์ที่รัน
```

(Codex · Gemini ใช้ `.agents/skills/` · `skills/` แทน `.claude/skills/`) · ตัวอย่างที่ทำจริงแล้ว: โปรเจกต์ `calculator-demo` (เว็บ) · แอป Flutter Android `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node ขับ `adb` สรุปไว้ใน [`references/android-native.md`](references/android-native.md))

**ทำไมไม่แยกขั้นตอนเป็นไฟล์ร้อยแก้ว** — ลองแล้วในโปรเจกต์ตัวอย่าง ขั้นตอนในไฟล์ `.md` กับใน script ไม่ตรงกันตั้งแต่รอบแรก · ให้ข้อมูลในสคริปต์เป็นแหล่งเดียว แล้ว skill ชี้ไปหา

---

## ขั้นตอน

1. **หาวิธีรันที่มีอยู่แล้ว** — README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android) · ใช้ของเดิม ไม่สร้างใหม่ถ้ามี
2. **เลือกวิธีขับตามชนิดแอป**

   | ชนิด | ขับด้วย | อ่านผลจาก |
   |---|---|---|
   | เว็บ | Playwright (Chromium ที่ติดตั้งอยู่แล้ว ห้ามดาวน์โหลดใหม่ถ้ามี) | ภาพหน้าจอ · DOM · console · network |
   | Electron · desktop | Playwright `_electron` หรือ Chrome DevTools Protocol (CDP) · Windows ใช้ WinAppDriver หรือ pywinauto | ภาพหน้าจอ · log |
   | command line · TUI | เรียกคำสั่งจริงพร้อม input ตายตัว | stdout · stderr · exit code · ไฟล์ที่สร้าง |
   | API · service | `curl` หรือ client ที่ repo ใช้ | status · body · log · ค่าในฐานข้อมูลทดสอบ |
   | มือถือแบบเว็บ (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | ภาพหน้าจอ · DOM |
   | มือถือ native · Flutter (Android) | สคริปต์ Node/Python เรียก `adb` + `uiautomator dump` (แบบ Lumio) · หรือ `integration_test` ของ Flutter · หรือ Maestro — Playwright ขับ APK ไม่ได้ | ภาพ `adb exec-out screencap -p` · ข้อความ/Semantics label จาก `uiautomator` · `dumpsys` · `logcat` |

   - โปรเจกต์มี `.sandbox/` → ขับเบราว์เซอร์ในห้อง · headless เป็นค่าเริ่ม · อยากให้คนดูได้ เปิด `up -Browser` (ดู [`docker-sandbox`](../docker-sandbox/SKILL.md) ข้อ 5) · Android emulator รันใน Docker บน Windows ไม่ได้ (ต้องมี KVM) → รัน emulator บนเครื่อง host แล้วบอกในรายงาน
   - หน้าที่มี CAPTCHA → ใช้ค่าทดสอบของผู้ให้บริการหรือปิดใน environment ทดสอบ ห้ามเขียนสคริปต์แก้ CAPTCHA
   - แอปที่อ่าน hardware (sensor · กล้อง · GPS) → ป้อนค่าที่รู้ล่วงหน้า: emulator (`adb emu sensor set light 420`, กล้องเสมือน) หรือแหล่งข้อมูลปลอมที่เปิดได้เฉพาะ debug build · ติดป้ายทุก check ว่า `emulator` หรือ `เครื่องจริง` — ความแม่นของ sensor จริงพิสูจน์บน emulator ไม่ได้ ยังไม่ได้รันบนเครื่องจริงให้เขียนว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

3. **เขียน `test/e2e/verify.*`** — เปิดแอปเองบนพอร์ตที่ไม่ชน (มือถือ: ติดตั้ง APK แล้วล้างข้อมูลแอป) · ใส่ข้อมูลทดสอบ (seed) · รอจนพร้อม**โดยมีเวลาจำกัด** (เว็บ: ไม่ขึ้นใน 10 วินาที = ล้ม · มือถือ: แยกเวลา build · boot emulator · เปิดแอป · ต่อ check — ดู reference) · ปิดแอปเมื่อจบเสมอ · รันซ้ำได้ผลเดิม ([`principle-build-a-tool-not-handwork`](../principle-build-a-tool-not-handwork/SKILL.md))
4. **รายการฟีเจอร์เป็นข้อมูลในสคริปต์** — ไล่จากเมนู · route · command list · SRS · หนึ่งกลุ่มต่อฟีเจอร์ หนึ่งบรรทัดต่อ check (`ทำอะไร → ต้องเห็นอะไร`) · อย่างน้อย 3 ฟีเจอร์หลัก และกรณีผิดพลาดหนึ่งกรณีต่อฟีเจอร์ · **ทุก check เริ่มจากสถานะสะอาด** รันเดี่ยวหรือสลับลำดับได้ · ผลพิมพ์ `PASS/FAIL` พร้อม expected กับ actual
5. **สคริปต์ต้องไม่ผ่านลอย ๆ** — ชื่อฟีเจอร์ที่ไม่มีจริง → exit 1 · แอปไม่ขึ้น → exit 1 · ไม่มี check ไหนได้รัน → exit 1 (ตรวจศูนย์รายการคือพัง ไม่ใช่ผ่าน)
   - **check ที่ตรวจว่า "หยุด/ปล่อยแล้ว" ต้องตรวจเงื่อนไขก่อนเสมอ** (เช่น กล้องถูกถืออยู่ก่อนกด Home) ไม่งั้นผ่านลอย ๆ · รอผลด้วยการวนตรวจจนหมดเวลา ไม่ใช่ `sleep` ค่าเดา
   - **อ่านหน้าจอแล้วต้องรู้ว่าสด** — ลบไฟล์ผลเก่าก่อนอ่านใหม่ · กดเมื่อตำแหน่งเป้าหมายนิ่งสองรอบติด · อ่านหน้าจอไม่ได้เพราะแอปวาดไม่หยุด = บั๊กของแอป ไม่ใช่ของสคริปต์
6. **พิสูจน์ว่าสคริปต์จับของผิดได้** — แก้แอปให้ผิดหนึ่งจุดชั่วคราว รันแล้วต้อง `FAIL` แล้วค่อยคืนค่า
7. **พิสูจน์ว่า skill ใช้ได้จริง** — ส่ง agent `qa-tester` ตัวใหม่ที่ไม่เคยเห็นโค้ด ให้ใช้แค่ skill นี้ทดสอบ 1 ฟีเจอร์ตั้งแต่เปิดแอปจนถ่ายภาพผล · ติดตรงไหน แก้ skill ตรงนั้น
8. **เก็บหลักฐานไว้ใน `_to_delete/verify-runs/<เวลา>/`** — ภาพหน้าจอ · log ของการทดสอบ ไม่ปนกับโค้ด (เป็นของชั่วคราว ลบได้เมื่อส่งงานแล้ว)

## SKILL.md ของ verify skill ต้องมี

- description บอกว่าใช้เมื่อ "ต้องพิสูจน์ว่าฟีเจอร์ใช้ได้บนแอปจริง · ทำบั๊กให้เกิดซ้ำ · ตรวจก่อนส่ง"
- คำสั่งเริ่ม · หยุด · ข้อมูลทดสอบ (บัญชีทดสอบอยู่ไฟล์ไหน — **ห้ามใส่รหัสผ่านจริง**)
- ลิงก์ไปแผนที่ฟีเจอร์
- ข้อห้าม — ไม่แตะฐานข้อมูลจริง · ไม่เรียก API ภายนอกที่เสียเงินหรือส่งข้อความจริง

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนขั้นตอนทดสอบเป็นภาษาคนอย่างเดียว ไม่มีสคริปต์ | agent แต่ละตัวจะสร้างวิธีรันใหม่เองทุกครั้ง และแต่ละครั้งไม่เหมือนกัน |
| ใส่ทุกฟีเจอร์ตั้งแต่วันแรก | แผนที่ใหญ่ที่ไม่ได้ทดสอบ เสียเร็วกว่าแผนที่เล็กที่ใช้ได้จริง |
| ให้ verify skill ชี้ไปที่ระบบจริง | การตรวจจะกลายเป็นการแก้ข้อมูลลูกค้า |
| บอกว่าเสร็จโดยไม่ได้ทำข้อ 7 | ยังไม่รู้ว่า agent ตัวอื่นใช้ได้หรือไม่ |

## เชื่อมกับ skill อื่น

- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — แก้เมื่อแอปเปลี่ยนจนแผนที่ไม่ตรง
- `e2e-testing-patterns` — ถ้าจะยกขั้นตอนบางส่วนขึ้นเป็น test อัตโนมัติใน continuous integration (CI)
- [`agent-team`](../agent-team/SKILL.md) — playbook `bug-fix` และ `feature` เรียกใช้ skill ที่สร้างจากที่นี่


## reference: android-native.md

# ขับแอป Android native / Flutter บน emulator

> สรุปจากแอปจริง `Lumio - Light Meter` (Flutter · Android) — สคริปต์ที่รันผ่านแล้วคือ `lumio-light-meter/test/e2e/verify.mjs`
> ค่าที่ระบุว่า "วัดแล้ว" มาจาก emulator บน Windows ที่ใช้ GPU แบบซอฟต์แวร์ เครื่องอื่นอาจเร็วกว่า

## เลือกวิธีขับ

| วิธี | ดีตรงไหน | ข้อจำกัด | ใช้เมื่อ |
|---|---|---|---|
| Node/Python เรียก `adb` + `uiautomator dump` | ไม่ต้องลงอะไรเพิ่ม · ขับ sensor และกล้องเสมือนได้ · ตรวจ `dumpsys` ได้ | อ่านหน้าจอ 3–4 วินาทีต่อครั้ง (วัดแล้ว) | ค่าเริ่ม — ทดสอบทั้งเส้นทาง hardware → native → Dart → จอ |
| Flutter `integration_test` (`flutter test integration_test/`) | หา widget ด้วย `find` ได้ตรง · เร็ว | ป้อนค่า sensor จริงไม่ได้ ต้องใช้แหล่งข้อมูลปลอม · ตรวจสถานะระบบ (กล้องถูกปล่อยไหม) ไม่ได้ | ลำดับหน้าจอยาว ๆ ที่ไม่แตะ hardware |
| Maestro | เขียน flow เป็น YAML อ่านง่าย | ต้องติดตั้งเพิ่ม · ยังไม่ได้ทดสอบในชุดนี้ | ทีมมี Maestro อยู่แล้ว |

## โครงสคริปต์ (แบบ verify.mjs)

1. **ตรวจก่อนเริ่ม** — มีเครื่องต่ออยู่ (`adb devices`) · มี APK (`build/app/outputs/flutter-apk/app-debug.apk`) · ไม่ครบ → exit 1 พร้อมบอกคำสั่งที่ต้องรัน
2. **ติดตั้ง** `adb install -r <apk>` แล้ว **เริ่มสะอาดทุกฟีเจอร์** `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → รอข้อความหน้าแรก
3. **อ่านหน้าจอ** — `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → ดึง `text` และ `content-desc` พร้อมจุดกึ่งกลางจาก `bounds`
4. **กด** `adb shell input tap x y` · **ป้อนค่า** `adb emu sensor set light <lux>` · **ถ่ายภาพ** `adb exec-out screencap -p > shot.png`
5. **ผล** `PASS/FAIL` พร้อม expected กับ actual · exit 0 เฉพาะเมื่อมี check ได้รันอย่างน้อยหนึ่งข้อและผ่านทั้งหมด

## กฎที่ได้จากการรันจริง

| เรื่อง | ทำอย่างนี้ | เพราะ |
|---|---|---|
| ข้อความใน Flutter | ใส่ `Semantics(label: ...)` ให้ค่าที่ต้องตรวจ | label ขึ้นเป็น `content-desc` ใน `uiautomator dump` — ได้ทั้งการตรวจและผู้ใช้โปรแกรมอ่านจอ |
| ไฟล์ dump เก่า | ลบ `/sdcard/ui.xml` ก่อน dump ทุกครั้ง | dump ล้มแล้ว**ไม่เขียนทับ**ไฟล์เดิม จะอ่านได้หน้าจอเก่าโดยไม่รู้ตัว |
| "could not get idle state" | ถือเป็นบั๊กของแอป แก้ที่แอป | แอปวาดใหม่ตลอด (Lumio วาด 5 ครั้ง/วินาทีทั้งที่ค่าไม่เปลี่ยน) — เปลืองแบตและ TalkBack พูดซ้ำ · แก้โดยแจ้ง UI เมื่อค่าที่แสดงเปลี่ยนจริง (sensor ที่สั่น: เปลี่ยนเกิน 1 %) ค่ารองที่ค่อย ๆ ไหลให้อัปเดตราว 1 วินาทีครั้ง |
| ตำแหน่งที่ขยับ | กดเมื่ออ่านสองครั้งติดได้ตำแหน่งเดียวกัน | dialog เลื่อนขึ้นตอนคีย์บอร์ดเปิด กดตำแหน่งเก่าจะโดนฉากหลังแล้ว dialog ปิด (น่าจะเป็นต้นเหตุ flake ที่เหลือหนึ่งครั้ง — ยังไม่ได้ตรวจซ้ำ) |
| สิทธิ์ | `adb shell pm grant <package> android.permission.CAMERA` ก่อน check ที่ไม่ได้ทดสอบหน้าขอสิทธิ์ | หน้าต่างขอสิทธิ์ของระบบไม่ใช่สิ่งที่ check นั้นตรวจ |
| check "ปล่อยแล้ว" | ตรวจเงื่อนไขก่อน (กล้องถูกถืออยู่) → กด Home → วนตรวจ `dumpsys media.camera` หา "Active Camera Clients" ทุก 1 วินาที นานสุด 20 วินาที | emulator ปล่อยกล้อง 5–8 วินาที (วัดแล้ว) · ไม่ตรวจเงื่อนไขก่อน check จะผ่านลอย ๆ |
| Git Bash | เรียก `adb` จาก Node/Python (`execFile`) หรือตั้ง `MSYS_NO_PATHCONV=1` | Git Bash แปลง `/sdcard/...` เป็น `C:/Program Files/Git/sdcard/...` |

## ป้อนค่า hardware

| สิ่งที่ป้อน | บน emulator | หมายเหตุ |
|---|---|---|
| sensor แสง | `adb emu sensor set light <lux>` — แอปได้ผ่าน `Sensor.TYPE_LIGHT` (วัดแล้ว) | sensor อื่นใช้ `adb emu sensor set <ชื่อ> <ค่า>` (ยังไม่ได้ตรวจทีละตัว) |
| กล้อง | กล้องหน้าเสมือนส่งภาพพร้อม ISO และเวลาเปิดรับแสง (วัดแล้ว) | ภาพเป็นฉากสังเคราะห์ ตรวจได้แค่ว่า "มีค่าออกมา" ไม่ใช่ความแม่น |
| อื่น ๆ หรือ emulator ทำไม่ได้ | แหล่งข้อมูลปลอมที่ compile เข้าเฉพาะ debug build | ห้ามหลุดไป release build |

ติดป้ายทุก check: `emulator` = ทางเดินข้อมูลถูก · `เครื่องจริง` = ค่าถูก · check ที่ต้องใช้เครื่องจริงแต่ยังไม่ได้รัน ให้รายงานว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

## เวลาและหน่วยความจำ

| ขั้น | เวลาที่วัดได้ | ตั้ง timeout แยก |
|---|---|---|
| Gradle build ครั้งแรก (ดาวน์โหลด NDK · platform) | ~10 นาที | 20 นาที |
| Gradle build ครั้งต่อไป | 1–2 นาที | 5 นาที |
| boot emulator | หลายนาที (รอยืนยัน — ไม่ได้จับเวลา) | วนตรวจ `adb shell getprop sys.boot_completed` = 1 |
| เปิดแอปจนเห็นหน้าแรก | ไม่กี่วินาที | 20 วินาที |
| ต่อ check (รอค่าบนจอ) | 3–4 วินาทีต่อการอ่าน | 15–20 วินาที |

- emulator + Gradle กินหน่วยความจำมาก — Claude Code เคยปิด emulator ที่รันเบื้องหลังเพราะหน่วยความจำไม่พอ
- เปิด emulator ตัวเดียว · หยุด Gradle daemon หลัง build (`gradlew --stop` ใน `android/`)
- emulator ถูกปิดกลางทาง → รายงานว่า "ยังไม่ได้รันซ้ำ" พร้อมรายชื่อ check ที่ไม่ได้รัน ห้ามลองใหม่เงียบ ๆ แล้วรายงานเฉพาะผลรอบหลัง
- ไม่มี Docker: emulator ใน Docker ต้องมี KVM ซึ่ง Docker Desktop บน Windows ไม่มี → รันบน host


---

# skill: database-design

Use when designing or changing a database schema (tables, columns, indexes, relationships, migrations). Naming, identifiers, data types, indexes, constraints, expand-and-contract migrations, multi-tenancy. Load before CREATE TABLE.

# ออกแบบฐานข้อมูล

> **กฎข้อเดียว:** schema คือของที่แก้ยากที่สุดในระบบ
> โค้ดผิดแก้วันนี้จบวันนี้ · schema ผิดอยู่กับมันสามปี พร้อมข้อมูลจริงอีกสิบล้านแถวที่ต้องย้ายตาม

## เมื่อไหร่ใช้ skill นี้

- ออกแบบฐานข้อมูลของระบบใหม่ หรือ module ใหม่
- จะเพิ่ม/แก้ตาราง คอลัมน์ ความสัมพันธ์ หรือ index
- จะเขียน migration โดยเฉพาะตอนที่ระบบมีข้อมูลจริงแล้ว
- query ช้าแล้วสงสัยว่าเป็นที่ schema หรือที่ index

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` |
| ออกแบบ endpoint และรูปร่าง JSON | `api-conventions` |
| เก็บรหัสผ่าน token สิทธิ์ผู้ใช้ | `auth-implementation-patterns` |
| ที่เก็บ connection string | `config-and-secrets` |
| รัน migration ใน pipeline | `cicd-and-release` |

---

## 1 · เลือกชนิดฐานข้อมูลก่อน

| เกณฑ์ | Relational (PostgreSQL, SQL Server, MySQL) | Document (MongoDB) |
|---|---|---|
| ข้อมูลมีความสัมพันธ์ชัด ต้อง join | ✅ | ❌ ต้องทำมือ |
| รูปร่างข้อมูลไม่แน่นอน ต่างกันรายตัว | ⚠️ ใช้คอลัมน์ JSON | ✅ |
| ต้องการ transaction ข้ามหลายตาราง | ✅ | ⚠️ ได้แต่แพงกว่า |
| รายงาน ผลรวม การวิเคราะห์ | ✅ | ❌ |
| เขียนหนักมาก log/telemetry | ⚠️ | ✅ หรือใช้ time-series |

> **ค่าเริ่มต้นคือ relational** — เลือก document เมื่อ**ตอบได้ว่าทำไม**
> "ยืดหยุ่นกว่า" ไม่ใช่เหตุผล แปลว่ายังไม่ได้ออกแบบ
> ระบบส่วนใหญ่ที่เลือก document เพราะยืดหยุ่น สุดท้ายเขียนโค้ด join เองในแอป

**ผสมกันได้** — ใช้ relational เป็นหลัก แล้วเก็บของที่รูปร่างไม่แน่นอนเป็นคอลัมน์ `jsonb`
ตัวเลือกนี้ดีกว่าแยกฐานข้อมูลสองตัวเกือบทุกกรณี

---

## 2 · กฎตั้งชื่อ — เลือกครั้งเดียว ใช้ทั้งระบบ

| สิ่งที่ตั้งชื่อ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ตาราง | `snake_case` **พหูพจน์** | `orders`, `order_items` |
| คอลัมน์ | `snake_case` เอกพจน์ | `created_at`, `total_amount` |
| primary key | `id` | `id` |
| foreign key | `<ตารางเอกพจน์>_id` | `customer_id` |
| ตารางเชื่อม | `<a>_<b>` เรียงตามตัวอักษร | `role_users` → `user_roles` |
| index | `ix_<ตาราง>_<คอลัมน์>` | `ix_orders_customer_id` |
| unique | `ux_<ตาราง>_<คอลัมน์>` | `ux_users_email` |
| foreign key constraint | `fk_<ตาราง>_<ตารางปลายทาง>` | `fk_orders_customers` |
| check constraint | `ck_<ตาราง>_<เรื่อง>` | `ck_orders_total_non_negative` |

**สิ่งที่ห้ามทำ:**

- ❌ ใส่ชนิดข้อมูลในชื่อ — `name_varchar`, `is_active_bit`
- ❌ ใส่ชื่อตารางนำหน้าคอลัมน์ — `order_order_date` (มันอยู่ในตาราง `orders` อยู่แล้ว)
- ❌ ใช้คำสงวน — `user`, `order`, `group`, `key` ต้องใส่เครื่องหมายคำพูดทุกครั้ง ใช้ `users`, `orders` แทน
- ❌ ตัวย่อที่คนอ่านไม่ออก — `cst_nm` ประหยัดได้ 8 ตัวอักษร แลกกับความสับสนสามปี

> SQL Server ที่ใช้ `PascalCase` ก็ได้ ถ้าโปรเจกต์เดิมใช้อยู่แล้ว
> **ความสม่ำเสมอสำคัญกว่ารูปแบบไหนถูก** — อย่าเปลี่ยนกลางทาง

---

## 3 · คอลัมน์ที่ทุกตารางต้องมี

```sql
id           bigint / uuid   PRIMARY KEY
created_at   timestamptz     NOT NULL DEFAULT now()
updated_at   timestamptz     NOT NULL DEFAULT now()
```

เพิ่มตามความจำเป็น:

| คอลัมน์ | ใส่เมื่อ | หมายเหตุ |
|---|---|---|
| `deleted_at timestamptz` | ต้องกู้ข้อมูลคืนได้ หรือกฎหมายบังคับให้เก็บ | **ทุก query ต้องกรอง** ไม่งั้นข้อมูลที่ลบแล้วโผล่ |
| `created_by` / `updated_by` | ต้องตอบได้ว่าใครแก้ | เก็บ id ผู้ใช้ ไม่ใช่ชื่อ |
| `row_version` / `xmin` | มีคนแก้พร้อมกันได้ | ใช้คู่กับ ETag ใน `api-conventions` |
| `tenant_id` | ระบบหลายผู้เช่า | ดูข้อ 10 |

> 🚨 **soft delete ไม่ใช่ของฟรี** — ทุก unique constraint ต้องคิดใหม่
> `ux_users_email` จะกันไม่ให้สมัครอีเมลเดิมซ้ำ แม้บัญชีเก่าถูกลบไปแล้ว
> แก้ด้วย partial index — `CREATE UNIQUE INDEX ... WHERE deleted_at IS NULL`

---

## 4 · เลือกชนิด identifier

| ชนิด | ข้อดี | ข้อเสีย | ใช้เมื่อ |
|---|---|---|---|
| `bigint` เรียงเพิ่ม | เล็ก เร็ว index ไม่แตก อ่านง่ายตอนไล่ปัญหา | เดา id ถัดไปได้ · รวมข้อมูลหลายที่แล้วชนกัน | ค่าเริ่มต้น ระบบเดียว ฐานข้อมูลเดียว |
| **UUIDv7 / ULID** | เรียงตามเวลา · สร้างจากฝั่งแอปได้ · ไม่ชนกัน | 16 ไบต์ · อ่านด้วยตายาก | ระบบกระจาย · ต้องสร้าง id ก่อนบันทึก · id โผล่ใน URL |
| `UUIDv4` สุ่มล้วน | ไม่ชนกัน เดาไม่ได้ | **index แตกกระจาย เขียนช้าลงชัดเจนเมื่อข้อมูลเยอะ** | เลี่ยงถ้าเลือกได้ |

> 🚨 **UUIDv4 เป็น primary key คือกับดักที่เจอบ่อยที่สุด**
> ค่าสุ่มล้วนทำให้ทุกการ insert ไปแทรกกลางโครงสร้าง index
> ตอนข้อมูลหลักหมื่นไม่รู้สึก ตอนหลักสิบล้านคือช้าจนต้องรื้อ
> ถ้าต้องใช้ UUID ให้ใช้ **v7** ซึ่งขึ้นต้นด้วยเวลา จึงเรียงเพิ่มเหมือน bigint

**เลขที่คนเห็น ≠ primary key** — เลขใบสั่งซื้อ `SO-2026-00042` ที่ลูกค้าอ้างถึง
ให้เป็นคอลัมน์ต่างหากที่มี unique constraint ไม่ใช่เอา primary key ไปโชว์

---

## 5 · normalisation แค่ไหนพอ

**เริ่มที่ 3NF เสมอ** — ข้อเท็จจริงหนึ่งอย่างเก็บที่เดียว

denormalise ได้เมื่อครบสามข้อนี้เท่านั้น:

1. วัดแล้วว่าช้าจริง (มีตัวเลข ไม่ใช่ความรู้สึก)
2. รู้ว่าข้อมูลซ้ำจะถูกอัปเดตยังไงให้ตรงกัน
3. เขียนเหตุผลไว้ในคอมเมนต์ของตาราง

**ยกเว้นที่ยอมรับกันทั่วไป** — ข้อมูลที่ต้อง "แช่แข็ง" ณ เวลาหนึ่ง:
ราคาสินค้าในใบสั่งซื้อต้องคัดลอกลง `order_items.unit_price`
ไม่ใช่ join ไปหา `products.price` เพราะราคาวันนี้ไม่ใช่ราคาวันที่ลูกค้าซื้อ

---

## 6 · สี่ชนิดข้อมูลที่พลาดกันประจำ

### เงิน

```sql
total_amount   numeric(19,4)   NOT NULL      -- ✅
currency       char(3)         NOT NULL      -- ✅ ISO 4217 เช่น THB
total_amount   float / double                -- ❌ 0.1 + 0.2 ไม่เท่ากับ 0.3
```

> ❌ **float กับเงินคือบั๊กที่หาไม่เจอ** — ยอดรวมเพี้ยนไปสตางค์เดียวต่อรายการ
> พอปิดงบสิ้นเดือนถึงรู้ แล้วไล่ย้อนไม่ได้ว่าเพี้ยนตรงไหน

### เวลา

| เก็บ | ใช้ | เหตุผล |
|---|---|---|
| เวลาที่เกิดเหตุการณ์ | `timestamptz` (SQL Server ใช้ `datetimeoffset`) เก็บเป็น UTC | ประเทศไทยไม่มี daylight saving แต่ระบบที่ขายต่างประเทศมี |
| วันเกิด วันครบกำหนด | `date` | ไม่มีเวลา ไม่มีโซนเวลา |
| ช่วงเวลาเปิดร้าน | `time` + คอลัมน์โซนเวลาแยก | |

**กฎ:** เก็บ UTC · แปลงเป็น `+07:00` ตอนแสดงผลเท่านั้น · ห้ามเก็บเวลาไทยดิบ ๆ ใน `timestamp` ที่ไม่มีโซน

**พุทธศักราช** — เก็บเป็น ค.ศ. เสมอ แปลงเป็น พ.ศ. ตอนแสดงผล
ฐานข้อมูลที่เก็บปี 2569 จะคำนวณช่วงเวลาผิดทุกฟังก์ชัน

### enum / สถานะ

| วิธี | ดีเมื่อ | เสียเมื่อ |
|---|---|---|
| ตาราง lookup + foreign key | ค่าเพิ่มได้โดยไม่ deploy · มีชื่อไทย/อังกฤษ · มีลำดับการแสดง | ต้อง join |
| `check constraint` เป็นข้อความ | ค่าคงที่ ไม่ค่อยเปลี่ยน | เพิ่มค่าต้อง migration |
| ชนิด `enum` ของ PostgreSQL | เร็ว เล็ก | **ลบค่าออกไม่ได้** เปลี่ยนลำดับไม่ได้ |
| `int` ดิบ ๆ | — | ❌ อ่าน `status = 3` แล้วไม่มีใครรู้ว่าอะไร |

### boolean

- ตั้งชื่อเป็นประโยคบอกเล่าเชิงบวก — `is_active` ✅ · `is_not_disabled` ❌
- **ถ้าอาจมีสถานะที่สามในอนาคต อย่าใช้ boolean** — `is_approved` จะกลายเป็น `approval_status`
  ในหกเดือน เมื่อมี "รออนุมัติ" เพิ่มมา

---

## 7 · index — วางตรงไหนถึงได้ผล

**ต้องมี:**

- ทุก foreign key (ฐานข้อมูลส่วนใหญ่ **ไม่สร้างให้อัตโนมัติ**)
- คอลัมน์ที่ปรากฏใน `WHERE` ของ query ที่วิ่งบ่อย
- คอลัมน์ที่ใช้ `ORDER BY` คู่กับ pagination

**composite index — ลำดับคอลัมน์สำคัญ:**

```sql
-- query: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX ix_orders_tenant_status_created
  ON orders (tenant_id, status, created_at DESC);
```

ลำดับคือ **เท่ากับ → ช่วง → เรียงลำดับ**
index `(a, b)` ใช้กับ query ที่กรองด้วย `a` อย่างเดียวได้ แต่กรองด้วย `b` อย่างเดียว**ไม่ได้**

**อย่าใส่ index เมื่อ:**

- ตารางเล็กกว่าไม่กี่พันแถว — ฐานข้อมูลอ่านทั้งตารางเร็วกว่า
- คอลัมน์มีค่าซ้ำเยอะ เช่น `is_active` ที่ 95% เป็น true
- ตารางเขียนหนักกว่าอ่านมาก — ทุก index คือต้นทุนที่จ่ายทุกครั้งที่เขียน

> **วัดก่อนเดา** — `EXPLAIN ANALYZE` (PostgreSQL) หรือ execution plan (SQL Server)
> บอกได้ว่า index ถูกใช้จริงไหม การเดาว่า "น่าจะช่วย" ผิดบ่อยกว่าถูก

---

## 8 · constraint อยู่ที่ฐานข้อมูล ไม่ใช่แค่ที่แอป

| กฎ | ที่ควรอยู่ |
|---|---|
| อีเมลห้ามซ้ำ | `UNIQUE` ที่ฐานข้อมูล **และ** ตรวจในแอปเพื่อให้ข้อความ error สวย |
| ยอดเงินห้ามติดลบ | `CHECK (total_amount >= 0)` |
| ใบสั่งซื้อต้องมีลูกค้าจริง | `FOREIGN KEY` |
| สถานะต้องเป็นค่าที่กำหนด | `CHECK` หรือ lookup table |

> **เหตุผล:** แอปไม่ใช่ทางเดียวที่แตะข้อมูล — ยังมี script แก้ข้อมูลด่วน
> งาน import ตอนตีสาม และ service ตัวที่สองที่เขียนทีหลัง
> constraint ที่ฐานข้อมูลคือด่านสุดท้ายที่ไม่มีใครข้ามได้

**`ON DELETE` ต้องเลือกอย่างตั้งใจ:**

| ตัวเลือก | ความหมาย | ใช้กับ |
|---|---|---|
| `RESTRICT` (ค่าเริ่มต้นที่ควรใช้) | ลบไม่ได้ถ้ายังมีลูก | เกือบทุกกรณี |
| `CASCADE` | ลบลูกตามทั้งหมด | ของที่เป็นส่วนประกอบจริง ๆ เช่น `order_items` |
| `SET NULL` | ลูกกลายเป็นไม่มีพ่อ | ความสัมพันธ์ที่ไม่บังคับ |

`CASCADE` ผิดที่เดียว = ลบลูกค้าหนึ่งคนแล้วประวัติการซื้อสิบปีหายตาม

---

## 9 · migration — เปลี่ยน schema โดยไม่ต้องปิดระบบ

**กฎสามข้อ:**

1. **เดินหน้าอย่างเดียว** — migration ที่ merge แล้วห้ามแก้ ถ้าผิดให้เขียนตัวใหม่ทับ
2. **หนึ่ง migration ทำเรื่องเดียว** — ไล่ปัญหาง่าย rollback ตรงจุด
3. **โค้ดเวอร์ชันเก่ากับ schema เวอร์ชันใหม่ต้องอยู่ด้วยกันได้** — ระหว่าง deploy มีทั้งสองเวอร์ชันวิ่งพร้อมกันเสมอ

### expand / contract — ขั้นตอนมาตรฐานสำหรับการเปลี่ยนที่ทำลายของเดิม

ตัวอย่าง: เปลี่ยนชื่อคอลัมน์ `name` → `full_name`

| รอบ deploy | ฐานข้อมูล | โค้ด |
|:--:|---|---|
| **1 · ขยาย** | เพิ่ม `full_name` (nullable) | เขียนลงทั้งสองคอลัมน์ · อ่านจาก `name` |
| **2 · ย้าย** | คัดลอกข้อมูลเก่าเป็นชุด ๆ | อ่านจาก `full_name` ถ้าไม่มีค่อยดู `name` |
| **3 · บีบ** | ตั้ง `NOT NULL` · ลบ `name` | อ่านและเขียน `full_name` อย่างเดียว |

ทำสามรอบดูเสียเวลา แต่แต่ละรอบ rollback ได้โดยไม่เสียข้อมูล
การทำรอบเดียวคือการยอมรับว่าจะปิดระบบ

**คำสั่งที่ล็อกตารางจนระบบค้าง** (ระวังเป็นพิเศษบนตารางใหญ่):

- เพิ่มคอลัมน์ที่มี `DEFAULT` และ `NOT NULL` พร้อมกัน — PostgreSQL รุ่นใหม่ทำได้เร็ว แต่ MySQL ยังเขียนใหม่ทั้งตาราง
- เปลี่ยนชนิดข้อมูล
- สร้าง index ธรรมดา → ใช้ `CREATE INDEX CONCURRENTLY` (PostgreSQL) หรือ `ONLINE = ON` (SQL Server)

**ทดสอบ migration กับสำเนาข้อมูลจริงเสมอ** — migration ที่รัน 0.2 วินาทีบนเครื่องตัวเอง
อาจใช้ 40 นาทีบน production พร้อมล็อกตารางไว้ตลอด

---

## 10 · ระบบหลายผู้เช่า (multi-tenant)

| แบบ | แยกกันแค่ไหน | ต้นทุน | เหมาะกับ |
|---|---|---|---|
| คอลัมน์ `tenant_id` ในทุกตาราง | ต่ำ — พลาดที่เดียวข้อมูลรั่วข้ามผู้เช่า | ถูกสุด | ผู้เช่าเยอะ ข้อมูลต่อรายไม่ใหญ่ |
| schema แยกต่อผู้เช่า | กลาง | migration ต้องวนทุก schema | ผู้เช่าหลักสิบถึงหลักร้อย |
| ฐานข้อมูลแยกต่อผู้เช่า | สูงสุด | แพงสุด | ลูกค้าองค์กรที่บังคับให้แยก |

> 🚨 ถ้าเลือกแบบ `tenant_id` — **บังคับที่ชั้นล่างสุด ไม่ใช่ที่ query แต่ละตัว**
> ใช้ row-level security ของฐานข้อมูล หรือ global filter ของ ORM
> เพราะ query ที่ลืมใส่ `WHERE tenant_id = ?` แค่ตัวเดียว คือข้อมูลลูกค้ารายหนึ่งโผล่ให้อีกรายเห็น
> และมันจะไม่มี error ให้เห็นเลย

---

## 11 · ข้อมูลส่วนบุคคล

- ทำรายการไว้ว่า **คอลัมน์ไหนคือข้อมูลส่วนบุคคล** — ตอบคำถาม "ข้อมูลฉันอยู่ที่ไหนบ้าง" ไม่ได้ถ้าไม่มีรายการนี้
- เลขบัตรประชาชน หมายเลขบัตรเครดิต ข้อมูลสุขภาพ — เข้ารหัสระดับคอลัมน์ หรือไม่เก็บเลยถ้าไม่จำเป็น
- กำหนด **อายุการเก็บ** ต่อตาราง และมีงานลบจริงตามนั้น
- ต้องลบได้เมื่อเจ้าของขอ — soft delete อย่างเดียวไม่นับว่าลบ
- ห้ามคัดลอกข้อมูลจริงลงเครื่อง developer โดยไม่ปิดบัง

---

## 12 · Anti-patterns

- ❌ **ตารางเดียวเก็บทุกอย่าง** (`entity` / `attribute` / `value`) — query อะไรก็ยากไปหมด
- ❌ **`varchar(255)` ทุกคอลัมน์** — ตัวเลขนี้ไม่ได้มีความหมายอะไรเลย กำหนดจากข้อมูลจริง
- ❌ **เก็บหลายค่าในคอลัมน์เดียว** — `"1,4,7"` ค้นไม่ได้ constraint ไม่ได้ ใช้ตารางเชื่อม
- ❌ **ไม่มี foreign key เพราะ "แอปดูแลเอง"** — แล้ววันหนึ่งก็มีแถวกำพร้า
- ❌ **index ทุกคอลัมน์เผื่อไว้** — เขียนช้าลง พื้นที่บาน โดยไม่มีใครได้ประโยชน์
- ❌ **`SELECT *` ในโค้ดจริง** — เพิ่มคอลัมน์ทีไรโค้ดพังทุกที
- ❌ **ตรรกะธุรกิจใน trigger** — ไล่ปัญหาไม่เจอ เพราะไม่มีใครเห็นว่ามันทำงาน
- ❌ **migration ที่เขียนข้อมูลด้วย** ปนกับที่เปลี่ยนโครงสร้าง — rollback แล้วข้อมูลหาย
- ❌ **แก้ schema บน production ด้วยมือ** — รอบหน้าที่ deploy จะไม่ตรงกัน

---

## 13 · ตัวย่อ

- **3NF** — Third Normal Form (การจัดตารางให้ข้อเท็จจริงหนึ่งอย่างเก็บที่เดียว)
- **UUID** — Universally Unique Identifier (รหัสสุ่มยาวที่ไม่ชนกันแม้สร้างคนละเครื่อง)
- **ULID** — Universally Unique Lexicographically Sortable Identifier (UUID ที่เรียงตามเวลาได้)
- **ORM** — Object-Relational Mapper (ตัวแปลงระหว่างตารางกับ object ในโค้ด)
- **PDPA** — Personal Data Protection Act (พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล)

## 14 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปร่าง JSON ที่ API ส่งออก | `api-conventions` |
| รัน migration ตอน deploy | `cicd-and-release` |
| ที่เก็บ connection string | `config-and-secrets` |
| ตาราง user, role, session | `auth-implementation-patterns` |
| วาดผัง ER | `svg-diagram-system` หรือ `markdown-visuals` |
| บันทึกเหตุผลที่เลือกฐานข้อมูลตัวนี้ | `adr-writer` |

**ไวยากรณ์เฉพาะแต่ละฐานข้อมูล ชนิดข้อมูลเทียบกัน และคำสั่ง migration ของแต่ละ ORM** → `references/per-stack.md`


## reference: per-stack.md

# ไวยากรณ์และเครื่องมือแยกตามฐานข้อมูล/ORM

1. [ชนิดข้อมูลเทียบกัน](#1--ชนิดข้อมูลเทียบกัน)
2. [PostgreSQL](#2--postgresql)
3. [SQL Server](#3--sql-server)
4. [MySQL / MariaDB](#4--mysql--mariadb)
5. [MongoDB](#5--mongodb)
6. [Entity Framework Core (.NET)](#6--entity-framework-core-net)
7. [Prisma / Drizzle (Node)](#7--prisma--drizzle-node)
8. [Alembic (Python)](#8--alembic-python)
9. [คำสั่งตรวจ query ช้า](#9--คำสั่งตรวจ-query-ช้า)

---

## 1 · ชนิดข้อมูลเทียบกัน

| ต้องการเก็บ | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|
| id เรียงเพิ่ม | `bigint GENERATED ALWAYS AS IDENTITY` | `bigint IDENTITY(1,1)` | `BIGINT AUTO_INCREMENT` |
| UUID | `uuid` | `uniqueidentifier` | `BINARY(16)` หรือ `CHAR(36)` |
| เงิน | `numeric(19,4)` | `decimal(19,4)` | `DECIMAL(19,4)` |
| เวลา + โซนเวลา | `timestamptz` | `datetimeoffset(3)` | `TIMESTAMP` (เก็บ UTC) |
| วันที่ล้วน | `date` | `date` | `DATE` |
| ข้อความยาวไม่จำกัด | `text` | `nvarchar(max)` | `TEXT` / `LONGTEXT` |
| ข้อความไทย | `text` (UTF-8 อยู่แล้ว) | **`nvarchar` เท่านั้น** | `utf8mb4` |
| จริง/เท็จ | `boolean` | `bit` | `TINYINT(1)` |
| JSON | `jsonb` (มี index ได้) | `nvarchar(max)` + `JSON_VALUE` | `JSON` |
| ไฟล์ไบนารี | `bytea` (หรือเก็บนอกฐานข้อมูล) | `varbinary(max)` | `BLOB` |

> 🚨 **SQL Server + ภาษาไทย** — `varchar` ทำให้ตัวอักษรไทยกลายเป็น `?`
> ต้องใช้ `nvarchar` และเขียนค่าคงที่เป็น `N'ข้อความ'` เสมอ
>
> 🚨 **MySQL ต้องเป็น `utf8mb4`** — ชุดอักขระที่ชื่อ `utf8` เฉย ๆ ของ MySQL
> เก็บได้แค่ 3 ไบต์ ทำให้อีโมจิและอักขระบางตัวหาย

---

## 2 · PostgreSQL

```sql
CREATE TABLE orders (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no      varchar(20)  NOT NULL,
  customer_id   bigint       NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status        varchar(20)  NOT NULL DEFAULT 'draft',
  total_amount  numeric(19,4) NOT NULL DEFAULT 0,
  currency      char(3)      NOT NULL DEFAULT 'THB',
  meta          jsonb,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0),
  CONSTRAINT ck_orders_status CHECK (status IN ('draft','confirmed','shipped','cancelled'))
);

CREATE UNIQUE INDEX ux_orders_order_no ON orders (order_no) WHERE deleted_at IS NULL;
CREATE INDEX ix_orders_customer_id ON orders (customer_id);
CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC);
```

**สร้าง index โดยไม่ล็อกตาราง:**

```sql
CREATE INDEX CONCURRENTLY ix_orders_status ON orders (status);
-- ห้ามอยู่ใน transaction · ถ้าล้มจะเหลือ index สถานะ invalid ต้อง DROP แล้วทำใหม่
```

**อัปเดต `updated_at` อัตโนมัติ:**

```sql
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_touch BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

**row-level security สำหรับระบบหลายผู้เช่า:**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::bigint);
-- แอปตั้งค่าต่อ connection: SET app.tenant_id = '42';
```

---

## 3 · SQL Server

```sql
CREATE TABLE orders (
  id            bigint IDENTITY(1,1) PRIMARY KEY,
  order_no      nvarchar(20)   NOT NULL,
  customer_id   bigint         NOT NULL,
  status        nvarchar(20)   NOT NULL CONSTRAINT df_orders_status DEFAULT N'draft',
  total_amount  decimal(19,4)  NOT NULL CONSTRAINT df_orders_total DEFAULT 0,
  created_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_created DEFAULT sysdatetimeoffset(),
  updated_at    datetimeoffset(3) NOT NULL CONSTRAINT df_orders_updated DEFAULT sysdatetimeoffset(),
  row_version   rowversion,
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT ck_orders_total_non_negative CHECK (total_amount >= 0)
);

CREATE INDEX ix_orders_status_created ON orders (status, created_at DESC)
  WITH (ONLINE = ON);   -- Enterprise / Azure SQL เท่านั้น
```

- `rowversion` ใช้เป็น ETag สำหรับตรวจการแก้ชนกันได้ตรง ๆ
- เรียงลำดับภาษาไทย ให้ตั้ง collation `Thai_100_CI_AS` ที่ระดับคอลัมน์หรือฐานข้อมูล
- `datetime` แบบเก่ามีความละเอียดแค่ 3.33 มิลลิวินาที — ใช้ `datetime2` / `datetimeoffset` แทน

---

## 4 · MySQL / MariaDB

```sql
CREATE TABLE orders (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_no     VARCHAR(20)   NOT NULL,
  customer_id  BIGINT        NOT NULL,
  total_amount DECIMAL(19,4) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_orders_order_no (order_no),
  KEY ix_orders_customer_id (customer_id),
  CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

- `ALTER TABLE` ส่วนใหญ่เขียนตารางใหม่ทั้งตาราง — ตารางใหญ่ให้ใช้ `pt-online-schema-change` หรือ `gh-ost`
- ตั้งเวลาเซิร์ฟเวอร์เป็น UTC (`default_time_zone = '+00:00'`)

---

## 5 · MongoDB

```js
db.createCollection("orders", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["orderNo", "customerId", "totalAmount", "createdAt"],
    properties: {
      orderNo:     { bsonType: "string" },
      customerId:  { bsonType: "objectId" },
      totalAmount: { bsonType: "decimal" },   // ❌ อย่าใช้ double กับเงิน
      createdAt:   { bsonType: "date" }
    }
  }}
});
db.orders.createIndex({ orderNo: 1 }, { unique: true });
db.orders.createIndex({ customerId: 1, createdAt: -1 });
```

- ฝัง (embed) เมื่อข้อมูลลูก **อ่านคู่กับพ่อเสมอและไม่โตไม่จำกัด** · นอกนั้นให้อ้างอิง
- เอกสารหนึ่งใบมีเพดาน 16 MB — อาเรย์ที่โตเรื่อย ๆ จะชนเพดานวันหนึ่ง
- `Decimal128` เท่านั้นสำหรับเงิน

---

## 6 · Entity Framework Core (.NET)

```bash
dotnet ef migrations add AddOrderStatus
dotnet ef migrations script <from> <to> -o migrate.sql   # ✅ ตรวจ SQL ก่อนรันจริง
dotnet ef database update                                # dev เท่านั้น
```

> **บน production ให้รัน script ที่ตรวจแล้ว ไม่ใช่ `database update`**
> คำสั่งนั้นต้องการสิทธิ์แก้ schema จาก connection ของแอป ซึ่งไม่ควรมีอยู่แล้ว

```csharp
modelBuilder.Entity<Order>(e => {
    e.ToTable("orders");
    e.Property(x => x.TotalAmount).HasColumnType("decimal(19,4)");
    e.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_orders_status_created");
    e.HasQueryFilter(x => x.DeletedAt == null);          // soft delete ทั้งระบบ
    e.Property(x => x.RowVersion).IsRowVersion();        // ตรวจการแก้ชนกัน
});
```

---

## 7 · Prisma / Drizzle (Node)

```prisma
model Order {
  id          BigInt   @id @default(autoincrement())
  orderNo     String   @unique @map("order_no") @db.VarChar(20)
  totalAmount Decimal  @map("total_amount") @db.Decimal(19, 4)
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(3)
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  BigInt   @map("customer_id")

  @@index([status, createdAt], name: "ix_orders_status_created")
  @@map("orders")
}
```

```bash
npx prisma migrate dev --name add_order_status   # dev — สร้างไฟล์ migration
npx prisma migrate deploy                        # production — รันเฉพาะที่มีอยู่แล้ว
```

- `Decimal` ของ Prisma กลับมาเป็น object ไม่ใช่ number — คำนวณด้วย `decimal.js` อย่าแปลงเป็น float
- `BigInt` แปลงเป็น JSON ตรง ๆ ไม่ได้ ต้องแปลงเป็น string ที่ชั้น API

---

## 8 · Alembic (Python)

```bash
alembic revision --autogenerate -m "add order status"
alembic upgrade head
alembic downgrade -1
```

```python
def upgrade():
    op.add_column("orders", sa.Column("status", sa.String(20), nullable=True))
    op.execute("UPDATE orders SET status = 'draft' WHERE status IS NULL")
    op.alter_column("orders", "status", nullable=False)
    op.create_index("ix_orders_status_created", "orders", ["status", "created_at"],
                    postgresql_concurrently=True)
```

> `--autogenerate` **ไม่เห็น** การเปลี่ยนชื่อ (มองเป็นลบแล้วเพิ่มใหม่ = ข้อมูลหาย)
> อ่านไฟล์ที่มันสร้างทุกครั้งก่อน commit

---

## 9 · คำสั่งตรวจ query ช้า

| ฐานข้อมูล | คำสั่ง |
|---|---|
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) <query>;` · ส่วนขยาย `pg_stat_statements` |
| SQL Server | เปิด "Include Actual Execution Plan" · `sys.dm_exec_query_stats` |
| MySQL | `EXPLAIN ANALYZE <query>;` · `performance_schema` |
| MongoDB | `db.orders.find(...).explain("executionStats")` |

**สัญญาณอันตรายที่ต้องแก้:** `Seq Scan` / `Table Scan` บนตารางใหญ่ ·
จำนวนแถวที่ประมาณไว้ต่างจากที่ได้จริงเกินสิบเท่า · `Nested Loop` ที่วนหลักแสนรอบ
