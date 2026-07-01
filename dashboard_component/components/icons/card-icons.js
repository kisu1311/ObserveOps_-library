/* ════════════════════════════════════════════════════════════════════════
   icons · card-icons — widget-type glyphs used on type-tabs and template cards
   Refined: decoupled from the monolith's META lookup into a plain name→SVG map.
   OO_CARD_ICONS[name] -> svg string   |   cardIcon(name) -> svg (falls back to a
   raw path string if `name` is itself an SVG path "d" value).
   Keys: bars gauge grid pie num ngrid sankey hex tree pin cone spark
   All icons use stroke="currentColor" so they inherit text color.
   Dependencies: none.  Exposed as globals + module export.
   ════════════════════════════════════════════════════════════════════════ */
const OO_CARD_ICONS = {
  bars:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h12M3 12h8M3 18h16"/></svg>`,
  gauge:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-4"/></svg>`,
  grid:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 4v16"/></svg>`,
  pie:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M12 3v9h9"/></svg>`,
  num:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8v8M5 8h4M15 8h4l-3 4h.5a2 2 0 1 1-2 2"/></svg>`,
  ngrid:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="8" height="6" rx="1"/><rect x="13" y="4" width="8" height="6" rx="1"/><rect x="3" y="14" width="8" height="6" rx="1"/><rect x="13" y="14" width="8" height="6" rx="1"/></svg>`,
  sankey: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h3v6H3zM3 13h3v6H3zM18 7h3v4h-3zM18 14h3v4h-3z"/><path d="M6 8c6 0 6-1 12 1M6 16c6 0 6 0 12-1" stroke-width="1.4"/></svg>`,
  hex:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3 9 3 10.5 5.6 9 8.2 6 8.2 4.5 5.6zM13 3 16 3 17.5 5.6 16 8.2 13 8.2 11.5 5.6zM9.5 9 12.5 9 14 11.6 12.5 14.2 9.5 14.2 8 11.6z"/></svg>`,
  tree:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="11" height="16" rx="1"/><rect x="16" y="4" width="5" height="7" rx="1"/><rect x="16" y="13" width="5" height="7" rx="1"/></svg>`,
  pin:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  cone:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12h6l6-6v12l-6-6"/><path d="M15 6h6M15 18h6" stroke-dasharray="2 2"/></svg>`,
  spark:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.5L19 9l-5.3 1.5L12 16l-1.7-5.5L5 9l5.3-1.5z"/><path d="M18.5 13l.85 2.6 2.65.9-2.65.9-.85 2.6-.85-2.6-2.65-.9 2.65-.9z"/></svg>`
};
function cardIcon(name) {
  if (OO_CARD_ICONS[name]) return OO_CARD_ICONS[name];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${name}"/></svg>`;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { OO_CARD_ICONS, cardIcon };
