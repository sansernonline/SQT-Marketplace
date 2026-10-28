"""
health_py.py — endpoint พื้นฐานที่ทุก service ต้องมี (FastAPI)

    from health_py import make_health_router

    app.include_router(make_health_router(
        version={"name": "demo-api", "version": "1.4.0",
                 "commit": os.getenv("GIT_SHA"), "build_time": os.getenv("BUILD_TIME")},
        checks={
            "db": lambda: db.execute("SELECT 1"),
            "redis": redis.ping,
            "mail": {"critical": False, "run": smtp.verify},
        },
    ))

ให้:
    GET /ping          200 "pong"      ถูกที่สุด ไม่แตะ dependency ใด ๆ
    GET /health/live   200 | 503       process ยังทำงานอยู่ไหม
    GET /health/ready  200 | 503       พร้อมรับ traffic ไหม
    GET /version       200             เวอร์ชันที่รันอยู่จริง

รับ check ได้ทั้งฟังก์ชันธรรมดาและ async — ฟังก์ชันธรรมดาจะถูกโยนไป thread
เพื่อไม่ให้บล็อก event loop

ทดสอบ:  python health_py.py --self-test     (ต้องมี fastapi + httpx · ไม่มี → ข้ามและบอกชัด)
"""

from __future__ import annotations

import asyncio
import inspect
import os
import socket
import sys
import time
from datetime import datetime, timezone
from typing import Any, Callable, Mapping

try:
    from fastapi import APIRouter, Response
    from fastapi.responses import JSONResponse, PlainTextResponse
except ImportError:                                  # --self-test ต้องบอกชัดว่าข้าม ไม่ใช่ล้ม
    if "--self-test" in sys.argv:
        print("SKIP self-test: ไม่มี fastapi (pip install fastapi httpx)")
        raise SystemExit(0)
    raise

DEFAULT_TIMEOUT_S = 3.0


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


async def _run_check(name: str, spec: Any, timeout_s: float) -> dict:
    fn: Callable = spec["run"] if isinstance(spec, Mapping) else spec
    critical: bool = spec.get("critical", True) if isinstance(spec, Mapping) else True

    started = time.perf_counter()
    try:
        # ฟังก์ชันธรรมดา (sync) ต้องไปรันใน thread ไม่งั้นบล็อก event loop และ timeout ไม่ทำงาน
        # ทำให้ทั้ง service ค้างเพราะแค่ health check · เรียก fn() ก่อนห่อ thread = บล็อกไปแล้ว
        coro = fn() if inspect.iscoroutinefunction(fn) else asyncio.to_thread(fn)
        result = await asyncio.wait_for(coro, timeout=timeout_s)
        if asyncio.iscoroutine(result):  # sync ที่คืน coroutine เช่น lambda: db.ping()
            await asyncio.wait_for(result, timeout=timeout_s)
        status, error = "up", None
    except asyncio.TimeoutError:
        status, error = "down", f"{name} timeout after {timeout_s}s"
    except Exception as exc:                                  # noqa: BLE001
        # ข้อความ error เท่านั้น ห้ามส่ง traceback — endpoint นี้เปิดสาธารณะ
        status, error = "down", str(exc)[:200]

    out = {
        "status": status,
        "duration_ms": int((time.perf_counter() - started) * 1000),
        "_critical": critical,
    }
    if error:
        out["error"] = error
    return {"name": name, **out}


