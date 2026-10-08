/**
 * AI Service Facade
 * Dispatches AI actions, handles logging, and isolates AI implementations.
 */

import { aiMockService } from './aiMockService';
import { activityLogger, LOG_EVENTS } from '../logging/ActivityLoggerService';

export const aiService = {
  async generateSummary(context, resumeId) {
    activityLogger.log(LOG_EVENTS.AI_GENERATION_STARTED, {
      resumeId,
      action: 'generateSummary',
    });
    const result = await aiMockService.generateSummary(context);
    activityLogger.log(LOG_EVENTS.AI_GENERATION_COMPLETED, {
      resumeId,
      action: 'generateSummary',
    });
    return result;
  },

  async improveSummary(currentSummary, tone, resumeId) {
    activityLogger.log(LOG_EVENTS.AI_GENERATION_STARTED, {
      resumeId,
      action: `improveSummary_${tone}`,
    });
    const result = await aiMockService.improveSummary(currentSummary, tone);
    activityLogger.log(LOG_EVENTS.AI_GENERATION_COMPLETED, {
      resumeId,
      action: `improveSummary_${tone}`,
    });
    return result;
  },

  async improveExperience(jobTitle, currentDescription, roleCategory, style, resumeId) {
    activityLogger.log(LOG_EVENTS.AI_GENERATION_STARTED, {
      resumeId,
      action: 'improveExperience',
    });
    const result = await aiMockService.improveExperience(jobTitle, currentDescription, roleCategory, style);
    activityLogger.log(LOG_EVENTS.AI_GENERATION_COMPLETED, {
      resumeId,
      action: 'improveExperience',
    });
    return result;
  },

  async generateExperienceBullets(jobTitle, keywords, currentText, resumeId) {
    activityLogger.log(LOG_EVENTS.AI_GENERATION_STARTED, {
      resumeId,
      action: 'generateExperienceBullets',
    });
    const result = await aiMockService.generateExperienceBullets(jobTitle, keywords, currentText);
    activityLogger.log(LOG_EVENTS.AI_GENERATION_COMPLETED, {
      resumeId,
      action: 'generateExperienceBullets',
    });
    return result;
  },

  async generateAchievements(jobTitle, context, resumeId) {
    const result = await aiMockService.generateAchievements(jobTitle, context);
    activityLogger.log(LOG_EVENTS.AI_GENERATION_COMPLETED, {
      resumeId,
      action: 'generateAchievements',
    });
    return result;
  },

  async suggestSkills(targetRole, currentSkills, profession, resumeId) {
    return aiMockService.suggestSkills(targetRole, currentSkills, profession);
  },

  async generateProjectDescription(projectName, role, technologies, rawSummary, resumeId) {
    return aiMockService.generateProjectDescription(projectName, role, technologies, rawSummary);
  },

  calculateResumeScore(resume) {
    return aiMockService.calculateResumeScore(resume);
  },

  async analyzeJobDescription(resume, jobDescription, resumeId) {
    activityLogger.log(LOG_EVENTS.ATS_ANALYSIS_STARTED, { resumeId });
    const result = await aiMockService.analyzeJobDescription(resume, jobDescription);
    activityLogger.log(LOG_EVENTS.ATS_ANALYSIS_COMPLETED, {
      resumeId,
      metadata: { matchScore: result.matchScore },
    });
    return result;
  },

  async tailorResume(resume, jobDescription, resumeId) {
    return aiMockService.tailorResume(resume, jobDescription);
  },

  async generateCoverLetter(params) {
    return aiMockService.generateCoverLetter(params);
  },

  async fixGrammar(text) {
    return aiMockService.fixGrammar(text);
  },

  async generateInterviewQuestions(role, experience) {
    return aiMockService.generateInterviewQuestions(role, experience);
  },

  async careerCoach(profile, goal) {
    return aiMockService.careerCoach(profile, goal);
  },

  async skillGapAnalysis(targetRole, currentSkills) {
    return aiMockService.skillGapAnalysis(targetRole, currentSkills);
  },
};
