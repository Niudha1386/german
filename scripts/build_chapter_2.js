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
// CHAPTER 2
// ==========================================
const ch2Extra = [
  {
    id: 'k2-n-ext1',
    german: 'die Vorliebe',
    persian: 'ترجیح، علاقه و گرایش ویژه',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Auftakt', pageOrTrack: 'S. 25', context: 'Welcher Wohntyp sind Sie? Entdecken Sie Ihre Vorlieben.' }],
    pronunciation: '[ˈfoːɐ̯ˌliːbə]',
    article: 'die',
    plural: 'die Vorlieben',
    genderPersian: 'مونث (die)',
    example: 'Er hat eine besondere Vorliebe für alte historische Fachwerkhäuser auf dem Land.',
    exampleTranslation: 'او گرایش و علاقه ویژه‌ای به خانه‌های قدیمی و تاریخی سنتی در حومه شهر دارد.',
    level: 'B1+',
    tags: ['مسکن', 'علاقه']
  },
  {
    id: 'k2-n-ext2',
    german: 'die Notunterkunft',
    persian: 'سرپناه اضطراری، پناهگاه موقت برای بی‌خانمان‌ها',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 2', pageOrTrack: 'S. 28', context: 'Im eisigen Winter suchen viele Obdachlose Schutz in einer Notunterkunft.' }],
    pronunciation: '[ˈnoːtʔʊntɐˌkʊnft]',
    article: 'die',
    plural: 'die Notunterkünfte',
    genderPersian: 'مونث (die)',
    example: 'Die Stadtverwaltung richtete für die kalten Monate mehrere Notunterkünfte ein.',
    exampleTranslation: 'مدیریت شهری برای ماه‌های سرد سال چندین سرپناه اضطراری دایر کرد.',
    level: 'B1+',
    tags: ['اجتماعی', 'امداد']
  },
  {
    id: 'k2-n-ext3',
    german: 'die Suppenküche',
    persian: 'آشپزخانه خیریه (توزیع غذای گرم رایگان)',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 2', pageOrTrack: 'S. 28', context: 'Ehrenamtliche Helfer versorgen Bedürftige in der Suppenküche.' }],
    pronunciation: '[ˈzʊpn̩ˌkʏçə]',
    article: 'die',
    plural: 'die Suppenküchen',
    genderPersian: 'مونث (die)',
    example: 'In der Suppenküche erhalten bedürftige Menschen täglich eine warme Mahlzeit.',
    exampleTranslation: 'در آشپزخانه خیریه، افراد نیازمند روزانه یک وعده غذای گرم دریافت می‌کنند.',
    level: 'B1+',
    tags: ['خیریه', 'جامعه']
  },
  {
    id: 'k2-n-ext4',
    german: 'die Manege',
    persian: 'میدان یا صحنه مدور نمایش در سیرک',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 3', pageOrTrack: 'S. 30', context: 'Am Tag lernen Sie den Alltag in der Manege kennen.' }],
    pronunciation: '[maˈneːʒə]',
    article: 'die',
    plural: 'die Manegen',
    genderPersian: 'مونث (die)',
    example: 'Die Artisten zeigten in der Manege atemberaubende Akrobatik.',
    exampleTranslation: 'هنرمندان در میدان نمایش سیرک حرکات آکروباتیک نفس‌گیری را به نمایش گذاشتند.',
    level: 'B1+',
    tags: ['سیرک', 'هنر']
  },
  {
    id: 'k2-n-ext5',
    german: 'der Dompteur',
    persian: 'رام‌کننده و مربی حیوانات در سیرک',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 3', pageOrTrack: 'S. 30', context: 'Tür an Tür mit einem Elefanten oder einem Dompteur schlafen.' }],
    pronunciation: '[dɔmˈptøːɐ̯]',
    article: 'der',
    plural: 'die Dompteure',
    genderPersian: 'مذکر (der)',
    example: 'Der erfahrene Dompteur arbeitete ruhig und mit großem Respekt mit den Raubtieren.',
    exampleTranslation: 'آن مربی باتجربه حیوانات، با آرامش و احترامی فراوان با حیوانات درنده کار می‌کرد.',
    level: 'B1+',
    tags: ['شغل', 'سیرک']
  },
  {
    id: 'k2-n-ext6',
    german: 'die Gemütlichkeit',
    persian: 'دنجی، راحتی و صمیمیت فضای خانه',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 3', pageOrTrack: 'S. 30', context: 'Aber nicht jedem Menschen gefällt diese Gemütlichkeit.' }],
    pronunciation: '[ɡəˈmyːtlɪçkaɪ̯t]',
    article: 'die',
    plural: 'die Gemütlichkeit (بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'Der Kamin und die weichen Sofas verliehen dem Wohnzimmer eine wunderbare Gemütlichkeit.',
    exampleTranslation: 'شومینه و کاناپه‌های نرم به اتاق نشیمن دنجی و صمیمیت فوق‌العاده‌ای بخشیده بودند.',
    level: 'B1+',
    tags: ['خانه', 'احساسات']
  },
  {
    id: 'k2-n-ext7',
    german: 'der Ablösungsprozess',
    persian: 'فرآیند استقلال عاطفی و مکانی فرزند از والدین',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 4', pageOrTrack: 'S. 32', context: 'Eine Trennung gehört wegen liberalerer Erziehung nicht mehr selbstverständlich zum Ablösungsprozess.' }],
    pronunciation: '[ˈapˌløːzʊŋspʁoˌtsɛs]',
    article: 'der',
    plural: 'die Ablösungsprozesse',
    genderPersian: 'مذکر (der)',
    example: 'Der Ablösungsprozess von den Eltern verläuft bei jungen Erwachsenen sehr unterschiedlich.',
    exampleTranslation: 'فرآیند استقلال از والدین در جوانان به شیوه‌های بسیار گوناگونی پیش می‌رود.',
    level: 'B1+',
    tags: ['روانشناسی', 'خانواده']
  },
  {
    id: 'k2-n-ext8',
    german: 'das Wolkenkuckucksheim',
    persian: 'عالم هپروت، خیال‌پردازی دور از واقعیت (کنایه از قصر رویایی لودویگ دوم)',
    category: 'Nomen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Porträt', pageOrTrack: 'S. 36', context: 'Wohnen in Neuschwanstein: Meine Adresse? Wolkenkuckucksheim!' }],
    pronunciation: '[ˈvɔlkn̩ˌkʊkʊksˌhaɪ̯m]',
    article: 'das',
    plural: 'die Wolkenkuckucksheime',
    genderPersian: 'خنثی (das)',
    example: 'König Ludwig II. flüchtete vor den Pflichten der Politik in sein romantisches Wolkenkuckucksheim.',
    exampleTranslation: 'شاه لودویگ دوم از مسئولیت‌های سیاست به عالم رویایی و دور از واقعیت خود پناه برد.',
    level: 'B1+',
    tags: ['ادبیات', 'تاریخ']
  },
  {
    id: 'k2-v-ext1',
    german: 'verzichten auf',
    persian: 'صرف‌نظر کردن از، چشم‌پوشی نمودن از چیزی دلخواه',
    category: 'Verben',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Auftakt', pageOrTrack: 'S. 25', context: 'Ich kann auf das Auto verzichten, wenn der Nahverkehr gut funktioniert.' }],
    pronunciation: '[fɛɐ̯ˈtsɪçtn̩ ʔaʊ̯f]',
    infinitive: 'verzichten auf (+ Akk.)',
    present: 'verzichtet auf',
    preterite: 'verzichtete auf',
    perfect: 'hat auf ... verzichtet',
    auxiliary: 'haben',
    prepositionCase: 'auf + Akkusativ',
    example: 'Viele Stadtbewohner verzichten aus Umweltschutzgründen ganz bewusst auf ein eigenes Auto.',
    exampleTranslation: 'بسیاری از شهرنشینان به دلایل حفاظت از محیط زیست آگاهانه از خودروی شخصی چشم‌پوشی می‌کنند.',
    level: 'B1+',
    tags: ['زندگی شهری', 'تصمیم']
  },
  {
    id: 'k2-v-ext2',
    german: 'umfunktionieren zu',
    persian: 'تغییر کاربری دادن به، کاربرد جدید بخشیدن به شیء یا فضا',
    category: 'Verben',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 3', pageOrTrack: 'S. 30', context: 'Das alte Flugzeug wurde in Holland zum Hotel umfunktioniert.' }],
    pronunciation: '[ˈʊmfʊŋkt͡si̯oˌniːʁən]',
    infinitive: 'umfunktionieren zu (+ Dat.)',
    present: 'funktioniert um',
    preterite: 'funktionierte um',
    perfect: 'hat umfunktioniert',
    auxiliary: 'haben',
    separable: true,
    prepositionCase: 'zu + Dativ',
    example: 'Die alte Industriehalle wurde zu einem modernen Kulturzentrum und Theater umfunktioniert.',
    exampleTranslation: 'آن سوله قدیمی صنعتی به یک مرکز فرهنگی مدرن و سالن تئاتر تغییر کاربری داده شد.',
    level: 'B1+',
    tags: ['معماری', 'خلاقیت']
  },
  {
    id: 'k2-v-ext3',
    german: 'beherbergen',
    persian: 'مسکن دادن، پذیرایی و اسکان دادن در منزل خود',
    category: 'Verben',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 4', pageOrTrack: 'S. 32', context: 'Sie sehen es als selbstverständlich an, dass die Eltern sie beherbergen.' }],
    pronunciation: '[bəˈhɛʁbɛʁɡn̩]',
    infinitive: 'beherbergen (+ Akk.)',
    present: 'beherbergt',
    preterite: 'beherbergte',
    perfect: 'hat beherbergt',
    auxiliary: 'haben',
    example: 'Das Gästehaus beherbergt während der Festspiele zahlreiche internationale Künstler.',
    exampleTranslation: 'مهمان‌پذیر در طول جشنواره از هنرمندان بین‌المللی پرشماری پذیرایی و اسکان به عمل می‌آورد.',
    level: 'B1+',
    tags: ['اقامت', 'مهمان‌نوازی']
  },
  {
    id: 'k2-v-ext4',
    german: 'klarkommen mit',
    persian: 'کنار آمدن با، سازش و رابطه حسنه داشتن با کسی',
    category: 'Verben',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 4', pageOrTrack: 'S. 32', context: 'Fast 90 % geben an, mit ihren Eltern gut klarzukommen.' }],
    pronunciation: '[ˈklaːɐ̯ˌkɔmən mɪt]',
    infinitive: 'klarkommen mit (+ Dat.)',
    present: 'kommt klar',
    preterite: 'kam klar',
    perfect: 'ist klargekommen',
    auxiliary: 'sein',
    separable: true,
    prepositionCase: 'mit + Dativ',
    example: 'Die neuen WG-Mitbewohner kommen im Alltag erstaunlich gut miteinander klar.',
    exampleTranslation: 'هم‌خانه‌های جدید در زندگی روزمره به طرز شگفت‌آوری به خوبی با یکدیگر کنار می‌آیند.',
    level: 'B1+',
    tags: ['روابط', 'همزیستی']
  },
  {
    id: 'k2-v-ext5',
    german: 'abraten von',
    persian: 'منع کردن از، نصیحت به انجام ندادن کاری',
    category: 'Verben',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 4', pageOrTrack: 'S. 35', context: 'Johannes rät Matthias davon ab, wieder zu Hause einzuziehen.' }],
    pronunciation: '[ˈapˌʁaːtn̩ fɔn]',
    infinitive: 'abraten von (+ Dat.)',
    present: 'rät ab',
    preterite: 'riet ab',
    perfect: 'hat abgeraten',
    auxiliary: 'haben',
    separable: true,
    prepositionCase: 'von + Dativ',
    example: 'Der Finanzberater riet dem Kunden dringend von dieser riskanten Geldanlage ab.',
    exampleTranslation: 'مشاور مالی مشتری را مؤکداً از این سرمایه‌گذاری پرریسک برحذر داشت.',
    level: 'B1+',
    tags: ['مشاوره', 'تصمیم']
  },
  {
    id: 'k2-v-ext6',
    german: 'verwöhnen',
    persian: 'لوس کردن، بیش از حد به خواسته‌های کسی رسیدگی کردن',
    category: 'Verben',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Film', pageOrTrack: 'S. 38', context: 'Wahrscheinlich haben wir ihn als Kind zu sehr verwöhnt.' }],
    pronunciation: '[fɛɐ̯ˈvøːnən]',
    infinitive: 'verwöhnen (+ Akk.)',
    present: 'verwöhnt',
    preterite: 'verwöhnte',
    perfect: 'hat verwöhnt',
    auxiliary: 'haben',
    example: 'Die Großeltern verwöhnen ihre Enkelkinder bei jedem Wochenendbesuch mit Geschenken.',
    exampleTranslation: 'پدربزرگ و مادربزرگ در هر دیدار آخر هفته نوه‌هایشان را با هدایای فراوان غرق نوازش و لوس می‌کنند.',
    level: 'B1+',
    tags: ['خانواده', 'تربیت']
  },
  {
    id: 'k2-adj-ext1',
    german: 'menschenscheu',
    persian: 'مردم‌گریز، گریزان از جمع و معاشرت',
    category: 'Adjektive',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Porträt', pageOrTrack: 'S. 36', context: 'Über König Ludwig II.: Man beschreibt ihn als verträumt und menschenscheu.' }],
    pronunciation: '[ˈmɛnʃn̩ˌʃɔɪ̯]',
    comparative: 'menschenscheuer',
    superlative: 'am menschenscheuesten',
    opposite: 'kontaktfreudig / gesellig',
    example: 'Der einsame Künstler war so menschenscheu, dass er selten sein Atelier verließ.',
    exampleTranslation: 'آن هنرمند تنها به قدری مردم‌گریز بود که به ندرت از کارگاه هنری‌اش بیرون می‌رفت.',
    level: 'B1+',
    tags: ['شخصیت', 'روانشناسی']
  },
  {
    id: 'k2-red-ext1',
    german: 'auf eigenen Beinen stehen',
    persian: 'روی پای خود ایستادن، مستقل و خودکفا بودن',
    category: 'Redewendungen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 4', pageOrTrack: 'S. 33', context: 'Contra Hotel Mama: Junge Erwachsene sollten endlich auf eigenen Beinen stehen.' }],
    pronunciation: '[aʊ̯f ˈʔaɪ̯ɡnən ˈbaɪ̯nən ˈʃteːən]',
    explanation: 'از نظر مالی، مکانی و شخصی مستقل بودن و به والدین متکی نبودن.',
    literalMeaning: 'روی پاهای خود ایستادن',
    example: 'Nach dem Studienabschluss zog sie in eine eigene Wohnung, um endlich auf eigenen Beinen zu stehen.',
    exampleTranslation: 'پس از پایان تحصیلات دانشگاهی، به آپارتمانی مستقل نقل مکان کرد تا سرانجام روی پای خود بایستد.',
    level: 'B1+',
    tags: ['اصطلاح', 'استقلال']
  },
  {
    id: 'k2-red-ext2',
    german: 'Tür an Tür leben mit',
    persian: 'دیواربه‌دیوار و در همسایگی بسیار نزدیک زندگی کردن با',
    category: 'Redewendungen',
    lesson: 2,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 2, module: 'Modul 3', pageOrTrack: 'S. 30', context: 'Im Zirkushotel leben Sie Tür an Tür mit den Artisten.' }],
    pronunciation: '[tyːɐ̯ ʔan tyːɐ̯ ˈleːbn̩]',
    explanation: 'همسایه بسیار نزدیک بودن به نحوی که درب‌ها روبروی هم باشند.',
    literalMeaning: 'در به در زندگی کردن',
    example: 'In der studentischen Wohngemeinschaft leben Studenten aus fünf Kontinenten Tür an Tür.',
    exampleTranslation: 'در خوابگاه دانشجویی مشترک، دانشجویانی از پنج قاره دیواربه‌دیوار هم زندگی می‌کنند.',
    level: 'B1+',
    tags: ['اصطلاح', 'همسایگی']
  }
];

const ch2All = [...(existingData[2] || []), ...ch2Extra.map(formatItem)];
fs.writeFileSync('./src/data/chapters/chapter2.ts', `import { VocabularyItem } from '../../types/vocabulary';\n\nexport const CHAPTER_2_VOCABULARY: VocabularyItem[] = [\n${ch2All.join(',\n')}\n];\n`, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter2.ts with', ch2All.length, 'items');
