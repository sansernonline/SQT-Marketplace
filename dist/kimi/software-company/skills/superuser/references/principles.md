# ดัชนี principle

จะใช้ข้อไหน ให้เปิด SKILL.md ของข้อนั้นอ่านทั้งไฟล์ก่อน

**ความปลอดภัย**
- [`principle-secure-by-default`](../../principle-secure-by-default/SKILL.md) — ใช้กับทุก diff และเข้มขึ้นเมื่อแตะ input login ไฟล์ เงิน ข้อมูลส่วนบุคคล
- [`security-gate`](../../security-gate/SKILL.md) — สแกนค่าลับ · dependency · โค้ด ก่อนส่งงานทุกครั้ง

**ออกแบบ**
- [`principle-data-shape-first`](../../principle-data-shape-first/SKILL.md) — กำหนด type และรูปข้อมูลก่อน ตรวจข้อมูลตอนเข้าระบบ แล้วข้างในก็เชื่อได้
- [`principle-replace-then-delete`](../../principle-replace-then-delete/SKILL.md) — ย้ายทุกจุดที่เรียกใช้ไปของใหม่ แล้วลบของเก่าในรอบเดียว ไม่เหลือชั้นรองรับของเก่า
- [`principle-user-experience-first`](../../principle-user-experience-first/SKILL.md) — ทำน้อยแต่เสร็จจริง และความสะดวกของคนสร้างไม่ใช่เหตุผลในการเลือก

**พิสูจน์**
- [`principle-prove-it-works`](../../principle-prove-it-works/SKILL.md) — ก่อนบอกว่าเสร็จ ตรวจกับของจริง ไม่ใช่ "compile ผ่าน"
- [`principle-fix-root-cause`](../../principle-fix-root-cause/SKILL.md) — ตอนแก้บั๊ก ทำให้เกิดซ้ำก่อน แล้วแก้ที่ต้นเหตุ ใช้คู่กับ `targeted-fix`
- [`principle-small-verifiable-steps`](../../principle-small-verifiable-steps/SKILL.md) — ตัดเป็นชิ้นเล็ก ตรวจผ่านทีละชิ้นก่อนไปต่อ
- [`principle-safe-to-rerun`](../../principle-safe-to-rerun/SKILL.md) — รันซ้ำหรือหยุดกลางทางแล้วรันใหม่ ผลเหมือนเดิม
- [`blast-radius`](../../blast-radius/SKILL.md) — ถ้าแก้ของที่ใช้ร่วม ให้หาทุกจุดที่กระทบ แล้วพิสูจน์จุดที่เสี่ยงสุด

**ความเรียบง่าย**
- `lazy-coding` — โค้ดน้อยที่สุดที่ใช้ได้จริง
- `simplicity-first` — เอกสาร · ดีไซน์ · แผน ที่ง่ายที่สุดแต่ใช้ได้
- `readable-code` — คนใหม่อ่านแล้วตามทัน

**การทำงาน**
- [`principle-proceed-on-reversible-work`](../../principle-proceed-on-reversible-work/SKILL.md) — งานที่ย้อนได้ให้ทำเลย ส่วนงานที่ย้อนไม่ได้ให้เตรียมไว้ใน "รออนุมัติ" แล้วทำส่วนอื่นต่อ
- [`principle-build-a-tool-not-handwork`](../../principle-build-a-tool-not-handwork/SKILL.md) — งานซ้ำ ๆ แบบกลไกให้ทำเป็นสคริปต์ที่รันซ้ำได้
- [`repeated-mistakes-to-checks`](../../repeated-mistakes-to-checks/SKILL.md) — กฎที่ต้องพูดซ้ำให้ทำเป็นการตรวจอัตโนมัติ
- `context-budget` — งานใหญ่ให้ส่ง subagent ทำ แล้วเก็บแค่สรุปไว้ในบทสนทนาหลัก
