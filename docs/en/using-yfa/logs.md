# Logs

PROJECT YFA can save acquisition traffic as CL2000-style text logs and provides a built-in **Logs** browser for reviewing, searching, annotating, sharing, exporting, and deleting recorded sessions.

Choose the PROJECT YFA storage root first in **Settings → Logging → PROJECT YFA directory**.

## PROJECT YFA directory layout

PROJECT YFA keeps one persistent Android document-tree permission for the selected root directory and creates these child directories when they are first needed:

```text
PROJECT YFA/
├─ logs/
├─ debug/
├─ exports/
└─ metadata/
```

- **logs/** — raw CL2000-style acquisition `.TXT` files;
- **debug/** — Bluetooth/USB/MQTT diagnostic logs when debug logging is enabled;
- **exports/** — decoded CSV exports created from recorded logs;
- **metadata/** — PROJECT YFA metadata files, including `PROJECT_YFA_LOGS.json` and `PROJECT_YFA_VEHICLES.json`.

Selecting a new PROJECT YFA directory changes the root used by all of these functions.

## Recording a log

Enable **Log** from the main-screen menu before starting acquisition.

When acquisition starts, PROJECT YFA creates one independent `.TXT` file for that session under **logs/**. The current implementation does not split a session into multiple files.

If logging is enabled but no PROJECT YFA directory has been selected, PROJECT YFA can open the Android directory picker before continuing acquisition.

When a session that has written data is stopped, PROJECT YFA asks for confirmation because the current log file will be closed.

## Vehicle information stored with logs

PROJECT YFA tracks vehicle identity information used by the Logs viewer.

During connection/acquisition it can resolve the VIN and odometer from supported CAN/UDS sources. If the required values cannot be resolved automatically, the vehicle-information dialog can be used to enter or read them while acquisition continues.

At the end of a logged session PROJECT YFA can request confirmation of the final odometer before saving the final log metadata.

Known vehicle information is stored under:

```text
metadata/PROJECT_YFA_VEHICLES.json
```

Per-log metadata is stored under:

```text
metadata/PROJECT_YFA_LOGS.json
```

The per-log metadata includes the ECU/session label, start time, duration, record count, file size, VIN, start/end odometer values, and the optional user comment. This sidecar file is the authoritative log metadata index; the application may also keep an internal cache for faster loading.

## File format

The raw log uses the familiar CL2000 text structure:

```text
# Logger type: PROJECT YFA
# HW rev: Android
# FW rev: <app version>
# Logger ID: PROJECT_YFA
...
# Bit-rate: 500000
Timestamp;Type;ID;Data
```

Data records use semicolon-separated fields:

```text
Timestamp;Type;ID;Data
```

The timestamp format is `ddTHHmmssSSS`. Type is currently `0`. CAN IDs and payloads are written as uppercase hexadecimal.

Log timestamps and filenames use the Android device's current system time zone.

A filename has the form:

```text
YYYY-MM-DD_HH-mm-ss_ECU.TXT
```

### Aggregate ECUs logs

Acquisition from the USB **ECUs** tab uses `ECUs` as the filename ECU label. Raw CAN aggregate logging is designed as a high-throughput path: the log is opened before CAN reception begins, received frames are queued for logging independently of UI decoding, and the writer flushes buffered data periodically rather than after every frame.

The Raw CAN aggregate session listens to all received CAN frames for logging. Decoding remains limited to CAN IDs known to the PROJECT YFA ECU/signal database.

Aggregate Passive and Active UDS sessions log the corresponding diagnostic responses under the same `ECUs` session label.

## Browsing logs

Open **Logs** from the application menu.

The browser reads PROJECT YFA `.TXT` files from **logs/** and combines them with the metadata stored in **metadata/PROJECT_YFA_LOGS.json**. Newer sessions are shown first and are grouped by month.

Each log card shows the date and start time, raw file size, ending odometer, distance travelled when both odometer values are known, session duration, ECU/session label, and optional comment.

If an older log does not yet have complete sidecar metadata, PROJECT YFA can parse the raw log and refresh its metadata entry.

## Search

Tap the search icon in the Logs screen to filter recorded sessions.

Search matches the log's ECU/session label, date/time, start or end odometer, calculated distance, and comment.

## Comments

Open the **⋮** menu for a log and choose **Edit comment** to attach a short note to that session.

Comments are stored in `metadata/PROJECT_YFA_LOGS.json`, not inside the raw `.TXT` file. The Logs screen shows the comment directly on the card, and comments are included in search.

## Log actions

**Edit comment** updates the sidecar metadata.

**Export CSV** decodes supported live UDS responses and writes CSV files under **exports/**.

**Share** uses the Android sharing interface to share the original raw log file.

**Delete** asks for confirmation and then removes the selected raw log. Stale sidecar entries are cleaned when the log list is refreshed.

## CSV export

CSV export uses the current packaged `signals.json` definitions.

A separate CSV is created for each UDS request for which the source log contains decodable LIVE responses. Every CSV row comes from one raw response, so all values in that row share the same response timestamp.

CSV columns contain **Timestamp** followed by decoded signal names. Units are appended to column headings when defined.

Exported filenames have the form:

```text
<original-log-name-without-TXT>_<UDS-request>.csv
```

The files are written under **exports/**, are UTF-8, and include a BOM so spreadsheet applications can reliably recognize characters such as `°C`.

If no supported live UDS responses are found, CSV export reports an error rather than creating an empty export.

!!! note
    The current CSV exporter is request-oriented and decodes UDS LIVE definitions. A raw PROJECT YFA log may therefore be useful even when that particular file does not produce a CSV export.

## Troubleshooting log access

If logs suddenly disappear from the browser, first check **Settings → Logging → PROJECT YFA directory** and Android's access to that root directory. The raw files remain under **logs/**.

If Android's persistent permission is lost, the Logs screen can request the PROJECT YFA directory again.

Adapter debug logging is a separate troubleshooting feature. Its files are stored under **debug/** rather than mixed with acquisition logs.
