import React, { useState } from 'react';
import { 
  Volume2, 
  Check, 
  RotateCcw, 
  Star, 
  BookOpen, 
  Headphones, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Layers
} from 'lucide-react';
import { VocabularyItem, CategoryType } from '../types/vocabulary';
import { useVocabulary } from '../context/VocabularyContext';
import { speechService } from '../services/speechService';

interface VocabularyCardProps {
  item: VocabularyItem;
  onPracticeSingle?: (item: VocabularyItem) => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({ item, onPracticeSingle }) => {
  const { userProgress, setWordStatus, toggleStarWord } = useVocabulary();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const wordProgress = userProgress.words[item.id] || {
    status: 'unseen',
    studyCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  };

  const playAudio = () => {
    setIsPlayingAudio(true);
    // Determine the best speech text
    let textToSpeak = item.german;
    if (item.category === 'Nomen' && item.article) {
      textToSpeak = `${item.article} ${item.german}`;
    }
    speechService.speak(
      textToSpeak,
      item.audioUrl,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const getCategoryColor = (cat: CategoryType) => {
    switch (cat) {
      case 'Nomen':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      case 'Verben':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'Adjektive':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      case 'Adverbien':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
      case 'Redewendungen':
        return 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getCategoryFa = (cat: CategoryType) => {
    switch (cat) {
      case 'Nomen':
        return 'اسم (Nomen)';
      case 'Verben':
        return 'فعل (Verb)';
      case 'Adjektive':
        return 'صفت (Adjektiv)';
      case 'Adverbien':
        return 'قید (Adverb)';
      case 'Redewendungen':
        return 'اصطلاح (Redewendung)';
      default:
        return cat;
    }
  };

  const getArticleColor = (article?: string) => {
    switch (article) {
      case 'der':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800';
      case 'die':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800';
      case 'das':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const isLearned = wordProgress.status === 'learned';
  const isReview = wordProgress.status === 'review';
  const isStarred = !!wordProgress.isStarred;

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-200 hover:shadow-lg ${
        isLearned
          ? 'bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/80'
          : isReview
          ? 'bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-600/80'
          : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        
        {/* Top Badges Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getCategoryColor(
                item.category
              )}`}
            >
              {getCategoryFa(item.category)}
            </span>

            {/* Source Badges */}
            {item.sources.map((src) => (
              <span
                key={src}
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                  src === 'Lehrbuch'
                    ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
                    : 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
                }`}
                title={item.sourceDetails
                  .filter((s) => s.source === src)
                  .map((s) => `${s.module || ''} ${s.pageOrTrack || ''}`)
                  .join(' | ')}
              >
                {src === 'Lehrbuch' ? (
                  <BookOpen className="w-3 h-3" />
                ) : (
                  <Headphones className="w-3 h-3" />
                )}
                <span>{src}</span>
              </span>
            ))}

            {/* Lesson indicator */}
            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-de font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              L{item.lesson}
            </span>
          </div>

          {/* Action Icons: Star & Audio */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleStarWord(item.id)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isStarred
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                  : 'text-slate-300 dark:text-slate-500 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isStarred ? 'حذف از نشان‌شده‌ها' : 'نشان کردن این کلمه'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={playAudio}
              disabled={isPlayingAudio}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white shadow-md scale-105 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/50 dark:border-slate-700'
              }`}
              title="پخش تلفظ آلمانی"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* German Word Display */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            {item.category === 'Nomen' && item.article && (
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-md border font-de ${getArticleColor(
                  item.article
                )}`}
              >
                {item.article}
              </span>
            )}

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-de">
              {item.german}
            </h3>

            {item.pronunciation && (
              <span className="text-xs text-slate-400 dark:text-slate-400 font-mono font-de">
                {item.pronunciation}
              </span>
            )}
          </div>

          {/* Persian Meaning */}
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed pt-0.5">
            {item.persian}
          </p>
        </div>

        {/* Category Specific Grammar Information Box */}
        {item.category === 'Nomen' && item.plural && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">جمع (Plural):</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-de">{item.plural}</span>
            {item.genderPersian && (
              <span className="text-slate-600 dark:text-slate-300 mr-auto text-[11px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600">
                جنسیت: {item.genderPersian}
              </span>
            )}
          </div>
        )}

        {item.category === 'Verben' && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className="bg-white dark:bg-slate-900/90 p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[9px] sm:text-[10px]">حال (Präsens):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-de text-[11px] sm:text-xs truncate block">
                  {item.present || '—'}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[9px] sm:text-[10px]">گذشته (Prät.):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-de text-[11px] sm:text-xs truncate block">
                  {item.preterite || '—'}
                </span>
              </div>
              <div className="bg-indigo-50/80 dark:bg-indigo-950/80 p-1.5 sm:p-2 rounded-xl border border-indigo-200 dark:border-indigo-800/90 text-center">
                <span className="text-indigo-600 dark:text-indigo-400 block text-[9px] sm:text-[10px] font-medium">کامل (Perfekt):</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 font-de text-[11px] sm:text-xs truncate block">
                  {item.perfect || '—'}
                </span>
              </div>
            </div>

            {(item.auxiliary || item.prepositionCase || item.separable || item.reflexive) && (
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/80 dark:border-slate-700/80 flex-wrap text-[11px]">
                {item.auxiliary && (
                  <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                    کمکی: <b className="font-de text-slate-900 dark:text-white">{item.auxiliary}</b>
                  </span>
                )}
                {item.prepositionCase && (
                  <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/60 font-de font-bold">
                    حرف اضافه: {item.prepositionCase}
                  </span>
                )}
                {item.separable && (
                  <span className="bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 font-semibold">
                    جداشدنی (trennbar)
                  </span>
                )}
                {item.reflexive && (
                  <span className="bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/60 font-semibold">
                    انعکاسی (reflexiv)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {item.category === 'Adjektive' && (item.comparative || item.opposite) && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 text-xs flex-wrap">
            {item.comparative && (
              <div>
                <span className="text-slate-500 dark:text-slate-400 ml-1">تفضیل/عالی:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-de">
                  {item.comparative} / {item.superlative}
                </span>
              </div>
            )}
            {item.opposite && (
              <div className="mr-auto">
                <span className="text-slate-500 dark:text-slate-400 ml-1">متضاد:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 font-de">{item.opposite}</span>
              </div>
            )}
          </div>
        )}

        {item.category === 'Redewendungen' && (item.explanation || item.literalMeaning) && (
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
            {item.explanation && (
              <p className="text-slate-800 dark:text-slate-200">
                <span className="font-bold text-amber-900 dark:text-amber-400 ml-1">توضیح کاربرد:</span>
                {item.explanation}
              </p>
            )}
            {item.literalMeaning && (
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                <span className="font-semibold ml-1">معنی تحت‌اللفظی:</span>
                {item.literalMeaning}
              </p>
            )}
          </div>
        )}

        {/* Example Sentence Section */}
        {item.example && (
          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 font-de leading-relaxed">
                „{item.example}“
              </div>
              <button
                onClick={() => speechService.speak(item.example!)}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                title="پخش صوتی مثال"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {item.exampleTranslation && (
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                {item.exampleTranslation}
              </div>
            )}
          </div>
        )}

        {/* Source Details Accordion */}
        {item.sourceDetails && item.sourceDetails.length > 0 && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>مشاهده جزئیات منبع و موقعیت در کتاب / فایل صوتی</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {isExpanded && (
              <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-2 text-xs border border-slate-200 dark:border-slate-700">
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">منابع ثبت‌شده در کتاب:</div>
                {item.sourceDetails.map((src, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 border-b border-slate-200/80 dark:border-slate-700/80 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-900 dark:text-white font-de">
                      {src.source === 'Lehrbuch' ? '📘 Lehrbuch' : '🎧 Hörtexte'}
                    </span>
                    <span>•</span>
                    <span className="font-de">
                      {src.module || `Lektion ${src.lesson}`} {src.pageOrTrack ? `(${src.pageOrTrack})` : ''}
                    </span>
                    {src.context && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-auto font-de italic truncate max-w-[200px]">
                        "{src.context}"
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions: Learning Status Buttons */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 gap-2">
          
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            {/* Mark as Learned Button */}
            <button
              onClick={() => setWordStatus(item.id, isLearned ? 'unseen' : 'learned')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border active:scale-95 ${
                isLearned
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300'
              }`}
            >
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>{isLearned ? 'یاد گرفتم ✓' : 'یاد گرفتم'}</span>
            </button>

            {/* Needs Review Button */}
            <button
              onClick={() => setWordStatus(item.id, isReview ? 'unseen' : 'review')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border active:scale-95 ${
                isReview
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/60 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>{isReview ? 'مرور 🔄' : 'نیاز به مرور'}</span>
            </button>
          </div>

          {onPracticeSingle && (
            <button
              onClick={() => onPracticeSingle(item)}
              className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              title="تمرین فلش‌کارت تک‌کلمه"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
