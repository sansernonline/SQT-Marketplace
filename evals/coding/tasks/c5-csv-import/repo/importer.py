"""Import the product list from a CSV file into SQLite.

Usage: python importer.py data/products.csv shop.db
"""
import csv
import sqlite3
import sys
from pathlib import Path

SCHEMA = Path(__file__).with_name("schema.sql")


def import_csv(csv_path, db_path):
    conn = sqlite3.connect(db_path)
    conn.executescript(SCHEMA.read_text(encoding="utf-8"))

    count = 0
    with open(csv_path, encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            conn.execute(
                "INSERT INTO products (sku, name, price, qty) VALUES (?, ?, ?, ?)",
                (row["sku"], row["name"], float(row["price"]), int(row["qty"])),
            )
            count += 1

    conn.commit()
    conn.close()
    return {"imported": count, "errors": []}


if __name__ == "__main__":
    result = import_csv(sys.argv[1], sys.argv[2])
    print(f"imported {result['imported']} rows, {len(result['errors'])} errors")
    for error in result["errors"]:
        print(f"  line {error['line']}: {error['reason']}")
