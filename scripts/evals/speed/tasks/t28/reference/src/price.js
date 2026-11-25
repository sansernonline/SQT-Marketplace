// ราคาสุดท้ายของสินค้า 1 ชิ้น
export function finalPrice(base, discountPct = 0, opts = {}) {
  let p = base * (1 - discountPct / 100);
  if (opts.vat) p = p * 1.07;
  return Math.round((p + Number.EPSILON) * 100) / 100;
}
