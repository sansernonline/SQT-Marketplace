// seed.mjs — สร้างตารางและข้อมูลตัวอย่าง (ข้อมูลเหมือนเดิมทุกครั้ง)
//
// ใช้: node seed.mjs <โฟลเดอร์ข้อมูล PGlite> [จำนวน order]
import { pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";

const REGIONS = {
  N: ["เชียงใหม่", "เชียงราย", "ลำปาง", "น่าน"],
  NE: ["ขอนแก่น", "นครราชสีมา", "อุดรธานี", "อุบลราชธานี"],
  C: ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "อยุธยา"],
  E: ["ชลบุรี", "ระยอง", "จันทบุรี", "ตราด"],
  W: ["กาญจนบุรี", "ราชบุรี", "ตาก"],
  S: ["ภูเก็ต", "สงขลา", "สุราษฎร์ธานี", "นครศรีธรรมราช"],
};
// จังหวัดที่ลูกค้ากรอกเองแล้วไม่ตรงตาราง หรือไม่ได้กรอก
const UNMAPPED = ["ชลบุรี ", "Bangkok", null];

export const PROVINCES = Object.values(REGIONS).flat();

export async function seed(db, orders = 1000) {
  const customers = Math.max(10, Math.ceil(orders / 10));
  const choices = [...PROVINCES, ...UNMAPPED];
  await db.exec(`
    CREATE TABLE province_regions (
      province    text PRIMARY KEY,
      region_code text NOT NULL
    );
    CREATE TABLE customers (
      id       integer PRIMARY KEY,
      name     text NOT NULL,
      province text
    );
    CREATE TABLE orders (
      id          bigint PRIMARY KEY,
      customer_id integer NOT NULL REFERENCES customers (id),
      created_at  timestamptz NOT NULL,
      total       numeric(12, 2) NOT NULL
    );
  `);
  const mapping = Object.entries(REGIONS).flatMap(([code, list]) => list.map((p) => [p, code]));
  await db.query(
    "INSERT INTO province_regions SELECT * FROM unnest($1::text[], $2::text[])",
    [mapping.map((m) => m[0]), mapping.map((m) => m[1])],
  );
  await db.query(
    `INSERT INTO customers (id, name, province)
     SELECT i, 'ลูกค้า ' || i, ($2::text[])[1 + (i * 7) % array_length($2::text[], 1)]
     FROM generate_series(1, $1::int) AS i`,
    [customers, choices],
  );
  await db.query(
    `INSERT INTO orders (id, customer_id, created_at, total)
     SELECT i, 1 + (i * 7919) % $2::int,
            timestamptz '2024-01-01 00:00+07' + (i % 525600) * interval '1 minute',
            ((i * 37) % 500000) / 100.0
     FROM generate_series(1, $1::int) AS i`,
    [orders, customers],
  );
  return { orders, customers };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [dataDir, n] = process.argv.slice(2);
  if (!dataDir) { console.error("ใช้: node seed.mjs <โฟลเดอร์ข้อมูล> [จำนวน order]"); process.exit(2); }
  const db = new PGlite(dataDir);
  const r = await seed(db, Number(n ?? 1000));
  console.log(`สร้างลูกค้า ${r.customers} ราย order ${r.orders} ใบ`);
  await db.close();
}
