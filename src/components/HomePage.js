import React from 'react';
import Sidebar from './commons/SideBar'; 
import ApartmentList from './modules/ApartmentManagement/ApartmentList';  
import Footer from '../components/commons/Footer';

const HomePage = ({ setIsAuthenticated }) => { // Nhận setIsAuthenticated từ props
  return (
    <div className="flex flex-col h-screen">

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <ApartmentList />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
