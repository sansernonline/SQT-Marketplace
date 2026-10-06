# skill: pdpa-workflow

Use when a Thai SME must run PDPA in practice — consent form, ROPA, data-subject requests within 30 days, breach notice to สคส. within 72 hours, vendor checks. General information, not legal advice.

# PDPA Workflow for Thai SMEs

พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 turned into paperwork a small company can actually run. General information, not legal advice — disputes, regulator letters and cross-border transfers go to a lawyer (ทนายความ) or a DPO (เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล). Works on its own; if installed, `pdpa-compliance` (software-company) covers designing systems that hold personal data.

## 1. Deadlines that matter

| Duty | Deadline | Section |
|---|---|---|
| Notify the PDPC office (สคส.) of a personal-data breach | **within 72 hours** of becoming aware, unless the breach is unlikely to risk people's rights | ม.37(4) |
| Notify affected people | without delay, when the risk is high, with remedies | ม.37(4) |
| Answer a data-subject request (access, copy, correction, deletion, objection, portability) | **within 30 days** of receiving it | ม.30 (and same practice for other rights) |
| Withdraw consent | as easy as giving it; stop processing for that purpose | ม.19 |
| Keep the record of processing (ROPA) | continuously; show the regulator on request | ม.39 |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thansettakij.com/technology/660448 · https://muic.mahidol.ac.th/th/news/siththikaarekhaathuengkh-muulswnbukhkhl-right-to-access-maatraa-30 · official text: https://www.pdpc.or.th

## 2. Lawful basis before consent

Consent is the weakest basis — it can be withdrawn. Pick the basis first (ม.24); ask for consent only when nothing else fits.

| Data use | Usual basis | Consent needed? |
|---|---|---|
| Deliver an order, payroll, employment file | contract (สัญญา) | no |
| Tax invoices, SSO, WHT records | legal obligation (หน้าที่ตามกฎหมาย) | no |
| CCTV for security | legitimate interest (ประโยชน์โดยชอบด้วยกฎหมาย) + sign at entrance | no |
| Marketing broadcasts, newsletters | consent | **yes**, separate tick, not pre-ticked |
| Health data (sick certificates), religion, biometrics (face scan time clock), criminal records | sensitive data — ม.26 | **explicit consent** unless a ม.26 exception applies (e.g. employment law duties, รอยืนยัน case by case) |
| Children under 10 | consent of the parent | yes |

## 3. Workflows

### A. Inventory and ROPA (once, then review yearly)
1. List every collection point: website forms, LINE OA, POS, CCTV, HR files, job applications, delivery labels.
2. For each: data items, purpose, basis, who can access, where stored, vendors, retention, deletion method.
3. Write it into the ROPA template ([references/pdpa-templates.md](references/pdpa-templates.md)).
4. Small businesses may be partly exempt from keeping a ROPA under a PDPC announcement — not if they handle sensitive data or high-risk processing (รอยืนยัน the current conditions); keeping one anyway is cheap.

### B. Privacy notice and consent
1. Privacy notice (ประกาศความเป็นส่วนตัว) at every collection point — what, why, basis, retention, rights, contact.
2. Consent form only for consent-based purposes, one tick per purpose, version and timestamp stored.
3. Withdrawal channel (LINE keyword, email) that works the same day.

### C. Data-subject request (DSR)
1. Log the request (day 0), verify identity (ID card copy redacted, or match account details).
2. Find the data across systems (ROPA tells you where).
3. Decide: fulfil, partly, or refuse with the legal ground (e.g. law requires keeping tax records).
4. Reply in writing **by day 30**; record what was done.

### D. Breach response (clock starts when you become aware)
| Hour | Action |
|---|---|
| 0–4 | contain (reset passwords, revoke links, isolate device); start the incident log |
| 4–24 | scope: what data, how many people, sensitive?, likely harm |
| 24–48 | decide: risk to rights? → notify สคส.; high risk? → notify people too |
| ≤ 72 | file the notification with สคส. (online at pdpc.or.th, รอยืนยัน the current channel); if late, file anyway and explain the delay |
| after | fix root cause; update ROPA and vendor terms |

Even breaches you decide not to report go in the incident log with the reason.

### E. Vendor check (before sharing data)
What data, why, where stored (country), sub-processors, security measures, breach history, a data processing agreement (ข้อตกลงการประมวลผลข้อมูล) with breach-notice duty to you within 24–48 hours.

## Worked example

A clinic's LINE OA admin sends a patient list (120 names + phone + diagnosis) to the wrong group at 10:00 Monday.
Health data = sensitive → high risk. Contain: delete message, ask group to delete, log at 10:15. Notify สคส. by **10:00 Thursday**; notify the 120 patients without delay with what happened and a contact. Root cause: admin rights for too many staff → reduce, add a two-person check for files.

## Rules

- Collect the minimum; delete on schedule — data you do not hold cannot leak.
- Do not copy national ID cards unless a law requires it; if needed, write the purpose on the copy.
- Penalties include administrative fines up to millions of baht and criminal penalties for some offences (ม.79–90) — treat deadlines as real.

## Related

`line-chatbot` (chat logs) · `doc-leave` (health certificates) · `payroll-th` · `doc-contract-th` (data clauses) · if installed: `pdpa-compliance`, `audit-trail` (software-company).


## reference: pdpa-templates.md

