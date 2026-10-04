import { VoiceOption } from '../types/gemini';

class GeminiAudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Cache for generated audio URLs to avoid re-fetching
  private audioCache = new Map<string, string>();

  /**
   * Start recording microphone audio with real-time level callback
   */
  async startRecording(onVolumeChange?: (volume: number) => void): Promise<void> {
    this.audioChunks = [];
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        const customErr = new Error('دسترسی به میکروفون توسط کاربر یا مرورگر تایید نشد (Permission Denied).');
        customErr.name = 'PermissionDenied';
        throw customErr;
      }
      throw err;
    }

    // Setup audio analyzer for visualizer
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      if (onVolumeChange) {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkVolume = () => {
          if (!this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          const normalized = Math.min(1, average / 128);
          onVolumeChange(normalized);

          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            requestAnimationFrame(checkVolume);
          }
        };
        requestAnimationFrame(checkVolume);
      }
    } catch (e) {
      console.warn('AudioContext visualization setup error:', e);
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : 'audio/mp4';

    this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
  }

  /**
   * Stop recording and return the audio Blob & Base64
   */
  async stopRecording(): Promise<{ blob: Blob; base64: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });

        // Clean up stream tracks
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
        }

        if (this.audioContext) {
          this.audioContext.close().catch(() => {});
          this.audioContext = null;
          this.analyser = null;
        }

        try {
          const base64 = await this.blobToBase64(blob);
          resolve({ blob, base64, mimeType });
        } catch (err) {
          reject(err);
        }
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
      this.analyser = null;
    }
    this.audioChunks = [];
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 part after comma
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
    const base64 = await this.blobToBase64(file);
    return { base64, mimeType: file.type || 'audio/webm' };
  }

  /**
   * Play German speech using Gemini 3.8 Flash Lite TTS or Browser Fallback
   */
  async speakGerman(
    text: string,
    voiceName: VoiceOption = 'Kore',
    playbackRate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stopSpeaking();

    // Check cache
    const cacheKey = `${voiceName}:${text}`;
    if (this.audioCache.has(cacheKey)) {
      const cachedUrl = this.audioCache.get(cacheKey)!;
      return this.playAudioUrl(cachedUrl, playbackRate, onStart, onEnd);
    }

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          this.audioCache.set(cacheKey, audioUrl);
          return this.playAudioUrl(audioUrl, playbackRate, onStart, onEnd);
        }
      }
    } catch (e) {
      console.warn('Gemini TTS fetch failed, falling back to Web Speech API:', e);
    }

    // Fallback: Browser Web Speech API
    return this.speakWithBrowserWebSpeech(text, playbackRate, onStart, onEnd);
  }

  private playAudioUrl(
    url: string,
    playbackRate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      this.currentAudioElement = audio;
      audio.playbackRate = playbackRate;

      audio.onplay = () => onStart?.();
      audio.onended = () => {
        this.currentAudioElement = null;
        onEnd?.();
        resolve();
      };
      audio.onerror = () => {
        this.currentAudioElement = null;
        onEnd?.();
        resolve();
      };

      audio.play().catch((err) => {
        console.warn('Audio play prevented or failed:', err);
        onEnd?.();
        resolve();
      });
    });
  }

  private speakWithBrowserWebSpeech(
    text: string,
    playbackRate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        onEnd?.();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.lang = 'de-DE';
      utterance.rate = playbackRate;

      // Try selecting a German voice if available
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find((v) => v.lang.startsWith('de'));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      utterance.onstart = () => onStart?.();
      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };
      utterance.onerror = () => {
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  isPlaying(): boolean {
    return !!this.currentAudioElement || ('speechSynthesis' in window && window.speechSynthesis.speaking);
  }
}

export const geminiAudio = new GeminiAudioService();
