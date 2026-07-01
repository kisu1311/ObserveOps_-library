/* ════════════════════════════════════════════════════════════════════════
   build-viewer.mjs — compile every dashboard partial into ONE self-contained
   HTML viewer (no external deps except Google Fonts). Portable: move it anywhere.
       node build-viewer.mjs        # writes ../dashboard-components-viewer.html
   Inlines: tokens.css + base.css + all component CSS → one <style>;
            utils/icons/widget-renderers/component JS + auto-mount → inline <script>s
            (one per file, preserving the gallery's load order); every component's
            HTML fragment → a demo card. Adds category nav, live search, and a
            per-component "view markup" toggle.
   ════════════════════════════════════════════════════════════════════════ */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, '..', 'dashboard-components-viewer.html');
const CATEGORIES = ['buttons', 'fields', 'items', 'tiles', 'widgets', 'planes'];
const UTIL_ORDER = ['rng', 'series', 'esc', 'smooth-path', 'colors', 'spark'];
const ICON_ORDER = ['card-icons', 'menu-icons', 'ui-icons'];

const dirs = p => existsSync(p) ? readdirSync(p).filter(n => statSync(join(p, n)).isDirectory()) : [];
const read = p => existsSync(p) ? readFileSync(p, 'utf8') : '';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let cssParts = [read(join(ROOT, 'tokens.css')), read(join(ROOT, 'base.css'))];
const jsFiles = [];                     // {label, code} inline scripts, in order
UTIL_ORDER.forEach(u => jsFiles.push({ label: `utils/${u}`, code: read(join(ROOT, 'utils', `${u}.js`)) }));
ICON_ORDER.forEach(i => jsFiles.push({ label: `icons/${i}`, code: read(join(ROOT, 'icons', `${i}.js`)) }));

const widgetJs = [], componentJs = [], sections = [];
let count = 0;

for (const cat of CATEGORIES) {
  const catDir = join(ROOT, cat);
  const comps = dirs(catDir).sort();
  if (!comps.length) continue;
  const cards = [];
  for (const name of comps) {
    const base = join(catDir, name, name);
    const html = read(base + '.html');
    if (!html.trim()) continue;
    const css = read(base + '.css');
    if (css.trim()) cssParts.push(`/* ===== ${cat}/${name} ===== */\n` + css);
    const js = read(base + '.js');
    if (js.trim()) (cat === 'widgets' ? widgetJs : componentJs).push({ label: `${cat}/${name}`, code: js });
    let meta = {}; try { meta = JSON.parse(read(join(catDir, name, 'meta.json')) || '{}'); } catch {}
    const title = meta.title || name;
    const tags = [name, cat, title, ...(meta.tags || []), ...(meta.variants || [])].join(' ').toLowerCase();
    const desc = meta.description ? `<p class="v-desc">${esc(meta.description)}</p>` : '';
    const chips = [
      ...(meta.variants || []).slice(0, 8).map(v => `<span class="v-chip">${esc(v)}</span>`),
    ].join('');
    const used = (meta.usedIn || []).length ? `<div class="v-used"><b>used in:</b> ${(meta.usedIn).map(esc).join(' · ')}</div>` : '';
    const minh = meta.demoHeight ? ` style="min-height:${meta.demoHeight}px"` : '';
    cards.push(`<article class="v-card" data-cat="${cat}" data-search="${esc(tags)}">
        <header class="v-card-h">
          <span class="v-name">${esc(title)}</span>
          <code class="v-slug">${cat}/${name}</code>
          <button class="v-srcbtn" title="View markup" aria-label="View markup">&lt;/&gt;</button>
        </header>
        <div class="v-stage"${minh}>${html}</div>
        ${chips ? `<div class="v-chips">${chips}</div>` : ''}
        ${desc}${used}
        <pre class="v-src" hidden><code>${esc(html.trim())}</code></pre>
      </article>`);
    count++;
  }
  if (cards.length) sections.push(`<section class="v-sec" id="sec-${cat}" data-cat="${cat}">
      <h2 class="v-h2">${cat}<span class="v-ct">${cards.length}</span></h2>
      <div class="v-grid">${cards.join('\n')}</div>
    </section>`);
}

const orderedJs = [...jsFiles, ...widgetJs, ...componentJs, { label: 'widgets/auto-mount', code: read(join(ROOT, 'widgets', 'auto-mount.js')) }];
const navLinks = CATEGORIES.filter(c => sections.some(s => s.includes(`id="sec-${c}"`)))
  .map(c => `<a href="#sec-${c}" data-cat="${c}">${c}</a>`).join('');

