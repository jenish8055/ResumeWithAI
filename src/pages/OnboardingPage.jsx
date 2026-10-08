import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { TEMPLATES } from '../features/resume/resumeTemplates';
import { useResumeStore } from '../features/resume/resumeStore';
import { localStorageService } from '../services/storage/localStorageService';
import { activityLogger, LOG_EVENTS } from '../services/logging/ActivityLoggerService';
import {
  Sparkles,
  FileText,
  FileBadge,
  Users,
  Mail,
  UserCheck,
  GraduationCap,
  Briefcase,
  Code,
  Palette,
  Layers,
  Activity,
  Cpu,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { createNewResume, setExperienceMode } = useResumeStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [docType, setDocType] = useState('resume');
  const [profession, setProfession] = useState('developer');
  const [goal, setGoal] = useState('Find a Job');
  const [mode, setMode] = useState('intermediate');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const stepTitles = [
    { num: 1, title: 'What are you creating?' },
    { num: 2, title: 'What best describes you?' },
    { num: 3, title: 'What is your primary goal?' },
    { num: 4, title: 'Choose your experience level' },
    { num: 5, title: 'Select a template' },
  ];

  const handleFinish = async () => {
    activityLogger.log(LOG_EVENTS.ONBOARDING_COMPLETED, {
      metadata: { docType, profession, goal, mode, selectedTemplate },
    });

    localStorageService.setOnboardingCompleted(true);
    setExperienceMode(mode);

    const docName =
      docType === 'biodata'
        ? 'Personal Biodata'
        : docType === 'cover_letter'
        ? 'Target Cover Letter'
        : `${profession.charAt(0).toUpperCase() + profession.slice(1)} Resume`;

    const created = await createNewResume(docName, docType, selectedTemplate);
    navigate(`/resume/${created.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Top Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
              <span>Step {currentStep} of 5</span>
              <span>{Math.round((currentStep / 5) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
              {stepTitles[currentStep - 1].title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              ResumewithAI will customize AI assistance, section priority, and templates based on your choice.
            </p>
          </div>

          {/* STEP 1: DOCUMENT TYPE */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'resume', title: 'Resume', desc: '1-2 page standard document for private sector jobs', icon: FileText },
                { id: 'cv', title: 'Curriculum Vitae (CV)', desc: 'Detailed comprehensive record for academic, medical & research roles', icon: FileBadge },
                { id: 'biodata', title: 'Bio Data', desc: 'Family, personal, and matrimonial profile format', icon: Users },
                { id: 'cover_letter', title: 'Cover Letter', desc: 'AI-tailored letter addressed to hiring managers', icon: Mail },
                { id: 'profile', title: 'Professional Profile', desc: 'Executive summary & shareable web layout', icon: UserCheck },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setDocType(item.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    docType === item.id
                      ? 'border-brand-500 bg-orange-50/70 dark:bg-brand-950/40 shadow-brand'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${docType === item.id ? 'bg-brand-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: PROFESSION */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'developer', label: 'Developer / Engineer', icon: Code },
                { id: 'designer', label: 'UI/UX / Designer', icon: Palette },
                { id: 'manager', label: 'Product / Manager', icon: Briefcase },
                { id: 'student', label: 'Student / Fresher', icon: GraduationCap },
                { id: 'sales', label: 'Sales & Business', icon: TrendingUp },
                { id: 'teacher', label: 'Teacher / Educator', icon: BookOpen },
                { id: 'doctor', label: 'Doctor / Medical', icon: Activity },
                { id: 'engineer', label: 'Engineering Specialist', icon: Cpu },
                { id: 'other', label: 'Other Profession', icon: Layers },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer space-y-2 ${
                    profession === p.id
                      ? 'border-brand-500 bg-orange-50/70 dark:bg-brand-950/40 shadow-brand'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 flex items-center justify-center">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{p.label}</h4>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: GOAL */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Find a Full-time Job',
                'Internship / Entry Level',
                'Change Career / Pivot',
                'Promotion / Executive Role',
                'Freelancing & Consulting',
                'Higher Studies & University Admission',
                'General Career Profile',
              ].map((g) => (
                <div
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                    goal === g
                      ? 'border-brand-500 bg-orange-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 shadow-brand'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  <span>{g}</span>
                  {goal === g && <Check className="w-4 h-4 text-brand-500" />}
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: EXPERIENCE MODE */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'beginner',
                  title: 'Beginner Mode',
                  tag: 'Guided Conversation',
                  desc: 'Ask simple questions step-by-step. AI writes the professional phrasing for you. Ideal for students & freshers.',
                },
                {
                  id: 'intermediate',
                  title: 'Intermediate Mode',
                  tag: 'Recommended',
                  desc: 'Standard resume form with AI suggestion cards, ATS score tracker, and instant live preview.',
                },
                {
                  id: 'advanced',
                  title: 'Advanced Mode',
                  tag: 'Full Control',
                  desc: 'Complete editor with drag-and-drop section ordering, version snapshots, custom sections, and deep ATS analysis.',
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    mode === m.id
                      ? 'border-brand-500 bg-orange-50/70 dark:bg-brand-950/40 shadow-brand'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-2">
                    <Badge variant={mode === m.id ? 'brand' : 'neutral'} size="sm">
                      {m.tag}
                    </Badge>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                      {m.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600">
                    {mode === m.id ? <Check className="w-4 h-4" /> : null}
                    <span>{mode === m.id ? 'Selected' : 'Select'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: CHOOSE TEMPLATE */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEMPLATES.slice(0, 6).map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                    selectedTemplate === tmpl.id
                      ? 'border-brand-500 bg-orange-50/70 dark:bg-brand-950/40 shadow-brand'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{tmpl.name}</h4>
                    {selectedTemplate === tmpl.id && <Check className="w-3.5 h-3.5 text-brand-500" />}
                  </div>
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl space-y-1">
                    <div className="w-1/2 h-1.5 rounded bg-neutral-700 dark:bg-neutral-300" />
                    <div className="w-1/3 h-1.5 rounded bg-brand-400" />
                    <div className="w-full h-1 rounded bg-neutral-300 dark:bg-neutral-700 mt-2" />
                  </div>
                  <p className="text-[11px] text-neutral-400">{tmpl.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-neutral-200 dark:border-neutral-800 mt-8">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="ai"
              size="lg"
              icon={Sparkles}
              iconRight={ArrowRight}
              onClick={handleFinish}
            >
              Start Building Now
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
