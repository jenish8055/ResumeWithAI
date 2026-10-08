/**
 * Analytics Service (Local-only, privacy preserving)
 * Interfaces with ActivityLoggerService to guarantee zero tracking external transmissions.
 */

import { activityLogger } from './logging/ActivityLoggerService';

export const analyticsService = {
  trackEvent(eventName, payload = {}) {
    activityLogger.log(eventName, payload);
  },

  trackPageView(pageName) {
    activityLogger.log('PAGE_VIEWED', { metadata: { page: pageName } });
  },
};
