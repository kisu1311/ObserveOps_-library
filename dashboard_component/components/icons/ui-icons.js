/* ════════════════════════════════════════════════════════════════════════
   icons · ui-icons — common inline-SVG glyphs shared across atoms & surfaces
   OO_ICONS[name] -> svg string   |   uiIcon(name) -> svg string (or '' if absent)
   SPARK is the teal/purple AI "sparkle" mark (kept as its own export too).
   Keys: spark caret lock star plus search bell chevron-down close maximize image more
   All use currentColor; sizing is controlled by the consuming component's CSS.
   Dependencies: none.  Exposed as globals + module export.
   ════════════════════════════════════════════════════════════════════════ */
const SPARK = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.5L19 9l-5.3 1.5L12 16l-1.7-5.5L5 9l5.3-1.5z"/><path d="M18.5 13l.85 2.6 2.65.9-2.65.9-.85 2.6-.85-2.6-2.65-.9 2.65-.9z"/></svg>`;
const OO_ICONS = {
  spark: SPARK,
  caret:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 6 6 6-6 6"/></svg>`,
  lock:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
  star:         `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7-6.6-3.6L6.3 21l1.3-7-5-4.8 7-.9z"/></svg>`,
  plus:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  search:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  bell:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
  'chevron-down': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`,
  close:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  maximize:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  image:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>`,
  more:         `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
  refresh:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/></svg>`
};
function uiIcon(name) { return OO_ICONS[name] || ''; }
if (typeof module !== 'undefined' && module.exports) module.exports = { SPARK, OO_ICONS, uiIcon };
