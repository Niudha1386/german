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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 text-slate-900 dark:text-slate-100 min-w-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="بستن"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-2 sm:p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold truncate">راهنمای فعال‌سازی میکروفون</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              دسترسی مرورگر به میکروفون تایید نشده است
            </p>
          </div>
        </div>

        {/* Notice Box */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mb-4 space-y-1.5">
          <div className="flex items-start gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>چگونه دسترسی را فعال کنیم؟</span>
          </div>
          <ol className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside pr-1">
            <li>
              روی آیکون <strong>قفل (🔒)</strong> در نوار آدرس بالای مرورگر بزنید.
            </li>
            <li>
              گزینه <strong>Microphone (میکروفون)</strong> را روی <strong>Allow (مجاز)</strong> بگذارید.
            </li>
            <li>
              دکمه <strong>«تلاش مجدد»</strong> را بزنید.
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={onRetry}
            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تلاش مجدد میکروفون</span>
          </button>

          {onUploadAudio && (
            <button
              onClick={() => {
                onClose();
                onUploadAudio();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ارسال فایل صوتی</span>
            </button>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            حریم خصوصی محفوظ است
          </span>
          <button onClick={onClose} className="hover:underline">
            چت متنی
          </button>
        </div>
      </div>
    </div>
  );
};
