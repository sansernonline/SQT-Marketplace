---
name: skill-authoring
description: Use when creating or changing a skill, agent or playbook in this marketplace, writing evals for one, or /skill-doctor shows a skill never used.
---

# skill-authoring — เขียน skill ให้ถูกเรียก ทำตามได้ และวัดได้

อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies` · ถ้อยคำใน skill เขียนตาม `human-writing` · กฎที่ validator บังคับอยู่ในหัวข้อ 5 รูปแบบ eval ทางการอยู่ใน [`eval-format`](references/eval-format.md)

> **กฎข้อเดียว:** skill ที่ไม่เคยเห็น agent พลาดโดยไม่มีมัน และไม่เคยเห็นมันถูกเรียกเอง ยังไม่ใช่ skill ที่เสร็จ — ทุกตัวใหม่มี eval 3 เคสและผ่านรอบทดสอบก่อนและหลัง

## ใช้เมื่อ

- สร้าง skill agent หรือ playbook ใหม่ใน `plugins/<plugin>/` · แก้ description หรือย้าย skill ข้าม plugin
- เขียนหรือแก้ eval ของ skill · `/skill-doctor` หรือ `scripts/evals/triggers` บอกว่า skill ไม่ถูกเรียก
- ตรวจ skill ที่คนอื่นเขียนก่อนรวม

ไม่ใช้เมื่อ: บทเรียนจากงานยังไม่ได้กรอง → `session-lessons-to-skills` ก่อน (ที่นั่นตัดสินว่าแก้ skill ไหน แล้วมาที่นี่เพื่อแก้ให้ถูกแบบ) · ความผิดซ้ำที่ทำเป็นตัวตรวจอัตโนมัติได้ → `repeated-mistakes-to-checks` · หัวหน้าทีมแจกงานเขียน skill เป็นหลายขั้นให้ลูกทีม → playbook `skill-authoring` ใน plugin `software-company` (`skills/superuser/references/playbook-skill-authoring.md` ขั้น 5 ทดสอบปิดตา) ซึ่งใช้กฎในไฟล์นี้

## 1 · ชื่อและ description — ส่วนเดียวที่ตัดสินว่า skill จะถูกเรียกไหม

ตอนเริ่ม session Claude เห็นแค่ `name` + `description` ของทุก skill เนื้อ SKILL.md โหลดเมื่อถูกเรียกเท่านั้น และรายการนี้มีงบราว 1% ของ context ตัวที่ไม่ค่อยถูกเรียกจะถูกตัดคำอธิบายเหลือแค่ชื่อก่อน (`จากแหล่ง` เอกสาร Claude Code หน้า skills · 2026-10-23) · ชื่อจึงต้องบอกงานได้ด้วยตัวเอง และ description ต้องบอกว่า "ใช้เมื่อไหร่" ไม่ใช่ "ทำอะไร"

| กฎ | ทำอย่างไร | ใครบังคับ |
|---|---|---|
| `name` = ชื่อโฟลเดอร์ · a-z 0-9 และ `-` · ไม่เกิน 64 ตัว · ไม่มีคำว่า anthropic หรือ claude | ตั้งเป็นกริยา+กรรม หรือชื่อของที่ได้ (`translate-th-en` ไม่ใช่ `thai-helper`) | validator |
| ชื่อชนกับ skill ในตัวของ Claude Code (เช่น `simplify`) | ใน `skill-router.json` ใส่ชื่อ plugin นำหน้า `superuser:simplify` | sync-superuser |
| `description` ขึ้นต้น `Use when …` หรือ `ใช้เมื่อ …` | ใส่สถานการณ์และคำที่ผู้ใช้พิมพ์จริง ทั้งไทยและอังกฤษ ("says reflect or รวมบทเรียน") · ไม่สรุปขั้นตอนทำงาน เพราะ agent อาจทำตามสรุปแทนเปิด skill | validator · แนวคิดจาก obra/superpowers |
| ยาวไม่เกิน 160 ตัว (เตือนที่ 150 · agent เตือนที่ 120) · ไม่มี `: ` ในค่าที่ไม่ได้ครอบเครื่องหมายคำพูด · ไม่มี `<` `>` | `: ` ทำให้ YAML พังทั้งบล็อกแล้ว skill หายเงียบ ๆ · เขียน `(reflect or รวมบทเรียน)` แทน `: reflect` | validator (ทางการตัดที่ 1,536 ตัว แต่งบรายการทั้งชุดทำให้ยาวแล้วถูกตัดก่อน) |
| ไม่ทับกับ skill พี่น้อง | `grep -rn "^description:" plugins/*/skills/*/SKILL.md \| grep -i <คำ>` · ทับกัน → บอกใน description ว่าตัวไหนรับอะไร ("Cause known → targeted-fix") และใส่ตาราง "ใช้ตัวอื่นแทน" ในเนื้อ | คนเขียน |
| hook router เห็นด้วย | เพิ่ม pattern 1 แถวใน `plugins/superuser/hooks/skill-router.json` แล้วทดสอบด้วย `node -e` ว่าประโยคจริง 3–5 แบบจับได้ และประโยคที่ไม่เกี่ยวไม่จับ (ตัวอย่างในหัวข้อ 4) · แถวที่คนอ่านอยู่ใน `references/triggers.md` ของ `superuser` | sync-superuser ตรวจชื่อ |

ช่อง frontmatter ที่ใช้ได้ (`จากแหล่ง` หน้า skills · 2026-10-23): `name` · `description` · `when_to_use` (ต่อท้าย description ใช้ใส่วลีกระตุ้น — validator ของเรานับเฉพาะ description จึงใส่วลีไว้ใน description ก่อน) · `allowed-tools` · `disallowed-tools` · `disable-model-invocation: true` (skill ที่มีผลข้างเคียง เช่น deploy ให้คนเรียกเองเท่านั้น) · `user-invocable: false` (ซ่อนจากเมนู `/`) · `model` · `effort` · `context: fork` + `agent` (รันใน subagent) · `paths` (โหลดเฉพาะเมื่อแตะไฟล์ตาม glob) · `argument-hint` · `hooks` · `license` · `metadata` · **นอก Claude Code** (claude.ai · `dist/`) รับแค่ `name` `description` `license` `compatibility` `metadata` `allowed-tools` ช่องอื่นทำให้ไฟล์ถูกปฏิเสธ จึงใช้ช่องพิเศษเฉพาะ skill ที่ไม่ไป `dist/` · agent ใช้คีย์ `tools:` ไม่ใช่ `allowed-tools:` (ใส่ผิดถูกเมินเงียบ ๆ)

## 2 · รูปร่างของเนื้อ SKILL.md

- **ไม่เกิน 500 บรรทัด** (validator ไม่ผ่าน) · รายละเอียดที่ใช้บางครั้งย้ายไป `references/<เรื่อง>.md` (ไฟล์เกิน 300 บรรทัดต้องมีสารบัญ) · งานที่เครื่องทำได้ไป `scripts/` (รันโดยไม่ต้องอ่านเข้า context) · แม่แบบไป `templates/` หรือ `assets/`
- ลำดับหัวข้อแบบเดียวกันทุก skill ในแกน: บรรทัดบอกว่าอยู่ plugin ไหนและเขียนตาม `human-writing` → **กฎข้อเดียว** ในกล่อง `>` → **ใช้เมื่อ / ไม่ใช้เมื่อ** → ตาราง **ใช้ตัวอื่นแทนหรือคู่กัน** → ขั้นตอนหรือกฎเป็นเลขข้อ → **ตัวอย่างจริง 1 ชุด** (โจทย์ · สิ่งที่ทำ · ผล) → **ตรวจก่อนส่ง** → **ที่มา** ทุกข้อมีลิงก์และวันที่ดู หรือป้าย `(ยังไม่ได้ตรวจ)`
- เขียนเป็นคำสั่งตรง ๆ พร้อมเหตุผล 1 บรรทัด ไม่ตะโกนตัวพิมพ์ใหญ่ · กฎเรื่องคำหรือน้ำเสียงใส่เป็นคู่ `ก่อน → หลัง` ก่อน แล้วค่อยเป็นกฎเมื่อซ้ำ 2 ครั้ง (`session-lessons-to-skills` ข้อ 2)
- ข้อใหม่ขัดกับข้อเดิม → แก้ข้อเดิม ไม่ต่อท้าย · skill ที่รับงานต่อจากตัวอื่นชี้ชื่อตัวนั้นและหัวข้อ ไม่คัดลอกเนื้อ (ตัวอย่าง `translate-th-en` ชี้ `thai-grammar` หัวข้อ 7)
- ตัวเลขที่เปลี่ยนตามเวลา (ราคา · กฎ · รุ่น) ใส่วันที่ตรวจ และลงใน `scripts/check/facts.json` ถ้าอยากให้ validator เตือนเมื่อล้าสมัย
- **skill ที่ทำให้เสียเงินหรือสร้างของนอกเครื่อง** (เช่าเครื่อง cloud · GPU · สั่งซื้อ · API ที่คิดเงินต่อครั้ง) ต้องมีครบ 4 ข้อ: (1) เพดานเงินที่ผู้ใช้ตั้ง skill ขึ้นเพดานเองไม่ได้ ต้องถามก่อน (2) ไม่ลบหรือยกเลิกของผู้ใช้เองโดยไม่ถาม (3) ลบแล้วตรวจซ้ำว่าหายจริงด้วยคำสั่งดูรายการ แล้วสรุปค่าใช้จ่ายที่เกิดจริง (4) บอกให้ชัดว่าหยุด (stop) ไม่เท่ากับลบ (destroy) เพราะของที่แค่หยุดยังคิดค่าพื้นที่ต่อ · ใช้คู่กับ `disable-model-invocation: true` เมื่อไม่อยากให้ model เรียกเอง · key ใช้สิทธิ์น้อยที่สุดที่พอ (เช่นไม่ให้สิทธิ์แก้ billing) และตรวจ environment แบบบอกแค่ OK หรือ MISSING ไม่พิมพ์ค่า (แนวจาก lab VastAi_Skill ของคอร์ส CWN2026)

## 3 · agent และ playbook

- **agent** (`agents/<name>.md`): `name` ตรงชื่อไฟล์ · `description` "Use when …" ไม่เกิน 120 ตัว · `tools:` · `model` · `effort` · ต้องมีหัวข้อ `## Writing` ชี้ `human-writing` · บอกว่ารับอะไรจากหัวหน้าทีม ส่งอะไรกลับ (รูปแบบผลเป็นบล็อก markdown) และสิ่งที่ห้ามทำ — ดู `agents/brainstormer.md` เป็นแบบ
- **playbook** (`skills/superuser/references/playbook-<ชื่อ>.md` จาก `playbook-template.md`): มี `## ขั้นตอน` เป็นเลขข้อ · ทุกขั้นปิดท้าย `ใคร:` (หัวหน้าทีม · ผู้ใช้ · หรือ agent ตัวใหม่) · ต้องมีขั้นตรวจที่คนตรวจไม่ใช่คนทำ และขั้นตรวจสุดท้ายอยู่หลังขั้นลงมือสุดท้าย · ขั้นตรวจเป็นงานตรวจล้วน (ตรวจ · พิสูจน์ · รีวิว · รัน · วัด) ไม่ใช่ "ตรวจแล้วแก้" · ไม่มีขั้นที่รอผู้ใช้ตอบกลางงาน (ถามรวมตอนเริ่ม หรือใส่ `(รอยืนยัน)` แล้วลง "รออนุมัติ") · agent จาก plugin อื่นเขียน "(ถ้าติดตั้ง plugin …)" พร้อมทางสำรอง · ไม่ใช้ "ตัวเดิม" ยกเว้นถือของที่ย้ายยาก

