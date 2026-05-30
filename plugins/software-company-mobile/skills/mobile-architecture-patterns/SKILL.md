---
name: mobile-architecture-patterns
description: Use when designing mobile app architecture — choosing between MVVM, MVI, Clean Architecture, navigation patterns, dependency injection, offline-first patterns, state management. Native and cross-platform.
---

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
