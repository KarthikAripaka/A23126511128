import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ title = 'No notifications found', description = 'Try adjusting your filters' }) => {
  return (
    <Box textAlign="center" py={8}>
      <Box fontSize={64} mb={2}>🔍</Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default EmptyState;