## 4 · ต่อสายให้ครบ — skill ใหม่ 1 ตัวแตะไฟล์เหล่านี้

| ไฟล์ | ทำอะไร |
|---|---|
| `plugins/<plugin>/skills/<name>/SKILL.md` | ตัว skill |
| ของกลางใน `superuser` เท่านั้น: `scripts/sync/sync-superuser.mjs` รายการ `SHARED_ONLY_IN_SUPERUSER` และ `scripts/build/build-targets.mjs` รายการ `SHARED_SKILLS` | เพิ่มชื่อ เรียงตามตัวอักษร ทั้ง 2 รายการต้องตรงกัน |
| `scripts/sync/file-map-th.json` → `node scripts/sync/sync-file-map.mjs` | คำอธิบายไทย 1 บรรทัด แล้วสร้าง `docs/FILE-MAP.md` ใหม่ |
| `plugins/superuser/hooks/skill-router.json` | pattern 1 แถว · ทดสอบ: `node -e "const j=require('./plugins/superuser/hooks/skill-router.json');for(const s of ['ประโยคจริง 1','ประโยคที่ไม่เกี่ยว'])console.log(s,j.rules.filter(r=>new RegExp(r.pattern,'i').test(s)).flatMap(r=>r.skills))"` · **แก้ JSON หรือ YAML ที่มี regex ด้วย Edit หรือสคริปต์ที่เป็นไฟล์ ห้ามผ่าน heredoc ใน Bash** เพราะ `\\b` หายเหลือ `\b` ซึ่งเป็น backspace (เกิด 5 ครั้งถึง 2026-10-26) · `sync-superuser --check` และ validator จับอักขระควบคุมกับ `\s` ใน YAML แบบ `"..."` ให้แล้ว |
| `plugins/superuser/skills/superuser/references/triggers.md` | แถวสถานการณ์ → skill ให้หัวหน้าทีมอ่าน |
| `plugins/<plugin>/evals/<name>-*/case.yaml` × 3 | หัวข้อ 6 |
| `plugins/<plugin>/CHANGELOG.md` หัวข้อ Unreleased | 1 bullet |
| `node scripts/build/build-targets.mjs` | สร้าง `dist/` ใหม่ (ทำตอนปล่อยรุ่น ไม่ต้องทุกครั้ง) |

