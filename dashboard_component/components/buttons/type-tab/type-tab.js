/* type-tab — single-select widget-type tab row.
   Document-level delegation, bound once and guarded. Clicking (or pressing a
   tab with Enter/Space, handled natively by <button>) makes it the active
   tab within its row and clears aria-pressed on its siblings. Left/Right
   arrows move focus between enabled tabs in the same row. */
(function () {
  if (window.__oo_type_tab) return;
  window.__oo_type_tab = true;

  var ROW = '.oo-type-tab';
  var TAB = '.oo-type-tab__tab';

  function isDisabled(tab) {
    return tab.disabled || tab.classList.contains('is-disabled');
  }

  function select(tab) {
    var row = tab.closest(ROW);
    if (!row) return;
    row.querySelectorAll(TAB).forEach(function (t) {
      t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var tab = e.target.closest(TAB);
    if (!tab || isDisabled(tab) || !tab.closest(ROW)) return;
    select(tab);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var tab = e.target.closest(TAB);
    if (!tab) return;
    var row = tab.closest(ROW);
    if (!row) return;
    var tabs = Array.prototype.filter.call(
      row.querySelectorAll(TAB),
      function (t) { return !isDisabled(t); }
    );
    var i = tabs.indexOf(tab);
    if (i < 0) return;
    var next = e.key === 'ArrowRight' ? tabs[i + 1] : tabs[i - 1];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  });
})();
