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

const GOOD = [
  ["อ่าน CSV", "stock_alert/reader.py", "อ่านไฟล์ csv ได้ และนับแถวเสียที่ข้ามไว้"],
  ["เทียบเกณฑ์", "stock_alert/rules.py", "คืนรายการต่ำกว่าเกณฑ์ที่ตั้งค่าได้ เรียงจากน้อยไปมาก"],
  ["รายงานและคำสั่ง", "stock_alert/cli.py", "รันคำสั่งแล้วพิมพ์รายงานพร้อมจำนวนแถวที่ข้าม"],
  ["test และ README", "tests/test_rules.py · README.md", "pytest ผ่านและ README บอกวิธีรัน"],
].map(([name, file, done], i) => `## ขั้น ${i + 1}: ${name}\nไฟล์: ${file}\nเสร็จเมื่อ: ${done}`).join("\n\n");

/** ตรวจตัวให้คะแนนเอง: แผนที่ดีต้องได้เต็ม · ตอบลอย ๆ ไม่ตามแบบต้องได้ต่ำ */
export function selfTest() {
  const good = scorePlan(GOOD).score, bad = scorePlan("ทำ reader แล้วทำรายงาน ค่อยเขียน test").score;
  return good === 10 && bad <= 2 ? [] : [`ตัวให้คะแนนแผน: แผนดีได้ ${good} (ต้อง 10) · แผนเสียได้ ${bad} (ต้อง ≤ 2)`];
}
