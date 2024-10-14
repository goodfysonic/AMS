import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../components/HomePage';
import ApartmentRoutes from '../components/modules/ApartmentManagement/routes';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apartments/*" element={<ApartmentRoutes />} /> {/* Module Apartment Management */}

    </Routes>
  );
};

export default AppRoutes;
