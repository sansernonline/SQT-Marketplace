"""Stock lookup Application Programming Interface (API) for the shop front.

Run: uvicorn app:app --reload
"""
from fastapi import FastAPI, HTTPException

import slow_client

app = FastAPI()


# A plain `def` route: slow_client.get_stock blocks, so FastAPI runs this in its thread pool
# instead of on the event loop, and other requests keep being served while it waits.
@app.get("/stock/{sku}")
def stock(sku: str):
    try:
        item = slow_client.get_stock(sku)
    except slow_client.NotFound:
        raise HTTPException(status_code=404, detail=f"unknown sku {sku}")
    return {"sku": item["sku"], "qty": item["qty"], "in_stock": item["qty"] > 0}
