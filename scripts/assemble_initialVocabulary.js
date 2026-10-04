import fs from 'fs';

const content = `import { VocabularyItem } from '../types/vocabulary';
import { CHAPTER_1_VOCABULARY } from './chapters/chapter1';
import { CHAPTER_2_VOCABULARY } from './chapters/chapter2';
import { CHAPTER_3_VOCABULARY } from './chapters/chapter3';
import { CHAPTER_4_VOCABULARY } from './chapters/chapter4';
import { CHAPTER_5_VOCABULARY } from './chapters/chapter5';
import { CHAPTER_6_VOCABULARY } from './chapters/chapter6';
import { CHAPTER_7_VOCABULARY } from './chapters/chapter7';
import { CHAPTER_8_VOCABULARY } from './chapters/chapter8';
import { CHAPTER_9_VOCABULARY } from './chapters/chapter9';
import { CHAPTER_10_VOCABULARY } from './chapters/chapter10';

export const INITIAL_VOCABULARY: VocabularyItem[] = [
  ...CHAPTER_1_VOCABULARY,
  ...CHAPTER_2_VOCABULARY,
  ...CHAPTER_3_VOCABULARY,
  ...CHAPTER_4_VOCABULARY,
  ...CHAPTER_5_VOCABULARY,
  ...CHAPTER_6_VOCABULARY,
  ...CHAPTER_7_VOCABULARY,
  ...CHAPTER_8_VOCABULARY,
  ...CHAPTER_9_VOCABULARY,
  ...CHAPTER_10_VOCABULARY,
];
`;

fs.writeFileSync('./src/data/initialVocabulary.ts', content, 'utf8');
console.log('Successfully updated src/data/initialVocabulary.ts');
