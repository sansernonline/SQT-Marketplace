import { EMPTY, Subject, fromEvent } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { PriceFeedService, SettingsService } from "./price-feed.service";

// หน้าจอกระดานราคา · เปิดปิดบ่อยตามที่ผู้ใช้สลับแท็บ
export class PriceBoardComponent {
  prices: Record<string, number> = {};
  currency = "THB";
  alerts: string[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly feed: PriceFeedService,
    private readonly settings: SettingsService,
    readonly alertAbove = 100,
  ) {}

  ngOnInit(): void {
    this.feed
      .ticks$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tick) => {
        this.prices[tick.symbol] = tick.price;
      });

    // ตลาดเปิดแล้วค่อยเริ่มแจ้งเตือนราคาสูง · switchMap ตัดตัวเก่าทิ้งทุกครั้งที่สถานะเปลี่ยน
    this.feed
      .status$()
      .pipe(
        switchMap((status) => (status === "open" ? this.feed.ticks$() : EMPTY)),
        filter((tick) => tick.price > this.alertAbove),
        takeUntil(this.destroy$),
      )
      .subscribe((tick) => this.alerts.push(tick.symbol));

    fromEvent<string>(this.settings.events, "currency")
      .pipe(takeUntil(this.destroy$))
      .subscribe((currency) => {
        this.currency = currency;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
