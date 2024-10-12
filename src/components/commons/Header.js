import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const nav = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    nav("/login", { replace: true });
  };

  return (
    <header className="w-full bg-blue-500 p-4 text-white flex justify-between">
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
