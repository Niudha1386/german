import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  Database, 
  Menu, 
  X, 
  Star, 
  BookMarked, 
  Headphones,
  Sun,
  Moon
} from 'lucide-react';
import { useVocabulary } from '../context/VocabularyContext';
import { useTheme } from '../context/ThemeContext';
import { LESSONS_DATA } from '../data/lessons';

interface HeaderProps {
  currentView: 'dashboard' | 'lesson' | 'flashcards' | 'quiz' | 'search' | 'database';
  setCurrentView: (view: 'dashboard' | 'lesson' | 'flashcards' | 'quiz' | 'search' | 'database') => void;
  selectedLesson: number;
  setSelectedLesson: (lessonNum: number) => void;
  onOpenSearch: () => void;
  onOpenFlashcards: () => void;
  onOpenQuiz: () => void;
  onOpenDatabase: () => void;
  onOpenHoertexte?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  selectedLesson,
  setSelectedLesson,
  onOpenSearch,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenDatabase,
  onOpenHoertexte,
}) => {
  const { getGlobalStats } = useVocabulary();
  const { theme, toggleTheme } = useTheme();
  const stats = getGlobalStats();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lessonDropdownOpen, setLessonDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-right group transition-all cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-sm group-hover:shadow-md transition-all shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-black text-sm font-de">
                  B1+
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight font-de leading-none">
                    Aspekte neu B1+
                  </span>
                  <span className="hidden xl:inline-block text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                    واژه‌نامه هوشمند
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden 2xl:block mt-0.5">
                  آموزش جامع لغات و اصطلاحات آلمانی
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {/* Lessons Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLessonDropdownOpen(!lessonDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all cursor-pointer ${
                  currentView === 'lesson'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>درس‌ها (۱ تا ۱۰)</span>
                {currentView === 'lesson' && (
                  <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-de">
                    L{selectedLesson}
                  </span>
                )}
              </button>

              {lessonDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setLessonDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2 z-30 grid grid-cols-1 gap-1 max-h-96 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>انتخاب درس</span>
                      <span className="font-de text-[11px]">Lektionen 1 - 10</span>
                    </div>
                    {LESSONS_DATA.map((lesson) => (
                      <button
                        key={lesson.number}
                        onClick={() => {
                          setSelectedLesson(lesson.number);
                          setCurrentView('lesson');
                          setLessonDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-right transition-all cursor-pointer ${
                          selectedLesson === lesson.number && currentView === 'lesson'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold font-de shrink-0">
                            {lesson.number}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-de">
                              Lektion {lesson.number}: {lesson.germanTitle}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lesson.persianTitle}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>جستجو</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Hörtexte Transcripts */}
            {onOpenHoertexte && (
              <button
                onClick={onOpenHoertexte}
                className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all font-semibold cursor-pointer border border-purple-200/60 dark:border-purple-800/40"
              >
                <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>متن‌های شنیداری</span>
              </button>
            )}

            {/* Flashcards */}
            <button
              onClick={onOpenFlashcards}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all cursor-pointer ${
                currentView === 'flashcards'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500 shrink-0" />
              <span>فلش‌کارت‌ها</span>
            </button>

            {/* Quiz */}
            <button
              onClick={onOpenQuiz}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all cursor-pointer ${
                currentView === 'quiz'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
              <span>آزمون تستی</span>
            </button>

            {/* PDF & Database Manager */}
            <button
              onClick={onOpenDatabase}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all cursor-pointer ${
                currentView === 'database'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>پایگاه داده</span>
            </button>
          </nav>

          {/* Right Controls: Progress Pill + Dark Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* User Progress Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">پیشرفت:</span>
              <span className="font-bold text-slate-900 dark:text-white font-de">{stats.completionPercentage}%</span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px]">({stats.learnedWords}/{stats.totalWords})</span>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
              title={theme === 'dark' ? 'تغییر به تم روشن (Light)' : 'تغییر به تم تاریک (Dark)'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Open Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/90 rounded-2xl text-xs border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">میزان یادگیری کل:</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-de">{stats.completionPercentage}% ({stats.learnedWords}/{stats.totalWords})</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold active:scale-98 transition-all"
            >
              <BookMarked className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>داشبورد درس‌ها</span>
            </button>

            {onOpenHoertexte && (
              <button
                onClick={() => {
                  onOpenHoertexte();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold border border-purple-200/60 dark:border-purple-800 active:scale-98 transition-all"
              >
                <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>متن‌های شنیداری</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenFlashcards();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200/60 dark:border-amber-800/60 active:scale-98 transition-all"
            >
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>فلش‌کارت‌ها</span>
            </button>

            <button
              onClick={() => {
                onOpenQuiz();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold border border-rose-200/60 dark:border-rose-800/60 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>آزمون تستی</span>
            </button>

            <button
              onClick={() => {
                onOpenDatabase();
                setMobileMenuOpen(false);
              }}
              className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60 active:scale-98 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>پایگاه داده و مدیریت PDF</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">انتخاب سریع درس:</div>
            <div className="grid grid-cols-5 gap-1.5">
              {LESSONS_DATA.map((l) => (
                <button
                  key={l.number}
                  onClick={() => {
                    setSelectedLesson(l.number);
                    setCurrentView('lesson');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-1 rounded-xl text-center font-de text-xs font-bold transition-all active:scale-95 ${
                    selectedLesson === l.number && currentView === 'lesson'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  L{l.number}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
