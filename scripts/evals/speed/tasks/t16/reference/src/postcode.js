const RANGES = [
  [10000, 10990, "กรุงเทพมหานคร"], [11000, 11160, "นนทบุรี"], [12000, 12190, "ปทุมธานี"],
  [50000, 50360, "เชียงใหม่"], [83000, 83150, "ภูเก็ต"], [90000, 90190, "สงขลา"],
];
export function provinceOfPostcode(code) {
  if (typeof code !== "string" || !/^\d{5}$/.test(code)) throw new Error("รหัสไปรษณีย์ต้องเป็นเลข 5 หลัก");
  const n = Number(code);
  return RANGES.find(([a, b]) => n >= a && n <= b)?.[2] ?? null;
}
