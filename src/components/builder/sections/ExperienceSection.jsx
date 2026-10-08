import React, { useState } from 'react';
import { FormInput, FormTextarea } from '../../common/FormInput';
import Button from '../../common/Button';
import AISuggestionCard from '../../ai/AISuggestionCard';
import EmptyState from '../../common/EmptyState';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Wand2, ShieldCheck, Check, Briefcase } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';
import { aiService } from '../../../services/ai/aiService';

export default function ExperienceSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [activeSuggestion, setActiveSuggestion] = useState(null); // { itemIndex, text, title }
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!activeResume) return null;
  const experienceList = Array.isArray(activeResume.experience) ? activeResume.experience : [];

  const handleAddExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      company: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    const updated = {
      ...activeResume,
      experience: [newExp, ...experienceList],
    };
    updateActiveResume(updated, 'experience', 'add');
    setExpandedIndex(0);
    showToast('New work experience entry added.', 'success');
  };

  const handleRemoveExperience = (index) => {
    const updatedList = experienceList.filter((_, idx) => idx !== index);
    const updated = {
      ...activeResume,
      experience: updatedList,
    };
    updateActiveResume(updated, 'experience', `remove_${index}`);
    showToast('Experience entry removed.', 'info');
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedList = [...experienceList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    const updated = {
      ...activeResume,
      experience: updatedList,
    };
    updateActiveResume(updated, 'experience', `${field}_${index}`);
  };

  const handleAiAction = async (index, actionType) => {
    const exp = experienceList[index];
    if (!exp) return;

    setIsAiLoading(true);
    try {
      let result = '';
      if (actionType === 'improve') {
        result = await aiService.improveExperience(
          exp.jobTitle || activeResume.targetRole,
          exp.description,
          activeResume.profession,
          'professional',
          activeResume.id
        );
      } else if (actionType === 'bullets') {
        const bullets = await aiService.generateExperienceBullets(
          exp.jobTitle || activeResume.targetRole,
          exp.company,
          exp.description,
          activeResume.id
        );
        result = bullets.join('\n');
      } else if (actionType === 'achievements') {
        const achs = await aiService.generateAchievements(
          exp.jobTitle || activeResume.targetRole,
          exp.company,
          activeResume.id
        );
        result = achs.join('\n');
      } else if (actionType === 'ats') {
        result = await aiService.improveExperience(
          exp.jobTitle,
          exp.description,
          activeResume.profession,
          'ats',
          activeResume.id
        );
      }

      setActiveSuggestion({
        itemIndex: index,
        title: `AI ${actionType.toUpperCase()} Enhancements`,
        text: result,
      });
    } catch (err) {
      console.error(err);
      showToast('AI enhancement failed. Please try again.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!activeSuggestion) return;
    const { itemIndex, text } = activeSuggestion;
    handleUpdateItem(itemIndex, 'description', text);
    setActiveSuggestion(null);
    showToast('Bullet points updated!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Work Experience
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            List your professional roles in reverse chronological order.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleAddExperience}
        >
          Add Role
        </Button>
      </div>

      {experienceList.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No work experience yet?"
          description="If you are a student or fresher, you can prioritize Projects & Education, or click Add Role to enter internships."
          primaryActionLabel="Add Work Experience"
          onPrimaryAction={handleAddExperience}
        />
      ) : (
        <div className="space-y-4">
          {experienceList.map((exp, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={exp.id || index}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs transition-all"
              >
                {/* Header Accordion Bar */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                  className="flex items-center justify-between px-5 py-3.5 bg-neutral-50/70 dark:bg-neutral-800/40 hover:bg-neutral-100/50 dark:hover:bg-neutral-800 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        {exp.jobTitle || 'New Position'}{' '}
                        {exp.company && <span className="font-normal text-neutral-500">at {exp.company}</span>}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {exp.startDate || 'Start'} — {exp.currentlyWorking ? 'Present' : exp.endDate || 'End'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExperience(index);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </div>
                </div>

                {/* Body Form */}
                {isExpanded && (
                  <div className="p-5 space-y-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) => handleUpdateItem(index, 'jobTitle', e.target.value)}
                        placeholder="e.g. Lead Frontend Developer"
                        required
                      />
                      <FormInput
                        label="Company / Organization"
                        value={exp.company}
                        onChange={(e) => handleUpdateItem(index, 'company', e.target.value)}
                        placeholder="e.g. Acme Corp"
                        required
                      />
                      <FormInput
                        label="Location"
                        value={exp.location}
                        onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
                        placeholder="e.g. New York, NY / Remote"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormInput
                          label="Start Date"
                          value={exp.startDate}
                          onChange={(e) => handleUpdateItem(index, 'startDate', e.target.value)}
                          placeholder="e.g. Jan 2022"
                        />
                        <FormInput
                          label="End Date"
                          value={exp.endDate}
                          disabled={exp.currentlyWorking}
                          onChange={(e) => handleUpdateItem(index, 'endDate', e.target.value)}
                          placeholder={exp.currentlyWorking ? 'Present' : 'e.g. Present'}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`curr_${index}`}
                        checked={exp.currentlyWorking || false}
                        onChange={(e) => handleUpdateItem(index, 'currentlyWorking', e.target.checked)}
                        className="rounded border-neutral-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                      />
                      <label htmlFor={`curr_${index}`} className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                        I am currently working in this role
                      </label>
                    </div>

                    {/* AI Quick Enhancer Buttons for this role */}
                    <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-neutral-500">✨ AI Actions:</span>
                      <button
                        type="button"
                        onClick={() => handleAiAction(index, 'improve')}
                        disabled={isAiLoading}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 hover:bg-brand-50 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                      >
                        Improve Bullets
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAiAction(index, 'bullets')}
                        disabled={isAiLoading}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 hover:bg-brand-50 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                      >
                        Generate New Bullets
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAiAction(index, 'achievements')}
                        disabled={isAiLoading}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 hover:bg-brand-50 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                      >
                        Highlight Achievements
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAiAction(index, 'ats')}
                        disabled={isAiLoading}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 hover:bg-brand-50 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
                      >
                        ATS Optimization
                      </button>
                    </div>

                    {/* Active AI Suggestion Card */}
                    {activeSuggestion && activeSuggestion.itemIndex === index && (
                      <AISuggestionCard
                        currentContent={exp.description}
                        suggestion={activeSuggestion.text}
                        onAccept={handleAcceptSuggestion}
                        onRegenerate={() => handleAiAction(index, 'improve')}
                        onCancel={() => setActiveSuggestion(null)}
                        resumeId={activeResume.id}
                        title={activeSuggestion.title}
                        isRegenerating={isAiLoading}
                      />
                    )}

                    <FormTextarea
                      label="Key Responsibilities & Impact (Use bullet points)"
                      value={exp.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      placeholder="• Spearheaded development of new customer portal, improving engagement by 35%&#10;• Collaborated with UX team to standardize design components..."
                      rows={5}
                      helperText="Start bullet points with active verbs (e.g. Architected, Developed, Spearheaded, Streamlined)."
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
