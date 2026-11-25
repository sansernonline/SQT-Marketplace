export class TokenBucket {
  constructor({ capacity, refillPerSec, now = Date.now }) { this.capacity = capacity; this.rate = refillPerSec; this.now = now; this.tokens = capacity; this.at = now(); }
  take(n = 1) {
    if (n > this.capacity) throw new RangeError("n มากกว่า capacity");
    const t = this.now(); this.tokens = Math.min(this.capacity, this.tokens + ((t - this.at) / 1000) * this.rate); this.at = t;
    if (this.tokens < n) return false;
    this.tokens -= n; return true;
  }
}