## 5 · สิ่งที่ validator บังคับ — `node scripts/check/validate-marketplace.mjs`

รันก่อนส่งทุกครั้ง (`--warn` ให้เตือนนับเป็นไม่ผ่าน · `--self-test` พิสูจน์ว่าตัวตรวจยังจับได้) · ออก exit 1 เมื่อมี error ใช้เป็นด่านใน CI ได้ · ตรวจ:

1. frontmatter: ขึ้นต้น `---` บรรทัดแรก · มีบรรทัดปิด · ทุกบรรทัดเป็น `key: value` · ค่าที่มี `: ` หรือขึ้นต้นด้วยอักขระพิเศษต้องครอบเครื่องหมายคำพูด · ไม่ใช้ block scalar (`|` `>`)
2. `name`: มี · ตรงชื่อโฟลเดอร์หรือไฟล์ · a-z 0-9 `-` · ไม่เกิน 64 · ไม่มี anthropic/claude
3. `description`: มี · ขึ้นต้น "Use when" หรือ "ใช้เมื่อ" · ไม่เกิน 160 (เตือน 150 · agent 120) · ไม่สั้นจนไม่บอกว่าใช้เมื่อไหร่ · ไม่มี `< >`
4. เนื้อ SKILL.md ไม่เกิน 500 บรรทัด (เตือนเมื่อใกล้) · ไฟล์ยาวต้องมีสารบัญ · ตาราง markdown: มีหัวและแถว `|---|` ทุกแถวมีจำนวนช่องเท่าหัว (แถวหลุดเพราะบรรทัดว่างคั่นคือบั๊กที่เจอบ่อยสุด)
5. agent: `tools:` ไม่ใช่ `allowed-tools:` · มี `## Writing` ชี้ `human-writing`
6. playbook: กฎในหัวข้อ 3 ทุกข้อ
7. plugin: มี `.claude-plugin/plugin.json` · `version` เป็น x.y.z · description ไม่เกิน 500 ตัว (claude.ai ปฏิเสธถ้าเกิน) · ประกาศใน `marketplace.json` และ README ครบ · `mcpServers` ล็อกรุ่น `<แพ็กเกจ>@x.y.z`
8. ของกลาง: `sync-superuser --check` และ `sync-prompt-rules --check` ตรงต้นฉบับ · ชื่อใน `skill-router.json` มีจริง · คำที่เลิกใช้ (`scripts/check/deprecated-terms` ในตัว validator) ไม่ค้าง · ค่าใน `facts.json` ยังตรงไฟล์

