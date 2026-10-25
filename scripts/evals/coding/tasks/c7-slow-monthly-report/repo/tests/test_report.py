import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from make_db import build  # noqa: E402
from report import monthly_sales  # noqa: E402


def expected(conn, year):
    names = dict(conn.execute("SELECT code, name FROM branches"))
    totals = {}
    for code, sold_at, amount, status in conn.execute(
            "SELECT branch_code, sold_at, amount_satang, status FROM sales"):
        if status != "paid" or not sold_at.startswith(str(year)):
            continue
        key = (sold_at[:7], names[code])
        total, count = totals.get(key, (0, 0))
        totals[key] = (total + amount, count + 1)
    return [(m, b, t, c) for (m, b), (t, c) in sorted(totals.items())]


def test_monthly_sales_small(tmp_path):
    conn = build(tmp_path / "small.db", 10_000)
    rows = monthly_sales(conn, 2024)
    assert rows == expected(conn, 2024)
    assert rows[0][0] == "2024-01"
    conn.close()


def test_year_without_sales(tmp_path):
    conn = build(tmp_path / "small.db", 1_000)
    assert monthly_sales(conn, 2019) == []
    conn.close()
