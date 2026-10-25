"""Stock lookup Application Programming Interface (API) for the shop front.

Run: uvicorn app:app --reload
"""
from fastapi import FastAPI, HTTPException

import slow_client

app = FastAPI()


@app.get("/stock/{sku}")
async def stock(sku: str):
    try:
        item = slow_client.get_stock(sku)
    except slow_client.NotFound:
        raise HTTPException(status_code=404, detail=f"unknown sku {sku}")
    return {"sku": item["sku"], "qty": item["qty"], "in_stock": item["qty"] > 0}
