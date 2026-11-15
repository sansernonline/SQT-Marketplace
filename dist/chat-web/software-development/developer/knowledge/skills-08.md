# skill: docker-sandbox

Use when a project needs a Docker sandbox for untrusted code

# docker-sandbox — ห้องทดลองต่อโปรเจกต์

> เครื่องเราเป็นคนสั่ง ห้องทดลองเป็นที่ลงมือ
> ข้างในติดตั้ง ลบ รันเซิร์ฟเวอร์ ทำฐานข้อมูลทดสอบได้เต็มที่ เพราะพังแล้วล้างทิ้งสร้างใหม่ได้ในคำสั่งเดียว
> ข้างนอก (เครื่องจริง · ระบบจริง · บัญชีจริง) แตะไม่ได้ เพราะไม่มีทางเข้าจากข้างใน

ใช้คู่กับ [`superuser`](../superuser/SKILL.md) — โปรเจกต์ที่มี `.sandbox/` งานติดตั้งและรันทุกอย่างทำในห้องนี้

ไม่ใช้เมื่อ: เขียน Dockerfile หรือ image สำหรับ deploy จริง → [`kubernetes-helm`](../kubernetes-helm/SKILL.md) เพราะห้องทดลองเป็นที่รันงานชั่วคราว ไม่ใช่ image ที่ขึ้น production

---

## 1 · หนึ่งโปรเจกต์ = หนึ่งห้อง

- **ห้องเดียวต่อโปรเจกต์** ชื่อ `sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่สร้าง>` (เช่น `sandbox-agent-sample-app-20260125`)
  - ตั้งชื่อครั้งเดียวตอน `up` แรก แล้วเก็บในไฟล์ `.sandbox/.name-<ชื่อโฟลเดอร์>` คำสั่งทีหลังอ่านชื่อจากไฟล์นี้ ชื่อจึงไม่เปลี่ยนตามวัน
  - prefix `sandbox-agent-` บอกว่า agent สร้างห้องนี้ ไม่ใช่คนตั้ง ส่วนวันที่สร้างเก็บซ้ำไว้ใน label `sqt.created`
  - ถ้าโปรเจกต์ต้องมีฐานข้อมูล cache หรือเบราว์เซอร์ ให้เพิ่มเป็น service ใน**ห้องเดียวกัน** (stack เดียว) ไม่แยกห้องใหม่
- **image ฐานใช้ร่วมกันทั้งเครื่อง** — `sqt-sandbox-base:1` (Node · Python · Git · Playwright Chromium · Claude Code) build ครั้งเดียว ส่วน image ของแต่ละโปรเจกต์เพิ่มแค่ชั้นบาง ๆ ที่โปรเจกต์นั้นต้องใช้ จึงไม่กินดิสก์ซ้ำ
- **ห้องที่หยุดอยู่ไม่กิน CPU และหน่วยความจำ** กินแค่ดิสก์ จบงานแล้วให้ `stop` และเลิกงานทั้งวันให้ `stop-all`
- **ห้องเพิ่มชั่วคราว** (`-Name <โปรเจกต์>-a1`) ใช้เฉพาะตอนลองหลายทางพร้อมกันที่ต้องแยกเครื่องจริง (งานลองหลายทางทั่วไปใช้ git worktree ต่อตัวตาม `parallel-split-and-merge` เร็วกว่า) แล้ว `destroy` ทิ้งทันทีที่เลือกได้
- **ไม่รวมหลายโปรเจกต์ไว้ห้องเดียว** — เพราะของที่ติดตั้งจะชนกัน โปรเจกต์หนึ่งพังแล้วลามไปอีกโปรเจกต์ และล้างทีละโปรเจกต์ไม่ได้

## 2 · สองแบบ เลือกตามงาน

| | **mount** (ค่าเริ่ม) | **isolated** (`-Isolated`) |
|---|---|---|
| ไฟล์โปรเจกต์ | โฟลเดอร์จริงต่อเข้าไปที่ `/work` แก้แล้วเห็นบนเครื่องทันที | สำเนาอยู่ใน volume โฟลเดอร์จริงต่อเข้าไปแบบอ่านอย่างเดียวที่ `/src` |
| ใครแก้ไฟล์ | Claude Code บนเครื่องแก้ไฟล์ตามปกติ (`sandbox.ps1 claude` ใช้ไม่ได้ในโหมดนี้) | Claude Code **ในห้อง** (`sandbox.ps1 claude`) |
| ใครรันคำสั่ง | ส่งเข้าห้องด้วย `sandbox.ps1 exec "..."` | Claude Code ในห้องรันเอง ไม่มีหน้าต่างขออนุญาต |
| ผลกลับมาอย่างไร | อยู่ในโฟลเดอร์แล้ว | `sandbox.ps1 sync` → patch ใน `_to_delete\sandbox\` แล้วคนสั่ง `git apply` |
| ใช้เมื่อ | งานประจำวันที่คนดูอยู่ | งานทั้งคืน · งานเสี่ยง · ลองหลายทางที่ต้องแยกเครื่องจริง (ห้องละทาง) |

เพิ่ม `-Locked` ได้ทั้งสองแบบ — ปิดอินเทอร์เน็ตขาออก เหลือเฉพาะโฮสต์ใน `allowlist.txt` เหมาะกับงานที่รันโค้ดที่ยังไม่ไว้ใจ

---

## 3 · ตั้งห้องให้โปรเจกต์ (ครั้งแรก)

1. ตรวจว่า Docker Desktop รันอยู่ — `docker version` ต้องเห็นทั้ง Client และ Server ถ้าไม่เห็น ให้บอกผู้ใช้ให้เปิด Docker Desktop แล้วหยุดเฉพาะงานนี้
2. คัดลอกทุกไฟล์ใน `assets/` ของ skill นี้ไปที่ `<โปรเจกต์>/.sandbox/` (ที่ราก) แล้วประกาศ `.sandbox/` เป็นข้อยกเว้นของรากใน README ของโฟลเดอร์โค้ด ตาม `project-doc-set` ข้อ 1
3. ปรับ `Dockerfile` (ชั้นของโปรเจกต์)
   - ถ้าเป็น .NET ให้ตั้ง `INSTALL_DOTNET=1` แล้วเพิ่ม `apt-get install` ของที่โปรเจกต์ต้องใช้
   - **อย่าแก้ `base.Dockerfile`** ถ้าไม่จำเป็น เพราะทุกโปรเจกต์ใช้ร่วมกัน
   - ถ้าต้องมีฐานข้อมูลทดสอบ ให้เพิ่มเป็น service ใหม่ใน `compose.yaml` (ไม่เปิด port ออกนอก)
4. เพิ่ม `.sandbox/.mode-*` และ `.sandbox/.name-*` ใน `.gitignore`
5. เปิดห้อง — `.\.sandbox\sandbox.ps1 up` (หรือ `up -Isolated` · `up -Browser`) โปรเจกต์แรกของเครื่องต้อง build image ฐานก่อน ใช้เวลาราว 5–15 นาที ส่วนโปรเจกต์ถัดไปจะเร็วขึ้นมาก
6. **พิสูจน์ว่าใช้ได้** — `sandbox.ps1 exec "node -v && python3 --version && git status"` ถ้าโปรเจกต์มีคำสั่ง test ให้รันผ่าน `exec` 1 ครั้ง ส่วนโหมด `-Locked` ต้องเห็นบรรทัด `check passed`
7. ลงใน `docs/README.md` ของโปรเจกต์ — ชื่อห้อง (`sandbox-agent-<ชื่อโฟลเดอร์>-<วันที่>`) · โหมด · port · คำสั่ง test ในห้อง

**ทดสอบจริงแล้ว** บน Windows + Docker Desktop 4.46 (2026-10-05, โปรเจกต์ `sample-app`) — build ห้องได้ · unit test ผ่าน 15/15 · e2e บน Chromium ผ่าน 14/14 ในห้อง

บั๊กที่เจอระหว่างทดสอบแก้ในสคริปต์แล้ว: PowerShell 5.1 กับ stderr · Playwright คนละรุ่นกับ image ฐาน · พอร์ตชน

ถ้าสคริปต์พังบนเครื่องอื่น ให้ใช้ playbook `bug-fix` กับตัวสคริปต์

**พอร์ต** — `up` หาพอร์ตว่างเอง เริ่มที่ 3000 แล้วบอกว่าได้พอร์ตไหน
- ในห้องตั้งตัวแปร `APP_PORT` และ `PORT` เป็นพอร์ตนั้น และ `HOST=0.0.0.0`
- แอปต้องฟังที่ `HOST` เพราะถ้าฟังแค่ `127.0.0.1` ในห้อง เครื่องจะเข้าไม่ถึง
- ฝั่งเครื่องยังเปิดแค่ `127.0.0.1` เหมือนเดิม จึงเข้าจากเครื่องที่ `http://127.0.0.1:<พอร์ต>`

**Playwright คนละรุ่น** — image ฐานมี Chromium รุ่นล่าสุด ถ้าโปรเจกต์ล็อก Playwright รุ่นอื่นไว้ ให้รัน `npx playwright install chromium` ในห้อง 1 ครั้งหลัง `npm ci` (ไม่ต้อง `--with-deps` เพราะ image มีให้แล้ว)

---

## 4 · ใช้ทุกวัน

| ต้องการ | คำสั่ง (รันที่รากโปรเจกต์บนเครื่อง) |
|---|---|
| รันคำสั่งในห้อง (agent ใช้อันนี้) | `.\.sandbox\sandbox.ps1 exec "npm test"` |
| เปิด shell ในห้อง | `.\.sandbox\sandbox.ps1 shell` |
| ให้ Claude Code ทำงานในห้องเต็มที่ (**isolated เท่านั้น**) | `.\.sandbox\sandbox.ps1 claude` (ล็อกอินครั้งแรกครั้งเดียว volume เก็บไว้ · โหมด mount สคริปต์จะปฏิเสธ เพราะ `/work` คือโฟลเดอร์จริง) |
| เอางานจากห้อง isolated ออกมา | `.\.sandbox\sandbox.ps1 sync` แล้วอ่าน patch ก่อน `git apply` |
| ห้องทั้งหมดในเครื่อง | `.\.sandbox\sandbox.ps1 list` |
| ล้างห้องให้สะอาด เริ่มใหม่ | `reset` แล้ว `up` |
| หยุดทุกห้องในเครื่อง คืนหน่วยความจำ | `.\.sandbox\sandbox.ps1 stop-all` |
| ห้องหลายห้องของโปรเจกต์เดียว | ใส่ `-Name <โปรเจกต์>-a1` ทุกคำสั่ง |

**กฎของ agent เมื่อโปรเจกต์มี `.sandbox/`**
- install · build · test · dev server · migration และสคริปต์ใด ๆ ให้รันผ่าน `sandbox.ps1 exec` ไม่รันบนเครื่อง
- skill ตรวจแอปของโปรเจกต์ (`app-verifier-setup`) รัน Playwright ในห้องแบบไม่มีหน้าจอ แล้วคัดภาพออกด้วย `docker compose cp` มาไว้ `_to_delete/`
- ถ้าห้องหยุดอยู่ ให้ `up` เองได้เลย (ย้อนได้) ถ้าห้องพังจนแก้ไม่ได้ ก็ `reset` เองได้ เพราะของในห้องไม่ใช่ของผู้ใช้ — **ยกเว้น** ห้อง isolated ที่ยังไม่ได้ `sync` ต้อง sync ก่อนแล้วค่อย reset

---

## 5 · เบราว์เซอร์เสมือนสำหรับทดสอบ

| แบบ | ใช้เมื่อ | วิธี |
|---|---|---|
| headless ในห้อง (ค่าเริ่ม) | test อัตโนมัติ · verify skill · ไม่ต้องมีใครดู | Playwright Chromium มากับ image ฐานแล้ว |
| **มองเห็นได้** (`up -Browser`) | อยากดู agent กดจริงทีละขั้น · ตรวจหน้าจอด้วยตา · อัดภาพ | เบราว์เซอร์จริงในคอนเทนเนอร์แยก ดูสดที่ `http://127.0.0.1:7900` และ Playwright ในห้องจะขับผ่าน `SELENIUM_REMOTE_URL` ให้เอง (Playwright เรียกความสามารถนี้ว่ายังทดลอง) |
| ให้ Claude Code ในห้องคุมเบราว์เซอร์เอง | งานสำรวจหน้าเว็บที่ยังไม่มีสคริปต์ | ติดตั้ง Playwright MCP server ในห้อง (`.mcp.json` ของโปรเจกต์) ให้ทำงานแบบ headless |

- เบราว์เซอร์ในห้องไม่มีบัญชี ไม่มีคุกกี้ ไม่มีรหัสผ่านของผู้ใช้ — ล็อกอินด้วยบัญชีทดสอบของโปรเจกต์เท่านั้น
- ภาพและวิดีโอจากการทดสอบ คัดออกมาที่ `_to_delete/` ด้วย `docker compose cp`
- Playwright MCP ในห้อง (ตัวอย่างจากงานสอน ยังไม่ใช่เกณฑ์): รันเป็น root ต้องใส่ `--no-sandbox` · ค่า `--browser` ต้องตรงกับ `--help` ของรุ่นที่ลง (`chromium` หรือ `chrome` ถ้าไม่ตรงจะหาเบราว์เซอร์ไม่เจอ) · ภาพ screenshot ที่ตั้งชื่อแบบ relative ไปลงที่ working directory ของ process ไม่ใช่ `--output-dir` ต้องย้ายเอง · คลิกแล้ว timeout "not visible/stable" อาจเป็นแท็บเบื้องหลัง ดู `e2e-testing-patterns`
- เบราว์เซอร์ของผู้ใช้บนเครื่อง (Chrome ที่ล็อกอินอยู่) ใช้กับเว็บจริงที่ต้องใช้บัญชีจริงเท่านั้น และทำตามกติกาของเครื่องมือนั้น ไม่ใช่ที่ทดสอบ

## 6 · CAPTCHA

- **ระบบของเราเอง** — CAPTCHA ไม่ควรขวางการทดสอบตั้งแต่ต้น
  - ใช้ค่าทดสอบ (test site key) ที่ผู้ให้บริการแจกไว้ ซึ่งผ่านทุกครั้ง reCAPTCHA · hCaptcha · Cloudflare Turnstile มีให้ทุกเจ้า ดูค่าได้จากเอกสารผู้ให้บริการ
  - หรือปิดด้วยค่าตั้งเฉพาะ environment ทดสอบ (`CAPTCHA_ENABLED=false`)
  - **ค่าทดสอบต้องไม่หลุดไปถึงระบบจริง** — ใส่ตัวตรวจตอนเริ่มระบบว่า production ห้ามใช้ test key (`config-and-secrets`)
- **เว็บของคนอื่น** — agent **ไม่แก้ CAPTCHA และไม่หาทางหลบ** (ไม่ใช้บริการรับแก้ ไม่ปลอมตัวเป็นคน) ถ้าเจอ CAPTCHA ให้หยุดขั้นนั้น บอกผู้ใช้ให้ทำเอง แล้วทำส่วนอื่นต่อ ถ้าต้องดึงข้อมูลจากเว็บนั้นบ่อย ให้หา API ทางการแทน
- เหตุผล — CAPTCHA คือเจ้าของเว็บบอกว่า "ห้ามบอท" การหลบจึงเท่ากับฝ่าข้อตกลงของเขา และทำให้ IP หรือบัญชีถูกแบน

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
| mount ของจากเครื่องแบบเขียนได้ ทั้งที่ห้องแค่ต้องอ่าน (`ref/` · ข้อมูลตัวอย่าง · cache SDK ที่แชร์ · ซอร์สต้นทางของโหมด isolated) | โค้ดในห้องที่ถูกหลอกจะเขียนกลับเครื่องได้ — ใส่ `:ro` ทุก mount ที่ไม่ใช่ผลงานของรอบนี้ แล้วให้ห้องคัดลอกเข้าพื้นที่ของตัวเองถ้าต้องแก้ (แนวคิดจาก anthropics/claude-code devcontainer และ trailofbits/skills) |

เอกสารของ Claude Code เตือนไว้ว่า แม้ในคอนเทนเนอร์ การรันแบบไม่มีหน้าต่างขออนุญาต (`--dangerously-skip-permissions`) ยังกันไม่ได้ถ้าโค้ดในโปรเจกต์ตั้งใจขโมยของที่อยู่ในห้อง รวมถึง token ของ Claude Code เอง — ใช้กับ repo ที่ไว้ใจเท่านั้น และใช้ `-Locked` เมื่อไม่แน่ใจ

`sandbox.ps1 claude` จึงรันได้เฉพาะโหมด isolated — โหมด mount สคริปต์ปฏิเสธ เพราะ `/work` คือโฟลเดอร์จริงของผู้ใช้ (§7 ข้อสุดท้าย)

**ขีดจำกัดของ `-Locked`** — DNS ออกได้เฉพาะ resolver ที่ห้องได้รับ (ของ Docker) ไม่ใช่ DNS server ใดก็ได้ แต่ resolver นั้นยังส่งต่อคำถามออกนอก จึงยังแอบส่งข้อมูลผ่าน DNS (DNS tunnelling) ได้ งานที่ห้ามข้อมูลรั่วเด็ดขาดให้รันแบบไม่มีเครือข่ายเลย

