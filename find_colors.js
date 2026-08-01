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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

const bgRegex = /(background(?:-color)?):\s*['"]?(#f[a-f0-9]{2,5}|#e[a-f0-9]{2,5}|white|#fff(?:fff)?)['"]?/gi;
const colorRegex = /(color):\s*['"]?(#333|#111|#000(?:000)?|#475569|#334155|#1e293b|#0f172a|black)['"]?/gi;

let found = false;
let issues = [];

files.forEach(file => {
  let data = fs.readFileSync(file, 'utf8');
  
  let match;
  while ((match = bgRegex.exec(data)) !== null) {
    issues.push(`${file} : BACKGROUND MATCH : ${match[0]}`);
    found = true;
  }
  
  while ((match = colorRegex.exec(data)) !== null) {
    issues.push(`${file} : TEXT COLOR MATCH : ${match[0]}`);
    found = true;
  }
});

if (!found) {
  console.log('No hardcoded colors found!');
} else {
  console.log(issues.join('\n'));
}
