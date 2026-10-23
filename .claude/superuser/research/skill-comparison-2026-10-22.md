# เทียบ skill ของเรา 302 ตัว กับของเปิดที่คนอื่นทำ — ตัวต่อตัว (ตรวจ 2026-10-22)

7 รายงานจาก 7 agent อ่านอย่างเดียว · เปิด SKILL.md จริงของคู่เทียบรวม ~140 ไฟล์ (ไม่ตัดสินจาก README) · ดาว/วันที่จาก GitHub วันนี้ (บางตัว rate-limit → ยังไม่ได้ตรวจ) · ไม่มีการแก้ไฟล์ใน repo

ย่อ: SP = obra/superpowers (304k★ MIT) · WS = wshobson/agents (42k MIT) · TB = trailofbits/skills (7.7k CC-BY-SA-4.0) · AN = anthropics/skills (183k Apache-2.0 ต่อ skill) · ECC = affaan-m/everything-claude-code (286k MIT) · MP = mattpocock/skills (301k MIT) · VL = vercel-labs/agent-skills (33k licence ยังไม่ได้ตรวจ) · D7 = davila7/claude-code-templates (33k MIT) · VA = VoltAgent/awesome-claude-code-subagents (26k MIT) · BV = Boom-Vitt/claude-thai-skills (57 MIT)

ผลรวมโดยประมาณ (262 แถวที่ไม่ใช่ alias): คงของเรา ~113 · รับส่วน ~97 · ไม่มีคู่เทียบ ~48 · ข้อเท็จจริงต้องอัปเดต 4 · **แทนด้วยของคนอื่น 0**

---

## 1 · superuser (32 skill + 3 agent)

| ของเรา | คู่เทียบที่ดีสุด (ชื่อ · URL · ดาว · licence) | เขาเด่นกว่า | เราเด่นกว่า | คำตัดสิน |
|---|---|---|---|---|
| adversarial-review-panel — คณะ 3 มุม ตัดสินส่งได้/ไม่ได้ | adverse-review · github.com/addyosmani/adverse · 62 · MIT · และ second-opinion · TB | รอบ cross-examination · จัดกลุ่ม cross-validated/consensus/disputed/solo ด้วยสคริปต์ · รายงาน JSON/HTML | ใช้กับเอกสาร/แผน/ลิสต์สินค้า ไม่ใช่แค่โค้ด · ยืนยันทุกข้อกับต้นฉบับ · ระดับโมเดลต่อมุม | รับส่วน cross-exam + 4 กลุ่มน้ำหนัก |
| agent-patterns — 6 รูปแบบ เลือกตอนวางแผน | SuperClaude modes · github.com/SuperClaude-Org/SuperClaude_Framework · 23.9k · MIT | 7 mode สำเร็จรูป | ตาราง ใช้เมื่อ/ไม่ใช้ + เวลา/ต้นทุน ใน 23 บรรทัด | ไม่มีคู่เทียบตรง |
| answer-shape — เลือกตาราง/รูป/ประโยคจากสัญญาณ | — (ค้น 2 รอบ ไม่พบ) | — | — | ไม่มีคู่เทียบ |
| commit-log — 1 ขั้น = 1 commit เมื่อได้รับอนุญาต | conventional-commits · github.com/dgalarza/claude-code-workflows · 63 · MIT | ไม่มีข้อที่เราไม่มี | กฎอนุญาตก่อน commit · ไม่ commit log/inbox · subject ไทยได้ · จด hash ลง log | คงของเรา |
| context-budget — ตัดสินก่อนอ่าน · 300 บรรทัด/--glob/head -50 · subagent | context-optimizer + token-efficiency · github.com/rohitg00/pro-workflow · 2.9k · MIT · strategic-compact · ECC | เกณฑ์ compact ที่ ~70% · audit MCP | ต้นไม้ตัดสินใจ · กฎตัวเลข 3 ข้อ · วิธีสั่ง subagent ให้คืนสั้น · hook กรอง | รับส่วน เกณฑ์ compact 70% |
| decision-log — ตารางเลือก/ไม่เลือก/เหตุผล | architecture-decision-records · ECC | ADR เต็มรูป | บังคับช่อง "ไม่เลือก" · แถว `ผู้ใช้แก้ —` · โผล่ท้ายคำตอบ | คงของเรา |
| document-naming — รูปแบบไฟล์ · เวอร์ชัน · สถานะ | file-naming-conventions · claudskills.com (ต้นทาง ยังไม่ได้ตรวจ) | prefix วันที่ ISO | เลือกชนิดไฟล์ตามคนเซ็น · กฎ docx เดียวใน docs/ · cheatsheet | คงของเรา |
| flag-and-propose — ผลกระทบก่อน ปิดด้วยคำถามเดียว | escalation · anthropics/knowledge-work-plugins (ยังไม่ได้ตรวจ) · "Ruling" ใน SP executing-plans | — | โครง 4 บล็อก ≤ 5 แถว · คำถามปิดแบบเลือก | ไม่มีคู่เทียบตรง |
| handoff — ใบสั่งงาน/ใบส่งงาน/รับงานต่อ | claude-code-handoff-skill · github.com/ostikwhy-blip/claude-code-handoff-skill · 27 · MIT · session-handoff · pro-workflow | ป้าย `[V]` ตรวจแล้ว / `[?]` จำมา · หัวข้อ "ทางที่ลองแล้วพัง" · resume command | 4 จังหวะส่งต่อ · ใบสั่งงาน 5 ข้อ · schema JSON · Super Folder | รับส่วน [V]/[?] + ทางที่ลองแล้วพัง |
| human-writing — ภาษาคน ไทย/อังกฤษ | humanizer · github.com/blader/humanizer · 59.6k · MIT · thai-language · github.com/Aether-GenesiZ/thai-agent-skills · 1 · MIT | 26 สัญญาณเรียงตามน้ำหนัก · เจอข้อ 1–5 ครั้งเดียวแก้ได้ · เทียบตัวอย่างเสียงผู้เขียน · audit รอบ 2 | สองภาษา · thai-grammar/line-breaking · 7 ข้อตรวจ · ครอบ diagram/สไลด์ | รับส่วน สัญญาณเรียงน้ำหนัก + เสียงผู้เขียน |
| no-ai-look — 5 ตัดสินใจก่อนทำ + catalog | frontend-design · AN · 183k · Apache-2.0 | token system ก่อนลงมือ · "ตัดออก 1 ชิ้นก่อนส่ง" · พื้น a11y | ครอบสไลด์/โปสเตอร์/โลโก้/รูป AI/เอกสาร · บริบทไทย | รับส่วน ตัดออก 1 ชิ้น + สัญญาณ cream-terracotta |
| owner-style-capture — อ่านประวัติแชต → style file | learn-rule · pro-workflow · 2.9k · MIT | จับตอนผู้ใช้แก้ · y/n ทีละกฎ | ใช้หลักฐานจาก .jsonl · แยกไฟล์สไตล์ออกจาก plugin · ห้ามค่าลับ | รับส่วน y/n ทีละกฎ |
| parallel-attempts-pick-best — ลอง N ทาง | best-of-n · github.com/paulingham/.claude · ดาว (ยังไม่ได้ตรวจ) | หลายค่ายโมเดล · เพดาน worktree · ถอยเป็นตัวเดียวเมื่อ < 2 ผ่าน | ใช้กับเอกสาร/ดีไซน์ · ขั้น "ยกส่วนเด่นมาใส่" | รับส่วน ถอยเมื่อ < 2 ผ่าน |
| parallel-split-and-merge — ตารางแบ่ง · รอครบ | dispatching-parallel-agents · SP · ccpm · github.com/automazeio/ccpm · 8.4k · MIT | prompt template + ตัวอย่างจริง · ccpm สคริปต์ status ไม่กิน token | ขั้น 0 วางของกลาง · เกิน 8 ชิ้น → dynamic workflow · ตารางห้ามทำ | รับส่วน template สั้น |
| polished-document-style — หัวเอกสาร · ธีม | internal-comms · AN | — | ศัพท์สถานะ 5 คำ · check_outline.py · theme-colors | คงของเรา |
| polite-message-th-en — register table + บันไดน้ำเสียง | thai-customer-service · BV · 57 · MIT | เจาะช่องทาง LINE OA/Shopee | สองภาษา · บันไดทวง +1 ต่อครั้ง · templates | คงของเรา |
| principle-build-a-tool-not-handwork | — (ไม่พบ) | — | — | ไม่มีคู่เทียบ |
| principle-fix-root-cause | systematic-debugging · SP | 4 เฟส · กฎพัง 3 ครั้งหยุดทบทวนโครง · root-cause-tracing.md | ตัวอย่างนอกโค้ด · ส่งต่อ targeted-fix | รับส่วน กฎ 3 ครั้ง |
| principle-proceed-on-reversible-work — 3 ด่านก่อนถาม | executing-plans · SP | รายการเงื่อนไขหยุดชัด | ตารางย้อนได้/ไม่ได้ข้ามสายงาน · ด่าน "ข้อเท็จจริงหรือรสนิยม" | คงของเรา |
| principle-prove-it-works — ตารางหลักฐานต่อชนิดงาน | verification-before-completion · SP | Iron Law · ตารางข้ออ้าง ("should work" = ธงแดง) · ดู diff ไม่เชื่อรายงาน agent | ครอบตัวเลข/อีเมล/mockup/เซนเซอร์ · ลองทำให้ test ล้ม 1 ครั้ง | รับส่วน ตารางข้ออ้าง + คำ hedge |
| principle-small-verifiable-steps | writing-plans + executing-plans · SP | ledger ไฟล์รอด compaction · TDD ต่อ task | ลำดับ (ของที่คนอื่นพึ่งก่อน) · นอกโค้ด · CONTEXT.md เป็น ledger อยู่แล้ว | คงของเรา |
| principle-user-experience-first | — (ไม่พบ) | — | — | ไม่มีคู่เทียบ |
| prior-art-review — 4 แหล่ง · ตาราง licence | dependency-choice-review · claudskills.com (ยังไม่ได้ตรวจ) | — | รวมงานวิจัย+มาตรฐาน · ตาราง licence ขายได้ไหม | คงของเรา |
| repeated-mistakes-to-checks — ยกไป hook/script | continuous-learning · ECC · learn-rule · pro-workflow | hook จับอัตโนมัติ | ไม่จบที่ข้อความ ต้องเป็นตัวตรวจ + ย้อนทดสอบกับของที่เคยพัง | คงของเรา |
| research-with-sources — ≥ 3 แหล่งอิสระ · ป้าย 4 แบบ | Deep Research mode · SuperClaude | ระดับลึก 4 ขั้นกำหนดจำนวนแหล่ง | กฎ 3 แหล่งอิสระ · ป้ายหลักฐาน · ข้อความในเว็บ = ข้อมูล | คงของเรา |
| session-lessons-to-skills — digest → 3 reviewer → แก้ของเดิมก่อน | writing-skills · SP · Claudeception · github.com/blader/Claudeception · 2.4k · MIT | ทดสอบ skill ด้วย subagent ก่อน/หลังแก้ (RED/GREEN) · จดเฉพาะที่ผู้ใช้ยืนยัน | กรอง 3 เงื่อนไข · แก้ทีละย่อหน้า · ไม่สร้าง skill ใหม่ต่อบทเรียน | รับส่วน ทดสอบก่อน/หลังแก้ |
| simplify — บันไดก่อนลงมือ · 5 ข้อตรวจ | deslop · pro-workflow · /simplify ในตัว Claude Code | เจาะ diff โค้ดละเอียด | ครอบเอกสาร/แผน/สไลด์/ตาราง | คงของเรา |
| spell-out-abbreviations | — (ไม่พบ) | — | — | ไม่มีคู่เทียบ |
| status-report — ตารางสถานะ 5 คำ | wrap-up + session-handoff · pro-workflow · status.sh · ccpm | ccpm รายงานด้วย bash ไม่กิน token | "ไม่มีตาราง = ยังไม่จบ" · ศัพท์ 5 คำเท่ากันทุกไฟล์ | คงของเรา |
| superuser — จัดขนาด+งบ · ใบสั่งงาน 5 ข้อ · ตรวจวนจนผ่าน · คาด vs จริง | subagent-driven-development · SP · GSD · github.com/gsd-build/get-shit-done · 64.2k (archived) · ccpm · SuperClaude | สถานะรายงาน 4 ค่า (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED) · breaker พักข้อค้าง · โมเดลถูกสุดต่อบทบาท | ตารางขนาด×งบ · คาดไว้ก่อนแล้วเทียบจริง · TEAM.md · ด่าน hook · ไทย | รับส่วน สถานะ 4 ค่า + breaker |
| targeted-fix — pin อาการ · แก้เล็กสุด | patching-bugs · TB | แนบหลักฐาน patch | นอกโค้ด (ตัวเลข · ประโยค) | คงของเรา |
| temp-file-discipline — ทุกอย่างลง _to_delete/ | temp-files · github.com/llama-farm/llamafarm · 835 · Apache-2.0 | ชื่อไฟล์มี timestamp | อยู่ในโปรเจกต์ มองเห็น · ห้ามลบโดยไม่สั่ง · บอกของค้างตอนจบ | คงของเรา |
| agent brainstormer | brainstorming · SP | ถามทีละคำถาม · design doc ก่อนโค้ด | ไม่ถามผู้ใช้เอง · ทำงานบนกระดาษ · ส่ง BRIEF.md | คงของเรา |
| agent reviewer — ตัวใหม่ทุกรอบ ไม่เห็นความเห็นหัวหน้า | code-reviewer.md · SP · adverse | บันได Critical/Important/Minor + file:line · Assessment 3 ค่า | ใช้กับทุกชนิดงาน · prompt ไม่มีความเห็นหัวหน้า · ติด human-writing | รับส่วน บันไดความรุนแรง |
| agent learning-reviewer | retrospective · github.com/kenneth-liao/ai-launchpad-marketplace · 127 · claude-improve · github.com/TerenceBristol/claude-improve · 33 · MIT | จดเฉพาะที่ผู้ใช้ยืนยัน | แยกจากการตรวจชิ้นงาน · อ่าน log jsonl ต่อ agent | คงของเรา |

