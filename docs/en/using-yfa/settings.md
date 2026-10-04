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

### Audio alerts

**Audio alerts** is the master switch for CANly's audible and spoken vehicle alerts.

When disabled, configured signal alerts do not play. Turning the master switch off also resets the current alert state. Individual signal alerts are configured from the **Signals** editor with the bell control.

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

The available acquisition modes depend on the selected adapter and whether **Enable advanced modes** is turned on.

With advanced modes **off**:

- **USB CANnectivity** offers **Raw CAN**, **Active UDS**, and **Ask first**;
- **Bluetooth ELM327** offers **Active UDS** only.

With advanced modes **on**, both transports can expose **Raw CAN**, **Passive UDS**, and **Active UDS**. **Ask first** is shown when more than one concrete mode is available.

The modes behave as follows:

- **Raw CAN** — decode selected signals directly from normal CAN frames.
- **Passive UDS** — listen for selected UDS responses without sending the diagnostic requests.
- **Active UDS** — actively send the selected read requests and decode their responses.
- **Ask first** — choose one of the currently available modes when acquisition starts.

If a previously selected mode becomes unavailable because the adapter changes or advanced modes are disabled, CANly automatically falls back to a valid mode.

See **Live Signals** for detailed acquisition behavior.

### MQTT broker

**MQTT broker** configures the broker used by CANly's MQTT telemetry transport.

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

CANly derives two topics from the base topic:

```text
<base topic>/state
<base topic>/availability
```

The MQTT password is stored using Android Keystore-backed encryption. Older plaintext password storage is migrated when encountered.

TLS switches between an encrypted broker connection and plain MQTT. Broker certificate and network requirements are determined by the MQTT server configuration.

Saving the broker settings configures the MQTT transport. MQTT telemetry is enabled separately from the main screen. When enabled, the broker connection is opened only while an acquisition session is running.

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

**Adapter debug logging** enables detailed diagnostic logging for the adapter transport.

It is disabled by default. Enable it when investigating connection, USB, CAN transport, or adapter communication problems. Normal users do not need to leave this option enabled continuously.

Adapter debug logging is separate from the normal acquisition log control on the main screen.

### Enable advanced modes

**Enable advanced modes** exposes acquisition modes intended for development and troubleshooting.

This switch is available only while **Adapter debug logging** is enabled. Turning adapter debug logging off automatically turns advanced modes off as well.

Keep advanced modes disabled for normal use unless you specifically need Passive UDS or another transport/mode combination hidden by the normal safety-oriented mode policy.

## Related pages

The **Live Signals** page explains acquisition modes, signal selection, plots, normal logging, and the MQTT control.

The **USB CAN adapter** pages describe USB permission, gs_usb connection behavior, Raw CAN/Passive UDS/Active UDS operation, and the Waveshare RP2350-CAN firmware.
