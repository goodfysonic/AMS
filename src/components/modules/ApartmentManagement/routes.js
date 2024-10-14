import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ApartmentList from './ApartmentList';
import ApartmentForm from './ApartmentForm';
import ApartmentSavePage from './ApartmentSavePage';
import Sidebar from '../../commons/SideBar'; 
import Footer from '../../commons/Footer'; 

const ApartmentRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ApartmentList />} />
            <Route path="/new" element={<ApartmentForm />} />
            <Route path="/edit/:id" element={<ApartmentSavePage />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ApartmentRoutes;
