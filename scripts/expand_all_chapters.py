import json
import os
import re

with open('./scripts/existing_items.json', 'r', encoding='utf-8') as f:
    existing_items = json.load(f)

def clean_item_str(s):
    s = s.strip()
    if s.endswith(','):
        s = s[:-1].strip()
    return s

# Dictionary of additional curated words per chapter extracted from Aspekte neu B1+ Lehrbuch
# Each entry is a dict with all necessary fields
chapter_data = {
    1: [
        # Nomen
        {"id": "k1-n-c1", "german": "der Lebenslauf", "persian": "رزومه، شرح سوابق تحصیلی و شغلی", "category": "Nomen", "lesson": 1, "article": "der", "plural": "die Lebensläufe", "genderPersian": "مذکر (der)", "pronunciation": "[ˈleːbn̩sˌlaʊ̯f]", "example": "Ein lückenloser Lebenslauf ist für jede Bewerbung entscheidend.", "exampleTranslation": "یک رزومه بدون وقفه برای هر درخواست استخدامی تعیین‌کننده است.", "tags": ["کار", "شغل"]},
        {"id": "k1-n-c2", "german": "die Bewerbung", "persian": "درخواست کار یا پذیرش تحصیلی", "category": "Nomen", "lesson": 1, "article": "die", "plural": "die Bewerbungen", "genderPersian": "مونث (die)", "pronunciation": "[bəˈvɛʁbʊŋ]", "example": "Sie hat gestern ihre Bewerbung an die Universitätsklinik geschickt.", "exampleTranslation": "او دیروز درخواست استخدام خود را به کلینیک دانشگاه ارسال کرد.", "tags": ["شغل", "ارتباطات"]},
        {"id": "k1-n-c3", "german": "die Qualifikation", "persian": "شایستگی، مهارت و مدرک تخصصی", "category": "Nomen", "lesson": 1, "article": "die", "plural": "die Qualifikationen", "genderPersian": "مونث (die)", "pronunciation": "[kvaliﬁkaˈt͡si̯oːn]", "example": "Für diesen anspruchsvollen Posten benötigt man hohe Qualifikationen.", "exampleTranslation": "برای این سمت کاری دشوار، مهارت‌ها و مدارک بالایی لازم است.", "tags": ["مهارت", "شغل"]},
        {"id": "k1-n-c4", "german": "die Eigenschaft", "persian": "صفت، خصوصیت و ویژگی فردی", "category": "Nomen", "lesson": 1, "article": "die", "plural": "die Eigenschaften", "genderPersian": "مونث (die)", "pronunciation": "[ˈaɪ̯ɡn̩ʃaft]", "example": "Geduld und Empathie sind wesentliche Eigenschaften einer Lehrkraft.", "exampleTranslation": "صبر و همدلی از ویژگی‌های بنیادین یک آموزگار هستند.", "tags": ["شخصیت", "روانشناسی"]},
        {"id": "k1-n-c5", "german": "die Zuverlässigkeit", "persian": "قابلیت اطمینان، وقت‌شناسی و امانتداری", "category": "Nomen", "lesson": 1, "article": "die", "plural": "die Zuverlässigkeit", "genderPersian": "مونث (die)", "pronunciation": "[ˈtsuːfɛɐ̯ˌlɛsɪçkaɪ̯t]", "example": "Die Kollegen schätzen seine enorme Zuverlässigkeit bei Projekten.", "exampleTranslation": "همکاران به قابلیت اطمینان فوق‌العاده او در پروژه‌ها ارج می‌نهند.", "tags": ["اخلاق", "کار"]},
        {"id": "k1-n-c6", "german": "der Vorfall", "persian": "اتفاق، حادثه غیرمنتظره", "category": "Nomen", "lesson": 1, "article": "der", "plural": "die Vorfälle", "genderPersian": "مذکر (der)", "pronunciation": "[ˈfoːɐ̯ˌfal]", "example": "Der Vorfall am Bahnhof wurde von der Polizei genau untersucht.", "exampleTranslation": "حادثه رخ‌داده در ایستگاه قطار توسط پلیس به دقت بررسی شد.", "tags": ["رویداد", "خبر"]},
        {"id": "k1-n-c7", "german": "die Maßnahme", "persian": "اقدام، تدبیر عملی", "category": "Nomen", "lesson": 1, "article": "die", "plural": "die Maßnahmen", "genderPersian": "مونث (die)", "pronunciation": "[ˈmaːsˌnaːmə]", "example": "Die Bundesregierung beschloss sofortige Maßnahmen zur Krisenbewältigung.", "exampleTranslation": "دولت اقدامات فوری را برای مهار بحران تصویب کرد.", "tags": ["سیاست", "مدیریت"]},
        {"id": "k1-n-c8", "german": "die Unterstützung", "persian": "پشتیبانی، حمایت مادی یا معنوی", "category": "Nomen", "lesson": 1, "article": "die", "plural": "die Unterstützungen", "genderPersian": "مونث (die)", "pronunciation": "[ʊntɐˈʃtʏtsʊŋ]", "example": "Mit der finanziellen Unterstützung der Familie baute er seine Praxis auf.", "exampleTranslation": "با حمایت مالی خانواده، او مطب خود را راه‌اندازی نمود.", "tags": ["خانواده", "یاری"]},
        # Verben
        {"id": "k1-v-c1", "german": "abschließen", "persian": "به پایان رساندن، فارغ‌التحصیل شدن، قفل کردن", "category": "Verben", "lesson": 1, "infinitive": "abschließen", "present": "schließt ab", "preterite": "schloss ab", "perfect": "hat abgeschlossen", "auxiliary": "haben", "separable": True, "pronunciation": "[ˈapˌʃliːsn̩]", "example": "Er schloss sein Medizinstudium mit Bestnote ab.", "exampleTranslation": "او تحصیلات پزشکی خود را با بالاترین نمره به پایان رساند.", "tags": ["تحصیل", "موفقیت"]},
        {"id": "k1-v-c2", "german": "sich bewerben um", "persian": "تقاضای شغلی دادن برای، کاندیدا شدن", "category": "Verben", "lesson": 1, "infinitive": "sich bewerben um (+ Akk.)", "present": "bewirbt sich", "preterite": "bewarb sich", "perfect": "hat sich beworben", "auxiliary": "haben", "reflexive": True, "prepositionCase": "um + Akkusativ", "pronunciation": "[zɪç bəˈvɛʁbn̩ ʔʊm]", "example": "Sie bewarb sich zielstrebig um das Stipendium im Ausland.", "exampleTranslation": "او با اراده راسخ برای بورسیه تحصیلی خارج از کشور درخواست داد.", "tags": ["شغل", "تحصیل"]},
        {"id": "k1-v-c3", "german": "vertrauen", "persian": "اعتماد داشتن به، اطمینان کردن", "category": "Verben", "lesson": 1, "infinitive": "vertrauen (+ Dat.)", "present": "vertraut", "preterite": "vertraute", "perfect": "hat vertraut", "auxiliary": "haben", "prepositionCase": "Dativ", "pronunciation": "[fɛɐ̯ˈtʁaʊ̯ən]", "example": "Gute Freunde vertrauen einander bedingungslos.", "exampleTranslation": "دوستان خوب بدون قید و شرط به یکدیگر اعتماد دارند.", "tags": ["روابط", "احساسات"]},
        {"id": "k1-v-c4", "german": "überwinden", "persian": "غلبه کردن بر، پشت سر گذاشتن موانع", "category": "Verben", "lesson": 1, "infinitive": "überwinden (+ Akk.)", "present": "überwindet", "preterite": "überwand", "perfect": "hat überwunden", "auxiliary": "haben", "pronunciation": "[ˌyːbɐˈvɪndn̩]", "example": "Gemeinsam überwanden die Partner alle schwierigen Lebenskrisen.", "exampleTranslation": "آن دو شریک همراه با هم بر تمامی بحران‌های دشوار زندگی غلبه کردند.", "tags": ["موفقیت", "تلاش"]},
        {"id": "k1-v-c5", "german": "scheitern an", "persian": "شکست خوردن به علت، به بن‌بست رسیدن", "category": "Verben", "lesson": 1, "infinitive": "scheitern an (+ Dat.)", "present": "scheitert", "preterite": "scheiterte", "perfect": "ist gescheitert", "auxiliary": "sein", "prepositionCase": "an + Dativ", "pronunciation": "[ˈʃaɪ̯tɐn ʔan]", "example": "Der Plan scheiterte letztlich an fehlenden finanziellen Mitteln.", "exampleTranslation": "آن نقشه در نهایت به دلیل کمبود منابع مالی با شکست مواجه شد.", "tags": ["تجربه", "مشکلات"]},
        # Adjektive
        {"id": "k1-adj-c1", "german": "zielstrebig", "persian": "هدفمند، بااراده و مصمم در راه هدف", "category": "Adjektive", "lesson": 1, "comparative": "zielstrebiger", "superlative": "am zielstrebigsten", "opposite": "planlos", "pronunciation": "[ˈtsiːlˌʃtʁeːbɪç]", "example": "Die junge Wissenschaftlerin verfolgte zielstrebig ihre Forschungskarriere.", "exampleTranslation": "آن دانشمند جوان با اراده‌ای مصمم حرفه پژوهشی خود را دنبال نمود.", "tags": ["شخصیت", "اراده"]},
        {"id": "k1-adj-c2", "german": "kontaktfreudig", "persian": "خونگرم، اهل ارتباط و معاشرت آسان با دیگران", "category": "Adjektive", "lesson": 1, "comparative": "kontaktfreudiger", "superlative": "am kontaktfreudigsten", "opposite": "zurückhaltend / schüchtern", "pronunciation": "[kɔnˈtaktˌfʁɔɪ̯dɪç]", "example": "Als kontaktfreudiger Mensch knüpft er überall spielend neue Bekanntschaften.", "exampleTranslation": "به عنوان انسانی خونگرم، او در هر مکانی به سادگی آشنایی‌های جدیدی رقم می‌زند.", "tags": ["شخصیت", "دوستی"]},
        # Redewendungen
        {"id": "k1-red-c1", "german": "jemandem die Daumen drücken", "persian": "برای کسی آرزوی موفقیت کردن", "category": "Redewendungen", "lesson": 1, "explanation": "آرزوی پیروزی و موفقیت قلبی برای کسی داشتن.", "literalMeaning": "شست‌ها را برای کسی فشردن", "pronunciation": "[ˈjeːmandm̩ diː ˈdaʊ̯mən ˈdʁʏkn̩]", "example": "Ich drücke dir für die morgige Führerscheinprüfung ganz fest die Daumen!", "exampleTranslation": "برای آزمون رانندگی فردایت از صمیم قلب آرزوی موفقیت می‌کنم!", "tags": ["اصطلاح", "آرزو"]},
        {"id": "k1-red-c2", "german": "Glück im Unglück haben", "persian": "در اوج بدبیاری شانس آوردن (قسر در رفتن)", "category": "Redewendungen", "lesson": 1, "explanation": "هنگامی که حادثه‌ای رخ می‌دهد اما پیامد فاجعه‌باری به بار نمی‌آورد.", "literalMeaning": "در دل بدشانسی، شانس داشتن", "pronunciation": "[ɡlʏk ɪm ˈʔʊnɡlʏk ˈhaːbn̩]", "example": "Das Auto war zerstört, aber der Fahrer hatte Glück im Unglück und blieb unverletzt.", "exampleTranslation": "خودرو به کلی داغون شد، ولی راننده قسر در رفت و بدون کوچکترین جراحتی نجات یافت.", "tags": ["اصطلاح", "شانس"]}
    ],
    2: [
        # Nomen
        {"id": "k2-n-c1", "german": "die Wohnfläche", "persian": "متراژ زیربنای مسکونی", "category": "Nomen", "lesson": 2, "article": "die", "plural": "die Wohnflächen", "genderPersian": "مونث (die)", "pronunciation": "[ˈvoːnˌflɛçə]", "example": "Die helle Vierzimmerwohnung bietet 120 Quadratmeter Wohnfläche.", "exampleTranslation": "این آپارتمان چهارخوابه روشن ۱۲۰ مترمربع زیربنای مسکونی دارد.", "tags": ["مسکن", "معماری"]},
        {"id": "k2-n-c2", "german": "die Nebenkosten", "persian": "هزینه‌های جانبی ساختمان (شارژ، آب، گرمایش)", "category": "Nomen", "lesson": 2, "article": "die", "plural": "die Nebenkosten (Plural)", "genderPersian": "مونث (die)", "pronunciation": "[ˈneːbn̩ˌkɔstn̩]", "example": "In der Warmmiete sind alle Nebenkosten wie Heizung und Wasser bereits enthalten.", "exampleTranslation": "در اجاره کامل، تمامی هزینه‌های جانبی نظیر سیستم گرمایشی و آب لحاظ شده است.", "tags": ["مسکن", "مالی"]},
        {"id": "k2-n-c3", "german": "die Kaution", "persian": "ودیعه مسکن، مبلغ رهن یا بیعانه امانت", "category": "Nomen", "lesson": 2, "article": "die", "plural": "die Kautionen", "genderPersian": "مونث (die)", "pronunciation": "[kaʊ̯ˈt͡si̯oːn]", "example": "Vor dem Einzug verlangte der Vermieter drei Nettokaltmieten als Kaution.", "exampleTranslation": "پیش از تحویل کلید، صاحب‌خانه معادل سه ماه اجاره خالص را به عنوان ودیعه مطالبه کرد.", "tags": ["مسکن", "قانون"]},
        {"id": "k2-n-c4", "german": "die Privatsphäre", "persian": "حریم خصوصی، خلوت شخصی", "category": "Nomen", "lesson": 2, "article": "die", "plural": "die Privatsphäre", "genderPersian": "مونث (die)", "pronunciation": "[pʁiˈvaːtˌsfɛːʁə]", "example": "In einer großen Wohngemeinschaft schätzt jeder Mitbewohner seine eigene Privatsphäre.", "exampleTranslation": "در یک خانه دانشجویی مشترک پرجمعیت، هر یک از هم‌اتاقی‌ها برای حریم خصوصی خود ارزش قائل است.", "tags": ["حقوق", "زندگی"]},
        # Verben
        {"id": "k2-v-c1", "german": "einrichten", "persian": "مبلمان و دکوراسیون کردن، چیدمان خانه", "category": "Verben", "lesson": 2, "infinitive": "einrichten (+ Akk.)", "present": "richtet ein", "preterite": "richtete ein", "perfect": "hat eingerichtet", "auxiliary": "haben", "separable": True, "pronunciation": "[ˈaɪ̯nˌʁɪçtn̩]", "example": "Sie richteten ihre neue Altbauwohnung mit stilvollen Holzmöbeln ein.", "exampleTranslation": "آن‌ها آپارتمان نوساز قدیمی خود را با مبلمان چوبی شیک و فاخر چیدمان کردند.", "tags": ["خانه", "طراحی"]},
        {"id": "k2-v-c2", "german": "pendeln", "persian": "رفت‌وآمد روزانه میان دو شهر یا منطقه مسکونی و محل کار", "category": "Verben", "lesson": 2, "infinitive": "pendeln", "present": "pendelt", "preterite": "pendelte", "perfect": "ist gependelt", "auxiliary": "sein", "pronunciation": "[ˈpɛndl̩n]", "example": "Weil die Mieten im Zentrum unbezahlbar sind, pendelt er täglich mit der Bahn.", "exampleTranslation": "چون اجاره‌ها در مرکز شهر سرسام‌آور است، او روزانه با قطار رفت‌وآمد می‌کند.", "tags": ["حمل‌ونقل", "کار"]},
        # Adjektive
        {"id": "k2-adj-c1", "german": "geräumig", "persian": "جادار، فراخ و دلباز", "category": "Adjektive", "lesson": 2, "comparative": "geräumiger", "superlative": "am geräumigsten", "opposite": "beengt / winzig", "pronunciation": "[ɡəˈʁɔɪ̯mɪç]", "example": "Die Familie bezog eine geräumige Wohnung mit großem Balkon zum Garten.", "exampleTranslation": "خانواده به آپارتمانی جادار و دلباز با بالکنی بزرگ رو به حیاط نقل مکان کرد.", "tags": ["مسکن", "توصیف"]},
        # Redewendungen
        {"id": "k2-red-c1", "german": "die eigenen vier Wände", "persian": "چهاردیواری خود، خانه مستقل شخصی", "category": "Redewendungen", "lesson": 2, "explanation": "کنایه از استقلال و داشتن سرپناه و ملک شخصی.", "literalMeaning": "چهار دیواره خود شخص", "pronunciation": "[diː ˈʔaɪ̯ɡnən fiːɐ̯ ˈvɛndə]", "example": "Nach jahrelangem Sparen erfüllte sie sich den Traum von den eigenen vier Wänden.", "exampleTranslation": "پس از سال‌ها پس‌انداز، او به آرزوی داشتن چهاردیواری مستقل خود جامه عمل پوشاند.", "tags": ["اصطلاح", "مسکن"]}
    ],
    3: [
        # Nomen
        {"id": "k3-n-c1", "german": "das Wohlbefinden", "persian": "تندرستی، احساس سلامت جسمانی و روانی کامل", "category": "Nomen", "lesson": 3, "article": "das", "plural": "das Wohlbefinden", "genderPersian": "خنثی (das)", "pronunciation": "[ˈvoːlbəˌfɪndn̩]", "example": "Regelmäßiger Sport und bewusste Ernährung steigern das Wohlbefinden spürbar.", "exampleTranslation": "ورزش منظم و تغذیه آگاهانه تندرستی و نشاط جسم و روان را به طور ملموس ارتقا می‌بخشد.", "tags": ["سلامت", "زندگی"]},
        {"id": "k3-n-c2", "german": "die Vorbeugung", "persian": "پیشگیری، مراقبت بازدارنده از بیماری", "category": "Nomen", "lesson": 3, "article": "die", "plural": "die Vorbeugungen", "genderPersian": "مونث (die)", "pronunciation": "[ˈfoːɐ̯ˌbɔɪ̯ɡʊŋ]", "example": "Zur Vorbeugung von Herz-Kreislauf-Erkrankungen empfiehlt der Arzt tägliche Spaziergänge.", "exampleTranslation": "پزشک برای پیشگیری از بیماری‌های قلبی-عروقی پیاده‌روی روزانه را توصیه می‌کند.", "tags": ["پزشکی", "پیشگیری"]},
        {"id": "k3-n-c3", "german": "der Muskelkater", "persian": "گرفتگی و درد عضلانی پس از ورزش سنگین", "category": "Nomen", "lesson": 3, "article": "der", "plural": "die Muskelkater", "genderPersian": "مذکر (der)", "pronunciation": "[ˈmʊskl̩ˌkaːtɐ]", "example": "Nach dem intensiven Marathon-Training plagte ihn ein schmerzhafter Muskelkater.", "exampleTranslation": "پس از تمرین فشرده ماراتن، درد و کوفتگی عضلانی شدیدی او را آزار داد.", "tags": ["ورزش", "بدن"]},
        # Verben
        {"id": "k3-v-c1", "german": "vorbeugen", "persian": "پیشگیری کردن، مانع بروز بیماری یا بحران شدن", "category": "Verben", "lesson": 3, "infinitive": "vorbeugen (+ Dat.)", "present": "beugt vor", "preterite": "beugte vor", "perfect": "hat vorgebeugt", "auxiliary": "haben", "separable": True, "prepositionCase": "Dativ", "pronunciation": "[ˈfoːɐ̯ˌbɔɪ̯ɡn̩]", "example": "Wer ausreichend Wasser trinkt, beugt gefährlichen Kopfschmerzen vor.", "exampleTranslation": "کسی که به اندازه کافی آب بنوشد، از سردردهای آزاردهنده پیشگیری می‌نماید.", "tags": ["سلامت", "پیشگیری"]},
        {"id": "k3-v-c2", "german": "lindern", "persian": "تسکین دادن، کاستن از شدت درد یا التهاب", "category": "Verben", "lesson": 3, "infinitive": "lindern (+ Akk.)", "present": "lindert", "preterite": "linderte", "perfect": "hat gelindert", "auxiliary": "haben", "pronunciation": "[ˈlɪndɐn]", "example": "Der heiße Kräutertee linderte den quälenden Husten bereits nach kurzer Zeit.", "exampleTranslation": "دمنوش گیاهی داغ سرفه آزاردهنده را پس از مدت کوتاهی تسکین بخشید.", "tags": ["درمان", "دارو"]},
        # Adjektive
        {"id": "k3-adj-c1", "german": "bekömmlich", "persian": "زودهضم، سازگار با دستگاه گوارش", "category": "Adjektive", "lesson": 3, "comparative": "bekömmlicher", "superlative": "am bekömmlichsten", "opposite": "schwer verdaulich", "pronunciation": "[bəˈkœmlɪç]", "example": "Gedünstetes Gemüse ist für den gereizten Magen besonders bekömmlich.", "exampleTranslation": "سبزیجات بخارپز برای معده حساس و تحریک‌شده بسیار زودهضم و ملایم است.", "tags": ["غذا", "سلامت"]},
        # Redewendungen
        {"id": "k3-red-c1", "german": "die Zähne zusammenbeißen", "persian": "دندان روی جگر گذاشتن، سختی‌ها را با شجاعت تحمل کردن", "category": "Redewendungen", "lesson": 3, "explanation": "در برابر درد، خستگی یا مشکلات تسلیم نشدن و استقامت ورزیدن.", "literalMeaning": "دندان‌ها را روی هم فشردن", "pronunciation": "[diː ˈtsɛːnə tsuˈzamənˌbaɪ̯sn̩]", "example": "In den letzten Prüfungstagen hieß es für die Medizinstudenten: Zähne zusammenbeißen und durchhalten!", "exampleTranslation": "در روزهای پایانی آزمون‌ها دانشجویان پزشکی باید دندان روی جگر می‌گذاشتند و مقاومت می‌کردند!", "tags": ["اصطلاح", "صبر"]}
    ],
    4: [
        # Nomen
        {"id": "k4-n-c1", "german": "das Vergnügen", "persian": "لذت، خوشی و تفریح مسرت‌بخش", "category": "Nomen", "lesson": 4, "article": "das", "plural": "die Vergnügen", "genderPersian": "خنثی (das)", "pronunciation": "[fɛɐ̯ˈɡnyːɡn̩]", "example": "Das Konzert der philharmonischen Musiker war ein unvergessliches Vergnügen.", "exampleTranslation": "کنسرت نوازندگان فیلارمونیک لذتی فراموش‌نشدنی و سرشار از شادمانی بود.", "tags": ["هنر", "لذت"]},
        {"id": "k4-n-c2", "german": "die Aufführung", "persian": "اجرا، نمایش زنده تئاتر یا اپرا", "category": "Nomen", "lesson": 4, "article": "die", "plural": "die Aufführungen", "genderPersian": "مونث (die)", "pronunciation": "[ˈaʊ̯fˌfyːʁʊŋ]", "example": "Die Premiere der Theateraufführung wurde vom Publikum mit Standing Ovations gefeiert.", "exampleTranslation": "نخستین شب اجرای تئاتر با تشویق ایستاده تماشاگران گرامی داشته شد.", "tags": ["تئاتر", "هنر"]},
        {"id": "k4-n-c3", "german": "das Drehbuch", "persian": "فیلم‌نامه، سناریوی نمایشی", "category": "Nomen", "lesson": 4, "article": "das", "plural": "die Drehbücher", "genderPersian": "خنثی (das)", "pronunciation": "[ˈdʁeːˌbuːx]", "example": "Für sein packendes Drehbuch erhielt der Autor den renommierten Filmpreis.", "exampleTranslation": "نویسنده برای فیلم‌نامه جذاب و پرکشش خود جایزه معتبر سینمایی را دریافت نمود.", "tags": ["سینما", "نویسندگی"]},
        # Verben
        {"id": "k4-v-c1", "german": "inszenieren", "persian": "کارگردانی کردن، به روی صحنه بردن اثر نمایشی", "category": "Verben", "lesson": 4, "infinitive": "inszenieren (+ Akk.)", "present": "inszeniert", "preterite": "inszenierte", "perfect": "hat inszeniert", "auxiliary": "haben", "pronunciation": "[ɪnsʦeˈniːʁən]", "example": "Die Regisseurin inszenierte das klassische Drama in einer modernen, mutigen Fassung.", "exampleTranslation": "کارگردان درام کلاسیک را در برداشتی مدرن و جسورانه به روی صحنه آورد.", "tags": ["تئاتر", "هنر"]},
        {"id": "k4-v-c2", "german": "riskieren", "persian": "به خطر انداختن، خطر کاری را به جان خریدن", "category": "Verben", "lesson": 4, "infinitive": "riskieren (+ Akk.)", "present": "riskiert", "preterite": "riskierte", "perfect": "hat riskiert", "auxiliary": "haben", "pronunciation": "[ʁɪsˈkiːʁən]", "example": "Beim Extremklettern ohne Seilsicherung riskiert man leichtfertig sein Leben.", "exampleTranslation": "در صخره‌نوردی بدون طناب ایمنی، انسان جان خویش را با بی‌باکی تمام به خطر می‌اندازد.", "tags": ["ورزش", "خطر"]},
        # Adjektive
        {"id": "k4-adj-c1", "german": "fesselnd", "persian": "گیرا، مجذوب‌کننده و نفس‌گیر", "category": "Adjektive", "lesson": 4, "comparative": "fesselnder", "superlative": "am fesselndsten", "opposite": "langweilig", "pronunciation": "[ˈfɛsl̩nt]", "example": "Der historische Abenteuerroman war von der ersten bis zur letzten Seite fesselnd.", "exampleTranslation": "آن رمان ماجراجویانه تاریخی از صفحه نخستین تا انتها گیرا و مسحورکننده بود.", "tags": ["کتاب", "توصیف"]},
        # Redewendungen
        {"id": "k4-red-c1", "german": "ins Schwarze treffen", "persian": "به هدف زدن، تیر به خال نشاندن، حرف کاملاً درست زدن", "category": "Redewendungen", "lesson": 4, "explanation": "دقیقاً به نکته اصلی و درست اشاره کردن یا موفقیت کامل کسب نمودن.", "literalMeaning": "به مرکز سیاه هدف زدن", "pronunciation": "[ɪns ˈʃvaʁtsə ˈtʁɛfn̩]", "example": "Mit ihrer treffenden Filmbesprechung traf die junge Kritikerin voll ins Schwarze.", "exampleTranslation": "آن منتقد جوان با نقد دقیق فیلم کاملاً به هدف زد و نکته اصلی را بیان کرد.", "tags": ["اصطلاح", "دقت"]}
    ],
    5: [
        # Nomen
        {"id": "k5-n-c1", "german": "die Neugier", "persian": "کنجکاوی، اشتیاق درونی به دانستن و کشف", "category": "Nomen", "lesson": 5, "article": "die", "plural": "die Neugier (بدون جمع)", "genderPersian": "مونث (die)", "pronunciation": "[ˈnɔɪ̯ˌɡiːɐ̯]", "example": "Wissenschaftliche Entdeckungen basieren auf unstillbarer menschlicher Neugier.", "exampleTranslation": "کشفیات علمی بر پایه کنجکاوی سیری‌ناپذیر بشریت استوار هستند.", "tags": ["روانشناسی", "دانش"]},
        {"id": "k5-n-c2", "german": "das Fachwissen", "persian": "دانش تخصصی، علم و تسلط حرفه‌ای", "category": "Nomen", "lesson": 5, "article": "das", "plural": "das Fachwissen (بدون جمع)", "genderPersian": "خنثی (das)", "pronunciation": "[ˈfaxˌvɪsn̩]", "example": "Er beeindruckte die Prüfungskommission durch sein tiefes theoretisches Fachwissen.", "exampleTranslation": "او با دانش تخصصی عمیق و تئوریک خود هیئت داوران آزمون را تحت تأثیر قرار داد.", "tags": ["تخصص", "آموزش"]},
        # Verben
        {"id": "k5-v-c1", "german": "memorieren", "persian": "حفظ کردن، به حافظه سپردن آگاهانه واژگان و متون", "category": "Verben", "lesson": 5, "infinitive": "memorieren (+ Akk.)", "present": "memoriert", "preterite": "memorierte", "perfect": "hat memoriert", "auxiliary": "haben", "pronunciation": "[memoˈʁiːʁən]", "example": "Mit visuellen Karteikarten lassen sich schwierige Fremdwörter schneller memorieren.", "exampleTranslation": "با فلش‌کارت‌های تصویری می‌توان لغات دشوار خارجی را با سرعتی بالاتر به خاطر سپرد.", "tags": ["یادگیری", "روش"]},
        {"id": "k5-v-c2", "german": "begreifen", "persian": "درک کردن، عمق مطلبی را فهمیدن", "category": "Verben", "lesson": 5, "infinitive": "begreifen (+ Akk.)", "present": "begreift", "preterite": "begriff", "perfect": "hat begriffen", "auxiliary": "haben", "pronunciation": "[bəˈɡʁaɪ̯fn̩]", "example": "Es dauerte einige Zeit, bis die Schüler den abstrakten mathematischen Beweis begriffen.", "exampleTranslation": "مدتی زمان برد تا دانش‌آموزان به درک اثبات انتزاعی ریاضی نائل شوند.", "tags": ["فهم", "هوش"]},
        # Adjektive
        {"id": "k5-adj-c1", "german": "wissbegierig", "persian": "دانش‌پژوه، تشنه یادگیری و دانش‌اندوزی", "category": "Adjektive", "lesson": 5, "comparative": "wissbegieriger", "superlative": "am wissbegierigsten", "opposite": "desinteressiert", "pronunciation": "[ˈvɪsbəˌɡiːʁɪç]", "example": "Die wissbegierigen Kursteilnehmer stellten der Dozentin unzählige Fachfragen.", "exampleTranslation": "فراگیران تشنه علم کلاس پرسش‌های تخصصی بی‌شماری را از استاد جویا شدند.", "tags": ["شخصیت", "یادگیری"]},
        # Redewendungen
        {"id": "k5-red-c1", "german": "Übung macht den Meister", "persian": "کار نیکو کردن از پر کردن است (با ممارست استاد می‌شوی)", "category": "Redewendungen", "lesson": 5, "explanation": "تکرار و تمرین مستمر تنها راه کسب تبحر و مهارت در هر زمینه‌ای است.", "literalMeaning": "تمرین از فرد استاد می‌سازد", "pronunciation": "[ˈyːbʊŋ maxt deːn ˈmaɪ̯stɐ]", "example": "Verzweifle nicht beim Grammatiklernen: Übung macht schließlich den Meister!", "exampleTranslation": "در یادگیری گرامر ناامید مشو؛ چرا که کار نیکو کردن از پر کردن است و تمرین استاد می‌سازد!", "tags": ["اصطلاح", "موفقیت"]}
    ],
    6: [
        # Nomen
        {"id": "k6-n-c1", "german": "der Arbeitnehmer", "persian": "کارمند، شاغل و حقوق‌بگیر", "category": "Nomen", "lesson": 6, "article": "der", "plural": "die Arbeitnehmer", "genderPersian": "مذکر (der)", "pronunciation": "[ˈʔaʁbaɪ̯tˌneːmɐ]", "example": "Der Tarifvertrag regelt die Arbeitszeiten und Urlaubsansprüche aller Arbeitnehmer.", "exampleTranslation": "قرارداد دسته‌جمعی کار ساعات کاری و مرخصی تمامی کارمندان و کارگران را تعیین می‌نماید.", "tags": ["قانون کار", "شغل"]},
        {"id": "k6-n-c2", "german": "die Gleitzeit", "persian": "ساعت کاری شناور و انعطاف‌پذیر", "category": "Nomen", "lesson": 6, "article": "die", "plural": "die Gleitzeit (بدون جمع)", "genderPersian": "مونث (die)", "pronunciation": "[ˈɡlaɪ̯tˌtsaɪ̯t]", "example": "Dank Gleitzeit kann sie morgens ihre Kinder in Ruhe zur Schule bringen.", "exampleTranslation": "به لطف ساعات کاری شناور، او می‌تواند با آرامش فرزندانش را صبح‌ها به مدرسه برساند.", "tags": ["کار", "زمان"]},
        {"id": "k6-n-c3", "german": "die Beförderung", "persian": "ترفیع رتبه شغلی، ارتقای مقام سازمانی", "category": "Nomen", "lesson": 6, "article": "die", "plural": "die Beförderungen", "genderPersian": "مونث (die)", "pronunciation": "[bəˈfœʁdəʁʊŋ]", "example": "Nach dem erfolgreichen Projektabschluss erhielt er die verdiente Beförderung zum Abteilungsleiter.", "exampleTranslation": "پس از به پایان رساندن موفق پروژه، او به ترفیع شایسته ریاست بخش نائل گشت.", "tags": ["ارتقاء", "مدیریت"]},
        # Verben
        {"id": "k6-v-c1", "german": "verhandeln über", "persian": "مذاکره کردن و چانه‌زنی بر سر شرایط یا قرارداد", "category": "Verben", "lesson": 6, "infinitive": "verhandeln über (+ Akk.)", "present": "verhandelt", "preterite": "verhandelte", "perfect": "hat verhandelt", "auxiliary": "haben", "prepositionCase": "über + Akkusativ", "pronunciation": "[fɛɐ̯ˈhandl̩n ˈyːbɐ]", "example": "Die Gewerkschaft verhandelt mit den Arbeitgebern über eine faire Gehaltserhöhung.", "exampleTranslation": "اتحادیه صنفی پیرامون افزایش منصفانه حقوق با کارفرمایان در حال مذاکره است.", "tags": ["مذاکره", "حقوق"]},
        {"id": "k6-v-c2", "german": "qualifizieren für", "persian": "واجد شرایط ساختن، مهارت کافی کسب کردن برای", "category": "Verben", "lesson": 6, "infinitive": "sich qualifizieren für (+ Akk.)", "present": "qualifiziert sich", "preterite": "qualifizierte sich", "perfect": "hat sich qualifiziert", "auxiliary": "haben", "reflexive": True, "prepositionCase": "für + Akkusativ", "pronunciation": "[kvaliﬁˈt͡siːʁən fyːɐ̯]", "example": "Durch die Weiterbildung qualifizierte sie sich für internationale Managementaufgaben.", "exampleTranslation": "با گذراندن دوره تکمیلی، او شایستگی وظایف مدیریتی در سطح بین‌المللی را احراز نمود.", "tags": ["شغل", "مهارت"]},
        # Adjektive
        {"id": "k6-adj-c1", "german": "belastbar", "persian": "دارای توان کاری و مقاومت روحی بالا در برابر فشارهای شغلی", "category": "Adjektive", "lesson": 6, "comparative": "belastbarer", "superlative": "am belastbarsten", "opposite": "stressanfällig", "pronunciation": "[bəˈlastbaːɐ̯]", "example": "In der Notaufnahme des Krankenhauses sucht man hoch belastbare Fachkräfte.", "exampleTranslation": "در بخش اورژانس بیمارستان نیروهای متخصصی با توان تاب‌آوری و مقاومت بالا جستجو می‌شوند.", "tags": ["شغل", "شخصیت"]},
        # Redewendungen
        {"id": "k6-red-c1", "german": "sich ins Zeug legen", "persian": "از جان مایه گذاشتن، نهایت تلاش و همت خود را به کار بستن", "category": "Redewendungen", "lesson": 6, "explanation": "تلاش و فعالیت بسیار سخت و فشرده برای رسیدن به یک هدف کاری.", "literalMeaning": "خود را در رکاب و ابزار کار نهادن", "pronunciation": "[zɪç ɪns ˈt͡sɔɪ̯k ˈleːɡn̩]", "example": "Um die Deadline einzuhalten, legte sich das gesamte Team am Wochenende mächtig ins Zeug.", "exampleTranslation": "جهت اتمام کار تا موعد مقرر، تمام تیم در آخر هفته از جان مایه گذاشتند و تمام توان را به کار بستند.", "tags": ["اصطلاح", "کار"]}
    ],
    7: [
        # Nomen
        {"id": "k7-n-c1", "german": "das Traumpaar", "persian": "زوج رویایی، زن و شوهری که کمال همسانی و عشق را دارند", "category": "Nomen", "lesson": 7, "article": "das", "plural": "die Traumpaare", "genderPersian": "خنثی (das)", "pronunciation": "[ˈtʁaʊ̯mˌpaːɐ̯]", "example": "In den Medien wurden die beiden Schauspieler lange Zeit als Traumpaar gefeiert.", "exampleTranslation": "در رسانه‌ها آن دو بازیگر برای مدت‌های مدید به عنوان زوج رویایی شناخته می‌شدند.", "tags": ["عشق", "سینما"]},
        {"id": "k7-n-c2", "german": "die Sehnsucht", "persian": "دلتنگی سوزان، حسرت و اشتیاق قلبی عمیق به کسی یا جایی", "category": "Nomen", "lesson": 7, "article": "die", "plural": "die Sehnsüchte", "genderPersian": "مونث (die)", "pronunciation": "[ˈzeːnˌzʊxt]", "example": "Nach monatelanger räumlicher Trennung quälte sie eine unstillbare Sehnsucht nach ihm.", "exampleTranslation": "پس از ماه‌ها دوری مکانی، دلتنگی سوزان و تسکین‌ناپذیری برای او وجودش را فراگرفت.", "tags": ["عاطفه", "احساسات"]},
        # Verben
        {"id": "k7-v-c1", "german": "schwärmen für", "persian": "عاشقانه ستودن، شیفته و شیدای کسی یا چیزی بودن", "category": "Verben", "lesson": 7, "infinitive": "schwärmen für (+ Akk.)", "present": "schwärmt", "preterite": "schwärmte", "perfect": "hat geschwärmt", "auxiliary": "haben", "prepositionCase": "für + Akkusativ", "pronunciation": "[ˈʃvɛʁmən fyːɐ̯]", "example": "Schon als Teenager schwärmte sie heimlich für den berühmten Pianisten.", "exampleTranslation": "حتی از دوران نوجوانی، او پنهانی شیفته و شیدای آن پیانیست پرآوازه بود.", "tags": ["عشق", "احساس"]},
        {"id": "k7-v-c2", "german": "sich versöhnen mit", "persian": "آشتی کردن با، کدورت را کنار گذاشتن", "category": "Verben", "lesson": 7, "infinitive": "sich versöhnen mit (+ Dat.)", "present": "versöhnt sich", "preterite": "versöhnte sich", "perfect": "hat sich versöhnt", "auxiliary": "haben", "reflexive": True, "prepositionCase": "mit + Dativ", "pronunciation": "[zɪç fɛɐ̯ˈzøːnən mɪt]", "example": "Nach dem langen Schweigen versöhnten sich die beiden Schwestern von Herzen.", "exampleTranslation": "پس از سکوتی طولانی، آن دو خواهر از صمیم قلب با یکدیگر آشتی نمودند.", "tags": ["روابط", "صلح"]},
        # Adjektive
        {"id": "k7-adj-c1", "german": "eifersüchtig", "persian": "حسود و بدبین در روابط عاطفی", "category": "Adjektive", "lesson": 7, "comparative": "eifersüchtiger", "superlative": "am eifersüchtigsten", "opposite": "gelassen / vertrauensvoll", "pronunciation": "[ˈaɪ̯fɐˌzʏçtɪç]", "example": "Seine unbegründet eifersüchtige Art zerstörte schließlich das Vertrauen in der Ehe.", "exampleTranslation": "خلق‌وخوی حسادت بی‌اساس او سرانجام اعتماد را در پیوند زناشویی متلاشی ساخت.", "tags": ["روانشناسی", "روابط"]},
        # Redewendungen
        {"id": "k7-red-c1", "german": "Schmetterlinge im Bauch haben", "persian": "در تب‌وتاب عاشقی بودن، احساس پروانه‌وار و هیجان شدید عاشقانه داشتن", "category": "Redewendungen", "lesson": 7, "explanation": "احساس شورانگیز، دل‌پیچه شیرین و هیجان شدید در اوایل دوران دلدادگی.", "literalMeaning": "پروانه‌ها را در شکم داشتن", "pronunciation": "[ˈʃmɛtɐlɪŋə ɪm baʊ̯x ˈhaːbn̩]", "example": "Immer wenn sie an ihn dachte, hatte sie sofort Schmetterlinge im Bauch.", "exampleTranslation": "هرگاه به او می‌اندیشید، بی‌درنگ در دل احساس پروانه‌وار و تب‌وتاب شیرین عشق را حس می‌کرد.", "tags": ["اصطلاح", "عشق"]}
    ],
    8: [
        # Nomen
        {"id": "k8-n-c1", "german": "die Preissteigerung", "persian": "افزایش قیمت‌ها، گرانی کالاها", "category": "Nomen", "lesson": 8, "article": "die", "plural": "die Preissteigerungen", "genderPersian": "مونث (die)", "pronunciation": "[ˈpʁaɪ̯sˌʃtaɪ̯ɡəʁʊŋ]", "example": "Wegen der hohen Energiepreise spüren die Verbraucher deutliche Preissteigerungen.", "exampleTranslation": "به دلیل بهای بالای انرژی، مصرف‌کنندگان افزایش چشمگیر قیمت‌ها را لمس می‌کنند.", "tags": ["اقتصاد", "قیمت"]},
        {"id": "k8-n-c2", "german": "die Gewährleistung", "persian": "ضمانت قانونی اصالت و سلامت کالا از سوی فروشنده", "category": "Nomen", "lesson": 8, "article": "die", "plural": "die Gewährleistungen", "genderPersian": "مونث (die)", "pronunciation": "[ɡəˈveːɐ̯ˌlaɪ̯stʊŋ]", "example": "Nach deutschem Recht beträgt die gesetzliche Gewährleistung für Neugeräte zwei Jahre.", "exampleTranslation": "طبق قوانین آلمان، ضمانت قانونی برای دستگاه‌های نو به مدت دو سال تعیین گردیده است.", "tags": ["قانون", "خرید"]},
        # Verben
        {"id": "k8-v-c1", "german": "beanstanden", "persian": "ایراد قانونی گرفتن از عیب کالا، معترض بودن به کیفیت شیء", "category": "Verben", "lesson": 8, "infinitive": "beanstanden (+ Akk.)", "present": "beanstandet", "preterite": "beanstandete", "perfect": "hat beanstandet", "auxiliary": "haben", "pronunciation": "[bəˈʔanʃtandn̩]", "example": "Der Kunde beanstandete den Kratzer auf dem Display des neuen Laptops sofort.", "exampleTranslation": "مشتری بلافاصله به وجود خط‌وخش روی نمایشگر لپ‌تاپ جدید معترض گردید و ایراد گرفت.", "tags": ["شکایت", "خرید"]},
        {"id": "k8-v-c2", "german": "zurückerstatten", "persian": "پس دادن وجه، بازپرداخت کامل مبلغ پرداختی خریدار", "category": "Verben", "lesson": 8, "infinitive": "zurückerstatten (+ Akk.)", "present": "erstattet zurück", "preterite": "erstattete zurück", "perfect": "hat zurückerstattet", "auxiliary": "haben", "separable": True, "pronunciation": "[tsuˈʁʏkʔɛɐ̯ˌʃtatn̩]", "example": "Der Online-Händler erstattete den vollen Kaufpreis innerhalb weniger Tage zurück.", "exampleTranslation": "فروشگاه اینترنتی ظرف مدت چند روز کل بهای پرداختی را عودت داد و پس فرستاد.", "tags": ["مالی", "تجارت"]},
        # Adjektive
        {"id": "k8-adj-c1", "german": "erschwinglich", "persian": "مقرون‌به‌صرفه، متناسب با توان مالی عموم مردم", "category": "Adjektive", "lesson": 8, "comparative": "erschwinglicher", "superlative": "am erschwinglichsten", "opposite": "unbezahlbar", "pronunciation": "[ɛɐ̯ˈʃvɪŋlɪç]", "example": "Ziel der Initiative ist es, bezahlbaren und erschwinglichen Wohnraum anzubieten.", "exampleTranslation": "هدف این پویش ارائه مسکنی با قیمت قابل‌قبول و مقرون‌به‌صرفه برای شهروندان است.", "tags": ["قیمت", "اقتصاد"]},
        # Redewendungen
        {"id": "k8-red-c1", "german": "das Geld zum Fenster hinauswerfen", "persian": "پول را دور ریختن، ولخرجی بی‌حساب‌وکتاب کردن", "category": "Redewendungen", "lesson": 8, "explanation": "خرج کردن بیهوده و حیف‌ومیل کردن دارایی‌ها در امور بی‌فایده.", "literalMeaning": "پول را از پنجره به بیرون پرت کردن", "pronunciation": "[das ɡɛlt tsʊm ˈfɛnstɐ hɪˈnaʊ̯sˌvɛʁfn̩]", "example": "Wer ständig teure Markenkleidung kauft, wirft sein hart verdientes Geld förmlich zum Fenster hinaus.", "exampleTranslation": "کسی که همواره لباس‌های مارک‌دار گران‌قیمت می‌خرد، پول زحمت‌کشیده‌اش را رسماً دور می‌ریزد.", "tags": ["اصطلاح", "پول"]}
    ],
    9: [
        # Nomen
        {"id": "k9-n-c1", "german": "die Pauschalreise", "persian": "تور مسافرتی جامع (شامل پرواز، ترانسفر، هتل و خدمات)", "category": "Nomen", "lesson": 9, "article": "die", "plural": "die Pauschalreisen", "genderPersian": "مونث (die)", "pronunciation": "[paʊ̯ˈʃaːlˌʁaɪ̯zə]", "example": "Familien mit kleinen Kindern buchen für den Sommerurlaub gerne bequeme Pauschalreisen.", "exampleTranslation": "خانواده‌های دارای کودکان خردسال برای تعطیلات تابستان تمایل به رزرو تورهای جامع مسافرتی دارند.", "tags": ["سفر", "گردشگری"]},
        {"id": "k9-n-c2", "german": "die Sehenswürdigkeit", "persian": "جاذبه گردشگری، مکان تاریخی و دیدنی شهر", "category": "Nomen", "lesson": 9, "article": "die", "plural": "die Sehenswürdigkeiten", "genderPersian": "مونث (die)", "pronunciation": "[ˈzeːənsˌvʏʁdɪçkaɪ̯t]", "example": "Das Brandenburger Tor ist zweifellos die bekannteste Sehenswürdigkeit Berlins.", "exampleTranslation": "دروازه براندنبورگ بدون تردید نام‌آورترین جاذبه دیدنی برلین به شمار می‌رود.", "tags": ["گردشگری", "تاریخ"]},
        # Verben
        {"id": "k9-v-c1", "german": "aufbrechen", "persian": "عازم سفر شدن، بار و بنه را بستن و راه افتادن", "category": "Verben", "lesson": 9, "infinitive": "aufbrechen", "present": "bricht auf", "preterite": "brach auf", "perfect": "ist aufgebrochen", "auxiliary": "sein", "separable": True, "pronunciation": "[ˈaʊ̯fˌbʁɛçn̩]", "example": "Früh am Sonntagmorgen brachen die Bergsteiger zur anspruchsvollen Gipfeltour auf.", "exampleTranslation": "صبح زود یکشنبه، کوهنوردان عازم صعود دشوار به سوی قله شدند.", "tags": ["سفر", "حرکت"]},
        {"id": "k9-v-c2", "german": "stornieren", "persian": "لغو کردن رسمی، فسخ رزرو پرواز یا هتل", "category": "Verben", "lesson": 9, "infinitive": "stornieren (+ Akk.)", "present": "storniert", "preterite": "stornierte", "perfect": "hat storniert", "auxiliary": "haben", "pronunciation": "[ʃtɔʁˈniːʁən]", "example": "Wegen einer akuten Erkrankung musste er seinen Flug nach Rom kurzfristig stornieren.", "exampleTranslation": "به دلیل بیماری ناگهانی، او مجبور شد پرواز خود به رم را در آخرین لحظات لغو و فسخ کند.", "tags": ["هتل", "پرواز"]},
        # Adjektive
        {"id": "k9-adj-c1", "german": "malerisch", "persian": "تماشایی و دیدنی مانند تابلوهای نقاشی", "category": "Adjektive", "lesson": 9, "comparative": "malerischer", "superlative": "am malerischsten", "opposite": "hässlich / trist", "pronunciation": "[ˈmaːləʁɪç]", "example": "Das kleine Fischerdorf an der italienischen Küste bot eine unbeschreiblich malerische Kulisse.", "exampleTranslation": "روستای کوچک ماهیگیری در ساحل ایتالیا جلوه‌ای تماشایی و چشم‌نواز چون تابلوی نقاشی داشت.", "tags": ["طبیعت", "توصیف"]},
        # Redewendungen
        {"id": "k9-red-c1", "german": "Reisefieber haben", "persian": "شور و اشتیاق شدید و بی‌تابی پیش از سفر داشتن", "category": "Redewendungen", "lesson": 9, "explanation": "تپش قلب و هیجان آمیخته با استرس شیرین در آستانه آغاز یک سفر بزرگ.", "literalMeaning": "تب سفر داشتن", "pronunciation": "[ˈʁaɪ̯zəˌfiːbɐ ˈhaːbn̩]", "example": "Schon drei Tage vor dem Abflug nach Australien hatte sie vor lauter Reisefieber kaum geschlafen.", "exampleTranslation": "سه روز پیش از پرواز به مقصد استرالیا، از فرط شور و بی‌تابی سفر پلک روی هم نگذاشته بود.", "tags": ["اصطلاح", "سفر"]}
    ],
    10: [
        # Nomen
        {"id": "k10-n-c1", "german": "das Ökosystem", "persian": "بوم‌سازگان، اکوسیستم طبیعی", "category": "Nomen", "lesson": 10, "article": "das", "plural": "die Ökosysteme", "genderPersian": "خنثی (das)", "pronunciation": "[ˈøːkozyˌsteːm]", "example": "Tropische Korallenriffe gehören zu den artenreichsten Ökosystemen unseres Planeten.", "exampleTranslation": "صخره‌های مرجانی استوایی از غنی‌ترین بوم‌سازگان‌ها در تنوع زیستی سیاره ما به شمار می‌روند.", "tags": ["محیط زیست", "طبیعت"]},
        {"id": "k10-n-c2", "german": "der Treibhauseffekt", "persian": "اثر گلخانه‌ای (پدیده به دام افتادن گرما در جو زمین)", "category": "Nomen", "lesson": 10, "article": "der", "plural": "die Treibhauseffekte", "genderPersian": "مذکر (der)", "pronunciation": "[ˈtʁaɪ̯phaʊ̯sʔɛˌfɛkt]", "example": "Die Zunahme von Treibhausgasen verstärkt den globalen Treibhauseffekt dramatisch.", "exampleTranslation": "افزایش گازهای گلخانه‌ای اثر گلخانه‌ای جهانی را به شکلی هشداردهنده تشدید می‌سازد.", "tags": ["اقلیم", "زمین"]},
        {"id": "k10-n-c3", "german": "die Nachhaltigkeit", "persian": "پایداری، توسعه سازگار با محیط زیست و حفظ منابع برای آیندگان", "category": "Nomen", "lesson": 10, "article": "die", "plural": "die Nachhaltigkeit (بدون جمع)", "genderPersian": "مونث (die)", "pronunciation": "[ˈnaːxhaltɪçkaɪ̯t]", "example": "Ökologische Nachhaltigkeit erfordert einen bewussten Verzicht auf fossile Energien.", "exampleTranslation": "پایداری بوم‌شناختی مستلزم چشم‌پوشی آگاهانه از مصرف سوخت‌های فسیلی است.", "tags": ["پایداری", "محیط زیست"]},
        # Verben
        {"id": "k10-v-c1", "german": "recyceln", "persian": "بازیافت کردن، چرخه تبدیل مجدد پسماندها به مواد مصرفی", "category": "Verben", "lesson": 10, "infinitive": "recyceln (+ Akk.)", "present": "recycelt", "preterite": "recycelte", "perfect": "hat recycelt", "auxiliary": "haben", "pronunciation": "[ʁiˈsaɪ̯kl̩n]", "example": "In Deutschland werden über 90 Prozent des produzierten Altglases vorbildlich recycelt.", "exampleTranslation": "در آلمان بالغ بر ۹۰ درصد شیشه‌های دورریز به صورت الگووار بازیافت می‌گردند.", "tags": ["بازیافت", "پسماند"]},
        {"id": "k10-v-c2", "german": "ausrotten", "persian": "ریشه‌کن کردن، منقرض ساختن گونه یا نابودی کامل", "category": "Verben", "lesson": 10, "infinitive": "ausrotten (+ Akk.)", "present": "rottet aus", "preterite": "rottete aus", "perfect": "hat ausgerottet", "auxiliary": "haben", "separable": True, "pronunciation": "[ˈaʊ̯sˌʁɔtn̩]", "example": "Durch rücksichtslose Wilderei wurden zahlreiche Nashorn-Unterarten fast gänzlich ausgerottet.", "exampleTranslation": "به دلیل شکار غیرمجاز بی‌رحمانه، چندین زیرگونه کرگدن تقریباً به کلی ریشه‌کن و منقرض شدند.", "tags": ["حیات وحش", "حفاظت"]},
        # Adjektive
        {"id": "k10-adj-c1", "german": "erneuerbar", "persian": "تجدیدپذیر، بازتولیدشونده در طبیعت (مانند انرژی خورشیدی و بادی)", "category": "Adjektive", "lesson": 10, "comparative": "erneuerbarer", "superlative": "am erneuerbarsten", "opposite": "fossil / erschöpfbar", "pronunciation": "[ɛɐ̯ˈnɔɪ̯ɐbaːɐ̯]", "example": "Erneuerbare Energien wie Sonne und Wind decken bereits einen großen Teil des Strombedarfs.", "exampleTranslation": "انرژی‌های تجدیدپذیر نظیر خورشید و باد بخش معتنابهی از نیاز برق را تأمین می‌نمایند.", "tags": ["انرژی", "محیط زیست"]},
        # Redewendungen
        {"id": "k10-red-c1", "german": "fünf vor zwölf sein", "persian": "دقیقه نود بودن، آخرین فرصت برای نجات و اقدام عاجل بودن", "category": "Redewendungen", "lesson": 10, "explanation": "هنگامی که زمان برای حل یک معضل بسیار وخیم و حیاتی رو به پایان است.", "literalMeaning": "ساعت پنج دقیقه مانده به دوازده بودن", "pronunciation": "[fʏnf foːɐ̯ tsvœlf zaɪ̯n]", "example": "Beim Stoppen der Erderwärmung ist es bereits fünf vor zwölf, wir müssen sofort handeln!", "exampleTranslation": "در متوقف ساختن گرمایش کره زمین اکنون در دقیقه نود هستیم و اقدام فوری ضرورت دارد!", "tags": ["اصطلاح", "فوریت"]}
    ]
}

