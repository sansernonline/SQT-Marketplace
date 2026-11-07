# README ตามภาษา — คำสั่ง ไฟล์ และหัวข้อที่ต้องเพิ่ม

ใช้คู่กับ [`readme-skeleton.md`](readme-skeleton.md) · ตารางนี้เป็นจุดเริ่ม ไม่ใช่คำสั่งที่ใส่ได้ทันที **ทุกคำสั่งต้องรันจริงบนเครื่องเปล่าก่อนลง README** (`SKILL.md` ข้อ 2) · ช่องที่มี ※ คือยังไม่ได้เปิดหน้าทางการยืนยันในรอบที่เขียน (2026-11-07)

## 1 · รุ่น ไฟล์หลัก และค่าตั้งตาม environment

ใส่ลงหัวข้อ 4 "ต้องมีบนเครื่อง" และหัวข้อ 6 "ตั้งค่า" ของ README

| Stack | manifest + lock (commit ทั้งคู่) | ปักรุ่น runtime ที่ไฟล์ | ค่าตั้งตาม environment |
|---|---|---|---|
| Node / TypeScript | `package.json` + `package-lock.json` หรือ `pnpm-lock.yaml` (lock แบบเดียว) | `.nvmrc` (`nvm use`) · `engines` ใน `package.json` เป็นแค่คำเตือนจนกว่าจะเปิด `engine-strict` | Vite: `.env` · `.env.[mode]` · `.env.local` · มีแค่ `VITE_*` ที่ถึง browser · Angular: `src/environments/` + `ng build --configuration <ชื่อ>` |
| .NET / C# | `.sln` หรือ `.slnx` + `.csproj` · `packages.lock.json` ไม่บังคับ ※ | `global.json` → `sdk.version` (เลขเต็ม) + `rollForward` (ใช้ lock file ให้ตั้ง `disable`) | `appsettings.json` + `appsettings.{Env}.json` · เลือกด้วย `ASPNETCORE_ENVIRONMENT` (เว็บ) หรือ `DOTNET_ENVIRONMENT` · ไม่ตั้ง = Production · ค่าลับตอน dev: `dotnet user-secrets` · `launchSettings.json` ใช้แค่เครื่อง dev |
| Python | `pyproject.toml` + `uv.lock` · ไม่ commit `.venv` | `.python-version` (`uv python pin`) + `requires-python` | ไม่มีมาตรฐานกลาง · `.env` + environment variable หรือ settings ของ framework ※ |
| Java / Kotlin | `pom.xml` หรือ `build.gradle.kts` + `settings.gradle.kts` | Gradle wrapper (commit `gradlew` `gradlew.bat` `gradle/wrapper/*`) · Maven wrapper `mvnw` ※ · รุ่น Java Development Kit (JDK) | Spring Boot: `application.yml` + `application-{profile}.yml` · เปิดด้วย `SPRING_PROFILES_ACTIVE` หรือ `--spring.profiles.active=prod` |
| Go | `go.mod` + `go.sum` | บรรทัด `go 1.xx` (ขั้นต่ำ) + `toolchain` | ไม่มีมาตรฐาน · environment variable ※ |
| Flutter / Dart | `pubspec.yaml` + `pubspec.lock` (แอป commit lock · library ไม่ commit) | `environment:` ใน pubspec ※ · FVM ถ้าใช้ (ไม่ใช่ทางการ) | flavor: Android `productFlavors` ใน `android/app/build.gradle.kts` · iOS ใช้ scheme ※ · `--dart-define` ※ |
| Rust | `Cargo.toml` + `Cargo.lock` | `rust-toolchain.toml` (`channel` + `components`) | ไม่มีมาตรฐาน · environment variable ※ |
| PHP / Laravel | `composer.json` + `composer.lock` | `"php": "^8.x"` ใน `require` | `.env` (ไม่ commit) + `.env.example` · `APP_ENV` เลือก `.env.[APP_ENV]` · `APP_DEBUG=false` ใน production |

## 2 · คำสั่ง

ใส่ลงหัวข้อ 5 "เริ่มใช้งาน" · 7 "คำสั่งที่ใช้บ่อย" · 10 "build และไฟล์ที่ได้"

