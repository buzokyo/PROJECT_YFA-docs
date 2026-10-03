# Privacy Policy

**Last updated: 3 October 2026**

CANly is an automotive diagnostics and data-logging application developed as part of Project YFA. This policy describes the data handled by the Android application.

## Local vehicle data

CANly can read CAN-bus and diagnostic data from a connected vehicle. Depending on the selected features, this can include decoded vehicle signals, raw CAN/UDS records, the vehicle identification number (VIN), odometer values, log timestamps, and comments entered by the user.

When logging is enabled, these records are stored in the folder selected by the user through Android's document storage interface. CANly does not upload these log files to a CANly or Project YFA server.

## Location and GNSS data

GNSS logging is optional and disabled unless the user enables it. When enabled for an acquisition session, CANly requests precise location permission and can record location fixes including latitude, longitude, altitude, speed, bearing, accuracy and timestamps.

GNSS data is written to the user-selected local log folder. CANly does not send GNSS data to a CANly or Project YFA server and does not publish GNSS data through its MQTT feature.

The rest of the application can be used without granting location permission. Denying the permission disables GNSS logging but does not prevent CAN/UDS acquisition, Live view, ordinary vehicle logging or MQTT telemetry.

## MQTT telemetry

MQTT is optional and requires configuration by the user. When MQTT is enabled during acquisition, CANly connects directly to the MQTT broker specified by the user. The user can select which decoded vehicle signals are allowed to be published through MQTT. Only signals selected for MQTT publishing are intended to be transmitted. MQTT messages for those signals can contain signal identifiers, signal values, units and measurement timestamps. CANly can also publish Home Assistant discovery and availability messages associated with the MQTT feature.

The MQTT destination and the set of vehicle signals made available to MQTT are controlled by the user. CANly and Project YFA do not operate an intermediary telemetry server and do not receive MQTT telemetry merely because the MQTT feature is enabled. The privacy, retention and security of data received by the configured MQTT broker are determined by that broker and its operator.

MQTT credentials are stored in app-private storage. The password is encrypted using a device-bound key in the Android Keystore. MQTT preferences containing credential material are excluded from Android cloud backup and device-to-device transfer.

If MQTT debug logging is enabled, local debug logs can contain connection metadata such as the configured broker address, username and base topic, as well as connection and publishing status information. MQTT passwords and vehicle telemetry payload values are not intentionally written to MQTT debug logs.

## Bluetooth and USB

CANly can communicate with supported CAN adapters over Bluetooth or USB. Bluetooth permission is used to access and connect to the adapter selected by the user. USB access is handled through Android's USB device authorization.

## Internet access

The application uses Internet access for the optional MQTT feature. Local vehicle and GNSS log files are not uploaded by CANly.

## Data sharing

CANly does not sell user data. It does not send vehicle logs or GNSS logs to CANly- or Project YFA-operated servers. When the user enables MQTT, vehicle signals selected by the user for MQTT publishing are sent directly to the broker deliberately configured by the user. Data already received by that broker is subject to the broker operator's policies and configuration.

## Data control and deletion

Vehicle and GNSS logs are files in the storage location selected by the user and can be managed or deleted there. Application preferences can be removed by clearing CANly's app data or uninstalling the application. Data already sent to a user-configured MQTT broker must be managed according to that broker's configuration and retention rules.

## Contact

For questions about this Privacy Policy or CANly's handling of data, contact: **buzokyo@gmail.com**.


## Changes

This policy may be updated when CANly's data-handling features change. The current version is published with the Project YFA documentation.
