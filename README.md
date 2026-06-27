# ObserveOps Icon Library — by Module

**766 unique SVG icons** harvested from Motadata ObserveOps (`172.16.9.243`, build 8.2.6), organised **by product module → sub-category**.

Open **`index.html`** for the library landing page, or **`icons.html`** for the searchable icon gallery (module sidebar, sub-category nav, copy/download). **`color-palette.html`** holds the color tokens.

> Note: ObserveOps ships **one shared UI icon library** used across all modules — only ~225 of the 518 UI icons are domain-specific to a single module. Generic glyphs (navigation, arrows, CRUD actions, status, files, shapes) live under **Common / Global**. Each icon is placed in exactly one module: its code-confirmed or most-related module, else Common. The 238 technology icons all belong to **Monitors** (they are monitor types), sub-grouped by vendor.

## Modules
| Module | Icons | Covers |
|---|---|---|
| **Dashboards** | 3 | dashboard & widget icons |
| **Monitors** | 294 | monitored-technology icons (AWS/Azure/GCP, OS, DB, network, apps — 238 vendor logos) + monitor/inventory UI |
| **Alerts** | 5 | alerts, alarms, severities |
| **SLO** | 2 | service-level objectives |
| **Reports** | 1 | reporting |
| **Topology** | 12 | topology maps & nodes |
| **NCCM** | 27 | config & change mgmt, compliance |
| **NetRoute** | 3 | network route/path analysis |
| **Metric Explorer** | 3 | metric querying & charts |
| **Log Explorer** | 5 | log search & patterns |
| **APM Explorer** | 17 | APM — services, traces, runtimes |
| **RUM Explorer** | 11 | real-user monitoring, sessions, browsers |
| **Flow Explorer** | 7 | network flow/traffic |
| **Trap Explorer** | 1 | SNMP traps |
| **Audits** | 1 | audit trail |
| **Settings** | 67 | admin/config — users, integrations, rules |
| **Common / Global** | 305 | generic UI shared across ALL modules (nav, arrows, CRUD actions, status, files, shapes, text, time) |
| **Brand** | 2 | favicons |
| | **766** | |

## Directory structure
```
observeops-icons/
├── index.html                 # landing page (design-library home)
├── icons.html                 # icon gallery: module sidebar -> sub-category
├── color-palette.html         # color tokens
├── README.md
└── <module>/<sub-category>/<icon-name>.svg
```

Each module folder contains sub-category folders. Sub-categories are functional for UI icons (actions-edit, status-severity-health, charts-metrics, …) and vendor-based inside **Monitors** (aws, azure, gcp, databases, network-devices, …).

### Per-module sub-categories

- **Dashboards** (3): navigation-layout (3)
- **Monitors** (294): alerts-notifications (1), application-runtimes (9), applications-saas (19), aws (20), azure (14), charts-metrics (1), cloud-compute (21), communication-messaging (4), containers-orchestration (4), databases (15), directory-services (2), gcp (6), hardware-servers (5), infrastructure-hardware (4), media-device (1), messaging-streaming (5), middleware (7), monitoring-observability (7), network-connectivity (7), network-devices (22), network-services-protocols (21), observability-monitoring (4), operating-systems (9), oracle-cloud (6), other-cloud (1), security-access (1), security-identity (14), status-severity-health (3), storage-backup (14), storage-data (8), time-date (1), virtualization (15), web-app-servers (8), web-browsers (15)
- **Alerts** (5): alerts-notifications (5)
- **SLO** (2): observability-monitoring (2)
- **Reports** (1): file-document (1)
- **Topology** (12): actions-edit (1), arrows-direction (2), file-document (1), observability-monitoring (7), shapes-symbols (1)
- **NCCM** (27): actions-edit (2), charts-metrics (2), cloud-compute (1), dev-programming (6), file-document (2), infrastructure-hardware (1), navigation-layout (2), network-connectivity (2), observability-monitoring (4), security-access (1), shapes-symbols (1), storage-data (3)
- **NetRoute** (3): network-connectivity (3)
- **Metric Explorer** (3): charts-metrics (3)
- **Log Explorer** (5): observability-monitoring (2), text-input-formatting (3)
- **APM Explorer** (17): charts-metrics (1), cloud-compute (7), dev-programming (4), observability-monitoring (5)
- **RUM Explorer** (11): actions-edit (2), alerts-notifications (1), geo-location (1), observability-monitoring (3), shapes-symbols (2), status-severity-health (1), users-people (1)
- **Flow Explorer** (7): network-connectivity (2), observability-monitoring (5)
- **Trap Explorer** (1): observability-monitoring (1)
- **Audits** (1): security-access (1)
- **Settings** (67): actions-edit (5), alerts-notifications (1), arrows-direction (3), charts-metrics (1), cloud-compute (1), communication-messaging (1), file-document (5), infrastructure-hardware (8), media-device (1), network-connectivity (1), observability-monitoring (8), security-access (6), settings-config (13), shapes-symbols (2), status-severity-health (6), storage-data (2), users-people (3)
- **Common / Global** (305): actions-edit (38), arrows-direction (19), charts-metrics (11), cloud-compute (12), communication-messaging (19), dev-programming (3), file-document (17), geo-location (4), infrastructure-hardware (12), media-device (14), misc (8), navigation-layout (21), network-connectivity (28), observability-monitoring (4), security-access (13), settings-config (6), shapes-symbols (16), status-severity-health (14), storage-data (25), text-input-formatting (8), time-date (4), users-people (9)
- **Brand** (2): brand (2)

## How icons were mapped to modules

1. **Harvest** — all icons pulled directly from shipped assets (the `icons.<hash>.js` FontAwesome-format pack = 518 UI icons; `img/monitor-icons/*.svg` = 238 tech icons), downloaded via `curl` and parsed on disk.

2. **Code-usage signal** — scanned all 124 JS bundles to find which module's code chunk references each icon name (e.g., `bulls-eye`→topology, `assign-monitor`/`auto-assignment`→settings, `angry-smiley`→rum). 91 icons were code-confirmed to a single module.

3. **Live-app DFS** — visited all 16 modules to capture per-module chunk loading.

4. **Semantic assignment** — a multi-agent workflow assigned the remaining UI icons to the most-related module (or Common) using the code hints + icon meaning, then audited coverage.

## App module routes
| Module | Route |
|---|---|
| Dashboards | `/dashboard` |
| Monitors | `/inventory/` |
| Alerts | `/alerts/` |
| SLO | `/slo/` |
| Reports | `/reports/` |
| Topology | `/topology/network` |
| NCCM | `/nccm/` |
| NetRoute | `/netroute/` |
| Metric Explorer | `/metric-explorer/` |
| Log Explorer | `/log/` |
| APM Explorer | `/apm/` |
| RUM Explorer | `/rum/` |
| Flow Explorer | `/flow/` |
| Trap Explorer | `/trap-explorer/` |
| Audits | `/audit/` |
| Settings | `/settings/` |
