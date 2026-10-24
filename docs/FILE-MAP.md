<!-- สร้างโดย scripts/sync/sync-file-map.mjs · แก้คำอธิบายที่ scripts/sync/file-map-th.json ไม่แก้ที่นี่ -->

# แผนผังไฟล์ (file map)

แต่ละ plugin มีไฟล์อะไร ใช้ทำอะไร · สร้างจากไฟล์จริงใน `plugins/` · เพิ่มหรือลบ skill แล้วรัน `node scripts/sync/sync-file-map.mjs` (`build-dist.cmd` รันให้แล้ว)

## สารบัญ

| plugin | ทำอะไร | agent | skill | คำสั่ง | playbook | ไฟล์ทั้งหมด |
|---|---|---|---|---|---|---|
| [`e-commerce`](#e-commerce) | ซื้อ-ขายออนไลน์ทั้งสองฝั่ง ขายบน Shopee Lazada TikTok และซื้ออย่างรู้สิทธิ์ | 4 | 12 | 6 | 13 | 59 |
| [`graphic-design`](#graphic-design) | ทำโลโก้ แบรนด์ โพสต์ และคลิปให้หน้าตาเป็นชุดเดียวกัน | 5 | 15 | 6 | 9 | 82 |
| [`personal-life`](#personal-life) | จัดการงานธุระ เอกสาร ประชุม เป้าหมาย บ้าน สุขภาพ อาชีพ และการเรียนรู้ | 9 | 39 | 16 | 30 | 144 |
| [`reverse-engineer`](#reverse-engineer) | reverse engineer แอป ไบนารี เว็บ และ APK จากหลักฐาน แล้วสร้างใหม่ | 1 | 7 | 1 | 4 | 31 |
| [`software-company`](#software-company) | ทีมซอฟต์แวร์ครบชุด ตั้งแต่โจทย์จนส่งมอบ | 39 | 95 | 29 | 17 | 780 |
| [`superuser`](#superuser) | ทีมผู้ช่วยทำงานหลายขั้นให้จบพร้อมตรวจ | 3 | 34 | 0 | 7 | 100 |
| [`thai-workplace`](#thai-workplace) | เอกสาร ภาษี เงินเดือน LINE และ PDPA ของบริษัทไทย | 4 | 21 | 8 | 9 | 72 |
| [`trading-finance`](#trading-finance) | วางแผนเงิน ดูพอร์ต และเทรดอย่างมีวินัย ไม่ชี้นำ | 4 | 19 | 7 | 10 | 66 |

## โครงของทุก plugin

```
plugins/<plugin>/
├─ .claude-plugin/plugin.json   ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง
├─ CHANGELOG.md                 บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร
├─ agents/<ชื่อ>.md             agent 1 ไฟล์ต่อ 1 ตัว: บทบาท · เครื่องมือที่ใช้ได้ · skill ที่ต้องโหลด
├─ skills/<ชื่อ>/SKILL.md        skill 1 โฟลเดอร์ต่อ 1 ตัว: ใช้เมื่อไร · ทำอย่างไร
│  ├─ references/              รายละเอียดที่ skill เปิดอ่านเมื่อต้องใช้ (ไม่โหลดทุกครั้ง)
│  ├─ templates/               แบบไฟล์ที่คัดลอกไปใช้ในโปรเจกต์
│  └─ scripts/                 สคริปต์ที่ skill เรียกใช้
└─ (hooks/ มีใน superuser ที่เดียว · ดู ของกลาง)
```

- **skill** → Claude โหลดเองเมื่องานตรงกับ description
- **คำสั่ง** → skill ที่ Claude ไม่โหลดเอง ต้องพิมพ์ `/<plugin>:<ชื่อ>`
- **agent** → ลูกทีมที่หัวหน้าทีม (SuperUser) ส่งงานให้
- **playbook** → ขั้นตอนของงานแต่ละแบบ อยู่ใน `skills/superuser/references/playbook-*.md`

## ของกลาง

อยู่ใน `plugins/superuser` ที่เดียว · plugin อื่นประกาศ `"dependencies": ["superuser"]` แล้วใช้ร่วมกัน · `scripts/sync/sync-superuser.mjs` คัดลอกเฉพาะไฟล์กลางของ `skills/superuser/` (ทุก plugin มี skill superuser ฉบับของตัวเอง)

| ชนิด | ชื่อ | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ |
|---|---|---|---|
| skill | `adversarial-review-panel` | คณะรีวิว 3 มุมที่หาจุดอ่อนก่อนส่งงาน | — |
| skill | `agent-patterns` | เลือกรูปแบบการทำงานของ agent (วางแผน · ReAct · ตรวจตัวเอง · หลาย agent · รวมคำตอบ) | `references/pattern-details.md` |
| skill | `answer-shape` | เลือกว่าคำตอบควรเป็นย่อหน้า ตาราง หรือแผนภาพ | — |
| skill | `commit-log` | commit ทุกขั้นที่ทำเสร็จด้วยข้อความรูปแบบเดียวกัน ให้ git log เป็นบันทึกงาน | — |
| skill | `context-budget` | ประหยัด context เมื่อต้องอ่านไฟล์เยอะหรือรันคำสั่งที่พิมพ์ผลยาว | `references/settings.md` |
| skill | `decision-log` | จดทุกครั้งที่ agent ตัดสินใจเองในงานยาวหรืองานที่ไม่มีคนดู | — |
| skill | `document-naming` | ตั้งชื่อไฟล์เอกสาร รุ่น และสถานะ | `assets/naming-cheatsheet.md` |
| skill | `flag-and-propose` | เจอเรื่องกลางงานที่ต้องให้คนตัดสิน → แจ้งพร้อมทางเลือก | `references/example.md` |
| skill | `handoff` | ใบสั่งงาน · ใบส่งงาน · รับงานต่อ ให้ agent คน และ bot ส่งงานต่อกันโดยไม่ต้องเดา | `references/handoff.schema.json` · `references/team-memory.md` · `scripts/log-to-md.mjs` |
| skill | `human-writing` | เขียนภาษาคน ไทยหรืออังกฤษ อ่านง่าย ไม่เหมือนเครื่องเขียน | `THIRD-PARTY-NOTICES.md` · `references/headings-and-examples.md` · `references/strict-review.md` · `references/thai-examples.md` · `references/thai-grammar.md` · `references/thai-line-breaking.md` · `scripts/__pycache__/thai_tells.cpython-313.pyc` · `scripts/thai_linebreak.py` · `scripts/thai_tells.py` |
| skill | `no-ai-look` | ตรวจงานที่คนต้องมอง ไม่ให้ดูเหมือน AI ทำ (มีสคริปต์สแกน) | `references/catalog.md` · `scripts/slop_scan.py` |
| skill | `owner-style-capture` | จดวิธีทำงานที่เจ้าของชอบ ให้ agent ทำตามโดยไม่ต้องบอกซ้ำ | — |
| skill | `parallel-attempts-pick-best` | ลองหลายแบบพร้อมกันแล้วเลือกแบบที่ดีที่สุด (ดีไซน์ · interface · mockup) | — |
| skill | `parallel-split-and-merge` | แบ่งงานที่ไม่ทับกันให้หลาย agent ทำพร้อมกันแล้วรวม | — |
| skill | `polished-document-style` | จัดรูปแบบเอกสาร Markdown ให้ผู้บริหารหรือลูกค้าอ่าน (BRD · FSD · ADR) | `references/markdown-patterns.md` · `references/theme-colors.md` · `scripts/check_outline.py` |
| skill | `polite-message-th-en` | เขียนข้อความที่พูดยาก (ขอให้ช่วย · ปฏิเสธ · ทวงเงิน) ไทยหรืออังกฤษ | `references/templates.md` |
| skill | `principle-build-a-tool-not-handwork` | งานซ้ำ ๆ ให้เขียนสคริปต์ ไม่ทำมือทีละไฟล์ | — |
| skill | `principle-fix-root-cause` | แก้ที่ต้นเหตุ: ทำให้เกิดซ้ำก่อน แล้วค่อยแก้ | — |
| skill | `principle-proceed-on-reversible-work` | งานที่ย้อนได้ทำต่อเลยไม่ต้องถาม งานที่ย้อนไม่ได้รออนุมัติ | — |
| skill | `principle-prove-it-works` | ก่อนบอกว่าเสร็จ ต้องตรวจกับของจริง | — |
| skill | `principle-small-verifiable-steps` | งานหลายขั้นแบ่งเป็นขั้นเล็กที่ตรวจได้ทีละขั้น | — |
| skill | `principle-user-experience-first` | เลือกทางที่คนใช้สะดวก มากกว่าทางที่สร้างง่าย | — |
| skill | `prior-art-review` | ก่อนสร้าง ดูว่ามีของที่ใช้ได้อยู่แล้วไหม แล้วตัดสินว่าใช้หรือสร้างเอง | — |
| skill | `repeated-mistakes-to-checks` | ผิดซ้ำ 2 ครั้ง → เปลี่ยนเป็นตัวตรวจอัตโนมัติ | — |
| skill | `research-with-sources` | หาข้อมูลที่ยืนยันได้ พร้อมแหล่ง วันที่ และป้ายหลักฐาน | — |
| skill | `session-lessons-to-skills` | รวมบทเรียนจากงานที่ทำ แล้วแก้ skill ที่พาผิด | — |
| skill | `simplify` | ทำทุกงานให้อยู่ในรูปที่ง่ายที่สุดที่คนทำตามได้ | — |
| skill | `skill-authoring` | เขียน skill · agent · playbook ของ marketplace นี้ พร้อม eval 3 เคสแบบ claude plugin eval | `references/eval-format.md` |
| skill | `spell-out-abbreviations` | เขียนคำย่อเต็มครั้งแรก และทำอภิธานศัพท์ | — |
| skill | `status-report` | ตารางสถานะเมื่องานจบ: ทำอะไร ผลเป็นอย่างไร ค้างอะไร | `assets/build-plan-status.md` · `references/build-plan-rules.md` · `references/project-plan-and-weekly-status.md` |
| skill | `targeted-fix` | มีคนบอกว่าผิด → แก้ให้เล็กที่สุดตรงจุด | — |
| skill | `temp-file-discipline` | ไฟล์ชั่วคราวทั้งหมดไปอยู่ใน _to_delete/ ไม่ปนกับงานจริง | — |
| skill | `translate-th-en` | แปลไทย-อังกฤษทั้ง 2 ทาง (เอกสาร · ข้อความหน้าจอ · แชต) ด้วย glossary ต่อโปรเจกต์และไฟล์คู่แก้พร้อมกัน | — |
| agent | `brainstormer` | คิดทางเลือกเมื่องานคลุมเครือ | `agents/brainstormer.md` |
| agent | `learning-reviewer` | ทบทวนวิธีทำงานและเสนอแก้ | `agents/learning-reviewer.md` |
| agent | `reviewer` | ตรวจงานด้วยสายตาใหม่ | `agents/reviewer.md` |
| hook | `hooks/` | hook ของ SuperUser: ส่งกฎประจำตัวตอนเริ่ม · บอก skill ที่ต้องเปิด · เขียน log การทำงาน · เตือนเมื่อมีข้อความใน inbox | `hooks.json` · `superuser-hook.mjs` · `core-rules.md` · `skill-router.json` |

**ไฟล์ข้างใน `skills/superuser/`** (นอกจาก playbook ของแต่ละ plugin)

| ไฟล์ | ใช้ทำอะไร | มีใน |
|---|---|---|
| `SKILL.md` | หัวหน้าทีม: รับงาน วัดขนาด เลือก playbook แจกงาน ตรวจ รายงาน | ทุก plugin |
| `references/agents.md` | รายชื่อ agent ของ plugin และงานที่แต่ละตัวรับ | `software-company` |
| `references/approvals.md` | งานแบบไหนต้องรอคนอนุมัติก่อนทำ | `software-company` |
| `references/autonomy.md` | ถามครั้งเดียว ตัดสินใจเอง โหวต รู้ความเสี่ยง รู้จังหวะหยุด และรายการรออนุมัติทุกสาขา | `superuser` |
| `references/brief-template.md` | แบบฟอร์มใบสั่งงานที่ส่งให้ลูกทีม | ทุก plugin |
| `references/code-extensions.md` | ส่วนที่ใช้เฉพาะงานโค้ดของ skill กลางใน plugin superuser | `software-company` |
| `references/context-template.md` | แบบไฟล์ CONTEXT.md สำหรับส่งงานต่อ | `e-commerce` · `graphic-design` · `personal-life` · `reverse-engineer` · `thai-workplace` · `trading-finance` |
| `references/evidence.md` | หลักฐานแบบไหนนับว่า "เสร็จจริง" | ทุก plugin |
| `references/examples.md` | ตัวอย่างงานจริงตั้งแต่รับจนส่ง | `e-commerce` · `graphic-design` · `personal-life` · `software-company` · `superuser` · `thai-workplace` · `trading-finance` |
| `references/lead-playbook.md` | บทเรียนของหัวหน้าทีมเอง: คาดกับจริงต่างกันตรงไหน จัดขนาดและแจกงานอย่างไร | ทุก plugin |
| `references/learning-loop.md` | วิธีเก็บบทเรียนระหว่างงาน แล้วเสนอแก้ skill | ทุก plugin |
| `references/modules.md` | โมดูลที่เปิดปิดได้: ไฟล์กลาง log token รอบเรียนรู้ inbox config และด่านของ hook | `superuser` |
| `references/playbook-template.md` | แบบสำหรับเขียน playbook ใหม่ | ทุก plugin |
| `references/principles.md` | หลักการทำงานที่ทุก playbook ใช้ | `software-company` |
| `references/team-files.md` | ไฟล์ของทีมในโปรเจกต์: CONTEXT · log · inbox · IMPROVEMENTS | ทุก plugin |
| `references/team-roles.md` | บทบาทในทีม วิธีแบ่งงาน และรอบตรวจซ้ำจนไม่เหลือข้อสูงและกลาง | ทุก plugin |
| `references/triggers.md` | คำพูดแบบไหนเปิด playbook ไหน | `e-commerce` · `graphic-design` · `personal-life` · `software-company` · `superuser` · `thai-workplace` · `trading-finance` |
| `references/voting.md` | ขั้นตอนเต็มของการตัดสินด้วยการค้นและโหวต 3 มุม | ทุก plugin |
| `templates/CONTEXT.md` | แบบไฟล์ CONTEXT.md กลางของโปรเจกต์ | `superuser` |
| `templates/HISTORY.md` | แบบไฟล์ประวัติงาน | `superuser` |
| `templates/IMPROVEMENTS.md` | แบบไฟล์จดข้อเสนอแก้ skill ของโปรเจกต์ | `superuser` |
| `templates/TEAM.md` | โปรไฟล์ลูกทีม: ใครถนัดอะไร พลาดบ่อยเรื่องไหน ใช้ระดับไหนพอ | ทุก plugin |
| `templates/config.json` | ค่าเปิดปิดโมดูลและงบของโฟลเดอร์งาน | ทุก plugin |
| `templates/improvements-queue.md` | แบบคิวข้อเสนอแก้ skill รวมทั้งเครื่อง | ทุก plugin |

## e-commerce

ซื้อ-ขายออนไลน์ทั้งสองฝั่ง ขายบน Shopee Lazada TikTok และซื้ออย่างรู้สิทธิ์ · ภาพประกอบ: [docs/plugins/e-commerce](plugins/e-commerce/README.md) · ต้นฉบับ: `plugins/e-commerce/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร)

### agent (4)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/consumer-advocate.md` | ร่างคำขอและจดหมายร้องเรียน |
| `agents/customer-chat.md` | ตอบลูกค้าสุภาพในชื่อร้าน |
| `agents/live-seller.md` | วางแผนไลฟ์ขายรายนาที |
| `agents/shop-manager.md` | คิดราคา ลงสินค้า คุมสต็อก |

### skill (12 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `buy-compare` | เทียบก่อนซื้อของชิ้นใหญ่: ราคารวมจริง · รีวิวที่เชื่อได้ | — |
| `chat-reply-templates` | แบบคำตอบแชตลูกค้า: ราคา · ของหมด · ไซซ์ · พัสดุช้า | `references/templates.md` |
| `complaint-letter-th` | เขียนจดหมายร้องเรียนร้านค้า แพลตฟอร์ม หรือ สคบ. | `references/templates.md` |
| `live-selling-script` | เตรียมไลฟ์ขายของบน TikTok · Shopee · Lazada · Facebook | `references/host-lines.md` |
| `marketplace-fees-pricing` | ตั้งราคาหลังหักค่าธรรมเนียมแต่ละแพลตฟอร์ม และหาว่าสินค้าไหนขาดทุน | `references/fee-structures.md` |
| `multi-shop-stock` | คุมสต็อกที่ขายหลายร้านไม่ให้ขายเกิน: ชีตสต็อกหลัก · รหัส SKU | — |
| `product-listing` | เขียนหรือแก้หน้าสินค้าบน Shopee · Lazada · TikTok Shop · LINE | `references/description-template.md` · `references/prohibited-claims.md` |
| `refund-request` | ขอเงินคืน: ของเสีย ของปลอม ไม่ได้ของ ยกเลิกขายตรง รายการแปลก | `references/cancellation-notice.md` |
| `returns-and-bad-reviews` | รับมือคืนสินค้า ขอเงินคืน ข้อพิพาท และรีวิว 1-3 ดาว | `references/review-replies.md` |
| `shipping-compare` | เทียบขนส่ง (Flash · Kerry · J&T · ไปรษณีย์ไทย · SPX) ตามราคา COD และน้ำหนัก | — |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/brief-template.md` · `references/context-template.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-buy-decision.md` · `references/playbook-complaint.md` · `references/playbook-customer-issue.md` · `references/playbook-learn-from-session.md` · `references/playbook-live-session.md` · `references/playbook-new-product.md` · `references/playbook-pricing-check.md` · `references/playbook-refund.md` · `references/playbook-review.md` · `references/playbook-stock-sync.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-unattended-run.md` · `references/playbook-warranty-claim.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |
| `warranty-tracker` | เก็บใบเสร็จและบัตรรับประกัน เช็กสิทธิ์ เตรียมเคลม | — |

### คำสั่ง (6) — พิมพ์ `/e-commerce:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `compare` | เทียบสินค้าหรือบริการก่อนซื้อด้วยตารางตัดสินใจ | — |
| `complain` | ร่างเรื่องร้องเรียนและแผนยกระดับจนถึง สคบ. 1166 | — |
| `listing` | เขียนหน้าสินค้า (ชื่อ · คีย์เวิร์ด · คำที่ห้ามใช้) | — |
| `live-script` | ทำบทไลฟ์ขายของ (hook · ลำดับสินค้า · จังหวะ flash deal) | — |
| `price-check` | คิดราคาขาย หรือกำไรของราคาปัจจุบัน หลังหักทุกค่าใช้จ่าย | — |
| `reply` | ร่างคำตอบลูกค้าหรือรีวิวเป็นภาษาไทย | — |

### playbook (13) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-buy-decision.md` | ตัดสินใจซื้อของ | 6 |
| `playbook-complaint.md` | ร้องเรียนร้านค้า | 6 |
| `playbook-customer-issue.md` | แก้ปัญหาลูกค้าและรีวิว | 5 |
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ทำ | 7 |
| `playbook-live-session.md` | วางแผนไลฟ์ขาย | 4 |
| `playbook-new-product.md` | ลงสินค้าใหม่ | 6 |
| `playbook-pricing-check.md` | ตรวจราคาและกำไร | 5 |
| `playbook-refund.md` | ขอคืนเงิน | 5 |
| `playbook-review.md` | ตรวจงานที่เสร็จแล้ว | 6 |
| `playbook-stock-sync.md` | ซิงก์สต็อกหลายร้าน | 5 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-unattended-run.md` | งานยาวไม่ต้องเฝ้า | 7 |
| `playbook-warranty-claim.md` | เคลมและติดตามประกัน | 5 |

## graphic-design

ทำโลโก้ แบรนด์ โพสต์ และคลิปให้หน้าตาเป็นชุดเดียวกัน · ภาพประกอบ: [docs/plugins/graphic-design](plugins/graphic-design/README.md) · ต้นฉบับ: `plugins/graphic-design/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร) · `evals/speaking-script-behaviour/case.yaml` (เคส eval: บทพูดต้องเปิดด้วย hook เป็นภาษาพูด และปิดด้วย CTA) · `evals/speaking-script-regression/case.yaml` (เคส eval: กันอาการเดิมกลับมา เช่น สคริปต์พูดออกมาเป็นบทความ) · `evals/speaking-script-trigger/case.yaml` (เคส eval: โจทย์สคริปต์พูดที่ต้องทำให้ speaking-script ถูกเปิด) · `evals/subtitles-th-behaviour/case.yaml` (เคส eval: แก้ซับให้ตามกฎความยาว ความเร็วอ่าน และเครื่องหมาย) · `evals/subtitles-th-regression/case.yaml` (เคส eval: กันอาการฝังซับไทยแล้วเป็นสี่เหลี่ยมโดยไม่ระบุฟอนต์ไทย) · `evals/subtitles-th-trigger/case.yaml` (เคส eval: โจทย์ทำซับไทยแล้วฝังที่ต้องทำให้ subtitles-th ถูกเปิด) · `evals/video-editing-behaviour/case.yaml` (เคส eval: ตัดให้ตรงเฟรม ปรับเสียง 2 รอบ และวัดไฟล์ที่ได้) · `evals/video-editing-regression/case.yaml` (เคส eval: กันอาการรับรองความดังจากคำสั่งรอบเดียวโดยไม่วัด) · `evals/video-editing-slides-behaviour/case.yaml` (เคส eval: ความยาวต่อแผ่นถูก แผ่นสุดท้ายไม่หาย วิดีโอยาวเท่าเสียง) · `evals/video-editing-slides-regression/case.yaml` (เคส eval: กันอาการวิดีโอยาวเกินเสียงและแผ่นสุดท้ายหาย) · `evals/video-editing-slides-trigger/case.yaml` (เคส eval: โจทย์สไลด์กับเสียงเป็นวิดีโอที่ต้องทำให้ video-editing ถูกเปิด) · `evals/video-editing-trigger/case.yaml` (เคส eval: โจทย์ตัดช่วงเงียบและปรับเสียงที่ต้องทำให้ video-editing ถูกเปิด)

### agent (5)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/art-director.md` | ล็อกสไตล์ภาพ AI ให้เหมือนกัน |
| `agents/brand-keeper.md` | ดูแลชุดแบรนด์ของร้าน |
| `agents/design-critic.md` | ชี้ 2-3 จุดที่ต้องแก้ |
| `agents/social-creator.md` | ทำโพสต์และโฆษณาโซเชียล |
| `agents/video-editor.md` | ตัดต่อ ใส่ซับ และส่งออกวิดีโอ |

### skill (15 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `asset-organize` | จัดไฟล์งานออกแบบที่รก: โฟลเดอร์ · ชื่อไฟล์ · รุ่น | `references/naming-and-tree.md` |
| `brand-kit` | ทำชุดแบรนด์: กฎโลโก้ · หน้าที่ของแต่ละสี · คู่ฟอนต์ไทย-อังกฤษ | `references/kit-template.md` · `references/thai-fonts.md` |
| `brief-to-image` | เขียน brief และ prompt ก่อนสั่ง AI สร้างภาพ | `references/prompt-anatomy.md` |
| `campaign-set` | ทำงานแคมเปญเดียวให้ครบทุกแพลตฟอร์มจากแนวคิดเดียว | `references/asset-matrix-template.md` |
| `design-review` | ตรวจงานภาพก่อนส่ง 8 ข้อ แล้วบอก 3 จุดที่ต้องแก้ก่อน | `references/review-sheet.md` |
| `image-editing-brief` | เขียนคำสั่งแก้ภาพ: ลบของ · แก้สี · เปลี่ยนพื้นหลัง · ขยายภาพ | `references/edit-brief-template.md` |
| `image-generation` | หาภาพจริงให้หน้าเว็บ mockup หรือสไลด์: สร้างภาพ วาด SVG หรือหารูปฟรี | `references/styles.md` · `references/svg-illustration.md` · `scripts/fetch_free_image.py` |
| `motion-basics` | ทำ motion graphic ตัวอักษรเคลื่อนไหว และโลโก้ขยับ สำหรับคนที่ไม่ใช่นักออกแบบ | `references/twelve-principles.md` |
| `social-formats` | ขนาด สัดส่วน และพื้นที่ปลอดภัยของ Facebook · IG · TikTok · YouTube · LINE OA · X | `references/platform-sizes.md` |
| `speaking-script` | เขียนสคริปต์พูดหน้ากล้อง: hook ก่อนทักทาย · ภาษาพูด · จับเวลาด้วยนาฬิกา | — |
| `style-consistency` | ทำภาพหลายภาพให้ดูเป็นชุดเดียวกัน | `references/style-lock-sheet.md` |
| `subtitles-th` | ซับไทยเป็นไฟล์: ถอดเสียงเป็น .srt · ตรวจความยาวบรรทัดและเวลา · ฝังซับด้วยฟอนต์ไทย | `scripts/srt_check.py` |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/brief-template.md` · `references/context-template.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-asset-cleanup.md` · `references/playbook-brand-setup.md` · `references/playbook-campaign.md` · `references/playbook-image-series.md` · `references/playbook-learn-from-session.md` · `references/playbook-review.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-unattended-run.md` · `references/playbook-video.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |
| `video-editing` | ตัด ต่อ ตัดช่วงเงียบ ปรับความดัง ส่งออก และต่อสไลด์กับเสียงเป็นวิดีโอด้วย ffmpeg พร้อมวัดผล | `scripts/loudnorm2.py` · `scripts/silences.py` · `scripts/slides_to_video.py` |
| `video-script-to-clip` | ทำคลิปสั้น Reel TikTok: hook · รายการช็อต · ซับไทย | `references/production-tools.md` · `references/shot-list-template.md` |

### คำสั่ง (6) — พิมพ์ `/graphic-design:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `brand-init` | สร้างหรือทำชุดแบรนด์ใหม่ (โลโก้ · สี · ฟอนต์ · ภาพ · น้ำเสียง · 5 แม่แบบ) | — |
| `brief` | เขียน brief สร้างภาพ (ตัวแบบ · สไตล์ · สี · แสง · องค์ประกอบ · สิ่งที่ห้าม) | — |
| `campaign` | วางแผนและผลิตชุดงานแคมเปญจากแนวคิดเดียว | — |
| `resize-all` | แตกงานต้นแบบเป็นทุกขนาดของทุกแพลตฟอร์ม | — |
| `review-design` | ตรวจภาพหรืองานออกแบบก่อนส่ง แล้วบอก 2-3 จุดที่สำคัญที่สุด | — |
| `video` | เปลี่ยนข้อความเป็นคลิปสั้น (hook · บทถ่าย · ตัวหนังสือบนจอ · brief) | — |

### playbook (9) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-asset-cleanup.md` | จัดระเบียบไฟล์งาน | 5 |
| `playbook-brand-setup.md` | ตั้งชุดแบรนด์ใหม่ | 5 |
| `playbook-campaign.md` | ทำแคมเปญหลายขนาด | 7 |
| `playbook-image-series.md` | ทำภาพ AI เป็นชุด | 6 |
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ทำ | 7 |
| `playbook-review.md` | ตรวจงานที่เสร็จแล้ว | 6 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-unattended-run.md` | งานยาวไม่ต้องเฝ้า | 7 |
| `playbook-video.md` | ทำคลิปสั้นจากสคริปต์ | 5 |

## personal-life

จัดการงานธุระ เอกสาร ประชุม เป้าหมาย บ้าน สุขภาพ อาชีพ และการเรียนรู้ · ภาพประกอบ: [docs/plugins/personal-life](plugins/personal-life/README.md) · ต้นฉบับ: `plugins/personal-life/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร)

### agent (9)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/career-coach.md` | เขียน CV และบทพูดกับ HR |
| `agents/doc-caretaker.md` | ดูแลเอกสารสำคัญ |
| `agents/family-planner.md` | จัดตารางครอบครัวและเมนู |
| `agents/health-organizer.md` | จัดเอกสารและตารางสุขภาพ |
| `agents/home-manager.md` | ดูแลบิลและการซ่อมบ้าน |
| `agents/interview-coach.md` | ซ้อมสัมภาษณ์และให้คะแนน |
| `agents/life-admin.md` | งานธุระประจำของชีวิต |
| `agents/meeting-prep.md` | เตรียมและสรุปประชุม |
| `agents/tech-mentor.md` | วางแผนเรียนและทำตัวอย่างโค้ด |

### skill (39 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `annual-checkup` | วางแผนตรวจสุขภาพประจำปี เช็กสิทธิ์ประกันสังคมหรือบัตรทอง เทียบแพ็กเกจ | `references/results-tracker.md` |
| `calendar-audit` | ตรวจปฏิทินรายเดือน แล้วจองช่วงเวลาไว้ทำงานสำคัญ | — |
| `cert-prep` | เตรียมสอบใบรับรอง (AWS · Azure · GCP · CKA · PSM) แผนรายสัปดาห์และข้อสอบลอง | `references/exam-facts.md` · `references/plan-template.md` |
| `course-builder` | ออกแบบหลักสูตรฝั่งผู้สอน: ผลลัพธ์การเรียนรู้ · ตารางสอนพร้อมเวลา · แบบฝึก · rubric · แบบประเมิน | — |
| `decision-journal` | บันทึกการตัดสินใจใหญ่ (งาน · คอนโด · รถ · ย้ายบ้าน) แล้วกลับมาทบทวน | `references/entry-template.md` |
| `digital-hygiene` | ล็อกบัญชีครอบครัวให้ปลอดภัย: ตัวจัดการรหัสผ่าน · 2FA · passkey · สำรองข้อมูล | `references/line-and-phone.md` · `references/scams-and-takeover.md` |
| `doctor-visit-prep` | เตรียมพบแพทย์: ลำดับอาการ · ยาที่ใช้ · ยาที่แพ้ · คำถาม (ไม่วินิจฉัย) | — |
| `elder-care` | ดูแลพ่อแม่สูงอายุ: นัดแพทย์ · เบี้ยผู้สูงอายุ · กันล้ม · ส่งต่อคนดูแล | `references/care-templates.md` |
| `english-tech-reading` | อธิบายข้อความ error · RFC · เอกสารภาษาอังกฤษเป็นภาษาไทย | `references/decode-template.md` |
| `exercise-plan` | เริ่มหรือจัดการออกกำลังกาย: เดิน · เวท · ยืดเส้นระหว่างทำงาน | — |
| `gift-idea-tracker` | จดของขวัญที่เคยให้ และคิดของขวัญตามงบ | `references/gift-registry-template.md` |
| `goal-and-habit` | ตั้งเป้ารายไตรมาสหรือปีใหม่ เริ่มหรือเลิกนิสัย | — |
| `home-maintenance` | ตารางดูแลบ้านตามฤดู (แอร์ · ปั๊ม · ปลวก · หลังคา) และเทียบใบเสนอราคาช่าง | `references/maintenance-calendar.md` |
| `household-bills` | อ่านบิลไฟ น้ำ (กฟน. · กฟภ. · กปน. · กปภ. · ค่า Ft) จดบิล เช็กบิลที่พุ่ง | `references/bill-tracker-template.md` |
| `important-docs` | ทะเบียนเอกสารสำคัญ (บัตร · พาสปอร์ต · โฉนด · เล่มรถ · ประกัน) และวันหมดอายุ | `references/registry-template.md` |
| `inbox-triage` | คัดอีเมลที่ล้น ว่าฉบับไหนต้องตอบวันนี้ | — |
| `interview-prep` | เตรียมสัมภาษณ์งาน: เรื่องแบบ STAR · คำถามที่ HR ไทยถามบ่อย · อีเมลขอบคุณ | `references/question-bank.md` |
| `kids-school` | จัดปีการศึกษาของลูก: วันเปิดเทอม · ค่าเทอม · เรียนพิเศษ · ย้ายโรงเรียน · ลดหย่อน | `references/school-year-planner.md` |
| `learning-path` | วางเส้นทางเรียนภาษา framework หรือแนวคิดใหม่ ให้จบเป็นโปรเจกต์จริง | `references/path-template.md` |
| `linkedin-profile` | เขียนหรือปรับ LinkedIn ให้เหมาะกับตลาดงานไทย | — |
| `meal-plan-grocery` | วางเมนูรายสัปดาห์ตามงบ รายการซื้อของ ลดของเหลือทิ้ง | `references/weekly-plan-template.md` |
| `medication-schedule` | ตารางกินยาจากฉลากยา เตือนเติมยา รายการยาที่แพ้ (ไม่กำหนดขนาดยา) | — |
| `meeting-prep-card` | การ์ด 1 ใบก่อนประชุม: เป้าหมาย · 3 คำถาม · สิ่งที่จะขอ | — |
| `meeting-summary` | สรุปประชุม: สิ่งที่ตัดสินแล้ว · งานที่ต้องทำ · รายงานการประชุมภาษาไทย | `references/thai-minutes-template.md` |
| `paper-to-practice` | อ่าน paper · RFC · บทความยาว แล้วทำตัวอย่างที่รันได้ | `references/practice-note-template.md` |
| `performance-self-review` | เขียนประเมินตัวเองกลางปีหรือปลายปี และเหตุผลขอขึ้นตำแหน่ง | `references/templates.md` |
| `personal-kb` | คลังโน้ตส่วนตัว หาโน้ตที่เคยจดให้เจอ | — |
| `pet-care` | ดูแลสุนัขแมว: วัคซีนพิษสุนัขบ้า · ขึ้นทะเบียน · ไมโครชิป · ประวัติรักษา | `references/pet-record.md` |
| `resume-th-en` | เขียนหรือตรวจ CV ไทยและอังกฤษ ให้ระบบคัดกรอง (ATS) อ่านได้ | `references/templates.md` |
| `salary-negotiation` | ต่อรองเงินเดือนและเทียบข้อเสนองาน (โบนัส · กองทุน · ประกัน) | — |
| `side-project-picker` | เลือกโปรเจกต์ฝึกมือหรือ portfolio ให้คะแนน แล้วตัดขอบเขตให้จบได้ | `references/idea-bank.md` |
| `sleep-log` | บันทึกการนอนเพื่อดูรูปแบบหรือเอาไปให้แพทย์ดู (ไม่วินิจฉัย) | — |
| `subscription-audit` | หารายการตัดเงินรายเดือนจาก statement แล้วตัดที่ไม่คุ้ม | `references/cancel-steps.md` · `references/statement-patterns.md` |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/brief-template.md` · `references/context-template.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-bills.md` · `references/playbook-care-setup.md` · `references/playbook-cert-prep.md` · `references/playbook-checkup-cycle.md` · `references/playbook-decide-and-goals.md` · `references/playbook-digital-safety.md` · `references/playbook-doctor-visit.md` · `references/playbook-documents.md` · `references/playbook-family-week.md` · `references/playbook-habit-tracking.md` · `references/playbook-interview.md` · `references/playbook-job-application.md` · `references/playbook-learn-from-session.md` · `references/playbook-learning-path.md` · `references/playbook-maintenance.md` · `references/playbook-medication-routine.md` · `references/playbook-meeting.md` · `references/playbook-offer-negotiation.md` · `references/playbook-paper-to-practice.md` · `references/playbook-profile-refresh.md` · `references/playbook-promotion-case.md` · `references/playbook-review.md` · `references/playbook-side-project.md` · `references/playbook-subscriptions.md` · `references/playbook-team-project.md` · `references/playbook-tech-radar.md` · `references/playbook-template.md` · `references/playbook-trip.md` · `references/playbook-unattended-run.md` · `references/playbook-vehicle.md` · `references/playbook-weekly-reset.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |
| `tech-radar` | ติดตามการเปลี่ยนแปลงของเครื่องมือรายสัปดาห์จาก release notes ทางการ | `references/radar-templates.md` |
| `thesis-writing` | เขียนวิทยานิพนธ์ · IS · บทความวิจัย ตั้งแต่โครงร่างจนสอบป้องกัน | `references/citation-and-integrity.md` · `references/defense-and-review.md` · `references/literature-matrix.md` · `references/thai-academic-language.md` · `references/thai-typesetting.md` · `references/thesis-structure.md` |
| `travel-prep` | เตรียมเดินทาง 1-2 สัปดาห์ก่อนไป: วีซ่า · ประกัน · เงิน · กำหนดการ | `references/checklist-template.md` · `references/travel-facts.md` |
| `vehicle-care` | ดูแลรถยนต์และมอเตอร์ไซค์: พ.ร.บ. · ภาษีประจำปี · ตรวจสภาพ · เข้าศูนย์ | `references/vehicle-record.md` |
| `weekly-review` | ทบทวนประจำสัปดาห์ สำหรับคนที่ยุ่งแต่งานไม่เดิน | — |

### คำสั่ง (16) — พิมพ์ `/personal-life:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `bills` | อ่านบิลไฟหรือบิลน้ำ จดไว้ แล้วเทียบกับ 3 เดือนก่อน | — |
| `checkup` | วางแผนตรวจสุขภาพตามอายุและเพศ เช็กสิทธิ์ และจดผล | — |
| `decide` | บันทึกการตัดสินใจใหญ่ลงสมุดตัดสินใจ | — |
| `doctor-prep` | เตรียมก่อนพบแพทย์ หรือสรุปหลังพบแพทย์ | — |
| `family-week` | วางแผนสัปดาห์ของครอบครัวในตารางเดียว | — |
| `interview` | เตรียมสัมภาษณ์ 1 รอบ (คลังเรื่อง · คำถาม · ซ้อม · อีเมลขอบคุณ) | — |
| `learn` | เรียนเทคโนโลยีใหม่ผ่านด่านที่ผูกกับโปรเจกต์จริง หรือแปลง paper เป็นโค้ด | — |
| `maintenance` | ทำตารางดูแลบ้าน 12 เดือน หรือเทียบใบเสนอราคาช่าง | — |
| `meeting` | เตรียมการ์ดก่อนประชุม หรือสรุปหลังประชุม | — |
| `negotiate` | เทียบข้อเสนองานจากเงินรวมทั้งหมด แล้วร่างคำพูดต่อรอง | — |
| `radar` | ไล่ดูว่าไลบรารีที่ติดตามเปลี่ยนอะไรในสัปดาห์นี้ | — |
| `resume` | เขียน CV ไทย อังกฤษ หรือทั้งคู่ ให้ตรงประกาศงาน | — |
| `subscriptions` | ตรวจค่าสมาชิก คิดต้นทุนต่อครั้ง ยกเลิก ลดแพ็กเกจ หรือเก็บไว้ | — |
| `travel` | ทำ checklist เดินทางและกำหนดการในไฟล์เดียว | — |
| `triage-mail` | แยกอีเมลเป็น วันนี้ · สัปดาห์นี้ · ส่งต่อ · เก็บ | — |
| `week-review` | ทบทวนสัปดาห์ 20 นาที (เสร็จ · หลุด · ค้างใคร · 3 เรื่องหลัก) | — |

### playbook (30) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-bills.md` | ไล่ดูบิลค่าน้ำค่าไฟ | 5 |
| `playbook-care-setup.md` | ตั้งระบบดูแลผู้สูงอายุ | 4 |
| `playbook-cert-prep.md` | เตรียมสอบใบรับรอง | 5 |
| `playbook-checkup-cycle.md` | วางแผนตรวจสุขภาพปีนี้ | 5 |
| `playbook-decide-and-goals.md` | ตัดสินใจและตั้งเป้า | 4 |
| `playbook-digital-safety.md` | ความปลอดภัยออนไลน์ | 5 |
| `playbook-doctor-visit.md` | เตรียมตัวไปหาหมอ | 5 |
| `playbook-documents.md` | จัดเอกสารสำคัญ | 4 |
| `playbook-family-week.md` | วางสัปดาห์ของครอบครัว | 4 |
| `playbook-habit-tracking.md` | ติดตามนอนและออกกำลัง | 4 |
| `playbook-interview.md` | เตรียมสัมภาษณ์ | 6 |
| `playbook-job-application.md` | สมัครงาน | 8 |
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ผ่านมา | 7 |
| `playbook-learning-path.md` | วางเส้นทางเรียน | 5 |
| `playbook-maintenance.md` | วางแผนซ่อมบำรุงบ้าน | 5 |
| `playbook-medication-routine.md` | จัดตารางกินยา | 6 |
| `playbook-meeting.md` | เตรียมและสรุปประชุม | 4 |
| `playbook-offer-negotiation.md` | ต่อรองข้อเสนองาน | 6 |
| `playbook-paper-to-practice.md` | จากบทความสู่โค้ดจริง | 5 |
| `playbook-profile-refresh.md` | ปรับ CV และโปรไฟล์ | 5 |
| `playbook-promotion-case.md` | เตรียมขอขึ้นตำแหน่ง | 5 |
| `playbook-review.md` | ตรวจงานก่อนส่ง | 6 |
| `playbook-side-project.md` | เลือกโปรเจกต์ฝึกมือ | 4 |
| `playbook-subscriptions.md` | ตรวจค่าสมาชิกรายเดือน | 5 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-tech-radar.md` | ตามข่าวเทคโนโลยี | 5 |
| `playbook-trip.md` | เตรียมเที่ยว | 4 |
| `playbook-unattended-run.md` | ให้ทำงานยาวเอง | 7 |
| `playbook-vehicle.md` | ต่อภาษีและประกันรถ | 4 |
| `playbook-weekly-reset.md` | รีเซ็ตประจำสัปดาห์ | 5 |

## reverse-engineer

reverse engineer แอป ไบนารี เว็บ และ APK จากหลักฐาน แล้วสร้างใหม่ · ภาพประกอบ: [docs/plugins/reverse-engineer](plugins/reverse-engineer/README.md) · ต้นฉบับ: `plugins/reverse-engineer/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร)

### agent (1)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/reverse-engineer-analyst.md` | ตรวจแอปหรือไบนารีที่ไม่มี source อธิบายพร้อมหลักฐาน แล้วสร้างใหม่ |

### skill (7 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `analyze-apk` | ตรวจ APK ของ Android: manifest ทรัพยากร คลาสที่ถอดรหัส และการเรียกเมธอด | — |
| `analyze-dotnet` | ตรวจ assembly .NET (.dll/.exe): metadata คำสั่ง CIL dependency และเทียบ build | — |
| `analyze-js-electron` | ตรวจแอป JavaScript หรือ Electron ที่แตกออกมา: โมดูล import ขอบเขต IPC และ source map | — |
| `analyze-native-binary` | ตรวจไบนารี native (.exe .dll ELF Mach-O): string symbol pseudocode และฟังก์ชันที่ import | — |
| `analyze-website` | ตรวจว่าฟีเจอร์ของเว็บทำงานอย่างไรจากโครงหน้า สคริปต์ และ network call โดยไม่มี backend | — |
| `reverse-engineer` | จุดเข้าหลักของการ reverse engineer: อธิบายว่าฟีเจอร์ทำงานอย่างไรพร้อมหลักฐาน แล้วสร้างใหม่ | `templates/api-inventory.md` · `templates/change-proof.md` · `templates/codebase-map.md` · `templates/system-map.md` |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/brief-template.md` · `references/context-template.md` · `references/evidence.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-learn-from-session.md` · `references/playbook-review.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-unattended-run.md` · `references/team-files.md` · `references/team-roles.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |

### คำสั่ง (1) — พิมพ์ `/reverse-engineer:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `re` | คำสั่งลัด reverse engineer ฟีเจอร์จากแอป ไบนารี assembly เว็บ หรือ APK: หลักฐานก่อน แล้วสร้างใหม่ | — |

### playbook (4) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ทำ | 7 |
| `playbook-review.md` | ตรวจงานก่อนส่ง | 6 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-unattended-run.md` | ปล่อยงานยาวให้ทำเอง | 7 |

## software-company

ทีมซอฟต์แวร์ครบชุด ตั้งแต่โจทย์จนส่งมอบ · ภาพประกอบ: [docs/plugins/software-company](plugins/software-company/README.md) · ต้นฉบับ: `plugins/software-company/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร)

### agent (39)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/ai-engineer.md` | สร้างระบบ AI และ LLM |
| `agents/blockchain-engineer.md` | สร้างงานบนบล็อกเชน |
| `agents/business-analyst.md` | เก็บความต้องการและเขียน BRD |
| `agents/clinical-data-analyst.md` | วิเคราะห์ข้อมูลทางการแพทย์ |
| `agents/data-engineer.md` | สร้างท่อข้อมูลและคลังข้อมูล |
| `agents/developer.md` | เขียนโค้ด แก้บั๊ก ทำ test |
| `agents/devops-engineer.md` | ตั้ง CI/CD และระบบรัน |
| `agents/devrel-engineer.md` | ดูแลประสบการณ์นักพัฒนา |
| `agents/ecommerce-engineer.md` | สร้างร้านค้าออนไลน์ |
| `agents/fintech-compliance-officer.md` | ดูกฎการเงินและเตรียมตรวจ |
| `agents/fintech-engineer.md` | สร้างระบบจ่ายเงิน |
| `agents/game-designer.md` | ออกแบบกติกาและความสนุกเกม |
| `agents/game-developer.md` | เขียนโค้ดเกม |
| `agents/graphic-designer.md` | ทำงานภาพที่ไม่ใช่หน้าจอ |
| `agents/growth-specialist.md` | เพิ่มยอดสมัครและยอดซื้อ |
| `agents/healthcare-engineer.md` | สร้างระบบโรงพยาบาล |
| `agents/hipaa-officer.md` | ดูกฎ HIPAA |
| `agents/image-artist.md` | หา หรือสร้างภาพจริงให้หน้าเว็บ แอป และสไลด์ |
| `agents/insurance-analyst.md` | คำนวณเบี้ยและความเสี่ยงประกัน |
| `agents/insurance-compliance-officer.md` | ดูกฎกำกับธุรกิจประกัน |
| `agents/insurance-engineer.md` | สร้างระบบประกัน |
| `agents/iot-engineer.md` | สร้างงานอุปกรณ์เชื่อมต่อ |
| `agents/legal-compliance-officer.md` | ดูกฎหมายข้อมูลและ PDPA |
| `agents/legaltech-engineer.md` | สร้างระบบเอกสารกฎหมาย |
| `agents/mobile-engineer.md` | สร้างแอปมือถือ |
| `agents/product-manager.md` | ตัดสินว่าจะสร้างอะไรและทำไม |
| `agents/project-manager.md` | วางแผน ติดตามงาน ดูความเสี่ยง |
| `agents/qa-tester.md` | ทำแผนทดสอบและหาบั๊ก |
| `agents/quant-analyst.md` | คำนวณความเสี่ยงและราคาการเงิน |
| `agents/recommendation-engineer.md` | สร้างระบบแนะนำสินค้า |
| `agents/reverse-engineer.md` | ถอดงานที่ไม่มีซอร์สโค้ด |
| `agents/revops-analyst.md` | ออกแบบการเก็บเงินแบบสมาชิก |
| `agents/security-analyst.md` | เฝ้าระวังและรับมือเหตุความปลอดภัย |
| `agents/security-engineer.md` | ตรวจช่องโหว่และความปลอดภัยโค้ด |
| `agents/seo-specialist.md` | ทำให้เว็บขึ้นอันดับค้นหา |
| `agents/solution-architect.md` | ออกแบบโครงสร้างระบบ |
| `agents/system-analyst.md` | เขียน FSD และสเปก API |
| `agents/technical-writer.md` | เขียนคู่มือและเอกสาร |
| `agents/ux-designer.md` | ออกแบบหน้าจอและ mockup |

### skill (95 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

**หลักการทำงาน**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `principle-data-shape-first` | ตกลงรูปข้อมูลก่อนเขียน logic ที่ข้ามหลายฟังก์ชัน | — |
| `principle-replace-then-delete` | เปลี่ยนของเก่า: ย้ายคนเรียกไปของใหม่ก่อน แล้วค่อยลบของเก่า | — |
| `principle-safe-to-rerun` | งานที่อาจรันซ้ำหรือหยุดกลางทาง ต้องรันซ้ำแล้วผลไม่เพี้ยน | — |
| `principle-secure-by-default` | ปลอดภัยไว้ก่อน: input · ฐานข้อมูล · ไฟล์ · ล็อกอิน · เงิน | `references/mobile.md` |
| `simplicity-first` | เอกสาร ดีไซน์ แผน ให้ง่ายที่สุดที่ใช้ได้ | — |
| `lazy-coding` | เขียนโค้ดแบบที่ง่ายที่สุดที่ใช้ได้ ไม่เผื่อเกินจำเป็น | — |

**การทำงานของทีม**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `docker-sandbox` | รันโปรเจกต์ใน Docker container ของตัวเอง ไม่แตะเครื่องหลัก | `assets/Dockerfile` · `assets/allowlist.txt` · `assets/base.Dockerfile` · `assets/compose.browser.yaml` · `assets/compose.isolated.yaml` · `assets/compose.locked.yaml` · `assets/compose.yaml` · `assets/init-firewall.sh` · `assets/sandbox.ps1` |
| `worktree-and-branch` | แยกที่ทำงานให้ agent ด้วย git worktree แล้วปิด branch ให้จบ (merge · PR · ทิ้ง) พร้อมหลักฐาน | — |

**เรียนรู้และปรับปรุงทีม**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `coding-evals` | วัดว่าทีมเขียนโค้ดดีขึ้นจริงไหม หลังแก้ skill หรือ playbook | — |
| `reference-app-research` | "อยากได้แอปแบบ X" → ค้นแอปนั้นและคู่แข่งเป็นเอกสารเดียว | — |
| `code-gardener` | เดินตรวจโค้ดหาของที่ทำให้เข้าใจผิด: โค้ดซ้ำ · โค้ดตาย · ชื่อเพี้ยน | — |

**อ่านและเข้าใจโค้ด**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `code-orientation` | อ่านโค้ดที่ยังไม่เคยเห็นก่อนแก้: รันอย่างไร · ทำไม · ธรรมเนียมของ repo | — |
| `blast-radius` | แก้โค้ดที่ใช้ร่วมกันแล้วหาว่าอะไรอื่นจะพังตาม | — |
| `legacy-spec-recovery` | กู้สเปกจากโค้ดระบบเก่าพร้อมหลักฐาน ก่อนแก้ระบบ | `assets/business-rule-register.md` · `assets/change-request.md` · `references/evidence-by-stack.md` · `references/framework-upgrade.md` |
| `reverse-engineering` | ถอดงานที่ไม่มีซอร์สโค้ด (exe · dll · Electron · APK · JS bundle · โปรโตคอล) | `NOTICE` · `references/android-apk.md` · `references/evidence-ledger.md` · `references/javascript-electron.md` · `references/native-binaries.md` · `references/packaging-patterns.md` · `references/runtime-observation.md` · `references/web-and-network.md` · `scripts/__pycache__/triage.cpython-313.pyc` · `scripts/apk_inventory.py` · `scripts/asar_extract.py` · `scripts/compare_members.py` · `scripts/har_summary.py` · `scripts/pe_elf_info.py` · `scripts/sourcemap_list.py` · `scripts/triage.py` |
| `readable-code` | โค้ดอ่านง่าย: ชื่อ · รูปฟังก์ชัน · คอมเมนต์ · ที่วางไฟล์ | `assets/naming-reference.md` |

**ตรวจและทดสอบ**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `code-review-checklist` | checklist รีวิว pull request และตรวจโค้ดตัวเองก่อนส่ง | `references/full-checklist.md` |
| `testing-standards` | ตั้ง test อัตโนมัติ (.NET · Node · Python · Angular · Flutter) แก้ชุด test ที่ไม่นิ่ง | `references/per-stack.md` |
| `e2e-testing-patterns` | test แบบเปิดเบราว์เซอร์จริง (Playwright · Cypress) แก้ test ที่ผลไม่นิ่ง | `references/auth-in-e2e.md` · `references/ci-and-parallel.md` · `references/coverage-and-libraries.md` · `references/flaky-tests.md` · `references/page-object-model.md` · `references/test-data-strategies.md` |
| `test-case-template` | เขียน test case และแผนทดสอบฟีเจอร์จาก acceptance criteria | `assets/test-case.md` · `references/example-login.md` · `references/test-plan-template.md` · `scripts/build-test-workbook.py` |
| `bug-report-template` | แบบรายงานบั๊ก 1 ตัว: วิธีทำให้เกิดซ้ำ · ความรุนแรง | `assets/bug-report.md` |
| `bug-inbox-triage` | คัดรายงานบั๊กที่กองอยู่ในเมล แชต หรือระบบติดตามงาน | — |
| `app-verifier-setup` | สร้างสคริปต์ verify ให้ agent เปิดแอปจริงแล้วเห็นผลเอง + สัญญาสำหรับทดสอบ | `references/android-native.md` · `references/builtin-verify.md` |
| `app-verifier-upkeep` | แก้สคริปต์ verify เมื่อแอปเปลี่ยนจนขั้นตอนไม่ตรง | — |
| `spec-to-code-loop` | ลูปสร้างจากสเปก: test แดงก่อน → โค้ด → เทียบหน้าจอ → บันทึก · ติดแล้วทำอย่างไร | — |
| `web-quality-audit` | ตรวจการเข้าถึง (WCAG 2.2 AA) และความเร็ว (Lighthouse · Core Web Vitals) ของเว็บก่อนเปิดตัว | — |

**ความปลอดภัยและข้อมูลส่วนตัว**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `security-gate` | ด่านความปลอดภัยก่อนส่ง: สแกนค่าลับ · dependency · โค้ด | `assets/semgrep-offline.yml` · `references/android.md` · `references/dependency-updates.md` |
| `security-operations` | งานปฏิบัติการความปลอดภัย: กักเหตุ · SOC · กฎ SIEM · ล่าภัยคุกคาม | `references/agent-incident-responder.md` · `references/agent-security-architect.md` · `references/agent-soc-analyst.md` · `references/agent-threat-hunter.md` · `references/security-incident-response.md` · `references/soc-operations.md` · `references/threat-detection-patterns.md` |
| `auth-implementation-patterns` | ทำระบบล็อกอิน: session หรือ JWT · OAuth · SSO · MFA · รีเซ็ตรหัสผ่าน | `references/api-auth-and-authorization.md` · `references/auth-flows.md` · `references/libraries-and-code.md` · `references/mfa.md` |
| `config-and-secrets` | ค่าที่ต่างกันตาม environment และค่าลับที่ห้ามเข้า git | `references/per-stack.md` |
| `pdpa-compliance` | ซอฟต์แวร์ที่เก็บข้อมูลคนไทยตาม PDPA: ความยินยอม · สิทธิ์ · ระยะเก็บ · ข้อมูลรั่ว | — |
| `audit-trail` | เก็บประวัติว่าใครทำอะไรเมื่อไร (อนุมัติ · เงิน · สิทธิ์ · ข้อมูลส่วนบุคคล) | — |

**เขียนโค้ดและภาษา**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `stack-dotnet` | เขียนและตรวจ C# / .NET (ASP.NET Core · MVC 5 · EF Core) | — |
| `stack-python` | เขียนและตรวจ Python (สคริปต์ · CLI · FastAPI · Django · pandas · AI) | — |
| `stack-sql` | เขียนและตรวจ SQL query · procedure · สคริปต์แก้ข้อมูล (SQL Server · PostgreSQL) | `references/performance.md` · `references/safe-changes.md` · `references/snippets.md` |
| `stack-typescript` | เขียนและตรวจ TypeScript (Node · NestJS · Angular · React · Vite) | — |
| `error-handling-patterns` | จัดการโค้ดที่พังได้ (เครือข่าย · ฐานข้อมูล · บริการอื่น) ลองซ้ำ · หมดเวลา | — |
| `logging-standards` | มาตรฐาน log: รูปแบบ · ระดับ · correlation id · ปิดข้อมูลลับ | `assets/logger.node.js` · `assets/logger_py.py` · `references/per-stack.md` |
| `commit-message-format` | รูปแบบข้อความ commit (Conventional Commits) | — |
| `pr-description-template` | เขียนคำอธิบาย pull request | — |
| `i18n-and-locale` | แสดงข้อความ วันที่ ตัวเลข เงิน ทั้งไทยและอังกฤษ (ปี พ.ศ. · การเรียงคำไทย) | `references/thai-text-tools.md` |

**สถาปัตยกรรมและหลังบ้าน**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `architecture-patterns` | เลือกสถาปัตยกรรม: monolith · microservices · serverless · event-driven · CQRS · Saga | `references/advanced-patterns.md` · `references/architecture-overview-template.md` · `references/core-patterns.md` |
| `adr-writer` | บันทึกการตัดสินใจด้านสถาปัตยกรรม (ADR) ว่าเลือกอะไรเพราะอะไร | `assets/adr.md` |
| `api-conventions` | กติกา API ให้เหมือนกันทั้งระบบ: URL · แบ่งหน้า · วันที่ · id | `assets/API-CONVENTIONS.md` · `references/contract-testing.md` |
| `database-design` | ออกแบบหรือแก้ schema: ตาราง · คอลัมน์ · index · ความสัมพันธ์ · migration | `references/data-pipeline-patterns.md` · `references/data-types.md` · `references/migrations.md` · `references/per-stack.md` · `references/warehouse-modeling.md` |
| `web-service-essentials` | ของที่ทุก HTTP service ต้องมี: health endpoint · error ตาม RFC 9457 | `assets/health.node.js` · `assets/health_py.py` · `references/per-stack.md` |
| `mcp-server` | สร้าง MCP server ให้ agent ใช้ระบบจริง (stdio ก่อน · tool อ่านอย่างเดียว · eval 3 กรณี) | `assets/inventory-mcp/README.md` · `assets/inventory-mcp/server.py` · `assets/inventory-mcp/wire-inventory-2026-10-23.jsonl` · `references/remote-and-auth.md` · `references/tool-design.md` |
| `background-jobs` | งานเบื้องหลัง (ส่งเมล · รายงาน · นำเข้า · ตั้งเวลา) คิวและการลองซ้ำ | — |
| `notifications` | ส่งเมล SMS LINE push และข้อความในแอป: ช่องทาง · แม่แบบ · เลิกรับ | — |
| `file-upload-and-storage` | รับไฟล์อัปโหลด เก็บ และให้ดาวน์โหลด (ตรวจชนิด · สแกนไวรัส · ลิงก์) | — |
| `data-import-export` | นำเข้าและส่งออก Excel/CSV: ตรวจก่อนเขียน · error รายแถว · ปี พ.ศ. | `references/thai-accounting-apis.md` |
| `observability-basics` | รู้ว่าระบบปกติก่อนลูกค้าบ่น: metric · log · trace · แจ้งเตือน | — |
| `cicd-and-release` | ตั้งหรือแก้ท่อ build และ deploy เลือกวิธีปล่อยงาน | `references/deployment-plan-template.md` · `references/per-platform.md` |
| `infra-as-code` | สร้างเครื่อง ฐานข้อมูล และเครือข่ายบนคลาวด์จากโค้ด (OpenTofu · plan ใน PR · apply production รออนุมัติ · region ในไทย) | — |
| `incident-runbook-template` | คู่มือรับมือเมื่อระบบพัง และคู่มือเวร on-call | `references/game-days.md` · `references/index-and-alert-links.md` · `references/runbook-template.md` |
| `postmortem-template` | เขียนทบทวนหลังเหตุระบบล่มแบบไม่โทษคน | — |
| `saas-platform` | สร้าง SaaS แบบ B2B: หลายลูกค้าในระบบเดียว · แยกข้อมูล · SSO · SCIM · เก็บเงิน | `references/agent-customer-success-engineer.md` · `references/agent-integration-engineer.md` · `references/agent-revops-analyst.md` · `references/agent-saas-architect.md` · `references/enterprise-integration.md` · `references/multi-tenancy-patterns.md` · `references/subscription-billing.md` |

**ออกแบบหน้าจอและภาพ**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `ui-craft` | ฝีมือหน้าจอ: ใช้คู่กับ skill ตามแพลตฟอร์มทุกครั้งที่ทำหน้าจอหรือ mockup | `assets/app-character-sheet.html` · `assets/app-character-sheet.webp` · `assets/mockup-start-page-preview.webp` · `assets/mockup-start-page.example.json` · `references/app-character.md` · `references/depth-and-flourish.md` · `references/figma-to-code.md` · `references/mockup-start-page.md` · `references/scales.md` · `references/states-and-checks.md` · `references/ux-spec-outputs.md` · `references/web-looks.md` · `scripts/mockup-start-page.py` |
| `web-app-design` | ออกแบบหน้าจอเว็บแอปหรือ mockup (dashboard · หน้าแอดมิน · SaaS) | `assets/appstrack.css` · `assets/mockup-template-preview.webp` · `assets/mockup-template.html` · `references/tokens.md` · `scripts/check-design-tokens.mjs` · `scripts/screenshot.py` |
| `dynamic-website` | เว็บการตลาดหรือหน้างานที่เล่าเรื่องทีละบทด้วย GSAP (deck-mode · scroll · พื้นหลัง 3D) | `assets/example-deck.html` · `references/recipes.md` |
| `mobile-app-design` | ออกแบบหน้าจอแอปมือถือหรือ mockup (PWA · React Native · Flutter) | `assets/mockup-template-preview.webp` · `assets/mockup-template.html` · `assets/speakgo.css` · `references/review.md` · `references/screen-and-components.md` · `references/tokens.md` · `scripts/screenshot.py` |
| `windows-app-design` | แอป desktop ที่ต้องดูเป็นของ Windows 11 (WinUI 3 · MAUI) | `assets/FluentTokens.axaml` · `assets/FluentTokens.xaml` · `assets/fluent.css` · `assets/mockup-template.html` · `assets/templates-preview.webp` · `assets/tool-app-template.html` · `references/frame-and-components.md` · `references/patterns.md` · `references/review.md` · `references/tokens.md` · `scripts/screenshot.py` |
| `graphic-design` | งานภาพของโปรเจกต์ที่ไม่ใช่หน้าจอ: โลโก้ · โปสเตอร์ · โพสต์ · rich menu | `assets/brand-direction.md` · `assets/logo-preview-sheet-example.webp` · `references/designer-outputs.md` · `references/logo-design.md` · `references/sizes-and-print.md` · `references/thai-in-graphics.md` |
| `diagram-figures` | รูปสถาปัตยกรรมหรือแนวคิดแบบออกแบบมา สำหรับข้อเสนอ สไลด์ งานพิมพ์ | `assets/figure-cloud.html` · `assets/figure-context.html` · `assets/figure-flow-example.png` · `assets/figure-flow.html` · `assets/figure-template.html` · `assets/find-icon.py` · `assets/icons/INDEX.md` · `assets/icons/app/angular.png` · `assets/icons/app/bash.png` · `assets/icons/app/client.png` · `assets/icons/app/cloudflare.png` · `assets/icons/app/csharp.png` · `assets/icons/app/discord.png` · `assets/icons/app/django.png` · `assets/icons/app/dotnet.png` · `assets/icons/app/fastapi.png` · `assets/icons/app/firebase.png` · `assets/icons/app/flask.png` · `assets/icons/app/flutter.png` · `assets/icons/app/go.png` · `assets/icons/app/graphql.png` · `assets/icons/app/java.png` · `assets/icons/app/javascript.png` · `assets/icons/app/laravel.png` · `assets/icons/app/line.png` · `assets/icons/app/nextjs.png` · `assets/icons/app/nodejs.png` · `assets/icons/app/paypal.png` · `assets/icons/app/php.png` · `assets/icons/app/python.png` · `assets/icons/app/rails.png` · `assets/icons/app/react.png` · `assets/icons/app/rust.png` · `assets/icons/app/slack.png` · `assets/icons/app/spring.png` · `assets/icons/app/sql.png` · `assets/icons/app/stripe.png` · `assets/icons/app/svelte.png` · `assets/icons/app/teams.png` · `assets/icons/app/telegram.png` · `assets/icons/app/typescript.png` · `assets/icons/app/user.png` · `assets/icons/app/users.png` · `assets/icons/app/vue.png` · `assets/icons/aws/alb.png` · `assets/icons/aws/api-gateway.png` · `assets/icons/aws/athena.png` · `assets/icons/aws/aurora.png` · `assets/icons/aws/backup.png` · `assets/icons/aws/bedrock.png` · `assets/icons/aws/cloudformation.png` · `assets/icons/aws/cloudfront.png` · `assets/icons/aws/cloudwatch.png` · `assets/icons/aws/cognito.png` · `assets/icons/aws/dynamodb.png` · `assets/icons/aws/ec2.png` · `assets/icons/aws/ecr.png` · `assets/icons/aws/ecs.png` · `assets/icons/aws/efs.png` · `assets/icons/aws/eks.png` · `assets/icons/aws/elasticache.png` · `assets/icons/aws/elb.png` · `assets/icons/aws/eventbridge.png` · `assets/icons/aws/fargate.png` · `assets/icons/aws/glue.png` · `assets/icons/aws/iam.png` · `assets/icons/aws/internet-gateway.png` · `assets/icons/aws/kinesis.png` · `assets/icons/aws/kms.png` · `assets/icons/aws/lambda.png` · `assets/icons/aws/nat-gateway.png` · `assets/icons/aws/rds.png` · `assets/icons/aws/redshift.png` · `assets/icons/aws/route53.png` · `assets/icons/aws/s3.png` · `assets/icons/aws/sagemaker.png` · `assets/icons/aws/secrets-manager.png` · `assets/icons/aws/ses.png` · `assets/icons/aws/sns.png` · `assets/icons/aws/sqs.png` · `assets/icons/aws/step-functions.png` · `assets/icons/aws/vpc.png` · `assets/icons/aws/waf.png` · `assets/icons/azure/active-directory.png` · `assets/icons/azure/aks.png` · `assets/icons/azure/api-management.png` · `assets/icons/azure/app-service.png` · `assets/icons/azure/application-gateway.png` · `assets/icons/azure/blob-storage.png` · `assets/icons/azure/cdn.png` · `assets/icons/azure/container-instances.png` · `assets/icons/azure/container-registry.png` · `assets/icons/azure/cosmos-db.png` · `assets/icons/azure/devops.png` · `assets/icons/azure/dns.png` · `assets/icons/azure/event-grid.png` · `assets/icons/azure/front-door.png` · `assets/icons/azure/functions.png` · `assets/icons/azure/key-vault.png` · `assets/icons/azure/load-balancer.png` · `assets/icons/azure/monitor.png` · `assets/icons/azure/postgresql.png` · `assets/icons/azure/redis.png` · `assets/icons/azure/service-bus.png` · `assets/icons/azure/sql-database.png` · `assets/icons/azure/storage-accounts.png` · `assets/icons/azure/vm.png` · `assets/icons/contact-sheet.html` · `assets/icons/data/cassandra.png` · `assets/icons/data/ceph.png` · `assets/icons/data/clickhouse.png` · `assets/icons/data/elasticsearch.png` · `assets/icons/data/glusterfs.png` · `assets/icons/data/influxdb.png` · `assets/icons/data/kibana.png` · `assets/icons/data/logstash.png` · `assets/icons/data/mariadb.png` · `assets/icons/data/memcached.png` · `assets/icons/data/mongodb.png` · `assets/icons/data/mssql.png` · `assets/icons/data/mysql.png` · `assets/icons/data/neo4j.png` · `assets/icons/data/oracle.png` · `assets/icons/data/postgresql.png` · `assets/icons/data/redis.png` · `assets/icons/gcp/app-engine.png` · `assets/icons/gcp/bigquery.png` · `assets/icons/gcp/bigtable.png` · `assets/icons/gcp/cdn.png` · `assets/icons/gcp/cloud-run.png` · `assets/icons/gcp/cloud-sql.png` · `assets/icons/gcp/cloud-storage.png` · `assets/icons/gcp/compute-engine.png` · `assets/icons/gcp/dataflow.png` · `assets/icons/gcp/dns.png` · `assets/icons/gcp/firestore.png` · `assets/icons/gcp/functions.png` · `assets/icons/gcp/gke.png` · `assets/icons/gcp/iam.png` · `assets/icons/gcp/key-management.png` · `assets/icons/gcp/load-balancing.png` · `assets/icons/gcp/memorystore.png` · `assets/icons/gcp/pubsub.png` · `assets/icons/gcp/spanner.png` · `assets/icons/gcp/vertex-ai.png` · `assets/icons/gcp/vpc.png` · `assets/icons/index.json` · `assets/icons/infra/android.png` · `assets/icons/infra/apache.png` · `assets/icons/infra/consul.png` · `assets/icons/infra/containerd.png` · `assets/icons/infra/docker.png` · `assets/icons/infra/envoy.png` · `assets/icons/infra/etcd.png` · `assets/icons/infra/firewall.png` · `assets/icons/infra/haproxy.png` · `assets/icons/infra/internet.png` · `assets/icons/infra/ios.png` · `assets/icons/infra/istio.png` · `assets/icons/infra/k3s.png` · `assets/icons/infra/kong.png` · `assets/icons/infra/linux.png` · `assets/icons/infra/mobile.png` · `assets/icons/infra/nginx.png` · `assets/icons/infra/router.png` · `assets/icons/infra/storage.png` · `assets/icons/infra/subnet.png` · `assets/icons/infra/switch.png` · `assets/icons/infra/tablet.png` · `assets/icons/infra/traefik.png` · `assets/icons/infra/ubuntu.png` · `assets/icons/infra/vpn.png` · `assets/icons/infra/windows.png` · `assets/icons/k8s/configmap.png` · `assets/icons/k8s/cronjob.png` · `assets/icons/k8s/daemonset.png` · `assets/icons/k8s/deployment.png` · `assets/icons/k8s/ingress.png` · `assets/icons/k8s/job.png` · `assets/icons/k8s/master.png` · `assets/icons/k8s/namespace.png` · `assets/icons/k8s/network-policy.png` · `assets/icons/k8s/node.png` · `assets/icons/k8s/pod.png` · `assets/icons/k8s/pv.png` · `assets/icons/k8s/pvc.png` · `assets/icons/k8s/secret.png` · `assets/icons/k8s/service.png` · `assets/icons/k8s/statefulset.png` · `assets/icons/ops/airflow.png` · `assets/icons/ops/ansible.png` · `assets/icons/ops/circleci.png` · `assets/icons/ops/datadog.png` · `assets/icons/ops/git.png` · `assets/icons/ops/github-actions.png` · `assets/icons/ops/github.png` · `assets/icons/ops/gitlab-ci.png` · `assets/icons/ops/gitlab.png` · `assets/icons/ops/grafana.png` · `assets/icons/ops/jenkins.png` · `assets/icons/ops/prometheus.png` · `assets/icons/ops/sentry.png` · `assets/icons/ops/spark.png` · `assets/icons/ops/splunk.png` · `assets/icons/ops/superset.png` · `assets/icons/ops/terraform.png` · `assets/icons/ops/vault.png` · `assets/icons/ops/zabbix.png` · `assets/icons/queue/activemq.png` · `assets/icons/queue/celery.png` · `assets/icons/queue/emqx.png` · `assets/icons/queue/kafka.png` · `assets/icons/queue/nats.png` · `assets/icons/queue/rabbitmq.png` · `assets/mermaid-engine/build.py` · `assets/mermaid-engine/check.py` · `assets/mermaid-engine/elk.py` · `assets/mermaid-engine/elk_run.js` · `assets/mermaid-engine/er_layout.py` · `assets/mermaid-engine/er_parse.py` · `assets/mermaid-engine/figures.json` · `assets/mermaid-engine/gantt_layout.py` · `assets/mermaid-engine/gantt_parse.py` · `assets/mermaid-engine/graphdraw.py` · `assets/mermaid-engine/render.py` · `assets/mermaid-engine/seq_layout.py` · `assets/mermaid-engine/seq_parse.py` · `assets/mermaid-engine/state_layout.py` · `assets/mermaid-engine/state_parse.py` · `assets/mermaid-engine/svgkit.py` · `assets/mermaid-engine/theme.py` · `assets/render-figure.py` · `assets/svg-engine/d01.py` · `assets/svg-engine/ref.py` · `assets/svg-engine/render.py` · `assets/svg-engine/theme.py` · `assets/tech-icons.zip` · `references/colour-by-domain.md` · `references/design-system.md` · `references/engine-mermaid.md` · `references/engine-svg-python.md` · `references/icons.md` · `references/layout-cloud.md` · `references/layout-context.md` · `references/layout-deployment.md` · `references/layout-flow.md` · `references/pitfalls.md` · `references/wires.md` · `scripts/check-figure-geometry.py` · `scripts/check-figure-source.py` |
| `software-diagrams` | แผนภาพเทคนิคแบบ Mermaid ใน Markdown README หรือ PR | `assets/diagrams-python.md` · `assets/infra-diagram.py` · `assets/mermaid-theme.md` · `scripts/check-mermaid-theme.mjs` |
| `markdown-visuals` | ภาพในเอกสาร Markdown ที่แสดงได้ทุกที่ (หน้าจอ · ขั้นตอน · สถาปัตยกรรม) | `references/ascii-patterns.md` · `references/combining-formats.md` · `references/svg-snippets.md` |
| `product-naming` | ตั้งชื่อสินค้า แอป โมดูล แบรนด์ และเช็กว่าคนไทยอ่านแล้วฟังเป็นอย่างไร | `assets/name-shortlist.md` · `references/formula-9-deep-dive.md` · `references/meaning-libraries.md` |

**เอกสารและสไลด์**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `srs-writing` | เขียนหรือตรวจ SRS ตาม ISO 29148 ทุกข้อมีรหัสและทดสอบได้ | `assets/srs-outline.md` · `references/brd-template.md` · `references/review-checklist.md` |
| `fsd-writing` | เขียนหรือตรวจ FSD เอกสารสเปกที่ใช้สร้างหน้าจอ | `assets/fsd-outline.md` · `references/edge-cases.md` · `references/figures.md` · `references/fsd-vs-srs.md` · `references/outline-sections.md` · `references/related-skills.md` · `references/stakeholder-doc-templates.md` · `references/worked-examples.md` |
| `user-story-writer` | เขียน user story และเกณฑ์รับงานแบบ Given-When-Then | `assets/user-stories.md` · `examples/login-story.md` |
| `project-doc-set` | เลือกชุดเอกสารของโปรเจกต์ ลำดับ ที่เก็บ และรวมข้อค้างไว้ใน Excel | `assets/doc-set-checklist.md` · `references/docs-site.md` · `references/ecosystem.md` · `references/technical-docs.md` · `references/writer-templates.md` · `scripts/open_items.py` |
| `project-bootstrap` | ตั้ง repo ใหม่: โครงโฟลเดอร์ · README · คำสั่งรันคำสั่งเดียว | `assets/starter-files.md` · `references/changelog-examples.md` · `references/code-folder.md` |
| `branded-document-design` | ทำ Word · PowerPoint · PDF ให้ดูออกแบบมา (สี · ฟอนต์ไทย) | `examples/example_deck.pptx` · `examples/example_srs-preview.png` · `examples/example_srs.docx` · `examples/example_stage.pptx` · `examples/fig-flow-dark.png` · `references/anti-patterns.md` · `references/api.md` · `references/brandkit-usage.md` · `references/cover-vote.md` · `references/palette-examples.md` · `references/thai-fonts.md` · `references/tokens-and-type.md` · `references/visual-check.md` · `references/word-layout.md` · `scripts/__pycache__/brandkit.cpython-313.pyc` · `scripts/brandkit.py` · `scripts/brandkit_pptx.py` · `scripts/brandkit_stage.py` · `scripts/cover_art.py` · `scripts/example_deck.py` · `scripts/example_srs.py` · `scripts/example_stage.py` |
| `markdown-report-docx` | รายงานจาก Markdown ไฟล์เดียว ออกมาเป็น .docx สวยพร้อมส่ง | `assets/example-logo.png` · `assets/example-report.md` · `scripts/__pycache__/md_to_docx.cpython-313.pyc` · `scripts/md_to_docx.py` |
| `presentation-design` | ทำสไลด์ที่คนจะนำเสนอหรืออ่าน: เรื่องเล่า · หัวข้อ · layout · ฟอนต์ไทย | `assets/slide-mockup-preview.webp` · `assets/slide-mockup.html` · `references/anti-patterns.md` |
| `html-slide-deck` | สไลด์เป็นไฟล์ HTML ไฟล์เดียว เปิดได้ไม่ต้องต่อเน็ต มีโน้ตผู้พูด | `assets/example-logo.png` · `assets/shell.html` · `assets/slides-example-preview.webp` · `assets/slides-example.html` · `scripts/build_deck.py` · `scripts/check_deck.py` |
| `pptx-to-html-deck` | เปลี่ยน .pptx เป็น HTML ไฟล์เดียวที่มี animation โน้ต และเมนู | `assets/interactive-page.html` · `assets/runtime.css` · `assets/runtime.js` · `scripts/check_html_deck.py` · `scripts/click_steps.py` · `scripts/pptx_to_html.py` |

**ความรู้เฉพาะสาขา**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `ecommerce-patterns` | สร้างซอฟต์แวร์ร้านค้า: ตะกร้า · ชำระเงิน · คำสั่งซื้อ · โปรโมชัน · สต็อก | `references/agent-cro-specialist.md` · `references/agent-ecommerce-engineer.md` · `references/agent-inventory-specialist.md` · `references/agent-recommendation-engineer.md` · `references/checkout-optimization.md` · `references/inventory-management.md` · `references/recommendation-systems.md` · `references/thai-marketplace-apis.md` |
| `fintech-payments` | ระบบรับจ่ายเงิน (Stripe · Omise · PromptPay · webhook · คืนเงิน · KYC) | `references/agent-fintech-compliance-officer.md` · `references/agent-fintech-engineer.md` · `references/agent-payment-integration.md` · `references/agent-quant-analyst.md` · `references/kyc-aml-patterns.md` · `references/payment-gateway-integration.md` · `references/pci-dss-compliance.md` |
| `game-development` | สร้างเกม: เลือก engine · ECS · netcode · จับคู่ผู้เล่น · กันโกง | `references/agent-game-designer.md` · `references/agent-game-developer.md` · `references/agent-live-ops-specialist.md` · `references/agent-multiplayer-engineer.md` · `references/game-architecture.md` · `references/live-ops-patterns.md` · `references/multiplayer-netcode.md` |
| `healthcare-systems` | ซอฟต์แวร์ที่จับข้อมูลผู้ป่วย (คำสั่งแพทย์ · ยา · FHIR · EHR · HIPAA) | `references/agent-fhir-specialist.md` · `references/agent-healthcare-engineer.md` · `references/agent-hipaa-officer.md` · `references/clinical-analytics.md` · `references/clinical-workflows.md` · `references/fhir-implementation.md` · `references/hipaa-compliance.md` |
| `insurance-systems` | ซอฟต์แวร์ประกัน: กรมธรรม์ · ใบเสนอราคา · เคลม · ฉ้อฉล · รายงาน คปภ. | `references/agent-actuarial-engineer.md` · `references/agent-claims-processing-specialist.md` · `references/agent-insurance-compliance-officer.md` · `references/agent-insurance-engineer.md` · `references/agent-underwriting-analyst.md` · `references/claims-workflow-patterns.md` · `references/insurance-compliance.md` · `references/underwriting-models.md` |
| `iot-systems` | อุปกรณ์เชื่อมต่อ: ลงทะเบียนเครื่อง · อัปเดต OTA · edge หรือ cloud · MQTT | `references/agent-edge-architect.md` · `references/agent-firmware-engineer.md` · `references/agent-iot-engineer.md` · `references/agent-mqtt-specialist.md` · `references/device-fleet-management.md` · `references/edge-computing-architecture.md` · `references/mqtt-protocol-patterns.md` |
| `legal-document-systems` | ซอฟต์แวร์เอกสารกฎหมาย: ดึงข้อสัญญา · สร้างเอกสาร · e-signature · พ.ร.บ.ธุรกรรมฯ | `references/agent-contract-analyzer.md` · `references/agent-document-automation-engineer.md` · `references/agent-e-signature-specialist.md` · `references/agent-legal-compliance-officer.md` · `references/agent-legaltech-engineer.md` · `references/contract-parsing-patterns.md` · `references/document-automation-patterns.md` · `references/e-signature-compliance.md` |
| `llm-engineering` | ระบบที่เรียก LLM: prompt · ผลแบบมีโครงสร้าง · RAG · embedding · วัดผล | `references/agent-llm-architect.md` · `references/agent-ml-engineer.md` · `references/agent-mlops-engineer.md` · `references/agent-prompt-engineer.md` · `references/llm-evaluation-patterns.md` · `references/prompt-engineering-patterns.md` · `references/rag-architecture.md` |
| `mobile-engineering` | งานวิศวกรรมแอปมือถือ (Kotlin · Swift · Flutter · React Native · ใช้งานออฟไลน์) | `references/agent-android-engineer.md` · `references/agent-aso-specialist.md` · `references/agent-cross-platform-engineer.md` · `references/agent-ios-engineer.md` · `references/app-store-optimization.md` · `references/mobile-architecture-patterns.md` · `references/mobile-performance.md` |
| `smart-contracts` | สร้างงานบนบล็อกเชน: สัญญา Solidity / Solana · ตรวจสัญญา · DeFi | `references/agent-blockchain-architect.md` · `references/agent-defi-engineer.md` · `references/agent-smart-contract-developer.md` · `references/agent-tokenomics-designer.md` · `references/defi-patterns.md` · `references/smart-contract-testing.md` · `references/solidity-security.md` |
| `developer-experience` | ประสบการณ์นักพัฒนา: เวลาถึง hello world · ข้อความ error · CLI · SDK | `references/agent-devrel-engineer.md` · `references/agent-docs-engineer.md` · `references/agent-dx-engineer.md` · `references/agent-sdk-builder.md` · `references/developer-experience.md` · `references/sdk-design-patterns.md` · `references/technical-content.md` |
| `seo-audit-checklist` | checklist ตรวจ SEO ของเว็บก่อนเปิดตัว | `references/checklist.md` · `references/page-brief.md` · `references/report-template.md` |
| `data-analysis` | ตอบคำถามธุรกิจจาก CSV · Excel · SQL ด้วยสคริปต์รันซ้ำได้ (ตัวเลขอ้างบรรทัดผล · ไฟล์ไทย · กราฟภาษาไทย) | `assets/analyse_sales.py` · `assets/make_sample.py` · `assets/sales-sample.csv` |

**อื่น ๆ**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `doc-cover-design` | ปกเอกสาร .docx ที่ไม่ซ้ำใคร 3 แบบ แล้วโหวต 2 ใน 3 | `references/cover-bakeoff.md` · `references/real-examples.md` · `references/structural-ideas.md` · `references/word-build.md` · `scripts/cover-engine/src/build_all.py` · `scripts/cover-engine/src/calibrate.py` · `scripts/cover-engine/src/capture.py` · `scripts/cover-engine/src/docx_build.py` · `scripts/cover-engine/src/fonts.py` · `scripts/cover-engine/src/render.py` · `scripts/cover-engine/src/web/cover.html` · `scripts/cover-engine/src/web/cover.js` · `scripts/cover-engine/src/web/projects.js` · `scripts/cover-engine/src/web/set.html` · `scripts/cover-engine/src/word_pdf.py` |
| `owasp-top10` | ระบบเว็บและ API ผ่าน OWASP Top 10:2025: สิ่งที่ต้องมี · วิธีพิสูจน์ · รายงานรายข้อ A01–A10 | `assets/owasp-report.md` · `references/contract-clause.md` · `references/stack-checks.md` |
| `stack-mql` | เขียนและตรวจ MQL4 / MQL5 (EA · indicator บน MetaTrader) และเตรียมขายบน MQL5 Market | — |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/agents.md` · `references/approvals.md` · `references/brief-template.md` · `references/code-extensions.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-bug-fix.md` · `references/playbook-feature.md` · `references/playbook-housekeeping.md` · `references/playbook-investigation.md` · `references/playbook-learn-from-session.md` · `references/playbook-new-project.md` · `references/playbook-performance.md` · `references/playbook-pickup-and-pause.md` · `references/playbook-project-docs.md` · `references/playbook-prototype.md` · `references/playbook-refactor.md` · `references/playbook-review.md` · `references/playbook-ship.md` · `references/playbook-skill-authoring.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-unattended-run.md` · `references/playbook-visual-parity.md` · `references/principles.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |
| `test-evidence` | รัน test case แล้วเก็บหลักฐาน: GIF มีคำบรรยาย · รายงานผ่าน/ไม่ผ่าน · คอลัมน์ใน Excel | `assets/fonts/LICENSE-DejaVu.txt` · `assets/fonts/OFL-Sarabun.txt` · `assets/fonts/Sarabun-Regular.ttf` · `assets/fonts/Sarabun-SemiBold.ttf` · `assets/fonts/Symbols-DejaVuSans.ttf` · `scripts/make_evidence.py` · `scripts/record_results.py` |

### คำสั่ง (29) — พิมพ์ `/software-company:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `api-design` | ออกแบบสเปก API (endpoint · schema · error · ตัวอย่าง) | — |
| `architecture-review` | รีวิวสถาปัตยกรรมเทียบกับข้อกำหนดที่ไม่ใช่ฟังก์ชันและความเสี่ยง | — |
| `bug-report` | เขียนรายงานบั๊กตามแบบด้วย qa-tester | — |
| `code-review` | รีวิวโค้ดด้วย reviewer ตัวใหม่ตาม checklist | — |
| `dx-design` | ตรวจประสบการณ์นักพัฒนา หรือออกแบบ SDK | — |
| `ecommerce-design` | ตรวจหน้าชำระเงิน หรือออกแบบระบบแนะนำสินค้า | — |
| `feature-kickoff` | เริ่มฟีเจอร์ใหม่ BA → SA → สถาปนิก → วางแผน | — |
| `fintech-design` | ออกแบบขั้นตอนธุรกรรมการเงิน หรือตรวจความพร้อม PCI-DSS | — |
| `game-design` | เขียนเอกสารออกแบบเกม หรือสถาปัตยกรรมเกมหลายผู้เล่น | — |
| `healthcare-design` | ออกแบบ FHIR API หรือตรวจความพร้อม HIPAA | — |
| `incident-response` | คุมเหตุระบบล่มตอนเกิด คัดแยก บรรเทา แก้ แล้วทำ postmortem | — |
| `insurance-design` | ออกแบบขั้นตอนเคลม หรือโมเดลพิจารณารับประกัน | — |
| `iot-design` | ออกแบบระบบ IoT หรือการจัดการอุปกรณ์จำนวนมาก | — |
| `legacy-onboard` | ทำสเปกสภาพปัจจุบันของระบบเก่าที่มีแต่โค้ด | — |
| `legal-doc-design` | ออกแบบระบบวิเคราะห์สัญญา หรือตรวจความถูกต้องของ e-signature | — |
| `llm-design` | ออกแบบระบบ RAG หรือชุดวัดผล LLM | — |
| `mobile-design` | ออกแบบสถาปัตยกรรมแอปมือถือ หรือตรวจหน้าร้าน App Store / Play Store | — |
| `onboard` | เอกสารรับคนเข้าทีมใหม่ 30/60/90 วัน | — |
| `product-roadmap` | ทำ roadmap รายไตรมาส จัดลำดับด้วย RICE และตัววัดผล | `references/product-doc-templates.md` |
| `release-notes` | เขียน release notes ให้ผู้ใช้อ่าน | — |
| `retrospective` | ทบทวนหลังจบ sprint: อะไรดี อะไรไม่ดี จะทำอะไรต่อ | — |
| `saas-design` | รีวิวสถาปัตยกรรม SaaS แบบ B2B หรือออกแบบการเชื่อมระบบองค์กร | — |
| `security-ops-design` | ออกแบบ SOC หรือล่าภัยคุกคาม | — |
| `security-scan` | ตรวจความปลอดภัยของโค้ด dependency และโครงสร้างพื้นฐาน | — |
| `seo-audit` | ตรวจ SEO ด้านเทคนิค · ในหน้า · เนื้อหา · นอกหน้า | — |
| `sprint-plan` | วางแผน sprint: เกลา backlog · จัดลำดับ · ดูกำลังทีม | — |
| `test-design` | ทำ test case ของฟีเจอร์ด้วย qa-tester | — |
| `threat-model` | ทำ threat model แบบ STRIDE ของฟีเจอร์หรือระบบ | `references/security-templates.md` |
| `web3-design` | ตรวจ smart contract หรือออกแบบ tokenomics | — |

### playbook (17) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-bug-fix.md` | แก้บั๊ก | 10 |
| `playbook-feature.md` | เพิ่มฟีเจอร์ | 10 |
| `playbook-housekeeping.md` | เก็บกวาดเครื่อง | 5 |
| `playbook-investigation.md` | สืบหาคำตอบ | 9 |
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ผ่านมา | 7 |
| `playbook-new-project.md` | เริ่มโปรเจกต์ใหม่ | 10 |
| `playbook-performance.md` | ทำให้เร็วขึ้น | 9 |
| `playbook-pickup-and-pause.md` | รับงานต่อและพักงาน | 8 |
| `playbook-project-docs.md` | เขียนเอกสารโปรเจกต์ | 8 |
| `playbook-prototype.md` | ลองของก่อนตัดสินใจ | 7 |
| `playbook-refactor.md` | จัดโค้ดใหม่ | 9 |
| `playbook-review.md` | รีวิวโค้ด | 6 |
| `playbook-ship.md` | ส่งมอบงาน | 8 |
| `playbook-skill-authoring.md` | เขียน skill ใหม่ | 8 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-unattended-run.md` | ปล่อยให้ทำเองยาว ๆ | 7 |
| `playbook-visual-parity.md` | ทำหน้าจอให้ตรงต้นแบบ | 9 |

## superuser

ทีมผู้ช่วยทำงานหลายขั้นให้จบพร้อมตรวจ · ภาพประกอบ: [docs/plugins/superuser](plugins/superuser/README.md) · ต้นฉบับ: `plugins/superuser/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `ADAPT.md` (วิธีคัดลอก SuperUser ไปปรับใช้กับ plugin สาขาใหม่) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร) · `evals/README.md` (วิธีรัน eval รูปแบบทางการ (claude plugin eval) ของ skill ในชุด superuser และต่างจาก evals/ ที่รากอย่างไร) · `evals/human-writing-behaviour/case.yaml` (เคส eval: ภาษาไทยที่เขียนออกมาต้องไม่มีท่าที่ AI ชอบใช้) · `evals/human-writing-regression/case.yaml` (เคส eval: กันกฎเก่ากลับมา เช่น ตัดคำทำหน้าที่จนประโยคห้วน) · `evals/human-writing-trigger/case.yaml` (เคส eval: ข้อความที่ต้องทำให้ human-writing ถูกเปิด) · `hooks/core-rules.md` (กฎประจำตัวที่ hook ส่งให้ทุก session (สำเนาของ scripts/install/CLAUDE.global.md · sync-superuser สร้าง)) · `hooks/guard-rules.json` (รายการคำสั่งที่โมดูล guard บล็อกก่อนรัน (push · commit · reset --hard · ลบนอก _to_delete · แก้ settings) พร้อมเหตุผลและกฎที่มา) · `hooks/hooks.json` (บอก Claude Code ว่าจะเรียก hook ตอนไหน) · `hooks/skill-router.json` (คำในข้อความผู้ใช้ → ชื่อ skill ที่ hook บอกให้เปิดก่อนเริ่ม) · `hooks/superuser-hook.mjs` (hook ของ SuperUser: ส่งกฎประจำตัวตอนเริ่ม · บอก skill ที่ต้องเปิด · เขียน log การทำงาน · เตือนเมื่อมีข้อความใน inbox)

### agent (3)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/brainstormer.md` | คิดทางเลือกเมื่องานคลุมเครือ · ของกลาง |
| `agents/learning-reviewer.md` | ทบทวนวิธีทำงานและเสนอแก้ · ของกลาง |
| `agents/reviewer.md` | ตรวจงานด้วยสายตาใหม่ · ของกลาง |

### skill (1 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

**แกนทีม · ส่งต่องาน**

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/autonomy.md` · `references/brief-template.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/modules.md` · `references/playbook-document.md` · `references/playbook-learn-from-session.md` · `references/playbook-pickup-and-pause.md` · `references/playbook-research.md` · `references/playbook-review.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-unattended-run.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/CONTEXT.md` · `templates/HISTORY.md` · `templates/IMPROVEMENTS.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |

### playbook (7) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-document.md` | เขียนเอกสาร | 8 |
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ทำ | 7 |
| `playbook-pickup-and-pause.md` | รับงานต่อ · หยุดงาน | 8 |
| `playbook-research.md` | ค้นคว้าหาคำตอบ | 7 |
| `playbook-review.md` | ตรวจงานก่อนส่ง | 6 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-unattended-run.md` | ปล่อยงานยาวให้ทำเอง | 7 |

## thai-workplace

เอกสาร ภาษี เงินเดือน LINE และ PDPA ของบริษัทไทย · ภาพประกอบ: [docs/plugins/thai-workplace](plugins/thai-workplace/README.md) · ต้นฉบับ: `plugins/thai-workplace/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร)

### agent (4)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/compliance-helper.md` | ดูแลข้อมูลส่วนบุคคล PDPA |
| `agents/line-admin.md` | ดูแลบัญชี LINE OA |
| `agents/tax-helper.md` | วางปฏิทินภาษีที่ต้องยื่น |
| `agents/thai-doc-writer.md` | ร่างเอกสารธุรกิจไทย |

### skill (21 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `dbd-annual-filing` | ยื่นงบหลังปิดปี: ประชุมผู้ถือหุ้น · งบผ่าน DBD e-Filing · บอจ.5 · ภ.ง.ด.50 | — |
| `doc-contract-th` | ร่างหรือตรวจสัญญาไทย (จ้างงาน · เช่า · จ้างทำของ) อากรแสตมป์ · จุดเสี่ยง | `references/clause-checklists.md` |
| `doc-leave` | ใบลาและยอดวันลา (ป่วย · พักร้อน · กิจ · คลอด) | `references/leave-forms.md` |
| `doc-quotation` | ใบเสนอราคา ใบแจ้งหนี้ ใบวางบิล ใบเสร็จ (VAT · หัก ณ ที่จ่าย · ตัวเลขเป็นคำ) | `references/templates.md` |
| `doc-thai-official` | หนังสือราชการและบันทึกข้อความตามระเบียบสารบรรณ | `references/templates.md` |
| `e-tax-invoice` | ออกหรือตรวจใบกำกับภาษี (มาตรา 86/4 · e-Tax Invoice) | — |
| `hiring-th` | จ้างพนักงานฝั่งนายจ้าง: ประกาศรับสมัครไม่เลือกปฏิบัติ · ใบคัดกรอง · สัมภาษณ์ · ตรวจบุคคลอ้างอิง · จดหมายเสนองาน | — |
| `labour-law-basics` | กฎหมายคุ้มครองแรงงาน: ทดลองงาน · OT · วันลา · บอกเลิก · ค่าชดเชย · ค่าจ้าง | `references/leave-and-severance.md` |
| `line-broadcast` | ส่งข้อความหาเพื่อนใน LINE OA: โควตา · กลุ่มเป้าหมาย · ความถี่ | `references/broadcast-template.md` |
| `line-chatbot` | ให้ LINE OA ตอบลูกค้าอัตโนมัติ: โควตา · คลังความรู้ · ส่งต่อคน | `references/kb-template.md` |
| `line-oa-setup` | สร้าง LINE OA และเปิด Messaging API (token · webhook · โควตา) | `references/webhook-node.md` |
| `line-richmenu` | ทำ rich menu ของ LINE OA (ขนาดภาพ · พื้นที่กด · JSON · เรียก API) | `references/richmenu-6.md` |
| `payroll-th` | ทำเงินเดือนรายเดือน: หักภาษี · ประกันสังคม · กองทุนสำรองเลี้ยงชีพ · ภ.ง.ด.1 | `references/50-tawi.md` |
| `pdpa-workflow` | เอกสาร PDPA ของ SME: ความยินยอม · ROPA · คำขอเจ้าของข้อมูล · แจ้งข้อมูลรั่ว | `references/pdpa-templates.md` |
| `promptpay-qr` | QR พร้อมเพย์บนใบแจ้งหนี้หรือหน้าร้าน และวิธีสร้างข้อมูลใน QR | `references/payload.md` |
| `seller-tax-basics` | ภาษีคนขายออนไลน์: 40(8) · หักค่าใช้จ่ายแบบเหมา · ภ.ง.ด.90/94 · VAT | — |
| `social-security-th` | ประกันสังคม (ม.33 · 39 · 40) ฐานค่าจ้าง สิทธิประโยชน์ การยื่น | — |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/brief-template.md` · `references/context-template.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-business-doc.md` · `references/playbook-learn-from-session.md` · `references/playbook-line-oa.md` · `references/playbook-monthly-close.md` · `references/playbook-pdpa-setup.md` · `references/playbook-review.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-unattended-run.md` · `references/playbook-year-end.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |
| `tax-vat-th` | เดือนนี้ต้องยื่นอะไร: VAT · หัก ณ ที่จ่าย · ค่าปรับ (ภ.พ.30 · ภ.ง.ด.3 · 53) | `references/wht-rates.md` |
| `thai-business-setup` | ตั้งธุรกิจ: เลือกบุคคลธรรมดา ห้างหุ้นส่วน หรือบริษัท · จดทะเบียน DBD · เช็กลิสต์หลังจด · ต้นทุนนำเข้าจากจีน | — |
| `thai-holidays` | วันหยุดราชการและวันหยุดธนาคาร รวมวันหยุดชดเชย | `references/holidays-2569-2570.md` |

### คำสั่ง (8) — พิมพ์ `/thai-workplace:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `contract` | ร่างสัญญาไทยพื้นฐาน (จ้าง · เช่า · บริการ) พร้อมจุดที่ควรให้ทนายดู | — |
| `line-bot` | สร้างหรือปรับบอตตอบลูกค้าบน LINE OA (เจตนา · คำตอบ · ส่งต่อคน) | — |
| `line-setup` | ตั้งช่อง Messaging API ครบวงจร จนทดสอบ echo ผ่าน | — |
| `payroll` | ทำเงินเดือน จากเงินเต็มถึงเงินสุทธิ หรือเอกสารสิ้นปี (ภ.ง.ด.1ก · 50 ทวิ) | — |
| `pdpa` | งาน PDPA ของ SME (แบบขอความยินยอม · รับมือข้อมูลรั่ว · คำขอเจ้าของข้อมูล) | — |
| `quotation` | ร่างใบเสนอราคา ใบแจ้งหนี้ ใบเสร็จ เป็น .docx | — |
| `tax-due` | ปฏิทินยื่นภาษี: แบบไหน เดือนไหน ใช้เอกสารอะไร | — |
| `year-end-filing` | ไทม์ไลน์ยื่นสิ้นปีของบริษัท (ประชุมผู้ถือหุ้น · บอจ.5 · e-Filing · ภ.ง.ด.50) | — |

### playbook (9) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-business-doc.md` | ร่างเอกสารธุรกิจ | 5 |
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ผ่านมา | 7 |
| `playbook-line-oa.md` | ตั้งและใช้ LINE OA | 6 |
| `playbook-monthly-close.md` | ปิดเงินเดือนประจำเดือน | 6 |
| `playbook-pdpa-setup.md` | ตั้งระบบ PDPA | 5 |
| `playbook-review.md` | ตรวจงานก่อนส่ง | 6 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-unattended-run.md` | ให้ทำงานยาวเอง | 7 |
| `playbook-year-end.md` | ปิดปีและยื่นประจำปี | 5 |

## trading-finance

วางแผนเงิน ดูพอร์ต และเทรดอย่างมีวินัย ไม่ชี้นำ · ภาพประกอบ: [docs/plugins/trading-finance](plugins/trading-finance/README.md) · ต้นฉบับ: `plugins/trading-finance/`

**ไฟล์ระดับ plugin:** `.claude-plugin/plugin.json` (ป้ายชื่อ plugin: ชื่อ · รุ่น · คำอธิบาย ที่ Claude Code อ่านตอนติดตั้ง) · `CHANGELOG.md` (บันทึกว่าแต่ละรุ่นเปลี่ยนอะไร)

### agent (4)

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `agents/alert-dispatcher.md` | ตั้งเตือนราคาและข่าว |
| `agents/market-analyst.md` | อ่านราคาและข่าวหุ้น |
| `agents/risk-manager.md` | คำนวณขนาดไม้และความเสี่ยง |
| `agents/trade-journal-coach.md` | หาจุดพลาดซ้ำจากบันทึกเทรด |

### skill (19 + ของกลาง 33)

ของกลาง: `adversarial-review-panel` · `agent-patterns` · `answer-shape` · `commit-log` · `context-budget` · `decision-log` · `document-naming` · `flag-and-propose` · `handoff` · `human-writing` · `no-ai-look` · `owner-style-capture` · `parallel-attempts-pick-best` · `parallel-split-and-merge` · `polished-document-style` · `polite-message-th-en` · `principle-build-a-tool-not-handwork` · `principle-fix-root-cause` · `principle-proceed-on-reversible-work` · `principle-prove-it-works` · `principle-small-verifiable-steps` · `principle-user-experience-first` · `prior-art-review` · `repeated-mistakes-to-checks` · `research-with-sources` · `session-lessons-to-skills` · `simplify` · `skill-authoring` · `spell-out-abbreviations` · `status-report` · `targeted-fix` · `temp-file-discipline` · `translate-th-en` — ดู [ของกลาง](#ของกลาง)

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `debt-payoff` | วางแผนปิดหนี้หลายก้อน (บัตร · สินเชื่อ · จำนำทะเบียน) แบบก้อนเล็กก่อนหรือดอกสูงก่อน | — |
| `dividend-tracker` | ติดตามปันผล: วัน XD · อัตราผลตอบแทน · ภาษีปันผล | `references/dividend-template.md` |
| `emergency-fund` | เงินสำรองฉุกเฉินควรมีเท่าไร เก็บที่ไหน คุ้มครองเงินฝาก | — |
| `insurance-review` | เช็กว่าประกันชีวิต สุขภาพ โรคร้าย อุบัติเหตุ พอไหม และร้องเรียน คปภ. | — |
| `mutual-fund-picker` | เลือกกองทุนรวมไทย อ่าน factsheet เลือก RMF หรือ ThaiESG ตั้ง DCA | — |
| `news-impact` | ข่าวไหนสำคัญกับหุ้นที่ถืออยู่วันนี้ กรองตาม watchlist | — |
| `paper-trading` | ทดสอบกลยุทธ์หรือฝึกส่งคำสั่งด้วยเงินจำลอง ตามกติกาตลาดหลักทรัพย์จริง | `references/paper-ledger.md` |
| `personal-budget` | ทำงบรายเดือนจากรายจ่ายจริง | `references/budget-worksheet.md` |
| `portfolio-snapshot` | พอร์ตเป็นอย่างไร กำไรหรือขาดทุนเท่าไร | `references/snapshot-template.md` |
| `position-sizing` | ก่อนเข้าเทรด: ซื้อกี่หุ้น วาง stop ตรงไหน ใหญ่เกินไหม | `references/forex-cfd-crypto.md` |
| `post-trade-review` | ทบทวนผลเทรดรายสัปดาห์หรือรายเดือน: อัตราชนะ · ค่าคาดหวัง · drawdown · กฎใหม่ 1 ข้อ | — |
| `retirement-plan` | เกษียณในไทยต้องมีเงินเท่าไร และใช้ PVD · RMF · ThaiESG อย่างไร | — |
| `scam-check` | เช็กก่อนโอนเงินให้แอปลงทุน แอปกู้ กลุ่ม LINE หรือคนที่โทรมา | `references/red-flags-and-evidence.md` |
| `superuser` | ทีมผู้ช่วยหลายขั้น: หัวหน้าทีมเลือก playbook แจกงาน ตรวจ แล้วรายงาน | `references/brief-template.md` · `references/context-template.md` · `references/evidence.md` · `references/examples.md` · `references/lead-playbook.md` · `references/learning-loop.md` · `references/playbook-learn-from-session.md` · `references/playbook-money-plan.md` · `references/playbook-portfolio-check.md` · `references/playbook-pre-trade.md` · `references/playbook-review.md` · `references/playbook-scam-check.md` · `references/playbook-tax-season.md` · `references/playbook-team-project.md` · `references/playbook-template.md` · `references/playbook-trade-review.md` · `references/playbook-unattended-run.md` · `references/team-files.md` · `references/team-roles.md` · `references/triggers.md` · `references/voting.md` · `templates/TEAM.md` · `templates/config.json` · `templates/improvements-queue.md` |
| `tax-basics-th` | ภาษีจากหุ้น ปันผล ดอกเบี้ย คริปโต และเงินได้ต่างประเทศ (ภ.ง.ด.90 · 91) | `references/investment-income-rules.md` |
| `tax-deduction-planner` | วางแผนลดหย่อนภาษีก่อนสิ้นปี ซื้อ RMF หรือ ThaiESG เท่าไร | `references/deductions-2569.md` |
| `technical-signals` | กราฟบอกอะไร ตอนนี้เข้าได้ไหม RSI · MACD · volume หมายถึงอะไร | — |
| `trade-journal` | จดเหตุผลทุกครั้งที่เข้าหรือออกเทรด | `references/journal-template.md` |
| `watchlist-setup` | ตั้งหรือจัด watchlist ใหม่: เหตุผลที่ติดตาม · จุดเข้า · แจ้งเตือน | `references/watchlist-template.md` |

### คำสั่ง (7) — พิมพ์ `/trading-finance:<ชื่อ>`

| โฟลเดอร์ใน `skills/` | ใช้ทำอะไร | ไฟล์ในโฟลเดอร์ (นอกจาก SKILL.md) |
|---|---|---|
| `alert-set` | ตั้งแจ้งเตือนราคาหรือข่าวของหุ้นที่ติดตาม พร้อมช่วงพัก | — |
| `journal` | จดการเข้าหรือออกเทรดลงสมุดเทรด หรืออ่านรายการล่าสุด | — |
| `paper-trade` | จดหรือทบทวนการเทรดด้วยเงินจำลอง แล้วสรุปสถิติรายเดือน | — |
| `portfolio` | ภาพรวมพอร์ต: สัดส่วน · กำไรขาดทุน · ตัวที่กระจุก · ตัวที่พาพอร์ต | — |
| `review-week` | ทบทวนเทรดรายสัปดาห์หรือรายเดือน หาความผิดที่ซ้ำ ตั้งกฎใหม่ 1 ข้อ | — |
| `tax-plan` | วางแผนลดหย่อนสิ้นปี ภาษีก่อนและหลัง และวงเงิน RMF ThaiESG ที่เหลือ | — |
| `watch` | เพิ่ม ทบทวน หรือล้าง watchlist (เหตุผล · โซนเข้า · แจ้งเตือน) | — |

### playbook (10) — `skills/superuser/references/`

| ไฟล์ | ทำอะไร | ขั้น |
|---|---|---|
| `playbook-learn-from-session.md` | เรียนรู้จากงานที่ผ่านมา | 7 |
| `playbook-money-plan.md` | วางแผนการเงินส่วนตัว | 5 |
| `playbook-portfolio-check.md` | เช็กพอร์ตลงทุน | 5 |
| `playbook-pre-trade.md` | เตรียมก่อนเทรด | 6 |
| `playbook-review.md` | ตรวจงานก่อนส่ง | 6 |
| `playbook-scam-check.md` | เช็กว่าโดนหลอกไหม | 4 |
| `playbook-tax-season.md` | ภาษีประจำปี | 5 |
| `playbook-team-project.md` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม | 9 |
| `playbook-trade-review.md` | ทบทวนการเทรด | 5 |
| `playbook-unattended-run.md` | ให้ทำงานยาวเอง | 7 |
