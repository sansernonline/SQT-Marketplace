from billing import split_bill

BIG = [
    {"name": "a", "price": 12900, "people": ["เอ", "บี", "ซี"]},
    {"name": "b", "price": 8950, "people": ["เอ"]},
    {"name": "c", "price": 4500, "people": ["บี", "ซี"]},
    {"name": "d", "price": 15500, "people": ["ซี", "ดี"]},
]


def one(price, people):
    return {"name": "x", "price": price, "people": people}


def test_item_remainder_goes_to_first_listed():
    assert split_bill([one(10001, ["เอ", "บี", "ซี"])]) == {"เอ": 3334, "บี": 3334, "ซี": 3333}
    assert split_bill([one(10001, ["ซี", "เอ", "บี"])]) == {"ซี": 3334, "เอ": 3334, "บี": 3333}


def test_service_rounds_half_up_not_bankers():
    # 1005 x 10% = 100.5 satang -> 101 (round() ของ Python ให้ 100) · VAT 1106 x 7% = 77.42 -> 77
    assert split_bill([one(1005, ["เอ"])], service_pct=10, vat_pct=7) == {"เอ": 1183}


def test_discount_largest_remainder():
    items = [one(3333, ["เอ"]), one(3333, ["บี"]), one(3334, ["ซี"])]
    assert split_bill(items, discount=100) == {"เอ": 3300, "บี": 3300, "ซี": 3300}


def test_discount_tie_goes_to_earlier_person():
    items = [one(100, ["เอ"]), one(100, ["บี"]), one(100, ["ซี"])]
    assert split_bill(items, discount=100) == {"เอ": 66, "บี": 67, "ซี": 67}


def test_total_matches_whole_bill_rounding():
    # N=40616 · service 4061.6 -> 4062 · VAT บน 44678 = 3127.46 -> 3127 · รวม 47805
    assert sum(split_bill(BIG, discount=1234, service_pct=10, vat_pct=7).values()) == 47805


def test_exact_per_person_amounts():
    assert split_bill(BIG, discount=1234, service_pct=10, vat_pct=7) == {"เอ": 15135, "บี": 7482, "ซี": 16335, "ดี": 8853}


def test_discount_larger_than_bill_is_capped():
    assert split_bill([one(5000, ["เอ"])], discount=9000, service_pct=10, vat_pct=7) == {"เอ": 0}


def test_zero_bill_does_not_crash():
    assert split_bill([one(0, ["เอ", "บี"])], service_pct=10, vat_pct=7) == {"เอ": 0, "บี": 0}


def test_free_item_keeps_person_with_zero_and_order():
    items = [one(0, ["ดี"]), one(2000, ["เอ"])]
    result = split_bill(items, discount=500)
    assert result == {"ดี": 0, "เอ": 1500}
    assert list(result) == ["ดี", "เอ"]
