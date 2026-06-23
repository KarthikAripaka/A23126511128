import { useState, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { logger } from '../middleware/logger';

export const useViewedNotifications = () => {
  const [viewedIds, setViewedIds] = useState(() => storage.getViewedNotifications());

  const markAsViewed = useCallback((id) => {
    const updated = storage.markAsViewed(id);
    setViewedIds(updated);
    logger.info('Notification marked as viewed', { notificationId: id });
  }, []);

  const isViewed = useCallback((id) => {
    return viewedIds.includes(id);
  }, [viewedIds]);

  const clearViewed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.VIEWED_NOTIFICATIONS);
    setViewedIds([]);
    logger.info('Cleared all viewed notifications');
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.VIEWED_NOTIFICATIONS) {
        setViewedIds(storage.getViewedNotifications());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { viewedIds, markAsViewed, isViewed, clearViewed };
};
