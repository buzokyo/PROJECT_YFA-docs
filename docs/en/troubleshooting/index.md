# Troubleshooting

Start troubleshooting from the complete data path:

**Android device → selected transport → adapter → vehicle CAN bus → ECU → decoder / logger / MQTT**

Work on the connection while the vehicle is stationary.

## USB adapter not detected

Confirm that **USB CANnectivity** is selected in **Settings → Connection → Adapter**.

Disconnect and reconnect the adapter. Android may display a USB permission request; PROJECT YFA cannot open the device until permission is granted.

A successful USB connection and a running CAN acquisition session are separate states. If the adapter connects but no data appears, also check the selected ECU, acquisition mode, and signal configuration.

## Raw CAN has no data

Check that the selected ECU has at least one enabled RAW CAN group and at least one signal selected for LIVE or PLOT.

Raw CAN over USB is listen-only. If another independent CAN logger also sees no expected traffic, the issue may be outside PROJECT YFA—for example the ECU may not currently be transmitting that message.

## Passive UDS has no data

Passive UDS does not send diagnostic requests. It can decode only selected ECU responses that are already present on the bus.

If no other tester or diagnostic activity is generating those responses, an empty Passive UDS display can be expected. Use Active UDS when PROJECT YFA itself must request the data.

## CAN receive works but Active UDS fails

Receiving normal CAN traffic proves only the receive side of the path.

Active UDS additionally requires USB bulk OUT/TX, CAN transmission, correct diagnostic TX/RX IDs, and an ECU that is awake and able to respond.

The PROJECT YFA Waveshare firmware uses separate RX and TX gs_usb buffer pools specifically to prevent sustained RX traffic from starving the diagnostic TX path. See **Waveshare RP2350-CAN** for the firmware details.

If an independent CAN logger is available, compare it with the PROJECT YFA debug log: determine whether the diagnostic request actually appeared on the vehicle CAN bus and whether the ECU produced a response.

## Problems after reconnecting USB

Stop acquisition before intentionally disconnecting the adapter.

After reconnecting, grant USB permission if Android asks for it and reconnect in PROJECT YFA before starting acquisition again. A physical USB detach is detected by the application and closes the active USB transport.

If an intermittent USB problem is being investigated, enable **Settings → Logging → Adapter debug logging** before reproducing it.

## Signals missing from Live

Open **Signals** for the selected ECU.

Check that the correct RAW or UDS group is available for the chosen acquisition mode and that the signal's **LIVE** checkbox is selected. A signal selected only for **PLOT** is acquired for plotting but intentionally does not occupy a Live-grid position.

If the signal definition was added in a newer database version, PROJECT YFA reconciles saved settings with the packaged database and adds new definitions automatically.

## Plot is empty

A signal must have **PLOT** selected in the Signals editor before it is included in plot history.

LIVE and PLOT are independent selections: enabling LIVE alone does not automatically enable plotting.

## Log does not start

Select a writable directory in **Settings → Logging → Log directory**.

If logging is enabled and no directory is configured, PROJECT YFA can ask for one when acquisition starts. If access to a previously selected directory was lost, select the folder again.

## Logs screen is empty

The Logs screen recognizes PROJECT YFA `.TXT` logs from the selected directory. It does not maintain a separate index.

Confirm that the correct directory is selected and that it contains files with the PROJECT YFA logger header. Unrelated TXT files are ignored.

## CSV export fails

CSV export currently decodes supported **UDS LIVE** responses using the packaged signal database.

A valid raw log can therefore contain useful traffic but still have no responses suitable for the current CSV exporter. In that case PROJECT YFA reports that no live signal responses were found.

## ECU info fails

**ECU info** performs active one-time diagnostic reads. It is available only when connected and when normal acquisition is not running.

Some identification requests may fail while other identification values are still displayed. If no identification definitions exist for that ECU, PROJECT YFA reports this directly.

## MQTT does not connect

Verify **Settings → Connection → MQTT broker**: host, port, credentials, base topic, and TLS.

Also confirm that the Android device can reach the broker. When a connection is lost while MQTT remains enabled, PROJECT YFA retries automatically.

## Home Assistant entities do not appear

PROJECT YFA publishes Home Assistant MQTT Discovery only for telemetry signals it actually observes.

Confirm that MQTT is connected, acquisition is producing decoded values, and MQTT Discovery is enabled in the Home Assistant MQTT integration.

## Debug information

For intermittent transport problems, preserve the relevant PROJECT YFA debug log and, when available, a simultaneous independent CAN logger recording.

Correlating application events with bus traffic is particularly useful for distinguishing:

- Android/USB transport failures;
- adapter TX/RX problems;
- requests that reached the CAN bus but received no ECU response;
- responses present on the bus but not processed by the application.

The **USB CAN adapter**, **Logs**, and **MQTT and Home Assistant** pages contain subsystem-specific details.
