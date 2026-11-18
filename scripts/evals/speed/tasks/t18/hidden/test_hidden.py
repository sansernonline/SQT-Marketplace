import csv, json, shutil, subprocess, sys, tempfile
from pathlib import Path

SCRIPT = Path("summarize.py").resolve()
REPO_DATA = Path("data").resolve()
BR = "alias,branch\nสยามสแควร์,สยามสแควร์\nSiam Square,สยามสแควร์\nAlpha,อัลฟา\nBeta,เบตา\n"


def run(old, new, branches=BR, data_dir=None):
    d = Path(tempfile.mkdtemp())
    shutil.copy(SCRIPT, d / "summarize.py")
    if data_dir:
        shutil.copytree(data_dir, d / "data")
    else:
        (d / "data").mkdir()
        (d / "data" / "old.json").write_text(json.dumps({"records": old}), encoding="utf-8")
        (d / "data" / "new.json").write_text(json.dumps(new), encoding="utf-8")
        (d / "data" / "branches.csv").write_text(branches, encoding="utf-8")
    r = subprocess.run([sys.executable, "summarize.py"], cwd=d, capture_output=True, text=True, encoding="utf-8")
    assert r.returncode == 0, r.stderr
    raw = (d / "summary.csv").read_bytes()
    assert not raw.startswith(b"\xef\xbb\xbf")
    text = raw.decode("utf-8")
    return text, list(csv.reader(text.splitlines()))


def o(b, amt, date="2026-09-01"):
    return {"branch": b, "date": date, "amount": amt}


def n(s, sat, status="ok", at="2026-10-05T09:00:00+07:00"):
    return {"store": s, "sold_at": at, "amount_satang": sat, "status": status}


def test_repo_data_expected():
    _, rows = run(None, None, data_dir=REPO_DATA)
    assert rows == [
        ["branch", "orders", "total_baht"],
        ["สยามสแควร์", "4", "3501.00"],
        ["เซ็นทรัลลาดพร้าว", "2", "2750.75"],
        ["ทองหล่อ", "2", "1700.00"],
        ["Ekkamai", "1", "100.10"],
    ]


def test_header_only_when_empty():
    text, rows = run([], [])
    assert rows == [["branch", "orders", "total_baht"]]


def test_old_amount_exact_to_satang():
    _, rows = run([o("Alpha", 19.99), o("Alpha", 0.29)], [])
    assert rows[1] == ["อัลฟา", "2", "20.28"]


def test_satang_to_baht():
    _, rows = run([], [n("Alpha", 5), n("Alpha", 100000)])
    assert rows[1] == ["อัลฟา", "2", "1000.05"]


def test_only_status_ok_counted():
    _, rows = run([], [n("Alpha", 100), n("Alpha", 900, "void"), n("Alpha", 800, "refund"), n("Alpha", 50, "OK")])
    assert rows[1] == ["อัลฟา", "1", "1.00"]


def test_old_after_cutover_dropped():
    _, rows = run([o("Alpha", 10, "2026-09-30"), o("Alpha", 99, "2026-10-01"), o("Alpha", 99, "2027-01-01")], [])
    assert rows[1] == ["อัลฟา", "1", "10.00"]


def test_alias_trim_and_case():
    _, rows = run([o("  siam square", 1)], [n("SIAM SQUARE ", 100), n("สยามสแควร์", 100)])
    assert rows[1] == ["สยามสแควร์", "3", "3.00"]


def test_unknown_branch_trimmed_name():
    _, rows = run([o(" Gamma ", 5)], [n("Gamma", 100)])
    assert rows[1] == ["Gamma", "2", "6.00"]


def test_sort_desc_then_name():
    _, rows = run([o("Beta", 10), o("Alpha", 10), o("Zed", 10), o("Big", 99.5)], [])
    names = [r[0] for r in rows[1:]]
    assert names[0] == "Big"
    assert names[1:] == sorted(["Zed", "อัลฟา", "เบตา"])


def test_two_decimals_always():
    text, rows = run([o("Alpha", 3), o("Beta", 3.5)], [])
    assert {r[0]: r[2] for r in rows[1:]} == {"อัลฟา": "3.00", "เบตา": "3.50"}
    assert text.startswith("branch,orders,total_baht")
