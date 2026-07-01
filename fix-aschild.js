const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace <DropdownMenuTrigger asChild>...</DropdownMenuTrigger>
  content = content.replace(/<DropdownMenuTrigger asChild>\s*([\s\S]*?)\s*<\/DropdownMenuTrigger>/g, (match, inner) => {
    return `<DropdownMenuTrigger render={\n${inner}\n} />`;
  });

  // Replace <DropdownMenuItem asChild className="...">...</DropdownMenuItem>
  content = content.replace(/<DropdownMenuItem asChild([^>]*)>\s*([\s\S]*?)\s*<\/DropdownMenuItem>/g, (match, attrs, inner) => {
    return `<DropdownMenuItem render={\n${inner}\n}${attrs} />`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
