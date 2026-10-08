/**
 * Resume Data Model & Starter Templates
 * Implements full specification from Section #54.
 */

export const DEFAULT_SECTION_ORDER = [
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'achievements',
  'languages',
  'interests',
  'volunteerExperience',
  'awards',
  'publications',
  'references',
  'customSections',
];

export const DEFAULT_ENABLED_SECTIONS = {
  personalInfo: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: true,
  achievements: true,
  languages: true,
  interests: false,
  volunteerExperience: false,
  awards: false,
  publications: false,
  references: false,
  customSections: false,
};

export function createEmptyResume(name = 'My Resume', documentType = 'resume', mode = 'intermediate') {
  const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  return {
    id,
    resumeName: name,
    documentType, // 'resume' | 'cv' | 'biodata' | 'cover_letter' | 'profile'
    createdAt: now,
    updatedAt: now,
    experienceMode: mode, // 'beginner' | 'intermediate' | 'advanced'
    targetRole: 'Software Engineer',
    profession: 'developer',

    personalInfo: {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      portfolio: '',
      photo: '',
      photoShape: 'circle', // 'circle' | 'square' | 'none'
    },

    summary: '',

    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    interests: [],
    volunteerExperience: [],
    awards: [],
    publications: [],
    references: [],
    customSections: [],

    sectionOrder: [...DEFAULT_SECTION_ORDER],
    enabledSections: { ...DEFAULT_ENABLED_SECTIONS },

    template: {
      templateId: 'modern',
      font: 'Inter',
      fontSize: 'medium', // 'compact' | 'medium' | 'spacious'
      headingStyle: 'bold',
      spacing: 'normal',
      accentColor: '#F97316',
      layout: 'single', // 'single' | 'two-column-left' | 'two-column-right'
      photoStyle: 'circle',
      sectionStyle: 'divider',
      headerStyle: 'modern',
    },

    settings: {
      showPhoto: true,
      showIcons: true,
      dateFormat: 'MMM YYYY',
    },

    atsScore: 70,
    resumeScore: 72,
    completionPercentage: 45,
  };
}

