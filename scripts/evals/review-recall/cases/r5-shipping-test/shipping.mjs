// ค่าส่งของร้านตลาดดีมาร์ท (บาท)
export const FREE_SHIPPING_MIN = 1000;

const BASE_FEE = { bangkok: 40, central: 60, remote: 90 };

/**
 * ค่าส่งจากยอดค่าสินค้าหลังหักส่วนลด และพื้นที่ปลายทาง
 * @param {number} subtotal ยอดค่าสินค้า (บาท)
 * @param {"bangkok" | "central" | "remote"} zone พื้นที่ปลายทาง
 */
export function shippingFee(subtotal, zone) {
  if (!Object.hasOwn(BASE_FEE, zone)) throw new Error(`ไม่รู้จักพื้นที่ ${zone}`);
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  return BASE_FEE[zone];
}
