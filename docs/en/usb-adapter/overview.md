# USB CAN adapter overview

PROJECT YFA can communicate with the vehicle through a USB CAN adapter using the **gs_usb** interface.

The adapter bridges USB on the Android device and the vehicle CAN bus. PROJECT YFA manages the Android USB connection and uses the same adapter differently depending on the selected acquisition mode.

![PROJECT YFA USB CAN architecture](../assets/images/diagrams/usb-can-overview.svg){ width="900" }

## Selecting the USB adapter

Open **Settings → Connection → Adapter** and select **USB CANnectivity**.

The current development adapter is a Waveshare RP2350-CAN running the PROJECT YFA build of CANnectivity/Bridle firmware.

After selecting the USB transport, connect the adapter to the Android device and use the connection control in PROJECT YFA. Android may display a USB permission request the first time the adapter is opened. Permission must be granted before PROJECT YFA can access it.

When the connection succeeds, PROJECT YFA displays the USB adapter product name and the reported CAN clock.

!!! note
    Connecting the USB adapter and starting CAN acquisition are separate operations. A successful USB connection means that PROJECT YFA has opened and validated the adapter. The CAN channel is configured and started when an acquisition session begins.

## USER LED control

With the PROJECT YFA firmware, the Android app can control the Waveshare USER LED at runtime.

The app setting is **Settings → Connection → Disable user LED**. When enabled, PROJECT YFA sends the firmware runtime setting after every USB connection and the USER LED stays off even while CAN traffic is being received or transmitted. When disabled, the existing firmware LED state/activity behavior is used.

The adapter does not store this preference in flash. A hardware reset restores normal LED behavior until PROJECT YFA reconnects and reapplies the app-persistent preference.

## Acquisition modes

### Raw CAN

In **Raw CAN** mode, PROJECT YFA configures the adapter for Classical CAN at 500 kbit/s and starts it in **listen-only** mode with hardware timestamps.

The adapter receives vehicle CAN traffic but does not transmit CAN frames or acknowledge traffic on the bus through this mode. PROJECT YFA filters and decodes the CAN IDs selected in the signal editor.

### Passive UDS

**Passive UDS** is also receive-only on the USB transport.

PROJECT YFA monitors the selected ECU's UDS response CAN ID using the Raw CAN receive path. Received CAN frames are assembled into complete UDS responses and matched to the selected requests. PROJECT YFA does **not** transmit those requests in Passive UDS mode; the corresponding diagnostic traffic must already be present on the CAN bus.

### Active UDS

In **Active UDS** mode, PROJECT YFA starts the CAN channel with hardware timestamps but without listen-only mode. The adapter can therefore transmit diagnostic CAN frames and receive the ECU responses.

Active UDS requires both directions of the USB/CAN transport to work correctly. Successful Raw CAN reception by itself does not prove that diagnostic transmission is working.

## Aggregate ECUs acquisition

When USB CANnectivity is selected, PROJECT YFA adds an **ECUs** tab before the individual ECU tabs. This aggregate mode can acquire and display signals from multiple supported ECUs in one session.

Aggregate Raw CAN uses unfiltered gs_usb reception so the full received bus can be logged while known CAN IDs are decoded. Aggregate Passive UDS monitors response traffic for the configured ECU profiles without transmitting diagnostic requests. Aggregate Active UDS can probe candidate ECUs and poll selected requests across multiple online ECUs.

The aggregate feature is currently specific to the USB transport; it is not shown for Bluetooth ELM327.

## USB connection checks

The current PROJECT YFA USB implementation expects the development adapter to identify as USB VID **0x1209** and PID **0xCA01**. During connection, PROJECT YFA opens and claims the gs_usb interface, locates its bulk IN and OUT endpoints, and checks the adapter capabilities required by the application.

The current transport requires support for:

- listen-only mode;
- hardware CAN timestamps;
- an 8 MHz CAN clock.

If one of these requirements is not met, the USB connection is rejected rather than starting acquisition with an unexpected configuration.

## Disconnecting the adapter

PROJECT YFA monitors Android USB detach events. If the connected adapter is unplugged, the application closes the USB connection and stops the active transport state.

Stop acquisition before intentionally disconnecting the adapter.

## Troubleshooting

If the USB adapter is not detected, check the physical USB connection and confirm that **USB CANnectivity** is selected in Settings. Reconnect the adapter and grant the Android USB permission if prompted.

If the adapter connects but acquisition does not start, check that the required RAW CAN groups or UDS requests/signals are enabled for the selected ECU.

For transport problems, **Settings → Logging → Adapter debug logging** can record detailed USB adapter diagnostics in the selected log directory.

The Waveshare RP2350-CAN page documents the current firmware and the PROJECT YFA-specific gs_usb buffer changes.
