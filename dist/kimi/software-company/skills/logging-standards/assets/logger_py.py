"""
logger_py.py — logger มาตรฐานสำหรับ Python (ใช้ stdlib ล้วน ไม่ต้องลงอะไรเพิ่ม)

ให้รูปแบบบรรทัดเดียวกับ .NET / Node ใน skill นี้:
  2026-08-31 09:42:13.482 +07:00  INFO   [a3f9c1] orders  สร้างคำสั่งซื้อสำเร็จ  order_id=1042 ms=134

ใช้:
    from logger_py import setup_logging, get_logger, set_correlation_id

    setup_logging(app_name="myapi")            # เรียกครั้งเดียวตอนแอปเริ่ม
    log = get_logger("orders")
    set_correlation_id("a3f9c1b2")             # ต่อ request (ContextVar — ปลอดภัยกับ async)
    log.info("สร้างคำสั่งซื้อสำเร็จ", extra={"ctx": {"order_id": 1042, "ms": 134}})
    log.exception("พังตรงนี้")                  # ใน except block — ได้ stack ให้อัตโนมัติ
"""

from __future__ import annotations

import json
import logging
import logging.handlers
import os
import time
from contextvars import ContextVar
from pathlib import Path

# --------------------------------------------------------------- correlation
# ContextVar ไม่ใช่ตัวแปร global ธรรมดา — แต่ละ task/request มีค่าของตัวเอง
# ถ้าใช้ global จะปนกันทันทีที่มี request พร้อมกันหลายอัน
_correlation_id: ContextVar[str] = ContextVar("correlation_id", default="------")


def set_correlation_id(cid: str) -> None:
    _correlation_id.set((cid or "------")[:8])


def get_correlation_id() -> str:
    return _correlation_id.get()


# ----------------------------------------------------------------- redaction
SECRET_KEYS = (
    "password", "passwd", "pwd", "secret", "token", "authorization", "cookie",
    "apikey", "api_key", "accesstoken", "refreshtoken", "otp", "pin",
    "creditcard", "cardnumber", "cvv", "citizenid", "nationalid", "ssn",
)


def _redact(value, depth: int = 0):
    if depth > 4 or not isinstance(value, (dict, list)):
        return value
    if isinstance(value, list):
        return [_redact(v, depth + 1) for v in value]
    return {
        k: ("***" if any(s in k.lower() for s in SECRET_KEYS) else _redact(v, depth + 1))
        for k, v in value.items()
    }


def _safe(v) -> str:
    """ตัด \\n ออกจากค่าที่มาจากผู้ใช้ — กัน log injection (แต่งบรรทัด log ปลอม)"""
    if v is None:
        return "-"
    s = json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else str(v)
    s = " ".join(s.split())
    if " " in s:
        # เปลี่ยน " ข้างในเป็น ' ก่อนครอบ — ไม่งั้นเครื่องหมายคำพูดซ้อนกันจนอ่านไม่ออก
        return '"' + s.replace('"', "'") + '"'
    return s


# ------------------------------------------------------------------ formatter
# ชื่อระดับให้ยาวไม่เกิน 5 ตัว ทุกบรรทัดจะได้เรียงคอลัมน์ตรงกัน
# และตรงกับชื่อที่ .NET (Serilog) กับ Node (winston) ใช้
_LEVEL_NAME = {"WARNING": "WARN", "CRITICAL": "FATAL"}


class LineFormatter(logging.Formatter):
    """หนึ่ง event = หนึ่งบรรทัด · stack trace เยื้อง 4 ช่องต่อท้าย"""

    def format(self, record: logging.LogRecord) -> str:
        ts = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(record.created))
        ms = int(record.msecs)
        tz = time.strftime("%z", time.localtime(record.created))
        tz = f"{tz[:3]}:{tz[3:]}" if tz else "+00:00"

        ctx = _redact(getattr(record, "ctx", {}) or {})
        ctx_str = " ".join(f"{k}={_safe(v)}" for k, v in ctx.items())

        line = (
            f"{ts}.{ms:03d} {tz}  "
            f"{_LEVEL_NAME.get(record.levelname, record.levelname):<5}  "
            f"[{get_correlation_id()}] {record.name}  {record.getMessage()}"
        )
        if ctx_str:
            line += f"  {ctx_str}"
        if record.exc_info:
            trace = self.formatException(record.exc_info).replace("\n", "\n    ")
            line += f"\n    {trace}"
        return line


# ---------------------------------------------------------------------- setup
def setup_logging(
    app_name: str = "app",
    log_dir: str | None = None,
    level: str | None = None,
    retain_days: int = 30,
) -> logging.Logger:
    """เรียกครั้งเดียวตอนแอปเริ่ม — เรียกซ้ำจะไม่เพิ่ม handler ซ้อน"""
    log_dir = log_dir or os.getenv("LOG_DIR", "logs")
    level = (level or os.getenv("LOG_LEVEL")
             or ("INFO" if os.getenv("ENV") == "production" else "DEBUG")).upper()
    Path(log_dir).mkdir(parents=True, exist_ok=True)

    root = logging.getLogger()
    if any(getattr(h, "_std_logging", False) for h in root.handlers):
        return root                      # ตั้งไว้แล้ว อย่าเพิ่มซ้ำ
    root.setLevel(level)

    fmt = LineFormatter()

    def _handler(h, lvl=logging.NOTSET):
        h.setFormatter(fmt)
        h.setLevel(lvl)
        h._std_logging = True
        return h

    # ไฟล์รวม — หมุนเที่ยงคืน เก็บ retain_days วัน
    root.addHandler(_handler(logging.handlers.TimedRotatingFileHandler(
        Path(log_dir) / f"{app_name}.log", when="midnight",
        backupCount=retain_days, encoding="utf-8")))

    # ไฟล์เฉพาะ error — เวลามีปัญหาจะได้ไม่ต้องไล่หาในไฟล์รวม
    root.addHandler(_handler(logging.handlers.TimedRotatingFileHandler(
        Path(log_dir) / f"{app_name}-error.log", when="midnight",
        backupCount=90, encoding="utf-8"), logging.ERROR))

    root.addHandler(_handler(logging.StreamHandler()))

    # ไลบรารีที่ log เยอะเกินจำเป็น — ปิดปากไว้ ไม่งั้นกลบ log ของเราเอง
    for noisy in ("urllib3", "asyncio", "botocore", "httpx"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    return root


def get_logger(source: str) -> logging.Logger:
    return logging.getLogger(source)
