import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Volume2, 
  Check, 
  RotateCcw, 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  Sparkles, 
  BookOpen, 
  Headphones,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyItem, CategoryType, SourceType, StudyStatus } from '../types/vocabulary';
import { useVocabulary } from '../context/VocabularyContext';
import { speechService } from '../services/speechService';
import { LESSONS_DATA } from '../data/lessons';

interface FlashcardsModalProps {
  initialLesson?: number;
  initialCategory?: CategoryType | 'all';
  initialSource?: SourceType | 'all';
  onClose: () => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  initialLesson,
  initialCategory = 'all',
  initialSource = 'all',
  onClose,
}) => {
  const { vocabulary, userProgress, setWordStatus, toggleStarWord } = useVocabulary();

  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>(initialLesson || 'all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>(initialCategory);
  const [selectedSource, setSelectedSource] = useState<SourceType | 'all'>(initialSource);
  const [selectedStatus, setSelectedStatus] = useState<StudyStatus | 'all' | 'starred'>('all');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Filter items based on active criteria
  const deck = useMemo(() => {
    return vocabulary.filter((item) => {
      if (selectedLesson !== 'all' && item.lesson !== selectedLesson) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedSource !== 'all' && !item.sources.includes(selectedSource)) return false;
      
      const prog = userProgress.words[item.id];
      if (selectedStatus === 'starred' && !prog?.isStarred) return false;
      if (selectedStatus === 'learned' && prog?.status !== 'learned') return false;
      if (selectedStatus === 'review' && prog?.status !== 'review') return false;
      if (selectedStatus === 'unseen' && (prog?.status === 'learned' || prog?.status === 'review')) return false;

      return true;
    });
  }, [vocabulary, selectedLesson, selectedCategory, selectedSource, selectedStatus, userProgress]);

  // Reset index when deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, [selectedLesson, selectedCategory, selectedSource, selectedStatus]);

  const currentWord: VocabularyItem | undefined = deck[currentIndex];
  const wordProg = currentWord ? userProgress.words[currentWord.id] : undefined;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      } else if (e.key === '1') {
        if (currentWord) handleMarkReview();
      } else if (e.key === '2') {
        if (currentWord) handleMarkLearned();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, currentIndex, deck.length]);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else if (deck.length > 0) {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setIsCompleted(false);
    }
  };

  const handleShuffle = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  const handleMarkLearned = () => {
    if (!currentWord) return;
    setWordStatus(currentWord.id, 'learned');
    handleNext();
  };

  const handleMarkReview = () => {
    if (!currentWord) return;
    setWordStatus(currentWord.id, 'review');
    handleNext();
  };

  const playPronunciation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentWord) return;
    let text = currentWord.german;
    if (currentWord.category === 'Nomen' && currentWord.article) {
      text = `${currentWord.article} ${currentWord.german}`;
    }
    speechService.speak(text, currentWord.audioUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-de">
              🎴
            </div>
            <div>
              <h3 className="text-base font-bold">تمرین و مرور با فلش‌کارت</h3>
              <p className="text-xs text-slate-400">
                کلید Space برای چرخاندن کارت | ۱: نیاز به مرور | ۲: یاد گرفتم
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Filter Toolbar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          
          {/* Lesson selector */}
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-2.5 outline-hidden"
          >
            <option value="all">همه درس‌ها (۱ تا ۱۰)</option>
            {LESSONS_DATA.map((l) => (
              <option key={l.number} value={l.number}>
                درس {l.number}: {l.germanTitle}
              </option>
            ))}
          </select>

          {/* Category selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-2.5 outline-hidden"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            <option value="Nomen">اسم‌ها (Nomen)</option>
            <option value="Verben">افعال (Verben)</option>
            <option value="Adjektive">صفات (Adjektive)</option>
            <option value="Adverbien">قیدها (Adverbien)</option>
            <option value="Redewendungen">اصطلاحات (Redewendungen)</option>
          </select>

          {/* Source selector */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-2.5 outline-hidden"
          >
            <option value="all">همه منابع (کتاب + شنیداری)</option>
            <option value="Lehrbuch">📘 فقط Lehrbuch</option>
            <option value="Hörtexte">🎧 فقط Hörtexte</option>
          </select>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl py-2 px-2.5 outline-hidden"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="review">🔄 نیازمند مرور</option>
            <option value="unseen">⚪ یاد نگرفته (جدید)</option>
            <option value="learned">✓ یادگرفته‌شده</option>
            <option value="starred">⭐ نشان‌شده‌ها</option>
          </select>

        </div>

        {/* Deck Progress Bar */}
        <div className="px-6 pt-3 flex items-center justify-between text-xs text-slate-400">
          <span>
            کارت <b className="text-white font-de">{deck.length > 0 ? currentIndex + 1 : 0}</b> از <b className="text-white font-de">{deck.length}</b>
          </span>
          <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{
                width: `${deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card Body / Flip Card Area */}
        <div className="p-4 sm:p-8 flex-1 flex flex-col items-center justify-center min-h-[360px]">
          
          {deck.length === 0 ? (
            <div className="text-center space-y-3 p-8">
              <p className="text-slate-400 text-sm">واژه‌ای مطابق فیلترهای انتخابی در این دسته پیدا نشد.</p>
              <button
                onClick={() => {
                  setSelectedLesson('all');
                  setSelectedCategory('all');
                  setSelectedSource('all');
                  setSelectedStatus('all');
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                نمایش تمام کارت‌ها
              </button>
            </div>
          ) : isCompleted ? (
            /* Completed Deck Screen */
            <div className="text-center space-y-4 p-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                🎉
              </div>
              <h4 className="text-2xl font-black">آفرین! دسته کارت‌ها تمام شد.</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                شما تمام {deck.length} کارت این مجموعه را مرور کردید. می‌توانید دوباره از اول مرور کنید یا وضعیت واژه‌ها را در داشبورد مشاهده نمایید.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsCompleted(false);
                    setIsFlipped(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
                >
                  مرور مجدد از اول
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all"
                >
                  بازگشت به درس
                </button>
              </div>
            </div>
          ) : currentWord ? (
            /* The Active Flip Card */
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-xl min-h-[300px] cursor-pointer perspective-1000 group relative"
            >
              <div
                className={`w-full min-h-[300px] rounded-3xl p-6 sm:p-8 transition-all duration-500 transform-style-3d border ${
                  isFlipped
                    ? 'bg-slate-800/95 border-indigo-500/40 shadow-indigo-500/10'
                    : 'bg-linear-to-b from-slate-800 to-slate-850 border-slate-700 shadow-xl'
                } flex flex-col justify-between`}
              >
                
                {/* Card Top Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-700 text-slate-300 font-semibold">
                      Lektion {currentWord.lesson}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold font-de">
                      {currentWord.category}
                    </span>
                    {currentWord.sources.map((s) => (
                      <span key={s} className="text-[11px] text-slate-400 font-de">
                        {s === 'Lehrbuch' ? '📘 LB' : '🎧 HÖR'}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarWord(currentWord.id);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-400"
                    >
                      <Star className={`w-4 h-4 ${wordProg?.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={playPronunciation}
                      className="p-2 rounded-xl bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-colors"
                      title="پخش تلفظ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Center Content: FRONT vs BACK */}
                <div className="my-auto py-6 text-center space-y-4">
                  {!isFlipped ? (
                    /* FRONT OF CARD (as requested: e.g. "teilnehmen" or "die Herausforderung") */
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 flex-wrap font-de">
                        {currentWord.category === 'Nomen' && currentWord.article && (
                          <span className={`text-2xl font-black ${
                            currentWord.article === 'der' ? 'text-blue-400' : currentWord.article === 'die' ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {currentWord.article}
                          </span>
                        )}
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                          {currentWord.german}
                        </h2>
                      </div>
                      {currentWord.pronunciation && (
                        <p className="text-xs text-slate-400 font-mono font-de">
                          {currentWord.pronunciation}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 pt-3">
                        برای دیدن معنی و فرم‌های گرامری کلیک کنید (یا Space را بزنید)
                      </p>
                    </div>
                  ) : (
                    /* BACK OF CARD (as requested: e.g. "شرکت کردن \n Verb \n Präteritum: nahm teil \n Perfekt: hat teilgenommen") */
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <h3 className="text-2xl font-bold text-amber-300">
                        {currentWord.persian}
                      </h3>

                      {/* Grammar Details Breakdown */}
                      {currentWord.category === 'Verben' && (
                        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60 max-w-md mx-auto text-xs space-y-1 font-de">
                          {currentWord.present && (
                            <div className="text-slate-300">
                              <span className="text-slate-400">Präsens:</span> {currentWord.present}
                            </div>
                          )}
                          <div className="text-slate-300">
                            <span className="text-slate-400">Präteritum:</span> <b className="text-indigo-300">{currentWord.preterite || '—'}</b>
                          </div>
                          <div className="text-slate-300">
                            <span className="text-slate-400">Perfekt:</span> <b className="text-emerald-400">{currentWord.perfect || '—'}</b>
                          </div>
                          {currentWord.prepositionCase && (
                            <div className="text-amber-300 pt-1 text-[11px]">
                              Präposition: {currentWord.prepositionCase}
                            </div>
                          )}
                        </div>
                      )}

                      {currentWord.category === 'Nomen' && currentWord.plural && (
                        <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-700/60 max-w-md mx-auto text-xs font-de text-slate-300">
                          Plural: <b className="text-amber-300">{currentWord.plural}</b>
                        </div>
                      )}

                      {currentWord.example && (
                        <div className="bg-slate-900/60 p-3 rounded-xl text-right max-w-lg mx-auto space-y-1 border border-slate-700/40">
                          <p className="text-xs font-de text-slate-200 text-left">
                            „{currentWord.example}“
                          </p>
                          {currentWord.exampleTranslation && (
                            <p className="text-[11px] text-slate-400">
                              {currentWord.exampleTranslation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Flip Prompt */}
                <div className="text-center text-[11px] text-slate-400">
                  {isFlipped ? 'روی کارت کلیک کنید تا به روی اصلی برگردد' : '🔀 چرخش کارت'}
                </div>

              </div>
            </div>
          ) : null}

        </div>

        {/* Footer Actions: Marking Buttons (✓ یاد گرفتم / 🔄 نیاز به مرور دارم) and Next/Prev */}
        {deck.length > 0 && !isCompleted && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">قبلی</span>
            </button>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-2 flex-1 justify-center max-w-md">
              <button
                onClick={handleMarkReview}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>نیاز به مرور دارم (۱)</span>
              </button>

              <button
                onClick={handleMarkLearned}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>یاد گرفتم ✓ (۲)</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-xs"
            >
              <span className="hidden sm:inline">بعدی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
