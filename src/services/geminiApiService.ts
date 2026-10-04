import { ChatMessage, DetailedEvaluation, UserLevel, ConversationScenario } from '../types/gemini';

export interface ChatResponse {
  replyGerman: string;
  replyPersian: string;
  corrections?: Array<{ original: string; corrected: string; explanationFa: string }>;
  scoreForUserMessage?: {
    overall: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    feedbackFa: string;
  };
  suggestedReplies?: Array<{ german: string; persian: string }>;
  keyVocabulary?: Array<{ german: string; persian: string; type?: string }>;
}

export const geminiApi = {
  /**
   * Send chat messages to Gemini German Teacher
   */
  async sendMessage(
    messages: ChatMessage[],
    scenario: ConversationScenario = 'alltag',
    level: UserLevel = 'B1'
  ): Promise<ChatResponse> {
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      text: m.textGerman,
    }));

    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        scenario,
        level,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Evaluate user's German speech (audio base64 or text)
   */
  async evaluateSpeaking(options: {
    text?: string;
    audioBase64?: string;
    mimeType?: string;
    targetSentence?: string;
    level?: UserLevel;
  }): Promise<DetailedEvaluation> {
    const response = await fetch('/api/gemini/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Evaluation request failed: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Transcribe recorded audio
   */
  async transcribeAudio(audioBase64: string, mimeType: string = 'audio/webm'): Promise<string> {
    const response = await fetch('/api/gemini/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType }),
    });

    if (!response.ok) {
      throw new Error(`Transcription request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || '';
  },
};
