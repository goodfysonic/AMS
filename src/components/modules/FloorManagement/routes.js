import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FloorList from './FloorList';
import FloorSavePage from './FloorSavePage';
import Sidebar from '../../commons/SideBar'; 
import Footer from '../../commons/Footer'; 


const FloorRoutes = () => {
    return (
        <div className="flex flex-col h-screen">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
    
            {/* Main Content */}
            <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
              <Routes>
                <Route path="/blocks/:blockId/floors" element={<FloorList />} />
                <Route path="/blocks/:blockId/floors/new" element={<FloorSavePage />} />
                <Route path="/blocks/:blockId/floors/edit/:floorId" element={<FloorSavePage />} />
              </Routes>
            </div>
          </div>
    
          {/* Footer */}
          <Footer />
        </div>
      );
    };

export default FloorRoutes;