## 6 · eval — 3 เคสต่อ skill ใหม่ ในรูปแบบ `claude plugin eval`

เคสอยู่ที่ `plugins/<plugin>/evals/<skill>-<เคส>/case.yaml` · รูปแบบทางการและคำสั่งทั้งหมดใน [`eval-format`](references/eval-format.md) · ตัวอย่างจริง 3 ไฟล์ของ `human-writing` ใน `plugins/superuser/evals/` และ README ที่นั่นอธิบายการรัน

| เคส | พิสูจน์อะไร | grader หลัก |
|---|---|---|
| `<skill>-trigger` | โจทย์ที่ผู้ใช้พิมพ์จริง (ไม่เอ่ยชื่อ skill) ทำให้ skill ถูกเปิด | `tool_used` เครื่องมือ `Skill` จับชื่อ skill (`arm: with-only` เพราะรอบไม่มี plugin เปิดไม่ได้อยู่แล้ว) + grader ผลลัพธ์ 1 ตัวที่ให้คะแนนได้ |
| `<skill>-behaviour` | เปิดแล้วทำตามกฎหลัก 2–3 ข้อ | `regex` กับผล (`not_contains` คำต้องห้าม · `match` สิ่งที่ต้องมี) + `llm` เกณฑ์ที่ regex จับไม่ได้ |
| `<skill>-regression` | เรื่องที่ agent พลาดจริงในรอบแดง (หัวข้อ 7) หรือใน digest ของ `session-lessons-to-skills` ไม่กลับมา | `regex` ที่จับอาการเดิมตรง ๆ · เขียนอาการและวันที่ที่เห็นไว้ใน `description` ของเคส |

