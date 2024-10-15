import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from '../components/HomePage';
import ApartmentRoutes from '../components/modules/ApartmentManagement/routes';
import BlockRoutes from '../components/modules/BlockManagement/routes';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu không có token thì điều hướng về trang login
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Điều hướng tới trang login
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apartments/*" element={<ApartmentRoutes />} /> 
      <Route path="/blocks/*" element={<BlockRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
