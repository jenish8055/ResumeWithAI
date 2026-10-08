import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import EmptyState from '../components/common/EmptyState';
import { useResumeStore } from '../features/resume/resumeStore';
import { exportService } from '../services/export/exportService';
import {
  Plus,
  FileText,
  Copy,
  Download,
  FileDown,
  Trash2,
  Edit3,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  MoreVertical,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    resumes,
    selectResume,
    createNewResume,
    duplicateResume,
    deleteResume,
    openConfirmModal,
    showToast,
  } = useResumeStore();

  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleOpenResume = (id) => {
    selectResume(id);
    navigate(`/resume/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  const handleDelete = (id, name) => {
    openConfirmModal({
      title: `Delete "${name}"?`,
      message: 'Are you sure you want to permanently delete this resume draft from local storage?',
      confirmText: 'Delete Resume',
      isDanger: true,
      onConfirm: () => deleteResume(id),
    });
  };

  const handleDownloadPdf = async (resume) => {
    selectResume(resume.id);
    navigate(`/resume/${resume.id}`);
    showToast('Opening resume for high-resolution PDF download...', 'info');
  };

  const avgAts = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 75), 0) / resumes.length)
    : 85;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          {/* Top Greeting & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
                Welcome back 👋
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Manage your resumes, track ATS performance, and create job-tailored applications.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleCreateNew}
              className="shadow-brand shrink-0"
            >
              Create New Resume
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-neutral-400">Total Drafts</span>
              <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">{resumes.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-neutral-400">Average ATS Score</span>
              <p className="text-2xl font-extrabold text-brand-600">{avgAts}%</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-neutral-400">Storage Type</span>
              <p className="text-xs font-bold text-emerald-600 pt-2 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Local IndexedDB
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-neutral-400">AI Assistant</span>
              <p className="text-xs font-bold text-brand-600 pt-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> Active & Ready
              </p>
            </div>
          </div>

          {/* Resumes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-heading">
                My Resumes ({resumes.length})
              </h2>
            </div>

            {resumes.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Your career story starts here."
                description="Create your first resume with AI assistance and choose from 10+ professional templates."
                primaryActionLabel="Create Your First Resume"
                onPrimaryAction={handleCreateNew}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => {
                  const p = resume.personalInfo || {};
                  return (
                    <div
                      key={resume.id}
                      className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xs hover:shadow-xl hover:border-brand-500/80 transition-all space-y-5"
                    >
                      {/* Top bar with ATS badge */}
                      <div className="flex items-center justify-between">
                        <Badge variant="brand" size="sm" icon={ShieldCheck}>
                          ATS {resume.atsScore || 85}%
                        </Badge>
                        <span className="text-[11px] text-neutral-400 capitalize font-medium">
                          {resume.template?.templateId || 'Modern'}
                        </span>
                      </div>

                      {/* Main info */}
                      <div className="space-y-2 cursor-pointer" onClick={() => handleOpenResume(resume.id)}>
                        <h3 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-brand-600 transition-colors font-heading line-clamp-1">
                          {resume.resumeName || 'Untitled Resume'}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-1">
                          {p.fullName || 'No Name'} • {p.professionalTitle || 'Target Role'}
                        </p>

                        <div className="pt-2">
                          <ProgressBar
                            value={resume.completionPercentage || 60}
                            showLabel
                            size="sm"
                            color="brand"
                          />
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(resume.updatedAt).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => duplicateResume(resume.id)}
                            className="p-1.5 text-neutral-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate resume"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(resume.id, resume.resumeName)}
                            className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete resume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Edit3}
                            onClick={() => handleOpenResume(resume.id)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
