// ตรวจค่าตั้งแต่รับเข้า · ค่าผิดต้องหยุดพร้อมบอกชื่อช่อง ไม่ปล่อยให้คิดต่อเป็น NaN แล้วพิมพ์ "ผล:" ที่ผิด
export function num(value, label, { min = -Infinity, above } = {}) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} ต้องเป็นตัวเลข (ได้ ${JSON.stringify(value)})`);
  if (above !== undefined && !(value > above)) throw new Error(`${label} ต้องมากกว่า ${above} (ได้ ${value})`);
  if (value < min) throw new Error(`${label} ต้องไม่ต่ำกว่า ${min} (ได้ ${value})`);
  return value;
}

export function oneOf(value, allowed, label) {
  if (!allowed.includes(value)) throw new Error(`${label} ต้องเป็น ${allowed.join(" หรือ ")} (ได้ ${JSON.stringify(value)})`);
  return value;
}

export function list(value, label) {
  if (!Array.isArray(value) || !value.length) throw new Error(`${label} ต้องเป็นรายการที่มีอย่างน้อย 1 ค่า`);
  value.forEach((x, i) => { if (x === null || x === undefined) throw new Error(`${label}[${i}] ว่าง`); });
  return value;
}

// ชื่อซ้ำทำให้ผลชี้ผิดตัว (ติ๊กเลือกทั้ง 2 ชิ้น) · รับได้ทั้งรายการชื่อและรายการอ็อบเจกต์ที่มี name
export function unique(items, label = "ชื่อ") {
  const names = items.map((x) => (typeof x === "object" ? x.name : x));
  const dup = names.find((n, i) => names.indexOf(n) !== i);
  if (dup !== undefined) throw new Error(`${label}ซ้ำ: ${dup}`);
  return items;
}
