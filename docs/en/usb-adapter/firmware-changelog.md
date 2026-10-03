# Firmware changelog

This page tracks PROJECT YFA-specific changes to the CANnectivity/Bridle firmware used on the Waveshare RP2350-CAN adapter.

## 2026-09-26 — Runtime USER LED control

Current downloadable build:

```text
File: project-yfa-rp2350-can.uf2
Size: 113,664 bytes
UF2 blocks: 222
SHA-256: 6479838C7243ABE683B8D5F98370518F022438FABF861C7D33FD884369F69AF8
```

Changes:

- added PROJECT YFA vendor request `0xF1` to read runtime settings;
- added PROJECT YFA vendor request `0xF2` to write runtime settings;
- defined settings bit 0 as **force USER LED off**;
- `0xF2` uses a four-byte little-endian flags payload: `01 00 00 00` disables USER LED activity and `00 00 00 00` restores normal firmware control;
- the LED override is runtime-only and is not written to flash/NVS;
- adapter reset or power loss clears the override and restores normal firmware LED control;
- PROJECT YFA Android stores the user's preference and reapplies it after every adapter connection;
- when the user turns **Disable user LED** off while connected, the app uses the standard gs_usb IDENTIFY request for one confirmation blink;
- updated the USB product string to **Project YFA CAN-USB adapter**;
- incremented the PROJECT YFA diagnostic build identifier for this firmware revision.

Validation:

- Windows gs_usb benchmark passed twice with normal USER LED blinking;
- the same benchmark passed twice after runtime LED disable was applied;
- CAN/USB benchmark behavior was unchanged while the USER LED override was active.

## 2026-09-25 — Isolated TX buffers

Firmware baseline commit: `649810f` — **gs_usb: isolate TX buffers for Project YFA**.

Changes:

- split gs_usb host-frame buffering so USB-to-CAN TX traffic uses a dedicated TX pool;
- retained the large RX/error pool for sustained vehicle CAN reception;
- prevented heavy RX traffic from consuming the buffers needed to accept a new host-to-device CAN frame;
- preserved TX buffer ownership through the TX FIFO, CAN transmission, echo and USB IN completion.

Important configuration:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
CONFIG_USBD_GS_USB_TX_POOL_SIZE=16
```

This change was introduced after intermittent Android Active UDS TX timeouts were traced to shared-buffer starvation under heavy receive traffic.

## Earlier PROJECT YFA firmware tuning

Earlier development established the base configuration used by the current build:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
CONFIG_CAN_FD_MODE=n
```

Other established behavior:

- Classical CAN at 500 kbit/s for PROJECT YFA;
- 8 MHz CAN clock expected by the Android transport;
- hardware CAN timestamps required;
- listen-only support used by Raw CAN and Passive UDS;
- Active UDS uses normal transmit-capable CAN mode;
- PROJECT YFA diagnostic vendor request `0xF0` retained for firmware diagnostics.

!!! note
    This changelog covers PROJECT YFA-specific firmware work, not the complete upstream CANnectivity/Bridle release history.
