/* ============================================================
   batch11_storecss_fix.js  —  Vendra v4: restore store-header CSS
   Drop in project root (C:\Users\kvngs\VENDRA), then run:
       node batch11_storecss_fix.js
   ------------------------------------------------------------
   Re-adds the "V4 STORE PAGE STYLES" block (store header/emblem,
   the Buy pill, product spinner) that an earlier marketplace CSS
   re-ensure had trimmed off. CSS-only, idempotent, no page changes.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const cssPath = path.join(process.cwd(), 'app', 'globals.css');
if (!fs.existsSync(cssPath)) { console.error('\n  x  app/globals.css not found. Run from project root.\n'); process.exit(1); }

const MARK = '/* === V4 STORE PAGE STYLES === */';
const CSS = [
MARK,
".v4home .v4st-banner{width:100%;height:clamp(180px,28vw,300px);position:relative;overflow:hidden;}",
".v4home .v4st-banner img{width:100%;height:100%;object-fit:cover;}",
".v4home .v4st-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 35%,var(--v4-paper) 100%);}",
".v4home .v4st-head{max-width:1080px;margin:0 auto;padding:0 clamp(20px,4vw,48px);}",
".v4home .v4st-head-inner{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap;padding:clamp(28px,4vw,44px) 0 clamp(26px,3vw,38px);border-bottom:1px solid var(--v4-line);}",
".v4home .v4st-emblem{width:64px;height:64px;border-radius:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(150deg,var(--v4-a),var(--v4-aDeep));color:#fff;font-weight:600;font-size:22px;letter-spacing:-.01em;box-shadow:0 12px 28px -12px rgba(226,164,28,.55);}",
".v4home .v4st-info{flex:1;min-width:240px;}",
".v4home .v4st-cat{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--v4-aDeep);margin-bottom:8px;}",
".v4home .v4st-title{font-size:clamp(30px,5vw,50px);font-weight:600;letter-spacing:-.02em;line-height:1;}",
".v4home .v4st-tag{font-size:15px;color:var(--v4-tx60);margin-top:10px;}",
".v4home .v4st-x{display:inline-block;margin-top:10px;font-size:13px;font-weight:600;color:var(--v4-aDeep);text-decoration:none;}",
".v4home .v4st-x:hover{text-decoration:underline;}",
".v4home .v4st-desc{font-size:14px;color:var(--v4-tx60);line-height:1.7;margin-top:12px;max-width:60ch;}",
".v4home .v4st-body{max-width:1080px;margin:0 auto;padding:clamp(28px,4vw,40px) clamp(20px,4vw,48px) clamp(64px,8vw,96px);}",
".v4home .v4st-count{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--v4-tx40);}",
".v4home .pc-desc{font-size:12.5px;color:var(--v4-tx40);margin-top:5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}",
".v4home .pc-acts{display:flex;align-items:center;gap:6px;}",
".v4home .pc-add{width:32px;height:32px;border-radius:999px;border:1px solid var(--v4-line2);background:transparent;color:var(--v4-tx);font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.25s;flex-shrink:0;}",
".v4home .pc-add:hover{border-color:var(--v4-ink);}",
".v4home .pc-add.added{border-color:var(--v4-a);color:var(--v4-aDeep);}",
".v4home .pc-buynow{border:none;border-radius:999px;background:var(--v4-a);color:#15130D;font-family:'General Sans',sans-serif;font-weight:600;font-size:12.5px;padding:8px 16px;cursor:pointer;transition:.25s;white-space:nowrap;}",
".v4home .pc-buynow:hover{background:var(--v4-a2);}",
".v4home .v4spinner{width:34px;height:34px;border:2px solid var(--v4-line2);border-top-color:var(--v4-a);border-radius:50%;animation:v4spin 1s linear infinite;}",
"@keyframes v4spin{to{transform:rotate(360deg);}}",
""
].join("\n");

let css = fs.readFileSync(cssPath, 'utf8');
const i = css.indexOf(MARK);
if (i !== -1) { css = css.slice(0, i).replace(/\s+$/, '') + '\n\n'; }
css = css.replace(/\s+$/, '') + '\n\n' + CSS;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('  +  restored V4 STORE PAGE STYLES in globals.css');
console.log('\n  Done. npm run build -> npm run dev -> open a store; the header/emblem + Buy pill are back. Then git push.\n');
