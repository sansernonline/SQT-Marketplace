// plan-task.mjs — งานวางแผนของขั้น `plan`: spec สั้น + คำสั่ง + ตัวให้คะแนนด้วย checklist ที่เครื่องตรวจได้ (ไม่ใช้ผู้ตัดสิน)

const SPEC = `สร้างเครื่องมือบรรทัดคำสั่ง Python ชื่อ \`stock-alert\` ให้ร้านค้า
- อ่านไฟล์ CSV สต็อก (คอลัมน์ sku, name, qty)
- เทียบกับเกณฑ์สต็อกต่ำที่ตั้งค่าได้ (ค่าเริ่ม 5 ชิ้น)
- พิมพ์รายงานข้อความ เฉพาะรายการที่ต่ำกว่าเกณฑ์ เรียงจากน้อยไปมาก
- แถวเสียให้ข้าม แล้วนับจำนวนที่ข้ามไว้ท้ายรายงาน
- ใช้เฉพาะไลบรารีมาตรฐาน · ต้องมี test และ README บอกวิธีรัน`;

export const PLAN_PROMPT = `วางแผนแตกงานจาก spec นี้ ตอบเป็นข้อความอย่างเดียว ห้ามเขียนโค้ด ห้ามแก้ไฟล์

${SPEC}

รูปแบบที่ต้องตอบ: 3–6 ขั้น ทุกขั้นขึ้นต้นบรรทัดด้วย \`## ขั้น N: ชื่อขั้น\` แล้วมี 2 บรรทัด
ไฟล์: <path ของไฟล์ที่ขั้นนี้สร้างหรือแก้>
เสร็จเมื่อ: <สิ่งที่ตรวจได้ว่าขั้นนี้เสร็จ>
ไม่ต้องมีส่วนอื่น ยาวรวมไม่เกิน 60 บรรทัด`;

const REQUIRED = [/csv/i, /เกณฑ์|threshold/i, /รายงาน|report/i, /test|ทดสอบ/i, /readme/i];
const POINTS = 2; // 5 ข้อ × 2 = เต็ม 10

