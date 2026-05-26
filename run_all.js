// ── MASTER RUNNER — runs all Vendra premium port scripts ──
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Copy all scripts to current dir and run them
const scripts = [
  'port_vendra.js',
  'write_nav.js',
  'write_cart_components.js',
  'write_homepage.js',
];

const scriptDir = __dirname;

for (const script of scripts) {
  const src = path.join(scriptDir, script);
  const dst = path.join(process.cwd(), script);
  fs.copyFileSync(src, dst);
  console.log('Running:', script);
  try {
    execSync('node ' + script, { stdio: 'inherit' });
    fs.unlinkSync(dst);
    console.log('Done:', script);
  } catch (e) {
    console.error('Failed:', script, e.message);
  }
}

console.log('\n✅ All files written! Now run: git add . && git commit -m "feat: premium luxury redesign" && git push');
