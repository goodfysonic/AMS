import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvoiceList from './InvoiceList'; 
import InvoiceSavePage from './InvoiceSavePage'; 

const InvoiceRoutes = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/new" element={<InvoiceSavePage />} />
            <Route path="/edit/:invoiceId" element={<InvoiceSavePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InvoiceRoutes;
