/* ════════════════════════════════════════════════════════════════════════
   grid · widgets renderer — OOW.grid (tabular status table)
   Registers a pure, deterministic renderer on the global OOW registry.
   auto-mount.js scans [data-widget="grid"] and calls OOW.grid(el, opts),
   where opts are the coerced data-* attributes:
       data-seed : number  PRNG seed (deterministic rows + status)   default 41
       data-rows : number  number of rows to render (1..8)           default 8
   Output is a scrollable <table> (Monitor / Traffic / Interface / Status):
   each row leads with a status dot + monitor name and ends with an up/down
   chip; status, dot colour and chip are derived from the seed.
   Dependencies (globals): rng(), esc(). Styling lives in grid.css.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
window.OOW.grid = function (mountEl, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? +opts.seed : 41;
  var n = opts.rows != null ? Math.max(1, Math.min(8, +opts.rows)) : 8;
  var r = rng(seed);
  // disabled / no-data mounts freeze interaction: drop keyboard focusability too
  // (CSS pointer-events:none only blocks the mouse), matching the dimmed visual.
  var disabled = mountEl.getAttribute('aria-disabled') === 'true' || mountEl.classList.contains('is-disabled');

  var mons = ['fg_firewall.mindarray', 'cisco_core.local', 'ipv6R6.test.com', 'mpls1.mpls1.com', 'PA-3020x', 'R-1.motadata', 'zimbra-server', 'worker2'];
  var ifs  = ['l2t.root-36', 'To_PaloAlto-38', 'ssl.root-16', 'naf.root-35', 'IPsec-Cisco-41', 'Gi1/0/12-19', 'Et2/1-4', 'eth1/11-13'];

  var rows = '';
  for (var i = 0; i < n; i++) {
    var up = r() > 0.3;
    var traffic = (r() * 50).toFixed(1);
    rows += '<tr' + (disabled ? '' : ' tabindex="0"') + '>'
      + '<th scope="row">'
        + '<span class="oo-grid__dot ' + (up ? 'oo-grid__dot--up' : 'oo-grid__dot--down') + '" aria-hidden="true"></span>'
        + esc(mons[i]) + '</th>'
      + '<td class="oo-grid__num">' + traffic + ' Kbps</td>'
      + '<td>' + esc(ifs[i]) + '</td>'
      + '<td><span class="oo-grid__chip ' + (up ? 'oo-grid__chip--up' : 'oo-grid__chip--down') + '">'
        + (up ? 'Up' : 'Down') + '</span></td>'
      + '</tr>';
  }

  mountEl.classList.add('oo-grid');
  if (!mountEl.getAttribute('role')) mountEl.setAttribute('role', 'region');
  if (!mountEl.getAttribute('aria-label')) mountEl.setAttribute('aria-label', 'Monitor status');
  mountEl.innerHTML =
    '<table class="oo-grid__table">'
    + '<thead><tr>'
      + '<th scope="col">Monitor</th>'
      + '<th scope="col">Traffic</th>'
      + '<th scope="col">Interface</th>'
      + '<th scope="col">Status</th>'
    + '</tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '</table>';
};
