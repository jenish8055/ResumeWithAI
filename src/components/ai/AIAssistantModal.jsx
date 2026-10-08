import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import AISuggestionCard from './AISuggestionCard';
import { Sparkles, Wand2, CheckCircle, Target, Briefcase, FileText, Check, ArrowRight } from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';
import { aiService } from '../../services/ai/aiService';

export default function AIAssistantModal() {
  const { aiModal, closeAiAssistant, activeResume, updateActiveResume, showToast } = useResumeStore();
  const [selectedTone, setSelectedTone] = useState('professional');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'experience' | 'skills' | 'tailor' | 'grammar'
  const [generatedResult, setGeneratedResult] = useState(null);
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [targetRoleInput, setTargetRoleInput] = useState(activeResume?.targetRole || activeResume?.personalInfo?.professionalTitle || '');

  if (!aiModal.isOpen) return null;

  const handleGenerateSummary = async (tone = selectedTone) => {
    setIsProcessing(true);
    try {
      const summary = await aiService.generateSummary(
        {
          title: activeResume?.personalInfo?.professionalTitle || targetRoleInput || 'Software Engineer',
          skills: activeResume?.skills || [],
          experience: activeResume?.experience || [],
          role: activeResume?.profession || 'developer',
          goal: 'securing a high-impact position',
          isStudent: activeResume?.profession === 'student' || activeResume?.experienceMode === 'beginner',
        },
        activeResume?.id
      );

      const refined = tone !== 'professional' ? await aiService.improveSummary(summary, tone, activeResume?.id) : summary;

      setGeneratedResult({
        type: 'summary',
        currentContent: activeResume?.summary || '',
        suggestion: refined,
      });
    } catch (err) {
      console.error(err);
      showToast('AI generation encountered an issue. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImproveExperience = async (style = 'professional') => {
    setIsProcessing(true);
    try {
      const itemIndex = aiModal.targetItemIndex ?? 0;
      const expItem = activeResume?.experience?.[itemIndex];
      const jobTitle = expItem?.jobTitle || targetRoleInput || 'Role';
      const rawDesc = expItem?.description || 'Worked on developing products and collaborating with the team.';

      const improved = await aiService.improveExperience(
        jobTitle,
        rawDesc,
        activeResume?.profession || 'general',
        style,
        activeResume?.id
      );

      setGeneratedResult({
        type: 'experience',
        itemIndex,
        currentContent: rawDesc,
        suggestion: improved,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not improve experience bullets.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestSkills = async () => {
    setIsProcessing(true);
    try {
      const suggestions = await aiService.suggestSkills(
        targetRoleInput || activeResume?.personalInfo?.professionalTitle || 'Software Engineer',
        activeResume?.skills || [],
        activeResume?.profession || 'developer',
        activeResume?.id
      );
      setGeneratedResult({
        type: 'skills',
        suggestions: suggestions.allRecommendations,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not suggest skills.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescriptionInput || jobDescriptionInput.trim().length < 15) {
      showToast('Please paste a job description with at least 15 characters.', 'info');
      return;
    }
    setIsProcessing(true);
    try {
      const report = await aiService.analyzeJobDescription(activeResume, jobDescriptionInput, activeResume?.id);
      const tailored = await aiService.tailorResume(activeResume, jobDescriptionInput, activeResume?.id);

      setGeneratedResult({
        type: 'job_tailor',
        report,
        tailoredSummary: tailored.suggestedSummary,
        suggestedSkillsToAdd: tailored.suggestedSkillsToAdd,
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to analyze job description.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptSummary = (newSummary) => {
    if (!activeResume) return;
    const updated = { ...activeResume, summary: newSummary };
    updateActiveResume(updated, 'summary', 'text');
    showToast('Professional summary updated with AI!', 'success');
    closeAiAssistant();
  };

  const handleAcceptExperience = (newText) => {
    if (!activeResume) return;
    const itemIndex = generatedResult?.itemIndex ?? 0;
    const expList = [...(activeResume.experience || [])];
    if (expList[itemIndex]) {
      expList[itemIndex] = { ...expList[itemIndex], description: newText };
      const updated = { ...activeResume, experience: expList };
      updateActiveResume(updated, 'experience', `item_${itemIndex}`);
      showToast('Experience bullet points updated!', 'success');
    }
    closeAiAssistant();
  };

  const handleAddSuggestedSkill = (skill) => {
    if (!activeResume) return;
    const current = activeResume.skills || [];
    if (current.some((s) => (typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase()) === skill.name.toLowerCase())) {
      showToast('Skill already in list.', 'info');
      return;
    }
    const newSkill = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: skill.name,
      category: skill.category || 'technical',
      level: skill.level || 'Intermediate',
    };
    const updated = { ...activeResume, skills: [...current, newSkill] };
    updateActiveResume(updated, 'skills', skill.name);
    showToast(`Added ${skill.name}`, 'success');
  };

  return (
    <Modal
      isOpen={aiModal.isOpen}
      onClose={closeAiAssistant}
      title="✨ ResumewithAI Assistant"
      subtitle="AI career copilot strictly preserves your genuine facts while polishing professional phrasing."
      icon={Sparkles}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'summary', label: 'Summary Generator', icon: Wand2 },
            { id: 'experience', label: 'Experience Improver', icon: Briefcase },
            { id: 'skills', label: 'Skill Recommendations', icon: Target },
            { id: 'tailor', label: 'Job Tailor & ATS', icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setGeneratedResult(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === t.id
                  ? 'bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Summary Generator */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-50/50 dark:bg-neutral-800/40 rounded-xl border border-orange-100 dark:border-neutral-800">
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                AI synthesizes your target role, experience, and key skills into a high-impact opening statement.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Select Tone:</span>
                {[
                  { id: 'professional', label: 'Professional' },
                  { id: 'ats', label: 'ATS Optimized' },
                  { id: 'confident', label: 'Confident & Impactful' },
                  { id: 'concise', label: 'Short & Concise' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setSelectedTone(tone.id);
                      handleGenerateSummary(tone.id);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      selectedTone === tone.id
                        ? 'bg-brand-500 text-white border-brand-500 font-semibold shadow-sm'
                        : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {generatedResult?.type === 'summary' ? (
              <AISuggestionCard
                currentContent={generatedResult.currentContent}
                suggestion={generatedResult.suggestion}
                onAccept={handleAcceptSummary}
                onRegenerate={() => handleGenerateSummary(selectedTone)}
                onCancel={() => setGeneratedResult(null)}
                resumeId={activeResume?.id}
                title="AI Optimized Summary"
                isRegenerating={isProcessing}
              />
            ) : (
              <div className="flex justify-center py-4">
                <Button
                  variant="ai"
                  size="md"
                  icon={Wand2}
                  isLoading={isProcessing}
                  onClick={() => handleGenerateSummary(selectedTone)}
                >
                  Generate Professional Summary
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Experience Improver */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Converts passive phrases into active accomplishment statements with strong action verbs (e.g., <em>Architected, Delivered, Streamlined</em>) without creating false claims.
              </p>
            </div>

            {generatedResult?.type === 'experience' ? (
              <AISuggestionCard
                currentContent={generatedResult.currentContent}
                suggestion={generatedResult.suggestion}
                onAccept={handleAcceptExperience}
                onRegenerate={() => handleImproveExperience('professional')}
                onCancel={() => setGeneratedResult(null)}
                resumeId={activeResume?.id}
                title="Polished Action-Oriented Bullet Points"
                isRegenerating={isProcessing}
              />
            ) : (
              <div className="flex justify-center py-4">
                <Button
                  variant="ai"
                  size="md"
                  icon={Sparkles}
                  isLoading={isProcessing}
                  onClick={() => handleImproveExperience('professional')}
                >
                  Improve Experience Bullets
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Skills Recommendation */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="e.g., Frontend Developer, UX Designer, Product Manager"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-brand-500"
              />
              <Button
                variant="primary"
                size="sm"
                icon={Target}
                isLoading={isProcessing}
                onClick={handleSuggestSkills}
              >
                Find Skills
              </Button>
            </div>

            {generatedResult?.type === 'skills' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Recommended Industry Skills for {targetRoleInput || 'Your Role'}
                </p>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                  {generatedResult.suggestions.map((skill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddSuggestedSkill(skill)}
                      className="group flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-neutral-800 hover:bg-brand-50 dark:hover:bg-brand-950 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300 rounded-xl transition-all cursor-pointer text-neutral-800 dark:text-neutral-200"
                    >
                      <span>+</span>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-[10px] text-neutral-400 group-hover:text-brand-500">
                        ({skill.category})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Job Tailor & ATS Analysis */}
        {activeTab === 'tailor' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Paste Job Description / Requirements
              </label>
              <textarea
                rows={4}
                value={jobDescriptionInput}
                onChange={(e) => setJobDescriptionInput(e.target.value)}
                placeholder="Paste the full job posting here to analyze ATS match rate, missing keywords, and tailored summary..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-brand-500"
              />
            </div>

            <Button
              variant="ai"
              size="md"
              icon={Target}
              isLoading={isProcessing}
              onClick={handleAnalyzeJob}
              className="w-full"
            >
              Analyze Job & Tailor Resume
            </Button>

            {generatedResult?.type === 'job_tailor' && (
              <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between p-4 bg-orange-50/70 dark:bg-brand-950/40 rounded-xl border border-orange-200 dark:border-brand-800">
                  <div>
                    <span className="text-xs font-semibold text-neutral-500">ATS Match Rating</span>
                    <h4 className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
                      {generatedResult.report.matchScore}% Match
                    </h4>
                  </div>
                  <div className="text-right text-xs text-neutral-600 dark:text-neutral-300">
                    <p>✓ {generatedResult.report.matchedSkills.length} Matched Skills</p>
                    <p className="text-amber-600 dark:text-amber-400">
                      ⚠ {generatedResult.report.missingSkills.length} Missing Keywords
                    </p>
                  </div>
                </div>

                {/* Missing Skills to Add */}
                {generatedResult.suggestedSkillsToAdd.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      Add Missing Skills You Possess:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedResult.suggestedSkillsToAdd.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddSuggestedSkill(s)}
                          className="text-xs px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 cursor-pointer"
                        >
                          + Add {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tailored Summary */}
                <AISuggestionCard
                  currentContent={activeResume?.summary}
                  suggestion={generatedResult.tailoredSummary}
                  onAccept={handleAcceptSummary}
                  onRegenerate={handleAnalyzeJob}
                  onCancel={() => setGeneratedResult(null)}
                  resumeId={activeResume?.id}
                  title="Tailored ATS-Targeted Summary"
                  isRegenerating={isProcessing}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
