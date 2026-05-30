---
name: mobile-performance
description: Use when optimizing mobile app performance — frame rate, launch time, memory, battery, network efficiency. Patterns for iOS and Android.
---

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