- **รอบแดงทำถูกอยู่แล้ว** → ตั้งชื่อเคส `<skill>-guard` ไม่นับเป็น 1 ใน 3 เคส · แดงทำถูกทุกโจทย์ → ย่อ skill เหลือสคริปต์กับข้อเท็จจริงที่โมเดลไม่รู้เอง แล้วถามผู้ใช้ว่าคงหรือเลิก · validator ล้มเมื่อ `case.yaml` ของ `-regression` เขียนว่ายังไม่เคยเห็นจริง

- โจทย์ต้องเป็นงานที่ agent ทำไม่ได้ดีโดยไม่มี skill — โจทย์ง่ายเกินไปทั้ง 2 รอบผ่านหมด วัดอะไรไม่ได้ (`จากแหล่ง` skill-creator) · ค่าเริ่มต้นรัน 3 รอบต่อเคส ทั้งรอบมี plugin และไม่มี แล้วรายงาน `WITH` `W/OUT` `Δ`
- รัน: `node scripts/evals/plugin-eval.mjs <plugin> --only "^<skill>-" --max-cost-usd 5` (plugin ที่มี `dependencies` โหลดไม่ขึ้นถ้ารัน `claude plugin eval` ตรง ๆ · รายละเอียดใน `eval-format`) · ใน CI เพิ่ม `--json results.json --threshold 0.8` และอ่าน exit code (0 ผ่าน · 1 ไม่ผ่าน · 2 ชนเพดานเงินหรือ auth)
- ใส่ `evals/results/` ใน `.gitignore` · ผลสรุปที่อยากเก็บลง `RESULTS.md` ของ plugin นั้น
- eval ของ repo (`scripts/evals/triggers` `speed` `coding`) เป็นคนละชั้น: วัดข้ามทุก plugin และเทียบ 2 รุ่นจาก git ref · ไม่แทนกัน (ความต่างใน README ของ `plugins/superuser/evals/`)

## 7 · ทดสอบก่อนและหลังด้วย subagent ตัวใหม่ ก่อนรวมทุกการแก้

1. **แดง** — เขียนโจทย์ 3–5 บรรทัดจากสถานการณ์ที่พลาดจริง (ไม่เฉลย ไม่เอ่ยชื่อ skill) · ส่ง `general-purpose` ระดับเล็ก **โดยไม่มี skill** (หรือ skill ฉบับเดิม) · ต้องพลาดแบบเดียวกับที่เจอ และจดคำแก้ตัวของมันตรง ๆ · ไม่พลาด = skill ไม่ใช่สาเหตุ ไม่ต้องแก้
2. **เขียว** — แก้ skill ให้เล็กที่สุดที่ปิดจุดพลาดที่เห็น · ส่งตัวใหม่อีกตัวทำโจทย์เดิมกับฉบับใหม่ · ต้องไม่พลาดและอ้างข้อใน skill ได้ · ยังพลาด = คำไม่ชัดหรือวางผิดที่ แก้ใหม่ ไม่ต่อท้ายข้อความ
3. **ปิดช่อง** — ทุกคำแก้ตัวใหม่ที่เจอในรอบเขียว ใส่ตัวปิดลง skill (ข้อห้ามที่เอ่ยชื่อข้ออ้างนั้น · แถวในตาราง "ไม่ใช้เมื่อ" · อาการใน description) แล้วรันซ้ำจนไม่มีข้ออ้างใหม่ · กฎที่ถูกฝ่าภายใต้แรงกดดัน (เวลา · ผู้มีอำนาจสั่ง · ทำมาเยอะแล้ว) ต้องทดสอบด้วยโจทย์ที่มีแรงกดดันนั้นจริง ไม่ใช่ถามว่า "ควรทำอย่างไร"
4. จดผล 2 รอบลงตารางที่เสนอผู้ใช้ · โจทย์แดงที่พลาดจริงแปลงเป็นเคส `-regression` · ไม่พลาด → `-guard` (หัวข้อ 6)

