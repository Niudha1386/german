import React from 'react';
import { X, Award, CheckCircle2, AlertTriangle, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { DetailedEvaluation } from '../types/gemini';
import { geminiAudio } from '../services/geminiAudioService';

interface Props {
  evaluation: DetailedEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakingScoreModal: React.FC<Props> = ({ evaluation, isOpen, onClose }) => {
  if (!isOpen || !evaluation) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-blue-500 stroke-blue-500 bg-blue-500/10 border-blue-500/30';
    if (score >= 50) return 'text-amber-500 stroke-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-500 stroke-rose-500 bg-rose-500/10 border-rose-500/30';
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 90) return 'فوق‌العاده و در حد نیتیو (Exzellent)';
    if (score >= 80) return 'بسیار خوب و روان (Sehr gut)';
    if (score >= 70) return 'خوب و قابل قبول (Gut)';
    if (score >= 55) return 'متوسط، نیاز به تمرین بیشتر (Befriedigend)';
    return 'مقدماتی، تلاش بیشتر نیاز است (Ausbaufähig)';
  };

  const handlePlayNative = () => {
    if (evaluation.nativeAlternative) {
      geminiAudio.speakGerman(evaluation.nativeAlternative);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-cyan-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              گزارش تحلیلی و نمره‌دهی جمینای
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              ارزیابی جامع تلفظ، گرامر، دامنه واژگان و روانی کلام آلمانی
            </p>
          </div>
        </div>

        {/* Overall Score Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl mb-6 items-center">
          {/* Circular Score */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getScoreColor(evaluation.overallScore).split(' ')[1]}
                  strokeDasharray={`${evaluation.overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{evaluation.overallScore}</span>
                <span className="text-[10px] text-slate-400">از ۱۰۰</span>
              </div>
            </div>
            <span className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              سطح سنجش: {evaluation.levelAssessment || 'B1'}
            </span>
          </div>

          {/* 4 Skill Metric Bars */}
          <div className="sm:col-span-2 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>تلفظ و فونتیک (Aussprache)</span>
                <span className="font-bold">{evaluation.scores.pronunciation}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                  style={{ width: `${evaluation.scores.pronunciation}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>گرامر و ترتیب کلمات (Grammatik)</span>
                <span className="font-bold">{evaluation.scores.grammar}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${evaluation.scores.grammar}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>دامنه واژگان و دقت (Wortschatz)</span>
                <span className="font-bold">{evaluation.scores.vocabulary}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${evaluation.scores.vocabulary}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>روانی کلام و ریتم (Flüssigkeit)</span>
                <span className="font-bold">{evaluation.scores.fluency}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${evaluation.scores.fluency}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              وضعیت کلی: <span className="font-semibold text-slate-700 dark:text-slate-200">{getScoreBadgeText(evaluation.overallScore)}</span>
            </p>
          </div>
        </div>

        {/* Transcribed text */}
        {evaluation.transcription && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              متن شناسایی‌شده از گفتار شما:
            </h4>
            <p className="text-sm sm:text-base font-de font-medium text-slate-800 dark:text-slate-200">
              "{evaluation.transcription}"
            </p>
          </div>
        )}

        {/* Strengths */}
        {evaluation.strengths && evaluation.strengths.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              نقاط قوت گفتار شما (Stärken)
            </h3>
            <ul className="space-y-1.5 pr-2">
              {evaluation.strengths.map((str, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements & Grammar corrections */}
        {evaluation.improvements && evaluation.improvements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" />
              نکات اصلاحی و رفع اشکال (Korrekturen)
            </h3>
            <div className="space-y-3">
              {evaluation.improvements.map((imp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs sm:text-sm space-y-1.5"
                >
                  {imp.original && (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <span className="line-through font-de">{imp.original}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-de">{imp.corrected}</span>
                    </div>
                  )}
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {imp.explanationFa}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Native alternative */}
        {evaluation.nativeAlternative && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                فرم طبیعی‌تر به سبک آلمانی‌زبانان نیتیو:
              </h4>
              <button
                onClick={handlePlayNative}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                title="شنیدن تلفظ با صدای جمینای"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>پخش صوتی</span>
              </button>
            </div>
            <p className="text-sm font-de font-semibold text-slate-800 dark:text-slate-100 mb-1">
              "{evaluation.nativeAlternative}"
            </p>
            {evaluation.nativeAlternativeFa && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ترجمه: {evaluation.nativeAlternativeFa}
              </p>
            )}
          </div>
        )}

        {/* Pronunciation tips */}
        {evaluation.pronunciationTips && evaluation.pronunciationTips.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
              💡 نکات کاربردی تلفظ و آواشناسی:
            </h4>
            <div className="space-y-1.5">
              {evaluation.pronunciationTips.map((tip, idx) => (
                <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl shadow-md transition-all text-sm"
          >
            متوجه شدم و ادامه مکالمه
          </button>
        </div>
      </div>
    </div>
  );
};
