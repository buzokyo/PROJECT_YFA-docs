# ECU information

**ECU info** performs a one-time read of identification data for the ECU selected on the main screen.

Use it while the vehicle is stationary and the diagnostic connection is available.

## All-ECUs information

With **USB CANnectivity**, the aggregate **ECUs** tab provides a combined ECU-information operation. PROJECT YFA first probes the configured ECU profiles with Tester Present. It then reads identification requests for the ECUs that responded and presents the decoded values grouped by ECU.

The dialog shows the detected ECU names, decoded identification fields for each ECU, and a count of identification requests that failed. Closing the dialog stops an in-progress presence probe or identification operation.

This combined operation is USB-only and uses active diagnostic communication.

## Opening ECU info

Select the required ECU tab, open the main-screen menu, and choose **ECU info**.

The command is available only while PROJECT YFA is connected and no normal polling, passive monitoring, or Raw CAN acquisition session is active.

PROJECT YFA obtains the identification requests from its packaged request and signal databases. Only requests that are both known by the response catalog and have **IDENTIFICATION** signal definitions are used.

If no identification definitions exist for the selected ECU, the dialog reports that no ECU identification signals are defined.

## Reading over Bluetooth ELM327

With **Bluetooth ELM327**, PROJECT YFA performs the identification requests once using the normal diagnostic request path.

Successful responses are decoded and displayed. A request that fails does not necessarily prevent values from other successful identification requests from being shown.

## Reading over USB CANnectivity

With **USB CANnectivity**, ECU info uses the Active UDS transport.

PROJECT YFA uses the selected ECU's configured diagnostic TX and RX CAN IDs and sends every identification request once. Polling is stopped when all requested items have either produced a response or a failure.

This means ECU info is an active diagnostic operation even if the normal acquisition mode in Settings is Raw CAN or Passive UDS.

## Displayed values

Decoded identification values are ordered by their database display order and then by name. Duplicate signal names are shown only once.

The exact fields differ by ECU and by the definitions present in the PROJECT YFA database. The dialog therefore does not assume that every ECU exposes the same software number, calibration identifier, version, date, or other identification fields.

Some values have display-specific formatting. For example, the ECM **Software date** from request `1A99` is shown as `YYYY-MM-DD` when its BCD value is valid, and fields named **Version** are formatted as hexadecimal.

If no returned data can be decoded into identification fields, PROJECT YFA reports that no identification values could be decoded. It also reports the number of individual identification requests that failed.

## Related pages

See **Signals configuration** and **Live Signals** for continuous measurements. ECU info is intended for identification data rather than continuous acquisition.
