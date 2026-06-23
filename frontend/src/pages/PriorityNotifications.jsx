import React, { useMemo } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import { usePriorityNotifications } from '../hooks/usePriorityNotifications';
import { useViewedNotifications } from '../hooks/useViewedNotifications';
import NotificationList from '../components/NotificationList';
import FilterBar from '../components/FilterBar';
import TopNSelector from '../components/TopNSelector';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const PriorityNotifications = () => {
  const { notifications, loading, error, refetch } = useNotifications();
  const { markAsViewed, isViewed, viewedIds } = useViewedNotifications();
  const {
    topN,
    setTopN,
    typeFilter,
    setTypeFilter,
    priorityNotifications,
    topNOptions,
  } = usePriorityNotifications(notifications);

  const handleCardClick = (notification) => {
    if (!isViewed(notification.ID)) {
      markAsViewed(notification.ID);
    }
  };

  const viewedCount = priorityNotifications.filter((n) => isViewed(n.ID)).length;
  const unreadCount = priorityNotifications.length - viewedCount;

  if (loading) return <LoadingState message="Computing priority notifications..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Priority Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {unreadCount} unread
        </Typography>
      </Box>

      <FilterBar typeFilter={typeFilter} onFilterChange={setTypeFilter} />
      <TopNSelector topN={topN} onTopNChange={setTopN} options={topNOptions} />

      {priorityNotifications.length === 0 ? (
        <EmptyState title="No priority notifications match your filter" />
      ) : (
        <NotificationList
          notifications={priorityNotifications}
          onCardClick={handleCardClick}
          viewedIds={viewedIds}
          emptyMessage="No priority notifications available"
        />
      )}
    </Container>
  );
};

export default PriorityNotifications;
