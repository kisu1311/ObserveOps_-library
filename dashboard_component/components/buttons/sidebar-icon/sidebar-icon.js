/* sidebar-icon · single-select nav behaviour.
   Clicking an icon button makes it the sole active item within its rail
   (.oo-sidebar-icon-rail). Self-contained: document-level delegation, bound
   once, no monolith globals. Standalone buttons (outside a rail) are ignored. */
(function () {
  if (window.__oo_sidebar_icon) return;
  window.__oo_sidebar_icon = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.oo-sidebar-icon');
    if (!btn) return;
    if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;

    var rail = btn.closest('.oo-sidebar-icon-rail');
    if (!rail) return; // no rail context → nothing to single-select against

    rail.querySelectorAll('.oo-sidebar-icon').forEach(function (b) {
      var active = b === btn;
      b.classList.toggle('is-active', active);
      if (active) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  });
})();
