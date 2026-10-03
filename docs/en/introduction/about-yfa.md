# About PROJECT YFA

PROJECT YFA is an Android application developed to display and interpret data from a vehicle CAN bus.

The current application combines several data sources:

- **RAW CAN** — signals decoded directly from normal CAN traffic.
- **Passive UDS** — information observed from diagnostic communication already present on the bus.
- **Active UDS** — diagnostic data requested by PROJECT YFA from compatible ECUs.

The application presents decoded values through **Live Signals** and contains supporting USB, CAN and diagnostic functionality.

## Documentation philosophy

This manual has two purposes:

1. Help a user operate PROJECT YFA without needing to understand its source code.
2. Preserve the technical knowledge behind the application and USB adapter for future development.

Technical explanations are therefore included where they help explain how a feature behaves.
