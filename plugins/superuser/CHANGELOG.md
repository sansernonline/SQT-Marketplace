# Changelog — superuser

## 3.9.0 — 2026-10-27

- แบบ Graph วางกราฟทั้งงานก่อนแจกชิ้นแรก ทุกชิ้นมีขนาด rank เจ้าของไฟล์ และป้ายทำคนเดียว (`team-roles` "แบ่งงาน") · ปล่อยชิ้นที่พร้อมตาม rank สูงก่อน และปล่อยชิ้นถัดไปทันทีที่มีชิ้นเสร็จ · เลิกใช้จำนวนลูกทีมตายตัว (1–4 · 2–4 · 5–10) ใช้ความกว้างของกราฟไม่เกินงบแทน (ผู้ใช้เลือก 2026-10-27) · บรรทัด `คาด:` ของแบบ Graph ใส่สายวิกฤต กว้างสุด และเร็วขึ้นกี่เท่า · พร้อมกันเกิน 8 ยังต้องเสนอ dynamic workflow ให้ผู้ใช้เริ่มเหมือนเดิม
- ประเมินขนาดชิ้นด้วยบรรทัด `ขนาด: <N>k` ในใบสั่งงาน · hook จด `estimate_tokens` และ token รวมจริงจากข้อความงานเบื้องหลังจบ (`total_tokens`) · `model-scorecard` หัวข้อใหม่ "ขนาดจริงต่อที่ประเมิน" ให้ค่า k ต่อขั้น (k ← 0.6k + 0.4 × จริง ÷ ประเมิน)
- planner `parallel-split-and-merge/scripts/plan.mjs`: อ่าน `plan.json` ตรวจกราฟวน รอชิ้นที่ไม่มี และเจ้าของไฟล์ซ้ำที่ไม่ได้รอกัน แล้วคิด rank สายวิกฤต ความกว้าง จำนวนลูกทีม (ไม่เกินงบและ 8) และจำลองลำดับปล่อยพร้อมไทม์ไลน์ · ใช้ค่า k จาก log · self-test 15 ข้อ
- `reviewer` ให้คะแนนเสร็จเมื่อทีละข้อ 1 · 0.5 · 0 พร้อมเหตุผลเมื่อไม่ได้ 1 และตรวจว่าสิ่งที่อ้างว่าทำตรงกับสถานะจริง
- `skill-authoring` กฎ 4 ข้อของ skill ที่ทำให้เสียเงินหรือสร้างของนอกเครื่อง (เพดานที่ขึ้นเองไม่ได้ · ไม่ลบเอง · ลบแล้วตรวจซ้ำ · stop ไม่เท่ากับ destroy)
- ที่มา: lab `02_DAG_Planner` · `03_KC_QUEST` · `04_Multi_Agent_Orchestra` · `01_VastAi_Skill` ของคอร์ส CWN2026 ของเจ้าของ repo (อ่าน 2026-10-27) · ไม่ได้นำโค้ดมา

## 3.8.0 — 2026-10-27

