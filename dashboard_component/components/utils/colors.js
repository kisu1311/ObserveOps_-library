/* ════════════════════════════════════════════════════════════════════════
   util · colors — palette constants + severity helpers for data-viz
   SVAR    : named hex palette (for SVG fills that can't use CSS vars)
   SEVS    : 5-step severity gradient (green→red), index 0..4
   sevColor: map a severity key -> CSS var() string
             'crit'|'warn'|'ok'|'info'|else -> var(--red|--orange|--green|--blue|--purple)
   Dependencies: none.  Exposed as globals + module export.
   ════════════════════════════════════════════════════════════════════════ */
const SVAR = { teal: '#14b8a6', blue: '#008cff', purple: '#8c5bd8', orange: '#f47c22', green: '#2cc76a', red: '#e05050', yellow: '#f5c400' };
const SEVS = ['#2cc76a', '#7ec850', '#f5c400', '#f47c22', '#e05050'];
function sevColor(s) {
  return s === 'crit' ? 'var(--red)'
    : s === 'warn' ? 'var(--orange)'
    : s === 'ok' ? 'var(--green)'
    : s === 'info' ? 'var(--blue)'
    : 'var(--purple)';
}
if (typeof module !== 'undefined' && module.exports) module.exports = { SVAR, SEVS, sevColor };
