/* sidebar · planes · single-select navigation for the icon rail.
   Clicking a sidebar-icon inside .oo-sidebar makes it the sole active item
   (.is-active + aria-current="page") within that rail. Buttons flagged
   data-no-select (e.g. Settings — an action, not a destination) and disabled
   buttons are skipped. Self-contained: one document-level delegated listener,
   guarded against double-binding, no monolith globals. */
(function () {
  if (window.__oo_sidebar) return;
  window.__oo_sidebar = true;

  var ITEM = '.oo-sidebar-icon, [data-nav-item]';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest(ITEM);
    if (!btn) return;

    var rail = btn.closest('.oo-sidebar');
    if (!rail) return;                                   // not our rail context
    if (rail.classList.contains('is-disabled')) return;  // whole rail locked
    if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
    if (btn.hasAttribute('data-no-select')) return;      // action, not a page

    rail.querySelectorAll(ITEM).forEach(function (b) {
      if (b.hasAttribute('data-no-select')) return;
      var active = b === btn;
      b.classList.toggle('is-active', active);
      if (active) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  });
})();
