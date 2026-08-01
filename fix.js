const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('src/components');
files.push('src/lib/constants.ts');
files.push('src/app/page.tsx');
files.push('src/app/layout.tsx');

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let data = fs.readFileSync(file, 'utf8');
  let original = data;
  data = data.replace(/background(Color)?:\s*['"](white|#ffffff|#fff)['"]/gi, 'background$1: \'var(--bg-card)\'');
  data = data.replace(/background(Color)?:\s*['"]#f8fafc['"]/gi, 'background$1: \'var(--bg-main)\'');
  data = data.replace(/background(Color)?:\s*['"]#eff6ff['"]/gi, 'background$1: \'var(--primary-light)\'');
  data = data.replace(/background(Color)?:\s*['"]#fffbeb['"]/gi, 'background$1: \'var(--warning)\'');
  data = data.replace(/background(Color)?:\s*['"]#ecfdf5['"]/gi, 'background$1: \'var(--success)\'');
  
  // Replace string `#fff` etc in variables if any
  data = data.replace(/bg:\s*['"]#fffbeb['"]/gi, 'bg: \'var(--warning)\'');
  data = data.replace(/bg:\s*['"]#f8fafc['"]/gi, 'bg: \'var(--bg-main)\'');

  if (original !== data) {
    fs.writeFileSync(file, data);
    console.log('Updated ' + file);
  }
});
