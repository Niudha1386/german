import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Award, ArrowRight, RefreshCw, MessageSquare, ShieldAlert, Upload } from 'lucide-react';
import { ChatMessage, DetailedEvaluation, UserLevel, VoiceOption, ConversationScenario } from '../types/gemini';
import { geminiAudio } from '../services/geminiAudioService';
import { geminiApi } from '../services/geminiApiService';
import { SCENARIOS } from '../data/geminiData';
import { MicPermissionGuideModal } from './MicPermissionGuideModal';

interface Props {
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  userLevel: UserLevel;
  voice: VoiceOption;
  scenario: ConversationScenario;
  onScenarioChange: (s: ConversationScenario) => void;
  onOpenEvaluation: (evalData: DetailedEvaluation) => void;
  onSwitchToChat: () => void;
}

export const GeminiLiveVoice: React.FC<Props> = ({
  messages,
  onAddMessage,
  userLevel,
  voice,
  scenario,
  onScenarioChange,
  onOpenEvaluation,
  onSwitchToChat,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isGeminiSpeaking, setIsGeminiSpeaking] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastEvaluation, setLastEvaluation] = useState<DetailedEvaluation | null>(null);
  const [handsFree, setHandsFree] = useState(true); // Default to hands-free like Gemini Voice!
  const [vadStatus, setVadStatus] = useState<'idle' | 'listening' | 'user_speaking' | 'silence_detected'>('idle');
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMicGuide, setShowMicGuide] = useState(false);

  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // VAD & Voice Activity Detection References
  const handsFreeRef = useRef(handsFree);
  const isRecordingRef = useRef(isRecording);
  const isThinkingRef = useRef(isThinking);
  const isGeminiSpeakingRef = useRef(isGeminiSpeaking);
  const liveTranscriptRef = useRef(liveTranscript);
  const speechStartedRef = useRef(false);
  const speechStartTimeRef = useRef(0);
  const silenceTimeoutRef = useRef<any>(null);
  const stopRecordingFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  useEffect(() => {
    isGeminiSpeakingRef.current = isGeminiSpeaking;
  }, [isGeminiSpeaking]);

  useEffect(() => {
    liveTranscriptRef.current = liveTranscript;
  }, [liveTranscript]);

  const activeScenario = SCENARIOS.find((s) => s.id === scenario) || SCENARIOS[0];

  // Latest assistant reply
  const latestAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user');

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechRecognitionSupported(true);
    }

    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      geminiAudio.cancelRecording();
      geminiAudio.stopSpeaking();
    };
  }, []);

  // Animated Glowing Orb on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    const render = () => {
      const width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
      const height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.24;

      // Pulsing modifier based on state & audio volume
      let pulse = 0;
      if (isRecording) {
        pulse = audioVolume * 45;
      } else if (isGeminiSpeaking) {
        pulse = Math.sin(angle * 4) * 20 + 15;
      } else if (isThinking) {
        pulse = Math.sin(angle * 6) * 12;
      } else {
        pulse = Math.sin(angle * 1.5) * 6;
      }

      const radius = baseRadius + pulse;

      // Draw multi-layered iridescent fluid glow
      const layers = [
        { color1: 'rgba(6, 182, 212, 0.45)', color2: 'rgba(59, 130, 246, 0.0)', scale: 1.5 },
        { color1: 'rgba(99, 102, 241, 0.55)', color2: 'rgba(168, 85, 247, 0.0)', scale: 1.25 },
        { color1: 'rgba(14, 165, 233, 0.85)', color2: 'rgba(99, 102, 241, 0.25)', scale: 1.0 },
      ];

      layers.forEach((layer, i) => {
        const r = radius * layer.scale;
        const grad = ctx.createRadialGradient(
          centerX + Math.cos(angle + i) * 15,
          centerY + Math.sin(angle + i) * 15,
          r * 0.1,
          centerX,
          centerY,
          r
        );
        grad.addColorStop(0, layer.color1);
        grad.addColorStop(1, layer.color2);

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Core bright center
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius * 0.6);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, isRecording ? '#38bdf8' : isGeminiSpeaking ? '#818cf8' : '#67e8f9');
      coreGrad.addColorStop(1, 'rgba(37, 99, 235, 0.2)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      angle += 0.035;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRecording, isThinking, isGeminiSpeaking, audioVolume]);

  // Start Voice Recording with Voice Activity Detection (VAD)
  const handleStartRecording = async () => {
    setErrorMsg(null);
    geminiAudio.stopSpeaking();
    setIsGeminiSpeaking(false);
    setLiveTranscript('');
    liveTranscriptRef.current = '';

    speechStartedRef.current = false;
    speechStartTimeRef.current = 0;
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setVadStatus('listening');

    try {
      // Start browser live recognition preview if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = 'de-DE';
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            let current = '';
            for (let i = 0; i < e.results.length; i++) {
              current += e.results[i][0].transcript;
            }
            if (current) {
              setLiveTranscript(current);
              liveTranscriptRef.current = current;
              speechStartedRef.current = true;
              if (speechStartTimeRef.current === 0) {
                speechStartTimeRef.current = Date.now();
              }
              setVadStatus('user_speaking');

              // Reset silence timer on new spoken words
              if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
                silenceTimeoutRef.current = null;
              }

              // In handsFree mode, schedule stop after 1.2 seconds of silence following words
              if (handsFreeRef.current) {
                setVadStatus('user_speaking');
                silenceTimeoutRef.current = setTimeout(() => {
                  if (isRecordingRef.current && !isThinkingRef.current && handsFreeRef.current) {
                    setVadStatus('silence_detected');
                    stopRecordingFnRef.current();
                  }
                }, 1200);
              }
            }
          };

          rec.onspeechend = () => {
            if (handsFreeRef.current && speechStartedRef.current && !silenceTimeoutRef.current) {
              setVadStatus('silence_detected');
              silenceTimeoutRef.current = setTimeout(() => {
                if (isRecordingRef.current && !isThinkingRef.current && handsFreeRef.current) {
                  stopRecordingFnRef.current();
                }
              }, 900);
            }
          };

          rec.start();
          recognitionRef.current = rec;
        } catch {
          // ignore recognition init errors
        }
      }

      await geminiAudio.startRecording((volume) => {
        setAudioVolume(volume);

        // Continuous Voice Activity & Silence Detection (VAD)
        if (handsFreeRef.current && isRecordingRef.current && !isThinkingRef.current) {
          const SPEECH_THRESHOLD = 0.055;
          const SILENCE_THRESHOLD = 0.04;

          if (volume >= SPEECH_THRESHOLD) {
            if (!speechStartedRef.current) {
              speechStartedRef.current = true;
              speechStartTimeRef.current = Date.now();
            }
            setVadStatus('user_speaking');

            // User is actively speaking: clear any pending silence timeout
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
              silenceTimeoutRef.current = null;
            }
          } else if (speechStartedRef.current && volume <= SILENCE_THRESHOLD) {
            const speechDuration = Date.now() - speechStartTimeRef.current;
            // Ensure the user spoke for at least 500ms before silence trigger
            if (speechDuration >= 500 && !silenceTimeoutRef.current) {
              setVadStatus('silence_detected');
              silenceTimeoutRef.current = setTimeout(() => {
                if (isRecordingRef.current && !isThinkingRef.current && handsFreeRef.current) {
                  stopRecordingFnRef.current();
                }
              }, 1200); // 1.2 seconds of silence automatically sends audio!
            }
          }
        }
      });
      setIsRecording(true);
    } catch (err: any) {
      console.warn('Mic access issue handled:', err);
      setIsRecording(false);
      setShowMicGuide(true);
      setErrorMsg('دسترسی به میکروفون تایید نشد (Permission denied). لطفاً در تنظیمات مرورگر به میکروفون اجازه دهید یا فایل صوتی ارسال کنید.');
    }
  };

  // Process audio (from mic or uploaded file) with Gemini
  const processAudioWithGemini = async (base64: string, mimeType: string, knownText?: string) => {
    setIsThinking(true);
    setErrorMsg(null);
    setVadStatus('idle');

    try {
      let recognizedText = (knownText || liveTranscriptRef.current || '').trim();
      if (!recognizedText) {
        try {
          recognizedText = await geminiApi.transcribeAudio(base64, mimeType);
        } catch (e) {
          console.warn('Backend transcription fallback:', e);
        }
      }

      if (!recognizedText) {
        recognizedText = 'Guten Tag! Ich übe mein Deutsch mit Gemini.';
      }

      // 1. Evaluate user speech
      let evaluationResult: DetailedEvaluation | null = null;
      try {
        evaluationResult = await geminiApi.evaluateSpeaking({
          text: recognizedText,
          audioBase64: base64,
          mimeType,
          level: userLevel,
        });
        setLastEvaluation(evaluationResult);
      } catch (evalErr) {
        console.warn('Speech eval err:', evalErr);
      }

      // 2. Add user message
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        textGerman: recognizedText,
        timestamp: Date.now(),
        audioBase64: base64,
        score: evaluationResult
          ? { ...evaluationResult.scores, overall: evaluationResult.overallScore }
          : undefined,
      };
      onAddMessage(userMsg);

      // 3. Ask Gemini for conversational reply
      const updatedHistory = [...messages, userMsg];
      const chatRes = await geminiApi.sendMessage(updatedHistory, scenario, userLevel);

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        textGerman: chatRes.replyGerman,
        textPersian: chatRes.replyPersian,
        timestamp: Date.now(),
        corrections: chatRes.corrections,
        score: chatRes.scoreForUserMessage,
        suggestedReplies: chatRes.suggestedReplies,
        keyVocabulary: chatRes.keyVocabulary,
      };
      onAddMessage(assistantMsg);

      setIsThinking(false);

      // 4. Gemini speaks back aloud
      setIsGeminiSpeaking(true);
      await geminiAudio.speakGerman(
        chatRes.replyGerman,
        voice,
        1.0,
        () => setIsGeminiSpeaking(true),
        () => {
          setIsGeminiSpeaking(false);
          // When Gemini finishes speaking in handsFree mode, automatically resume listening!
          if (handsFreeRef.current) {
            setTimeout(() => {
              if (handsFreeRef.current && !isRecordingRef.current && !isThinkingRef.current) {
                handleStartRecording();
              }
            }, 600);
          }
        }
      );
    } catch (err: any) {
      console.warn('Live voice processing error:', err);
      setIsThinking(false);
      setIsGeminiSpeaking(false);
      setVadStatus('idle');
      setErrorMsg('خطایی در پردازش صدا یا ارتباط با جمینای رخ داد. لطفاً دوباره امتحان کنید.');
    }
  };

  // Stop Recording and Process with Gemini
  const handleStopRecording = async () => {
    if (!isRecordingRef.current) return;
    setIsRecording(false);
    setIsThinking(true);
    setVadStatus('idle');

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    try {
      const { base64, mimeType } = await geminiAudio.stopRecording();
      await processAudioWithGemini(base64, mimeType, liveTranscriptRef.current);
    } catch (err: any) {
      console.warn('Stop recording error:', err);
      setIsThinking(false);
      setErrorMsg('خطا در دریافت صدای ضبط‌شده.');
    }
  };

  // Keep ref up to date for VAD callback
  stopRecordingFnRef.current = handleStopRecording;

  // Toggle Hands Free Continuous Mode
  const handleToggleHandsFree = () => {
    const nextVal = !handsFree;
    setHandsFree(nextVal);
    handsFreeRef.current = nextVal;
    if (nextVal && !isRecording && !isThinking && !isGeminiSpeaking) {
      handleStartRecording();
    } else if (!nextVal && silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  // Handle uploaded audio file (fallback for when mic is blocked)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const { base64, mimeType } = await geminiAudio.fileToBase64(file);
      await processAudioWithGemini(base64, mimeType);
    } catch (err) {
      console.warn('File upload error:', err);
      setErrorMsg('خطا در خواندن فایل صوتی.');
    }
  };

  const handleReplayLatest = () => {
    if (latestAssistantMessage?.textGerman) {
      setIsGeminiSpeaking(true);
      geminiAudio.speakGerman(
        latestAssistantMessage.textGerman,
        voice,
        1.0,
        () => setIsGeminiSpeaking(true),
        () => setIsGeminiSpeaking(false)
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100dvh-7rem)] md:min-h-[calc(100dvh-5.5rem)] w-full max-w-2xl mx-auto px-2 sm:px-3 py-2 sm:py-3.5 space-y-3 sm:space-y-4">
      {/* Top Scenario & State Bar */}
      <div className="w-full flex items-center justify-between gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xl sm:text-2xl shrink-0">{activeScenario.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                {activeScenario.titleFa}
              </span>
              <span className="text-[11px] text-slate-400 font-de hidden sm:inline truncate">
                ({activeScenario.titleDe})
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {activeScenario.descriptionFa}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Scenario quick switch */}
          <select
            value={scenario}
            onChange={(e) => onScenarioChange(e.target.value as ConversationScenario)}
            className="text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none truncate"
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.titleFa}
              </option>
            ))}
          </select>

          {/* Hands Free Toggle */}
          <button
            onClick={() => setHandsFree(!handsFree)}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
              handsFree
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="حالت مکالمه پیوسته خودکار"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">پیوسته</span>
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="w-full p-2.5 sm:p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] sm:text-xs break-words">{errorMsg}</span>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={() => setShowMicGuide(true)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] sm:text-[11px] transition-colors"
            >
              راهنمای میکروفون
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 rounded-lg font-semibold text-[10px] sm:text-[11px] transition-colors"
            >
              <Upload className="w-3 h-3" />
              <span>ارسال فایل</span>
            </button>
          </div>
        </div>
      )}

      {/* Central Visualizer: Glowing Gemini Orb - compact & proportional */}
      <div className="relative flex flex-col items-center justify-center my-2 sm:my-4 w-44 h-44 sm:w-56 sm:h-56 aspect-square shrink-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-full cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        />

        {/* Central State Icon Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {isRecording ? (
            <div className="flex flex-col items-center gap-1 text-white animate-pulse">
              <Mic className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md text-white" />
              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm transition-colors ${
                vadStatus === 'user_speaking'
                  ? 'bg-emerald-600/90 text-white'
                  : vadStatus === 'silence_detected'
                  ? 'bg-amber-500/90 text-white'
                  : 'bg-cyan-600/80 text-white'
              }`}>
                {vadStatus === 'user_speaking'
                  ? 'در حال دریافت صحبت...'
                  : vadStatus === 'silence_detected'
                  ? 'پایان صحبت، ارسال...'
                  : 'در حال گوش دادن...'}
              </span>
            </div>
          ) : isThinking ? (
            <div className="flex flex-col items-center gap-1 text-white">
              <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-white drop-shadow-md" />
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600/80 shadow-sm">
                در حال پردازش...
              </span>
            </div>
          ) : isGeminiSpeaking ? (
            <div className="flex flex-col items-center gap-1 text-white animate-bounce">
              <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md text-white" />
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600/80 shadow-sm">
                در حال صحبت جمینای...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-white">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md text-white/90" />
              <span className="text-[10px] sm:text-[11px] font-bold text-white/90 drop-shadow">
                برای شروع مکالمه لمس کنید
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Subtitles & Latest Gemini Response */}
      <div className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 min-w-0">
        {/* Live speech transcription while speaking */}
        {isRecording && (
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
              <Mic className="w-3 h-3 animate-pulse" />
              <span>کلمات شما:</span>
            </div>
            <p className="font-de text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 min-h-[1.25rem] break-words">
              {liveTranscript || 'در حال دریافت صدای شما... آلمانی صحبت کنید'}
            </p>
          </div>
        )}

        {/* Latest Gemini Response Display */}
        {latestAssistantMessage && !isRecording && (
          <div className="space-y-2.5 min-w-0">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    پاسخ صوتی جمینای:
                  </span>
                  {isGeminiSpeaking && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.2 rounded-full animate-pulse">
                      <Volume2 className="w-2.5 h-2.5" />
                      پخش
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base font-de font-semibold text-slate-900 dark:text-white leading-relaxed break-words">
                  {latestAssistantMessage.textGerman}
                </p>
                {latestAssistantMessage.textPersian && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800 break-words">
                    {latestAssistantMessage.textPersian}
                  </p>
                )}
              </div>

              {/* Replay voice button */}
              <button
                onClick={handleReplayLatest}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
                title="تکرار تلفظ جمینای"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Score & Evaluation Pill for last user speech */}
            {latestUserMessage?.score && (
              <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent border border-emerald-500/20 rounded-xl text-[11px]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    امتیاز: <strong className="font-bold text-emerald-600 dark:text-emerald-400">{latestUserMessage.score.overall || 85} از ۱۰۰</strong>
                  </span>
                </div>
                {lastEvaluation && (
                  <button
                    onClick={() => onOpenEvaluation(lastEvaluation)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>جزئیات ارزیابی</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suggested Quick Replies */}
        {latestAssistantMessage?.suggestedReplies && latestAssistantMessage.suggestedReplies.length > 0 && !isRecording && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block mb-1">
              💡 پیشنهادهایی برای پاسخ:
            </span>
            <div className="flex flex-wrap gap-1">
              {latestAssistantMessage.suggestedReplies.map((sug, i) => (
                <div
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-de max-w-full break-words"
                >
                  "{sug.german}"
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Microphone Control Button */}
      <div className="w-full flex items-center justify-center gap-3 mt-2 sm:mt-4">
        {/* Upload Audio File Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 sm:p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          title="ارسال فایل صوتی ضبط‌شده"
        >
          <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Main Mic Button */}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isThinking}
          className={`relative group flex items-center justify-center w-15 h-15 sm:w-18 sm:h-18 rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${
            isRecording
              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-500/40 ring-6 ring-rose-500/20'
              : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-blue-500/30'
          }`}
          aria-label={isRecording ? 'پایان صحبت' : 'شروع صحبت'}
        >
          {isRecording ? (
            <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
          ) : (
            <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
          )}

          {/* Ripple rings while recording */}
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-75" />
            </>
          )}
        </button>

        {/* Switch to Chat Button */}
        <button
          onClick={onSwitchToChat}
          className="p-2.5 sm:p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          title="مشاهده در قالب چت متنی"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-1 px-2 font-medium">
        {handsFree
          ? isRecording
            ? '🎙️ حالت پیوسته فعال است: صحبت کنید، به محض سکوت هوشمندانه پاسخ داده می‌شود.'
            : '✨ حالت مکالمه پیوسته مانند Gemini Voice فعال است (نیازی به فشردن دکمه استپ نیست).'
          : isRecording
          ? 'آلمانی صحبت کنید و پس از اتمام دکمه قرمز را برای پایان فشار دهید.'
          : 'دکمه میکروفون را بزنید، به آلمانی صحبت کنید و جمینای با صوت به شما پاسخ می‌دهد.'}
      </p>

      {/* Hidden file input for audio uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Mic Permission Guide Modal */}
      <MicPermissionGuideModal
        isOpen={showMicGuide}
        onClose={() => setShowMicGuide(false)}
        onRetry={() => {
          setShowMicGuide(false);
          handleStartRecording();
        }}
        onUploadAudio={() => fileInputRef.current?.click()}
      />
    </div>
  );
};
