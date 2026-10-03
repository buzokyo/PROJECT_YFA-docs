# MQTT and Home Assistant

PROJECT YFA can publish decoded live telemetry to an MQTT broker and automatically advertise those signals to Home Assistant through MQTT Discovery.

Configure the broker in **Settings → Connection → MQTT broker**, then use the **MQTT** control on the main screen to enable or disable telemetry.

## Connection

PROJECT YFA uses MQTT 5.

The configured broker host, port, optional username/password, and TLS setting are used when MQTT is enabled. With TLS enabled, the Android platform's default trust configuration is used.

Each connection uses a generated client ID beginning with:

```text
project-yfa-
```

The connection uses a 30-second keep-alive and clean start.

## State and availability topics

If the configured base topic is:

```text
project_yfa/vehicle
```

PROJECT YFA publishes to:

```text
project_yfa/vehicle/state
project_yfa/vehicle/availability
```

Availability messages use `online` and `offline`. They are retained and published with QoS 1. PROJECT YFA also configures a retained `offline` Last Will message.

When MQTT is manually stopped after a successful connection, PROJECT YFA attempts to publish `offline` before disconnecting.

## Telemetry state

State snapshots are JSON objects containing a sequence number, snapshot timing information, a `values` object, and a `units` object.

A simplified example is:

```json
{
  "sequence": 123,
  "created_at_ms": 0,
  "newest_measurement_at_ms": 0,
  "values": {
    "signal-id": 42.0
  },
  "units": {
    "signal-id": "°C"
  }
}
```

Only snapshots containing values are published. State messages are retained and use QoS 1.

The telemetry values originate from PROJECT YFA's decoded acquisition data. The exact set therefore depends on the ECU, acquisition mode, available data, and selected signals.

## Home Assistant MQTT Discovery

For every telemetry signal seen after an MQTT connection is established, PROJECT YFA publishes a retained Home Assistant sensor discovery configuration.

Discovery topics follow this pattern:

```text
homeassistant/sensor/project_yfa_<object-id>/config
```

All discovered sensors are grouped under one Home Assistant device named **PROJECT YFA Vehicle**, with manufacturer **PROJECT YFA** and model **Vehicle telemetry**.

Discovery entries use the PROJECT YFA state and availability topics. Signal units are included when available. Numeric, non-discrete measurements are marked with Home Assistant's `measurement` state class, and display precision is suggested when the signal definition provides it.

PROJECT YFA also removes the legacy discovery topic form for a signal when publishing its current discovery entry.

!!! note
    MQTT Discovery must be enabled in the Home Assistant MQTT integration for these automatically advertised sensor entities to appear.

## Reconnection

If the MQTT connection is lost while MQTT remains enabled, PROJECT YFA automatically schedules reconnection attempts.

The current retry delays are:

```text
1 s → 2 s → 5 s → 10 s → 15 s
```

Further attempts continue at 15-second intervals until the transport is stopped or a connection succeeds.

After reconnecting, the discovery set is rebuilt as telemetry signals are observed again.

## Status on the main screen

The main screen indicates MQTT state. The implementation distinguishes disabled/stopped, connecting, connected, and error conditions.

MQTT can be used independently of acquisition logging. The **Log** control writes files; the **MQTT** control publishes live telemetry.

## Troubleshooting

If MQTT does not connect, verify the host, port, credentials, and TLS setting in **Settings** and confirm that the Android device can reach the broker.

If Home Assistant receives no entities, first confirm that PROJECT YFA is connected to the broker and is actually receiving decoded signal values. Discovery is generated from observed telemetry.

MQTT has its own diagnostic logging in the application implementation. Broker configuration and password-storage details are covered on the **Settings** page.
