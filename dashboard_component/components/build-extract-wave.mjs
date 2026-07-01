export const meta = {
  name: 'extract-wave',
  description: 'Decompose dashboard components into isolated, refined raw partials (extract + verify)',
  phases: [
    { title: 'Extract', detail: 'one agent per component: read monolith slice, write refined css/html/js/meta.json' },
    { title: 'Verify', detail: 'one agent per component: enforce isolation + a11y conventions, fix in place' },
  ],
}

const MONO = '/Users/kishanpatel/ObseverOps/dashboard_component/dashboard-module.html'
const CONV = '/Users/kishanpatel/ObseverOps/dashboard_component/components/CONVENTIONS.md'
const ROOT = '/Users/kishanpatel/ObseverOps/dashboard_component/components/'

// ─── component specs by category ────────────────────────────────────────────
const WAVES = {
  buttons: [
    { name: 'button-primary', classes: '.btn, .btn.solid', note: 'Primary solid teal action button (Create/Save). Find the .btn base rule plus the .solid modifier. Provide solid (default), with-icon, sm/md sizes, and disabled.' },
    { name: 'button-ghost', classes: '.btn, .btn.ghost', note: 'Secondary transparent/bordered button (Cancel/Reset).' },
    { name: 'button-outline', classes: '.btn, .btn.outline', note: 'Tertiary teal-outline button, no fill.' },
    { name: 'fab', classes: '.fab', note: 'Floating action button: ~50px circular teal, fixed bottom-right, shadow; opens Add Widget. Include a plus icon.' },
    { name: 'icon-button', classes: '.tb-ico, .badge', note: 'Topbar 30x30 icon button with optional notification .badge; include a plain variant, a badged variant, and the AI sparkle variant if .tb-ico.ai exists.' },
    { name: 'subbar-arrow', classes: '.sb-arrow', note: '30x30 circular panel-toggle arrow; rotates 180deg when the panel is open (shell.panelopen). Provide closed and open states.' },
    { name: 'subbar-action', classes: '.sb-act', note: 'Subbar 30x30 icon action button (fullscreen/snapshot/more).' },
    { name: 'sidebar-icon', classes: '.ib, .ib.act', note: 'Left nav-rail 32x32 icon button with active state (.act): teal glow + left accent bar. Provide default + active.' },
    { name: 'add-widget-btn', classes: '.dp-add', note: 'Circular + button in the dashboard panel; rotates on hover.' },
    { name: 'dashboard-tab', classes: '.dp-tab', note: 'Segmented tab button (Dashboard / NOC View); active .on teal background. Provide a 2-tab group; make it interactive via delegation.' },
    { name: 'add-widget-tab', classes: '.aw-tab', note: 'Underline tab (Create / Predefined / User Define); active .on. Provide a tab group; interactive via delegation.' },
    { name: 'type-tab', classes: '.cw-type', note: 'Horizontally scrollable widget-type selector tab (Chart/Grid/Gauge...); active .on. Provide several in a scroll row.' },
    { name: 'style-chooser', classes: '.style-btn', note: '42x34 chart-style preview button (Area/Line/Bar) with a small icon; selected .on. Provide a selectable group.' },
    { name: 'mini-pill', classes: '.mini-pill', note: 'Small toggle pill group (Top/Last); active .on. Provide a 2-pill group; interactive via delegation.' },
    { name: 'range-pill', classes: '.range-pill', note: 'Time-range pill with .tag (teal badge), .lbl label, and .clr clear (X). Provide one example.' },
    { name: 'ai-generate-btn', classes: '.ai-gen-go', note: 'Gradient teal->purple AI generate button with a sparkle icon (use the SPARK glyph output).' },
    { name: 'insight-btn', classes: '.ins-btn, .ins-btn.primary', note: 'Small AI insight action buttons; default + primary variants (Add as widget / Investigate / Dismiss).' },
    { name: 'add-as-widget', classes: '.ai-addw', note: 'Small purple-gradient "add as widget" button used in AI chat answers.' },
  ],

  fields: [
    { name: 'text-input', classes: '.fld, .inp', note: 'Labelled text input (field label + input) with a bottom-border that brightens to teal on focus. Variants: default, focused, with-value, disabled.' },
    { name: 'numeric-input', classes: '.num-inp', note: 'Small numeric input (60-80px wide), bottom-border style, used for line-width / point-count / thresholds. Provide default + disabled; type=number.' },
    { name: 'search-input', classes: '.dp-search, .aw-search', note: 'Search field with a leading magnifier icon used inside panels/modals (dashboard list, add-widget). Provide empty + with-value.' },
    { name: 'chat-input', classes: '.ai-input', note: 'AI chat message input row with a trailing send button. Provide empty + typed states.' },
    { name: 'select-dropdown', classes: '.sel', note: 'Select trigger showing the current value + a chevron; opens an options menu. Provide closed + open (a simple options list). Interactive via delegation (toggle open, choose option, aria-expanded).' },
    { name: 'toggle-switch', classes: '.toggle', note: '34x18 animated slide toggle with a label; .on moves the knob. Interactive via delegation; use role=switch + aria-checked. Provide off + on + disabled.' },
    { name: 'range-slider', classes: '.slider', note: 'Custom range slider (input[type=range]) with a value display box. Style the webkit/moz thumb+track. Provide a couple of values; aria via the native input.' },
    { name: 'checkbox', classes: '.cbx', note: '15x15 bordered checkbox with a check when selected. Interactive via delegation; use a real <input type=checkbox> visually-hidden + styled box, or role=checkbox + aria-checked. Provide unchecked + checked + disabled.' },
  ],

  items: [
    { name: 'tree-node', classes: '.tnode, .trow, .caret, .tlabel, .tcount', note: 'Collapsible dashboard-tree category row: caret (rotates 90deg when open) + label + count badge; clicking toggles .open to reveal children. Interactive via delegation. Provide collapsed + expanded.' },
    { name: 'tree-leaf', classes: '.tleaf, .ll, .ls, .lk', note: 'Tree child row: a lock icon + label + a star favourite toggle; active leaf gets .on teal glow. Provide default, active, favourited. Star toggles via delegation.' },
    { name: 'count-badge', classes: '.tcount', note: 'Small pill count badge (e.g. item counts on tree rows). Provide a few sizes/colors.' },
    { name: 'caret', classes: '.caret', note: 'Disclosure caret arrow that rotates 90deg between closed/open. Provide both states.' },
    { name: 'severity-badge', classes: '.sev, .sev.crit, .sev.warn, .sev.info, .sev.ok', note: 'Inline uppercase severity label with 4 color variants (crit/warn/info/ok) on tinted backgrounds. Provide all variants.' },
    { name: 'status-dot', classes: '.dot', note: '8x8 colored status circle. Provide ok(green)/crit(red)/warn(yellow)/muted variants, optionally with a label.' },
    { name: 'trend-chip', classes: '.chip-up, .chip-dn', note: 'Inline trend chip: green up-triangle "Up" / red down-triangle "Down" with a value. Provide up + down.' },
    { name: 'table-row', classes: '.grid-tbl', note: 'Styled data table with a hover fill on rows (monitor/status style). Provide a small table with a header + a few rows incl. a status dot + severity badge. Scope under the component root.' },
    { name: 'chat-message', classes: '.msg, .msg.user, .msg.ai', note: 'AI chat bubbles: user (teal, right-aligned) vs ai (avatar + bubble, left-aligned). Provide one of each.' },
    { name: 'ticker-item', classes: '.tk-item, .tk-item.w', note: 'Scrolling NOC alert item: bold source + message; orange (.w) warning variant. Provide a normal + warning item (no need to animate in the partial).' },
    { name: 'suggestion-chip', classes: '.ai-chip', note: 'Clickable AI suggestion pill (11px) with a purple border on hover. Provide a few in a row.' },
    { name: 'menu-item', classes: '.opt, .menu-row, .menu-sep', note: 'Dropdown/context-menu option row: leading icon + label, plus a danger variant and a separator. Provide a small menu list (Edit/Clone/Full Screen/sep/Delete). Use the menu-icons output style.' },
  ],

  tiles: [
    { name: 'widget-card', classes: '.widget, .w-head, .w-title, .w-tag, .w-tools, .w-tool, .w-body, .w-resize', note: 'The dashboard widget container shell: header (drag grip, title, tag, toolbar of refresh/AI/more/remove) + body slot + bottom-right resize handle. Provide the chrome with a placeholder body (a labelled empty body div). Composes icon-button-like w-tools.' },
    { name: 'template-card', classes: '.aw-card', note: 'Add-Widget template selector card: type icon + name + subtitle, hover lifts to teal border. Provide a couple (e.g. Chart, Gauge) using card icons.' },
    { name: 'library-card', classes: '.aw-card.lib', note: '3-column compact library card variant (Predefined / User Define galleries). Provide a few.' },
    { name: 'noc-tile', classes: '.noc-tile, .tstat, .tn, .tsub, .tv, .tu', note: 'NOC wallboard KPI tile: status stripe (crit/warn/ok) + name + sublabel + big mono value w/ unit + a sample sparkline (inline a representative sparkline SVG path; do NOT call JS). Provide crit/warn/ok variants.' },
    { name: 'noc-kpi', classes: '.noc-kpi', note: 'Small NOC header KPI counter: big colored value + label (Monitors / Critical / Warning / Up / Down). Provide a row of them.' },
    { name: 'insight-card', classes: '.ins, .ins-top, .ins-kind, .ins-conf, .ins-title, .ins-desc, .ins-acts', note: 'AI insight card: left-border severity, kind tag + confidence%, title, description, a sample sparkline (inline SVG), and an action row (Add as widget / Investigate / Dismiss). Composes insight-btn classes. Provide crit + info variants.' },
    { name: 'metric-detail-card', classes: '.pop.wide', note: 'The metric/counter detail card (right pane of the counter picker): metric name, description, a "higher/lower is better" interpretation line, and a small RCA/usage note. Build a clean standalone card. Provide one example.' },
    { name: 'empty-state', classes: '.ph-empty, .hint', note: 'Empty/placeholder state used in the AI drawer and empty panels: a centered icon + "All clear"-style heading + hint text. Provide one example.' },
  ],

  widgets: [
    { name: 'chart', classes: 'rChart', note: 'RENDERER. Source fn rChart(o): line/area/bar chart with grid + y labels, smooth bezier. opts {seed,style(area|line|bar|sbar|hbar|sarea|sline),color,lw,points,multi}. Register OOW.chart=(mountEl,opts)=>{...}; depend on series/smoothPath/SVAR. Provide an area + a bar mount.' },
    { name: 'topn', classes: 'rTopN', note: 'RENDERER rTopN(o): horizontal Top-N bar list (8 items: name + bar + value). OOW.topn. Provide one mount.' },
    { name: 'gauge', classes: 'rGauge', note: 'RENDERER rGauge(o): semicircular progress gauge dial with center value + label. OOW.gauge. Provide one mount.' },
    { name: 'pie', classes: 'rPie', note: 'RENDERER rPie(o): pie or donut chart, 5 colored slices, donut center value. OOW.pie. Provide pie + donut mounts.' },
    { name: 'query', classes: 'rQuery', note: 'RENDERER rQuery(o): single big numeric value + sparkline + green/red % delta. OOW.query. Provide one mount.' },
    { name: 'numeric', classes: 'rNumeric', note: 'RENDERER rNumeric(o): 3x2 grid of KPI boxes (label + value + unit). OOW.numeric. Provide one mount.' },
    { name: 'sankey', classes: 'rSankey', note: 'RENDERER rSankey(o): flow diagram, 3 left nodes -> 4 right nodes with translucent flow ribbons. OOW.sankey. Provide one mount.' },
    { name: 'heatmap', classes: 'rHeatmap', note: 'RENDERER rHeatmap(o): hexagonal heatmap grid, 5-level severity colors (use SEVS). OOW.heatmap. Provide one mount.' },
    { name: 'stream', classes: 'rStream', note: 'RENDERER rStream(o): stacked streamgraph, 4 series x 24 points. OOW.stream. Provide one mount.' },
    { name: 'treemap', classes: 'rTreemap', note: 'RENDERER rTreemap(o): treemap of 6 colored rectangles with labels + values. OOW.treemap. Provide one mount.' },
    { name: 'map', classes: 'rMap', note: 'RENDERER rMap(o): stylized geo map, grid background, ~11 severity-colored data points with halos. OOW.map. Provide one mount.' },
    { name: 'anomaly', classes: 'rAnomaly', note: 'RENDERER rAnomaly(o): line chart with a shaded confidence band and marked anomaly points (red circle + ring). OOW.anomaly. Provide one mount.' },
    { name: 'forecast', classes: 'rForecast', note: 'RENDERER rForecast(o): historical solid line + dashed forecast line + confidence cone + dashed vertical separator. OOW.forecast. Provide one mount.' },
    { name: 'grid', classes: 'rGrid, .grid-tbl, .scroll', note: 'RENDERER rGrid(o): HTML table (Monitor/Traffic/Interface/Status) with status dot + up/down chip. OOW.grid writes HTML into the mount. Scope .grid-tbl/.scroll css under the widget root. Provide one mount.' },
    { name: 'alerts', classes: 'rAlerts, .grid-tbl, .sev, .scroll', note: 'RENDERER rAlerts(o): HTML table (Severity badge / Alert / Source IP / Time ago mono). OOW.alerts. Provide one mount.' },
    { name: 'events', classes: 'rEvents, .scroll', note: 'RENDERER rEvents(o): vertical event timeline, ~8 items with colored left borders + timestamp + description. OOW.events. Provide one mount.' },
    { name: 'aiinsights', classes: 'rAiInsights, .scroll', note: 'RENDERER rAiInsights(o): scrollable list of compact insight rows (type/title/desc/confidence, severity left border). OOW.aiinsights. Provide one mount.' },
  ],

  planes: [
    { name: 'shell-layout', classes: '.shell, .body-row', note: 'Root app shell: flex column 100vh (banner > topbar > subbar > body-row of sidebar + content). Layout-only surface with labelled slot placeholders; composes the other planes. deps: lists the planes it frames.' },
    { name: 'alert-banner', classes: '.alert-banner, .alert-chip, .alert-text, .alert-x', note: 'Top warning banner: severity chip + message (with bold counts) + dismiss X. Provide one example.' },
    { name: 'topbar', classes: '.topbar, .tb-logo, .tb-sp, .tb-right, .build-pill, .tb-avatar', note: 'Global topbar: logo (compose logo) + spacer + icon-button cluster (search/ack/monitors/alerts/AI) + build pill + avatar. Composes logo + icon-button. Provide the full bar.' },
    { name: 'logo', classes: '.logo-mark, .logo-word', note: 'Brand logo: conic-gradient circular mark + "motadata" wordmark (data in teal). Provide it.' },
    { name: 'subbar', classes: '.subbar, .sb-title, .sb-name, .sb-star, .sb-sp, .timeline-range, .range-date', note: 'Dashboard subbar: panel-toggle arrow + dashboard name + star + spacer + time-range pill + date + action buttons. Composes subbar-arrow, range-pill, subbar-action. Provide the full bar.' },
    { name: 'sidebar', classes: '.ibar, .ib-sp', note: 'Left icon nav-rail: column of sidebar-icon buttons + spacer + settings at bottom; one active. Composes sidebar-icon. Provide the rail.' },
    { name: 'dashboard-panel', classes: '.dpanel, .dp-head, .dp-tabs, .dp-search, .dp-add', note: 'Slide-in left dashboard-list panel: Dashboard/NOC tabs + search + add button + scrollable tree. Composes dashboard-tab, search-input, add-widget-btn, tree-node, tree-leaf. Provide the panel (shown/open state).' },
    { name: 'add-widget-panel', classes: '.aw, .aw-head, .aw-tabs, .aw-body, .aw-search', note: 'Slide-in right Add-Widget panel: Create/Predefined/User-Define tabs + search + scrollable card grid. Composes add-widget-tab, search-input, template-card. Provide the panel.' },
    { name: 'create-widget-modal', classes: '.cw', note: 'The large Create Widget modal: type-tab strip + live preview pane + config (Style/Sorting/Markers/Timeline) + data-source builder + footer buttons. Build a faithful shell composing type-tab, style-chooser, fields, toggle, slider, buttons. Largest plane — focus on structure + the key regions.' },
    { name: 'overlay', classes: '.overlay', note: 'Modal backdrop: fixed inset, semi-transparent dark-blue + blur. Provide it (with a sample centered box to show the dimming).' },
    { name: 'canvas', classes: '.canvas, .wgrid, .fab', note: 'Main dashboard canvas: ruler + 2-col widget grid + FAB. Composes ruler, widget-card, fab. Provide the canvas with a couple of placeholder widget cards.' },
    { name: 'ruler', classes: '.ruler, .rtick', note: 'Timeline ruler header: row of mono time-tick labels + a draggable range indicator. Provide it.' },
    { name: 'noc-wallboard', classes: '.noc, .noc-top, .noc-grid, .noc-ticker', note: 'Full-screen NOC wallboard: header (title + Live pulse + KPI counters) + 4-col status-tile grid + scrolling ticker. Composes noc-kpi, noc-tile, ticker-item. Provide the wallboard.' },
    { name: 'ai-copilot-drawer', classes: '.aix, .aix-tabs, .aix-body, .aix-chat, .aix-input', note: 'Right AI Copilot drawer: Insights / Ask AI tabs + scrollable body + chat + input footer. Composes insight-card, chat-message, chat-input, suggestion-chip. Provide the drawer (Insights tab).' },
    { name: 'widget-fullscreen', classes: '.wfs-overlay, .wfs-card', note: 'Fullscreen widget modal: dark backdrop + centered large card (header + big body). Provide it with a placeholder body.' },
    { name: 'popup-menu', classes: '.pop, .opt, .menu-row, .menu-sep', note: 'Generic floating dropdown/context menu surface (shadow, rounded). Composes menu-item. Provide an open menu.' },
    { name: 'counter-picker', classes: '.pop.wide', note: 'Two-column metric/counter picker popup: search + scrollable counter list (left) + metric detail (right). Composes search-input, menu-item, metric-detail-card. Provide it.' },
    { name: 'source-picker', classes: '.pop.table', note: 'Monitor/source picker popup: search + a selectable monitor table. Composes search-input, table-row. Provide it.' },
    { name: 'toast', classes: '.toast', note: 'Bottom-center transient toast notification. Provide a couple (info + success).' },
  ],
}

