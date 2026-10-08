import React from 'react';
import Button from './Button';
import { Sparkles, FileText, Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FileText,
  title = 'Nothing here yet',
  description = 'Get started by adding your details or letting AI assist you.',
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-sm border border-brand-100 dark:border-brand-900">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 font-heading">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {primaryActionLabel && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </Button>
        )}
        {secondaryActionLabel && (
          <Button
            variant="secondary"
            icon={Sparkles}
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
