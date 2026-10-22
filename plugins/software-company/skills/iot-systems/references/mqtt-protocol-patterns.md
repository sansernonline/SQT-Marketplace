> เดิมชื่อ mqtt-protocol-patterns (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-iot` — รวมเข้า `iot-systems` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [MQTT Version Selection](#mqtt-version-selection)
- [Topic Structure Patterns](#topic-structure-patterns)
- [QoS Patterns](#qos-patterns)
- [Connection Patterns](#connection-patterns)
- [Will (Last Will and Testament)](#will-last-will-and-testament)
- [Retained Messages](#retained-messages)
- [Reconnect Logic](#reconnect-logic)
- [Backpressure Handling](#backpressure-handling)
- [MQTT 5 Specific Patterns](#mqtt-5-specific-patterns)
- [Topic Filter Best Practices](#topic-filter-best-practices)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# MQTT Protocol Patterns

## When to use this skill

- Implementing an MQTT client (device or app)
- Designing topic hierarchies
- Choosing QoS levels
- Implementing reconnect and persistent sessions
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

> 💡 **2026 default: MQTT 5**, unless legacy systems force 3.1.1

## Topic Structure Patterns

### Pattern: Tenant-Aware Hierarchy

```
{tenant}/{site}/{type}/{id}/{message}      ← the one scheme for this skill; role files link here

Examples:
acme/factory-1/sensor/dev-001/telemetry
acme/factory-1/sensor/dev-001/state
acme/factory-1/sensor/dev-001/cmd/req
acme/factory-1/sensor/dev-001/cmd/resp
```

Benefits:
- ACLs are simple to write
- Wildcards behave as you'd expect
- You can shard by tenant

### Pattern: Request/Response

```
Request:  {tenant}/{site}/{type}/{id}/cmd/req
Response: {tenant}/{site}/{type}/{id}/cmd/resp

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
# paho-mqtt 2.x (tested with 2.1.0, 2026-10-22)
import paho.mqtt.client as mqtt
from paho.mqtt.properties import Properties
from paho.mqtt.packettypes import PacketTypes

# MQTT 3.1.1 — keep state on disconnect
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="dev-abc",
                     protocol=mqtt.MQTTv311, clean_session=False)

# MQTT 5 — no clean_session (paho raises ValueError); use clean_start + Session Expiry
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="dev-abc",
                     protocol=mqtt.MQTTv5)
props = Properties(PacketTypes.CONNECT)
props.SessionExpiryInterval = 3600  # keep for 1h
client.connect(broker, 8883, clean_start=False, properties=props)

# Benefits:
# - Subscriptions persist
# - QoS 1/2 messages queued during disconnect
# - Reconnect picks up where left off
```

### Clean Session

```python
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2,
                     protocol=mqtt.MQTTv311, clean_session=True)
# MQTT 5: client.connect(broker, 8883, clean_start=True)  — no Session Expiry → session ends on disconnect

# Use for:
# - Stateless workers
# - One-shot publishers
# - When fresh state desired
```

## Will (Last Will and Testament)

```python
# base = f"{tenant}/{site}/{type}/{device_id}"  (see Topic Structure Patterns)
# Set BEFORE connect
client.will_set(
    topic=f"{base}/state",
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
    topic=f"{base}/config",
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

# CallbackAPIVersion.VERSION2 signatures (paho-mqtt 2.x)
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        # Resubscribe (clean session=true)
        client.subscribe([
            (f"{base}/cmd/req", 1),   # base: see Topic Structure Patterns
            (f"{tenant}/broadcast/+", 1),
        ])

def on_disconnect(client, userdata, disconnect_flags, reason_code, properties):
    print(f"Disconnected: reason={reason_code}")
    if reason_code != 0:
        pass  # unexpected disconnect — loop_start() reconnects with the backoff below

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="dev-abc",
                     protocol=mqtt.MQTTv311, clean_session=False)
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.tls_set()  # port 8883 is MQTT over TLS

# Auto-reconnect with backoff
client.reconnect_delay_set(min_delay=1, max_delay=120)

client.connect_async(broker, port=8883, keepalive=60)
client.loop_start()
```

## Backpressure Handling

```python
# When publishing faster than network allows
# Client buffers messages — but bounded!

import threading

# MQTT 5 flow control — Receive Maximum = how many unacknowledged QoS 1/2
# messages the broker may send US. The broker's own value (in CONNACK) limits what we send.
props = Properties(PacketTypes.CONNECT)
props.ReceiveMaximum = 100
client.connect(broker, 8883, properties=props)

# Client-side bounds for outgoing messages
client.max_inflight_messages_set(20)    # unacked QoS 1/2 messages on the wire
client.max_queued_messages_set(1000)    # local queue; 0 = unbounded (don't)

# Application-level backpressure: block when 50 messages wait for PUBACK
# (paho has no inflight_count(); count acks yourself)
inflight = threading.BoundedSemaphore(50)

def on_publish(client, userdata, mid, reason_code, properties):
    inflight.release()

client.on_publish = on_publish

def publish_with_backpressure(topic, payload, qos=1):
    inflight.acquire()
    info = client.publish(topic, payload, qos=qos)
    if info.rc != mqtt.MQTT_ERR_SUCCESS:
        inflight.release()
        raise RuntimeError(mqtt.error_string(info.rc))
    return info
```

## MQTT 5 Specific Patterns

### Properties

```python
# User properties (key-value metadata) — a Properties object, not a dict
pub_props = Properties(PacketTypes.PUBLISH)
pub_props.UserProperty = [
    ("trace-id", "abc-123"),
    ("source-version", "1.2.3"),
]
client.publish(topic, payload, qos=1, properties=pub_props)
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

# Handle gracefully — paho has no on_publish_failed; the PUBACK reason code
# arrives in on_publish (VERSION2 callbacks, MQTT 5)
def on_publish(client, userdata, mid, reason_code, properties):
    if reason_code.is_failure:
        if reason_code.value == 0x97:   # Quota exceeded
            ...                         # slow down, adjust quota
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

- ❌ Subscribe to `#` (you receive EVERYTHING)
- ❌ Use QoS 2 by default (it is slow)
- ❌ Forget to clean up retained messages
- ❌ Block inside the message callback (queues fill up)
- ❌ Reconnect without backoff (devices end up DDoSing the broker)

## Reference

- [MQTT 5 spec](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- [MQTT 3.1.1 spec](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [HiveMQ MQTT Essentials](https://www.hivemq.com/mqtt-essentials/)
- [EMQX Documentation](https://docs.emqx.com/)
- [Paho MQTT Clients](https://www.eclipse.org/paho/)
