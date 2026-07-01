/* add-widget-tab · underline tab-group behaviour
   Selecting a tab (click or Arrow/Home/End keys) moves the teal underline and
   `aria-selected="true"` to it, demotes its siblings, and maintains a roving
   tabindex so the group is a single tab stop. Self-contained: document-level
   delegation, bound once, no monolith globals.
   Consumers listen for the bubbling 'oo-tab-change' event to swap panels:
     group.addEventListener('oo-tab-change', e => show(e.detail.value)); */
(function () {
  if (window.__oo_add_widget_tab) return;
  window.__oo_add_widget_tab = true;

  function tabsIn(group) {
    return Array.prototype.slice.call(group.querySelectorAll('.oo-aw-tab'));
  }

  function isDisabled(tab) {
    return tab.disabled || tab.classList.contains('is-disabled');
  }

  function select(group, tab) {
    if (!tab || isDisabled(tab)) return;
    tabsIn(group).forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    group.dispatchEvent(new CustomEvent('oo-tab-change', {
      bubbles: true,
      detail: { value: tab.getAttribute('data-tab') || tab.textContent.trim(), tab: tab }
    }));
  }

  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.oo-aw-tab');
    if (!tab) return;
    var group = tab.closest('.oo-aw-tabs');
    if (!group || isDisabled(tab)) return;
    select(group, tab);
  });

  document.addEventListener('keydown', function (e) {
    var tab = e.target.closest && e.target.closest('.oo-aw-tab');
    if (!tab) return;
    var group = tab.closest('.oo-aw-tabs');
    if (!group) return;

    var enabled = tabsIn(group).filter(function (t) { return !isDisabled(t); });
    if (!enabled.length) return;
    var i = enabled.indexOf(tab);
    var next = null;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': next = enabled[(i + 1) % enabled.length]; break;
      case 'ArrowLeft':
      case 'ArrowUp': next = enabled[(i - 1 + enabled.length) % enabled.length]; break;
      case 'Home': next = enabled[0]; break;
      case 'End': next = enabled[enabled.length - 1]; break;
      default: return;
    }

    e.preventDefault();
    select(group, next);
    next.focus();
  });
})();
