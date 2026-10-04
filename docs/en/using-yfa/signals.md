# Signals configuration

Open **Signals** from the main screen overflow menu to choose which signals PROJECT YFA acquires and how they appear in **Live** and **Plot**.

Signal settings are stored separately for each ECU. With **USB CANnectivity**, the aggregate **ECUs** tab also opens a combined signal editor. It lists groups from all supported ECU profiles while still storing each choice under its own ECU.

In the aggregate editor, each group is prefixed with its ECU name (for example, an ECU name followed by its UDS request or RAW CAN ID). The editor follows the current acquisition mode in the same way as an individual ECU editor. Apply is enabled when at least one group across the combined configuration is active.

## What the editor shows

The contents of the editor depend on the acquisition mode selected in **Settings → Connection → Acquisition mode**:

- **Raw CAN** — shows RAW CAN groups;
- **Passive UDS** — shows UDS request groups;
- **Active UDS** — shows UDS request groups;
- **Ask first** — shows both UDS and RAW groups so either mode can be prepared before acquisition starts.

UDS groups are labelled **UDS** followed by the request bytes. RAW groups are labelled **RAW** followed by the CAN ID.

For UDS, the row shows the expected response length and, when available, a catalog comment. For RAW CAN, it shows the configured update interval for that CAN ID.

Each group also shows how many of its signals are selected for LIVE and PLOT.

## Expanding a group

Tap a UDS or RAW group to expand its signal list.

Each signal can participate independently in four functions:

- **LIVE** — the eye column. Shows the signal as a numeric/live value.
- **PLOT** — the chart column. Adds the signal to Plot history and display.
- **MQTT** — the cloud-upload column. Allows the signal to be published to the configured MQTT broker.
- **Alerts** — the bell column. Opens or enables the signal's audio-alert configuration.

A signal may be selected for any combination of these functions. A signal does not have to be visible in LIVE to be acquired for PLOT, MQTT, or an alert.

The row of icons above an expanded signal list also acts as a bulk-selection control. Tapping the **LIVE**, **PLOT**, or **MQTT** icon opens a small menu with **Select all** and **Deselect all** for that group.

A group is active whenever at least one of its signals is needed by LIVE, PLOT, MQTT, or an enabled alert. If none of those functions needs any signal in the group, the group becomes inactive.

!!! note
    PLOT-only, MQTT-only, and alert-only signals still participate in acquisition even though they are not shown in the Live value grid.

## Signal order

The order in this editor also determines the configured display order.

Press and drag the **≡** handle at the right of a signal row to move it. PROJECT YFA preserves this ordering separately for each request or CAN group.

While a signal is being dragged, normal editor navigation and Apply/Cancel actions are temporarily disabled to avoid changing screens in the middle of a reorder operation.

## Applying changes

Press **APPLY (n)** to save the ECU configuration. The number in parentheses is the number of enabled groups currently shown by the editor.

**Cancel** or the back control closes the editor without applying the current edits.

Apply is available when the ECU configuration contains at least one active request or CAN group. A group can be active because of LIVE, PLOT, MQTT, or an enabled alert.

## How the selections affect acquisition

### Raw CAN

For Raw CAN acquisition, PROJECT YFA monitors the enabled CAN IDs. Within those groups, signals selected for either LIVE or PLOT are part of the acquisition configuration.

Signals selected for LIVE are shown in the Live grid. PLOT-selected signals are available to the plot history. MQTT-selected signals are eligible for broker publication, and enabled alert signals remain available to the alert evaluator.

### Passive UDS

For Passive UDS, enabled UDS groups determine which selected responses PROJECT YFA is interested in. With the USB adapter, PROJECT YFA listens for the ECU response traffic already present on the CAN bus; it does not transmit those requests.

### Active UDS

For Active UDS, enabled UDS groups determine the diagnostic requests PROJECT YFA polls. Selecting at least one LIVE or PLOT signal therefore enables its parent request.

Only requests that have live signal definitions in the PROJECT YFA database are offered in this editor.

## ELM327 RAW CAN load warning

When **Bluetooth ELM327** is selected, PROJECT YFA estimates the serial data load created by the enabled RAW CAN IDs.

If the estimate reaches the application's high-load threshold, a warning indicator appears. This is more likely when many CAN IDs are selected, especially IDs with short update intervals.

Disable RAW groups you do not need to reduce ELM327 serial traffic.

This warning does **not** apply to the USB gs_usb transport.

## Defaults and database updates

PROJECT YFA stores these preferences in its private application storage.

UDS defaults are defined per ECU. Default requests start with their available LIVE signals visible. RAW CAN groups are disabled by default, although their signal definitions are prepared for selection. MQTT and alert choices are stored alongside the other per-signal preferences.

When the packaged PROJECT YFA signal/request database changes, the saved configuration is reconciled with the new database. Existing valid visibility, plot, and ordering choices are preserved; removed signals disappear, and newly added signals are added to the configuration automatically.

This allows application/database updates to introduce new decoded signals without discarding the user's existing layout choices.

## Related pages

See **Live Signals** for the resulting Live/Plot display and acquisition behavior. See **Settings** for choosing the acquisition mode and adapter transport.
