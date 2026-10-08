import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { useResumeStore } from '../../features/resume/resumeStore';

export default function ConfirmationModal() {
  const confirmModal = useResumeStore((state) => state.confirmModal);
  const closeConfirmModal = useResumeStore((state) => state.closeConfirmModal);

  if (!confirmModal.isOpen) return null;

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    closeConfirmModal();
  };

  return (
    <Modal
      isOpen={confirmModal.isOpen}
      onClose={closeConfirmModal}
      title={confirmModal.title}
      icon={confirmModal.isDanger ? AlertTriangle : AlertCircle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {confirmModal.message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Button variant="outline" onClick={closeConfirmModal}>
            {confirmModal.cancelText || 'Cancel'}
          </Button>
          <Button
            variant={confirmModal.isDanger ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmModal.confirmText || 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
