from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_returns_stock_for_known_sku():
    response = client.get("/stock/A001")
    assert response.status_code == 200
    assert response.json() == {"sku": "A001", "qty": 12, "in_stock": True}


def test_unknown_sku_is_404():
    assert client.get("/stock/NOPE").status_code == 404
