import React from 'react';
import { Sparkles, Mic, MessageSquare, Target, Award, Moon, Sun, RotateCcw, Volume2 } from 'lucide-react';
import { UserLevel, VoiceOption } from '../types/gemini';

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
  const levels: UserLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const voices: { id: VoiceOption; labelFa: string }[] = [
    { id: 'Kore', labelFa: 'کوره (صدای طبیعی و آرام)' },
    { id: 'Puck', labelFa: 'پاک (صدای پرانرژی)' },
    { id: 'Charon', labelFa: 'کارون (صدای بم و رسمی)' },
    { id: 'Fenrir', labelFa: 'فنریر (صدای رسا)' },
    { id: 'Zephyr', labelFa: 'زفیر (صدای لطیف)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Gemini Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-30 blur group-hover:opacity-60 transition duration-300 -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Gemini Deutsch
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  صوتی و چت
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
                پارتنر هوشمند تمرین مکالمه، تلفظ و امتیازدهی آلمانی
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => onTabChange('live-voice')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'live-voice'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>جمینای صوتی زنده</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>

            <button
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>چت و مکالمه</span>
            </button>

            <button
              onClick={() => onTabChange('speaking-lab')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'speaking-lab'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>سنجش و نمره‌دهی گفتار</span>
            </button>

            <button
              onClick={() => onTabChange('challenges')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'challenges'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>چالش‌های تلفظ</span>
            </button>
          </nav>

          {/* Right Toolbar: Level, Voice, Theme, Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Level Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onLevelChange(lvl)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    userLevel === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`انتخاب سطح ${lvl}`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Voice Model Selector */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 border border-slate-200 dark:border-slate-700 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={voice}
                onChange={(e) => onVoiceChange(e.target.value as VoiceOption)}
                className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
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
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="تغییر تم تاریک و روشن"
              title="تغییر تم"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Chat Button */}
            <button
              onClick={onResetChat}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label="شروع مکالمه جدید"
              title="شروع مجدد مکالمه"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200/60 dark:border-slate-800/60 gap-1 text-[11px]">
          <button
            onClick={() => onTabChange('live-voice')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'live-voice'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>صوتی زنده</span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>چت آلمانی</span>
          </button>

          <button
            onClick={() => onTabChange('speaking-lab')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'speaking-lab'
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>نمره‌دهی گفتار</span>
          </button>

          <button
            onClick={() => onTabChange('challenges')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl font-medium transition-colors ${
              activeTab === 'challenges'
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>چالش‌های تلفظ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
