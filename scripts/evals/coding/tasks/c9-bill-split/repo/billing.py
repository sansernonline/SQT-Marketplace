def split_bill(items, discount=0, service_pct=0, vat_pct=0):
    """แบ่งบิลตามคน · เงินทุกจำนวนเป็นสตางค์"""
    subtotal = {}
    for item in items:
        share = item["price"] / len(item["people"])
        for person in item["people"]:
            subtotal[person] = subtotal.get(person, 0) + share
    total = sum(subtotal.values())
    result = {}
    for person, amount in subtotal.items():
        net = amount - discount * amount / total
        net += net * service_pct / 100
        net += net * vat_pct / 100
        result[person] = round(net)
    return result