def format_item_dict(item):
    lines = []
    lines.append('  {')
    lines.append(f"    id: '{item['id']}',")
    lines.append(f"    german: {json.dumps(item['german'], ensure_ascii=False)},")
    lines.append(f"    persian: {json.dumps(item['persian'], ensure_ascii=False)},")
    lines.append(f"    category: '{item['category']}',")
    lines.append(f"    lesson: {item['lesson']},")
    lines.append(f"    sources: {json.dumps(item.get('sources', ['Lehrbuch']))},")
    src_det = item.get('sourceDetails', [{'source': 'Lehrbuch', 'lesson': item['lesson'], 'module': 'Lehrbuch', 'pageOrTrack': 'Aspekte neu B1+'}])
    lines.append(f"    sourceDetails: {json.dumps(src_det, ensure_ascii=False)},")
    if 'pronunciation' in item:
        lines.append(f"    pronunciation: {json.dumps(item['pronunciation'])},")
    if item['category'] == 'Nomen':
        if 'article' in item: lines.append(f"    article: '{item['article']}',")
        if 'plural' in item: lines.append(f"    plural: {json.dumps(item['plural'], ensure_ascii=False)},")
        if 'genderPersian' in item: lines.append(f"    genderPersian: '{item['genderPersian']}',")
    elif item['category'] == 'Verben':
        if 'infinitive' in item: lines.append(f"    infinitive: {json.dumps(item['infinitive'], ensure_ascii=False)},")
        if 'present' in item: lines.append(f"    present: {json.dumps(item['present'], ensure_ascii=False)},")
        if 'preterite' in item: lines.append(f"    preterite: {json.dumps(item['preterite'], ensure_ascii=False)},")
        if 'perfect' in item: lines.append(f"    perfect: {json.dumps(item['perfect'], ensure_ascii=False)},")
        if 'auxiliary' in item: lines.append(f"    auxiliary: '{item['auxiliary']}',")
        if 'separable' in item: lines.append(f"    separable: {str(item['separable']).lower()},")
        if 'reflexive' in item: lines.append(f"    reflexive: {str(item['reflexive']).lower()},")
        if 'prepositionCase' in item: lines.append(f"    prepositionCase: {json.dumps(item['prepositionCase'], ensure_ascii=False)},")
    elif item['category'] in ['Adjektive', 'Adverbien']:
        if 'comparative' in item: lines.append(f"    comparative: {json.dumps(item['comparative'], ensure_ascii=False)},")
        if 'superlative' in item: lines.append(f"    superlative: {json.dumps(item['superlative'], ensure_ascii=False)},")
        if 'opposite' in item: lines.append(f"    opposite: {json.dumps(item['opposite'], ensure_ascii=False)},")
    elif item['category'] == 'Redewendungen':
        if 'explanation' in item: lines.append(f"    explanation: {json.dumps(item['explanation'], ensure_ascii=False)},")
        if 'literalMeaning' in item: lines.append(f"    literalMeaning: {json.dumps(item['literalMeaning'], ensure_ascii=False)},")
    if 'example' in item: lines.append(f"    example: {json.dumps(item['example'], ensure_ascii=False)},")
    if 'exampleTranslation' in item: lines.append(f"    exampleTranslation: {json.dumps(item['exampleTranslation'], ensure_ascii=False)},")
    lines.append("    level: 'B1+',")
    if 'tags' in item: lines.append(f"    tags: {json.dumps(item['tags'], ensure_ascii=False)}")
    lines.append('  }')
    return '\n'.join(lines)

