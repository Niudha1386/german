import React, { useState } from 'react';
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
} from 'lucide-react';
import { UserLevel, DetailedEvaluation, VoiceOption } from '../types/gemini';
import { geminiAudio } from '../services/geminiAudioService';
import { geminiApi } from '../services/geminiApiService';

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
    } catch {
      setErrorMsg('اجازه دسترسی به میکروفون یافت نشد.');
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
      console.error('Speech lab evaluation error:', e);
      setErrorMsg('خطا در ارزیابی صدا. لطفاً دوباره تلاش کنید.');
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>آزمایشگاه سنجش و نمره‌دهی گفتار با جمینای</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ارزیابی هوشمند تلفظ، گرامر و روانی کلام آلمانی
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          صدای خود را به زبان آلمانی ضبط کنید یا متنی بنویسید؛ هوش مصنوعی جمینای در ۴ بعد مختلف به شما امتیاز می‌دهد و اشتباهاتتان را تصحیح می‌کند.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
          جمله یا گفتار آلمانی شما:
        </label>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="مثال: Ich möchte heute Abend ins Kino gehen, weil der Film interessant ist..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-de text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />

        {/* Quick Sample Sentences */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400">
            یا یکی از جملات نمونه زیر را برای سنجش انتخاب کنید:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleSentences.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(s.de)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-blue-50 dark:hover:bg-slate-600 text-xs text-slate-700 dark:text-slate-300 font-de transition-colors border border-slate-200 dark:border-slate-700"
                title={s.fa}
              >
                "{s.de.slice(0, 35)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          {/* Record button */}
          <button
            onClick={isRecording ? handleStopRecordAndEvaluate : handleStartRecord}
            disabled={isEvaluating}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/20'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-blue-500/20'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isRecording ? 'توقف ضبط و نمره‌دهی' : 'ضبط صدا با میکروفون'}</span>
          </button>

          {/* Evaluate text button */}
          <button
            onClick={handleEvaluateText}
            disabled={!inputText.trim() || isEvaluating || isRecording}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              inputText.trim() && !isEvaluating && !isRecording
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
            <span>{isEvaluating ? 'در حال سنجش هوشمند...' : 'سنجش و دریافت کارنامه'}</span>
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-500 font-semibold pt-1">{errorMsg}</p>
        )}
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
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
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {evaluation.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400">از ۱۰۰</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    نمره کل مکالمه شما
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                    سطح معادل: {evaluation.levelAssessment}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ارزیابی دقیق بر اساس معیارهای چارچوب اروپایی CEFR
                </p>
              </div>
            </div>

            {/* Component Metrics */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500 block">تلفظ (Aussprache)</span>
                <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-de">
                  {evaluation.scores.pronunciation}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500 block">گرامر (Grammatik)</span>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 font-de">
                  {evaluation.scores.grammar}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500 block">واژگان (Wortschatz)</span>
                <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-de">
                  {evaluation.scores.vocabulary}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500 block">روانی (Flüssigkeit)</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-de">
                  {evaluation.scores.fluency}%
                </span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {evaluation.strengths?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>نقاط قوت کلام شما:</span>
              </h4>
              <ul className="space-y-1 pr-2">
                {evaluation.strengths.map((str, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Corrections */}
          {evaluation.improvements?.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>اشتباهات شناسایی شده و شیوه صحیح (Korrekturen):</span>
              </h4>
              <div className="space-y-2">
                {evaluation.improvements.map((imp, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm space-y-1"
                  >
                    {imp.original && (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-rose-500 font-de">{imp.original}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-de">
                          {imp.corrected}
                        </span>
                      </div>
                    )}
                    <p className="text-slate-600 dark:text-slate-300">{imp.explanationFa}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Native Alternative */}
          {evaluation.nativeAlternative && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  جمله طبیعی‌تر و روان‌تر به سبک آلمانی‌زبانان نیتیو:
                </span>
                <button
                  onClick={() => handlePlayNative(evaluation.nativeAlternative)}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>شنیدن تلفظ با جمینای</span>
                </button>
              </div>
              <p className="font-de font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                "{evaluation.nativeAlternative}"
              </p>
              {evaluation.nativeAlternativeFa && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ترجمه: {evaluation.nativeAlternativeFa}
                </p>
              )}
            </div>
          )}

          {/* Follow-up question for continuing conversation */}
          {evaluation.followUpQuestion && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  سوال پیشنهادی جمینای برای ادامه مکالمه:
                </span>
                <button
                  onClick={() => handlePlayNative(evaluation.followUpQuestion!.german)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  شنیدن سوال
                </button>
              </div>
              <p className="font-de font-semibold text-sm text-slate-800 dark:text-slate-100">
                "{evaluation.followUpQuestion.german}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {evaluation.followUpQuestion.persian}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
