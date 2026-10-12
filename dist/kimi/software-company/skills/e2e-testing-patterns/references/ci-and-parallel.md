# Parallelization และ CI Integration

ระดับการรันขนาน รอบการรัน E2E ใน CI และไฟล์ที่ต้องเก็บไว้เมื่อเทสต์ล้ม

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | 🟢 Low (just enable) |
| Test-level within file | 10x+ | 🟡 Med (isolation needed) |
| Sharded across CI workers | Nx | 🟡 Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | 🔴 High (cost) |

**Requirements for safe parallel:**
- ✅ Tests don't share state
- ✅ Unique test data per test
- ✅ Database/external services support concurrency

## CI Integration

### Run E2E tier
```yaml
# Smoke (every PR, 2 min)
- 5-10 critical tests
- Fail = block merge

# Full (nightly, 30 min)
- All E2E tests
- Cross-browser
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P0 + P1 tests
- Must pass before prod deploy
```

### Artifacts to capture
- ✅ Screenshots on failure
- ✅ Video on failure
- ✅ Trace files (Playwright)
- ✅ Console logs
- ✅ Network logs
