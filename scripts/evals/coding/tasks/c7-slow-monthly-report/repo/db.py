"""เปิดฐานข้อมูลและรัน migration ตามลำดับชื่อไฟล์"""
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCHEMA = ROOT / "schema.sql"
MIGRATIONS = ROOT / "migrations"


def connect(path):
    return sqlite3.connect(str(path))


def create_schema(conn):
    conn.executescript(SCHEMA.read_text(encoding="utf-8"))


def apply_migrations(conn):
    """รันไฟล์ migrations/*.sql ที่ยังไม่เคยรัน เรียงตามชื่อไฟล์ คืนรายชื่อไฟล์ที่รันรอบนี้"""
    conn.execute("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY)")
    done = {row[0] for row in conn.execute("SELECT name FROM schema_migrations")}
    ran = []
    for file in sorted(MIGRATIONS.glob("*.sql")):
        if file.name in done:
            continue
        conn.executescript(file.read_text(encoding="utf-8"))
        conn.execute("INSERT INTO schema_migrations (name) VALUES (?)", (file.name,))
        conn.commit()
        ran.append(file.name)
    return ran
