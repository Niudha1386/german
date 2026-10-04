import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  ArrowRight,
  BookOpen,
  Upload,
} from 'lucide-react';
import { UserLevel, DetailedEvaluation, VoiceOption } from '../types/gemini';
import { geminiAudio } from '../services/geminiAudioService';
import { geminiApi } from '../services/geminiApiService';
import { MicPermissionGuideModal } from './MicPermissionGuideModal';

interface Props {
  userLevel: UserLevel;
  voice: VoiceOption;
}

export const SpeakingScoreLab: React.FC<Props> = ({ userLevel, voice }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<DetailedEvaluation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMicGuide, setShowMicGuide] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleSentences = [
    { de: 'Ich wohne seit zwei Jahren in Deutschland und lerne jeden Tag Deutsch.', fa: 'من دو سال است در آلمان زندگی می‌کنم و هر روز آلمانی می‌خوانم.' },
    { de: 'Wenn ich die B2-Prüfung bestehe, möchte ich an der Universität studieren.', fa: 'اگر در آزمون B2 قبول شوم، مایلم در دانشگاه تحصیل کنم.' },
    { de: 'Könnten Sie mir bitte helfen, den richtigen Weg zum Hauptbahnhof zu finden?', fa: 'آیا ممکن است لطفاً به من کمک کنید مسیر درست ایستگاه مرکزی را پیدا کنم؟' },
  ];

  const handleStartRecord = async () => {
    setErrorMsg(null);
    setEvaluation(null);
    try {
      await geminiAudio.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.warn('Mic access error in lab:', err);
      setIsRecording(false);
      setShowMicGuide(true);
      setErrorMsg('دسترسی به میکروفون تایید نشد (Permission denied).');
    }
  };

  const handleStopRecordAndEvaluate = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsEvaluating(true);

    try {
      const { base64, mimeType } = await geminiAudio.stopRecording();
      setRecordedAudioBase64(base64);

      // Transcribe first to show what user said
      const transcribed = await geminiApi.transcribeAudio(base64, mimeType);
      if (transcribed) setInputText(transcribed);

      // Evaluate speech via Gemini
      const evalResult = await geminiApi.evaluateSpeaking({
        text: transcribed,
        audioBase64: base64,
        mimeType,
        level: userLevel,
      });

      setEvaluation(evalResult);
    } catch (e: any) {
      console.warn('Speech lab evaluation error:', e);
      setErrorMsg('خطا در ارزیابی صدا. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsEvaluating(true);
    setErrorMsg(null);

    try {
      const { base64, mimeType } = await geminiAudio.fileToBase64(file);
      setRecordedAudioBase64(base64);

      const transcribed = await geminiApi.transcribeAudio(base64, mimeType);
      if (transcribed) setInputText(transcribed);

      const evalResult = await geminiApi.evaluateSpeaking({
        text: transcribed,
        audioBase64: base64,
        mimeType,
        level: userLevel,
      });

      setEvaluation(evalResult);
    } catch (e) {
      console.warn('File upload eval error:', e);
      setErrorMsg('خطا در پردازش و ارزیابی فایل صوتی.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEvaluateText = async () => {
    if (!inputText.trim() || isEvaluating) return;
    setIsEvaluating(true);
    setErrorMsg(null);

    try {
      const evalResult = await geminiApi.evaluateSpeaking({
        text: inputText.trim(),
        audioBase64: recordedAudioBase64 || undefined,
        level: userLevel,
      });
      setEvaluation(evalResult);
    } catch (e: any) {
      console.error('Text eval error:', e);
      setErrorMsg('خطا در سنجش متن با جمینای.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePlayNative = (text: string) => {
    geminiAudio.speakGerman(text, voice);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-1.5 sm:px-3 py-2 sm:py-4 space-y-4 min-w-0">
      {/* Title Header - Compact */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-bold">
          <Sparkles className="w-3 h-3" />
          <span>آزمایشگاه سنجش و نمره‌دهی گفتار جمینای</span>
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
          ارزیابی هوشمند تلفظ، گرامر و روانی کلام آلمانی
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          صدای خود را ضبط کنید یا متنی بنویسید؛ جمینای در ۴ بعد به شما نمره می‌دهد.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3 min-w-0">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
          جمله یا گفتار آلمانی شما:
        </label>

        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="مثال: Ich möchte heute Abend ins Kino gehen..."
          className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-de text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 min-w-0"
        />

        {/* Quick Sample Sentences */}
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
            یا یکی از جملات نمونه زیر را انتخاب کنید:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleSentences.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(s.de)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/70 hover:bg-blue-50 dark:hover:bg-slate-600 text-[11px] text-slate-700 dark:text-slate-300 font-de transition-colors border border-slate-200 dark:border-slate-700 max-w-full truncate"
                title={s.fa}
              >
                "{s.de.slice(0, 32)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls - Responsive stacking on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-700 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Record button */}
            <button
              onClick={isRecording ? handleStopRecordAndEvaluate : handleStartRecord}
              disabled={isEvaluating}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-xs shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'توقف و نمره‌دهی' : 'ضبط با میکروفون'}</span>
            </button>

            {/* Upload audio file button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isEvaluating || isRecording}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition-colors shrink-0"
              title="بارگذاری فایل صوتی"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ارسال فایل</span>
            </button>
          </div>

          {/* Evaluate text button */}
          <button
            onClick={handleEvaluateText}
            disabled={!inputText.trim() || isEvaluating || isRecording}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              inputText.trim() && !isEvaluating && !isRecording
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
            <span>{isEvaluating ? 'در حال سنجش...' : 'سنجش و دریافت کارنامه'}</span>
          </button>
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-500 font-semibold pt-1 break-words">{errorMsg}</p>
        )}
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-4 animate-fadeIn min-w-0">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600 dark:text-blue-400"
                    strokeDasharray={`${evaluation.overallScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {evaluation.overallScore}
                  </span>
                  <span className="text-[9px] text-slate-400">از ۱۰۰</span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    نمره کل مکالمه
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-600 text-white">
                    سطح: {evaluation.levelAssessment}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ارزیابی بر اساس چارچوب اروپایی CEFR
                </p>
              </div>
            </div>

            {/* Component Metrics */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto shrink-0">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 block">تلفظ</span>
                <span className="text-sm sm:text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-de">
                  {evaluation.scores.pronunciation}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 block">گرامر</span>
                <span className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 font-de">
                  {evaluation.scores.grammar}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 block">واژگان</span>
                <span className="text-sm sm:text-base font-extrabold text-purple-600 dark:text-purple-400 font-de">
                  {evaluation.scores.vocabulary}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-500 block">روانی کلام</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-de">
                  {evaluation.scores.fluency}%
                </span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {evaluation.strengths?.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>نقاط قوت کلام شما:</span>
              </h4>
              <ul className="space-y-1 pr-1">
                {evaluation.strengths.map((str, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="break-words">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Corrections */}
          {evaluation.improvements?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>اشتباهات و شیوه صحیح (Korrekturen):</span>
              </h4>
              <div className="space-y-1.5">
                {evaluation.improvements.map((imp, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1"
                  >
                    {imp.original && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="line-through text-rose-500 font-de">{imp.original}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-de">
                          {imp.corrected}
                        </span>
                      </div>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 break-words">{imp.explanationFa}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Native Alternative */}
          {evaluation.nativeAlternative && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  جمله طبیعی‌تر نیتیو:
                </span>
                <button
                  onClick={() => handlePlayNative(evaluation.nativeAlternative)}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>شنیدن با جمینای</span>
                </button>
              </div>
              <p className="font-de font-semibold text-xs sm:text-sm text-slate-900 dark:text-white break-words">
                "{evaluation.nativeAlternative}"
              </p>
              {evaluation.nativeAlternativeFa && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words">
                  ترجمه: {evaluation.nativeAlternativeFa}
                </p>
              )}
            </div>
          )}

          {/* Follow-up question for continuing conversation */}
          {evaluation.followUpQuestion && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  سوال پیشنهادی برای ادامه:
                </span>
                <button
                  onClick={() => handlePlayNative(evaluation.followUpQuestion!.german)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  شنیدن
                </button>
              </div>
              <p className="font-de font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 break-words">
                "{evaluation.followUpQuestion.german}"
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words">
                {evaluation.followUpQuestion.persian}
              </p>
            </div>
          )}
        </div>
      )}

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
          handleStartRecord();
        }}
        onUploadAudio={() => fileInputRef.current?.click()}
      />
    </div>
  );
};
