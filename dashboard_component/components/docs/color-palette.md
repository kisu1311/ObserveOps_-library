# Dashboard Module — Color Palette & Design Tokens

The dark + teal token system used across the Dashboard module library. Every component references these
via `var(--token)`; none hardcode palette hex. Source of truth: `../tokens.css`.
Page background `#07101f` matches the Alerts module library, so the two are visually compatible.

## Surfaces

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#07101f` | App background (deepest) |
| `--nav` | `#0c1a2e` | Topbar / sidebar / banners |
| `--panel` | `#0e2036` | Drawers / panels |
| `--card` | `#11223a` | Cards / widgets / inputs |
| `--card2` | `#0f1e33` | Nested / alt card |
| `--border` | `#18304a` | Hairline dividers |
| `--border2` | `#1e3a56` | Stronger borders / control outlines |

## Text

| Token | Hex | Use |
|---|---|---|
| `--text` | `#c2d4e8` | Primary text |
| `--muted` | `#5272a0` | Secondary / labels |
| `--dim` | `#2c4460` | Disabled / faint |

## Accent (teal = primary brand)

| Token | Value | Use |
|---|---|---|
| `--teal` | `#14b8a6` | Primary accent / CTAs |
| `--teal-glow` | `rgba(20,184,166,.16)` | Active glow / tints |
| `--teal2` | `rgba(20,184,166,.12)` | Subtle teal wash |
| `--on-accent` | `#fff` | Text/glyphs on solid teal/purple/gradient fills |

## Severity / status

| Token | Hex | + tint |
|---|---|---|
| `--red` | `#e05050` | `--red-bg` |
| `--orange` | `#f47c22` | `--orange-bg` |
| `--yellow` | `#f5c400` | `--yellow-bg` |
| `--green` | `#2cc76a` | `--green-bg` |
| `--blue` | `#008cff` | `--blue-bg` |
| `--purple` | `#8c5bd8` / `--purple2 #b388e0` | `--purple-bg` |

## Refinement tokens (additive)

`--radius(-sm/-lg/-pill)`, `--space-1..4`, `--ring` (keyboard focus), `--transition`, `--shadow-pop`,
`--font-sans` (Inter), `--font-mono` (JetBrains Mono). Added for consistent spacing, focus rings and motion
across the refined partials.

## Widget data-viz colors

Chart/widget renderers use the named palette `SVAR` (`utils/colors.js`): teal `#14b8a6`, blue `#008cff`,
purple `#8c5bd8`, orange `#f47c22`, green `#2cc76a`, red `#e05050`, yellow `#f5c400`; and the 5-step
severity gradient `SEVS` (green→red) for heatmaps. `sevColor(level)` maps a severity key to a CSS var.
