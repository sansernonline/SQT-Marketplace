import copy
import pytest
from stock.receive import receive
from stock.sell import sell
from stock.returns import return_item
from stock.adjust import adjust
from stock.report import low_stock, movement_summary


def mk():
    return {
        "A1": {"name": "น้ำดื่ม", "qty": 20, "min_qty": 5, "price": 10},
        "B2": {"name": "มาม่า", "qty": 4, "min_qty": 10, "price": 7},
        "C3": {"name": "ไข่ไก่", "qty": 10, "min_qty": 10, "price": 5},
        "D4": {"name": "สบู่", "qty": 0, "min_qty": 3, "price": 25},
    }


# receive
def test_receive_adds_and_returns_new_qty():
    s, log = mk(), []
    assert receive(s, log, "A1", 5) == 25
    assert s["A1"]["qty"] == 25


def test_receive_log_entry():
    s, log = mk(), []
    receive(s, log, "B2", 6)
    assert log == [{"type": "receive", "sku": "B2", "qty": 6}]


def test_receive_twice_accumulates():
    s, log = mk(), []
    receive(s, log, "D4", 2)
    assert receive(s, log, "D4", 3) == 5 and len(log) == 2


# sell
def test_sell_returns_amount_and_reduces():
    s, log = mk(), []
    assert sell(s, log, "A1", 3) == 30
    assert s["A1"]["qty"] == 17


def test_sell_log_entry_signed():
    s, log = mk(), []
    sell(s, log, "B2", 2)
    assert log == [{"type": "sell", "sku": "B2", "qty": -2, "amount": 14}]


def test_sell_all_stock_ok():
    s, log = mk(), []
    assert sell(s, log, "B2", 4) == 28 and s["B2"]["qty"] == 0


def test_sell_insufficient_raises_and_untouched():
    s, log = mk(), []
    before = copy.deepcopy(s)
    with pytest.raises(ValueError):
        sell(s, log, "B2", 5)
    assert s == before and log == []


def test_sell_out_of_stock_item_raises():
    s, log = mk(), []
    with pytest.raises(ValueError):
        sell(s, log, "D4", 1)
    assert log == []


# return
def test_return_after_sale_refunds_and_restocks():
    s, log = mk(), []
    sell(s, log, "A1", 5)
    assert return_item(s, log, "A1", 2) == 20
    assert s["A1"]["qty"] == 17


def test_return_log_entry():
    s, log = mk(), []
    sell(s, log, "A1", 5)
    return_item(s, log, "A1", 2)
    assert log[-1] == {"type": "return", "sku": "A1", "qty": 2, "amount": 20}
    assert len(log) == 2


def test_return_never_sold_raises():
    s, log = mk(), []
    before = copy.deepcopy(s)
    with pytest.raises(ValueError):
        return_item(s, log, "A1", 1)
    assert s == before and log == []


def test_return_more_than_sold_raises():
    s, log = mk(), []
    sell(s, log, "A1", 3)
    with pytest.raises(ValueError):
        return_item(s, log, "A1", 4)
    assert len(log) == 1 and s["A1"]["qty"] == 17


def test_return_cumulative_limit():
    s, log = mk(), []
    sell(s, log, "A1", 4)
    return_item(s, log, "A1", 3)
    with pytest.raises(ValueError):
        return_item(s, log, "A1", 2)
    assert return_item(s, log, "A1", 1) == 10


def test_return_limit_counts_only_same_sku():
    s, log = mk(), []
    sell(s, log, "A1", 5)
    with pytest.raises(ValueError):
        return_item(s, log, "C3", 1)


def test_return_uses_current_price():
    s, log = mk(), []
    sell(s, log, "A1", 2)
    s["A1"]["price"] = 12
    assert return_item(s, log, "A1", 2) == 24


# adjust
def test_adjust_down_returns_negative_diff():
    s, log = mk(), []
    assert adjust(s, log, "A1", 17) == -3
    assert s["A1"]["qty"] == 17
    assert log == [{"type": "adjust", "sku": "A1", "qty": -3}]


def test_adjust_up():
    s, log = mk(), []
    assert adjust(s, log, "D4", 6) == 6 and s["D4"]["qty"] == 6


def test_adjust_same_no_log():
    s, log = mk(), []
    assert adjust(s, log, "C3", 10) == 0
    assert log == []


def test_adjust_to_zero():
    s, log = mk(), []
    assert adjust(s, log, "A1", 0) == -20 and s["A1"]["qty"] == 0


# report
def test_low_stock_selects_at_or_below_min():
    got = [r["sku"] for r in low_stock(mk())]
    assert set(got) == {"B2", "C3", "D4"}


def test_low_stock_row_shape():
    rows = {r["sku"]: r for r in low_stock(mk())}
    assert rows["B2"] == {"sku": "B2", "name": "มาม่า", "qty": 4, "min_qty": 10, "short": 6}
    assert rows["C3"]["short"] == 0


def test_low_stock_sorted_by_short_desc_then_sku():
    s = mk()
    s["E5"] = {"name": "x", "qty": 0, "min_qty": 6, "price": 1}
    assert [r["sku"] for r in low_stock(s)] == ["B2", "E5", "D4", "C3"]


def test_low_stock_none():
    assert low_stock({"A1": {"name": "n", "qty": 9, "min_qty": 5, "price": 1}}) == []


def test_movement_summary_empty():
    assert movement_summary([]) == {}


def test_movement_summary_totals():
    s, log = mk(), []
    receive(s, log, "A1", 10)
    sell(s, log, "A1", 6)
    sell(s, log, "A1", 2)
    return_item(s, log, "A1", 3)
    adjust(s, log, "A1", 20)
    sell(s, log, "B2", 1)
    got = movement_summary(log)
    assert got["A1"] == {"received": 10, "sold": 8, "returned": 3, "adjusted": -5}
    assert got["B2"] == {"received": 0, "sold": 1, "returned": 0, "adjusted": 0}
    assert set(got) == {"A1", "B2"}


def test_flow_end_to_end_consistency():
    s, log = mk(), []
    start = s["A1"]["qty"]
    receive(s, log, "A1", 7)
    sell(s, log, "A1", 9)
    return_item(s, log, "A1", 4)
    adjust(s, log, "A1", 20)
    assert s["A1"]["qty"] == start + sum(e["qty"] for e in log if e["sku"] == "A1")
