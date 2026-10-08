/**
 * PDF Export Service
 * Generates pixel-perfect A4 PDF documents from the resume DOM preview.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { activityLogger, LOG_EVENTS } from '../logging/ActivityLoggerService';

export const pdfService = {
  async exportToPdf(elementId = 'resume-preview-container', filename = 'Resume.pdf', resumeId = null) {
    activityLogger.log(LOG_EVENTS.PDF_EXPORT_STARTED, {
      resumeId,
      format: 'PDF',
      pageSize: 'A4',
    });

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Resume preview element #${elementId} not found.`);
    }

    // Save original styles for restoration
    const originalTransform = element.style.transform;
    element.style.transform = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Retina quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, // Standard A4 at 96 DPI
      });

      element.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;

      let position = 0;
      let heightLeft = totalPdfHeight;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Handle multi-page if resume content overflows A4 height
      while (heightLeft > 5) {
        position = -(totalPdfHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);

      activityLogger.log(LOG_EVENTS.PDF_EXPORT_COMPLETED, {
        resumeId,
        format: 'PDF',
        pageSize: 'A4',
      });

      return true;
    } catch (err) {
      element.style.transform = originalTransform;
      console.error('PDF Generation Error:', err);
      throw err;
    }
  },
};
