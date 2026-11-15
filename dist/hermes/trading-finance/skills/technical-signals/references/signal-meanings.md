# Signal meanings in plain Thai and a worked example

Moved from `SKILL.md` (technical-signals) · 1 · meanings and false signals · 2 · worked example

## 1 · Plain-Thai meaning and false-signal warnings

| Signal | ภาษาง่าย | Common false signal | What would prove it wrong |
|---|---|---|---|
| Price above rising 200-day | แนวโน้มใหญ่ยังเป็นขาขึ้น | In a sideways market price crosses the MA every few weeks | Close below the 200-day for several days while it turns flat/down |
| Golden cross 50/200 | เส้นเร็วตัดขึ้นเส้นช้า แนวโน้มเปลี่ยนเป็นขึ้น | Lags badly — often fires after most of the move | Price falls back below the 50-day within weeks |
| RSI > 70 | ราคาวิ่งเร็ว ตึงตัว | In strong uptrends RSI stays above 70 for weeks; shorting it is costly | — (it only says "stretched") |
| RSI < 30 | ราคาลงแรง ตึงตัวขาลง | In crashes RSI stays below 30 while price keeps falling | New low with RSI still falling |
| RSI divergence (price new high, RSI lower high) | แรงส่งเริ่มอ่อน | Can persist for months | Price and RSI both make new highs |
| MACD cross up | แรงส่งเริ่มกลับขึ้น | Many whipsaws in sideways markets, especially below zero line | Crosses back down within a few bars |
| Breakout on high volume | มีคนซื้อจริงหนุน | One-day spike on news, then gives back | Close back inside the old range within 3 days |
| Breakout on low volume | ทะลุแต่ไม่มีแรงหนุน | Usually fails (false breakout) | — treat as unconfirmed |

## 2 · Worked example (daily chart, illustrative numbers)

Stock ABC, close 48.50. 50-day SMA 46.20 (rising), 200-day SMA 44.00 (rising). RSI(14) 66. MACD 0.42 above signal 0.31, both above zero. Today broke above the 3-month high of 48.00 on volume 2.1× the 20-day average. Swing lows at 46.00 and 44.50.

| Check | Read |
|---|---|
| Trend | Price > 50 > 200, both rising → uptrend |
| Momentum | RSI 66: strong but not yet stretched; MACD positive |
| Volume | 2.1× average on breakout → real participation |
| Support | 48.00 (old high, now support), 46.00 |
| Resistance | None nearby on this chart — use round number 50.00 |
| **Invalidation** | Close back below 48.00 within 3 days = failed breakout; below 46.00 = trend read wrong |

Plain answer: "แนวโน้มขาขึ้น ทะลุกรอบพร้อมวอลุ่มหนุน ถ้าปิดกลับใต้ 48.00 ภายใน 3 วัน ถือว่าทะลุหลอก" — then size from a stop under 48.00 or 46.00 with `position-sizing`.
