import React from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Target,
  FolderGit2,
  Award,
  Star,
  Globe,
  Heart,
  HelpCircle,
  GripVertical,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';

const SECTION_METADATA = {
  personalInfo: { label: 'Personal Info', icon: User, required: true },
  summary: { label: 'Summary', icon: FileText, required: true },
  experience: { label: 'Experience', icon: Briefcase },
  education: { label: 'Education', icon: GraduationCap, required: true },
  skills: { label: 'Skills', icon: Target, required: true },
  projects: { label: 'Projects', icon: FolderGit2 },
  certifications: { label: 'Certifications', icon: Award },
  achievements: { label: 'Achievements', icon: Star },
  languages: { label: 'Languages', icon: Globe },
  interests: { label: 'Interests', icon: Heart },
  volunteerExperience: { label: 'Volunteer', icon: Heart },
  awards: { label: 'Awards', icon: Award },
  customSections: { label: 'Custom Sections', icon: Layers },
};

export default function SectionNav() {
  const {
    activeResume,
    activeSection,
    setActiveSection,
    updateSectionOrder,
    toggleSection,
    experienceMode,
    setExperienceMode,
  } = useResumeStore();

  if (!activeResume) return null;

  const sectionOrder = activeResume.sectionOrder || Object.keys(SECTION_METADATA);
  const enabledSections = activeResume.enabledSections || {};

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sectionOrder.length) return;

    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(newIndex, 0, moved);
    updateSectionOrder(newOrder);
  };

  const isSectionComplete = (key) => {
    if (key === 'personalInfo') return !!(activeResume.personalInfo?.fullName && activeResume.personalInfo?.email);
    if (key === 'summary') return !!(activeResume.summary?.trim()?.length > 30);
    if (key === 'experience') return (activeResume.experience || []).length > 0;
    if (key === 'education') return (activeResume.education || []).length > 0;
    if (key === 'skills') return (activeResume.skills || []).length >= 4;
    if (key === 'projects') return (activeResume.projects || []).length > 0;
    if (key === 'certifications') return (activeResume.certifications || []).length > 0;
    if (key === 'achievements') return (activeResume.achievements || []).length > 0;
    if (key === 'languages') return (activeResume.languages || []).length > 0;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Experience Mode Selector Pill */}
      <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Mode
          </span>
          <span className="text-[11px] font-bold text-brand-600 capitalize">
            {experienceMode}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-semibold">
          {['beginner', 'intermediate', 'advanced'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setExperienceMode(m)}
              className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                experienceMode === m
                  ? 'bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-1">
        <div className="px-2 pb-1 flex justify-between items-center text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          <span>Sections</span>
          <span>Order</span>
        </div>

        {sectionOrder.map((sectionKey, index) => {
          const meta = SECTION_METADATA[sectionKey];
          if (!meta) return null;
          const Icon = meta.icon || FileText;
          const isActive = activeSection === sectionKey;
          const isEnabled = enabledSections[sectionKey] !== false;
          const isCompleted = isSectionComplete(sectionKey);

          return (
            <div
              key={sectionKey}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-orange-50/80 dark:bg-brand-950/50 border-brand-500/50 text-brand-900 dark:text-brand-100 font-semibold shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800/80 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300'
              } ${!isEnabled ? 'opacity-40' : ''}`}
              onClick={() => setActiveSection(sectionKey)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-500' : 'text-neutral-400'}`} />
                <span className="text-xs truncate">{meta.label}</span>
                {isCompleted && isEnabled && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {/* Up/Down order controls (Available in Intermediate & Advanced) */}
                {experienceMode !== 'beginner' && (
                  <>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, -1);
                      }}
                      className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3 h-3 text-neutral-500" />
                    </button>
                    <button
                      type="button"
                      disabled={index === sectionOrder.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 1);
                      }}
                      className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3 h-3 text-neutral-500" />
                    </button>
                  </>
                )}

                {/* Visibility Toggle */}
                {!meta.required && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(sectionKey);
                    }}
                    className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded cursor-pointer"
                    title={isEnabled ? 'Hide section' : 'Show section'}
                  >
                    {isEnabled ? (
                      <Eye className="w-3 h-3 text-neutral-400" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-neutral-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
