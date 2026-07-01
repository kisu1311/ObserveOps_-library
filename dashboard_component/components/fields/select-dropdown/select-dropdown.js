/* select-dropdown — value trigger + options listbox.
   Document-level delegation, bound once and guarded. Clicking the trigger
   toggles its menu (closing any other open select); clicking an option makes
   it the value, marks it aria-selected (clearing its siblings) and closes the
   menu. Outside-click and Escape close every open menu. aria-expanded on the
   trigger always mirrors the open state. Self-contained — no monolith globals. */
(function () {
  if (window.__oo_select_dropdown) return;
  window.__oo_select_dropdown = true;

  var ROOT = '.oo-select';
  var TRIGGER = '.oo-select__trigger';
  var OPTION = '.oo-select__option';
  var VALUE = '.oo-select__value';

  function isDisabled(root) {
    var t = root.querySelector(TRIGGER);
    return root.classList.contains('is-disabled') || (t && t.disabled);
  }

  function setOpen(root, open) {
    root.classList.toggle('is-open', open);
    var t = root.querySelector(TRIGGER);
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeAll(except) {
    document.querySelectorAll(ROOT + '.is-open').forEach(function (r) {
      if (r !== except) setOpen(r, false);
    });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest(TRIGGER);
    if (trigger) {
      var root = trigger.closest(ROOT);
      if (!root || isDisabled(root)) return;
      var willOpen = !root.classList.contains('is-open');
      closeAll(root);
      setOpen(root, willOpen);
      return;
    }

    var opt = e.target.closest(OPTION);
    if (opt) {
      var oroot = opt.closest(ROOT);
      if (!oroot || isDisabled(oroot)) return;
      oroot.querySelectorAll(OPTION).forEach(function (o) {
        o.setAttribute('aria-selected', o === opt ? 'true' : 'false');
      });
      var val = oroot.querySelector(VALUE);
      if (val) {
        val.textContent = opt.textContent.trim();
        val.classList.remove('is-placeholder');
      }
      setOpen(oroot, false);
      return;
    }

    closeAll(null); // clicked outside any select
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
