/* ai-copilot-drawer · behaviour
   Self-contained, no monolith globals. Document-level delegation bound once.
   - Tab strip: clicking a [data-oo-tab] sets aria-selected on the tabs in that
     drawer and toggles [hidden] on the matching [data-oo-panel] tabpanel.
   - Close button: hides a slide-in drawer (the `--drawer` modifier) by dropping
     its open class; a docked drawer is left untouched. */
(function () {
  if (window.__oo_ai_copilot_drawer) return;
  window.__oo_ai_copilot_drawer = true;

  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.oo-ai-copilot-drawer__tab');
    if (tab && !tab.disabled) {
      var drawer = tab.closest('.oo-ai-copilot-drawer');
      if (!drawer) return;
      var name = tab.getAttribute('data-oo-tab');

      drawer.querySelectorAll('.oo-ai-copilot-drawer__tab').forEach(function (t) {
        t.setAttribute('aria-selected', String(t === tab));
      });
      drawer.querySelectorAll('[data-oo-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-oo-panel') !== name;
      });
      return;
    }

    var close = e.target.closest('.oo-ai-copilot-drawer__x');
    if (close && !close.disabled) {
      var d = close.closest('.oo-ai-copilot-drawer--drawer');
      if (d) { d.classList.remove('is-open'); d.classList.remove('open'); }
    }
  });
})();
