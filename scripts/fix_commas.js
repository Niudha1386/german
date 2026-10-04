import fs from 'fs';

for (let i = 1; i <= 10; i++) {
  const filePath = `./src/data/chapters/chapter${i}.ts`;
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace any '},,' with '},'
  content = content.replace(/\},,/g, '},');
  // Replace multiple commas followed by whitespace/newlines
  content = content.replace(/,\s*,/g, ',');

  // Also remove trailing comma before '];'
  content = content.replace(/,\s*\];/g, '\n];');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned chapter${i}.ts`);
}
