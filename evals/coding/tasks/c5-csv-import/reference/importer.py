"""Import the product list from a CSV file into SQLite.

The file comes from the shop's Windows program, so it is encoded Windows-874 (cp874).
Safe to rerun: a row is keyed by sku, so a second run updates rows instead of adding copies.

Usage: python importer.py data/products.csv shop.db
"""
import csv
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

SCHEMA = Path(__file__).with_name("schema.sql")
ENCODING = "cp874"
COLUMNS = ("sku", "name", "price", "qty")

UPSERT = """
INSERT INTO products (sku, name, price, qty) VALUES (?, ?, ?, ?)
ON CONFLICT (sku) DO UPDATE SET name = excluded.name, price = excluded.price, qty = excluded.qty
"""


def parse_row(row):
    """Turn one CSV row into (sku, name, price, qty). Raises ValueError if the row is bad."""
    if len(row) != len(COLUMNS):
        raise ValueError(f"expected {len(COLUMNS)} columns, got {len(row)}")
    sku, name, price, qty = (value.strip() for value in row)
    if not sku:
        raise ValueError("sku is empty")
    return sku, name, float(price), int(qty)


def read_rows(csv_path):
    """Return (good rows, errors). Blank lines are skipped; bad rows go to errors with their line number."""
    rows, errors = [], []
    with open(csv_path, encoding=ENCODING, newline="") as f:
        reader = csv.reader(f)
        next(reader, None)  # header
        for row in reader:
            if not any(value.strip() for value in row):
                continue
            try:
                rows.append(parse_row(row))
            except ValueError as e:
                errors.append({"line": reader.line_num, "reason": str(e)})
    return rows, errors


def import_csv(csv_path, db_path):
    rows, errors = read_rows(csv_path)
    with closing(sqlite3.connect(db_path)) as conn, conn:
        conn.executescript(SCHEMA.read_text(encoding="utf-8"))
        conn.executemany(UPSERT, rows)
    return {"imported": len(rows), "errors": errors}


if __name__ == "__main__":
    result = import_csv(sys.argv[1], sys.argv[2])
    print(f"imported {result['imported']} rows, {len(result['errors'])} errors")
    for error in result["errors"]:
        print(f"  line {error['line']}: {error['reason']}")
