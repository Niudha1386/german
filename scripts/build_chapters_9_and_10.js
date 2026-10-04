import fs from 'fs';

const existingData = JSON.parse(fs.readFileSync('./scripts/existing_items.json', 'utf8'));

function formatItem(item) {
  let lines = [];
  lines.push('  {');
  lines.push(`    id: '${item.id}',`);
  lines.push(`    german: ${JSON.stringify(item.german)},`);
  lines.push(`    persian: ${JSON.stringify(item.persian)},`);
  lines.push(`    category: '${item.category}',`);
  lines.push(`    lesson: ${item.lesson},`);
  lines.push(`    sources: ${JSON.stringify(item.sources || ['Lehrbuch'])},`);
  if (item.sourceDetails) {
    lines.push(`    sourceDetails: ${JSON.stringify(item.sourceDetails)},`);
  }
  if (item.pronunciation) lines.push(`    pronunciation: ${JSON.stringify(item.pronunciation)},`);

  if (item.category === 'Nomen') {
    if (item.article) lines.push(`    article: '${item.article}',`);
    if (item.plural) lines.push(`    plural: ${JSON.stringify(item.plural)},`);
    if (item.genderPersian) lines.push(`    genderPersian: '${item.genderPersian}',`);
  } else if (item.category === 'Verben') {
    if (item.infinitive) lines.push(`    infinitive: ${JSON.stringify(item.infinitive)},`);
    if (item.present) lines.push(`    present: ${JSON.stringify(item.present)},`);
    if (item.preterite) lines.push(`    preterite: ${JSON.stringify(item.preterite)},`);
    if (item.perfect) lines.push(`    perfect: ${JSON.stringify(item.perfect)},`);
    if (item.auxiliary) lines.push(`    auxiliary: '${item.auxiliary}',`);
    if (item.separable !== undefined) lines.push(`    separable: ${item.separable},`);
    if (item.reflexive !== undefined) lines.push(`    reflexive: ${item.reflexive},`);
    if (item.prepositionCase) lines.push(`    prepositionCase: ${JSON.stringify(item.prepositionCase)},`);
  } else if (item.category === 'Adjektive' || item.category === 'Adverbien') {
    if (item.comparative) lines.push(`    comparative: ${JSON.stringify(item.comparative)},`);
    if (item.superlative) lines.push(`    superlative: ${JSON.stringify(item.superlative)},`);
    if (item.opposite) lines.push(`    opposite: ${JSON.stringify(item.opposite)},`);
  } else if (item.category === 'Redewendungen') {
    if (item.explanation) lines.push(`    explanation: ${JSON.stringify(item.explanation)},`);
    if (item.literalMeaning) lines.push(`    literalMeaning: ${JSON.stringify(item.literalMeaning)},`);
  }

  if (item.example) lines.push(`    example: ${JSON.stringify(item.example)},`);
  if (item.exampleTranslation) lines.push(`    exampleTranslation: ${JSON.stringify(item.exampleTranslation)},`);
  lines.push(`    level: '${item.level || 'B1+'}',`);
  if (item.tags) lines.push(`    tags: ${JSON.stringify(item.tags)}`);
  lines.push('  }');
  return lines.join('\n');
}

