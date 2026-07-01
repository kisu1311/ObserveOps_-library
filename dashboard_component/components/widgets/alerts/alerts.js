/* ════════════════════════════════════════════════════════════════════════
   alerts · widgets renderer — OOW.alerts (active-alerts table)
   Registers a pure, deterministic renderer on the global OOW registry.
   auto-mount.js scans [data-widget="alerts"] and calls OOW.alerts(el, opts),
   where opts are the coerced data-* attributes:
       data-seed : number  PRNG seed (deterministic rows + severities)  default 43
   Output is a sticky-header <table>: each row is a severity badge
   (Critical / Warning / Info / Clear) + alert message + source IP + mono
   "Xm ago" timestamp. The mount itself is the scroll region (overflow:auto in
   alerts.css) and is made keyboard-focusable so it can be scrolled.
   Dependencies (globals): rng(), esc(). Styling lives in alerts.css.
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
window.OOW.alerts = function (mountEl, opts) {
  opts = opts || {};
  var seed = opts.seed != null ? +opts.seed : 43;
  var r = rng(seed);

  var SEVS = [['crit', 'Critical'], ['warn', 'Warning'], ['info', 'Info'], ['ok', 'Clear']];
  var MSGS = ['CPU saturation > 90%', 'Disk usage breach', 'Interface flapping', 'Memory pressure',
              'Service down', 'High latency', 'Packet loss', 'Cert expiring'];

  var rows = MSGS.map(function (m) {
    var s = SEVS[Math.floor(r() * 4)];
    var ip = '172.16.' + (r() * 20).toFixed(0) + '.' + (r() * 250).toFixed(0);
    var ago = (r() * 59).toFixed(0) + 'm ago';
    return '<tr class="oo-alerts__row">'
      + '<td><span class="oo-alerts__sev oo-alerts__sev--' + s[0] + '">' + s[1] + '</span></td>'
      + '<td class="oo-alerts__msg">' + esc(m) + '</td>'
      + '<td class="oo-alerts__ip">' + esc(ip) + '</td>'
      + '<td class="oo-alerts__time">' + esc(ago) + '</td>'
      + '</tr>';
  }).join('');

  mountEl.classList.add('oo-alerts');
  if (!mountEl.getAttribute('role')) mountEl.setAttribute('role', 'region');
  if (!mountEl.getAttribute('aria-label')) mountEl.setAttribute('aria-label', 'Active alerts');
  if (!mountEl.hasAttribute('tabindex')) mountEl.setAttribute('tabindex', '0');

  mountEl.innerHTML =
    '<table class="oo-alerts__table">'
    + '<thead><tr>'
    + '<th scope="col">Severity</th>'
    + '<th scope="col">Alert</th>'
    + '<th scope="col">Source IP</th>'
    + '<th scope="col">Time</th>'
    + '</tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '</table>';
};
