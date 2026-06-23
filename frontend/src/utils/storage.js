import { STORAGE_KEYS } from './constants';
import { logger } from '../middleware/logger';

export const storage = {
  getViewedNotifications: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIEWED_NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error('Failed to read localStorage', { error: error.message });
      return [];
    }
  },

  markAsViewed: (id) => {
    try {
      const viewed = storage.getViewedNotifications();
      if (!viewed.includes(id)) {
        viewed.push(id);
        localStorage.setItem(STORAGE_KEYS.VIEWED_NOTIFICATIONS, JSON.stringify(viewed));
      }
      return viewed;
    } catch (error) {
      logger.error('Failed to write localStorage', { error: error.message });
      return [];
    }
  },

  isViewed: (id) => {
    const viewed = storage.getViewedNotifications();
    return viewed.includes(id);
  },
};