// ==========================================
// CHAPTER 9
// ==========================================
const ch9Extra = [
  {
    id: 'k9-n-ext1',
    german: 'die Frankfurter Tabelle',
    persian: 'جدول رسمی فرانکفورت (جدول حقوقی تعیین درصد خسارت و کسر هزینه در صورت نقایص خدمات سفر)',
    category: 'Nomen',
    lesson: 9,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 9, module: 'Modul 3', pageOrTrack: 'S. 142', context: 'Wie viel Prozent Preisminderung der Reisende verlangen kann, ist in der Frankfurter Tabelle nachzulesen.' }],
    pronunciation: '[ˈfʁaŋkfʊʁtɐ taˈbɛlə]',
    article: 'die',
    plural: 'die Frankfurter Tabelle (بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'Bei Baulärm oder schmutzigem Hotelzimmer dient die Frankfurter Tabelle als Orientierung für Schadenersatz.',
    exampleTranslation: 'در صورت سروصدای ساختمانی یا اتاق آلوده هتل، جدول فرانکفورت مبنای قانونی مطالبه خسارت قرار می‌گیرد.',
    level: 'B1+',
    tags: ['سفر', 'قانون']
  },
  {
    id: 'k9-n-ext2',
    german: 'das Schmuddelwetter',
    persian: 'هوای گرفته، نمناک، مه‌آلود و بارانی مداوم (ویژگی اقلیمی شهر هامبورگ)',
    category: 'Nomen',
    lesson: 9,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 9, module: 'Modul 4', pageOrTrack: 'S. 144', context: 'Einigen fällt zu Hamburg auch das Schmuddelwetter mit Nebel, Regen und Wind ein.' }],
    pronunciation: '[ˈʃmʊdl̩ˌvɛtɐ]',
    article: 'das',
    plural: 'die Schmuddelwetter',
    genderPersian: 'خنثی (das)',
    example: 'Trotz des typisch norddeutschen Schmuddelwetters unternahmen die Touristen eine Bootstour auf der Elbe.',
    exampleTranslation: 'با وجود هوای ابری و بارانی نمناک شمال آلمان، گردشگران گشت با قایق را بر روی رود البه انجام دادند.',
    level: 'B1+',
    tags: ['آب‌وهوا', 'هامبورگ']
  },
  {
    id: 'k9-v-ext1',
    german: 'die Ärmel hochkrempeln',
    persian: 'آستین‌ها را بالا زدن و با عزم راسخ شروع به کار کردن',
    category: 'Verben',
    lesson: 9,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 9, module: 'Modul 2', pageOrTrack: 'S. 140', context: 'Morgens aufstehen, die Ärmel hochkrempeln und im Workcamp mit anpacken.' }],
    pronunciation: '[diː ˈʔɛʁml̩ ˈhoːxˌkʁɛmpl̩n]',
    infinitive: 'die Ärmel hochkrempeln',
    present: 'krempelt die Ärmel hoch',
    preterite: 'krempelte die Ärmel hoch',
    perfect: 'hat die Ärmel hochgekrempelt',
    auxiliary: 'haben',
    example: 'Jetzt heißt es die Ärmel hochkrempeln, um das ehrgeizige Umweltprojekt pünktlich abzuschließen.',
    exampleTranslation: 'اکنون وقت بالا زدن آستین‌ها و کار جدی است تا این پروژه محیط‌زیستی به موقع به سرانجام برسد.',
    level: 'B1+',
    tags: ['اصطلاح', 'تلاش']
  },
  {
    id: 'k9-red-ext1',
    german: 'die Seele baumeln lassen',
    persian: 'رها شدن از همه دغدغه‌ها، استراحت مطلق کردن و به آرامش محض رسیدن',
    category: 'Redewendungen',
    lesson: 9,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 9, module: 'Modul 1', pageOrTrack: 'S. 138', context: 'Im Urlaub am Meer einfach mal die Seele baumeln lassen.' }],
    pronunciation: '[diː ˈzeːlə ˈbaʊ̯ml̩n ˈlasn̩]',
    explanation: 'استراحت کامل روحی و بدنی بدون هیچ مشغله فکری.',
    literalMeaning: 'جان و روح را به تاب خوردن واداشتن',
    example: 'Im sonnigen Ferienhaus am See konnte er endlich nach Monaten harter Arbeit die Seele baumeln lassen.',
    exampleTranslation: 'در ویلای آفتابی کنار دریاچه سرانجام توانست پس از ماه‌ها کار طاقت‌فرسا روحی تازه کند و به آرامش مطلق برسد.',
    level: 'B1+',
    tags: ['اصطلاح', 'آرامش']
  }
];

