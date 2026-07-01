/* ════════════════════════════════════════════════════════════════════════
   widgets · query — "Query Value" single-stat renderer (OOW.query)
   Big numeric KPI + muted caption + signed % delta (up green / down red) +
   sparkline. Pure & deterministic from opts.seed; registers on the global OOW
   registry so auto-mount.js can hydrate any
       <div data-widget="query" data-seed="98328" data-accent="blue"
            data-label="Total Requests / min" style="width:280px;height:200px">
   Options (all from data-*):
       seed: int            random-walk seed (value, spark and delta derive from it)
       accent: teal|blue|purple|orange|green   sparkline colour (default teal)
       label: string        metric caption (default "Total Requests / min")
       interactive: bool    make the tile a focusable drill-down target
   Dependencies: utils series(), smoothPath(), esc(). No monolith globals.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
window.OOW.query = function (mountEl, opts) {
  opts = opts || {};
  const seed = opts.seed != null ? +opts.seed : 3;
  const accent = opts.accent || 'teal';
  const label = opts.label || 'Total Requests / min';
  const interactive = opts.interactive === true || opts.interactive === 'true';

  const value = Math.round(series(seed, 1, 100, 9000)[0]);
  const spark = series(seed + 1, 20, 20, 80);
  const delta = +(series(seed + 2, 1, -15, 22)[0]).toFixed(1);
  const up = delta >= 0;

  const W = 240, H = 60;
  const pts = spark.map((x, i) => [(i * W) / (spark.length - 1), H - (x / 100) * H]);

  const cls = ['oo-query', 'oo-query--' + accent];
  if (interactive) cls.push('oo-query--interactive');
  const rootAttrs = interactive ? ' tabindex="0" role="button"' : '';

  mountEl.innerHTML =
    `<div class="${cls.join(' ')}"${rootAttrs}>` +
      `<div class="oo-query__value">${value.toLocaleString()}</div>` +
      `<div class="oo-query__label">${esc(label)}</div>` +
      `<div class="oo-query__delta ${up ? 'is-up' : 'is-down'}" ` +
        `aria-label="${up ? 'up' : 'down'} ${Math.abs(delta)} percent versus previous period">` +
        `<span class="oo-query__arrow" aria-hidden="true">${up ? '▲' : '▼'}</span>${Math.abs(delta)}%` +
      `</div>` +
      `<svg class="oo-query__spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" ` +
        `aria-hidden="true" focusable="false">` +
        `<path d="${smoothPath(pts)}" fill="none" stroke="currentColor" ` +
          `stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `</svg>` +
    `</div>`;
};
