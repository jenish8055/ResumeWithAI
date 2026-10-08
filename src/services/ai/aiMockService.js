/**
 * AI Mock Engine for ResumewithAI
 * Generates context-rich, role-specific professional career text.
 * Rule: NEVER fabricates unprovided facts (jobs, degrees, metrics, certifications).
 */

const ROLE_KEYWORDS = {
  developer: {
    verbs: ['Architected', 'Developed', 'Engineered', 'Optimized', 'Refactored', 'Deployed', 'Integrated', 'Automated'],
    buzzwords: ['scalability', 'clean architecture', 'reusable components', 'responsive design', 'CI/CD pipeline', 'RESTful APIs', 'code quality', 'performance optimization'],
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Next.js', 'Git', 'REST APIs', 'GraphQL', 'Docker', 'Jest', 'PostgreSQL'],
    softSkills: ['Problem Solving', 'Code Review', 'Cross-functional Collaboration', 'Agile/Scrum', 'Technical Documentation'],
  },
  designer: {
    verbs: ['Designed', 'Prototyped', 'Crafted', 'Synthesized', 'Standardized', 'Streamlined', 'Iterated', 'Spearheaded'],
    buzzwords: ['user-centric workflows', 'design systems', 'wireframes & high-fidelity prototypes', 'usability testing', 'visual hierarchy', 'design tokens', 'heuristic evaluation'],
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Adobe XD', 'Visual Design', 'Information Architecture'],
    softSkills: ['Design Thinking', 'Empathy', 'Stakeholder Presentations', 'Creative Strategy', 'Design Critique'],
  },
  manager: {
    verbs: ['Led', 'Orchestrated', 'Delivered', 'Spearheaded', 'Aligned', 'Prioritized', 'Monitored', 'Scaled'],
    buzzwords: ['cross-functional execution', 'product roadmap', 'agile delivery', 'stakeholder management', 'sprint planning', 'KPI tracking', 'user feedback loops'],
    skills: ['Product Strategy', 'Agile / Scrum', 'Roadmapping', 'Jira', 'Sprint Planning', 'User Stories', 'Data Analysis', 'Risk Management'],
    softSkills: ['Leadership', 'Strategic Vision', 'Negotiation', 'Conflict Resolution', 'Cross-team Alignment'],
  },
  student: {
    verbs: ['Built', 'Learned', 'Authored', 'Coordinated', 'Implemented', 'Investigated', 'Collaborated on', 'Assisted in'],
    buzzwords: ['academic excellence', 'hands-on project implementation', 'rapid skill acquisition', 'foundational coursework', 'collaborative teamwork'],
    skills: ['Python', 'Java', 'Data Structures & Algorithms', 'HTML/CSS', 'Git', 'SQL', 'Problem Solving'],
    softSkills: ['Curiosity', 'Time Management', 'Fast Learner', 'Team Collaboration', 'Adaptability'],
  },
  sales: {
    verbs: ['Generated', 'Negotiated', 'Closed', 'Nurtured', 'Expanded', 'Outreached', 'Maintained', 'Drove'],
    buzzwords: ['pipeline growth', 'client relations', 'prospect engagement', 'quota achievement', 'CRM hygiene', 'consultative selling'],
    skills: ['CRM (Salesforce/HubSpot)', 'Lead Generation', 'Cold Outreach', 'Negotiation', 'Account Management', 'Sales Forecasting'],
    softSkills: ['Active Listening', 'Persuasion', 'Relationship Building', 'Resilience', 'Communication'],
  },
  teacher: {
    verbs: ['Instructed', 'Curated', 'Facilitated', 'Mentored', 'Evaluated', 'Engaged', 'Adapted', 'Developed'],
    buzzwords: ['student engagement', 'customized curriculum', 'differentiated learning', 'progress assessment', 'interactive pedagogy'],
    skills: ['Curriculum Design', 'Classroom Management', 'Lesson Planning', 'Student Assessment', 'EdTech Tools', 'Educational Psychology'],
    softSkills: ['Patience', 'Empathy', 'Public Speaking', 'Adaptability', 'Mentorship'],
  },
  doctor: {
    verbs: ['Administered', 'Diagnosed', 'Managed', 'Treated', 'Evaluated', 'Collaborated', 'Documented', 'Advised'],
    buzzwords: ['patient-centered care', 'clinical protocols', 'evidence-based practice', 'multidisciplinary coordination', 'electronic health records'],
    skills: ['Clinical Diagnosis', 'Patient Care', 'EHR / EMR Systems', 'Medical Ethics', 'Emergency Response', 'Preventative Care'],
    softSkills: ['Empathy', 'Crisis Decision Making', 'Patient Communication', 'Attention to Detail'],
  },
  general: {
    verbs: ['Coordinated', 'Delivered', 'Managed', 'Enhanced', 'Executed', 'Streamlined', 'Organized', 'Facilitated'],
    buzzwords: ['operational efficiency', 'cross-functional collaboration', 'quality standards', 'timely delivery', 'process improvement'],
    skills: ['Project Management', 'Data Analysis', 'Communication', 'Microsoft Office / G-Suite', 'Process Improvement'],
    softSkills: ['Problem Solving', 'Time Management', 'Attention to Detail', 'Teamwork', 'Communication'],
  }
};

