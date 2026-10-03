# Firmware update

The Waveshare RP2350-CAN adapter used with PROJECT YFA runs a tested PROJECT YFA build of CANnectivity/Bridle firmware.

Use the firmware on this page rather than a generic upstream CANnectivity image. The PROJECT YFA build contains the gs_usb configuration and separate RX/TX buffer-pool modification required by the tested USB transport.

## Download firmware

[**Download PROJECT YFA firmware (.uf2)**](https://github.com/buzokyo/PROJECT_YFA/raw/feature/user-manual/firmware/waveshare-rp2350-can/project-yfa-rp2350-can.uf2){ .md-button .md-button--primary }

**Target:** Waveshare RP2350-CAN  
**File:** `project-yfa-rp2350-can.uf2`  
**Size:** 113,664 bytes  
**UF2 blocks:** 222  
**SHA-256:**

```text
6479838C7243ABE683B8D5F98370518F022438FABF861C7D33FD884369F69AF8
```

The supplied image is a valid UF2 firmware image for the Raspberry Pi RP2350 family. Keep the checksum with the downloaded file if you want to verify that it has not changed or been corrupted.

!!! warning
    This firmware is intended for the **Waveshare RP2350-CAN** adapter used by PROJECT YFA. Do not flash it to unrelated RP2350 boards unless you have independently verified that their hardware and pin configuration are compatible.

## Before updating

Stop acquisition in PROJECT YFA and disconnect the adapter from the vehicle CAN connection before entering the bootloader.

The firmware update itself requires only the adapter and a computer with USB. PROJECT YFA does not need to be running during the update.

## Enter the RP2350 bootloader

1. Disconnect USB from the adapter.
2. Hold the board's **BOOT** button.
3. While continuing to hold **BOOT**, connect the adapter to the computer by USB.
4. Release **BOOT** after the RP2350 boot drive appears.

The RP2350 bootloader presents the board as a USB mass-storage drive. Depending on the operating system, the drive is normally visible in the file manager without installing a special flashing utility.

If the board is already powered and its buttons are accessible, using the BOOT/RESET button combination can also enter the ROM USB bootloader.

## Install the UF2 file

Copy `project-yfa-rp2350-can.uf2` to the RP2350 boot drive.

After the copy completes, the bootloader programs the image and the mass-storage drive normally disappears automatically as the board reboots into the new firmware.

Do not repeatedly unplug the board while the file is being copied.

## Verify the update

After the board has rebooted:

1. Disconnect it from the computer.
2. Reconnect it to the PROJECT YFA Android device.
3. Grant Android USB permission if requested.
4. Select **Settings → Connection → Adapter → USB CANnectivity**.
5. Connect the adapter in PROJECT YFA.

The tested firmware identifies through gs_usb with:

```text
VID: 0x1209
PID: 0xCA01
```

PROJECT YFA also expects the firmware capabilities required by its USB manager, including listen-only support and hardware timestamps.

For a functional check, start with Raw CAN while the vehicle is stationary. After receive operation is confirmed, Active UDS can additionally verify the transmit path.

The current build reports the USB product string:

```text
Project YFA CAN-USB adapter
```

If **Settings → Connection → Disable user LED** is enabled, connect the adapter and start an acquisition that normally causes USER LED activity. The LED should remain off. With the option disabled, normal firmware LED activity is restored.

## Firmware configuration

This downloadable build corresponds to the PROJECT YFA firmware described on the **Waveshare RP2350-CAN** page. Important configuration includes:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
CONFIG_USBD_GS_USB_TX_POOL_SIZE=16
CONFIG_CAN_FD_MODE=n
```

The separate TX pool is a PROJECT YFA firmware modification. It prevents sustained CAN receive traffic from consuming buffers needed for host-to-CAN transmission.

This build also contains the PROJECT YFA runtime USER LED control used by the Android **Disable user LED** setting. The setting is RAM-only in the adapter; PROJECT YFA stores the preference and reapplies it when the adapter reconnects.

See **Firmware changelog** for the history of PROJECT YFA firmware changes.

## Troubleshooting

### RP2350 drive does not appear

Disconnect USB and repeat the BOOT procedure. Hold BOOT before reconnecting USB and keep it held until the computer detects the bootloader.

Try a known data-capable USB cable and a direct computer USB port if the board is not detected.

### The drive disappears after copying the UF2

This is normally expected. A successful UF2 copy causes the RP2350 to reboot from the newly programmed firmware, so the bootloader mass-storage drive disappears.

### PROJECT YFA does not detect the adapter after flashing

Reconnect the adapter and check Android USB permission. Confirm that **USB CANnectivity** is selected in Settings.

If the adapter still cannot connect, repeat the update with the firmware from this page and verify the downloaded file's SHA-256 checksum.

### Raw CAN works but Active UDS does not

Raw CAN reception does not by itself verify USB/CAN transmission. See **Troubleshooting** and the **Waveshare RP2350-CAN** firmware architecture section for TX-path diagnostics.
