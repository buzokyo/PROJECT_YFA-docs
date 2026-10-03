# Waveshare RP2350-CAN

The PROJECT YFA development adapter is based on the Waveshare RP2350-CAN board.

It runs a PROJECT YFA build of CANnectivity/Bridle firmware and exposes a gs_usb-compatible USB CAN interface to the Android device.

## Current CAN configuration

The current application uses **Classical CAN at 500 kbit/s** rather than CAN FD. The firmware configuration therefore includes:

```text
CONFIG_CAN_FD_MODE=n
```

PROJECT YFA currently expects the adapter to report an **8 MHz CAN clock**. The Android transport configures the required 500 kbit/s bit timing when an acquisition session starts.

Raw CAN and USB Passive UDS use listen-only operation. Active UDS deliberately does not use listen-only mode because diagnostic CAN frames must be transmitted.

Hardware CAN timestamps are required by the current USB implementation.

## USB interface

The adapter currently identifies as:

```text
VID: 0x1209
PID: 0xCA01
```

PROJECT YFA uses gs_usb interface 0, with bulk IN endpoint **0x81** and bulk OUT endpoint **0x02** in the current CANnectivity implementation.

The USB connection is opened before acquisition, but CAN bit timing and operating mode are configured when the selected acquisition mode starts.

## PROJECT YFA gs_usb buffer modification

The PROJECT YFA firmware is not using the original shared gs_usb host-frame buffer arrangement.

During Active UDS stability investigation, we found an intermittent failure in which heavy CAN receive traffic could exhaust the shared gs_usb buffer pool at the moment the USB bulk-OUT endpoint needed a buffer for a new host-to-device frame. The bulk-OUT endpoint then failed to re-arm and a later Android CAN transmission timed out even though CAN reception could continue.

To prevent RX traffic from starving the TX path, the firmware was modified to use **separate RX and TX buffer pools**.

The existing setting is retained as the receive/error pool:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
```

A separate configuration option was added for host-to-device transmit buffers:

```text
CONFIG_USBD_GS_USB_TX_POOL_SIZE=16
```

The RX pool is used for CAN frames travelling toward the USB host. The dedicated TX pool is used for frames received from USB bulk OUT. A TX buffer remains associated with that transmission through the firmware's TX FIFO, CAN transmission, TX echo and USB IN completion before it is returned to the TX pool.

This separation is important for PROJECT YFA Active UDS: sustained vehicle CAN reception can no longer consume the buffers reserved for diagnostic transmission.

!!! note
    Increasing the original pool to 128 improved receive capacity, but the later split-pool modification addresses a different problem: isolation of the TX path from RX buffer pressure.

## PROJECT YFA runtime USER LED control

The PROJECT YFA firmware adds runtime-only USER LED control on top of the normal CANnectivity LED state/activity finite-state machine.

Two PROJECT YFA vendor requests are used:

```text
0xF1  GET settings
0xF2  SET settings
```

The settings value is a 32-bit little-endian flags word:

```text
bit 0 = force USER LED off
```

For `0xF2`, PROJECT YFA sends a four-byte payload:

```text
01 00 00 00  -> force USER LED off
00 00 00 00  -> normal firmware LED control
```

The flag exists only in RAM. Adapter reset or power loss returns the firmware to normal LED control. The Android app owns persistence and reapplies its saved preference on the next connection.

When the override is enabled, state and RX/TX activity attempts that target the Waveshare USER/state LED are suppressed without changing CAN or USB operation. This was validated with the same gs_usb benchmark load used for the RX/TX buffer-split work: benchmark operation remained successful with normal blinking enabled and with the LED override active.

PROJECT YFA also uses the standard gs_usb IDENTIFY request for the single confirmation blink shown when the user turns **Disable user LED** off while the adapter is connected.

## Firmware configuration summary

The important current PROJECT YFA settings are:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
CONFIG_USBD_GS_USB_TX_POOL_SIZE=16
CONFIG_CAN_FD_MODE=n
```

The TX-pool option is a PROJECT YFA modification to the CANnectivity/Bridle gs_usb implementation, not merely an application-side Android setting.

## Android USB transport

PROJECT YFA uses synchronous Android `bulkTransfer()` operations for gs_usb communication.

This replaced the earlier `UsbRequest/requestWait()` receive implementation during Android stability work. The USB manager keeps a continuous receive path while acquisition is active and uses the bulk OUT endpoint when Active UDS needs to transmit CAN frames.

## Validation

The split-pool firmware was stress-tested in the PROJECT YFA development setup. A 60-cycle Android PLAY/STOP test completed 689 transmitted frames and approximately 622,018 received USB transfers without TX failures, drops or malformed transfers. A separate Windows test completed 21,000 transmitted frames without allocation or enqueue failures.

These figures describe the tested development build and are useful as a regression reference; they are not a general performance specification for every Android device or CAN bus.
