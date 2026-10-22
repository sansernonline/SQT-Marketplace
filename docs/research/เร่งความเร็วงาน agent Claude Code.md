# ขนานให้ถูกที่ แล้วตัดเวลาทุกขั้น

> **สถานะ (21 ต.ค. 2569):** ทำครบทั้ง 12 ข้อในตาราง "ลำดับสิ่งที่ควรแก้ใน skill" แล้ว · ไฟล์นี้เก็บไว้เป็นที่มาของข้อมูล · 2 ข้อในไฟล์นี้ผิดเมื่อเทียบกับเอกสารทางการ → (1) ต่อหรือถอด Model Context Protocol (MCP) server ไม่ทำให้ cache หาย เมื่อ tool โหลดแบบเลื่อน (ค่าเริ่ม) (2) วางส่วนที่เหมือนกันไว้ต้นใบสั่งงาน ไม่รับประกันว่า subagent ตัวอื่นจะได้ cache ร่วม · ยังไม่ได้ทำ: วิเคราะห์ log review เพื่อตั้งเพดานรอบจากข้อมูลจริง · จับเวลา worktree เทียบ Docker

คำตอบสั้น: งาน agent ของ Claude Code เสร็จเร็วขึ้นจริงจาก 2 ทาง → (1) ขนานเฉพาะงานที่แยกขาดกันจริง โดยเฉพาะงานอ่าน ค้น และตรวจ และ (2) ลดเวลาต่อขั้น ด้วยการตั้ง effort ให้ต่ำลงตามงาน เลือกโมเดลเล็กลง เรียก tool หลายตัวในข้อความเดียว และทำ context ให้เล็ก งานอ่านแบบขนานลดเวลาได้ถึง 90% ในงานวิจัยของ Anthropic แต่งานเขียนโค้ดแบบขนานเร็วขึ้นได้มากสุดราว 2.1 เท่า และเฉพาะเมื่อวางแผนแบ่งไฟล์ก่อนปล่อย ถ้าหลาย agent แก้ไฟล์ชุดเดียวกัน → ชนกัน 20–42% ของคู่ Pull Request (PR) และเสีย token เพิ่มราว 4–15 เท่า สำหรับ JK บน Windows 11 + Docker Desktop สิ่งที่คุ้มสุดคือแก้ skill ของ SQT-Marketplace 4 จุด → ใส่กฎ "งานไม่พึ่งกันส่งในข้อความเดียว" ใน `superuser` · ผูกระดับโมเดลกับ effort · ย่อรอบ review ของงานกลาง · ใช้ git worktree ในตัวแทนห้อง Docker เมื่อลองหลายทางพร้อมกัน ส่วน agent teams และ fast mode ไม่ควรเป็นค่าเริ่ม

## ขนานแล้วเร็วจริงเฉพาะงานอ่านที่แยกขาด งานเขียนได้ไม่เกิน 2 เท่า

ตัวเลขที่ดีที่สุดมาจากงานวิจัย ไม่ใช่งานโค้ด ระบบ Research ของ Anthropic ใช้ Opus 4 เป็นหัวหน้า + Sonnet 4 เป็นลูกทีม → **คุณภาพดีกว่า agent เดี่ยว 90.2%** และ **ลดเวลาได้ถึง 90%** เมื่อปล่อยลูกทีม 3–5 ตัวพร้อมกัน แต่ละตัวเรียก tool 3 ตัวขึ้นไปพร้อมกัน ราคาที่จ่ายคือ token → agent ใช้ราว **4 เท่า** ของแชต ระบบหลาย agent ใช้ราว **15 เท่า** และบทความเดียวกันบอกตรงๆ ว่า "งานโค้ดส่วนใหญ่มีส่วนที่ขนานได้จริงน้อยกว่างานวิจัย" ([Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)) ข้อควรระวัง → บทความนี้ปี 2025 และวัดบน Claude.ai Research ไม่ใช่ Claude Code จึงใช้เป็นทิศทาง ไม่ใช่ตัวเลขของ Claude Code

