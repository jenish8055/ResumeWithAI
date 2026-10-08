/**
 * Local Activity Logger Service
 * Keeps structured, non-intrusive activity logs in IndexedDB with debounce and privacy controls.
 */

import { indexedDBService } from '../storage/indexedDBService';
import { localStorageService } from '../storage/localStorageService';
import { formatActivityLogsToTxt } from './logFormatter';

export const LOG_EVENTS = {
  APP_OPENED: 'APP_OPENED',
  ONBOARDING_STARTED: 'ONBOARDING_STARTED',
  ONBOARDING_COMPLETED: 'ONBOARDING_COMPLETED',
  RESUME_CREATED: 'RESUME_CREATED',
  RESUME_OPENED: 'RESUME_OPENED',
  RESUME_UPDATED: 'RESUME_UPDATED',
  RESUME_DELETED: 'RESUME_DELETED',
  RESUME_DUPLICATED: 'RESUME_DUPLICATED',
  SECTION_OPENED: 'SECTION_OPENED',
  SECTION_COMPLETED: 'SECTION_COMPLETED',
  SECTION_REORDERED: 'SECTION_REORDERED',
  FIELD_UPDATED: 'FIELD_UPDATED',
  AI_ASSISTANT_OPENED: 'AI_ASSISTANT_OPENED',
  AI_GENERATION_STARTED: 'AI_GENERATION_STARTED',
  AI_GENERATION_COMPLETED: 'AI_GENERATION_COMPLETED',
  AI_SUGGESTION_ACCEPTED: 'AI_SUGGESTION_ACCEPTED',
  AI_SUGGESTION_REJECTED: 'AI_SUGGESTION_REJECTED',
  AI_SUGGESTION_REGENERATED: 'AI_SUGGESTION_REGENERATED',
  TEMPLATE_SELECTED: 'TEMPLATE_SELECTED',
  TEMPLATE_CHANGED: 'TEMPLATE_CHANGED',
  ATS_ANALYSIS_STARTED: 'ATS_ANALYSIS_STARTED',
  ATS_ANALYSIS_COMPLETED: 'ATS_ANALYSIS_COMPLETED',
  JOB_DESCRIPTION_ADDED: 'JOB_DESCRIPTION_ADDED',
  JOB_DESCRIPTION_ANALYZED: 'JOB_DESCRIPTION_ANALYZED',
  PDF_EXPORT_STARTED: 'PDF_EXPORT_STARTED',
  PDF_EXPORT_COMPLETED: 'PDF_EXPORT_COMPLETED',
  WORD_EXPORT_STARTED: 'WORD_EXPORT_STARTED',
  WORD_EXPORT_COMPLETED: 'WORD_EXPORT_COMPLETED',
  RESUME_IMPORTED: 'RESUME_IMPORTED',
  DATA_EXPORTED: 'DATA_EXPORTED',
  DATA_IMPORTED: 'DATA_IMPORTED',
  VERSION_CREATED: 'VERSION_CREATED',
  VERSION_RESTORED: 'VERSION_RESTORED',
};

class ActivityLoggerService {
  constructor() {
    this.sessionId = this.initSessionId();
    this.debounceTimers = new Map();
    this.subscribers = new Set();
  }

  initSessionId() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 8);
    return `session_${dateStr}_${rand}`;
  }

  getSessionId() {
    return this.sessionId;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(entry) {
    this.subscribers.forEach((cb) => {
      try {
        cb(entry);
      } catch (err) {
        console.error('Logger subscriber error:', err);
      }
    });
  }

  async log(event, data = {}) {
    const isDetailed = localStorageService.getDetailedLogging();
    
    // Privacy safeguard: If detailed logging is disabled, redact raw text contents
    const cleanMetadata = { ...(data.metadata || {}) };
    if (!isDetailed) {
      delete cleanMetadata.previousValue;
      delete cleanMetadata.newValue;
      delete cleanMetadata.rawContent;
    }

    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      event,
      resumeId: data.resumeId || null,
      resumeName: data.resumeName || null,
      section: data.section || null,
      field: data.field || null,
      action: data.action || null,
      fromTemplate: data.fromTemplate || null,
      toTemplate: data.toTemplate || null,
      format: data.format || null,
      pageSize: data.pageSize || null,
      metadata: Object.keys(cleanMetadata).length > 0 ? cleanMetadata : undefined,
    };

    try {
      await indexedDBService.addActivityLog(logEntry);
      this.notifySubscribers(logEntry);
    } catch (err) {
      console.warn('Failed to record activity log in IndexedDB:', err);
    }

    return logEntry;
  }

  /**
   * Debounced logging for text fields to prevent excessive I/O during keystrokes
   */
  logDebouncedFieldUpdate(section, field, resumeId, extra = {}, delay = 800) {
    const key = `${resumeId || 'global'}_${section}_${field}`;
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    const timer = setTimeout(() => {
      this.log(LOG_EVENTS.FIELD_UPDATED, {
        resumeId,
        section,
        field,
        ...extra,
      });
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  async getRecentLogs(limit = 100) {
    return indexedDBService.getActivityLogs(limit);
  }

  async clearLogs() {
    await indexedDBService.clearActivityLogs();
    this.log(LOG_EVENTS.DATA_EXPORTED, { action: 'logs_cleared' });
    return true;
  }

  async generateTxtLog() {
    const logs = await indexedDBService.getActivityLogs(1000);
    return formatActivityLogsToTxt(logs, this.sessionId);
  }
}

export const activityLogger = new ActivityLoggerService();
