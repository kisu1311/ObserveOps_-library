/* md2html.mjs — minimal Markdown → dark-themed HTML (for PDF export).
   Usage: node md2html.mjs <in.md> <out.html> ["Doc Title"]
   Handles: headings, tables, lists, code blocks, inline code/bold, hr, links, paragraphs. */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , inPath, outPath, titleArg] = process.argv;
const src = readFileSync(inPath, 'utf8');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

const lines = src.split('\n');
let html = '', i = 0, inUl = false, inCode = false, codeBuf = [];
const closeUl = () => { if (inUl) { html += '</ul>\n'; inUl = false; } };

while (i < lines.length) {
  let ln = lines[i];
  if (ln.trim().startsWith('```')) {
    if (!inCode) { inCode = true; codeBuf = []; }
    else { closeUl(); html += `<pre><code>${esc(codeBuf.join('\n'))}</code></pre>\n`; inCode = false; }
    i++; continue;
  }
  if (inCode) { codeBuf.push(ln); i++; continue; }

  // table block
  if (/^\s*\|.*\|\s*$/.test(ln) && i + 1 < lines.length && /^\s*\|[-:\s|]+\|\s*$/.test(lines[i + 1])) {
    closeUl();
    const row = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const head = row(ln); i += 2;
    html += '<table><thead><tr>' + head.map(h => `<th>${inline(h)}</th>`).join('') + '</tr></thead><tbody>\n';
    while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
      html += '<tr>' + row(lines[i]).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>\n'; i++;
    }
    html += '</tbody></table>\n'; continue;
  }

  const h = ln.match(/^(#{1,6})\s+(.*)$/);
  if (h) { closeUl(); html += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>\n`; i++; continue; }
  if (/^\s*---\s*$/.test(ln)) { closeUl(); html += '<hr>\n'; i++; continue; }
  if (/^\s*[-*]\s+/.test(ln)) { if (!inUl) { html += '<ul>\n'; inUl = true; } html += `<li>${inline(ln.replace(/^\s*[-*]\s+/, ''))}</li>\n`; i++; continue; }
  if (ln.trim() === '') { closeUl(); i++; continue; }
  closeUl(); html += `<p>${inline(ln)}</p>\n`; i++;
}
closeUl();

const title = titleArg || (src.match(/^#\s+(.*)$/m) || [, 'Document'])[1];
const out = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { margin: 16mm 14mm; }
  :root{ --bg:#07101f; --card:#0b1627; --bd:#1d2a3e; --tx:#cad3e2; --mut:#8e9fbc; --ac:#008cff; --teal:#14b8a6; }
  *{box-sizing:border-box}
  body{font-family:'Inter',sans-serif;font-size:11px;line-height:1.6;color:var(--tx);background:var(--bg);margin:0;padding:26px 30px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  h1{font-size:24px;font-weight:800;color:#fff;letter-spacing:-.4px;margin:0 0 4px;border-bottom:2px solid var(--ac);padding-bottom:10px}
  h2{font-size:16px;font-weight:700;color:#fff;margin:26px 0 10px;border-bottom:1px solid var(--bd);padding-bottom:6px}
  h3{font-size:13px;font-weight:700;color:var(--teal);margin:18px 0 6px}
  p{margin:8px 0}
  a{color:var(--ac);text-decoration:none}
  code{font-family:'JetBrains Mono',monospace;font-size:10px;background:rgba(0,140,255,.1);color:#bcdcff;padding:1px 5px;border-radius:4px}
  pre{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 14px;overflow:auto;margin:12px 0}
  pre code{background:none;color:var(--mut);padding:0;font-size:10px;line-height:1.5}
  ul{margin:8px 0 8px 4px;padding-left:18px}
  li{margin:3px 0}
  table{border-collapse:collapse;width:100%;margin:12px 0;font-size:10px}
  th,td{border:1px solid var(--bd);padding:6px 9px;text-align:left;vertical-align:top}
  th{background:var(--card);color:#fff;font-weight:600}
  tr:nth-child(even) td{background:rgba(255,255,255,.015)}
  hr{border:none;border-top:1px solid var(--bd);margin:18px 0}
  strong{color:#fff}
</style></head><body>
${html}</body></html>`;
writeFileSync(outPath, out);
console.log(`wrote ${outPath}`);
