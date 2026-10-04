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
// CHAPTER 7
// ==========================================
const ch7Extra = [
  {
    id: 'k7-n-ext1',
    german: 'die Partnerbörse',
    persian: 'سامانه و وبگاه همسریابی آنلاین',
    category: 'Nomen',
    lesson: 7,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 7, module: 'Modul 2', pageOrTrack: 'S. 108', context: 'Dank der großen Auswahl an Partnerbörsen gibt es für jede Zielgruppe den passenden Anbieter.' }],
    pronunciation: '[ˈpaʁtnɐˌbœʁzə]',
    article: 'die',
    plural: 'die Partnerbörsen',
    genderPersian: 'مونث (die)',
    example: 'Viele Alleinstehende nutzen seriöse Partnerbörsen, um einen passenden Lebensgefährten kennenzulernen.',
    exampleTranslation: 'بسیاری از افراد مجرد از وبگاه‌های معتبر همسریابی برای آشنایی با شریک زندگی مناسب بهره می‌گیرند.',
    level: 'B1+',
    tags: ['روابط', 'اینترنت']
  },
  {
    id: 'k7-n-ext2',
    german: 'das Fettnäpfchen',
    persian: 'سوتی، گاف کلامی ناخواسته (در اصطلاح پا روی دم کسی گذاشتن)',
    category: 'Nomen',
    lesson: 7,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 7, module: 'Modul 4', pageOrTrack: 'S. 114', context: 'Mit seiner Bemerkung trat Leo Leike zielsicher in ein Fettnäpfchen.' }],
    pronunciation: '[ˈfɛtˌnɛp͡fçən]',
    article: 'das',
    plural: 'die Fettnäpfchen',
    genderPersian: 'خنثی (das)',
    example: 'Als er nach ihrem Alter fragte, trat er prompt in ein peinliches Fettnäpfchen.',
    exampleTranslation: 'هنگامی که سن او را پرسید، بی‌درنگ گاف شرم‌آوری داد و سوتی بزرگی مرتکب شد.',
    level: 'B1+',
    tags: ['گفت‌وگو', 'طنز']
  },
  {
    id: 'k7-v-ext1',
    german: 'sich zusammenraufen',
    persian: 'با وجود اختلافات کنار آمدن و سازش کردن با یکدیگر',
    category: 'Verben',
    lesson: 7,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 7, module: 'Modul 1', pageOrTrack: 'S. 107', context: 'In einer Patchworkfamilie müssen sich alle erst einmal zusammenraufen.' }],
    pronunciation: '[zɪç tsuˈzamənˌʁaʊ̯fn̩]',
    infinitive: 'sich zusammenraufen',
    present: 'rauft sich zusammen',
    preterite: 'raufte sich zusammen',
    perfect: 'hat sich zusammengerauft',
    auxiliary: 'haben',
    reflexive: true,
    separable: true,
    example: 'Trotz ihrer unterschiedlichen Charaktere haben sich die Ehepartner nach dem Streit wieder zusammengerauft.',
    exampleTranslation: 'با وجود خصوصیات اخلاقی متفاوتشان، زن و شوهر پس از مشاجره دوباره با هم کنار آمدند و سازش کردند.',
    level: 'B1+',
    tags: ['ازدواج', 'سازش']
  },
  {
    id: 'k7-adj-ext1',
    german: 'gebührenpflichtig',
    persian: 'شامل هزینه، مستلزم پرداخت حق اشتراک',
    category: 'Adjektive',
    lesson: 7,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 7, module: 'Modul 2', pageOrTrack: 'S. 108', context: 'Die meisten seriösen Dating-Portale im Internet sind gebührenpflichtig.' }],
    pronunciation: '[ɡəˈbyːʁn̩ˌp͡flɪçtɪç]',
    comparative: '',
    superlative: '',
    opposite: 'kostenlos / gratis',
    example: 'Die Premium-Funktionen der App sind leider gebührenpflichtig und erfordern ein Monatsabo.',
    exampleTranslation: 'قابلیت‌های ویژه اپلیکیشن متأسفانه مستلزم پرداخت هزینه بوده و نیازمند اشتراک ماهانه است.',
    level: 'B1+',
    tags: ['مالی', 'اینترنت']
  },
  {
    id: 'k7-red-ext1',
    german: 'beim Geld hört die Liebe auf',
    persian: 'در مسائل مالی شوخی و تعارف و حتی عشق رنگ می‌بازد',
    category: 'Redewendungen',
    lesson: 7,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 7, module: 'Film', pageOrTrack: 'S. 118', context: 'Filmtitel: Beim Geld hört die Liebe auf - Streit ums Haushaltsgeld.' }],
    pronunciation: '[baɪ̯m ɡɛlt høːɐ̯t diː ˈliːbə ʔaʊ̯f]',
    explanation: 'وقتی پای منافع مادی و تقسیم پول وسط می‌آید، حتی عمیق‌ترین احساسات رمانتیک ممکن است دچار تنش شدید شوند.',
    literalMeaning: 'کنار پول عشق به پایان می‌رسد',
    example: 'Spätestens bei der Scheidung und Vermögensaufteilung zeigt sich: Beim Geld hört die Liebe leider oft auf.',
    exampleTranslation: 'حداکثر هنگام طلاق و تقسیم دارایی‌ها آشکار می‌شود که متأسفانه پای پول که در میان باشد عشق و تعارفات رنگ می‌بازد.',
    level: 'B1+',
    tags: ['اصطلاح', 'مالی']
  }
];

