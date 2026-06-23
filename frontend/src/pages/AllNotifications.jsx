import React, { useCallback, useMemo } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import { useViewedNotifications } from '../hooks/useViewedNotifications';
import NotificationList from '../components/NotificationList';
import FilterBar from '../components/FilterBar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const AllNotifications = () => {
  const { notifications, loading, error, refetch } = useNotifications();
  const { markAsViewed, isViewed, viewedIds } = useViewedNotifications();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = React.useState('All');

  const filteredNotifications = useMemo(() => {
    if (typeFilter === 'All') return notifications;
    return notifications.filter((n) => n.Type === typeFilter);
  }, [notifications, typeFilter]);

  const handleCardClick = useCallback((notification) => {
    if (!isViewed(notification.ID)) {
      markAsViewed(notification.ID);
    }
    navigate('/priority');
  }, [markAsViewed, isViewed, navigate]);

  const viewedCount = filteredNotifications.filter((n) => isViewed(n.ID)).length;
  const unreadCount = filteredNotifications.length - viewedCount;

  if (loading) return <LoadingState message="Loading all notifications..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          All Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {unreadCount} unread
        </Typography>
      </Box>

      <FilterBar typeFilter={typeFilter} onFilterChange={setTypeFilter} />

      {filteredNotifications.length === 0 ? (
        <EmptyState title="No notifications match your filter" />
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          onCardClick={handleCardClick}
          viewedIds={viewedIds}
          emptyMessage="No notifications available"
        />
      )}
    </Container>
  );
};

export default AllNotifications;
