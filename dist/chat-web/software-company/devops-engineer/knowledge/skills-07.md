# skill: docker-sandbox

Use when a project needs its own Docker container (untrusted code, system installs, overnight runs) or the user says sandbox.

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

# skill: cicd-and-release

Use when setting up or fixing a build and deploy pipeline or deciding how a project ships.

# Continuous Integration / Continuous Delivery (CI/CD) และการปล่อยของ

> **กฎข้อเดียว:** build ครั้งเดียว แล้วเอา **artifact ตัวเดิม** ไปทุก environment
> ถ้า build ใหม่ตอนขึ้น production ของที่ทดสอบผ่านกับของที่ลูกค้าใช้จะไม่ใช่ตัวเดียวกัน

## เมื่อไหร่ใช้ skill นี้

- ตั้ง pipeline ให้โปรเจกต์ใหม่ หรือรื้อของเดิมที่ช้าหรือผลไม่น่าเชื่อ
- ต้องตัดสินใจเรื่อง branch, เวอร์ชัน, environment, หรือวิธีปล่อยของ
- deploy แล้วพังบ่อย หรือ rollback ไม่ได้
- มีคนถามว่า "ตอนนี้ production รันเวอร์ชันอะไร commit ไหน"

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| ที่เก็บ secret และการหมุนเวียน | `config-and-secrets` | แทน |
| pipeline อยู่บน Jenkins (Jenkinsfile · credentials · input อนุมัติ) | `jenkins-pipeline` | คู่ |
| Dockerfile · Helm chart · deploy ขึ้น Kubernetes | `kubernetes-helm` | คู่ |
| สัดส่วนและขอบเขตของ test | `testing-standards` | แทน |
| เขียน migration | `database-design` | แทน |
| ขั้นตอนตอนระบบล่ม | `incident-runbook-template` | แทน |
| เขียนบันทึกการปล่อยให้ผู้ใช้อ่าน | command `/release-notes` | แทน |
| สัดส่วน test แต่ละชั้นใน pipeline | `testing-standards` · `e2e-testing-patterns` | คู่ |
| health check ที่ pipeline ใช้ตัดสิน | `web-service-essentials` | คู่ |
| ขั้นตอนเมื่อ deploy แล้วล่ม | `incident-runbook-template` · `postmortem-template` | คู่ |
| ข้อความ commit ที่สร้างบันทึกการปล่อยอัตโนมัติได้ | `commit-message-format` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**ไฟล์ pipeline ที่ใช้ได้จริงของ GitHub Actions, Azure DevOps และ GitLab** อยู่ใน `references/per-platform.md`
**อ่านเพิ่มเมื่อต้องใช้:** [`references/deployment-plan-template.md`](references/deployment-plan-template.md) — แม่แบบแผน

---

## 1 · ขั้นตอนใน pipeline

| ลำดับ | ขั้น | บล็อกเมื่อ | เวลาที่ยอมรับได้ |
|:--:|---|---|---|
| 1 | ตรวจรูปแบบโค้ด + lint | ผิดกฎ | < 1 นาที |
| 2 | build | คอมไพล์ไม่ผ่าน · มี warning ที่ตั้งเป็น error | < 3 นาที |
| 3 | unit test | มี test ตก · ความครอบคลุมต่ำกว่าเกณฑ์ | < 5 นาที |
| 4 | ตรวจ dependency + secret ที่หลุดเข้า git | พบช่องโหว่ระดับสูง · พบ secret | < 2 นาที |
| 5 | สร้าง artifact + ประทับเวอร์ชัน | — | < 2 นาที |
| 6 | deploy ลง staging | — | |
| 7 | integration + end-to-end test | test ตก | < 15 นาที |
| 8 | **ด่านคน** (เฉพาะ production) | ยังไม่มีคนกดอนุมัติ | |
| 9 | deploy ลง production | — | |
| 10 | ตรวจหลัง deploy | health check ไม่ผ่านจะ rollback อัตโนมัติ | < 2 นาที |

**ขั้น 1–5 คือ CI ต้องรันกับทุก pull request** ไม่ใช่เฉพาะตอน merge
**ขั้น 1–5 รวมกันควรจบใน 10 นาที** ถ้านานกว่านั้นคนจะเริ่มหาทางข้าม

---

## 2 · build ครั้งเดียว แล้วเลื่อนขั้น

```
commit → build → artifact v1.4.0+abc1234 ─┬→ staging  (ตัวนี้)
                                           ├→ uat      (ตัวเดิม)
                                           └→ production (ตัวเดิม)
```

- artifact คือไฟล์ที่ deploy ได้จริง: container image · ไฟล์ zip ที่ publish แล้ว · แพ็กเกจ
- **environment ต่างกันได้แค่ที่ config ตอนรัน** ไม่ใช่ build ใหม่
- เก็บ artifact ไว้ให้ย้อนกลับได้อย่างน้อย 30 วัน เพราะ rollback คือ deploy artifact เก่า ไม่ใช่ build ย้อนจาก commit เก่า

> ผิด: **`git pull` บนเครื่อง production แล้ว build ตรงนั้น** ทำให้ไม่มีใครรู้ว่าของที่รันอยู่คือ commit ไหน
> และ dependency ที่ดึงตอนนั้นอาจไม่ใช่ชุดเดียวกับที่ทดสอบ

---

## 3 · เวอร์ชันต้องไล่กลับไปหา commit ได้

ใช้ Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

| ขึ้นเลขไหน | เมื่อ |
|---|---|
| MAJOR | เปลี่ยนแล้วฝั่งที่เรียกใช้พัง (ดูตารางใน `api-conventions`) |
| MINOR | เพิ่มความสามารถ ของเดิมยังใช้ได้ |
| PATCH | แก้บั๊ก |

- **ยึด tag ใน git เป็นหลัก** · `v1.4.0` ชี้ commit เดียวเท่านั้น
- artifact แปะ commit hash ไว้ด้วย เช่น `1.4.0+abc1234`
- `/version` endpoint ต้องคืนค่าเดียวกันนี้ (ดู `web-service-essentials`) ส่วนแอปมือถือที่ไม่มี endpoint ให้แสดงในหน้า "เกี่ยวกับ" แทน
- **ยกเว้น Flutter / Android** ตัวเลขหลัง `+` ใน `pubspec.yaml` คือ versionCode ซึ่งต้องเป็นจำนวนเต็ม จึงใส่ hash ไม่ได้ (ดูหัวข้อ "แอป Android / Flutter")
- ก่อน 1.0.0 ใช้ `0.x` และถือว่ายังเปลี่ยนใหญ่ได้

---

## 4 · branch

| แบบ | วิธี | เหมาะกับ |
|---|---|---|
| **trunk-based** (แนะนำ) | branch อายุสั้น 1–2 วัน merge เข้า `main` บ่อย · งานที่ยังไม่เสร็จซ่อนไว้ด้วย feature flag | ทีมส่วนใหญ่ · ปล่อยของบ่อย |
| release branch | `main` + `release/1.4` สำหรับแก้ด่วน | ซอฟต์แวร์ที่ลูกค้าติดตั้งเอง · ต้องดูแลหลายเวอร์ชันพร้อมกัน |
| gitflow | `develop` + `feature` + `release` + `hotfix` | ปล่อยของเป็นรอบใหญ่ นาน ๆ ครั้ง · ส่วนใหญ่ซับซ้อนเกินจำเป็น |

**กฎที่ไม่ขึ้นกับแบบที่เลือก:**

- `main` ต้อง deploy ได้ตลอดเวลา
- ป้องกัน `main` ไว้ ให้ต้องผ่าน pull request และ CI เขียว ห้าม push ตรง
- branch ที่อายุเกิน 1 สัปดาห์ให้เตรียมเจอ merge conflict
- merge แล้วลบ branch ทันที (`gh pr merge --delete-branch`) · เปิด "Automatically delete head branches" ใน Settings → General ของ repo บน GitHub ให้ลบเองทุก PR · branch ที่ลบแล้วกู้จากหน้า PR ได้

---

## 5 · environment และด่าน

| environment | ข้อมูล | ใครกด deploy | ต้องผ่านอะไร |
|---|---|---|---|
| dev | ปลอม | อัตโนมัติทุก commit | build ผ่าน |
| staging | คล้ายจริง (ปิดบังแล้ว) | อัตโนมัติเมื่อ merge เข้า `main` | unit + integration |
| uat | คล้ายจริง | ทีมกด | ผู้ใช้ทดสอบผ่าน |
| production | จริง | **คนกดอนุมัติ** | ทุกอย่างข้างบน |

- staging ต้องใกล้เคียง production ให้มากที่สุด: เวอร์ชันฐานข้อมูล ระบบปฏิบัติการ ค่า config
- **ห้ามคัดลอกข้อมูลจริงลง staging โดยไม่ปิดบังข้อมูลส่วนบุคคล**
- ถ้ามี environment เดียวเพราะงบจำกัด ให้บอกตรง ๆ ในเอกสาร และใช้ feature flag ช่วยแทน

---

## 6 · secret ใน pipeline

- เก็บใน secret store ของแพลตฟอร์ม ไม่ใช่ในไฟล์ pipeline
- ให้สิทธิ์เท่าที่ขั้นนั้นต้องใช้ เช่น ขั้น build ไม่ต้องรู้รหัสฐานข้อมูล production
- pipeline ที่รันจาก fork ของคนนอก **ห้ามเห็น secret**
- ตัวตรวจ secret ที่หลุดเข้า git ต้องอยู่ในขั้นที่ 4 ไม่ใช่ตรวจปีละครั้ง

รายละเอียดทั้งหมดอยู่ใน `config-and-secrets`

---

## 7 · migration ฐานข้อมูลใน pipeline

```
deploy schema (ขยาย) → deploy โค้ด → ตรวจ → deploy schema (บีบ) รอบถัดไป
```

- migration รันเป็น**ขั้นของตัวเอง** ก่อน deploy โค้ด ไม่ใช่รันตอนแอปบูต
  (ถ้าแอปหลาย instance บูตพร้อมกัน migration จะรันชนกันจนข้อมูลพังได้)
- ใช้บัญชีที่แก้ schema ได้เฉพาะขั้นนี้ ส่วนบัญชีที่แอปใช้รันต้องแก้ schema ไม่ได้
- migration ต้องใช้ได้กับโค้ดเวอร์ชันก่อนหน้าด้วย ไม่งั้น rollback โค้ดแล้วระบบจะพัง
- สำรองข้อมูลก่อนเสมอ และ**ทดสอบว่ากู้คืนได้จริง**
- **ข้อยกเว้น: ฐานข้อมูลในเครื่องผู้ใช้** (SQLite · sqflite · drift บนมือถือ) ต้อง migrate ตอนแอปเปิด เพราะไม่มีทางอื่น
  กฎข้างบนใช้กับฐานข้อมูลบนเซิร์ฟเวอร์ที่หลาย instance ใช้ร่วมกัน ส่วน migration ในเครื่องต้องมี test ไล่จากทุกเวอร์ชัน schema ที่เคยปล่อย

วิธี expand/contract ดูที่ `database-design` ข้อ 9

---

## 8 · วิธีปล่อยของ

