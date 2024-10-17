import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../components/HomePage';
import ApartmentRoutes from '../components/modules/ApartmentManagement/routes';
import BlockRoutes from '../components/modules/BlockManagement/routes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apartments/*" element={<ApartmentRoutes />} /> 
      <Route path="/blocks/*" element={<BlockRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
