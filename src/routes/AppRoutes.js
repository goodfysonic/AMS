import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlockList from '../components/modules/BlockManagement/BlockList';
import BlockRoutes from '../components/modules/BlockManagement/routes';
import InvoiceRoutes from '../components/modules/InvoiceManagement/routes';
import ApartmentRoutes from '../components/modules/ApartmentManagement/routes';
import Sidebar from '../components/commons/SideBar'; 
import Footer from '../components/commons/Footer'; 
import ApartmentList from '../components/modules/ApartmentManagement/ApartmentList';

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden"> 
        <Sidebar />  
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto"> 
          <Routes>
            <Route path="/" element={<BlockList />} />
            <Route path="/blocks/*" element={<BlockRoutes />} />
            <Route path="/floors/:floorId/apartments/*" element={<ApartmentList />} />
            <Route path="/invoices/*" element={<InvoiceRoutes />} />
          </Routes>
        </div>
      </div>
      <Footer />  
    </div>
  );
};

export default AppRoutes;
