import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({ message = 'Loading notifications...' }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
      <CircularProgress size={48} />
      <Typography variant="body2" color="text.secondary" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