| วิธี | ทำงานยังไง | ต้องมี | เหมาะกับ |
|---|---|---|---|
| หยุดแล้วเปลี่ยน | ปิด → เปลี่ยน → เปิด | ไม่มี | ระบบภายใน · ปิดได้ตอนกลางคืน |
| **rolling** | ทยอยเปลี่ยนทีละเครื่อง | health check ที่เชื่อถือได้ · ใช้ร่วมกันได้ทั้ง 2 เวอร์ชัน | ค่าเริ่มต้นของระบบที่รันหลาย instance |
| blue-green | ยกชุดใหม่ขึ้นครบ แล้วสลับ traffic | ทรัพยากร 2 เท่าชั่วคราว | ต้อง rollback ได้ในไม่กี่วินาที |
| canary | ปล่อยให้ผู้ใช้ 5% ก่อน แล้วค่อยขยาย 5 → 25 → 100% ตามเกณฑ์ตัวเลขด้านล่าง | ตัวชี้วัดที่แยกตามเวอร์ชันได้ | ระบบใหญ่ · ความเสี่ยงสูง |

> **rolling มีเรื่องที่คนมักลืม** คือระหว่าง deploy เวอร์ชันเก่าและใหม่ให้บริการพร้อมกัน
> API และ schema จึงต้องใช้ได้กับทั้ง 2 เวอร์ชัน ถ้าไม่ได้ออกแบบเผื่อไว้ ผู้ใช้บางคนจะเจอ error ทุกครั้งที่ deploy

**เกณฑ์ขยาย canary (เป็นตัวเลข ตกลงก่อน deploy)** ใช้ burn rate (อัตราเผางบความผิดพลาด) ตามสูตรใน [`observability-basics`](../observability-basics/SKILL.md) หัวข้อ 4.1 โดยวัดเฉพาะทราฟฟิกของเวอร์ชันใหม่ ไม่คัดลอกสูตรมาไว้ที่นี่

| ขั้น | ทราฟฟิก | ค้างอย่างน้อย | ขยายต่อเมื่อ (ต้องผ่านทุกข้อ) |
|---|---|---|---|
| 1 | 5% | 30 นาที และมีคำขอไม่น้อยกว่า 1,000 รายการ | burn rate ช่วงสั้น < 1 · เวลาตอบ p95 (95th percentile latency) ไม่เกิน 1.2 เท่าของเวอร์ชันเดิม (ค่าตั้งต้น ยังไม่ได้วัด) · health check ผ่านทุกเครื่อง |
| 2 | 25% | 1 ชั่วโมง | เกณฑ์เดิมซ้ำ |
| 3 | 100% | เฝ้า 1 ชั่วโมงแรก | burn rate ช่วงสั้น < 1 |

ค้างและจำนวนคำขอขั้นต่ำเป็นค่าตั้งต้น ยังไม่ได้วัด ปรับตามทราฟฟิกจริง · ทราฟฟิกน้อยจนไม่ถึง 1,000 คำขอใน 30 นาที ให้ค้างนานขึ้นจนถึงจำนวนนั้น ไม่ลดเกณฑ์ · ระบบที่ไม่มี SLO (Service Level Objective เป้าหมายระดับบริการ) ใช้เกณฑ์แทน: error ของเวอร์ชันใหม่ ≤ max(2 เท่าของเวอร์ชันเดิม, เวอร์ชันเดิม + 0.5 จุดเปอร์เซ็นต์) (ค่าตั้งต้น ยังไม่ได้วัด)

**feature flag** (สวิตช์เปิดปิดฟีเจอร์) ช่วยแยก "ปล่อยโค้ด" ออกจาก "เปิดใช้ฟีเจอร์"

- merge โค้ดที่ยังไม่เสร็จเข้า `main` ได้ โดยปิด flag ไว้
- เปิดให้คนบางกลุ่มก่อน ปิดได้ทันทีโดยไม่ต้อง deploy
- 🚨 **flag ต้องมีวันหมดอายุ** เพราะ flag ที่ค้าง 1 ปีจะกลายเป็นโค้ด 2 เส้นทางที่ไม่มีใครกล้าลบ
  กำหนดให้ลบภายใน 2 sprint หลังเปิดใช้ 100%

---

## 9 · rollback

**เกณฑ์ที่ต้องกำหนดล่วงหน้า** ไม่ใช่มาตัดสินตอนทุกคนกำลังตกใจ แล้วเถียงกันว่าควรรอดูอีกหน่อยไหม · ใช้ burn rate จาก [`observability-basics`](../observability-basics/SKILL.md) หัวข้อ 4.1 แทน "error เกิน X%":

| เงื่อนไข (ทราฟฟิกของเวอร์ชันใหม่) | ทำ |
|---|---|
| burn rate ≥ 14.4 ทั้งช่วง 1 ชั่วโมงและ 5 นาที | rollback ทันที ไม่ต้องรอใคร |
| burn rate ≥ 6 ทั้งช่วง 6 ชั่วโมงและ 30 นาที | rollback และเปิดเหตุการณ์ |
| burn rate 1–6 | หยุดขยาย ค้างที่ขั้นเดิม ให้คนดู |
| เวลาตอบ p95 เกิน 2 เท่าของเวอร์ชันเดิมนาน 10 นาที (ค่าตั้งต้น ยังไม่ได้วัด) หรือ health check ไม่ผ่าน | rollback |

ตอน canary 5% ที่ช่วง 1 ชั่วโมงยังไม่เต็ม ให้ใช้ช่วงสั้น (5 นาที) กับเกณฑ์ 14.4 ได้ แต่ต้องมีคำขอครบจำนวนขั้นต่ำของขั้นนั้นก่อนจึงเชื่อตัวเลข

| ต้องมี | เกณฑ์ |
|---|---|
| คำสั่ง rollback | ทำได้ด้วยคำสั่งเดียว |
| เวลาที่ใช้ | ต่ำกว่า 5 นาที |
| **ซ้อมจริง** | อย่างน้อยไตรมาสละ 1 ครั้ง บน staging |
| ข้อมูล | migration ที่ทำไปแล้วต้องไม่ทำให้โค้ดเก่าพัง |

> **rollback ที่ไม่เคยซ้อม เท่ากับไม่มี rollback** เพราะจะรู้ว่าใช้ไม่ได้ก็ตอนที่ต้องใช้พอดี

---

## 10 · pipeline ต้องเร็วและน่าเชื่อถือ

| ปัญหา | วิธีแก้ |
|---|---|
| ช้า | แคช dependency · รัน test พร้อมกันหลายชุด · แยก test ที่ช้าไปรันกลางคืน |
| test ที่ผลไม่คงที่ (flaky) | **แยกออกทันที** แล้วเปิดงานตามแก้ เพราะ test ที่ตกบ้างผ่านบ้างทำให้คนเลิกอ่านผล |
| ทุกคนรอคิว | เพิ่มตัวรัน · ให้ pull request รันเฉพาะส่วนที่เกี่ยวข้อง |
| build ไม่เหมือนเดิมทุกครั้ง | ล็อกเวอร์ชัน dependency (lock file) · ปักหมุดเวอร์ชัน image ด้วย digest |

**ตัวชี้วัดที่ควรดู:** ปล่อยของบ่อยแค่ไหน · จาก commit ถึงขึ้นจริงใช้เวลาเท่าไร ·
deploy แล้วพังกี่เปอร์เซ็นต์ · กู้คืนใช้เวลาเท่าไร

**อาการที่เจอบ่อยและจุดแรกที่ดู** (แนวคิดจาก wshobson deployment-pipeline-design)

| อาการ | ดูตรงนี้ก่อน |
|---|---|
| ผ่านบนเครื่อง ตกบน CI | lock file ไม่ได้ commit · ตัวแปรสภาพแวดล้อมที่มีแค่ในเครื่อง · ชื่อไฟล์ตัวพิมพ์ใหญ่เล็ก (Linux แยก) · time zone ของ runner เป็น UTC |
| ตกเป็นบางครั้ง | test ที่ผลไม่คงที่ (แถวบน) · job ที่รันพร้อมกันแย่ง port หรือฐานข้อมูลเดียวกัน · runner หน่วยความจำไม่พอ |
| ช้าขึ้นทุกสัปดาห์ | cache key เปลี่ยนทุกครั้งจึงไม่เคยโดน · image ไม่ pin จึง pull ใหม่ · test ชุดเดียวโตไม่แยก |
| deploy เขียว แต่ของบนเซิร์ฟเวอร์ไม่เปลี่ยน | ใช้ artifact หรือ tag `latest` ตัวเก่าซ้ำ · cache ของ CDN หรือ reverse proxy · instance เก่ายังรับ traffic |
| permission denied หรือ secret ว่างบน branch หรือ PR | PR จาก fork ไม่ได้ secret · environment protection rule · token หมดอายุหรือ scope ไม่พอ |

---

## แอป Android / Flutter — ข้อที่ต่างจากเซิร์ฟเวอร์

| เรื่อง | กฎ |
|---|---|
| เลขเวอร์ชัน | `pubspec.yaml` `version: X.Y.Z+N` · `X.Y.Z` ตาม SemVer · **`N` คือ versionCode เป็นจำนวนเต็มที่ขึ้นอย่างเดียว** (เช่นเลขรอบของ CI) · commit hash ส่งผ่าน `--dart-define=GIT_SHA=<hash>` แล้วแสดงในหน้า "เกี่ยวกับ" |
| build ครั้งเดียว | `flutter build appbundle --release` ได้ Android App Bundle (AAB) ไฟล์เดียว แล้วเลื่อนไฟล์เดิมผ่าน track ของ Play: internal → closed → production · ไม่ build ใหม่ต่อ track |
| ปล่อยทีละส่วน | production ใช้ staged rollout เป็น % (เช่น 5 → 20 → 50 → 100) แทน canary ของเซิร์ฟเวอร์ · track ของ Play แทน environment ในข้อ 5 |
| rollback | **ย้อนเวอร์ชันบน Play ไม่ได้** เพราะ versionCode ลดไม่ได้ และเครื่องที่ติดตั้งแล้วไม่ถอยกลับ ให้หยุด rollout (halt) แล้วปล่อยตัวแก้ที่ versionCode สูงกว่า และซ้อมขั้นตอนนี้แทนข้อ 9 |
| กุญแจเซ็น | upload key เก็บใน secret store ของ CI เป็น base64 + รหัสผ่านแยกเป็น secret · `android/key.properties` และ `*.jks` อยู่ใน `.gitignore` · **สำรองกุญแจไว้นอก CI อย่างน้อย 1 ที่** ถ้าทำหายจะอัปเดตแอปไม่ได้จนกว่าจะขอ Play support รีเซ็ต (ใช้ Play App Signing ให้ Google ถือกุญแจจริง) |

---

## 11 · Anti-patterns

- **build ใหม่ตอนขึ้น production** ทำให้ของที่ทดสอบไม่ใช่ของที่ปล่อย
- **deploy ด้วยมือตามขั้นตอนใน Word** · วันไหนคนเขียนลาป่วย วันนั้น deploy ไม่ได้
- **secret ในไฟล์ pipeline** · ใครอ่านโค้ดได้ก็อ่าน secret ได้
- **test ตกแล้วปล่อยผ่าน** ทำครั้งเดียว คนก็เลิกเชื่อผลไปตลอด
- **deploy วันศุกร์เย็น** ในทีมที่ยัง rollback ไม่ได้ด้วยคำสั่งเดียว
- **migration ของฐานข้อมูลบนเซิร์ฟเวอร์รันตอนแอปบูต** · หลาย instance ชนกัน (ฐานข้อมูลในเครื่องมือถือยกเว้น ดูข้อ 7)
- **ไม่มี artifact เก็บไว้** ทำให้ rollback กลายเป็นการ build ย้อนจาก commit เก่า
- **environment ที่ config ต่างกันจนคาดเดาไม่ได้** · "บน staging ผ่านนะ"
- **feature flag ที่ไม่มีวันลบ**
- **pipeline ใช้เวลา 45 นาที** คนจะเริ่ม merge โดยไม่รอผล


