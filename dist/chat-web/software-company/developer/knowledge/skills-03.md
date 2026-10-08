# skill: testing-standards

Use when adding or setting up automated tests in .NET, Node, Python, Angular or Flutter, or a suite is slow or flaky. What to test, naming, coverage.

# Testing Standards

> **กฎข้อเดียว:** test ที่ไม่มีใครเชื่อถือ แย่กว่าไม่มี test
> test ที่แดงสลับเขียวเองจะถูก `skip` ภายใน 2 สัปดาห์ แล้วทั้งชุดจะตายตามกันไป

## เมื่อไหร่ใช้ skill นี้

- เริ่มวาง test ในโปรเจกต์ใหม่ หรือเพิ่ม test ให้โค้ดที่มีอยู่
- มีคนขอ "ให้มี unit test / automate test"
- ชุด test เดิมช้า แดง ๆ เขียว ๆ หรือไม่มีใครดูแล้ว

## เมื่อไหร่ **ไม่** ใช้

- E2E ผ่านเบราว์เซอร์ (Playwright/Cypress) ให้ใช้ `e2e-testing-patterns`
- ขับแอปมือถือจริงบน emulator ให้ใช้ `app-verifier-setup` (`references/android-native.md`)
- ออกแบบ test case เชิงธุรกิจก่อนลงมือเขียน ให้ใช้ `test-case-template`

---

## 1 · ขั้นแรก: ใช้ของที่มี ถามเฉพาะตอนต้องเพิ่มตัวใหม่

- **ถ้าโปรเจกต์มี framework อยู่แล้ว หรือสแต็กมี test library มากับ SDK** (Flutter `flutter_test` · Angular CLI) ให้ใช้เลย ไม่ต้องถาม
- **ถ้าต้องลงแพ็กเกจ test ตัวใหม่** ให้ใส่คำถามนี้ไว้ในการถามครั้งเดียวก่อนเริ่มงาน (ถ้าเครื่องมือมีหน้าต่างให้เลือกคำตอบ เช่น `AskUserQuestion` ก็ใช้ตัวนั้น) เพราะถ้าเลือกผิดแล้วย้ายทีหลังจะแพงมาก
- ถ้าเริ่มงานไปแล้วเพิ่งรู้ว่าต้องเลือก ให้เลือกตัว**แนะนำ**ในตารางแล้วทำต่อ จากนั้นบันทึกไว้ในหัวข้อ "ตัดสินใจเอง" ของรายงาน ไม่ต้องหยุดถามกลางทาง

2 เรื่องที่ต้องตกลง:

**ข้อ 1 — framework**

| สแต็ก | ตัวเลือกที่ควรเสนอ |
|---|---|
| .NET | **xUnit** (แนะนำ · เป็นมาตรฐานของ .NET ยุคใหม่) · NUnit (ทีมมาจาก NUnit เดิม) · MSTest (องค์กรที่ผูกกับ VS) |
| Node/TS | **Vitest** (แนะนำ · เร็ว ตั้งค่าน้อย ใช้ ESM/TS ได้เลย) · Jest (ระบบนิเวศใหญ่ที่สุด) · `node:test` (ไม่อยากลงอะไรเลย) |
| Python | **pytest** (แนะนำ) · `unittest` (stdlib ล้วน ห้ามลงแพ็กเกจเพิ่ม) |
| Angular | **Vitest + Testing Library** (แนะนำสำหรับโปรเจกต์ใหม่) · Jasmine + Karma (ค่าเริ่มต้นเดิมของ Angular) |
| Flutter · Dart | **`flutter_test`** (มากับ SDK ไม่ต้องถาม) · fake ด้วยคลาสที่ `implements` ของจริง ก่อนจะลง `mocktail` |

**ข้อ 2 — ขอบเขตที่ต้องการตอนนี้**

- unit อย่างเดียว (เร็ว ไม่แตะ DB/network)
- unit + integration (แตะ DB จริงผ่าน Testcontainers / SQLite in-memory)
- ครบชุดรวม E2E (ต่อยอดไป `e2e-testing-patterns`)

> ถ้าโปรเจกต์**มี framework อยู่แล้ว** ก็ไม่ต้องถาม ใช้ของเดิมไป เพราะการมี 2 ระบบในโปรเจกต์เดียว
> แย่กว่าใช้ของที่ไม่ถูกใจนัก

---

## 2 · พีระมิด — สัดส่วนที่ยั่งยืน

```
        ▲  E2E  5%      ช้า เปราะ แพง — เอาไว้ทดสอบ "เส้นทางที่ทำเงิน" เท่านั้น
       ╱ ╲
      ╱   ╲ Integration 20%   ต่อ DB/API จริง ทดสอบว่าชิ้นส่วนคุยกันรู้เรื่อง
     ╱     ╲
    ╱       ╲ Unit 75%        ไม่แตะอะไรข้างนอก รันจบใน < 100ms ต่อตัว
   ╱_________╲
```

**แอปมือถือมีชั้น widget test (Flutter) หรือ component test (React Native)** อยู่ระหว่าง unit กับ E2E ชั้นนี้สร้างหน้าจอจริงในหน่วยความจำ แล้วกดและอ่านได้โดยไม่ต้องมี emulator แอปมือถือส่วนใหญ่ไม่มี integration ที่ต่อ DB จึงใช้ชั้นนี้เป็นชั้นกลางหลักแทน

**ชุด unit ทั้งหมดต้องรันจบใน 10 วินาที** (Flutter: นับหลังคอมไพล์เสร็จ เพราะแค่เริ่ม `flutter test` ก็กินหลายวินาที · ตัวเลขนี้รอยืนยันบนเครื่องจริง)
ถ้าเกินนี้ คนจะเลิกรันก่อน commit แล้ว test ที่พังจะไปเจอที่ CI เท่านั้น ซึ่งช้าเกินไป

---

## 3 · อะไรควรมี test / อะไรไม่ต้อง

**ต้องมี**
- ตรรกะทางธุรกิจ: การคำนวณ, เงื่อนไขสิทธิ์, การเปลี่ยนสถานะ
- ทุกกรณีขอบ: ค่าว่าง, ศูนย์, ติดลบ, ขอบเขตล่าง/บน, ค่าซ้ำ
- **ทุกบั๊กที่เคยเกิด** — เขียน test ที่แดงก่อน แล้วค่อยแก้ (regression test)
- สัญญาที่คนอื่นพึ่งพา: รูปแบบ response ของ API, schema ของ event

**ไม่ต้องมี**
- getter/setter, DTO, mapping ตรง ๆ
- โค้ดของเฟรมเวิร์ก (ไม่ต้อง test ว่า EF Core บันทึกได้ไหม)
- ไลบรารีของคนอื่น
- UI ที่แค่แสดงผลโดยไม่มีตรรกะ

> **Coverage ที่ซื่อสัตย์: 70–80% ของ business logic** ไม่ใช่ 100% ของทั้งโปรเจกต์
> ไล่ตาม 100% จะได้ test ปลอม ๆ ที่เขียนเพื่อให้ตัวเลขสวยเต็มไปหมด
> ตั้ง gate ที่ "ห้ามลดลงจากเดิม" มีประโยชน์กว่าตั้งเลขเป้า

---

## 4 · เขียนยังไง