const viewerCss = `
  body{display:flex;min-height:100vh}
  .v-side{position:sticky;top:0;align-self:flex-start;width:188px;height:100vh;flex-shrink:0;
    background:var(--nav);border-right:1px solid var(--border);padding:18px 14px;overflow:auto;display:flex;flex-direction:column;gap:4px}
  .v-brand{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:#fff;margin-bottom:2px}
  .v-brand b{color:var(--teal)}
  .v-sub{font-size:10.5px;color:var(--muted);margin-bottom:12px;line-height:1.5}
  .v-search{width:100%;background:var(--card);border:1px solid var(--border2);border-radius:7px;
    padding:7px 10px;color:var(--text);font-size:12px;margin-bottom:10px;font-family:inherit}
  .v-search:focus{border-color:var(--teal);outline:none}
  .v-navlbl{font-size:9px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--dim);margin:8px 4px 2px}
  .v-side a{display:flex;justify-content:space-between;padding:6px 9px;border-radius:6px;font-size:12px;color:var(--muted);text-transform:capitalize;transition:var(--transition)}
  .v-side a:hover{background:var(--card);color:var(--text)}
  .v-side a .n{font-family:var(--font-mono);font-size:10px;color:var(--dim)}
  main{flex:1;padding:24px 30px;max-width:1480px}
  .v-pill{display:inline-block;background:var(--teal-glow);color:var(--teal);font-size:10px;font-weight:700;
    padding:3px 9px;border-radius:999px;letter-spacing:.4px;text-transform:uppercase;margin-bottom:12px}
  .v-title{font-size:23px;font-weight:800;color:#fff;letter-spacing:-.4px}
  .v-lead{font-size:12.5px;color:var(--muted);margin:6px 0 22px;line-height:1.6;max-width:780px}
  .v-empty{color:var(--muted);font-size:13px;padding:40px 0;display:none}
  .v-sec{margin-bottom:38px}
  .v-h2{font-size:15px;font-weight:700;color:var(--text);text-transform:capitalize;border-bottom:1px solid var(--border);
    padding-bottom:8px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .v-ct{font-size:10px;font-weight:700;color:var(--teal);background:var(--teal-glow);border-radius:999px;padding:1px 8px}
  .v-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px}
  .v-card{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
  .v-card-h{display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid var(--border);background:var(--card2)}
  .v-name{font-size:12px;font-weight:600;color:var(--text)}
  .v-slug{font-size:9.5px;color:var(--muted);font-family:var(--font-mono);margin-left:auto}
  .v-srcbtn{font-family:var(--font-mono);font-size:11px;color:var(--muted);border:1px solid var(--border2);
    border-radius:5px;padding:1px 6px;line-height:1.4}
  .v-srcbtn:hover{color:var(--teal);border-color:var(--teal)}
  .v-srcbtn.on{color:var(--teal);border-color:var(--teal);background:var(--teal-glow)}
  .v-stage{padding:20px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;min-height:96px;
    background:radial-gradient(120% 120% at 50% 0,rgba(20,184,166,.04),transparent 60%)}
  .v-chips{display:flex;flex-wrap:wrap;gap:5px;padding:0 12px 8px}
  .v-chip{font-size:9px;color:var(--muted);background:var(--card2);border:1px solid var(--border);border-radius:4px;padding:1px 6px}
  .v-desc{font-size:10.5px;color:var(--muted);padding:0 12px 9px;line-height:1.5;margin:0}
  .v-used{font-size:9.5px;color:var(--dim);padding:0 12px 11px;line-height:1.5}
  .v-used b{color:var(--muted)}
  .v-src{margin:0;border-top:1px solid var(--border);background:#060c17;max-height:280px;overflow:auto}
  .v-src code{display:block;padding:12px 14px;font-family:var(--font-mono);font-size:10.5px;color:#9ec7e6;line-height:1.5;white-space:pre-wrap}
  .v-hidden{display:none!important}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ObserveOps · Dashboard Component Viewer</title>
<style>
${cssParts.join('\n\n')}

/* ===== viewer chrome ===== */
${viewerCss}
</style>
</head>
<body>
<aside class="v-side">
  <div class="v-brand">Observe<b>Ops</b></div>
  <div class="v-sub">Dashboard module<br>component viewer</div>
  <input class="v-search" id="vSearch" type="search" placeholder="Search ${count} components…" autocomplete="off">
  <div class="v-navlbl">Categories</div>
  ${navLinks}
</aside>
<main>
  <span class="v-pill">Dashboard Module · Self-contained</span>
  <div class="v-title">Component Viewer</div>
  <p class="v-lead">All ${count} isolated, reusable dashboard components in one portable file —
  every partial's scoped CSS, markup and behaviour inlined. Search to filter; click <code>&lt;/&gt;</code> on any card to view its markup.</p>
  <div class="v-empty" id="vEmpty">No components match your search.</div>
  ${sections.join('\n')}
</main>

${orderedJs.filter(j => j.code.trim()).map(j => `<script>/* ${j.label} */\n${j.code}\n</script>`).join('\n')}
<script>/* viewer */
(function(){
  var q=document.getElementById('vSearch'), empty=document.getElementById('vEmpty');
  q.addEventListener('input',function(){
    var t=q.value.trim().toLowerCase(), any=false;
    document.querySelectorAll('.v-sec').forEach(function(sec){
      var shown=0;
      sec.querySelectorAll('.v-card').forEach(function(c){
        var m=!t||c.getAttribute('data-search').indexOf(t)>-1;
        c.classList.toggle('v-hidden',!m); if(m){shown++;any=true;}
      });
      sec.classList.toggle('v-hidden',shown===0);
    });
    empty.style.display=any?'none':'block';
  });
  document.addEventListener('click',function(e){
    var b=e.target.closest('.v-srcbtn'); if(!b)return;
    var pre=b.closest('.v-card').querySelector('.v-src');
    var open=pre.hasAttribute('hidden');
    if(open)pre.removeAttribute('hidden');else pre.setAttribute('hidden','');
    b.classList.toggle('on',open);
  });
})();
</script>
</body>
</html>`;

writeFileSync(OUT, html);
console.log(`Viewer built: ${count} components, ${sections.length} categories, ${orderedJs.filter(j=>j.code.trim()).length} inline scripts -> ${OUT.split('/').slice(-1)[0]}`);