---

## 9 · หมายเหตุ Windows

- Docker Desktop ใช้ WSL 2 ไฟล์บนไดรฟ์ `C:` ที่ mount เข้าไปจึงช้ากว่าไฟล์ใน volume ถ้า build หรือ test ช้ามาก ให้ใช้ `-Isolated` (ตรวจจริง: `npm ci` แค่ 2 แพ็กเกจใช้ 52 วินาทีบนโฟลเดอร์ OneDrive)
- **โปรเจกต์ในโฟลเดอร์ OneDrive** — โหมด mount จะทำให้ `node_modules` และไฟล์ build ถูก sync ขึ้นคลาวด์ จึงควรใช้ `-Isolated` หรือย้ายโปรเจกต์ออกจาก OneDrive
- ถ้ารัน `sandbox.ps1` ไม่ได้ ให้ใช้ `powershell -ExecutionPolicy Bypass -File .\.sandbox\sandbox.ps1 <คำสั่ง>`
- `-Locked` อ่าน IP ของโฮสต์ครั้งเดียวตอนเปิด บริการที่เปลี่ยน IP บ่อยอาจหลุด ให้ `up -Locked` ใหม่

## เชื่อมกับ skill อื่น

- `parallel-attempts-pick-best` — ปกติผู้แข่งใช้ git worktree ต่อตัว · ใช้ห้อง isolated ต่อตัว (`-Name <โปรเจกต์>-a1` …) เฉพาะงานที่ต้องแยกเครื่องจริง
- [`app-verifier-setup`](../app-verifier-setup/SKILL.md) — สคริปต์ `start` ของ verify skill รันในห้อง
- `config-and-secrets` — ค่าทดสอบใส่ `.env` ที่ไม่เข้า git และไม่ bake ลง image
- playbook `housekeeping` ของ `superuser` — เก็บกวาดห้องและ image เก่า


---

# skill: project-doc-set

Use when choosing a project doc set or open-items Excel

# ชุดเอกสารโปรเจกต์

> **กฎข้อเดียว:** เอกสารทุกชิ้นต้องตอบได้ว่า **ใครอ่าน** และ **อ่านแล้วตัดสินใจอะไร**
> ถ้าตอบไม่ได้ ก็ไม่ต้องเขียน

---

## เมื่อไหร่ใช้ skill นี้

เปิดโปรเจกต์ใหม่แล้วต้องตัดสินว่ามีเอกสารอะไร · เอกสารกระจัดกระจายไม่รู้ว่าอันไหนตัวจริง · ลูกค้าถามว่าส่งมอบอะไรบ้าง · จะเขียนเอกสารแต่ไม่แน่ใจว่าต้องมีอะไรก่อน

## เมื่อไหร่ **ไม่** ใช้

| สถานการณ์ | ใช้แทน |
|---|---|
| โครงโฟลเดอร์ของ**โค้ด** (รวม `docs/` ในโค้ดของแบบ A) · README · CHANGELOG · linter | `project-bootstrap` |
| ตั้ง**ชื่อไฟล์** และเลขเวอร์ชันของเอกสาร | `document-naming` |
| ลงมือเขียนเอกสารชิ้นใดชิ้นหนึ่ง | skill ของเอกสารนั้น (ตารางข้อ 4) |
| จัดรูปแบบหน้าเอกสารให้สวย | `branded-document-design` |

---

## 1 · เอกสารอยู่ในหรืออยู่นอก repo

**ตัดสินข้อนี้ก่อน** (ย้ายทีหลังต้องแก้ลิงก์ทั้งโปรเจกต์) · **ค่าเริ่มต้นคือแบบ B** แม้เอกสารเป็น markdown ล้วน โค้ดอยู่ใน `<project-name>/` (ตัวพิมพ์เล็กคั่น `-`) · แบบ A เมื่อผู้ใช้ขอเท่านั้น

- **แบบ B** (เอกสารนอก repo) — ใช้กับทุกขนาดชุด (S · M · L) · `.docx` / `.xlsx` / mockup / PNG ที่ลูกค้าต้องเห็นไม่ปนใน pull request · ผังรากอยู่ข้างล่าง (ข้อนี้คือเจ้าของผังราก)
- **แบบ A** (เอกสารใน repo) — เฉพาะเมื่อผู้ใช้ขอ และเอกสารเป็น markdown ล้วน · เอกสารกับโค้ดเปลี่ยนใน pull request เดียวกัน · รากเหมือนแบบ B แต่ไม่มี `docs/` ที่ราก — `docs/` อยู่ในโฟลเดอร์โค้ด ผังข้างในเป็นของ `project-bootstrap` ข้อ 1
- แบบ A ที่โตจนมีเอกสารส่งมอบ → ย้ายเป็นแบบ B **ทั้งชุดในครั้งเดียว** เอกสารที่อยู่ 2 ที่คือมี 2 เวอร์ชัน

### โครงของแบบ B

```
<ชื่อโปรเจกต์>/
├─ ref/                 ของที่ได้รับมา — TOR · บันทึกประชุม · ภาพหน้าจอระบบเดิม · ไฟล์จากลูกค้า  **อ่านอย่างเดียว ห้ามแก้**
├─ docs/                เอกสารทุกชิ้นที่เราเขียน — .docx ส่งมอบ และ .md เชิงเทคนิค อยู่ด้วยกัน
│  ├─ figures/          รูปที่ export แล้ว — .png เท่านั้น        [มีเมื่อมีรูปในเอกสารส่งมอบ]
│  │  └─ src/           ไฟล์ต้นทางของรูป (.html · .mmd · .drawio)
│  ├─ decisions/        ADR-NNNN-<slug>.md หนึ่งการตัดสินใจต่อไฟล์  [ทางเลือก]
│  ├─ runbook-<เรื่อง>.md  คู่มือเมื่อระบบมีปัญหา ไฟล์ละเรื่อง        [ทางเลือก]
│  └─ research/         research แอปต้นแบบ (`reference-app-research`) [ทางเลือก]
├─ mockup/              .html ที่เปิดแล้วกดได้จริง
├─ qa/                  test case · ผลทดสอบ · bugs/ รายงานบั๊ก
├─ assets/              โลโก้ · ไอคอนทุกขนาด · favicon · wordmark (ต้นทาง .svg + ไฟล์ export)
├─ _to_delete/          ของชั่วคราวทุกอย่าง
├─ .claude/            skill ของโปรเจกต์ (เช่น verify) — ต้องอยู่ที่ที่เปิด Claude Code
│  └─ superuser/        ไฟล์ทำงานของ SuperUser — CONTEXT.md · HISTORY.md · IMPROVEMENTS.md · log/ · inbox/ · learn/
└─ <project-name>/      repo โค้ด ชื่อโปรเจกต์ตัวพิมพ์เล็กคั่น `-` — โครงข้างในเป็นของ `project-bootstrap`
```

**ไฟล์ของ SuperUser** (`.claude/superuser/` · `docs/BRIEF.md` · `AGENTS.md`/`GEMINI.md`) — ต้นฉบับอยู่ที่ [`superuser/references/team-files.md`](../superuser/references/team-files.md) ที่เดียว

**ADR และ runbook อยู่ใน `docs/` ที่ราก ไม่ใช่ `<project-name>/docs/`** (แบบ A ย้ายทั้ง `docs/` เข้าโฟลเดอร์โค้ด ผังข้างในเหมือนกัน) (`docs/decisions/ADR-NNNN-<slug>.md` · `docs/runbook-<เรื่อง>.md`) — ข้อนี้คือที่เดียวที่กำหนด

**ข้อยกเว้นของราก:** `.sandbox/` อยู่ที่รากได้เมื่อใช้ `docker-sandbox` · `AGENTS.md` / `GEMINI.md` ตามเงื่อนไขข้างบน — ทุกข้อยกเว้นต้องประกาศใน README ของโฟลเดอร์โค้ด

**โฟลเดอร์สร้างเมื่อมีของจริง ไม่สร้างเผื่อ:** `ref/` เมื่อได้ไฟล์จากลูกค้าหรือระบบเดิม (ห้ามปนใน `docs/`) · `docs/figures/` เมื่อมีรูปวาดเองในเอกสารส่งมอบ (ไม่งั้นรูปติดอยู่ใน `.docx` แก้ไม่ได้) · `docs/decisions/` เมื่อมีการตัดสินใจที่ต้องอธิบายทีหลัง · `docs/research/` เมื่อผู้ใช้อยากได้แอปแบบที่มีอยู่ · `qa/` เมื่อมี test case (test case อยู่ที่นี่เสมอ `docs/test-plan.md` มีแค่แผน) · `assets/` เมื่อมีโลโก้หรือไอคอน

**โปรเจกต์แบบ ecosystem** (sub-project ≥ 2 ตัว แต่ละตัวมีเอกสารชุดของตัวเอง) → โฟลเดอร์ชื่อ `ecosystem/` เสมอ (ห้าม `projects/` `modules/` `apps/`) · `ecosystem/<รหัส>-<SUB>/` มี `docs/` `mockup/` `qa/` และ repo ของตัวเอง · เอกสารที่ครอบทุกตัวอยู่ `docs/` ที่รากที่เดียว · ผังและกฎเต็ม → [`references/ecosystem.md`](references/ecosystem.md)


**กฎของโฟลเดอร์ (ใช้ได้ทั้ง 2 แบบ):**

- **`.docx` กับ `.md` อยู่ใน `docs/` เดียวกันได้** ไม่ต้องแยกโฟลเดอร์ เพราะนามสกุลบอกอยู่แล้วว่าใครอ่าน
- **ไฟล์ต้นทางของรูปห้ามหาย** เพราะถ้าปีหน้าต้องแก้รูปแล้วเหลือแต่ PNG ก็ต้องวาดใหม่ทั้งใบ
- **ทุกปุ่มใน mockup ต้องกดได้จริง** เพราะปุ่มหลอกทำให้รีวิวผิด
- **`.docx` / `.xlsx` อยู่ใน `docs/` และ `qa/` เท่านั้น** ไม่กระจายไปรากโปรเจกต์
- **ของชั่วคราวลง `_to_delete/`** (`temp-file-discipline`)
- **`docs/README.md` เป็นสารบัญ** บอกว่าอ่านอะไรก่อนและใครเป็นเจ้าของ (แม่แบบใน `project-bootstrap` → `assets/starter-files.md`)

---

## 2 · เลือกชุดเอกสารตามขนาดงาน

ขนาดวัดจาก **ระยะเวลา × จำนวนคนที่ต้องเห็นพ้องกัน** ไม่ใช่จำนวนบรรทัดโค้ด

**S** ≤ 2 สัปดาห์ · ทีมเดียว · ไม่มีใครนอกทีมต้องเซ็น — **M** 1–3 เดือน · ผู้ว่าจ้างภายใน · ส่งมอบเป็นรอบ — **L** > 3 เดือน · ลูกค้าภายนอกเซ็นรับ · มีข้อผูกพันตามสัญญา

### 2.1 · เอกสารส่งมอบ — คนอ่านและเซ็น

| เอกสาร | รูปแบบ | ผู้อ่าน | S | M | L |
|---|---|---|:-:|:-:|:-:|
| Project Plan | `.docx` | ผู้ว่าจ้าง · ทีม | ○ | ● | ● |
| SRS | `.docx` | dev · ผู้ว่าจ้าง | ○ | ● | ● |
| Architecture | `.docx` | dev · ops | ○ | ● | ● |
| Test Plan | `.docx` | QA · ผู้ว่าจ้าง | ○ | ● | ● |
| คู่มือผู้ใช้ (`MAN`) | `.docx` → `.pdf` | ผู้ใช้ปลายทาง | ○ | ● | ● |
| FSD | `.docx` | dev · QA | ○ | ○ | ● |
| BRD | `.docx` | ฝ่ายธุรกิจ | ○ | ○ | ● |
| Document Checklist | `.docx` | ทุกฝ่าย | ○ | ○ | ● |
| Test Cases | `.xlsx` | QA | ○ | ○ | ● |

● ต้องมี · ○ ไม่ต้อง เว้นแต่มีเหตุผลเฉพาะ
**ชุด S ไม่มีเอกสารกลุ่มนี้เลย** — ถูกแล้ว

---

### 2.2 · เอกสารเชิงเทคนิค — ทีมและ agent ใช้ระหว่างสร้าง

เป็น markdown ทั้งหมด และ**ขึ้นกับว่าโปรเจกต์มีอะไร** ไม่ใช่ขนาดงาน · ตารางเต็ม (ไฟล์ · ตอบคำถามอะไร) → [`references/technical-docs.md`](references/technical-docs.md)

- **เสมอ:** `<project-name>/README.md` · `docs/BUILD-PLAN.md`
- **มีเงื่อนไข:** USER-STORIES และ `docs/sprints/sprint-NN.md` (ทำงานเป็น sprint) · AGENT-LOOP (agent เขียนโค้ดเป็นรอบ) · API-SPEC (มี API ที่คนอื่นเรียก) · DATA-DICTIONARY (มีฐานข้อมูล) · EVALUATION-POLICY และ PROMPT-LIBRARY (ใช้ LLM) · `docs/decisions/ADR-NNNN-<slug>.md` (การตัดสินใจที่จะถูกถามซ้ำ) · `docs/runbook-<เรื่อง>.md` (ระบบใช้งานจริงและมีคนอยู่เวร)
- ตัวที่คนลืมบ่อยสุดคือ 4 ตัวเรื่อง LLM · API · ฐานข้อมูล แล้วต้องถาม agent ซ้ำทุกรอบว่า prompt ตัวไหนคือตัวจริง

---

## 3 · ลำดับการเขียน

**สายส่งมอบ** — ห้ามข้ามขั้นที่อยู่ในชุดของขนาดงานนั้น (ขั้นที่ไม่อยู่ในชุด เช่น BRD · FSD ของชุด M ให้ข้ามไป)

```
Project Plan ─► BRD ─► SRS ─┬─► mockup
                            └─► Architecture ─► FSD
                                                 │
              User Guide ◄─ Test Cases ◄─ Test Plan
```

**ชิ้นถัดไปเขียนต่อบนฉบับ DRAFT ของชิ้นก่อนหน้าได้** ข้อที่ยังไม่ยืนยันใส่ `(รอยืนยัน)` ไว้ทั้งสองชิ้น · ห้ามเปลี่ยนสถานะชิ้นถัดไปเป็น APPROVED ก่อนชิ้นก่อนหน้า เพราะถ้าชิ้นต้นทางเปลี่ยนต้องรื้อทั้งสาย
ข้อยกเว้นเดียว: **mockup ทำคู่ไปกับ SRS ได้** เพราะภาพหน้าจอช่วยให้ SRS ถูกยืนยันเร็วขึ้น

### 3.1 · ทะเบียนจุดค้าง — ผู้ใช้ถามว่า "ยังติดตรงไหน" ตอบเป็นไฟล์ Excel ไม่ใช่ข้อความในแชต

ป้าย `(รอยืนยัน)` · `(รอวัดใน Phase 0)` และตารางคำถามกระจายอยู่ทุกเอกสาร ผู้ตัดสินใจจึงไม่เห็นภาพรวม · รวมเป็นไฟล์เดียวด้วยสคริปต์ ไม่ไล่อ่านเอง:

```
python scripts/open_items.py docs/ docs/<CODE>-OPEN-ITEMS.xlsx --project <CODE>    # ทดสอบสคริปต์: --self-test
```

- อ่านทุก `.docx` ใน `docs/`: ตารางคำถาม · ตารางข้อสมมติที่ยังไม่ตัดสิน · ตารางลงนามที่ยัง "รอ" · ป้ายในเนื้อหา · ข้ามประวัติการแก้ไข สารบัญ บรรทัดอธิบายป้าย และ `(รอบหลัง)`
- แผ่น **สรุป** นับตามเอกสาร × ประเภทด้วยสูตร · แผ่น **รายการค้าง** มีหัวข้อในเอกสาร · ใครตอบ · ตัดสินภายใน · ค่าที่ใช้ไปก่อน · ข้อที่อ้างถึงกัน · ช่อง "สถานะ" และ "คำตอบ" ให้กรอก
- ประเภท: **เจ้าของตัดสิน** (ค้นเว็บแล้วปิดไม่ได้) · **ทีมตัดสิน** (BA · SA) · **กฎหมาย** · **วัดจริง** (ไม่มีตัวเลขเผยแพร่) · **ลงนาม** — คำถามที่อ้างคำถามของเจ้าของในเอกสารอื่นถูกนับเป็น "เจ้าของตัดสิน" ด้วย
- **ก่อนส่ง เปิดอ่านรายการด้วยตาเอง** — สคริปต์จับจากถ้อยคำ แถวที่ตอบไปแล้วแต่เขียนไม่ตรงคำว่า "ตอบแล้ว · ปิดแล้ว · ตัดสินแล้ว" ยังติดมา · ในชุดตัวอย่างหนึ่ง (6 ฉบับ) ได้ 75 รายการ มีแถวแบบนี้ราว 3 แถว
- ผู้ใช้กรอกคำตอบแล้ว → เติมคำตอบลงเอกสารต้นทาง ลบป้าย บันทึกในประวัติการแก้ไข แล้วรันสคริปต์ซ้ำ · ไฟล์นี้เป็นรายการงาน ไม่ใช่ต้นฉบับ อย่าแก้คำตอบในไฟล์นี้แทนเอกสาร

