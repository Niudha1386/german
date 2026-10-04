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
// CHAPTER 5
// ==========================================
const ch5Extra = [
  {
    id: 'k5-n-ext1',
    german: 'die Volkshochschule',
    persian: 'کالج مردمی و مرکز آموزش بزرگسالان (vhs)',
    category: 'Nomen',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Modul 1', pageOrTrack: 'S. 74', context: 'Die Volkshochschulen sind die bedeutendsten Weiterbildungszentren für Erwachsene.' }],
    pronunciation: '[ˈfɔlksˌhoːxʃuːlə]',
    article: 'die',
    plural: 'die Volkshochschulen',
    genderPersian: 'مونث (die)',
    example: 'An der Volkshochschule kann man kostengünstig Sprachkurse und Weiterbildungen besuchen.',
    exampleTranslation: 'در کالج مردمی می‌توان دوره‌های زبان و مهارت‌آموزی تکمیلی را با هزینه‌ای مناسب گذراند.',
    level: 'B1+',
    tags: ['آموزش', 'موسسه']
  },
  {
    id: 'k5-n-ext2',
    german: 'die Medienkompetenz',
    persian: 'سواد رسانه‌ای، توانایی استفاده صحیح و هوشمندانه از ابزارهای دیجیتال',
    category: 'Nomen',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Modul 2', pageOrTrack: 'S. 76', context: 'Junge Menschen lernen mit Tablets und Smartphones wichtige Medienkompetenz.' }],
    pronunciation: '[ˈmeːdi̯ənkɔmpəˌtɛnts]',
    article: 'die',
    plural: 'die Medienkompetenz (بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'In der heutigen Informationsgesellschaft ist eine fundierte Medienkompetenz für Schüler unverzichtbar.',
    exampleTranslation: 'در جامعه اطلاعاتی امروز، سواد رسانه‌ای عمیق برای دانش‌آموزان امری حیاتی و غیرقابل چشم‌پوشی است.',
    level: 'B1+',
    tags: ['فناوری', 'آموزش']
  },
  {
    id: 'k5-n-ext3',
    german: 'die Entdeckerfreude',
    persian: 'لذت و شوق اکتشاف، اشتیاق درونی کودک به کشف ناشناخته‌ها',
    category: 'Nomen',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Porträt', pageOrTrack: 'S. 84', context: 'Gerald Hüther fordert ein Lernen, das Entdeckerfreude und Gestaltungslust fördert.' }],
    pronunciation: '[ɛntˈdɛkɐˌfʁɔɪ̯də]',
    article: 'die',
    plural: 'die Entdeckerfreude (بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'Kinder lernen am besten aus eigenem Antrieb und mit lebendiger Entdeckerfreude.',
    exampleTranslation: 'کودکان با انگیزه درونی و با شوق و لذت سرزنده اکتشاف به بهترین شکل یاد می‌گیرند.',
    level: 'B1+',
    tags: ['روانشناسی', 'کودک']
  },
  {
    id: 'k5-v-ext1',
    german: 'sich aneignen',
    persian: 'فراگرفتن، به دست آوردن و درونی‌سازی دانش یا مهارت جدید',
    category: 'Verben',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Porträt', pageOrTrack: 'S. 84', context: 'Man kann Kinder durch Druck zwingen, sich bestimmtes Wissen anzueignen.' }],
    pronunciation: '[zɪç ˈanˌʔaɪ̯ɡnən]',
    infinitive: 'sich (Dat.) Wissen aneignen',
    present: 'eignet sich an',
    preterite: 'eignete sich an',
    perfect: 'hat sich angeeignet',
    auxiliary: 'haben',
    reflexive: true,
    separable: true,
    example: 'Im Selbststudium hat er sich tiefgreifende Kenntnisse in der Programmierung angeeignet.',
    exampleTranslation: 'او از طریق خودآموزی دانش عمیقی در برنامه‌نویسی برای خود به دست آورد و فراگرفت.',
    level: 'B1+',
    tags: ['یادگیری', 'دانش']
  },
  {
    id: 'k5-v-ext2',
    german: 'beibringen',
    persian: 'آموزش دادن، یاد دادن مهارتی به شخصی دیگر',
    category: 'Verben',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Film', pageOrTrack: 'S. 86', context: 'Die Eltern brachten ihrer hochbegabten Tochter schon früh das Lesen bei.' }],
    pronunciation: '[ˈbaɪ̯ˌbʁɪŋən]',
    infinitive: 'jmdm. etwas beibringen',
    present: 'bringt bei',
    preterite: 'brachte bei',
    perfect: 'hat beigebracht',
    auxiliary: 'haben',
    separable: true,
    example: 'Der Großvater brachte dem Jungen geduldig das Schachspielen bei.',
    exampleTranslation: 'پدربزرگ با صبوری بازی شطرنج را به آن پسربچه آموخت.',
    level: 'B1+',
    tags: ['آموزش', 'مهارت']
  },
  {
    id: 'k5-adj-ext1',
    german: 'scharfsinnig',
    persian: 'تیزهوش، دارای درک و قضاوت فوق‌العاده سریع و عمیق',
    category: 'Adjektive',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Film', pageOrTrack: 'S. 86', context: 'Synonyme für intelligent: schlau, begabt, scharfsinnig.' }],
    pronunciation: '[ˈʃaʁfˌzɪnɪç]',
    comparative: 'scharfsinniger',
    superlative: 'am scharfsinnigsten',
    opposite: 'beschränkt / begriffsstutzig',
    example: 'Die scharfsinnige Analyse der Forscherin enthüllte die wahren Ursachen der Lernblockade.',
    exampleTranslation: 'تحلیل موشکافانه و تیزبینانه آن پژوهشگر، علل واقعی وقفه یادگیری را آشکار ساخت.',
    level: 'B1+',
    tags: ['هوش', 'شخصیت']
  },
  {
    id: 'k5-red-ext1',
    german: 'nicht auf den Kopf gefallen sein',
    persian: 'دست‌وپاچلفتی نبودن، باهوش و زرنگ بودن در برخورد با مسائل',
    category: 'Redewendungen',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Film', pageOrTrack: 'S. 86', context: 'Ausdrücke für Klugheit: nicht auf den Kopf gefallen sein.' }],
    pronunciation: '[nɪçt aʊ̯f deːn kɔp͡f ɡəˈfaln̩ zaɪ̯n]',
    explanation: 'کنایه از کسی که بسیار باهوش و کاردان است و کلاه سرش نمی‌رود.',
    literalMeaning: 'روی سر سقوط نکرده بودن',
    example: 'Keine Sorge um Felix, der ist nicht auf den Kopf gefallen und findet immer eine clevere Lösung.',
    exampleTranslation: 'نگران فلیکس نباشید؛ او فرد باهوش و زرنگی است و همواره راهکاری هوشمندانه می‌یابد.',
    level: 'B1+',
    tags: ['اصطلاح', 'هوش']
  },
  {
    id: 'k5-red-ext2',
    german: 'eine lange Leitung haben',
    persian: 'دوزاری‌اش دیر افتادن، کندفهم بودن در متوجه شدن یک نکته',
    category: 'Redewendungen',
    lesson: 5,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 5, module: 'Film', pageOrTrack: 'S. 86', context: 'Gegenteil von intelligent: eine lange Leitung haben.' }],
    pronunciation: '[ˈaɪ̯nə ˈlaŋə ˈlaɪ̯tʊŋ ˈhaːbn̩]',
    explanation: 'زمان بسیار زیادی نیاز داشتن برای فهمیدن شوخی یا موضوعی ساده.',
    literalMeaning: 'سیم‌کشی طولانی داشتن',
    example: 'Entschuldigung, heute habe ich wohl eine lange Leitung und verstehe den Witz erst jetzt.',
    exampleTranslation: 'ببخشید، امروز انگار دوزاری‌ام دیر افتاده و تازه شوخی را متوجه شدم.',
    level: 'B1+',
    tags: ['اصطلاح', 'شوخی']
  }
];

