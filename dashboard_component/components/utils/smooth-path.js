/* ════════════════════════════════════════════════════════════════════════
   util · smoothPath — build a smooth SVG cubic-bezier path from [[x,y],…] points
   smoothPath(pts) -> SVG path "d" string (catmull-ish midpoint control points)
   Dependencies: none.  Exposed as global smoothPath() + module export.
   ════════════════════════════════════════════════════════════════════════ */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
}
if (typeof module !== 'undefined' && module.exports) module.exports = { smoothPath };