for ch_num in range(1, 11):
    file_path = f'./src/data/chapters/chapter{ch_num}.ts'
    current_content = ''
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            current_content = f.read()
    
    # Extract items inside export const CHAPTER_X_VOCABULARY = [ ... ];
    match = re.search(r'export const CHAPTER_\d+_VOCABULARY:\s*VocabularyItem\[\]\s*=\s*\[([\s\S]*?)\];', current_content)
    existing_code = match.group(1).strip() if match else ''
    
    # Format newly added items
    new_items_list = chapter_data.get(ch_num, [])
    new_formatted = [format_item_dict(it) for it in new_items_list]
    
    all_pieces = []
    if existing_code:
        # Clean trailing commas
        cleaned_existing = existing_code.rstrip(',').strip()
        all_pieces.append(cleaned_existing)
    if new_formatted:
        all_pieces.append(',\n'.join(new_formatted))
        
    full_body = ',\n'.join(all_pieces)
    
    new_file_str = f"import {{ VocabularyItem }} from '../../types/vocabulary';\n\nexport const CHAPTER_{ch_num}_VOCABULARY: VocabularyItem[] = [\n{full_body}\n];\n"
    
    # Clean double commas if any
    new_file_str = re.sub(r'\},,', '},', new_file_str)
    new_file_str = re.sub(r',\s*,', ',', new_file_str)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_file_str)
    print(f"Updated chapter{ch_num}.ts with total items")

print("All chapters successfully updated.")
