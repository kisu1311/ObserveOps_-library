/* menu-item — roving keyboard focus for an accessible action menu.
   One guarded, document-level keydown listener. Within a [role="menu"] (or any
   .oo-menu) the ArrowDown/ArrowUp keys move focus between enabled items (wrapping
   at the ends) and Home/End jump to the first/last. Disabled items and separators
   are skipped. Items still fire their own action on click/Enter as native
   <button>s — this file never invokes actions and references no monolith globals. */
(function () {
  if (window.__oo_menu_item) return;
  window.__oo_menu_item = true;

  function enabledItems(menu) {
    return Array.prototype.filter.call(
      menu.querySelectorAll('.oo-menu__item'),
      function (el) {
        return !el.disabled &&
               !el.classList.contains('is-disabled') &&
               el.getAttribute('aria-disabled') !== 'true';
      });
  }

  document.addEventListener('keydown', function (e) {
    var cur = e.target.closest && e.target.closest('.oo-menu__item');
    if (!cur) return;
    var menu = cur.closest('[role="menu"], .oo-menu');
    if (!menu) return;

    var list = enabledItems(menu);
    var i = list.indexOf(cur);
    if (i < 0) return;

    var next = null;
    switch (e.key) {
      case 'ArrowDown': next = list[(i + 1) % list.length]; break;
      case 'ArrowUp':   next = list[(i - 1 + list.length) % list.length]; break;
      case 'Home':      next = list[0]; break;
      case 'End':       next = list[list.length - 1]; break;
      default: return;
    }
    e.preventDefault();
    if (next) next.focus();
  });
})();
