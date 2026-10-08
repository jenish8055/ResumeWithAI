import React, { useState } from 'react';
import { FormInput, FormTextarea } from '../../common/FormInput';
import Button from '../../common/Button';
import { Plus, Trash2, Award, Globe, Heart, BookOpen, Star, FileText } from 'lucide-react';
import { useResumeStore } from '../../../features/resume/resumeStore';

export function CertificationsSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  if (!activeResume) return null;
  const list = activeResume.certifications || [];

  const handleAdd = () => {
    const item = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
    };
    updateActiveResume({ ...activeResume, certifications: [item, ...list] }, 'certifications', 'add');
    showToast('Certification added', 'success');
  };

  const handleUpdate = (idx, field, val) => {
    const updated = [...list];
    updated[idx] = { ...updated[idx], [field]: val };
    updateActiveResume({ ...activeResume, certifications: updated }, 'certifications', `${field}_${idx}`);
  };

  const handleRemove = (idx) => {
    const updated = list.filter((_, i) => i !== idx);
    updateActiveResume({ ...activeResume, certifications: updated }, 'certifications', `remove_${idx}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Certifications & Licenses
          </h2>
          <p className="text-xs text-neutral-500">Industry-recognized credentials and courses.</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-600">Certification #{idx + 1}</span>
              <button onClick={() => handleRemove(idx)} className="text-neutral-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput label="Certification Name" value={item.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" />
              <FormInput label="Issuing Organization" value={item.issuer} onChange={(e) => handleUpdate(idx, 'issuer', e.target.value)} placeholder="e.g. Amazon Web Services" />
              <FormInput label="Issue Date / Year" value={item.issueDate} onChange={(e) => handleUpdate(idx, 'issueDate', e.target.value)} placeholder="e.g. Nov 2023" />
              <FormInput label="Credential URL / ID" value={item.credentialUrl} onChange={(e) => handleUpdate(idx, 'credentialUrl', e.target.value)} placeholder="e.g. aws.amazon.com/verify/..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AchievementsSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  if (!activeResume) return null;
  const list = activeResume.achievements || [];

  const handleAdd = () => {
    const item = { id: `ach_${Date.now()}`, title: '', description: '', date: '' };
    updateActiveResume({ ...activeResume, achievements: [item, ...list] }, 'achievements', 'add');
    showToast('Achievement added', 'success');
  };

  const handleUpdate = (idx, field, val) => {
    const updated = [...list];
    updated[idx] = { ...updated[idx], [field]: val };
    updateActiveResume({ ...activeResume, achievements: updated }, 'achievements', `${field}_${idx}`);
  };

  const handleRemove = (idx) => {
    const updated = list.filter((_, i) => i !== idx);
    updateActiveResume({ ...activeResume, achievements: updated }, 'achievements', `remove_${idx}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Key Achievements & Awards
          </h2>
          <p className="text-xs text-neutral-500">Standout milestones, hackathon wins, or company awards.</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-600">Achievement #{idx + 1}</span>
              <button onClick={() => handleRemove(idx)} className="text-neutral-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput label="Title / Award Name" value={item.title} onChange={(e) => handleUpdate(idx, 'title', e.target.value)} placeholder="e.g. Hackathon 1st Place Winner" />
              <FormInput label="Date / Year" value={item.date} onChange={(e) => handleUpdate(idx, 'date', e.target.value)} placeholder="e.g. 2023" />
            </div>
            <FormInput label="Brief Description / Impact" value={item.description} onChange={(e) => handleUpdate(idx, 'description', e.target.value)} placeholder="e.g. Selected top 1% out of 500 applicants..." />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LanguagesSection() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  if (!activeResume) return null;
  const list = activeResume.languages || [];

  const handleAdd = () => {
    const item = { id: `lang_${Date.now()}`, language: '', proficiency: 'Fluent' };
    updateActiveResume({ ...activeResume, languages: [...list, item] }, 'languages', 'add');
    showToast('Language added', 'success');
  };

  const handleUpdate = (idx, field, val) => {
    const updated = [...list];
    updated[idx] = { ...updated[idx], [field]: val };
    updateActiveResume({ ...activeResume, languages: updated }, 'languages', `${field}_${idx}`);
  };

  const handleRemove = (idx) => {
    const updated = list.filter((_, i) => i !== idx);
    updateActiveResume({ ...activeResume, languages: updated }, 'languages', `remove_${idx}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Languages
          </h2>
          <p className="text-xs text-neutral-500">Spoken and written language proficiency.</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <FormInput value={item.language} onChange={(e) => handleUpdate(idx, 'language', e.target.value)} placeholder="e.g. English, Spanish" className="flex-1" />
            <select
              value={item.proficiency}
              onChange={(e) => handleUpdate(idx, 'proficiency', e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <button onClick={() => handleRemove(idx)} className="text-neutral-400 hover:text-red-500 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomSections() {
  const { activeResume, updateActiveResume, showToast } = useResumeStore();
  if (!activeResume) return null;
  const list = activeResume.customSections || [];

  const handleAddSection = () => {
    const newSection = {
      id: `custom_${Date.now()}`,
      sectionTitle: 'Additional Experience',
      items: [{ id: `item_${Date.now()}`, title: '', subtitle: '', date: '', description: '' }],
    };
    updateActiveResume({ ...activeResume, customSections: [...list, newSection] }, 'customSections', 'add');
    showToast('Custom section created', 'success');
  };

  const handleUpdateTitle = (sIdx, title) => {
    const updated = [...list];
    updated[sIdx].sectionTitle = title;
    updateActiveResume({ ...activeResume, customSections: updated }, 'customSections', 'title');
  };

  const handleAddItem = (sIdx) => {
    const updated = [...list];
    updated[sIdx].items.push({ id: `item_${Date.now()}`, title: '', subtitle: '', date: '', description: '' });
    updateActiveResume({ ...activeResume, customSections: updated }, 'customSections', 'add_item');
  };

  const handleUpdateItem = (sIdx, itemIdx, field, val) => {
    const updated = [...list];
    updated[sIdx].items[itemIdx][field] = val;
    updateActiveResume({ ...activeResume, customSections: updated }, 'customSections', 'item');
  };

  const handleRemoveSection = (sIdx) => {
    const updated = list.filter((_, i) => i !== sIdx);
    updateActiveResume({ ...activeResume, customSections: updated }, 'customSections', 'remove');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
            Custom Sections
          </h2>
          <p className="text-xs text-neutral-500">Add any tailored category (e.g. Patents, Speaking Engagements, Leadership).</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleAddSection}>
          Add Custom Section
        </Button>
      </div>

      <div className="space-y-6">
        {list.map((section, sIdx) => (
          <div key={section.id || sIdx} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={section.sectionTitle}
                onChange={(e) => handleUpdateTitle(sIdx, e.target.value)}
                placeholder="Section Title (e.g. Publications, Patents, Speaking)"
                className="font-bold text-base bg-transparent border-b border-dashed border-neutral-300 dark:border-neutral-700 outline-none pb-1"
              />
              <button onClick={() => handleRemoveSection(sIdx)} className="text-neutral-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {section.items.map((item, itemIdx) => (
                <div key={item.id || itemIdx} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <FormInput label="Title" value={item.title} onChange={(e) => handleUpdateItem(sIdx, itemIdx, 'title', e.target.value)} placeholder="Title / Role" />
                    <FormInput label="Subtitle / Date" value={item.subtitle} onChange={(e) => handleUpdateItem(sIdx, itemIdx, 'subtitle', e.target.value)} placeholder="Organization / Date" />
                  </div>
                  <FormTextarea label="Details" value={item.description} onChange={(e) => handleUpdateItem(sIdx, itemIdx, 'description', e.target.value)} placeholder="Details..." rows={2} />
                </div>
              ))}
              <Button variant="outline" size="sm" icon={Plus} onClick={() => handleAddItem(sIdx)}>
                Add Entry
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