**ที่ควรรับ (superuser):** 1 ตารางข้ออ้างที่ไม่นับ + คำ hedge = ธงแดง (SP) → principle-prove-it-works · 2 สถานะลูกทีม 4 ค่า + breaker (SP) → superuser §5 · 3 ป้าย [V]/[?] + "ทางที่ลองแล้วพัง" → handoff · 4 สัญญาณ AI เรียงน้ำหนัก + เสียงผู้เขียน (humanizer) → strict-review · 5 cross-exam + 4 กลุ่มน้ำหนัก (adverse) → adversarial-review-panel · 6 กฎพัง 3 ครั้ง → fix-root-cause · 7 ทดสอบ skill ก่อน/หลังแก้ → session-lessons · 8 บันได Critical/Important/Minor → reviewer.md · 9 "ตัดออก 1 ชิ้น" + cream-terracotta → no-ai-look · 10 ถอยเมื่อ < 2 ผ่าน · y/n ทีละกฎ
**ของเราที่ไม่มีใครมี:** จัดขนาด × งบ แล้วคาด-เทียบจริง · prompt ผู้ตรวจไม่มีความเห็นหัวหน้า · ด่านบังคับด้วย hook (review_gate · split_gate · ตัดค่าลับ 11 รูปแบบ) · ป้ายหลักฐาน 4 แบบ + (รอยืนยัน) ทั้งระบบ · ทุก principle ครอบงานนอกโค้ดและเป็นไทย
**ไม่รับ:** SP brainstorming ถามทีละคำถาม (ขัดถามครั้งเดียว) · SP writing-plans/executing-plans ทั้งชุด (โค้ดล้วน ซ้อน BUILD-PLAN) · using-superpowers "1% ก็เปิด skill" (hook router ทำแทน) · GSD (archived) · SuperClaude personas (30 คำสั่ง + MCP หลายตัว) · ccpm (ผูก GitHub Issues) · llamafarm /tmp · Claudeception สร้าง skill ใหม่ต่อบทเรียน · TB CC-BY-SA ลอกข้อความไม่ได้ · humanizer กฎ em-dash อังกฤษ

---

## 2 · software-company A–F (40 skill)

