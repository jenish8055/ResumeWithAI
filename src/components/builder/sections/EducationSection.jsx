import React, { useState } from 'react';
import { FormInput, FormTextarea } from '../../common/FormInput';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';

export default function EducationSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!activeResume) return null;
  const educationList = Array.isArray(activeResume.education) ? activeResume.education : [];

  const handleAddEducation = () => {
    const newEdu = {
      id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    };
    const updated = {
      ...activeResume,
      education: [newEdu, ...educationList],
    };
    updateActiveResume(updated, 'education', 'add');
    setExpandedIndex(0);
    showToast('Education entry added.', 'success');
  };

  const handleRemoveEducation = (index) => {
    const updatedList = educationList.filter((_, idx) => idx !== index);
    const updated = {
      ...activeResume,
      education: updatedList,
    };
    updateActiveResume(updated, 'education', `remove_${index}`);
    showToast('Education removed.', 'info');
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedList = [...educationList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    const updated = {
      ...activeResume,
      education: updatedList,
    };
    updateActiveResume(updated, 'education', `${field}_${index}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Education
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            List your degrees, college or university qualifications.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleAddEducation}
        >
          Add Education
        </Button>
      </div>

      {educationList.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education added yet"
          description="Add your degree, high school, or university diploma."
          primaryActionLabel="Add Education"
          onPrimaryAction={handleAddEducation}
        />
      ) : (
        <div className="space-y-4">
          {educationList.map((edu, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={edu.id || index}
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
                        {edu.degree || 'Degree'}{' '}
                        {edu.institution && <span className="font-normal text-neutral-500">at {edu.institution}</span>}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {edu.startDate || 'Start'} — {edu.endDate || 'End'} {edu.grade ? `(${edu.grade})` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveEducation(index);
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
                        label="Degree / Certificate"
                        value={edu.degree}
                        onChange={(e) => handleUpdateItem(index, 'degree', e.target.value)}
                        placeholder="e.g. B.S. in Computer Science"
                        required
                      />
                      <FormInput
                        label="School / University"
                        value={edu.institution}
                        onChange={(e) => handleUpdateItem(index, 'institution', e.target.value)}
                        placeholder="e.g. Stanford University"
                        required
                      />
                      <FormInput
                        label="Location (City, Country)"
                        value={edu.location}
                        onChange={(e) => handleUpdateItem(index, 'location', e.target.value)}
                        placeholder="e.g. Stanford, CA"
                      />
                      <FormInput
                        label="Grade / GPA / Honors"
                        value={edu.grade}
                        onChange={(e) => handleUpdateItem(index, 'grade', e.target.value)}
                        placeholder="e.g. 3.8 GPA, Magna Cum Laude"
                      />
                      <FormInput
                        label="Start Year / Date"
                        value={edu.startDate}
                        onChange={(e) => handleUpdateItem(index, 'startDate', e.target.value)}
                        placeholder="e.g. 2018"
                      />
                      <FormInput
                        label="End Year / Date (or Expected)"
                        value={edu.endDate}
                        onChange={(e) => handleUpdateItem(index, 'endDate', e.target.value)}
                        placeholder="e.g. 2022"
                      />
                    </div>

                    <FormTextarea
                      label="Coursework, Honors or Activities"
                      value={edu.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      placeholder="Relevant coursework: Data Structures, Distributed Systems, Software Engineering."
                      rows={3}
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