def make_health_router(
    version: Mapping[str, Any] | None = None,
    checks: Mapping[str, Any] | None = None,
    timeout_s: float = DEFAULT_TIMEOUT_S,
) -> APIRouter:
    version = version or {}
    checks = checks or {}
    started_at = time.time()
    router = APIRouter(tags=["health"])

    # ---- ping: ตัวที่ load balancer เรียกทุกวินาที ต้องเบาที่สุด ไม่ต้อง log ----
    @router.get("/ping", response_class=PlainTextResponse, include_in_schema=False)
    async def ping() -> str:
        return "pong"

    # ---- liveness: process ตายหรือยัง ----
    # ห้ามเช็ค dependency ตรงนี้ ไม่งั้น DB ล่มชั่วคราว → orchestrator ฆ่า pod ทิ้ง
    # ทั้งที่แอปยังปกติดี แล้วปัญหาจะบานปลายกว่าเดิม
    @router.get("/health/live")
    async def live() -> dict:
        return {
            "status": "up",
            "uptime_sec": int(time.time() - started_at),
            "timestamp": _now_iso(),
        }

    # ---- readiness: พร้อมรับ traffic ไหม ----
    @router.get("/health/ready")
    async def ready(response: Response) -> JSONResponse:
        results = await asyncio.gather(
            *(_run_check(n, spec, timeout_s) for n, spec in checks.items())
        )
        critical_down = any(r["status"] == "down" and r["_critical"] for r in results)
        any_down = any(r["status"] == "down" for r in results)
        status = "down" if critical_down else ("degraded" if any_down else "up")

        body = {
            "status": status,
            "timestamp": _now_iso(),
            "checks": {
                r["name"]: {k: v for k, v in r.items() if k not in ("name", "_critical")}
                for r in results
            },
        }
        return JSONResponse(body, status_code=503 if critical_down else 200)

    # ---- version: ตอบว่า "ตอนนี้รันอะไรอยู่" — คำถามแรกเสมอเวลามีปัญหา ----
    @router.get("/version")
    async def app_version() -> dict:
        return {
            "name": version.get("name", "service"),
            "version": version.get("version", "0.0.0"),
            "commit": version.get("commit") or os.getenv("GIT_SHA", "unknown"),
            "build_time": version.get("build_time") or os.getenv("BUILD_TIME", "unknown"),
            "env": os.getenv("ENV", "development"),
            "host": socket.gethostname(),
        }

    return router


def _self_test() -> int:
    try:
        from fastapi import FastAPI
        from fastapi.testclient import TestClient
    except ImportError:
        print("SKIP self-test: ไม่มี httpx สำหรับ TestClient (pip install httpx)")
        return 0

    async def slow() -> None:
        await asyncio.sleep(1)

    def boom() -> None:
        raise RuntimeError("db down")

    def app_with(checks, timeout_s=DEFAULT_TIMEOUT_S):
        app = FastAPI()
        app.include_router(make_health_router({"name": "t", "version": "9.9.9"}, checks, timeout_s))
        return TestClient(app)

    good = app_with({"db": lambda: None, "queue": {"critical": False, "run": lambda: None}})
    soft = app_with({"db": lambda: None, "mail": {"critical": False, "run": boom}})
    hard = app_with({"db": boom})
    late = app_with({"slow": slow}, timeout_s=0.1)
    r_good, r_soft, r_hard, r_late = (c.get("/health/ready") for c in (good, soft, hard, late))
    checks = {
        "/ping 200 pong": good.get("/ping").text == "pong",
        "/health/live 200 up": good.get("/health/live").json()["status"] == "up",
        "/version ตรงที่ส่งเข้า": good.get("/version").json()["version"] == "9.9.9",
        "ready: ทุก check ผ่าน = 200 up": r_good.status_code == 200 and r_good.json()["status"] == "up",
        "ready: check ไม่ critical ล่ม = 200 degraded": r_soft.status_code == 200 and r_soft.json()["status"] == "degraded",
        "ready: check critical ล่ม = 503 down": r_hard.status_code == 503 and r_hard.json()["checks"]["db"]["error"] == "db down",
        "ready: check ค้าง = 503 ตาม timeout": r_late.status_code == 503 and "timeout" in r_late.json()["checks"]["slow"]["error"],
        "ไม่ส่ง _critical ออกนอก": all("_critical" not in v for v in r_hard.json()["checks"].values()),
    }
    for name, ok in checks.items():
        print("ok  " if ok else "FAIL", name)
    print(f"self-test {sum(checks.values())}/{len(checks)}")
    return 0 if all(checks.values()) else 1


if __name__ == "__main__":
    sys.exit(_self_test() if "--self-test" in sys.argv else print(__doc__))
