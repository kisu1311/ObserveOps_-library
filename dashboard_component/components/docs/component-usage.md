# Alerts Module — Component Usage Matrix

Auto-generated from each component's `meta.json`. 82 components across 6 categories.

## Components by category

| Component | Category | Variants | States | Used on screens |
|---|---|---|---|---|
| `buttons/add-as-widget` | buttons | default, with-target-label | default, hover, active, focus, disabled | ai-copilot-chat, ai-explorer-drawer |
| `buttons/add-widget-btn` | buttons | default | default, hover, focus, active, disabled | dashboard-panel-head, add-widget-flow |
| `buttons/add-widget-tab` | buttons | default, with-disabled | default, hover, selected, focus, disabled | add-widget-panel |
| `buttons/ai-generate-btn` | buttons | default, icon-only, block | default, hover, focus, busy, disabled | create-widget-modal, add-widget-panel, create-with-ai |
| `buttons/button-ghost` | buttons | ghost, with-icon, block | default, hover, active, focus, disabled | create-widget-modal, modal-footer |
| `buttons/button-outline` | buttons | default, with-icon, block | default, hover, focus, active, disabled | create-widget-modal |
| `buttons/button-primary` | buttons | solid, with-icon, sm, md | default, hover, focus, disabled | create-widget-modal, add-widget-panel |
| `buttons/dashboard-tab` | buttons | two-up, with-icons | default, hover, active, focus, disabled | dashboard-panel-header, noc-view |
| `buttons/fab` | buttons | default, fixed, lg | default, hover, focus, active, disabled | dashboard-canvas, add-widget-flow |
| `buttons/icon-button` | buttons | ghost, badged, ai | default, hover, focus, disabled | dashboard-topbar, ai-copilot-launcher, alerts-tray |
| `buttons/insight-btn` | buttons | default, primary, ghost | default, hover, focus, disabled | ai-insights-panel, ai-annotation-popover |
| `buttons/mini-pill` | buttons | two-pill, multi-segment | default, on, hover, focus, disabled | create-widget-modal, create-widget-sorting-pane, dashboard-module |
| `buttons/range-pill` | buttons | default, static | default, hover, focus, disabled | dashboard-toolbar, timeline-range, create-widget-config |
| `buttons/sidebar-icon` | buttons | rail, standalone, with-spacer | default, hover, focus, active, disabled | dashboard-shell, app-nav-rail |
| `buttons/style-chooser` | buttons | area, line, bar, hbar | default, selected, hover, focus, disabled | create-widget-modal, dashboard-module |
| `buttons/subbar-action` | buttons | default, active | default, hover, focus, active, disabled | dashboard-subbar |
| `buttons/subbar-arrow` | buttons | chevron | closed, open, hover, focus, disabled | dashboard-subbar, dashboard-module |
| `buttons/type-tab` | buttons | scroll-row, disabled-option | default, hover, focus, active, disabled | create-widget-modal |
| `fields/chat-input` | fields | empty, typed | default, focus-within, hover, disabled | ai-copilot-chat, ask-ai-panel |
| `fields/checkbox` | fields | box-only, with-label, indeterminate | unchecked, checked, hover, focus, disabled | source-picker-table, create-widget-modal |
| `fields/numeric-input` | fields | default, narrow, block | default, hover, focus, disabled | create-widget-modal, create-widget-config-pane, create-widget-threshold-pane, dashboard-module |
| `fields/range-slider` | fields | default, with-icon, mid-range | default, hover, focus, disabled | create-widget-modal, style-config-pane |
| `fields/search-input` | fields | default, compact, block | default, hover, focus, filled, disabled | dashboard-list-panel, add-widget-panel |
| `fields/select-dropdown` | fields | default, placeholder, open, block | default, hover, focus, open, selected, disabled | create-widget-modal, series-config-panel, rollup-config |
| `fields/text-input` | fields | default, with-value, focused, required, disabled | default, hover, focus, disabled | create-widget-modal, widget-config-panel |
| `fields/toggle-switch` | fields | off, on | default, checked, hover, focus, disabled | create-widget-config, widget-style-panel, dashboard-settings |
| `items/caret` | items | glyph, toggle-button | closed, open, hover, focus, disabled | dashboard-picker-tree, dashboard-module |
| `items/chat-message` | items | user, ai, typing | default, hover, focus, sending | ai-copilot-chat, ai-explore-drawer |
| `items/count-badge` | items | default, sm, lg, teal, red, green, solid | default | dashboard-tree-nav, dashboard-list-panel |
| `items/menu-item` | items | default, with-icon, with-shortcut, danger, separator | default, hover, focus, active, disabled | widget-more-menu, widget-header-actions, context-menu |
| `items/severity-badge` | items | crit, warn, info, ok, dot | default, hover, focus, pressed, disabled | alerts-widget, events-widget, dashboard-grid-table |
| `items/status-dot` | items | ok, crit, warn, info, muted, with-label, dot-only, glow, pulse | default, glow, pulse, disabled | monitor-table-widget, source-picker-modal, create-widget-flow |
| `items/suggestion-chip` | items | default, with-icon, active, row | default, hover, focus, active, disabled | ai-copilot-drawer, ask-ai-panel |
| `items/table-row` | items | monitor, alert-log, clickable, scroll | default, hover, selected, focus, disabled | dashboard-grid-widget, dashboard-alerts-widget, dashboard-canvas |
| `items/ticker-item` | items | critical, warn, link | default, hover, focus, disabled | noc-view, noc-ticker |
| `items/tree-leaf` | items | default, active, favourited | default, hover, focus, selected, disabled | dashboard-picker-panel, dashboard-tree-nav |
| `items/tree-node` | items | collapsed, expanded, with-children | default, hover, open, focus, disabled | dashboard-list-panel, dashboard-tree |
| `items/trend-chip` | items | up, down, neutral, bare | default, hover, focus, disabled | grid-widget-status, kpi-delta |
| `tiles/empty-state` | tiles | default, positive, with-action, compact | default, hover, focus, disabled | ai-insights-drawer, user-defined-widgets-gallery, add-widget-panel, empty-panel |
| `tiles/insight-card` | tiles | default, crit, warn, ok, info | default, hover, focus, disabled, dismissing | ai-insights-panel, ai-copilot-drawer |
| `tiles/library-card` | tiles | predefined, user-define, grid | default, hover, focus, selected, disabled | add-widget-panel, predefined-widget-gallery, user-define-widget-gallery |
| `tiles/metric-detail-card` | tiles | lower-better, higher-better, compact | default, hover, focus, disabled | counter-picker, create-widget-flow, data-source-config, widget-config-panel |
| `tiles/noc-kpi` | tiles | neutral, critical, warning, up, down, row, selectable | default, hover, focus, selected, disabled | noc-wallboard, noc-view-header |
| `tiles/noc-tile` | tiles | crit, warn, ok | default, hover, focus, disabled | noc-view, noc-grid |
| `tiles/template-card` | tiles | default, lib | default, hover, focus, disabled | add-widget-panel, create-widget-flow, widget-library-predefined, widget-library-user-defined |
| `tiles/widget-card` | tiles | default, ai-tool, wide | default, hover, focus, disabled, dragging, drop-target | dashboard-canvas, widget-grid, fullscreen-widget |
| `widgets/aiinsights` | widgets | feed, alt-seed, static-list, interactive-row | default, hover, focus, disabled | dashboard-grid, create-widget-modal, widget-fullscreen, ai-generate-widget |
| `widgets/alerts` | widgets | critical, warning, info, clear | default, hover, focus, disabled | dashboard-canvas, create-widget-modal, ai-chat-answer |
| `widgets/anomaly` | widgets | blue, purple, teal, wide-band | default, hover, focus, disabled | dashboard-grid, create-widget-modal, widget-fullscreen, ai-insights-answer, ai-generate-widget |
| `widgets/chart` | widgets | area, line, bar, sbar, hbar, sarea, sline, multi | default, hover, focus, disabled | dashboard-grid, create-widget-modal, widget-fullscreen, ai-insights-answer |
| `widgets/events` | widgets | default, alternate-seed | default, hover, focus, disabled | dashboard-canvas, create-widget-modal, widget-fullscreen |
| `widgets/forecast` | widgets | teal, blue, warn, long-horizon | default, hover, focus, disabled | dashboard-grid, create-widget-modal, ai-insights-answer, ai-copilot-chat |
| `widgets/gauge` | widgets | default, auto-threshold, severity-color | default, hover, focus, loading, disabled | create-widget-modal, add-widget-panel, dashboard-grid, noc-wallboard |
| `widgets/grid` | widgets | status-up, status-down, scrollable | default, hover, focus, disabled | dashboard-canvas, create-widget-modal |
| `widgets/heatmap` | widgets | default, dense, compact, legend | default, hover, focus, disabled | dashboard-grid, create-widget-modal, widget-fullscreen |
| `widgets/map` | widgets | default, dense, compact | default, hover, focus, disabled | dashboard-grid, create-widget-modal, widget-catalog, widget-fullscreen |
| `widgets/numeric` | widgets | default, tone-cells, compact, live-mount | default, hover, focus, disabled | dashboard-grid, add-widget-panel, create-widget-modal |
| `widgets/pie` | widgets | donut, pie, no-legend | default, hover, focus, disabled | dashboard-canvas, add-widget-panel, create-widget-modal |
| `widgets/query` | widgets | teal, blue, purple, orange, green, interactive | up, down, hover, focus, disabled | dashboard-canvas, create-widget-modal, add-widget-panel |
| `widgets/sankey` | widgets | dependency-flow, alt-seed | default, hover, focus, disabled | create-widget-modal, add-widget-panel, dashboard-canvas |
| `widgets/stream` | widgets | default, alt-seed, three-band | default, hover, focus, disabled | dashboard-grid, create-widget-modal, add-widget-panel, widget-fullscreen |
| `widgets/topn` | widgets | teal, blue, purple, with-unit | default, hover, focus, disabled | dashboard-canvas, create-widget-modal, ai-chat-answer |
| `widgets/treemap` | widgets | default, no-values, compact | default, hover, focus, disabled | dashboard-canvas, add-widget-panel, create-widget-modal |
| `planes/add-widget-panel` | planes | docked, drawer, create, predefined, user-define-empty | default, open, hover, focus, filtered, disabled | dashboard-module, add-widget-flow, create-widget-modal |
| `planes/ai-copilot-drawer` | planes | insights, ask, drawer | default, open, hover, focus, disabled | dashboard-module, ai-copilot-flow, ai-insights-panel |
| `planes/alert-banner` | planes | warning, critical, info | default, hover, focus, disabled, dismissing | dashboard-shell, alert-notification, topbar-region |
| `planes/canvas` | planes | default, with-wide-widget, empty | default, hover, focus, disabled | dashboard-module |
| `planes/counter-picker` | planes | default, empty, floating | default, hover, focus, selected, filtered, disabled | create-widget-modal, data-source-config, add-widget-flow |
| `planes/create-widget-modal` | planes | create, edit, overlay, style-pane, sorting-pane, markers-pane, timeline-pane | default, hover, focus, selected, on, disabled | dashboard-module, add-widget-panel, dashboard-grid |
| `planes/dashboard-panel` | planes | dashboard-tab, noc-tab | default, hover, focus, expanded, selected, disabled | dashboard-shell, dashboard-module, noc-view |
| `planes/logo` | planes | default, sm, lg, stacked, mark-only | default, hover, focus, disabled | topbar, app-chrome |
| `planes/noc-wallboard` | planes | default, filtered | default, filter-active, ticker-paused, hover, focus, disabled | noc-view, dashboard-module, dashboard-panel-tab |
| `planes/overlay` | planes | scrim, strong, with-dialog, contained | hidden, open, dismiss:hover, dismiss:focus, dismiss:disabled | add-widget-panel, create-widget-modal, ai-insights-drawer, widget-fullscreen |
| `planes/popup-menu` | planes | static, floating, end, with-search, with-groups | default, open, hover, focus, disabled | widget-more-menu, counter-picker, source-picker, ai-insights, context-menu |
| `planes/ruler` | planes | default, now-marked | default, hover, focus, grabbing, disabled | dashboard-module, dashboard-canvas |
| `planes/shell-layout` | planes | default, panel-open, no-banner | default, panel-open, disabled | dashboard-module, noc-view |
| `planes/sidebar` | planes | full-rail, state-showcase, compact-disabled | default, active, hover, focus, disabled | dashboard-shell, app-nav-rail, global-navigation |
| `planes/source-picker` | planes | open, floating, with-trigger, no-results | default, hover, focus, selected, indeterminate, filtered, disabled | create-widget-modal, data-source-builder |
| `planes/subbar` | planes | default, starred, panel-open | default, hover, focus, panel-open, starred, disabled | dashboard-module |
| `planes/toast` | planes | success, info, error, warning, transient-host | default, show, hiding, close:hover, close:focus, close:disabled | dashboard-canvas, add-widget-panel, create-widget-modal, ai-insights-drawer |
| `planes/topbar` | planes | default, badged-icon, ai-icon | default, hover, focus, disabled | global-chrome, dashboard-shell, ai-copilot-launcher, alerts-tray |
| `planes/widget-fullscreen` | planes | default, contained | hidden, open, hover, focus, disabled | dashboard-module, canvas, create-widget-modal |

