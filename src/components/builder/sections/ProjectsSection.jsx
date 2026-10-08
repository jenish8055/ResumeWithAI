import React, { useState } from 'react';
import { FormInput, FormTextarea } from '../../common/FormInput';
import Button from '../../common/Button';
import AISuggestionCard from '../../ai/AISuggestionCard';
import EmptyState from '../../common/EmptyState';
import { Plus, Trash2, ChevronDown, ChevronUp, FolderGit2, Sparkles, ExternalLink } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';
import { aiService } from '../../../services/ai/aiService';

export default function ProjectsSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  if (!activeResume) return null;
  const projectsList = Array.isArray(activeResume.projects) ? activeResume.projects : [];

  const handleAddProject = () => {
    const newProj = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      projectName: '',
      role: '',
      technologies: '',
      projectUrl: '',
      description: '',
    };
    const updated = {
      ...activeResume,
      projects: [newProj, ...projectsList],
    };
    updateActiveResume(updated, 'projects', 'add');
    setExpandedIndex(0);
    showToast('New project entry added.', 'success');
  };

  const handleRemoveProject = (index) => {
    const updatedList = projectsList.filter((_, idx) => idx !== index);
    const updated = {
      ...activeResume,
      projects: updatedList,
    };
    updateActiveResume(updated, 'projects', `remove_${index}`);
    showToast('Project removed.', 'info');
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedList = [...projectsList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    const updated = {
      ...activeResume,
      projects: updatedList,
    };
    updateActiveResume(updated, 'projects', `${field}_${index}`);
  };

  const handleGenerateAiDescription = async (index) => {
    const proj = projectsList[index];
    if (!proj) return;

    setIsAiLoading(true);
    try {
      const desc = await aiService.generateProjectDescription(
        proj.projectName || 'Featured Project',
        proj.role || 'Developer',
        proj.technologies || 'Modern Web Stack',
        proj.description,
        activeResume.id
      );

      setActiveSuggestion({
        itemIndex: index,
        text: desc,
      });
    } catch (err) {
      console.error(err);
      showToast('Could not generate project description.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!activeSuggestion) return;
    handleUpdateItem(activeSuggestion.itemIndex, 'description', activeSuggestion.text);
    setActiveSuggestion(null);
    showToast('Project description updated!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Projects & Work Portfolios
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Demonstrate real-world technical competency, problem-solving, and practical results.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleAddProject}
        >
          Add Project
        </Button>
      </div>

      {projectsList.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="Have you built anything?"
          description="Projects are one of the strongest sections for students, developers, and designers."
          primaryActionLabel="Add Project"
          onPrimaryAction={handleAddProject}
        />
      ) : (
        <div className="space-y-4">
          {projectsList.map((proj, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={proj.id || index}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs transition-all"
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                  className="flex items-center justify-between px-5 py-3.5 bg-neutral-50/70 dark:bg-neutral-800/40 hover:bg-neutral-100/50 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        {proj.projectName || 'Project Title'}{' '}
                        {proj.role && <span className="font-normal text-neutral-500">({proj.role})</span>}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {proj.technologies || 'Technologies'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProject(index);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 space-y-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Project Name"
                        value={proj.projectName}
                        onChange={(e) => handleUpdateItem(index, 'projectName', e.target.value)}
                        placeholder="e.g. CloudMetrics Dashboard"
                        required
                      />
                      <FormInput
                        label="Your Role / Contribution"
                        value={proj.role}
                        onChange={(e) => handleUpdateItem(index, 'role', e.target.value)}
                        placeholder="e.g. Lead Developer / Creator"
                      />
                      <FormInput
                        label="Technologies Used"
                        value={proj.technologies}
                        onChange={(e) => handleUpdateItem(index, 'technologies', e.target.value)}
                        placeholder="e.g. React, Node.js, Tailwind, Docker"
                      />
                      <FormInput
                        label="Project / Demo / Repo Link"
                        value={proj.projectUrl}
                        onChange={(e) => handleUpdateItem(index, 'projectUrl', e.target.value)}
                        placeholder="e.g. github.com/username/project"
                        icon={ExternalLink}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        Project Description
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGenerateAiDescription(index)}
                        disabled={isAiLoading}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Generate with AI
                      </button>
                    </div>

                    {activeSuggestion && activeSuggestion.itemIndex === index && (
                      <AISuggestionCard
                        currentContent={proj.description}
                        suggestion={activeSuggestion.text}
                        onAccept={handleAcceptSuggestion}
                        onRegenerate={() => handleGenerateAiDescription(index)}
                        onCancel={() => setActiveSuggestion(null)}
                        resumeId={activeResume.id}
                        title="AI Project Summary"
                        isRegenerating={isAiLoading}
                      />
                    )}

                    <FormTextarea
                      value={proj.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      placeholder="Engineered a real-time web application serving 10,000+ active users with 99.9% uptime..."
                      rows={4}
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
