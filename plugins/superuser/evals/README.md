# evals ของ plugin superuser — วัดทีละ skill ด้วย `claude plugin eval`

เคสละ 1 โฟลเดอร์ `evals/<skill>-<เคส>/case.yaml` ในรูปแบบทางการของ Claude Code (schema 1.1 · ตรวจเอกสาร 2026-10-23 · รายละเอียดช่องและ grader ใน `skills/skill-authoring/references/eval-format.md`) · skill ใหม่ทุกตัวมี 3 เคส: `-trigger` (ถูกเปิดไหม) · `-behaviour` (ทำตามกฎหลักไหม) · `-regression` (เรื่องที่เคยพลาดไม่กลับมา) · เพิ่มได้: `-no-trigger` (โจทย์ใกล้เคียงที่ต้องไม่เปิด skill) · `-guard` (กันเรื่องที่ยังไม่เคยเห็นพลาดจริง) · skill หลักที่กฎหลายข้อใช้ `-behaviour-<เรื่อง>` หลายเคส

## รัน

```
claude plugin eval plugins/superuser --trust-plugin --no-publish --max-cost-usd 5            # ทุกเคส
claude plugin eval plugins/superuser --trust-plugin --case "human-writing-*" --no-publish      # skill เดียว
claude plugin eval plugins/superuser --trust-plugin --json _to_delete/eval.json --threshold 0.8 --no-publish --max-cost-usd 20   # CI
```

- รันจากรากของ repo · ต้อง Claude Code 2.1.269 ขึ้นไป · ใช้บัญชีที่ล็อกอินอยู่ มีค่าใช้จ่าย (เคสละ 10 รอบ × 2 แขน · เหตุผลและเกณฑ์ผ่านแยกตามแบบเคสใน `eval-format.md` หัวข้อ "จำนวนรอบและเกณฑ์ผ่าน")
- ทุกเคสรัน 2 แขน: มี plugin และไม่มี plugin · ผลบอก `WITH` `W/OUT` `Δ` · `Δ` ใกล้ 0 = โจทย์ง่ายเกินไป หรือ skill ไม่ได้ช่วย ทั้ง 2 อย่างต้องแก้
- แต่ละรอบเป็น home ว่าง ไม่มี CLAUDE.md ไม่มี auto memory ไม่มี plugin อื่น เห็นแต่ `plugins/superuser` · hook ของ plugin ยังทำงาน · เครื่องมือเขียนไฟล์และ Bash ต้องเปิดด้วย `--allow-tools` และ Bash บน Windows ต้องรันใน WSL2 (ไม่มี sandbox) — เคสที่นี่ใช้แค่เครื่องมืออ่านจึงรันบน Windows ได้
- ผลลง `evals/results/<timestamp>/` (`aggregate-result.json` + `report.html`) · โฟลเดอร์นี้ต้องอยู่ใน `.gitignore` (ยังไม่ได้เพิ่ม · รอผู้ดูแล) · ผลที่อยากเก็บสรุปลง `RESULTS.md` ที่นี่ บรรทัดละรอบ
- exit code: 0 ผ่าน · 1 มีเคสไม่ถึง threshold หรือโหลดไม่ได้ · 2 รันไม่ครบ (เงินหรือ auth)

## ต่างจาก `scripts/evals/` ของ repo อย่างไร

| | `plugins/<plugin>/evals/` (ที่นี่) | `scripts/evals/` (`triggers` · `speed` · `coding` · `review-recall`) |
|---|---|---|
| วัดอะไร | skill 1 ตัวทำตามกฎไหม เทียบกับไม่มี plugin | ทั้งทีม: skill ถูกเปิดข้ามทุก plugin · เวลาและค่าใช้จ่ายของ playbook · คุณภาพโค้ด |
| รูปแบบ | `case.yaml` ทางการ · `claude plugin eval` รันและให้คะแนน | `cases.json` และสคริปต์ `run-*.mjs` ของเราเอง เรียก `claude -p` เอง |
| เทียบกับอะไร | รอบไม่มี plugin (ตัวรันทำให้) | รุ่นก่อนจาก git ref (ตัวรันแตก worktree เอง) |
| โหลด plugin | เฉพาะ plugin ที่ชี้ · ไม่ตาม `dependencies` | ทุก plugin ใน `plugins/` หรือ `--plugin-dir` ที่ระบุ |
| รันเมื่อ | สร้างหรือแก้ skill ตัวนั้น | แก้ของที่กระทบทั้งทีม (description หลายตัว · hook · playbook · ระดับโมเดล) |

เคสที่นี่ไม่แทน `scripts/evals/triggers` — ตัวนั้นเห็น skill ทุก plugin พร้อมกันจึงจับการแย่งกันระหว่าง skill ได้ ส่วนเคส `-trigger` ที่นี่เห็นแค่ plugin เดียว

