import fs from 'fs';

const content = fs.readFileSync('./src/data/initialVocabulary.ts', 'utf8');
const lines = content.split('\n');

const itemsByLesson = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [] };

let currentItemLines = [];
let currentLesson = 0;
let inItem = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim().startsWith('{') && lines[i+1] && lines[i+1].includes('id:')) {
    inItem = true;
    currentItemLines = [line];
  } else if (inItem) {
    currentItemLines.push(line);
    const m = line.match(/lesson:\s*(\d+)/);
    if (m) currentLesson = parseInt(m[1]);
    if (line.trim().startsWith('}') && (line.trim() === '},' || line.trim() === '}')) {
      inItem = false;
      if (currentLesson >= 1 && currentLesson <= 10) {
        itemsByLesson[currentLesson].push(currentItemLines.join('\n'));
      }
      currentItemLines = [];
    }
  }
}

fs.writeFileSync('./scripts/existing_items.json', JSON.stringify(itemsByLesson, null, 2), 'utf8');
console.log('Successfully saved existing items to ./scripts/existing_items.json');
