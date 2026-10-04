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
// CHAPTER 3
// ==========================================
const ch3Extra = [
  {
    id: 'k3-n-ext1',
    german: 'die Nervennahrung',
    persian: 'غذای تقویت‌کننده اعصاب و روان (به ویژه شکلات و مغزیجات)',
    category: 'Nomen',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Modul 1', pageOrTrack: 'S. 42', context: 'Schokolade ist Nervennahrung: Sie enthält Substanzen, die unsere Psyche beeinflussen.' }],
    pronunciation: '[ˈnɛʁfn̩ˌnaːʁʊŋ]',
    article: 'die',
    plural: 'die Nervennahrung (بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'Vor einer anstrengenden Prüfung greifen viele Studierende zu Schokolade als willkommener Nervennahrung.',
    exampleTranslation: 'پیش از یک آزمون طاقت‌فرسا، بسیاری از دانشجویان به عنوان غذای آرامش‌بخش اعصاب به شکلات پناه می‌برند.',
    level: 'B1+',
    tags: ['تغذیه', 'روانشناسی']
  },
  {
    id: 'k3-n-ext2',
    german: 'die Geschmacksknospe',
    persian: 'پرز چشایی زبان',
    category: 'Nomen',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Film', pageOrTrack: 'S. 54', context: 'Auf der Zunge befinden sich Tausende von Geschmacksknospen.' }],
    pronunciation: '[ɡəˈʃmaksˌknɔspə]',
    article: 'die',
    plural: 'die Geschmacksknospen',
    genderPersian: 'مونث (die)',
    example: 'Über die Geschmacksknospen kann die Zunge süß, sauer, salzig, bitter und umami wahrnehmen.',
    exampleTranslation: 'از طریق پرزهای چشایی، زبان قادر به تشخیص مزه‌های شیرین، ترش، شور، تلخ و اومامی است.',
    level: 'B1+',
    tags: ['حواس', 'فیزیولوژی']
  },
  {
    id: 'k3-n-ext3',
    german: 'die Schmelzschokolade',
    persian: 'شکلات ذوب‌شونده در دهان (اختراع رودولف لینت در سال ۱۸۷۹)',
    category: 'Nomen',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Porträt', pageOrTrack: 'S. 52', context: 'Seine Schmelzschokolade wurde rasch berühmt und begründete den Weltruf Schweizer Schokolade.' }],
    pronunciation: '[ˈʃmɛltsʃokoˌlaːdə]',
    article: 'die',
    plural: 'die Schmelzschokoladen',
    genderPersian: 'مونث (die)',
    example: 'Mit der Erfindung der zarten Schmelzschokolade revolutionierte Lindt die Süßwarenindustrie.',
    exampleTranslation: 'با اختراع شکلات لطیف و ذوب‌شونده، لینت صنعت شیرینی‌جات را متحول ساخت.',
    level: 'B1+',
    tags: ['شکلات', 'تاریخ']
  },
  {
    id: 'k3-v-ext1',
    german: 'entsorgen',
    persian: 'دور انداختن اصولی و دفع بهداشتی پسماندها و کالاها',
    category: 'Verben',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Modul 2', pageOrTrack: 'S. 45', context: 'Der Skandal ist, dass Supermärkte gute Lebensmittel einfach entsorgen.' }],
    pronunciation: '[ɛntˈzɔʁɡn̩]',
    infinitive: 'entsorgen (+ Akk.)',
    present: 'entsorgt',
    preterite: 'entsorgte',
    perfect: 'hat entsorgt',
    auxiliary: 'haben',
    example: 'Alte Elektrogeräte und Batterien müssen getrennt und umweltgerecht entsorgt werden.',
    exampleTranslation: 'لوازم برقی کهنه و باتری‌ها باید به صورت تفکیک‌شده و سازگار با محیط زیست دفع شوند.',
    level: 'B1+',
    tags: ['محیط زیست', 'پسماند']
  },
  {
    id: 'k3-v-ext2',
    german: 'schieben in die Schuhe',
    persian: 'تقصیر و اشتباه خود را به گردن دیگری انداختن',
    category: 'Verben',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Modul 4', pageOrTrack: 'S. 51', context: 'Wenn er einen Fehler macht, schiebt er ihn mir in die Schuhe.' }],
    pronunciation: '[ˈʃiːbn̩ ɪn diː ˈʃuːə]',
    infinitive: 'jmdm. die Schuld in die Schuhe schieben',
    present: 'schiebt in die Schuhe',
    preterite: 'schob in die Schuhe',
    perfect: 'hat in die Schuhe geschoben',
    auxiliary: 'haben',
    example: 'Der unfaire Mitarbeiter versuchte, sein eigenes Versäumnis der neuen Praktikantin in die Schuhe zu schieben.',
    exampleTranslation: 'آن همکار ناصادق کوشید کوتاهی شخص خود را به گردن کارآموز جدید بیندازد.',
    level: 'B1+',
    tags: ['کار', 'روابط']
  },
  {
    id: 'k3-v-ext3',
    german: 'mitentscheiden',
    persian: 'در تصمیم‌گیری سهیم و شریک بودن',
    category: 'Verben',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Film', pageOrTrack: 'S. 54', context: 'Im Geschmackslabor testet man, wie unsere Augen mitentscheiden, ob etwas schmeckt.' }],
    pronunciation: '[ˈmɪtʔɛntˌʃaɪ̯dn̩]',
    infinitive: 'mitentscheiden',
    present: 'entscheidet mit',
    preterite: 'entschied mit',
    perfect: 'hat mitentschieden',
    auxiliary: 'haben',
    separable: true,
    example: 'Das optische Aussehen einer Speise entscheidet maßgeblich über das Geschmackserlebnis mit.',
    exampleTranslation: 'ظاهر بصری غذا نقش عمده‌ای در ادراک طعم و مزه آن ایفا می‌کند.',
    level: 'B1+',
    tags: ['روانشناسی', 'حواس']
  },
  {
    id: 'k3-adj-ext1',
    german: 'zartbitter',
    persian: 'تلخ و لطیف (شکلات سیاه با درصد کاکائوی بالا)',
    category: 'Adjektive',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Modul 1', pageOrTrack: 'S. 42', context: 'Zartbitterschokolade enthält mindestens 60 Prozent Kakao.' }],
    pronunciation: '[ˈtsaːɐ̯tˌbɪtɐ]',
    comparative: 'zartbitterer',
    superlative: 'am zartbittersten',
    opposite: 'vollmilch / süß',
    example: 'Dunkle Zartbitterschokolade ist reich an gesunden Antioxidantien.',
    exampleTranslation: 'شکلات تلخ سرشار از آنتی‌اکسیدان‌های سلامت‌بخش است.',
    level: 'B1+',
    tags: ['خوراکی', 'طعم']
  },
  {
    id: 'k3-red-ext1',
    german: 'Das Auge isst mit',
    persian: 'چشم هم همراه با دهان غذا می‌خورد (زیبایی تزئین غذا اشتها را برمی‌انگیزد)',
    category: 'Redewendungen',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Film', pageOrTrack: 'S. 55', context: 'Sprichwörter zum Essen: Das Auge isst mit.' }],
    pronunciation: '[das ˈʔaʊ̯ɡə ˈʔɪst ˈmɪt]',
    explanation: 'نحوه تزئین، رنگ‌آمیزی و چیدمان غذا در بشقاب، میل و اشتهای انسان را چند برابر می‌کند.',
    literalMeaning: 'چشم نیز همراه با غذا میل می‌کند',
    example: 'Spitzenköche legen großen Wert auf eine farbenfrohe Dekoration, denn das Auge isst bekanntlich mit.',
    exampleTranslation: 'سرآشپزهای برتر به تزئین رنگارنگ غذا اهمیت فراوانی می‌دهند، زیرا چنانکه می‌دانیم چشم نیز با دهان غذا می‌خورد.',
    level: 'B1+',
    tags: ['اصطلاح', 'آشپزی']
  },
  {
    id: 'k3-red-ext2',
    german: 'Essen und Trinken hält Leib und Seele zusammen',
    persian: 'خورد و خوراک مایه قوام تن و روان است',
    category: 'Redewendungen',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Film', pageOrTrack: 'S. 55', context: 'Sprichwörter: Essen und Trinken hält Leib und Seele zusammen.' }],
    pronunciation: '[ˈʔɛsn̩ ʊnt ˈtʁɪŋkn̩ hɛlt ˈlaɪ̯p ʊnt ˈzeːlə tsuˈzamən]',
    explanation: 'تغذیه مناسب و لذت‌بخش برای سلامت جسمی و آرامش روحی انسان ضروری است.',
    literalMeaning: 'خوردن و آشامیدن تن و جان را کنار یکدیگر نگاه می‌دارد',
    example: 'Nach dem langen Arbeitstag gönnte er sich ein herzhaftes Mahl, denn Essen und Trinken hält Leib und Seele zusammen.',
    exampleTranslation: 'پس از روز کاری طولانی خود را به غذایی لذیذ مهمان کرد، چرا که خورد و خوراک قوام‌بخش تن و جان است.',
    level: 'B1+',
    tags: ['اصطلاح', 'زندگی']
  },
  {
    id: 'k3-red-ext3',
    german: 'Viele Köche verderben den Brei',
    persian: 'آشپز که دو تا شد، آش یا شور می‌شود یا بی‌نمک',
    category: 'Redewendungen',
    lesson: 3,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 3, module: 'Film', pageOrTrack: 'S. 55', context: 'Wenn zu viele Personen mitentscheiden, verderben viele Köche den Brei.' }],
    pronunciation: '[ˈfiːlə ˈkœçə fɛɐ̯ˈdɛʁbn̩ deːn ˈbʁaɪ̯]',
    explanation: 'وقتی افراد زیادی در کاری دخالت کنند، نتیجه کار تباه و خراب می‌شود.',
    literalMeaning: 'آشپزهای زیاد حلیم یا پوره‌غذا را خراب می‌کنند',
    example: 'Wenn bei einem Projekt zehn Manager gleichzeitig Anweisungen geben, bewahrheitet sich das Sprichwort: Viele Köche verderben den Brei.',
    exampleTranslation: 'اگر در یک پروژه ده مدیر به صورت همزمان دستور صادر کنند، این ضرب‌المثل محقق می‌شود که آشپز که دو تا شد آش شور می‌شود یا بی‌نمک.',
    level: 'B1+',
    tags: ['اصطلاح', 'مدیریت']
  }
];

