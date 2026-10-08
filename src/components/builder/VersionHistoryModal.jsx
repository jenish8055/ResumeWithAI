import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { History, RotateCcw, BookmarkPlus, Clock, Check } from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';

export default function VersionHistoryModal({ isOpen, onClose }) {
  const { versionHistory, saveCurrentVersion, restoreVersion, activeResume, showToast } = useResumeStore();
  const [snapshotLabel, setSnapshotLabel] = useState('');

  if (!isOpen || !activeResume) return null;

  const handleCreateSnapshot = async () => {
    if (!snapshotLabel.trim()) {
      showToast('Please type a label for this version snapshot.', 'info');
      return;
    }
    await saveCurrentVersion(snapshotLabel.trim());
    setSnapshotLabel('');
  };

  const handleRestore = async (version) => {
    await restoreVersion(version.data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Version History & Snapshots"
      subtitle="Restore any previous snapshot without losing your active work."
      icon={History}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Create Manual Snapshot Bar */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
          <input
            type="text"
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            placeholder="Snapshot name (e.g. Before applying to Google)..."
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-brand-500 text-neutral-900 dark:text-neutral-100"
          />
          <Button
            variant="primary"
            size="sm"
            icon={BookmarkPlus}
            onClick={handleCreateSnapshot}
          >
            Save Snapshot
          </Button>
        </div>

        {/* Versions Timeline List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {versionHistory.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8 italic">
              No saved version snapshots for this resume yet.
            </p>
          ) : (
            versionHistory.map((ver, idx) => (
              <div
                key={ver.id || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-brand-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {ver.label || `Snapshot ${idx + 1}`}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(ver.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => handleRestore(ver)}
                >
                  Restore
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
