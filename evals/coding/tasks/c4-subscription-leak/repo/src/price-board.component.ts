import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
import { PriceFeedService, SettingsService } from "./price-feed.service";

// หน้าจอกระดานราคา · เปิดปิดบ่อยตามที่ผู้ใช้สลับแท็บ
export class PriceBoardComponent {
  prices: Record<string, number> = {};
  currency = "THB";
  alerts: string[] = [];

  constructor(
    private readonly feed: PriceFeedService,
    private readonly settings: SettingsService,
    readonly alertAbove = 100,
  ) {}

  ngOnInit(): void {
    this.feed.ticks$().subscribe((tick) => {
      this.prices[tick.symbol] = tick.price;
    });

    // ตลาดเปิดแล้วค่อยเริ่มแจ้งเตือนราคาสูง
    this.feed.status$().subscribe((status) => {
      if (status === "open") {
        this.feed
          .ticks$()
          .pipe(filter((tick) => tick.price > this.alertAbove))
          .subscribe((tick) => this.alerts.push(tick.symbol));
      }
    });

    fromEvent<string>(this.settings.events, "currency").subscribe((currency) => {
      this.currency = currency;
    });
  }

  ngOnDestroy(): void {}
}
