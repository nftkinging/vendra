const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Remove the Arc integrations showcase section
const start = content.indexOf('\n      {/* ARC INTEGRATIONS SHOWCASE */}');
const end = content.indexOf('\n      {/* CTA */}');

if (start !== -1 && end !== -1) {
  content = content.slice(0, start) + '\n' + content.slice(end);
  console.log('Arc showcase section removed');
} else {
  console.log('Section not found — may already be removed');
}

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Homepage updated');
