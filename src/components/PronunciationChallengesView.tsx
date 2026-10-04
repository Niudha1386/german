import React, { useState } from 'react';
import { Award, Volume2, Mic, MicOff, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRONUNCIATION_CHALLENGES } from '../data/geminiData';
import { PronunciationChallenge, VoiceOption } from '../types/gemini';
import { geminiAudio } from '../services/geminiAudioService';
import { geminiApi } from '../services/geminiApiService';
import { MicPermissionGuideModal } from './MicPermissionGuideModal';

interface Props {
  voice: VoiceOption;
}

export const PronunciationChallengesView: React.FC<Props> = ({ voice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [showMicGuide, setShowMicGuide] = useState(false);

  const categories = [
    { id: 'all', label: 'همه چالش‌ها' },
    { id: 'Umlaute', label: 'حروف صدادار ö, ü, ä' },
    { id: 'ch-Laut', label: 'صدای نرم ch' },
    { id: 'Satzbau', label: 'ساختار جمله پیرو' },
    { id: 'Zungenbrecher', label: 'زبان‌پیچان‌ها' },
  ];

  const filteredChallenges =
    selectedCategory === 'all'
      ? PRONUNCIATION_CHALLENGES
      : PRONUNCIATION_CHALLENGES.filter((c) => c.category === selectedCategory);

  const handleListenSample = (ch: PronunciationChallenge) => {
    geminiAudio.speakGerman(ch.german, voice);
  };

  const handleStartRecord = async (ch: PronunciationChallenge) => {
    setActiveChallengeId(ch.id);
    try {
      await geminiAudio.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.warn('Mic access error in challenges:', err);
      setIsRecording(false);
      setShowMicGuide(true);
    }
  };

  const handleStopAndEvaluate = async (ch: PronunciationChallenge) => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsEvaluating(true);

    try {
      const { base64, mimeType } = await geminiAudio.stopRecording();
      const evalResult = await geminiApi.evaluateSpeaking({
        targetSentence: ch.german,
        audioBase64: base64,
        mimeType,
        level: ch.level,
      });

      const score = evalResult.overallScore;
      setScores((prev) => ({ ...prev, [ch.id]: score }));
      setFeedback((prev) => ({
        ...prev,
        [ch.id]: evalResult.strengths?.[0] || 'تلفظ شما با موفقیت ثبت شد!',
      }));

      if (score >= 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (e) {
      console.error('Challenge eval error:', e);
    } finally {
      setIsEvaluating(false);
      setActiveChallengeId(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-1.5 sm:px-3 py-2 sm:py-4 space-y-4 min-w-0">
      {/* Header - Compact */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-bold">
          <Award className="w-3 h-3" />
          <span>تمرین آواشناسی و چالش‌های تلفظ</span>
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
          چالش‌های گفتاری و سنجش دقیق تلفظ با جمینای
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          جملات هدف را ابتدا گوش دهید، سپس خودتان تکرار کنید و نمره تلفظ بگیرید.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
        {filteredChallenges.map((ch) => {
          const isThisRecording = isRecording && activeChallengeId === ch.id;
          const isThisEvaluating = isEvaluating && activeChallengeId === ch.id;
          const score = scores[ch.id];
          const fb = feedback[ch.id];

          return (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-purple-500/40 transition-colors min-w-0"
            >
              {/* Card Header info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 truncate">
                    سطح {ch.level} · {ch.phoneticFocus}
                  </span>

                  {score !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full ${
                        score >= 80
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : score >= 60
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      امتیاز: {score}/۱۰۰
                    </span>
                  )}
                </div>

                {/* German Sentence */}
                <p className="font-de font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed break-words">
                  "{ch.german}"
                </p>

                {/* Persian Translation */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                  {ch.persian}
                </p>

                {/* Phonetic Tip */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-600 dark:text-slate-300 break-words">
                  <span className="font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                    💡 نکته تلفظی:
                  </span>
                  {ch.tipFa}
                </div>

                {/* Feedback if available */}
                {fb && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    <span className="break-words">{fb}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700 min-w-0">
                {/* Listen to Gemini voice */}
                <button
                  onClick={() => handleListenSample(ch)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-purple-50 dark:hover:bg-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>شنیدن الگو</span>
                </button>

                {/* Record Button */}
                <button
                  onClick={
                    isThisRecording
                      ? () => handleStopAndEvaluate(ch)
                      : () => handleStartRecord(ch)
                  }
                  disabled={isThisEvaluating}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-xs shrink-0 ${
                    isThisRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {isThisEvaluating ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>امتیازدهی...</span>
                    </>
                  ) : isThisRecording ? (
                    <>
                      <MicOff className="w-3 h-3" />
                      <span>توقف</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3" />
                      <span>تست صدا</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mic Permission Guide Modal */}
      <MicPermissionGuideModal
        isOpen={showMicGuide}
        onClose={() => setShowMicGuide(false)}
        onRetry={() => {
          setShowMicGuide(false);
          if (activeChallengeId) {
            const ch = PRONUNCIATION_CHALLENGES.find((c) => c.id === activeChallengeId);
            if (ch) handleStartRecord(ch);
          }
        }}
      />
    </div>
  );
};