**สายเทคนิค** — เขียนเมื่อถึงจุดที่ต้องใช้ ไม่ต้องรอใคร: README · BUILD-PLAN ก่อนโค้ดบรรทัดแรก · DATA-DICTIONARY ตอนออกแบบตารางแรก · API-SPEC ตอน endpoint แรก · PROMPT-LIBRARY ตอน prompt แรกที่ใช้จริง · ADR ตอนตัดสินใจ (ไม่ใช่ตอนสรุปท้าย เพราะเหตุผลจริงหายแล้ว) · Runbook ก่อนขึ้นระบบจริง — ตารางเต็มใน [`references/technical-docs.md`](references/technical-docs.md)

---

## 4 · ใครเขียนชิ้นไหน ด้วย skill อะไร

ตารางเต็ม (agent · skill ต่อเอกสาร 16 ชนิด) → [`references/technical-docs.md`](references/technical-docs.md) · หลัก ๆ: SRS → `srs-writing` · FSD → `fsd-writing` · ADR → `adr-writer` · Test → `test-case-template` · mockup → `web-app-design` + `ui-craft` · README → `project-bootstrap`

---

## 5 · รูปในเอกสาร — เลือกให้ถูกตั้งแต่ต้น

- รูปในเอกสารโปรเจกต์ทุกชนิด (BRD · SRS · FSD · ADR · ER · ผังขั้นตอน) · สไลด์ · งานพิมพ์ → `diagram-figures` (house style เดียว) เก็บ `docs/figures/` + ต้นทางใน `src/` · **Mermaid ค่าเริ่มต้นห้ามเข้าเอกสารโปรเจกต์**
- รูปด่วนใน README · PR · โน้ตในโค้ด → Mermaid (`software-diagrams`) ฝังใน `.md` (สีสุ่มไม่มีความหมาย ไทยล้นกรอบ ย่อลง A4 แล้วอ่านไม่ออก)

**หัวรูปทุกใบต้องมีครบ 6 อย่าง** — โลโก้โปรเจกต์ · ชื่อ · คำขยาย 1 บรรทัด · เลขรูป · เวอร์ชันกับวันที่ · เจ้าของ (รายละเอียดอยู่ใน `diagram-figures` ข้อ 3)
รูปสถาปัตยกรรมถูกก๊อปไปวางในอีเมลและสไลด์แล้วอยู่ต่ออีกเป็นปี **รูปที่ไม่มีวันที่ ไม่มีใครกล้าแก้**

---

## 6 · ธีมสีของชุดเอกสาร

ประกาศครั้งเดียวต่อโปรเจกต์ บนหัวไฟล์ต้นทางของทุกเอกสาร:

```markdown
<!-- doc-theme: accent=#2A78D6 -->
```

(ตัวอย่างใช้สีประจำบ้าน `#2A78D6` — แทนด้วยสีหลักของโปรเจกต์)

`branded-document-design` · `presentation-design` · `diagram-figures`
อ่านค่านี้แทนการเลือกสีเอง เอกสาร สไลด์ และรูปทุกใบจึงเป็นชุดเดียวกัน

**สีมาจากเนื้องาน ไม่ใช่จากรสนิยม** — มีสีแบรนด์ใช้สีแบรนด์ · ยังไม่มีใช้สีประจำบ้านของ `branded-document-design` เขียน `(รอยืนยัน)` แล้วทำต่อ ไม่หยุดถาม
ข้อยกเว้นที่ไม่เปลี่ยนตามธีม: สีโลโก้ผู้ให้บริการ · สีเทาของเส้นโครงสร้าง · เขียว = ผ่าน / แดง = ไม่ผ่าน

---

## 7 · รายการตรวจก่อนส่งมอบชุดเอกสาร

- [ ] ทุกไฟล์ `.docx` เปิด Navigation Pane แล้ว**เห็นหัวข้อครบ** (ใช้ Heading style จริง ไม่ใช่ตัวหนา)
- [ ] ทุกเอกสารมีหน้าประวัติการแก้ไข · เลขเวอร์ชัน · วันที่ · ผู้จัดทำ
- [ ] ทุกรูปมีเลขรูปและถูกอ้างในเนื้อความอย่างน้อย 1 ครั้ง
- [ ] ไฟล์ต้นทางของทุกรูปอยู่ใน `docs/figures/src/` (ถ้ามีโฟลเดอร์นี้)
- [ ] เอกสารเชิงเทคนิคที่เข้าเงื่อนไขในข้อ 2.2 มีครบ เช่น ถ้ามี API ต้องมี API-SPEC และถ้าใช้ LLM ต้องมี PROMPT-LIBRARY
- [ ] ตัวย่อทุกตัวเขียนเต็มครั้งแรกที่ปรากฏ
- [ ] ชื่อไฟล์ตรงตาม `document-naming` — ไม่มี `final2` ไม่มี `ล่าสุด`
- [ ] เอกสารในชุดอ้างเวอร์ชันของกันและกันตรงกัน
- [ ] รัน `scripts/open_items.py` แล้วทะเบียนจุดค้างไม่มีแถวสถานะ "เปิด" (หรือผู้ว่าจ้างรับรู้ทุกแถวที่ยังเปิด)
- [ ] บอกผู้ใช้ว่ามีอะไรค้างใน `_to_delete/` (ไม่ลบเอง — ลบเมื่อผู้ใช้สั่งเท่านั้น)

---

## 8 · Anti-patterns

ผิด: `.docx` ไม่มี Heading style · เก็บแต่ PNG ไม่เก็บต้นทาง · `.docx` และ mockup ใน repo โค้ด (ถึงจุดนี้ต้องย้ายเป็นแบบ B) · เอกสารอยู่ 2 ที่ (= 2 เวอร์ชัน) · FSD ก่อน SRS ยืนยัน · ใช้ LLM แต่ไม่มี PROMPT-LIBRARY · sub-project ชื่อ `projects/` `modules/` `apps/` · โฟลเดอร์ว่างสร้างเผื่อ · เอกสารชิ้นเดียวตอบทุกคำถาม

---

## 9 · ตัวย่อ

ADR Architecture Decision Record · BRD Business Requirements Document · FSD Functional Specification Document · QA Quality Assurance · SRS Software Requirements Specification · TOC Table of Contents

---

## 10 · เชื่อมกับ skill อื่น

นอกจากตาราง "ไม่ใช้" ด้านบน: วาดรูป → `diagram-figures` (เอกสารโปรเจกต์) · `software-diagrams` (README · PR) · ของชั่วคราว → `temp-file-discipline` · สถานะเอกสารใน `docs/BUILD-PLAN.md` → `status-report` · รายการตรวจฉบับพิมพ์ → `assets/doc-set-checklist.md`

**อ่านเพิ่มเมื่อต้องใช้:** [`references/writer-templates.md`](references/writer-templates.md) — แม่แบบเอกสารของ `technical-writer` (tutorial · API reference · release notes · README ดู `project-bootstrap`)

**คู่มือต้องขึ้นเว็บ ค้นได้ มีหลายรุ่น:** [`references/docs-site.md`](references/docs-site.md) · เลือก MkDocs Material · Docusaurus · Starlight · VitePress · ผลทดสอบค้นหาภาษาไทย · ที่วางเว็บ · ฟอนต์ไทย


## reference: docs-site.md

# Docs site

Pick a docs-site generator when a manual or developer documentation must go on the web, be searchable, and have several versions · use with `SKILL.md` item 1 (where the documents live) and the templates in [`writer-templates.md`](writer-templates.md).
Facts checked 2026-10-23 from official docs · npm · PyPI · GitHub and real tests (section "Sources").
Abbreviations: Application Programming Interface (API) · Software Development Kit (SDK) · Architecture Decision Record (ADR) · SIL Open Font License (OFL) · Software as a Service (SaaS) · user interface (UI)

## 1 · Is a docs site needed

| Situation | Use |
|---|---|
| People outside the team read often (public API · SDK · a manual updated every release) · search needed · several versions at once | a docs site (this file) |
| The team reads it themselves | `README.md` + `docs/*.md` on GitHub is enough |
| The customer signs for acceptance | `.docx` per `SKILL.md` item 2.1 · a docs site does not replace the handover document |

## 2 · Comparing the 4 generators

| | MkDocs Material | Docusaurus | Starlight | VitePress |
|---|---|---|---|---|
| Requires | Python | Node · React | Node · Astro | Node · Vue |
| Latest version | 9.7.7 | 3.10.2 | 0.42.6 (not yet 1.0) | 1.6.4 · 2.0 is still alpha |
| Built-in search | yes · lunr.js + lunr-languages (can set `lang: th`) | no · the official one is Algolia DocSearch · local search uses a community plugin | yes · Pagefind is on by default, no setup | yes · MiniSearch (`provider: 'local'`) or Algolia |
| Versioning | via `mike`, an external tool | built in, `docusaurus docs:version` | community plugin `starlight-versions` | none · issue #109 is still open |
| Multiple languages (i18n) | the UI can be translated (`th` exists) · a multilingual site = one project per language + a language switcher | built in | built in · a Thai UI is included | built in |
| licence | MIT | MIT | MIT | MIT |

MkDocs Material: the maintainers announced they will maintain only critical fixes until 5 May 2027 and told users to move to Zensical (version 0.0.71 · status Alpha · MIT) · a new project that must live for years should record this in an ADR.
Quick pick: Python team → MkDocs Material (plan a move) · need built-in versioning → Docusaurus · want a light site with little setup → Starlight · Vue team → VitePress

## 3 · Thai search, tested for real

Thai has no spaces between words, so a search engine that splits words on spaces cannot find a word in the middle of a sentence · tested 2026-10-23 with 2 Thai pages, searching 9 words: ภาษี · กำกับ · สต็อก · สินค้า · ร้านค้า · ภาษีมูลค่าเพิ่ม · อิเล็กทรอนิกส์ · ตัดสต็อก · ทะเบียน

| Search engine (version tested) | Used in | What the docs say about Thai | Found |
|---|---|---|---|
| Pagefind 1.5.2 (builds an index, searches in the browser) | Starlight | has `th` · no stemming · the word-segmentation section mentions only Chinese, Japanese, Korean | 6/9 · missed กำกับ · ทะเบียน · ภาษีมูลค่าเพิ่ม |
| lunr 2.3.9 + lunr-languages 1.23.0 `th` (word splitting with wordcut · tested in Node, not in the theme) | MkDocs Material · plugin `@easyops-cn/docusaurus-search-local` (accepts every lunr-languages language) | Material accepts `lang: th` | 6/9 · missed ร้านค้า · ตัดสต็อก · ภาษีมูลค่าเพิ่ม |
| MiniSearch 7.2.0 defaults (prefix + fuzzy as in VitePress) | VitePress | VitePress segments with `Intl.Segmenter` only for Chinese and Japanese | 0/9 |
| MiniSearch + a `tokenize` that uses `Intl.Segmenter('th', { granularity: 'word' })` | VitePress (`options.miniSearch.options.tokenize`) | `tokenize` can be set by yourself | 9/9 (tested in Node 22 · not yet tested in a whole VitePress site) |
| Algolia DocSearch | Docusaurus · Starlight · VitePress | Algolia's language table: Thai segmentation "Not supported" | not tested |

- Results depend on the project's vocabulary → before delivery, search 20 real terms and record the results in the docs site's README.
- DocSearch is free only for technical documentation and technical blogs that are public. The site must be live and have no non-technical content.

## 4 · Hosting

| | GitHub Pages | Cloudflare |
|---|---|---|
| Price | free · a free account needs a public repo | Pages has a free plan · Workers static assets: static file requests are free and unlimited |
| Limits | site ≤ 1 GB · bandwidth 100 GB/month (soft) · build 10 times/hour (soft · builds through GitHub Actions do not count) · a deploy over 10 minutes fails | Pages free plan: 500 builds/month · 1 build at a time · max 20 minutes · 20,000 files · each file ≤ 25 MiB |
| Conditions | must not be used as free hosting for an online business or SaaS · the site is public even if the repo is private | the Pages page tells new projects to start on Workers |

A document that outsiders must not see does not go on a public site. Keep it as `docs/*.md` in the repo (how each host restricts readers has not been checked).

## 5 · Thai fonts

- Use the same fonts as the app: `Inter` + `Noto Sans Thai` (`web-app-design` → `references/tokens.md`) · other Google Fonts choices that have Thai letters and are OFL: Sarabun · IBM Plex Sans Thai · Anuphan
- Load through the Google Fonts CSS2 API with `display=swap` · the API splits out the `/* thai */` block with `unicode-range: U+0E01-0E5B …` by itself, so the browser loads only the parts the page uses (seen in the CSS the API returned 2026-10-23)
- Thai line-height is the English value plus 0.1 (`ui-craft` item 2)
- Set the font in the slot the theme exposes · the setting names and CSS variables of each theme have not been checked

## 6 · Content lives in the repo beside the code

- The docs site source lives in the code folder `<project-name>/docs/` with the generator's config file (layout A of `project-bootstrap` item 1) · code and manual change in the same pull request
- Type B projects: the handover `.docx` · ADR · runbook · BUILD-PLAN stay in `docs/` at the root · the docs site takes only what outsiders read (manual · tutorial · API reference · release notes) · the same content must never live in 2 places
- Build in Continuous Integration (CI) on every pull request and deploy on merge (`cicd-and-release`)
- An exception to the root is declared in the code folder's README (`SKILL.md` item 1)

## Sources

| Topic | URL or evidence (2026-10-23) |
|---|---|
| MkDocs Material | https://squidfunk.github.io/mkdocs-material/ (status · Zensical) · .../plugins/search/ · .../setup/changing-the-language/ · .../setup/setting-up-versioning/ |
| Docusaurus | https://docusaurus.io/docs/search · https://docusaurus.io/docs/versioning · https://docusaurus.io/docs/i18n/introduction |
| Starlight | https://starlight.astro.build/guides/site-search/ · .../guides/i18n/ · .../resources/plugins/ |
| VitePress | https://vitepress.dev/reference/default-theme-search · https://vitepress.dev/guide/i18n · https://github.com/vuejs/vitepress/issues/109 |
| Pagefind | https://pagefind.app/docs/multilingual/ |
| lunr-languages | https://github.com/MihaiValentin/lunr-languages (file `lunr.th.js` uses wordcut) |
| MiniSearch | https://lucaong.github.io/minisearch/types/MiniSearch.Options.html |
| Algolia | https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/supported-languages/ · https://docsearch.algolia.com/docs/who-can-apply/ |
| Docusaurus local-search plugin | https://github.com/easyops-cn/docusaurus-search-local |
| Versions and licence | registry.npmjs.org · pypi.org · api.github.com (Zensical: GitHub = MIT · PyPI = Alpha) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits · .../creating-a-github-pages-site |
| Cloudflare | https://developers.cloudflare.com/pages/platform/limits/ · https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ |
| Google Fonts | https://developers.google.com/fonts/docs/css2 · `METADATA.pb` in https://github.com/google/fonts · real CSS from fonts.googleapis.com |
| Thai search test | Pagefind via `npx pagefind@1.5.2` + a browser · lunr and MiniSearch via Node 22 · 2 test pages, the 9 search words in item 3 |


## reference: ecosystem.md

# โปรเจกต์แบบ ecosystem — 1 ระบบ แบ่งเป็นหลาย sub-project

อ่านเมื่อโปรเจกต์มี sub-project ตั้งแต่ 2 ตัวและแต่ละตัวมีเอกสารชุดของตัวเอง · กฎย่ออยู่ใน `SKILL.md` ข้อ 1

ใช้เมื่อโปรเจกต์เป็นชุดผลิตภัณฑ์ที่มี sub-project ตั้งแต่ 2 ตัวขึ้นไป และแต่ละตัวมีเอกสารชุดของตัวเอง (SRS · mockup · สถาปัตยกรรม) เช่น Quanton ที่แบ่งเป็น CONNECT · LAB · INTEL · DESK
**ชื่อโฟลเดอร์ต้องเป็น `ecosystem/` เสมอ** ห้ามใช้ `projects/` `modules/` หรือ `apps/` เพราะพอเปิดโฟลเดอร์แล้วต้องรู้ทันทีว่าทุกตัวข้างในเป็นชิ้นของระบบเดียวกัน