## Components by screen (where each is used)

### add-widget-flow
`buttons/add-widget-btn` · `buttons/fab` · `planes/add-widget-panel` · `planes/counter-picker`

### add-widget-panel
`buttons/add-widget-tab` · `buttons/ai-generate-btn` · `buttons/button-primary` · `fields/search-input` · `planes/create-widget-modal` · `planes/overlay` · `planes/toast` · `tiles/empty-state` · `tiles/library-card` · `tiles/template-card` · `widgets/gauge` · `widgets/numeric` · `widgets/pie` · `widgets/query` · `widgets/sankey` · `widgets/stream` · `widgets/treemap`

### ai-annotation-popover
`buttons/insight-btn`

### ai-chat-answer
`widgets/alerts` · `widgets/topn`

### ai-copilot-chat
`buttons/add-as-widget` · `fields/chat-input` · `items/chat-message` · `widgets/forecast`

### ai-copilot-drawer
`items/suggestion-chip` · `tiles/insight-card`

### ai-copilot-flow
`planes/ai-copilot-drawer`

### ai-copilot-launcher
`buttons/icon-button` · `planes/topbar`

### ai-explore-drawer
`items/chat-message`

### ai-explorer-drawer
`buttons/add-as-widget`

### ai-generate-widget
`widgets/aiinsights` · `widgets/anomaly`

