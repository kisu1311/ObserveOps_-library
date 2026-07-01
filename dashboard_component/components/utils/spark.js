/* ════════════════════════════════════════════════════════════════════════
   util · spark — tiny inline sparkline SVG generators (area + line)
   nocSpark(seed, color) -> 240×26 sparkline (NOC status tiles)
   aiSpark(seed, color)  -> full-width × 30 sparkline (AI insight cards)
   Dependencies: series.js (global series).  Exposed as globals + module export.
   ════════════════════════════════════════════════════════════════════════ */
function _spark(seed, color, w, h, lo, hi, cls, style) {
  const _series = (typeof series === 'function' ? series : require('./series').series);
  const data = _series(seed, 26, lo, hi);
  const pts = data.map((d, i) => [i / (data.length - 1) * w, h - d / 100 * h]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"${style ? ' style="' + style + '"' : ''}>`
    + `<path d="${line} L${w} ${h} L0 ${h} Z" fill="${color}" opacity=".14"/>`
    + `<path d="${line}" fill="none" stroke="${color}" stroke-width="1.6"/></svg>`;
}
function nocSpark(seed, color) { return _spark(seed, color, 240, 26, 20, 100, 'noc-spark', ''); }
function aiSpark(seed, color) { return _spark(seed, color, 320, 30, 18, 92, 'ins-spark', 'width:100%;height:30px'); }
if (typeof module !== 'undefined' && module.exports) module.exports = { nocSpark, aiSpark };
