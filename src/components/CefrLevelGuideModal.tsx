import React from 'react';
import { X, Award, CheckCircle2, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { UserLevel } from '../types/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: UserLevel;
  onSelectLevel: (lvl: UserLevel) => void;
}

export const CEFR_LEVELS_INFO = [
  {
    level: 'A1' as UserLevel,
    titleFa: 'مبتدی (Einstieg)',
    descriptionFa: 'شروع یادگیری؛ کلمات پایه، معرفی خود، سلام و احوالپرسی، خرید ساده و اعداد.',
    examFa: 'Start Deutsch 1 / Goethe-Zertifikat A1',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    level: 'A2' as UserLevel,
    titleFa: 'مقدماتی (Grundlagen)',
    descriptionFa: 'مکالمات روزمره؛ توصیف خانواده، شغل، محیط اطراف، کارهای روزانه و بیان گذشته ساده.',
    examFa: 'Goethe-Zertifikat A2 / telc Deutsch A2',
    color: 'from-cyan-500 to-blue-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  {
    level: 'B1' as UserLevel,
    titleFa: 'متوسط (Mittelstufe - استاندارد اقامت و کار)',
    descriptionFa: 'استقلال در مکالمه در آلمان؛ سفر، بیان نظرات، دلایل، آرزوها و رسیدگی به امور اداری و روزمره.',
    examFa: 'Goethe-Zertifikat B1 / DTZ (Deutsch-Test für Zuwanderer)',
    color: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    level: 'B2' as UserLevel,
    titleFa: 'فوق متوسط (Gute Mittelstufe - کار تخصصی و دانشگاه)',
    descriptionFa: 'مکالمه روان و خودجوش؛ درک متون پیچیده، دفاع از نظرات در موضوعات تخصصی و کاری.',
    examFa: 'Goethe-Zertifikat B2 / telc Deutsch B2',
    color: 'from-indigo-600 to-purple-600',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  {
    level: 'C1' as UserLevel,
    titleFa: 'پیشرفته (Fortgeschritten - دانشگاه و محیط آکادمیک)',
    descriptionFa: 'تسلط روان و بی‌درنگ مشابه زبان مادری؛ درک متون فلسفی و ادبی، نگارش و سخنرانی ساختاریافته.',
    examFa: 'Goethe-Zertifikat C1 / TestDaF / DSH',
    color: 'from-purple-600 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
];

export const CefrLevelGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLevel,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 text-slate-900 dark:text-slate-100 min-w-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label="بستن"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/25 shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-1.5 truncate">
              راهنمای سطوح زبان آلمانی (CEFR)
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              سطح A1 تا C1 مشخص‌کننده میزان تسلط شما و سختی کلمات جمینای است
            </p>
          </div>
        </div>

        {/* Intro notice */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 mb-3.5 text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>سطوح استاندارد چارچوب اروپایی (CEFR) چیست؟</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            با انتخاب هر سطح از نوار بالای صفحه، هوش مصنوعی جمینای سرعت صحبت، گرامر، دامنه لغات و سخت‌گیری در نمره‌دهی خود را متناسب با سطح شما تنظیم می‌کند.
          </p>
        </div>

        {/* Levels List */}
        <div className="space-y-2 mb-4">
          {CEFR_LEVELS_INFO.map((item) => {
            const isSelected = currentLevel === item.level;

            return (
              <div
                key={item.level}
                onClick={() => {
                  onSelectLevel(item.level);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 shadow-xs'
                    : 'bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {/* Level Badge */}
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs`}
                >
                  {item.level}
                </div>

                {/* Level Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 flex-wrap mb-0.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      سطح {item.level}: {item.titleFa}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.2 rounded-full border border-blue-500/20">
                        سطح فعال شما
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                    {item.descriptionFa}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                    آزمون‌های مربوطه: {item.examFa}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-all text-center"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
