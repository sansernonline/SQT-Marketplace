// ค่าส่งตามน้ำหนัก: 1 กก. แรก 40 บาท · ทุก 1 กก. ถัดไป (เศษปัดขึ้นเป็น 1 กก.) บวก 15 บาท
export function shippingFee(weightKg) {
  const extraKg = Math.max(0, Math.floor(weightKg - 1));
  return 40 + extraKg * 15;
}