| ของเรา | คู่เทียบดีสุด | เขาเด่นกว่า | เราเด่นกว่า | ผล |
|---|---|---|---|---|
| adr-writer — template + check_outline.py | WS architecture-decision-records · MADR adr-template (2.6k · MIT/CC0) | index README ตาราง · review checklist · MADR Decision Drivers + Confirmation | สคริปต์ตรวจโครง · ห้ามสลับหัวข้อ · (รอยืนยัน) | รับส่วน index + Confirmation |
| api-conventions — 11 ข้อ ตารางพังไม่พัง | ECC api-design (524 บ.) | โค้ด TS/Py/Go · ตาราง status code · ship checklist 12 ข้อ | ตาราง "เปลี่ยนแล้ว client พังไหม" · idempotency + optimistic concurrency · deprecation | รับส่วน checklist |
| api-design (command) | ECC contract-first | สัญญาเครื่องตรวจได้ (OpenAPI/proto) · consumer-first | ผูก playbook feature | รับส่วน change protocol |
| app-verifier-setup — script + test contract | AN webapp-testing · ECC verification-loop · browser-qa | with_server.py · reconnaissance-then-action | สัญญา data-testid/data-ready/reset/clock · "พิสูจน์ว่าจับของผิดได้" · adb/Flutter | คงของเรา |
| app-verifier-upkeep | ECC module-regression (ใกล้เล็กน้อย) | — | ไล่ route/SRS เทียบแผนที่ · ห้ามแก้ step ให้ผ่าน | ไม่มีคู่เทียบ |
| architecture-patterns — decision tree | WS architecture-patterns + microservices/cqrs/saga | Clean/Hex/DDD ระดับโค้ด | decision tree · Quick Reference · 3 refs | คงของเรา |
| architecture-review (command) | ECC production-audit | evidence checklist · risk lenses · scoring | C4 ผ่าน diagram-figures · NFR | รับส่วน risk lenses + score |
| audit-trail | WS signed-audit-trails-recipe (คนละเรื่อง) · OWASP Logging CS | hash-chain | ตารางฟิลด์ · denied ต้องเก็บ · PDPA | ไม่มีคู่เทียบ |
| auth-implementation-patterns — NIST 800-63B-4 dated | WS auth-implementation-patterns · OWASP Auth CS | — | checklist ช่องโหว่ 10 ข้อ · MFA/reset refs · วันที่ตรวจ | คงของเรา |
| background-jobs | WS python-background-jobs · ECC django-celery | job state machine · โค้ด Celery | stack-neutral · retry rule ตาราง | รับส่วน state machine |
| blast-radius | ECC change-impact | post-implementation alignment (plan vs diff) | ผู้เรียกทางอ้อม · ข้อมูลที่บันทึกแล้ว · คำสั่งค้นรันซ้ำได้ | รับส่วน alignment หลังแก้ |
| branded-document-design | AN docx/pptx (เครื่องมือ) · WS pptx-quality-gates | — | token · ฟอนต์ไทย · โหวตปก | ไม่มีคู่เทียบ |
| bug-inbox-triage | TB github-triage | "already resolved" จาก merged PR · cross-link | รับจากอีเมล/แชต · verify ทำซ้ำจริง · prompt-injection rule | รับส่วน resolved-check + cross-link |
| bug-report (command) | TB reproduce-bug · validate-bug | "Rationalizations to Reject" · ทำซ้ำอิสระ | S1–S4/P1–P4 · ถามครั้งเดียว | รับส่วน rationalizations |
| bug-report-template | Mozilla guidelines · tranhieutt (ยังไม่ได้ตรวจ) | — | repro rules · evidence · ที่เก็บ qa/ | คงของเรา |
| cicd-and-release | WS deployment-pipeline-design + github-actions-templates · ECC deployment-patterns | YAML จริง · troubleshooting 5 ข้อ | migration เป็นขั้นแยก · Android/Flutter · rollback เกณฑ์ล่วงหน้า | รับส่วน troubleshooting |
| code-gardener — จดก่อน ไม่ตัด | TB code-improver (auto-fix ตรงข้าม) | — | log→theme→ตัดสิน · scheduled | ไม่มีคู่เทียบ |
| code-orientation | ECC codebase-onboarding · TB audit-context-building | convention detection list | scope ตามงาน · Why ด้วย git log -L/-S · แผนที่ส่ง subagent | รับส่วน convention list |
| code-review (command) | SP requesting-code-review + code-reviewer.md | BASE/HEAD SHA · "push back ถ้า reviewer ผิด" | reviewer + checklist + adversarial panel | รับส่วน SHA + push-back |
| code-review-checklist | Google eng-practices (23.3k · CC-BY-3.0) · WS code-review-excellence | standard of review | เชื่อม security-gate/lazy/readable/blast-radius · map prefix→สเกล | รับส่วน standard of review |
| coding-evals — 8 งานไทย hidden test | ECC eval-harness · WS plugin-eval · AN skill-creator evals | pass@k / pass^k · grader 3 ชนิด | งานไทยจริง (พ.ศ. · cp874) · ผู้ให้คะแนน subagent ใหม่ | รับส่วน pass^k |
| commit-message-format | Conventional Commits + commitlint · ECC conventional-commit-review | วัด subject จาก git log -30 · เสนอ split | ภาษาตาม repo · กติกาไทย | รับส่วน วัด norm จาก log |
| config-and-secrets | WS secrets-management · python-configuration · OWASP Secrets CS | Vault/AWS/Azure โค้ดจริง · pre-commit gitleaks | ตัดสินใจ config/secret · ลำดับทับค่า · per-stack | รับส่วน pre-commit scan |
| data-import-export | ClaudSkills import-data-from-csv (ยังไม่ได้ตรวจ) | — | preview ก่อนยืนยัน · พ.ศ./cp874 · audit | ไม่มีคู่เทียบ (ที่ตรวจแล้ว) |
| database-design | WS postgresql-table-design · ECC database-migrations | PG gotchas · migration ต่อ ORM 5 ตัว · expand-contract | เกณฑ์เลือกชนิด DB · ตารางชื่อ · 5 refs | รับส่วน PG gotchas |
| developer-experience | gstack devex-review (ยังไม่ได้ตรวจ) | — | TTHW · SDK pattern | ไม่มีคู่เทียบ |
| diagram-figures | TB trailmark · AN canvas-design | generate จากโค้ดจริง | รูปออกแบบ · ไทย · checker | ไม่มีคู่เทียบ |
| doc-cover-design | — | — | geometry โลโก้ · bake-off | ไม่มีคู่เทียบ |
| docker-sandbox | anthropics/claude-code devcontainer · TB devcontainer-setup | bubblewrap · mount read-only กัน escape · stack detect | 2 โหมด · browser มองเห็น · CAPTCHA · Windows | รับส่วน read-only mount |
| dx-design (command) | gstack devex-review (ยังไม่ได้ตรวจ) | วัด TTHW จริง | 2 mode | ไม่มีคู่เทียบ |
| dynamic-website | greensock/gsap-skills (16.9k MIT) · ECC motion-foundations · VL web-design-guidelines | GSAP API จากผู้ผลิต · motion token · กฎ a11y | โครงบท · keyboard map · GPU budget · แหล่งลงวันที่ | รับส่วน ลิงก์ gsap-skills + vercel check |
| e2e-testing-patterns | ECC e2e-testing · WS e2e-testing-patterns | quarantine tag · artifact trace/video | retry เฉพาะเก็บ trace · quality targets | รับส่วน quarantine |
| ecommerce-design (command) | ECC click-path-audit | ไล่ทุกปุ่มผ่าน state store | checkout-audit + recommendation | รับส่วน touchpoint trace |
| ecommerce-patterns | ECC inventory-demand-planning · finsilabs (ยังไม่ได้ตรวจ) | ABC/XYZ · safety stock | checkout+inventory+recsys+บทบาท | คงของเรา |
| error-handling-patterns | ECC error-handling · WS error-handling-patterns | typed error class · Result pattern · checklist 8 | log ชั้นนอกสุด · retry เฉพาะที่หาย · circuit breaker | รับส่วน checklist |
| feature-kickoff (command) | SP brainstorming + writing-plans · ECC orch-add-feature | ถามเปิดก่อน · plan ระบุ Files/Interfaces/failing test | BA→SA→SysA ออก BRD/FSD/ADR | รับส่วน task header |
| file-upload-and-storage | OWASP File Upload CS · aj-geddes (ยังไม่ได้ตรวจ) | — | ตรวจขนาดก่อนอ่าน · UUIDv7 · retention · PDPA | คงของเรา |
| fintech-design (command) | WS pci-compliance | never-store list · tokenization · SAQ | transaction-flow (idempotency · state machine · reconcile) | รับส่วน never-store list |
| fintech-payments | WS stripe-integration · BV thai-id-validate | Stripe webhook โค้ดจริง | gateway ไทย (Omise · 2C2P · PromptPay) · compliance role | คงของเรา |
| fsd-writing | ECC intent-driven-development · TB spec-to-code-compliance | acceptance 3 ระดับลึก · ตรวจโค้ดเทียบ spec | โครง FSD · state diagram · traceability | รับส่วน spec-to-code check |

**ที่ควรรับ:** 1 post-implementation alignment (ECC) → blast-radius · 2 PG gotchas (WS) → database-design/per-stack · 3 วัด norm จาก git log + เสนอ split → commit-message-format · 4 "already resolved?" + cross-link (TB เขียนใหม่) → bug-inbox-triage · 5 pass^k → coding-evals · 6 quarantine @flaky มีวันหมดอายุ → e2e · 7 troubleshooting 5 อาการ → cicd · 8 convention detection list → code-orientation · 9 BASE/HEAD SHA + push-back → code-review · 10 pre-commit gitleaks + mount read-only → config-and-secrets · docker-sandbox
**ของเราที่ไม่มีใครมี:** สัญญาทดสอบในแอป + "แก้แอปให้ผิดแล้วสคริปต์ต้อง FAIL" · app-verifier-upkeep · code-gardener จดก่อนไม่ตัด · coding-evals งานไทยจริง · commit ไทยนับพยัญชนะ · data-import-export 3 ชั้น + preview · audit-trail ระดับแอป · เอกสาร/ปก/figure ฟอนต์ไทย · ตาราง "เปลี่ยนแบบไหน client พัง" · gateway ไทย · ทุก skill มีตาราง "ใช้ตัวอื่นแทน/คู่กัน"
**ไม่รับ:** ECC ไฟล์ 377–559 บรรทัดยกทั้งไฟล์ · WS Vault/AWS/Azure · TB code-improver auto-fix · SP brainstorming แทน feature-kickoff · WS Sandwich Method · ECC codebase-onboarding ทั้งตัว · TB github-triage merge อัตโนมัติ · VL fetch กฎสดตอนรัน · registry-only ที่เปิด source ไม่ได้

---

## 3 · software-company G–R (48 skill)

