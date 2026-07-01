/* toast · planes — self-contained transient-toast behaviour.
   Document-level delegation, bound once and guarded. No monolith globals.
   - clicking .oo-toast__close (unless disabled) fades + removes its toast
   - [data-oo-toast-trigger] spawns a toast into the nearest .oo-toast-host,
     runs the enter animation and auto-dismisses after ~2.6s (live = 2.4s)
   data-tone / data-msg on the trigger pick the variant + message text. */
(function () {
  if (window.__oo_toast) return;
  window.__oo_toast = true;

  var ICONS = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    error: '<circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    warning: '<path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
  };
  var ROLE = { error: 'alert', warning: 'alert' };

  function dismiss(el) {
    if (!el || el.classList.contains('is-hiding')) return;
    el.classList.add('is-hiding');
    el.addEventListener('transitionend', function handler() {
      el.removeEventListener('transitionend', handler);
      el.remove();
    });
    // safety net if no transition fires
    setTimeout(function () { if (el.parentNode) el.remove(); }, 260);
  }

  function spawn(host, tone, msg) {
    tone = ICONS[tone] ? tone : 'success';
    var t = document.createElement('div');
    t.className = 'oo-toast oo-toast--' + tone + ' is-show';
    t.setAttribute('role', ROLE[tone] || 'status');
    t.innerHTML =
      '<span class="oo-toast__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">' + ICONS[tone] + '</svg>' +
      '</span>' +
      '<span class="oo-toast__msg"></span>' +
      '<button type="button" class="oo-toast__close" aria-label="Dismiss notification">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>';
    t.querySelector('.oo-toast__msg').innerHTML = msg || '';
    host.appendChild(t);
    setTimeout(function () { dismiss(t); }, 2600);
  }

  document.addEventListener('click', function (e) {
    var closer = e.target.closest('.oo-toast__close');
    if (closer && !closer.disabled) {
      dismiss(closer.closest('.oo-toast'));
      return;
    }

    var trigger = e.target.closest('[data-oo-toast-trigger]');
    if (trigger) {
      var scope = trigger.closest('.oo-toast-stage') || document;
      var host = scope.querySelector('.oo-toast-host');
      if (host) spawn(host, trigger.getAttribute('data-tone'), trigger.getAttribute('data-msg'));
    }
  });
})();
