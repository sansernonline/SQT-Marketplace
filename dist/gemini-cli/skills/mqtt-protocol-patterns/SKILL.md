---
name: mqtt-protocol-patterns
description: Use when implementing MQTT clients/brokers, designing topic structures, choosing QoS levels, implementing retained messages, will/testament, or MQTT 5 features. Concrete patterns for production systems.
---

# MQTT Protocol Patterns

## When to use this skill

- Implementing MQTT client (device or app)
- Designing topic hierarchies
- Choosing QoS levels
- Implementing reconnect + persistent sessions
- Using MQTT 5 features (properties, shared subscriptions)
- Migrating from MQTT 3.1.1 to MQTT 5

## MQTT Version Selection

| | MQTT 3.1.1 | MQTT 5 |
|--|-----------|--------|
| Compatibility | Universal | Newer brokers only |
| Reason codes | Limited | Detailed |
| Properties | None | Per-packet metadata |
| Shared subs | No | ✅ |
| Retain handling | Basic | Advanced |
| Use when | Legacy required | Greenfield |

> 💡 **2026 default: MQTT 5** unless legacy constraints

## Topic Structure Patterns

### Pattern: Tenant-Aware Hierarchy

```
{tenant}/{site}/{type}/{id}/{message}

Examples:
acme/factory-1/sensor/dev-001/telemetry
acme/factory-1/sensor/dev-001/state
acme/factory-1/sensor/dev-001/cmd/req
acme/factory-1/sensor/dev-001/cmd/resp
```

Benefits:
- ACLs straightforward
- Wildcards intuitive
- Sharding by tenant possible

### Pattern: Request/Response

```
Request:  {tenant}/{device}/cmd/req
Response: {tenant}/{device}/cmd/resp

Or use MQTT 5 Response Topic property:
Request includes "response-topic" property
Subscriber publishes response there
```

### Pattern: Commands with ACK

```
Cloud → Device: cmd/req with cmd_id
Device → Cloud: cmd/resp with same cmd_id + status

Idempotency: device tracks recent cmd_ids
```

## QoS Patterns

### QoS 0 (At Most Once)
```python
# Fire and forget
client.publish(topic, payload, qos=0)

# Use for:
# - High-frequency telemetry
# - Real-time metrics that update quickly
# - Status pings
```

### QoS 1 (At Least Once)
```python
# Acknowledged delivery
client.publish(topic, payload, qos=1)

# Subscriber MUST handle duplicates
# Use idempotency keys in payload

# Use for:
# - Commands
# - State updates
# - Telemetry that matters
```

### QoS 2 (Exactly Once)
```python
# 4-step handshake (slow!)
client.publish(topic, payload, qos=2)

# Use for:
# - Financial transactions over MQTT
# - Critical state changes
# - When duplicates UNACCEPTABLE

# Cost: 2-4x more network round-trips
```

## Connection Patterns

### Persistent Session

```python
client = mqtt.Client(
    client_id="dev-abc",
    clean_session=False  # MQTT 3 — keep state on disconnect
)

# MQTT 5
client.connect(
    properties={
        "SessionExpiryInterval": 3600  # keep for 1h
    }
)

# Benefits:
# - Subscriptions persist
# - QoS 1/2 messages queued during disconnect
# - Reconnect picks up where left off
```

### Clean Session

```python
client = mqtt.Client(clean_session=True)

# Use for:
# - Stateless workers
# - One-shot publishers
# - When fresh state desired
```

## Will (Last Will and Testament)

```python
# Set BEFORE connect
client.will_set(
    topic=f"{tenant}/{device_id}/state",
    payload='{"status":"offline","reason":"unexpected"}',
    qos=1,
    retain=True
)

client.connect(broker)
# ...

# On graceful disconnect, manually publish online → offline
# On abnormal disconnect, broker publishes will message
```

## Retained Messages

```python
# Publish with retain
client.publish(
    topic=f"{tenant}/{device_id}/config",
    payload=config_json,
    qos=1,
    retain=True
)

# New subscribers immediately receive last retained value
# Use for:
# - Configuration
# - Latest known state
# - Slowly-changing reference data

# Clear retain by publishing empty payload with retain=True
client.publish(topic, payload="", retain=True)
```

## Reconnect Logic

```python
import paho.mqtt.client as mqtt
import time

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        # Resubscribe (clean session=true)
        client.subscribe([
            (f"{tenant}/{device_id}/cmd/req", 1),
            (f"{tenant}/broadcast/+", 1),
        ])

def on_disconnect(client, userdata, rc, properties=None):
    print(f"Disconnected: rc={rc}")
    if rc != 0:
        # Unexpected disconnect, will auto-reconnect

client = mqtt.Client(client_id="dev-abc", clean_session=False)
client.on_connect = on_connect
client.on_disconnect = on_disconnect

# Auto-reconnect with backoff
client.reconnect_delay_set(min_delay=1, max_delay=120)

client.connect_async(broker, port=8883, keepalive=60)
client.loop_start()
```

## Backpressure Handling

```python
# When publishing faster than network allows
# Client buffers messages — but bounded!

# MQTT 5 flow control
client.connect(
    properties={
        "ReceiveMaximum": 100  # max inflight messages
    }
)

# Application-level backpressure
async def publish_with_backpressure(topic, payload, qos=1):
    while client.inflight_count() > 50:
        await asyncio.sleep(0.01)
    await client.publish(topic, payload, qos)
```

## MQTT 5 Specific Patterns

### Properties

```python
# User properties (key-value metadata)
client.publish(
    topic, payload,
    qos=1,
    properties={
        "UserProperty": [
            ("trace-id", "abc-123"),
            ("source-version", "1.2.3"),
        ]
    }
)
```

### Shared Subscriptions

```
$share/group-name/topic

Multiple subscribers share the load
Each message delivered to ONE subscriber in group

Use for:
- Scaling consumers
- Load balancing
```

### Reason Codes

```python
# MQTT 5 returns detailed reason codes
# Not just success/fail
# E.g., 0x83 ("Implementation Specific Error")
#       0x97 ("Quota Exceeded")
#       0x9A ("Retain Not Supported")

# Handle gracefully
def on_publish_failed(client, userdata, mid, reason_code, properties):
    if reason_code == 0x97:
        # Slow down, adjust quota
        ...
```

## Topic Filter Best Practices

```
✅ Subscribe specific:
   acme/factory-1/sensor/+/telemetry

❌ Subscribe too broad:
   #
   (gets EVERYTHING, kills consumer)

✅ Use shared subs for high-volume:
   $share/processors/acme/+/+/telemetry

❌ Many overlapping subscriptions:
   acme/+/+/+
   acme/factory-1/+/+
   acme/factory-1/sensor/+
   (broker matches all, sends multiple times)
```

## Things You Don't Do

- ❌ Subscribe to `#` (gets EVERYTHING)
- ❌ Use QoS 2 by default (slow)
- ❌ Forget retained message cleanup
- ❌ Block in message callback (queues fill)
- ❌ Reconnect without backoff (broker DDoS)

## Reference

- [MQTT 5 spec](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- [MQTT 3.1.1 spec](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [HiveMQ MQTT Essentials](https://www.hivemq.com/mqtt-essentials/)
- [EMQX Documentation](https://docs.emqx.com/)
- [Paho MQTT Clients](https://www.eclipse.org/paho/)