| ของเรา | คู่เทียบที่ดีสุด | เขาเด่น | เราเด่น | ตัดสิน |
|---|---|---|---|---|
| game-design | gamedev-skills/awesome-gamedev-agent-skills · 2.8k · Apache-2.0 | 74 skill ผูกเวอร์ชัน engine | GDD loop · netcode design | คงของเรา |
| game-development | WS game-development | ECS/GDScript code patterns | netcode · live-ops · anti-cheat | คงของเรา |
| graphic-design | AN canvas-design + brand-guidelines | design-philosophy ก่อนวาด · คลังฟอนต์ | รายการ "ไม่เอา" · ไทยในกราฟิก · LINE rich menu | คงของเรา |
| healthcare-design | anthropics/healthcare fhir-developer · 428 · "Anthropic ToS" ไม่ใช่ OSS | โค้ดจริง validation · value sets | CapabilityStatement→SMART/PKCE→Inferno · HIPAA 3 safeguards · สะพาน PDPA | รับส่วน ลิงก์ (ไม่ลอก) |
| healthcare-systems | เดียวกัน · borghei healthtech-advisor (965 · MIT+Commons Clause) | — | clinical workflows + PDPA สุขภาพ | คงของเรา |
| html-slide-deck | lewislulu/html-ppt-skill · 8.8k · MIT · ryanbbrown/revealjs-skill (418) | presenter window (หน้าถัดไป+สคริปต์+นาฬิกา) · overflow checker · 36 ธีม | ไฟล์เดียว รูปฝัง · ฟอนต์ไทย · sheet PNG | รับส่วน presenter window + overflow check |
| i18n-and-locale | D7 i18n-localization · BV thai-date-format | i18n_checker.py · ICU plural · เลขไทย ๐-๙ + ปี 2 หลัก convert.py มี test | collation ไทยต่อ DB · กับดัก Excel พ.ศ. · ห้ามต่อประโยค | รับส่วน checker + เลขไทย/ปี 2 หลัก |
| incident-response | borghei incident-commander · WS incident-response | severity 5 มิติ · แม่แบบสื่อสาร 4 กลุ่ม | gate คนอนุมัติ · นาฬิกา PDPA 72 ชม. | คงของเรา · รับ แม่แบบสื่อสาร |
| incident-runbook-template | WS incident-runbook-templates · borghei runbook-generator | VERIFY หลังทุกขั้น · CI ตรวจคำสั่ง | ทดสอบ 3am · reviewed <6 เดือน · game days | รับส่วน VERIFY + CI ตรวจคำสั่ง |
| insurance-design / insurance-systems | pcl insurance-expert · 44 (ยังไม่ได้ตรวจ) | ACORD/NAIC | FNOL→triage→fraud→reserves · OIC ไทย · 5 บทบาท | ไม่มีคู่เทียบ |
| iot-design / iot-systems | travisjneuman embedded-iot · 105 · MIT (ไฟล์ 404 ยังไม่ได้ตรวจ) | OTA dual-partition | provisioning/OTA/decommission · mTLS · MQTT QoS | ไม่มีคู่เทียบ |
| lazy-coding — บันได 6 ขั้น | MP codebase-design · 301k · MIT | deep module · deletion test | บันได stdlib→native→dep · "simple ≠ scattered" | คงของเรา · รับ 1 บรรทัด deletion test |
| legacy-onboard (command) | jeffallan spec-miner · 12k · MIT | — | fan-out ต่อชั้น · ขอ script-out DB | คงของเรา |
| legacy-spec-recovery — 4 ป้าย | spec-miner | `allowed-tools: Read, Grep, Glob` · EARS | path:line ทุกข้อ · ทะเบียนกฎธุรกิจ · แม่แบบ CR | รับส่วน allowed-tools |
| legal-doc-design / legal-document-systems | borghei contract-review (EXPERIMENTAL) | 10 ชนิด clause · RED/YELLOW/GREEN | e-signature ตามเขตอำนาจ · ETA ไทย · 5 บทบาท | คงของเรา · รับ รายการ clause |
| llm-design / llm-engineering | borghei rag-architect · WS llm-application-dev | HyDE/multi-query/step-back · RRF · RAGAS | "ข้อความที่ดึงมาเป็นข้อมูล" · กรองสิทธิ์ · regression gate · security | รับส่วน query transforms + RRF |
| logging-standards | wshaddix/dotnet-skills (.NET เท่านั้น) | Serilog/Seq | รูปแบบบรรทัดเดียวทุกภาษา · redaction ทดสอบแล้ว | คงของเรา |
| markdown-report-docx | AN docx (source-available) · pandoc | tracked changes · comments | brandkit · ปก · TOC · ฟอนต์ไทย · ตรวจ PDF | คงของเรา |
| markdown-visuals | imxv/Pretty-mermaid-skills · 1.5k · MIT | render SVG/PNG/ASCII 15 ธีม | decision tree · ascii patterns | คงของเรา · ชี้เป็น renderer |
| mobile-app-design | vudovn/antigravity-kit (ยังไม่ได้ตรวจ) · AN frontend-design | anti-generic list | template+css · screenshot.py · ไทย-อังกฤษปน | คงของเรา |
| mobile-design / mobile-engineering | borghei senior-mobile · WS react-native-architecture | ตาราง Expo vs bare RN | MVVM/MVI/Clean · performance budget · ASO | รับส่วน ตาราง Expo vs bare |
| notifications | ไม่พบ (มีแต่ connector) | — | SMS ไทย 70 ตัว · LINE · unsubscribe · PDPA | ไม่มีคู่เทียบ |
| observability-basics | borghei observability-designer · WS slo-implementation | burn-rate alert · error budget · tier T1–T3 | ภาษาคน · เกณฑ์ตัวเลขจริง | รับส่วน burn-rate + error budget |
| onboard — 30/60/90 + Diátaxis | borghei codebase-onboarding · diataxis.fr | setup_validator ตรวจว่า README รันได้ | แผนเวลา · Diátaxis 4 ส่วน | รับส่วน setup_validator |
| owasp-top10 | agamm/claude-code-owasp · 392 · MIT · microsoft/hve-core | ASVS id+level · LLM/Agentic Top10 2026 · finding block · evals | ข้อสัญญา · คอลัมน์ภาษาเจ้าของกิจการ · แม่แบบรายงานส่งมอบ | รับส่วน finding block + ASVS level |
| pdpa-compliance | BV thai-pdpa · 57 · MIT | อ้างมาตรา · ตาราง PDPA vs GDPR · overlay รายภาค · วันที่ประกาศโอนข้ามแดน | ทำรายการก่อน · ฐานกฎหมาย · UI ยินยอม · endpoint สิทธิ | รับส่วน เลขมาตรา + overlay (ตรวจกับ PDPC ก่อน) |
| postmortem-template | Google SRE example · WS postmortem-writing · borghei | Trigger/Detection แยก · action item type mitigate/prevent/process · quick postmortem | severity ร่วม incident-response · where we got lucky · ไทย | รับส่วน Trigger · type · quick template |
| pptx-to-html-deck | lewislulu (ไม่ใช่ตัวแปลง) | presenter window | แปลงจาก .pptx จริง · click_steps.py 2 ฝั่ง | ไม่มีคู่เทียบ |
| pr-description-template | MP pr (เครดิต HumanLayer) · greyhaven pr-template | Evidence ก่อน/หลัง · Merge Danger one-way/two-way door | checklist ครบ · security/deploy notes · ไทย | รับส่วน Evidence + Merge Danger |
| presentation-design | AN pptx · borghei board-deck-builder | รายการ "avoid" (accent line · cream default) · validate.py | เลือกชนิดไฟล์ไม่ถามซ้ำ · โครงเรื่อง · ตัวอักษรไทย | รับส่วน รายการ avoid |
| principle-data-shape-first | MP domain-modeling (คนละมุม) | GLOSSARY ทันที | สถานะผิดสร้างไม่ได้ · branded id | คงของเรา |
| principle-replace-then-delete / principle-safe-to-rerun | ไม่พบเป็น skill (บทความ strangler fig · Stripe idempotency) | — | นับผู้ใช้→ย้าย→ลบใน PR เดียว · --dry-run · พิสูจน์รัน 2 รอบ | ไม่มีคู่เทียบ |
| principle-secure-by-default | TB insecure-defaults · OWASP CheatSheetSeries (CC-BY-SA) | audit fail-open ขนาน | สั้น ไทย · มือถือ | คงของเรา · ใส่ลิงก์ cheat sheet |
| product-naming | borghei domain-name-brainstormer | คะแนน 0–100 สคริปต์ | ทดสอบโทรศัพท์ · ความหมายภาษาอื่น · เสียงไทย | คงของเรา |
| product-roadmap | borghei outcome-roadmap | สูตร outcome · counter-metric · Now/Next/Later | RICE คำนวณจริง | รับส่วน สูตร outcome + counter-metric |
| project-bootstrap | Best-README-Template (16.4k · Unlicense) · TB devcontainer-setup | README 8 ส่วน | กฎรากไม่มีไฟล์ชั่วคราว · 1 คำสั่งรัน | คงของเรา |
| project-doc-set | Diátaxis · arc42 (ยังไม่ได้ตรวจ) | กรอบ 4 ชนิดเอกสาร | ผัง ref/docs/mockup · open_items.py | ไม่มีคู่เทียบ |
| readable-code | kettanaito/naming-cheatsheet · 14k · MIT | A/HC/LC pattern · prefix is/has/should · ไม่ซ้ำ context | รูปร่างฟังก์ชัน · ไทย/อังกฤษในโค้ด | รับส่วน A/HC/LC |
| reference-app-research | daymade competitors-analysis · 1.5k · MIT | audit repo คู่แข่ง file:line · source register | แอปปิด (store review · วิดีโอ) | รับ source register + วันที่ดึง |
| release-notes | keepachangelog 1.1.0 · borghei release-notes | breaking change 3 ช่อง · สคริปต์จับ dev-speak | ตัวเลขต้องวัดจริง · ไทย | รับส่วน 3 ช่องของ breaking change |
| retrospective | borghei sprint-retrospective · MP retro | velocity จาก git · 8 format | ไม่หยุดถาม · retro ของ "ทีมคน" | คงของเรา |
| reverse-engineering | morluto/rea · 364k · MIT · WS binary-analysis-patterns · TB dwarf-expert | rea MCP+เครื่องมือครบ · Ghidra/IDA script | authorization record · ledger หลักฐาน · ไม่โหลด runtime · สคริปต์ stdlib | คงของเรา · ลิงก์ WS patterns |

**ที่ควรรับ:** 1 finding block (agamm) → owasp-top10 · 2 Trigger · action type · quick template (SRE/WS) → postmortem · 3 Evidence + Merge Danger (MP) → pr-description · 4 เลขมาตรา PDPA + overlay (BV ตรวจกับ PDPC) → pdpa-compliance · 5 VERIFY block + CI ตรวจคำสั่ง → runbook · 6 allowed-tools frontmatter → legacy-spec-recovery · reverse-engineering · 7 burn-rate + error budget (เขียนใหม่) → observability · 8 HyDE/RRF 1 ตาราง → llm-engineering · 9 A/HC/LC naming → readable-code · 10 presenter window + overflow check → html-slide-deck
**ของเราที่ไม่มีใครมี:** ไทยทั้งชุด (เลขไทย/พ.ศ. · collation · SMS 70 ตัว · OIC · ETA · LINE) · ป้ายหลักฐาน + path:line + ทะเบียนกฎธุรกิจ + CR impact · gate คนอนุมัติก่อนแตะ prod + PDPA 72 ชม. · owasp เป็นเงื่อนไขส่งมอบ · pptx→html คง click steps · principle 3 ตัวไม่มี skill ที่ไหน · product-naming ทดสอบโทรศัพท์/เสียงไทย · RE ไม่โหลด runtime
**ไม่รับ:** แทนทั้ง skill ด้วยของใคร (ไม่มีสักตัว) · AN docx/pptx/pdf/xlsx source-available · anthropics/healthcare ToS · borghei MIT+Commons Clause (ห้ามขาย → เขียนใหม่) · TB/OWASP CC-BY-SA (ลิงก์ได้ ลอกไม่ได้) · WS runbook 9 ส่วน/postmortem 230 บรรทัด · borghei velocity จาก git · D7 i18n_checker regex อังกฤษ

