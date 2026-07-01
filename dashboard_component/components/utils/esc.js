/* ════════════════════════════════════════════════════════════════════════
   util · esc — minimal HTML escaper for safely interpolating text into markup
   esc(s) -> string with & < > replaced by entities
   Dependencies: none.  Exposed as global esc() + module export.
   ════════════════════════════════════════════════════════════════════════ */
function esc(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
if (typeof module !== 'undefined' && module.exports) module.exports = { esc };
