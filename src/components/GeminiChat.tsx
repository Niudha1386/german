import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Sliders,
  Upload,
} from 'lucide-react';
import {
  ChatMessage,
  DetailedEvaluation,
  UserLevel,
  VoiceOption,
  ConversationScenario,
} from '../types/gemini';
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
}

export const GeminiChat: React.FC<Props> = ({
  messages,
  onAddMessage,
  userLevel,
  voice,
  scenario,
  onScenarioChange,
  onOpenEvaluation,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});
  const [expandedCorrections, setExpandedCorrections] = useState<Record<string, boolean>>({});
  const [showMicGuide, setShowMicGuide] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recordingTimerRef = useRef<any>(null);

  const activeScenario = SCENARIOS.find((s) => s.id === scenario) || SCENARIOS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Toggle translation visibility for a message
  const toggleTranslation = (id: string) => {
    setExpandedTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCorrections = (id: string) => {
    setExpandedCorrections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Play assistant voice
  const handlePlayVoice = (id: string, text: string) => {
    if (currentlyPlayingId === id) {
      geminiAudio.stopSpeaking();
      setCurrentlyPlayingId(null);
      return;
    }

    setCurrentlyPlayingId(id);
    geminiAudio.speakGerman(
      text,
      voice,
      playbackSpeed,
      () => setCurrentlyPlayingId(id),
      () => setCurrentlyPlayingId(null)
    );
  };

  // Send typed message
  const handleSendText = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    setInputText('');
    setIsSending(true);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      textGerman: text,
      timestamp: Date.now(),
    };
    onAddMessage(userMsg);

    try {
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

      // Speak reply automatically
      handlePlayVoice(assistantMsg.id, assistantMsg.textGerman);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        textGerman: 'Entschuldigung, es gab ein Verbindungsproblem. Bitte versuche es noch einmal!',
        textPersian: 'متأسفم، مشکلی در ارتباط با سرور رخ داد. لطفاً دوباره پیام خود را ارسال کنید.',
        timestamp: Date.now(),
      };
      onAddMessage(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Start voice recording
  const handleStartRecording = async () => {
    try {
      await geminiAudio.startRecording((vol) => setAudioVolume(vol));
      setIsRecording(true);
    } catch (e) {
      console.warn('Mic start error handled:', e);
      setIsRecording(false);
      setShowMicGuide(true);
    }
  };

  // Process audio (recording or uploaded file) in chat
  const processChatAudio = async (base64: string, mimeType: string) => {
    setIsSending(true);

    try {
      const transcribed = await geminiApi.transcribeAudio(base64, mimeType);
      const text = transcribed || 'Ich übe Deutsch.';

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        textGerman: text,
        audioBase64: base64,
        timestamp: Date.now(),
        isAudioRecording: true,
      };
      onAddMessage(userMsg);

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

      handlePlayVoice(assistantMsg.id, assistantMsg.textGerman);
    } catch (e: any) {
      console.warn('Audio send error in chat:', e);
      const errMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        textGerman: 'Entschuldigung, die Sprachverarbeitung ist fehlgeschlagen. Bitte versuche es noch einmal!',
        textPersian: 'پردازش پیام صوتی با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
        timestamp: Date.now(),
      };
      onAddMessage(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Stop voice recording & evaluate
  const handleStopRecording = async () => {
    if (!isRecording) return;
    setIsRecording(false);

    try {
      const { base64, mimeType } = await geminiAudio.stopRecording();
      await processChatAudio(base64, mimeType);
    } catch (e: any) {
      console.warn('Record send error:', e);
      setIsSending(false);
    }
  };

  // Handle uploaded audio file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const { base64, mimeType } = await geminiAudio.fileToBase64(file);
      await processChatAudio(base64, mimeType);
    } catch (err) {
      console.warn('File upload error in chat:', err);
    }
  };

  // Request comprehensive analysis modal for a user message
  const handleOpenDetailedScore = async (msg: ChatMessage) => {
    try {
      const evaluation = await geminiApi.evaluateSpeaking({
        text: msg.textGerman,
        audioBase64: msg.audioBase64,
        level: userLevel,
      });
      onOpenEvaluation(evaluation);
    } catch (e) {
      console.error('Open eval error:', e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] md:h-[calc(100dvh-5.5rem)] w-full max-w-2xl mx-auto px-1.5 sm:px-3 py-1.5 sm:py-2.5 min-w-0 overflow-hidden">
      {/* Top Scenario Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none shrink-0 max-w-full">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap pl-1">
          سناریو:
        </span>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => onScenarioChange(s.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 ${
              scenario === s.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.titleFa}</span>
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-1 space-y-3 my-1 min-w-0">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isPlaying = currentlyPlayingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-fadeIn min-w-0 max-w-full`}
            >
              {/* Message Header info */}
              <div className="flex items-center gap-2 mb-0.5 px-1">
                {isAssistant ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Gemini Deutsch</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    {msg.score && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20 text-[10px]">
                        امتیاز: {msg.score.overall || 85}/۱۰۰
                      </span>
                    )}
                    <span>شما</span>
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-[95%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-xs transition-all min-w-0 break-words ${
                  isAssistant
                    ? 'bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 rounded-tr-xs'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tl-xs shadow-blue-500/10'
                }`}
              >
                {/* German Content */}
                <p className="text-xs sm:text-sm font-de font-semibold leading-relaxed break-words">
                  {msg.textGerman}
                </p>

                {/* Assistant Controls (Voice, Translation toggle, Vocabulary) */}
                {isAssistant && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/80 space-y-2 min-w-0">
                    {/* Voice playback & Translation buttons - cleanly wrapping on mobile */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => handlePlayVoice(msg.id, msg.textGerman)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            isPlaying
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                          }`}
                          title="پخش صوتی با صدای هوش مصنوعی"
                        >
                          {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>{isPlaying ? 'توقف' : 'پخش'}</span>
                        </button>

                        {/* Speed selector */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          <Sliders className="w-2.5 h-2.5 ml-1 text-slate-400" />
                          <button
                            onClick={() => setPlaybackSpeed(0.8)}
                            className={`px-1 py-0.2 rounded ${playbackSpeed === 0.8 ? 'text-blue-600 font-extrabold' : ''}`}
                          >
                            0.8x
                          </button>
                          <span>·</span>
                          <button
                            onClick={() => setPlaybackSpeed(1.0)}
                            className={`px-1 py-0.2 rounded ${playbackSpeed === 1.0 ? 'text-blue-600 font-extrabold' : ''}`}
                          >
                            1x
                          </button>
                          <span>·</span>
                          <button
                            onClick={() => setPlaybackSpeed(1.2)}
                            className={`px-1 py-0.2 rounded ${playbackSpeed === 1.2 ? 'text-blue-600 font-extrabold' : ''}`}
                          >
                            1.2x
                          </button>
                        </div>
                      </div>

                      {/* Persian Translation Toggle */}
                      {msg.textPersian && (
                        <button
                          onClick={() => toggleTranslation(msg.id)}
                          className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          <span>{expandedTranslations[msg.id] ? 'پنهان' : 'ترجمه فارسی'}</span>
                          {expandedTranslations[msg.id] ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Persian Translation Body */}
                    {msg.textPersian && expandedTranslations[msg.id] && (
                      <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/60 dark:border-slate-800 break-words">
                        {msg.textPersian}
                      </div>
                    )}

                    {/* Grammar Corrections from Assistant for previous User input */}
                    {msg.corrections && msg.corrections.length > 0 && (
                      <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
                        <div
                          className="flex items-center justify-between cursor-pointer font-bold text-amber-700 dark:text-amber-300 text-[11px]"
                          onClick={() => toggleCorrections(msg.id)}
                        >
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            نکات اصلاحی گرامر ({msg.corrections.length})
                          </span>
                          {expandedCorrections[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </div>
                        {expandedCorrections[msg.id] && (
                          <div className="space-y-1.5 pt-1 border-t border-amber-500/20">
                            {msg.corrections.map((cor, ci) => (
                              <div key={ci} className="space-y-0.5 text-[11px]">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="line-through text-rose-500 font-de">{cor.original}</span>
                                  <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-de">{cor.corrected}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 break-words">{cor.explanationFa}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Key Vocabulary Pills */}
                    {msg.keyVocabulary && msg.keyVocabulary.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <BookOpen className="w-2.5 h-2.5" />
                          لغات:
                        </span>
                        {msg.keyVocabulary.map((kv, ki) => (
                          <span
                            key={ki}
                            className="px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-de font-medium border border-blue-500/20"
                            title={kv.persian}
                          >
                            {kv.german} <span className="font-sans text-[9px] text-slate-500">({kv.persian})</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* User Message Action: Full Detailed Score Button */}
                {!isAssistant && (
                  <div className="mt-1.5 pt-1.5 border-t border-white/20 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleOpenDetailedScore(msg)}
                      className="flex items-center gap-1 font-semibold text-cyan-200 hover:text-white hover:underline transition-colors text-[11px]"
                    >
                      <Award className="w-3 h-3" />
                      <span>تحلیل کامل تلفظ و گرامر</span>
                    </button>
                    <span className="text-[9px] text-white/70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Clickable Suggested Next Replies for User */}
              {isAssistant && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                <div className="mt-1.5 mr-1 flex flex-wrap gap-1 max-w-[90%]">
                  {msg.suggestedReplies.map((sug, si) => (
                    <button
                      key={si}
                      onClick={() => setInputText(sug.german)}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-de text-left hover:border-blue-400 transition-colors break-words"
                      title={sug.persian}
                    >
                      "{sug.german}" <span className="font-sans text-[9px] text-slate-400">({sug.persian})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-xs animate-pulse text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span className="font-semibold text-slate-600 dark:text-slate-300 text-[11px]">
              جمینای در حال پردازش و ارزیابی...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 pt-1.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 min-w-0">
        {/* Active Recording Overlay Bar */}
        {isRecording && (
          <div className="flex items-center justify-between p-2 mb-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 animate-pulse text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="text-[11px] font-bold font-de">{recordingSeconds}s</span>
              <span className="text-[11px] font-medium truncate">در حال ضبط صدای شما...</span>
            </div>
            <button
              onClick={handleStopRecording}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-bold shadow-xs hover:bg-rose-700 transition-colors shrink-0"
            >
              ارسال و نمره‌دهی
            </button>
          </div>
        )}

        <div className="relative flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-slate-800/90 rounded-xl p-1 sm:p-1.5 border border-slate-200 dark:border-slate-700 shadow-xs focus-within:ring-2 focus-within:ring-blue-500/30 min-w-0">
          {/* Microphone Record Button */}
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isSending}
            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white animate-bounce'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
            }`}
            title={isRecording ? 'توقف و ارسال صدا' : 'صحبت صوتی به آلمانی'}
          >
            {isRecording ? <MicOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400" />}
          </button>

          {/* Upload Audio File Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="p-2 sm:p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
            title="ارسال فایل صوتی ضبط‌شده"
          >
            <Upload className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Text input textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
            placeholder="به آلمانی بنویسید یا دکمه میکروفون را بزنید..."
            className="flex-1 bg-transparent border-none resize-none focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:text-xs max-h-24 font-de py-1 min-w-0"
          />

          {/* Send Button */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim() || isSending}
            className={`p-2 sm:p-2.5 rounded-lg transition-all flex items-center justify-center shrink-0 ${
              inputText.trim() && !isSending
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="ارسال پیام"
          >
            <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5 rotate-180" />
          </button>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-1 px-1 truncate sm:whitespace-normal">
          جمینای اشتباهات گرامری را شناسایی کرده و به مکالمه آلمانی شما امتیاز می‌دهد.
        </p>
      </div>

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