export function createSampleResume(type = 'developer', mode = 'intermediate') {
  const resume = createEmptyResume(
    type === 'student' ? 'Computer Science Graduate Resume' :
    type === 'designer' ? 'Lead Product Designer Resume' :
    type === 'manager' ? 'Senior Product Manager Resume' :
    type === 'doctor' ? 'Clinical Physician CV' :
    'Senior Frontend Engineer Resume',
    type === 'doctor' ? 'cv' : 'resume',
    mode
  );

  if (type === 'developer' || type === 'general') {
    resume.targetRole = 'Senior Frontend Engineer';
    resume.profession = 'developer';
    resume.personalInfo = {
      fullName: 'Alex Morgan',
      professionalTitle: 'Senior Frontend Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      website: 'alexmorgan.dev',
      linkedin: 'linkedin.com/in/alexmorgan',
      github: 'github.com/alexmorgan',
      portfolio: 'alexmorgan.dev/work',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      photoShape: 'circle',
    };
    resume.summary = 'Passionate Senior Frontend Engineer with 5+ years of experience building high-performance, accessible web applications using React, Next.js, and TypeScript. Adept at translating complex product requirements into intuitive user interfaces, improving core web vitals, and leading agile engineering workflows.';
    resume.experience = [
      {
        id: 'exp_1',
        company: 'Vanguard Tech Solutions',
        jobTitle: 'Lead Frontend Developer',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        currentlyWorking: true,
        description: '• Architected modular component design system in React and Tailwind CSS, standardizing UI consistency across 4 enterprise applications.\n• Spearheaded performance optimizations reducing initial page load times by 42% and elevating Lighthouse score to 98/100.\n• Mentored 5 mid-level engineers through structured code reviews, automated CI/CD testing workflows, and bi-weekly tech talks.',
      },
      {
        id: 'exp_2',
        company: 'Apex Digital Labs',
        jobTitle: 'Frontend Engineer',
        location: 'Austin, TX',
        startDate: 'Aug 2019',
        endDate: 'Dec 2021',
        currentlyWorking: false,
        description: '• Developed responsive client portals utilizing React, Redux Toolkit, and RESTful APIs serving 80,000+ monthly active users.\n• Implemented automated end-to-end testing with Cypress and Jest, increasing code coverage from 60% to 88%.\n• Collaborated closely with UX designers to iterate on high-fidelity Figma prototypes and user testing feedback.',
      },
    ];
    resume.education = [
      {
        id: 'edu_1',
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2015',
        endDate: '2019',
        grade: '3.85 GPA / Honors',
        description: 'Relevant coursework: Data Structures, Algorithms, Web Systems Architecture, Human-Computer Interaction.',
      },
    ];
    resume.skills = [
      { id: 'sk_1', name: 'React', category: 'technical', level: 'Expert' },
      { id: 'sk_2', name: 'JavaScript (ES6+)', category: 'technical', level: 'Expert' },
      { id: 'sk_3', name: 'TypeScript', category: 'technical', level: 'Advanced' },
      { id: 'sk_4', name: 'Next.js', category: 'technical', level: 'Advanced' },
      { id: 'sk_5', name: 'Tailwind CSS', category: 'technical', level: 'Expert' },
      { id: 'sk_6', name: 'REST & GraphQL APIs', category: 'technical', level: 'Advanced' },
      { id: 'sk_7', name: 'Git & GitHub', category: 'tools', level: 'Expert' },
      { id: 'sk_8', name: 'Jest & Cypress', category: 'tools', level: 'Advanced' },
      { id: 'sk_9', name: 'Cross-functional Collaboration', category: 'soft', level: 'Expert' },
      { id: 'sk_10', name: 'Agile / Scrum', category: 'soft', level: 'Advanced' },
    ];
    resume.projects = [
      {
        id: 'proj_1',
        projectName: 'CloudMetrics Dashboard',
        role: 'Creator & Lead Developer',
        technologies: 'React, Vite, Chart.js, Tailwind CSS',
        projectUrl: 'https://github.com/alexmorgan/cloudmetrics',
        description: 'Engineered a real-time server monitoring dashboard with animated analytics charts, customizable dark mode widgets, and sub-100ms response updates.',
      },
      {
        id: 'proj_2',
        projectName: 'AI Resume Synthesizer',
        role: 'Full Stack Engineer',
        technologies: 'Next.js, Tailwind, IndexedDB',
        projectUrl: 'https://resumewithai.dev',
        description: 'Created a local-first resume editor with live reactive previews, automated ATS keyword checking, and pixel-perfect PDF export.',
      },
    ];
    resume.certifications = [
      { id: 'cert_1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2023', credentialUrl: 'aws.amazon.com' },
      { id: 'cert_2', name: 'Meta Frontend Developer Professional Certificate', issuer: 'Coursera / Meta', issueDate: '2022', credentialUrl: 'coursera.org' },
    ];
    resume.achievements = [
      { id: 'ach_1', title: 'Hackathon Grand Prize Winner', description: 'Placed 1st out of 80 teams at SF Tech Challenge 2023 for best accessible web tooling.', date: '2023' },
    ];
    resume.languages = [
      { id: 'lang_1', language: 'English', proficiency: 'Native' },
      { id: 'lang_2', language: 'Spanish', proficiency: 'Intermediate' },
    ];
    resume.atsScore = 94;
    resume.resumeScore = 96;
    resume.completionPercentage = 95;
  } else if (type === 'student') {
    resume.targetRole = 'Junior Software Engineer';
    resume.profession = 'student';
    resume.personalInfo = {
      fullName: 'Samantha Chen',
      professionalTitle: 'Computer Science Graduate',
      email: 'samantha.chen@student.edu',
      phone: '+1 (555) 345-6789',
      location: 'Boston, MA',
      website: 'samchen.dev',
      linkedin: 'linkedin.com/in/samchen-cs',
      github: 'github.com/samchen-cs',
      portfolio: '',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      photoShape: 'circle',
    };
    resume.summary = 'Ambitious Computer Science graduate with hands-on project experience in web development, Python, and algorithm design. Passionate about building robust user-centered software, learning emerging technologies, and contributing energetic problem-solving skills to an innovative engineering team.';
    resume.education = [
      {
        id: 'edu_1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Northeastern University',
        location: 'Boston, MA',
        startDate: 'Sep 2020',
        endDate: 'May 2024',
        grade: '3.92 GPA / Dean\'s List All Semesters',
        description: 'Coursework: Data Structures & Algorithms, Object-Oriented Design, Computer Systems, Database Management.',
      },
    ];
    resume.projects = [
      {
        id: 'proj_1',
        projectName: 'Campus Study Partner Finder',
        role: 'Team Lead',
        technologies: 'React, Node.js, Express, MongoDB',
        projectUrl: 'https://github.com/samchen-cs/study-sync',
        description: 'Developed a full-stack collaborative platform connecting 500+ students for study groups, featuring live chat and schedule matching.',
      },
      {
        id: 'proj_2',
        projectName: 'Algorithmic Visualizer',
        role: 'Solo Developer',
        technologies: 'JavaScript, HTML5 Canvas, CSS3',
        projectUrl: 'https://samchen.dev/algo-viz',
        description: 'Built an interactive tool visualizing pathfinding and sorting algorithms with adjustable speeds and custom graph inputs.',
      },
    ];
    resume.skills = [
      { id: 'sk_1', name: 'Python', category: 'technical', level: 'Advanced' },
      { id: 'sk_2', name: 'Java', category: 'technical', level: 'Advanced' },
      { id: 'sk_3', name: 'JavaScript (React)', category: 'technical', level: 'Intermediate' },
      { id: 'sk_4', name: 'Data Structures & Algorithms', category: 'technical', level: 'Advanced' },
      { id: 'sk_5', name: 'SQL / PostgreSQL', category: 'technical', level: 'Intermediate' },
      { id: 'sk_6', name: 'Git & Linux', category: 'tools', level: 'Intermediate' },
      { id: 'sk_7', name: 'Fast Learner & Adaptability', category: 'soft', level: 'Expert' },
      { id: 'sk_8', name: 'Team Collaboration', category: 'soft', level: 'Advanced' },
    ];
    resume.certifications = [
      { id: 'cert_1', name: 'CS50x: Introduction to Computer Science', issuer: 'Harvard Online', issueDate: '2023', credentialUrl: '' },
    ];
    resume.achievements = [
      { id: 'ach_1', title: 'Presidential Academic Scholar', description: 'Awarded full academic merit scholarship for four consecutive years.', date: '2020-2024' },
    ];
    resume.languages = [
      { id: 'lang_1', language: 'English', proficiency: 'Native' },
      { id: 'lang_2', language: 'Mandarin', proficiency: 'Fluent' },
    ];
    resume.atsScore = 88;
    resume.resumeScore = 90;
    resume.completionPercentage = 90;
  }

  return resume;
}

