import React, { useState } from 'react';
import { 
  X, 
  Headphones, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Tag, 
  ArrowRight,
  ArrowLeft,
  Search
} from 'lucide-react';
import { HOERTEXTE_TRANSCRIPTS } from '../data/hoertexteTranscripts';
import { LESSONS_DATA } from '../data/lessons';
import { speechService } from '../services/speechService';
import { useVocabulary } from '../context/VocabularyContext';

interface HoertexteViewerModalProps {
  initialLesson: number;
  onClose: () => void;
  onWordClick?: (word: string) => void;
}

export const HoertexteViewerModal: React.FC<HoertexteViewerModalProps> = ({
  initialLesson,
  onClose,
  onWordClick,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<number>(initialLesson);
  const { vocabulary } = useVocabulary();

  const lessonTranscripts = HOERTEXTE_TRANSCRIPTS.filter(
    (t) => t.lesson === selectedLesson
  );

  const lessonInfo = LESSONS_DATA.find((l) => l.number === selectedLesson) || LESSONS_DATA[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-linear-to-r from-purple-950 via-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-de">
                  Hörtexte & DVD Transkripte
                </span>
                <span className="text-xs text-purple-200 font-de">
                  Lektion {selectedLesson}: {lessonInfo.germanTitle}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                متن‌های شنیداری و مکالمات استخراج‌شده از PDF
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lesson Selector Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">انتخاب درس:</span>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-1.5 px-3 font-semibold text-slate-800 dark:text-slate-100 outline-hidden font-de cursor-pointer"
            >
              {LESSONS_DATA.map((l) => (
                <option key={l.number} value={l.number}>
                  Lektion {l.number}: {l.germanTitle} ({l.persianTitle})
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-500 dark:text-slate-400 text-xs">
            تعداد بخش‌های صوتی درس: <b className="font-de text-purple-600 dark:text-purple-400 font-bold">{lessonTranscripts.length}</b>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {lessonTranscripts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm">برای این درس متن صوتی در این بخش ثبت نشده است.</p>
            </div>
          ) : (
            lessonTranscripts.map((section, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-850/80 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-750 space-y-4 shadow-2xs"
              >
                {/* Track Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold font-de">
                        {section.trackId}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">گویندگان: {section.speakers}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-de">
                      {section.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => speechService.speak(section.textDe)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="پخش صوتی کل متن"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>پخش صوتی گوینده</span>
                  </button>
                </div>

                {/* German Transcript Text with Paragraphs */}
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-de text-sm sm:text-base leading-relaxed text-left dir-ltr shadow-2xs">
                  {section.textDe.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="mb-2.5 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Extracted Key Words for this Audio */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>واژگان و اصطلاحات کلیدی استخراج‌شده در این فایل صوتی:</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {section.keywords.map((kw, kwIdx) => {
                      // Find in vocabulary if exists
                      const vocabMatch = vocabulary.find(
                        (v) => v.german.toLowerCase() === kw.toLowerCase() || kw.toLowerCase().includes(v.german.toLowerCase())
                      );

                      return (
                        <span
                          key={kwIdx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/80 text-purple-900 dark:text-purple-300 text-xs font-bold font-de shadow-2xs inline-flex items-center gap-1.5"
                        >
                          <span>{kw}</span>
                          {vocabMatch && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans font-normal border-r border-purple-200 dark:border-purple-800/80 pr-1.5 mr-1">
                              {vocabMatch.persian}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850/90 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>متن‌های شنیداری بر اساس فایل رسمی Aspekte neu B1+ Lehrbuch Hörtexte & DVD</span>
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
