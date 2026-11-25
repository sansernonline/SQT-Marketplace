// ราคาสุดท้ายของสินค้า 1 ชิ้น
<<<<<<< HEAD
export function finalPrice(base, discountPct = 0, opts = {}) {
  let p = base * (1 - discountPct / 100);
  if (opts.vat) p = p * 1.07;
  return p;
}
=======
export function finalPrice(base, discountPct = 0) {
  const p = base * (1 - discountPct / 100);
  return Math.round(p * 100) / 100;
}
>>>>>>> fix/rounding
