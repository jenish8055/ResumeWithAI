import React, { useState } from 'react';
import Button from '../common/Button';
import { Sparkles, Check, RefreshCw, X, Edit3, ArrowRight } from 'lucide-react';
import { activityLogger, LOG_EVENTS } from '../../services/logging/ActivityLoggerService';

export default function AISuggestionCard({
  currentContent = '',
  suggestion = '',
  onAccept,
  onRegenerate,
  onCancel,
  resumeId = null,
  title = 'AI Enhanced Suggestion',
  isRegenerating = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion);

  const handleAccept = () => {
    activityLogger.log(LOG_EVENTS.AI_SUGGESTION_ACCEPTED, {
      resumeId,
      metadata: { originalTextLength: currentContent.length, acceptedLength: (isEditing ? editedText : suggestion).length },
    });
    onAccept(isEditing ? editedText : suggestion);
  };

  const handleReject = () => {
    activityLogger.log(LOG_EVENTS.AI_SUGGESTION_REJECTED, {
      resumeId,
    });
    onCancel?.();
  };

  const handleRegen = () => {
    activityLogger.log(LOG_EVENTS.AI_SUGGESTION_REGENERATED, {
      resumeId,
    });
    onRegenerate?.();
  };

  return (
    <div className="rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-gradient-to-b from-orange-50/70 to-white dark:from-neutral-900 dark:to-neutral-900/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-orange-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>{title}</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-medium">
          Fact-Preserved AI
        </span>
      </div>

      {currentContent && (
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Current Content
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-800/60 p-3 rounded-xl line-clamp-3 italic">
            "{currentContent}"
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Recommended AI Version
          </span>
          {!isEditing ? (
            <button
              onClick={() => {
                setEditedText(suggestion);
                setIsEditing(true);
              }}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit before accept
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-brand-600 hover:underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={4}
            className="w-full text-sm p-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-brand-500 outline-none text-neutral-900 dark:text-neutral-100"
          />
        ) : (
          <div className="text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 p-3.5 rounded-xl border border-brand-200 dark:border-brand-900/50 shadow-sm leading-relaxed whitespace-pre-line font-medium">
            {suggestion}
          </div>
        )}
      </div>

      {/* Control Buttons: Accept, Edit, Regenerate, Cancel */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={handleReject}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          isLoading={isRegenerating}
          onClick={handleRegen}
        >
          Regenerate
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Check}
          onClick={handleAccept}
        >
          Accept Suggestion
        </Button>
      </div>
    </div>
  );
}
