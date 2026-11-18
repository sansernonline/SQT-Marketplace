from billing import split_bill


def test_two_people_own_items():
    items = [
        {"name": "ข้าวผัด", "price": 6000, "people": ["เอ"]},
        {"name": "ต้มยำ", "price": 4000, "people": ["บี"]},
    ]
    assert split_bill(items) == {"เอ": 6000, "บี": 4000}


def test_shared_item_even_split():
    items = [{"name": "ส้มตำ", "price": 5000, "people": ["เอ", "บี"]}]
    assert split_bill(items) == {"เอ": 2500, "บี": 2500}


def test_service_and_vat():
    items = [{"name": "ข้าวผัด", "price": 10000, "people": ["เอ"]}]
    assert split_bill(items, service_pct=10, vat_pct=7) == {"เอ": 11770}
