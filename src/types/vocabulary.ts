export type SourceType = 'Lehrbuch' | 'Hörtexte';

export type CategoryType = 'Nomen' | 'Verben' | 'Adjektive' | 'Adverbien' | 'Redewendungen';

export type ArticleType = 'der' | 'die' | 'das';

export type AuxiliaryVerb = 'haben' | 'sein' | 'haben/sein';

export interface WordSourceLocation {
  source: SourceType;
  lesson: number;
  module?: string; // e.g. "Modul 1", "Modul 2", "Hörtext 1.2"
  pageOrTrack?: string; // e.g. "S. 14" or "Audio CD 1 Track 4"
  context?: string; // Optional context sentence or dialogue snippet
}

export interface VocabularyItem {
  id: string;
  german: string; // The primary German expression / word
  persian: string; // Persian translation
  category: CategoryType;
  lesson: number; // 1 to 10
  sources: SourceType[]; // Can contain both Lehrbuch and Hörtexte
  sourceDetails: WordSourceLocation[];
  pronunciation?: string; // IPA or phonetic transcription e.g. [ˈtaɪ̯lˌneːmən]
  audioUrl?: string; // Optional explicit audio file URL

  // Nomen fields
  article?: ArticleType;
  plural?: string; // e.g. "die Herausforderungen" or "-en"
  genderPersian?: 'مذکر (der)' | 'مونث (die)' | 'خنثی (das)';

  // Verben fields
  infinitive?: string;
  present?: string; // 3. Person Präsens (z.B. "nimmt teil")
  preterite?: string; // Präteritum (z.B. "nahm teil")
  perfect?: string; // Perfekt (z.B. "hat teilgenommen")
  auxiliary?: AuxiliaryVerb; // haben / sein
  reflexive?: boolean; // e.g. sich verabreden
  separable?: boolean; // trennbar e.g. teil|nehmen
  prepositionCase?: string; // e.g. "an + Dativ", "mit + Dativ"

  // Adjektive & Adverbien fields
  comparative?: string;
  superlative?: string;
  opposite?: string;

  // Redewendungen fields
  explanation?: string; // Short explanation or register
  literalMeaning?: string; // معنی واژه به واژه

  // Example sentences
  example?: string;
  exampleTranslation?: string;
  additionalExamples?: Array<{
    de: string;
    fa: string;
    source?: SourceType;
  }>;

  // Metadata & Tags
  level?: string; // "B1+"
  tags?: string[];
  dateAdded?: string;
}

export interface LessonInfo {
  number: number; // 1 to 10
  germanTitle: string; // e.g. "Leute heute"
  persianTitle: string; // e.g. "مردم امروز"
  description: string; // Short overview of lesson themes
  lehrbuchTopics: string[];
  hoertexteTopics: string[];
  icon: string;
  themeColor: string; // Tailwind color accent
}

export type StudyStatus = 'unseen' | 'learning' | 'review' | 'learned';

export interface UserWordProgress {
  status: StudyStatus;
  lastStudiedAt?: number;
  studyCount: number;
  correctCount: number;
  incorrectCount: number;
  isStarred?: boolean;
  notes?: string;
}

export interface UserProgressState {
  words: Record<string, UserWordProgress>;
  streakDays: number;
  lastActiveDate: string;
  totalQuizzesTaken: number;
}

export interface FilterState {
  searchQuery: string;
  selectedLesson: number | 'all';
  selectedSource: SourceType | 'all';
  selectedCategory: CategoryType | 'all';
  selectedStatus: StudyStatus | 'all';
  onlyStarred: boolean;
}
