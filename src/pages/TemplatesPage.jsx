import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { TEMPLATES, COLOR_PRESETS } from '../features/resume/resumeTemplates';
import { useResumeStore } from '../features/resume/resumeStore';
import { Sparkles, Palette, ArrowRight, Check } from 'lucide-react';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { createNewResume } = useResumeStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeAccentColor, setActiveAccentColor] = useState('#F97316');

  const categories = ['All', 'Popular', 'ATS Focused', 'Tech & Engineering', 'Corporate', 'Creative', 'Entry Level', 'Biodata'];

  const filtered = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory || (selectedCategory === 'Popular' && t.tag === 'Recommended'));

  const handleUseTemplate = async (templateId) => {
    const newDoc = await createNewResume('New Resume', 'resume', templateId);
    navigate(`/resume/${newDoc.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
                Resume Templates Library
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                10+ data-driven templates built for ATS screening algorithms and hiring managers.
              </p>
            </div>

            {/* Accent Color Swatches */}
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-xs font-semibold text-neutral-500 pl-2">Accent:</span>
              <div className="flex items-center gap-1.5">
                {COLOR_PRESETS.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveAccentColor(c.id)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      activeAccentColor === c.id ? 'scale-110 ring-2 ring-brand-500 ring-offset-2' : ''
                    } ${c.bg}`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-brand shadow-orange-500/20'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-500 hover:shadow-xl transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                      {tmpl.name}
                    </h3>
                    {tmpl.tag && <Badge variant="brand" size="sm">{tmpl.tag}</Badge>}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {tmpl.description}
                  </p>
                </div>

                {/* Simulated Visual Sheet */}
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 space-y-2 group-hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-center">
                    <div className="w-1/2 h-2.5 rounded bg-neutral-800 dark:bg-white" />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: activeAccentColor }} />
                  </div>
                  <div className="w-1/3 h-1.5 rounded" style={{ backgroundColor: activeAccentColor }} />
                  <div className="w-full h-1 bg-neutral-300 dark:bg-neutral-700 rounded mt-3" />
                  <div className="w-4/5 h-1 bg-neutral-300 dark:bg-neutral-700 rounded" />
                  <div className="w-3/5 h-1 bg-neutral-300 dark:bg-neutral-700 rounded" />
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Sparkles}
                    iconRight={ArrowRight}
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="w-full"
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
