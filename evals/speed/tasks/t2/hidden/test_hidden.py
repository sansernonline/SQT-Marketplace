from decimal import Decimal as D
import pytest
from receipt import calc_receipt
K = ["subtotal","discount","net","vat","total","base","withholding","pay"]
def r(**kw): return calc_receipt(**kw)
def test_keys():
    out = r(items=[{"name":"a","qty":1,"unit_price":"100"}]); assert set(K) <= set(out)
def test_exclusive_basic():
    o = r(items=[{"name":"a","qty":3,"unit_price":"19.99"}])
    assert (o["subtotal"],o["vat"],o["total"],o["pay"]) == (D("59.97"),D("4.20"),D("64.17"),D("64.17"))
def test_line_rounding_each():
    o = r(items=[{"name":"a","qty":3,"unit_price":"0.335"},{"name":"b","qty":1,"unit_price":"0.005"}])
    assert o["subtotal"] == D("1.02")
def test_discount():
    o = r(items=[{"name":"a","qty":1,"unit_price":"1000"}], discount_pct=12.5)
    assert (o["discount"],o["net"],o["vat"],o["total"]) == (D("125.00"),D("875.00"),D("61.25"),D("936.25"))
def test_inclusive():
    o = r(items=[{"name":"a","qty":1,"unit_price":"1070"}], vat_mode="inclusive")
    assert (o["total"],o["vat"],o["base"]) == (D("1070.00"),D("70.00"),D("1000.00"))
def test_inclusive_rounding():
    o = r(items=[{"name":"a","qty":1,"unit_price":"100"}], vat_mode="inclusive")
    assert (o["vat"],o["base"]) == (D("6.54"),D("93.46"))
def test_withholding_exclusive():
    o = r(items=[{"name":"svc","qty":1,"unit_price":"10000"}], withholding_pct=3)
    assert (o["withholding"],o["pay"]) == (D("300.00"),D("10400.00"))
def test_withholding_inclusive():
    o = r(items=[{"name":"svc","qty":2,"unit_price":"535"}], vat_mode="inclusive", withholding_pct=3)
    assert (o["base"],o["withholding"],o["pay"]) == (D("1000.00"),D("30.00"),D("1040.00"))
@pytest.mark.parametrize("kw", [
    dict(items=[]),
    dict(items=[{"name":"a","qty":0,"unit_price":"1"}]),
    dict(items=[{"name":"a","qty":1.5,"unit_price":"1"}]),
    dict(items=[{"name":"a","qty":1,"unit_price":"-1"}]),
    dict(items=[{"name":"a","qty":1,"unit_price":"1"}], discount_pct=101),
    dict(items=[{"name":"a","qty":1,"unit_price":"1"}], withholding_pct=-1),
    dict(items=[{"name":"a","qty":1,"unit_price":"1"}], vat_mode="zero"),
])
def test_invalid(kw):
    with pytest.raises(ValueError): r(**kw)
