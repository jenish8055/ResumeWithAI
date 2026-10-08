import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Download, FileDown, Edit3, Plus, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';
import { exportService } from '../../services/export/exportService';

export default function SuccessModal({ isOpen, onClose, onNewResume }) {
  const { activeResume, showToast } = useResumeStore();

  if (!isOpen || !activeResume) return null;

  const score = activeResume.resumeScore || 92;

  const handleDownloadPdf = async () => {
    try {
      const filename = `${(activeResume.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      await exportService.downloadPdf('resume-preview-container', filename, activeResume.id);
      showToast('PDF downloaded!', 'success');
    } catch (e) {
      showToast('Download failed.', 'error');
    }
  };

  const handleDownloadDocx = async () => {
    try {
      const filename = `${(activeResume.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.docx`;
      await exportService.downloadDocx(activeResume, filename);
      showToast('Word document downloaded!', 'success');
    } catch (e) {
      showToast('Download failed.', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="text-center p-4 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white mx-auto flex items-center justify-center shadow-brand text-2xl animate-bounce">
          🎉
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-heading">
            Your Resume Is Ready!
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            You're ready to apply for your dream role with confidence.
          </p>
        </div>

        {/* Score & ATS Badge */}
        <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-orange-50/70 dark:bg-brand-950/40 border border-orange-200 dark:border-brand-800">
          <div className="text-center">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Resume Score
            </span>
            <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
              {score} <span className="text-sm font-normal text-neutral-500">/ 100</span>
            </p>
          </div>
          <div className="h-8 w-px bg-orange-200 dark:bg-brand-800" />
          <div className="text-center">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              ATS Match Grade
            </span>
            <p className="text-2xl font-extrabold text-emerald-600">
              {activeResume.atsScore || 90}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            icon={Download}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={FileDown}
            onClick={handleDownloadDocx}
          >
            Download Word (.docx)
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Continue Editing
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNewResume?.();
            }}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Another Resume
          </button>
        </div>
      </div>
    </Modal>
  );
}
