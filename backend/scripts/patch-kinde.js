const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', '@kinde-oss', 'kinde-node-express', 'dist', 'kinde-node-express.cjs');

if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
  if (content.includes('({}.url)')) {
    content = content.replace('({}.url)', '(__filename)');
    fs.writeFileSync(target, content, 'utf8');
    console.log('✅ Patched @kinde-oss/kinde-node-express ({}.url -> __filename)');
  }
}