### ai-insights
`planes/popup-menu`

### ai-insights-answer
`widgets/anomaly` · `widgets/chart` · `widgets/forecast`

### ai-insights-drawer
`planes/overlay` · `planes/toast` · `tiles/empty-state`

### ai-insights-panel
`buttons/insight-btn` · `planes/ai-copilot-drawer` · `tiles/insight-card`

### alert-notification
`planes/alert-banner`

### alerts-tray
`buttons/icon-button` · `planes/topbar`

### alerts-widget
`items/severity-badge`

### app-chrome
`planes/logo`

### app-nav-rail
`buttons/sidebar-icon` · `planes/sidebar`

### ask-ai-panel
`fields/chat-input` · `items/suggestion-chip`

### canvas
`planes/widget-fullscreen`

### context-menu
`items/menu-item` · `planes/popup-menu`

### counter-picker
`planes/popup-menu` · `tiles/metric-detail-card`

### create-widget-config
`buttons/range-pill` · `fields/toggle-switch`

### create-widget-config-pane
`fields/numeric-input`

### create-widget-flow
`items/status-dot` · `tiles/metric-detail-card` · `tiles/template-card`

### create-widget-modal
`buttons/ai-generate-btn` · `buttons/button-ghost` · `buttons/button-outline` · `buttons/button-primary` · `buttons/mini-pill` · `buttons/style-chooser` · `buttons/type-tab` · `fields/checkbox` · `fields/numeric-input` · `fields/range-slider` · `fields/select-dropdown` · `fields/text-input` · `planes/add-widget-panel` · `planes/counter-picker` · `planes/overlay` · `planes/source-picker` · `planes/toast` · `planes/widget-fullscreen` · `widgets/aiinsights` · `widgets/alerts` · `widgets/anomaly` · `widgets/chart` · `widgets/events` · `widgets/forecast` · `widgets/gauge` · `widgets/grid` · `widgets/heatmap` · `widgets/map` · `widgets/numeric` · `widgets/pie` · `widgets/query` · `widgets/sankey` · `widgets/stream` · `widgets/topn` · `widgets/treemap`

