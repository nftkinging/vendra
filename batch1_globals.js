/* ============================================================
   batch1_globals.js  —  Vendra v4, Batch 1 of 3
   Drop this AND batch1_globals_append.css in your project root,
   then run:   node batch1_globals.js
   ------------------------------------------------------------
   - adds the General Sans @import at the TOP of app/globals.css
   - appends the scoped v4 style block at the BOTTOM
   - backs up the original once to app/globals.css.v3bak
   - safe to run more than once (idempotent)
   ============================================================ */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'app', 'globals.css');
const addPath = path.join(root, 'batch1_globals_append.css');
const MARKER = '/* === VENDRA V4 HOMEPAGE STYLES === */';
const IMPORT = "@import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');";

if (!fs.existsSync(cssPath)) {
  console.error('\n  x  app/globals.css not found. Run this from your project root (the folder with app/ and package.json).\n');
  process.exit(1);
}
if (!fs.existsSync(addPath)) {
  console.error('\n  x  batch1_globals_append.css not found. Put it in the same folder as this script (project root).\n');
  process.exit(1);
}

// one-time backup
if (!fs.existsSync(cssPath + '.v3bak')) {
  fs.copyFileSync(cssPath, cssPath + '.v3bak');
  console.log('  .  backup written  -> app/globals.css.v3bak');
}

let css = fs.readFileSync(cssPath, 'utf8');

// the v4 block: take the append file from the marker onward (skips the instructions header)
let block = fs.readFileSync(addPath, 'utf8');
const bi = block.indexOf(MARKER);
if (bi !== -1) block = block.slice(bi);
block = block.replace(/\s+$/, '');

// 1) General Sans import at the very top (only once)
if (!css.includes('general-sans')) {
  css = IMPORT + '\n' + css;
  console.log('  +  General Sans @import added at top');
} else {
  console.log('  .  General Sans @import already present, skipped');
}

// 2) remove any previous v4 block, then append a fresh one
const ci = css.indexOf(MARKER);
if (ci !== -1) {
  css = css.slice(0, ci).replace(/\s+$/, '');
  console.log('  ~  previous v4 block found -> replacing with fresh copy');
}
css = css.replace(/\s+$/, '') + '\n\n' + block + '\n';

fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  v4 style block appended to app/globals.css');
console.log('\n  Batch 1 done.  Next:  npm run build');
console.log('  Build should pass with no errors. Nothing changes visually yet (no page uses v4');
console.log('  until Batch 3), and every existing page stays exactly as before. Then git push.\n');