export function createSampleBiodata() {
  return {
    id: `bio_${Date.now()}`,
    resumeName: 'Personal Biodata',
    documentType: 'biodata',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName: 'Rahul Sharma',
      professionalTitle: 'Senior Software Engineer',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      location: 'Bangalore, Karnataka, India',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      photoShape: 'circle',
    },
    biodataDetails: {
      dob: '15 August 1996',
      timeOfBirth: '07:30 AM',
      placeOfBirth: 'Mumbai, Maharashtra',
      height: "5' 11\" (180 cm)",
      complexion: 'Fair',
      bloodGroup: 'B+ Positive',
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: 'Brahmin',
      subCaste: 'Gaur',
      gothra: 'Kashyap',
      rashi: 'Leo (Simha)',
      nakshatra: 'Magha',
      manglik: 'No',
      languagesKnown: 'English, Hindi, Marathi, Gujarati',
      educationSummary: 'B.Tech in Computer Science from NIT Trichy (2018)',
      occupation: 'Lead Frontend Engineer at Global Tech Corp',
      annualIncome: '₹ 28,00,000 Per Annum',
      workLocation: 'Bangalore, India (Hybrid)',
      fatherName: 'Mr. Ramesh Sharma (Retired Bank Manager)',
      motherName: 'Mrs. Sunita Sharma (Homemaker)',
      brothers: '1 Elder Brother (Married, Product Manager in USA)',
      sisters: '1 Younger Sister (Pursuing M.Tech)',
      familyType: 'Nuclear / Modern Traditional',
      familyValues: 'Moderate / Blend of modern & traditional values',
      nativePlace: 'Jaipur, Rajasthan',
      residentialAddress: '402, Greenfield Meadows, HSR Layout, Sector 2, Bangalore - 560102',
      hobbies: 'Cricket, Reading Sci-Fi, Playing Guitar, Weekend Trekking',
      diet: 'Vegetarian',
      lifestyle: 'Non-smoker, Non-drinker',
      contactPerson: 'Mr. Ramesh Sharma (Father) - +91 98765 00000',
    },
    template: {
      templateId: 'biodata_modern',
      accentColor: '#F97316',
      font: 'Outfit',
    }
  };
}
