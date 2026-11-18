from stock.receive import check_qty


def return_item(store, log, sku, qty):
    check_qty(qty)
    if sku not in store:
        raise ValueError(f"ไม่มี sku {sku} ในระบบ")
    sold = sum(-e["qty"] for e in log if e["sku"] == sku and e["type"] == "sell")
    back = sum(e["qty"] for e in log if e["sku"] == sku and e["type"] == "return")
    if qty > sold - back:
        raise ValueError("คืนเกินจำนวนที่ขายสุทธิ")
    amount = qty * store[sku]["price"]
    store[sku]["qty"] += qty
    log.append({"type": "return", "sku": sku, "qty": qty, "amount": amount})
    return amount