```
<ชื่อโปรเจกต์>/
├─ docs/                เอกสารระดับ ecosystem — README (สารบัญ) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <รหัส>-<SUB>/     1 โฟลเดอร์ต่อ 1 sub-project เช่น QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    repo โค้ดของ sub-project นี้ (ตัวพิมพ์เล็กคั่น `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   ใช้ร่วมกันทั้ง ecosystem (กติกาเดียวกับแบบ B)
```

- เอกสารที่ครอบทุก sub-project (BRD · แผนโครงการ · BUILD-PLAN) อยู่ใน `docs/` ที่รากที่เดียว ห้ามก๊อปไปไว้ในแต่ละ sub-project
- สร้างโฟลเดอร์ sub-project เมื่อเริ่มเขียนเอกสารของตัวนั้นจริง ไม่สร้างเผื่อ
- ชื่อโฟลเดอร์ sub-project = รหัสโปรเจกต์ + ชื่อ sub-project ตัวพิมพ์ใหญ่ (`QTN-CONNECT`) ใช้รหัสเดียวกับที่เอกสารอ้าง
- โปรเจกต์ที่ใช้ `projects/` อยู่แล้ว → เปลี่ยนชื่อเป็น `ecosystem/` แล้วแก้ path ในเอกสารและสคริปต์ทุกไฟล์ในรอบเดียวกัน
- โปรเจกต์ที่มีผลิตภัณฑ์เดียว ไม่ต้องมี `ecosystem/` ใช้แบบ B ตามปกติ


## reference: technical-docs.md

# เอกสารเชิงเทคนิค — ตาราง ลำดับเขียน และใครเขียน

อ่านเมื่อเลือกชุดเอกสารเชิงเทคนิค หรือกำลังจะเขียนชิ้นใดชิ้นหนึ่ง · สรุปอยู่ใน `SKILL.md` ข้อ 2.2–4

## เอกสารเชิงเทคนิค (ข้อ 2.2)

กลุ่มนี้เป็น **markdown ทั้งหมด** และ**ไม่ได้ขึ้นกับขนาดงาน** แต่ขึ้นกับว่าโปรเจกต์มีอะไร

| เอกสาร | ไฟล์ | ตอบคำถามว่า | ต้องมีเมื่อ |
|---|---|---|---|
| README | `<project-name>/README.md` | ติดตั้งและรันยังไง | **เสมอ** |
| BUILD-PLAN | `docs/BUILD-PLAN.md` | จะสร้างอะไรก่อนหลัง · ตอนนี้ถึงไหนแล้ว | **เสมอ** |
| USER-STORIES | `docs/USER-STORIES.md` | จะสร้างอะไรให้ใคร · story ไหนพร้อมเข้า sprint · AC คืออะไร | ทำงานเป็น sprint หรือมี backlog (`user-story-writer`) |
| Sprint plan | `docs/sprints/sprint-NN.md` | sprint นี้รับ story ไหน · เป้าหมายคืออะไร · เสี่ยงอะไร | ทำงานเป็น sprint (`/sprint-plan`) — ไฟล์ละ sprint ไม่เขียนทับของเก่า |
| AGENT-LOOP | `docs/AGENT-LOOP.md` | agent ทำงานเป็นวงจรแบบไหน · อะไรคือเงื่อนไขว่าจบ | ให้ agent เขียนโค้ดเป็นรอบ ๆ (`spec-to-code-loop`) |
| API-SPEC | `docs/API-SPEC.md` | endpoint ไหนรับอะไร คืนอะไร พังยังไง | มี API ที่คนอื่นเรียก (`api-conventions`) |
| DATA-DICTIONARY | `docs/DATA-DICTIONARY.md` | ฟิลด์นี้แปลว่าอะไร · ค่าที่เป็นไปได้มีอะไรบ้าง | มีฐานข้อมูลหรือสคีมาข้อมูล (`database-design`) |
| EVALUATION-POLICY | `docs/EVALUATION-POLICY.md` | วัดว่าผลลัพธ์ดีพอหรือยังด้วยอะไร · เกณฑ์ผ่านเท่าไร | ผลลัพธ์มาจากโมเดลหรือ LLM ที่ไม่ได้ถูกเสมอ |
| PROMPT-LIBRARY | `docs/PROMPT-LIBRARY.md` | prompt ตัวจริงคือตัวไหน เวอร์ชันอะไร เปลี่ยนอะไรไป | ใช้ LLM ในเส้นทางหลักของระบบ |
| ADR | `docs/decisions/ADR-*.md` | ทำไมถึงเลือกทางนี้ ไม่เลือกทางนั้น | มีการตัดสินใจที่จะถูกถามซ้ำ (`adr-writer`) |
| Runbook | `docs/runbook-<เรื่อง>.md` ไฟล์ละเรื่อง | ระบบล่มตอนตี 2 ต้องทำอะไร | มีระบบที่รันอยู่จริงและมีคนอยู่เวร |

> **เอกสาร 4 ตัวที่มีเงื่อนไขเรื่อง LLM · API · ฐานข้อมูล คือตัวที่คนลืมบ่อยที่สุด**
> แล้วไปจบด้วยการถาม agent ซ้ำทุกรอบว่า "prompt ตัวไหนคือตัวจริง" หรือ "ฟิลด์นี้แปลว่าอะไร"

## สายเทคนิค — เขียนเมื่อไหร่ (ข้อ 3)

| เขียนเมื่อ | เอกสาร |
|---|---|
| ก่อนเขียนโค้ดบรรทัดแรก | README · BUILD-PLAN |
| ก่อนปล่อย agent ทำงานเป็นรอบ | AGENT-LOOP |
| ตอนออกแบบตารางแรก | DATA-DICTIONARY |
| ตอนออกแบบ endpoint แรก | API-SPEC |
| ตอนเขียน prompt ตัวแรกที่จะใช้จริง | PROMPT-LIBRARY · EVALUATION-POLICY |
| ตอนตัดสินใจเรื่องที่จะถูกถามซ้ำ | ADR |
| ก่อนขึ้นระบบจริง | Runbook |

> **ADR กับ DATA-DICTIONARY เขียนตอนที่ตัดสินใจ ไม่ใช่ตอนสรุปท้ายโปรเจกต์**
> เขียนย้อนหลังก็ได้ แต่ตอนนั้นเหตุผลจริงหายไปแล้ว

## ใครเขียนชิ้นไหน ด้วย skill อะไร (ข้อ 4)

| เอกสาร | agent | skill ที่ใช้ |
|---|---|---|
| README · CHANGELOG | `technical-writer` | `project-bootstrap` |
| Project Plan | `project-manager` | `branded-document-design` |
| BRD · user story | `business-analyst` | `user-story-writer` |
| SRS | `system-analyst` | `srs-writing` |
| FSD | `system-analyst` | `fsd-writing` |
| Architecture | `solution-architect` | `architecture-patterns` · `diagram-figures` |
| ADR | `solution-architect` | `adr-writer` |
| Test Plan · Test Cases | `qa-tester` | `test-case-template` |
| mockups | `ux-designer` | `web-app-design` · `ui-craft` |
| คู่มือผู้ใช้ (`MAN`) | `technical-writer` | `polished-document-style` |
| Runbook | `devops-engineer` | `incident-runbook-template` |
| BUILD-PLAN | `project-manager` | `simplicity-first` |
| AGENT-LOOP | `developer` | `spec-to-code-loop` |
| API-SPEC | `system-analyst` | `api-conventions` |
| DATA-DICTIONARY | `system-analyst` | `database-design` |
| PROMPT-LIBRARY · EVALUATION-POLICY | `developer` | — (คู่กับ skill `llm-engineering`) |


## reference: writer-templates.md

# technical-writer templates — README · tutorial · API reference · release notes

**Contents:** README · Tutorial Template · API Reference Template · Release Notes Template

Open when you actually have to write this kind of document · put `(รอยืนยัน)` (to be confirmed) on any part you do not know.

## Standard Outputs

### README

There is no README template here — use the single template of `project-bootstrap` (`SKILL.md` item 2 and `assets/starter-files.md`). The 15-section skeleton (9 always present · 6 present when the project has that thing) is in `references/readme-skeleton.md` · commands per language are in `references/readme-by-stack.md`.

### Tutorial Template

````markdown
# Tutorial: Build Your First X in 10 Minutes

> **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- Node.js 22+ (Node 18 หมดอายุ 30 เม.ย. 2568, Node 20 หมด 30 เม.ย. 2569 — endoflife.date ตรวจ 22 ต.ค. 2569)
- A free account at example.com
- 10 minutes

## Step 1: Set Up

Run:
```bash
npx create-thing my-project
cd my-project
```

> **What just happened?** Brief explanation.

You should see:
```
✓ Project created
```

## Step 2: Configure

...

## Step 3: Run It

...

## Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
````

### API Reference Template (per endpoint)

````markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

Required. Bearer token in `Authorization` header.

### Request

```http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✓ | Display name, 1-100 chars |
| `tags` | string[] | ✗ | Up to 10 tags |

### Response: 201 Created

```json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

```typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Resource' })
});
```
````

### Release Notes Template

> Breaking Changes must always come before the other sections (right after Highlights) — the full release notes rules are in the skill `release-notes`.

````markdown
# Release v2.1.0 — YYYY-MM-DD

## Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is faster — <measured number only, e.g. p95 login 1.2 s → 0.7 s; drop the number if not measured>
- **Fixed:** Z bug affecting users on platform A

## Breaking Changes

### `api.oldMethod()` removed

**Before:**
```typescript
api.oldMethod(arg)
```

**After:**
```typescript
api.newMethod({ arg })
```

[Migration guide](#)

## New Features

### Feature Name

Description with user-facing benefit.

```bash
# Example usage
command --new-flag
```

[Read the docs](#)

## Improvements

- Faster initial load time
- Better error messages for X

## Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## Contributors

Thanks to: @alice, @bob, @charlie
````

### Release Notes Template (Thai)

> Same structure as the English version · wording at news register (`human-writing` `references/thai-grammar.md` section 4): no first person · each line has subject + verb + object · numbers must be measured, and if there are none, leave them out · right/wrong examples are in the skill `release-notes` item 4.

````markdown
# เวอร์ชัน 2.1.0 — YYYY-MM-DD

## สรุป

- **ใหม่:** ส่งออกรายงานเป็น CSV ได้แล้ว — เมนู รายงาน → ส่งออก
- **เร็วขึ้น:** ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที
- **แก้แล้ว:** ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก

## สิ่งที่ต้องแก้ก่อนอัปเดต

### `api.oldMethod()` ถูกถอดออก

**เดิม:** `api.oldMethod(arg)` · **ใหม่:** `api.newMethod({ arg })` · [วิธีย้าย](#)

## ฟีเจอร์ใหม่

### ชื่อฟีเจอร์

ผู้ใช้ทำอะไรได้ 1 ประโยค แล้วตามด้วยตัวอย่างคำสั่งหรือภาพหน้าจอ

## ปรับปรุง

- หน้าแรกโหลดเสร็จใน 1.2 วินาที จาก 2.8 วินาที
- ข้อความแจ้งเตือนตอนอัปโหลดไฟล์ผิดชนิด บอกชนิดที่รับได้แล้ว

## แก้บั๊ก

- ยอดรวมในใบเสนอราคาไม่เพี้ยนเมื่อมีส่วนลดเป็นเปอร์เซ็นต์ ([#1234](#))

## ผู้ร่วมพัฒนา

ขอบคุณ @alice @bob @charlie

เวอร์ชัน 2.1.0 · ออก YYYY-MM-DD
````


---

# skill: temp-file-discipline

Use when a task writes temporary files into a project

# Temporary file discipline

> **One rule:** anything that is not a real work product must live only in `_to_delete/`.
> Never leave it in the project root, and never mix it with work files.

---

## Choose where to put it

| What the file is | Put it in |
|---|---|
| Temporary items of work in the user's project (check images · logs · one-off scripts · run results) | `_to_delete/<task folder>/` at the project root (section "How to use"), so the user can check back later |
| An intermediate step not tied to any project (not working in the user's folder) | The session's workspace |
| A work product the user will keep | The destination folder of that work |

**The project root must hold no temporary files at all.**
- If an agent creates a temporary file and it lands in the root (log · image · trial script), move it into `_to_delete/` right away
- If you are not sure whether the user created or is using that file, do not move it yourself; tell the user
- When running from inside a subfolder (for example the code folder, see `project-bootstrap` in plugin `software-development`), write temporary things to the **project root's** `_to_delete/`, and do not create a nested one

---

## What counts as a temporary file

- A compressed file sent through chat to get files onto the machine, and the folder it was extracted to
- Images rendered to check work · screenshots · sample files made for comparison
- Backup copies of a file being edited · files `.bak` `.old` `.tmp` `ไฟล์ (1).xlsx` (`ไฟล์` = "file")
- Scripts written for one use · log files from a one-time run
- Intermediate-format files during a conversion, such as an `.svg` already converted to `.png`
- **Documents converted to another format to make them easier to read or process** — a `.docx` or `.pdf` converted to `.md`
  The original is the real thing and the converted one is temporary. **Never mix them in the documents folder**,
  or in 3 months nobody knows which file is the version the client signed off
- Old versions of a file that was just replaced

**A file no longer in use is a temporary file** — when you replace an old file with a new one, move the old one into `_to_delete/`
and do not leave them side by side.

---

## What does not count

- A work product the user asked for
- Source files of a work product, such as design files `.psd` `.fig` · a `.py` that produces an image · an `.html` that is the source of an image —
  **if you will edit next year, you need the source file**, so keep it in a subfolder beside the work product, not in `_to_delete/`
- Files the user placed themselves, even if they look like junk — **never move the user's things without asking**
- Output of build tools (`build/` · `node_modules/`) — leave it, check that it is in `.gitignore`, and never move it into `_to_delete/`

---

## How to use

```
โปรเจกต์/
├── ผลงานจริง
└── _to_delete/
    ├── 2026-11-06-login-page-redesign/
    │   ├── screenshots/
    │   ├── logs/
    │   └── transfer.zip
    ├── 2026-11-07-fix-export-bug/
    │   └── logs/
    └── superuser-lock/            ← ของเครื่องมือ ไม่ใช่ของงาน
```

(Gloss: `โปรเจกต์/` = project · `ผลงานจริง` = real work products · `ของเครื่องมือ ไม่ใช่ของงาน` = belongs to the tool, not to a task.)

- There is exactly one `_to_delete/` folder at the **project root** · inside, **1 folder per task**, so things do not mix and a whole task can be deleted at once
- **Task folder name** `YYYY-MM-DD-<topic>` · the date is the day the task started · the topic is lowercase English joined by `-`, 2–5 words, saying what is being done (`2026-11-06-temp-task-folders`, not `2026-11-06-task1`) · sorting by name gives time order directly
- **Create the folder when the task starts**, before writing the first temporary file · a task that continues over several rounds or across sessions uses the same folder (find it with `find _to_delete -mindepth 1 -maxdepth 1 -type d -printf '%f\n'`) · a new topic gets a new folder · when the task is split to sub-agents, they write into the lead's task folder, and the path is given in the brief
- **Never place a file directly in `_to_delete/`** · except things a tool or hook creates itself at a fixed location (`superuser-lock/` · `STOP`) and the delete plan `delete-plan.txt` (the check script requires it directly in `_to_delete/`), which do not move
- **When another skill writes `_to_delete/<x>`** (for example `_to_delete/screenshots/` · `_to_delete/deck-check`), always read it as `_to_delete/<task folder>/<x>` · for a script whose default is `_to_delete/...`, pass `--out` pointing into the task folder
- Standard subfolders **inside the task folder** that other skills use — use only these names:

  | Subfolder | What goes in | Skill that uses it |
  |---|---|---|
  | `drafts/` | Temporary drafts that are not the original (the markdown original that is re-rendered lives permanently at `docs/src/<topic>.md`) | `superuser:document-naming` |
  | `attempts-<topic>/` | Work of each competing agent | [`parallel-attempts-pick-best`](../parallel-attempts-pick-best/SKILL.md) |
  | `screenshots/` | Rendered images of a design mockup or images for checking work | every design skill |
  | `logs/` | Logs from a one-time run | every skill |

  Code work (`verify-runs/` · `security/` · `check/`) → the addition in plugin `software-development` → `superuser` → `references/code-extensions.md`
- Put `_to_delete/` into `.gitignore` in every project that uses git — check first, and add it if missing
- A project whose README already names another temporary folder (for example `tmp/` `scratch/`) → follow that, then record 1 row in the "การตัดสินใจ" (decisions) table · none named → `_to_delete/` · never use `.cache/` (it belongs to tools and can mix with tool state)

---

## At the end of the work

1. **Say where this task's temporary things are**, in one line (`_to_delete/2026-11-06-login-page-redesign/`), with no long list
2. **Never delete on your own** — delete only when the user orders it; deletion in the user's folder cannot be undone
3. **When the user orders deletion** → move into `_to_delete/` first (per the central rule), then tell the user · actually delete only things inside `_to_delete/` when the user orders it directly, in 3 steps:
   1. Write the plan into the file `_to_delete/delete-plan.txt`, 1 path per line, counted from the project root (`_to_delete/2026-11-06-login-page-redesign`) · to delete a whole task, put the task folder on one line
   2. Run `node <this skill's folder>/scripts/delete-plan-check.mjs _to_delete/delete-plan.txt` → it prints the delete list and the keep list to compare · any path that escapes `_to_delete/` (`..` · full path · a link pointing outside) makes it exit 1, and you must not delete
   3. Only after it passes, delete line by line from the "delete" list; the script does not delete by itself · never build the list from `ls` (on Windows names may end in `/`, see `context-budget` → [`windows-shell`](../context-budget/references/windows-shell.md))
4. **Before saying the work is finished**, run `node <this skill's folder>/scripts/root-check.mjs <project root>` → it lists things in the root outside the allowed list (`ref` `docs` `mockup` `assets` `qa` `_to_delete` `.claude` the code folder, and things in `.gitignore`) · for things the project deliberately keeps in the root, add `--allow README.md,LICENSE`

