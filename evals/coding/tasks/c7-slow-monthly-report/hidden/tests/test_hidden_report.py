"""test ที่ซ่อนไว้: รายงานรายเดือนบนข้อมูล 1,000,000 แถว"""
import json
import os
import random
import re
import shutil
import sys
import time
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from db import apply_migrations, connect, create_schema  # noqa: E402
from report import monthly_sales  # noqa: E402

ROWS = 1_000_000
BRANCHES = 300
YEAR = 2024
LIMIT_MS = 2000
# แถวที่อยู่ติดขอบปี ใช้จับการกรองช่วงวันที่ผิด
EDGE_ROWS = ["2023-12-31 23:59:59", "2024-01-01 00:00:00", "2024-12-31 23:59:59",
             "2025-01-01 00:00:00", "2024-06-30 23:59:59", "2024-07-01 00:00:00"]


def sale_rows():
    rnd = random.Random(20241)
    for i in range(1, ROWS + 1):
        sold_at = "%04d-%02d-%02d %02d:%02d:%02d" % (
            rnd.randint(2022, 2025), rnd.randint(1, 12), rnd.randint(1, 28),
            rnd.randint(0, 23), rnd.randint(0, 59), rnd.randint(0, 59))
        status = "void" if rnd.random() < 0.05 else "paid"
        yield (i, "BR%03d" % rnd.randint(1, BRANCHES), sold_at, rnd.randint(2000, 500000), status)


@pytest.fixture(scope="session")
def big_db(tmp_path_factory):
    base = tmp_path_factory.getbasetemp() / "sales_base.db"
    if not base.exists():  # สร้างครั้งเดียวต่อรอบ
        conn = connect(base)
        create_schema(conn)
        with conn:
            conn.executemany("INSERT INTO branches (id, code, name) VALUES (?, ?, ?)",
                             [(b, "BR%03d" % b, "สาขา %03d" % b) for b in range(1, BRANCHES + 1)])
            conn.executemany("INSERT INTO sales (id, branch_code, sold_at, amount_satang, status)"
                             " VALUES (?, ?, ?, ?, ?)", sale_rows())
        conn.close()
    work = tmp_path_factory.mktemp("work") / "sales.db"
    shutil.copyfile(base, work)
    conn = connect(work)
    apply_migrations(conn)
    # แถวขอบปีใส่หลัง migration = ข้อมูลใหม่ที่เข้ามาทีหลัง · ตารางสรุปที่คำนวณไว้ล่วงหน้าจะตกตรงนี้
    with conn:
        conn.executemany("INSERT INTO sales (id, branch_code, sold_at, amount_satang, status) VALUES (?, ?, ?, ?, ?)",
                         [(ROWS + j + 1, "BR%03d" % (j + 1), sold_at, 1_000_000 + j, "paid") for j, sold_at in enumerate(EDGE_ROWS)])
    yield conn
    conn.close()


def expected(conn, year):
    """คำนวณด้วย Python ล้วน ไม่พึ่ง SQL ของรายงาน"""
    names = dict(conn.execute("SELECT code, name FROM branches"))
    totals = {}
    for code, sold_at, amount, status in conn.execute(
            "SELECT branch_code, sold_at, amount_satang, status FROM sales"):
        if status == "paid" and sold_at[:4] == str(year):
            key = (sold_at[:7], names[code])
            total, count = totals.get(key, (0, 0))
            totals[key] = (total + amount, count + 1)
    return [(m, b, t, c) for (m, b), (t, c) in sorted(totals.items())]


def test_results_match_reference(big_db):
    assert monthly_sales(big_db, YEAR) == expected(big_db, YEAR)


def test_other_year_and_empty_year(big_db):
    assert monthly_sales(big_db, 2023) == expected(big_db, 2023)
    assert monthly_sales(big_db, 2030) == []


def test_report_is_fast(big_db):
    best = None
    for _ in range(3):
        t0 = time.perf_counter()
        monthly_sales(big_db, YEAR)
        ms = (time.perf_counter() - t0) * 1000
        best = ms if best is None else min(best, ms)
    out = os.environ.get("EVAL_METRICS_FILE")
    if out:
        Path(out).write_text(json.dumps({"query_ms": round(best, 1)}), encoding="utf-8")
    assert best < LIMIT_MS, "รายงานใช้เวลา %.0f ms (ต้องน้อยกว่า %d ms)" % (best, LIMIT_MS)


KEYWORDS = {"where", "join", "inner", "left", "cross", "on", "group", "order", "limit", "using",
            "natural", "union", "as", "indexed", "not"}


def sales_names(sql):
    names = {"sales"}
    for alias in re.findall(r"\bsales\b\s+(?:as\s+)?([a-z_]\w*)", sql, re.I):
        if alias.lower() not in KEYWORDS:
            names.add(alias.lower())
    return names


def test_plan_does_not_scan_whole_sales_table(big_db):
    statements = []
    big_db.set_trace_callback(statements.append)
    try:
        monthly_sales(big_db, YEAR)
    finally:
        big_db.set_trace_callback(None)
    selects = [s for s in statements if re.match(r"\s*(with|select)\b", s, re.I)]
    assert selects, "ไม่พบคำสั่ง SELECT ของรายงาน"
    for sql in selects:
        names = sales_names(sql)
        for row in big_db.execute("EXPLAIN QUERY PLAN " + sql):
            detail = row[-1]
            m = re.match(r"SCAN (?:TABLE )?(\w+)", detail)
            assert not (m and m.group(1).lower() in names), \
                "อ่านตาราง sales ทั้งตาราง: %s" % detail