| Stack | ติดตั้ง | รัน | test | lint · format | build / แพ็ก → ไฟล์ที่ได้ |
|---|---|---|---|---|---|
| Node / TypeScript | `npm ci` (ยึด lock) · `pnpm install --frozen-lockfile` | `npm run dev` ※ | `npm test` ※ | `npm run lint` ※ · Prettier ※ | `npm run build` ※ → `dist/` |
| .NET / C# | `dotnet restore` | `dotnet run` · `dotnet run -lp https` | `dotnet test` ※ | `dotnet format` ※ | `dotnet publish` (net8.0 ขึ้นไปเป็น Release เอง) → `bin/Release/<tfm>/publish/` · `-r <RID> --self-contained` (Runtime Identifier (RID) เช่น `linux-x64`) |
| Python | `uv sync` | `uv run <คำสั่ง>` | `uv run pytest` ※ | `ruff check` · `ruff format` | `uv build` ※ → wheel · sdist |
| Java / Kotlin | ดึงตอน build | `./mvnw spring-boot:run` · `./gradlew bootRun` ※ | `./mvnw test` · `./gradlew test` ※ | Spotless · Checkstyle · ktlint (ไม่มีตัวกลาง) ※ | `./mvnw package` · `./gradlew build` ※ → jar รันด้วย `java -jar` |
| Go | `go mod download` ※ | `go run ./cmd/<ชื่อ>` ※ | `go test ./...` ※ | `gofmt` · `go vet` ※ | `go build ./...` ※ → binary ไฟล์เดียว |
| Flutter / Dart | `flutter pub get` ※ | `flutter run --flavor <ชื่อ>` | `flutter test` ※ | `flutter analyze` · `dart format .` ※ | `flutter build appbundle` → `build/app/outputs/bundle/release/app.aab` · `flutter build ipa` ※ |
| Rust | `cargo fetch` ※ | `cargo run` ※ | `cargo test` ※ | `cargo clippy` · `cargo fmt` ※ | `cargo build --release` ※ → `target/release/` |
| PHP / Laravel | `composer install` · `npm ci && npm run build` (asset) ※ | `php artisan serve` ※ | `php artisan test` | Laravel Pint ※ | deploy: `php artisan config:cache` (ห้ามรันตอน dev) · `php artisan storage:link` |

## 3 · หัวข้อที่ต้องเพิ่มใน README ตามภาษา

| Stack | เพิ่มอะไร |
|---|---|
| Node / TypeScript | รุ่น Node จาก `.nvmrc` + บอกให้สั่ง `nvm use` · ใช้ npm หรือ pnpm (ห้ามมี lock 2 แบบ) · ตาราง `scripts` · ตัวแปร `VITE_*` ทุกตัวพร้อมเตือนว่าค่าถึง browser · Angular: รายชื่อ configuration |
| .NET / C# | รุ่น Software Development Kit (SDK) ตาม `global.json` · project ไหนเป็นตัวเริ่ม · ตั้ง `ASPNETCORE_ENVIRONMENT` ที่ไหนบ้าง · ชื่อคีย์ที่ต้องใส่ผ่าน `user-secrets` (ไม่ใส่ค่า) · คำสั่ง `dotnet publish` ที่ใช้จริง · คำสั่ง migration ของ EF Core |
| Python | รุ่นจาก `.python-version` · ใช้ uv หรือ venv + pip (ทางเดียว) · เป็น src layout ต้องติดตั้งก่อน test · ตั้งค่า ruff อยู่ไหน · ไฟล์ `.env` ที่ต้องมี |
| Java / Kotlin | รุ่น JDK · ใช้ `./mvnw` หรือ `./gradlew` เสมอ ไม่ใช่ตัวที่ลงในเครื่อง · ตาราง profile และวิธีเปิด · ชื่อและที่อยู่ jar ที่ได้ |
| Go | รุ่นจากบรรทัด `go` และ `toolchain` · binary ใน `cmd/` แต่ละตัวทำอะไร · environment variable ที่อ่าน |
| Flutter / Dart | รุ่น Flutter และ Dart · ตาราง flavor (ชื่อ · applicationId · ไฟล์เริ่ม) · signing: `key.properties` และ keystore อยู่ไหน ขอจากใคร (ห้าม commit) · iOS: team และ provisioning · คำสั่ง build ต่อ flavor และที่อยู่ไฟล์ที่ได้ |
| Rust | toolchain จาก `rust-toolchain.toml` · feature flag ที่มี · binary ใน `src/bin/` · รุ่น Rust ต่ำสุดที่รองรับ (Minimum Supported Rust Version (MSRV)) ถ้าเป็น library |
| PHP / Laravel | รุ่น PHP และ extension ที่ต้องมี · `cp .env.example .env` → `php artisan key:generate` ※ → migrate · build asset · ขั้น deploy (`config:cache` · `storage:link` · queue worker) |

