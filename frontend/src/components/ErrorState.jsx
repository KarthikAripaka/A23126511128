import React from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';

const ErrorState = ({ error, onRetry }) => {
  return (
    <Box textAlign="center" py={8}>
      <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
        {error || 'An unexpected error occurred'}
      </Alert>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