# PDPA templates

Contents: 1. ROPA · 2. Consent form · 3. DSR log and reply · 4. Breach log and notice to data subjects

## 1. ROPA (บันทึกรายการกิจกรรมการประมวลผล, ม.39)

| # | กิจกรรม | ข้อมูลที่เก็บ | ข้อมูลอ่อนไหว? | วัตถุประสงค์ | ฐานทางกฎหมาย (ม.24/26) | แหล่งที่มา | ผู้เข้าถึง | ส่งต่อให้ (ผู้ประมวลผล/ประเทศ) | ที่จัดเก็บ | ระยะเวลาเก็บ | วิธีลบ/ทำลาย | มาตรการความปลอดภัย |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | เงินเดือน | ชื่อ เลขบัตร บัญชีธนาคาร | ไม่ | จ่ายค่าจ้าง ภาษี ประกันสังคม | สัญญา + หน้าที่ตามกฎหมาย | พนักงาน | HR, บัญชี | ธนาคาร, สรรพากร, สปส. | ระบบเงินเดือน | 10 ปีหลังพ้นสภาพ (รอยืนยัน) | ลบในระบบ, ทำลายกระดาษ | สิทธิ์เฉพาะ HR |
| 2 | LINE OA ลูกค้า | ชื่อ LINE เบอร์ ที่อยู่จัดส่ง ประวัติแชท | ไม่ | ขายและจัดส่ง | สัญญา | ลูกค้า | ฝ่ายขาย | ผู้ให้บริการขนส่ง | LINE, ชีตคำสั่งซื้อ | 1 ปีหลังคำสั่งซื้อล่าสุด | ลบแถว | 2FA |
| 3 | กล้องวงจรปิด | ภาพบุคคล | ไม่ | ความปลอดภัย | ประโยชน์โดยชอบด้วยกฎหมาย | ผู้มาติดต่อ | รปภ., ผู้จัดการ | — | NVR | 30 วัน วนทับ | วนทับอัตโนมัติ | ห้องล็อก |

Plus header: ชื่อผู้ควบคุมข้อมูล, ที่อยู่, ผู้ติดต่อ/DPO, วันที่ปรับปรุงล่าสุด.

## 2. Consent form (หนังสือให้ความยินยอม)

```
หนังสือให้ความยินยอมในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล   ฉบับที่ {v1.2} วันที่ {…}

{ชื่อบริษัท} ("บริษัท") ขอความยินยอมจากท่านสำหรับวัตถุประสงค์ต่อไปนี้ ท่านเลือกให้หรือไม่ให้ความยินยอมแต่ละข้อได้
และการไม่ให้ความยินยอมไม่มีผลต่อการซื้อสินค้า/บริการของท่าน

[ ] ยินยอม [ ] ไม่ยินยอม  ส่งข่าวสารและโปรโมชันทาง {LINE/อีเมล/SMS}
[ ] ยินยอม [ ] ไม่ยินยอม  {วัตถุประสงค์อื่น เช่น ใช้ภาพถ่ายในสื่อประชาสัมพันธ์}

ข้อมูลที่ใช้: {…}   ระยะเวลาเก็บ: {…}
ท่านถอนความยินยอมได้ทุกเมื่อที่ {ช่องทาง} โดยง่ายเท่ากับการให้ความยินยอม
รายละเอียดเพิ่มเติม: ประกาศความเป็นส่วนตัว {ลิงก์}   ติดต่อ: {อีเมล/โทร}

ลงชื่อ ……………… ({ชื่อ})  วันที่ ………
```

Store: who, which version, which ticks, when, channel. Never pre-tick, never bundle with terms of sale.

## 3. DSR log and reply

| เลขที่ | วันที่รับ (วันที่ 0) | ครบกำหนด (+30 วัน) | ผู้ขอ | ประเภทสิทธิ | ยืนยันตัวตนโดย | ผลการดำเนินการ | เหตุผลถ้าปฏิเสธ | วันที่ตอบ |
|---|---|---|---|---|---|---|---|---|

Reply: "บริษัทได้รับคำขอ {ประเภท} ของท่านเมื่อวันที่ {…} และได้ดำเนินการ {…} แล้วเมื่อวันที่ {…} / ไม่สามารถดำเนินการได้ในส่วน {…} เนื่องจาก {เหตุตามกฎหมาย} ท่านมีสิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล"

## 4. Breach log and notice

Log fields: วันเวลาที่ทราบ · ผู้พบ · ลักษณะเหตุ · ข้อมูลที่กระทบ · จำนวนคน · ข้อมูลอ่อนไหว? · การระงับเหตุ · ประเมินความเสี่ยง (ต่ำ/มี/สูง) · แจ้ง สคส. (วันเวลา, เลขอ้างอิง) · แจ้งเจ้าของข้อมูล (วันเวลา, ช่องทาง) · การแก้ไขต้นเหตุ.

Notice to people: "เมื่อวันที่ {…} บริษัทพบเหตุ {…} ซึ่งอาจกระทบข้อมูล {…} ของท่าน บริษัทได้ {มาตรการ} แล้ว ขอแนะนำให้ท่าน {เปลี่ยนรหัสผ่าน/ระวังข้อความหลอกลวง} สอบถามได้ที่ {…}" — if scam calls are a risk, add the anti-online-scam hotline **1441** (AOC, 24 hours).