### create-widget-sorting-pane
`buttons/mini-pill`

### create-widget-threshold-pane
`fields/numeric-input`

### create-with-ai
`buttons/ai-generate-btn`

### dashboard-alerts-widget
`items/table-row`

### dashboard-canvas
`buttons/fab` · `items/table-row` · `planes/ruler` · `planes/toast` · `tiles/widget-card` · `widgets/alerts` · `widgets/events` · `widgets/grid` · `widgets/pie` · `widgets/query` · `widgets/sankey` · `widgets/topn` · `widgets/treemap`

### dashboard-grid
`planes/create-widget-modal` · `widgets/aiinsights` · `widgets/anomaly` · `widgets/chart` · `widgets/forecast` · `widgets/gauge` · `widgets/heatmap` · `widgets/map` · `widgets/numeric` · `widgets/stream`

### dashboard-grid-table
`items/severity-badge`

### dashboard-grid-widget
`items/table-row`

### dashboard-list-panel
`fields/search-input` · `items/count-badge` · `items/tree-node`

### dashboard-module
`buttons/mini-pill` · `buttons/style-chooser` · `buttons/subbar-arrow` · `fields/numeric-input` · `items/caret` · `planes/add-widget-panel` · `planes/ai-copilot-drawer` · `planes/canvas` · `planes/create-widget-modal` · `planes/dashboard-panel` · `planes/noc-wallboard` · `planes/ruler` · `planes/shell-layout` · `planes/subbar` · `planes/widget-fullscreen`

