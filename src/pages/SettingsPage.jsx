import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useResumeStore } from '../features/resume/resumeStore';
import { storageService } from '../services/storage/storageService';
import { localStorageService } from '../services/storage/localStorageService';
import { logExporter } from '../services/logging/logExporter';
import { activityLogger } from '../services/logging/ActivityLoggerService';
import {
  Settings,
  ShieldCheck,
  Download,
  UploadCloud,
  FileText,
  Trash2,
  Moon,
  Sun,
  Database,
  Terminal,
  AlertTriangle,
  HardDrive,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    experienceMode,
    setExperienceMode,
    openConfirmModal,
    showToast,
    init,
  } = useResumeStore();

  const [detailedLogging, setDetailedLogging] = useState(localStorageService.getDetailedLogging());
  const [storageStats, setStorageStats] = useState({ usageMB: '0.00' });
  const [recentLogs, setRecentLogs] = useState([]);
  const [isExportingLogs, setIsExportingLogs] = useState(false);

  useEffect(() => {
    loadStatsAndLogs();
  }, []);

  const loadStatsAndLogs = async () => {
    const stats = await storageService.getStorageStats();
    const logs = await activityLogger.getRecentLogs(30);
    setStorageStats(stats);
    setRecentLogs(logs);
  };

  const handleToggleDetailedLogging = (e) => {
    const checked = e.target.checked;
    localStorageService.setDetailedLogging(checked);
    setDetailedLogging(checked);
    showToast(`Developer detailed logging ${checked ? 'enabled' : 'disabled'}.`, 'info');
  };

  const handleExportJson = async () => {
    try {
      const dataStr = await storageService.exportAllUserData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resumewithai-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('JSON backup downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export JSON backup.', 'error');
    }
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        const res = await storageService.importUserData(text);
        await init();
        showToast(`Imported ${res.resumesCount} resumes successfully!`, 'success');
        loadStatsAndLogs();
      } catch (err) {
        showToast(err.message || 'Import failed.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExportTxtLogs = async () => {
    setIsExportingLogs(true);
    try {
      const res = await logExporter.exportTxtFile();
      if (res.success) {
        showToast('Activity logs exported as resumewithai-activity-log.txt', 'success');
      }
    } catch (err) {
      showToast('Log export failed.', 'error');
    } finally {
      setIsExportingLogs(false);
    }
  };

  const handleClearLogs = () => {
    openConfirmModal({
      title: 'Clear Local Activity Logs?',
      message: 'This will wipe all historical activity log entries from IndexedDB.',
      confirmText: 'Clear Logs',
      isDanger: true,
      onConfirm: async () => {
        await activityLogger.clearLogs();
        loadStatsAndLogs();
        showToast('Activity logs cleared.', 'info');
      },
    });
  };

  const handleWipeAllData = () => {
    openConfirmModal({
      title: '⚠️ Wipe All Local Data?',
      message: 'This will permanently remove all resumes, versions, preferences, and logs from this browser. This action cannot be undone.',
      confirmText: 'Wipe Everything',
      isDanger: true,
      onConfirm: async () => {
        await storageService.wipeAllLocalData();
        await init();
        loadStatsAndLogs();
        showToast('All local data wiped cleanly.', 'info');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <DashboardSidebar />

        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div>
            <Badge variant="brand" icon={ShieldCheck}>Data & Privacy Center</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white mt-1">
              Settings & Privacy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Manage your experience level, backup resume drafts, and inspect local device logs.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl">
            {/* 1. App Preferences */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-4">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                App & Experience Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Theme Appearance
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border font-bold cursor-pointer ${
                        theme === 'light'
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border font-bold cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>

                {/* Experience Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Experience Mode
                  </label>
                  <select
                    value={experienceMode}
                    onChange={(e) => setExperienceMode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none"
                  >
                    <option value="beginner">Beginner (Guided Conversation)</option>
                    <option value="intermediate">Intermediate (Standard + AI)</option>
                    <option value="advanced">Advanced (Full Control & Reordering)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Resume Data Management (JSON Backup/Restore) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                    Resume Data Backup & Restore
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Export your complete local database to transfer between devices.
                  </p>
                </div>
                <Badge variant="brand" icon={Database}>IndexedDB</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button variant="outline" size="sm" icon={Download} onClick={handleExportJson}>
                  Export JSON Backup
                </Button>
                <label className="inline-flex items-center justify-center font-medium rounded-xl text-xs px-3 py-2 gap-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 shadow-sm cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  <span>Import JSON Backup</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>
              </div>
            </div>

            {/* 3. Activity Logging & Privacy */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white font-heading">
                    Local Activity Logging
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Stores structured user interaction logs strictly in your browser for developer auditing.
                  </p>
                </div>
                <Badge variant="neutral" icon={Terminal}>Local Logs</Badge>
              </div>

              {/* Detailed Logging Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Developer Detailed Field Logging
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    When enabled in dev mode, records previous/new values. Default: False (Privacy-safe field names only).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={detailedLogging}
                  onChange={handleToggleDetailedLogging}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  isLoading={isExportingLogs}
                  onClick={handleExportTxtLogs}
                >
                  Export Activity Log (.txt)
                </Button>
                <Button variant="outline" size="sm" icon={Trash2} onClick={handleClearLogs}>
                  Clear Activity Logs
                </Button>
              </div>

              {/* Log Timeline Box */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Recent Recorded Actions ({recentLogs.length})
                </span>
                <div className="max-h-48 overflow-y-auto p-3 rounded-2xl bg-neutral-900 text-neutral-300 font-mono text-[11px] space-y-1">
                  {recentLogs.map((log, i) => (
                    <div key={log.id || i} className="flex items-start justify-between border-b border-neutral-800 pb-1">
                      <span className="text-brand-400 font-bold">{log.event}</span>
                      <span className="text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Danger Zone */}
            <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Permanently wipe all resumes, drafts, versions, preferences, and activity logs from this browser.
              </p>
              <Button variant="danger" size="sm" icon={Trash2} onClick={handleWipeAllData}>
                Wipe All Local Application Data
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