const ch5All = [...(existingData[5] || []), ...ch5Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter5.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_5_VOCABULARY: VocabularyItem[] = [\n${ch5All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter5.ts with', ch5All.length, 'items');

// ==========================================
// CHAPTER 6
// ==========================================
const ch6Extra = [
  {
    id: 'k6-n-ext1',
    german: 'der Fahrradkurier',
    persian: 'پیک دوچرخه‌ای (حمل سریع بسته‌ها و اسناد در شهرهای شلوغ)',
    category: 'Nomen',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Auftakt', pageOrTrack: 'S. 88', context: 'Ungewöhnliche Berufe: Fahrradkurier in der Großstadt.' }],
    pronunciation: '[ˈfaːɐ̯ʁaːt kuˌʁiːɐ̯]',
    article: 'der',
    plural: 'die Fahrradkuriere',
    genderPersian: 'مذکر (der)',
    example: 'Der flinke Fahrradkurier lieferte die eiligen Verträge trotz des Berufsverkehrs pünktlich ab.',
    exampleTranslation: 'آن پیک دوچرخه‌ای چابک با وجود ترافیک ساعات شلوغی، قراردادهای فوری را سر وقت تحویل داد.',
    level: 'B1+',
    tags: ['شغل', 'حمل‌ونقل']
  },
  {
    id: 'k6-n-ext2',
    german: 'das Arbeitszeugnis',
    persian: 'گواهی سابقه کار و ارزیابی عملکرد شغلی از سوی کارفرما',
    category: 'Nomen',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Modul 3', pageOrTrack: 'S. 94', context: 'Die Bewerbungsunterlagen sollten die Arbeitszeugnisse der letzten Arbeitgeber enthalten.' }],
    pronunciation: '[ˈʔaʁbaɪ̯tsˌtsɔɪ̯knɪs]',
    article: 'das',
    plural: 'die Arbeitszeugnisse',
    genderPersian: 'خنثی (das)',
    example: 'Ein exzellentes Arbeitszeugnis erleichtert die Suche nach einer neuen Führungsposition enorm.',
    exampleTranslation: 'یک گواهی سابقه کار عالی، یافتن منصب مدیریتی جدید را به مراتب آسان‌تر می‌سازد.',
    level: 'B1+',
    tags: ['رزومه', 'شغل']
  },
  {
    id: 'k6-n-ext3',
    german: 'der Alphirt',
    persian: 'چوپان و نگهبان مراتع ییلاقی در کوهستان آلپ',
    category: 'Nomen',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Modul 4', pageOrTrack: 'S. 96', context: 'Rudolf Helbling erfüllte sich seinen Traum und wurde Alphirt in Graubünden.' }],
    pronunciation: '[ˈalpfɪʁt]',
    article: 'der',
    plural: 'die Alphirten',
    genderPersian: 'مذکر (der)',
    example: 'Als Alphirt hütet er den gesamten Sommer über hunderte Rinder auf über zweitausend Metern Höhe.',
    exampleTranslation: 'به عنوان چوپان مراتع آلپی، او کل تابستان از صدها رأس گاو در ارتفاع بیش از دو هزار متر مراقبت می‌کند.',
    level: 'B1+',
    tags: ['شغل', 'طبیعت']
  },
  {
    id: 'k6-n-ext4',
    german: 'die Wanderschaft',
    persian: 'دوره کارآموزی و جهانگردی سنتی صنعتگران و نجاران (Walz)',
    category: 'Nomen',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Film', pageOrTrack: 'S. 102', context: 'Die Handwerksgesellen gehen nach der Lehrzeit auf Wanderschaft.' }],
    pronunciation: '[ˈvandɐʃaft]',
    article: 'die',
    plural: 'die Wanderschaften',
    genderPersian: 'مونث (die)',
    example: 'Während der dreijährigen Wanderschaft dürfen die Gesellen ihrer Heimatstadt nicht näher als 50 Kilometer kommen.',
    exampleTranslation: 'در طول دوره سه ساله سفر سنتی کاری، کارآموزان مجاز نیستند به زادگاه خود در فاصله‌ای کمتر از ۵۰ کیلومتر نزدیک شوند.',
    level: 'B1+',
    tags: ['سنت', 'صنعت']
  },
  {
    id: 'k6-v-ext1',
    german: 'bewirtschaften',
    persian: 'اداره کردن و بهره‌برداری اقتصادی نمودن از زمین یا اقامتگاه',
    category: 'Verben',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Modul 4', pageOrTrack: 'S. 96', context: 'Eine Berghütte oder Alp im Sommer wirtschaftlich bewirtschaften.' }],
    pronunciation: '[bəˈvɪʁtʃaftn̩]',
    infinitive: 'bewirtschaften (+ Akk.)',
    present: 'bewirtschaftet',
    preterite: 'bewirtschaftete',
    perfect: 'hat bewirtschaftet',
    auxiliary: 'haben',
    example: 'Die Bergbauernfamilie bewirtschaftet die Almhütte seit vier Generationen.',
    exampleTranslation: 'خانواده کشاورزان کوهستان کلبه ییلاقی را به مدت چهار نسل است که اداره و مدیریت می‌کنند.',
    level: 'B1+',
    tags: ['کشاورزی', 'مدیریت']
  },
  {
    id: 'k6-v-ext2',
    german: 'überreden zu',
    persian: 'قانع کردن کسی با اصرار و مجاب نمودن او به انجام کاری',
    category: 'Verben',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Modul 4', pageOrTrack: 'S. 99', context: 'Sie wollen den Animator überreden, nicht aufzugeben.' }],
    pronunciation: '[ˌyːbɐˈʁeːdn̩ tsuː]',
    infinitive: 'überreden zu (+ Dat.)',
    present: 'überredet',
    preterite: 'überredete',
    perfect: 'hat überredet',
    auxiliary: 'haben',
    prepositionCase: 'zu + Dativ',
    example: 'Sein bester Freund überredete ihn schließlich zur Bewerbung auf die begehrte Stelle.',
    exampleTranslation: 'بهترین دوستش سرانجام او را متقاعد و مجاب کرد که برای آن شغل پرطرفدار درخواست دهد.',
    level: 'B1+',
    tags: ['ارتباطات', 'مذاکره']
  },
  {
    id: 'k6-red-ext1',
    german: 'von der Hand in den Mund leben',
    persian: 'زندگی بخور و نمیر داشتن، درآمد روزانه را فوراً خرج کردن',
    category: 'Redewendungen',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Film', pageOrTrack: 'S. 103', context: 'Auf der Walz hat man wenig Geld und lebt oft von der Hand in den Mund.' }],
    pronunciation: '[fɔn deːɐ̯ hant ɪn deːn mʊnt ˈleːbn̩]',
    explanation: 'هیچ پس‌اندازی نداشتن و هر چه کسب می‌شود صرف نیازهای ابتدایی روزانه کردن.',
    literalMeaning: 'از دست درون دهان زندگی کردن',
    example: 'Viele junge Künstler ohne festen Vertrag müssen monatelang von der Hand in den Mund leben.',
    exampleTranslation: 'بسیاری از هنرمندان جوان بدون قرارداد ثابت مجبورند ماه‌ها با زندگی بخور و نمیر و بی‌پس‌انداز سر کنند.',
    level: 'B1+',
    tags: ['اصطلاح', 'اقتصاد']
  },
  {
    id: 'k6-red-ext2',
    german: 'per Anhalter unterwegs sein',
    persian: 'رایگان‌سواری کردن، با هیچ‌هایکینگ سفر کردن',
    category: 'Redewendungen',
    lesson: 6,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 6, module: 'Film', pageOrTrack: 'S. 102', context: 'Handwerksgesellen sind traditionell nur zu Fuß oder per Anhalter unterwegs.' }],
    pronunciation: '[pɛɐ̯ ˈanˌhaltɐ ˈʊntɐveːks zaɪ̯n]',
    explanation: 'کنار جاده منتظر خودروهای عبوری ماندن و سوار شدن بدون پرداخت هزینه.',
    literalMeaning: 'توسط نگه‌دارنده خودروها در راه بودن',
    example: 'In den Semesterferien reiste die Studentin per Anhalter quer durch ganz Skandinavien.',
    exampleTranslation: 'در تعطیلات پایان ترم، آن دانشجو با رایگان‌سواری سرتاسر اسکاندیناوی را سفر کرد.',
    level: 'B1+',
    tags: ['اصطلاح', 'سفر']
  }
];

const ch6All = [...(existingData[6] || []), ...ch6Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter6.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_6_VOCABULARY: VocabularyItem[] = [\n${ch6All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter6.ts with', ch6All.length, 'items');
