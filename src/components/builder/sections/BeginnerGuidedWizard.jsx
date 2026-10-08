import React, { useState } from 'react';
import Button from '../../common/Button';
import AISuggestionCard from '../../ai/AISuggestionCard';
import { FormInput, FormTextarea } from '../../common/FormInput';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Wand2, BookOpen, Briefcase, Target, FolderGit2, User } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';
import { aiService } from '../../../services/ai/aiService';

export default function BeginnerGuidedWizard({ onComplete }) {
  const { activeResume, updateActiveResume, showToast, setExperienceMode } = useResumeStore();
  const [step, setStep] = useState(1);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Form State for wizard
  const [wizardState, setWizardState] = useState({
    name: activeResume?.personalInfo?.fullName || '',
    title: activeResume?.personalInfo?.professionalTitle || '',
    email: activeResume?.personalInfo?.email || '',
    phone: activeResume?.personalInfo?.phone || '',
    degree: activeResume?.education?.[0]?.degree || '',
    school: activeResume?.education?.[0]?.institution || '',
    rawSkills: (activeResume?.skills || []).map((s) => (typeof s === 'string' ? s : s.name)).join(', '),
    rawExperience: activeResume?.experience?.[0]?.description || '',
    rawProject: activeResume?.projects?.[0]?.description || '',
  });

  const updateState = (field, val) => {
    setWizardState((prev) => ({ ...prev, [field]: val }));
  };

  const handleAiTransformExperience = async () => {
    if (!wizardState.rawExperience.trim()) {
      showToast('Please type a brief phrase about what you worked on first.', 'info');
      return;
    }
    setIsAiProcessing(true);
    try {
      const improved = await aiService.improveExperience(
        wizardState.title || 'Team Member',
        wizardState.rawExperience,
        'student',
        'professional',
        activeResume?.id
      );
      setAiSuggestion({
        type: 'experience',
        text: improved,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not transform text.', 'error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAiTransformProject = async () => {
    if (!wizardState.rawProject.trim()) {
      showToast('Please describe your project first.', 'info');
      return;
    }
    setIsAiProcessing(true);
    try {
      const improved = await aiService.generateProjectDescription(
        'Portfolio Application',
        'Developer',
        wizardState.rawSkills || 'Modern Technologies',
        wizardState.rawProject,
        activeResume?.id
      );
      setAiSuggestion({
        type: 'project',
        text: improved,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not transform project text.', 'error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (step === 1) {
      const updated = {
        ...activeResume,
        personalInfo: {
          ...activeResume.personalInfo,
          fullName: wizardState.name,
          professionalTitle: wizardState.title,
          email: wizardState.email,
          phone: wizardState.phone,
        },
      };
      updateActiveResume(updated, 'personalInfo', 'wizard_step1');
      setStep(2);
    } else if (step === 2) {
      const updated = {
        ...activeResume,
        education: [
          {
            id: 'edu_wizard_1',
            degree: wizardState.degree,
            institution: wizardState.school,
            startDate: '2020',
            endDate: '2024',
            grade: '',
            description: '',
          },
        ],
      };
      updateActiveResume(updated, 'education', 'wizard_step2');
      setStep(3);
    } else if (step === 3) {
      // Skills
      const skillNames = wizardState.rawSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const skillsObjs = skillNames.map((name, i) => ({
        id: `sk_w_${i}`,
        name,
        category: 'technical',
        level: 'Intermediate',
      }));
      const updated = { ...activeResume, skills: skillsObjs };
      updateActiveResume(updated, 'skills', 'wizard_step3');
      setStep(4);
    } else if (step === 4) {
      // Experience / Internships
      if (wizardState.rawExperience.trim()) {
        const updated = {
          ...activeResume,
          experience: [
            {
              id: 'exp_wizard_1',
              jobTitle: wizardState.title || 'Intern',
              company: 'Company / Organization',
              startDate: '2023',
              endDate: 'Present',
              currentlyWorking: true,
              description: wizardState.rawExperience,
            },
          ],
        };
        updateActiveResume(updated, 'experience', 'wizard_step4');
      }
      setStep(5);
    } else if (step === 5) {
      // Projects
      if (wizardState.rawProject.trim()) {
        const updated = {
          ...activeResume,
          projects: [
            {
              id: 'proj_wizard_1',
              projectName: 'Featured Project',
              role: 'Creator',
              technologies: wizardState.rawSkills,
              description: wizardState.rawProject,
            },
          ],
        };
        updateActiveResume(updated, 'projects', 'wizard_step5');
      }

      // Auto generate professional summary
      const summaryText = await aiService.generateSummary(
        {
          title: wizardState.title,
          skills: activeResume.skills,
          isStudent: true,
        },
        activeResume.id
      );
      updateActiveResume({ ...activeResume, summary: summaryText }, 'summary', 'wizard_complete');

      showToast('🎉 Beginner setup complete! Opening full editor.', 'success');
      onComplete?.();
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-orange-200/80 dark:border-neutral-800 shadow-soft space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
            {step}/5
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white font-heading">
              Beginner Guided Setup
            </h3>
            <p className="text-xs text-neutral-500">
              Answer simple questions and AI converts your words into professional resume bullets.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setExperienceMode('intermediate');
            onComplete?.();
          }}
          className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline cursor-pointer"
        >
          Skip to Full Editor
        </button>
      </div>

      {/* Step 1: Who are you? */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <User className="w-4 h-4" />
            <span>Step 1: What is your name and desired job title?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="What is your full name?"
              value={wizardState.name}
              onChange={(e) => updateState('name', e.target.value)}
              placeholder="e.g. Samantha Chen"
            />
            <FormInput
              label="What job or role are you looking for?"
              value={wizardState.title}
              onChange={(e) => updateState('title', e.target.value)}
              placeholder="e.g. Junior Web Developer, Marketing Associate"
            />
            <FormInput
              label="Email Address"
              value={wizardState.email}
              onChange={(e) => updateState('email', e.target.value)}
              placeholder="e.g. sam@example.com"
            />
            <FormInput
              label="Phone Number"
              value={wizardState.phone}
              onChange={(e) => updateState('phone', e.target.value)}
              placeholder="e.g. +1 (555) 000-0000"
            />
          </div>
        </div>
      )}

      {/* Step 2: What did you study? */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Step 2: What did you study or where did you go to school?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Degree / Major"
              value={wizardState.degree}
              onChange={(e) => updateState('degree', e.target.value)}
              placeholder="e.g. B.S. in Computer Science"
            />
            <FormInput
              label="School or University"
              value={wizardState.school}
              onChange={(e) => updateState('school', e.target.value)}
              placeholder="e.g. Boston University"
            />
          </div>
        </div>
      )}

      {/* Step 3: What skills do you know? */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>Step 3: What skills or tools do you know?</span>
          </div>
          <p className="text-xs text-neutral-500">Separate them with commas (e.g. React, Python, Communication, Excel).</p>

          <FormTextarea
            label="Your Skills"
            value={wizardState.rawSkills}
            onChange={(e) => updateState('rawSkills', e.target.value)}
            placeholder="React, JavaScript, HTML, CSS, Problem Solving, Git"
            rows={3}
          />
        </div>
      )}

      {/* Step 4: Have you worked anywhere? */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <Briefcase className="w-4 h-4" />
            <span>Step 4: Have you worked anywhere or had an internship? (Optional)</span>
          </div>
          <p className="text-xs text-neutral-500">
            Describe in plain, casual words what you did. Click "Turn into Professional Bullets" to let AI refine it.
          </p>

          <FormTextarea
            label="What did you do? (Casual input)"
            value={wizardState.rawExperience}
            onChange={(e) => updateState('rawExperience', e.target.value)}
            placeholder="e.g. I worked on a website using React and helped fix bugs and make the pages load faster."
            rows={4}
          />

          <Button
            variant="ai"
            size="sm"
            icon={Wand2}
            isLoading={isAiProcessing}
            onClick={handleAiTransformExperience}
          >
            Turn into Professional Bullets with AI
          </Button>

          {aiSuggestion?.type === 'experience' && (
            <AISuggestionCard
              currentContent={wizardState.rawExperience}
              suggestion={aiSuggestion.text}
              onAccept={(txt) => {
                updateState('rawExperience', txt);
                setAiSuggestion(null);
              }}
              onRegenerate={handleAiTransformExperience}
              onCancel={() => setAiSuggestion(null)}
              title="AI Professional Bullet Points"
            />
          )}
        </div>
      )}

      {/* Step 5: Have you built any projects? */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <FolderGit2 className="w-4 h-4" />
            <span>Step 5: Have you built any projects or coursework apps?</span>
          </div>

          <FormTextarea
            label="Project Description (Casual input)"
            value={wizardState.rawProject}
            onChange={(e) => updateState('rawProject', e.target.value)}
            placeholder="e.g. I made an online study group finder where students can chat and share notes."
            rows={4}
          />

          <Button
            variant="ai"
            size="sm"
            icon={Wand2}
            isLoading={isAiProcessing}
            onClick={handleAiTransformProject}
          >
            Turn into Project Description with AI
          </Button>

          {aiSuggestion?.type === 'project' && (
            <AISuggestionCard
              currentContent={wizardState.rawProject}
              suggestion={aiSuggestion.text}
              onAccept={(txt) => {
                updateState('rawProject', txt);
                setAiSuggestion(null);
              }}
              onRegenerate={handleAiTransformProject}
              onCancel={() => setAiSuggestion(null)}
              title="AI Project Summary"
            />
          )}
        </div>
      )}

      {/* Step Actions Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
        {step > 1 ? (
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="primary"
          size="md"
          iconRight={step === 5 ? CheckCircle : ArrowRight}
          onClick={handleSaveAndNext}
        >
          {step === 5 ? 'Complete & Open Resume' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
}
