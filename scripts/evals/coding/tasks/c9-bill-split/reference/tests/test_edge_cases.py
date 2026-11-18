from billing import split_bill


def test_remainder_goes_to_first_listed():
    items = [{"name": "x", "price": 10001, "people": ["เอ", "บี", "ซี"]}]
    assert split_bill(items) == {"เอ": 3334, "บี": 3334, "ซี": 3333}


def test_half_satang_rounds_up():
    items = [{"name": "x", "price": 1005, "people": ["เอ"]}]
    assert split_bill(items, service_pct=10, vat_pct=7) == {"เอ": 1183}


def test_zero_bill_does_not_crash():
    items = [{"name": "x", "price": 0, "people": ["เอ"]}]
    assert split_bill(items, service_pct=10) == {"เอ": 0}