---

## Anti-patterns

- **Extracting a zip into the project root** and cleaning up later — later never comes
- **Naming files `file-v2` `file-final` `file-really-new`** (Thai: `ไฟล์-v2` `ไฟล์-final` `ไฟล์-ใหม่จริง`) and leaving them beside the original
- **Deleting a user's file because you think it is no longer used**
- **Leaving a project task's temporary files in the session workspace** — after the session ends the user cannot check back
- **Making a new subfolder name for an existing kind of thing** (`shots/` `img-check/`) — use the names in the table above
- **Placing files directly in `_to_delete/` or sharing `screenshots/` across several tasks** — a week later nobody knows which image belongs to which task, and you cannot delete one task alone
- **Keeping a work product's source file in `_to_delete/`** — that is not temporary
- **Leaving stray files without telling anyone** — the user will find them on their own months later

---

Abbreviations and technical terms in messages to the user follow `spell-out-abbreviations`.


---

# skill: code-gardener

Use when patrolling code for duplication or dead code

# code-gardener — คนสวนที่จดก่อน ยังไม่ตัด

> ถ้าแก้ทุกอย่างทันทีที่เห็น จะได้การแก้ 100 ครั้งที่ไม่เห็นภาพรวม
> ถ้าจดไว้ก่อน แล้ววันหลังค่อยมองรวม จะเห็นว่า 100 ข้อนั้นจริง ๆ คือ 3 เรื่อง

## ไฟล์เดียวที่ใช้ — `docs/GARDEN.md`

```markdown
## บันทึก (ต่อท้ายทุกรอบ ไม่แก้ของเก่า · เกิน 300 แถว ย้ายแถวที่ทบทวนแล้วไป docs/garden-archive.md)
| วันที่ | ไฟล์:บรรทัด | สิ่งที่เห็น | ทำไมน่ากังวล | รูปแบบ |

## ทบทวนแล้ว
| วันที่ | ธีม | จำนวนข้อ | ทำอะไรต่อ | ไฟล์งาน |
```

## รอบสำรวจ (ทุกวัน หรือหลังมี commit ใหม่)

1. อ่าน `docs/GARDEN.md` ส่วน "ทบทวนแล้ว" — ธีมที่ตัดสินแล้วไม่ต้องจดซ้ำ
2. ดูเฉพาะไฟล์ที่เปลี่ยนตั้งแต่รอบก่อน (`git log --since`) ส่วนการดูทั้ง repo ทำแค่สัปดาห์ละครั้ง และงานใหญ่ให้แบ่งด้วย `parallel-split-and-merge`
3. มองหา: logic ซ้ำ · เรียกข้ามชั้น (หน้าจอคุยฐานข้อมูลตรง) · กับดักของ framework ที่ใช้ · โค้ดตาย · ชื่อที่ไม่ตรงกับ `readable-code` · test ที่ผ่านทั้งที่โค้ดผิด · ของที่ขัดกับ `docs/AGENT-RULES.md`
4. **ต่อท้ายลงตารางบันทึก ห้ามแก้โค้ด** ช่อง "รูปแบบ" ให้ใส่คำสั้นที่ใช้ซ้ำได้ จะได้จัดกลุ่มง่าย
5. ถ้าไม่เจออะไรก็ไม่ต้องเขียน

## รอบทบทวน (ทุก 2–3 วัน หรือบันทึกเกิน 20 แถว)

1. จัดกลุ่มบันทึกที่ยังไม่ทบทวนตาม "รูปแบบ" และต้นเหตุ
2. ทุกธีมเลือกทางเดียว
   - ถ้าเกิดซ้ำได้อีก ให้ใช้ `repeated-mistakes-to-checks` เปลี่ยนเป็นตัวกันในโค้ด: โครงสร้าง · type หรือ lint
   - ถ้าของที่มีอยู่แล้วต้องจัดใหม่ ให้ใช้ playbook `refactor` ของ [`superuser`](../superuser/SKILL.md)
   - ถ้าไม่คุ้มแก้ ให้เขียนเหตุผลไว้
3. **เลือกธีมที่จะแก้ด้วยตัวเลข** ใช้ skill `decision-scoring` คำสั่ง `knapsack`
   - **กฎเหล็ก (ไม่เข้าตาราง ส่งต่อทันที):** ธีมที่เป็นช่องโหว่ → `security-gate` · ธีมที่ทำให้ข้อมูลหรือผลลัพธ์ผิดอยู่แล้ว → playbook `bug-fix`
   - งบ = ชั่วโมงที่ผู้ใช้ตั้งไว้ให้งานจัดระเบียบรอบนี้ (ไม่ตั้ง → ถามครั้งเดียว ไม่เดา)
   - ต้นทุนของธีม = ชั่วโมงที่ประเมินว่าใช้แก้ · ค่าที่ได้ = จำนวนครั้งที่เกิดซ้ำ (นับจากตารางบันทึก) × นาทีที่เสียต่อครั้ง (ประเมิน ติด `อนุมาน` ถ้าไม่ได้วัด)
   - ธีมที่หลุดจากชุดดีสุดและอัตราค่าที่ได้ต่อชั่วโมงต่ำ = "ไม่คุ้มแก้" เขียนเหตุผลเป็นตัวเลขลงตาราง · อ่านบรรทัด "ชุดรองลงมา" ในผล (มีเมื่อรายการไม่เกิน 20) ถ้าห่างจากชุดดีสุดไม่ถึง 10% (ค่าตั้งต้น ยังไม่ได้วัด) ให้ผู้ใช้เลือก
4. ลงตาราง "ทบทวนแล้ว" แล้วเสนอผู้ใช้ว่าจะทำธีมไหนก่อน และเริ่มแก้จริงเมื่อผู้ใช้เลือกแล้ว
5. สรุปผลด้วย `status-report`

## ตั้งให้รันเอง

ตั้ง scheduled task ในแอป Claude หรือ Windows Task Scheduler: รัน `claude -p "ใช้ code-gardener รอบสำรวจ"` ทุกวัน และ `"... รอบทบทวน"` ทุกวันจันทร์และพฤหัส ถ้ารันโดยไม่มีคนดู ให้ใช้ sandbox (`.sandbox/`, ดู `docker-sandbox`) แบบ `-Isolated -Locked` และอนุญาตเฉพาะเครื่องมือที่ skill นี้ใช้ · ขั้นตอนเต็มดู [`playbook-unattended-run`](../superuser/references/playbook-unattended-run.md) · คำสั่งในห้อง (โหมด isolated เท่านั้น — `sandbox.ps1 claude` ปฏิเสธโหมด mount): รันโดยไม่มีคนดูให้ใช้ `.\.sandbox\sandbox.ps1 exec "claude -p '<คำสั่ง>'"` หลังล็อกอินในห้องแล้ว เพราะ `exec` ใช้ `compose exec -T` ส่วน `sandbox.ps1 claude` ส่ง argument ต่อได้ แต่ไม่มี `-T` จึงต้องมีหน้าต่าง terminal ซึ่ง Task Scheduler ไม่มี (จะเพิ่ม `-T` ให้ `claude` หรือไม่ รอยืนยัน) · รอบไม่มีคนดูทำแค่รอบสำรวจและรอบทบทวน (เขียน log) ไม่แก้โค้ด ไม่ commit


---

# skill: fsd-writing

Use when writing or reviewing a Functional Specification Document

# เขียน Functional Specification Document (FSD)

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง
> ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

> **กฎข้อเดียว:** FSD เสร็จเมื่อ developer เปิดอ่านแล้ว**เขียนโค้ดได้โดยไม่ต้องเดาและไม่ต้องถาม**
> ทุกจุดที่ต้องเดา คือจุดที่จะกลายเป็นงานแก้หลังส่งมอบ

## เมื่อไหร่ใช้ skill นี้

