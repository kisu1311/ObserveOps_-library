/* ════════════════════════════════════════════════════════════════════════
   util · series — deterministic random-walk data series for chart mocks
   series(seed, n, lo, hi) -> number[] of length n bounded to [lo,hi]
   Dependencies: rng.js (global rng).  Exposed as global series() + module export.
   ════════════════════════════════════════════════════════════════════════ */
function series(seed, n, lo, hi) {
  const r = (typeof rng === 'function' ? rng : require('./rng').rng)(seed);
  const a = [];
  let v = (lo + hi) / 2;
  for (let i = 0; i < n; i++) {
    v += (r() - .5) * (hi - lo) * .5;
    v = Math.max(lo, Math.min(hi, v));
    a.push(v);
  }
  return a;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { series };
