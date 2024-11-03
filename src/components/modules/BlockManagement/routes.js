import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlockList from './BlockList';
import BlockSavePage from './BlockSavePage';
import FloorSavePage from './FloorSavePage';
import ApartmentList from './ApartmentList';
import AddApartmentSavePage from './AddApartmentSavePage';  
import EditApartmentSavePage from './EditApartmentSavePage'; 

const BlockRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <div className="p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<BlockList />} />
            <Route path="/new" element={<BlockSavePage />} />
            <Route path="/edit/:blockId" element={<BlockSavePage />} />
            <Route path="/:blockId/floors/new" element={<FloorSavePage />} />
            <Route path="/:blockId/floors/edit/:floorId" element={<FloorSavePage />} />
            <Route path="/:blockId/floors/:floorId/apartments" element={<ApartmentList />} />
            <Route path="/:blockId/floors/:floorId/apartments/new" element={<AddApartmentSavePage />} />
            <Route path="/:blockId/floors/:floorId/apartments/:id/edit" element={<EditApartmentSavePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default BlockRoutes;
