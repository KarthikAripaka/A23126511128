import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

const FilterBar = ({ typeFilter, onFilterChange, options = ['All', 'Placement', 'Result', 'Event'] }) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <Typography variant="body2" fontWeight={600} color="text.secondary">
        Filter:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="type-filter-label">Notification Type</InputLabel>
        <Select
          labelId="type-filter-label"
          value={typeFilter}
          label="Notification Type"
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
