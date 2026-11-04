# Parallelization และ CI Integration

ระดับการรันขนาน รอบการรัน end-to-end (E2E) ใน continuous integration (CI) และไฟล์ที่ต้องเก็บไว้เมื่อเทสต์ล้ม

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | 🟢 Low (just enable) |
| Test-level within file | 10x+ | 🟡 Med (isolation needed) |
| Sharded across CI workers | Nx | 🟡 Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | 🔴 High (cost) |

**Requirements for safe parallel:**
- Tests don't share state
- Unique test data per test
- Database/external services support concurrency

**ตกลงกติกาก่อนรันพร้อมกันหลาย agent หรือหลาย worker** (ตัวอย่างจากงานทดสอบร้านค้าออนไลน์ ที่ reset ล้างข้อมูลทั้งเซิร์ฟเวอร์ รันพร้อมกัน 6 agent):

| กติกา | กันอะไร |
|---|---|
| reset ครั้งเดียวก่อนเริ่มรันรวม ระหว่างรันไม่มี agent ไหน reset (ตั้งตัวแปร เช่น `PP_SKIP_RESET=1`) และแต่ละ agent เก็บผลในโฟลเดอร์ของตัวเอง | ลบข้อมูลและไฟล์ผลของกัน |
| test ที่ซื้อของใช้สินค้าคนละตัว ไม่ใช้ตัวที่ test อื่นตรวจสต็อกอยู่ | สต็อกชนกัน |
| อีเมลบัญชีใหม่ใส่ `{run}` (ชื่อ project + เวลาเริ่มรอบ) | รันรอบ 2 ได้ "อีเมลนี้ถูกใช้แล้ว" (แผนหนึ่งมี 30 test ที่รันซ้ำไม่ได้ เหลือ 0 หลังแก้) |
| test ที่ชน rate limit ใช้บัญชีของตัวเอง และรันท้ายสุด | ตัวนับค้างข้าม test |
| test ที่ใช้สถานะกลางร่วมกันและแยกไม่ได้ → `workers: 1` · `fullyParallel: false` | ผลเพี้ยนแบบสุ่ม |

## CI Integration

### Run E2E tier
```yaml
# Smoke (every pull request (PR), 2 min)
- 5-10 critical tests
- Chromium only → feedback เร็ว
- Fail = block merge

# Full (merge to main + nightly, 30 min)
- All E2E tests
- Chromium (desktop) + WebKit (iPhone viewport)
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P1 + P2 tests (test-case-template scale: P1 = most important)
- Chromium + WebKit + Firefox (ครั้งเดียวก่อน release)
- Must pass before prod deploy
```

### Browser matrix

ไม่ต้องรันครบ 3 browser ทุกรอบ → เวลา CI เพิ่ม ~3 เท่า และเทสต์ flaky เพิ่มตามจำนวน browser

| Browser | ครอบคลุม | รันตอนไหน |
|---------|----------|-----------|
| Chromium | Chrome · Edge (ผู้ใช้ส่วนใหญ่) | ทุกรอบ |
| WebKit | ทุก browser บน iPhone/iPad (รวม Chrome บน iOS) | merge to main · nightly · pre-prod |
| Firefox | ส่วนแบ่งน้อย | pre-prod เท่านั้น · ตัดได้ถ้าลูกค้าไม่ใช้ |

ปรับตามผู้ใช้จริง → ดู analytics ก่อน ถ้าลูกค้าองค์กรบังคับ Firefox ให้ย้ายขึ้นไปรอบ nightly

ตั้งเป็น project ใน Playwright แล้วเลือกด้วย `--project`

```ts
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit-mobile', use: { ...devices['iPhone 15'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
],
```

```bash
npx playwright test --project=chromium                          # PR
npx playwright test --project=chromium --project=webkit-mobile  # main · nightly
npx playwright test                                             # pre-prod (ครบ 3)
```

**เทสต์ที่ควรรันข้าม browser** (tag `@cross-browser`) → จุดที่มักพังต่าง browser:
- date/time input
- อัปโหลดไฟล์ · clipboard
- จัดรูปแบบวันที่/ตัวเลขด้วย `Intl`
- CSS layout · scroll · sticky
- autoplay วิดีโอ/เสียง

เทสต์ที่เป็น logic ล้วน → Chromium ตัวเดียวพอ

> WebKit ของ Playwright ไม่ใช่ Safari ตัวจริง 100% → งานที่ลูกค้าใช้ iPhone เยอะ ให้ลองบนเครื่องจริงก่อน release อีกรอบ

### Artifacts to capture
- Screenshots on failure
- Video on failure
- Trace files (Playwright)
- Console logs
- Network logs
