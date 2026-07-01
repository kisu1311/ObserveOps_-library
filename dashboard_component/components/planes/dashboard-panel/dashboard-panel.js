/* dashboard-panel · tab + tree interactions
   Document-level delegation, bound once and guarded. Self-contained: no monolith
   globals (WIDGETS / META / #wgrid …) and no element ids. Handles:
     • segmented Dashboard / NOC tab selection (aria-selected, scoped to its tablist)
     • expand / collapse of category nodes (row aria-expanded; CSS reveals children)
     • dashboard leaf selection (aria-selected, scoped to its panel)
     • favourite-star toggling (aria-pressed; stops bubbling so it never selects) */
(function () {
  if (window.__oo_dashboard_panel) return;
  window.__oo_dashboard_panel = true;

  document.addEventListener('click', function (e) {
    // favourite star — handle first and stop, so it doesn't also select the leaf
    var star = e.target.closest('.oo-dashboard-panel__star');
    if (star) {
      e.stopPropagation();
      var pressed = star.getAttribute('aria-pressed') === 'true';
      star.setAttribute('aria-pressed', String(!pressed));
      return;
    }

    // segmented Dashboard / NOC tab
    var tab = e.target.closest('.oo-dashboard-panel__tab');
    if (tab && !tab.disabled) {
      var list = tab.closest('.oo-dashboard-panel__tabs');
      if (list) {
        list.querySelectorAll('.oo-dashboard-panel__tab').forEach(function (t) {
          t.setAttribute('aria-selected', String(t === tab));
        });
      }
      return;
    }

    // expand / collapse a category node
    var row = e.target.closest('.oo-dashboard-panel__row');
    if (row) {
      var open = row.getAttribute('aria-expanded') === 'true';
      row.setAttribute('aria-expanded', String(!open));
      return;
    }

    // select a dashboard leaf (single selection within the panel)
    var leaf = e.target.closest('.oo-dashboard-panel__leaf');
    if (leaf) {
      var panel = leaf.closest('.oo-dashboard-panel');
      if (panel) {
        panel.querySelectorAll('.oo-dashboard-panel__leaf').forEach(function (l) {
          l.setAttribute('aria-selected', String(l === leaf));
        });
      }
    }
  });

  // keyboard: Enter / Space activates a focused leaf (it is a div, not a button)
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var leaf = e.target.closest && e.target.closest('.oo-dashboard-panel__leaf');
    if (!leaf || e.target.closest('.oo-dashboard-panel__star')) return;
    e.preventDefault();
    leaf.click();
  });
})();