- เขียน FSD หรือ Functional Spec ของฟีเจอร์ โมดูล หรือทั้งระบบ
- แปลง Software Requirements Specification (SRS) หรือ Business Requirements Document (BRD) ให้ละเอียดพอลงมือทำ
- รีวิว FSD ของคนอื่น แล้วต้องบอกให้ได้ว่าขาดอะไร
- developer ถามคำถามเดิมซ้ำ ๆ ระหว่างทำ — แปลว่า FSD ยังไม่ครบ

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ข้อกำหนดระดับที่ลูกค้าเซ็นรับ | `srs-writing` |
| user story สำหรับ sprint | `user-story-writer` |
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง | command `/api-design` |
| ข้อตกลงกลางของ API ทั้งระบบ | `api-conventions` |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` |
| หน้าตาหน้าจอ ระยะห่าง สถานะ | `ui-craft` + skill แพลตฟอร์ม |
| รูปแบบ markdown และธีมเอกสาร | `polished-document-style` |
| หน้าตาไฟล์ .docx ที่ส่งออก | `branded-document-design` |

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/worked-examples.md](references/worked-examples.md) | ถ้าจะเขียน use case หน้าจอ ตารางสถานะ หรือกฎทางธุรกิจตัวแรกของเอกสาร ให้เปิดดูตัวอย่างเต็มแล้วลอกรูปแบบไปใช้ |
| [references/edge-cases.md](references/edge-cases.md) | ตอนเขียนหัวข้อข้อผิดพลาดและกรณีขอบ และตอนรีวิวก่อนส่ง เพื่อไล่ให้ครบทุกกรณี |
| [references/fsd-vs-srs.md](references/fsd-vs-srs.md) | ถ้ายังไม่แน่ใจว่าเนื้อหาชิ้นหนึ่งควรอยู่ใน SRS หรือใน FSD ให้เปิดตารางเทียบนี้ |
| [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md) | ถ้าเขียน FSD แบบอ่านง่ายสำหรับผู้มีส่วนได้เสีย (Mode B — 11 หัวข้อเดียวกับข้อ 3) หรือต้องการแม่แบบ use case, API endpoint, data model ฉบับคนตรวจอ่าน |
| [references/figures.md](references/figures.md) | ตอนวางแผนว่าหัวข้อไหนต้องมีรูปชนิดไหน |
| [references/outline-sections.md](references/outline-sections.md) | ถ้าต้องตัดสินว่าหัวข้อไหนข้ามได้ ให้เปิดตารางนี้ ส่วนโครงเต็มที่ลอกไปกรอกได้อยู่ใน [assets/fsd-outline.md](assets/fsd-outline.md) |
| [references/related-skills.md](references/related-skills.md) | ถ้างานต้องใช้ skill อื่นคู่กัน เช่น รูป ข้อตกลง API หรือ test case ให้เปิดดูว่าใช้ตัวไหน |

## 0 · หาแบบที่มีอยู่ก่อน (ทุกครั้ง)

ก่อนใช้โครงหรือแม่แบบในไฟล์นี้ ดูก่อนว่าผู้ใช้ ลูกค้า หรือโปรเจกต์มีแบบของตัวเองหรือยัง:

- **ที่ดู:** แบบ FSD (Functional Specification Document) จากผู้ว่าจ้างหรือ TOR · FSD ฉบับก่อนของระบบเดียวกัน · แบบ spec หน้าจอที่ทีม dev ใช้อยู่ (ดูใน `docs/` หรือถามผู้ใช้ข้อเดียว)
- **ผล:** เจอ → ใช้แบบนั้น (หัวข้อ ลำดับ ชื่อฟิลด์ เลขรัน) แล้วบอกในคำตอบว่าใช้แบบจากไฟล์ไหน · ไม่เจอ → ใช้แม่แบบในไฟล์นี้เป็นค่าสำรอง และบอกว่าไม่พบแบบเดิม
- **ยังต้องมีทุกแบบ:** เส้นแบ่ง FSD กับ SRS ในข้อ 1 และการผูกรหัสกับ use case ยังต้องมีทุกแบบ

## 1 · FSD ต่างจาก SRS ยังไง — เส้นแบ่งที่ต้องชัด

เอกสารสองฉบับนี้ปนกันบ่อยที่สุด ผลคือ SRS ยาวจนลูกค้าไม่อ่าน และ FSD ตื้นจน developer ต้องถาม
SRS บอกว่าระบบ**ต้องทำอะไรได้** ส่วน FSD บอกว่าระบบ**ทำสิ่งนั้นอย่างไร** ตารางเทียบทีละมิติอยู่ใน [references/fsd-vs-srs.md](references/fsd-vs-srs.md)

> **ห้าม FSD สร้างข้อกำหนดใหม่เอง** — เจออะไรที่ SRS ไม่ได้ครอบคลุม ให้**ลงรายการคำถามค้าง** ใส่ `(รอยืนยัน)` แล้วทำส่วนอื่นต่อ
> ข้อนั้นต้องเพิ่มใน SRS ก่อน ไม่ใช่เขียนลง FSD เงียบ ๆ
> ข้อที่โผล่มาใน FSD โดยไม่มีที่มา คือข้อที่ลูกค้าจะปฏิเสธจ่ายตอนตรวจรับ

## 2 · ลำดับการทำงาน

1. อ่าน SRS หรือ BRD ให้จบก่อน แล้ว**ทำรายการข้อที่ยังคลุมเครือ** ถามรวมครั้งเดียวตอนเริ่มแบบเลือกคำตอบ ทุกตัวเลือกมีหลักฐาน (skill `superuser` หัวข้อ 6) เฉพาะข้อที่ตีความต่างแล้วงานออกมาต่างกันทั้งชุด (ตัวเลือก = การตีความที่เป็นไปได้ อ้างข้อใน SRS/BRD) ที่เหลือใส่ `(รอยืนยัน)` แล้วทำต่อ
2. ยืนยันว่าเอกสารนี้เขียนให้ใครอ่าน — developer อย่างเดียว (**Mode A** ค่าเริ่มต้น) หรือมีลูกค้าอ่านเพื่อเซ็นรับด้วย (**Mode B** — 11 หัวข้อเดิม เรียงเหมือนเดิม แค่จัดหน้าให้คนตรวจอ่านง่าย ดู [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md))
3. ไล่ทีละ use case ไม่ใช่ทีละหน้าจอ — หน้าจอเกิดจาก use case ไม่ใช่ทางกลับกัน
4. เขียนกฎทางธุรกิจแยกออกมาก่อน แล้วค่อยอ้างถึงจากขั้นตอน (ข้อ 7)
5. ทำตารางสอบย้อนกลับไปพร้อมกัน ไม่ใช่ทำตอนจบ
6. **วาดแล้วเก็บคำถาม** — ตอนวาด sequence · ผังยกเลิก · ERD จะเจอเรื่องที่ story และ SRS ยังไม่ตอบ (เช่น คอร์สหักครั้งตอนจองหรือตอนมาใช้) จดท้ายเอกสารเป็นคำถามพร้อมคำตอบที่เสนอ `(รอยืนยัน)` ไม่เลือกเอง (ตัวอย่างจากงานนั้น: วาด 8 รูปได้คำถามใหม่ 15 ข้อ ในนั้น 10 ข้อไม่เคยอยู่ในชุดคำถามเดิม)
7. รีวิวตามข้อ 11 ก่อนส่ง

## 3 · โครงเอกสาร

มี 11 หัวข้อ เรียงตามนี้: บทนำ · ผู้ใช้และสิทธิ์ · ภาพรวมกระบวนการ · use case · ข้อกำหนดหน้าจอ · ผังสถานะ · กฎทางธุรกิจ · ข้อมูลและการเชื่อมต่อ · ข้อผิดพลาดและกรณีขอบ · ตารางสอบย้อนกลับ · ประวัติการแก้ไข
ข้ามได้แค่ข้อกำหนดหน้าจอถ้าไม่มีหน้าจอ และผังสถานะถ้าไม่มีสถานะ โครงเต็มอยู่ใน **[`assets/fsd-outline.md`](assets/fsd-outline.md)** ส่วนตารางที่บอกว่าแต่ละหัวข้อตอบคำถามอะไรอยู่ใน [references/outline-sections.md](references/outline-sections.md)

## 4 · use case — รูปแบบเดียวทั้งเอกสาร

ทุก use case มีหัวตาราง (มาจาก · ผู้ทำ · เงื่อนไขก่อนเริ่ม · ผลเมื่อสำเร็จ · ความถี่) ตามด้วยตารางขั้นตอนหลัก ทางเลือกอื่น และกรณีผิดพลาด ตัวอย่างเต็ม UC-ORD-010 อยู่ใน [references/worked-examples.md](references/worked-examples.md)

**กฎของ use case:**

- **หนึ่ง use case = หนึ่งเป้าหมายของผู้ใช้** ไม่ใช่หนึ่งหน้าจอ
- ทุก use case ต้องมี **ทางเลือกอื่น** และ **กรณีผิดพลาด** อย่างน้อยอย่างละหนึ่ง —
  use case ที่มีแต่ทางที่ทุกอย่างราบรื่น คือ use case ที่ยังเขียนไม่เสร็จ
- คอลัมน์ "ระบบทำอะไรต่อ" ห้ามว่าง — ถ้าว่างแปลว่ายังไม่ได้คิดว่าระบบตอบสนองยังไง
- **เงื่อนไขก่อนเริ่มต้องตรวจซ้ำที่ฝั่งเซิร์ฟเวอร์เสมอ** การซ่อนปุ่มไม่ใช่การควบคุมสิทธิ์
- เขียนเป็น "ผู้ใช้ทำ → ระบบตอบ" สลับกัน ไม่ใช่เล่าเป็นย่อหน้า

## 5 · ข้อกำหนดหน้าจอ

ตัวอย่างเต็ม SC-ORD-020 พร้อมตารางฟิลด์อยู่ใน [references/worked-examples.md](references/worked-examples.md)

**ทุกหน้าจอต้องระบุครบ 6 อย่าง:**

| ต้องมี | รายละเอียด |
|---|---|
| ตารางฟิลด์ | ชนิด · บังคับไหม · กฎตรวจ · **ข้อความ error ตามจริง** · ค่าเริ่มต้น |
| สิทธิ์ต่อบทบาท | บทบาทไหนเห็น · แก้ได้ · แค่อ่าน · ไม่เห็นเลย |
| ห้าสถานะของหน้าจอ | ว่าง · กำลังโหลด · ผิดพลาด · มีบางส่วน · สำเร็จ (ดู `ui-craft`) |
| การกระทำและผลลัพธ์ | ปุ่มไหนพาไปไหน · ปุ่มไหนเปิดกล่องยืนยัน |
| กฎการแสดงผล | รูปแบบวันที่ · ทศนิยมของเงิน · การปัดเศษ · เขตเวลา |
| ที่มาของข้อมูล | ฟิลด์นี้มาจาก endpoint ไหนหรือตารางไหน |

> **"ข้อความ error ตามจริง" คือคำที่ผู้ใช้จะเห็นจริง ๆ** ไม่ใช่ "แสดงข้อความแจ้งเตือน"
> ถ้าไม่เขียน developer จะแต่งเอง แล้วทั้งระบบจะมีสำนวนคนละแบบสิบแบบ
>
> **กฎการแสดงผลต้องเขียนไว้** — "ยอดรวม" ที่ไม่บอกว่าปัดเศษยังไง
> คือบั๊กที่จะเจอตอนกระทบยอดสิ้นเดือน

## 6 · ผังสถานะ — จุดที่ FSD ลืมบ่อยที่สุด

ของที่มี "สถานะ" (คำสั่งซื้อ ใบลา ตั๋วงาน เอกสาร) ต้องมีตารางที่มีคอลัมน์ จาก · ไป · ใครทำได้ · เงื่อนไข · ผลข้างเคียง และ**ห้ามมีแค่รูป** ตัวอย่างตารางอยู่ใน [references/worked-examples.md](references/worked-examples.md)

**กฎ:**

- **การเปลี่ยนที่ไม่อยู่ในตาราง คือการเปลี่ยนที่ต้องถูกปฏิเสธ** เขียนบรรทัด "ทำไม่ได้" ไว้ให้ชัด
  เพราะสิ่งที่ห้ามทำคือสิ่งที่ทดสอบได้ยากที่สุดถ้าไม่มีใครเขียนไว้
- ทุกสถานะต้องมีทางออก ยกเว้นสถานะปลายทางที่ตั้งใจให้จบ
- ผลข้างเคียงที่เกิดกับระบบอื่น (อีเมล สต็อก บัญชี) ต้องอยู่ในตารางนี้ ไม่ใช่ซ่อนอยู่ในขั้นตอน

## 7 · กฎทางธุรกิจแยกออกมาจากขั้นตอน

กฎแต่ละข้อมีรหัส ชื่อ เนื้อกฎ และที่มา ตัวอย่าง BR-030 อยู่ใน [references/worked-examples.md](references/worked-examples.md)

- **กฎหนึ่งข้อเขียนที่เดียว** แล้วอ้างด้วยรหัสจากทุกที่ที่ใช้ — ถ้าลอกไปวางสามที่ สักวันจะแก้ไม่ครบ
- ทุกกฎต้องมี**ที่มา** กฎที่ไม่มีที่มาคือกฎที่ทีมคิดเอง
- กฎที่เปลี่ยนตามเวลา (อัตราภาษี ค่าธรรมเนียม) ต้องระบุว่า**เก็บไว้ที่ไหน** —
  ในโค้ด ในตารางตั้งค่า หรือให้ผู้ดูแลระบบแก้ได้เอง

## 8 · ข้อผิดพลาดและกรณีขอบที่ต้องตอบให้ครบ

ตารางกรณีขอบคือสิ่งที่ทีมทดสอบจะใช้ และคือสิ่งที่ FSD ส่วนใหญ่ขาด ตั้งแต่ไม่มีข้อมูล กดปุ่มรัว ๆ สองคนแก้พร้อมกัน ไปจนถึงสิทธิ์ไม่พอ ให้ไล่ทุกแถวใน [references/edge-cases.md](references/edge-cases.md) แล้วตอบทุกแถวที่เกี่ยวกับฟีเจอร์

## 9 · รหัสและการสอบย้อนกลับ

```
UC-<โมดูล>-<เลข 3 หลัก>      use case              UC-ORD-010
SC-<โมดูล>-<เลข 3 หลัก>      ข้อกำหนดหน้าจอ         SC-ORD-020
BR-<เลข 3 หลัก>              กฎทางธุรกิจ            BR-030
```

ใช้ระบบเดียวกับ `srs-writing` — **เว้นเลขทีละ 10** และ **รหัสที่ออกไปแล้วห้ามใช้ซ้ำ**

| SRS | FSD | หน้าจอ | test case | สถานะ |
|---|---|---|---|---|
| FR-ORD-040 | UC-ORD-010 | SC-ORD-020 | TC-ORD-010..014 | ทำแล้ว |
| FR-ORD-040 | UC-ORD-010 · 010-E1 | SC-ORD-020 | TC-ORD-015 | ทำแล้ว |

- **ทุก use case ต้องชี้กลับไปที่ข้อกำหนดใน SRS ได้** — ถ้าชี้ไม่ได้ แปลว่ามีของแถมที่ไม่มีใครสั่ง
- **ทุกข้อกำหนดใน SRS ต้องมี use case อย่างน้อยหนึ่งตัว** — ถ้าไม่มี แปลว่าลืมทำ
- ทางเลือกอื่นและกรณีผิดพลาดต้องมี test case ของตัวเอง ห้ามนับรวมกับทางหลัก

## 10 · รูปในเอกสาร

ตารางว่าหัวข้อไหนควรมีรูปชนิดไหนอยู่ใน [references/figures.md](references/figures.md) ข้อที่ต้องจำคือ state diagram ใช้**คู่กับตาราง ไม่ใช่แทนตาราง**

รูปทุกรูปในเอกสาร FSD (ทั้ง Mode A และ Mode B ทั้ง markdown และไฟล์ที่ลูกค้าเซ็นรับ) ใช้ `diagram-figures` แบบ house style ชุดเดียว ส่วนภาพร่างหน้าจอใช้ `markdown-visuals`
Mermaid ผ่าน `software-diagrams` ใช้แค่ร่างคุยกันในแชต ไม่ใส่ในเอกสารที่ส่ง
**ทุกรูปในฉบับเดียวใช้ธีมสีชุดเดียวกัน** ตาม `doc-theme` (ดู `polished-document-style`)

## 11 · รีวิวความครบถ้วนก่อนส่ง

**ความครบ**

- [ ] ทุกข้อกำหนดใน SRS มี use case อย่างน้อยหนึ่งตัว
- [ ] ทุก use case มีทางเลือกอื่นและกรณีผิดพลาดอย่างน้อยอย่างละหนึ่ง
- [ ] ทุกหน้าจอมีตารางฟิลด์ครบ 5 คอลัมน์ และห้าสถานะ
- [ ] ทุกของที่มีสถานะ มีตารางการเปลี่ยนสถานะ รวมบรรทัดที่ "ทำไม่ได้"
- [ ] ตอบตารางกรณีขอบในข้อ 8 ครบทุกแถวที่เกี่ยวข้อง

**ความชัด**

- [ ] ไม่มีคำว่า "ตามความเหมาะสม" "โดยอัตโนมัติ" "ที่จำเป็น" โดยไม่บอกว่าคืออะไร
- [ ] ข้อความ error ทุกอันเขียนเป็นคำจริง ไม่ใช่ "แสดงข้อความแจ้งเตือน"
- [ ] ตัวเลขทุกตัวมีหน่วย และมีที่มา
- [ ] ชื่อฟิลด์ ชื่อสถานะ ชื่อ endpoint ใช้ภาษาอังกฤษตรงกับที่จะใช้ในโค้ดจริง

**ความสอดคล้อง**

- [ ] คำเดียวกันหมายถึงของเดียวกันทั้งเล่ม (มีอภิธานศัพท์)
- [ ] ชื่อสถานะในผัง ในตาราง และใน use case ตรงกันหมด
- [ ] ไม่มีข้อกำหนดใหม่ที่ไม่มีใน SRS

> **ทดสอบขั้นสุดท้าย:** ให้ developer ที่ไม่ได้อยู่ในที่ประชุมอ่านหนึ่งคน
> ทุกคำถามที่เขาถาม คือหนึ่งช่องว่างที่ต้องเติมก่อนส่ง

ไม่มีคนว่างอ่าน ให้ใช้ agent ตัวใหม่ที่ได้เฉพาะไฟล์ FSD ตอบ 8–10 คำถามที่ developer และ QA จะถาม (เช่น "ถ้าจองซ้ำเกิดอะไร" "สถานะไหนย้อนกลับได้") ข้อที่ตอบผิดหรือตอบว่า "ไม่รู้" ต้องแก้ก่อนส่ง · วิธีและคำถามเฉพาะไทย (ปี พ.ศ. · รูปแบบเลขที่เอกสาร) → [`../srs-writing/references/reader-test.md`](../srs-writing/references/reader-test.md)

**เมื่อมีโค้ดแล้ว — เทียบ FSD กับโค้ดจริง** (ทำตอนรีวิว FSD รอบหลัง build หรือก่อนรับงานแก้ · แนวคิดจาก trailofbits/skills และ ECC intent-driven-development)

- ไล่ทีละรหัสในข้อ 9: ค้นรหัส use case และชื่อหน้าจอในโค้ดและ test (`rg -n "UC-0[0-9]+" --glob '!**/node_modules/**' | head -50`) · รหัสที่ไม่เจอในโค้ดหรือ test เลย = ช่องว่างที่ต้องตอบว่ายังไม่ทำหรือทำไว้ใต้ชื่ออื่น
- เทียบ 3 จุดที่ต่างกันบ่อยที่สุด: ตารางฟิลด์ (ข้อ 5) ↔ โค้ด validation · ตารางเปลี่ยนสถานะ (ข้อ 6) ↔ โค้ดที่เปลี่ยนสถานะ (รวมบรรทัด "ทำไม่ได้") · ข้อความ error (ข้อ 8) ↔ สตริงในโค้ด
- ต่างกันให้จดเป็นตาราง `| spec:บรรทัด | file:บรรทัด | ใครถูก |` แล้วให้คนตัดสิน ไม่แก้ FSD ให้ตรงโค้ดเอง และไม่แก้โค้ดให้ตรง FSD เองในรอบรีวิว

## 12 · Anti-patterns

- **คัดลอก SRS มาแล้วเติมคำว่า "ระบบจะ"** — ได้เอกสารสองฉบับที่พูดเรื่องเดียวกัน
- **use case ที่มีแต่ทางที่ราบรื่น** — ทางที่พังคือสิ่งที่ FSD มีไว้เพื่อบอก
- **"แสดงข้อความแจ้งเตือน"** โดยไม่บอกว่าข้อความว่าอะไร
- **"ระบบจะคำนวณโดยอัตโนมัติ"** โดยไม่บอกสูตรและการปัดเศษ
- **ผังสถานะเป็นรูปอย่างเดียว** — รูปบอกไม่ได้ว่าใครมีสิทธิ์และมีผลข้างเคียงอะไร
- **คุมสิทธิ์ด้วยการซ่อนปุ่ม** โดยไม่ระบุการตรวจฝั่งเซิร์ฟเวอร์
- **กฎทางธุรกิจกระจายอยู่ในขั้นตอน** — พอแก้ทีหลังก็ตกหล่น
- **หน้าจอที่ไม่บอกว่าข้อมูลมาจากไหน** — developer จะเดา endpoint เอง
- **เอา wireframe มาแทนข้อกำหนด** — รูปบอกไม่ได้ว่าอะไรบังคับ กฎตรวจคืออะไร
- **ไม่มีตารางสอบย้อนกลับ** — แล้วไม่มีใครรู้ว่าทำครบหรือยัง

## 13 · ตัวย่อ

- **FSD** — Functional Specification Document (เอกสารข้อกำหนดเชิงหน้าที่ ระดับที่ลงมือทำได้)
- **SRS** — Software Requirements Specification (เอกสารข้อกำหนดซอฟต์แวร์ ระดับที่ลูกค้าเซ็นรับ)
- **BRD** — Business Requirements Document (เอกสารความต้องการทางธุรกิจ)
- **use case** — กรณีการใช้งาน หนึ่งเป้าหมายของผู้ใช้ตั้งแต่เริ่มจนจบ
- **state machine** — ผังสถานะ บอกว่าของชิ้นหนึ่งเปลี่ยนจากสถานะไหนไปสถานะไหนได้บ้าง
- **ETag** — Entity Tag (รหัสระบุรุ่นของข้อมูล ใช้ตรวจว่ามีคนแก้ไปก่อนไหม)


## reference: edge-cases.md

# ข้อผิดพลาดและกรณีขอบที่ต้องตอบให้ครบ

ทีมทดสอบจะใช้ตารางนี้ และเป็นส่วนที่ FSD ส่วนใหญ่ขาด ให้ไล่ทุกแถวที่เกี่ยวกับฟีเจอร์ แล้วเขียนคำตอบลงหัวข้อ 9 ของเอกสาร

| กรณี | คำถามที่ต้องตอบ |
|---|---|
| ไม่มีข้อมูล | หน้าจอว่างเปล่าแสดงอะไร มีปุ่มพาไปทำอะไรต่อไหม |
| ข้อมูลเยอะมาก | กี่รายการต่อหน้า · เรียงยังไง · ค้นหาได้ไหม |
| กดปุ่มรัว ๆ | กันงานซ้ำยังไง (ดู idempotency key ใน `api-conventions`) |
| สองคนแก้พร้อมกัน | ใครชนะ · อีกคนเห็นอะไร (ดู ETag ใน `api-conventions`) |
| เน็ตหลุดกลางทาง | ข้อมูลที่กรอกหายไหม · ลองใหม่แล้วซ้ำไหม |
| หมดเวลา session | เด้งออกทันที หรือเก็บสิ่งที่กรอกไว้ |
| ค่าที่ขอบเขต | 0 · ค่าติดลบ · วันนี้ · วันสุดท้ายของเดือน · ปีอธิกสุรทิน |
| ข้อความยาวผิดปกติ | ชื่อ 200 ตัวอักษรทำให้เลย์เอาต์พังไหม |
| ภาษาไทยและอักขระพิเศษ | เรียงลำดับถูกไหม · ค้นหาเจอไหม · อีโมจิพังไหม |
| ระบบภายนอกไม่ตอบ | รอกี่วินาที · ลองใหม่กี่ครั้ง · ผู้ใช้เห็นอะไรระหว่างนั้น |
| สิทธิ์ไม่พอ | เห็นแต่กดไม่ได้ หรือไม่เห็นเลย — **ต้องเลือกให้ชัด** |


## reference: figures.md

# รูปในเอกสาร FSD

ตารางนี้บอกว่าหัวข้อไหนของ FSD ควรมีรูปชนิดไหน ส่วนเครื่องมือที่ใช้วาดและเรื่องธีมสีอยู่ใน `SKILL.md` ข้อ 10

| หัวข้อ | รูปที่ควรมี |
|---|---|
| 3 ภาพรวมกระบวนการ | ผังขั้นตอนงานตั้งแต่ต้นจนจบ |
| 4 use case ที่มีหลายฝ่าย | sequence diagram |
| 5 หน้าจอ | ภาพร่างหน้าจอ พร้อมหมายเลขชี้ไปที่ตารางฟิลด์ |
| 6 สถานะ | state diagram — **คู่กับตาราง ไม่ใช่แทนตาราง** |
| 8 ข้อมูล | ER diagram เฉพาะตารางที่เกี่ยวกับโมดูลนี้ |


## reference: fsd-vs-srs.md

# FSD ต่างจาก SRS ยังไง

ตารางเทียบเอกสารสองฉบับทีละมิติ ใช้ตอนต้องตัดสินว่าเนื้อหาชิ้นหนึ่งควรอยู่ใน SRS หรือใน FSD

| | SRS | FSD |
|---|---|---|
| ตอบคำถาม | ระบบ**ต้องทำอะไรได้** | ระบบ**ทำสิ่งนั้นอย่างไร** |
| คนอ่านหลัก | ลูกค้า · ผู้บริหาร · คนเซ็นรับ | developer · tester · ux |
| ระดับรายละเอียด | "ระบบต้องให้ผู้ใช้ยกเลิกคำสั่งซื้อได้" | ปุ่มอยู่ตรงไหน · ยกเลิกได้ในสถานะไหนบ้าง · ใครมีสิทธิ์ · ยืนยันด้วยอะไร · ข้อความตอนทำไม่ได้ว่าอะไร · ระบบทำอะไรต่อ |
| เปลี่ยนแปลง | ต้องผ่านการอนุมัติ มีผลต่อสัญญา | เปลี่ยนได้ในทีม ตราบใดที่ยังตอบ SRS ข้อเดิม |
| หน่วยเนื้อหา | ข้อกำหนด (`FR-…`) | use case (`UC-…`) + ข้อกำหนดหน้าจอ (`SC-…`) |
| ตัวเลข | มาจากลูกค้า | มาจาก SRS ห้ามคิดใหม่ |


## reference: outline-sections.md

# หัวข้อของ FSD และข้ามได้เมื่อไหร่

ตารางนี้สรุปว่าแต่ละหัวข้อของ FSD ตอบคำถามอะไร ส่วนโครงเต็มที่มีคำใบ้ให้กรอกอยู่ใน [`../assets/fsd-outline.md`](../assets/fsd-outline.md)

| # | หัวข้อ | ตอบคำถามว่า | ข้ามได้ไหม |
|---|---|---|---|
| 1 | บทนำ · ขอบเขต · เอกสารอ้างอิง | ฉบับนี้ครอบคลุมส่วนไหน อ้างอิง SRS ข้อไหน | ไม่ได้ |
| 2 | ผู้ใช้และสิทธิ์ | ใครทำอะไรได้บ้าง | ไม่ได้ |
| 3 | ภาพรวมกระบวนการ | งานไหลจากต้นจนจบยังไง | ไม่ได้ |
| 4 | use case รายตัว | แต่ละงานทำทีละขั้นยังไง | ไม่ได้ |
| 5 | ข้อกำหนดหน้าจอ | หน้าจอมีอะไร ฟิลด์ตรวจอะไร | ข้ามได้ถ้าไม่มีหน้าจอ |
| 6 | ผังสถานะ | ของชิ้นนี้เปลี่ยนสถานะไปไหนได้บ้าง | ข้ามได้ถ้าไม่มีสถานะ |
| 7 | กฎทางธุรกิจ | กฎอะไรบังคับอยู่ | ไม่ได้ |
| 8 | ข้อมูลและการเชื่อมต่อ | ใช้ข้อมูลอะไร ต่อกับระบบไหน | ไม่ได้ |
| 9 | ข้อผิดพลาดและกรณีขอบ | พังแบบไหนได้บ้าง แล้วผู้ใช้เห็นอะไร | ไม่ได้ |
| 10 | ตารางสอบย้อนกลับ | ข้อนี้มาจาก SRS ข้อไหน ทดสอบด้วยอะไร | ไม่ได้ |
| 11 | ประวัติการแก้ไข | ใครแก้อะไรเมื่อไหร่ | ไม่ได้ |


## reference: related-skills.md

# เชื่อมกับ skill อื่น

ถ้างานที่ทำอยู่ต้องใช้ความรู้นอกเหนือจาก FSD ให้เปิด skill ในคอลัมน์ขวาคู่กัน

| ต้องการ | ใช้คู่กับ |
|---|---|
| ระดับข้อกำหนดที่ลูกค้าเซ็นรับ | `srs-writing` |
| รูปแบบ markdown และธีมสีของเอกสาร | `polished-document-style` |
| หน้าตาไฟล์ .docx ที่ส่งออก | `branded-document-design` |
| รูปในเอกสาร | `diagram-figures` (ทุกรูปในเอกสารที่ส่ง) · `markdown-visuals` (ภาพร่างหน้าจอ) · `software-diagrams` (Mermaid ร่างคุยในแชตเท่านั้น) |
| ข้อตกลงของ API ที่ FSD อ้างถึง | `api-conventions` |
| แบบจำลองข้อมูลที่ FSD อ้างถึง | `database-design` |
| ห้าสถานะของหน้าจอ และกฎงานออกแบบ | `ui-craft` + skill แพลตฟอร์ม |
| แปลง use case เป็น test case | `test-case-template` |
| แตกเป็น user story ตอนเริ่ม sprint | `user-story-writer` |
| ตัดสิ่งที่ไม่จำเป็นออกจากเอกสาร | `simplicity-first` |

**โครงเอกสารที่คัดลอกไปกรอกต่อได้ทันที** → [`../assets/fsd-outline.md`](../assets/fsd-outline.md)


## reference: stakeholder-doc-templates.md

# Stakeholder document (Mode B) — style, diagrams, templates

**สารบัญ:** Document Structure · Formatting Rules (hierarchy · markers · callouts · tables · badges) · Diagrams · Templates: Use Case · API Endpoint · Data Model

Moved from the system-analyst agent. Read when writing a Mode B document. A Mode A use case follows `SKILL.md` §4 and [`worked-examples.md`](worked-examples.md); the templates below are the same content in reviewer-friendly form, never a different format.

Mode B is **the same FSD** as Mode A — the same 11 sections in the same order as `SKILL.md` §3 — styled for reviewers who sign off: a short summary up front, plain words, more tables, less code. It never adds or drops a section; only the style changes. Diagrams follow `SKILL.md` §10. IDs follow `SKILL.md` §9 (`UC-<module>-<3 digits>`, steps of 10).

## Document Structure

Every stakeholder doc MUST follow the 11 FSD sections (`SKILL.md` §3, full outline in [`assets/fsd-outline.md`](../assets/fsd-outline.md)):

````markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft | Review | Approved
> **Authors:** ... · **Reviewers:** ...

---

## Table of Contents

1. [Introduction](#1-introduction) — starts with a one-paragraph summary for non-technical readers
2. [Users & Permissions](#2-users--permissions)
3. [Process Overview](#3-process-overview)
4. [Use Cases](#4-use-cases)
5. [Screen Specifications](#5-screen-specifications)
6. [State Machines](#6-state-machines)
7. [Business Rules](#7-business-rules)
8. [Data & Integrations](#8-data--integrations) — API endpoints and data model go here
9. [Errors & Edge Cases](#9-errors--edge-cases)
10. [Traceability](#10-traceability)
11. [Revision History](#11-revision-history)

---

## 1. Introduction

> **For non-technical readers** — 1 paragraph explaining what this feature does and why.

### Scope

**In scope**
- ...

**Out of scope**
- ...

### Glossary
- ...

[... continue all 11 sections; skip 5 only if there are no screens and 6 only if nothing has a status ...]
````

## Formatting Rules

### Hierarchy & Numbering
- H1 = document title (only ONE)
- H2 = numbered sections (1., 2., 3.)
- H3 = sub-sections (1.1, 1.2)
- Always add TOC for docs with 5+ sections
- Use anchor links in TOC

### Visual Markers

No emoji or icons in headings, body, tables, labels or callouts (`human-writing` · `polished-document-style`). Use words:

| Need | Write |
|--------|---------|
| Yes / no in a table | ✓ / ✗ |
| Status | Draft · Approved · Pending · In Progress |
| Severity or priority | Critical · High · Medium · Low |
| Tip, warning, critical, note | Bold callout label (below) |

### Callout Boxes (Blockquotes)

```markdown
> **Tip:** Brief insight here.

