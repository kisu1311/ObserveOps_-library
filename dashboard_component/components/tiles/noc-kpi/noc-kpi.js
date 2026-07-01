/* noc-kpi — selectable NOC KPI status filter.
   When the counters are rendered as <button>s, a row acts as a single-select
   filter: clicking a tile selects it (aria-pressed=true) and clears its
   siblings inside the same .oo-noc-kpi-row; clicking the selected tile again
   clears the selection. Pure presentation toggle — it emits no events and
   references no monolith globals. Static <div> counters are ignored. */
if (!window.__oo_noc_kpi) {
  window.__oo_noc_kpi = true;
  document.addEventListener('click', function (e) {
    var kpi = e.target.closest('button.oo-noc-kpi');
    if (!kpi || kpi.disabled) return;
    var row = kpi.closest('.oo-noc-kpi-row');
    var wasOn = kpi.getAttribute('aria-pressed') === 'true';
    if (row) {
      row.querySelectorAll('button.oo-noc-kpi[aria-pressed="true"]').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
      });
    }
    kpi.setAttribute('aria-pressed', wasOn ? 'false' : 'true');
  });
}
