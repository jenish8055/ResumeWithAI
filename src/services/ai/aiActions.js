/**
 * AI Action Types and Constants
 */

export const AI_ACTIONS = {
  GENERATE_SUMMARY: 'generateSummary',
  IMPROVE_SUMMARY: 'improveSummary',
  SHORTEN_SUMMARY: 'shortenSummary',
  MAKE_PROFESSIONAL: 'makeProfessional',
  MAKE_ATS_FRIENDLY: 'makeAtsFriendly',
  MAKE_CONFIDENT: 'makeConfident',
  MAKE_CONCISE: 'makeConcise',
  IMPROVE_EXPERIENCE: 'improveExperience',
  GENERATE_EXPERIENCE_BULLETS: 'generateExperienceBullets',
  GENERATE_ACHIEVEMENTS: 'generateAchievements',
  FIX_GRAMMAR: 'fixGrammar',
  SUGGEST_SKILLS: 'suggestSkills',
  ANALYZE_SKILLS: 'analyzeSkills',
  GENERATE_PROJECT_DESC: 'generateProjectDescription',
  CALCULATE_SCORE: 'calculateResumeScore',
  ANALYZE_JOB: 'analyzeJobDescription',
  TAILOR_RESUME: 'tailorResume',
  GENERATE_COVER_LETTER: 'generateCoverLetter',
  CAREER_COACH: 'careerCoach',
  SKILL_GAP: 'skillGapAnalysis',
  INTERVIEW_PREP: 'interviewPrep',
};

export const PROFESSION_ROLES = [
  { id: 'developer', label: 'Developer / Software Engineer', icon: 'Code' },
  { id: 'designer', label: 'Designer (UI/UX / Graphic / Product)', icon: 'Palette' },
  { id: 'manager', label: 'Product / Project Manager', icon: 'Briefcase' },
  { id: 'student', label: 'Student / Fresher', icon: 'GraduationCap' },
  { id: 'sales', label: 'Sales & Business Development', icon: 'TrendingUp' },
  { id: 'teacher', label: 'Teacher / Educator', icon: 'BookOpen' },
  { id: 'doctor', label: 'Doctor / Healthcare Professional', icon: 'Activity' },
  { id: 'engineer', label: 'Mechanical / Civil / Electrical Engineer', icon: 'Cpu' },
  { id: 'marketing', label: 'Digital Marketer / Content Creator', icon: 'Megaphone' },
  { id: 'other', label: 'Other Profession', icon: 'User' },
];
