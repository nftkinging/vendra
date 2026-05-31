const fs = require('fs');
let content = fs.readFileSync('app/components/AppKitWidget.tsx', 'utf8');
content = content.replace("  const publicClient = usePublicClient();\n", "");
fs.writeFileSync('app/components/AppKitWidget.tsx', content, 'utf8');
console.log('Fixed:', !content.includes('usePublicClient'));
