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
