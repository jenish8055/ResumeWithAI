import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { TEMPLATES, COLOR_PRESETS, FONT_OPTIONS } from '../../features/resume/resumeTemplates';
import { useResumeStore } from '../../features/resume/resumeStore';
import { Palette, Check, Sparkles } from 'lucide-react';

export default function TemplateSelectorModal({ isOpen, onClose }) {
  const { activeResume, setTemplate, showToast } = useResumeStore();

  if (!isOpen || !activeResume) return null;

  const currentTemplateId = activeResume.template?.templateId || 'modern';
  const currentAccent = activeResume.template?.accentColor || '#F97316';
  const currentFont = activeResume.template?.font || 'Plus Jakarta Sans';

  const handleSelectTemplate = (template) => {
    setTemplate(template.id, {
      font: template.font || currentFont,
      accentColor: template.accentColor || currentAccent,
    });
  };

  const handleSelectColor = (colorHex) => {
    setTemplate(currentTemplateId, { accentColor: colorHex });
  };

  const handleSelectFont = (fontName) => {
    setTemplate(currentTemplateId, { font: fontName });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Templates & Styling"
      subtitle="Choose from 10+ ATS-optimized professional templates. Your resume data is 100% preserved."
      icon={Palette}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Style Customizer (Color & Font) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Accent Color
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectColor(c.id)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    currentAccent === c.id ? 'scale-110 ring-2 ring-offset-2 ring-brand-500' : 'hover:scale-105'
                  } ${c.bg}`}
                  title={c.label}
                >
                  {currentAccent === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              Typography Font
            </span>
            <select
              value={currentFont}
              onChange={(e) => handleSelectFont(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
          {TEMPLATES.map((tmpl) => {
            const isSelected = currentTemplateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`group relative flex flex-col justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-brand-500 bg-orange-50/50 dark:bg-brand-950/40 shadow-brand'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      {tmpl.name}
                    </span>
                    {tmpl.tag && (
                      <Badge variant={isSelected ? 'brand' : 'neutral'} size="sm">
                        {tmpl.tag}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                {/* Simulated Thumbnail Preview Card */}
                <div className="mt-4 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 space-y-1.5 pointer-events-none">
                  <div className="w-1/2 h-2 rounded bg-neutral-400 dark:bg-neutral-600" />
                  <div className="w-1/3 h-1.5 rounded bg-brand-400" />
                  <div className="w-full h-1 rounded bg-neutral-300 dark:bg-neutral-700 mt-2" />
                  <div className="w-4/5 h-1 rounded bg-neutral-300 dark:bg-neutral-700" />
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
