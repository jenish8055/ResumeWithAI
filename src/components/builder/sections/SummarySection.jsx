import React, { useState } from 'react';
import { FormTextarea } from '../../common/FormInput';
import AIButton from '../../ai/AIButton';
import AISuggestionCard from '../../ai/AISuggestionCard';
import { Sparkles, Wand2, ShieldCheck, Zap, Scissors } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';
import { aiService } from '../../../services/ai/aiService';

export default function SummarySection() {
  const { activeResume, updateActiveResume, showToast, openAiAssistant } = useResumeStore();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  if (!activeResume) return null;

  const currentSummary = activeResume.summary || '';

  const handleGenerate = async (tone = 'professional') => {
    setIsAiLoading(true);
    try {
      let generated = '';
      if (!currentSummary.trim()) {
        generated = await aiService.generateSummary(
          {
            title: activeResume.personalInfo?.professionalTitle || activeResume.targetRole || 'Software Professional',
            skills: activeResume.skills || [],
            experience: activeResume.experience || [],
            role: activeResume.profession || 'developer',
            isStudent: activeResume.experienceMode === 'beginner',
          },
          activeResume.id
        );
      } else {
        generated = await aiService.improveSummary(currentSummary, tone, activeResume.id);
      }

      setActiveSuggestion({
        tone,
        text: generated,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not generate AI summary.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAcceptSuggestion = (acceptedText) => {
    const updated = {
      ...activeResume,
      summary: acceptedText,
    };
    updateActiveResume(updated, 'summary', 'text');
    setActiveSuggestion(null);
    showToast('Professional summary updated!', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Professional Summary
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            A 2-4 sentence hook summarizing your career value and target direction.
          </p>
        </div>

        <AIButton
          onClick={() => openAiAssistant({ mode: 'summary' })}
          isLoading={isAiLoading}
          variant="brand"
        >
          AI Assistant
        </AIButton>
      </div>

      {/* Proactive Tip if empty */}
      {!currentSummary.trim() && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/80 dark:bg-brand-950/40 border border-orange-200 dark:border-brand-800">
          <div className="flex items-center gap-2 text-xs text-brand-800 dark:text-brand-300">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>✨ Your resume is missing a professional summary.</span>
          </div>
          <button
            type="button"
            onClick={() => handleGenerate('professional')}
            className="text-xs px-3 py-1.5 font-bold rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-sm cursor-pointer"
          >
            Generate with AI
          </button>
        </div>
      )}

      {/* AI Quick Actions Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <span className="text-[11px] font-semibold text-neutral-500 mr-1">AI Actions:</span>
        {[
          { label: 'Generate', tone: 'professional', icon: Wand2 },
          { label: 'Make ATS Friendly', tone: 'ats', icon: ShieldCheck },
          { label: 'Make Confident', tone: 'confident', icon: Zap },
          { label: 'Make Concise', tone: 'concise', icon: Scissors },
        ].map((act) => (
          <button
            key={act.tone}
            type="button"
            onClick={() => handleGenerate(act.tone)}
            disabled={isAiLoading}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer shadow-2xs"
          >
            <act.icon className="w-3 h-3 text-brand-500" />
            <span>{act.label}</span>
          </button>
        ))}
      </div>

      {/* AI Suggestion Card */}
      {activeSuggestion && (
        <AISuggestionCard
          currentContent={currentSummary}
          suggestion={activeSuggestion.text}
          onAccept={handleAcceptSuggestion}
          onRegenerate={() => handleGenerate(activeSuggestion.tone)}
          onCancel={() => setActiveSuggestion(null)}
          resumeId={activeResume.id}
          title={`AI ${activeSuggestion.tone.toUpperCase()} Summary`}
          isRegenerating={isAiLoading}
        />
      )}

      {/* Summary Textarea */}
      <FormTextarea
        label="Summary Text"
        name="summary"
        value={currentSummary}
        onChange={(e) => {
          const updated = { ...activeResume, summary: e.target.value };
          updateActiveResume(updated, 'summary', 'text');
        }}
        placeholder="e.g. Results-driven Frontend Engineer with 5+ years of experience specializing in React and TypeScript..."
        rows={6}
        helperText={`${currentSummary.length} characters (Recommended: 150-350 characters)`}
      />
    </div>
  );
}
