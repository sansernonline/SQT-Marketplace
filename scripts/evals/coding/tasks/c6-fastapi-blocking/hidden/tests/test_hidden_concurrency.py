import asyncio
import json
import os
import time

import httpx

from app import app

SKUS = ["A001", "A002", "A003", "B100", "B200"] * 2  # 10 requests
EXPECTED = {"A001": 12, "A002": 0, "A003": 7, "B100": 40, "B200": 3}


async def fetch_all(paths):
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        return await asyncio.gather(*(client.get(path) for path in paths))


def timed(paths):
    start = time.perf_counter()
    responses = asyncio.run(fetch_all(paths))
    return responses, time.perf_counter() - start


def save_metric(name, value):
    path = os.environ.get("EVAL_METRICS_FILE")
    if path:
        with open(path, "w", encoding="utf-8") as f:
            json.dump({name: value}, f)


def test_ten_concurrent_requests_are_not_serialized():
    _, single = timed(["/stock/A001"])
    responses, batch = timed([f"/stock/{sku}" for sku in SKUS])
    save_metric("latency_ms", round(batch * 1000))

    assert all(r.status_code == 200 for r in responses)
    assert single >= 0.15, "the vendor call must still take its normal time"
    assert batch < 2.5 * single, f"10 concurrent calls took {batch:.2f}s, one call takes {single:.2f}s"


def test_concurrent_responses_are_correct():
    responses, _ = timed([f"/stock/{sku}" for sku in SKUS])

    for sku, response in zip(SKUS, responses):
        assert response.status_code == 200
        assert response.json() == {"sku": sku, "qty": EXPECTED[sku], "in_stock": EXPECTED[sku] > 0}


def test_unknown_sku_is_404_under_load():
    paths = ["/stock/A001", "/stock/NOPE", "/stock/B100", "/stock/ZZZ"]
    responses, _ = timed(paths)

    assert [r.status_code for r in responses] == [200, 404, 200, 404]
