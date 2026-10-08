import React from 'react';
import ModernTemplate from './ModernTemplate';
import { Mail, Phone, MapPin, Globe, Award, CheckCircle } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../common/BrandIcons';

// 1. Classic Corporate Template
export function ClassicTemplate({ resume }) {
  if (!resume) return null;
  const p = resume.personalInfo || {};
  const accent = resume.template?.accentColor || '#171717';

  return (
    <div className="p-8 sm:p-12 space-y-6 text-neutral-900 font-serif leading-relaxed bg-white min-h-[297mm]">
      <div className="text-center border-b pb-4 space-y-1" style={{ borderColor: '#d4d4d4' }}>
        <h1 className="text-3xl font-bold tracking-wide uppercase">{p.fullName || 'Full Name'}</h1>
        {p.professionalTitle && (
          <p className="text-sm font-sans uppercase tracking-widest text-neutral-600">
            {p.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-xs font-sans text-neutral-600 pt-2">
          {[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).join('  |  ')}
        </div>
      </div>

      {resume.summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-300 pb-0.5 font-sans">
            Professional Summary
          </h2>
          <p className="text-xs text-neutral-800 font-sans leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {(resume.experience || []).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-300 pb-0.5 font-sans">
            Work Experience
          </h2>
          <div className="space-y-4 font-sans">
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-bold text-xs text-neutral-900">
                  <span>{exp.jobTitle} — {exp.company}</span>
                  <span className="font-normal text-neutral-600">{exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <p className="text-[11px] text-neutral-500 italic">{exp.location}</p>}
                {exp.description && (
                  <p className="text-xs text-neutral-700 whitespace-pre-line pt-0.5 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(resume.education || []).length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-300 pb-0.5 font-sans">
            Education
          </h2>
          <div className="space-y-2 font-sans">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold">{edu.degree}</span>, {edu.institution} {edu.grade ? `(${edu.grade})` : ''}
                </div>
                <span className="text-neutral-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(resume.skills || []).length > 0 && (
        <div className="space-y-1 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-300 pb-0.5">
            Skills & Competencies
          </h2>
          <p className="text-xs text-neutral-800">
            {resume.skills.map((s) => (typeof s === 'string' ? s : s.name)).join(' • ')}
          </p>
        </div>
      )}

      {(resume.projects || []).length > 0 && (
        <div className="space-y-2 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800 border-b border-neutral-300 pb-0.5">
            Projects
          </h2>
          <div className="space-y-2">
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <span className="font-bold">{proj.projectName}</span> {proj.technologies ? `(${proj.technologies})` : ''}
                {proj.description && <p className="text-neutral-700 pt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Creative Studio Two-Column Template
export function CreativeTemplate({ resume }) {
  if (!resume) return null;
  const p = resume.personalInfo || {};
  const accent = resume.template?.accentColor || '#F97316';

  return (
    <div className="grid grid-cols-12 min-h-[297mm] text-neutral-800 font-sans bg-white">
      {/* Left Sidebar (4 cols) */}
      <div className="col-span-4 p-6 bg-orange-50/50 space-y-6 border-r border-orange-100">
        <div className="space-y-3 text-center">
          {p.photo && (
            <img
              src={p.photo}
              alt={p.fullName}
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 shadow-sm"
              style={{ borderColor: accent }}
            />
          )}
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 font-heading">{p.fullName || 'Name'}</h1>
            <p className="text-xs font-semibold" style={{ color: accent }}>{p.professionalTitle}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Contact</h3>
          {p.email && <div className="break-words">{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div className="break-all">{p.linkedin.replace(/^https?:\/\//, '')}</div>}
          {p.website && <div className="break-all">{p.website.replace(/^https?:\/\//, '')}</div>}
        </div>

        {/* Skills */}
        {(resume.skills || []).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Core Skills</h3>
            <div className="flex flex-wrap gap-1">
              {resume.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded bg-white text-neutral-800 font-medium border border-orange-200"
                >
                  {typeof s === 'string' ? s : s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {(resume.languages || []).length > 0 && (
          <div className="space-y-1 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Languages</h3>
            {resume.languages.map((l, i) => (
              <div key={i} className="text-neutral-700">{l.language} ({l.proficiency})</div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content (8 cols) */}
      <div className="col-span-8 p-6 sm:p-8 space-y-5">
        {resume.summary && (
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b" style={{ borderColor: accent }}>
              Profile
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {(resume.experience || []).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b" style={{ borderColor: accent }}>
              Experience
            </h3>
            <div className="space-y-3">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="space-y-0.5 text-xs">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>{exp.jobTitle} — {exp.company}</span>
                    <span className="font-normal text-neutral-500">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.description && <p className="text-neutral-600 whitespace-pre-line leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {(resume.education || []).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b" style={{ borderColor: accent }}>
              Education
            </h3>
            <div className="space-y-2 text-xs">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <span className="font-bold">{edu.degree}</span>, {edu.institution}
                  </div>
                  <span className="text-neutral-500">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(resume.projects || []).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b" style={{ borderColor: accent }}>
              Projects
            </h3>
            <div className="space-y-2 text-xs">
              {resume.projects.map((proj, idx) => (
                <div key={idx}>
                  <span className="font-bold">{proj.projectName}</span>
                  {proj.description && <p className="text-neutral-600">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. Developer Terminal Template
export function DeveloperTemplate({ resume }) {
  if (!resume) return null;
  const p = resume.personalInfo || {};
  const accent = resume.template?.accentColor || '#EA580C';

  return (
    <div className="p-8 space-y-5 font-mono text-neutral-900 bg-white min-h-[297mm]">
      {/* Dev Header */}
      <div className="border-b-2 border-neutral-900 pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-600 font-bold">$ whoami</span>
            <h1 className="text-3xl font-bold font-sans tracking-tight">{p.fullName || 'Developer'}</h1>
            <p className="text-sm font-semibold" style={{ color: accent }}>{`> ${p.professionalTitle || 'Software Engineer'}`}</p>
          </div>
          {p.photo && (
            <img src={p.photo} alt={p.fullName} className="w-20 h-20 rounded-xl object-cover border-2 border-neutral-900" />
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-neutral-600 pt-2 font-sans">
          {[p.email, p.phone, p.location, p.github, p.linkedin, p.website].filter(Boolean).map((item, i) => (
            <span key={i} className="bg-neutral-100 px-2 py-0.5 rounded text-[11px]">{item}</span>
          ))}
        </div>
      </div>

      {resume.summary && (
        <div className="space-y-1 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">// README.md</h3>
          <p className="text-xs text-neutral-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {(resume.skills || []).length > 0 && (
        <div className="space-y-1.5 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">// STACK & SKILLS</h3>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-neutral-900 text-white rounded font-mono text-[11px]">
                {typeof s === 'string' ? s : s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {(resume.experience || []).length > 0 && (
        <div className="space-y-3 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">// EXPERIENCE</h3>
          <div className="space-y-3">
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-brand-500 pl-3 space-y-1">
                <div className="flex justify-between font-bold text-xs text-neutral-900">
                  <span>{exp.jobTitle} @ {exp.company}</span>
                  <span className="font-mono text-[11px] text-neutral-500">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {(resume.projects || []).length > 0 && (
        <div className="space-y-2 font-sans">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">// REPOSITORIES & PROJECTS</h3>
          <div className="grid grid-cols-1 gap-2">
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                <div className="flex justify-between font-bold">
                  <span>{proj.projectName}</span>
                  {proj.projectUrl && <span className="text-brand-600 font-mono text-[10px]">{proj.projectUrl}</span>}
                </div>
                {proj.technologies && <p className="text-[10px] text-neutral-500 font-mono">Tech: {proj.technologies}</p>}
                {proj.description && <p className="text-neutral-700 pt-1">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Biodata Template (Traditional & Modern)
export function BiodataTemplate({ resume }) {
  if (!resume) return null;
  const p = resume.personalInfo || {};
  const b = resume.biodataDetails || {};
  const accent = resume.template?.accentColor || '#F97316';

  return (
    <div className="p-8 sm:p-10 space-y-6 text-neutral-800 font-sans bg-white min-h-[297mm] border-8 border-orange-100 rounded-xl">
      <div className="text-center border-b-2 pb-4 space-y-1" style={{ borderColor: accent }}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600">॥ श्री गणेशाय नमः ॥</h3>
        <h1 className="text-3xl font-bold font-heading text-neutral-900">{p.fullName || 'Biodata Profile'}</h1>
        <p className="text-xs text-neutral-500">{b.occupation || p.professionalTitle}</p>
      </div>

      <div className="flex items-center justify-center">
        {p.photo && (
          <img
            src={p.photo}
            alt={p.fullName}
            className="w-28 h-28 rounded-full object-cover border-4 shadow-sm"
            style={{ borderColor: accent }}
          />
        )}
      </div>

      {/* Personal & Astrological Details Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-orange-50 p-2 rounded-lg">
          Personal & Astrological Details
        </h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
          <div><span className="font-semibold text-neutral-600">Date of Birth:</span> {b.dob || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Time / Place:</span> {b.timeOfBirth || '—'}, {b.placeOfBirth || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Height / Complexion:</span> {b.height || '—'}, {b.complexion || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Blood Group:</span> {b.bloodGroup || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Religion / Caste:</span> {b.religion || '—'} - {b.caste || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Rashi / Nakshatra:</span> {b.rashi || '—'} / {b.nakshatra || '—'}</div>
        </div>
      </div>

      {/* Education & Career Details */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-orange-50 p-2 rounded-lg">
          Education & Career
        </h3>
        <div className="grid grid-cols-1 gap-y-1.5 text-xs">
          <div><span className="font-semibold text-neutral-600">Education:</span> {b.educationSummary || 'Degree'}</div>
          <div><span className="font-semibold text-neutral-600">Occupation:</span> {b.occupation || 'Professional Role'}</div>
          <div><span className="font-semibold text-neutral-600">Annual Income:</span> {b.annualIncome || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Work Location:</span> {b.workLocation || p.location || '—'}</div>
        </div>
      </div>

      {/* Family Details */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-orange-50 p-2 rounded-lg">
          Family Background
        </h3>
        <div className="grid grid-cols-1 gap-y-1.5 text-xs">
          <div><span className="font-semibold text-neutral-600">Father's Details:</span> {b.fatherName || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Mother's Details:</span> {b.motherName || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Brothers / Sisters:</span> {b.brothers || '—'} | {b.sisters || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Native Place:</span> {b.nativePlace || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Residential Address:</span> {b.residentialAddress || '—'}</div>
          <div><span className="font-semibold text-neutral-600">Contact Person:</span> {b.contactPerson || p.phone || '—'}</div>
        </div>
      </div>
    </div>
  );
}

// Master Template Switcher
export default function MasterTemplateRenderer({ resume }) {
  if (!resume) return null;
  const templateId = resume.template?.templateId || 'modern';

  switch (templateId) {
    case 'classic':
    case 'ats_friendly':
    case 'minimal':
    case 'academic':
      return <ClassicTemplate resume={resume} />;
    case 'creative':
    case 'professional':
    case 'executive':
      return <CreativeTemplate resume={resume} />;
    case 'developer':
      return <DeveloperTemplate resume={resume} />;
    case 'biodata_modern':
    case 'biodata_traditional':
      return <BiodataTemplate resume={resume} />;
    case 'modern':
    case 'student':
    default:
      return <ModernTemplate resume={resume} />;
  }
}
