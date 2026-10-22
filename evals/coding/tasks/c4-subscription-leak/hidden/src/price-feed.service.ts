import { EventEmitter } from "node:events";
import { Observable, Subject } from "rxjs";

export interface PriceTick {
  symbol: string;
  price: number;
}

export type MarketStatus = "open" | "closed";

// บริการราคาที่ทั้งแอปใช้ร่วมกัน (สร้างครั้งเดียว อยู่ตลอดอายุแอป)
export class PriceFeedService {
  readonly ticks = new Subject<PriceTick>();
  readonly status = new Subject<MarketStatus>();

  ticks$(): Observable<PriceTick> {
    return this.ticks.asObservable();
  }

  status$(): Observable<MarketStatus> {
    return this.status.asObservable();
  }

  pushTick(tick: PriceTick): void {
    this.ticks.next(tick);
  }

  setStatus(status: MarketStatus): void {
    this.status.next(status);
  }
}

// ค่าตั้งของผู้ใช้ · ส่ง event "currency" เมื่อเปลี่ยนสกุลเงิน
export class SettingsService {
  readonly events = new EventEmitter();

  setCurrency(currency: string): void {
    this.events.emit("currency", currency);
  }
}
