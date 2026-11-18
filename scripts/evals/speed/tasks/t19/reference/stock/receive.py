def check_qty(qty):
    if not isinstance(qty, int) or isinstance(qty, bool) or qty <= 0:
        raise ValueError("qty ต้องเป็นจำนวนเต็มบวก")


def receive(store, log, sku, qty):
    check_qty(qty)
    if sku not in store:
        raise ValueError(f"ไม่มี sku {sku} ในระบบ")
    store[sku]["qty"] += qty
    log.append({"type": "receive", "sku": sku, "qty": qty})
    return store[sku]["qty"]
