import React, { useState } from 'react';
import { Home, FileText, Settings, Users, DollarSign, Clipboard, ChevronDown, ChevronRight, Building, Key, UserCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [residentOpen, setResidentOpen] = useState(false);

  return (
    <div className="w-72 bg-white shadow-xl h-screen ">
      <nav className="mt-6 px-3">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Core Management
          </p>
          <div className="space-y-1">
            <SidebarItem 
              icon={<Building size={20} />} 
              text="Block Management" 
              subText="Manage buildings & facilities"
              to="/blocks" 
              active={location.pathname.startsWith('/blocks')} 
            />
            <SidebarItem 
              icon={<Users size={20} />} 
              text="User Management" 
              subText="Staff & access control"
              to="/users" 
              active={location.pathname.startsWith('/users')} 
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Resident Services
          </p>
          <div className="space-y-1">
            <div className="relative">
              <SidebarItem 
                icon={<Key size={20} />} 
                text="Resident Management" 
                subText="Handle resident information"
                active={residentOpen || location.pathname.startsWith('/residents')}
                onClick={() => setResidentOpen(!residentOpen)} 
                isParent
                suffix={residentOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              />
              {residentOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-4">
                  <SidebarItem 
                    icon={<UserCheck size={18} />} 
                    text="Owner Management" 
                    subText="Property owners"
                    to="/residents/owners" 
                    active={location.pathname.startsWith('/residents/owners')}
                    subItem 
                  />
                  <SidebarItem 
                    icon={<Users size={18} />} 
                    text="Renter Management" 
                    subText="Rental residents"
                    to="/residents/renters" 
                    active={location.pathname.startsWith('/residents/renters')}
                    subItem 
                  />
                  <SidebarItem 
                    icon={<DollarSign size={18} />} 
                    text="Household Management" 
                    subText="Financial records for households"
                    to="/residents/households" 
                    active={location.pathname.startsWith('/residents/households')}
                    subItem 
                  />
                </div>
              )}
            </div>
            <SidebarItem 
              icon={<FileText size={20} />} 
              text="Invoice Management" 
              subText="Manage billing & payments"
              to="/invoices" 
              active={location.pathname.startsWith('/invoices')} 
            />
            <SidebarItem 
              icon={<Clipboard size={20} />} 
              text="Contract Management" 
              subText="Lease & agreements"
              to="/contracts" 
              active={location.pathname.startsWith('/contracts')} 
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            System
          </p>
          <div className="space-y-1">
            <SidebarItem 
              icon={<Settings size={20} />} 
              text="Service Management" 
              subText="Maintenance & services"
              to="/services" 
              active={location.pathname.startsWith('/services')} 
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

const SidebarItem = ({ 
  icon, 
  text, 
  subText,
  to, 
  active = false, 
  onClick, 
  isParent = false,
  suffix,
  subItem = false
}) => {
  const baseClasses = "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ease-in-out";
  const activeClasses = active 
    ? "bg-blue-50 text-blue-600 font-medium" 
    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900";
  const subItemClasses = subItem ? "py-2" : "";
  
  const content = (
    <>
      <div className="flex items-center flex-1">
        <span className={`${active ? "text-blue-600" : "text-gray-400"} flex-shrink-0`}>
          {icon}
        </span>
        <div className="ml-3 flex-1">
          <span className={`block ${subItem ? "text-sm" : ""}`}>{text}</span>
          {subText && !subItem && (
            <span className="text-xs text-gray-500 mt-0.5 block">{subText}</span>
          )}
        </div>
      </div>
      {suffix && <span className={`ml-2 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`}>{suffix}</span>}
    </>
  );

  if (isParent || !to) {
    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} ${activeClasses} ${subItemClasses}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${activeClasses} ${subItemClasses}`}
    >
      {content}
    </Link>
  );
};

export default Sidebar;
