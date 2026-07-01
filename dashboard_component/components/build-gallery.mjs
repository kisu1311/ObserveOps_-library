/* ════════════════════════════════════════════════════════════════════════
   build-gallery.mjs — assembles index.html from the component partials.
   Doubles as the per-wave verification tool: run after each wave to regenerate
   the browsable gallery, then screenshot it.

       node build-gallery.mjs        # writes ./index.html

   Convention per component folder  components/<category>/<name>/ :
     <name>.html   markup fragment (required)  — inlined into a demo stage
     <name>.css    scoped styles (required)    — <link>ed in <head>
     <name>.js     behaviour (optional)        — <script>ed before auto-mount
     meta.json     {title,description,demoHeight,…} (optional) — labels the card
   Shared globals (tokens/base/utils/icons + widgets/auto-mount) are always included.
   No build framework; output opens directly via file:// (markup is baked in).
   ════════════════════════════════════════════════════════════════════════ */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CATEGORIES = ['buttons', 'fields', 'items', 'tiles', 'widgets', 'planes'];
const UTIL_ORDER = ['rng', 'series', 'esc', 'smooth-path', 'colors', 'spark'];
const ICON_ORDER = ['card-icons', 'menu-icons', 'ui-icons'];

const dirs = p => existsSync(p) ? readdirSync(p).filter(n => statSync(join(p, n)).isDirectory()) : [];
const read = p => existsSync(p) ? readFileSync(p, 'utf8') : '';

const cssLinks = ['tokens.css', 'base.css'];
const scripts = [];                 // ordered <script src> list
const sections = [];                // html per category

// shared globals first (deterministic dependency order)
UTIL_ORDER.forEach(u => scripts.push(`utils/${u}.js`));
ICON_ORDER.forEach(i => scripts.push(`icons/${i}.js`));

const widgetScripts = [];           // widget renderers — must precede auto-mount
const componentScripts = [];        // atom behaviours

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
    if (existsSync(base + '.css')) cssLinks.push(`${cat}/${name}/${name}.css`);
    if (existsSync(base + '.js')) (cat === 'widgets' ? widgetScripts : componentScripts).push(`${cat}/${name}/${name}.js`);
    let meta = {};
    try { meta = JSON.parse(read(join(catDir, name, 'meta.json')) || '{}'); } catch {}
    const title = meta.title || name;
    const desc = meta.description ? `<div class="g-desc">${meta.description}</div>` : '';
    const minh = meta.demoHeight ? ` style="min-height:${meta.demoHeight}px"` : '';
    cards.push(`<article class="g-card" id="c-${name}">
        <header class="g-card-h"><span class="g-name">${title}</span><code class="g-slug">${cat}/${name}</code></header>
        <div class="g-stage"${minh}>${html}</div>
        ${desc}
      </article>`);
    count++;
  }
  if (cards.length) sections.push(`<section class="g-sec" id="sec-${cat}">
      <h2 class="g-h2">${cat}<span class="g-ct">${cards.length}</span></h2>
      <div class="g-grid">${cards.join('\n')}</div>
    </section>`);
}

// widget renderers, then atom behaviours, then auto-mount LAST
scripts.push(...widgetScripts, ...componentScripts, 'widgets/auto-mount.js');

const nav = CATEGORIES
  .filter(c => sections.some(s => s.includes(`id="sec-${c}"`)))
  .map(c => `<a href="#sec-${c}">${c}</a>`).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ObserveOps · Dashboard Component Library</title>
${cssLinks.map(h => `<link rel="stylesheet" href="${h}">`).join('\n')}
<style>
  body{display:flex;min-height:100vh}
  .g-side{position:sticky;top:0;align-self:flex-start;width:170px;height:100vh;flex-shrink:0;
    background:var(--nav);border-right:1px solid var(--border);padding:18px 14px;overflow:auto}
  .g-brand{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:#fff;margin-bottom:4px}
  .g-brand b{color:var(--teal)}
  .g-sub{font-size:10.5px;color:var(--muted);margin-bottom:18px;line-height:1.5}
  .g-side a{display:block;padding:6px 9px;border-radius:6px;font-size:12px;color:var(--muted);
    text-transform:capitalize;transition:var(--transition)}
  .g-side a:hover{background:var(--card);color:var(--text)}
  main{flex:1;padding:26px 30px;max-width:1400px}
  .g-title{font-size:22px;font-weight:800;color:#fff;letter-spacing:-.4px}
  .g-lead{font-size:12.5px;color:var(--muted);margin:6px 0 26px;line-height:1.6;max-width:760px}
  .g-pill{display:inline-block;background:var(--teal-glow);color:var(--teal);font-size:10px;font-weight:700;
    padding:3px 9px;border-radius:999px;letter-spacing:.4px;text-transform:uppercase;margin-bottom:12px}
  .g-sec{margin-bottom:40px}
  .g-h2{font-size:15px;font-weight:700;color:var(--text);text-transform:capitalize;
    border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .g-ct{font-size:10px;font-weight:700;color:var(--teal);background:var(--teal-glow);border-radius:999px;padding:1px 8px}
  .g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
  .g-card{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
  .g-card-h{display:flex;align-items:center;justify-content:space-between;gap:8px;
    padding:9px 12px;border-bottom:1px solid var(--border);background:var(--card2)}
  .g-name{font-size:12px;font-weight:600;color:var(--text)}
  .g-slug{font-size:9.5px;color:var(--muted);font-family:var(--font-mono)}
  .g-stage{padding:20px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:12px;
    min-height:90px;background:radial-gradient(120% 120% at 50% 0,rgba(20,184,166,.04),transparent 60%)}
  .g-desc{font-size:10.5px;color:var(--muted);padding:0 12px 11px;line-height:1.5}
</style>
</head>
<body>
<aside class="g-side">
  <div class="g-brand">Observe<b>Ops</b></div>
  <div class="g-sub">Dashboard module · component library</div>
  ${nav}
</aside>
<main>
  <span class="g-pill">Dashboard Module</span>
  <div class="g-title">Component Library</div>
  <p class="g-lead">Isolated, reusable raw partials decomposed from the ObserveOps Dashboard
  module. ${count} components across ${sections.length} categories. Each renders here from its own
  scoped <code>.css</code> + markup fragment; behaviour from optional <code>.js</code>.</p>
  ${sections.join('\n')}
</main>
${scripts.map(s => `<script src="${s}"></script>`).join('\n')}
</body>
</html>`;

writeFileSync(join(ROOT, 'index.html'), html);
console.log(`Gallery built: ${count} components, ${sections.length} categories -> index.html`);
