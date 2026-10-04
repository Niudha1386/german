import { VoiceOption } from '../types/gemini';

class GeminiAudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private rawMediaStream: MediaStream | null = null;
  private processedMediaStream: MediaStream | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Cache for generated audio URLs to avoid re-fetching
  private audioCache = new Map<string, string>();

  /**
   * Start recording microphone audio with noise suppression, DSP filtering, and real-time level callback
   */
  async startRecording(onVolumeChange?: (volume: number) => void): Promise<void> {
    this.audioChunks = [];
    
    try {
      // 1. Request microphone with aggressive hardware and browser-level noise suppression
      this.rawMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 48000 },
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true },
          // Vendor-specific noise cancelation flags for Chromium/Android WebKit
          googEchoCancellation: true,
          googAutoGainControl: true,
          googNoiseSuppression: true,
          googHighpassFilter: true,
          googTypingNoiseDetection: true,
          googAudioMirroring: false,
        } as any,
        video: false,
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        const customErr = new Error('دسترسی به میکروفون توسط کاربر یا مرورگر تایید نشد (Permission Denied).');
        customErr.name = 'PermissionDenied';
        throw customErr;
      }
      throw err;
    }

    // 2. Setup Web Audio DSP Digital Filter Chain
    let streamToRecord = this.rawMediaStream;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.rawMediaStream);

      // A. High-pass filter (cuts low rumble, table knocks, breathing wind, AC hum < 85Hz)
      const highPassFilter = this.audioContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(85, this.audioContext.currentTime);
      highPassFilter.Q.setValueAtTime(0.7, this.audioContext.currentTime);

      // B. Notch filter (filters out 50Hz / 60Hz powerline hum)
      const notchFilter = this.audioContext.createBiquadFilter();
      notchFilter.type = 'notch';
      notchFilter.frequency.setValueAtTime(55, this.audioContext.currentTime);
      notchFilter.Q.setValueAtTime(4.0, this.audioContext.currentTime);

      // C. Low-pass filter (removes high-frequency hiss and static above speech frequencies > 8000Hz)
      const lowPassFilter = this.audioContext.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.setValueAtTime(8000, this.audioContext.currentTime);
      lowPassFilter.Q.setValueAtTime(0.7, this.audioContext.currentTime);

      // D. Dynamics Compressor (normalizes quiet vs loud syllables, enhances German consonant clarity)
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime); // dB
      compressor.knee.setValueAtTime(10, this.audioContext.currentTime); // dB
      compressor.ratio.setValueAtTime(6, this.audioContext.currentTime);
      compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime); // 3ms
      compressor.release.setValueAtTime(0.25, this.audioContext.currentTime); // 250ms

      // E. Fast Analyser for voice activity & speech energy detection
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;

      // F. Output destination to record clean DSP audio
      const destination = this.audioContext.createMediaStreamDestination();

      // Connect DSP graph: Source -> HighPass -> Notch -> LowPass -> Compressor -> Analyser & Destination
      source.connect(highPassFilter);
      highPassFilter.connect(notchFilter);
      notchFilter.connect(lowPassFilter);
      lowPassFilter.connect(compressor);
      compressor.connect(this.analyser);
      compressor.connect(destination);

      this.processedMediaStream = destination.stream;
      streamToRecord = this.processedMediaStream;

      if (onVolumeChange) {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const sampleRate = this.audioContext.sampleRate;
        const binSize = sampleRate / (this.analyser.fftSize);

        // Indices for human voice formant band (~300Hz to ~3400Hz)
        const minVoiceBin = Math.max(0, Math.floor(300 / binSize));
        const maxVoiceBin = Math.min(bufferLength - 1, Math.ceil(3400 / binSize));

        const checkVolume = () => {
          if (!this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);

          // Focus volume calculation strictly on human speech frequencies, ignoring ambient noise
          let voiceSum = 0;
          let voiceCount = 0;
          for (let i = minVoiceBin; i <= maxVoiceBin; i++) {
            voiceSum += dataArray[i];
            voiceCount++;
          }

          const average = voiceCount > 0 ? voiceSum / voiceCount : 0;
          // Apply gentle noise floor threshold so background whisper is mapped to 0
          const noiseGate = 18; // Ignore low noise floor
          const normalized = average > noiseGate ? Math.min(1, (average - noiseGate) / (128 - noiseGate)) : 0;
          onVolumeChange(normalized);

          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            requestAnimationFrame(checkVolume);
          }
        };
        requestAnimationFrame(checkVolume);
      }
    } catch (e) {
      console.warn('AudioContext DSP / visualization setup error:', e);
      streamToRecord = this.rawMediaStream;
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : 'audio/mp4';

    this.mediaRecorder = new MediaRecorder(streamToRecord, {
      mimeType,
      audioBitsPerSecond: 64000, // 64kbps Opus is crystal clear for speech without excess data
    });

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
        if (this.rawMediaStream) {
          this.rawMediaStream.getTracks().forEach((track) => track.stop());
          this.rawMediaStream = null;
        }
        if (this.processedMediaStream) {
          this.processedMediaStream.getTracks().forEach((track) => track.stop());
          this.processedMediaStream = null;
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
    if (this.rawMediaStream) {
      this.rawMediaStream.getTracks().forEach((track) => track.stop());
      this.rawMediaStream = null;
    }
    if (this.processedMediaStream) {
      this.processedMediaStream.getTracks().forEach((track) => track.stop());
      this.processedMediaStream = null;
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
