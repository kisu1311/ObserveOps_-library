/* add-widget-panel · panel behaviour
   Self-contained, document-delegated, bound once. Three concerns, all scoped
   to the nearest .oo-add-widget-panel so multiple panels coexist:
     1. dismiss  — the header ✕ button closes the drawer (drops .is-open/.open)
                   and emits a bubbling 'oo-panel-close' for the host to react.
     2. filter   — typing in the panel's search box shows/hides .oo-template-card
                   tiles by their data-name (falls back to the card text).
     3. tabs     — listens for the composed tab group's 'oo-tab-change' event and
                   reveals the matching [data-tab-panel], hiding its siblings.
   No monolith globals, no element ids. */
(function () {
  if (window.__oo_add_widget_panel) return;
  window.__oo_add_widget_panel = true;

  function cardName(card) {
    return (card.getAttribute('data-name') || card.textContent || '').toLowerCase();
  }

  /* 1 — dismiss */
  document.addEventListener('click', function (e) {
    var x = e.target.closest('.oo-add-widget-panel__x');
    if (!x || x.disabled) return;
    var panel = x.closest('.oo-add-widget-panel');
    if (!panel) return;
    panel.classList.remove('is-open', 'open');
    panel.dispatchEvent(new CustomEvent('oo-panel-close', { bubbles: true, detail: { panel: panel } }));
  });

  /* 2 — search filter */
  document.addEventListener('input', function (e) {
    var input = e.target.closest('.oo-add-widget-panel__search input');
    if (!input) return;
    var panel = input.closest('.oo-add-widget-panel');
    if (!panel) return;
    var q = input.value.trim().toLowerCase();
    panel.querySelectorAll('.oo-template-card').forEach(function (card) {
      card.style.display = cardName(card).indexOf(q) === -1 ? 'none' : '';
    });
  });

  /* 3 — tab → body sync (consumes the add-widget-tab group's event) */
  document.addEventListener('oo-tab-change', function (e) {
    var group = e.target;
    if (!group || !group.classList || !group.classList.contains('oo-aw-tabs')) return;
    var panel = group.closest('.oo-add-widget-panel');
    if (!panel) return;
    var value = e.detail && e.detail.value;
    panel.querySelectorAll('.oo-add-widget-panel__tabpanel').forEach(function (tp) {
      tp.hidden = tp.getAttribute('data-tab-panel') !== value;
    });
    var search = panel.querySelector('.oo-add-widget-panel__search input');
    if (search) {
      search.value = '';
      panel.querySelectorAll('.oo-template-card').forEach(function (card) { card.style.display = ''; });
    }
  });
})();