const ch3All = [...(existingData[3] || []), ...ch3Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter3.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_3_VOCABULARY: VocabularyItem[] = [\n${ch3All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter3.ts with', ch3All.length, 'items');

// ==========================================
// CHAPTER 4
// ==========================================
const ch4Extra = [
  {
    id: 'k4-n-ext1',
    german: 'der Spieltrieb',
    persian: 'غریزه بازی، گرایش ذاتی و طبیعی انسان به بازی و سرگرمی',
    category: 'Nomen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Modul 2', pageOrTrack: 'S. 60', context: 'Ist den Menschen der Spieltrieb angeboren? - Ja, Kinder müssen spielen.' }],
    pronunciation: '[ˈʃpiːlˌtʁiːp]',
    article: 'der',
    plural: 'die Spieltriebe',
    genderPersian: 'مذکر (der)',
    example: 'Der angeborene Spieltrieb fördert bei Kindern die Motorik, die Neugier und das Sozialverhalten.',
    exampleTranslation: 'غریزه ذاتی بازی در کودکان باعث تقویت مهارت‌های حرکتی، کنجکاوی و رفتار اجتماعی می‌شود.',
    level: 'B1+',
    tags: ['روانشناسی', 'بازی']
  },
  {
    id: 'k4-n-ext2',
    german: 'das Gesellschaftsspiel',
    persian: 'بازی دورهمی، بازی رومیزی و گروهی خانوادگی',
    category: 'Nomen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Modul 2', pageOrTrack: 'S. 61', context: 'Spielkultur und Gesellschaftsspiele haben sich ständig weiterentwickelt.' }],
    pronunciation: '[ɡəˈzɛlʃaftsˌʃpiːl]',
    article: 'das',
    plural: 'die Gesellschaftsspiele',
    genderPersian: 'خنثی (das)',
    example: 'An regnerischen Sonntagen versammelt sich die ganze Familie zu einem spannenden Gesellschaftsspiel.',
    exampleTranslation: 'در یکشنبه‌های بارانی، کل خانواده برای انجام یک بازی گروهی هیجان‌انگیز دور هم جمع می‌شوند.',
    level: 'B1+',
    tags: ['سرگرمی', 'خانواده']
  },
  {
    id: 'k4-n-ext3',
    german: 'die Spielfigur',
    persian: 'مهره بازی در بازی‌های تخته‌ای و رومیزی',
    category: 'Nomen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Modul 2', pageOrTrack: 'S. 61', context: 'Würfeln und die Spielfigur um drei Felder vorrücken.' }],
    pronunciation: '[ˈʃpiːlfiˌɡuːɐ̯]',
    article: 'die',
    plural: 'die Spielfiguren',
    genderPersian: 'مونث (die)',
    example: 'Jeder Spieler wählt zu Beginn eine farbige hölzerne Spielfigur aus.',
    exampleTranslation: 'هر بازیکن در ابتدای بازی یک مهره چوبی رنگی را انتخاب می‌کند.',
    level: 'B1+',
    tags: ['بازی', 'اجزاء']
  },
  {
    id: 'k4-n-ext4',
    german: 'das Zeitgeschehen',
    persian: 'رویدادهای جاری روز، وقایع معاصر سیاسی و اجتماعی',
    category: 'Nomen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Modul 4', pageOrTrack: 'S. 66', context: 'Mit lustigen Wort-Verdrehern macht sich Michaela Drux über das aktuelle Zeitgeschehen lustig.' }],
    pronunciation: '[ˈtsaɪ̯tɡəˌʃeːən]',
    article: 'das',
    plural: 'das Zeitgeschehen (بدون جمع)',
    genderPersian: 'خنثی (das)',
    example: 'Politisches Kabarett nimmt das aktuelle Zeitgeschehen mit feinem Humor aufs Korn.',
    exampleTranslation: 'تئاتر طنز سیاسی با شوخ‌طبعی ظریف رویدادهای جاری روز را به باد نقد می‌گیرد.',
    level: 'B1+',
    tags: ['رسانه', 'جامعه']
  },
  {
    id: 'k4-n-ext5',
    german: 'der Nervenkitzel',
    persian: 'هیجان شدید و دلهره‌آور، تنش لذت‌بخش در ورزش‌های خطرناک',
    category: 'Nomen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Film', pageOrTrack: 'S. 71', context: 'Extremsportler suchen den ultimativen Nervenkitzel.' }],
    pronunciation: '[ˈnɛʁfn̩ˌkɪtsl̩]',
    article: 'der',
    plural: 'die Nervenkitzel',
    genderPersian: 'مذکر (der)',
    example: 'Das Bungee-Jumping von der Brücke verschafft Sportlern einen unvergleichlichen Nervenkitzel.',
    exampleTranslation: 'پرش بانجی از روی پل، هیجان دلهره‌آور بی‌نظیری را برای ورزشکاران پدید می‌آورد.',
    level: 'B1+',
    tags: ['ورزش', 'هیجان']
  },
  {
    id: 'k4-v-ext1',
    german: 'vorrücken',
    persian: 'جلو رفتن مهره در خانه یا صفحه بازی',
    category: 'Verben',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Modul 2', pageOrTrack: 'S. 61', context: 'Die Spielfigur ein Feld vorrücken oder zurückgehen.' }],
    pronunciation: '[ˈfoːɐ̯ˌʁʏkn̩]',
    infinitive: 'vorrücken',
    present: 'rückt vor',
    preterite: 'rückte vor',
    perfect: 'ist vorgerückt',
    auxiliary: 'sein',
    separable: true,
    example: 'Nachdem er eine Sechs gewürfelt hatte, durfte seine Spielfigur sechs Felder vorrücken.',
    exampleTranslation: 'پس از آوردن عدد شش در تاس، مهره او اجازه یافت شش خانه به جلو پیش برود.',
    level: 'B1+',
    tags: ['بازی', 'حرکت']
  },
  {
    id: 'k4-v-ext2',
    german: 'aussetzen',
    persian: 'یک دور از نوبت بازی محروم ماندن',
    category: 'Verben',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Modul 2', pageOrTrack: 'S. 61', context: 'Bei dieser Ereigniskarte muss der Spieler eine Runde aussetzen.' }],
    pronunciation: '[ˈaʊ̯sˌzɛtsn̩]',
    infinitive: 'eine Runde aussetzen',
    present: 'setzt aus',
    preterite: 'setzte aus',
    perfect: 'hat ausgesetzt',
    auxiliary: 'haben',
    separable: true,
    example: 'Wer auf das Gefängnisfeld tritt, muss zwei Spielrunden lang aussetzen.',
    exampleTranslation: 'هر کس وارد خانه زندان شود باید به مدت دو دور بازی نظاره‌گر باشد و نوبت خود را واگذار کند.',
    level: 'B1+',
    tags: ['بازی', 'قوانین']
  },
  {
    id: 'k4-red-ext1',
    german: 'den Kopf frei kriegen',
    persian: 'ذهن خود را از دغدغه‌ها و فشارهای فکری آزاد و خالی کردن',
    category: 'Redewendungen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Film', pageOrTrack: 'S. 71', context: 'Beim Surfen auf der Eisbachwelle kriege ich den Kopf völlig frei.' }],
    pronunciation: '[deːn kɔp͡f ˈfʁaɪ̯ ˈkʁiːɡn̩]',
    explanation: 'با انجام یک فعالیت ورزشی یا تفریحی ذهن را از افکار استرس‌زا رها ساختن.',
    literalMeaning: 'سر را آزاد به دست آوردن',
    example: 'Ein einstündiger Waldlauf nach der Vorlesung hilft mir, den Kopf wieder ganz frei zu kriegen.',
    exampleTranslation: 'یک ساعت دویدن در جنگل پس از کلاس به من کمک می‌کند ذهنم را دوباره کاملاً آزاد سازم.',
    level: 'B1+',
    tags: ['اصطلاح', 'آرامش']
  },
  {
    id: 'k4-red-ext2',
    german: 'etwas nicht auf sich sitzen lassen',
    persian: 'توهین یا اتهامی را بی‌پاسخ نگذاشتن، دفاع سرسختانه کردن از حیثیت خود',
    category: 'Redewendungen',
    lesson: 4,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 4, module: 'Film', pageOrTrack: 'S. 71', context: 'Den Vorwurf wollte der Sportler nicht auf sich sitzen lassen.' }],
    pronunciation: '[ˈɛtvas nɪçt aʊ̯f zɪç ˈzɪtsn̩ ˈlasn̩]',
    explanation: 'نپذیرفتن انتقاد یا تهمت ناحق و نشان دادن واکنش قاطعانه.',
    literalMeaning: 'نگذاشتن چیزی روی فرد بنشیند',
    example: 'Die falsche Beschuldigung des Schiedsrichters wollte die Mannschaft keinesfalls auf sich sitzen lassen.',
    exampleTranslation: 'تیم به هیچ وجه حاضر نبود اتهام نادرست داور را بی‌پاسخ بگذارد و زیر بار آن برود.',
    level: 'B1+',
    tags: ['اصطلاح', 'دفاع']
  }
];

const ch4All = [...(existingData[4] || []), ...ch4Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter4.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_4_VOCABULARY: VocabularyItem[] = [\n${ch4All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter4.ts with', ch4All.length, 'items');