> **Warning:** Important caveat.

> **Critical:** Must read before proceeding.

> **Note:** Additional context.
```

### Tables

Prefer tables over bullet lists when data has 2+ attributes:

```markdown
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✓ | User's email |
| age | number | ✗ | Optional |
```

Align headers to data when helpful:
```markdown
| Field | Type | Required |
|:------|:-----|:--------:|
```

### Status Badges (in tables/inline)

```markdown
**Status:** Approved
**Priority:** High
**Risk:** Medium
```

---

# Diagrams

Follow `SKILL.md` §10. A Mode B document is delivered to people who sign it, so every figure is a house-style figure made with `diagram-figures` (same theme for every figure in one document, per `doc-theme`). Mermaid through `software-diagrams` is only for a quick sketch in chat, never for the delivered file. Screen sketches use `markdown-visuals`.

## When to use which diagram

| Diagram | Use for | FSD section |
|---------|---------|---|
| Flowchart | Business processes, decision trees | 3 Process Overview |
| Sequence diagram | Interactions between systems/actors over time | 4 Use Cases (multi-party) |
| State diagram | Object lifecycle, status transitions — **next to the table, not instead of it** | 6 State Machines |
| ER diagram | Tables of this module only | 8 Data & Integrations |
| Timeline (Gantt) | Schedule, if the document has one | appendix |

Embed each figure as an image with a numbered caption, for example `![Figure 4-1 Place order — sequence](figures/uc-ord-010-sequence.svg)`.

---

# Templates

## Use Case Template (Mode B)

````markdown
### UC-ORD-010: <Use Case Name>

| Field | Value |
|-------|-------|
| **ID** | UC-ORD-010 (next use case in this module: UC-ORD-020) |
| **From (SRS)** | FR-ORD-040 |
| **Actor** | Customer |
| **Priority** | High |
| **Status** | Approved |
| **Trigger** | User clicks "Place Order" |
| **Frequency** | ~200 per day `(รอยืนยัน)` |

#### Preconditions
- User is authenticated
- Cart contains at least 1 item

#### Postconditions
- Order created with status `pending`
- Inventory reserved
- Confirmation email sent

#### Main Flow

| Step | Actor | Action | System Response |
|:----:|:------|:-------|:----------------|
| 1 | User | Reviews cart and clicks "Place Order" | Shows order summary |
| 2 | User | Confirms payment method | Validates payment info |
| 3 | System | Submits payment to gateway | Receives auth code |
| 4 | System | Creates order record | Returns order #ORD-XXXX |
| 5 | System | Sends confirmation email | — |
| 6 | User | Sees confirmation page | — |

#### Alternative Flows

> **010-A1: Payment declined at step 3**
> 3a. Gateway returns decline
> 3b. System shows error, suggests alternate payment
> 3c. Returns to step 2

#### Exception Flows

> **010-E1: Gateway timeout at step 3**
> 3a. System waits 30s
> 3b. Logs incident, marks order as `payment_pending`
> 3c. Sends "We'll retry" email to user

#### Sequence Diagram

![Figure 4-1 UC-ORD-010 Place order — Customer, UI, API, Payment Gateway, Database](figures/uc-ord-010-sequence.svg)

> Drawn with `diagram-figures` (house style). Steps: Customer clicks "Place Order" → UI sends POST /orders → API charges the gateway → gateway returns auth code → API inserts the order → UI shows the confirmation page.
````

## API Endpoint Template (Mode B)

````markdown
### POST `/api/v1/orders`

> Create a new order from cart contents.

| Attribute | Value |
|-----------|-------|
| **Auth Required** | Yes (Bearer token) |
| **Rate Limit** | 10 req/min per user |
| **Idempotent** | Yes (use `Idempotency-Key` header) |

#### Request Headers

| Header | Required | Example |
|--------|:--------:|---------|
| `Authorization` | ✓ | `Bearer eyJ...` |
| `Idempotency-Key` | Recommended | `unique-request-id` |
| `Content-Type` | ✓ | `application/json` |

#### Request Body

```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "shipping_address_id": "uuid",
  "payment_method_id": "uuid"
}
```

#### Response: 201 Created

```json
{
  "data": {
    "id": "ORD-12345",
    "status": "pending",
    "total": 1250.00,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

Every error body is `application/problem+json` (RFC 9457): `type` · `title` · `status` · `detail` · `requestId`, plus `errors[]` for validation. Shape and status rules: `web-service-essentials` §2.

| Code | When | `type` (suffix) |
|:----:|:-----|:-----|
| 401 | Missing/invalid token | `unauthorized` |
| 402 | Payment declined | `payment-declined` |
| 409 | Inventory unavailable | `out-of-stock` |
| 422 | Validation failed | `validation` + `errors[]` (`field` · `code` · `message`) |
| 429 | Rate limit exceeded | `rate-limited` + `Retry-After` header |
````

## Data Model Template (Mode B)

````markdown
## 8. Data & Integrations

### Entity Relationship Diagram

![Figure 8-1 Order module — USER places ORDER, ORDER contains ORDER_ITEM](figures/order-er.svg)

> Drawn with `diagram-figures` (house style), tables of this module only.

### Tables

#### `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation |

> **Security:** `email` is encrypted at rest using AES-256.
````

---


## reference: worked-examples.md

# ตัวอย่างเต็มของ use case หน้าจอ ผังสถานะ และกฎทางธุรกิจ

ตัวอย่างทั้งไฟล์ใช้เรื่องเดียวกัน คือการยกเลิกคำสั่งซื้อ ลอกรูปแบบไปใช้ได้ทันที ส่วนกฎของแต่ละแบบอยู่ใน `SKILL.md`

## use case (ข้อ 4)

```markdown
### UC-ORD-010 · ยกเลิกคำสั่งซื้อ

| | |
|---|---|
| **มาจาก** | FR-ORD-040 |
| **ผู้ทำ** | ลูกค้า · เจ้าหน้าที่ฝ่ายขาย |
| **เงื่อนไขก่อนเริ่ม** | เข้าสู่ระบบแล้ว · คำสั่งซื้ออยู่ในสถานะ `confirmed` |
| **ผลเมื่อสำเร็จ** | คำสั่งซื้อเป็น `cancelled` · คืนจำนวนสินค้าเข้าคลัง · ส่งอีเมลแจ้ง |
| **ความถี่** | ประมาณ 30 ครั้งต่อวัน |

**ขั้นตอนหลัก**

| # | ผู้ทำ | การกระทำ | ระบบทำอะไรต่อ |
|:--:|---|---|---|
| 1 | ลูกค้า | เปิดหน้ารายละเอียดคำสั่งซื้อ | แสดงปุ่ม "ยกเลิก" เฉพาะเมื่อ BR-030 ผ่าน |
| 2 | ลูกค้า | กด "ยกเลิก" | เปิดกล่องยืนยัน พร้อมช่องเหตุผล (บังคับ) |
| 3 | ลูกค้า | เลือกเหตุผล แล้วกดยืนยัน | ตรวจ BR-030 อีกครั้งที่ฝั่งเซิร์ฟเวอร์ |
| 4 | ระบบ | — | เปลี่ยนสถานะ · คืนสต็อก · บันทึกผู้ทำและเวลา · ส่งอีเมล |
| 5 | ระบบ | — | แสดงข้อความสำเร็จ และปุ่มยกเลิกหายไป |

**ทางเลือกอื่น**

| รหัส | แยกที่ขั้น | เงื่อนไข | ผลลัพธ์ |
|---|:--:|---|---|
| 010-A1 | 3 | ผู้ทำเป็นเจ้าหน้าที่ | ข้ามช่องเหตุผล แต่บังคับกรอกหมายเหตุภายใน |

**กรณีผิดพลาด**

| รหัส | เกิดที่ขั้น | สาเหตุ | ผู้ใช้เห็นอะไร | ระบบทำอะไร |
|---|:--:|---|---|---|
| 010-E1 | 3 | มีคนเปลี่ยนสถานะไปก่อนแล้ว | "คำสั่งซื้อนี้ถูกจัดส่งแล้ว ยกเลิกไม่ได้" | ไม่เปลี่ยนอะไร · โหลดหน้าใหม่ |
| 010-E2 | 4 | คืนสต็อกไม่สำเร็จ | "ระบบขัดข้อง กรุณาลองใหม่" + รหัสอ้างอิง | ย้อนกลับทั้งรายการ · บันทึก log ระดับ error |
```

## ข้อกำหนดหน้าจอ (ข้อ 5)

```markdown
### SC-ORD-020 · หน้ารายละเอียดคำสั่งซื้อ

**เส้นทาง:** `/orders/{id}` · **ใช้ใน:** UC-ORD-010, UC-ORD-020

| ฟิลด์ | ชนิด | บังคับ | กฎตรวจ | ข้อความเมื่อไม่ผ่าน | ค่าเริ่มต้น |
|---|---|:--:|---|---|---|
| เหตุผลที่ยกเลิก | เลือกจากรายการ | ลูกค้า ✓ · เจ้าหน้าที่ ✗ (010-A1) | ต้องเป็นค่าในรายการ BR-031 | "กรุณาเลือกเหตุผล" | — |
| หมายเหตุภายใน | ข้อความยาว | เจ้าหน้าที่ ✓ · ลูกค้าไม่เห็นช่องนี้ | ไม่เกิน 500 ตัวอักษร | "กรุณากรอกหมายเหตุ" · "หมายเหตุยาวเกิน 500 ตัวอักษร" | ว่าง |
```

## ตารางการเปลี่ยนสถานะ (ข้อ 6)

| จาก | ไป | ใครทำได้ | เงื่อนไข | ผลข้างเคียง |
|---|---|---|---|---|
| `draft` | `confirmed` | ลูกค้า | มีสินค้าอย่างน้อย 1 รายการ · ที่อยู่ครบ | ตัดสต็อก · ส่งอีเมล |
| `confirmed` | `cancelled` | ลูกค้า · เจ้าหน้าที่ | BR-030 | คืนสต็อก · ส่งอีเมล |
| `confirmed` | `shipped` | เจ้าหน้าที่คลัง | มีเลขพัสดุ | ส่ง SMS |
| `shipped` | `cancelled` | — | **ทำไม่ได้** | — |

## กฎทางธุรกิจ (ข้อ 7)

```markdown
**BR-030 · ยกเลิกคำสั่งซื้อได้เมื่อไหร่**
ยกเลิกได้เมื่อสถานะเป็น `confirmed` และยังไม่เกิน 24 ชั่วโมงนับจากเวลายืนยัน
เจ้าหน้าที่ระดับหัวหน้าขึ้นไปยกเลิกได้โดยไม่จำกัดเวลา แต่ต้องกรอกหมายเหตุ
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.2

**BR-031 · เหตุผลที่ลูกค้าเลือกได้ตอนยกเลิก**
สั่งผิดรายการ · ได้ราคาที่ถูกกว่า · รอนานเกินไป · ไม่ต้องการแล้ว · อื่น ๆ
ผู้ดูแลระบบแก้รายการนี้ได้ในหน้าตั้งค่า โดยไม่ต้องแก้โค้ด
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.3 `(รอยืนยัน)`
```


---

# skill: flag-and-propose

Use when a mid-task finding needs a decision before going on

# แจ้งสิ่งที่เจอ แล้วเสนอทางไป

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **กฎข้อเดียว:** เปิดด้วย**ผลกระทบ** ปิดด้วย**คำถามเดียว**
> ตรงกลางคือหลักฐานกับข้อเสนอ ไม่ใช่การเล่าว่าเจอมาได้ยังไง

## เมื่อไหร่ใช้ skill นี้

- เจอของที่ทำให้แผนเดิมใช้ไม่ได้ ระหว่างทำงานอย่างอื่นอยู่
- ตัวเลข ไฟล์ หรือเอกสารไม่ตรงกัน แล้วต้องรู้ว่าจะยึดอันไหน — เฉพาะเมื่อเลือกผิดแล้วย้อนไม่ได้ · ถ้าย้อนได้ ให้เลือกเองแล้วลง [`decision-log`](../decision-log/SKILL.md)
- มีทางไปต่อหลายทางที่ย้อนไม่ได้ เสียเงินหรือเวลามาก หรือส่งออกไปถึงคนนอก และต้องให้ผู้ใช้เลือกก่อน · ใน SuperUser ทำส่วนอื่นให้ครบก่อน แล้วเขียนเรื่องนี้ใต้ **รออนุมัติ** ตอนจบ ไม่หยุดถามกลางงาน
- เสนอให้เพิ่มหรือเปลี่ยนอะไรบางอย่าง ที่ผู้ใช้ยังไม่ได้ขอ

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| ตอบคำถามที่ผู้ใช้ถามมา | `answer-shape` | แทน |
| ทางเลือกที่ย้อนได้ (เปลี่ยนทีหลังได้ไม่เสียอะไร) | `principle-proceed-on-reversible-work` — ทำเลย แล้วลง `decision-log` | แทน |
| ข้อเท็จจริงที่ไม่รู้ (ตัวเลข ชื่อ วันที่ งบ) | ใส่ `(รอยืนยัน)` แล้วทำต่อ ไม่ต้องหยุดถาม | แทน |
| รายงานผลงานที่ทำเสร็จแล้ว | `human-writing` · `status-report` | แทน |
| อธิบายเรื่องซับซ้อนให้เข้าใจ | `answer-shape` | แทน |
| เขียนเป็นเอกสารให้คนอื่นอ่าน | `polished-document-style` | แทน |
| งานพังจริงและต้องแก้ทันที | `targeted-fix` — แก้ก่อน แล้วค่อยรายงาน | แทน |
| กางตัวย่อและศัพท์เฉพาะในคำตอบ | `spell-out-abbreviations` | คู่ |
| สิ่งที่เจอคือเหตุขัดข้องของระบบจริง | `incident-runbook-template` · `postmortem-template` (plugin `software-development`) | คู่ |

---

## 1 · โครงคำตอบ 4 บล็อก

| บล็อก | ความยาว | กฎ |
|---|---|---|
| 1 · สิ่งที่เจอ + ผลถ้าไม่แก้ | 1–2 บรรทัด | **ขึ้นก่อนเสมอ** ไม่มีคำเกริ่น ไม่ทวนคำถาม |
| 2 · หลักฐาน | ตาราง ≤ 5 แถว | ตัวเลขที่ขัดกันเท่านั้น ไม่ต้องเล่าวิธีตรวจ |
| 3 · ข้อเสนอ | ตาราง ≤ 5 แถว | ทำอะไร → **ได้อะไร** ไม่ใช่ทำอะไร → ทำยังไง |
| 4 · คำถามปิด | 1 คำถาม | คำถามเดียว แบบเลือกคำตอบ ทุกตัวเลือกมีหลักฐาน (ข้อ 6) |

บล็อก 2 ตัดได้ถ้าไม่มีตัวเลข ส่วนบล็อก 3 ตัดได้ถ้ายังไม่มีข้อเสนอจริง ๆ
**บล็อก 1 กับ 4 ตัดไม่ได้**

**ทั้งคำตอบควรจบใน 1 หน้าจอ** — ยาวกว่านั้นแปลว่ากำลังอธิบายกระบวนการ ไม่ใช่ขอการตัดสินใจ

---

## 2 · บล็อกที่ 1 — สูตรประโยคเดียว

```
<อะไรผิด> เพราะ <สาเหตุสั้น ๆ> · ต้อง <ทำอะไร> ก่อน <ขั้นถัดไป> ไม่งั้น <ผลเสียที่เป็นรูปธรรม>
```

| ผิด: เขียนแบบเล่าเรื่อง | ถูก: เขียนแบบขึ้นด้วยผลกระทบ |
|---|---|
| "ระหว่างทำสรุปยอดผมพบว่าไฟล์ยอดขายที่ดึงมาเมื่อเช้านี้นั้นเป็นฉบับก่อนที่ร้านจะแก้ราคา…" | "**สรุปยอดขายใช้ราคาเก่า** เพราะดึงจากไฟล์ก่อนร้านแก้ราคา ต้องดึงใหม่ก่อนส่งบัญชี ไม่งั้นภาษีคำนวณผิด 38 รายการ" |

- **"ไม่งั้น…" ต้องเป็นรูปธรรม** — "ข้าม FR-14.x (Functional Requirement — ความต้องการเชิงฟังก์ชัน ข้อ 14.x) ทั้งชุด" ไม่ใช่ "อาจมีปัญหาตามมา"
- ไม่ต้องบอกว่าเจอตอนไหนหรือเจอได้ยังไง เว้นแต่วิธีเจอจะเปลี่ยนสิ่งที่ต้องทำ
- ตัวหนาใช้กับ**คำที่เปลี่ยนการตัดสินใจ**เท่านั้น ไม่ใช่ทุกคำสำคัญ

---

## 3 · ตัวเลขที่ขัดกัน = ตารางเทียบเสมอ

สองค่าขึ้นไปที่ไม่ตรงกัน อ่านจากประโยคยากกว่าอ่านจากตารางทุกครั้ง

```markdown
| | ที่บันทึกไว้ | ของจริง |
|---|---|---|
| ออเดอร์ที่ดึงมา | 214 | **245** |
| ราคา SKU-07 | 390 | **420** |
| ค่าส่งต่างประเทศ | ไม่มี | **มี** |
```

- หัวคอลัมน์บอกว่า**ค่าไหนเชื่อได้** — "ที่บันทึกไว้ / ของจริง" ไม่ใช่ "เก่า / ใหม่"
- ตัวหนาที่ฝั่งที่ถูกต้อง เพื่อให้กวาดตาแล้วรู้ทันทีว่าต้องยึดอะไร
- แถวที่ตรงกันอยู่แล้ว **ไม่ต้องใส่**

**คำถามหรือสมมติฐานเดิมที่ตกไปเพราะข้อมูลใหม่ ให้ตัดทิ้งในหนึ่งบรรทัด**
เช่น "คำถามข้อ 1 เรื่องยอดไม่ตรง — ตกไปเอง" แล้วไปต่อ อย่าอธิบายว่าทำไมถึงตก

---

## 4 · ข้อเสนอเป็นตาราง "ทำอะไร → ได้อะไร"

```markdown
| ไฟล์ | ได้อะไร |
|---|---|
| สารบัญของโฟลเดอร์งาน (`README`) | รู้ว่าอ่านอะไรก่อน ใครเป็นเจ้าของ |
| วันที่และฉบับบนหน้าแรกของแต่ละไฟล์ | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอ |
```

- คอลัมน์ขวาคือ **ประโยชน์** ไม่ใช่ขั้นตอน — คนอ่านกำลังตัดสินใจว่าคุ้มไหม ไม่ได้กำลังลงมือทำ
- เรียงจากคุ้มที่สุดลงมา ไม่ใช่เรียงตามลำดับการทำ · "คุ้ม" วัดด้วยสูตร คนหรือไฟล์ที่ได้ประโยชน์ × ผลกระทบ × ความมั่นใจ ÷ แรงงาน: ตั้งแต่ 3 ข้อขึ้นไปใส่ตัวเลขตามแม่แบบ [`templates/priority.json`](templates/priority.json) แล้วรัน `node <plugin>/skills/decision-scoring/scripts/decide.mjs priority priority.json` · ข้อที่ทำให้ผลผิดหรือไม่ปลอดภัยใส่ `"first": true` ให้ขึ้นก่อนเสมอ · มีงบเวลาจำกัดใช้ `knapsack` แทน (`decision-scoring`)
- **ผูกข้อเสนอกับปัญหาที่เพิ่งเจอถ้าผูกได้** — เป็นเหตุผลที่หนักแน่นที่สุดที่มี
- เกิน 5 แถวเมื่อไหร่ แปลว่ากำลังเสนอหลายเรื่องปนกัน ให้แยกเป็นคนละรอบ

---

## 5 · บอกสิ่งที่**ไม่**ทำด้วย

หนึ่งบรรทัด พร้อมเหตุผลและเวลาที่ควรทำแทน

> รายงานย้อนหลังรายปีไม่ทำตอนนี้ — ทำหลังยอดเดือนนี้ยืนยัน

บรรทัดนี้กัน **"แล้วอันนั้นล่ะ ทำไมไม่ทำ"** ซึ่งเป็นคำถามที่ตามมาเกือบทุกครั้ง
และบอกกลาย ๆ ว่าคิดครบแล้ว ไม่ได้ลืม

---

## 6 · ปิดด้วยคำถามเดียว

```
เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วยดึงไฟล์ใหม่ + อัปเดตสรุป
```

| กฎ | เหตุผล |
|---|---|
| **หนึ่งคำถาม** ต่อหนึ่งคำตอบ | ถ้าถามสองคำถามขึ้นไป จะได้คำตอบแค่ข้อเดียว |
| ตอบได้ด้วยไม่กี่คำ | "ทั้ง 4" · "เริ่มข้อ 2" |
| มีตัวเลือก "เอาทั้งหมด" ให้ | ส่วนใหญ่ผู้ใช้เลือกอันนี้ ถ้าต้องพิมพ์เองจะเสียเวลา |
| ถ้ามีลำดับที่แนะนำ ใส่ไว้ในคำถามเลย | เขาจะได้ตอบว่า "ตามนั้น" คำเดียว |
| **ถามแบบเลือกคำตอบ ทุกตัวเลือกมีหลักฐาน** ตาม `superuser` §6: ตัวเลือก 2–4 ตัว · ตัวแนะนำอยู่บนสุดต่อท้าย `(แนะนำ)` พร้อมเหตุผล 1 บรรทัด | กดเลือกได้เลย และไม่เลือกจากตัวเลือกที่สมมุติขึ้น |

**ห้ามปิดด้วยการถามว่า "มีอะไรให้ช่วยเพิ่มไหม"** — ไม่ใช่คำถามที่ขอการตัดสินใจ

---

## 7 · ตัวอย่างเต็ม

ตัวอย่างก่อนและหลังแก้ (งานเอกสารความต้องการและแผนงานซอฟต์แวร์) อยู่ใน [`references/example.md`](references/example.md)

---


## 8 · Anti-patterns

- **เปิดด้วย "ระหว่างตรวจผมพบว่า…"** — ผู้อ่านต้องอ่านถึงท้ายย่อหน้าถึงจะรู้ว่าต้องทำอะไร
- **ตัวเลขที่ขัดกันเขียนเป็นประโยค** — "เดิม 214 ตอนนี้ 245" ตาต้องกระโดดไปมา
- **อธิบายว่าปัญหาเกิดได้ยังไง** ทั้งที่ไม่เปลี่ยนสิ่งที่ต้องทำ
- **ข้อเสนอที่บอกวิธีทำแทนที่จะบอกประโยชน์** — ยังตัดสินใจไม่ได้อยู่ดี
- **ถามสามคำถามในย่อหน้าเดียว** — จะได้คำตอบข้อเดียว แล้วต้องถามซ้ำ
- **ปิดด้วย "แจ้งได้เลยครับ"** — ไม่ได้ขอการตัดสินใจอะไร
- **ขอโทษยาว ๆ ที่พลาด** — บอกว่าอะไรผิดและแก้ยังไง พอแล้ว
- **รายงานอย่างเดียวโดยไม่เสนอ** — ผลักภาระคิดกลับไปให้ผู้ใช้ทั้งหมด


## reference: example.md

# flag-and-propose — ตัวอย่างเต็ม

ย้ายมาจาก [SKILL.md](../SKILL.md) §7

ตัวย่อในตัวอย่าง: ความต้องการเชิงฟังก์ชัน (Functional Requirement — FR) · ความต้องการที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirement — NFR) · กรณีทดสอบ (Test Case — TC) · บันทึกการตัดสินใจด้านสถาปัตยกรรม (Architecture Decision Record — ADR) · เอกสารข้อกำหนดเชิงฟังก์ชัน (Functional Specification Document — FSD) · Application Programming Interface (API)

**ก่อน — 1 ย่อหน้ายาว 3 ก้อน อ่านจบแล้วยังไม่รู้ว่าต้องตอบอะไร**

> เรื่องด่วนที่เจอระหว่างตรวจ — BUILD-PLAN.md ที่สร้างเมื่อเช้านี้อ่านจาก
> `_to_delete/extracted/*.md` ซึ่งเป็นฉบับก่อนที่ผมจะแก้ มันจึงบันทึกไว้ว่า
> "FR ถึง FR-13.9 · TC 214 ข้อ · ไม่มี NFR" และตั้งคำถามข้อ 1 ว่าเลข 239 ไม่ตรง
> ตอนนี้เอกสารจริงเป็น FR-14.12 และ 245 กรณีแล้ว ต้อง extract ใหม่แล้วอัปเดต
> BUILD-PLAN ก่อนให้ agent เขียนโค้ดต่อ ไม่งั้นมันจะสร้างระบบตามสเปกเก่าและข้าม
> FR-14.x กับ NFR ทั้งหมด … ถ้าจะทำให้ชุดนี้เป็นตัวอย่างของโปรเจกต์ถัดไป ผมเสนอให้
> เติม 4 ไฟล์ที่คุ้มที่สุดก่อน คือ docs/README.md เป็นสารบัญบอกว่าอ่านอะไรก่อนและ
> ใครเป็นเจ้าของ, เพิ่มตารางประวัติการแก้ไขในหน้าแรกของทั้ง 4 docx, …

**หลัง — โครงเดียวกัน 4 บล็อก**

> **ด่วน — `BUILD-PLAN.md` ตัวเลขเก่า** เพราะอ่านจาก `_to_delete/extracted/` ฉบับก่อนคุณแก้
> ต้อง re-extract ก่อนปล่อย agent เขียนโค้ด ไม่งั้นมันสร้างตามสเปกเก่าและข้าม FR-14.x กับ NFR ทั้งชุด
>
> | | ที่บันทึกไว้ | ของจริง |
> |---|---|---|
> | FR ถึง | 13.9 | **14.12** |
> | Test case | 214 | **245** |
> | NFR | ไม่มี | **มี** |
>
> คำถามข้อ 1 ที่ตั้งไว้ว่าเลข 239 ไม่ตรง — ตกไปเอง
>
> **ทำเป็นแม่แบบ: 4 ไฟล์ที่คุ้มสุด**
>
> | ไฟล์ | ได้อะไร |
> |---|---|
> | `docs/README.md` | สารบัญ — อ่านอะไรก่อน ใครเป็นเจ้าของ |
> | ประวัติการแก้ไข หน้าแรกของ docx ทั้ง 4 | รู้ว่าถืออยู่ฉบับไหน — ตรงกับปัญหาที่เพิ่งเจอพอดี |
> | `docs/DESIGN-SYSTEM.md` | ดึง token ออกจาก mockup มาเขียนเป็นเอกสาร |
> | `docs/decisions/` | แยก ADR-1..12 เป็นไฟล์ละข้อ |
>
> FSD กับ API spec ไม่ทำตอนนี้ — ทำตอนเริ่มเขียนโค้ดของแต่ละหน้าจอ
>
> เริ่มจากอันไหนดีครับ หรือทำทั้ง 4 แล้วปิดท้ายด้วย re-extract + อัปเดต BUILD-PLAN

**สิ่งที่หายไป ทั้งที่ข้อมูลครบเท่าเดิม:** คำเกริ่น · การเล่าว่าตรวจเจอยังไง ·
ชื่อไฟล์เต็มที่ไม่ได้ช่วยตัดสินใจ · คำอธิบายว่าทำไมคำถามเดิมถึงตกไป ·
รายละเอียดวิธีทำของแต่ละข้อเสนอ
