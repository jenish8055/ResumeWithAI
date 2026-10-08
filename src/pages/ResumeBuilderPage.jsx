import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import SectionNav from '../components/builder/SectionNav';
import ResumePreview from '../components/preview/ResumePreview';
import PersonalInfoSection from '../components/builder/sections/PersonalInfoSection';
import SummarySection from '../components/builder/sections/SummarySection';
import ExperienceSection from '../components/builder/sections/ExperienceSection';
import EducationSection from '../components/builder/sections/EducationSection';
import SkillsSection from '../components/builder/sections/SkillsSection';
import ProjectsSection from '../components/builder/sections/ProjectsSection';
import {
  CertificationsSection,
  AchievementsSection,
  LanguagesSection,
  CustomSections,
} from '../components/builder/sections/AdditionalSections';
import BeginnerGuidedWizard from '../components/builder/sections/BeginnerGuidedWizard';

import AIAssistantModal from '../components/ai/AIAssistantModal';
import TemplateSelectorModal from '../components/builder/TemplateSelectorModal';
import VersionHistoryModal from '../components/builder/VersionHistoryModal';
import ImportResumeModal from '../components/builder/ImportResumeModal';
import SuccessModal from '../components/builder/SuccessModal';
import AIButton from '../components/ai/AIButton';

import { useResumeStore } from '../features/resume/resumeStore';
import {
  Sparkles,
  History,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Eye,
  Edit3,
  Layers,
  Palette,
  ArrowLeft,
} from 'lucide-react';

export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    activeResume,
    selectResume,
    updateActiveResume,
    activeSection,
    saveStatus,
    experienceMode,
    isMobilePreviewOpen,
    setMobilePreviewOpen,
    openAiAssistant,
  } = useResumeStore();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (id && activeResume?.id !== id) {
      selectResume(id);
    }
  }, [id, selectResume]);

  if (!activeResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <span className="text-sm font-semibold">Loading your resume workspace...</span>
        </div>
      </div>
    );
  }

  const handleNameChange = (newName) => {
    const updated = { ...activeResume, resumeName: newName };
    updateActiveResume(updated, 'meta', 'name');
  };

  const renderActiveSectionComponent = () => {
    if (experienceMode === 'beginner' && activeSection === 'wizard') {
      return <BeginnerGuidedWizard onComplete={() => useResumeStore.getState().setActiveSection('personalInfo')} />;
    }

    switch (activeSection) {
      case 'personalInfo':
        return <PersonalInfoSection />;
      case 'summary':
        return <SummarySection />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'certifications':
        return <CertificationsSection />;
      case 'achievements':
        return <AchievementsSection />;
      case 'languages':
        return <LanguagesSection />;
      case 'customSections':
        return <CustomSections />;
      default:
        return <PersonalInfoSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      {/* Top Workspace Header */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Inline editable resume name */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activeResume.resumeName || 'Untitled Resume'}
              onChange={(e) => handleNameChange(e.target.value)}
              className="text-base sm:text-lg font-bold font-heading bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-brand-500 outline-none text-neutral-900 dark:text-white px-1 py-0.5 rounded transition-all"
              placeholder="Resume Name..."
            />
          </div>

          {/* Autosave Status Badge */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 pl-2">
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-brand-500" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Saved ✓</span>
              </>
            )}
          </div>
        </div>

        {/* Top Right Utility Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Import PDF, DOCX or JSON"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVersionModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Version history snapshots"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-brand-950/60 border border-orange-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-brand-500" />
            <span>Templates</span>
          </button>

          {/* Mobile Preview Toggle Button */}
          <button
            type="button"
            onClick={() => setMobilePreviewOpen(!isMobilePreviewOpen)}
            className="xl:hidden flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-500 text-white shadow-brand cursor-pointer"
          >
            {isMobilePreviewOpen ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isMobilePreviewOpen ? 'Edit Content' : 'Preview Resume'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Section Nav (2 cols on wide screens) */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-24 sidebar-column">
          <SectionNav />
        </div>

        {/* Center Column: Section Editor (6 cols) */}
        <div className={`lg:col-span-9 xl:col-span-5 ${isMobilePreviewOpen ? 'hidden xl:block' : 'block'} editor-column`}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-soft">
            {renderActiveSectionComponent()}
          </div>
        </div>

        {/* Right Column: Live Resume Preview (5 cols) */}
        <div className={`lg:col-span-12 xl:col-span-5 sticky top-24 ${isMobilePreviewOpen ? 'block' : 'hidden xl:block'}`}>
          <ResumePreview
            onOpenTemplateSelector={() => setIsTemplateModalOpen(true)}
            onOpenSuccessModal={() => setIsSuccessModalOpen(true)}
          />
        </div>
      </div>

      {/* Floating AI Assistant Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40 no-print">
        <AIButton
          size="md"
          variant="floating"
          onClick={() => openAiAssistant({ mode: 'assistant' })}
          className="shadow-2xl"
        >
          ✨ AI Career Assistant
        </AIButton>
      </div>

      {/* Modals */}
      <AIAssistantModal />
      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />
      <ImportResumeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onNewResume={() => navigate('/create')}
      />
    </div>
  );
}