/** คืน { score, checks } · score เต็ม 10 */
export function scorePlan(text) {
  const steps = text.split(/^(?=##\s*ขั้น\s*\d+)/m).filter((b) => /^##\s*ขั้น/.test(b));
  const every = (re) => steps.length > 0 && steps.every((b) => re.test(b));
  const covered = REQUIRED.filter((re) => re.test(text)).length;
  const checks = [
    { name: "3–6 ขั้น", points: steps.length >= 3 && steps.length <= 6 ? POINTS : 0 },
    { name: "ทุกขั้นมี เสร็จเมื่อ", points: every(/เสร็จเมื่อ\s*[:：]\s*\S.{9,}/) ? POINTS : 0 },
    { name: "ทุกขั้นระบุไฟล์", points: every(/ไฟล์\s*[:：].*[\w-]+\.\w{1,5}/) ? POINTS : 0 },
    { name: "ครอบคลุม csv · เกณฑ์ · รายงาน · test · README", points: covered === REQUIRED.length ? POINTS : covered === REQUIRED.length - 1 ? 1 : 0 },
    { name: "ไม่เกิน 60 บรรทัด", points: text.trim().split("\n").length <= 60 ? POINTS : 0 },
  ];
  return { score: checks.reduce((s, c) => s + c.points, 0), checks };
}

// ---- plan-hard: spec ที่มีลำดับพึ่งพากันและต้องมีทางถอย · ตัวให้คะแนนตรวจลำดับ ไม่ใช่แค่หัวข้อ ----
const SPEC_HARD = `ย้ายตาราง \`orders\` ของร้านออนไลน์จาก SQLite ไปฐานข้อมูลตัวใหม่ โดยร้านต้องไม่ปิดรับออเดอร์
- ตอนนี้ทุกที่ในแอปเขียนและอ่านตรงจาก SQLite (\`db/orders.py\`)
- ระหว่างย้ายต้องมีช่วงเขียนลงฐานเก่าและใหม่พร้อมกัน แล้วคัดลอกข้อมูลเก่าไปฐานใหม่ (รันซ้ำแล้วไม่เบิ้ล)
- ก่อนสลับไปอ่านจากฐานใหม่ ต้องเทียบจำนวนแถวและยอดรวมของสองฐานให้ตรงก่อน
- ถ้าหลังสลับเจอปัญหา ต้องถอยกลับไปอ่านฐานเก่าได้ภายใน 5 นาทีโดยไม่เสียออเดอร์
- ต้องมี test และเอกสารขั้นตอนสำหรับคนเฝ้าระบบ`;

export const PLAN_HARD_PROMPT = `วางแผนแตกงานจาก spec นี้ ตอบเป็นข้อความอย่างเดียว ห้ามเขียนโค้ด ห้ามแก้ไฟล์

${SPEC_HARD}

รูปแบบที่ต้องตอบ: 4–6 ขั้น ทุกขั้นขึ้นต้นบรรทัดด้วย \`## ขั้น N: ชื่อขั้น\` แล้วมี 3 บรรทัด
ไฟล์: <path ของไฟล์ที่ขั้นนี้สร้างหรือแก้>
ขึ้นกับ: <เลขขั้นก่อนหน้าที่ต้องเสร็จก่อน เช่น ขั้น 1 · ขั้นแรกเขียนว่า ไม่มี>
เสร็จเมื่อ: <คำสั่งที่รันตรวจได้ใส่ในเครื่องหมาย \`...\` พร้อมผลที่ต้องได้>
ไม่ต้องมีส่วนอื่น ยาวรวมไม่เกิน 60 บรรทัด`;

const HARD_REQUIRED = [/เขียนคู่|เขียนพร้อมกัน|dual.?write/i, /คัดลอก|backfill|ย้ายข้อมูล/i, /เทียบ|verify/i, /สลับ|cutover/i, /ถอย|rollback|ย้อนกลับ/i];

/** คืน { score, checks } · score เต็ม 10 · ทุกข้อตรวจด้วย regex และลำดับของขั้น */
export function scorePlanHard(text) {
  const steps = text.split(/^(?=##\s*ขั้น\s*\d+)/m).filter((b) => /^##\s*ขั้น/.test(b));
  const every = (re) => steps.length > 0 && steps.every((b) => re.test(b));
  const num = (b) => Number(/^##\s*ขั้น\s*(\d+)/.exec(b)?.[1]);
  const dependsOk = steps.length > 0 && steps.every((b, i) => {
    const m = /ขึ้นกับ\s*[:：]\s*(.*)/.exec(b);
    if (!m) return false;
    const refs = [...m[1].matchAll(/ขั้น\s*(\d+)/g)].map((x) => Number(x[1]));
    return i === 0 ? refs.length === 0 : refs.length > 0 && refs.every((r) => r < num(b));
  });
  const at = (re) => steps.findIndex((b) => re.test(b.split("\n")[0]));
  const verifyAt = at(/เทียบ|verify|ตรวจ/i), cutAt = at(/สลับ|cutover/i), rollAt = at(/ถอย|rollback|ย้อนกลับ/i);
  const covered = HARD_REQUIRED.filter((re) => re.test(text)).length;
  const checks = [
    { name: "4–6 ขั้น", points: steps.length >= 4 && steps.length <= 6 ? POINTS : 0 },
    { name: "ทุกขั้นมี ไฟล์ และ เสร็จเมื่อ ที่เป็นคำสั่งใน `...`", points: every(/ไฟล์\s*[:：].*[\w-]+\.\w{1,5}/) && every(/เสร็จเมื่อ\s*[:：].*`[^`]{3,}`/) ? POINTS : 0 },
    { name: "ขึ้นกับ ชี้เฉพาะขั้นก่อนหน้า", points: dependsOk ? POINTS : 0 },
    { name: "ครอบคลุม เขียนคู่ · คัดลอก · เทียบ · สลับ · ถอย", points: covered === HARD_REQUIRED.length ? POINTS : covered === HARD_REQUIRED.length - 1 ? 1 : 0 },
    { name: "ลำดับ: เทียบก่อนสลับ และเตรียมทางถอยก่อนหรือพร้อมสลับ", points: verifyAt >= 0 && cutAt >= 0 && rollAt >= 0 && verifyAt < cutAt && rollAt <= cutAt && text.trim().split("\n").length <= 60 ? POINTS : 0 },
  ];
  return { score: checks.reduce((s, c) => s + c.points, 0), checks };
}

const GOOD_HARD = [
  ["เขียนคู่ลงสองฐาน", "db/orders.py", "ไม่มี", "`pytest tests/test_dual_write.py` ผ่าน ออเดอร์ใหม่อยู่ทั้งสองฐาน"],
  ["คัดลอกข้อมูลเก่า", "scripts/backfill.py", "ขั้น 1", "`python scripts/backfill.py` รัน 2 รอบแล้วจำนวนแถวเท่ากัน"],
  ["เตรียมทางถอย", "db/orders.py · docs/runbook.md", "ขั้น 1", "`pytest tests/test_rollback.py` ผ่าน สลับกลับฐานเก่าไม่เสียออเดอร์"],
  ["เทียบสองฐาน", "scripts/compare.py", "ขั้น 2", "`python scripts/compare.py` พิมพ์ จำนวนแถวและยอดรวมตรงกัน"],
  ["สลับไปอ่านฐานใหม่", "config/settings.py", "ขั้น 3 · ขั้น 4", "`pytest tests/test_cutover.py` ผ่าน"],
].map(([name, file, dep, done], i) => `## ขั้น ${i + 1}: ${name}\nไฟล์: ${file}\nขึ้นกับ: ${dep}\nเสร็จเมื่อ: ${done}`).join("\n\n");

const GOOD = [
  ["อ่าน CSV", "stock_alert/reader.py", "อ่านไฟล์ csv ได้ และนับแถวเสียที่ข้ามไว้"],
  ["เทียบเกณฑ์", "stock_alert/rules.py", "คืนรายการต่ำกว่าเกณฑ์ที่ตั้งค่าได้ เรียงจากน้อยไปมาก"],
  ["รายงานและคำสั่ง", "stock_alert/cli.py", "รันคำสั่งแล้วพิมพ์รายงานพร้อมจำนวนแถวที่ข้าม"],
  ["test และ README", "tests/test_rules.py · README.md", "pytest ผ่านและ README บอกวิธีรัน"],
].map(([name, file, done], i) => `## ขั้น ${i + 1}: ${name}\nไฟล์: ${file}\nเสร็จเมื่อ: ${done}`).join("\n\n");

/** ตรวจตัวให้คะแนนเอง: แผนที่ดีต้องได้เต็ม · ตอบลอย ๆ ไม่ตามแบบต้องได้ต่ำ */
export function selfTest() {
  const good = scorePlan(GOOD).score, bad = scorePlan("ทำ reader แล้วทำรายงาน ค่อยเขียน test").score;
  const goodHard = scorePlanHard(GOOD_HARD).score, badHard = scorePlanHard(GOOD).score, badHard2 = scorePlanHard(GOOD_HARD.replace("ขั้น 3 · ขั้น 4", "ขั้น 6")).score;
  const out = good === 10 && bad <= 2 ? [] : [`ตัวให้คะแนนแผน: แผนดีได้ ${good} (ต้อง 10) · แผนเสียได้ ${bad} (ต้อง ≤ 2)`];
  if (!(goodHard === 10 && badHard <= 4 && badHard2 <= 8)) out.push(`ตัวให้คะแนน plan-hard: แผนดีได้ ${goodHard} (ต้อง 10) · แผนง่ายได้ ${badHard} (ต้อง ≤ 4) · แผนที่ขึ้นกับขั้นข้างหน้าได้ ${badHard2} (ต้อง ≤ 8)`);
  return out;
}
