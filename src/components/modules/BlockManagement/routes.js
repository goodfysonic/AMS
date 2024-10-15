import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlockList from './BlockList';  // Trang danh sách các Block
import BlockForm from './BlockForm';  // Trang form để thêm mới Block
import BlockSavePage from './BlockSavePage';  // Trang edit Block
import Sidebar from '../../commons/SideBar'; 
import Footer from '../../commons/Footer'; 

const BlockRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<BlockList />} />
            <Route path="/new" element={<BlockForm />} />
            <Route path="/edit/:id" element={<BlockSavePage />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlockRoutes;
