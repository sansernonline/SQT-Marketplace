import sqlite3
from pathlib import Path

from importer import import_csv

HEADER = "sku,name,price,qty"


def write_csv(path, lines):
    path.write_bytes(("\r\n".join([HEADER, *lines]) + "\r\n").encode("cp874"))


def products(db):
    conn = sqlite3.connect(db)
    try:
        return conn.execute("SELECT sku, name, price, qty FROM products ORDER BY sku").fetchall()
    finally:
        conn.close()


def test_thai_text_round_trips(tmp_path):
    csv_file, db = tmp_path / "p.csv", tmp_path / "shop.db"
    write_csv(csv_file, ["P001,น้ำปลาแท้ ตราปลาหมึก,35,120", "P002,ข้าวหอมมะลิ 5 กก.,189.50,40"])

    import_csv(csv_file, db)

    assert products(db) == [
        ("P001", "น้ำปลาแท้ ตราปลาหมึก", 35.0, 120),
        ("P002", "ข้าวหอมมะลิ 5 กก.", 189.5, 40),
    ]


def test_sample_file_in_repo_imports(tmp_path):
    sample = Path(__file__).resolve().parent.parent / "data" / "products.csv"
    db = tmp_path / "shop.db"

    import_csv(sample, db)

    assert "ซอสหอยนางรม" in [row[1] for row in products(db)]


def test_running_twice_does_not_duplicate(tmp_path):
    csv_file, db = tmp_path / "p.csv", tmp_path / "shop.db"
    write_csv(csv_file, ["A001,Pen,12.5,10", "A002,Pencil,20,3", "A003,Eraser,5,99"])

    import_csv(csv_file, db)
    import_csv(csv_file, db)

    assert len(products(db)) == 3


def test_changed_row_is_updated(tmp_path):
    csv_file, db = tmp_path / "p.csv", tmp_path / "shop.db"
    write_csv(csv_file, ["A001,ปากกาน้ำเงิน,12.5,10", "A002,ไม้บรรทัด,20,3"])
    import_csv(csv_file, db)

    write_csv(csv_file, ["A001,ปากกาแดง,15,8", "A002,ไม้บรรทัด,20,3"])
    import_csv(csv_file, db)

    assert products(db) == [("A001", "ปากกาแดง", 15.0, 8), ("A002", "ไม้บรรทัด", 20.0, 3)]


def test_blank_lines_are_skipped(tmp_path):
    csv_file, db = tmp_path / "p.csv", tmp_path / "shop.db"
    write_csv(csv_file, ["A001,สมุด,30,5", "", "   ", "A002,ดินสอ,6,50", "", ""])

    result = import_csv(csv_file, db)

    assert result["errors"] == []
    assert [row[0] for row in products(db)] == ["A001", "A002"]


def test_bad_rows_are_reported_and_good_rows_still_import(tmp_path):
    csv_file, db = tmp_path / "p.csv", tmp_path / "shop.db"
    write_csv(csv_file, [
        "A001,สมุด,30,5",        # line 2
        "A002,ดินสอ,หกบาท,50",    # line 3: price is not a number
        "A003,ยางลบ,5,10",        # line 4
        "A004,กบเหลาดินสอ,25",    # line 5: missing a column
        ",ไม่มีรหัส,10,1",          # line 6: empty sku
    ])

    result = import_csv(csv_file, db)

    assert sorted(error["line"] for error in result["errors"]) == [3, 5, 6]
    assert [row[0] for row in products(db)] == ["A001", "A003"]
