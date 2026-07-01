/* ruler · planes — drag / keyboard-scrub the timeline range brush.
   Self-contained: no monolith globals, document-level delegation, bound once. */
(function () {
  if (window.__oo_ruler) return;
  window.__oo_ruler = true;

  function isOff(slider) {
    return slider.classList.contains('is-disabled') ||
           slider.getAttribute('aria-disabled') === 'true';
  }

  // travel bounds (px) for the slider's left edge inside its ruler
  function bounds(ruler, slider) {
    const cs = getComputedStyle(ruler);
    const min = parseFloat(cs.paddingLeft) || 0;
    const max = ruler.clientWidth - (parseFloat(cs.paddingRight) || 0) - slider.offsetWidth;
    return { min: min, max: Math.max(min, max) };
  }

  function setPos(ruler, slider, left) {
    const b = bounds(ruler, slider);
    left = Math.min(b.max, Math.max(b.min, left));
    slider.style.left = left + 'px';
    slider.style.right = 'auto';
    const pct = b.max > b.min ? Math.round(((left - b.min) / (b.max - b.min)) * 100) : 0;
    slider.setAttribute('aria-valuenow', pct);
  }

  // pointer drag
  document.addEventListener('pointerdown', function (e) {
    const slider = e.target.closest && e.target.closest('.oo-ruler__slider');
    if (!slider || isOff(slider)) return;
    const ruler = slider.closest('.oo-ruler');
    if (!ruler) return;
    e.preventDefault();

    const startX = e.clientX;
    const startLeft = slider.offsetLeft;
    slider.classList.add('is-grabbing');

    function move(ev) { setPos(ruler, slider, startLeft + (ev.clientX - startX)); }
    function up() {
      slider.classList.remove('is-grabbing');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });

  // keyboard nudge when the brush is focused
  document.addEventListener('keydown', function (e) {
    const slider = e.target.closest && e.target.closest('.oo-ruler__slider');
    if (!slider || isOff(slider)) return;
    const ruler = slider.closest('.oo-ruler');
    if (!ruler) return;

    let delta = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -Math.max(8, ruler.clientWidth * 0.04);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = Math.max(8, ruler.clientWidth * 0.04);
    else if (e.key === 'Home') delta = -1e5;
    else if (e.key === 'End') delta = 1e5;
    else return;

    e.preventDefault();
    setPos(ruler, slider, slider.offsetLeft + delta);
  });
})();
