const fs = require('fs');
let content = fs.readFileSync('app/profile/page.tsx', 'utf8');

// Add CircleAppKitPanel import after existing imports
content = content.replace(
  "import ArcAgenticBanner from '../components/ArcAgenticBanner';",
  "import ArcAgenticBanner from '../components/ArcAgenticBanner';\nimport CircleAppKitPanel from '../components/CircleAppKitPanel';"
);

// Replace ArcUnifiedBalance in seller view with CircleAppKitPanel
content = content.replace(
  "                {/* Arc Unified Balance */}\n                <ArcUnifiedBalance />",
  "                {/* Circle App Kit Panel */}\n                <CircleAppKitPanel />"
);

// Replace ArcUnifiedBalance in buyer view with CircleAppKitPanel
content = content.replace(
  "            {/* Arc Unified Balance for buyers */}\n            <div style={{marginBottom:32}}><ArcUnifiedBalance /></div>",
  "            {/* Circle App Kit Panel */}\n            <div style={{marginBottom:32}}><CircleAppKitPanel /></div>"
);

fs.writeFileSync('app/profile/page.tsx', content, 'utf8');
console.log('Profile updated with CircleAppKitPanel:', content.includes('CircleAppKitPanel'));
