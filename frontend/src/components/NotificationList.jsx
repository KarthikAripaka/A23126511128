import React from 'react';
import { Box } from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationList = ({ notifications, onCardClick, viewedIds = [], emptyMessage = 'No notifications to display' }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Box fontSize={64} mb={2}>📭</Box>
        <Box color="text.secondary">{emptyMessage}</Box>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          isUnread={!viewedIds.includes(notification.ID)}
          onClick={onCardClick}
        />
      ))}
    </Box>
  );
};

export default NotificationList;
