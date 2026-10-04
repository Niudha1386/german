export interface TranscriptSection {
  lesson: number;
  trackId: string;
  title: string;
  speakers: string;
  sourceType: 'Hörtexte' | 'DVD';
  textDe: string;
  keywords: string[];
}

export const HOERTEXTE_TRANSCRIPTS: TranscriptSection[] = [
  {
    lesson: 1,
    trackId: 'Track 1.2',
    title: 'Modul 2 Aufgabe 2a: Über Freundschaften und Bekannte',
    speakers: 'Sprecher & Sprecherin',
    sourceType: 'Hörtexte',
    textDe: `Gemeinsam durch dick und dünn – gute Freunde zu haben, ist vielen Menschen wichtig. Ein guter Freundeskreis macht uns selbstbewusst, psychisch stabil und optimistisch, stärkt unser Herz-Kreislaufsystem und die Abwehrkräfte. Freundschaften sind aber ganz individuell und kulturell verschieden. In der deutschen Sprache unterscheiden wir zum Beispiel zwischen Freunden und Bekannten.
Bekannte trifft man eher zufällig. Eventuell verabredet man sich auch mal auf einen Kaffee, spricht über dies und das, zum Beispiel über den nächsten Urlaub, aber eher nicht über Probleme. Dafür haben wir unsere Freunde.`,
    keywords: ['durch dick und dünn', 'Freundeskreis', 'Abwehrkräfte', 'verabreden', 'anvertrauen', 'schnelllebig', 'Statussymbol']
  },
  {
    lesson: 1,
    trackId: 'DVD Kapitel 1',
    title: 'DVD Film: Die Chefin (Sybille Milde)',
    speakers: 'Sybille Milde, Daniel, Andreas Eggenwirth',
    sourceType: 'DVD',
    textDe: `Der jüngste deutsche Sternekoch ist weiblich und heißt Sybille Milde. Die 29-Jährige ist Küchenchefin in einem Nobelrestaurant bei Frankfurt und schwanger.
Sybille Milde: „Ich bin jetzt in der Lage, in der schwierigen Lage, ich bekomm’ jetzt ein Kind und ich muss Familie und Beruf irgendwie unter einen Hut bekommen und auch so unter den Hut bekommen, dass ich noch am Ball bleibe... Früher war ich noch gar nicht in aller Munde, da war ich noch ein kleiner Hase.“`,
    keywords: ['unter einen Hut bekommen', 'am Ball bleiben', 'in aller Munde sein', 'Domäne', 'Glanzleistung']
  },
  {
    lesson: 2,
    trackId: 'Track 1.16',
    title: 'Modul 2 Aufgabe 3: Sendung Brisant – Leben auf der Straße',
    speakers: 'Moderator, Klaus Mahlke, Andreas Huber',
    sourceType: 'Hörtexte',
    textDe: `Klaus, wie lange leben Sie schon auf der Straße?
Klaus: „Ja, so seit ungefähr fünf Jahren... Auf meine Bewerbungen kamen nur Absagen und irgendwann habe ich mich mit meiner Arbeitslosigkeit abgefunden... Tja, und so bin ich auf der Straße gelandet.“
Andreas: „Dort habe ich einen sehr engagierten Sozialarbeiter getroffen. Er hat mir mit den Anträgen geholfen... Wenn ich es schaffe, wieder ein normales Leben zu führen und den Alkohol in den Griff zu bekommen, kümmere ich mich um meine Tochter.“`,
    keywords: ['auf der Straße landen', 'in den Griff bekommen', 'Obdachlosenheim', 'Suppenküche', 'abfinden']
  },
  {
    lesson: 2,
    trackId: 'DVD Kapitel 2',
    title: 'DVD Film: Hotel Mama',
    speakers: 'Robert Zeisig, Mutter Evi, Nicole, Matthias',
    sourceType: 'DVD',
    textDe: `Robert Zeisig ist 32 Jahre alt und genau so lange wohnt er schon Zuhause. Mutter Evi ist eine gute Köchin...
Robert: „Man kommt heim, Essen ist fertig am Tisch. Meine Mutter putzt, mein Bett ist immer gemacht. Das ist einfach Feierabend.“
Nicole: „Er hat Angst, dass er mal auf eigenen Beinen stehen muss und dass die Mama dann nicht mehr da ist.“
Matthias: „Matthias genießt die Vorteile der Rundumversorgung.“`,
    keywords: ['auf eigenen Beinen stehen', 'Rundumversorgung', 'Bequemlichkeit', 'bemuttern', 'am Rockzipfel hängen']
  },
  {
    lesson: 3,
    trackId: 'Track 1.21',
    title: 'Modul 2 Aufgabe 2b: Lebensmittelverschwendung in der WG',
    speakers: 'Thorsten, Hannes',
    sourceType: 'Hörtexte',
    textDe: `Thorsten: „Hast du gewusst, dass wir in Deutschland pro Nase und Jahr mehr als 80 Kilo Lebensmittel wegschmeißen? Wir schmeißen jedes achte Lebensmittel weg, das wir gekauft haben.“
Hannes: „Echt? Na, das können wir beide uns doch gar nicht leisten.“
Thorsten: „Genau, man soll eben nicht weniger, sondern geplanter einkaufen. Also z. B. erst nachsehen, was man noch im Kühlschrank hat, dann den Einkaufszettel schreiben.“`,
    keywords: ['wegschmeißen', 'Lebensmittelabfälle', 'haltbar', 'Kochmuffel', 'Einkaufszettel']
  },
  {
    lesson: 3,
    trackId: 'Track 1.22',
    title: 'Modul 4 Aufgabe 3: Der Biorhythmus des Menschen',
    speakers: 'Moderator, Dr. Baumann',
    sourceType: 'Hörtexte',
    textDe: `Frau Dr. Baumann: „Zwischen neun und zwölf Uhr läuft unser Kurzzeitgedächtnis wie geschmiert. Das ist die beste Zeit, um alle Kopfarbeiten zu erledigen... Der Leistungshöhepunkt des Vormittags ist etwa um elf Uhr... Ab 18 Uhr braucht der Kopf endgültig eine Pause.“`,
    keywords: ['Biorhythmus', 'wie geschmiert laufen', 'in Schwung kommen', 'Leistungshöhepunkt', 'Auszeit']
  },
  {
    lesson: 4,
    trackId: 'Track 1.23-1.27',
    title: 'Modul 1: Freizeitgestaltung und Freizeitstress',
    speakers: 'Moderator, Anrufer Matti, Franka, Aaron, Ulrike',
    sourceType: 'Hörtexte',
    textDe: `Aaron: „Ich bin ein absoluter Filmfan. Ansonsten bin ich einfach gern zu Hause. Ich hasse Freizeitstress, ich will nicht ständig irgendwas machen.“
Ulrike: „Ich habe ganz schön viele Hobbys, aber leider nie genügend Zeit für alle. Wir haben vor einem halben Jahr unseren Fernseher verschenkt und machen seither viel mehr zusammen.“`,
    keywords: ['Freizeitstress', 'den Kopf frei kriegen', 'ausruhen', 'verschenken', 'Freizeitgestaltung']
  },
  {
    lesson: 5,
    trackId: 'Track 1.35',
    title: 'Modul 4 Aufgabe 2b: Ganzheitliches Gedächtnistraining',
    speakers: 'Moderator, Dr. Witt',
    sourceType: 'Hörtexte',
    textDe: `Dr. Witt: „Wir wollen durch ganzheitliches Gedächtnistraining spielerisch und ohne Stress die Leistung des Gehirns steigern... Ziele dieses Programms sind: Denkflexibilität, assoziatives Denken und die Steigerung der Merkfähigkeit.“`,
    keywords: ['Merkfähigkeit', 'Wissbegierde', 'Schulbank drücken', 'Denkflexibilität', 'Kleider machen Leute']
  },
  {
    lesson: 6,
    trackId: 'DVD Kapitel 6',
    title: 'DVD Film: Auf der Walz (Wanderjahre der Gesellen)',
    speakers: 'David, Christian, Reporterin',
    sourceType: 'DVD',
    textDe: `David und Christian sind Zimmerleute und auf der Walz. So heißen die Wanderjahre der Gesellen...
Geselle: „Wir leben von der Hand in den Mund. Wenn uns das Geld ausgeht, suchen wir Arbeit... Man lernt eben, die einfachen Dinge im Leben wieder zu schätzen.“`,
    keywords: ['auf der Walz sein', 'von der Hand in den Mund leben', 'Knochenjob', 'Schlüsselerlebnis', 'Tradition']
  },
  {
    lesson: 7,
    trackId: 'Track 2.14-2.15',
    title: 'Modul 1: Scheidungen und Patchworkfamilien',
    speakers: 'Lutz Keller, Frau Schröder, Herr Massmann',
    sourceType: 'Hörtexte',
    textDe: `Herr Massmann: „Ich habe zwei Kinder aus erster Ehe... Maria hatte auch schon eine Tochter. Zusammen haben wir jetzt noch ein Baby bekommen. Marias Tochter war anfangs sehr eifersüchtig... Mittlerweile haben wir uns ganz gut zusammengerauft.“`,
    keywords: ['Patchworkfamilie', 'sich zusammenraufen', 'Unterhalt', 'Alleinerziehende', 'Eifersucht']
  },
  {
    lesson: 8,
    trackId: 'Track 2.21',
    title: 'Modul 2 Aufgabe 5b: Tauschringe und nachhaltiger Konsum',
    speakers: 'Moderator, Herr Meier-Brill',
    sourceType: 'Hörtexte',
    textDe: `Herr Meier-Brill: „Dinge, die ich nicht mehr brauche, tausche ich mit Freunden und Bekannten. Ich habe mir einen richtigen kleinen Tauschring aufgebaut. Ich helfe einer Nachbarin bei der Schrankreparatur, sie schneidet mir dafür die Haare.“`,
    keywords: ['Tauschring', 'Reklamation', 'folgenreich', 'Konsumverzicht', 'Secondhand']
  },
  {
    lesson: 9,
    trackId: 'Track 2.27-2.28',
    title: 'Modul 1: Weltreise – 15 Monate auf fünf Kontinenten',
    speakers: 'Moderator, Axel Franke',
    sourceType: 'Hörtexte',
    textDe: `Axel Franke: „Als ich 25 war, bekam ich großes Fernweh. Viele beneiden mich und denken: ‚Der hat einen Goldesel zu Hause stehen.’ Aber ich habe drei Jahre lang eisern gespart... Ich verkaufte meinen kompletten Hausrat.“`,
    keywords: ['Fernweh', 'Goldesel zu Hause haben', 'Workcamp', 'Reisefieber', 'Hausrat']
  },
  {
    lesson: 10,
    trackId: 'Track 2.34 & DVD',
    title: 'Modul 2 & DVD: Tierschutz und Wildtiere in der Stadt',
    speakers: 'Manuel Tucher (Tierheim Leipzig), Derk Ehlert (Berlin)',
    sourceType: 'Hörtexte',
    textDe: `Manuel Tucher: „Besonders im Sommer finden wir leider sehr viele Tiere, die einfach irgendwo ausgesetzt wurden...“
Derk Ehlert: „Stadtfüchse in Berlin streifen durch die Gärten. Das Tier ist neugierig, hat keine Angst. Typisch Stadtfuchs, er wird erstaunlich zutraulich.“`,
    keywords: ['Tierheim', 'aussetzen', 'zutraulich', 'Süßwasservorräte', 'Tierschutzverein']
  }
];
