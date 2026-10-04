# About CANly

**CANly** is the Android application developed as part of PROJECT YFA to display and interpret data from a vehicle CAN bus.

The current application combines several data sources:

- **RAW CAN** — signals decoded directly from normal CAN traffic.
- **Passive UDS** — information observed from diagnostic communication already present on the bus.
- **Active UDS** — diagnostic data actively requested from compatible ECUs.

CANly presents decoded values through **Live Signals** and includes supporting USB, CAN, logging, MQTT, vehicle-metadata, plotting, and alert functionality.

## CANly and PROJECT YFA

**CANly** is the user-facing Android application name. **PROJECT YFA** is the wider development project and GitHub repository, which also contains the signal database, documentation, and USB CAN adapter firmware/resources.

## Documentation philosophy

This manual has two purposes:

1. Help a user operate CANly without needing to understand its source code.
2. Preserve the technical knowledge behind CANly and the PROJECT YFA USB adapter for future development.

Technical explanations are therefore included where they help explain how a feature behaves.
