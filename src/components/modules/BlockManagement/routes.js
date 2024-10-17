import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlockList from './BlockList';  
import BlockSavePage from './BlockSavePage';  // Dùng BlockSavePage cho cả thêm mới và chỉnh sửa
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
            <Route path="/new" element={<BlockSavePage />} />  {/* Đường dẫn thêm mới */}
            <Route path="/edit/:blockId" element={<BlockSavePage />} />  {/* Đường dẫn chỉnh sửa với blockId */}
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlockRoutes;
