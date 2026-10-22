// นับ subscription ที่ค้างหลังเปิดปิดกระดานราคา 100 ครั้ง · พิมพ์ JSON บรรทัดเดียว
import { PriceBoardComponent } from "../src/price-board.component";
import { PriceFeedService, SettingsService } from "../src/price-feed.service";

const feed = new PriceFeedService();
const settings = new SettingsService();
for (let i = 0; i < 100; i++) {
  const board = new PriceBoardComponent(feed, settings);
  board.ngOnInit();
  feed.setStatus("open");
  board.ngOnDestroy();
}
const left = feed.ticks.observers.length + feed.status.observers.length + settings.events.listenerCount("currency");
console.log(JSON.stringify({ subscriptions_after_destroy: left }));
