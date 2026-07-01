/* source-picker · planes — self-contained behaviour, document-level delegation,
   bound once. Multi-select monitor table + live search filter + open/close of an
   anchored popup. No monolith globals, no external state. */
(function () {
  if (window.__oo_source_picker) return;
  window.__oo_source_picker = true;

  var ROOT = '.oo-source-picker';

  function pickerOf(el) { return el && el.closest(ROOT); }
  function rowChecks(p) { return Array.prototype.slice.call(p.querySelectorAll('.oo-source-picker__row .oo-source-picker__check')); }
  function headCheck(p) { var t = p.querySelector('thead .oo-source-picker__check'); return t; }
  function isOff(c) { return c.disabled || c.getAttribute('aria-disabled') === 'true'; }
  function isChecked(c) { return c.getAttribute('aria-checked') === 'true'; }
  function setChecked(c, on) { c.setAttribute('aria-checked', on ? 'true' : 'false'); }

  function selectable(p) {
    return rowChecks(p).filter(function (c) {
      var row = c.closest('.oo-source-picker__row');
      return !isOff(c) && row && !row.hidden;
    });
  }

  function toggleCheck(c) { if (!isOff(c)) setChecked(c, !isChecked(c)); }

  function toggleAll(p) {
    var sel = selectable(p);
    var anyOff = sel.some(function (c) { return !isChecked(c); });
    sel.forEach(function (c) { setChecked(c, anyOff); });
  }

  /* recompute footer count + the select-all tri-state for one picker */
  function refresh(p) {
    var sel = selectable(p);
    var on = sel.filter(isChecked).length;

    var head = headCheck(p);
    if (head) {
      head.setAttribute('aria-checked', on === 0 ? 'false' : (on === sel.length ? 'true' : 'mixed'));
    }

    var count = p.querySelector('[data-oo-source-count]');
    var total = rowChecks(p).filter(isChecked).length;
    if (count) count.textContent = String(total);

    var clear = p.querySelector('.oo-source-picker__btn:not(.oo-source-picker__btn--primary)');
    if (clear) clear.disabled = total === 0;
  }

  function openTrigger(trig) {
    var id = trig.getAttribute('aria-controls');
    var p = id ? document.getElementById(id) : (trig.parentElement && trig.parentElement.querySelector(ROOT));
    if (!p) return;
    var open = !p.classList.contains('is-open');
    p.classList.toggle('is-open', open);
    trig.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var inp = p.querySelector('.oo-source-picker__search input'); if (inp) inp.focus(); }
  }

  function close(p) {
    p.classList.remove('is-open');
    var trig = p.id && document.querySelector('[aria-controls="' + p.id + '"]');
    if (trig) trig.setAttribute('aria-expanded', 'false');
  }

  /* ── clicks ──────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var trig = e.target.closest('.oo-source-picker__trigger');
    if (trig) { openTrigger(trig); return; }

    var btn = e.target.closest('.oo-source-picker__btn');
    if (btn) {
      var bp = pickerOf(btn); if (!bp) return;
      if (btn.classList.contains('oo-source-picker__btn--primary')) {
        if (bp.classList.contains('oo-source-picker--floating')) close(bp);
      } else {
        rowChecks(bp).forEach(function (c) { setChecked(c, false); });
        refresh(bp);
      }
      return;
    }

    var check = e.target.closest('.oo-source-picker__check');
    if (check) {
      var cp = pickerOf(check); if (!cp || isOff(check)) return;
      if (check.closest('thead')) toggleAll(cp); else toggleCheck(check);
      refresh(cp);
      return;
    }

    var row = e.target.closest('.oo-source-picker__row');
    if (row && pickerOf(row)) {
      if (row.classList.contains('is-disabled') || row.getAttribute('aria-disabled') === 'true') return;
      var rc = row.querySelector('.oo-source-picker__check');
      if (rc) { toggleCheck(rc); refresh(pickerOf(row)); }
      return;
    }

    /* click outside an open anchored popup closes it */
    Array.prototype.forEach.call(
      document.querySelectorAll('.oo-source-picker--floating.is-open'),
      function (p) { if (!p.contains(e.target)) close(p); }
    );
  });

  /* ── live search filter ──────────────────────────────────── */
  document.addEventListener('input', function (e) {
    if (!e.target.matches('.oo-source-picker__search input')) return;
    var p = pickerOf(e.target); if (!p) return;
    var q = e.target.value.trim().toLowerCase();
    var visible = 0;
    Array.prototype.forEach.call(p.querySelectorAll('.oo-source-picker__row'), function (row) {
      var match = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
      row.hidden = !match;
      if (match) visible++;
    });
    p.classList.toggle('is-empty', visible === 0);
    refresh(p);
  });

  /* ── Escape closes anchored popups ───────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(
      document.querySelectorAll('.oo-source-picker--floating.is-open'), close
    );
  });

  /* sync any pre-rendered pickers (count + select-all) on load */
  function init() { Array.prototype.forEach.call(document.querySelectorAll(ROOT), refresh); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
