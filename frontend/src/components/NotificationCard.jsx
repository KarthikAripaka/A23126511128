import React from 'react';
import { Card, CardContent, Chip, Badge, Typography, Box } from '@mui/material';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const NotificationCard = ({ notification, isUnread, onClick }) => {
  const typeConfig = NOTIFICATION_TYPES[notification.Type] || { label: 'Unknown', color: 'default' };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        backgroundColor: isUnread ? 'action.hover' : 'background.paper',
        borderLeft: isUnread ? '4px solid' : '4px solid transparent',
        borderColor: isUnread ? 'primary.main' : 'transparent',
      }}
      onClick={() => onClick(notification)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip
            label={typeConfig.label}
            color={typeConfig.color}
            size="small"
            variant="outlined"
          />
          {isUnread && (
            <Badge color="primary" variant="dot" />
          )}
        </Box>

        <Typography variant="body1" fontWeight={isUnread ? 600 : 400} gutterBottom>
          {notification.Message}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {new Date(notification.Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
