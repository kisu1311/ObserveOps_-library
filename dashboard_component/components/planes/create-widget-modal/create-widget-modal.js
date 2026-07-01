/* create-widget-modal · planes — self-contained behaviour for the Create Widget
   plane. Document-level click/input delegation, bound once and guarded. No
   monolith globals (no WIDGETS / RENDER / renderPreview / DOM ids). Each group
   re-scopes selection to its own container so multiple modals never interfere.
   - .oo-cwm__type        single-select widget-type tab (aria-selected)
   - .oo-cwm__subtab      single-select config tab → shows matching .oo-cwm__pane
   - .oo-cwm__style-btn   single-select chart style (aria-pressed)
   - .oo-cwm__toggle      switch (aria-checked, flips ON/OFF label)
   - .oo-cwm__pill        segmented radio (aria-checked)
   - .oo-cwm__ds-cat      multi-toggle data-source category (aria-pressed)
   - .oo-cwm__ds-rm       removes its own data-source row
   - .oo-cwm__range-input live slider read-out into the sibling .oo-cwm__sv */
(function () {
  if (window.__oo_create_widget_modal) return;
  window.__oo_create_widget_modal = true;

  function pickOne(active, group, itemSel, attr) {
    if (!group) return;
    group.querySelectorAll(itemSel).forEach(function (el) {
      var on = el === active;
      el.classList.toggle('is-on', on);
      el.setAttribute(attr, String(on));
    });
  }

  document.addEventListener('click', function (e) {
    var type = e.target.closest('.oo-cwm__type');
    if (type) {
      pickOne(type, type.closest('.oo-cwm__types'), '.oo-cwm__type', 'aria-selected');
      return;
    }

    var sub = e.target.closest('.oo-cwm__subtab');
    if (sub) {
      pickOne(sub, sub.closest('.oo-cwm__subtabs'), '.oo-cwm__subtab', 'aria-selected');
      var cfg = sub.closest('.oo-cwm__cfg') || sub.closest('.oo-cwm');
      var target = sub.getAttribute('data-target');
      if (cfg && target) {
        cfg.querySelectorAll('.oo-cwm__pane').forEach(function (p) {
          p.classList.toggle('is-on', p.getAttribute('data-pane') === target);
        });
      }
      return;
    }

    var style = e.target.closest('.oo-cwm__style-btn');
    if (style) {
      pickOne(style, style.closest('.oo-cwm__style-row'), '.oo-cwm__style-btn', 'aria-pressed');
      return;
    }

    var toggle = e.target.closest('.oo-cwm__toggle');
    if (toggle) {
      var on = toggle.getAttribute('aria-checked') !== 'true';
      toggle.setAttribute('aria-checked', String(on));
      toggle.classList.toggle('is-on', on);
      var tt = toggle.querySelector('.oo-cwm__tt');
      if (tt) tt.textContent = on ? 'ON' : 'OFF';
      return;
    }

    var pill = e.target.closest('.oo-cwm__pill');
    if (pill) {
      pickOne(pill, pill.closest('.oo-cwm__pills'), '.oo-cwm__pill', 'aria-checked');
      return;
    }

    var cat = e.target.closest('.oo-cwm__ds-cat');
    if (cat) {
      var catOn = cat.getAttribute('aria-pressed') !== 'true';
      cat.setAttribute('aria-pressed', String(catOn));
      cat.classList.toggle('is-on', catOn);
      return;
    }

    var rm = e.target.closest('.oo-cwm__ds-rm');
    if (rm) {
      var row = rm.closest('.oo-cwm__ds-row');
      if (row) row.remove();
    }
  });

  document.addEventListener('input', function (e) {
    var slider = e.target.closest('.oo-cwm__range-input');
    if (!slider) return;
    var sv = slider.closest('.oo-cwm__slider');
    sv = sv && sv.querySelector('.oo-cwm__sv');
    if (sv) sv.textContent = slider.value;
  });
})();
