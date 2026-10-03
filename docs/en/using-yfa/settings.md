# Settings

Open **Settings** from PROJECT YFA to configure the application. The current settings screen is divided into three tabs: **View**, **Connection**, and **Logging**.

Settings are stored by the application and remain in effect after the settings screen is closed.

## View

### Theme

**Theme** controls the application appearance. Available choices are:

- **System default** — follow the Android system theme;
- **Dark mode**;
- **Light mode**.

The selected theme is applied immediately.

### Keep screen on

**Keep screen on** controls whether Android is asked to keep the display awake while data acquisition is running.

This option is enabled by default. Turning it off allows the normal Android screen timeout to apply during acquisition.

## Connection

### Adapter

The **Connection** selector chooses the hardware transport used by PROJECT YFA.

**Bluetooth ELM327** selects the Bluetooth Classic ELM327/Vgate transport.

**USB CANnectivity** selects the native gs_usb transport used with the PROJECT YFA Waveshare RP2350-CAN development adapter.

Changing this setting selects the transport; connecting the adapter is a separate action on the main screen.

!!! note
    Some older in-app descriptive text still describes USB CANnectivity as RAW-CAN-only. The current PROJECT YFA USB implementation also supports Passive UDS and Active UDS. The USB CAN adapter section of this manual describes the current implementation.

### Disable user LED

When **USB CANnectivity** is selected, **Disable user LED** controls the Waveshare adapter's USER LED.

The preference is stored by PROJECT YFA, not in adapter flash. Every time PROJECT YFA opens the USB adapter it reapplies the saved setting with the PROJECT YFA runtime firmware command.

- **On** — the USER LED is forced off, including normal CAN RX/TX activity indication.
- **Off** — normal firmware LED control is restored.

When the user toggles this switch from **On** to **Off** while the adapter is already connected, PROJECT YFA performs one short confirmation blink after the setting is applied. Turning the switch **On** does not blink; the LED simply turns off.

Resetting or unplugging the adapter clears the runtime firmware flag. PROJECT YFA reapplies the saved app preference on the next connection.

!!! note
    This setting requires the PROJECT YFA firmware with runtime USER LED control. It is not an NVS/flash-persistent adapter setting.

### Acquisition mode

This setting determines what happens when you start acquisition.

**Ask first** is the default. PROJECT YFA asks which acquisition mode to use each time acquisition starts.

**Raw CAN** decodes selected signals directly from normal CAN frames.

**Passive UDS** listens for selected UDS responses without sending the diagnostic requests itself.

**Active UDS** actively sends the selected diagnostic requests to the ECU and processes its responses.

See **Live Signals** for the detailed behavior of each acquisition mode.

### MQTT broker

**MQTT broker** configures the broker used by PROJECT YFA's MQTT telemetry transport.

The dialog contains:

- **Host / IP address**;
- **Port**;
- optional **Username**;
- optional **Password**;
- **Base topic**;
- **TLS**.

The default port is **1883** and the default base topic is:

```text
project_yfa/vehicle
```

The port must be between 1 and 65535. The host and base topic cannot be empty before the configuration can be saved. Leading and trailing `/` characters are removed from the saved base topic.

PROJECT YFA derives two topics from the base topic:

```text
<base topic>/state
<base topic>/availability
```

The MQTT password is stored using Android Keystore-backed encryption. Older plaintext password storage is migrated when encountered.

TLS switches between an encrypted broker connection and plain MQTT. Broker certificate and network requirements are determined by the MQTT server configuration.

!!! note
    Saving the broker settings configures the MQTT transport. MQTT telemetry is enabled or disabled separately from the main screen's MQTT control.

## Logging

### PROJECT YFA directory

**PROJECT YFA directory** selects one Android document-tree root used by the application's file-based features.

PROJECT YFA requests persistent read/write permission for this root and creates child directories lazily:

```text
logs/
debug/
exports/
metadata/
```

Acquisition logs are written to **logs/**, adapter/MQTT diagnostics to **debug/**, CSV exports to **exports/**, and vehicle/log metadata to **metadata/**.

If logging is enabled when acquisition starts but no PROJECT YFA directory has been selected, PROJECT YFA can request a directory before continuing acquisition.

Changing the selected root changes where all of these files are read and written.

### Adapter debug logging

### Adapter debug logging

**Adapter debug logging** enables detailed diagnostic logging for the adapter transport.

It is disabled by default. Enable it when investigating connection, USB, CAN transport, or adapter communication problems. Normal users do not need to leave this option enabled continuously.

Adapter debug logging is separate from the normal acquisition log control on the main screen.

## Related pages

The **Live Signals** page explains acquisition modes, signal selection, plots, normal logging, and the MQTT control.

The **USB CAN adapter** pages describe USB permission, gs_usb connection behavior, Raw CAN/Passive UDS/Active UDS operation, and the Waveshare RP2350-CAN firmware.
