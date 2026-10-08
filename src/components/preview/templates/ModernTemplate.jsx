import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../common/BrandIcons';

export default function ModernTemplate({ resume }) {
  if (!resume) return null;
  const p = resume.personalInfo || {};
  const accent = resume.template?.accentColor || '#F97316';
  const enabled = resume.enabledSections || {};
  const order = resume.sectionOrder || [];

  return (
    <div className="p-8 sm:p-10 space-y-6 text-neutral-800 leading-relaxed font-sans bg-white min-h-[297mm]">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 pb-6" style={{ borderColor: accent }}>
        <div className="space-y-1.5 flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-heading">
            {p.fullName || 'Your Full Name'}
          </h1>
          <p className="text-base sm:text-lg font-semibold" style={{ color: accent }}>
            {p.professionalTitle || 'Target Professional Title'}
          </p>

          <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-neutral-600 pt-2">
            {p.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                {p.email}
              </span>
            )}
            {p.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                {p.phone}
              </span>
            )}
            {p.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {p.location}
              </span>
            )}
            {p.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinIcon className="w-3.5 h-3.5 text-neutral-400" />
                {p.linkedin.replace(/^https?:\/\//, '')}
              </span>
            )}
            {p.github && (
              <span className="flex items-center gap-1">
                <GithubIcon className="w-3.5 h-3.5 text-neutral-400" />
                {p.github.replace(/^https?:\/\//, '')}
              </span>
            )}
            {p.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                {p.website.replace(/^https?:\/\//, '')}
              </span>
            )}
          </div>
        </div>

        {p.photo && p.photoShape !== 'none' && (
          <img
            src={p.photo}
            alt={p.fullName}
            className={`w-24 h-24 object-cover border-2 shadow-sm shrink-0 ml-4 ${
              p.photoShape === 'square' ? 'rounded-2xl' : 'rounded-full'
            }`}
            style={{ borderColor: accent }}
          />
        )}
      </div>

      {/* Dynamic Sections Based on Ordered Keys */}
      <div className="space-y-6">
        {order.map((sectionKey) => {
          if (enabled[sectionKey] === false) return null;

          // 1. Summary
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <div key="summary" className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Professional Summary
                </h3>
                <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                  {resume.summary}
                </p>
              </div>
            );
          }

          // 2. Experience
          if (sectionKey === 'experience' && (resume.experience || []).length > 0) {
            return (
              <div key="experience" className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {resume.experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-bold text-neutral-900">
                          {exp.jobTitle}{' '}
                          <span className="font-semibold text-neutral-600">| {exp.company}</span>
                        </h4>
                        <span className="text-[11px] font-medium text-neutral-500">
                          {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.location && (
                        <p className="text-[11px] text-neutral-400 italic">{exp.location}</p>
                      )}
                      {exp.description && (
                        <div className="text-xs text-neutral-700 leading-relaxed space-y-1 pt-1 whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 3. Education
          if (sectionKey === 'education' && (resume.education || []).length > 0) {
            return (
              <div key="education" className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Education
                </h3>
                <div className="space-y-3">
                  {resume.education.map((edu, idx) => (
                    <div key={edu.id || idx} className="space-y-0.5">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-bold text-neutral-900">
                          {edu.degree} <span className="font-semibold text-neutral-600">| {edu.institution}</span>
                        </h4>
                        <span className="text-[11px] font-medium text-neutral-500">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      {edu.grade && (
                        <p className="text-[11px] font-medium" style={{ color: accent }}>
                          Grade: {edu.grade}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-neutral-600 pt-0.5">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 4. Skills
          if (sectionKey === 'skills' && (resume.skills || []).length > 0) {
            return (
              <div key="skills" className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Skills & Core Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resume.skills.map((skill, idx) => {
                    const name = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium bg-neutral-100 text-neutral-800"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          }

          // 5. Projects
          if (sectionKey === 'projects' && (resume.projects || []).length > 0) {
            return (
              <div key="projects" className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Key Projects
                </h3>
                <div className="space-y-3">
                  {resume.projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-bold text-neutral-900">
                          {proj.projectName}{' '}
                          {proj.role && <span className="font-normal text-neutral-500">({proj.role})</span>}
                        </h4>
                        {proj.projectUrl && (
                          <span className="text-[11px] text-brand-600 underline">
                            {proj.projectUrl.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                      {proj.technologies && (
                        <p className="text-[11px] font-semibold text-neutral-500">
                          Technologies: {proj.technologies}
                        </p>
                      )}
                      {proj.description && (
                        <p className="text-xs text-neutral-700 leading-relaxed">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 6. Certifications
          if (sectionKey === 'certifications' && (resume.certifications || []).length > 0) {
            return (
              <div key="certifications" className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resume.certifications.map((c, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-bold text-neutral-900">{c.name}</span>
                      <span className="text-neutral-500"> — {c.issuer} ({c.issueDate})</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 7. Achievements
          if (sectionKey === 'achievements' && (resume.achievements || []).length > 0) {
            return (
              <div key="achievements" className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Achievements
                </h3>
                <div className="space-y-1">
                  {resume.achievements.map((a, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-bold text-neutral-900">{a.title}</span>
                      {a.description && <span className="text-neutral-600">: {a.description}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 8. Languages
          if (sectionKey === 'languages' && (resume.languages || []).length > 0) {
            return (
              <div key="languages" className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  Languages
                </h3>
                <p className="text-xs text-neutral-700">
                  {resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
                </p>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