---

## 4 · software-company S–W (31 skill + ชุด agent 39)

| ours | best external | theirs stronger | ours stronger | verdict |
|---|---|---|---|---|
| saas-design (cmd) | none · miles990 saas-platforms (ยังไม่ได้ตรวจ) | — | 10-step review/integration workflows | ไม่มีคู่เทียบ |
| saas-platform (7 refs) | WS billing-automation | billing engine quick-start · dunning | multi-tenancy 403 l · SSO/SAML/SCIM 376 l · 4 role guides | คงของเรา |
| security-gate | TB semgrep + supply-chain-risk-auditor | 3rd-party rulesets · "report what did not run" | 3-sided gate · ship/no-ship table · sandbox · offline 6-rule pack | รับส่วน "what did not run" + ruleset list |
| security-operations | WS incident-response · VA | SRE triage | PICERL · SOC tiers · SIEM→MITRE · containment needs approval | คงของเรา |
| security-ops-design (cmd) | none | — | soc-design + threat-hunt + KPIs | ไม่มีคู่เทียบ |
| security-scan (cmd) | WS security-sast (528 l) | per-language tool install+run | discovery→scan→manual→severity→CWE/OWASP-2025/PoC→PDPA | รับส่วน tool table |
| seo-audit (cmd) / seo-audit-checklist | coreyhaines31/marketingskills seo-audit · 56k · MIT | schema JS-injection caveat · priority order · rankings-push 8–20 · hreflang | 1-question discovery · severity table · report template | รับส่วน 3 items |
| simplicity-first | VL writing-guidelines · AN "restraint" | prose linting | 5-item check per output type · ❌/✅ | ไม่มีคู่เทียบ |
| smart-contracts (7 refs) | TB building-secure-contracts · WS web3-testing | runs Slither/Echidna · non-EVM | tokenomics + Thai SEC 2018 · DeFi 360 l | รับส่วน ToB 5-step |
| software-diagrams | D7 mermaid-diagrams · WS mermaid-expert | syntax cheat-sheet · 17 types | question→diagram table · C4 · theme + check-mermaid-theme.mjs --self-test · Thai font | คงของเรา |
| spec-to-code-loop | SP writing-plans + executing-plans · MP to-tickets · TB spec-to-code-compliance | plan self-review 5 checks · frontier concurrency | per-requirement loop · 3-try rule · `stuck/<id>` · state file · mockup pixel compare | รับส่วน self-review |
| sprint-plan (cmd) | contains-studio sprint-prioritizer · VA scrum-master | RICE/Kano | reads USER-STORIES Ready · writes sprint-NN.md · never overwrite | คงของเรา |
| srs-writing | jam01/SRS-Template (477 · NOASSERTION) · BMAD prd | full ISO tree incl. 3.6 AI/ML · adapt-in menu | 7 rules/requirement · ids never reused · traceability · Thai grammar | รับส่วน 2 sections |
| stack-dotnet | WS dotnet-backend-patterns (810 l) · D7 · VA | Clean-Arch scaffold · Result pattern | .NET 8 vs Framework 4.x · EF Core table · th-TH/TimeProvider/Bangkok tz | คงของเรา (+Result snippet) |
| stack-mql | ThomasPraun/mql-developer · 54 · MIT | encyclopedic refs · Monte Carlo | metaeditor CLI · MT4↔MT5 port · pre-send order checker | รับส่วน gotchas |
| stack-python | WS python-development (16 skills) · TB modern-python · cursorrules | breadth · BAD/GOOD code | lockfile→tool · pandas 3 CoW · cp874 · traps | คงของเรา (+2 rows) |
| stack-sql | supabase/agent-skills (456k installs · MIT) · WS sql-optimization | partial indexes · RLS · bloat | correctness table (NULL/NOT IN · half-open dates · พ.ศ. · Thai collation) · multi-engine | คงของเรา (+2 rules) |
| stack-typescript | VL react-best-practices · WS typescript-advanced-types · cursorrules | React/Next perf ranked | repo detection · strict TS · env schema · Angular v22 · Intl.Collator('th') | รับส่วน link VL for React |
| superuser (branch) | SP using-superpowers + brainstorming + verification · MP to-spec chain · BMAD personas | Iron-Law gates · rationalization tables | 16 playbooks · trigger table · 3-agent vote · BUILD-PLAN decision log · token hook | รับส่วน 2 tables |
| test-case-template | D7 qa-test-planner (757 l) · BMAD · WS test-automator | regression suites | oracle labels [D]/[R]/[A]/[O] · "don't bake bugs into expected" · 3 boundary values · Excel builder | คงของเรา |
| test-design (cmd) | none | — | 10 categories + P1–P4 + automation flag | ไม่มีคู่เทียบ |
| test-evidence | feature-gif-recorder · ce-demo-reel (ยังไม่ได้ตรวจ) · AN webapp-testing | Playwright recording | captioned GIF PASS/FAIL · red box · Sarabun · results.csv→Excel | ไม่มีคู่เทียบ |
| testing-standards | SP test-driven-development · MP tdd | Iron Law · "name the break" · mutation check | use-existing-framework · 10 s budget · 70–80% no-decrease gate · per-stack | รับส่วน 2 checks |
| threat-model (cmd) | awesome-copilot threat-model-analyst (40k MIT) · WS stride · D7 | STRIDE-A · incremental diff · CVSS 4.0 · "non-capabilities" | DFD house-style · likelihood×impact · residual-risk sign-off · PDPA | รับส่วน 3 items |
| ui-craft | VL web-design-guidelines (771k installs) · AN frontend-design (1.0M) | lint-able UI rules · AI-tell list · plan→critique | one scale · app character 1-of-6 · 3 parallel directions · sibling-page rule | รับส่วน 2 items |
| user-story-writer | BMAD po · MP to-tickets | ticket graph · blocked-by | INVEST · single USER-STORIES.md · ids never reused · Thai | รับส่วน blocked-by |
| web-app-design | WS design-system-patterns · AN frontend-design | Style Dictionary pipeline | mockup-first · tokens.md + css + check-design-tokens.mjs · Thai | คงของเรา |
| web-service-essentials | secondsky health-check-endpoints (233 · MIT) · WS api-design-principles | k8s probe yaml | /version · RFC 9457 · live-must-not-check-deps + runnable test | คงของเรา (+probe yaml) |
| web3-design (cmd) | TB audit-prep · secure-workflow-guide | runs Slither | audit + tokenomics · jurisdiction (TH SEC · Howey · MiCA) dated | รับส่วน ToB steps |
| windows-app-design | microsoft/winappCli winui-design (via win-dev-skills 476) | `winapp find-ui` · app-shape anchors · window-sizing rubric · x:Bind landmines | HTML mockup first · fluent.css + FluentTokens · Avalonia | รับส่วน 3 tables |
| agents set (39) | WS (~120 agents) · VA (173) · contains-studio (37) · MetaGPT · ChatDev · BMAD | breadth · VA "Communication Protocol" | all carry `skills:` + model tier + hand-off target · 4 compliance officers · Thai regs in 24 files | คงของเรา |

**ที่ควรรับ:** 1 plan self-review 5 checks (SP) → spec-to-code-loop · 2 "name the break" + mutation check → testing-standards · 3 rationalization tables ย่อ → playbook-feature/ship · 4 WinUI anchors + control map + sizing rubric → windows-app-design · 5 threat model incremental + non-capabilities + STRIDE-per-interaction · 6 SEO schema caveat + priority + rankings-push · 7 semgrep "what did not run" + rulesets (เขียนใหม่) · 8 AI-tell list + VL rule link → ui-craft · 9 ISO 29148 §2.6/§3.6 + adapt-in menu (เขียนใหม่) → srs · 10 ToB 5-step → smart-contracts/web3-design
**ของเราที่ไม่มีใครมี:** oracle trust labels · captioned GIF evidence ไทย + Excel · Mermaid theme self-test · กับดักไทยทุก stack · MT4↔MT5 pre-send checker · live/ready split + runnable test · spec loop 3-try + stuck/ branch · tokenomics jurisdiction dated · agent set ที่ทุกตัวประกาศ skills + model + hand-off
**ไม่รับ:** SP "delete code written before the test" Iron Law verbatim · SP "ask user to choose execution method" · MP "confirm seam with user" · WS 800-line skills · VA agent template boilerplate · ThomasPraun 9.5k บรรทัด · TB semgrep hard gate · awesome-copilot orchestrator 10 ขั้น · jam01 NOASSERTION / TB CC-BY-SA ลอกข้อความไม่ได้ · CH seo-audit ทั้งก้อน · supabase RLS-centric · VL react wholesale

---

## 5 · personal-life (38 skill จริง) + thai-workplace (19)

