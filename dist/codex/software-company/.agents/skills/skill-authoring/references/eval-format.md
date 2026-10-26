# รูปแบบ eval ของ Claude Code — `claude plugin eval`

ทุกข้อ `จากแหล่ง` [code.claude.com/docs/en/plugin-evals](https://code.claude.com/docs/en/plugin-evals) · ดู 2026-10-23 · ต้องใช้ Claude Code 2.1.269 ขึ้นไป · ใช้บัญชีที่ล็อกอินอยู่ มีค่าใช้จ่าย

## โครงไฟล์

```
plugins/<plugin>/
└─ evals/
   ├─ <เคส>/
   │  ├─ case.yaml          ← เราใช้ไฟล์นี้ไฟล์เดียว (โจทย์ใน execution.prompt · grader ใน graders:)
   │  ├─ prompt.md          ← ทางเลือก: frontmatter = ช่องของเคส · เนื้อ = โจทย์ (ทับค่าใน case.yaml)
   │  ├─ graders/<ชื่อ>.md  ← ทางเลือก: grader ละ 1 ไฟล์ ต่อท้ายรายการใน case.yaml
   │  └─ mocks/             ← ผลจำลองของ MCP tool
   ├─ mocks/<server>/<tool>.md
   └─ results/<timestamp>/  ← aggregate-result.json + report.html — ใส่ .gitignore
```

- โฟลเดอร์นับเป็นเคสเมื่อมี `prompt.md` หรือ `case.yaml` · เคสที่ไม่มี grader โหลดไม่ผ่าน · ซ้อนเคสใต้โฟลเดอร์กลุ่มได้
- `claude plugin eval init` ให้ Claude ช่วยเขียนเคส · `init --bare <ชื่อ>` สร้างแม่แบบเปล่า
- โฟลเดอร์อื่นแทน `evals/`: `"experimental": { "evals": "<path>" }` ใน plugin.json หรือ `--eval-dir`

## case.yaml

```yaml
schema_version: "1.1"        # บังคับ
name: human-writing-behaviour # บังคับ · ตรงชื่อโฟลเดอร์
description: …               # ให้คนอ่าน
tags: [smoke]
runs: 3                      # 1–50
expected_outcome: …          # ให้คนอ่าน ไม่ใช้ตัดสิน
execution:
  prompt: |                  # โจทย์ (เมื่อไม่มี prompt.md)
    …
  model: …
  max_turns: 10              # ≤ 200
  timeout_seconds: 300       # ≤ 3600
  allowed_tools: []
  append_system_prompt: …
  env: { EVAL_X: … }         # ชื่อต้องขึ้นต้น EVAL_
context:
  scaffold_script: fixture.sh  # รันเมื่อใส่ --scaffold เท่านั้น · 120 วินาที
  add_dirs: [resources]        # โฟลเดอร์อ่านอย่างเดียว
  history_file: …jsonl         # เริ่มจากบทสนทนาเดิม
graders:
  - name: …
    type: …                  # ดูตาราง
    …
```

## grader

ช่องร่วม: `type` (บังคับ) · `weight` (1) · `arm` (`with-only` หรือ `both`) · `target` หรือ `focus` = `last_message` (ค่าเริ่ม) · `trace` · `files` · `{ source: file, path }` · `mock_calls`

| type | ช่อง | ใช้เมื่อ |
|---|---|---|
| `regex` | `pattern` · `flags` · `match` (`contains` ค่าเริ่ม · `not_contains` · `"count:N"`) · `target` | คำต้องมี/ต้องไม่มี · ถูกสุด ไม่แกว่ง |
| `tool_used` | `tool` · `input_match` (regex กับ JSON ของ input) · `min` (1) · `max` · `min: 0, max: 0` = ห้ามเรียก | skill ถูกเปิดไหม: `tool: Skill` + `input_match: '"skill"\s*:\s*"(?:[\w-]+:)?human-writing"'` |
| `tool_order` | `before` · `after` | ลำดับเครื่องมือ |
| `file_exists` | `path` · `exists` | ผลเป็นไฟล์ (ต้องให้สิทธิ์ Write ก่อน) |
| `llm` | `criteria` · `focus` | เกณฑ์ที่ regex จับไม่ได้ · ผู้ตัดสิน 3 เสียง ผ่านเมื่อ ≥ 2 |
| `baseline` | `baseline_file` · `criteria` | เทียบกับคำตอบอ้างอิง |

ไม่มี grader แบบเขียนโค้ดเอง · ตัวที่เขียนใน `graders/*.md` ใช้ frontmatter ช่องเดียวกัน เนื้อไฟล์ = `criteria`

## คะแนนและรอบไม่มี plugin

- แต่ละเคสรัน 3 รอบต่อแขน · คะแนนรอบ = สัดส่วน grader ที่ผ่านถ่วงน้ำหนัก · คะแนนเคส = ค่าเฉลี่ย · ผ่านเมื่อถึง `--threshold` (ค่าเริ่ม 1.0)
- **2 แขนโดยค่าเริ่มต้น**: รอบมี plugin (`WITH`) และรอบไม่มี plugin เลย (`W/OUT`) แล้วรายงานผลต่าง `Δ` · `--ablation none` รันแขนเดียว
- ในรอบ 2 แขน grader `tool_used` ที่ `tool: Skill` และ grader ที่ `arm: with-only` รายงานเป็นตัวชี้วัด (`scored: false`) ไม่นับคะแนน เว้นแต่ใส่ `arm: both` · เคสที่มีแต่ grader ชนิดนี้จึงต้องมี grader ผลลัพธ์อีก 1 ตัว

## สภาพแวดล้อมตอนรัน

- แต่ละรอบ = home ใหม่ · workspace ใหม่ · `claude -p` ที่โหลดเฉพาะ plugin นี้ · ไม่มี CLAUDE.md ของเครื่อง · ไม่มี auto memory · ไม่มี plugin อื่น · eval ของ skill กลางจึงรันที่ `plugins/superuser` โดยตรง
- **plugin ที่มี `dependencies` โหลดไม่ขึ้นทั้งตัวใน eval** (`plugin_errors: dependency-unsatisfied` ใน trace ที่ `--keep-temp` เก็บไว้) · ไม่มีตัวเลือกให้โหลด dependency · ผลคือรอบมี plugin ไม่มี skill ของเราเลย เคส trigger เปิด skill ได้ 0/3 ทุกเคส และ Δ ใกล้ 0 · ตรวจจริง 2026-10-26 Claude Code 2.1.310 (รันครบ 5 ชุด 59 เคส เสีย 35.39 ดอลลาร์ก่อนรู้) · **วิธีรัน:** `node scripts/evals/plugin-eval.mjs <plugin> [--only <regex ชื่อเคส>] [อาร์กิวเมนต์ของ eval]` ทำสำเนาที่ลบ `dependencies` ให้ ลองเคส trigger 1 เคสก่อน ถ้า skill ไม่ถูกเปิดจะหยุดก่อนรันทั้งชุด (ทดสอบจริง 2026-10-26 กับ `flood-prep-trigger`) · `--case` รับ glob แต่ไม่รับปีกกา `{a,b}-*` (ได้ 0 เคสโดยไม่ error) จึงใช้ `--only` แทน · skill กลางของ superuser จะไม่อยู่ในรอบนั้น
- เครื่องมือที่ให้โดยไม่ต้องขอ: อ่านอย่างเดียว (`Read` `Glob` `Grep` `Skill` `Agent` `TodoWrite` …) · เพิ่มด้วย `--allow-tools Write Edit "Bash(npm test *)"` · Bash รันใต้ sandbox ของระบบ — **Windows ไม่มี sandbox ให้ใช้ WSL2** · โฟลเดอร์ `evals/` ถูกซ่อนจาก agent

## คำสั่งและ exit code

```
claude plugin eval plugins/superuser --trust-plugin --case "human-writing-*" --no-publish --max-cost-usd 5
claude plugin eval plugins/superuser --trust-plugin --json results.json --threshold 0.8 --model claude-sonnet-5 --judge-model claude-haiku-4-5 --no-publish --max-cost-usd 20   # CI
```

flag อื่น: `--runs` · `-j/--concurrency 1–8` · `--ablation none|with-without` · `--tag` · `--scaffold` · `--mocks record|off` · `--output-dir` · `--report` · `--verbose` · `--keep-temp` · ใส่ target ก่อน `--tag` `--allow-tools` `--json`

| exit | ความหมาย |
|---|---|
| 0 | ทุกเคสถึง threshold |
| 1 | มีเคสต่ำกว่า threshold · โหลดเคสไม่ได้ · ไม่มีเคส · API พัง · โฟลเดอร์ไม่ trusted โดยไม่ใส่ `--trust-plugin` |
| 2 | รันไม่ครบ (`partial: true`) เพราะชนเพดานเงินหรือ auth ถูกปฏิเสธ |
| 130 / 143 | ถูกขัดจังหวะ / ถูกหยุด |

`Δ` ไม่เปลี่ยน exit code · ผล JSON มี `aggregates.overallScore` `casesPassed` `casesTotal` `meanDelta` และ `cases[].aggregates.score` · `delta` · `costUsd`