งานโค้ดมีหลักฐานน้อยกว่าและเป็นงานแหล่งเดียวทั้งหมด งาน Co-Coder สร้างกราฟการพึ่งพาของไฟล์ก่อน แบ่งงานตามกลุ่ม แล้วจัดลำดับ → **เร็วขึ้นสูงสุด 2.10 เท่า ผ่านมากขึ้นสูงสุด 14% ค่า Application Programming Interface (API) ลดสูงสุด 35%** เมื่อเทียบกับทำทีละขั้น แบ่งตามไฟล์ และ Claude Code Agent Teams แต่ผู้วิจัยเตือนเองว่าค่าสื่อสารระหว่าง agent "บางครั้งกินกำไรหมด" ([arXiv 2606.00953](https://arxiv.org/abs/2606.00953) — preprint แหล่งเดียว) งานวิเคราะห์ PR ที่ agent เขียน 33,596 ตัว พบว่า **79.4% เปิดซ้อนกับ PR ของ agent อื่น** และชนกันทางข้อความ **19.8%** เมื่อเป็น agent เดียวกัน และ **41.7%** เมื่อต่าง agent ตัวเลขนี้เป็นค่าต่ำสุด เพราะยังไม่นับการชนเชิงความหมายหรือ build พัง ([arXiv 2607.04697](https://arxiv.org/html/2607.04697v2) — preprint แหล่งเดียว) อีกงานหนึ่งวางขอบเขตไฟล์และลำดับ merge ก่อนปล่อย → รวมงานสะอาดจาก 1/9 เป็น 9/9 และ conflict จาก 13 เหลือ 0 แต่ผู้เขียนเป็นเจ้าของผลิตภัณฑ์ที่ทดสอบ และไม่รายงานเรื่องความเร็ว ([arXiv 2610.07261](https://arxiv.org/abs/2610.07261) — preprint แหล่งเดียว ผู้เขียนมีส่วนได้เสีย)

ทำไมระบบหลาย agent พัง งาน MAST ตรวจ 1,642 trace จาก 7 framework → **ล้มเหลว 41–86.7%** สาเหตุหลักคือการออกแบบระบบ (ทำขั้นซ้ำ 15.7% · ไม่รู้ว่าเมื่อไรควรหยุด 12.4%) และการตรวจที่อ่อน ไม่ใช่โมเดลโง่ การเพิ่มขั้นตรวจระดับเป้าหมายช่วยมากสุด **+15.6%** ([MAST, arXiv 2503.13657](https://arxiv.org/html/2503.13657v3)) Cognition เสริมอีกมุม → "ทุก action มีการตัดสินใจแฝง" ผู้เขียนหลายตัวที่แยกกันจะตัดสินใจขัดกันเรื่องสไตล์และ interface ([Cognition](https://cognition.com/blog/dont-build-multi-agents)) สองฝั่งนี้ไม่ขัดกัน → Anthropic ได้กำไรจากงานอ่าน Cognition เตือนเรื่องผู้เขียนหลายตัว

สรุปกฎใช้งาน:

| ขนานแล้วคุ้ม | ขนานแล้วเสีย |
|---|---|
| ค้น · อ่าน codebase · วิจัย · ตรวจหลายมุม (อ่านอย่างเดียว) | หลายตัวแก้ไฟล์เดียวกัน → ทับกัน |
| ผู้เขียน 1 ตัว + ผู้ตรวจอ่านอย่างเดียวหลายตัว | งานเล็กเกินไป → ค่าเปิด agent แพงกว่างาน |
| แบ่งไฟล์และ interface ให้ชัดก่อน แล้วค่อยปล่อยผู้เขียน | คำสั่งกำกวม → ทำงานซ้ำกัน |
| debug แบบหลายสมมติฐานแข่งกัน | งานที่ต้องตัดสินใจร่วม (สไตล์ · API) แต่แยกคนเขียน |

คอขวดจริงของคนทำคนเดียวคือ **คนตรวจ** Simon Willison บอกว่าเขารับการเปลี่ยนแปลงใหญ่ได้ทีละ 1 ชิ้นเท่านั้น งานที่ขนานได้ดีคือวิจัย · proof of concept · อธิบายโค้ด · งานบำรุงเล็กๆ ([simonwillison.net](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/) — ประสบการณ์คนเดียว) Anthropic แนะนำ 3–5 ตัว และ "3 ตัวที่โฟกัสมักชนะ 5 ตัวที่กระจัดกระจาย" ([Agent teams docs](https://code.claude.com/docs/en/agent-teams)) → สำหรับ JK เพดานที่สมเหตุสมผลคือผู้เขียน 2–4 ตัว + ผู้ช่วยอ่านอย่างเดียว

## Claude Code มีเครื่องมือขนาน 6 แบบ เลือกตามจำนวนและชนิดงาน

เอกสารทางการ (อ่านเมื่อ 19 ต.ค. 2026) แบ่งไว้ชัด → subagent สำหรับ "งานฝากไม่กี่ชิ้นต่อรอบ" · agent teams สำหรับ "เพื่อนร่วมงานที่ทำนานไม่กี่ตัว" · dynamic workflows สำหรับ "หลายสิบถึงหลายร้อย agent ต่อครั้ง" ([Workflows docs](https://code.claude.com/docs/en/workflows.md))

| เครื่องมือ | ใช้เมื่อ | ตัวเลขสำคัญ | ข้อควรรู้ |
|---|---|---|---|
| Subagent | งานย่อยไม่กี่ชิ้น | พร้อมกันได้ **20 ตัว**/เซสชัน (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) · ซ้อนลึก 3 ชั้น | รันเบื้องหลังเป็นค่าเริ่มตั้งแต่ v2.1.198 · context ใหม่ ส่งกลับแค่สรุป ([Sub-agents](https://code.claude.com/docs/en/sub-agents)) |
| Fork (`/subtask`) | งานย่อยที่ต้องรู้ทั้งบทสนทนา | ใช้ cache ของตัวหลักร่วมกัน | ถูกกว่า subagent ใหม่เมื่อ context เดียวกัน · fork ซ้อน fork ไม่ได้ ([Sub-agents](https://code.claude.com/docs/en/sub-agents)) |
| Git worktree | งานที่แก้ไฟล์และต้องแยกที่ | `claude -w <name>` · subagent ใส่ `isolation: worktree` | ค่าเริ่มแตก branch จาก **remote default branch** ไม่ใช่ HEAD ([Worktrees](https://code.claude.com/docs/en/worktrees)) |
| Agent teams | ผู้ร่วมงานที่ต้องคุยกัน | แนะนำ 3–5 ตัว · ใช้ token ราว **7 เท่า** (เฉพาะเมื่อ teammate อยู่ใน plan mode) | **ยังเป็น experimental ปิดอยู่** · ไม่แยก worktree ให้ · ใช้ใน `-p` ไม่ได้ ([Agent teams](https://code.claude.com/docs/en/agent-teams), [Costs](https://code.claude.com/docs/en/costs.md)) |
| Dynamic workflows / `/batch` / `ultracode` | fan-out ใหญ่ ทำซ้ำได้ | พร้อมกัน 16 ตัว · สูงสุด 1,000 ตัว/ครั้ง · `/batch` แบ่ง 5–30 หน่วย แต่ละหน่วยมี worktree ของตัวเอง | ผลกลางอยู่ในตัวแปรของ script → context ตัวหลักเก็บแค่คำตอบสุดท้าย · เตือนเมื่อเกิน 25 agent หรือ 1.5 ล้าน token ([Workflows](https://code.claude.com/docs/en/workflows.md), [Commands](https://code.claude.com/docs/en/commands.md)) |
| Headless `claude -p` / Agent Software Development Kit (SDK) | script รันหลายตัวพร้อมกัน | `--max-budget-usd` · `--output-format json` · `--json-schema` | `--bare` ต้องใช้ `ANTHROPIC_API_KEY` → คิดเงินตาม API ไม่ใช่ subscription · `-p --worktree` ไม่ลบ worktree ให้ ([Headless](https://code.claude.com/docs/en/headless.md)) |

สิ่งที่ต้องระวังมากสุดคือ **กับดัก worktree** subagent ที่มี `isolation: worktree` จะเริ่มจาก branch หลักบน remote ไม่ใช่งานที่กำลังทำอยู่ ถ้าตั้ง `worktree.baseRef: "head"` ก็จะได้ commit ล่าสุดในเครื่อง แต่ **งานที่ยังไม่ commit จะไม่ตามไป** ทั้งสองแบบ (ข้อหลังเป็นการอนุมานจาก "branch from HEAD") นอกจากนี้ระบบกันการแก้ checkout หลักผ่าน Edit และ git แต่ **ไม่กัน `cp` หรือ `>`** และ worktree คือ checkout ใหม่ → ต้องติดตั้ง dependency ใหม่ทุกครั้ง ไฟล์ที่ gitignore เช่น `.env` ใส่ใน `.worktreeinclude` เพื่อคัดลอกตาม ([Worktrees](https://code.claude.com/docs/en/worktrees))

เพดานจริงของคนใช้ subscription ไม่ใช่ 20 subagent แต่คือ **รอบโควตา 5 ชั่วโมงและรอบรายสัปดาห์** ทุก subagent · workflow agent · teammate ส่ง request ของตัวเองกินโควตาเดียวกัน ([Costs](https://code.claude.com/docs/en/costs.md)) ฝั่ง API ถูกจำกัดด้วย Input Tokens Per Minute (ITPM) แต่ token ที่อ่านจาก cache ส่วนใหญ่ไม่นับ → cache สูงเท่าไร ขนานได้มากเท่านั้น ([API rate limits](https://platform.claude.com/docs/en/api/rate-limits)) จำนวนโควตาของ Pro/Max ไม่ได้ประกาศในเอกสาร Claude Code

**เครื่องมือจากชุมชน** เกือบทุกตัวใช้หลัก "1 agent = 1 worktree" บน Windows ตัวเลือกจำกัด → Conductor เป็น Mac อย่างเดียว · Sculptor ยังไม่รองรับ Windows · claude-squad ต้องใช้ tmux (ต้องพึ่ง Windows Subsystem for Linux 2 (WSL 2)) ตัวที่รัน Windows ได้คือ Nimbalyst (ชื่อเดิม Crystal) และ Vibe Kanban แต่ **บริษัท Vibe Kanban ปิดตัวแล้ว 10 เม.ย. 2026** เหลือชุมชนดูแล ([GitHub vibe-kanban](https://github.com/BloopAI/vibe-kanban), [dev.to](https://dev.to/stravukarl/best-tools-for-managing-parallel-ai-coding-agents-in-2026-14l8)) บทความเปรียบเทียบทั้ง 2 ชิ้นที่ใช้ **เขียนโดยเจ้าของเครื่องมือคู่แข่ง** (CEO ของ Nimbalyst และผู้สร้าง Parallel Code) การรองรับ Windows ของ Vibe Kanban มีแหล่งเดียว ([parallelcode.app](https://parallelcode.app/blog/multi-agent-coding-tools-2026/)) ส่วน container-use ของ Dagger ให้ 1 agent = 1 container + 1 branch น่าจะใช้กับ Docker Desktop ได้แต่ยังไม่มีใครยืนยัน และยัง "อยู่ระหว่างพัฒนาช่วงต้น" ([GitHub container-use](https://github.com/dagger/container-use)) Ruflo (ชื่อเดิม claude-flow) มีดาวราว 76.8k แต่ตัวเลข benchmark **รายงานเอง ไม่มีใครตรวจซ้ำ** ([GitHub ruflo](https://github.com/ruvnet/claude-flow)) → ข้อสรุป: เครื่องมือชุมชนตายหรือเปลี่ยนชื่อเร็ว (Vibe Kanban, Crystal, Opcode ในราว 18 เดือน) ใช้ของในตัวของ Claude Code + `git worktree` ธรรมดาเสี่ยงน้อยกว่า

## ความเร็วต่อขั้น: ลด effort กับเรียก tool พร้อมกัน คุ้มกว่า fast mode

ทุกขั้นของ agent = รอ token แรก + สร้าง token + รอ tool ดังนั้นคันโยกมี 5 ตัว

**1. Effort** เป็นคันโยกหลักบนโมเดล 5.x เพราะ **ปิด thinking บน Opus 5.5 · Sonnet 5.5 · Haiku 5.5 ไม่ได้** (ส่ง disabled แล้ว error 400) ระดับมี `low` · `medium` · `high` · `xhigh` · `max` ค่าเริ่มของ Opus 5.5 / Sonnet 5.5 / Haiku 5.5 ใน Claude Code คือ `medium` effort ต่ำ → "เรียก tool น้อยลงและรวมกัน ไม่เกริ่น ตอบสั้น" ([Effort](https://platform.claude.com/docs/en/build-with-claude/effort), [Model config](https://code.claude.com/docs/en/model-config)) thinking token คิดเงินเป็น output token และอาจถึงหลายหมื่นต่อ request ([Costs](https://code.claude.com/docs/en/costs)) ข้อดีอีกข้อ → บนโมเดล 5.5 **เปลี่ยน effort แล้ว cache ไม่หาย** แต่เปลี่ยนโมเดล cache หาย ([Prompt caching](https://code.claude.com/docs/en/prompt-caching)) ดังนั้นเวลางานพลาด ขยับ effort ก่อนขยับโมเดลจะถูกกว่า subagent ตั้ง `effort:` ใน frontmatter ได้ ข้อเสีย → Haiku 5.5 ที่ `low` กับ prompt ยาว "มีแนวโน้มข้ามการค้นหรือการตรวจ" และ `max` "เสี่ยงคิดเกิน" Anthropic **ไม่ประกาศตัวเลขเวลาที่ประหยัดได้ต่อระดับ effort**

**2. เลือกโมเดล** ราคาต่อ Million Tokens (MTok) ขาเข้า/ขาออก → Opus 5.5 $4/$20 · Sonnet 5.5 $2/$10 · Haiku 5.5 เริ่ม $0.10/$0.50 ([Models overview](https://platform.claude.com/docs/en/about-claude/models/overview)) ตัวเลขวัดจริงมาจาก Artificial Analysis แหล่งเดียว ไม่บอกวันที่วัด:

| โมเดล (effort medium) | Output Tokens Per Second (OTPS) | Time to First Token (TTFT) |
|---|---|---|
| Haiku 5.5 | ~179 | ~14.2 วินาที |
| Sonnet 5.5 | ~109 | **~1.1 วินาที** |
| Opus 5.5 | ~82 | ~19.3 วินาที |

([Artificial Analysis Opus 5.5](https://artificialanalysis.ai/models/claude-opus-5-5-medium), [Haiku vs Sonnet](https://artificialanalysis.ai/models/comparisons/claude-haiku-5-5-medium-vs-claude-sonnet-5-5-medium)) ความหมาย → ขั้นสั้นๆ ที่เรียก tool บ่อย Sonnet 5.5 ตอบไวสุด เพราะ TTFT เป็นตัวกินเวลา Haiku 5.5 ชนะเมื่อต้องสร้างข้อความยาวและเมื่อเน้นราคา ข้อสังเกต → TTFT ของ Haiku ที่สูงขัดกับป้าย "Fastest" ของ Anthropic น่าจะเพราะนับเวลาคิดก่อนตอบด้วย (อนุมาน หน้าเว็บไม่ได้อธิบาย) Haiku 5.5 ยังคิดราคาแพงขึ้น 5 เท่าเมื่อ prompt เกิน 100,000 token ([Pricing](https://platform.claude.com/docs/en/about-claude/pricing)) Claude Code แนะนำ Sonnet สำหรับงานโค้ดส่วนใหญ่ Opus สำหรับสถาปัตยกรรมและเหตุผลหลายขั้น และ `model: haiku` สำหรับ subagent งานง่าย ([Costs](https://code.claude.com/docs/en/costs))

**3. Fast mode** ใช้ Opus ตัวเดิมบนเครื่องที่เร็วกว่า → **OTPS สูงขึ้นสูงสุด 2.5 เท่า แต่ TTFT ไม่เร็วขึ้น** และราคา 2 เท่า ($8/$40 บน Opus 5.5) ใช้ได้กับ Opus เท่านั้น ([API fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)) ใน Claude Code เปิดด้วย `/fast` แต่ผู้ใช้ subscription **จ่ายจาก usage credits เท่านั้น ไม่รวมในโควตา** ควรเปิดตั้งแต่ต้นเซสชัน เพราะครั้งแรกที่เปิดจะอ่านบทสนทนาทั้งหมดแบบไม่มี cache ในราคา fast และยังเป็น research preview ([Claude Code fast mode](https://code.claude.com/docs/en/fast-mode)) ไม่มีใครวัดความเร็วจริงแบบอิสระ → คุ้มเฉพาะขั้นที่สร้างข้อความยาว เช่น แก้โค้ดชิ้นใหญ่ ขั้นสั้นที่รอ tool แทบไม่ได้อะไร

**4. Prompt caching** อ่าน cache ราคาแค่ **0.05 เท่า** ของ input บน Opus 5.5 และ Sonnet 5.5 และ TTFT ดีขึ้น แต่ Anthropic ไม่ให้ตัวเลขเวลา ([Pricing](https://platform.claude.com/docs/en/about-claude/pricing), [Prompt caching API](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)) ใน Claude Code มีกฎที่ใช้กับ skill ของ JK โดยตรง 3 ข้อ → subagent ใหม่ **ไม่อ่าน cache ของตัวหลัก** แต่ fork อ่านได้ · subagent ได้ cache อายุแค่ **5 นาที** แม้บน subscription (ปรับเป็น `subagentPromptCacheTtl: "1h"` ได้ แต่เขียน cache แพงกว่า) · agent 2 ตัวที่ใช้ **โมเดล + effort + ชนิด agent + tools + โฟลเดอร์เดียวกัน** สร้าง prefix เดียวกัน ตัวที่เริ่มทีหลังอ่าน cache ของตัวแรกได้ ([Prompt caching](https://code.claude.com/docs/en/prompt-caching), [Workflows](https://code.claude.com/docs/en/workflows)) สิ่งที่ทำ cache หาย → เปลี่ยนโมเดล (รวม `opusplan`) · เปิด fast mode ครั้งแรก · เพิ่ม/ถอด MCP server · compact ดังนั้น "เลือกโมเดลและ effort ตั้งแต่ต้นเซสชัน แล้ว `/compact` ที่จุดพัก"

**5. เรียก tool พร้อมกันและลด context** โมเดลรุ่น 4 ขึ้นไปเรียกหลาย tool ในข้อความเดียวได้อยู่แล้ว และ Anthropic ให้ prompt `<use_parallel_tool_calls>` ที่ดันให้ทำเกือบ 100% ([Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)) ทุกรอบที่เลี่ยงได้ = ประหยัด TTFT 1 ครั้ง (1–19 วินาทีตามตารางข้างบน — อนุมาน) ไม่มีใครวัดเวลาที่ได้จริง Programmatic Tool Calling ลด token จาก 43,588 เหลือ 27,297 (37%) ([Anthropic: advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) — ผู้ผลิตวัดเอง) เอกสารเดียวกันเตือนอีกด้าน → Opus รุ่นใหม่ "ชอบส่ง subagent ทั้งที่ grep ตรงๆ เร็วกว่า" ฝั่ง context → hook กรอง output ลด log หมื่น token เหลือหลักร้อย · `/clear` ฟรี · `/compact` เองเป็น request ใหญ่ · `/rewind` ตัดกลับไปที่ prefix ที่ cache อยู่แล้ว · Command-Line Interface (CLI) อย่าง `gh` ยังประหยัดกว่า Model Context Protocol (MCP) แม้ MCP จะโหลดแค่ชื่อ tool แล้ว · plugin Language Server Protocol (LSP) "go to definition" 1 ครั้งแทน grep + อ่านหลายไฟล์ · CLAUDE.md ไม่เกิน 200 บรรทัด ([Costs](https://code.claude.com/docs/en/costs))

## บน Windows 11 + Docker Desktop ให้ worktree ก่อน Docker

ตัวเลขของ JK เองชี้ชัด → build image ฐานครั้งแรก **5–15 นาที** และ `npm ci` แค่ 2 แพ็กเกจในโหมด mount บนโฟลเดอร์ OneDrive ใช้ **52 วินาที** (จาก `docker-sandbox/SKILL.md` ของ JK) Docker ยืนยันว่า bind mount จากระบบไฟล์ Windows คือทางช้า ควรวางไฟล์ในระบบไฟล์ Linux ของ WSL 2 ([Docker WSL best practices](https://docs.docker.com/desktop/features/wsl/best-practices/)) worktree เป็นคำสั่ง git ในเครื่อง ไม่ต้องสตาร์ต container แต่ทั้งสองทางต้องติดตั้ง dependency ใหม่ต่อสำเนา → Docker แพงกว่าตรงค่าสตาร์ต image/container ที่บวกเพิ่ม ยังไม่มีใครวัด `git worktree add` + install บน NTFS เทียบกับ Docker → **วัดเองครั้งเดียวบน sample-app** จะปิดช่องนี้ได้

ข้อแนะนำ → งานลองหลายทางที่เป็นโค้ดของตัวเอง ใช้ `isolation: worktree` + `worktree.baseRef: "head"` · Docker โหมด isolated เก็บไว้สำหรับโค้ดที่ไม่ไว้ใจ งานรันข้ามคืน หรือเมื่อ 2 ทางใช้ port / ฐานข้อมูลเดียวกัน (worktree ไม่แยก port และฐานข้อมูล — อนุมาน) agent teams บน Windows ใช้ได้เฉพาะโหมด in-process เพราะ split pane ไม่รองรับ Windows Terminal และ VS Code terminal ([Agent teams](https://code.claude.com/docs/en/agent-teams)) hook กรอง output บน Windows ควรเขียนเป็น PowerShell หรือรันผ่าน Git Bash

## Skill ของ JK ขาด 3 อย่าง: กฎขนานกลาง · effort · ทางลัดของรอบ review

อ่าน 7 ไฟล์ใน `plugins/software-company/skills/` แล้วพบว่า **ส่วนที่ขนานอยู่แล้วทำถูก** → `parallel-split-and-merge` สั่ง "ปล่อยทุกตัวในข้อความเดียว" และจำกัด 8 ตัว (ต่ำกว่าเพดาน 20 อย่างปลอดภัย) · `parallel-attempts-pick-best` ส่งทุกตัวพร้อมกัน · การโหวต 3 มุมใน `superuser` ส่งพร้อมกัน ปัญหาอยู่ที่ส่วนอื่น

**ไม่มีกฎขนานกลาง** `superuser` บรรทัด 101 กำหนดรูปแบบ brief แต่ไม่มีกฎ "งานไม่พึ่งกันส่งในข้อความเดียว" สำหรับการอ่านของหัวหน้าทีมเองหรือผู้ตรวจหลายมุม และ `context-budget` บรรทัด 54 บอก "เปิดมากกว่า 3 ไฟล์ → ส่ง subagent" ซึ่งขัดกับคำเตือนของ Anthropic เพราะไฟล์ที่รู้ตำแหน่ง 4–6 ไฟล์ อ่านพร้อมกันเองเร็วกว่าเปิด subagent ใหม่ (ยังไม่มีตัวเลขเวลาเปิด subagent)

**ระดับโมเดลไม่ผูก effort** `superuser` บรรทัด 102 และ `team-roles.md` บรรทัด 9–11 ระบุแค่ `opus` / `sonnet` / `haiku` ไม่พูดถึง effort · fast mode · cache เลย และ `parallel-attempts-pick-best` บรรทัด 22 ผสมโมเดลเพื่อความหลากหลาย ซึ่งทำให้ไม่ได้ใช้ cache ร่วม

**รอบ review เป็นโซ่ยาว** งานกลางขึ้นไปใช้ `reviewer` ตัวใหม่บน Opus **ทุกรอบ สูงสุด 5 รอบ** (`superuser` L19, `team-roles.md` L34) บวก `learning-reviewer` ที่ต้องรอก่อนตอบ (L207) และแต่ละขั้นลองได้ 3 ครั้ง → กรณีแย่สุด 3 × 5 รอบต่อขั้น ผู้ตรวจไม่นับในงบลูกทีม (L53) จึงไม่มีแรงกดให้ลดรอบ หลักฐานจาก MAST บอกว่าขั้นตรวจมีค่าที่สุด จึง **ไม่ควรตัด reviewer รอบแรก** แต่รอบ 2 ขึ้นไปตรวจแค่ข้อเดิม + diff ที่แก้ก็พอ ยังไม่มีข้อมูลว่ารอบที่ 2+ เจอข้อใหม่บ่อยแค่ไหน → log `review` ใน `.claude/superuser/log/<date>/main.jsonl` ของ JK มีรอบและจำนวนข้อต่อระดับอยู่แล้ว วิเคราะห์ครั้งเดียวก็ตอบได้

ส่วนอื่นที่ล้าสมัย → `parallel-split-and-merge` L17 พูดถึง "worktree หรือโฟลเดอร์" แต่ไม่รู้จัก `isolation: worktree` และกับดัก base branch ซึ่งสำคัญมาก เพราะ `superuser` L155 ห้าม commit โดยไม่ขออนุมัติ → งานค้างมักไม่ได้ commit → ผู้แก้ใน worktree จะแก้โค้ดเก่า · `docker-sandbox` L24/L35/L146 ส่งการลองหลายทางเข้าห้อง Docker ซึ่งช้าสุดบนเครื่อง JK · `context-budget` L37/L160 ยังบอกว่า schema MCP กินหลักพัน token ต่อ server (ล้าสมัยหลัง deferred loading) · L163 บอก `/compact` "เมื่อใกล้เต็ม" ขัดกับคำแนะนำ "ที่จุดพัก" และไม่มี `/rewind` · ไม่มี hook กรอง output · ตัวเลขอ้างหัวข้อใน L52–L55 เลื่อนไป 1 ข้อ ยังไม่ได้อ่าน `superuser/references/agents.md` และ `adversarial-review-panel` → บางข้อด้านล่างอาจซ้ำกับที่มีอยู่แล้ว

## ลำดับสิ่งที่ควรแก้ใน skill

เรียงตาม (เวลาที่ได้ ÷ ความเสี่ยง) มากไปน้อย

| # | แก้อะไร | ที่ไหน | ได้อะไร | ความเสี่ยง |
|---|---|---|---|---|
| 1 | เพิ่มกฎ "ขนานเป็นค่าเริ่ม" → อ่านหลายไฟล์ · grep หลายคำ · ลูกทีมคนละชิ้น · ผู้ตรวจคนละมุม ส่งในข้อความเดียว · พึ่งผลกันเท่านั้นจึงทำต่อกัน · งานเล็กทำเองไม่ส่ง subagent | `superuser/SKILL.md` หลัง L101 | สูง ทุกงาน (ลดรอบ TTFT) | ต่ำมาก |
| 2 | ระดับ = โมเดล + effort → ใหญ่ `opus`+`high` (ตัดสิน · reviewer) · กลาง `sonnet`+`medium` · เล็ก `haiku`+`low` (ค้น · นับ · กลไก) · พลาด → ขึ้น effort 1 ขั้นก่อน แล้วค่อยขึ้นโมเดล · ใส่ `effort:` ใน frontmatter ของ agent | `superuser` L102 · `team-roles.md` L9–11 · ไฟล์ agent | สูง (thinking token คือเวลาหลัก) | ต่ำ–กลาง (reviewer ต้องคง `high`) |
| 3 | ย่อรอบ review งานกลาง → รอบ 1 `reviewer` ตัวใหม่บน Opus · รอบ 2+ ตัวใหม่บน `sonnet`/`medium` ตรวจแค่ข้อเดิม + diff · งานกลางสูงสุด 3 รอบ · คง 5 รอบสำหรับงานใหญ่ / เงิน / กฎหมาย / สุขภาพ · ใช้ผล test เป็นหลักฐานภายนอก | `superuser` L19 · `team-roles.md` L34 | สูงในงานกลาง | กลาง → ตรวจ log review ก่อนตั้งเพดาน |
| 4 | ลองหลายทาง / แยกผู้แก้ → ใช้ `isolation: worktree` + `worktree.baseRef: "head"` + `.worktreeinclude` สำหรับ `.env` · ก่อนปล่อยต้องขออนุมัติ commit WIP (Work In Progress) หรือใช้ worktree เฉพาะงานอ่าน / งานใหม่ · ห้าม `cp` หรือ `>` กลับ checkout หลัก · Docker เฉพาะโค้ดไม่ไว้ใจ / ข้ามคืน / ชน port | `parallel-split-and-merge` L17 · `parallel-attempts-pick-best` L24 · `docker-sandbox` L24/L35/L146 | สูงบน Windows | ต่ำ–กลาง (ต้องเขียนเรื่องกับดัก base branch ให้ชัด) |
| 5 | ย้าย `learning-reviewer` ออกจากเส้นทางหลัก → ส่งพร้อม `reviewer` รอบสุดท้ายแบบเบื้องหลัง หรือข้ามเมื่อไม่มีการแก้จากผู้ใช้ · ไม่มี `ติด` · ไม่มีขั้นที่ลองซ้ำ | `superuser` L205–207 | กลาง (ตัด 1 agent ต่อเนื่องต่องาน) | ต่ำ |
| 6 | ใช้คนแก้ตัวเดิมระหว่างรอบ review (SendMessage ไปตัวเดิม ได้ cache อุ่นและไม่ต้องอ่านไฟล์ใหม่) · ผู้ตรวจยังเป็นตัวใหม่เสมอ | `superuser` L101 · `team-roles.md` L28 | กลาง | ต่ำ |
| 7 | ตรวจหลายมุมในข้อความเดียวสำหรับงานใหญ่ → 2–3 ผู้ตรวจอ่านอย่างเดียว (ถูกต้อง · ความปลอดภัย · test/UX) ชนิด + โมเดล + effort เดียวกันเพื่อแชร์ cache · prompt ส่วนที่เหมือนกันไว้หน้า ส่วนเฉพาะไว้ท้าย | `team-roles.md` L10 (ตรวจกับ `adversarial-review-panel` ก่อน) | กลาง–สูง (ลดจำนวนรอบ) | ต่ำ–กลาง (token เพิ่ม) |
| 8 | ปรับ `context-budget` → เพิ่ม hook กรอง output (PreToolUse บน Bash สำหรับ test · PostToolUse `updatedToolOutput` ตัด output ยาว) แทนวินัย `tail` ใน L112 · แก้ข้อความ MCP L37/L160 · L163 เป็น "`/compact <สิ่งที่ต้องเก็บ>` ที่จุดพัก · ทางที่ทิ้ง → `/rewind` · เปลี่ยนเรื่อง → `/clear`" · เพิ่ม LSP สำหรับ C#/.NET และ TypeScript · แก้เลขข้อ L52–55 · เปลี่ยน L54 จาก "มากกว่า 3 ไฟล์" เป็น "ต้อง *ค้น* ข้ามหลายไฟล์" | `context-budget/SKILL.md` | กลาง (ทุก agent context เล็กลง) | ต่ำ |
| 9 | ใช้ dynamic workflow เมื่อเกิน 8 ชิ้น หรืองานซ้ำ (audit รายไฟล์ · migrate · วนแก้จน `tsc` ผ่าน หรือ 2 รอบไม่คืบ) | `parallel-split-and-merge` หลัง L18 · ตาราง `agent-patterns` | สูงในงานใหญ่ | กลาง (ฟีเจอร์ใหม่ · token สูง) |
| 10 | ผู้โหวต 3 มุม → ชนิดเดียวกันบน `sonnet` + `low`/`medium` เพื่อแชร์ cache · attempts ใช้ข้อจำกัดต่างกัน (L23) เป็นค่าเริ่ม ผสมโมเดลเมื่อไม่พอ | `superuser` L135 · `parallel-attempts-pick-best` L22 | ต่ำ–กลาง | ต่ำ |
| 11 | เพิ่มคอลัมน์ "เวลา" ใน `agent-patterns` → MoA (Mixture-of-Agents) แรง 3–5 เท่าแต่เวลาราว 1 รอบเมื่อส่งพร้อมกัน · Reflection เป็นรอบต่อเนื่อง · เขียนว่า **ไม่เปิด agent teams เป็นค่าเริ่ม** (token สูง · เปลี่ยน subagent ที่มีชื่อเป็น teammate เอง · teammate ส่ง subagent เบื้องหลังไม่ได้ · ขัดกับหลัก "หัวหน้าเขียนไฟล์กลางคนเดียว") ใช้เฉพาะ debug หลายสมมติฐาน | `agent-patterns` L15–19 | กันช้า | ไม่มี |
| 12 | Fast mode เป็นตัวเลือกของเซสชันหัวหน้าทีมเท่านั้น → Opus · จ่ายด้วย usage credits · เปิดตอนเริ่มเซสชัน · คู่กับ effort ต่ำ · ใช้กับขั้นสร้างข้อความยาว | ใกล้ `superuser` L102 | สูงสุด 2.5 เท่าเฉพาะขั้นที่หัวหน้าสร้างข้อความ | ค่าใช้จ่าย 2 เท่า |

ตั้งค่าเพิ่มในโปรเจกต์ (ไม่ต้องแก้ skill): ใส่ `.claude/worktrees/` ใน `.gitignore` · ตั้ง `worktree.baseRef: "head"` · พิจารณา `subagentPromptCacheTtl: "1h"` เฉพาะเมื่อรอบ review ห่างกันเกิน 5 นาทีบ่อย

## ช่องว่างของหลักฐาน

ส่วนที่ยังไม่มีคำตอบ → ไม่มีตัวเลขทางการของ TTFT / OTPS ของโมเดล 5.x จาก Anthropic (มีแต่ป้าย "Fast" "Moderate") · ไม่มีตัวเลขเวลาต่อระดับ effort · ไม่มีการวัดอิสระของ fast mode และของ parallel tool calls · ไม่มีตัวเลขเวลาเปิด subagent · ไม่รู้ว่า subagent ธรรมดาได้ fast mode ตามหัวหน้าหรือไม่ และ Agent tool รับ `effort` ต่อการเรียกหรือไม่ (ยืนยันได้แค่ `model` ต่อการเรียกและ `effort` ใน frontmatter) · ไม่มีงานวัดความเร็วของเครื่องมือชุมชนที่ตรวจโดยคนกลาง · งานวิจัยโค้ดปี 2026 ทั้ง 3 ชิ้นเป็น preprint แหล่งเดียว ยังไม่มีใครทำซ้ำ · ตัวเลข tier ของ API rate limit มาจากตัวสรุปอัตโนมัติ ควรเช็กหน้าเว็บจริงก่อนใช้ · จำนวนคิว background session พร้อมกันของ agent view ยังไม่พบ

## สรุป

ความเร็วของงาน agent ไม่ได้มาจากจำนวน agent แต่มาจาก **จำนวนรอบที่ต้องรอ** ทุกจุดที่ JK ตัดรอบได้ → เรียก tool พร้อมกัน · effort ต่ำในงานกลไก · review รอบหลังตรวจแค่ diff · learning-reviewer ไม่ขวางทาง ได้ผลกับทุกงาน ขณะที่การขนานผู้เขียนได้ผลกับงานบางชนิดเท่านั้น และได้ไม่เกินราว 2 เท่าแม้วางแผนดี ข้อที่ไม่ชัดในตอนแรกคือ skill ของ JK ขนานถูกต้องแล้วในจุดที่ "ตั้งใจขนาน" แต่เวลาส่วนใหญ่หายไปในโซ่ review ที่เขียนไว้แบบต่อเนื่อง และในการใช้ Docker เป็นที่แยกงานบนเครื่อง Windows

ก้าวต่อไปที่ถูกสุด → วิเคราะห์ log review ที่มีอยู่แล้วเพื่อตั้งเพดานรอบของงานกลางจากข้อมูลจริง และจับเวลา worktree เทียบ Docker บน sample-app 1 ครั้ง สองตัวเลขนี้จะเปลี่ยนข้อ 3 และข้อ 4 จากการอนุมานเป็นข้อเท็จจริงของเครื่อง JK เอง

## Sources

เอกสารทางการ Claude Code (code.claude.com)
- Run agents in parallel — https://code.claude.com/docs/en/agents.md
- Sub-agents — https://code.claude.com/docs/en/sub-agents
- Agent SDK subagents — https://code.claude.com/docs/en/agent-sdk/subagents.md
- Agent teams — https://code.claude.com/docs/en/agent-teams
- Worktrees — https://code.claude.com/docs/en/worktrees
- Workflows — https://code.claude.com/docs/en/workflows.md
- Commands — https://code.claude.com/docs/en/commands.md
- Agent view — https://code.claude.com/docs/en/agent-view.md
- Headless — https://code.claude.com/docs/en/headless.md
- Costs — https://code.claude.com/docs/en/costs
- Model configuration — https://code.claude.com/docs/en/model-config
- Fast mode — https://code.claude.com/docs/en/fast-mode
- Prompt caching — https://code.claude.com/docs/en/prompt-caching
- Hooks — https://code.claude.com/docs/en/hooks
- Settings reference — https://code.claude.com/docs/en/settings-reference.md

เอกสารทางการ Claude Platform (platform.claude.com)
- Models overview — https://platform.claude.com/docs/en/about-claude/models/overview
- Pricing — https://platform.claude.com/docs/en/about-claude/pricing
- Effort — https://platform.claude.com/docs/en/build-with-claude/effort
- Fast mode (API) — https://platform.claude.com/docs/en/build-with-claude/fast-mode
- Prompt caching (API) — https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Parallel tool use — https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
- Prompting best practices — https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Batch processing — https://platform.claude.com/docs/en/build-with-claude/batch-processing
- API rate limits — https://platform.claude.com/docs/en/api/rate-limits

Anthropic Engineering (ผู้ผลิตเขียนเอง)
- Multi-agent research system — https://www.anthropic.com/engineering/multi-agent-research-system
- Advanced tool use — https://www.anthropic.com/engineering/advanced-tool-use
- Code execution with MCP — https://www.anthropic.com/engineering/code-execution-with-mcp

งานวิจัย (preprint แหล่งเดียว เว้น MAST ที่ผ่าน NeurIPS 2025)
- MAST: Why Do Multi-Agent LLM Systems Fail? — https://arxiv.org/html/2503.13657v3
- Co-Coder — https://arxiv.org/abs/2606.00953
- Agent PR merge conflicts — https://arxiv.org/html/2607.04697v2
- NP-Bench (ผู้เขียนมีส่วนได้เสีย) — https://arxiv.org/abs/2610.07261

ผู้ปฏิบัติและบทความความเห็น
- Cognition, Don't Build Multi-Agents — https://cognition.com/blog/dont-build-multi-agents
- Simon Willison, parallel coding agents — https://simonwillison.net/2025/Oct/5/parallel-coding-agents/

ข้อมูลวัดจากบุคคลที่สาม
- Artificial Analysis: Opus 5.5 medium — https://artificialanalysis.ai/models/claude-opus-5-5-medium
- Artificial Analysis: Haiku 5.5 vs Sonnet 5.5 — https://artificialanalysis.ai/models/comparisons/claude-haiku-5-5-medium-vs-claude-sonnet-5-5-medium
- Docker WSL best practices — https://docs.docker.com/desktop/features/wsl/best-practices/

เครื่องมือชุมชน (บทความเปรียบเทียบเขียนโดยเจ้าของเครื่องมือคู่แข่ง)
- claude-squad — https://github.com/smtg-ai/claude-squad
- Vibe Kanban — https://github.com/BloopAI/vibe-kanban
- ccmanager — https://github.com/kbwo/ccmanager
- container-use — https://github.com/dagger/container-use
- Ruflo (claude-flow) — https://github.com/ruvnet/claude-flow
- Sculptor — https://imbue.com/sculptor
- dev.to comparison (CEO ของ Nimbalyst) — https://dev.to/stravukarl/best-tools-for-managing-parallel-ai-coding-agents-in-2026-14l8
- parallelcode.app comparison (ผู้สร้าง Parallel Code) — https://parallelcode.app/blog/multi-agent-coding-tools-2026/
- Cursor background agents (morphllm) — https://www.morphllm.com/cursor-background-agents
