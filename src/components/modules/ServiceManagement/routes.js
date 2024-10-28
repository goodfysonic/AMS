import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServiceList from './ServiceList';
import ServiceSavePage from './ServiceSavePage';

const ServiceRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ServiceList />} />
            <Route path="/new" element={<ServiceSavePage />} />
            <Route path="/edit/:serviceId" element={<ServiceSavePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ServiceRoutes;
