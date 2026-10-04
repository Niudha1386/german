import fs from 'fs';

const existing = JSON.parse(fs.readFileSync('./scripts/existing_items.json', 'utf8'))[1] || [];

const extraItems = [
  // --- Nomen ---
  {
    id: 'k1-n-ext1',
    german: 'die Muttersprache',
    persian: 'زبان مادری',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Auftakt', pageOrTrack: 'S. 8', context: 'Zu Hause sprechen wir Arabisch, ich habe zwei Muttersprachen.' }],
    pronunciation: '[ˈmʊtɐˌʃpʁaːxə]',
    article: 'die',
    plural: 'die Muttersprachen',
    genderPersian: 'مونث (die)',
    example: 'Wer zweisprachig aufwächst, hat oft zwei Muttersprachen.',
    exampleTranslation: 'کسی که دوزبانه بزرگ می‌شود، اغلب دو زبان مادری دارد.',
    level: 'B1+',
    tags: ['زبان', 'هویت']
  },
  {
    id: 'k1-n-ext2',
    german: 'der Schornsteinfeger',
    persian: 'دودکش‌پاک‌کن (نماد خوش‌شانسی در فرهنگ آلمان)',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Auftakt', pageOrTrack: 'S. 9', context: 'Die meisten Leute freuen sich, mich zu sehen, weil sie glauben, dass ein Schornsteinfeger Glück bringt.' }],
    pronunciation: '[ˈʃɔʁnʃtaɪ̯nˌfeːɡɐ]',
    article: 'der',
    plural: 'die Schornsteinfeger',
    genderPersian: 'مذکر (der)',
    example: 'In Deutschland gilt der Schornsteinfeger als traditioneller Glücksbringer.',
    exampleTranslation: 'در آلمان، دودکش‌پاک‌کن به عنوان پیام‌آور سنتی خوش‌اقبالی شناخته می‌شود.',
    level: 'B1+',
    tags: ['شغل', 'فرهنگ']
  },
  {
    id: 'k1-n-ext3',
    german: 'die Leidenschaft',
    persian: 'علاقه مفرط، شور و شوق، عشق پرشور',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Auftakt', pageOrTrack: 'S. 9', context: 'Meine größte Leidenschaft ist Fußball.' }],
    pronunciation: '[ˈlaɪ̯dn̩ʃaft]',
    article: 'die',
    plural: 'die Leidenschaften',
    genderPersian: 'مونث (die)',
    example: 'Sie widmet sich mit großer Leidenschaft der klassischen Musik.',
    exampleTranslation: 'او با شور و اشتیاقی وافر خود را وقف موسیقی کلاسیک کرده است.',
    level: 'B1+',
    tags: ['احساسات', 'علاقه']
  },
  {
    id: 'k1-n-ext4',
    german: 'die Ernüchterung',
    persian: 'ناامیدی پس از خوش‌خیالی، سرخوردگی از واقعیت',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Doch der Anfangseuphorie folgte bald die Ernüchterung.' }],
    pronunciation: '[ɛɐ̯ˈnʏçtəʁʊŋ]',
    article: 'die',
    plural: 'die Ernüchterungen',
    genderPersian: 'مونث (die)',
    example: 'Nach den ersten Misserfolgen setzte bei den Gründern schnelle Ernüchterung ein.',
    exampleTranslation: 'پس از نخستین ناکامی‌ها، سرخوردگی زودهنگامی در میان بنیان‌گذاران پدیدار گشت.',
    level: 'B1+',
    tags: ['روانشناسی', 'واقعیت']
  },
  {
    id: 'k1-n-ext5',
    german: 'die Castingshow',
    persian: 'مسابقه تلویزیونی کشف استعداد',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Leonie nahm an einer Castingshow teil und kam in eine Band.' }],
    pronunciation: '[ˈkaːstɪŋˌʃoː]',
    article: 'die',
    plural: 'die Castingshows',
    genderPersian: 'مونث (die)',
    example: 'Viele junge Sänger erhoffen sich durch Castingshows einen schnellen Durchbruch.',
    exampleTranslation: 'بسیاری از خوانندگان جوان از طریق مسابقات استعدادیابی امید به موفقیتی سریع دارند.',
    level: 'B1+',
    tags: ['رسانه', 'موسیقی']
  },
  {
    id: 'k1-n-ext6',
    german: 'der Physiotherapeut',
    persian: 'فیزیوتراپیست، کارشناس توانبخشی فیزیکی',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Matthias machte eine Ausbildung zum Physiotherapeuten.' }],
    pronunciation: '[ˌfyziotʰeʁaˈpɔɪ̯t]',
    article: 'der',
    plural: 'die Physiotherapeuten',
    genderPersian: 'مذکر (der)',
    example: 'Nach der Knieoperation half ihm der erfahrene Physiotherapeut wieder beim Gehen.',
    exampleTranslation: 'پس از جراحی زانو، آن فیزیوتراپیست باتجربه در راه‌رفتن مجدد به او یاری رساند.',
    level: 'B1+',
    tags: ['پزشکی', 'شغل']
  },
  {
    id: 'k1-n-ext7',
    german: 'die Grenzerfahrung',
    persian: 'تجربه مرزهای توان روحی و جسمی، رویارویی با حداکثر توان',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Georg Schröder gilt heute als Experte für Abenteuer und Grenzerfahrungen.' }],
    pronunciation: '[ˈɡʁɛntsʔɛɐ̯ˌfaːʁʊŋ]',
    article: 'die',
    plural: 'die Grenzerfahrungen',
    genderPersian: 'مونث (die)',
    example: 'Die Expedition durch die Antarktis war für die Forscher eine lebensgefährliche Grenzerfahrung.',
    exampleTranslation: 'اکتشاف در قطب جنوب برای پژوهشگران تجربه‌ای خطیر در مرزهای توان بشری بود.',
    level: 'B1+',
    tags: ['ماجراجویی', 'روانشناسی']
  },
  {
    id: 'k1-n-ext8',
    german: 'die Eigenschaft',
    persian: 'ویژگی اخلاقی، خصوصیت فردی',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 2', pageOrTrack: 'S. 12', context: 'Welche Eigenschaften sind Ihnen bei einem Freund wichtig?' }],
    pronunciation: '[ˈaɪ̯ɡn̩ʃaft]',
    article: 'die',
    plural: 'die Eigenschaften',
    genderPersian: 'مونث (die)',
    example: 'Zuverlässigkeit und Ehrlichkeit sind unverzichtbare Eigenschaften wahrer Freunde.',
    exampleTranslation: 'قابل‌اعتماد بودن و صداقت از خصوصیات ضروری دوستان حقیقی هستند.',
    level: 'B1+',
    tags: ['شخصیت', 'روابط']
  },
  {
    id: 'k1-n-ext9',
    german: 'die Hilfsbereitschaft',
    persian: 'یاری‌رسانی، فداکاری و تمایل به کمک',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 2', pageOrTrack: 'S. 12', context: 'Hilfsbereitschaft ist eine geschätzte Eigenschaft.' }],
    pronunciation: '[ˈhɪlfsbəˌʁaɪ̯tʃaft]',
    article: 'die',
    plural: 'die Hilfsbereitschaft (معمولاً بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'Seine Hilfsbereitschaft zeigte sich sofort, als die Nachbarin Unterstützung benötigte.',
    exampleTranslation: 'تمایل او به یاری‌رسانی بی‌درنگ زمانی که همسایه نیاز به کمک داشت نمایان شد.',
    level: 'B1+',
    tags: ['اخلاق', 'شخصیت']
  },
  {
    id: 'k1-n-ext10',
    german: 'das Verantwortungsbewusstsein',
    persian: 'حس مسئولیت‌پذیری، وجدان کاری و اجتماعی',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 2', pageOrTrack: 'S. 12', context: 'Ein hohes Verantwortungsbewusstsein zeichnet Führungskräfte aus.' }],
    pronunciation: '[fɛɐ̯ˈʔantvɔʁtʊŋsbəˌvʊstzaɪ̯n]',
    article: 'das',
    plural: 'das Verantwortungsbewusstsein (بدون جمع)',
    genderPersian: 'خنثی (das)',
    example: 'Der Arzt handelte in der Notsituation mit vorbildlichem Verantwortungsbewusstsein.',
    exampleTranslation: 'پزشک در آن شرایط اضطراری با مسئولیت‌پذیری مثال‌زدنی عمل نمود.',
    level: 'B1+',
    tags: ['اخلاق', 'شغل']
  },
  {
    id: 'k1-n-ext11',
    german: 'die Verschwiegenheit',
    persian: 'رازداری، کتمان اسرار',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 2', pageOrTrack: 'S. 12', context: 'Verschwiegenheit ist eine Tugend guter Freunde.' }],
    pronunciation: '[fɛɐ̯ˈʃviːɡn̩haɪ̯t]',
    article: 'die',
    plural: 'die Verschwiegenheit (بدون جمع)',
    genderPersian: 'مونث (die)',
    example: 'Anwälte und Ärzte sind gesetzlich zur absoluten Verschwiegenheit verpflichtet.',
    exampleTranslation: 'وکلا و پزشکان از نظر قانونی موظف به رازداری مطلق هستند.',
    level: 'B1+',
    tags: ['شخصیت', 'قانون']
  },
  {
    id: 'k1-n-ext12',
    german: 'die Bahnhofsmission',
    persian: 'مرکز امداد و خدمات اجتماعی ایستگاه قطار',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 3', pageOrTrack: 'S. 15', context: 'Seit ca. 15 Jahren bin ich ehrenamtlich in der Bahnhofsmission tätig.' }],
    pronunciation: '[ˈbaːnhoːfs mɪˌsi̯oːn]',
    article: 'die',
    plural: 'die Bahnhofsmissionen',
    genderPersian: 'مونث (die)',
    example: 'Die Helfer der Bahnhofsmission unterstützen Reisende mit Behinderungen beim Umsteigen.',
    exampleTranslation: 'امدادگران مرکز ایستگاه قطار به مسافران دارای معلولیت هنگام تعویض قطار یاری می‌رسانند.',
    level: 'B1+',
    tags: ['خدمات اجتماعی', 'امداد']
  },
  {
    id: 'k1-n-ext13',
    german: 'das Hufeisen',
    persian: 'نعل اسب (نماد سنتی شانس)',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 4', pageOrTrack: 'S. 16', context: 'Das Hufeisen soll über der Haustür Glück bringen.' }],
    pronunciation: '[ˈhuːfˌʔaɪ̯zn̩]',
    article: 'das',
    plural: 'die Hufeisen',
    genderPersian: 'خنثی (das)',
    example: 'Ein Hufeisen über der Tür soll Unglück vom Hause fernhalten.',
    exampleTranslation: 'نعل اسب بالای در ورودی بنا بر باورها بدیمنی را از خانه دور می‌سازد.',
    level: 'B1+',
    tags: ['باورها', 'فرهنگ']
  },
  {
    id: 'k1-n-ext14',
    german: 'die Sternschnuppe',
    persian: 'شهاب‌ثاقب، تیر شهاب (آرزو کردن هنگام دیدن آن)',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 4', pageOrTrack: 'S. 16', context: 'Wenn man eine Sternschnuppe sieht, darf man sich etwas wünschen.' }],
    pronunciation: '[ˈʃtɛʁnˌʃnʊpə]',
    article: 'die',
    plural: 'die Sternschnuppen',
    genderPersian: 'مونث (die)',
    example: 'In klaren Sommernächten kann man oft eine leuchtende Sternschnuppe am Himmel entdecken.',
    exampleTranslation: 'در شب‌های صاف تابستانی اغلب می‌توان شهاب درخشانی را در آسمان مشاهده کرد.',
    level: 'B1+',
    tags: ['طبیعت', 'باورها']
  },
  {
    id: 'k1-n-ext15',
    german: 'die Müllabfuhr',
    persian: 'سازمان مدیریت پسماند و تخلیه سطل‌های زباله',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 4', pageOrTrack: 'S. 18', context: 'Die Müllabfuhr holte wie jeden Freitagmorgen die Mülltonnen ab.' }],
    pronunciation: '[ˈmʏlʔapˌfuːɐ̯]',
    article: 'die',
    plural: 'die Müllabfuhren',
    genderPersian: 'مونث (die)',
    example: 'Der laute Lkw der Müllabfuhr weckte die Anwohner schon um sechs Uhr morgens.',
    exampleTranslation: 'کامیون پرسروصدای تخلیه زباله ساکنان محله را در ساعت شش صبح بیدار کرد.',
    level: 'B1+',
    tags: ['خدمات شهری', 'زندگی روزمره']
  },
  {
    id: 'k1-n-ext16',
    german: 'der Kreißsaal',
    persian: 'اتاق زایمان در زایشگاه یا بیمارستان',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 4', pageOrTrack: 'S. 19', context: 'Wir waren etwa 13 Stunden im Kreißsaal, die Geburt verlief normal.' }],
    pronunciation: '[ˈkʁaɪ̯sˌzaːl]',
    article: 'der',
    plural: 'die Kreißsäle',
    genderPersian: 'مذکر (der)',
    example: 'Der werdende Vater durfte seine Frau im Kreißsaal während der gesamten Geburt begleiten.',
    exampleTranslation: 'به پدر آینده اجازه داده شد در تمام طول زایمان در اتاق زایمان در کنار همسرش باشد.',
    level: 'B1+',
    tags: ['پزشکی', 'خانواده']
  },
  {
    id: 'k1-n-ext17',
    german: 'der Nachwuchs',
    persian: 'نسل نوپا، فرزندان، استعدادهای جوان',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Porträt', pageOrTrack: 'S. 20', context: 'Ihre Popularität nutzt sie für die Förderung des musikalischen Nachwuchses.' }],
    pronunciation: '[ˈnaːxˌvuːks]',
    article: 'der',
    plural: 'der Nachwuchs (معمولاً بدون جمع)',
    genderPersian: 'مذکر (der)',
    example: 'Große Orchester investieren viel Geld in die gezielte Förderung des Nachwuchses.',
    exampleTranslation: 'ارکسترهای بزرگ مبالغ هنگفتی را برای پرورش هدفمند نسل نوپای نوازندگان سرمایه‌گذاری می‌کنند.',
    level: 'B1+',
    tags: ['هنر', 'آموزش']
  },
  {
    id: 'k1-n-ext18',
    german: 'die Ganztagesbetreuung',
    persian: 'مراقبت تمام‌وقت از کودکان در مهدکودک یا مدرسه',
    category: 'Nomen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Film', pageOrTrack: 'S. 23', context: 'Die Ganztagesbetreuung ist sowohl bei Kleinkindern als auch bei Schulkindern ein Problem.' }],
    pronunciation: '[ˈɡantsˌtaːɡəs bəˌtʁɔɪ̯ʊŋ]',
    article: 'die',
    plural: 'die Ganztagesbetreuungen',
    genderPersian: 'مونث (die)',
    example: 'Ohne gesicherte Ganztagesbetreuung können viele Mütter nicht Vollzeit arbeiten.',
    exampleTranslation: 'بدون تضمین مراقبت تمام‌وقت از کودکان، بسیاری از مادران توان کار تمام‌وقت را ندارند.',
    level: 'B1+',
    tags: ['خانواده', 'جامعه']
  },

  // --- Verben ---
  {
    id: 'k1-v-ext1',
    german: 'schlagen für',
    persian: 'تپیدن برای، عشق و علاقه شدید به چیزی داشتن',
    category: 'Verben',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Auftakt', pageOrTrack: 'S. 9', context: 'Mein Herz schlägt für Borussia Dortmund.' }],
    pronunciation: '[ˈʃlaːɡn̩ fyːɐ̯]',
    infinitive: 'schlagen für (+ Akk.)',
    present: 'schlägt für',
    preterite: 'schlug für',
    perfect: 'hat für ... geschlagen',
    auxiliary: 'haben',
    prepositionCase: 'für + Akkusativ',
    example: 'Sein Herz schlägt seit seiner Jugend für den Natur- und Tierschutz.',
    exampleTranslation: 'قلب او از دوران جوانی برای حفاظت از طبیعت و حیات وحش می‌تپد.',
    level: 'B1+',
    tags: ['احساسات', 'علاقه']
  },
  {
    id: 'k1-v-ext2',
    german: 'ausprobieren',
    persian: 'امتحان کردن، آزمودن روش‌ها یا تجارب جدید',
    category: 'Verben',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Ich habe viele Landschaften ausprobiert, aber die Wüste hat mich gefangen genommen.' }],
    pronunciation: '[ˈaʊ̯spʁoˌbiːʁən]',
    infinitive: 'ausprobieren (+ Akk.)',
    present: 'probiert aus',
    preterite: 'probierte aus',
    perfect: 'hat ausprobiert',
    auxiliary: 'haben',
    separable: true,
    example: 'Er möchte vor der endgültigen Berufswahl verschiedene Praktika ausprobieren.',
    exampleTranslation: 'او می‌خواهد پیش از گزینش نهایی شغل، دوره‌های کارآموزی گوناگونی را بیازماید.',
    level: 'B1+',
    tags: ['تلاش', 'تجربه']
  },
  {
    id: 'k1-v-ext3',
    german: 'gefangen nehmen',
    persian: 'مجذوب خود ساختن، مسحور و شیفته کردن',
    category: 'Verben',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Es war die Wüste, die mich vom ersten Schritt an gefangen genommen hat.' }],
    pronunciation: '[ɡəˈfaŋən ˌneːmən]',
    infinitive: 'gefangen nehmen (+ Akk.)',
    present: 'nimmt gefangen',
    preterite: 'nahm gefangen',
    perfect: 'hat gefangen genommen',
    auxiliary: 'haben',
    example: 'Die Schönheit der Berglandschaft hat die Touristen sofort gefangen genommen.',
    exampleTranslation: 'زیبایی چشم‌انداز کوهستان بی‌درنگ گردشگران را مسحور و مجذوب خود ساخت.',
    level: 'B1+',
    tags: ['احساسات', 'ادبیات']
  },
  {
    id: 'k1-v-ext4',
    german: 'anfeuern',
    persian: 'تشویق کردن و روحیه دادن پرشور به بازیکنان یا تیم',
    category: 'Verben',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 1', pageOrTrack: 'S. 10', context: 'Samstags gehe ich ins Stadion, um meinen alten Verein anzufeuern.' }],
    pronunciation: '[ˈanˌfɔɪ̯ɐn]',
    infinitive: 'anfeuern (+ Akk.)',
    present: 'feuert an',
    preterite: 'feuerte an',
    perfect: 'hat angefeuert',
    auxiliary: 'haben',
    separable: true,
    example: 'Tausende begeisterte Fans feuerten die Läufer beim Marathon lautstark an.',
    exampleTranslation: 'هزاران تماشاگر پرشور دوندگان را در دوی ماراتن با صدای بلند تشویق کردند.',
    level: 'B1+',
    tags: ['ورزش', 'هیجان']
  },
  {
    id: 'k1-v-ext5',
    german: 'sich einsetzen für',
    persian: 'تلاش و فداکاری کردن برای، دفاع همه‌جانبه کردن از',
    category: 'Verben',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 3', pageOrTrack: 'S. 15', context: 'Ich interessiere mich für meine Mitmenschen und setze mich gerne für sie ein.' }],
    pronunciation: '[zɪç ˈaɪ̯nˌzɛtsn̩ fyːɐ̯]',
    infinitive: 'sich einsetzen für (+ Akk.)',
    present: 'setzt sich ein',
    preterite: 'setzte sich ein',
    perfect: 'hat sich eingesetzt',
    auxiliary: 'haben',
    reflexive: true,
    separable: true,
    prepositionCase: 'für + Akkusativ',
    example: 'Martin Luther King setzte sich unermüdlich für die Bürgerrechte der Afroamerikaner ein.',
    exampleTranslation: 'مارتین لوتر کینگ خستگی‌ناپذیر برای حقوق مدنی سیاه‌پوستان آمریکا تلاش و مجاهدت کرد.',
    level: 'B1+',
    tags: ['عدالت', 'فعالیت اجتماعی']
  },
  {
    id: 'k1-v-ext6',
    german: 'beglückwünschen zu',
    persian: 'تبریک گفتن صمیمانه به مناسبت',
    category: 'Verben',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 4', pageOrTrack: 'S. 19', context: 'Wir beglückwünschen die frischgebackenen Eltern zur Geburt ihres Sohnes.' }],
    pronunciation: '[bəˈɡlʏkvʏnʃn̩ tsuː]',
    infinitive: 'beglückwünschen zu (+ Dat.)',
    present: 'beglückwünscht',
    preterite: 'beglückwünschte',
    perfect: 'hat beglückwünscht',
    auxiliary: 'haben',
    prepositionCase: 'zu + Dativ',
    example: 'Der Rektor beglückwünschte alle Absolventen zum erfolgreichen Masterabschluss.',
    exampleTranslation: 'رئیس دانشگاه به تمامی فارغ‌التحصیلان برای کسب موفقیت‌آمیز مدرک کارشناسی ارشد شادباش گفت.',
    level: 'B1+',
    tags: ['تبریک', 'اجتماعی']
  },

  // --- Adjektive & Adverbien ---
  {
    id: 'k1-adj-ext1',
    german: 'verschwiegen',
    persian: 'رازدار، تودار و دهان‌قرص',
    category: 'Adjektive',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 2', pageOrTrack: 'S. 12', context: 'Ein guter Freund sollte verständnisvoll und verschwiegen sein.' }],
    pronunciation: '[fɛɐ̯ˈʃviːɡn̩]',
    comparative: 'verschwiegener',
    superlative: 'am verschwiegensten',
    opposite: 'geschwätzig / unzuverlässig',
    example: 'Ihm kann man jedes Geheimnis anvertrauen, denn er ist absolut verschwiegen.',
    exampleTranslation: 'می‌توان به او هر رازی را سپرد، زیرا او بی‌اندازه رازدار و مطمئن است.',
    level: 'B1+',
    tags: ['شخصیت', 'دوستی']
  },
  {
    id: 'k1-adj-ext2',
    german: 'unternehmungslustig',
    persian: 'اهل گردش، پرانرژی و مشتاق فعالیت‌های هیجان‌انگیز',
    category: 'Adjektive',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Modul 2', pageOrTrack: 'S. 12', context: 'Meine Mitbewohnerin ist extrem unternehmungslustig.' }],
    pronunciation: '[ʊntɐˈneːmʊŋsˌlʊstɪç]',
    comparative: 'unternehmungslustiger',
    superlative: 'am unternehmungslustigsten',
    opposite: 'träge / faul',
    example: 'Am Wochenende verbringen die unternehmungslustigen Freunde kaum eine Stunde zu Hause.',
    exampleTranslation: 'آخر هفته‌ها آن دوستان پرشور و اهل گردش تقریباً یک ساعت هم در خانه نمی‌مانند.',
    level: 'B1+',
    tags: ['شخصیت', 'اوقات فراغت']
  },
  {
    id: 'k1-adj-ext3',
    german: 'karrierefeindlich',
    persian: 'مانع پیشرفت شغلی، زیان‌آور برای ارتقای رتبه کاری',
    category: 'Adjektive',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Film', pageOrTrack: 'S. 23', context: 'Vier von fünf Müttern arbeiten in karrierefeindlichen Teilzeitmodellen.' }],
    pronunciation: '[kaˈʁi̯eːʁəˌfaɪ̯ntlɪç]',
    comparative: 'karrierefeindlicher',
    superlative: 'am karrierefeindlichsten',
    opposite: 'karrierefördernd',
    example: 'Lange Erziehungszeiten gelten in manchen Firmen leider noch immer als karrierefeindlich.',
    exampleTranslation: 'مرخصی‌های طولانی زایمان در برخی شرکت‌ها متأسفانه همچنان مانعی برای پیشرفت شغلی تلقی می‌شوند.',
    level: 'B1+',
    tags: ['شغل', 'اقتصاد']
  },

  // --- Redewendungen ---
  {
    id: 'k1-red-ext1',
    german: 'etwas unter einen Hut bringen',
    persian: 'چند کار یا مسئولیت را با هم هماهنگ و جمع کردن',
    category: 'Redewendungen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Film', pageOrTrack: 'S. 22', context: 'Im Film: Wie bringt Sybille Milde Kind und Spitzenküche unter einen Hut?' }],
    pronunciation: '[ˈɛtvas ˈʊntɐ ˈaɪ̯nən ˈhuːt ˈbʁɪŋən]',
    explanation: 'موفق شدن در هماهنگی کارهای مختلف و بعضاً متعارض مانند خانواده و کار تمام‌وقت.',
    literalMeaning: 'چند چیز را زیر یک کلاه قرار دادن',
    example: 'Für berufstätige Alleinerziehende ist es oft ein Kunststück, Job und Kindererziehung unter einen Hut zu bringen.',
    exampleTranslation: 'برای افراد مجرد شاغل دارای فرزند، هماهنگ کردن شغل و تربیت فرزندان اغلب یک شاهکار واقعی است.',
    level: 'B1+',
    tags: ['اصطلاح', 'زندگی']
  },
  {
    id: 'k1-red-ext2',
    german: 'das Sagen haben',
    persian: 'همه‌کاره بودن، حرف آخر را زدن و تصمیم‌گیرنده اصلی بودن',
    category: 'Redewendungen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Film', pageOrTrack: 'S. 22', context: 'In der Küche hat die Chefköchin das Sagen.' }],
    pronunciation: '[das ˈzaːɡn̩ ˈhaːbn̩]',
    explanation: 'اختیار تصمیم‌گیری قاطع را در دست داشتن و رهبری مجموعه بر عهده داشتن.',
    literalMeaning: 'سخن و گفتار را در اختیار داشتن',
    example: 'Im Familienunternehmen hat seit über dreißig Jahren die Großmutter das Sagen.',
    exampleTranslation: 'در آن کسب‌وکار خانوادگی، بیش از سی سال است که مادربزرگ حرف اول و آخر را می‌زند.',
    level: 'B1+',
    tags: ['اصطلاح', 'قدرت']
  },
  {
    id: 'k1-red-ext3',
    german: 'ans Tageslicht kommen',
    persian: 'برملا شدن، آشکار شدن حقیقت پنهان',
    category: 'Redewendungen',
    lesson: 1,
    sources: ['Lehrbuch'],
    sourceDetails: [{ source: 'Lehrbuch', lesson: 1, module: 'Film', pageOrTrack: 'S. 22', context: 'Nach jahrelangen Recherchen kamen neue Fakten ans Tageslicht.' }],
    pronunciation: '[ans ˈtaːɡəsˌlɪçt ˈkɔmən]',
    explanation: 'آشکار شدن رازی که مدت‌ها مخفی نگه داشته شده بود.',
    literalMeaning: 'به روشنایی روز آمدن',
    example: 'Durch die gründlichen journalistischen Recherchen kam der Korruptionsskandal ans Tageslicht.',
    exampleTranslation: 'با تحقیقات دقیق روزنامه‌نگاری، رسوایی فساد مالی بر همگان آشکار شد.',
    level: 'B1+',
    tags: ['اصطلاح', 'حقیقت']
  }
];

// Helper to format item
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

const extraFormatted = extraItems.map(formatItem);

const allItems = [...existing, ...extraFormatted];

const fileContent = `import { VocabularyItem } from '../../types/vocabulary';

export const CHAPTER_1_VOCABULARY: VocabularyItem[] = [
${allItems.join(',\n')}
];
`;

fs.writeFileSync('./src/data/chapters/chapter1.ts', fileContent, 'utf8');
console.log('Successfully wrote src/data/chapters/chapter1.ts with', allItems.length, 'items');
