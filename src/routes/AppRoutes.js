import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlockList from '../components/modules/BlockManagement/BlockList';
import BlockRoutes from '../components/modules/BlockManagement/routes';
import InvoiceRoutes from '../components/modules/InvoiceManagement/routes';
import ServiceRoutes from '../components/modules/ServiceManagement/routes';
import ContractRoutes from '../components/modules/ContractManagement/routes';
import Profile from '../components/modules/AccountManagement/Profile';
import UserRoutes from '../components/modules/AccountManagement/UserManagement/routes';
import OwnerRoutes from '../components/modules/ResidentManagement/OwnerManagement/routes';
import RenterRoutes from '../components/modules/ResidentManagement/RenterManagement/routes';
import HouseholdRoutes from '../components/modules/ResidentManagement/HouseholdManagement/routes';
import Sidebar from '../components/commons/SideBar'; 
import Footer from '../components/commons/Footer'; 
import Header from '../components/commons/Header';

const AppRoutes = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full h-16 bg-blue-600 text-white shadow-md z-30">
        <Header />
      </header>

      <div className="flex flex-grow pt-16">
        <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem-5rem)] bg-white shadow-lg z-20 overflow-y-auto scrollbar-hide">
          <Sidebar />
        </aside>

        <main className="flex-1 ml-72 p-6 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<BlockList />} />
              <Route path="/blocks/*" element={<BlockRoutes />} />
              <Route path="/invoices/*" element={<InvoiceRoutes />} />
              <Route path="/services/*" element={<ServiceRoutes />} />
              <Route path="/contracts/*" element={<ContractRoutes />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/users/*" element={<UserRoutes />} />
              <Route path="/residents/owners/*" element={<OwnerRoutes />} />
              <Route path="/residents/renters/*" element={<RenterRoutes />} />
              <Route path="/residents/households/*" element={<HouseholdRoutes />} />
            </Routes>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 w-full h-20 bg-blue-600 text-white shadow-lg z-30 border-t-4 border-blue-700">
        <div className="h-full bg-gradient-to-b from-blue-600 to-blue-700">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default AppRoutes;
