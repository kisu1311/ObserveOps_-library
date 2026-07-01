/* popup-menu · planes — anchored open/close behaviour.
   Self-contained, document-level delegation, bound once. No monolith globals.
   A `[data-oo-popup-trigger]` button toggles the `.oo-popup-menu--floating`
   inside its `.oo-popup-menu-host`; outside-click, Esc, and choosing a
   (non-disabled) `.oo-menu__item` all close any open menus. */
(function () {
  if (window.__oo_popup_menu) return;
  window.__oo_popup_menu = true;

  function closeAll(except) {
    document.querySelectorAll('.oo-popup-menu--floating.is-open').forEach(function (menu) {
      if (menu === except) return;
      menu.classList.remove('is-open');
      var host = menu.closest('.oo-popup-menu-host');
      var trig = host && host.querySelector('[data-oo-popup-trigger]');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var node = e.target;
    if (!(node instanceof Element)) { closeAll(); return; }

    var trig = node.closest('[data-oo-popup-trigger]');
    if (trig) {
      e.preventDefault();
      if (trig.disabled || trig.getAttribute('aria-disabled') === 'true') return;
      var host = trig.closest('.oo-popup-menu-host');
      var menu = host && host.querySelector('.oo-popup-menu--floating');
      if (!menu) return;
      var willOpen = !menu.classList.contains('is-open');
      closeAll(willOpen ? menu : null);
      menu.classList.toggle('is-open', willOpen);
      trig.setAttribute('aria-expanded', String(willOpen));
      return;
    }

    var item = node.closest('.oo-popup-menu--floating .oo-menu__item');
    if (item && !item.disabled && item.getAttribute('aria-disabled') !== 'true') {
      closeAll();
      return;
    }

    // click anywhere outside an open floating menu
    if (!node.closest('.oo-popup-menu--floating')) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();
