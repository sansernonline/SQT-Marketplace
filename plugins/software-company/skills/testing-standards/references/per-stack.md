# ตั้งค่าและตัวอย่างต่อสแต็ก

> ตัวอย่างในไฟล์นี้ **ยังไม่ได้รันทดสอบ** เป็นการตั้งค่ามาตรฐานของแต่ละ framework
> ให้รันครั้งแรกแล้วดูว่าคำสั่งและ path ตรงกับโครงโปรเจกต์จริงหรือไม่

---

## .NET — xUnit

```bash
dotnet new xunit -o tests/MyApp.Tests
dotnet add tests/MyApp.Tests reference src/MyApp
dotnet add tests/MyApp.Tests package FluentAssertions      # assert ที่อ่านเป็นประโยค
dotnet add tests/MyApp.Tests package NSubstitute           # mock ที่ syntax สั้นกว่า Moq
dotnet add tests/MyApp.Tests package Microsoft.AspNetCore.Mvc.Testing   # integration
dotnet add tests/MyApp.Tests package Testcontainers.PostgreSql
```

```csharp
public class DiscountCalculatorTests
{
    [Fact]
    public void CalculateDiscount_WhenMemberIsGold_Returns15Percent()
    {
        // Arrange
        var sut = new DiscountCalculator();

        // Act
        var result = sut.Calculate(new Order { Total = 1000m }, MemberTier.Gold);

        // Assert
        result.Should().Be(150m);
    }

    // Theory = ทดสอบหลายเคสด้วยโค้ดชุดเดียว — ห้ามเขียนลูปเอง
    [Theory]
    [InlineData(MemberTier.None, 0)]
    [InlineData(MemberTier.Silver, 50)]
    [InlineData(MemberTier.Gold, 150)]
    public void CalculateDiscount_ByTier_ReturnsExpected(MemberTier tier, decimal expected)
        => new DiscountCalculator().Calculate(new Order { Total = 1000m }, tier)
               .Should().Be(expected);
}
```

Integration ผ่าน `WebApplicationFactory` — ยิง HTTP จริงเข้า pipeline จริงโดยไม่ต้องเปิดพอร์ต:

```csharp
public class OrdersApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task GetOrders_WhenNotAuthenticated_Returns401()
    {
        var res = await factory.CreateClient().GetAsync("/api/v1/orders");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

```bash
dotnet test                                        # ทั้งหมด
dotnet test --filter "FullyQualifiedName!~Integration"   # เฉพาะ unit
dotnet test --collect:"XPlat Code Coverage"
```

---

## Node / TypeScript — Vitest

```bash
npm i -D vitest @vitest/coverage-v8
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // ไฟล์ setup ใช้ตั้ง fake timer / ล้าง mock ให้ทุกไฟล์เหมือนกัน
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.dto.ts', 'src/**/index.ts'],
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
});
```

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountCalculator } from '../src/discount';

describe('DiscountCalculator', () => {
  beforeEach(() => vi.restoreAllMocks());   // กันสถานะรั่วข้าม test

  it('calculateDiscount_whenMemberIsGold_returns15Percent', () => {
    const sut = new DiscountCalculator();
    expect(sut.calculate({ total: 1000 }, 'gold')).toBe(150);
  });

  it.each([
    ['none', 0], ['silver', 50], ['gold', 150],
  ])('calculateDiscount_byTier_%s', (tier, expected) => {
    expect(new DiscountCalculator().calculate({ total: 1000 }, tier)).toBe(expected);
  });
});
```

คุมเวลาแทนการ `sleep`:

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15T10:00:00+07:00'));
await vi.advanceTimersByTimeAsync(5000);   // เดินเวลา 5 วิ ทันที
vi.useRealTimers();
```

```json
{ "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:cov": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts"
} }
```

> **Jest แทน Vitest:** API เกือบเหมือนกัน (`jest.fn` ↔ `vi.fn`) แต่ต้องตั้ง `ts-jest`
> หรือ babel เพิ่มสำหรับ TypeScript · เลือก Jest เมื่อทีมคุ้นอยู่แล้วหรือมี preset ที่ต้องใช้

---

## Python — pytest

```bash
pip install pytest pytest-cov pytest-randomly
```

`pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q --strict-markers --cov=src --cov-report=term-missing"
markers = ["integration: ต้องมี DB/network — รันแยกจาก unit"]
```

```python
import pytest
from src.discount import calculate_discount

def test_calculate_discount_when_member_is_gold_returns_15_percent():
    assert calculate_discount(total=1000, tier="gold") == 150

@pytest.mark.parametrize("tier,expected", [("none", 0), ("silver", 50), ("gold", 150)])
def test_calculate_discount_by_tier(tier, expected):
    assert calculate_discount(total=1000, tier=tier) == expected

@pytest.mark.integration
def test_create_order_persists_to_db(db_session):
    ...
```

`conftest.py` — fixture ที่ใช้ร่วมกัน (คืนสถานะเดิมทุก test):

```python
import pytest

@pytest.fixture
def db_session(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield Session(bind=conn)
    tx.rollback()          # ทุก test เริ่มจากฐานสะอาดเสมอ
    conn.close()
```

```bash
pytest                        # ทั้งหมด (pytest-randomly สลับลำดับให้เอง = จับ test ที่พึ่งกัน)
pytest -m "not integration"   # เฉพาะ unit
pytest --lf                   # เฉพาะที่แดงรอบก่อน
```

---

## Angular

**Vitest + Testing Library** (โปรเจกต์ใหม่ — เร็วกว่า Karma มาก ไม่ต้องเปิดเบราว์เซอร์จริง)

```bash
npm i -D vitest @analogjs/vite-plugin-angular jsdom \
         @testing-library/angular @testing-library/user-event
```

```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { OrderFormComponent } from './order-form.component';

it('orderForm_whenSubmitWithEmptyName_showsRequiredError', async () => {
  await render(OrderFormComponent);

  await userEvent.click(screen.getByRole('button', { name: /บันทึก/ }));

  expect(await screen.findByText(/กรุณากรอกชื่อ/)).toBeTruthy();
});
```

> ทดสอบจาก**มุมผู้ใช้** — หาปุ่มด้วยข้อความที่คนเห็น (`getByRole`, `getByText`)
> ไม่ใช่ `By.css('.btn-primary')` เพราะพอเปลี่ยนคลาส CSS test จะแดงทั้งที่ UI ยังทำงานถูก

**Jasmine + Karma** (ค่าเริ่มต้นเดิมของ Angular — ใช้ต่อได้ถ้าโปรเจกต์มีอยู่แล้ว):

```ts
describe('DiscountService', () => {
  let service: DiscountService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DiscountService] });
    service = TestBed.inject(DiscountService);
  });

  it('calculate_whenMemberIsGold_returns15Percent', () => {
    expect(service.calculate(1000, 'gold')).toBe(150);
  });
});
```

```bash
ng test --watch=false --browsers=ChromeHeadless --code-coverage    # สำหรับ CI
```

---

## ตารางเทียบ

| เรื่อง | xUnit | Vitest | pytest | Angular (Vitest) |
|---|---|---|---|---|
| หลายเคส | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` |
| ก่อน/หลังแต่ละ test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` |
| คุมเวลา | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` |
| DB จริง | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` |
| สลับลำดับ | ไม่มีในตัว | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` |
