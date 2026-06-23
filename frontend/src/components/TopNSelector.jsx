import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const TopNSelector = ({ topN, onTopNChange, options = [10, 15, 20] }) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Typography variant="body2" fontWeight={600} color="text.secondary">
        Show Top:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel id="top-n-label">Top N</InputLabel>
        <Select
          labelId="top-n-label"
          value={topN}
          label="Top N"
          onChange={(e) => onTopNChange(Number(e.target.value))}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              Top {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TopNSelector;
