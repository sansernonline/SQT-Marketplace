def adjust(store, log, sku, counted):
    if not isinstance(counted, int) or isinstance(counted, bool) or counted < 0:
        raise ValueError("counted ต้องเป็นจำนวนเต็มไม่ติดลบ")
    if sku not in store:
        raise ValueError(f"ไม่มี sku {sku} ในระบบ")
    diff = counted - store[sku]["qty"]
    store[sku]["qty"] = counted
    if diff != 0:
        log.append({"type": "adjust", "sku": sku, "qty": diff})
    return diff
