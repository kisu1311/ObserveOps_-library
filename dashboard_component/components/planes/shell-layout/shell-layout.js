/* shell-layout · planes — dashboard-panel toggle.
   Document-level delegation, bound once. Clicking a [data-oo-shell-toggle]
   button flips the `oo-shell-layout--panel-open` modifier on its closest shell
   and syncs aria-expanded + the button's accessible label. Self-contained: no
   monolith globals, no element ids. */
(function () {
  if (window.__oo_shell_layout) return;
  window.__oo_shell_layout = true;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-oo-shell-toggle]');
    if (!btn) return;

    var shell = btn.closest('.oo-shell-layout');
    if (!shell) return;

    var open = shell.classList.toggle('oo-shell-layout--panel-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Hide dashboard panel' : 'Show dashboard panel');

    var panel = shell.querySelector('.oo-shell-layout__panel');
    if (panel) {
      if (open) panel.removeAttribute('aria-hidden');
      else panel.setAttribute('aria-hidden', 'true');
    }
  });
})();