const ch7All = [...(existingData[7] || []), ...ch7Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter7.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_7_VOCABULARY: VocabularyItem[] = [\n${ch7All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter7.ts with', ch7All.length, 'items');

// ==========================================
// CHAPTER 8
// ==========================================
const ch8Extra = [
  {
    id: 'k8-n-ext1',
    german: 'das Grundeinkommen',
    persian: 'درآمد پایه همگانی، مستمری بدون قید و شرط دولتی به شهروندان',
    category: 'Nomen',
    lesson: 8,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 8, module: 'Porträt', pageOrTrack: 'S. 132', context: 'Götz Werner fordert ein bedingungsloses Grundeinkommen für jeden Bürger.' }],
    pronunciation: '[ˈɡʁʊntʔaɪ̯nˌkɔmən]',
    article: 'das',
    plural: 'die Grundeinkommen',
    genderPersian: 'خنثی (das)',
    example: 'Ein bedingungsloses Grundeinkommen soll die Existenz aller Bürger unabhängig von einer Erwerbsarbeit sichern.',
    exampleTranslation: 'درآمد پایه همگانی بنا دارد بقا و معیشت تمامی شهروندان را فارغ از داشتن شغل رسمی تضمین کند.',
    level: 'B1+',
    tags: ['اقتصاد', 'جامعه']
  },
  {
    id: 'k8-n-ext2',
    german: 'das Kindchenschema',
    persian: 'طرح‌واره کودکانه در روانشناسی تبلیغات (چشمان درشت و چهره معصوم برای جلب عاطفه)',
    category: 'Nomen',
    lesson: 8,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 8, module: 'Modul 4', pageOrTrack: 'S. 128', context: 'Bei Frauen funktioniert der Blick aus großen Kinderaugen besonders gut - das Kindchenschema.' }],
    pronunciation: '[ˈkɪntçənˌʃeːma]',
    article: 'das',
    plural: 'die Kindchenschemata',
    genderPersian: 'خنثی (das)',
    example: 'Werbespots für Waschmittel nutzen oft das Kindchenschema, um emotionale Nähe und Fürsorge zu wecken.',
    exampleTranslation: 'تیزرهای تبلیغاتی پودر شوینده اغلب از چهره‌های معصوم کودکانه بهره می‌گیرند تا حس مراقبت عاطفی را برانگیزند.',
    level: 'B1+',
    tags: ['تبلیغات', 'روانشناسی']
  },
  {
    id: 'k8-v-ext1',
    german: 'einwickeln',
    persian: 'گول زدن، فریب دادن و مجذوب خود کردن با چرب‌زبانی و ترفندهای تبلیغاتی',
    category: 'Verben',
    lesson: 8,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 8, module: 'Modul 4', pageOrTrack: 'S. 128', context: 'Titel: So wickelt uns Werbung ein.' }],
    pronunciation: '[ˈaɪ̯nˌvɪkln̩]',
    infinitive: 'jmdn. einwickeln',
    present: 'wickelt ein',
    preterite: 'wickelte ein',
    perfect: 'hat eingewickelt',
    auxiliary: 'haben',
    separable: true,
    example: 'Der geschickte Verkäufer wickelte den Kunden mit charmanten Komplimenten völlig ein.',
    exampleTranslation: 'فروشنده ماهر با تعریف و تمجیدهای دلنشین مشتری را کاملاً مجذوب و رام خواسته خود کرد.',
    level: 'B1+',
    tags: ['مذاکره', 'فروش']
  },
  {
    id: 'k8-red-ext1',
    german: 'die Katze im Sack kaufen',
    persian: 'چشم‌بسته معامله کردن، چیزی را ندیده و نسنجیده خریدن',
    category: 'Redewendungen',
    lesson: 8,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 8, module: 'Modul 2', pageOrTrack: 'S. 125', context: 'Wer ohne Prüfung im Internet bestellt, kauft oft die Katze im Sack.' }],
    pronunciation: '[diː ˈkat͡sə ɪm zak ˈkaʊ̯fn̩]',
    explanation: 'کالایی را بدون بررسی قبلی و بدون اطمینان از کیفیت آن خریدن.',
    literalMeaning: 'گربه را درون کیسه خریدن',
    example: 'Lies dir vor der Online-Bestellung gründlich die Bewertungen durch, damit du nicht die Katze im Sack kaufst.',
    exampleTranslation: 'پیش از ثبت سفارش اینترنتی نظرات خریداران را به دقت بخوان تا چشم‌بسته جنسی را نخریده باشی.',
    level: 'B1+',
    tags: ['اصطلاح', 'خرید']
  }
];

const ch8All = [...(existingData[8] || []), ...ch8Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter8.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_8_VOCABULARY: VocabularyItem[] = [\n${ch8All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter8.ts with', ch8All.length, 'items');