## reference: deployment-plan-template.md

# แม่แบบแผน deploy

เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Output: Polished Deployment Plan

```markdown
# Deployment Plan: <Release vX.Y.Z>

| | |
|--|--|
| **Release** | vX.Y.Z |
| **Type** | Routine \| Major \| Hotfix |
| **Status** | Planned |
| **Deploy Lead** | @name |
| **Maintenance Window** | YYYY-MM-DD HH:MM-HH:MM UTC |
| **Expected Downtime** | Zero / 5 min |

---

## Pre-Deployment Checklist

| # | Item | Owner | Status |
|:-:|------|:------|:------:|
| 1 | All tests passing in CI | @dev | Done |
| 2 | Security scan passed | @security | Done |
| 3 | Database migrations reviewed | @dba | Pending |
| 4 | Rollback plan documented | @devops | Pending |
| 5 | Stakeholders notified | @pm | Pending |
| 6 | On-call engineer briefed | @oncall | Pending |
| 7 | Status page prepared | @devops | Pending |

## Deployment Flow

_[รูปขั้นตอน deploy: Tag release → CI สุดท้าย → ผ่านทั้งหมด? (ไม่ผ่าน = หยุดและตรวจ) → canary 5% → ปกติหลัง 10 นาที? (ไม่ = rollback) → 50% → ปกติ? (ไม่ = rollback) → 100% → smoke test → เสร็จ. วาดด้วย skill `diagram-figures`]_

## Deployment Steps

| Step | Action | Command/Link | Owner |
|:----:|--------|--------------|:------|
| 1 | Tag release | `git tag vX.Y.Z && git push --tags` | @devops |
| 2 | Trigger CD pipeline | [Pipeline link](#) | @devops |
| 3 | Deploy canary | Auto via pipeline | — |
| 4 | Monitor canary | [Grafana](#) | @oncall |
| 5 | Approve full deploy | Slack `/deploy approve` | @lead |
| 6 | Verify production | Smoke test suite | @qa |

## Verification

### Health Checks
- [ ] `/health` returns 200
- [ ] All pods/instances running
- [ ] Database connections OK
- [ ] No spike in 5xx errors (Grafana dashboard X)

### Smoke Tests
- [ ] User login works
- [ ] Critical user journey #1 works
- [ ] Critical API endpoints return expected response

### Key Metrics (15 min post-deploy)
| Metric | Baseline | Threshold | Current |
|--------|---------:|----------:|--------:|
| p95 latency | 150ms | < 200ms | — |
| Error rate | 0.1% | < 0.5% | — |
| Throughput | 1000 RPS | > 800 RPS | — |

## Rollback Plan

> **Triggers:** Any of the following requires immediate rollback
> - 5xx error rate > 2% sustained for 5 min
> - p95 latency > 500ms sustained for 5 min
> - Customer-impacting bug confirmed

### Rollback Steps
1. Run: `./scripts/rollback.sh vX.Y.Z-1`
2. Verify health checks
3. Post in #incidents channel
4. Schedule post-mortem within 48h

## Post-Deployment

- Monitor for 1 hour post-deploy
- Update changelog with release notes
- Send announcement to #releases
- Close release ticket
```


## reference: per-platform.md

# ไฟล์ pipeline ตั้งต้น แยกตามแพลตฟอร์ม

**สารบัญ:** 1 GitHub Actions · 2 Azure DevOps · 3 GitLab CI · 4 Dockerfile หลายขั้น · 5 ตารางเทียบความสามารถ

