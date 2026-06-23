import { useState, useMemo } from 'react';
import { getTopKNotifications, filterNotifications } from '../services/notificationService';
import { TOP_N_OPTIONS } from '../utils/constants';
import { logger } from '../middleware/logger';

export const usePriorityNotifications = (notifications) => {
  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');

  const priorityNotifications = useMemo(() => {
    const topK = getTopKNotifications(notifications, topN);
    return filterNotifications(topK, typeFilter);
  }, [notifications, topN, typeFilter]);

  const handleTopNChange = (newTopN) => {
    setTopN(newTopN);
    logger.info('Top N selection changed', { topN: newTopN });
  };

  const handleTypeFilterChange = (newFilter) => {
    setTypeFilter(newFilter);
    logger.info('Type filter changed', { type: newFilter });
  };

  return {
    topN,
    setTopN: handleTopNChange,
    typeFilter,
    setTypeFilter: handleTypeFilterChange,
    priorityNotifications,
    topNOptions: TOP_N_OPTIONS,
  };
};
