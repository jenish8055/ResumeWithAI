import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';

export default function Toast() {
  const toast = useResumeStore((state) => state.toast);
  const dismissToast = useResumeStore((state) => state.dismissToast);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100',
    error: 'border-red-200 dark:border-red-800 bg-red-50/90 dark:bg-red-950/80 text-red-900 dark:text-red-100',
    info: 'border-brand-200 dark:border-brand-800 bg-brand-50/90 dark:bg-brand-950/80 text-brand-900 dark:text-brand-100',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md max-w-md cursor-pointer"
        onClick={dismissToast}
      >
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${borders[toast.type || 'info']}`}>
          {icons[toast.type || 'info']}
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissToast();
            }}
            className="p-1 hover:opacity-75 transition-opacity ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
