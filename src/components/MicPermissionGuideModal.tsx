import React from 'react';
import { X, Mic, AlertCircle, RefreshCw, Upload, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onUploadAudio?: () => void;
}

export const MicPermissionGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRetry,
  onUploadAudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">راهنمای فعال‌سازی میکروفون</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              دسترسی مرورگر به میکروفون غیرفعال یا مسدود (Permission Denied) است
            </p>
          </div>
        </div>

        {/* Notice Box */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mb-5 space-y-2">
          <div className="flex items-start gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>چگونه دسترسی به میکروفون را فعال کنیم؟</span>
          </div>
          <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside pr-1">
            <li>
              روی آیکون <strong>قفل (🔒)</strong> یا <strong>تنظیمات سایت</strong> در نوار آدرس مرورگر (بالای صفحه) کلیک کنید.
            </li>
            <li>
              در بخش مجوزها، گزینه <strong>Microphone (میکروفون)</strong> را پیدا کرده و آن را روی <strong>Allow (مجاز)</strong> قرار دهید.
            </li>
            <li>
              پس از تغییر، دکمه <strong>«تلاش مجدد»</strong> زیر را بزنید.
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>درخواست مجدد دسترسی به میکروفون</span>
          </button>

          {onUploadAudio && (
            <button
              onClick={() => {
                onClose();
                onUploadAudio();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>ارسال فایل صوتی</span>
            </button>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            امنیت و حریم خصوصی محفوظ است
          </span>
          <button onClick={onClose} className="hover:underline">
            استفاده از چت متنی
          </button>
        </div>
      </div>
    </div>
  );
};
