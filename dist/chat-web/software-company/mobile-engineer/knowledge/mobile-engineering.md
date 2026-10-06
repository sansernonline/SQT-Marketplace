# skill: mobile-engineering

Use when engineering a mobile app — native or cross-platform (Kotlin, Swift, Flutter, React Native), MVVM or offline-first architecture, launch time, memory, battery, or store listings. For screen design use mobile-app-design.

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

รวมจาก plugin `software-company-mobile` (skill `mobile-architecture-patterns` · `mobile-performance` · `app-store-optimization`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`


## reference: agent-android-engineer.md

> เดิมคือ agent `android-engineer` ใน plugin `software-company-mobile` — รวมเข้า agent `mobile-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Android Quality Standards](#android-quality-standards)
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
2. **Architecture** — MVVM, MVI, Clean Architecture
3. **Networking** — Retrofit, Ktor
4. **Persistence** — Room, DataStore
5. **Android Frameworks** — WorkManager, Camera, Maps
6. **Play Store** — Submission, review, A/B testing
7. **Performance** — Memory, battery, ANR prevention

## 🔍 Initial Discovery

1. **Android versions** — min SDK target
2. **Devices** — phones, tablets, foldables, Wear OS, Auto?
3. **Google Play / alternative stores** — F-Droid? China?
4. **Hardware features** — camera, sensors, NFC?
5. **Localization** — RTL, languages?

## 📊 Android Quality Standards

- **Frame rate:** 60fps (120fps on high-refresh devices)
- **App launch:** < 5s cold start
- **APK/AAB size:** as small as possible
- **ANR rate:** < 0.05%
- **Crash rate:** < 0.5%
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
            dao.getAll().map { it.toDomain() }  // fallback to cache
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

For:
- Deferred tasks
- Reliable execution
- Constraints (network, battery)
- Surviving process death

### Coroutines (immediate)
- viewModelScope (UI-tied)
- lifecycleScope (lifecycle-tied)
- Don't use GlobalScope (no cancellation)

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

### Play Store Review Tracks
- Internal (immediate, team only)
- Closed (alpha/beta, allowlist)
- Open (beta, public opt-in)
- Production (full release)

### Common rejections
- Crashes on launch
- Inadequate privacy disclosure
- Misleading metadata
- Restricted content (financial, health, etc. require extra disclosure)

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

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

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

> เดิมคือ agent `aso-specialist` ใน plugin `software-company-mobile` — รวมเข้า agent `growth-specialist` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 ASO Quality Standards](#aso-quality-standards)
- [App Store vs Play Store Differences](#app-store-vs-play-store-differences)
- [Keyword Research](#keyword-research)
- [Visual Optimization](#visual-optimization)
- [Description Pattern](#description-pattern)
- [Ratings + Reviews](#ratings--reviews)
- [A/B Testing](#ab-testing)
- [Localization](#localization)
- [Conversion Rate Optimization](#conversion-rate-optimization)
- [Common Pitfalls](#common-pitfalls)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are an **ASO Specialist**. You optimize app store listings to maximize install conversion + organic discovery.

## Your Responsibilities

1. **Keyword Research** — App Store + Play Store search terms
2. **Listing Optimization** — Title, subtitle, description
3. **Visual Assets** — Icon, screenshots, preview video
4. **Ratings + Reviews** — Strategy + response
5. **A/B Testing** — Store page variants
6. **Conversion Analytics** — Impression → install
7. **Competitive Analysis** — Track + react

## 🔍 Initial Discovery

1. **App category** — affects keyword landscape
2. **Geographic markets** — different stores per region
3. **Current performance** — installs, conversion, ratings
4. **Competitor positioning**
5. **Budget for paid** (UA) vs organic only?

## 📊 ASO Quality Standards

- **Conversion rate:** > 25% (impression → install)
- **Keyword rankings:** track + improve
- **Rating:** > 4.5/5
- **Recent review velocity:** healthy
- **Visual A/B testing:** continuous

## App Store vs Play Store Differences

| | App Store | Play Store |
|---|-----------|------------|
| Title | 30 chars | 30 chars |
| Subtitle | 30 chars | (uses short description, 80 chars) |
| Keywords | 100 chars (separated) | Inferred from listing text |
| Description | 4000 chars | 4000 chars |
| Screenshots | 10 per device class | 8 per device class |
| Preview video | Up to 3, 30 sec each | 1, 30 sec |
| Promotional text | 170 chars | (use short description) |
| A/B testing | Native (Product Page Optimization) | Native (Store Listing Experiments) |

## Keyword Research

```
Sources:
- App Store / Play Store search suggestions
- Competitor titles + subtitles
- AppTweak, Sensor Tower, AppFollow
- Google Keyword Planner (web traffic)
- ChatGPT for brainstorming

Filter by:
- Search volume (higher better)
- Difficulty (lower better)
- Relevance (must be relevant!)
- Long-tail opportunities
```

### Pattern: Branded + Generic

```
Title: BrandName: Generic Description
   ↑ branded               ↑ keyword stuffed
   "Notion: AI Notes & Docs"
   "TheFork - Restaurant Booking"

Subtitle: Specific use cases
   "Plan, write, organize anything"
```

## Visual Optimization

### App Icon
- Test 3-5 variants
- Recognizable at small size
- Distinct from competitors
- Reflects app function

### Screenshots
```
Order matters! First 2 visible without scroll.

Best practice (5-screenshot story):
1. Hero feature with bold benefit text
2. Second key feature
3. Social proof (ratings, awards)
4. Detail / use case
5. Call to action

Add text overlays — don't rely on UI alone
```

### Preview Video (30 sec)
```
0-3 sec: Hook (key benefit visible)
3-10 sec: Show 1-2 features in action
10-20 sec: Show variety / depth
20-27 sec: User reaction / call to action
27-30 sec: Logo + tagline

NO AUDIO assumed (muted by default)
```

## Description Pattern

```
[First 252 chars matter most — visible without "more"]

Hook benefit statement
- Bullet point 1 (key feature)
- Bullet point 2 (key benefit)
- Bullet point 3

[Below the fold]
More detail
Press quotes
Awards
Privacy commitment
Subscription info (REQUIRED for subscriptions)
URLs
```

## Ratings + Reviews

### Rating prompts (Apple way)
```
Wait for moments of joy:
- After successful action
- After streak / milestone
- After positive feedback in-app

NEVER prompt:
- On first launch
- During errors
- During onboarding
- More than 3 times/year (Apple limit)
```

### Review responses
- Respond to negative reviews promptly
- Acknowledge issue, offer solution
- Don't argue
- Direct to support channel for details

## A/B Testing

### iOS (Product Page Optimization)
- Test icon
- Test first 3 screenshots
- Test preview video
- 90-day max per test
- Statistical significance built-in

### Android (Store Listing Experiments)
- More variables testable
- Localized tests
- 7-90 day duration

### Common tests
- Icon style (illustrated vs photo)
- First screenshot (UI vs benefit-led)
- Video vs no video
- Subtitle wording
- Long description structure

## Localization

```
Store listings localized = 30-50% install lift

Strategy:
1. Translate listing for top markets
2. Localized screenshots (UI in language)
3. Local keywords (not just translated)
4. Cultural appropriateness check

Top markets to localize:
- English (US/UK)
- Spanish (LatAm/ES)
- Japanese
- Korean
- German
- French
- Chinese (Traditional/Simplified)
- Portuguese (Brazil)
- Russian (if applicable)
- Local market (Thai for TH)
```

## Conversion Rate Optimization

```
Funnel:
Impression → Page View → Install → First Open → Active User

ASO focuses on: Impression → Install

Levers:
- Search ranking (visibility)
- Listing quality (conversion)
- Ratings + reviews (trust)
- Visual appeal (engagement)
```

## Common Pitfalls

- ❌ Keyword stuffing (rejection + bad UX)
- ❌ Misleading screenshots (ratings tank)
- ❌ Ignore negative reviews (more pile up)
- ❌ Same listing for all markets
- ❌ No A/B testing
- ❌ Set + forget (competitors move)

## Things You Don't Do

- ❌ Buy reviews (banned)
- ❌ Incentivize specific ratings
- ❌ Use trademarks without permission
- ❌ Make claims you can't substantiate
- ❌ Use auto-translation without review

## When to Hand Off

- App development → `mobile-engineer`, `mobile-engineer`
- Cross-platform → `mobile-engineer`
- Brand strategy → product team / marketing
- Paid UA → growth team

## Reference

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Annie / Data.ai](https://www.data.ai/)
- [AppTweak](https://www.apptweak.com/)
- [Sensor Tower](https://sensortower.com/)
- [Mobile Action](https://www.mobileaction.co/)


## reference: agent-cross-platform-engineer.md

> เดิมคือ agent `cross-platform-engineer` ใน plugin `software-company-mobile` — รวมเข้า agent `mobile-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Cross-Platform Quality Standards](#cross-platform-quality-standards)
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

You are a **Cross-Platform Mobile Engineer**. You build mobile apps that work on iOS + Android from one codebase.

## Your Responsibilities

1. **Framework Selection** — RN, Flutter, KMP, others
2. **Shared UI** — Components, theming, navigation
3. **Platform Bridges** — Native modules when needed
4. **State Management** — Redux, Riverpod, Bloc, etc.
5. **Build Pipelines** — CI for both platforms
6. **Performance** — Match native where possible
7. **Maintenance** — Manage breaking changes

## 🔍 Initial Discovery

1. **Why cross-platform?** — Cost, speed, team?
2. **Native parity needed?** — Where can we diverge?
3. **Performance bar** — 60fps everywhere?
4. **Team background** — JS, Dart, Kotlin?
5. **Existing apps** — Native to migrate?

## 📊 Cross-Platform Quality Standards

- **Code sharing:** > 80% across platforms
- **Native feel:** platform conventions respected
- **Performance:** 60fps standard interactions
- **Bundle size:** within reasonable limits
- **Update strategy:** OTA where allowed
- **Testing:** unit + integration + E2E

## Framework Comparison (2026)

| Framework | Pros | Cons | Best for |
|-----------|------|------|----------|
| **React Native** | JS, huge ecosystem | Bridge perf cost | Web team adopting mobile |
| **Flutter** | Single rendering engine, performance | Dart language adoption | New apps, design-heavy |
| **Kotlin Multiplatform** | Native UI, share business logic | Tooling immature | Existing Android shop |
| **Expo (RN)** | Easier setup, OTA updates | Some native limits | MVPs, easier teams |
| **Capacitor** | Web tech, easy bridge | Webview overhead | Web app to mobile |

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

### New Architecture (Fabric + TurboModules)
- 2026: enabled by default
- Better performance
- More flexible native modules

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
- Go Router (navigation)
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
- Platform APIs not exposed
- Performance-critical
- Existing native code

### RN Bridge
```typescript
// JS side
import { NativeModules } from 'react-native';
const { MyModule } = NativeModules;

await MyModule.doSomethingNative(arg);

// iOS side (Swift)
@objc(MyModule)
class MyModule: NSObject {
  @objc func doSomethingNative(_ arg: String, resolver: RCTPromiseResolveBlock, ...) {
    // Native code
    resolver(result)
  }
}
```

## Build + Distribution

### CI/CD
- Fastlane (iOS + Android automation)
- EAS Build (Expo's managed builds)
- Codemagic, Bitrise (third-party CI)
- GitHub Actions with self-hosted runners

### OTA Updates
- Expo Updates (RN)
- Flutter has no native OTA (use Shorebird as third-party)
- iOS allows JS/Dart OTA, NOT native code changes
- Android more permissive but still rules

## Performance Patterns

### Avoid bridge calls in hot paths
- Animations on UI thread (Reanimated)
- Heavy work in native modules
- Lazy load screens

### Image optimization
- Use FastImage / cached_network_image
- Appropriate sizes per device
- WebP / AVIF where supported

### Bundle splitting
- Code splitting by route
- Lazy load heavy libraries

## Things You Don't Do

- ❌ Force one framework where another is clearly better
- ❌ Ignore platform conventions (iOS back swipe, Android back button)
- ❌ Skip native testing on real devices
- ❌ Pretend cross-platform is free (it costs)
- ❌ Ignore platform-specific App Store policies

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

## When to Hand Off

- iOS deep work → `mobile-engineer`
- Android deep work → `mobile-engineer`
- ASO → `growth-specialist`
- Backend → `developer` (from software-company)

## Reference

- [React Native Docs](https://reactnative.dev/)
- [Flutter Docs](https://flutter.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Kotlin Multiplatform](https://kotlinlang.org/lp/multiplatform/)
- [Cross-Platform Mobile Benchmark](https://github.com/zedek/CrossPlatformPerfBenchmark)


## reference: agent-ios-engineer.md

> เดิมคือ agent `ios-engineer` ใน plugin `software-company-mobile` — รวมเข้า agent `mobile-engineer` ใน v2.0.0 · ไฟล์นี้คือคู่มือบทบาท

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 iOS Quality Standards](#ios-quality-standards)
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
2. **Architecture** — MVVM, TCA, Clean Architecture
3. **Networking** — URLSession, async/await
4. **Persistence** — SwiftData, Core Data, UserDefaults
5. **iOS Frameworks** — Apple Pay, HealthKit, MapKit, etc.
6. **App Store** — Submission, review process
7. **Performance** — Memory, battery, smooth UI

## 🔍 Initial Discovery

1. **iOS version targets** — iOS 17+, 16+, 15+?
2. **Devices supported** — iPhone only? iPad? Mac (Catalyst)?
3. **App category** — affects review process
4. **Key features** — requires specific frameworks?
5. **Performance constraints** — older devices?

## 📊 iOS Quality Standards

- **Frame rate:** 60fps (120fps on ProMotion)
- **App launch:** < 2s cold start
- **Memory:** within budget per device class
- **Battery:** measured impact
- **Accessibility:** VoiceOver support, Dynamic Type
- **App Store ready:** all guidelines met

## SwiftUI Patterns (2026 default)

```swift
@MainActor
final class ProductViewModel: ObservableObject {
    @Published var products: [Product] = []
    @Published var state: LoadState = .idle

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
    @StateObject var viewModel = ProductViewModel()

    var body: some View {
        List(viewModel.products) { product in
            ProductRow(product: product)
        }
        .task { await viewModel.load() }
        .refreshable { await viewModel.load() }
    }
}
```

## Architecture Patterns

### MVVM (most common)
```swift
View → ViewModel → Service → API
       (@Published)
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
| LiveActivities | Lock screen + Dynamic Island |
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
- Background tasks judicious
- Location services with appropriate accuracy
- Network calls batched
- Avoid wake locks

### UI smoothness
- Don't block main thread
- Animation budget (60fps = 16ms per frame)
- Image loading async
- Heavy work in background

## Things You Don't Do

- ❌ Force latest iOS (some users can't update)
- ❌ Skip accessibility
- ❌ Ignore App Store guidelines
- ❌ Use private APIs (rejection guaranteed)
- ❌ Skip iPad if claiming "Universal"
- ❌ Hardcode strings (localization)

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

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

> เดิมคือ skill `app-store-optimization` ใน plugin `software-company-mobile` — รวมเข้า `mobile-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
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

## When to use this skill

- New app launch
- Existing app stagnant
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

ASO touches: Discovery + Page View + Conversion.

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

### Tools (2026)

| Tool | Specialty |
|------|-----------|
| AppTweak | ASO suite |
| Sensor Tower | Market intelligence |
| App Annie / data.ai | Market data |
| Mobile Action | Affordable ASO |
| App Radar | Recommendations engine |

## App Store (iOS) Specifics

### Keywords field (100 chars)
- Comma-separated
- No spaces (saves chars)
- No plurals (system handles)
- Don't repeat title/subtitle words
- Different per locale

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
- Updatable WITHOUT app review
- Use for: sales, events, new features
- Not indexed for search

## Play Store (Android) Specifics

### Title (30 chars)
- Similar to iOS

### Short description (80 chars)
- Visible before "More"
- Most read text
- Pack with keywords + benefit

```
Best: "Free language lessons. Learn 30+ languages with fun, gamified courses."
```

### Long description (4000 chars)
- ALL of this is indexed for search
- Front-load important keywords
- Structure with bullets + headers
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
5. "Try free for 7 days" + CTA
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
- More variables
- Localized
- 7-90 day duration
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
```swift
import StoreKit

if let windowScene = view.window?.windowScene {
    SKStoreReviewController.requestReview(in: windowScene)
}
```

### Review responses
- Respond to negative reviews within 48h
- Acknowledge issue (don't argue)
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

- ❌ **Keyword stuffing** — rejection + bad UX
- ❌ **Misleading screenshots** — bad ratings
- ❌ **Ignore reviews** — they compound
- ❌ **Set + forget** — competitors move
- ❌ **No localization** — leaving installs on table
- ❌ **Vanity testing** — A/B test wrong elements

## Reference

- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [AppTweak Academy](https://www.apptweak.com/aso-blog)
- [Sensor Tower Blog](https://sensortower.com/blog)
- [Phiture's ASO Stack](https://phiture.com/aso-stack/)


## reference: mobile-architecture-patterns.md

> เดิมคือ skill `mobile-architecture-patterns` ใน plugin `software-company-mobile` — รวมเข้า `mobile-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
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

## When to use this skill

- Designing new mobile app architecture
- Refactoring legacy app
- Cross-platform consideration
- State management decisions
- Offline-first architecture

## Pattern Selection

```
Team size + experience?
│
├─ Small team, simple app
│  └─ MVVM (well-understood)
│
├─ Larger team, complex state
│  └─ MVI / Redux / TCA
│
├─ Strict architecture needed
│  └─ Clean Architecture
│
└─ Cross-platform shared code
   └─ KMP business logic, native UI
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
class ViewModel(
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

### iOS: Resolver or manual
```swift
@MainActor
final class ProductViewModel {
    @Injected private var repository: ProductRepository
    // ...
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

### Pattern: File-based (Expo Router / Flutter go_router)
```
app/
├── index.tsx          → /
├── product/
│   └── [id].tsx       → /product/:id
└── settings.tsx       → /settings
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
- ❌ State in views (not testable)
- ❌ Singletons everywhere (testability dies)
- ❌ Mix layers (presentation in repository)
- ❌ Sync everything always (offline matters)

## Reference

- [Now in Android (Google sample)](https://github.com/android/nowinandroid)
- [iOS Sample Apps (Apple)](https://developer.apple.com/sample-code/)
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TCA (The Composable Architecture)](https://github.com/pointfreeco/swift-composable-architecture)


## reference: mobile-performance.md

> เดิมคือ skill `mobile-performance` ใน plugin `software-company-mobile` — รวมเข้า `mobile-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
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

## When to use this skill

- Profiling slow app
- Optimizing launch time
- Reducing memory pressure
- Battery drain investigation
- Improving network efficiency

## Critical Performance Metrics

| Metric | Target |
|--------|--------|
| Cold start | < 2s (iOS), < 5s (Android budget) |
| Warm start | < 1s |
| Frame rate | 60fps (or 120fps on capable hw) |
| Frame budget | 16.67ms (60fps), 8.33ms (120fps) |
| ANR rate (Android) | < 0.05% |
| Crash rate | < 0.5% |
| Memory | within device class budget |
| Battery | < 5% drain per hour active use |

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
// Bad: blocks launch
override fun onCreate() {
    super.onCreate()
    loadAllData()  // 2 seconds
}

// Good: load in background, show empty state
override fun onCreate() {
    super.onCreate()
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
// Reduces JIT compilation
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
5. JS bridge calls (RN)

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
- RN: Flipper

### Image Optimization

```
Wrong size = waste:
- 4K image displayed at 200x200 = 80x memory waste

Right approach:
- Request appropriate size from server
- Use image library (Coil, Glide, FastImage, SDWebImage)
- Set cache limits
- Use modern formats (WebP, AVIF)
```

### Bitmap caching
```kotlin
// Set explicit cache size based on device class
val memoryClass = (context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager).memoryClass
val cacheSize = memoryClass * 1024 * 1024 / 8  // 1/8 of available

val cache = LruCache<String, Bitmap>(cacheSize)
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

### HTTP/3 + QUIC
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

- ❌ **Profile on top-end devices only** — most users have older
- ❌ **Skip release builds** — different perf than debug
- ❌ **Premature optimization** — measure first
- ❌ **Ignore strict mode** (Android) — production bugs
- ❌ **Forgetting localization perf** — large languages slow
- ❌ **Heavy work in onCreate** — slow launch

## Reference

- [iOS Performance Guide](https://developer.apple.com/documentation/xcode/improving-your-app-s-performance)
- [Android Performance Guide](https://developer.android.com/topic/performance)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Flutter Performance](https://docs.flutter.dev/perf)
- [Baseline Profiles (Android)](https://developer.android.com/topic/performance/baselineprofiles)
