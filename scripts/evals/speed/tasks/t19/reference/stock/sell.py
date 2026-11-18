from stock.receive import check_qty


def sell(store, log, sku, qty):
    check_qty(qty)
    if sku not in store:
        raise ValueError(f"ไม่มี sku {sku} ในระบบ")
    item = store[sku]
    if qty > item["qty"]:
        raise ValueError("สต็อกไม่พอ")
    amount = qty * item["price"]
    item["qty"] -= qty
    log.append({"type": "sell", "sku": sku, "qty": -qty, "amount": amount})
    return amount
