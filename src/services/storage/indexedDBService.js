/**
 * IndexedDB Service for ResumewithAI
 * Handles robust local-first storage for Resumes, Versions, and Activity Logs.
 */

const DB_NAME = 'ResumewithAI_DB';
const DB_VERSION = 1;

const STORES = {
  RESUMES: 'resumes',
  VERSIONS: 'resume_versions',
  ACTIVITY_LOGS: 'activity_logs',
  COVER_LETTERS: 'cover_letters',
  BIODATAS: 'biodatas',
};

class IndexedDBService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async getDB() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Resumes Store
        if (!db.objectStoreNames.contains(STORES.RESUMES)) {
          const resumeStore = db.createObjectStore(STORES.RESUMES, { keyPath: 'id' });
          resumeStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          resumeStore.createIndex('documentType', 'documentType', { unique: false });
        }

        // Resume Versions Store
        if (!db.objectStoreNames.contains(STORES.VERSIONS)) {
          const versionStore = db.createObjectStore(STORES.VERSIONS, { keyPath: 'id' });
          versionStore.createIndex('resumeId', 'resumeId', { unique: false });
          versionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Activity Logs Store
        if (!db.objectStoreNames.contains(STORES.ACTIVITY_LOGS)) {
          const logStore = db.createObjectStore(STORES.ACTIVITY_LOGS, { keyPath: 'id' });
          logStore.createIndex('timestamp', 'timestamp', { unique: false });
          logStore.createIndex('sessionId', 'sessionId', { unique: false });
          logStore.createIndex('event', 'event', { unique: false });
        }

        // Cover Letters Store
        if (!db.objectStoreNames.contains(STORES.COVER_LETTERS)) {
          db.createObjectStore(STORES.COVER_LETTERS, { keyPath: 'id' });
        }

        // Biodatas Store
        if (!db.objectStoreNames.contains(STORES.BIODATAS)) {
          db.createObjectStore(STORES.BIODATAS, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB Error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.initPromise;
  }

  // Generic Operations
  async getAll(storeName) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getById(storeName, id) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, data) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Resumes Specific
  async getAllResumes() {
    const resumes = await this.getAll(STORES.RESUMES);
    return resumes.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  }

  async getResume(id) {
    return this.getById(STORES.RESUMES, id);
  }

  async saveResume(resume) {
    const updated = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };
    return this.put(STORES.RESUMES, updated);
  }

  async deleteResume(id) {
    await this.delete(STORES.RESUMES, id);
    // Also delete associated versions
    const versions = await this.getVersionsForResume(id);
    for (const v of versions) {
      await this.delete(STORES.VERSIONS, v.id);
    }
    return true;
  }

  // Versions Specific
  async saveVersion(resumeId, resumeData, label = '') {
    const versionId = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const version = {
      id: versionId,
      resumeId,
      timestamp: new Date().toISOString(),
      label: label || `Snapshot at ${new Date().toLocaleTimeString()}`,
      data: JSON.parse(JSON.stringify(resumeData)),
    };
    await this.put(STORES.VERSIONS, version);

    // Keep max 10 versions
    const allVersions = await this.getVersionsForResume(resumeId);
    if (allVersions.length > 10) {
      const oldest = allVersions.slice(10);
      for (const old of oldest) {
        await this.delete(STORES.VERSIONS, old.id);
      }
    }
    return version;
  }

  async getVersionsForResume(resumeId) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.VERSIONS, 'readonly');
      const store = transaction.objectStore(STORES.VERSIONS);
      const index = store.index('resumeId');
      const request = index.getAll(resumeId);

      request.onsuccess = () => {
        const versions = request.result || [];
        resolve(versions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Activity Logs Specific
  async addActivityLog(logEntry) {
    return this.put(STORES.ACTIVITY_LOGS, logEntry);
  }

  async getActivityLogs(limit = 500) {
    const logs = await this.getAll(STORES.ACTIVITY_LOGS);
    return logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  async clearActivityLogs() {
    return this.clear(STORES.ACTIVITY_LOGS);
  }

  // Storage Stats
  async getStorageUsage() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usageBytes: estimate.usage || 0,
        quotaBytes: estimate.quota || 0,
        usageMB: ((estimate.usage || 0) / (1024 * 1024)).toFixed(2),
      };
    }
    const resumes = await this.getAll(STORES.RESUMES);
    const logs = await this.getAll(STORES.ACTIVITY_LOGS);
    const approx = JSON.stringify(resumes).length + JSON.stringify(logs).length;
    return {
      usageBytes: approx,
      quotaBytes: 50 * 1024 * 1024,
      usageMB: (approx / (1024 * 1024)).toFixed(2),
    };
  }

  // Clear all application data
  async clearAllData() {
    await this.clear(STORES.RESUMES);
    await this.clear(STORES.VERSIONS);
    await this.clear(STORES.ACTIVITY_LOGS);
    await this.clear(STORES.COVER_LETTERS);
    await this.clear(STORES.BIODATAS);
    return true;
  }
}

export const indexedDBService = new IndexedDBService();