// ─── which categories to run this invocation (edit + re-invoke per wave) ─────
const ACTIVE = ['widgets', 'planes']

const ITEMS = ACTIVE.flatMap(cat => (WAVES[cat] || []).map(c => ({ ...c, cat })))

const META_SCHEMA = {
  type: 'object',
  required: ['name', 'wrote', 'title', 'usedIn'],
  properties: {
    name: { type: 'string' }, wrote: { type: 'boolean' }, title: { type: 'string' },
    description: { type: 'string' }, rootClass: { type: 'string' },
    variants: { type: 'array', items: { type: 'string' } },
    states: { type: 'array', items: { type: 'string' } },
    deps: { type: 'array', items: { type: 'string' } },
    usedIn: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    hasJs: { type: 'boolean' }, notes: { type: 'string' },
  },
}
const VERDICT_SCHEMA = {
  type: 'object',
  required: ['name', 'pass'],
  properties: {
    name: { type: 'string' }, pass: { type: 'boolean' },
    issuesFound: { type: 'array', items: { type: 'string' } },
    issuesFixed: { type: 'array', items: { type: 'string' } },
    renders: { type: 'boolean' }, notes: { type: 'string' },
  },
}

const results = await pipeline(
  ITEMS,
  (c) => agent(
`You are extracting ONE component from a monolithic prototype into an isolated, reusable RAW PARTIAL for a component library. Quality and isolation matter more than speed.

COMPONENT
  name:     ${c.name}
  category: ${c.cat}
  source CSS class(es): ${c.classes}
  what it is: ${c.note}

STEPS
1. Read the conventions contract IN FULL: ${CONV}  — follow it exactly (folder layout, oo-* scoping, var() tokens only, meta.json schema, available shared globals, no monolith globals).
2. Mine the source monolith ${MONO} for this component:
   - grep for each source class to collect EVERY relevant CSS rule (base rule + modifiers + nested children + :hover/.on states + any @keyframes it uses).
   - find a real markup example in the HTML body (lines ~588-885) to learn the structure.
   - find any JS handler that drives it (lines ~886-1848) if it is interactive.
3. Create folder ${ROOT}${c.cat}/${c.name}/ and write these files (absolute paths, Write tool):
   - ${c.name}.css : ONLY this component's styles, every rule scoped under a root class .oo-${c.name} (or a documented shorter rootClass if more natural, e.g. .oo-btn — state it in meta.rootClass). Begin with the header comment from the conventions. Use var(--token) for ALL colors/spacing — never hardcode palette hex. ACTIVELY REFINE: add :hover, :focus-visible (or rely on base ring), and a disabled treatment; use --radius/--space-*/--transition tokens; tidy/dedupe.
   - ${c.name}.html : a bare markup fragment (no html/head/body, NO inline <script>) showing 2-4 representative variants/states, each preceded by an HTML comment like <!-- variant: ghost -->. Use semantic elements + ARIA (<button>, aria-pressed, aria-label). Inline small SVGs for any icons.
   - ${c.name}.js : ONLY if genuinely interactive (e.g. a selectable tab/pill group toggling an active class). Use document-level event delegation, bound once and guarded (e.g. window.__oo_${c.name.replace(/[^a-z0-9]/gi, '_')}). NEVER reference monolith globals (WIDGETS, AI_INSIGHTS, META, #wgrid, etc.). If not interactive, do not create this file.
   - meta.json : exactly the schema in the conventions. usedIn = the dashboard surfaces/flows where this appears. demoHeight = a sensible px stage height for the gallery card.
4. Self-check: confirm the CSS has no raw palette hex, classes are scoped, and the html uses only classes your css defines.

Return the metadata object (this is data, not a message).`,
    { label: `extract:${c.name}`, phase: 'Extract', schema: META_SCHEMA }
  ),
  (prev, c) => {
    if (!prev || !prev.wrote) return null
    return agent(
`You are the QUALITY GATE for one extracted component partial. Be adversarial: assume there are issues and fix them in place.

FILES to inspect (read all that exist):
  ${ROOT}${c.cat}/${c.name}/${c.name}.css
  ${ROOT}${c.cat}/${c.name}/${c.name}.html
  ${ROOT}${c.cat}/${c.name}/${c.name}.js   (may not exist)
  ${ROOT}${c.cat}/${c.name}/meta.json
Conventions contract: ${CONV}

CHECK and FIX (edit the files directly to fix any failure):
  1. Isolation: every CSS rule is scoped under the component root class — no bare element selectors that leak (e.g. button{...} or svg{...} unscoped). Fix by scoping.
  2. Tokens: NO hardcoded palette hex in the CSS (search for '#'); all colors use var(--*). Geometry hex inside SVG path data in the HTML is allowed. Fix violations by mapping to the nearest token.
  3. No monolith coupling: the .js (if present) must not reference WIDGETS/AI_INSIGHTS/META/renderCanvas or hard app DOM ids. Fix by rewriting to delegation/self-contained.
  4. A11y: interactive elements are real <button>/controls with aria where appropriate; focus state exists.
  5. Markup validity: ${c.name}.html only uses classes defined in ${c.name}.css; variants are comment-labeled.
  6. meta.json parses and matches the schema; usedIn/variants are filled sensibly.
  7. Sanity render: confirm the fragment + css would display (sized, visible colors on dark bg).

Return your verdict. List issuesFound and what you issuesFixed.`,
      { label: `verify:${c.name}`, phase: 'Verify', schema: VERDICT_SCHEMA }
    ).then(v => ({ name: c.name, meta: prev, verdict: v }))
  }
)

const done = results.filter(Boolean)
const passed = done.filter(r => r.verdict && r.verdict.pass).length
log(`Waves [${ACTIVE.join(', ')}]: ${done.length}/${ITEMS.length} components written, ${passed} passed verification`)
return done.map(r => ({ name: r.name, title: r.meta && r.meta.title, usedIn: r.meta && r.meta.usedIn, pass: r.verdict && r.verdict.pass, issues: r.verdict && r.verdict.issuesFound }))
