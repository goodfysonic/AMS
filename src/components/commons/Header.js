import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ setIsAuthenticated }) {
  const navigate = useNavigate();
  
  const logoutHandler = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="w-full p-4 text-white flex justify-between" style={{ backgroundColor: '#469FD1' }}>
      <h1 className="text-2xl">Apartment Management System</h1>
      <nav>
        <button className="px-4 py-2 bg-red-500 rounded-md" onClick={logoutHandler}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;
