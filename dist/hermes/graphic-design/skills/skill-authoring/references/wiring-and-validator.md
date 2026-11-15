# Wiring a new skill, and what the validator enforces

Moved from SKILL.md sections 4 and 5. Section numbers in the text below ("หัวข้อ 6", "หัวข้อ 4") refer to the old SKILL.md numbering: 4 = this wiring list, 6 = evals ([`eval-cases`](eval-cases.md)), 7 = before/after test ([`before-after-testing`](before-after-testing.md)).

## Wiring — ต่อสายให้ครบ: skill ใหม่ 1 ตัวแตะไฟล์เหล่านี้

| ไฟล์ | ทำอะไร |
|---|---|
| `plugins/<plugin>/skills/<name>/SKILL.md` | ตัว skill |
| ของกลางใน `superuser` เท่านั้น: `scripts/sync/sync-superuser.mjs` รายการ `SHARED_ONLY_IN_SUPERUSER` และ `scripts/build/build-targets.mjs` รายการ `SHARED_SKILLS` | เพิ่มชื่อ เรียงตามตัวอักษร ทั้ง 2 รายการต้องตรงกัน |
| `scripts/sync/file-map-th.json` → `node scripts/sync/sync-file-map.mjs` | คำอธิบายไทย 1 บรรทัด แล้วสร้าง `docs/FILE-MAP.md` ใหม่ |
| `plugins/superuser/hooks/skill-router.json` | pattern 1 แถว · ทดสอบ: `node -e "const j=require('./plugins/superuser/hooks/skill-router.json');for(const s of ['ประโยคจริง 1','ประโยคที่ไม่เกี่ยว'])console.log(s,j.rules.filter(r=>new RegExp(r.pattern,'i').test(s)).flatMap(r=>r.skills))"` · **แก้ JSON หรือ YAML ที่มี regex ด้วย Edit หรือสคริปต์ที่เป็นไฟล์ ห้ามผ่าน heredoc ใน Bash** เพราะ `\\b` หายเหลือ `\b` ซึ่งเป็น backspace (เกิด 5 ครั้งถึง 2026-10-26) · `sync-superuser --check` และ validator จับอักขระควบคุมกับ `\s` ใน YAML แบบ `"..."` ให้แล้ว |
| `plugins/superuser/skills/superuser/references/triggers.md` | แถวสถานการณ์ → skill ให้หัวหน้าทีมอ่าน |
| `plugins/<plugin>/evals/<name>-*/case.yaml` × 3 | หัวข้อ 6 |
| `plugins/<plugin>/CHANGELOG.md` หัวข้อ Unreleased | 1 bullet |
| `plugins/<plugin>/.claude-plugin/plugin.json` ช่อง `version` | เพิ่มเลขทุกครั้งที่แก้เนื้อ plugin · ไม่เพิ่ม `claude plugin update` จะตอบว่าล่าสุดแล้วทั้งที่เนื้อเปลี่ยน (เจอในคอร์ส 2026-11-04) · validator ไม่ตรวจข้อนี้ ต้องทำมือ |
| `node scripts/build/build-targets.mjs` | สร้าง `dist/` ใหม่ (ทำตอนปล่อยรุ่น ไม่ต้องทุกครั้ง) |

## Validator — สิ่งที่ validator บังคับ: `node scripts/check/validate-marketplace.mjs`

รันก่อนส่งทุกครั้ง (`--warn` ให้เตือนนับเป็นไม่ผ่าน · `--self-test` พิสูจน์ว่าตัวตรวจยังจับได้) · ออก exit 1 เมื่อมี error ใช้เป็นด่านใน CI ได้ · ตรวจ:

1. frontmatter: ขึ้นต้น `---` บรรทัดแรก · มีบรรทัดปิด · ทุกบรรทัดเป็น `key: value` · ค่าที่มี `: ` หรือขึ้นต้นด้วยอักขระพิเศษต้องครอบเครื่องหมายคำพูด · ไม่ใช้ block scalar (`|` `>`)
2. `name`: มี · ตรงชื่อโฟลเดอร์หรือไฟล์ · a-z 0-9 `-` · ไม่เกิน 64 · ไม่มี anthropic/claude
3. `description`: มี · ขึ้นต้น "Use when" หรือ "ใช้เมื่อ" · ไม่เกิน 160 (เตือน 150 · agent 120) · ไม่สั้นจนไม่บอกว่าใช้เมื่อไหร่ · ไม่มี `< >`
4. เนื้อ SKILL.md ไม่เกิน 500 บรรทัด (เตือนเมื่อใกล้) · ไฟล์ยาวต้องมีสารบัญ · ตาราง markdown: มีหัวและแถว `|---|` ทุกแถวมีจำนวนช่องเท่าหัว (แถวหลุดเพราะบรรทัดว่างคั่นคือบั๊กที่เจอบ่อยสุด)
5. agent: `tools:` ไม่ใช่ `allowed-tools:` · มี `## Writing` ชี้ `human-writing`
6. playbook: กฎในหัวข้อ 3 ทุกข้อ (agent and playbook rules, kept in SKILL.md section 3)
7. plugin: มี `.claude-plugin/plugin.json` · `version` เป็น x.y.z · description ไม่เกิน 500 ตัว (claude.ai ปฏิเสธถ้าเกิน) · ประกาศใน `marketplace.json` และ README ครบ · `mcpServers` ล็อกรุ่น `<แพ็กเกจ>@x.y.z`
8. ของกลาง: `sync-superuser --check` และ `sync-prompt-rules --check` ตรงต้นฉบับ · ชื่อใน `skill-router.json` มีจริง · คำที่เลิกใช้ (`scripts/check/deprecated-terms` ในตัว validator) ไม่ค้าง · ค่าใน `facts.json` ยังตรงไฟล์
