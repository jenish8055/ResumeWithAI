import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useResumeStore } from '../features/resume/resumeStore';
import { aiService } from '../services/ai/aiService';
import { exportService } from '../services/export/exportService';
import { FormInput, FormTextarea } from '../components/common/FormInput';
import { Sparkles, Copy, Download, FileDown, Check, Mail, Building2, Briefcase } from 'lucide-react';

export default function CoverLetterPage() {
  const { activeResume, showToast } = useResumeStore();

  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [company, setCompany] = useState('Acme Innovations');
  const [tone, setTone] = useState('professional');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await aiService.generateCoverLetter({
        fullName: activeResume?.personalInfo?.fullName || 'Applicant',
        jobTitle,
        company,
        jobDescription,
        tone,
        resumeData: activeResume || {},
      });
      setCoverLetterData(result);
      showToast('Cover letter generated with AI!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate cover letter.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    if (!coverLetterData) return;
    const fullText = `${coverLetterData.date}\n\n${coverLetterData.recipient}\n\n${coverLetterData.salutation}\n\n${coverLetterData.body}\n\n${coverLetterData.signOff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Cover letter copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPdf = async () => {
    try {
      await exportService.downloadPdf('cover-letter-paper', `${company.replace(/\s+/g, '_')}_Cover_Letter.pdf`);
      showToast('Cover letter PDF downloaded!', 'success');
    } catch (e) {
      showToast('Failed to download PDF.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div>
            <Badge variant="brand" icon={Mail}>AI Cover Letter</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mt-1">
              AI Cover Letter Generator
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Generate tailored, persuasive letters that match the job description and your genuine experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Configuration Column (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                Target Role Details
              </h3>

              <FormInput
                label="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Lead Frontend Developer"
                icon={Briefcase}
                required
              />

              <FormInput
                label="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Google, Spotify"
                icon={Building2}
                required
              />

              {/* Tone Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Tone of Voice
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['professional', 'formal', 'confident'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`text-xs py-2 rounded-xl border capitalize font-semibold transition-all cursor-pointer ${
                        tone === t
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <FormTextarea
                label="Job Description / Requisition (Optional)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or requirements to emphasize..."
                rows={4}
              />

              <Button
                variant="ai"
                size="md"
                icon={Sparkles}
                isLoading={isGenerating}
                onClick={handleGenerate}
                className="w-full"
              >
                Generate Cover Letter
              </Button>
            </div>

            {/* Live Paper Preview Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {coverLetterData && (
                <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                  <span className="text-xs font-bold text-neutral-500">Letter Ready</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={copied ? Check : Copy} onClick={handleCopyText}>
                      {copied ? 'Copied' : 'Copy Text'}
                    </Button>
                    <Button variant="primary" size="sm" icon={Download} onClick={handleDownloadPdf}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 sm:p-12 text-neutral-800 text-xs sm:text-sm leading-relaxed space-y-6 min-h-[500px]">
                {coverLetterData ? (
                  <div id="cover-letter-paper" className="space-y-6 font-sans">
                    <div className="space-y-1">
                      <p className="font-bold text-base text-neutral-900">{activeResume?.personalInfo?.fullName || 'Applicant Name'}</p>
                      <p className="text-xs text-neutral-500">{activeResume?.personalInfo?.email} • {activeResume?.personalInfo?.phone}</p>
                      <p className="text-xs text-neutral-400 pt-2">{coverLetterData.date}</p>
                    </div>

                    <div className="text-xs text-neutral-600 whitespace-pre-line border-l-2 border-brand-500 pl-3">
                      {coverLetterData.recipient}
                    </div>

                    <p className="font-bold text-neutral-900">{coverLetterData.salutation}</p>

                    <div className="space-y-4 whitespace-pre-line text-neutral-700 leading-relaxed">
                      {coverLetterData.body}
                    </div>

                    <div className="pt-4 space-y-1 whitespace-pre-line font-medium">
                      {coverLetterData.signOff}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 text-neutral-400 space-y-3">
                    <Mail className="w-12 h-12 text-neutral-300 animate-pulse" />
                    <p className="text-sm font-semibold">
                      Fill in the target role details on the left and click "Generate Cover Letter".
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
