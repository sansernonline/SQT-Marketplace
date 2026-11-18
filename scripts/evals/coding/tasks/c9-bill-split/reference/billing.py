def _allocate(total, weights):
    """แบ่ง total (สตางค์) ตามน้ำหนัก ให้ผลรวมตรง total · เศษให้คนที่เศษมากสุดก่อน เท่ากันให้คนก่อนหน้า"""
    base = sum(weights)
    if base == 0:
        return [0] * len(weights)
    parts = [total * w // base for w in weights]
    rems = [total * w % base for w in weights]
    order = sorted(range(len(weights)), key=lambda i: (-rems[i], i))
    for i in order[: total - sum(parts)]:
        parts[i] += 1
    return parts


def _pct_half_up(amount, pct):
    return (2 * amount * pct + 100) // 200


def split_bill(items, discount=0, service_pct=0, vat_pct=0):
    """แบ่งบิลตามคน · เงินทุกจำนวนเป็นสตางค์"""
    subtotal = {}
    for item in items:
        people = item["people"]
        shares = _allocate(item["price"], [1] * len(people))
        for person, share in zip(people, shares):
            subtotal[person] = subtotal.get(person, 0) + share
    names = list(subtotal)
    subs = [subtotal[n] for n in names]
    discount = min(discount, sum(subs))
    net = [s - d for s, d in zip(subs, _allocate(discount, subs))]
    service = _allocate(_pct_half_up(sum(net), service_pct), net)
    gross = [n + s for n, s in zip(net, service)]
    vat = _allocate(_pct_half_up(sum(gross), vat_pct), gross)
    return {n: g + v for n, g, v in zip(names, gross, vat)}