**ตั้งชื่อ** — อ่านชื่อแล้วต้องรู้ว่าพังอะไรโดยไม่ต้องเปิดโค้ด

```
MethodName_Scenario_ExpectedResult

CalculateDiscount_WhenMemberIsGold_Returns15Percent
CreateOrder_WhenStockIsZero_ThrowsOutOfStock
ParseDate_WhenInputIsEmpty_ReturnsNull
```

ภาษาที่ชื่อ test เป็นข้อความ (Dart · Vitest · Jest) ใช้ `group('<สิ่งที่ทดสอบ>')` + `test('<สถานการณ์> → <ผลที่ต้องได้>')` เป็นประโยค เช่น `group('verdict')` · `test('below 50 lux is too dark for reading')`

**โครง AAA** — เว้นบรรทัดคั่น 3 ส่วนให้เห็นชัด

```
// Arrange   เตรียมข้อมูลและ dependency
// Act       เรียกสิ่งที่ทดสอบ — บรรทัดเดียว
// Assert    ตรวจผล
```

**1 test = 1 เหตุผลที่จะพัง** ถ้ามี assert 5 อันที่ไม่เกี่ยวกัน ให้แยกเป็น 5 test

**ห้ามมี logic ใน test** — ไม่มี `if`, ไม่มีลูปที่คำนวณค่าคาดหวัง
ถ้าอยากรันหลายเคส ใช้ parameterized test (`[Theory]` / `test.each` / `@pytest.mark.parametrize`)

**ทำให้ผลเหมือนเดิมทุกครั้ง**
- เวลา: inject `IClock`/`now()` ไม่เรียก `DateTime.Now` ตรง ๆ ในโค้ดที่ทดสอบ
- สุ่ม: fix seed
- ลำดับ: test ต้องรันสลับลำดับได้ ห้ามพึ่งสถานะที่ test ก่อนหน้าทิ้งไว้
- **ห้าม `sleep`** เพื่อรอ async — ใช้ fake timer หรือรอ signal จริง

**Mock เท่าที่จำเป็น** — mock ขอบเขตนอกระบบ (HTTP, คิว, เวลา, ไฟล์)
ไม่ mock คลาสของตัวเองที่คำนวณล้วน ๆ ถ้า mock เยอะเกินไป แปลว่า test ผูกกับวิธีเขียนโค้ด
พอ refactor ทีเดียว test แดงทั้งชุด ทั้งที่พฤติกรรมไม่เปลี่ยน

---

## 5 · Integration test

- ใช้ **DB จริงชนิดเดียวกับ production** (Testcontainers) ไม่ใช่ SQLite แทน PostgreSQL
  เพราะ SQL ที่ผ่านบน SQLite อาจพังบนของจริง
- แต่ละ test เริ่มจากสถานะที่รู้แน่ — transaction rollback หรือ truncate ทุกครั้ง
- แยก command ออกจาก unit เพื่อให้รันแยกกันได้ (`npm run test:unit` / `test:integration`)
- ทดสอบ **สัญญา** ของ API: status code, รูปร่าง JSON, header สำคัญ — ไม่ใช่แค่ "ไม่ error"

---

## 6 · CI

```
push / PR → lint → unit (< 10 วินาที) → integration → build
```

- **test แดง = merge ไม่ได้** ไม่มีข้อยกเว้น
- ห้ามมี `skip`/`ignore` ค้างในสาขาหลัก — ถ้าจะ skip ต้องมีลิงก์ issue กำกับ
- test ที่ flaky (แดงสลับเขียวเอง) ต้อง**แก้หรือลบ** ห้าม retry จนกว่าจะเขียว เพราะนั่นคือการซ่อนบั๊ก
- รายงาน coverage ในหน้า PR ให้เห็นว่าเพิ่มหรือลด

รายละเอียดคำสั่งและไฟล์ config ของแต่ละ framework อยู่ใน `references/per-stack.md`

---

## 7 · ตรวจงาน

- [ ] ใช้ framework ของเดิมหรือที่มากับสแต็ก ถ้าลงตัวใหม่ ต้องถามแล้วหรือบันทึกไว้ใน "ตัดสินใจเอง"
- [ ] `npm test` / `dotnet test` / `pytest` / `flutter test` รันผ่านจากเครื่องเปล่าโดยไม่ต้องตั้งค่าอะไรเพิ่ม
- [ ] ชุด unit รันจบใน 10 วินาที
- [ ] ลองสลับลำดับ test แล้วยังเขียวหมด (`pytest -p no:randomly --lf` / `--shuffle`)
- [ ] รันซ้ำ 3 รอบได้ผลเหมือนเดิม (ไม่ flaky)
- [ ] แก้โค้ดให้พังโดยตั้งใจ 1 จุด แล้ว test **ต้องแดง** — ถ้ายังเขียว แปลว่า test ไม่ได้ทดสอบอะไร
- [ ] ชื่อ test อ่านแล้วรู้ว่าพังอะไรโดยไม่ต้องเปิดโค้ด
- [ ] ไม่มี `sleep` / `Thread.Sleep` ในชุด test
- [ ] ไม่มี test ที่ถูก skip ค้างโดยไม่มีเหตุผลกำกับ

---

## 8 · Anti-patterns

- ❌ **เขียน test หลังจบงานเพื่อให้ผ่าน gate** — ได้ test ที่ยืนยันว่าโค้ดทำสิ่งที่มันทำ
  ไม่ใช่สิ่งที่มันควรทำ
- ❌ **assert ว่า "ไม่ throw"** เฉย ๆ — ไม่ได้ทดสอบอะไรเลย
- ❌ **test ที่พึ่ง test ก่อนหน้า** — พอรันเดี่ยว ๆ แดงทันที
- ❌ **mock ทุกอย่างจน test ทดสอบแค่ mock**
- ❌ **`sleep(1000)` รอ async** — ช้าและยังเปราะอยู่ดี
- ❌ **retry flaky test จนเขียว** — คุณเพิ่งซ่อนบั๊กที่เกิดจริงใน production
- ❌ **ไล่ coverage 100%** — เขียน test ให้ getter เพื่อตัวเลข
- ❌ **ข้อมูลทดสอบเป็นข้อมูลลูกค้าจริง** — ผิดกฎหมายและหลุดง่าย ใช้ตัวสร้างข้อมูลปลอม

---

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| E2E ผ่านเบราว์เซอร์ | `e2e-testing-patterns` |
| E2E แอปมือถือ (`integration_test` · `adb`) | `app-verifier-setup` |
| ออกแบบ test case ก่อนเขียนโค้ด | `test-case-template` |
| ทดสอบ endpoint health/ping | `web-service-essentials` |
| log ที่ช่วยไล่ปัญหาตอน test แดง | `logging-standards` |
| review โค้ด test | `code-review-checklist` |


## reference: per-stack.md

# ตั้งค่าและตัวอย่างต่อสแต็ก

> ตัวอย่างในไฟล์นี้ **ยังไม่ได้รันทดสอบ** (ยกเว้นหัวข้อ Flutter ที่มาจากแอปจริง Lumio) ส่วนที่เหลือเป็นการตั้งค่ามาตรฐานของแต่ละ framework
> ตอนรันครั้งแรกให้ดูว่าคำสั่งและ path ตรงกับโครงโปรเจกต์จริงไหม

---

