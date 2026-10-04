import React, { useState } from 'react';
import { Award, Volume2, Mic, MicOff, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRONUNCIATION_CHALLENGES } from '../data/geminiData';
import { PronunciationChallenge, VoiceOption } from '../types/gemini';
import { geminiAudio } from '../services/geminiAudioService';
import { geminiApi } from '../services/geminiApiService';

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
    } catch {
      alert('اجازه دسترسی به میکروفون داده نشد.');
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>تمرین آواشناسی و چالش‌های تلفظ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          چالش‌های گفتاری و سنجش دقیق تلفظ با جمینای
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          جملات هدف را ابتدا با صدای جمینای گوش دهید، سپس خودتان تکرار کنید و نمره تلفظ خود را دریافت نمایید.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((ch) => {
          const isThisRecording = isRecording && activeChallengeId === ch.id;
          const isThisEvaluating = isEvaluating && activeChallengeId === ch.id;
          const score = scores[ch.id];
          const fb = feedback[ch.id];

          return (
            <div
              key={ch.id}
              className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between hover:border-purple-500/40 transition-colors"
            >
              {/* Card Header info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    سطح {ch.level} · {ch.phoneticFocus}
                  </span>

                  {score !== undefined && (
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        score >= 80
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : score >= 60
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      امتیاز شما: {score}/۱۰۰
                    </span>
                  )}
                </div>

                {/* German Sentence */}
                <p className="font-de font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
                  "{ch.german}"
                </p>

                {/* Persian Translation */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {ch.persian}
                </p>

                {/* Phonetic Tip */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
                    💡 نکته تلفظی:
                  </span>
                  {ch.tipFa}
                </div>

                {/* Feedback if available */}
                {fb && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{fb}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                {/* Listen to Gemini voice */}
                <button
                  onClick={() => handleListenSample(ch)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-purple-50 dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>شنیدن تلفظ الگو</span>
                </button>

                {/* Record Button */}
                <button
                  onClick={
                    isThisRecording
                      ? () => handleStopAndEvaluate(ch)
                      : () => handleStartRecord(ch)
                  }
                  disabled={isThisEvaluating}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isThisRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {isThisEvaluating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال امتیازدهی...</span>
                    </>
                  ) : isThisRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>توقف و نمره‌دهی</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>تکرار و تست صدا</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
