/* ════════════════════════════════════════════════════════════════════════
   widgets · auto-mount — declarative renderer bootstrap (collision-free)
   Each widget partial registers a pure renderer on the global OOW registry:
       window.OOW = window.OOW || {};
       OOW.chart = function (mountEl, opts) { mountEl.innerHTML = '<svg…>'; };
   Markup just declares a mount; no inline scripts, no IDs to collide:
       <div data-widget="chart" data-seed="7" data-style="area"
            style="width:320px;height:180px"></div>
   ooMountAll() scans [data-widget] and calls OOW[name](el, {…data-* as opts}).
   data-* numeric strings are coerced to numbers; runs once per element.
   Dependencies: the individual widget renderer files (which populate OOW).
   ════════════════════════════════════════════════════════════════════════ */
window.OOW = window.OOW || {};
function ooMountAll(root) {
  (root || document).querySelectorAll('[data-widget]').forEach(el => {
    if (el.dataset.mounted) return;
    const fn = window.OOW[el.dataset.widget];
    if (typeof fn !== 'function') return;
    const opts = {};
    for (const k in el.dataset) {
      if (k === 'widget' || k === 'mounted') continue;
      const v = el.dataset[k];
      opts[k] = (v !== '' && !isNaN(v)) ? +v : (v === 'true' ? true : v === 'false' ? false : v);
    }
    try { fn(el, opts); } catch (e) { console.error('OOW mount failed:', el.dataset.widget, e); }
    el.dataset.mounted = '1';
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => ooMountAll());
else ooMountAll();
