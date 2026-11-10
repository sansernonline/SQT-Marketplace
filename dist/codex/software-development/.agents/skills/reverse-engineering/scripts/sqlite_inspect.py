#!/usr/bin/env python3
"""Inspect a SQLite database read-only: tables, views, indexes, triggers with
their CREATE SQL, columns and row counts. Optional sample rows with secret-looking
values replaced by <redacted>. Pure stdlib. The file is opened with
mode=ro&immutable=1 and is never written (a -wal file next to it is NOT read —
copy and checkpoint first if you need uncommitted pages).

Usage:
  python -I sqlite_inspect.py <db>                 # schema, columns, row counts
  python -I sqlite_inspect.py <db> --sample 5      # + 5 redacted rows per table
  python -I sqlite_inspect.py <db> --json --limit 0
  python -I sqlite_inspect.py --self-test
"""

import argparse
import json
import re
import sqlite3
import sys
import tempfile
from pathlib import Path

MAX_MB = 2048
MAGIC = b"SQLite format 3\0"
SECRET_NAME = re.compile(r"pass|pwd|secret|token|key|session|cookie", re.I)
SECRET_VALUE = re.compile(r"^(eyJ[\w-]+\.[\w-]+\.[\w-]*|[0-9a-fA-F]{32,}|[A-Za-z0-9+/_-]{40,}={0,2})$")
MAX_CELL = 60


def quote(name):
    return '"' + name.replace('"', '""') + '"'


def open_readonly(path):
    with open(path, "rb") as f:
        if f.read(16) != MAGIC:
            raise ValueError("not a SQLite 3 database (header mismatch)")
    con = sqlite3.connect(f"{Path(path).resolve().as_uri()}?mode=ro&immutable=1", uri=True)
    con.execute("PRAGMA query_only = 1")
    return con


def redact(column, value):
    if isinstance(value, bytes):
        return f"<blob {len(value)} bytes>"
    if value is None or isinstance(value, (int, float)):
        return value if not (SECRET_NAME.search(column) and value) else "<redacted>"
    text = str(value)
    if SECRET_NAME.search(column) and text or SECRET_VALUE.match(text.strip()):
        return "<redacted>"
    return text if len(text) <= MAX_CELL else text[:MAX_CELL] + "..."


def inspect(path, sample=0):
    con = open_readonly(path)
    try:
        objects = con.execute("SELECT type, name, tbl_name, sql FROM sqlite_master ORDER BY type, name").fetchall()
        info = {"tables": [], "views": [], "indexes": [], "triggers": []}
        for kind, name, table, sql in objects:
            entry = {"name": name, "sql": sql}
            if kind in ("index", "trigger"):
                entry["table"] = table
            if kind in ("table", "view"):
                cols = con.execute(f"PRAGMA table_info({quote(name)})").fetchall()
                entry["columns"] = [f"{c[1]} {c[2]}".strip() + (" PK" if c[5] else "") for c in cols]
            if kind == "table":
                try:
                    entry["rows"] = con.execute(f"SELECT COUNT(*) FROM {quote(name)}").fetchone()[0]
                    if sample:
                        names = [c[1] for c in cols]
                        rows = con.execute(f"SELECT * FROM {quote(name)} LIMIT ?", (sample,)).fetchall()
                        entry["sample"] = [{n: redact(n, v) for n, v in zip(names, r)} for r in rows]
                except sqlite3.Error as e:
                    entry["rows"] = f"? ({e})"
            if (bucket := {"table": "tables", "view": "views", "index": "indexes", "trigger": "triggers"}.get(kind)):
                info[bucket].append(entry)
        return info
    finally:
        con.close()


def show(info, limit):
    for kind, items in info.items():
        print(f"\n{kind} ({len(items)}):")
        for e in items[:limit or None]:
            on = f" on {e['table']}" if "table" in e else ""
            rows = f"  rows={e['rows']}" if "rows" in e else ""
            print(f"  {e['name']}{on}{rows}")
            if "columns" in e:
                print(f"    columns: {', '.join(e['columns'])}")
            if e["sql"]:
                print("    " + " ".join(e["sql"].split()))
            for row in e.get("sample", []):
                print(f"    sample: {json.dumps(row, ensure_ascii=False)}")
        if limit and len(items) > limit:
            print(f"  ... {len(items) - limit} more (use --limit 0)")


def self_test():
    jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.c2ln"
    with tempfile.TemporaryDirectory() as tmp:
        db, junk = Path(tmp, "t.db"), Path(tmp, "j.db")
        con = sqlite3.connect(db)
        con.executescript("CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT, password TEXT, bio TEXT, blob_col BLOB);"
                          "CREATE INDEX idx_name ON users(name); CREATE VIEW v AS SELECT name FROM users;"
                          "CREATE TRIGGER trg AFTER INSERT ON users BEGIN SELECT 1; END;")
        con.executemany("INSERT INTO users VALUES(?,?,?,?,?)",
                        [(1, "ann", "hunter2", jwt, b"\x00\x01"), (2, "bob", "x", "a" * 64, None), (3, "cy", "", "hi", None)])
        con.commit()
        con.close()
        junk.write_bytes(b"not a database at all")
        before = db.read_bytes()
        info = inspect(db, sample=2)
        t = info["tables"][0]
        assert t["rows"] == 3 and t["columns"][0] == "id INTEGER PK", t
        assert t["sample"][0] == {"id": 1, "name": "ann", "password": "<redacted>", "bio": "<redacted>",
                                  "blob_col": "<blob 2 bytes>"}, t["sample"][0]
        assert t["sample"][1]["bio"] == "<redacted>" and len(t["sample"]) == 2
        assert [len(info[k]) for k in ("views", "indexes", "triggers")] == [1, 1, 1], info
        assert "CREATE INDEX" in info["indexes"][0]["sql"] and info["indexes"][0]["table"] == "users"
        assert db.read_bytes() == before, "database was modified"
        try:
            inspect(junk)
            raise AssertionError("non-SQLite accepted")
        except ValueError:
            pass
        show(info, 5)
    print("self-test OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", nargs="?")
    ap.add_argument("--sample", type=int, default=0, metavar="N", help="print N redacted rows per table")
    ap.add_argument("--limit", type=int, default=50, help="objects per kind, 0 = all")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()
    if a.self_test:
        return self_test()
    if not a.file or not Path(a.file).is_file():
        ap.error("give an existing SQLite file")
    if Path(a.file).stat().st_size > MAX_MB * 1024 * 1024:
        ap.error(f"larger than {MAX_MB} MB")
    try:
        info = inspect(a.file, a.sample)
    except (ValueError, sqlite3.Error, OSError) as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(2)
    print(json.dumps(info, indent=1, ensure_ascii=False)) if a.json else show(info, a.limit)


if __name__ == "__main__":
    main()
