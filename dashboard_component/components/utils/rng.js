/* ════════════════════════════════════════════════════════════════════════
   util · rng — seeded pseudo-random generator (Lehmer / MINSTD)
   Deterministic so widgets render identically every load (no real data source).
   Usage:  const r = rng(7);  r() -> 0..1
   Dependencies: none.  Exposed as global rng() and module export.
   ════════════════════════════════════════════════════════════════════════ */
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = s * 16807 % 2147483647) / 2147483647;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { rng };
