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

# skill: reverse-engineering

Use when asked to reverse engineer, decompile or disassemble an app with no source, find how a feature or protocol works \"under the hood\", analyze an unknown file, or \"how does X app do Y\" / \"ดูว่าแอปนี้ทำงานยังไง\".

# Reverse Engineering

Investigation model (adapted from the REA project): **Decompile → Understand → Recreate**, with evidence recorded at every step. Never claim to recover original source code; report what the evidence actually shows and mark unknowns explicitly.

## Safety and legality

- Only analyze software and files the user owns or is authorized to analyze (their own apps, licensed software, CTF targets, malware samples in a sandbox).
- Do not help bypass licensing, DRM, activation checks, or access controls on third-party software.
- Do not exfiltrate data found inside binaries (credentials, keys) to third parties.
- Malware analysis: static-only unless the user explicitly asks for dynamic analysis in an isolated environment.

## Workflow

### Step 1 — Triage (identify the target)

Run `scripts/triage.py <target>` to identify the file type, architecture, entry hints, and extract useful strings. It recognizes PE (Windows), ELF (Linux), Mach-O (macOS), .NET/CLI, APK (ZIP), ASAR, plist, JavaScript, and generic binaries.

Classify the target first, because it determines the tool chain:

| Target kind | Typical forms | Main route |
|---|---|---|
| Native binary | PE, ELF, Mach-O | Strings → symbols → decompile |
| .NET / managed | `.exe`/`.dll` with CLI header | IL metadata → decompile (ILSpy) |
| JavaScript / Electron | `.js`, bundles, `.asar`, source maps | Static JS graph — usually the fastest route |
| Mobile | `.apk`, `.ipa` | Unpack first, then treat contents by kind |
| Web app / site | URL of the user's own site | Passive observation, bundle/source-map analysis |
| Unknown format | custom file | Hex/structure analysis, entropy, repeated patterns |

**Installers and stubs**: if triage reports a 7-Zip SFX or NSIS installer, do NOT analyze strings in it — they are compressed noise. Extract first (`7z x <file>`), then triage the real payload inside. For known packaging patterns (Mozilla `omni.ja`/`application.ini`, Electron ASAR, .NET bundles, APK layout), see [references/packaging-patterns.md](references/packaging-patterns.md).

Confirm what the user actually wants before deep work: explain a feature, recover an algorithm/format, or recreate the feature in their stack.

### Step 2 — Decompile (recover readable clues)

Work from cheapest to most expensive:

1. **Strings and metadata**: names, endpoints, constants, error messages. `scripts/triage.py --strings` for keyword-filtered output, or `scripts/triage.py --pattern '<regex>'` to hunt a specific clue (e.g. `--pattern 'oauth|autoconfig'`). Grep over extracted resources for text files.
2. **Symbols/imports/exports**: which APIs the binary calls (`imports`) reveal behavior (crypto, networking, storage).
3. **JavaScript/Electron**: unpack ASAR (`npx asar extract`), beautify bundles, read source maps (`.map` often contains original source). This frequently answers the whole question without touching native code.
4. **Managed (.NET)**: `ilspycmd` or ILSpy GUI to get near-original C#.
5. **Native deep analysis**: Ghidra (free, headless mode) or Hopper. Use when strings/symbols are not enough. On Windows, Ghidra headless + Python scripts is the reliable path.

For each interesting finding (a feature name, an endpoint, an algorithm string), record it as evidence: file, address/offset, and what it suggests.

### Step 3 — Understand (connect clues to code)

Trace from clue to implementation:

1. Find where the string/symbol is referenced (xrefs).
2. Find the function that contains the reference (callers/callees, control flow).
3. Decompile those functions; follow the data flow in and out.
4. Build a short narrative: "feature X works by A calling B, storing in C, gated by D."

Keep static inference and runtime observation separate — say which one each claim comes from. Mark unresolved links explicitly instead of guessing.

### Step 4 — Recreate (build the user's version)

Only after the user confirms the understanding is correct, implement the equivalent feature in their project using their normal file-editing and test tools. Adapt to their stack and requirements; do not copy code wholesale from proprietary binaries. If the original used a standard algorithm or format (JSON, protobuf, zlib, AES), linking against or reimplementing that standard is fine.

### Step 5 — Report

Deliver a structured summary:

- **How it works**: the narrative from Step 3, with evidence locations.
- **Evidence list**: each claim tied to a file/address/observation.
- **Unknowns**: what could not be determined and what would resolve it.
- **Recreated feature**: files changed/created, and how to verify.

## Rules of thumb

- Prefer static analysis; avoid executing unknown binaries.
- Cheapest sufficient evidence wins: JS bundle > symbols > decompiler > debugger.
- Binary analysis requires an explicit request or clear authorization; when in doubt, ask.
- Windows note: many classic Unix RE tools are absent; prefer Python scripts (bundled or written on the spot) and Node-based tools over assuming `strings`/`objdump` exist.


## reference: packaging-patterns.md

# Common application packaging patterns

Recognizing the packaging leads straight to the readable layer. Check these before touching a decompiler.

## Mozilla apps (Firefox, Thunderbird)

- Full Windows installer is a **7-Zip SFX stub** (small PE32, sections=3) with the app in an appended archive. `7z x setup.exe` extracts `core/` plus `setup.exe`.
- `core/application.ini` — version, BuildID, source repository and SourceStamp (build provenance evidence).
- `core/omni.ja` — ZIP archive (97MB+ for Thunderbird) holding nearly all app JavaScript (`modules/`, `chrome/`) and default prefs (`defaults/pref/*.js`). Extract with 7z; Grep it to trace features. `omni.ja` is usually the cheapest route to full answers.
- The big DLLs are the native layer: `xul.dll` (Gecko engine), `nss3.dll`/`freebl3.dll` (crypto), `rnp.dll` (OpenPGP), `libotr.dll` (chat encryption).
- `thunderbird.exe` itself is only a launcher stub.

## Electron / Node apps

- `app.asar` — ASAR archive; `npx asar extract app.asar outdir`. Renderer JS is often minified but readable; `.map` source maps may contain original source.
- `resources/app/package.json` names the app, entry point, and dependency list.
- Native modules: `*.node` files (PE DLLs) — treat as native binaries.

## .NET applications

- PE with a CLI header (triage reports `.NET / managed PE`). `ilspycmd <dll>` or ILSpy gives near-original C#.
- Check for bundled/single-file deployment (self-extracting extractors) — extract first.
- P/Invoke declarations map managed code to native DLL entry points.

## Android APK

- ZIP; contains `classes.dex` (Dalvik bytecode — use `jadx` or `apktool` for near-Java output), `AndroidManifest.xml` (binary XML — use `apktool` or `aapt`), `resources.arsc`, native libs under `lib/`.

## Windows installers generally

- 7-Zip SFX: extract with `7z x`.
- NSIS: extract with `7z x` (triage detects `NullsoftInstall` marker).
- MSI: `msiexec /a file.msi /qb TARGETDIR=<out>` or 7z.
- MSI transforms and stub downloaders may contain no payload — identify early to avoid wasted work.
