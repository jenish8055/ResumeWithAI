/**
 * DOCX Word Export Service
 * Generates structured .docx Word documents preserving headings, bullets, and section styling.
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { activityLogger, LOG_EVENTS } from '../logging/ActivityLoggerService';

export const docxService = {
  async exportToDocx(resume, filename = 'Resume.docx') {
    activityLogger.log(LOG_EVENTS.WORD_EXPORT_STARTED, {
      resumeId: resume.id,
      format: 'DOCX',
    });

    const p = resume.personalInfo || {};
    const sections = [];

    // Header: Name & Contact Info
    sections.push(
      new Paragraph({
        text: p.fullName || 'Untitled Resume',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      })
    );

    if (p.professionalTitle) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p.professionalTitle,
              bold: true,
              size: 24,
              color: '404040',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      );
    }

    const contactItems = [p.email, p.phone, p.location, p.linkedin, p.website, p.github]
      .filter(Boolean)
      .join('  |  ');

    if (contactItems) {
      sections.push(
        new Paragraph({
          text: contactItems,
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        })
      );
    }

    // Professional Summary
    if (resume.summary) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        })
      );
      sections.push(
        new Paragraph({
          text: resume.summary,
          spacing: { after: 200 },
        })
      );
    }

    // Work Experience
    const expList = Array.isArray(resume.experience) ? resume.experience : [];
    if (expList.length > 0) {
      sections.push(
        new Paragraph({
          text: 'WORK EXPERIENCE',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        })
      );

      expList.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.jobTitle || 'Role', bold: true }),
              new TextRun({ text: ` — ${exp.company || 'Company'}` }),
              new TextRun({
                text: ` (${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''})`,
                italics: true,
              }),
            ],
            spacing: { before: 100, after: 60 },
          })
        );

        if (exp.location) {
          sections.push(
            new Paragraph({
              text: exp.location,
              italics: true,
              spacing: { after: 60 },
            })
          );
        }

        if (exp.description) {
          const lines = exp.description.split('\n').filter(Boolean);
          lines.forEach((line) => {
            sections.push(
              new Paragraph({
                text: line.replace(/^[-*•\d.]+\s*/, ''),
                bullet: { level: 0 },
                spacing: { after: 40 },
              })
            );
          });
        }
      });
    }

    // Education
    const eduList = Array.isArray(resume.education) ? resume.education : [];
    if (eduList.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        })
      );

      eduList.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree || 'Degree', bold: true }),
              new TextRun({ text: ` — ${edu.institution || 'Institution'}` }),
              new TextRun({
                text: ` (${edu.startDate || ''} - ${edu.endDate || ''})`,
                italics: true,
              }),
            ],
            spacing: { before: 100, after: 60 },
          })
        );
        if (edu.grade) {
          sections.push(
            new Paragraph({
              text: `Grade / GPA: ${edu.grade}`,
              spacing: { after: 60 },
            })
          );
        }
      });
    }

    // Skills
    const skillList = Array.isArray(resume.skills) ? resume.skills : [];
    if (skillList.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS & COMPETENCIES',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        })
      );

      const skillString = skillList.map((s) => (typeof s === 'string' ? s : s.name)).join(', ');
      sections.push(
        new Paragraph({
          text: skillString,
          spacing: { after: 200 },
        })
      );
    }

    // Projects
    const projList = Array.isArray(resume.projects) ? resume.projects : [];
    if (projList.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        })
      );

      projList.forEach((proj) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.projectName || 'Project', bold: true }),
              proj.technologies ? new TextRun({ text: ` | Technologies: ${proj.technologies}`, italics: true }) : new TextRun(''),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        if (proj.description) {
          sections.push(
            new Paragraph({
              text: proj.description,
              spacing: { after: 60 },
            })
          );
        }
      });
    }

    // Create Document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                bottom: 720,
                left: 720,
                right: 720,
              },
            },
          },
          children: sections,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);

    activityLogger.log(LOG_EVENTS.WORD_EXPORT_COMPLETED, {
      resumeId: resume.id,
      format: 'DOCX',
    });

    return true;
  },
};
