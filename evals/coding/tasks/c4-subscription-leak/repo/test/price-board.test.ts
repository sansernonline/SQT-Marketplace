import { test } from "node:test";
import assert from "node:assert/strict";
import { PriceBoardComponent } from "../src/price-board.component";
import { PriceFeedService, SettingsService } from "../src/price-feed.service";

test("ราคาอัปเดตเมื่อมี tick", () => {
  const feed = new PriceFeedService();
  const board = new PriceBoardComponent(feed, new SettingsService());
  board.ngOnInit();
  feed.pushTick({ symbol: "PTT", price: 34 });
  assert.equal(board.prices["PTT"], 34);
});

test("เปลี่ยนสกุลเงินได้", () => {
  const settings = new SettingsService();
  const board = new PriceBoardComponent(new PriceFeedService(), settings);
  board.ngOnInit();
  settings.setCurrency("USD");
  assert.equal(board.currency, "USD");
});

test("แจ้งเตือนเมื่อตลาดเปิดและราคาเกินเกณฑ์", () => {
  const feed = new PriceFeedService();
  const board = new PriceBoardComponent(feed, new SettingsService(), 100);
  board.ngOnInit();
  feed.setStatus("open");
  feed.pushTick({ symbol: "DELTA", price: 150 });
  feed.pushTick({ symbol: "PTT", price: 34 });
  assert.deepEqual(board.alerts, ["DELTA"]);
});
