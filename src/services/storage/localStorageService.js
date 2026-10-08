/**
 * LocalStorage Service for lightweight user preferences and UI state.
 */

const PREFIX = 'resumewithai_';

const KEYS = {
  THEME: `${PREFIX}theme`,
  EXPERIENCE_MODE: `${PREFIX}experience_mode`,
  DEFAULT_TEMPLATE: `${PREFIX}default_template`,
  ACTIVE_RESUME_ID: `${PREFIX}active_resume_id`,
  DETAILED_LOGGING: `${PREFIX}detailed_logging`,
  USER_PROFILE: `${PREFIX}user_profile`,
  ONBOARDING_COMPLETED: `${PREFIX}onboarding_completed`,
  SETTINGS: `${PREFIX}settings`,
};

export const localStorageService = {
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`LocalStorage read error for ${key}:`, e);
      return defaultValue;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`LocalStorage write error for ${key}:`, e);
      return false;
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Specific Getters / Setters
  getTheme() {
    return this.getItem(KEYS.THEME, 'light');
  },
  setTheme(theme) {
    return this.setItem(KEYS.THEME, theme);
  },

  getExperienceMode() {
    return this.getItem(KEYS.EXPERIENCE_MODE, 'intermediate');
  },
  setExperienceMode(mode) {
    return this.setItem(KEYS.EXPERIENCE_MODE, mode);
  },

  getDefaultTemplate() {
    return this.getItem(KEYS.DEFAULT_TEMPLATE, 'modern');
  },
  setDefaultTemplate(templateId) {
    return this.setItem(KEYS.DEFAULT_TEMPLATE, templateId);
  },

  getActiveResumeId() {
    return this.getItem(KEYS.ACTIVE_RESUME_ID, null);
  },
  setActiveResumeId(id) {
    return this.setItem(KEYS.ACTIVE_RESUME_ID, id);
  },

  getDetailedLogging() {
    return this.getItem(KEYS.DETAILED_LOGGING, false);
  },
  setDetailedLogging(enabled) {
    return this.setItem(KEYS.DETAILED_LOGGING, !!enabled);
  },

  getUserProfile() {
    return this.getItem(KEYS.USER_PROFILE, {
      fullName: '',
      email: '',
      targetRole: 'Software Engineer',
      profession: 'developer',
      experienceLevel: 'intermediate',
    });
  },
  setUserProfile(profile) {
    return this.setItem(KEYS.USER_PROFILE, profile);
  },

  isOnboardingCompleted() {
    return this.getItem(KEYS.ONBOARDING_COMPLETED, false);
  },
  setOnboardingCompleted(completed = true) {
    return this.setItem(KEYS.ONBOARDING_COMPLETED, completed);
  },

  getSettings() {
    return this.getItem(KEYS.SETTINGS, {
      autoSave: true,
      autoSaveDelayMs: 800,
      showAiFloatingButton: true,
      spellCheck: true,
      fontSizePreference: 'medium',
      fontFamilyPreference: 'Inter',
      exportFormatPreference: 'pdf',
    });
  },
  setSettings(settings) {
    return this.setItem(KEYS.SETTINGS, settings);
  },

  clearAllPreferences() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
