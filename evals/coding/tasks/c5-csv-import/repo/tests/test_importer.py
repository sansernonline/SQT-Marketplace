import sqlite3

from importer import import_csv


def test_imports_simple_file(tmp_path):
    csv_file = tmp_path / "products.csv"
    csv_file.write_bytes(b"sku,name,price,qty\r\nA001,Pen,12.5,10\r\nA002,Ruler,20,3\r\n")
    db = tmp_path / "shop.db"

    import_csv(csv_file, db)

    with sqlite3.connect(db) as conn:
        rows = conn.execute("SELECT sku, name, price, qty FROM products ORDER BY sku").fetchall()
    assert rows == [("A001", "Pen", 12.5, 10), ("A002", "Ruler", 20.0, 3)]
