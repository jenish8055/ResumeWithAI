/**
 * Unified Storage Service Facade
 * Provides high level methods for resumes, versions, preferences, data export/import.
 */

import { indexedDBService } from './indexedDBService';
import { localStorageService } from './localStorageService';

export const storageService = {
  // Resumes
  async getResumes() {
    return indexedDBService.getAllResumes();
  },

  async getResume(id) {
    return indexedDBService.getResume(id);
  },

  async saveResume(resume) {
    return indexedDBService.saveResume(resume);
  },

  async deleteResume(id) {
    return indexedDBService.deleteResume(id);
  },

  // Versions
  async createVersion(resumeId, resumeData, label) {
    return indexedDBService.saveVersion(resumeId, resumeData, label);
  },

  async getVersions(resumeId) {
    return indexedDBService.getVersionsForResume(resumeId);
  },

  // JSON Export / Import
  async exportAllUserData() {
    const resumes = await indexedDBService.getAllResumes();
    const coverLetters = await indexedDBService.getAll('cover_letters');
    const biodatas = await indexedDBService.getAll('biodatas');
    const logs = await indexedDBService.getActivityLogs(200);
    const profile = localStorageService.getUserProfile();
    const settings = localStorageService.getSettings();

    const exportPayload = {
      app: 'ResumewithAI',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      settings,
      resumes,
      coverLetters,
      biodatas,
      activityLogsCount: logs.length,
    };

    return JSON.stringify(exportPayload, null, 2);
  },

  async importUserData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.app && !data.resumes) {
        throw new Error('Invalid ResumewithAI backup file format.');
      }

      if (Array.isArray(data.resumes)) {
        for (const resume of data.resumes) {
          if (resume.id) {
            await indexedDBService.saveResume(resume);
          }
        }
      }

      if (data.profile) {
        localStorageService.setUserProfile(data.profile);
      }

      if (data.settings) {
        localStorageService.setSettings(data.settings);
      }

      return {
        success: true,
        resumesCount: (data.resumes || []).length,
      };
    } catch (err) {
      console.error('Import error:', err);
      throw new Error(err.message || 'Failed to parse JSON file.');
    }
  },

  // Stats & Wipe
  async getStorageStats() {
    return indexedDBService.getStorageUsage();
  },

  async wipeAllLocalData() {
    await indexedDBService.clearAllData();
    localStorageService.clearAllPreferences();
    return true;
  },
};
