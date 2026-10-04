import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  BookOpen, 
  Headphones, 
  CheckCircle2, 
  RotateCcw, 
  Star,
  Volume2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useVocabulary } from '../context/VocabularyContext';
import { CategoryType, SourceType, StudyStatus, VocabularyItem } from '../types/vocabulary';
import { LESSONS_DATA } from '../data/lessons';
import { VocabularyCard } from './VocabularyCard';

interface AdvancedSearchModalProps {
  onClose: () => void;
  onSelectWordLesson?: (lessonNum: number) => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  onClose,
  onSelectWordLesson,
}) => {
  const { vocabulary, userProgress } = useVocabulary();

  const [query, setQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<SourceType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<StudyStatus | 'all' | 'starred'>('all');

  const filteredResults = useMemo(() => {
    return vocabulary.filter((item) => {
      // Lesson filter
      if (selectedLesson !== 'all' && item.lesson !== selectedLesson) return false;

      // Source filter
      if (selectedSource !== 'all' && !item.sources.includes(selectedSource)) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Status filter
      if (selectedStatus !== 'all') {
        const prog = userProgress.words[item.id];
        if (selectedStatus === 'starred' && !prog?.isStarred) return false;
        if (selectedStatus === 'learned' && prog?.status !== 'learned') return false;
        if (selectedStatus === 'review' && prog?.status !== 'review') return false;
        if (selectedStatus === 'unseen' && (prog?.status === 'learned' || prog?.status === 'review')) return false;
      }

      // Query filter (searches German word, Persian translation, examples, pronunciation, grammar notes)
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const inDe = item.german.toLowerCase().includes(q);
        const inFa = item.persian.toLowerCase().includes(q);
        const inEx = item.example?.toLowerCase().includes(q) || false;
        const inExFa = item.exampleTranslation?.toLowerCase().includes(q) || false;
        const inInf = item.infinitive?.toLowerCase().includes(q) || false;
        const inPl = item.plural?.toLowerCase().includes(q) || false;
        const inTag = item.tags?.some(t => t.toLowerCase().includes(q)) || false;

        if (!inDe && !inFa && !inEx && !inExFa && !inInf && !inPl && !inTag) {
          return false;
        }
      }

      return true;
    });
  }, [vocabulary, query, selectedLesson, selectedSource, selectedCategory, selectedStatus, userProgress]);

  const resetFilters = () => {
    setQuery('');
    setSelectedLesson('all');
    setSelectedSource('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters = selectedLesson !== 'all' || selectedSource !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || query !== '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">جستجوی پیشرفته در تمام منابع</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                جستجو در کل واژگان کتاب اصلی (Lehrbuch) و متن‌های شنیداری (Hörtexte) دروس ۱ تا ۱۰
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Search Input and Multi-Filter Controls */}
        <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 space-y-4">
          
          {/* Main Search Bar */}
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی لغت آلمانی، معنی فارسی، مثال یا اصطلاح..."
              className="w-full pr-11 pl-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden shadow-xs transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-4 top-4" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-4 top-4 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Filter Pills Grid (Lesson, Source, Category, Status) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            
            {/* Lesson Filter */}
            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold block text-[11px]">درس (Lektion):</label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-100 outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">همه درس‌ها (۱ تا ۱۰)</option>
                {LESSONS_DATA.map((l) => (
                  <option key={l.number} value={l.number}>
                    Lektion {l.number}: {l.germanTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold block text-[11px]">منبع (Quelle):</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-100 outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">همه منابع</option>
                <option value="Lehrbuch">📘 Lehrbuch (کتاب اصلی)</option>
                <option value="Hörtexte">🎧 Hörtexte (شنیداری)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold block text-[11px]">دسته‌بندی دستوری:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-100 outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="Nomen">اسم‌ها (Nomen)</option>
                <option value="Verben">افعال (Verben)</option>
                <option value="Adjektive">صفات (Adjektive)</option>
                <option value="Adverbien">قیدها (Adverbien)</option>
                <option value="Redewendungen">اصطلاحات (Redewendungen)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold block text-[11px]">وضعیت مطالعه:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-medium text-slate-800 dark:text-slate-100 outline-hidden focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">همه موارد</option>
                <option value="unseen">⚪ جدید / یاد نگرفته</option>
                <option value="review">🔄 نیازمند مرور</option>
                <option value="learned">✓ یادگرفته‌شده</option>
                <option value="starred">⭐ نشان‌شده‌ها</option>
              </select>
            </div>

          </div>

          {/* Quick Active Filter Badges & Results count */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 dark:text-slate-300">
              یافت شد: <b className="text-indigo-600 dark:text-indigo-400 font-de text-sm">{filteredResults.length}</b> واژه
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold cursor-pointer"
              >
                پاک کردن تمام فیلترها
              </button>
            )}
          </div>

        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">هیچ نتیجه‌ای یافت نشد</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                کلمه دیگری را جستجو کنید یا فیلترهای درس و منبع را تغییر دهید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.map((item) => (
                <VocabularyCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850/90 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>پلتفرم واژه‌نامه تخصصی Aspekte neu B1+</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all text-xs cursor-pointer"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
