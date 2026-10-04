import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  Download, 
  FileText, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Cpu, 
  BookOpen, 
  Headphones,
  ArrowDown,
  Code2,
  X
} from 'lucide-react';
import { useVocabulary } from '../context/VocabularyContext';
import { VocabularyItem, CategoryType, SourceType, ArticleType, AuxiliaryVerb } from '../types/vocabulary';
import { LESSONS_DATA } from '../data/lessons';

interface PdfPipelineManagerProps {
  onClose: () => void;
}

export const PdfPipelineManager: React.FC<PdfPipelineManagerProps> = ({ onClose }) => {
  const { 
    vocabulary, 
    addVocabularyItem, 
    importVocabularyBatch, 
    exportDatabaseJson, 
    resetToDefaults 
  } = useVocabulary();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'import' | 'addWord' | 'manage'>('pipeline');
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });

  // Manual Word Addition Form State
  const [newWord, setNewWord] = useState<{
    german: string;
    persian: string;
    category: CategoryType;
    lesson: number;
    source: SourceType;
    article?: ArticleType;
    plural?: string;
    infinitive?: string;
    present?: string;
    preterite?: string;
    perfect?: string;
    auxiliary?: AuxiliaryVerb;
    example?: string;
    exampleTranslation?: string;
    explanation?: string;
  }>({
    german: '',
    persian: '',
    category: 'Nomen',
    lesson: 1,
    source: 'Lehrbuch',
    article: 'der',
    plural: '',
    infinitive: '',
    present: '',
    preterite: '',
    perfect: '',
    auxiliary: 'haben',
    example: '',
    exampleTranslation: '',
    explanation: '',
  });

  const handleJsonImport = () => {
    try {
      setImportStatus({ message: '', type: null });
      if (!jsonInput.trim()) {
        setImportStatus({ message: 'لطفاً کد JSON را وارد کنید.', type: 'error' });
        return;
      }

      const parsed = JSON.parse(jsonInput);
      const itemsToImport: VocabularyItem[] = Array.isArray(parsed) ? parsed : [parsed];

      // Validate minimal fields
      for (const it of itemsToImport) {
        if (!it.german || !it.persian || !it.category || !it.lesson) {
          throw new Error('هر رکورد باید حداقل فیلدهای german، persian، category و lesson را داشته باشد.');
        }
      }

      const result = importVocabularyBatch(itemsToImport, true);
      setImportStatus({
        message: `با موفقیت وارد شد! ${result.added} کلمه جدید اضافه شد و ${result.merged} کلمه تکراری با حفظ منابع ادغام گردید.`,
        type: 'success',
      });
      setJsonInput('');
    } catch (err: any) {
      setImportStatus({
        message: `خطا در تجزیه JSON: ${err.message || 'فرمت داده نامعتبر است.'}`,
        type: 'error',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aspekte-b1plus-database-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateManualWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.german.trim() || !newWord.persian.trim()) {
      alert('لطفاً کلمه آلمانی و معنی فارسی را تکمیل کنید.');
      return;
    }

    addVocabularyItem({
      german: newWord.german.trim(),
      persian: newWord.persian.trim(),
      category: newWord.category,
      lesson: Number(newWord.lesson),
      sources: [newWord.source],
      sourceDetails: [
        {
          source: newWord.source,
          lesson: Number(newWord.lesson),
          module: 'ورود دستی',
        },
      ],
      article: newWord.category === 'Nomen' ? newWord.article : undefined,
      plural: newWord.category === 'Nomen' ? newWord.plural : undefined,
      infinitive: newWord.category === 'Verben' ? newWord.infinitive || newWord.german : undefined,
      present: newWord.category === 'Verben' ? newWord.present : undefined,
      preterite: newWord.category === 'Verben' ? newWord.preterite : undefined,
      perfect: newWord.category === 'Verben' ? newWord.perfect : undefined,
      auxiliary: newWord.category === 'Verben' ? newWord.auxiliary : undefined,
      example: newWord.example || undefined,
      exampleTranslation: newWord.exampleTranslation || undefined,
      explanation: newWord.explanation || undefined,
    });

    setImportStatus({
      message: `واژه «${newWord.german}» با موفقیت به درس ${newWord.lesson} اضافه شد.`,
      type: 'success',
    });

    // Reset some fields
    setNewWord((prev) => ({
      ...prev,
      german: '',
      persian: '',
      plural: '',
      example: '',
      exampleTranslation: '',
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">معماری استخراج PDF و مدیریت دیتابیس</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                پایگاه داده ساختاریافته دو منبع Lehrbuch و Hörtexte بدون بارگذاری مستقیم PDF در سرور کلاینت
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-bold py-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>معماری و پایپ‌لاین دو PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'import'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>ورود دسته‌ای داده (Batch JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('addWord')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'addWord'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن دستی کلمه</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی و پشتیبان‌گیری</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Pipeline Architecture */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/80 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>تضمین عملکرد بسیار سریع و سازگار با Cloudflare Workers</span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  طبق اصول معماری پایدار، پردازش فایل‌های سنگین PDF به صورت آفلاین یا از طریق پایپ‌لاین جداگانه انجام شده و خروجی ساختاریافته JSON به وبسایت تزریق می‌گردد. بنابراین در سمت کلاینت هیچ‌گونه بار سنگین یا تأخیری ایجاد نخواهد شد.
                </p>
              </div>

              {/* Visual Pipeline Flow */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">مراحل گام‌به‌گام استخراج و اتصال دو منبع:</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step 1 & 2: PDF 1 */}
                  <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-200 text-xs">
                      <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>منبع اول: Aspekte neu B1+ Lehrbuch</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>تفکیک درس‌های ۱ تا ۱۰ کتاب اصلی</li>
                      <li>استخراج واژگان، اسامی، افعال، صفات، قیدها و اصطلاحات</li>
                      <li>استخراج مثال‌های متنی و قواعد دستوری</li>
                    </ul>
                  </div>

                  {/* Step 3 & 4: PDF 2 */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200 text-xs">
                      <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>منبع دوم: Aspekte neu B1+ Hörtexte</span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li>تفکیک متن‌های شنیداری دروس ۱ تا ۱۰</li>
                      <li>استخراج کلمات و اصطلاحات خاص مکالمات شنیداری</li>
                      <li>ثبت شماره Track و مکالمه مربوطه</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Duplication Merger Step */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-xs">
                    <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>مرحله هوشمند: تشخیص و ادغام موارد مشترک (Duplicate Merger)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    اگر واژه‌ای مانند <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded font-de font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">teilnehmen</code> در هر دو PDF وجود داشته باشد، سیستم آن را دوبار ثبت نمی‌کند؛ بلکه برچسب‌های هر دو منبع (<code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded font-de text-xs dark:text-amber-300 border border-slate-200 dark:border-slate-700">Lehrbuch + Hörtexte</code>) و موقعیت‌های دقیق هر دو فایل را در یک رکورد واحد تجمیع می‌نماید.
                  </p>
                </div>
              </div>

              {/* JSON Schema Sample Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">نمونه ساختار استاندارد داده (JSON Data Schema):</h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">TypeScript / JSON</span>
                </div>
                <pre className="p-4 bg-slate-900 dark:bg-slate-950 text-amber-300 rounded-2xl text-[11px] font-mono overflow-x-auto text-left dir-ltr max-h-48 border border-slate-800">
{`{
  "id": "l1-v1",
  "lesson": 1,
  "sources": ["Lehrbuch", "Hörtexte"],
  "category": "Verben",
  "german": "teilnehmen",
  "persian": "شرکت کردن، حضور یافتن",
  "infinitive": "teilnehmen an (+ Dat.)",
  "present": "nimmt teil",
  "preterite": "nahm teil",
  "perfect": "hat teilgenommen",
  "auxiliary": "haben",
  "example": "Viele Jugendliche nehmen an sozialen Projekten teil.",
  "exampleTranslation": "بسیاری از جوانان در پروژه‌های اجتماعی شرکت می‌کنند.",
  "sourceDetails": [
    { "source": "Lehrbuch", "lesson": 1, "module": "Modul 1", "pageOrTrack": "S. 10" },
    { "source": "Hörtexte", "lesson": 1, "module": "Hörtext 1.2", "pageOrTrack": "Track 1.03" }
  ]
}`}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 2: Batch JSON Import */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">ورود دسته‌ای واژگان استخراج‌شده از PDF</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  می‌توانید خروجی JSON استخراج‌شده را در کادر زیر قرار دهید یا فایل JSON را آپلود کنید. موارد تکراری به صورت خودکار ادغام خواهند شد.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
                  <Upload className="w-3.5 h-3.5" />
                  <span>انتخاب فایل JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">یا متن JSON را مستقیماً جای‌گذاری کنید:</span>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"german": "...", "persian": "...", "category": "Nomen", "lesson": 1, "sources": ["Lehrbuch"]}]'
                rows={8}
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-hidden dir-ltr text-left"
              />

              {importStatus.message && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {importStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <button
                onClick={handleJsonImport}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                پردازش و ادغام در پایگاه داده سایت
              </button>
            </div>
          )}

          {/* TAB 3: Add Single Word Form */}
          {activeTab === 'addWord' && (
            <form onSubmit={handleCreateManualWord} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">کلمه یا عبارت آلمانی:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. die Herausforderung"
                    value={newWord.german}
                    onChange={(e) => setNewWord({ ...newWord, german: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-de text-slate-900 dark:text-white outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">معنی فارسی:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. چالش، کار دشوار"
                    value={newWord.persian}
                    onChange={(e) => setNewWord({ ...newWord, persian: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">درس:</label>
                  <select
                    value={newWord.lesson}
                    onChange={(e) => setNewWord({ ...newWord, lesson: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs outline-hidden cursor-pointer"
                  >
                    {LESSONS_DATA.map((l) => (
                      <option key={l.number} value={l.number}>
                        درس {l.number}: {l.germanTitle}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">دسته‌بندی دستوری:</label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({ ...newWord, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs outline-hidden cursor-pointer"
                  >
                    <option value="Nomen">اسم (Nomen)</option>
                    <option value="Verben">فعل (Verben)</option>
                    <option value="Adjektive">صفت (Adjektive)</option>
                    <option value="Adverbien">قید (Adverbien)</option>
                    <option value="Redewendungen">اصطلاح (Redewendungen)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">منبع اصلی:</label>
                  <select
                    value={newWord.source}
                    onChange={(e) => setNewWord({ ...newWord, source: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs outline-hidden cursor-pointer"
                  >
                    <option value="Lehrbuch">📘 کتاب اصلی (Lehrbuch)</option>
                    <option value="Hörtexte">🎧 متن شنیداری (Hörtexte)</option>
                  </select>
                </div>
              </div>

              {/* Conditional category fields */}
              {newWord.category === 'Nomen' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-800/60">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-900 dark:text-blue-200">آرتیکل (Artikel):</label>
                    <select
                      value={newWord.article}
                      onChange={(e) => setNewWord({ ...newWord, article: e.target.value as any })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-de cursor-pointer"
                    >
                      <option value="der">der (مذکر)</option>
                      <option value="die">die (مونث)</option>
                      <option value="das">das (خنثی)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-blue-900 dark:text-blue-200">فرم جمع (Plural):</label>
                    <input
                      type="text"
                      placeholder="e.g. die Herausforderungen"
                      value={newWord.plural}
                      onChange={(e) => setNewWord({ ...newWord, plural: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-de outline-hidden"
                    />
                  </div>
                </div>
              )}

              {newWord.category === 'Verben' && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800/60">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">Präsens 3.P:</label>
                    <input
                      type="text"
                      placeholder="e.g. nimmt teil"
                      value={newWord.present}
                      onChange={(e) => setNewWord({ ...newWord, present: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-de outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">Präteritum:</label>
                    <input
                      type="text"
                      placeholder="e.g. nahm teil"
                      value={newWord.preterite}
                      onChange={(e) => setNewWord({ ...newWord, preterite: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-de outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">Perfekt:</label>
                    <input
                      type="text"
                      placeholder="e.g. hat teilgenommen"
                      value={newWord.perfect}
                      onChange={(e) => setNewWord({ ...newWord, perfect: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-de outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">جمله مثال آلمانی:</label>
                  <input
                    type="text"
                    placeholder="e.g. Viele Jugendliche nehmen am Workshop teil."
                    value={newWord.example}
                    onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-de outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ترجمه فارسی مثال:</label>
                  <input
                    type="text"
                    placeholder="e.g. بسیاری از نوجوانان در کارگاه شرکت می‌کنند."
                    value={newWord.exampleTranslation}
                    onChange={(e) => setNewWord({ ...newWord, exampleTranslation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                ثبت و اضافه کردن واژه
              </button>
            </form>
          )}

          {/* TAB 4: Manage & Backup */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">پشتیبان‌گیری کامل از دیتابیس واژگان</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      دانلود فایل JSON کامل شامل تمامی {vocabulary.length} واژه و نمونه‌ها
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود دیتابیس (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-rose-50/60 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-bold text-rose-900 dark:text-rose-200 text-xs">بازنشانی به داده‌های اولیه درس‌ها</h5>
                    <p className="text-[11px] text-rose-700 dark:text-rose-400">
                      پاک کردن تغییرات دستی و بازگرداندن واژگان نمونه استاندارد Aspekte neu B1+
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('آیا از بازنشانی دیتابیس به داده‌های پیش‌فرض اطمینان دارید؟')) {
                        resetToDefaults();
                        setImportStatus({
                          message: 'دیتابیس با موفقیت به حالت اولیه بازنشانی شد.',
                          type: 'success',
                        });
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>بازنشانی پیش‌فرض</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850/90 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>کل واژگان ثبت‌شده در سیستم: <b className="text-slate-800 dark:text-slate-100 font-de">{vocabulary.length}</b></span>
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
