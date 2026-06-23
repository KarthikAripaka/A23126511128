import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import AllNotifications from '../pages/AllNotifications';
import PriorityNotifications from '../pages/PriorityNotifications';

const AppRoutes = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/all" element={<AllNotifications />} />
        <Route path="/priority" element={<PriorityNotifications />} />
        <Route path="*" element={<Navigate to="/all" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