const ch9All = [...(existingData[9] || []), ...ch9Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter9.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_9_VOCABULARY: VocabularyItem[] = [\n${ch9All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter9.ts with', ch9All.length, 'items');

// ==========================================
// CHAPTER 10
// ==========================================
const ch10Extra = [
  {
    id: 'k10-n-ext1',
    german: 'die Grünbrücke',
    persian: 'پل سبز گذر حیات وحش (روگذر مخصوص عبور ایمن حیوانات از روی بزرگراه‌ها)',
    category: 'Nomen',
    lesson: 10,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 10, module: 'Modul 3', pageOrTrack: 'S. 158', context: 'Grünbrücken verbinden die Lebensräume der Tiere und vermindern die Unfallgefahr.' }],
    pronunciation: '[ˈɡʁyːnˌbʁʏkə]',
    article: 'die',
    plural: 'die Grünbrücken',
    genderPersian: 'مونث (die)',
    example: 'Über die bepflanzte Grünbrücke können Rehe und Hirsche die Autobahn völlig gefahrlos überqueren.',
    exampleTranslation: 'از روی پل سبز پوشیده از گیاهان، آهوان و گوزن‌ها می‌توانند بدون هیچ خطری از عرض بزرگراه عبور کنند.',
    level: 'B1+',
    tags: ['محیط زیست', 'طبیعت']
  },
  {
    id: 'k10-n-ext2',
    german: 'die Seerechtskonvention',
    persian: 'کنوانسیون بین‌المللی حقوق دریاها (سازمان ملل متحد)',
    category: 'Nomen',
    lesson: 10,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 10, module: 'Porträt', pageOrTrack: 'S. 164', context: 'Elisabeth Mann Borgese war maßgeblich an der Internationalen Seerechtskonvention beteiligt.' }],
    pronunciation: '[ˈzeːʁɛçtskɔnvɛnˌtsi̯oːn]',
    article: 'die',
    plural: 'die Seerechtskonventionen',
    genderPersian: 'مونث (die)',
    example: 'Die UN-Seerechtskonvention schützt die Ozeane als gemeinsames Erbe der gesamten Menschheit.',
    exampleTranslation: 'کنوانسیون حقوق دریاهای سازمان ملل، اقیانوس‌ها را به عنوان میراث مشترک کل بشریت محافظت می‌کند.',
    level: 'B1+',
    tags: ['قانون بین‌الملل', 'اقیانوس']
  },
  {
    id: 'k10-v-ext1',
    german: 'das Wort ergreifen',
    persian: 'رشته کلام را به دست گرفتن، لب به سخن گشودن در جلسه یا بحث',
    category: 'Verben',
    lesson: 10,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 10, module: 'Modul 2', pageOrTrack: 'S. 157', context: 'Redemittel für eine Talkshow: das Wort ergreifen.' }],
    pronunciation: '[das vɔʁt ɛɐ̯ˈɡʁaɪ̯fn̩]',
    infinitive: 'das Wort ergreifen',
    present: 'ergreift das Wort',
    preterite: 'ergriff das Wort',
    perfect: 'hat das Wort ergriffen',
    auxiliary: 'haben',
    example: 'Nach einer langen Schweigeminute ergriff die Umweltministerin entschlossen das Wort.',
    exampleTranslation: 'پس از یک دقیقه سکوت، وزیر محیط زیست با قاطعیت رشته کلام را به دست گرفت.',
    level: 'B1+',
    tags: ['مناظره', 'سخنرانی']
  },
  {
    id: 'k10-red-ext1',
    german: 'jemanden ausreden lassen',
    persian: 'به کسی مجال صحبت دادن، حرف کسی را قطع نکردن',
    category: 'Redewendungen',
    lesson: 10,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 10, module: 'Modul 2', pageOrTrack: 'S. 157', context: 'Sich nicht unterbrechen lassen: Lassen Sie mich bitte ausreden!' }],
    pronunciation: '[ˈjeːmandn̩ ˈaʊ̯sˌʁeːdn̩ ˈlasn̩]',
    explanation: 'اجازه دادن به طرف مقابل برای تمام کردن صحبت و جمله‌اش در گفت‌وگو.',
    literalMeaning: 'گذاشتن کسی تا پایان سخن بگوید',
    example: 'In einer fairen Debatte sollte man seinen Gesprächspartner immer in Ruhe ausreden lassen.',
    exampleTranslation: 'در یک مناظره عادلانه باید همواره به طرف مقابل اجازه داد کلام خود را در آرامش به پایان برساند.',
    level: 'B1+',
    tags: ['اصطلاح', 'ادب']
  }
];

const ch10All = [...(existingData[10] || []), ...ch10Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter10.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_10_VOCABULARY: VocabularyItem[] = [\n${ch10All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter10.ts with', ch10All.length, 'items');
