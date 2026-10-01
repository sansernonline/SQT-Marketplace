---
name: device-fleet-management
description: Use when managing fleets of IoT devices — provisioning, monitoring, configuration, OTA updates, decommissioning. Patterns for hundreds to millions of devices.
---

# Device Fleet Management Patterns

## When to use this skill

- Designing device provisioning at scale
- Building fleet monitoring dashboards
- Implementing OTA update workflows
- Device configuration management
- Diagnostic + remote support tools
- End-of-life device decommissioning

## Device Lifecycle

```
Manufacturing → Provisioning → Activation → Operation → Maintenance → Decommission
     │              │              │           │            │              │
   Burn cert     First boot     User adds    Telemetry   OTA, fixes    Wipe, return
   Burn ID       Connects        Pairs       Commands                  Or recycle
```

## Provisioning Patterns

### Pattern: Just-in-Time Provisioning (JITP)

```
Manufacturing burns:
- Unique device ID (from chip ID or secure element)
- Per-device cert (signed by CA)

First boot:
1. Device connects to provisioning endpoint
2. Presents cert
3. Cloud validates → creates device record
4. Cloud returns runtime config
5. Device transitions to operational

Benefits:
- No pre-registration overhead
- Scales infinitely
- Devices ship before known to cloud
```

### Pattern: Zero-Touch Provisioning

```
Manufacturer registers batches with cloud:
- Device IDs
- Public keys
- Customer assignment

End user:
- Powers on device
- Device connects + identifies
- Cloud auto-claims to user
- Ready to use

Use for: consumer IoT (no setup)
```

### Pattern: Activation Flow

```
1. User opens app
2. Scans QR code on device
3. Device connects to home WiFi (BLE-assisted)
4. Device announces to cloud
5. Cloud links to user account
6. Device operational
```

## Fleet Monitoring

### Health Tiers

```
🟢 Healthy:     reporting + responsive
🟡 Degraded:    reporting but slow / errors
🔴 Unhealthy:   not reporting OR critical errors
⚫ Offline:    no contact within SLA
```

### Key Metrics

```python
fleet_metrics = {
    'total_devices': count_all(),
    'online': count_status('online'),
    'offline_24h': count_offline_since_hours(24),
    'errors_last_hour': count_errors_recent(),
    'avg_battery': mean_battery_level(),
    'firmware_distribution': histogram_by_version(),
    'connectivity_distribution': histogram_by_rssi(),
}
```

### Anomaly Detection

```python
# Per-device behavior baseline
def detect_anomaly(device_id):
    recent = get_recent_telemetry(device_id, hours=24)
    baseline = get_baseline(device_id)

    if recent.avg_temp > baseline.avg_temp + 3 * baseline.std_temp:
        return Anomaly('temp_spike', severity='medium')

    if recent.reporting_rate < baseline.reporting_rate * 0.5:
        return Anomaly('reporting_decline', severity='high')
```

## OTA Strategy

### Layered Updates

```
Layer 1: Bootloader (rarely, requires service)
Layer 2: Firmware/OS (signed binaries)
Layer 3: App / container (frequently)
Layer 4: Config (very frequently)

Different update cadences per layer
```

### A/B Partitioning

```
Flash layout:
[Boot] [Slot A] [Slot B] [User data]

Update flow:
1. Currently running Slot A
2. Download new firmware to Slot B
3. Verify signature
4. Set boot flag to Slot B
5. Reboot
6. Run self-test
7. If pass → commit Slot B
8. If fail → revert to Slot A
```

### Staged Rollout

```python
async def rollout_firmware(version: str, fleet_filter: dict):
    eligible = await get_devices(fleet_filter)

    stages = [
        {'percent': 1, 'wait_hours': 24},
        {'percent': 10, 'wait_hours': 24},
        {'percent': 50, 'wait_hours': 12},
        {'percent': 100, 'wait_hours': 0},
    ]

    for stage in stages:
        target = int(len(eligible) * stage['percent'] / 100)
        batch = random.sample(eligible, target)

        await schedule_updates(batch, version)
        await asyncio.sleep(stage['wait_hours'] * 3600)

        # Health check
        success_rate = await calculate_success_rate(batch)
        if success_rate < 0.95:
            await alert('OTA degradation, halting')
            return
```

## Configuration Management

### Pattern: Desired State

```
Cloud stores DESIRED state per device
Device reports CURRENT state
Reconciliation: device polls/subscribes for desired
Applies if differs, reports back when synced
```

```typescript
interface DeviceConfig {
  desired: {
    telemetry_rate_hz: 1,
    log_level: 'info',
    features: { motion_detect: true }
  },
  current: {
    telemetry_rate_hz: 1,
    log_level: 'info',
    features: { motion_detect: true }
  },
  last_synced: '2025-...'
}
```

### Pattern: Config Versioning

```
config_v1 → config_v2 → config_v3
              ↑              ↑
            rolled         current
            back to

Track which version each device runs
Allow rollback per device or fleet
```

### Group-Based Configuration

```
Device groups (by tag/property):
- "production-eu" → config A
- "production-us" → config B
- "beta-testers" → config C

Devices inherit config from groups
Per-device override possible
```

## Remote Diagnostics

```typescript
// Trigger diagnostic from cloud
{
  "cmd": "diagnostic",
  "request_id": "diag-abc",
  "collect": ["logs:5min", "config:current", "metrics:cpu", "trace:1min"]
}

// Device collects + uploads (size-bounded)
// Cloud notifies operator when complete
```

## Decommissioning

```
End of life flow:
1. Mark device "decommissioning" in fleet
2. Push "wipe" command
3. Device wipes secrets, factory resets
4. Acknowledges
5. Cloud removes from active fleet
6. Cert revoked (CRL/OCSP)

Why: prevent return-to-service after disposal
```

## Fleet Operations

### Bulk Commands

```python
# Apply command to filtered fleet
async def bulk_command(filter: dict, cmd: dict):
    devices = await get_devices(filter)

    # Rate-limit to avoid broker storm
    semaphore = asyncio.Semaphore(100)

    async def send_one(device):
        async with semaphore:
            await send_command(device.id, cmd)

    await asyncio.gather(*[send_one(d) for d in devices])
```

### Maintenance Windows

```
Schedule fleet operations during low-impact times
Group by timezone
Stagger to avoid thundering herd
```

## Tools (2026)

| Need | Tools |
|------|-------|
| Device management | Balena, Mender, Particle, AWS IoT Device Mgmt |
| OTA | Mender, hawkBit, Balena |
| Monitoring | Grafana, custom |
| Provisioning | Custom + cert management |
| Config | Cloud-native or vendor |

## Things You Don't Do

- ❌ One-shot OTA to whole fleet (canary first)
- ❌ Shared credentials across fleet
- ❌ Skip device authentication
- ❌ Trust device-reported state without verification
- ❌ Decommission without revoking certs
- ❌ Brick recovery requires physical access

## Reference

- [AWS IoT Device Management](https://aws.amazon.com/iot-device-management/)
- [Azure IoT Hub Device Provisioning](https://learn.microsoft.com/en-us/azure/iot-dps/)
- [Mender OTA](https://mender.io/)
- [Balena Documentation](https://docs.balena.io/)
- [hawkBit](https://eclipse.dev/hawkbit/)
