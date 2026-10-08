/**
 * Resume Validation & Completion Calculator
 */

export function calculateCompletion(resume) {
  if (!resume) return 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  // 1. Personal Info (25 pts)
  totalPoints += 25;
  const p = resume.personalInfo || {};
  if (p.fullName?.trim()) earnedPoints += 8;
  if (p.email?.trim()) earnedPoints += 7;
  if (p.phone?.trim()) earnedPoints += 5;
  if (p.professionalTitle?.trim()) earnedPoints += 3;
  if (p.linkedin?.trim() || p.website?.trim() || p.github?.trim()) earnedPoints += 2;

  // 2. Summary (15 pts)
  totalPoints += 15;
  if (resume.summary?.trim()?.length > 40) earnedPoints += 15;
  else if (resume.summary?.trim()?.length > 0) earnedPoints += 8;

  // 3. Experience or Projects (25 pts)
  totalPoints += 25;
  const hasExp = (resume.experience || []).length > 0;
  const hasProj = (resume.projects || []).length > 0;
  if (hasExp && (resume.experience || []).length >= 2) earnedPoints += 25;
  else if (hasExp || hasProj) earnedPoints += 18;

  // 4. Education (15 pts)
  totalPoints += 15;
  if ((resume.education || []).length > 0 && resume.education[0]?.institution) earnedPoints += 15;

  // 5. Skills (20 pts)
  totalPoints += 20;
  const skillCount = (resume.skills || []).length;
  if (skillCount >= 6) earnedPoints += 20;
  else if (skillCount >= 3) earnedPoints += 12;
  else if (skillCount > 0) earnedPoints += 6;

  return Math.min(100, Math.round((earnedPoints / totalPoints) * 100));
}

export function getMissingChecklist(resume) {
  if (!resume) return [];
  const checklist = [];
  const p = resume.personalInfo || {};

  checklist.push({
    section: 'personalInfo',
    label: 'Full Name & Title',
    completed: !!(p.fullName?.trim() && p.professionalTitle?.trim()),
  });

  checklist.push({
    section: 'personalInfo',
    label: 'Contact Info (Email & Phone)',
    completed: !!(p.email?.trim() && p.phone?.trim()),
  });

  checklist.push({
    section: 'summary',
    label: 'Professional Summary',
    completed: !!(resume.summary?.trim()?.length >= 30),
  });

  if (resume.experienceMode === 'beginner' || resume.profession === 'student') {
    checklist.push({
      section: 'projects',
      label: 'Projects / Practical Work',
      completed: (resume.projects || []).length > 0,
    });
  } else {
    checklist.push({
      section: 'experience',
      label: 'Work Experience',
      completed: (resume.experience || []).length > 0,
    });
  }

  checklist.push({
    section: 'education',
    label: 'Education Details',
    completed: (resume.education || []).length > 0,
  });

  checklist.push({
    section: 'skills',
    label: '5+ Relevant Skills',
    completed: (resume.skills || []).length >= 5,
  });

  return checklist;
}
