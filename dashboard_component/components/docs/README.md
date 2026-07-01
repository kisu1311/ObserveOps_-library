# ObserveOps — Dashboard Module Component Library

Isolated, reusable **raw partials** for the Motadata ObserveOps **Dashboard module**, decomposed from the
`dashboard-module.html` prototype and rebuilt on the dark + teal design tokens.
**82 components across 6 categories.** Part of the AIOps component library (sibling:
`alerts_component/components/`).

## Start here

- **Browse the gallery:** open `../index.html` (built by `node ../build-gallery.mjs`).
- **Architecture & method:** [architecture.md](architecture.md)
- **Color palette & tokens:** [color-palette.md](color-palette.md)
- **Usage matrix (when/which component is used):** [component-usage.md](component-usage.md)
- **Per-partial contract:** [../CONVENTIONS.md](../CONVENTIONS.md)

## Using a component

Each component is a folder under `components/<category>/<name>/`:
- `<name>.css` — scoped styles (`.oo-<name>` root), colors via `var(--token)`.
- `<name>.html` — bare markup fragment (variants comment-labelled; widgets use `data-widget` mounts).
- `<name>.js` — optional behaviour (self-contained, no monolith globals).
- `meta.json` — metadata (variants, states, usedIn, deps, tags).

Include `tokens.css` + `base.css` once. For **widgets**, also include `utils/*.js`, the widget's renderer
`js`, and `widgets/auto-mount.js`; drop a `<div data-widget="<type>" data-seed="7">` and it renders.

## Categories

`buttons` · `fields` · `items` · `tiles` · `widgets` · `planes`

## Source

Decomposed from `dashboard_component/dashboard-module.html` (faithful repro of live
`172.16.9.243/dashboard`, build 8.2.5). The source prototype is preserved untouched.
