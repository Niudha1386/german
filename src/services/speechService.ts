class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private germanVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize German voices
    const deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('German') || v.name.includes('Deutsch'))) 
      || voices.find(v => v.lang.startsWith('de'));
    
    if (deVoice) {
      this.germanVoice = deVoice;
      this.isInitialized = true;
    }
  }

  public speak(text: string, audioUrl?: string, onStart?: () => void, onEnd?: () => void, onError?: () => void): void {
    // If audioUrl is provided and valid, try to play the audio file first
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      if (onStart) onStart();
      audio.onended = () => {
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        // Fallback to synth if custom audio fails
        this.speakWithSynth(text, onStart, onEnd, onError);
      };
      audio.play().catch(() => {
        this.speakWithSynth(text, onStart, onEnd, onError);
      });
      return;
    }

    this.speakWithSynth(text, onStart, onEnd, onError);
  }

  private speakWithSynth(text: string, onStart?: () => void, onEnd?: () => void, onError?: () => void): void {
    if (!this.synth) {
      console.warn('Speech synthesis not supported on this device/browser');
      if (onError) onError();
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of IPA brackets or formatting if passed
    const cleanText = text.replace(/\[.*?\]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.rate = 0.88; // Slightly slower for language learners
    utterance.pitch = 1.0;

    if (this.germanVoice) {
      utterance.voice = this.germanVoice;
    } else {
      this.initVoices();
      if (this.germanVoice) {
        utterance.voice = this.germanVoice;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
      if (onError) onError();
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
