import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContractList from './ContractList';
import ContractSavePage from './ContractSavePage';

const ContractRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ContractList />} />
            <Route path="/new" element={<ContractSavePage />} />
            <Route path="/edit/:contractId" element={<ContractSavePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ContractRoutes;
