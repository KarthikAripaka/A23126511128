import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/all', label: 'All Notifications', icon: <NotificationsIcon /> },
    { path: '/priority', label: 'Priority Notifications', icon: <PriorityHighIcon /> },
  ];

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Campus Notifications
        </Typography>
        <Box display="flex" gap={1}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color={location.pathname === item.path ? 'secondary' : 'inherit'}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