### dashboard-panel-head
`buttons/add-widget-btn`

### dashboard-panel-header
`buttons/dashboard-tab`

### dashboard-panel-tab
`planes/noc-wallboard`

### dashboard-picker-panel
`items/tree-leaf`

### dashboard-picker-tree
`items/caret`

### dashboard-settings
`fields/toggle-switch`

### dashboard-shell
`buttons/sidebar-icon` · `planes/alert-banner` · `planes/dashboard-panel` · `planes/sidebar` · `planes/topbar`

### dashboard-subbar
`buttons/subbar-action` · `buttons/subbar-arrow`

### dashboard-toolbar
`buttons/range-pill`

### dashboard-topbar
`buttons/icon-button`

### dashboard-tree
`items/tree-node`

### dashboard-tree-nav
`items/count-badge` · `items/tree-leaf`

### data-source-builder
`planes/source-picker`

### data-source-config
`planes/counter-picker` · `tiles/metric-detail-card`

### empty-panel
`tiles/empty-state`

### events-widget
`items/severity-badge`

### fullscreen-widget
`tiles/widget-card`

### global-chrome
`planes/topbar`

### global-navigation
`planes/sidebar`

### grid-widget-status
`items/trend-chip`

### kpi-delta
`items/trend-chip`

### modal-footer
`buttons/button-ghost`

### monitor-table-widget
`items/status-dot`

### noc-grid
`tiles/noc-tile`

### noc-ticker
`items/ticker-item`

### noc-view
`buttons/dashboard-tab` · `items/ticker-item` · `planes/dashboard-panel` · `planes/noc-wallboard` · `planes/shell-layout` · `tiles/noc-tile`

### noc-view-header
`tiles/noc-kpi`

### noc-wallboard
`tiles/noc-kpi` · `widgets/gauge`

### predefined-widget-gallery
`tiles/library-card`

### rollup-config
`fields/select-dropdown`

### series-config-panel
`fields/select-dropdown`

### source-picker
`planes/popup-menu`

### source-picker-modal
`items/status-dot`

### source-picker-table
`fields/checkbox`

### style-config-pane
`fields/range-slider`

### timeline-range
`buttons/range-pill`

### topbar
`planes/logo`

### topbar-region
`planes/alert-banner`

### user-define-widget-gallery
`tiles/library-card`

### user-defined-widgets-gallery
`tiles/empty-state`

### widget-catalog
`widgets/map`

### widget-config-panel
`fields/text-input` · `tiles/metric-detail-card`

### widget-fullscreen
`planes/overlay` · `widgets/aiinsights` · `widgets/anomaly` · `widgets/chart` · `widgets/events` · `widgets/heatmap` · `widgets/map` · `widgets/stream`

### widget-grid
`tiles/widget-card`

### widget-header-actions
`items/menu-item`

### widget-library-predefined
`tiles/template-card`

### widget-library-user-defined
`tiles/template-card`

### widget-more-menu
`items/menu-item` · `planes/popup-menu`

### widget-style-panel
`fields/toggle-switch`

