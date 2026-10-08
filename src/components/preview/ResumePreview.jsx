import React, { useState } from 'react';
import MasterTemplateRenderer from './templates/TemplateRegistry';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  Download,
  FileDown,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Palette,
  CheckCircle,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';
import { exportService } from '../../services/export/exportService';
import confetti from 'canvas-confetti';

export default function ResumePreview({ onOpenTemplateSelector, onOpenSuccessModal }) {
  const { activeResume, zoomLevel, setZoomLevel, showToast } = useResumeStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  if (!activeResume) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const filename = `${(activeResume.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      await exportService.downloadPdf('resume-preview-container', filename, activeResume.id);
      
      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      showToast('PDF downloaded successfully! 🎉', 'success');
      onOpenSuccessModal?.();
    } catch (err) {
      console.error(err);
      showToast('Failed to export PDF. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExporting(true);
    try {
      const filename = `${(activeResume.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.docx`;
      await exportService.downloadDocx(activeResume, filename);
      
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      showToast('Word document downloaded! 🎉', 'success');
      onOpenSuccessModal?.();
    } catch (err) {
      console.error(err);
      showToast('Failed to export Word document.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    exportService.print();
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-soft">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-10">
        <div className="flex items-center gap-3">
          <Badge variant="brand" icon={ShieldCheck}>
            ATS Score {activeResume.atsScore || 85}%
          </Badge>

          <button
            type="button"
            onClick={onOpenTemplateSelector}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-brand-500" />
            <span className="capitalize">{activeResume.template?.templateId || 'Modern'} Template</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
            className="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-neutral-700 dark:text-neutral-300">{zoomLevel}%</span>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
            className="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            title="Print Resume (A4 format)"
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={FileDown}
            isLoading={isExporting}
            onClick={handleDownloadDocx}
          >
            Word
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            isLoading={isExporting}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Interactive Paper Preview Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-neutral-100/70 dark:bg-neutral-950/70">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shrink-0"
        >
          <div
            id="resume-preview-container"
            className="resume-paper rounded-lg shadow-xl overflow-hidden"
          >
            <MasterTemplateRenderer resume={activeResume} />
          </div>
        </div>
      </div>
    </div>
  );
}