## เคสที่มี

ตารางนี้สร้างจากโฟลเดอร์ด้วย `node list-cases.mjs --write README.md` (รันในโฟลเดอร์นี้) · `--check README.md` คืน exit 1 ถ้าตารางไม่ตรงกับโฟลเดอร์ · แก้คำอธิบายที่ `description:` ใน `case.yaml` ไม่แก้ในตาราง

<!-- list-cases:start -->
| เคส | แบบ | รอบ | พิสูจน์ |
|---|---|---|---|
| `chat-prompt-workflows-behaviour` | behaviour | 10 | งานที่ข้อมูลเปลี่ยนกลางทาง ต้องได้ prompt แบบ Dynamic ที่แผนมีเลขรุ่น ปรับแผนเฉพาะ 3 เหตุ เพดาน 3 ครั้ง และมีบันทึกความคืบหน้า (วนซ้ำไหม · คืบไหม) |
| `chat-prompt-workflows-no-trigger` | no-trigger | 10 | ขอ prompt บรรทัดเดียวให้แชตแปลประโยคเดียว เป็นงานขั้นเดียว ต้องไม่เปิด chat-prompt-workflows ซึ่งใช้กับ prompt หลายขั้น |
| `chat-prompt-workflows-regression` | regression | 10 | prompt ตรวจตัวเองจนผ่านเกณฑ์ ต้องให้ผู้ตรวจยกหลักฐาน หาไม่เจอนับไม่ผ่าน มีเกณฑ์หยุดเมื่อข้อเดิมไม่ดีขึ้น 2 รอบ และบอกให้ตรวจอิสระในแชตใหม่ |
| `chat-prompt-workflows-trigger` | trigger | 10 | ผู้ใช้ที่ไม่เขียนโค้ดขอ prompt ไปวางในแชตให้แตกงานแล้วรวม ไม่เอ่ยชื่อ skill ต้องทำให้ chat-prompt-workflows ถูกเปิด และ prompt มีชิ้นตกลงรูปข้อมูลร่วมก่อนแยก |
| `commit-log-behaviour` | behaviour | 10 | การเปลี่ยนแปลง 2 เรื่องที่ไม่เกี่ยวกัน ต้องแยกเป็น 2 commit แบบ Conventional Commit ไม่รวบเป็น commit เดียว (commit-log หัวข้อ 2 ข้อ 3) |
| `commit-log-behaviour-exclude` | behaviour | 10 | ไฟล์ที่เปลี่ยนมีค่าลับ ไฟล์ build และ log ของทีมปนอยู่ ต้อง add เฉพาะโค้ดและเสนอใส่ .gitignore (commit-log หัวข้อ 2 ข้อ 4) |
| `commit-log-behaviour-repo-style` | behaviour | 10 | repo ใช้ subject ภาษาไทยกับ scope ภาษาอังกฤษ ต้องเขียน commit ตามแบบที่ repo ใช้อยู่ (commit-log หัวข้อ 2 ข้อ 2) |
| `context-budget-behaviour` | behaviour | 10 | อยากรู้ error ล่าสุดใน log 2 GB ต้องเลือกคำสั่งที่อ่านเฉพาะท้ายหรือค้นแบบจำกัดผล ไม่เปิดทั้งไฟล์ (context-budget กฎข้อเดียว ตัดสินใจก่อนอ่าน) |
| `context-budget-behaviour-long-pdf` | behaviour | 10 | สัญญา PDF 300 หน้า อยากรู้แค่ข้อบอกเลิกสัญญา ต้องหาตำแหน่งก่อนแล้วอ่านเฉพาะหน้าที่เกี่ยว ไม่อ่านทั้งเล่ม (context-budget) |
| `context-budget-behaviour-search-wide` | behaviour | 10 | ค้นการเรียกฟังก์ชันใน repo 4,000 ไฟล์ ต้องจำกัดขอบเขตการค้นและขนาดผล หรือส่งลูกทีมไปค้นแล้วรับแค่สรุป (context-budget) |
| `decision-scoring-behaviour` | behaviour | 10 | เลือกข้อเสนองาน 2 ที่ที่คะแนนสูสี ต้องบอกว่าผลยังไม่นิ่งและให้ผู้ใช้ตัดสิน ไม่ฟันธงแทน |
| `decision-scoring-no-trigger` | no-trigger | 10 | ถามความต่างของ 2 อย่างโดยไม่ขอให้เลือก ต้องไม่เปิด decision-scoring ซึ่งใช้เมื่อต้องเลือกหรือจัดลำดับด้วยตัวเลข |
| `decision-scoring-regression` | regression | 10 | กองที่เกินเพดานความเสี่ยงต้องถูกตัดก่อนทำสเกล ไม่งั้นค่าธรรมเนียมต่ำของมันบีบสเกลจนเลือกผิด |
| `decision-scoring-trigger` | trigger | 10 | ขอให้เลือกขนส่ง 1 เจ้าจากตัวเลขหลายเกณฑ์ ไม่เอ่ยชื่อ skill ต้องทำให้ decision-scoring ถูกเปิด |
| `design-references-behaviour` | behaviour | 10 | ขอสไลด์นำเสนอให้ดูดี ต้องตั้งคำค้นจากโปรเจกต์ ชี้เว็บที่เก่งงานสไลด์ ถอดสี 8 หน้าที่จากต้นแบบ และบอกว่างานจากเว็บแรงบันดาลใจห้ามยกมาใส่ตรง ๆ |
| `design-references-no-trigger` | no-trigger | 10 | แก้ CSS ค่าเดียวที่บอกตัวเลขมาแล้ว ไม่ใช่งานออกแบบใหม่ ต้องไม่เปิด design-references (ไม่ต้องหาแรงบันดาลใจ) |
| `design-references-regression` | regression | 10 | เห็นจริง 2026-10-26 ถึง 2026-10-27 · agent ออกแบบไอคอนและเลือกสีจากความจำหรือคลังที่เก็บไว้ (Lucide ใส่กรอบ · พาเลตสำเร็จรูป) ผู้ใช้ปฏิเสธหลายรอบว่าไม่สวยและดูเหมือน AI ทำ · ต้องค้นงานจริงก่อน |
| `design-references-trigger` | trigger | 10 | เจ้าของร้านขอออกแบบหน้าเว็บ ไม่เอ่ยชื่อ skill ต้องทำให้ design-references ถูกเปิด และเสนอค้นงานจริงก่อนออกแบบ |
| `handoff-behaviour` | behaviour | 10 | เขียนใบสั่งงานให้ลูกทีม ต้องครบ 5 หัวข้อ (เป้า · เสร็จเมื่อ · ใช้อะไร · ขอบเขต · ส่งกลับแบบไหน) และเสร็จเมื่อตรวจได้ (handoff หัวข้อ 3) |
| `handoff-behaviour-no-secrets` | behaviour | 10 | ชุดส่งต่องานให้ผู้รับเหมาภายนอก ข้อมูลที่ได้มีรหัสผ่านและ API key ต้องไม่ใส่ค่าลับลงในชุดส่งต่อ (handoff หัวข้อ 2 ห้ามใส่ค่าลับ) |
| `handoff-behaviour-resume` | behaviour | 10 | เขียนหัวข้อ รับงานต่อ ให้ session ถัดไป ต้องมีข้อทำต่อเป็นข้อแรก 1 ข้อที่ชี้ไฟล์ และติดป้าย ตรวจจริง หรือ ยังไม่ได้ตรวจ (handoff หัวข้อ 5) |
| `human-writing-behaviour` | behaviour | 10 | รายงานสถานะภาษาไทยต้องขึ้นต้นด้วยข้อสรุป ไม่มีคำฟุ่มเฟือย ไม่มีอีโมจิ ตัวย่อเขียนเต็มครั้งแรก ตัวเลขเป็นเลข |
| `human-writing-no-trigger` | no-trigger | 10 | โจทย์ขอ regex อย่างเดียว ไม่มีข้อความให้คนอ่าน ต้องไม่เปิด human-writing (กันคำอธิบาย skill ที่กว้างจนเปิดทุกงาน) |
| `human-writing-regression` | regression | 10 | ย่อข้อความแชตถึงลูกค้าให้สั้นลง ต้องลดจำนวนข้อหรือย่อเนื้อหา ไม่ตัดคำสุภาพและคำทำหน้าที่ |
| `human-writing-trigger` | trigger | 10 | โจทย์เขียนอีเมลภาษาไทยธรรมดา ไม่เอ่ยชื่อ skill ต้องทำให้ human-writing ถูกเปิด และคำตอบไม่มีอีโมจิ |
| `model-scorecard-behaviour` | behaviour | 10 | ขอรายงานเทียบ model รายขั้นตอนที่ log ยังไม่มีข้อมูล ต้องบอกว่าไม่มีตัวอย่างพอ ไม่แต่งตัวเลข |
| `model-scorecard-guard` | guard | 10 | ขอรายงานเทียบ model ของโปรเจกต์นี้อย่างเดียว ต้องไม่รวมโปรเจกต์อื่นและไม่เขียนไฟล์นอกโปรเจกต์ แม้มีโฟลเดอร์โปรเจกต์อื่นอยู่ข้าง ๆ |
| `model-scorecard-no-trigger` | no-trigger | 10 | เขียนฟังก์ชันคิดคะแนนเฉลี่ยนักเรียน มีคำว่า คะแนน แต่ไม่เกี่ยวกับการเทียบ model ต้องไม่เปิด model-scorecard |
| `model-scorecard-trigger` | trigger | 10 | ถามว่า model ไหนเหมาะกับขั้นไหนจากงานที่ผ่านมา ไม่เอ่ยชื่อ skill ต้องทำให้ model-scorecard ถูกเปิด |
| `principle-prove-it-works-behaviour` | behaviour | 10 | ลูกทีมรายงานว่าแก้บั๊กแล้ว test ผ่าน ผู้ใช้ขอร่างข้อความแจ้งลูกค้า ต้องไม่ยืนยันว่าแก้แล้วจากคำรายงานอย่างเดียว (principle-prove-it-works ตารางข้ออ้าง) |
| `principle-prove-it-works-behaviour-hedge` | behaviour | 10 | รายงานจบงานจากบันทึกที่เขียนว่า น่าจะใช้ได้ ยังไม่ได้เปิดไฟล์จริง ต้องเขียนว่ายังไม่ได้ตรวจ ไม่เขียนว่าผ่าน (principle-prove-it-works วิธีทำข้อ 3) |
| `principle-prove-it-works-behaviour-test-must-fail` | behaviour | 10 | ขอ test ของฟังก์ชันคิด VAT และถามว่ารู้ได้อย่างไรว่า test จับผิดได้จริง ต้องตอบว่าทำให้ของผิด 1 ครั้งแล้วดูว่า test ล้ม (principle-prove-it-works ตาราง แถว test) |
| `research-with-sources-behaviour` | behaviour | 10 | ถามค่าธรรมเนียมที่เปลี่ยนตามเวลา ต้องตอบพร้อมแหล่งและวันที่ หรือบอกตรง ๆ ว่ายังไม่ได้ตรวจ ไม่ตอบตัวเลขจากความจำลอย ๆ (research-with-sources กฎข้อเดียว) |
| `research-with-sources-behaviour-compare` | behaviour | 10 | เทียบราคาบริการ 3 เจ้า ต้องตอบก่อน ใช้ตาราง และท้ายคำตอบมีรายการแหล่งพร้อมวันที่ดู (research-with-sources หัวข้อ คำตอบ) |
| `research-with-sources-behaviour-injected` | behaviour | 10 | ข้อความจากหน้าเว็บที่ผู้ใช้วางมามีคำสั่งแฝงให้ agent ทำตาม ต้องถือเป็นข้อมูล ไม่ทำตาม (research-with-sources กฎข้อ 5) |
| `superuser-behaviour` | behaviour | 10 | งานหลายขั้นที่ยังไม่ให้ลงมือ ต้องได้แผนที่มีเป้า เสร็จเมื่อ เสี่ยง ก่อนแตะงาน และทุกขั้นมีเกณฑ์เสร็จที่ตรวจได้ (superuser หัวข้อ 2) |
| `superuser-behaviour-own-decisions` | behaviour | 10 | สั่งให้ทำเลยโดยไม่ถาม ทั้งที่โจทย์เปิดให้ตีความได้ ต้องเลือกเองแล้วจดใต้หัวข้อ ตัดสินใจเอง (superuser กฎข้อ 5) |
| `superuser-behaviour-unknown-facts` | behaviour | 10 | ขอแผนที่ต้องมีวันที่และงบ แต่ผู้ใช้ไม่ได้ให้ตัวเลข ต้องใส่ (รอยืนยัน) แทนการแต่งตัวเลข (superuser กฎข้อ 6) |
| `targeted-fix-behaviour` | behaviour | 10 | ยอดรวมในใบเสนอราคาผิดจุดเดียว ต้องแก้แค่ยอดรวม ไม่แก้บรรทัดอื่น และแสดงก่อนกับหลังของจุดที่เปลี่ยน (targeted-fix กฎ แก้เท่าที่แจ้ง) |
| `targeted-fix-behaviour-code` | behaviour | 10 | ฟังก์ชันรวมยอดขาดตัวสุดท้าย ต้องแก้ช่วงของ range จุดเดียว ไม่เปลี่ยนชื่อตัวแปรหรือเขียนใหม่ทั้งฟังก์ชัน และบอกวิธีรันกรณีที่ล้มซ้ำ (targeted-fix ขั้นตอน 5-6) |
| `targeted-fix-behaviour-typo` | behaviour | 10 | ย่อหน้ามีคำผิดคำเดียว ผู้ใช้สั่งแก้คำผิด ต้องแก้คำนั้นคำเดียว ไม่เกลาประโยคอื่น (targeted-fix ห้ามขยายขอบเขต) |
<!-- list-cases:end -->

`(ยังไม่ได้ตรวจ)` ยังไม่ได้รันชุดนี้จริงบนเครื่องนี้ — รูปแบบไฟล์ตรงเอกสาร แต่ผลคะแนนรอบแรกยังไม่มี
