/**
 * Log Exporter Service
 * Exports the activity log to a human-readable .txt file.
 * Supports File System Access API with user permission or standard blob download fallback.
 */

import { activityLogger } from './ActivityLoggerService';

export const logExporter = {
  async exportTxtFile() {
    const txtContent = await activityLogger.generateTxtLog();
    const filename = 'resumewithai-activity-log.txt';

    // Try File System Access API if supported
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'Text Documents (*.txt)',
              accept: { 'text/plain': ['.txt'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(txtContent);
        await writable.close();
        return { success: true, method: 'file_system_api' };
      } catch (err) {
        // User aborted picker or denied, fallback to download if not user cancel
        if (err.name === 'AbortError') {
          return { success: false, aborted: true };
        }
        console.warn('File System Access API failed, falling back to Blob download:', err);
      }
    }

    // Standard Blob Download Fallback
    try {
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true, method: 'blob_download' };
    } catch (err) {
      console.error('Blob export error:', err);
      throw new Error('Failed to download activity log file.');
    }
  },
};
