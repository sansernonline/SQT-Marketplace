def low_stock(store):
    rows = [
        {"sku": sku, "name": it["name"], "qty": it["qty"], "min_qty": it["min_qty"], "short": it["min_qty"] - it["qty"]}
        for sku, it in store.items()
        if it["qty"] <= it["min_qty"]
    ]
    return sorted(rows, key=lambda r: (-r["short"], r["sku"]))


def movement_summary(log):
    out = {}
    for e in log:
        s = out.setdefault(e["sku"], {"received": 0, "sold": 0, "returned": 0, "adjusted": 0})
        if e["type"] == "receive":
            s["received"] += e["qty"]
        elif e["type"] == "sell":
            s["sold"] += -e["qty"]
        elif e["type"] == "return":
            s["returned"] += e["qty"]
        elif e["type"] == "adjust":
            s["adjusted"] += e["qty"]
    return out
