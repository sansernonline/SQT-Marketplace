import { test } from "node:test";
import assert from "node:assert/strict";
import { PriceBoardComponent } from "../src/price-board.component";
import { PriceFeedService, SettingsService } from "../src/price-feed.service";

function openAndCloseMany(times: number) {
  const feed = new PriceFeedService();
  const settings = new SettingsService();
  for (let i = 0; i < times; i++) {
    const board = new PriceBoardComponent(feed, settings);
    board.ngOnInit();
    feed.setStatus("open");
    board.ngOnDestroy();
  }
  return { feed, settings };
}

test("เปิดปิด 100 ครั้ง ไม่เหลือผู้ฟัง ticks", () => {
  const { feed } = openAndCloseMany(100);
  assert.equal(feed.ticks.observed, false);
});

test("เปิดปิด 100 ครั้ง ไม่เหลือผู้ฟัง status", () => {
  const { feed } = openAndCloseMany(100);
  assert.equal(feed.status.observed, false);
});

test("เปิดปิด 100 ครั้ง ไม่เหลือ listener ของ currency", () => {
  const { settings } = openAndCloseMany(100);
  assert.equal(settings.events.listenerCount("currency"), 0);
});

test("ปิดแล้ว ค่าบนจอไม่เปลี่ยนตาม tick และสกุลเงินอีก", () => {
  const feed = new PriceFeedService();
  const settings = new SettingsService();
  const board = new PriceBoardComponent(feed, settings, 100);
  board.ngOnInit();
  feed.setStatus("open");
  board.ngOnDestroy();
  feed.pushTick({ symbol: "DELTA", price: 150 });
  settings.setCurrency("USD");
  assert.equal(board.prices["DELTA"], undefined);
  assert.deepEqual(board.alerts, []);
  assert.equal(board.currency, "THB");
});

test("ตลาดเปิดซ้ำ 2 ครั้ง แจ้งเตือนไม่ซ้ำ", () => {
  const feed = new PriceFeedService();
  const board = new PriceBoardComponent(feed, new SettingsService(), 100);
  board.ngOnInit();
  feed.setStatus("open");
  feed.setStatus("open");
  feed.pushTick({ symbol: "DELTA", price: 150 });
  assert.deepEqual(board.alerts, ["DELTA"]);
  board.ngOnDestroy();
});

test("ตลาดปิดแล้วหยุดแจ้งเตือน แต่ราคายังอัปเดต", () => {
  const feed = new PriceFeedService();
  const board = new PriceBoardComponent(feed, new SettingsService(), 100);
  board.ngOnInit();
  feed.setStatus("open");
  feed.setStatus("closed");
  feed.pushTick({ symbol: "DELTA", price: 150 });
  assert.deepEqual(board.alerts, []);
  assert.equal(board.prices["DELTA"], 150);
  board.ngOnDestroy();
});

test("ระหว่างเปิดอยู่ ทุกอย่างยังอัปเดต", () => {
  const feed = new PriceFeedService();
  const settings = new SettingsService();
  const board = new PriceBoardComponent(feed, settings, 100);
  board.ngOnInit();
  feed.setStatus("open");
  feed.pushTick({ symbol: "PTT", price: 34 });
  feed.pushTick({ symbol: "DELTA", price: 150 });
  settings.setCurrency("USD");
  assert.equal(board.prices["PTT"], 34);
  assert.deepEqual(board.alerts, ["DELTA"]);
  assert.equal(board.currency, "USD");
  board.ngOnDestroy();
});

test("ปิดกระดานหนึ่ง กระดานอื่นและผู้ฟังอื่นยังได้ข้อมูล", () => {
  const feed = new PriceFeedService();
  const settings = new SettingsService();
  const a = new PriceBoardComponent(feed, settings, 100);
  const b = new PriceBoardComponent(feed, settings, 100);
  a.ngOnInit();
  b.ngOnInit();
  const seen: number[] = [];
  const currencies: string[] = [];
  const outside = feed.ticks$().subscribe((t) => seen.push(t.price));
  const onCurrency = (c: string) => currencies.push(c);
  settings.events.on("currency", onCurrency);
  a.ngOnDestroy();
  feed.setStatus("open");
  feed.pushTick({ symbol: "DELTA", price: 150 });
  settings.setCurrency("USD");
  assert.equal(b.prices["DELTA"], 150);
  assert.deepEqual(b.alerts, ["DELTA"]);
  assert.equal(b.currency, "USD");
  assert.deepEqual(seen, [150]);
  assert.deepEqual(currencies, ["USD"]);
  outside.unsubscribe();
  settings.events.off("currency", onCurrency);
  b.ngOnDestroy();
});