function getRolePack(role = '') {
  const normalized = (role || '').toLowerCase();
  if (normalized.includes('developer') || normalized.includes('software') || normalized.includes('code') || normalized.includes('frontend') || normalized.includes('backend') || normalized.includes('fullstack') || normalized.includes('web')) {
    return ROLE_KEYWORDS.developer;
  }
  if (normalized.includes('design') || normalized.includes('ui') || normalized.includes('ux') || normalized.includes('graphic') || normalized.includes('product designer')) {
    return ROLE_KEYWORDS.designer;
  }
  if (normalized.includes('manager') || normalized.includes('lead') || normalized.includes('product') || normalized.includes('scrum') || normalized.includes('agile')) {
    return ROLE_KEYWORDS.manager;
  }
  if (normalized.includes('student') || normalized.includes('fresher') || normalized.includes('intern') || normalized.includes('graduate')) {
    return ROLE_KEYWORDS.student;
  }
  if (normalized.includes('sale') || normalized.includes('business development') || normalized.includes('account')) {
    return ROLE_KEYWORDS.sales;
  }
  if (normalized.includes('teach') || normalized.includes('educat') || normalized.includes('professor') || normalized.includes('instructor')) {
    return ROLE_KEYWORDS.teacher;
  }
  if (normalized.includes('doctor') || normalized.includes('nurse') || normalized.includes('health') || normalized.includes('medical')) {
    return ROLE_KEYWORDS.doctor;
  }
  return ROLE_KEYWORDS.general;
}