## 4 · โครงโฟลเดอร์ตามแหล่งทางการ

ใช้ประกอบหัวข้อ 8 "โครงโปรเจกต์" · กฎของ repo นี้ (ชื่อโฟลเดอร์โค้ด · ที่อยู่ test) อยู่ใน `SKILL.md` ข้อ 1 และชนะเมื่อขัดกัน

| Stack | โครงที่เครื่องมือคาดไว้ | แหล่ง |
|---|---|---|
| Node / TypeScript | npm ไม่กำหนด · ใช้ตามตัวสร้างของ framework (`src/` · `public/` · `vite.config.ts` หรือ `angular.json`) ※ | — |
| .NET / C# | ไม่มีหน้าทางการ · ที่พบบ่อย `src/<App>/` + `tests/<App>.Tests/` + `global.json` + `.slnx` ※ | — |
| Python | src layout: `src/<package>/` · `pyproject.toml` ที่ราก | [PyPA src vs flat](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/) |
| Java / Kotlin | `src/main/java` (หรือ `kotlin`) · `src/main/resources` · `src/test/java` | [Maven Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html) |
| Go | `cmd/<binary>/main.go` · `internal/` · แพ็กเกจเล็กวางไฟล์ที่รากได้ · `golang-standards/project-layout` และ `pkg/` เป็นของชุมชน ไม่ใช่ของทีม Go | [Organizing a Go module](https://go.dev/doc/modules/layout) |
| Flutter / Dart | `lib/` (`lib/src/` ส่วนภายใน) · `test/` · `android/` · `ios/` ※ | [Dart package layout](https://dart.dev/tools/pub/package-layout) |
| Rust | `src/main.rs` · `src/lib.rs` · `src/bin/` · `tests/` · `examples/` · `benches/` | [Cargo project layout](https://doc.rust-lang.org/cargo/guide/project-layout.html) |
| PHP / Laravel | `app/` · `config/` · `database/` · `public/` · `resources/` · `routes/` · `storage/` · `tests/` | [Laravel 13.x structure](https://laravel.com/docs/13.x/structure) |

## 5 · แหล่ง (เปิดอ่าน 2026-11-07)

[npm ci](https://docs.npmjs.com/cli/v10/commands/npm-ci) · [package.json engines](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) · [pnpm install](https://pnpm.io/cli/install) · [nvm .nvmrc](https://github.com/nvm-sh/nvm/blob/master/README.md) · [Vite env and mode](https://vite.dev/guide/env-and-mode) · [Angular environments](https://angular.dev/tools/cli/environments) · [global.json](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json) · [ASP.NET Core environments](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/environments) · [user-secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) · [dotnet publish](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-publish) · [Writing pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) · [uv project layout](https://docs.astral.sh/uv/concepts/projects/layout/) · [uv Python versions](https://docs.astral.sh/uv/concepts/python-versions/) · [Ruff configuration](https://docs.astral.sh/ruff/configuration/) · [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) · [Spring Boot profiles](https://docs.spring.io/spring-boot/reference/features/profiles.html) · [Spring Boot Maven run](https://docs.spring.io/spring-boot/maven-plugin/run.html) · [Go toolchains](https://go.dev/doc/toolchain) · [Flutter flavors](https://docs.flutter.dev/deployment/flavors) · [Flutter Android release](https://docs.flutter.dev/deployment/android) · [Cargo FAQ](https://doc.rust-lang.org/cargo/faq.html) · [rust-toolchain.toml](https://rust-lang.github.io/rustup/overrides.html) · [Composer basic usage](https://getcomposer.org/doc/01-basic-usage.md) · [Laravel configuration](https://laravel.com/docs/12.x/configuration)

รุ่นของเครื่องมือเปลี่ยนเร็ว (Laravel 13.x ออกแล้ว ณ วันที่ตรวจ) · ก่อนใช้ตารางนี้กับโปรเจกต์จริง เปิดหน้าทางการของรุ่นที่ใช้
