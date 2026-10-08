import React, { useState } from 'react';
import Button from '../../common/Button';
import AIButton from '../../ai/AIButton';
import { Plus, Trash2, Sparkles, X, Target, Check } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';
import { aiService } from '../../../services/ai/aiService';

const CATEGORIES = [
  { id: 'technical', label: 'Technical Skills' },
  { id: 'soft', label: 'Soft Skills' },
  { id: 'tools', label: 'Tools & Technologies' },
  { id: 'languages', label: 'Languages' },
];

export default function SkillsSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [selectedLevel, setSelectedLevel] = useState('Advanced');
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!activeResume) return null;
  const skillsList = Array.isArray(activeResume.skills) ? activeResume.skills : [];

  const handleAddSkill = (name = newSkillName, category = selectedCategory, level = selectedLevel) => {
    if (!name.trim()) return;

    // Check duplicate
    const exists = skillsList.some(
      (s) => (typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase()) === name.trim().toLowerCase()
    );
    if (exists) {
      showToast('Skill is already added.', 'info');
      return;
    }

    const newSkill = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      category,
      level,
    };

    const updated = {
      ...activeResume,
      skills: [...skillsList, newSkill],
    };
    updateActiveResume(updated, 'skills', name);
    setNewSkillName('');
    showToast(`Added skill: ${name}`, 'success');
  };

  const handleRemoveSkill = (idOrIndex) => {
    const updatedSkills = skillsList.filter((s, idx) => (s.id ? s.id !== idOrIndex : idx !== idOrIndex));
    const updated = {
      ...activeResume,
      skills: updatedSkills,
    };
    updateActiveResume(updated, 'skills', 'remove');
  };

  const handleFetchAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const res = await aiService.suggestSkills(
        activeResume.personalInfo?.professionalTitle || activeResume.targetRole || 'Software Engineer',
        skillsList,
        activeResume.profession || 'developer',
        activeResume.id
      );
      setSuggestedSkills(res.allRecommendations);
      showToast('AI suggestions retrieved based on your profession.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not suggest skills.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Skills & Competencies
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Highlight 6-12 core competencies to rank higher in recruiter ATS filters.
          </p>
        </div>

        <AIButton
          onClick={handleFetchAiSuggestions}
          isLoading={isAiLoading}
          variant="brand"
        >
          Suggest Skills
        </AIButton>
      </div>

      {/* Add Skill Input Form */}
      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Type a skill (e.g. React, Docker, Leadership)..."
            className="flex-1 w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-brand-500 text-neutral-900 dark:text-neutral-100"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => handleAddSkill()}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Suggested Skills Banner */}
      {suggestedSkills.length > 0 && (
        <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-brand-950/40 border border-orange-200 dark:border-brand-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Click to add skills you possess:
            </span>
            <button
              onClick={() => setSuggestedSkills([])}
              className="text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleAddSkill(s.name, s.category, s.level);
                  setSuggestedSkills((prev) => prev.filter((item) => item.name !== s.name));
                }}
                className="group flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white dark:bg-neutral-800 hover:bg-brand-500 hover:text-white text-neutral-700 dark:text-neutral-200 border border-orange-200 dark:border-neutral-700 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                <span>+</span>
                <span className="font-medium">{s.name}</span>
                <span className="text-[10px] opacity-60">({s.category})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Current Skills grouped by Category */}
      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const catSkills = skillsList.filter((s) => (typeof s === 'string' ? category.id === 'technical' : (s.category || 'technical') === category.id));
          if (catSkills.length === 0) return null;

          return (
            <div key={category.id} className="space-y-2">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {category.label} ({catSkills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill, idx) => {
                  const name = typeof skill === 'string' ? skill : skill.name;
                  const id = typeof skill === 'string' ? idx : skill.id;
                  return (
                    <div
                      key={id || idx}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs hover:border-brand-300 transition-all"
                    >
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(id)}
                        className="text-neutral-400 hover:text-red-500 p-0.5 rounded-md transition-colors cursor-pointer"
                        title="Remove skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {skillsList.length === 0 && (
          <p className="text-xs text-neutral-400 italic text-center py-6">
            No skills added yet. Type your skills above or click "Suggest Skills" to get AI recommendations.
          </p>
        )}
      </div>
    </div>
  );
}
