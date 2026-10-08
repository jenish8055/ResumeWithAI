/**
 * Central Zustand Store for ResumewithAI
 * Manages active resume, list of resumes, autosave to IndexedDB, undo/history, AI assistants, and UI modals.
 */

import { create } from 'zustand';
import { storageService } from '../../services/storage/storageService';
import { localStorageService } from '../../services/storage/localStorageService';
import { activityLogger, LOG_EVENTS } from '../../services/logging/ActivityLoggerService';
import { createSampleResume, createEmptyResume } from './resumeModel';
import { calculateCompletion } from './resumeValidation';
import { aiService } from '../../services/ai/aiService';

let saveTimeout = null;

export const useResumeStore = create((set, get) => ({
  // State
  resumes: [],
  activeResume: null,
  isLoading: true,
  saveStatus: 'saved', // 'saved' | 'saving' | 'error'
  experienceMode: localStorageService.getExperienceMode() || 'intermediate',
  zoomLevel: 100, // 75, 90, 100, 125
  activeSection: 'personalInfo',
  isMobilePreviewOpen: false,
  versionHistory: [],
  theme: localStorageService.getTheme() || 'light',

  // Toast
  toast: null, // { message, type: 'success' | 'info' | 'error', id }

  // AI Modal
  aiModal: {
    isOpen: false,
    mode: 'assistant', // 'assistant' | 'summary' | 'experience' | 'ats' | 'tailor' | 'skills' | 'coach'
    targetSection: null,
    targetField: null,
    targetItemIndex: null,
    initialData: null,
    suggestion: null,
    isLoading: false,
  },

  // Confirmation Modal
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: false,
    onConfirm: null,
  },

  // Actions
  init: async () => {
    set({ isLoading: true });
    try {
      let list = await storageService.getResumes();

      // If empty, create initial high-quality sample developer resume
      if (!list || list.length === 0) {
        const initialSample = createSampleResume('developer', get().experienceMode);
        await storageService.saveResume(initialSample);
        list = [initialSample];
        activityLogger.log(LOG_EVENTS.APP_OPENED, { resumeId: initialSample.id });
      } else {
        activityLogger.log(LOG_EVENTS.APP_OPENED);
      }

      const lastActiveId = localStorageService.getActiveResumeId();
      const active = (lastActiveId && list.find((r) => r.id === lastActiveId)) || list[0];

      set({
        resumes: list,
        activeResume: active,
        isLoading: false,
      });

      if (active) {
        get().loadVersions(active.id);
      }
    } catch (err) {
      console.error('Failed to initialize resume store:', err);
      set({ isLoading: false });
    }
  },

  setTheme: (newTheme) => {
    localStorageService.setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: newTheme });
  },

  setExperienceMode: (mode) => {
    localStorageService.setExperienceMode(mode);
    const active = get().activeResume;
    if (active) {
      const updated = { ...active, experienceMode: mode };
      get().updateActiveResume(updated, 'settings', 'experienceMode');
    }
    set({ experienceMode: mode });
  },

  setActiveSection: (sectionKey) => {
    activityLogger.log(LOG_EVENTS.SECTION_OPENED, {
      resumeId: get().activeResume?.id,
      section: sectionKey,
    });
    set({ activeSection: sectionKey });
  },

  setZoomLevel: (zoom) => {
    set({ zoomLevel: zoom });
  },

  setMobilePreviewOpen: (open) => {
    set({ isMobilePreviewOpen: open });
  },

  selectResume: async (id) => {
    const resumes = get().resumes;
    const target = resumes.find((r) => r.id === id);
    if (target) {
      localStorageService.setActiveResumeId(id);
      activityLogger.log(LOG_EVENTS.RESUME_OPENED, {
        resumeId: id,
        resumeName: target.resumeName,
      });
      set({ activeResume: target });
      get().loadVersions(id);
    }
  },

  createNewResume: async (name = 'New Resume', docType = 'resume', templateId = 'modern') => {
    const newResume = createEmptyResume(name, docType, get().experienceMode);
    if (templateId) {
      newResume.template.templateId = templateId;
    }

    // Calculate initial scores
    newResume.completionPercentage = calculateCompletion(newResume);
    const scoreReport = aiService.calculateResumeScore(newResume);
    newResume.resumeScore = scoreReport.score;
    newResume.atsScore = scoreReport.breakdown.ats;

    await storageService.saveResume(newResume);
    const updatedList = await storageService.getResumes();

    activityLogger.log(LOG_EVENTS.RESUME_CREATED, {
      resumeId: newResume.id,
      resumeName: newResume.resumeName,
    });

    localStorageService.setActiveResumeId(newResume.id);
    set({
      resumes: updatedList,
      activeResume: newResume,
    });
    get().showToast('New resume created successfully!', 'success');
    return newResume;
  },

  duplicateResume: async (id) => {
    const target = get().resumes.find((r) => r.id === id) || get().activeResume;
    if (!target) return null;

    const dupId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: dupId,
      resumeName: `${target.resumeName} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storageService.saveResume(duplicated);
    const updatedList = await storageService.getResumes();

    activityLogger.log(LOG_EVENTS.RESUME_DUPLICATED, {
      resumeId: dupId,
      resumeName: duplicated.resumeName,
      metadata: { originalId: target.id },
    });

    localStorageService.setActiveResumeId(dupId);
    set({
      resumes: updatedList,
      activeResume: duplicated,
    });
    get().showToast('Resume duplicated!', 'success');
    return duplicated;
  },

  deleteResume: async (id) => {
    await storageService.deleteResume(id);
    activityLogger.log(LOG_EVENTS.RESUME_DELETED, { resumeId: id });

    const updatedList = await storageService.getResumes();
    let nextActive = null;
    if (updatedList.length > 0) {
      nextActive = updatedList[0];
      localStorageService.setActiveResumeId(nextActive.id);
    } else {
      // Create empty if all deleted
      nextActive = createEmptyResume('My First Resume', 'resume', get().experienceMode);
      await storageService.saveResume(nextActive);
      updatedList.push(nextActive);
      localStorageService.setActiveResumeId(nextActive.id);
    }

    set({
      resumes: updatedList,
      activeResume: nextActive,
    });
    get().showToast('Resume deleted.', 'info');
  },

  // Auto-saving Update Function
  updateActiveResume: (updatedResume, section = null, field = null) => {
    const completion = calculateCompletion(updatedResume);
    const scoreReport = aiService.calculateResumeScore(updatedResume);

    const fullUpdated = {
      ...updatedResume,
      completionPercentage: completion,
      resumeScore: scoreReport.score,
      atsScore: scoreReport.breakdown.ats,
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update memory state
    set((state) => ({
      activeResume: fullUpdated,
      resumes: state.resumes.map((r) => (r.id === fullUpdated.id ? fullUpdated : r)),
      saveStatus: 'saving',
    }));

    if (section && field) {
      activityLogger.logDebouncedFieldUpdate(section, field, fullUpdated.id);
    }

    // Debounced save to IndexedDB
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        await storageService.saveResume(fullUpdated);
        set({ saveStatus: 'saved' });
      } catch (err) {
        console.error('Error auto-saving resume:', err);
        set({ saveStatus: 'error' });
      }
    }, 600);
  },

  updatePersonalInfo: (field, value) => {
    const active = get().activeResume;
    if (!active) return;
    const updated = {
      ...active,
      personalInfo: {
        ...active.personalInfo,
        [field]: value,
      },
    };
    get().updateActiveResume(updated, 'personalInfo', field);
  },

  updateSectionOrder: (newOrder) => {
    const active = get().activeResume;
    if (!active) return;
    const updated = {
      ...active,
      sectionOrder: newOrder,
    };
    activityLogger.log(LOG_EVENTS.SECTION_REORDERED, {
      resumeId: active.id,
      metadata: { order: newOrder },
    });
    get().updateActiveResume(updated, 'layout', 'sectionOrder');
  },

  toggleSection: (sectionKey) => {
    const active = get().activeResume;
    if (!active) return;
    const currentEnabled = active.enabledSections || {};
    const updated = {
      ...active,
      enabledSections: {
        ...currentEnabled,
        [sectionKey]: !currentEnabled[sectionKey],
      },
    };
    get().updateActiveResume(updated, 'layout', `toggle_${sectionKey}`);
  },

  setTemplate: (templateId, customStyles = {}) => {
    const active = get().activeResume;
    if (!active) return;
    const oldTemplate = active.template?.templateId || 'classic';
    const updated = {
      ...active,
      template: {
        ...active.template,
        templateId,
        ...customStyles,
      },
    };
    activityLogger.log(LOG_EVENTS.TEMPLATE_CHANGED, {
      resumeId: active.id,
      fromTemplate: oldTemplate,
      toTemplate: templateId,
    });
    get().updateActiveResume(updated, 'template', templateId);
    get().showToast(`Template changed to ${templateId}`, 'info');
  },

  // Version History
  loadVersions: async (resumeId) => {
    if (!resumeId) return;
    const versions = await storageService.getVersions(resumeId);
    set({ versionHistory: versions });
  },

  saveCurrentVersion: async (label = '') => {
    const active = get().activeResume;
    if (!active) return;
    const version = await storageService.createVersion(active.id, active, label);
    activityLogger.log(LOG_EVENTS.VERSION_CREATED, {
      resumeId: active.id,
      metadata: { versionId: version.id, label },
    });
    await get().loadVersions(active.id);
    get().showToast('Version snapshot saved!', 'success');
  },

  restoreVersion: async (versionData) => {
    const active = get().activeResume;
    if (!active || !versionData) return;

    // Snapshot current before restoring
    await storageService.createVersion(active.id, active, 'Auto-snapshot before restore');

    const restored = {
      ...versionData,
      id: active.id, // maintain current ID
      updatedAt: new Date().toISOString(),
    };

    get().updateActiveResume(restored, 'version', 'restore');
    await get().loadVersions(active.id);

    activityLogger.log(LOG_EVENTS.VERSION_RESTORED, {
      resumeId: active.id,
    });

    get().showToast('Resume version restored!', 'success');
  },

  // AI Assistant Modal
  openAiAssistant: (config = {}) => {
    activityLogger.log(LOG_EVENTS.AI_ASSISTANT_OPENED, {
      resumeId: get().activeResume?.id,
      metadata: { mode: config.mode || 'general' },
    });
    set({
      aiModal: {
        isOpen: true,
        mode: config.mode || 'assistant',
        targetSection: config.targetSection || null,
        targetField: config.targetField || null,
        targetItemIndex: config.targetItemIndex ?? null,
        initialData: config.initialData || null,
        suggestion: config.suggestion || null,
        isLoading: false,
      },
    });
  },

  closeAiAssistant: () => {
    set((state) => ({
      aiModal: { ...state.aiModal, isOpen: false, suggestion: null, isLoading: false },
    }));
  },

  setAiSuggestion: (suggestion) => {
    set((state) => ({
      aiModal: { ...state.aiModal, suggestion, isLoading: false },
    }));
  },

  setAiLoading: (isLoading) => {
    set((state) => ({
      aiModal: { ...state.aiModal, isLoading },
    }));
  },

  // Confirmation Modal
  openConfirmModal: (options = {}) => {
    set({
      confirmModal: {
        isOpen: true,
        title: options.title || 'Are you sure?',
        message: options.message || 'This action cannot be undone.',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        isDanger: !!options.isDanger,
        onConfirm: options.onConfirm || null,
      },
    });
  },

  closeConfirmModal: () => {
    set((state) => ({
      confirmModal: { ...state.confirmModal, isOpen: false, onConfirm: null },
    }));
  },

  // Toast
  showToast: (message, type = 'info') => {
    const id = Date.now();
    set({ toast: { message, type, id } });
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : state));
    }, 4000);
  },

  dismissToast: () => {
    set({ toast: null });
  },
}));
