"""สร้างฐานข้อมูลตัวอย่าง ข้อมูลเหมือนเดิมทุกครั้งเมื่อใช้ seed เดิม

ใช้: python make_db.py sales.db 1000000
"""
import random
import sys

from db import apply_migrations, connect, create_schema

BRANCH_COUNT = 300
FIRST_YEAR, LAST_YEAR = 2022, 2025
NOTES = [None] * 8 + ["ลูกค้าขอใบกำกับภาษีเต็มรูป", "ชำระผ่านพร้อมเพย์", "สมาชิกใช้แต้มสะสม"]


def branch_rows():
    return [(b, "BR%03d" % b, "สาขา %03d" % b) for b in range(1, BRANCH_COUNT + 1)]


def sale_rows(count, seed):
    rnd = random.Random(seed)
    for i in range(1, count + 1):
        sold_at = "%04d-%02d-%02d %02d:%02d:%02d" % (
            rnd.randint(FIRST_YEAR, LAST_YEAR), rnd.randint(1, 12), rnd.randint(1, 28),
            rnd.randint(0, 23), rnd.randint(0, 59), rnd.randint(0, 59))
        status = "void" if rnd.random() < 0.05 else "paid"
        yield (i, "BR%03d" % rnd.randint(1, BRANCH_COUNT), sold_at,
               rnd.randint(2000, 500000), status, rnd.choice(NOTES))


def build(path, rows, seed=42, migrate=True):
    """สร้างไฟล์ฐานข้อมูลที่ path มียอดขาย rows แถว คืน connection ที่เปิดอยู่"""
    conn = connect(path)
    create_schema(conn)
    with conn:
        conn.executemany("INSERT INTO branches (id, code, name) VALUES (?, ?, ?)", branch_rows())
        conn.executemany(
            "INSERT INTO sales (id, branch_code, sold_at, amount_satang, status, note)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            sale_rows(rows, seed))
    if migrate:
        apply_migrations(conn)
    return conn


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "sales.db"
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 1_000_000
    build(out, n).close()
    print("สร้าง %s แล้ว %d แถว" % (out, n))