(แนวคิดจาก writing-skills ใน obra/superpowers · MIT · เรียบเรียงใหม่)

## 8 · อ่านผล `/skill-doctor`

- `/skill-doctor` (Claude Code 2.1.252 ขึ้นไป · ในโหมดโต้ตอบเปิดแท็บ Stats ของ `/plugin` · โหมด `-p` พิมพ์เป็นข้อความ) บอกต้นทุน context ของแต่ละ skill และจำนวนครั้งที่ถูกเรียก พร้อมธง **ไม่เคยถูกเรียก** = อยู่ในรายการแต่ไม่เคยเปิดเลย · เริ่มดูจากตัวที่ธงขึ้นและกิน context มากที่สุด (`จากแหล่ง` หน้า skills · ช่วงเวลาที่นับยังไม่ได้ตรวจ)
- skill ของเราไม่เคยถูกเรียก ไล่ตามลำดับ: (1) YAML พังไหม → รัน validator (2) description บอก "ใช้เมื่อ" ด้วยคำที่ผู้ใช้พิมพ์จริงไหม → แก้แล้วรันเคส `-trigger` (3) hook router มีแถวไหม → หัวข้อ 4 (4) งานนั้นเกิดจริงไหม → ไม่เกิดใน 1 เดือน ย้าย skill ไป plugin ที่งานนั้นอยู่ หรือยุบรวมกับตัวที่ใกล้กัน แล้วบันทึกใน CHANGELOG
- skill ของ plugin ปิดได้จาก `/plugin` เท่านั้น (`skillOverrides` ใน settings ใช้กับ skill ส่วนตัวและโปรเจกต์) · `/doctor` บอกต้นทุน context ของรายการทั้งชุด

## ตรวจก่อนส่ง

1. validator ผ่าน และ `node scripts/sync/sync-superuser.mjs --check` ผ่าน
2. description ขึ้นต้น "Use when" ไม่เกิน 160 ไม่ทับพี่น้อง · router จับประโยคจริงได้
3. ไฟล์ในหัวข้อ 4 แตะครบ · เคส 3 ไฟล์ · รอบแดง/เขียวมีผลจด
4. ตัวเลขและข้อเท็จจริงทุกข้อมีแหล่ง + วันที่ หรือวัดเอง + วันที่ + รุ่นเครื่องมือ · เขียนจากความจำ = `(ยังไม่ได้ตรวจ)` จนกว่าจะวัด · บรรทัดที่บอกว่าทดสอบหรือตรวจจริงมีวันที่ในบรรทัดเดียวกัน (validator ตรวจ)

## ที่มา

- Claude Code docs — [Skills](https://code.claude.com/docs/en/skills) · [Plugin evals](https://code.claude.com/docs/en/plugin-evals) · [Plugins reference](https://code.claude.com/docs/en/plugins-reference) · ดู 2026-10-23
- [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) (Apache-2.0 · เรียบเรียงแนวคิด progressive disclosure · description เป็นตัวกระตุ้น · โจทย์ eval ต้องยาก · ดู 2026-10-23)
- [obra/superpowers — writing-skills](https://github.com/obra/superpowers/tree/main/skills/writing-skills) (MIT · แดง/เขียวกับ subagent · ปิดช่องข้ออ้าง · description ไม่สรุปขั้นตอน · ดู 2026-10-23)
- กฎของ repo นี้ — `scripts/check/validate-marketplace.mjs` (อ่าน 2026-10-23)
