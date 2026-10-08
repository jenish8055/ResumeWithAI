import React from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useResumeStore } from '../features/resume/resumeStore';
import { User, Globe, Share2, Mail, Phone, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/common/BrandIcons';

export default function ProfilePage() {
  const { activeResume, showToast } = useResumeStore();
  const p = activeResume?.personalInfo || {};

  const handleCopyLink = () => {
    const slug = (p.fullName || 'user').toLowerCase().replace(/\s+/g, '-');
    const url = `https://resumewithai.com/u/${slug}`;
    navigator.clipboard.writeText(url);
    showToast('Public profile link copied!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="brand" icon={User}>Public Profile Architecture</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mt-1">
                Professional Public Profile
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500">
                A shareable, web-hosted portfolio layout based on your active resume data.
              </p>
            </div>

            <Button variant="primary" size="sm" icon={Share2} onClick={handleCopyLink}>
              Share Profile Link
            </Button>
          </div>

          {/* Profile Card Preview */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500 relative" />

            <div className="p-8 space-y-6 relative -mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.fullName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-neutral-900 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-2xl border-4 border-white dark:border-neutral-900 shadow-md">
                      {p.fullName ? p.fullName.slice(0, 2).toUpperCase() : 'ME'}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-extrabold font-heading text-neutral-900 dark:text-white">
                      {p.fullName || 'Your Full Name'}
                    </h2>
                    <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                      {p.professionalTitle || 'Target Professional Title'}
                    </p>
                  </div>
                </div>

                <Badge variant="brand">resumewithai.com/u/{(p.fullName || 'user').toLowerCase().replace(/\s+/g, '-')}</Badge>
              </div>

              {/* Summary */}
              {activeResume?.summary && (
                <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">About</h3>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
                    {activeResume.summary}
                  </p>
                </div>
              )}

              {/* Skills */}
              {(activeResume?.skills || []).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResume.skills.map((s, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                        {typeof s === 'string' ? s : s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(activeResume?.projects || []).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Featured Projects</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeResume.projects.map((proj, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{proj.projectName}</h4>
                          {proj.projectUrl && <ExternalLink className="w-3.5 h-3.5 text-brand-500" />}
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-2">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
