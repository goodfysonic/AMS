import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ApartmentList from './ApartmentList';  
import ApartmentSavePage from './ApartmentSavePage';

const ApartmentRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden"> 
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/floors/:floorId/apartments" element={<ApartmentList />} />
            <Route path="/apartments" element={<ApartmentSavePage />} />
            <Route path="/apartments/:id/edit" element={<ApartmentSavePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ApartmentRoutes;
