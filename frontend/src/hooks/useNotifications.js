import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '../services/api';
import { logger } from '../middleware/logger';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      logger.info('Loading all notifications');
      const data = await fetchNotifications();
      const items = Array.isArray(data) ? data : data.notifications || [];
      setNotifications(items);
      logger.info('Notifications loaded', { count: items.length });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load notifications';
      setError(message);
      logger.error('Failed to load notifications', { error: message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return { notifications, loading, error, refetch: loadNotifications };
};
