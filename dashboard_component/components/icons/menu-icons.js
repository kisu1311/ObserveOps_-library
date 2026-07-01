/* ════════════════════════════════════════════════════════════════════════
   icons · menu-icons — action glyphs for context menus / widget "···" menus
   OO_MENU_ICONS[key] -> SVG path "d"   |   menuIcon(key) -> full svg string
   Keys: edit clone full export trash
   Dependencies: none.  Exposed as globals + module export.
   ════════════════════════════════════════════════════════════════════════ */
const OO_MENU_ICONS = {
  edit:   'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 16l-4 1 1-4z',
  clone:  'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  full:   'M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3',
  export: 'M12 3v12M8 11l4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  trash:  'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'
};
function menuIcon(k) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${OO_MENU_ICONS[k] || ''}"/></svg>`;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { OO_MENU_ICONS, menuIcon };
