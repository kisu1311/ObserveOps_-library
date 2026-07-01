/* gen-docs.mjs — generate component-usage.md from every component's meta.json.
   Run: node gen-docs.mjs  (writes docs/component-usage.md) */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CATEGORIES = ['buttons', 'fields', 'items', 'tiles', 'widgets', 'planes'];
const dirs = p => existsSync(p) ? readdirSync(p).filter(n => statSync(join(p, n)).isDirectory()) : [];

const comps = [];
for (const cat of CATEGORIES) {
  for (const name of dirs(join(ROOT, cat)).sort()) {
    const mp = join(ROOT, cat, name, 'meta.json');
    if (!existsSync(mp)) { comps.push({ cat, name, title: name, variants: [], states: [], usedIn: [], tags: [] }); continue; }
    let m = {}; try { m = JSON.parse(readFileSync(mp, 'utf8')); } catch {}
    comps.push({ cat, name, title: m.title || name, variants: m.variants || [], states: m.states || [], usedIn: m.usedIn || [], tags: m.tags || [], desc: m.description || '' });
  }
}

let md = `# Alerts Module — Component Usage Matrix

Auto-generated from each component's \`meta.json\`. ${comps.length} components across ${CATEGORIES.filter(c => comps.some(x => x.cat === c)).length} categories.

## Components by category

| Component | Category | Variants | States | Used on screens |
|---|---|---|---|---|
`;
for (const c of comps) {
  md += `| \`${c.cat}/${c.name}\` | ${c.cat} | ${(c.variants).join(', ') || '—'} | ${(c.states).join(', ') || '—'} | ${(c.usedIn).join(', ') || '—'} |\n`;
}

// reverse index: screen -> components ("when/which component is used")
const byScreen = {};
for (const c of comps) for (const s of (c.usedIn.length ? c.usedIn : ['(unspecified)'])) (byScreen[s] ||= []).push(`${c.cat}/${c.name}`);
md += `\n## Components by screen (where each is used)\n\n`;
for (const s of Object.keys(byScreen).sort()) {
  md += `### ${s}\n${byScreen[s].sort().map(x => `\`${x}\``).join(' · ')}\n\n`;
}

writeFileSync(join(ROOT, 'docs', 'component-usage.md'), md);
console.log(`component-usage.md: ${comps.length} components, ${Object.keys(byScreen).length} screens`);
