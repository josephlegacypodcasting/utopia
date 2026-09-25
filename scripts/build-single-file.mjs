/**
 * Re-packs the Vite build into ONE self-contained .html file, the way the
 * original landing page was delivered — CSS, JS and carrier logos all inline.
 * That single file is what you paste into a GoHighLevel custom-code block.
 *
 * Run after `vite build`:  npm run build:ghl
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OUT_DIR = 'dist-ghl';
const OUT_FILE = 'utopia-broker-landing-page.html';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error(`No ${DIST}/index.html found. Run "npm run build" first.`);
  process.exit(1);
}

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const readDist = (url) => fs.readFileSync(path.join(DIST, url.replace(/^\//, '')));

// 1. Inline the stylesheet(s) Vite emitted.
html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g,
  (_m, href) => `<style>\n${readDist(href).toString('utf8')}\n</style>`
);

// 2. Inline the module bundle(s).
html = html.replace(
  /<script([^>]*)src="(\/assets\/[^"]+\.js)"([^>]*)><\/script>/g,
  (_m, _pre, src) =>
    `<script type="module">\n${readDist(src).toString('utf8')}\n</script>`
);

// 3. Inline every local image as a data URI. This covers href as well as src,
//    so the favicon travels inside the file instead of 404-ing once the
//    markup is pasted into GoHighLevel.
html = html.replace(/(src|href)="(\/assets\/[^"]+)"/g, (whole, attr, url) => {
  const ext = path.extname(url).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return whole;
  const b64 = readDist(url).toString('base64');
  return `${attr}="data:${mime};base64,${b64}"`;
});

// 4. Drop preload hints that point at files no longer shipped.
html = html.replace(/<link[^>]+rel="modulepreload"[^>]*>\n?/g, '');

fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, OUT_FILE);
fs.writeFileSync(outPath, html, 'utf8');

const leftovers = html.match(/(?:src|href)="\/assets\/[^"]+"/g);
if (leftovers) {
  console.warn('WARNING: these references were not inlined:', leftovers);
}

console.log(`${outPath}  (${(html.length / 1024).toFixed(1)} KB)`);