- superuser ถูกเรียกเองเมื่อผู้ใช้สั่งงานหลายขั้นโดยไม่เอ่ยชื่อ 3 ชั้น: (1) SessionStart ส่งข้อความสั้นบอกว่างานแบบไหนต้องเปิดและงานเล็กข้ามได้ (แนว using-superpowers) (2) **ให้ model ตัดสินเอง** ทุกข้อความแทรกบรรทัดเตือนสั้นจนกว่าจะเปิด superuser ใน session นั้น ข้อความสั้น คำสั่ง slash และรายงานลูกทีมไม่เตือน (ผู้ใช้เลือก 2026-10-27) (3) router ช่อง `multistep` นับสัญญาณงานหลายขั้นถึง 2 แต้มจึงเน้นชื่อ superuser · เลือกแบบนี้เพราะ regex อย่างเดียววัดได้ 36–93% ตามชุดประโยค (ผู้ตรวจ 3 ตัวตั้งประโยคเอง) · description ใส่คำที่ผู้ใช้พูดจริง · เคส triggers 3 ตัว (`expect_none` ใหม่) · ที่มา (เปิดอ่าน 2026-10-27): Scott Spence เปิดเองแทบ 0% เมื่อพูดอ้อม และ forced eval 22/22 (https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably · https://scottspence.com/posts/measuring-claude-code-skill-activation-with-sandboxed-evals) · Codeminer42 66% เทียบ 6% (https://blog.codeminer42.com/stop-putting-best-practices-in-skills/) · 36–93% มาจากผู้ตรวจ 3 ตัวในงานนี้ตั้งประโยคเอง (ไฟล์ทดลองอยู่ใน `_to_delete/` ไม่ได้เก็บใน repo)
- skill ใหม่ `model-scorecard` + hook จด `log/<วันที่>/runs.jsonl` (model · ขั้น · ผลผู้ตรวจ · คำรับ/ปฏิเสธของผู้ใช้ ต่องานลูกทีม) → รายงานเทียบ model รายขั้นในโปรเจกต์ของตัวเอง · `--rollup` รวมหลายโปรเจกต์เมื่อคนสั่ง · กฎจัดขั้นอยู่ใน `hooks/step-rules.json`

## 3.7.1 — 2026-10-27

- ไอคอนประจำ plugin `assets/icon.png` (512) และ `assets/icon.svg` · ช่อง `icon` ใน plugin.json (ใช้ในหน้ารายการของ directory) · ทำตาม `design-references`: ค้นต้นแบบบน Dribbble แล้วถอดสีหลักจากงานต้นแบบ หมุนเฉดต่อ plugin · ผ่าน design-critic

## 3.7.0 — 2026-10-27

- skill ใหม่ `design-references`: ทุกงานออกแบบเริ่มจากเอาคำของโปรเจกต์ไปค้นสดในเว็บที่เก่งงานแต่ละประเภท (12 ประเภท · 41 เว็บใน `data/sites.csv`) แล้วถอดสี 8 หน้าที่จากงานที่เลือกด้วย `scripts/find_refs.py palette-from` (ดักเว็บกันบอท · ปรับ contrast ให้ผ่าน) · เก็บแค่รายชื่อเว็บ ไม่เก็บตัวอย่างงาน · คลังสำรอง 2,360 ชุด 8 หน้าที่ (Wada MIT · color-palettes-sd CC BY 4.0) ใช้เมื่อค้นสดไม่ได้ · eval 3 เคส · router 1 แถว · ผู้ใช้สั่ง 2026-10-27
- `no-ai-look` · `polished-document-style` · `parallel-attempts-pick-best` และ agent ที่เลือกหน้าตา: ขั้นแรกให้ค้นต้นแบบตาม `design-references`

## 3.6.8 — 2026-10-26

- `parallel-attempts-pick-best` ข้อ 0: ก่อนขอตัวอย่าง ค้นงานจริงในหมวดเดียวกันเองแล้วเสนอ 3–4 แนวพร้อมลิงก์ ไม่เสนอแนวจากความรู้สึก

## 3.6.7 — 2026-10-26

- `parallel-attempts-pick-best` ข้อ 0: งานที่ตัดสินด้วยรสนิยมต้องขอตัวอย่างที่ผู้ใช้ชอบก่อนแข่ง · hook router และ `triggers.md` แถว `icon-design`

## 3.6.6 — 2026-10-26

- `workspace-setup`: `.gitignore` ของทุกโปรเจกต์ใส่ `_to_delete/` ด้วย (self-test 7/7)

## 3.6.5 — 2026-10-26

- `skill-authoring` (`eval-format.md`): กติกาเขียนเกณฑ์ `llm` · 1 grader ต่อ 1–3 เรื่อง · ตัดสินจากความหมาย · ห้ามเกณฑ์ที่ผู้ตัดสินตรวจไม่ได้ (เช่น "ไม่แต่งตัวเลข") · ตัวเลขไปอยู่ใน regex · วิธีถามผู้ตัดสินทีละข้อเมื่อตกทั้ง 2 แขน · เคส `chat-prompt-workflows-behaviour` เปลี่ยนข้อ "ไม่แต่งราคา" เป็นสิ่งที่เห็นได้ในคำตอบ

## 3.6.4 — 2026-10-26

- รวมบทเรียนจากคิว 2026-10-23 ถึง 2026-10-26: `autonomy` ข้อกฎหมายแก้ได้เมื่อเทียบตัวบทคำต่อคำเท่านั้น · `skill-authoring` ห้ามแก้ JSON หรือ YAML ที่มี regex ผ่าน heredoc และรัน eval ผ่าน `scripts/evals/plugin-eval.mjs` · `eval-format` ชี้สคริปต์และบอกว่า `--case` ไม่รับปีกกา
- ตัวตรวจใหม่: `sync-superuser --check` จับอักขระควบคุมใน pattern ของ hook router · validator จับ `case.yaml` ที่มีอักขระควบคุมหรือ escape ที่ YAML แบบ `"..."` ไม่รับ (self-test 31/31)

## 3.6.3 — 2026-10-26

- `workspace-setup`: กฎสิทธิ์เปลี่ยนจาก `gh pr merge` และ `git push origin --delete` เป็น `git push` และ `gh pr` ที่กว้างกว่า พร้อม deny force push 3 แบบ (โปรเจกต์ที่ตั้งไว้ด้วยรายการเดิมจะถูกรายงานว่าขาด รัน `--permissions` ซ้ำได้ กฎเดิมไม่ถูกลบ) · ตัวเลือก `--user` เขียนลง `~/.claude/settings.json` ใช้ได้ทุกโปรเจกต์ · กฎระดับผู้ใช้นับว่าครบ ไม่เพิ่มซ้ำในโปรเจกต์ · agent เพิ่มสิทธิ์เองได้เฉพาะเมื่อผู้ใช้สั่งในแชตรอบนั้น · กฎสิทธิ์รวม `git add` และ `git commit` · `--git-policy auto|commit|manual` จดว่าโปรเจกต์ไหนให้ agent ทำ git เองแค่ไหนในหัวข้อกติกาของ CONTEXT.md ถามผู้ใช้ครั้งเดียวต่อโปรเจกต์ (บางโปรเจกต์ผู้ใช้ review เอง) · self-test 7/7

## 3.6.2 — 2026-10-26

- hook router และ `triggers.md`: แถวของ skill ใหม่ 10 ตัวใน trading-finance · personal-life · graphic-design (ประโยคจริง 5 แบบต่อตัวจับได้ ประโยคไม่เกี่ยวไม่จับ)
- `human-writing` (`thai-grammar.md`): หลักเกณฑ์เว้นวรรคเรื่องไม้ยมก (ข้อ ๑.๒.๑๕.๑) และประกาศการทับศัพท์ 2532 (ราชกิจจานุเบกษา เล่ม 106 ตอน 153) ใส่ที่มาจาก orst.go.th · เพิ่มข้อยกเว้นวรรณยุกต์และการันต์
- `skill-authoring` (`eval-format.md`): plugin ที่มี `dependencies` โหลดไม่ขึ้นทั้งตัวใน `claude plugin eval` ให้รันที่สำเนาที่ลบ dependencies และรันเคส trigger 1 เคสก่อนทั้งชุด (ตรวจจริง 2026-10-26)

## 3.6.1 — 2026-10-26

- `agent-patterns`: ตารางให้หัวหน้าเลือกแบบ workflow เองจากคำขอ ไม่ถามผู้ใช้ · แก้บั๊กที่ทำซ้ำได้ใช้ Loop · ฟีเจอร์หลายส่วนหรือหลายงานในคำขอเดียวใช้ Graph · สืบสาเหตุ ย้ายระบบ โจทย์ไม่ชัดใช้ Dynamic · ไม่เข้าแถวไหนใช้ Loop · เปลี่ยนแบบกลางทางได้เมื่อมีเหตุจากผลจริงและจดลง `decision-log`
- แกน `superuser`: บรรทัด 3 บรรทัดก่อนแตะงานชี้ไปตารางนี้

## 3.6.0 — 2026-10-26

- skill ใหม่ `chat-prompt-workflows`: แม่แบบ prompt Loop · Graph · Dynamic ภาษาไทยให้คนที่ไม่เขียนโค้ดคัดลอกไปวางในแชต · ผู้ตรวจต้องยกหลักฐาน หาไม่เจอนับไม่ผ่าน · เกณฑ์หยุด 3 แบบ · แนะนำเปิดแชตใหม่ตรวจอิสระ · eval 3 เคส
  - รอบแดง 2026-10-26 (ขอ prompt ร่างประกาศรับสมัครงานแล้วตรวจตัวเอง): ผู้ตรวจให้แค่เหตุผลไม่ยกหลักฐาน · ไม่มีเกณฑ์หยุดเมื่อข้อเดิมไม่ผ่าน 2 รอบ · ไม่แยกแชตตรวจ · รอบเขียวปิดได้ครบ
- `agent-patterns`: คำถามประจำรอบ 5 ข้อ (progress ledger แนวคิดจาก Magentic-One) · ไม่คืบ 2 ชิ้นติดกันนับเป็นเหตุปรับแผน · งานที่ต้องตัดสินใจย่อยให้สอดคล้องกันอย่าแยกขนาน (Cognition) · ชี้ไปฝั่งสร้างผลิตภัณฑ์ (`llm-engineering` ของ software-company) และ `chat-prompt-workflows`
- แกน `superuser`: งานกลางขึ้นไประบุแบบ workflow (Loop · Graph · Dynamic) ท้ายบรรทัดเสร็จเมื่อ
- agent: `brainstormer` บอกรูปแบบ workflow และจำนวน agent ของแต่ละทาง พร้อมต้นทุนของ multi-agent · `reviewer` ตรวจว่างานที่ใช้ต่อหลังปรับแผนยังผ่านเกณฑ์ใหม่ · `learning-reviewer` จับการปรับแผนที่ไม่มีเหตุ และรอบตรวจที่วนต่อทั้งที่ไม่คืบ
- hook router: pattern ของ `chat-prompt-workflows`

## 3.5.0 — 2026-10-26

- workflow 3 แบบ (Loop · Graph · Dynamic) จากคอร์ส AI Workflow ของเจ้าของ repo และงานวิจัยที่เปิดอ่าน 2026-10-26 เติมเข้า skill เดิม ไม่สร้าง skill ใหม่:
  - `agent-patterns`: ตารางเลือก workflow ตามว่าใครกำหนดลำดับงาน · ชี้ว่าแต่ละแบบคือรูปแบบไหนของเรา
  - `agent-patterns` Planning: หัวข้อ "ปรับแผน" แบบ Dynamic · ปรับได้เฉพาะ 3 เหตุ · แผนมีเลขรุ่นและ 4 ช่อง (เหตุ · เปลี่ยนอะไร · กระทบอะไร · ใช้ต่อได้) · ไม่เกิน 3 ครั้ง · ข้อกำหนดเปลี่ยนกลางงานให้เก็บผลเดิม ตรวจด้วยเกณฑ์ใหม่ แล้วทำใหม่เฉพาะชิ้นที่ตก
  - `agent-patterns` Reflection: ตัวตรวจต้องเทียบกับของจริง (Huang et al. 2023 · แก้ตัวเองโดยไม่มีของจริงให้เทียบมักแย่ลง)
  - `agent-patterns` Multi-Agent: ตกลงรูปข้อมูลก่อนแยก · ชิ้นไหนพร้อมก็ปล่อยเลย · ข้อกำหนดขัดกันแยกเป็นชิ้นเก็บข้อขัดแย้งไม่เลือกข้าง
  - `team-roles` รอบตรวจ: หยุดก่อนเพดานเมื่อข้อเดิมค้าง 2 รอบและจำนวนไม่ลด · `decision-log`: แยกข้อเท็จจริงที่ตรวจได้กับนโยบายที่ขัดกัน · `playbook-template`: ตารางผูกข้อกำหนดกับเกณฑ์ตรวจ
  - `parallel-split-and-merge`: บอกว่า "dynamic workflow" ในหัวข้อนั้นคือ workflow script ของ Claude Code ไม่ใช่แบบ Dynamic ที่ปรับแผน

## 3.4.1 — 2026-10-26

- hook router: เพิ่ม pattern ของ `security-audit` (ไล่หาช่องโหว่ · pen test · security audit) และ `design-direction-lookup` (โทนสี · พาเลต · คู่ฟอนต์ · ทิศทางภาพ)

## 3.4.0 — 2026-10-26

- รวมบทเรียน 2026-10-26 (3 ข้อจาก `learn/2026-10-26-prep-1.0.md` ที่ผู้ใช้รับ ทุกข้อมีกรณีทดสอบจากเหตุการณ์จริง):
  - hook ด่านรีวิวไม่เตือนเมื่อยังมีลูกทีมทำงานเบื้องหลัง (นับจากผลของคำสั่ง Agent ที่ขึ้นว่า launched และข้อความแจ้งจบที่มี tool-use-id หรือ task-id ทั้งแบบข้อความผู้ใช้ queue-operation และ attachment · ผลของ Bash ที่บังเอิญมีข้อความเดียวกันไม่นับ) · ทดสอบกับบันทึกการสนทนาจริงแล้วนับงานค้างได้ตรง
  - validator: แถวใน `expiry.json` ต้องมี `quote` ที่พบในไฟล์จริง (กันแถวอ้างรอบตรวจที่ไฟล์ไม่ได้เขียน)
  - `handoff` และ `research-with-sources`: ข้อสรุปว่าของเดิม "ล้าสมัย" หรือ "ผิด" ต้องแนบ `ไฟล์:บรรทัด` และบอกว่าตั้งใจเก็บไว้แบบนั้นไหม
- hook: เขียนไฟล์สถานะผ่านฟังก์ชันเดียว · rename ล้มบน Windows แล้วลบไฟล์ชั่วคราว ไม่ทิ้ง `state.json.*.tmp` ค้าง · กวาดไฟล์ชั่วคราวที่ค้างเกิน 10 นาที · self-test 93/93
- validator ตัวใหม่ 3 ตัว: ตัวชี้ `<plugin>:<ชื่อ>` ต้องมีอยู่จริงใน plugin นั้น · หัวรุ่นใน CHANGELOG เรียงจากใหม่ไปเก่าและตรงกับ plugin.json · ไอคอน ✅ ❌ ⚠ ในเนื้อหา (ในโค้ดและ backtick ได้) · self-test 30/30

## 3.3.0 — 2026-10-26

- repo SQT-Marketplace: `.claude/` อยู่ใน `.gitignore` และเอาไฟล์ทีม 7 ไฟล์ออกจาก git (ไฟล์ในเครื่องยังอยู่) ตามที่ผู้ใช้เลือก · `.claude-plugin/` ยังอยู่ใน git เพราะเป็นตัว marketplace · `AGENTS.md` บอกให้อ่าน CONTEXT จากโฟลเดอร์หลัก · **ก่อน `git pull` ในโฟลเดอร์หลักครั้งแรกหลังรุ่นนี้ ให้คัดลอก `.claude/superuser/` ไปไว้ใน `_to_delete/` ก่อน** เพราะ pull จะลบไฟล์ที่เลิก track ออกจากเครื่อง แล้วค่อยคัดลอกกลับ
- skill ใหม่ `workspace-setup` + `scripts/setup.mjs`: ignore `.claude/` และ `.claude-plugin/` (ยกเว้นโปรเจกต์ที่เป็น plugin หรือ marketplace เอง) · กฎอนุญาต `gh pr merge` · `git branch -d` · `git push origin --delete` · `git worktree remove` ใน `.claude/settings.local.json` · ติดตั้ง `~/.claude/CLAUDE.md` รุ่นล่าสุดโดยสำรองของเดิม · agent ตรวจและแก้ `.gitignore` เอง ส่วนสิทธิ์และกฎประจำตัวผู้ใช้กดรันบรรทัดเดียว (ระบบตรวจสิทธิ์ไม่ให้ agent แก้สิทธิ์ของตัวเอง) · self-test 5/5 · ขั้น merge ให้จบในรอบเดียวและห้ามซ้อน PR
- validator: ตารางวันหมดอายุของข้อเท็จจริง `scripts/check/expiry.json` (16 แถวจาก 4 plugin) · เตือนเมื่อเลยวันหรือเหลือไม่ถึง 30 วันตามวันที่ของเครื่อง · ล้มเมื่อไฟล์ที่อ้างไม่มี · self-test 27/27
- หน้า README ของแผนผัง plugin บอกว่าตัวเลข skill รวมของกลางจาก superuser กี่ตัว (เดิมขึ้น "skill 49" โดยไม่บอกที่มา)
- รวมบทเรียน 2026-10-25 (3 ข้อจาก `learn/2026-10-25-all-fixes.md` ที่ผู้ใช้รับ ทุกข้อมีกรณีทดสอบจากเหตุการณ์จริง):
  - `hooks/core-rules.md` มีหัวบอกว่าเป็นสำเนาของ `scripts/install/CLAUDE.global.md` พร้อม hash ของเนื้อหา · เนื้อหาไม่ตรง hash (มีคนแก้มือ) `sync-superuser.mjs` ไม่เขียนทับ แม้ต้นฉบับถูกแก้ทีหลัง (เดิมเขียนทับเงียบ ๆ จนงานหาย) · hook ตัดหัวนี้ออกก่อนส่งเข้า session
  - `build-targets.mjs --check` สร้าง dist ในโฟลเดอร์ชั่วคราวแล้วเทียบกับ `dist/` · ใช้ใน CI และใน `AGENTS.md` ก่อน commit · `--self-test` ด้วย · CI ขั้นที่มีหลายคำสั่งรันด้วย bash ให้หยุดที่คำสั่งแรกที่ล้มบน Windows ด้วย
  - validator ล้มเมื่อไฟล์ .md (รวม `.claude/superuser/`) มีตัว CR ดิบกลางบรรทัด · self-test 26/26

## 3.2.0 — 2026-10-25

- `reviewer` ไม่มี WebSearch · WebFetch แล้ว: อ่านไฟล์ส่วนตัว + อ่านเว็บ + Bash อยู่ในตัวเดียวกันทำให้ข้อมูลรั่วได้ (lethal trifecta) · ข้อเท็จจริงที่ต้องค้นเว็บติด `(ยังไม่ได้ตรวจ — ต้องค้นเว็บ)` แล้วหัวหน้าค้นเองก่อนปิดงาน (`team-roles`) · โหวต 3 ต่อ 0
- `simplify` description แคบลง: ใช้เมื่องานมีขั้น ชั้น หรือตัวเลือกที่ยังไม่ต้องใช้ หรือคนใหม่ต้องทำตาม · บอกว่าไม่ใช่ `/simplify` ของ Claude Code · คงชื่อเดิม (โหวต 2 ต่อ 1)
- กฎ commit เขียนรายการเดียวกันทุกที่ (ผู้ใช้สั่ง · `superuser-style.md` · `docs/AGENT-LOOP.md` · หัวข้อ "กติกา" ใน `CONTEXT.md`) ใน `SKILL.md` ข้อ 9 · `CLAUDE.global.md` · `commit-log` · ต้นฉบับอยู่ที่ `team-files`
- `SKILL.md` หัวข้อ 2: ลูกทีมทั้งงาน 5–10 ตัว ปล่อยพร้อมกันรอบละไม่เกิน 8 (เดิมอ่านเหมือนขัดกับหัวข้อ 5)
- `context-budget/references/windows-shell.md` ใหม่: กับดัก 4 เรื่องที่เกิดจริงบน Windows (`ls -F` ทำให้ลบของที่สั่งเก็บ · heredoc ทำ `\\b` เหลือ `\b` · CRLF · entry-point ของ hook) · `temp-file-discipline` ชี้มา
- skill ใน superuser เลิกใช้ ✅ ❌ ⚠ ตามที่ `human-writing` ห้าม ใช้คำแทน
- validator: เตือนบรรทัดเดียวเมื่อ SKILL.md เกิน 20,000 ไบต์ (หลังบีบ context Claude Code แนบ skill กลับแค่ราว 5,000 token แรก) · เตือนเมื่อตาราง "การตัดสินใจ" ใน `CONTEXT.md` เกิน 20 แถว
- กฎข้อ 9: แก้บน branch ของงาน · repo ที่มี AI หลายตัวแก้พร้อมกัน → 1 ตัว 1 worktree และชื่อ branch ขึ้นต้นด้วยชื่อเครื่องมือ · `team-files` หัวข้อใหม่ "หลาย AI ใน repo เดียว" (สร้าง · ดูว่าใครทำอะไรจาก `git worktree list` · ห้ามแตะ worktree ของตัวอื่น · เก็บกวาดหลัง merge) · ที่มา: 2026-10-25 อีก session stage ไฟล์ในโฟลเดอร์เดียวกันระหว่างทำงาน
- **hook `ui-scan` ใหม่** (`hooks/ui-scan-hook.mjs` · PostToolUse Write/Edit/MultiEdit): แก้ไฟล์ UI แล้วรัน `no-ai-look/scripts/slop_scan.py` กับไฟล์นั้นทันที · P0/P1 ส่งกลับให้แก้ · P2 แจ้งเป็นบริบท · ผลเดิมใน session เดียวกันไม่เตือนซ้ำ · ทำงานโดยไม่ต้องมีโฟลเดอร์ทีม · ไม่มี Python = เงียบ · โมดูล `ui_scan` (ค่าเริ่มเปิด) ใน `modules.md` และ `templates/config.json` · self-test 10/10 · แนวคิด hook หลังแก้ UI จาก pbakaus/impeccable (Apache-2.0 · ตรวจ 2026-10-25)
- `no-ai-look/scripts/slop_scan.py` เพิ่ม `--url` ตรวจหน้าเว็บที่ขึ้นแล้วพร้อม stylesheet ที่หน้า `<link>` ไว้ (ไม่เกิน 10 ไฟล์ · http/https เท่านั้น · ไม่รัน JavaScript) · self-test 43/43 + ตัวดึง stylesheet · ทดสอบกับหน้าเว็บจริง 2026-10-25
- hook: รายงานลูกทีม (`<agent-message` · `<task-notification`) ไม่นับเป็นผู้ใช้แก้ · ตอนเริ่ม session แจ้งจำนวนข้อที่รับแล้วรอรวมในคิวกลาง · ส่งลูกทีมตัวแรกของวันแล้วตารางการตัดสินใจไม่มี `คาด:` → เตือนวันละครั้ง ไม่บล็อก · self-test 86/86
- validator (`scripts/check/lesson-checks.mjs`): เตือนเมื่อ plugin ในเครื่องเก่ากว่า repo · ล้มเมื่อเคส `-regression` เขียนว่ายังไม่เคยเห็นจริง · เตือนบรรทัดที่อ้างว่าทดสอบแล้วแต่ไม่มีวันที่ · ล้มเมื่อ prompt ไม่มีบรรทัด `ทดสอบจริง:` หรือ `ยังไม่ได้ทดสอบจริง` (ใส่ครบ 70 ไฟล์แล้ว) · self-test 22/22
- ใบสั่งงานข้อ 2: ค่าตัวอย่างคัดจากไฟล์ต้นทางพร้อม `ไฟล์:บรรทัด` ไม่เขียนจากความจำ (ข้อเสนอ SwipeOS 2026-10-13)
- รวมบทเรียน 2026-10-25 (คิวกลาง 11 ข้อที่ผู้ใช้รับ): ใบสั่งงานข้อ 2 บอกตัวกรองที่ใช้คัดข้อมูล และให้อ่านจาก commit เมื่อมีงานคนอื่นค้าง · ข้อ 3 งานแก้บั๊กที่อ้างจากแผนต้องวัดซ้ำก่อนแก้ · ข้อ 5 บอกเพดานความยาวต่อข้อ · `autonomy` เรื่องที่ต้องฟังหรือดูก่อนเลือก ทำตัวอย่างครบแล้วถามทีเดียวตอนจบ · `learning-loop` คำตอบ `รับ + ทำเลย` · `skill-authoring` เคส `-guard` สำหรับรอบแดงที่ทำถูก และข้อตรวจก่อนส่งข้อ 4 ตัวเลขต้องมีแหล่งหรือวัดเอง + วันที่

- `hooks/skill-router.json` เพิ่ม 3 แถวให้ skill ใหม่ของ graphic-design (ตัดต่อ และสไลด์กับเสียงเป็นวิดีโอ → `video-editing` · ซับไทย → `subtitles-th`) · ทดสอบประโยคจริง 8 ประโยคจับถูกทั้งหมด และประโยคที่ไม่เกี่ยว 2 ประโยคไม่ถูกส่งไป
- prompt ทุกไฟล์ (71 ไฟล์ รวมบล็อกกฎของ `sync-prompt-rules.mjs`) ชี้กฎวนจนเสร็จเป็นข้อ 3 ตามแกน 3.x · ใส่เลขเก่าใน `retired` ของ `scripts/check/facts.json` แล้ว (เจอจากรอบทดสอบ prompt จริง)
- `hooks/skill-router.json` เพิ่มแถว text-to-speech (เสียงบรรยาย AI · เสียงพากย์ · เลียนเสียง · F5-TTS · edge-tts) → `video-editing` ของ graphic-design (หัวข้อเสียงบรรยายจากสคริปต์) · ทดสอบแถวนี้ 20 ประโยค (รวมโจทย์ของ eval ทั้ง 3 เคส) ถูกทั้งหมด · ประโยคที่ไม่เกี่ยว 7 ประโยค เช่น header `x-tts-access-token` ของ TikTok Shop แถวนี้ไม่จับ · `skills/superuser/references/triggers.md` ของแกนเพิ่มแถวชี้ `video-editing` `subtitles-th`

## 3.1.0 — 2026-10-23 (ภาษาไทยจาก kien-thai และวิธีเรียนรู้ของทีม)

- doc-toolkit ยุบ: skill 15 ตัวกระจายไป superuser 4 (`document-naming` · `polished-document-style` · `spell-out-abbreviations` · `polite-message-th-en`) · software-company 8 · graphic-design 1 · personal-life 2 — ทุกสาขาต้องติดตั้งคู่กันอยู่แล้ว แยกไว้ไม่ได้ประหยัดอะไร แต่เพิ่มงาน tag/release

- **`human-writing`**: กฎ "ตัดรายการ ไม่ตัดคำทำหน้าที่" (หัวข้อ 3) และข้อตรวจ 7 — `จะ` `ให้` `ก็` `ด้วย` `แล้ว` และคำสุภาพไม่ใช่คำฟุ่มเฟือย · "ไม่ใช่แค่…แต่" ห้ามเฉพาะแบบสโลแกน · `thai-grammar` เพิ่มระดับภาษา 5 แถว (ธุรกิจ · แชตร้าน · ร้องเรียน · สมัครงาน · หน้าจอ) ท่า AI 6 ท่า (`t-overcut` `t-reassure` `t-force` `t-samrap` `t-topology` `t-considered`) `g-yamok` งบคำเชื่อมไม่นับคำท้าย ระดับราชการและการตลาดเพิ่ม `r-deixis` หัวข้อ 7 แปลอังกฤษเป็นไทย หัวข้อ 8 วินัยเพิ่มกฎ (คู่ตัวอย่างก่อนกฎ · กฎใหม่ต้องมีที่มา) · รูปวงเล็บคำย่อแบบเดียว `ไทย (English: ตัวย่อ)` ทุก plugin ชี้มาที่นี่ · ทับศัพท์ไม่ใส่วรรณยุกต์
- ใหม่: `references/thai-examples.md` คู่ก่อน/หลังระดับย่อหน้า 5 ระดับ (ชั่วคราว รอเจ้าของอ่าน) · `scripts/thai_tells.py` ตัวจับท่า AI ภาษาไทย ไม่ต้องติดตั้งอะไร เตือนอย่างเดียว มี `--self-test` · `THIRD-PARTY-NOTICES.md` ข้อความ MIT ของ kien-thai ตามเงื่อนไขสัญญาอนุญาต
- `strict-review`: "ผ่าน" เป็น "ผ่านกฎ" · ป้าย "อ่านแบน" · `reviewer` รายงานรหัสกฎ ไม่ตัดสินความลื่น · รอบแก้ได้กฎทั้งชุด · รันสคริปต์ก่อนอ่านเอง
- `no-ai-look`: แถวขีดยาว แยกอังกฤษ (จุด) กับไทย (เว้นวรรค) · แถวภาษาไทยชี้ `thai-grammar` · fade-up ทุกชิ้นชี้ `dynamic-website`
- `no-ai-look` catalog ข้อ 1 เพิ่ม 2 แถว: พื้นครีม + ส้มอิฐ (terracotta) + หัวข้อเซอริฟเป็นชุดตั้งต้น · ดำอมสี `#111` แทนดำทุกงานคู่สีเน้นอุ่น 1 สี (1 แหล่ง: anthropics/skills `frontend-design` · Apache-2.0 · ตรวจ 2026-10-23)
- **hook เพิ่ม 2 โมดูล ค่าเริ่มปิด** (`templates/config.json` ใส่ `"guard": false, "recompact": false` · ผู้ใช้เดิมไม่เห็นการเปลี่ยน): `guard` ด่านป้องกัน PreToolUse เฉพาะ `Bash` ตามรายการใน `hooks/guard-rules.json` (git push · git commit · git reset --hard · git stash drop/clear · rm -rf และ Remove-Item -Recurse -Force นอก `_to_delete/` · เขียนทับ `~/.claude/settings.json`) ตอบ `permissionDecision: deny` พร้อมเหตุผลและกฎที่มา · ยกเว้นต่อโปรเจกต์ใน `.claude/superuser/guard-allow.json` · `recompact` หลังย่อบริบท (SessionStart `source: compact`) เติมหัวข้อ "ความคืบหน้า" และ "รับงานต่อ" ของ `CONTEXT.md` ≤ 40 บรรทัดต่อท้ายกฎประจำตัว · `hooks.json` รับ `PostCompact` ไว้จด log (เอกสาร hooks 2026-10-23: PostCompact ส่งบริบทไม่ได้) · `moduleOn` รับค่าเริ่มต่อโมดูล · self-test 76/76
- hook `skill-router.json`: เพิ่ม pattern เว็บเคลื่อนไหว → `dynamic-website` และ ภาษาไทยให้ลื่น/ขัดภาษา/แปลไทย → `human-writing`
- วิธีเรียนรู้ของทีม (จาก kien-thai): `learning-reviewer` แยกชนิดพลาด 3 แบบ (ไม่ได้เปิด skill · เปิดแต่ไม่ทำตาม · ไม่มีกฎ) และชนิดการแก้ "คู่ตัวอย่าง" · `templates/CONTEXT.md` หัวข้อ รอผู้ใช้ · `decision-log` ไม่แก้แถวเดิม เพิ่มแถว `ผู้ใช้แก้` · `parallel-attempts-pick-best` งานภาษาไทยเจ้าของเลือก ไม่ใช่โมเดลโหวต · `owner-style-capture` เก็บคู่ก่อน/หลังของเจ้าของ · `session-lessons-to-skills` ตัดข้อความคนดูแล · repo เพิ่ม `docs/decisions/`
- ใหม่ **`skill-authoring`** (ของกลาง ตัวที่ 32): วิธีเขียน skill · agent · playbook ให้ถูกเรียก (ชื่อ · description · router) ผ่าน validator และมี eval 3 เคส (trigger · behaviour · regression) ในรูปแบบ `claude plugin eval` (`references/eval-format.md` ตรวจเอกสาร 2026-10-23) · ทดสอบแดง/เขียวด้วย subagent ก่อนรวม · อ่านผล `/skill-doctor` · ตัวอย่างจริง `evals/human-writing-*/case.yaml` 3 เคส + `evals/README.md` บอกความต่างจาก `evals/` ราก
- ใหม่ **`translate-th-en`** (ของกลาง ตัวที่ 33): แปลไทย-อังกฤษ 2 ทาง · ไทยเป็นอังกฤษ (ตัดคำท้าย · ใส่ประธาน · คำนำหน้า · พ.ศ. เป็น ค.ศ. · ชื่อคนสะกดตามเจ้าของก่อน RTGS) · glossary `docs/glossary.md` · ไฟล์คู่แก้รอบเดียว · ข้อความหน้าจอ (งบความยาว · ไม่ต่อสตริง · ตัวแทนค่า) · ไม่แปลอะไร · ตรวจ 6 ข้อ · อังกฤษเป็นไทยชี้ `thai-grammar` หัวข้อ 7 ไม่เขียนซ้ำ · แนวคิดจาก Boom-Vitt/claude-thai-skills (MIT) · `software-company/i18n-and-locale/references/thai-text-tools.md` ใหม่ (PyThaiNLP · checksum เลขบัตร · ที่อยู่ · เรียงลำดับ)
- `brainstormer`: โหมด grill — ผู้ใช้ขอให้ "ถามจนชัด" ถามเป็นรอบละไม่เกิน 4 ข้อพร้อมตัวเลือกและหลักฐาน ไม่ถามทีละข้อ (จาก mattpocock/skills grill-me · MIT)
- `handoff` หัวข้อ 8: ตารางไฟล์ของเรา ↔ หน่วยความจำในตัว Claude Code (CLAUDE.md · `.claude/rules/` · auto memory) และอะไรควรย้ายไป auto memory
- `skill-router.json` เพิ่ม 2 แถว (skill-authoring · translate-th-en) · `triggers.md` เพิ่ม 2 แถว
- hook `log/SUMMARY.md` ตารางรายวันเพิ่มคอลัมน์ "รีวิวผ่านแล้วผู้ใช้ยังแก้" (แนวคิด CLEAN-but-flawed rate จาก kien-thai): นับบรรทัด `review` ที่ `result` ขึ้นต้น ผ่าน แล้วมีข้อความผู้ใช้ `correction: true` ก่อนบรรทัด `review` ถัดไป ครั้งเดียวต่อรอบ เทียบรอบล่าสุด แสดงเป็น `ครั้ง/รอบที่ผ่าน (%)` · ใช้เตือนเท่านั้นเพราะธงแก้มาจากรายการคำ · `day.json` รุ่นก่อนถูกนับใหม่ครั้งเดียว · `learning-reviewer` อัตราสูง = ผู้ตรวจมีจุดบอด แก้ที่ `reviewer.md` หรือตัวตรวจ · self-test 83/83
- ใหม่ **eval `review-recall`** (`evals/review-recall/` ที่ราก repo): งาน 8 ชิ้นแบบบริษัทซอฟต์แวร์ไทย ฝังข้อผิด 12 ข้อ 8 ชนิดจากรายการตรวจของ `reviewer` (ยอดรวมผิด · ตัวเลขไม่มีแหล่ง · ช่องเติมค้าง · คำเดิมค้างหลังเปลี่ยนชื่อ · test ไม่คุมโค้ดที่แก้ · ซึ่ง/โดย เกินงบ · ลิงก์เสีย · พ.ศ. ปน ค.ศ.) วัดว่า reviewer ชี้เจอกี่ข้อ ให้คะแนนด้วยไฟล์:บรรทัด ข้อความ หรือคำสำคัญ ไม่ใช้ผู้ตัดสิน · `--verify` ฟรี · `--run` เรียก claude 8 ครั้งต่อรอบ · ยังไม่เคยรันจริง
- `human-writing` `thai-line-breaking`: ตารางระยะบรรทัดต่อสื่อ (เว็บ · มือถือ · Windows · สไลด์ · กราฟิก · diagram · Word) ที่ skill อื่นชี้มาแต่ยังไม่มี · Word นับ "หลายเท่า" ต่างจาก CSS · WCAG 1.4.12
- `thai_tells.py`: เลขบรรทัดหลังบล็อกโค้ดไม่เลื่อนแล้ว · ไม่เตือนขีดเดี่ยวในช่องตาราง (แปลว่า "ไม่มี") · ไม่จับ "ทำการ" ที่อยู่ใน "ทำการ์ด" · self-test เพิ่ม 3 เคส
- validator: ตรวจลิงก์ภายในทุกไฟล์ .md (ปลายทาง .md · โฟลเดอร์ · `../`) เป็น error · ไม่ตรวจลิงก์ในโค้ด แม่แบบใน `assets/` ช่องเติม และรูป · self-test 18/18 · แก้ลิงก์เสีย 12 จุดที่เกิดจากย้าย skill ข้าม plugin · ไม่เพิ่มตัวตรวจชื่อ skill ใน backtick เพราะลองแล้วเจอ 16 ชื่อ ถูกต้องทั้งหมด (skill ภายนอก · ไฟล์ reference · ชื่อไลบรารี)
- `playbook-team-project.md` คัดลอกไปทุกสาขาแล้ว (อยู่ใน `SHARED_FILES`) เพื่อให้ลิงก์ใน `team-roles` ฉบับสาขาเปิดได้
- ไฟล์ใหม่ใน `human-writing` ที่รุ่นนี้เพิ่ม: `references/thai-grammar.md` (กรอบเรียบเรียง `f1`–`f7` · ท่า AI `t-*` · ไวยากรณ์ที่ AI พลาดบ่อย `g-*` ดัดแปลงจาก chakrit/kien-thai · MIT) · `references/strict-review.md` โหมดตรวจเข้มสำหรับวิทยานิพนธ์ รายงานส่งกรรมการ และหนังสือราชการ (รหัสกฎงานวิจัย 9 รหัส · ตารางจุดที่แก้ทุกรอบ) · `scripts/thai_linebreak.py` กับ `references/thai-line-breaking.md` แก้เอกสารไทยชิดสองข้างใน Word และ PDF ที่ตัวอักษรถูกยืด (ใส่จุดตัดคำที่มองไม่เห็น · ผูกตัวเลขกับคำข้างเคียง · `--check` ตรวจอย่างเดียว · ต้องติดตั้ง `pythainlp` และ `lxml`)
- playbook ใหม่ `team-project` งานหลายวันที่มีคนจริงร่วมทีมกับ agent: 9 ขั้นตั้งแต่แตก milestone ลง `docs/BUILD-PLAN.md` ถึงรายงานเจ้าของงาน · ใบ `handoff` ใช้ได้ทั้งคนและ agent · ชิ้นของคนกับ agent ไม่แตะไฟล์เดียวกัน · `SKILL.md` มีแถวงานขนาด XL
- รายงานของลูกทีม: บรรทัดแรกเป็น `เสร็จ` · `เสร็จ มีข้อกังวล` · `ขาดบริบท` · `ติด` · ชิ้นเดียวได้ `ขาดบริบท` หรือ `ติด` 2 ครั้งติด ให้หยุดส่งชิ้นนั้นแล้วเสนอทางให้ผู้ใช้เลือกตอนจบ (แนวคิดจาก obra/superpowers · MIT) · `handoff` ช่อง `dead_ends` · `parallel-split-and-merge` แม่แบบข้อความถึงลูกทีม
- การตรวจ: `adversarial-review-panel` ขั้นซักค้านและน้ำหนัก 4 กลุ่ม (`ยืนยันข้าม` · `เห็นพ้อง` · `คนเดียว` · `ขัดแย้ง`) · `reviewer` นิยามระดับด้วยสิ่งที่ผู้อ่านต้องทำ (สูง = แก้ก่อนไปต่อ · กลาง = แก้ก่อนปิดงาน · ต่ำ = รอได้) · ผ่าน `reviewer` แปลว่าผ่านเกณฑ์ที่ตรวจได้ งานภาษา รสนิยม และหน้าตาผู้ใช้ตัดสินสุดท้าย · `evidence` ข้ออ้างที่ลอกต่อกันหลายเอกสารยังไม่นับว่ายืนยัน
- การเรียนรู้และกฎทำงาน: `session-lessons-to-skills` ทดสอบการแก้กับ skill ฉบับเดิมและฉบับใหม่ · `playbook-learn-from-session` นับชนิดพลาดก่อนแก้ · `owner-style-capture` ตัดสินทีละข้อด้วยเลขในรอบเดียว · `parallel-attempts-pick-best` ผ่านเกณฑ์ไม่ถึง 2 ตัวให้ถอยเป็นงานตัวเดียว · `decision-log` คอลัมน์ `ทบทวนเมื่อ` · `principle-prove-it-works` ตารางข้ออ้างที่ไม่นับเป็นหลักฐาน · `principle-fix-root-cause` แก้แล้วพัง 3 ครั้งในอาการเดียวให้หยุดแก้ · `context-budget` compact เองที่ราว 70% หลังอัปเดต "รับงานต่อ" · `playbook-unattended-run` และ `playbook-pickup-and-pause` ใช้ตาราง "รอผู้ใช้" · `no-ai-look` ข้อ 9 ตัดออก 1 ชิ้นก่อนส่ง · `polite-message-th-en` ใส่ ครับ/ค่ะ ตอนเปิด ตอนปิด และหลังคำขอ ไม่ใส่ทุกประโยค

## 3.0.1 — 2026-10-22

- ตรวจตามแบบตรวจ plugin: แก้เลขหัวข้อและลิงก์ที่ชี้ผิด 9 จุด (ลิงก์ข้าม plugin · path มี `\` · กฎข้อ 9/10) · ค่าเดียวกันให้ตรงแกน (ข้อความกลับ ~40 บรรทัด · ระดับ `reviewer` ตามงบ) · เพดานคำตอบและโมเดลเล็กให้ subagent 6 จุด · ย้ายตารางที่ใช้บางครั้งของ `status-report` และ `context-budget` ไป references · hook บอก skill สั้นลง 60 ตัวอักษรต่อข้อความ

## 3.0.0 — 2026-10-22

- **แกน 2 ชั้น** — `SKILL.md` เหลือเฉพาะที่หัวหน้าอ่านทุกงาน (46 KB → 27 KB) · ถาม ตัดสินใจเอง รออนุมัติ รู้จังหวะหยุด ย้ายไป `references/autonomy.md` · ไฟล์กลาง log รอบเรียนรู้ config ด่าน hook ย้ายไป `references/modules.md` เปิดเมื่อถึงจังหวะ
- **SKILL.md ของ plugin สาขาไม่คัดลอกแกนแล้ว** — เหลือเฉพาะส่วนสาขา (11 ไฟล์ × 50 KB → 11–13 KB) ขึ้นต้นด้วย "เปิด `superuser:superuser` ก่อน" · `sync-superuser.mjs --check` จับบล็อกกลางที่ค้างและบรรทัดชี้ที่หาย · `build-targets.mjs` รวมแกน + สาขาเป็นไฟล์เดียวใน `dist/` ที่ไม่มีระบบ dependencies
- **skill เอกสารและรูป 15 ตัวแยกไป plugin `doc-toolkit`** (branded-document-design · diagram-figures · document-naming · html-slide-deck · image-generation · markdown-report-docx · markdown-visuals · meeting-prep-card · meeting-summary · polished-document-style · polite-message-th-en · pptx-to-html-deck · presentation-design · product-naming · spell-out-abbreviations) · superuser เหลือ 28 skill ที่เป็นเรื่องหัวหน้างาน · plugin สาขาประกาศ dependency ทั้งสองตัวพร้อมช่วงเวอร์ชัน `^3.0` · `^1.0`
- **ผู้ตรวจขยับตามงบ** — ตารางงบเพิ่มคอลัมน์ผู้ตรวจ: เร็วและรอบแรกของสมดุล `sonnet` + `medium` รับ diff กับ "เสร็จเมื่อ" · งานใหญ่ รอบสุดท้าย หรืองบคุณภาพ `opus` + `high` · agent `reviewer` ค่าเริ่มเปลี่ยนเป็น `sonnet` + `medium`
- **ใบสั่งงาน 5 ข้ออยู่ในข้อความส่งงาน** — เขียนเป็นไฟล์ `handoff/<id>.md` เฉพาะชิ้นที่ข้าม session หรือส่งต่อ bot อื่น (โมดูล `handoff`) ไม่ใช่ทุกชิ้น
- **hook วัด token ราย agent** — `log/SUMMARY.md` เพิ่มคอลัมน์ input · output · cache อ่าน · cache สร้าง ต่อ agent และยอดรวมวัน (อ่านจาก transcript ของหัวหน้าและ `subagents/*.jsonl` นับครั้งเดียวต่อข้อความ) · บรรทัด "คาด/จริง" ตอนจบใช้ตัวเลขนี้ · ด่านแตกงานและด่านรีวิวจำสถานะใน `log/gate-state.json` อ่านเฉพาะส่วนที่เพิ่ม (transcript 65 MB: 371 ms → 140 ms) · ทางด่วนออกทันทีเมื่อไม่มี `.claude/superuser/` หรือโมดูลปิด · self-test 60/60
- `software-company` รับบล็อกกลางของ `playbook-review` และ `playbook-unattended-run` เหมือนสาขาอื่นแล้ว (ออกจาก `OPT_OUT`) ส่วนของงานโค้ดอยู่หัวไฟล์และขั้น 1
- **superuser = หัวหน้างาน 1 คน** — `SKILL.md` เขียนใหม่รอบแกน 4 เรื่อง: แจกงาน · ประเมินลูกน้อง · จัดการงาน · ตรวจซ้ำจนสำเร็จ ด้วยลูกน้อง effort ต่ำ · แกน (หัวข้อ 1–8) กับโมดูล (9–11) แยกชัด · `ADAPT.md` หัวข้อ 0 บอกว่าอะไรอยู่ไหน
- ใหม่ในแกน: **ใบสั่งงาน 5 ข้อ** ทุกชิ้นที่ส่งลูกทีม · **งบ** `เร็ว/สมดุล/คุณภาพ` ปรับระดับโมเดล รอบตรวจ ขนาน · **ประเมินลูกทีม** ผ่าน/แก้/ทำใหม่ + โปรไฟล์ `~/.claude/superuser/TEAM.md` (`templates/TEAM.md`) · พลาดซ้ำ 2 ครั้ง → ลดขอบเขตหรือขยับระดับ · **หัวหน้าเรียนรู้ตัวเอง** คาดก่อนแจกงาน เทียบตอนจบ จดลง `~/.claude/superuser/LEAD-PLAYBOOK.md` (`references/lead-playbook.md`) · **รู้ความเสี่ยง** งานย้อนไม่ได้หัวหน้าทำหรือตรวจเอง · **รู้จังหวะหยุด** ครบรอบแล้วไม่ผ่าน → สรุป 2–3 ทางให้คนตัดสิน · **คำตอบ 3 ระดับ** คำเดียว / 3 บรรทัด / รายงานปิดงานไม่เกินครึ่งหน้า พร้อม "ยังไม่ได้ตรวจ" และ "ต้องทำต่อ 1 ข้อ" · **ประหยัด token** 4 กฎในหัวข้อ 5
- **config ต่อโฟลเดอร์งาน** `.claude/superuser/config.json` (`templates/config.json`) เปิดปิด `context` · `log` · `improvements` · `learning` · `inbox` · `handoff` · `patterns_advanced` · `review_gate` · `split_gate` และตั้ง `budget` · hook อ่านเอง (`moduleOn`) สำหรับ log · inbox · 2 ด่าน · self-test เพิ่ม 1 ข้อ (55/55)
- บล็อกกลางใหม่ `modules` (หัวข้อ 11) ใส่ marker ให้ทุก plugin แล้ว · `sync-superuser.mjs` คัดลอก `lead-playbook.md` · `TEAM.md` · `config.json` ไปทุก plugin
- patterns: แกนเหลือ Planning → ReAct → Reflection (+ Multi-Agent คือหัวข้อ 5) · MoA · Reranker · parallel-attempts เป็นโมดูล `patterns_advanced`

## 2.4.0 — 2026-10-21

- ย้ายเข้าแกน: `html-slide-deck` · `pptx-to-html-deck` (จาก software-company) · `meeting-prep-card` (จาก personal-life) · skill กลางรวม 43 ตัว
- playbook ใหม่ `pickup-and-pause` (รับงานต่อ · หยุดงาน) แบบใช้ได้ทุกงาน · ส่วน git · sandbox · server อยู่ใน playbook ชื่อเดียวกันของ software-company
- `branded-document-design` ข้อ 0.2: ทำปก 3 แนว แล้วผู้ตรวจ 3 มุมโหวต 2 ใน 3 (รวมวิธีจาก `doc-cover-design`)
- `image-generation` หัวข้อ "เขียน brief และ prompt": ลำดับ prompt และวิธีทำภาพเป็นชุด (ย่อจาก `brief-to-image` · `style-consistency` ของ graphic-design)

## 2.3.0 — 2026-10-21

- ย้าย `meeting-summary` · `polite-message-th-en` จาก `personal-life` มาเป็นของกลาง (ทุกสาขาใช้)
- skill ใหม่ `research-with-sources` — หาข้อมูลพร้อมแหล่ง วันที่ และป้ายหลักฐาน · งานกลางขึ้นไปเดินตาม playbook `research`
- `triggers.md` · `skill-router.json` · `CLAUDE.global.md` เพิ่มแถวของ 3 ตัวนี้
- รูปใน `docs/plugins/` สร้างใหม่ทั้ง 38 รูป · `scripts/diagrams` อ่านรายการ skill กลางจาก `sync-superuser.mjs` · รูป map ของทุก plugin มีหัวข้อ skill กลาง 40 ตัว 6 กลุ่ม · แก้บั๊กที่รูป map/playbooks ของ superuser ไปลงโฟลเดอร์ `docs/plugins/map/` · `docs/plugins/playbooks/`
- `docs/PLUGINS.md` มีหัวข้อ `superuser` (มีอะไร · เปลี่ยนอะไร · ติดตั้ง)

## 2.2.0 — 2026-10-21

- **superuser ใช้เดี่ยวได้เต็มที่** — ย้าย skill ทั่วไป 29 ตัวจาก `software-company` มาเป็นของกลาง แล้วปรับให้ใช้กับงานทุกสาขา (เอกสาร · ร้านค้า · การเงิน · งานบ้าน · โค้ด): `principle-prove-it-works` · `principle-proceed-on-reversible-work` · `principle-small-verifiable-steps` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-user-experience-first` · `decision-log` · `flag-and-propose` · `targeted-fix` · `repeated-mistakes-to-checks` · `session-lessons-to-skills` · `owner-style-capture` · `parallel-split-and-merge` · `parallel-attempts-pick-best` · `adversarial-review-panel` · `prior-art-review` · `context-budget` · `polished-document-style` · `document-naming` · `spell-out-abbreviations` · `temp-file-discipline` · `status-report` · `diagram-figures` · `presentation-design` · `image-generation` · `markdown-visuals` · `branded-document-design` · `markdown-report-docx` · `product-naming`
- `work-session-context` รวมเข้า `handoff` (`references/team-memory.md` · `scripts/log-to-md.mjs`)
- `triggers.md` มีตารางสถานการณ์ → skill กลางครบทุกตัว · `team-roles` · agent `brainstormer` · `reviewer` ไม่ต้องรอ software-company แล้ว
- ส่วนที่ใช้เฉพาะงานโค้ดย้ายไปที่ `software-company` → `superuser` → `references/code-extensions.md`

## 2.1.0 — 2026-10-21

- skill กลางใหม่ `handoff` (ส่วนหนึ่งของ superuser) — ใบสั่งงาน 5 หัวข้อ · ใบส่งงานต่อท้ายใบเดียวกัน · รับงานต่อข้าม session และตอนสลับโมเดล · พิธีเริ่มงาน 4 ขั้น · ชุดส่งต่อให้คน bot อื่น Quix และ Agent Desk
- โฟลเดอร์ใหม่ `.claude/superuser/handoff/` (1 ชิ้น 1 ไฟล์ · ไม่ commit) · หัวไฟล์ตาม `references/handoff.schema.json` เป็นสัญญากับเครื่องอ่าน
- `superuser` หัวข้อ 5 ชี้ไปที่ `handoff` แทนการเขียนรายการคำสั่งซ้ำ · `team-files` เพิ่มแถว `handoff/` · `skill-router.json` และ `CLAUDE.global.md` เพิ่มแถว `handoff`

## 2.0.0 — 2026-10-21

- **ของกลางอยู่ที่นี่ที่เดียว** — skill `agent-patterns` · `answer-shape` · `commit-log` · `human-writing` · `no-ai-look` · `simplify` · agent `reviewer` · `brainstormer` · `learning-reviewer` · `hooks/` ไม่คัดลอกไป plugin อื่นแล้ว · plugin อื่นประกาศ `"dependencies": ["superuser"]` · เหตุผล: สำเนา 12 ชุดทำให้รายการ skill ยาว 49,564 ตัวอักษร เกินงบ 30,000 จนคำอธิบายถูกตัด และ hook ทำงานซ้ำ 12 ครั้งต่อเหตุการณ์ (วัดจาก debug log ของ Claude Code 2.1.306)
- hook ส่งกฎประจำตัว (`hooks/core-rules.md` = สำเนาของ `scripts/install/CLAUDE.global.md`) ตอนเริ่มทุก session ที่ยังไม่ได้ติดตั้งไฟล์นั้น · subagent ได้เฉพาะตาราง "เปิด skill ก่อนลงมือ" (SubagentStart)
- hook บอกชื่อ skill ที่ต้องเปิดตามคำในข้อความผู้ใช้ (`hooks/skill-router.json`) · self-test เพิ่ม 8 ข้อ
- `human-writing`: คำอธิบายบอกว่าใช้กับการแก้ไฟล์ด้วย · เพิ่มกฎตัวเลขที่เปลี่ยนตามเวลาต้องมีแหล่งและวันที่ · ข้อมูลจำลองติดป้าย · วันที่ พ.ศ./ค.ศ. · คำสถานะ 5 คำ · เอกสาร 2 ภาษา · ระดับความรุนแรงใช้คำ
- agent `reviewer` โหลด `human-writing` ตั้งแต่เริ่ม (`skills:`)
- ลิงก์ไฟล์ข้าม skill กลาง (`../human-writing/SKILL.md`) เปลี่ยนเป็นชื่อ skill เพราะ path ไม่มีใน plugin อื่นแล้ว

## 1.8.0 — 2026-10-21

- hook เขียน `log/SUMMARY.md` ให้คนอ่านทุกครั้งที่หัวหน้าทีมจบรอบ — ราย agent สะสม (ได้รับงาน · จบปกติ · ล้ม · การทำ · เวลาทำงาน) · งานที่ส่งลูกทีมวันนี้ · รายวัน 30 วัน · วันเก่าเก็บผลนับไว้ใน `day.json` · self-test เพิ่ม 1 ข้อ
- คิวกลางเปลี่ยนชื่อเป็น `~/.claude/superuser/IMPROVEMENTS.md` (ตัวใหญ่ ตรงกับไฟล์ในโปรเจกต์) · ไฟล์เดิมบน Windows ใช้ต่อได้

## 1.7.0 — 2026-10-21

- ของกลางเพิ่ม 3 บล็อกใน reference · sync ไปทุก plugin แล้ว `--check` จับได้เมื่อแก้ผิดที่
  - `playbook-review` ขั้น 2–6 (บล็อก `review-steps`) · ขั้น 3 ทุก plugin ใช้แบบเดียวกัน: งานใหญ่เพิ่มผู้ตรวจตัวใหม่ `model: opus` และสั่ง "ห้ามเขียนหรือแก้ไฟล์" (เดิมมีแค่ 7 จาก 11 plugin)
  - `playbook-unattended-run` ขั้นตอนทั้งหมด (บล็อก `unattended-steps`) · ของเฉพาะ plugin ย้ายขึ้นหัวไฟล์ 3 บรรทัด: `ลูกทีมต่อชิ้น` · `ผู้ตรวจต่อชิ้น` · `รออนุมัติที่เจอบ่อย`
  - `context-template` (บล็อก `context`) สร้างจาก `templates/CONTEXT.md` + `templates/IMPROVEMENTS.md` · ค่าเฉพาะ plugin อยู่หัวข้อ "ค่าของ plugin นี้" · ทุก plugin ได้หัวข้อ "ระวัง" และ "ไฟล์อื่น" ที่เคยขาด
- `examples.md` ตัดกฎระดับโมเดลที่เขียนซ้ำกับ `SKILL.md` ออก เหลือตัวอย่างงานของแต่ละระดับ
- `software-company` ไม่รับบล็อก `review-steps` · `unattended-steps` (`OPT_OUT`)

## 1.6.0 — 2026-10-21

- skill กลางใหม่ `commit-log` — จบ 1 ขั้นที่ตรวจผ่าน → commit 1 ครั้งรูปแบบ Conventional Commits (11 type) ให้ git log เป็นบันทึกงาน · จด hash ลง log · ไม่ push เว้นแต่ผู้ใช้สั่ง · sync ไปทุก plugin
- กฎข้อ 10: commit ทุกขั้นตาม `commit-log`
- `team-files`: agent commit เองได้แล้ว (เดิมต้องรอผู้ใช้สั่ง)

## 1.5.0 — 2026-10-19

- skill กลางใหม่ `no-ai-look` — งานที่คนดู (หน้าจอ · mockup · สไลด์ · โปสเตอร์ · โพสต์ · โลโก้ · รูป AI · เอกสาร · diagram) ต้องดูเหมือนคนออกแบบ ไม่ใช่ AI · sync ไปทุก plugin
  - ตัดสินใจ 5 อย่างก่อนลงมือ (งานมีไว้ทำอะไร · สีหลัก 1 สี · ฟอนต์ 2 ตัว · แหล่งอ้างอิงจริง · เนื้อหาจริง) · ทดสอบเอาโลโก้ออก
  - ตารางสัญญาณ 11 กลุ่ม · `references/catalog.md` รายการเต็มทุกสื่อพร้อมที่มา 30 แหล่ง (Impeccable + research ต.ค. 2026 · เก็บเฉพาะข้อที่มี ≥ 2 แหล่ง)
  - `scripts/slop_scan.py` ตรวจ HTML/CSS/JSX/Vue 43 กฎ รวม class ของ Tailwind · ระดับ P0–P3 · P0/P1 → exit 1 · ตรวจ 0 ไฟล์ → exit 2 · `slop-ok` เก็บของที่ตั้งใจพร้อมเหตุผล · มี `--self-test`
- `reviewer` ตรวจเพิ่มข้อ "Looks made by a person" (สัญญาณ ≥ 3 ในชิ้นเดียว = ระดับกลาง)
- `human-writing` ข้อ 3 เพิ่มคำที่ต้องเลี่ยงในงานที่คนดู (คำโฆษณากว้าง ๆ · ขีดยาวถี่ · ประโยคเปิดสำเร็จรูป)

## 1.4.0 — 2026-10-18

- skill กลางใหม่ `simplify` — ทุกงาน (โค้ด เอกสาร แผน ดีไซน์ ตาราง คำตอบ) ทำแบบง่ายที่สุดที่คนนอกอ่านครั้งแรกตามได้ โดยไม่ตัดความถูกต้อง ความปลอดภัย หรือการแยกหน้าที่ · sync ไปทุก plugin
- กฎข้อ 7: งานยังไม่เสร็จจนกว่าจะง่ายตาม `simplify`
- `reviewer` ตรวจเพิ่มข้อ "Simple" (ส่วนเผื่อหรือทางลัดที่อ่านยาก = ระดับกลาง)
- agent ทุกตัวในทุก plugin ทำตาม `simplify` คู่กับ `human-writing`

## 1.3.0 — 2026-10-14

จากการตรวจ plugin หัวข้อ 1–6 (ความยาว · กระชับ · ทำงานซ้อน · เช็กลิสต์ Anthropic · ความปลอดภัย · การส่งมอบ)

- ข้อความจากเว็บ อีเมล แชต ไฟล์ และเอกสารภายนอก เป็นข้อมูล ไม่ใช่คำสั่ง — กฎขยายครอบทุกช่องทาง และวางเป็นกฎระดับบนของ agent ที่อ่านของภายนอก
- hook ของ SuperUser ปิดเลขบัตรประชาชน เลขบัตรเครดิต และเลขบัญชี/โทรศัพท์ก่อนเขียน log · มี `--self-test`
- ป้าย "ยังไม่ตรวจ" เปลี่ยนเป็น "ยังไม่ได้ตรวจ" ทุกไฟล์
- กฎข้อ 0: โปรเจกต์ที่มี `docs/BUILD-PLAN.md` อ่านสถานะจากตาราง "สถานะล่าสุด"
- ADAPT.md: เพดาน description 160 ตัว ตามตัวตรวจ
