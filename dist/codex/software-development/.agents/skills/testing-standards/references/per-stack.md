# Setup and examples per stack

> The examples in this file are **not yet run or tested** (except the Flutter section, which comes from a real app, Lumio). The rest is the standard setup of each framework.
> On the first run, check whether the commands and paths match the real project layout.

---

## Contents

1. [.NET — xUnit](#net--xunit)
2. [Node / TypeScript — Vitest](#node--typescript--vitest)
3. [Python — pytest](#python--pytest)
4. [Angular](#angular)
5. [Flutter / Dart — flutter_test](#flutter--dart--flutter_test)
6. [Comparison table](#comparison-table)

---

## .NET — xUnit

```bash
dotnet new xunit -o tests/MyApp.Tests
dotnet add tests/MyApp.Tests reference src/MyApp
dotnet add tests/MyApp.Tests package AwesomeAssertions     # assertions that read like sentences (.Should()) · use instead of FluentAssertions since v8, which needs a paid Xceed license for commercial use · AwesomeAssertions is free, Apache-2.0, checked 22 Oct 2026 (B.E. 2569) on nuget.org
dotnet add tests/MyApp.Tests package NSubstitute           # mocks with shorter syntax than Moq
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

    // Theory = test many cases with one body of code — never write the loop yourself
    [Theory]
    [InlineData(MemberTier.None, 0)]
    [InlineData(MemberTier.Silver, 50)]
    [InlineData(MemberTier.Gold, 150)]
    public void CalculateDiscount_ByTier_ReturnsExpected(MemberTier tier, decimal expected)
        => new DiscountCalculator().Calculate(new Order { Total = 1000m }, tier)
               .Should().Be(expected);
}
```

Integration through `WebApplicationFactory` — sends real HTTP into the real pipeline without opening a port:

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
dotnet test                                        # everything
dotnet test --filter "FullyQualifiedName!~Integration"   # unit tests only
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
    // the setup file sets fake timers / clears mocks the same way for every file
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
  beforeEach(() => vi.restoreAllMocks());   // stop state leaking across tests

  it('gives gold members a 15 percent discount', () => {
    const sut = new DiscountCalculator();
    expect(sut.calculate({ total: 1000 }, 'gold')).toBe(150);
  });

  it.each([
    ['none', 0], ['silver', 50], ['gold', 150],
  ])('gives the right discount for tier %s', (tier, expected) => {
    expect(new DiscountCalculator().calculate({ total: 1000 }, tier)).toBe(expected);
  });
});
```

Control time instead of using `sleep`:

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15T10:00:00+07:00'));
await vi.advanceTimersByTimeAsync(5000);   // advance 5 seconds at once
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

> **Jest instead of Vitest:** The API is almost the same (`jest.fn` ↔ `vi.fn`), but you must set up `ts-jest`
> or babel for TypeScript. Choose Jest when the team already knows it or you need one of its presets.

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
markers = ["integration: needs DB/network — run separately from unit"]
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

`conftest.py` — shared fixtures (restore the original state after every test):

```python
import pytest

@pytest.fixture
def db_session(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield Session(bind=conn)
    tx.rollback()          # every test always starts from a clean database
    conn.close()
```

```bash
pytest                        # everything (pytest-randomly shuffles the order itself = catches tests that depend on each other)
pytest -m "not integration"   # unit tests only
pytest --lf                   # only the ones that failed last time
```

---

## Angular

**Vitest that ships with the Angular CLI** (new projects — the builder `@angular/build:unit-test` is already configured, run `ng test` with no extra plugin · Karma still works · checked 22 Oct 2026 (B.E. 2569) on angular.dev/guide/testing) · add Testing Library if you want queries the way a real user finds things

```bash
ng test
npm i -D @testing-library/angular @testing-library/user-event
```

For older Angular projects (without this builder) → migrate from Karma following angular.dev/guide/testing/migrating-to-vitest, or use `@analogjs/vite-plugin-angular` with `vitest` and `jsdom`

```ts
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { OrderFormComponent } from './order-form.component';

it('shows a required error when the name is empty on submit', async () => {
  await render(OrderFormComponent);

  await userEvent.click(screen.getByRole('button', { name: /บันทึก/ }));

  expect(await screen.findByText(/กรุณากรอกชื่อ/)).toBeTruthy();
});
```

> Test from the **user's point of view** — find a button by the text people see (`getByRole`, `getByText`),
> not `By.css('.btn-primary')`, because once the CSS class changes the test turns red even though the UI still works correctly.

**Jasmine + Karma** (Angular's old default — keep using it if the project already has it):

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
ng test --watch=false --browsers=ChromeHeadless --code-coverage    # for CI
```

---

## Flutter / Dart — flutter_test

It ships with the SDK, so there is nothing to install. Test files live in `test/` and mirror the structure of `lib/` (`lib/features/measure/lux_math.dart` → `test/features/measure/lux_math_test.dart`). File names use snake_case, the Dart convention.

```dart
// fake of the bridge to the native side: you can implement the real class directly, with no new interface
class FakeDeviceLight implements DeviceLight {
  final _lux = StreamController<double>.broadcast();
  void emitSensor(double lux) => _lux.add(lux);
  @override
  Stream<double> sensorLux() => _lux.stream;
  // ...the remaining overrides return the values the test chooses (has a sensor or not · camera permission)
}

void main() {
  group('measure screen', () {
    testWidgets('shows live lux and verdict', (tester) async {
      // the default test screen is 800×600 — set it to a phone size, or the button sits off-screen and the tap misses
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.75;
      addTearDown(tester.view.reset);

      final device = FakeDeviceLight();
      final meter = MeterController(device);
      await tester.pumpWidget(App(meter: meter));
      device.emitSensor(420);
      await tester.pump(MeterController.tick);   // do not use pumpAndSettle when a Timer is looping

      expect(find.textContaining('420 lux'), findsOneWidget);
      meter.dispose();   // close the Timer inside the test itself, or it fails with "A Timer is still pending"
    });
  });
}
```

| Topic | Do this |
|---|---|
| Test layers | unit (`test`) is for pure logic, while widget (`testWidgets`) is for screens and is the main middle layer. For on-device E2E, use `integration_test` (`flutter test integration_test/`) or an `adb` script per `app-verifier-setup` |
| platform channel | fake it with a class that `implements` the real bridge class, and add `mocktail` only when the hand-written fake grows long |
| `pumpAndSettle` | Fine when the screen really settles. If a Timer or animation loops forever, the screen never settles until it times out, so use `pump(duration)` instead |
| Pending Timer | Dispose the controller that holds a Timer inside the test itself before the last line, because a Timer still running at the end makes the test fail |
| Small screen | Add 1 separate test set at 360×800 dp with Thai text + a large `textScaler` to catch overflow (Flutter reports overflow as an exception in tests) |
| SnackBar covers a button | A widget test catches it by tapping the lower button after the SnackBar appears, then asserting **the result of the tap** (a `tester.tap` that hits something covering it only prints a warning and does not fail) |
| golden test | Optional, because images differ by machine and font. Use it when the team has a fixed CI machine. |
| coverage | `flutter test --coverage` → `coverage/lcov.info` |
| Prove the test is useful | Break the code in 1 place, run it, and it must go red, then fix it back |

```bash
flutter test                              # everything
flutter test test/features/measure        # one folder
flutter test --coverage
flutter test integration_test/            # needs an emulator or a real device connected
```

---

## Comparison table

| Topic | xUnit | Vitest | pytest | Angular (Vitest) | flutter_test |
|---|---|---|---|---|---|
| Many cases | `[Theory]` + `[InlineData]` | `it.each` | `@pytest.mark.parametrize` | `it.each` | a `for` loop that creates `test(...)` inside a `group` |
| mock | NSubstitute `Substitute.For<T>()` | `vi.fn()` / `vi.mock()` | `unittest.mock` / `mocker` | `vi.fn()` + `providers` | an `implements` class · `mocktail` |
| Before/after each test | constructor / `IDisposable` | `beforeEach` / `afterEach` | fixture | `beforeEach` | `setUp` / `tearDown` / `addTearDown` |
| Control time | inject `TimeProvider` | `vi.useFakeTimers()` | `freezegun` | `vi.useFakeTimers()` | `tester.pump(duration)` · `fakeAsync` |
| Real DB | Testcontainers | Testcontainers | Testcontainers / `pytest-postgresql` | — | — (`SharedPreferences.setMockInitialValues`) |
| coverage | `--collect:"XPlat Code Coverage"` | `--coverage` | `--cov` | `--coverage` | `--coverage` |
| Shuffle order | Not built in | `--sequence.shuffle` | `pytest-randomly` | `--sequence.shuffle` | `--test-randomize-ordering-seed random` |

## Framework options to offer (moved from SKILL.md)

| Stack | Options to offer |
|---|---|
| .NET | **xUnit** (recommended · the standard of modern .NET) · NUnit (a team coming from NUnit) · MSTest (organizations tied to VS) |
| Node/TS | **Vitest** (recommended · fast, little setup, ESM/TS work out of the box) · Jest (largest ecosystem) · `node:test` (when you want to install nothing) |
| Python | **pytest** (recommended) · `unittest` (pure stdlib; no extra packages allowed) |
| Angular | **Vitest that ships with Angular CLI** (`ng test` · recommended · default for new projects) + Testing Library if wanted · Jasmine + Karma (the old default, still usable) · very old versions use Analog |
| Flutter · Dart | **`flutter_test`** (ships with the SDK, no need to ask) · fake with a class that `implements` the real one, before installing `mocktail` |