1. [GitHub Actions](#1--github-actions)
2. [Azure DevOps](#2--azure-devops)
3. [GitLab CI](#3--gitlab-ci)
4. [Dockerfile หลายขั้น](#4--dockerfile-หลายขั้น)
5. [ตารางเทียบความสามารถ](#5--ตารางเทียบความสามารถ)

---

## 1 · GitHub Actions

`.github/workflows/ci.yml` รันทุก pull request

```yaml
name: ci
on:
  pull_request:
  push: { branches: [main] }

concurrency:                       # ยกเลิกรอบเก่าเมื่อ push ซ้ำ
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions: { contents: read }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }   # ต้องมีประวัติครบเพื่อคำนวณเวอร์ชัน

      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --coverage

      - name: ตรวจ dependency
        run: npm audit --audit-level=high

      - name: ตรวจ secret รั่วใน repo
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }} # ต้องมีเมื่อ repo เป็นของ organization · บัญชีส่วนตัวไม่ต้อง (README gitleaks-action · ตรวจ 22 ต.ค. 2569)

      - uses: actions/upload-artifact@v4
        with:
          name: app-${{ github.sha }}
          path: dist/
          retention-days: 30
```

`.github/workflows/deploy.yml` เอา artifact ตัวเดิมจาก ci ไป deploy ต่อทีละ environment

```yaml
name: deploy
on:
  workflow_run:
    workflows: [ci]
    types: [completed]
    branches: [main]

jobs:
  staging:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4             # scripts/deploy.sh มาจาก repo
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
      - uses: actions/download-artifact@v4    # ตัว build มาจาก artifact (dist/)
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh staging

  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production        # ← ตั้ง required reviewers ที่นี่ = ด่านคน
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
      - uses: actions/download-artifact@v4   # artifact ตัวเดียวกับ staging
        with:
          name: app-${{ github.event.workflow_run.head_sha }}
          run-id: ${{ github.event.workflow_run.id }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - run: ./scripts/deploy.sh production
      - name: ตรวจหลัง deploy
        run: |
          for i in $(seq 1 10); do
            curl -fsS https://api.example.co/health/ready && exit 0
            sleep 6
          done
          ./scripts/rollback.sh && exit 1
```

**ข้อควรระวัง:**

- `pull_request_target` เห็น secret และรันโค้ดจาก fork จึง**อย่าใช้** เว้นแต่รู้จริงว่ากำลังทำอะไร
- ตั้ง `permissions` ให้แคบที่สุดในทุก workflow เพราะบางองค์กรตั้งค่าเริ่มต้นให้เขียนได้ทั้ง repo
- เวอร์ชันในตัวอย่าง (`@v4`, Node 22, .NET 8.x) เป็นแค่ตัวอย่าง ตรวจเวอร์ชันล่าสุดก่อนใช้ (รอยืนยัน)
- ปักหมุด action อย่างน้อยด้วย tag เวอร์ชัน (`@v4`) ถ้าต้องการเข้มงวดให้ปักด้วย commit hash
- `environment:` คือที่ตั้งผู้อนุมัติ (required reviewers) และ secret เฉพาะ environment

---

## 2 · Azure DevOps

`azure-pipelines.yml`

```yaml
trigger:
  branches: { include: [main] }

variables:
  buildConfiguration: Release

stages:
- stage: build
  jobs:
  - job: build
    pool: { vmImage: ubuntu-latest }
    steps:
    - task: UseDotNet@2
      inputs: { version: '8.x' }
    - script: dotnet restore
    - script: dotnet build -c $(buildConfiguration) --no-restore
    - script: dotnet test -c $(buildConfiguration) --no-build --collect:"XPlat Code Coverage"
    - script: dotnet publish -c $(buildConfiguration) -o $(Build.ArtifactStagingDirectory) --no-build
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: app

- stage: staging
  dependsOn: build
  jobs:
  - deployment: staging
    environment: staging
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app
          - script: ./scripts/deploy.sh staging

- stage: production
  dependsOn: staging
  jobs:
  - deployment: production
    environment: production        # ← ตั้ง approval ที่หน้า Environments
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: app          # artifact ตัวเดิมจาก stage build
          - script: ./scripts/deploy.sh production
```

- `deployment` job ต่างจาก `job` ธรรมดาตรงที่ผูกกับ environment จึงได้ประวัติการ deploy และขั้นอนุมัติมาด้วย
- ตัวแปรลับเก็บใน variable group ที่ผูกกับ Azure Key Vault อย่าพิมพ์ลงไฟล์
- ตัวแปรลับ**ไม่ถูกส่งเข้า script เอง** ต้อง map ผ่าน `env:` ทีละตัว

---

## 3 · GitLab CI

`.gitlab-ci.yml`

```yaml
stages: [test, build, deploy]

default:
  interruptible: true

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  key: { files: [requirements.txt] }
  paths: [.cache/pip]

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - ruff check .
    - pytest --cov --cov-fail-under=70
  coverage: '/TOTAL.*\s+(\d+%)$/'

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - echo "$CI_JOB_TOKEN" | docker login -u "$CI_REGISTRY_USER" --password-stdin "$CI_REGISTRY"
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:staging:
  stage: deploy
  environment: { name: staging, url: https://staging.example.co }
  script: ./scripts/deploy.sh staging $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy:production:
  stage: deploy
  environment: { name: production, url: https://example.co }
  when: manual                     # ← ด่านคน
  script: ./scripts/deploy.sh production $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

- ตั้งตัวแปรลับเป็น `Masked` และ `Protected` ที่หน้า Settings → CI/CD
- `when: manual` ใช้คู่กับ protected environment จึงจะเป็นด่านอนุมัติที่กันได้จริง

---

## 4 · Dockerfile หลายขั้น

```dockerfile
# ---- ขั้น build ----
FROM node:22-alpine AS build
WORKDIR /src
COPY package*.json ./
# ชั้นนี้ถูกแคชตราบใดที่ lock file ไม่เปลี่ยน
RUN npm ci
COPY . .
RUN npm run build

# ---- ขั้นรัน ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /src/dist ./dist
COPY --from=build /src/node_modules ./node_modules
# อย่ารันเป็น root
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/healthcheck.js
CMD ["node", "dist/main.js"]
```

**กฎ:**

- คัดลอกไฟล์ที่เปลี่ยนน้อยก่อน ชั้นแรก ๆ จะได้ใช้แคชซ้ำ
- อย่าคัดลอก `.env`, `.git`, `node_modules` เข้า image ให้กันไว้ด้วย `.dockerignore`
- ถ้าต้องการให้ build ได้ผลเดิมทุกครั้ง ให้ปักหมุด base image ด้วย digest
- ตั้งชื่อ tag ด้วย commit hash เสมอ ส่วน `latest` ใช้เป็นชื่อเล่นได้ แต่ห้าม deploy ด้วย `latest`

---

## 5 · ตารางเทียบความสามารถ

| สิ่งที่ต้องการ | GitHub Actions | Azure DevOps | GitLab CI |
|---|---|---|---|
| ด่านอนุมัติโดยคน | Environment + required reviewers | Environment approvals | `when: manual` + protected env |
| เก็บ artifact | `upload/download-artifact` | `publish` / `download` | `artifacts:` |
| แคช dependency | `actions/cache` หรือ `cache:` ใน setup | `Cache@2` | `cache:` |
| secret ต่อ environment | Environment secrets | Variable group + Key Vault | ตัวแปร Protected ต่อ environment |
| ยกเลิกรอบเก่า | `concurrency` | `batch: true` (รวม trigger ระหว่างรอบที่รันอยู่ ไม่ได้ยกเลิกรอบเก่า) | `interruptible: true` |
| วิ่งขนาน | `strategy.matrix` | `strategy.matrix` | `parallel:` |
| รันเอง (self-hosted) | ได้ | ได้ | ได้ |

> **ทุกแพลตฟอร์มทำสิ่งเดียวกันได้** จึงอย่าเลือกจากรายการความสามารถ
> เลือกตัวที่อยู่ที่เดียวกับ repo แล้วลงแรงกับเนื้อหาของ pipeline แทน


---

# skill: config-and-secrets

Use when settings differ by environment or something must never be committed (keys, connection strings).

# Config และ Secret

> **กฎ 2 ข้อ:**
> 1. โค้ดชุดเดียวกันต้องรันได้ทุก environment ความต่างอยู่ที่ config เท่านั้น
> 2. secret ต้องไม่อยู่ใน git ไม่อยู่ใน log และไม่อยู่ในไฟล์ที่ส่งไปให้เบราว์เซอร์

## เมื่อไหร่ใช้ skill นี้

- เริ่มโปรเจกต์ หรือเพิ่ม environment ใหม่
- ต้องเก็บ connection string, API key, ใบรับรอง, กุญแจสำหรับเซ็น
- เจอค่าคงที่ฝังอยู่ในโค้ด (hardcode) แล้วต้องย้ายออก
- secret หลุดเข้า git หรือสงสัยว่าหลุด ให้ไปข้อ 8 ทันที

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| เก็บ secret ใน pipeline · ด่านอนุมัติ | `cicd-and-release` | แทน |
| ค่าลับใน Jenkinsfile (`withCredentials` · single quote) | `jenkins-pipeline` | คู่ |
| Secret ของ Kubernetes ไม่อยู่ใน values.yaml (External Secrets · SealedSecret) | `kubernetes-helm` | คู่ |
| ออกแบบ login, token, สิทธิ์ผู้ใช้ | `auth-implementation-patterns` | แทน |
| กันไม่ให้ค่าอ่อนไหวโผล่ใน log | `logging-standards` | แทน |
| connection string ของฐานข้อมูล | `database-design` | คู่ |
| บันทึกเหตุการณ์หลัง secret หลุด | `postmortem-template` | คู่ |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |

**วิธีทำจริงในแต่ละภาษาและเฟรมเวิร์ก** อยู่ใน `references/per-stack.md`

---

## 1 · แยก config กับ secret ให้ออกก่อน

| | config | secret |
|---|---|---|
| ตัวอย่าง | ที่อยู่ API, ระดับ log, จำนวนต่อหน้า, โซนเวลา, feature flag | รหัสผ่านฐานข้อมูล, API key, กุญแจเซ็น token, ใบรับรอง |
| อยู่ใน git ได้ | ✓ ได้ | ✗ ไม่ได้เด็ดขาด |
| ใครเห็นได้ | ทั้งทีม | เฉพาะที่จำเป็น |
| หลุดแล้วเป็นไร | ไม่เป็นไร | ต้องเพิกถอนและเปลี่ยนทันที |
| เปลี่ยนบ่อย | ตามงาน | ตามรอบหมุนเวียน |

> **ถ้าตัดสินใจไม่ได้ว่าเป็นแบบไหน ให้ถือว่าเป็น secret** เพราะระวังเกินไปเสียแค่ความรำคาญเล็กน้อย
> แต่ถ้าเดาผิด กุญแจจะอยู่ในประวัติ git ตลอดไป

---

## 2 · ลำดับความสำคัญ — ค่าหลังทับค่าก่อน

```
1. ค่าเริ่มต้นในโค้ด        (ปลอดภัย ใช้ได้จริงสำหรับ dev)
2. ไฟล์ config ตาม environment  (appsettings.Production.json, config/production.yaml)
3. ตัวแปรสภาพแวดล้อม        (environment variable)
4. secret store              (Key Vault, Secrets Manager, Kubernetes secret)
5. อาร์กิวเมนต์ตอนสั่งรัน     (ใช้ตอนไล่ปัญหาเท่านั้น)
```

**ค่าเริ่มต้นต้องปลอดภัย** ถ้าลืมตั้งค่า ระบบต้องทำงานแบบเข้มงวดที่สุด
เช่น `DEBUG=false` · `ALLOWED_ORIGINS=` ว่าง · เปิด Transport Layer Security (TLS) ไม่ใช่ตรงกันข้าม

---

## 3 · ตรวจตอนบูต — ขาดค่าไหนให้ตายทันที

> 🚨 ข้อนี้คุ้มที่สุดในหน้านี้
> ระบบที่บูตขึ้นมาได้ทั้งที่ config ผิด จะไปพังตอนตี 2 ในฟังก์ชันที่นาน ๆ ใช้ที
> ระบบที่ **ไม่ยอมบูต** เมื่อ config ผิด ทำให้รู้ตั้งแต่ตอน deploy ซึ่งยัง rollback ได้

```ts
// Node — zod
const Env = z.object({
  NODE_ENV:      z.enum(['development', 'staging', 'production']),
  PORT:          z.coerce.number().int().positive().default(3000),
  DATABASE_URL:  z.string().url(),
  JWT_SECRET:    z.string().min(32),
  LOG_LEVEL:     z.enum(['debug','info','warn','error']).default('info'),
});

export const env = Env.parse(process.env);   // ผิด = process ตายพร้อมบอกว่าตัวไหนผิด
```

**สิ่งที่ต้องตรวจ:** มีค่าครบ · ชนิดถูก · อยู่ในช่วงที่ยอมรับ ·
กุญแจยาวพอ · ค่าที่ห้ามใช้บน production (`JWT_SECRET=dev-secret` ต้องไม่ผ่าน)

**พิมพ์สรุป config ตอนบูต**: ชื่อค่า และค่าที่ไม่ใช่ secret
ส่วน secret พิมพ์แค่ "มีค่าแล้ว" หรือ 4 ตัวท้าย ไม่พิมพ์ค่าเต็ม

---

## 4 · ตั้งชื่อตัวแปรสภาพแวดล้อม

```
<ระบบ>_<กลุ่ม>_<ชื่อ>

APP_DB_HOST          APP_DB_PASSWORD
APP_REDIS_URL        APP_SMTP_PASSWORD
APP_FEATURE_NEW_CHECKOUT
```

| กฎ | เหตุผล |
|---|---|
| ตัวพิมพ์ใหญ่ ขีดล่าง | ข้อตกลงของทุกระบบปฏิบัติการ |
| มีคำนำหน้าของระบบ | กัน `PATH`, `HOME`, `USER` ของระบบชนกัน |
| ชื่อเดียวกันทุก environment | ค่าต่างได้ แต่ชื่อห้ามต่าง ไม่งั้นย้าย environment ทีไรต้องแก้โค้ด |
| ใส่หน่วยในชื่อ | `APP_TIMEOUT_SECONDS` ไม่ใช่ `APP_TIMEOUT` |
| อย่าใส่ชื่อ environment ในชื่อตัวแปร | ✗ `APP_PROD_DB_HOST` |

---

## 5 · `.env` และ `.env.example`

| ไฟล์ | อยู่ใน git | หน้าที่ |
|---|:--:|---|
| `.env.example` | ✓ | รายชื่อค่าที่ต้องมี **ทั้งหมด** พร้อมคำอธิบาย และค่าตัวอย่างที่ไม่ใช่ของจริง |
| `.env` | ✗ | ค่าจริงบนเครื่องนักพัฒนาแต่ละคน |
| `.env.production` | ✗ | **ไม่ควรมีไฟล์นี้เลย** เพราะ production ใช้ secret store |

```bash
# .gitignore
.env
.env.*
!.env.example
```

```bash
# .env.example
APP_DB_HOST=localhost              # ที่อยู่ฐานข้อมูล
APP_DB_PASSWORD=change-me          # ❗ ค่าจริงอยู่ใน 1Password ห้องทีม
APP_JWT_SECRET=                    # ❗ สร้างด้วย: openssl rand -base64 48
APP_LOG_LEVEL=debug
```

**`.env.example` ต้องอัปเดตในคอมมิตเดียวกับที่เพิ่มค่าใหม่**
ไม่งั้นคนถัดไปที่ clone จะเจอ error ที่ไม่มีใครอธิบายได้

> 🚨 **`.env` ที่ใส่ `.gitignore` ไม่ทัน**: ไฟล์ถูก track ไปแล้วแม้ครั้งเดียว
> การเพิ่มใน `.gitignore` ทีหลัง**ไม่ลบมันออกจากประวัติ** ต้อง `git rm --cached` และถือว่า secret หลุดแล้ว

**ด่านก่อน commit** (แนวคิดจาก wshobson secrets-management): `.gitignore` กันแค่ไฟล์ที่รู้ชื่อ แต่กุญแจที่เผลอวางในโค้ดหรือ YAML ต้องมีตัวสแกน — ติดตั้ง gitleaks เป็น pre-commit hook ของทุก repo (`gitleaks git --pre-commit --staged` ใน gitleaks 8.19 ขึ้นไป · รุ่นก่อนหน้าใช้ `gitleaks protect --staged`) และรันซ้ำใน CI ทั้งประวัติด้วย `gitleaks git --redact` · hook ตกแล้วห้าม `--no-verify` ให้ย้ายค่าออกก่อน · เจอใน history แล้วไปข้อ 8 ทันที ไม่ใช่แค่ลบบรรทัด

---

## 6 · เก็บ secret ไว้ที่ไหน

| สถานการณ์ | ใช้ | หมายเหตุ |
|---|---|---|
| เครื่องนักพัฒนา | `.env` ที่ไม่เข้า git ส่วน .NET ใช้ `dotnet user-secrets` | ห้ามใช้ค่าของ production |
| ทีมเล็ก แชร์กัน | ตัวจัดการรหัสผ่านของทีม (1Password, Bitwarden) | ไม่ใช่แชต ไม่ใช่อีเมล ไม่ใช่ Google Sheet |
| production บนคลาวด์ | Azure Key Vault · AWS Secrets Manager · Google Secret Manager | ให้สิทธิ์ด้วย managed identity ไม่ใช่ key อีกอัน |
| Kubernetes | External Secrets Operator ดึงจาก vault ข้างบน | secret ของ Kubernetes เองเป็นแค่ base64 **ไม่ใช่การเข้ารหัส** |
| ต้องเก็บใน git จริง ๆ | SOPS หรือ sealed-secrets (เข้ารหัสก่อน commit) | ทางเลือกสุดท้าย |

**สิทธิ์:** แต่ละ service อ่านได้เฉพาะ secret ของตัวเอง environment แยกกันสนิท และ
ไม่มีบัญชีไหนอ่านได้ทุกอัน ยกเว้นบัญชีดูแลระบบที่บันทึกการเข้าถึง

---

## 7 · การหมุนเวียน (rotation)

**ออกแบบให้รองรับตั้งแต่วันแรก** ไม่ใช่รอถึงตอนต้องหมุนจริง

| ต้องมี | รายละเอียด |
|---|---|
| ใช้ 2 ค่าพร้อมกันได้ | ระหว่างเปลี่ยน ทั้งค่าเก่าและใหม่ต้องใช้ได้ ไม่งั้นต้องปิดระบบ |
| โหลดใหม่โดยไม่ต้อง restart | หรือยอมรับว่าต้อง deploy 1 รอบ และจดไว้ว่าต้องทำ |
| รอบเวลา | กุญแจเซ็น token 90 วัน · รหัสฐานข้อมูล 180 วัน · ใบรับรองก่อนหมดอายุ 30 วัน |
| ทำอัตโนมัติ | เพราะงานที่ต้องจำทำเอง สุดท้ายไม่มีใครทำ |

**กุญแจสำหรับเซ็น token ต้องมี id กำกับ (key id)** เพื่อให้เซ็น token ใหม่ด้วยกุญแจใหม่แล้ว
ก็ยังตรวจ token เก่าที่ยังไม่หมดอายุได้

---

## 8 · เมื่อ secret หลุด — ลำดับสำคัญกว่าความเร็ว

1. **เพิกถอนค่าเดิมก่อน**: ปิด key นั้นที่ต้นทาง
2. ออกค่าใหม่ แล้ว deploy
3. ตรวจ log ย้อนหลังว่ามีใครใช้จากที่ที่ไม่ใช่ของเราไหม
4. ลบออกจากประวัติ git (`git filter-repo`) และแจ้งทุกคนให้ clone ใหม่ (ถ้าต้อง force push ให้รอผู้ใช้อนุมัติก่อน · แจ้งทีมก่อน)
5. บันทึกเหตุการณ์ด้วย `postmortem-template`

> 🚨 **ข้อ 4 ไม่ใช่ข้อ 1** เพราะลบ commit แล้วกุญแจก็ไม่ปลอดภัยขึ้นเลย
> ใครที่ fork หรือ clone ไปแล้ว รวมถึงข้อมูลสำรองของผู้ให้บริการ ยังมีค่าเดิมอยู่
> **ถือว่าทุก secret ที่เคยเข้า git คือหลุดแล้ว** แม้ repo จะเป็น private

---

## 9 · อย่าให้ secret ไหลออกทางอื่น

| ทางรั่ว | วิธีปิด |
|---|---|
| log | รายการคำที่ต้องปิดบัง ดูที่ `logging-standards` |
| ข้อความ error ที่ส่งให้ client | คืนเฉพาะ `requestId` ไม่ใช่ stack trace หรือ connection string |
| รายงาน crash / ตัวติดตามข้อผิดพลาด | ตั้งตัวกรองข้อมูลอ่อนไหวก่อนส่งออก |
| ประวัติคำสั่งใน shell | ใช้ `read -s` หรืออ่านจากไฟล์ แทนการพิมพ์ค่าลงบรรทัดคำสั่ง |
| `docker history` | อย่าใส่ secret ใน `ARG`/`ENV` ตอน build ให้ใช้ mount ตอนรันแทน |
| ไฟล์สำรองข้อมูลและ dump | เข้ารหัส และเก็บที่ที่คุมสิทธิ์ได้ |
| ภาพหน้าจอในเอกสารและ issue | ปิดบังก่อนแนบเสมอ |

---

## 10 · config ของ frontend — ไม่มีอะไรลับ

> 🚨 ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด **คือข้อมูลสาธารณะ**
> ไม่ว่าจะชื่อว่า `VITE_SECRET_KEY` หรืออยู่ในไฟล์ที่ถูกย่อจนอ่านไม่ออกก็ตาม
> การย่อโค้ดไม่ใช่การเข้ารหัส เปิด DevTools ก็เห็น

| ใส่ใน frontend ได้ | ต้องอยู่ฝั่งเซิร์ฟเวอร์เท่านั้น |
|---|---|
| ที่อยู่ API · ชื่อ environment | API key ของบริการภายนอกทุกชนิด |
| กุญแจสาธารณะ (publishable key) ของผู้ให้บริการชำระเงิน | กุญแจลับ (secret key) ของผู้ให้บริการเดียวกัน |
| feature flag ที่ไม่ลับ | กฎการคิดราคา · เกณฑ์อนุมัติ |
| รหัสเว็บของตัววัดสถิติ | token ที่เรียก API ของบุคคลที่สาม |

**ถ้าต้องการเปลี่ยนค่าโดยไม่ build ใหม่** ให้โหลด `/config.json` ตอนแอปเริ่มทำงาน
แทนการฝังค่าตอน build (`import.meta.env`) ที่ล็อกค่าติดไปกับไฟล์ที่ build ได้

---

## 11 · Anti-patterns

- **connection string ในโค้ด** แม้จะเป็นของ dev เพราะสักวันจะมีคนลอกแบบนี้ไปใช้กับ production
- **`.env` ของ production วางไว้บนเซิร์ฟเวอร์** ใครเข้าเครื่องได้ก็อ่านได้ และไม่มีบันทึกว่าใครอ่าน
- **secret เดียวกันทุก environment** พอ staging หลุด production ก็หลุดด้วย
- **ส่ง secret ทางแชตหรืออีเมล** ค่าจะอยู่ในนั้นตลอดไป และค้นเจอด้วย
- **ไม่มี `.env.example`** คนใหม่จะเสียเวลาครึ่งวันเดาว่าต้องมีค่าอะไรบ้าง
- **บูตผ่านทั้งที่ config ไม่ครบ** แล้วไปพังตอนใช้งานจริง
- **พิมพ์ config ทั้งก้อนลง log ตอนบูต** รวม secret
- **`ALLOWED_ORIGINS=*` บน production** เพราะ "ตอน dev มันติด Cross-Origin Resource Sharing (CORS)"
- **กุญแจที่ไม่เคยเปลี่ยนเลยตั้งแต่ปีแรก**


## reference: per-stack.md

# วิธีทำจริงแยกตามภาษาและเฟรมเวิร์ก

**สารบัญ:** 1 .NET / ASP.NET Core · 2 Node.js · 3 Python · 4 Angular และ frontend ทั่วไป · 5 Docker และ Kubernetes · 6 เครื่องมือตรวจ secret ที่หลุดเข้า git · 7 คำสั่งสร้างค่าสุ่มที่ปลอดภัย

1. [.NET / ASP.NET Core](#1--net--aspnet-core)
2. [Node.js](#2--nodejs)
3. [Python](#3--python)
4. [Angular และ frontend ทั่วไป](#4--angular-และ-frontend-ทั่วไป)
5. [Docker และ Kubernetes](#5--docker-และ-kubernetes)
6. [เครื่องมือตรวจ secret ที่หลุดเข้า git](#6--เครื่องมือตรวจ-secret-ที่หลุดเข้า-git)
7. [คำสั่งสร้างค่าสุ่มที่ปลอดภัย](#7--คำสั่งสร้างค่าสุ่มที่ปลอดภัย)

---

## 1 · .NET / ASP.NET Core

**บนเครื่องนักพัฒนา เก็บนอกโฟลเดอร์โปรเจกต์ จึงไม่มีทางเข้า git:**

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;..."
dotnet user-secrets list
```

**ตรวจตอนบูต:**

```csharp
public sealed class AppOptions
{
    public const string Section = "App";

    [Required, Url]                       public string ApiBaseUrl { get; init; } = "";
    [Required, MinLength(32)]             public string JwtSecret  { get; init; } = "";
    [Range(1, 300)]                       public int TimeoutSeconds { get; init; } = 30;
}

builder.Services
    .AddOptions<AppOptions>()
    .Bind(builder.Configuration.GetSection(AppOptions.Section))
    .ValidateDataAnnotations()
    .ValidateOnStart();                   // ← ขาดค่า = แอปไม่ยอมบูต
```

**ลำดับที่ ASP.NET Core อ่าน (ค่าหลังทับค่าก่อน):**

```
appsettings.json → appsettings.{Environment}.json → user-secrets (dev)
→ environment variable → อาร์กิวเมนต์บรรทัดคำสั่ง
```

ตัวแปรสภาพแวดล้อมใช้ `__` แทนลำดับชั้น เช่น `ConnectionStrings__Default`

**Azure Key Vault:**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{vaultName}.vault.azure.net/"),
    new DefaultAzureCredential());        // ใช้ managed identity ไม่ต้องมี key อีกอัน
```

---

## 2 · Node.js

```ts
// config/env.ts — ไฟล์เดียวที่แตะ process.env ได้ทั้งโปรเจกต์
import { z } from 'zod';

const Env = z.object({
  NODE_ENV:     z.enum(['development','test','staging','production']),
  PORT:         z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  SMTP_PASSWORD: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production' && v.JWT_SECRET.startsWith('dev-'))
    ctx.addIssue({ code: 'custom', message: 'ห้ามใช้ JWT_SECRET ของ dev บน production' });
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('config ไม่ถูกต้อง:', z.treeifyError(parsed.error));
  process.exit(1);
}
export const env = parsed.data;
```

> **ห้ามอ่าน `process.env` กระจายทั่วโค้ด** ให้รวมไว้ที่ไฟล์เดียว
> จะได้ตอบได้ว่าระบบใช้ค่าอะไรบ้าง โดยไม่ต้องไล่ grep ทั้งโปรเจกต์

Node 20 ขึ้นไปโหลด `.env` ได้เองด้วย `node --env-file=.env` ไม่ต้องพึ่ง `dotenv`

---

## 3 · Python

```python
# settings.py
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="APP_", env_file=".env")

    env: str = Field(pattern="^(development|staging|production)$")
    database_url: PostgresDsn
    jwt_secret: str = Field(min_length=32)
    timeout_seconds: int = Field(default=30, ge=1, le=300)

settings = Settings()      # ขาดค่า = ValidationError ตั้งแต่ import
```

- อ่าน `APP_DATABASE_URL`, `APP_JWT_SECRET` ตาม `env_prefix`
- import ที่ระดับบนสุดของแอป error จะได้เกิดตอนบูต ไม่ใช่ตอนเรียกใช้ครั้งแรก

---

## 4 · Angular และ frontend ทั่วไป

> 🚨 **ทุกอย่างที่อยู่ในไฟล์ที่เบราว์เซอร์โหลด คือสาธารณะ** ไม่มีข้อยกเว้น

**แบบฝังตอน build** (`environment.ts`, `import.meta.env`, `NEXT_PUBLIC_*`):
ค่าติดไปกับไฟล์ที่ build ได้ เปลี่ยนค่าทีไรต้อง build ใหม่ จึงขัดกับกฎ build ครั้งเดียวแล้วใช้ทุก environment

**แบบโหลดตอนรัน (แนะนำ):**

```ts
// main.ts — โหลดก่อนแอปเริ่ม
fetch('/config.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(cfg => {
    (window as any).__APP_CONFIG__ = cfg;
    return bootstrapApplication(AppComponent, appConfig);
  });
```

```json
// config.json — ไฟล์นี้วางแยกต่อ environment ไม่ต้อง build ใหม่
{ "apiBaseUrl": "https://api.example.co", "env": "production", "sentryDsn": "..." }
```

ตั้ง header `Cache-Control: no-store` ให้ `/config.json` ไม่งั้นเบราว์เซอร์จะใช้ค่าเก่า

---

## 5 · Docker และ Kubernetes

**Docker อย่าใส่ secret ตอน build:**

```dockerfile
# ผิด: ค่าจะติดอยู่ในชั้นของ image ตลอดไป เห็นได้ด้วย docker history
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

# ถูก: mount เฉพาะตอนใช้ ไม่ติดไปกับ image
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

```bash
docker build --secret id=npmrc,src=$HOME/.npmrc .
docker run --env-file .env myapp        # ตอนรัน ส่งค่าเข้าไป
```

**Kubernetes:**

```yaml
env:
  - name: APP_DB_PASSWORD
    valueFrom:
      secretKeyRef: { name: app-secrets, key: db-password }
```

> 🚨 **Secret ของ Kubernetes เป็นแค่ base64 ไม่ใช่การเข้ารหัส**
> ใครมีสิทธิ์ `get secret` ก็อ่านค่าได้ตรง ๆ
> ต้องเปิด encryption at rest ที่ etcd และคุมสิทธิ์ด้วย RBAC
> ทางที่ดีกว่า: ให้ External Secrets Operator ดึงค่าจาก Key Vault / Secrets Manager มาสร้าง Secret ให้

---

## 6 · เครื่องมือตรวจ secret ที่หลุดเข้า git

```bash
# ตรวจทั้งประวัติ
gitleaks git --redact        # คำสั่ง detect เดิมถูกแทนด้วย git / dir

# กันไว้ก่อน commit
pip install pre-commit detect-secrets
detect-secrets scan > .secrets.baseline
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2   # ตัวอย่าง ตรวจ rev ล่าสุดก่อนใช้ (รอยืนยัน)
    hooks: [{ id: gitleaks }]
```

**ลบออกจากประวัติ** (ทำหลังเพิกถอนค่าเดิมแล้วเท่านั้น):

```bash
pip install git-filter-repo
git filter-repo --path .env --invert-paths
# รอผู้ใช้อนุมัติก่อน · แจ้งทีมก่อน force push (เขียนประวัติร่วมทับ ทุกคนต้อง clone ใหม่)
git push --force --all
```

---

## 7 · คำสั่งสร้างค่าสุ่มที่ปลอดภัย

```bash
openssl rand -base64 48                 # กุญแจทั่วไป
openssl rand -hex 32                    # กุญแจ 256 บิตเป็นเลขฐานสิบหก
uuidgen                                 # id ไม่ลับ

node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

```powershell
# Windows
# PowerShell 5.1 และ 7 (ตัวสุ่มสำหรับงานเข้ารหัส ไม่ใช่ Get-Random)
$b = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
[Convert]::ToBase64String($b)
# PowerShell 7.4 ขึ้นไป: Get-SecureRandom ก็ใช้ได้
```

> ผิด: **อย่าใช้ตัวสุ่มทั่วไป** (`Math.random`, `random.random`, `Random` ของ .NET)
> เพราะพวกนี้คาดเดาได้ ต้องใช้ตัวสุ่มสำหรับงานเข้ารหัสตามคำสั่งข้างบน


---

# skill: observability-basics

Use when a live system must be known healthy before users complain (metrics, logs, traces, alerts).

# วัดผลและเฝ้าระบบ

> **กฎข้อเดียว:** ถ้าลูกค้าเป็นคนบอกเราว่าระบบล่ม แปลว่าการเฝ้าระวังล้มเหลว
> ไม่ใช่ว่าลูกค้าใจดี

## เมื่อไหร่ใช้ skill นี้

- ระบบมีผู้ใช้จริงแล้ว
- มีคนถามว่า "ตอนนี้ระบบปกติดีไหม" แล้วต้องไปเปิด log ดูถึงจะตอบได้
- ถูกปลุกกลางดึกด้วยการแจ้งเตือนที่ไม่ต้องทำอะไร
- ระบบช้าแล้วไม่รู้ว่าช้าตรงไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รูปแบบบรรทัด log และการปิดบัง | `logging-standards` |
| ร่องรอยว่าใครทำอะไร | `audit-trail` |
| endpoint health check | `web-service-essentials` |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |

---

## 1 · สามอย่างนี้ตอบคนละคำถาม

| | ตอบคำถาม | ตัวอย่าง | ต้นทุน |
|---|---|---|---|
| **metric** (ตัวชี้วัด) | "ตอนนี้แย่ไหม แย่ขึ้นหรือลง" | error 2.3% · p95 = 840 ms | ถูกสุด เก็บได้นาน |
| **log** (บันทึก) | "คำขอนั้นเกิดอะไรขึ้น" | ข้อความ + stack trace + id | แพงปานกลาง |
| **trace** (การไล่รอย) | "ช้าที่ขั้นตอนไหน" | คำขอเดียว ผ่าน 5 service | แพงสุด สุ่มเก็บ |

**ลำดับการใช้เวลาเกิดเหตุ:** metric บอกว่า**มีปัญหา** → trace บอกว่า**ตรงไหน** → log บอกว่า**ทำไม**
ทั้ง 3 อย่างต้องเชื่อมกันด้วย correlation id ตัวเดียวกัน (ดู `logging-standards`)

---

## 2 · สี่สัญญาณที่ต้องวัด

| สัญญาณ | วัดอะไร | ตัวเลขที่ดู |
|---|---|---|
| **อัตราคำขอ** | มีงานเข้ามาเท่าไหร่ | ต่อวินาที แยกตาม endpoint |
| **อัตราความผิดพลาด** | ล้มกี่เปอร์เซ็นต์ | แยก 4xx (ผู้ใช้ผิด) กับ 5xx (เราผิด) |
| **เวลาตอบสนอง** | ช้าแค่ไหน | **p50 · p95 · p99** |
| **ทรัพยากร** | ใกล้เต็มไหม | CPU · หน่วยความจำ · พื้นที่ · connection pool |

> 🚨 **ห้ามดูค่าเฉลี่ยของเวลาตอบสนอง** — เฉลี่ย 200 ms ฟังดูดี
> ทั้งที่ผู้ใช้ 5% รอ 9 วินาที ค่าเฉลี่ยกลบคนที่เจอปัญหาเสมอ **ดู p95 และ p99**

**สำหรับคิวและงานเบื้องหลัง** เพิ่มอีก 3 ตัว — งานค้างในคิว · เวลารอในคิว · งานที่ล้มถาวร
(ดู `background-jobs`)

---

## 3 · ตั้งชื่อตัวชี้วัด

```
<โดเมน>_<สิ่งที่วัด>_<หน่วย>

http_requests_total              จำนวนสะสม
http_request_duration_seconds    ระยะเวลา
orders_created_total             เหตุการณ์ทางธุรกิจ
queue_depth_jobs                 ค่า ณ ขณะนั้น
```

| กฎ | เหตุผล |
|---|---|
| ลงท้ายด้วยหน่วยเสมอ | `_seconds` ไม่ใช่ `_time` ที่ไม่มีใครรู้ว่าวินาทีหรือมิลลิวินาที |
| ค่าสะสมลงท้าย `_total` | บอกว่าเป็นค่าที่เพิ่มขึ้นเรื่อย ๆ ไม่ใช่ค่าปัจจุบัน |
| ใช้ label แทนการสร้างชื่อใหม่ | `http_requests_total{route,status}` ไม่ใช่ชื่อแยกต่อ endpoint |
| **label ห้ามมีค่าที่ไม่จำกัด** | ถ้าใส่ user id หรือ order id เป็น label ระบบเก็บ metric จะรับไม่ไหว |

### 3.1 · ถ้าใช้ Prometheus และ Grafana

- **ชนิด metric:** counter ใช้นับเหตุการณ์ (อ่านด้วย `rate()`) · gauge ใช้ค่า ณ ตอนนี้ · histogram ใช้ระยะเวลาที่ต้องหา p95 · summary ใช้เมื่อไม่ต้องรวมข้าม instance
- **หน่วย:** วินาที · byte · ratio 0 ถึง 1 (`_seconds` ไม่ใช่ `_milliseconds`)
- **ห้ามใส่ `user_id` · เบอร์โทร · `call_id` เป็น label** เพราะทุกค่าใหม่คือ series ใหม่ 1 เส้น จนระบบเก็บ metric รับไม่ไหว · id เหล่านี้ลง log และ trace
- p95: `histogram_quantile(0.95, sum by (le) (rate(<ชื่อ>_bucket[5m])))`
- alert ทุกกฎมี `for:` · `severity` · ลิงก์ runbook · เตือนจากอาการ (latency · error) ไม่เตือนจาก CPU หรือ GPU
- dashboard เก็บเป็น JSON ใน git แล้ว provision ด้วยไฟล์ · RED ต่อ service · USE ต่อทรัพยากร
- รายละเอียด PromQL · ตัวอย่างกฎ alert · provisioning · ตัวอย่างระบบ voice agent (latency STT · LLM · TTS · lag ของ Kafka · GPU): `references/prometheus-grafana.md`

---

## 4 · การแจ้งเตือน

> **แจ้งเตือนทุกครั้งต้องมีอะไรให้ทำ** — ถ้าคนรับอ่านแล้วไม่ต้องทำอะไร
> อีก 3 สัปดาห์เขาจะปิดเสียงแจ้งเตือน แล้ววันที่ของจริงเกิดก็จะไม่มีใครเห็น

**แจ้งเตือนจากสิ่งที่ผู้ใช้รู้สึก ไม่ใช่จากตัวเลขของเครื่อง**

| ✗ เตือนแบบนี้ | ✓ เตือนแบบนี้ |
|---|---|
| CPU เกิน 80% | อัตรา error เกิน 2% นาน 5 นาที |
| หน่วยความจำเกิน 70% | p95 ของหน้าชำระเงินเกิน 3 วินาที นาน 10 นาที |
| pod restart | คำสั่งซื้อสำเร็จลดลงเกิน 50% เทียบกับสัปดาห์ก่อน |
| disk 60% | **disk จะเต็มใน 4 ชั่วโมงตามอัตราปัจจุบัน** |

| ระดับ | ตัวอย่าง | ส่งไปไหน |
|---|---|---|
| **ปลุกคน** | ผู้ใช้ใช้งานไม่ได้ · ข้อมูลกำลังเสียหาย | โทร · push |
| **ดูในเวลางาน** | disk จะเต็มใน 3 วัน · error เพิ่มแต่ยังไม่มาก | แชตของทีม |
| **แค่บันทึกไว้** | ทุกอย่างที่เหลือ | แดชบอร์ด |

**ทุกการแจ้งเตือนต้องมี:** อะไรพัง · กระทบใคร · **ลิงก์ไป runbook** · ลิงก์ไปแดชบอร์ด
**ตั้งช่วงเวลา (นาน N นาที) เสมอ** ไม่ใช่เตือนทันทีที่ค่าพุ่งครั้งเดียว

### 4.1 · งบความผิดพลาด (error budget) และอัตราเผางบ (burn rate)

ระบบที่มี SLO ใช้วิธีนี้แทนการตั้งเกณฑ์ error % ตายตัว เพราะมันบอกว่า "ถ้าปล่อยไว้แบบนี้ งบทั้งเดือนจะหมดเมื่อไหร่" (แนวคิดจาก Google SRE Workbook)

- **งบ** = เวลาที่ยอมให้ล้มได้ใน 30 วัน → SLO 99.9% = 43 นาที · 99.5% = 3.6 ชั่วโมง · 99% = 7.2 ชั่วโมง
- **burn rate** = อัตรา error ตอนนี้ ÷ (1 − SLO) → burn 1 = งบหมดพอดีวันที่ 30 · burn 10 = หมดใน 3 วัน
- ตั้งแจ้งเตือน 3 ระดับตามตาราง และทุกระดับต้องเป็นจริงทั้งช่วงยาวและช่วงสั้น (ช่วงสั้น = 1/12 ของช่วงยาว) จะได้หยุดเตือนทันทีที่ระบบหาย

| ระดับ | burn rate | ช่วงยาว · ช่วงสั้น | กินงบไปแล้ว | SLO 99.9% แปลว่า error เกิน | ส่งไปไหน |
|---|---|---|---|---|---|
| ไหม้เร็ว | 14.4 | 1 ชั่วโมง · 5 นาที | 2% ของเดือน ใน 1 ชั่วโมง | 1.44% | ปลุกคน |
| ไหม้ช้า | 6 | 6 ชั่วโมง · 30 นาที | 5% ของเดือน ใน 6 ชั่วโมง | 0.6% | ปลุกคน |
| รั่วซึม | 1 | 3 วัน · 6 ชั่วโมง | 10% ของเดือน ใน 3 วัน | 0.1% | แชตของทีม |

งบเหลือเท่าไหร่ให้ขึ้นบนแดชบอร์ดภาพรวม — งบใกล้หมด = หยุดปล่อยฟีเจอร์ ไปแก้ความเสถียรก่อน เป็นกติกาที่ตกลงกับเจ้าของผลิตภัณฑ์ล่วงหน้า ไม่ใช่ตอนทะเลาะกัน

---

## 5 · แดชบอร์ด

ทำ 2 หน้าพอ

| หน้า | ตอบคำถาม | มีอะไร |
|---|---|---|
| **ภาพรวม** | "ตอนนี้ปกติไหม" | 4 สัญญาณของทั้งระบบ · สถานะ dependency · การปล่อยของล่าสุด |
| **เจาะลึกต่อ service** | "พังตรงไหน" | 4 สัญญาณแยกตาม endpoint · คิว · ฐานข้อมูล |

- **เส้นแนวตั้งบอกเวลาที่ deploy** — ปัญหาส่วนใหญ่เริ่มหลังเส้นนี้ และเห็นได้ในวินาทีเดียว
- หน้าภาพรวมต้องอ่านจบใน 10 วินาที จึงควรมีไม่เกิน 6 กราฟ
- ใส่เส้นเกณฑ์ที่ตั้งแจ้งเตือนไว้ในกราฟ จะได้รู้ว่าห่างจากเส้นแค่ไหน

---

## 6 · ตัวชี้วัดทางธุรกิจ

ตัวชี้วัดทางเทคนิคเขียวหมดแต่ธุรกิจหยุดเดิน เป็นเรื่องที่เกิดขึ้นจริงและตรวจไม่เจอถ้าไม่วัด

| ตัวอย่าง | จับอะไรได้ |
|---|---|
| คำสั่งซื้อสำเร็จต่อชั่วโมง | ปุ่มชำระเงินพังแม้ทุก endpoint คืน 200 |
| อัตราเข้าสู่ระบบสำเร็จ | ผู้ให้บริการยืนยันตัวตนภายนอกมีปัญหา |
| งานเบื้องหลังที่รอเกิน N นาที | คิวตัน แต่ API ยังตอบปกติ |
| อีเมลส่งไม่สำเร็จ | ลูกค้าไม่ได้รับใบเสร็จ โดยไม่มี error ที่ไหนเลย |

**เลือก 3–5 ตัวที่เป็นหัวใจของธุรกิจ** แล้วเตือนเมื่อมันตกผิดปกติเทียบกับช่วงเดียวกันของสัปดาห์ก่อน

---

## 7 · Anti-patterns

- **ดูค่าเฉลี่ยของเวลาตอบสนอง** — กลบคนที่เจอปัญหาทุกครั้ง
- **แจ้งเตือนที่ไม่ต้องทำอะไร** — สอนให้ทุกคนเลิกสนใจการแจ้งเตือน
- **เตือนจาก CPU และหน่วยความจำ** — ระบบที่ CPU 90% แต่ผู้ใช้ปกติ ไม่ใช่เหตุ
- **ใส่ id ที่ไม่จำกัดค่าเป็น label** — ระบบเก็บ metric ล่มเสียเอง
- **แดชบอร์ด 40 กราฟ** — ไม่มีใครรู้ว่าต้องดูอันไหน
- **วัดแต่เทคนิค ไม่วัดธุรกิจ** — ทุกอย่างเขียวแต่ไม่มีใครสั่งซื้อได้
- **เก็บ trace ทุกคำขอ** — แพงโดยไม่ได้อะไรเพิ่ม สุ่มเก็บก็พอ
- **ไม่มีเส้นบอกเวลา deploy** — เสียเวลาครึ่งชั่วโมงกว่าจะนึกได้ว่าเพิ่ง deploy ไป
- **แจ้งเตือนที่ไม่มีลิงก์ไป runbook** — คนรับต้องเริ่มค้นจากศูนย์ตอนตี 3

---

## 8 · ตัวย่อ

- **metric** — ตัวชี้วัด ตัวเลขที่เก็บตามเวลา
- **trace** — การไล่รอยคำขอหนึ่งตลอดเส้นทางที่มันวิ่งผ่าน
- **p95 / p99** — เปอร์เซ็นไทล์ที่ 95 และ 99 (ช้ากว่านี้มีแค่ 5% หรือ 1% ของคำขอ)
- **label / tag** — ป้ายกำกับที่แนบกับตัวชี้วัด ใช้แยกดูเป็นกลุ่ม
- **on-call** — เวรรับแจ้งเหตุนอกเวลาทำการ
- **SLO** — Service Level Objective (เป้าหมายระดับบริการที่ตั้งไว้เอง เช่น สำเร็จ 99.5%)
- **error budget / burn rate** — เวลาที่ยอมให้ล้มได้ต่อเดือนตาม SLO และความเร็วที่กำลังใช้มันหมด (ข้อ 4.1)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| health check ที่ระบบเฝ้าใช้ | `web-service-essentials` |
| ตัวชี้วัดของคิวและงานเบื้องหลัง | `background-jobs` |
| อัตรา error และการตัดวงจร | `error-handling-patterns` |
| ขั้นตอนเมื่อการแจ้งเตือนดัง | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |
| ตัวเลขเป้าหมายที่ตกลงกับลูกค้า | `srs-writing` |
| PromQL · กฎ alert · Grafana provisioning · ตัวอย่าง voice agent | `references/prometheus-grafana.md` |
| ให้ agent อ่าน Prometheus หรือ Grafana ผ่าน MCP | `mcp-server` ข้อ 1.1 |

ที่มาของข้อ 3.1: prometheus.io (metric types · naming · histograms · alerting) และ grafana.com (dashboard best practices · provisioning) ตรวจ 2026-10-27 · ลิงก์เต็มอยู่ท้าย `references/prometheus-grafana.md`


## reference: prometheus-grafana.md

# Prometheus และ Grafana — ใช้ให้ถูก

อยู่ใน `observability-basics` · หลักคิดเรื่องอะไรควรวัดและควรเตือนอยู่ใน `SKILL.md` ข้อ 2 · 4 · 5 ไฟล์นี้บอกวิธีทำใน Prometheus และ Grafana · ชื่อ metric และตัวเลขที่ติดป้าย `ตัวอย่าง` เป็นข้อมูลสมมุติ ต้องปรับให้ตรงกับระบบจริง

## สารบัญ

- [1 · metric 4 ชนิด](#1--metric-4-ชนิด)
- [2 · ชื่อและหน่วย](#2--ชื่อและหน่วย)
- [3 · label และ cardinality](#3--label-และ-cardinality)
- [4 · PromQL ที่ใช้บ่อย](#4--promql-ที่ใช้บ่อย)
- [5 · กฎ alert](#5--กฎ-alert)
- [6 · Grafana](#6--grafana)
- [7 · ตัวอย่างระบบ voice agent](#7--ตัวอย่างระบบ-voice-agent)
- [8 · ตรวจก่อนส่ง](#8--ตรวจก่อนส่ง)
- [9 · ที่มา](#9--ที่มา)

## 1 · metric 4 ชนิด

| ชนิด | คืออะไร | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|---|
| counter | ค่าสะสม เพิ่มอย่างเดียว กลับเป็น 0 เมื่อ process เริ่มใหม่ | นับเหตุการณ์ที่เกิดแล้ว (คำขอ · error · งานที่เสร็จ) · อ่านด้วย `rate()` ไม่อ่านค่าดิบ | `http_requests_total` |
| gauge | ค่า ณ ขณะนั้น ขึ้นลงได้ | ของที่นับค้างอยู่หรือวัดได้ตอนนี้ (สายที่กำลังคุย · ความยาวคิว · หน่วยความจำ) | `voice_calls_active` |
| histogram | นับค่าที่วัดได้ลงช่วง (bucket) พร้อมผลรวมและจำนวน | ระยะเวลาหรือขนาดที่ต้องหา p95 · p99 และรวมข้ามหลาย instance ได้ | `http_request_duration_seconds` |
| summary | คำนวณ quantile ที่ฝั่งแอป ในช่วงเวลาเลื่อน | ใช้เมื่อไม่ต้องรวมข้าม instance เท่านั้น · quantile และช่วงเวลาเลือกตอนเขียนโค้ด เปลี่ยนทีหลังไม่ได้ | หายาก ปกติเลือก histogram |

- ห้ามเอา quantile จาก summary หลาย instance มาเฉลี่ยกัน ผลที่ได้ไม่มีความหมายทางสถิติ (เอกสาร Prometheus ใช้คำนี้)
- **เลือกอย่างไร** (prometheus.io/docs/practices/histograms/ ตรวจ 2026-10-27): ถ้า library และ Prometheus ที่ใช้รองรับ ให้ใช้ native histogram ก่อน เพราะเปลี่ยน percentile และช่วงเวลาทีหลังใน PromQL ได้ · ไม่รองรับแต่ต้องรวมข้าม instance ให้ใช้ classic histogram · summary เฉพาะเมื่อไม่ต้องรวมข้าม instance
- เอกสาร Prometheus แนะนำ native histogram ก่อน แต่ library ที่รองรับยังจำกัด ถ้า library ไม่รองรับให้ใช้ classic histogram แล้ววาง bucket ให้มีขอบอยู่ตรงค่า SLO ไม่งั้น p95 ที่ประมาณได้จะคลาด (ตัวอย่างในเอกสาร: p95 จริงราว 320 ms ประมาณได้ 443 ms เพราะ bucket กว้างตั้งแต่ 300 ถึง 450 ms)

## 2 · ชื่อและหน่วย

| กฎ | ถูก | ผิด |
|---|---|---|
| ขึ้นต้นด้วยคำเดียวบอกระบบ | `voice_stage_duration_seconds` | `stage_duration` |
| ใช้หน่วยพื้นฐาน: วินาที · byte · ratio 0 ถึง 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| หน่วยเป็นรูปพหูพจน์ต่อท้าย | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| counter ลงท้าย `_total` (ถ้ามีหน่วย หน่วยมาก่อน) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 ชื่อ 1 หน่วย 1 ความหมาย | วินาทีทั้งชื่อ | ครึ่งหนึ่งวินาทีครึ่งหนึ่งมิลลิวินาที |
| ไม่ใส่ชื่อ label ซ้ำในชื่อ metric | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · label และ cardinality

ทุกชุดค่า label ที่ไม่ซ้ำกันคือ time series ใหม่ 1 เส้น เอกสาร Prometheus เตือนให้เลี่ยง label ที่ค่าไม่จำกัด เช่น user id หรืออีเมล

| ห้ามเป็น label | ให้ใช้แทน |
|---|---|
| `user_id` · `customer_id` · เบอร์โทร · อีเมล | ไม่ใส่เลย · เก็บใน log หรือ trace · ถ้าต้องนับรายคน ใช้ฐานข้อมูล ไม่ใช่ metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | log และ trace ที่ผูกกับ id เดียวกัน (`logging-standards`) |
| URL เต็มที่มี id หรือ query string | แม่แบบเส้นทาง เช่น `/orders/{id}` |
| ข้อความ error ที่มีค่าแปรผัน | รหัส error ที่มีจำนวนจำกัด เช่น `reason="timeout"` |

- label ที่ใช้ได้ต้องนับค่าที่เป็นไปได้ทั้งหมดได้ล่วงหน้า (stage = 3 ค่า · status = 5 กลุ่ม) · จำนวน series ของ metric หนึ่งใกล้เคียงผลคูณของจำนวนค่าในแต่ละ label · histogram คูณจำนวน bucket เข้าไปอีก
- ตรวจว่า metric ไหนทำ series ระเบิด: เปิดหน้า TSDB status ใน Prometheus UI · เครื่องมือ `tsdb_stats` ของ `prometheus-mcp` ให้ข้อมูลทำนองเดียวกัน (ดู `mcp-server` ข้อ 1.1)

## 4 · PromQL ที่ใช้บ่อย

| ต้องการ | คำสั่ง | หมายเหตุ |
|---|---|---|
| คำขอต่อวินาที | `sum by (route) (rate(http_requests_total[5m]))` | ช่วง `[5m]` ควรยาวหลายเท่าของระยะ scrape (ยังไม่ได้ตรวจตัวเลขกับเอกสาร) |
| อัตรา error | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | นับ 5xx (เราผิด) แยกจาก 4xx · ตอนไม่มีทราฟฟิกผลหารเป็น NaN กฎ alert จะไม่ fire ซึ่งอาจซ่อนระบบที่ไม่มีคำขอเข้าเลย ให้เตือนเรื่องไม่มีคำขอแยกอีกกฎ |
| p95 ของ latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | ต้องคง `le` ไว้ใน `sum by` · แยกตาม route ให้เติม `route` ใน `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | ใช้เมื่อ library และ Prometheus รองรับ |
| ค่าเฉลี่ย latency (ประกอบเท่านั้น ห้ามใช้ตัดสิน) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | ดู `SKILL.md` ข้อ 2 |
| disk จะเต็มใน 4 ชั่วโมง | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | ตัวอย่างของ saturation ที่เตือนล่วงหน้า (ยังไม่ได้ตรวจกับเอกสาร PromQL) |

## 5 · กฎ alert

หลักจากเอกสาร Prometheus: เตือนจากอาการที่ผู้ใช้รู้สึก (latency · error) ที่จุดสูงในสแตกเท่าที่ทำได้ · ปลุกคนเรื่อง latency ที่จุดเดียวของสแตก · สาเหตุ (CPU · GPU · lag ของ consumer) ใส่ในแดชบอร์ดไว้ไล่หา ไม่ปลุกคน · ยกเว้นเรื่องที่ต้องมีคนลงมือก่อนระบบล่ม เช่นความจุ

ข้อยกเว้น: ตัวเลขที่ผู้ใช้รู้สึกโดยตรงนับเป็นอาการ แม้มาจากระบบข้างใต้ เช่น consumer lag ของ Kafka ที่ทำให้ผู้โทรต้องรอคำตอบ (ข้อ 7) ปลุกคนได้ · lag ที่ไม่กระทบใครทันที เช่นงานรายงานหลังจบสาย เป็นสาเหตุ ใส่แดชบอร์ดหรือแชตทีม

ทุกกฎต้องมี 4 อย่าง

| อย่าง | ใส่ที่ไหน | เหตุผล |
|---|---|---|
| `for:` | ในกฎ | ไม่เตือนทันทีที่ค่าพุ่งครั้งเดียว · ถ้าไม่ใส่ กฎจะ fire ตั้งแต่รอบประเมินแรก |
| ระดับความรุนแรง | label `severity` (ชื่อและค่าเป็นธรรมเนียมที่ทีมตั้ง ไม่ใช่ข้อบังคับของ Prometheus) | ให้ Alertmanager ส่งต่อถูกที่ · ใช้ 3 ระดับตาม `SKILL.md` ข้อ 4: ปลุกคน · ดูในเวลางาน · บันทึกไว้ |
| ลิงก์ runbook | annotation `runbook_url` (ชื่อ key เป็นธรรมเนียม เอกสารบอกแค่ว่า annotation ใส่ลิงก์ runbook ได้) | ให้คนรับเริ่มจากขั้นตอน ไม่ใช่เริ่มจากศูนย์ตอนตี 3 |
| `summary` บอกอาการและผู้ที่กระทบ | annotation | อ่านจากโทรศัพท์แล้วรู้ว่าต้องทำอะไร |

ตัวอย่าง (เกณฑ์สมมุติ ต้องตั้งจาก SLO จริง):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` กันเตือนเด้งไปมาเมื่อค่าแกว่งรอบเกณฑ์ · แจ้งเตือนแบบ burn rate ดู `SKILL.md` ข้อ 4.1

## 6 · Grafana

| เรื่อง | ทำอย่างไร |
|---|---|
| 1 dashboard ต่อ 1 service | service ที่รับคำขอใช้ RED: Rate · Errors · Duration · ทรัพยากร (CPU · GPU · disk · connection pool) ใช้ USE: Utilization · Saturation · Errors · เอกสาร Grafana ว่า RED เป็นตัวแทนประสบการณ์ผู้ใช้ จึงตั้ง alert จาก RED ส่วน USE ใช้ไล่หาสาเหตุ |
| เก็บเป็นโค้ด | JSON ของ dashboard อยู่ใน git · เอกสาร Grafana ถือว่าไม่เก็บ JSON ใน version control เป็นสัญญาณว่าระบบยังไม่เป็นระเบียบ · เมื่อมีหลาย dashboard หน้าตาเหมือนกัน สร้างด้วย grafonnet (Jsonnet) หรือ grafanalib (Python) |
| โหลดอัตโนมัติ | ไฟล์ provider YAML ใน `provisioning/dashboards/` ชี้ `options.path` ไปโฟลเดอร์ JSON |
| ไม่ให้แก้ในเบราว์เซอร์แล้วหาย | ตั้ง `allowUiUpdates: false` · ใครอยากแก้ให้แก้ JSON ใน git แล้วเปิด PR · การโหลดจากไฟล์เขียนทับฉบับในฐานข้อมูลเสมอ |
| ไม่ copy dashboard | ใช้ template variable (เลือก service · environment) บน dashboard แม่ · เอกสาร Grafana เตือนว่าการ copy ทำให้ไม่ได้การแก้จากต้นฉบับ |
| dashboard ชั่วคราว | ตั้งชื่อขึ้นต้น `TEST:` แล้วลบเมื่อเสร็จ |
| uid | ตั้ง `uid` คงที่ใน JSON ให้ลิงก์จาก alert ไม่พัง · `uid` และ `title` ต้องไม่ซ้ำกันในโฟลเดอร์เดียวกัน |

ตัวอย่าง provider (ตรวจกับเอกสาร Grafana 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · ตัวอย่างระบบ voice agent

ชื่อ metric ในหัวข้อนี้ทีมตั้งเองทั้งหมด (ตัวอย่าง) ยกเว้น `DCGM_FI_DEV_GPU_UTIL` และ `kafka_consumergroup_lag*` ที่มาจาก exporter

**latency แต่ละช่วงของสาย** · 1 histogram แยกช่วงด้วย label `stage` ที่มีค่าจำกัด

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- วาง bucket ให้ถี่ช่วง 0.1 ถึง 3 วินาที เช่น `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5` โดยมีขอบตรงเกณฑ์ที่ตั้ง (1.5 วินาทีในตัวอย่างข้อ 5)
- p95 แยกช่วง: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · วางเป็นกราฟเดียว 3 เส้น เห็นทันทีว่าช่วงไหนกินเวลา
- เตือนที่ `voice_turn_duration_seconds` (อาการที่ผู้โทรรู้สึก) ไม่เตือนทุก stage · stage ไว้ไล่หาสาเหตุ
- ห้ามใส่ `call_id` หรือเบอร์ผู้โทรเป็น label · call id ลง log และ trace

**consumer lag ของ Kafka** · เมื่อ pipeline ส่งเหตุการณ์ของสายผ่าน Kafka

- ค่า lag มาจาก exporter ของ Kafka · `kafka_exporter` (danielqsj · Apache-2.0 · ไม่ใช่โครงการทางการของ Apache · ตรวจ 2026-10-27) ให้ `kafka_consumergroup_lag{consumergroup,topic,partition}` และ `kafka_consumergroup_lag_sum{consumergroup,topic}` · ถ้าใช้ exporter ตัวอื่น ชื่ออาจต่าง
- ปลุกคนเมื่อ lag ของ consumer ที่ทำให้ผู้โทรรอ (เช่นตัวสรุปสายแบบทันที) สูงและไม่ลดนาน · ตัวอย่าง `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` ด้วย `for: 10m` (เกณฑ์สมมุติ) · lag ของงานรายงานหลังจบสายส่งแชตทีมพอ
- label `partition` ใช้เฉพาะกราฟเจาะลึก ไม่ใส่ในกฎ alert

**GPU utilization** · exporter คือ NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` เป็น gauge หน่วย % (ตรวจจาก `etc/default-counters.csv` ของ repo 2026-10-27) · ชื่อนี้ exporter ตั้งมาเอง ไม่ตามกฎข้อ 2 ให้ใช้ตามเดิม
- GPU เป็นสาเหตุ (USE) ไม่ใช่อาการ · ใส่ในแดชบอร์ดคู่กับ latency ของ stage ที่ใช้ GPU (STT · TTS) · utilization สูงพร้อม p95 ของ stage นั้นสูง แปลว่าเครื่องอิ่มตัว ต้องเพิ่มเครื่องหรือลดโหลด
- GPU สูงต่อเนื่องหลายชั่วโมงเตือนเป็นระดับดูในเวลางาน ไม่ปลุกคน

## 8 · ตรวจก่อนส่ง

- [ ] ทุก metric มีหน่วยและ `_total` ตามกฎ · ไม่มี label ที่ค่าไม่จำกัด (user · เบอร์ · call id)
- [ ] latency เป็น histogram ที่มีขอบ bucket ตรงเกณฑ์ SLO · ไม่ใช้ค่าเฉลี่ยตัดสิน
- [ ] ทุก alert มี `for:` · `severity` · `runbook_url` · `summary` · เตือนจากอาการ ไม่ใช่ CPU หรือ GPU
- [ ] dashboard เป็น JSON ใน git · provision ด้วยไฟล์ · `allowUiUpdates: false`
- [ ] มี dashboard RED ต่อ service และ USE ต่อทรัพยากร

## 9 · ที่มา

ตรวจ 2026-10-27

| เรื่อง | ที่มา |
|---|---|
| ชนิด metric | prometheus.io/docs/concepts/metric_types/ |
| ชื่อ หน่วย label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| หลักการ alert จากอาการ | prometheus.io/docs/practices/alerting/ |
| ไวยากรณ์กฎ `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| provisioning dashboard | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (ไม่ใช่ทางการของ Kafka) |
| `predict_linear` · ช่วง `[5m]` เทียบระยะ scrape · พฤติกรรม NaN เมื่อหารด้วย 0 | ความรู้ทั่วไปของทีม (ยังไม่ได้ตรวจกับหน้า PromQL ทางการ) |
