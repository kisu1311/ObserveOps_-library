# Component partial conventions (agent contract)

Every extracted component is a **raw partial** living in its own folder. Follow this exactly so the
gallery builder and docs generator work and so partials stay isolated + reusable.

## Folder & files

```
components/<category>/<name>/
  <name>.css     REQUIRED  scoped styles
  <name>.html    REQUIRED  bare markup fragment (no <html>/<head>/<body>, no inline <script>)
  <name>.js      OPTIONAL  behaviour only if the component is interactive
  meta.json      REQUIRED  metadata for the gallery + docs
```

- `<category>` ∈ `buttons | fields | items | tiles | widgets | planes`.
- `<name>` is kebab-case and unique, e.g. `button-primary`, `range-slider`, `noc-tile`.

## CSS (`<name>.css`)

- Start with a header comment:
  `/* <name> · <category> · variants: … · states: … · deps: tokens.css[, …] · used-in: … */`
- **Scope every rule under a root class `.oo-<name>`** (or a shared `.oo-<short>` documented in meta) so
  styles never leak. Example root: `.oo-btn`, `.oo-toggle`, `.oo-noc-tile`.
- **Never hardcode palette hex values** — always `var(--teal)`, `var(--red)`, `var(--border)`, etc. (full
  token list below). Geometry hexes are fine only inside generated SVG data, not in CSS.
- **On-accent text/glyphs** (white text on a solid teal/purple/gradient fill) must use `var(--on-accent)` —
  do **not** write `#fff` or `white`.
- Active refinement: include `:hover`, `:focus-visible` (rely on the base ring or a custom one), and a
  `disabled`/`.is-disabled` treatment where the element can be disabled. Use `--radius`, `--space-*`,
  `--transition` tokens for consistency.

## HTML (`<name>.html`)

- A bare fragment using the `oo-*` classes. No document scaffold, **no inline `<script>`**.
- Show 2–4 representative variants/states, each preceded by an HTML comment:
  `<!-- variant: ghost -->`, `<!-- state: disabled -->`.
- Interactive controls get proper semantics/ARIA (`<button>`, `role`, `aria-pressed`, `aria-label`, etc.).
- **Widgets only:** emit a declarative mount, no IDs/inline scripts —
  `<div class="oo-w" data-widget="<type>" data-seed="7" data-style="area" style="width:320px;height:180px"></div>`

## JS (`<name>.js`, only if interactive)

- **No references to monolith globals** (`WIDGETS`, `AI_INSIGHTS`, `renderCanvas`, `META`, DOM ids like
  `#wgrid`). Components must be self-contained.
- Prefer **document-level event delegation**, bound once, guarded against double-binding:
  ```js
  if (!window.__oo_toggle) { window.__oo_toggle = true;
    document.addEventListener('click', e => { const t = e.target.closest('.oo-toggle'); if (!t) return;
      const on = t.getAttribute('aria-checked') !== 'true'; t.setAttribute('aria-checked', on); }); }
  ```
- **Widgets:** register a pure renderer on the global registry — `window.OOW = window.OOW||{};
  OOW.<type> = function (mountEl, opts) { mountEl.innerHTML = '<svg…>'; };` It must depend only on
  `utils/` globals and produce deterministic output from `opts.seed`. `auto-mount.js` calls it.

## meta.json

```json
{
  "name": "button-primary",
  "category": "buttons",
  "title": "Primary Button",
  "description": "Solid teal call-to-action for primary actions (Create, Save).",
  "rootClass": "oo-btn",
  "variants": ["solid", "with-icon", "block"],
  "states": ["default", "hover", "focus", "disabled"],
  "deps": ["tokens.css"],
  "usedIn": ["create-widget-modal", "add-widget-panel"],
  "tags": ["button", "cta", "action"],
  "demoHeight": 80
}
```
`usedIn` lists the dashboard surfaces/flows where the component appears (drives the usage matrix).
`deps` lists shared files it needs (`tokens.css` always; plus any `utils/*.js`, `icons/*.js`).

## Available shared globals (already built — do not re-create)

- **tokens.css** colors/spacing/radius/ring. **base.css** reset, fonts, scrollbars, focus ring.
- **utils:** `rng(seed)`, `series(seed,n,lo,hi)`, `esc(s)`, `smoothPath(pts)`, `sevColor(s)`,
  `SVAR`, `SEVS`, `nocSpark(seed,color)`, `aiSpark(seed,color)`.
- **icons:** `cardIcon(name)` / `OO_CARD_ICONS`, `menuIcon(key)` / `OO_MENU_ICONS`,
  `uiIcon(name)` / `OO_ICONS`, `SPARK`.

## Token reference

Surfaces `--bg --nav --panel --card --card2 --border --border2` · Text `--text --muted --dim` ·
Accent `--teal --teal-glow --teal2 --on-accent` · Severity `--red --orange --yellow --green --blue --purple --purple2`
and their `--*-bg` tints · Refinement `--radius(-sm/-lg/-pill) --space-1..4 --ring --transition --shadow-pop
--font-sans --font-mono`.

## Source

Read the relevant slice of `../dashboard-module.html` for the original CSS/HTML/JS, then **refine** it
(decouple from globals, namespace to `oo-*`, add states/ARIA) — do not copy verbatim.