export const aiMockService = {
  async delay(ms = 600) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  async generateSummary(context = {}) {
    await this.delay(650);
    const { title = 'Professional', skills = [], experience = [], role = '', goal = 'advancing career', isStudent = false } = context;
    const pack = getRolePack(role || title);
    
    const skillList = skills.length > 0 ? skills.slice(0, 4).map(s => typeof s === 'string' ? s : s.name).join(', ') : 'modern industry tools';
    const cleanTitle = title.trim() || 'Professional';

    if (isStudent || pack === ROLE_KEYWORDS.student) {
      return `Motivated and detail-oriented ${cleanTitle} with a strong foundation in ${skillList}. Passionate about applying academic training and practical project work to solve real-world problems. Proven ability to learn quickly, collaborate effectively in team environments, and deliver high-quality outcomes aimed at ${goal}.`;
    }

    if (experience.length > 0) {
      return `Results-driven ${cleanTitle} with hands-on experience in executing high-impact initiatives and driving organizational success. Skilled in ${skillList}, with a strong track record of streamlining workflows and ensuring cross-functional alignment. Dedicated to delivering scalable solutions and contributing to collaborative, growth-oriented teams.`;
    }

    return `Dedicated and versatile ${cleanTitle} equipped with core competencies in ${skillList}. Adept at analyzing complex requirements, developing structured approaches, and delivering dependable results in fast-paced environments. Committed to continuous learning and professional excellence.`;
  },

  async improveSummary(currentSummary, tone = 'professional') {
    await this.delay(500);
    if (!currentSummary || currentSummary.trim().length === 0) {
      return this.generateSummary({ title: 'Specialist' });
    }

    const trimmed = currentSummary.trim();
    if (tone === 'ats') {
      return `Target-oriented specialist offering proven expertise. Proficient in key industry competencies with demonstrated ability to execute projects effectively: ${trimmed} Recognized for strong analytical rigor, collaborative execution, and consistent delivery on strategic objectives.`;
    }
    if (tone === 'confident') {
      return `Accomplished and forward-thinking professional with a track record of delivering measurable value. ${trimmed} Recognized for proactive initiative, agile problem-solving, and the ability to elevate team performance.`;
    }
    if (tone === 'concise') {
      const firstSentence = trimmed.split('.')[0] || trimmed;
      return `${firstSentence}. Consistently delivering robust results through disciplined execution and continuous improvement.`;
    }
    return `Versatile and detail-focused professional with recognized strengths in end-to-end execution. ${trimmed} Dedicated to maintaining high standards of quality and collaborating seamlessly across multidisciplinary teams.`;
  },

  async improveExperience(jobTitle = '', rawDescription = '', roleCategory = 'general', style = 'professional') {
    await this.delay(550);
    const pack = getRolePack(jobTitle || roleCategory);
    const lines = (rawDescription || '').split('\n').map(l => l.trim()).filter(Boolean);

    if (lines.length === 0) {
      const v1 = pack.verbs[0];
      const v2 = pack.verbs[1] || 'Collaborated';
      const b1 = pack.buzzwords[0];
      const b2 = pack.buzzwords[1];
      return [
        `${v1} and executed core deliverables for ${jobTitle || 'assigned projects'}, emphasizing ${b1}.`,
        `${v2} with cross-functional team members to establish standardized processes and ensure ${b2}.`,
        `Monitored performance metrics and implemented continuous improvements to elevate overall quality and efficiency.`
      ].join('\n');
    }

    const improved = lines.map((line, idx) => {
      const verb = pack.verbs[idx % pack.verbs.length];
      const clean = line.replace(/^[-*•\d.]+\s*/, '').trim();
      // Polish without adding false facts
      if (clean.toLowerCase().startsWith('worked on') || clean.toLowerCase().startsWith('responsible for') || clean.toLowerCase().startsWith('helped with')) {
        const remaining = clean.replace(/^(worked on|responsible for|helped with|did|handled)\s+/i, '');
        return `${verb} ${remaining}, ensuring alignment with industry best practices and quality benchmarks.`;
      }
      return `${verb} ${clean.charAt(0).toLowerCase() + clean.slice(1)}, improving operational consistency and execution speed.`;
    });

    return improved.join('\n');
  },

  async generateExperienceBullets(jobTitle = '', keywords = '', currentText = '') {
    await this.delay(500);
    const pack = getRolePack(jobTitle);
    const baseVerb = pack.verbs;

    return [
      `${baseVerb[0]} project milestones and deliverables from conception to completion, ensuring adherence to quality and timeline requirements.`,
      `${baseVerb[1]} cross-functional workflows and communication channels to enhance collaboration and accelerate delivery cycles.`,
      `${baseVerb[2]} structured documentation and standardized protocols to maintain operational excellence and knowledge sharing.`,
      `${baseVerb[3]} targeted solutions to resolve complex roadblocks, contributing directly to team productivity and goal achievement.`
    ];
  },

  async generateAchievements(jobTitle = '', context = '') {
    await this.delay(450);
    const pack = getRolePack(jobTitle);
    return [
      `Successfully streamlined operational workflow for ${jobTitle || 'assigned projects'}, reducing execution friction and improving consistency.`,
      `Authored comprehensive documentation and guidelines, adopted by peers to standardize best practices.`,
      `Recognized for outstanding reliability, proactive problem solving, and consistent on-schedule delivery.`
    ];
  },

  async suggestSkills(targetRole = '', currentSkills = [], profession = '') {
    await this.delay(400);
    const pack = getRolePack(targetRole || profession);
    const existingNames = new Set(
      currentSkills.map((s) => (typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase()))
    );

    const technical = pack.skills
      .filter((s) => !existingNames.has(s.toLowerCase()))
      .map((name) => ({ name, category: 'technical', level: 'Intermediate' }));

    const soft = pack.softSkills
      .filter((s) => !existingNames.has(s.toLowerCase()))
      .map((name) => ({ name, category: 'soft', level: 'Advanced' }));

    return {
      suggestedTechnical: technical,
      suggestedSoft: soft,
      allRecommendations: [...technical, ...soft],
    };
  },

  async generateProjectDescription(projectName = 'Project', role = '', technologies = '', rawSummary = '') {
    await this.delay(500);
    const techText = technologies ? `utilizing ${technologies}` : 'leveraging modern development tools';
    const baseSummary = rawSummary.trim() || 'Built a practical solution addressing core functional requirements';

    return `Engineered ${projectName} ${techText}, focusing on structured modularity, intuitive user experience, and robust error handling. ${baseSummary.replace(/^built\s+/i, 'Developed ')}. Integrated clean architecture principles to ensure long-term maintainability and high responsiveness.`;
  },

  calculateResumeScore(resume) {
    let score = 0;
    const breakdown = {
      content: 0,
      ats: 0,
      experience: 0,
      skills: 0,
      formatting: 0,
      completeness: 0,
    };
    const recommendations = [];
    const completedItems = [];

    // Personal Info Check
    const p = resume.personalInfo || {};
    let personalScore = 0;
    if (p.fullName && p.fullName.trim()) {
      personalScore += 5;
      completedItems.push('Full name provided');
    } else {
      recommendations.push('Add your full name.');
    }
    if (p.email && p.email.includes('@')) {
      personalScore += 5;
      completedItems.push('Valid email included');
    } else {
      recommendations.push('Add a valid contact email.');
    }
    if (p.phone && p.phone.trim()) {
      personalScore += 3;
      completedItems.push('Phone number provided');
    } else {
      recommendations.push('Include a phone number for recruiter outreach.');
    }
    if (p.linkedin && p.linkedin.trim()) {
      personalScore += 4;
      completedItems.push('LinkedIn profile linked');
    } else {
      recommendations.push('Add your LinkedIn profile link to improve discoverability.');
    }
    if (p.professionalTitle && p.professionalTitle.trim()) {
      personalScore += 3;
      completedItems.push('Professional title defined');
    } else {
      recommendations.push('Add a targeted professional title (e.g., "Full Stack Developer").');
    }

    // Summary Check
    let summaryScore = 0;
    const summaryText = resume.summary || '';
    if (summaryText.trim().length > 60) {
      summaryScore = 15;
      completedItems.push('Compelling professional summary');
    } else if (summaryText.trim().length > 0) {
      summaryScore = 8;
      recommendations.push('Expand your professional summary to at least 2-3 sentences.');
    } else {
      recommendations.push('Add a professional summary to capture recruiters\' attention.');
    }

    // Experience Check
    let expScore = 0;
    const expList = Array.isArray(resume.experience) ? resume.experience : [];
    if (expList.length >= 2) {
      expScore = 20;
      completedItems.push('Multiple structured experience entries');
    } else if (expList.length === 1) {
      expScore = 12;
      completedItems.push('Work experience entry added');
      recommendations.push('Add another past role or project to enrich your history.');
    } else {
      // For student mode, lack of experience isn't penalized if projects/education exist
      if (resume.experienceMode === 'beginner' || resume.documentType === 'cv') {
        expScore = 10;
      } else {
        recommendations.push('Add work experience or internships with strong action bullets.');
      }
    }

    // Skills Check
    let skillScore = 0;
    const skillsList = Array.isArray(resume.skills) ? resume.skills : [];
    if (skillsList.length >= 6) {
      skillScore = 15;
      completedItems.push('6+ relevant skills added');
    } else if (skillsList.length >= 3) {
      skillScore = 9;
      recommendations.push('Add at least 5-8 relevant skills for better ATS ranking.');
    } else {
      recommendations.push('Add your primary technical and soft skills.');
    }

    // Education Check
    let eduScore = 0;
    const eduList = Array.isArray(resume.education) ? resume.education : [];
    if (eduList.length >= 1 && eduList[0].institution) {
      eduScore = 15;
      completedItems.push('Education details provided');
    } else {
      recommendations.push('Add your highest degree or education background.');
    }

    // Projects / Certifications / Extras
    let extrasScore = 0;
    const projList = Array.isArray(resume.projects) ? resume.projects : [];
    const certList = Array.isArray(resume.certifications) ? resume.certifications : [];
    if (projList.length > 0) extrasScore += 8;
    if (certList.length > 0) extrasScore += 7;
    if (projList.length > 0 || certList.length > 0) {
      completedItems.push('Projects or Certifications added');
    } else {
      recommendations.push('Add notable projects or certifications to stand out.');
    }

    // Formatting & ATS
    breakdown.content = Math.min(25, personalScore + summaryScore);
    breakdown.experience = Math.min(25, expScore);
    breakdown.skills = Math.min(15, skillScore);
    breakdown.completeness = Math.min(20, eduScore + extrasScore);
    breakdown.formatting = 10;
    breakdown.ats = Math.min(100, Math.round((breakdown.content + breakdown.experience + breakdown.skills + breakdown.completeness + breakdown.formatting) * 0.95));

    score = Math.min(100, Math.round(breakdown.content + breakdown.experience + breakdown.skills + breakdown.completeness + breakdown.formatting));

    return {
      score,
      breakdown,
      recommendations: recommendations.slice(0, 5),
      completedItems,
      grade: score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Draft',
    };
  },

  async analyzeJobDescription(resume, jobDescription = '') {
    await this.delay(700);
    if (!jobDescription || jobDescription.trim().length < 20) {
      return {
        matchScore: 65,
        matchedSkills: ['Communication', 'Teamwork', 'Problem Solving'],
        missingSkills: ['Project Planning', 'Technical Documentation'],
        matchedKeywords: ['Collaborate', 'Deliver', 'Support'],
        missingKeywords: ['Metrics-driven', 'Cross-functional Alignment'],
        recommendations: [
          'Paste a complete job description to get deep keyword matching.',
          'Highlight your relevant experience matching the job title.',
        ],
      };
    }

    const jdText = jobDescription.toLowerCase();
    const resumeText = JSON.stringify(resume).toLowerCase();

    // Extract potential tech and business keywords
    const commonKeywords = [
      'react', 'javascript', 'typescript', 'node.js', 'python', 'java', 'sql', 'html', 'css', 'tailwind', 'git',
      'docker', 'aws', 'agile', 'scrum', 'leadership', 'communication', 'problem solving', 'collaboration',
      'management', 'analytics', 'figma', 'ui/ux', 'rest api', 'graphql', 'ci/cd', 'testing', 'optimization',
      'scalability', 'cross-functional', 'stakeholder', 'strategy', 'customer service', 'sales', 'curriculum'
    ];

    const presentInJd = commonKeywords.filter(kw => jdText.includes(kw));
    const matched = presentInJd.filter(kw => resumeText.includes(kw));
    const missing = presentInJd.filter(kw => !resumeText.includes(kw));

    const totalKeywordsFound = Math.max(presentInJd.length, 5);
    const matchRatio = matched.length / totalKeywordsFound;
    const matchScore = Math.min(98, Math.max(45, Math.round(matchRatio * 70 + 25)));

    const recommendations = [];
    if (missing.length > 0) {
      recommendations.push(`Consider highlighting experience with: ${missing.slice(0, 4).join(', ')} if you possess these skills.`);
    }
    recommendations.push('Tailor your professional summary to echo the job title and key deliverables mentioned in the posting.');
    recommendations.push('Incorporate quantifiable achievements in your work experience bullet points.');

    return {
      matchScore,
      matchedSkills: matched.slice(0, 8),
      missingSkills: missing.slice(0, 6),
      matchedKeywords: matched.slice(0, 6),
      missingKeywords: missing.slice(0, 6),
      recommendations,
    };
  },

  async tailorResume(resume, jobDescription) {
    await this.delay(800);
    const analysis = await this.analyzeJobDescription(resume, jobDescription);
    const tailoredSummary = await this.improveSummary(resume.summary || '', 'ats');

    return {
      analysis,
      suggestedSummary: tailoredSummary,
      suggestedSkillsToAdd: analysis.missingSkills.map(s => ({ name: s, category: 'technical', level: 'Intermediate' })),
      advice: 'Review the suggested summary and add missing skills you have legitimate experience in.',
    };
  },

  async generateCoverLetter(params = {}) {
    await this.delay(800);
    const {
      fullName = 'Applicant',
      jobTitle = 'Software Professional',
      company = 'Target Organization',
      jobDescription = '',
      tone = 'professional',
      resumeData = {}
    } = params;

    const skills = (resumeData.skills || []).slice(0, 4).map(s => typeof s === 'string' ? s : s.name).join(', ') || 'proven core competencies';

    let body = '';
    if (tone === 'confident') {
      body = `I am writing with great enthusiasm to apply for the ${jobTitle} role at ${company}. Having followed ${company}'s impressive growth and impact, I am eager to bring my expertise in ${skills} to contribute directly to your team's mission.

Throughout my career, I have focused on solving complex challenges through disciplined execution and continuous innovation. I pride myself on driving high standards of quality, fostering cross-functional alignment, and delivering reliable solutions that move business metrics forward.

The opportunity at ${company} aligns perfectly with my professional trajectory. I would welcome the chance to discuss how my skill set and proactive mindset will generate meaningful value for your team.`;
    } else if (tone === 'formal') {
      body = `Please accept this letter as formal expression of my interest in the ${jobTitle} position currently available at ${company}. With a strong background in ${skills}, I am confident in my capacity to fulfill the responsibilities outlined in your requisition.

My professional history reflects a consistent commitment to operational excellence, rigorous attention to detail, and adherence to industry best practices. I work effectively within multidisciplinary teams to ensure projects are delivered accurately and on schedule.

Thank you for your time and consideration of my candidacy. I look forward to the possibility of discussing my background in greater detail.`;
    } else {
      // Professional default
      body = `I am excited to submit my application for the ${jobTitle} position at ${company}. With demonstrated experience and core proficiencies in ${skills}, I am well-prepared to make an immediate, positive impact on your ongoing initiatives.

In my previous work, I have consistently balanced strategic problem-solving with hands-on execution. Whether collaborating with team members, streamlining workflows, or architecting robust deliverables, I prioritize clear communication and measurable outcomes.

I am particularly drawn to ${company}'s forward-looking approach and collaborative culture. Thank you for reviewing my application. I look forward to discussing how my experience aligns with your team's needs.`;
    }

    return {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipient: `Hiring Manager / Talent Acquisition Team\n${company}`,
      salutation: `Dear Hiring Team at ${company},`,
      body,
      signOff: `Sincerely,\n${fullName || 'Candidate'}`,
    };
  },

  async fixGrammar(text) {
    await this.delay(400);
    if (!text) return '';
    return text
      .replace(/\bi\b/g, 'I')
      .replace(/\s+/g, ' ')
      .replace(/\s([.,!?:;])/g, '$1')
      .trim();
  },

  async generateInterviewQuestions(role = 'Software Engineer', experience = []) {
    await this.delay(600);
    const pack = getRolePack(role);
    return [
      {
        category: 'Role & Technical Competence',
        question: `Can you walk us through a recent project where you applied ${pack.skills[0] || 'your primary skills'} to overcome a technical obstacle?`,
        tip: 'Structure your answer using the STAR method: Situation, Task, Action, and Result.',
      },
      {
        category: 'Behavioral & Leadership',
        question: 'Tell me about a time when you received constructive feedback on a deliverable. How did you adapt your approach?',
        tip: 'Demonstrate humility, active listening, and a growth-oriented mindset.',
      },
      {
        category: 'Process & Collaboration',
        question: `How do you ensure smooth communication with cross-functional partners during high-priority sprints?`,
        tip: 'Highlight proactive check-ins, clear documentation, and empathy for stakeholder priorities.',
      },
      {
        category: 'Problem Solving',
        question: `When faced with ambiguous requirements, what steps do you take to clarify objectives and keep work on schedule?`,
        tip: 'Show how you break large unknowns into actionable questions and validate assumptions early.',
      },
    ];
  },

  async careerCoach(profile = {}, goal = '') {
    await this.delay(700);
    const role = profile.targetRole || profile.profession || 'Professional';
    const pack = getRolePack(role);

    return {
      currentLevel: profile.experienceLevel || 'Intermediate',
      recommendedRoles: [
        `Senior ${role}`,
        `Lead ${role}`,
        `${role} Consultant / Specialist`,
      ],
      highPrioritySkillsToLearn: pack.skills.slice(3, 7),
      strategicAdvice: [
        'Build and showcase at least 2 end-to-end case studies demonstrating business impact.',
        'Actively contribute to knowledge sharing or mentor junior peers to highlight leadership potential.',
        'Optimize your LinkedIn headline with target keywords to increase recruiter reach by up to 3x.',
      ],
      quarterlyMilestones: [
        'Month 1: Update resume and build a targeted portfolio piece.',
        'Month 2: Connect with 10 industry professionals and conduct 3 informational interviews.',
        'Month 3: Practice mock interviews and begin submitting tailored applications.',
      ],
    };
  },

  async skillGapAnalysis(targetRole = 'Software Engineer', currentSkills = []) {
    await this.delay(500);
    const pack = getRolePack(targetRole);
    const currentSet = new Set(currentSkills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase()));

    const strong = pack.skills.filter(s => currentSet.has(s.toLowerCase()));
    const missing = pack.skills.filter(s => !currentSet.has(s.toLowerCase()));

    return {
      strongSkills: strong.length > 0 ? strong : ['Foundational Domain Knowledge'],
      skillsToImprove: missing.slice(0, 3),
      highImpactSkillsToLearnNext: missing.slice(3, 6),
      readinessRating: strong.length >= 3 ? '85% Ready' : '65% Ready - Focus on Top 3 Gap Skills',
    };
  }
};
