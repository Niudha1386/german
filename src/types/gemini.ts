export type UserLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type VoiceOption = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

export type ConversationScenario =
  | 'alltag'
  | 'cafe'
  | 'job'
  | 'arzt'
  | 'wohnung'
  | 'einkauf'
  | 'pruefung';

export interface ScenarioInfo {
  id: ConversationScenario;
  titleFa: string;
  titleDe: string;
  icon: string;
  descriptionFa: string;
  initialPromptDe: string;
  initialPromptFa: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanationFa: string;
}

export interface ScoreBreakdown {
  overall?: number; // 0 - 100
  pronunciation?: number; // 0 - 100
  grammar: number; // 0 - 100
  vocabulary: number; // 0 - 100
  fluency: number; // 0 - 100
  feedbackFa?: string;
}

export interface KeyVocabulary {
  german: string;
  persian: string;
  type?: string;
}

export interface SuggestedReply {
  german: string;
  persian: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  textGerman: string;
  textPersian?: string;
  audioBase64?: string;
  audioUrl?: string;
  timestamp: number;
  corrections?: GrammarCorrection[];
  score?: ScoreBreakdown;
  suggestedReplies?: SuggestedReply[];
  keyVocabulary?: KeyVocabulary[];
  isAudioRecording?: boolean;
}

export interface DetailedEvaluation {
  transcription: string;
  overallScore: number;
  scores: {
    pronunciation: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
  };
  levelAssessment: string;
  strengths: string[];
  improvements: GrammarCorrection[];
  nativeAlternative: string;
  nativeAlternativeFa: string;
  pronunciationTips: string[];
  followUpQuestion?: {
    german: string;
    persian: string;
  };
}

export interface PronunciationChallenge {
  id: string;
  german: string;
  persian: string;
  level: UserLevel;
  category: 'Umlaute' | 'ch-Laut' | 'Satzbau' | 'Zungenbrecher' | 'Alltag';
  phoneticFocus: string;
  tipFa: string;
  bestScore?: number;
}