## สารบัญ

1. [.NET — xUnit](#net--xunit)
2. [Node / TypeScript — Vitest](#node--typescript--vitest)
3. [Python — pytest](#python--pytest)
4. [Angular](#angular)
5. [Flutter / Dart — flutter_test](#flutter--dart--flutter_test)
6. [ตารางเทียบ](#ตารางเทียบ)

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
> หรือ babel เพิ่มสำหรับ TypeScript เลือก Jest เมื่อทีมคุ้นอยู่แล้วหรือมี preset ที่ต้องใช้

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

## Flutter / Dart — flutter_test

มากับ SDK ไม่ต้องลงอะไร ไฟล์ test อยู่ใน `test/` และล้อโครง `lib/` (`lib/features/measure/lux_math.dart` → `test/features/measure/lux_math_test.dart`) ส่วนชื่อไฟล์ใช้ snake_case ตามธรรมเนียม Dart

```dart
// fake ของสะพานไปฝั่ง native: implements คลาสจริงได้เลย ไม่ต้องสร้าง interface ใหม่
class FakeDeviceLight implements DeviceLight {
  final _lux = StreamController<double>.broadcast();
  void emitSensor(double lux) => _lux.add(lux);
  @override
  Stream<double> sensorLux() => _lux.stream;
  // ...override ที่เหลือคืนค่าที่ test เลือก (มี sensor ไหม · สิทธิ์กล้อง)
}

void main() {
  group('measure screen', () {
    testWidgets('shows live lux and verdict', (tester) async {
      // จอทดสอบเริ่มต้น 800×600 — ตั้งเป็นขนาดมือถือ ไม่งั้นปุ่มอยู่นอกจอแล้วกดพลาด
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.75;
      addTearDown(tester.view.reset);

      final device = FakeDeviceLight();
      final meter = MeterController(device);
      await tester.pumpWidget(App(meter: meter));
      device.emitSensor(420);
      await tester.pump(MeterController.tick);   // ไม่ใช้ pumpAndSettle เมื่อมี Timer วนอยู่

      expect(find.textContaining('420 lux'), findsOneWidget);
      meter.dispose();   // ปิด Timer ในตัว test เอง ไม่งั้นล้มด้วย "A Timer is still pending"
    });
  });
}
```

| เรื่อง | ทำอย่างนี้ |
|---|---|
| ชั้น test | unit (`test`) ใช้กับตรรกะล้วน ส่วน widget (`testWidgets`) ใช้กับหน้าจอและเป็นชั้นกลางหลัก ถ้าเป็น E2E บนเครื่อง ใช้ `integration_test` (`flutter test integration_test/`) หรือสคริปต์ `adb` ตาม `app-verifier-setup` |
| platform channel | fake ด้วยคลาสที่ `implements` คลาสสะพานของจริง แล้วค่อยลง `mocktail` เมื่อ fake ด้วยมือเริ่มยาวเท่านั้น |
| `pumpAndSettle` | ใช้ได้เมื่อหน้าจอหยุดนิ่งจริง ถ้ามี Timer หรือ animation วนตลอด จอจะไม่มีวันนิ่งจนหมดเวลา ให้ใช้ `pump(duration)` แทน |
| Timer ค้าง | dispose controller ที่ถือ Timer ในตัว test เองก่อนบรรทัดสุดท้าย เพราะ Timer ที่ยังวิ่งอยู่ตอนจบจะทำให้ test ล้ม |
| จอเล็ก | test แยก 1 ชุดที่ 360×800 dp ภาษาไทย + `textScaler` ใหญ่ เพื่อจับข้อความล้น (Flutter ฟ้อง overflow เป็น exception ใน test) |
| SnackBar บังปุ่ม | widget test จับได้ โดยกดปุ่มล่างหลัง SnackBar ขึ้น แล้ว assert **ผลของการกด** (`tester.tap` ที่โดนของบังแค่พิมพ์คำเตือน ไม่ทำให้ล้ม) |
| golden test | ไม่บังคับ เพราะภาพต่างกันตามเครื่องและฟอนต์ ใช้เมื่อทีมมีเครื่อง CI ตายตัว |
| coverage | `flutter test --coverage` → `coverage/lcov.info` |
| พิสูจน์ว่า test ใช้ได้ | แก้โค้ดให้ผิด 1 จุด รันแล้วต้องแดง แล้วแก้กลับ |

```bash
flutter test                              # ทั้งหมด
flutter test test/features/measure        # โฟลเดอร์เดียว
flutter test --coverage
flutter test integration_test/            # ต้องมี emulator หรือเครื่องจริงต่ออยู่
```

---

## ตารางเทียบ

| เรื่อง | xUnit | Vitest | pytest | Angular (Vitest) | flutter_test |
|---|---|---|---|---|---|
| หลายเคส | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` | วน `for` สร้าง `test(...)` ใน `group` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` | คลาส `implements` · `mocktail` |
| ก่อน/หลังแต่ละ test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` | `setUp` / `tearDown` / `addTearDown` |
| คุมเวลา | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` | `tester.pump(duration)` · `fakeAsync` |
| DB จริง | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — | — (`SharedPreferences.setMockInitialValues`) |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` | `--coverage` |
| สลับลำดับ | ไม่มีในตัว | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` | `--test-randomize-ordering-seed random` |


---

# skill: reverse-engineering

Use when there is a compiled app or unknown file but no usable source — lost source, a deployed build that may differ from the repository, or a feature, format or protocol to understand. Decompiles, traces and reports with evidence.

# Reverse Engineering

**Decompile → Understand → Recreate**, with evidence at every step. Never claim the original source was recovered; report what the evidence shows and mark what is unknown.

Source code is available but there are no documents → use `legacy-spec-recovery` instead. Once this skill has recovered readable code, `legacy-spec-recovery` turns it into a spec.

## What works in practice

Effort depends almost entirely on what the target was built with. Classify first, then set expectations with the user.

| Target | Result to expect | Effort | Route |
|---|---|---|---|
| .NET (C#, VB.NET, Xamarin) | Near-original source: same logic, same SQL strings; comments and local names lost | Minutes | `ilspycmd` |
| Java, Kotlin, Android | Near-original source | Minutes | jadx, CFR, Vineflower |
| JavaScript, Electron | The code itself, often minified; source maps may give the original | Minutes | unpack, beautify |
| Python `.pyc`, PyInstaller | Usually recoverable for Python ≤ 3.8, partial after | Hours | pyinstxtractor, decompyle3 / pycdc |
| Native C, C++, Go, Rust | Pseudo-C only; names gone unless symbols exist | Days per feature | strings → imports → Ghidra |
| Obfuscated or packed | Depends on the protector; can stop the job | Unknown | identify the tool first, then ask |

Field test (2026-10, ASP.NET MVC app of about 55,000 lines): `ilspycmd` produced a C# project of 51,700 lines in 9 seconds. Compared against the real source, a cancel method matched statement for statement, and all 1,431 methods matched by name.

## Safety and legality

- Analyse only software the user owns or is authorised to analyse: their own or their client's systems, licensed software where the licence allows it, CTF targets, malware samples in a sandbox.
- Do not help bypass licensing, DRM, activation or access controls in third-party software.
- **Secrets come out with the code.** Connection strings, passwords and API keys sit in decompiled code and `.config` files. Name them, never paste their values — `triage.py` masks them in its output.
- Malware: static analysis only, unless the user explicitly asks for dynamic analysis in an isolated environment.
- Work on copies in a scratch folder. Never write decompiled output into the user's source tree; it is not the source of record.

## Workflow

### Step 1 — Triage

```bash
python -I scripts/triage.py <file>                          # format, architecture, next step
python -I scripts/triage.py <file> --pattern 'oauth|WHT'    # hunt a clue in strings (secrets masked)
```

It recognises PE, .NET, ELF, Mach-O, APK, IPA, JAR, ASAR, Power BI, Office, OLE (Crystal Reports, MSI), SSIS and config XML. For a .NET assembly it also reports a `.pdb` or `.config` lying beside it and known obfuscator markers.

Installers (7-Zip SFX, NSIS, MSI): extract first — strings inside are compressed noise. Packaging layouts and report and ETL formats: [references/packaging-patterns.md](references/packaging-patterns.md).

Confirm what the user wants before deep work: explain one feature, recover a format or algorithm, recover lost source, or check a deployed build against the repository.

### Step 2 — Decompile, cheapest first

1. **Strings and metadata.** Often enough on their own. In the field test, SQL statements embedded in a .NET dll — including commented-out ones — came out of the strings alone.
2. **Managed code (.NET, Java)** — go straight to the decompiler; it is cheap.
   ```bash
   dotnet tool install ilspycmd --tool-path <scratch>/tools --version <x>
   <scratch>/tools/ilspycmd -p -o <scratch>/out <file.dll>
   ```
   The newest `ilspycmd` needs the newest .NET SDK. If installation fails with *"DotnetToolSettings.xml was not found"*, pin an older version that matches an installed SDK (`dotnet --list-sdks`); for example, 9.1.0.7988 works with SDK 9. Install into the scratch folder, not globally.
3. **JavaScript/Electron** — `npx @electron/asar extract app.asar <out>`, beautify, look for `.map` files.
4. **Native** — imports and exports first (they reveal crypto, network and storage use), then Ghidra headless for the functions that matter. On Windows, prefer Python and Node scripts over assuming Unix tools exist.

Record each finding as evidence: file, offset, type or method, and what it suggests.

### Step 3 — Understand

Trace from clue to implementation: who references the string, which function contains it, what flows in and out. Write a short narrative: "feature X works by A calling B, storing in C, gated by D". Keep static reading separate from runtime observation, and mark unresolved links instead of guessing.

### Step 4 — Use the result

| Goal | Do this |
|---|---|
| Explain a feature | Narrative + evidence list (Step 5) |
| Lost source | Decompiled project goes to the user as a recovery, clearly labelled; then `legacy-spec-recovery` for the spec |
| **Deployed build vs repository (drift check)** | Decompile the production binary, then `python -I scripts/compare_members.py <decompiled> <source>` — lists methods only in the binary (hot-fixes never committed) or only in the source (not deployed). Then diff the bodies of the methods it flags. |
| Recreate in the user's stack | Only after the user confirms the understanding. Reimplement, do not copy proprietary code; standard algorithms and formats (JSON, zlib, AES) are fine to reuse |

`compare_members.py` was field-tested both ways: on a matching build it reported 1,431 shared methods and no differences, and a method renamed in a copy of the source was caught.

### Step 5 — Report

- **How it works**: the narrative, with evidence locations.
- **Evidence**: each claim tied to a file, offset or method.
- **Unknowns**: what could not be determined and what would resolve it.
- **Secrets seen**: key names and locations only — and tell the user they should be rotated if the binary or config has left their control.
- **Output**: where the decompiled files are, and how to verify any recreated feature.

## Rules of thumb

- Cheapest sufficient evidence wins: strings > managed decompiler > native decompiler > debugger.
- Prefer static analysis; do not run unknown binaries.
- Decompiled code is evidence, not the source. Label it that way wherever it is handed over.
- If triage reports an obfuscator, stop and tell the user what that means for effort before going on.


## reference: packaging-patterns.md

# Common application packaging patterns

Recognizing the packaging leads straight to the readable layer. Check these before touching a decompiler.

## Mozilla apps (Firefox, Thunderbird)

- Full Windows installer is a **7-Zip SFX stub** (small PE32, sections=3) with the app in an appended archive. `7z x setup.exe` extracts `core/` plus `setup.exe`.
- `core/application.ini` — version, BuildID, source repository and SourceStamp (build provenance evidence).
- `core/omni.ja` — ZIP archive (97MB+ for Thunderbird) holding nearly all app JavaScript (`modules/`, `chrome/`) and default prefs (`defaults/pref/*.js`). Extract with 7z; Grep it to trace features. `omni.ja` is usually the cheapest route to full answers.
- The big DLLs are the native layer: `xul.dll` (Gecko engine), `nss3.dll`/`freebl3.dll` (crypto), `rnp.dll` (OpenPGP), `libotr.dll` (chat encryption).
- `thunderbird.exe` itself is only a launcher stub.

## Electron / Node apps

- `app.asar` — ASAR archive; `npx @electron/asar extract app.asar outdir` (the old `asar` package name is deprecated). Renderer JS is often minified but readable; `.map` source maps may contain original source.
- `resources/app/package.json` names the app, entry point, and dependency list.
- Native modules: `*.node` files (PE DLLs) — treat as native binaries.

## .NET applications

- PE with a CLI header (triage reports `.NET / managed PE`). `ilspycmd -p -o <out> <dll>` gives a near-original C# project — field-tested: identical logic, SQL strings intact, only comments and local names lost.
- A `.pdb` beside the dll restores original file names and line numbers; a `.dll.config` holds settings (and often secrets).
- ASP.NET MVC with precompiled views: `.cshtml` come back as classes under `<Assembly>.Views.<Controller>`.
- Xamarin APK: the C# lives in `assemblies/*.dll` inside the APK (sometimes LZ4-compressed `XALZ`) — decompile those, not `classes.dex`.
- Check for bundled/single-file deployment (self-extracting extractors) — extract first.
- P/Invoke declarations map managed code to native DLL entry points.

## Android APK

- ZIP; contains `classes.dex` (Dalvik bytecode — use `jadx` or `apktool` for near-Java output), `AndroidManifest.xml` (binary XML — use `apktool` or `aapt`), `resources.arsc`, native libs under `lib/`.

## Windows installers generally

- 7-Zip SFX: extract with `7z x`.
- NSIS: extract with `7z x` (triage detects `NullsoftInstall` marker).
- MSI: `msiexec /a file.msi /qb TARGETDIR=<out>` or 7z.
- MSI transforms and stub downloaders may contain no payload — identify early to avoid wasted work.

## Enterprise report and ETL files

Often the only place a calculation lives. None need a decompiler.

| File | What it is | Readable layer |
|---|---|---|
| `.rpt` Crystal Reports | OLE compound file | `strings` shows SQL, table and field names; formulas need Crystal Designer or an RptToXml export |
| `.pbix` Power BI | ZIP | `Report/Layout` is UTF-16 JSON (pages, visuals, filters); measures in `DataModel` need pbi-tools or Tabular Editor |
| `.dtsx` SSIS | XML | Search `SqlCommand`, `ConnectionManager`, `DTS:ObjectName`; package order in the master package |
| `.rdl` SSRS | XML | `CommandText` per dataset |
| `.mdb` / `.accdb` | Access database | Queries and VBA modules; open with mdbtools or Access |


---

# skill: simplicity-first

Use when producing a document, design, architecture or plan (BRD, FSD, ADR, roadmap, API design). Simplest version that works, no buzzwords or layers.

# Simplicity First

> The best architecture has the fewest moving parts. The best plan is the one a
> teammate can follow with no context.

This skill covers **non-code outputs** — documents, plans, architecture, and
designs. For code, use `lazy-coding`.

## The one test

Before submitting, ask:

> Could a tired teammate understand this in 6 months, with no prior context?

If "no" or "not sure" → simplify.

## 5 principles

1. **Start with the simplest thing that works.** Add complexity only when something breaks.
2. **Reduce moving parts.** Each component adds failure modes, ops burden, and docs. Default to one thing.
3. **Use familiar patterns.** Boring, proven tech for critical paths. Save novelty for low-risk experiments.
4. **Optimize for reading.** It's read far more often than written.
5. **Delete &gt; add.** The best edit removes something. The worst adds a layer for an imagined future need.

## By output type

### Documents (BRD, FSD, ADR)

Do: short sentences (≤ 20 words), plain English, one idea per paragraph, an
example for every abstract point, tables for structured data.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy"), undefined
jargon, walls of text, hedging ("might possibly potentially"), acronym soup.

### Architecture

Do: monolith first (split only when a bottleneck is proven), familiar stack,
standard patterns (REST, queues, caches), single source of truth per data type.

Avoid: microservices for small teams, distributed-everything, multi-master
databases before you must, event-driven by default (sync is simpler).

### Plans

Do: 3-5 priorities (not 20), a named owner per item, measurable success
criteria, realistic timelines with buffer, cut scope to fit time.

Avoid: vague goals ("improve quality"), 50-item lists (= no priority),
aspirational dates with no buffer, plans without success metrics.

### Designs (UX, API)

Do: fewest steps to the user's goal, reuse existing patterns, stay consistent
across screens, defaults that work for 80%, progressive disclosure.

Avoid: novel interactions where a standard one works, 10-step flows when 3
work, required fields with no smart default, hidden features needing tutorials.

## The 3-question filter

Before adding any new component, configuration option, or pattern:

1. Is there real evidence we need this **now** (not "might need")?
2. Is there a simpler way? (Sleep on it. Often yes.)
3. What's the cost of **not** adding it? (Often nothing, or a small refactor later.)

Two or more answers point to "simpler is fine" → don't add it.

## Examples

**API description**

❌ "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

✅ "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

❌ "Improve overall product quality and customer satisfaction through various
initiatives."

✅ "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

❌ "Event-sourced microservice with CQRS, Kafka ingestion, Redis cache, and a
dedicated auth service."

✅ "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

## Anti-patterns to reject

- **Future-proofing** — abstractions for needs that never arrive.
- **"It might scale"** — infra for 1M users while you have 1k.
- **Layer cake** — 6 layers where 90% just pass through.
- **Resume-driven design** — fancy tech to look sophisticated.
- **Buzzword stacking** — "cloud-native event-driven AI-powered".

## Pre-submit checklist

- [ ] A tired teammate would understand this in 6 months.
- [ ] Nothing can be deleted without losing meaning.
- [ ] No jargon the audience won't know.
- [ ] Every abstract claim has an example.
- [ ] I could explain the whole thing in two sentences.

If any answer is "no" → simplify before delivering.

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Saint-Exupéry


---

# skill: pr-description-template

Use when writing a pull request description or preparing a PR for review. Summary, linked issues, changes, how to test, screenshots.

# Pull Request Description Template

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

## When to use this skill

- Opening any pull request
- Updating a PR description after major changes
- Onboarding team to consistent PR practices

## Output Template

```markdown
## Summary
<2-4 sentence explanation of what this PR does and why>

## Linked Issues
- Closes #XXX
- Refs #YYY

## Changes
- ✨ Added: ...
- 🔧 Changed: ...
- 🐛 Fixed: ...
- 🗑️ Removed: ...

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change)
- [ ] ✨ New feature (non-breaking change)
- [ ] 💥 Breaking change (fix or feature that breaks existing behavior)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactor (no functional change)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test additions/updates
- [ ] 🏗️ Build/CI changes

## How to Test
1. Pull this branch
2. Run `<command>`
3. Verify ...
4. Try edge case: ...

## Screenshots / Demos
| Before | After |
|--------|-------|
| <img>  | <img> |

## Checklist
- [ ] My code follows the project style guide
- [ ] I have performed self-review of my code
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] I have updated documentation as needed
- [ ] No new linter warnings
- [ ] No console.log / debug code left
- [ ] Breaking changes are documented

## Breaking Changes
<describe what breaks and migration path, OR write "None">

## Performance Impact
<measurements if applicable, OR write "No significant impact">

## Security Considerations
<note any security implications, OR write "None">

## Deployment Notes
<env var changes, migrations, feature flags needed, OR "Standard deployment">

## Notes for Reviewer
<anything reviewer should pay attention to, gotchas, alternative approaches considered>
```

## Size Guidelines

| Lines changed | Review difficulty | Recommendation |
|--------------|-------------------|----------------|
| < 100 | Easy | ✅ Ideal size |
| 100-400 | Moderate | ✅ Acceptable |
| 400-800 | Hard | ⚠️ Consider splitting |
| > 800 | Very hard | ❌ Should be split |

If your PR is huge, split into:
1. Refactoring PR (no behavior change)
2. Feature PR (small, focused)
3. Test PR (adding coverage)

## Summary Writing

❌ Bad summaries:
- "Fixes bug"
- "Updates code"
- "See ticket"

✅ Good summaries:
- "Prevents double-charging customers when payment provider times out, by adding idempotency key to charge API calls"
- "Adds email verification step during signup to reduce spam accounts; sends 6-digit code via existing email service"

**Structure:** What changed + Why it matters + Brief how

## Screenshots Best Practices

- Always for UI changes
- Show before AND after side-by-side
- Highlight the actual change with arrows/circles
- Include mobile view if responsive
- Use GIFs for interactions (max 30 sec)

## Reviewer-Friendly Tips

- Tag specific people for areas they know
- Mention if breaking change requires coordination
- Note non-obvious decisions in code comments
- Reply to your own PR with "Self-review notes" for tricky parts
- Mark draft PRs as Draft until ready

## Anti-patterns

- ❌ Empty description: "see code"
- ❌ Linking ticket without explanation in PR
- ❌ Massive PR with 1000+ lines mixed concerns
- ❌ No screenshots for UI changes
- ❌ "Testing: tested locally" with no detail
- ❌ Pushing right before merge deadline with no time to review

---

## Document Look

This skill decides **what goes in** the document. It does not decide **how it looks** —
load the matching skill before writing, not after:

| What is being handed over | Load |
|---|---|
| Markdown someone reads (repo, wiki, issue tracker) | `polished-document-style` |
| A rendered `.docx` / `.pptx` / PDF a stakeholder signs off on | `branded-document-design` |
| The point needs a picture to land | `markdown-visuals`, then `software-diagrams` |

Default formatting is not neutral — it reads as unfinished work.


---

# skill: markdown-visuals

Use when a markdown doc needs a picture (wireframe, UI state, flow, architecture). Picks inline SVG, image, ASCII or Mermaid so it renders everywhere.

# Markdown Visuals

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม [`human-writing`](../human-writing/SKILL.md) — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every design, mockup, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- Producing **any** design mockup, wireframe, or UI spec
- Writing FSD, BRD, ADR, or architecture docs that describe layout, flow, or relationships
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user said "make a mockup," "show me how it looks," or "design X"

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## Decision tree: which format?

```
What are you showing?
│
├─ UI mockup / component state / icon       →  Inline SVG
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / sequence / decision tree          →  Mermaid (software-diagrams)
├─ Architecture / ER / class                →  Mermaid (software-diagrams)
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG
├─ Photo, screenshot, complex illustration  →  External file → ![alt](assets/x.png)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Default to inline SVG**, except for flows and sequences (use Mermaid for those). Inline SVG renders everywhere and versions cleanly in git. It adds no binary files to the repo, and the user can read and edit the markup.

## 1 · Inline SVG (primary technique)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background -->
  <rect width="640" height="280" rx="14" fill="#1c2230"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — without this, GitHub may not render
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Mockup of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น ส่วนถ้ายังไม่มี ให้เสนอโทนจาก [`diagram-figures/references/colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md) แล้วรอผู้ใช้ยืนยัน ส่วน token ตามหน้าที่ (`bg-canvas` · `accent-primary` · `state-*` …) ดูได้ใน [references/svg-snippets.md](references/svg-snippets.md) และ **1 เอกสารใช้ชุดสีเดียว**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](assets/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="assets/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file alongside the doc.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**การเลือกชนิดไดอะแกรม ธีม กติกาความอ่านง่าย และป้ายภาษาไทย อยู่ใน `software-diagrams`**
ที่นี่บอกแค่ว่า *เมื่อไหร่ควรเลือก Mermaid แทนรูปแบบอื่น*

| เลือก Mermaid เมื่อ | เลือกอย่างอื่นเมื่อ |
|---|---|
| เป็นกล่องกับลูกศรที่เครื่องจัดวางให้ได้ | ถ้าต้องคุมตำแหน่งเองให้ใช้ inline SVG ส่วนรูปที่ต้องดูออกแบบมาให้ใช้ `diagram-figures` (HTML layout หรือ engine-svg-python) แล้วฝังเป็นไฟล์ภาพ |
| อยู่ในไฟล์ที่ต้อง diff ใน git | เป็นภาพหน้าจอจริง ให้ใช้ไฟล์ภาพ |
| ผู้อ่านเปิดใน GitHub หรือ Notion | ผู้อ่านเปิดในเอกสาร Word หรือสไลด์ ให้ใช้ไฟล์ภาพ |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- ❌ **Text-only design docs** — "the icon is in the top-right" with no picture
- ❌ **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- ❌ **PNG screenshots of text** — use the text, in a code block
- ❌ **SVG without `xmlns`** — GitHub silently fails to render
- ❌ **Inline SVG with 200+ lines** — extract to `assets/x.svg` and reference it
- ❌ **ASCII art outside a code fence** — proportional fonts will mangle alignment
- ❌ **Mixing Mermaid syntax versions** — stick to v10 syntax so GitHub renders it
- ❌ **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- ❌ **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When the user asks for a design / mockup:

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Tell the user to preview it in GitHub or Notion.

## Related skills

- [[polished-document-style]] — overall doc formatting, Mermaid catalogue, callout boxes
- [[simplicity-first]] — don't over-design the diagram; show what's needed
- [[software-diagrams]] — which diagram type answers which question, plus the shared Mermaid theme
- [[diagram-figures]] — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- [[ui-craft]] — spacing, hierarchy and states when the picture is a screen

## ตัวย่อ

เขียนตัวย่อเต็มครั้งแรกเสมอ แล้ววงเล็บตัวย่อไว้ — เช่น Model Context Protocol (MCP)
หลังจากนั้นใช้ตัวย่อได้เลย ดูรายละเอียดใน skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

Pattern from `DockXI/docs/12-design-mockup.md`:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG mockups in markdown docs · used by [SKILL.md](../SKILL.md) §1

## สี — มาจากเนื้องาน ไม่ใช่จากตารางสำเร็จรูป

**อย่าเลือกสีเอง** ถ้าเอกสารหรือโปรเจกต์มีชุดสีอยู่แล้ว ให้ใช้ชุดนั้น
ถ้ายังไม่มี ให้เสนอโทนจากเนื้องานแล้วรอผู้ใช้ยืนยัน — การแพทย์เขียว · การเงินน้ำเงินเข้ม ·
อุตสาหกรรมเหลืองอำพัน · ราชการกรมท่า · ซอฟต์แวร์ทั่วไปน้ำเงิน (ตารางเต็มอยู่ใน [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

กำหนดเป็น **token ตามหน้าที่** ไว้บนสุดของเอกสาร แล้วใช้ค่าเดียวกันทุกรูปในเอกสารนั้น:

| Token | หน้าที่ | ได้มาจาก |
|---|---|---|
| `bg-canvas` | พื้นหลังของรูป | เฉดเข้มสุด (โหมดมืด) หรืออ่อนสุด (โหมดสว่าง) |
| `bg-surface` | แผ่น พาเนล การ์ด | ต่างจาก canvas พอให้เห็นขอบโดยไม่ต้องตีเส้น |
| `bg-elevated` | ไทล์ที่ลอยขึ้นมาอีกชั้น | |
| `accent-primary` | จุดเน้น สถานะที่กำลังทำงาน | **สีหลักที่ผู้ใช้เลือก** |
| `text-primary` | ข้อความหลัก | contrast ≥ 4.5:1 กับพื้นที่มันวางอยู่ |
| `text-muted` | ข้อความรอง placeholder | `rgba(...,0.55)` ของ `text-primary` |
| `state-success` · `state-warning` · `state-danger` | สถานะ | **ไม่เปลี่ยนตามแบรนด์** — เขียวคือผ่าน แดงคือไม่ผ่านเสมอ |

**1 เอกสารใช้ชุดสีเดียว** — รูป 10 รูปในเอกสารเดียวที่สีไม่ตรงกัน อ่านยากกว่ารูปไม่สวยแต่สีตรงกัน

## Snippets

> ตัวอย่างข้างล่างใช้ชุดสีโหมดมืดชุดหนึ่งเป็นตัวแทนเท่านั้น
> **เปลี่ยนค่าสีให้ตรงกับชุดที่ตกลงไว้ก่อนใช้** โครงสร้างคือสิ่งที่ต้องคัดลอก ไม่ใช่ค่าสี

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

This is the pattern used in `DockXI/docs/12-design-mockup.md` and should be the default for showing UI feature states.


---

# skill: spec-to-code-loop

Use when building from a spec and mockups as a loop (failing test, code, check screen, record progress) with a stop condition and retry ceiling.

> **ใน SuperUser:** ลูปนี้คือแกนของ playbook [`feature`](../superuser/references/playbook-feature.md) และ [`new-project`](../superuser/references/playbook-new-project.md) ถ้าเปิด superuser อยู่ ให้ทำตาม playbook แล้วใช้ไฟล์นี้เป็นรายละเอียดของลูป

# วงรอบจากข้อกำหนดไปเป็นโค้ด

> **กฎข้อเดียว:** วงรอบต้องมีเงื่อนไขหยุดที่**รันแล้วรู้ผลทันที**
> "ทำตามข้อกำหนดให้เสร็จ" เครื่องตรวจไม่ได้ ส่วน "test ทั้ง 47 ตัวเขียว" ตรวจได้

---

## ต้องมีครบก่อนเริ่ม

| สิ่งที่ต้องมี | ถ้าไม่มี |
|---|---|
| ข้อกำหนดที่แต่ละข้อทดสอบได้ มีรหัสกำกับ เช่น `FR-AUTH-010` | หยุด ใช้ `srs-writing` ทำให้ทดสอบได้ก่อน |
| คำสั่งรัน test 1 บรรทัดที่รันได้จริง | หยุด ตั้งค่าโครง test ก่อน ใช้ `testing-standards` |
| คำสั่งรันแอปขึ้นมาดูได้ (ถ้ามีหน้าจอ) | ข้ามขั้นเทียบภาพไปก่อน แล้วบอกผู้ใช้ว่าข้าม |
| ภาพ mockup ที่ตั้งชื่อตรงกับหน้าจอ | ขอจากผู้ใช้ ไม่งั้น UI จะไม่มีวันตรง |

**ถ้าไม่ครบแล้วยังเริ่ม ก็เท่ากับเขียนโค้ดที่ไม่มีใครรู้ว่าถูกหรือผิด**

---

## 1 · รอบที่ศูนย์ — วางแผน ยังไม่เขียนโค้ด

อ่านข้อกำหนดและ mockup ให้ครบก่อน แล้วแตกเป็นงานย่อย **งานละ 1 ข้อกำหนด**
เขียนลง `docs/BUILD-PLAN.md`

```markdown
| # | รหัส | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | รอทำ | |
| 2 | FR-AUTH-020 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | รอทำ | |
```

**ข้อไหนกำกวมจนเขียน test ไม่ได้ ห้ามเดา** — รวมเป็นรายการคำถามไว้ท้ายไฟล์ และใส่ในหัวข้อ **"ค้างอยู่"** ครั้งเดียว แล้วทำข้ออื่นต่อ

> คำถามที่ต้องถามแทนการเดา: ค่าขอบเขตเป็นเท่าไหร่ · ผิดแล้วต้องเกิดอะไร ·
> ใครเห็นข้อมูลนี้ได้บ้าง · ถ้าของเดิมมีอยู่แล้วจะทับหรือจะเตือน

จบรอบที่ศูนย์ **ต้องหยุด** ให้ผู้ใช้อ่านแผนก่อน — อย่าไหลต่อไปเขียนโค้ดเอง

---

## 2 · วงรอบต่อหนึ่งข้อกำหนด

```
อ่าน BUILD-PLAN.md  →  หยิบข้อแรกที่ยังไม่ทำ
  1. เขียน test ก่อน  ชื่อ test มีรหัสข้อกำหนดอยู่ในชื่อ
  2. รัน test ให้เห็นว่า "แดง"        ← ข้ามขั้นนี้ไม่ได้
  3. เขียนโค้ดจน test เขียว
  4. รัน test ทั้งชุด                  ← กันของเดิมพัง
  5. หน้าจอ: ถ่ายภาพจริงเทียบ mockup   ← ข้อ 5 ข้างล่าง
  6. อัปเดตสถานะใน BUILD-PLAN.md + commit หนึ่งข้อต่อหนึ่ง commit
  →  วนข้อถัดไป
```

**ขั้นที่ 2 คนข้ามบ่อยที่สุด และพลาดแล้วแพงที่สุด** — test ที่ไม่เคยเห็นแดง
อาจผ่านตลอดไม่ว่าโค้ดจะถูกหรือผิด

---

## 3 · กฎเหล็ก

1. **ห้ามแก้หรือลบ test เพื่อให้ผ่าน** — test แดงแปลว่าโค้ดผิด ไม่ใช่ test ผิด
   จะแก้ test ได้ต่อเมื่อพิสูจน์ได้ว่า test เขียนผิดจากข้อกำหนด และต้องบอกผู้ใช้ทุกครั้ง
2. **1 ข้อต่อ 1 รอบ** — ห้ามรวบหลายข้อเพราะ "มันคล้ายกัน"
3. **ลองซ้ำได้ไม่เกิน 3 ครั้ง** — ติดข้อเดียวเกิน 3 รอบ ให้**หยุดแล้วรายงาน**
   ว่าติดอะไร ลองอะไรไปแล้ว และคิดว่าปัญหาอยู่ที่ไหน อย่าลองต่อไปเรื่อย ๆ
4. **ห้าม mock สิ่งที่กำลังทดสอบ** — mock ของข้างนอกได้ mock ตัวเองไม่ได้
5. **ห้ามข้ามไปทำข้อที่ง่ายกว่า** เพราะข้อปัจจุบันติด — ลำดับในแผนคือลำดับจริง

---

## 4 · ไฟล์สถานะ — context หมดแน่นอน

วงรอบยาวเกินกว่าที่ 1 รอบสนทนาจะจำได้เสมอ **สถานะต้องอยู่ในไฟล์ ไม่ใช่ในหัว**

- `docs/BUILD-PLAN.md` — แผนและสถานะ **อ่านไฟล์นี้ก่อนเริ่มทุกรอบ**
  นี่คือไฟล์เดียวที่วงรอบนี้เพิ่มเข้าไปในโฟลเดอร์เอกสารหลัก
- สถานะมี 4 ค่าเท่านั้น: `รอทำ` · `กำลังทำ` · `เสร็จ` · `ติด`
- `ติด` ต้องมีเหตุผลต่อท้าย 1 บรรทัด
- ทุกข้อที่ `เสร็จ` ต้องมีเลข commit — ไม่มีเลข แปลว่ายังไม่เสร็จจริง
- จบแต่ละรอบให้อัปเดตหัวข้อ `## สถานะล่าสุด` และ `## ประวัติสถานะ` บนสุดของไฟล์ตาม `status-report` — ตารางงานกับตารางสถานะอยู่ไฟล์เดียวกันแต่คนละหัวข้อ

**เริ่มรอบใหม่โดยไม่อ่านไฟล์นี้ก่อน คือสาเหตุอันดับ 1 ที่งานต้องทำซ้ำ**

### ไฟล์ที่วงรอบสร้างขึ้นระหว่างทาง — ไปที่ `_to_delete/` ทั้งหมด

เอกสารข้อกำหนดมักเป็น `.docx` หรือ `.pdf` ต้องแปลงเป็นข้อความก่อนจึงอ่านซ้ำได้ถูก
**ไฟล์ที่แปลงออกมาไม่ใช่เอกสาร** เป็นของใช้ชั่วคราวของวงรอบ

```
_to_delete/
  extracted/       ← .docx .pdf ที่แปลงเป็น .md แล้ว
  check/           ← ภาพหน้าจอที่ถ่ายไว้เทียบ mockup
  logs/            ← ผลรัน test ที่เก็บไว้ดูย้อนหลัง
```

| ไฟล์ | ไปไหน |
|---|---|
| เอกสารที่แปลงรูปแบบมาให้อ่านง่าย | `_to_delete/extracted/` |
| ภาพหน้าจอที่ถ่ายไว้ตรวจ | `_to_delete/check/` |
| ผลรัน test · log | `_to_delete/logs/` |
| แผนและสถานะ `BUILD-PLAN.md` | `docs/` — เป็นเอกสารจริง |
| โค้ดและ test | โฟลเดอร์โปรเจกต์ |

**ห้ามเขียนไฟล์แปลงลง `docs/` ปนกับเอกสารต้นฉบับ** — อีก 3 เดือนไม่มีใครรู้ว่า
ไฟล์ไหนคือของจริงที่ลูกค้าเซ็นรับ และไฟล์ไหนคือของที่เครื่องแปลงมา

รายละเอียดเต็มอยู่ใน `temp-file-discipline`

---

## 5 · เทียบ mockup ด้วยภาพจริง

อ่านโค้ดแล้วบอกว่า "ตรงแล้ว" ใช้ไม่ได้ ต้องเปิดจริงแล้วดู

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

แล้วเปิดทั้ง 2 ภาพดูเทียบกันตาม 5 ข้อนี้:

- [ ] ลำดับและการจัดกลุ่มขององค์ประกอบตรงกันไหม
- [ ] ระยะห่างและขนาดตัวอักษรใกล้เคียงไหม (ไม่ต้องเป๊ะพิกเซล)
- [ ] สถานะที่ mockup แสดงไว้ มีครบไหม — ว่าง · กำลังโหลด · ผิดพลาด
- [ ] ข้อความตรงกับ mockup ไหม หรือไปแต่งเอง
- [ ] ภาษาไทยตกบรรทัดหรือสระหายไหม

ต่างตรงไหน**บอกเป็นรายการ** อย่าเงียบแล้วเคลมว่าเสร็จ
ภาพที่ถ่ายไว้ตรวจเป็นไฟล์ชั่วคราว — ไปที่ `_to_delete/` ตาม `temp-file-discipline`

---

## 6 · การสืบย้อน

ชื่อ test ต้องมีรหัสข้อกำหนดอยู่ในชื่อ เช่น `test_lockout_after_5_failures_FR_AUTH_020`
จะได้ค้นด้วยคำสั่งเดียวว่าข้อไหนยังไม่มี test ครอบ

ปิดงานด้วยตารางสืบย้อน: ข้อกำหนดทุกข้อ → test ที่ครอบ → ผลล่าสุด

> **ข้อไหนไม่มี test ครอบ ให้บอกตรง ๆ ว่าไม่มี** — ห้ามเขียน test ตื้น ๆ มาเติมให้ตารางเต็ม
> ตารางที่เต็มเพราะเติมเอง อันตรายกว่าตารางที่มีช่องว่าง

---

## 7 · เมื่อไหร่แตกหลาย agent

**เกณฑ์เดียว: ไฟล์ที่จะแตะต้องไม่ทับกันเลย** — ดูคอลัมน์ "ไฟล์ที่จะแตะ" ในแผน

| แตกได้ | แตกไม่ได้ |
|---|---|
| คนละโมดูล คนละหน้าจอ ไฟล์ไม่ทับกัน | แตะไฟล์เดียวกันแม้แต่ไฟล์เดียว — งานจะทับกัน |
| agent ตรวจงานแบบ**อ่านอย่างเดียว** วิ่งคู่กับ agent ที่เขียนโค้ด | งานที่ต้องรอผลจากอีกงานอยู่แล้ว |
| แปลงข้อกำหนดเป็น test หลายโมดูลพร้อมกัน | ตอนยังไม่มีแผน — ต้องมีแผนก่อนถึงจะรู้ว่าแตกตรงไหนได้ |

ทุก agent ที่แตกออกไปต้องได้รับ: รหัสข้อที่รับผิดชอบ · รายการไฟล์ที่แตะได้ ·
คำสั่งรัน test · และกฎข้อ 3 ทั้งหมด

**ห้ามให้ agent ที่แตกออกไปแก้ `BUILD-PLAN.md` เอง** — ให้รายงานกลับ แล้วตัวหลักเขียนไฟล์เดียว
ไม่งั้นไฟล์สถานะจะพังก่อนโค้ด

---

## 8 · สัญญาณว่าวงรอบกำลังพัง

| อาการ | ความหมายจริง |
|---|---|
| test เขียวหมดตั้งแต่รอบแรกโดยไม่เคยแดง | test ไม่ได้ทดสอบอะไร |
| จำนวน test เพิ่มเร็วกว่าจำนวนข้อกำหนดที่ปิด | กำลังเขียน test ให้ตัวเองผ่าน |
| commit เดียวแตะ 15 ไฟล์ | รวบหลายข้อ ย้อนกลับไม่ได้แล้วเมื่อพัง |
| ข้อเดิมวนเกิน 3 รอบ | ข้อกำหนดกำกวม ไม่ใช่โค้ดยาก ให้กลับไปถาม |
| ไม่มีใครอัปเดต `BUILD-PLAN.md` มา 2 รอบ | สถานะอยู่ในหัว รอบหน้าจะทำซ้ำ |

---

## 9 · Anti-patterns

- ❌ **โยนข้อกำหนดทั้งฉบับให้รอบเดียว** — สาเหตุอันดับ 1 ที่ได้โค้ดมั่ว
- ❌ **เขียนโค้ดก่อนแล้วค่อยเขียน test ตาม** — ได้ test ที่ยืนยันสิ่งที่เพิ่งเขียน ไม่ใช่สิ่งที่ต้องการ
- ❌ **เดาเมื่อข้อกำหนดกำกวม** — ผิดตั้งแต่ต้น แต่มารู้ตอนส่งมอบ
- ❌ **แก้ test ให้ผ่าน** แล้วรายงานว่าเสร็จ
- ❌ **แตก agent ขนานบนไฟล์เดียวกัน**
- ❌ **เคลมว่า UI ตรง mockup โดยไม่เคยเปิดดู**
- ❌ **ปิดงานโดยไม่มีตารางสืบย้อน** — ไม่มีใครรู้ว่าอะไรยังไม่ได้ทำ

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ทำข้อกำหนดให้ทดสอบได้ก่อน | `srs-writing` |
| แปลงข้อกำหนดเป็น test case | `test-case-template` |
| โครง test กรอบทดสอบ ชื่อ ความครอบคลุม | `testing-standards` |
| test ระดับเปิดเบราว์เซอร์จริง | `e2e-testing-patterns` |
| เขียนโค้ดให้เรียบง่ายที่สุดที่ใช้ได้ | `lazy-coding` |
| แก้เมื่อ test แดงหรือผลไม่ตรง | `targeted-fix` |
| รูปแบบข้อความ commit | `commit-message-format` |
| ไฟล์ภาพที่ถ่ายไว้ตรวจ | `temp-file-discipline` |
| บันทึกสถานะข้ามรอบสนทนา | `work-session-context` |
| ตารางสรุปสถานะเมื่อจบรอบ | `status-report` |

---

## ตัวย่อ

- **test** — ชุดทดสอบอัตโนมัติ
- **mockup** — ภาพต้นแบบหน้าจอ
- **commit** — การบันทึกการเปลี่ยนแปลงลงระบบควบคุมเวอร์ชัน
- **UI** — User Interface (ส่วนติดต่อผู้ใช้)