| skill | ของนอกที่ดีสุด | เขาเด่น | เราเด่น | verdict |
|---|---|---|---|---|
| annual-checkup | sso.go.th/nhso.go.th ไม่มี skill | — | เลือกสิทธิ์ SSO/บัตรทอง/ขรก. | คงของเรา (ช่วงอายุ รอยืนยัน) |
| calendar-audit | alirezarezvani/claude-skills meetings · 29k · MIT | สคริปต์คิดเงิน attendees×min×rate + 23 นาที refocus | split รายเดือน vs target · worst-3 · วันหยุดไทย | รับส่วน สูตร refocus |
| cert-prep | rohitg00 claude-certification (เฉพาะ Claude) | mock exam 4 โหมด | weight×gap priority · ปฏิเสธ dumps | คงของเรา |
| decision-journal | Farnam Street template | confidence 1–10 · "อะไรจะทำให้ผิด" | one/two-way door · verdict grid โชค/ฝีมือ | รับส่วน confidence 1–10 |
| digital-hygiene | EFF SSD (CC BY) ไม่มี skill | threat model ลึก | *179*เลขบัตร# · *138*1# · LINE PIN · 1441 · 3-2-1 | ไม่มีคู่เทียบ |
| doctor-visit-prep | openclaw/skills medical · 4.2k · MIT | JSON record + emergency card | OLDCARTS · สิทธิ์/ใบส่งตัว · 1669 | รับส่วน emergency card 1 หน้า |
| elder-care | dop.go.th ไม่มี skill | — | ตารางสิทธิ์ · home-safety · handoff | คงของเรา (600–1,000 ยืนยัน 22 ต.ค.) |
| english-tech-reading | ไม่มี | — | decode EN→TH คงคำเดิม | ไม่มีคู่เทียบ |
| exercise-plan | WHO 2020 · NHS Couch-to-5K | แผนเสียง 9 สัปดาห์ | ร้อน/PM2.5 · 12 สัปดาห์ | คงของเรา |
| gift-idea-tracker | Notion/Gumroad (เสียเงิน) | — | โอกาสไทย · กฎ ป.ป.ช. 3,000 | ไม่มีคู่เทียบ |
| goal-and-habit | ballred/obsidian-claude-pkm · 1.9k · MIT | auto-tracking ใน vault | 3 เป้า · 2-min rule · failure review | คงของเรา |
| home-maintenance | claudskills Home TLC (US) | — | 3 ฤดูไทย · checklist ใบเสนอราคาช่าง | ไม่มีคู่เทียบ (ไทย) |
| household-bills | erc/mea ทางการ | — | anatomy บิล · spike checklist | คงของเรา (Ft 16.23 ก.ย.–ธ.ค. 69 ยืนยัน) |
| important-docs | Notion Expiration Tracker | — | CSV ร่วมกับ warranty · lead days ไทย | ไม่มีคู่เทียบ |
| inbox-triage | alirezarezvani inbox-triage (312 บ. + KB 7 ไฟล์) | รันบน MCP · draft_safety_validator · window ตาม cadence | วิธีมือ 10 นาที · phishing ธนาคารไทย · waiting-for | รับส่วน DRAFTS-ONLY + window |
| interview-prep | ResumeSkills interview-prep-generator · 2.8k · MIT | story 3 ความยาว · ชุดคำถามตามสาย | คำถาม HR ไทย + กฎหมาย · thank-you TH | รับส่วน story 3 ความยาว |
| kids-school | สพฐ./rd ไม่มี skill | — | 4 peaks · doc checklist | คงของเรา (ลดหย่อนบุตร ยืนยัน) |
| learning-path | roadmap.sh (CC BY) | ครอบคลุม | milestone ผูกโปรเจกต์จริง | คงของเรา |
| linkedin-profile | ResumeSkills linkedin-profile-optimizer | All-Star checklist · banner 1584×396 | keyword ตลาดไทย · JLPT | รับส่วน banner + ขอ recommendation |
| meal-plan-grocery | claudskills / Mealie | macro · recipe DB | ลำดับตลาดสด · อาหารปลอดภัยในอากาศร้อน | คงของเรา |
| medication-schedule | openclaw medical | interaction screen | copy-never-compose · คำฉลากไทย · 1367 | คงของเรา (ไม่รับ interaction screen) |
| meeting-prep-card | alirezarezvani meetings | gate ASYNC/NOT-READY/MEET | การ์ด 1 หน้า · มารยาทผู้ใหญ่ · BATNA | รับส่วน "ไม่มี decision → async" |
| meeting-summary | github/awesome-copilot meeting-minutes · 40k · MIT | schema 12 ส่วน · rationale ต่อ decision · TBD rule | รายงานการประชุมไทย · [owner?] | รับส่วน rationale ต่อ decision |
| paper-to-practice | ai-paper-reproduction-skills (security pending) | pipeline เต็ม | ตัวอย่าง stdlib รันจริง | คงของเรา |
| performance-self-review | awesome-copilot brag-sheet (248 บ.) | backfill จาก git/PR · evidence ladder 🥇→⚠️ | impact categories ผู้บริหารไทย | รับส่วน evidence ladder + backfill |
| personal-kb | nicholasspisak/second-brain · 755 · kepano/obsidian-skills 50k MIT | wizard + ingest/query/lint | ปัญหาค้นภาษาไทย (tag 2 ภาษา) | รับส่วน lint รายเดือน |
| pet-care | dld.go.th | — | ตารางกฎหมาย · record | คงของเรา |
| resume-th-en | Composio tailored-resume-generator (345 บ.) · ResumeSkills ats-optimizer | จัดชั้น requirement 3 ระดับ · career-changer | Thai/Hybrid/Intl · PDPA no-ID · ฝังฟอนต์ · พ.ศ. | รับส่วน 3-tier requirement |
| salary-negotiation | ResumeSkills salary-negotiation-prep + offer-comparison | percentile 25/50/75/90 · timeline Day 1–10 · levers นอก base | แหล่งไทย RW/Adecco · PVD/SSO · §118 | รับส่วน timeline + levers |
| side-project-picker | michalparkola/tapestry · 560 · MIT | reps จากเนื้อหาเรียน | คะแนน 3L+3F+2U+P · scope-cut | คงของเรา |
| sleep-log | AASM · sleep diary รพ. | — | สูตร efficiency · 1323 | คงของเรา |
| subscription-audit | ไม่พบ | — | pattern statement ไทย · break-even | ไม่มีคู่เทียบ |
| superuser (personal-life) | SP brainstorming | ถาม 1 ข้อ/ครั้ง · design-doc gate | playbook ต่อหมวด · รออนุมัติ · หยุดเมื่อฉุกเฉิน | คงของเรา |
| tech-radar | Renovate/Dependabot (เครื่องมือ) | อัตโนมัติ | Act/Know/Skip · official notes เท่านั้น | ไม่มีคู่เทียบ |
| thesis-writing | galaxy-dawn/claude-scholar citation-verification · 5.9k · MIT | ลำดับแหล่ง DOI→arXiv→CrossRef→S2→Zotero | คู่มือคณะก่อน · ThaiJO/ThaiLIS · typesetting ไทย | รับส่วน ลำดับแหล่งยืนยัน |
| travel-prep | ailabs travel-planner · 457 · MIT | preference DB | entry rule · passport ไทย · TDAC | คงของเรา |
| vehicle-care | dlt/oic | — | yearly chain · ชั้นประกัน | **ข้อเท็จจริงต้องอัปเดต**: ค่าตรวจ ตรอ. 200/60 "legally fixed" ไม่พบยืนยัน → ติด (รอยืนยัน) |
| weekly-review | alirezarezvani weekly-review · GTD official | gate exit code · open-loop scanner | 20 นาที · checklist ไทย · slipped-twice | รับส่วน scan หลักฐานก่อนถามความจำ |
| dbd-annual-filing | dbd.go.th | — | timeline · ค่าปรับ | คงของเรา (AGM 30 เม.ย. ยืนยัน) |
| doc-contract-th | rd.go.th อากรแสตมป์ | — | ตารางประเภท · red flags | คงของเรา — จ้างทำของ 1/1,000 · กู้ 1/2,000 ยืนยัน → เอา รอยืนยัน ออกได้ 2 จุด |
| doc-leave | ไม่มี | — | สูตร balance | ไม่มีคู่เทียบ |
| doc-quotation | antronic/thai-baht-text-js (MIT) | โค้ดแปลงบาทมี test | matrix 5 เอกสาร · WHT | รับส่วน อ้าง lib |
| doc-thai-official | OpenOffice Thai template (2010) | — | ตารางคำขึ้นต้น · ด้วย→ข้อเท็จจริง→ในการนี้ | ไม่มีคู่เทียบ |
| e-tax-invoice | rd.go.th/27659 | — | ตาราง 8 ช่อง | **ข้อเท็จจริงต้องอัปเดต**: RD ปี 2567 ให้รายได้ >30 ล้านใช้ Time Stamp ได้ (FlowAccount 19 ก.ย. 68) → ติด (รอยืนยัน) |
| labour-law-basics | ราชกิจจาฯ ฉบับที่ 9 (มีผล 7 ธ.ค. 68 ยืนยัน) | — | OT/severance math | คงของเรา |
| line-broadcast / line-chatbot / line-oa-setup / line-richmenu | lineforbusiness · developers.line.biz ทางการ · vm0-ai line 75 | curl ทุก endpoint | quota math · reply-vs-push cost · KB มีวันตรวจ · กฎ 6 ปุ่ม | คงของเรา (ราคา/token ตรงทางการ; chatBarText 14 รอยืนยัน) |
| payroll-th | mythaitaxes-mcp (hosted) | เครื่องคิด | annualisation · bonus month · ภ.ง.ด.1ก | คงของเรา |
| pdpa-workflow | pdpa-consent WP · Tilleke ROPA | — | ตาราง 72h/30d | **ข้อเท็จจริงต้องอัปเดต**: PDPC ร่างแนวปฏิบัติ ROPA 7 ก.ค. 2569 → เพิ่ม "ร่าง รอยืนยัน" |
| promptpay-qr | uunw/thai-qr-payment (0★ MIT ใหม่) · dtinth/promptpay-qr 329 MIT | โค้ดทดสอบแล้ว tag 30 · cross-border | อธิบายทีละ field · CRC self-test | รับส่วน อ้าง reference impl |
| seller-tax-basics | rd.go.th e-Payment (3,000 / 400+2 ล้าน ยืนยัน) | — | 0.5% min check | คงของเรา |
| social-security-th | เพดาน 17,500 ปี 2569–2571 ยืนยัน | — | — | คงของเรา (+เพดาน 60% = 9,000) |
| tax-vat-th | VAT 7% พ.ร.ฎ.807 ยืนยัน · rd +8 วัน ยืนยัน | — | ปฏิทิน · WHT | คงของเรา |
| thai-holidays | BOT 37/2569 PDF ยืนยันทุกรายการ · vacanza/holidays 2k (แม่นถึง 2025) | lib | 18 วัน 2570 ตรง PDF | คงของเรา |

