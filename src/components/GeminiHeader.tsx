import React, { useState } from 'react';
import { Sparkles, Mic, MessageSquare, Target, Award, Moon, Sun, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { UserLevel, VoiceOption } from '../types/gemini';
import { CefrLevelGuideModal } from './CefrLevelGuideModal';

export type AppTab = 'live-voice' | 'chat' | 'speaking-lab' | 'challenges';

interface Props {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  userLevel: UserLevel;
  onLevelChange: (level: UserLevel) => void;
  voice: VoiceOption;
  onVoiceChange: (voice: VoiceOption) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetChat: () => void;
}

export const GeminiHeader: React.FC<Props> = ({
  activeTab,
  onTabChange,
  userLevel,
  onLevelChange,
  voice,
  onVoiceChange,
  darkMode,
  onToggleDarkMode,
  onResetChat,
}) => {
  const [showLevelGuide, setShowLevelGuide] = useState(false);
  const levels: UserLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const voices: { id: VoiceOption; labelFa: string }[] = [
    { id: 'Kore', labelFa: 'کوره (صدای طبیعی و آرام)' },
    { id: 'Puck', labelFa: 'پاک (صدای پرانرژی)' },
    { id: 'Charon', labelFa: 'کارون (صدای بم و رسمی)' },
    { id: 'Fenrir', labelFa: 'فنریر (صدای رسا)' },
    { id: 'Zephyr', labelFa: 'زفیر (صدای لطیف)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-2.5 sm:px-4">
        <div className="flex items-center justify-between h-13 sm:h-16 gap-1.5 sm:gap-3">
          {/* Logo & Gemini Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20 group">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Gemini Deutsch
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  صوتی و چت
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400">
                پارتنر هوشمند تمرین مکالمه و تصحیح آلمانی
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => onTabChange('live-voice')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                activeTab === 'live-voice'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>صوتی زنده</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>

            <button
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>چت و مکالمه</span>
            </button>

            <button
              onClick={() => onTabChange('speaking-lab')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                activeTab === 'speaking-lab'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>نمره‌دهی گفتار</span>
            </button>

            <button
              onClick={() => onTabChange('challenges')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                activeTab === 'challenges'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>چالش‌های تلفظ</span>
            </button>
          </nav>

          {/* Right Toolbar: Level, Voice, Theme, Reset */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Level Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onLevelChange(lvl)}
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[10px] sm:text-xs font-bold transition-all ${
                    userLevel === lvl
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`سطح ${lvl} (برای راهنمای سطوح روی آیکون راهنما بزنید)`}
                >
                  {lvl}
                </button>
              ))}
              <button
                onClick={() => setShowLevelGuide(true)}
                className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="راهنمای سطوح زبان آلمانی A1 تا C1"
                aria-label="راهنمای سطوح زبان آلمانی"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>

            {/* Voice Model Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-200 dark:border-slate-700 text-xs">
              <Volume2 className="w-3 h-3 text-slate-400 shrink-0" />
              <select
                value={voice}
                onChange={(e) => onVoiceChange(e.target.value as VoiceOption)}
                className="bg-transparent border-none text-[11px] font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id} className="dark:bg-slate-800">
                    {v.labelFa}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="تغییر تم تاریک و روشن"
              title="تغییر تم"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Reset Chat Button */}
            <button
              onClick={onResetChat}
              className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="شروع مکالمه جدید"
              title="شروع مجدد مکالمه"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-1.5 border-t border-slate-200/60 dark:border-slate-800/60 gap-1 text-[10px] w-full">
          <button
            onClick={() => onTabChange('live-voice')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg font-medium transition-colors min-w-0 ${
              activeTab === 'live-voice'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate w-full text-center">صوتی</span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg font-medium transition-colors min-w-0 ${
              activeTab === 'chat'
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate w-full text-center">چت</span>
          </button>

          <button
            onClick={() => onTabChange('speaking-lab')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg font-medium transition-colors min-w-0 ${
              activeTab === 'speaking-lab'
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate w-full text-center">نمره‌دهی</span>
          </button>

          <button
            onClick={() => onTabChange('challenges')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg font-medium transition-colors min-w-0 ${
              activeTab === 'challenges'
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate w-full text-center">چالش‌ها</span>
          </button>
        </div>
      </div>

      {/* CEFR Level Guide Modal */}
      <CefrLevelGuideModal
        isOpen={showLevelGuide}
        onClose={() => setShowLevelGuide(false)}
        currentLevel={userLevel}
        onSelectLevel={onLevelChange}
      />
    </header>
  );
};
