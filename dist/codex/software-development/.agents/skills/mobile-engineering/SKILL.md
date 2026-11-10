---
name: mobile-engineering
description: Use when engineering a mobile app (Kotlin, Swift, Flutter, React Native, offline-first). Not screens.
argument-hint: <mobile-architecture | aso-audit> <details>
---

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

รวมจาก plugin `software-development-mobile` (เดิมชื่อ mobile-architecture-patterns → `references/mobile-architecture-patterns.md` · mobile-performance → `references/mobile-performance.md` · app-store-optimization → `references/app-store-optimization.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-development` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:mobile-engineering <mobile-architecture | aso-audit> <details>`

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `mobile-architecture` | Design mobile app architecture using mobile-engineer agent. Covers framework choice, state management, navigation. |
| `aso-audit` | Audit App Store / Play Store listing (App Store Optimization, ASO) using growth-specialist agent. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
