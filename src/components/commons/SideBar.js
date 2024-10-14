import React from 'react';
import { Home, FileText, Settings, Users, DollarSign, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md">
      <nav className="mt-6">
        <SidebarItem icon={<Home size={20} />} text="Apartment Management" to="/apartments" active />
        <SidebarItem icon={<FileText size={20} />} text="Invoice Management" to="/invoices" />
        <SidebarItem icon={<Settings size={20} />} text="Service Management" to="/services" />
        <SidebarItem icon={<Clipboard size={20} />} text="Contract Management" to="/contracts" />
        <SidebarItem icon={<Users size={20} />} text="Resident Management" to="/residents" />
        <SidebarItem icon={<DollarSign size={20} />} text="Finance Management" to="/finances" />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, text, to, active = false }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 text-gray-700 ${
      active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
    }`}
  >
    {icon}
    <span className="ml-3">{text}</span>
  </Link>
);

export default Sidebar;
