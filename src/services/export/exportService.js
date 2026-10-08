/**
 * Unified Export Service Facade
 */

import { pdfService } from './pdfService';
import { docxService } from './docxService';
import { printService } from './printService';

export const exportService = {
  async downloadPdf(elementId, filename, resumeId) {
    return pdfService.exportToPdf(elementId, filename, resumeId);
  },

  async downloadDocx(resume, filename) {
    return docxService.exportToDocx(resume, filename);
  },

  print() {
    printService.printResume();
  },
};
