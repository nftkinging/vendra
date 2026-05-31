const fs = require('fs');
let content = fs.readFileSync('app/profile/page.tsx', 'utf8');

// Remove ArcIdentityBadge import and usage
content = content.replace("import ArcIdentityBadge from '../components/ArcIdentityBadge';\n", '');
content = content.replace("import ArcAgenticBanner from '../components/ArcAgenticBanner';\n", '');
content = content.replace("import ArcUnifiedBalance from '../components/ArcUnifiedBalance';\n", '');
content = content.replace("import CircleAppKitPanel from '../components/CircleAppKitPanel';\n", '');

// Remove ArcIdentityBadge block
content = content.replace(/\s*\{\/\* ERC-8004 Identity Badge \*\/\}\s*<div style=\{.*?\}>\s*<ArcIdentityBadge[^/]*\/>\s*<\/div>/gs, '');

// Remove ArcAgenticBanner block  
content = content.replace(/\s*\{\/\* Arc Agentic Banner \*\/\}\s*<div style=\{.*?\}>\s*<ArcAgenticBanner[^/]*\/>\s*<\/div>/gs, '');

// Remove CircleAppKitPanel blocks
content = content.replace(/\s*\{\/\* Circle App Kit Panel \*\/\}\s*<div style=\{.*?\}>\s*<CircleAppKitPanel[^/]*\/>\s*<\/div>/gs, '');
content = content.replace(/\s*\{\/\* Arc Unified Balance \*\/\}\s*<div style=\{.*?\}>\s*<ArcUnifiedBalance[^/]*\/>\s*<\/div>/gs, '');

// Also remove inline component references
content = content.replace(/<ArcIdentityBadge[^/]*\/>/g, '');
content = content.replace(/<ArcAgenticBanner[^/]*\/>/g, '');
content = content.replace(/<ArcUnifiedBalance[^/]*\/>/g, '');
content = content.replace(/<CircleAppKitPanel[^/]*\/>/g, '');

fs.writeFileSync('app/profile/page.tsx', content, 'utf8');
console.log('Profile cleaned');