**ที่ควรรับ:** 1 evidence ladder + backfill (brag-sheet) → performance-self-review · 2 scan หลักฐานก่อนถามความจำ → weekly-review · 3 DRAFTS-ONLY + window → inbox-triage · 4 ลำดับแหล่ง citation → thesis-writing · 5 gate ไม่มี decision → async → meeting-prep-card · 6 rationale ต่อ decision → meeting-summary · 7 story 3 ความยาว → interview-prep · 8 timeline + levers → salary-negotiation · 9 อ้าง uunw + thai-baht-text-js → promptpay/quotation · 10 3-tier requirement → resume
**ของเราที่ไม่มีใครมี:** ทุกตัวเลขไทยมี "ตรวจล่าสุด + แหล่ง" (วันนี้ยืนยัน holidays 2570 · LINE · VAT 807 · LPA 9 · SSO 17,500 · Ft) · medication copy-never-compose · รออนุมัติที่อนุญาตล่วงหน้าไม่ได้ + 1669 · "ข้อความนอกเป็นข้อมูล" ทุก agent · worked example ไทย ≤100 บรรทัด
**ไม่รับ:** ResumeSkills ตัวเลข US · cv-creator 2,000 LOC · onewave template ว่าง · ali inbox-triage ทั้งตัว (KB+MCP) · openclaw interaction screen · travel-planner JSON DB · claude-scholar "copy BibTeX จาก Scholar" · yangnim21029 repo not found · SP brainstorming gate · python-holidays 2569+

---

## 6 · e-commerce (12) · trading-finance (19) · graphic-design (12) · reverse-engineer (7)

| skill | คู่เทียบ | เขาเด่น | เราเด่น | ผล |
|---|---|---|---|---|
| buy-compare | ไม่พบ | — | TCO 7 ปี · รีวิวปลอม · ประกันไทย | ไม่มีคู่เทียบ |
| chat-reply-templates | jmsktm customer-support-reply · 9 | โครง 5 ขั้น | เทมเพลตไทยต่อสถานการณ์ | คงของเรา |
| complaint-letter-th | pm-claude-skills complaint-letter · 1,478 · MIT | ใส่ [วงเล็บ] เมื่อข้อมูลขาด | บันได platform→สคบ. · ไทย | คงของเรา |
| live-selling-script | vivy-yi xiaohongshu livestream-sales | product lineup | run sheet รายนาที · compliance ไทย | คงของเรา |
| marketplace-fees-pricing | flowaccount.com (2026-08-10) ไม่มี skill | — | สูตร + VAT 7/107 | **ข้อเท็จจริงต้องอัปเดต** (TikTok ฿1.07 เฉพาะ >100 ชิ้น/30 วัน · CGF 6.42 vs 5.89) |
| multi-shop-stock | ไม่พบ | — | reorder point · กฎ sync | ไม่มีคู่เทียบ |
| product-listing | pm-claude-skills marketplace-listing-optimizer | วินิจฉัย visibility vs conversion · จัดอันดับ action | Shopee/Lazada/TikTok/LINE · prohibited-claims ไทย | รับส่วน diagnose + rank |
| refund-request | pm-claude-skills dispute-letter | caveat เส้นตาย | กฎหมายไทยรายมาตรา | คงของเรา |
| returns-and-bad-reviews | pm-claude-skills review-response | "เขียนให้ลูกค้าคนถัดไป" · ห้ามเปิดเลขออเดอร์ · ห้ามจูงใจลบรีวิว · 5 กรณี | return window ต่อแพลตฟอร์ม · dispute flow | รับส่วน 3 กฎ + sizing/fit |
| shipping-compare / warranty-tracker | ไม่พบ | — | chargeable weight · เคลม · กฎหมายประกัน | ไม่มีคู่เทียบ |
| debt-payoff | openaccountant/skills · 97 · MIT | ตารางเดือน · CSV | เพดาน 16/25/24% · ขั้นต่ำ 8% ถึงสิ้น 2569 ✓ | คงของเรา |
| dividend-tracker | tradermonty/claude-trading-skills · 3.2k · MIT | ต้อง FMP API | ม.115 · เครดิตภาษี 10% | คงของเรา |
| emergency-fund / insurance-review | openaccountant (ยังไม่ได้ตรวจ body) | monitor | ladder 3 ชั้น · DPA 1 ล้าน · co-pay 20 มี.ค. 68 | คงของเรา |
| mutual-fund-picker / tax-basics-th / scam-check / watchlist-setup | ไม่พบ | — | RMF/ThaiESG · crypto exempt 2568–2572 · SEC Check First · 1441 | ไม่มีคู่เทียบ |
| paper-trading | SET official trading-hours | — | board lot/tick/ceiling/T+2 | รับส่วน **เวลาซื้อขาย** (บ่าย pre-open 13:30 ตั้งแต่ 25 มี.ค. 67) |
| personal-budget | openaccountant zero-based-budget | ทุกบาทมีหน้าที่ · CSV | ตัวอย่างกรุงเทพ 2569 | คงของเรา |
| portfolio-snapshot / news-impact / post-trade-review / technical-signals / trade-journal | tradermonty (ต้อง API/รูป) | lifecycle · หลาย skill ย่อย | ไม่ต้อง API · กฎใหม่ 1 ข้อ · ไทย | คงของเรา |
| position-sizing | omer-metin risk-management-trading · 179 · Apache-2.0 | ตาราง drawdown→gain · volatility scaling | tick ใหม่ 16 พ.ย. 2569 ตรง SET No87 · board lot 500→50 ✓ | รับส่วน ตาราง drawdown-recovery |
| retirement-plan | joellewis finance_skills · FerroxLabs fire-planner | Guyton-Klinger guardrails | บำนาญ ม.33 · กอช. · เพดาน 500,000 | รับส่วน guardrails |
| tax-deduction-planner | sec.or.th · kbank โพย 2569 | — | ตาราง 20 รายการ | คงของเรา (RMF 30%/500k · ThaiESG 30%/300k ตรง ณ 2026-10-22) |
| brand-kit | AN brand-guidelines · netresearch (ยังไม่ได้ตรวจ) | แพ็กแบรนด์ลง skill | contrast matrix · thai-fonts.md | คงของเรา |
| brief-to-image | JustinPerea/midjourney-cc-skill · 16 · MIT | --sref · failure modes | prompt anatomy เป็นกลาง · ไทยในภาพ | รับส่วน failure-modes + หมายเหตุ Imagen ใน Gemini API เลิกแล้ว (→ gemini-2.5-flash-image) |
| campaign-set / image-editing-brief / style-consistency / video-script-to-clip / asset-organize | pm-claude-skills promotion-plan · short-form-script · midjourney --sref | hook 0–3s · style blend | derivation order · keep list · shot brief · ซับไทย | คงของเรา |
| design-review | garrytan/gstack design-review (1,961 บ.) | 10 หมวด ~80 ข้อ · squint test · trunk test | ใช้กับภาพนิ่ง/โปสเตอร์ · 87 บรรทัด | รับส่วน squint test + typography 3–4 ข้อ |
| image-generation | AN canvas-design | manifesto ก่อนวาด | ลำดับ generate→draw→stock · svg-illustration | รับส่วน philosophy 1 ย่อหน้า |
| motion-basics | material-web _md-sys-motion.scss (Apache-2.0) · dylantarre motion-scale | token มาตรฐาน · emphasized curves | ช่วงเวลาสอดคล้อง M3 · exits สั้นกว่า | รับส่วน ตาราง M3 easing |
| social-formats | Meta ads-guide ทางการ (ตรวจวันนี้ 1440×2560 · safe 14/35/6 ตรง) | — | 4 canvases + LINE 1040 | คงของเรา |
| reverse-engineer (router) | binary-re (ยังไม่ได้ตรวจ) · TB ไม่มี ghidra/frida/.NET/Electron | — | กฎหลักฐาน 4 ข้อ · authorization | คงของเรา |
| analyze-apk | mukul975 jadx skill · Apache-2.0 | jadx --deobf · grep pattern · androguard | สิทธิ์ก่อน · Flutter libapp.so | รับส่วน คำสั่ง jadx + pitfalls |
| analyze-dotnet | aaronontheweb/dotnet-skills ilspy-decompile · 1.2k · MIT | ilspycmd flags · ReadyToRun/AOT caveat | obfuscation · กฎหลักฐาน | รับส่วน คำสั่ง + caveat |
| analyze-js-electron | JimLiu/baoyu-skills electron-extract · 26.9k · MIT | สคริปต์จริง · source map → prettier | ไล่ feature จาก UI → ไฟล์ | รับส่วน ขั้นตอน (ไม่เอาสคริปต์) |
| analyze-native-binary | TB skills-curated ghidra-headless · 518 · CC-BY-SA | automation ครบ · decompile vs disassembly | ทำได้โดยไม่มี Ghidra | รับส่วน output set (เขียนใหม่) |
| analyze-website | ไม่พบ | — | ห้ามเดา server-side | ไม่มีคู่เทียบ |

