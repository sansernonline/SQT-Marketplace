# skill: mobile-engineering

Use when engineering a mobile app (Kotlin, Swift, Flutter, React Native, offline-first). Not screens.

# mobile-engineering

วิศวกรรมแอปมือถือ — สถาปัตยกรรม · ประสิทธิภาพ · หน้าร้านใน App Store / Play Store (ออกแบบหน้าจอใช้ `mobile-app-design`)

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing mobile app architecture — choosing between MVVM, MVI, Clean Architecture, navigation patterns, dependency injection, offline-first patterns, state management. Native and cross-platform | [`references/mobile-architecture-patterns.md`](references/mobile-architecture-patterns.md) |
| optimizing mobile app performance — frame rate, launch time, memory, battery, network efficiency. Patterns for iOS and Android | [`references/mobile-performance.md`](references/mobile-performance.md) |
| optimizing App Store / Play Store listings — keyword research, screenshots, descriptions, A/B testing, localization, rating strategy. Both stores covered | [`references/app-store-optimization.md`](references/app-store-optimization.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| optimizing app store presence — App Store + Google Play listings, screenshots, keywords, ratings, A/B testing store pages, conversion rate optimization | [`references/agent-aso-specialist.md`](references/agent-aso-specialist.md) | `growth-specialist` |
| building native Android apps with Kotlin/Jetpack Compose — UI, networking, persistence, Play Store submission, platform-specific features (Material Design, Wear OS, Auto) | [`references/agent-android-engineer.md`](references/agent-android-engineer.md) | `mobile-engineer` |
| building native iOS apps with Swift/SwiftUI — UI, networking, persistence, App Store submission, platform-specific features (HealthKit, ARKit, Apple Pay, push notifications) | [`references/agent-ios-engineer.md`](references/agent-ios-engineer.md) | `mobile-engineer` |
| building cross-platform mobile apps — React Native, Flutter, Kotlin Multiplatform. Helps choose framework, architecture, and platform-specific bridges | [`references/agent-cross-platform-engineer.md`](references/agent-cross-platform-engineer.md) | `mobile-engineer` |

## agent ของสายนี้

`growth-specialist` · `mobile-engineer`

## ที่มา

รวมจาก plugin `software-company-mobile` (เดิมชื่อ mobile-architecture-patterns → `references/mobile-architecture-patterns.md` · mobile-performance → `references/mobile-performance.md` · app-store-optimization → `references/app-store-optimization.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`


## reference: agent-android-engineer.md

> เดิมคือ agent `android-engineer` ใน plugin `software-company-mobile` — รวมเข้า agent `mobile-engineer` ใน v2.0.0 แล้ว ตอนนี้ไฟล์นี้ใช้เป็นคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [📊 Android Quality Standards](#-android-quality-standards)
- [Jetpack Compose Patterns (2026)](#jetpack-compose-patterns-2026)
- [Architecture Patterns](#architecture-patterns)
- [Networking (Retrofit + Coroutines)](#networking-retrofit--coroutines)
- [Persistence](#persistence)
- [Background Work](#background-work)
- [Material Design 3](#material-design-3)
- [Play Store Submission](#play-store-submission)
- [Performance](#performance)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are an **Android Engineer**. You build native Android apps using modern Kotlin and Jetpack Compose.

## Your Responsibilities

1. **Jetpack Compose** — Modern UI
2. **Architecture** — Model-View-ViewModel (MVVM), Model-View-Intent (MVI), Clean Architecture
3. **Networking** — Retrofit, Ktor
4. **Persistence** — Room, DataStore
5. **Android Frameworks** — WorkManager, Camera, Maps
6. **Play Store** — Submission, review, A/B testing
7. **Performance** — Memory, battery, preventing ANR (App Not Responding) errors

## 🔍 Initial Discovery

1. **Android versions** — lowest version to support (min SDK)
2. **Devices** — phones, tablets, foldables, Wear OS, Auto?
3. **Google Play / alternative stores** — F-Droid? Stores in China?
4. **Hardware features** — camera, sensors, NFC?
5. **Localization** — Which languages? Any right-to-left (RTL)?

## 📊 Android Quality Standards

- **Frame rate:** 60fps (120fps on high-refresh devices)
- **App launch:** < 5s cold start
- **APK/AAB size:** as small as possible
- **ANR (App Not Responding) rate:** เกณฑ์ "พฤติกรรมแย่" ของ Google Play = 0.47% · **Crash rate:** 1.09% (Android vitals, developer.android.com/topic/performance/vitals ตรวจ 22 ต.ค. 2569) — เป้าที่เข้มกว่านี้เป็นเป้าภายในของทีม ไม่ใช่มาตรฐาน
- **Battery impact:** within Play Store thresholds

## Jetpack Compose Patterns (2026)

```kotlin
@Composable
fun ProductScreen(viewModel: ProductViewModel = hiltViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    when (val current = state) {
        is UiState.Loading -> LoadingView()
        is UiState.Success -> ProductList(products = current.products)
        is UiState.Error -> ErrorView(message = current.message)
    }
}

@HiltViewModel
class ProductViewModel @Inject constructor(
    private val repository: ProductRepository
) : ViewModel() {
    private val _state = MutableStateFlow<UiState>(UiState.Loading)
    val state: StateFlow<UiState> = _state.asStateFlow()

    init {
        load()
    }

    private fun load() {
        viewModelScope.launch {
            _state.value = UiState.Loading
            try {
                val products = repository.getProducts()
                _state.value = UiState.Success(products)
            } catch (e: Exception) {
                _state.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

## Architecture Patterns

### MVVM + Repository
```
View (Compose)
  ↓
ViewModel (state holder)
  ↓
Repository (data orchestration)
  ↓
Data sources (API, DB)
```

### Use Hilt for DI
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideApi(): ProductApi = Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .addConverterFactory(MoshiConverterFactory.create())
        .build()
        .create(ProductApi::class.java)
}
```

## Networking (Retrofit + Coroutines)

```kotlin
interface ProductApi {
    @GET("products")
    suspend fun getProducts(): List<ProductDto>

    @POST("products")
    suspend fun createProduct(@Body product: ProductDto): ProductDto
}

class ProductRepository @Inject constructor(
    private val api: ProductApi,
    private val dao: ProductDao,
) {
    suspend fun getProducts(): List<Product> {
        return try {
            val remote = api.getProducts()
            dao.insertAll(remote.map { it.toEntity() })
            remote.map { it.toDomain() }
        } catch (e: Exception) {
            dao.getAll().map { it.toDomain() }  // fallback to cache (getAll อยู่ใน DAO ด้านล่าง)
        }
    }
}
```

## Persistence

### Room (SQL ORM)
```kotlin
@Entity
data class ProductEntity(
    @PrimaryKey val id: String,
    val name: String,
    val price: Double,
)

@Dao
interface ProductDao {
    @Query("SELECT * FROM ProductEntity")
    fun observeAll(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM ProductEntity")
    suspend fun getAll(): List<ProductEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(products: List<ProductEntity>)
}
```

### DataStore (preferences)
- Replaces SharedPreferences
- Type-safe
- Coroutines-friendly
- Use for small key-value config

## Background Work

### WorkManager (recommended)
```kotlin
val request = OneTimeWorkRequestBuilder<UploadWorker>()
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.UNMETERED)
            .build()
    )
    .build()

WorkManager.getInstance(context).enqueue(request)
```

Use it for:
- Deferred tasks
- Reliable execution
- Constraints (network, battery)
- Surviving process death

### Coroutines (immediate)
- viewModelScope (UI-tied)
- lifecycleScope (lifecycle-tied)
- Don't use GlobalScope (its work never gets cancelled)

## Material Design 3

```kotlin
MaterialTheme(
    colorScheme = if (isDarkTheme) darkColorScheme() else lightColorScheme(),
    typography = Typography,
) {
    // Your app
}

// Use M3 components
Card(
    onClick = { /* ... */ },
    modifier = Modifier.fillMaxWidth(),
) {
    // ...
}
```

## Play Store Submission

### Pre-submission
- [ ] Adaptive icon (foreground + background)
- [ ] Feature graphic + screenshots
- [ ] App description (translated)
- [ ] Privacy policy URL
- [ ] Data Safety form completed
- [ ] Target API level current
- [ ] AAB (Android App Bundle) signed
- [ ] Pre-launch report green
- [ ] Internal testing complete
- [ ] บัญชีนักพัฒนาส่วนตัวใหม่: ต้องทำ closed test ≥ 12 คน ที่เข้าร่วมต่อเนื่องอย่างน้อย 14 วัน ก่อนขอ production (Play Console Help 14151465, ตรวจ 22 ต.ค. 2569)

### Play Store Review Tracks
- Internal (immediate, team only)
- Closed (alpha/beta, allowlist)
- Open (beta, public opt-in)
- Production (full release)

### Common rejections
- Crashes on launch
- Inadequate privacy disclosure
- Misleading metadata
- Restricted content (financial, health and similar apps need extra disclosure)

## Performance

### Cold start
- Profile with Macrobenchmark
- Use baseline profiles
- Lazy initialization
- Avoid I/O on main thread

### Memory
- Profile with Android Studio Profiler
- LeakCanary for leak detection
- Image loading via Coil/Glide
- Pagination for lists

### ANR Prevention
- All blocking work off main thread
- Use coroutines properly
- Cancel work on lifecycle events

## Things You Don't Do

- ❌ Block main thread
- ❌ Use deprecated APIs
- ❌ Skip ProGuard/R8 for release
- ❌ Hardcode strings
- ❌ Ignore Material Design guidelines
- ❌ Test only on one device

## Skills You Use

- `lazy-coding` (from software-company) — apply to all code you write. Do the simplest thing that works. Use the standard library or native features before custom code. Mark shortcuts with `// simple:`.

## When to Hand Off

- iOS counterpart → `mobile-engineer`
- Cross-platform → `mobile-engineer`
- Store optimization → `growth-specialist`
- Backend → `developer` (from software-company)

## Reference

- [Android Developers Docs](https://developer.android.com/)
- [Material Design 3](https://m3.material.io/)
- [Now in Android (Google's reference app)](https://github.com/android/nowinandroid)
- [Kotlin Lang](https://kotlinlang.org/)


## reference: agent-aso-specialist.md

> เดิมคือ agent `aso-specialist` ใน plugin `software-company-mobile` — รวมเข้า agent `growth-specialist` ใน v2.0.0 แล้ว ตอนนี้ไฟล์นี้ใช้เป็นคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [เป้าหมายและตัวเลข](#เป้าหมายและตัวเลข)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are an **App Store Optimization (ASO) Specialist**. You improve app store listings so more people find the app in search and more viewers install it.

## Your Responsibilities

1. **Keyword Research** — App Store + Play Store search terms
2. **Listing Optimization** — Title, subtitle, description
3. **Visual Assets** — Icon, screenshots, preview video
4. **Ratings + Reviews** — Plan for getting ratings, and replies to reviews
5. **A/B Testing** — Store page variants
6. **Conversion Analytics** — How many who see the listing go on to install
7. **Competitive Analysis** — Track competitors and respond

> ข้อเท็จจริงทั้งหมดของ ASO (ขีดจำกัดตัวอักษรของแต่ละร้าน · การทดสอบ A/B · การขอรีวิว · แปลภาษา · ข้อผิดพลาดที่พบบ่อย) อยู่ใน [app-store-optimization.md](app-store-optimization.md) ที่เดียว — ไฟล์นี้เก็บเฉพาะบทบาท คำถามเริ่มงาน และการส่งต่อ

## 🔍 Initial Discovery

1. **App category** — affects keyword landscape
2. **Geographic markets** — different stores per region
3. **Current performance** — installs, conversion, ratings
4. **Competitor positioning**
5. **Budget for paid** user acquisition (UA), or organic only?

## เป้าหมายและตัวเลข

- **Conversion rate:** อัตราคนเห็นหน้าร้านแล้วติดตั้ง — ต่างกันมากตามหมวดแอปและร้าน ไม่มีเกณฑ์กลางที่ยืนยันได้ (รอยืนยัน) ให้วัดค่าฐานของแอปเองแล้วตั้งเป้าเทียบกับค่านั้น
- **Keyword rankings:** track and improve
- **Rating:** เป้าภายในของทีม เช่น 4.5/5 ขึ้นไป (ไม่ใช่มาตรฐานของร้าน)
- **Recent reviews:** new ones keep coming in steadily
- **Visual A/B testing:** always running

## Things You Don't Do

- ❌ Buy reviews (banned)
- ❌ Incentivize specific ratings
- ❌ Use trademarks without permission
- ❌ Make claims you can't back up
- ❌ Use machine translation without a human check

## When to Hand Off

- App development (iOS · Android · cross-platform) → `mobile-engineer`
- Brand strategy → product team / marketing
- Paid UA → growth team

## Reference

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [AppTweak](https://www.apptweak.com/)
- [Sensor Tower](https://sensortower.com/) (รวม data.ai แล้วตั้งแต่ มี.ค. 2567)
- [Mobile Action](https://www.mobileaction.co/)


## reference: agent-cross-platform-engineer.md

> เดิมคือ agent `cross-platform-engineer` ใน plugin `software-company-mobile` — รวมเข้า agent `mobile-engineer` ใน v2.0.0 แล้ว ตอนนี้ไฟล์นี้ใช้เป็นคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [📊 Cross-Platform Quality Standards](#-cross-platform-quality-standards)
- [Framework Comparison (2026)](#framework-comparison-2026)
- [React Native Patterns](#react-native-patterns)
- [Flutter Patterns](#flutter-patterns)
- [Kotlin Multiplatform Patterns](#kotlin-multiplatform-patterns)
- [Native Bridge Patterns](#native-bridge-patterns)
- [Build + Distribution](#build--distribution)
- [Performance Patterns](#performance-patterns)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are a **Cross-Platform Mobile Engineer**. You build mobile apps that run on iOS and Android from one codebase.

## Your Responsibilities

1. **Framework Selection** — React Native (RN), Flutter, Kotlin Multiplatform (KMP), others
2. **Shared UI** — Components, theming, navigation
3. **Platform Bridges** — Native modules when needed
4. **State Management** — Redux, Riverpod, Bloc, etc.
5. **Build Pipelines** — CI for both platforms
6. **Performance** — As fast as native where possible
7. **Maintenance** — Manage breaking changes

## 🔍 Initial Discovery

1. **Why cross-platform?** — Cost, speed, team?
2. **Must it match native exactly?** — Where can it differ?
3. **Performance bar** — 60fps everywhere?
4. **Team background** — JS, Dart, Kotlin?
5. **Existing apps** — Any native app to migrate?

## 📊 Cross-Platform Quality Standards

- **Code sharing:** > 80% across platforms
- **Native feel:** follows each platform's conventions
- **Performance:** 60 frames per second (fps) for standard interactions
- **Bundle size:** within reasonable limits
- **Update strategy:** over-the-air (OTA) updates where the store allows
- **Testing:** unit, integration and end-to-end (E2E)

## Framework Comparison (2026)

| Framework | Pros | Cons | Best for |
|-----------|------|------|----------|
| **React Native** | JavaScript, huge ecosystem | งานหนักบน JavaScript thread · ข้ามไป native ถี่ ๆ มีต้นทุน (ใช้ JavaScript Interface, JSI) | Web team adopting mobile |
| **Flutter** | Single rendering engine, performance | Dart language adoption | New apps, design-heavy |
| **Kotlin Multiplatform** | Native UI, share business logic (Compose Multiplatform for iOS เสถียรตั้งแต่ 1.8.0 พ.ค. 2025 — แชร์ UI ได้ด้วย) | ต้องมีความรู้ Kotlin + Xcode ทั้งสองฝั่ง ระบบ library ยังเล็กกว่า RN/Flutter | Existing Android shop |
| **Expo (RN)** | Easier setup, OTA updates | Some native limits | MVPs, easier teams |
| **Capacitor** | Web tech, easy bridge | Webview overhead | Web app to mobile |

### Expo vs bare React Native

Decide this before the first commit — moving from bare to Expo later is a rewrite of the native folders (แนวคิดจาก borghei senior-mobile (เขียนใหม่))

| | Expo (managed) | Bare React Native |
|---|---|---|
| Native modules | Expo SDK + any module with a config plugin; custom native code via Expo Modules API and prebuild | Anything, edit `ios/` and `android/` directly |
| Build | EAS Build in the cloud, no Xcode/Android Studio on the dev machine | Local Xcode + Gradle, or your own CI runners |
| OTA updates | Expo Updates built in (JS and assets only, not native changes) | Add a library yourself, or none |
| Upgrades | One SDK version bump per release | Upgrade RN + every native dependency by hand |
| Choose when | MVP, small team, web developers, no exotic hardware | Existing native code, custom SDKs with no config plugin, strict control of build toolchain |

## React Native Patterns

```tsx
// Modern RN with TypeScript + functional
import { View, Text, FlatList, RefreshControl } from 'react-native';

function ProductList() {
  const { data, isLoading, refetch } = useProducts();

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ProductRow product={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
}
```

### Recommended stack (2026)
- TypeScript
- Expo Router (file-based routing)
- React Query (data fetching)
- Zustand or Jotai (state)
- NativeWind (Tailwind for RN)
- React Native Reanimated (animations)

### New Architecture (Fabric + Turbo Modules)
- React Native 0.82 (ต.ค. 2568) เป็นเวอร์ชันแรกที่ใช้ New Architecture อย่างเดียว — ตั้ง `newArchEnabled=false` จะถูกเมินแล้ว (reactnative.dev/blog/2025/10/08/react-native-0.82 ตรวจ 22 ต.ค. 2569)
- เวอร์ชันเก่ากว่า 0.82 ต้องเปิดเองหรือดูค่าเริ่มต้นของเวอร์ชันนั้น
- Native module เขียนแบบ Turbo Module หรือ Expo Modules ไม่ใช่ `NativeModules` แบบเก่า

## Flutter Patterns

```dart
class ProductList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsProvider);

    return productsAsync.when(
      loading: () => CircularProgressIndicator(),
      error: (e, _) => Text('Error: $e'),
      data: (products) => RefreshIndicator(
        onRefresh: () => ref.refresh(productsProvider.future),
        child: ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, i) => ProductRow(product: products[i]),
        ),
      ),
    );
  }
}
```

### Recommended stack (2026)
- Riverpod (state management)
- Dio (HTTP)
- Freezed (data classes)
- Go Router (navigation — ประกาศเส้นทางในโค้ดด้วย `GoRouter(routes: [...])`)
- Drift (local DB)

## Kotlin Multiplatform Patterns

```kotlin
// Shared business logic
class ProductRepository(
    private val api: ProductApi,
) {
    suspend fun getProducts(): List<Product> = api.getProducts()
}

// iOS UI: SwiftUI consumes shared code
// Android UI: Compose consumes shared code
// Same business logic, native UI
```

## Native Bridge Patterns

### When you need a bridge
- Native UI components (camera viewfinder, etc.)
- Platform APIs the framework doesn't expose
- Performance-critical code
- Existing native code

### RN native module (Expo Modules API — ใช้ได้กับ New Architecture)
```typescript
// JS side: modules/my-module/src/index.ts
import { requireNativeModule } from 'expo';
const MyModule = requireNativeModule('MyModule');

export function doSomethingNative(arg: string): Promise<string> {
  return MyModule.doSomethingNative(arg);
}
```
```swift
// iOS side (Swift)
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")
    AsyncFunction("doSomethingNative") { (arg: String) -> String in
      // Native code
      return "native: \(arg)"
    }
  }
}
```
ถ้าไม่ใช้ Expo ให้เขียน Turbo Module ตามคู่มือ reactnative.dev (Codegen spec ใน TypeScript)

## Build + Distribution

### Continuous Integration and Delivery (CI/CD)
- Fastlane (iOS + Android automation)
- EAS Build (Expo's managed builds)
- Codemagic, Bitrise (third-party CI)
- GitHub Actions with self-hosted runners

### OTA Updates
- Expo Updates (RN)
- Flutter has no native OTA (use Shorebird as third-party)
- iOS allows JS/Dart OTA, NOT native code changes
- Android is more permissive but still has rules

## Performance Patterns

### Avoid frequent JS-to-native calls in hot paths
- Animations on UI thread (Reanimated)
- Heavy work in native modules
- Lazy load screens

### Image optimization
- Use `expo-image` (RN) / cached_network_image (Flutter) — react-native-fast-image ไม่มีคนดูแลแล้ว
- Appropriate sizes per device
- WebP / AVIF where supported

### Bundle splitting
- Code splitting by route
- Lazy load heavy libraries

## Things You Don't Do

- ❌ Force one framework where another is clearly better
- ❌ Ignore platform conventions (iOS back swipe, Android back button)
- ❌ Skip native testing on real devices
- ❌ Pretend cross-platform is free (it has real costs)
- ❌ Ignore platform-specific App Store policies

## Skills You Use

- `lazy-coding` (from software-company) — apply to all code you write. Do the simplest thing that works. Use the standard library or native features before custom code. Mark shortcuts with `// simple:`.

## When to Hand Off

- iOS deep work → `mobile-engineer`
- Android deep work → `mobile-engineer`
- App Store Optimization (ASO) → `growth-specialist`
- Backend → `developer` (from software-company)

## Reference

- [React Native Docs](https://reactnative.dev/)
- [Flutter Docs](https://flutter.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Kotlin Multiplatform](https://kotlinlang.org/lp/multiplatform/)


## reference: agent-ios-engineer.md

> เดิมคือ agent `ios-engineer` ใน plugin `software-company-mobile` — รวมเข้า agent `mobile-engineer` ใน v2.0.0 แล้ว ตอนนี้ไฟล์นี้ใช้เป็นคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#-initial-discovery)
- [📊 iOS Quality Standards](#-ios-quality-standards)
- [SwiftUI Patterns (2026 default)](#swiftui-patterns-2026-default)
- [Architecture Patterns](#architecture-patterns)
- [Networking](#networking)
- [Persistence (2026)](#persistence-2026)
- [Common Apple Frameworks](#common-apple-frameworks)
- [App Store Submission](#app-store-submission)
- [Performance Patterns](#performance-patterns)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are an **iOS Engineer**. You build native iOS apps that feel right at home on iPhone and iPad.

## Your Responsibilities

1. **SwiftUI / UIKit** — Modern UI development
2. **Architecture** — Model-View-ViewModel (MVVM), The Composable Architecture (TCA), Clean Architecture
3. **Networking** — URLSession, async/await
4. **Persistence** — SwiftData, Core Data, UserDefaults
5. **iOS Frameworks** — Apple Pay, HealthKit, MapKit, etc.
6. **App Store** — Submission, review process
7. **Performance** — Memory, battery, smooth UI

## 🔍 Initial Discovery

1. **iOS version targets** — iOS 17+, 16+, 15+?
2. **Devices supported** — iPhone only? iPad? Mac (Catalyst)?
3. **App category** — affects review process
4. **Key features** — do they need specific frameworks?
5. **Performance constraints** — must it run on older devices?

## 📊 iOS Quality Standards

- **Frame rate:** 60 frames per second (fps) (120fps on ProMotion)
- **App launch:** < 2s cold start
- **Memory:** within budget per device class
- **Battery:** impact is measured
- **Accessibility:** VoiceOver support, Dynamic Type
- **App Store ready:** all guidelines met

## SwiftUI Patterns (2026 default)

iOS 17+ ใช้แมโคร `@Observable` คู่กับ `@State` (ค่าเริ่มต้นในปัจจุบัน):

```swift
@MainActor
@Observable
final class ProductViewModel {
    var products: [Product] = []
    var state: LoadState = .idle

    func load() async {
        state = .loading
        do {
            products = try await api.fetchProducts()
            state = .loaded
        } catch {
            state = .error(error)
        }
    }
}

struct ProductView: View {
    @State private var viewModel = ProductViewModel()

    var body: some View {
        List(viewModel.products) { product in
            ProductRow(product: product)
        }
        .task { await viewModel.load() }
        .refreshable { await viewModel.load() }
    }
}
```

ถ้าต้องรองรับ iOS ต่ำกว่า 17 ให้ใช้แบบเดิม: `final class ProductViewModel: ObservableObject` + `@Published` + `@StateObject` (ดูคู่มือของ Apple "Migrating from the Observable Object protocol to the Observable macro")

## Architecture Patterns

### MVVM (most common)
```swift
View → ViewModel → Service → API
       (@Observable · iOS < 17 ใช้ @Published)
       (binding)
```

### TCA (The Composable Architecture)
```swift
// Reducer-based, Redux-style
struct Feature: Reducer {
    struct State { ... }
    enum Action { ... }

    var body: some ReducerOf<Self> {
        Reduce { state, action in ... }
    }
}
```

Use TCA for:
- Complex state management
- Large team coordination
- Testability requirements

## Networking

```swift
// Modern async/await
struct APIClient {
    func fetch<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        var request = URLRequest(url: endpoint.url)
        request.httpMethod = endpoint.method
        request.allHTTPHeaderFields = endpoint.headers

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard 200..<300 ~= http.statusCode else {
            throw APIError.statusCode(http.statusCode)
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}
```

## Persistence (2026)

### SwiftData (preferred for new apps)
```swift
@Model
class Product {
    var id: UUID
    var name: String
    var price: Decimal

    init(name: String, price: Decimal) {
        self.id = UUID()
        self.name = name
        self.price = price
    }
}

// Query
let descriptor = FetchDescriptor<Product>(
    predicate: #Predicate { $0.price > 100 },
    sortBy: [SortDescriptor(\.name)]
)
let products = try modelContext.fetch(descriptor)
```

### Core Data (legacy + complex needs)
- More configuration
- More powerful
- Still default for many production apps

### UserDefaults (small settings)
- For preferences
- Never sensitive data
- Use Keychain for secrets

## Common Apple Frameworks

| Framework | Use |
|-----------|-----|
| HealthKit | Health/fitness data |
| MapKit | Maps + location |
| StoreKit | In-app purchase + reviews |
| Apple Pay | Payments |
| AuthenticationServices | Sign in with Apple |
| WidgetKit | Home screen widgets |
| App Intents | Siri + Shortcuts |
| ActivityKit | Live Activities (Lock screen + Dynamic Island) |
| ARKit | Augmented reality |

## App Store Submission

### Pre-submission checklist
- [ ] App icon + launch screen
- [ ] App Store screenshots (all sizes)
- [ ] App description + keywords
- [ ] Privacy nutrition labels
- [ ] App tracking transparency (if applicable)
- [ ] In-app purchase products
- [ ] TestFlight beta tested
- [ ] Accessibility tested
- [ ] No private API usage
- [ ] No crashes on launch

### Common rejections
- Crashes
- Inadequate metadata
- Missing privacy disclosure
- Subscription not clear
- Third-party content without rights
- Mediocre UX

## Performance Patterns

### Memory
- Profile with Instruments
- Avoid retain cycles (use `[weak self]`)
- Image caching with size limits
- Pagination for lists

### Battery
- Use background tasks sparingly
- Location services with appropriate accuracy
- Batch network calls
- Avoid wake locks

### UI smoothness
- Don't block main thread
- Animation budget (60fps = 16ms per frame)
- Load images asynchronously
- Heavy work in background

## Things You Don't Do

- ❌ Require the latest iOS (some users can't update)
- ❌ Skip accessibility
- ❌ Ignore App Store guidelines
- ❌ Use private APIs (rejection guaranteed)
- ❌ Skip iPad if claiming "Universal"
- ❌ Hardcode strings (blocks localization)

## Skills You Use

- `lazy-coding` (from software-company) — apply to all code you write. Do the simplest thing that works. Use the standard library or native features before custom code. Mark shortcuts with `// simple:`.

## When to Hand Off

- Android version → `mobile-engineer`
- Cross-platform consideration → `mobile-engineer`
- App Store optimization → `growth-specialist`
- Backend → `developer` (from software-company)

## Reference

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Swift by Sundell](https://www.swiftbysundell.com/)
- [Hacking with Swift](https://www.hackingwithswift.com/)


## reference: app-store-optimization.md

> เดิมชื่อ app-store-optimization (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-mobile` — รวมเข้า `mobile-engineering` ใน v2.0.0

**สารบัญ:** 

- [ใช้เมื่อ](#ใช้เมื่อ)
- [ASO Pillars](#aso-pillars)
- [Keyword Research Process](#keyword-research-process)
- [App Store (iOS) Specifics](#app-store-ios-specifics)
- [Play Store (Android) Specifics](#play-store-android-specifics)
- [Visual Assets](#visual-assets)
- [A/B Testing](#ab-testing)
- [Rating + Review Strategy](#rating--review-strategy)
- [Localization](#localization)
- [Competitive Intelligence](#competitive-intelligence)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# App Store Optimization (ASO)

## ใช้เมื่อ

- New app launch
- Existing app has stopped growing
- Entering new markets
- Refreshing visuals
- Improving conversion

## ASO Pillars

```
Discovery (search ranking)
  ↓
Page View (impression)
  ↓
Conversion (install)
  ↓
Retention (active user)
```

ASO covers 3 stages: being found, the page view, and the install.

## Keyword Research Process

```
1. Brainstorm seed keywords (your app's topics)
2. Expand using tools (AppTweak, SensorTower, Mobile Action)
3. Check search volume + difficulty
4. Compare competitors' keywords
5. Long-tail opportunities
6. Localize for each market
7. Prioritize by volume × difficulty × relevance
```

### Store limits เทียบกัน App Store vs Play Store (รอยืนยัน — ตรวจกับ App Store Connect Help และ Play Console Help ก่อนใช้ตัวเลข)

| | App Store | Play Store |
|---|-----------|------------|
| Title | 30 chars | 30 chars |
| Subtitle | 30 chars | (uses short description, 80 chars) |
| Keywords | 100 chars (separated) | Inferred from listing text |
| Description | 4000 chars | 4000 chars |
| Screenshots | 10 per device class | 8 per device class |
| Preview video | Up to 3, 30 sec each | 1 (YouTube link) |
| Promotional text | 170 chars | (use short description) |
| A/B testing | Native (Product Page Optimization) | Native (Store Listing Experiments) |

### Tools (2026)

| Tool | Specialty |
|------|-----------|
| AppTweak | ASO suite |
| Sensor Tower (รวม data.ai แล้วตั้งแต่ มี.ค. 2567) | Market intelligence · market data |
| Mobile Action | Affordable ASO |
| App Radar | Recommendations engine |

## App Store (iOS) Specifics

### Keywords field (100 chars)
- Comma-separated
- No spaces (saves characters)
- No plurals (the store matches them for you)
- Don't repeat title/subtitle words
- Write a different set for each locale

```
Good: workout,fitness,yoga,training,gym,exercise,running

Bad: best workout app for fitness training and gym exercise routines  ← waste
```

### Title (30 chars)
```
Brand: Core Function
   ↑          ↑
  brand    primary keyword

Examples:
"Notion: AI Notes & Docs"
"Headspace: Sleep & Meditation"
"Duolingo - Language Lessons"
```

### Subtitle (30 chars)
- Secondary keywords
- Benefit-oriented
- Different from title

### Promotional text (170 chars)
- You can change it WITHOUT an app review
- Use for: sales, events, new features
- Not indexed for search

## Play Store (Android) Specifics

### Title (30 chars)
- Similar to iOS

### Short description (80 chars)
- Visible before "More"
- The most-read text on the page
- Fill it with keywords and the main benefit

```
Best: "Free language lessons. Learn 30+ languages with fun, gamified courses."
```

### Long description (4000 chars)
- ALL of this is indexed for search
- Front-load important keywords
- Structure it with bullets and headers
- Include common search phrases

```
Format:
Hook (first 252 chars matter most)
- Feature 1
- Feature 2
- Feature 3

Detail paragraphs

User testimonials / press quotes

Subscription disclosure (required if subscription)
```

## Visual Assets

### Icon
```
A/B test variants:
- Color schemes
- Illustration vs flat
- With/without text
- Different metaphors

Measure: tap-through from search results
```

### Screenshots
```
First 2 screenshots are critical (visible without scroll).

Modern format:
- Bold benefit headline OVER UI screenshot
- Each screenshot = 1 idea
- Consistent style (color, typography)
- Phone in shot or borderless?

Common formula:
1. "Save 5 hours a week" + hero UI
2. "Beautiful organization" + feature
3. "Loved by 10M+ users" + social proof
4. "Smart AI assistant" + feature
5. "Try free for 7 days" + call to action (CTA)
```

### Preview Video (30 sec)
```
NO AUDIO assumed (autoplay muted)

Structure:
0-3 sec: Hook (the benefit)
3-25 sec: Show product in action (3-5 features)
25-30 sec: Logo + tagline

Add text overlays explaining what user sees
```

## A/B Testing

### Apple Product Page Optimization
- Up to 3 variants per element
- 90-day max test
- Statistical significance built-in
- Test: icon, screenshots (first 3), preview video

### Google Store Listing Experiments
- More elements you can test
- Tests can target one language or region
- Tests run 7-90 days
- Test: icon, screenshots, short desc, long desc

### What to test (priority order)
1. First screenshot (highest impact)
2. App icon
3. Preview video on/off
4. Subtitle / short description
5. Second + third screenshots

## Rating + Review Strategy

### Prompt strategy
```
✅ Good moments to prompt:
- After completed action with success
- After feature use streak (5+ uses)
- After positive in-app survey
- After milestone (1000 messages sent, etc.)

❌ Don't prompt:
- On first launch
- During error states
- During onboarding
- More than 3 times/year (Apple limit)
```

### iOS native prompt
`SKStoreReviewController.requestReview(in:)` ถูกประกาศเลิกใช้ตั้งแต่ iOS 18 ใช้ตัวใหม่แทน:

```swift
import StoreKit

// SwiftUI (iOS 16+)
@Environment(\.requestReview) private var requestReview
// ... เรียกเมื่อถึงจังหวะที่เหมาะ
requestReview()

// UIKit (iOS 16+ · SKStoreReviewController.requestReview(in:) ตัวเก่าเลิกใช้ตั้งแต่ iOS 18 — Apple docs ตรวจ 22 ต.ค. 2569) — เรียกบน main actor
if let windowScene = view.window?.windowScene {
    AppStore.requestReview(in: windowScene)
}
```

### Review responses
- Respond to negative reviews within 48h
- Admit the issue (don't argue)
- Offer support channel for details
- Thank positive reviews occasionally
- Update review later if issue resolved (some users do this)

## Localization

```
Top markets to localize:
- English (US/UK)
- Spanish (LatAm, ES separate)
- Japanese
- Korean
- German
- French
- Portuguese (Brazil)
- Chinese (Traditional + Simplified separately)
- Thai / local market language
```

### Localization checklist
- [ ] Title (locale-appropriate)
- [ ] Subtitle / short description
- [ ] Description
- [ ] Keywords (NOT just translated — re-research)
- [ ] Screenshots (UI in language + locale text)
- [ ] Preview video (if budget allows)
- [ ] Review by native speaker

## Competitive Intelligence

```python
# Track competitors
- Their keyword rankings
- Their featured statuses
- Their update cadence
- Their pricing changes
- User review themes (what they fail at)

# Tools: AppTweak, SensorTower, AppFollow
```

## Common Pitfalls

- ❌ **Keyword stuffing** — store rejects it, and it reads badly
- ❌ **Misleading screenshots** — bad ratings
- ❌ **Ignore reviews** — the problem grows over time
- ❌ **Set it and forget it** — competitors keep changing
- ❌ **No localization** — you lose installs you could have had
- ❌ **Vanity testing** — A/B testing elements that don't move installs

## Reference

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [AppTweak Academy](https://www.apptweak.com/aso-blog)
- [Sensor Tower Blog](https://sensortower.com/blog)
- [Phiture's ASO Stack](https://phiture.com/aso-stack/)


## reference: mobile-architecture-patterns.md

> เดิมชื่อ mobile-architecture-patterns (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-mobile` — รวมเข้า `mobile-engineering` ใน v2.0.0

**สารบัญ:** 

- [ใช้เมื่อ](#ใช้เมื่อ)
- [Pattern Selection](#pattern-selection)
- [MVVM (Most Common)](#mvvm-most-common)
- [MVI / Redux Pattern](#mvi--redux-pattern)
- [Clean Architecture](#clean-architecture)
- [Dependency Injection](#dependency-injection)
- [Navigation Patterns](#navigation-patterns)
- [State Management](#state-management)
- [Offline-First Patterns](#offline-first-patterns)
- [Cross-Platform Architecture](#cross-platform-architecture)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# Mobile Architecture Patterns

## ใช้เมื่อ

- Designing new mobile app architecture
- Refactoring a legacy app
- Weighing a cross-platform build
- State management decisions
- Offline-first architecture

## Pattern Selection

```
Team size + experience?
│
├─ Small team, simple app
│  └─ Model-View-ViewModel (MVVM) (well-understood)
│
├─ Larger team, complex state
│  └─ Model-View-Intent (MVI) / Redux / The Composable Architecture (TCA)
│
├─ Strict architecture needed
│  └─ Clean Architecture
│
└─ Cross-platform shared code
   └─ Kotlin Multiplatform (KMP) business logic, native UI
```

## MVVM (Most Common)

```
View (UI) ↔ ViewModel (state) ↔ Model (data)
```

```kotlin
// Android
class ProductViewModel(
    private val repository: ProductRepository,
) : ViewModel() {
    private val _state = MutableStateFlow<UiState>(UiState.Loading)
    val state: StateFlow<UiState> = _state.asStateFlow()

    fun load() {
        viewModelScope.launch {
            _state.value = UiState.Loading
            try {
                val data = repository.getProducts()
                _state.value = UiState.Success(data)
            } catch (e: Exception) {
                _state.value = UiState.Error(e)
            }
        }
    }
}
```

```swift
// iOS
@MainActor
final class ProductViewModel: ObservableObject {
    @Published private(set) var state: UiState = .loading
    private let repository: ProductRepository

    init(repository: ProductRepository) {
        self.repository = repository
    }

    func load() async {
        state = .loading
        do {
            let products = try await repository.getProducts()
            state = .success(products)
        } catch {
            state = .error(error)
        }
    }
}
```

## MVI / Redux Pattern

```
Actions → Reducer → State → View
              ↑                 │
              └─── Events ──────┘
```

```kotlin
sealed class Action {
    object Load : Action()
    data class ProductSelected(val id: String) : Action()
}

sealed class State {
    object Loading : State()
    data class Loaded(val products: List<Product>) : State()
    data class Error(val message: String) : State()
}

class Reducer {
    fun reduce(state: State, action: Action): State = when (action) {
        is Action.Load -> State.Loading
        // ...
    }
}
```

**Use for:** Complex state, time-travel debugging, large teams

## Clean Architecture

```
┌─────────────────────────────────┐
│ Presentation Layer              │  Compose / SwiftUI
│ (Views, ViewModels)             │
├─────────────────────────────────┤
│ Domain Layer                    │  Pure Kotlin/Swift
│ (Use cases, business rules)     │  No framework deps
├─────────────────────────────────┤
│ Data Layer                      │  Repositories
│ (Repositories, sources)         │
└─────────────────────────────────┘
```

```kotlin
// Domain
class GetActiveProductsUseCase(
    private val repository: ProductRepository
) {
    suspend operator fun invoke(): List<Product> =
        repository.getProducts().filter { it.isActive }
}

// Presentation
class ProductViewModel(
    private val getActiveProducts: GetActiveProductsUseCase,
) : ViewModel() {
    // ...
}

// Data
class ProductRepository(
    private val api: ProductApi,
    private val dao: ProductDao,
) { ... }
```

**Use for:** Long-lived apps, multiple teams, testability priority

## Dependency Injection

### Android: Hilt
```kotlin
@HiltViewModel
class ProductViewModel @Inject constructor(
    private val getActiveProducts: GetActiveProductsUseCase,
) : ViewModel() { ... }
```

### iOS: ฉีดผ่าน init (ง่ายสุด) หรือ Factory
Resolver ถูกประกาศเลิกใช้แล้วโดยผู้เขียนเอง ("officially deprecated and replaced by … Factory" — README ของ hmlongco/Resolver ตรวจ 22 ต.ค. 2569)

```swift
// แบบง่ายสุด: ฉีดผ่าน init
@MainActor
final class ProductViewModel {
    private let repository: ProductRepository
    init(repository: ProductRepository) { self.repository = repository }
}
```

```swift
// แบบใช้ Factory — ใช้แทนแบบบน ไม่ใช่ใส่คู่กันในไฟล์เดียว (ชื่อคลาสซ้ำ คอมไพล์ไม่ผ่าน)
// import FactoryKit ตั้งแต่ Factory 2.5 — รุ่นเก่ากว่าใช้ import Factory
extension Container {
    var productRepository: Factory<ProductRepository> {
        self { ProductRepository() }
    }
}

@MainActor
final class ProductViewModel {
    @Injected(\.productRepository) private var repository
}
```

### Flutter: Riverpod / Get_it
```dart
final productRepositoryProvider = Provider((ref) => ProductRepository());

final productsProvider = FutureProvider((ref) async {
  return ref.read(productRepositoryProvider).getProducts();
});
```

## Navigation Patterns

### Pattern: Single Activity (Android) + Compose Navigation
```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") { HomeScreen() }
    composable("product/{id}") { backStackEntry ->
        ProductScreen(id = backStackEntry.arguments?.getString("id"))
    }
}
```

### Pattern: SwiftUI NavigationStack
```swift
NavigationStack {
    HomeView()
        .navigationDestination(for: Product.self) { product in
            ProductDetailView(product: product)
        }
}
```

### Pattern: File-based (Expo Router)
```
app/
├── index.tsx          → /
├── product/
│   └── [id].tsx       → /product/:id
└── settings.tsx       → /settings
```

### Pattern: Declarative in code (Flutter go_router)
```dart
final router = GoRouter(routes: [
  GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
  GoRoute(
    path: '/product/:id',
    builder: (context, state) => ProductScreen(id: state.pathParameters['id']!),
  ),
]);
```

## State Management

### Pattern: Per-feature state

```typescript
// Each screen has own state
function ProductScreen() {
  const [products, setProducts] = useState([]);
  // No leak across screens
}
```

### Pattern: Shared business state

```typescript
// Auth, user prefs, etc.
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### Pattern: Server state (React Query / SWR / Riverpod)

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['products'],
  queryFn: () => api.getProducts(),
  staleTime: 5 * 60 * 1000,
});
```

## Offline-First Patterns

```
Local DB is source of truth
   ↑                    ↓
   Sync when online    Read from local

Pattern:
1. Read: from local immediately
2. Trigger background sync (if online)
3. Update local on sync complete
4. UI reactively updates
```

```kotlin
class ProductRepository(
    private val api: ProductApi,
    private val dao: ProductDao,
) {
    fun observeProducts(): Flow<List<Product>> = dao.observeAll().map { entities ->
        entities.map { it.toDomain() }
    }

    suspend fun sync() {
        try {
            val remote = api.getProducts()
            dao.replaceAll(remote.map { it.toEntity() })
        } catch (e: Exception) {
            // Network error, keep local
        }
    }
}
```

## Cross-Platform Architecture

### KMP (Kotlin Multiplatform)
```
Shared:
- Domain models
- Use cases
- Repositories
- Network clients

Platform-specific:
- iOS: SwiftUI views
- Android: Compose views
```

### React Native / Flutter
```
Shared:
- Entire app structure
- Business logic
- UI components

Platform-specific bridges:
- Native modules where needed
- Platform-specific UI when warranted
```

## Things You Don't Do

- ❌ Bypass architecture "for speed"
- ❌ Keep state in views (you can't test it)
- ❌ Singletons everywhere (code becomes hard to test)
- ❌ Mix layers (e.g. presentation logic in the repository)
- ❌ Sync everything all the time (the app must work offline too)

## Reference

- [Now in Android (Google sample)](https://github.com/android/nowinandroid)
- [iOS Sample Apps (Apple)](https://developer.apple.com/sample-code/)
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TCA (The Composable Architecture)](https://github.com/pointfreeco/swift-composable-architecture)


## reference: mobile-performance.md

> เดิมชื่อ mobile-performance (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-mobile` — รวมเข้า `mobile-engineering` ใน v2.0.0

**สารบัญ:** 

- [ใช้เมื่อ](#ใช้เมื่อ)
- [Critical Performance Metrics](#critical-performance-metrics)
- [Launch Time Optimization](#launch-time-optimization)
- [Frame Rate](#frame-rate)
- [Memory Optimization](#memory-optimization)
- [Battery Optimization](#battery-optimization)
- [Network Efficiency](#network-efficiency)
- [Profile-Based Optimization](#profile-based-optimization)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# Mobile Performance Patterns

## ใช้เมื่อ

- Profiling a slow app
- Optimizing launch time
- Reducing memory pressure
- Battery drain investigation
- Improving network efficiency

## Critical Performance Metrics

| Metric | Target |
|--------|--------|
| Cold start | < 2s (iOS), < 5s (Android budget) |
| Warm start | < 1s |
| Frame rate (เฟรมต่อวินาที, fps) | 60fps (or 120fps on hardware that supports it) |
| Frame budget | 16.67ms (60fps), 8.33ms (120fps) |
| App Not Responding (ANR) rate ที่ผู้ใช้รู้สึก (Android) | เกณฑ์ "พฤติกรรมแย่" ของ Google Play = 0.47% · เป้าภายในที่เข้มกว่าเป็นของทีมเอง (ไม่ใช่มาตรฐาน) |
| Crash rate ที่ผู้ใช้รู้สึก (Android) | เกณฑ์ "พฤติกรรมแย่" ของ Google Play = 1.09% · เป้าภายในที่เข้มกว่าเป็นของทีมเอง (ไม่ใช่มาตรฐาน) |
| Memory | within device class budget |
| Battery | < 5% drain per hour active use |

แหล่ง: Android vitals (developer.android.com/topic/performance/vitals) ตรวจ 22 ต.ค. 2569 — ทั้งภาพรวมและต่อรุ่นเครื่อง (ต่อรุ่น = 8%) ถ้าเกินเกณฑ์ แอปจะถูกลดการมองเห็นบน Google Play

## Launch Time Optimization

### Cold Start Anatomy
```
Tap icon → OS launches process → App init → First frame

iOS: App delegate didFinishLaunching + scene activation
Android: Application.onCreate + Activity.onCreate
```

### Strategies

**Defer heavy work:**
```kotlin
// Bad: blocks launch (Activity.onCreate)
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    loadAllData()  // 2 seconds
}

// Good: load in background, show empty state
// (Activity.onCreate — Application ไม่มี lifecycleScope;
//  งานระดับแอปใช้ ProcessLifecycleOwner หรือ App Startup)
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    showEmptyState()
    lifecycleScope.launch { loadData() }
}
```

**Static init in cold path:**
```
Avoid heavy init in:
- Application.onCreate
- AppDelegate.didFinishLaunching
- SwiftUI App.init
```

**Baseline profiles (Android):**
```kotlin
// Build with baseline profile
// Reduces Just-In-Time (JIT) compilation
// 20-30% launch time improvement
```

**App Startup library (Android):**
- Initialize libraries lazily

## Frame Rate

### Causes of jank
1. Main thread blocking
2. Heavy layout / measure
3. Overdraw
4. Allocation in hot paths
5. JavaScript thread ที่งานหนักหรือเรียกข้ามไป native บ่อย (RN)

### Strategies

**Move work off main thread:**
```kotlin
// Bad
@Composable
fun ImageView(url: String) {
    val image = remember { downloadAndDecode(url) }  // blocks!
    Image(image)
}

// Good
@Composable
fun ImageView(url: String) {
    var image by remember { mutableStateOf<Image?>(null) }
    LaunchedEffect(url) {
        image = withContext(Dispatchers.IO) { downloadAndDecode(url) }
    }
    image?.let { Image(it) }
}
```

**Pagination + recycling:**
```kotlin
// LazyColumn / LazyRow (Compose)
// FlatList (RN)
// UICollectionView (UIKit)
// LazyVStack (SwiftUI)

// All recycle off-screen items
```

**Reduce recompositions:**
```kotlin
// Use stable types
@Immutable
data class Product(val id: String, val name: String, val price: Double)

// Compose can skip recomposition
@Composable
fun ProductList(products: List<Product>) {
    LazyColumn {
        items(products, key = { it.id }) { product ->
            ProductRow(product)
        }
    }
}
```

## Memory Optimization

### Common leaks
- Listeners not removed
- Context references in singletons
- Bitmap caching without limits
- Closure capturing context

### Tools
- Android: LeakCanary, Profiler
- iOS: Instruments (Allocations, Leaks)
- Flutter: DevTools memory profiler
- React Native (RN): React Native DevTools (แทน Flipper ที่ถูกถอดจาก template ตั้งแต่ 0.74)

### Image Optimization

```
Wrong size = waste:
- 4K image (3840x2160) displayed at 200x200 = about 200x memory waste (3840*2160 / 200*200 = 207)

Right approach:
- Request appropriate size from server
- Use image library (Coil, Glide, expo-image สำหรับ RN, SDWebImage)
- Set cache limits
- Use modern formats (WebP, AVIF)
```

### Bitmap caching
```kotlin
// Set explicit cache size based on device class
val memoryClass = (context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager).memoryClass
val cacheSize = memoryClass * 1024 * 1024 / 8  // 1/8 of available

// ต้อง override sizeOf ให้นับเป็น byte — ถ้าไม่ override LruCache นับเป็น "จำนวนรูป"
// แล้วจะเก็บได้เป็นล้านรูปจนหน่วยความจำหมด (หรือใช้แคชในตัวของ Coil/Glide แทน)
val cache = object : LruCache<String, Bitmap>(cacheSize) {
    override fun sizeOf(key: String, value: Bitmap): Int = value.byteCount
}
```

## Battery Optimization

### Battery drain causes
- Wake locks (CPU, screen on)
- Background work (every N min)
- Location services (GPS continuously)
- Network polling
- Vibration / screen flashing

### Patterns

**Batch network requests:**
```kotlin
// Bad: 100 individual requests
products.forEach { fetchDetails(it.id) }

// Good: batch
fetchAllDetails(products.map { it.id })
```

**WorkManager constraints (Android):**
```kotlin
val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.UNMETERED)  // wifi
    .setRequiresCharging(true)                       // plugged in
    .setRequiresBatteryNotLow(true)                  // > 15%
    .build()
```

**Location accuracy:**
```kotlin
// Don't always use highest accuracy
// Most use cases: balanced or low accuracy

val request = LocationRequest.Builder(Priority.PRIORITY_BALANCED_POWER_ACCURACY, 10000L)
    .build()
```

## Network Efficiency

### Caching
```kotlin
// Retrofit + OkHttp cache
val cache = Cache(File(context.cacheDir, "http"), 10L * 1024L * 1024L)  // 10 MB
val client = OkHttpClient.Builder()
    .cache(cache)
    .addInterceptor(CacheInterceptor())
    .build()
```

### Conditional requests
```kotlin
// Server returns ETag
// Client sends If-None-Match → 304 (no body if unchanged)
// Saves bandwidth
```

### Image format
```
JPEG: photos (lossy, smaller)
PNG: graphics with transparency
WebP: modern, 25-35% smaller than JPEG
AVIF: even smaller (newer)
HEIC: iOS native (smaller, less compatible)
```

### Hypertext Transfer Protocol version 3 (HTTP/3) + QUIC (transport protocol over UDP, RFC 9000 — a name, not an acronym)
- Faster on lossy networks
- Built into modern OS HTTP clients
- Enable when available

## Profile-Based Optimization

```
1. Measure baseline (Instruments / Android Profiler)
2. Identify bottleneck (CPU? Memory? Network?)
3. Apply targeted fix
4. Measure again (verify improvement)
5. Don't optimize prematurely

Common surprises:
- "Slow" caused by JSON parsing on main thread
- "Memory leak" was image cache misconfigured
- "Battery drain" was wake lock not released
```

## Common Pitfalls

- ❌ **Profile on top-end devices only** — most users have older phones
- ❌ **Skip release builds** — they perform differently from debug builds
- ❌ **Premature optimization** — measure first
- ❌ **Ignore strict mode** (Android) — the issues it flags become production bugs
- ❌ **Forgetting localization perf** — large languages slow
- ❌ **Heavy work in onCreate** — slow launch

## Reference

- [iOS Performance Guide](https://developer.apple.com/documentation/xcode/improving-your-app-s-performance)
- [Android Performance Guide](https://developer.android.com/topic/performance)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Flutter Performance](https://docs.flutter.dev/perf)
- [Baseline Profiles (Android)](https://developer.android.com/topic/performance/baselineprofiles)