**ที่ควรรับ:** 1 เวลาซื้อขาย SET 13:30 → paper-trading · 2 ฿1.07 TikTok เงื่อนไข + CGF → marketplace-fees · 3 กฎตอบรีวิว 3 ข้อ → returns · 4 diagnose + rank → product-listing · 5 jadx commands → analyze-apk · 6 ilspycmd + caveat → analyze-dotnet · 7 asar ขั้นตอน → analyze-js-electron · 8 ghidra output set (เขียนใหม่) → analyze-native-binary · 9 M3 easing → motion-basics · 10 drawdown-recovery → position-sizing
**ของเราที่ไม่มีใครมี:** ข้อเท็จจริงไทยมีวันตรวจ+แหล่ง · กฎ SET ในตัวเลข · ภาษี/กฎหมายไทยรายมาตรา · กฎหลักฐาน RE + authorization · ลำดับหารูป + ข้อความไทยในภาพ
**ไม่รับ:** zhaoxuya reverse-skill / raptor frida (Tessl เตือน RCE/malicious) · gstack ทั้งตัว (commit อัตโนมัติ) · tradermonty/openaccountant ยกชุด (API US) · baoyu scripts (bun/npx runtime) · canvas-design manifesto บังคับ · Midjourney --sref ผูกโมเดล · ตัวเลข 2570 ที่ยังไม่ประกาศ

---

## 7 · หมวดที่เรายังไม่มี (ecosystem survey · 14 collections · 2,283 community plugins)

| # | หมวด | ecosystem มี | เรามี | คุณค่า | บ้าน | ขนาด |
|---|---|---|---|---|---|---|
| 1 | MCP server building | mcp-server-dev (official) · mcp-builder (AN) · ชุมชน 61 | ไม่มี (ใช้ MCP อย่างเดียว) | H | software-company | skill ใหม่ |
| 2 | Skill authoring + evals รูปแบบทางการ (`claude plugin eval` · case.yaml · `/skill-doctor`) | skill-creator (AN) · SP writing-skills · MP writing-great-skills | evals/ ของเราเอง (triggers/speed/coding) · coding-evals | H | superuser | skill ใหม่ + แปลง evals |
| 3 | Browser verification | AN webapp-testing · built-in `/verify` `/run-skill-generator` · vercel agent-browser | e2e-testing-patterns · app-verifier (ทับกับ built-in) | H | software-company | reference |
| 4 | Git worktree + finish branch + merge conflicts | SP using-git-worktrees · MP resolving-merge-conflicts (551k installs) · `--worktree` | evals ใช้ worktree · parallel-split ไม่มี isolation | M-H | software-company | skill ใหม่ |
| 5 | TDD workflow (ชื่อ/trigger) | SP tdd (258k) · MP tdd (1.1M) · tdd-guard hook | spec-to-code-loop ใกล้ แต่ไม่ route คำว่า TDD | M | software-company | trigger + reference |
| 6 | Accessibility audit (WCAG) | VL web-design-guidelines (771k) · WS accessibility-compliance | ui-craft พูดถึง · ไม่มี audit | M-H | software-company | skill ใหม่ |
| 7 | Web performance (Lighthouse/INP) | VL vercel-optimize · WS application-performance | ไม่มี | M | software-company | skill ใหม่ (รวมกับ 6 ได้) |
| 8 | Cloud infra / IaC | microsoft/azure-skills (1.6k) · WS cloud/k8s · VA terraform | devops-engineer agent · cicd · docker-sandbox | M | software-company | skill + pointer vendor |
| 9 | Dependency / vulnerability updates | TB supply-chain · WS dependency-management · ชุมชน 151 (มากสุด) | security-gate ตรวจ ไม่วางแผน upgrade | M-H | software-company | reference ใน security-gate |
| 10 | Code migration / framework upgrade | code-modernization (official) · WS framework-migration | legacy-spec-recovery · replace-then-delete | M | software-company | reference |
| 11 | API contract testing (OpenAPI) | 42crunch · swagger-contract-testing | api-conventions · web-service-essentials | M | software-company | reference |
| 12 | Memory / context engineering | auto memory built-in · claude-md-management · claude-mem (102k) | handoff · owner-style-capture | M | superuser | reference (เขียนลง auto-memory) |
| 13 | Hook enforcement (block) + PostCompact | hookify (official) · tdd-guard · ชุมชน 247 | hook 7 events แจ้ง ไม่บล็อก | M-H | superuser | ขยาย hook |
| 14 | Spec interview "grill me" | MP grill-me (1.4M · #2 skills.sh) | brainstormer · srs | M | superuser | reference ใน brainstormer |
| 15 | Data analysis + notebooks | VA data-scientist · WS business-analytics | stack-python · data-engineer | M | software-company | skill ใหม่ |
| 16 | Design-to-code (Figma MCP) | hyperframes figma · ชุมชน 36 | web-app-design mockup-first | M-L | software-company | reference |
| 17 | Docs site (Docusaurus/MkDocs) | WS documentation-generation · ชุมชน 75 | technical-writer | L-M | software-company | reference |
| 18 | HR / recruiting ไทย (JD · scorecard) | WS hr-legal-compliance · ชุมชน 72 | labour-law · payroll · onboard | M | thai-workplace | skill ใหม่ |
| 19 | แปล EN↔TH + Thai NLP | BV thai-translate · thai-text-processing (PyThaiNLP · RTGS) · thai-address · thai-id-validate | human-writing สองภาษา · ไม่มีแปล | H | superuser + software-company | skill + reference |
| 20 | Education / course-builder (ฝั่งผู้สอน) | MP teach (854k) · scaffold-exercises · ชุมชน 74 | learning-path (ฝั่งผู้เรียน) | M | personal-life | skill ใหม่ |
| 21 | Video/podcast production | heygen hyperframes (70k) · remotion · capcut | video-script-to-clip | M-L | graphic-design | reference |
| 22 | Thai SME accounting APIs (PEAK/FlowAccount) | ไม่มีที่ไหน | e-tax-invoice · quotation | M | thai-workplace | reference (API ยังไม่ได้ตรวจ) |
| 23 | Thai e-commerce/payment APIs (Shopee · Lazada · LINE Pay) | wasintoh line-oa-mcp-ultimate (102) | promptpay · LINE OA | M | e-commerce | reference |
| 24 | Thai business planning (จดทะเบียน · landed cost 1688) | BV business skills (MIT) | dbd-annual-filing | M | thai-workplace | adapt 2 |
| ครอบคลุมแล้ว | spreadsheet · release management · email marketing · customer support · security review · prompt engineering อื่น | | | L | — | — |

**เติมก่อน 8 อันดับ:** 1 MCP server building (1 วัน) · 2 skill-authoring + evals รูปแบบทางการ (2–3 วัน · 302 skill ไม่มี regression gate ต่อ model update) · 3 browser verification ผ่าน built-in /verify (0.5 วัน) · 4 worktree + finish-branch (1 วัน · superuser 3.0 fan-out ชนกันถ้าไม่มี) · 5 แปล EN↔TH + Thai NLP reference (1 วัน) · 6 a11y + performance audit (1 วัน) · 7 dependency update workflow (0.5 วัน) · 8 hook บล็อก + PostCompact re-inject (1 วัน) · รอง: hiring-th · course-builder · ธุรกิจไทย

**built-in ที่กระทบ skill เดิม:** `/run` `/verify` `/run-skill-generator` ทับ app-verifier-setup/upkeep · project skill ชื่อ `verify`/`simplify` ถูกรันอัตโนมัติก่อน commit · `/skill-doctor` รายงานต้นทุน skill ที่ไม่ได้ใช้ (302 ตัวจะโดนธง) · `/doctor prompt-audit` · auto memory 4 ชนิด · deprecated: output styles · TaskOutput · `claude config`

**ไม่เติมโดยตั้งใจ:** Lark/Feishu · vendor DB/platform skills (Prisma/Supabase/Neon/Azure ยกชุด) · memory stores (claude-mem) · terse packs (caveman) · video render pipelines · Composio 1,000 apps · design-taste packs (ui-ux-pro-max) · Lean/olympiad/SAP/M365 · smart-contract audit tooling

---

## licence ที่ต้องระวังก่อนรับ
- **trailofbits/skills · OWASP cheat sheets** — CC-BY-SA-4.0 share-alike: ลิงก์ได้ ลอกข้อความแล้วติด licence ไป plugin ที่ขาย → เขียนใหม่ด้วยคำเรา
- **borghei/Claude-Skills** — MIT + Commons Clause ห้ามใช้เชิงพาณิชย์ → เขียนใหม่จากความเข้าใจ
- **anthropics/skills docx·pptx·pdf·xlsx** — source-available ไม่ใช่ OSS · **anthropics/healthcare** — ToS ไม่มี LICENSE → ลิงก์เท่านั้น
- **jam01 SRS-Template** NOASSERTION · **vercel-labs** ไม่มี LICENSE ใน API (ยังไม่ได้ตรวจ) · **gstack** licence ไม่แสดง
- ตัวเลขดาวจาก shields.io/aggregator วันนี้ ใช้เทียบลำดับ อย่าใส่เอกสารลูกค้าโดยไม่ตรวจซ้ำ

ไฟล์ดิบที่ agent ดึงไว้: scratchpad/ext/ (superpowers · wshobson · trailofbits · ECC · madr · raw/) และ tool-results/ SET No87 PDF — อยู่นอก repo ลบได้
